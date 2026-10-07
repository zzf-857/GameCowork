//! Native export of an internally identified, completed generation artifact.
//! Client paths never grant read access; exports reuse workspace mutations.
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    fs,
    io::{Read, Write},
    path::{Path, PathBuf},
};
pub const LIMIT: u64 = 64 * 1024 * 1024;
pub const MULTIPART_LIMIT: u64 = LIMIT + 256 * 1024;

pub struct StagedInput {
    path: PathBuf,
    file: Option<fs::File>,
    input_id: String,
    filename: String,
    byte_length: usize,
    sha256: String,
}

impl StagedInput {
    pub fn registration(&self, workspace_key: &str) -> Value {
        json!({"inputId":self.input_id,"filename":self.filename,"byteLength":self.byte_length,
            "sha256":self.sha256,"workspaceKey":workspace_key})
    }
}

impl Drop for StagedInput {
    fn drop(&mut self) {
        // This UUID file was created exclusively by this upload. Never walk or
        // remove a replacement directory tree during cancellation/error cleanup.
        drop(self.file.take());
        if plain_tree(&self.path).is_ok() {
            let _ = fs::remove_file(&self.path);
        }
    }
}

pub fn stage_input(core_home: &Path, filename: &str, bytes: &[u8]) -> Result<StagedInput, String> {
    stage_payload(core_home, filename, bytes, LIMIT)
}

pub fn stage_multipart(core_home: &Path, bytes: &[u8]) -> Result<StagedInput, String> {
    stage_payload(
        core_home,
        "original-client-upload.multipart",
        bytes,
        MULTIPART_LIMIT,
    )
}

fn stage_payload(
    core_home: &Path,
    filename: &str,
    bytes: &[u8],
    limit: u64,
) -> Result<StagedInput, String> {
    if filename.is_empty()
        || filename.chars().count() > 255
        || filename.len() > 1024
        || filename
            .chars()
            .any(|c| c.is_control() || c == '/' || c == '\\')
        || matches!(filename, "." | "..")
    {
        return Err("Reference filename must be a bounded plain filename".into());
    }
    if bytes.is_empty() || bytes.len() as u64 > limit {
        return Err("Reference payload is empty or exceeds its byte budget".into());
    }
    plain_tree(core_home)?;
    let mut directory = core_home.to_path_buf();
    for name in ["generator", "incoming"] {
        directory.push(name);
        match fs::create_dir(&directory) {
            Ok(()) => {}
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {}
            Err(error) => return Err(error.to_string()),
        }
        plain_tree(&directory)?;
        if !directory.is_dir() {
            return Err("Reference upload storage is not a directory".into());
        }
    }
    let input_id = format!("i_{}", uuid::Uuid::new_v4());
    let path = directory.join(format!("{input_id}.bin"));
    let mut options = fs::OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        use windows_sys::Win32::Storage::FileSystem::{
            FILE_FLAG_OPEN_REPARSE_POINT, FILE_SHARE_READ,
        };
        options
            .share_mode(FILE_SHARE_READ)
            .custom_flags(FILE_FLAG_OPEN_REPARSE_POINT);
    }
    let file = options.open(&path).map_err(|e| e.to_string())?;
    let mut staged = StagedInput {
        path,
        file: Some(file),
        input_id,
        filename: filename.to_owned(),
        byte_length: bytes.len(),
        sha256: format!("{:x}", Sha256::digest(bytes)),
    };
    let file = staged.file.as_mut().unwrap();
    file.write_all(bytes).map_err(|e| e.to_string())?;
    file.sync_all().map_err(|e| e.to_string())?;
    Ok(staged)
}
fn plain_tree(path: &Path) -> Result<(), String> {
    let mut current = Some(path);
    while let Some(part) = current {
        let meta = fs::symlink_metadata(part).map_err(|e| e.to_string())?;
        if meta.file_type().is_symlink() {
            return Err("Generated asset storage cannot use links".into());
        }
        #[cfg(windows)]
        {
            use std::os::windows::fs::MetadataExt;
            if meta.file_attributes() & 0x400 != 0 {
                return Err("Generated asset storage cannot use reparse points".into());
            }
        }
        current = part.parent();
    }
    Ok(())
}
struct VerifiedAsset {
    bytes: Vec<u8>,
    sha256: String,
}

