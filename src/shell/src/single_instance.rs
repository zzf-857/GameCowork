//! A Windows kernel lock owns the application; disk metadata only locates it.
//! Never decide ownership from a PID file, or contact an unverified old port.
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    io::{Read, Write},
    net::{Ipv4Addr, SocketAddr, TcpStream},
    path::{Path, PathBuf},
    time::{Duration, Instant},
};

pub struct SingleInstance {
    #[cfg(windows)]
    handle: usize,
    metadata: PathBuf,
    id: String,
    data_id: String,
}

fn data_identity(data: &Path) -> Result<String, String> {
    let canonical = data.canonicalize().map_err(|e| e.to_string())?;
    let text = crate::files::display(&canonical);
    #[cfg(windows)]
    let text = text.to_lowercase();
    Ok(format!("{:x}", Sha256::digest(text.as_bytes())))
}

impl SingleInstance {
    pub fn acquire(data: &Path) -> Result<Option<Self>, String> {
        let data_id = data_identity(data)?;
        #[cfg(windows)]
        let handle = {
            use windows_sys::Win32::{
                Foundation::{CloseHandle, GetLastError, ERROR_ALREADY_EXISTS},
                System::Threading::CreateMutexW,
            };
            let name: Vec<u16> = format!("Local\\GameCowork-{data_id}")
                .encode_utf16()
                .chain(Some(0))
                .collect();
            // Non-inheritable: a Core or Editor child must not retain the lock.
            let handle = unsafe { CreateMutexW(std::ptr::null(), 0, name.as_ptr()) };
            if handle.is_null() {
                return Err(format!("Cannot acquire application lock: {}", unsafe {
                    GetLastError()
                }));
            }
            if unsafe { GetLastError() } == ERROR_ALREADY_EXISTS {
                unsafe { CloseHandle(handle) };
                return Ok(None);
            }
            handle as usize
        };
        #[cfg(not(windows))]
        return Err("Single-instance ownership currently requires Windows".into());
        #[cfg(windows)]
        Ok(Some(Self {
            handle,
            metadata: data.join("instance.json"),
            id: uuid::Uuid::new_v4().to_string(),
            data_id,
        }))
    }

    pub fn status(&self) -> Value {
        json!({"pid":std::process::id(),"instanceId":self.id,"dataId":self.data_id})
    }

    pub fn matches(&self, id: &Value) -> bool {
        id.as_str() == Some(self.id.as_str())
    }

    pub fn publish(&self, port: u16) -> Result<(), String> {
        crate::workspaces::write_json_atomic(
            &self.metadata,
            &json!({"schemaVersion":1,"product":"GameCowork","pid":std::process::id(),
                "port":port,"instanceId":self.id,"dataId":self.data_id}),
        )
    }
}

impl Drop for SingleInstance {
    fn drop(&mut self) {
        // Only remove this generation's marker, before releasing ownership.
        if read_metadata(&self.metadata).is_some_and(|v| self.matches(&v["instanceId"])) {
            let _ = std::fs::remove_file(&self.metadata);
        }
        #[cfg(windows)]
        unsafe {
            windows_sys::Win32::Foundation::CloseHandle(self.handle as _);
        }
    }
}

fn read_metadata(path: &Path) -> Option<Value> {
    let file = std::fs::File::open(path).ok()?;
    if file.metadata().ok()?.len() > 4096 {
        return None;
    }
    let mut bytes = Vec::new();
    file.take(4097).read_to_end(&mut bytes).ok()?;
    if bytes.len() > 4096 {
        return None;
    }
    serde_json::from_slice(&bytes).ok()
}

