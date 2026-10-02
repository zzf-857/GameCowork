//! Local templates shipped with the selected installed Editor. No Hub account or download.
use flate2::read::GzDecoder;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::HashSet,
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    path::{Component, Path, PathBuf},
    sync::atomic::{AtomicU8, Ordering},
};
use uuid::Uuid;

const MAX_ARCHIVE: u64 = 1024 * 1024 * 1024;
const MAX_DECODED: u64 = 8 * 1024 * 1024 * 1024;
const MAX_FILE: u64 = 512 * 1024 * 1024;
const MAX_FILES: usize = 100_000;
pub const RUNNING: u8 = 0;
pub const CANCELLED: u8 = 1;
const COMMITTING: u8 = 2;
const FINISHED: u8 = 3;

#[derive(Clone, Debug)]
pub struct Editor {
    pub executable: PathBuf,
    pub product: String,
    pub version: String,
    pub display_version: String,
}

pub fn select_editor(snapshot: &Value, data: &Value) -> Result<Editor, String> {
    let version = data["editorVersion"]
        .as_str()
        .or(data["version"].as_str())
        .unwrap_or("");
    if version.is_empty()
        || version.len() > 80
        || !version
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b".+-_".contains(&b))
    {
        return Err("Invalid installed Editor version".into());
    }
    let requested_path = data["editorPath"].as_str().filter(|v| !v.is_empty());
    let product = data["product"].as_str();
    if data["architecture"].as_str().is_some_and(|a| a != "x86_64") {
        return Err("This installed Editor architecture is not available".into());
    }
    let mut found = Vec::new();
    for group in snapshot.as_array().into_iter().flatten() {
        let engine = group["product"].as_str().unwrap_or("");
        if !["unity", "tuanjie"].contains(&engine) || product.is_some_and(|p| p != engine) {
            continue;
        }
        for row in group["editors"].as_array().into_iter().flatten() {
            if row["version"].as_str() != Some(version) {
                continue;
            }
            let Some(raw) = row["path"].as_str() else {
                continue;
            };
            let path = PathBuf::from(raw);
            let executable = editor_executable(&path, engine).ok_or("EDITOR_NOT_FOUND")?;
            if requested_path.is_some_and(|p| {
                path_key(Path::new(p)) != path_key(&path)
                    && editor_executable(Path::new(p), engine)
                        .is_none_or(|requested| path_key(&requested) != path_key(&executable))
            }) {
                continue;
            }
            found.push(Editor {
                executable,
                product: engine.into(),
                version: version.into(),
                display_version: row["tuanjie_editor_version"]
                    .as_str()
                    .filter(|s| !s.is_empty())
                    .unwrap_or(version)
                    .into(),
            });
        }
    }
    if found.len() != 1 {
        return Err(if found.is_empty() {
            "EDITOR_NOT_FOUND"
        } else {
            "Select the exact installed Editor path"
        }
        .into());
    }
    Ok(found.remove(0))
}

fn editor_executable(path: &Path, engine: &str) -> Option<PathBuf> {
    let names = if engine == "tuanjie" {
        vec!["Tuanjie.exe", "Unity.exe"]
    } else {
        vec!["Unity.exe"]
    };
    if path.is_file()
        && names.iter().any(|name| {
            path.file_name()
                .is_some_and(|n| n.to_string_lossy().eq_ignore_ascii_case(name))
        })
    {
        return fs::canonicalize(path).ok();
    }
    for directory in [path.join("Editor"), path.to_path_buf()] {
        for name in &names {
            let candidate = directory.join(name);
            if candidate.is_file() {
                return fs::canonicalize(candidate).ok();
            }
        }
    }
    None
}

fn path_key(path: &Path) -> String {
    path.to_string_lossy()
        .replace('\\', "/")
        .trim_end_matches('/')
        .to_lowercase()
}
fn template_directory(editor: &Editor) -> Result<PathBuf, String> {
    let parent = editor.executable.parent().ok_or("EDITOR_NOT_FOUND")?;
    fs::canonicalize(parent.join("Data/Resources/PackageManager/ProjectTemplates"))
        .map_err(|_| "Selected Editor has no local project templates".into())
}

