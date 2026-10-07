//! Bounded, read-only filesystem services. The host supplies authorized roots;
//! a client-supplied workspace path never grants access by itself.
use regex::{Regex, RegexBuilder};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, File, Metadata},
    io::{Read, Seek, SeekFrom},
    path::{Component, Path, PathBuf},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};

pub const MAX_TEXT_BYTES: u64 = 2 * 1024 * 1024;
pub const MAX_BINARY_BYTES: u64 = 8 * 1024 * 1024;
const MAX_DIRECTORY_ENTRIES: usize = 10_000;
const MAX_SEARCH_RESULTS: usize = 2_000;
const MAX_SEARCH_BYTES: u64 = 32 * 1024 * 1024;
const MAX_SEARCH_DEPTH: usize = 16;
const IGNORED_DIRECTORIES: &[&str] = &[
    ".git",
    "node_modules",
    "Library",
    "Temp",
    "Logs",
    "obj",
    "bin",
    ".next",
    "target",
    ".cache",
    "dist",
    "build",
];

#[derive(Clone, Debug)]
pub struct FileError {
    code: &'static str,
    message: String,
    status: u16,
}
impl FileError {
    fn new(status: u16, code: &'static str, message: impl Into<String>) -> Self {
        Self {
            status,
            code,
            message: message.into(),
        }
    }
    pub fn status(&self) -> u16 {
        self.status
    }
    pub fn json(&self) -> Value {
        json!({"error":self.message,"code":self.code})
    }
}
impl std::fmt::Display for FileError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}
impl std::error::Error for FileError {}
fn io_error(error: std::io::Error) -> FileError {
    let (status, code) = match error.kind() {
        std::io::ErrorKind::NotFound => (404, "path_not_found"),
        std::io::ErrorKind::PermissionDenied => (403, "file_access_denied"),
        _ => (500, "file_io_error"),
    };
    FileError::new(status, code, error.to_string())
}

