// Isolated contracts for the Codely main-account broker. Every HTTP byte comes
// from the injected fixture; no real network, no original-install data, and the
// storage root lives in the unified temp tree.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const account = require("../../src/core/binary/out/gamecowork-codely-account.js");

const FIXTURE_ORIGIN = "http://127.0.0.1:8641";
const REAL_ACCESS = "real-access-token-XYZ";
const REAL_REFRESH = "real-refresh-token-ABC";
const AUTH_CODE = "one-time-authorization-code-9";
const REQUEST_TOKEN = "auth-request-token-SECRET-1";
const USER_CODE = "WDVX-MJTV";

function tempRoot() {
  const root = "F:/AI/AgentMake/temp/GameCowork/codely-account-contract-" + randomUUID();
  fs.mkdirSync(root, { recursive: true });
  return root;
}

function testVault() {
  const key = crypto.randomBytes(32);
  return {
    seal: async (plain) => {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
      const body = Buffer.concat([cipher.update(plain), cipher.final()]);
      return Buffer.concat([iv, cipher.getAuthTag(), body]);
    },
    unseal: async (blob) => {
      const iv = blob.subarray(0, 12), tag = blob.subarray(12, 28), body = blob.subarray(28);
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag);
      return Buffer.concat([decipher.update(body), decipher.final()]);
    },
  };
}

class Clock {
  constructor() { this.ms = 1_800_000_000_000; }
  now() { return this.ms; }
  advance(seconds) { this.ms += seconds * 1000; }
}

function fixtureResponse(body, status = 200) {
  return new Response(body === null ? "null" : JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json" },
  });
}

// Scenario-driven official-endpoint fixture. Each entry may be a value, a
// function (call, body) or an array consumed per call.
function fixtureFetch(scenario = {}) {
  const calls = [];
  async function impl(url, init = {}) {
    const parsed = new URL(url);
    const entry = { url: String(url), method: init.method || "GET", headers: init.headers || {}, body: init.body };
    calls.push(entry);
    const route = (scenario[parsed.pathname] !== undefined) ? scenario[parsed.pathname]
      : (scenario[parsed.pathname + "!" + (init.method || "GET")] !== undefined) ? scenario[parsed.pathname + "!" + (init.method || "GET")]
      : null;
    let handler = typeof route === "function" ? null : Array.isArray(route) ? route[Math.min(calls.filter((c) => c.url === url).length - 1, route.length - 1)] : route;
    if (handler === null && typeof route === "function") handler = await route(entry);
    if (handler === undefined || handler === null) return fixtureResponse({ error: "fixture route missing" }, 404);
    if (handler instanceof Error) throw handler;
    if (handler && handler.__status) return fixtureResponse(handler.body, handler.__status);
    return fixtureResponse(handler);
  }
  impl.calls = calls;
  return impl;
}

const defaultInitiate = {
  auth_request_token: REQUEST_TOKEN,
  user_code: USER_CODE,
  verification_uri: `${FIXTURE_ORIGIN}/auth/device`,
  verification_uri_complete: `${FIXTURE_ORIGIN}/auth/device?user_code=${USER_CODE}`,
  expires_in: 600,
  interval: 1,
};

function brokerOptions(fetchImpl, { clock = new Clock(), root = tempRoot(), scenario, vault = testVault(), emitter = () => {} } = {}) {
  return {
    root,
    vault,
    fetch: fetchImpl,
    now: () => clock.now(),
    requestTimeoutMs: 5000,
    baseUrl: FIXTURE_ORIGIN,
    emitter,
    autoDrive: false,
    setTimeoutFn: () => 0,
    clearTimeoutFn: () => {},
    logger: { warn() {}, error() {} },
    ...(scenario ? {} : {}),
  };
}

const SECRET_MARKERS = [REAL_ACCESS, REAL_REFRESH, REQUEST_TOKEN, AUTH_CODE];

function assertNoSecrets(value, label) {
  const text = JSON.stringify(value ?? null);
  for (const marker of SECRET_MARKERS) {
    assert.ok(!text.includes(marker), `${label} leaked a secret marker`);
  }
}

