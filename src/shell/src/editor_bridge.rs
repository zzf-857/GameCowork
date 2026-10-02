//! Direct local Editor bridge transport. Preview does not require an LLM session.
use serde_json::{json, Value};
use std::{
    path::{Path, PathBuf},
    time::Duration,
};
use tokio::{
    io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader},
    net::TcpStream,
};
const MAX_FRAME: usize = 1024 * 1024;
fn normalize(path: &Path) -> String {
    crate::files::display(path)
        .trim_end_matches('/')
        .to_lowercase()
}
fn config(root: &Path) -> Result<(String, u16, PathBuf), String> {
    let root = root
        .canonicalize()
        .map_err(|_| "Editor project is unavailable")?;
    let scope =
        crate::files::Files::new(&root, std::slice::from_ref(&root)).map_err(|e| e.to_string())?;
    let source=scope.read_file("Temp/.com-unity-gamecowork.json","utf8").map_err(|_|"GameCowork Editor Bridge is not connected. Install the local cn.gamecowork.bridge package and open this project.")?;
    let data: Value =
        serde_json::from_str(&source).map_err(|_| "Invalid Editor bridge connection file")?;
    let host = data["unity_host"]
        .as_str()
        .ok_or("Editor bridge host is missing")?;
    if !matches!(host, "127.0.0.1" | "localhost" | "::1") {
        return Err("Editor bridge must listen on loopback".into());
    }
    let port = data["unity_port"]
        .as_u64()
        .and_then(|v| u16::try_from(v).ok())
        .filter(|v| *v > 0)
        .ok_or("Invalid Editor bridge port")?;
    if data["reason"] != "GameCowork local editor bridge" {
        return Err("Connection file is not owned by the GameCowork local bridge".into());
    }
    let assets = PathBuf::from(
        data["project_path"]
            .as_str()
            .ok_or("Editor bridge project is missing")?,
    )
    .canonicalize()
    .map_err(|_| "Editor bridge project is unavailable")?;
    if normalize(&assets)
        != normalize(
            &root
                .join("Assets")
                .canonicalize()
                .map_err(|_| "Unity Assets directory is unavailable")?,
        )
    {
        return Err("Editor bridge belongs to another project".into());
    }
    Ok((host.to_owned(), port, root))
}
pub async fn request(root: PathBuf, kind: &str, options: &Value) -> Result<Value, String> {
    let action = match kind {
        "unity/windowBridge/listWindows" => "list_windows",
        "unity/windowBridge/startStreamServer" => "start_stream_server",
        "unity/windowBridge/stopStreamServer" => "stop_stream_server",
        "unity/windowBridge/getStreamServerStatus" => "get_stream_server_status",
        _ => return Err("Unsupported local Editor bridge request".into()),
    };
    let mut params = json!({"action":action});
    if action == "start_stream_server" {
        if let Some(value) = options.get("port") {
            let port = value
                .as_u64()
                .and_then(|port| u16::try_from(port).ok())
                .ok_or("Invalid requested preview port")?;
            params["port"] = json!(port);
        }
    }
    let actual_root = root
        .canonicalize()
        .map_err(|_| "Editor project is unavailable")?;
    let data = rpc(root, "manage_window_bridge", params).await?;
    validate_stream(action, data, &actual_root)
}
pub async fn invoke_local_tool(
    root: PathBuf,
    command: &str,
    params: &Value,
) -> Result<Value, String> {
    let action = params["action"].as_str().unwrap_or("");
    if command == "manage_window_bridge" && action == "stop_offscreen_stream" {
        let stopped = request(root, "unity/windowBridge/stopStreamServer", &json!({})).await?;
        return Ok(
            json!({"status":"success","response":{"success":true,"data":stopped["content"]}}),
        );
    }
    if command == "manage_editor"
        && matches!(action, "play" | "pause" | "resume" | "stop" | "refresh")
    {
        let seconds = match params.get("timeoutSeconds") {
            None => 60,
            Some(value) => value
                .as_u64()
                .filter(|value| (1..=180).contains(value))
                .ok_or("timeoutSeconds must be an integer in 1..180")?,
        };
        if action == "resume" && !params["singleFrame"].is_boolean() {
            return Err("singleFrame must be a boolean for resume".into());
        }
        let mut options = params.clone();
        options["timeoutSeconds"] = json!(seconds);
        let data = rpc(root.clone(), command, options).await?;
        let data = wait_control(
            root,
            action,
            action == "resume" && params["singleFrame"] == true,
            data,
            seconds,
        )
        .await?;
        return Ok(json!({"status":"success","response":{"success":true,"data":data}}));
    }
    if !((command == "manage_editor"
        && matches!(
            action,
            "get_state"
                | "get_project_root"
                | "get_selection"
                | "get_windows"
                | "get_tags"
                | "get_layers"
                | "get_active_tool"
        ))
        || (command == "manage_scene" && action == "get_hierarchy")
        || (command == "manage_gameobject"
            && matches!(action, "find" | "list_children" | "get_components"))
        || (command == "read_console" && action == "get")
        || (command == "manage_asset" && matches!(action, "search" | "get_info"))
        || (command == "manage_package" && action == "list_packages")
        || (command == "_internal_asset_listening" && action == "status"))
    {
        return Err("This local Editor bridge command is not implemented yet".into());
    }
    let data = rpc(root, command, params.clone()).await?;
    Ok(json!({"status":"success","response":{"success":true,"data":data}}))
}
async fn wait_control(
    root: PathBuf,
    action: &str,
    single_frame: bool,
    mut state: Value,
    seconds: u64,
) -> Result<Value, String> {
    let operation = state["operationId"]
        .as_str()
        .filter(|value| !value.is_empty())
        .ok_or("Editor control acceptance has no operation identity")?
        .to_owned();
    let deadline = tokio::time::Instant::now() + Duration::from_secs(seconds);
    loop {
        if state["operationId"] != operation || state["controlAction"] != action {
            return Err("Editor control identity changed while awaiting its result".into());
        }
        if state["controlStatus"] == "error" {
            return Err(state["controlError"]
                .as_str()
                .unwrap_or("Editor control operation failed")
                .to_owned());
        }
        if state["controlStatus"] == "completed" && state["pending"] == false {
            let expected = match action {
                "play" => "playing",
                "pause" => "paused",
                "resume" if single_frame => "paused",
                "resume" => "playing",
                "stop" | "refresh" => "stopped",
                _ => return Err("Unsupported Editor control action".into()),
            };
            if state["playMode"] != expected
                || state["isCompiling"] != false
                || state["isUpdating"] != false
                || (single_frame
                    && (state["runtimeFrame"].as_i64().unwrap_or(-1)
                        <= state["startFrame"].as_i64().unwrap_or(i64::MAX)))
            {
                return Err(
                    "Editor completed control without reaching the requested real state".into(),
                );
            }
            return Ok(state);
        }
        if state["pending"] != true || state["controlStatus"] != "pending" {
            return Err("Editor control returned an invalid pending state".into());
        }
        let remaining = deadline.saturating_duration_since(tokio::time::Instant::now());
        if remaining.is_zero() {
            return Err(format!(
                "Editor control {action} timed out; operation {operation} may still be pending"
            ));
        }
        tokio::time::sleep(Duration::from_millis(100).min(remaining)).await;
        let remaining = deadline.saturating_duration_since(tokio::time::Instant::now());
        match tokio::time::timeout(
            remaining,
            rpc(root.clone(), "manage_editor", json!({"action":"get_state"})),
        )
        .await
        {
            Ok(Ok(next)) => state = next,
            Ok(Err(error)) if control_reload_error(&error) => {}
            Ok(Err(error)) => return Err(error),
            Err(_) => {
                return Err(format!(
                    "Editor control {action} timed out; operation {operation} may still be pending"
                ))
            }
        }
    }
}
fn control_reload_error(error: &str) -> bool {
    error.starts_with("GameCowork Editor Bridge is not connected")
        || matches!(
            error,
            "Editor bridge is offline"
                | "Editor bridge response ended early"
                | "Editor bridge response is incomplete"
                | "Editor bridge request timed out"
        )
        || error.contains("os error 10054")
        || error.contains("os error 10053")
}
async fn rpc(root: PathBuf, command: &str, params: Value) -> Result<Value, String> {
    let (host, port, root) = tokio::task::spawn_blocking(move || config(&root))
        .await
        .map_err(|_| "Editor discovery worker failed")??;
    let task = async {
        let socket = TcpStream::connect((host.as_str(), port))
            .await
            .map_err(|_| "Editor bridge is offline")?;
        socket.set_nodelay(true).map_err(|e| e.to_string())?;
        let mut stream = BufReader::new(socket);
        let mut welcome = Vec::new();
        // One bounded line precedes the length-framed protocol.
        let n = (&mut stream)
            .take(4097)
            .read_until(b'\n', &mut welcome)
            .await
            .map_err(|e| e.to_string())?;
        if n > 4096 || !welcome.ends_with(b"\n") {
            return Err("Invalid Editor bridge handshake".into());
        }
        let banner =
            String::from_utf8(welcome).map_err(|_| "Invalid Editor bridge handshake encoding")?;
        if !banner.starts_with("WELCOME UNITY-TCP ")
            || !banner.split_whitespace().any(|part| part == "FRAMING=1")
            || !banner
                .split_whitespace()
                .any(|part| part == "SERVER_VERSION=2")
        {
            return Err("Editor bridge protocol version is unsupported".into());
        }
        let reported = banner
            .split_whitespace()
            .find_map(|part| part.strip_prefix("PROJECT_ROOT="))
            .ok_or("Editor bridge handshake is missing project identity")?;
        // The bridge escapes the absolute root as URI bytes, not a file:// URL.
        let project = decode_percent(reported)?;
        let project =
            crate::files::parse_path(&project).map_err(|_| "Invalid bridge project identity")?;
        let project = PathBuf::from(project)
            .canonicalize()
            .map_err(|_| "Handshake project is unavailable")?;
        if normalize(&project) != normalize(&root) {
            return Err("Editor handshake belongs to another project".into());
        }
        let write = async |stream: &mut BufReader<TcpStream>, value: &[u8]| -> Result<(), String> {
            stream
                .get_mut()
                .write_all(&(value.len() as u64).to_be_bytes())
                .await
                .map_err(|e| e.to_string())?;
            stream
                .get_mut()
                .write_all(value)
                .await
                .map_err(|e| e.to_string())?;
            Ok(())
        };
        write(&mut stream, b"CLIENT_VERSION=2").await?;
        write(&mut stream, b"PLATFORM=cli").await?;
        let id = uuid::Uuid::new_v4().to_string();
        let message = json!({"type":command,"params":params,"request_id":id}).to_string();
        write(&mut stream, message.as_bytes()).await?;
        for _ in 0..8 {
            let size = stream
                .read_u64()
                .await
                .map_err(|_| "Editor bridge response ended early")?;
            if size == 0 || size as usize > MAX_FRAME {
                return Err("Editor bridge response exceeds its limit".into());
            }
            let mut bytes = vec![0; size as usize];
            stream
                .read_exact(&mut bytes)
                .await
                .map_err(|_| "Editor bridge response is incomplete")?;
            let reply: Value = serde_json::from_slice(&bytes)
                .map_err(|_| "Editor bridge returned invalid JSON")?;
            if reply["request_id"] != id {
                continue;
            }
            let result = &reply["result"];
            if result["success"] != true {
                return Err(result["error"]
                    .as_str()
                    .unwrap_or("Editor bridge operation failed")
                    .into());
            }
            let data = result
                .get("data")
                .cloned()
                .ok_or("Editor bridge response has no data")?;
            return Ok(data);
        }
        Err("Editor bridge did not answer this request".into())
    };
    tokio::time::timeout(Duration::from_secs(15), task)
        .await
        .map_err(|_| "Editor bridge request timed out")?
}
fn validate_stream(action: &str, data: Value, root: &Path) -> Result<Value, String> {
    if action == "list_windows" {
        if !data.is_array() {
            return Err("Editor window list is invalid".into());
        }
        return Ok(json!({"status":"success","content":{"windows":data}}));
    }
    if data["status"] == "error" {
        return Err(data["error"]
            .as_str()
            .unwrap_or("Editor stream failed")
            .into());
    }
    if !data.is_object() || data["status"] != "success" || !data["running"].is_boolean() {
        return Err("Editor stream state is incomplete".into());
    }
    let identity = data["projectRoot"]
        .as_str()
        .and_then(|path| PathBuf::from(path).canonicalize().ok());
    if identity.as_ref().map(|path| normalize(path)) != Some(normalize(&root))
        || data["pid"]
            .as_u64()
            .filter(|pid| *pid > 0 && *pid <= u32::MAX as u64)
            .is_none()
    {
        return Err("Editor stream descriptor has invalid project or process identity".into());
    }
    if action == "start_stream_server" {
        if data["transport"] != "image-frames"
            || data["running"] != true
            || !valid_stream_url(data["signalingUrl"].as_str().unwrap_or(""))
        {
            return Err(
                "Editor stream descriptor is incomplete or not a local capability URL".into(),
            );
        }
    }
    Ok(json!({"status":"success","content":data}))
}

