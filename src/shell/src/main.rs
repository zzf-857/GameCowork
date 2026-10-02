// GameCowork local desktop host. HTTP, core stdio and workspace state share one contract.
mod codely_canvas;
mod codely_http;
mod editor_bridge;
mod editor_installations;
mod editor_installations_cache;
mod editor_licensing;
mod file_events;
mod files;
mod generated_assets;
mod git;
mod insight;
mod keep_awake;
mod lsp;
mod mutations;
mod native_window;
mod process_lifetime;
mod project_templates;
mod single_instance;
mod stream_layout;
mod terminals;
mod transport;
mod workspaces;

use axum::{
    extract::{ws::WebSocketUpgrade, Path as RoutePath, Query, State},
    http::{HeaderMap, StatusCode},
    response::{
        sse::{Event as SseEvent, KeepAlive, Sse},
        IntoResponse, Response,
    },
    routing::{any, get, post},
    Json, Router,
};
use futures::StreamExt;
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    path::PathBuf,
    process::Stdio,
    sync::{Arc, Mutex as StdMutex, OnceLock},
    time::{Duration, Instant},
};
use tao::{
    dpi::LogicalSize,
    event::{Event, WindowEvent},
    event_loop::{ControlFlow, EventLoopProxy},
};
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    process::{Child, Command},
    sync::{broadcast, mpsc, Mutex},
};
use tokio_stream::wrappers::BroadcastStream;
use transport::CoreTransport;
use workspaces::{Store, Workspace};

#[derive(Debug)]
enum ShellEvent {
    WindowState(tokio::sync::oneshot::Sender<Value>),
    StartDragging,
    MinimizeWindow,
    ToggleMaximize,
    FocusWindow,
    ActivateWindow(tokio::sync::oneshot::Sender<Value>),
    CloseWindow,
}

#[derive(Clone)]
struct CoreHandle {
    transport: CoreTransport,
    stdin_tx: mpsc::UnboundedSender<String>,
    events_tx: broadcast::Sender<String>,
    store: Arc<Mutex<Store>>,
    lifecycle: Arc<Mutex<()>>,
    hub_cache: Arc<Mutex<Option<(Instant, Value)>>>,
    editor_cache: editor_installations_cache::InstallationCache,
    codely_canvas: codely_canvas::LocalCanvasService,
    host_pending: Arc<StdMutex<HashMap<String, (String, Option<String>)>>>,
    host_finished: Arc<StdMutex<HashMap<String, (String, Instant)>>>,
    local_settings: Arc<Mutex<()>>,
    keep_awake: keep_awake::KeepAwake,
    project_creations: Arc<StdMutex<HashMap<String, Arc<std::sync::atomic::AtomicU8>>>>,
    insight: insight::InsightService,
    lsp: Option<lsp::LspService>,
    lsp_failure: Option<lsp::LspError>,
    lsp_handles: Arc<Mutex<HashMap<String, lsp::WorkspaceHandle>>>,
    lsp_requests: Arc<StdMutex<HashMap<String, (String, tokio::sync::oneshot::Sender<()>)>>>,
    terminals: Arc<StdMutex<HashMap<String, (String, terminals::TerminalControl)>>>,
    paths: Arc<RuntimePaths>,
    proxy: Option<EventLoopProxy<ShellEvent>>,
    _process_lifetime: process_lifetime::ProcessLifetime,
}

#[derive(Clone)]
struct RuntimePaths {
    instance: Option<Arc<single_instance::SingleInstance>>,
    root: PathBuf,
    frontend: PathBuf,
    core: PathBuf,
    entry: PathBuf,
    data: PathBuf,
    core_home: PathBuf,
    cli_home: PathBuf,
    agent_path: Option<PathBuf>,
    agent_resources: PathBuf,
    lsp_root: PathBuf,
    home_workspace: PathBuf,
    headless: bool,
    test_mode: bool,
}

impl RuntimePaths {
    fn load() -> Result<Self, String> {
        let root = std::env::var_os("GAMECOWORK_APP_ROOT")
            .map(PathBuf::from)
            .unwrap_or_else(|| {
                std::env::current_exe()
                    .unwrap()
                    .parent()
                    .unwrap()
                    .to_path_buf()
            });
        let isolated = std::env::var_os("GAMECOWORK_DATA_DIR").map(PathBuf::from);
        let data = isolated.clone().unwrap_or_else(|| {
            PathBuf::from(
                std::env::var_os("LOCALAPPDATA").unwrap_or_else(|| root.clone().into_os_string()),
            )
            .join("GameCowork")
        });
        let user_home = PathBuf::from(
            std::env::var_os("USERPROFILE").unwrap_or_else(|| data.clone().into_os_string()),
        );
        let core_home = if isolated.is_some() {
            data.join("core-state")
        } else {
            user_home.join(".gamecowork")
        };
        let cli_home = if isolated.is_some() {
            data.join("cli-state")
        } else {
            user_home.join(".gamecowork-cli")
        };
        let home_workspace = data.join("Workspace");
        for dir in [&data, &core_home, &cli_home, &home_workspace] {
            std::fs::create_dir_all(dir)
                .map_err(|e| format!("Cannot create application data: {e}"))?;
        }
        let core = std::env::var_os("GAMECOWORK_CORE_DIR")
            .map(PathBuf::from)
            .unwrap_or_else(|| root.join("core"));
        let frontend = std::env::var_os("GAMECOWORK_FRONTEND_DIR")
            .map(PathBuf::from)
            .unwrap_or_else(|| root.join("frontend"));
        let entry = std::env::var_os("GAMECOWORK_CORE_ENTRY")
            .map(PathBuf::from)
            .unwrap_or_else(|| core.join("index.js"));
        let agent_override = std::env::var_os("GAMECOWORK_AGENT_PATH").map(PathBuf::from);
        if let Some(agent) = &agent_override {
            if !agent.is_absolute() || !agent.is_file() {
                return Err(
                    "GAMECOWORK_AGENT_PATH must name an existing absolute Agent executable".into(),
                );
            }
        }
        let default_agent = root.join("cli").join("gamecowork.exe");
        let agent_path =
            agent_override.or_else(|| default_agent.is_file().then_some(default_agent));
        let agent_resources = std::env::var_os("GAMECOWORK_AGENT_RESOURCE_DIR")
            .map(PathBuf::from)
            .unwrap_or_else(|| root.join("cli").join("resources"));
        let lsp_root = std::env::var_os("GAMECOWORK_LSP_DIR")
            .map(PathBuf::from)
            .unwrap_or_else(|| root.join("lsp-csharp"));
        Ok(Self {
            instance: None,
            root,
            frontend,
            core,
            entry,
            data,
            core_home,
            cli_home,
            agent_path,
            agent_resources,
            lsp_root,
            home_workspace,
            headless: std::env::var("GAMECOWORK_HEADLESS").as_deref() == Ok("1"),
            test_mode: std::env::var("GAMECOWORK_TEST_MODE").as_deref() == Ok("1"),
        })
    }
}

fn reply(mtype: &str, id: &Value, content: Value) -> Value {
    json!({"messageType":mtype,"messageId":id,"data":{"done":true,"status":"success","content":content}})
}
fn error_reply(mtype: &str, id: &Value, error: impl ToString) -> Value {
    json!({"messageType":mtype,"messageId":id,"data":{"done":true,"status":"error","error":error.to_string()}})
}
fn local_session() -> Value {
    // Local UI identity only; never sent to an editor or an external authentication service.
    json!({"accessToken":"gamecowork-local-session","account":{"id":"gamecowork-local",
        "label":"GameCowork 本地用户"},"organizations":[],"selectedOrganizationId":"personal","mode":"local"})
}
fn ide_info() -> Value {
    json!({"extensionVersion":env!("CARGO_PKG_VERSION"),"ideType":"gamecowork-desktop",
        "name":"GameCowork","remoteName":"","isRemote":false})
}
fn ide_settings() -> Value {
    json!({"enableTelemetry":false,"pauseCodebaseIndexOnStart":true,
        "continueTestEnvironment":"none","userToken":"","remoteConfigServerUrl":null,
        "enableControlServerBeta":false})
}
fn is_approval(kind: &str) -> bool {
    matches!(
        kind,
        "acp/requestPermission" | "acp/requestShellConfirmation"
    )
}
fn remember_host_reply(core: &CoreHandle, id: &str, kind: &str) {
    let mut finished = core.host_finished.lock().unwrap();
    finished.retain(|_, (_, at)| at.elapsed() < Duration::from_secs(120));
    if finished.len() >= 128 {
        if let Some(oldest) = finished
            .iter()
            .min_by_key(|(_, (_, at))| *at)
            .map(|(id, _)| id.clone())
        {
            finished.remove(&oldest);
        }
    }
    finished.insert(id.to_owned(), (kind.to_owned(), Instant::now()));
}
fn path_from_uri(s: &str) -> PathBuf {
    let s = s
        .strip_prefix("file:///")
        .or_else(|| s.strip_prefix("file://"))
        .unwrap_or(s);
    let mut bytes = Vec::new();
    let mut i = 0;
    while i < s.len() {
        if s.as_bytes()[i] == b'%' && i + 2 < s.len() {
            if let Some(b) = std::str::from_utf8(&s.as_bytes()[i + 1..i + 3])
                .ok()
                .and_then(|hex| u8::from_str_radix(hex, 16).ok())
            {
                bytes.push(b);
                i += 3;
                continue;
            }
        }
        bytes.push(s.as_bytes()[i]);
        i += 1;
    }
    PathBuf::from(String::from_utf8_lossy(&bytes).to_string())
}

async fn launch_detached_editor(core: &CoreHandle, frame: &Value) -> Value {
    let editor = path_from_uri(frame["data"]["editorPath"].as_str().unwrap_or(""));
    let project = path_from_uri(frame["data"]["projectPath"].as_str().unwrap_or(""));
    let valid_project = project.canonicalize().ok();
    let expected_root = workspace_root(core, frame["workspaceId"].as_str())
        .await
        .ok()
        .and_then(|p| PathBuf::from(p).canonicalize().ok());
    if !editor.is_absolute()
        || !editor.is_file()
        || !project.is_absolute()
        || valid_project.is_none()
        || valid_project != expected_root
    {
        return json!({"success":false,"message":"Editor path or workspace is invalid"});
    }
    let mut command = std::process::Command::new(&editor);
    command
        .arg("-projectPath")
        .arg(&project)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        // The host is outside the core Job. Create an independent process group,
        // without opening a console; Unity's own GUI remains visible.
        command.creation_flags(0x00000200 | 0x08000000);
    }
    match command.spawn() {
        Ok(child) => {
            json!({"success":true,"pid":child.id(),"message":"Editor launched independently"})
        }
        Err(error) => json!({"success":false,"message":format!("Cannot launch editor: {error}")}),
    }
}

async fn workspace_root(core: &CoreHandle, id: Option<&str>) -> Result<String, String> {
    if id == Some("default") {
        return Ok(core.paths.home_workspace.to_string_lossy().into_owned());
    }
    let store = core.store.lock().await;
    if let Some(id) = id {
        return store
            .lookup(id)
            .map(|w| w.workspace_dir)
            .ok_or_else(|| format!("Unknown workspace: {id}"));
    }
    Ok(store
        .active()
        .map(|w| w.workspace_dir)
        .unwrap_or_else(|| core.paths.home_workspace.to_string_lossy().into_owned()))
}

async fn host_response(core: &CoreHandle, frame: &Value) -> Value {
    let kind = frame["messageType"].as_str().unwrap_or("");
    let data = &frame["data"];
    let root = workspace_root(core, frame["workspaceId"].as_str()).await;
    match kind {
        "getWorkspaceDirs" => root.map(|p| json!([p])).unwrap_or(json!([])),
        "getProjectRoot" => root.map(Value::String).unwrap_or(Value::Null),
        "getIdeInfo" => ide_info(),
        "getIdeSettings" => ide_settings(),
        "getControlPlaneSessionInfo" => Value::Null,
        "isTelemetryEnabled" | "isWorkspaceRemote" => json!(false),
        "getUniqueId" => json!("gamecowork-local"),
        "launchDetachedEditor" => launch_detached_editor(core, frame).await,
        "getOpenFiles" | "getPinnedFiles" | "getAllPromptFiles" | "getProblems" => json!([]),
        "getCurrentFile" | "getCursorPosition" => Value::Null,
        "getTerminalContents" | "getBuildContents" | "getDebugContents" | "getRunContents" => {
            json!("")
        }
        "getBranch" | "getGitBranches" | "getChangedFiles" | "applyGitFileAction"
        | "switchGitBranch" | "getFileAtHead" | "getFileAtIndex" | "getDiff" => {
            host_git_response(core, frame).await
        }
        "getRepoName" => data["dir"]
            .as_str()
            .map(|p| json!(basename(p)))
            .unwrap_or(Value::Null),
        "fileExists"
        | "readFile"
        | "readRangeInFile"
        | "listDir"
        | "getFileStats"
        | "findGitRepositories"
        | "getGitRootPath" => host_file_response(core, frame).await,
        "writeFile" | "deleteFile" | "mkdir" => host_mutation_response(core, frame).await,
        "showToast" | "logoutOfControlPlane" => Value::Null,
        "readSecrets" => json!({}),
        _ => host_error(
            json!({"error":format!("Host operation not implemented: {kind}"),"code":"host_not_implemented"}),
        ),
    }
}

fn host_error(error: Value) -> Value {
    json!({"__gamecoworkHostError":{"code":error.get("code").cloned().unwrap_or(json!("HOST_ERROR")),
        "message":error["error"].as_str().unwrap_or("Host operation failed"),"details":error.get("details").cloned().unwrap_or(Value::Null)}})
}

