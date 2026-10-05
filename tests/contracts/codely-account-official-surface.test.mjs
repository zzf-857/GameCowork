// Official identity/quota surface contracts: the Codely broker serves the
// generator and canvas sites server-side, and the owned local adapters relay
// only whitelisted identity/credit data to the preserved clients. All HTTP is
// a loopback fixture; official tokens never appear in adapter output.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const account = require("../../src/core/binary/out/gamecowork-codely-account.js");
const generator = require("../../src/core/binary/out/gamecowork-codely-generator.js");
const { validateCanvasOfficialOverlay, validateCanvasLocalSession } = await import("../../src/frontend/bundle/codely-canvas/canvas-local-auth.js");

const FIXTURE_ORIGIN = "http://127.0.0.1:8641";
const REAL_ACCESS = `surface-access-${randomUUID()}`;
const REAL_REFRESH = `surface-refresh-${randomUUID()}`;
const REAL_ACCESS_2 = `surface-access-2-${randomUUID()}`;
const AUTH_CODE = `surface-code-${randomUUID()}`;
const REQUEST_TOKEN = `surface-request-${randomUUID()}`;
const CANVAS_TOKEN = `canvas-jwt-${randomUUID()}`;
const USER_CODE = "SRFC-TEST";

function tempRoot() {
  const root = "F:/AI/AgentMake/temp/GameCowork/codely-surface-" + randomUUID();
  fs.mkdirSync(root, { recursive: true });
  return root;
}

const vaultKey = crypto.randomBytes(32);
const vault = {
  seal: async (plain) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", vaultKey, iv);
    const body = Buffer.concat([cipher.update(plain), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), body]);
  },
  unseal: async (blob) => {
    const decipher = crypto.createDecipheriv("aes-256-gcm", vaultKey, blob.subarray(0, 12), { authTagLength: 16 });
    decipher.setAuthTag(blob.subarray(12, 28));
    return Buffer.concat([decipher.update(blob.subarray(28)), decipher.final()]);
  },
};

function fixtureResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
}

function fixtureFetch(scenario) {
  const calls = [];
  async function impl(url, init = {}) {
    const parsed = new URL(url);
    const method = init.method || "GET";
    const entry = { url: String(url), method, headers: init.headers || {}, body: init.body };
    calls.push(entry);
    const handler = scenario[parsed.pathname] ?? scenario[`${parsed.pathname}!${method}`];
    if (!handler) return fixtureResponse({ error: "fixture route missing" }, 404);
    const value = typeof handler === "function" ? await handler(entry) : handler;
    if (value && value.raw) return value.raw;
    if (value && value.__status) return fixtureResponse(value.body ?? {}, value.__status);
    return fixtureResponse(value);
  }
  impl.calls = calls;
  return impl;
}

const scenario = {
  "/auth/device/initiate!POST": { auth_request_token: REQUEST_TOKEN, user_code: USER_CODE, verification_uri: `${FIXTURE_ORIGIN}/auth/device`, verification_uri_complete: `${FIXTURE_ORIGIN}/auth/device?user_code=${USER_CODE}`, expires_in: 600, interval: 1 },
  "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
  "/auth/device/exchange!POST": { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, token_type: "Bearer", expires_in: 3600 },
  "/auth/external/me!GET": { id: 64001, username: "surface-user", email: "surface@example.invalid" },
  "/auth/refresh!POST": (call) => {
    assert.equal(call.body, JSON.stringify({ refresh_token: REAL_REFRESH }));
    return { access_token: REAL_ACCESS_2, refresh_token: REAL_REFRESH, expires_in: 3600 };
  },
  "/api/editor/sso/bootstrap!GET": (call) => {
    assert.ok(/^Bearer [a-z0-9-]+$/.test(call.headers.Authorization || ""), "bootstrap must carry the current official token");
    return { raw: fixtureResponse({ id: 64001, username: "surface-user" }, 200, { "Set-Cookie": "gen_sid=fixture-session; Path=/; HttpOnly" }) };
  },
  "/api/user/me!GET": (call) => {
    assert.ok((call.headers.Cookie || "").includes("gen_sid=fixture-session"), "site reads must reuse the bootstrap jar");
    return { id: 64001, username: "surface-user", name: "surface-user", role: "user" };
  },
  "/api/credit/my-credits!GET": { currentCredits: 4321 },
  "/api/credit/my-paid-status!GET": { paidType: "paid", productCode: "codely_pro" },
  "/api/v1/auth/exchange!POST": (call) => {
    assert.equal(call.headers.Authorization, `Bearer ${REAL_ACCESS}`);
    assert.equal(call.body, undefined);
    return { code: 0, data: { user: { id: "u-9001", username: "surface-user", role: "user", unity_id: "unity-77" }, tokens: { access_token: CANVAS_TOKEN, refresh_token: "canvas-refresh" } } };
  },
  "/api/v1/auth/profile!GET": (call) => {
    assert.equal(call.headers.Authorization, `Bearer ${CANVAS_TOKEN}`);
    return { code: 0, data: { id: "u-9001", username: "surface-user", role: "user", unity_id: "unity-77" } };
  },
  "/api/v1/auth/points!GET": (call) => {
    assert.equal(call.headers.Authorization, `Bearer ${CANVAS_TOKEN}`);
    return { code: 0, data: { points: 876, total: 1000 } };
  },
};

