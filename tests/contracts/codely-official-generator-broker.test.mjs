// Official generation capability contracts. Every transport stays in the
// owned loopback fixture, with synthetic credentials and no paid generation.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createCodelyAccountBroker, OFFICIAL_SITES } = require("../../src/core/binary/out/gamecowork-codely-account.js");
const key = crypto.randomBytes(32);
const vault = {
  seal: async bytes => {
    const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const body = Buffer.concat([cipher.update(bytes), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), body]);
  },
  unseal: async bytes => {
    const cipher = crypto.createDecipheriv("aes-256-gcm", key, bytes.subarray(0, 12));
    cipher.setAuthTag(bytes.subarray(12, 28));
    return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]);
  },
};
const image = () => ({ bytes: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), mime: "image/png", filename: "owned-reference.png" });
const sha = value => crypto.createHash("sha256").update(value).digest("hex");

async function until(predicate, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  assert.fail("Owned fixture request did not arrive");
}

async function fixture(t, options = {}) {
  const root = fs.mkdtempSync("F:/AI/AgentMake/temp/GameCowork/official-generator-broker-");
  const calls = [], warnings = [], events = [];
  const state = { user: "A", rotation: 0, currentTeam: "lite-A", overrides: new Map() };
  const accessToken = () => options.accountTypeClaim
    ? `fixture.${Buffer.from(JSON.stringify({ account_type: "personal", user: state.user, rotation: state.rotation })).toString("base64url")}.signature`
    : `main-${state.user}-${state.rotation}`;
  let origin, broker;
  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, origin), chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const call = { path: url.pathname, query: url.searchParams, method: request.method, headers: request.headers, body: Buffer.concat(chunks) };
    calls.push(call);
    const override = state.overrides.get(call.path);
    if (override) return override(call, response);
    let payload;
    if (call.path === "/auth/device/initiate") payload = { auth_request_token: "request-" + state.user, user_code: "TEST-CODE", verification_uri: origin + "/auth/device", verification_uri_complete: origin + "/auth/device?user_code=TEST-CODE", expires_in: 600, interval: 1 };
    else if (call.path === "/auth/device/poll") payload = { status: "authorized", authorization_code: "code-" + state.user };
    else if (call.path === "/auth/device/exchange") payload = { access_token: accessToken(), refresh_token: "refresh-" + state.user, expires_in: 3600 };
    else if (call.path === "/auth/external/me") payload = { id: state.user, username: "owned-" + state.user };
    else if (call.path === "/auth/refresh") { ++state.rotation; payload = { access_token: accessToken(), refresh_token: "refresh-" + state.user, expires_in: 3600 }; }
    else if (call.path === "/api/teams") payload = { teams: [{ team_id: "lite-A", team_name: "owned-A" }, { team_id: "lite-B", team_name: "owned-B" }], current_team_id: state.currentTeam };
    else if (call.path === "/api/orgs") payload = { orgs: [{ org_id: "org-A", litellm_team_id: "lite-A", is_current: state.currentTeam === "lite-A" }, { org_id: "org-B", litellm_team_id: "lite-B", is_current: state.currentTeam === "lite-B" }], current_org_id: state.currentTeam === "lite-A" ? "org-A" : "org-B" };
    else if (call.path === "/api/teams/switch") { state.currentTeam = JSON.parse(call.body).team_id; payload = { success: true, current_team_id: state.currentTeam }; }
    else if (call.path === "/api/api-token/cli-api-key") payload = { cli_api_key: "synthetic-cli-" + call.query.get("teamId"), user_id: "owned-user", rpm: 20, tpm: 10000, refresh_token: "never-publish" };
    else if (call.path === "/api/editor/sso/bootstrap") {
      response.setHeader("Set-Cookie", ["gen_sid=owned-session; Path=/; HttpOnly", "_csrf=owned-csrf; Path=/"]);
      payload = { id: state.user, username: "owned-" + state.user };
    } else if (call.path === "/api/user/me") payload = { id: state.user, username: "owned-" + state.user };
    else if (call.path === "/api/credit/cost-preview") payload = { data: { credits: 8 }, fixtureMarker: "original-envelope" };
    else if (call.path === "/api/sso/generate") payload = { data: { taskId: "owned-task" }, fixtureMarker: "original-envelope" };
    else if (call.path === "/api/task/owned-task/status") payload = { data: { status: "completed", output: { data: { image_urls: [origin + "/media/owned.png"] } } } };
    else if (call.path === "/api/sso/upload/image") payload = { data: { url: origin + "/uploaded/owned.png" }, fixtureMarker: "original-envelope" };
    else return response.writeHead(404).end(JSON.stringify({ detail: "missing owned fixture route" }));
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(payload));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  origin = "http://127.0.0.1:" + server.address().port;
  const config = {
    root, vault, baseUrl: origin, autoDrive: false, requestTimeoutMs: options.timeoutMs || 1000,
    fetch: async (url, init) => {
      assert.equal(new URL(url).origin, origin, "no request can leave the owned loopback fixture");
      if (options.beforeFetch) await options.beforeFetch(new URL(url), init);
      return fetch(url, init);
    }, logger: { warn: line => warnings.push(line), error: line => warnings.push(line) },
    emitter: (kind, data) => events.push({ kind, data }),
  };
  broker = await createCodelyAccountBroker(config);
  t.after(async () => {
    broker.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  });
  const login = async (user = "A") => {
    state.user = user;
    await broker.start();
    assert.equal((await broker.poll()).status, "completed");
  };
  if (options.login !== false) await login();
  return { broker, root, origin, calls, warnings, events, state, config, login, count: route => calls.filter(call => call.path === route).length };
}

