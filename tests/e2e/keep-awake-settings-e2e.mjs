// Actual maintained settings UI + Rust persistence, with a deterministic Core.
// Headless/test mode suppresses native power requirements and external services.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
const project = fileURLToPath(new URL("../../", import.meta.url)), args = process.argv.slice(2);
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const temp = path.resolve(project, "../../temp/GameCowork"), run = path.resolve(option("--output", path.join(temp, "keep-awake-settings-" + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep));
const packaged = args.includes("--packaged"), previous = args.includes("--previous"), app = path.resolve(option("--app-root", path.join(project, "app")));
const binary = path.resolve(option("--binary", packaged ? path.join(app, "GameCowork.exe") : path.join(project, "src/shell/target/debug/GameCowork.exe")));
const frontend = packaged ? path.join(app, "frontend") : path.join(project, "src/frontend/bundle");
const data = path.join(run, "data"), preference = path.join(data, "keep-awake.json"), backup = preference + ".owned-fixture-backup";
fs.mkdirSync(run, { recursive: true });
let shell, context, page, gui, origin, shellLog = "";
const checks = [], errors = [], external = [], responses = [], assets = [];
function modulePath() {
  const explicit = option("--playwright", process.env.GAMECOWORK_E2E_PLAYWRIGHT); if (explicit) return path.resolve(explicit);
  try { return createRequire(import.meta.url).resolve("playwright"); } catch {}
  const cache = path.join(process.env.LOCALAPPDATA, "npm-cache/_npx");
  const files = fs.readdirSync(cache).map(name => path.join(cache, name, "node_modules/playwright/index.mjs")).filter(file => fs.existsSync(file)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  assert.ok(files.length); return files[0];
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
    GAMECOWORK_CORE_ENTRY: path.join(project, "tests/fixtures/core-fixture.mjs"), GAMECOWORK_DATA_DIR: data,
    GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_FIXTURE_DATA_DIR: run, GAMECOWORK_FIXTURE_LOG: path.join(run, "core-frames.jsonl") });
  shell = spawn(binary, [], { cwd: run, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  return new Promise((resolve, reject) => {
    let output = ""; const timer = setTimeout(() => reject(new Error("Own Rust startup timed out")), 60000);
    function consume(bytes) { output += bytes.toString(); shellLog += bytes.toString(); const match = output.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/); if (match) { clearTimeout(timer); resolve(match[1]); } }
    shell.stdout.on("data", consume); shell.stderr.on("data", consume);
    shell.once("error", error => { clearTimeout(timer); reject(error); });
    shell.once("exit", code => { clearTimeout(timer); reject(new Error("Own Rust exited " + code)); });
  });
}
async function stop() { if (!shell || shell.exitCode !== null) return; const exit = new Promise(resolve => shell.once("exit", resolve)); shell.kill(); await exit; }
async function snapshot(name) { fs.writeFileSync(path.join(run, name + ".aria.txt"), await gui.locator("body").ariaSnapshot()); await page.screenshot({ path: path.join(run, name + ".png"), fullPage: true, animations: "disabled" }); }
async function openSettings(profile) {
  const { chromium } = await import(pathToFileURL(modulePath()).href);
  context = await chromium.launchPersistentContext(path.join(run, profile), { headless: true, executablePath: chromePath(), viewport: { width: 1440, height: 960 }, locale: "zh-CN", colorScheme: "dark", serviceWorkers: "block" });
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || ["data:", "blob:"].includes(url.protocol)) return route.continue();
    external.push(url.origin); return route.abort("blockedbyclient");
  });
  if (previous) await context.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontend, "gui.html"), "utf8")
    .replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await context.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ""; });
  page = context.pages()[0] || await context.newPage();
  page.on("pageerror", error => errors.push(String(error)));
  page.on("request", request => { if (request.url().includes("/assets/")) assets.push(new URL(request.url()).pathname); });
  page.on("response", async response => {
    if (!response.url().endsWith("/api/tauri/invoke")) return;
    try { const body = response.request().postDataJSON(), request = body.message || body;
      if (["tauri/getKeepAwake", "tauri/setKeepAwake"].includes(request.messageType)) responses.push({ type: request.messageType, requested: request.data, frame: await response.json() });
    } catch {}
  });
  await page.goto(origin, { waitUntil: "domcontentloaded" }); await poll(() => page.frames().some(frame => frame.url().includes("/gui.html")), "GUI frame");
  gui = page.frames().find(frame => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  for (let i = 0; i < 4 && await next.count() && await next.first().isVisible(); i++) await next.first().click();
  await gui.locator('[data-telemetry-id="open_settings"]').first().click();
  await gui.locator('[data-telemetry-id="settings_nav_device"]').click();
  await gui.getByText("保持电脑处于唤醒状态", { exact: true }).waitFor({ state: "visible" });
  return gui.getByText("保持电脑处于唤醒状态", { exact: true }).locator("..").locator("..").getByRole("switch");
}
async function powerState() {
  const response = await fetch(new URL("/api/tauri/invoke", origin), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messageType: "tauri/getKeepAwake", messageId: randomUUID() }) });
  const frame = await response.json(); assert.equal(frame.data.status, "success"); return frame.data.content;
}
let failure;
try {
  origin = await launch(); let toggle = await openSettings("profile-first");
  assert.equal(await toggle.isEnabled(), true); assert.equal(await toggle.getAttribute("aria-checked"), "false");
  assert.equal((await powerState()).enabled, false);
  checks.push("The actual Devices screen exposes an enabled sleep-prevention switch while remote access is unavailable");
  await toggle.click(); await poll(async () => await toggle.getAttribute("aria-checked") === "true", "backend-confirmed enabled toggle");
  const enabled = await powerState(); assert.equal(enabled.enabled, true); assert.equal(enabled.active, false); assert.equal(enabled.suppressed, true);
  assert.equal(JSON.parse(fs.readFileSync(preference, "utf8")).enabled, true);
  checks.push("A real GUI click saves the enabled preference through Rust, with native power requests suppressed");
  await snapshot("01-enabled");
  fs.renameSync(preference, backup); fs.mkdirSync(preference);
  try {
    await toggle.click(); await gui.getByTestId("gamecowork-keep-awake-error").waitFor({ state: "visible" });
    assert.match(await gui.getByTestId("gamecowork-keep-awake-error").textContent(), /设置未保存，原设置已保留/);
    assert.equal(await toggle.getAttribute("aria-checked"), "true"); assert.equal((await powerState()).enabled, true);
    checks.push("An actual atomic-save failure keeps the committed switch value and shows a retryable error"); await snapshot("02-save-failure");
  } finally { fs.rmdirSync(preference); fs.renameSync(backup, preference); }
  await context.close(); context = undefined; await stop(); origin = await launch(); toggle = await openSettings("profile-restart");
  await poll(async () => await toggle.getAttribute("aria-checked") === "true", "fresh GUI restored persisted preference");
  assert.equal((await powerState()).enabled, true); checks.push("A new browser profile and restarted Rust host read the saved enabled preference"); await snapshot("03-restart-enabled");
  await toggle.click(); await poll(async () => await toggle.getAttribute("aria-checked") === "false", "real disable saved");
  assert.equal(JSON.parse(fs.readFileSync(preference, "utf8")).enabled, false);
  checks.push("The same independent switch turns sleep prevention off and saves the disabled preference"); await snapshot("04-disabled");
  assert.ok(assets.includes(previous ? "/assets/index-DvRYaIVa.js" : "/assets/index-BRxZ4eG7.js"));
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; if (gui) await snapshot("failure").catch(() => {}); }
finally {
  await context?.close(); await stop(); fs.writeFileSync(path.join(run, "shell.log"), shellLog);
  fs.writeFileSync(path.join(run, "result.json"), JSON.stringify({ checks, failure, errors, external, responses, assets, run, binary, frontend, packaged, previous,
    fixtureCore: true, nativePowerSuppressed: true, browserMode: "actual Chromium UI against own Rust HTTP; native Wry geometry not exercised" }, null, 2));
  console.log(JSON.stringify({ run, checks, failure, errors, external, packaged, previous }, null, 2));
}