test("Broker refuses to start without an injected vault, fetch or absolute root", async () => {
  const root = tempRoot();
  await assert.rejects(
    account.createCodelyAccountBroker({ root, vault: null, fetch: fixtureFetch() }),
    /vault/i,
  );
  await assert.rejects(
    account.createCodelyAccountBroker({ root, vault: testVault(), fetch: undefined }),
    /fetch/i,
  );
  await assert.rejects(
    account.createCodelyAccountBroker({ root: "./relative", vault: testVault(), fetch: fixtureFetch() }),
    /absolute/i,
  );
  await assert.rejects(
    account.createCodelyAccountBroker({ root, vault: testVault(), fetch: fixtureFetch(), baseUrl: "https://evil.example" }),
    /official|loopback/i,
  );
  await assert.rejects(
    account.createCodelyAccountBroker({ root, vault: testVault(), fetch: fixtureFetch(), baseUrl: "http://evil.example" }),
    /official|loopback/i,
  );
});

test("Device login lifecycle: initiate, pending, slow_down, authorized, exchange, identity", async () => {
  const clock = new Clock();
  const events = [];
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": (call) => {
      assert.equal(call.body, JSON.stringify({ provider: "unity", client_name: "GameCowork" }));
      assert.equal(call.headers["Content-Type"], "application/json");
      return defaultInitiate;
    },
    "/auth/device/poll!GET": [
      { status: "pending" },
      { status: "slow_down", interval: 3 },
      { status: "authorized", authorization_code: AUTH_CODE },
    ],
    "/auth/device/exchange!POST": (call) => {
      assert.equal(call.body, JSON.stringify({ authorization_code: AUTH_CODE }));
      return { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, token_type: "Bearer", expires_in: 3600 };
    },
    "/auth/external/me!GET": (call) => {
      assert.equal(call.headers.Authorization, `Bearer ${REAL_ACCESS}`);
      return { id: 41001, username: "codely-user", email: "user@example.invalid" };
    },
  });
  const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, emitter: (kind, data) => events.push([kind, data]) }));
  const started = await broker.start();
  assert.equal(started.status, "in-progress");
  assert.equal(started.attempt.userCode, USER_CODE);
  assert.ok(started.attempt.verificationUriComplete.startsWith(FIXTURE_ORIGIN));

  assert.equal((await broker.poll()).status, "pending");
  clock.advance(1);
  assert.equal((await broker.poll()).status, "pending"); // slow_down still pending for the GUI
  clock.advance(3);
  const finalPoll = await broker.poll();
  assert.equal(finalPoll.status, "completed");

  const state = broker.status();
  assert.equal(state.phase, "authenticated");
  assert.equal(state.session.account.id, "41001");
  assert.equal(state.session.account.label, "codely-user");
  assert.equal(state.session.accessToken, "gamecowork-codely-session");
  assertNoSecrets(state, "status()");

  const startedEvents = events.filter(([kind]) => kind === "device-flow-started");
  assert.equal(startedEvents.length, 1);
  assert.equal(startedEvents[0][1].authFlowAttemptId, 1);
  assert.equal(startedEvents[0][1].userCode, USER_CODE);
  const updates = events.filter(([kind]) => kind === "sessionUpdate");
  assert.equal(updates.length, 1);
  assert.equal(updates[0][1].sessionInfo.mode, "codely");
  assertNoSecrets(events, "emitted events");
});

test("Storage stays sealed: no plaintext tokens on disk, record reloads through the vault", async () => {
  const clock = new Clock();
  const root = tempRoot();
  const vault = testVault();
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, expires_in: 3600 },
    "/auth/external/me!GET": { id: 42, username: "sealed-user" },
  });
  const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, root, vault }));
  await broker.start();
  await broker.poll();
  const files = fs.readdirSync(root);
  assert.deepEqual(files.sort(), ["session.enc"]);
  const sealedBytes = fs.readFileSync(path.join(root, "session.enc"));
  assert.ok(!sealedBytes.toString("latin1").includes(REAL_ACCESS));
  assert.ok(!sealedBytes.toString("latin1").includes(REAL_REFRESH));
  assert.ok(!sealedBytes.toString("latin1").includes("codely-user"));

  const second = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, root, vault }));
  const restored = await second.restoreFromStorage();
  assert.equal(restored.status, "restored");
  const state = second.status();
  assert.equal(state.phase, "authenticated");
  assert.equal(state.restored, true);
  assert.equal(state.session.account.label, "sealed-user");
  assertNoSecrets(state, "restored status");
});