fn valid_stream_url(value: &str) -> bool {
    static FORMAT: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    let expression=FORMAT.get_or_init(||regex::Regex::new(r"^http://(?:127\.0\.0\.1|localhost|\[::1\]):([0-9]{1,5})/api/tauri/window-bridge/local/[0-9a-f]{48}$").unwrap());
    expression
        .captures(value)
        .and_then(|parts| parts[1].parse::<u16>().ok())
        .is_some_and(|port| port > 0)
}
fn decode_percent(value: &str) -> Result<String, String> {
    let mut bytes = Vec::new();
    let mut at = 0;
    let src = value.as_bytes();
    while at < src.len() {
        if src[at] == b'%' {
            if at + 2 >= src.len() {
                return Err("Invalid encoded project identity".into());
            }
            let hex = std::str::from_utf8(&src[at + 1..at + 3])
                .map_err(|_| "Invalid encoded project identity")?;
            bytes
                .push(u8::from_str_radix(hex, 16).map_err(|_| "Invalid encoded project identity")?);
            at += 3;
        } else {
            bytes.push(src[at]);
            at += 1;
        }
    }
    String::from_utf8(bytes).map_err(|_| "Invalid project identity encoding".into())
}

#[cfg(test)]
mod tests {
    use super::*;
    fn fixture(port: u16) -> PathBuf {
        let base = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests");
        let root = base
            .join(format!("bridge-client-{}", uuid::Uuid::new_v4()))
            .join("工程 空格");
        std::fs::create_dir_all(root.join("Assets")).unwrap();
        std::fs::create_dir(root.join("Temp")).unwrap();
        std::fs::write(root.join("Temp/.com-unity-gamecowork.json"),json!({"unity_host":"127.0.0.1","unity_port":port,"project_path":root.join("Assets"),"reason":"GameCowork local editor bridge"}).to_string()).unwrap();
        root
    }
    fn cleanup(root: &Path) {
        let run = root.parent().unwrap();
        let base = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests")
            .canonicalize()
            .unwrap();
        assert!(run.canonicalize().unwrap().starts_with(base));
        std::fs::remove_dir_all(run).unwrap();
    }
    fn encoded(root: &Path) -> String {
        crate::files::display(root)
            .bytes()
            .map(|byte| {
                if byte.is_ascii_alphanumeric() || b"-_.".contains(&byte) {
                    (byte as char).to_string()
                } else {
                    format!("%{byte:02X}")
                }
            })
            .collect()
    }
    #[test]
    fn discovery_is_owned_project_local_only_and_stream_urls_never_leave_loopback() {
        let root = fixture(34567);
        assert!(config(&root).is_ok());
        std::fs::write(root.join("Temp/.com-unity-gamecowork.json"),json!({"unity_host":"fixture.invalid","unity_port":34567,"project_path":root.join("Assets"),"reason":"GameCowork local editor bridge"}).to_string()).unwrap();
        assert!(config(&root).unwrap_err().contains("loopback"));
        let token = "a".repeat(48);
        assert!(valid_stream_url(&format!(
            "http://127.0.0.1:34567/api/tauri/window-bridge/local/{token}"
        )));
        for bad in [
            format!("http://fixture.invalid:34567/api/tauri/window-bridge/local/{token}"),
            format!("http://user@127.0.0.1:34567/api/tauri/window-bridge/local/{token}"),
            format!("http://127.0.0.1:0/api/tauri/window-bridge/local/{token}"),
            format!(
                "http://127.0.0.1:34567/api/tauri/window-bridge/local/{token}?credential=hidden"
            ),
        ] {
            assert!(!valid_stream_url(&bad));
        }
        cleanup(&root);
    }
    #[tokio::test]
    async fn real_tcp_framing_matches_project_and_request_ids_without_an_agent() {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let root = fixture(listener.local_addr().unwrap().port());
        let banner = encoded(&root);
        let server = tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            stream
                .write_all(
                    format!("WELCOME UNITY-TCP FRAMING=1 SERVER_VERSION=2 PROJECT_ROOT={banner}\n")
                        .as_bytes(),
                )
                .await
                .unwrap();
            let mut messages = vec![];
            for _ in 0..3 {
                let size = stream.read_u64().await.unwrap();
                let mut bytes = vec![0; size as usize];
                stream.read_exact(&mut bytes).await.unwrap();
                messages.push(String::from_utf8(bytes).unwrap());
            }
            assert_eq!(messages[0], "CLIENT_VERSION=2");
            assert_eq!(messages[1], "PLATFORM=cli");
            let req: Value = serde_json::from_str(&messages[2]).unwrap();
            assert_eq!(req["params"]["action"], "list_windows");
            let result=json!({"request_id":req["request_id"],"result":{"success":true,"data":[{"title":"Scene","typeName":"UnityEditor.SceneView","captureSupported":true}]}}).to_string();
            stream
                .write_all(&(result.len() as u64).to_be_bytes())
                .await
                .unwrap();
            for chunk in result.as_bytes().chunks(3) {
                stream.write_all(chunk).await.unwrap();
            }
        });
        let reply = request(root.clone(), "unity/windowBridge/listWindows", &json!({}))
            .await
            .unwrap();
        assert_eq!(reply["content"]["windows"][0]["title"], "Scene");
        server.await.unwrap();
        cleanup(&root);
    }
    #[tokio::test]
    async fn scene_queries_preserve_nested_rows_and_refuse_unimplemented_writes() {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let root = fixture(listener.local_addr().unwrap().port());
        let banner = encoded(&root);
        let server = tokio::spawn(async move {
            for (kind, action) in [
                ("manage_scene", "get_hierarchy"),
                ("manage_gameobject", "find"),
                ("manage_gameobject", "list_children"),
                ("manage_gameobject", "get_components"),
            ] {
                let (mut stream, _) = listener.accept().await.unwrap();
                stream
                    .write_all(
                        format!(
                            "WELCOME UNITY-TCP FRAMING=1 SERVER_VERSION=2 PROJECT_ROOT={banner}\n"
                        )
                        .as_bytes(),
                    )
                    .await
                    .unwrap();
                let mut req = Value::Null;
                for index in 0..3 {
                    let size = stream.read_u64().await.unwrap();
                    let mut bytes = vec![0; size as usize];
                    stream.read_exact(&mut bytes).await.unwrap();
                    if index == 2 {
                        req = serde_json::from_slice(&bytes).unwrap();
                    }
                }
                assert_eq!(req["type"], kind);
                assert_eq!(req["params"]["action"], action);
                let reply = json!({"request_id":req["request_id"],"result":{"success":true,"data":{"success":true,"data":[{"name":"Own Query Row","instanceID":-17}]}}}).to_string();
                stream
                    .write_all(&(reply.len() as u64).to_be_bytes())
                    .await
                    .unwrap();
                stream.write_all(reply.as_bytes()).await.unwrap();
            }
        });
        for (kind, action) in [
            ("manage_scene", "get_hierarchy"),
            ("manage_gameobject", "find"),
            ("manage_gameobject", "list_children"),
            ("manage_gameobject", "get_components"),
        ] {
            let reply = invoke_local_tool(root.clone(), kind, &json!({"action":action}))
                .await
                .unwrap();
            assert_eq!(reply["response"]["data"]["success"], true);
            assert_eq!(reply["response"]["data"]["data"][0]["instanceID"], -17);
        }
        server.await.unwrap();
        for (kind, action) in [
            ("manage_scene", "save"),
            ("manage_gameobject", "delete"),
            ("manage_gameobject", "unknown"),
        ] {
            assert!(
                invoke_local_tool(root.clone(), kind, &json!({"action":action}))
                    .await
                    .unwrap_err()
                    .contains("not implemented")
            );
        }
        cleanup(&root);
    }
    #[tokio::test]
    async fn control_waits_for_matching_completed_real_state_and_rejects_false_completion() {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let root = fixture(listener.local_addr().unwrap().port());
        let banner = encoded(&root);
        let server = tokio::spawn(async move {
            for response_number in 0..3 {
                let (mut stream, _) = listener.accept().await.unwrap();
                stream
                    .write_all(
                        format!(
                            "WELCOME UNITY-TCP FRAMING=1 SERVER_VERSION=2 PROJECT_ROOT={banner}\n"
                        )
                        .as_bytes(),
                    )
                    .await
                    .unwrap();
                let mut req = Value::Null;
                for index in 0..3 {
                    let size = stream.read_u64().await.unwrap();
                    let mut bytes = vec![0; size as usize];
                    stream.read_exact(&mut bytes).await.unwrap();
                    if index == 2 {
                        req = serde_json::from_slice(&bytes).unwrap();
                    }
                }
                assert_eq!(req["type"], "manage_editor");
                assert_eq!(
                    req["params"]["action"],
                    if response_number == 0 {
                        "play"
                    } else {
                        "get_state"
                    }
                );
                let completed = response_number == 2;
                let data = json!({"operationId":"fixture-operation","controlAction":"play","controlStatus":if completed {"completed"} else {"pending"},"pending":!completed,"playMode":if completed {"playing"} else {"stopped"},"isCompiling":false,"isUpdating":false});
                let result =
                    json!({"request_id":req["request_id"],"result":{"success":true,"data":data}})
                        .to_string();
                stream
                    .write_all(&(result.len() as u64).to_be_bytes())
                    .await
                    .unwrap();
                stream.write_all(result.as_bytes()).await.unwrap();
            }
        });
        let data = invoke_local_tool(
            root.clone(),
            "manage_editor",
            &json!({"action":"play","timeoutSeconds":2}),
        )
        .await
        .unwrap();
        assert_eq!(data["response"]["data"]["playMode"], "playing");
        assert_eq!(data["response"]["data"]["pending"], false);
        server.await.unwrap();
        let false_completion = json!({"operationId":"fixture-operation","controlAction":"play","controlStatus":"completed","pending":false,"playMode":"stopped","isCompiling":false,"isUpdating":false});
        assert!(
            wait_control(root.clone(), "play", false, false_completion, 1)
                .await
                .unwrap_err()
                .contains("real state")
        );
        let lost = json!({"operationId":"fixture-operation","controlAction":"stop","controlStatus":"pending","pending":true});
        assert!(wait_control(root.clone(), "play", false, lost, 1)
            .await
            .unwrap_err()
            .contains("identity"));
        let invalid = invoke_local_tool(root.clone(), "manage_editor", &json!({"action":"resume"}))
            .await
            .unwrap_err();
        assert!(invalid.contains("singleFrame"));
        assert!(!control_reload_error(
            "Editor handshake belongs to another project"
        ));
        assert!(!control_reload_error(
            "Editor bridge must listen on loopback"
        ));
        cleanup(&root);
    }
}
