//! Keep the system awake for an explicit local preference. Windows execution
//! state belongs to its calling thread, so one owned thread applies and clears it.
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    path::{Path, PathBuf},
    sync::{mpsc, Arc, Mutex},
    thread::{self, JoinHandle},
};
use tokio::sync::{broadcast, oneshot};

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Preference {
    version: u8,
    enabled: bool,
}

struct State {
    enabled: bool,
    active: bool,
    suppressed: bool,
    error: Option<String>,
}

impl State {
    fn value(&self) -> Value {
        let mut value = json!({"status":if self.error.is_some() { "error" } else { "success" },
            "enabled":self.enabled, "active":self.active,
            "suppressed":self.suppressed, "scope":"system"});
        if let Some(error) = &self.error {
            value["error"] = json!(error);
        }
        value
    }
}

enum Command {
    Get(oneshot::Sender<Result<Value, String>>),
    Set(bool, oneshot::Sender<Result<Value, String>>),
    Stop,
}

struct Worker {
    send: mpsc::Sender<Command>,
    join: Mutex<Option<JoinHandle<()>>>,
}

impl Worker {
    fn shutdown(&self) {
        let _ = self.send.send(Command::Stop);
        if let Some(join) = self.join.lock().unwrap().take() {
            let _ = join.join();
        }
    }
}

impl Drop for Worker {
    fn drop(&mut self) {
        self.shutdown();
    }
}

#[derive(Clone)]
pub struct KeepAwake {
    worker: Arc<Worker>,
}

type Apply = Box<dyn FnMut(bool) -> Result<(), String> + Send>;
type Persist = Box<dyn FnMut(&Path, bool) -> Result<(), String> + Send>;

impl KeepAwake {
    pub fn new(
        preference: PathBuf,
        suppressed: bool,
        events: broadcast::Sender<String>,
    ) -> Result<Self, String> {
        Self::start(
            preference,
            suppressed,
            events,
            Box::new(apply_native),
            Box::new(persist),
        )
    }

    fn start(
        preference: PathBuf,
        suppressed: bool,
        events: broadcast::Sender<String>,
        mut apply: Apply,
        mut save: Persist,
    ) -> Result<Self, String> {
        let (send, receive) = mpsc::channel();
        let join = thread::Builder::new()
            .name("gamecowork-keep-awake".into())
            .spawn(move || {
                let (enabled, error) = match read_preference(&preference) {
                    Ok(enabled) => (enabled, None),
                    Err(error) => (false, Some(error)),
                };
                let mut state = State {
                    enabled,
                    active: false,
                    suppressed,
                    error,
                };
                if state.enabled && !suppressed {
                    match apply(true) {
                        Ok(()) => state.active = true,
                        Err(error) => state.error = Some(error),
                    }
                }
                if let Some(error) = &state.error {
                    eprintln!("[shell] Keep-awake startup: {error}");
                }
                while let Ok(command) = receive.recv() {
                    match command {
                        Command::Get(reply) => {
                            let result = state.error.clone().map_or_else(|| Ok(state.value()), Err);
                            let _ = reply.send(result);
                        }
                        Command::Set(enabled, reply) => {
                            let result =
                                update(&preference, &mut state, enabled, &mut apply, &mut save);
                            // Publish the committed state on success and the retained state on
                            // failure, so all views can undo an optimistic toggle together.
                            let _ = events.send(
                                json!({"messageType":"tauri/keepAwakeChanged",
                                "data":state.value()})
                                .to_string(),
                            );
                            let _ = reply.send(result);
                        }
                        Command::Stop => break,
                    }
                }
                if state.active {
                    if let Err(error) = apply(false) {
                        eprintln!("[shell] Cannot clear keep-awake request: {error}");
                    }
                }
                // A Windows thread's execution requirement also ends when the thread exits.
            })
            .map_err(|error| format!("Cannot start keep-awake controller: {error}"))?;
        Ok(Self {
            worker: Arc::new(Worker {
                send,
                join: Mutex::new(Some(join)),
            }),
        })
    }

    pub async fn get(&self) -> Result<Value, String> {
        let (send, receive) = oneshot::channel();
        self.worker
            .send
            .send(Command::Get(send))
            .map_err(|_| "Keep-awake controller has stopped".to_owned())?;
        receive
            .await
            .map_err(|_| "Keep-awake controller has stopped".to_owned())?
    }

    pub async fn set(&self, data: &Value) -> Result<Value, String> {
        let enabled = data
            .get("enabled")
            .and_then(Value::as_bool)
            .ok_or_else(|| "Keep-awake enabled must be a boolean".to_owned())?;
        let (send, receive) = oneshot::channel();
        self.worker
            .send
            .send(Command::Set(enabled, send))
            .map_err(|_| "Keep-awake controller has stopped".to_owned())?;
        receive
            .await
            .map_err(|_| "Keep-awake controller has stopped".to_owned())?
    }

    pub fn shutdown(&self) {
        self.worker.shutdown();
    }
}