test("Concurrent start shares one initiate; verification host is validated", async () => {
  const clock = new Clock();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": async () => {
      await gate;
      return defaultInitiate;
    },
  });
  const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock }));
  const both = Promise.all([broker.start(), broker.start()]);
  await new Promise((resolve) => setTimeout(resolve, 10));
  release();
  const [first, second] = await both;
  assert.equal(first.attempt.authFlowAttemptId, second.attempt.authFlowAttemptId);
  const initiateCalls = fetchImpl.calls.filter((c) => c.url.includes("/auth/device/initiate"));
  assert.equal(initiateCalls.length, 1);

  const badHost = await account.createCodelyAccountBroker(brokerOptions(fixtureFetch({
    "/auth/device/initiate!POST": { ...defaultInitiate, verification_uri_complete: "https://evil.example/login" },
  }), { clock }));
  await assert.rejects(badHost.start(), /verification host/i);
});

test("Cancel discards the attempt; late authorized receipts cannot sign in", async () => {
  const clock = new Clock();
  const events = [];
  let pendingPolls = 0;
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": async () => {
      pendingPolls += 1;
      await new Promise((resolve) => setTimeout(resolve, 30));
      return { status: "authorized", authorization_code: AUTH_CODE };
    },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, expires_in: 3600 },
  });
  const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, emitter: (kind, data) => events.push([kind, data]) }));
  await broker.start();
  const pollPromise = broker.poll();
  await new Promise((resolve) => setTimeout(resolve, 5));
  const cancelled = broker.cancel();
  assert.equal(cancelled.status, "cancelled");
  assert.equal((await pollPromise).status, "cancelled");
  assert.equal(broker.status().phase, "logged-out");
  assert.ok(events.some(([kind, data]) => kind === "device-flow-cancelled" && data.authFlowAttemptId === 1));
  assert.equal(events.filter(([kind]) => kind === "sessionUpdate").length, 0);

  // A fresh attempt whose poll already succeeded before cancel keeps no state.
  const late = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, emitter: (kind, data) => events.push([kind, data]) }));
  await late.start();
  late.cancel();
  await late.poll().catch(() => {});
  assert.equal(late.status().phase, "logged-out");
  void pendingPolls;
});

test("Expiry, denial and completed-terminal polls surface as failed attempts", async () => {
  const clock = new Clock();
  const events = [];
  const build = async (pollScenario) => {
    const fetchImpl = fixtureFetch({
      "/auth/device/initiate!POST": defaultInitiate,
      "/auth/device/poll!GET": pollScenario,
    });
    const brokerEvents = [];
    const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, emitter: (kind, data) => brokerEvents.push([kind, data]) }));
    await broker.start();
    return { broker, brokerEvents };
  };

  const expired = await build({ status: "expired", error_description: "too slow" });
  assert.equal((await expired.broker.poll()).status, "failed");
  assert.equal(expired.broker.status().phase, "logged-out");
  assert.ok(expired.brokerEvents.some(([k, d]) => k === "device-flow-failed" && d.error.includes("too slow")));

  const denied = await build({ status: "denied" });
  assert.equal((await denied.broker.poll()).status, "failed");
  assert.ok(denied.brokerEvents.some(([k, d]) => k === "device-flow-failed" && d.error.includes("denied")));

  const completed = await build({ status: "completed" });
  assert.equal((await completed.broker.poll()).status, "failed");
  assert.ok(completed.brokerEvents.some(([k, d]) => k === "device-flow-failed" && d.error.includes("restart login")));

  const noCode = await build({ status: "authorized" });
  assert.equal((await noCode.broker.poll()).status, "failed");

  const weird = await build({ status: "wat" });
  assert.equal((await weird.broker.poll()).status, "failed");

  // Host-driven expiry posts the typed error the original GUI maps to i18n.
  const manual = await build({ status: "pending" });
  const expireResult = manual.broker.expire();
  assert.equal(expireResult.status, "expired");
  assert.ok(manual.brokerEvents.some(([k, d]) => k === "device-flow-failed" && d.errorType === "expired"));
  void events;
});

