// Real GUI -> Rust -> restored core -> guarded own compiled CLI -> loopback mock.
// No fake core, real provider/account, editor or existing user state is used.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
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
const root = path.resolve(option("--output", path.join(base, "custom-management-e2e-" + randomUUID())));
assert.ok(root.toLowerCase().startsWith(base.toLowerCase() + path.sep), "Chat fixtures must stay under temp/GameCowork");
const packaged = args.includes("--packaged");
const previous = args.includes("--previous");
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
const stdioMcp=args.includes("--stdio"),mcpName=stdioMcp?"owned-stdio":"owned-http";
let stdioCaps;
async function createOwnedStdioMcp(){
 const directory=path.join(root,"MCP Fixtures with space");fs.mkdirSync(directory);
 const executable=path.join(directory,"owned-node.exe"),script=path.join(directory,"Own server with space.mjs");
 fs.copyFileSync(path.join(app,"core/gamecowork-runtime.exe"),executable);fs.copyFileSync(path.join(project,"tests/fixtures/stdio-mcp-fixture.mjs"),script);
 const digest=file=>createHash("sha256").update(fs.readFileSync(file)).digest("hex");
 stdioCaps={mcp:{executable,script,workspace:workspaces.a,executableSha256:digest(executable),scriptSha256:digest(script)}};
 const log=path.join(root,"stdio-mcp-events.jsonl");
 return {command:executable,args:[script],env:{GAMECOWORK_STDIO_MCP_FIXTURE_ROOT:root,GAMECOWORK_STDIO_MCP_SENTINEL:"GCW_STDIO_ENV_MARKER"},
   get records(){return fs.existsSync(log)?fs.readFileSync(log,"utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse):[];},
   get requests(){return this.records.filter(record=>record.event==="request");},
   get livePids(){return [...new Set(this.records.filter(record=>record.event==="started").map(record=>record.pid))].filter(pid=>{try{process.kill(pid,0);return true;}catch{return false;}});},
   async close(){for(const pid of this.livePids){const result=await promisify(execFile)("powershell.exe",["-NoProfile","-NonInteractive","-Command",`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}').CommandLine`],{windowsHide:true});if(result.stdout.includes(script))await promisify(execFile)("taskkill.exe",["/PID",String(pid),"/T","/F"],{windowsHide:true});}}};
}
const mcp=stdioMcp?await createOwnedStdioMcp():await startLocalMcpFixture();
const mock=await startMockProvider({ toolPlans: { GCW_E2E_MCP_DENIED:{toolName:"owned_echo",arguments:{value:"GCW_OWNED_MCP_DENIED_MARKER"},verify:text=>/denied|reject|declin|cancel/i.test(text)},GCW_E2E_MCP_ECHO:{toolName:"owned_echo",arguments:{value:"GCW_OWNED_MCP_MARKER"},verify:text=>text.includes("OWNED_MCP_ECHO:GCW_OWNED_MCP_MARKER")},GCW_E2E_MCP_RESTART:{toolName:"owned_echo",arguments:{value:"GCW_OWNED_RESTART_MARKER"},verify:text=>text.includes("OWNED_MCP_ECHO:GCW_OWNED_RESTART_MARKER")},GCW_E2E_LOCAL_SKILL: { steps: [
  { toolName: "activate_skill", arguments: { name: "owned-skill" }, verify: text => text.includes("GCW_LOCAL_SKILL_INSTRUCTIONS_20261001") },
  { toolName: "read_file", arguments: { absolute_path: readFile }, verify: text => text.includes("GCW_LOCAL_SKILL_FILE_SENTINEL") }
] } } });
const checks = [];
const settingsReadRetries = [];
const browserErrors = [];
const blocked = [];
const rpcObserved = [];
const rpcErrors = [];
const fileRequests = [];
const mcpFormTrace = [];
const mcpConfigRequests = [];
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
    ...(stdioCaps?{GAMECOWORK_CLI_TOOL_CAPS:JSON.stringify(stdioCaps)}:{}),
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
async function pollSettings(settingsFile, predicate, description, timeout = 30000) {
  const end = Date.now() + timeout;
  let last;
  while (true) {
    // The real CLI writes this file in place. A cross-process read may observe
    // truncation before the replacement JSON is complete; only parsing retries.
    // Filesystem errors and predicate/assertion failures must still fail at once.
    const bytes = fs.readFileSync(settingsFile);
    last = { bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
    let config, parsed = false;
    try { config = JSON.parse(bytes.toString("utf8")); parsed = true; }
    catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      last.parseError = error.message;
      settingsReadRetries.push({ file: path.relative(root, settingsFile), description, ...last });
    }
    if (parsed && await predicate(config)) return config;
    assert.ok(Date.now() < end, `Timed out waiting for ${description}; ${settingsFile}; last settings read: ${JSON.stringify(last)}`);
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
  if(previous) await context.route("**/gui.html*",route=>route.fulfill({contentType:"text/html",body:fs.readFileSync(path.join(frontendDir,"gui.html"),"utf8").replaceAll("index-BRxZ4eG7.js","index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js","VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js","store-0rGrUshb.js")}));
  await context.addInitScript(({controlledMcpFocus}) => {
    window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = "";
    window.__gamecoworkMcpFocusTrace = [];
    const describe = element => ({ tag: element?.tagName, id: element?.getAttribute?.("data-telemetry-id"), connected: element?.isConnected });
    const fields = () => Object.fromEntries(["mcp_name", "mcp_command", "mcp_arguments", "mcp_url"].map(id => [id, document.querySelector(`[data-telemetry-id="${id}"]`)?.value]));
    const original = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (...args) {
      const id = this.getAttribute("data-telemetry-id");
      if (id?.startsWith("mcp_")) window.__gamecoworkMcpFocusTrace.push({ event: "focus-call", at: performance.now(), target: describe(this), active: describe(document.activeElement), fields: fields(), stack: new Error().stack });
      return original.apply(this, args);
    };
    window.__installGamecoworkMcpTraceEvents = () => {
      for (const type of ["focusin", "input", "change", "pointerdown", "keydown"]) document.addEventListener(type, event => {
        const id = event.target?.getAttribute?.("data-telemetry-id");
        if (id?.startsWith("mcp_")) window.__gamecoworkMcpFocusTrace.push({ event: type, at: performance.now(), target: describe(event.target), active: describe(document.activeElement), fields: fields(), key: event.key });
      }, true);
    };
    if(controlledMcpFocus){
      const originalTimer=window.setTimeout.bind(window),originalClear=window.clearTimeout.bind(window);
      window.__gamecoworkHeldMcpFocus=[];
      window.__gamecoworkSkippedMcpFocus=[];
      const originalContains=Node.prototype.contains;
      Node.prototype.contains=function(element){
        const contains=originalContains.call(this,element),id=element?.getAttribute?.("data-telemetry-id");
        if(contains&&this!==element&&id?.startsWith("mcp_")&&this.querySelector?.('[data-telemetry-id="mcp_name"]')){
          const stack=new Error().stack||"";
          if(stack.includes("gamecoworkScheduleDialogFocus")){
            window.__gamecoworkSkippedMcpFocus.push({owner:this,active:element,href:window.location.href,stack});
            window.__gamecoworkMcpFocusTrace.push({event:"actual-modal-owned-focus-preserved",at:performance.now(),active:describe(element),fields:fields(),stack});
          }
        }
        return contains;
      };
      window.setTimeout=(callback,delay,...values)=>{
        const source=typeof callback==="function"?callback.toString():"";
        if(delay===50&&source.includes("focus(")&&source.includes("select(")&&document.querySelector('[data-telemetry-id="mcp_name"]')){
          const id=originalTimer(()=>{},50);window.__gamecoworkHeldMcpFocus.push({id,callback:()=>callback(...values),source,cancelled:false});return id;
        }
        return originalTimer(callback,delay,...values);
      };
      window.clearTimeout=id=>{const timer=window.__gamecoworkHeldMcpFocus.find(value=>value.id===id);if(timer)timer.cancelled=true;return originalClear(id);};
    }
  }, {controlledMcpFocus:args.includes("--mcp-focus-probe")});
  page = context.pages()[0] || await context.newPage();
  page.on("pageerror", (error) => browserErrors.push(error.stack || String(error)));
  page.on("request", (request) => {
    if (!request.url().includes("/api/tauri/invoke")) return;
    try {
      const body = request.postDataJSON(); const message = body.message || body;
      if (["config/addMcpServer", "config/deleteMcpServer"].includes(message.messageType))
        mcpConfigRequests.push({ type: message.messageType, messageId: message.messageId, data: message.data });
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
  await gui.evaluate(()=>window.__installGamecoworkMcpTraceEvents?.());
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  for (let step = 0; step < 4 && await next.count() && await next.first().isVisible(); step++) { await next.first().click(); await snapshot(`onboarding-${profile}-${step}`); }
}
async function snapshot(name) {
  mcpFormTrace.push(...await gui.evaluate(() => { const events=window.__gamecoworkMcpFocusTrace||[];window.__gamecoworkMcpFocusTrace=[];return events; }).catch(()=>[]));
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
function row(kind,name){return gui.locator(`[data-capability-type="${kind}"][data-capability-name="${name}"]`).first();}
async function capabilityPage(tab){
 const hide=gui.locator('[data-telemetry-id="hide_right_sidebar"]');if(await hide.count()&&await hide.last().isVisible())await hide.last().click();
 await gui.getByRole("button",{name:"自定义",exact:true}).click();
 await gui.locator(`[data-telemetry-id="marketplace_tab_${tab}"]`).click();
}
async function createDialog(kind,name,global=false){
 await gui.locator('[data-telemetry-id="capability_new"]').first().click();
 const menu=gui.locator('[data-telemetry-id="capability_from_local"]');await menu.waitFor({state:"visible"});await menu.click();
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
 await poll(async()=>await control.isChecked()===enabled,"capability toggle UI");
 const settingsFile=global?path.join(root,"data/cli-state/settings.json"):path.join(workspaces.a,".gamecowork-cli/settings.json");
 await poll(()=>fs.existsSync(settingsFile),"capability settings file exists");
 await pollSettings(settingsFile,config=>{
 const disabled=kind==="skill"?config.skills?.disabled:config.disabledExtensions;
 return !disabled?.includes(name)===enabled;
 },"capability toggle persisted");
 await poll(()=>control.isEnabled(),"capability mutation and refresh complete");
 await poll(async()=>await control.isChecked()===enabled,"post-refresh capability state");
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
 if(editing){await row("mcp",mcpName).hover();await row("mcp",mcpName).locator('[data-telemetry-id="edit_mcp"]').click();}
 else {await gui.locator('[data-telemetry-id="capability_new"]').first().click();await gui.locator('[data-telemetry-id="capability_from_local"]').click();}
 await gui.locator('[data-telemetry-id="mcp_name"]').fill(name);
 if(stdioMcp){
   await gui.locator('[data-telemetry-id="mcp_type_stdio"]').check();
   if(editing)assert.deepEqual(JSON.parse(await gui.locator('[data-telemetry-id="mcp_arguments"]').inputValue()),mcp.args,"Editing keeps exact argument boundaries");
   await gui.locator('[data-telemetry-id="mcp_command"]').fill(mcp.command);
   if(args.includes("--mcp-focus-probe")){
     await gui.locator('[data-telemetry-id="mcp_arguments"]').evaluate(element=>{
       element.focus();element.select();const timer=window.__gamecoworkHeldMcpFocus?.at(-1);
       if(timer){
         window.__gamecoworkMcpFocusTrace.push({event:"controlled-actual-modal-timer",cancelled:timer.cancelled,source:timer.source});timer.callback();
       }else{
         const preserved=window.__gamecoworkSkippedMcpFocus?.findLast(value=>value.owner.isConnected&&value.owner.contains(element)&&value.active.isConnected&&value.href===window.location.href);
         if(!preserved)throw Error("Neither an actual scheduled modal callback nor the current modal's owned-focus guard was observed");
         window.__gamecoworkMcpFocusTrace.push({event:"controlled-actual-modal-skip",active:preserved.active.getAttribute("data-telemetry-id"),href:preserved.href});
       }
     });
     await page.keyboard.insertText(JSON.stringify(mcp.args));
     assert.equal(await gui.locator('[data-telemetry-id="mcp_name"]').inputValue(),name,"Actual late dialog callback cannot redirect argv typing into the server name");
     checks.push("The actual modal timer or observed owned-focus guard preserves a user's chosen MCP argument input");
   }
   await gui.locator('[data-telemetry-id="mcp_arguments"]').fill(JSON.stringify(mcp.args));
   if(!editing){
     const submit=gui.getByRole("button",{name:/^(添加|更新|更新服务器)$/}).last(),before=rpcObserved.length;
     await gui.locator('[data-telemetry-id="mcp_arguments"]').fill('"unterminated');await submit.click();await gui.getByRole("alert").getByText(/unclosed quote/).waitFor({state:"visible"});
     assert.equal(rpcObserved.slice(before).filter(record=>/config\/|mcp\/|acp\/notifyUpdate/.test(record.type||"")).length,0,"Bad argv must not issue a configuration write");
     await gui.locator('[data-telemetry-id="mcp_arguments"]').fill(JSON.stringify(mcp.args));checks.push("Actual stdio dialog rejects invalid quoting before a write");
     for(const [index,[key,value]] of Object.entries(mcp.env).entries()){
       await gui.locator('[data-telemetry-id="mcp_add_variable"]').click();await gui.locator('[data-telemetry-id="mcp_env_key"]').nth(index).fill(key);await gui.locator('[data-telemetry-id="mcp_env_value"]').nth(index).fill(value);
     }
   }
 }else{
   await gui.locator('[data-telemetry-id="mcp_type_streamable-http"]').check();await gui.locator('[data-telemetry-id="mcp_url"]').fill(mcp.url);
 }
 const actual=await gui.locator('[data-telemetry-id="mcp_name"]').inputValue();
 assert.equal(actual,name,"Each actual MCP field mutation must preserve the independent server name before submit");
 const beforeSubmit=mcpConfigRequests.length;
 await gui.getByRole("button",{name:/^(添加|更新|更新服务器)$/}).last().click();
 await poll(()=>mcpConfigRequests.length>beforeSubmit,"actual MCP configuration request");
 const call=mcpConfigRequests[beforeSubmit];assert.equal(call.type,"config/addMcpServer");assert.equal(call.data.name,name,"The actual write preserves the explicit server identity");
 if(stdioMcp){assert.equal(call.data.command,mcp.command);assert.deepEqual(call.data.args,mcp.args);}
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
 await capabilityPage("mcp");await mcpDialog(mcpName);
 const settingsFile=path.join(workspaces.a,".gamecowork-cli/settings.json");
 const settings=()=>JSON.parse(fs.readFileSync(settingsFile,"utf8"));
 if(stdioMcp){assert.equal(settings().mcpServers[mcpName].command,mcp.command);assert.deepEqual(settings().mcpServers[mcpName].args,mcp.args);assert.equal(settings().mcpServers[mcpName].env.GAMECOWORK_STDIO_MCP_SENTINEL,"GCW_STDIO_ENV_MARKER");}
 else assert.equal(settings().mcpServers[mcpName].httpUrl,mcp.url);
 if(!(await state()).models.length){assert.equal(mcp.requests.length,0);checks.push("MCP configuration persists before model setup and accurately defers connection");}
 await snapshot("09-mcp-configured");
 if(!(await state()).models.includes("Fixture Local Model"))await configureProviderUI();
 if(stdioMcp){
   const before=mcp.requests.filter(record=>record.method==="tools/call").length;
   await gui.getByRole("button",{name:/^新建会话/}).first().click();await selectModelUI();await prompt("GCW_E2E_MCP_DENIED: call exactly the owned echo tool and observe its permission result.");
   await gui.locator('[data-permission-option-kind="reject_once"]').first().waitFor({state:"visible",timeout:30000});await gui.locator('[data-permission-option-kind="reject_once"]').first().click();
   await gui.getByText("GCW_E2E_MCP_DENIED_CONFIRMED",{exact:false}).last().waitFor({state:"visible",timeout:30000});await poll(async()=>!(await state()).isStreaming,"denied MCP turn ends");
   assert.equal(mcp.requests.filter(record=>record.method==="tools/call").length,before);assert.ok(mock.requests.some(record=>record.scenario==="GCW_E2E_MCP_DENIED"&&record.toolResultMatchedIssuedId));
   checks.push("Rejecting the real stdio tool permission returns its issued-ID denial without calling the server tool");
 }
 await mcpPrompt("GCW_E2E_MCP_ECHO","10-mcp-echo");
 assert.ok(mcp.requests.some(request=>request.method==="tools/call"&&request.arguments?.value==="GCW_OWNED_MCP_MARKER"&&request.called));
 checks.push(`Real CLI initializes the owned ${stdioMcp?"stdio":"HTTP"} MCP and returns the actual approved echo tool result`);
 if(stdioMcp){assert.ok(mcp.records.some(record=>record.event==="started"&&record.marker==="GCW_STDIO_ENV_MARKER"));assert.ok(mcp.livePids.length);checks.push("Real stdio subprocess preserves a spaced executable/script argv and configured environment");}
 await capabilityPage("mcp");await row("mcp",mcpName).getByRole("switch").click();
 await pollSettings(settingsFile,config=>config.mcpServers[mcpName].enabled===false,"MCP disable persisted");
 if(stdioMcp){await poll(()=>mcp.livePids.length===0,"Disabling closes the exact owned stdio process");checks.push("Disabling the server releases its actual stdio subprocess");}
 await row("mcp",mcpName).getByRole("switch").click();await pollSettings(settingsFile,config=>config.mcpServers[mcpName].enabled!==false,"MCP enable persisted");
 checks.push("MCP enable/disable changes real server config and reconnects through the actual Agent");
 await mcpDialog("owned-renamed",true);const renamedSettings=await pollSettings(settingsFile,config=>!config.mcpServers[mcpName]&&(stdioMcp?config.mcpServers["owned-renamed"]?.command===mcp.command:config.mcpServers["owned-renamed"]?.httpUrl===mcp.url),"MCP real rename");
 if(stdioMcp)assert.deepEqual(renamedSettings.mcpServers["owned-renamed"].args,mcp.args);
 assert.equal(await row("mcp",mcpName).count(),0);checks.push("Editing MCP name replaces the intended configuration instead of leaving two servers");await snapshot("11-mcp-renamed");
 await context.close();context=null;await stopShell();if(stdioMcp){await poll(()=>mcp.livePids.length===0,"Host shutdown releases all its owned stdio children");checks.push("Host shutdown reclaims actual stdio process lifetime");}origin=await launch();await startBrowser("mcp-restart-profile");await gui.getByRole("button",{name:"Workspace A",exact:true}).first().click();
 await capabilityPage("mcp");await row("mcp","owned-renamed").waitFor({state:"visible"});await mcpPrompt("GCW_E2E_MCP_RESTART","12-mcp-restarted");checks.push("Fresh Core/CLI and browser recover MCP configuration and execute its real tool again");
 await capabilityPage("mcp");await remove("mcp","owned-renamed");assert.equal(settings().mcpServers?.["owned-renamed"],undefined);checks.push("MCP deletion removes the real scoped setting and visible row");if(stdioMcp){await poll(()=>mcp.livePids.length===0,"Deleting the server releases its actual stdio process");checks.push("Deletion releases the exact owned stdio process");}await snapshot("13-mcp-deleted");
}
let failure;
try{
 origin=await launch();await startBrowser("custom-profile");await openWorkspaceUI(workspaces.a,"A");await capabilityPage("skills");
 await snapshot("01-skills-initial");
 if(args.includes("--mcp-form-only")){
   const count=Number(option("--mcp-form-cycles","6"));assert.ok(Number.isInteger(count)&&count>=1&&count<=12);
   await capabilityPage("mcp");
   for(let cycle=0;cycle<count;cycle++){
     await mcpDialog(mcpName);
     assert.ok(JSON.parse(fs.readFileSync(path.join(workspaces.a,".gamecowork-cli/settings.json"),"utf8")).mcpServers[mcpName]);
     await snapshot("mcp-form-cycle-"+cycle);await remove("mcp",mcpName);
     checks.push("Actual dialog identity and argv survive invalid-quote correction and environment rows: cycle "+cycle);
   }
 }else{
 if(!args.includes("--mcp-only")){
 await createDialog("skill","../escape");
 await gui.getByText(/名称仅允许/).waitFor({state:"visible"});
 assert.equal(rpcObserved.filter(call=>call.type==="custom/create").length,0);
 await gui.locator('[data-telemetry-id="skill_cancel"]').click();checks.push("Invalid names remain in the dialog and never issue a write request");
 await createDialog("skill","Owned Skill");
 await row("skill","owned-skill").waitFor({state:"visible"});
 assert.ok(fs.readFileSync(skillFile,"utf8").includes("name: owned-skill"));
 checks.push("Local skill creation writes its actual SKILL.md and the real CLI discovers it");await snapshot("02-skill-created");
 await editProjectSkill();checks.push("The original project file preview edits and saves real skill instructions");
 await capabilityPage("skills");await toggle("skill","owned-skill",false);await snapshot("04-skill-disabled");
 await toggle("skill","owned-skill",true);checks.push("Disable and enable update real project settings and the visible switch");
 await createDialog("skill","Owned Skill");
 await gui.getByText(/EEXIST|file already exists|already exists/i).last().waitFor({state:"visible"});
 assert.equal(fs.readFileSync(skillFile,"utf8").replaceAll("\r\n","\n"),skillInstructions);
 await gui.locator('[data-telemetry-id="skill_cancel"]').click();checks.push("Duplicate creation is rejected without replacing existing instructions");
 await upload(importedFile,"imported-skill");checks.push("ZIP upload is installed by the actual compiled CLI and discovered in the UI");await snapshot("05-imported");
 await upload(unsafeFile);await gui.getByText(/Unsafe archive path/).last().waitFor({state:"visible"});
 assert.equal(fs.existsSync(path.join(root,"escape")),false);await gui.locator('[data-telemetry-id="skill_upload_cancel"]').click();checks.push("A traversal ZIP is visibly rejected before extraction or installation");
 await remove("skill","imported-skill");assert.equal(fs.existsSync(path.join(workspaces.a,".gamecowork-cli/skills/imported-skill")),false);checks.push("Uninstall removes the actual owned capability directory and list row");
 await createDialog("skill","global-owned",true);await row("skill","global-owned").waitFor({state:"visible"});
 const globalRow=row("skill","global-owned");await globalRow.hover();await globalRow.locator('[data-telemetry-id="edit_skill"]').click();
 const editor=gui.getByTestId("gamecowork-custom-editor");await editor.getByRole("textbox",{name:"能力文件源码"}).waitFor({state:"visible"});
 await poll(()=>editor.getByRole("textbox",{name:"能力文件源码"}).isEnabled(),"global custom file loaded");
 const globalText="---\nname: global-owned\ndescription: Own global fixture\n---\nGLOBAL_OWNED_SAVED\n";
 await editor.getByRole("textbox",{name:"能力文件源码"}).fill(globalText);await editor.getByTestId("gamecowork-custom-save").click();
 const globalFile=path.join(root,"data/cli-state/skills/global-owned/SKILL.md");
 await poll(()=>fs.readFileSync(globalFile,"utf8")===globalText,"global capability actual bytes");
 const globalDraft=globalText.replace("GLOBAL_OWNED_SAVED","GLOBAL_DIRTY_DRAFT"),externalGlobal=globalText.replace("GLOBAL_OWNED_SAVED","GLOBAL_EXTERNAL_CHANGE");
 await editor.getByRole("textbox",{name:"能力文件源码"}).fill(globalDraft);fs.writeFileSync(globalFile,externalGlobal);await editor.getByTestId("gamecowork-custom-save").click();
 await editor.getByRole("alert").waitFor({state:"visible"});assert.ok((await editor.getByRole("alert").innerText()).includes("changed on disk"));
 assert.equal(fs.readFileSync(globalFile,"utf8"),externalGlobal);assert.equal(await editor.getByRole("textbox",{name:"能力文件源码"}).inputValue(),globalDraft);await snapshot("06-global-conflict");
 await editor.getByRole("button",{name:"重新载入",exact:true}).click();await poll(async()=>await editor.getByRole("textbox",{name:"能力文件源码"}).inputValue()===externalGlobal,"explicit global reload");
 await editor.getByRole("textbox",{name:"能力文件源码"}).fill(globalText);await editor.getByTestId("gamecowork-custom-save").click();await poll(()=>fs.readFileSync(globalFile,"utf8")===globalText,"global save after reload");
 await editor.getByRole("button",{name:"关闭",exact:true}).click();checks.push("Global creation/edit is scoped; stale SHA rejects Save, preserves the draft, and explicit Reload admits the next save");await snapshot("06-global-skill");
 await toggle("skill","global-owned",false,true);await toggle("skill","global-owned",true,true);checks.push("Global skill enable/disable changes the scoped global settings");
 await capabilityPage("extensions");await createDialog("extension","owned-extension");await row("extension","owned-extension").waitFor({state:"visible"});
 const extensionFile=path.join(workspaces.a,".gamecowork-cli/extensions/owned-extension/gemini-extension.json");assert.equal(JSON.parse(fs.readFileSync(extensionFile,"utf8")).name,"owned-extension");
 const extensionPanel=gui.getByRole("complementary",{name:"File Preview Panel",exact:true});await extensionPanel.locator(".view-lines").click({position:{x:10,y:10}});
 await page.keyboard.press("Control+a");await page.keyboard.press("Backspace");await pasteEditor(JSON.stringify({name:"owned-extension",version:"1.0.0",description:"GCW_EXTENSION_EDIT_SAVED",skills:[],agents:[],mcpServers:{}},null,2)+"\n");await poll(()=>extensionPanel.getByTestId("gamecowork-file-save").isEnabled(),"extension editor dirty");await extensionPanel.getByTestId("gamecowork-file-save").click();await poll(()=>JSON.parse(fs.readFileSync(extensionFile,"utf8")).description==="GCW_EXTENSION_EDIT_SAVED","actual extension edited bytes");
 await capabilityPage("extensions");await toggle("extension","owned-extension",false);await toggle("extension","owned-extension",true);checks.push("Local extension creation, editor Save and enable/disable persist through the actual CLI");await snapshot("07-extension");
 await createDialog("extension","global-extension",true);await row("extension","global-extension").waitFor({state:"visible"});await row("extension","global-extension").hover();await row("extension","global-extension").locator('[data-telemetry-id="edit_extension"]').click();
 const globalExtensionEditor=gui.getByTestId("gamecowork-custom-editor");await poll(()=>globalExtensionEditor.getByRole("textbox",{name:"能力文件源码"}).isEnabled(),"global extension loaded");
 const globalExtensionContent=JSON.stringify({name:"global-extension",version:"1.0.0",description:"GCW_GLOBAL_EXTENSION_SAVED",skills:[],agents:[],mcpServers:{}},null,2)+"\n";
 await globalExtensionEditor.getByRole("textbox",{name:"能力文件源码"}).fill(globalExtensionContent);await globalExtensionEditor.getByTestId("gamecowork-custom-save").click();
 const globalExtensionFile=path.join(root,"data/cli-state/extensions/global-extension/gemini-extension.json");await poll(()=>fs.readFileSync(globalExtensionFile,"utf8")===globalExtensionContent,"global extension real Save");await globalExtensionEditor.getByRole("button",{name:"关闭",exact:true}).click();
 await toggle("extension","global-extension",false,true);await toggle("extension","global-extension",true,true);checks.push("Global extension creation/edit and enable/disable use actual scoped global storage");await snapshot("07-global-extension");
 await context.close();context=null;await stopShell();origin=await launch();await startBrowser("custom-profile-restart");
 await gui.getByRole("button",{name:"Workspace A",exact:true}).first().click();await capabilityPage("skills");await row("skill","owned-skill").waitFor({state:"visible"});await row("skill","global-owned").waitFor({state:"visible"});
 await capabilityPage("extensions");await row("extension","owned-extension").waitFor({state:"visible"});assert.equal(JSON.parse(fs.readFileSync(extensionFile,"utf8")).description,"GCW_EXTENSION_EDIT_SAVED");checks.push("A restarted host/Core/CLI and fresh browser discover persisted skills and edited extension");
 await remove("extension","owned-extension");assert.equal(fs.existsSync(path.dirname(extensionFile)),false);checks.push("Extension uninstall removes its actual directory and the UI row");
 await row("extension","global-extension").waitFor({state:"visible"});assert.equal(JSON.parse(fs.readFileSync(globalExtensionFile,"utf8")).description,"GCW_GLOBAL_EXTENSION_SAVED");await remove("extension","global-extension");assert.equal(fs.existsSync(path.dirname(globalExtensionFile)),false);
 await capabilityPage("skills");await remove("skill","global-owned");assert.equal(fs.existsSync(path.dirname(globalFile)),false);checks.push("Restarted global skills/extensions retain edited contents and uninstall removes their true directories");
 await configureProviderUI();await gui.getByRole("button",{name:/^新建会话/}).first().click();await selectModelUI();
 await prompt("GCW_E2E_LOCAL_SKILL: activate the owned skill then read its fixture file.");
 await gui.locator('[data-permission-option-kind="allow_once"]').first().click();
 await gui.getByText("GCW_E2E_LOCAL_SKILL_CONFIRMED",{exact:false}).last().waitFor({state:"visible",timeout:30000});
 await poll(async()=>!(await state()).isStreaming,"skill action done");await snapshot("08-skill-activated");
 assert.ok(mock.requests.some(record=>record.scenario==="GCW_E2E_LOCAL_SKILL"&&record.toolResultVerified&&record.verifiedStepCount===2));checks.push("The actual Agent activates the saved skill and performs a real read tool, matching both issued result IDs");
 }
 if(!args.includes("--skills-only"))await verifyMcpUI();
 }
 const unexpectedRpcErrors=rpcErrors.filter(call=>!(call.type==="custom/create"&&/EEXIST/.test(call.error))&&!(call.type==="skills/installUpload"&&/Unsafe archive path/.test(call.error))&&!(call.type==="custom/update"&&/changed on disk/.test(call.error)));
 assert.deepEqual(unexpectedRpcErrors,[],"No optional probe or management error may be hidden by the expected negative cases");
 assert.deepEqual(browserErrors,[]);assert.deepEqual(guardNetworkAttempts(),[]);assert.deepEqual([...new Set(blocked)],[]);
 console.log(JSON.stringify({status:"passed",root,checks,browserErrors,rpcErrors},null,2));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error);if(gui)await snapshot("failure").catch(()=>{});}
finally{if(gui) mcpFormTrace.push(...await gui.evaluate(()=>window.__gamecoworkMcpFocusTrace||[]).catch(()=>[]));await context?.close();await stopShell();await mock.close();await mcp.close();fs.writeFileSync(path.join(root,"mcp-form-trace.json"),JSON.stringify({events:mcpFormTrace,configRequests:mcpConfigRequests},null,2));fs.writeFileSync(path.join(root,"shell.log"),shellLog);fs.writeFileSync(path.join(root,"custom-report.json"),JSON.stringify({checks,failure,browserErrors,rpcErrors,rpcObserved,mcpConfigRequests,settingsReadRetries,providerRequests:mock.requests,mcpRequests:mcp.requests,guardNetworkAttempts:guardNetworkAttempts(),blockedExternalOrigins:[...new Set(blocked)],previous,packaged,binary,coreDir,frontendDir,agent,agentGuarded:manifest.testGuardIncluded,packagedAgentSourceVerified,browserMode:"headless Chromium actual Rust/Core/frontend; native Wry geometry is not exercised"},null,2));}