// Both export and HTTP previews read the same verified file. Media bytes never
// need to pass through Core's bounded stdio message channel.
fn read_verified_asset(core_home: &Path, metadata: &Value) -> Result<VerifiedAsset, String> {
    read_verified_file(core_home, metadata, "assets")
}

fn read_verified_file(
    core_home: &Path,
    metadata: &Value,
    area: &str,
) -> Result<VerifiedAsset, String> {
    let root = core_home.join("generator").join(area);
    plain_tree(&root)?;
    let source = PathBuf::from(
        metadata["path"]
            .as_str()
            .ok_or("Owned artifact path missing")?,
    );
    plain_tree(&source)?;
    let actual_root = root.canonicalize().map_err(|e| e.to_string())?;
    let actual = source.canonicalize().map_err(|e| e.to_string())?;
    if !actual.starts_with(&actual_root) {
        return Err("Artifact is outside generation storage".into());
    }
    let mut options = fs::OpenOptions::new();
    options.read(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        use windows_sys::Win32::Storage::FileSystem::{
            FILE_FLAG_OPEN_REPARSE_POINT, FILE_SHARE_READ,
        };
        options
            .share_mode(FILE_SHARE_READ)
            .custom_flags(FILE_FLAG_OPEN_REPARSE_POINT);
    }
    let file = options.open(&actual).map_err(|e| e.to_string())?;
    let info = file.metadata().map_err(|e| e.to_string())?;
    if !info.is_file() || info.len() > LIMIT || Some(info.len()) != metadata["byteLength"].as_u64()
    {
        return Err("Artifact size is invalid or changed".into());
    }
    #[cfg(windows)]
    {
        use std::os::windows::io::AsRawHandle;
        use windows_sys::Win32::Storage::FileSystem::{
            GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION,
        };
        let mut identity = std::mem::MaybeUninit::<BY_HANDLE_FILE_INFORMATION>::uninit();
        if unsafe { GetFileInformationByHandle(file.as_raw_handle(), identity.as_mut_ptr()) } == 0 {
            return Err(std::io::Error::last_os_error().to_string());
        }
        let identity = unsafe { identity.assume_init() };
        if identity.nNumberOfLinks != 1 || identity.dwFileAttributes & 0x400 != 0 {
            return Err("Generated asset storage cannot use linked files".into());
        }
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::MetadataExt;
        if info.nlink() != 1 {
            return Err("Generated asset storage cannot use linked files".into());
        }
    }
    let mut bytes = Vec::with_capacity(info.len() as usize);
    file.take(LIMIT + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > LIMIT || Some(bytes.len() as u64) != metadata["byteLength"].as_u64() {
        return Err("Artifact size changed while reading".into());
    }
    let sha256 = format!("{:x}", Sha256::digest(&bytes));
    if metadata["sha256"].as_str() != Some(sha256.as_str()) {
        return Err("Artifact changed before reading".into());
    }
    Ok(VerifiedAsset { bytes, sha256 })
}

pub fn read_resource(core_home: &Path, metadata: &Value) -> Result<Value, String> {
    resource_value(read_verified_asset(core_home, metadata)?, metadata)
}

pub fn read_input_resource(core_home: &Path, metadata: &Value) -> Result<Value, String> {
    resource_value(read_verified_file(core_home, metadata, "inputs")?, metadata)
}

pub fn owned_media_extension(mime: &str) -> Option<&'static str> {
    match mime {
        "image/png" => Some("png"),
        "image/jpeg" => Some("jpg"),
        "image/webp" => Some("webp"),
        "image/x-exr" => Some("exr"),
        "image/vnd.radiance" => Some("hdr"),
        "video/mp4" => Some("mp4"),
        "video/webm" => Some("webm"),
        "audio/wav" => Some("wav"),
        "audio/mpeg" => Some("mp3"),
        "audio/aac" => Some("aac"),
        "audio/flac" => Some("flac"),
        "audio/ogg" => Some("ogg"),
        "audio/mp4" => Some("m4a"),
        "model/gltf-binary" => Some("glb"),
        "application/vnd.autodesk.fbx" | "model/fbx" => Some("fbx"),
        "model/obj" => Some("obj"),
        "model/stl" => Some("stl"),
        "model/vnd.usdz+zip" => Some("usdz"),
        "application/zip" => Some("zip"),
        "application/json" => Some("json"),
        "text/plain" => Some("txt"),
        _ => None,
    }
}