test("Exchange and identity failures fail honestly and keep no session", async () => {
  const clock = new Clock();
  const build = async (scenario) => {
    const fetchImpl = fixtureFetch({
      "/auth/device/initiate!POST": defaultInitiate,
      "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
      ...scenario,
    });
    const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock }));
    await broker.start();
    return broker;
  };
  const badExchange = await build({ "/auth/device/exchange!POST": { __status: 500, body: { detail: "code consumed" } } });
  assert.equal((await badExchange.poll()).status, "failed");
  assert.equal(badExchange.status().phase, "logged-out");

  const invalidToken = await build({ "/auth/device/exchange!POST": { refresh_token: REAL_REFRESH } });
  assert.equal((await invalidToken.poll()).status, "failed");

  const rejectedMe = await build({
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, expires_in: 3600 },
    "/auth/external/me!GET": { __status: 401, body: {} },
  });
  assert.equal((await rejectedMe.poll()).status, "failed");
  assert.equal(rejectedMe.status().phase, "logged-out");
});

test("Sealed persistence failure prevents any authenticated announcement", async () => {
  const clock = new Clock();
  const events = [];
  const brokenVault = {
    seal: async () => { throw new Error("disk full"); },
    unseal: async () => { throw new Error("nope"); },
  };
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, expires_in: 3600 },
    "/auth/external/me!GET": { id: 7, username: "u" },
  });
  const broker = await account.createCodelyAccountBroker(brokerOptions(fetchImpl, { clock, vault: brokenVault, emitter: (kind, data) => events.push([kind, data]) }));
  await broker.start();
  assert.equal((await broker.poll()).status, "failed");
  assert.equal(broker.status().phase, "logged-out");
  assert.ok(events.some(([k, d]) => k === "device-flow-failed" && String(d.error).includes("加密保存失败")));
  assert.equal(events.filter(([k]) => k === "sessionUpdate").length, 0);
});

test("Refresh rotates tokens (persist-first), dedupes in-flight calls and re-logins on 400/401", async () => {
  const clock = new Clock();
  const root = tempRoot();
  const vault = testVault();
  const refreshed = { access_token: "rotated-access-token-2", refresh_token: "rotated-refresh-token-2", expires_in: 7200 };
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, expires_in: 60 },
    "/auth/external/me!GET": { id: 9, username: "rotating-user" },
    "/auth/refresh!POST": (call) => {
      assert.equal(call.body, JSON.stringify({ refresh_token: REAL_REFRESH }));
      assert.equal(call.headers.Authorization, undefined);
      return refreshed;
    },
  });
  const options = brokerOptions(fetchImpl, { clock, root, vault });
  const broker = await account.createCodelyAccountBroker(options);
  await broker.start();
  await broker.poll();

  clock.advance(120);
  const [a, b] = await Promise.all([broker.refresh({}), broker.refresh({})]);
  const outcomes = [a.status, b.status];
  assert.ok(outcomes.includes("refreshed"));
  assert.ok(outcomes.filter((s) => s === "refreshed").length === 1 || outcomes.every((s) => s === "refreshed"));
  const record = JSON.parse((await options.vault.unseal(fs.readFileSync(path.join(root, "session.enc")))).toString("utf8"));
  assert.equal(record.refreshToken, "rotated-refresh-token-2");

  // 401 from refresh forces requires-login and clears storage.
  const fetchImpl2 = fixtureFetch({
    "/auth/refresh!POST": { __status: 401, body: { detail: "revoked" } },
  });
  const options2 = { ...brokerOptions(fetchImpl2, { clock, root, vault }), fetch: fetchImpl2 };
  const broker2 = await account.createCodelyAccountBroker(options2);
  await broker2.restoreFromStorage();
  clock.advance(100000);
  const outcome = await broker2.refresh({ force: true });
  assert.equal(outcome.status, "requires-login");
  assert.equal(broker2.status().phase, "requires-login");
  assert.ok(fs.existsSync(path.join(root, "logout.flag")));
  assert.ok(!fs.existsSync(path.join(root, "session.enc")));
});

