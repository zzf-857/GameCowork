// Real desktop host + real maintained Core against a loopback fixture that
// serves the audited official account endpoints. --browser also exercises the
// original maintained GUI (use --previous for its previous generation).
// No real provider or Codely quota: every device-flow byte is local and E2E
// guards block non-loopback calls in both Core and Chromium.
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { exerciseAccountBrowser } from "../support/codely-account-browser.mjs";
import { createOwnedGenerationMedia } from "../fixtures/asset-generation-provider-fixture.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const temp = path.resolve(root, "codelyreversebackup/work");
const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const run = path.resolve(option("--output", path.join(temp, `codely-account-login-${Date.now()}-${process.pid}`)));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep), "E2E outputs must stay below temp/GameCowork");
fs.mkdirSync(run, { recursive: true });

const previousGeneration = args.includes("--previous");
const browserEnabled = args.includes("--browser");
const imageEnabled = args.includes('--images');
const noEmail = args.includes('--no-email');
assert.ok(!imageEnabled || browserEnabled,'--images requires the real browser flow');
const packaged = args.includes("--packaged");
const core = path.resolve(option("--core", path.join(root, packaged ? "app/core" : "src/core/binary/out")));
const frontend = path.resolve(option("--frontend", path.join(root, packaged ? "app/frontend" : "src/frontend/bundle")));
const binary = path.resolve(option("--binary", path.join(root, packaged ? "app/GameCowork.exe" : "src/shell/target/debug/GameCowork.exe")));
const runtime = path.resolve(option("--runtime", path.join(root, "app/core/gamecowork-runtime.exe")));
const runtimeCore = path.dirname(runtime);
const guard = path.join(root, "tests/fixtures/codely-account-network-guard.cjs");
const guardLog = path.join(run, "network-guard.jsonl");
const guardRunId = randomUUID();

const REAL_ACCESS = `e2e-access-${randomUUID()}`;
const REAL_REFRESH = `e2e-refresh-${randomUUID()}`;
const AUTH_CODE = `e2e-code-${randomUUID()}`;
const REQUEST_TOKEN = `e2e-request-${randomUUID()}`;
const USER_CODE = "E2EV-CODE";
const ORG = { id: "org-e2e-1", name: "E2E Main Org" };

const state = { authorizeAfterPolls: 2, initiateFailure: false, initiateDelay: 0, imageEnabled, noEmail, defaultOrgPlanReads: 0,
  imageMedia:imageEnabled?createOwnedGenerationMedia(path.join(run,'owned-image-media')):null,
  imageCreates:[],imageQuotes:[] };
if(imageEnabled)fs.writeFileSync(path.join(run,'owned-download-choices.json'),'[]');
const officialCalls = [];
let fixtureServer;
let fixturePort;

function json(body, status = 200) {
  return { status, contentType: "application/json", body: JSON.stringify(body) };
}