test("generation binding is opaque, stable across refresh and restart, and changes with the verified main account", async t => {
  const f = await fixture(t, { login: false });
  assert.equal(f.broker.generationBinding(), null);
  assert.equal(f.broker.generatorOrigin(), f.origin);
  await f.login();
  const binding = f.broker.generationBinding();
  assert.equal(binding, sha("A"));
  assert.equal((await f.broker.refresh({ force: true })).status, "refreshed");
  assert.equal(f.broker.generationBinding(), binding);
  const restored = await createCodelyAccountBroker(f.config);
  assert.equal((await restored.restoreFromStorage()).status, "restored");
  assert.equal(restored.generationBinding(), binding);
  restored.close();
  await f.broker.logout();
  assert.equal(f.broker.generationBinding(), null);
  await f.login("B");
  assert.equal(f.broker.generationBinding(), sha("B"));
  assert.ok(!JSON.stringify(f.broker.status()).includes("main-B"));
  assert.ok(!fs.readFileSync(path.join(f.root, "session.enc")).includes(Buffer.from("main-B")));
});

test("production generator origin is fixed without sending a production request", async () => {
  const broker = await createCodelyAccountBroker({
    root: fs.mkdtempSync("F:/AI/AgentMake/temp/GameCowork/official-generator-origin-"), vault, autoDrive: false,
    fetch: async () => assert.fail("the production-origin check must perform no network request"),
  });
  assert.equal(broker.generatorOrigin(), OFFICIAL_SITES.generator);
  broker.close();
});

test("Frontier quotes use the exact original GET fields and private cookie, CSRF and Bearer session", async t => {
  const f = await fixture(t);
  for (const taskType of ["fal_frontier_flare", "fal_frontier_sunburst"]) {
    const payload = await f.broker.generatorCostPreview({ taskType, resolution: "1k", quality: "medium" });
    assert.deepEqual(payload, { data: { credits: 8 }, fixtureMarker: "original-envelope" });
    const call = f.calls.at(-1);
    assert.equal(call.path, "/api/credit/cost-preview");
    assert.deepEqual(Object.fromEntries(call.query), { taskType, resolution: "1k", quality: "medium" });
    assert.equal(call.method, "GET");
    assert.equal(call.headers.authorization, "Bearer main-A-0");
    assert.equal(call.headers["x-csrf-token"], "owned-csrf");
    assert.equal(call.headers.cookie, "gen_sid=owned-session; _csrf=owned-csrf");
    assert.equal(call.headers.ismobile, "false");
    assert.equal(call.headers.origin, f.origin);
    assert.equal(call.headers.referer, f.origin + "/");
  }
  assert.equal(f.count("/api/editor/sso/bootstrap"), 1);
});