fn archive_bytes(path: &Path) -> Result<Vec<u8>, String> {
    let metadata = fs::symlink_metadata(path).map_err(|e| format!("Cannot read template: {e}"))?;
    if !metadata.is_file() || metadata.file_type().is_symlink() || metadata.len() > MAX_ARCHIVE {
        return Err("Invalid or oversized template archive".into());
    }
    let mut bytes = Vec::new();
    File::open(path)
        .map_err(|e| e.to_string())?
        .take(MAX_ARCHIVE + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > MAX_ARCHIVE {
        return Err("Template archive grew beyond its limit".into());
    }
    Ok(bytes)
}

fn metadata(bytes: &[u8]) -> Result<Value, String> {
    let mut archive = tar::Archive::new(GzDecoder::new(bytes).take(MAX_DECODED));
    let mut package = None;
    for (count, item) in archive.entries().map_err(|e| e.to_string())?.enumerate() {
        if count > MAX_FILES {
            return Err("Too many template entries".into());
        }
        let mut entry = item.map_err(|e| e.to_string())?;
        if entry.path().map_err(|e| e.to_string())?.as_ref() == Path::new("package/package.json") {
            if package.is_some()
                || !entry.header().entry_type().is_file()
                || entry.size() > 1024 * 1024
            {
                return Err("Invalid template metadata".into());
            }
            let mut text = String::new();
            entry.read_to_string(&mut text).map_err(|e| e.to_string())?;
            package = Some(
                serde_json::from_str::<Value>(&text)
                    .map_err(|e| format!("Invalid template metadata: {e}"))?,
            );
        }
    }
    let package = package.ok_or("Template has no package.json")?;
    if template_type(&package).is_none()
        || !package["name"].as_str().is_some_and(|s| {
            s.len() <= 160
                && s.contains('.')
                && s.split('.').all(|part| {
                    !part.is_empty()
                        && part.bytes().all(|b| {
                            b.is_ascii_lowercase() || b.is_ascii_digit() || b"-_".contains(&b)
                        })
                })
        })
        || !["displayName", "version"].iter().all(|key| {
            package[key]
                .as_str()
                .is_some_and(|value| !value.trim().is_empty())
        })
    {
        return Err("Invalid template identity".into());
    }
    Ok(package)
}

// Unity Hub's _mapLocalTemplate keeps the three category identities and maps
// the UPM "template" type to CORE. It never invents a remote category locally.
fn template_type(package: &Value) -> Option<&str> {
    match package["type"].as_str()? {
        "template" | "CORE" => Some("CORE"),
        "SAMPLE" => Some("SAMPLE"),
        "LEARNING" => Some("LEARNING"),
        _ => None,
    }
}

fn local_archive(path: &Path) -> Result<(Vec<u8>, Value), String> {
    let bytes = archive_bytes(path)?;
    let package = metadata(&bytes)?;
    Ok((bytes, package))
}

fn is_template_archive(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| extension.eq_ignore_ascii_case("tgz"))
}

fn dependency_packages(package: &Value) -> Value {
    let Some(dependencies) = package["dependencies"].as_object() else {
        return Value::Null;
    };
    let packages: Option<Vec<Value>> = dependencies
        .iter()
        .map(|(name, version)| {
            version
                .as_str()
                .filter(|version| !name.is_empty() && !version.is_empty())
                .map(|version| json!({"name":name,"packageName":name,"version":version}))
        })
        .collect();
    packages.map(Value::Array).unwrap_or(Value::Null)
}