pub fn read_http_resource(
    core_home: &Path,
    metadata: &Value,
    input: bool,
) -> Result<(Vec<u8>, String), String> {
    let asset = read_verified_file(core_home, metadata, if input { "inputs" } else { "assets" })?;
    let mime = metadata["mime"]
        .as_str()
        .ok_or("Owned media MIME missing")?;
    if owned_media_extension(mime).is_none() {
        return Err("Owned media MIME is unsupported".into());
    }
    Ok((asset.bytes, mime.to_owned()))
}

// A save-dialog selection grants only this new local file. Keep directory
// handles open on Windows so an ancestor cannot be renamed into a junction
// between checking the path and creating the destination.
struct DownloadDestination {
    path: PathBuf,
    _ancestors: Vec<fs::File>,
}

fn download_destination(path: &Path) -> Result<DownloadDestination, String> {
    if !path.is_absolute()
        || path.components().any(|part| {
            matches!(
                part,
                std::path::Component::ParentDir | std::path::Component::CurDir
            )
        })
    {
        return Err("Download destination must be an absolute local file".into());
    }
    #[cfg(windows)]
    if !matches!(path.components().next(), Some(std::path::Component::Prefix(prefix))
        if matches!(prefix.kind(), std::path::Prefix::Disk(_) | std::path::Prefix::VerbatimDisk(_)))
    {
        return Err("Download destination must use a local drive".into());
    }
    let name = path
        .file_name()
        .and_then(|value| value.to_str())
        .ok_or("Download filename is missing")?;
    validate_download_filename(name)?;
    let parent = path.parent().ok_or("Download directory is missing")?;
    plain_tree(parent)?;
    if !parent.is_dir() {
        return Err("Download directory does not exist".into());
    }
    let mut ancestors = Vec::new();
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        use windows_sys::Win32::Storage::FileSystem::{
            FILE_FLAG_BACKUP_SEMANTICS, FILE_FLAG_OPEN_REPARSE_POINT, FILE_SHARE_READ,
            FILE_SHARE_WRITE,
        };
        for directory in parent.ancestors() {
            let mut options = fs::OpenOptions::new();
            options
                .read(true)
                .share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE)
                .custom_flags(FILE_FLAG_BACKUP_SEMANTICS | FILE_FLAG_OPEN_REPARSE_POINT);
            let handle = options.open(directory).map_err(|error| error.to_string())?;
            let metadata = handle.metadata().map_err(|error| error.to_string())?;
            use std::os::windows::fs::MetadataExt;
            if !metadata.is_dir() || metadata.file_attributes() & 0x400 != 0 {
                return Err("Download directory cannot use reparse points".into());
            }
            ancestors.push(handle);
        }
    }
    let canonical = parent.canonicalize().map_err(|error| error.to_string())?;
    plain_tree(&canonical)?;
    Ok(DownloadDestination {
        path: canonical.join(name),
        _ancestors: ancestors,
    })
}

pub fn validate_download_filename(name: &str) -> Result<(), String> {
    let stem = name.split('.').next().unwrap_or("").to_ascii_uppercase();
    if name.is_empty()
        || name.chars().count() > 255
        || name.len() > 1024
        || name.chars().any(|c| {
            c.is_control() || matches!(c, '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|')
        })
        || name.ends_with(['.', ' '])
        || matches!(name, "." | "..")
        || matches!(stem.as_str(), "CON" | "PRN" | "AUX" | "NUL")
        || (stem.starts_with("COM") || stem.starts_with("LPT"))
            && stem.len() == 4
            && matches!(stem.as_bytes()[3], b'1'..=b'9')
    {
        return Err("Download filename must be a bounded plain filename".into());
    }
    Ok(())
}

// Tests may choose a dialog result only within their explicit isolated tree.
// This does not create a directory or grant renderer-supplied path access.
pub fn check_download_test_path(path: &Path, test_root: &Path) -> Result<(), String> {
    plain_tree(test_root)?;
    let target = download_destination(path)?;
    let root = test_root
        .canonicalize()
        .map_err(|error| error.to_string())?;
    if !target.path.starts_with(&root) {
        return Err("Download fixture must stay inside the isolated test tree".into());
    }
    if path.exists() {
        plain_tree(path)?;
    }
    Ok(())
}