test("quote, model, task and upload validation reject unsupported capabilities before network dispatch", async t => {
  const f = await fixture(t), before = f.calls.length;
  for (const query of [{}, { taskType: "unimplemented-hidden-task" }, { taskType: "fal_frontier_flare", url: "https://outside.invalid" }, { taskType: "fal_frontier_flare", quality: [] }]) {
    assert.throws(() => f.broker.generatorCostPreview(query), error => error.code === "policy");
  }
  for (const [kind, payload] of [["cpa-gpt-image-2", {}], ["frontier_flare", []], ["frontier_sunburst", null]]) {
    assert.throws(() => f.broker.generatorGenerate(kind, payload), error => error.code === "policy");
  }
  assert.throws(() => f.broker.generatorGenerate("frontier_flare", { prompt: "x".repeat(1024 * 1024) }), /too large/);
  for (const id of ["../auth/refresh", "https://outside.invalid", "owned-task?leak=1", "a/b", "", null]) {
    assert.throws(() => f.broker.generatorTaskStatus(id), error => error.code === "policy");
  }
  for (const data of [{ ...image(), filename: "../owned.png" }, { ...image(), mime: "video/mp4" }, { ...image(), bytes: "secret" }, { ...image(), bytes: Buffer.alloc(0) }]) {
    assert.throws(() => f.broker.generatorUploadImage(data), error => error.code === "policy");
  }
  assert.equal(f.calls.length, before);
});

test("both Frontier models send the original generation envelope and return the actual receipt unchanged", async t => {
  const f = await fixture(t);
  for (const kind of ["frontier_flare", "frontier_sunburst"]) {
    const data = { prompt: "owned fixture prompt", resolution: "1k", images: [], quality: "medium" };
    assert.deepEqual(await f.broker.generatorGenerate(kind, data), { data: { taskId: "owned-task" }, fixtureMarker: "original-envelope" });
    const call = f.calls.at(-1);
    assert.equal(call.path, "/api/sso/generate");
    assert.equal(call.method, "POST");
    assert.deepEqual(JSON.parse(call.body), { kind, data });
    assert.equal(call.headers.source, "codely");
    assert.equal(call.headers.frommethod, "web");
    assert.equal(call.headers["x-csrf-token"], "owned-csrf");
  }
});

test("image references use the audited image multipart field with original MIME, filename and bytes", async t => {
  const f = await fixture(t), data = image();
  assert.deepEqual(await f.broker.generatorUploadImage(data), { data: { url: f.origin + "/uploaded/owned.png" }, fixtureMarker: "original-envelope" });
  const call = f.calls.at(-1), body = call.body.toString("latin1");
  assert.equal(call.path, "/api/sso/upload/image");
  assert.equal(call.method, "POST");
  assert.match(call.headers["content-type"], /^multipart\/form-data; boundary=/);
  assert.match(body, /name="image"; filename="owned-reference.png"/);
  assert.match(body, /Content-Type: image\/png/);
  assert.ok(call.body.includes(data.bytes));
  assert.equal(call.headers.authorization, "Bearer main-A-0");
});

test("polling a remote task returns original wrapped status without another generation", async t => {
  const f = await fixture(t);
  const receipt = await f.broker.generatorGenerate("frontier_flare", { prompt: "owned" });
  const before = f.count("/api/sso/generate");
  const status = await f.broker.generatorTaskStatus(receipt.data.taskId);
  assert.equal(status.data.status, "completed");
  assert.deepEqual(status.data.output.data.image_urls, [f.origin + "/media/owned.png"]);
  assert.equal(f.count("/api/sso/generate"), before);
});

