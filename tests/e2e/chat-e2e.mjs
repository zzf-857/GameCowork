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

const project = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
const previous = args.includes("--previous"), harness = args.includes("--harness");
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const base = path.resolve(project, "codelyreversebackup/work");
const root = path.resolve(option("--output", path.join(base, "chat-e2e-" + randomUUID())));
assert.ok(root.toLowerCase().startsWith(base.toLowerCase() + path.sep), "Chat fixtures must stay under temp/GameCowork");
const packaged = args.includes("--packaged");
const app = path.resolve(option("--app-root", path.join(project, "app")));
const binary = path.resolve(option("--binary", packaged ? path.join(app, "GameCowork.exe") : path.join(project, "src/shell/target/debug/GameCowork.exe")));
const agent = path.resolve(option("--agent", path.join(base, "cli-guarded-20261001-08/gamecowork.exe")));
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
const fixtureFile = path.join(workspaces.a, "fixture-note.txt");
fs.writeFileSync(fixtureFile, "GCW_FIXTURE_FILE_CONTENT\nOnly the real Agent may read this fixture.\n");
const editableFile = path.join(workspaces.a, "editable-fixture.txt");
const editableOriginal = "GCW_EDIT_ORIGINAL\nOwned browser fixture.\n";
fs.writeFileSync(editableFile, editableOriginal);
const readOnlyFile = path.join(workspaces.a, ".env");
const readOnlyOriginal = "GCW_SYNTHETIC_READONLY_FIXTURE=placeholder\n";
fs.writeFileSync(readOnlyFile, readOnlyOriginal);
const mock = await startMockProvider({ fixtureFile, chunkDelayMs: 350 });
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
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: path.join(root, "bun-cache"),
    ...(harness ? { GAMECOWORK_HARNESS_CORE_SHA: createHash("sha256").update(fs.readFileSync(path.join(coreDir, "index.js"))).digest("hex") } : {}),
    NODE_OPTIONS: "--require " + JSON.stringify(path.join(project, harness ? "tests/fixtures/core-chat-harness-guard.cjs" : "tests/fixtures/chat-core-guard.cjs")),
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
  if (previous) await context.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontendDir, "gui.html"), "utf8")
    .replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
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
        ...(pathHint ? { pathHint } : {}) });
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
  return gui.evaluate(async previous => {
    const { s: store } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js");
    const value = store.getState();
    const session = value.session.sessions[value.session.activeSessionId];
    function text(content) { return typeof content === "string" ? content : Array.isArray(content) ? content.map((item) => item.text || "").join("") : ""; }
    return { activeWorkspaceKey: value.hub.activeWorkspaceKey, workspaces: value.hub.workspaces,
      sessionId: value.session.activeSessionId, isStreaming: session?.isStreaming,
      modelTitle: value.config.config.selectedModelByRole?.chat?.title,
      models: (value.config.config.modelsByRole?.chat || []).map((model) => model.title),
      historyText: (session?.history || []).map((entry) => text(entry.message?.content)).join("\n"),
      sessionSettings: value.session.sessionSettingsById?.[value.session.activeSessionId],
      streamError: session?.streamError,
    };
  }, previous);
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
async function verifyFilesUI() {
  await gui.locator('[data-telemetry-id="toggle_right_sidebar"]').first().click();
  await gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]').click();
  await snapshot("10-file-menu");
  await gui.getByText(/^(文件浏览器|资源管理器|Explorer)$/).last().click();
  const panel = gui.locator(".tauri-file-preview-panel");
  await panel.getByText("editable-fixture.txt", { exact: true }).first().click();
  await gui.locator('[data-telemetry-id="enter_right_sidebar_fullscreen"]').click();
  // This fixture is plain text. C# controls are scoped to C# document routes;
  // their real runtime/enable behavior is covered by lsp-e2e and lsp-status-e2e.
  await panel.getByText("GCW_EDIT_ORIGINAL", { exact: false }).last().waitFor({ state: "visible" });
  assert.equal(await panel.getByTestId("gamecowork-lsp-status").count(), 0,
    "A plain-text document must not advertise C# LSP controls");
  await panel.getByText("GCW_EDIT_ORIGINAL", { exact: false }).last().click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Backspace");
  await page.keyboard.type("GCW_EDIT_SAVED");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Owned browser fixture updated.");
  const save = panel.getByTestId("gamecowork-file-save");
  await save.waitFor({ state: "visible" });
  await poll(() => save.isEnabled(), "dirty editable file exposes Save");
  await save.click();
  await poll(() => fs.readFileSync(editableFile, "utf8").includes("GCW_EDIT_SAVED"), "real UI save writes disk");
  const undo = panel.getByTestId("gamecowork-file-undo-save");
  await poll(() => undo.isEnabled(), "real snapshot enables Undo");
  await snapshot("11-file-saved");
  await undo.click();
  await poll(() => fs.readFileSync(editableFile, "utf8") === editableOriginal, "UI Undo restores original disk bytes");
  await panel.getByText("GCW_EDIT_ORIGINAL", { exact: false }).last().waitFor({ state: "visible" });
  assert.equal(await undo.isEnabled(), false, "Consumed snapshot is unavailable");
  checks.push("Actual Monaco edit -> Save writes the owned file; Undo restores the real original bytes and preview");
  await snapshot("12-file-undone");
  await panel.getByText("GCW_EDIT_ORIGINAL", { exact: false }).last().click();
  await page.keyboard.press("Control+a");
  await page.keyboard.type("GCW_DIRTY_DRAFT_RETAINED");
  await poll(() => save.isEnabled(), "dirty draft before external modification");
  const externalContent = "GCW_OWNED_EXTERNAL_CHANGE\n";
  fs.writeFileSync(editableFile, externalContent);
  await save.click();
  await panel.getByTestId("gamecowork-file-save-error").waitFor({ state: "visible" });
  assert.equal(fs.readFileSync(editableFile, "utf8"), externalContent);
  assert.ok(await panel.getByText("GCW_DIRTY_DRAFT_RETAINED", { exact: false }).last().isVisible());
  assert.equal(await undo.isEnabled(), false);
  checks.push("Concurrent disk change rejects UI Save with a visible conflict and preserves the dirty editor draft");
  await snapshot("13-file-conflict");
  await panel.getByText(".env", { exact: true }).first().click();
  await panel.getByText("GCW_SYNTHETIC_READONLY_FIXTURE", { exact: false }).last().waitFor({ state: "visible" });
  const readOnlyViewBefore = await panel.locator(".view-lines").first().innerText();
  await panel.getByText("GCW_SYNTHETIC_READONLY_FIXTURE", { exact: false }).last().click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("x");
  assert.equal(fs.readFileSync(readOnlyFile, "utf8"), readOnlyOriginal);
  assert.equal(await save.isEnabled(), false);
  assert.equal(await undo.isEnabled(), false);
  assert.equal(await panel.locator(".view-lines").first().innerText(), readOnlyViewBefore,
    "Typing into the readonly Monaco view must not change its content");
  assert.ok(await panel.getByText("GCW_SYNTHETIC_READONLY_FIXTURE", { exact: false }).last().isVisible());
  checks.push("Backend sensitive-file readOnly is enforced by the visible editor and Save/Undo controls");
  await snapshot("14-file-readonly");
}
async function verifyMarketplaceUI() {
  const hide = gui.locator('[data-telemetry-id="hide_right_sidebar"]');
  if (await hide.count()) await hide.last().click();
  await gui.getByRole("button", { name: "自定义", exact: true }).click();
  await gui.locator('[data-telemetry-id="customize_browse_marketplace"]').click();
  await gui.getByTestId("gamecowork-marketplace-pending").waitFor({ state: "visible", timeout: 30000 });
  assert.ok(rpcObserved.some((call) => call.type === "marketplace/listRemote"));
  checks.push("Actual marketplace source metadata shows a clear pending state while preserving the local management entry");
  await snapshot("15-marketplace-pending");
}
async function verifyDraftRestoreUI(sessionId) {
  const sentinel = "GCW_SHARED_NATIVE_UNSENT_DRAFT", workspaceA = (await state()).activeWorkspaceKey;
  let savedTitle;
  await gui.locator('[contenteditable="true"]').first().fill(sentinel);
  await openWorkspaceUI(workspaces.b, "draft-B");
  await gui.getByRole("button", { name: "Workspace A", exact: true }).first().click();
  await poll(async () => (await state()).sessionId === sessionId, "same A session after capturing its unsent draft");
  await poll(async () => (await gui.locator('[contenteditable="true"]').first().textContent()).trim() === sentinel, "real composer draft retained across workspace switching");
  await poll(async () => {
    const history = await fetch(new URL("/api/tauri/invoke", origin), { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ messageType: "history/list", messageId: "draft-persisted-" + randomUUID(), workspaceKey: workspaceA, data: {} }) }).then(response => response.json());
    assert.equal(history.data.status, "success");
    const metadata = history.data.content.find(item => (item.sessionId || item.id) === sessionId);
    if (metadata) savedTitle = metadata.title;
    return JSON.stringify(metadata?.draftInput || "").includes(sentinel);
  }, "unsent input stored in the actual Core session metadata");
  checks.push("The existing Redux store retains A's unsent draft across A/B switching and persists it through its shared messenger");
  await snapshot("draft-01-workspace-switch");
  await context.close(); context = undefined; await stopShell(); origin = await launch(); await startBrowser("profile-draft-fresh");
  await gui.getByRole("button", { name: "Workspace A", exact: true }).first().click();
  await gui.getByText(savedTitle, { exact: true }).first().click();
  await poll(async () => (await state()).sessionId === sessionId, "actual server session selected after cold restart");
  await poll(async () => (await gui.locator('[contenteditable="true"]').first().textContent()).trim() === sentinel, "Core-backed unsent draft restored in a fresh browser profile");
  await poll(async () => (await state()).historyText.includes("GCW_REPLY_A_COMPLETE"), "the actual transcript finishes loading alongside the restored draft");
  checks.push("A fresh browser profile plus restarted Rust/Core restores the same transcript and unsent draft without replacing its store/persistor during native boot");
  await snapshot("draft-02-cold-restored");
}

