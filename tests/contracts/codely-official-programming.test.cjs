const test = require("node:test"), assert = require("node:assert/strict"), http = require("node:http"), fs = require("node:fs"), vm = require("node:vm"), path = require("node:path");
const { createOfficialLlmService, signature } = require("../../src/core/binary/out/modules/account/official-llm.js");
const ROOT = path.resolve(__dirname, "../..");
const KEY = "fixture-cli-key-never-given-to-agent";
test("Signature matches the independently extracted original CLI vector (SHA 8da5876521a7 bytes 4850164/4851351)", () => {
  assert.equal(signature(KEY, "/v1/chat/completions", 1700000000), "v1.1700000000.seBpGYWjNsSze3R0OiEZfoqEhCJ8XwIQrZroqH3BAbU");
});
function fixtureSurface(options={}) {
  const state = { binding: { accountId: "fixture-account-hash", teamId: "fixture-team", generationKey: "fixture-generation" }, keyCalls: 0 };
  const listeners = new Set();
  const surface = { inferenceBinding: async () => ({ ...state.binding }),
    getModelMenuConfig:async()=>({binding:{...state.binding},models:require('../../src/core/binary/out/modules/account/official-model-menu.js').projectModelMenu({models:(options.models||[{id:'fixture-model'},{id:'gpt-fixture'},{id:'claude-fixture'}]).map(row=>({name:row.id,model:row.id,roles:['chat','summarize','apply','edit'],capabilities:row.capabilities?.vision===true||row.supports_vision===true?['image_input']:[],extras:{...(row.wireApi?{wireApi:row.wireApi}:{})}}))},{secrets:[KEY]})}),
    isModelMenuBindingCurrent:binding=>!!state.binding&&binding.generationKey===state.binding.generationKey,
    getCliInferenceCredential: async () => { state.keyCalls++; return { cliApiKey: KEY, userId: "fixture-user-id", rpm: 5, tpm: 10 }; },
    isInferenceBindingCurrent: binding => !!state.binding && binding.generationKey === state.binding.generationKey,
    onInferenceInvalidated: listener => { listeners.add(listener); return () => listeners.delete(listener); } };
  return { surface, state, invalidate() { state.binding = null; for (const listener of listeners) listener(); } };
}
async function fixture(t, options = {}) {
  const account = fixtureSurface(options), calls = [];
  const upstream = http.createServer(async (req, res) => {
    let bytes = ""; for await (const chunk of req) bytes += chunk;
    const body = bytes ? JSON.parse(bytes) : null;
    calls.push({ method: req.method, url: req.url, body, headers: req.headers });
    if (req.url === "/v1/models") { res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ data: options.models || [{ id: "fixture-model" }, { id: "gpt-fixture" }, { id: "claude-fixture" }] })); }
    if (options.handler) return options.handler(req, res, body);
    res.setHeader("content-type", "text/event-stream");
    if (req.url === "/v1/responses") res.end('data: {"type":"response.completed","response":{"status":"completed"}}\n\n');
    else if (req.url === "/v1/messages") res.end('event: message_stop\ndata: {"type":"message_stop"}\n\n');
    else res.end('data: {"choices":[{"delta":{"content":"fixture"}}]}\n\ndata: [DONE]\n\n');
  });
  await new Promise(resolve => upstream.listen(0, "127.0.0.1", resolve));
  const workspace = path.join(ROOT, "tests/fixtures"), service = createOfficialLlmService({
    surface: () => account.surface, currentWorkspace: () => workspace, allowLoopbackFixture: true,
    upstreamBase: `http://127.0.0.1:${upstream.address().port}/v1`, now: () => 1700000000000,
  });
  t.after(async () => { service.close(); upstream.closeAllConnections(); await new Promise(resolve => upstream.close(resolve)); });
  async function endpoint(model = "fixture-model", sessionId = "fixture-session") {
    const record = service.models().find(item => item.model === model);
    assert.ok(record);
    const selected = { model: record.model, extras: { officialModelId: record.id, wireApi: record.wireApi } };
    const env = await service.sessionEnvironment(sessionId, workspace, selected, () => true);
    return { env, selected, url: env.GAMECOWORK_OFFICIAL_LOOPBACK, token: env.GAMECOWORK_OFFICIAL_CAPABILITY };
  }
  const request = (endpoint, body, route = "chat/completions", extra = {}) => fetch(`${endpoint.url}/${route}`, {
    method: "POST", headers: { Authorization: `Bearer ${endpoint.token}`, "Content-Type": "application/json", ...extra }, body: JSON.stringify(body),
  });
  return { account, calls, workspace, service, endpoint, request };
}
test("Native menu metadata and compatible enable never obtain a CLI key; session launch acquires it privately", async t => {
  const f = await fixture(t); assert.deepEqual(f.service.status(), { enabled: false, modelCount: 0 });
  assert.deepEqual(f.service.profiles(), []); assert.equal(f.account.state.keyCalls, 0); assert.equal(f.calls.length, 0);
  const result = await f.service.enable(); assert.equal(result.modelCount, 3); assert.equal(f.account.state.keyCalls, 0);assert.equal(f.calls.length,0);
  await f.endpoint();assert.equal(f.account.state.keyCalls,1);assert.equal(f.calls.length,0);
  const exposed = JSON.stringify([result, f.service.profiles(), f.service.models()]);
  assert.ok(!exposed.includes(KEY)); assert.ok(!exposed.includes("fixture-user-id"));
});
test("Agent capability authorizes only exact workspace, catalog model, endpoint and no browser Origin", async t => {
  const f = await fixture(t); await f.service.enable(); const peer = await f.endpoint();
  assert.ok(!JSON.stringify(peer.env).includes(KEY)); assert.match(peer.token, /^[A-Za-z0-9_-]{43}$/);
  const req = { model: "fixture-model", messages: [{ role: "user", content: "fixture" }], stream: true };
  for (const [body, route, headers, status] of [
    [{ ...req, model: "unknown-model" }, "chat/completions", {}, 403],
    [req, "responses", {}, 403], [req, "chat/completions?url=remote", {}, 403],
    [req, "chat/completions", { Origin: "http://127.0.0.1:1" }, 403],
    [req, "chat/completions", { Authorization: "Bearer wrong" }, 401],
  ]) assert.equal((await f.request(peer, body, route, headers)).status, status);
  assert.equal(f.calls.length, 0, "denied requests never reach upstream");
  await assert.rejects(f.service.sessionEnvironment("other", path.join(f.workspace, "other"), peer.selected, () => true), /工作区/);
  const accepted = await f.request(peer, req); assert.equal(accepted.status, 200); assert.match(await accepted.text(), /\[DONE\]/);
  const call = f.calls.at(-1); assert.equal(call.headers.authorization, `Bearer ${KEY}`);
  assert.equal(call.headers["x-codely-signature"], signature(KEY, "/v1/chat/completions", 1700000000));
  assert.equal(call.headers["user-agent"], "codely-cli/1.0.0-release.57 (win32; x64)");
  assert.equal(call.headers["x-litellm-session-id"], "fixture-session");
  assert.equal(call.headers["x-gamecowork-client"], "official-pro-bridge");
  assert.notEqual(call.headers["x-litellm-session-id"], peer.token);
});
test("Each catalog model uses its original declared or Core-derived wire transport and final frame", async t => {
  const f = await fixture(t); await f.service.enable();
  for (const [model, route, final] of [["fixture-model", "chat/completions", "[DONE]"], ["gpt-fixture", "responses", "response.completed"], ["claude-fixture", "messages", "message_stop"]]) {
    const peer = await f.endpoint(model, model), result = await f.request(peer, { model, stream: true }, route);
    assert.equal(result.status, 200); assert.ok((await result.text()).includes(final));
    if (route === "messages") { assert.equal(f.calls.at(-1).headers["x-api-key"], KEY); assert.equal(f.calls.at(-1).headers["anthropic-version"], "2023-06-01"); }
  }
});
test("Logout/organization invalidation immediately aborts in-flight inference and revokes old tickets", async t => {
  let upstreamAborted = false;
  const f = await fixture(t, { handler(req, res) { res.setHeader("content-type", "text/event-stream"); res.write('data: {"choices":[{"delta":{"content":"first"}}]}\n\n'); res.once("close", () => { upstreamAborted = true; }); } });
  await f.service.enable(); const peer = await f.endpoint(), response = await f.request(peer, { model: "fixture-model", stream: true });
  const reader = response.body.getReader(); assert.equal((await reader.read()).done, false);
  f.account.invalidate(); await assert.rejects(reader.read());
  assert.equal((await f.request(peer, { model: "fixture-model", stream: true })).status, 401);
  assert.equal(f.service.status().enabled, false);
  await new Promise(resolve => setTimeout(resolve, 20)); assert.equal(upstreamAborted, true);
});
test("Closing a session revokes only its token while another owned session stays usable", async t => {
  const f = await fixture(t); await f.service.enable(); const a = await f.endpoint("fixture-model", "a"), b = await f.endpoint("fixture-model", "b");
  f.service.revoke("a"); const body = { model: "fixture-model", stream: true };
  assert.equal((await f.request(a, body)).status, 401); assert.equal((await f.request(b, body)).status, 200);
});
test("Truncated streams never produce a fabricated completion or final frame", async t => {
  const f = await fixture(t, { handler(req, res) { res.setHeader("content-type", "text/event-stream"); res.end('data: {"choices":[{"delta":{"content":"incomplete"}}]}\n\n'); } });
  await f.service.enable(); const peer = await f.endpoint();
  await assert.rejects(async () => { const response = await f.request(peer, { model: "fixture-model", stream: true }); await response.text(); });
});
for (const [model, route, frame] of [
  ["gpt-fixture", "responses", "data: [DONE]\n\n"],
  ["claude-fixture", "messages", 'data: {"type":"response.completed","response":{"status":"completed"}}\n\n'],
  ["fixture-model", "chat/completions", 'data: {"type":"message_stop"}\n\n'],
  ["gpt-fixture", "responses", 'data: {"type":"response.completed","response":{"status":"failed"}}\n\n'],
  ["gpt-fixture", "responses", 'data: {"type":"response.completed","response":{"status":"incomplete"}}\n\n'],
]) test(`${model}: another wire's final frame or unsuccessful terminal state cannot complete inference`, async t => {
  const f = await fixture(t, { handler(req, res) { res.setHeader("content-type", "text/event-stream"); res.end(frame); } });
  await f.service.enable(); const peer = await f.endpoint(model);
  await assert.rejects(async () => { const response = await f.request(peer, { model, stream: true }, route); await response.text(); });
});
test("Parsed SSE JSON is recursively redacted even when the Key uses Unicode escapes and multiline data", async t => {
  const escaped = [...KEY].map(character => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0")).join("");
  const frame = 'event: fixture\nid: owned-event\n: comment\ndata: {"choices": [\ndata: {"delta":{"content":"' + escaped + '","nested":[{"' + escaped + '":"' + escaped + '"}]}}]}\n\n';
  const f = await fixture(t, { handler(req, res) { res.setHeader("content-type", "text/event-stream"); res.end(frame + "data: [DONE]\n\n"); } });
  await f.service.enable(); const peer = await f.endpoint(), response = await f.request(peer, { model: "fixture-model", stream: true });
  const text = await response.text(); assert.match(text, /event: fixture\nid: owned-event\n: comment/);
  const payload = JSON.parse(text.split("\n").find(line => line.startsWith("data: {")).slice(6));
  assert.equal(payload.choices[0].delta.content, "[redacted]"); assert.ok(!JSON.stringify(payload).includes(KEY)); assert.ok(!text.includes(escaped));
});
for (const [model, route, wire] of [["fixture-model", "chat/completions", "chat"], ["claude-fixture", "messages", "messages"], ["gpt-fixture", "responses", "responses"]])
  test(`${wire}: nested JSON tool arguments split across deltas are semantically redacted before SDK parsing`, async t => {
    const encodedKey = [...KEY].map(character => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0")).join("");
    const source = '{"secret":"' + encodedKey + '","code":"Console.WriteLine(1);"}', middle = Math.floor(source.length / 2), chunks = [source.slice(0, middle), source.slice(middle)];
    const events = wire === "chat"
      ? [...chunks.map(argumentsText => ({ choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: argumentsText } }] }, finish_reason: null }] })), { choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }] }]
      : wire === "messages"
        ? [...chunks.map(partial => ({ type: "content_block_delta", index: 0, delta: { type: "input_json_delta", partial_json: partial } })), { type: "content_block_stop", index: 0 }, { type: "message_stop" }]
        : [...chunks.map(delta => ({ type: "response.function_call_arguments.delta", item_id: "owned-tool", delta })), { type: "response.function_call_arguments.done", item_id: "owned-tool", arguments: source }, { type: "response.completed", response: { status: "completed" } }];
    const f = await fixture(t, { handler(req, res) { res.setHeader("content-type", "text/event-stream"); res.end(events.map(event => "data: " + JSON.stringify(event) + "\n\n").join("") + (wire === "chat" ? "data: [DONE]\n\n" : "")); } });
    await f.service.enable(); const peer = await f.endpoint(model), response = await f.request(peer, { model, stream: true }, route);
    const body = await response.text(), parsed = body.split("\n").filter(line => line.startsWith("data: {")).map(line => JSON.parse(line.slice(6)));
    const argumentsText = parsed.map(event => wire === "chat" ? event.choices?.[0]?.delta?.tool_calls?.[0]?.function?.arguments || ""
      : wire === "messages" ? event.delta?.partial_json || "" : event.type === "response.function_call_arguments.delta" ? event.delta : "").join("");
    const args = JSON.parse(argumentsText); assert.equal(args.secret, "[redacted]"); assert.equal(args.code, "Console.WriteLine(1);"); assert.ok(!argumentsText.includes(KEY));
    const done = parsed.find(event => event.type === "response.function_call_arguments.done"); if (done) assert.equal(JSON.parse(done.arguments).secret, "[redacted]");
  });