for (const status of [401, 403]) {
  test(`a ${status} GET rebuilds the site jar once and retains the original quote result`, async t => {
    const f = await fixture(t);
    let attempts = 0;
    f.state.overrides.set("/api/credit/cost-preview", (call, response) => response.writeHead(++attempts === 1 ? status : 200).end(JSON.stringify({ credits: 8 })));
    assert.deepEqual(await f.broker.generatorCostPreview({ taskType: "fal_frontier_flare" }), { credits: 8 });
    assert.equal(attempts, 2);
    assert.equal(f.count("/api/editor/sso/bootstrap"), 2);
  });
  test(`a repeated ${status} GET stops after the one allowed site rebuild`, async t => {
    const f = await fixture(t);
    f.state.overrides.set("/api/task/owned-task/status", (call, response) => response.writeHead(status).end(JSON.stringify({ detail: "synthetic-secret" })));
    await assert.rejects(f.broker.generatorTaskStatus("owned-task"), error => error.code === "server" && error.httpStatus === status && !error.submissionUnknown);
    assert.equal(f.count("/api/task/owned-task/status"), 2);
  });
  for (const operation of ["generation", "upload"]) {
    test(`a ${status} ${operation} POST is sent once and marks an unknown submission without exposing its error body`, async t => {
      const f = await fixture(t), route = operation === "generation" ? "/api/sso/generate" : "/api/sso/upload/image";
      f.state.overrides.set(route, (call, response) => response.writeHead(status).end(JSON.stringify({ access_token: "synthetic-secret" })));
      const pending = operation === "generation" ? f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }) : f.broker.generatorUploadImage(image());
      await assert.rejects(pending, error => error.code === "server" && error.httpStatus === status && error.submissionUnknown === true && !error.message.includes("synthetic-secret"));
      assert.equal(f.count(route), 1);
      assert.equal(f.count("/api/editor/sso/bootstrap"), 1);
      assert.deepEqual(f.warnings, []);
    });
  }
}

for (const route of ["/api/credit/cost-preview", "/api/sso/generate", "/api/task/owned-task/status", "/api/sso/upload/image"]) {
  test(`${route} timeout bounds an incomplete response body and never replays POST`, async t => {
    const f = await fixture(t, { timeoutMs: 100 });
    f.state.overrides.set(route, (call, response) => { response.writeHead(200, { "Content-Type": "application/json" }); response.write('{"data":'); });
    const post = route.includes("/sso/");
    const request = route.includes("cost-preview") ? f.broker.generatorCostPreview({ taskType: "fal_frontier_flare" })
      : route.includes("generate") ? f.broker.generatorGenerate("frontier_flare", { prompt: "owned" })
      : route.includes("status") ? f.broker.generatorTaskStatus("owned-task") : f.broker.generatorUploadImage(image());
    await assert.rejects(request, error => error.code === "timeout" && Boolean(error.submissionUnknown) === post);
    assert.equal(f.count(route), 1);
  });
}

test("a pre-cancelled operation never bootstraps or submits", async t => {
  const f = await fixture(t), before = f.calls.length, controller = new AbortController();
  controller.abort(new Error("synthetic-secret"));
  await assert.rejects(f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }, controller.signal), error => error.code === "cancelled" && !error.submissionUnknown && !error.message.includes("synthetic-secret"));
  assert.equal(f.calls.length, before);
});

test("cancellation during bootstrap prevents generation submission", async t => {
  const f = await fixture(t), controller = new AbortController();
  f.state.overrides.set("/api/editor/sso/bootstrap", (call, response) => { response.writeHead(200); response.write("{"); });
  const rejected = assert.rejects(f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }, controller.signal), error => error.code === "cancelled" && !error.submissionUnknown);
  await until(() => f.count("/api/editor/sso/bootstrap") === 1);
  controller.abort();
  await rejected;
  assert.equal(f.count("/api/sso/generate"), 0);
});

