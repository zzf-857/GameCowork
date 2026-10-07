//! Local workspace state owned by GameCowork. Removing a record never deletes a project.
//! The caller serializes access and coordinates core init/shutdown separately.

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    fs::{self, OpenOptions},
    io::{Read, Write},
    path::{Path, PathBuf},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use uuid::Uuid;

const FORMAT_VERSION: u32 = 1;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Workspace {
    pub workspace_key: String,
    pub workspace_dir: String,
    pub is_home_workspace: bool,
    pub is_cli_workspace: bool,
    pub is_unity_project: bool,
    pub is_remote: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub engine_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub editor_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unity_version: Option<String>,
}

#[derive(Clone, Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub local_project_id: String,
    pub workspace_key: String,
    pub title: String,
    pub path: String,
    pub version: String,
    pub editor_version: String,
    pub semver: String,
    pub architecture: String,
    pub is_favorite: bool,
    pub is_remote: bool,
    pub is_unity_project: bool,
    pub product: String,
    pub engine_type: Option<String>,
    pub last_modified: String,
    pub last_modified_display: String,
    pub last_modified_unix_ms: Option<u64>,
    pub recency_scope: String,
    pub recency_scanned_entries: usize,
    pub scan_incomplete: bool,
    pub recency_warning: Option<String>,
    pub path_exists: bool,
    pub lock_file_present: bool,
    pub metadata_warning: Option<String>,
}

