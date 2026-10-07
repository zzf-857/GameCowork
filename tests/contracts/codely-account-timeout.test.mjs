// Real loopback streaming responses exercise deadlines after headers arrive.
// No official account requests or installation credentials are used.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createCodelyAccountBroker } = require("../../src/core/binary/out/modules/account/broker.js");

function fixtureVault() {
  const key = crypto.randomBytes(32);
  return {
    seal: async plain => {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
      const body = Buffer.concat([cipher.update(plain), cipher.final()]);
      return Buffer.concat([iv, cipher.getAuthTag(), body]);
    },
    unseal: async bytes => {
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, bytes.subarray(0, 12));
      decipher.setAuthTag(bytes.subarray(12, 28));
      return Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]);
    },
  };
}

async function until(predicate, label, timeoutMs = 3000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.fail(label);
}

async function bounded(promise, timeoutMs = 1000) {
  let timer;
  try {
    return await Promise.race([promise, new Promise(resolve => { timer = setTimeout(() => resolve({ status: "test-deadline" }), timeoutMs); })]);
  } finally {
    clearTimeout(timer);
  }
}

async function fixture(t, options = {}) {
  const root = fs.mkdtempSync("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/codely-timeout-");
  const events = [], calls = [], signals = [], timers = new Set();
  const state = { stallPath: options.stallPath, stalled: 0, closed: 0 };
  let origin, broker;
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, origin).pathname;
    calls.push(pathname);
    request.resume();
    if (pathname === state.stallPath) {
      state.stalled += 1;
      response.on("close", () => { state.closed += 1; });
      response.writeHead(options.stallStatus || 200, { "Content-Type": "application/json" });
      response.write('{"status":');
      return;
    }
    let payload;
    if (pathname === "/auth/device/initiate") payload = {
      auth_request_token: "owned-request", user_code: "TEST-CODE",
      verification_uri: origin + "/auth/device", verification_uri_complete: origin + "/auth/device?user_code=TEST-CODE",
      expires_in: options.expiresIn ?? 600, interval: 1,
    };
    else if (pathname === "/auth/device/poll") payload = options.authorized ? { status: "authorized", authorization_code: "owned-code" } : { status: "pending" };
    else if (pathname === "/auth/device/exchange") payload = { access_token: "owned-access", refresh_token: "owned-refresh", expires_in: 3600 };
    else if (pathname === "/auth/external/me") payload = { id: 123, username: "owned-user" };
    else if (pathname === "/auth/refresh") payload = { access_token: "owned-access-refreshed", refresh_token: "owned-refresh", expires_in: 3600 };
    else if (pathname === "/api/editor/sso/bootstrap") {
      response.setHeader("Set-Cookie", ["owned_sid=fixture; Path=/; HttpOnly", "owned_csrf=fixture; Path=/"]);
      payload = { id: 123, username: "owned-user" };
    } else if (pathname === "/api/user/me") {
      state.siteCookies = request.headers.cookie;
      payload = { id: 123, username: "owned-user" };
    } else if (pathname === "/api/v1/auth/exchange") payload = { code: 0, data: { tokens: { access_token: "owned-canvas" }, user: { id: 123, username: "owned-user" } } };
    else if (pathname === "/api/v1/auth/profile") payload = { code: 0, data: { id: 123, username: "owned-user" } };
    else if (pathname === "/api/v1/auth/points") payload = { code: 0, data: { points: 100, total: 100 } };
    else payload = { detail: "owned fixture route missing" };
    if (pathname === options.delayedPath) {
      let bodyTimer;
      const headersTimer = setTimeout(() => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write("{");
        bodyTimer = setTimeout(() => response.end(JSON.stringify(payload).slice(1)), options.bodyDelayMs);
      }, options.headersDelayMs);
      response.on("close", () => { clearTimeout(headersTimer); clearTimeout(bodyTimer); });
      return;
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(payload));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  origin = "http://127.0.0.1:" + server.address().port;
  t.after(async () => {
    broker?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    assert.equal(timers.size, 0, "broker close must release every owned deadline/drive timer");
  });
  broker = await createCodelyAccountBroker({
    root, vault: fixtureVault(), baseUrl: origin, requestTimeoutMs: options.timeoutMs ?? 100,
    autoDrive: options.autoDrive ?? false,
    fetch: (url, init) => {
      assert.equal(new URL(url).origin, origin, "all requests must stay inside the owned loopback fixture");
      signals.push({ path: new URL(url).pathname, signal: init.signal });
      return fetch(url, init);
    },
    emitter: (kind, data) => events.push([kind, data]),
    setTimeoutFn: (fn, ms) => {
      const timer = setTimeout(() => { timers.delete(timer); fn(); }, ms);
      timers.add(timer);
      return timer;
    },
    clearTimeoutFn: timer => { timers.delete(timer); clearTimeout(timer); },
  });
  return { broker, state, events, calls, signals, timers };
}

