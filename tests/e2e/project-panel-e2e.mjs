import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dismissToastStack } from "../support/dismiss-toast-stack.mjs";

// A real Chromium renders the shipped desktop + GUI against the Rust host and a
// fake stdio core. All data, logs, browser profiles, and screenshots stay in temp.
// No provider, Unity process, existing app installation, or account is used.
const root = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
}
const runDir = path.resolve(option("--output", path.join(root, "codelyreversebackup/work",
  `project-panel-e2e-${Date.now()}-${process.pid}`)));
const tempRoot = path.resolve(root, "codelyreversebackup/work");
assert.ok(runDir.toLowerCase().startsWith(tempRoot.toLowerCase() + path.sep), "E2E outputs must stay in a task directory below temp/GameCowork");
const binary = path.resolve(option("--binary", path.join(root, "src/shell/target/debug/GameCowork.exe")));
let baseUrl = option("--url");
const paths = { a: path.join(runDir, "projects/A"), b: path.join(runDir, "projects/B"), c: path.join(runDir, "projects/C") };
const samePath = (a, b) => String(a || "").replaceAll("\\", "/").toLowerCase() === String(b || "").replaceAll("\\", "/").toLowerCase();
fs.mkdirSync(runDir, { recursive: true });
for (const project of Object.values(paths)) {
  for (const dir of ["Assets", "Packages", "ProjectSettings"]) fs.mkdirSync(path.join(project, dir), { recursive: true });
  fs.writeFileSync(path.join(project, "Packages/manifest.json"), "{\"dependencies\":{}}\n");
  fs.writeFileSync(path.join(project, "ProjectSettings/ProjectVersion.txt"), "m_EditorVersion: 2022.3.1f1\n");
}

function playwrightModule() {
  const explicit = option("--playwright", process.env.GAMECOWORK_E2E_PLAYWRIGHT);
  if (explicit) return path.resolve(explicit);
  const require = createRequire(import.meta.url);
  try { return require.resolve("playwright"); } catch {}
  const cache = path.join(process.env.LOCALAPPDATA || os.tmpdir(), "npm-cache/_npx");
  const candidates = fs.existsSync(cache) ? fs.readdirSync(cache)
    .map((name) => path.join(cache, name, "node_modules/playwright/index.mjs"))
    .filter((file) => fs.existsSync(file))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs) : [];
  assert.ok(candidates.length, "A local Playwright library is required; pass --playwright /path/to/index.mjs");
  return candidates[0];
}

function chromiumBinary() {
  const explicit = option("--chrome", process.env.GAMECOWORK_E2E_CHROME);
  if (explicit) return path.resolve(explicit);
  const cache = path.join(process.env.LOCALAPPDATA || os.tmpdir(), "ms-playwright");
  const directories = fs.existsSync(cache) ? fs.readdirSync(cache)
    .filter((name) => /^chromium-\d+$/.test(name))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1])) : [];
  for (const dir of directories) for (const file of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe", "chrome-linux/chrome"])
    if (fs.existsSync(path.join(cache, dir, file))) return path.join(cache, dir, file);
  return undefined;
}

let shell;
let browser;
let page;
let gui;
let shellLog = "";
const errors = [];
const blocked = [];
const apiRequests = [];
const originalAssetRequests = [];
const checks = [];
const screenshots = [];

async function launchShell() {
  const entry = path.join(root, "tests/fixtures/core-fixture.mjs");
  assert.ok(fs.existsSync(binary), `Build the Rust shell before E2E: ${binary}`);
  assert.ok(fs.existsSync(entry), `Fake core fixture exists: ${entry}`);
  shell = spawn(binary, [], {
    cwd: runDir,
    windowsHide: true,
    env: {
      ...process.env,
      GAMECOWORK_APP_ROOT: runDir,
      GAMECOWORK_FRONTEND_DIR: path.join(root, "src/frontend/bundle"),
      GAMECOWORK_CORE_DIR: path.join(root, "tests"),
      GAMECOWORK_CORE_ENTRY: entry,
      GAMECOWORK_DATA_DIR: path.join(runDir, "app-data"),
      GAMECOWORK_HEADLESS: "1",
      GAMECOWORK_TEST_MODE: "1",
      GAMECOWORK_PICK_FOLDER: paths.c,
      GAMECOWORK_FIXTURE_DATA_DIR: runDir,
      GAMECOWORK_FIXTURE_LOG: path.join(runDir, "core-frames.jsonl"),
      GAMECOWORK_FIXTURE_PROJECT_A: paths.a,
      GAMECOWORK_FIXTURE_PROJECT_B: paths.b,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Rust host did not become ready within 60 seconds\n${shellLog}`)), 60000);
    const consume = (bytes) => {
      shellLog += bytes.toString();
      const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    };
    shell.stdout.on("data", consume);
    shell.stderr.on("data", consume);
    shell.once("error", (error) => { clearTimeout(timer); reject(error); });
    shell.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Rust host exited ${code}\n${shellLog}`)); });
  });
}

