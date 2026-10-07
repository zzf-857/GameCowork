//! GameCowork-owned installed Editor snapshots. Discovery still belongs to Core;
//! this cache never writes Hub registrations or starts an Editor/installer.
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::HashSet,
    fs,
    future::Future,
    path::{Path, PathBuf},
    sync::Arc,
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use tokio::sync::{broadcast, watch, Mutex};

const SCHEMA: u32 = 1;
const MAX_BYTES: u64 = 8 * 1024 * 1024;
const MAX_EDITORS: usize = 512;
const TTL: Duration = Duration::from_secs(15 * 60);
const RETRY_INTERVAL: Duration = Duration::from_secs(30);
const SCAN_TIMEOUT: Duration = Duration::from_secs(70);
const PLAYBACK_FOLDERS: &[&str] = &[
    "windowsstandalonesupport",
    "MacStandaloneSupport",
    "LinuxStandaloneSupport",
    "AndroidPlayer",
    "iOSSupport",
    "WebGLSupport",
    "OpenHarmonyPlayer",
    "WeixinMiniGameSupport",
    "PlayableAdsSupport",
];

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Fingerprint {
    kind: String,
    size: u64,
    modified: Option<String>,
    created: Option<String>,
    file_id: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Identity {
    key: String,
    paths: Vec<(String, Option<Fingerprint>)>,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct DiskSnapshot {
    schema: u32,
    checked_at: u64,
    editors: Value,
    identities: Vec<Identity>,
}

type ScanResult = Result<Value, String>;
struct Flight {
    generation: u64,
    receiver: watch::Receiver<Option<ScanResult>>,
}
struct State {
    snapshot: Option<DiskSnapshot>,
    persistent: bool,
    invalidated: bool,
    identity_changed: bool,
    error: Option<String>,
    persistence_error: Option<String>,
    last_attempt_at: Option<u64>,
    retry_after: u64,
    generation: u64,
    flight: Option<Flight>,
}

#[derive(Clone)]
pub struct InstallationCache {
    file: Arc<PathBuf>,
    state: Arc<Mutex<State>>,
    events: broadcast::Sender<String>,
    ttl: Duration,
}

impl InstallationCache {
    /// Bounded local load and metadata checks of known installs only, not a Hub
    /// discovery. Corrupt/unreadable cache never blocks starting the application.
    pub fn new(file: PathBuf, events: broadcast::Sender<String>) -> Self {
        Self::with_ttl(file, events, TTL)
    }

    fn with_ttl(file: PathBuf, events: broadcast::Sender<String>, ttl: Duration) -> Self {
        let (mut snapshot, mut error) = match load(&file) {
            Ok(snapshot) => (snapshot, None),
            Err(error) => (None, Some(error)),
        };
        let mut identity_changed = false;
        if let Some(snapshot) = &mut snapshot {
            for identity in &snapshot.identities {
                let mut changed = false;
                let mut executable_available = false;
                for (index, (path, previous)) in identity.paths.iter().enumerate() {
                    let current = fingerprint(Path::new(path));
                    if index == 0 {
                        executable_available = current
                            .as_ref()
                            .ok()
                            .and_then(|v| v.as_ref())
                            .is_some_and(|value| {
                                value.kind == "file" && Some(value) == previous.as_ref()
                            });
                    }
                    if current.as_ref().ok() != Some(previous) {
                        changed = true;
                    }
                }
                let row = &mut snapshot.editors[&identity.key];
                row["installationAvailable"] = json!(executable_available);
                row["installationIdentityChanged"] = json!(!executable_available);
                row["installationWarning"] = if executable_available {
                    Value::Null
                } else {
                    json!("Cached Editor executable is missing, changed or unavailable; refresh local installations")
                };
                identity_changed |= changed;
            }
            if identity_changed {
                error = Some(
                    "Known installation metadata changed; cached information is awaiting discovery"
                        .into(),
                );
            }
        }
        Self {
            file: Arc::new(file),
            events,
            ttl,
            state: Arc::new(Mutex::new(State {
                persistent: snapshot.is_some(),
                snapshot,
                invalidated: identity_changed,
                identity_changed,
                error,
                persistence_error: None,
                last_attempt_at: None,
                retry_after: 0,
                generation: 0,
                flight: None,
            })),
        }
    }

    /// Returns persisted data immediately when present. Expiry starts a detached
    /// single-flight scan; explicit refresh waits for that real scan and never
    /// labels the retained old snapshot fresh after failure.
    pub async fn request<F, Fut>(&self, refresh: bool, discover: F) -> ScanResult
    where
        F: FnOnce() -> Fut + Send + 'static,
        Fut: Future<Output = Result<Value, String>> + Send + 'static,
    {
        let mut state = self.state.lock().await;
        let has_snapshot = state.snapshot.is_some();
        let expired = self.stale(&state);
        let wait = refresh || !has_snapshot;
        let receiver = if let Some(flight) = &state.flight {
            Some(flight.receiver.clone())
        } else if refresh || (!has_snapshot || expired) && now_ms() >= state.retry_after {
            state.generation = state.generation.wrapping_add(1);
            let generation = state.generation;
            state.last_attempt_at = Some(now_ms());
            let (sender, receiver) = watch::channel(None);
            state.flight = Some(Flight {
                generation,
                receiver: receiver.clone(),
            });
            let cache = self.clone();
            tokio::spawn(async move {
                // A panicking/dropped requester must not leave a stuck flight.
                let mut worker = tokio::spawn(async move { discover().await });
                let discovered = match tokio::time::timeout(SCAN_TIMEOUT, &mut worker).await {
                    Ok(Ok(result)) => result,
                    Ok(Err(_)) => {
                        Err("Local Editor discovery failed before completion; retry refresh".into())
                    }
                    Err(_) => {
                        worker.abort();
                        Err("Local Editor discovery timed out; retry refresh".into())
                    }
                };
                let prepared = discovered.and_then(prepare);
                let mut state = cache.state.lock().await;
                if state.flight.as_ref().map(|flight| flight.generation) != Some(generation) {
                    let result = state
                        .snapshot
                        .as_ref()
                        .map(|_| cache.view(&state, "memory-cache"))
                        .ok_or_else(|| "A newer Editor discovery superseded this request".into());
                    let _ = sender.send(Some(result));
                    return;
                }
                state.flight = None;
                let result = match prepared {
                    Ok(snapshot) => {
                        cache.commit(&mut state, snapshot);
                        Ok(cache.view(&state, "scan"))
                    }
                    Err(error) => {
                        state.error = Some(error.clone());
                        state.invalidated = true;
                        state.retry_after =
                            now_ms().saturating_add(RETRY_INTERVAL.as_millis() as u64);
                        Err(error)
                    }
                };
                cache.emit(&cache.view(
                    &state,
                    if result.is_ok() {
                        "scan"
                    } else {
                        "retained-cache"
                    },
                ));
                let _ = sender.send(Some(result));
            });
            Some(receiver)
        } else {
            None
        };
        let current = self.view(
            &state,
            if state.persistent {
                "persistent-cache"
            } else {
                "memory-cache"
            },
        );
        if receiver.is_some() {
            self.emit(&current);
        }
        drop(state);
        if wait {
            match receiver {
                Some(receiver) => wait_for(receiver).await,
                None => Err(current["cache"]["error"]
                    .as_str()
                    .unwrap_or("Local Editor discovery is unavailable; retry refresh")
                    .into()),
            }
        } else {
            Ok(current)
        }
    }

    /// The caller may publish a successful shared project/editor scan. A later
    /// response from a preceding refresh cannot overwrite this newer snapshot.
    pub async fn accept_snapshot(&self, editors: Value) -> Result<Value, String> {
        let snapshot = prepare(editors)?;
        let mut state = self.state.lock().await;
        state.generation = state.generation.wrapping_add(1);
        state.flight = None;
        self.commit(&mut state, snapshot);
        let value = self.view(&state, "scan");
        self.emit(&value);
        Ok(value)
    }

    fn commit(&self, state: &mut State, snapshot: DiskSnapshot) {
        state.persistence_error = crate::workspaces::write_json_atomic(&self.file, &snapshot).err()
            .map(|_| "Installed Editor cache could not be saved; the current scan is available but may not survive restart".into());
        state.snapshot = Some(snapshot);
        state.persistent = false;
        state.error = None;
        state.invalidated = false;
        state.identity_changed = false;
        state.retry_after = 0;
    }

    fn stale(&self, state: &State) -> bool {
        state.invalidated
            || state.snapshot.as_ref().is_none_or(|snapshot| {
                now_ms().saturating_sub(snapshot.checked_at) >= self.ttl.as_millis() as u64
            })
    }

    fn view(&self, state: &State, source: &str) -> Value {
        let checked_at = state.snapshot.as_ref().map(|snapshot| snapshot.checked_at);
        json!({"editors": state.snapshot.as_ref().map(|snapshot| &snapshot.editors).cloned().unwrap_or_else(|| json!({})),
            "cache":{"source":if checked_at.is_some() { source } else { "none" },
            "hasSnapshot":checked_at.is_some(), "checkedAt":checked_at,
            "expiresAt":checked_at.map(|at|at.saturating_add(self.ttl.as_millis() as u64)),
            "stale":self.stale(state), "refreshing":state.flight.is_some(),
            "lastAttemptAt":state.last_attempt_at, "retryAfter":state.retry_after,
            "identityChanged":state.identity_changed, "error":state.error,
            "persistenceError":state.persistence_error}})
    }

    fn emit(&self, value: &Value) {
        let _ = self.events.send(
            json!({"messageType":"tjhub/editorInstallationsChanged",
            "source":"tauri", "data":value})
            .to_string(),
        );
    }
}

async fn wait_for(mut receiver: watch::Receiver<Option<ScanResult>>) -> ScanResult {
    loop {
        if let Some(result) = receiver.borrow_and_update().clone() {
            return result;
        }
        receiver.changed().await.map_err(|_| {
            "Local Editor discovery stopped before completion; retry refresh".to_string()
        })?;
    }
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
        .min(u64::MAX as u128) as u64
}
fn stamp(time: std::io::Result<SystemTime>) -> Option<String> {
    time.ok()?
        .duration_since(UNIX_EPOCH)
        .ok()
        .map(|time| time.as_nanos().to_string())
}
fn fingerprint(path: &Path) -> Result<Option<Fingerprint>, String> {
    let metadata = match fs::metadata(path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(error) => {
            return Err(format!(
                "Cannot inspect known installation metadata: {error}"
            ))
        }
    };
    #[cfg(windows)]
    let file_id = {
        use std::os::windows::{fs::OpenOptionsExt, io::AsRawHandle};
        use windows_sys::Win32::Storage::FileSystem::{
            GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION, FILE_FLAG_BACKUP_SEMANTICS,
        };
        let file = fs::OpenOptions::new()
            .read(true)
            .custom_flags(FILE_FLAG_BACKUP_SEMANTICS)
            .open(path)
            .map_err(|error| format!("Cannot read known installation identity: {error}"))?;
        let mut identity = std::mem::MaybeUninit::<BY_HANDLE_FILE_INFORMATION>::uninit();
        if unsafe { GetFileInformationByHandle(file.as_raw_handle(), identity.as_mut_ptr()) } == 0 {
            return Err(format!(
                "Cannot read known installation identity: {}",
                std::io::Error::last_os_error()
            ));
        }
        let identity = unsafe { identity.assume_init() };
        Some(format!(
            "{:08X}:{:08X}{:08X}",
            identity.dwVolumeSerialNumber, identity.nFileIndexHigh, identity.nFileIndexLow
        ))
    };
    #[cfg(not(windows))]
    let file_id = None;
    Ok(Some(Fingerprint {
        kind: if metadata.is_file() {
            "file"
        } else if metadata.is_dir() {
            "directory"
        } else {
            "other"
        }
        .into(),
        size: metadata.len(),
        modified: stamp(metadata.modified()),
        created: stamp(metadata.created()),
        file_id,
    }))
}

fn paths(row: &Value) -> Result<Vec<PathBuf>, String> {
    let executable = row["path"]
        .as_str()
        .filter(|path| !path.is_empty() && path.len() <= 8192)
        .ok_or("Installed Editor cache entry is missing its path")?;
    let executable = PathBuf::from(executable);
    if !executable.is_absolute() {
        return Err("Installed Editor cache path must be absolute".into());
    }
    let folder = executable
        .parent()
        .ok_or("Installed Editor has no executable folder")?;
    let install = folder
        .parent()
        .ok_or("Installed Editor has no installation folder")?;
    let playback = folder.join("Data/PlaybackEngines");
    let mut result = vec![
        executable.clone(),
        install.join("modules.json"),
        playback.clone(),
    ];
    result.extend(PLAYBACK_FOLDERS.iter().map(|part| playback.join(part)));
    Ok(result)
}

fn validate_rows(editors: &Value) -> Result<(), String> {
    let rows = editors
        .as_object()
        .ok_or("Installed Editor cache must contain a row map")?;
    if rows.len() > MAX_EDITORS {
        return Err("Installed Editor cache exceeds 512 entries".into());
    }
    for (key, row) in rows {
        let product = row["product"]
            .as_str()
            .ok_or("Installed Editor product is unavailable")?;
        let version = row["version"]
            .as_str()
            .filter(|version| !version.is_empty() && version.len() <= 128)
            .ok_or("Installed Editor version is unavailable")?;
        let path = row["path"]
            .as_str()
            .ok_or("Installed Editor path is unavailable")?;
        if !["unity", "tuanjie"].contains(&product)
            || key != &format!("{product}:{version}:{path}")
            || !row.is_object()
        {
            return Err("Installed Editor cache identity is invalid".into());
        }
        paths(row)?;
    }
    Ok(())
}

fn prepare(mut editors: Value) -> Result<DiskSnapshot, String> {
    validate_rows(&editors)?;
    let mut identities = Vec::new();
    for (key, row) in editors.as_object_mut().unwrap() {
        let paths = paths(row)?
            .into_iter()
            .map(|path| {
                fingerprint(&path).map(|identity| (path.to_string_lossy().into_owned(), identity))
            })
            .collect::<Result<Vec<_>, _>>()?;
        if paths[0]
            .1
            .as_ref()
            .is_none_or(|identity| identity.kind != "file")
        {
            return Err(
                "A discovered Editor executable is missing or unavailable; retry discovery".into(),
            );
        }
        row["installationAvailable"] = json!(true);
        row["installationIdentityChanged"] = json!(false);
        row["installationWarning"] = Value::Null;
        identities.push(Identity {
            key: key.clone(),
            paths,
        });
    }
    let snapshot = DiskSnapshot {
        schema: SCHEMA,
        checked_at: now_ms(),
        editors,
        identities,
    };
    if serde_json::to_vec(&snapshot)
        .map_err(|error| error.to_string())?
        .len()
        > MAX_BYTES as usize
    {
        return Err("Installed Editor cache exceeds its 8 MiB response budget".into());
    }
    Ok(snapshot)
}

fn load(file: &Path) -> Result<Option<DiskSnapshot>, String> {
    match fs::metadata(file) {
        Ok(metadata) if metadata.is_file() && metadata.len() <= MAX_BYTES => {}
        Ok(_) => {
            return Err("Installed Editor cache is not a bounded file; retry discovery".into())
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(_) => return Err("Installed Editor cache could not be read; retry discovery".into()),
    }
    let bytes =
        fs::read(file).map_err(|_| "Installed Editor cache could not be read; retry discovery")?;
    if bytes.len() > MAX_BYTES as usize {
        return Err("Installed Editor cache exceeds 8 MiB".into());
    }
    let snapshot: DiskSnapshot = serde_json::from_slice(&bytes)
        .map_err(|_| "Installed Editor cache is invalid; retry discovery")?;
    if snapshot.schema != SCHEMA || snapshot.checked_at > now_ms().saturating_add(5 * 60 * 1000) {
        return Err("Installed Editor cache version/timestamp is invalid; retry discovery".into());
    }
    validate_rows(&snapshot.editors)?;
    let rows = snapshot.editors.as_object().unwrap();
    let mut seen = HashSet::new();
    if rows.len() != snapshot.identities.len() {
        return Err("Installed Editor cache identities are incomplete".into());
    }
    for identity in &snapshot.identities {
        let row = rows
            .get(&identity.key)
            .ok_or("Installed Editor cache has an unknown identity")?;
        let expected = paths(row)?;
        if !seen.insert(&identity.key)
            || expected.len() != identity.paths.len()
            || expected
                .iter()
                .zip(&identity.paths)
                .any(|(expected, (actual, _))| expected != Path::new(actual))
            || identity.paths[0]
                .1
                .as_ref()
                .is_none_or(|fingerprint| fingerprint.kind != "file")
        {
            return Err("Installed Editor cache path identities are invalid".into());
        }
    }
    Ok(Some(snapshot))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicUsize, Ordering};
    use tokio::sync::oneshot;

    struct Fixture {
        root: PathBuf,
        file: PathBuf,
        exe: PathBuf,
        events: broadcast::Sender<String>,
    }
    impl Fixture {
        fn new() -> Self {
            let root = PathBuf::from(
                "F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-installations-cache-rust",
            )
            .join(uuid::Uuid::new_v4().to_string());
            let exe = root.join("install/Editor/Unity.exe");
            fs::create_dir_all(exe.parent().unwrap()).unwrap();
            fs::write(&exe, b"owned fixture executable; never launched").unwrap();
            let (events, _) = broadcast::channel(64);
            Self {
                file: root.join("data/installed-editors.json"),
                root,
                exe,
                events,
            }
        }
        fn cache(&self) -> InstallationCache {
            InstallationCache::new(self.file.clone(), self.events.clone())
        }
        fn rows(&self, version: &str) -> Value {
            crate::editor_installations::from_snapshot(
                &json!([{"product":"unity", "editors":[{"path":self.exe,"version":version}]}]),
            )
            .unwrap()
        }
        async fn seed(&self, version: &str) -> InstallationCache {
            let cache = self.cache();
            cache.accept_snapshot(self.rows(version)).await.unwrap();
            cache
        }
    }
    fn version(value: &Value) -> &str {
        value["editors"]
            .as_object()
            .unwrap()
            .values()
            .next()
            .unwrap()["version"]
            .as_str()
            .unwrap()
    }
    async fn next_finished(events: &mut broadcast::Receiver<String>) -> Value {
        loop {
            let value: Value = serde_json::from_str(
                &tokio::time::timeout(Duration::from_secs(5), events.recv())
                    .await
                    .unwrap()
                    .unwrap(),
            )
            .unwrap();
            assert_eq!(value["messageType"], "tjhub/editorInstallationsChanged");
            if value["data"]["cache"]["refreshing"] == false {
                return value["data"].clone();
            }
        }
    }

    #[tokio::test]
    async fn persisted_restart_first_read_does_not_scan_and_keeps_engine_path_identity() {
        let fixture = Fixture::new();
        let other = fixture.root.join("tuanjie/Editor/Tuanjie.exe");
        fs::create_dir_all(other.parent().unwrap()).unwrap();
        fs::write(&other, b"own Tuanjie file").unwrap();
        let rows = crate::editor_installations::from_snapshot(&json!([
            {"product":"unity","editors":[{"path":fixture.exe,"version":"2022.3.62t16"}]},
            {"product":"tuanjie","editors":[{"path":other,"version":"2022.3.62t16","tuanjie_editor_version":"1.10.4"}]}
        ])).unwrap();
        fixture.cache().accept_snapshot(rows).await.unwrap();
        let cache = fixture.cache();
        let calls = Arc::new(AtomicUsize::new(0));
        let counter = calls.clone();
        let value = cache
            .request(false, move || async move {
                counter.fetch_add(1, Ordering::SeqCst);
                Err("must not scan".into())
            })
            .await
            .unwrap();
        assert_eq!(calls.load(Ordering::SeqCst), 0);
        assert_eq!(value["editors"].as_object().unwrap().len(), 2);
        let row = value["editors"]
            .as_object()
            .unwrap()
            .values()
            .find(|row| row["product"] == "tuanjie")
            .unwrap();
        assert_eq!(row["semver"], "1.10.4");
        assert_eq!(row["technicalVersion"], "2022.3.62t16");
        assert_eq!(row["path"], json!(other));
        assert_eq!(row["installationAvailable"], true);
        assert_eq!(value["cache"]["source"], "persistent-cache");
        assert_eq!(value["cache"]["stale"], false);
        assert_eq!(value["cache"]["refreshing"], false);
    }

    #[tokio::test]
    async fn expired_first_display_is_immediate_and_background_refresh_is_single_flight() {
        let fixture = Fixture::new();
        fixture.seed("6000.0.1f1").await;
        let cache = InstallationCache::with_ttl(
            fixture.file.clone(),
            fixture.events.clone(),
            Duration::ZERO,
        );
        let mut events = fixture.events.subscribe();
        let (started, start) = oneshot::channel();
        let (release, released) = oneshot::channel();
        let rows = fixture.rows("6000.1.2f1");
        let calls = Arc::new(AtomicUsize::new(0));
        let counter = calls.clone();
        let displayed = cache
            .request(false, move || async move {
                counter.fetch_add(1, Ordering::SeqCst);
                started.send(()).unwrap();
                released.await.unwrap();
                Ok(rows)
            })
            .await
            .unwrap();
        assert_eq!(version(&displayed), "6000.0.1f1");
        assert_eq!(displayed["cache"]["stale"], true);
        assert_eq!(displayed["cache"]["refreshing"], true);
        start.await.unwrap();
        let concurrent = cache
            .request(false, || async { panic!("must join existing scan") })
            .await
            .unwrap();
        assert_eq!(
            concurrent["cache"]["checkedAt"],
            displayed["cache"]["checkedAt"]
        );
        let waiting = cache.request(true, || async {
            panic!("explicit request must join real in-flight scan")
        });
        tokio::pin!(waiting);
        assert!(futures::poll!(waiting.as_mut()).is_pending());
        release.send(()).unwrap();
        let finished = waiting.await.unwrap();
        assert_eq!(version(&finished), "6000.1.2f1");
        assert_eq!(calls.load(Ordering::SeqCst), 1);
        assert_eq!(version(&next_finished(&mut events).await), "6000.1.2f1");
        assert_eq!(
            load(&fixture.file)
                .unwrap()
                .unwrap()
                .editors
                .as_object()
                .unwrap()
                .values()
                .next()
                .unwrap()["version"],
            "6000.1.2f1"
        );
    }

    #[tokio::test]
    async fn explicit_refresh_scans_fresh_cache_and_passive_reader_is_never_blocked_by_it() {
        let fixture = Fixture::new();
        let cache = fixture.seed("6000.0.1f1").await;
        let (started, start) = oneshot::channel();
        let (release, released) = oneshot::channel();
        let rows = fixture.rows("6000.2.3f1");
        let task = tokio::spawn({
            let cache = cache.clone();
            async move {
                cache
                    .request(true, move || async move {
                        started.send(()).unwrap();
                        released.await.unwrap();
                        Ok(rows)
                    })
                    .await
            }
        });
        start.await.unwrap();
        let old = cache
            .request(false, || async {
                panic!("reader must not start another scan")
            })
            .await
            .unwrap();
        assert_eq!(version(&old), "6000.0.1f1");
        assert_eq!(old["cache"]["refreshing"], true);
        assert!(!task.is_finished());
        release.send(()).unwrap();
        let fresh = task.await.unwrap().unwrap();
        assert_eq!(version(&fresh), "6000.2.3f1");
        assert_eq!(fresh["cache"]["source"], "scan");
        assert_eq!(fresh["cache"]["stale"], false);
    }

    #[tokio::test]
    async fn failed_scan_retains_previous_snapshot_timestamp_and_disk_and_explicit_retry_recovers()
    {
        let fixture = Fixture::new();
        let cache = fixture.seed("6000.0.1f1").await;
        let disk = fs::read(&fixture.file).unwrap();
        let mut events = fixture.events.subscribe();
        assert!(cache
            .request(true, || async { Err("owned scanner offline".into()) })
            .await
            .unwrap_err()
            .contains("offline"));
        let failed = next_finished(&mut events).await;
        assert_eq!(version(&failed), "6000.0.1f1");
        assert_eq!(failed["cache"]["stale"], true);
        assert_eq!(failed["cache"]["error"], "owned scanner offline");
        assert_eq!(fs::read(&fixture.file).unwrap(), disk);
        let retained = cache
            .request(false, || async {
                panic!("passive failure cooldown must not storm discovery")
            })
            .await
            .unwrap();
        assert_eq!(retained["cache"]["checkedAt"], failed["cache"]["checkedAt"]);
        let rows = fixture.rows("6000.4.1f1");
        let recovered = cache
            .request(true, move || async move { Ok(rows) })
            .await
            .unwrap();
        assert_eq!(version(&recovered), "6000.4.1f1");
        assert_eq!(recovered["cache"]["error"], Value::Null);
        assert_eq!(recovered["cache"]["stale"], false);
    }

    #[tokio::test]
    async fn missing_known_executable_is_disclosed_before_background_replacement() {
        let fixture = Fixture::new();
        fixture.seed("6000.0.1f1").await;
        fs::remove_file(&fixture.exe).unwrap();
        let cache = fixture.cache();
        let (release, released) = oneshot::channel();
        let mut events = fixture.events.subscribe();
        let value = cache
            .request(false, move || async move {
                released.await.unwrap();
                Ok(json!({}))
            })
            .await
            .unwrap();
        let row = value["editors"]
            .as_object()
            .unwrap()
            .values()
            .next()
            .unwrap();
        assert_eq!(row["installationAvailable"], false);
        assert_eq!(row["installationIdentityChanged"], true);
        assert_eq!(value["cache"]["identityChanged"], true);
        assert_eq!(value["cache"]["stale"], true);
        release.send(()).unwrap();
        let finished = next_finished(&mut events).await;
        assert_eq!(finished["editors"], json!({}));
        assert_eq!(finished["cache"]["stale"], false);
    }

    #[tokio::test]
    async fn executable_replacement_and_module_metadata_change_invalidate_persisted_identity() {
        let fixture = Fixture::new();
        fixture.seed("6000.0.1f1").await;
        let original = fingerprint(&fixture.exe).unwrap();
        let other = fixture.exe.with_extension("replacement");
        fs::write(&other, b"owned replacement").unwrap();
        fs::remove_file(&fixture.exe).unwrap();
        fs::rename(other, &fixture.exe).unwrap();
        assert_ne!(fingerprint(&fixture.exe).unwrap(), original);
        let cache = fixture.cache();
        let state = cache.state.lock().await;
        assert!(state.identity_changed);
        assert!(state.invalidated);
        drop(state);
        fixture.seed("6000.0.1f1").await;
        fs::write(fixture.root.join("install/modules.json"), b"[]").unwrap();
        let cache = fixture.cache();
        let state = cache.state.lock().await;
        assert!(state.identity_changed);
        assert_eq!(
            state
                .snapshot
                .as_ref()
                .unwrap()
                .editors
                .as_object()
                .unwrap()
                .values()
                .next()
                .unwrap()["installationAvailable"],
            true
        );
    }

    #[tokio::test]
    async fn empty_success_is_persisted_and_does_not_scan_on_restart() {
        let fixture = Fixture::new();
        fixture.cache().accept_snapshot(json!({})).await.unwrap();
        let value = fixture
            .cache()
            .request(false, || async {
                panic!("valid empty snapshot must honor TTL")
            })
            .await
            .unwrap();
        assert_eq!(value["editors"], json!({}));
        assert_eq!(value["cache"]["hasSnapshot"], true);
        assert_eq!(value["cache"]["stale"], false);
    }

    #[tokio::test]
    async fn no_cache_concurrent_reads_share_one_actual_scan() {
        let fixture = Fixture::new();
        let cache = fixture.cache();
        let rows = fixture.rows("6000.0.1f1");
        let (started, start) = oneshot::channel();
        let (release, released) = oneshot::channel();
        let first = tokio::spawn({
            let cache = cache.clone();
            async move {
                cache
                    .request(false, move || async move {
                        started.send(()).unwrap();
                        released.await.unwrap();
                        Ok(rows)
                    })
                    .await
            }
        });
        start.await.unwrap();
        let second = cache.request(false, || async {
            panic!("same initial scan must coalesce")
        });
        tokio::pin!(second);
        assert!(futures::poll!(second.as_mut()).is_pending());
        // Both requests have the same stored receiver before its barrier releases.
        let state = cache.state.lock().await;
        assert!(state.flight.is_some());
        drop(state);
        release.send(()).unwrap();
        assert_eq!(version(&first.await.unwrap().unwrap()), "6000.0.1f1");
        assert_eq!(version(&second.await.unwrap()), "6000.0.1f1");
    }

    #[tokio::test]
    async fn cancelled_requester_does_not_poison_or_abort_owned_background_scan() {
        let fixture = Fixture::new();
        let cache = fixture.cache();
        let rows = fixture.rows("6000.0.1f1");
        let (started, start) = oneshot::channel();
        let (release, released) = oneshot::channel();
        let mut events = fixture.events.subscribe();
        let requester = tokio::spawn({
            let cache = cache.clone();
            async move {
                cache
                    .request(true, move || async move {
                        started.send(()).unwrap();
                        released.await.unwrap();
                        Ok(rows)
                    })
                    .await
            }
        });
        start.await.unwrap();
        requester.abort();
        release.send(()).unwrap();
        assert_eq!(version(&next_finished(&mut events).await), "6000.0.1f1");
        let retained = cache
            .request(false, || async {
                panic!("completed background scan must be usable")
            })
            .await
            .unwrap();
        assert_eq!(retained["cache"]["refreshing"], false);
    }

    #[tokio::test]
    async fn newer_project_snapshot_supersedes_late_refresh_without_disk_resurrection() {
        let fixture = Fixture::new();
        let cache = fixture.seed("6000.0.1f1").await;
        let (started, start) = oneshot::channel();
        let (release, released) = oneshot::channel();
        let old = fixture.rows("6000.1.1f1");
        let task = tokio::spawn({
            let cache = cache.clone();
            async move {
                cache
                    .request(true, move || async move {
                        started.send(()).unwrap();
                        released.await.unwrap();
                        Ok(old)
                    })
                    .await
            }
        });
        start.await.unwrap();
        cache
            .accept_snapshot(fixture.rows("6000.2.2f1"))
            .await
            .unwrap();
        let disk = fs::read(&fixture.file).unwrap();
        release.send(()).unwrap();
        assert_eq!(version(&task.await.unwrap().unwrap()), "6000.2.2f1");
        assert_eq!(fs::read(&fixture.file).unwrap(), disk);
    }

    #[tokio::test]
    async fn malformed_future_or_oversized_cache_recovers_without_trusting_rows() {
        let fixture = Fixture::new();
        fs::create_dir_all(fixture.file.parent().unwrap()).unwrap();
        for bytes in [b"not json".to_vec(), vec![b'x'; MAX_BYTES as usize + 1]] {
            fs::write(&fixture.file, bytes).unwrap();
            let cache = fixture.cache();
            assert!(cache.state.lock().await.snapshot.is_none());
            let rows = fixture.rows("6000.0.1f1");
            let value = cache
                .request(false, move || async move { Ok(rows) })
                .await
                .unwrap();
            assert_eq!(version(&value), "6000.0.1f1");
        }
        let mut snapshot = prepare(fixture.rows("6000.0.1f1")).unwrap();
        snapshot.checked_at = u64::MAX;
        fs::write(&fixture.file, serde_json::to_vec(&snapshot).unwrap()).unwrap();
        assert!(fixture.cache().state.lock().await.snapshot.is_none());
        snapshot.checked_at = now_ms();
        snapshot.identities[0].paths[0].0 = fixture.root.join("outside").to_string_lossy().into();
        fs::write(&fixture.file, serde_json::to_vec(&snapshot).unwrap()).unwrap();
        assert!(fixture.cache().state.lock().await.snapshot.is_none());
    }

    #[tokio::test]
    async fn malformed_scan_or_missing_executable_cannot_replace_confirmed_rows() {
        let fixture = Fixture::new();
        let cache = fixture.seed("6000.0.1f1").await;
        let original = fs::read(&fixture.file).unwrap();
        assert!(cache
            .request(true, || async { Ok(json!([])) })
            .await
            .is_err());
        let missing = fixture.rows("6000.3.1f1");
        let mut row = missing
            .as_object()
            .unwrap()
            .values()
            .next()
            .unwrap()
            .clone();
        row["path"] = json!(fixture.root.join("missing/Editor/Unity.exe"));
        let key = format!("unity:6000.3.1f1:{}", row["path"].as_str().unwrap());
        let missing = json!({key:row});
        assert!(cache
            .request(true, move || async move { Ok(missing) })
            .await
            .is_err());
        assert_eq!(fs::read(&fixture.file).unwrap(), original);
        assert_eq!(
            version(
                &cache
                    .request(false, || async { panic!("failure cooldown") })
                    .await
                    .unwrap()
            ),
            "6000.0.1f1"
        );
    }

    #[tokio::test]
    async fn panicking_scanner_is_reported_and_does_not_leave_refresh_stuck() {
        let fixture = Fixture::new();
        let cache = fixture.seed("6000.0.1f1").await;
        assert!(cache
            .request(true, || async { panic!("owned test scanner failure") })
            .await
            .is_err());
        assert!(cache.state.lock().await.flight.is_none());
        let rows = fixture.rows("6000.2.1f1");
        assert_eq!(
            version(
                &cache
                    .request(true, move || async move { Ok(rows) })
                    .await
                    .unwrap()
            ),
            "6000.2.1f1"
        );
    }

    #[cfg(windows)]
    #[tokio::test]
    async fn atomic_persist_failure_retains_previous_disk_but_reports_fresh_memory_not_restart_success(
    ) {
        let fixture = Fixture::new();
        let cache = fixture.seed("6000.0.1f1").await;
        let disk = fs::read(&fixture.file).unwrap();
        let mut permissions = fs::metadata(&fixture.file).unwrap().permissions();
        permissions.set_readonly(true);
        fs::set_permissions(&fixture.file, permissions).unwrap();
        let rows = fixture.rows("6000.2.1f1");
        let result = cache
            .request(true, move || async move { Ok(rows) })
            .await
            .unwrap();
        let mut permissions = fs::metadata(&fixture.file).unwrap().permissions();
        permissions.set_readonly(false);
        fs::set_permissions(&fixture.file, permissions).unwrap();
        assert_eq!(version(&result), "6000.2.1f1");
        assert_eq!(result["cache"]["stale"], false);
        assert!(result["cache"]["persistenceError"].is_string());
        assert_eq!(fs::read(&fixture.file).unwrap(), disk);
        let restarted = fixture
            .cache()
            .request(false, || async {
                panic!("old persisted snapshot must remain honest")
            })
            .await
            .unwrap();
        assert_eq!(version(&restarted), "6000.0.1f1");
    }
}
