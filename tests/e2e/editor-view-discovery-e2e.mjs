// Actual Rust + desktop/GUI, disconnected deterministic core, no Editor/Provider.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url)), args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const temp = path.resolve(repo, "../../temp/GameCowork"), previous = args.includes("--previous"), packaged = args.includes("--packaged"), unknownMetadata = args.includes("--unknown-metadata");
const run = path.resolve(option("--output", path.join(temp, "editor-view-discovery-" + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep)); assert.equal(fs.existsSync(run), false);
const appRoot = path.resolve(option("--app-root", path.join(repo, "app")));
const frontend = packaged ? path.join(appRoot, "frontend") : path.join(repo, "src/frontend/bundle");
const binary = path.resolve(option("--binary", packaged ? path.join(appRoot, "GameCowork.exe") : path.join(repo, "src/shell/target/debug/GameCowork.exe")));
const projects = ["OwnedUnityA", "OwnedUnityB"].map(name => ({ name, root: path.join(run, "projects", name) }));
const controlFile = path.join(run, "discovery-control.json");
const checks = [], errors = [], external = [], requests = [], responses = [], cleanupErrors = [], exec = promisify(execFile);
let shell, context, page, gui, origin, shellLog = "", failure;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const alive = pid => { try { process.kill(pid, 0); return true; } catch (error) { if (error.code === "ESRCH") return false; throw error; } };
async function until(fn, label, budget = 20000) { const end = Date.now() + budget; while (!await fn()) { assert.ok(!shell || alive(shell.pid), "Owned host alive: " + label); assert.ok(Date.now() < end, "Deadline: " + label); await delay(80); } }
function playwright() { try { return createRequire(import.meta.url).resolve("playwright"); } catch {} const base = path.join(process.env.LOCALAPPDATA, "npm-cache/_npx"); return fs.readdirSync(base).map(name => path.join(base, name, "node_modules/playwright/index.mjs")).find(fs.existsSync); }
function chrome() { const base = path.join(process.env.LOCALAPPDATA, "ms-playwright"), latest = fs.readdirSync(base).filter(name => /^chromium-\d+$/.test(name)).sort((a, b) => +b.split("-")[1] - +a.split("-")[1])[0]; return process.env.GAMECOWORK_E2E_CHROME || path.join(base, latest, "chrome-win64/chrome.exe"); }
async function post(route, data) { const response = await fetch(origin + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(10000) }); assert.equal(response.status, 200); return response.json(); }
async function uiState() { return gui.evaluate(async previous => { const { s } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js"); const state = s.getState(); return { key: state.hub.activeWorkspaceKey, sidebar: state.ui.rightSidebarActiveTab, visible: state.ui.isRightSidebarOpen }; }, previous); }
async function snapshot(name) { fs.writeFileSync(path.join(run, name + ".aria.txt"), await gui.locator("body").ariaSnapshot()); await page.screenshot({ path: path.join(run, name + ".png"), fullPage: true, animations: "disabled" }); }
const streamTab = () => gui.getByRole("tab", { name: /^(串流|Streaming)(\s|$)/ });
async function collapse() { const hide = gui.locator('[data-telemetry-id="hide_right_sidebar"]'); if (await hide.first().isVisible().catch(() => false)) await hide.first().click(); await until(async () => !await streamTab().isVisible().catch(() => false), "Sidebar collapses"); }
async function unknownDiscoveryFlow() {
  const [a, b] = projects, discovery = () => gui.getByTestId("unity-streaming-discovery"), recognize = () => gui.getByTestId("unity-discover-project");
  const control = value => fs.writeFileSync(controlFile, JSON.stringify(value));
  const delivered = marker => fs.readFileSync(path.join(run, "core-frames.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)).some(entry => entry.event === "discovery-delay-delivered" && entry.marker === marker);
  const scheduled = marker => fs.readFileSync(path.join(run, "core-frames.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)).some(entry => entry.event === "discovery-delay-scheduled" && entry.marker === marker);
  const metadataFor = key => gui.evaluate(async ({ previous, key }) => { const { s } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js"); return s.getState().unity.workspaces[key]?.projectInfo; }, { previous, key });
  async function select(project) { await gui.getByRole("button", { name: project.name, exact: true }).first().click(); await until(async () => (await uiState()).key === project.key, "Actual unknown project " + project.name); }
  async function openPanel() {
    if (await discovery().isVisible() && await streamTab().getAttribute("aria-selected") === "true") return;
    const entry = gui.getByTestId("unity_streaming_panel_entry");
    if (!await entry.isVisible()) await gui.locator('[data-telemetry-id="toggle_right_sidebar"]').first().click();
    await entry.waitFor({ state: "visible" }); await entry.click(); await discovery().waitFor({ state: "visible" });
    assert.equal(await streamTab().getAttribute("aria-selected"), "true");
  }
  await select(a); await until(async () => (await metadataFor(a.key))?.projectRoot == null, "Owned initial metadata failure remains unknown");
  await openPanel(); assert.equal(await recognize().isEnabled(), true); assert.equal(await gui.getByTestId("unity-streaming-connectors").count(), 0);
  await snapshot("unknown-01-visible-streaming-entry"); checks.push("An initial metadata failure cannot hide the right-sidebar streaming entry or its unknown-project panel, before creating a chat");
  await recognize().click(); await until(async () => /Owned discovery metadata permission probe unavailable/.test(await discovery().innerText()) && await recognize().isEnabled(), "Actual detection failure and retry release");
  checks.push("Explicit recognition preserves the actual metadata error and releases its busy state for retry");
  control({ phase: "delayed-a", delayedRoot: a.root, marker: "switch" }); await recognize().click();
  await until(async () => await recognize().isDisabled(), "Delayed A recognition is pending"); await select(b); await openPanel();
  await until(() => delivered("switch"), "Delayed A reply actually arrives after switch"); await delay(100);
  assert.equal((await metadataFor(b.key)).projectRoot, null); assert.equal(await gui.getByTestId("unity-streaming-connectors").count(), 0);
  await snapshot("unknown-02-old-a-reply-cannot-route-b"); checks.push("A real delayed recognition reply for A cannot replace B metadata or create B editor controls");
  control({ phase: "unknown" }); await select(a); await openPanel();
  control({ phase: "delayed-a", delayedRoot: a.root, marker: "close" }); await recognize().click();
  await until(async () => await recognize().isDisabled(), "Delayed A recognition before close");
  await until(() => scheduled("close"), "Actual A recognition reaches the core before close");
  assert.equal((await post("/api/tauri/hub/close-workspace", { workspaceKey: a.key })).ok, true);
  await until(async () => (await uiState()).key === b.key, "Closing A returns to B");
  await until(() => delivered("close"), "Delayed closed A reply is delivered"); await delay(100);
  const registry = await fetch(origin + "/api/tauri/hub/workspaces").then(response => response.json()); assert.equal(registry.workspaces.some(project => project.workspaceKey === a.key), false);
  assert.equal((await metadataFor(b.key)).projectRoot, null); await openPanel();
  checks.push("Closing A while recognition is pending preserves its closed registry and cannot publish into B");
  control({ phase: "non-unity" }); await recognize().click();
  await until(async () => /不是 Unity 或团结工程/.test(await discovery().innerText()) && await recognize().isEnabled(), "Actual non-Unity classification");
  assert.equal((await metadataFor(b.key)).isUnityProject, false); assert.equal(await gui.locator("[data-unity-view-type]").count(), 0);
  await snapshot("unknown-03-explicit-non-unity-status"); checks.push("An authoritative non-Unity result clearly disables editor streaming without opening an Editor or creating captures");
  control({ phase: "known" }); await recognize().click();
  const panel = gui.getByTestId("unity-streaming-connectors"); await panel.waitFor({ state: "visible" });
  assert.equal((await metadataFor(b.key)).isUnityProject, true); assert.equal(await panel.locator("[data-unity-view-type]").count(), 6);
  for (let index = 0; index < 6; index++) assert.equal(await panel.locator("[data-unity-view-type]").nth(index).isDisabled(), true);
  await snapshot("unknown-04-recognition-recovers-six-connectors"); checks.push("Retry recovers the exact B project and the existing six-view panel while honestly keeping its Editor disconnected");
  const actions = requests.map(request => request.messageType || request.message?.messageType);
  assert.deepEqual(actions.filter(action => /^(unity\/(openEditor|installMcpPackage)|unity\/windowBridge\/startStreamServer)$/.test(action)), []);
  assert.equal(page.frames().filter(frame => frame.url().includes("windowBridge.html")).length, 0); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  checks.push("Discovery and retries only read scoped metadata: no automatic Editor launch, bridge install, capture, Provider, external request or fatal GUI error");
}

try {
  fs.mkdirSync(run, { recursive: true });
  if (unknownMetadata) fs.writeFileSync(controlFile, JSON.stringify({ phase: "unknown" }));
  fs.cpSync(packaged ? path.join(appRoot, "editor-bridge") : path.join(repo, "src/editor-bridge"), path.join(run, "editor-bridge"), { recursive: true });
  for (const project of projects) { for (const directory of ["Assets", "Packages", "ProjectSettings"]) fs.mkdirSync(path.join(project.root, directory), { recursive: true }); fs.writeFileSync(path.join(project.root, "Packages/manifest.json"), '{"dependencies":{}}\n'); fs.writeFileSync(path.join(project.root, "ProjectSettings/ProjectVersion.txt"), "m_EditorVersion: 2022.3.1f1\n"); }
  const env = { ...process.env }; for (const key of Object.keys(env)) if (/^(GAMECOWORK_|CODELY_|OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key) || key === "NODE_OPTIONS") delete env[key];
  Object.assign(env, { GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_APP_ROOT: run, GAMECOWORK_DATA_DIR: path.join(run, "data"), GAMECOWORK_FRONTEND_DIR: frontend, GAMECOWORK_CORE_DIR: path.join(repo, "tests"), GAMECOWORK_CORE_ENTRY: path.join(repo, "tests/integration/editor-view-discovery-core.mjs"), GAMECOWORK_FIXTURE_DATA_DIR: run, GAMECOWORK_FIXTURE_LOG: path.join(run, "core-frames.jsonl"), GAMECOWORK_FIXTURE_PROJECT_A: projects[0].root, GAMECOWORK_FIXTURE_PROJECT_B: projects[1].root });
  if (unknownMetadata) env.GAMECOWORK_FIXTURE_DISCOVERY_CONTROL = controlFile;
  shell = spawn(binary, [], { cwd: run, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  for (const stream of [shell.stdout, shell.stderr]) stream.on("data", bytes => { shellLog += bytes; const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//); if (match) origin = match[1]; });
  await until(() => origin, "Own Rust fixture host", 30000);
  for (const project of projects) { const opened = await post("/api/tauri/hub/open-workspace", { path: project.root }); assert.equal(opened.ok, true); project.key = opened.workspaceKey; }
  checks.push("Actual Rust opens only two owned disconnected test projects");
  const { chromium } = await import(pathToFileURL(playwright()).href);
  context = await chromium.launchPersistentContext(path.join(run, "browser-profile"), { headless: true, executablePath: chrome(), viewport: { width: 1440, height: 960 }, locale: "zh-CN", colorScheme: "dark", serviceWorkers: "block", args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"] });
  await context.route("**/*", route => { const address = new URL(route.request().url()); if (address.hostname === "127.0.0.1" || ["data:", "blob:"].includes(address.protocol)) return route.continue(); external.push(address.origin); return route.abort("blockedbyclient"); });
  if (previous) await context.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontend, "gui.html"), "utf8").replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await context.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ""; localStorage.setItem("gamecowork-language", "zh"); });
  page = context.pages()[0] || await context.newPage(); page.on("pageerror", error => errors.push(error.message)); page.on("request", request => { if (request.url().endsWith("/api/tauri/invoke")) try { requests.push(request.postDataJSON()); } catch {} });
  page.on("response", async response => { if (response.url().endsWith("/api/tauri/invoke")) try { const request = response.request().postDataJSON(); responses.push({ rpcType: request.messageType || request.message?.messageType, frame: await response.json() }); } catch {} });
  await page.goto(origin, { waitUntil: "domcontentloaded" }); await until(() => page.frames().some(frame => frame.url().includes("/gui.html")), "Actual main GUI"); gui = page.frames().find(frame => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ }); await next.first().waitFor({ state: "visible", timeout: 3000 }).catch(() => {}); for (let step = 0; step < 4 && await next.count() && await next.first().isVisible(); step++) await next.first().click();
  if (unknownMetadata) await unknownDiscoveryFlow();
  else {
  await gui.getByRole("button", { name: projects[0].name, exact: true }).first().click(); await until(async () => (await uiState()).key === projects[0].key, "Actual active project A");
  await gui.getByText("Connector history " + projects[0].name, { exact: true }).first().click();
  await gui.locator('[data-telemetry-id="open_unity_window"]').waitFor({ state: "visible", timeout: 5000 }); await collapse();
  await gui.locator('[data-telemetry-id="open_unity_window"]').click(); await streamTab().waitFor({ state: "visible" });
  await until(() => streamTab().getAttribute("aria-selected").then(selected => selected === "true"), "Header selects streaming after expanding the real panel");
  assert.equal(page.frames().filter(frame => frame.url().includes("windowBridge.html")).length, 0); await snapshot("01-disconnected-header-entry");
  checks.push("Actual header expands a collapsed sidebar into its disconnected Unity view panel without starting a stream");
  await collapse(); await gui.getByRole("button", { name: projects[1].name, exact: true }).first().click(); await until(async () => (await uiState()).key === projects[1].key, "Actual active project B");
  await gui.getByText("Connector history " + projects[1].name, { exact: true }).first().click();
  await gui.evaluate(payload => window.postMessage({ source: "tauriShell", messageType: "shell/openUnityViews", data: payload }, window.location.origin), { workspaceKey: projects[0].key, workspaceRoot: projects[0].root, windowType: "UnityEditor.SceneView" }); await delay(250);
  assert.equal(await streamTab().isVisible().catch(() => false), false); checks.push("An obsolete same-origin request for A cannot open or capture the active B project");
  await gui.evaluate(payload => window.dispatchEvent(new MessageEvent("message", { source: window, origin: "http://other.invalid", data: { source: "tauriShell", messageType: "shell/openUnityViews", data: payload } })), { workspaceKey: projects[1].key, workspaceRoot: projects[1].root }); await delay(100);
  assert.equal(await streamTab().isVisible().catch(() => false), false); checks.push("The actual window listener rejects a foreign origin even with a valid B identity");
  await gui.locator('[data-telemetry-id="open_unity_window"]').click(); await streamTab().waitFor({ state: "visible" }); await until(() => streamTab().getAttribute("aria-selected").then(selected => selected === "true"), "Header uses the current B identity");
  assert.equal(page.frames().filter(frame => frame.url().includes("windowBridge.html")).length, 0); await snapshot("02-current-project-b-entry"); checks.push("Switching projects preserves the current identity for the visible header entry");
  const actions = requests.map(request => request.messageType || request.message?.messageType);
  assert.deepEqual(actions.filter(action => /^(unity\/(openEditor|installMcpPackage)|unity\/windowBridge\/startStreamServer)$/.test(action)), []);
  const received = fs.readFileSync(path.join(run, "core-frames.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)).filter(entry => entry.event === "received").map(entry => entry.frame.messageType);
  assert.deepEqual(received.filter(action => /^(unity\/(openEditor|installMcpPackage)|unity\/windowBridge\/startStreamServer)$/.test(action)), []);
  assert.deepEqual(errors, []); assert.deepEqual(external, []); checks.push("Browser and core evidence contain no automatic Editor launch, package install, stream start, external request or fatal GUI error");
  const panel = gui.getByTestId("unity-streaming-connectors"); await panel.waitFor({ state: "visible" });
  const types = panel.locator("[data-unity-view-type]"); assert.equal(await types.count(), 6);
  for (let index = 0; index < 6; index++) assert.equal(await types.nth(index).isDisabled(), true);
  await snapshot("03-six-disconnected-view-connectors"); checks.push("The actual independent streaming panel exposes all six disabled view connectors with its connection actions");
  await gui.locator('[data-telemetry-id="open_unity_editor"]').click();
  const card = gui.getByTestId("unity-connectors"); await card.waitFor({ state: "visible" }); assert.equal(await card.locator("[data-unity-view-type]").count(), 0);
  await card.locator('[data-telemetry-id="unity_open_views"]').click(); await until(async () => !await card.isVisible(), "View entry closes its popup");
  await until(() => streamTab().getAttribute("aria-selected").then(selected => selected === "true"), "Card opens the real view panel");
  await panel.waitFor({ state: "visible" });
  checks.push("The actual card view entry opens its fixed project panel without starting an Editor or capture");
  const manifestFile = path.join(projects[1].root, "Packages/manifest.json"), originalManifest = fs.readFileSync(manifestFile);
  await panel.locator('[data-telemetry-id="unity_install_local_bridge"]').click();
  await until(() => typeof JSON.parse(fs.readFileSync(manifestFile, "utf8")).dependencies?.["cn.gamecowork.bridge"] === "string", "Actual explicit Rust package write");
  await until(() => responses.some(reply => reply.rpcType === "unity/installMcpPackage"), "Actual install reply");
  const reply = responses.findLast(reply => reply.rpcType === "unity/installMcpPackage").frame; assert.equal(reply.data.status, "success");
  const installed = reply.data.content.content; assert.equal(installed.connected, false); assert.equal(installed.requiresEditorImport, true); assert.ok(installed.changeId);
  const packagePath = JSON.parse(fs.readFileSync(manifestFile, "utf8")).dependencies["cn.gamecowork.bridge"]; assert.equal(packagePath.replaceAll("\\", "/").toLowerCase(), "file:" + path.join(run, "editor-bridge").replaceAll("\\", "/").toLowerCase());
  const backups = [];
  function scan(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const name = path.join(directory, entry.name); if (entry.isDirectory()) scan(name); else if (entry.name === "before.bin") backups.push(name); } }
  scan(path.join(run, "data")); const backup = backups.find(file => fs.readFileSync(file).equals(originalManifest)); assert.ok(backup, "Rust writes an exact original-byte backup under isolated data");
  const changeRecord = JSON.parse(fs.readFileSync(path.join(path.dirname(backup), "manifest.json"), "utf8")); assert.equal(changeRecord.changeId ?? changeRecord.change_id, installed.changeId);
  assert.ok(fs.readFileSync(path.join(projects[0].root, "Packages/manifest.json")).equals(originalManifest), "Explicit B installation leaves A intact");
  await until(() => panel.locator('[data-telemetry-id="unity_retry_connection"]').isEnabled(), "Install busy state releases");
  const countBeforeRetry = requests.length; await panel.locator('[data-telemetry-id="unity_retry_connection"]').click();
  await until(() => panel.locator('[data-telemetry-id="unity_retry_connection"]').isEnabled(), "Disconnected retry releases its busy state");
  assert.ok(requests.slice(countBeforeRetry).some(request => ["unity/refresh", "unity/getStatus", "unity/getProjectStatus"].includes(request.messageType || request.message?.messageType)), "Retry performs actual scoped status detection");
  assert.match(await panel.innerText(), /团结.*未连接/); assert.equal(await types.count(), 6); for (let index = 0; index < 6; index++) assert.equal(await types.nth(index).isDisabled(), true);
  await snapshot("04-explicit-bridge-installed-still-disconnected"); checks.push("Explicit B bridge installation creates the real Rust byte backup and change record; retry releases busy while six views remain honestly disconnected");
  assert.deepEqual(requests.map(request => request.messageType || request.message?.messageType).filter(action => /^(unity\/openEditor|unity\/windowBridge\/startStreamServer)$/.test(action)), []);
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  }
} catch (error) { failure = { message: error.message, stack: error.stack }; if (gui && page) { await snapshot("failure").catch(() => {}); await gui.evaluate(async previous => { const { s } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js"); const state = s.getState(); return { unity: state.unity, hub: state.hub, ui: state.ui }; }, previous).then(value => fs.writeFileSync(path.join(run, "failure-state.json"), JSON.stringify(value, null, 2))).catch(() => {}); } throw error; }
finally {
  await context?.close().catch(error => cleanupErrors.push(error.message));
  if (shell && alive(shell.pid)) { await exec("taskkill.exe", ["/PID", String(shell.pid), "/F"], { windowsHide: true }).catch(error => cleanupErrors.push(error.message)); await until(() => !alive(shell.pid), "Exact owned host cleanup", 5000).catch(error => cleanupErrors.push(error.message)); }
  const fixtureProcesses = fs.existsSync(path.join(run, "core-frames.jsonl")) ? fs.readFileSync(path.join(run, "core-frames.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)).filter(entry => entry.event === "started").flatMap(entry => [entry.pid, entry.parentPid]).filter((pid, index, list) => Number.isSafeInteger(pid) && pid > 0 && list.indexOf(pid) === index).map(pid => ({ pid, alive: alive(pid) })) : [];
  if (fixtureProcesses.some(entry => entry.alive)) cleanupErrors.push("An exact owned core fixture process remains alive");
  fs.writeFileSync(path.join(run, "shell.log"), shellLog); fs.writeFileSync(path.join(run, "result.json"), JSON.stringify({ checks, failure, errors, external, requests, responses, previous, packaged, unknownMetadata, frontend, binary, projects, cleanupErrors, fixtureProcesses, hostPid: shell?.pid, hostAlive: shell ? alive(shell.pid) : false, actualEditorLaunched: false, syntheticCore: true }, null, 2));
  console.log(JSON.stringify({ run, previous, passed: checks.length, failure: failure?.message, cleanupErrors }));
  assert.deepEqual(cleanupErrors, [], "All exact owned test processes and browser resources must exit");
}