pub fn catalog(editor: &Editor) -> Result<Value, String> {
    let directory = template_directory(editor)?;
    let mut templates = Vec::new();
    let mut skipped_templates = Vec::new();
    for item in fs::read_dir(&directory)
        .map_err(|e| e.to_string())?
        .take(128)
    {
        let path = item.map_err(|e| e.to_string())?.path();
        if !is_template_archive(&path) {
            continue;
        }
        // Match Hub scanTemplates' per-archive failure isolation. Keep the
        // reason in the response, so missing/corrupt archives remain visible.
        let (bytes, package) = match local_archive(&path) {
            Ok(template) => template,
            Err(error) => {
                skipped_templates.push(json!({"archive":path.file_name().map(|name| name.to_string_lossy()),"error":error}));
                continue;
            }
        };
        let name = package["name"].as_str().unwrap();
        let display_name = package["displayName"].as_str().unwrap();
        let is_preview = display_name.contains("(Preview)");
        let display_name = display_name.replacen("(Preview)", "", 1).trim().to_owned();
        templates.push(json!({"name":name,"displayName":display_name,"description":package["description"],
            "version":package["version"],"type":template_type(&package),"isPreview":is_preview,"status":"READY","source":"installed-editor",
            "packages":dependency_packages(&package),"size":bytes.len(),"buildPlatforms":null,"renderPipeline":null,
            "archiveSha256":format!("{:x}", Sha256::digest(&bytes)),"editorPath":editor.executable,"product":editor.product}));
    }
    templates.sort_by_key(|v| v["name"].as_str().unwrap_or("").to_owned());
    Ok(
        json!({"templates":templates,"skippedTemplates":skipped_templates,"supported":true,"source":"installed-editor","editorPath":editor.executable,"product":editor.product}),
    )
}

pub fn unique_project(directory: &Path) -> Result<Value, String> {
    fs::create_dir_all(directory)
        .map_err(|e| format!("Cannot create local Projects directory: {e}"))?;
    for n in 0..10_000 {
        let name = if n == 0 {
            "My Project".into()
        } else {
            format!("My Project {n}")
        };
        if !directory.join(&name).exists() {
            return Ok(json!({"directory":directory,"name":name}));
        }
    }
    Err("No available default project name".into())
}

fn validate_name(name: &str) -> Result<(), String> {
    let stem = name.split('.').next().unwrap_or("").to_ascii_uppercase();
    let reserved = [
        "CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8",
        "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9",
    ];
    if name.trim() != name
        || name.is_empty()
        || name.encode_utf16().count() > 100
        || name == "."
        || name == ".."
        || name.ends_with(['.', ' '])
        || name
            .chars()
            .any(|c| c.is_control() || "<>:\"/\\|?*".contains(c))
        || reserved.contains(&stem.as_str())
    {
        return Err("Invalid project name".into());
    }
    Ok(())
}

fn relative_source(path: &Path) -> Result<Option<PathBuf>, String> {
    let raw = path
        .to_str()
        .ok_or("Template contains a non-Unicode path")?;
    if raw.contains('\\')
        || raw.contains(':')
        || path
            .components()
            .any(|c| !matches!(c, Component::Normal(_)))
    {
        return Err("Template contains an unsafe path".into());
    }
    let Some(relative) = raw.strip_prefix("package/ProjectData~/") else {
        return Ok(None);
    };
    let relative = PathBuf::from(relative);
    for part in relative.components() {
        if let Component::Normal(name) = part {
            validate_name(&name.to_string_lossy())?;
        }
    }
    let first = relative
        .components()
        .next()
        .map(|s| s.as_os_str().to_string_lossy().into_owned());
    if !first.is_some_and(|s| ["Assets", "Packages", "ProjectSettings"].contains(&s.as_str())) {
        return Ok(None);
    }
    Ok(Some(relative))
}

struct Stage {
    path: PathBuf,
    parent: PathBuf,
}
impl Drop for Stage {
    fn drop(&mut self) {
        if self
            .path
            .file_name()
            .is_some_and(|s| s.to_string_lossy().starts_with(".gamecowork-create-"))
            && self.path.parent() == Some(self.parent.as_path())
            && fs::canonicalize(&self.path)
                .ok()
                .is_some_and(|p| p.parent() == Some(self.parent.as_path()))
        {
            let _ = fs::remove_dir_all(&self.path);
        }
    }
}

pub fn cancel(token: &AtomicU8) -> bool {
    token
        .compare_exchange(RUNNING, CANCELLED, Ordering::SeqCst, Ordering::SeqCst)
        .is_ok()
        || token.load(Ordering::SeqCst) == CANCELLED
}
fn check_cancel(token: &AtomicU8) -> Result<(), String> {
    if token.load(Ordering::SeqCst) == CANCELLED {
        Err("PROJECT_CREATION_CANCELLED".into())
    } else {
        Ok(())
    }
}

