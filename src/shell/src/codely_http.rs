//! Same-origin HTTP adapters for preserved Codely clients. Media stays native;
//! task/history contracts are handled by the owned Core compatibility service.
use crate::{asset_workspace_scope, core_call, generated_assets, CoreHandle};
use axum::{
    extract::{Path, Query, Request, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
    sync::{Arc, OnceLock},
    time::Duration,
};

fn api_response(result: Value) -> Response {
    let status = result["status"]
        .as_u64()
        .and_then(|value| u16::try_from(value).ok())
        .and_then(|value| StatusCode::from_u16(value).ok())
        .unwrap_or(StatusCode::BAD_GATEWAY);
    (status, Json(result["body"].clone())).into_response()
}

struct CanvasUploadScope {
    canvas_id: String,
    authorization: Option<String>,
    editing_session: Option<String>,
}
impl CanvasUploadScope {
    fn validate(&self, core: &CoreHandle) -> Result<String, String> {
        core.codely_canvas
            .upload_scope(
                &self.canvas_id,
                self.authorization.as_deref(),
                self.editing_session.as_deref(),
            )
            .map_err(|error| error.message)
    }
}

async fn original_upload(
    core: CoreHandle,
    operation: &str,
    headers: HeaderMap,
    request: Request,
    origin: String,
    canvas_scope: Option<CanvasUploadScope>,
) -> Response {
    let kind = operation.strip_prefix("sso/upload/").unwrap_or("");
    if request.method().as_str() != "POST"
        || !matches!(
            kind,
            "image" | "video" | "audio" | "model" | "model-conversion"
        )
    {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"unsupported_original_upload"})),
        )
            .into_response();
    }
    let kind = kind.to_owned();
    let content_type = headers
        .get("content-type")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("")
        .to_owned();
    if content_type.len() > 512
        || !content_type
            .to_ascii_lowercase()
            .starts_with("multipart/form-data;")
    {
        return (
            StatusCode::UNSUPPORTED_MEDIA_TYPE,
            Json(json!({"error":"multipart_form_data_required"})),
        )
            .into_response();
    }
    let requested_scope = if let Some(context) = &canvas_scope {
        context.validate(&core)
    } else if let Some(key) = headers
        .get("X-GameCowork-Workspace")
        .and_then(|value| value.to_str().ok())
    {
        asset_workspace_scope(&core, &json!({"workspaceKey":key})).await
    } else {
        Err("The original client must capture its workspace scope".into())
    };
    let scope = match requested_scope {
        Ok(scope) => scope,
        Err(error) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({"error":"workspace_unavailable","message":error})),
            )
                .into_response()
        }
    };
    static UPLOADS: OnceLock<Arc<tokio::sync::Semaphore>> = OnceLock::new();
    let semaphore = UPLOADS
        .get_or_init(|| Arc::new(tokio::sync::Semaphore::new(2)))
        .clone();
    let Ok(Ok(_permit)) =
        tokio::time::timeout(Duration::from_secs(120), semaphore.acquire_owned()).await
    else {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({"error":"upload_queue_busy"})),
        )
            .into_response();
    };
    let bytes = match tokio::time::timeout(
        Duration::from_secs(120),
        axum::body::to_bytes(
            request.into_body(),
            generated_assets::MULTIPART_LIMIT as usize,
        ),
    )
    .await
    {
        Ok(Ok(bytes)) if !bytes.is_empty() => bytes,
        Ok(_) => {
            return (
                StatusCode::PAYLOAD_TOO_LARGE,
                Json(json!({"error":"multipart_body_invalid_or_too_large"})),
            )
                .into_response()
        }
        Err(_) => {
            return (
                StatusCode::REQUEST_TIMEOUT,
                Json(json!({"error":"multipart_upload_timed_out"})),
            )
                .into_response()
        }
    };
    let result = async {
        let home = core.paths.core_home.clone();
        let staged = tokio::task::spawn_blocking(move || generated_assets::stage_multipart(&home, &bytes)).await.map_err(|error| error.to_string())??;
        if let Some(context) = &canvas_scope {
            if context.validate(&core)? != scope { return Err("Canvas upload scope changed".to_owned()); }
        } else { asset_workspace_scope(&core, &json!({"workspaceKey":scope})).await?; }
        let registration = staged.registration(&scope);
        let data = json!({"stagingId":registration["inputId"],"byteLength":registration["byteLength"],"sha256":registration["sha256"],
            "contentType":content_type,"kind":kind,"workspaceKey":scope,"origin":origin});
        let result = core_call(&core, "_gamecowork/codelyGeneratorUpload", data, Some("default")).await;
        drop(staged);
        result
    }.await;
    match result {
        Ok(value) => api_response(value),
        Err(error) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({"error":"local_upload_unavailable","message":error})),
        )
            .into_response(),
    }
}