const clock = { ms: 1_800_000_000_000 };
const nowFn = () => clock.ms;
const advance = (seconds) => { clock.ms += seconds * 1000; };

const events = [];
const fetchImpl = fixtureFetch(scenario);
const root = tempRoot();
const listeners = new Map();
const messenger = {
  on: (kind, handler) => { listeners.set(kind, handler); return () => {}; },
  send: (kind, data) => events.push([kind, data]),
  request: async (kind, data) => (kind === "gamecoworkAccount/vaultSeal"
    ? { sealed: (await vault.seal(Buffer.from(data.data, "hex"))).toString("hex") }
    : { plain: (await vault.unseal(Buffer.from(data.data, "hex"))).toString("hex") }),
};
const core = { orgManager: { updateFromListTeams() {}, setCurrentOrgId() {}, getOrganizations() { return []; }, getCurrentOrgId() { return null; }, getCurrentOrgName() { return null; }, getMultiTeamEnabled() { return false; }, reset() {} }, pushOrgUpdate() {} };
process.env.GAMECOWORK_CODELY_ACCOUNT_DIR = root;
process.env.GAMECOWORK_CODELY_ACCOUNT_BASE_URL = FIXTURE_ORIGIN;
account.registerCoreWiring({
  messenger, core, logger: { warn() {}, error() {} },
  overrides: { now: nowFn, requestTimeoutMs: 5000, baseUrl: FIXTURE_ORIGIN, autoDrive: false, setTimeoutFn: () => 0, clearTimeoutFn: () => {}, fetch: fetchImpl, emitter: (kind, data) => events.push([kind, data]) },
});

const sessionHandler = listeners.get("getControlPlaneSessionInfo");
const statusHandler = listeners.get("codelyAccount/status");
const pollHandler = listeners.get("codelyAccount/poll");
const logoutHandler = listeners.get("logoutOfControlPlane");

const assetRoot = path.resolve("F:/AI/AgentMake/temp/GameCowork/codely-surface-asset-" + randomUUID());
fs.mkdirSync(assetRoot, { recursive: true });
const assetService = {
  root: assetRoot,
  getOwnedSnapshot: () => ({ tasks: [], inputs: [] }),
  assertRuntime() {},
  dispatch: async () => ({ providers: [] }),
  getInputPath() { throw new Error("not used"); },
};
const adapter = generator.createCodelyGeneratorApi({ assetService });
const dispatch = (method, route, extra = {}) => adapter.dispatch({ method, path: route, origin: FIXTURE_ORIGIN, query: {}, body: {}, workspaceKey: "default", ...extra });

const SECRET_MARKERS = [REAL_ACCESS, REAL_REFRESH, REAL_ACCESS_2, AUTH_CODE, REQUEST_TOKEN, CANVAS_TOKEN];
function assertNoSecrets(value, label) {
  const text = JSON.stringify(value ?? null);
  for (const marker of SECRET_MARKERS) assert.ok(!text.includes(marker), `${label} leaked a secret`);
}