pub fn save_native_resource(
    core_home: &Path,
    metadata: &Value,
    input: bool,
    path: &Path,
) -> Result<Value, (&'static str, String)> {
    // Re-read the verified bytes after the user finishes the dialog. A stale
    // preview or a previously checked hash never authorizes changed content.
    let (bytes, _) = read_http_resource(core_home, metadata, input)
        .map_err(|error| ("download_source_changed", error))?;
    let destination =
        download_destination(path).map_err(|error| ("download_write_failed", error))?;
    let mut options = fs::OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        use windows_sys::Win32::Storage::FileSystem::FILE_FLAG_OPEN_REPARSE_POINT;
        options
            .share_mode(0)
            .custom_flags(FILE_FLAG_OPEN_REPARSE_POINT);
    }
    let mut file = options.open(&destination.path).map_err(|error| {
        (
            if error.kind() == std::io::ErrorKind::AlreadyExists {
                "download_destination_exists"
            } else {
                "download_write_failed"
            },
            error.to_string(),
        )
    })?;
    file.write_all(&bytes)
        .and_then(|_| file.sync_all())
        .map_err(|error| {
            (
                "download_write_failed",
                format!("Download was not completed; a partial selected file may remain: {error}"),
            )
        })?;
    Ok(
        json!({"ok":true,"path":path.to_string_lossy(),"byteLength":bytes.len(),
        "sha256":format!("{:x}", Sha256::digest(&bytes))}),
    )
}

fn resource_value(asset: VerifiedAsset, metadata: &Value) -> Result<Value, String> {
    let mime = metadata["mime"]
        .as_str()
        .ok_or("Owned artifact MIME missing")?;
    let filename = metadata["filename"]
        .as_str()
        .ok_or("Owned artifact filename missing")?;
    Ok(
        json!({"base64":crate::files::base64(&asset.bytes), "mime":mime,
        "filename":filename, "byteLength":asset.bytes.len(), "sha256":asset.sha256}),
    )
}

