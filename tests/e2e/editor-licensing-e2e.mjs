// Actual dual-generation GUI + Rust status/refusal routes. Official services and
// native URL opening are blocked; all Hub/editor/project data belongs to fixtures.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { dismissToastStack } from "../support/dismiss-toast-stack.mjs";
const project = fileURLToPath(new URL("../../", import.meta.url)), args = process.argv.slice(2);
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const temp = path.resolve(project, "codelyreversebackup/work"), run = path.resolve(option("--output", path.join(temp, "editor-licensing-" + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep));
const previous = args.includes("--previous"), binary = path.resolve(option("--binary", path.join(project, "src/shell/target/debug/GameCowork.exe")));
const frontend = path.resolve(option("--frontend", path.join(project, "src/frontend/bundle"))), snapshotFile = path.join(run, "hub-fixture.json"), workspace = path.join(run, "projects/FixtureUnity");
assert.ok(fs.existsSync(path.join(frontend, "gui.html")), "The selected maintained or packaged frontend must exist");
for (const directory of [run, path.join(workspace, "Assets"), path.join(workspace, "Packages"), path.join(workspace, "ProjectSettings")]) fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(workspace, "ProjectSettings/ProjectVersion.txt"), "m_EditorVersion: 6000.0.5f1\n");
fs.writeFileSync(path.join(workspace, "Packages/manifest.json"), '{"dependencies":{}}\n');
const unity = path.join(run, "editors/Unity/Editor/Unity.exe"), tuanjie = path.join(run, "editors/Tuanjie/Editor/Tuanjie.exe"), second = path.join(run, "editors/UnitySecond/Editor/Unity.exe");
for (const file of [unity, tuanjie, second]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, "OWNED EDITOR METADATA FIXTURE - NEVER EXECUTED\n", { flag: "wx" });
}
const snapshot = [{ product: "unity", projects: [{ path: workspace, editor_version: "6000.0.5f1", last_modified_display: "2026-10-02T00:00:00Z" }],
  editors: [{ path: unity, version: "6000.0.5f1" }] }, { product: "tuanjie", projects: [], editors: [{ path: tuanjie, version: "2022.3.38t2", tuanjie_editor_version: "1.3.2" }] }];