fn request(
    port: u16,
    route: &str,
    body: Option<&Value>,
    deadline: Duration,
) -> Result<Value, String> {
    let timeout = Duration::from_secs(2);
    let address = SocketAddr::from((Ipv4Addr::LOCALHOST, port));
    let mut socket = TcpStream::connect_timeout(&address, timeout).map_err(|e| e.to_string())?;
    socket
        .set_read_timeout(Some(timeout))
        .map_err(|e| e.to_string())?;
    socket
        .set_write_timeout(Some(timeout))
        .map_err(|e| e.to_string())?;
    let payload = body.map(Value::to_string).unwrap_or_default();
    let method = if body.is_some() { "POST" } else { "GET" };
    write!(socket, "{method} {route} HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\nContent-Type: application/json\r\nContent-Length: {}\r\n\r\n{payload}", payload.len())
        .map_err(|e| e.to_string())?;
    let mut bytes = Vec::new();
    // A total deadline also bounds a peer that keeps supplying partial bytes.
    let started = Instant::now();
    let mut chunk = [0; 4096];
    loop {
        if started.elapsed() >= deadline {
            return Err("Running application response timed out".into());
        }
        socket
            .set_read_timeout(Some(deadline.saturating_sub(started.elapsed())))
            .map_err(|e| e.to_string())?;
        let count = socket.read(&mut chunk).map_err(|e| e.to_string())?;
        if count == 0 {
            break;
        }
        bytes.extend_from_slice(&chunk[..count]);
        if bytes.len() > 65536 {
            return Err("Running application response exceeds the size limit".into());
        }
    }
    let boundary = bytes
        .windows(4)
        .position(|v| v == b"\r\n\r\n")
        .ok_or("Invalid running application response")?;
    let headers = std::str::from_utf8(&bytes[..boundary]).map_err(|e| e.to_string())?;
    let status = headers
        .lines()
        .next()
        .and_then(|line| line.split_whitespace().nth(1));
    let result: Value =
        serde_json::from_slice(&bytes[boundary + 4..]).map_err(|e| e.to_string())?;
    if status != Some("200") {
        return Err(result["error"]
            .as_str()
            .unwrap_or("Running application rejected the request")
            .into());
    }
    Ok(result)
}

/// None means startup is not ready (or a stale, unrelated listener was found).
fn forward(data: &Path, workspace: Option<&str>) -> Result<Option<Value>, String> {
    let Some(metadata) = read_metadata(&data.join("instance.json")) else {
        return Ok(None);
    };
    let expected_data = data_identity(data)?;
    if metadata["schemaVersion"] != 1
        || metadata["product"] != "GameCowork"
        || metadata["dataId"].as_str() != Some(&expected_data)
        || metadata["instanceId"]
            .as_str()
            .is_none_or(|id| uuid::Uuid::parse_str(id).is_err())
        || metadata["pid"]
            .as_u64()
            .is_none_or(|pid| pid == 0 || pid > u32::MAX as u64)
    {
        return Ok(None);
    }
    let Some(port) = metadata["port"]
        .as_u64()
        .filter(|port| *port > 0 && *port <= u16::MAX as u64)
    else {
        return Ok(None);
    };
    let Ok(status) = request(
        port as u16,
        "/api/tauri/status",
        None,
        Duration::from_secs(2),
    ) else {
        return Ok(None);
    };
    if status["product"] != "GameCowork"
        || status["status"] != "ok"
        || status["pid"] != metadata["pid"]
        || status["instanceId"] != metadata["instanceId"]
        || status["dataId"] != metadata["dataId"]
    {
        return Ok(None);
    }
    #[cfg(windows)]
    if status["desktopWindow"] == true {
        // The launching process may grant its foreground permission to the
        // verified primary. Windows still decides whether activation succeeds.
        unsafe {
            windows_sys::Win32::UI::WindowsAndMessaging::AllowSetForegroundWindow(
                metadata["pid"].as_u64().unwrap() as u32,
            )
        };
    }
    // A valid application failure is final; do not retry a confirmed mutation.
    let result = request(
        port as u16,
        "/api/tauri/activate-instance",
        Some(&json!({"instanceId":metadata["instanceId"],"workspace":workspace})),
        Duration::from_secs(60),
    )
    .map_err(|error| {
        format!(
            "Activation was sent to the running application but could not be confirmed: {error}"
        )
    })?;
    if result["ok"] != true {
        return Err(result["error"]
            .as_str()
            .unwrap_or("Application activation failed")
            .into());
    }
    Ok(Some(result))
}

pub enum Launch {
    Primary(SingleInstance),
    Forwarded(Value),
}

pub fn launch(data: &Path, workspace: Option<&str>) -> Result<Launch, String> {
    let started = Instant::now();
    loop {
        if let Some(instance) = SingleInstance::acquire(data)? {
            return Ok(Launch::Primary(instance));
        }
        if let Some(result) = forward(data, workspace)? {
            return Ok(Launch::Forwarded(result));
        }
        if started.elapsed() >= Duration::from_secs(15) {
            return Err("GameCowork is already starting or its local service is unavailable; no second Core was started".into());
        }
        std::thread::sleep(Duration::from_millis(100));
    }
}

