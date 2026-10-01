// A guarded, real reconstructed CLI with an authenticated loopback provider.
// --package must point at a fresh build made with tools/build-cli.ps1 -GuardFile tests/cli-probe-guard.cjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { startMockProvider } from './mock-provider.mjs';

const packageIndex = process.argv.indexOf('--package');
assert.ok(packageIndex >= 0 && process.argv[packageIndex + 1], 'Pass --package <guarded CLI build directory>');
const packageRoot = path.resolve(process.argv[packageIndex + 1]);
const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'cli-package-manifest.json'), 'utf8'));
assert.equal(manifest.testGuardIncluded, true, 'Full runtime smoke requires a guarded test artifact');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork', `cli-runtime-${randomUUID()}`);
const workspace = path.join(root, 'workspace');
const managedDefault = path.join(root, 'managed-default');
const prewarm = process.argv.includes('--prewarm');
for (const directory of [root, workspace, managedDefault, path.join(root, 'cli-state'), path.join(root, 'user-state'), path.join(root, 'installation')]) fs.mkdirSync(directory, { recursive: true });
const fixtureFile = path.join(workspace, 'fixture.txt');
fs.writeFileSync(fixtureFile, 'GCW_FIXTURE_FILE_CONTENT\n');
const mock = await startMockProvider({ fixtureFile });
const env = { ...process.env };
for (const key of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|OTEL_)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)) delete env[key];
Object.assign(env, {
  GAMECOWORK_CLI_HOME: path.join(root, 'cli-state'), GAMECOWORK_USER_DATA_DIR: path.join(root, 'user-state'),
  GAMECOWORK_CLI_RESOURCE_DIR: path.join(packageRoot, 'resources'), GAMECOWORK_HOME: path.join(root, 'installation'),
  GAMECOWORK_LOCAL_PROVIDER_MODE: '1', GAMECOWORK_DISABLE_AUTO_UPDATE: '1', CUSTOM_AUTH: '1',
  GAMECOWORK_CLI_PROBE_ROOT: root, GAMECOWORK_CLI_PROBE_SOURCE: packageRoot,
  OPENAI_API_KEY: mock.apiKey, OPENAI_BASE_URL: mock.baseUrl, OPENAI_MODEL: mock.model,
  OTEL_EXPORTER_OTLP_ENDPOINT: 'https://ai-generator.tuanjie.cn/fixture-otlp/v1/traces',
});
fs.mkdirSync(path.join(workspace, '.gamecowork-cli'));
// Core W9e uses a gateway envelope with the actual provider in the slot override.
const storedSettings = { selectedAuthType: 'gamecowork-oauth', model: mock.model,
  contentGenerator: { authType: 'gamecowork-oauth', wireApi: 'chat', overrides: { model: { authType: 'openai', wireApi: 'chat' } } },
  disableNextSpeakerCheck: true, telemetry: { enabled: true },
  mcpServers: { TJGenerators: { httpUrl: 'https://ai-generator.tuanjie.cn/mcp', trust: true } } };
