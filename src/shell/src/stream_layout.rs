use serde_json::{json, Value};
fn source_identity(value: &Value) -> Result<Option<(String, String)>, String> {
    match (
        value["workspaceKey"].as_str(),
        value["workspaceRoot"].as_str(),
    ) {
        (None, None)
            if value.get("workspaceKey").is_none() && value.get("workspaceRoot").is_none() =>
        {
            Ok(None)
        }
        (Some(key), Some(root))
            if !key.is_empty()
                && key.len() <= 8192
                && (key == "default" || key.starts_with("local:"))
                && !root.is_empty()
                && root.len() <= 4096
                && !root.contains('\0')
                && !root.contains("://") =>
        {
            Ok(Some((key.to_owned(), root.to_owned())))
        }
        _ => Err("Editor slot must retain a complete local workspace identity".into()),
    }
}
fn retain_identity(target: &mut Value, identity: Option<(String, String)>) {
    if let Some((key, root)) = identity {
        target["workspaceKey"] = json!(key);
        target["workspaceRoot"] = json!(root);
    }
}
fn capture_mode(value: &Value) -> Result<Option<&str>, String> {
    match value.get("captureMode") {
        None => Ok(None),
        Some(Value::String(mode))
            if matches!(mode.as_str(), "render-content" | "editor-window") =>
        {
            Ok(Some(mode))
        }
        _ => Err("Editor layout capture mode is invalid".into()),
    }
}
pub fn parse(contents: &str) -> Result<Value, String> {
    if contents.len() > 64 * 1024 {
        return Err("Editor layout exceeds 64 KiB".into());
    }
    let source: Value =
        serde_json::from_str(contents).map_err(|_| "Editor layout is not valid JSON")?;
    if source["kind"] != "gamecowork.unity-composite-layout" || source["version"] != 1 {
        return Err("Editor layout format is unsupported".into());
    }
    let tabs = source["tabs"]
        .as_array()
        .filter(|tabs| !tabs.is_empty() && tabs.len() <= 16)
        .ok_or("Editor layout needs 1 to 16 tabs")?;
    let mut saved_tabs = vec![];
    for tab in tabs {
        let view = tab["viewType"]
            .as_str()
            .filter(|s| !s.is_empty() && s.len() <= 256)
            .ok_or("Invalid Editor tab type")?;
        let label = tab["label"].as_str().unwrap_or(view);
        if label.len() > 512 {
            return Err("Editor tab label is too long".into());
        }
        let mut saved = json!({"viewType":view,"label":label});
        if let Some(mode) = capture_mode(tab)? {
            saved["captureMode"] = json!(mode);
        }
        retain_identity(&mut saved, source_identity(tab)?);
        saved_tabs.push(saved);
    }
    let mut slots = vec![];
    if let Some(values) = source["slots"].as_array() {
        if values.len() > 16 {
            return Err("Editor layout has too many slots".into());
        }
        for slot in values {
            let view = slot["viewType"]
                .as_str()
                .ok_or("Editor slot type is missing")?;
            let identity = source_identity(slot)?;
            let tab = tabs
                .iter()
                .find(|tab| {
                    tab["viewType"] == view
                        && tab["workspaceKey"] == slot["workspaceKey"]
                        && tab["workspaceRoot"] == slot["workspaceRoot"]
                })
                .ok_or("Editor slot references an unknown tab")?;
            let tab_mode = capture_mode(tab)?;
            let slot_mode = capture_mode(slot)?;
            if tab_mode.is_some() && slot_mode.is_some() && tab_mode != slot_mode {
                return Err("Editor slot capture mode does not match its tab".into());
            }
            let mut rect = serde_json::Map::new();
            for field in ["x", "y", "w", "h"] {
                let number = slot["rect"][field]
                    .as_f64()
                    .filter(|n| n.is_finite() && *n >= 0.0 && *n <= 1.0)
                    .ok_or("Editor slot rectangle must be normalized")?;
                if matches!(field, "w" | "h") && number == 0.0 {
                    return Err("Editor slot must have a positive size".into());
                }
                rect.insert(field.into(), json!(number));
            }
            let mut saved = json!({"viewType":view,"rect":rect});
            if let Some(mode) = slot_mode.or(tab_mode) {
                saved["captureMode"] = json!(mode);
            }
            retain_identity(&mut saved, identity);
            slots.push(saved);
        }
    }
    // Only geometry, labels, capture modes and fixed local workspace identity persist. URLs, process
    // IDs and transient stream/session metadata are never copied to preferences.
    let mut result = json!({"kind":"gamecowork.unity-composite-layout","version":1,"tabs":saved_tabs,"slots":slots});
    for key in [
        "layoutPreset",
        "focusedViewType",
        "savedAt",
        "focusedWorkspaceKey",
    ] {
        if let Some(value) = source[key].as_str() {
            if value.len()
                > if key == "focusedWorkspaceKey" {
                    8192
                } else {
                    256
                }
            {
                return Err("Editor layout metadata is too long".into());
            }
            result[key] = json!(value);
        }
    }
    Ok(result)
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn complete_window_mode_survives_layout_without_transient_window_identity() {
        let input = json!({"kind":"gamecowork.unity-composite-layout","version":1,
            "tabs":[{"viewType":"scene_view","captureMode":"editor-window","instanceId":-42}],
            "slots":[{"viewType":"scene_view","rect":{"x":0,"y":0,"w":1,"h":1},"captureEpoch":"secret","geometryRevision":2}]});
        let saved = parse(&input.to_string()).unwrap();
        assert_eq!(saved["tabs"][0]["captureMode"], "editor-window");
        assert_eq!(saved["slots"][0]["captureMode"], "editor-window");
        assert!(saved["tabs"][0].get("instanceId").is_none());
        assert!(!saved.to_string().contains("secret"));
        assert!(saved["slots"][0].get("geometryRevision").is_none());
    }
    #[test]
    fn invalid_or_conflicting_capture_modes_are_rejected() {
        let base = json!({"kind":"gamecowork.unity-composite-layout","version":1,
            "tabs":[{"viewType":"scene","captureMode":"editor-window"}],
            "slots":[{"viewType":"scene","captureMode":"render-content","rect":{"x":0,"y":0,"w":1,"h":1}}]});
        assert!(parse(&base.to_string()).is_err());
        for mode in [json!(null), json!("native-unsupported"), json!(3)] {
            let mut input = base.clone();
            input["tabs"][0]["captureMode"] = mode;
            assert!(parse(&input.to_string()).is_err());
        }
    }
    #[test]
    fn layout_roundtrip_retains_geometry_without_connection_secrets() {
        let input = json!({"kind":"gamecowork.unity-composite-layout","version":1,"tabs":[{"viewType":"scene","label":"Scene","signalingUrl":"secret"}],"slots":[{"viewType":"scene","rect":{"x":0,"y":0,"w":1,"h":1},"serverUrl":"secret"}],"signalingUrl":"secret"});
        let saved = parse(&input.to_string()).unwrap();
        assert_eq!(saved["slots"][0]["rect"]["w"], 1.0);
        assert!(!saved.to_string().contains("secret"));
    }
    #[test]
    fn malformed_layout_never_becomes_a_saved_success() {
        for input in [
            json!({}),
            json!({"kind":"gamecowork.unity-composite-layout","version":1,"tabs":[]}),
            json!({"kind":"gamecowork.unity-composite-layout","version":1,"tabs":[{"viewType":"scene"}],"slots":[{"viewType":"scene","rect":{"x":0,"y":0,"w":0,"h":1}}]}),
        ] {
            assert!(parse(&input.to_string()).is_err());
        }
    }
    #[test]
    fn same_view_in_two_projects_keeps_identity_and_discards_runtime_capabilities() {
        let input = json!({"kind":"gamecowork.unity-composite-layout","version":1,
          "tabs":[{"viewType":"scene_view","workspaceKey":"local:a","workspaceRoot":"F:/A","label":"A"},
                  {"viewType":"scene_view","workspaceKey":"local:b","workspaceRoot":"F:/B","label":"B"}],
          "slots":[{"viewType":"scene_view","workspaceKey":"local:a","workspaceRoot":"F:/A","rect":{"x":0,"y":0,"w":0.5,"h":1},"serverUrl":"secret","pid":123},
                   {"viewType":"scene_view","workspaceKey":"local:b","workspaceRoot":"F:/B","rect":{"x":0.5,"y":0,"w":0.5,"h":1}}],"focusedWorkspaceKey":"local:b"});
        let saved = parse(&input.to_string()).unwrap();
        assert_eq!(saved["tabs"][1]["workspaceKey"], "local:b");
        assert_eq!(saved["slots"][0]["workspaceRoot"], "F:/A");
        assert!(!saved.to_string().contains("secret"));
        assert!(saved["slots"][0].get("pid").is_none());
    }
    #[test]
    fn incomplete_remote_or_mismatched_slot_identity_is_rejected() {
        let base = json!({"kind":"gamecowork.unity-composite-layout","version":1,"tabs":[{"viewType":"scene"}]});
        for identity in [
            json!({"workspaceKey":"local:a"}),
            json!({"workspaceKey":"remote:a","workspaceRoot":"F:/A"}),
        ] {
            let mut input = base.clone();
            input["tabs"][0] = identity;
            input["tabs"][0]["viewType"] = json!("scene");
            assert!(parse(&input.to_string()).is_err());
        }
        let mut input = base;
        input["slots"] = json!([{"viewType":"scene","workspaceKey":"local:b","workspaceRoot":"F:/B","rect":{"x":0,"y":0,"w":1,"h":1}}]);
        assert!(parse(&input.to_string()).is_err());
    }
}