pub fn export(
    core_home: &Path,
    metadata: &Value,
    mutations: crate::mutations::Mutations,
    relative: &str,
    overwrite: bool,
    expected: Option<&str>,
) -> Result<Value, String> {
    if relative.is_empty()
        || relative.len() > 2048
        || Path::new(relative).is_absolute()
        || relative.contains('\\')
        || relative.contains(':')
        || relative
            .split('/')
            .any(|x| x.is_empty() || x == "." || x == "..")
    {
        return Err("Export needs a normalized workspace-relative file path".into());
    }
    if overwrite && expected.is_none() {
        return Err("Overwriting requires the exact existing file SHA256".into());
    }
    if !overwrite && expected.is_some() {
        return Err("A non-overwriting export cannot replace an existing version".into());
    }
    let VerifiedAsset { bytes, sha256: sha } = read_verified_asset(core_home, metadata)?;
    if let Some(parent) = Path::new(relative)
        .parent()
        .filter(|parent| !parent.as_os_str().is_empty())
    {
        mutations
            .mkdir(parent.to_string_lossy().as_ref())
            .map_err(|e| e.to_string())?;
    }
    let result = mutations
        .write_generated_bytes(relative, &bytes, if overwrite { expected } else { None })
        .map_err(|e| e.to_string())?;
    Ok(
        json!({"path":result["path"],"byteLength":bytes.len(),"sha256":sha,"created":!overwrite,"changeId":result["changeId"],"mutation":result}),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Fixture {
        root: PathBuf,
        home: PathBuf,
        file: PathBuf,
    }
    impl Fixture {
        fn new() -> Self {
            let root = PathBuf::from(
                "F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests",
            )
            .join(format!("generated-resource-{}", uuid::Uuid::new_v4()));
            let home = root.join("owned-core-home");
            let file = home.join("generator/assets/owned-task/owned.png");
            fs::create_dir_all(file.parent().unwrap()).unwrap();
            Self { root, home, file }
        }
        fn metadata(&self, bytes: &[u8]) -> Value {
            json!({"path":self.file, "mime":"image/png", "filename":"owned.png",
                "byteLength":bytes.len(), "sha256":format!("{:x}",Sha256::digest(bytes))})
        }
        fn mutations(&self) -> crate::mutations::Mutations {
            let project = self.root.join("owned-project");
            fs::create_dir_all(&project).unwrap();
            crate::mutations::Mutations::new(&project, &self.root.join("changes")).unwrap()
        }
    }

    #[test]
    fn expanded_media_transport_keeps_verified_bytes_and_rejects_stale_or_active_content() {
        let fixture = Fixture::new();
        let bytes = b"Core-verified audio/model/text payload";
        fs::write(&fixture.file, bytes).unwrap();
        for mime in [
            "audio/wav",
            "audio/mpeg",
            "model/obj",
            "application/zip",
            "text/plain",
            "image/x-exr",
        ] {
            let mut metadata = fixture.metadata(bytes);
            metadata["mime"] = json!(mime);
            assert_eq!(
                read_http_resource(&fixture.home, &metadata, false).unwrap(),
                (bytes.to_vec(), mime.to_owned())
            );
            metadata["sha256"] = json!("0".repeat(64));
            assert!(read_http_resource(&fixture.home, &metadata, false).is_err());
        }
        let mut metadata = fixture.metadata(bytes);
        metadata["mime"] = json!("text/html");
        assert!(read_http_resource(&fixture.home, &metadata, false)
            .unwrap_err()
            .contains("unsupported"));
        assert_eq!(owned_media_extension("audio/ogg"), Some("ogg"));
        assert_eq!(owned_media_extension("model/vnd.usdz+zip"), Some("usdz"));
    }

    #[test]
    fn native_download_writes_exact_artifact_and_never_overwrites_existing_files() {
        let fixture = Fixture::new();
        let bytes = b"actual owned media bytes";
        fs::write(&fixture.file, bytes).unwrap();
        let metadata = fixture.metadata(bytes);
        let destination = fixture.root.join("native-download.png");
        let result = save_native_resource(&fixture.home, &metadata, false, &destination).unwrap();
        assert_eq!(result["ok"], true);
        assert_eq!(result["byteLength"], bytes.len());
        assert_eq!(result["sha256"], metadata["sha256"]);
        assert_eq!(fs::read(&destination).unwrap(), bytes);
        fs::write(&destination, b"user's existing file").unwrap();
        let error =
            save_native_resource(&fixture.home, &metadata, false, &destination).unwrap_err();
        assert_eq!(error.0, "download_destination_exists");
        assert_eq!(fs::read(&destination).unwrap(), b"user's existing file");
        let hardlink = fixture.root.join("existing-alias.png");
        fs::hard_link(&destination, &hardlink).unwrap();
        assert_eq!(
            save_native_resource(&fixture.home, &metadata, false, &hardlink)
                .unwrap_err()
                .0,
            "download_destination_exists"
        );
        assert_eq!(fs::read(&destination).unwrap(), b"user's existing file");
    }

    #[test]
    fn native_download_rechecks_source_integrity_and_input_area_before_creation() {
        let fixture = Fixture::new();
        let bytes = b"owned input bytes";
        let input = fixture.home.join("generator/inputs/input.png");
        fs::create_dir_all(input.parent().unwrap()).unwrap();
        fs::write(&input, bytes).unwrap();
        let mut metadata = fixture.metadata(bytes);
        metadata["path"] = json!(input);
        let target = fixture.root.join("downloaded-input.png");
        assert_eq!(
            save_native_resource(&fixture.home, &metadata, false, &target)
                .unwrap_err()
                .0,
            "download_source_changed"
        );
        assert!(!target.exists());
        fs::write(&input, b"tampered content").unwrap();
        assert_eq!(
            save_native_resource(&fixture.home, &metadata, true, &target)
                .unwrap_err()
                .0,
            "download_source_changed"
        );
        assert!(!target.exists());
        fs::write(&input, bytes).unwrap();
        save_native_resource(&fixture.home, &metadata, true, &target).unwrap();
        assert_eq!(fs::read(&target).unwrap(), bytes);
    }

    #[test]
    fn download_fixture_paths_and_suggestions_cannot_escape_their_boundaries() {
        let fixture = Fixture::new();
        let inside = fixture.root.join("safe-output.png");
        assert!(check_download_test_path(&inside, &fixture.root).is_ok());
        assert!(check_download_test_path(
            &fixture.root.parent().unwrap().join("outside.png"),
            &fixture.root
        )
        .is_err());
        assert!(
            check_download_test_path(&fixture.root.join("../outside.png"), &fixture.root).is_err()
        );
        assert!(check_download_test_path(Path::new("relative.png"), &fixture.root).is_err());
        for name in [
            "../file.png",
            "CON.png",
            "LPT1.webm",
            "a.png:secret",
            "file.",
            "file ",
            "a\\b.png",
        ] {
            assert!(validate_download_filename(name).is_err(), "{name}");
        }
        assert!(validate_download_filename("参考图.png").is_ok());
    }

    #[test]
    fn staged_input_is_private_metadata_and_cleanup_keeps_unrelated_files() {
        let fixture = Fixture::new();
        let staged = stage_input(&fixture.home, "参考图.png", b"owned uploaded bytes").unwrap();
        let metadata = staged.registration("owned-workspace");
        assert_eq!(metadata["filename"], "参考图.png");
        assert_eq!(metadata["workspaceKey"], "owned-workspace");
        assert_eq!(metadata["byteLength"], 20);
        assert!(metadata.get("path").is_none());
        assert!(metadata.get("base64").is_none());
        let expected_path = fixture
            .home
            .join("generator/incoming")
            .join(format!("{}.bin", metadata["inputId"].as_str().unwrap()));
        assert_eq!(staged.path, expected_path);
        assert_eq!(fs::read(&expected_path).unwrap(), b"owned uploaded bytes");
        let keep = expected_path.parent().unwrap().join("keep.txt");
        fs::write(&keep, b"keep unrelated file").unwrap();
        drop(staged);
        assert!(!expected_path.exists());
        assert_eq!(fs::read(keep).unwrap(), b"keep unrelated file");
    }

    #[test]
    fn invalid_upload_names_sizes_and_storage_do_not_create_reference_files() {
        let fixture = Fixture::new();
        for name in [
            "",
            ".",
            "..",
            "../escape",
            "C:\\outside.png",
            "a/b.png",
            "a\n.png",
        ] {
            assert!(stage_input(&fixture.home, name, b"owned").is_err());
        }
        assert!(stage_input(&fixture.home, "owned.png", b"").is_err());
        assert!(stage_input(&fixture.home, "owned.png", &vec![0; LIMIT as usize + 1]).is_err());
        let incoming = fixture.home.join("generator/incoming");
        assert!(!incoming.exists());
        fs::write(&incoming, b"not a directory").unwrap();
        assert!(stage_input(&fixture.home, "owned.png", b"owned").is_err());
        assert_eq!(fs::read(&incoming).unwrap(), b"not a directory");
    }

    #[test]
    fn input_previews_are_confined_to_the_input_area() {
        let fixture = Fixture::new();
        let bytes = b"owned reference media";
        let file = fixture.home.join("generator/inputs/i_owned.bin");
        fs::create_dir_all(file.parent().unwrap()).unwrap();
        fs::write(&file, bytes).unwrap();
        let mut metadata = fixture.metadata(bytes);
        metadata["path"] = json!(file);
        assert_eq!(
            read_input_resource(&fixture.home, &metadata).unwrap()["base64"],
            crate::files::base64(bytes)
        );
        assert!(read_resource(&fixture.home, &metadata).is_err());
        fs::write(&fixture.file, bytes).unwrap();
        let output_metadata = fixture.metadata(bytes);
        assert!(read_input_resource(&fixture.home, &output_metadata).is_err());
        fs::write(&file, b"changed reference bytes").unwrap();
        assert!(read_input_resource(&fixture.home, &metadata).is_err());
    }

    #[test]
    fn native_resource_encodes_actual_large_bytes_without_core_frame_or_internal_path() {
        let fixture = Fixture::new();
        // Media validation belongs to Core collection. This fixture exercises
        // native transport/integrity with actual 13 MiB owned file bytes.
        let bytes = vec![0u8; 13 * 1024 * 1024];
        fs::write(&fixture.file, &bytes).unwrap();
        let metadata = fixture.metadata(&bytes);
        let result = read_resource(&fixture.home, &metadata).unwrap();
        let encoded = result["base64"].as_str().unwrap();
        assert!(encoded.len() > 16 * 1024 * 1024);
        assert_eq!(encoded.len(), bytes.len().div_ceil(3) * 4);
        assert!(encoded.ends_with("=="));
        assert!(encoded[..encoded.len() - 2]
            .bytes()
            .all(|byte| byte == b'A'));
        assert_eq!(result["sha256"], metadata["sha256"]);
        assert_eq!(result["byteLength"], metadata["byteLength"]);
        assert_eq!(result["mime"], "image/png");
        assert_eq!(result["filename"], "owned.png");
        assert!(result.get("path").is_none());
    }

    #[test]
    fn read_accepts_exact_64_mib_but_rejects_larger_files_before_reading() {
        let fixture = Fixture::new();
        let file = fs::File::create(&fixture.file).unwrap();
        file.set_len(LIMIT).unwrap();
        drop(file);
        let mut hasher = Sha256::new();
        let block = vec![0u8; 1024 * 1024];
        for _ in 0..64 {
            hasher.update(&block);
        }
        let metadata = json!({"path":fixture.file, "byteLength":LIMIT,
            "sha256":format!("{:x}",hasher.finalize())});
        assert_eq!(
            read_verified_asset(&fixture.home, &metadata)
                .unwrap()
                .bytes
                .len() as u64,
            LIMIT
        );
        let file = fs::OpenOptions::new()
            .write(true)
            .open(&fixture.file)
            .unwrap();
        file.set_len(LIMIT + 1).unwrap();
        drop(file);
        let mut oversized = metadata;
        oversized["byteLength"] = json!(LIMIT + 1);
        assert!(read_verified_asset(&fixture.home, &oversized)
            .err()
            .unwrap()
            .contains("size"));
    }

    #[test]
    fn previews_and_exports_share_hash_validation_before_any_workspace_write() {
        let fixture = Fixture::new();
        let metadata = fixture.metadata(b"original bytes");
        fs::write(&fixture.file, b"tampered bytes").unwrap();
        assert!(read_resource(&fixture.home, &metadata)
            .unwrap_err()
            .contains("changed"));
        assert!(export(
            &fixture.home,
            &metadata,
            fixture.mutations(),
            "nested/output.png",
            false,
            None
        )
        .unwrap_err()
        .contains("changed"));
        assert!(!fixture.root.join("owned-project/nested").exists());
        fs::write(&fixture.file, b"original bytes").unwrap();
        let result = export(
            &fixture.home,
            &metadata,
            fixture.mutations(),
            "nested/output.png",
            false,
            None,
        )
        .unwrap();
        assert_eq!(
            fs::read(fixture.root.join("owned-project/nested/output.png")).unwrap(),
            b"original bytes"
        );
        assert_eq!(result["sha256"], metadata["sha256"]);
        assert!(export(
            &fixture.home,
            &metadata,
            fixture.mutations(),
            "nested/output.png",
            false,
            None
        )
        .is_err());
    }

    #[test]
    fn changed_size_outside_paths_and_hardlinks_are_not_native_resources() {
        let fixture = Fixture::new();
        let bytes = b"owned bytes";
        fs::write(&fixture.file, bytes).unwrap();
        let metadata = fixture.metadata(bytes);
        let mut wrong_size = metadata.clone();
        wrong_size["byteLength"] = json!(bytes.len() + 1);
        assert!(read_resource(&fixture.home, &wrong_size)
            .unwrap_err()
            .contains("size"));
        let outside = fixture.home.join("generator/assets-neighbor/file.png");
        fs::create_dir_all(outside.parent().unwrap()).unwrap();
        fs::write(&outside, bytes).unwrap();
        let mut escaped = metadata.clone();
        escaped["path"] = json!(outside);
        assert!(read_resource(&fixture.home, &escaped)
            .unwrap_err()
            .contains("outside"));
        let alias = fixture.root.join("linked-resource.png");
        fs::hard_link(&fixture.file, alias).unwrap();
        assert!(read_resource(&fixture.home, &metadata)
            .unwrap_err()
            .contains("linked"));
    }
}