async fn host_git_response(core: &CoreHandle, frame: &Value) -> Value {
    let id = frame["workspaceId"].as_str().unwrap_or("default");
    // Serialize selected-workspace Git requests with workspace close/switch and
    // with one another so asynchronous UI refreshes cannot race a file action.
    let _guard = core.lifecycle.lock().await;
    if id != "default"
        && !core
            .store
            .lock()
            .await
            .opened()
            .iter()
            .any(|w| w.workspace_key == id)
    {
        return host_error(
            json!({"error":"Workspace is no longer open","code":"workspace_closed"}),
        );
    }
    let root = match workspace_root(core, Some(id)).await {
        Ok(root) => PathBuf::from(root),
        Err(error) => return host_error(json!({"error":error,"code":"workspace_closed"})),
    };
    match git::request(
        root,
        core.paths.data.join("git-discard-backups"),
        frame["messageType"].as_str().unwrap_or(""),
        &frame["data"],
    )
    .await
    {
        Ok(value) if value["ok"] == false => {
            host_error(json!({"error":value["error"],"code":"git_discard_failed","details":value}))
        }
        Ok(value) => value,
        Err(error) => host_error(json!({"error":error,"code":"git_operation_failed"})),
    }
}
fn lsp_root_key(root: &std::path::Path) -> String {
    root.to_string_lossy()
        .trim_start_matches(r"\\?\")
        .replace('\\', "/")
        .trim_end_matches('/')
        .to_lowercase()
}
async fn lsp_preference(
    core: &CoreHandle,
    root: &std::path::Path,
    value: Option<bool>,
) -> Result<bool, String> {
    let _guard = core.local_settings.lock().await;
    let path = core.paths.data.join("lsp-preferences.json");
    let mut preferences = match std::fs::read(&path) {
        Ok(bytes) if bytes.len() <= 128 * 1024 => {
            serde_json::from_slice::<Value>(&bytes).map_err(|e| e.to_string())?
        }
        Ok(_) => return Err("C# preferences exceed the local size limit".into()),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            json!({"version":1,"enabled":{}})
        }
        Err(error) => return Err(error.to_string()),
    };
    if preferences["version"] != 1 || !preferences["enabled"].is_object() {
        return Err("Invalid local C# preferences".into());
    }
    let key = lsp_root_key(root);
    if let Some(value) = value {
        preferences["enabled"][&key] = json!(value);
        workspaces::write_json_atomic(&path, &preferences)?;
    }
    Ok(preferences["enabled"][key].as_bool().unwrap_or(false))
}
async fn register_lsp_workspace(core: &CoreHandle, key: &str, root: &std::path::Path) {
    if let Some(service) = &core.lsp {
        if let Ok(handle) = service.open_workspace(root).await {
            if let Ok(enabled) = lsp_preference(core, root, None).await {
                let _ = service.restore_enabled(&handle, enabled).await;
            }
            core.lsp_handles.lock().await.insert(key.to_owned(), handle);
        }
    }
}
async fn close_lsp_workspace(core: &CoreHandle, key: &str, root: &std::path::Path) {
    core.lsp_handles.lock().await.remove(key);
    let cancelled = {
        let mut pending = core.lsp_requests.lock().unwrap();
        let ids = pending
            .iter()
            .filter(|(_, (owner, _))| owner == key)
            .map(|(id, _)| id.clone())
            .collect::<Vec<_>>();
        ids.into_iter()
            .filter_map(|id| pending.remove(&id).map(|(_, sender)| sender))
            .collect::<Vec<_>>()
    };
    for sender in cancelled {
        let _ = sender.send(());
    }
    if let Some(service) = &core.lsp {
        if let Ok(handle) = service.workspace(root).await {
            let _ = service.close_workspace(&handle).await;
        }
    }
}
async fn native_lsp(
    core: &CoreHandle,
    workspace: &str,
    kind: &str,
    data: &Value,
) -> Result<Value, lsp::LspError> {
    let failure = |code, message: String| lsp::LspError { code, message };
    let service = match core.lsp.as_ref() {
        Some(service) => service,
        None => {
            let error = core.lsp_failure.clone().unwrap_or_else(|| {
                failure(
                    "lsp_runtime_missing",
                    "Local C# runtime is unavailable".into(),
                )
            });
            if matches!(kind, "lsp/status" | "lsp/isServerInstalled") {
                let _guard = core.lifecycle.lock().await;
                if workspace != "default"
                    && !core
                        .store
                        .lock()
                        .await
                        .opened()
                        .iter()
                        .any(|w| w.workspace_key == workspace)
                {
                    return Err(failure(
                        "lsp_workspace_closed",
                        "The C# workspace is no longer open".into(),
                    ));
                }
                let mut value = lsp::unavailable_status(&error);
                value["workspaceKey"] = json!(workspace);
                if kind == "lsp/isServerInstalled" {
                    value["installed"] = json!(false);
                }
                return Ok(value);
            }
            return Err(error);
        }
    };
    let (handle, root) = {
        let _guard = core.lifecycle.lock().await;
        if workspace != "default"
            && !core
                .store
                .lock()
                .await
                .opened()
                .iter()
                .any(|w| w.workspace_key == workspace)
        {
            return Err(failure(
                "lsp_workspace_closed",
                "The C# workspace is no longer open".into(),
            ));
        }
        let root = PathBuf::from(
            workspace_root(core, Some(workspace))
                .await
                .map_err(|e| failure("lsp_workspace_closed", e))?,
        );
        let handle = core
            .lsp_handles
            .lock()
            .await
            .get(workspace)
            .cloned()
            .ok_or_else(|| {
                failure(
                    "lsp_workspace_closed",
                    "C# workspace registration is unavailable".into(),
                )
            })?;
        if kind != "lsp/status"
            && kind != "lsp/isServerInstalled"
            && data["generation"].as_u64() != Some(handle.generation())
        {
            return Err(failure(
                "lsp_workspace_closed",
                "The captured C# workspace connection is stale; refresh its status".into(),
            ));
        }
        (handle, root)
    };
    let mut value = match kind {
        "lsp/status" => service.status(&handle).await?,
        "lsp/isServerInstalled" => {
            let status = service.status(&handle).await?;
            json!({"installed":status["runtimeAvailable"] == true && matches!(data["extensionName"].as_str(),Some("csharp-ls"|"gamecowork-unity-lsp-server")),"version":"0.21.0","languages":["csharp"],"failure":status["failure"]})
        }
        "lsp/setEnabled" => {
            let enabled = data["enabled"]
                .as_bool()
                .ok_or_else(|| failure("invalid_request", "C# enabled must be a boolean".into()))?;
            lsp_preference(core, &root, None)
                .await
                .map_err(|error| failure("lsp_preferences_failed", error))?;
            let result = service.set_enabled(&handle, enabled, None).await;
            if let Err(error) = result {
                let _ = service.set_enabled(&handle, false, None).await;
                let _guard = core.lifecycle.lock().await;
                if workspace == "default"
                    || core
                        .store
                        .lock()
                        .await
                        .opened()
                        .iter()
                        .any(|w| w.workspace_key == workspace)
                {
                    if let Ok(fresh) = service.workspace(&root).await {
                        core.lsp_handles
                            .lock()
                            .await
                            .insert(workspace.to_owned(), fresh);
                    }
                }
                return Err(error);
            }
            let _guard = core.lifecycle.lock().await;
            if workspace != "default"
                && !core
                    .store
                    .lock()
                    .await
                    .opened()
                    .iter()
                    .any(|w| w.workspace_key == workspace)
            {
                return Err(failure(
                    "lsp_workspace_closed",
                    "C# workspace closed during enable/disable".into(),
                ));
            }
            let fresh = service.workspace(&root).await?;
            if enabled && fresh.generation() != handle.generation() {
                return Err(failure(
                    "lsp_workspace_closed",
                    "C# workspace changed during enable".into(),
                ));
            }
            core.lsp_handles
                .lock()
                .await
                .insert(workspace.to_owned(), fresh.clone());
            if let Err(error) = lsp_preference(core, &root, Some(enabled)).await {
                if enabled {
                    let _ = service.set_enabled(&fresh, false, None).await;
                    if let Ok(stopped) = service.workspace(&root).await {
                        core.lsp_handles
                            .lock()
                            .await
                            .insert(workspace.to_owned(), stopped);
                    }
                }
                return Err(failure("lsp_preferences_failed",format!("C# preference could not be saved; current service status must be refreshed: {error}")));
            }
            service.status(&fresh).await?
        }
        "lsp/syncDocument" => {
            service
                .sync_document(
                    &handle,
                    data["filePath"].as_str().unwrap_or(""),
                    data["text"].as_str().ok_or_else(|| {
                        failure("invalid_request", "C# document text is required".into())
                    })?,
                    data["version"].as_u64().unwrap_or(0),
                )
                .await?
        }
        "lsp/closeDocument" => {
            service
                .close_document_version(
                    &handle,
                    data["filePath"].as_str().unwrap_or(""),
                    Some(data["version"].as_u64().ok_or_else(|| {
                        failure(
                            "lsp_document_version",
                            "C# close must carry its captured document version".into(),
                        )
                    })?),
                )
                .await?
        }
        "lsp/cancelRequest" => {
            let request = data["requestId"].as_str().unwrap_or("");
            let sender = {
                let mut pending = core.lsp_requests.lock().unwrap();
                if pending
                    .get(request)
                    .is_some_and(|(owner, _)| owner == workspace)
                {
                    pending.remove(request).map(|(_, sender)| sender)
                } else {
                    None
                }
            };
            let cancelled = sender.is_some();
            if let Some(sender) = sender {
                let _ = sender.send(());
            }
            json!({"cancelled":cancelled})
        }
        "lsp/hover" | "lsp/goToDefinition" | "lsp/findReferences" => {
            let line = data["line"]
                .as_u64()
                .and_then(|n| u32::try_from(n).ok())
                .ok_or_else(|| {
                    failure(
                        "lsp_position_invalid",
                        "C# line must be a zero-based UTF-16 position".into(),
                    )
                })?;
            let character = data["character"]
                .as_u64()
                .and_then(|n| u32::try_from(n).ok())
                .ok_or_else(|| {
                    failure(
                        "lsp_position_invalid",
                        "C# character must be a zero-based UTF-16 position".into(),
                    )
                })?;
            let position = lsp::Position { line, character };
            let file = data["filePath"].as_str().unwrap_or("");
            let request_id = data["requestId"]
                .as_str()
                .ok_or_else(|| {
                    failure(
                        "invalid_request",
                        "A captured C# request ID is required".into(),
                    )
                })?
                .to_owned();
            if request_id.len() > 128 {
                return Err(failure(
                    "invalid_request",
                    "C# request ID is too long".into(),
                ));
            }
            let (cancel_tx, cancel_rx) = tokio::sync::oneshot::channel();
            {
                let mut pending = core.lsp_requests.lock().unwrap();
                if pending.len() >= 64 || pending.contains_key(&request_id) {
                    return Err(failure(
                        "lsp_request_limit",
                        "Too many or duplicate C# requests".into(),
                    ));
                }
                pending.insert(request_id.clone(), (workspace.to_owned(), cancel_tx));
            }
            let result = tokio::select! {result=async {match kind{"lsp/hover"=>service.hover(&handle,file,position).await,"lsp/goToDefinition"=>service.definition(&handle,file,position).await,_=>service.references(&handle,file,position,data["includeDeclaration"].as_bool().unwrap_or(true)).await}}=>result,_=cancel_rx=>Err(failure("lsp_request_cancelled","C# request was cancelled".into()))};
            core.lsp_requests.lock().unwrap().remove(&request_id);
            let value = result?;
            if value["version"].as_u64() != data["version"].as_u64() {
                return Err(failure(
                    "lsp_result_stale",
                    "The C# document version changed before the query completed".into(),
                ));
            }
            value
        }
        _ => {
            return Err(failure(
                "lsp_operation_unsupported",
                "This local C# operation is not supported".into(),
            ))
        }
    };
    if kind != "lsp/setEnabled" {
        service.status(&handle).await?;
    }
    let response_generation = if kind == "lsp/setEnabled" {
        value["generation"].as_u64().unwrap_or(handle.generation())
    } else {
        handle.generation()
    };
    let _guard = core.lifecycle.lock().await;
    if workspace != "default"
        && !core
            .store
            .lock()
            .await
            .opened()
            .iter()
            .any(|w| w.workspace_key == workspace)
    {
        return Err(failure(
            "lsp_workspace_closed",
            "C# workspace closed before its reply was delivered".into(),
        ));
    }
    if core
        .lsp_handles
        .lock()
        .await
        .get(workspace)
        .map(|h| h.generation())
        != Some(response_generation)
    {
        return Err(failure(
            "lsp_workspace_closed",
            "C# connection changed before its reply was delivered".into(),
        ));
    }
    value["workspaceKey"] = json!(workspace);
    value["generation"] = json!(response_generation);
    Ok(value)
}

async fn files_for_workspace(
    core: &CoreHandle,
    id: &str,
) -> Result<files::Files, (StatusCode, Value)> {
    let opened = core.store.lock().await.opened();
    let primary = if id == "default" {
        core.paths.home_workspace.clone()
    } else {
        PathBuf::from(
            opened
                .iter()
                .find(|w| w.workspace_key == id)
                .ok_or_else(|| {
                    (
                        StatusCode::NOT_FOUND,
                        json!({"error":"Workspace is not open","code":"workspace_closed"}),
                    )
                })?
                .workspace_dir
                .clone(),
        )
    };
    let mut allowed: Vec<PathBuf> = opened
        .into_iter()
        .map(|w| PathBuf::from(w.workspace_dir))
        .collect();
    allowed.push(core.paths.home_workspace.clone());
    // Readable attachment/prompt caches exclude provider and session credentials.
    for path in [
        core.paths.core_home.join("clipboard"),
        core.paths.core_home.join("rules"),
        core.paths.cli_home.join("cache").join("builtin-agents"),
        core.paths.cli_home.join("cache").join("builtin-skills"),
    ] {
        if path.is_dir() {
            allowed.push(path);
        }
    }
    tokio::task::spawn_blocking(move || files::Files::new(&primary, &allowed))
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"error":e.to_string(),"code":"file_worker_failed"}),
            )
        })?
        .map_err(|e| (StatusCode::from_u16(e.status()).unwrap(), e.json()))
}

async fn host_file_response(core: &CoreHandle, frame: &Value) -> Value {
    let kind = frame["messageType"].as_str().unwrap_or("").to_owned();
    let id = frame["workspaceId"].as_str().unwrap_or("default");
    let files = match files_for_workspace(core, id).await {
        Ok(files) => files,
        Err((_, error)) => return host_error(error),
    };
    let data = frame["data"].clone();
    let result = tokio::task::spawn_blocking(move || match kind.as_str() {
        "readFile" => files
            .read_file(
                data["filepath"].as_str().unwrap_or(""),
                data["encoding"].as_str().unwrap_or("utf8"),
            )
            .map(Value::String),
        "readRangeInFile" => files
            .read_range(data["filepath"].as_str().unwrap_or(""), &data["range"])
            .map(Value::String),
        "listDir" => files.list_dir(data["dir"].as_str().unwrap_or(".")),
        "fileExists" => files
            .file_exists(data["filepath"].as_str().unwrap_or(""))
            .map(Value::Bool),
        "getGitRootPath" => files
            .git_root(data["dir"].as_str().unwrap_or("."))
            .map(|root| root.map(Value::String).unwrap_or(Value::Null)),
        "findGitRepositories" => files.git_repositories(data["dir"].as_str().unwrap_or(".")),
        "getFileStats" => files.file_stats(
            &data["files"]
                .as_array()
                .into_iter()
                .flatten()
                .filter_map(Value::as_str)
                .map(str::to_owned)
                .collect::<Vec<_>>(),
        ),
        _ => unreachable!(),
    })
    .await;
    match result {
        Ok(Ok(value)) => value,
        Ok(Err(error)) => host_error(error.json()),
        Err(error) => host_error(json!({"error":error.to_string(),"code":"file_worker_failed"})),
    }
}

async fn mutations_for_workspace(
    core: &CoreHandle,
    id: &str,
) -> Result<mutations::Mutations, (StatusCode, Value)> {
    let opened = core.store.lock().await.opened();
    let primary = if id == "default" {
        core.paths.home_workspace.clone()
    } else {
        PathBuf::from(
            opened
                .iter()
                .find(|w| w.workspace_key == id)
                .ok_or_else(|| {
                    (
                        StatusCode::NOT_FOUND,
                        json!({"error":"Workspace is not open","code":"workspace_closed"}),
                    )
                })?
                .workspace_dir
                .clone(),
        )
    };
    let changes = core.paths.core_home.join("changes");
    tokio::task::spawn_blocking(move || mutations::Mutations::new(&primary, &changes))
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({"error":e.to_string(),"code":"file_worker_failed"}),
            )
        })?
        .map_err(|e| (StatusCode::from_u16(e.status()).unwrap(), e.json()))
}