test("Invalid UTF-8 or incomplete codepoints after a valid terminator are rejected", async t => {
  const f = await fixture(t, { handler(req, res) { res.setHeader("content-type", "text/event-stream"); res.end(Buffer.concat([Buffer.from("data: [DONE]\n\n"), Buffer.from([0xf0, 0x80])])); } });
  await f.service.enable(); const peer = await f.endpoint();
  await assert.rejects(async () => { const response = await f.request(peer, { model: "fixture-model", stream: true }); await response.text(); });
});
test("Malformed menu metadata and underlying exceptions never reveal private material in metadata loading errors", async t => {
  const account = fixtureSurface();
  account.surface.getModelMenuConfig=async()=>{throw Error('Invalid JSON '+KEY);};
  const service = createOfficialLlmService({ surface: () => account.surface, currentWorkspace: () => ROOT,
    fetch: async () => new Response(KEY, { headers: { "content-type": "application/json" } }) });
  t.after(() => service.close());
  await assert.rejects(service.enable(), error => error.message === "官方内置模型配置加载失败，请刷新菜单" && !String(error.stack).includes(KEY));
  const secondary = createOfficialLlmService({ surface: () => account.surface, currentWorkspace: () => ROOT,
    fetch: async () => { throw Error("Synthetic exception: " + KEY); } });
  t.after(() => secondary.close());
  await assert.rejects(secondary.enable(), error => error.message === "官方内置模型配置加载失败，请刷新菜单" && !String(error.stack).includes(KEY));
});
test("Exhaustion and permission errors retain server status without leaking the actual Key", async t => {
  const f = await fixture(t, { handler(req, res) { res.writeHead(429); res.end(JSON.stringify({ error: KEY })); } });
  await f.service.enable(); const peer = await f.endpoint(), result = await f.request(peer, { model: "fixture-model", stream: true });
  assert.equal(result.status, 429); assert.ok(!(await result.text()).includes(KEY));
});
test("Non-2xx JSON diagnostics preserve a legitimate 400 message while redacting Keys in fields and nested message JSON", async t => {
  const unicodeKey = [...KEY].map(character => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0")).join("");
  const welcome = "欢迎使用Codely, 访问 https://codely.tuanjie.cn/";
  const cases = {
    plain: { error: "Invalid credential: " + KEY, details: { originalKey: KEY } },
    nested: { error: { message: '{"credential":"' + unicodeKey + '","reason":"denied"}', details: [{ message: KEY }] } },
    welcome: { error: welcome },
  };
  const f = await fixture(t, { handler(req, res, body) { res.writeHead(400, { "Content-Type": "application/json" }); res.end(JSON.stringify(cases[body.fixtureCase])); } });
  await f.service.enable(); const peer = await f.endpoint();
  for (const fixtureCase of ["plain", "nested", "welcome"]) {
    const response = await f.request(peer, { model: "fixture-model", stream: true, fixtureCase });
    assert.equal(response.status, 400); const result = await response.json(), message = result.error.message;
    assert.ok(message.startsWith("官方编程服务返回 HTTP 400")); assert.ok(!JSON.stringify(result).includes(KEY)); assert.ok(!message.includes(unicodeKey));
    if (fixtureCase === "plain") assert.ok(message.includes("Invalid credential: [redacted]"));
    if (fixtureCase === "nested") assert.deepEqual(JSON.parse(message.slice(message.indexOf("：") + 1)), { credential: "[redacted]", reason: "denied" });
    if (fixtureCase === "welcome") assert.equal(message, "官方编程服务返回 HTTP 400：" + welcome);
  }
});
test("Official upstream cannot be configured to an arbitrary host or via non-fixture HTTP", () => {
  for (const upstreamBase of ["https://example.invalid/v1", "http://127.0.0.1:1/v1", "https://codely-litellm.tuanjie.cn/v1?x=1"]) assert.throws(() => createOfficialLlmService({ upstreamBase }), /已核实/);
});
test("Trusted CLI runtime overrides all model/auth slots without persisting or inheriting CPA settings", () => {
  const source = fs.readFileSync(path.join(ROOT, "src/agent/cli-main.beautified.js"), "utf8");
  const start = source.indexOf("  function gcuCliOfficialContext("), end = source.indexOf("  function gcuCliLocalAuth(", start);
  const workspace = path.join(ROOT, "tests/fixtures");
  const context = vm.createContext({ URL, require, process: { cwd: () => workspace, env: {
    GAMECOWORK_LOCAL_PROVIDER_MODE: "1", GAMECOWORK_OFFICIAL_LOOPBACK: "http://127.0.0.1:34567/v1", GAMECOWORK_OFFICIAL_CAPABILITY: "a".repeat(43),
    GAMECOWORK_OFFICIAL_MODEL: "fixture-model", GAMECOWORK_OFFICIAL_AUTH: "openai", GAMECOWORK_OFFICIAL_WIRE_API: "chat", GAMECOWORK_OFFICIAL_WORKSPACE: workspace,
  } } });
  vm.runInContext(source.slice(start, end), context);
  const original = { model: "CPA", contentGenerator: { overrides: { model: { authType: "openai", apiKey: "local-cpa-key", baseUrl: "https://example.invalid/v1" } } }, flashModel: "CPA flash" };
  const before = JSON.stringify(original), locked = context.gcuCliOfficialSettings(original, workspace);
  assert.equal(JSON.stringify(original), before); assert.equal(locked.model, "fixture-model"); assert.equal(locked.flashModel, "fixture-model");
  assert.equal(locked.contentGenerator.overrides.model.authType, "openai"); assert.ok(!JSON.stringify(locked).includes("local-cpa-key"));
  assert.throws(() => context.gcuCliOfficialSettings(original, path.join(workspace, "other")), /workspace/);
});
test("Actual trusted CLI initialization discards overriding endpoint/key flags and forces no proxy despite inherited options", () => {
  const source = fs.readFileSync(path.join(ROOT, "src/agent/cli-main.beautified.js"), "utf8"), workspace = path.join(ROOT, "tests/fixtures");
  const start = source.indexOf("    async function MMr("), end = source.indexOf("      let u =", start);
  const env = { OPENAI_API_KEY: "old-cpa-key", OPENAI_BASE_URL: "https://external.invalid/v1", HTTP_PROXY: "http://external.invalid:8080", HTTPS_PROXY: "http://external.invalid:8080" };
  const context = vm.createContext({ process: { env }, Tu: { default: { cwd: () => workspace, env } },
    gcuCliOfficialSettings: settings => settings, gcuCliOfficialContext: () => ({ model: "official-model", authType: "openai", wireApi: "chat", token: "opaque-capability", endpoint: "http://127.0.0.1:34567/v1" }) });
  vm.runInContext(source.slice(start, end) + " return {e,n}; }", context);
  return context.MMr({}, [], "session", { openaiApiKey: "bad-key", openaiBaseUrl: "https://external.invalid/v1", proxy: "http://external.invalid:8080", model: "other-model" }, workspace).then(result => {
    assert.equal(result.n.openaiApiKey, undefined); assert.equal(result.n.openaiBaseUrl, undefined); assert.equal(result.n.proxy, undefined); assert.equal(result.n.model, "official-model");
    assert.equal(env.OPENAI_API_KEY, "opaque-capability"); assert.equal(env.OPENAI_BASE_URL, "http://127.0.0.1:34567/v1");
    const proxy = source.slice(start).match(/proxy:\r?\n\s*([\s\S]*?),\s*cwd: s,/)[1];
    assert.equal(vm.runInNewContext(proxy, { officialContext: {}, n: { proxy: "http://external.invalid:8080" }, Tu: { default: { env } } }), undefined);
  });
});
for (const file of ["index.js", "index.beautified.js"]) test(`${file}: official models coexist with local profiles and selection leaves project Provider settings untouched`, async () => {
  const source = fs.readFileSync(path.join(ROOT, "src/core/binary/out", file), "utf8");
  function between(a, b) { return source.slice(source.indexOf(a), source.indexOf(b, source.indexOf(a) + a.length)); }
  const writes = [], context = vm.createContext({ require: () => ({ selectedModel: () => null, selectionEnvironment: () => ({ GAMECOWORK_OFFICIAL_MODEL: "real-id" }) }), q2: () => ({ id: "CPA" }) });
  vm.runInContext(between("async function Iya(", "var mqt"), context);
  const owner = { ide: {}, activeCustomModel: { id: "CPA" }, resolveActiveSlotCustomModels() {}, getWorkspaceCwd: async () => "owned", applyActiveCustomModelsToProject: value => writes.push(value) };
  await context.Iya(owner, { extras: { officialModelId: "official" } }); assert.equal(writes.length, 0); assert.equal(owner.activeOfficialModel, "official");
  await context.Iya(owner, { extras: { customModelId: "CPA" } }); assert.deepEqual(writes, ["owned"]); assert.equal(owner.activeOfficialModel, undefined);
  assert.match(source, /modules\/account\/official-llm\.js["']\)\.registerCoreWiring/);
  assert.match(between("async function fpa(", "S0();"), /\.\.\.official,\.\.\.\(local\?\.profiles\|\|\[\]\)/);
});
test("The actual shell routes logout and all global account RPCs to the single default broker after opening a workspace", () => {
  const source = fs.readFileSync(path.join(ROOT, "src/shell/src/main.rs"), "utf8");
  const at = source.indexOf("The account broker belongs to the default Core owner"), end = source.indexOf("if let Some(result) = local_message", at);
  const block = source.slice(at, end);
  for (const kind of ["logoutOfControlPlane", "cancelLogin", "notifyDeviceFlowExpired", "codelyAccount/status", "codelyAccount/logout"]) assert.ok(block.includes(`"${kind}"`));
  assert.match(block, /Some\("default"\)/); assert.match(block, /Ok\(frame\) => frame/); assert.match(block, /Err\(error\) => error_reply/);
});
test("Both real model menus retain native groups and refresh only authenticated metadata on open", async () => {
  const { pathToFileURL } = require("node:url");
  const helper = await import(pathToFileURL(path.join(ROOT, "src/frontend/bundle/assets/gamecowork-official-models.js")).href);
  const calls = [], notifications = []; let settle;
  const messenger = { request(kind) { calls.push(kind); return new Promise(resolve => { settle = resolve; }); } };
  const originalGroups = [{ key: "standard-models", title: "内置模型", items: [] }];
  assert.equal(helper.officialProgrammingMenu(originalGroups, messenger), originalGroups);
  assert.equal(calls.length, 0);
  const first = helper.refreshOfficialProgrammingMenu(messenger, text => notifications.push(text)), second = helper.refreshOfficialProgrammingMenu(messenger, text => notifications.push(text));
  await new Promise(resolve => setImmediate(resolve)); assert.deepEqual(calls, ["codelyOfficial/refreshMenu"]);
  settle({ status: "success", content: { ready: true, source: "original-config-v3", modelCount: 6 } }); await first; await second;
  assert.equal(notifications.length, 0);
  for (const file of ["index-BRxZ4eG7.js", "index-DvRYaIVa.js"]) {
    const source = fs.readFileSync(path.join(ROOT, "src/frontend/bundle/assets", file), "utf8");
    assert.match(source, /import \{ refreshOfficialProgrammingMenu \} from "\.\/gamecowork-official-models\.js"/);
    assert.match(source, /if \(open\) void refreshOfficialProgrammingMenu\(n, Ba\)/);
    assert.doesNotMatch(source, /officialProgrammingMenu\((?:he|Be),/);
  }
});
