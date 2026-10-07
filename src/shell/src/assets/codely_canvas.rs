//! Local compatibility service for the preserved Canvas client.
//!
//! The cached index-A8ll_iBT.js defines Mm/Nm/Pm/Fm/Lm/zm (assets),
//! Bm/Rm/Vm (versions), and xV/SV/CV (browser editing leases). Their JSON
//! envelope is {code:0,data:...}; graph `data` on writes is a JSON string.
//! Graphs are kept intact, including unknown node.data and top-level fields.
//! No original platform identity, model schema, template or organization data
//! is inferred. This service touches only its caller-selected application root.
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::{BTreeMap, HashMap, HashSet},
    fs,
    io::Read,
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use uuid::Uuid;

pub const MAX_GRAPH_BYTES: usize = 16 * 1024 * 1024;
pub const MAX_REQUEST_BYTES: usize = 34 * 1024 * 1024;
const MAX_STORE_BYTES: usize = 128 * 1024 * 1024;
const MAX_ASSETS: usize = 256;
const MAX_VERSIONS: usize = 100;
const LEASE_TTL: Duration = Duration::from_secs(30);

#[derive(Debug)]
pub struct CanvasError {
    pub status: u16,
    pub message: String,
}
impl CanvasError {
    fn new(status: u16, message: impl Into<String>) -> Self {
        Self {
            status,
            message: message.into(),
        }
    }
    pub fn json(&self) -> Value {
        json!({"code":self.status,"message":self.message,"mode":"local"})
    }
}
type Result<T> = std::result::Result<T, CanvasError>;

#[derive(Clone, Serialize, Deserialize)]
struct Version {
    id: String,
    version: u64,
    message: String,
    created_at: String,
    graph: String,
}
#[derive(Clone, Serialize, Deserialize)]
struct Asset {
    id: String,
    name: String,
    description: String,
    image_url: String,
    created_at: String,
    updated_at: String,
    graph: String,
    versions: Vec<Version>,
}
impl Asset {
    fn metadata(&self) -> Value {
        json!({"id":self.id,"name":self.name,"type":"json","description":self.description,
            "image_url":self.image_url,"created_at":self.created_at,"updated_at":self.updated_at,
            "size":self.graph.len(),"org_id":null,"mode":"local"})
    }
}
#[derive(Clone, Serialize, Deserialize)]
struct DiskState {
    schema: u32,
    assets: BTreeMap<String, Asset>,
}
struct Lease {
    owner: String,
    expires: Instant,
}
struct State {
    disk: DiskState,
    disk_sha: Option<String>,
    leases: HashMap<String, Lease>,
}
#[derive(Clone)]
pub struct LocalCanvasService {
    root: Arc<PathBuf>,
    bearer: Arc<String>,
    state: Arc<Mutex<State>>,
}

impl LocalCanvasService {
    pub fn new(root: PathBuf) -> std::result::Result<Self, String> {
        if !root.is_absolute() {
            return Err("Local Canvas root must be absolute".into());
        }
        plain_tree(&root).map_err(|e| e.message)?;
        fs::create_dir_all(&root).map_err(|e| e.to_string())?;
        plain_tree(&root).map_err(|e| e.message)?;
        let root = root.canonicalize().map_err(|e| e.to_string())?;
        let file = root.join("canvases.json");
        let bytes = read_store(&file).map_err(|e| e.message)?;
        let disk = match &bytes {
            Some(bytes) => serde_json::from_slice::<DiskState>(bytes)
                .map_err(|_| "Local Canvas store is invalid; it was not overwritten".to_string())?,
            None => DiskState {
                schema: 1,
                assets: BTreeMap::new(),
            },
        };
        validate_disk(&disk).map_err(|e| e.message)?;
        Ok(Self {
            root: Arc::new(root),
            bearer: Arc::new(Uuid::new_v4().to_string()),
            state: Arc::new(Mutex::new(State {
                disk,
                disk_sha: bytes.as_ref().map(|bytes| sha(bytes)),
                leases: HashMap::new(),
            })),
        })
    }

    pub fn local_session(&self) -> Value {
        json!({"mode":"local","user":{"id":"gamecowork-local","username":"GameCowork 本地用户","role":"local"},
            "session":{"id":self.bearer.as_str(),"scope":"gamecowork-canvas-local"}})
    }

    /// This is an application-cache ownership key, never a workspace/project
    /// path or permission. The graph's workspaceHash is not consulted.
    pub fn upload_scope(
        &self,
        canvas: &str,
        authorization: Option<&str>,
        edit_session: Option<&str>,
    ) -> Result<String> {
        if authorization != Some(format!("Bearer {}", self.bearer).as_str()) {
            return Err(CanvasError::new(
                401,
                "A current GameCowork local Canvas session is required",
            ));
        }
        let id = canvas_id(canvas)?;
        let mut state = self
            .state
            .lock()
            .map_err(|_| CanvasError::new(503, "Local Canvas state is unavailable"))?;
        let now = Instant::now();
        state.leases.retain(|_, lease| lease.expires > now);
        if !state.disk.assets.contains_key(id) {
            return Err(CanvasError::new(404, "Local Canvas asset not found"));
        }
        check_lease(&state, id, edit_session, true)?;
        Ok(format!("canvas:{id}"))
    }

