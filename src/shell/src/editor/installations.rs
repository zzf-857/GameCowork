use serde_json::{json, Value};
use std::path::{Path, PathBuf};

// Adapt the existing Core Hub scanner to the original installed-editor UI DTO.
// This does not register, install, uninstall or modify an editor or Hub state.
pub fn from_snapshot(snapshot: &Value) -> Result<Value, String> {
    let groups = snapshot.as_array().ok_or("Invalid Hub editor snapshot")?;
    let mut result = serde_json::Map::new();
    for group in groups {
        let product = group["product"].as_str().unwrap_or("unknown");
        for editor in group["editors"].as_array().into_iter().flatten() {
            let path = editor["path"]
                .as_str()
                .filter(|value| !value.trim().is_empty())
                .ok_or("Hub editor entry is missing its executable path")?;
            let version = editor["version"]
                .as_str()
                .filter(|value| !value.trim().is_empty())
                .ok_or("Hub editor entry is missing its registered version")?;
            let executable = PathBuf::from(path);
            let folder = executable.parent().unwrap_or(Path::new(path));
            let (modules, module_source, warning) = read_modules(folder);
            let mut platforms: Vec<Value> = modules
                .iter()
                .filter(|module| module["selected"].as_bool() == Some(true))
                .filter(|module| module["parent"].as_str().unwrap_or("").is_empty())
                .filter_map(|module| platform_name(module["id"].as_str()?).map(|name| json!(name)))
                .collect();
            let playback = folder.join("Data/PlaybackEngines");
            for (directory, label) in [
                ("windowsstandalonesupport", "Windows"),
                ("MacStandaloneSupport", "Mac"),
                ("LinuxStandaloneSupport", "Linux"),
                ("AndroidPlayer", "Android"),
                ("iOSSupport", "iOS"),
                ("WebGLSupport", "WebGL"),
                ("OpenHarmonyPlayer", "OpenHarmony"),
                ("WeixinMiniGameSupport", "MiniGame"),
                ("PlayableAdsSupport", "PlayableAds"),
            ] {
                if playback.join(directory).is_dir() && !platforms.iter().any(|item| item == label)
                {
                    platforms.push(json!(label));
                }
            }
            let marketing = if product == "tuanjie" {
                editor["tuanjie_editor_version"]
                    .as_str()
                    .filter(|value| valid_marketing_version(value, version))
            } else {
                None
            };
            let display = marketing.unwrap_or(version);
            let key = format!("{product}:{version}:{path}");
            result.insert(key, json!({
                "version": version, "editorVersion": version, "semver": display,
                "technicalVersion": version, "unityVersion": version,
                "marketingVersion": marketing, "tuanjieVersion": marketing,
                "displayVersion": display,
                "versionInfoSource": if marketing.is_some() { Some("core.tuanjie_editor_version") } else { None },
                "versionInfoWarning": if product == "tuanjie" && marketing.is_none() { Some("Tuanjie release version mapping is unavailable; showing the technical Editor version") } else { None },
                "path": path, "location": [path], "folderPath": folder.to_string_lossy(),
                "product": product, "architecture": editor["architecture"].as_str().unwrap_or("x86_64"),
                "overallStatus": "INSTALL_FINISHED", "isDownloadCorrupted": false,
                "manual": true, "modules": modules, "buildPlatformShortNames": platforms,
                "moduleInfoAvailable": module_source.is_some(), "moduleInfoSource": module_source,
                "moduleInfoWarning": warning,
                "localDiscovery": true
            }));
        }
    }
    Ok(Value::Object(result))
}

fn valid_marketing_version(value: &str, technical: &str) -> bool {
    if value.is_empty()
        || value.len() > 128
        || value != value.trim()
        || value == technical
        || !value
            .bytes()
            .all(|c| c.is_ascii_alphanumeric() || matches!(c, b'.' | b'-' | b'+'))
    {
        return false;
    }
    let base = value.split(['-', '+']).next().unwrap_or("");
    let parts: Vec<_> = base.split('.').collect();
    parts.len() == 3
        && parts
            .iter()
            .all(|part| !part.is_empty() && part.parse::<u32>().is_ok())
}

fn read_modules(editor_folder: &Path) -> (Vec<Value>, Option<String>, Option<String>) {
    let Some(install_folder) = editor_folder.parent() else {
        return (
            Vec::new(),
            None,
            Some("Installed module metadata is unavailable".into()),
        );
    };
    let path = install_folder.join("modules.json");
    let metadata = match std::fs::metadata(&path) {
        Ok(metadata) if metadata.is_file() && metadata.len() <= 4 * 1024 * 1024 => metadata,
        Ok(_) => {
            return (
                Vec::new(),
                None,
                Some("Installed module metadata is not a bounded file".into()),
            )
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            return (
                Vec::new(),
                None,
                Some("Installed module metadata is unavailable".into()),
            );
        }
        Err(error) => {
            return (
                Vec::new(),
                None,
                Some(format!("Cannot inspect installed module metadata: {error}")),
            )
        }
    };
    let _ = metadata;
    let parsed = std::fs::read(&path)
        .map_err(|error| error.to_string())
        .and_then(|bytes| {
            serde_json::from_slice::<Vec<Value>>(&bytes).map_err(|error| error.to_string())
        });
    match parsed {
        Ok(modules)
            if modules
                .iter()
                .all(|module| module.is_object() && module["id"].as_str().is_some()) =>
        {
            (modules, Some(path.to_string_lossy().into_owned()), None)
        }
        Ok(_) => (
            Vec::new(),
            None,
            Some("Invalid installed module metadata entries".into()),
        ),
        Err(error) => (
            Vec::new(),
            None,
            Some(format!("Cannot read installed module metadata: {error}")),
        ),
    }
}

