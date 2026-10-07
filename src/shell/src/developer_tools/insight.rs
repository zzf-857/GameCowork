//! Workspace-scoped local SQLite/C#/asset indexing. The host grants the project
//! root; client JSON never supplies worker paths, cache paths or executables.
use crate::{files, process_lifetime::ProcessLifetime, workspaces};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    process::Stdio,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex, Weak,
    },
    time::Duration,
};
use tokio::{
    io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader},
    process::{ChildStdin, Command},
    sync::{oneshot, watch, Mutex as AsyncMutex},
};

const MAX_FRAME: usize = 16 * 1024 * 1024;
const MAX_PENDING: usize = 64;
#[derive(Debug)]
pub struct InsightError {
    status: u16,
    message: String,
}
impl InsightError {
    fn new(status: u16, message: impl Into<String>) -> Self {
        Self {
            status,
            message: message.into(),
        }
    }
    pub fn status(&self) -> u16 {
        self.status
    }
    pub fn json(&self) -> Value {
        json!({"ok":false,"status":"error","error":self.message})
    }
}
impl std::fmt::Display for InsightError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message)
    }
}
impl std::error::Error for InsightError {}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
struct Preferences {
    version: u32,
    global_enabled: bool,
    enabled_by_root: HashMap<String, bool>,
}
impl Default for Preferences {
    fn default() -> Self {
        Self {
            version: 1,
            global_enabled: true,
            enabled_by_root: HashMap::new(),
        }
    }
}
#[derive(Clone)]
pub struct InsightService {
    inner: Arc<Inner>,
}
struct Inner {
    home: PathBuf,
    node: PathBuf,
    entry: PathBuf,
    preferences: Mutex<Preferences>,
    workers: Mutex<HashMap<String, Arc<Worker>>>,
    initializing: Mutex<HashMap<String, Arc<Worker>>>,
    lifecycle: Mutex<HashMap<String, WorkspaceLife>>,
    startup_locks: Mutex<HashMap<String, Arc<AsyncMutex<()>>>>,
}
#[derive(Clone, Copy)]
struct WorkspaceLife {
    generation: u64,
    opened: bool,
}
struct Worker {
    root: PathBuf,
    generation: u64,
    pid: u32,
    alive: AtomicBool,
    stdin: AsyncMutex<ChildStdin>,
    pending: Mutex<HashMap<String, oneshot::Sender<Result<Value, String>>>>,
    lifetime: Mutex<Option<ProcessLifetime>>,
    stop: watch::Sender<bool>,
}
struct PendingReply {
    worker: Weak<Worker>,
    id: String,
}
impl Drop for PendingReply {
    fn drop(&mut self) {
        if let Some(worker) = self.worker.upgrade() {
            worker.pending.lock().unwrap().remove(&self.id);
        }
    }
}
impl Worker {
    fn fail(&self, reason: &str) {
        self.alive.store(false, Ordering::Release);
        for (_, sender) in self.pending.lock().unwrap().drain() {
            let _ = sender.send(Err(reason.to_owned()));
        }
    }
    fn stop(&self) {
        let _ = self.stop.send(true);
        self.lifetime.lock().unwrap().take();
        self.fail("Local index worker stopped");
    }
    async fn rpc(self: &Arc<Self>, method: &str, params: Value) -> Result<Value, InsightError> {
        let id = uuid::Uuid::new_v4().to_string();
        let (sender, receiver) = oneshot::channel();
        {
            let mut pending = self.pending.lock().unwrap();
            if !self.alive.load(Ordering::Acquire) {
                return Err(InsightError::new(503, "Local index worker is offline"));
            }
            if pending.len() >= MAX_PENDING {
                return Err(InsightError::new(429, "Too many local index requests"));
            }
            pending.insert(id.clone(), sender);
        }
        let _pending = PendingReply {
            worker: Arc::downgrade(self),
            id: id.clone(),
        };
        let message = json!({"id":id,"method":method,"params":params}).to_string() + "\n";
        let mut stdin = self.stdin.lock().await;
        stdin
            .write_all(message.as_bytes())
            .await
            .map_err(|_| InsightError::new(503, "Local index worker input closed"))?;
        drop(stdin);
        let reply = tokio::time::timeout(Duration::from_secs(30), receiver)
            .await
            .map_err(|_| InsightError::new(504, "Local index worker request timed out"))?
            .map_err(|_| InsightError::new(503, "Local index worker exited"))?
            .map_err(|error| InsightError::new(503, error))?;
        if reply["status"] != "ok" {
            return Err(InsightError::new(
                422,
                reply["error"]["message"]
                    .as_str()
                    .unwrap_or("Local index request failed"),
            ));
        }
        reply
            .get("data")
            .cloned()
            .ok_or_else(|| InsightError::new(502, "Local index response has no data"))
    }
}

