// GameCowork 桌面壳（逆向重建的精简实现）
// 架构(依据 original cowork.exe 38 条 /api/tauri/* 路由与 core 双向 stdio 协议实测):
//   WebView2(wry) ── http://127.0.0.1:<动态端口>/  (静态: frontend dist)
//        └─ POST /api/tauri/invoke {messageType,data} → core stdin(JSON 行) → 按 messageId 等回执
//           GET  /api/tauri/events              SSE: core 主动消息广播
//           其余路由: 窗口控制/选目录/打开资源管理器等原生实现, 未实现的返回 404 JSON
//   core = gamecowork-runtime.exe(node 运行时改名) 跑还原源码 out/index.js
//   隔离: WEBVIEW2_USER_DATA_FOLDER 指向 GameCowork 专属目录, 不触碰 ~/.codely

use axum::{
    extract::State,
    http::StatusCode,
    response::{
        sse::{Event as SseEvent, KeepAlive, Sse},
        IntoResponse, Response,
    },
    routing::{any, get, post},
    Json, Router,
};
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    path::PathBuf,
    process::Stdio,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex as StdMutex, OnceLock,
    },
    time::Duration,
};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::{Child, Command},
    sync::{broadcast, mpsc, oneshot, Mutex as AMutex, RwLock},
};
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::StreamExt as _;
use tao::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::{ControlFlow, EventLoop, EventLoopProxy},
};
use uuid::Uuid;

#[derive(Clone)]
struct CoreHandle {
    stdin_tx: mpsc::UnboundedSender<String>,
    pending: Arc<AMutex<HashMap<String, oneshot::Sender<Value>>>>,
    events_tx: broadcast::Sender<String>,
    workspace: Arc<RwLock<Option<String>>>,
    proxy: EventLoopProxy<ShellEvent>,
}

#[derive(Debug, Clone, Copy)]
enum ShellEvent {
    MinimizeWindow,
    ToggleMaximize,
    FocusWindow,
}

static REQ_SEQ: AtomicU64 = AtomicU64::new(1);

fn now_id() -> String {
    format!("shell-{}-{}", REQ_SEQ.fetch_add(1, Ordering::Relaxed), Uuid::new_v4())
}

async fn handle_core_line(
    line: &str,
    pending: &Arc<AMutex<HashMap<String, oneshot::Sender<Value>>>>,
    events_tx: &broadcast::Sender<String>,
    ws: &Arc<RwLock<Option<String>>>,
    stdin_tx: &mpsc::UnboundedSender<String>,
) {
    let Ok(v) = serde_json::from_str::<Value>(line) else {
        eprintln!("[core-line] 非JSON: {}", &line[..line.len().min(120)]);
        return;
    };
    let mid = v.get("messageId").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let mtype = v.get("messageType").and_then(|x| x.as_str()).unwrap_or("").to_string();
    eprintln!("[core-line] type={} id={} pending={}", mtype, &mid[..mid.len().min(20)], pending.lock().await.len());
    let done = { let mut p = pending.lock().await; p.remove(&mid) };
    if let Some(tx) = done {
        let _ = tx.send(v);
        return;
    }
    if mtype == "getWorkspaceDirs" {
        let dir = ws.read().await.clone();
        let content = dir.map(|d| vec![d]).unwrap_or_default();
        let reply = json!({
            "messageType": "getWorkspaceDirs",
            "messageId": mid,
            "data": {"done": true, "status": "success", "content": content}
        });
        let _ = stdin_tx.send(reply.to_string());
        return;
    }
    let _ = events_tx.send(line.to_string());
}