test("cancellation after POST dispatch preserves its unknown outcome and never resubmits", async t => {
  const f = await fixture(t), controller = new AbortController();
  f.state.overrides.set("/api/sso/generate", (call, response) => { response.writeHead(200); response.write("{"); });
  const rejected = assert.rejects(f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }, controller.signal), error => error.code === "cancelled" && error.submissionUnknown === true);
  await until(() => f.count("/api/sso/generate") === 1);
  controller.abort();
  await rejected;
  assert.equal(f.count("/api/sso/generate"), 1);
});

test("logout and a replacement login reject an old generation receipt", async t => {
  const f = await fixture(t);
  let held;
  f.state.overrides.set("/api/sso/generate", (call, response) => { held = response; });
  const rejected = assert.rejects(f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }), error => error.code === "cancelled" && error.submissionUnknown === true);
  await until(() => held);
  await f.broker.logout();
  await f.login("B");
  held.writeHead(200).end(JSON.stringify({ taskId: "old-account-task" }));
  await rejected;
  assert.equal(f.broker.generationBinding(), sha("B"));
  assert.equal(f.count("/api/sso/generate"), 1);
});

test("token rotation rejects a late receipt even when the main account binding is unchanged", async t => {
  const f = await fixture(t);
  let held;
  f.state.overrides.set("/api/sso/generate", (call, response) => { held = response; });
  const rejected = assert.rejects(f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }), error => error.code === "cancelled" && error.submissionUnknown === true);
  await until(() => held);
  assert.equal((await f.broker.refresh({ force: true })).status, "refreshed");
  held.writeHead(200).end(JSON.stringify({ taskId: "old-token-task" }));
  await rejected;
  assert.equal(f.broker.generationBinding(), sha("A"));
  assert.equal(f.count("/api/sso/generate"), 1);
});

test("network error diagnostics remain private when a POST outcome is unknown", async t => {
  const f = await fixture(t, { beforeFetch: async url => { if (url.pathname === "/api/sso/generate") throw new Error("synthetic-secret main-A-0 owned-csrf"); } });
  await assert.rejects(f.broker.generatorGenerate("frontier_sunburst", { prompt: "owned" }), error => error.code === "server" && error.submissionUnknown === true && !/synthetic-secret|main-A-0|owned-csrf/.test(error.message));
  assert.deepEqual(f.warnings, []);
  assert.equal(f.count("/api/sso/generate"), 0, "the injected failure happened before the fixture server accepted bytes");
});

function expandedDiagnostic(value,depth=0) {
  assert.ok(depth<40,'Synthetic diagnostic stays bounded');
  if(typeof value==='string'){try{const decoded=JSON.parse(value);if(decoded!==value)return expandedDiagnostic(decoded,depth+1);}catch{}return value;}
  if(Array.isArray(value))return value.map(item=>expandedDiagnostic(item,depth+1));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,expandedDiagnostic(item,depth+1)]));return value;
}
const unicodeDiagnostic=value=>JSON.stringify(value).replace(/[A-Za-z0-9_-]/g,ch=>'\\u'+ch.charCodeAt(0).toString(16).padStart(4,'0'));
for(const route of ['/api/sso/generate','/api/task/owned-task/status'])test(`successful HTTP task diagnostics redact private values and nested Unicode JSON at ${route}`,async t=>{
  const f=await fixture(t),secrets=['main-A-0','refresh-A','owned-csrf','owned-session'];
  const nested=unicodeDiagnostic({reason:'合法的原始错误：额度不足',credentialEcho:secrets.join(' ')});
  f.state.overrides.set(route,(_call,response)=>response.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({data:{id:'owned-task',status:'failed',error:{message:JSON.stringify({reason:'模型暂时繁忙，请稍后重试',direct:secrets[0],nested:JSON.stringify({details:nested})})},output:{data:{description:secrets[2],cookie:secrets[3]}}}})));
  const reply=route.includes('generate')?await f.broker.generatorGenerate('frontier_flare',{prompt:'Owned diagnostics'}):await f.broker.generatorTaskStatus('owned-task');
  const exposed=JSON.stringify(expandedDiagnostic(reply));for(const secret of secrets)assert.equal(exposed.includes(secret),false,'Private values stay redacted even after consumer JSON decoding');
  assert.match(exposed,/模型暂时繁忙/);assert.match(exposed,/合法的原始错误/);assert.match(exposed,/\[redacted\]/);
  for(const secret of secrets)assert.equal(JSON.stringify([...f.warnings,...f.events,f.broker.status()]).includes(secret),false);
});