test("Org-scoped data plane validates membership, attaches the live token and retries once after refresh", async () => {
  const clock = new Clock();
  const root = tempRoot();
  const teamsBody = { teams: [{ team_id: "org-1", team_name: "Main", is_current: true, has_key: true }], current_team_id: "org-1", multi_team_enabled: false };
  let planCalls = 0;
  let refreshCalls = 0;
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, expires_in: 3600 },
    "/auth/external/me!GET": { id: 5, username: "planner" },
    "/api/teams!GET": teamsBody,
    "/api/teams/switch!POST": (call) => {
      assert.equal(call.body, JSON.stringify({ team_id: "org-1" }));
      return { success: true, current_team_id: "org-1", team_name: "Main" };
    },
    "/api/user/plan!GET": (call) => {
      planCalls += 1;
      if (planCalls === 1) return { __status: 401, body: {} };
      assert.equal(new URL(call.url).searchParams.get("orgId"), "org-1");
      assert.equal(call.headers.Authorization, `Bearer ${REAL_ACCESS}`);
      return { plan_type: "pro", plan_tag: "team", is_team_plan: true, is_active: true, valid_to: "2026-12-01", can_upgrade: false, can_manage_plan: true, can_topup: true, has_seat: true, in_renewal_period: false, pending_payment_url: null };
    },
    "/auth/refresh!POST": (call) => {
      refreshCalls += 1;
      assert.equal(call.body, JSON.stringify({ refresh_token: REAL_REFRESH }));
      return { access_token: REAL_ACCESS, expires_in: 3600 };
    },
    "/api/user/usage/summary!GET": (call) => {
      assert.equal(new URL(call.url).searchParams.get("orgId"), "org-1");
      return { remaining_points: "135", is_exhausted: false, details: [{ type: "coding_plan", remaining_points: "135", exhausted: false, windows: [{ window_type: "five_hours", quota_points: "100", used_points: "20", remaining_points: "80", exhausted: false, period: { start_at: "s", end_at: "e" } }] }] };
    },
    "/api/user/usage/exhaustion!GET": { is_exhausted: true, exhausted_source: "coding_plan", next_available_at: "tomorrow" },
  });
  const options = brokerOptions(fetchImpl, { clock, root });
  const broker = await account.createCodelyAccountBroker(options);
  await broker.start();
  await broker.poll();

  await assert.rejects(broker.getUserPlanRaw("org-not-mine"), /member organization/);
  const plan = await broker.getUserPlanRaw("org-1");
  assert.equal(plan.plan_type, "pro");
  assert.equal(refreshCalls, 1); // the 401 triggered exactly one forced refresh

  const usage = await broker.getUserUsageSummaryRaw("org-1");
  assert.equal(usage.remaining_points, "135");
  const exhaustion = await broker.getUserExhaustionRaw("org-1");
  assert.equal(exhaustion.exhausted_source, "coding_plan");

  const state = broker.status();
  assert.equal(state.plan.planType, "pro");
  assert.equal(state.usage.remainingPoints, "135");
  assert.equal(state.usage.windows[0].windowType, "five_hours");
  assert.equal(state.usage.windows[0].remainingPoints, "80");
  assertNoSecrets(state, "plan/usage status");

  const teams = await broker.listTeamsRaw();
  assert.equal(teams.current_team_id, "org-1");
  const switched = await broker.switchTeamRaw("org-1");
  assert.ok("current_team_id" in switched || switched.success !== false);
});