test("Before login the Quick adapter keeps the honest local-only surfaces", async () => {
  const session = await dispatch("GET", "/local-session");
  assert.equal(session.status, 200);
  assert.equal(session.body.mode, "gamecowork-local");
  assert.equal(session.body.user.accountMode, "local");
  const credits = await dispatch("GET", "/credit/my-credits");
  assert.equal(credits.status, 503);
  assert.equal(credits.body.accountMode, "local");
  assert.equal((await dispatch("GET", "/credit/cost-preview")).status, 503);
});

test("Login via the wiring, then the Quick adapter serves the real official identity and quota state", async () => {
  await sessionHandler({ data: { silent: false } });
  assert.equal((await pollHandler()).status, "completed");
  assert.equal((await statusHandler()).phase, "authenticated");

  const session = await dispatch("GET", "/local-session");
  assert.equal(session.status, 200);
  assert.equal(session.body.mode, "codely-official");
  assert.equal(session.body.user.id, "64001");
  assert.equal(session.body.user.name, "surface-user");
  assert.equal(session.body.user.accountMode, "codely-official");
  assert.equal(session.body.capabilities.officialIdentity, true);
  assert.equal(session.body.capabilities.localHistory, true);
  assertNoSecrets(session, "official local-session");

  const me = await dispatch("GET", "/user/me");
  assert.equal(me.body.id, "64001");
  assert.equal(me.body.username, "surface-user");
  assertNoSecrets(me, "user/me");

  const credits = await dispatch("GET", "/credit/my-credits");
  assert.equal(credits.status, 200);
  assert.equal(credits.body.currentCredits, 4321);
  assert.equal(credits.body.accountMode, "codely-official");

  const paid = await dispatch("GET", "/credit/my-paid-status");
  assert.equal(paid.body.paidType, "paid");
  assert.equal(paid.body.productCode, "codely_pro");

  const bootstrapCalls = fetchImpl.calls.filter((c) => c.url.includes("/api/editor/sso/bootstrap"));
  assert.equal(bootstrapCalls.length, 1, "the generator jar bootstraps once");
  assertNoSecrets(credits, "credits body");
});

test("Canvas snapshot serves the real exchanged identity and points without any Canvas token", async () => {
  const snapshot = await listeners.get("codelyAccount/canvasSnapshot")();
  assert.equal(snapshot.mode, "codely-official");
  assert.equal(snapshot.user.username, "surface-user");
  assert.equal(snapshot.user.role, "user");
  assert.equal(snapshot.user.unityId, "unity-77");
  assert.deepEqual(snapshot.points, { points: 876, total: 1000 });
  assertNoSecrets(snapshot, "canvas snapshot");
  const exchangeCalls = fetchImpl.calls.filter((c) => c.url.includes("/api/v1/auth/exchange"));
  assert.equal(exchangeCalls.length, 1);
});

test("Token rotation rebuilds the site jars; adapter surfaces follow the new token", async () => {
  advance(3600 * 3);
  const refresh = await listeners.get("codelyAccount/refresh")({ data: { force: true } });
  assert.equal(refresh.status, "refreshed");
  const session = await dispatch("GET", "/local-session");
  assert.equal(session.body.user.id, "64001");
  const bootstrapCalls = fetchImpl.calls.filter((c) => c.url.includes("/api/editor/sso/bootstrap"));
  assert.equal(bootstrapCalls.length, 2, "rotation invalidates the jar and re-bootstraps");
  assert.equal(bootstrapCalls[1].headers.Authorization, `Bearer ${REAL_ACCESS_2}`);
  assert.equal((await dispatch("GET", "/credit/my-credits")).body.currentCredits, 4321);
});

test("Logout returns every surface to the honest local mode and no secret ever reaches adapter output", async () => {
  const logout = await logoutHandler();
  assert.equal(logout.status, "logged-out");
  const session = await dispatch("GET", "/local-session");
  assert.equal(session.body.mode, "gamecowork-local");
  assert.equal((await dispatch("GET", "/credit/my-credits")).status, 503);
  assertNoSecrets(fetchImpl.calls.map((c) => `${c.method} ${c.url.split("?")[0]}`), "fixture call log");
  assert.ok(!JSON.stringify(fetchImpl.calls.filter((c) => !c.url.includes("/auth/device/exchange"))).includes(AUTH_CODE), "the one-time code appears only in its own exchange request");
});

