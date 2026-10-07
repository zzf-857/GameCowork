// Real Rust -> maintained Core -> same-source guarded compiled Agent. Only a
// test preload gates ownership timing; no prompt or completion is submitted.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';
import { randomUUID, createHash } from 'node:crypto';

const project = fileURLToPath(new URL('../../', import.meta.url)), args = process.argv.slice(2);
const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
assert.ok(args.includes('--package'), 'Pass --package with the verified guarded compiled Agent');
const pkg = path.resolve(option('--package')), packaged = args.includes('--packaged');
const appRoot = path.resolve(option('--app-root', path.join(project, 'app')));
const core = path.join(packaged ? path.join(appRoot, 'core') : path.join(project, 'src/core/binary/out'));
const entry = path.join(core, 'index.js'), agent = path.join(pkg, 'gamecowork.exe');
const binary = path.resolve(option('--binary', path.join(packaged ? appRoot : path.join(project, 'src/shell/target/debug'), 'GameCowork.exe')));
const manifest = JSON.parse(fs.readFileSync(path.join(pkg, 'cli-package-manifest.json'), 'utf8'));
assert.equal(manifest.testGuardIncluded, true);
assert.equal(manifest.executableSha256.toLowerCase(), createHash('sha256').update(fs.readFileSync(agent)).digest('hex'));
assert.equal(manifest.sourceSha256.toLowerCase(), createHash('sha256').update(fs.readFileSync(path.join(project, 'src/agent/cli-main.beautified.js'))).digest('hex'));
if (packaged) {
  const normal = JSON.parse(fs.readFileSync(path.join(appRoot, 'cli/cli-package-manifest.json'), 'utf8'));
  assert.equal(normal.testGuardIncluded, false); assert.equal(normal.sourceSha256, manifest.sourceSha256);
  assert.equal(normal.executableSha256.toLowerCase(), createHash('sha256').update(fs.readFileSync(path.join(appRoot, 'cli/gamecowork.exe'))).digest('hex'));
}
const base = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work'), root = path.resolve(option('--output', path.join(base, 'core-command-bootstrap-' + randomUUID())));
assert.ok(root.startsWith(base + path.sep)); fs.mkdirSync(root, { recursive: true });
fs.mkdirSync(path.join(root, 'releases'));
const workspace = path.join(root, 'workspace'); fs.mkdirSync(path.join(workspace, '.gamecowork-cli/commands'), { recursive: true });
fs.writeFileSync(path.join(workspace, '.gamecowork-cli/commands/owned-bootstrap.toml'), 'prompt = "Owned bootstrap fixture command; never executed"\ndescription = "Owned bootstrap command"\n');
fs.writeFileSync(path.join(workspace, '.gamecowork-cli/settings.json'), JSON.stringify({ disableNextSpeakerCheck: true }));
const initialId = randomUUID(), lateId = randomUUID(), reopenedId = randomUUID();
const requests = [], frames = [], checks = [], changes = new EventEmitter();
const endpoint = http.createServer(async (request, response) => {
  for await (const _bytes of request) { /* Discard fixture credentials/body. */ }
  requests.push({ method: request.method, route: request.url });
  response.setHeader('content-type', 'application/json');
  if (request.url === '/v1/models') response.end(JSON.stringify({ data: [{ id: 'bootstrap-unused-model', object: 'model', owned_by: 'fixture' }] }));
  else { response.statusCode = 501; response.end(JSON.stringify({ error: { message: 'No model completion is authorized by this test' } })); }
});
await new Promise(resolve => endpoint.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${endpoint.address().port}/v1`;
const env = { ...process.env };
for (const key of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|OTEL_)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key) || key === 'NODE_OPTIONS') delete env[key];
Object.assign(env, { GAMECOWORK_HEADLESS: '1', GAMECOWORK_TEST_MODE: '1', GAMECOWORK_APP_ROOT: appRoot,
  GAMECOWORK_CORE_DIR: core, GAMECOWORK_CORE_ENTRY: entry, GAMECOWORK_FRONTEND_DIR: path.join(packaged ? appRoot : path.join(project, 'src'), packaged ? 'frontend' : 'frontend/bundle'),
  GAMECOWORK_DATA_DIR: path.join(root, 'data'), GAMECOWORK_AGENT_PATH: agent, GAMECOWORK_AGENT_RESOURCE_DIR: path.join(pkg, 'resources'),
  GAMECOWORK_SMOKE_ROOT: root, GAMECOWORK_SMOKE_CLI_PATH: agent, GAMECOWORK_CLI_PROBE_ROOT: root, GAMECOWORK_CLI_PROBE_SOURCE: pkg,
  GAMECOWORK_BOOTSTRAP_CORE_SHA: createHash('sha256').update(fs.readFileSync(entry)).digest('hex'),
  GAMECOWORK_BOOTSTRAP_HOLD_SESSIONS: JSON.stringify([initialId, lateId]),
  NODE_OPTIONS: '--require ' + JSON.stringify(path.join(project, 'tests/fixtures/core-command-bootstrap-guard.cjs')) });
let shell, origin, log = '', eventAbort, eventPump, failure;
const traceFile = path.join(root, 'bootstrap-events.jsonl');
function traces() { return fs.existsSync(traceFile) ? fs.readFileSync(traceFile, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse) : []; }
const watcher = fs.watch(root, () => changes.emit('change'));
function waitFor(predicate, label, timeout = 75000) {
  return new Promise((resolve, reject) => {
    const check = () => { try { const value = predicate(); if (value) finish(null, value); } catch (error) { finish(error); } };
    const timer = setTimeout(() => finish(Error('Timed out: ' + label)), timeout);
    function finish(error, value) { clearTimeout(timer); changes.off('change', check); error ? reject(error) : resolve(value); }
    changes.on('change', check); check();
  });
}
function pass(label) { checks.push(label); console.log('PASS ' + label); }
async function call(route, body) {
  const response = await fetch(new URL(route, origin), { method: body === undefined ? 'GET' : 'POST', headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(80000) });
  return { status: response.status, body: await response.json() };
}
async function rpc(kind, data, key, acceptError = false) {
  const id = randomUUID(), result = await call('/api/tauri/invoke', { workspaceKey: key, message: { messageType: kind, messageId: id, data } });
  assert.equal(result.status, 200); assert.equal(result.body.messageId, id); assert.equal(result.body.data.done, true);
  if (!acceptError) { assert.equal(result.body.data.status, 'success', result.body.data.error); assert.notEqual(result.body.data.content?.status, 'error'); }
  return result.body.data.content ?? result.body.data;
}
async function subscribe() {
  eventAbort = new AbortController(); const response = await fetch(new URL('/api/tauri/events', origin), { signal: eventAbort.signal });
  eventPump = (async () => { let carry = ''; const decoder = new TextDecoder();
    try { for await (const bytes of response.body) { carry += decoder.decode(bytes, { stream: true }).replaceAll('\r\n', '\n'); let split;
      while ((split = carry.indexOf('\n\n')) >= 0) { const block = carry.slice(0, split); carry = carry.slice(split + 2);
        const data = block.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n');
        if (data) { const envelope = JSON.parse(data), inner = typeof envelope.inner === 'string' ? JSON.parse(envelope.inner) : envelope.inner;
          frames.push(inner ? { ...inner, owner: envelope.hubWorkspaceKey } : envelope); changes.emit('change'); }
      } }
    } catch (error) { if (!eventAbort.signal.aborted) throw error; }
  })();
}
function release(id) { fs.writeFileSync(path.join(root, 'releases', id + '.release'), 'Release the owned test barrier'); }
try {
  shell = spawn(binary, [], { cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  for (const output of [shell.stdout, shell.stderr]) output.on('data', bytes => { log += bytes; origin ||= log.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/)?.[1]; changes.emit('change'); });
  shell.on('exit', () => changes.emit('change'));
  await waitFor(() => origin || (shell.exitCode !== null && (() => { throw Error(log); })()), 'real Rust/Core startup'); await subscribe();
  const opened = await call('/api/tauri/hub/open-workspace', { path: workspace }); assert.equal(opened.body.ok, true); const key = opened.body.workspaceKey;
  const provider = await rpc('acp/modelProfiles', { method: 'addProvider', meta: { name: 'Unused bootstrap auth fixture', baseUrl, apiKey: 'fixture-no-real-key', authType: 'openai' } }, key);
  const providerId = provider.result.id, modelId = providerId + ':bootstrap-unused-model';
  await rpc('acp/modelProfiles', { method: 'add', meta: { name: modelId, model: 'bootstrap-unused-model', providerId, displayName: 'Unused bootstrap model', wireApi: 'chat', roles: ['model'], authType: 'openai' } }, key);
  await rpc('acp/modelProfiles', { method: 'setProviderSlots', meta: { providerId, flashModelId: modelId, multimodalModelId: modelId } }, key);
  await rpc('config/refreshProfiles', { reason: 'Owned bootstrap integration' }, key);
  const profile = await rpc('config/getSerializedProfileInfo', {}, key), selected = profile.result.config.modelsByRole.chat.find(model => model.extras?.customModelId === modelId);
  assert.ok(selected); await rpc('config/updateSelectedModel', { profileId: profile.profileId, role: 'chat', title: selected.title }, key);
  const initialize = rpc('acp/initSession', { continueSessionId: initialId, currentModel: selected.title }, key);
  await waitFor(() => traces().some(trace => trace.event === 'barrierHeld' && trace.id === initialId), 'actual session/new result held before registration');
  const early = await waitFor(() => traces().find(trace => trace.event === 'commandsNotification' && trace.id === initialId && !trace.owned && trace.names.includes('owned-bootstrap')), 'real compiled Agent command update before Core registration');
  pass('Actual compiled Agent advertised the saved command before Core registry ownership');
  let refreshDone = false; const refresh = rpc('acp/refreshCommands', {}, key).then(value => { refreshDone = true; changes.emit('change'); return value; });
  await waitFor(() => traces().some(trace => trace.event === 'refreshBegin' && trace.pendingIds.includes(initialId)), 'refresh observes actual pending initialization');
  assert.equal(refreshDone, false); release(initialId); await initialize;
  const registered = await waitFor(() => traces().find(trace => trace.event === 'registryRegistered' && trace.id === initialId), 'Core registers the returned real session');
  const replay = await waitFor(() => traces().find(trace => trace.event === 'commandsNotification' && trace.id === initialId && trace.owned && trace.names.includes('owned-bootstrap')), 'Core replays its real retained commands');
  assert.ok(early.sequence < registered.sequence && registered.sequence < replay.sequence);
  await waitFor(() => frames.some(frame => frame.messageType === 'acp/availableCommandsUpdated' && frame.owner === key && frame.data?.commands?.some(command => command.name === 'owned-bootstrap')), 'real bootstrap reaches GUI/Core SSE');
  pass('The registered Core immediately replayed its actual cache to GUI SSE');
  const summary = await refresh; assert.equal(summary.refreshed, 1); assert.equal(summary.pendingInit, 1);
  pass('A refresh issued during real initialization returned the confirmed one-owner summary');
  // A separate fresh session proves initial registration alone publishes its
  // bootstrap. No refresh RPC is issued in this stage.
  const before = traces().filter(trace => trace.event === 'refreshBegin').length;
  const later = rpc('acp/initSession', { continueSessionId: lateId, currentModel: selected.title }, key, true);
  await waitFor(() => traces().some(trace => trace.event === 'barrierHeld' && trace.id === lateId), 'late actual session/new result held');
  const closed = await call('/api/tauri/hub/close-workspace', { workspaceKey: key }); assert.equal(closed.body.ok, true);
  const reopened = await call('/api/tauri/hub/open-workspace', { path: workspace }); assert.equal(reopened.body.ok, true); assert.equal(reopened.body.workspaceKey, key);
  await rpc('acp/initSession', { continueSessionId: reopenedId, currentModel: selected.title }, key);
  await waitFor(() => traces().some(trace => trace.event === 'commandsNotification' && trace.id === reopenedId && trace.owned), 'new generation publishes actual bootstrap without refresh');
  assert.equal(traces().filter(trace => trace.event === 'refreshBegin').length, before);
  pass('A reopened workspace publishes its first real command list without any additional refresh RPC');
  release(lateId); await later;
  await waitFor(() => {
    if (traces().some(trace => trace.event === 'registryRegistered' && trace.id === lateId)) throw Error('Late initialization revived a detached workspace');
    return traces().some(trace => trace.event === 'managerShutdownDone' && trace.id === lateId);
  }, 'old detached initialization manager is retired');
  assert.ok(!traces().some(trace => trace.event === 'registryRegistered' && trace.id === lateId), 'Closed generation cannot register after its late result');
  assert.ok(!traces().some(trace => trace.event === 'commandsNotification' && trace.id === lateId && trace.owned));
  pass('A late initialization result cannot revive the closed workspace generation');
  assert.ok(!requests.some(request => request.route.includes('/chat/completions'))); pass('No model completion or AI-generated content was requested');
  const guardLog = path.join(root, 'guard-events.jsonl');
  const guardEvents = fs.existsSync(guardLog) ? fs.readFileSync(guardLog, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
  assert.ok(!guardEvents.some(event => /fetch|https?\.request|net\.connect|external-network/.test(event.operation)));
  pass('The real Core and compiled Agent attempted no external service request');
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error); }
finally {
  for (const id of [initialId, lateId]) release(id);
  eventAbort?.abort(); await eventPump?.catch(() => {}); watcher.close();
  if (shell?.exitCode === null) { const exit = new Promise(resolve => shell.once('exit', resolve)); await promisify(execFile)('taskkill.exe', ['/PID', String(shell.pid), '/F'], { windowsHide: true }); await exit; }
  const ownedActorPids = [...new Set([shell?.pid, ...traces().flatMap(trace => [trace.corePid, trace.actorPid])].filter(pid => Number.isInteger(pid) && pid > 0))];
  const actorsStillRunning = ownedActorPids.filter(pid => { try { process.kill(pid, 0); return true; } catch (error) { if (error.code === 'ESRCH') return false; throw error; } });
  if (actorsStillRunning.length) { failure ||= { message: 'Owned Actors remained running after kernel Job cleanup', actorsStillRunning }; process.exitCode = 1; }
  endpoint.closeAllConnections(); await new Promise(resolve => endpoint.close(resolve));
  fs.writeFileSync(path.join(root, 'host.log'), log);
  fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify({ checks, failure, requests, coreSourceSha256: env.GAMECOWORK_BOOTSTRAP_CORE_SHA,
    agentSourceSha256: manifest.sourceSha256, guardedAgentSha256: manifest.executableSha256,
    ownedShellPid: shell?.pid, ownedActorPids, actorsStillRunning, root, traceBoundary: 'Test preload gates real session/new before registry; commands are actual Agent output' }, null, 2));
  console.log('Artifacts: ' + root);
}