fn local_origin(headers: &HeaderMap, write: bool) -> Result<String, (StatusCode, Value)> {
    let host = headers
        .get("host")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("");
    let authority = host.parse::<axum::http::uri::Authority>().ok();
    let local = authority
        .as_ref()
        .is_some_and(|value| matches!(value.host(), "127.0.0.1" | "localhost" | "[::1]" | "::1"));
    let origin = format!("http://{host}");
    let supplied = headers.get("origin").and_then(|value| value.to_str().ok());
    if !local
        || supplied.is_some_and(|value| value != origin)
        || write && supplied != Some(origin.as_str())
    {
        return Err((
            StatusCode::FORBIDDEN,
            json!({"error":"local_origin_required","message":"This API accepts only the local GameCowork client","code":403}),
        ));
    }
    Ok(origin)
}

async fn json_body(request: Request, limit: usize) -> Result<Value, (StatusCode, Value)> {
    let bytes = axum::body::to_bytes(request.into_body(), limit)
        .await
        .map_err(|_| {
            (
                StatusCode::PAYLOAD_TOO_LARGE,
                json!({"error":"request_too_large","code":413}),
            )
        })?;
    if bytes.is_empty() {
        return Ok(Value::Null);
    }
    serde_json::from_slice(&bytes).map_err(|_| {
        (
            StatusCode::BAD_REQUEST,
            json!({"error":"invalid_json","code":400}),
        )
    })
}

fn media_response(bytes: Vec<u8>, mime: String, headers: &HeaderMap) -> Response {
    let total = bytes.len();
    let mut start = 0;
    let mut end = total.saturating_sub(1);
    let mut partial = false;
    if let Some(range) = headers.get("range").and_then(|value| value.to_str().ok()) {
        let parsed = (|| {
            let (left, right) = range.strip_prefix("bytes=")?.split_once('-')?;
            if left.is_empty() {
                let count: usize = right.parse().ok()?;
                if count == 0 {
                    return None;
                }
                Some((total.saturating_sub(count), total.checked_sub(1)?))
            } else {
                let first: usize = left.parse().ok()?;
                let last: usize = if right.is_empty() {
                    total.checked_sub(1)?
                } else {
                    right.parse::<usize>().ok()?.min(total.checked_sub(1)?)
                };
                (first <= last && first < total).then_some((first, last))
            }
        })();
        let Some((first, last)) = parsed else {
            return (
                StatusCode::RANGE_NOT_SATISFIABLE,
                [("Content-Range", format!("bytes */{total}"))],
            )
                .into_response();
        };
        start = first;
        end = last;
        partial = true;
    }
    let mut response = if partial {
        (StatusCode::PARTIAL_CONTENT, bytes[start..=end].to_vec()).into_response()
    } else {
        bytes.into_response()
    };
    let output = response.headers_mut();
    if let Ok(value) = mime.parse() {
        output.insert("Content-Type", value);
    }
    output.insert("Cache-Control", "no-store".parse().unwrap());
    output.insert("Accept-Ranges", "bytes".parse().unwrap());
    if partial {
        output.insert(
            "Content-Range",
            format!("bytes {start}-{end}/{total}").parse().unwrap(),
        );
    }
    response
}