test("Canvas adapter consumes the official overlay without leaking tokens into the auth value", () => {
  const base = validateCanvasLocalSession({ mode: "local", user: { id: "gamecowork-local", username: "GameCowork 本地用户", role: "local" }, session: { id: "0b1e5f7a-11c2-42c3-8de4-5f6a7b8c9d0e", scope: "gamecowork-canvas-local" } });
  const overlay = validateCanvasOfficialOverlay({ mode: "codely-official", user: { id: "u-9001", username: "surface-user", role: "user", unityId: "unity-77" }, points: { points: 876 } });
  assert.equal(overlay.user.username, "surface-user");
  assert.equal(overlay.points.points, 876);
  for (const bad of [
    { mode: "codely-official", user: { id: "u", username: "n", role: "admin", access_token: CANVAS_TOKEN }, points: {} },
    { mode: "codely-official", user: { id: "u", username: "n", role: "paid" }, tokens: { access_token: CANVAS_TOKEN } },
    { mode: "codely-official", user: { id: "u", username: "", role: "user" } },
    { mode: "codely-official", user: { id: "u", username: "n", role: "x".repeat(64) } },
  ]) assert.throws(() => validateCanvasOfficialOverlay(bad), /官方账号身份/);
  assert.ok(!JSON.stringify(base).includes("official"));
});

function barrier() {
  let release, entered;
  const wait = new Promise(resolve => { release = resolve; });
  const reached = new Promise(resolve => { entered = resolve; });
  return { reached, release, hold: async () => { entered(); await wait; } };
}

// Independent broker instances exercise interleavings, rather than relying on
// the sequential singleton fixture above. All credentials here are invented.
async function raceFixture(hook = async () => {}, customVault = vault, autoLogin = true) {
  let identity = "A", revision = 0;
  // Identity markers remain A/B, while cookies are distinct synthetic secrets.
  // A one-character cookie used as the same identity marker would correctly
  // redact that marker when successful generator responses are sanitized.
  const siteCookie = id => `surface-race-generator-cookie-${id}`;
  const cookieIdentity = header => ["A", "B"].find(id => String(header || "").split(";").some(pair => pair.trim() === `gen_sid=${siteCookie(id)}`));
  const calls = [];
  const fetch = async (url, init = {}) => {
    const route = new URL(url).pathname;
    const call = { route, headers: init.headers || {}, redirect: init.redirect };
    calls.push(call);
    const override = await hook(call);
    if (override instanceof Response) return override;
    if (route === "/auth/device/initiate") return fixtureResponse(scenario["/auth/device/initiate!POST"]);
    if (route === "/auth/device/poll") return fixtureResponse({ status: "authorized", authorization_code: "fixture-code" });
    if (route === "/auth/device/exchange") return fixtureResponse({ access_token: `main-${identity}-${revision}`, refresh_token: "fixture-refresh", expires_in: 3600 });
    if (route === "/auth/external/me") return fixtureResponse({ id: identity, username: identity });
    if (route === "/auth/refresh") return fixtureResponse({ access_token: `main-${identity}-${++revision}`, refresh_token: "fixture-refresh", expires_in: 3600 });
    if (route === "/api/user/plan") return fixtureResponse({ plan_type: "fixture", is_active: true });
    const source = /main-([AB])-/.exec(call.headers.Authorization || "")?.[1];
    if (route === "/api/editor/sso/bootstrap") { assert.ok(["A", "B"].includes(source), "bootstrap carries an actual fixture account token"); return fixtureResponse({ id: source }, 200, { "Set-Cookie": `gen_sid=${siteCookie(source)}; Path=/; HttpOnly` }); }
    if (route === "/api/user/me") { const id = cookieIdentity(call.headers.Cookie); assert.equal(id, source, "identity read must use the same account cookie and Bearer authority"); return fixtureResponse({ id, username: id }); }
    if (route === "/api/credit/my-credits") { const id = cookieIdentity(call.headers.Cookie); assert.equal(id, source, "credits read must use the same account cookie and Bearer authority"); return fixtureResponse({ currentCredits: id === "A" ? 100 : 200 }); }
    if (route === "/api/credit/my-paid-status") return fixtureResponse({ paidType: "paid", productCode: "fixture" });
    if (route === "/api/v1/auth/exchange") return fixtureResponse({ code: 0, data: { tokens: { access_token: `canvas-${source}` } } });
    if (route === "/api/v1/auth/profile") { const id = call.headers.Authorization.slice(-1); return fixtureResponse({ code: 0, data: { id, username: id, role: "user" } }); }
    if (route === "/api/v1/auth/points") return fixtureResponse({ code: 0, data: { points: call.headers.Authorization.endsWith("A") ? 100 : 200 } });
    return fixtureResponse({}, 404);
  };
  const storageRoot = tempRoot();
  const broker = await account.createCodelyAccountBroker({ root: storageRoot, vault: customVault, fetch, baseUrl: FIXTURE_ORIGIN, autoDrive: false });
  async function login(id) { identity = id; await broker.start(); assert.equal((await broker.poll()).status, "completed"); }
  if (autoLogin) await login("A");
  return { broker, calls, login, storageRoot };
}

