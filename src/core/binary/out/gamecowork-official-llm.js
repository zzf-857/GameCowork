// Official programming entitlement bridge. Real credentials stay in this Core
// closure. The Agent receives only a revocable, session-scoped loopback token.
// Protocol: original CLI SHA 8da5876521a7, bytes 4850164/4851351/10662100.
const http = require("node:http");
const crypto = require("node:crypto");
const path = require("node:path");
const { once } = require("node:events");
const OFFICIAL_BASE = "https://codely-litellm.tuanjie.cn/v1";
// Original oEe/Wge SDK default headers, bytes 5068877/4842989. The stable
// compatibility version is original sL(), byte 10430120. Identify this bridge
// separately without losing the official inference protocol's client marker.
const OFFICIAL_COMPAT_USER_AGENT = "codely-cli/1.0.0-release.57 (win32; x64)";
const SIGNING_SEED = Buffer.from("406f00f74768ba0cb0cd30f097ec6c2bdacb89c61a38b7dd140838bbd0e98018", "hex");
const SERVICES = new WeakMap();
const MAX_BODY = 16 * 1024 * 1024;
const MAX_FRAME = 2 * 1024 * 1024;
const ROUTES = { chat: "/chat/completions", responses: "/responses", messages: "/messages" };

function signature(cliApiKey, pathname, timestamp) {
  const seed = crypto.createHmac("sha256", SIGNING_SEED).update("codely-signing-v1").digest();
  const key = crypto.createHmac("sha256", seed).update(cliApiKey).digest();
  const digest = crypto.createHmac("sha256", key).update(["v1", pathname, String(timestamp)].join("\n")).digest("base64url");
  return `v1.${timestamp}.${digest}`;
}
function wireApi(model) {
  const declared = model.wireApi || model.wire_api;
  if (Object.hasOwn(ROUTES, declared)) return declared;
  return model.id.includes("messages/") || model.id.includes("claude") ? "messages"
    : model.id.includes("responses/") || model.id.includes("gpt") ? "responses" : "chat";
}
function scopedId(id) { return "codely-official:" + Buffer.from(id).toString("base64url"); }
function sameBinding(a, b) { return !!a && !!b && a.accountId === b.accountId && a.teamId === b.teamId && a.generationKey === b.generationKey; }
class OfficialLlmError extends Error { constructor(message, code) { super(message); this.code = code; } }
function fail(message, code = "official_unavailable") { return new OfficialLlmError(message, code); }
function redactJson(value, secret, depth = 0) {
  if (depth > 64) throw fail("官方服务响应嵌套超过限制");
  if (typeof value === "string") {
    const plain = value.replaceAll(secret, "[redacted]");
    if (plain !== value) return plain;
    // Tool arguments can be JSON source inside a JSON string. Parse only to
    // detect semantic secrets; preserve normal code/text/JSON byte-for-byte.
    if (/^\s*[\[{"]/.test(value)) {
      try {
        const decoded = JSON.parse(value), safe = redactJson(decoded, secret, depth + 1);
        if (JSON.stringify(decoded) !== JSON.stringify(safe)) return JSON.stringify(safe);
      } catch (error) { if (error instanceof OfficialLlmError) throw error; }
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(item => redactJson(item, secret, depth + 1));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) =>
    [key.replaceAll(secret, "[redacted]"), redactJson(item, secret, depth + 1)]));
  return value;
}
function requestJson(response, code, message) {
  if (response.headersSent) { response.destroy(); return; }
  response.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify({ error: { message, type: "gamecowork_official", code: "official_request_failed" } }));
}
async function boundedJson(response, max = MAX_FRAME) {
  if (!response.body) throw fail("官方服务响应为空");
  const chunks = []; let length = 0;
  for await (const bytes of response.body) {
    length += bytes.length;
    if (length > max) throw fail("官方服务响应超过大小限制");
    chunks.push(Buffer.from(bytes));
  }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
  catch { throw fail("官方服务返回无效 JSON"); }
}
async function upstreamErrorMessage(response, secret) {
  const prefix = `官方编程服务返回 HTTP ${response.status}`;
  try {
    const value = redactJson(await boundedJson(response, 128 * 1024), secret);
    const error = value?.error && typeof value.error === 'object' ? value.error : value;
    const message = typeof error?.message === 'string' ? error.message : typeof value?.error === 'string' ? value.error : null;
    const safe = text => text.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 700);
    if (message) return prefix + '：' + safe(message);
    const code = typeof error?.code === 'string' ? safe(error.code) : null;
    return code ? prefix + '：' + code : prefix + '，请检查权益或稍后重试';
  } catch { return prefix + '，请检查权益或稍后重试'; }
}
function createOfficialLlmService(options) {
  const { surface: getSurface, fetch: fetchImpl = globalThis.fetch, currentWorkspace, isOwnerAlive = () => true,
    now = () => Date.now(), upstreamBase = OFFICIAL_BASE, allowLoopbackFixture = false, onInvalidated = () => {} } = options;
  const upstream = new URL(upstreamBase);
  if (upstream.href.replace(/\/$/, "") !== OFFICIAL_BASE &&
      !(allowLoopbackFixture && upstream.protocol === "http:" && upstream.hostname === "127.0.0.1" && !upstream.username && !upstream.password && !upstream.search && !upstream.hash))
    throw fail("官方推理地址必须为已核实的官方服务");
  let binding = null, credential = null, catalog = [], loading = null, listener = null, listenerPromise = null, disposed = false;
  let surface = null, unsubscribe = null, monitor = null, epoch = 0;
  const capabilities = new Map(), active = new Set();
  function valid(expected = binding) {
    return !disposed && isOwnerAlive() && !!surface && sameBinding(expected, binding) && surface.isInferenceBindingCurrent(expected);
  }
  function revoke(sessionId) {
    for (const [token, capability] of capabilities) if (!sessionId || capability.sessionId === sessionId) capabilities.delete(token);
    for (const item of active) if (!sessionId || item.capability.sessionId === sessionId) item.abort.abort(fail("官方账号或会话已失效", "official_revoked"));
  }
  function invalidate() {
    epoch++; binding = null; credential = null; catalog = []; loading = null; revoke();
    onInvalidated();
  }
  function bindSurface(next) {
    if (surface === next) return;
    unsubscribe?.(); surface = next;
    unsubscribe = surface?.onInferenceInvalidated?.(invalidate) || null;
    if (!monitor) { monitor = setInterval(() => { if (binding && !valid()) invalidate(); }, 100); monitor.unref(); }
  }
  async function fetchDeadline(url, init, timeoutMs) {
    const abort = new AbortController(), external = init.signal;
    const forward = () => abort.abort(external.reason);
    if (external?.aborted) forward(); else external?.addEventListener("abort", forward, { once: true });
    const timer = setTimeout(() => abort.abort(fail("官方服务请求超时", "official_timeout")), timeoutMs);
    try {
      const result = await fetchImpl(url, { ...init, signal: abort.signal, redirect: "error" });
      // Callers retain the deadline until the response body has been consumed.
      return { result, finish() { clearTimeout(timer); external?.removeEventListener("abort", forward); } };
    } catch (error) { clearTimeout(timer); external?.removeEventListener("abort", forward); throw error; }
  }
  async function enable() {
    if (disposed || !isOwnerAlive()) throw fail("工作区已经关闭");
    if (loading) return loading;
    const next = getSurface();
    if (!next) throw fail("请先登录 Codely 官方账号", "requires_login");
    bindSurface(next);
    const operationEpoch = epoch;
    const pending = (async () => {
      const nextBinding = await surface.inferenceBinding();
      if (!nextBinding || !surface.isInferenceBindingCurrent(nextBinding)) throw fail("官方账号或组织已经变化，请重试");
      const key = await surface.getCliInferenceCredential({ binding: nextBinding });
      if (!key || typeof key.cliApiKey !== "string" || !key.cliApiKey.trim()) throw fail("官方服务未提供编程 API 凭据");
      const call = await fetchDeadline(new URL("models", upstream.href.replace(/\/$/, "") + "/"), {
        method: "GET", headers: { Authorization: `Bearer ${key.cliApiKey}`, Accept: "application/json" },
      }, 30000);
      let payload;
      try { if (!call.result.ok) throw fail(`官方模型目录返回 HTTP ${call.result.status}`); payload = await boundedJson(call.result); }
      finally { call.finish(); }
      if (epoch !== operationEpoch || disposed || !isOwnerAlive() || !surface.isInferenceBindingCurrent(nextBinding)) throw fail("官方账号或组织已经变化，请重新启用");
      if (!Array.isArray(payload?.data)) throw fail("官方模型目录形状无效");
      const models = [], ids = new Set();
      for (const record of payload.data) {
        if (!record || typeof record.id !== "string" || !record.id.trim() || record.id.length > 256 || /[\x00-\x1f]/.test(record.id) || ids.has(record.id) || record.id.includes(key.cliApiKey)) continue;
        ids.add(record.id);
        models.push({ id: scopedId(record.id), model: record.id, displayName: `${record.id} · Codely 官方 · Pro`, wireApi: wireApi(record),
          supportsMultimodal: record.capabilities?.vision === true || record.supports_vision === true });
      }
      if (!models.length) throw fail("官方服务未返回可用编程模型");
      if (!sameBinding(binding, nextBinding)) revoke();
      binding = Object.freeze({ ...nextBinding }); credential = key; catalog = models;
      return status();
    })();
    loading = pending;
    try { return await pending; }
    catch (error) { if (error instanceof OfficialLlmError) throw error; throw fail("官方编程模型加载失败，请重试"); }
    finally { if (loading === pending) loading = null; }
  }
  function status() { return { enabled: valid(), modelCount: valid() ? catalog.length : 0 }; }
  function models() { return valid() ? catalog.map(record => ({ ...record })) : []; }
  function lookup(selected) {
    const id = typeof selected === "string" ? selected : selected?.extras?.officialModelId;
    return valid() ? catalog.find(record => record.id === id || record.displayName === id) : null;
  }
  function profiles() { return models().map(record => ({ name: record.id, model: record.model, displayName: record.displayName,
    providerName: "Codely 官方 · Pro", roles: ["model"], officialModelId: record.id, wireApi: record.wireApi, supportsMultimodal: record.supportsMultimodal })); }
  function selectedModel(title) {
    const record = lookup(title);
    return record ? { title: record.displayName, model: record.model, customedModel: true,
      capabilities: { uploadImage: record.supportsMultimodal }, extras: { officialModelId: record.id, providerName: "Codely 官方 · Pro", wireApi: record.wireApi } } : null;
  }
  function selectionEnvironment(selected) {
    const record = lookup(selected);
    if (!record) throw fail("官方模型尚未启用或账号已失效，请在模型菜单重新启用");
    return { GAMECOWORK_OFFICIAL_MODEL: record.model, GAMECOWORK_OFFICIAL_SCOPE: binding.generationKey };
  }
  async function serve(req, res) {
    let item;
    try {
      if (req.headers.origin || req.headers.host !== `127.0.0.1:${listener.address().port}` || !["127.0.0.1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress))
        return requestJson(res, 403, "浏览器来源不能调用官方编程代理");
      const auth = req.headers.authorization;
      const token = typeof auth === "string" && auth.startsWith("Bearer ") ? auth.slice(7) : req.headers["x-api-key"];
      const capability = typeof token === "string" ? capabilities.get(token) : null;
      if (!capability || !valid(capability.binding) || !capability.ownerAlive() ||
          path.resolve(currentWorkspace()).toLowerCase() !== capability.workspace.toLowerCase()) return requestJson(res, 401, "官方编程会话已经失效");
      const exact = "/v1" + ROUTES[capability.model.wireApi];
      if (req.method === "GET" && req.url === "/v1/models") {
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        return res.end(JSON.stringify({ data: [{ id: capability.model.model, object: "model" }] }));
      }
      if (req.method !== "POST" || req.url !== exact) return requestJson(res, 403, "该会话不允许此模型接口");
      const abort = new AbortController(); item = { capability, abort }; active.add(item);
      const aborted = () => abort.abort(fail("Agent 已取消请求", "official_cancelled"));
      req.once("aborted", aborted); res.once("close", () => { if (!res.writableEnded) aborted(); });
      const chunks = []; let length = 0;
      for await (const bytes of req) { length += bytes.length; if (length > MAX_BODY) throw fail("编程请求超过大小限制"); chunks.push(bytes); }
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (body?.model !== capability.model.model) return requestJson(res, 403, "只能使用该会话明确选择的官方模型");
      if (!valid(capability.binding) || !capability.ownerAlive()) throw fail("官方编程会话已经失效");
      const url = new URL(upstream.href.replace(/\/$/, "") + ROUTES[capability.model.wireApi]);
      const key = credential;
      const headers = { "Content-Type": "application/json", Accept: body.stream ? "text/event-stream" : "application/json",
        Authorization: `Bearer ${key.cliApiKey}`, "X-Codely-Signature": signature(key.cliApiKey, url.pathname, Math.floor(now() / 1000)),
        "User-Agent": OFFICIAL_COMPAT_USER_AGENT, "x-litellm-session-id": capability.sessionId,
        "X-GameCowork-Client": "official-pro-bridge" };
      if (capability.model.wireApi === "messages") { headers["x-api-key"] = key.cliApiKey; headers["anthropic-version"] = "2023-06-01"; }
      const call = await fetchDeadline(url, { method: "POST", headers, body: JSON.stringify(body), signal: abort.signal }, 600000);
      try {
        if (!call.result.ok) return requestJson(res, call.result.status, await upstreamErrorMessage(call.result, key.cliApiKey));
        if (!valid(capability.binding) || !capability.ownerAlive()) throw fail("官方编程会话已经失效");
        if (!body.stream) {
          const result = await boundedJson(call.result);
          if (!valid(capability.binding) || !capability.ownerAlive() || !capabilities.has(token)) throw fail("官方编程会话已经失效");
          if (result?.error) return requestJson(res, 502, "官方编程服务返回错误");
          res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
          return res.end(JSON.stringify(redactJson(result, key.cliApiKey)));
        }
        if (!String(call.result.headers.get("content-type") || "").includes("text/event-stream")) throw fail("官方服务未返回请求的流式响应");
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", "X-Accel-Buffering": "no" });
        const decoder = new TextDecoder("utf-8", { fatal: true }); let pending = "", final = false, finalFrame = null, bytesTotal = 0;
        const toolJson = new Map();
        function appendTool(id, text, makeEvent) {
          const old = toolJson.get(id) || { text: "", makeEvent };
          old.text += text; if (old.text.length > MAX_FRAME) throw fail("官方工具参数超过大小限制");
          toolJson.set(id, old);
        }
        function flushTool(id) {
          const results = [];
          for (const [key, record] of toolJson) if (!id || key === id) {
            if (record.text) {
              try { JSON.parse(record.text); } catch { throw fail("官方工具参数 JSON 不完整"); }
              results.push(record.makeEvent(redactJson(record.text, key.cliApiKey)));
            }
            toolJson.delete(key);
          }
          return results;
        }
        function filterToolArguments(event) {
          const before = [];
          if (capability.model.wireApi === "chat") for (const choice of event.choices || []) {
            for (const tool of choice.delta?.tool_calls || []) if (typeof tool.function?.arguments === "string") {
              const id = `chat:${choice.index || 0}:${tool.index || 0}`;
              appendTool(id, tool.function.arguments, argumentsText => ({ ...event, choices: [{ index: choice.index || 0,
                delta: { tool_calls: [{ index: tool.index || 0, function: { arguments: argumentsText } }] }, finish_reason: null }] }));
              tool.function.arguments = "";
            }
            if (choice.finish_reason !== null && choice.finish_reason !== undefined) before.push(...flushTool());
          }
          if (capability.model.wireApi === "messages") {
            const id = `messages:${event.index || 0}`;
            if (event.type === "content_block_delta" && event.delta?.type === "input_json_delta" && typeof event.delta.partial_json === "string") {
              appendTool(id, event.delta.partial_json, partial => ({ ...event, delta: { ...event.delta, partial_json: partial } }));
              event.delta.partial_json = "";
            }
            if (event.type === "content_block_stop") before.push(...flushTool(id));
            if (event.type === "message_stop") before.push(...flushTool());
          }
          if (capability.model.wireApi === "responses") {
            const id = `responses:${event.item_id || event.output_index || 0}`;
            if (event.type === "response.function_call_arguments.delta" && typeof event.delta === "string") {
              appendTool(id, event.delta, delta => ({ ...event, delta })); event.delta = "";
            }
            if (event.type === "response.function_call_arguments.done") before.push(...flushTool(id));
            if (event.type === "response.completed") before.push(...flushTool());
          }
          return before;
        }
        for await (const chunk of call.result.body) {
          if (abort.signal.aborted || !valid(capability.binding) || !capability.ownerAlive() || !capabilities.has(token)) throw fail("官方编程会话已经失效");
          bytesTotal += chunk.length; if (bytesTotal > 128 * 1024 * 1024) throw fail("官方流响应超过大小限制");
          pending = (pending + decoder.decode(chunk, { stream: true })).replaceAll("\r\n", "\n");
          if (pending.length > MAX_FRAME) throw fail("官方流帧超过大小限制");
          for (;;) {
            const end = pending.indexOf("\n\n"); if (end < 0) break;
            const frame = pending.slice(0, end); pending = pending.slice(end + 2);
            const lines = frame.split("\n"), data = lines.filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
            let safeFrame = frame;
            if (data && final) throw fail("官方编程流在结束帧之后仍返回数据");
            if (data === "[DONE]") {
              if (capability.model.wireApi !== "chat") throw fail("官方编程流结束帧与模型协议不一致");
              for (const toolEvent of flushTool()) if (!res.write("data: " + JSON.stringify(redactJson(toolEvent, key.cliApiKey)) + "\n\n")) await once(res, "drain", { signal: abort.signal });
              final = true;
            } else if (data) {
              const event = JSON.parse(data);
              if (!event || typeof event !== "object" || Array.isArray(event)) throw fail("官方编程流 JSON 帧无效");
              if (event.error || ["error", "response.failed", "response.incomplete"].includes(event.type)) throw fail("官方编程流返回错误");
              if (event.type === "response.completed" || event.type === "message_stop") {
                if (event.type !== (capability.model.wireApi === "responses" ? "response.completed" : capability.model.wireApi === "messages" ? "message_stop" : ""))
                  throw fail("官方编程流结束帧与模型协议不一致");
                if (event.type === "response.completed" && event.response?.status !== "completed") throw fail("官方 Responses 未报告真实 completed 状态");
                final = true;
              }
              for (const toolEvent of filterToolArguments(event)) if (!res.write("data: " + JSON.stringify(redactJson(toolEvent, key.cliApiKey)) + "\n\n")) await once(res, "drain", { signal: abort.signal });
              const safeData = JSON.stringify(redactJson(event, key.cliApiKey));
              let inserted = false;
              safeFrame = lines.flatMap(line => {
                if (!line.startsWith("data:")) return [line];
                if (inserted) return [];
                inserted = true; return ["data: " + safeData];
              }).join("\n");
            }
            const safeBytes = safeFrame.replaceAll(key.cliApiKey, "[redacted]") + "\n\n";
            // SDKs stop reading at the terminal event. Publish it only after
            // the upstream body/UTF-8 tail is verified, so a later transport
            // failure cannot already have been reported as completed.
            if (data && final) finalFrame = safeBytes;
            else if (!res.write(safeBytes)) await once(res, "drain", { signal: abort.signal });
          }
        }
        pending += decoder.decode();
        if (!final || pending.trim()) throw fail("官方编程流未收到完整结束帧");
        if (!valid(capability.binding) || !capability.ownerAlive() || !capabilities.has(token)) throw fail("官方编程会话已经失效");
        if (!res.write(finalFrame)) await once(res, "drain", { signal: abort.signal });
        res.end();
      } finally { call.finish(); }
    } catch { requestJson(res, 502, "官方编程请求中断或响应无效，请重试"); }
    finally { if (item) { item.abort.abort(); active.delete(item); } }
  }
  async function ensureListener() {
    if (listener) return;
    if (!listenerPromise) listenerPromise = (async () => {
      const server = http.createServer((req, res) => { serve(req, res); });
      server.requestTimeout = 30000; server.headersTimeout = 10000;
      await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
      if (disposed) { server.close(); throw fail("工作区已经关闭"); }
      listener = server; server.unref();
    })();
    await listenerPromise;
  }
  async function sessionEnvironment(sessionId, workspace, selected, ownerAlive) {
    if (!sessionId || typeof ownerAlive !== "function") throw fail("官方编程会话身份无效");
    const record = lookup(selected); if (!record) throw fail("官方模型尚未启用或账号已失效");
    const expectedWorkspace = path.resolve(currentWorkspace());
    if (path.resolve(workspace).toLowerCase() !== expectedWorkspace.toLowerCase() || !ownerAlive()) throw fail("官方编程工作区身份已经变化");
    await ensureListener(); if (!valid() || !ownerAlive()) throw fail("官方编程会话已经失效");
    revoke(sessionId);
    const token = crypto.randomBytes(32).toString("base64url");
    capabilities.set(token, { sessionId, workspace: expectedWorkspace, model: record, binding, ownerAlive });
    const base = `http://127.0.0.1:${listener.address().port}/v1`;
    return { ...selectionEnvironment(selected), GAMECOWORK_OFFICIAL_LOOPBACK: base, GAMECOWORK_OFFICIAL_CAPABILITY: token,
      GAMECOWORK_OFFICIAL_WORKSPACE: expectedWorkspace,
      GAMECOWORK_OFFICIAL_AUTH: record.wireApi === "messages" ? "anthropic" : "openai", GAMECOWORK_OFFICIAL_WIRE_API: record.wireApi,
      GAMECOWORK_TOKEN: "", OPENAI_API_KEY: record.wireApi === "messages" ? "" : token, OPENAI_BASE_URL: base,
      ANTHROPIC_AUTH_TOKEN: record.wireApi === "messages" ? token : "", ANTHROPIC_API_KEY: "", ANTHROPIC_BASE_URL: base,
      HTTP_PROXY: "", HTTPS_PROXY: "", ALL_PROXY: "", http_proxy: "", https_proxy: "", all_proxy: "", NO_PROXY: "127.0.0.1", no_proxy: "127.0.0.1", NODE_USE_ENV_PROXY: "" };
  }
  function close() { disposed = true; invalidate(); unsubscribe?.(); if (monitor) clearInterval(monitor); listener?.close(); listener?.closeAllConnections(); }
  return { enable, status, models, profiles, lookup, selectedModel, selectionEnvironment, sessionEnvironment, revoke, invalidate, close };
}
function registerCoreWiring({ messenger, core }) {
  if (SERVICES.has(core.ide)) return;
  const service = createOfficialLlmService({ surface: () => require("./gamecowork-codely-account.js").codelyAccountInferenceSurface(),
    currentWorkspace: () => core.workspaceDirs[0], isOwnerAlive: () => core.messenger?.disposed !== true,
    upstreamBase: process.env.GAMECOWORK_TEST_MODE === "1" && process.env.GAMECOWORK_CODELY_INFERENCE_BASE_URL || OFFICIAL_BASE,
    allowLoopbackFixture: process.env.GAMECOWORK_TEST_MODE === "1",
    onInvalidated: () => { if (core.messenger?.disposed !== true) core.configHandler.reloadConfig("Codely official programming authorization changed").catch(() => {}); },
  });
  SERVICES.set(core.ide, service);
  core._gamecoworkOfficialLlm = service;
  messenger.on("codelyOfficial/status", async () => service.status());
  messenger.on("codelyOfficial/enable", async () => {
    const result = await service.enable();
    await core.configHandler.reloadConfig("Codely official programming models enabled");
    return result;
  });
}
function getService(ide) { return SERVICES.get(ide); }
function profiles(ide) { return getService(ide)?.profiles() || []; }
function selectedModel(ide, title) { return getService(ide)?.selectedModel(title); }
function selectionEnvironment(ide, selected) { return getService(ide)?.selectionEnvironment(selected) || {}; }
function sessionEnvironment(ide, ...args) {
  const service = getService(ide); if (!service) throw fail("官方编程服务尚未初始化");
  return service.sessionEnvironment(...args);
}
function revoke(ide, sessionId) { getService(ide)?.revoke(sessionId); }
function close(ide) { getService(ide)?.close(); SERVICES.delete(ide); }
async function prepareAcpEnvironment(core, sessionId, selected, cwd, env, holder) {
  const transient = await sessionEnvironment(core.ide, sessionId, cwd, selected,
    () => core.messenger?.disposed !== true && !holder.isDisposed() && core.acpSessionHolders.get(sessionId) === holder);
  Object.assign(env, transient, { CUSTOM_AUTH: "1" });
  return cwd;
}
module.exports = { createOfficialLlmService, registerCoreWiring, getService, profiles, selectedModel, selectionEnvironment, sessionEnvironment, prepareAcpEnvironment, revoke, close, signature, wireApi, sameBinding, upstreamErrorMessage };
