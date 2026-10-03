// Actual maintained GUI -> Rust -> Core -> guarded compiled Agent -> private
// official proxy -> loopback fixture. No real account, key or quota is used.
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { randomUUID, createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { startMockProvider } from "../fixtures/mock-provider.mjs";
const project = fileURLToPath(new URL("../../", import.meta.url)), args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const temp = path.resolve(project, "../../temp/GameCowork"), run = path.resolve(option("--output", path.join(temp, "official-programming-" + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep)); fs.mkdirSync(run, { recursive: true });
const previous = args.includes("--previous"), packaged = args.includes("--packaged"), app = path.resolve(option("--app-root", path.join(project, "app")));
const binary = path.resolve(option("--binary", packaged ? path.join(app, "GameCowork.exe") : path.join(project, "src/shell/target/debug/GameCowork.exe")));
const coreDir = packaged ? path.join(app, "core") : path.join(project, "src/core/binary/out");
const frontend = packaged ? path.join(app, "frontend") : path.join(project, "src/frontend/bundle");
const agent = path.resolve(option("--agent", path.join(temp, "cli-official-programming-20261003/gamecowork.exe"))), agentSource = path.dirname(agent);
const manifest = JSON.parse(fs.readFileSync(path.join(agentSource, "cli-package-manifest.json"), "utf8"));
assert.equal(manifest.testGuardIncluded, true, "Only a guarded test Agent is allowed");
assert.equal(manifest.sourceSha256?.toLowerCase(), createHash("sha256").update(fs.readFileSync(path.join(project, "src/agent/cli-main.beautified.js"))).digest("hex"));
const workspace = path.join(run, "Owned Workspace"), fixtureFile = path.join(workspace, "fixture-note.txt");
fs.mkdirSync(path.join(workspace, ".gamecowork-cli"), { recursive: true });
fs.writeFileSync(path.join(workspace, ".gamecowork-cli/settings.json"), JSON.stringify({ disableNextSpeakerCheck: true }));
fs.writeFileSync(fixtureFile, "GCW_FIXTURE_FILE_CONTENT\nOfficial programming owned fixture\n");
const local = await startMockProvider({ model: "fixture-cpa", apiKey: "fixture-cpa-key", fixtureFile });
const official = await startMockProvider({ model: "fixture-official", apiKey: "fixture-official-cli-key", fixtureFile });
let keyCalls = 0, accountCalls = [], accountOrigin, shell, browser, page, gui, origin, shellLog = "";
const accountServer = http.createServer(async (req, res) => {
  let text = ""; for await (const bytes of req) text += bytes;
  const parsed = new URL(req.url, accountOrigin), send = payload => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(payload)); };
  accountCalls.push({ path: parsed.pathname, method: req.method });
  switch (parsed.pathname) {
    case "/auth/device/initiate": return send({ auth_request_token: "fixture-request", user_code: "TEST-CODE", verification_uri: accountOrigin + "/auth/device/verify", verification_uri_complete: accountOrigin + "/auth/device/verify?user_code=TEST-CODE", expires_in: 600, interval: 1 });
    case "/auth/device/poll": return send({ status: "authorized", authorization_code: "fixture-code" });
    case "/auth/device/exchange": return send({ access_token: "fixture-main-access", refresh_token: "fixture-main-refresh", token_type: "Bearer", expires_in: 3600 });
    case "/auth/external/me": return send({ id: 90001, username: "Fixture Pro Account" });
    case "/auth/refresh": return send({ access_token: "fixture-main-access", refresh_token: "fixture-main-refresh", expires_in: 3600 });
    case "/api/teams": return send({ teams: [{ team_id: "fixture-pro-team", team_name: "Fixture Pro", is_current: true, has_key: true }], current_team_id: "fixture-pro-team", multi_team_enabled: false });
    case "/api/api-token/cli-api-key":
      assert.equal(req.headers.authorization, "Bearer fixture-main-access"); assert.equal(parsed.searchParams.get("teamId"), "fixture-pro-team");
      keyCalls++; return send({ cli_api_key: official.apiKey, user_id: "fixture-cli-user", rpm: 20, tpm: 100000 });
    case "/api/user/plan": return send({ plan_type: "pro", is_active: true, has_seat: true });
    case "/api/user/usage/summary": return send({ remaining_points: "1000", is_exhausted: false, details: [] });
    case "/api/user/usage/exhaustion": return send({ is_exhausted: false });
    default: res.writeHead(404, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: "Owned fixture unsupported route" }));
  }
});
await new Promise(resolve => accountServer.listen(0, "127.0.0.1", resolve)); accountOrigin = `http://127.0.0.1:${accountServer.address().port}`;
const checks = [], errors = [], blocked = [];
async function poll(predicate, label, timeout = 30000) { const deadline = Date.now() + timeout; while (!await predicate()) { assert.ok(Date.now() < deadline, "Timed out: " + label); await new Promise(resolve => setTimeout(resolve, 100)); } }
function cleanEnvironment() { const env = { ...process.env }; for (const name of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|CODELY_|GAMECOWORK_)/.test(name) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(name) || name === "NODE_OPTIONS") delete env[name]; return env; }
async function rpc(kind, data = {}, workspaceKey) {
  if (kind.startsWith("codelyAccount/")) workspaceKey = "default";
  const response = await fetch(origin + "api/tauri/invoke", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageType: kind, messageId: randomUUID(), ...(workspaceKey ? { workspaceKey } : {}), data }) });
  assert.equal(response.status, 200); const frame = await response.json();
  assert.equal(frame.data?.status, "success", `${kind}: ${JSON.stringify(frame.data)}`); return frame.data.content;
}
async function state() { return gui.evaluate(async previous => {
  const { s } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js");
  const value = s.getState(), session = value.session.sessions[value.session.activeSessionId];
  return { workspaceKey: value.hub.activeWorkspaceKey, workspaces: value.hub.workspaces, streaming: session?.isStreaming,
    sessionId: value.session.activeSessionId, selected: value.config.config.selectedModelByRole?.chat?.title,
    models: value.config.config.modelsByRole?.chat?.map(model => ({ title: model.title, extras: model.extras })) || [] };
}, previous); }
function playwrightPath() { try { return createRequire(import.meta.url).resolve("playwright"); } catch {} const base = path.join(process.env.LOCALAPPDATA, "npm-cache/_npx"); return fs.readdirSync(base).map(name => path.join(base, name, "node_modules/playwright/index.mjs")).filter(fs.existsSync).sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]; }
function chromiumPath() { const base = path.join(process.env.LOCALAPPDATA, "ms-playwright"); for (const folder of fs.readdirSync(base).filter(name => /^chromium-\d+$/.test(name)).sort((a,b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))) for (const file of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe"]) if (fs.existsSync(path.join(base, folder, file))) return path.join(base, folder, file); }
async function choose(title) { await gui.locator('[data-telemetry-id="model_select"]').first().click(); await gui.getByText(title, { exact: true }).last().click(); await poll(async () => (await state()).selected === title, "selected " + title); }
async function prompt(text, expected, provider) {
  const count = provider.requests.length;
  await gui.locator('[contenteditable="true"]').first().fill(text); await gui.locator('[data-telemetry-id="send_message"]').first().click();
  await poll(() => provider.requests.length > count, "Agent reaches selected provider");
  if (expected) { await gui.getByText(expected, { exact: false }).last().waitFor({ state: "visible", timeout: 30000 }); await poll(async () => !(await state()).streaming, "complete actual GUI stream"); }
}
try {
  shell = spawn(binary, [], { cwd: run, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: {
    ...cleanEnvironment(), GAMECOWORK_APP_ROOT: run, GAMECOWORK_CORE_DIR: coreDir, GAMECOWORK_CORE_ENTRY: path.join(coreDir, "index.js"), GAMECOWORK_FRONTEND_DIR: frontend,
    GAMECOWORK_DATA_DIR: path.join(run, "data"), GAMECOWORK_AGENT_PATH: agent, GAMECOWORK_AGENT_RESOURCE_DIR: path.join(agentSource, "resources"),
    GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_DISABLE_AUTO_UPDATE: "1", GAMECOWORK_PICK_FOLDER: workspace,
    GAMECOWORK_CODELY_ACCOUNT_BASE_URL: accountOrigin, GAMECOWORK_CODELY_INFERENCE_BASE_URL: official.baseUrl,
    GAMECOWORK_CHAT_ROOT: run, GAMECOWORK_CHAT_CORE: packaged ? coreDir : path.join(project, "src/core"), GAMECOWORK_CHAT_AGENT: agent,
    GAMECOWORK_CLI_PROBE_ROOT: run, GAMECOWORK_CLI_PROBE_SOURCE: agentSource, CUSTOM_AUTH: "1",
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: path.join(run, "bun-cache"), NODE_OPTIONS: "--require " + JSON.stringify(path.join(project, "tests/fixtures/chat-core-guard.cjs")),
  } });
  const consume = bytes => { shellLog += bytes.toString(); const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/); if (match) origin = match[1]; };
  shell.stdout.on("data", consume); shell.stderr.on("data", consume);
  await poll(() => origin, "actual shell startup", 60000);
  const { chromium } = await import(pathToFileURL(playwrightPath()).href);
  browser = await chromium.launchPersistentContext(path.join(run, "chromium"), { headless: true, executablePath: chromiumPath(), locale: "zh-CN", viewport: { width: 1500, height: 1000 }, serviceWorkers: "block" });
  await browser.route("**/*", route => { const url = new URL(route.request().url()); if (url.hostname === "127.0.0.1" || ["data:", "blob:"].includes(url.protocol)) return route.continue(); blocked.push(url.origin); return route.abort("blockedbyclient"); });
  if (previous) await browser.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontend, "gui.html"), "utf8").replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await browser.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ""; });
  page = browser.pages()[0]; page.on("pageerror", error => errors.push(String(error)));
  await page.goto(origin, { waitUntil: "domcontentloaded" }); await poll(() => page.frames().some(frame => frame.url().includes("/gui.html")), "actual GUI"); gui = page.frames().find(frame => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 3500 }).catch(() => {}); for (let n=0;n<4&&await next.count()&&await next.first().isVisible();n++) await next.first().click();
  await gui.getByRole("button", { name: /^(打开工作区|Open Workspace)$/ }).last().click(); await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();
  await poll(async () => (await state()).workspaces.some(entry => path.resolve(entry.workspaceDir).toLowerCase() === workspace.toLowerCase()), "own workspace registered");
  await gui.locator('[data-telemetry-id="open_settings"]').first().click(); await gui.locator('[data-telemetry-id="settings_nav_models"]').click();
  await gui.locator('[data-telemetry-id="add_model_provider"]').click(); await gui.getByLabel(/^(服务提供方名称|Provider Name)$/).fill("Fixture CPA"); await gui.getByLabel(/^(基础 URL|Base URL)$/).fill(local.baseUrl); await gui.getByLabel(/^(API 密钥|API Key)$/).fill(local.apiKey); await gui.locator('[data-telemetry-id="submit_provider_form"]').click();
  await gui.getByText("Fixture CPA", { exact: true }).first().waitFor({ state: "visible" });
  await gui.locator('[data-telemetry-id="add_model_profile"]').click(); await gui.getByLabel(/^(模型名称|Model Name)$/).fill(local.model); await gui.getByLabel(/^(显示名称|Display Name)$/).fill("Fixture CPA Model"); await gui.locator('[data-telemetry-id="submit_model_form"]').click();
  await gui.getByText("Fixture CPA Model", { exact: true }).first().waitFor({ state: "visible" });
  for (let n=0;n<2;n++) { await gui.locator('[data-telemetry-id="settings_select"]').nth(n).click(); await gui.locator('[data-telemetry-id="settings_select_option"]').filter({ hasText: "Fixture CPA Model" }).click(); }
  await gui.locator('[data-telemetry-id="settings_back"]').click(); await choose("Fixture CPA Model");
  await prompt("GCW_E2E_A fixture CPA baseline. Reply directly.", "GCW_REPLY_A_COMPLETE", local); checks.push("CPA fixture replies through original model selection before official enable");
  const workspaceSettings = path.join(workspace, ".gamecowork-cli/settings.json"), settingsBefore = fs.readFileSync(workspaceSettings);
  await rpc("getControlPlaneSessionInfo", { silent: false, useOnboarding: false }); await poll(async () => (await rpc("codelyAccount/status")).phase === "authenticated", "loopback official device flow");
  assert.equal(keyCalls, 0); checks.push("Official login and Pro display do not fetch a CLI inference key");
  await gui.locator('[data-telemetry-id="model_select"]').first().click(); await gui.getByText("启用 Codely 官方 · Pro 模型", { exact: true }).click();
  const title = "fixture-official · Codely 官方 · Pro";
  await poll(async () => (await state()).models.some(model => model.title === title && model.extras.officialModelId), "real official directory in original selector");
  assert.equal(keyCalls, 1); assert.ok((await state()).models.some(model => model.title === "Fixture CPA Model"));
  await choose(title); await prompt(`GCW_E2E_READ_FILE use read_file to read ${fixtureFile}, then confirm the real result.`, "GCW_TOOL_READ_CONFIRMED", official);
  assert.ok(official.requests.some(entry => entry.requestedReadTool)); assert.ok(official.requests.some(entry => entry.readToolResultContainsFixture && entry.completed));
  assert.deepEqual(JSON.parse(fs.readFileSync(workspaceSettings, "utf8")), JSON.parse(settingsBefore.toString("utf8"))); checks.push("Explicit enable loads real directory; selected official model streams tool calls and final output while preserving CPA project settings");
  await choose("Fixture CPA Model"); await prompt("GCW_E2E_B return to CPA fixture.", "GCW_REPLY_B_COMPLETE", local); checks.push("Switching back to CPA restores the original Provider and real output");
  await choose(title); await prompt("GCW_E2E_SLOW slow official cancellation fixture.", null, official); await gui.getByText("GCW_SLOW_STARTED", { exact: false }).last().waitFor({ state: "visible" });
  await rpc("logoutOfControlPlane"); await poll(() => official.requests.some(entry => entry.scenario === "slow" && entry.aborted), "logout cancels active upstream request"); await poll(async () => !(await state()).streaming, "GUI clears interrupted official stream");
  assert.equal((await rpc("codelyOfficial/status", {}, (await state()).workspaceKey)).enabled, false); checks.push("Logout immediately aborts the actual official upstream and revokes programming capability");
  assert.ok(!JSON.stringify(await state()).includes(official.apiKey)); assert.ok(!shellLog.includes(official.apiKey));
  assert.equal(blocked.length, 0); assert.equal(errors.length, 0, errors.join("\n"));
  await page.screenshot({ path: path.join(run, "official-programming-complete.png"), fullPage: true });
  fs.writeFileSync(path.join(run, "result.json"), JSON.stringify({ passed: true, previous, checks, keyCalls, officialRequests: official.requests, localRequests: local.requests, accountCalls }, null, 2));
  console.log(JSON.stringify({ passed: true, previous, output: run, checks }, null, 2));
} catch (error) {
  fs.writeFileSync(path.join(run, "failure.txt"), String(error.stack || error) + "\n" + shellLog);
  if (page) await page.screenshot({ path: path.join(run, "failure.png"), fullPage: true }).catch(() => {});
  throw error;
} finally {
  await browser?.close(); if (shell && shell.exitCode === null) { const exit = new Promise(resolve => shell.once("exit", resolve)); shell.kill(); await exit; }
  await official.close(); await local.close(); accountServer.closeAllConnections(); await new Promise(resolve => accountServer.close(resolve));
}