test("Late generator bootstrap cannot attach the previous account's cookie to a new login", async () => {
  const held = barrier(); let block = true;
  const f = await raceFixture(async call => { if (block && call.route === "/api/editor/sso/bootstrap") { block = false; await held.hold(); } });
  const pending = f.broker.generatorUser();
  const rejected = assert.rejects(pending, error => error.code === "cancelled");
  await held.reached;
  await f.broker.logout(); await f.login("B");
  assert.equal((await f.broker.generatorUser()).id, "B");
  held.release(); await rejected;
  assert.equal((await f.broker.generatorUser()).id, "B");
  f.broker.close();
});

test("Late generator credits and Canvas profiles are rejected after logout and account replacement", async () => {
  for (const route of ["/api/credit/my-credits", "/api/v1/auth/profile"]) {
    const held = barrier(); let block = true;
    const f = await raceFixture(async call => { if (block && call.route === route) { block = false; await held.hold(); } });
    const call = () => route.includes("credit") ? f.broker.generatorCredits() : f.broker.canvasSnapshot();
    const pending = call(); const rejected = assert.rejects(pending, error => error.code === "cancelled");
    await held.reached;
    await f.broker.logout(); await f.login("B");
    held.release(); await rejected;
    const current = await call();
    assert.equal(route.includes("credit") ? current.currentCredits : current.user.id, route.includes("credit") ? 200 : "B");
    f.broker.close();
  }
});

test("Token rotation rejects old site exchanges and concurrent callers share one current exchange", async () => {
  for (const route of ["/api/editor/sso/bootstrap", "/api/v1/auth/exchange"]) {
    const held = barrier(); let block = true;
    const f = await raceFixture(async call => { if (block && call.route === route) { block = false; await held.hold(); } });
    const call = () => route.includes("bootstrap") ? f.broker.generatorUser() : f.broker.canvasSnapshot();
    const pending = call(); const rejected = assert.rejects(pending, error => error.code === "cancelled");
    await held.reached;
    assert.equal((await f.broker.refresh({ force: true })).status, "refreshed");
    held.release(); await rejected;
    await Promise.all([call(), call(), call()]);
    assert.equal(f.calls.filter(call => call.route === route).length, 2, "one superseded exchange plus one shared exchange");
    f.broker.close();
  }
});

test("Late main-account plan data cannot repopulate a replacement account's status", async () => {
  const held = barrier();
  const f = await raceFixture(async call => { if (call.route === "/api/user/plan") await held.hold(); });
  const pending = f.broker.getUserPlanRaw(); const rejected = assert.rejects(pending, error => error.code === "cancelled");
  await held.reached;
  await f.broker.logout(); await f.login("B");
  held.release(); await rejected;
  assert.deepEqual(f.broker.status().plan, {});
  f.broker.close();
});

