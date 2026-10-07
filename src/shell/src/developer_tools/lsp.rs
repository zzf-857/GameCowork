//! Local, opt-in C# LSP service. The host registers an opened workspace and uses
//! its captured handle; status and registration never start a process. This
//! module is deliberately independent of Core, models and editor installation.
use crate::process_lifetime::ProcessLifetime;
use serde::Deserialize;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::HashMap,
    fs,
    io::Read,
    path::{Component, Path, PathBuf},
    process::Stdio,
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        Arc, Mutex as StdMutex,
    },
    time::Duration,
};
use tokio::{
    io::{AsyncRead, AsyncReadExt, AsyncWriteExt},
    process::{Child, Command},
    sync::{mpsc, oneshot, watch, Mutex, Notify},
};

const MAX_FRAME: usize = 4 * 1024 * 1024;
const MAX_HEADER: usize = 16 * 1024;
const MAX_DOCUMENT: usize = 2 * 1024 * 1024;
const MAX_PENDING: usize = 32;
const RPC_TIMEOUT: Duration = Duration::from_secs(20);
const START_TIMEOUT: Duration = Duration::from_secs(45);

#[derive(Clone, Debug)]
pub struct LspError {
    pub code: &'static str,
    pub message: String,
}
impl LspError {
    fn new(code: &'static str, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }
    pub fn json(&self) -> Value {
        json!({"code":self.code,"error":self.message})
    }
}
impl std::fmt::Display for LspError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}
impl std::error::Error for LspError {}
type Result<T> = std::result::Result<T, LspError>;
fn io(error: impl std::fmt::Display) -> LspError {
    LspError::new("lsp_io_error", error.to_string())
}
fn display(path: &Path) -> String {
    path.to_string_lossy()
        .trim_start_matches(r"\\?\")
        .replace('\\', "/")
}
fn within(path: &Path, root: &Path) -> bool {
    #[cfg(windows)]
    {
        let path = display(path).to_lowercase();
        let root = display(root).trim_end_matches('/').to_lowercase();
        path == root || path.starts_with(&(root + "/"))
    }
    #[cfg(not(windows))]
    {
        path.starts_with(root)
    }
}
fn hash(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
fn bounded_file(path: &Path, limit: usize) -> Result<Vec<u8>> {
    let file = fs::File::open(path).map_err(io)?;
    if !file.metadata().map_err(io)?.is_file() {
        return Err(LspError::new(
            "lsp_not_file",
            "Expected a regular local file",
        ));
    }
    let mut bytes = vec![];
    file.take(limit as u64 + 1)
        .read_to_end(&mut bytes)
        .map_err(io)?;
    if bytes.len() > limit {
        return Err(LspError::new(
            "lsp_file_limit",
            "Local LSP file exceeded its size limit",
        ));
    }
    Ok(bytes)
}
fn owned_directory(path: &Path, boundary: &Path) -> Result<PathBuf> {
    let mut ancestor = path.to_path_buf();
    while !ancestor.exists() {
        ancestor = ancestor
            .parent()
            .ok_or_else(|| LspError::new("lsp_cache_path", "Invalid C# cache directory"))?
            .to_path_buf();
    }
    if !within(&ancestor.canonicalize().map_err(io)?, boundary) {
        return Err(LspError::new(
            "lsp_cache_path",
            "C# cache parent resolves outside application storage",
        ));
    }
    fs::create_dir_all(path).map_err(io)?;
    let canonical = path.canonicalize().map_err(io)?;
    if !within(&canonical, boundary) {
        return Err(LspError::new(
            "lsp_cache_path",
            "C# cache resolves outside application storage",
        ));
    }
    Ok(canonical)
}

/// The host supplies these values from its own package manifest/runtime paths,
/// never from an HTTP body. The ledger's SHA freezes all executable resources.
#[derive(Clone)]
pub struct Config {
    pub executable: PathBuf,
    pub ledger: PathBuf,
    pub ledger_sha256: String,
    pub app_data_root: PathBuf,
}
#[derive(Deserialize)]
struct Ledger {
    name: String,
    version: String,
    files: Vec<Resource>,
}
#[derive(Deserialize)]
struct Resource {
    path: String,
    sha256: String,
    size: u64,
}
impl Config {
    fn verify(&self) -> Result<PathBuf> {
        if !self.executable.is_absolute()
            || !self.ledger.is_absolute()
            || !self.app_data_root.is_absolute()
        {
            return Err(LspError::new(
                "lsp_runtime_path",
                "LSP runtime and application data paths must be absolute",
            ));
        }
        if !self.executable.is_file() || !self.ledger.is_file() {
            return Err(runtime_missing());
        }
        let bytes = bounded_file(&self.ledger, 1024 * 1024)?;
        if self.ledger_sha256.len() != 64 || !hash(&bytes).eq_ignore_ascii_case(&self.ledger_sha256)
        {
            return Err(LspError::new(
                "lsp_runtime_integrity",
                "The frozen LSP resource ledger changed",
            ));
        }
        let ledger: Ledger = serde_json::from_slice(&bytes).map_err(io)?;
        if ledger.name != "csharp-ls"
            || ledger.version != "0.21.0"
            || ledger.files.is_empty()
            || ledger.files.len() > 2000
        {
            return Err(LspError::new(
                "lsp_runtime_integrity",
                "Unsupported LSP runtime ledger/version",
            ));
        }
        let executable = self.executable.canonicalize().map_err(io)?;
        let root = executable.parent().ok_or_else(|| {
            LspError::new("lsp_runtime_path", "LSP runtime parent is unavailable")
        })?;
        let mut has_executable = false;
        for record in ledger.files {
            let relative = Path::new(&record.path);
            if relative.is_absolute()
                || relative
                    .components()
                    .any(|c| !matches!(c, Component::Normal(_)))
                || record.sha256.len() != 64
                || record.size > 128 * 1024 * 1024
            {
                return Err(LspError::new(
                    "lsp_runtime_integrity",
                    "Invalid LSP resource record",
                ));
            }
            let file = root.join(relative).canonicalize().map_err(io)?;
            if !within(&file, root) {
                return Err(LspError::new(
                    "lsp_runtime_integrity",
                    "An LSP resource resolves outside its frozen runtime",
                ));
            }
            let metadata = fs::metadata(&file).map_err(io)?;
            if metadata.len() != record.size
                || !hash(&bounded_file(&file, record.size as usize)?)
                    .eq_ignore_ascii_case(&record.sha256)
            {
                return Err(LspError::new(
                    "lsp_runtime_integrity",
                    format!("LSP resource failed its SHA check: {}", record.path),
                ));
            }
            has_executable |= file == executable;
        }
        if !has_executable {
            return Err(LspError::new(
                "lsp_runtime_integrity",
                "LSP executable is not recorded in the frozen resource ledger",
            ));
        }
        Ok(executable)
    }
}

fn runtime_missing() -> LspError {
    LspError::new(
        "lsp_runtime_missing",
        "The frozen local C# language resources are unavailable",
    )
}
pub fn unavailable_status(error: &LspError) -> Value {
    json!({"language":"csharp","version":"0.21.0","runtimeAvailable":false,"enabled":false,"supported":false,"connected":false,"ready":false,"generation":0,"pid":null,"phase":"unavailable","failure":error.json()})
}

#[derive(Clone)]
pub struct LspService {
    config: Arc<Config>,
    workspaces: Arc<Mutex<HashMap<String, Arc<Slot>>>>,
    next_generation: Arc<AtomicU64>,
}
struct Slot {
    root: PathBuf,
    generation: AtomicU64,
    opened: AtomicBool,
    enabled: AtomicBool,
    start: Mutex<()>,
    server: Mutex<Option<Arc<Server>>>,
    failure: StdMutex<Option<LspError>>,
}
#[derive(Clone)]
pub struct WorkspaceHandle {
    slot: Arc<Slot>,
    generation: u64,
}
impl WorkspaceHandle {
    pub fn root(&self) -> &Path {
        &self.slot.root
    }
    pub fn generation(&self) -> u64 {
        self.generation
    }
    fn check(&self) -> Result<()> {
        if !self.slot.opened.load(Ordering::Acquire)
            || self.slot.generation.load(Ordering::Acquire) != self.generation
        {
            return Err(LspError::new(
                "lsp_workspace_closed",
                "The captured LSP workspace generation is no longer open",
            ));
        }
        Ok(())
    }
}

#[derive(Clone, Copy, Debug)]
pub struct Position {
    pub line: u32,
    pub character: u32,
}
#[derive(Clone)]
struct Document {
    version: u64,
    text: String,
}
struct Server {
    pid: u32,
    root: PathBuf,
    solution: Option<PathBuf>,
    cache: PathBuf,
    tx: mpsc::Sender<Value>,
    pending: Arc<StdMutex<HashMap<u64, oneshot::Sender<Result<Value>>>>>,
    sequence: AtomicU64,
    child: Mutex<Option<Child>>,
    lifetime: StdMutex<Option<ProcessLifetime>>,
    stop: Mutex<()>,
    stopped: watch::Sender<bool>,
    alive: AtomicBool,
    initialized: AtomicBool,
    ready: AtomicBool,
    ready_changed: Notify,
    loading: StdMutex<Option<Value>>,
    failure: StdMutex<Option<LspError>>,
    documents: Mutex<HashMap<String, Document>>,
    closed_versions: StdMutex<HashMap<String, u64>>,
}
struct PendingGuard {
    id: u64,
    pending: Arc<StdMutex<HashMap<u64, oneshot::Sender<Result<Value>>>>>,
    tx: mpsc::Sender<Value>,
}
impl Drop for PendingGuard {
    fn drop(&mut self) {
        if self.pending.lock().unwrap().remove(&self.id).is_some() {
            let _ = self.tx.try_send(
                json!({"jsonrpc":"2.0","method":"$/cancelRequest","params":{"id":self.id}}),
            );
        }
    }
}

impl LspService {
    pub fn new(config: Config) -> Result<Self> {
        config.verify()?;
        if !config.app_data_root.is_dir() {
            return Err(LspError::new(
                "lsp_cache_path",
                "The host must supply an existing application-owned data directory",
            ));
        }
        Ok(Self {
            config: Arc::new(config),
            workspaces: Arc::new(Mutex::new(HashMap::new())),
            next_generation: Arc::new(AtomicU64::new(1)),
        })
    }
    /// Registration is called only after the host opens a workspace. No
    /// subprocess, restore, project generation, or model request is performed.
    pub async fn open_workspace(&self, root: &Path) -> Result<WorkspaceHandle> {
        let root = root.canonicalize().map_err(io)?;
        if !root.is_dir() {
            return Err(LspError::new(
                "lsp_workspace_path",
                "LSP requires a local workspace directory",
            ));
        }
        file_uri(&root)?;
        let app_data = self.config.app_data_root.canonicalize().map_err(io)?;
        let runtime = self.config.executable.canonicalize().map_err(io)?;
        if within(&app_data, &root) || within(runtime.parent().unwrap(), &root) {
            return Err(LspError::new(
                "lsp_cache_path",
                "LSP runtime/cache directories must be outside the opened project",
            ));
        }
        let key = display(&root).to_lowercase();
        let mut workspaces = self.workspaces.lock().await;
        let slot = workspaces
            .entry(key)
            .or_insert_with(|| {
                Arc::new(Slot {
                    root,
                    generation: AtomicU64::new(self.next_generation.fetch_add(1, Ordering::AcqRel)),
                    opened: AtomicBool::new(true),
                    enabled: AtomicBool::new(false),
                    start: Mutex::new(()),
                    server: Mutex::new(None),
                    failure: StdMutex::new(None),
                })
            })
            .clone();
        Ok(WorkspaceHandle {
            generation: slot.generation.load(Ordering::Acquire),
            slot,
        })
    }
    pub async fn workspace(&self, root: &Path) -> Result<WorkspaceHandle> {
        let root = root.canonicalize().map_err(io)?;
        let slot = self
            .workspaces
            .lock()
            .await
            .get(&display(&root).to_lowercase())
            .cloned()
            .ok_or_else(|| {
                LspError::new(
                    "lsp_workspace_closed",
                    "LSP workspace is not registered as open",
                )
            })?;
        let handle = WorkspaceHandle {
            generation: slot.generation.load(Ordering::Acquire),
            slot,
        };
        handle.check()?;
        Ok(handle)
    }
    pub async fn status(&self, handle: &WorkspaceHandle) -> Result<Value> {
        handle.check()?;
        let server = handle.slot.server.lock().await.clone();
        let runtime_available = self.config.executable.is_file() && self.config.ledger.is_file();
        let project = select_project(
            &handle.slot.root,
            server.as_ref().and_then(|s| s.solution.as_deref()),
        );
        let supported = runtime_available && project.is_ok();
        let failure = (!runtime_available).then(runtime_missing).or_else(|| {
            handle
                .slot
                .failure
                .lock()
                .unwrap()
                .clone()
                .or_else(|| {
                    server
                        .as_ref()
                        .and_then(|s| s.failure.lock().unwrap().clone())
                })
                .or_else(|| project.err())
        });
        let connected = supported
            && server.as_ref().is_some_and(|s| {
                s.alive.load(Ordering::Acquire) && s.initialized.load(Ordering::Acquire)
            });
        let ready = supported
            && server
                .as_ref()
                .is_some_and(|s| s.ready.load(Ordering::Acquire));
        let enabled = handle.slot.enabled.load(Ordering::Acquire);
        Ok(
            json!({"language":"csharp","version":"0.21.0","runtimeAvailable":runtime_available,"enabled":enabled,"supported":supported,"connected":connected,"ready":ready,"generation":handle.generation,"pid":server.as_ref().filter(|s|s.alive.load(Ordering::Acquire)).map(|s|s.pid),"phase":if !runtime_available {"unavailable"} else if !supported {"unsupported"} else if !enabled {"disabled"} else if failure.is_some(){"failed"} else if ready{"ready"} else if connected{"loading"} else {"stopped"},"failure":failure.map(|e|e.json())}),
        )
    }
    pub async fn set_enabled(
        &self,
        handle: &WorkspaceHandle,
        enabled: bool,
        solution: Option<&Path>,
    ) -> Result<Value> {
        handle.check()?;
        if !enabled {
            handle.slot.enabled.store(false, Ordering::Release);
            handle.slot.generation.store(
                self.next_generation.fetch_add(1, Ordering::AcqRel),
                Ordering::Release,
            );
            let server = handle.slot.server.lock().await.take();
            let stopped = match server {
                Some(server) => Some(server.shutdown().await),
                None => None,
            };
            return Ok(
                json!({"enabled":false,"connected":false,"generation":handle.slot.generation.load(Ordering::Acquire),"stopped":stopped}),
            );
        }
        handle.slot.enabled.store(true, Ordering::Release);
        self.ensure(handle, solution).await?;
        self.status(handle).await
    }
    pub async fn restore_enabled(&self, handle: &WorkspaceHandle, enabled: bool) -> Result<()> {
        handle.check()?;
        handle.slot.enabled.store(enabled, Ordering::Release);
        Ok(())
    }
    pub async fn shutdown(&self) {
        let handles = self
            .workspaces
            .lock()
            .await
            .values()
            .map(|slot| WorkspaceHandle {
                slot: slot.clone(),
                generation: slot.generation.load(Ordering::Acquire),
            })
            .collect::<Vec<_>>();
        for handle in handles {
            let _ = self.close_workspace(&handle).await;
        }
    }
    pub async fn close_workspace(&self, handle: &WorkspaceHandle) -> Result<Value> {
        handle.check()?;
        handle.slot.opened.store(false, Ordering::Release);
        handle.slot.enabled.store(false, Ordering::Release);
        handle.slot.generation.store(
            self.next_generation.fetch_add(1, Ordering::AcqRel),
            Ordering::Release,
        );
        let key = display(&handle.slot.root).to_lowercase();
        let mut workspaces = self.workspaces.lock().await;
        if workspaces
            .get(&key)
            .is_some_and(|s| Arc::ptr_eq(s, &handle.slot))
        {
            workspaces.remove(&key);
        }
        drop(workspaces);
        let server = handle.slot.server.lock().await.take();
        let stopped = match server {
            Some(server) => Some(server.shutdown().await),
            None => None,
        };
        Ok(json!({"closed":true,"connected":false,"stopped":stopped}))
    }
    async fn ensure(
        &self,
        handle: &WorkspaceHandle,
        solution: Option<&Path>,
    ) -> Result<Arc<Server>> {
        handle.check()?;
        if !handle.slot.enabled.load(Ordering::Acquire) {
            return Err(LspError::new(
                "lsp_disabled",
                "Enable C# language support for this workspace before querying it",
            ));
        }
        let _starting = handle.slot.start.lock().await;
        handle.check()?;
        if let Some(server) = handle.slot.server.lock().await.clone() {
            if server.alive.load(Ordering::Acquire) && server.ready.load(Ordering::Acquire) {
                if let Some(selected) = solution {
                    let selected = select_project(&handle.slot.root, Some(selected))?;
                    if selected != server.solution {
                        return Err(LspError::new(
                            "lsp_project_change_required",
                            "Disable C# support before selecting a different solution",
                        ));
                    }
                }
                return Ok(server);
            }
        }
        let result = async {
            let selected = select_project(&handle.slot.root, solution)?;
            let config = self.config.clone();
            let executable = tokio::task::spawn_blocking(move || config.verify())
                .await
                .map_err(io)??;
            handle.check()?;
            let app_data = self.config.app_data_root.canonicalize().map_err(io)?;
            let cache = app_data
                .join("lsp")
                .join(hash(display(&handle.slot.root).as_bytes()));
            let cache = owned_directory(&cache, &app_data)?;
            if !within(&cache, &app_data) || within(&cache, &handle.slot.root) {
                return Err(LspError::new(
                    "lsp_cache_path",
                    "LSP cache escaped application storage",
                ));
            }
            let server =
                Server::spawn(executable, handle.slot.root.clone(), selected, cache).await?;
            {
                let mut running = handle.slot.server.lock().await;
                handle.check()?;
                *running = Some(server.clone());
            }
            let initialized = server.initialize().await;
            if let Err(error) = initialized {
                let _ = server.shutdown().await;
                return Err(error);
            }
            handle.check()?;
            Ok(server)
        }
        .await;
        match &result {
            Ok(_) => {
                *handle.slot.failure.lock().unwrap() = None;
            }
            Err(error) => {
                *handle.slot.failure.lock().unwrap() = Some(error.clone());
                if let Some(server) = handle.slot.server.lock().await.take() {
                    let _ = server.shutdown().await;
                }
            }
        }
        result
    }
    /// Full text is owned by the client while open; sync never writes project
    /// files. Equal versions with different bytes and older versions reject.
    pub async fn sync_document(
        &self,
        handle: &WorkspaceHandle,
        path: &str,
        text: &str,
        version: u64,
    ) -> Result<Value> {
        validate_text(text, version)?;
        let file = source_file(&handle.slot.root, path)?;
        let uri = file_uri(&file)?;
        let server = self.ensure(handle, None).await?;
        let mut docs = server.documents.lock().await;
        handle.check()?;
        if let Some(previous) = docs.get(&uri) {
            if version < previous.version || (version == previous.version && text != previous.text)
            {
                return Err(LspError::new(
                    "lsp_document_version",
                    "A stale document version cannot replace a newer LSP draft",
                ));
            }
            if version == previous.version {
                return Ok(json!({"synced":true,"version":version,"changed":false}));
            }
        }
        if !docs.contains_key(&uri)
            && server
                .closed_versions
                .lock()
                .unwrap()
                .get(&uri)
                .is_some_and(|previous| version <= *previous)
        {
            return Err(LspError::new("lsp_document_version","A closed document cannot be revived by an older queued synchronization; reopen it with a newer version"));
        }
        let method = if docs.contains_key(&uri) {
            "textDocument/didChange"
        } else {
            "textDocument/didOpen"
        };
        let params = if method == "textDocument/didOpen" {
            json!({"textDocument":{"uri":uri,"languageId":"csharp","version":version,"text":text}})
        } else {
            json!({"textDocument":{"uri":uri,"version":version},"contentChanges":[{"text":text}]})
        };
        server.notify(method, params).await?;
        docs.insert(
            uri,
            Document {
                version,
                text: text.to_owned(),
            },
        );
        handle.check()?;
        Ok(json!({"synced":true,"version":version,"changed":true}))
    }
    pub async fn close_document(&self, handle: &WorkspaceHandle, path: &str) -> Result<Value> {
        self.close_document_version(handle, path, None).await
    }
    pub async fn close_document_version(
        &self,
        handle: &WorkspaceHandle,
        path: &str,
        expected_version: Option<u64>,
    ) -> Result<Value> {
        handle.check()?;
        let uri = file_uri(&source_path(&handle.slot.root, path, false)?)?;
        let server = handle.slot.server.lock().await.clone();
        let mut changed = false;
        if let Some(server) = server {
            let mut docs = server.documents.lock().await;
            if let Some(expected) = expected_version {
                if docs
                    .get(&uri)
                    .is_some_and(|document| document.version != expected)
                {
                    return Ok(
                        json!({"closed":false,"changed":false,"reason":"A newer document owner is still open"}),
                    );
                }
            }
            if let Some(previous) = docs.remove(&uri) {
                server
                    .closed_versions
                    .lock()
                    .unwrap()
                    .insert(uri.clone(), previous.version);
                server
                    .notify("textDocument/didClose", json!({"textDocument":{"uri":uri}}))
                    .await?;
                changed = true;
            }
        }
        handle.check()?;
        Ok(json!({"closed":true,"changed":changed}))
    }
    pub async fn hover(
        &self,
        handle: &WorkspaceHandle,
        path: &str,
        position: Position,
    ) -> Result<Value> {
        self.query(handle, path, position, "textDocument/hover", false)
            .await
    }
    pub async fn definition(
        &self,
        handle: &WorkspaceHandle,
        path: &str,
        position: Position,
    ) -> Result<Value> {
        self.query(handle, path, position, "textDocument/definition", false)
            .await
    }
    pub async fn references(
        &self,
        handle: &WorkspaceHandle,
        path: &str,
        position: Position,
        include_declaration: bool,
    ) -> Result<Value> {
        self.query(
            handle,
            path,
            position,
            "textDocument/references",
            include_declaration,
        )
        .await
    }
    async fn query(
        &self,
        handle: &WorkspaceHandle,
        path: &str,
        position: Position,
        method: &str,
        include_declaration: bool,
    ) -> Result<Value> {
        let file = source_file(&handle.slot.root, path)?;
        let uri = file_uri(&file)?;
        let server = self.ensure(handle, None).await?;
        let docs = server.documents.lock().await;
        let doc = docs.get(&uri).ok_or_else(|| {
            LspError::new(
                "lsp_document_not_open",
                "Synchronize the current editor text before querying C# symbols",
            )
        })?;
        validate_position(&doc.text, position)?;
        let version = doc.version;
        let mut params = json!({"textDocument":{"uri":uri},"position":{"line":position.line,"character":position.character}});
        if method == "textDocument/references" {
            params["context"] = json!({"includeDeclaration":include_declaration});
        }
        // Enqueue while holding the document lock to order sync before query,
        // then release it so a newer draft can invalidate this response.
        let pending = server.begin_request(method, params).await?;
        drop(docs);
        let result = server.finish_request(pending, RPC_TIMEOUT).await?;
        handle.check()?;
        if server.documents.lock().await.get(&uri).map(|d| d.version) != Some(version) {
            return Err(LspError::new(
                "lsp_result_stale",
                "The document changed while its language result was being computed",
            ));
        }
        if method == "textDocument/hover" {
            Ok(json!({"hover":result,"version":version}))
        } else {
            Ok(
                json!({"locations":normalize_locations(result,&handle.slot.root)?,"version":version}),
            )
        }
    }
}

fn validate_text(text: &str, version: u64) -> Result<()> {
    if text.len() > MAX_DOCUMENT || text.contains('\0') {
        return Err(LspError::new(
            "lsp_document_limit",
            "C# documents must be UTF-8 text without NUL and at most 2 MiB",
        ));
    }
    if version == 0 || version > i32::MAX as u64 {
        return Err(LspError::new(
            "lsp_document_version",
            "A positive monotonically increasing LSP document version is required",
        ));
    }
    Ok(())
}
fn validate_position(text: &str, position: Position) -> Result<()> {
    let line = text
        .split('\n')
        .nth(position.line as usize)
        .ok_or_else(|| {
            LspError::new(
                "lsp_position_invalid",
                "C# source line is outside the synchronized document",
            )
        })?
        .trim_end_matches('\r');
    let mut offset = 0;
    for ch in line.chars() {
        if offset == position.character {
            return Ok(());
        }
        offset += ch.len_utf16() as u32;
        if offset > position.character {
            return Err(LspError::new(
                "lsp_position_invalid",
                "C# position splits a UTF-16 surrogate pair",
            ));
        }
    }
    if offset != position.character {
        return Err(LspError::new(
            "lsp_position_invalid",
            "C# character is outside the synchronized line",
        ));
    }
    Ok(())
}
fn source_file(root: &Path, input: &str) -> Result<PathBuf> {
    source_path(root, input, true)
}
fn source_path(root: &Path, input: &str, required: bool) -> Result<PathBuf> {
    let parsed = if input.starts_with("file:") {
        uri_file(input)?
    } else {
        PathBuf::from(input)
    };
    local_request_path(&parsed)?;
    if parsed.is_absolute() && !within(&parsed, root) {
        return Err(LspError::new(
            "lsp_path_denied",
            "C# path is outside its captured workspace",
        ));
    }
    if parsed
        .components()
        .any(|c| matches!(c, Component::ParentDir))
        || input.contains('\0')
    {
        return Err(LspError::new(
            "lsp_path_denied",
            "LSP source paths cannot traverse parent directories",
        ));
    }
    let candidate = if parsed.is_absolute() {
        parsed
    } else {
        root.join(parsed)
    };
    if !within(&candidate, root) {
        return Err(LspError::new(
            "lsp_path_denied",
            "C# candidate path is outside its captured workspace",
        ));
    }
    let file = if required || candidate.exists() {
        candidate.canonicalize().map_err(io)?
    } else {
        let mut ancestor = candidate
            .parent()
            .ok_or_else(|| LspError::new("lsp_path_denied", "Invalid C# document path"))?
            .to_path_buf();
        while !ancestor.exists() {
            ancestor = ancestor
                .parent()
                .ok_or_else(|| {
                    LspError::new(
                        "lsp_path_denied",
                        "C# document has no valid workspace parent",
                    )
                })?
                .to_path_buf();
        }
        let canonical = ancestor.canonicalize().map_err(io)?;
        if !within(&canonical, root) {
            return Err(LspError::new(
                "lsp_path_denied",
                "C# document parent escaped its workspace",
            ));
        }
        canonical.join(candidate.strip_prefix(&ancestor).map_err(io)?)
    };
    if !within(&file, root)
        || (required && !file.is_file())
        || file
            .extension()
            .is_none_or(|s| !s.to_string_lossy().eq_ignore_ascii_case("cs"))
    {
        return Err(LspError::new(
            "lsp_path_denied",
            "LSP accepts existing C# source files inside its captured workspace only",
        ));
    }
    Ok(file)
}
fn file_uri(path: &Path) -> Result<String> {
    let path = display(path);
    if path.starts_with("//") {
        return Err(LspError::new(
            "lsp_path_denied",
            "UNC/remote C# workspaces are not supported by local LSP",
        ));
    }
    let mut result = if path.starts_with('/') {
        String::from("file://")
    } else {
        String::from("file:///")
    };
    for byte in path.as_bytes() {
        if byte.is_ascii_alphanumeric() || b"-._~/:".contains(byte) {
            result.push(*byte as char);
        } else {
            result.push_str(&format!("%{byte:02X}"));
        }
    }
    Ok(result)
}
fn uri_file(uri: &str) -> Result<PathBuf> {
    let tail = uri.strip_prefix("file:///").ok_or_else(|| {
        LspError::new(
            "lsp_path_denied",
            "Only local file URIs are supported for C# source",
        )
    })?;
    if tail.contains(['?', '#', '\0']) {
        return Err(LspError::new(
            "lsp_path_denied",
            "Invalid local C# file URI",
        ));
    }
    let mut bytes = vec![];
    let input = tail.as_bytes();
    let mut i = 0;
    while i < input.len() {
        if input[i] == b'%' {
            if i + 2 >= input.len() {
                return Err(LspError::new(
                    "lsp_path_denied",
                    "Invalid percent-encoded file URI",
                ));
            }
            let hex = std::str::from_utf8(&input[i + 1..i + 3]).map_err(io)?;
            bytes.push(u8::from_str_radix(hex, 16).map_err(io)?);
            i += 3;
        } else {
            bytes.push(input[i]);
            i += 1;
        }
    }
    let path = String::from_utf8(bytes).map_err(io)?;
    #[cfg(windows)]
    let path = PathBuf::from(path);
    #[cfg(not(windows))]
    let path = PathBuf::from(format!("/{path}"));
    local_request_path(&path)?;
    if !path.is_absolute() {
        return Err(LspError::new(
            "lsp_path_denied",
            "C# file URI is not an absolute local path",
        ));
    }
    Ok(path)
}
fn local_request_path(path: &Path) -> Result<()> {
    let text = path.to_string_lossy();
    if text.starts_with(r"\\") || text.starts_with("//") {
        return Err(LspError::new(
            "lsp_path_denied",
            "Network, device and verbatim file paths are not supported by local C# requests",
        ));
    }
    #[cfg(windows)]
    for component in path.components() {
        if let Component::Prefix(prefix) = component {
            if !matches!(prefix.kind(), std::path::Prefix::Disk(_)) || !path.is_absolute() {
                return Err(LspError::new(
                    "lsp_path_denied",
                    "Only absolute local drive paths are supported",
                ));
            }
        }
    }
    Ok(())
}
fn select_project(root: &Path, selected: Option<&Path>) -> Result<Option<PathBuf>> {
    let selected = if let Some(selected) = selected {
        let selected = if selected.is_absolute() {
            selected.to_path_buf()
        } else {
            root.join(selected)
        }
        .canonicalize()
        .map_err(io)?;
        if !within(&selected, root)
            || !selected.is_file()
            || selected.extension().is_none_or(|s| s != "sln")
        {
            return Err(LspError::new(
                "lsp_project_invalid",
                "Choose an existing .sln inside this workspace",
            ));
        }
        Some(selected)
    } else {
        None
    };
    let mut solutions = vec![];
    let mut projects = vec![];
    for entry in fs::read_dir(root).map_err(io)? {
        let entry = entry.map_err(io)?;
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        match path.extension().and_then(|s| s.to_str()) {
            Some("sln") => {
                let path = path.canonicalize().map_err(io)?;
                if !within(&path, root) {
                    return Err(LspError::new(
                        "lsp_project_invalid",
                        "C# solution metadata escapes its workspace",
                    ));
                }
                solutions.push(path);
            }
            Some("csproj") => projects.push(path),
            _ => {}
        }
    }
    if selected.is_none() && solutions.len() > 1 {
        return Err(LspError::new(
            "lsp_project_ambiguous",
            "This workspace has multiple C# solutions; choose one explicitly",
        ));
    }
    if solutions.is_empty() && projects.is_empty() {
        return Err(LspError::new("lsp_project_missing","No C# .sln or .csproj exists. Generate C# project files in the selected editor before enabling language support"));
    }
    for project in projects {
        let project = project.canonicalize().map_err(io)?;
        if !within(&project, root) {
            return Err(LspError::new(
                "lsp_project_invalid",
                "C# project metadata escapes its workspace",
            ));
        }
        let bytes = bounded_file(&project, 2 * 1024 * 1024)?;
        let xml = String::from_utf8_lossy(&bytes);
        if (xml.contains("Sdk=") || xml.contains("Sdk =") || xml.contains("PackageReference"))
            && !project
                .parent()
                .unwrap()
                .join("obj/project.assets.json")
                .is_file()
        {
            return Err(LspError::new("lsp_restore_required","C# dependency metadata is missing. Prepare this project's dependencies explicitly; GameCowork LSP does not run network restore"));
        }
    }
    Ok(selected.or_else(|| solutions.pop()))
}
fn normalize_locations(value: Value, root: &Path) -> Result<Vec<Value>> {
    let values = match value {
        Value::Null => vec![],
        Value::Array(values) => values,
        other => vec![other],
    };
    let mut result = vec![];
    for value in values {
        let uri = value["uri"]
            .as_str()
            .or_else(|| value["targetUri"].as_str())
            .ok_or_else(|| {
                LspError::new(
                    "lsp_protocol_error",
                    "Language server returned an invalid source location",
                )
            })?;
        let path = uri_file(uri)?;
        if !within(&path, root) {
            return Err(LspError::new(
                "lsp_location_unsupported",
                "C# definition URI is outside its captured workspace",
            ));
        }
        let path = path.canonicalize().map_err(io)?;
        if !within(&path, root) {
            return Err(LspError::new("lsp_location_unsupported","The definition is outside this workspace or requires metadata/decompilation, which is not supported yet"));
        }
        let range = value
            .get("range")
            .or_else(|| value.get("targetSelectionRange"))
            .or_else(|| value.get("targetRange"))
            .ok_or_else(|| {
                LspError::new(
                    "lsp_protocol_error",
                    "Language server returned a location without a range",
                )
            })?;
        for position in ["start", "end"] {
            for field in ["line", "character"] {
                if range[position][field].as_u64().is_none() {
                    return Err(LspError::new(
                        "lsp_protocol_error",
                        "Invalid C# source range",
                    ));
                }
            }
        }
        result.push(json!({"uri":file_uri(&path)?,"range":range}));
    }
    Ok(result)
}

type PendingRequest = (u64, oneshot::Receiver<Result<Value>>, PendingGuard);
impl Server {
    async fn spawn(
        executable: PathBuf,
        root: PathBuf,
        solution: Option<PathBuf>,
        cache: PathBuf,
    ) -> Result<Arc<Self>> {
        for directory in [
            "temporary",
            "dotnet-home",
            "nuget-packages",
            "nuget-http",
            "nuget-plugins",
        ] {
            owned_directory(&cache.join(directory), &cache)?;
        }
        let mut command = Command::new(executable);
        command.current_dir(&root).args(["--loglevel", "warning"]);
        if let Some(solution) = &solution {
            command.arg("--solution").arg(solution);
        }
        for (key, _) in std::env::vars_os() {
            let key_text = key.to_string_lossy().to_uppercase();
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
                "GAMECOWORK_",
                "NUGET_",
                "MSBUILD",
                "DOTNET_",
            ]
            .iter()
            .any(|prefix| key_text.starts_with(prefix))
                || [
                    "HTTP_PROXY",
                    "HTTPS_PROXY",
                    "ALL_PROXY",
                    "NO_PROXY",
                    "NODE_OPTIONS",
                ]
                .contains(&key_text.as_str())
            {
                command.env_remove(key);
            }
        }
        command
            .env("DOTNET_CLI_HOME", cache.join("dotnet-home"))
            .env("DOTNET_CLI_TELEMETRY_OPTOUT", "1")
            .env("DOTNET_SKIP_FIRST_TIME_EXPERIENCE", "1")
            .env("DOTNET_NOLOGO", "1")
            .env("MSBUILDDISABLENODEREUSE", "1")
            .env("MSBuildEnableWorkloadResolver", "false")
            .env("NuGetAudit", "false")
            .env("RestoreSources", "")
            .env("RestoreAdditionalProjectSources", "")
            .env("NUGET_PACKAGES", cache.join("nuget-packages"))
            .env("NUGET_HTTP_CACHE_PATH", cache.join("nuget-http"))
            .env("NUGET_PLUGINS_CACHE_PATH", cache.join("nuget-plugins"))
            .env("TEMP", cache.join("temporary"))
            .env("TMP", cache.join("temporary"))
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .kill_on_drop(true);
        #[cfg(windows)]
        command.creation_flags(0x08000000);
        let mut child = command.spawn().map_err(io)?;
        let pid = child
            .id()
            .ok_or_else(|| io("LSP process exited before its PID was captured"))?;
        let lifetime = match ProcessLifetime::attach(&child) {
            Ok(lifetime) => lifetime,
            Err(error) => {
                let _ = child.kill().await;
                return Err(LspError::new("lsp_job_failed", error));
            }
        };
        let mut stdin = child.stdin.take().unwrap();
        let stdout = child.stdout.take().unwrap();
        let mut stderr = child.stderr.take().unwrap();
        let (tx, mut rx) = mpsc::channel::<Value>(64);
        let (stopped, mut stopping) = watch::channel(false);
        let server = Arc::new(Self {
            pid,
            root,
            solution,
            cache,
            tx,
            pending: Arc::new(StdMutex::new(HashMap::new())),
            sequence: AtomicU64::new(1),
            child: Mutex::new(Some(child)),
            lifetime: StdMutex::new(Some(lifetime)),
            stop: Mutex::new(()),
            stopped,
            alive: AtomicBool::new(true),
            initialized: AtomicBool::new(false),
            ready: AtomicBool::new(false),
            ready_changed: Notify::new(),
            loading: StdMutex::new(None),
            failure: StdMutex::new(None),
            documents: Mutex::new(HashMap::new()),
            closed_versions: StdMutex::new(HashMap::new()),
        });
        let writing = Arc::downgrade(&server);
        tokio::spawn(async move {
            loop {
                let value = tokio::select! {_=stopping.changed()=>break,value=rx.recv()=>match value{Some(value)=>value,None=>break}};
                let content = match serde_json::to_vec(&value) {
                    Ok(content) if content.len() <= MAX_FRAME => content,
                    _ => break,
                };
                let header = format!("Content-Length: {}\r\n\r\n", content.len());
                if stdin.write_all(header.as_bytes()).await.is_err()
                    || stdin.write_all(&content).await.is_err()
                {
                    break;
                }
            }
            if let Some(server) = writing.upgrade() {
                server.fail(LspError::new(
                    "lsp_process_stopped",
                    "C# server input closed",
                ));
            }
        });
        let reading = Arc::downgrade(&server);
        tokio::spawn(async move {
            let mut reader = FramedReader::new(stdout);
            loop {
                let message = match reader.next().await {
                    Ok(Some(message)) => message,
                    Ok(None) => {
                        if let Some(server) = reading.upgrade() {
                            server.fail(LspError::new(
                                "lsp_process_stopped",
                                "C# server output closed",
                            ));
                        }
                        break;
                    }
                    Err(error) => {
                        if let Some(server) = reading.upgrade() {
                            server.fail(error);
                        }
                        break;
                    }
                };
                let Some(server) = reading.upgrade() else {
                    break;
                };
                if let Err(error) = server.receive(message).await {
                    server.fail(error);
                    break;
                }
            }
        });
        let log = server
            .cache
            .join(format!("server-{}.stderr.log", server.pid));
        tokio::spawn(async move {
            let mut written = 0usize;
            let mut buffer = [0u8; 8192];
            let mut log_file = tokio::fs::OpenOptions::new()
                .write(true)
                .create_new(true)
                .open(log)
                .await
                .ok();
            loop {
                let count = match stderr.read(&mut buffer).await {
                    Ok(0) | Err(_) => break,
                    Ok(count) => count,
                };
                let allowed = count.min((64 * 1024usize).saturating_sub(written));
                if let Some(file) = log_file.as_mut() {
                    let _ = file.write_all(&buffer[..allowed]).await;
                }
                written += allowed;
            }
        });
        Ok(server)
    }
    fn fail(&self, error: LspError) {
        self.alive.store(false, Ordering::Release);
        self.ready.store(false, Ordering::Release);
        *self.failure.lock().unwrap() = Some(error.clone());
        self.ready_changed.notify_waiters();
        let pending = std::mem::take(&mut *self.pending.lock().unwrap());
        for (_, sender) in pending {
            let _ = sender.send(Err(error.clone()));
        }
    }
    async fn send(&self, value: Value) -> Result<()> {
        if !self.alive.load(Ordering::Acquire) {
            return Err(LspError::new(
                "lsp_process_stopped",
                "C# language server is no longer running",
            ));
        }
        tokio::time::timeout(Duration::from_secs(3), self.tx.send(value))
            .await
            .map_err(|_| {
                LspError::new(
                    "lsp_write_timeout",
                    "C# request queue did not accept the message",
                )
            })?
            .map_err(io)
    }
    async fn notify(&self, method: &str, params: Value) -> Result<()> {
        self.send(json!({"jsonrpc":"2.0","method":method,"params":params}))
            .await
    }
    async fn begin_request(&self, method: &str, params: Value) -> Result<PendingRequest> {
        let id = self.sequence.fetch_add(1, Ordering::AcqRel);
        let (sender, receiver) = oneshot::channel();
        {
            let mut pending = self.pending.lock().unwrap();
            if pending.len() >= MAX_PENDING {
                return Err(LspError::new(
                    "lsp_request_limit",
                    "Too many concurrent C# language requests",
                ));
            }
            pending.insert(id, sender);
        }
        let guard = PendingGuard {
            id,
            pending: self.pending.clone(),
            tx: self.tx.clone(),
        };
        self.send(json!({"jsonrpc":"2.0","id":id,"method":method,"params":params}))
            .await?;
        Ok((id, receiver, guard))
    }
    async fn finish_request(&self, pending: PendingRequest, timeout: Duration) -> Result<Value> {
        let (_, receiver, _guard) = pending;
        tokio::time::timeout(timeout, receiver)
            .await
            .map_err(|_| {
                LspError::new(
                    "lsp_request_timeout",
                    "C# language request timed out and was cancelled",
                )
            })?
            .map_err(io)?
    }
    async fn request(&self, method: &str, params: Value, timeout: Duration) -> Result<Value> {
        self.finish_request(self.begin_request(method, params).await?, timeout)
            .await
    }
    async fn initialize(&self) -> Result<()> {
        let result=self.request("initialize",json!({"processId":std::process::id(),"clientInfo":{"name":"GameCowork local C# service","version":"1"},"rootUri":file_uri(&self.root)?,"workspaceFolders":[{"uri":file_uri(&self.root)?,"name":self.root.file_name().unwrap_or_default().to_string_lossy()}],"capabilities":{"workspace":{"configuration":true,"workspaceFolders":true,"workDoneProgress":true},"textDocument":{"synchronization":{"dynamicRegistration":false,"didSave":true},"hover":{"contentFormat":["plaintext","markdown"]},"definition":{"linkSupport":true},"references":{"dynamicRegistration":false}},"general":{"positionEncodings":["utf-16"]}}}),START_TIMEOUT).await?;
        if result["serverInfo"]["name"] != "csharp-ls"
            || !result["serverInfo"]["version"]
                .as_str()
                .is_some_and(|v| v.starts_with("0.21.0"))
        {
            return Err(LspError::new(
                "lsp_runtime_version",
                "Unexpected C# language server identity/version",
            ));
        }
        for capability in ["hoverProvider", "definitionProvider", "referencesProvider"] {
            if result["capabilities"][capability] != true
                && !result["capabilities"][capability].is_object()
            {
                return Err(LspError::new(
                    "lsp_capability_missing",
                    format!("C# server does not support {capability}"),
                ));
            }
        }
        self.initialized.store(true, Ordering::Release);
        self.notify("initialized", json!({})).await?;
        tokio::time::timeout(START_TIMEOUT, async {
            loop {
                let changed = self.ready_changed.notified();
                if self.ready.load(Ordering::Acquire) {
                    if let Some(error) = self.failure.lock().unwrap().clone() {
                        return Err(error);
                    }
                    return Ok(());
                }
                if !self.alive.load(Ordering::Acquire) {
                    return Err(self.failure.lock().unwrap().clone().unwrap_or_else(|| {
                        LspError::new(
                            "lsp_process_stopped",
                            "C# server closed during initialization",
                        )
                    }));
                }
                changed.await;
            }
        })
        .await
        .map_err(|_| {
            LspError::new(
                "lsp_project_load_timeout",
                "C# workspace did not finish loading; no ready connection was advertised",
            )
        })?
    }
    async fn receive(&self, message: Value) -> Result<()> {
        if message["jsonrpc"] != "2.0" {
            return Err(LspError::new(
                "lsp_protocol_error",
                "C# server did not send JSON-RPC 2.0",
            ));
        }
        if let Some(method) = message["method"].as_str() {
            if let Some(id) = message.get("id") {
                let result=match method{"workspace/configuration"=>json!(message["params"]["items"].as_array().unwrap_or(&vec![]).iter().map(|item|if item["section"]=="csharp"{json!({"solution":self.solution.as_ref().map(|p|display(p)),"applyFormattingOptions":false})}else{Value::Null}).collect::<Vec<_>>()),"workspace/workspaceFolders"=>json!([{"uri":file_uri(&self.root)?,"name":self.root.file_name().unwrap_or_default().to_string_lossy()}]),"workspace/applyEdit"=>json!({"applied":false,"failureReason":"GameCowork language inspection does not apply server edits"}),"client/registerCapability"|"client/unregisterCapability"|"window/workDoneProgress/create"|"window/showMessageRequest"=>Value::Null,_=>{self.send(json!({"jsonrpc":"2.0","id":id,"error":{"code":-32601,"message":"Unsupported local C# client operation"}})).await?;return Ok(());}};
                self.send(json!({"jsonrpc":"2.0","id":id,"result":result}))
                    .await?;
            } else if method == "$/progress" {
                let value = &message["params"]["value"];
                let token = &message["params"]["token"];
                if value["kind"] == "begin"
                    && value["title"]
                        .as_str()
                        .is_some_and(|s| s.starts_with("Loading workspace"))
                {
                    *self.loading.lock().unwrap() = Some(token.clone());
                }
                if value["kind"] == "end" && self.loading.lock().unwrap().as_ref() == Some(token) {
                    self.ready.store(true, Ordering::Release);
                    self.ready_changed.notify_waiters();
                }
            } else if method == "window/logMessage" && message["params"]["type"] == 1 {
                *self.failure.lock().unwrap() = Some(LspError::new(
                    "lsp_project_load_failed",
                    message["params"]["message"]
                        .as_str()
                        .unwrap_or("C# workspace load failed"),
                ));
            }
            return Ok(());
        }
        if let Some(id) = message["id"].as_u64() {
            if let Some(sender) = self.pending.lock().unwrap().remove(&id) {
                let result = if let Some(error) = message.get("error") {
                    Err(LspError::new(
                        "lsp_server_error",
                        error["message"]
                            .as_str()
                            .unwrap_or("C# server rejected the language request"),
                    ))
                } else if let Some(result) = message.get("result") {
                    Ok(result.clone())
                } else {
                    Err(LspError::new(
                        "lsp_protocol_error",
                        "C# response had neither result nor error",
                    ))
                };
                let _ = sender.send(result);
            }
        }
        Ok(())
    }
    async fn shutdown(&self) -> Value {
        let _stopping = self.stop.lock().await;
        if self.child.lock().await.is_none() {
            return json!({"pid":self.pid,"stopped":true,"alreadyStopped":true});
        }
        let mut forced = false;
        if self.alive.load(Ordering::Acquire) && self.ready.load(Ordering::Acquire) {
            if self
                .request("shutdown", Value::Null, Duration::from_secs(3))
                .await
                .is_err()
            {
                forced = true;
            } else {
                let _ = self.send(json!({"jsonrpc":"2.0","method":"exit"})).await;
            }
        } else {
            forced = true;
        }
        let mut child = self.child.lock().await.take().unwrap();
        let status = if !forced {
            match tokio::time::timeout(Duration::from_secs(3), child.wait()).await {
                Ok(Ok(status)) => Some(status),
                _ => {
                    forced = true;
                    self.lifetime.lock().unwrap().take();
                    let _ = child.start_kill();
                    tokio::time::timeout(Duration::from_secs(3), child.wait())
                        .await
                        .ok()
                        .and_then(|s| s.ok())
                }
            }
        } else {
            self.lifetime.lock().unwrap().take();
            let _ = child.start_kill();
            tokio::time::timeout(Duration::from_secs(3), child.wait())
                .await
                .ok()
                .and_then(|s| s.ok())
        };
        self.lifetime.lock().unwrap().take();
        let _ = self.stopped.send(true);
        self.fail(LspError::new(
            "lsp_process_stopped",
            "C# language server was closed",
        ));
        json!({"pid":self.pid,"stopped":true,"forced":forced,"exitCode":status.and_then(|s|s.code())})
    }
}

struct FramedReader<R> {
    reader: R,
    buffer: Vec<u8>,
}
impl<R: AsyncRead + Unpin> FramedReader<R> {
    fn new(reader: R) -> Self {
        Self {
            reader,
            buffer: vec![],
        }
    }
    async fn next(&mut self) -> Result<Option<Value>> {
        loop {
            if let Some(split) = self.buffer.windows(4).position(|s| s == b"\r\n\r\n") {
                if split > MAX_HEADER {
                    return Err(LspError::new(
                        "lsp_protocol_limit",
                        "C# header exceeded 16 KiB",
                    ));
                }
                let header = std::str::from_utf8(&self.buffer[..split]).map_err(io)?;
                let mut length = None;
                for line in header.split("\r\n") {
                    let (name, value) = line.split_once(':').ok_or_else(|| {
                        LspError::new("lsp_protocol_error", "Malformed C# frame header")
                    })?;
                    if name.eq_ignore_ascii_case("Content-Length") {
                        if length.is_some() {
                            return Err(LspError::new(
                                "lsp_protocol_error",
                                "Duplicate Content-Length",
                            ));
                        }
                        length = Some(value.trim().parse::<usize>().map_err(io)?);
                    }
                    if name.eq_ignore_ascii_case("Content-Type")
                        && value.contains("charset=")
                        && !value.contains("charset=utf-8")
                        && !value.contains("charset=utf8")
                    {
                        return Err(LspError::new(
                            "lsp_protocol_error",
                            "Unsupported C# frame encoding",
                        ));
                    }
                }
                let length = length
                    .ok_or_else(|| LspError::new("lsp_protocol_error", "Missing Content-Length"))?;
                if length > MAX_FRAME {
                    return Err(LspError::new(
                        "lsp_protocol_limit",
                        "C# JSON-RPC frame exceeded 4 MiB",
                    ));
                }
                if self.buffer.len() >= split + 4 + length {
                    let message =
                        serde_json::from_slice(&self.buffer[split + 4..split + 4 + length])
                            .map_err(io)?;
                    self.buffer.drain(..split + 4 + length);
                    return Ok(Some(message));
                }
            } else if self.buffer.len() > MAX_HEADER {
                return Err(LspError::new(
                    "lsp_protocol_limit",
                    "C# header exceeded 16 KiB",
                ));
            }
            let mut bytes = [0u8; 8192];
            let count = self.reader.read(&mut bytes).await.map_err(io)?;
            if count == 0 {
                return if self.buffer.is_empty() {
                    Ok(None)
                } else {
                    Err(LspError::new(
                        "lsp_protocol_error",
                        "C# server closed during a partial frame",
                    ))
                };
            }
            self.buffer.extend_from_slice(&bytes[..count]);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn missing_runtime_status_is_unavailable_without_fabricating_a_connection() {
        let config = Config {
            executable: PathBuf::from("F:/gamecowork-uncreated-lsp-runtime/runtime/csharp-ls.exe"),
            ledger: PathBuf::from("F:/gamecowork-uncreated-lsp-runtime/dependency-ledger.json"),
            ledger_sha256: "0".repeat(64),
            app_data_root: PathBuf::from("F:/gamecowork-uncreated-lsp-runtime/data"),
        };
        let error = config.verify().unwrap_err();
        assert_eq!(error.code, "lsp_runtime_missing");
        let state = unavailable_status(&error);
        for field in [
            "enabled",
            "supported",
            "connected",
            "ready",
            "runtimeAvailable",
        ] {
            assert_eq!(state[field], false);
        }
        assert!(state["pid"].is_null());
        assert_eq!(state["phase"], "unavailable");
        assert_eq!(state["failure"]["code"], "lsp_runtime_missing");
    }
    #[cfg(windows)]
    #[test]
    fn escaped_windows_paths_fail_lexically_before_filesystem_access() {
        // No directory or network endpoint is created or contacted by this test.
        let root = Path::new(r"F:\gamecowork-lsp-uncreated-fixture\root");
        for input in [
            r"\\127.0.0.1\unrequested-share\a.cs",
            r"\\?\F:\outside\a.cs",
            r"\\.\PIPE\unrequested-pipe",
            r"F:drive-relative.cs",
            r"\unrequested-root\a.cs",
            r"F:\unrequested-outside\a.cs",
            r"..\escape.cs",
            "file:///%5C%5C127.0.0.1%5Cunrequested-share%5Ca.cs",
        ] {
            assert_eq!(
                source_path(root, input, false).unwrap_err().code,
                "lsp_path_denied",
                "{input}"
            );
        }
    }
    #[test]
    fn utf16_positions_reject_split_surrogates_and_out_of_range() {
        let text = "// 😀 中文\r\nNext\n";
        assert!(validate_position(
            text,
            Position {
                line: 0,
                character: 3
            }
        )
        .is_ok());
        assert!(validate_position(
            text,
            Position {
                line: 0,
                character: 4
            }
        )
        .is_err());
        assert!(validate_position(
            text,
            Position {
                line: 0,
                character: 5
            }
        )
        .is_ok());
        assert!(validate_position(
            text,
            Position {
                line: 1,
                character: 5
            }
        )
        .is_err());
        assert!(validate_position(
            text,
            Position {
                line: 3,
                character: 0
            }
        )
        .is_err());
    }
    #[tokio::test]
    async fn framing_handles_fragmented_coalesced_utf8_and_rejects_limits() {
        let one = json!({"jsonrpc":"2.0","id":1,"result":"中文 😀"});
        let bytes = serde_json::to_vec(&one).unwrap();
        let mut packet = format!("Content-Length: {}\r\n\r\n", bytes.len()).into_bytes();
        packet.extend_from_slice(&bytes);
        let mut two = packet.clone();
        two.extend_from_slice(&packet);
        let (mut writer, reader) = tokio::io::duplex(32);
        tokio::spawn(async move {
            for chunk in two.chunks(7) {
                writer.write_all(chunk).await.unwrap();
            }
        });
        let mut reader = FramedReader::new(reader);
        assert_eq!(reader.next().await.unwrap().unwrap(), one);
        assert_eq!(reader.next().await.unwrap().unwrap(), one);
        assert!(reader.next().await.unwrap().is_none());
        for header in [
            b"Content-Length: 99999999\r\n\r\n".as_slice(),
            b"Content-Length: 2\r\nContent-Length: 2\r\n\r\n{}".as_slice(),
            b"Content-Length: 20\r\n\r\n{}".as_slice(),
        ] {
            assert!(FramedReader::new(header).next().await.is_err());
        }
    }
}
