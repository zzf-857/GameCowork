//! Correlates frontend requests with core stdio without conflating host callbacks.
//!
//! The core wraps replies to its handlers in `data.done/status/content`, while
//! requests made by the core to its host expect raw `data` in the host reply.
//! Only response envelopes addressed to this transport belong here.

use serde_json::{json, Value};
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use tokio::sync::{broadcast, mpsc, oneshot};
use uuid::Uuid;

const INTERNAL_ID_PREFIX: &str = "shell-transport-";
const RECENT_ROUTE_LIMIT: usize = 128;
const RECENT_ROUTE_TTL: Duration = Duration::from_secs(120);

type Completion = Result<Value, String>;

struct PendingRequest {
    message_type: String,
    client_id: Option<String>,
    workspace_id: Option<String>,
    deferred: bool,
    streaming: bool,
    last_activity: Instant,
    completion: oneshot::Sender<Completion>,
}

#[derive(Clone)]
struct ClientRoute {
    client_id: Option<String>,
    workspace_id: Option<String>,
}

struct RecentRoute {
    route: ClientRoute,
    completed_at: Instant,
}

struct Inner {
    stdin_tx: mpsc::UnboundedSender<String>,
    events_tx: broadcast::Sender<String>,
    // A synchronous mutex allows cancellation in Drop without detached cleanup.
    pending: Mutex<HashMap<String, PendingRequest>>,
    // Core stream notifications use a separate messageId and carry the owning
    // invocation ID in data.streamMessageId. Keep a bounded route cache for
    // notifications that follow the terminal response.
    recent_routes: Mutex<HashMap<String, RecentRoute>>,
    approvals: Mutex<HashMap<String, usize>>,
}

#[derive(Clone)]
pub struct CoreTransport {
    inner: Arc<Inner>,
}

struct RequestGuard {
    transport: CoreTransport,
    id: Option<String>,
}

impl RequestGuard {
    fn disarm(&mut self) {
        self.id = None;
    }
}

impl Drop for RequestGuard {
    fn drop(&mut self) {
        if let Some(id) = self.id.take() {
            self.transport
                .cancel_internal(&id, "request cancelled", true);
        }
    }
}

impl CoreTransport {
    pub fn begin_approval(&self, workspace_id: &str) {
        *self
            .inner
            .approvals
            .lock()
            .unwrap()
            .entry(workspace_id.to_owned())
            .or_default() += 1;
    }

    pub fn end_approval(&self, workspace_id: &str) {
        let waiting = {
            let mut approvals = self.inner.approvals.lock().unwrap();
            if let Some(count) = approvals.get_mut(workspace_id) {
                *count = count.saturating_sub(1);
            }
            let waiting = approvals.get(workspace_id).copied().unwrap_or(0) > 0;
            if !waiting {
                approvals.remove(workspace_id);
            }
            waiting
        };
        if !waiting {
            for entry in self.inner.pending.lock().unwrap().values_mut() {
                if entry.workspace_id.as_deref() == Some(workspace_id) {
                    entry.last_activity = Instant::now();
                }
            }
        }
    }

    pub fn cancel_workspace(&self, workspace_id: &str) -> usize {
        self.inner.approvals.lock().unwrap().remove(workspace_id);
        let ids: Vec<String> = self
            .inner
            .pending
            .lock()
            .unwrap()
            .iter()
            .filter(|(_, entry)| entry.workspace_id.as_deref() == Some(workspace_id))
            .map(|(id, _)| id.clone())
            .collect();
        for id in &ids {
            self.cancel_internal(id, "workspace closed", true);
        }
        ids.len()
    }

    pub fn new(
        stdin_tx: mpsc::UnboundedSender<String>,
        events_tx: broadcast::Sender<String>,
    ) -> Self {
        Self {
            inner: Arc::new(Inner {
                stdin_tx,
                events_tx,
                pending: Mutex::new(HashMap::new()),
                recent_routes: Mutex::new(HashMap::new()),
                approvals: Mutex::new(HashMap::new()),
            }),
        }
    }