#[derive(Clone)]
pub struct Files {
    primary: PathBuf,
    allowed: Vec<PathBuf>,
}
impl Files {
    pub fn new(primary: &Path, allowed: &[PathBuf]) -> Result<Self, FileError> {
        let primary = fs::canonicalize(primary).map_err(io_error)?;
        if !primary.is_dir() {
            return Err(FileError::new(
                400,
                "not_directory",
                "Workspace root is not a directory",
            ));
        }
        let mut roots = Vec::new();
        for root in allowed {
            let root = match fs::canonicalize(root) {
                Ok(root) => root,
                Err(error) if error.kind() == std::io::ErrorKind::NotFound => continue,
                Err(error) => return Err(io_error(error)),
            };
            if !root.is_dir() {
                return Err(FileError::new(
                    400,
                    "not_directory",
                    "Allowed root is not a directory",
                ));
            }
            roots.push(root);
        }
        if !roots.iter().any(|root| within(&primary, root)) {
            return Err(denied());
        }
        Ok(Self {
            primary,
            allowed: roots,
        })
    }
    pub fn explorer(&self, request: &Value) -> Result<Value, FileError> {
        let path = request["path"].as_str().unwrap_or(".");
        match request["mode"].as_str().unwrap_or("list") {
            "list" => self.list(
                path,
                number(request, "offset", 0, usize::MAX)?,
                number(request, "limit", 1000, MAX_DIRECTORY_ENTRIES)?,
            ),
            "file" => self.preview(path).map(|file| json!({"file":file})),
            "search-files" | "search" => self.search(request),
            "save" | "delete" | "rename" | "create" => Err(FileError::new(
                405,
                "read_only",
                "Local file browsing is read-only",
            )),
            _ => Err(FileError::new(
                400,
                "unsupported_file_mode",
                "Unsupported file explorer mode",
            )),
        }
    }
    pub fn local_content(&self, path: &str) -> Result<Value, FileError> {
        let (mut file, metadata, canonical) = self.open(path)?;
        let bytes = read_bounded(&mut file, &metadata, MAX_BINARY_BYTES)?;
        let mime = mime(&canonical);
        Ok(
            json!({"content":format!("data:{mime};base64,{}",base64(&bytes)),"filename":canonical.file_name().unwrap_or_default().to_string_lossy(),"mimeType":mime,"size":bytes.len()}),
        )
    }
    pub fn read_file(&self, path: &str, encoding: &str) -> Result<String, FileError> {
        let (mut file, metadata, _) = self.open(path)?;
        match encoding {
            "base64" => {
                read_bounded(&mut file, &metadata, MAX_BINARY_BYTES).map(|bytes| base64(&bytes))
            }
            "" | "utf8" | "utf-8" => {
                decode_text(&read_bounded(&mut file, &metadata, MAX_TEXT_BYTES)?)
            }
            _ => Err(FileError::new(
                400,
                "unsupported_encoding",
                "Only UTF-8 text and base64 reads are supported",
            )),
        }
    }
    pub fn read_range(&self, path: &str, range: &Value) -> Result<String, FileError> {
        let text = self.read_file(path, "utf8")?;
        let start = position(&range["start"])?;
        let end = position(&range["end"])?;
        if end < start {
            return Err(FileError::new(
                400,
                "invalid_range",
                "Range end precedes its start",
            ));
        }
        let a = text_offset(&text, start)?;
        let b = text_offset(&text, end)?;
        Ok(text[a..b].to_string())
    }
    /// Native listDir returns [name, fileType] tuples (1=file, 2=directory).
    pub fn list_dir(&self, path: &str) -> Result<Value, FileError> {
        let listing = self.list(path, 0, MAX_DIRECTORY_ENTRIES)?;
        if listing["directory"]["truncated"].as_bool() == Some(true) {
            return Err(FileError::new(
                413,
                "directory_limit",
                "Directory exceeds the local enumeration limit; use the paginated explorer API",
            ));
        }
        Ok(json!(listing["directory"]["entries"]
            .as_array()
            .unwrap()
            .iter()
            .map(|entry| json!([
                entry["name"],
                if entry["kind"] == "directory" { 2 } else { 1 }
            ]))
            .collect::<Vec<_>>()))
    }
    pub fn file_stats(&self, paths: &[String]) -> Result<Value, FileError> {
        if paths.len() > 1000 {
            return Err(FileError::new(
                413,
                "stats_limit",
                "Too many files requested",
            ));
        }
        let mut out = serde_json::Map::new();
        for path in paths {
            let (_, metadata, _) = match self.open(path) {
                Ok(file) => file,
                Err(error)
                    if matches!(error.code, "path_not_found" | "path_outside_allowed_roots") =>
                {
                    continue
                }
                Err(error) => return Err(error),
            };
            out.insert(
                path.clone(),
                json!({"size":metadata.len(),"lastModified":modified_ms(&metadata)}),
            );
        }
        Ok(Value::Object(out))
    }
    pub fn file_exists(&self, path: &str) -> Result<bool, FileError> {
        match self.resolve(path) {
            Ok(_) => Ok(true),
            Err(error) if matches!(error.code, "path_not_found" | "path_outside_allowed_roots") => {
                Ok(false)
            }
            Err(error) => Err(error),
        }
    }
    pub fn git_root(&self, path: &str) -> Result<Option<String>, FileError> {
        let mut directory = self.resolve(path)?;
        if !within(&directory, &self.primary) {
            return Err(denied());
        }
        if directory.is_file() {
            directory = directory.parent().ok_or_else(denied)?.to_path_buf();
        }
        loop {
            if self.file_exists(directory.join(".git").to_string_lossy().as_ref())? {
                return Ok(Some(display(&directory)));
            }
            if directory == self.primary {
                return Ok(None);
            }
            directory = directory.parent().ok_or_else(denied)?.to_path_buf();
            if !within(&directory, &self.primary) {
                return Ok(None);
            }
        }
    }
    pub fn git_repositories(&self, path: &str) -> Result<Value, FileError> {
        let start = self.resolve(path)?;
        if !start.is_dir() || !within(&start, &self.primary) {
            return Err(denied());
        }
        let began = Instant::now();
        let mut queue = vec![(start, 0)];
        let mut rows = vec![];
        let mut scanned = 0;
        while let Some((directory, depth)) = queue.pop() {
            if began.elapsed() > Duration::from_secs(2) || scanned > 10_000 || depth > 16 {
                return Err(FileError::new(
                    413,
                    "repository_scan_limit",
                    "Git discovery exceeded its local scan limit",
                ));
            }
            if self.file_exists(directory.join(".git").to_string_lossy().as_ref())? {
                rows.push(json!({"relativePath":self.client_path(&directory),"repoDir":display(&directory),"label":directory.file_name().unwrap_or_default().to_string_lossy(),"workspacePrefix":""}));
            }
            let listing = self.list(
                directory.to_string_lossy().as_ref(),
                0,
                MAX_DIRECTORY_ENTRIES,
            )?;
            if listing["directory"]["truncated"] == true {
                return Err(FileError::new(
                    413,
                    "repository_scan_limit",
                    "Directory exceeds the repository discovery limit",
                ));
            }
            for entry in listing["directory"]["entries"].as_array().unwrap() {
                scanned += 1;
                if entry["kind"] != "directory" {
                    continue;
                }
                let name = entry["name"].as_str().unwrap_or("");
                if IGNORED_DIRECTORIES.contains(&name) {
                    continue;
                }
                let path = self.resolve(directory.join(name).to_string_lossy().as_ref())?;
                if within(&path, &self.primary) {
                    queue.push((path, depth + 1));
                }
            }
        }
        rows.sort_by(|a, b| a["repoDir"].as_str().cmp(&b["repoDir"].as_str()));
        Ok(json!(rows))
    }
    /// Validated media bytes for a host route; never interpret these as text.
    pub fn media(&self, path: &str) -> Result<(Vec<u8>, String), FileError> {
        let (mut file, metadata, canonical) = self.open(path)?;
        Ok((
            read_bounded(&mut file, &metadata, MAX_BINARY_BYTES)?,
            mime(&canonical).to_string(),
        ))
    }
    /// NDJSON records expected by /file-explorer/search-stream (not SSE).
    pub fn search_records(&self, request: &Value) -> Result<Vec<Value>, FileError> {
        let result = self.search(request)?;
        let mut records = result["searchResults"]
            .as_array()
            .unwrap()
            .iter()
            .map(|result| json!({"type":"match","result":result}))
            .collect::<Vec<_>>();
        records.push(json!({"type":"summary","summary":result["searchSummary"]}));
        Ok(records)
    }
    fn resolve(&self, input: &str) -> Result<PathBuf, FileError> {
        let parsed = parse_path(input)?;
        if parsed
            .components()
            .any(|component| matches!(component, Component::ParentDir))
        {
            return Err(FileError::new(
                403,
                "parent_path_disallowed",
                "Parent-directory traversal is not allowed",
            ));
        }
        let candidate = if parsed.is_absolute() {
            parsed
        } else {
            self.primary.join(parsed)
        };
        // Reject lexically unauthorized paths even when they do not exist.
        if !self.allowed.iter().any(|root| within(&candidate, root)) {
            return Err(denied());
        }
        let canonical = fs::canonicalize(candidate).map_err(io_error)?;
        if !self.allowed.iter().any(|root| within(&canonical, root)) {
            return Err(denied());
        }
        Ok(canonical)
    }
    fn open(&self, input: &str) -> Result<(File, Metadata, PathBuf), FileError> {
        let canonical = self.resolve(input)?;
        if canonical.is_dir() {
            return Err(FileError::new(
                400,
                "not_file",
                "Requested path is not a regular file",
            ));
        }
        let file = File::open(&canonical).map_err(io_error)?;
        #[cfg(windows)]
        {
            let actual = opened_path(&file)?;
            if !self.allowed.iter().any(|root| within(&actual, root)) {
                return Err(denied());
            }
        }
        let metadata = file.metadata().map_err(io_error)?;
        if !metadata.is_file() {
            return Err(FileError::new(
                400,
                "not_file",
                "Requested path is not a regular file",
            ));
        }
        Ok((file, metadata, canonical))
    }
    fn client_path(&self, path: &Path) -> String {
        if within(path, &self.primary) {
            let relative: PathBuf = path
                .components()
                .skip(self.primary.components().count())
                .collect();
            if relative.as_os_str().is_empty() {
                ".".into()
            } else {
                display(&relative)
            }
        } else {
            display(path)
        }
    }
    fn list(&self, input: &str, offset: usize, limit: usize) -> Result<Value, FileError> {
        if limit == 0 {
            return Err(FileError::new(
                400,
                "invalid_limit",
                "Directory page limit must be positive",
            ));
        }
        let canonical = self.resolve(input)?;
        if !canonical.is_dir() {
            return Err(FileError::new(
                400,
                "not_directory",
                "Requested path is not a directory",
            ));
        }
        let mut entries = Vec::new();
        let mut truncated = false;
        let mut skipped = 0;
        for entry in fs::read_dir(&canonical).map_err(io_error)? {
            let entry = entry.map_err(io_error)?;
            if entries.len() + skipped >= MAX_DIRECTORY_ENTRIES {
                truncated = true;
                break;
            }
            let resolved = match fs::canonicalize(entry.path()) {
                Ok(path) => path,
                Err(_) => {
                    skipped += 1;
                    continue;
                }
            };
            if !self.allowed.iter().any(|root| within(&resolved, root)) {
                skipped += 1;
                continue;
            }
            let metadata = match fs::metadata(&resolved) {
                Ok(m) => m,
                Err(_) => {
                    skipped += 1;
                    continue;
                }
            };
            if !metadata.is_file() && !metadata.is_dir() {
                skipped += 1;
                continue;
            }
            entries.push(json!({"name":entry.file_name().to_string_lossy(),"path":self.client_path(&entry.path()),
                "kind":if metadata.is_dir(){"directory"}else{"file"},"size":metadata.len(),"modifiedAt":modified(&metadata)}));
        }
        entries.sort_by(|a, b| {
            (a["kind"] != "directory")
                .cmp(&(b["kind"] != "directory"))
                .then_with(|| {
                    a["name"]
                        .as_str()
                        .unwrap()
                        .to_lowercase()
                        .cmp(&b["name"].as_str().unwrap().to_lowercase())
                })
        });
        let total = entries.len();
        let page = entries
            .into_iter()
            .skip(offset)
            .take(limit)
            .collect::<Vec<_>>();
        Ok(
            json!({"directory":{"path":self.client_path(&canonical),"entries":page,"offset":offset,"limit":limit,"total":total,
            "hasMore":offset.saturating_add(limit)<total,"truncated":truncated,"skippedEntries":skipped}}),
        )
    }
    fn preview(&self, input: &str) -> Result<Value, FileError> {
        let (mut file, metadata, canonical) = self.open(input)?;
        let mut text_sha256: Option<String> = None;
        let extension = canonical
            .extension()
            .and_then(|v| v.to_str())
            .unwrap_or("")
            .to_lowercase();
        let mime = mime(&canonical);
        let (kind, encoding, content) = if matches!(
            extension.as_str(),
            "png" | "jpg" | "jpeg" | "gif" | "webp" | "bmp" | "ico" | "svg"
        ) {
            (
                "image",
                "base64",
                Some(base64(&read_bounded(
                    &mut file,
                    &metadata,
                    MAX_BINARY_BYTES,
                )?)),
            )
        } else if extension == "glb" {
            (
                "model",
                "base64",
                Some(base64(&read_bounded(
                    &mut file,
                    &metadata,
                    MAX_BINARY_BYTES,
                )?)),
            )
        } else if matches!(extension.as_str(), "mp4" | "webm" | "mov" | "avi") {
            ("video", "none", None)
        } else if matches!(extension.as_str(), "mp3" | "wav" | "ogg" | "flac" | "m4a") {
            ("audio", "none", None)
        } else {
            let mut prefix = vec![0; 4096];
            let n = file.read(&mut prefix).map_err(io_error)?;
            prefix.truncate(n);
            file.seek(SeekFrom::Start(0)).map_err(io_error)?;
            if binary_prefix(&prefix) {
                ("binary", "none", None)
            } else {
                let bytes = read_bounded(&mut file, &metadata, MAX_TEXT_BYTES)?;
                text_sha256 = Some(format!("{:x}", Sha256::digest(&bytes)));
                match decode_text(&bytes) {
                    Ok(text) => (
                        if extension == "gltf" { "model" } else { "text" },
                        "utf8",
                        Some(text),
                    ),
                    Err(error)
                        if error.code == "binary_text_unsupported"
                            || error.code == "invalid_text_encoding" =>
                    {
                        ("binary", "none", None)
                    }
                    Err(error) => return Err(error),
                }
            }
        };
        Ok(
            json!({"path":self.client_path(&canonical),"kind":kind,"encoding":encoding,"content":content,"mimeType":mime,"size":metadata.len(),"modifiedAt":modified(&metadata),"sha256":text_sha256,"readOnly":true}),
        )
    }
    fn search(&self, request: &Value) -> Result<Value, FileError> {
        let query = request["query"]
            .as_str()
            .ok_or_else(|| FileError::new(400, "query_required", "Search query is required"))?;
        if query.len() > 512 {
            return Err(FileError::new(
                400,
                "query_too_long",
                "Search query exceeds 512 bytes",
            ));
        }
        let names_only = request["mode"] == "search-files";
        if !names_only && query.is_empty() {
            return Err(FileError::new(
                400,
                "query_required",
                "Content search query must not be empty",
            ));
        }
        let limit = number(request, "maxResults", 100, MAX_SEARCH_RESULTS)?;
        if limit == 0 {
            return Err(FileError::new(
                400,
                "invalid_limit",
                "Search result limit must be positive",
            ));
        }
        let options = &request["options"];
        let pattern = if options["useRegularExpression"].as_bool() == Some(true) {
            query.to_string()
        } else {
            regex::escape(query)
        };
        let expression = RegexBuilder::new(&pattern)
            .case_insensitive(options["matchCase"].as_bool() != Some(true))
            .size_limit(2 * 1024 * 1024)
            .dfa_size_limit(1024 * 1024)
            .build()
            .map_err(|e| FileError::new(400, "invalid_search_pattern", e.to_string()))?;
        let root = self.resolve(request["path"].as_str().unwrap_or("."))?;
        if !root.is_dir() {
            return Err(FileError::new(
                400,
                "not_directory",
                "Search path is not a directory",
            ));
        }
        let mut queue = vec![(root, 0)];
        let mut visited = std::collections::HashSet::new();
        let mut results = Vec::new();
        let mut scanned = 0usize;
        let mut bytes = 0u64;
        let mut ignored = 0usize;
        let mut skipped = 0usize;
        let mut reason = None;
        let started = Instant::now();
        'scan: while let Some((directory, depth)) = queue.pop() {
            if !visited.insert(identity(&directory)) {
                continue;
            }
            let entries = match fs::read_dir(&directory) {
                Ok(entries) => entries,
                Err(_) => {
                    skipped += 1;
                    continue;
                }
            };
            for entry in entries {
                if started.elapsed() > Duration::from_secs(2) {
                    reason = Some("time_limit");
                    break 'scan;
                }
                if scanned >= MAX_DIRECTORY_ENTRIES {
                    reason = Some("entry_limit");
                    break 'scan;
                }
                let entry = match entry {
                    Ok(entry) => entry,
                    Err(_) => {
                        skipped += 1;
                        continue;
                    }
                };
                scanned += 1;
                let name = entry.file_name().to_string_lossy().into_owned();
                let metadata = match fs::symlink_metadata(entry.path()) {
                    Ok(m) => m,
                    Err(_) => {
                        skipped += 1;
                        continue;
                    }
                };
                if metadata.file_type().is_symlink() {
                    skipped += 1;
                    continue;
                }
                let canonical = match self.resolve(entry.path().to_string_lossy().as_ref()) {
                    Ok(path) => path,
                    Err(_) => {
                        skipped += 1;
                        continue;
                    }
                };
                if metadata.is_dir() {
                    if IGNORED_DIRECTORIES
                        .iter()
                        .any(|ignore| ignore.eq_ignore_ascii_case(&name))
                    {
                        ignored += 1;
                        continue;
                    }
                    if depth >= MAX_SEARCH_DEPTH {
                        skipped += 1;
                        continue;
                    }
                    queue.push((canonical, depth + 1));
                    continue;
                }
                if !metadata.is_file() {
                    skipped += 1;
                    continue;
                }
                let relative = self.client_path(&canonical);
                if names_only {
                    if expression.is_match(&relative) {
                        results.push(json!({"path":relative,"name":name}));
                    }
                } else {
                    if metadata.len() > MAX_TEXT_BYTES {
                        skipped += 1;
                        continue;
                    }
                    if bytes.saturating_add(metadata.len()) > MAX_SEARCH_BYTES {
                        reason = Some("byte_limit");
                        break 'scan;
                    }
                    bytes += metadata.len();
                    let text = match self.read_file(canonical.to_string_lossy().as_ref(), "utf8") {
                        Ok(text) => text,
                        Err(_) => {
                            skipped += 1;
                            continue;
                        }
                    };
                    for (line_index, line) in text.lines().enumerate() {
                        if matches_line(
                            &expression,
                            line,
                            options["matchWholeWord"].as_bool() == Some(true),
                        ) {
                            results.push(json!({"path":relative,"lineNumber":line_index+1,"lineText":line.chars().take(4096).collect::<String>()}));
                            if results.len() >= limit {
                                reason = Some("result_limit");
                                break 'scan;
                            }
                        }
                    }
                }
                if results.len() >= limit {
                    reason = Some("result_limit");
                    break 'scan;
                }
            }
        }
        Ok(
            json!({if names_only{"fileSearchResults"}else{"searchResults"}:results,
            "searchSummary":{"scannedEntries":scanned,"scannedBytes":bytes,"ignoredDirectories":IGNORED_DIRECTORIES,"ignoredDirectoryCount":ignored,
                "skippedEntries":skipped,"truncated":reason.is_some(),"limitReason":reason,"readOnly":true}}),
        )
    }
}