pub async fn generator(
    State(core): State<CoreHandle>,
    Path(operation): Path<String>,
    Query(query): Query<HashMap<String, String>>,
    headers: HeaderMap,
    request: Request,
) -> Response {
    let method = request.method().as_str().to_owned();
    let origin = match local_origin(
        &headers,
        !matches!(method.as_str(), "GET" | "HEAD" | "OPTIONS"),
    ) {
        Ok(value) => value,
        Err((status, value)) => return (status, Json(value)).into_response(),
    };
    let segments: Vec<_> = operation.split('/').collect();
    if method == "GET"
        && (segments.first() == Some(&"local-artifacts")
            || segments.first() == Some(&"local-inputs"))
    {
        let result = async {
            let (input, metadata, filename) = match segments.as_slice() {
                ["local-artifacts", task, artifact, filename] => (false,
                    core_call(&core, "_gamecowork/assetArtifactPath", json!({"taskId":task,"artifactId":artifact}), Some("default")).await?, *filename),
                ["local-inputs", input_id, filename] => (true,
                    core_call(&core, "_gamecowork/assetInputPath", json!({"inputId":input_id,"workspaceKey":query.get("workspaceKey").map(String::as_str).unwrap_or("")}), Some("default")).await?, *filename),
                _ => return Err("Invalid owned media URL".to_owned()),
            };
            if metadata["filename"].as_str() != Some(filename) { return Err("Owned media filename does not match".into()); }
            let home = core.paths.core_home.clone();
            tokio::task::spawn_blocking(move || generated_assets::read_http_resource(&home, &metadata, input))
                .await.map_err(|error| error.to_string())?
        }.await;
        return match result {
            Ok((bytes, mime)) => media_response(bytes, mime, &headers),
            Err(error) => (
                StatusCode::NOT_FOUND,
                Json(json!({"error":"owned_media_unavailable","message":error})),
            )
                .into_response(),
        };
    }
    if operation.starts_with("sso/upload/") {
        return original_upload(core, &operation, headers, request, origin, None).await;
    }
    let body = match json_body(request, 16 * 1024 * 1024).await {
        Ok(value) => value,
        Err((status, value)) => return (status, Json(value)).into_response(),
    };
    let mut data = json!({"method":method,"path":format!("/{operation}"),"query":query,"body":body,"origin":origin});
    if operation == "sso/generate" || operation.starts_with("sso/upload/") {
        let key = match headers.get("X-GameCowork-Workspace").and_then(|value| value.to_str().ok()) {
            Some(key) => key, None => return (StatusCode::BAD_REQUEST, Json(json!({"error":"workspace_scope_required","message":"The original client must capture its local workspace"}))).into_response(),
        };
        if let Err(error) = asset_workspace_scope(&core, &json!({"workspaceKey":key})).await {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({"error":"workspace_unavailable","message":error})),
            )
                .into_response();
        }
        data["workspaceKey"] = json!(key);
    }
    let store = core.store.lock().await;
    let mut names = serde_json::Map::new();
    for workspace in store.opened() {
        let name = workspace
            .workspace_dir
            .trim_end_matches(['/', '\\'])
            .rsplit(['/', '\\'])
            .next()
            .unwrap_or(&workspace.workspace_dir)
            .to_owned();
        names.insert(workspace.workspace_key, json!(name));
    }
    for recent in store.recent() {
        let name = recent
            .path
            .trim_end_matches(['/', '\\'])
            .rsplit(['/', '\\'])
            .next()
            .unwrap_or(&recent.path)
            .to_owned();
        names.entry(recent.workspace_key).or_insert(json!(name));
    }
    drop(store);
    data["workspaceNames"] = Value::Object(names);
    match core_call(
        &core,
        "_gamecowork/codelyGeneratorApi",
        data,
        Some("default"),
    )
    .await
    {
        Ok(result) => {
            let status = result["status"]
                .as_u64()
                .and_then(|value| u16::try_from(value).ok())
                .and_then(|value| StatusCode::from_u16(value).ok())
                .unwrap_or(StatusCode::BAD_GATEWAY);
            (status, Json(result["body"].clone())).into_response()
        }
        Err(error) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({"error":"local_core_unavailable","message":error})),
        )
            .into_response(),
    }
}

pub async fn canvas(
    State(core): State<CoreHandle>,
    Path(operation): Path<String>,
    Query(query): Query<HashMap<String, String>>,
    headers: HeaderMap,
    request: Request,
) -> Response {
    let method = request.method().as_str().to_owned();
    let origin = match local_origin(
        &headers,
        !matches!(method.as_str(), "GET" | "HEAD" | "OPTIONS"),
    ) {
        Ok(value) => value,
        Err((status, value)) => return (status, Json(value)).into_response(),
    };
    if method == "GET" && operation == "local/session" {
        return Json(core.codely_canvas.local_session()).into_response();
    }
    if let Some(kind) = operation.strip_prefix("editor/upload/") {
        let context = CanvasUploadScope {
            canvas_id: headers
                .get("X-GameCowork-Canvas-ID")
                .and_then(|value| value.to_str().ok())
                .unwrap_or("")
                .to_owned(),
            authorization: headers
                .get("authorization")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
            editing_session: headers
                .get("X-GameCowork-Canvas-Session")
                .and_then(|value| value.to_str().ok())
                .map(str::to_owned),
        };
        return original_upload(
            core,
            &format!("sso/upload/{kind}"),
            headers,
            request,
            origin,
            Some(context),
        )
        .await;
    }
    let body = match json_body(request, crate::codely_canvas::MAX_REQUEST_BYTES).await {
        Ok(value) => value,
        Err((status, value)) => return (status, Json(value)).into_response(),
    };
    let authorization = headers
        .get("authorization")
        .and_then(|value| value.to_str().ok())
        .map(str::to_owned);
    let edit_session = headers
        .get("X-GameCowork-Canvas-Session")
        .and_then(|value| value.to_str().ok())
        .map(str::to_owned);
    let service = core.codely_canvas.clone();
    let read = method == "GET";
    match tokio::task::spawn_blocking(move || {
        service.handle(
            &method,
            &format!("/{operation}"),
            &query,
            body,
            authorization.as_deref(),
            edit_session.as_deref(),
        )
    })
    .await
    {
        Ok(Ok((status, mut value))) => {
            if read && (200..300).contains(&status) {
                if let Err(error) = rebase_canvas_media(&core, &origin, &mut value).await {
                    return (StatusCode::SERVICE_UNAVAILABLE, Json(json!({"code":503,
                        "message":format!("Local canvas media could not be resolved: {error}"),"mode":"local"}))).into_response();
                }
            }
            (
                StatusCode::from_u16(status).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
                Json(value),
            )
                .into_response()
        }
        Ok(Err(error)) => (
            StatusCode::from_u16(error.status).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
            Json(error.json()),
        )
            .into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"code":500,"message":error.to_string(),"mode":"local"})),
        )
            .into_response(),
    }
}