try {
  origin = await launch();
  await startBrowser("profile-first");
  await openWorkspaceUI(workspaces.a, "A");
  await configureProviderUI();
  if (option("--until") === "setup") { await snapshot("setup-complete"); process.exitCode = 0; }
  else if (option("--until") === "files") { await verifyFilesUI(); }
  else {
    await selectModelUI();
    await prompt("GCW_E2E_A first turn. Reply directly and do not call tools.", "GCW_REPLY_A_COMPLETE", "04-a-complete");
    const aSession = (await state()).sessionId;
    assert.ok(mock.requests.some((request) => request.scenario === "workspace-a" && request.chunksSent >= 3 && request.completed));
    checks.push("Real GUI -> core -> guarded compiled CLI -> loopback Provider delivers multiple chunks and a final frame");
    if (harness) {
      for (const [marker, expected] of [["REFUSAL", "refused"], ["LIMIT", "token limit"], ["MISSING", "missing final"]]) {
        await prompt(`GCW_HARNESS_FINAL_${marker}`);
        await gui.getByRole("heading", { name: "模型响应错误", exact: true }).waitFor({ state: "visible", timeout: 30000 });
        await poll(async () => !(await state()).isStreaming, "failed actual GUI stream finalized");
        const failed = await state();
        assert.ok(failed.streamError?.message.includes(expected), `${marker}: actual failure state retains the final reason`);
        assert.ok(failed.historyText.includes("Hello fixture"), `${marker}: actual partial Provider text survives the error`);
        await gui.getByText(`Agent ${marker === "REFUSAL" ? "refused the response (refusal)." : marker === "LIMIT" ? "response reached the output token limit (max_tokens)." : "returned an invalid or missing final response."}`, { exact: true }).last().waitFor({ state: "visible" });
        checks.push(`${marker}: actual GUI shows the ACP final failure, keeps partial output and stops streaming`);
        await snapshot(`harness-${marker.toLowerCase()}`);
        await gui.locator('[data-telemetry-id="dialog_close"]').last().click();
        await prompt("GCW_E2E_A explicit fixture recovery after final error", "GCW_REPLY_A_COMPLETE", `harness-${marker.toLowerCase()}-recovered`);
        assert.equal((await state()).streamError, null);
        checks.push(`${marker}: a subsequent normal actual prompt clears the saved stream error`);
      }
      await prompt("GCW_HARNESS_FINAL_CANCELLED");
      await poll(async () => !(await state()).isStreaming, "Agent-cancelled final reaches actual GUI");
      assert.equal(await gui.getByRole("heading", { name: "模型响应错误", exact: true }).count(), 0);
      assert.ok((await state()).historyText.includes("Hello fixture"));
      checks.push("An Agent-cancelled final keeps partial output and closes actual GUI streaming without an error dialog");
      await snapshot("harness-agent-cancelled");
      await prompt("GCW_E2E_A explicit fixture prompt after Agent cancelled final", "GCW_REPLY_A_COMPLETE", "harness-agent-cancelled-resumed");
      checks.push("Actual GUI accepts the next normal prompt after an Agent-cancelled final");
    }
    else if (option("--until") === "drafts") await verifyDraftRestoreUI(aSession);
    else if (option("--until") !== "chat") {
      await prompt("GCW_E2E_SLOW: slow fixture to test cancellation.", undefined);
      await gui.getByText("GCW_SLOW_STARTED", { exact: false }).last().waitFor({ state: "visible" });
      await gui.locator('[data-telemetry-id="stop_generation"]').first().click();
      await poll(() => mock.requests.some((request) => request.scenario === "slow" && request.aborted), "upstream HTTP cancellation");
      await poll(async () => !(await state()).isStreaming, "cancelled GUI stream");
      assert.equal(await gui.getByRole("heading", { name: "模型响应错误", exact: true }).count(), 0,
        "Explicit user cancellation must not become a model-error dialog");
      checks.push("Stopping a slow GUI stream cancels the actual upstream provider connection");
      await snapshot("05-cancelled");
      await prompt(`GCW_E2E_READ_FILE: use your read_file tool to read ${fixtureFile}, then acknowledge the actual tool result.`, "GCW_TOOL_READ_CONFIRMED", "06-read-tool");
      assert.ok(mock.requests.some((request) => request.requestedReadTool));
      assert.ok(mock.requests.some((request) => request.readToolResultContainsFixture));
      checks.push("A real Agent read-file tool returns the fixture sentinel through the actual provider tool-result turn");
      await openWorkspaceUI(workspaces.b, "B");
      await selectModelUI();
      await prompt("GCW_E2E_B first turn. Reply directly without tools.", "GCW_REPLY_B_COMPLETE", "07-b-complete");
      const bSession = (await state()).sessionId;
      assert.notEqual(aSession, bSession);
      await gui.getByRole("button", { name: "Workspace A", exact: true }).first().click();
      await poll(async () => (await state()).sessionId === aSession, "A's original conversation after switching");
      assert.ok((await state()).historyText.includes("GCW_REPLY_A_COMPLETE"));
      assert.ok(!(await state()).historyText.includes("GCW_REPLY_B_COMPLETE"));
      checks.push("A/B UI switching restores the correct conversation without mixing histories");
      await snapshot("08-a-restored");
      await context.close(); context = undefined;
      await stopShell();
      origin = await launch();
      await startBrowser("profile-after-restart");
      // A fresh browser profile prevents Redux/localStorage from masquerading as
      // server-backed history recovery after core and CLI restart.
      await gui.getByRole("button", { name: "Workspace A", exact: true }).first().click();
      const history = await fetch(new URL("/api/tauri/invoke", origin), { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageType: "history/list", messageId: "chat-e2e-history", workspaceKey: (await state()).activeWorkspaceKey, data: {} }) }).then((response) => response.json());
      assert.equal(history.data.status, "success");
      const metadata = history.data.content.find((item) => (item.sessionId || item.id) === aSession);
      assert.ok(metadata, "A exists in the restarted real core history index");
      await gui.getByText(metadata.title, { exact: true }).first().click();
      await gui.getByText("GCW_REPLY_A_COMPLETE", { exact: false }).last().waitFor({ state: "visible", timeout: 30000 });
      checks.push("Fresh browser plus restarted core/CLI recovers server-backed A history");
      await snapshot("09-restart-history");
      if (args.includes("--files")) await verifyFilesUI();
    }
  }
  if (args.includes("--marketplace")) await verifyMarketplaceUI();
  assert.deepEqual(browserErrors, []);
  assert.ok(mock.requests.filter((request) => request.url === "/v1/chat/completions").every((request) => request.authorized));
  if (!args.includes("--allow-blocked-network-diagnostics")) {
    assert.deepEqual(guardNetworkAttempts(), [], "Owned-mode core/Agent must skip all external services before network access");
    assert.deepEqual([...new Set(blocked)], [], "Owned GUI must not request external resources");
  }
  console.log(JSON.stringify({ status: "passed", checks, root, packaged, previous, harness, binary, coreDir, frontendDir,
    packagedAgentSourceVerified, browserMode: "headless Chromium against actual HTTP host; native Wry geometry is not exercised", providerRequestCount: mock.requests.length,
    completedChatRequests: mock.requests.filter((request) => request.url === "/v1/chat/completions" && request.completed).length,
    abortedSlowStreams: mock.requests.filter((request) => request.scenario === "slow" && request.aborted).length,
    verifiedReadToolTurns: mock.requests.filter((request) => request.readToolResultContainsFixture).length,
    blockedExternalOrigins: [...new Set(blocked)], guardNetworkAttempts: guardNetworkAttempts() }, null, 2));
} catch (error) {
  console.error(error); process.exitCode = 1;
  if (gui) await snapshot("failure").catch(() => {});
} finally {
  await context?.close();
  await stopShell();
  await mock.close();
  fs.writeFileSync(path.join(root, "shell.log"), shellLog);
  fs.writeFileSync(path.join(root, "chat-report.json"), JSON.stringify({ checks, browserErrors, providerRequests: mock.requests,
    blockedExternalOrigins: [...new Set(blocked)], rpcObserved, rpcErrors, agent, agentGuarded: manifest.testGuardIncluded,
    guardNetworkAttempts: guardNetworkAttempts(), packaged, previous, harness, binary, coreDir, frontendDir, packagedAgentSourceVerified,
    browserMode: "headless Chromium against actual HTTP host; native Wry geometry is not exercised" }, null, 2));
  fs.writeFileSync(path.join(root, "file-report.json"), JSON.stringify({ checks, fileRequests }, null, 2));
}