    /// `authorization` is the running host's Bearer UUID. `edit_session` is
    /// the separate Canvas document editing-owner header.
    /// Original wm lacks this header, so the local API boundary supplies it;
    /// possession of the host Bearer alone never grants a graph write lease.
    pub fn handle(
        &self,
        method: &str,
        path: &str,
        query: &HashMap<String, String>,
        body: Value,
        authorization: Option<&str>,
        edit_session: Option<&str>,
    ) -> Result<(u16, Value)> {
        self.handle_at(
            method,
            path,
            query,
            body,
            authorization,
            edit_session,
            Instant::now(),
        )
    }

    fn handle_at(
        &self,
        method: &str,
        path: &str,
        query: &HashMap<String, String>,
        body: Value,
        authorization: Option<&str>,
        edit_session: Option<&str>,
        now: Instant,
    ) -> Result<(u16, Value)> {
        let path = path
            .strip_prefix("/codely-canvas/api")
            .or_else(|| path.strip_prefix("/api"))
            .unwrap_or(path);
        if path.contains(['%', '\\', '?', '#'])
            || path.split('/').any(|part| part == "." || part == "..")
        {
            return Err(CanvasError::new(400, "Invalid local Canvas API path"));
        }
        if method == "GET" && matches!(path, "/v1/templates" | "/v1/templates/random") {
            return Ok((
                200,
                json!({"code":0,"data":[],"mode":"local","source":"local-template-collection"}),
            ));
        }
        if path.starts_with("/v1/organizations")
            || path.starts_with("/v1/collab")
            || path.starts_with("/v1/ai-models")
            || path.starts_with("/v1/models")
            || path.starts_with("/v1/auth")
            || path.starts_with("/v1/templates/")
        {
            return Err(CanvasError::new(501, "This platform/organization/template/model service is not connected in GameCowork local mode"));
        }
        if authorization != Some(format!("Bearer {}", self.bearer).as_str()) {
            return Err(CanvasError::new(
                401,
                "A current GameCowork local Canvas session is required",
            ));
        }
        if serde_json::to_vec(&body)
            .map_err(|_| CanvasError::new(400, "Invalid request JSON"))?
            .len()
            > MAX_REQUEST_BYTES
        {
            return Err(CanvasError::new(
                413,
                "Local Canvas request exceeds its byte budget",
            ));
        }
        let parts: Vec<_> = path.trim_start_matches('/').split('/').collect();
        let mut state = self
            .state
            .lock()
            .map_err(|_| CanvasError::new(503, "Local Canvas state is unavailable"))?;
        state.leases.retain(|_, lease| lease.expires > now);
        if parts.len() >= 3 && parts[0] == "v1" && parts[1] == "canvas-locks" {
            return self.lease(&mut state, method, &parts[2..], body, now);
        }
        if parts.first() != Some(&"v1") || parts.get(1) != Some(&"assets") {
            return Err(CanvasError::new(
                501,
                "Local Canvas API operation is not implemented",
            ));
        }
        if parts.len() == 2 {
            return match method {
                "GET" => {
                    let page = page_value(query, "page", 1, 100_000)?;
                    let page_size = page_value(query, "page_size", 100, 100)?;
                    let mut assets: Vec<_> = state.disk.assets.values().collect();
                    assets.sort_by(|a, b| {
                        b.updated_at
                            .cmp(&a.updated_at)
                            .then_with(|| a.id.cmp(&b.id))
                    });
                    let total = assets.len();
                    let items: Vec<_> = assets
                        .into_iter()
                        .skip((page - 1) * page_size)
                        .take(page_size)
                        .map(Asset::metadata)
                        .collect();
                    success(json!({"items":items,"total":total,"page":page,"page_size":page_size}))
                }
                "POST" => {
                    object(&body)?;
                    if state.disk.assets.len() >= MAX_ASSETS {
                        return Err(CanvasError::new(409,"Local Canvas collection reached its capacity; existing graphs were preserved"));
                    }
                    if body["type"] != "json" {
                        return Err(CanvasError::new(400, "Canvas assets require type json"));
                    }
                    let graph = graph_input(&body["data"])?;
                    let time = timestamp();
                    let id = Uuid::new_v4().to_string();
                    let asset = Asset {
                        id: id.clone(),
                        name: field(&body, "name", 256, true)?,
                        description: optional_field(&body, "description", 8192)?
                            .unwrap_or_default(),
                        image_url: optional_field(&body, "image_url", 8192)?.unwrap_or_default(),
                        created_at: time.clone(),
                        updated_at: time,
                        graph,
                        versions: Vec::new(),
                    };
                    let result = asset.metadata();
                    let mut next = state.disk.clone();
                    next.assets.insert(id, asset);
                    self.commit(&mut state, next)?;
                    Ok((201, envelope(result)))
                }
                _ => Err(CanvasError::new(
                    405,
                    "Method is not supported for the local Canvas collection",
                )),
            };
        }
        let id = canvas_id(parts[2])?;
        let asset = state
            .disk
            .assets
            .get(id)
            .ok_or_else(|| CanvasError::new(404, "Local Canvas asset not found"))?
            .clone();
        match (method,&parts[3..]) {
            ("GET",[]) => success(asset.metadata()),
            ("GET",["download"]) => success(parse_graph(&asset.graph)?),
            ("GET",["versions"]) => success(Value::Array(asset.versions.iter().rev().map(|v|json!({"id":v.id,"version":v.version,"message":v.message,"created_at":v.created_at})).collect())),
            ("PUT",[]) => {
                object(&body)?;
                let graph=body.get("data").map(graph_input).transpose()?;
                check_lease(&state,id,edit_session,graph.is_some())?;
                if !["name","description","image_url","data"].iter().any(|key|body.get(*key).is_some()) { return Err(CanvasError::new(400,"Canvas update is empty")); }
                let mut next=state.disk.clone();let target=next.assets.get_mut(id).unwrap();
                if body.get("name").is_some(){target.name=field(&body,"name",256,true)?;}
                if let Some(value)=optional_field(&body,"description",8192)?{target.description=value;}
                if let Some(value)=optional_field(&body,"image_url",8192)?{target.image_url=value;}
                if let Some(graph)=graph{target.graph=graph;}target.updated_at=timestamp();
                let result=target.metadata();self.commit(&mut state,next)?;success(result)
            }
            ("DELETE",[]) => {
                check_lease(&state,id,edit_session,false)?;let mut next=state.disk.clone();next.assets.remove(id);self.commit(&mut state,next)?;state.leases.remove(id);success(json!({"deleted":true,"id":id}))
            }
            ("POST",["commit"]) => {
                check_lease(&state,id,edit_session,true)?;object(&body)?;
                let message=optional_field(&body,"message",2048)?.unwrap_or_default();
                let mut next=state.disk.clone();let target=next.assets.get_mut(id).unwrap();let version=add_version(target,message)?;
                self.commit(&mut state,next)?;success(json!({"version":version}))
            }
            ("POST",["versions",version,"restore"]) => {
                check_lease(&state,id,edit_session,true)?;
                let version=version.parse::<u64>().ok().filter(|value|*value>0).ok_or_else(||CanvasError::new(400,"Invalid Canvas version"))?;
                let restored=asset.versions.iter().find(|v|v.version==version).ok_or_else(||CanvasError::new(404,"Local Canvas version not found"))?.graph.clone();
                let mut next=state.disk.clone();let target=next.assets.get_mut(id).unwrap();
                let preserved=add_version(target,format!("恢复 v{version} 前的本地快照"))?;
                target.graph=restored;target.updated_at=timestamp();self.commit(&mut state,next)?;
                success(json!({"restored":true,"version":version,"previous_graph_version":preserved}))
            }
            _ => Err(CanvasError::new(501,"Local Canvas asset operation is not implemented")),
        }
    }