fn platform_name(id: &str) -> Option<&'static str> {
    match id {
        "windows-mono" | "windows-il2cpp" | "windows" => Some("Windows"),
        "mac-mono" | "mac-il2cpp" | "mac" => Some("Mac"),
        "linux-mono" | "linux-il2cpp" | "linux" => Some("Linux"),
        "android" => Some("Android"),
        "ios" => Some("iOS"),
        "webgl" => Some("WebGL"),
        "openharmony" => Some("OpenHarmony"),
        "minigame" | "weixinminigame" | "weixin-mini-game" => Some("MiniGame"),
        "playableads" | "playable-ads" => Some("PlayableAds"),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn fixture_root() -> PathBuf {
        let unique = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = PathBuf::from("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-installations-rust")
            .join(format!("{}-{unique}", std::process::id()));
        std::fs::create_dir_all(&root).unwrap();
        root
    }
    #[test]
    fn original_card_arrays_and_engine_identity_are_preserved() {
        let root = fixture_root();
        let install = root.join("Tuanjie 1");
        let folder = install.join("Editor");
        std::fs::create_dir_all(&folder).unwrap();
        std::fs::write(install.join("modules.json"), br#"[{"id":"ios","selected":true},{"id":"android","selected":false},{"id":"ios-child","parent":"ios","selected":true}]"#).unwrap();
        let exe = folder.join("Tuanjie.exe");
        let rows = from_snapshot(&json!([{"product":"tuanjie","editors":[{"path":exe,"version":"2022.3.62t16","tuanjie_editor_version":"1.10.4"}]},{"product":"unity","editors":[{"path":folder.join("Unity.exe"),"version":"2022.3.62t16"}]}])).unwrap();
        assert_eq!(rows.as_object().unwrap().len(), 2);
        let row = rows
            .as_object()
            .unwrap()
            .values()
            .find(|row| row["product"] == "tuanjie")
            .unwrap();
        assert_eq!(row["location"], json!([exe]));
        assert_eq!(row["folderPath"], json!(folder));
        assert_eq!(row["semver"], "1.10.4");
        assert_eq!(row["marketingVersion"], "1.10.4");
        assert_eq!(row["tuanjieVersion"], "1.10.4");
        assert_eq!(row["technicalVersion"], "2022.3.62t16");
        assert_eq!(row["version"], "2022.3.62t16");
        assert_eq!(row["buildPlatformShortNames"], json!(["iOS"]));
        assert_eq!(row["modules"].as_array().unwrap().len(), 3);
        assert_eq!(row["manual"], true);
    }
    #[test]
    fn technical_fallback_is_never_mislabeled_as_a_tuanjie_release_version() {
        let root = fixture_root();
        let exe = root.join("Tuanjie.exe");
        for release in [
            json!(null),
            json!("2022.3.62t16"),
            json!("invalid"),
            json!("1.10.4"),
        ] {
            let rows = from_snapshot(&json!([{"product":"tuanjie","editors":[{"path":exe,"version":"2022.3.62t16","tuanjie_editor_version":release}]}])).unwrap();
            let (key, row) = rows.as_object().unwrap().iter().next().unwrap();
            assert!(key.starts_with("tuanjie:2022.3.62t16:"));
            assert_eq!(row["version"], "2022.3.62t16");
            if release == "1.10.4" {
                assert_eq!(row["displayVersion"], "1.10.4");
                assert!(row["versionInfoWarning"].is_null());
            } else {
                assert!(row["marketingVersion"].is_null());
                assert!(row["tuanjieVersion"].is_null());
                assert_eq!(row["displayVersion"], "2022.3.62t16");
                assert!(row["versionInfoWarning"].is_string());
            }
        }
    }
    #[test]
    fn missing_or_corrupt_metadata_does_not_invent_installed_modules() {
        let root = fixture_root();
        let folder = root.join("Editor");
        std::fs::create_dir(&folder).unwrap();
        for contents in [None, Some("not json")] {
            if let Some(contents) = contents {
                std::fs::write(root.join("modules.json"), contents).unwrap();
            }
            let rows = from_snapshot(&json!([{"product":"unity","editors":[{"path":folder.join("Unity.exe"),"version":"2022.3.1f1"}]}])).unwrap();
            let row = rows.as_object().unwrap().values().next().unwrap();
            assert_eq!(row["location"].as_array().unwrap().len(), 1);
            assert_eq!(row["moduleInfoAvailable"], false);
            assert!(row["moduleInfoWarning"].as_str().unwrap().len() > 0);
            assert_eq!(row["modules"], json!([]));
            assert_eq!(row["buildPlatformShortNames"], json!([]));
        }
    }
    #[test]
    fn malformed_scanner_rows_are_actionable_errors() {
        assert!(from_snapshot(&json!({})).is_err());
        assert!(from_snapshot(&json!([{"editors":[{"version":"x"}]}])).is_err());
    }
}