fn read_preference(path: &Path) -> Result<bool, String> {
    use std::io::Read;
    let file = match std::fs::File::open(path) {
        Ok(file) => file,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(false),
        Err(error) => return Err(format!("Cannot read keep-awake preference: {error}")),
    };
    let mut contents = Vec::new();
    file.take(4097)
        .read_to_end(&mut contents)
        .map_err(|error| format!("Cannot read keep-awake preference: {error}"))?;
    if contents.len() > 4096 {
        return Err("Keep-awake preference exceeds 4 KiB".into());
    }
    let preference: Preference = serde_json::from_slice(&contents)
        .map_err(|error| format!("Invalid keep-awake preference: {error}"))?;
    if preference.version != 1 {
        return Err("Unsupported keep-awake preference version".into());
    }
    Ok(preference.enabled)
}

fn persist(path: &Path, enabled: bool) -> Result<(), String> {
    crate::workspaces::write_json_atomic(
        path,
        &Preference {
            version: 1,
            enabled,
        },
    )
    .map_err(|error| {
        eprintln!("[shell] Keep-awake preference save failed: {error}");
        "Failed to persist keep-awake preference. The previous setting was kept. Check the application data directory's write permission and retry.".into()
    })
}

fn update(
    path: &Path,
    state: &mut State,
    enabled: bool,
    apply: &mut Apply,
    save: &mut Persist,
) -> Result<Value, String> {
    let previous_active = state.active;
    let active = enabled && !state.suppressed;
    if active != previous_active {
        apply(active)?;
    }
    if let Err(error) = save(path, enabled) {
        if active != previous_active {
            if let Err(rollback) = apply(previous_active) {
                state.active = active;
                let error = format!("{error}; cannot restore previous power request: {rollback}");
                state.error = Some(error.clone());
                return Err(error);
            }
        }
        return Err(error);
    }
    state.enabled = enabled;
    state.active = active;
    state.error = None;
    Ok(state.value())
}

#[cfg(windows)]
fn apply_native(enabled: bool) -> Result<(), String> {
    use windows_sys::Win32::System::Power::{
        SetThreadExecutionState, ES_CONTINUOUS, ES_SYSTEM_REQUIRED,
    };
    let flags = ES_CONTINUOUS | if enabled { ES_SYSTEM_REQUIRED } else { 0 };
    // Keep automatic system sleep suspended without forcing the display on or
    // overriding an explicit user sleep/lid action.
    if unsafe { SetThreadExecutionState(flags) } == 0 {
        return Err("Windows rejected the keep-awake power request".into());
    }
    Ok(())
}