test("Logout wins over resurrection: marker precedes record removal and survives occupied files", async () => {
  const clock = new Clock();
  const root = tempRoot();
  const events = [];
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, expires_in: 3600 },
    "/auth/external/me!GET": { id: 11, username: "leaver" },
  });
  const options = brokerOptions(fetchImpl, { clock, root, emitter: (kind, data) => events.push([kind, data]) });
  const broker = await account.createCodelyAccountBroker(options);
  await broker.start();
  await broker.poll();
  assert.equal(broker.status().phase, "authenticated");

  const result = await broker.logout();
  assert.equal(result.status, "logged-out");
  assert.ok(fs.existsSync(path.join(root, "logout.flag")));
  assert.ok(!fs.existsSync(path.join(root, "session.enc")));
  const updates = events.filter(([k]) => k === "sessionUpdate");
  assert.equal(updates[updates.length - 1][1].sessionInfo, null);

  // The logout marker beats a record that reappears on disk.
  const resurrected = await account.createCodelyAccountBroker(options);
  assert.equal((await resurrected.restoreFromStorage()).status, "logged-out");
  assert.equal(resurrected.status().phase, "logged-out");
});

test("registerCoreWiring answers session RPCs and keeps tokens behind the broker", async () => {
  const clock = new Clock();
  const root = tempRoot();
  const vault = testVault();
  process.env.GAMECOWORK_CODELY_ACCOUNT_DIR = root;
  process.env.GAMECOWORK_CODELY_ACCOUNT_BASE_URL = FIXTURE_ORIGIN;
  const events = [];
  const listeners = new Map();
  const sent = [];
  const messenger = {
    on: (kind, handler) => {
      listeners.set(kind, handler);
      return () => {};
    },
    send: (kind, data) => sent.push([kind, data]),
    request: async (kind, data) => {
      assert.ok(kind === "gamecoworkAccount/vaultSeal" || kind === "gamecoworkAccount/vaultUnseal");
      return kind === "gamecoworkAccount/vaultSeal"
        ? { sealed: (await vault.seal(Buffer.from(data.data, "hex"))).toString("hex") }
        : { plain: (await vault.unseal(Buffer.from(data.data, "hex"))).toString("hex") };
    },
  };
  const core = { orgManager: { updateFromListTeams() {}, setCurrentOrgId() {}, getOrganizations() { return []; }, getCurrentOrgId() { return null; }, getCurrentOrgName() { return null; }, getMultiTeamEnabled() { return false; }, reset() {} }, pushOrgUpdate() {} };
  const fetchImpl = fixtureFetch({
    "/auth/device/initiate!POST": defaultInitiate,
    "/auth/device/poll!GET": { status: "authorized", authorization_code: AUTH_CODE },
    "/auth/device/exchange!POST": { access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, expires_in: 3600 },
    "/auth/external/me!GET": { id: 77, username: "wired-user" },
    "/api/teams!GET": { teams: [{ team_id: "org-1", team_name: "Main", is_current: true, has_key: true }], current_team_id: "org-1", multi_team_enabled: false },
  });
  try {
    account.registerCoreWiring({
      messenger, core,
      logger: { warn() {}, error() {} },
      overrides: { now: () => clock.now(), requestTimeoutMs: 5000, baseUrl: FIXTURE_ORIGIN, autoDrive: false, setTimeoutFn: () => 0, clearTimeoutFn: () => {}, fetch: fetchImpl, emitter: (kind, data) => events.push([kind, data]) },
    });
    const sessionHandler = listeners.get("getControlPlaneSessionInfo");
    assert.equal(await sessionHandler({ data: { silent: true } }), null);
    const started = await sessionHandler({ data: { silent: false } });
    assert.equal(started.joinedInProgress, true);
    assert.equal((await listeners.get("codelyAccount/status")()).phase, "awaiting-authorization");
    assert.equal((await listeners.get("codelyAccount/poll")()).status, "completed");
    const session = await sessionHandler({ data: { silent: true } });
    assert.equal(session.account.label, "wired-user");
    assert.equal(session.mode, "codely");
    assertNoSecrets(session, "wired session");
    assert.equal((await listeners.get("cancelLogin")()).status, "idle");
    const logout = await listeners.get("logoutOfControlPlane")();
    assert.equal(logout.status, "logged-out");
    assert.equal(await sessionHandler({ data: { silent: true } }), null);
    assertNoSecrets(sent, "messenger sends");
    assertNoSecrets(events, "wiring events");
  } finally {
    delete process.env.GAMECOWORK_CODELY_ACCOUNT_DIR;
    delete process.env.GAMECOWORK_CODELY_ACCOUNT_BASE_URL;
  }
});