#[derive(Clone, Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct RecentProject {
    pub path: String,
    pub project_type: String,
    pub location: String,
    pub workspace_key: String,
    pub engine_type: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Record {
    workspace: Workspace,
    opened: bool,
    is_favorite: bool,
    last_opened_at: u64,
    last_modified: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DiskState {
    version: u32,
    active_workspace_key: Option<String>,
    records: Vec<Record>,
    #[serde(default)]
    hidden_paths: Vec<String>,
}

impl Default for DiskState {
    fn default() -> Self {
        Self {
            version: FORMAT_VERSION,
            active_workspace_key: None,
            records: Vec::new(),
            hidden_paths: Vec::new(),
        }
    }
}

#[derive(Clone)]
pub struct Store {
    file: PathBuf,
    state: DiskState,
}

impl Store {
    /// Useful when the caller must roll back a registry change after a core lifecycle failure.
    pub fn save(&self) -> Result<(), String> {
        write_atomic(&self.file, &self.state)
    }

    pub fn restore(&mut self, previous: &Self) -> Result<(), String> {
        if self.file != previous.file {
            return Err("workspace_state_restore_path_mismatch".to_string());
        }
        previous.save()?;
        self.state = previous.state.clone();
        Ok(())
    }

    /// A valid legacy path is migrated once; the legacy file is never changed.
    /// An unavailable legacy project is ignored, so a disconnected drive cannot block startup.
    pub fn load(file: PathBuf, legacy: Option<PathBuf>) -> Result<Self, String> {
        let state = match fs::read(&file) {
            Ok(bytes) => {
                let state: DiskState = serde_json::from_slice(&bytes)
                    .map_err(|e| format!("workspace_state_invalid: {e}"))?;
                validate_state(&state)?;
                state
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => DiskState::default(),
            Err(e) => return Err(format!("workspace_state_read_failed: {e}")),
        };
        let mut store = Self { file, state };
        if !store.file.exists() {
            if let Some(legacy) = legacy {
                match fs::read_to_string(&legacy) {
                    Ok(path) if !path.trim().is_empty() => {
                        if inspect(path.trim()).is_ok() {
                            store.open(path.trim())?;
                        }
                    }
                    Ok(_) => {}
                    Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
                    Err(e) => return Err(format!("legacy_workspace_read_failed: {e}")),
                }
            }
        }
        Ok(store)
    }

    pub fn open(&mut self, path: &str) -> Result<Workspace, String> {
        let inspected = inspect(path)?;
        let workspace = inspected.workspace.clone();
        self.change(|state| {
            upsert(state, inspected, true);
            state.active_workspace_key = Some(workspace.workspace_key.clone());
            Ok(())
        })?;
        Ok(workspace)
    }

    /// Registers a directory without opening it or touching its contents or Hub configuration.
    pub fn add_project(&mut self, path: &str) -> Result<Project, String> {
        let inspected = inspect(path)?;
        let key = inspected.workspace.workspace_key.clone();
        self.change(|state| {
            upsert(state, inspected, false);
            Ok(())
        })?;
        Ok(project(self.find(&key).expect("record just added")))
    }

    pub fn close(&mut self, key_or_path: &str) -> Result<(), String> {
        let key = self.resolve_key(key_or_path)?;
        self.change(|state| {
            let record = state
                .records
                .iter_mut()
                .find(|r| r.workspace.workspace_key == key)
                .ok_or_else(|| "workspace_not_found".to_string())?;
            record.opened = false;
            if state.active_workspace_key.as_deref() == Some(&key) {
                state.active_workspace_key = fallback_active(state);
            }
            Ok(())
        })
    }

    pub fn set_active(&mut self, key_or_path: &str) -> Result<(), String> {
        let key = self.resolve_key(key_or_path)?;
        self.change(|state| {
            let opened_at = next_opened_at(state);
            let record = state
                .records
                .iter_mut()
                .find(|r| r.workspace.workspace_key == key)
                .ok_or_else(|| "workspace_not_found".to_string())?;
            if !record.opened {
                return Err("workspace_not_open".to_string());
            }
            record.last_opened_at = opened_at;
            state.active_workspace_key = Some(key);
            Ok(())
        })
    }

    pub fn remove(&mut self, key_or_path: &str) -> Result<(), String> {
        // Hub-only and stale Hub paths can be hidden without reading or modifying Hub state.
        let record = self.find(key_or_path);
        let key = record.map(|r| r.workspace.workspace_key.clone());
        let path = record
            .map(|r| r.workspace.workspace_dir.as_str())
            .unwrap_or(key_or_path);
        if !Path::new(path).is_absolute() {
            return Err("path_must_be_absolute".to_string());
        }
        let hidden = canonical_identity(path);
        self.change(|state| {
            if let Some(key) = &key {
                state.records.retain(|r| &r.workspace.workspace_key != key);
            }
            if !state.hidden_paths.contains(&hidden) {
                state.hidden_paths.push(hidden);
            }
            if state.active_workspace_key.as_deref() == key.as_deref() {
                state.active_workspace_key = fallback_active(state);
            }
            Ok(())
        })
    }

    pub fn favorite(&mut self, key_or_path: &str, favorite: bool) -> Result<Project, String> {
        let key = self.resolve_key(key_or_path)?;
        self.change(|state| {
            let record = state
                .records
                .iter_mut()
                .find(|r| r.workspace.workspace_key == key)
                .ok_or_else(|| "workspace_not_found".to_string())?;
            record.is_favorite = favorite;
            Ok(())
        })?;
        Ok(project(self.find(&key).expect("existing record")))
    }

    /// Change our stored preference even when an existing project is offline.
    /// A newly discovered Hub project is inspected and registered in the same
    /// transaction as its preference, so a failed write cannot half-register it.
    pub fn set_favorite(&mut self, path: &str, favorite: bool) -> Result<Project, String> {
        if self.find(path).is_some() {
            return self.favorite(path, favorite);
        }
        let inspected = inspect(path)?;
        let key = inspected.workspace.workspace_key.clone();
        self.change(|state| {
            upsert(state, inspected, false);
            let record = state
                .records
                .iter_mut()
                .find(|record| record.workspace.workspace_key == key)
                .ok_or("workspace_not_found")?;
            record.is_favorite = favorite;
            Ok(())
        })?;
        Ok(project(self.find(&key).expect("record just registered")))
    }

    pub fn lookup(&self, key_or_path: &str) -> Option<Workspace> {
        self.find(key_or_path).map(|r| r.workspace.clone())
    }

    pub fn is_hidden(&self, path: &str) -> bool {
        self.state.hidden_paths.contains(&canonical_identity(path))
    }

    pub fn active(&self) -> Option<Workspace> {
        self.state
            .active_workspace_key
            .as_deref()
            .and_then(|key| self.lookup(key))
    }

    pub fn opened(&self) -> Vec<Workspace> {
        self.state
            .records
            .iter()
            .filter(|r| r.opened)
            .map(|r| r.workspace.clone())
            .collect()
    }

    pub fn snapshot(&self) -> Value {
        json!({"workspaces": self.opened(), "activeWorkspaceKey": self.state.active_workspace_key})
    }

    pub fn projects(&self) -> Vec<Project> {
        self.state.records.iter().map(project).collect()
    }

    pub fn recent(&self) -> Vec<RecentProject> {
        let mut records: Vec<_> = self
            .state
            .records
            .iter()
            .filter(|r| r.last_opened_at > 0)
            .collect();
        records.sort_by(|a, b| {
            b.last_opened_at
                .cmp(&a.last_opened_at)
                .then_with(|| a.workspace.workspace_key.cmp(&b.workspace.workspace_key))
        });
        records
            .into_iter()
            .map(|record| RecentProject {
                path: record.workspace.workspace_dir.clone(),
                project_type: "app".to_string(),
                location: "local".to_string(),
                workspace_key: record.workspace.workspace_key.clone(),
                engine_type: record.workspace.engine_type.clone(),
            })
            .collect()
    }

    pub fn reorder(&mut self, keys: &[String]) -> Result<(), String> {
        let opened = self.opened();
        let unique: std::collections::HashSet<_> = keys.iter().collect();
        if keys.len() != opened.len()
            || unique.len() != keys.len()
            || opened.iter().any(|w| !unique.contains(&w.workspace_key))
        {
            return Err("invalid_workspace_order".to_string());
        }
        self.change(|state| {
            state.records.sort_by_key(|record| {
                keys.iter()
                    .position(|key| key == &record.workspace.workspace_key)
                    .unwrap_or(usize::MAX)
            });
            Ok(())
        })
    }

    fn find(&self, key_or_path: &str) -> Option<&Record> {
        let identity = canonical_identity(key_or_path);
        self.state.records.iter().find(|r| {
            r.workspace.workspace_key == key_or_path
                || path_identity(&r.workspace.workspace_dir) == identity
        })
    }

    fn resolve_key(&self, key_or_path: &str) -> Result<String, String> {
        self.find(key_or_path)
            .map(|r| r.workspace.workspace_key.clone())
            .ok_or_else(|| "workspace_not_found".to_string())
    }

    fn change(
        &mut self,
        mutate: impl FnOnce(&mut DiskState) -> Result<(), String>,
    ) -> Result<(), String> {
        let mut candidate = self.state.clone();
        mutate(&mut candidate)?;
        validate_state(&candidate)?;
        write_atomic(&self.file, &candidate)?;
        self.state = candidate;
        Ok(())
    }
}

struct Inspected {
    workspace: Workspace,
    last_modified: String,
    recency: Recency,
}

struct Recency {
    modified: SystemTime,
    scanned: usize,
    incomplete: bool,
    warning: Option<String>,
}

const RECENCY_SCOPE: &str = "assets-packages-project-settings-file-metadata";
const RECENCY_MAX_ENTRIES: usize = 100_000;
const RECENCY_BUDGET: Duration = Duration::from_millis(150);
const RECENCY_MAX_DEPTH: usize = 64;

fn linked_metadata(metadata: &fs::Metadata) -> bool {
    if metadata.file_type().is_symlink() {
        return true;
    }
    #[cfg(windows)]
    {
        use std::os::windows::fs::MetadataExt;
        if metadata.file_attributes() & 0x400 != 0 {
            return true;
        }
    }
    false
}

fn shared_file(path: &Path, metadata: &fs::Metadata) -> std::io::Result<bool> {
    #[cfg(windows)]
    {
        use std::os::windows::{fs::OpenOptionsExt, io::AsRawHandle};
        use windows_sys::Win32::Storage::FileSystem::{
            GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION, FILE_FLAG_OPEN_REPARSE_POINT,
        };
        let file = fs::OpenOptions::new()
            .read(true)
            .custom_flags(FILE_FLAG_OPEN_REPARSE_POINT)
            .open(path)?;
        let mut info = std::mem::MaybeUninit::<BY_HANDLE_FILE_INFORMATION>::uninit();
        if unsafe { GetFileInformationByHandle(file.as_raw_handle(), info.as_mut_ptr()) } == 0 {
            return Err(std::io::Error::last_os_error());
        }
        let info = unsafe { info.assume_init() };
        let _ = metadata;
        return Ok(info.nNumberOfLinks > 1 || info.dwFileAttributes & 0x400 != 0);
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::MetadataExt;
        let _ = path;
        return Ok(metadata.nlink() > 1);
    }
    #[cfg(not(any(windows, unix)))]
    {
        let _ = (path, metadata);
        Err(std::io::Error::new(
            std::io::ErrorKind::Unsupported,
            "File link metadata is unavailable",
        ))
    }
}

// Only ordinary content-file metadata is scanned. Library, Temp, Logs, generated
// build folders and user caches are excluded by the three explicit roots. This
// is a bounded observed snapshot, not an atomic filesystem point-in-time view.
fn content_recency(
    root: &Path,
    baseline: SystemTime,
    max_entries: usize,
    budget: Duration,
) -> Recency {
    let mut result = Recency {
        modified: baseline,
        scanned: 0,
        incomplete: false,
        warning: None,
    };
    let start = Instant::now();
    let mut pending: Vec<_> = ["Assets", "Packages", "ProjectSettings"]
        .into_iter()
        .map(|name| (root.join(name), 0usize))
        .collect();
    let mut linked = 0usize;
    let mut failed = 0usize;
    let mut bounded = false;
    while let Some((path, depth)) = pending.pop() {
        if result.scanned >= max_entries || start.elapsed() >= budget {
            bounded = true;
            break;
        }
        result.scanned += 1;
        let metadata = match fs::symlink_metadata(&path) {
            Ok(metadata) => metadata,
            Err(error) if depth == 0 && error.kind() == std::io::ErrorKind::NotFound => continue,
            Err(_) => {
                failed += 1;
                continue;
            }
        };
        if linked_metadata(&metadata) {
            linked += 1;
            continue;
        }
        if metadata.is_file() {
            match shared_file(&path, &metadata) {
                Ok(true) => {
                    linked += 1;
                    continue;
                }
                Err(_) => {
                    failed += 1;
                    continue;
                }
                Ok(false) => {}
            }
            match metadata.modified() {
                Ok(modified) => result.modified = result.modified.max(modified),
                Err(_) => failed += 1,
            }
        } else if metadata.is_dir() {
            if depth >= RECENCY_MAX_DEPTH {
                bounded = true;
                continue;
            }
            match fs::read_dir(&path) {
                Ok(entries) => {
                    for entry in entries {
                        if result.scanned + pending.len() >= max_entries
                            || start.elapsed() >= budget
                        {
                            bounded = true;
                            break;
                        }
                        match entry {
                            Ok(entry) => pending.push((entry.path(), depth + 1)),
                            Err(_) => failed += 1,
                        }
                    }
                }
                Err(_) => failed += 1,
            }
        } else {
            failed += 1;
        }
    }
    result.incomplete = bounded || linked > 0 || failed > 0;
    if result.incomplete {
        result.warning = Some(format!("project_recency_scan_incomplete: observed ordinary file metadata only; budget/depth limited={bounded}, skipped linked paths={linked}, unreadable entries={failed}"));
    }
    result
}

fn read_project_version(path: &Path) -> std::io::Result<String> {
    let mut text = String::new();
    fs::File::open(path)?
        .take(1024 * 1024 + 1)
        .read_to_string(&mut text)?;
    if text.len() > 1024 * 1024 {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            "ProjectVersion.txt exceeds 1 MiB",
        ));
    }
    Ok(text)
}