test("an invalid JSON generation receipt keeps the outcome unknown and never repeats submission", async t => {
  const f = await fixture(t);
  f.state.overrides.set("/api/sso/generate", (call, response) => response.writeHead(200).end("synthetic-secret invalid-json"));
  await assert.rejects(f.broker.generatorGenerate("frontier_flare", { prompt: "owned" }), error => error.code === "server" && error.submissionUnknown === true && !error.message.includes("synthetic-secret"));
  assert.equal(f.count("/api/sso/generate"), 1);
});

test("external cancellation while a shared token refresh is pending settles before its deadline and sends no generation", async t => {
  const f = await fixture(t), restored = await createCodelyAccountBroker(f.config), controller = new AbortController();
  let held;
  assert.equal((await restored.restoreFromStorage()).status, "restored");
  f.state.overrides.set("/auth/refresh", (call, response) => { held = response; });
  const rejected = assert.rejects(restored.generatorGenerate("frontier_flare", { prompt: "owned" }, controller.signal), error => error.code === "cancelled" && !error.submissionUnknown);
  await until(() => held);
  controller.abort();
  await rejected;
  assert.equal(f.count("/api/sso/generate"), 0);
  restored.close();
});

test("login, subscription reads and inference binding obtain no CLI key until explicit credential enable", async t => {
  const f = await fixture(t, { login: false });
  assert.equal(await f.broker.inferenceBinding(), null);
  await f.login();
  await f.broker.listTeamsRaw();
  await f.broker.generatorUser();
  assert.equal(f.count("/api/api-token/cli-api-key"), 0);
  const binding = await f.broker.inferenceBinding();
  assert.deepEqual(Object.keys(binding).sort(), ["accountId", "generationKey", "teamId"]);
  assert.equal(binding.accountId, sha("A"));
  assert.equal(binding.teamId, "lite-A");
  assert.equal(f.broker.isInferenceBindingCurrent(binding), true);
  assert.equal(f.count("/api/api-token/cli-api-key"), 0);
  const credential = await f.broker.getCliInferenceCredential({ binding });
  assert.deepEqual(credential, { cliApiKey: "synthetic-cli-lite-A", userId: "owned-user", rpm: 20, tpm: 10000 });
  const call = f.calls.at(-1);
  assert.equal(call.path, "/api/api-token/cli-api-key");
  assert.deepEqual(Object.fromEntries(call.query), { teamId: "lite-A" });
  assert.equal(call.headers.authorization, "Bearer main-A-0");
  assert.ok(!JSON.stringify(f.broker.status()).includes(credential.cliApiKey));
  const record = JSON.parse((await vault.unseal(fs.readFileSync(path.join(f.root, "session.enc")))).toString());
  assert.ok(!JSON.stringify(record).includes(credential.cliApiKey));
  assert.deepEqual(f.warnings, []);
});

test("account_type JWT selects true orgs and maps the verified org selection to its LiteLLM team", async t => {
  const f = await fixture(t, { accountTypeClaim: true });
  const binding = await f.broker.inferenceBinding();
  assert.equal(binding.teamId, "lite-A");
  assert.equal(f.count("/api/orgs"), 1);
  assert.equal(f.count("/api/teams"), 0);
  const selected = await f.broker.inferenceBinding({ selectedOrgId: "org-B" });
  assert.equal(selected.teamId, "lite-B");
  assert.equal(f.broker.isInferenceBindingCurrent(binding), false);
  assert.equal(f.broker.isInferenceBindingCurrent(selected, "org-B"), true);
  assert.equal((await f.broker.getCliInferenceCredential({ binding: selected })).cliApiKey, "synthetic-cli-lite-B");
  assert.equal(f.calls.at(-1).query.get("teamId"), "lite-B", "an org id is never substituted for its actual LiteLLM id");
});

