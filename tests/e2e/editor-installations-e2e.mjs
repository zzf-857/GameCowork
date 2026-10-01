// Real desktop wrapper + GUI + Rust getEditors projection. The core fixture
// returns public identities of selected installed Editors and only owned temp
// projects. This does not test the Core's Hub scan, launch an Editor, or install,
// uninstall, activate, or log in. Explorer dispatch uses the host's TEST_MODE.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readEditorIdentity } from "../support/editor-engine-fixture.mjs";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const temp = path.resolve(repo, "../../temp/GameCowork");
const run = path.resolve(option("--output", path.join(temp, "editor-installations-" + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep), "Outputs stay in a unique temp task");
assert.ok(!fs.existsSync(run) || fs.readdirSync(run).length === 0, "Select a new or empty owned output directory");
const packaged = args.includes("--packaged"), previous = args.includes("--previous");
const sameVersion = args.includes("--same-version");
const binary = path.resolve(option("--binary", path.join(repo, packaged ? "app/GameCowork.exe" : "src/shell/target/debug/GameCowork.exe")));
const frontend = path.resolve(option("--frontend", path.join(repo, packaged ? "app/frontend" : "src/frontend/bundle")));
const identities = [
  readEditorIdentity(path.resolve(option("--unity", "F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe"))),
  readEditorIdentity(path.resolve(option("--tuanjie", "E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe"))),
];
assert.deepEqual(identities.map(value => value.engine), ["unity", "tuanjie"]);
// Core technical version and displayed Tuanjie semver can differ. This optional
// compatibility fixture deliberately assigns both products the same technical
// version; it does not claim the installed Tuanjie EXE reports that version.
const technicalVersions = identities.map(identity => sameVersion ? identities[0].version : identity.version);
// Marketing is an explicit protocol-fixture value, never inferred from the PE technical version.
const marketingVersion = option("--tuanjie-marketing-version", "1.10.4");
const displayVersions = [identities[0].version, marketingVersion];
fs.mkdirSync(run, { recursive: true });
const projects = identities.map((identity, index) => {
  const root = path.join(run, "projects", identity.engine === "unity" ? "Owned Unity" : "Owned Tuanjie");
  for (const dir of ["Assets", "Packages", "ProjectSettings"]) fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.writeFileSync(path.join(root, "Packages/manifest.json"), "{\"dependencies\":{}}\n");
  fs.writeFileSync(path.join(root, "ProjectSettings/ProjectVersion.txt"), "m_EditorVersion: " + technicalVersions[index] + "\n" +
    (identity.engine === "tuanjie" ? "m_TuanjieEditorVersion: " + marketingVersion + "\n" : ""));
  return { path: root, editor_version: technicalVersions[index], tuanjie_editor_version: identity.engine === "tuanjie" ? marketingVersion : undefined,
    last_modified_display: "2026-10-01T00:00:00Z" };
});
const fixtureFile = path.join(run, "hub-snapshot.json");
fs.writeFileSync(fixtureFile, JSON.stringify(identities.map((identity, index) => ({ product: identity.engine, projects: [projects[index]],
  editors: [{ path: identity.editor, version: technicalVersions[index], tuanjie_editor_version: identity.engine === "tuanjie" ? marketingVersion : undefined }] })), null, 2));
const samePath = (a, b) => String(a || "").replaceAll("\\", "/").toLowerCase() === String(b || "").replaceAll("\\", "/").toLowerCase();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function poll(fn, label, timeout = 15000) { const end = Date.now() + timeout; while (!await fn()) { assert.ok(Date.now() < end, "Timed out: " + label); await delay(80); } }
function playwright() {
  if (option("--playwright", process.env.GAMECOWORK_E2E_PLAYWRIGHT)) return option("--playwright", process.env.GAMECOWORK_E2E_PLAYWRIGHT);
  try { return createRequire(import.meta.url).resolve("playwright"); } catch {}
  const cache = path.join(process.env.LOCALAPPDATA || os.tmpdir(), "npm-cache/_npx");
  const found = fs.readdirSync(cache).map(name => path.join(cache, name, "node_modules/playwright/index.mjs")).filter(file => fs.existsSync(file));
  assert.ok(found.length, "A locally installed Playwright runtime is required"); return found[0];
}
function chromiumPath() {
  if (option("--chrome", process.env.GAMECOWORK_E2E_CHROME)) return option("--chrome", process.env.GAMECOWORK_E2E_CHROME);
  const cache = path.join(process.env.LOCALAPPDATA || os.tmpdir(), "ms-playwright");
  for (const name of fs.readdirSync(cache).filter(name => /^chromium-\d+$/.test(name)).sort((a, b) => +b.split("-")[1] - +a.split("-")[1]))
    for (const file of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe"]) if (fs.existsSync(path.join(cache, name, file))) return path.join(cache, name, file);
  throw Error("A cached Chromium executable is required");
}
const checks = [], pageErrors = [], consoleErrors = [], external = [], requests = [], responses = [], resourceRequests = [], screenshots = [], cleanupErrors = [], ownPids = new Set();
const installationErrors = () => consoleErrors.filter(error => /TJHubRoute[^\n]*|reading ['"](?:length|map|filter)['"]/.test(error) && /TypeError|Cannot read properties/.test(error));
let shell, context, page, gui, base, shellLog = "", failure, editors, injectScanError = false;
const check = (name, ok) => { assert.ok(ok, name); checks.push(name); };
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const requestCall = request => { try { const body = JSON.parse(request.postData()); return body.message || body; } catch { return null; } };
async function rpc(type, data = {}) {
  const response = await fetch(base + "/api/tauri/invoke", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageType: type, messageId: randomUUID(), data }) });
  assert.equal(response.status, 200); return (await response.json()).data;
}
async function snapshot(name) {
  if (!gui) return;
  fs.writeFileSync(path.join(run, name + ".aria.txt"), await gui.locator("body").ariaSnapshot());
  fs.writeFileSync(path.join(run, name + ".controls.json"), JSON.stringify(await gui.locator("button,input").evaluateAll(elements => elements.map(element => ({
    tag: element.tagName, text: element.textContent, ariaLabel: element.getAttribute("aria-label"), title: element.getAttribute("title"),
    testid: element.getAttribute("data-testid"), placeholder: element.getAttribute("placeholder"), parentClass: element.parentElement?.className,
  }))), null, 2));
  const file = path.join(run, name + ".png"); await page.screenshot({ path: file, fullPage: true, animations: "disabled" }); screenshots.push(file);
}
async function installations() {
  const explicit = gui.getByTestId("gamecowork-editor-installations-entry");
  if (await explicit.count()) return explicit.click();
  const named = gui.getByRole("button", { name: /^(安装|Installs|Installations)$/ });
  if (await named.count()) return named.click();
  // Legacy ne only renders the tooltip. Its real Projects toolbar contains
  // search, licenses, installations, Add and New Project in that exact order.
  const toolbar = gui.getByRole("button", { name: "新项目", exact: true }).locator("..");
  assert.equal(await toolbar.getByRole("button").count(), 5, "Legacy Projects toolbar controls are unambiguous");
  await toolbar.getByRole("button").nth(2).click();
}
function cards() { return gui.getByTestId("gamecowork-editor-row"); }
function card(identity) { return gui.locator(`[data-testid="gamecowork-editor-row"][data-editor-product="${identity.engine}"][data-editor-path="${identity.editor.replaceAll("\\", "/")}"]`); }
try {
  assert.ok(fs.existsSync(binary), "Selected own Rust binary exists");
  shell = spawn(binary, [], { cwd: run, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env,
    GAMECOWORK_APP_ROOT: run, GAMECOWORK_FRONTEND_DIR: frontend, GAMECOWORK_CORE_DIR: path.join(repo, "tests"),
    GAMECOWORK_CORE_ENTRY: path.join(repo, "tests/fixtures/core-fixture.mjs"), GAMECOWORK_DATA_DIR: path.join(run, "app-data"),
    GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_FIXTURE_DATA_DIR: run,
    GAMECOWORK_FIXTURE_LOG: path.join(run, "core-frames.jsonl"), GAMECOWORK_FIXTURE_HUB_SNAPSHOT: fixtureFile,
    GAMECOWORK_FIXTURE_PROJECT_A: projects[0].path, GAMECOWORK_FIXTURE_PROJECT_B: projects[1].path,
  } });
  ownPids.add(shell.pid);
  const consume = chunk => { shellLog += chunk.toString(); const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//); if (match) base = match[1]; };
  shell.stdout.on("data", consume); shell.stderr.on("data", consume);
  await poll(() => base || shell.exitCode !== null, "own Rust host startup", 30000); assert.ok(base, shellLog);
  const catalog = await rpc("tjhub/getEditors");
  check("Real Rust getEditors returns both nonempty installed Editor identities", catalog.status === "success" && Object.values(catalog.content).length === 2);
  editors = Object.values(catalog.content); fs.writeFileSync(path.join(run, "actual-getEditors.json"), JSON.stringify(catalog, null, 2));
  for (const [index, identity] of identities.entries()) check("Exact installed " + identity.engine + " path and Core technical version survive getEditors", editors.some(editor => editor.product === identity.engine && editor.version === technicalVersions[index] && editor.semver === displayVersions[index] && samePath(editor.path, identity.editor)));
  const { chromium } = await import(pathToFileURL(playwright()).href);
  context = await chromium.launchPersistentContext(path.join(run, "browser-profile"), { headless: true, executablePath: chromiumPath(),
    viewport: { width: 1440, height: 960 }, locale: "zh-CN", colorScheme: "dark", serviceWorkers: "block",
    args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"] });
  await context.route("**/*", async route => {
    const req = route.request(), url = new URL(req.url());
    if (!["127.0.0.1"].includes(url.hostname) && !["data:", "blob:"].includes(url.protocol)) { external.push(url.origin); return route.abort("blockedbyclient"); }
    if (injectScanError && url.pathname === "/api/tauri/invoke") {
      let call; try { call = JSON.parse(req.postData()); call = call.message || call; } catch {}
      if (call?.messageType === "tjhub/getEditors") { injectScanError = false; return route.fulfill({ contentType: "application/json", body: JSON.stringify({ messageType: call.messageType, messageId: call.messageId,
        data: { done: true, status: "error", error: "Owned editor scan unavailable" } }) }); }
    }
    return route.continue();
  });
  if (previous) await context.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontend, "gui.html"), "utf8")
    .replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await context.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.vscMediaUrl = ""; window.workspacePaths = [];
    localStorage.setItem("gamecowork-version-update-seen-features", JSON.stringify(["multi-workspace", "remote-access", "unity-streaming", "remote-workspace", "unity-window-streaming"])); });
  page = context.pages()[0] || await context.newPage();
  page.on("pageerror", error => pageErrors.push(error.stack || String(error)));
  page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("request", request => { const pathname = new URL(request.url()).pathname;
    if (pathname.endsWith(".js")) resourceRequests.push(pathname);
    if (pathname.startsWith("/api/tauri/")) requests.push({ endpoint: pathname, body: requestCall(request) }); });
  page.on("response", async response => { if (response.url().endsWith("/api/tauri/invoke")) try { responses.push(await response.json()); } catch {} });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await poll(() => page.frames().some(frame => frame.url().includes("/gui.html")), "real embedded GUI", 30000);
  gui = page.frames().find(frame => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
  for (let step = 0; step < 4 && await next.count() && await next.first().isVisible(); step++) await next.first().click();
  await gui.getByText("项目", { exact: true }).first().click();
  await gui.getByText("Owned Unity", { exact: true }).first().waitFor();
  await gui.getByText("Owned Tuanjie", { exact: true }).first().waitFor();
  await snapshot("01-owned-projects");
  await installations();
  await poll(async () => pageErrors.length > 0 || installationErrors().length > 0 || await gui.getByRole("button", { name: "管理", exact: true }).count() === 2, "actual installation render or captured crash");
  await snapshot("02-installations");
  assert.deepEqual(pageErrors, [], "Installation entry must not throw location.length/array rendering errors");
  assert.ok(installationErrors().length === 0, "Installation entry must not reach a React runtime error: " + installationErrors()[0]?.split("\n").slice(0, 2).join(" "));
  check("Real Projects installation entry renders both actual nonempty Editor rows", await cards().count() === 2);
  check("Selected frontend generation actually loads its GUI and installation chunks", resourceRequests.includes(previous ? "/assets/index-DvRYaIVa.js" : "/assets/index-BRxZ4eG7.js") &&
    resourceRequests.includes(previous ? "/assets/TJHubRoute-D42CgVct.js" : "/assets/TJHubRoute-DN1YDDd-.js"));
  for (const editor of editors) check("Installed Editor arrays and folder are actual host DTO fields: " + editor.product,
    Array.isArray(editor.location) && editor.location.some(location => samePath(location, editor.path)) &&
    typeof editor.folderPath === "string" && editor.folderPath.length > 0 && fs.statSync(editor.folderPath).isDirectory() &&
    [path.dirname(editor.path), path.dirname(path.dirname(editor.path))].some(folder => samePath(folder, editor.folderPath)) &&
    Array.isArray(editor.buildPlatformShortNames) && Array.isArray(editor.modules));
  for (const [index, identity] of identities.entries()) {
    const row = card(identity);
    assert.equal(await row.count(), 1);
    assert.equal(await row.getAttribute("data-editor-product"), identity.engine);
    assert.equal(await row.getAttribute("data-editor-version"), technicalVersions[index]);
    assert.equal(await row.getAttribute("data-editor-semver"), displayVersions[index]);
    assert.ok(samePath(await row.getAttribute("data-editor-path"), identity.editor));
    assert.equal(await row.getByTestId("gamecowork-editor-view-projects").textContent(), "查看项目 (1)", "Each engine counts only its corresponding owned project");
    assert.ok((await row.innerText()).replaceAll("\\", "/").includes(path.dirname(identity.editor).replaceAll("\\", "/")));
    await row.getByRole("button", { name: "管理", exact: true }).click();
    await gui.getByRole("menuitem", { name: "在资源管理器中显示", exact: true }).waitFor();
    const showResponse = page.waitForResponse(response => response.url().endsWith("/api/tauri/reveal-in-file-explorer"));
    await gui.getByRole("menuitem", { name: "在资源管理器中显示", exact: true }).click();
    const actualResponse = await showResponse;
    assert.equal((await actualResponse.json()).ok, true);
    const last = requests.findLast(request => request.endpoint === "/api/tauri/reveal-in-file-explorer");
    const dto = editors.find(editor => editor.product === identity.engine && samePath(editor.path, identity.editor));
    assert.ok(samePath(last.body.path, dto.folderPath), "The real menu dispatches that exact installed Editor's actual host folder");
    check("Actual " + identity.engine + " management menu dispatches the exact Explorer path (host TEST_MODE)", true);
  }
  await gui.getByRole("button", { name: "搜索", exact: true }).click();
  const search = gui.getByPlaceholder("搜索", { exact: true });
  await search.fill(displayVersions[1]); await poll(async () => await cards().count() === 1, "semver search selects Tuanjie only");
  check("Installation display-version filter keeps the matching actual row", await card(identities[1]).count() === 1 && await card(identities[0]).count() === 0);
  await search.fill("NO_OWNED_EDITOR_MATCH"); await gui.getByText("没有结果", { exact: true }).waitFor();
  check("Unmatched search shows no results without dropping host Editor records", await cards().count() === 0 && Object.values((await rpc("tjhub/getEditors")).content).length === 2);
  await search.fill(""); await poll(async () => await cards().count() === 2, "cleared search restores both rows"); await snapshot("03-filter-restored");
  await card(identities[0]).getByTestId("gamecowork-editor-view-projects").click();
  await gui.getByText("Owned Unity", { exact: true }).first().waitFor();
  check("Real view-projects callback navigates and filters the corresponding projects", await gui.getByText("Owned Tuanjie", { exact: true }).count() === 0);
  check("Unity project filter displays the selected Editor semver", await gui.getByText("编辑器版本： " + displayVersions[0], { exact: true }).isVisible());
  await snapshot("04-view-projects");
  await installations(); await card(identities[1]).getByTestId("gamecowork-editor-view-projects").click();
  await gui.getByText("Owned Tuanjie", { exact: true }).first().waitFor();
  check("Other engine view-projects callback selects its own version", await gui.getByText("Owned Unity", { exact: true }).count() === 0);
  check("Tuanjie project filter keeps its displayed semver under shared technical versions", await gui.getByText("编辑器版本： " + displayVersions[1], { exact: true }).isVisible());
  injectScanError = true; await installations();
  const scanError = gui.getByTestId("gamecowork-editors-error");
  await scanError.getByText("Owned editor scan unavailable", { exact: true }).waitFor({ timeout: 15000 });
  check("Failed editor scan has its actual error instead of pretending nothing is installed", await gui.getByText("尚未安装", { exact: true }).count() === 0 && !injectScanError);
  await snapshot("05-scan-error");
  const priorIds = new Set(requests.map(record => record.body?.messageId).filter(Boolean));
  const isNewScan = request => request.url().endsWith("/api/tauri/invoke") && requestCall(request)?.messageType === "tjhub/getEditors" &&
    !!requestCall(request)?.messageId && !priorIds.has(requestCall(request).messageId);
  const retryRequest = page.waitForRequest(isNewScan);
  const retryResponse = page.waitForResponse(response => isNewScan(response.request()));
  await gui.getByTestId("gamecowork-editors-retry").click();
  const [actualRetryRequest, actualRetryResponse] = await Promise.all([retryRequest, retryResponse]);
  const retryCall = requestCall(actualRetryRequest), retryReply = await actualRetryResponse.json();
  assert.equal(retryReply.messageId, retryCall.messageId, "Retry uses the new matching request's actual final callback");
  assert.equal(retryReply.data.status, "success"); assert.equal(Object.values(retryReply.data.content).length, 2);
  await poll(async () => await cards().count() === 2 && await scanError.count() === 0, "real matching retry callback restores rows and clears its error banner");
  check("User retry obtains a new matching successful getEditors callback and restores both rows", Object.values(retryReply.data.content).some(editor => editor.product === "unity" && editor.version === technicalVersions[0]));
  const unsafe = /tjhub\/(?:installEditor|uninstallEditor|removeEditor|installModules|downloadRelease|activateLicense|login)/;
  check("No install, uninstall, removal, activation, login, or external request was issued", !requests.some(request => unsafe.test(request.body?.messageType || "")) && external.length === 0);
  assert.deepEqual(pageErrors, []); check("No installation renderer error or uncaught browser exception during navigation and recovery", installationErrors().length === 0);
  await snapshot("06-recovered");
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; await snapshot("failure").catch(() => {}); }
finally {
  try { await context?.close(); } catch (error) { cleanupErrors.push("Browser close: " + error.message); }
  const framesFile = path.join(run, "core-frames.jsonl");
  try {
    if (fs.existsSync(framesFile)) for (const line of fs.readFileSync(framesFile, "utf8").trim().split("\n").filter(Boolean)) {
      const record = JSON.parse(line);
      if (record.event === "started") {
        assert.equal(record.parentPid, shell.pid, "Recorded Core fixture belongs to the owned host");
        assert.ok(samePath(record.entry, path.join(repo, "tests/fixtures/core-fixture.mjs")), "Recorded Core is the explicit test fixture");
        assert.ok(Number.isInteger(record.pid) && record.pid > 0); ownPids.add(record.pid);
      }
    }
  } catch (error) { cleanupErrors.push("Core process trace: " + error.message); }
  try {
    if (shell && alive(shell.pid)) { shell.kill(); await poll(() => !alive(shell.pid), "owned Rust host cleanup", 10000); }
    await poll(() => [...ownPids].every(pid => !alive(pid)), "owned Core Job cleanup", 10000);
  } catch (error) { cleanupErrors.push("Owned process cleanup: " + error.message); }
  const ownPidsGone = cleanupErrors.length === 0 && [...ownPids].every(pid => !alive(pid));
  if (!ownPidsGone && !failure) { failure = { message: "Owned process cleanup incomplete" }; process.exitCode = 1; }
  fs.writeFileSync(path.join(run, "shell.log"), shellLog);
  fs.writeFileSync(path.join(run, "summary.json"), JSON.stringify({ run, packaged, previous, sameVersion, technicalVersions, binary, frontend, identities, editors, checks, failure, pageErrors, consoleErrors, external, requests, responses, resourceRequests, screenshots, cleanupErrors, ownPids: [...ownPids], ownPidsGone,
    boundary: "Actual Rust/GUI and public installed Editor identities; isolated Hub DTO. Core Hub discovery, actual Explorer window, installation/uninstallation/licensing and native Wry geometry are not exercised." }, null, 2));
  console.log(JSON.stringify({ run, packaged, previous, passed: checks.length, failure: failure?.message, pageErrors, ownPidsGone }));
}