async fn spawn_core(
    core_dir: PathBuf,
    workspace: Arc<RwLock<Option<String>>>,
    proxy: EventLoopProxy<ShellEvent>,
) -> (CoreHandle, Child) {
    let runtime = core_dir.join("gamecowork-runtime.exe");
    let runtime = if runtime.exists() { runtime } else { PathBuf::from("node.exe") };
    println!("[shell] 启动 core: {} (cwd={})", runtime.display(), core_dir.display());

    let mut cmd = Command::new(&runtime);
    cmd.arg("index.js")
        .current_dir(&core_dir)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null());
    if let Ok(exe_dir) = std::env::current_exe() {
        let cli = exe_dir.parent().unwrap().join("cli").join("gamecowork.exe");
        if cli.exists() {
            cmd.env("GAMECOWORK_CLI_PATH", &cli);
            println!("[shell] GAMECOWORK_CLI_PATH={}", cli.display());
        }
    }
    let mut child: Child = cmd.spawn().expect("无法启动 core");

    let (stdin_tx, mut stdin_rx) = mpsc::unbounded_channel::<String>();
    let (events_tx, _) = broadcast::channel::<String>(512);
    let pending: Arc<AMutex<HashMap<String, oneshot::Sender<Value>>>> = Arc::default();

    let mut stdin = child.stdin.take().expect("core stdin");
    tokio::spawn(async move {
        while let Some(line) = stdin_rx.recv().await {
            eprintln!("[stdin→core] {}", &line[..line.len().min(110)]);
            // core 的 stdin 分帧按 \r 系(python text 模式写 \r\n 实测可通; 纯 \n 无效)
            if stdin.write_all(line.as_bytes()).await.is_err() { eprintln!("[stdin→core] 写失败"); break; }
            if stdin.write_all(b"\r\n").await.is_err() { eprintln!("[stdin→core] 写帧尾失败"); break; }
            let _ = stdin.flush().await;
        }
    });

    let stdout = child.stdout.take().expect("core stdout");
    let pending2 = pending.clone();
    let events_tx2 = events_tx.clone();
    let ws2 = workspace.clone();
    let stdin_tx2 = stdin_tx.clone();
    tokio::spawn(async move {
        // core 的 stdout 帧是 \r 结尾(带尾随空格), 不能用 lines()(只认 \n)
        use tokio::io::AsyncReadExt;
        let mut buf: Vec<u8> = Vec::new();
        let mut chunk = [0u8; 8192];
        let mut stdout = stdout;
        loop {
            let n = match stdout.read(&mut chunk).await {
                Ok(0) => break,
                Ok(n) => n,
                Err(_) => break,
            };
            buf.extend_from_slice(&chunk[..n]);
            // 按帧分隔符切分: \r 或 \n
            while let Some(pos) = buf.iter().position(|&b| b == b'\r' || b == b'\n') {
                let frame: Vec<u8> = buf.drain(..=pos).collect();
                let s = String::from_utf8_lossy(&frame[..frame.len() - 1]).trim().to_string();
                if s.is_empty() { continue; }
                handle_core_line(&s, &pending2, &events_tx2, &ws2, &stdin_tx2).await;
            }
        }
        println!("[shell] core stdout 已结束");
    });

    let handle = CoreHandle { stdin_tx, pending, events_tx, workspace, proxy };
    (handle, child)
}

// 经 pending 机制向 core 发请求, 返回 reply.data.content
async fn core_call(core: &CoreHandle, mtype: &str, data: Value) -> Option<Value> {
    let mut msg = json!({"messageType": mtype, "data": data});
    let id = now_id();
    msg["messageId"] = json!(id);
    let (tx, rx) = oneshot::channel::<Value>();
    core.pending.lock().await.insert(id.clone(), tx);
    if core.stdin_tx.send(msg.to_string()).is_err() {
        core.pending.lock().await.remove(&id);
        return None;
    }
    match tokio::time::timeout(Duration::from_secs(30), rx).await {
        Ok(Ok(reply)) => Some(reply["data"]["content"].clone()),
        _ => None,
    }
}

fn basename(p: &str) -> String {
    p.trim_end_matches(['/', '\\'])
        .rsplit(['/', '\\'])
        .next()
        .unwrap_or(p)
        .to_string()
}