pub fn create(
    editor: &Editor,
    data: &Value,
    token: &AtomicU8,
    progress: impl Fn(usize, u64),
) -> Result<Value, String> {
    let name = data["projectName"]
        .as_str()
        .ok_or("Project name is required")?;
    validate_name(name)?;
    if data["uosEnabled"] == true || data.get("organizationId").is_some_and(|v| !v.is_null()) {
        return Err("Cloud project services are not configured".into());
    }
    let parent = fs::canonicalize(
        data["projectPath"]
            .as_str()
            .ok_or("Project location is required")?,
    )
    .map_err(|e| format!("Cannot use project location: {e}"))?;
    if !parent.is_dir() {
        return Err("Project location is not a directory".into());
    }
    let target = parent.join(name);
    if target.try_exists().map_err(|e| e.to_string())? {
        return Err("PROJECT_EXISTS".into());
    }
    let desired = data["templateName"]
        .as_str()
        .ok_or("Template name is required")?;
    let directory = template_directory(editor)?;
    let mut selected = None;
    for item in fs::read_dir(&directory)
        .map_err(|e| e.to_string())?
        .take(128)
    {
        check_cancel(token)?;
        let path = item.map_err(|e| e.to_string())?.path();
        if !is_template_archive(&path) {
            continue;
        }
        // Catalog and creation share identity validation and corrupt-archive
        // isolation; a damaged unrelated template must not block this one.
        let Ok((bytes, package)) = local_archive(&path) else {
            continue;
        };
        if package["name"] == desired {
            if selected.is_some() {
                return Err("Ambiguous local template identity".into());
            }
            selected = Some(bytes);
        }
    }
    let bytes = selected.ok_or("TEMPLATE_NOT_FOUND")?;
    if data["archiveSha256"]
        .as_str()
        .is_some_and(|sha| !sha.eq_ignore_ascii_case(&format!("{:x}", Sha256::digest(&bytes))))
    {
        return Err("The selected template changed; refresh the template list".into());
    }
    check_cancel(token)?;
    let stage = Stage {
        path: parent.join(format!(".gamecowork-create-{}", Uuid::new_v4())),
        parent: parent.clone(),
    };
    fs::create_dir(&stage.path).map_err(|e| format!("Cannot prepare project: {e}"))?;
    let mut archive = tar::Archive::new(GzDecoder::new(bytes.as_slice()).take(MAX_DECODED));
    let mut seen = HashSet::new();
    let mut copied = 0usize;
    let mut written = 0u64;
    for (count, item) in archive.entries().map_err(|e| e.to_string())?.enumerate() {
        check_cancel(token)?;
        if count > MAX_FILES {
            return Err("Too many template entries".into());
        }
        let mut entry = item.map_err(|e| e.to_string())?;
        let entry_type = entry.header().entry_type();
        if !entry_type.is_file() && !entry_type.is_dir() {
            return Err("Template links and special entries are not supported".into());
        }
        let Some(relative) = relative_source(&entry.path().map_err(|e| e.to_string())?)? else {
            continue;
        };
        let output = stage.path.join(&relative);
        if entry_type.is_dir() {
            fs::create_dir_all(&output).map_err(|e| e.to_string())?;
            continue;
        }
        if entry.size() > MAX_FILE || !seen.insert(path_key(&relative)) {
            return Err("Template file is oversized or duplicated".into());
        }
        fs::create_dir_all(output.parent().unwrap()).map_err(|e| e.to_string())?;
        let mut file = OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&output)
            .map_err(|e| e.to_string())?;
        let mut buffer = [0u8; 64 * 1024];
        let mut actual = 0;
        loop {
            check_cancel(token)?;
            let n = entry.read(&mut buffer).map_err(|e| e.to_string())?;
            if n == 0 {
                break;
            }
            file.write_all(&buffer[..n]).map_err(|e| e.to_string())?;
            actual += n as u64;
        }
        if actual != entry.size() {
            return Err("Truncated template file".into());
        }
        file.sync_all().map_err(|e| e.to_string())?;
        copied += 1;
        written += actual;
        progress(copied, written);
    }
    if !stage.path.join("Assets").is_dir() || !stage.path.join("Packages/manifest.json").is_file() {
        return Err("Template has no actual project Assets/Packages".into());
    }
    let manifest: Value = serde_json::from_slice(
        &fs::read(stage.path.join("Packages/manifest.json")).map_err(|e| e.to_string())?,
    )
    .map_err(|e| format!("Invalid template manifest: {e}"))?;
    if !manifest["dependencies"].is_object() {
        return Err("Template manifest has no dependencies object".into());
    }
    fs::create_dir_all(stage.path.join("ProjectSettings")).map_err(|e| e.to_string())?;
    let mut version = format!("m_EditorVersion: {}\n", editor.version);
    if editor.product == "tuanjie" {
        version += &format!("m_TuanjieEditorVersion: {}\n", editor.display_version);
    }
    fs::write(
        stage.path.join("ProjectSettings/ProjectVersion.txt"),
        version,
    )
    .map_err(|e| e.to_string())?;
    token
        .compare_exchange(RUNNING, COMMITTING, Ordering::SeqCst, Ordering::SeqCst)
        .map_err(|_| "PROJECT_CREATION_CANCELLED")?;
    let result = move_new_directory(&stage.path, &target);
    token.store(FINISHED, Ordering::SeqCst);
    result?;
    Ok(
        json!({"created":true,"projectPath":target,"templateName":desired,"editorPath":editor.executable,"product":editor.product,"editorVersion":editor.version,
        "source":"installed-editor","filesCopied":copied,"bytesCopied":written,"archiveSha256":format!("{:x}",Sha256::digest(&bytes))}),
    )
}