async fn install_local_editor_bridge(core: &CoreHandle, workspace: &str) -> Result<Value, String> {
    let packaged = core.paths.root.join("editor-bridge");
    let package = if packaged.is_dir() {
        packaged
    } else {
        core.paths
            .root
            .parent()
            .ok_or("Editor bridge package is unavailable")?
            .join("src/editor-bridge")
    };
    let package = package
        .canonicalize()
        .map_err(|_| "The local Editor bridge package is not included in this build")?;
    let definition: Value = serde_json::from_slice(
        &std::fs::read(package.join("package.json")).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    if definition["name"] != "cn.gamecowork.bridge" {
        return Err("The local package is not the GameCowork Editor bridge".into());
    }
    let reader = files_for_workspace(core, workspace)
        .await
        .map_err(|(_, value)| {
            value["error"]
                .as_str()
                .unwrap_or("Workspace file access failed")
                .to_owned()
        })?;
    let service = mutations_for_workspace(core, workspace)
        .await
        .map_err(|(_, value)| {
            value["error"]
                .as_str()
                .unwrap_or("Workspace mutation access failed")
                .to_owned()
        })?;
    let store = core.store.clone();
    let workspace = workspace.to_owned();
    let changes = tokio::task::spawn_blocking(move || {
        scoped_mutation(&store, &workspace, || {
            reader.read_file("ProjectSettings/ProjectVersion.txt", "utf8")?;
            let preview =
                reader.explorer(&json!({"path":"Packages/manifest.json","mode":"file"}))?;
            let before = preview["file"]["content"].as_str().ok_or_else(|| {
                mutations::MutationError::invalid_request(
                    "Unity package manifest must be a text file",
                )
            })?;
            let mut manifest: Value = serde_json::from_str(before).map_err(|_| {
                mutations::MutationError::invalid_request(
                    "Unity package manifest is not valid JSON",
                )
            })?;
            let dependency = format!("file:{}", files::display(&package));
            if manifest["dependencies"]["cn.gamecowork.bridge"] == dependency {
                return Ok(json!({"ok":true,"applied":false,"alreadyInstalled":true}));
            }
            let dependencies = manifest["dependencies"].as_object_mut().ok_or_else(|| {
                mutations::MutationError::invalid_request(
                    "Unity package dependencies must be an object",
                )
            })?;
            dependencies.insert("cn.gamecowork.bridge".into(), json!(dependency));
            service.write_text(
                "Packages/manifest.json",
                &(serde_json::to_string_pretty(&manifest).unwrap() + "\n"),
                mutations::WriteOptions {
                    overwrite: true,
                    expected_sha256: preview["file"]["sha256"].as_str().map(str::to_owned),
                    allow_sensitive: false,
                },
            )
        })
    })
    .await
    .map_err(|_| "Editor package installation worker failed")?
    .map_err(|(_, value)| {
        value["error"]
            .as_str()
            .unwrap_or("Editor package installation failed")
            .to_owned()
    })?;
    Ok(
        json!({"status":"success","content":{"manifestUpdated":changes["applied"],"alreadyInstalled":changes["alreadyInstalled"],"changeId":changes["changeId"],"requiresEditorImport":true,"connected":false,"message":"The local cn.gamecowork.bridge dependency is configured. The Editor must import it before connecting."}}),
    )
}

fn scoped_mutation(
    store: &Arc<Mutex<Store>>,
    workspace: &str,
    action: impl FnOnce() -> Result<Value, mutations::MutationError>,
) -> Result<Value, (u16, Value)> {
    // Hold the registry lease for the actual disk operation. Closing the
    // workspace either waits for an already-authorized write to finish, or
    // removes it before this final check and the stale write is rejected.
    // A lifecycle lock here would deadlock core callbacks during shutdown.
    let registry = store.blocking_lock();
    if workspace != "default"
        && !registry
            .opened()
            .iter()
            .any(|w| w.workspace_key == workspace)
    {
        return Err((
            409,
            json!({"error":"Workspace closed before the file operation","code":"workspace_closed","applied":false}),
        ));
    }
    action().map_err(|error| (error.status(), error.json()))
}

async fn host_mutation_response(core: &CoreHandle, frame: &Value) -> Value {
    let id = frame["workspaceId"].as_str().unwrap_or("default");
    let service = match mutations_for_workspace(core, id).await {
        Ok(service) => service,
        Err((_, error)) => return host_error(error),
    };
    let kind = frame["messageType"].as_str().unwrap_or("").to_owned();
    let data = frame["data"].clone();
    if kind == "writeFile" && !data["contents"].is_string() {
        return host_error(json!({"error":"File contents must be text","code":"invalid_request"}));
    }
    let store = core.store.clone();
    let workspace = id.to_owned();
    let result = tokio::task::spawn_blocking(move || {
        scoped_mutation(&store, &workspace, || match kind.as_str() {
            "writeFile" => service.write_text(
                data["path"].as_str().unwrap_or(""),
                data["contents"].as_str().unwrap(),
                mutations::WriteOptions {
                    overwrite: true,
                    expected_sha256: data["expectedSha256"].as_str().map(str::to_owned),
                    allow_sensitive: false,
                },
            ),
            "deleteFile" => service.recycle_file(
                data["path"].as_str().unwrap_or(""),
                mutations::DeleteOptions {
                    expected_sha256: data["expectedSha256"].as_str().map(str::to_owned),
                    allow_sensitive: false,
                },
            ),
            "mkdir" => service.mkdir(data["uri"].as_str().unwrap_or("")),
            _ => unreachable!(),
        })
    })
    .await;
    match result {
        Ok(Ok(value)) => value,
        Ok(Err((_, error))) => host_error(error),
        Err(error) => host_error(json!({"error":error.to_string(),"code":"file_worker_failed"})),
    }
}

async fn handle_core_line(line: &str, core: &CoreHandle) {
    let Ok(frame) = serde_json::from_str::<Value>(line) else {
        return;
    };
    if core.transport.handle_frame(frame.clone()).await {
        return;
    }
    // Replies to core->host requests use raw data (not a frontend done/content envelope).
    if frame.get("data").and_then(|v| v.get("done")).is_some() {
        return;
    }
    let kind = frame["messageType"].as_str().unwrap_or("");
    let gui_callback = matches!(
        kind,
        "getWebviewHistoryLength"
            | "getWebviewHistory"
            | "getCurrentSessionId"
            | "isContinueInputFocused"
    );
    if !gui_callback
        && (kind.starts_with("get")
            || matches!(
                kind,
                "readFile"
                    | "readRangeInFile"
                    | "writeFile"
                    | "deleteFile"
                    | "mkdir"
                    | "listDir"
                    | "fileExists"
                    | "findGitRepositories"
                    | "readSecrets"
                    | "isTelemetryEnabled"
                    | "isWorkspaceRemote"
                    | "showToast"
                    | "logoutOfControlPlane"
                    | "launchDetachedEditor"
            ))
    {
        let mut response = json!({"messageType":kind,"messageId":frame["messageId"],"data":host_response(core,&frame).await});
        if let Some(id) = frame.get("workspaceId") {
            response["workspaceId"] = id.clone();
        }
        let _ = core.stdin_tx.send(response.to_string());
    } else {
        if matches!(
            kind,
            "acp/requestPermission"
                | "acp/requestShellConfirmation"
                | "isContinueInputFocused"
                | "getWebviewHistoryLength"
                | "getWebviewHistory"
                | "getCurrentSessionId"
        ) {
            if let Some(id) = frame["messageId"].as_str() {
                let previous = core.host_pending.lock().unwrap().insert(
                    id.to_owned(),
                    (
                        kind.to_owned(),
                        frame["workspaceId"].as_str().map(str::to_owned),
                    ),
                );
                if previous.is_none() && is_approval(kind) {
                    if let Some(workspace) = frame["workspaceId"].as_str() {
                        core.transport.begin_approval(workspace);
                    }
                }
            }
        }
        let _ = core.events_tx.send(frame.to_string());
    }
}

async fn spawn_core(
    paths: Arc<RuntimePaths>,
    store: Arc<Mutex<Store>>,
    proxy: Option<EventLoopProxy<ShellEvent>>,
) -> Result<(CoreHandle, Child), String> {
    let runtime = paths.core.join("gamecowork-runtime.exe");
    let runtime = if runtime.exists() {
        runtime
    } else {
        PathBuf::from("node.exe")
    };
    let worker_entry = paths
        .root
        .join("unity-insight/bundle/gamecowork-worker-entry.mjs");
    let worker_entry = if worker_entry.is_file() {
        worker_entry
    } else {
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .unwrap()
            .join("unity-insight/bundle/gamecowork-worker-entry.mjs")
    };
    let insight =
        insight::InsightService::new(paths.data.join("insight"), runtime.clone(), worker_entry)?;
    let mut cmd = Command::new(runtime);
    for variable in [
        "GAMECOWORK_CLI_PATH",
        "GAMECOWORK_HOME",
        "GAMECOWORK_APP_HOME",
        "GAMECOWORK_CLI_BASE_DIR",
    ] {
        cmd.env_remove(variable);
    }
    cmd.arg(&paths.entry)
        .current_dir(&paths.core)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .env("CONTINUE_GLOBAL_DIR", &paths.core_home)
        .env("GAMECOWORK_USER_DATA_DIR", &paths.core_home)
        .env("GAMECOWORK_CLI_HOME", &paths.cli_home)
        .env("GAMECOWORK_PREWARM", "1");
    cmd.env("GAMECOWORK_CORE_JOB", "1");
    cmd.env("GAMECOWORK_DISABLE_AUTO_UPDATE", "1")
        .env("GAMECOWORK_LOCAL_PROVIDER_MODE", "1")
        .env("GAMECOWORK_CLI_RESOURCE_DIR", &paths.agent_resources)
        .env("GAMECOWORK_APP_HOME", &paths.root)
        .env("GAMECOWORK_HOME", paths.root.join("cli"));
    if let Some(cli) = &paths.agent_path {
        cmd.env("GAMECOWORK_CLI_PATH", cli);
    }
    #[cfg(windows)]
    cmd.creation_flags(0x08000000);
    let mut child = cmd.spawn().map_err(|e| format!("Cannot start core: {e}"))?;
    let process_lifetime = match process_lifetime::ProcessLifetime::attach(&child) {
        Ok(lifetime) => lifetime,
        Err(error) => {
            let _ = child.kill().await;
            return Err(error);
        }
    };
    let (stdin_tx, mut stdin_rx) = mpsc::unbounded_channel::<String>();
    let (events_tx, _) = broadcast::channel(1024);
    let transport = CoreTransport::new(stdin_tx.clone(), events_tx.clone());
    let lsp_config = lsp::Config {
        executable: paths.lsp_root.join("runtime/csharp-ls.exe"),
        ledger: paths.lsp_root.join("dependency-ledger.json"),
        ledger_sha256: include_str!("../../../vendor/csharp-lsp/dependency-ledger.sha256")
            .trim()
            .to_owned(),
        app_data_root: paths.data.clone(),
    };
    let (lsp, lsp_failure) = match lsp::LspService::new(lsp_config) {
        Ok(service) => (Some(service), None),
        Err(error) => (None, Some(error)),
    };
    let keep_awake = keep_awake::KeepAwake::new(
        paths.data.join("keep-awake.json"),
        paths.headless || paths.test_mode,
        events_tx.clone(),
    )?;
    let editor_cache = editor_installations_cache::InstallationCache::new(
        paths.data.join("installed-editors.json"),
        events_tx.clone(),
    );
    let core = CoreHandle {
        transport,
        stdin_tx,
        events_tx,
        store,
        lifecycle: Arc::new(Mutex::new(())),
        hub_cache: Arc::new(Mutex::new(None)),
        editor_cache,
        codely_canvas: codely_canvas::LocalCanvasService::new(paths.data.join("codely-canvas"))?,
        host_pending: Arc::new(StdMutex::new(HashMap::new())),
        host_finished: Arc::new(StdMutex::new(HashMap::new())),
        local_settings: Arc::new(Mutex::new(())),
        keep_awake,
        project_creations: Arc::new(StdMutex::new(HashMap::new())),
        insight,
        lsp,
        lsp_failure,
        lsp_handles: Arc::new(Mutex::new(HashMap::new())),
        lsp_requests: Arc::new(StdMutex::new(HashMap::new())),
        terminals: Arc::new(StdMutex::new(HashMap::new())),
        paths,
        proxy,
        _process_lifetime: process_lifetime,
    };
    let mut stdin = child.stdin.take().ok_or("Missing core stdin")?;
    let writer = core.clone();
    tokio::spawn(async move {
        while let Some(line) = stdin_rx.recv().await {
            if stdin.write_all(line.as_bytes()).await.is_err()
                || stdin.write_all(b"\r\n").await.is_err()
            {
                writer.transport.fail_pending("core stdin closed").await;
                break;
            }
            if stdin.flush().await.is_err() {
                writer
                    .transport
                    .fail_pending("core stdin flush failed")
                    .await;
                break;
            }
        }
    });
    let mut stdout = child.stdout.take().ok_or("Missing core stdout")?;
    let reader = core.clone();
    tokio::spawn(async move {
        let mut buf = Vec::new();
        let mut chunk = [0u8; 8192];
        while let Ok(n) = stdout.read(&mut chunk).await {
            if n == 0 {
                break;
            }
            buf.extend_from_slice(&chunk[..n]);
            while let Some(pos) = buf.iter().position(|b| *b == b'\r' || *b == b'\n') {
                let frame: Vec<_> = buf.drain(..=pos).collect();
                let text = String::from_utf8_lossy(&frame[..frame.len() - 1]);
                let text = text.trim();
                if !text.is_empty() {
                    handle_core_line(text, &reader).await;
                }
            }
            if buf.len() > 16 * 1024 * 1024 {
                reader.transport.fail_pending("oversized core frame").await;
                break;
            }
        }
        reader.transport.fail_pending("core stdout closed").await;
        let _ = reader.events_tx.send(
            json!({"messageType":"coreStatus","data":{"status":"fatal","error":"core exited"}})
                .to_string(),
        );
    });
    if let Some(mut stderr) = child.stderr.take() {
        tokio::spawn(async move {
            let mut bytes = [0u8; 4096];
            while let Ok(n) = stderr.read(&mut bytes).await {
                if n == 0 {
                    break;
                }
            }
        });
    }
    Ok((core, child))
}

async fn core_call(
    core: &CoreHandle,
    kind: &str,
    data: Value,
    workspace: Option<&str>,
) -> Result<Value, String> {
    let frame = core
        .transport
        .request(kind, data, workspace, None, false, Duration::from_secs(30))
        .await?;
    if frame["data"]["status"] == "error" {
        return Err(frame["data"]["error"]
            .as_str()
            .unwrap_or("core error")
            .to_owned());
    }
    Ok(frame["data"]["content"].clone())
}
fn basename(p: &str) -> String {
    p.trim_end_matches(['/', '\\'])
        .rsplit(['/', '\\'])
        .next()
        .unwrap_or(p)
        .to_owned()
}

async fn hub_snapshot(core: &CoreHandle) -> Result<Value, String> {
    // Template selection needs current registered installations, not a project
    // scan. Do not publish this separate response over an in-flight pane scan.
    let fresh = core_call(core, "unity/getHubEditors", json!({}), Some("default")).await?;
    if !fresh.is_array() {
        return Err("Invalid Hub editor response".into());
    }
    Ok(fresh)
}

fn hub_refresh_requested(data: &Value) -> Result<bool, String> {
    match data.get("refresh") {
        None => Ok(false),
        Some(Value::Bool(value)) => Ok(*value),
        Some(_) => Err("Hub refresh must be a boolean".into()),
    }
}

async fn hub_snapshot_request(core: &CoreHandle, data: &Value) -> Result<Value, String> {
    hub_snapshot_refresh(core, hub_refresh_requested(data)?).await
}

#[cfg(test)]
mod hub_refresh_tests {
    use super::*;

    #[test]
    fn refresh_is_opt_in_and_validated_before_core_discovery() {
        assert!(!hub_refresh_requested(&Value::Null).unwrap());
        assert!(!hub_refresh_requested(&json!({})).unwrap());
        assert!(!hub_refresh_requested(&json!({"refresh":false})).unwrap());
        assert!(hub_refresh_requested(&json!({"refresh":true})).unwrap());
        for value in [Value::Null, json!("true"), json!(1), json!([])] {
            assert!(hub_refresh_requested(&json!({"refresh":value})).is_err());
        }
    }
}

// Project discovery is separate from installed Editor discovery. Refreshing
// recency must never trigger the expensive installed-version/PE scanner.
async fn hub_snapshot_refresh(core: &CoreHandle, refresh: bool) -> Result<Value, String> {
    let mut cache = core.hub_cache.lock().await;
    if refresh {
        *cache = None;
    }
    if let Some((at, data)) = &*cache {
        if at.elapsed() < Duration::from_secs(60) {
            return Ok(data.clone());
        }
    }
    let fresh = core_call(core, "unity/getHubProjects", json!({}), Some("default")).await?;
    if !fresh.is_array() {
        return Err("Invalid Hub project/editor response".into());
    }
    *cache = Some((Instant::now(), fresh.clone()));
    Ok(fresh)
}

fn emit(core: &CoreHandle, kind: &str, data: Value) {
    let _ = core
        .events_tx
        .send(json!({"messageType":kind,"source":"tauri","data":data}).to_string());
}

async fn open_local_workspace(core: &CoreHandle, path: &str) -> Result<Workspace, String> {
    let _guard = core.lifecycle.lock().await;
    let previous = core.store.lock().await.clone();
    let workspace = core.store.lock().await.open(path)?;
    let already = previous
        .opened()
        .iter()
        .any(|w| w.workspace_key == workspace.workspace_key);
    if !already {
        if let Err(error) = core_call(
            core,
            "initWorkspace",
            json!({"workspaceId":workspace.workspace_key,
            "workspace":workspace.workspace_dir,"autoLoadConfig":false}),
            None,
        )
        .await
        {
            // An uncertain init may have created a core before its response was lost.
            let _ = core_call(
                core,
                "shutdownWorkspace",
                json!({"workspaceId":workspace.workspace_key}),
                None,
            )
            .await;
            core.store
                .lock()
                .await
                .restore(&previous)
                .map_err(|rollback| format!("{error}; workspace rollback failed: {rollback}"))?;
            return Err(error);
        }
    }
    core.insight
        .open_workspace(std::path::Path::new(&workspace.workspace_dir))
        .await;
    register_lsp_workspace(
        core,
        &workspace.workspace_key,
        std::path::Path::new(&workspace.workspace_dir),
    )
    .await;
    emit(
        core,
        "hub/workspaceAdded",
        serde_json::to_value(&workspace).unwrap(),
    );
    emit(
        core,
        "hub/switchWorkspace",
        json!({"workspaceKey":workspace.workspace_key}),
    );
    Ok(workspace)
}

async fn route_workspace(
    core: &CoreHandle,
    body: &Value,
    message: &Value,
) -> Result<String, String> {
    let reference = body
        .get("workspaceRef")
        .or_else(|| message.get("workspaceRef"))
        .or_else(|| message["data"].get("workspaceRef"));
    if reference.and_then(|v| v["runOn"].as_str()) == Some("remote") {
        return Err("Remote workspaces are not connected".into());
    }
    let key = body
        .get("workspaceKey")
        .or_else(|| message.get("workspaceKey"))
        .or_else(|| message["data"].get("workspaceKey"))
        .and_then(Value::as_str);
    if let Some(key) = key {
        if key == "default" {
            return Ok("default".into());
        }
        if !core
            .store
            .lock()
            .await
            .opened()
            .iter()
            .any(|w| w.workspace_key == key)
        {
            return Err(format!("Workspace is not open: {key}"));
        }
        return Ok(key.to_owned());
    }
    if let Some(path) = reference.and_then(|r| r["workspaceDir"].as_str()) {
        let w = core.store.lock().await.opened().into_iter().find(|w| {
            w.workspace_dir
                .replace('\\', "/")
                .trim_end_matches('/')
                .eq_ignore_ascii_case(path.replace('\\', "/").trim_end_matches('/'))
        });
        return w
            .map(|w| w.workspace_key)
            .ok_or_else(|| format!("Workspace is not open: {path}"));
    }
    Ok(core
        .store
        .lock()
        .await
        .active()
        .map(|w| w.workspace_key)
        .unwrap_or("default".into()))
}

async fn local_message(
    core: &CoreHandle,
    kind: &str,
    data: &Value,
) -> Option<Result<Value, String>> {
    Some(match kind {
        "get_cowork_access_token" => Ok(json!("gamecowork-local-session")),
        "getControlPlaneSessionInfo" => Ok(local_session()),
        "getIdeInfo" => Ok(ide_info()),
        "getIdeSettings" => Ok(ide_settings()),
        "ping" => Ok(json!("pong")),
        "tauri/bringToFront" => {
            let result = window_event(core, ShellEvent::FocusWindow).0;
            if result["ok"] == true {
                Ok(result)
            } else {
                Err(result["error"]
                    .as_str()
                    .unwrap_or("Cannot focus desktop window")
                    .into())
            }
        }
        "read_unity_streaming_layout" | "save_unity_streaming_layout" => {
            let _guard = core.local_settings.lock().await;
            let path = core.paths.data.join("unity-streaming-layout.json");
            if kind == "save_unity_streaming_layout" {
                match data["contents"]
                    .as_str()
                    .ok_or_else(|| "Editor layout contents are required".to_owned())
                    .and_then(stream_layout::parse)
                {
                    Ok(layout) => {
                        workspaces::write_json_atomic(&path, &layout).map(|_| Value::Null)
                    }
                    Err(error) => Err(error.to_owned()),
                }
            } else {
                match std::fs::read_to_string(&path) {
                    Ok(contents) => {
                        stream_layout::parse(&contents).map(|value| json!(value.to_string()))
                    }
                    Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(Value::Null),
                    Err(error) => Err(format!("Cannot read Editor layout: {error}")),
                }
            }
        }
        "editor/getEmbedMode" => Ok(json!({"embed_mode":false})),
        "editor/getSidechat" => Ok(json!({"sidechat":false})),
        "tjhub/getStatus" => Ok(json!({"state":"active","mode":"local"})),
        "tjhub/getPendingDeepLink" | "tjhub/getPendingIpcPassthrough" => Ok(Value::Null),
        "tauri/listRemoteWorkspaces" | "controlPlane/getActivityNotifications" => Ok(json!([])),
        "tauri/getTunnelEnabled" => Ok(
            json!({"available":false,"enabled":false,"reason":"Remote access is not configured"}),
        ),
        "tauri/setTunnelEnabled" => Err("Remote access is not configured".into()),
        "tauri/getKeepAwake" => core.keep_awake.get().await,
        "tauri/setKeepAwake" => core.keep_awake.set(data).await,
        "versionUpdate/getSeenFeatures" | "versionUpdate/markFeatureSeen" => {
            seen_features(core, kind, data).await
        }
        "metrics/trackEvent" => Ok(Value::Null),
        "tjhub/getUserInfo" => Ok(
            json!({"id":"gamecowork-local","label":"GameCowork 本地用户","name":"GameCowork 本地用户","mode":"local"}),
        ),
        "tjhub/getLicenses" => Ok(editor_licensing::status()),
        "tjhub/activateLicense"
        | "tjhub/activatePersonalLicense"
        | "tjhub/generateLicenseRequest"
        | "tjhub/importLicenseFile"
        | "tjhub/returnLicense"
        | "tjhub/getServerConfig"
        | "tjhub/updateServerConfig" => editor_licensing::reject_mutation(kind),
        "tjhub/getTemplates" | "tjhub/createProject" => {
            local_project_templates(core, kind, data).await
        }
        "tjhub/getUniqueProjectName" => {
            project_templates::unique_project(&core.paths.data.join("Projects"))
        }
        "tjhub/getOrganizations" => {
            Ok(json!({"organizations":[],"mode":"local","supported":false}))
        }
        "tjhub/cancelCreateProject" => {
            let id = data["creationId"].as_str().unwrap_or("");
            match core.project_creations.lock().unwrap().get(id) {
                Some(token) => Ok(json!({"cancelRequested":project_templates::cancel(token)})),
                None => Ok(json!({"cancelRequested":false,"alreadyFinished":true})),
            }
        }
        "tjhub/getModules" => Ok(json!([])),
        "tjhub/getProjectDirectory" | "tjhub/getInstallLocation" => {
            Ok(json!({"path":core.paths.home_workspace}))
        }
        "tjhub/getRecentProjects" => {
            let mut rows: HashMap<String, Value> = HashMap::new();
            let snapshot = hub_snapshot_request(core, data).await;
            if let Ok(snapshot) = &snapshot {
                let store = core.store.lock().await;
                for product in snapshot.as_array().into_iter().flatten() {
                    for p in product["projects"].as_array().into_iter().flatten() {
                        let Some(path) = p["path"].as_str() else {
                            continue;
                        };
                        if store.is_hidden(path) {
                            continue;
                        }
                        let mut row = json!({"localProjectId":path,"title":basename(path),
                            "path":path,"lastModified":p["last_modified_display"],"version":p["editor_version"],
                            "editorVersion":p["editor_version"],"semver":p.get("tuanjie_editor_version").filter(|v|v.as_str().is_some_and(|s|!s.is_empty())).unwrap_or(&p["editor_version"]),
                            "architecture":"x86_64","product":product["product"],"isRemote":false});
                        workspaces::refresh_project_metadata(&mut row);
                        rows.insert(path.replace('\\', "/").to_lowercase(), row);
                    }
                }
            }
            for p in core.store.lock().await.projects() {
                let row = serde_json::to_value(&p).unwrap();
                if let Some(path) = row["path"].as_str() {
                    rows.insert(path.replace('\\', "/").to_lowercase(), row);
                }
            }
            if rows.is_empty() && snapshot.is_err() {
                Err(snapshot.err().unwrap())
            } else {
                let mut rows: Vec<_> = rows.into_values().collect();
                rows.sort_by(|a, b| {
                    b["lastModifiedUnixMs"]
                        .as_u64()
                        .unwrap_or(0)
                        .cmp(&a["lastModifiedUnixMs"].as_u64().unwrap_or(0))
                        .then_with(|| {
                            a["path"]
                                .as_str()
                                .unwrap_or("")
                                .to_lowercase()
                                .cmp(&b["path"].as_str().unwrap_or("").to_lowercase())
                        })
                });
                Ok(json!(rows))
            }
        }
        "tjhub/getEditors" | "tjhub/getEditorInstallations" => {
            async {
                let refresh = hub_refresh_requested(data)?;
                let scanner = core.clone();
                let result = core
                    .editor_cache
                    .request(refresh, move || async move {
                        let snapshot =
                            core_call(&scanner, "unity/getHubEditors", json!({}), Some("default"))
                                .await?;
                        editor_installations::from_snapshot(&snapshot)
                    })
                    .await?;
                Ok(if kind == "tjhub/getEditors" {
                    result["editors"].clone()
                } else {
                    result
                })
            }
            .await
        }
        "tjhub/addProject" | "tjhub/addFromDisk" => {
            let result = core
                .store
                .lock()
                .await
                .add_project(data["projectPath"].as_str().unwrap_or(""));
            result.map(|p| serde_json::to_value(p).unwrap())
        }
        "tjhub/removeProject" => {
            remove_project(core, data["projectPath"].as_str().unwrap_or("")).await
        }
        "tjhub/toggleFavorite" => {
            let Some(favorite) = data["isFavorite"].as_bool() else {
                return Some(Err("isFavorite must be a boolean".into()));
            };
            let path = data["projectPath"].as_str().unwrap_or("");
            core.store
                .lock()
                .await
                .set_favorite(path, favorite)
                .map(|p| serde_json::to_value(p).unwrap())
        }
        "initWorkspace" => open_local_workspace(core, data["path"].as_str().unwrap_or(""))
            .await
            .map(|w| json!({"ok":true,"workspaceKey":w.workspace_key})),
        "tjhub/openProject" => {
            let path = data["path"].as_str().unwrap_or("");
            emit(core, "tjhub/projectOpening", json!({"projectPath":path}));
            let result = match open_local_workspace(core, path).await {
                Ok(w) if !w.is_unity_project => {
                    Ok(json!({"success":true,"workspaceKey":w.workspace_key,"workspaceOnly":true}))
                }
                Ok(w) => {
                    match core_call(
                        core,
                        "unity/openEditor",
                        json!({"version":data["version"], "architecture":data["architecture"], "product":data["product"], "editorPath":data["editorPath"]}),
                        Some(&w.workspace_key),
                    )
                    .await
                    {
                        Ok(result) if result["success"] == false => Err(result["message"]
                            .as_str()
                            .unwrap_or("Editor launch failed")
                            .to_owned()),
                        Ok(result) if result["needsSelection"] == true => {
                            Err("EDITOR_NOT_FOUND".into())
                        }
                        other => other,
                    }
                }
                Err(e) => Err(e),
            };
            if result.is_ok() {
                emit(core, "tjhub/projectOpened", json!({"projectPath":path}));
            }
            result
        }
        "pet/getVisible" => Ok(json!({"visible":false})),
        "pet/setVisible" => Err("Pet window is not implemented yet".into()),
        _ => return None,
    })
}

struct ProjectCreationLease {
    pending: Arc<StdMutex<HashMap<String, Arc<std::sync::atomic::AtomicU8>>>>,
    id: String,
    token: Arc<std::sync::atomic::AtomicU8>,
}
impl Drop for ProjectCreationLease {
    fn drop(&mut self) {
        project_templates::cancel(&self.token);
        let mut pending = self.pending.lock().unwrap();
        if pending
            .get(&self.id)
            .is_some_and(|token| Arc::ptr_eq(token, &self.token))
        {
            pending.remove(&self.id);
        }
    }
}

#[cfg(test)]
mod project_creation_lease_tests {
    use super::*;
    use std::sync::atomic::{AtomicU8, Ordering};
    #[test]
    fn dropped_caller_cancels_only_its_owned_task_and_does_not_remove_a_replacement() {
        let pending = Arc::new(StdMutex::new(HashMap::new()));
        let a = Arc::new(AtomicU8::new(project_templates::RUNNING));
        let b = Arc::new(AtomicU8::new(project_templates::RUNNING));
        pending.lock().unwrap().insert("a".into(), a.clone());
        pending.lock().unwrap().insert("b".into(), b.clone());
        drop(ProjectCreationLease {
            pending: pending.clone(),
            id: "a".into(),
            token: a.clone(),
        });
        assert_eq!(a.load(Ordering::SeqCst), project_templates::CANCELLED);
        assert_eq!(b.load(Ordering::SeqCst), project_templates::RUNNING);
        assert!(!pending.lock().unwrap().contains_key("a"));
        let replacement = Arc::new(AtomicU8::new(project_templates::RUNNING));
        pending
            .lock()
            .unwrap()
            .insert("a".into(), replacement.clone());
        drop(ProjectCreationLease {
            pending: pending.clone(),
            id: "a".into(),
            token: a,
        });
        assert!(Arc::ptr_eq(
            pending.lock().unwrap().get("a").unwrap(),
            &replacement
        ));
        assert_eq!(
            replacement.load(Ordering::SeqCst),
            project_templates::RUNNING
        );
    }
}

async fn local_project_templates(
    core: &CoreHandle,
    kind: &str,
    data: &Value,
) -> Result<Value, String> {
    if kind == "tjhub/getTemplates" {
        let snapshot = hub_snapshot(core).await?;
        let editor = project_templates::select_editor(&snapshot, data)?;
        return tokio::task::spawn_blocking(move || project_templates::catalog(&editor))
            .await
            .map_err(|e| format!("Template catalog worker failed: {e}"))?;
    }
    let id = data["creationId"]
        .as_str()
        .ok_or("A project creation ID is required")?
        .to_owned();
    uuid::Uuid::parse_str(&id).map_err(|_| "Invalid project creation ID")?;
    let token = Arc::new(std::sync::atomic::AtomicU8::new(project_templates::RUNNING));
    {
        let mut pending = core.project_creations.lock().unwrap();
        if pending.len() >= 4 || pending.contains_key(&id) {
            return Err("A project creation is already in progress".into());
        }
        pending.insert(id.clone(), token.clone());
    }
    // Dropping the HTTP caller cancels the still-running copy and releases only
    // this task's registry entry. The blocking worker observes the same token.
    let _lease = ProjectCreationLease {
        pending: core.project_creations.clone(),
        id: id.clone(),
        token: token.clone(),
    };
    let snapshot = hub_snapshot(core).await?;
    if token.load(std::sync::atomic::Ordering::SeqCst) == project_templates::CANCELLED {
        return Err("PROJECT_CREATION_CANCELLED".into());
    }
    let editor = project_templates::select_editor(&snapshot, data)?;
    let worker_core = core.clone();
    let worker_id = id.clone();
    let request = data.clone();
    let result = tokio::task::spawn_blocking(move || {
        project_templates::create(&editor, &request, &token, |files, bytes| {
            emit(
                &worker_core,
                "tjhub/projectCreationProgress",
                json!({"creationId":worker_id,"filesCopied":files,"bytesCopied":bytes}),
            );
        })
    })
    .await
    .map_err(|e| format!("Project creation worker failed: {e}"));
    let mut receipt = result??;
    let path = receipt["projectPath"]
        .as_str()
        .ok_or("Created project has no path")?
        .to_owned();
    let project = core.store.lock().await.add_project(&path).map_err(|e|format!("Project was created at {path}, but local registration failed: {e}. Add this folder from disk to retry."))?;
    receipt["workspaceKey"] = json!(project.workspace_key);
    emit(core, "tjhub/projectsChanged", json!({}));
    Ok(receipt)
}

async fn seen_features(core: &CoreHandle, kind: &str, data: &Value) -> Result<Value, String> {
    let _guard = core.local_settings.lock().await;
    let path = core.paths.data.join("seen-features.json");
    let mut state: HashMap<String, Vec<String>> = match std::fs::read(&path) {
        Ok(bytes) => serde_json::from_slice(&bytes)
            .map_err(|e| format!("Invalid feature preference state: {e}"))?,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => HashMap::new(),
        Err(e) => return Err(format!("Cannot read feature preferences: {e}")),
    };
    let platform = data["platform"].as_str().unwrap_or("desktop");
    let features = state.entry(platform.to_owned()).or_default();
    if kind == "versionUpdate/markFeatureSeen" {
        let feature = data["featureId"]
            .as_str()
            .filter(|s| !s.is_empty() && s.len() <= 256)
            .ok_or("featureId required")?;
        if !features.iter().any(|f| f == feature) {
            features.push(feature.to_owned());
        }
        workspaces::write_json_atomic(&path, &state)?;
    }
    Ok(json!({"features":state.get(platform).cloned().unwrap_or_default()}))
}

async fn asset_workspace_scope(core: &CoreHandle, data: &Value) -> Result<String, String> {
    let key = match data.get("workspaceKey") {
        None => "",
        Some(Value::String(key)) => key.as_str(),
        _ => return Err("workspaceKey must be a string when provided".into()),
    };
    if !key.is_empty() {
        // Validate the same field consumed by the asset service; a messenger
        // envelope cannot validate A while its payload actually addresses B.
        let route = json!({"workspaceKey":key});
        route_workspace(core, &route, &route).await?;
    }
    Ok(key.to_owned())
}

async fn invoke(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Response {
    let message = body.get("message").unwrap_or(&body);
    let kind = message["messageType"].as_str().unwrap_or("");
    let id = message.get("messageId").cloned().unwrap_or(Value::Null);
    let data = message.get("data").cloned().unwrap_or(Value::Null);
    if matches!(
        kind,
        "_gamecowork/assetArtifactPath"
            | "_gamecowork/assetRegisterInput"
            | "_gamecowork/assetInputPath"
            | "_gamecowork/codelyGeneratorApi"
            | "_gamecowork/codelyGeneratorUpload"
            | "_gamecowork/codelyRebaseMedia"
    ) {
        return Json(error_reply(kind, &id, "Artifact paths are native-only")).into_response();
    }
    if kind == "generator/getInputResource" {
        let result = async {
            let workspace_key = asset_workspace_scope(&core, &data).await?;
            let metadata = core_call(
                &core,
                "_gamecowork/assetInputPath",
                json!({"inputId":data["inputId"],"workspaceKey":workspace_key}),
                Some("default"),
            )
            .await?;
            let home = core.paths.core_home.clone();
            let mut resource = tokio::task::spawn_blocking(move || {
                generated_assets::read_input_resource(&home, &metadata)
            })
            .await
            .map_err(|e| e.to_string())??;
            resource["inputId"] = data["inputId"].clone();
            Ok::<Value, String>(resource)
        }
        .await;
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if kind == "generator/getResource" {
        let result = async {
            asset_workspace_scope(&core, &data).await?;
            let metadata = core_call(
                &core,
                "_gamecowork/assetArtifactPath",
                json!({"taskId":data["taskId"],"artifactId":data["artifactId"]}),
                Some("default"),
            )
            .await?;
            let home = core.paths.core_home.clone();
            // Media bodies can exceed the bounded Core stdio frame size.
            // Keep that transport limit and read only Core-owned, verified bytes.
            let mut resource = tokio::task::spawn_blocking(move || {
                generated_assets::read_resource(&home, &metadata)
            })
            .await
            .map_err(|e| e.to_string())??;
            resource["taskId"] = data["taskId"].clone();
            resource["artifactId"] = data["artifactId"].clone();
            Ok::<Value, String>(resource)
        }
        .await;
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if kind == "generator/saveOutput" {
        let result = async {
            let workspace = asset_workspace_scope(&core, &data).await?;
            if workspace.is_empty() {
                return Err("Choose an open workspace for export".to_owned());
            }
            let metadata = core_call(
                &core,
                "_gamecowork/assetArtifactPath",
                json!({"taskId":data["taskId"],"artifactId":data["artifactId"]}),
                Some("default"),
            )
            .await?;
            let _guard = core.lifecycle.lock().await;
            let mutations =
                mutations_for_workspace(&core, &workspace)
                    .await
                    .map_err(|(_, v)| {
                        v["error"]
                            .as_str()
                            .unwrap_or("Workspace unavailable")
                            .to_owned()
                    })?;
            let home = core.paths.core_home.clone();
            let relative = data["relativePath"]
                .as_str()
                .ok_or("relativePath is required")?
                .to_owned();
            let overwrite = match data.get("overwrite") {
                None => false,
                Some(Value::Bool(value)) => *value,
                _ => return Err("overwrite must be a boolean".into()),
            };
            let expected = data["expectedSha256"].as_str().map(str::to_owned);
            tokio::task::spawn_blocking(move || {
                generated_assets::export(
                    &home,
                    &metadata,
                    mutations,
                    &relative,
                    overwrite,
                    expected.as_deref(),
                )
            })
            .await
            .map_err(|e| e.to_string())?
        }
        .await;
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if kind.starts_with("generator/") {
        let result = async {
            asset_workspace_scope(&core, &data).await?;
            core_call(&core, kind, data.clone(), Some("default")).await
        }
        .await;
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if kind.starts_with("lsp/") {
        let workspace = match route_workspace(&core, &body, message).await {
            Ok(workspace) => workspace,
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        return Json(match native_lsp(&core, &workspace, kind, &data).await {
            Ok(value) => reply(kind, &id, value),
            Err(error) => {
                let mut response = error_reply(kind, &id, error.to_string());
                response["data"]["details"] = error.json();
                response
            }
        })
        .into_response();
    }
    if kind == "ide/setActiveSessionId" {
        let result = async {
            let workspace = route_workspace(&core, &body, message).await?;
            let session = match data.get("sessionId") {
                Some(Value::Null) | None => None,
                Some(Value::String(id)) if !id.is_empty() && id.len() <= 256 => Some(id.clone()),
                _ => return Err("Invalid active session ID".to_owned()),
            };
            let _guard = core.local_settings.lock().await;
            let path = core.paths.data.join("active-sessions.json");
            let mut state: HashMap<String, String> = match std::fs::read(&path) {
                Ok(bytes) => serde_json::from_slice(&bytes)
                    .map_err(|e| format!("Invalid active sessions: {e}"))?,
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => HashMap::new(),
                Err(e) => return Err(format!("Cannot read active sessions: {e}")),
            };
            if let Some(session) = session {
                state.insert(workspace, session);
            } else {
                state.remove(&workspace);
            }
            workspaces::write_json_atomic(&path, &state)?;
            Ok(Value::Null)
        }
        .await;
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    // A GUI answer to a core-origin permission request must retain the core ID
    // and raw payload. It is not a new frontend invocation.
    let host_route = if let Some(mid) = id.as_str() {
        let mut pending = core.host_pending.lock().unwrap();
        if pending.get(mid).map(|r| r.0.as_str()) == Some(kind) {
            pending.remove(mid)
        } else {
            None
        }
    } else {
        None
    };
    if let Some((_, workspace)) = host_route {
        if let Some(id) = id.as_str() {
            remember_host_reply(&core, id, kind);
        }
        if is_approval(kind) {
            if let Some(workspace) = &workspace {
                core.transport.end_approval(workspace);
            }
        }
        let mut frame = json!({"messageType":kind,"messageId":id,"data":data});
        if let Some(workspace) = workspace {
            frame["workspaceId"] = json!(workspace);
        }
        return match core.stdin_tx.send(frame.to_string()) {
            Ok(()) => Json(Value::Null).into_response(),
            Err(_) => (
                StatusCode::BAD_GATEWAY,
                Json(json!({"error":"core not running"})),
            )
                .into_response(),
        };
    }
    if let Some(id) = id.as_str() {
        let mut finished = core.host_finished.lock().unwrap();
        finished.retain(|_, (_, at)| at.elapsed() < Duration::from_secs(120));
        if finished.get(id).map(|(reply_kind, _)| reply_kind.as_str()) == Some(kind) {
            return Json(Value::Null).into_response();
        }
    }
    if kind.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"messageType required"})),
        )
            .into_response();
    }
    if kind == "abort" {
        let key = body
            .get("workspaceKey")
            .or_else(|| message.get("workspaceKey"))
            .or_else(|| message["data"].get("workspaceKey"))
            .and_then(Value::as_str);
        if let Some(key) = key {
            let store = core.store.lock().await;
            if key != "default"
                && store.lookup(key).is_some()
                && !store.opened().iter().any(|w| w.workspace_key == key)
            {
                return Json(reply(
                    kind,
                    &id,
                    json!({"cancelled":false,"alreadyClosed":true}),
                ))
                .into_response();
            }
        }
    }
    if kind == "unity/installMcpPackage" {
        let workspace = match route_workspace(&core, &body, message).await {
            Ok(workspace) => workspace,
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        let result = install_local_editor_bridge(&core, &workspace).await;
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if kind == "unity/invokeTool" {
        let workspace = match route_workspace(&core, &body, message).await {
            Ok(workspace) => workspace,
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        let root = match workspace_root(&core, Some(&workspace)).await {
            Ok(root) => PathBuf::from(root),
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        let result = editor_bridge::invoke_local_tool(
            root,
            data["command"].as_str().unwrap_or(""),
            &data["toolParams"],
        )
        .await;
        if workspace != "default"
            && !core
                .store
                .lock()
                .await
                .opened()
                .iter()
                .any(|w| w.workspace_key == workspace)
        {
            return Json(error_reply(
                kind,
                &id,
                "Workspace closed during Editor request",
            ))
            .into_response();
        }
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if matches!(kind, "unity/getStatus" | "unity/refresh") {
        let workspace = match route_workspace(&core, &body, message).await {
            Ok(workspace) => workspace,
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        let root = match workspace_root(&core, Some(&workspace)).await {
            Ok(root) => PathBuf::from(root),
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        let result =
            editor_bridge::request(root, "unity/windowBridge/getStreamServerStatus", &json!({}))
                .await;
        if workspace != "default"
            && !core
                .store
                .lock()
                .await
                .opened()
                .iter()
                .any(|w| w.workspace_key == workspace)
        {
            return Json(error_reply(
                kind,
                &id,
                "Workspace closed during Editor status request",
            ))
            .into_response();
        }
        let status = match result {
            Ok(state) => {
                json!({"status":"connected","userStatus":"should-not-reconnected","connected":true,"transport":"image-frames","editorPid":state["content"]["pid"],"processStatus":"alive"})
            }
            Err(error) => {
                json!({"status":"not-connected","userStatus":"should-not-reconnected","connected":false,"error":error})
            }
        };
        return Json(reply(kind, &id, status)).into_response();
    }
    if matches!(
        kind,
        "unity/windowBridge/listWindows"
            | "unity/windowBridge/startStreamServer"
            | "unity/windowBridge/stopStreamServer"
            | "unity/windowBridge/getStreamServerStatus"
    ) {
        let workspace = match route_workspace(&core, &body, message).await {
            Ok(workspace) => workspace,
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        let _guard = core.lifecycle.lock().await;
        if workspace != "default"
            && !core
                .store
                .lock()
                .await
                .opened()
                .iter()
                .any(|w| w.workspace_key == workspace)
        {
            return Json(error_reply(kind, &id, "Workspace is no longer open")).into_response();
        }
        let root = match workspace_root(&core, Some(&workspace)).await {
            Ok(root) => PathBuf::from(root),
            Err(error) => return Json(error_reply(kind, &id, error)).into_response(),
        };
        drop(_guard);
        let result = editor_bridge::request(root.clone(), kind, &data).await;
        if workspace != "default"
            && !core
                .store
                .lock()
                .await
                .opened()
                .iter()
                .any(|w| w.workspace_key == workspace)
        {
            if kind == "unity/windowBridge/startStreamServer" {
                let _ = tokio::time::timeout(
                    Duration::from_millis(700),
                    editor_bridge::request(root, "unity/windowBridge/stopStreamServer", &json!({})),
                )
                .await;
            }
            return Json(error_reply(
                kind,
                &id,
                "Workspace closed during Editor bridge request",
            ))
            .into_response();
        }
        return Json(match result {
            Ok(value) => reply(kind, &id, value),
            Err(error) => error_reply(kind, &id, error),
        })
        .into_response();
    }
    if matches!(
        kind,
        "getWorkspaceDirs"
            | "getProjectRoot"
            | "readFile"
            | "readRangeInFile"
            | "listDir"
            | "fileExists"
            | "getFileStats"
            | "getGitRootPath"
            | "findGitRepositories"
            | "getBranch"
            | "getGitBranches"
            | "getChangedFiles"
            | "applyGitFileAction"
            | "switchGitBranch"
            | "getFileAtHead"
            | "getFileAtIndex"
            | "getDiff"
    ) {
        let workspace = match route_workspace(&core, &body, message).await {
            Ok(v) => v,
            Err(e) => return Json(error_reply(kind, &id, e)).into_response(),
        };
        let frame = json!({"messageType":kind,"data":data,"workspaceId":workspace});
        let content = host_response(&core, &frame).await;
        if let Some(error) = content.get("__gamecoworkHostError") {
            let mut response = error_reply(
                kind,
                &id,
                error["message"].as_str().unwrap_or("Host operation failed"),
            );
            if !error["details"].is_null() {
                response["data"]["details"] = error["details"].clone();
            }
            return Json(response).into_response();
        }
        return Json(reply(kind, &id, content)).into_response();
    }
    if let Some(result) = local_message(&core, kind, &data).await {
        return Json(match result {
            Ok(v) => reply(kind, &id, v),
            Err(e) => error_reply(kind, &id, e),
        })
        .into_response();
    }
    let workspace = match route_workspace(&core, &body, message).await {
        Ok(v) => v,
        Err(e) => return Json(error_reply(kind, &id, e)).into_response(),
    };
    let deferred = data["_deferResponseToSse"].as_bool().unwrap_or(false);
    match core
        .transport
        .request(
            kind,
            data,
            Some(&workspace),
            id.as_str(),
            deferred,
            Duration::from_secs(180),
        )
        .await
    {
        Ok(frame) => Json(frame).into_response(),
        Err(e) => Json(error_reply(kind, &id, e)).into_response(),
    }
}

async fn open_workspace(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Response {
    if body["workspaceRef"]["runOn"] == "remote" {
        return (
            StatusCode::NOT_IMPLEMENTED,
            Json(json!({"ok":false,"error":"Remote workspaces are not connected"})),
        )
            .into_response();
    }
    let home = core.paths.home_workspace.to_string_lossy();
    let path = if body["homeWorkspace"].as_bool() == Some(true) {
        home.as_ref()
    } else {
        body["path"]
            .as_str()
            .or_else(|| body["workspaceRef"]["workspaceDir"].as_str())
            .unwrap_or("")
    };
    match open_local_workspace(&core, path).await {
        Ok(w) => {
            Json(json!({"ok":true,"workspaceKey":w.workspace_key,"workspaceDir":w.workspace_dir}))
                .into_response()
        }
        Err(e) => (StatusCode::BAD_REQUEST, Json(json!({"ok":false,"error":e}))).into_response(),
    }
}
async fn close_local_workspace(core: &CoreHandle, key: &str) -> Result<(), String> {
    if !core
        .store
        .lock()
        .await
        .opened()
        .iter()
        .any(|w| w.workspace_key == key)
    {
        return Err("Workspace is not open".into());
    }
    let previous = core.store.lock().await.clone();
    core.store.lock().await.close(key)?;
    if let Some(workspace) = previous.lookup(key) {
        close_lsp_workspace(core, key, std::path::Path::new(&workspace.workspace_dir)).await;
        core.insight
            .close_workspace(std::path::Path::new(&workspace.workspace_dir))
            .await;
    }
    core.transport.cancel_workspace(key);
    let callbacks = {
        let mut pending = core.host_pending.lock().unwrap();
        let ids: Vec<_> = pending
            .iter()
            .filter(|(_, (_, workspace))| workspace.as_deref() == Some(key))
            .map(|(id, _)| id.clone())
            .collect();
        ids.into_iter()
            .filter_map(|id| pending.remove(&id).map(|(kind, _)| (id, kind)))
            .collect::<Vec<_>>()
    };
    for (id, kind) in callbacks {
        let cancelled = match kind.as_str() {
            "acp/requestPermission" => json!({"outcome":{"outcome":"cancelled"}}),
            "acp/requestShellConfirmation" => json!({"outcome":"reject"}),
            _ => Value::Null,
        };
        remember_host_reply(core, &id, &kind);
        let _ = core.stdin_tx.send(
            json!({"messageId":id,"messageType":kind,"workspaceId":key,"data":cancelled})
                .to_string(),
        );
    }
    // Release GUI approvals while their owning Core still exists. Shutdown can
    // then dispose queues without depending on a view that has already closed.
    if let Err(e) = core_call(core, "shutdownWorkspace", json!({"workspaceId":key}), None).await {
        core.store
            .lock()
            .await
            .restore(&previous)
            .map_err(|restore| format!("{e}; workspace rollback failed: {restore}"))?;
        if let Some(w) = previous.lookup(key) {
            core_call(core,"initWorkspace",json!({"workspaceId":w.workspace_key,"workspace":w.workspace_dir,"autoLoadConfig":false}),None).await.map_err(|restore|format!("{e}; core restore failed: {restore}"))?;
            core.insight
                .open_workspace(std::path::Path::new(&w.workspace_dir))
                .await;
            register_lsp_workspace(
                core,
                &w.workspace_key,
                std::path::Path::new(&w.workspace_dir),
            )
            .await;
        }
        return Err(e);
    }
    if let Some(workspace) = previous.lookup(key) {
        let _ = tokio::time::timeout(
            Duration::from_millis(700),
            editor_bridge::request(
                PathBuf::from(workspace.workspace_dir),
                "unity/windowBridge/stopStreamServer",
                &json!({}),
            ),
        )
        .await;
    }
    emit(core, "hub/workspaceRemoved", json!({"workspaceKey":key}));
    let closed_terminals = {
        let mut sessions = core.terminals.lock().unwrap();
        let ids: Vec<_> = sessions
            .iter()
            .filter(|(_, (workspace, _))| workspace == key)
            .map(|(id, _)| id.clone())
            .collect();
        ids.into_iter()
            .filter_map(|id| sessions.remove(&id).map(|(_, control)| control))
            .collect::<Vec<_>>()
    };
    for terminal in closed_terminals {
        terminal.close();
    }
    Ok(())
}
async fn close_workspace(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Response {
    let _guard = core.lifecycle.lock().await;
    let key = body["workspaceKey"].as_str().unwrap_or("");
    match close_local_workspace(&core, key).await {
        Ok(()) => Json(json!({"ok":true})).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, Json(json!({"ok":false,"error":e}))).into_response(),
    }
}
async fn remove_project(core: &CoreHandle, path: &str) -> Result<Value, String> {
    let _guard = core.lifecycle.lock().await;
    let open = core.store.lock().await.opened().into_iter().find(|w| {
        w.workspace_dir
            .replace('\\', "/")
            .eq_ignore_ascii_case(&path.replace('\\', "/"))
    });
    if let Some(w) = open {
        close_local_workspace(core, &w.workspace_key).await?;
    }
    core.store.lock().await.remove(path)?;
    emit(core, "tjhub/projectsChanged", json!({}));
    Ok(json!({"ok":true}))
}
async fn switch_workspace(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Response {
    let _guard = core.lifecycle.lock().await;
    let key = body["workspaceKey"].as_str().unwrap_or("");
    match core.store.lock().await.set_active(key) {
        Ok(()) => {
            let mut data = json!({"workspaceKey":key});
            if let Some(session) = body["sessionId"].as_str().filter(|s| !s.trim().is_empty()) {
                data["sessionId"] = json!(session);
            }
            emit(&core, "hub/switchWorkspace", data);
            Json(json!({"ok":true})).into_response()
        }
        Err(e) => (StatusCode::BAD_REQUEST, Json(json!({"ok":false,"error":e}))).into_response(),
    }
}
async fn pick_folder(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Json<Value> {
    if core.paths.test_mode {
        let p = std::env::var("GAMECOWORK_PICK_FOLDER").ok();
        return Json(json!({"cancelled":p.is_none(),"path":p}));
    }
    let mut dialog = rfd::AsyncFileDialog::new();
    if let Some(p) = body["defaultPath"].as_str() {
        dialog = dialog.set_directory(p);
    }
    let selected = dialog
        .pick_folder()
        .await
        .map(|p| p.path().to_string_lossy().into_owned());
    Json(json!({"cancelled":selected.is_none(),"path":selected}))
}
async fn pick_folder_empty(State(core): State<CoreHandle>) -> Json<Value> {
    pick_folder(State(core), Json(json!({}))).await
}
async fn pick_file(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Json<Value> {
    if core.paths.test_mode {
        return Json(json!({"cancelled":true,"path":null}));
    }
    let mut dialog = rfd::AsyncFileDialog::new();
    if let Some(p) = body["defaultPath"].as_str() {
        dialog = dialog.set_directory(p);
    }
    let p = dialog
        .pick_file()
        .await
        .map(|p| p.path().to_string_lossy().into_owned());
    Json(json!({"cancelled":p.is_none(),"path":p}))
}

async fn file_http_workspace(
    core: &CoreHandle,
    headers: &HeaderMap,
    body: &Value,
) -> Result<String, (StatusCode, Value)> {
    let mut route = body.clone();
    if !route.is_object() {
        return Err((
            StatusCode::BAD_REQUEST,
            json!({"error":"File request must be an object","code":"invalid_request"}),
        ));
    }
    if let Some(reference) = route["workspaceRef"].as_str() {
        route["workspaceRef"] = serde_json::from_str(reference).map_err(|_| {
            (
                StatusCode::BAD_REQUEST,
                json!({"error":"Invalid workspace reference","code":"invalid_workspace"}),
            )
        })?;
    }
    if route.get("workspaceKey").is_none() && route.get("workspaceRef").is_none() {
        let claimed = body["workspaceDir"]
            .as_str()
            .map(str::to_owned)
            .or_else(|| {
                headers
                    .get("X-Workspace-Dir")
                    .and_then(|h| h.to_str().ok())
                    .map(|s| path_from_uri(s).to_string_lossy().into_owned())
            });
        if let Some(claimed) = claimed {
            let identity = claimed
                .replace('\\', "/")
                .trim_end_matches('/')
                .to_lowercase();
            let opened = core.store.lock().await.opened();
            if let Some(w) = opened.iter().find(|w| {
                w.workspace_dir
                    .replace('\\', "/")
                    .trim_end_matches('/')
                    .to_lowercase()
                    == identity
            }) {
                route["workspaceKey"] = json!(w.workspace_key);
            } else if core
                .paths
                .home_workspace
                .to_string_lossy()
                .replace('\\', "/")
                .trim_end_matches('/')
                .to_lowercase()
                == identity
            {
                route["workspaceKey"] = json!("default");
            } else {
                return Err((
                    StatusCode::FORBIDDEN,
                    json!({"error":"Workspace is not open","code":"workspace_closed"}),
                ));
            }
        }
    }
    let workspace = route_workspace(core, &route, &route).await.map_err(|e| {
        (
            StatusCode::BAD_REQUEST,
            json!({"error":e,"code":"invalid_workspace"}),
        )
    })?;
    Ok(workspace)
}

async fn file_http_scope(
    core: &CoreHandle,
    headers: &HeaderMap,
    body: &Value,
) -> Result<files::Files, (StatusCode, Value)> {
    let workspace = file_http_workspace(core, headers, body).await?;
    files_for_workspace(core, &workspace).await
}

async fn file_mutation_http(core: &CoreHandle, headers: &HeaderMap, body: Value) -> Response {
    let workspace = match file_http_workspace(core, headers, &body).await {
        Ok(workspace) => workspace,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    let service = match mutations_for_workspace(core, &workspace).await {
        Ok(service) => service,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    let operation = body["mode"].as_str().unwrap_or("save").to_owned();
    if operation == "save" && !body["content"].is_string() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"File content must be text","code":"invalid_request"})),
        )
            .into_response();
    }
    let store = core.store.clone();
    let worker_workspace = workspace.clone();
    let result = tokio::task::spawn_blocking(move || {
        scoped_mutation(&store, &worker_workspace, || match operation.as_str() {
            "save" => service.write_text(
                body["path"].as_str().unwrap_or(""),
                body["content"].as_str().unwrap(),
                mutations::WriteOptions {
                    overwrite: true,
                    expected_sha256: body["expectedSha256"].as_str().map(str::to_owned),
                    allow_sensitive: false,
                },
            ),
            "undo" => service.restore(body["changeId"].as_str().unwrap_or("")),
            _ => unreachable!(),
        })
    })
    .await;
    match result {
        Ok(Ok(value)) => {
            if let Some(path) = value["path"].as_str() {
                emit(
                    core,
                    "fileExplorer/changed",
                    json!({"workspaceKey":workspace,"path":path}),
                );
            }
            Json(value).into_response()
        }
        Ok(Err((status, error))) => {
            (StatusCode::from_u16(status).unwrap(), Json(error)).into_response()
        }
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error":error.to_string(),"code":"file_worker_failed"})),
        )
            .into_response(),
    }
}

async fn undo_file_change(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Json(mut body): Json<Value>,
) -> Response {
    if !body.is_object() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"Change request must be an object"})),
        )
            .into_response();
    }
    body["mode"] = json!("undo");
    file_mutation_http(&core, &headers, body).await
}

async fn file_explorer_events(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Query(query): Query<HashMap<String, String>>,
) -> Response {
    let _guard = core.lifecycle.lock().await;
    let body = Value::Object(
        query
            .into_iter()
            .map(|(key, value)| (key, Value::String(value)))
            .collect(),
    );
    let workspace = match file_http_workspace(&core, &headers, &body).await {
        Ok(workspace) => workspace,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    let root = match workspace_root(&core, Some(&workspace)).await {
        Ok(root) => PathBuf::from(root),
        Err(error) => return (StatusCode::NOT_FOUND, Json(json!({"error":error}))).into_response(),
    };
    let events =
        match tokio::task::spawn_blocking(move || file_events::FileEvents::start(&root)).await {
            Ok(Ok(events)) => events,
            Ok(Err(error)) => {
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({"error":error})),
                )
                    .into_response()
            }
            Err(error) => {
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({"error":error.to_string()})),
                )
                    .into_response()
            }
        };
    let stream = futures::stream::unfold(
        (events, core.clone(), workspace, false),
        |(mut events, core, workspace, finished)| async move {
            if finished {
                return None;
            }
            loop {
                let record = tokio::select! {
                    record=events.receiver.recv()=>record?,
                    _=tokio::time::sleep(Duration::from_secs(2))=>{
                        if workspace!="default"&&!core.store.lock().await.opened().iter().any(|w|w.workspace_key==workspace) {return None;}
                        if events.overflow.swap(false,std::sync::atomic::Ordering::AcqRel) {
                            json!({"changes":[{"kind":"added","path":".","parentPath":"."}],"rescan":true})
                        } else {continue;}
                    },
                };
                let failed = record["watcherFailed"] == true;
                if workspace != "default"
                    && !core
                        .store
                        .lock()
                        .await
                        .opened()
                        .iter()
                        .any(|w| w.workspace_key == workspace)
                {
                    return None;
                }
                return Some((
                    Ok::<_, std::convert::Infallible>(SseEvent::default().data(record.to_string())),
                    (events, core, workspace, failed),
                ));
            }
        },
    );
    Sse::new(stream)
        .keep_alive(KeepAlive::new().interval(Duration::from_secs(10)))
        .into_response()
}

async fn terminal_upgrade(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Query(query): Query<HashMap<String, String>>,
    upgrade: WebSocketUpgrade,
) -> Response {
    let host = headers
        .get("host")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    let origin = headers
        .get("origin")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    if host.is_empty() || origin != format!("http://{host}") {
        return (
            StatusCode::FORBIDDEN,
            Json(json!({"error":"Terminal requires the local application origin"})),
        )
            .into_response();
    }
    let body = Value::Object(
        query
            .into_iter()
            .map(|(key, value)| (key, Value::String(value)))
            .collect(),
    );
    let workspace = match file_http_workspace(&core, &headers, &body).await {
        Ok(workspace) => workspace,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    // Serialize opening with closing a workspace so a stale request cannot start
    // a shell after its registration has been closed.
    let _guard = core.lifecycle.lock().await;
    if workspace != "default"
        && !core
            .store
            .lock()
            .await
            .opened()
            .iter()
            .any(|w| w.workspace_key == workspace)
    {
        return (
            StatusCode::NOT_FOUND,
            Json(json!({"error":"Workspace is no longer open"})),
        )
            .into_response();
    }
    let root = match workspace_root(&core, Some(&workspace)).await {
        Ok(root) => PathBuf::from(root),
        Err(error) => return (StatusCode::NOT_FOUND, Json(json!({"error":error}))).into_response(),
    };
    let dimensions = |name: &str, default: u16| -> Option<u16> {
        body.get(name)
            .map(|value| value.as_str()?.parse::<u16>().ok())
            .unwrap_or(Some(default))
    };
    let (Some(cols), Some(rows)) = (dimensions("cols", 80), dimensions("rows", 24)) else {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"Invalid terminal dimensions"})),
        )
            .into_response();
    };
    let cwd = root.clone();
    let session = match tokio::task::spawn_blocking(move || {
        terminals::TerminalSession::spawn(&cwd, &[root], cols, rows)
    })
    .await
    {
        Ok(Ok(session)) => session,
        Ok(Err(error)) => {
            return (
                StatusCode::from_u16(error.status()).unwrap(),
                Json(error.json()),
            )
                .into_response()
        }
        Err(error) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error":error.to_string()})),
            )
                .into_response()
        }
    };
    let id = session.id().to_owned();
    core.terminals
        .lock()
        .unwrap()
        .insert(id.clone(), (workspace, session.control()));
    let failed_core = core.clone();
    let failed_id = id.clone();
    upgrade
        .max_message_size(64 * 1024)
        .on_failed_upgrade(move |_| {
            if let Some((_, terminal)) = failed_core.terminals.lock().unwrap().remove(&failed_id) {
                terminal.close();
            }
        })
        .on_upgrade(move |socket| async move {
            terminals::serve(socket, session).await;
            core.terminals.lock().unwrap().remove(&id);
        })
        .into_response()
}