test("poll aborts a partial response body within the whole request budget and releases its in-flight guard", async t => {
  const f = await fixture(t, { stallPath: "/auth/device/poll" });
  await f.broker.start();
  const result = await bounded(f.broker.poll());
  assert.equal(result.status, "retrying", "headers alone must not disable the request deadline");
  await until(() => f.state.closed === 1, "the timed out response stream must close");
  f.state.stallPath = null;
  assert.equal((await f.broker.poll()).status, "pending", "timed out body must release pollInFlight");
});

for (const stalledPath of ["/auth/device/poll", "/auth/device/exchange", "/auth/external/me"]) {
  test(`Core expires without a GUI while ${stalledPath} response body is stalled`, async t => {
    const f = await fixture(t, { stallPath: stalledPath, timeoutMs: 3000, expiresIn: 0.1, authorized: true });
    await f.broker.start();
    const poll = f.broker.poll();
    await until(() => f.state.stalled === 1, "owned request must reach partial response headers");
    await until(() => f.broker.status().phase === "logged-out", "Core must independently expire the attempt", 1000);
    assert.equal((await bounded(poll)).status, "cancelled");
    assert.equal(f.events.filter(([kind, data]) => kind === "device-flow-failed" && data.errorType === "expired").length, 1);
    assert.equal(f.events.some(([kind]) => kind === "sessionUpdate"), false);
  });
}

test("headers and response body share one total timeout budget", async t => {
  const f = await fixture(t, { delayedPath: "/auth/device/poll", headersDelayMs: 120, bodyDelayMs: 120, timeoutMs: 150 });
  await f.broker.start();
  const started = Date.now();
  const result = await bounded(f.broker.poll());
  assert.equal(result.status, "retrying", "a fresh timeout after headers would incorrectly accept the late JSON");
  assert.ok(Date.now() - started < 220, "response headers must not reset the request budget");
});

test("initiate timeout reports a bounded failure instead of leaving the login request unresolved", async t => {
  const f = await fixture(t, { stallPath: "/auth/device/initiate" });
  await assert.rejects(bounded(f.broker.start()), /timed out/);
  await until(() => f.state.closed === 1, "initiate body timeout must close the stream");
  assert.equal(f.broker.status().phase, "logged-out");
  assert.equal(f.events.filter(([kind]) => kind === "device-flow-failed").length, 1);
  assert.equal(f.timers.size, 0, "failed initiation must retain no request timer");
  f.state.stallPath = null;
  assert.equal((await f.broker.start()).status, "in-progress", "retry must create a fresh initiation");
});

for (const stalledPath of ["/auth/device/exchange", "/auth/external/me"]) {
  test(`${stalledPath} body timeout releases the attempt without publishing a session`, async t => {
    const f = await fixture(t, { stallPath: stalledPath, authorized: true });
    await f.broker.start();
    assert.deepEqual(await bounded(f.broker.poll()), { status: "failed", reason: "timeout" });
    await until(() => f.state.closed === 1, "failed exchange/identity response must close");
    assert.equal(f.broker.status().phase, "logged-out");
    assert.equal(f.broker.status().session, null);
    assert.equal(f.events.some(([kind]) => kind === "sessionUpdate"), false);
    assert.equal(f.timers.size, 0, "terminal failure must release deadline and expiry timers");
  });
}

test("error-status response bodies are bounded before they can be read for diagnostics", async t => {
  const f = await fixture(t, { stallPath: "/auth/device/poll", stallStatus: 503 });
  await f.broker.start();
  assert.equal((await bounded(f.broker.poll())).status, "retrying");
  await until(() => f.state.closed === 1, "partial error response must be aborted");
});

test("real autoDrive retries a body timeout and completes exactly one subsequent authorization", async t => {
  const f = await fixture(t, { stallPath: "/auth/device/poll", autoDrive: true, authorized: true });
  await f.broker.start();
  await until(() => f.state.closed === 1, "autoDrive must abort its first incomplete body");
  f.state.stallPath = null;
  await until(() => f.broker.status().phase === "authenticated", "autoDrive must recover after the body timeout", 4000);
  assert.equal(f.calls.filter(path => path === "/auth/device/poll").length, 2);
  assert.equal(f.events.filter(([kind]) => kind === "sessionUpdate").length, 1);
  assert.equal(f.timers.size, 0, "successful login must release the drive and expiry timers");
});