fn denied() -> FileError {
    FileError::new(
        403,
        "path_outside_allowed_roots",
        "Path is outside the opened workspaces and explicit application data roots",
    )
}
pub(crate) fn display(path: &Path) -> String {
    let text = path.to_string_lossy();
    let text = if let Some(unc) = text.strip_prefix(r"\\?\UNC\") {
        format!(r"\\{unc}")
    } else {
        text.strip_prefix(r"\\?\").unwrap_or(&text).to_string()
    };
    text.replace('\\', "/")
}
fn identity(path: &Path) -> String {
    let path = display(path).trim_end_matches('/').to_string();
    if cfg!(windows) {
        path.to_lowercase()
    } else {
        path
    }
}
pub(crate) fn within(path: &Path, root: &Path) -> bool {
    let raw_path = display(path).trim_end_matches('/').to_string();
    let raw_root = display(root).trim_end_matches('/').to_string();
    if raw_path == raw_root || raw_path.starts_with(&(raw_root.clone() + "/")) {
        return true;
    }
    #[cfg(windows)]
    {
        let path_key = raw_path.to_lowercase();
        let root_key = raw_root.to_lowercase();
        if path_key != root_key && !path_key.starts_with(&(root_key + "/")) {
            return false;
        }
        // A case-insensitive textual match alone is insufficient on Windows
        // case-sensitive directories (or Unicode-folding aliases). Compare an
        // actual ancestor's volume/file identity with the authorized root.
        let Some(root_id) = physical_id(root) else {
            return false;
        };
        return path
            .ancestors()
            .take(128)
            .filter_map(physical_id)
            .any(|id| id == root_id);
    }
    #[cfg(not(windows))]
    {
        false
    }
}

#[cfg(windows)]
fn physical_id(path: &Path) -> Option<(u32, u32, u32)> {
    use std::os::windows::{fs::OpenOptionsExt, io::AsRawHandle};
    use windows_sys::Win32::Storage::FileSystem::{
        GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION, FILE_FLAG_BACKUP_SEMANTICS,
        FILE_READ_ATTRIBUTES, FILE_SHARE_DELETE, FILE_SHARE_READ, FILE_SHARE_WRITE,
    };
    let file = fs::OpenOptions::new()
        .access_mode(FILE_READ_ATTRIBUTES)
        .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE)
        .custom_flags(FILE_FLAG_BACKUP_SEMANTICS)
        .open(path)
        .ok()?;
    let mut info = BY_HANDLE_FILE_INFORMATION::default();
    if unsafe { GetFileInformationByHandle(file.as_raw_handle(), &mut info) } == 0
        || (info.nFileIndexHigh == 0 && info.nFileIndexLow == 0)
    {
        return None;
    }
    Some((
        info.dwVolumeSerialNumber,
        info.nFileIndexHigh,
        info.nFileIndexLow,
    ))
}
pub(crate) fn parse_path(input: &str) -> Result<PathBuf, FileError> {
    if input.is_empty() || input == "." {
        return Ok(PathBuf::from("."));
    }
    let text = if let Some(uri) = input.strip_prefix("file://") {
        let mut bytes = Vec::new();
        let raw = uri.as_bytes();
        let mut i = 0;
        while i < raw.len() {
            if raw[i] == b'%' {
                if i + 2 >= raw.len() {
                    return Err(FileError::new(
                        400,
                        "invalid_file_uri",
                        "Incomplete URI escape",
                    ));
                }
                let code = std::str::from_utf8(&raw[i + 1..i + 3])
                    .ok()
                    .and_then(|s| u8::from_str_radix(s, 16).ok())
                    .ok_or_else(|| FileError::new(400, "invalid_file_uri", "Invalid URI escape"))?;
                bytes.push(code);
                i += 3;
            } else {
                bytes.push(raw[i]);
                i += 1;
            }
        }
        let decoded = String::from_utf8(bytes)
            .map_err(|_| FileError::new(400, "invalid_file_uri", "URI path is not UTF-8"))?;
        let decoded = decoded
            .strip_prefix("localhost/")
            .map(|v| format!("/{v}"))
            .unwrap_or(decoded);
        if decoded.starts_with('/') {
            if cfg!(windows) && decoded.as_bytes().get(2) == Some(&b':') {
                decoded[1..].to_string()
            } else {
                decoded
            }
        } else {
            format!("//{decoded}")
        }
    } else {
        if input.contains("://") {
            return Err(FileError::new(
                400,
                "invalid_path_scheme",
                "Only local paths and file:// URIs are supported",
            ));
        }
        input.to_string()
    };
    if text.chars().any(|c| c == '\0' || c.is_control()) {
        return Err(FileError::new(
            400,
            "invalid_path",
            "Control characters are not allowed in file paths",
        ));
    }
    let normalized = display(Path::new(&text));
    if normalized.starts_with("//./")
        || normalized
            .chars()
            .enumerate()
            .any(|(i, c)| c == ':' && i != 1)
    {
        return Err(FileError::new(
            403,
            "invalid_path_namespace",
            "Device paths and alternate data streams are not allowed",
        ));
    }
    Ok(PathBuf::from(normalized))
}
fn number(value: &Value, key: &str, default: usize, max: usize) -> Result<usize, FileError> {
    let Some(value) = value.get(key) else {
        return Ok(default);
    };
    let number = value
        .as_u64()
        .or_else(|| value.as_str().and_then(|s| s.parse::<u64>().ok()))
        .ok_or_else(|| {
            FileError::new(
                400,
                "invalid_number",
                format!("{key} must be a nonnegative integer"),
            )
        })?;
    Ok(number.min(max as u64) as usize)
}
fn read_bounded(file: &mut File, metadata: &Metadata, limit: u64) -> Result<Vec<u8>, FileError> {
    if metadata.len() > limit {
        return Err(FileError::new(
            413,
            "file_too_large",
            format!("File exceeds the local preview/read limit of {limit} bytes"),
        ));
    }
    let mut bytes = Vec::new();
    file.take(limit + 1)
        .read_to_end(&mut bytes)
        .map_err(io_error)?;
    if bytes.len() as u64 > limit {
        return Err(FileError::new(
            413,
            "file_too_large",
            "File grew beyond the local read limit",
        ));
    }
    Ok(bytes)
}
fn binary_prefix(bytes: &[u8]) -> bool {
    !bytes.starts_with(&[0xff, 0xfe])
        && !bytes.starts_with(&[0xfe, 0xff])
        && bytes.iter().any(|b| *b == 0)
}
pub(crate) fn decode_text(bytes: &[u8]) -> Result<String, FileError> {
    if bytes.starts_with(&[0xff, 0xfe]) || bytes.starts_with(&[0xfe, 0xff]) {
        if bytes.len() % 2 != 0 {
            return Err(FileError::new(
                422,
                "invalid_text_encoding",
                "Malformed UTF-16 text",
            ));
        }
        let little = bytes[0] == 0xff;
        let units = bytes[2..]
            .chunks_exact(2)
            .map(|chunk| {
                if little {
                    u16::from_le_bytes([chunk[0], chunk[1]])
                } else {
                    u16::from_be_bytes([chunk[0], chunk[1]])
                }
            })
            .collect::<Vec<_>>();
        return String::from_utf16(&units)
            .map_err(|_| FileError::new(422, "invalid_text_encoding", "Malformed UTF-16 text"));
    }
    if binary_prefix(bytes) {
        return Err(FileError::new(
            415,
            "binary_text_unsupported",
            "Binary file cannot be read as text",
        ));
    }
    let bytes = bytes.strip_prefix(&[0xef, 0xbb, 0xbf]).unwrap_or(bytes);
    std::str::from_utf8(bytes).map(str::to_string).map_err(|_| {
        FileError::new(
            422,
            "invalid_text_encoding",
            "File is not valid UTF-8 or BOM-marked UTF-16 text",
        )
    })
}
fn position(value: &Value) -> Result<(usize, usize), FileError> {
    if !value["line"].is_u64() {
        return Err(FileError::new(
            400,
            "invalid_range",
            "Range line must be a nonnegative integer",
        ));
    }
    Ok((
        number(value, "line", 0, 1_000_000)?,
        number(value, "character", 0, 1_000_000)?,
    ))
}
fn text_offset(text: &str, position: (usize, usize)) -> Result<usize, FileError> {
    let mut prefix = 0;
    for (index, line) in text.split_inclusive('\n').enumerate() {
        if index == position.0 {
            let line = line.strip_suffix('\n').unwrap_or(line);
            let line = line.strip_suffix('\r').unwrap_or(line);
            let mut units = 0;
            for (byte, ch) in line.char_indices() {
                if units == position.1 {
                    return Ok(prefix + byte);
                }
                units += ch.len_utf16();
                if units > position.1 {
                    return Err(FileError::new(
                        400,
                        "invalid_range",
                        "Range splits a UTF-16 surrogate pair",
                    ));
                }
            }
            if units == position.1 {
                return Ok(prefix + line.len());
            }
            return Err(FileError::new(
                400,
                "invalid_range",
                "Range character exceeds line length",
            ));
        }
        prefix += line.len();
    }
    if position.0 == text.split_inclusive('\n').count() && position.1 == 0 {
        return Ok(text.len());
    }
    Err(FileError::new(
        400,
        "invalid_range",
        "Range line exceeds document length",
    ))
}
fn matches_line(expression: &Regex, line: &str, whole: bool) -> bool {
    expression.find_iter(line).any(|m| {
        !whole || {
            let word = |c: char| c.is_alphanumeric() || c == '_';
            !line[..m.start()].chars().next_back().is_some_and(word)
                && !line[m.end()..].chars().next().is_some_and(word)
        }
    })
}
pub(crate) fn base64(bytes: &[u8]) -> String {
    const TABLE: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity(bytes.len().div_ceil(3) * 4);
    for chunk in bytes.chunks(3) {
        let a = chunk[0] as usize;
        let b = chunk.get(1).copied().unwrap_or(0) as usize;
        let c = chunk.get(2).copied().unwrap_or(0) as usize;
        out.push(TABLE[a >> 2] as char);
        out.push(TABLE[(a & 3) << 4 | b >> 4] as char);
        out.push(if chunk.len() > 1 {
            TABLE[(b & 15) << 2 | c >> 6] as char
        } else {
            '='
        });
        out.push(if chunk.len() > 2 {
            TABLE[c & 63] as char
        } else {
            '='
        });
    }
    out
}
fn mime(path: &Path) -> &'static str {
    match path
        .extension()
        .and_then(|v| v.to_str())
        .unwrap_or("")
        .to_ascii_lowercase()
        .as_str()
    {
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "webp" => "image/webp",
        "bmp" => "image/bmp",
        "ico" => "image/x-icon",
        "svg" => "image/svg+xml",
        "glb" => "model/gltf-binary",
        "gltf" => "model/gltf+json",
        "mp4" => "video/mp4",
        "webm" => "video/webm",
        "mov" => "video/quicktime",
        "avi" => "video/x-msvideo",
        "mp3" => "audio/mpeg",
        "wav" => "audio/wav",
        "ogg" => "audio/ogg",
        "flac" => "audio/flac",
        "m4a" => "audio/mp4",
        "json" => "application/json",
        "pdf" => "application/pdf",
        "html" | "htm" => "text/html",
        "css" => "text/css",
        "js" | "mjs" => "text/javascript",
        "txt" | "md" | "cs" | "rs" | "py" | "yaml" | "yml" | "toml" | "xml" => "text/plain",
        _ => "application/octet-stream",
    }
}
fn modified_ms(metadata: &Metadata) -> u128 {
    metadata
        .modified()
        .ok()
        .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
        .map(|v| v.as_millis())
        .unwrap_or(0)
}
fn modified(metadata: &Metadata) -> String {
    timestamp(metadata.modified().unwrap_or(UNIX_EPOCH))
}
fn timestamp(time: SystemTime) -> String {
    let seconds = time
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let days = (seconds / 86400) as i64 + 719468;
    let era = days / 146097;
    let doe = days - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = mp + if mp < 10 { 3 } else { -9 };
    let year = yoe + era * 400 + if month <= 2 { 1 } else { 0 };
    let clock = seconds % 86400;
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        clock / 3600,
        clock / 60 % 60,
        clock % 60
    )
}
#[cfg(windows)]
pub(crate) fn opened_path(file: &File) -> Result<PathBuf, FileError> {
    use std::os::windows::io::AsRawHandle;
    use windows_sys::Win32::Storage::FileSystem::GetFinalPathNameByHandleW;
    let mut buffer = vec![0u16; 512];
    loop {
        let length = unsafe {
            GetFinalPathNameByHandleW(
                file.as_raw_handle(),
                buffer.as_mut_ptr(),
                buffer.len() as u32,
                0,
            )
        };
        if length == 0 {
            return Err(io_error(std::io::Error::last_os_error()));
        }
        if length as usize >= buffer.len() {
            if length > 32768 {
                return Err(FileError::new(
                    400,
                    "path_too_long",
                    "Opened path exceeds the Windows limit",
                ));
            }
            buffer.resize(length as usize + 1, 0);
            continue;
        }
        return Ok(PathBuf::from(
            String::from_utf16(&buffer[..length as usize])
                .map_err(|_| FileError::new(400, "invalid_path", "Opened path is not UTF-16"))?,
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    struct Fixture {
        base: PathBuf,
        root: PathBuf,
        project: PathBuf,
        data: PathBuf,
        outside: PathBuf,
    }
    impl Fixture {
        fn new() -> Self {
            let base = PathBuf::from(
                r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
            );
            let root = base.join(format!("files-{}", uuid::Uuid::new_v4()));
            let project = root.join("项目A");
            let data = root.join("application-data");
            let outside = root.join("outside");
            for dir in [&project, &data, &outside] {
                fs::create_dir_all(dir).unwrap();
            }
            Self {
                base,
                root,
                project,
                data,
                outside,
            }
        }
        fn files(&self) -> Files {
            Files::new(&self.project, &[self.project.clone(), self.data.clone()]).unwrap()
        }
        fn write(&self, name: &str, content: &[u8]) -> PathBuf {
            let path = self.project.join(name);
            fs::create_dir_all(path.parent().unwrap()).unwrap();
            fs::write(&path, content).unwrap();
            path
        }
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
                .starts_with("files-"));
            fs::remove_dir_all(root).unwrap();
        }
    }
    #[test]
    fn real_tree_is_one_level_paginated_and_read_only() {
        let f = Fixture::new();
        f.write("目录/深层.txt", b"hidden until expanded");
        f.write("z.txt", b"z");
        f.write("A.txt", b"a");
        let files = f.files();
        let first = files
            .explorer(&json!({"path":".","mode":"list","limit":2}))
            .unwrap();
        let entries = first["directory"]["entries"].as_array().unwrap();
        assert_eq!(entries.len(), 2);
        assert_eq!(entries[0]["kind"], "directory");
        assert_eq!(entries[0]["path"], "目录");
        assert_eq!(entries[1]["name"], "A.txt");
        assert_eq!(first["directory"]["hasMore"], true);
        let next = files.explorer(&json!({"mode":"list","offset":2})).unwrap();
        assert_eq!(next["directory"]["entries"][0]["name"], "z.txt");
        assert_eq!(
            files
                .explorer(&json!({"mode":"save","path":"A.txt","content":"changed"}))
                .unwrap_err()
                .status(),
            405
        );
        assert_eq!(fs::read(f.project.join("A.txt")).unwrap(), b"a");
    }
    #[test]
    fn unicode_uri_base64_and_utf16_text_use_real_file_bytes() {
        let f = Fixture::new();
        let path = f.write("中文 空格.txt", "你好\n".as_bytes());
        let uri = format!("file:///{}", display(&path).replace(' ', "%20"));
        let files = f.files();
        assert_eq!(files.read_file(&uri, "utf8").unwrap(), "你好\n");
        let bytes = [0, 1, 254, 255];
        f.write("image.png", &bytes);
        let content = files.local_content("image.png").unwrap();
        assert_eq!(content["content"], "data:image/png;base64,AAH+/w==");
        assert_eq!(
            files
                .explorer(&json!({"mode":"file","path":"image.png"}))
                .unwrap()["file"]["kind"],
            "image"
        );
        let mut utf16 = vec![0xff, 0xfe];
        for unit in "中文".encode_utf16() {
            utf16.extend_from_slice(&unit.to_le_bytes());
        }
        f.write("bom.txt", &utf16);
        assert_eq!(files.read_file("bom.txt", "utf8").unwrap(), "中文");
    }
    #[test]
    fn traversal_external_root_device_and_ads_are_denied() {
        let f = Fixture::new();
        fs::write(f.outside.join("secret.txt"), b"outside sentinel").unwrap();
        let files = f.files();
        for input in [
            "../outside/secret.txt".to_string(),
            f.outside.join("secret.txt").to_string_lossy().into_owned(),
            f.outside.join("missing.txt").to_string_lossy().into_owned(),
            "file:///F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/%2e%2e/secret.txt".to_string(),
            "x.txt:secret".to_string(),
            r"\\.\pipe\anything".to_string(),
        ] {
            assert_eq!(files.read_file(&input, "utf8").unwrap_err().status(), 403);
        }
        assert!(Files::new(&f.outside, &[f.project.clone()]).is_err());
        fs::write(f.data.join("settings.json"), b"{}").unwrap();
        assert_eq!(
            files
                .read_file(f.data.join("settings.json").to_str().unwrap(), "utf8")
                .unwrap(),
            "{}"
        );
    }
    #[test]
    fn text_ranges_preserve_crlf_and_use_utf16_columns() {
        let f = Fixture::new();
        f.write("range.txt", "A😀中\r\nsecond\r\nthird".as_bytes());
        let files = f.files();
        assert_eq!(
            files
                .read_range(
                    "range.txt",
                    &json!({"start":{"line":0,"character":1},"end":{"line":0,"character":3}})
                )
                .unwrap(),
            "😀"
        );
        assert_eq!(
            files
                .read_range(
                    "range.txt",
                    &json!({"start":{"line":1,"character":0},"end":{"line":2,"character":0}})
                )
                .unwrap(),
            "second\r\n"
        );
        assert!(files
            .read_range(
                "range.txt",
                &json!({"start":{"line":0,"character":2},"end":{"line":0,"character":3}})
            )
            .is_err());
    }
    #[test]
    fn binary_and_large_text_never_return_fake_text_or_unbounded_buffers() {
        let f = Fixture::new();
        f.write("binary.bin", &[0, 1, 2]);
        f.write("large.txt", &vec![b'x'; MAX_TEXT_BYTES as usize + 1]);
        let files = f.files();
        let binary = files
            .explorer(&json!({"mode":"file","path":"binary.bin"}))
            .unwrap();
        assert_eq!(binary["file"]["kind"], "binary");
        assert_eq!(binary["file"]["content"], Value::Null);
        assert_eq!(
            files.read_file("binary.bin", "utf8").unwrap_err().status(),
            415
        );
        assert_eq!(
            files.read_file("large.txt", "utf8").unwrap_err().status(),
            413
        );
        assert_eq!(files.read_file("binary.bin", "base64").unwrap(), "AAEC");
    }
    #[test]
    fn searches_real_content_regex_and_skips_generated_directories() {
        let f = Fixture::new();
        f.write("src/readme.txt", b"Hello HELLO hello_world\nneedle 123\n");
        f.write("Library/skip.txt", b"needle 456");
        f.write("node_modules/skip.txt", b"needle 789");
        let files = f.files();
        let result=files.explorer(&json!({"path":".","mode":"search","query":"needle \\d+","options":{"useRegularExpression":true}})).unwrap();
        assert_eq!(result["searchResults"].as_array().unwrap().len(), 1);
        assert_eq!(result["searchResults"][0]["lineNumber"], 2);
        assert_eq!(result["searchSummary"]["ignoredDirectoryCount"], 2);
        let records=files.search_records(&json!({"mode":"search","query":"Hello","options":{"matchCase":true,"matchWholeWord":true}})).unwrap();
        assert_eq!(records[0]["type"], "match");
        assert_eq!(records.last().unwrap()["type"], "summary");
        let names = files
            .explorer(&json!({"mode":"search-files","query":"readme"}))
            .unwrap();
        assert_eq!(names["fileSearchResults"][0]["name"], "readme.txt");
        assert!(files
            .search_records(
                &json!({"mode":"search","query":"[","options":{"useRegularExpression":true}})
            )
            .is_err());
    }
    #[test]
    fn native_ide_probes_do_not_disclose_unopened_paths_and_reads_still_fail() {
        let f = Fixture::new();
        f.write("file.txt", b"abc");
        let files = f.files();
        assert_eq!(files.list_dir(".").unwrap()[0], json!(["file.txt", 1]));
        let stats = files.file_stats(&["file.txt".to_string()]).unwrap();
        assert_eq!(stats["file.txt"]["size"], 3);
        assert_eq!(
            files.preview("file.txt").unwrap()["sha256"],
            format!("{:x}", Sha256::digest(b"abc"))
        );
        assert!(!files.file_exists("missing").unwrap());
        assert!(!files.file_exists(f.outside.to_str().unwrap()).unwrap());
        assert_eq!(
            files
                .file_stats(&[
                    "missing".to_string(),
                    f.outside.to_string_lossy().to_string()
                ])
                .unwrap(),
            json!({})
        );
        assert_eq!(
            files
                .read_file(f.outside.to_str().unwrap(), "utf8")
                .unwrap_err()
                .status(),
            403
        );
        assert!(files.read_file("missing", "utf8").unwrap_err().json()["error"].is_string());
        let with_stale = Files::new(
            &f.project,
            &[f.project.clone(), f.root.join("stale-workspace")],
        )
        .unwrap();
        assert_eq!(with_stale.read_file("file.txt", "utf8").unwrap(), "abc");
        assert_eq!(files.read_file(".", "utf8").unwrap_err().status(), 400);
    }
    #[test]
    fn git_discovery_reads_only_real_markers_inside_its_workspace() {
        let f = Fixture::new();
        std::fs::create_dir(f.project.join(".git")).unwrap();
        std::fs::create_dir_all(f.project.join("nested/repo/.git")).unwrap();
        std::fs::create_dir_all(f.project.join("Library/generated/.git")).unwrap();
        f.write("nested/repo/file.txt", b"tracked fixture");
        let files = f.files();
        let repositories = files.git_repositories(".").unwrap();
        assert_eq!(repositories.as_array().unwrap().len(), 2);
        assert_eq!(
            files.git_root("nested/repo/file.txt").unwrap().unwrap(),
            display(&f.project.join("nested/repo").canonicalize().unwrap())
        );
        assert!(files.git_repositories(f.outside.to_str().unwrap()).is_err());
        assert!(repositories
            .as_array()
            .unwrap()
            .iter()
            .all(|row| !row["repoDir"].as_str().unwrap().contains("generated")));
    }
    #[cfg(windows)]
    #[test]
    fn junction_escape_is_denied_without_enumerating_its_target() {
        let f = Fixture::new();
        fs::write(f.outside.join("secret.txt"), b"outside sentinel").unwrap();
        let link = f.project.join("escape");
        let status = std::process::Command::new("cmd.exe")
            .args(["/c", "mklink", "/J"])
            .arg(&link)
            .arg(&f.outside)
            .creation_flags(0x08000000)
            .stdout(std::process::Stdio::null())
            .status()
            .unwrap();
        assert!(status.success());
        let files = f.files();
        assert_eq!(
            files
                .read_file("escape/secret.txt", "utf8")
                .unwrap_err()
                .status(),
            403
        );
        let result = files.explorer(&json!({"mode":"list"})).unwrap();
        assert!(result["directory"]["entries"]
            .as_array()
            .unwrap()
            .is_empty());
    }
    #[cfg(windows)]
    use std::os::windows::process::CommandExt;
}
