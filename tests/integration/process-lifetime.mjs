// Run against a compiled shell. Only our exact shell PID is force-terminated;
// /T is deliberately absent so this verifies the Windows Job's own cleanup.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const exec = promisify(execFile);
const root = fileURLToPath(new URL("../../", import.meta.url));
const index = process.argv.indexOf("--binary");
const binary = path.resolve(index >= 0 ? process.argv[index + 1] : path.join(root, "src/shell/target/debug/GameCowork.exe"));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (error) { if (error.code === "ESRCH") return false; throw error; } };
async function until(predicate, message) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) { if (predicate()) return; await delay(20); }
  assert.fail(message);
}

test("Windows job closes core and later descendants when only the shell is terminated", { skip: process.platform !== "win32" }, async () => {
  assert.ok(fs.existsSync(binary), `Build the Rust shell first: ${binary}`);
  const dataDir = path.join("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests", `process-lifetime-${randomUUID()}`);
  const coreDir = path.join(dataDir, "fixture-core");
  fs.mkdirSync(coreDir, { recursive: true });
  const entry = path.join(dataDir, `core-entry-${randomUUID()}.mjs`);
  fs.writeFileSync(entry, `import ${JSON.stringify(pathToFileURL(path.join(root, "tests/fixtures/core-fixture.mjs")).href)};\n`);
  const logFile = path.join(dataDir, "core-frames.jsonl");
  const shellLog = path.join(dataDir, "shell.log");
  const controlEntry = path.join(dataDir, `unrelated-control-${randomUUID()}.mjs`);
  fs.writeFileSync(controlEntry, "setInterval(()=>{},1000);\n");
  const control = spawn(process.execPath, [controlEntry], { stdio: "ignore", windowsHide: true });
  const shell = spawn(binary, [], { cwd: root, stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
    env: { ...process.env, GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1",
      GAMECOWORK_APP_ROOT: path.join(root, "app"), GAMECOWORK_DATA_DIR: dataDir,
      GAMECOWORK_CORE_DIR: coreDir, GAMECOWORK_CORE_ENTRY: entry,
      GAMECOWORK_FRONTEND_DIR: path.join(root, "src/frontend/bundle"),
      GAMECOWORK_FIXTURE_DATA_DIR: dataDir, GAMECOWORK_FIXTURE_LOG: logFile, GAMECOWORK_FIXTURE_RUN_ID: "process-lifetime" } });
  const readLog = () => fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
  let output = "";
  let corePid, descendant;
  let url;
  let resolveReady, rejectReady;
  const ready = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const timeout = setTimeout(() => rejectReady(new Error(`Shell startup timed out: ${output}`)), 15000);
  for (const stream of [shell.stdout, shell.stderr]) stream.on("data", (bytes) => {
    output += bytes.toString();
    fs.appendFileSync(shellLog, bytes);
    const match = output.match(/\[shell\] HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);
    if (match) { url = match[1]; resolveReady(); }
  });
  shell.once("error", rejectReady);
  shell.once("exit", (code) => { if (!url) rejectReady(new Error(`Shell exited before startup (${code}): ${output}`)); });
  try {
    await ready;
    clearTimeout(timeout);
    const core = readLog().find((record) => record.event === "started");
    assert.equal(core.parentPid, shell.pid);
    assert.equal(path.resolve(core.entry), path.resolve(entry));
    corePid = core.pid;
    const id = `lifetime-client-${randomUUID()}`;
    const response = await fetch(new URL("/api/tauri/invoke", url), { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageType: "fixture/startDescendant", messageId: id, data: {} }), signal: AbortSignal.timeout(5000) });
    const frame = await response.json();
    assert.equal(frame.messageId, id);
    assert.equal(frame.data.status, "success");
    descendant = frame.data.content;
    assert.equal(descendant.parentPid, corePid);
    assert.ok(alive(corePid) && alive(descendant.pid) && alive(control.pid));
    await exec("taskkill.exe", ["/PID", String(shell.pid), "/F"], { windowsHide: true });
    await until(() => !alive(corePid) && !alive(descendant.pid), "Job must terminate our core and later descendant after shell-only termination");
    assert.ok(alive(control.pid), "Unrelated process must survive the shell job closing");
    fs.writeFileSync(path.join(dataDir, "result.json"), JSON.stringify({ passed: true, shellPid: shell.pid, corePid, descendantPid: descendant.pid, controlSurvived: true }, null, 2));
  } finally {
    clearTimeout(timeout);
    if (shell.exitCode === null && shell.signalCode === null) await exec("taskkill.exe", ["/PID", String(shell.pid), "/F"], { windowsHide: true }).catch(() => {});
    // Cleanup on failure is scoped to logged PIDs with this run's unique script
    // paths in their command line, so no other process can be killed by name.
    const records = readLog().filter((record) => record.event === "started" || record.event === "descendantSpawned");
    for (const record of records) {
      if (!record.pid || !alive(record.pid)) continue;
      const { stdout } = await exec("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
        `(Get-CimInstance Win32_Process -Filter 'ProcessId = ${Number(record.pid)}' -ErrorAction SilentlyContinue).CommandLine`], { windowsHide: true });
      if (typeof record.entry === "string" && stdout.toLowerCase().includes(record.entry.toLowerCase())) {
        await exec("taskkill.exe", ["/PID", String(record.pid), "/F"], { windowsHide: true }).catch(() => {});
      }
    }
    if (control.exitCode === null && control.signalCode === null) control.kill();
    console.log(`Artifacts: ${dataDir}`);
  }
});