impl InsightService {
    pub fn new(home: PathBuf, node: PathBuf, entry: PathBuf) -> Result<Self, String> {
        std::fs::create_dir_all(&home).map_err(|e| e.to_string())?;
        let home = home.canonicalize().map_err(|e| e.to_string())?;
        let preferences = match std::fs::read(home.join("settings.json")) {
            Ok(bytes) => {
                let preferences: Preferences = serde_json::from_slice(&bytes)
                    .map_err(|_| "Local index settings are invalid")?;
                if preferences.version != 1 {
                    return Err("Local index settings version is unsupported".into());
                }
                preferences
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => Preferences::default(),
            Err(error) => return Err(error.to_string()),
        };
        Ok(Self {
            inner: Arc::new(Inner {
                home,
                node,
                entry,
                preferences: Mutex::new(preferences),
                workers: Mutex::new(HashMap::new()),
                initializing: Mutex::new(HashMap::new()),
                lifecycle: Mutex::new(HashMap::new()),
                startup_locks: Mutex::new(HashMap::new()),
            }),
        })
    }
    fn effective(&self, root: &Path) -> bool {
        let preferences = self.inner.preferences.lock().unwrap();
        *preferences
            .enabled_by_root
            .get(&key(root))
            .unwrap_or(&preferences.global_enabled)
    }
    fn cache_dir(&self, root: &Path) -> PathBuf {
        self.inner.home.join("projects").join(hash(&key(root)))
    }
    pub async fn open_workspace(&self, root: &Path) {
        let root = root.canonicalize().unwrap_or_else(|_| root.to_path_buf());
        let mut lifecycle = self.inner.lifecycle.lock().unwrap();
        let life = lifecycle.entry(key(&root)).or_insert(WorkspaceLife {
            generation: 0,
            opened: false,
        });
        if !life.opened {
            life.generation = life.generation.wrapping_add(1);
            life.opened = true;
        }
    }
    fn generation(&self, root: &Path) -> Result<u64, InsightError> {
        self.inner
            .lifecycle
            .lock()
            .unwrap()
            .get(&key(root))
            .filter(|life| life.opened)
            .map(|life| life.generation)
            .ok_or_else(|| InsightError::new(409, "Index project is no longer open"))
    }
    fn current(&self, worker: &Worker) -> bool {
        self.generation(&worker.root).ok() == Some(worker.generation)
            && worker.alive.load(Ordering::Acquire)
            && self.effective(&worker.root)
    }
    async fn worker(&self, root: &Path) -> Result<Arc<Worker>, InsightError> {
        let root = validate_project(root)?;
        let identity = key(&root);
        let generation = self.generation(&root)?;
        let startup = {
            self.inner
                .startup_locks
                .lock()
                .unwrap()
                .entry(identity.clone())
                .or_insert_with(|| Arc::new(AsyncMutex::new(())))
                .clone()
        };
        let _startup = startup.lock().await;
        if self.generation(&root)? != generation || !self.effective(&root) {
            return Err(InsightError::new(
                409,
                "Index project closed or was disabled during worker startup",
            ));
        }
        let existing = self.inner.workers.lock().unwrap().get(&identity).cloned();
        if let Some(worker) = existing {
            if self.current(&worker) {
                return Ok(worker);
            }
        }
        if let Some(old) = self.inner.workers.lock().unwrap().remove(&identity) {
            old.stop();
        }
        let guard = self
            .inner
            .entry
            .parent()
            .ok_or_else(|| InsightError::new(500, "Index worker directory is unavailable"))?
            .join("gamecowork-worker-guard.cjs");
        if !self.inner.entry.is_file() || !guard.is_file() {
            return Err(InsightError::new(
                503,
                "Local index worker resources are not included in this build",
            ));
        }
        let mut command = Command::new(&self.inner.node);
        command
            .arg("--require")
            .arg(&guard)
            .arg(&self.inner.entry)
            .args(["serve", "--stdio", "--project"])
            .arg(files::display(&root));
        command
            .current_dir(&root)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .kill_on_drop(true);
        for (name, _) in std::env::vars() {
            if [
                "OPENAI",
                "ANTHROPIC",
                "GEMINI",
                "GOOGLE",
                "AZURE",
                "AWS",
                "VERTEX",
                "GITHUB",
                "CODELY_",
                "OTEL_",
            ]
            .iter()
            .any(|prefix| name.starts_with(prefix))
                || matches!(
                    name.as_str(),
                    "NODE_OPTIONS" | "HTTP_PROXY" | "HTTPS_PROXY" | "ALL_PROXY" | "NO_PROXY"
                )
            {
                command.env_remove(name);
            }
        }
        command
            .env("UNITY_INSIGHT_HOME", files::display(&self.inner.home))
            .env("GAMECOWORK_INSIGHT_PROJECT", files::display(&root))
            .env(
                "GAMECOWORK_INSIGHT_INDEX_DIR",
                files::display(&self.cache_dir(&root)),
            )
            .env("UNITY_INSIGHT_ALLOWED_PROJECT_ROOTS", files::display(&root))
            .env("UNITY_INSIGHT_WATCH_DEBOUNCE_MS", "500")
            .env("GAMECOWORK_UNITY_METRICS_NO_EMIT", "1")
            .env("UNITY_INSIGHT_LOG_LEVEL", "OFF");
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            command.as_std_mut().creation_flags(0x08000000);
        }
        let mut child = command
            .spawn()
            .map_err(|e| InsightError::new(503, format!("Cannot start local index worker: {e}")))?;
        let lifetime = match ProcessLifetime::attach(&child) {
            Ok(lifetime) => lifetime,
            Err(error) => {
                let _ = child.kill().await;
                return Err(InsightError::new(503, error));
            }
        };
        let pid = child.id().ok_or_else(|| {
            InsightError::new(503, "Local index worker exited before initialization")
        })?;
        let stdin = child
            .stdin
            .take()
            .ok_or_else(|| InsightError::new(503, "Local index worker input is unavailable"))?;
        let stdout = child
            .stdout
            .take()
            .ok_or_else(|| InsightError::new(503, "Local index worker output is unavailable"))?;
        let (stop, mut stopping) = watch::channel(false);
        let worker = Arc::new(Worker {
            root: root.clone(),
            generation,
            pid,
            alive: AtomicBool::new(true),
            stdin: AsyncMutex::new(stdin),
            pending: Mutex::new(HashMap::new()),
            lifetime: Mutex::new(Some(lifetime)),
            stop,
        });
        {
            let lifecycle = self.inner.lifecycle.lock().unwrap();
            if !lifecycle
                .get(&identity)
                .is_some_and(|life| life.opened && life.generation == generation)
            {
                worker.stop();
                return Err(InsightError::new(
                    409,
                    "Index project closed before initialization",
                ));
            }
            self.inner
                .initializing
                .lock()
                .unwrap()
                .insert(identity.clone(), worker.clone());
        }
        let weak = Arc::downgrade(&worker);
        tokio::spawn(async move {
            let mut reader = BufReader::new(stdout);
            loop {
                let mut bytes = Vec::new();
                let result = (&mut reader)
                    .take((MAX_FRAME + 1) as u64)
                    .read_until(b'\n', &mut bytes)
                    .await;
                if !matches!(result,Ok(n)if n>0)
                    || bytes.len() > MAX_FRAME
                    || !bytes.ends_with(b"\n")
                {
                    if let Some(worker) = weak.upgrade() {
                        worker.fail("Local index worker output closed or exceeded its limit");
                    }
                    break;
                }
                let Ok(reply) = serde_json::from_slice::<Value>(&bytes) else {
                    continue;
                };
                if let Some(id) = reply["id"].as_str() {
                    if let Some(worker) = weak.upgrade() {
                        if let Some(sender) = worker.pending.lock().unwrap().remove(id) {
                            let _ = sender.send(Ok(reply));
                        }
                    }
                }
            }
        });
        let weak = Arc::downgrade(&worker);
        tokio::spawn(async move {
            tokio::select! {_=stopping.changed()=>{let _=child.kill().await;},_=child.wait()=>{}}
            if let Some(worker) = weak.upgrade() {
                worker.fail("Local index worker exited");
                worker.lifetime.lock().unwrap().take();
            }
        });
        if let Err(error) = worker
            .rpc("initialize", json!({"project_path":files::display(&root)}))
            .await
        {
            worker.stop();
            remove_same(&self.inner.initializing, &identity, &worker);
            return Err(error);
        }
        {
            let lifecycle = self.inner.lifecycle.lock().unwrap();
            remove_same(&self.inner.initializing, &identity, &worker);
            if !lifecycle
                .get(&identity)
                .is_some_and(|life| life.opened && life.generation == generation)
                || !self.effective(&root)
            {
                worker.stop();
                return Err(InsightError::new(
                    409,
                    "Index project closed during initialization",
                ));
            }
            self.inner
                .workers
                .lock()
                .unwrap()
                .insert(identity, worker.clone());
        }
        Ok(worker)
    }
    async fn status(&self, root: &Path, start_if_missing: bool) -> Result<Value, InsightError> {
        let root = validate_project(root)?;
        self.generation(&root)?;
        if !self.effective(&root) {
            return Ok(
                json!({"ok":true,"status":"disabled","enabled":false,"indexReady":false,"indexBuilding":false,"indexSyncing":false,"percent":0,"indexedAt":null}),
            );
        }
        let exists = self.inner.workers.lock().unwrap().contains_key(&key(&root));
        if !exists
            && !self.cache_dir(&root).join("index.current").is_file()
            && !self.cache_dir(&root).join("index.db").is_file()
        {
            if start_if_missing {
                return self.ensure(&root, false).await;
            }
            return Ok(
                json!({"ok":true,"status":"idle","enabled":true,"indexReady":false,"indexBuilding":false,"indexSyncing":false,"percent":0,"indexedAt":null}),
            );
        }
        let worker = self.worker(&root).await?;
        let data = worker.rpc("status", json!({})).await?;
        if !self.current(&worker) {
            return Err(InsightError::new(
                409,
                "Index project closed before status completed",
            ));
        }
        Ok(project_status(data, worker.pid))
    }
    async fn ensure(&self, root: &Path, force: bool) -> Result<Value, InsightError> {
        let root = validate_project(root)?;
        self.generation(&root)?;
        if !self.effective(&root) {
            return Err(InsightError::new(
                409,
                "Local Unity Insight indexing is disabled for this project",
            ));
        }
        let worker = self.worker(&root).await?;
        let data = worker
            .rpc(
                if force { "index.build" } else { "index.ensure" },
                json!({"force":force}),
            )
            .await?;
        if !self.current(&worker) {
            return Err(InsightError::new(
                409,
                "Index project closed before build scheduling completed",
            ));
        }
        Ok(
            json!({"ok":true,"status":if data["deferred"]==true{"busy"}else if data["indexBuilding"]==true{"building"}else if data["indexSyncing"]==true{"syncing"}else{"ready"},"triggered":data["triggered"]==true,"indexBuilding":data["indexBuilding"],"indexSyncing":data["indexSyncing"],"indexReady":data["indexReady"],"percent":data["progressPercent"],"reason":data["reason"],"pid":worker.pid}),
        )
    }
    pub async fn handle(
        &self,
        operation: &str,
        root: Option<PathBuf>,
        body: Value,
    ) -> Result<Value, InsightError> {
        if matches!(operation, "get-enabled" | "set-enabled") && body["scope"] == "user" {
            if operation == "set-enabled" {
                let enabled = body["enabled"]
                    .as_bool()
                    .ok_or_else(|| InsightError::new(400, "enabled must be a boolean"))?;
                {
                    let mut preferences = self.inner.preferences.lock().unwrap();
                    let mut next = preferences.clone();
                    next.global_enabled = enabled;
                    save_preferences(&self.inner.home, &next)?;
                    *preferences = next;
                }
                self.stop_disabled().await;
            }
            return Ok(
                json!({"ok":true,"enabled":self.inner.preferences.lock().unwrap().global_enabled,"scope":"user"}),
            );
        }
        let root =
            root.ok_or_else(|| InsightError::new(400, "An authorized opened project is required"))?;
        let root = validate_project(&root)?;
        self.generation(&root)?;
        match operation {
            "get-enabled" => self.status(&root, false).await,
            "set-enabled" => {
                let enabled = body["enabled"]
                    .as_bool()
                    .ok_or_else(|| InsightError::new(400, "enabled must be a boolean"))?;
                {
                    let mut preferences = self.inner.preferences.lock().unwrap();
                    let mut next = preferences.clone();
                    next.enabled_by_root.insert(key(&root), enabled);
                    save_preferences(&self.inner.home, &next)?;
                    *preferences = next;
                }
                if !enabled {
                    self.stop_root(&root, false);
                }
                self.status(&root, false).await
            }
            "index-status" => self.status(&root, body["startIfMissing"] == true).await,
            "ensure-index" => self.ensure(&root, body["force"] == true).await,
            "vfs-children" | "vfs-entry" | "vfs-search" | "vfs-path-search" | "vfs-refs" => {
                if !self.effective(&root) {
                    return Err(InsightError::new(
                        409,
                        "Local Unity Insight indexing is disabled for this project",
                    ));
                }
                validate_query(&body)?;
                let worker = self.worker(&root).await?;
                let method = format!("cowork.{}", operation.replace('-', "_"));
                let mut params = body.as_object().cloned().unwrap_or_default();
                for key in [
                    "project_path",
                    "projectPath",
                    "workspaceDirs",
                    "workspaceDir",
                    "workspaceKey",
                    "workspaceRef",
                    "outputPath",
                    "output_path",
                ] {
                    params.remove(key);
                }
                let data = worker.rpc(&method, Value::Object(params)).await?;
                if !self.current(&worker) {
                    return Err(InsightError::new(
                        409,
                        "Index project closed before query completed",
                    ));
                }
                Ok(data)
            }
            _ => Err(InsightError::new(
                404,
                "Unsupported local Unity Insight operation",
            )),
        }
    }
    async fn stop_disabled(&self) {
        let workers = self
            .inner
            .workers
            .lock()
            .unwrap()
            .values()
            .cloned()
            .chain(self.inner.initializing.lock().unwrap().values().cloned())
            .collect::<Vec<_>>();
        let roots = workers
            .iter()
            .filter(|worker| !self.effective(&worker.root))
            .map(|worker| worker.root.clone())
            .collect::<Vec<_>>();
        for root in roots {
            self.stop_root(&root, false);
        }
    }
    pub async fn active_build(&self, authorized_roots: &[PathBuf]) -> Result<Value, InsightError> {
        let allowed = authorized_roots
            .iter()
            .map(|root| key(root))
            .collect::<Vec<_>>();
        let workers = self
            .inner
            .workers
            .lock()
            .unwrap()
            .values()
            .filter(|worker| allowed.contains(&key(&worker.root)))
            .cloned()
            .collect::<Vec<_>>();
        for worker in workers {
            if !worker.alive.load(Ordering::Acquire) {
                continue;
            }
            let data = worker.rpc("status", json!({"light":true})).await?;
            if !self.current(&worker) {
                continue;
            }
            if data["indexBuilding"] == true || data["indexSyncing"] == true {
                return Ok(json!({"workspaceDir":files::display(&worker.root),"pid":worker.pid}));
            }
        }
        Ok(json!({"workspaceDir":null,"pid":null}))
    }
    pub async fn close_workspace(&self, root: &Path) {
        self.stop_root(root, true);
    }
    pub async fn shutdown(&self) {
        let roots = self
            .inner
            .lifecycle
            .lock()
            .unwrap()
            .keys()
            .cloned()
            .collect::<Vec<_>>();
        for identity in roots {
            self.stop_root(Path::new(&identity), true);
        }
    }
    fn stop_root(&self, root: &Path, close: bool) {
        let root = root.canonicalize().unwrap_or_else(|_| root.to_path_buf());
        let identity = key(&root);
        let mut lifecycle = self.inner.lifecycle.lock().unwrap();
        if let Some(life) = lifecycle.get_mut(&identity) {
            life.generation = life.generation.wrapping_add(1);
            if close {
                life.opened = false;
            }
        }
        for map in [&self.inner.workers, &self.inner.initializing] {
            if let Some(worker) = map.lock().unwrap().remove(&identity) {
                worker.stop();
            }
        }
    }
}
impl Drop for Inner {
    fn drop(&mut self) {
        if let Ok(workers) = self.workers.try_lock() {
            for worker in workers.values() {
                worker.stop();
            }
        }
        if let Ok(workers) = self.initializing.try_lock() {
            for worker in workers.values() {
                worker.stop();
            }
        }
    }
}
fn remove_same(map: &Mutex<HashMap<String, Arc<Worker>>>, key: &str, worker: &Arc<Worker>) {
    let mut map = map.lock().unwrap();
    if map
        .get(key)
        .is_some_and(|current| Arc::ptr_eq(current, worker))
    {
        map.remove(key);
    }
}
fn key(path: &Path) -> String {
    let value = files::display(path).trim_end_matches('/').to_owned();
    if cfg!(windows) {
        value.to_lowercase()
    } else {
        value
    }
}
fn hash(value: &str) -> String {
    Sha256::digest(value.as_bytes())
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}
fn validate_project(root: &Path) -> Result<PathBuf, InsightError> {
    let root = root
        .canonicalize()
        .map_err(|_| InsightError::new(404, "Project directory is unavailable"))?;
    let assets = root
        .join("Assets")
        .canonicalize()
        .map_err(|_| InsightError::new(400, "Unity Assets directory is missing"))?;
    if !assets.is_dir() || !files::within(&assets, &root) {
        return Err(InsightError::new(
            403,
            "Unity Assets directory is outside the opened project",
        ));
    }
    let reader = files::Files::new(&root, std::slice::from_ref(&root))
        .map_err(|e| InsightError::new(e.status(), e.to_string()))?;
    reader
        .read_file("ProjectSettings/ProjectVersion.txt", "utf8")
        .map_err(|_| InsightError::new(400, "Unity project version file is missing"))?;
    let manifest = reader
        .read_file("Packages/manifest.json", "utf8")
        .map_err(|_| InsightError::new(400, "Unity package manifest is missing"))?;
    let _: Value = serde_json::from_str(&manifest)
        .map_err(|_| InsightError::new(400, "Unity package manifest is invalid JSON"))?;
    Ok(root)
}
fn save_preferences(home: &Path, preferences: &Preferences) -> Result<(), InsightError> {
    let value = serde_json::to_value(preferences)
        .map_err(|_| InsightError::new(500, "Cannot encode local index preferences"))?;
    workspaces::write_json_atomic(&home.join("settings.json"), &value)
        .map_err(|error| InsightError::new(500, error))
}
fn project_status(data: Value, pid: u32) -> Value {
    let building = data["indexBuilding"] == true;
    let syncing = data["indexSyncing"] == true;
    let ready = data["indexReady"] == true;
    let error = data["lastBuildError"]
        .as_str()
        .or_else(|| data["lastSyncError"].as_str());
    // The worker calls its published generation indexPath. The original GUI
    // watches publishedIndexPath to invalidate already-open VFS entry caches.
    let published = data["indexPath"].as_str().filter(|path| !path.is_empty());
    json!({"ok":true,"enabled":true,"status":if error.is_some(){"error"}else if building{"building"}else if ready{"ready"}else{"idle"},"indexReady":ready,"indexBuilding":building,"indexSyncing":syncing,"publishedIndexPath":published,"schemaVersion":data["schemaVersion"],"protocolVersion":data["protocolVersion"],"pendingEntries":data["pendingEntries"],"indexMtimeMs":data["indexMtimeMs"],"percent":if building||syncing{data["progressPercent"].as_f64().unwrap_or(0.0).clamp(0.0,100.0)}else if ready{100.0}else{0.0},"progressPhase":data["progressPhase"],"progressDetail":data["progressDetail"],"indexedAt":data["indexedAt"],"discoveredFileCount":data["discoveredFileCount"],"diagnosticCount":data["diagnosticCount"],"pendingSyncPaths":data["pendingSyncPaths"],"reconcile":data["reconcile"],"error":error,"pid":pid})
}
fn validate_query(body: &Value) -> Result<(), InsightError> {
    if !body.is_object() {
        return Err(InsightError::new(400, "Index query must be an object"));
    }
    for field in ["vfsPath", "parentPath", "query"] {
        if body[field]
            .as_str()
            .is_some_and(|text| text.len() > 4096 || text.contains('\0'))
        {
            return Err(InsightError::new(
                400,
                "Index query path or text exceeds its limit",
            ));
        }
    }
    if let Some(direction) = body["direction"].as_str() {
        if !matches!(direction, "in" | "out" | "both") {
            return Err(InsightError::new(400, "Invalid reference direction"));
        }
    }
    if let Some(limit) = body.get("limit") {
        if !limit
            .as_u64()
            .is_some_and(|value| (1..=500).contains(&value))
        {
            return Err(InsightError::new(400, "Index query limit must be 1 to 500"));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;
    struct Fixture {
        base: PathBuf,
        run: PathBuf,
        a: PathBuf,
        b: PathBuf,
        home: PathBuf,
    }
    impl Fixture {
        fn new() -> Self {
            let base = PathBuf::from(
                r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
            );
            let run = base.join(format!("insight-rust-{}", uuid::Uuid::new_v4()));
            let (a, b, home) = (
                run.join("Project A"),
                run.join("Project B"),
                run.join("own-state"),
            );
            for project in [&a, &b] {
                for directory in ["Assets", "ProjectSettings", "Packages"] {
                    std::fs::create_dir_all(project.join(directory)).unwrap();
                }
                std::fs::write(
                    project.join("ProjectSettings/ProjectVersion.txt"),
                    "m_EditorVersion: 2022.3.28f1\n",
                )
                .unwrap();
                std::fs::write(project.join("Packages/manifest.json"), "{}\n").unwrap();
            }
            Self {
                base,
                run,
                a,
                b,
                home,
            }
        }
        fn node() -> PathBuf {
            std::env::var_os("GAMECOWORK_INSIGHT_TEST_NODE")
                .map(PathBuf::from)
                .unwrap_or_else(|| PathBuf::from("node.exe"))
        }
        fn real(&self) -> InsightService {
            let entry = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .parent()
                .unwrap()
                .join("unity-insight/bundle/gamecowork-worker-entry.mjs");
            InsightService::new(self.home.clone(), Self::node(), entry).unwrap()
        }
        fn delayed(&self) -> InsightService {
            let directory = self.run.join("dummy-worker");
            std::fs::create_dir_all(&directory).unwrap();
            std::fs::write(directory.join("gamecowork-worker-guard.cjs"),"// Fixture-only inert preload; dummy script never reads outside its own temp roots.\n").unwrap();
            let entry = directory.join("dummy.mjs");
            std::fs::write(&entry,r#"import fs from 'node:fs';import readline from 'node:readline';import path from 'node:path';
const root=process.argv[process.argv.indexOf('--project')+1];
for await(const line of readline.createInterface({input:process.stdin})){const request=JSON.parse(line);if(request.method==='initialize'&&fs.existsSync(path.join(root,'slow.flag')))await new Promise(resolve=>setTimeout(resolve,5000));process.stdout.write(JSON.stringify({id:request.id,status:'ok',data:{protocolVersion:4,indexReady:true,indexBuilding:false,indexSyncing:false,triggered:false}})+'\n');}
"#).unwrap();
            InsightService::new(self.home.clone(), Self::node(), entry).unwrap()
        }
    }
    impl Drop for Fixture {
        fn drop(&mut self) {
            let run = self.run.canonicalize().unwrap();
            let base = self.base.canonicalize().unwrap();
            assert!(files::within(&run, &base) && run != base);
            let _ = std::fs::remove_dir_all(run);
        }
    }
    #[test]
    fn query_and_progress_contracts_fail_closed_without_manufacturing_progress() {
        assert!(validate_query(&json!({"query":"valid","limit":200,"direction":"in"})).is_ok());
        for body in [
            json!({"query":"x\0y"}),
            json!({"limit":0}),
            json!({"limit":501}),
            json!({"direction":"all"}),
            json!([]),
        ] {
            assert!(validate_query(&body).is_err());
        }
        assert_eq!(
            project_status(json!({"indexBuilding":true,"progressPercent":null}), 99)["percent"],
            0.0
        );
        assert_eq!(
            project_status(json!({"indexBuilding":true,"progressPercent":37.5}), 99)["percent"],
            37.5
        );
        assert_eq!(
            project_status(
                json!({"indexReady":true,"indexBuilding":false,"indexSyncing":false}),
                99
            )["percent"],
            100.0
        );
    }
    #[test]
    fn published_generation_and_worker_protocol_metadata_reach_the_gui_without_invention() {
        let status = project_status(
            json!({"indexReady":true,"indexPath":"F:/own/index.a.db","schemaVersion":7,"protocolVersion":4,"pendingEntries":[{"path":"Assets/A.cs"}],"indexMtimeMs":123}),
            99,
        );
        assert_eq!(status["publishedIndexPath"], "F:/own/index.a.db");
        assert_eq!(status["schemaVersion"], 7);
        assert_eq!(status["protocolVersion"], 4);
        assert_eq!(status["pendingEntries"][0]["path"], "Assets/A.cs");
        let next = project_status(
            json!({"indexReady":true,"indexPath":"F:/own/index.b.db"}),
            99,
        );
        assert_ne!(status["publishedIndexPath"], next["publishedIndexPath"]);
        let absent = project_status(json!({"indexReady":true}), 99);
        assert!(absent["publishedIndexPath"].is_null());
        assert!(absent["schemaVersion"].is_null());
        assert!(absent["protocolVersion"].is_null());
        assert!(absent["pendingEntries"].is_null());
    }
    #[tokio::test(flavor = "multi_thread")]
    async fn slow_a_startup_does_not_block_b_and_close_invalidates_late_initialization() {
        let fixture = Fixture::new();
        std::fs::write(fixture.a.join("slow.flag"), "own fixture").unwrap();
        let service = fixture.delayed();
        service.open_workspace(&fixture.a).await;
        service.open_workspace(&fixture.b).await;
        let cloned = service.clone();
        let root = fixture.a.clone();
        let starting =
            tokio::spawn(async move { cloned.handle("ensure-index", Some(root), json!({})).await });
        let identity = key(&fixture.a.canonicalize().unwrap());
        let deadline = tokio::time::Instant::now() + Duration::from_secs(5);
        let old = loop {
            if let Some(worker) = service
                .inner
                .initializing
                .lock()
                .unwrap()
                .get(&identity)
                .cloned()
            {
                break worker;
            }
            assert!(tokio::time::Instant::now() < deadline);
            tokio::time::sleep(Duration::from_millis(10)).await;
        };
        let before = Instant::now();
        let b = service
            .handle("ensure-index", Some(fixture.b.clone()), json!({}))
            .await
            .unwrap();
        assert_eq!(b["ok"], true);
        assert!(
            before.elapsed() < Duration::from_secs(2),
            "B waited for slow A startup"
        );
        let before = Instant::now();
        service.close_workspace(&fixture.a).await;
        assert!(before.elapsed() < Duration::from_millis(250));
        assert!(tokio::time::timeout(Duration::from_secs(1), starting)
            .await
            .unwrap()
            .unwrap()
            .is_err());
        assert!(!old.alive.load(Ordering::Acquire));
        assert!(old.pending.lock().unwrap().is_empty());
        assert!(!service
            .inner
            .workers
            .lock()
            .unwrap()
            .contains_key(&identity));
        assert!(!service
            .inner
            .initializing
            .lock()
            .unwrap()
            .contains_key(&identity));
        assert!(service
            .handle("ensure-index", Some(fixture.a.clone()), json!({}))
            .await
            .is_err());
        std::fs::remove_file(fixture.a.join("slow.flag")).unwrap();
        service.open_workspace(&fixture.a).await;
        service
            .handle("ensure-index", Some(fixture.a.clone()), json!({}))
            .await
            .unwrap();
        let reopened = service
            .inner
            .workers
            .lock()
            .unwrap()
            .get(&identity)
            .unwrap()
            .clone();
        assert!(reopened.generation > old.generation);
        assert!(!Arc::ptr_eq(&reopened, &old));
        service.shutdown().await;
    }
    #[tokio::test(flavor = "multi_thread")]
    async fn real_worker_publishes_actual_code_and_disable_reenable_preserves_cache() {
        let fixture = Fixture::new();
        let code="namespace ActualFixture { public class RealThing { public string Marker = \"RUST_INSIGHT_REAL\"; public int Count() { return 7; } } }\n";
        std::fs::write(fixture.a.join("Assets/RealThing.cs"), code).unwrap();
        std::fs::write(
            fixture.a.join("Assets/RealThing.cs.meta"),
            "fileFormatVersion: 2\nguid: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
        )
        .unwrap();
        let service = fixture.real();
        service.open_workspace(&fixture.a).await;
        let triggered = service
            .handle(
                "ensure-index",
                Some(fixture.a.clone()),
                json!({"force":true}),
            )
            .await
            .unwrap();
        assert_eq!(triggered["triggered"], true);
        let deadline = tokio::time::Instant::now() + Duration::from_secs(15);
        loop {
            let status = service
                .handle("index-status", Some(fixture.a.clone()), json!({}))
                .await
                .unwrap();
            assert!(status["error"].is_null(), "{}", status);
            if status["indexReady"] == true
                && status["indexBuilding"] != true
                && status["indexSyncing"] != true
            {
                assert!(status["discoveredFileCount"].as_u64().unwrap() >= 3);
                break;
            }
            assert!(tokio::time::Instant::now() < deadline);
            tokio::time::sleep(Duration::from_millis(30)).await;
        }
        let found = service
            .handle(
                "vfs-search",
                Some(fixture.a.clone()),
                json!({"query":"RUST_INSIGHT_REAL","limit":50}),
            )
            .await
            .unwrap();
        assert!(found["results"]
            .as_array()
            .unwrap()
            .iter()
            .any(|row| row["path"].as_str().unwrap().contains("RealThing.cs")));
        assert!(!fixture.a.join(".gamecowork-cli/UnityInsight").exists());
        let disabled = service
            .handle(
                "set-enabled",
                Some(fixture.a.clone()),
                json!({"enabled":false}),
            )
            .await
            .unwrap();
        assert_eq!(disabled["status"], "disabled");
        assert!(service.inner.workers.lock().unwrap().is_empty());
        assert!(service
            .handle(
                "vfs-search",
                Some(fixture.a.clone()),
                json!({"query":"RUST_INSIGHT_REAL"})
            )
            .await
            .is_err());
        service
            .handle(
                "set-enabled",
                Some(fixture.a.clone()),
                json!({"enabled":true}),
            )
            .await
            .unwrap();
        let restored = service
            .handle(
                "vfs-search",
                Some(fixture.a.clone()),
                json!({"query":"RUST_INSIGHT_REAL"}),
            )
            .await
            .unwrap();
        assert!(!restored["results"].as_array().unwrap().is_empty());
        service.shutdown().await;
    }
}