    fn lease(
        &self,
        state: &mut State,
        method: &str,
        parts: &[&str],
        body: Value,
        now: Instant,
    ) -> Result<(u16, Value)> {
        let id = canvas_id(parts[0])?;
        if !state.disk.assets.contains_key(id) {
            return Err(CanvasError::new(404, "Local Canvas asset not found"));
        }
        let owner = field(&body, "session_id", 128, true)?;
        valid_edit_session(&owner)?;
        match (method, &parts[1..]) {
            ("POST", ["acquire"]) => {
                let force = match body.get("force") {
                    None => false,
                    Some(Value::Bool(v)) => *v,
                    _ => return Err(CanvasError::new(400, "force must be a boolean")),
                };
                if state
                    .leases
                    .get(id)
                    .is_some_and(|lease| lease.owner != owner)
                    && !force
                {
                    return success(json!({"acquired":false,"can_force":true}));
                }
                state.leases.insert(
                    id.into(),
                    Lease {
                        owner,
                        expires: now + LEASE_TTL,
                    },
                );
                success(json!({"acquired":true,"can_force":true,"lease_ms":LEASE_TTL.as_millis()}))
            }
            ("POST", ["heartbeat"]) => {
                let lease = state
                    .leases
                    .get_mut(id)
                    .filter(|lease| lease.owner == owner)
                    .ok_or_else(|| {
                        CanvasError::new(409, "Canvas lock not found for this browser session")
                    })?;
                lease.expires = now + LEASE_TTL;
                success(json!({"renewed":true,"lease_ms":LEASE_TTL.as_millis()}))
            }
            ("DELETE", []) => {
                if state
                    .leases
                    .get(id)
                    .is_some_and(|lease| lease.owner != owner)
                {
                    return Err(CanvasError::new(
                        409,
                        "Canvas lock belongs to another browser session",
                    ));
                }
                success(json!({"released":state.leases.remove(id).is_some()}))
            }
            _ => Err(CanvasError::new(405, "Canvas lock method is not supported")),
        }
    }

    fn commit(&self, state: &mut State, next: DiskState) -> Result<()> {
        plain_tree(&self.root)?;
        let file = self.root.join("canvases.json");
        let existing = read_store(&file)?;
        if existing.as_ref().map(|bytes| sha(bytes)) != state.disk_sha {
            return Err(CanvasError::new(
                409,
                "Local Canvas storage changed outside this service; existing data was preserved",
            ));
        }
        let encoded = serde_json::to_vec_pretty(&next)
            .map_err(|_| CanvasError::new(400, "Canvas state could not be encoded"))?;
        if encoded.len() > MAX_STORE_BYTES {
            return Err(CanvasError::new(
                413,
                "Local Canvas store reached its byte budget; existing graphs were preserved",
            ));
        }
        crate::workspaces::write_json_atomic(&file, &next).map_err(|_| {
            CanvasError::new(
                500,
                "Local Canvas storage could not be saved; previous data was preserved",
            )
        })?;
        state.disk = next;
        state.disk_sha = Some(sha(&encoded));
        Ok(())
    }
}