async function startFixture() {
  fixtureServer = http.createServer((request, response) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const bodyText = Buffer.concat(chunks).toString("utf8");
      const parsed = new URL(request.url, `http://127.0.0.1:${fixturePort}`);
      officialCalls.push({ path: parsed.pathname, method: request.method, query: Object.fromEntries(parsed.searchParams) });
      const send = (payload) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(payload));
      };
      const fail = (status, payload) => {
        response.writeHead(status, { "Content-Type": "application/json" });
        response.end(JSON.stringify(payload));
      };
      if (parsed.pathname === "/auth/device/initiate" && request.method === "POST") {
        const body = JSON.parse(bodyText || "{}");
        assert.equal(body.provider, "unity");
        assert.equal(body.client_name, "GameCowork");
        if (state.initiateFailure) return fail(503, { detail: "Owned authorization temporarily unavailable" });
        const initiated = {
          auth_request_token: REQUEST_TOKEN,
          user_code: USER_CODE,
          verification_uri: `http://127.0.0.1:${fixturePort}/auth/device`,
          verification_uri_complete: `http://127.0.0.1:${fixturePort}/auth/device?user_code=${USER_CODE}`,
          expires_in: 600,
          interval: 1,
        };
        if (state.initiateDelay) return setTimeout(() => send(initiated), state.initiateDelay);
        return send(initiated);
      }
      if (parsed.pathname === "/auth/device/poll") {
        assert.equal(parsed.searchParams.get("auth_request_token"), REQUEST_TOKEN);
        state.authorizeAfterPolls -= 1;
        if (state.authorizeAfterPolls > 0) return send({ status: "pending" });
        return send({ status: "authorized", authorization_code: AUTH_CODE });
      }
      if (parsed.pathname === "/auth/device/exchange" && request.method === "POST") {
        assert.equal(JSON.parse(bodyText || "{}").authorization_code, AUTH_CODE);
        return send({ access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, token_type: "Bearer", expires_in: 3600 });
      }
      if (parsed.pathname === "/auth/external/me") {
        if (request.headers.authorization !== `Bearer ${REAL_ACCESS}`) return fail(401, { detail: "bad token" });
        return send({ id: 64001, username: "e2e-codely-user", ...(noEmail ? {} : { email: "e2e-user@example.invalid" }) });
      }
      if (parsed.pathname === "/auth/refresh" && request.method === "POST") {
        assert.equal(JSON.parse(bodyText || "{}").refresh_token, REAL_REFRESH);
        return send({ access_token: REAL_ACCESS, refresh_token: REAL_REFRESH, expires_in: 3600 });
      }
      if (parsed.pathname === "/api/editor/sso/bootstrap") {
        if (request.headers.authorization !== `Bearer ${REAL_ACCESS}`) return fail(401, { detail: "bad token" });
        response.writeHead(200, { "Content-Type": "application/json", "Set-Cookie": ["gen_sid=e2e-generator-session; Path=/; HttpOnly","_csrf=e2e-generator-csrf; Path=/"] });
        return response.end(JSON.stringify({ id: 64001, username: "e2e-codely-user" }));
      }
      if (parsed.pathname === "/api/user/me") {
        if (!(request.headers.cookie || "").includes("gen_sid=e2e-generator-session")) return fail(401, { detail: "jar required" });
        return send({ id: 64001, username: "e2e-codely-user", name: "e2e-codely-user", role: "user" });
      }
      if (parsed.pathname === "/api/credit/my-credits") return send({ currentCredits: 1234 });
      if (parsed.pathname === "/api/credit/my-paid-status") return send({ paidType: "paid", productCode: "codely_pro" });
      if(parsed.pathname==='/api/credit/cost-preview') {state.imageQuotes.push(Object.fromEntries(parsed.searchParams));return send({credits:7});}
      if(imageEnabled&&parsed.pathname==='/api/sso/generate') {
        assert.equal(request.headers.authorization,`Bearer ${REAL_ACCESS}`);assert.equal(request.headers['x-csrf-token'],'e2e-generator-csrf');
        const body=JSON.parse(bodyText);assert.ok(['frontier_flare','frontier_sunburst'].includes(body.kind));state.imageCreates.push(body);
        return send({taskId:'official-image-'+state.imageCreates.length,status:'queued'});
      }
      if(imageEnabled&&/^\/api\/task\/official-image-\d+\/status$/.test(parsed.pathname))return send({id:parsed.pathname.split('/')[3],status:'completed',output:{data:{imageUrl:`http://127.0.0.1:${fixturePort}/official-output.png`}}});
      if(imageEnabled&&parsed.pathname==='/official-output.png') {
        assert.equal(request.headers.authorization,undefined);assert.equal(request.headers.cookie,undefined);
        response.writeHead(200,{'Content-Type':'image/png'});return response.end(state.imageMedia.png.bytes);
      }
      if (parsed.pathname === "/api/v1/auth/exchange") {
        if (request.headers.authorization !== `Bearer ${REAL_ACCESS}`) return fail(401, { detail: "bad token" });
        return send({ code: 0, data: { user: { id: "u-e2e", username: "e2e-codely-user", role: "user", unity_id: "unity-e2e" }, tokens: { access_token: "canvas-token-never-displayed", refresh_token: "canvas-refresh-never-displayed" } } });
      }
      if (parsed.pathname === "/api/v1/auth/profile") return send({ code: 0, data: { id: "u-e2e", username: "e2e-codely-user", role: "user", unity_id: "unity-e2e" } });
      if (parsed.pathname === "/api/v1/auth/points") return send({ code: 0, data: { points: 500, total: 800 } });
      if (parsed.pathname === "/api/teams") {
        if (request.headers.authorization !== `Bearer ${REAL_ACCESS}`) return fail(401, { detail: "bad token" });
        return send({ teams: [{ team_id: ORG.id, team_name: ORG.name, is_current: true, has_key: true }], current_team_id: ORG.id, multi_team_enabled: false });
      }
      if (parsed.pathname === "/api/teams/switch" && request.method === "POST") {
        assert.equal(JSON.parse(bodyText || "{}").team_id, ORG.id);
        return send({ success: true, current_team_id: ORG.id, team_name: ORG.name });
      }
      if (parsed.pathname === "/api/user/plan") {
        const orgId=parsed.searchParams.get("orgId");assert.ok(orgId===null||orgId===ORG.id,'Only the owned default account or explicit owned organization may be read');
        if(orgId===null)state.defaultOrgPlanReads++;
        return send({ plan_type: "pro", plan_tag: "team", is_team_plan: true, is_active: true, valid_to: "2026-12-31", can_upgrade: false, can_manage_plan: true, can_topup: true, has_seat: true, in_renewal_period: false, pending_payment_url: null });
      }
      if (parsed.pathname === "/api/user/usage/summary") {
        assert.ok([null,ORG.id].includes(parsed.searchParams.get("orgId")));
        return send({ remaining_points: "135", is_exhausted: false, details: [{ type: "coding_plan", remaining_points: "135", exhausted: false, windows: [{ window_type: "five_hours", quota_points: "100", used_points: "20", remaining_points: "80", exhausted: false, period: { start_at: "2026-10-03T00:00:00+08:00", end_at: "2026-10-03T05:00:00+08:00" } }] }] });
      }
      if (parsed.pathname === "/api/user/usage/exhaustion") {
        assert.ok([null,ORG.id].includes(parsed.searchParams.get("orgId")));
        return send({ is_exhausted: false, exhausted_source: "", next_available_at: null });
      }
      fail(404, { detail: `fixture route missing: ${parsed.pathname}` });
    });
  });
  await new Promise((resolve) => fixtureServer.listen(0, "127.0.0.1", resolve));
  fixturePort = fixtureServer.address().port;
}

