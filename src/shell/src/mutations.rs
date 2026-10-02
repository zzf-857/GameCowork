//! Explicit, reversible local mutations. Authorization is performed by the host
//! before calling these APIs; construction never modifies a workspace.
use crate::files::{
    decode_text, display, parse_path, within, FileError, MAX_BINARY_BYTES, MAX_TEXT_BYTES,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    path::{Component, Path, PathBuf},
    sync::{Mutex, OnceLock},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use uuid::Uuid;

type AtomicTargets = std::collections::HashMap<String, (usize, Instant)>;
fn atomic_targets() -> &'static Mutex<AtomicTargets> {
    static TARGETS: OnceLock<Mutex<AtomicTargets>> = OnceLock::new();
    TARGETS.get_or_init(|| Mutex::new(std::collections::HashMap::new()))
}
struct AtomicTarget(String);
impl AtomicTarget {
    fn begin(target: &Path) -> Self {
        let key = display(target).to_lowercase();
        let mut targets = atomic_targets().lock().unwrap();
        targets.retain(|_, (active, until)| *active > 0 || *until > Instant::now());
        targets
            .entry(key.clone())
            .and_modify(|(active, _)| *active += 1)
            .or_insert((1, Instant::now()));
        Self(key)
    }
}
impl Drop for AtomicTarget {
    fn drop(&mut self) {
        if let Some((active, until)) = atomic_targets().lock().unwrap().get_mut(&self.0) {
            *active = active.saturating_sub(1);
            *until = Instant::now() + Duration::from_secs(2);
        }
    }
}
pub(crate) fn is_owned_atomic_target(target: &Path) -> bool {
    let mut targets = atomic_targets().lock().unwrap();
    targets.retain(|_, (active, until)| *active > 0 || *until > Instant::now());
    targets.contains_key(&display(target).to_lowercase())
}

#[derive(Default, Clone)]
pub struct WriteOptions {
    pub overwrite: bool,
    pub expected_sha256: Option<String>,
    pub allow_sensitive: bool,
}
#[derive(Default, Clone)]
pub struct DeleteOptions {
    pub expected_sha256: Option<String>,
    pub allow_sensitive: bool,
}
#[derive(Clone, Debug)]
pub struct MutationError {
    code: String,
    message: String,
    status: u16,
    applied: bool,
    change_id: Option<String>,
}
impl MutationError {
    pub(crate) fn invalid_request(message: impl Into<String>) -> Self {
        Self::new(400, "invalid_request", message)
    }
    fn new(status: u16, code: &str, message: impl Into<String>) -> Self {
        Self {
            status,
            code: code.into(),
            message: message.into(),
            applied: false,
            change_id: None,
        }
    }
    fn applied(mut self, id: &str) -> Self {
        self.applied = true;
        self.change_id = Some(id.into());
        self
    }
    pub fn status(&self) -> u16 {
        self.status
    }
    pub fn json(&self) -> Value {
        json!({"error":self.message,"code":self.code,"applied":self.applied,"changeId":self.change_id})
    }
}
impl std::fmt::Display for MutationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}
impl std::error::Error for MutationError {}
impl From<FileError> for MutationError {
    fn from(error: FileError) -> Self {
        Self::new(
            error.status(),
            error.json()["code"].as_str().unwrap_or("file_error"),
            error.to_string(),
        )
    }
}
fn io(error: std::io::Error) -> MutationError {
    let status = match error.kind() {
        std::io::ErrorKind::NotFound => 404,
        std::io::ErrorKind::PermissionDenied => 403,
        std::io::ErrorKind::AlreadyExists => 409,
        _ => 500,
    };
    MutationError::new(status, "mutation_io_error", error.to_string())
}
static OPERATIONS: OnceLock<Mutex<()>> = OnceLock::new();
fn operation() -> Result<std::sync::MutexGuard<'static, ()>, MutationError> {
    OPERATIONS
        .get_or_init(|| Mutex::new(()))
        .lock()
        .map_err(|_| {
            MutationError::new(500, "mutation_lock_failed", "Mutation lock is unavailable")
        })
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Manifest {
    version: u32,
    change_id: String,
    operation: String,
    state: String,
    workspace_root: String,
    original_path: String,
    before_sha256: Option<String>,
    after_sha256: Option<String>,
    backup_path: Option<String>,
    created_directories: Vec<String>,
    #[serde(default)]
    directory_ids: std::collections::HashMap<String, String>,
    timestamp_ms: u64,
}
pub struct Mutations {
    primary: PathBuf,
    changes: PathBuf,
}
impl Mutations {
    pub fn new(primary: &Path, changes: &Path) -> Result<Self, MutationError> {
        let primary = fs::canonicalize(primary).map_err(io)?;
        if !primary.is_dir() {
            return Err(MutationError::new(
                400,
                "not_directory",
                "Workspace root is not a directory",
            ));
        }
        if !changes.is_absolute() {
            return Err(MutationError::new(
                400,
                "invalid_backup_root",
                "Application change directory must be absolute",
            ));
        }
        if within(changes, &primary) {
            return Err(MutationError::new(
                400,
                "invalid_backup_root",
                "Change backups must be outside the workspace",
            ));
        }
        let mut ancestor = changes.to_path_buf();
        while !ancestor.exists() {
            ancestor = ancestor
                .parent()
                .ok_or_else(|| {
                    MutationError::new(400, "invalid_backup_root", "Backup parent is unavailable")
                })?
                .to_path_buf();
        }
        if within(&fs::canonicalize(ancestor).map_err(io)?, &primary) {
            return Err(MutationError::new(
                400,
                "invalid_backup_root",
                "Backup parent resolves into the workspace",
            ));
        }
        fs::create_dir_all(changes).map_err(io)?;
        let changes = fs::canonicalize(changes).map_err(io)?;
        if within(&changes, &primary) {
            return Err(MutationError::new(
                400,
                "invalid_backup_root",
                "Change backups must be outside the workspace",
            ));
        }
        Ok(Self { primary, changes })
    }
    /// Validation only: no backup, snapshot record, temporary file, or write.
    pub fn can_edit(&self, input: &str) -> Result<bool, MutationError> {
        let target = match self.target(input, false) {
            Ok(target) => target,
            Err(error) if matches!(error.status, 403 | 404) => return Ok(false),
            Err(error) => return Err(error),
        };
        if self.sensitive(&target, false).is_err() {
            return Ok(false);
        }
        let metadata = fs::metadata(&target).map_err(io)?;
        if !metadata.is_file()
            || metadata.permissions().readonly()
            || metadata.len() > MAX_TEXT_BYTES
        {
            return Ok(false);
        }
        let files = crate::files::Files::new(&self.primary, &[self.primary.clone()])?;
        match files.read_file(target.to_string_lossy().as_ref(), "utf8") {
            Ok(_) => Ok(true),
            Err(error) if matches!(error.status(), 403 | 404 | 413 | 415 | 422) => Ok(false),
            Err(error) => Err(error.into()),
        }
    }
    pub fn write_text(
        &self,
        input: &str,
        text: &str,
        options: WriteOptions,
    ) -> Result<Value, MutationError> {
        let _operation = operation()?;
        if text.len() as u64 > MAX_TEXT_BYTES {
            return Err(MutationError::new(
                413,
                "text_too_large",
                "Text write exceeds 2 MiB",
            ));
        }
        if text.contains('\0') {
            return Err(MutationError::new(
                415,
                "binary_text_unsupported",
                "UTF-8 text writes cannot contain NUL bytes",
            ));
        }
        let target = self.target(input, true)?;
        self.sensitive(&target, options.allow_sensitive)?;
        let _parents = DirectoryLeases::new(&self.primary, target.parent().unwrap())?;
        let before = self.snapshot_optional(&target)?;
        if before.is_some() && !options.overwrite {
            return Err(MutationError::new(
                409,
                "overwrite_not_authorized",
                "Overwriting an existing file requires explicit authorization",
            ));
        }
        if let Some(before) = &before {
            decode_text(&before.bytes).map_err(MutationError::from)?;
        }
        expected(
            before.as_ref().map(|v| v.sha.as_str()),
            options.expected_sha256.as_deref(),
        )?;
        let after = hash(text.as_bytes());
        let (mut manifest, directory) = self.prepare(
            "write",
            &target,
            before.as_ref(),
            Some(after.clone()),
            Vec::new(),
        )?;
        let temp = target
            .parent()
            .unwrap()
            .join(format!(".gamecowork-write-{}.tmp", manifest.change_id));
        let mut guard = TempFile::create(&temp, &self.primary)?;
        guard.write(text.as_bytes())?;
        let current = self.snapshot_optional(&target)?;
        if current.as_ref().map(|v| v.sha.as_str()) != before.as_ref().map(|v| v.sha.as_str()) {
            return Err(MutationError::new(
                409,
                "file_changed",
                "File changed while preparing its backup",
            ));
        }
        let displaced = target
            .parent()
            .unwrap()
            .join(format!(".gamecowork-before-{}.tmp", manifest.change_id));
        replace(&temp, &target, before.is_some(), Some(&displaced)).map_err(io)?;
        guard.consumed = true;
        // Windows ReplaceFile preserves the exact displaced version. Copy it to
        // the owned change directory before clearing the temporary sibling.
        if displaced.exists() {
            let actual = match self.snapshot(&displaced) {
                Ok(actual) => actual,
                Err(error) => {
                    return Err(self.recovery_needed(&directory, &mut manifest, &displaced, error))
                }
            };
            let backup = directory.join("before.bin");
            if let Err(error) = write_atomic(&backup, &actual.bytes, true, &self.changes) {
                return Err(self.recovery_needed(&directory, &mut manifest, &displaced, error));
            }
            manifest.before_sha256 = Some(actual.sha.clone());
            manifest.backup_path = Some(display(&backup));
            self.save_manifest(&directory, &manifest)
                .map_err(|e| e.applied(&manifest.change_id))?;
            fs::remove_file(&displaced).map_err(|e| io(e).applied(&manifest.change_id))?;
            if options
                .expected_sha256
                .as_deref()
                .is_some_and(|expected| !expected.eq_ignore_ascii_case(&actual.sha))
            {
                manifest.state = "applied-conflict".into();
                self.save_manifest(&directory, &manifest)
                    .map_err(|e| e.applied(&manifest.change_id))?;
                return Err(MutationError::new(409,"concurrent_change_preserved","File changed during atomic replacement; its exact displaced version is backed up").applied(&manifest.change_id));
            }
        }
        manifest.state = "committed".into();
        self.save_manifest(&directory, &manifest)
            .map_err(|e| e.applied(&manifest.change_id))?;
        Ok(outcome(&manifest, true))
    }
    /// Restore raw index bytes for an explicitly confirmed Git discard. Keep
    /// the same path leases, exact displaced bytes and conflict receipts as Undo.
    /// This does not change the UTF-8-only contract of normal editor saves.
    pub fn restore_git_bytes(
        &self,
        input: &str,
        bytes: &[u8],
        expected_sha256: Option<&str>,
    ) -> Result<Value, MutationError> {
        self.write_owned_bytes(input, bytes, expected_sha256, MAX_BINARY_BYTES)
    }