async fn file_explorer_post(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Json(body): Json<Value>,
) -> Response {
    if body["mode"] == "save" {
        return file_mutation_http(&core, &headers, body).await;
    }
    let files = match file_http_scope(&core, &headers, &body).await {
        Ok(files) => files,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    let editable = if body["mode"] == "file" {
        let workspace = file_http_workspace(&core, &headers, &body).await.ok();
        if let Some(workspace) = workspace {
            mutations_for_workspace(&core, &workspace).await.ok()
        } else {
            None
        }
    } else {
        None
    };
    let result = tokio::task::spawn_blocking(move || {
        let mut result = files.explorer(&body)?;
        if let Some(editor) = editable {
            if result["file"]["kind"] == "text" {
                let path = result["file"]["path"].as_str().unwrap_or("");
                result["file"]["readOnly"] = json!(!editor.can_edit(path).unwrap_or(false));
            }
        }
        Ok(result)
    })
    .await;
    file_worker_response(result)
}

async fn file_explorer_get(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Query(query): Query<HashMap<String, String>>,
) -> Response {
    let body = Value::Object(
        query
            .into_iter()
            .map(|(key, value)| (key, Value::String(value)))
            .collect(),
    );
    file_explorer_post(State(core), headers, Json(body)).await
}

fn file_worker_response(
    result: Result<Result<Value, files::FileError>, tokio::task::JoinError>,
) -> Response {
    match result {
        Ok(Ok(value)) => Json(value).into_response(),
        Ok(Err(error)) => (
            StatusCode::from_u16(error.status()).unwrap(),
            Json(error.json()),
        )
            .into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error":error.to_string(),"code":"file_worker_failed"})),
        )
            .into_response(),
    }
}