let shell;
let shellLog = "";
let origin;
const actors = [];
function guardRecords() {
  assert.ok(fs.existsSync(guardLog), "Core network guard audit log is missing");
  return fs.readFileSync(guardLog, "utf8").trim().split("\n").filter(Boolean)
    .map((line) => JSON.parse(line)).filter((record) => record.runId === guardRunId);
}
function ownedCoreRecords(actor) {
  return guardRecords().filter((record) => record.event === "initialized"
    && record.parentPid === actor.pid && path.resolve(record.entry || "") === path.join(core, "index.js")
    && path.resolve(record.dataRoot || "") === path.join(run, "data"));
}
function processGone(pid) {
  if (!pid) return true;
  try { process.kill(pid, 0); return false; } catch (error) { return error.code === "ESRCH"; }
}

async function launchShell(label) {
  origin = undefined;
  shell = spawn(binary, [], {
    cwd: run,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      GAMECOWORK_APP_ROOT: run,
      GAMECOWORK_CORE_DIR: fs.existsSync(runtime) ? runtimeCore : path.dirname(core),
      GAMECOWORK_CORE_ENTRY: path.join(core, "index.js"),
      GAMECOWORK_FRONTEND_DIR: frontend,
      GAMECOWORK_DATA_DIR: path.join(run, "data"),
      GAMECOWORK_USER_DATA_DIR: path.join(run, "data", "core-state"),
      GAMECOWORK_HEADLESS: "1",
      GAMECOWORK_TEST_MODE: "1",
      GAMECOWORK_DISABLE_AUTO_UPDATE: "1",
      ...(imageEnabled?{GAMECOWORK_TEST_DOWNLOAD_CHOICES:path.join(run,'owned-download-choices.json')}:{ }),
      GAMECOWORK_CODELY_ACCOUNT_DIR: path.join(run, "data", "codely-account"),
      GAMECOWORK_CODELY_ACCOUNT_BASE_URL: `http://127.0.0.1:${fixturePort}`,
      GAMECOWORK_E2E_GUARD_LOG: guardLog,
      GAMECOWORK_E2E_GUARD_RUN_ID: guardRunId,
      NODE_OPTIONS: `--require ${JSON.stringify(guard)}`,
    },
  });
  const actor = { label, pid: shell.pid, corePid: null, exited: false };
  actors.push(actor);
  shell.once("exit", (code, signal) => Object.assign(actor, { exited: true, exitCode: code, signal }));
  shellLog = "";
  shell.stdout.on("data", (chunk) => { shellLog += chunk.toString(); const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//); if (match) origin = match[1]; });
  shell.stderr.on("data", (chunk) => { shellLog += chunk.toString(); });
  const deadline = Date.now() + 60000;
  while (!origin) {
    assert.ok(Date.now() < deadline, `${label}: host did not become ready\n${shellLog}`);
    if (shell.exitCode !== null) throw new Error(`${label}: host exited ${shell.exitCode}\n${shellLog}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await new Promise((resolve) => setTimeout(resolve, 2500)); // give the real Core time to finish startup RPCs
  await poll(() => fs.existsSync(guardLog) && ownedCoreRecords(actor).length === 1,
    `${label}: own Core must initialize its network guard`, 10000);
  actor.corePid = ownedCoreRecords(actor)[0].pid;
  assert.ok(Number.isSafeInteger(actor.corePid) && actor.corePid > 0);
  assert.equal(processGone(actor.corePid), false, `${label}: guarded Core must be running`);
}

async function stopShell() {
  if (!shell) return;
  const owned = shell, actor = actors.find((entry) => entry.pid === owned.pid);
  if (!actor.corePid && fs.existsSync(guardLog)) actor.corePid = ownedCoreRecords(actor)[0]?.pid || null;
  if (owned.exitCode === null && owned.signalCode === null) owned.kill();
  await poll(() => actor.exited && processGone(actor.pid) && processGone(actor.corePid),
    `${actor.label}: own host and Core PIDs exit`, 15000);
  actor.gone = true;
  shell = null;
}

async function rpc(type, data = {}) {
  const id = randomUUID();
  const response = await fetch(`${origin}/api/tauri/invoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageType: type, messageId: id, data }),
  });
  assert.equal(response.status, 200);
  const reply = await response.json();
  assert.equal(reply.messageId, id);
  assert.equal(reply.data?.done, true);
  assert.equal(reply.data?.status, "success", `${type} failed: ${JSON.stringify(reply.data?.error ?? reply.data)}`);
  return reply.data.content;
}