// tjhub/* 壳属消息: 用 unity/getHubProjectsAndEditors 的真机数据整形回填
async fn tjhub_intercept(core: &CoreHandle, mtype: &str) -> Option<Response> {
    match mtype {
        "tjhub/getRecentProjects" => {
            let content = core_call(core, "unity/getHubProjectsAndEditors", json!({})).await?;
            let mut out = Vec::new();
            if let Some(products) = content.as_array() {
                for prod in products {
                    if let Some(projects) = prod.get("projects").and_then(|x| x.as_array()) {
                        for p in projects {
                            let path = p.get("path").and_then(|x| x.as_str()).unwrap_or("").to_string();
                            out.push(json!({
                                "localProjectId": path,
                                "title": basename(&path),
                                "path": path,
                                "lastModified": p.get("last_modified_display").cloned().unwrap_or(json!("")),
                                "lastModifiedDisplay": p.get("last_modified_display").cloned().unwrap_or(json!("")),
                                "version": p.get("editor_version").cloned().unwrap_or(json!("")),
                                "editorVersion": p.get("editor_version").cloned().unwrap_or(json!("")),
                                "architecture": "x64",
                                "isRemote": false,
                            }));
                        }
                    }
                }
            }
            Some(Json(json!({
                "messageType": mtype,
                "data": {"done": true, "status": "success", "content": out},
                "messageId": null
            })).into_response())
        }
        "tjhub/getEditors" => {
            let content = core_call(core, "unity/getHubProjectsAndEditors", json!({})).await?;
            let mut map = serde_json::Map::new();
            if let Some(products) = content.as_array() {
                for prod in products {
                    if let Some(editors) = prod.get("editors").and_then(|x| x.as_array()) {
                        for e in editors {
                            let ver = e.get("version").and_then(|x| x.as_str()).unwrap_or("").to_string();
                            if ver.is_empty() { continue; }
                            map.insert(ver.clone(), json!({
                                "version": ver,
                                "path": e.get("path").cloned().unwrap_or(json!("")),
                                "architecture": "x64",
                                "overallStatus": "INSTALL_FINISHED",
                                "isDownloadCorrupted": false,
                            }));
                        }
                    }
                }
            }
            Some(Json(json!({
                "messageType": mtype,
                "data": {"done": true, "status": "success", "content": map},
                "messageId": null
            })).into_response())
        }
        "tjhub/getLicenses" => Some(Json(json!({
            "messageType": mtype,
            "data": {"done": true, "status": "success", "content": {"isValid": true, "licenses": []}},
            "messageId": null
        })).into_response()),
        "tjhub/getTemplates" | "tjhub/getModules" => Some(Json(json!({
            "messageType": mtype,
            "data": {"done": true, "status": "success", "content": []},
            "messageId": null
        })).into_response()),
        "tjhub/getUserInfo" => Some(Json(json!({
            "messageType": mtype,
            "data": {"done": true, "status": "success", "content": {
                "id": "gamecowork-demo", "label": "GameCowork Demo User",
                "name": "GameCowork Demo User", "email": "gamecowork-demo@local"
            }},
            "messageId": null
        })).into_response()),
        _ => None,
    }
}

