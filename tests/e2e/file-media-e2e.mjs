// Real GUI -> Rust -> restored core -> guarded own compiled CLI -> loopback mock.
// No fake core, real provider/account, editor or existing user state is used.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { randomUUID, createHash } from "node:crypto";
import { deflateSync } from "node:zlib";
import { startMockProvider } from "../fixtures/mock-provider.mjs";

const project = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const base = path.resolve(project, "../../temp/GameCowork");
const root = path.resolve(option("--output", path.join(base, "file-media-e2e-" + randomUUID())));
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
// Native small fixtures only. No generation service, external data, or real
// editor is used. Media decoding and UI rendering still run in actual Chromium.
const crc = bytes => { let value=0xffffffff;for(const byte of bytes){value ^= byte;for(let bit=0;bit<8;bit++)value=(value>>>1)^((value&1)?0xedb88320:0);}return(value^0xffffffff)>>>0; };
const pngChunk=(kind,data)=>{const label=Buffer.from(kind);const result=Buffer.alloc(data.length+12);result.writeUInt32BE(data.length,0);label.copy(result,4);data.copy(result,8);result.writeUInt32BE(crc(Buffer.concat([label,data])),data.length+8);return result;};
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(48,0);ihdr.writeUInt32BE(32,4);ihdr[8]=8;ihdr[9]=6;
const rgba=Buffer.alloc((48*4+1)*32);for(let y=0;y<32;y++)for(let x=0;x<48;x++){const pos=y*(48*4+1)+1+x*4;rgba[pos]=20+x*4;rgba[pos+1]=150;rgba[pos+2]=170;rgba[pos+3]=255;}
fs.writeFileSync(path.join(workspaces.a,"fixture.png"),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk("IHDR",ihdr),pngChunk("IDAT",deflateSync(rgba)),pngChunk("IEND",Buffer.alloc(0))]));
const positions=Buffer.from(new Float32Array([-.6,0,0,.6,0,0,0,.8,0]).buffer);
const gltf={asset:{version:"2.0",generator:"GameCowork owned test fixture"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0},material:0}]}],materials:[{doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[.1,.8,.5,1],metallicFactor:0,roughnessFactor:1}}],buffers:[{byteLength:positions.length}],bufferViews:[{buffer:0,byteOffset:0,byteLength:positions.length,target:34962}],accessors:[{bufferView:0,componentType:5126,count:3,type:"VEC3",min:[-.6,0,0],max:[.6,.8,0]}]};
const json=Buffer.from(JSON.stringify(gltf));const padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
const glb=Buffer.alloc(12+8+padded.length+8+positions.length);glb.writeUInt32LE(0x46546c67,0);glb.writeUInt32LE(2,4);glb.writeUInt32LE(glb.length,8);glb.writeUInt32LE(padded.length,12);glb.writeUInt32LE(0x4e4f534a,16);padded.copy(glb,20);glb.writeUInt32LE(positions.length,20+padded.length);glb.writeUInt32LE(0x004e4942,24+padded.length);positions.copy(glb,28+padded.length);
fs.writeFileSync(path.join(workspaces.a,"fixture.glb"),glb);
gltf.buffers[0].uri="data:application/octet-stream;base64,"+positions.toString("base64");
fs.writeFileSync(path.join(workspaces.a,"fixture.gltf"),JSON.stringify(gltf));
const samples=8000;const wave=Buffer.alloc(44+samples*2);wave.write("RIFF",0);wave.writeUInt32LE(wave.length-8,4);wave.write("WAVEfmt ",8);wave.writeUInt32LE(16,16);wave.writeUInt16LE(1,20);wave.writeUInt16LE(1,22);wave.writeUInt32LE(8000,24);wave.writeUInt32LE(16000,28);wave.writeUInt16LE(2,32);wave.writeUInt16LE(16,34);wave.write("data",36);wave.writeUInt32LE(samples*2,40);for(let n=0;n<samples;n++)wave.writeInt16LE(Math.round(Math.sin(n/8000*440*2*Math.PI)*1400),44+n*2);
fs.writeFileSync(path.join(workspaces.a,"fixture.wav"),wave);
execFileSync(option("--ffmpeg","ffmpeg"),["-nostdin","-hide_banner","-loglevel","error","-f","lavfi","-i","color=c=0x17b89a:s=32x32:d=1.5","-c:v","libvpx-vp9","-an",path.join(workspaces.a,"fixture.webm")],{windowsHide:true});
fs.writeFileSync(path.join(workspaces.a,"search-note.txt"),"Line one\n第二行 GCW_SEARCH_NEEDLE here\nFinal line\n");
for(const name of["clean","dirty"])fs.writeFileSync(path.join(workspaces.a,name+".txt"),"GCW_"+name.toUpperCase()+"_ORIGINAL\n");
const mock=await startMockProvider();
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
let panel;
async function openFile(name){await panel.getByText(name,{exact:true}).first().click();}
async function snapshotMedia(name){await snapshot(name);}
async function inspectMedia(tag,file){
  await openFile(file);
  const element=panel.locator(tag).first();
  await element.waitFor({state:"attached"});
  await poll(()=>element.evaluate(media=>Number.isFinite(media.duration)&&media.duration>0&&media.readyState>=2),tag+" real metadata");
  assert.equal(await element.evaluate(media=>media.error?.code||null),null);
  if(tag==="video") {const bounds=await element.boundingBox();assert.ok(bounds.width>=200&&bounds.height>=120,"Small video must remain visibly inspectable behind its controls");}
  const play=panel.getByRole("button",{name:/^(播放|Play)$/}).last();
  await play.click();
  await poll(()=>element.evaluate(media=>media.currentTime>.08),tag+" real playback");
  await panel.hover();
  const pause=panel.getByRole("button",{name:/^(暂停|Pause)$/}).last();
  await pause.click();
  await poll(()=>element.evaluate(media=>media.paused),tag+" paused");
  checks.push("Actual "+tag+" decoder loads the owned file and Play/Pause advances/stops playback");
  await snapshotMedia(tag+"-preview");
}
let failure;
try{
 origin=await launch();await startBrowser("media-profile");await openWorkspaceUI(workspaces.a,"A");
 await gui.locator('[data-telemetry-id="toggle_right_sidebar"]').first().click();
 await gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]').click();
 await gui.getByText(/^(文件浏览器|资源管理器|Explorer)$/).last().click();
 panel=gui.getByRole("complementary",{name:"File Preview Panel",exact:true});
 await openFile("fixture.png");
 await gui.locator('[data-telemetry-id="enter_right_sidebar_fullscreen"]').click();
 const image=panel.locator(".file-preview-image");
 await poll(()=>image.evaluate(image=>image.complete&&image.naturalWidth===48&&image.naturalHeight===32),"PNG actual pixels");
 checks.push("Owned PNG decodes into the actual file image preview");await snapshotMedia("01-png-preview");
 for(const file of["fixture.glb","fixture.gltf"]){
   await openFile(file);
   await panel.locator(".file-preview-model canvas").waitFor({state:"visible",timeout:30000});
   await poll(async()=>await panel.locator(".file-preview-model__overlay").count()===0,file+" parsed and rendered model");
   const size=await panel.locator(".file-preview-model canvas").boundingBox();assert.ok(size.width>100&&size.height>100);
   checks.push(file+" parses and shows its embedded triangle in a real WebGL canvas");
   await snapshotMedia(file+"-preview");
 }
 await inspectMedia("audio","fixture.wav");await inspectMedia("video","fixture.webm");
 await panel.locator('[data-telemetry-id="file_preview_search"]').click();
 const search=panel.getByRole("textbox").filter({visible:true}).first();
 await search.fill("GCW_SEARCH_NEEDLE");
 await panel.getByText("第二行 GCW_SEARCH_NEEDLE here",{exact:false}).first().waitFor({state:"visible"});
 await snapshotMedia("06-search-results");
 await panel.getByText("第二行 GCW_SEARCH_NEEDLE here",{exact:false}).first().click();
 await gui.getByRole("tab",{name:/search-note\.txt/}).waitFor({state:"visible"});
 await panel.locator(".monaco-editor .view-lines").getByText("GCW_SEARCH_NEEDLE",{exact:false}).last().waitFor({state:"visible"});
 await poll(async()=>await panel.locator(".monaco-editor .active-line-number").first().textContent()==="2","search result reveals its actual second line");
 checks.push("Real filesystem content search finds the Unicode second-line match and opens its file");
 await snapshotMedia("06b-search-file-located");
 await panel.locator('[data-telemetry-id="file_preview_hide_search"]').click();
 await openFile("clean.txt");await panel.getByText("GCW_CLEAN_ORIGINAL",{exact:false}).last().waitFor({state:"visible"});
 fs.writeFileSync(path.join(workspaces.a,"clean.txt"),"GCW_CLEAN_EXTERNAL\n");
 await panel.getByText("GCW_CLEAN_EXTERNAL",{exact:false}).last().waitFor({state:"visible",timeout:30000});
 checks.push("Native watcher refreshes a clean open file after an external real write");await snapshotMedia("07-clean-refresh");
 fs.renameSync(path.join(workspaces.a,"clean.txt"),path.join(workspaces.a,"clean-renamed.txt"));
 await gui.getByRole("tab",{name:/clean-renamed\.txt/}).waitFor({state:"visible"});
 fs.writeFileSync(path.join(workspaces.a,"clean-renamed.txt"),"GCW_CLEAN_AFTER_RENAME\n");
 await panel.getByText("GCW_CLEAN_AFTER_RENAME",{exact:false}).last().waitFor({state:"visible",timeout:30000});
 checks.push("A clean tab still refreshes after its external rename and subsequent write");
 await openFile("dirty.txt");await panel.getByText("GCW_DIRTY_ORIGINAL",{exact:false}).last().click();
 await page.keyboard.press("Control+a");await page.keyboard.type("GCW_DIRTY_DRAFT_RETAINED");
 await poll(()=>panel.getByTestId("gamecowork-file-save").isEnabled(),"dirty draft");
 fs.renameSync(path.join(workspaces.a,"dirty.txt"),path.join(workspaces.a,"dirty-renamed.txt"));
 const tree=panel.locator(".tauri-file-preview-panel__section--tree");
 await tree.getByText("dirty-renamed.txt",{exact:true}).waitFor({state:"visible",timeout:30000});
 assert.ok(await panel.getByText("GCW_DIRTY_DRAFT_RETAINED",{exact:false}).last().isVisible());
 assert.ok(await panel.getByTestId("gamecowork-file-save").isEnabled());
 checks.push("External native rename updates the tree while preserving the unsaved editor draft");await snapshotMedia("08-dirty-renamed");
 fs.writeFileSync(path.join(workspaces.a,"dirty.txt"),"GCW_RECREATED_OLD_NAME\n");
 await tree.getByText("dirty.txt",{exact:true}).waitFor({state:"visible"});
 await openFile("dirty.txt");await panel.getByText("GCW_RECREATED_OLD_NAME",{exact:false}).last().waitFor({state:"visible"});
 await gui.getByRole("tab",{name:/dirty-renamed\.txt/}).click();
 await panel.getByText("GCW_DIRTY_DRAFT_RETAINED",{exact:false}).last().waitFor({state:"visible"});
 checks.push("Recreating and opening the old filename cannot select or replace the renamed dirty draft");
 fs.unlinkSync(path.join(workspaces.a,"dirty-renamed.txt"));
 await tree.getByText("dirty-renamed.txt",{exact:true}).waitFor({state:"hidden",timeout:30000});
 assert.ok(await panel.getByText("GCW_DIRTY_DRAFT_RETAINED",{exact:false}).last().isVisible());
 checks.push("External deletion leaves the dirty draft readable for recovery");await snapshotMedia("09-dirty-deleted");
 assert.deepEqual(browserErrors,[]);assert.deepEqual(guardNetworkAttempts(),[]);assert.deepEqual([...new Set(blocked)],[]);
 console.log(JSON.stringify({status:"passed",checks,root,browserErrors,guardNetworkAttempts:[],blockedExternalOrigins:[]},null,2));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error);if(gui)await snapshot("failure").catch(()=>{});}
finally{await context?.close();await stopShell();await mock.close();fs.writeFileSync(path.join(root,"shell.log"),shellLog);fs.writeFileSync(path.join(root,"media-report.json"),JSON.stringify({checks,failure,browserErrors,rpcErrors,rpcObserved,guardNetworkAttempts:guardNetworkAttempts(),blockedExternalOrigins:[...new Set(blocked)],packaged,binary,frontendDir,coreDir,agent,packagedAgentSourceVerified,browserMode:"headless Chromium against actual Release HTTP host; native Wry geometry is not exercised"},null,2));}