fn inspect(path: &str) -> Result<Inspected, String> {
    if path.trim().is_empty() {
        return Err("path_required".to_string());
    }
    let input = PathBuf::from(path);
    if !input.is_absolute() {
        return Err("path_must_be_absolute".to_string());
    }
    let canonical = fs::canonicalize(&input).map_err(|e| {
        if e.kind() == std::io::ErrorKind::NotFound {
            format!("path_not_found:{path}")
        } else {
            format!("path_unavailable: {e}")
        }
    })?;
    let metadata = fs::metadata(&canonical).map_err(|e| format!("path_unavailable: {e}"))?;
    if !metadata.is_dir() {
        return Err("path_not_directory".to_string());
    }
    let dir = display_path(&canonical)?;
    let key = format!("local:{}", encode_component(&path_identity(&dir)));
    let version_file = canonical.join("ProjectSettings").join("ProjectVersion.txt");
    // Do not read a version file reached through an internal directory/file
    // link. The explicitly selected project root has already been canonicalized.
    for candidate in [canonical.join("ProjectSettings"), version_file.clone()] {
        match fs::symlink_metadata(&candidate) {
            Ok(metadata) if linked_metadata(&metadata) => {
                return Err(
                    "project_version_linked_path: internal linked project metadata is unsupported"
                        .into(),
                )
            }
            Ok(metadata) if metadata.is_file() => {
                if shared_file(&candidate, &metadata)
                    .map_err(|error| format!("project_version_identity_unavailable: {error}"))?
                {
                    return Err(
                        "project_version_linked_path: hard-linked project metadata is unsupported"
                            .into(),
                    );
                }
            }
            Ok(_) => {}
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
            Err(error) => return Err(format!("project_version_identity_unavailable: {error}")),
        }
    }
    let (engine_type, editor_version, unity_version) = match read_project_version(&version_file) {
        Ok(text) => {
            let value = |name: &str| {
                text.lines().find_map(|line| {
                    let (field, value) = line.trim().split_once(':')?;
                    (field == name && !value.trim().is_empty()).then(|| value.trim().to_string())
                })
            };
            let unity = value("m_EditorVersion");
            let tuanjie = value("m_TuanjieEditorVersion");
            if let Some(version) = tuanjie {
                (Some("tuanjie".to_string()), Some(version), unity)
            } else if let Some(version) = unity {
                (
                    Some("unity".to_string()),
                    Some(version.clone()),
                    Some(version),
                )
            } else {
                (None, None, None)
            }
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => (None, None, None),
        Err(e) => return Err(format!("project_version_read_failed: {e}")),
    };
    let parts: Vec<_> = dir.split('/').filter(|part| !part.is_empty()).collect();
    let is_home_workspace = parts.len() >= 2
        && parts[parts.len() - 1].eq_ignore_ascii_case("default")
        && parts[parts.len() - 2].eq_ignore_ascii_case(".gamecowork");
    let baseline = fs::metadata(&version_file)
        .and_then(|value| value.modified())
        .unwrap_or(UNIX_EPOCH)
        .max(metadata.modified().unwrap_or(UNIX_EPOCH));
    let recency = content_recency(&canonical, baseline, RECENCY_MAX_ENTRIES, RECENCY_BUDGET);
    Ok(Inspected {
        workspace: Workspace {
            workspace_key: key,
            workspace_dir: dir,
            is_home_workspace,
            is_cli_workspace: false,
            is_unity_project: engine_type.is_some(),
            is_remote: false,
            engine_type,
            editor_version,
            unity_version,
        },
        last_modified: timestamp_precise(recency.modified),
        recency,
    })
}

fn display_path(path: &Path) -> Result<String, String> {
    let text = path.to_str().ok_or_else(|| "path_not_utf8".to_string())?;
    let text = if let Some(unc) = text.strip_prefix(r"\\?\UNC\") {
        format!(r"\\{unc}")
    } else {
        text.strip_prefix(r"\\?\").unwrap_or(text).to_string()
    };
    Ok(text.replace('\\', "/"))
}

fn path_identity(path: &str) -> String {
    let normalized = path.replace('\\', "/");
    let normalized = normalized.trim_end_matches('/');
    #[cfg(windows)]
    {
        normalized.to_lowercase()
    }
    #[cfg(not(windows))]
    {
        normalized.to_string()
    }
}

fn canonical_identity(path: &str) -> String {
    let canonical = fs::canonicalize(path)
        .ok()
        .and_then(|path| display_path(&path).ok());
    path_identity(canonical.as_deref().unwrap_or(path))
}

fn encode_component(value: &str) -> String {
    let mut encoded = String::new();
    for byte in value.bytes() {
        if byte.is_ascii_alphanumeric() || b"-_.!~*'()".contains(&byte) {
            encoded.push(byte as char);
        } else {
            encoded.push_str(&format!("%{byte:02X}"));
        }
    }
    encoded
}

fn upsert(state: &mut DiskState, inspected: Inspected, open: bool) {
    let identity = path_identity(&inspected.workspace.workspace_dir);
    state.hidden_paths.retain(|hidden| hidden != &identity);
    let opened_at = if open { next_opened_at(state) } else { 0 };
    if let Some(record) = state
        .records
        .iter_mut()
        .find(|r| r.workspace.workspace_key == inspected.workspace.workspace_key)
    {
        record.workspace = inspected.workspace;
        record.last_modified = inspected.last_modified;
        if open {
            record.opened = true;
            record.last_opened_at = opened_at;
        }
    } else {
        state.records.push(Record {
            workspace: inspected.workspace,
            opened: open,
            is_favorite: false,
            last_opened_at: opened_at,
            last_modified: inspected.last_modified,
        });
    }
}

fn project(record: &Record) -> Project {
    // Like Hub's ProjectVersion/settings refresh, inspect only public project
    // metadata when listing. Do not rewrite registrations or an open Core root.
    let inspected = inspect(&record.workspace.workspace_dir);
    let w = inspected
        .as_ref()
        .map(|value| &value.workspace)
        .unwrap_or(&record.workspace);
    let version = w
        .unity_version
        .as_ref()
        .or(w.editor_version.as_ref())
        .cloned()
        .unwrap_or_default();
    Project {
        local_project_id: w.workspace_key.clone(),
        workspace_key: w.workspace_key.clone(),
        title: w
            .workspace_dir
            .rsplit('/')
            .find(|p| !p.is_empty())
            .unwrap_or(&w.workspace_dir)
            .to_string(),
        path: w.workspace_dir.clone(),
        version: version.clone(),
        editor_version: version.clone(),
        semver: w.editor_version.clone().unwrap_or(version),
        architecture: "x86_64".to_string(),
        is_favorite: record.is_favorite,
        is_remote: false,
        is_unity_project: w.is_unity_project,
        product: w.engine_type.clone().unwrap_or_else(|| "app".to_string()),
        engine_type: w.engine_type.clone(),
        last_modified: inspected
            .as_ref()
            .map(|v| v.last_modified.clone())
            .unwrap_or_else(|_| record.last_modified.clone()),
        last_modified_display: inspected
            .as_ref()
            .map(|v| v.last_modified.clone())
            .unwrap_or_else(|_| record.last_modified.clone()),
        last_modified_unix_ms: inspected
            .as_ref()
            .ok()
            .map(|value| system_time_ms(value.recency.modified)),
        recency_scope: RECENCY_SCOPE.into(),
        recency_scanned_entries: inspected
            .as_ref()
            .ok()
            .map(|value| value.recency.scanned)
            .unwrap_or(0),
        scan_incomplete: inspected
            .as_ref()
            .map(|value| value.recency.incomplete)
            .unwrap_or(true),
        recency_warning: inspected
            .as_ref()
            .ok()
            .and_then(|value| value.recency.warning.clone()),
        path_exists: Path::new(&w.workspace_dir).is_dir(),
        // A leftover lock is evidence of a file, not proof of a live Editor.
        lock_file_present: Path::new(&w.workspace_dir)
            .join("Temp/UnityLockfile")
            .is_file(),
        metadata_warning: match inspected {
            Ok(value) => value.recency.warning,
            Err(error) => Some(error),
        },
    }
}

pub fn refresh_project_metadata(row: &mut Value) {
    let Some(path) = row["path"].as_str().map(str::to_owned) else {
        return;
    };
    row["pathExists"] = json!(Path::new(&path).is_dir());
    row["lockFilePresent"] = json!(Path::new(&path).join("Temp/UnityLockfile").is_file());
    match inspect(&path) {
        Ok(value) => {
            let w = value.workspace;
            if let Some(version) = w.unity_version.as_ref().or(w.editor_version.as_ref()) {
                row["version"] = json!(version);
                row["editorVersion"] = json!(version);
                row["semver"] = json!(w.editor_version.as_ref().unwrap_or(version));
            }
            if let Some(engine) = w.engine_type {
                row["product"] = json!(engine);
                row["engineType"] = row["product"].clone();
            }
            row["lastModified"] = json!(value.last_modified);
            row["lastModifiedUnixMs"] = json!(system_time_ms(value.recency.modified));
            row["recencyScope"] = json!(RECENCY_SCOPE);
            row["recencyScannedEntries"] = json!(value.recency.scanned);
            row["scanIncomplete"] = json!(value.recency.incomplete);
            row["recencyWarning"] = json!(value.recency.warning);
            row["metadataWarning"] = row["recencyWarning"].clone();
        }
        Err(error) => {
            row["metadataWarning"] = json!(error);
            row["lastModifiedUnixMs"] = Value::Null;
            row["scanIncomplete"] = json!(true);
            row["recencyScope"] = json!(RECENCY_SCOPE);
        }
    }
}

fn fallback_active(state: &DiskState) -> Option<String> {
    state
        .records
        .iter()
        .filter(|r| r.opened)
        .max_by_key(|r| r.last_opened_at)
        .map(|r| r.workspace.workspace_key.clone())
}

fn next_opened_at(state: &DiskState) -> u64 {
    now_ms().max(
        state
            .records
            .iter()
            .map(|r| r.last_opened_at)
            .max()
            .unwrap_or(0)
            .saturating_add(1),
    )
}

fn validate_state(state: &DiskState) -> Result<(), String> {
    if state.version != FORMAT_VERSION {
        return Err("workspace_state_version_unsupported".to_string());
    }
    let mut keys = std::collections::HashSet::new();
    for record in &state.records {
        let workspace = &record.workspace;
        let expected = format!(
            "local:{}",
            encode_component(&path_identity(&workspace.workspace_dir))
        );
        if !Path::new(&workspace.workspace_dir).is_absolute()
            || workspace.is_remote
            || workspace.workspace_key != expected
            || !keys.insert(&workspace.workspace_key)
        {
            return Err("workspace_state_invalid_record".to_string());
        }
    }
    let mut hidden = std::collections::HashSet::new();
    if state
        .hidden_paths
        .iter()
        .any(|path| !Path::new(path).is_absolute() || !hidden.insert(path))
    {
        return Err("workspace_state_invalid_hidden_path".to_string());
    }
    if let Some(active) = &state.active_workspace_key {
        if !state
            .records
            .iter()
            .any(|r| r.opened && &r.workspace.workspace_key == active)
        {
            return Err("workspace_state_invalid_active".to_string());
        }
    }
    Ok(())
}

fn write_atomic(file: &Path, state: &DiskState) -> Result<(), String> {
    write_json_atomic(file, state)
}

pub(crate) fn write_json_atomic<T: Serialize>(file: &Path, state: &T) -> Result<(), String> {
    let parent = file
        .parent()
        .ok_or_else(|| "workspace_state_parent_required".to_string())?;
    fs::create_dir_all(parent).map_err(|e| format!("workspace_state_write_failed: {e}"))?;
    let temp = parent.join(format!(".gamecowork-workspaces-{}.tmp", Uuid::new_v4()));
    let write = || -> Result<(), String> {
        let bytes = serde_json::to_vec_pretty(state)
            .map_err(|e| format!("workspace_state_encode_failed: {e}"))?;
        let mut output = OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&temp)
            .map_err(|e| format!("workspace_state_write_failed: {e}"))?;
        output
            .write_all(&bytes)
            .and_then(|_| output.sync_all())
            .map_err(|e| format!("workspace_state_write_failed: {e}"))?;
        drop(output);
        replace_file(&temp, file).map_err(|e| format!("workspace_state_replace_failed: {e}"))
    };
    let result = write();
    if result.is_err() {
        let _ = fs::remove_file(&temp);
    }
    result
}

#[cfg(windows)]
fn replace_file(from: &Path, to: &Path) -> std::io::Result<()> {
    use std::os::windows::ffi::OsStrExt;
    #[link(name = "kernel32")]
    extern "system" {
        fn MoveFileExW(from: *const u16, to: *const u16, flags: u32) -> i32;
    }
    let from: Vec<u16> = from.as_os_str().encode_wide().chain(Some(0)).collect();
    let to: Vec<u16> = to.as_os_str().encode_wide().chain(Some(0)).collect();
    // Same-directory replacement is atomic; WRITE_THROUGH waits for the move to finish.
    if unsafe { MoveFileExW(from.as_ptr(), to.as_ptr(), 0x1 | 0x8) } == 0 {
        Err(std::io::Error::last_os_error())
    } else {
        Ok(())
    }
}

#[cfg(not(windows))]
fn replace_file(from: &Path, to: &Path) -> std::io::Result<()> {
    fs::rename(from, to)
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
        .min(u64::MAX as u128) as u64
}

// UTC ISO-8601 strings match the project table's JavaScript Date parser.
fn timestamp(time: SystemTime) -> String {
    let seconds = time
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let days = (seconds / 86_400) as i64 + 719_468;
    let era = days / 146_097;
    let day_of_era = days - era * 146_097;
    let year_of_era =
        (day_of_era - day_of_era / 1460 + day_of_era / 36524 - day_of_era / 146096) / 365;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let month_part = (5 * day_of_year + 2) / 153;
    let day = day_of_year - (153 * month_part + 2) / 5 + 1;
    let month = month_part + if month_part < 10 { 3 } else { -9 };
    let year = year_of_era + era * 400 + if month <= 2 { 1 } else { 0 };
    let clock = seconds % 86_400;
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        clock / 3600,
        clock / 60 % 60,
        clock % 60
    )
}