test("Only valid credit amounts and known Canvas amount fields cross the broker boundary", async () => {
  const marker = "fixture-secret-must-not-be-displayed";
  const f = await raceFixture(async call => {
    if (call.route === "/api/credit/my-credits") return fixtureResponse({ currentCredits: { access_token: marker } });
    if (call.route === "/api/v1/auth/points") return fixtureResponse({ code: 0, data: { points: 12, total: "20.5", access_token: marker, nested: { jwt: marker } } });
  });
  await assert.rejects(f.broker.generatorCredits(), /valid amount/);
  const snapshot = await f.broker.canvasSnapshot();
  assert.deepEqual(snapshot.points, { points: 12, total: "20.5" });
  assert.ok(!JSON.stringify(snapshot).includes(marker));
  assert.ok(f.calls.every(call => call.redirect === "error"), "credentials must not follow redirects to another origin");
  f.broker.close();
});

test("A rotated token stays unpublished while its sealed record is pending or fails", async () => {
  const held = barrier(); let fail = true;
  const customVault = { ...vault, seal: async bytes => {
    if (bytes.length && JSON.parse(bytes.toString("utf8")).accessToken === "main-A-1") {
      await held.hold();
      if (fail) throw new Error("fixture storage unavailable");
    }
    return vault.seal(bytes);
  } };
  const f = await raceFixture(async () => {}, customVault);
  const pending = f.broker.refresh({ force: true });
  await held.reached;
  assert.equal((await f.broker.generatorUser()).id, "A");
  assert.equal(f.calls.find(call => call.route === "/api/editor/sso/bootstrap").headers.Authorization, "Bearer main-A-0");
  held.release();
  assert.equal((await pending).status, "transient-error");
  await f.broker.generatorUser();
  assert.equal(f.calls.filter(call => call.route === "/api/user/me").at(-1).headers.Authorization, "Bearer main-A-0");
  fail = false;
  assert.equal((await f.broker.refresh({ force: true })).status, "refreshed");
  await f.broker.generatorUser();
  assert.equal(f.calls.filter(call => call.route === "/api/user/me").at(-1).headers.Authorization, "Bearer main-A-2");
  f.broker.close();
});

test("A late login seal cannot overwrite or clear a new account's persisted session", async () => {
  const held = barrier();
  const customVault = { ...vault, seal: async bytes => {
    if (bytes.length && JSON.parse(bytes.toString("utf8")).account.id === "A") await held.hold();
    return vault.seal(bytes);
  } };
  const f = await raceFixture(async () => {}, customVault, false);
  await f.broker.start();
  const pending = f.broker.poll();
  await held.reached;
  assert.equal((await f.broker.poll()).status, "in-flight", "exchange and persistence retain polling ownership");
  await f.broker.logout(); await f.login("B");
  held.release();
  assert.equal((await pending).status, "cancelled");
  assert.equal(f.broker.status().session.account.id, "B");
  const record = JSON.parse((await vault.unseal(fs.readFileSync(path.join(f.storageRoot, "session.enc")))).toString("utf8"));
  assert.equal(record.account.id, "B");
  f.broker.close();
});

test("Cancel during device initiation discards its late response and permits a new login", async () => {
  const held = barrier(); let block = true;
  const f = await raceFixture(async call => { if (block && call.route === "/auth/device/initiate") { block = false; await held.hold(); } }, vault, false);
  const pending = f.broker.start(); const rejected = assert.rejects(pending, error => error.code === "cancelled");
  await held.reached;
  assert.equal(f.broker.cancel().status, "cancelled");
  await f.login("B");
  held.release(); await rejected;
  assert.equal(f.broker.status().session.account.id, "B");
  f.broker.close();
});

test("Device slow_down intervals use the protocol's seconds unit", async () => {
  const f = await raceFixture(async call => call.route === "/auth/device/poll" ? fixtureResponse({ status: "slow_down", interval: 5 }) : undefined, vault, false);
  await f.broker.start();
  const before = Date.now();
  const reply = await f.broker.poll();
  assert.equal(reply.status, "pending");
  assert.ok(reply.nextPollAtMs >= before + 5000);
  f.broker.close();
});
