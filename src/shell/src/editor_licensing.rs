//! Workspace permission is not evidence of an activated Unity/Tuanjie license.
//! The local host never reads license files, credentials, or official account APIs.

use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EditorLicenseScope {
    product: &'static str,
    scope: &'static str,
    status: &'static str,
    is_valid: Option<bool>,
    manager: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EditorLicenseStatus {
    mode: &'static str,
    scope: &'static str,
    workspace_allowed: bool,
    is_valid: Option<bool>,
    editor_license_valid: Option<bool>,
    licenses: Vec<Value>,
    editor_scopes: Vec<EditorLicenseScope>,
}

pub fn status() -> Value {
    serde_json::to_value(EditorLicenseStatus {
        mode: "local",
        scope: "gamecowork-workspace",
        workspace_allowed: true,
        is_valid: None,
        editor_license_valid: None,
        licenses: Vec::new(),
        editor_scopes: vec![
            EditorLicenseScope {
                product: "unity",
                scope: "unity-editor",
                status: "not-detected",
                is_valid: None,
                manager: "official-unity-hub",
            },
            EditorLicenseScope {
                product: "tuanjie",
                scope: "tuanjie-editor",
                status: "not-detected",
                is_valid: None,
                manager: "official-tuanjie-hub",
            },
        ],
    })
    .expect("Static Editor license status must serialize")
}

pub fn reject_mutation(_kind: &str) -> Result<Value, String> {
    Err("GameCowork does not apply for, activate, import, configure, or return Unity/Tuanjie Editor licenses. Unity licenses must be managed in the official Unity Hub; Tuanjie licenses must be managed separately in the official Tuanjie Hub. Local workspace permission is not an activated Editor license.".into())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn local_workspace_permission_never_claims_an_editor_license() {
        let value = status();
        assert_eq!(value["workspaceAllowed"], true);
        assert!(value["isValid"].is_null());
        assert!(value["editorLicenseValid"].is_null());
        assert_eq!(value["licenses"], serde_json::json!([]));
        for scope in value["editorScopes"].as_array().unwrap() {
            assert_eq!(scope["status"], "not-detected");
            assert!(scope["isValid"].is_null());
        }
        assert_ne!(
            value["editorScopes"][0]["scope"],
            value["editorScopes"][1]["scope"]
        );
    }

    #[test]
    fn mutations_are_refused_without_changing_status() {
        let before = status();
        for kind in [
            "tjhub/activateLicense",
            "tjhub/activatePersonalLicense",
            "tjhub/generateLicenseRequest",
            "tjhub/importLicenseFile",
            "tjhub/returnLicense",
            "tjhub/updateServerConfig",
        ] {
            let error = reject_mutation(kind).unwrap_err();
            assert!(error.contains("Unity"));
            assert!(error.contains("Tuanjie"));
            assert!(error.contains("official"));
        }
        assert_eq!(status(), before);
    }
}