test("cancel aborts partial initiation without a stale failure and permits a new attempt", async t => {
  const f = await fixture(t, { stallPath: "/auth/device/initiate", timeoutMs: 3000 });
  const rejected = assert.rejects(f.broker.start(), error => error.code === "cancelled");
  await until(() => f.state.stalled === 1, "initiation must reach its incomplete body");
  assert.equal(f.broker.cancel().status, "cancelled");
  assert.equal(await bounded(rejected), undefined, "cancel must settle the request before its network timeout");
  await until(() => f.state.closed === 1, "cancel must close the initiation stream");
  assert.equal(f.events.some(([kind]) => kind === "device-flow-failed"), false, "cancelled initiation cannot emit a late failure");
  f.state.stallPath = null;
  assert.equal((await f.broker.start()).status, "in-progress");
  assert.equal((await f.broker.poll()).status, "pending");
});

for (const stalledPath of ["/api/editor/sso/bootstrap", "/api/user/me"]) {
  test(`official site ${stalledPath} uses the same complete response-body deadline`, async t => {
    const f = await fixture(t, { authorized: true });
    await f.broker.start();
    assert.equal((await f.broker.poll()).status, "completed");
    f.state.stallPath = stalledPath;
    await assert.rejects(bounded(f.broker.generatorUser()), /timed out/);
    await until(() => f.state.closed === 1, "official-site response timeout must close its stream");
    f.state.stallPath = null;
    assert.equal((await f.broker.generatorUser()).id, "123", "site in-flight bootstrap must be reusable after timeout");
    assert.ok(f.state.siteCookies.includes("owned_sid=fixture"));
    assert.ok(f.state.siteCookies.includes("owned_csrf=fixture"), "buffered response must preserve distinct Set-Cookie entries");
    assert.equal(f.timers.size, 0);
  });
}

test("logout aborts an incomplete site request and completed requests have detached their epoch listeners", async t => {
  const f = await fixture(t, { authorized: true, timeoutMs: 3000 });
  await f.broker.start();
  assert.equal((await f.broker.poll()).status, "completed");
  assert.equal((await f.broker.generatorUser()).id, "123");
  const completedSignals = f.signals.map(entry => entry.signal);
  f.state.stallPath = "/api/user/me";
  const rejected = assert.rejects(f.broker.generatorUser(), error => error.code === "cancelled");
  await until(() => f.state.stalled === 1, "site request must reach its partial body");
  assert.equal((await f.broker.logout()).status, "logged-out");
  assert.equal(await bounded(rejected), undefined, "logout must settle the request before its network timeout");
  await until(() => f.state.closed === 1, "logout must close the active site stream");
  assert.ok(f.signals.at(-1).signal.aborted, "active request must observe logout cancellation");
  assert.ok(completedSignals.every(signal => !signal.aborted), "successful requests must detach their epoch abort listeners");
  assert.equal(f.timers.size, 0);
});

test("refresh body timeout keeps the current session usable and permits a later refresh", async t => {
  const f = await fixture(t, { authorized: true });
  await f.broker.start();
  assert.equal((await f.broker.poll()).status, "completed");
  f.state.stallPath = "/auth/refresh";
  const failed = await bounded(f.broker.refresh({ force: true }));
  assert.equal(failed.status, "transient-error");
  assert.match(failed.error, /timed out/);
  assert.equal(f.broker.status().phase, "authenticated");
  await until(() => f.state.closed === 1, "refresh body timeout must close its stream");
  f.state.stallPath = null;
  assert.equal((await f.broker.refresh({ force: true })).status, "refreshed");
  assert.equal(f.timers.size, 0);
});

test("Canvas exchange uses the complete-body deadline and clears its in-flight session after timeout", async t => {
  const f = await fixture(t, { authorized: true });
  await f.broker.start();
  assert.equal((await f.broker.poll()).status, "completed");
  f.state.stallPath = "/api/v1/auth/exchange";
  await assert.rejects(bounded(f.broker.canvasSnapshot()), /timed out/);
  await until(() => f.state.closed === 1, "Canvas timeout must close its stream");
  f.state.stallPath = null;
  assert.equal((await f.broker.canvasSnapshot()).mode, "codely-official");
  assert.equal(f.timers.size, 0);
});