test("no current organization, unknown selection and missing LiteLLM ids never guess the first team or fetch a key", async t => {
  const f = await fixture(t);
  f.state.overrides.set("/api/teams", (call, response) => response.writeHead(200).end(JSON.stringify({ teams: [{ team_id: "first-listed" }, { team_id: "second-listed" }] })));
  await assert.rejects(f.broker.inferenceBinding(), error => error.code === "unknown-org");
  await assert.rejects(f.broker.inferenceBinding({ selectedOrgId: "not-a-member" }), error => error.code === "unknown-org");
  assert.equal(f.count("/api/api-token/cli-api-key"), 0);
  const jwt = await fixture(t, { accountTypeClaim: true });
  jwt.state.overrides.set("/api/orgs", (call, response) => response.writeHead(200).end(JSON.stringify({ orgs: [{ org_id: "not-a-litellm-id", is_current: true }], current_org_id: "not-a-litellm-id" })));
  await assert.rejects(jwt.broker.inferenceBinding(), error => error.code === "unknown-org");
  assert.equal(jwt.count("/api/api-token/cli-api-key"), 0);
});

test("account and team changes invalidate key scope while a same-account token refresh preserves the independent key", async t => {
  const f = await fixture(t), invalidations = [];
  const unsubscribe = f.broker.onInferenceInvalidated(() => invalidations.push(true));
  const binding = await f.broker.inferenceBinding();
  await f.broker.getCliInferenceCredential({ binding });
  await f.broker.switchTeamRaw("lite-B");
  assert.equal(f.broker.isInferenceBindingCurrent(binding), false);
  assert.ok(invalidations.length >= 1);
  await assert.rejects(f.broker.getCliInferenceCredential({ binding }), error => error.code === "cancelled");
  assert.equal(f.count("/api/api-token/cli-api-key"), 1);
  const team = await f.broker.inferenceBinding();
  assert.equal(team.teamId, "lite-B");
  assert.notEqual(team.generationKey, binding.generationKey);
  const beforeRefresh = invalidations.length;
  await f.broker.refresh({ force: true });
  assert.equal(f.broker.isInferenceBindingCurrent(team), true);
  assert.equal(invalidations.length, beforeRefresh, "successful same-account refresh must not destroy an active independent CLI-key stream");
  assert.equal(f.count("/api/api-token/cli-api-key"), 1);
  const rotated = await f.broker.inferenceBinding();
  assert.equal(rotated.generationKey, team.generationKey);
  await f.broker.logout();
  assert.equal(f.broker.isInferenceBindingCurrent(rotated), false);
  await f.login("B");
  const replacement = await f.broker.inferenceBinding();
  assert.notEqual(replacement.accountId, rotated.accountId);
  assert.equal(f.count("/api/api-token/cli-api-key"), 1);
  unsubscribe();
  const before = invalidations.length;
  await f.broker.logout();
  assert.equal(invalidations.length, before);
});

test("a team switch aborts a pending CLI-key response and no old key can be published", async t => {
  const f = await fixture(t), binding = await f.broker.inferenceBinding();
  let held;
  f.state.overrides.set("/api/api-token/cli-api-key", (call, response) => { held = response; response.writeHead(200); response.write("{"); });
  const rejected = assert.rejects(f.broker.getCliInferenceCredential({ binding }), error => error.code === "cancelled");
  await until(() => held);
  await f.broker.switchTeamRaw("lite-B");
  await rejected;
  held.end(JSON.stringify({ cli_api_key: "synthetic-secret" }).slice(1));
  assert.equal(f.count("/api/api-token/cli-api-key"), 1);
  assert.equal(f.broker.isInferenceBindingCurrent(binding), false);
});