    /// Sends one core invocation. Deferred requests immediately acknowledge with
    /// JSON null and deliver their response through SSE under the client ID.
    /// Ordinary requests complete only on the terminal `done:true` frame.
    pub async fn request(
        &self,
        mtype: &str,
        data: Value,
        workspace_id: Option<&str>,
        client_id: Option<&str>,
        deferred: bool,
        timeout: Duration,
    ) -> Completion {
        if mtype.is_empty() {
            return Err("messageType required".to_string());
        }

        // The GUI cancels and rejoins streams using their original message ID.
        // Keep using the core ID for those operations instead of starting a new
        // request with an unrelated ID.
        if mtype == "abort" {
            let cancelled = client_id
                .map(|id| self.abort(id, workspace_id))
                .unwrap_or(false);
            return Ok(json!({
                "messageType": mtype,
                "messageId": client_id,
                "workspaceId": workspace_id,
                "data": {"done": true, "status": "success", "content": {"cancelled": cancelled}}
            }));
        }
        let join_existing = data
            .get("messageOptions")
            .and_then(|options| options.get("joinExistingStreamOnly"))
            .and_then(Value::as_bool)
            .unwrap_or(false);
        if join_existing {
            let existing = self.find_client_request(client_id, workspace_id, Some(mtype));
            let id = existing.ok_or_else(|| "stream is no longer active".to_string())?;
            self.send_invocation(&id, mtype, data, workspace_id)?;
            return Ok(Value::Null);
        }

        let id = format!("{}{}", INTERNAL_ID_PREFIX, Uuid::new_v4());
        let (tx, rx) = oneshot::channel();
        {
            let mut pending = self.inner.pending.lock().unwrap();
            if client_id.is_some()
                && pending.values().any(|entry| {
                    entry.client_id.as_deref() == client_id
                        && entry.workspace_id.as_deref() == workspace_id
                })
            {
                return Err("request already pending for this messageId".to_string());
            }
            pending.insert(
                id.clone(),
                PendingRequest {
                    message_type: mtype.to_string(),
                    client_id: client_id.map(str::to_string),
                    workspace_id: workspace_id.map(str::to_string),
                    deferred,
                    streaming: false,
                    last_activity: Instant::now(),
                    completion: tx,
                },
            );
        }

        let mut guard = RequestGuard {
            transport: self.clone(),
            id: Some(id.clone()),
        };
        if let Err(reason) = self.send_invocation(&id, mtype, data, workspace_id) {
            self.cancel_internal(&id, &reason, false);
            guard.disarm();
            return Err(reason);
        }

        if deferred {
            let transport = self.clone();
            let deferred_guard = RequestGuard {
                transport: transport.clone(),
                id: Some(id.clone()),
            };
            // Own the cleanup guard until terminal response, timeout, or task
            // cancellation. No caller future is needed after the HTTP null ack.
            tokio::spawn(async move {
                let mut deferred_guard = deferred_guard;
                transport.await_completion(&id, rx, timeout).await.ok();
                deferred_guard.disarm();
            });
            guard.disarm();
            return Ok(Value::Null);
        }

        let result = self.await_completion(&id, rx, timeout).await;
        guard.disarm();
        result
    }

    fn send_invocation(
        &self,
        id: &str,
        mtype: &str,
        data: Value,
        workspace_id: Option<&str>,
    ) -> Result<(), String> {
        let mut envelope = json!({"messageType": mtype, "messageId": id, "data": data});
        if let Some(workspace_id) = workspace_id {
            envelope["workspaceId"] = json!(workspace_id);
        }
        self.inner
            .stdin_tx
            .send(envelope.to_string())
            .map_err(|_| "core not running".to_string())
    }