async function collectSse() {
  const events = [];
  const controller = new AbortController();
  const response = await fetch(`${origin}/api/tauri/events`, { signal: controller.signal, headers: { Accept: "text/event-stream" } });
  assert.equal(response.status, 200);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  (async () => {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let index;
        while ((index = buffer.indexOf("\n\n")) >= 0) {
          const frame = buffer.slice(0, index);
          buffer = buffer.slice(index + 2);
          for (const line of frame.split("\n")) {
            if (line.startsWith("data:")) {
              const text = line.slice(5).trim();
              if (!text) continue;
              try { events.push(JSON.parse(text)); } catch {}
            }
          }
        }
      }
    } catch {}
  })();
  return { events, stop: () => controller.abort() };
}

async function poll(predicate, label, timeout = 20000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    if (await predicate()) return;
    assert.ok(Date.now() < deadline, `Timed out: ${label}`);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}

const SECRET_MARKERS = [REAL_ACCESS, REAL_REFRESH, AUTH_CODE, REQUEST_TOKEN];
function assertNoSecrets(value, label) {
  const text = JSON.stringify(value ?? null);
  for (const marker of SECRET_MARKERS) assert.ok(!text.includes(marker), `${label} leaked a secret`);
}

const checks = [];
const check = (name, ok) => { assert.ok(ok, name); checks.push(name); };