const settingsFile = path.join(workspace, '.gamecowork-cli/settings.json');
fs.writeFileSync(settingsFile, JSON.stringify(storedSettings));
const exe = path.join(packageRoot, 'gamecowork.exe');
let child;
let stdout = '', stderr = '';
let sequence = 0;
const notifications = [];
const pending = new Map();
const checks = [];
function check(name, condition) { checks.push({ name, passed: Boolean(condition) }); console.log(`${name}: ${condition ? 'PASS' : 'FAIL'}`); assert.ok(condition, name); }
async function stop() {
  if (!child || child.exitCode !== null) return;
  const current = child;
  const exited = new Promise(resolve => current.once('exit', resolve));
  current.kill();
  await exited;
}
function start() {
  child = spawn(exe, [prewarm ? '--prewarm' : '--experimental-acp', '--upm=false', '--model', mock.model, '--disable-next-speaker-check'], { cwd: prewarm ? managedDefault : workspace, env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  let carry = '';
  child.stdout.on('data', data => {
    const text = data.toString(); stdout += text; carry += text;
    let end;
    while ((end = carry.indexOf('\n')) >= 0) {
      const line = carry.slice(0, end); carry = carry.slice(end + 1);
      try {
        const frame = JSON.parse(line);
        const owner = pending.get(frame.id);
        if (owner) { clearTimeout(owner.timer); pending.delete(frame.id); owner.resolve(frame); }
        else if (frame.method && frame.id !== undefined) {
          // Do not approve model writes/shell commands in this read-only fixture.
          child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: frame.id, error: { code: -32601, message: 'Read-only CLI fixture client' } }) + '\n');
        } else notifications.push(frame);
      } catch {}
    }
  });
  child.stderr.on('data', data => { stderr += data.toString(); });
}
function rpc(method, params) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`RPC timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, timer });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}
async function waitFor(predicate, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (!predicate()) { if (Date.now() >= deadline) throw new Error('Timed out waiting for streamed fixture event'); await new Promise(resolve => setTimeout(resolve, 25)); }
}
async function initialize() {
  const response = await rpc('initialize', { protocolVersion: 1, clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false } });
  check('ACP initializes with protocol 1', response.result?.protocolVersion === 1);
  check('local mode advertises own provider without cloud login', response.result.authMethods.some(method => method.id === 'openai') && !response.result.authMethods.some(method => method.id === 'gamecowork-oauth'));
}
const summary = { fixtureDirectory: root, checks };
try {
  start(); await initialize();
  const organizations = await rpc('_gamecowork/org/list', {});
  check('local org query reports unsupported without claiming cloud success', organizations.result?.success === false && organizations.result?.mode === 'local' && organizations.result?.orgs?.length === 0);
  const firstRequestedId = prewarm ? randomUUID() : undefined;
  const opened = await rpc('session/new', { cwd: workspace, mcpServers: [], ...(firstRequestedId ? { _meta: { gamecowork: { resumeSessionId: firstRequestedId } } } : {}) });
  check('new session succeeds without --auth-type or cloud credentials', typeof opened.result?.sessionId === 'string');
  if (prewarm) check('prewarmed default accepts a fresh UI resume UUID using target project auth', opened.result.sessionId === firstRequestedId);
  const sessionId = opened.result.sessionId;
  const begin = notifications.length;
  const first = await rpc('session/prompt', { sessionId, prompt: [{ type: 'text', text: 'GCW_E2E_A: a short synthetic fixture response.' }] });
  check('first prompt ends normally', first.result?.stopReason === 'end_turn');
  const chunks = notifications.slice(begin).filter(frame => frame.params?.update?.sessionUpdate === 'agent_message_chunk').map(frame => frame.params.update.content?.text || '');
  check('all actual provider chunks reach ACP', chunks.length >= 2 && chunks.join('').includes('GCW_REPLY_A_COMPLETE'));
  const slowIndex = notifications.length;
  const cancellation = rpc('session/prompt', { sessionId, prompt: [{ type: 'text', text: 'GCW_E2E_SLOW: test cancellation only.' }] });
  await waitFor(() => notifications.slice(slowIndex).some(frame => frame.params?.update?.sessionUpdate === 'agent_message_chunk'));
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'session/cancel', params: { sessionId } }) + '\n');
  const cancelled = await cancellation;
  check('cancel resolves the prompt', cancelled.result?.stopReason === 'cancelled');
  await waitFor(() => mock.requests.some(request => request.scenario === 'slow' && request.aborted));
  check('cancel aborts the provider HTTP stream', mock.requests.some(request => request.scenario === 'slow' && request.aborted));
  await stop(); start(); await initialize();
  const resumed = await rpc('session/new', { cwd: workspace, mcpServers: [], _meta: { gamecowork: { resumeSessionId: sessionId } } });
  check('restarted CLI resumes the same durable session', resumed.result?.sessionId === sessionId);
  const resumedPrompt = await rpc('session/prompt', { sessionId, prompt: [{ type: 'text', text: 'Third synthetic fixture turn after restart.' }] });
  check('resumed session accepts a new prompt', resumedPrompt.result?.stopReason === 'end_turn');
  check('resume delivered persisted conversation context', mock.requests.filter(request => request.url === '/v1/chat/completions').at(-1).firstTurnPresent);
  check('provider received the actual configured synthetic credential', mock.requests.every(request => request.authorized));
  check('project gateway auth setting was not rewritten', JSON.parse(fs.readFileSync(settingsFile, 'utf8')).selectedAuthType === 'gamecowork-oauth');
  check('legacy cloud MCP settings remain unchanged while local runtime disables its connection', JSON.parse(fs.readFileSync(settingsFile, 'utf8')).mcpServers.TJGenerators.httpUrl === storedSettings.mcpServers.TJGenerators.httpUrl);
  check('no background cloud OAuth was opened', !stderr.includes('Opening browser for GameCowork authentication'));
  const guardEvents = fs.readFileSync(path.join(root, 'guard-events.jsonl'), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
  check('local mode made no vendor network request attempts', !guardEvents.some(event => /fetch|https\.request|http\.request|net\.connect/.test(event.operation)));
} catch (error) {
  summary.failure = { type: error.name, message: String(error.message).slice(0, 300) }; process.exitCode = 1;
} finally {
  await stop(); for (const owner of pending.values()) clearTimeout(owner.timer);
  await mock.close();
  const guardFile = path.join(root, 'guard-events.jsonl');
  const events = fs.existsSync(guardFile) ? fs.readFileSync(guardFile, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
  summary.guardOperations = {};
  for (const event of events) summary.guardOperations[event.operation] = (summary.guardOperations[event.operation] || 0) + 1;
  summary.requests = mock.requests;
  summary.passed = checks.filter(item => item.passed).length;
  summary.total = checks.length;
  fs.writeFileSync(path.join(root, 'stdout.txt'), stdout); fs.writeFileSync(path.join(root, 'stderr.txt'), stderr);
  fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ fixtureDirectory: root, passed: summary.passed, total: summary.total, failure: summary.failure, guardOperations: summary.guardOperations }));
}