fn success(data: Value) -> Result<(u16, Value)> {
    Ok((200, envelope(data)))
}
fn envelope(data: Value) -> Value {
    json!({"code":0,"data":data,"mode":"local"})
}
fn sha(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
fn object(value: &Value) -> Result<()> {
    if value.is_object() {
        Ok(())
    } else {
        Err(CanvasError::new(400, "A JSON object is required"))
    }
}
fn field(body: &Value, key: &str, limit: usize, required: bool) -> Result<String> {
    let value = body[key]
        .as_str()
        .ok_or_else(|| CanvasError::new(400, format!("{key} must be text")))?;
    if value.len() > limit
        || required && value.trim().is_empty()
        || value.chars().any(|c| {
            c.is_control()
                && !(["message", "description"].contains(&key) && matches!(c, '\n' | '\r' | '\t'))
        })
    {
        return Err(CanvasError::new(
            400,
            format!("{key} is invalid or exceeds its text budget"),
        ));
    }
    Ok(value.into())
}
fn optional_field(body: &Value, key: &str, limit: usize) -> Result<Option<String>> {
    if body.get(key).is_none() {
        Ok(None)
    } else {
        field(body, key, limit, false).map(Some)
    }
}
fn canvas_id(value: &str) -> Result<&str> {
    if Uuid::parse_str(value)
        .ok()
        .is_some_and(|id| id.to_string() == value)
    {
        Ok(value)
    } else {
        Err(CanvasError::new(400, "Invalid local Canvas asset ID"))
    }
}
fn valid_edit_session(value: &str) -> Result<()> {
    if value.is_empty()
        || value.len() > 128
        || !value
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'-' | b'_' | b'.'))
    {
        Err(CanvasError::new(400, "Invalid browser editing session"))
    } else {
        Ok(())
    }
}
fn check_lease(state: &State, id: &str, owner: Option<&str>, required: bool) -> Result<()> {
    if let Some(owner) = owner {
        valid_edit_session(owner)?;
    }
    match state.leases.get(id) {
        Some(lease) if Some(lease.owner.as_str()) == owner => Ok(()),
        Some(_) => Err(CanvasError::new(
            423,
            "Canvas is locked by another browser editing session",
        )),
        None if required => Err(CanvasError::new(
            409,
            "Canvas lock not found; acquire the editing lease before saving",
        )),
        None => Ok(()),
    }
}
fn page_value(
    query: &HashMap<String, String>,
    key: &str,
    default: usize,
    max: usize,
) -> Result<usize> {
    match query.get(key) {
        None => Ok(default),
        Some(raw) => raw
            .parse::<usize>()
            .ok()
            .filter(|v| *v > 0 && *v <= max)
            .ok_or_else(|| CanvasError::new(400, format!("Invalid {key}"))),
    }
}
fn graph_input(value: &Value) -> Result<String> {
    let text = value
        .as_str()
        .ok_or_else(|| CanvasError::new(400, "Canvas data must be a JSON graph string"))?;
    parse_graph(text)?;
    Ok(text.into())
}
fn parse_graph(text: &str) -> Result<Value> {
    if text.len() > MAX_GRAPH_BYTES {
        return Err(CanvasError::new(413, "Canvas graph exceeds 16 MiB"));
    }
    let graph: Value = serde_json::from_str(text)
        .map_err(|_| CanvasError::new(400, "Canvas graph is invalid JSON"))?;
    let nodes = graph["nodes"]
        .as_array()
        .ok_or_else(|| CanvasError::new(400, "Canvas graph requires a nodes array"))?;
    let edges = graph["edges"]
        .as_array()
        .ok_or_else(|| CanvasError::new(400, "Canvas graph requires an edges array"))?;
    if nodes.len() > 10_000 || edges.len() > 20_000 {
        return Err(CanvasError::new(
            413,
            "Canvas graph exceeds its node/edge budget",
        ));
    }
    for rows in [nodes, edges] {
        let mut ids = HashSet::new();
        for row in rows {
            let id = row["id"]
                .as_str()
                .filter(|id| {
                    !id.is_empty() && id.len() <= 256 && !id.chars().any(|c| c.is_control())
                })
                .ok_or_else(|| CanvasError::new(400, "Canvas node/edge requires a bounded ID"))?;
            if !row.is_object() || !ids.insert(id) {
                return Err(CanvasError::new(400, "Canvas node/edge IDs must be unique"));
            }
        }
    }
    if let Some(viewport) = graph.get("viewport") {
        for axis in ["x", "y", "zoom"] {
            let value = viewport[axis]
                .as_f64()
                .filter(|value| value.is_finite())
                .ok_or_else(|| {
                    CanvasError::new(400, "Canvas viewport must contain finite x/y/zoom")
                })?;
            if axis == "zoom" && value <= 0.0 {
                return Err(CanvasError::new(400, "Canvas zoom must be positive"));
            }
        }
    }
    if graph.get("nodeIdCounter").is_some_and(|value| {
        value
            .as_u64()
            .is_none_or(|count| count > 9_007_199_254_740_991)
    }) {
        return Err(CanvasError::new(
            400,
            "Canvas nodeIdCounter must be a safe nonnegative integer",
        ));
    }
    Ok(graph)
}
fn add_version(asset: &mut Asset, message: String) -> Result<u64> {
    if asset.versions.len() >= MAX_VERSIONS {
        return Err(CanvasError::new(
            409,
            "Canvas version limit reached; existing snapshots were preserved",
        ));
    }
    let version = asset.versions.last().map(|v| v.version + 1).unwrap_or(1);
    asset.versions.push(Version {
        id: Uuid::new_v4().to_string(),
        version,
        message,
        created_at: timestamp(),
        graph: asset.graph.clone(),
    });
    Ok(version)
}
fn validate_disk(disk: &DiskState) -> Result<()> {
    if disk.schema != 1 || disk.assets.len() > MAX_ASSETS {
        return Err(CanvasError::new(
            500,
            "Unsupported or oversized local Canvas store",
        ));
    }
    for (key, asset) in &disk.assets {
        canvas_id(key)?;
        if key != &asset.id || asset.versions.len() > MAX_VERSIONS {
            return Err(CanvasError::new(500, "Invalid Canvas store identities"));
        }
        parse_graph(&asset.graph)?;
        let mut version = 0;
        for snapshot in &asset.versions {
            canvas_id(&snapshot.id)?;
            if snapshot.version <= version {
                return Err(CanvasError::new(500, "Canvas version sequence is invalid"));
            }
            version = snapshot.version;
            parse_graph(&snapshot.graph)?;
        }
    }
    Ok(())
}
fn plain_tree(path: &Path) -> Result<()> {
    for current in path.ancestors() {
        match fs::symlink_metadata(current) {
            Ok(metadata) => {
                let mut linked = metadata.file_type().is_symlink();
                #[cfg(windows)]
                {
                    use std::os::windows::fs::MetadataExt;
                    linked |= metadata.file_attributes() & 0x400 != 0;
                }
                if linked {
                    return Err(CanvasError::new(
                        400,
                        "Linked local Canvas storage is unsupported",
                    ));
                }
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
            Err(_) => {
                return Err(CanvasError::new(
                    500,
                    "Local Canvas storage path cannot be inspected",
                ))
            }
        }
    }
    Ok(())
}
fn read_store(file: &Path) -> Result<Option<Vec<u8>>> {
    plain_tree(file)?;
    let input = match fs::File::open(file) {
        Ok(file) => file,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(_) => return Err(CanvasError::new(500, "Local Canvas store cannot be read")),
    };
    let metadata = input
        .metadata()
        .map_err(|_| CanvasError::new(500, "Local Canvas store cannot be inspected"))?;
    if !metadata.is_file() || metadata.len() > MAX_STORE_BYTES as u64 {
        return Err(CanvasError::new(
            413,
            "Local Canvas store is not a bounded regular file",
        ));
    }
    #[cfg(windows)]
    {
        use std::os::windows::io::AsRawHandle;
        use windows_sys::Win32::Storage::FileSystem::{
            GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION,
        };
        let mut info = std::mem::MaybeUninit::<BY_HANDLE_FILE_INFORMATION>::uninit();
        if unsafe { GetFileInformationByHandle(input.as_raw_handle(), info.as_mut_ptr()) } == 0 {
            return Err(CanvasError::new(
                500,
                "Cannot verify local Canvas store identity",
            ));
        }
        let info = unsafe { info.assume_init() };
        if info.nNumberOfLinks != 1 || info.dwFileAttributes & 0x400 != 0 {
            return Err(CanvasError::new(
                400,
                "Linked Canvas store files are unsupported",
            ));
        }
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::MetadataExt;
        if metadata.nlink() != 1 {
            return Err(CanvasError::new(
                400,
                "Linked Canvas store files are unsupported",
            ));
        }
    }
    let mut bytes = Vec::new();
    input
        .take(MAX_STORE_BYTES as u64 + 1)
        .read_to_end(&mut bytes)
        .map_err(|_| CanvasError::new(500, "Local Canvas store read failed"))?;
    if bytes.len() > MAX_STORE_BYTES {
        return Err(CanvasError::new(
            413,
            "Local Canvas store exceeds its byte budget",
        ));
    }
    Ok(Some(bytes))
}
fn timestamp() -> String {
    let seconds = SystemTime::now()
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
    let year = yoe + era * 400 + i64::from(month <= 2);
    let daytime = seconds % 86400;
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        daytime / 3600,
        daytime / 60 % 60,
        daytime % 60
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    struct Fixture {
        root: PathBuf,
        service: LocalCanvasService,
    }
    impl Fixture {
        fn new() -> Self {
            let root = PathBuf::from(
                "F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests",
            )
            .join(format!("codely-canvas-{}", Uuid::new_v4()));
            let service = LocalCanvasService::new(root.clone()).unwrap();
            Self { root, service }
        }
        fn call(
            &self,
            method: &str,
            path: &str,
            body: Value,
            owner: Option<&str>,
        ) -> Result<Value> {
            self.service
                .handle(
                    method,
                    path,
                    &HashMap::new(),
                    body,
                    Some(&format!("Bearer {}", self.service.bearer)),
                    owner,
                )
                .map(|(_, value)| value["data"].clone())
        }
        fn create(&self, graph: &Value) -> String {
            self.call(
                "POST",
                "/v1/assets",
                json!({"name":"Owned canvas","type":"json","data":graph.to_string()}),
                None,
            )
            .unwrap()["id"]
                .as_str()
                .unwrap()
                .into()
        }
        fn acquire(&self, id: &str, owner: &str) -> Value {
            self.call(
                "POST",
                &format!("/v1/canvas-locks/{id}/acquire"),
                json!({"session_id":owner}),
                None,
            )
            .unwrap()
        }
    }
    impl Drop for Fixture {
        fn drop(&mut self) {
            let base = PathBuf::from(
                "F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests",
            )
            .canonicalize()
            .unwrap();
            let root = self.root.canonicalize().unwrap();
            assert!(
                root.starts_with(base)
                    && root
                        .file_name()
                        .unwrap()
                        .to_string_lossy()
                        .starts_with("codely-canvas-")
            );
            fs::remove_dir_all(root).unwrap();
        }
    }
    fn graph(label: &str) -> Value {
        json!({"nodes":[{"id":"node-100","type":"imageGenNode","position":{"x":-20.5,"y":41},"data":{"label":label,"images":["/codely-canvas/media/owned.png"],"custom":{"unknown":[null,true,5]},"layerConfig":{"layers":[{"id":"layer-1","opacity":0.5}]} }},{"id":"node-101","type":"directorNode","position":{"x":401,"y":8},"data":{"sceneId":"owned-scene","camera":{"position":[1,2,3]}}}],"edges":[{"id":"edge-1","source":"node-100","target":"node-101","type":"flowing","data":{"retained":true}}],"viewport":{"x":12,"y":-34,"zoom":0.7},"nodeIdCounter":102,"savedAt":1790940000000u64,"workspaceHash":"owned-workspace","workspaceName":"Owned 中文工程","futureField":{"intact":true}})
    }

    #[test]
    fn actual_graph_round_trips_and_restart_rotates_only_runtime_identity() {
        let fixture = Fixture::new();
        let original = graph("原始内容");
        let id = fixture.create(&original);
        assert_eq!(
            fixture
                .call(
                    "GET",
                    &format!("/v1/assets/{id}/download"),
                    Value::Null,
                    None
                )
                .unwrap(),
            original
        );
        let rows = fixture
            .call("GET", "/v1/assets", Value::Null, None)
            .unwrap();
        assert_eq!(rows["total"], 1);
        assert_eq!(rows["items"][0]["name"], "Owned canvas");
        let disk: Value =
            serde_json::from_slice(&fs::read(fixture.root.join("canvases.json")).unwrap()).unwrap();
        assert_eq!(
            serde_json::from_str::<Value>(disk["assets"][&id]["graph"].as_str().unwrap()).unwrap(),
            original
        );
        let restarted = LocalCanvasService::new(fixture.root.clone()).unwrap();
        assert_ne!(
            fixture.service.local_session()["session"]["id"],
            restarted.local_session()["session"]["id"]
        );
        let auth = format!("Bearer {}", restarted.bearer);
        let (_, result) = restarted
            .handle(
                "GET",
                &format!("/codely-canvas/api/v1/assets/{id}/download"),
                &HashMap::new(),
                Value::Null,
                Some(&auth),
                None,
            )
            .unwrap();
        assert_eq!(result["data"], original);
        let session = restarted.local_session();
        assert_eq!(session["user"]["role"], "local");
        assert!(session["user"].get("points").is_none());
        assert!(session.get("tokens").is_none());
    }

    #[test]
    fn shared_bearer_does_not_bypass_browser_editing_leases() {
        let fixture = Fixture::new();
        let id = fixture.create(&graph("before"));
        let target = format!("/v1/assets/{id}");
        assert_eq!(
            fixture
                .call(
                    "PUT",
                    &target,
                    json!({"data":graph("no lease").to_string()}),
                    Some("tab-a")
                )
                .unwrap_err()
                .status,
            409
        );
        assert_eq!(fixture.acquire(&id, "tab-a")["acquired"], true);
        assert_eq!(fixture.acquire(&id, "tab-b")["acquired"], false);
        let before = fs::read(fixture.root.join("canvases.json")).unwrap();
        for owner in [None, Some("tab-b")] {
            assert_eq!(
                fixture
                    .call(
                        "PUT",
                        &target,
                        json!({"data":graph("wrong owner").to_string()}),
                        owner
                    )
                    .unwrap_err()
                    .status,
                423
            );
            assert_eq!(
                fixture
                    .call("PUT", &target, json!({"name":"wrong name"}), owner)
                    .unwrap_err()
                    .status,
                423
            );
            assert_eq!(
                fixture
                    .call("DELETE", &target, Value::Null, owner)
                    .unwrap_err()
                    .status,
                423
            );
        }
        assert_eq!(
            fs::read(fixture.root.join("canvases.json")).unwrap(),
            before
        );
        fixture
            .call(
                "PUT",
                &target,
                json!({"data":graph("after").to_string(),"name":"Renamed"}),
                Some("tab-a"),
            )
            .unwrap();
        assert_eq!(
            fixture
                .call("GET", &format!("{target}/download"), Value::Null, None)
                .unwrap(),
            graph("after")
        );
        assert!(fixture
            .call(
                "DELETE",
                &format!("/v1/canvas-locks/{id}"),
                json!({"session_id":"tab-b"}),
                None
            )
            .is_err());
        fixture
            .call(
                "DELETE",
                &format!("/v1/canvas-locks/{id}"),
                json!({"session_id":"tab-a"}),
                None,
            )
            .unwrap();
        fixture
            .call("PUT", &target, json!({"name":"Gallery rename"}), None)
            .unwrap();
    }

    #[test]
    fn leases_expire_heartbeat_rejects_old_owner_and_force_takeover_is_explicit() {
        let fixture = Fixture::new();
        let id = fixture.create(&graph("stable"));
        let now = Instant::now();
        let auth = format!("Bearer {}", fixture.service.bearer);
        let call = |path: &str, body: Value, at: Instant| {
            fixture
                .service
                .handle_at("POST", path, &HashMap::new(), body, Some(&auth), None, at)
                .map(|(_, v)| v["data"].clone())
        };
        let acquire = format!("/v1/canvas-locks/{id}/acquire");
        let heartbeat = format!("/v1/canvas-locks/{id}/heartbeat");
        assert_eq!(
            call(&acquire, json!({"session_id":"a"}), now).unwrap()["acquired"],
            true
        );
        assert_eq!(
            call(
                &acquire,
                json!({"session_id":"b"}),
                now + Duration::from_secs(29)
            )
            .unwrap()["acquired"],
            false
        );
        assert_eq!(
            call(
                &acquire,
                json!({"session_id":"b"}),
                now + Duration::from_secs(31)
            )
            .unwrap()["acquired"],
            true
        );
        assert!(call(
            &heartbeat,
            json!({"session_id":"a"}),
            now + Duration::from_secs(32)
        )
        .unwrap_err()
        .message
        .contains("lock not found"));
        assert_eq!(
            call(
                &acquire,
                json!({"session_id":"a","force":true}),
                now + Duration::from_secs(33)
            )
            .unwrap()["acquired"],
            true
        );
        assert!(call(
            &heartbeat,
            json!({"session_id":"b"}),
            now + Duration::from_secs(34)
        )
        .is_err());
        assert!(call(
            &acquire,
            json!({"session_id":"b","force":"true"}),
            now + Duration::from_secs(35)
        )
        .is_err());
    }

    #[test]
    fn commits_are_real_snapshots_and_restore_preserves_the_displaced_graph() {
        let fixture = Fixture::new();
        let id = fixture.create(&graph("first"));
        fixture.acquire(&id, "owner");
        let path = format!("/v1/assets/{id}");
        assert_eq!(
            fixture
                .call(
                    "POST",
                    &format!("{path}/commit"),
                    json!({"message":"first\n真实快照"}),
                    Some("owner")
                )
                .unwrap()["version"],
            1
        );
        fixture
            .call(
                "PUT",
                &path,
                json!({"data":graph("second").to_string()}),
                Some("owner"),
            )
            .unwrap();
        let restored = fixture
            .call(
                "POST",
                &format!("{path}/versions/1/restore"),
                json!({}),
                Some("owner"),
            )
            .unwrap();
        assert_eq!(restored["previous_graph_version"], 2);
        assert_eq!(
            fixture
                .call("GET", &format!("{path}/download"), Value::Null, None)
                .unwrap(),
            graph("first")
        );
        let versions = fixture
            .call("GET", &format!("{path}/versions"), Value::Null, None)
            .unwrap();
        assert_eq!(versions[0]["version"], 2);
        assert_eq!(versions[1]["message"], "first\n真实快照");
        assert!(Uuid::parse_str(versions[0]["id"].as_str().unwrap()).is_ok());
        fixture
            .call(
                "POST",
                &format!("{path}/versions/2/restore"),
                json!({}),
                Some("owner"),
            )
            .unwrap();
        assert_eq!(
            fixture
                .call("GET", &format!("{path}/download"), Value::Null, None)
                .unwrap(),
            graph("second")
        );
        fixture
            .call("DELETE", &path, Value::Null, Some("owner"))
            .unwrap();
        assert_eq!(
            fixture
                .call("GET", &path, Value::Null, None)
                .unwrap_err()
                .status,
            404
        );
    }

    #[cfg(windows)]
    #[test]
    fn failed_atomic_write_preserves_both_disk_and_memory_graph() {
        let fixture = Fixture::new();
        let before_graph = graph("before");
        let id = fixture.create(&before_graph);
        fixture.acquire(&id, "owner");
        let file = fixture.root.join("canvases.json");
        let bytes = fs::read(&file).unwrap();
        let mut permissions = fs::metadata(&file).unwrap().permissions();
        permissions.set_readonly(true);
        fs::set_permissions(&file, permissions).unwrap();
        let failure = fixture.call(
            "PUT",
            &format!("/v1/assets/{id}"),
            json!({"data":graph("unwritten").to_string()}),
            Some("owner"),
        );
        let mut permissions = fs::metadata(&file).unwrap().permissions();
        permissions.set_readonly(false);
        fs::set_permissions(&file, permissions).unwrap();
        assert_eq!(failure.unwrap_err().status, 500);
        assert_eq!(fs::read(&file).unwrap(), bytes);
        assert_eq!(
            fixture
                .call(
                    "GET",
                    &format!("/v1/assets/{id}/download"),
                    Value::Null,
                    None
                )
                .unwrap(),
            before_graph
        );
    }

    #[test]
    fn stale_service_and_external_store_replacement_cannot_overwrite_newer_data() {
        let fixture = Fixture::new();
        let id = fixture.create(&graph("initial"));
        let stale = LocalCanvasService::new(fixture.root.clone()).unwrap();
        fixture
            .call(
                "PUT",
                &format!("/v1/assets/{id}"),
                json!({"name":"newer"}),
                None,
            )
            .unwrap();
        let before = fs::read(fixture.root.join("canvases.json")).unwrap();
        let auth = format!("Bearer {}", stale.bearer);
        assert_eq!(
            stale
                .handle(
                    "PUT",
                    &format!("/v1/assets/{id}"),
                    &HashMap::new(),
                    json!({"name":"stale"}),
                    Some(&auth),
                    None
                )
                .unwrap_err()
                .status,
            409
        );
        assert_eq!(
            fs::read(fixture.root.join("canvases.json")).unwrap(),
            before
        );
        fs::write(
            fixture.root.join("canvases.json"),
            b"corrupt outside replacement",
        )
        .unwrap();
        assert!(LocalCanvasService::new(fixture.root.clone()).is_err());
        assert_eq!(
            fixture
                .call(
                    "PUT",
                    &format!("/v1/assets/{id}"),
                    json!({"name":"would erase corruption"}),
                    None
                )
                .unwrap_err()
                .status,
            409
        );
        assert_eq!(
            fs::read(fixture.root.join("canvases.json")).unwrap(),
            b"corrupt outside replacement"
        );
    }

    #[test]
    fn bounded_invalid_graphs_ids_auth_and_linked_storage_fail_without_changes() {
        let fixture = Fixture::new();
        let id = fixture.create(&graph("safe"));
        fixture.acquire(&id, "owner");
        let file = fixture.root.join("canvases.json");
        let before = fs::read(&file).unwrap();
        let mut huge = graph("large");
        huge["extra"] = json!("x".repeat(MAX_GRAPH_BYTES));
        assert_eq!(
            fixture
                .call(
                    "PUT",
                    &format!("/v1/assets/{id}"),
                    json!({"data":huge.to_string()}),
                    Some("owner")
                )
                .unwrap_err()
                .status,
            413
        );
        for invalid in [
            json!({"nodes":[],"edges":{}}),
            json!({"nodes":[{"id":"same"},{"id":"same"}],"edges":[]}),
            json!({"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":0}}),
        ] {
            assert!(fixture
                .call(
                    "PUT",
                    &format!("/v1/assets/{id}"),
                    json!({"data":invalid.to_string()}),
                    Some("owner")
                )
                .is_err());
        }
        for path in [
            "/v1/assets/../outside",
            "/v1/assets/%2e%2e",
            "/v1/assets/not-a-uuid",
        ] {
            assert_eq!(
                fixture
                    .call("GET", path, Value::Null, None)
                    .unwrap_err()
                    .status,
                400
            );
        }
        assert_eq!(
            fixture
                .service
                .handle(
                    "GET",
                    "/v1/assets",
                    &HashMap::new(),
                    Value::Null,
                    None,
                    None
                )
                .unwrap_err()
                .status,
            401
        );
        assert_eq!(fs::read(&file).unwrap(), before);
        fs::hard_link(&file, fixture.root.join("linked-store.json")).unwrap();
        assert!(LocalCanvasService::new(fixture.root.clone()).is_err());
        assert_eq!(
            fixture
                .call(
                    "PUT",
                    &format!("/v1/assets/{id}"),
                    json!({"name":"linked"}),
                    Some("owner")
                )
                .unwrap_err()
                .status,
            400
        );
    }

    #[test]
    fn templates_have_an_explicit_local_empty_scope_and_cloud_services_never_fake_success() {
        let fixture = Fixture::new();
        let (_, templates) = fixture
            .service
            .handle(
                "GET",
                "/v1/templates",
                &HashMap::new(),
                Value::Null,
                None,
                None,
            )
            .unwrap();
        assert_eq!(templates["data"], json!([]));
        assert_eq!(templates["source"], "local-template-collection");
        for path in [
            "/v1/organizations",
            "/v1/collab/anything/ws",
            "/v1/ai-models",
            "/v1/models/owned/schema",
            "/v1/auth/profile",
        ] {
            assert_eq!(
                fixture
                    .call("GET", path, Value::Null, None)
                    .unwrap_err()
                    .status,
                501
            );
        }
    }

    #[test]
    fn upload_scope_requires_the_exact_saved_canvas_and_current_browser_lease() {
        let fixture = Fixture::new();
        let mut first = graph("owned A");
        first["workspaceHash"] = json!("F:/not-a-permission/another-project");
        let a = fixture.create(&first);
        let b = fixture.create(&graph("owned B"));
        fixture.acquire(&a, "tab-a");
        fixture.acquire(&b, "tab-b");
        let auth = format!("Bearer {}", fixture.service.bearer);
        assert_eq!(
            fixture
                .service
                .upload_scope(&a, Some(&auth), Some("tab-a"))
                .unwrap(),
            format!("canvas:{a}")
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&b, Some(&auth), Some("tab-b"))
                .unwrap(),
            format!("canvas:{b}")
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&a, None, Some("tab-a"))
                .unwrap_err()
                .status,
            401
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&a, Some("Bearer another-host"), Some("tab-a"))
                .unwrap_err()
                .status,
            401
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&a, Some(&auth), Some("tab-b"))
                .unwrap_err()
                .status,
            423
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&b, Some(&auth), Some("tab-a"))
                .unwrap_err()
                .status,
            423
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&a, Some(&auth), None)
                .unwrap_err()
                .status,
            423
        );
        assert_eq!(
            fixture
                .service
                .upload_scope(&Uuid::new_v4().to_string(), Some(&auth), Some("tab-a"))
                .unwrap_err()
                .status,
            404
        );
        assert_eq!(
            fixture
                .service
                .upload_scope("../escape", Some(&auth), Some("tab-a"))
                .unwrap_err()
                .status,
            400
        );
        fixture
            .call(
                "DELETE",
                &format!("/v1/canvas-locks/{a}"),
                json!({"session_id":"tab-a"}),
                None,
            )
            .unwrap();
        assert_eq!(
            fixture
                .service
                .upload_scope(&a, Some(&auth), Some("tab-a"))
                .unwrap_err()
                .status,
            409
        );
        fixture
            .service
            .state
            .lock()
            .unwrap()
            .leases
            .get_mut(&b)
            .unwrap()
            .expires = Instant::now() - Duration::from_secs(1);
        assert_eq!(
            fixture
                .service
                .upload_scope(&b, Some(&auth), Some("tab-b"))
                .unwrap_err()
                .status,
            409
        );
    }
}