async function loginAndVerify(label) {
  const { events, stop } = await collectSse();
  try {
    const localSession = await rpc("getControlPlaneSessionInfo", { silent: true, useOnboarding: false });
    assert.equal(localSession.mode, "local", `${label}: logged-out state must fall back to the local identity`);

    const started = await rpc("getControlPlaneSessionInfo", { silent: false, useOnboarding: false });
    assert.equal(started.joinedInProgress, true, `${label}: silent:false returns joinedInProgress while the device flow runs`);

    await poll(() => events.some((event) => event.messageType === "device-flow-started"), `${label}: device-flow-started event`);
    const flowStarted = events.find((event) => event.messageType === "device-flow-started").data;
    assert.ok(Number.isInteger(flowStarted.authFlowAttemptId));
    assert.equal(flowStarted.userCode, USER_CODE);
    assert.equal(flowStarted.showVerificationInfo, true);
    assert.ok(flowStarted.verificationUriComplete.startsWith(`http://127.0.0.1:${fixturePort}/`));
    assert.ok(flowStarted.expiresAtMs > Date.now());
    assertNoSecrets(flowStarted, `${label}: device-flow-started payload`);

    await poll(
      () => events.some((event) => event.messageType === "sessionUpdate" && event.data?.sessionInfo?.mode === "codely"),
      `${label}: sessionUpdate with the Codely session`,
      30000,
    );
    const update = events.find((event) => event.messageType === "sessionUpdate" && event.data?.sessionInfo?.mode === "codely").data.sessionInfo;
    assert.equal(update.account.label, "e2e-codely-user");
    assertNoSecrets(update, `${label}: sessionUpdate payload`);

    const session = await rpc("getControlPlaneSessionInfo", { silent: true, useOnboarding: false });
    assert.equal(session.mode, "codely");
    assert.equal(session.account.id, "64001");
    assertNoSecrets(session, `${label}: whitelisted session`);

    const plan = await rpc("controlPlane/getUserPlan", { orgId: ORG.id });
    assert.equal(plan.planType, "pro");
    assert.equal(plan.isTeamPlan, true);
    assert.equal(plan.isActive, true);
    assert.equal(plan.hasSeat, true);
    assert.equal(plan.canManagePlan, true);

    const usage = await rpc("controlPlane/getUserUsageSummary", { orgId: ORG.id });
    assert.equal(usage.remainingPoints, "135");
    assert.equal(usage.isExhausted, false);
    assert.equal(usage.windows[0].windowType, "five_hours");
    assert.equal(usage.windows[0].remainingPoints, "80");

    const exhaustion = await rpc("controlPlane/getUserExhaustion", { orgId: ORG.id });
    assert.equal(exhaustion.isExhausted, false);

    const orgs = await rpc("refreshOrgList");
    assert.equal(orgs.currentOrgId, ORG.id);
    assert.ok(orgs.organizations.some((org) => org.id === ORG.id && org.name === ORG.name));

    const switched = await rpc("switchOrg", { orgId: ORG.id });
    assert.equal(switched.success, true);
    assert.equal(switched.currentOrgId, ORG.id);

    const quickSession = await fetch(`${origin}/api/codely-generator/local-session`, { headers: { Accept: "application/json" } });
    assert.equal(quickSession.status, 200);
    const quickSessionBody = await quickSession.json();
    assert.equal(quickSessionBody.mode, "codely-official");
    assert.equal(quickSessionBody.user.name, "e2e-codely-user");
    assert.equal(quickSessionBody.capabilities.officialIdentity, true);
    assertNoSecrets(quickSessionBody, `${label}: quick local-session`);
    const quickCredits = await (await fetch(`${origin}/api/codely-generator/credit/my-credits`)).json();
    assert.equal(quickCredits.currentCredits, 1234);
    assert.equal(quickCredits.accountMode, "codely-official");
    const quickPaid = await (await fetch(`${origin}/api/codely-generator/credit/my-paid-status`)).json();
    assert.equal(quickPaid.paidType, "paid");
    assert.equal(quickPaid.productCode, "codely_pro");
    const canvasSession = await (await fetch(`${origin}/codely-canvas/api/local/session`)).json();
    assert.equal(canvasSession.mode, "local");
    assert.equal(canvasSession.official.mode, "codely-official");
    assert.equal(canvasSession.official.user.username, "e2e-codely-user");
    assert.deepEqual(canvasSession.official.points, { points: 500, total: 800 });
    assert.equal(canvasSession.official.tokens, undefined);
    assertNoSecrets(canvasSession, `${label}: canvas session overlay`);
    checks.push(`${label}: Quick adapter serves the official identity plus real credit/paid state server-side`);
    checks.push(`${label}: Canvas session carries the official identity and points overlay without any Canvas token`);

    const status = await rpc("codelyAccount/status");
    assert.equal(status.phase, "authenticated");
    assert.equal(status.plan.planType, "pro");
    assert.equal(status.usage.remainingPoints, "135");
    assertNoSecrets(status, `${label}: broker status`);
    checks.push(`${label}: full device login through the real host/core chain`);
    checks.push(`${label}: plan, usage and organization reads serve real fixture data through the original GUI RPCs`);
    return { events, stop, session };
  } catch (error) {
    stop();
    throw error;
  }
}