fn system_time_ms(time: SystemTime) -> u64 {
    time.duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
        .min(u64::MAX as u128) as u64
}

fn timestamp_precise(time: SystemTime) -> String {
    let seconds = timestamp(time);
    format!(
        "{}.{:03}Z",
        seconds.trim_end_matches('Z'),
        system_time_ms(time) % 1000
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Fixture {
        root: PathBuf,
        base: PathBuf,
    }
    impl Fixture {
        fn new() -> Self {
            let base = PathBuf::from(
                r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
            );
            let root = base.join(format!("workspaces-{}", Uuid::new_v4()));
            fs::create_dir_all(&root).unwrap();
            Self { root, base }
        }
        fn folder(&self, name: &str) -> String {
            let folder = self.root.join(name);
            fs::create_dir_all(&folder).unwrap();
            folder.to_str().unwrap().to_string()
        }
        fn store(&self) -> Store {
            Store::load(self.root.join("state.json"), None).unwrap()
        }
    }
    impl Drop for Fixture {
        fn drop(&mut self) {
            // Resolve and verify every recursive-cleanup target stays in the dedicated fixture area.
            let root = fs::canonicalize(&self.root).unwrap();
            let base = fs::canonicalize(&self.base).unwrap();
            assert!(root.starts_with(&base) && root != base);
            assert!(self
                .root
                .file_name()
                .unwrap()
                .to_str()
                .unwrap()
                .starts_with("workspaces-"));
            fs::remove_dir_all(&root).unwrap();
        }
    }

    #[test]
    fn persists_two_workspaces_and_closes_without_deleting_projects() {
        let fixture = Fixture::new();
        let a = fixture.folder("A");
        let b = fixture.folder("B");
        let mut store = fixture.store();
        let wa = store.open(&a).unwrap();
        let wb = store.open(&b).unwrap();
        store.set_active(&wa.workspace_key).unwrap();
        assert_eq!(store.recent()[0].workspace_key, wa.workspace_key);
        let mut reloaded = fixture.store();
        assert_eq!(reloaded.active().unwrap().workspace_key, wa.workspace_key);
        assert_eq!(
            reloaded.snapshot()["workspaces"].as_array().unwrap().len(),
            2
        );
        reloaded.close(&wa.workspace_key).unwrap();
        assert_eq!(reloaded.active().unwrap().workspace_key, wb.workspace_key);
        assert_eq!(reloaded.recent().len(), 2);
        assert!(Path::new(&a).is_dir());
        reloaded.remove(&b).unwrap();
        assert!(Path::new(&b).is_dir());
        assert_eq!(reloaded.projects().len(), 1);
        assert!(reloaded.active().is_none());
    }

    #[test]
    fn detects_both_engines_and_keeps_registration_separate_from_opening() {
        let fixture = Fixture::new();
        let unity = fixture.folder("Unity工程");
        let tuanjie = fixture.folder("Tuanjie工程");
        for (path, text) in [
            (&unity, "m_EditorVersion: 2022.3.1f1\n"),
            (
                &tuanjie,
                "m_EditorVersion: 2022.3.2f1\nm_TuanjieEditorVersion: 1.6.1\n",
            ),
        ] {
            let settings = Path::new(path).join("ProjectSettings");
            fs::create_dir_all(&settings).unwrap();
            fs::write(settings.join("ProjectVersion.txt"), text).unwrap();
        }
        let mut store = fixture.store();
        let u = store.add_project(&unity).unwrap();
        let t = store.add_project(&tuanjie).unwrap();
        assert_eq!(
            (u.product.as_str(), u.version.as_str()),
            ("unity", "2022.3.1f1")
        );
        assert_eq!(
            (t.product.as_str(), t.version.as_str()),
            ("tuanjie", "2022.3.2f1")
        );
        assert_eq!(t.semver, "1.6.1");
        assert!(store.opened().is_empty() && store.recent().is_empty());
        assert!(store.favorite(&unity, true).unwrap().is_favorite);
        assert!(fixture
            .store()
            .projects()
            .iter()
            .any(|p| p.path == u.path && p.is_favorite));
        let opened = store.open(&tuanjie).unwrap();
        assert_eq!(opened.unity_version.as_deref(), Some("2022.3.2f1"));
        assert_eq!(store.recent()[0].location, "local");
        assert_eq!(store.recent()[0].project_type, "app");
    }

    #[test]
    fn project_favorites_remain_editable_when_registered_directory_or_metadata_is_unavailable() {
        let fixture = Fixture::new();
        let directory = fixture.folder("Offline favorite");
        let settings = Path::new(&directory).join("ProjectSettings");
        fs::create_dir_all(&settings).unwrap();
        let version = settings.join("ProjectVersion.txt");
        fs::write(&version, "m_EditorVersion: 6000.0.1f1\n").unwrap();
        let mut store = fixture.store();
        let registered = store.set_favorite(&directory, true).unwrap();
        assert!(registered.is_favorite);
        assert!(store.opened().is_empty());
        let moved = fixture.root.join("Detached own directory");
        fs::rename(&directory, &moved).unwrap();
        let offline = store.set_favorite(&directory, false).unwrap();
        assert!(!offline.is_favorite && !offline.path_exists);
        assert_eq!(offline.version, "6000.0.1f1");
        let mut reloaded = fixture.store();
        assert!(!reloaded.projects()[0].is_favorite);
        assert_eq!(
            reloaded.projects()[0].workspace_key,
            registered.workspace_key
        );
        fs::rename(&moved, &directory).unwrap();
        fs::write(&version, vec![b'x'; 1024 * 1024 + 1]).unwrap();
        let before = fs::read(&version).unwrap();
        let malformed = reloaded.set_favorite(&directory, true).unwrap();
        assert!(malformed.is_favorite && malformed.metadata_warning.is_some());
        assert_eq!(fs::read(&version).unwrap(), before);
        assert_eq!(reloaded.projects().len(), 1);
        assert!(fixture.store().projects()[0].is_favorite);
    }

    #[cfg(windows)]
    #[test]
    fn first_hub_favorite_has_no_partial_registration_on_write_failure() {
        let fixture = Fixture::new();
        let existing = fixture.folder("Existing");
        let hub = fixture.folder("Hub only");
        let mut store = fixture.store();
        store.add_project(&existing).unwrap();
        let original = fs::read(&store.file).unwrap();
        let mut permissions = fs::metadata(&store.file).unwrap().permissions();
        permissions.set_readonly(true);
        fs::set_permissions(&store.file, permissions).unwrap();
        let failure = store.set_favorite(&hub, true);
        let mut permissions = fs::metadata(&store.file).unwrap().permissions();
        permissions.set_readonly(false);
        fs::set_permissions(&store.file, permissions).unwrap();
        assert!(failure.is_err());
        assert!(store.lookup(&hub).is_none());
        assert_eq!(fs::read(&store.file).unwrap(), original);
        assert!(fixture.store().lookup(&hub).is_none());
        let added = store.set_favorite(&hub, true).unwrap();
        assert!(added.is_favorite);
        assert!(fixture
            .store()
            .projects()
            .iter()
            .any(|project| project.workspace_key == added.workspace_key && project.is_favorite));
    }

    #[test]
    fn project_list_refreshes_public_metadata_without_mutating_registration() {
        let fixture = Fixture::new();
        let directory = fixture.folder("Live project");
        let settings = Path::new(&directory).join("ProjectSettings");
        fs::create_dir_all(&settings).unwrap();
        let version_file = settings.join("ProjectVersion.txt");
        fs::write(&version_file, "m_EditorVersion: 6000.0.1f1\n").unwrap();
        let mut store = fixture.store();
        store.add_project(&directory).unwrap();
        store.favorite(&directory, true).unwrap();
        let before = fs::read(&store.file).unwrap();
        fs::write(
            &version_file,
            "m_EditorVersion: 2022.3.62t16\nm_TuanjieEditorVersion: 1.10.4\n",
        )
        .unwrap();
        let row = &store.projects()[0];
        assert_eq!(row.product, "tuanjie");
        assert_eq!(row.version, "2022.3.62t16");
        assert_eq!(row.semver, "1.10.4");
        assert!(row.is_favorite && row.path_exists && row.metadata_warning.is_none());
        let temp = Path::new(&directory).join("Temp");
        fs::create_dir_all(&temp).unwrap();
        fs::write(temp.join("UnityLockfile"), "leftover fixture lock").unwrap();
        assert!(store.projects()[0].lock_file_present);
        let moved = fixture.root.join("Moved project");
        fs::rename(&directory, &moved).unwrap();
        let row = &store.projects()[0];
        assert!(!row.path_exists && row.is_favorite);
        assert!(row
            .metadata_warning
            .as_ref()
            .unwrap()
            .starts_with("path_not_found:"));
        assert_eq!(fs::read(&store.file).unwrap(), before);
        fs::rename(&moved, &directory).unwrap();
        assert!(store.projects()[0].path_exists);
    }

    #[test]
    fn oversized_version_metadata_keeps_a_visible_record_with_a_warning() {
        let fixture = Fixture::new();
        let directory = fixture.folder("Bounded metadata");
        let mut store = fixture.store();
        store.add_project(&directory).unwrap();
        let settings = Path::new(&directory).join("ProjectSettings");
        fs::create_dir_all(&settings).unwrap();
        fs::write(
            settings.join("ProjectVersion.txt"),
            vec![b'x'; 1024 * 1024 + 1],
        )
        .unwrap();
        let row = &store.projects()[0];
        assert!(row.path_exists);
        assert!(row
            .metadata_warning
            .as_ref()
            .unwrap()
            .contains("exceeds 1 MiB"));
    }

    #[test]
    fn validates_paths_and_migrates_legacy_without_changing_it() {
        let fixture = Fixture::new();
        let a = fixture.folder("Legacy A");
        let legacy = fixture.root.join("workspace.txt");
        let text = format!("{a}\n");
        fs::write(&legacy, &text).unwrap();
        let state = fixture.root.join("migrated.json");
        let mut store = Store::load(state.clone(), Some(legacy.clone())).unwrap();
        assert_eq!(store.opened().len(), 1);
        assert_eq!(fs::read_to_string(&legacy).unwrap(), text);
        assert!(state.is_file());
        assert!(store.open("relative").is_err());
        assert!(store
            .open(fixture.root.join("missing").to_str().unwrap())
            .unwrap_err()
            .starts_with("path_not_found:"));
        assert_eq!(
            store.open(legacy.to_str().unwrap()).unwrap_err(),
            "path_not_directory"
        );
        fs::write(&legacy, fixture.folder("Different")).unwrap();
        assert_eq!(Store::load(state, Some(legacy)).unwrap().opened().len(), 1);
    }

    #[cfg(windows)]
    #[test]
    fn windows_case_slash_and_trailing_separator_deduplicate() {
        let fixture = Fixture::new();
        let path = fixture.folder("MixedCase 中文");
        let mut store = fixture.store();
        let original = store.open(&path).unwrap();
        let variant = format!("{}/", path.to_lowercase().replace('\\', "/"));
        let duplicate = store.open(&variant).unwrap();
        assert_eq!(duplicate.workspace_key, original.workspace_key);
        assert_eq!(store.projects().len(), 1);
        assert!(original.workspace_key.contains("%2F") && original.workspace_key.contains("%E4"));
    }

    #[test]
    fn write_failure_keeps_disk_and_memory_unchanged() {
        let fixture = Fixture::new();
        let a = fixture.folder("A");
        let b = fixture.folder("B");
        let mut store = fixture.store();
        store.open(&a).unwrap();
        let before = store.snapshot();
        let disk_before = fs::read(&store.file).unwrap();
        let real_file = store.file.clone();
        store.file = fixture.root.clone(); // An existing directory cannot be replaced by a state file.
        assert!(store.open(&b).is_err());
        assert_eq!(store.snapshot(), before);
        assert_eq!(fs::read(real_file).unwrap(), disk_before);
        assert!(!fs::read_dir(&fixture.root).unwrap().any(|entry| entry
            .unwrap()
            .file_name()
            .to_string_lossy()
            .ends_with(".tmp")));
    }

    #[test]
    fn malformed_state_is_reported_and_never_overwritten() {
        let fixture = Fixture::new();
        let file = fixture.root.join("state.json");
        fs::write(&file, b"broken").unwrap();
        assert!(Store::load(file.clone(), None).is_err());
        assert_eq!(fs::read(file).unwrap(), b"broken");
        assert_eq!(timestamp(UNIX_EPOCH), "1970-01-01T00:00:00Z");
        assert_eq!(
            timestamp(UNIX_EPOCH + std::time::Duration::from_secs(1_709_251_200)),
            "2024-03-01T00:00:00Z"
        );
    }

    #[test]
    fn registry_rollback_and_order_are_durable() {
        let fixture = Fixture::new();
        let a = fixture.folder("A");
        let b = fixture.folder("B");
        let mut store = fixture.store();
        let wa = store.open(&a).unwrap();
        let previous = store.clone();
        let wb = store.open(&b).unwrap();
        store
            .reorder(&[wb.workspace_key.clone(), wa.workspace_key.clone()])
            .unwrap();
        assert_eq!(fixture.store().opened()[0].workspace_key, wb.workspace_key);
        assert!(store
            .reorder(&[wa.workspace_key.clone(), wa.workspace_key.clone()])
            .is_err());
        store.restore(&previous).unwrap();
        assert_eq!(store.snapshot(), previous.snapshot());
        assert_eq!(fixture.store().snapshot(), previous.snapshot());
        assert!(Path::new(&b).is_dir());
    }

    #[test]
    fn hub_only_removal_is_local_durable_and_explicit_readding_restores_it() {
        let fixture = Fixture::new();
        let path = fixture.folder("Hub Project");
        let mut store = fixture.store();
        store.remove(&path).unwrap();
        assert!(store.is_hidden(&path));
        assert!(fixture.store().is_hidden(&path));
        assert!(Path::new(&path).is_dir());
        store.add_project(&path).unwrap();
        assert!(!store.is_hidden(&path));
        store.remove(&path).unwrap();
        store.open(&path).unwrap();
        assert!(!store.is_hidden(&path));
        assert_eq!(store.opened().len(), 1);
        let mut old_format: Value =
            serde_json::from_slice(&fs::read(&store.file).unwrap()).unwrap();
        old_format.as_object_mut().unwrap().remove("hiddenPaths");
        fs::write(&store.file, serde_json::to_vec(&old_format).unwrap()).unwrap();
        assert_eq!(fixture.store().opened().len(), 1);
    }

    fn asset_project(fixture: &Fixture, name: &str, modified: SystemTime) -> (String, PathBuf) {
        let root = fixture.folder(name);
        fs::create_dir_all(Path::new(&root).join("ProjectSettings")).unwrap();
        fs::create_dir_all(Path::new(&root).join("Assets/Scripts")).unwrap();
        fs::create_dir_all(Path::new(&root).join("Packages")).unwrap();
        fs::write(
            Path::new(&root).join("ProjectSettings/ProjectVersion.txt"),
            "m_EditorVersion: 2022.3.62t16\nm_TuanjieEditorVersion: 1.10.4\n",
        )
        .unwrap();
        let asset = Path::new(&root).join("Assets/Scripts/Existing.cs");
        fs::write(&asset, "owned existing asset").unwrap();
        file_time(&asset, modified);
        (root, asset)
    }
    fn file_time(path: &Path, time: SystemTime) {
        fs::OpenOptions::new()
            .write(true)
            .open(path)
            .unwrap()
            .set_times(fs::FileTimes::new().set_modified(time))
            .unwrap();
    }
    fn future(year: u64) -> SystemTime {
        UNIX_EPOCH + Duration::from_secs(1_893_456_000 + (year - 2030) * 365 * 24 * 60 * 60)
    }

    #[test]
    fn existing_asset_modification_updates_recency_without_root_version_or_registry_changes() {
        let fixture = Fixture::new();
        let (a, asset) = asset_project(&fixture, "A older asset", future(2030));
        let (b, _) = asset_project(&fixture, "B newer asset", future(2031));
        let mut store = fixture.store();
        store.add_project(&a).unwrap();
        store.add_project(&b).unwrap();
        store.favorite(&a, true).unwrap();
        let root_time = fs::metadata(&a).unwrap().modified().unwrap();
        let version = Path::new(&a).join("ProjectSettings/ProjectVersion.txt");
        let version_time = fs::metadata(&version).unwrap().modified().unwrap();
        let registry = fs::read(&store.file).unwrap();
        let mut before = store.projects();
        before.sort_by_key(|row| std::cmp::Reverse(row.last_modified_unix_ms));
        assert_eq!(before[0].title, "B newer asset");
        fs::write(&asset, "changed bytes in the same existing asset").unwrap();
        let changed = future(2032) + Duration::from_millis(123);
        file_time(&asset, changed);
        let mut after = store.projects();
        after.sort_by_key(|row| std::cmp::Reverse(row.last_modified_unix_ms));
        assert_eq!(after[0].title, "A older asset");
        assert_eq!(
            after[0].last_modified_unix_ms,
            Some(system_time_ms(changed))
        );
        assert!(after[0].last_modified.ends_with(".123Z"));
        assert!(after[0].is_favorite && !after[0].scan_incomplete);
        assert_eq!(
            (
                after[0].product.as_str(),
                after[0].version.as_str(),
                after[0].semver.as_str()
            ),
            ("tuanjie", "2022.3.62t16", "1.10.4")
        );
        assert_eq!(fs::metadata(&a).unwrap().modified().unwrap(), root_time);
        assert_eq!(
            fs::metadata(version).unwrap().modified().unwrap(),
            version_time
        );
        assert_eq!(fs::read(&store.file).unwrap(), registry);
        let restarted = fixture.store().projects();
        assert_eq!(
            restarted
                .iter()
                .find(|row| row.title == "A older asset")
                .unwrap()
                .last_modified_unix_ms,
            Some(system_time_ms(changed))
        );
        assert_eq!(fs::read(&store.file).unwrap(), registry);
    }

    #[test]
    fn content_scope_counts_packages_and_settings_but_excludes_generated_and_user_caches() {
        let fixture = Fixture::new();
        let (root, _) = asset_project(&fixture, "Content scope", future(2030));
        for name in ["Library", "Temp", "Logs", "build", ".git", "UserSettings"] {
            let file = Path::new(&root).join(name).join("newer-generated.txt");
            fs::create_dir_all(file.parent().unwrap()).unwrap();
            fs::write(&file, "owned generated bytes").unwrap();
            file_time(&file, future(2040));
        }
        let first = inspect(&root).unwrap();
        assert_eq!(
            system_time_ms(first.recency.modified),
            system_time_ms(future(2030))
        );
        assert!(!first.recency.incomplete);
        let package = Path::new(&root).join("Packages/manifest.json");
        fs::write(&package, "{}\n").unwrap();
        file_time(&package, future(2031));
        assert_eq!(
            system_time_ms(inspect(&root).unwrap().recency.modified),
            system_time_ms(future(2031))
        );
        let setting = Path::new(&root).join("ProjectSettings/EditorBuildSettings.asset");
        fs::write(&setting, "owned setting\n").unwrap();
        file_time(&setting, future(2032));
        assert_eq!(
            system_time_ms(inspect(&root).unwrap().recency.modified),
            system_time_ms(future(2032))
        );
    }

    #[test]
    fn recency_budget_and_depth_limit_report_partial_observations_instead_of_complete_latest_time()
    {
        let fixture = Fixture::new();
        let (root, _) = asset_project(&fixture, "Bounded content", future(2030));
        let limited = content_recency(Path::new(&root), UNIX_EPOCH, 1, Duration::from_secs(5));
        assert!(limited.incomplete && limited.scanned <= 1);
        assert!(limited
            .warning
            .unwrap()
            .contains("project_recency_scan_incomplete"));
        let timed = content_recency(Path::new(&root), UNIX_EPOCH, 100_000, Duration::ZERO);
        assert!(timed.incomplete);
        assert_eq!(timed.scanned, 0);
        let mut deep = Path::new(&root).join("Assets");
        for _ in 0..RECENCY_MAX_DEPTH + 1 {
            deep = deep.join("d");
        }
        fs::create_dir_all(&deep).unwrap();
        let omitted = deep.join("later.cs");
        fs::write(&omitted, "deep bytes").unwrap();
        file_time(&omitted, future(2040));
        let inspected = inspect(&root).unwrap();
        assert!(inspected.recency.incomplete);
        assert_eq!(
            system_time_ms(inspected.recency.modified),
            system_time_ms(future(2030))
        );
        let mut row = json!({"path":root});
        refresh_project_metadata(&mut row);
        assert_eq!(row["scanIncomplete"], true);
        assert!(row["metadataWarning"]
            .as_str()
            .unwrap()
            .contains("recency_scan_incomplete"));
    }

    #[test]
    fn hardlinked_outside_file_is_skipped_and_linked_version_metadata_keeps_original_record_warning(
    ) {
        let fixture = Fixture::new();
        let (root, _) = asset_project(&fixture, "Hardlinked content", future(2030));
        let outside = fixture.root.join("outside-project.cs");
        fs::write(&outside, "outside owned bytes must not supply recency").unwrap();
        file_time(&outside, future(2040));
        fs::hard_link(&outside, Path::new(&root).join("Assets/external.cs")).unwrap();
        let inspected = inspect(&root).unwrap();
        assert!(inspected.recency.incomplete);
        assert_eq!(
            system_time_ms(inspected.recency.modified),
            system_time_ms(future(2030))
        );
        assert!(inspected
            .recency
            .warning
            .unwrap()
            .contains("linked paths=1"));
        let mut store = fixture.store();
        store.add_project(&root).unwrap();
        let version = Path::new(&root).join("ProjectSettings/ProjectVersion.txt");
        fs::remove_file(&version).unwrap();
        let external_version = fixture.root.join("outside-ProjectVersion.txt");
        fs::write(&external_version, "m_EditorVersion: outside-version\n").unwrap();
        fs::hard_link(external_version, version).unwrap();
        let row = &store.projects()[0];
        assert_eq!(row.version, "2022.3.62t16");
        assert!(row.scan_incomplete);
        assert!(row
            .metadata_warning
            .as_ref()
            .unwrap()
            .contains("project_version_linked_path"));
    }

    #[cfg(windows)]
    #[test]
    fn actual_internal_junction_does_not_admit_outside_recency_or_follow_linked_settings() {
        let fixture = Fixture::new();
        let (root, _) = asset_project(&fixture, "Junction content", future(2030));
        let outside = fixture.root.join("outside-target");
        fs::create_dir(&outside).unwrap();
        let newer = outside.join("later.cs");
        fs::write(&newer, "outside owned bytes").unwrap();
        file_time(&newer, future(2040));
        let link = Path::new(&root).join("Assets/Junction");
        let junction = |link: &Path, target: &Path| {
            let quote = |path: &Path| path.to_str().unwrap().replace('\'', "''");
            let script = format!(
                "New-Item -ItemType Junction -Path '{}' -Target '{}' -ErrorAction Stop | Out-Null",
                quote(link),
                quote(target)
            );
            assert!(std::process::Command::new("powershell.exe")
                .args(["-NoProfile", "-Command", &script])
                .output()
                .unwrap()
                .status
                .success());
        };
        junction(&link, &outside);
        let inspected = inspect(&root).unwrap();
        assert!(inspected.recency.incomplete);
        assert_eq!(
            system_time_ms(inspected.recency.modified),
            system_time_ms(future(2030))
        );
        fs::remove_dir(&link).unwrap();
        assert!(newer.exists());
        let settings = Path::new(&root).join("ProjectSettings");
        let saved = Path::new(&root).join("OriginalSettings");
        fs::rename(&settings, &saved).unwrap();
        fs::write(
            outside.join("ProjectVersion.txt"),
            "m_EditorVersion: outside-version\n",
        )
        .unwrap();
        junction(&settings, &outside);
        assert!(inspect(&root)
            .err()
            .unwrap()
            .contains("project_version_linked_path"));
        fs::remove_dir(settings).unwrap();
        assert!(newer.exists());
    }

    #[test]
    fn hub_only_and_registered_rows_have_the_same_live_recency_scope_and_missing_warning() {
        let fixture = Fixture::new();
        let (root, _) = asset_project(&fixture, "Same scope", future(2030));
        let mut store = fixture.store();
        store.add_project(&root).unwrap();
        let mut hub = json!({"path":root,"version":"unknown"});
        refresh_project_metadata(&mut hub);
        let registered = &store.projects()[0];
        assert_eq!(
            hub["lastModifiedUnixMs"],
            json!(registered.last_modified_unix_ms)
        );
        assert_eq!(hub["recencyScope"], RECENCY_SCOPE);
        assert_eq!(hub["scanIncomplete"], false);
        assert_eq!(hub["lastModified"], registered.last_modified);
        assert!(registered.recency_scanned_entries > 0);
        let moved = fixture.root.join("Unavailable project");
        fs::rename(&root, &moved).unwrap();
        refresh_project_metadata(&mut hub);
        assert_eq!(hub["lastModifiedUnixMs"], Value::Null);
        assert_eq!(hub["scanIncomplete"], true);
        assert!(store.projects()[0].metadata_warning.is_some());
    }
}