    async fn await_completion(
        &self,
        id: &str,
        mut rx: oneshot::Receiver<Completion>,
        timeout: Duration,
    ) -> Completion {
        let mut remaining = timeout;
        loop {
            match tokio::time::timeout(remaining, &mut rx).await {
                Ok(Ok(result)) => return result,
                Ok(Err(_)) => {
                    self.cancel_internal(id, "core dropped response", true);
                    return Err("core dropped response".to_string());
                }
                Err(_) => {
                    let progress = self.inner.pending.lock().unwrap().get(id).map(|entry| {
                        (
                            entry.last_activity.elapsed(),
                            entry.workspace_id.clone(),
                            entry.deferred
                                || entry.streaming
                                || entry.message_type == "llm/streamChat",
                        )
                    });
                    if let Some((idle, workspace, may_wait_for_approval)) = progress {
                        let waiting = may_wait_for_approval
                            && workspace
                                .as_ref()
                                .map(|workspace| {
                                    self.inner
                                        .approvals
                                        .lock()
                                        .unwrap()
                                        .get(workspace)
                                        .copied()
                                        .unwrap_or(0)
                                        > 0
                                })
                                .unwrap_or(false);
                        if waiting {
                            remaining = timeout;
                            continue;
                        }
                        if idle < timeout {
                            remaining = timeout - idle;
                            continue;
                        }
                    }
                    self.cancel_internal(id, "core timeout", true);
                    return Err("core timeout".to_string());
                }
            }
        }
    }

    /// Returns true for response envelopes belonging to this transport. A raw
    /// core-to-host request is returned to the host dispatcher unchanged.
    pub async fn handle_frame(&self, mut value: Value) -> bool {
        if self.handle_stream_notification(&mut value) {
            return true;
        }
        let Some(id) = value
            .get("messageId")
            .and_then(Value::as_str)
            .map(str::to_string)
        else {
            return false;
        };
        let Some(done) = value
            .get("data")
            .and_then(|data| data.get("done"))
            .and_then(Value::as_bool)
        else {
            return false;
        };

        let (broadcast, completion) = {
            let mut pending = self.inner.pending.lock().unwrap();
            let Some(entry) = pending.get_mut(&id) else {
                // Consume late and duplicate replies after timeout/cancellation
                // rather than dispatching them as new host requests.
                return id.starts_with(INTERNAL_ID_PREFIX);
            };
            entry.last_activity = Instant::now();
            Self::restore_client_envelope(&mut value, entry);
            if !done {
                entry.streaming = true;
                (true, None)
            } else {
                let entry = pending.remove(&id).unwrap();
                self.remember_route(&id, &entry);
                (entry.deferred || entry.streaming, Some(entry.completion))
            }
        };
        if broadcast {
            let _ = self.inner.events_tx.send(value.to_string());
        }
        if let Some(completion) = completion {
            let _ = completion.send(Ok(value));
        }
        true
    }

    fn handle_stream_notification(&self, value: &mut Value) -> bool {
        if !value
            .get("messageType")
            .and_then(Value::as_str)
            .map(|kind| kind.starts_with("stream/"))
            .unwrap_or(false)
        {
            return false;
        }
        let Some(stream_id) = value
            .get("data")
            .and_then(|data| data.get("streamMessageId"))
            .and_then(Value::as_str)
        else {
            return false;
        };
        let route = {
            let mut pending = self.inner.pending.lock().unwrap();
            pending.get_mut(stream_id).map(|entry| {
                entry.last_activity = Instant::now();
                ClientRoute {
                    client_id: entry.client_id.clone(),
                    workspace_id: entry.workspace_id.clone(),
                }
            })
        }
        .or_else(|| {
            let mut recent = self.inner.recent_routes.lock().unwrap();
            recent.retain(|_, entry| entry.completed_at.elapsed() < RECENT_ROUTE_TTL);
            recent.get(stream_id).map(|entry| entry.route.clone())
        });
        let Some(route) = route else {
            return false;
        };
        if let Some(client_id) = route.client_id {
            value["data"]["streamMessageId"] = json!(client_id);
            if let Some(error) = value["data"]
                .get_mut("error")
                .and_then(Value::as_object_mut)
            {
                if error.contains_key("streamMessageId") {
                    error.insert("streamMessageId".to_string(), json!(client_id));
                }
            }
        }
        if let Some(workspace_id) = route.workspace_id {
            value["workspaceId"] = json!(workspace_id);
        }
        let _ = self.inner.events_tx.send(value.to_string());
        true
    }

