// Real GUI -> Rust -> restored core -> guarded own compiled CLI -> loopback mock.
// No fake core, real provider/account, editor or existing user state is used.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { randomUUID, createHash } from "node:crypto";
import { startMockProvider } from "../fixtures/mock-provider.mjs";
import { createOwnedToolFixture } from "../fixtures/owned-tool-fixture.mjs";

const project = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const base = path.resolve(project, "../../temp/GameCowork");
const root = path.resolve(option("--output", path.join(base, "agent-actions-e2e-" + randomUUID())));
assert.ok(root.toLowerCase().startsWith(base.toLowerCase() + path.sep), "Chat fixtures must stay under temp/GameCowork");
const packaged = args.includes("--packaged");
const app = path.join(project, "app");
const binary = path.resolve(option("--binary", packaged ? path.join(app, "GameCowork.exe") : path.join(project, "src/shell/target/debug/GameCowork.exe")));
const agent = path.resolve(option("--agent", path.join(base, "cli-guarded-20261001-12/gamecowork.exe")));
const agentSource = path.dirname(agent);
const agentResources = path.resolve(option("--resources", path.join(agentSource, "resources")));
const manifest = JSON.parse(fs.readFileSync(path.join(agentSource, "cli-package-manifest.json"), "utf8"));
assert.equal(manifest.testGuardIncluded, true, "Chat E2E requires a guarded compiled test CLI, never an unguarded product artifact");
const sourceSha256 = createHash("sha256").update(fs.readFileSync(path.join(project, "src/agent/cli-main.beautified.js"))).digest("hex");
assert.equal(manifest.sourceSha256?.toLowerCase(), sourceSha256, "The guarded Agent must match the maintained CLI source");
let packagedAgentSourceVerified = false;
if (packaged) {
  const normal = JSON.parse(fs.readFileSync(path.join(app, "cli/cli-package-manifest.json"), "utf8"));
  assert.equal(normal.testGuardIncluded, false, "The assembled product must contain a normal Agent, never a test guard");
  assert.equal(normal.sourceSha256?.toLowerCase(), manifest.sourceSha256.toLowerCase(), "The assembled normal Agent and guarded test Agent must share their source SHA");
  assert.equal(normal.executableSha256?.toLowerCase(), createHash("sha256").update(fs.readFileSync(path.join(app, "cli/gamecowork.exe"))).digest("hex"));
  packagedAgentSourceVerified = true;
}
const frontendDir = packaged ? path.join(app, "frontend") : path.join(project, "src/frontend/bundle");
const coreContainer = packaged ? path.join(app, "core") : path.join(project, "src/core");
const coreDir = packaged ? coreContainer : path.join(coreContainer, "binary/out");
assert.ok(fs.existsSync(path.join(coreDir, "build/Release/node_sqlite3.node")), "Prepare the real core native SQLite binding before chat E2E");
const workspaces = { a: path.join(root, "Workspace A"), b: path.join(root, "Workspace B") };
for (const directory of [root, ...Object.values(workspaces)]) fs.mkdirSync(directory, { recursive: true });
for (const workspace of Object.values(workspaces)) {
  fs.mkdirSync(path.join(workspace, ".gamecowork-cli"));
  // This controls fixture pacing, not provider/auth/model selection. W9e later
  // writes the actual UI-selected model/credentials into its normal contract.
  fs.writeFileSync(path.join(workspace, ".gamecowork-cli/settings.json"), JSON.stringify({ disableNextSpeakerCheck: true }));
}
// All tool arguments are owned paths/scripts, verified against actual disk and
// the real tool-result ID. The Provider cannot fake execution by returning text.
const fileFor = name => path.join(workspaces.a, name + ".txt");
const targets = { write: fileFor("approved"), rejected: fileFor("rejected"), cancelled: fileFor("cancelled"), closed: fileFor("closed") };
const written = "GCW_UI_APPROVED_WRITE\n";
const replaced = "GCW_UI_APPROVED_REPLACE\n";
const denied = text => /cancel|reject|deni|declin|not.*execut/i.test(text);
const commands = createOwnedToolFixture(root, workspaces.a);
const commandFor = name => commands.scripts.find(script => script.name === name).command;
const toolPlans = {
  GCW_UI_WRITE_REJECT: { toolName: "write_file", arguments: { file_path: targets.rejected, content: "MUST_NOT_WRITE" }, verify: text => !fs.existsSync(targets.rejected) && denied(text) },
  GCW_UI_WRITE_ALLOW: { toolName: "write_file", arguments: { file_path: targets.write, content: written }, verify: text => fs.existsSync(targets.write) && fs.readFileSync(targets.write, "utf8") === written && /success|wrote|written/i.test(text) },
  GCW_UI_REPLACE_ALLOW: { steps: [
    { toolName: "read_file", arguments: { absolute_path: targets.write }, verify: text => fs.readFileSync(targets.write,"utf8") === written && text.includes(written.trim()) },
    { toolName: "replace", arguments: { file_path: targets.write, old_string: written, new_string: replaced }, verify: text => fs.readFileSync(targets.write, "utf8") === replaced && /success|replaced|modified|edit/i.test(text) },
  ] },
  GCW_UI_WRITE_CANCEL: { toolName: "write_file", arguments: { file_path: targets.cancelled, content: "MUST_NOT_WRITE" }, verify: () => false },
  GCW_UI_WRITE_CLOSE: { toolName: "write_file", arguments: { file_path: targets.closed, content: "MUST_NOT_WRITE" }, verify: () => false },
  GCW_UI_COMMAND_REJECT: { toolName: "run_shell_command", arguments: { command: commandFor("reject"), directory: workspaces.a }, verify: text => !fs.existsSync(commands.outputs.reject) && denied(text) },
  GCW_UI_COMMAND_ALLOW: { toolName: "run_shell_command", arguments: { command: commandFor("success"), directory: workspaces.a }, verify: text => fs.existsSync(commands.outputs.success) && fs.readFileSync(commands.outputs.success,"utf8") === "GCW_COMMAND_SUCCESS" && /Exit Code: 0/.test(text) && text.includes("GCW_COMMAND_STDOUT_0") && text.includes("GCW_COMMAND_STDERR_0") },
  GCW_UI_COMMAND_FAILURE: { toolName: "run_shell_command", arguments: { command: commandFor("failure"), directory: workspaces.a }, verify: text => fs.existsSync(commands.outputs.failure) && /Exit Code: 7/.test(text) && text.includes("GCW_COMMAND_STDOUT_7") },
  GCW_UI_COMMAND_CANCEL: { toolName: "run_shell_command", arguments: { command: commandFor("slow"), directory: workspaces.a }, verify: () => false },
};
const actionResultEvidence = [];
for (const [marker, plan] of Object.entries(toolPlans)) {
  for (const step of plan.steps || [plan]) {
  const verify = step.verify;
  step.verify = (text) => {
    // Only controlled fixture tools can reach this callback; no provider keys or
    // existing user files are included. Preserve bounded real error/exit evidence.
    actionResultEvidence.push({ marker, toolName: step.toolName, text: String(text).slice(0, 4000) });
    return verify(text);
  };
  }
}
const mock = await startMockProvider({ toolPlans, chunkDelayMs: 150 });
const checks = [];
const browserErrors = [];
const blocked = [];
const rpcObserved = [];
const rpcErrors = [];
const fileRequests = [];
function guardNetworkAttempts() {
  const result = [];
  for (const [owner, file] of [["core", "core-guard-events.jsonl"], ["agent", "guard-events.jsonl"]]) {
    const target = path.join(root, file);
    if (!fs.existsSync(target)) continue;
    for (const line of fs.readFileSync(target, "utf8").split(/\r?\n/).filter(Boolean)) {
      const event = JSON.parse(line);
      if (/^(external-|fetch$|node:http\.|node:https\.|net\.)/.test(event.operation || ""))
        result.push({ owner, operation: event.operation, host: event.host || event.targetHint });
    }
  }
  return result;
}
let shell;
let context;
let page;
let gui;
let origin;
let shellLog = "";
const samePath = (a, b) => String(a || "").replaceAll("\\", "/").toLowerCase() === String(b || "").replaceAll("\\", "/").toLowerCase();
function cleanEnvironment() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key) || key === "NODE_OPTIONS") delete env[key];
  return env;
}
async function launch() {
  const env = { ...cleanEnvironment(),
    GAMECOWORK_APP_ROOT: root,
    GAMECOWORK_FRONTEND_DIR: frontendDir,
    GAMECOWORK_CORE_DIR: coreDir,
    GAMECOWORK_CORE_ENTRY: path.join(coreDir, "index.js"),
    GAMECOWORK_DATA_DIR: path.join(root, "data"),
    GAMECOWORK_AGENT_PATH: agent,
    GAMECOWORK_AGENT_RESOURCE_DIR: agentResources,
    GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_PICK_FOLDER: workspaces.a,
    GAMECOWORK_CHAT_ROOT: root,
    GAMECOWORK_CHAT_CORE: coreContainer,
    GAMECOWORK_CHAT_AGENT: agent,
    GAMECOWORK_CLI_PROBE_ROOT: root,
    GAMECOWORK_CLI_PROBE_SOURCE: agentSource,
    CUSTOM_AUTH: "1",
    GAMECOWORK_CLI_TOOL_CAPS: JSON.stringify(commands),
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: path.join(root, "bun-cache"),
    NODE_OPTIONS: "--require " + JSON.stringify(path.join(project, "tests/fixtures/chat-core-guard.cjs")),
  };
  shell = spawn(binary, [], { cwd: root, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  return new Promise((resolve, reject) => {
    let thisLog = "";
    const timer = setTimeout(() => reject(new Error("Real core host startup timeout\n" + thisLog.slice(-5000))), 60000);
    const consume = (bytes) => {
      thisLog += bytes.toString(); shellLog += bytes.toString();
      const match = thisLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    };
    shell.stdout.on("data", consume); shell.stderr.on("data", consume);
    shell.once("error", (error) => { clearTimeout(timer); reject(error); });
    shell.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Real host exited ${code}\n${thisLog.slice(-5000)}`)); });
  });
}
async function stopShell() {
  if (!shell || shell.exitCode !== null) return;
  const exited = new Promise((resolve) => shell.once("exit", resolve));
  shell.kill();
  await exited;
}
async function poll(callback, description, timeout = 30000) {
  const end = Date.now() + timeout;
  while (!await callback()) {
    assert.ok(Date.now() < end, "Timed out waiting for " + description);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
function playwrightModule() {
  const explicit = option("--playwright", process.env.GAMECOWORK_E2E_PLAYWRIGHT);
  if (explicit) return path.resolve(explicit);
  try { return createRequire(import.meta.url).resolve("playwright"); } catch {}
  const cache = path.join(process.env.LOCALAPPDATA, "npm-cache/_npx");
  const candidates = fs.readdirSync(cache).map((name) => path.join(cache, name, "node_modules/playwright/index.mjs"))
    .filter((file) => fs.existsSync(file)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  assert.ok(candidates.length, "A local Playwright library is required");
  return candidates[0];
}
function chromeBinary() {
  const explicit = option("--chrome", process.env.GAMECOWORK_E2E_CHROME);
  if (explicit) return path.resolve(explicit);
  const cache = path.join(process.env.LOCALAPPDATA, "ms-playwright");
  for (const folder of fs.readdirSync(cache).filter((name) => /^chromium-\d+$/.test(name)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))) {
    for (const file of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe"]) if (fs.existsSync(path.join(cache, folder, file))) return path.join(cache, folder, file);
  }
}
async function startBrowser(profile) {
  const { chromium } = await import(pathToFileURL(playwrightModule()).href);
  context = await chromium.launchPersistentContext(path.join(root, profile), { headless: true, executablePath: chromeBinary(),
    viewport: { width: 1440, height: 960 }, locale: "zh-CN", colorScheme: "dark", serviceWorkers: "block" });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || ["data:", "blob:"].includes(url.protocol)) return route.continue();
    blocked.push(url.origin); return route.abort("blockedbyclient");
  });
  await context.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ""; });
  page = context.pages()[0] || await context.newPage();
  page.on("pageerror", (error) => browserErrors.push(error.stack || String(error)));
  page.on("request", (request) => {
    if (!request.url().includes("/api/tauri/invoke")) return;
    try {
      const body = request.postDataJSON(); const message = body.message || body;
      const file = message.data?.filepath || message.data?.filePath || message.data?.dir;
      let pathHint = typeof file === "string" ? file : undefined;
      for (const key of ["USERPROFILE", "APPDATA", "LOCALAPPDATA"]) if (pathHint && process.env[key])
        pathHint = pathHint.replaceAll(process.env[key], `<${key.toLowerCase()}>`).replaceAll(process.env[key].replaceAll("\\", "/"), `<${key.toLowerCase()}>`);
      rpcObserved.push({ type: message.messageType, method: message.data?.method, workspaceKey: body.workspaceKey || message.workspaceKey,
        ...(pathHint ? { pathHint } : {}), outcome: message.data?.outcome,
        ...(["config/updateSelectMode", "llm/streamChat"].includes(message.messageType)
          ? { approvalMode: message.data?.approvalMode, collaborationMode: message.data?.collaborationMode,
            continueSessionId: message.data?.continueSessionId } : {}) });
    } catch {}
  });
  page.on("response", async (response) => {
    if (response.url().includes("/api/tauri/file-explorer") || response.url().includes("/api/tauri/file-changes/undo")) {
      if (!response.url().includes("/events") && response.request().method() === "POST") {
        try {
          const request = response.request().postDataJSON();
          const result = await response.json();
          fileRequests.push({ mode: request.mode || "undo", expectedSha256: request.expectedSha256,
            status: response.status(), ok: result.ok, applied: result.applied, changeId: result.changeId,
            error: result.error, code: result.code });
        } catch {}
      }
    }
    if (!response.url().includes("/api/tauri/invoke")) return;
    try {
      const body = response.request().postDataJSON(); const request = body.message || body;
      const frame = await response.json();
      const error = frame?.data?.status === "error" ? frame.data.error : frame?.data?.content?.error;
      if (error) rpcErrors.push({ type: request.messageType, error: String(error).slice(0, 400),
        pathHint: rpcObserved.findLast((entry) => entry.type === request.messageType && entry.pathHint)?.pathHint });
    } catch {}
  });
  await page.goto(origin, { waitUntil: "domcontentloaded" });
  await poll(() => page.frames().some((frame) => frame.url().includes("/gui.html")), "real GUI frame");
  gui = page.frames().find((frame) => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  for (let step = 0; step < 4 && await next.count() && await next.first().isVisible(); step++) { await next.first().click(); await snapshot(`onboarding-${profile}-${step}`); }
}
async function snapshot(name) {
  fs.writeFileSync(path.join(root, name + ".aria.txt"), await gui.locator("body").ariaSnapshot());
  await page.screenshot({ path: path.join(root, name + ".png"), fullPage: true, animations: "disabled" });
}
async function state() {
  return gui.evaluate(async () => {
    const { s: store } = await import("/assets/store-c6kNGz30.js");
    const value = store.getState();
    const session = value.session.sessions[value.session.activeSessionId];
    function text(content) { return typeof content === "string" ? content : Array.isArray(content) ? content.map((item) => item.text || "").join("") : ""; }
    return { activeWorkspaceKey: value.hub.activeWorkspaceKey, workspaces: value.hub.workspaces,
      sessionId: value.session.activeSessionId, isStreaming: session?.isStreaming,
      modelTitle: value.config.config.selectedModelByRole?.chat?.title,
      models: (value.config.config.modelsByRole?.chat || []).map((model) => model.title),
      historyText: (session?.history || []).map((entry) => text(entry.message?.content)).join("\n"),
      sessionSettings: value.session.sessionSettingsById?.[value.session.activeSessionId],
      approvalMode: session?.approvalMode, collaborationMode: session?.collaborationMode,
      pending: Object.values(value.session.sessions).map(item => ({ id:item.id, workspaceId:item.workspaceId, isStreaming:item.isStreaming, permissions:item.pendingAcpPermissionRequests?.length || 0, shell:item.pendingAcpShellConfirmationRequests?.length || 0 })),
    };
  });
}
async function openWorkspaceUI(directory, label) {
  await context.route(/\/api\/tauri\/pick-folder(?:-modal)?$/, (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ path: directory, cancelled: false }) }), { times: 1 });
  await gui.getByRole("button", { name: /^(打开工作区|Open Workspace)$/ }).last().click();
  await snapshot("open-workspace-menu-" + label);
  await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();
  await poll(async () => (await state()).workspaces.some((workspace) => samePath(workspace.workspaceDir, directory)), "opened workspace " + label);
}
async function configureProviderUI() {
  await gui.locator('[data-telemetry-id="open_settings"]').first().click();
  await gui.locator('[data-telemetry-id="settings_nav_models"]').click();
  await snapshot("01-model-settings");
  await gui.locator('[data-telemetry-id="add_model_provider"]').click();
  await gui.getByLabel(/^(服务提供方名称|Provider Name)$/).fill("Fixture Local Provider");
  await gui.getByLabel(/^(基础 URL|Base URL)$/).fill(mock.baseUrl);
  await gui.getByLabel(/^(API 密钥|API Key)$/).fill(mock.apiKey);
  await gui.locator('[data-telemetry-id="submit_provider_form"]').click();
  await gui.getByText("Fixture Local Provider", { exact: true }).first().waitFor({ state: "visible", timeout: 30000 });
  await snapshot("02-provider-created");
  await gui.locator('[data-telemetry-id="add_model_profile"]').click();
  await gui.getByLabel(/^(模型名称|Model Name)$/).fill(mock.model);
  await gui.getByLabel(/^(显示名称|Display Name)$/).fill("Fixture Local Model");
  await gui.locator('[data-telemetry-id="submit_model_form"]').click();
  await gui.getByText("Fixture Local Model", { exact: true }).first().waitFor({ state: "visible", timeout: 30000 });
  // Both supporting slots use the same owned fixture model, rather than falling
  // back to original cloud models during Agent bookkeeping.
  for (let slot = 0; slot < 2; slot++) {
    await gui.locator('[data-telemetry-id="settings_select"]').nth(slot).click();
    await gui.locator('[data-telemetry-id="settings_select_option"]').filter({ hasText: "Fixture Local Model" }).click();
  }
  await snapshot("03-model-created");
  assert.ok(rpcObserved.some((call) => call.type === "acp/modelProfiles" && call.method === "addProvider"));
  assert.ok(rpcObserved.some((call) => call.type === "acp/modelProfiles" && call.method === "add"));
  checks.push("Real UI creates a local Provider and chat/flash/multimodal model profile");
  await gui.locator('[data-telemetry-id="settings_back"]').click();
}
async function selectModelUI() {
  await poll(async () => (await state()).models.includes("Fixture Local Model"), "owned model in serialized real core config");
  await gui.locator('[data-telemetry-id="model_select"]').first().click();
  await gui.getByText("Fixture Local Model", { exact: true }).last().click();
  await poll(async () => (await state()).modelTitle === "Fixture Local Model", "selected local model");
}
async function prompt(text, expected, name) {
  const requestsBefore = mock.requests.filter((item) => item.url === "/v1/chat/completions").length;
  await gui.locator('[contenteditable="true"]').first().fill(text);
  await gui.locator('[data-telemetry-id="send_message"]').first().click();
  await poll(() => mock.requests.filter((item) => item.url === "/v1/chat/completions").length > requestsBefore, "actual compiled CLI provider request", 30000);
  if (expected) {
    await gui.getByText(expected, { exact: false }).last().waitFor({ state: "visible", timeout: 30000 });
    await poll(async () => !(await state()).isStreaming, "real stream final frame");
    await snapshot(name);
  }
}
async function manualMode() {
  await gui.locator('[data-telemetry-id="approval_select"]').click();
  await gui.locator('[data-approval-mode="default"]').click();
  await poll(async () => (await state()).approvalMode === "default", "UI every-action confirmation mode");
  await poll(() => rpcObserved.some(call => call.type === "config/updateSelectMode"), "actual persisted mode request");
}
async function actionPrompt(marker) {
  await prompt(marker + ": perform exactly the planned owned tool action.");
  await gui.locator(".tool-permission-toolbar").first().waitFor({ state: "visible", timeout: 30000 });
  await snapshot("permission-" + marker.toLowerCase());
}
async function choosePermission(kind) {
  const option = gui.locator('[data-permission-option-kind="' + kind + '"]').first();
  const id = await option.getAttribute("data-permission-option-id");
  assert.ok(id, "Selection uses the real option ID, not its numeric index or kind");
  await option.click();
  return id;
}
async function actionDone(marker, name) {
  const terminalResult = item => item.scenario === marker && item.toolResultMatchedIssuedId &&
    (!toolPlans[marker]?.steps || item.stepResultVerified === false || item.verifiedStepCount >= toolPlans[marker].steps.length);
  await poll(() => mock.requests.some(terminalResult), "real action tool-result turn");
  const verified = mock.requests.findLast(terminalResult);
  assert.ok(verified.toolResultVerified, actionResultEvidence.findLast(item => item.marker === marker)?.text || "Actual action was not verified");
  await gui.getByText(marker + "_CONFIRMED", { exact:false }).last().waitFor({ state:"visible", timeout:30000 });
  await poll(async () => !(await state()).isStreaming, "real action stream finished");
  assert.ok(mock.requests.some(item => item.scenario === marker && item.toolResultMatchedIssuedId && item.toolResultVerified), "Actual issued tool result and disk/exit verification are required");
  await snapshot(name);
}
async function cancelUI() {
  const stop = gui.locator('[data-telemetry-id="stop_generation"]').first();
  if (await stop.isVisible()) await stop.click();
  else await gui.locator(".tool-permission-toolbar-skip-pill").click();
  await poll(async () => !(await state()).isStreaming, "cancel ends the actual GUI stream");
  await poll(async () => (await state()).pending.every(item => !item.permissions && !item.shell), "cancel clears pending UI approvals");
}
async function historyList() {
  const current = await state();
  const result = await fetch(new URL("/api/tauri/invoke", origin), { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageType: "history/list", messageId: "actions-history-" + randomUUID(), workspaceKey: current.activeWorkspaceKey, data: {} }) }).then(response => response.json());
  assert.equal(result.data.status, "success");
  return result.data.content;
}
async function historyRowMenu(title) {
  const row = gui.locator('[data-telemetry-id="history_session"]').filter({ hasText: title }).first();
  await row.hover();
  await row.locator('[data-telemetry-id="history_session_menu"]').click();
}
async function renameSessionUI(oldTitle, title) {
  await historyRowMenu(oldTitle);
  await gui.locator('[data-telemetry-id="history_rename"]').click();
  await gui.getByRole("textbox").last().fill(title);
  await gui.getByTestId("gamecowork-session-rename-save").click();
}
async function sessionCrudUI(sessionId) {
  const original = (await historyList()).find(item => item.sessionId === sessionId || item.id === sessionId);
  assert.ok(original);
  const renamed = "GCW_UI_SESSION_RENAMED";
  await renameSessionUI(original.title, renamed);
  await poll(async () => (await historyList()).some(item => (item.sessionId || item.id) === sessionId && item.title === renamed), "actual Core history title changed");
  await gui.getByTestId("gamecowork-session-rename-save").waitFor({ state:"hidden" });
  checks.push("UI rename changes the actual server history row");
  await snapshot("14-renamed-session");
  let failRename = true;
  let failDelete = true;
  await context.route(/\/api\/tauri\/invoke$/, async route => {
    const body = route.request().postDataJSON(); const message = body.message || body;
    if (failRename && message.messageType === "history/renameTitle" && message.data?.title === "GCW_UI_RENAME_MUST_FAIL") {
      failRename = false;
      return route.fulfill({ contentType:"application/json", body:JSON.stringify({ messageId:message.messageId, messageType:message.messageType,
        data:{done:true,status:"error",error:"Owned injected rename failure"} }) });
    }
    if (failDelete && message.messageType === "history/delete" && message.data?.id === sessionId) {
      failDelete = false;
      return route.fulfill({ contentType:"application/json", body:JSON.stringify({ messageId:message.messageId,messageType:message.messageType,
        data:{done:true,status:"error",error:"Owned injected delete failure"} }) });
    }
    return route.fallback();
  });
  await renameSessionUI(renamed,"GCW_UI_RENAME_MUST_FAIL");
  await gui.getByTestId("gamecowork-session-rename-error").waitFor({ state:"visible" });
  assert.ok((await historyList()).some(item => (item.sessionId || item.id) === sessionId && item.title === renamed));
  assert.equal(await gui.getByTestId("gamecowork-session-rename-save").isVisible(),true);
  checks.push("A failed rename keeps the original actual row and editable dialog instead of claiming success");
  await snapshot("15-rename-failure-kept-dialog");
  await gui.getByRole("button", {name:/^(取消|Cancel)$/}).last().click();
  await historyRowMenu(renamed); await gui.locator('[data-telemetry-id="history_delete"]').click();
  await gui.getByRole("button",{name:/^(删除|Delete)$/}).last().click();
  await gui.getByText("Owned injected delete failure",{exact:false}).last().waitFor({state:"visible"});
  assert.ok((await historyList()).some(item => (item.sessionId || item.id) === sessionId));
  assert.equal((await state()).sessionId,sessionId);
  checks.push("A failed delete preserves the actual row/current conversation and shows a visible failure");
  await snapshot("15b-delete-failure-restored-row");
  await context.close(); context=undefined; await stopShell(); origin=await launch(); await startBrowser("profile-restart");
  await gui.getByRole("button",{name:"Workspace B",exact:true}).first().click();
  await gui.getByText(renamed,{exact:true}).first().click();
  await gui.getByText("GCW_REPLY_B_COMPLETE",{exact:false}).last().waitFor({state:"visible"});
  assert.ok((await historyList()).some(item => (item.sessionId || item.id) === sessionId && item.title === renamed));
  checks.push("Fresh browser and restarted Core recover the renamed session and actual transcript");
  await snapshot("16-restart-renamed-session");
  await historyRowMenu(renamed); await gui.locator('[data-telemetry-id="history_delete"]').click();
  await snapshot("delete-session-confirmation");
  await gui.getByRole("button",{name:/^(删除|Delete)$/}).last().click();
  await poll(async () => !(await historyList()).some(item => (item.sessionId || item.id) === sessionId),"actual history deletion");
  await poll(async () => (await state()).sessionId !== sessionId,"deleted active session is replaced");
  assert.equal(await gui.getByText(renamed,{exact:true}).count(),0);
  checks.push("UI delete removes the actual history row and does not retain the deleted active session");
  await snapshot("17-deleted-session");
}
let failure;
try {
  origin = await launch();
  await startBrowser("profile-first");
  await openWorkspaceUI(workspaces.a,"A");
  await configureProviderUI();
  await selectModelUI();
  if (option("--until") === "history") {
    await openWorkspaceUI(workspaces.b,"B"); await selectModelUI();
    await prompt("GCW_E2E_B: session CRUD fixture.","GCW_REPLY_B_COMPLETE","history-fixture-created");
    await sessionCrudUI((await state()).sessionId);
  } else {
  await manualMode();
  await actionPrompt("GCW_UI_WRITE_REJECT");
  const rejectId = await choosePermission("reject_once");
  assert.equal(rejectId,"cancel");
  await actionDone("GCW_UI_WRITE_REJECT","04-rejected-write");
  assert.equal(fs.existsSync(targets.rejected),false);
  checks.push("Actual UI rejection returns selected cancel and never creates the requested file");
  await actionPrompt("GCW_UI_WRITE_ALLOW");
  assert.ok((await gui.locator(".tool-permission-toolbar").textContent()).includes(targets.write));
  await choosePermission("allow_once");
  await actionDone("GCW_UI_WRITE_ALLOW","05-approved-write");
  assert.equal(fs.readFileSync(targets.write,"utf8"),written);
  checks.push("Approve once writes the actual owned file after showing its target");
  await actionPrompt("GCW_UI_REPLACE_ALLOW"); await choosePermission("allow_once");
  await actionDone("GCW_UI_REPLACE_ALLOW","06-approved-replace");
  assert.equal(fs.readFileSync(targets.write,"utf8"),replaced);
  checks.push("A separately approved replace changes the exact original bytes");
  if (option("--until") === "replace") {
    assert.deepEqual(browserErrors,[]);
    assert.deepEqual(guardNetworkAttempts(),[]);
    console.log(JSON.stringify({ status:"passed",checks,root },null,2));
  } else {
  await actionPrompt("GCW_UI_WRITE_CANCEL"); await cancelUI();
  assert.equal(fs.existsSync(targets.cancelled),false);
  checks.push("Cancel while waiting for approval stops the real turn without writing");
  await snapshot("07-cancelled-approval");
  await actionPrompt("GCW_UI_COMMAND_REJECT"); await choosePermission("reject_once");
  await actionDone("GCW_UI_COMMAND_REJECT","08-rejected-command");
  assert.equal(fs.existsSync(commands.outputs.reject),false);
  checks.push("Rejected command never starts the owned script");
  await actionPrompt("GCW_UI_COMMAND_ALLOW"); await choosePermission("allow_once");
  await actionDone("GCW_UI_COMMAND_ALLOW","09-approved-command");
  assert.equal(fs.readFileSync(commands.outputs.success,"utf8"),"GCW_COMMAND_SUCCESS");
  checks.push("Approved real command returns stdout, stderr, exit 0 and actual disk output");
  await actionPrompt("GCW_UI_COMMAND_FAILURE"); await choosePermission("allow_once");
  await actionDone("GCW_UI_COMMAND_FAILURE","10-nonzero-command");
  assert.ok(mock.requests.some(item => item.scenario === "GCW_UI_COMMAND_FAILURE" && item.toolResultExitCode === 7));
  checks.push("A real exit 7 remains nonzero through CLI/Core/GUI and the matching tool result");
  await actionPrompt("GCW_UI_COMMAND_CANCEL"); await choosePermission("allow_once");
  await poll(() => fs.existsSync(commands.slowPidFile),"actual owned slow command startup");
  const slowPid = JSON.parse(fs.readFileSync(commands.slowPidFile,"utf8")).pid;
  await cancelUI();
  await poll(() => { try { process.kill(slowPid,0);return false; } catch { return true; } },"actual slow script is reaped");
  assert.equal(fs.existsSync(commands.outputs.slow),false);
  checks.push("Stopping a running command reaps its own PID before the final write");
  await snapshot("11-cancelled-command");
  const aSession = (await state()).sessionId;
  await openWorkspaceUI(workspaces.b,"B"); await selectModelUI();
  await prompt("GCW_E2E_B: separate workspace survives the pending approval closure.","GCW_REPLY_B_COMPLETE","12-b-complete");
  const bSession = (await state()).sessionId;
  await gui.getByRole("button",{name:"Workspace A",exact:true}).first().click();
  await poll(async () => (await state()).sessionId === aSession,"A restored");
  await actionPrompt("GCW_UI_WRITE_CLOSE");
  await gui.getByRole("button",{name:"Workspace A",exact:true}).first().hover();
  await gui.locator('[data-telemetry-id="workspace_menu"]:visible').first().click();
  await snapshot("workspace-close-menu");
  await gui.locator('[data-telemetry-id="remove_workspace"]').click();
  await poll(async () => !(await state()).workspaces.some(item => samePath(item.workspaceDir,workspaces.a)),"closed A removed");
  await gui.getByRole("button",{name:"Workspace B",exact:true}).first().click();
  await poll(async () => (await state()).sessionId === bSession,"B restored after closing A");
  await poll(async () => (await state()).pending.every(item => item.workspaceId !== "A" && item.id !== aSession || (!item.permissions && !item.shell && !item.isStreaming)),"closed A approvals and loading cleared");
  assert.equal(fs.existsSync(targets.closed),false);
  assert.equal(await gui.locator(".tool-permission-toolbar").count(),0);
  checks.push("Closing A during approval cancels its waiters without writing, preserving B's conversation");
  await snapshot("13-workspace-closed-awaiting-approval");
  await sessionCrudUI(bSession);
  }
  }
  assert.deepEqual(browserErrors,[]);
  assert.deepEqual(guardNetworkAttempts(),[]);
  assert.deepEqual([...new Set(blocked)],[]);
  console.log(JSON.stringify({status:"passed",checks,root,providerRequests:mock.requests.length,guardNetworkAttempts:[],blockedExternalOrigins:[]},null,2));
} catch(error) {
  failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error);
  if(gui) await snapshot("failure").catch(()=>{});
} finally {
  await context?.close(); await stopShell(); await mock.close();
  fs.writeFileSync(path.join(root,"shell.log"),shellLog);
  fs.writeFileSync(path.join(root,"actions-report.json"),JSON.stringify({checks,failure,browserErrors,providerRequests:mock.requests,rpcObserved,rpcErrors,actionResultEvidence,
    guardNetworkAttempts:guardNetworkAttempts(),blockedExternalOrigins:[...new Set(blocked)],agent,packaged,binary,frontendDir,coreDir,packagedAgentSourceVerified,
    browserMode:"headless Chromium against actual Release HTTP host; native Wry geometry is not exercised",commands:commands.scripts.map(({name,sha256})=>({name,sha256}))},null,2));
}