async fn local_file_content(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Json(body): Json<Value>,
) -> Response {
    let files = match file_http_scope(&core, &headers, &body).await {
        Ok(files) => files,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    file_worker_response(
        tokio::task::spawn_blocking(move || {
            files.local_content(body["path"].as_str().unwrap_or(""))
        })
        .await,
    )
}

async fn file_search_stream(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Json(body): Json<Value>,
) -> Response {
    let files = match file_http_scope(&core, &headers, &body).await {
        Ok(files) => files,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    match tokio::task::spawn_blocking(move || files.search_records(&body)).await {
        Ok(Ok(records)) => {
            let text = records
                .into_iter()
                .map(|row| row.to_string() + "\n")
                .collect::<String>();
            (
                [("Content-Type", "application/x-ndjson; charset=utf-8")],
                text,
            )
                .into_response()
        }
        Ok(Err(error)) => (
            StatusCode::from_u16(error.status()).unwrap(),
            Json(error.json()),
        )
            .into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error":error.to_string()})),
        )
            .into_response(),
    }
}

async fn file_media(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    Query(query): Query<HashMap<String, String>>,
) -> Response {
    let body = Value::Object(
        query
            .into_iter()
            .map(|(key, value)| (key, Value::String(value)))
            .collect(),
    );
    let files = match file_http_scope(&core, &headers, &body).await {
        Ok(files) => files,
        Err(error) => return (error.0, Json(error.1)).into_response(),
    };
    match tokio::task::spawn_blocking(move || files.media(body["path"].as_str().unwrap_or("")))
        .await
    {
        Ok(Ok((bytes, mime))) => (
            [("Content-Type", mime), ("Cache-Control", "no-store".into())],
            bytes,
        )
            .into_response(),
        Ok(Err(error)) => (
            StatusCode::from_u16(error.status()).unwrap(),
            Json(error.json()),
        )
            .into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error":error.to_string()})),
        )
            .into_response(),
    }
}