// Saved graphs retain original URLs. Only response values are rebased, after Core
// verifies the exact persisted media identity and its bytes. Never send whole
// graphs over the bounded stdio transport or replace URL substrings in user text.
fn collect_media_urls(value: &Value, urls: &mut HashSet<String>) {
    match value {
        Value::String(url)
            if url.len() <= 16 * 1024
                && url.starts_with("http://")
                && (url.contains("/api/codely-generator/local-inputs/")
                    || url.contains("/api/codely-generator/local-artifacts/")) =>
        {
            urls.insert(url.clone());
        }
        Value::Array(values) => values
            .iter()
            .for_each(|value| collect_media_urls(value, urls)),
        Value::Object(values) => values
            .values()
            .for_each(|value| collect_media_urls(value, urls)),
        _ => {}
    }
}

fn apply_media_replacements(value: &mut Value, replacements: &HashMap<String, String>) {
    match value {
        Value::String(url) => {
            if let Some(replacement) = replacements.get(url) {
                *url = replacement.clone();
            }
        }
        Value::Array(values) => values
            .iter_mut()
            .for_each(|value| apply_media_replacements(value, replacements)),
        Value::Object(values) => values
            .values_mut()
            .for_each(|value| apply_media_replacements(value, replacements)),
        _ => {}
    }
}

async fn rebase_canvas_media(
    core: &CoreHandle,
    origin: &str,
    value: &mut Value,
) -> Result<(), String> {
    let mut candidates = HashSet::new();
    collect_media_urls(value, &mut candidates);
    let candidates: Vec<_> = candidates.into_iter().collect();
    let mut replacements = HashMap::new();
    let mut offset = 0;
    while offset < candidates.len() {
        let mut end = offset;
        let mut size = 0;
        // Core verifies file bytes synchronously. Keep each RPC substantially
        // below its 512-URL protocol maximum so large media yield between batches.
        while end < candidates.len() && end - offset < 32 {
            let encoded = serde_json::to_string(&candidates[end])
                .map_err(|error| error.to_string())?
                .len()
                + 1;
            if size + encoded > 1024 * 1024 {
                break;
            }
            size += encoded;
            end += 1;
        }
        let batch = &candidates[offset..end];
        let result = core_call(
            core,
            "_gamecowork/codelyRebaseMedia",
            json!({"origin":origin,"urls":batch}),
            Some("default"),
        )
        .await?;
        let verified = result["replacements"]
            .as_object()
            .ok_or("Invalid local media resolution response")?;
        for old in batch {
            if let Some(new) = verified.get(old).and_then(Value::as_str) {
                replacements.insert(old.clone(), new.to_owned());
            }
        }
        offset = end;
    }
    apply_media_replacements(value, &replacements);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn graph_media_replacement_preserves_text_keys_and_unknown_fields() {
        let old = "http://127.0.0.1:41111/api/codely-generator/local-inputs/i_own/owned.png?workspaceKey=canvas%3Aown";
        let new = old.replace(":41111", ":42222");
        let mut graph = json!({"nodes":[{"data":{"images":[old],"prompt":format!("Reference {old}"),"future":{"number":7,"exact":old}}}],"edges":[],"viewport":{"x":7,"y":-9,"zoom":0.8}});
        graph[old] = json!("original key");
        let before = graph.clone();
        let mut urls = HashSet::new();
        collect_media_urls(&graph, &mut urls);
        assert_eq!(urls, HashSet::from([old.to_owned()]));
        apply_media_replacements(&mut graph, &HashMap::from([(old.to_owned(), new.clone())]));
        assert_eq!(graph["nodes"][0]["data"]["images"][0], new);
        assert_eq!(graph["nodes"][0]["data"]["future"]["exact"], new);
        assert_eq!(
            graph["nodes"][0]["data"]["prompt"],
            before["nodes"][0]["data"]["prompt"]
        );
        assert_eq!(graph[old], "original key");
        assert_eq!(graph["viewport"], before["viewport"]);
        assert_eq!(graph["nodes"][0]["data"]["future"]["number"], 7);
    }
}