fs.writeFileSync(snapshotFile, JSON.stringify(snapshot));
let shell, browser, page, gui, origin, shellLog = "";
const checks = [], errors = [], external = [], requests = [], openedLinks = [], openProjectFrames = [];
function modulePath() {
  const explicit = option("--playwright", process.env.GAMECOWORK_E2E_PLAYWRIGHT); if (explicit) return path.resolve(explicit);
  try { return createRequire(import.meta.url).resolve("playwright"); } catch {}
  const cache = path.join(process.env.LOCALAPPDATA, "npm-cache/_npx");
  const files = fs.readdirSync(cache).map(name => path.join(cache, name, "node_modules/playwright/index.mjs")).filter(file => fs.existsSync(file)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  assert.ok(files.length, "Local Playwright runtime required"); return files[0];
}
function chromePath() {
  const explicit = option("--chrome", process.env.GAMECOWORK_E2E_CHROME); if (explicit) return path.resolve(explicit);
  const cache = path.join(process.env.LOCALAPPDATA, "ms-playwright");
  for (const folder of fs.readdirSync(cache).filter(name => /^chromium-\d+$/.test(name)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1])))
    for (const suffix of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe"]) if (fs.existsSync(path.join(cache, folder, suffix))) return path.join(cache, folder, suffix);
}
async function poll(callback, label) {
  const deadline = Date.now() + 30000;
  while (!await callback()) { assert.ok(Date.now() < deadline, label); await new Promise(resolve => setTimeout(resolve, 100)); }
}
async function launch() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key) || key === "NODE_OPTIONS") delete env[key];
  Object.assign(env, { GAMECOWORK_APP_ROOT: run, GAMECOWORK_FRONTEND_DIR: frontend, GAMECOWORK_CORE_DIR: path.join(project, "tests"),
    GAMECOWORK_CORE_ENTRY: path.join(project, "tests/fixtures/core-fixture.mjs"), GAMECOWORK_DATA_DIR: path.join(run, "data"),
    GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_FIXTURE_DATA_DIR: run,
    GAMECOWORK_FIXTURE_HUB_SNAPSHOT: snapshotFile, GAMECOWORK_FIXTURE_LOG: path.join(run, "core-frames.jsonl") });
  shell = spawn(binary, [], { cwd: run, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Own Rust startup timed out")), 60000);
    function consume(bytes) { shellLog += bytes.toString(); const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/); if (match) { clearTimeout(timer); resolve(match[1]); } }
    shell.stdout.on("data", consume); shell.stderr.on("data", consume);
    shell.once("error", error => { clearTimeout(timer); reject(error); });
    shell.once("exit", code => { clearTimeout(timer); reject(new Error("Own Rust exited " + code)); });
  });
}
async function rpc(messageType, data = {}) {
  const response = await fetch(new URL("/api/tauri/invoke", origin), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messageType, messageId: randomUUID(), data }) });
  assert.equal(response.status, 200); return (await response.json()).data;
}
async function capture(name) {
  fs.writeFileSync(path.join(run, name + ".aria.txt"), await gui.locator("body").ariaSnapshot());
  await page.screenshot({ path: path.join(run, name + ".png"), fullPage: true, animations: "disabled" });
}
let failure;
try {
  origin = await launch();
  const status = await rpc("tjhub/getLicenses"); assert.equal(status.status, "success");
  assert.equal(status.content.workspaceAllowed, true); assert.equal(status.content.isValid, null); assert.equal(status.content.editorLicenseValid, null);
  assert.deepEqual(status.content.editorScopes.map(scope => [scope.product, scope.status, scope.isValid]), [["unity", "not-detected", null], ["tuanjie", "not-detected", null]]);
  for (const method of ["activateLicense", "activatePersonalLicense", "generateLicenseRequest", "importLicenseFile", "returnLicense", "updateServerConfig"]) {
    const response = await rpc("tjhub/" + method); assert.equal(response.status, "error"); assert.match(response.error, /official Unity Hub/); assert.match(response.error, /Tuanjie/);
  }
  const serverConfig = await rpc("tjhub/getServerConfig"); assert.equal(serverConfig.status, "error"); assert.match(serverConfig.error, /official Unity Hub/);
  assert.deepEqual((await rpc("tjhub/getLicenses")).content, status.content);
  checks.push("Real Rust status separates local workspace permission from undetected Unity/Tuanjie licenses; six license mutations and official server-config reads are refused");
  const { chromium } = await import(pathToFileURL(modulePath()).href);
  browser = await chromium.launchPersistentContext(path.join(run, "chromium-profile"), { headless: true, executablePath: chromePath(), viewport: { width: 1440, height: 960 }, locale: "zh-CN", colorScheme: "dark", serviceWorkers: "block" });
  await browser.route("**/*", async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname === "/api/tauri/invoke") {
      let body; try { body = request.postDataJSON(); body = body.message || body; } catch {}
      if (body) requests.push(body);
      if (body?.messageType === "openUrl") {
        openedLinks.push(body.data?.url || body.data);
        return route.fulfill({ contentType: "application/json", body: JSON.stringify({ messageId: body.messageId, messageType: body.messageType, data: { status: "success", content: null, done: true } }) });
      }
    }
    if (url.hostname === "127.0.0.1" || ["data:", "blob:"].includes(url.protocol)) return route.continue();
    external.push(url.origin); return route.abort("blockedbyclient");
  });
  if (previous) await browser.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontend, "gui.html"), "utf8")
    .replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await browser.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ""; });
  page = browser.pages()[0] || await browser.newPage(); page.on("pageerror", error => errors.push(String(error)));
  page.on("response", async response => {
    if (!response.url().endsWith("/api/tauri/invoke")) return;
    try {
      let request = response.request().postDataJSON(); request = request.message || request;
      if (request.messageType === "tjhub/openProject") openProjectFrames.push(await response.json());
    } catch {}
  });
  await page.goto(origin, { waitUntil: "domcontentloaded" }); await poll(() => page.frames().some(frame => frame.url().includes("/gui.html")), "GUI frame");
  gui = page.frames().find(frame => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ }); await next.first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  for (let i = 0; i < 4 && await next.count() && await next.first().isVisible(); i++) await next.first().click();
  await gui.getByText(/^(项目|Projects)$/).first().click();
  await gui.getByText("FixtureUnity", { exact: true }).first().waitFor({ state: "visible" });
  await gui.getByTestId("gamecowork-unity-licenses-entry").click();
  await gui.getByTestId("gamecowork-unity-licenses").waitFor({ state: "visible" });
  await gui.getByTestId("gamecowork-workspace-permission").filter({ hasText: "本地工作区操作可用" }).waitFor({ state: "visible" });
  assert.equal(await gui.getByTestId("gamecowork-unity-license-status").textContent(), "Unity 许可证：尚未检测");
  assert.equal(await gui.getByTestId("gamecowork-tuanjie-license-status").textContent(), "团结引擎许可证：尚未检测");
  assert.equal(await gui.getByRole("textbox").count(), 0, "Local license page has no serial/server/file activation form");
  assert.equal(await gui.getByTestId("gamecowork-license-error").count(), 0); assert.deepEqual(openedLinks, []);
  await capture("01-unity-license-scope");
  const beforeRefresh = requests.filter(row => row.messageType === "tjhub/getLicenses").length;
  await gui.getByTestId("gamecowork-license-refresh").click();
  await poll(() => requests.filter(row => row.messageType === "tjhub/getLicenses").length > beforeRefresh, "license refresh RPC");
  await gui.getByTestId("gamecowork-unity-license-help").click(); await gui.getByTestId("gamecowork-unity-hub-download").click();
  await poll(() => openedLinks.length === 2, "explicit official help clicks");
  assert.deepEqual(openedLinks, ["https://docs.unity.com/en-us/hub/manage-license", "https://docs.unity.com/en-us/hub/install-hub"]);
  assert.ok(!requests.some(row => /tjhub\/(activate|importLicense|returnLicense|generateLicense|updateServerConfig)/.test(row.messageType)));
  checks.push("Actual GUI explicitly names Unity, keeps independent undetected statuses, and opens only verified official help after user clicks");
  await gui.getByRole("button", { name: "返回项目", exact: true }).click();
  const templatesBefore = requests.filter(row => row.messageType === "tjhub/getTemplates").length;
  await gui.getByRole("button", { name: /^(新项目|新建项目|New project)$/i }).first().click();
  await poll(() => requests.filter(row => row.messageType === "tjhub/getTemplates").length > templatesBefore, "actual new-project page after local permission check");
  assert.equal(await gui.getByTestId("gamecowork-unity-licenses").count(), 0);
  await capture("01b-undetected-license-template-page");
  checks.push("New project reaches the actual template page while Editor license status is undetected");
  await gui.getByText(/^(新项目|新建项目|New project)$/i, { exact: true }).first().click();
  await gui.getByText("FixtureUnity", { exact: true }).first().click();
  await poll(() => requests.some(row => row.messageType === "tjhub/openProject"), "actual project open RPC without license dialog");
  const workspaces = await (await fetch(new URL("/api/tauri/hub/workspaces", origin))).json();
  assert.ok(workspaces.workspaces.some(row => path.resolve(row.workspaceDir).toLowerCase() === workspace.toLowerCase()));
  await poll(() => openProjectFrames.length > 0, "inner Editor-open result");
  assert.equal(openProjectFrames[0].data.status, "success"); assert.equal(openProjectFrames[0].data.content.success, true);
  assert.match(openProjectFrames[0].data.content.message, /Fixture editor launch recorded; no editor was started/);
  await capture("01c-workspace-open-fixture-editor");
  await dismissToastStack(gui, poll);
  checks.push("Existing project opens a local workspace without an undetected-license block; the inner Editor-open result is acknowledged only by the fixture and starts no real Editor");
  await gui.getByText(/^(项目|Projects)$/).first().click(); await gui.getByTestId("gamecowork-editor-installations-entry").click();
  await poll(async () => await gui.getByTestId("gamecowork-editor-row").count() === 2, "two fixture Editor rows");
  snapshot[0].editors.push({ path: second, version: "6000.1.0f1" }); fs.writeFileSync(snapshotFile, JSON.stringify(snapshot));
  assert.equal(Object.keys((await rpc("tjhub/getEditors")).content).length, 2, "Default reads preserve cached snapshot");
  await gui.getByTestId("gamecowork-editors-refresh").click();
  await poll(async () => await gui.getByTestId("gamecowork-editor-row").count() === 3, "fresh Hub scan after visible refresh");
  assert.ok(requests.some(row => row.messageType === "tjhub/getEditorInstallations" && row.data?.refresh === true));
  await capture("02-refreshed-editor-installations");
  fs.writeFileSync(snapshotFile, JSON.stringify([{ product: "unity", projects: [], editors: [{ path: "", version: "invalid" }] }]));
  await gui.getByTestId("gamecowork-editors-refresh").click(); await gui.getByTestId("gamecowork-editors-error").waitFor({ state: "visible" });
  assert.equal(await gui.getByTestId("gamecowork-editor-row").count(), 3, "Failed scan preserves committed rows");
  await capture("03-refresh-failure-retains-rows");
  fs.writeFileSync(snapshotFile, JSON.stringify(snapshot)); await gui.getByTestId("gamecowork-editors-retry").click();
  await gui.getByTestId("gamecowork-editors-error").waitFor({ state: "detached" });
  assert.equal(await gui.getByTestId("gamecowork-editor-row").count(), 3);
  checks.push("Visible Editor refresh rescans changed fixture state; a failed scan preserves prior rows and a real retry recovers");
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; if (gui) await capture("failure").catch(() => {}); }
finally {
  await browser?.close();
  if (shell && shell.exitCode === null) { const exited = new Promise(resolve => shell.once("exit", resolve)); shell.kill(); await exited; }
  fs.writeFileSync(path.join(run, "shell.log"), shellLog);
  fs.writeFileSync(path.join(run, "result.json"), JSON.stringify({ run, binary, frontend, previous, checks, failure, errors, external, requests, openedLinks, openProjectFrames,
    fixtureCore: true, nativeUrlOpeningIntercepted: true, browserMode: "actual Chromium UI against isolated Rust HTTP; no account/license files accessed" }, null, 2));
  console.log(JSON.stringify({ run, previous, checks, failure, errors, external }, null, 2));
}
