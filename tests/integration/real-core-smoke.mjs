// Opt-in real core smoke. Uses only fresh fixture workspaces, no Hub, editor,
// provider, personal session, or system profile environment changes.
// Run after building the shell: node tests/integration/real-core-smoke.mjs [--exe <absolute exe>] [--packaged]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const base = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work');
const root = path.join(base, `real-core-smoke-${randomUUID()}`);
const packaged=process.argv.includes('--packaged');
const core = path.join(project, packaged?'app/core':'src/core/binary/out');
const guard = path.join(project, 'tests/fixtures/real-core-guard.cjs');
const exeIndex = process.argv.indexOf('--exe');
const exe = exeIndex >= 0 ? path.resolve(process.argv[exeIndex + 1]) : path.join(project, packaged?'app/GameCowork.exe':'src/shell/target/debug/GameCowork.exe');
assert.equal(process.platform, 'win32', 'This shell smoke requires Windows');
assert.ok(fs.statSync(exe).isFile());
assert.ok(fs.statSync(path.join(core, 'build/Release/node_sqlite3.node')).isFile(), 'Prepared native SQLite binding is required');
fs.mkdirSync(root, { recursive: true });
const env = {
  ...process.env,
  GAMECOWORK_APP_ROOT: path.join(project, 'app'),
  GAMECOWORK_FRONTEND_DIR: path.join(project, packaged?'app/frontend':'src/frontend/bundle'),
  GAMECOWORK_CORE_DIR: core,
  GAMECOWORK_CORE_ENTRY: path.join(core, 'index.js'),
  GAMECOWORK_DATA_DIR: path.join(root, 'data'),
  GAMECOWORK_SMOKE_ROOT: root,
  GAMECOWORK_USER_DATA_DIR: path.join(root, 'data/core-state'),
  GAMECOWORK_HEADLESS: '1',
  GAMECOWORK_TEST_MODE: '1',
  NODE_OPTIONS: `--require ${JSON.stringify(guard)}`,
};
for (const key of ['GAMECOWORK_CLI_PATH', 'GAMECOWORK_CLI_BASE_DIR', 'GAMECOWORK_HOME', 'GAMECOWORK_APP_HOME']) delete env[key];
const child = spawn(exe, [], { cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
const checks = [];
const errors = [];
const summary = { checks, errors, fixtureDirectory: root, guardOperations: {} };
let stdout = '';
let stderr = '';
child.stdout.on('data', data => { stdout += data.toString(); });
child.stderr.on('data', data => { stderr += data.toString(); });
console.log(`OWN_PID=${child.pid}`);
function check(name, condition) {
  checks.push({ name, passed: Boolean(condition) });
  console.log(`${name}: ${Boolean(condition) ? 'PASS' : 'FAIL'}`);
  assert.ok(condition, name);
}
let origin;
async function http(route, body) {
  const response = await fetch(origin + route, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(35000),
  });
  const data = await response.json();
  check(`${route} HTTP`, response.ok);
  return data;
}
async function invoke(kind, id, workspaceKey) {
  const frame = await http('/api/tauri/invoke', {
    message: { messageType: kind, messageId: id, data: {} },
    ...(workspaceKey ? { workspaceKey } : {}),
  });
  check(`${id} original ID`, frame.messageId === id);
  check(`${id} terminal frame`, frame.data?.done === true);
  if (frame.data?.status === 'error') errors.push({ request: kind, error: String(frame.data.error).slice(0, 300) });
  check(`${id} envelope success`, frame.data?.status === 'success');
  if (frame.data.content?.status === 'error') errors.push({ request: kind, error: String(frame.data.content.error).slice(0, 300) });
  check(`${id} content success`, frame.data.content?.status !== 'error');
  return frame.data.content;
}
try {
  const deadline = Date.now() + 50000;
  while (Date.now() < deadline && child.exitCode === null) {
    origin = stdout.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    if (origin) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  check('isolated startup', Boolean(origin));
  const ping = await http('/api/tauri/invoke', { messageType: 'ping', messageId: 'real-ping', data: 'ping' });
  check('ping preserves original ID', ping.messageId === 'real-ping');
  check('ping content', ping.data?.content === 'pong');
  const profile = await invoke('config/getSerializedProfileInfo', 'real-config-default');
  check('default config exists', typeof profile.result?.config === 'object' && profile.result.config !== null);
  await invoke('config/getSharedConfig', 'real-shared-config');
  const opened = [];
  for (const label of ['A', 'B']) {
    const directory = path.join(root, `Workspace ${label}`);
    fs.mkdirSync(directory);
    if (label === 'B') {
      for (const folder of ['Assets', 'ProjectSettings', 'Packages']) fs.mkdirSync(path.join(directory, folder));
      fs.writeFileSync(path.join(directory, 'ProjectSettings/ProjectVersion.txt'), 'm_EditorVersion: 2022.3.1f1\n');
      fs.writeFileSync(path.join(directory, 'Packages/manifest.json'), '{"dependencies":{"cn.gamecowork.bridge":"0.0.0-fixture"}}\n');
    }
    const result = await http('/api/tauri/hub/open-workspace', { path: directory });
    check(`open ${label}`, result.ok === true && typeof result.workspaceKey === 'string');
    opened.push(result.workspaceKey);
    const status = await invoke('unity/getProjectStatus', `real-project-${label}`, result.workspaceKey);
    check(`${label} project status schema`, status.status === 'success' && typeof status.content?.isUnityProject === 'boolean');
    check(`${label} project classification`, status.content.isUnityProject === (label === 'B'));
    check(`${label} does not invent editor connection`, status.content.connected === undefined);
    if (label === 'B') {
      check('B raw host root and route', path.resolve(status.content.projectRoot) === directory);
      check('B actual editor version', status.content.engineVersion === '2022.3.1f1');
      check('B bridge manifest metadata', status.content.hasUnityMcpPackage === true && status.content.installedPackageVersion === '0.0.0-fixture');
    }
  }
  let snapshot = await http('/api/tauri/hub/workspaces');
  check('two workspace instances', snapshot.workspaces.length === 2);
  check('active B', snapshot.activeWorkspaceKey === opened[1]);
  check('switch A', (await http('/api/tauri/hub/switch-workspace', { workspaceKey: opened[0] })).ok === true);
  const profileA = await invoke('config/getSerializedProfileInfo', 'real-config-A', opened[0]);
  check('A config exists', typeof profileA.result?.config === 'object' && profileA.result.config !== null);
  check('close A', (await http('/api/tauri/hub/close-workspace', { workspaceKey: opened[0] })).ok === true);
  snapshot = await http('/api/tauri/hub/workspaces');
  check('close falls back to B', snapshot.activeWorkspaceKey === opened[1] && snapshot.workspaces.length === 1);
  check('closing preserves project files', fs.statSync(path.join(root, 'Workspace A')).isDirectory() && fs.statSync(path.join(root, 'Workspace B/Assets')).isDirectory());
} catch (error) {
  summary.failure = { type: error.name, message: String(error.message).slice(0, 300) };
  process.exitCode = 1;
} finally {
  if (child.exitCode === null && child.pid) {
    const stopped = spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, encoding: 'utf8' });
    summary.processCleanupSucceeded = stopped.status === 0;
    if (!summary.processCleanupSucceeded) process.exitCode = 1;
  } else summary.processCleanupSucceeded = true;
  if (child.exitCode === null) await new Promise(resolve => {
    const timer = setTimeout(resolve, 5000);
    child.once('exit', () => { clearTimeout(timer); resolve(); });
  });
  fs.writeFileSync(path.join(root, 'shell.stdout.txt'), stdout);
  fs.writeFileSync(path.join(root, 'shell.stderr.txt'), stderr);
  const guardEvents = path.join(root, 'guard-events.jsonl');
  if (fs.existsSync(guardEvents)) {
    for (const line of fs.readFileSync(guardEvents, 'utf8').split(/\r?\n/).filter(Boolean)) {
      const { operation } = JSON.parse(line);
      summary.guardOperations[operation] = (summary.guardOperations[operation] || 0) + 1;
    }
  }
  summary.passed = checks.filter(item => item.passed).length;
  summary.total = checks.length;
  fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify(summary, null, 2));
  // Summary contains only check outcomes/errors; profile/config/account content is omitted.
  console.log(JSON.stringify(summary));
}