    fn remember_route(&self, id: &str, entry: &PendingRequest) {
        let mut recent = self.inner.recent_routes.lock().unwrap();
        recent.retain(|_, entry| entry.completed_at.elapsed() < RECENT_ROUTE_TTL);
        recent.insert(
            id.to_string(),
            RecentRoute {
                route: ClientRoute {
                    client_id: entry.client_id.clone(),
                    workspace_id: entry.workspace_id.clone(),
                },
                completed_at: Instant::now(),
            },
        );
        if recent.len() > RECENT_ROUTE_LIMIT {
            if let Some(oldest) = recent
                .iter()
                .min_by_key(|(_, entry)| entry.completed_at)
                .map(|(id, _)| id.clone())
            {
                recent.remove(&oldest);
            }
        }
    }

    fn restore_client_envelope(value: &mut Value, entry: &PendingRequest) {
        if let Some(client_id) = &entry.client_id {
            value["messageId"] = json!(client_id);
        }
        if let Some(workspace_id) = &entry.workspace_id {
            // Restore the route associated with the request even when a core
            // handler omitted the workspace ID from its response.
            value["workspaceId"] = json!(workspace_id);
        }
    }

    fn find_client_request(
        &self,
        client_id: Option<&str>,
        workspace_id: Option<&str>,
        mtype: Option<&str>,
    ) -> Option<String> {
        client_id?;
        self.inner
            .pending
            .lock()
            .unwrap()
            .iter()
            .find_map(|(id, entry)| {
                (entry.client_id.as_deref() == client_id
                    && entry.workspace_id.as_deref() == workspace_id
                    && mtype.map(|kind| kind == entry.message_type).unwrap_or(true))
                .then(|| id.clone())
            })
    }

    /// Cancels the core invocation that owns the frontend ID. Returns false if
    /// it already completed or belongs to another workspace.
    pub fn abort(&self, client_id: &str, workspace_id: Option<&str>) -> bool {
        self.find_client_request(Some(client_id), workspace_id, None)
            .map(|id| self.cancel_internal(&id, "request cancelled", true))
            .unwrap_or(false)
    }

    fn cancel_internal(&self, id: &str, reason: &str, send_abort: bool) -> bool {
        let entry = self.inner.pending.lock().unwrap().remove(id);
        let Some(entry) = entry else {
            return false;
        };
        self.remember_route(id, &entry);
        if send_abort {
            let _ = self.send_invocation(id, "abort", Value::Null, entry.workspace_id.as_deref());
        }
        self.fail_entry(id, entry, reason);
        true
    }

    fn fail_entry(&self, id: &str, entry: PendingRequest, reason: &str) {
        if matches!(reason, "request cancelled" | "workspace closed")
            && entry.message_type == "llm/streamChat"
        {
            let mut frame = json!({"messageType":entry.message_type,"messageId":id,"data":{
                "done":true,"status":"success","content":{"cancelled":true,"completion":"","prompt":"","modelProvider":"acp"}}});
            Self::restore_client_envelope(&mut frame, &entry);
            if entry.deferred || entry.streaming {
                let _ = self.inner.events_tx.send(frame.to_string());
            }
            let _ = entry.completion.send(Ok(frame));
            return;
        }
        if entry.deferred || entry.streaming {
            let mut frame = json!({
                "messageType": entry.message_type,
                "messageId": id,
                "data": {"done": true, "status": "error", "error": reason}
            });
            Self::restore_client_envelope(&mut frame, &entry);
            let _ = self.inner.events_tx.send(frame.to_string());
        }
        let _ = entry.completion.send(Err(reason.to_string()));
    }