test("CLI-key full-body timeout and explicit cancellation do not retry or leak upstream details", async t => {
  const f = await fixture(t, { timeoutMs: 100 }), binding = await f.broker.inferenceBinding();
  f.state.overrides.set("/api/api-token/cli-api-key", (call, response) => { response.writeHead(200); response.write("{"); });
  await assert.rejects(f.broker.getCliInferenceCredential({ binding }), error => error.code === "timeout");
  assert.equal(f.count("/api/api-token/cli-api-key"), 1);
  const controller = new AbortController();
  controller.abort(new Error("synthetic-secret"));
  await assert.rejects(f.broker.getCliInferenceCredential({ binding, signal: controller.signal }), error => error.code === "cancelled" && !error.message.includes("synthetic-secret"));
  assert.equal(f.count("/api/api-token/cli-api-key"), 1);
  assert.deepEqual(f.warnings, []);
});

test("a main refresh rejection invalidates inference immediately and performs no further key fetch", async t => {
  const f = await fixture(t), binding = await f.broker.inferenceBinding();
  let notified = false;
  f.broker.onInferenceInvalidated(() => { notified = true; });
  f.state.overrides.set("/auth/refresh", (call, response) => response.writeHead(401).end(JSON.stringify({ detail: "synthetic-secret" })));
  assert.equal((await f.broker.refresh({ force: true })).status, "requires-login");
  assert.equal(notified, true);
  assert.equal(f.broker.isInferenceBindingCurrent(binding), false);
  assert.equal(f.count("/api/api-token/cli-api-key"), 0);
});

test("the private inference key capability is separate from both renderer registrations and Quick surfaces", () => {
  const source = fs.readFileSync(new URL("../../src/core/binary/out/gamecowork-codely-account.js", import.meta.url), "utf8");
  const quick = source.slice(source.indexOf("function codelyAccountOfficialSurface()"), source.indexOf("function codelyAccountInferenceSurface()"));
  assert.ok(!quick.includes("getCliInferenceCredential"));
  const registered = [...source.matchAll(/messenger\.on\("([^"]+)"/g)].map(match => match[1]);
  assert.ok(!registered.some(route => /cli.*key|inference.*credential/i.test(route)));
});

test("malformed main-account JSON has a fixed error and never publishes parser excerpts containing a secret", async t => {
  const f = await fixture(t), marker = "synthetic-token-never-display";
  f.state.overrides.set("/api/user/plan", (call, response) => response.writeHead(200, { "Content-Type": "application/json" }).end(marker));
  await assert.rejects(f.broker.getUserPlanRaw(), error => {
    assert.equal(error.code, "server");
    assert.equal(error.message, "官方服务返回无效 JSON");
    assert.ok(!String(error.stack).includes(marker));
    return true;
  });
  assert.ok(!JSON.stringify([f.broker.status(), f.events, f.warnings]).includes(marker));
});

for (const route of ["/auth/device/initiate", "/auth/device/poll", "/auth/device/exchange"]) {
  test(`${route} non-2xx failure preserves status and reason without leaking the response body into events or logs`, async t => {
    const f = await fixture(t, { login: false }), marker = "synthetic-auth-token-never-display";
    f.state.overrides.set(route, (call, response) => response.writeHead(503, { "Content-Type": "application/json" }).end(JSON.stringify({ access_token: marker, refresh_token: marker, authorization_code: marker })));
    if (route === "/auth/device/initiate") {
      await assert.rejects(f.broker.start(), error => error.code === "server" && error.message.includes("503") && !String(error.stack).includes(marker));
    } else {
      await f.broker.start();
      assert.deepEqual(await f.broker.poll(), { status: "failed", reason: "server" });
    }
    assert.equal(f.broker.status().phase, "logged-out");
    assert.ok(!JSON.stringify([f.broker.status(), f.events, f.warnings]).includes(marker));
  });
}

test("main-account plan non-2xx errors do not relay response secrets to callers", async t => {
  const f = await fixture(t), marker = "synthetic-plan-token-never-display";
  f.state.overrides.set("/api/user/plan", (call, response) => response.writeHead(503).end(marker));
  await assert.rejects(f.broker.getUserPlanRaw(), error => error.code === "server" && error.message.includes("503") && !String(error.stack).includes(marker));
  assert.ok(!JSON.stringify([f.broker.status(), f.events, f.warnings]).includes(marker));
});