async fn frontend_event(core: &CoreHandle, line: String) -> Option<String> {
    let Ok(frame) = serde_json::from_str::<Value>(&line) else {
        return None;
    };
    let Some(key) = frame["workspaceId"].as_str() else {
        return Some(line);
    };
    if key == "default" {
        return Some(line);
    }
    // The original GUI isolates config/history/Unity state via this Hub envelope.
    // A closed workspace must not deliver late state changes to the active one.
    let workspace = core
        .store
        .lock()
        .await
        .opened()
        .into_iter()
        .find(|w| w.workspace_key == key)?;
    Some(json!({"hubWorkspaceKey":key,"workspaceRef":{"runOn":"local","workspaceDir":workspace.workspace_dir},"inner":frame}).to_string())
}

fn workspace_snapshot(core: &CoreHandle, store: &Store) -> Value {
    let mut snapshot = store.snapshot();
    let home = core
        .paths
        .home_workspace
        .to_string_lossy()
        .replace('\\', "/");
    if let Some(rows) = snapshot["workspaces"].as_array_mut() {
        for row in rows {
            if row["workspaceDir"]
                .as_str()
                .map(|p| p.replace('\\', "/").eq_ignore_ascii_case(&home))
                == Some(true)
            {
                row["isHomeWorkspace"] = json!(true);
            }
        }
    }
    snapshot
}