    /// Export an owned generated artifact through the same conflict/backup and
    /// directory-lease boundary. Large existing targets still require the
    /// established bounded backup contract; this never changes text saves.
    pub fn write_generated_bytes(
        &self,
        input: &str,
        bytes: &[u8],
        expected_sha256: Option<&str>,
    ) -> Result<Value, MutationError> {
        self.write_owned_bytes(input, bytes, expected_sha256, 64 * 1024 * 1024)
    }

    fn write_owned_bytes(
        &self,
        input: &str,
        bytes: &[u8],
        expected_sha256: Option<&str>,
        max_bytes: u64,
    ) -> Result<Value, MutationError> {
        let _operation = operation()?;
        if bytes.len() as u64 > max_bytes {
            return Err(MutationError::new(
                413,
                "backup_too_large",
                format!("Binary write exceeds the {max_bytes} byte mutation limit"),
            ));
        }
        let target = self.target(input, true)?;
        self.sensitive(&target, false)?;
        let _parents = DirectoryLeases::new(&self.primary, target.parent().unwrap())?;
        let before = self.snapshot_optional(&target)?;
        if before.is_some() && expected_sha256.is_none() {
            return Err(MutationError::new(
                409,
                "file_changed",
                "Target file already exists; its current version was preserved",
            ));
        }
        expected(before.as_ref().map(|s| s.sha.as_str()), expected_sha256)?;
        if before.is_none() && expected_sha256.is_some() {
            return Err(MutationError::new(
                409,
                "file_changed",
                "Target file disappeared before the write",
            ));
        }
        let after = hash(bytes);
        let (mut manifest, directory) = self.prepare(
            "write",
            &target,
            before.as_ref(),
            Some(after.clone()),
            Vec::new(),
        )?;
        let current = self.snapshot_optional(&target)?;
        if current.as_ref().map(|s| s.sha.as_str()) != before.as_ref().map(|s| s.sha.as_str()) {
            return Err(MutationError::new(
                409,
                "file_changed",
                "File changed while preparing the write; the new version was preserved",
            ));
        }
        self.restore_bytes(&target, bytes, current.as_ref(), &directory, &mut manifest)?;
        let final_version = self
            .snapshot_optional_with_limit(&target, max_bytes)
            .map_err(|e| e.applied(&manifest.change_id))?;
        if final_version.as_ref().map(|s| s.sha.as_str()) != Some(after.as_str()) {
            manifest.state = "applied-conflict".into();
            self.save_manifest(&directory, &manifest)
                .map_err(|e| e.applied(&manifest.change_id))?;
            return Err(MutationError::new(409,"file_changed_after_apply","File changed after the write; the external version was left in place and the original was backed up").applied(&manifest.change_id));
        }
        manifest.state = "committed".into();
        self.save_manifest(&directory, &manifest)
            .map_err(|e| e.applied(&manifest.change_id))?;
        Ok(outcome(&manifest, true))
    }
    pub fn mkdir(&self, input: &str) -> Result<Value, MutationError> {
        let _operation = operation()?;
        let candidate = self.candidate(input)?;
        self.sensitive(&candidate, false)?;
        let mut missing = Vec::new();
        let mut existing = candidate.clone();
        while !existing.exists() {
            missing.push(existing.clone());
            if missing.len() > 32 {
                return Err(MutationError::new(
                    413,
                    "directory_depth_limit",
                    "Directory creation exceeds 32 levels",
                ));
            }
            existing = existing
                .parent()
                .ok_or_else(|| {
                    MutationError::new(403, "path_outside_workspace", "Directory escapes workspace")
                })?
                .to_path_buf();
        }
        let existing = fs::canonicalize(&existing).map_err(io)?;
        self.inside(&existing)?;
        if !existing.is_dir() {
            return Err(MutationError::new(
                400,
                "not_directory",
                "Parent path is not a directory",
            ));
        }
        if missing.is_empty() {
            return Ok(json!({"ok":true,"path":display(&existing),"created":false}));
        }
        let _parents = DirectoryLeases::new(&self.primary, &existing)?;
        missing.reverse();
        let paths = missing.iter().map(|p| display(p)).collect();
        let (mut manifest, directory) = self.prepare("mkdir", &candidate, None, None, paths)?;
        let mut new_leases = Vec::new();
        let mut created = Vec::new();
        for path in missing {
            if let Err(error) = fs::create_dir(&path) {
                drop(new_leases);
                let mut rollback_incomplete = false;
                for created in created.iter().rev() {
                    if fs::remove_dir(created).is_err() {
                        rollback_incomplete = true;
                    }
                }
                if rollback_incomplete {
                    manifest.state = "applied-partial".into();
                    let _ = self.save_manifest(&directory, &manifest);
                    return Err(io(error).applied(&manifest.change_id));
                }
                return Err(io(error));
            }
            let canonical = fs::canonicalize(&path).map_err(io)?;
            self.inside(&canonical)?;
            new_leases.push(DirectoryLeases::new(&self.primary, &canonical)?);
            manifest
                .directory_ids
                .insert(display(&path), directory_id(&canonical)?);
            created.push(path);
        }
        manifest.state = "committed".into();
        self.save_manifest(&directory, &manifest)
            .map_err(|e| e.applied(&manifest.change_id))?;
        Ok(outcome(&manifest, true))
    }
    pub fn recycle_file(
        &self,
        input: &str,
        options: DeleteOptions,
    ) -> Result<Value, MutationError> {
        let _operation = operation()?;
        let target = self.target(input, false)?;
        self.sensitive(&target, options.allow_sensitive)?;
        if target.is_dir() {
            return Err(MutationError::new(
                400,
                "not_file",
                "Recycle only accepts regular files",
            ));
        }
        let _parents = DirectoryLeases::new(&self.primary, target.parent().unwrap())?;
        let before = self.snapshot(&target)?;
        expected(Some(&before.sha), options.expected_sha256.as_deref())?;
        let (mut manifest, directory) =
            self.prepare("delete", &target, Some(&before), None, Vec::new())?;
        delete_exact(&target, &self.primary, &before.sha)?;
        manifest.state = "committed".into();
        self.save_manifest(&directory, &manifest)
            .map_err(|e| e.applied(&manifest.change_id))?;
        Ok(outcome(&manifest, true))
    }
    pub fn restore(&self, change_id: &str) -> Result<Value, MutationError> {
        let _operation = operation()?;
        let id = Uuid::parse_str(change_id)
            .map_err(|_| MutationError::new(400, "invalid_change_id", "Change ID must be a UUID"))?
            .to_string();
        let directory = self.changes.join(&id);
        let canonical = fs::canonicalize(&directory).map_err(io)?;
        if !within(&canonical, &self.changes) {
            return Err(MutationError::new(
                403,
                "invalid_change_path",
                "Change history escaped application storage",
            ));
        }
        let file = directory.join("manifest.json");
        let mut input = File::open(&file).map_err(io)?;
        check_handle(&input, &canonical)?;
        let mut bytes = Vec::new();
        Read::by_ref(&mut input)
            .take(64 * 1024 + 1)
            .read_to_end(&mut bytes)
            .map_err(io)?;
        if bytes.len() > 64 * 1024 {
            return Err(MutationError::new(
                413,
                "invalid_manifest",
                "Change manifest exceeds its limit",
            ));
        }
        let mut manifest: Manifest = serde_json::from_slice(&bytes)
            .map_err(|e| MutationError::new(400, "invalid_manifest", e.to_string()))?;
        if manifest.version != 1
            || manifest.change_id != id
            || !same_path(Path::new(&manifest.workspace_root), &self.primary)
        {
            return Err(MutationError::new(
                403,
                "wrong_workspace_change",
                "Change does not belong to this workspace",
            ));
        }
        if manifest.state == "restored" {
            return Ok(outcome(&manifest, false));
        }
        if manifest.state == "applied-recovery-needed" {
            return Err(MutationError::new(
                409,
                "manual_recovery_required",
                format!(
                    "The exact displaced file is preserved at {}; automatic restore is unavailable",
                    manifest
                        .backup_path
                        .as_deref()
                        .unwrap_or("the recovery path")
                ),
            )
            .applied(&manifest.change_id));
        }
        let original = self.candidate(&manifest.original_path)?;
        if manifest.operation == "write"
            && original
                .parent()
                .map(|parent| {
                    parent
                        .join(format!(".gamecowork-before-{}.tmp", manifest.change_id))
                        .exists()
                })
                .unwrap_or(false)
        {
            return Err(MutationError::new(409,"manual_recovery_required","An exact displaced version is still awaiting recovery; automatic restore will not choose an older snapshot").applied(&manifest.change_id));
        }
        if manifest.operation == "mkdir" {
            let _parents = DirectoryLeases::new(&self.primary, &self.primary)?;
            for path in manifest.created_directories.iter().rev() {
                let candidate = self.candidate(path)?;
                if !candidate.exists() {
                    continue;
                }
                if fs::symlink_metadata(&candidate)
                    .map_err(io)?
                    .file_type()
                    .is_symlink()
                {
                    return Err(MutationError::new(
                        409,
                        "restore_conflict",
                        "Created directory was replaced with a link",
                    ));
                }
                let directory = self.target(path, false)?;
                if !directory.is_dir() {
                    return Err(MutationError::new(
                        409,
                        "restore_conflict",
                        "Created directory no longer exists as a directory",
                    ));
                }
                if manifest.directory_ids.get(path).map(String::as_str)
                    != Some(directory_id(&directory)?.as_str())
                {
                    return Err(MutationError::new(
                        409,
                        "restore_conflict",
                        "Created directory was replaced after the operation",
                    ));
                }
                for entry in fs::read_dir(&directory).map_err(io)? {
                    let entry = entry.map_err(io)?;
                    let is_created = entry.file_type().map_err(io)?.is_dir()
                        && manifest
                            .created_directories
                            .iter()
                            .any(|path| same_path(Path::new(path), &entry.path()));
                    if is_created {
                        continue;
                    }
                    return Err(MutationError::new(
                        409,
                        "restore_conflict",
                        "Directory contains later user files; it will not be removed",
                    ));
                }
            }
            for path in manifest.created_directories.iter().rev() {
                if self.candidate(path)?.exists() {
                    fs::remove_dir(self.target(path, false)?).map_err(io)?;
                }
            }
        } else {
            let target = self.target(&manifest.original_path, true)?;
            let _parents = DirectoryLeases::new(&self.primary, target.parent().unwrap())?;
            let current = self.snapshot_optional(&target)?;
            if current.as_ref().map(|v| v.sha.as_str()) != manifest.after_sha256.as_deref() {
                return Err(MutationError::new(
                    409,
                    "restore_conflict",
                    "File changed after this operation; restore would overwrite later user work",
                ));
            }
            if let Some(before_sha) = &manifest.before_sha256 {
                let backup = manifest.backup_path.as_ref().ok_or_else(|| {
                    MutationError::new(400, "invalid_manifest", "Backup path is missing")
                })?;
                let backup = fs::canonicalize(backup).map_err(io)?;
                if !within(&backup, &canonical) {
                    return Err(MutationError::new(
                        403,
                        "invalid_backup_path",
                        "Backup escaped its change directory",
                    ));
                }
                let bytes = read_limit(&backup)?;
                if hash(&bytes) != *before_sha {
                    return Err(MutationError::new(
                        409,
                        "backup_integrity_failed",
                        "Backup SHA-256 does not match its manifest",
                    ));
                }
                self.restore_bytes(&target, &bytes, current.as_ref(), &directory, &mut manifest)?;
            } else if let Some(current) = current {
                delete_exact(&target, &self.primary, &current.sha)?;
            }
        }
        manifest.state = "restored".into();
        self.save_manifest(&directory, &manifest)
            .map_err(|e| e.applied(&manifest.change_id))?;
        Ok(outcome(&manifest, true))
    }
    /// Preserve the exact version displaced by Undo. The SHA check before this
    /// operation is advisory: another process may save between it and ReplaceFileW.
    /// A conflict is therefore an applied, recoverable error, never a successful
    /// restore and never a blind rollback over a third external save.
    fn restore_bytes(
        &self,
        target: &Path,
        bytes: &[u8],
        current: Option<&Snapshot>,
        directory: &Path,
        manifest: &mut Manifest,
    ) -> Result<(), MutationError> {
        #[cfg(not(windows))]
        {
            let _ = (directory, manifest);
            write_atomic(target, bytes, current.is_some(), &self.primary)
        }
        #[cfg(windows)]
        {
            let parent = target.parent().ok_or_else(|| {
                MutationError::new(400, "invalid_file_path", "File parent missing")
            })?;
            let temp = parent.join(format!(".gamecowork-atomic-{}.tmp", Uuid::new_v4()));
            let displaced = parent.join(format!(".gamecowork-before-{}.tmp", manifest.change_id));
            let mut guard = TempFile::create(&temp, &self.primary)?;
            guard.write(bytes)?;
            #[cfg(test)]
            restore_pause(target, "before-replace");
            replace(&temp, target, current.is_some(), Some(&displaced)).map_err(io)?;
            guard.consumed = true;
            #[cfg(test)]
            restore_pause(target, "after-replace");
            if let Some(current) = current {
                let actual = match self.snapshot(&displaced) {
                    Ok(actual) => actual,
                    Err(error) => {
                        return Err(self.recovery_needed(directory, manifest, &displaced, error));
                    }
                };
                if actual.sha != current.sha {
                    return Err(self.recovery_needed(
                        directory,
                        manifest,
                        &displaced,
                        MutationError::new(
                            409,
                            "restore_conflict",
                            "File changed during Undo replacement; automatic recovery would risk overwriting another external save",
                        ),
                    ));
                }
                fs::remove_file(&displaced).map_err(|error| {
                    self.recovery_needed(directory, manifest, &displaced, io(error))
                })?;
            }
            Ok(())
        }
    }
    fn candidate(&self, input: &str) -> Result<PathBuf, MutationError> {
        let path = parse_path(input)?;
        if path.components().any(|c| matches!(c, Component::ParentDir)) {
            return Err(MutationError::new(
                403,
                "parent_path_disallowed",
                "Parent traversal is not allowed",
            ));
        }
        let path = if path.is_absolute() {
            path
        } else {
            self.primary.join(path)
        };
        self.inside(&path)?;
        Ok(path)
    }
    fn target(&self, input: &str, create: bool) -> Result<PathBuf, MutationError> {
        let candidate = self.candidate(input)?;
        match fs::symlink_metadata(&candidate) {
            Ok(_) => {
                let path = fs::canonicalize(candidate).map_err(io)?;
                self.inside(&path)?;
                Ok(path)
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound && create => {
                let name = candidate.file_name().ok_or_else(|| {
                    MutationError::new(400, "invalid_file_path", "File name is missing")
                })?;
                let parent = fs::canonicalize(candidate.parent().ok_or_else(|| {
                    MutationError::new(400, "invalid_file_path", "File parent is missing")
                })?)
                .map_err(io)?;
                self.inside(&parent)?;
                Ok(parent.join(name))
            }
            Err(error) => Err(io(error)),
        }
    }
    fn inside(&self, path: &Path) -> Result<(), MutationError> {
        if within(path, &self.primary) {
            Ok(())
        } else {
            Err(MutationError::new(
                403,
                "path_outside_workspace",
                "Writes are limited to the current workspace",
            ))
        }
    }
    fn sensitive(&self, path: &Path, allowed: bool) -> Result<(), MutationError> {
        if allowed {
            return Ok(());
        }
        let sensitive = path.components().any(|part| {
            let name = part.as_os_str().to_string_lossy().to_lowercase();
            matches!(
                name.as_str(),
                ".git"
                    | ".hg"
                    | ".svn"
                    | ".ssh"
                    | ".aws"
                    | ".docker"
                    | ".kube"
                    | ".git-credentials"
                    | ".npmrc"
                    | ".pypirc"
                    | ".netrc"
                    | "credentials"
                    | "credentials.json"
                    | "secrets.json"
                    | "id_rsa"
                    | "id_ed25519"
                    | "token.json"
            ) || ((name == ".env" || name.starts_with(".env."))
                && !matches!(
                    name.as_str(),
                    ".env.example" | ".env.sample" | ".env.template"
                ))
        });
        if sensitive {
            Err(MutationError::new(
                403,
                "sensitive_path_authorization_required",
                "Sensitive file mutation requires explicit authorization",
            ))
        } else {
            Ok(())
        }
    }
    fn snapshot_optional(&self, path: &Path) -> Result<Option<Snapshot>, MutationError> {
        match fs::symlink_metadata(path) {
            Ok(_) => self.snapshot(path).map(Some),
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(None),
            Err(error) => Err(io(error)),
        }
    }
    fn snapshot_optional_with_limit(
        &self,
        path: &Path,
        limit: u64,
    ) -> Result<Option<Snapshot>, MutationError> {
        match fs::symlink_metadata(path) {
            Ok(_) => {
                let actual = fs::canonicalize(path).map_err(io)?;
                self.inside(&actual)?;
                let mut options = OpenOptions::new();
                options.read(true);
                #[cfg(windows)]
                {
                    use std::os::windows::fs::OpenOptionsExt;
                    use windows_sys::Win32::Storage::FileSystem::{
                        FILE_SHARE_DELETE, FILE_SHARE_READ,
                    };
                    options.share_mode(FILE_SHARE_READ | FILE_SHARE_DELETE);
                }
                let mut file = options.open(&actual).map_err(io)?;
                check_handle(&file, &self.primary)?;
                let info = file.metadata().map_err(io)?;
                if !info.is_file() || info.len() > limit {
                    return Err(MutationError::new(
                        413,
                        "generated_asset_too_large",
                        "Generated output exceeds its verification limit",
                    ));
                }
                let mut bytes = Vec::new();
                file.take(limit + 1).read_to_end(&mut bytes).map_err(io)?;
                if bytes.len() as u64 > limit {
                    return Err(MutationError::new(
                        413,
                        "generated_asset_too_large",
                        "Generated output grew during verification",
                    ));
                }
                let sha = hash(&bytes);
                Ok(Some(Snapshot { bytes, sha }))
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(None),
            Err(error) => Err(io(error)),
        }
    }
    fn snapshot(&self, path: &Path) -> Result<Snapshot, MutationError> {
        let path = fs::canonicalize(path).map_err(io)?;
        self.inside(&path)?;
        if !path.is_file() {
            return Err(MutationError::new(
                400,
                "not_file",
                "Mutation target is not a regular file",
            ));
        }
        let bytes = read_limit_checked(&path, &self.primary)?;
        let sha = hash(&bytes);
        Ok(Snapshot { bytes, sha })
    }
    fn prepare(
        &self,
        kind: &str,
        path: &Path,
        before: Option<&Snapshot>,
        after: Option<String>,
        created_directories: Vec<String>,
    ) -> Result<(Manifest, PathBuf), MutationError> {
        let id = Uuid::new_v4().to_string();
        let directory = self.changes.join(&id);
        fs::create_dir(&directory).map_err(io)?;
        let _guard = DirectoryLeases::new(&self.changes, &directory)?;
        let backup = if let Some(snapshot) = before {
            let backup = directory.join("before.bin");
            write_atomic(&backup, &snapshot.bytes, false, &self.changes)?;
            Some(display(&backup))
        } else {
            None
        };
        let directory_ids = created_directories
            .iter()
            .map(|path| {
                (
                    path.clone(),
                    "pending-directory-identity-padding-000000000000".to_string(),
                )
            })
            .collect();
        let manifest = Manifest {
            version: 1,
            change_id: id,
            operation: kind.into(),
            state: "prepared".into(),
            workspace_root: display(&self.primary),
            original_path: display(path),
            before_sha256: before.map(|v| v.sha.clone()),
            after_sha256: after,
            backup_path: backup,
            created_directories,
            directory_ids,
            timestamp_ms: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis()
                .min(u64::MAX as u128) as u64,
        };
        self.save_manifest(&directory, &manifest)?;
        Ok((manifest, directory))
    }
    fn save_manifest(&self, directory: &Path, manifest: &Manifest) -> Result<(), MutationError> {
        let bytes = serde_json::to_vec_pretty(manifest)
            .map_err(|e| MutationError::new(500, "manifest_encode_failed", e.to_string()))?;
        if bytes.len() > 64 * 1024 {
            return Err(MutationError::new(
                413,
                "manifest_too_large",
                "Change manifest exceeds 64 KiB; use smaller operations",
            ));
        }
        write_atomic(
            &directory.join("manifest.json"),
            &bytes,
            true,
            &self.changes,
        )
    }
    fn recovery_needed(
        &self,
        directory: &Path,
        manifest: &mut Manifest,
        displaced: &Path,
        error: MutationError,
    ) -> MutationError {
        manifest.state = "applied-recovery-needed".into();
        manifest.backup_path = Some(display(displaced));
        manifest.before_sha256 = None;
        let _ = self.save_manifest(directory, manifest);
        MutationError::new(
            error.status,
            "recovery_file_preserved",
            format!(
                "{}; replacement has already occurred. The exact displaced file remains at {} and requires manual recovery. Change ID: {}",
                error.message,
                display(displaced),
                manifest.change_id
            ),
        )
        .applied(&manifest.change_id)
    }
}
struct Snapshot {
    bytes: Vec<u8>,
    sha: String,
}
// Test-only synchronization at the precise external-save windows. No production
// request, environment flag or runtime state can install these hooks.
#[cfg(all(test, windows))]
struct RestorePause {
    target: PathBuf,
    phase: &'static str,
    arrived: std::sync::mpsc::Sender<()>,
    resume: std::sync::mpsc::Receiver<()>,
}
#[cfg(all(test, windows))]
fn restore_pauses() -> &'static Mutex<Vec<RestorePause>> {
    static HOOKS: OnceLock<Mutex<Vec<RestorePause>>> = OnceLock::new();
    HOOKS.get_or_init(|| Mutex::new(Vec::new()))
}
#[cfg(all(test, windows))]
fn restore_pause(target: &Path, phase: &str) {
    let hook = {
        let mut hooks = restore_pauses().lock().unwrap();
        hooks
            .iter()
            .position(|hook| hook.phase == phase && same_path(&hook.target, target))
            .map(|index| hooks.remove(index))
    };
    if let Some(hook) = hook {
        hook.arrived.send(()).expect("Restore race test observer");
        hook.resume
            .recv_timeout(Duration::from_secs(10))
            .expect("Restore race test release");
    }
}
fn expected(actual: Option<&str>, expected: Option<&str>) -> Result<(), MutationError> {
    if let Some(expected) = expected {
        if expected.len() != 64 || !expected.bytes().all(|b| b.is_ascii_hexdigit()) {
            return Err(MutationError::new(
                400,
                "invalid_expected_sha256",
                "Expected SHA-256 must contain 64 hex digits",
            ));
        }
        if !actual.is_some_and(|actual| actual.eq_ignore_ascii_case(expected)) {
            return Err(MutationError::new(
                409,
                "file_changed",
                "Current file SHA-256 differs from the expected version",
            ));
        }
    }
    Ok(())
}
fn hash(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}
fn same_path(a: &Path, b: &Path) -> bool {
    within(a, b) && within(b, a)
}

#[cfg(windows)]
fn directory_id(path: &Path) -> Result<String, MutationError> {
    use std::os::windows::{fs::OpenOptionsExt, io::AsRawHandle};
    use windows_sys::Win32::Storage::FileSystem::{
        GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION, FILE_FLAG_BACKUP_SEMANTICS,
        FILE_READ_ATTRIBUTES, FILE_SHARE_READ, FILE_SHARE_WRITE,
    };
    let file = OpenOptions::new()
        .access_mode(FILE_READ_ATTRIBUTES)
        .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE)
        .custom_flags(FILE_FLAG_BACKUP_SEMANTICS)
        .open(path)
        .map_err(io)?;
    let mut info = BY_HANDLE_FILE_INFORMATION::default();
    if unsafe { GetFileInformationByHandle(file.as_raw_handle(), &mut info) } == 0 {
        return Err(io(std::io::Error::last_os_error()));
    }
    Ok(format!(
        "{:x}:{:x}:{:x}",
        info.dwVolumeSerialNumber, info.nFileIndexHigh, info.nFileIndexLow
    ))
}
#[cfg(unix)]
fn directory_id(path: &Path) -> Result<String, MutationError> {
    use std::os::unix::fs::MetadataExt;
    let meta = fs::metadata(path).map_err(io)?;
    Ok(format!("{}:{}", meta.dev(), meta.ino()))
}
#[cfg(not(any(windows, unix)))]
fn directory_id(path: &Path) -> Result<String, MutationError> {
    Ok(format!(
        "{}:{:?}",
        display(path),
        fs::metadata(path).map_err(io)?.created().map_err(io)?
    ))
}
fn outcome(manifest: &Manifest, applied: bool) -> Value {
    json!({"ok":true,"path":manifest.original_path,"changeId":manifest.change_id,"operation":manifest.operation,"state":manifest.state,"applied":applied,"beforeSha256":manifest.before_sha256,"afterSha256":manifest.after_sha256,"backupPath":manifest.backup_path})
}
fn read_limit(path: &Path) -> Result<Vec<u8>, MutationError> {
    let mut file = File::open(path).map_err(io)?;
    read_handle(&mut file)
}
fn read_limit_checked(path: &Path, boundary: &Path) -> Result<Vec<u8>, MutationError> {
    let mut options = OpenOptions::new();
    options.read(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        use windows_sys::Win32::Storage::FileSystem::{FILE_SHARE_DELETE, FILE_SHARE_READ};
        options.share_mode(FILE_SHARE_READ | FILE_SHARE_DELETE);
    }
    let mut file = options.open(path).map_err(io)?;
    check_handle(&file, boundary)?;
    read_handle(&mut file)
}
fn read_handle(file: &mut File) -> Result<Vec<u8>, MutationError> {
    let metadata = file.metadata().map_err(io)?;
    if !metadata.is_file() {
        return Err(MutationError::new(
            400,
            "not_file",
            "Mutation target is not a regular file",
        ));
    }
    if metadata.len() > MAX_BINARY_BYTES {
        return Err(MutationError::new(
            413,
            "backup_too_large",
            "Safe change backup exceeds 8 MiB",
        ));
    }
    let mut bytes = Vec::new();
    file.take(MAX_BINARY_BYTES + 1)
        .read_to_end(&mut bytes)
        .map_err(io)?;
    if bytes.len() as u64 > MAX_BINARY_BYTES {
        return Err(MutationError::new(
            413,
            "backup_too_large",
            "File grew beyond the safe backup limit",
        ));
    }
    Ok(bytes)
}
fn check_handle(file: &File, boundary: &Path) -> Result<(), MutationError> {
    #[cfg(windows)]
    {
        let actual = crate::files::opened_path(file)?;
        if !within(&actual, boundary) {
            return Err(MutationError::new(
                403,
                "handle_outside_workspace",
                "Opened handle escaped its authorized directory",
            ));
        }
    }
    #[cfg(not(windows))]
    {
        let _ = (file, boundary);
    }
    Ok(())
}
struct DirectoryLeases {
    _handles: Vec<File>,
}
impl DirectoryLeases {
    fn new(boundary: &Path, parent: &Path) -> Result<Self, MutationError> {
        let parent = fs::canonicalize(parent).map_err(io)?;
        if !within(&parent, boundary) {
            return Err(MutationError::new(
                403,
                "parent_outside_workspace",
                "Parent directory escaped its authorized root",
            ));
        }
        let mut paths = parent
            .ancestors()
            .take_while(|path| within(path, boundary))
            .map(Path::to_path_buf)
            .collect::<Vec<_>>();
        paths.reverse();
        let mut handles = Vec::new();
        for path in paths {
            #[cfg(windows)]
            {
                use std::os::windows::fs::OpenOptionsExt;
                use windows_sys::Win32::Storage::FileSystem::{
                    FILE_FLAG_BACKUP_SEMANTICS, FILE_READ_ATTRIBUTES, FILE_SHARE_READ,
                    FILE_SHARE_WRITE,
                };
                let file = OpenOptions::new()
                    .access_mode(FILE_READ_ATTRIBUTES)
                    .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE)
                    .custom_flags(FILE_FLAG_BACKUP_SEMANTICS)
                    .open(path)
                    .map_err(io)?;
                check_handle(&file, boundary)?;
                handles.push(file);
            }
            #[cfg(not(windows))]
            {
                let _ = path;
            }
        }
        Ok(Self { _handles: handles })
    }
}
struct TempFile {
    path: PathBuf,
    file: Option<File>,
    consumed: bool,
}
impl TempFile {
    fn create(path: &Path, boundary: &Path) -> Result<Self, MutationError> {
        let file = OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(path)
            .map_err(io)?;
        check_handle(&file, boundary)?;
        Ok(Self {
            path: path.into(),
            file: Some(file),
            consumed: false,
        })
    }
    fn write(&mut self, bytes: &[u8]) -> Result<(), MutationError> {
        let file = self.file.as_mut().unwrap();
        file.write_all(bytes)
            .and_then(|_| file.sync_all())
            .map_err(io)?;
        self.file.take();
        Ok(())
    }
}
impl Drop for TempFile {
    fn drop(&mut self) {
        self.file.take();
        if !self.consumed {
            let _ = fs::remove_file(&self.path);
        }
    }
}
fn write_atomic(
    path: &Path,
    bytes: &[u8],
    overwrite: bool,
    boundary: &Path,
) -> Result<(), MutationError> {
    let parent = path
        .parent()
        .ok_or_else(|| MutationError::new(400, "invalid_file_path", "File parent missing"))?;
    let _parents = DirectoryLeases::new(boundary, parent)?;
    let temp = parent.join(format!(".gamecowork-atomic-{}.tmp", Uuid::new_v4()));
    let mut guard = TempFile::create(&temp, boundary)?;
    guard.write(bytes)?;
    replace(&temp, path, overwrite && path.exists(), None).map_err(io)?;
    guard.consumed = true;
    Ok(())
}
#[cfg(windows)]
fn replace(from: &Path, to: &Path, overwrite: bool, backup: Option<&Path>) -> std::io::Result<()> {
    let _atomic_target = AtomicTarget::begin(to);
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::Storage::FileSystem::{
        MoveFileExW, ReplaceFileW, MOVEFILE_WRITE_THROUGH,
    };
    let from = from
        .as_os_str()
        .encode_wide()
        .chain(Some(0))
        .collect::<Vec<_>>();
    let to = to
        .as_os_str()
        .encode_wide()
        .chain(Some(0))
        .collect::<Vec<_>>();
    let backup = backup.map(|p| {
        p.as_os_str()
            .encode_wide()
            .chain(Some(0))
            .collect::<Vec<_>>()
    });
    let done = unsafe {
        if overwrite {
            ReplaceFileW(
                to.as_ptr(),
                from.as_ptr(),
                backup
                    .as_ref()
                    .map(|b| b.as_ptr())
                    .unwrap_or(std::ptr::null()),
                0,
                std::ptr::null_mut(),
                std::ptr::null_mut(),
            )
        } else {
            MoveFileExW(from.as_ptr(), to.as_ptr(), MOVEFILE_WRITE_THROUGH)
        }
    };
    if done == 0 {
        Err(std::io::Error::last_os_error())
    } else {
        Ok(())
    }
}
#[cfg(not(windows))]
fn replace(from: &Path, to: &Path, overwrite: bool, _backup: Option<&Path>) -> std::io::Result<()> {
    let _atomic_target = AtomicTarget::begin(to);
    if !overwrite && to.exists() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::AlreadyExists,
            "Target already exists",
        ));
    }
    fs::rename(from, to)
}
fn delete_exact(path: &Path, boundary: &Path, expected_sha: &str) -> Result<(), MutationError> {
    #[cfg(windows)]
    {
        use std::os::windows::{fs::OpenOptionsExt, io::AsRawHandle};
        use windows_sys::Win32::Storage::FileSystem::{
            FileDispositionInfo, SetFileInformationByHandle, DELETE, FILE_DISPOSITION_INFO,
            FILE_GENERIC_READ, FILE_SHARE_READ,
        };
        let mut file = OpenOptions::new()
            .access_mode(FILE_GENERIC_READ | DELETE)
            .share_mode(FILE_SHARE_READ)
            .open(path)
            .map_err(io)?;
        check_handle(&file, boundary)?;
        if hash(&read_handle(&mut file)?) != expected_sha {
            return Err(MutationError::new(
                409,
                "file_changed",
                "File changed before recycle",
            ));
        }
        let info = FILE_DISPOSITION_INFO { DeleteFile: true };
        if unsafe {
            SetFileInformationByHandle(
                file.as_raw_handle(),
                FileDispositionInfo,
                &info as *const _ as *const std::ffi::c_void,
                std::mem::size_of::<FILE_DISPOSITION_INFO>() as u32,
            )
        } == 0
        {
            return Err(io(std::io::Error::last_os_error()));
        }
        drop(file);
        Ok(())
    }
    #[cfg(not(windows))]
    {
        let bytes = read_limit_checked(path, boundary)?;
        if hash(&bytes) != expected_sha {
            return Err(MutationError::new(
                409,
                "file_changed",
                "File changed before recycle",
            ));
        }
        fs::remove_file(path).map_err(io)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    struct Fixture {
        base: PathBuf,
        root: PathBuf,
        project: PathBuf,
        changes: PathBuf,
        outside: PathBuf,
    }
    impl Fixture {
        fn new() -> Self {
            let base = PathBuf::from(r"F:\AI\AgentMake\temp\GameCowork\tests");
            let root = base.join(format!("mutations-{}", Uuid::new_v4()));
            let project = root.join("项目A");
            let changes = root.join("own-data/changes");
            let outside = root.join("outside");
            for dir in [&project, &outside] {
                fs::create_dir_all(dir).unwrap();
            }
            Self {
                base,
                root,
                project,
                changes,
                outside,
            }
        }
        fn mutations(&self) -> Mutations {
            Mutations::new(&self.project, &self.changes).unwrap()
        }
        fn write(&self, name: &str, bytes: &[u8]) -> PathBuf {
            let path = self.project.join(name);
            fs::create_dir_all(path.parent().unwrap()).unwrap();
            fs::write(&path, bytes).unwrap();
            path
        }
    }
    #[test]
    fn generated_large_asset_verifies_beyond_text_limit_and_refuses_unconfirmed_overwrite() {
        let f = Fixture::new();
        let m = f.mutations();
        let bytes = vec![0x57; 10 * 1024 * 1024];
        let result = m
            .write_generated_bytes("large-generated.webm", &bytes, None)
            .unwrap();
        assert_eq!(result["afterSha256"], hash(&bytes));
        assert_eq!(
            fs::read(f.project.join("large-generated.webm")).unwrap(),
            bytes
        );
        assert!(m
            .write_generated_bytes("large-generated.webm", &[1, 2, 3], None)
            .is_err());
        assert_eq!(
            fs::metadata(f.project.join("large-generated.webm"))
                .unwrap()
                .len(),
            10 * 1024 * 1024
        );
    }
    impl Drop for Fixture {
        fn drop(&mut self) {
            let root = fs::canonicalize(&self.root).unwrap();
            let base = fs::canonicalize(&self.base).unwrap();
            assert!(within(&root, &base) && root != base);
            assert!(self
                .root
                .file_name()
                .unwrap()
                .to_string_lossy()
                .starts_with("mutations-"));
            fs::remove_dir_all(root).unwrap();
        }
    }
    #[test]
    fn explicit_utf8_overwrite_has_exact_backup_and_reversible_manifest() {
        let f = Fixture::new();
        let path = f.write("中文.txt", b"old\r\n");
        let m = f.mutations();
        assert_eq!(
            m.write_text("中文.txt", "new", WriteOptions::default())
                .unwrap_err()
                .status(),
            409
        );
        let result = m
            .write_text(
                "中文.txt",
                "new",
                WriteOptions {
                    overwrite: true,
                    expected_sha256: Some(hash(b"old\r\n")),
                    ..Default::default()
                },
            )
            .unwrap();
        assert_eq!(fs::read(&path).unwrap(), b"new");
        assert_eq!(
            fs::read(result["backupPath"].as_str().unwrap()).unwrap(),
            b"old\r\n"
        );
        let restored = m.restore(result["changeId"].as_str().unwrap()).unwrap();
        assert_eq!(restored["state"], "restored");
        assert_eq!(fs::read(path).unwrap(), b"old\r\n");
    }
    #[test]
    fn create_new_and_undo_does_not_overwrite_later_user_work() {
        let f = Fixture::new();
        let m = f.mutations();
        let result = m
            .write_text("new.txt", "created", WriteOptions::default())
            .unwrap();
        fs::write(f.project.join("new.txt"), b"later user edit").unwrap();
        assert_eq!(
            m.restore(result["changeId"].as_str().unwrap())
                .unwrap_err()
                .status(),
            409
        );
        assert_eq!(
            fs::read(f.project.join("new.txt")).unwrap(),
            b"later user edit"
        );
        fs::write(f.project.join("new.txt"), b"created").unwrap();
        m.restore(result["changeId"].as_str().unwrap()).unwrap();
        assert!(!f.project.join("new.txt").exists());
    }
    #[test]
    fn stale_hash_sensitive_paths_and_external_targets_never_change_files() {
        let f = Fixture::new();
        let path = f.write("file.txt", b"current");
        let secret = f.write(".env", b"local fixture value");
        fs::write(f.outside.join("x.txt"), b"outside").unwrap();
        let m = f.mutations();
        assert_eq!(
            m.write_text(
                "file.txt",
                "replacement",
                WriteOptions {
                    overwrite: true,
                    expected_sha256: Some(hash(b"stale")),
                    ..Default::default()
                }
            )
            .unwrap_err()
            .status(),
            409
        );
        assert_eq!(
            m.write_text(
                ".env",
                "x",
                WriteOptions {
                    overwrite: true,
                    ..Default::default()
                }
            )
            .unwrap_err()
            .status(),
            403
        );
        for p in [
            "../outside/x.txt".to_string(),
            f.outside.join("x.txt").to_string_lossy().into_owned(),
            "file.txt:ads".to_string(),
        ] {
            assert_eq!(
                m.write_text(
                    &p,
                    "x",
                    WriteOptions {
                        overwrite: true,
                        ..Default::default()
                    }
                )
                .unwrap_err()
                .status(),
                403
            );
        }
        assert_eq!(fs::read(path).unwrap(), b"current");
        assert_eq!(fs::read(secret).unwrap(), b"local fixture value");
        assert!(m
            .write_text(".env.example", "placeholder", WriteOptions::default())
            .is_ok());
    }
    #[test]
    fn recycle_is_recoverable_and_directory_delete_is_rejected() {
        let f = Fixture::new();
        let path = f.write("asset.bin", &[0, 1, 254, 255]);
        let m = f.mutations();
        let result = m
            .recycle_file("asset.bin", DeleteOptions::default())
            .unwrap();
        assert!(!path.exists());
        assert_eq!(
            fs::read(result["backupPath"].as_str().unwrap()).unwrap(),
            [0, 1, 254, 255]
        );
        m.restore(result["changeId"].as_str().unwrap()).unwrap();
        assert_eq!(fs::read(path).unwrap(), [0, 1, 254, 255]);
        assert_eq!(
            m.recycle_file(".", DeleteOptions::default())
                .unwrap_err()
                .status(),
            400
        );
    }
    #[test]
    fn created_directories_undo_only_when_they_are_empty() {
        let f = Fixture::new();
        let m = f.mutations();
        let result = m.mkdir("nested/目录").unwrap();
        f.write("nested/目录/user.txt", b"keep");
        assert_eq!(
            m.restore(result["changeId"].as_str().unwrap())
                .unwrap_err()
                .status(),
            409
        );
        assert!(f.project.join("nested/目录/user.txt").exists());
        fs::remove_file(f.project.join("nested/目录/user.txt")).unwrap();
        m.restore(result["changeId"].as_str().unwrap()).unwrap();
        assert!(!f.project.join("nested").exists());
    }
    #[test]
    fn limits_and_backup_integrity_fail_without_false_success() {
        let f = Fixture::new();
        f.write("file.txt", b"old");
        let m = f.mutations();
        assert_eq!(
            m.write_text(
                "huge.txt",
                &"x".repeat(MAX_TEXT_BYTES as usize + 1),
                WriteOptions::default()
            )
            .unwrap_err()
            .status(),
            413
        );
        let result = m
            .write_text(
                "file.txt",
                "new",
                WriteOptions {
                    overwrite: true,
                    ..Default::default()
                },
            )
            .unwrap();
        fs::write(result["backupPath"].as_str().unwrap(), b"tampered").unwrap();
        assert_eq!(
            m.restore(result["changeId"].as_str().unwrap())
                .unwrap_err()
                .status(),
            409
        );
        assert_eq!(fs::read(f.project.join("file.txt")).unwrap(), b"new");
        assert!(m.restore("../../outside").is_err());
    }
    #[cfg(windows)]
    #[test]
    fn junction_parent_escape_is_blocked_before_write() {
        use std::os::windows::process::CommandExt;
        let f = Fixture::new();
        let link = f.project.join("escape");
        assert!(std::process::Command::new("cmd.exe")
            .args(["/c", "mklink", "/J"])
            .arg(&link)
            .arg(&f.outside)
            .creation_flags(0x08000000)
            .stdout(std::process::Stdio::null())
            .status()
            .unwrap()
            .success());
        let m = f.mutations();
        assert_eq!(
            m.write_text("escape/new.txt", "x", WriteOptions::default())
                .unwrap_err()
                .status(),
            403
        );
        assert!(!f.outside.join("new.txt").exists());
    }
    #[test]
    fn construction_does_not_modify_workspace_and_existing_backup_record_is_never_reused() {
        let f = Fixture::new();
        f.write("file.txt", b"old");
        let before = fs::read_dir(&f.project).unwrap().count();
        let m = f.mutations();
        assert_eq!(fs::read_dir(&f.project).unwrap().count(), before);
        let first = m.write_text("a.txt", "a", WriteOptions::default()).unwrap();
        let second = m.write_text("b.txt", "b", WriteOptions::default()).unwrap();
        assert_ne!(first["changeId"], second["changeId"]);
        assert_eq!(first["afterSha256"], hash(b"a"));
    }

    #[test]
    fn replaced_empty_directory_is_not_removed_by_undo() {
        let f = Fixture::new();
        let m = f.mutations();
        let result = m.mkdir("created").unwrap();
        fs::rename(
            f.project.join("created"),
            f.project.join("original-created"),
        )
        .unwrap();
        fs::create_dir(f.project.join("created")).unwrap();
        assert_eq!(
            m.restore(result["changeId"].as_str().unwrap())
                .unwrap_err()
                .status(),
            409
        );
        assert!(f.project.join("created").is_dir());
        assert!(f.project.join("original-created").is_dir());
    }

    #[test]
    fn backup_overlap_and_cross_workspace_restore_are_rejected_without_workspace_changes() {
        let f = Fixture::new();
        let invalid = f.project.join("new-data/changes");
        assert!(Mutations::new(&f.project, &invalid).is_err());
        assert!(!f.project.join("new-data").exists());
        let m = f.mutations();
        let result = m
            .write_text("file.txt", "new", WriteOptions::default())
            .unwrap();
        let other = Mutations::new(&f.outside, &f.changes).unwrap();
        assert_eq!(
            other
                .restore(result["changeId"].as_str().unwrap())
                .unwrap_err()
                .status(),
            403
        );
        assert_eq!(fs::read(f.project.join("file.txt")).unwrap(), b"new");
    }

    #[test]
    fn edit_validation_is_scoped_text_only_and_does_not_create_change_records() {
        let f = Fixture::new();
        let path = f.write("text.txt", b"editable");
        f.write("binary.bin", &[0, 1, 2]);
        f.write(".env", b"fixture secret");
        f.write(".git-credentials", b"fixture credential placeholder");
        fs::write(f.outside.join("other.txt"), b"other workspace").unwrap();
        let m = f.mutations();
        let before = fs::read_dir(&f.changes).unwrap().count();
        assert!(m.can_edit("text.txt").unwrap());
        assert!(!m.can_edit("binary.bin").unwrap());
        assert!(!m.can_edit(".env").unwrap());
        assert!(!m.can_edit(".git-credentials").unwrap());
        assert!(!m
            .can_edit(f.outside.join("other.txt").to_str().unwrap())
            .unwrap());
        assert!(!m.can_edit("missing.txt").unwrap());
        let original = fs::metadata(&path).unwrap().permissions();
        let mut readonly = original.clone();
        readonly.set_readonly(true);
        fs::set_permissions(&path, readonly).unwrap();
        assert!(!m.can_edit("text.txt").unwrap());
        fs::set_permissions(&path, original).unwrap();
        assert_eq!(fs::read_dir(&f.changes).unwrap().count(), before);
        assert_eq!(fs::read(path).unwrap(), b"editable");
    }

    #[test]
    fn undo_restores_original_utf16_bytes_including_bom_and_line_endings() {
        let f = Fixture::new();
        let mut original = vec![0xff, 0xfe];
        original.extend("原始\r\n".encode_utf16().flat_map(u16::to_le_bytes));
        let path = f.write("utf16.txt", &original);
        let m = f.mutations();
        let result = m
            .write_text(
                "utf16.txt",
                "new UTF-8 content",
                WriteOptions {
                    overwrite: true,
                    expected_sha256: Some(hash(&original)),
                    ..Default::default()
                },
            )
            .unwrap();
        let restored = m.restore(result["changeId"].as_str().unwrap()).unwrap();
        assert_eq!(restored["state"], "restored");
        assert_eq!(fs::read(&path).unwrap(), original);
        assert_eq!(
            fs::read(result["backupPath"].as_str().unwrap()).unwrap(),
            original
        );
    }

    #[cfg(windows)]
    fn pause_next_restore(
        target: &Path,
        phase: &'static str,
    ) -> (std::sync::mpsc::Receiver<()>, std::sync::mpsc::Sender<()>) {
        let (arrived, observer) = std::sync::mpsc::channel();
        let (resume, release) = std::sync::mpsc::channel();
        restore_pauses().lock().unwrap().push(RestorePause {
            target: target.to_path_buf(),
            phase,
            arrived,
            resume: release,
        });
        (observer, resume)
    }

    #[cfg(windows)]
    #[test]
    fn git_discard_race_preserves_exact_second_save_and_never_overwrites_third_save() {
        let f = Fixture::new();
        let path = f.write("git-race.bin", &[0, 1, 255]);
        let m = f.mutations();
        let target = path.canonicalize().unwrap();
        let (before, continue_before) = pause_next_restore(&target, "before-replace");
        let (after, continue_after) = pause_next_restore(&target, "after-replace");
        let worker = std::thread::spawn(move || {
            m.restore_git_bytes("git-race.bin", &[0, 2, 254], Some(&hash(&[0, 1, 255])))
        });
        before.recv_timeout(Duration::from_secs(10)).unwrap();
        let second = [0, 3, 253];
        fs::write(&path, second).unwrap();
        continue_before.send(()).unwrap();
        after.recv_timeout(Duration::from_secs(10)).unwrap();
        let third = [0, 4, 252];
        fs::write(&path, third).unwrap();
        continue_after.send(()).unwrap();
        let error = worker.join().unwrap().unwrap_err();
        assert_eq!(error.status(), 409);
        assert_eq!(error.json()["applied"], true);
        assert_eq!(fs::read(&path).unwrap(), third);
        let id = error.json()["changeId"].as_str().unwrap().to_owned();
        let record: Value =
            serde_json::from_slice(&fs::read(f.changes.join(&id).join("manifest.json")).unwrap())
                .unwrap();
        assert_eq!(record["state"], "applied-recovery-needed");
        assert_eq!(
            fs::read(record["backupPath"].as_str().unwrap()).unwrap(),
            second
        );
        assert_eq!(
            fs::read(f.changes.join(&id).join("before.bin")).unwrap(),
            [0, 1, 255]
        );
        assert_eq!(
            f.mutations().restore(&id).unwrap_err().json()["code"],
            "manual_recovery_required"
        );
        assert_eq!(fs::read(&path).unwrap(), third);
    }
    #[test]
    fn git_restore_rejects_stale_sha_and_newly_created_file_and_preserves_binary_backup() {
        let f = Fixture::new();
        let path = f.write("git.bin", &[0, 1, 255]);
        let m = f.mutations();
        assert_eq!(
            m.restore_git_bytes("git.bin", &[0, 2, 254], Some(&hash(b"older version")))
                .unwrap_err()
                .status(),
            409
        );
        assert_eq!(fs::read(&path).unwrap(), [0, 1, 255]);
        assert_eq!(
            m.restore_git_bytes("git.bin", &[0, 2, 254], None)
                .unwrap_err()
                .status(),
            409
        );
        assert_eq!(fs::read(&path).unwrap(), [0, 1, 255]);
        let result = m
            .restore_git_bytes("git.bin", &[0, 2, 254], Some(&hash(&[0, 1, 255])))
            .unwrap();
        assert_eq!(fs::read(&path).unwrap(), [0, 2, 254]);
        assert_eq!(
            fs::read(result["backupPath"].as_str().unwrap()).unwrap(),
            [0, 1, 255]
        );
        m.restore(result["changeId"].as_str().unwrap()).unwrap();
        assert_eq!(fs::read(&path).unwrap(), [0, 1, 255]);
    }
    #[cfg(windows)]
    #[test]
    fn undo_race_preserves_exact_second_save_and_never_rolls_back_over_third_save() {
        let f = Fixture::new();
        let path = f.write("race.txt", b"original bytes\r\n");
        let m = f.mutations();
        let result = m
            .write_text(
                "race.txt",
                "application saved version",
                WriteOptions {
                    overwrite: true,
                    ..Default::default()
                },
            )
            .unwrap();
        let id = result["changeId"].as_str().unwrap().to_owned();
        let target = path.canonicalize().unwrap();
        let (before, continue_before) = pause_next_restore(&target, "before-replace");
        let (after, continue_after) = pause_next_restore(&target, "after-replace");
        let own_id = id.clone();
        let worker = std::thread::spawn(move || m.restore(&own_id));
        before.recv_timeout(Duration::from_secs(10)).unwrap();
        let second = [0xff, 0xfe, b'B', 0, b'\r', 0, b'\n', 0];
        fs::write(&path, second).unwrap();
        continue_before.send(()).unwrap();
        after.recv_timeout(Duration::from_secs(10)).unwrap();
        let third = b"third external save must survive";
        fs::write(&path, third).unwrap();
        continue_after.send(()).unwrap();
        let error = worker.join().unwrap().unwrap_err();
        assert_eq!(error.status(), 409);
        assert_eq!(error.json()["applied"], true);
        assert_eq!(error.json()["changeId"], id);
        assert!(error
            .to_string()
            .contains("replacement has already occurred"));
        assert!(error.to_string().contains(&id));
        assert_eq!(fs::read(&path).unwrap(), third);
        let record: Value =
            serde_json::from_slice(&fs::read(f.changes.join(&id).join("manifest.json")).unwrap())
                .unwrap();
        assert_eq!(record["state"], "applied-recovery-needed");
        assert_eq!(
            fs::read(record["backupPath"].as_str().unwrap()).unwrap(),
            second
        );
        assert_eq!(
            fs::read(f.changes.join(&id).join("before.bin")).unwrap(),
            b"original bytes\r\n"
        );
        let retry = f.mutations().restore(&id).unwrap_err();
        assert_eq!(retry.json()["code"], "manual_recovery_required");
        assert_eq!(fs::read(&path).unwrap(), third);
    }

    #[cfg(windows)]
    #[test]
    fn undo_recycled_file_does_not_overwrite_a_file_created_after_the_absence_check() {
        let f = Fixture::new();
        let path = f.write("recreated.bin", &[0, 255, 1]);
        let m = f.mutations();
        let result = m
            .recycle_file("recreated.bin", DeleteOptions::default())
            .unwrap();
        assert!(!path.exists());
        let target = f.project.canonicalize().unwrap().join("recreated.bin");
        let (before, release) = pause_next_restore(&target, "before-replace");
        let id = result["changeId"].as_str().unwrap().to_owned();
        let worker = std::thread::spawn(move || m.restore(&id));
        before.recv_timeout(Duration::from_secs(10)).unwrap();
        fs::write(&path, b"new external file").unwrap();
        release.send(()).unwrap();
        let error = worker.join().unwrap().unwrap_err();
        assert_eq!(error.json()["applied"], false);
        assert_eq!(fs::read(&path).unwrap(), b"new external file");
        assert_eq!(
            fs::read(result["backupPath"].as_str().unwrap()).unwrap(),
            [0, 255, 1]
        );
    }
}