fn build_router(core: CoreHandle, dist_dir: PathBuf) -> Router {
    let c1 = core.clone();
    let invoke = post(move |Json(body): Json<Value>| {
        let core = c1.clone();
        async move {
            // pet.html 等窗口的消息嵌在 {message:{...}} 里
            let body = if body.get("messageType").is_none() {
                body.get("message").cloned().unwrap_or(body)
            } else {
                body
            };
            let mtype = body.get("messageType").and_then(|x| x.as_str()).unwrap_or("").to_string();
            if mtype.is_empty() {
                return (StatusCode::BAD_REQUEST, Json(json!({"error": "messageType required"}))).into_response();
            }
            // 壳本地处理的演示消息(原版由 Rust 壳持有, core 无 handler):
            // 登录态/IDE 信息/TJHub 状态 —— 不转发 core, 直接合成成功应答
            let mid_v = body.get("messageId").cloned().unwrap_or(json!(null));
            let shell_reply = |content: Value| {
                Json(json!({
                    "messageType": mtype,
                    "data": {"done": true, "status": "success", "content": content},
                    "messageId": mid_v
                })).into_response()
            };
            match mtype.as_str() {
                "get_cowork_access_token" => {
                    return shell_reply(json!("gamecowork-demo-access-token"));
                }
                "getControlPlaneSessionInfo" => {
                    return shell_reply(json!({
                        "accessToken": "gamecowork-demo-access-token",
                        "account": {"id": "gamecowork-demo", "label": "GameCowork Demo User"},
                        "organizations": [],
                        "selectedOrganizationId": "personal"
                    }));
                }
                "getIdeInfo" => {
                    return shell_reply(json!({
                        "extensionVersion": "2.1.3-canary.2",
                        "ideType": "gamecowork-desktop",
                        "name": "GameCowork"
                    }));
                }
                "editor/getEmbedMode" => return shell_reply(json!({"embed_mode": false})),
                "editor/getSidechat" => return shell_reply(json!({"sidechat": false})),
                "tjhub/getStatus" => return shell_reply(json!({"state": "active"})),
                "tjhub/getPendingDeepLink" => return shell_reply(json!(null)),
                "tjhub/getPendingIpcPassthrough" => return shell_reply(json!(null)),
                "tauri/listRemoteWorkspaces" => return shell_reply(json!([])),
                "controlPlane/getActivityNotifications" => return shell_reply(json!([])),
                "versionUpdate/getSeenFeatures" => return shell_reply(json!([])),
                _ => {}
            }
            // tjhub/* 数据面: 从 core 真机数据整形
            if let Some(resp) = tjhub_intercept(&core, &mtype).await {
                return resp;
            }
            let mut msg = body.clone();
            let id = now_id();
            msg["messageId"] = json!(id);
            let (tx, rx) = oneshot::channel::<Value>();
            core.pending.lock().await.insert(id.clone(), tx);
            eprintln!("[invoke] {} 已入队 id={}", mtype, &id[..id.len().min(20)]);
            let sent = core.stdin_tx.send(msg.to_string());
            eprintln!("[invoke] send 结果: {}", sent.is_ok());
            if core.stdin_tx.send(msg.to_string()).is_err() {
                core.pending.lock().await.remove(&id);
                return (StatusCode::BAD_GATEWAY, Json(json!({"error": "core not running"}))).into_response();
            }
            match tokio::time::timeout(Duration::from_secs(180), rx).await {
                Ok(Ok(reply)) => Json(reply).into_response(),
                Ok(Err(_)) => (StatusCode::BAD_GATEWAY, Json(json!({"error": "core dropped"}))).into_response(),
                Err(_) => {
                    core.pending.lock().await.remove(&id);
                    (StatusCode::GATEWAY_TIMEOUT, Json(json!({"error": "core timeout"}))).into_response()
                }
            }
        }
    });

    let events = {
        let core = core.clone();
        get(move || {
            let core = core.clone();
            async move {
                let rx = core.events_tx.subscribe();
                let stream = BroadcastStream::new(rx).map(|x| match x {
                    Ok(line) => Ok::<_, std::convert::Infallible>(SseEvent::default().data(line)),
                    Err(_) => Ok::<_, std::convert::Infallible>(SseEvent::default().data("{\"error\":\"lagged\"}")),
                });
                Sse::new(stream).keep_alive(KeepAlive::default())
            }
        })
    };

    let status = get(|| async {
        Json(json!({"status": "ok", "embed_mode": false, "product": "GameCowork", "version": "2.1.3-canary.2"}))
    });

    let workspace_dir = {
        let core = core.clone();
        get(move || {
            let core = core.clone();
            async move { Json(json!({"dir": core.workspace.read().await.clone()})) }
        })
    };

    let pick_folder = post(|| async {
        if let Some(p) = rfd::FileDialog::new().pick_folder() {
            Json(json!({"path": p.display().to_string()})).into_response()
        } else {
            Json(json!({"path": null})).into_response()
        }
    });

    let reveal = post(|Json(body): Json<Value>| async move {
        let p = body.get("path").and_then(|x| x.as_str()).unwrap_or("");
        if !p.is_empty() {
            let _ = std::process::Command::new("explorer").arg(format!("/select,{}", p)).spawn();
        }
        Json(json!({"ok": true}))
    });

    let open_workspace = {
        let core = core.clone();
        post(move |Json(body): Json<Value>| {
            let core = core.clone();
            async move {
                let p = body.get("path").and_then(|x| x.as_str()).unwrap_or("").to_string();
                if !p.is_empty() {
                    *core.workspace.write().await = Some(p.clone());
                    // 持久化, 下次启动经 window.workspacePaths 注入
                    if let Ok(exe_dir) = std::env::current_exe() {
                        let _ = std::fs::write(exe_dir.parent().unwrap().join("workspace.txt"), &p);
                    }
                }
                Json(json!({"ok": true})).into_response()
            }
        })
    };

    let c2 = core.clone();
    let win_route = move |ev: ShellEvent| {
        let core = c2.clone();
        post(move || {
            let core = core.clone();
            let ev = ev.clone_for_route();
            async move {
                let _ = core.proxy.send_event(ev);
                Json(json!({"ok": true}))
            }
        })
    };

    let api404 = any(|| async {
        (StatusCode::NOT_FOUND, Json(json!({"error": "not implemented in demo shell"}))).into_response()
    });

    let serve = tower_http::services::ServeDir::new(&dist_dir)
        .append_index_html_on_directories(true);

    Router::new()
        .route("/api/tauri/invoke", invoke)
        .route("/api/tauri/events", events)
        .route("/api/tauri/status", status)
        .route("/api/tauri/workspace-dir", workspace_dir)
        .route("/api/tauri/pick-folder", pick_folder.clone())
        .route("/api/tauri/pick-folder-modal", pick_folder)
        .route("/api/tauri/reveal-in-file-explorer", reveal)
        .route("/api/tauri/hub/open-workspace", open_workspace)
        .route("/api/tauri/hub/close-workspace", post(|| async { Json(json!({"ok": true})) }))
        .route("/api/tauri/minimize-window", win_route(ShellEvent::MinimizeWindow))
        .route("/api/tauri/toggle-maximize-window", win_route(ShellEvent::ToggleMaximize))
        .route("/api/tauri/focus-window", win_route(ShellEvent::FocusWindow))
        .route("/api/tauri/*rest", api404)
        .fallback_service(serve)
        .with_state(())
}

