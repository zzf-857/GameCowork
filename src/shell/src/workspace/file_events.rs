//! A scoped native directory watcher; dropping the SSE stream releases it.
use notify::{event::RenameMode, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde_json::{json, Value};
use std::{
    path::Path,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
};
use tokio::sync::mpsc;

pub struct FileEvents {
    _watcher: RecommendedWatcher,
    pub receiver: mpsc::Receiver<Value>,
    pub overflow: Arc<AtomicBool>,
}
impl FileEvents {
    pub fn start(root: &Path) -> Result<Self, String> {
        let root = root.canonicalize().map_err(|e| e.to_string())?;
        if !root.is_dir() {
            return Err("Watcher requires a directory".into());
        }
        let (sender, receiver) = mpsc::channel(256);
        let (raw_sender, raw_receiver) = std::sync::mpsc::sync_channel(256);
        let overflow = Arc::new(AtomicBool::new(false));
        let overflow_signal = overflow.clone();
        let mut watcher = notify::recommended_watcher(move |result: notify::Result<Event>| {
            if raw_sender.try_send(result).is_err() {
                overflow_signal.store(true, Ordering::Release);
            }
        })
        .map_err(|e| e.to_string())?;
        watcher
            .watch(&root, RecursiveMode::Recursive)
            .map_err(|e| e.to_string())?;
        let overflow_signal = overflow.clone();
        std::thread::Builder::new()
            .name("gamecowork-file-events".into())
            .spawn(move || {
                let mut pending: Option<(Event, std::time::Instant)> = None;
                let emit = |result: notify::Result<Event>| {
                    let record = match result {
                        Ok(event) => {
                            let changes = translate(&root, &event);
                            if changes.is_empty() {
                                return;
                            }
                            json!({"changes":changes})
                        }
                        Err(error) => {
                            json!({"error":error.to_string(),"changes":[],"watcherFailed":true})
                        }
                    };
                    if sender.try_send(record).is_err() {
                        overflow_signal.store(true, Ordering::Release);
                    }
                };
                loop {
                    if sender.is_closed() {
                        break;
                    }
                    let result =
                        match raw_receiver.recv_timeout(std::time::Duration::from_millis(20)) {
                            Ok(result) => result,
                            Err(std::sync::mpsc::RecvTimeoutError::Timeout) => {
                                if pending.as_ref().is_some_and(|(_, at)| {
                                    at.elapsed() >= std::time::Duration::from_millis(100)
                                }) {
                                    emit(Ok(pending.take().unwrap().0));
                                }
                                continue;
                            }
                            Err(std::sync::mpsc::RecvTimeoutError::Disconnected) => break,
                        };
                    // notify's Windows backend reports an actual rename as adjacent
                    // From/To events. Pair those specifically, without guessing that
                    // an arbitrary delete followed by a create was a rename.
                    match result {
                        Ok(event)
                            if matches!(
                                event.kind,
                                EventKind::Modify(notify::event::ModifyKind::Name(
                                    RenameMode::From
                                ))
                            ) =>
                        {
                            if let Some((previous, _)) = pending.take() {
                                emit(Ok(previous));
                            }
                            pending = Some((event, std::time::Instant::now()));
                        }
                        Ok(event)
                            if matches!(
                                event.kind,
                                EventKind::Modify(notify::event::ModifyKind::Name(RenameMode::To))
                            ) =>
                        {
                            if let Some((mut previous, _)) = pending.take() {
                                previous.kind = EventKind::Modify(notify::event::ModifyKind::Name(
                                    RenameMode::Both,
                                ));
                                previous.paths.extend(event.paths);
                                emit(Ok(previous));
                            } else {
                                emit(Ok(event));
                            }
                        }
                        other => {
                            if let Some((previous, _)) = pending.take() {
                                emit(Ok(previous));
                            }
                            emit(other);
                        }
                    }
                }
            })
            .map_err(|e| e.to_string())?;
        Ok(Self {
            _watcher: watcher,
            receiver,
            overflow,
        })
    }
}
fn relative(root: &Path, path: &Path) -> Option<String> {
    // Verify the closest existing object, including rename/delete parents.
    // A junction outside the workspace never yields readable path events.
    let mut existing = path;
    while !existing.exists() {
        existing = existing.parent()?;
    }
    let resolved = existing.canonicalize().ok()?;
    if !crate::files::within(&resolved, root) {
        return None;
    }
    let root = crate::files::display(root);
    let path = crate::files::display(path);
    if !path
        .to_lowercase()
        .starts_with(&(root.to_lowercase() + "/"))
    {
        return None;
    }
    let relative = path.get(root.len() + 1..)?.to_owned();
    if relative.split('/').any(|part| {
        matches!(
            part,
            "Library" | "Temp" | "Logs" | "node_modules" | "target" | ".next" | ".cache"
        )
    }) {
        return None;
    }
    Some(relative)
}
fn parent(path: &str) -> &str {
    path.rsplit_once('/')
        .map(|(parent, _)| parent)
        .unwrap_or(".")
}
fn change(kind: &str, path: &str) -> Value {
    json!({"kind":kind,"path":path,"parentPath":parent(path)})
}
fn atomic_temporary(path: &str) -> bool {
    let name = path.rsplit('/').next().unwrap_or(path);
    [
        ".gamecowork-write-",
        ".gamecowork-before-",
        ".gamecowork-atomic-",
    ]
    .iter()
    .any(|prefix| {
        name.strip_prefix(prefix)
            .and_then(|name| name.strip_suffix(".tmp"))
            .is_some_and(|id| uuid::Uuid::parse_str(id).is_ok())
    })
}
fn watched_temporary(root: &Path, path: &str) -> bool {
    if atomic_temporary(path) {
        return true;
    }
    let Some((target, suffix)) = path.rsplit_once("~RF") else {
        return false;
    };
    let Some(hex) = suffix.strip_suffix(".TMP") else {
        return false;
    };
    hex.len() == 8
        && hex.bytes().all(|byte| byte.is_ascii_hexdigit())
        && crate::mutations::is_owned_atomic_target(&root.join(target))
}
fn translate(root: &Path, event: &Event) -> Vec<Value> {
    if let EventKind::Modify(notify::event::ModifyKind::Name(RenameMode::Both)) = event.kind {
        if event.paths.len() == 2 {
            let from = relative(root, &event.paths[0]);
            let to = relative(root, &event.paths[1]);
            if from
                .as_deref()
                .is_some_and(|path| watched_temporary(root, path))
                || to
                    .as_deref()
                    .is_some_and(|path| watched_temporary(root, path))
            {
                // ReplaceFileW's backup/write siblings are internal steps of a
                // save. Keep the user's tab on its original target and refresh
                // that target rather than presenting a user rename/deletion.
                return [from, to]
                    .into_iter()
                    .flatten()
                    .filter(|path| !watched_temporary(root, path))
                    .map(|path| change("updated", &path))
                    .collect();
            }
            return match (from, to) {
                (Some(from), Some(to)) => vec![
                    json!({"kind":"renamed","path":to,"parentPath":parent(&to),"oldPath":from,"oldParentPath":parent(&from)}),
                ],
                (Some(from), None) => vec![change("deleted", &from)],
                (None, Some(to)) => vec![change("added", &to)],
                _ => vec![],
            };
        }
    }
    let kind = match event.kind {
        EventKind::Create(_) => "added",
        EventKind::Remove(_) => "deleted",
        EventKind::Modify(notify::event::ModifyKind::Name(RenameMode::From)) => "deleted",
        EventKind::Modify(notify::event::ModifyKind::Name(RenameMode::To)) => "added",
        EventKind::Modify(_) | EventKind::Any => "updated",
        _ => return vec![],
    };
    event
        .paths
        .iter()
        .filter_map(|path| {
            relative(root, path)
                .filter(|path| !watched_temporary(root, path))
                .map(|path| change(kind, &path))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    #[test]
    fn native_events_follow_real_create_write_rename_delete_and_drop() {
        let root = PathBuf::from(
            r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
        )
        .join(format!("watcher-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&root).unwrap();
        let canonical = root.canonicalize().unwrap();
        let mut watcher = FileEvents::start(&root).unwrap();
        let file = root.join("原文件.txt");
        let renamed = root.join("新文件.txt");
        std::fs::write(&file, "native watcher").unwrap();
        std::thread::sleep(std::time::Duration::from_millis(100));
        std::fs::rename(&file, &renamed).unwrap();
        std::thread::sleep(std::time::Duration::from_millis(100));
        std::fs::remove_file(&renamed).unwrap();
        let deadline = std::time::Instant::now() + std::time::Duration::from_secs(4);
        let mut changes = vec![];
        while std::time::Instant::now() < deadline {
            while let Ok(record) = watcher.receiver.try_recv() {
                changes.extend(record["changes"].as_array().unwrap().clone());
            }
            if changes
                .iter()
                .any(|c| c["kind"] == "deleted" && c["path"] == "新文件.txt")
            {
                break;
            }
            std::thread::sleep(std::time::Duration::from_millis(20));
        }
        assert!(changes
            .iter()
            .any(|c| c["kind"] == "added" && c["path"] == "原文件.txt"));
        assert!(changes.iter().any(|c| c["kind"] == "renamed"
            && c["oldPath"] == "原文件.txt"
            && c["path"] == "新文件.txt"));
        assert!(changes
            .iter()
            .any(|c| c["kind"] == "deleted" && c["path"] == "新文件.txt"));
        assert!(relative(&canonical, &root.parent().unwrap().join("outside")).is_none());
        std::fs::create_dir(root.join("Library")).unwrap();
        assert!(relative(&canonical, &root.join("Library/generated")).is_none());
        drop(watcher);
        std::fs::remove_dir(root.join("Library")).unwrap();
        std::fs::remove_dir(&root).unwrap();
    }
    #[test]
    fn actual_atomic_save_and_undo_never_rename_the_user_tab_to_internal_siblings() {
        let base = PathBuf::from(
            r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
        );
        let run = base.join(format!("atomic-watcher-{}", uuid::Uuid::new_v4()));
        let root = run.join("workspace");
        std::fs::create_dir_all(&root).unwrap();
        std::fs::write(root.join("file.txt"), b"original").unwrap();
        let mut events = FileEvents::start(&root).unwrap();
        let writes = crate::mutations::Mutations::new(&root, &run.join("changes")).unwrap();
        let saved = writes
            .write_text(
                "file.txt",
                "saved",
                crate::mutations::WriteOptions {
                    overwrite: true,
                    expected_sha256: None,
                    allow_sensitive: false,
                },
            )
            .unwrap();
        writes.restore(saved["changeId"].as_str().unwrap()).unwrap();
        std::thread::sleep(std::time::Duration::from_millis(250));
        let mut changes = vec![];
        while let Ok(record) = events.receiver.try_recv() {
            changes.extend(record["changes"].as_array().unwrap().clone());
        }
        assert!(
            changes
                .iter()
                .any(|change| change["path"] == "file.txt" && change["kind"] == "updated"),
            "{changes:?}"
        );
        assert!(
            changes
                .iter()
                .all(|change| change["kind"] != "renamed" && change["kind"] != "deleted"),
            "{changes:?}"
        );
        assert!(changes
            .iter()
            .all(|change| !atomic_temporary(change["path"].as_str().unwrap())));
        assert_eq!(std::fs::read(root.join("file.txt")).unwrap(), b"original");
        drop(events);
        assert!(run
            .canonicalize()
            .unwrap()
            .starts_with(base.canonicalize().unwrap()));
        std::fs::remove_dir_all(run).unwrap();
    }
}
