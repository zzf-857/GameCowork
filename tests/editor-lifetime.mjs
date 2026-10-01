// A fake native editor is launched by the real shell host. No Unity/Tuanjie
// installation is used. Closing only the shell must preserve that editor.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const exec = promisify(execFile);
const root = fileURLToPath(new URL("../", import.meta.url));
const index = process.argv.indexOf("--binary");
const binary = path.resolve(index >= 0 ? process.argv[index + 1] : path.join(root, "restored/shell/target/debug/GameCowork.exe"));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (error) { if (error.code === "ESRCH") return false; throw error; } };
async function until(predicate, message) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) { if (predicate()) return; await delay(20); }
  assert.fail(message);
}

test("native host launches an editor that survives shell and core Job termination", { skip: process.platform !== "win32" }, async () => {
  assert.ok(fs.existsSync(binary), `Build the Rust shell first: ${binary}`);
  const dataDir = path.join("F:/AI/AgentMake/temp/GameCowork/tests", `editor-lifetime-${randomUUID()}`);
  const coreDir = path.join(dataDir, "fixture-core");
  const editorDir = path.join(dataDir, "fake-editors");
  fs.mkdirSync(coreDir, { recursive: true }); fs.mkdirSync(editorDir, { recursive: true });
  const editor = path.join(editorDir, "Unity.exe");
  await exec("rustc.exe", ["--edition", "2021", path.join(root, "tests/editor-launch-fixture.rs"), "-o", editor], { windowsHide: true });
  const entry = path.join(dataDir, `core-entry-${randomUUID()}.mjs`);
  fs.writeFileSync(entry, `import ${JSON.stringify(pathToFileURL(path.join(root, "tests/core-fixture.mjs")).href)};\n`);
  const logFile = path.join(dataDir, "core-frames.jsonl");
  const project = path.join(dataDir, "projects", "A Unity 中文");
  const shell = spawn(binary, [], { cwd: root, stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
    env: { ...process.env, GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1",
      GAMECOWORK_APP_ROOT: path.join(root, "app"), GAMECOWORK_DATA_DIR: dataDir,
      GAMECOWORK_CORE_DIR: coreDir, GAMECOWORK_CORE_ENTRY: entry,
      GAMECOWORK_FRONTEND_DIR: path.join(root, "restored/frontend/dist-beautified"),
      GAMECOWORK_FIXTURE_DATA_DIR: dataDir, GAMECOWORK_FIXTURE_LOG: logFile, GAMECOWORK_FIXTURE_RUN_ID: "editor-lifetime" } });
  const readLog = () => fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
  let output = "", url, editorPid, corePid;
  let resolveReady, rejectReady;
  const ready = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const timeout = setTimeout(() => rejectReady(new Error(`Shell startup timed out: ${output}`)), 15000);
  for (const stream of [shell.stdout, shell.stderr]) stream.on("data", (bytes) => {
    output += bytes.toString(); fs.appendFileSync(path.join(dataDir, "shell.log"), bytes);
    const match = output.match(/\[shell\] HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);
    if (match) { url = match[1]; resolveReady(); }
  });
  shell.once("error", rejectReady);
  shell.once("exit", (code) => { if (!url) rejectReady(new Error(`Shell exited before startup (${code}): ${output}`)); });
  async function post(route, body) {
    const response = await fetch(new URL(route, url), { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), signal: AbortSignal.timeout(5000) });
    return response.json();
  }
  try {
    await ready; clearTimeout(timeout);
    const core = readLog().find((record) => record.event === "started");
    assert.equal(core.parentPid, shell.pid); corePid = core.pid;
    const opened = await post("/api/tauri/hub/open-workspace", { path: project });
    assert.equal(opened.ok, true);
    const id = `native-client-${randomUUID()}`;
    const launched = await post("/api/tauri/invoke", { messageType: "fixture/nativeLaunch", messageId: id,
      workspaceKey: opened.workspaceKey, data: { editorPath: editor, projectPath: project } });
    assert.equal(launched.messageId, id); assert.equal(launched.data.status, "success");
    assert.equal(launched.data.content.success, true, JSON.stringify(launched));
    editorPid = launched.data.content.pid;
    const readyFile = path.join(project, "fixture-editor-ready.pid");
    await until(() => fs.existsSync(readyFile), "Fake native editor received -projectPath and started");
    assert.equal(Number(fs.readFileSync(readyFile, "utf8")), editorPid);
    const { stdout: parentText } = await exec("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `(Get-CimInstance Win32_Process -Filter 'ProcessId = ${Number(editorPid)}').ParentProcessId`], { windowsHide: true });
    assert.equal(Number(parentText.trim()), shell.pid, "Editor is launched by the shell rather than Job-owned core");
    const hostReplies = readLog().filter((record) => record.frame?.messageType === "launchDetachedEditor");
    assert.equal(hostReplies.length, 1); assert.equal(hostReplies[0].frame.data.success, true);
    assert.equal(Object.hasOwn(hostReplies[0].frame.data, "done"), false);
    await exec("taskkill.exe", ["/PID", String(shell.pid), "/F"], { windowsHide: true }); // No /T.
    await until(() => !alive(corePid), "Core Job closes when only the shell exits");
    assert.ok(alive(editorPid), "Native editor survives closing the shell and its core Job");
    fs.writeFileSync(path.join(dataDir, "result.json"), JSON.stringify({ passed: true, shellPid: shell.pid, corePid, editorPid, editorSurvived: true }, null, 2));
  } finally {
    clearTimeout(timeout);
    if (shell.exitCode === null && shell.signalCode === null) await exec("taskkill.exe", ["/PID", String(shell.pid), "/F"], { windowsHide: true }).catch(() => {});
    const editorReady = path.join(project, "fixture-editor-ready.pid");
    if (!editorPid && fs.existsSync(editorReady)) {
      const recorded = Number(fs.readFileSync(editorReady, "utf8"));
      if (Number.isSafeInteger(recorded) && recorded > 0) editorPid = recorded;
    }
    const targets = readLog().filter((record) => record.event === "started").map((record) => ({ pid: record.pid, entry: record.entry }));
    if (editorPid) targets.push({ pid: editorPid, entry: editor });
    for (const target of targets) {
      if (!target.pid || !alive(target.pid)) continue;
      const { stdout } = await exec("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
        `(Get-CimInstance Win32_Process -Filter 'ProcessId = ${Number(target.pid)}' -ErrorAction SilentlyContinue).CommandLine`], { windowsHide: true });
      if (stdout.toLowerCase().includes(target.entry.toLowerCase())) await exec("taskkill.exe", ["/PID", String(target.pid), "/F"], { windowsHide: true }).catch(() => {});
    }
    console.log(`Artifacts: ${dataDir}`);
  }
});