pub fn workspace_argument(
    args: impl IntoIterator<Item = std::ffi::OsString>,
) -> Result<Option<String>, String> {
    let args: Vec<_> = args.into_iter().collect();
    let path = match args.as_slice() {
        [] => return Ok(None),
        [path] if !path.to_string_lossy().starts_with('-') => path,
        [flag, path] if flag == "--workspace" => path,
        _ => return Err("Usage: GameCowork.exe [--workspace <existing-project-directory>]".into()),
    };
    let path = PathBuf::from(path)
        .canonicalize()
        .map_err(|e| format!("Cannot open launch workspace: {e}"))?;
    if !path.is_dir() {
        return Err("Launch workspace must be an existing directory".into());
    }
    if path.to_str().is_none() {
        return Err("Launch workspace path must be UTF-8".into());
    }
    Ok(Some(crate::files::display(&path)))
}

#[cfg(test)]
mod tests {
    use super::*;
    fn cleanup(run: &Path) {
        let base = Path::new(r"F:\AI\AgentMake\temp\GameCowork\tests")
            .canonicalize()
            .unwrap();
        let resolved = run.canonicalize().unwrap();
        assert!(resolved.starts_with(&base) && resolved != base);
        std::fs::remove_dir_all(run).unwrap();
    }
    #[cfg(windows)]
    #[test]
    fn stale_metadata_never_sends_workspace_activation_to_an_unrelated_listener() {
        let run = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests")
            .join(format!("instance-unrelated-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&run).unwrap();
        let owner = SingleInstance::acquire(&run).unwrap().unwrap();
        let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
        owner
            .publish(listener.local_addr().unwrap().port())
            .unwrap();
        let peer = std::thread::spawn(move || {
            let (mut socket, _) = listener.accept().unwrap();
            socket
                .set_read_timeout(Some(Duration::from_secs(2)))
                .unwrap();
            let mut input = Vec::new();
            let mut chunk = [0; 4096];
            while !input.windows(4).any(|v| v == b"\r\n\r\n") {
                let count = socket.read(&mut chunk).unwrap();
                assert!(count > 0 && input.len() + count <= 65536);
                input.extend_from_slice(&chunk[..count]);
            }
            assert!(std::str::from_utf8(&input)
                .unwrap()
                .starts_with("GET /api/tauri/status "));
            let body = json!({"product":"Other application","status":"ok"}).to_string();
            write!(
                socket,
                "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
                body.len()
            )
            .unwrap();
        });
        assert!(forward(&run, Some("F:/unused-test-workspace"))
            .unwrap()
            .is_none());
        peer.join().unwrap();
        let marker = run.join("instance.json");
        std::fs::write(&marker, vec![b'x'; 4097]).unwrap();
        assert!(forward(&run, None).unwrap().is_none());
        drop(owner);
        cleanup(&run);
    }
    #[test]
    fn workspace_arguments_are_explicit_and_never_create_paths() {
        let run = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests")
            .join(format!("instance-arguments-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&run).unwrap();
        assert_eq!(workspace_argument(Vec::new()).unwrap(), None);
        assert!(workspace_argument(["--unknown".into()]).is_err());
        assert!(workspace_argument(["--workspace".into()]).is_err());
        assert!(workspace_argument([run.join("missing").into_os_string()]).is_err());
        std::fs::write(run.join("file.txt"), "fixture").unwrap();
        assert!(workspace_argument([run.join("file.txt").into_os_string()]).is_err());
        assert_eq!(
            workspace_argument(["--workspace".into(), run.clone().into_os_string()]).unwrap(),
            workspace_argument([run.clone().into_os_string()]).unwrap()
        );
        cleanup(&run);
    }
    #[cfg(windows)]
    #[test]
    fn kernel_ownership_is_independent_of_stale_metadata_and_path_case() {
        let run = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests")
            .join(format!("instance-owner-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&run).unwrap();
        std::fs::write(run.join("instance.json"), "stale metadata").unwrap();
        let first = SingleInstance::acquire(&run).unwrap().unwrap();
        let lower = PathBuf::from(run.to_string_lossy().to_lowercase());
        assert!(SingleInstance::acquire(&lower).unwrap().is_none());
        first.publish(12345).unwrap();
        assert_eq!(
            read_metadata(&run.join("instance.json")).unwrap()["instanceId"],
            first.status()["instanceId"]
        );
        drop(first);
        assert!(!run.join("instance.json").exists());
        let second = SingleInstance::acquire(&run).unwrap().unwrap();
        drop(second);
        cleanup(&run);
    }
}
