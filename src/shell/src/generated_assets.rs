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

pub fn read_http_resource(
    core_home: &Path,
    metadata: &Value,
    input: bool,
) -> Result<(Vec<u8>, String), String> {
    let asset = read_verified_file(core_home, metadata, if input { "inputs" } else { "assets" })?;
    let mime = metadata["mime"]
        .as_str()
        .ok_or("Owned media MIME missing")?;
    if !matches!(
        mime,
        "image/png"
            | "image/jpeg"
            | "image/webp"
            | "video/mp4"
            | "video/webm"
            | "model/gltf-binary"
    ) {
        return Err("Owned media MIME is unsupported".into());
    }
    Ok((asset.bytes, mime.to_owned()))
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
            let root = PathBuf::from("F:/AI/AgentMake/temp/GameCowork/tests")
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