#[cfg(windows)]
fn move_new_directory(source: &Path, target: &Path) -> Result<(), String> {
    use std::os::windows::ffi::OsStrExt;
    let from: Vec<u16> = source.as_os_str().encode_wide().chain(Some(0)).collect();
    let to: Vec<u16> = target.as_os_str().encode_wide().chain(Some(0)).collect();
    if unsafe {
        windows_sys::Win32::Storage::FileSystem::MoveFileExW(from.as_ptr(), to.as_ptr(), 0)
    } == 0
    {
        return Err(format!(
            "Cannot commit new project without replacing an existing path: {}",
            std::io::Error::last_os_error()
        ));
    }
    Ok(())
}
#[cfg(not(windows))]
fn move_new_directory(_: &Path, _: &Path) -> Result<(), String> {
    Err("Atomic local template creation is implemented for Windows".into())
}

#[cfg(test)]
mod tests {
    use super::*;
    use flate2::{write::GzEncoder, Compression};
    fn fixture() -> (PathBuf, Editor) {
        let root = PathBuf::from("F:/AI/AgentMake/temp/GameCowork/tests")
            .join(format!("templates-{}", Uuid::new_v4()));
        let editor = root.join("Editor");
        fs::create_dir_all(editor.join("Data/Resources/PackageManager/ProjectTemplates")).unwrap();
        fs::write(editor.join("Unity.exe"), b"owned test editor marker").unwrap();
        (
            root.clone(),
            Editor {
                executable: editor.join("Unity.exe"),
                product: "unity".into(),
                version: "2022.3.51f1c1".into(),
                display_version: "2022.3.51f1c1".into(),
            },
        )
    }
    fn package(editor: &Editor, entries: &[(&str, &[u8])]) {
        let file = File::create(template_directory(editor).unwrap().join("owned.tgz")).unwrap();
        let mut archive = tar::Builder::new(GzEncoder::new(file, Compression::fast()));
        for (name, bytes) in entries {
            let mut header = tar::Header::new_gnu();
            header.set_size(bytes.len() as u64);
            header.set_mode(0o644);
            header.set_cksum();
            archive.append_data(&mut header, name, *bytes).unwrap();
        }
        archive.into_inner().unwrap().finish().unwrap();
    }
    fn valid(editor: &Editor) {
        package(editor,&[("package/package.json",br#"{"name":"com.gamecowork.owned","type":"template","displayName":"Owned","version":"1.0"}"#),
        ("package/ProjectData~/Assets/Scene.txt",b"real template bytes"),("package/ProjectData~/Packages/manifest.json",br#"{"dependencies":{}}"#),("package/ProjectData~/Library/Cache.bin",b"excluded generated cache")]);
    }
    fn data(root: &Path) -> Value {
        json!({"projectPath":root,"projectName":"Owned Project","templateName":"com.gamecowork.owned"})
    }
    #[test]
    fn catalog_and_creation_use_actual_archive_and_preserve_bytes() {
        let (root, editor) = fixture();
        valid(&editor);
        let list = catalog(&editor).unwrap();
        assert_eq!(list["templates"][0]["status"], "READY");
        let result = create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {}).unwrap();
        let target = PathBuf::from(result["projectPath"].as_str().unwrap());
        assert_eq!(
            fs::read(target.join("Assets/Scene.txt")).unwrap(),
            b"real template bytes"
        );
        assert!(!target.join("Library").exists());
        assert!(
            fs::read_to_string(target.join("ProjectSettings/ProjectVersion.txt"))
                .unwrap()
                .contains("2022.3.51f1c1")
        );
        assert!(
            create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {})
                .unwrap_err()
                .contains("PROJECT_EXISTS")
        );
    }
    #[test]
    fn catalog_details_preserve_real_dependencies_and_compressed_archive_size() {
        let (_, editor) = fixture();
        package(&editor, &[("package/package.json", br#"{"name":"com.gamecowork.owned","type":"template","displayName":"Owned","description":"Actual description","version":"1.2.3","dependencies":{"com.unity.textmeshpro":"3.0.6","com.unity.collab-proxy":"1.13.5"}}"#)]);
        let archive = fs::read(template_directory(&editor).unwrap().join("owned.tgz")).unwrap();
        let list = catalog(&editor).unwrap();
        let details = &list["templates"][0];
        assert_eq!(details["description"], "Actual description");
        assert_eq!(details["version"], "1.2.3");
        assert_eq!(details["size"], archive.len());
        assert_eq!(
            details["archiveSha256"],
            format!("{:x}", Sha256::digest(&archive))
        );
        assert_eq!(
            details["packages"],
            json!([
                {"name":"com.unity.collab-proxy","packageName":"com.unity.collab-proxy","version":"1.13.5"},
                {"name":"com.unity.textmeshpro","packageName":"com.unity.textmeshpro","version":"3.0.6"}
            ])
        );
        assert!(details["buildPlatforms"].is_null());
        assert!(details["renderPipeline"].is_null());
    }
    #[test]
    fn corrupt_unrelated_archives_do_not_block_valid_catalog_or_creation() {
        let (root, editor) = fixture();
        valid(&editor);
        let directory = template_directory(&editor).unwrap();
        fs::write(directory.join("corrupt.tgz"), b"incomplete download").unwrap();
        fs::write(directory.join("README.txt"), b"not a template").unwrap();
        let list = catalog(&editor).unwrap();
        assert_eq!(list["templates"].as_array().unwrap().len(), 1);
        assert_eq!(list["skippedTemplates"].as_array().unwrap().len(), 1);
        assert_eq!(list["skippedTemplates"][0]["archive"], "corrupt.tgz");
        assert!(!list["skippedTemplates"][0]["error"]
            .as_str()
            .unwrap()
            .is_empty());
        let result = create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {}).unwrap();
        assert_eq!(result["created"], true);
        assert_eq!(
            fs::read(root.join("Owned Project/Packages/manifest.json")).unwrap(),
            br#"{"dependencies":{}}"#
        );
    }
    #[test]
    fn hub_local_categories_preview_and_case_insensitive_extension_are_preserved() {
        for (package_type, category) in [
            ("template", "CORE"),
            ("CORE", "CORE"),
            ("SAMPLE", "SAMPLE"),
            ("LEARNING", "LEARNING"),
        ] {
            let (root, editor) = fixture();
            let metadata = json!({"name":"com.gamecowork.owned","type":package_type,"displayName":"Owned (Preview)","version":"1.2.3"});
            let bytes = serde_json::to_vec(&metadata).unwrap();
            package(&editor, &[
                ("package/package.json", &bytes),
                ("package/ProjectData~/Assets/Scene.txt", b"unchanged sample"),
                ("package/ProjectData~/Packages/manifest.json", br#"{"dependencies":{"com.gamecowork.sample":"1.0.0"},"scopedRegistries":[]}"#),
            ]);
            let directory = template_directory(&editor).unwrap();
            fs::rename(directory.join("owned.tgz"), directory.join("owned.TGZ")).unwrap();
            let list = catalog(&editor).unwrap();
            let row = &list["templates"][0];
            assert_eq!(row["type"], category);
            assert_eq!(row["displayName"], "Owned");
            assert_eq!(row["isPreview"], true);
            assert_eq!(list["skippedTemplates"], json!([]));
            create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {}).unwrap();
            assert_eq!(
                fs::read(root.join("Owned Project/Packages/manifest.json")).unwrap(),
                br#"{"dependencies":{"com.gamecowork.sample":"1.0.0"},"scopedRegistries":[]}"#
            );
            assert_eq!(
                fs::read(root.join("Owned Project/Assets/Scene.txt")).unwrap(),
                b"unchanged sample"
            );
        }
    }
    #[test]
    fn incomplete_and_duplicate_metadata_never_becomes_a_ready_template() {
        let (root, editor) = fixture();
        for incomplete in [
            json!({"name":"com.gamecowork.owned","type":"template","version":"1.0"}),
            json!({"name":"com.gamecowork.owned","type":"template","displayName":"Owned"}),
            json!({"name":"com.gamecowork.owned","type":"template","displayName":" ","version":"1.0"}),
            json!({"name":"com.gamecowork.owned","type":"package","displayName":"Owned","version":"1.0"}),
        ] {
            let bytes = serde_json::to_vec(&incomplete).unwrap();
            package(&editor, &[("package/package.json", &bytes)]);
            let list = catalog(&editor).unwrap();
            assert_eq!(list["templates"], json!([]));
            assert_eq!(list["skippedTemplates"].as_array().unwrap().len(), 1);
            assert_eq!(
                create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {}).unwrap_err(),
                "TEMPLATE_NOT_FOUND"
            );
        }
        let bytes = br#"{"name":"com.gamecowork.owned","type":"template","displayName":"Owned","version":"1.0"}"#;
        package(
            &editor,
            &[
                ("package/package.json", bytes),
                ("package/package.json", bytes),
            ],
        );
        assert_eq!(catalog(&editor).unwrap()["templates"], json!([]));
        assert_eq!(
            create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {}).unwrap_err(),
            "TEMPLATE_NOT_FOUND"
        );
        assert!(!root.join("Owned Project").exists());
        assert!(!fs::read_dir(&root).unwrap().any(|entry| entry
            .unwrap()
            .file_name()
            .to_string_lossy()
            .starts_with(".gamecowork-create-")));
    }
    #[test]
    fn missing_dependency_metadata_is_distinct_from_an_explicit_empty_map() {
        assert_eq!(dependency_packages(&json!({"dependencies":{}})), json!([]));
        for package in [
            json!({}),
            json!({"dependencies":null}),
            json!({"dependencies":[]}),
            json!({"dependencies":{"com.gamecowork.invalid":42}}),
            json!({"dependencies":{"com.gamecowork.valid":"1.0","com.gamecowork.invalid":null}}),
        ] {
            assert!(dependency_packages(&package).is_null());
        }
    }
    #[test]
    fn cancellation_cleans_only_owned_stage_and_never_commits() {
        let (root, editor) = fixture();
        valid(&editor);
        let token = AtomicU8::new(RUNNING);
        assert!(create(&editor, &data(&root), &token, |_, _| {
            assert!(cancel(&token));
        })
        .unwrap_err()
        .contains("CANCELLED"));
        assert!(!root.join("Owned Project").exists());
        assert!(!fs::read_dir(&root).unwrap().any(|e| e
            .unwrap()
            .file_name()
            .to_string_lossy()
            .starts_with(".gamecowork-create-")));
    }
    #[test]
    fn unsafe_paths_names_and_cloud_requests_do_not_create_projects() {
        for name in ["../wrong", "NUL.txt", "bad:", "tail.", " ", "a/b"] {
            assert!(validate_name(name).is_err());
        }
        for path in [
            "package/ProjectData~/Assets/../outside",
            "package/ProjectData~/Assets/a:b",
            "/Assets/escape",
            "package\\ProjectData~\\Assets\\escape",
        ] {
            assert!(relative_source(Path::new(path)).is_err());
        }
        let (root, editor) = fixture();
        valid(&editor);
        let mut request = data(&root);
        request["uosEnabled"] = json!(true);
        assert!(create(&editor, &request, &AtomicU8::new(RUNNING), |_, _| {}).is_err());
        assert!(!root.join("Owned Project").exists());
    }
    #[test]
    fn changed_archive_and_duplicate_files_are_rejected() {
        let (root, editor) = fixture();
        valid(&editor);
        let mut request = data(&root);
        request["archiveSha256"] = json!("wrong");
        assert!(
            create(&editor, &request, &AtomicU8::new(RUNNING), |_, _| {})
                .unwrap_err()
                .contains("changed")
        );
        package(
            &editor,
            &[
                (
                    "package/package.json",
                    br#"{"name":"com.gamecowork.owned","type":"template","displayName":"Owned","version":"1.0"}"#,
                ),
                ("package/ProjectData~/Assets/a", b"one"),
                ("package/ProjectData~/Assets/A", b"two"),
            ],
        );
        assert!(
            create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {})
                .unwrap_err()
                .contains("duplicated")
        );
        assert!(!root.join("Owned Project").exists());
    }
    #[test]
    fn destination_race_preserves_the_external_directory_and_files() {
        let (root, editor) = fixture();
        valid(&editor);
        let error = create(&editor, &data(&root), &AtomicU8::new(RUNNING), |_, _| {
            if !root.join("Owned Project").exists() {
                fs::create_dir(root.join("Owned Project")).unwrap();
                fs::write(root.join("Owned Project/user.txt"), b"outside save").unwrap();
            }
        })
        .unwrap_err();
        assert!(error.contains("without replacing"));
        assert_eq!(
            fs::read(root.join("Owned Project/user.txt")).unwrap(),
            b"outside save"
        );
        assert!(!root.join("Owned Project/Assets").exists());
    }
    #[test]
    fn exact_installed_editor_identity_is_required() {
        let (root, editor) = fixture();
        let snapshot = json!([{"product":"unity","editors":[{"version":editor.version,"path":root.join("Editor")}]}]);
        assert_eq!(select_editor(&snapshot,&json!({"editorVersion":editor.version,"editorPath":root.join("Editor"),"product":"unity"})).unwrap().product,"unity");
        assert!(select_editor(
            &snapshot,
            &json!({"editorVersion":editor.version,"editorPath":"C:/foreign/Unity.exe"})
        )
        .is_err());
        assert_eq!(select_editor(&snapshot,&json!({"editorVersion":editor.version,"editorPath":editor.executable,"product":"unity"})).unwrap().executable,
            fs::canonicalize(&editor.executable).unwrap());
    }

    #[test]
    fn actual_tuanjie_namespace_templates_are_valid_and_keep_engine_identity() {
        let (root, mut editor) = fixture();
        editor.product = "tuanjie".into();
        editor.display_version = "1.6.1".into();
        package(&editor,&[("package/package.json",br#"{"name":"cn.tuanjie.template.3d","type":"template","displayName":"3D","version":"1.0"}"#),
            ("package/ProjectData~/Assets/Scene.txt",b"real engine template"),("package/ProjectData~/Packages/manifest.json",br#"{"dependencies":{}}"#)]);
        assert_eq!(
            catalog(&editor).unwrap()["templates"][0]["name"],
            "cn.tuanjie.template.3d"
        );
        let mut request = data(&root);
        request["templateName"] = json!("cn.tuanjie.template.3d");
        let created = create(&editor, &request, &AtomicU8::new(RUNNING), |_, _| {}).unwrap();
        assert_eq!(created["product"], "tuanjie");
        assert!(
            fs::read_to_string(root.join("Owned Project/ProjectSettings/ProjectVersion.txt"))
                .unwrap()
                .contains("m_TuanjieEditorVersion: 1.6.1")
        );
    }
}