    /// Resolves all pending callers on core/writer shutdown, including deferred
    /// streams whose HTTP requests were acknowledged earlier.
    pub async fn fail_pending(&self, reason: &str) {
        let pending = std::mem::take(&mut *self.inner.pending.lock().unwrap());
        for (id, entry) in pending {
            self.remember_route(&id, &entry);
            self.fail_entry(&id, entry, reason);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::sync::mpsc::UnboundedReceiver;

    fn fixture() -> (
        CoreTransport,
        UnboundedReceiver<String>,
        broadcast::Receiver<String>,
    ) {
        let (stdin, input) = mpsc::unbounded_channel();
        let (events, output) = broadcast::channel(32);
        (CoreTransport::new(stdin, events), input, output)
    }
    #[tokio::test]
    async fn user_workspace_close_is_a_normal_chat_cancel_and_preserves_other_streams() {
        let (transport, mut input, mut events) = fixture();
        transport
            .request(
                "llm/streamChat",
                json!({}),
                Some("a"),
                Some("chat-a"),
                true,
                Duration::from_secs(5),
            )
            .await
            .unwrap();
        let a = invocation(&mut input).await;
        transport
            .request(
                "llm/streamChat",
                json!({}),
                Some("b"),
                Some("chat-b"),
                true,
                Duration::from_secs(5),
            )
            .await
            .unwrap();
        let b = invocation(&mut input).await;
        assert_eq!(transport.cancel_workspace("a"), 1);
        let abort = invocation(&mut input).await;
        assert_eq!(abort["messageId"], a["messageId"]);
        let cancelled: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(cancelled["messageId"], "chat-a");
        assert_eq!(cancelled["data"]["status"], "success");
        assert_eq!(cancelled["data"]["content"]["cancelled"], true);
        transport
            .handle_frame(reply(&b, true, json!("B remains live")))
            .await;
        let finished: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(finished["messageId"], "chat-b");
        assert_eq!(finished["data"]["status"], "success");
    }

    async fn invocation(input: &mut UnboundedReceiver<String>) -> Value {
        serde_json::from_str(&input.recv().await.expect("stdio invocation")).unwrap()
    }

    fn reply(invocation: &Value, done: bool, content: Value) -> Value {
        json!({
            "messageType": invocation["messageType"],
            "messageId": invocation["messageId"],
            "data": {"done": done, "status": "success", "content": content}
        })
    }

    #[tokio::test]
    async fn sends_once_and_restores_the_client_id_and_workspace() {
        let (transport, mut input, mut events) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "history/list",
                    json!({}),
                    Some("ws-a"),
                    Some("client-a"),
                    false,
                    Duration::from_secs(1),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        assert_eq!(sent["workspaceId"], "ws-a");
        assert_ne!(sent["messageId"], "client-a");
        assert!(
            input.try_recv().is_err(),
            "the invocation must only be sent once"
        );
        assert!(
            transport
                .handle_frame(reply(&sent, true, json!(["session"])))
                .await
        );
        let result = request.await.unwrap().unwrap();
        assert_eq!(result["messageId"], "client-a");
        assert_eq!(result["workspaceId"], "ws-a");
        assert_eq!(result["data"]["content"], json!(["session"]));
        assert!(events.try_recv().is_err());
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn all_stream_frames_survive_and_http_waits_for_the_terminal_frame() {
        let (transport, mut input, mut events) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "llm/streamChat",
                    json!({}),
                    Some("ws-a"),
                    Some("stream-a"),
                    false,
                    Duration::from_secs(1),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        for chunk in ["one", "two"] {
            assert!(
                transport
                    .handle_frame(reply(&sent, false, json!(chunk)))
                    .await
            );
            let frame: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
            assert_eq!(frame["messageId"], "stream-a");
            assert_eq!(frame["messageType"], "llm/streamChat");
            assert_eq!(frame["workspaceId"], "ws-a");
            assert_eq!(frame["data"]["content"], chunk);
            assert!(!request.is_finished());
            assert_eq!(transport.inner.pending.lock().unwrap().len(), 1);
        }
        assert!(
            transport
                .handle_frame(reply(&sent, true, json!("finished")))
                .await
        );
        let last: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(last["data"]["done"], true);
        assert_eq!(last["messageId"], "stream-a");
        assert_eq!(
            request.await.unwrap().unwrap()["data"]["content"],
            "finished"
        );
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn deferred_requests_acknowledge_then_deliver_every_response_over_sse() {
        let (transport, mut input, mut events) = fixture();
        let ack = transport
            .request(
                "history/load",
                json!({}),
                None,
                Some("deferred-a"),
                true,
                Duration::from_secs(1),
            )
            .await
            .unwrap();
        assert_eq!(ack, Value::Null);
        let sent = invocation(&mut input).await;
        assert!(
            transport
                .handle_frame(reply(&sent, false, json!("loading")))
                .await
        );
        assert!(
            transport
                .handle_frame(reply(&sent, true, json!("loaded")))
                .await
        );
        for content in ["loading", "loaded"] {
            let frame: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
            assert_eq!(frame["messageId"], "deferred-a");
            assert_eq!(frame["data"]["content"], content);
        }
        assert!(
            transport
                .handle_frame(reply(&sent, true, Value::Null))
                .await
        );
        assert!(
            events.try_recv().is_err(),
            "duplicate terminal frame must be consumed"
        );
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn concurrent_workspace_requests_do_not_cross_correlate() {
        let (transport, mut input, _) = fixture();
        let mut requests = Vec::new();
        for workspace in ["ws-a", "ws-b"] {
            let requester = transport.clone();
            requests.push(tokio::spawn(async move {
                requester
                    .request(
                        "history/list",
                        Value::Null,
                        Some(workspace),
                        Some(workspace),
                        false,
                        Duration::from_secs(1),
                    )
                    .await
            }));
        }
        let first = invocation(&mut input).await;
        let second = invocation(&mut input).await;
        assert_ne!(first["messageId"], second["messageId"]);
        assert!(input.try_recv().is_err());
        for sent in [&second, &first] {
            assert!(
                transport
                    .handle_frame(reply(sent, true, sent["workspaceId"].clone()))
                    .await
            );
        }
        for request in requests {
            let result = request.await.unwrap().unwrap();
            assert_eq!(result["messageId"], result["workspaceId"]);
            assert_eq!(result["data"]["content"], result["workspaceId"]);
        }
    }

    #[tokio::test]
    async fn independent_stream_notifications_restore_the_owning_id_even_after_done() {
        let (transport, mut input, mut events) = fixture();
        transport
            .request(
                "llm/streamChat",
                json!({}),
                Some("ws-a"),
                Some("stream-a"),
                true,
                Duration::from_secs(1),
            )
            .await
            .unwrap();
        let sent = invocation(&mut input).await;
        let notification = json!({
            "messageType": "stream/streamError",
            "messageId": "independent-core-event",
            "data": {
                "streamMessageId": sent["messageId"],
                "sessionId": "session",
                "error": {"message": "example", "streamMessageId": sent["messageId"]}
            }
        });
        assert!(transport.handle_frame(notification).await);
        let restored: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(restored["messageId"], "independent-core-event");
        assert_eq!(restored["data"]["streamMessageId"], "stream-a");
        assert_eq!(restored["data"]["error"]["streamMessageId"], "stream-a");
        assert_eq!(restored["workspaceId"], "ws-a");
        assert!(
            transport
                .handle_frame(reply(&sent, true, Value::Null))
                .await
        );
        events.recv().await.unwrap();
        assert!(
            transport
                .handle_frame(json!({
                    "messageType": "stream/streamFinished",
                    "messageId": "finished-event",
                    "data": {"streamMessageId": sent["messageId"], "sessionId": "session"}
                }))
                .await
        );
        let finished: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(finished["data"]["streamMessageId"], "stream-a");
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn raw_host_requests_are_not_mistaken_for_frontend_replies() {
        let (transport, mut input, _) = fixture();
        transport
            .request(
                "history/load",
                Value::Null,
                None,
                Some("client"),
                true,
                Duration::from_secs(1),
            )
            .await
            .unwrap();
        let sent = invocation(&mut input).await;
        assert!(
            !transport
                .handle_frame(
                    json!({"messageType": "getWorkspaceDirs", "messageId": "host-id", "data": null})
                )
                .await
        );
        assert!(!transport.handle_frame(json!({"messageType": "getIdeSettings", "messageId": sent["messageId"], "data": {"pauseCodebaseIndexOnStart": true}})).await);
        assert_eq!(transport.inner.pending.lock().unwrap().len(), 1);
        transport.fail_pending("test complete").await;
    }

    #[tokio::test]
    async fn timeout_cleans_pending_and_aborts_the_matching_core_invocation() {
        let (transport, mut input, _) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "history/list",
                    Value::Null,
                    Some("ws-a"),
                    Some("client"),
                    false,
                    Duration::from_millis(10),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        assert_eq!(request.await.unwrap().unwrap_err(), "core timeout");
        let abort = invocation(&mut input).await;
        assert_eq!(abort["messageType"], "abort");
        assert_eq!(abort["messageId"], sent["messageId"]);
        assert_eq!(abort["workspaceId"], "ws-a");
        assert!(transport.inner.pending.lock().unwrap().is_empty());
        assert!(
            transport
                .handle_frame(reply(&sent, true, Value::Null))
                .await
        );
    }

    #[tokio::test]
    async fn dropping_an_http_future_cleans_pending_without_a_cleanup_task() {
        let (transport, mut input, _) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "history/list",
                    Value::Null,
                    None,
                    Some("client"),
                    false,
                    Duration::from_secs(30),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        request.abort();
        assert!(request.await.unwrap_err().is_cancelled());
        assert!(transport.inner.pending.lock().unwrap().is_empty());
        let abort = invocation(&mut input).await;
        assert_eq!(abort["messageType"], "abort");
        assert_eq!(abort["messageId"], sent["messageId"]);
    }

    #[tokio::test]
    async fn a_deferred_timeout_sends_a_terminal_error_with_the_client_id() {
        let (transport, mut input, mut events) = fixture();
        transport
            .request(
                "history/load",
                Value::Null,
                Some("ws-a"),
                Some("client"),
                true,
                Duration::from_millis(10),
            )
            .await
            .unwrap();
        let sent = invocation(&mut input).await;
        let frame: Value = serde_json::from_str(
            &tokio::time::timeout(Duration::from_secs(1), events.recv())
                .await
                .unwrap()
                .unwrap(),
        )
        .unwrap();
        assert_eq!(frame["messageId"], "client");
        assert_eq!(frame["workspaceId"], "ws-a");
        assert_eq!(frame["data"]["done"], true);
        assert_eq!(frame["data"]["status"], "error");
        assert_eq!(frame["data"]["error"], "core timeout");
        assert!(transport.inner.pending.lock().unwrap().is_empty());
        assert_eq!(invocation(&mut input).await["messageId"], sent["messageId"]);
    }

    #[tokio::test]
    async fn fail_pending_resolves_http_callers_and_deferred_streams() {
        let (transport, mut input, mut events) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "history/list",
                    Value::Null,
                    None,
                    Some("ordinary"),
                    false,
                    Duration::from_secs(30),
                )
                .await
        });
        invocation(&mut input).await;
        transport
            .request(
                "history/load",
                Value::Null,
                None,
                Some("deferred"),
                true,
                Duration::from_secs(30),
            )
            .await
            .unwrap();
        invocation(&mut input).await;
        transport.fail_pending("core exited").await;
        assert_eq!(request.await.unwrap().unwrap_err(), "core exited");
        let frame: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(frame["messageId"], "deferred");
        assert_eq!(frame["data"]["error"], "core exited");
        assert!(transport.inner.pending.lock().unwrap().is_empty());
        assert!(input.try_recv().is_err());
    }

    #[tokio::test]
    async fn stream_rejoin_reuses_the_core_id_and_abort_honours_the_workspace() {
        let (transport, mut input, mut events) = fixture();
        transport
            .request(
                "llm/streamChat",
                json!({}),
                Some("ws-a"),
                Some("stream"),
                true,
                Duration::from_secs(30),
            )
            .await
            .unwrap();
        let sent = invocation(&mut input).await;
        let ack = transport
            .request(
                "llm/streamChat",
                json!({"messageOptions": {"joinExistingStreamOnly": true, "lastAppliedSeq": 2}}),
                Some("ws-a"),
                Some("stream"),
                false,
                Duration::from_secs(1),
            )
            .await
            .unwrap();
        assert_eq!(ack, Value::Null);
        let rejoin = invocation(&mut input).await;
        assert_eq!(rejoin["messageId"], sent["messageId"]);
        assert_eq!(transport.inner.pending.lock().unwrap().len(), 1);
        assert!(!transport.abort("stream", Some("ws-b")));
        assert!(transport.abort("stream", Some("ws-a")));
        assert_eq!(invocation(&mut input).await["messageId"], sent["messageId"]);
        let frame: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(frame["messageId"], "stream");
        assert_eq!(frame["data"]["status"], "success");
        assert_eq!(frame["data"]["content"]["cancelled"], true);
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn a_closed_stdio_writer_does_not_leak_pending_requests() {
        let (transport, input, _) = fixture();
        drop(input);
        let result = transport
            .request(
                "history/list",
                Value::Null,
                None,
                Some("client"),
                false,
                Duration::from_secs(30),
            )
            .await;
        assert_eq!(result.unwrap_err(), "core not running");
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn closing_a_workspace_cancels_its_stream_without_ending_another() {
        let (transport, mut input, mut events) = fixture();
        for workspace in ["ws-a", "ws-b"] {
            transport
                .request(
                    "llm/streamChat",
                    json!({}),
                    Some(workspace),
                    Some(workspace),
                    true,
                    Duration::from_secs(30),
                )
                .await
                .unwrap();
        }
        let a = invocation(&mut input).await;
        let b = invocation(&mut input).await;
        assert_eq!(transport.cancel_workspace("ws-a"), 1);
        let abort = invocation(&mut input).await;
        assert_eq!(abort["messageType"], "abort");
        assert_eq!(abort["messageId"], a["messageId"]);
        let cancelled: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(cancelled["messageId"], "ws-a");
        assert_eq!(cancelled["data"]["status"], "success");
        assert_eq!(cancelled["data"]["content"]["cancelled"], true);
        assert_eq!(transport.inner.pending.lock().unwrap().len(), 1);
        transport
            .handle_frame(reply(&b, true, json!("complete")))
            .await;
        let completed: Value = serde_json::from_str(&events.recv().await.unwrap()).unwrap();
        assert_eq!(completed["messageId"], "ws-b");
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn active_stream_progress_renews_idle_timeout_beyond_the_original_deadline() {
        let (transport, mut input, mut events) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "llm/streamChat",
                    json!({}),
                    Some("a"),
                    Some("stream"),
                    false,
                    Duration::from_millis(180),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        for _ in 0..5 {
            tokio::time::sleep(Duration::from_millis(70)).await;
            assert!(
                !request.is_finished(),
                "ongoing output must not hit a total-duration cutoff"
            );
            transport
                .handle_frame(reply(&sent, false, json!("progress")))
                .await;
            events.recv().await.unwrap();
        }
        transport
            .handle_frame(reply(&sent, true, json!("complete")))
            .await;
        assert_eq!(
            request.await.unwrap().unwrap()["data"]["content"],
            "complete"
        );
        assert!(
            input.try_recv().is_err(),
            "renewing progress must not send an abort"
        );
    }

    #[tokio::test]
    async fn waiting_for_user_approval_suspends_idle_timeout_then_resumes_it() {
        let (transport, mut input, _) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "llm/streamChat",
                    json!({}),
                    Some("a"),
                    Some("approval"),
                    false,
                    Duration::from_millis(80),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        transport.begin_approval("a");
        tokio::time::sleep(Duration::from_millis(210)).await;
        assert!(
            !request.is_finished(),
            "user input wait is not a stalled model"
        );
        transport.end_approval("a");
        tokio::time::sleep(Duration::from_millis(20)).await;
        transport
            .handle_frame(reply(&sent, true, json!("approved")))
            .await;
        assert_eq!(
            request.await.unwrap().unwrap()["data"]["content"],
            "approved"
        );
        assert!(transport.inner.approvals.lock().unwrap().is_empty());
    }

    #[tokio::test]
    async fn a_stream_stalled_after_real_progress_is_still_cancelled() {
        let (transport, mut input, mut events) = fixture();
        let requester = transport.clone();
        let request = tokio::spawn(async move {
            requester
                .request(
                    "llm/streamChat",
                    json!({}),
                    Some("a"),
                    Some("stalled"),
                    false,
                    Duration::from_millis(100),
                )
                .await
        });
        let sent = invocation(&mut input).await;
        tokio::time::sleep(Duration::from_millis(60)).await;
        transport
            .handle_frame(reply(&sent, false, json!("one")))
            .await;
        events.recv().await.unwrap();
        assert_eq!(request.await.unwrap().unwrap_err(), "core timeout");
        assert_eq!(invocation(&mut input).await["messageId"], sent["messageId"]);
        assert!(transport.inner.pending.lock().unwrap().is_empty());
    }
}