async fn unity_insight_http(
    State(core): State<CoreHandle>,
    headers: HeaderMap,
    RoutePath(operation): RoutePath<String>,
    Json(body): Json<Value>,
) -> Response {
    if !body.is_object() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"Index request must be an object"})),
        )
            .into_response();
    }
    if operation == "active-build" {
        let roots = core
            .store
            .lock()
            .await
            .opened()
            .into_iter()
            .map(|w| PathBuf::from(w.workspace_dir))
            .collect::<Vec<_>>();
        return insight_response(core.insight.active_build(&roots).await);
    }
    let scope = body["scope"].as_str().unwrap_or("workspace").to_owned();
    if !["user", "workspace"].contains(&scope.as_str()) {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"Invalid index settings scope"})),
        )
            .into_response();
    }
    if ["get-max-turns", "set-max-turns"].contains(&operation.as_str()) {
        let workspace = if scope == "user" {
            "default".to_owned()
        } else {
            match file_http_workspace(&core, &headers, &body).await {
                Ok(id) => id,
                Err(error) => return (error.0, Json(error.1)).into_response(),
            }
        };
        let mut bound = body;
        if scope == "workspace" {
            match workspace_root(&core, Some(&workspace)).await {
                Ok(root) => bound["workspaceDir"] = json!(root),
                Err(error) => {
                    return (StatusCode::NOT_FOUND, Json(json!({"error":error}))).into_response()
                }
            }
        } else {
            bound.as_object_mut().unwrap().remove("workspaceDir");
        }
        let method = if operation == "get-max-turns" {
            "unityInsight/getMaxTurns"
        } else {
            "unityInsight/setMaxTurns"
        };
        return match core_call(&core, method, bound, Some(&workspace)).await {
            Ok(value) => Json(value).into_response(),
            Err(error) => (StatusCode::BAD_REQUEST, Json(json!({"error":error}))).into_response(),
        };
    }
    if scope == "user" && ["get-enabled", "set-enabled"].contains(&operation.as_str()) {
        return insight_response(core.insight.handle(&operation, None, body).await);
    }
    let (workspace, root) = {
        let _guard = core.lifecycle.lock().await;
        let workspace = match file_http_workspace(&core, &headers, &body).await {
            Ok(id) => id,
            Err(error) => return (error.0, Json(error.1)).into_response(),
        };
        let root = match workspace_root(&core, Some(&workspace)).await {
            Ok(root) => PathBuf::from(root),
            Err(error) => {
                return (StatusCode::NOT_FOUND, Json(json!({"error":error}))).into_response()
            }
        };
        (workspace, root)
    };
    let result = core.insight.handle(&operation, Some(root), body).await;
    if workspace != "default"
        && !core
            .store
            .lock()
            .await
            .opened()
            .iter()
            .any(|w| w.workspace_key == workspace)
    {
        return (
            StatusCode::GONE,
            Json(
                json!({"error":"Workspace closed during index request","code":"workspace_closed"}),
            ),
        )
            .into_response();
    }
    insight_response(result)
}
fn insight_response(result: Result<Value, insight::InsightError>) -> Response {
    match result {
        Ok(value) => Json(value).into_response(),
        Err(error) => (
            StatusCode::from_u16(error.status()).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
            Json(error.json()),
        )
            .into_response(),
    }
}

fn local_asset_upload_origin(headers: &HeaderMap) -> bool {
    let Some(host) = headers.get("host").and_then(|value| value.to_str().ok()) else {
        return false;
    };
    let Ok(authority) = host.parse::<axum::http::uri::Authority>() else {
        return false;
    };
    if !matches!(
        authority.host(),
        "127.0.0.1" | "localhost" | "[::1]" | "::1"
    ) {
        return false;
    }
    headers.get("origin").and_then(|value| value.to_str().ok())
        == Some(format!("http://{host}").as_str())
}

#[cfg(test)]
mod asset_upload_origin_tests {
    use super::*;
    #[test]
    fn binary_upload_requires_its_exact_loopback_origin() {
        for host in ["127.0.0.1:43210", "localhost:43210", "[::1]:43210"] {
            let mut headers = HeaderMap::new();
            headers.insert("host", host.parse().unwrap());
            assert!(!local_asset_upload_origin(&headers));
            headers.insert("origin", format!("http://{host}").parse().unwrap());
            assert!(local_asset_upload_origin(&headers));
            for origin in ["null", "https://example.invalid", "http://127.0.0.1:43211"] {
                headers.insert("origin", origin.parse().unwrap());
                assert!(!local_asset_upload_origin(&headers));
            }
        }
        let mut headers = HeaderMap::new();
        headers.insert("host", "untrusted.invalid:43210".parse().unwrap());
        headers.insert("origin", "http://untrusted.invalid:43210".parse().unwrap());
        assert!(!local_asset_upload_origin(&headers));
    }
}

async fn asset_input_upload(
    State(core): State<CoreHandle>,
    Query(query): Query<HashMap<String, String>>,
    headers: HeaderMap,
    request: axum::extract::Request,
) -> Response {
    if !local_asset_upload_origin(&headers) {
        return (
            StatusCode::FORBIDDEN,
            Json(json!({"error":"Reference upload requires the local application origin"})),
        )
            .into_response();
    }
    let filename = query.get("filename").cloned().unwrap_or_default();
    if filename.is_empty()
        || filename.len() > 1024
        || filename.chars().count() > 255
        || filename
            .chars()
            .any(|character| character.is_control() || character == '/' || character == '\\')
        || matches!(filename.as_str(), "." | "..")
    {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"A plain reference filename is required"})),
        )
            .into_response();
    }
    let workspace_key = query.get("workspaceKey").cloned().unwrap_or_default();
    if workspace_key.len() > 8192 {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"Workspace key is too long"})),
        )
            .into_response();
    }
    let route = json!({"workspaceKey":workspace_key});
    if !workspace_key.is_empty() {
        if let Err(error) = route_workspace(&core, &route, &route).await {
            return (StatusCode::BAD_REQUEST, Json(json!({"error":error}))).into_response();
        }
    }
    if headers
        .get("content-length")
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.parse::<u64>().ok())
        .is_some_and(|length| length > generated_assets::LIMIT)
    {
        return (
            StatusCode::PAYLOAD_TOO_LARGE,
            Json(json!({"error":"Reference file exceeds 64 MiB"})),
        )
            .into_response();
    }
    static UPLOADS: OnceLock<Arc<tokio::sync::Semaphore>> = OnceLock::new();
    let semaphore = UPLOADS
        .get_or_init(|| Arc::new(tokio::sync::Semaphore::new(2)))
        .clone();
    let Ok(Ok(_permit)) =
        tokio::time::timeout(Duration::from_secs(120), semaphore.acquire_owned()).await
    else {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({"error":"Reference upload queue is busy; retry"})),
        )
            .into_response();
    };
    let bytes = match tokio::time::timeout(
        Duration::from_secs(120),
        axum::body::to_bytes(request.into_body(), generated_assets::LIMIT as usize),
    )
    .await
    {
        Ok(Ok(bytes)) if !bytes.is_empty() => bytes,
        Ok(Ok(_)) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({"error":"Reference file is empty"})),
            )
                .into_response()
        }
        Ok(Err(_)) => {
            return (
                StatusCode::PAYLOAD_TOO_LARGE,
                Json(json!({"error":"Reference body was interrupted or exceeds 64 MiB"})),
            )
                .into_response()
        }
        Err(_) => {
            return (
                StatusCode::REQUEST_TIMEOUT,
                Json(json!({"error":"Reference upload timed out"})),
            )
                .into_response()
        }
    };
    let home = core.paths.core_home.clone();
    let result = async {
        let staged = tokio::task::spawn_blocking(move || {
            generated_assets::stage_input(&home, &filename, &bytes)
        })
        .await
        .map_err(|error| error.to_string())??;
        if !workspace_key.is_empty() {
            route_workspace(&core, &route, &route).await?;
        }
        // Only this host creates the staging identity. Neither an HTTP caller
        // nor a Provider supplies a filesystem path to the registration handler.
        let result = core_call(
            &core,
            "_gamecowork/assetRegisterInput",
            staged.registration(&workspace_key),
            Some("default"),
        )
        .await;
        drop(staged);
        result
    }
    .await;
    match result {
        Ok(value) => (StatusCode::CREATED, Json(value)).into_response(),
        Err(error) => (StatusCode::BAD_REQUEST, Json(json!({"error":error}))).into_response(),
    }
}

fn build_router(core: CoreHandle) -> Router {
    let dist = core.paths.frontend.clone();
    let local_api = Router::<CoreHandle>::new()
        .route(
            "/api/codely-generator/*operation",
            any(codely_http::generator),
        )
        .route("/codely-canvas/api/*operation", any(codely_http::canvas))
        .layer(axum::middleware::map_response(
            |mut response: Response| async move {
                response
                    .headers_mut()
                    .insert("Cache-Control", "no-store".parse().unwrap());
                response
            },
        ));
    let original_pages = Router::<CoreHandle>::new()
        .route_service(
            "/lab3d",
            tower_http::services::ServeFile::new(dist.join("codely-generator/index.html")),
        )
        .route_service(
            "/generation-history",
            tower_http::services::ServeFile::new(dist.join("codely-generator/index.html")),
        )
        .route_service(
            "/codely-canvas/home",
            tower_http::services::ServeFile::new(dist.join("codely-canvas/index.html")),
        )
        .route_service(
            "/codely-canvas/explore",
            tower_http::services::ServeFile::new(dist.join("codely-canvas/index.html")),
        )
        .route_service(
            "/codely-canvas/login",
            tower_http::services::ServeFile::new(dist.join("codely-canvas/index.html")),
        )
        .route_service(
            "/codely-canvas/canvas",
            tower_http::services::ServeFile::new(dist.join("codely-canvas/index.html")),
        )
        .route_service(
            "/codely-canvas/canvas/*path",
            tower_http::services::ServeFile::new(dist.join("codely-canvas/index.html")),
        )
        .layer(axum::middleware::map_response(
            |mut response: Response| async move {
                response.headers_mut().insert(
                    "Content-Security-Policy",
                    "frame-ancestors 'self'".parse().unwrap(),
                );
                response
                    .headers_mut()
                    .insert("Cache-Control", "no-store".parse().unwrap());
                response
            },
        ));
    Router::new()
        .merge(original_pages)
        .merge(local_api)
        .route("/api/tauri/invoke",post(invoke))
        .route("/api/tauri/generator/inputs",post(asset_input_upload))
        .route("/api/tauri/file-explorer",get(file_explorer_get).post(file_explorer_post))
        .route("/api/tauri/file-explorer/events",get(file_explorer_events))
        .route("/api/tauri/terminal",get(terminal_upgrade))
        .route("/api/tauri/file-explorer/search-stream",post(file_search_stream))
        .route("/api/tauri/file-explorer/media",get(file_media))
        .route("/api/tauri/unity-insight/:operation",post(unity_insight_http))
        .route("/api/tauri/local-file-content",post(local_file_content))
        .route("/api/tauri/file-changes/undo",post(undo_file_change))
        .route("/api/tauri/events",get(|State(c):State<CoreHandle>|async move {
            let stream=BroadcastStream::new(c.events_tx.subscribe()).filter_map(move|item| {
                let c=c.clone(); async move {
                    let line=match item {Ok(line)=>frontend_event(&c,line).await?,Err(_)=>return None};
                    Some(Ok::<_,std::convert::Infallible>(SseEvent::default().data(line)))
                }
            });Sse::new(stream).keep_alive(KeepAlive::default())
        }))
        .route("/api/tauri/status",get(|State(c):State<CoreHandle>|async move{
            let mut status=c.paths.instance.as_ref().map(|instance|instance.status()).unwrap_or(json!({}));
            status["status"]=json!("ok");status["embed_mode"]=json!(false);status["product"]=json!("GameCowork");
            status["version"]=json!(env!("CARGO_PKG_VERSION"));status["mode"]=json!("local");
            status["desktopWindow"]=json!(c.proxy.is_some());Json(status)
        }))
        .route("/api/tauri/activate-instance",post(activate_instance))
        .route("/api/tauri/capabilities",get(||async{Json(json!({"localWorkspaces":true,"localAccount":true,"fileExplorer":true,"interactiveTerminal":true,
            "remoteWorkspaces":false,"editorTemplates":true,"editorTemplateSource":"installed-editor","editorStreaming":false,"editorRenderedViews":true,"editorRenderedViewTypes":["SceneView","GameView"],"editorFrameTransport":"image-frames","fullEditorWindowStreaming":false,"mediaProviders":"custom-rest","mediaProviderKinds":["image","video","model"]}))}))
        .route("/api/tauri/hub/workspaces",get(|State(c):State<CoreHandle>|async move {
            let store=c.store.lock().await;Json(workspace_snapshot(&c,&store))
        }))
        .route("/api/tauri/recent-projects",get(|State(c):State<CoreHandle>|async move {Json(json!(c.store.lock().await.recent()))}))
        .route("/api/tauri/workspace-dir",get(|State(c):State<CoreHandle>|async move {Json(json!({"dir":c.store.lock().await.active().map(|w|w.workspace_dir)}))}))
        .route("/api/tauri/hub/open-workspace",post(open_workspace))
        .route("/api/tauri/hub/close-workspace",post(close_workspace))
        .route("/api/tauri/hub/switch-workspace",post(switch_workspace))
        .route("/api/tauri/hub/reorder-workspaces",post(|State(c):State<CoreHandle>,Json(body):Json<Value>|async move {
            let keys=body["workspaceKeys"].as_array().into_iter().flatten().filter_map(Value::as_str).map(str::to_owned).collect::<Vec<_>>();
            match c.store.lock().await.reorder(&keys) {Ok(())=>Json(json!({"ok":true})).into_response(),Err(e)=>(StatusCode::BAD_REQUEST,Json(json!({"ok":false,"error":e}))).into_response()}
        }))
        .route("/api/tauri/pick-folder",post(pick_folder_empty))
        .route("/api/tauri/pick-folder-modal",post(pick_folder))
        .route("/api/tauri/pick-file-modal",post(pick_file))
        .route("/api/tauri/reveal-in-file-explorer",post(|State(c):State<CoreHandle>,Json(body):Json<Value>|async move {
            if c.paths.test_mode {return Json(json!({"ok":true}));}
            let p=body["path"].as_str().unwrap_or("");
            let result=std::process::Command::new("explorer.exe").arg(format!("/select,{p}")).spawn();
            Json(match result {Ok(_)=>json!({"ok":true}),Err(e)=>json!({"ok":false,"error":e.to_string()})})
        }))
        .route("/api/tauri/minimize-window",post(|State(c):State<CoreHandle>|async move{window_event(&c,ShellEvent::MinimizeWindow)}))
        .route("/api/tauri/start-dragging",post(|State(c):State<CoreHandle>|async move{window_event(&c,ShellEvent::StartDragging)}))
        .route("/api/tauri/window-state",get(|State(c):State<CoreHandle>|async move {
            let Some(proxy)=&c.proxy else{return Json(json!({"ok":false,"error":"No desktop window in headless mode"}));};
            let (send,receive)=tokio::sync::oneshot::channel();
            if proxy.send_event(ShellEvent::WindowState(send)).is_err(){return Json(json!({"ok":false,"error":"Desktop window is closed"}));}
            Json(match tokio::time::timeout(Duration::from_secs(2),receive).await {
                Ok(Ok(value))=>value,_=>json!({"ok":false,"error":"Desktop window state timed out"})
            })
        }))
        .route("/api/tauri/toggle-maximize-window",post(|State(c):State<CoreHandle>|async move{window_event(&c,ShellEvent::ToggleMaximize)}))
        .route("/api/tauri/focus-window",post(|State(c):State<CoreHandle>|async move{window_event(&c,ShellEvent::FocusWindow)}))
        .route("/api/tauri/close-window",post(|State(c):State<CoreHandle>|async move{window_event(&c,ShellEvent::CloseWindow)}))
        .route("/api/tauri/*rest",any(||async{(StatusCode::NOT_IMPLEMENTED,Json(json!({"ok":false,"error":"Host route is not implemented yet"})))}))
        .fallback_service(tower_http::services::ServeDir::new(dist).append_index_html_on_directories(true))
        .with_state(core)
}
fn window_event(c: &CoreHandle, event: ShellEvent) -> Json<Value> {
    match &c.proxy {
        Some(proxy) => Json(json!({"ok":proxy.send_event(event).is_ok()})),
        None => Json(json!({"ok":false,"error":"No desktop window in headless mode"})),
    }
}