#[cfg(not(windows))]
fn apply_native(enabled: bool) -> Result<(), String> {
    if enabled {
        Err("Keep-awake is available only on Windows".into())
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicBool, Ordering};

    fn preference_path() -> PathBuf {
        let base = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests");
        let directory = base.join(format!("keep-awake-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&directory).unwrap();
        directory.join("keep-awake.json")
    }

    fn cleanup(path: &Path) {
        let base = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests");
        let parent = path.parent().unwrap().canonicalize().unwrap();
        assert!(parent.starts_with(base.canonicalize().unwrap()));
        std::fs::remove_dir_all(parent).unwrap();
    }

    #[tokio::test]
    async fn suppressed_mode_persists_preference_without_claiming_a_power_request() {
        let path = preference_path();
        let (events, mut changes) = broadcast::channel(10);
        let service = KeepAwake::start(
            path.clone(),
            true,
            events.clone(),
            Box::new(|_| panic!("Suppressed mode must not call a power API")),
            Box::new(persist),
        )
        .unwrap();
        assert_eq!(service.get().await.unwrap()["enabled"], false);
        let value = service.set(&json!({"enabled":true})).await.unwrap();
        assert_eq!(value["enabled"], true);
        assert_eq!(value["active"], false);
        assert_eq!(value["suppressed"], true);
        let event: Value = serde_json::from_str(&changes.recv().await.unwrap()).unwrap();
        assert_eq!(event["messageType"], "tauri/keepAwakeChanged");
        assert_eq!(event["data"]["enabled"], true);
        service.shutdown();
        assert!(service.get().await.is_err());
        let restarted = KeepAwake::new(path.clone(), true, events).unwrap();
        assert_eq!(restarted.get().await.unwrap()["enabled"], true);
        restarted.set(&json!({"enabled":false})).await.unwrap();
        restarted.shutdown();
        assert!(!read_preference(&path).unwrap());
        cleanup(&path);
    }

    #[tokio::test]
    async fn native_startup_update_and_release_all_use_the_same_owned_thread() {
        let path = preference_path();
        persist(&path, true).unwrap();
        let calls = Arc::new(Mutex::new(vec![]));
        let recorded = calls.clone();
        let (events, _) = broadcast::channel(10);
        let service = KeepAwake::start(
            path.clone(),
            false,
            events,
            Box::new(move |enabled| {
                recorded
                    .lock()
                    .unwrap()
                    .push((thread::current().id(), enabled));
                Ok(())
            }),
            Box::new(persist),
        )
        .unwrap();
        assert_eq!(service.get().await.unwrap()["active"], true);
        service.set(&json!({"enabled":false})).await.unwrap();
        service.set(&json!({"enabled":true})).await.unwrap();
        service.shutdown();
        let calls = calls.lock().unwrap();
        assert_eq!(
            calls
                .iter()
                .map(|(_, enabled)| *enabled)
                .collect::<Vec<_>>(),
            [true, false, true, false]
        );
        assert!(calls.iter().all(|(id, _)| *id == calls[0].0));
        assert_ne!(calls[0].0, thread::current().id());
        cleanup(&path);
    }

    #[tokio::test]
    async fn save_failure_rolls_back_native_state_and_retains_the_saved_preference() {
        let path = preference_path();
        let fail = Arc::new(AtomicBool::new(false));
        let saving = fail.clone();
        let calls = Arc::new(Mutex::new(vec![]));
        let recorded = calls.clone();
        let (events, _) = broadcast::channel(10);
        let service = KeepAwake::start(
            path.clone(),
            false,
            events,
            Box::new(move |enabled| {
                recorded.lock().unwrap().push(enabled);
                Ok(())
            }),
            Box::new(move |path, enabled| {
                if saving.load(Ordering::SeqCst) {
                    Err("synthetic preference write failure".into())
                } else {
                    persist(path, enabled)
                }
            }),
        )
        .unwrap();
        service.set(&json!({"enabled":true})).await.unwrap();
        fail.store(true, Ordering::SeqCst);
        assert!(service
            .set(&json!({"enabled":false}))
            .await
            .unwrap_err()
            .contains("synthetic"));
        assert_eq!(service.get().await.unwrap()["enabled"], true);
        assert_eq!(service.get().await.unwrap()["active"], true);
        assert!(read_preference(&path).unwrap());
        service.shutdown();
        assert_eq!(*calls.lock().unwrap(), [true, false, true, false]);
        cleanup(&path);
    }

    #[tokio::test]
    async fn native_failure_and_invalid_payload_never_persist_a_false_success() {
        let path = preference_path();
        let (events, _) = broadcast::channel(10);
        let service = KeepAwake::start(
            path.clone(),
            false,
            events,
            Box::new(|_| Err("synthetic Windows rejection".into())),
            Box::new(persist),
        )
        .unwrap();
        for data in [
            json!(null),
            json!({}),
            json!({"enabled":1}),
            json!({"enabled":"true"}),
        ] {
            assert!(service.set(&data).await.unwrap_err().contains("boolean"));
        }
        assert!(service
            .set(&json!({"enabled":true}))
            .await
            .unwrap_err()
            .contains("rejection"));
        assert_eq!(service.get().await.unwrap()["enabled"], false);
        assert_eq!(service.get().await.unwrap()["active"], false);
        assert!(!path.exists());
        service.shutdown();
        cleanup(&path);
    }

    #[tokio::test]
    async fn invalid_preferences_are_reported_and_explicit_updates_can_repair_them() {
        let path = preference_path();
        std::fs::write(&path, "{\"enabled\":true}").unwrap();
        let (events, _) = broadcast::channel(10);
        let service = KeepAwake::new(path.clone(), true, events).unwrap();
        assert!(service
            .get()
            .await
            .unwrap_err()
            .contains("Invalid keep-awake"));
        service.set(&json!({"enabled":false})).await.unwrap();
        assert_eq!(service.get().await.unwrap()["enabled"], false);
        service.shutdown();
        assert!(!read_preference(&path).unwrap());
        cleanup(&path);
    }

    #[tokio::test]
    async fn failed_native_rollback_reports_the_live_state_and_drop_releases_it() {
        let path = preference_path();
        persist(&path, false).unwrap();
        let calls = Arc::new(Mutex::new(vec![]));
        let recorded = calls.clone();
        let (events, mut changes) = broadcast::channel(10);
        let service = KeepAwake::start(
            path.clone(),
            false,
            events,
            Box::new(move |enabled| {
                let mut calls = recorded.lock().unwrap();
                calls.push(enabled);
                if calls.len() == 2 {
                    Err("synthetic rollback failure".into())
                } else {
                    Ok(())
                }
            }),
            Box::new(|_, _| Err("synthetic preference failure".into())),
        )
        .unwrap();
        assert!(service
            .set(&json!({"enabled":true}))
            .await
            .unwrap_err()
            .contains("cannot restore"));
        assert!(service.get().await.is_err());
        let event: Value = serde_json::from_str(&changes.recv().await.unwrap()).unwrap();
        assert_eq!(event["data"]["status"], "error");
        assert_eq!(event["data"]["enabled"], false);
        assert_eq!(event["data"]["active"], true);
        assert!(!read_preference(&path).unwrap());
        drop(service);
        assert_eq!(*calls.lock().unwrap(), [true, false, false]);
        cleanup(&path);
    }
}