async function poll(predicate, description, timeout = 15000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    if (await predicate()) return;
    assert.ok(Date.now() < deadline, `Timed out waiting for ${description}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
async function dismissActiveToasts() {
  await dismissToastStack(gui, poll);
}

async function request(endpoint, body) {
  const response = await fetch(new URL(endpoint, baseUrl), body === undefined ? {} : {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}
async function hostProjects() {
  const response = await request("/api/tauri/invoke", { messageType: "tjhub/getRecentProjects", messageId: "e2e-project-list", data: {} });
  assert.equal(response.body.data.status, "success");
  return response.body.data.content;
}

try {
  if (!baseUrl) baseUrl = await launchShell();
  assert.equal(new URL(baseUrl).hostname, "127.0.0.1", "E2E only accepts an isolated loopback host");
  const { chromium } = await import(pathToFileURL(playwrightModule()).href);
  browser = await chromium.launchPersistentContext(path.join(runDir, "chromium-profile"), {
    headless: true, executablePath: chromiumBinary(), viewport: { width: 1440, height: 960 },
    locale: "zh-CN", colorScheme: "dark", serviceWorkers: "block",
    args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"],
  });
  await browser.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || ["data:", "blob:"].includes(url.protocol)) return route.continue();
    blocked.push(url.origin);
    await route.abort("blockedbyclient");
  });
  await browser.addInitScript(() => {
    window.vscMediaUrl = "";
    window.workspacePaths = [];
    window.GAMECOWORK_SHELL = true;
    localStorage.setItem("gamecowork-version-update-seen-features", JSON.stringify([
      "multi-workspace", "remote-access", "unity-streaming", "remote-workspace", "unity-window-streaming",
    ]));
  });
  page = browser.pages()[0] || await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.stack || String(error)));
  page.on("request", (req) => {
    if (["ai-generator.tuanjie.cn", "aicanvas.tuanjie.cn"].includes(new URL(req.url()).hostname)) originalAssetRequests.push(new URL(req.url()).origin);
    if (req.url().includes("/api/tauri/")) apiRequests.push({ url: new URL(req.url()).pathname, body: req.postData() });
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await poll(() => page.frames().some((frame) => frame.url().includes("/gui.html")), "the real GUI frame", 30000);
  gui = page.frames().find((frame) => frame.url().includes("/gui.html"));
  async function snapshot(label) {
    fs.writeFileSync(path.join(runDir, `${label}.aria.txt`), await gui.locator("body").ariaSnapshot());
    const file = path.join(runDir, `${label}.png`);
    await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
    screenshots.push(file);
  }
  async function uiState() {
    return gui.evaluate(async () => {
      const store = await import("/assets/store-c6kNGz30.js");
      const state = store.s.getState();
      return { activeWorkspaceKey: state.hub.activeWorkspaceKey, activeSessionId: state.session.activeSessionId, workspaces: state.hub.workspaces };
    });
  }
  async function projectTab() {
    await gui.getByText(/^(项目|Projects)$/).first().click();
  }
  const cleanErrors = () => assert.deepEqual(errors, [], "No fatal browser errors");
  await gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ }).first()
    .waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
  if (await gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ }).first().isVisible()) {
    const status = gui.getByTestId("gamecowork-capability-status");
    await status.waitFor({ state: "visible", timeout: 5000 });
    assert.equal(await status.textContent(), "本地多工作区已接通；远程访问正在接入；Scene/Game 实时预览已接通；完整编辑器串流正在接入");
    checks.push("Introduction shows available local workspaces and Scene/Game previews, with remote access and full editor streaming still pending");
  }
  await snapshot("01-startup");
  // Existing user-facing onboarding can appear once; dismiss through its controls.
  for (let step = 0; step < 4; step++) {
    const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
    if (!await next.count() || !await next.first().isVisible()) break;
    await next.first().click();
    await snapshot(`01-onboarding-${step}`);
  }
  await projectTab();
  await gui.getByText("A", { exact: true }).first().waitFor({ state: "visible", timeout: 15000 });
  await gui.getByText("B", { exact: true }).first().waitFor({ state: "visible", timeout: 15000 });
  cleanErrors();
  checks.push("Real project page leaves its skeleton and renders Unity A and Tuanjie B");
  await snapshot("02-projects-loaded");

  await gui.getByRole("button", { name: /^(添加|Add)$/ }).first().click();
  await snapshot("03-add-menu");
  await gui.getByText(/Add project from disk|从磁盘|本地项目/).first().click();
  await gui.getByText("C", { exact: true }).first().waitFor({ state: "visible", timeout: 15000 });
  assert.ok(apiRequests.some((entry) => /tjhub\/add(Project|FromDisk)/.test(entry.body || "")), "Add uses the real frontend RPC");
  assert.ok((await hostProjects()).some((entry) => samePath(entry.path, paths.c)), "Added project is in the Rust-owned project list");
  if (shell) assert.ok(JSON.parse(fs.readFileSync(path.join(runDir, "app-data/workspaces.json"), "utf8"))
    .records.some((entry) => samePath(entry.workspace.workspaceDir, paths.c)), "Added project was saved to isolated disk state");
  checks.push("Add project from disk uses the real picker/RPC and persists C");
  await snapshot("04-project-added");

  await projectTab();
  await gui.getByText("A", { exact: true }).first().click();
  await poll(async () => (await uiState()).workspaces.some((entry) => samePath(entry.workspaceDir, paths.a)), "A in the real sidebar");
  const aSessionId = (await uiState()).activeSessionId;
  await projectTab();
  await gui.getByText("B", { exact: true }).first().click();
  await poll(async () => (await uiState()).workspaces.some((entry) => samePath(entry.workspaceDir, paths.b)), "B in the real sidebar");
  const bSessionId = (await uiState()).activeSessionId;
  let state = await uiState();
  const a = state.workspaces.find((entry) => samePath(entry.workspaceDir, paths.a));
  const b = state.workspaces.find((entry) => samePath(entry.workspaceDir, paths.b));
  assert.ok(a && b, "Both workspaces coexist");
  await snapshot("05-both-workspaces");
  await gui.getByRole("button", { name: "A", exact: true }).first().click();
  await poll(async () => (await uiState()).activeWorkspaceKey === a.workspaceKey, "A selected by its sidebar button");
  assert.equal((await uiState()).activeSessionId, aSessionId, "A keeps its previous selected session");
  await snapshot("06-workspace-a");
  await gui.getByRole("button", { name: "B", exact: true }).first().click();
  await poll(async () => (await uiState()).activeWorkspaceKey === b.workspaceKey, "B selected by its sidebar button");
  assert.equal((await uiState()).activeSessionId, bSessionId, "B keeps its previous selected session");
  await snapshot("07-workspace-b");
  checks.push("Sidebar A/B switching changes the real frontend active workspace");

  await gui.getByRole("button", { name: "收起 A", exact: true }).click();
  assert.equal((await uiState()).activeWorkspaceKey, b.workspaceKey, "Collapsing A does not select it");
  await gui.getByRole("button", { name: "展开 A", exact: true }).click();
  assert.equal((await uiState()).activeWorkspaceKey, b.workspaceKey, "Expanding A does not select it");
  await browser.route("**/api/tauri/hub/switch-workspace", (route) => route.fulfill({
    status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, error: "fixture switch unavailable" }),
  }), { times: 1 });
  await gui.getByRole("button", { name: "A", exact: true }).first().click();
  await gui.getByText("fixture switch unavailable", { exact: true }).first().waitFor({ state: "visible" });
  assert.equal((await uiState()).activeWorkspaceKey, b.workspaceKey, "Failed switch preserves B");
  assert.equal((await uiState()).activeSessionId, bSessionId, "Failed switch preserves B's session");
  checks.push("Independent arrows do not select a workspace; failed switch has a visible error and preserves B");
  await snapshot("07b-failed-switch");
  await dismissActiveToasts();
  await gui.getByText("fixture switch unavailable", { exact: true }).first().waitFor({ state: "hidden" });

  const section = gui.locator('[class*="group/workspace-section"]').filter({ has: gui.getByRole("button", { name: "A", exact: true }) });
  await section.hover();
  await section.getByRole("button", { name: /工作区选项|Workspace options/i }).click();
  await snapshot("08-workspace-menu");
  await gui.locator('[data-telemetry-id="remove_workspace"]').click();
  await poll(async () => !(await uiState()).workspaces.some((entry) => entry.workspaceKey === a.workspaceKey), "A closed through the real sidebar");
  state = await uiState();
  assert.ok(state.workspaces.some((entry) => entry.workspaceKey === b.workspaceKey), "Closing A preserves B");
  assert.ok(!(await request("/api/tauri/hub/workspaces")).body.workspaces.some((entry) => entry.workspaceKey === a.workspaceKey), "Rust host also removed A");
  checks.push("Closing A removes it from frontend and host and preserves B");
  await snapshot("09-workspace-closed");

  const invalidPath = path.join(runDir, "does-not-exist");
  await browser.route("**/api/tauri/pick-folder-modal", async (route) => route.fulfill({
    contentType: "application/json", body: JSON.stringify({ cancelled: false, path: invalidPath }),
  }), { times: 1 });
  await projectTab();
  await gui.getByRole("button", { name: /^(添加|Add)$/ }).first().click();
  await snapshot("10-invalid-add-menu");
  const invalidResponse = page.waitForResponse((response) => /tjhub\/add(Project|FromDisk)/.test(response.request().postData() || "") &&
    response.request().postData().includes("does-not-exist"));
  await gui.getByText(/Add project from disk|从磁盘|本地项目/).first().click();
  const invalidResult = await (await invalidResponse).json();
  assert.equal(invalidResult.data.status, "error");
  await gui.getByText(invalidResult.data.error, { exact: true }).first().waitFor({ state: "visible", timeout: 15000 });
  assert.ok(!(await hostProjects()).some((entry) => samePath(entry.path, invalidPath)), "Invalid path was not persisted");
  checks.push("Invalid folder has a visible error and is absent from persisted projects");
  await snapshot("11-invalid-project-error");
  await dismissActiveToasts();
  await gui.getByRole("button", { name: /^(AI资产生成|AI 资产生成|AI Asset Generation)$/ }).click();
  const assets = gui.getByTestId("ai-creation-panel");
  await assets.waitFor({ state: "visible", timeout: 5000 });
  for (const name of [/^(快速生成|Quick Generate)$/, /^(画布|Canvas)$/, /^(生成记录|生成历史|Generation History)$/]) {
    assert.ok(await assets.getByRole("tab", { name }).isVisible(), "Original asset navigation remains reachable after project errors");
  }
  const creatorFrame = assets.locator('iframe');
  await creatorFrame.first().waitFor({state:'attached'});
  const creatorUrl = new URL(await creatorFrame.first().getAttribute('src'));
  assert.equal(creatorUrl.origin, new URL(baseUrl).origin);
  assert.equal(creatorUrl.pathname, '/lab3d');
  assert.equal(await gui.getByTestId('gamecowork-assets').count(), 0, 'The earlier custom asset panel is no longer mounted');
  assert.deepEqual(originalAssetRequests, [], "The original asset/Canvas service was never requested");
  // This project fixture does not implement the preserved client's APIs. The
  // real Core asset E2E owns identity, forms, media and graph interaction proof.
  checks.push("Project navigation reaches the original asset tabs and same-origin Creator iframe without loading the original service");
  await snapshot("12-assets-unconfigured");
  cleanErrors();
  console.log(JSON.stringify({ status: "passed", checks, runDir, screenshots, blockedExternalOrigins: [...new Set(blocked)] }, null, 2));
} catch (error) {
  if (page) await page.screenshot({ path: path.join(runDir, "failure.png"), fullPage: true }).catch(() => {});
  if (gui) fs.writeFileSync(path.join(runDir, "failure.aria.txt"), await gui.locator("body").ariaSnapshot().catch(() => ""));
  console.error(error);
  process.exitCode = 1;
} finally {
  fs.writeFileSync(path.join(runDir, "browser-report.json"), JSON.stringify({ checks, errors, blockedExternalOrigins: [...new Set(blocked)], originalAssetRequests, apiRequests, screenshots }, null, 2));
  fs.writeFileSync(path.join(runDir, "shell.log"), shellLog);
  await browser?.close();
  shell?.kill();
}