async fn activate_instance(State(core): State<CoreHandle>, Json(body): Json<Value>) -> Response {
    if !core
        .paths
        .instance
        .as_ref()
        .is_some_and(|instance| instance.matches(&body["instanceId"]))
    {
        return (
            StatusCode::CONFLICT,
            Json(json!({"ok":false,"error":"Application instance changed"})),
        )
            .into_response();
    }
    let workspace = match body.get("workspace") {
        None | Some(Value::Null) => None,
        Some(Value::String(path)) if !path.is_empty() => {
            match open_local_workspace(&core, path).await {
                Ok(workspace) => Some(workspace),
                Err(error) => {
                    return (
                        StatusCode::BAD_REQUEST,
                        Json(json!({"ok":false,"error":error})),
                    )
                        .into_response()
                }
            }
        }
        _ => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({"ok":false,"error":"Launch workspace must be a directory path"})),
            )
                .into_response()
        }
    };
    let activation = if let Some(proxy) = &core.proxy {
        let (send, receive) = tokio::sync::oneshot::channel();
        if proxy.send_event(ShellEvent::ActivateWindow(send)).is_ok() {
            match tokio::time::timeout(Duration::from_secs(2), receive).await {
                Ok(Ok(value)) => value,
                _ => json!({"focusRequested":true,"focused":false}),
            }
        } else {
            json!({"focusRequested":false,"focused":false})
        }
    } else {
        json!({"focusRequested":false,"focused":false})
    };
    Json(json!({"ok":true,"focusRequested":activation["focusRequested"],"focused":activation["focused"],"workspace":workspace})).into_response()
}

async fn prepare_core(
    paths: Arc<RuntimePaths>,
    store: Arc<Mutex<Store>>,
    proxy: Option<EventLoopProxy<ShellEvent>>,
) -> Result<(CoreHandle, Child), String> {
    let (core, child) = spawn_core(paths.clone(), store.clone(), proxy).await?;
    core.insight.open_workspace(&paths.home_workspace).await;
    register_lsp_workspace(&core, "default", &paths.home_workspace).await;
    // Prewarming keeps a default project from starting against an undefined path.
    core_call(
        &core,
        "initWorkspace",
        json!({"workspaceId":"default","workspace":paths.home_workspace,"autoLoadConfig":false}),
        None,
    )
    .await?;
    let opened = store.lock().await.opened();
    for w in opened {
        core_call(&core,"initWorkspace",json!({"workspaceId":w.workspace_key,"workspace":w.workspace_dir,"autoLoadConfig":false}),None).await?;
        core.insight
            .open_workspace(std::path::Path::new(&w.workspace_dir))
            .await;
        register_lsp_workspace(
            &core,
            &w.workspace_key,
            std::path::Path::new(&w.workspace_dir),
        )
        .await;
    }
    Ok((core, child))
}

static START_URL: OnceLock<Result<String, String>> = OnceLock::new();
#[cfg(test)]
mod mutation_scope_tests {
    use super::*;
    #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
    async fn closing_waits_for_inflight_disk_write_and_rejects_stale_queued_write() {
        let base = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests");
        let run = base.join(format!("scope-lease-{}", uuid::Uuid::new_v4()));
        let project = run.join("workspace");
        std::fs::create_dir_all(&project).unwrap();
        std::fs::write(project.join("file.txt"), "before").unwrap();
        let mut state = Store::load(run.join("workspaces.json"), None).unwrap();
        let key = state.open(project.to_str().unwrap()).unwrap().workspace_key;
        let store = Arc::new(Mutex::new(state));
        let service = mutations::Mutations::new(&project, &run.join("changes")).unwrap();
        let (entered_tx, entered_rx) = tokio::sync::oneshot::channel();
        let (resume_tx, resume_rx) = std::sync::mpsc::channel();
        let worker_store = store.clone();
        let worker_key = key.clone();
        let writer = tokio::task::spawn_blocking(move || {
            scoped_mutation(&worker_store, &worker_key, || {
                entered_tx.send(()).unwrap();
                resume_rx.recv().unwrap();
                service.write_text(
                    "file.txt",
                    "authorized write",
                    mutations::WriteOptions {
                        overwrite: true,
                        ..Default::default()
                    },
                )
            })
        });
        entered_rx.await.unwrap();
        let closing_store = store.clone();
        let closing_key = key.clone();
        let closer = tokio::spawn(async move {
            closing_store.lock().await.close(&closing_key).unwrap();
        });
        tokio::time::sleep(Duration::from_millis(20)).await;
        assert!(
            !closer.is_finished(),
            "Close must wait for the actual disk operation lease"
        );
        resume_tx.send(()).unwrap();
        assert!(writer.await.unwrap().is_ok());
        closer.await.unwrap();
        let stale_store = store.clone();
        let stale_key = key.clone();
        let stale = tokio::task::spawn_blocking(move || {
            scoped_mutation(&stale_store, &stale_key, || {
                panic!("A queued operation must not touch a closed workspace");
            })
        })
        .await
        .unwrap()
        .unwrap_err();
        assert_eq!(stale.0, 409);
        assert_eq!(stale.1["applied"], false);
        assert_eq!(
            std::fs::read_to_string(project.join("file.txt")).unwrap(),
            "authorized write"
        );
        assert!(run
            .canonicalize()
            .unwrap()
            .starts_with(base.canonicalize().unwrap()));
        std::fs::remove_dir_all(run).unwrap();
    }
}

fn main() {
    let startup_workspace = single_instance::workspace_argument(std::env::args_os().skip(1))
        .unwrap_or_else(|error| {
            eprintln!("{error}");
            std::process::exit(1)
        });
    let mut paths = RuntimePaths::load().unwrap_or_else(|e| {
        eprintln!("{e}");
        std::process::exit(1)
    });
    let instance = match single_instance::launch(&paths.data, startup_workspace.as_deref()) {
        Ok(single_instance::Launch::Primary(instance)) => Arc::new(instance),
        Ok(single_instance::Launch::Forwarded(result)) => {
            println!("[shell] Activated running instance: {result}");
            return;
        }
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1)
        }
    };
    paths.instance = Some(instance.clone());
    let paths = Arc::new(paths);
    let legacy = if std::env::var_os("GAMECOWORK_DATA_DIR").is_none() {
        Some(paths.root.join("workspace.txt"))
    } else {
        None
    };
    let store = Arc::new(Mutex::new(
        Store::load(paths.data.join("workspaces.json"), legacy).unwrap_or_else(|e| {
            eprintln!("Cannot load workspace state: {e}");
            std::process::exit(1)
        }),
    ));
    let runtime = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap();
    if paths.headless {
        runtime.block_on(async move {
            let (core,mut child)=prepare_core(paths,store,None).await.expect("prepare core");
            if let Some(workspace)=&startup_workspace {
                if let Err(error)=open_local_workspace(&core,workspace).await {
                    eprintln!("Cannot open launch workspace: {error}");core.keep_awake.shutdown();
                    core.insight.shutdown().await;if let Some(lsp)=&core.lsp{lsp.shutdown().await;}
                    let _=child.kill().await;std::process::exit(1);
                }
            }
            let listener=tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
            instance.publish(listener.local_addr().unwrap().port()).expect("publish application instance");
            println!("[shell] HTTP: http://{}/",listener.local_addr().unwrap());
            let server=axum::serve(listener,build_router(core.clone()));
            tokio::select! {result=server=>{let _=result;},_=tokio::signal::ctrl_c()=>{},_=child.wait()=>{core.transport.fail_pending("core exited").await;}}
            core.keep_awake.shutdown();
            core.insight.shutdown().await;
            if let Some(lsp)=&core.lsp{lsp.shutdown().await;}
            let _=child.kill().await;
        });
        return;
    }
    let event_loop = tao::event_loop::EventLoopBuilder::<ShellEvent>::with_user_event().build();
    let proxy = event_loop.create_proxy();
    let server_paths = paths.clone();
    let server_instance = instance.clone();
    runtime.spawn(async move {
        match prepare_core(server_paths,store,Some(proxy)).await {
            Ok((core,mut child))=>{
                if let Some(workspace)=&startup_workspace {
                    if let Err(error)=open_local_workspace(&core,workspace).await {
                        let _=START_URL.set(Err(format!("Cannot open launch workspace: {error}")));
                        core.keep_awake.shutdown();core.insight.shutdown().await;
                        if let Some(lsp)=&core.lsp{lsp.shutdown().await;}let _=child.kill().await;return;
                    }
                }
                let listener=match tokio::net::TcpListener::bind("127.0.0.1:0").await{Ok(v)=>v,Err(e)=>{let _=START_URL.set(Err(e.to_string()));return;}};
                if let Err(error)=server_instance.publish(listener.local_addr().unwrap().port()) {
                    let _=START_URL.set(Err(error));core.keep_awake.shutdown();
                    core.insight.shutdown().await;if let Some(lsp)=&core.lsp{lsp.shutdown().await;}
                    let _=child.kill().await;return;
                }
                let addr=listener.local_addr().unwrap();println!("[shell] HTTP: http://{addr}/");
                let _=START_URL.set(Ok(format!("http://{addr}/")));
                tokio::select!{_=axum::serve(listener,build_router(core.clone()))=>{},_=child.wait()=>{core.transport.fail_pending("core exited").await;}}
                core.keep_awake.shutdown();
                core.insight.shutdown().await;
                if let Some(lsp)=&core.lsp{lsp.shutdown().await;}
            },Err(e)=>{let _=START_URL.set(Err(e));}
        }
    });
    let started = Instant::now();
    let url = loop {
        if let Some(result) = START_URL.get() {
            match result {
                Ok(url) => break url.clone(),
                Err(e) => {
                    eprintln!("{e}");
                    return;
                }
            }
        }
        if started.elapsed() > Duration::from_secs(60) {
            eprintln!("Application startup timed out");
            return;
        }
        std::thread::sleep(Duration::from_millis(25));
    };
    std::env::set_var("WEBVIEW2_USER_DATA_FOLDER", paths.data.join("WebView2"));
    let frameless = std::env::var("GAMECOWORK_FRAMELESS_WINDOW").ok().as_deref() == Some("1");
    let window = std::rc::Rc::new(
        tao::window::WindowBuilder::new()
            .with_title("GameCowork")
            .with_decorations(!frameless)
            .with_resizable(true)
            .with_inner_size(LogicalSize::new(1440.0, 900.0))
            .build(&event_loop)
            .expect("window"),
    );
    let ipc_window = window.clone();
    let ipc_origin = url
        .parse::<axum::http::Uri>()
        .expect("local window URL")
        .authority()
        .expect("local window authority")
        .as_str()
        .to_owned();
    let webview = wry::WebViewBuilder::new(window.as_ref())
        .with_url(&url)
        .with_initialization_script(&format!(
            "window.GAMECOWORK_FRAMELESS_WINDOW={frameless};\n{}",
            include_str!("native_window.js")
        ))
        .with_ipc_handler(move |request| {
            if request.uri().scheme_str() != Some("http")
                || !matches!(request.uri().path(), "/" | "/index.html" | "/gui.html")
                || request.uri().authority().map(|value| value.as_str())
                    != Some(ipc_origin.as_str())
            {
                return;
            }
            if request.body() == "gamecowork.window.start-dragging" {
                if let Err(error) = native_window::start_dragging(ipc_window.as_ref()) {
                    eprintln!("Native window dragging failed: {error}");
                }
            }
        })
        .build()
        .expect("webview");
    event_loop.run(move |event, _, control_flow| {
        let _ = &webview;
        let _ = &instance;
        *control_flow = ControlFlow::Wait;
        match event {
            Event::UserEvent(ShellEvent::WindowState(reply)) => {
                let size=window.inner_size();
                let position=window.outer_position().ok();
                let _=reply.send(json!({"ok":true,"maximized":window.is_maximized(),"minimized":window.is_minimized(),
                    "width":size.width,"height":size.height,"scaleFactor":window.scale_factor(),"focused":window.is_focused(),
                    "x":position.map(|p|p.x),"y":position.map(|p|p.y)}));
            }
            Event::UserEvent(ShellEvent::StartDragging) => {
                if let Err(error) = native_window::start_dragging(window.as_ref()) {
                    eprintln!("Native window dragging failed: {error}");
                }
            }
            Event::UserEvent(ShellEvent::MinimizeWindow) => window.set_minimized(true),
            Event::UserEvent(ShellEvent::ToggleMaximize) => {
                window.set_maximized(!window.is_maximized())
            }
            Event::UserEvent(ShellEvent::FocusWindow) => {
                window.set_visible(true);window.set_minimized(false);window.set_focus();
            },
            Event::UserEvent(ShellEvent::ActivateWindow(reply)) => {
                window.set_visible(true);window.set_minimized(false);window.set_focus();
                let _=reply.send(json!({"focusRequested":true,"focused":window.is_focused()}));
            },
            Event::UserEvent(ShellEvent::CloseWindow) => *control_flow = ControlFlow::Exit,
            Event::WindowEvent {
                event: WindowEvent::CloseRequested,
                ..
            } => *control_flow = ControlFlow::Exit,
            _ => {}
        }
    });
}
