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
import { zipFixture } from "../fixtures/custom-fixtures.mjs";
import { startLocalMcpFixture } from "../fixtures/local-mcp-fixture.mjs";

const project = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const base = path.resolve(project, "../../temp/GameCowork");
const root = path.resolve(option("--output", path.join(base, "command-subagent-e2e-" + randomUUID())));
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
const skillFile = path.join(workspaces.a, ".gamecowork-cli/skills/owned-skill/SKILL.md");
const skillInstructions = "---\nname: owned-skill\ndescription: Owned isolated test capability\n---\n# Owned Skill\n\nGCW_LOCAL_SKILL_INSTRUCTIONS_20261001\n";
const readFile = path.join(workspaces.a, "skill-read-fixture.txt");
fs.writeFileSync(readFile, "GCW_LOCAL_SKILL_FILE_SENTINEL\n");
const importedFile = path.join(root, "owned-import.zip");
fs.writeFileSync(importedFile, zipFixture({"imported-skill/SKILL.md":"---\nname: imported-skill\ndescription: Owned archive skill\n---\nImported owned instructions.\n"}));
const unsafeFile = path.join(root, "unsafe.zip");
fs.writeFileSync(unsafeFile, zipFixture({"../escape/SKILL.md":"---\nname: escape\ndescription: unsafe fixture\n---\nNo install.\n"}));
const mcp=await startLocalMcpFixture();
const mock=await startMockProvider({ systemPromptSentinel: "GCW_OWNED_SUBAGENT_SPECIALIZATION", toolPlans: {
  GCW_E2E_COMMAND: { steps: [] },
  GCW_SUBAGENT_CHILD: { steps: [] },
  GCW_E2E_SUBAGENT: { toolName: "task", arguments: { subagent_name: "owned-agent-renamed", description: "Owned fixture specialist", prompt: "GCW_SUBAGENT_CHILD: return the owned fixture answer", run_in_background: false }, verify: text => text.includes("GCW_SUBAGENT_CHILD_CONFIRMED") }
} });
const checks = [];
const browserErrors = [];
const blocked = [];
const rpcObserved = [];
const rpcCompleted = [];
const rpcErrors = [];
const fileRequests = [];
let settingsRouteTrace = [];
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
      rpcObserved.push({ type: message.messageType, requestId: message.messageId || message.id || body.id, time: Date.now(), method: message.data?.method, workspaceKey: body.workspaceKey || message.workspaceKey,
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
      const requestId=request.messageId || request.id || body.id, started=rpcObserved.findLast(item=>item.type===request.messageType&&item.requestId===requestId);
      rpcCompleted.push({type:request.messageType,requestId,time:Date.now(),elapsedMs:started?Date.now()-started.time:undefined,status:frame?.data?.status,contentStatus:frame?.data?.content?.status});
      const error = frame?.data?.status === "error" ? frame.data.error : frame?.data?.content?.error;
      if (error) rpcErrors.push({ type: request.messageType, error: String(error).slice(0, 400),
        pathHint: rpcObserved.findLast((entry) => entry.type === request.messageType && entry.pathHint)?.pathHint });
    } catch {}
  });
  if (args.includes("--previous")) await context.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontendDir, "gui.html"), "utf8").replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await page.goto(origin, { waitUntil: "domcontentloaded" });
  await poll(() => page.frames().some((frame) => frame.url().includes("/gui.html")), "real GUI frame");
  gui = page.frames().find((frame) => frame.url().includes("/gui.html"));
  await gui.evaluate(async previous => {
    const { s: store } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js");
    let before = store.getState().ui.showSettings; window.__gamecoworkSettingsTrace = [];
    store.subscribe(() => { const after = store.getState().ui.showSettings; if (before !== after) { window.__gamecoworkSettingsTrace.push({ before, after, stack: new Error("Settings route transition").stack }); before = after; } });
  }, args.includes("--previous"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  for (let step = 0; step < 4 && await next.count() && await next.first().isVisible(); step++) { await next.first().click(); await snapshot(`onboarding-${profile}-${step}`); }
}
async function snapshot(name) {
  fs.writeFileSync(path.join(root, name + ".aria.txt"), await gui.locator("body").ariaSnapshot());
  await page.screenshot({ path: path.join(root, name + ".png"), fullPage: true, animations: "disabled" });
}
async function state() {
  return gui.evaluate(async (previous) => {
    const { s: store } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js");
    const value = store.getState();
    const session = value.session.sessions[value.session.activeSessionId];
    function text(content) { return typeof content === "string" ? content : Array.isArray(content) ? content.map((item) => item.text || "").join("") : ""; }
    return { activeWorkspaceKey: value.hub.activeWorkspaceKey, workspaces: value.hub.workspaces,
      sessionId: value.session.activeSessionId, isStreaming: session?.isStreaming,
      modelTitle: value.config.config.selectedModelByRole?.chat?.title,
      models: (value.config.config.modelsByRole?.chat || []).map((model) => model.title),
      historyText: (session?.history || []).map((entry) => text(entry.message?.content)).join("\n"),
      sessionSettings: value.session.sessionSettingsById?.[value.session.activeSessionId], showSettings: value.ui.showSettings,
    };
  }, args.includes("--previous"));
}
async function openWorkspaceUI(directory, label) {
  await context.route(/\/api\/tauri\/pick-folder(?:-modal)?$/, (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ path: directory, cancelled: false }) }), { times: 1 });
  await gui.getByRole("button", { name: /^(打开工作区|Open Workspace)$/ }).last().click();
  await snapshot("open-workspace-menu-" + label);
  await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();
  await poll(async () => (await state()).workspaces.some((workspace) => samePath(workspace.workspaceDir, directory)), "opened workspace " + label);
}
async function configureProviderUI() {
  if (!await gui.locator('[data-telemetry-id="settings_nav_models"]').isVisible()) await gui.locator('[data-telemetry-id="open_settings"]').first().click();
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
async function concurrentRefreshProbe(){
 const scopes=(await state()).workspaces.map(workspace=>workspace.workspaceKey);
 await Promise.all(scopes.flatMap(workspaceKey=>['acp/refreshCommands','command','subagent'].map(async type=>{
  const messageType=type.startsWith('acp/')?type:'acp/notifyUpdate',requestId=randomUUID(),started=Date.now();
  const response=await fetch(new URL('/api/tauri/invoke',origin),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workspaceKey,message:{messageId:requestId,messageType,data:type.startsWith('acp/')?{}:{type}}}),signal:AbortSignal.timeout(30000)});
  const frame=await response.json();rpcCompleted.push({type:messageType,requestId,time:Date.now(),elapsedMs:Date.now()-started,status:frame?.data?.status,source:'concurrent-refresh-probe'});
  assert.equal(response.ok,true);assert.equal(frame?.data?.status,'success');assert.equal(frame?.data?.done,true);assert.notEqual(frame?.data?.content?.status,'error');
 })));
}
function row(kind,name){return gui.locator(`[data-capability-type="${kind}"][data-capability-name="${name}"]`).first();}
async function capabilityPage(tab){
 const hide=gui.locator('[data-telemetry-id="hide_right_sidebar"]');if(await hide.count()&&await hide.last().isVisible())await hide.last().click();
 if (!await gui.locator(`[data-telemetry-id="settings_nav_${tab}"]`).isVisible()) await gui.locator('[data-telemetry-id="open_settings"]').first().click();
 await gui.locator(`[data-telemetry-id="settings_nav_${tab}"]`).click();
}
async function createDialog(kind,name,global=false){
 await gui.locator('[data-telemetry-id="capability_new"]').first().click();
 await gui.locator(`[data-telemetry-id="${kind}_name"]`).fill(name);
 if(global)await gui.locator(`[data-telemetry-id="${kind}_scope_global"]`).check();
 await gui.locator(`[data-telemetry-id="${kind}_submit"]`).click();
}
async function pasteEditor(text){
 await gui.getByRole("textbox",{name:"Editor content",exact:true}).last().evaluate((element,text)=>{const data=new DataTransfer();data.setData("text/plain",text);element.dispatchEvent(new ClipboardEvent("paste",{clipboardData:data,bubbles:true,cancelable:true}));},text);
}
async function editProjectSkill(){
 const panel=gui.getByRole("complementary",{name:"File Preview Panel",exact:true});
 await panel.getByRole("button",{name:"源码",exact:true}).click();
 await panel.locator(".view-lines").click({position:{x:10,y:10}});
 await page.keyboard.press("Control+a");await page.keyboard.press("Backspace");await pasteEditor(skillInstructions);
 await poll(()=>panel.getByTestId("gamecowork-file-save").isEnabled(),"skill editor dirty");
 await panel.getByTestId("gamecowork-file-save").click();
 await poll(()=>fs.readFileSync(skillFile,"utf8").replaceAll("\r\n","\n")===skillInstructions,"real skill save");
 await snapshot("03-skill-edited");
}
async function toggle(kind,name,enabled,global=false){
 const control=row(kind,name).getByRole("switch");await control.click();
 await poll(()=>{
 const settingsFile=global?path.join(root,"data/cli-state/settings.json"):path.join(workspaces.a,".gamecowork-cli/settings.json");if(!fs.existsSync(settingsFile))return false;const config=JSON.parse(fs.readFileSync(settingsFile,"utf8"));
 const disabled=kind==="command"?config.commands?.disabled:kind==="subagent"?config.agents?.disabled:kind==="skill"?config.skills?.disabled:config.disabledExtensions;
 return !disabled?.includes(name)===enabled;
 },"capability toggle persisted");
 await poll(()=>control.isEnabled(),"capability mutation and refresh complete");
 await poll(async()=>await control.isChecked()===enabled,"post-refresh capability state");
 assert.equal((await state()).showSettings, true, "Toggling must preserve the current settings page");
 assert.equal(await gui.locator(`[data-telemetry-id="settings_nav_${kind === "command" ? "commands" : "subagents"}"]`).isVisible(), true);
}
async function upload(file,expected){
 await gui.locator('[data-telemetry-id="capability_upload"]').click();
 await gui.locator('[data-telemetry-id="skill_upload_file"]').setInputFiles(file);
 await gui.locator('[data-telemetry-id="skill_upload_submit"]').click();
 if(expected)await row("skill",expected).waitFor({state:"visible",timeout:30000});
}
async function remove(kind,name){
 const item=row(kind,name);await item.hover();await item.locator(`[data-telemetry-id="delete_${kind}"]`).click();
 await gui.locator('[data-telemetry-id="confirm_delete"]').click();
 await item.waitFor({state:"detached",timeout:30000});
}
async function mcpDialog(name,editing=false){
 if(editing){await row("mcp","owned-http").hover();await row("mcp","owned-http").locator('[data-telemetry-id="edit_mcp"]').click();}
 else {await gui.locator('[data-telemetry-id="capability_new"]').first().click();await gui.locator('[data-telemetry-id="capability_from_local"]').click();}
 await gui.locator('[data-telemetry-id="mcp_name"]').fill(name);
 await gui.locator('[data-telemetry-id="mcp_type_streamable-http"]').check();
 await gui.locator('[data-telemetry-id="mcp_url"]').fill(mcp.url);
 await gui.getByRole("button",{name:/^(添加|更新|更新服务器)$/}).last().click();
 await row("mcp",name).waitFor({state:"visible",timeout:30000});
}
async function mcpPrompt(marker,name){
 await gui.getByRole("button",{name:/^新建会话/}).first().click();await selectModelUI();await prompt(marker+": call exactly the owned MCP echo tool.");
 // MCP tools genuinely ask for permission. Complete only the allow_once option.
 const approve=gui.locator('[data-permission-option-kind="allow_once"]').first();
 await approve.waitFor({state:"visible",timeout:30000});await approve.click();
 await gui.getByText(marker+"_CONFIRMED",{exact:false}).last().waitFor({state:"visible",timeout:30000});
 await poll(async()=>!(await state()).isStreaming,"owned MCP tool stream complete");await snapshot(name);
 assert.ok(mock.requests.some(record=>record.scenario===marker&&record.toolResultVerified&&record.toolResultMatchedIssuedId));
}
async function verifyMcpUI(){
 await capabilityPage("mcp");await mcpDialog("owned-http");
 const settings=()=>JSON.parse(fs.readFileSync(path.join(workspaces.a,".gamecowork-cli/settings.json"),"utf8"));
 assert.equal(settings().mcpServers["owned-http"].httpUrl,mcp.url);
 if(!(await state()).models.length){assert.equal(mcp.requests.length,0);checks.push("MCP configuration persists before model setup and accurately defers connection");}
 await snapshot("09-mcp-configured");
 if(!(await state()).models.includes("Fixture Local Model"))await configureProviderUI();
 await mcpPrompt("GCW_E2E_MCP_ECHO","10-mcp-echo");
 assert.ok(mcp.requests.some(request=>request.method==="tools/call"&&request.arguments?.value==="GCW_OWNED_MCP_MARKER"&&request.called));
 checks.push("Real CLI initializes the owned HTTP MCP and returns the actual approved echo tool result");
 await capabilityPage("mcp");await row("mcp","owned-http").getByRole("switch").click();
 await poll(()=>settings().mcpServers["owned-http"].enabled===false,"MCP disable persisted");
 await row("mcp","owned-http").getByRole("switch").click();await poll(()=>settings().mcpServers["owned-http"].enabled!==false,"MCP enable persisted");
 checks.push("MCP enable/disable changes real server config and reconnects through the actual Agent");
 await mcpDialog("owned-renamed",true);await poll(()=>!settings().mcpServers["owned-http"]&&settings().mcpServers["owned-renamed"]?.httpUrl===mcp.url,"MCP real rename");
 assert.equal(await row("mcp","owned-http").count(),0);checks.push("Editing MCP name replaces the intended configuration instead of leaving two servers");await snapshot("11-mcp-renamed");
 await context.close();context=null;await stopShell();origin=await launch();await startBrowser("mcp-restart-profile");await gui.getByRole("button",{name:"Workspace A",exact:true}).first().click();
 await capabilityPage("mcp");await row("mcp","owned-renamed").waitFor({state:"visible"});await mcpPrompt("GCW_E2E_MCP_RESTART","12-mcp-restarted");checks.push("Fresh Core/CLI and browser recover MCP configuration and execute its real tool again");
 await capabilityPage("mcp");await remove("mcp","owned-renamed");assert.equal(settings().mcpServers?.["owned-renamed"],undefined);checks.push("MCP deletion removes the real scoped setting and visible row");await snapshot("13-mcp-deleted");
}
async function definitionEditor(kind, name) {
  await row(kind, name).hover(); await row(kind, name).locator(`[data-telemetry-id="edit_${kind}"]`).click();
  const editor = gui.getByTestId("gamecowork-definition-editor");
  await poll(() => editor.getByRole("textbox", { name: "能力文件源码" }).isEnabled(), "definition contents loaded");
  return editor;
}
async function closeEditor(editor) { await editor.getByRole("button", { name: "关闭", exact: true }).click(); await editor.waitFor({ state: "detached" }); }
const definitionFile = (kind, name, global = false, workspace = workspaces.a) => path.join(global ? path.join(root, "data/cli-state") : path.join(workspace, ".gamecowork-cli"), kind === "command" ? "commands" : "agents", name + ".toml");
let failure;
try{
 origin=await launch();await startBrowser("definition-profile");await openWorkspaceUI(workspaces.a,"A");await capabilityPage("commands");
 await createDialog("command", "../escape"); await gui.getByText(/名称仅允许/).waitFor({state:"visible"});
 assert.equal(rpcObserved.filter(call=>call.type==="custom/create").length, 0); await gui.getByRole("button",{name:"取消",exact:true}).last().click();
 checks.push("Actual Command dialog refuses traversal before issuing a write");
 await createDialog("command", "Owned Command"); await row("command", "owned-command").waitFor({state:"visible"});
 const commandFile=definitionFile("command","owned-command"), originalCommand=fs.readFileSync(commandFile,"utf8");
 assert.ok(originalCommand.includes('prompt = "Enter your prompt here"')); checks.push("Project command creation writes a bounded TOML file and actual CLI list discovers it");
 await createDialog("command", "Owned Command"); await gui.getByText(/EEXIST/).last().waitFor({state:"visible"});
 assert.equal(fs.readFileSync(commandFile,"utf8"),originalCommand); await gui.getByRole("button",{name:"取消",exact:true}).last().click(); checks.push("Duplicate command creation preserves the original definition");
 let editor=await definitionEditor("command","owned-command"), input=editor.getByRole("textbox",{name:"能力文件源码"});
 await input.fill('prompt = "unterminated'); await editor.getByTestId("gamecowork-definition-save").click(); await editor.getByRole("alert").waitFor({state:"visible"}); assert.equal(fs.readFileSync(commandFile,"utf8"),originalCommand);
 const commandContent='prompt = "GCW_E2E_COMMAND: owned slash command expanded from its saved TOML"\ndescription = "Owned slash fixture"\n';
 await input.fill(commandContent); await editor.getByTestId("gamecowork-definition-save").click(); await poll(()=>fs.readFileSync(commandFile,"utf8")===commandContent,"command save");
 const externalCommand=commandContent+'# external disk change\n'; fs.writeFileSync(commandFile,externalCommand); await input.fill(commandContent+'# stale draft\n'); await editor.getByTestId("gamecowork-definition-save").click();
 await editor.getByRole("alert").filter({hasText:/changed on disk/}).waitFor({state:"visible"}); assert.equal(fs.readFileSync(commandFile,"utf8"),externalCommand); assert.ok((await input.inputValue()).includes("stale draft"));
 await editor.getByRole("button",{name:"重新载入",exact:true}).click(); await poll(async()=>await input.inputValue()===externalCommand,"explicit reload preserves external bytes"); await closeEditor(editor);
 checks.push("Command editing validates TOML and protects external writes with SHA while retaining the rejected draft");
 await toggle("command","owned-command",false); editor=await definitionEditor("command","owned-command"); await editor.getByRole("textbox",{name:"能力名称"}).fill("owned-command-renamed"); await editor.getByTestId("gamecowork-definition-save").click();
 const renamedCommand=definitionFile("command","owned-command-renamed"); await poll(()=>fs.existsSync(renamedCommand)&&!fs.existsSync(commandFile),"command rename");await closeEditor(editor);await row("command","owned-command-renamed").waitFor({state:"visible"}); assert.equal(await row("command","owned-command-renamed").getByRole("switch").isChecked(),false);
 checks.push("Renaming a disabled command moves only its own file and keeps the scoped disabled state");
 await createDialog("command","global-command",true);await row("command","global-command").waitFor({state:"visible"});await toggle("command","global-command",false,true);
 editor=await definitionEditor("command","global-command"); await editor.getByRole("textbox",{name:"能力文件源码"}).fill('prompt = "Owned global command"\n'); await editor.getByTestId("gamecowork-definition-save").click();await poll(()=>fs.readFileSync(definitionFile("command","global-command",true),"utf8")==='prompt = "Owned global command"\n',"global command save");await closeEditor(editor);
 assert.ok(!JSON.parse(fs.readFileSync(path.join(workspaces.a,".gamecowork-cli/settings.json"),"utf8")).commands.disabled.includes("global-command")); checks.push("Global command editing and disable write their own home scope");await snapshot("commands-managed");
 await capabilityPage("subagents");await createDialog("subagent","owned-agent");await row("subagent","owned-agent").waitFor({state:"visible"});
 const agentFile=definitionFile("subagent","owned-agent");assert.ok(fs.readFileSync(agentFile,"utf8").includes('[prompts]'));checks.push("Subagent creation includes a real specialization prompt and uses the existing CLI registry");
 editor=await definitionEditor("subagent","owned-agent");const agentContent='name = "owned-agent"\ndescription = "Owned fixture specialist"\n[prompts]\nsystem_prompt = "GCW_OWNED_SUBAGENT_SPECIALIZATION: answer the task concretely"\nquery = "${task}"\n[run]\nmax_turns = 4\n';
 await editor.getByRole("textbox",{name:"能力文件源码"}).fill(agentContent);await editor.getByTestId("gamecowork-definition-save").click();await poll(()=>fs.readFileSync(agentFile,"utf8")===agentContent,"agent save");await closeEditor(editor);await toggle("subagent","owned-agent",false);
 editor=await definitionEditor("subagent","owned-agent");await editor.getByRole("textbox",{name:"能力名称"}).fill("owned-agent-renamed");await editor.getByTestId("gamecowork-definition-save").click();const renamedAgent=definitionFile("subagent","owned-agent-renamed");await poll(()=>fs.existsSync(renamedAgent)&&!fs.existsSync(agentFile),"agent rename");await closeEditor(editor);
 assert.ok(fs.readFileSync(renamedAgent,"utf8").includes('name = "owned-agent-renamed"'));checks.push("Subagent rename keeps file, runtime identity and disabled setting in sync");
 await createDialog("subagent","global-agent",true);await row("subagent","global-agent").waitFor({state:"visible"});await toggle("subagent","global-agent",false,true);editor=await definitionEditor("subagent","global-agent");assert.ok((await editor.getByRole("textbox",{name:"能力文件源码"}).inputValue()).includes('name = "global-agent"'));await closeEditor(editor);
 checks.push("Global subagent editing and toggling use the isolated global storage");await snapshot("subagents-managed");
 await gui.locator('[data-telemetry-id="settings_back"]').click();await openWorkspaceUI(workspaces.b,"B");await capabilityPage("commands");assert.equal(await row("command","owned-command-renamed").count(),0);await row("command","global-command").waitFor({state:"visible"});assert.equal(await row("command","global-command").getByRole("switch").isChecked(),false);
 await capabilityPage("subagents");assert.equal(await row("subagent","owned-agent-renamed").count(),0);await row("subagent","global-agent").waitFor({state:"visible"});checks.push("Two workspaces keep project definitions separate and share the true global disabled state");
 await context.close();context=null;await stopShell();origin=await launch();await startBrowser("definition-restarted");await gui.getByRole("button",{name:"Workspace A",exact:true}).first().click();await capabilityPage("commands");await row("command","owned-command-renamed").waitFor({state:"visible"});assert.equal(await row("command","owned-command-renamed").getByRole("switch").isChecked(),false);await toggle("command","owned-command-renamed",true);
 await capabilityPage("subagents");await row("subagent","owned-agent-renamed").waitFor({state:"visible"});assert.equal(await row("subagent","owned-agent-renamed").getByRole("switch").isChecked(),false);await toggle("subagent","owned-agent-renamed",true);checks.push("A fresh host/Core/CLI/browser restores renamed files and their persisted toggles");
 await configureProviderUI();await gui.getByRole("button",{name:/^新建会话/}).first().click();await selectModelUI();
 await prompt("/owned-command-renamed","GCW_E2E_COMMAND_CONFIRMED","command-expanded");assert.ok(mock.requests.some(record=>record.scenario==="GCW_E2E_COMMAND"));checks.push("The actual saved slash command expands and reaches the loopback model through compiled Agent");
 if(args.includes('--refresh-race')){
  for(let round=0;round<6;round++){
   await gui.getByRole('button',{name:/^新建会话/}).first().click();await selectModelUI();
   await Promise.all([prompt('/owned-command-renamed','GCW_E2E_COMMAND_CONFIRMED','concurrent-refresh-'+round),concurrentRefreshProbe()]);
  }
  checks.push('Six real GUI new-session/gatherContext slash flows survive concurrent A/B scope refresh without retrying any timeout');
 }
 await gui.getByRole("button",{name:/^新建会话/}).first().click();await selectModelUI();await prompt("GCW_E2E_SUBAGENT: call the owned specialist through task exactly once.");
 const permission=gui.locator('[data-permission-option-kind="allow_once"]');await permission.first().waitFor({state:"visible",timeout:5000}).catch(()=>{});if(await permission.count()&&await permission.first().isVisible())await permission.first().click();
 await gui.getByText("GCW_E2E_SUBAGENT_CONFIRMED",{exact:false}).last().waitFor({state:"visible",timeout:60000});await poll(async()=>!(await state()).isStreaming,"actual subagent result completed");
 assert.ok(mock.requests.some(record=>record.scenario==="GCW_E2E_SUBAGENT"&&record.toolResultVerified));assert.ok(mock.requests.some(record=>record.scenario==="GCW_SUBAGENT_CHILD"&&record.systemPromptContainsSentinel));checks.push("Compiled Agent loads the saved specialization, executes the configured subagent and returns its real issued task result to the parent model");await snapshot("subagent-executed");
 await capabilityPage("commands");await remove("command","global-command");await remove("command","owned-command-renamed");assert.equal(fs.existsSync(renamedCommand),false);assert.equal(fs.existsSync(definitionFile("command","global-command",true)),false);
 await capabilityPage("subagents");await remove("subagent","global-agent");await remove("subagent","owned-agent-renamed");assert.equal(fs.existsSync(renamedAgent),false);assert.equal(fs.existsSync(definitionFile("subagent","global-agent",true)),false);checks.push("Project/global command and subagent deletion removes the intended files and visible rows");
 const unexpectedRpcErrors=rpcErrors.filter(call=>!(call.type==="custom/create"&&/EEXIST/.test(call.error))&&!(call.type==="custom/update"&&(/changed on disk|unterminated|Invalid TOML|Unexpected|TOML|parse|end of/i.test(call.error))));assert.deepEqual(unexpectedRpcErrors,[]);
 assert.deepEqual(browserErrors,[]);assert.deepEqual(guardNetworkAttempts(),[]);assert.deepEqual([...new Set(blocked)],[]);
 settingsRouteTrace=await gui.evaluate(()=>window.__gamecoworkSettingsTrace || []);console.log(JSON.stringify({status:"passed",root,checks,browserErrors,rpcErrors},null,2));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error);if(gui) { settingsRouteTrace = await gui.evaluate(() => window.__gamecoworkSettingsTrace || []).catch(()=>[]); await snapshot("failure").catch(()=>{}); }}
finally{await context?.close();await stopShell();await mock.close();await mcp.close();fs.writeFileSync(path.join(root,"shell.log"),shellLog);fs.writeFileSync(path.join(root,"command-subagent-report.json"),JSON.stringify({checks,failure,settingsRouteTrace,browserErrors,rpcErrors,rpcObserved,rpcCompleted,providerRequests:mock.requests,mcpRequests:mcp.requests,guardNetworkAttempts:guardNetworkAttempts(),blockedExternalOrigins:[...new Set(blocked)],frontendGeneration:args.includes("--previous")?"previous":"current",packaged,binary,coreDir,frontendDir,agent,agentGuarded:manifest.testGuardIncluded,packagedAgentSourceVerified,browserMode:"headless Chromium actual Rust/Core/frontend; native Wry geometry is not exercised"},null,2));}