try {
  await startFixture();
  await launchShell("first launch");
  check("Real maintained Core registers the account broker at startup", true);
  if (browserEnabled) {
    await exerciseAccountBrowser({ root, run, frontend, origin, previousGeneration, fixturePort, state, rpc, poll, checks, assertNoSecrets });
    state.authorizeAfterPolls = 2;
  }
  await loginAndVerify("first run");

  // Logout clears everything; a new silent read falls back to the local identity.
  const logout = await rpc("logoutOfControlPlane");
  assert.equal(logout.status, "logged-out");
  await poll(async () => (await rpc("getControlPlaneSessionInfo", { silent: true, useOnboarding: false })).mode === "local", "logout resets to the local identity");
  assert.ok(fs.existsSync(path.join(run, "data", "codely-account", "logout.flag")));
  assert.ok(!fs.existsSync(path.join(run, "data", "codely-account", "session.enc")));
  const localAfterLogout = await (await fetch(`${origin}/api/codely-generator/local-session`)).json();
  assert.equal(localAfterLogout.mode, "gamecowork-local");
  const creditsAfterLogout = await fetch(`${origin}/api/codely-generator/credit/my-credits`);
  assert.equal(creditsAfterLogout.status, 503);
  const canvasAfterLogout = await (await fetch(`${origin}/codely-canvas/api/local/session`)).json();
  assert.equal(canvasAfterLogout.official, undefined);
  checks.push("Logout writes the tombstone marker, removes the sealed record and resets both site surfaces to local mode");

  // A second login persists; the restart must restore it through the DPAPI vault.
  const loginCallLog = officialCalls.map((call) => ({ method: call.method, path: call.path }));
  state.authorizeAfterPolls = 1;
  await loginAndVerify("second run");
  await stopShell();
  officialCalls.length = 0;
  await launchShell("restarted launch");
  const restoredStatus = await rpc("codelyAccount/status");
  assert.equal(restoredStatus.phase, "authenticated");
  assert.equal(restoredStatus.restored, true);
  const restoredSession = await rpc("getControlPlaneSessionInfo", { silent: true, useOnboarding: false });
  assert.equal(restoredSession.mode, "codely");
  assert.equal(restoredSession.account.label, "e2e-codely-user");
  assertNoSecrets(restoredSession, "restored session");
  checks.push("Restart restores the DPAPI-sealed session and marks it honestly as restored");

  const plan = await rpc("controlPlane/getUserPlan", { orgId: ORG.id });
  assert.equal(plan.planType, "pro");
  await stopShell();
  const networkRecords = guardRecords();
  assert.equal(actors.length, 2, "Both independent Core launches must be audited");
  for (const actor of actors) {
    const initialized = ownedCoreRecords(actor);
    assert.equal(initialized.length, 1, `${actor.label}: exactly one own Core guard initialized`);
    assert.equal(initialized[0].pid, actor.corePid, `${actor.label}: guard proof matches the actual Core PID`);
  }
  assert.equal(networkRecords.filter((record) => record.event === "blocked").length, 0,
    "No external network attempt occurred in the Core");
  checks.push("Core network guard saw zero external host attempts during the whole E2E");

  assertNoSecrets(loginCallLog, "fixture call log");
  check("Fixture served the exact audited official endpoints", loginCallLog.some((c) => c.path === "/auth/device/initiate")
    && loginCallLog.some((c) => c.path === "/auth/device/poll")
    && loginCallLog.some((c) => c.path === "/auth/device/exchange")
    && loginCallLog.some((c) => c.path === "/auth/external/me")
    && officialCalls.some((c) => c.path === "/api/user/plan"));

  const result = {
    generatedAt: new Date().toISOString(),
    packaged, browserEnabled, noEmail, defaultOrgPlanReads:state.defaultOrgPlanReads, previousGeneration, binary, core, frontend, runtime, guardRunId,
    checks,
    officialCallPaths: [...new Set(officialCalls.map((call) => `${call.method} ${call.path}`))],
    networkGuard: { initializedCorePids: actors.map((actor) => actor.corePid), blocked: 0 },
    actors,
    ownProcessesExited: actors.every((actor) => actor.exited && actor.gone),
  };
  fs.writeFileSync(path.join(run, "result.json"), JSON.stringify(result, null, 2));
  console.log(`Codely account login E2E passed: ${checks.length} checks\n${JSON.stringify(checks, null, 2)}\nReport: ${path.join(run, "result.json")}`);
} finally {
  await stopShell();
  fixtureServer?.close();
}