// ShellEvent 是 Copy, 路由直接复用
impl ShellEvent {
    fn clone_for_route(&self) -> Self { *self }
}

static START_URL: OnceLock<String> = OnceLock::new();

fn main() {
    // WebView2 用户数据目录隔离(必须在 webview 初始化前设置)
    if let Ok(appdata) = std::env::var("LOCALAPPDATA") {
        let wud = PathBuf::from(appdata).join("GameCowork").join("WebView2");
        let _ = std::fs::create_dir_all(&wud);
        std::env::set_var("WEBVIEW2_USER_DATA_FOLDER", &wud);
    }

    let (_root, dist_dir, core_dir) = find_dirs();

    let event_loop = tao::event_loop::EventLoopBuilder::<ShellEvent>::with_user_event().build();
    let proxy = event_loop.create_proxy();
    let proxy2 = event_loop.create_proxy();

    let runtime = tokio::runtime::Builder::new_multi_thread().enable_all().build().unwrap();
    let _guard = runtime.enter();

    let dist2 = dist_dir.clone();
    runtime.spawn(async move {
        let workspace: Arc<RwLock<Option<String>>> = Arc::default();
        let (core, mut child) = spawn_core(core_dir.clone(), workspace.clone(), proxy2).await;
        // core 退出 → 壳退出
        tokio::spawn(async move {
            let _ = child.wait().await;
            println!("[shell] core 进程退出, 壳随之退出");
            std::process::exit(1);
        });
        let app = build_router(core, dist2);
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.expect("bind");
        let addr = listener.local_addr().unwrap();
        println!("[shell] HTTP: http://{}/", addr);
        let _ = START_URL.set(format!("http://{}/", addr));
        axum::serve(listener, app).await.unwrap();
    });

    // 等 HTTP 就绪再建 WebView(拿端口)
    let url = loop {
        if let Some(u) = START_URL.get() { break u.clone(); }
        std::thread::sleep(Duration::from_millis(50));
    };
    println!("[shell] WebView → {}", url);

    // 原版壳机制: 初始化脚本注入工作区与媒体路径(没有 workspacePaths 前端停在欢迎页)
    let ws_file = _root.join("workspace.txt");
    let ws_path = std::fs::read_to_string(&ws_file).unwrap_or_default();
    let ws_path = ws_path.trim().to_string();
    let ws_json = if ws_path.is_empty() {
        "[]".to_string()
    } else {
        serde_json::to_string(&vec![ws_path]).unwrap()
    };
    println!("[shell] workspacePaths = {}", ws_json);
    let init_js = format!(
        "window.vscMediaUrl = ''; window.workspacePaths = {}; window.GAMECOWORK_SHELL = true;",
        ws_json
    );

    let window = tao::window::WindowBuilder::new()
        .with_title("GameCowork")
        .with_inner_size(LogicalSize::new(1440.0, 900.0))
        .build(&event_loop)
        .expect("window");

    let webview = wry::WebViewBuilder::new(&window)
        .with_url(&url)
        .with_initialization_script(&init_js)
        .build()
        .expect("webview");
    let _ = &webview;

    let w = window;
    event_loop.run(move |event, _target, control_flow| {
        *control_flow = ControlFlow::Wait;
        match event {
            Event::UserEvent(ev) => match ev {
                ShellEvent::MinimizeWindow => w.set_minimized(true),
                ShellEvent::FocusWindow => {
                    w.set_focus();
                    *control_flow = ControlFlow::Poll;
                }
                ShellEvent::ToggleMaximize => w.set_maximized(!w.is_maximized()),
            },
            Event::WindowEvent { event: WindowEvent::CloseRequested, .. } => {
                *control_flow = ControlFlow::Exit;
            }
            _ => {}
        }
    });
}

fn find_dirs() -> (PathBuf, PathBuf, PathBuf) {
    let exe = std::env::current_exe().expect("exe path");
    let root = exe.parent().unwrap().to_path_buf();
    let dist = root.join("frontend");
    let core = root.join("core");
    (root, dist, core)
}
