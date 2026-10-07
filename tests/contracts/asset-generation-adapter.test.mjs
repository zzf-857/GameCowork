// Explicit user-configurable synchronous response adapters through actual HTTP.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID, createHash } from 'node:crypto';
import { startAssetGenerationProvider } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/modules/generation/service.js');
const root = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/asset-adapter-' + randomUUID()), sha = bytes => createHash('sha256').update(bytes).digest('hex');
let peer, service, configuration;
const terminal = new Set(['completed', 'failed', 'interrupted', 'cancelled']);
async function done(id) { const deadline = Date.now() + 3000; for (;;) { const { task } = await service.dispatch('generator/getTask', { taskId: id }); if (terminal.has(task.status)) return task; if (Date.now() > deadline) throw Error('Owned adapter completion deadline'); await new Promise(resolve => setTimeout(resolve, 5)); } }
test.before(async () => {
  peer = await startAssetGenerationProvider({ root, plans: { OWN_SYNC_IMAGE: { kind: 'image', base64: true } } });
  service = createAssetService({ root: path.join(root, 'runtime'), pollIntervalMs: 20, requestTimeoutMs: 1000 });
  configuration = { id: 'owned-sync', name: 'Owned configurable synchronous image', kinds: ['image'], baseUrl: peer.baseUrl, model: 'owned-model', authMode: 'bearer', apiKey: peer.apiKey,
    adapter: { responseMode: 'outputs', create: { method: 'POST', path: '/images/generations', bodyTemplate: { model: '{{model}}', prompt: '{{prompt}}', custom: '{{parameters}}' } }, cancel: null,
      selectors: { outputs: 'data' }, outputSelectors: { url: '', base64: '/b64_json', mime: '', filename: '' } } };
});
test.after(async () => { await service?.close(); await peer?.close(); });

test('Configured statusless image response maps per-output fields and stores verified real PNG bytes', async () => {
  const saved = await service.dispatch('generator/saveProvider', { provider: configuration });
  const { task: initial } = await service.dispatch('generator/createTask', { providerId: saved.provider.id, kind: 'image', prompt: 'OWN_SYNC_IMAGE actual "prompt"\nline', parameters: { width: 48, transparent: true } });
  const task = await done(initial.id); assert.equal(task.status, 'completed'); assert.equal(task.artifacts.length, 1);
  const resource = await service.dispatch('generator/getResource', { taskId: task.id, artifactId: task.artifacts[0].id });
  assert.equal(resource.mime, 'image/png'); assert.equal(sha(Buffer.from(resource.base64, 'base64')), peer.media.png.sha256);
  assert.equal(task.artifacts[0].filename, 'output-1.png');
  const sent = peer.requests.find(row => row.method === 'POST'); assert.equal(sent.path, '/images/generations'); assert.deepEqual(sent.body.custom, { width: 48, transparent: true }); assert.match(sent.body.prompt, /\nline$/);
  assert.ok(peer.requests.every(row => row.method === 'POST'), 'Synchronous completion never falls into asynchronous poll/cancel routes');
  const persisted = JSON.parse(fs.readFileSync(path.join(root, 'runtime/providers.json'))); assert.equal(persisted['owned-sync'].adapter.responseMode, 'outputs'); assert.equal(persisted['owned-sync'].adapter.outputSelectors.base64, '/b64_json');
  assert.equal(JSON.stringify({ saved, task, resource }).includes(peer.apiKey), false);
});

test('Synchronous mode cannot complete a missing output array or a mismatched output-field mapping', async () => {
  for (const [name, change, pattern] of [
    ['array', { selectors: { outputs: 'missing.outputs' } }, /requires 1\.\.8 actual output/],
    ['field', { outputSelectors: { url: '', base64: 'missing.base64', mime: '', filename: '' } }, /actual URL or base64/],
  ]) {
    const saved = await service.dispatch('generator/saveProvider', { provider: { ...configuration, id: 'bad-' + name, adapter: { ...configuration.adapter, ...change } } });
    const { task: initial } = await service.dispatch('generator/createTask', { providerId: saved.provider.id, kind: 'image', prompt: 'OWN_SYNC_IMAGE' });
    const task = await done(initial.id); assert.equal(task.status, 'failed'); assert.equal(task.artifacts.length, 0); assert.match(task.error, pattern);
  }
});

test('Default task mode never infers completion from an unconfigured statusless response', async () => {
  const adapter = { ...configuration.adapter }; delete adapter.responseMode;
  const saved = await service.dispatch('generator/saveProvider', { provider: { ...configuration, id: 'owned-task-mode', adapter } });
  assert.equal(saved.provider.adapter.responseMode, 'task');
  const { task: initial } = await service.dispatch('generator/createTask', { providerId: saved.provider.id, kind: 'image', prompt: 'OWN_SYNC_IMAGE' });
  const task = await done(initial.id); assert.equal(task.status, 'interrupted'); assert.equal(task.mayContinue, true); assert.equal(task.artifacts.length, 0); assert.match(task.error, /no usable remote task ID/);
});

test('Explicit pending responses in synchronous mode remain incomplete and are not submitted again', async () => {
  const saved = await service.dispatch('generator/saveProvider', { provider: { ...configuration, id: 'owned-pending', kinds: ['model'], adapter: { ...configuration.adapter, create: { method: 'POST', path: '/tasks', bodyTemplate: { kind: '{{kind}}', prompt: '{{prompt}}' } }, selectors: { outputs: 'outputs' } } } });
  const before = peer.requests.length, { task: initial } = await service.dispatch('generator/createTask', { providerId: saved.provider.id, kind: 'model', prompt: 'OWN_ASYNC_PENDING' });
  const task = await done(initial.id); assert.equal(task.status, 'interrupted'); assert.equal(task.mayContinue, true); assert.equal(task.artifacts.length, 0); assert.equal(peer.requests.length, before + 1);
});

test('Unknown adapter modes and unsafe/empty output mappings fail before transport or persistence', async () => {
  const before = peer.requests.length;
  for (const change of [{ responseMode: 'infer-success' }, { outputSelectors: { base64: '', url: '' } }, { outputSelectors: { base64: '__proto__.secret' } }, { outputSelectors: { unknown: 'x' } }]) {
    await assert.rejects(() => service.dispatch('generator/saveProvider', { provider: { ...configuration, id: 'invalid', adapter: { ...configuration.adapter, ...change } } }));
  }
  assert.equal(peer.requests.length, before); assert.equal((await service.dispatch('generator/listProviders')).providers.some(item => item.id === 'invalid'), false);
});

test('OpenAI Images distinguishes invalid data shapes without retaining reply secrets and keeps standard URL/base64 results working', async () => {
  const ownedKey = 'owned-diagnostic-key-' + randomUUID(), replyPrompt = 'DO_NOT_STORE_DIAGNOSTIC_REPLY_PROMPT', encoded = peer.media.png.bytes.toString('base64');
  const shapes = new Map([
    ['missing', { response: { prompt: replyPrompt, error: { message: ownedKey }, url: 'https://reply.invalid/image?token=' + ownedKey, b64_json: encoded }, pattern: /data 缺失/ }],
    ['object', { response: { data: { b64_json: encoded, url: 'https://reply.invalid/image?token=' + ownedKey }, prompt: replyPrompt }, pattern: /data 不是数组（类型：object）/ }],
    ['null', { response: { data: null }, pattern: /data 不是数组（类型：null）/ }],
    ['string', { response: { data: ownedKey }, pattern: /data 不是数组（类型：string）/ }],
    ['empty', { response: { data: [] }, pattern: /空 data 数组（0 张）/ }],
    ['excess', { response: { data: Array.from({ length: 9 }, () => ({ b64_json: encoded })) }, pattern: /data 数量超限（9 张/ }],
    ['base64', { response: { data: [{ b64_json: encoded }] } }],
    ['url', {}],
  ]);
  const requests = [], sockets = new Set(), runtimeRoot = path.join(root, 'response-diagnostics'); let diagnostic, baseUrl;
  const server = http.createServer(async (request, response) => {
    requests.push({ method: request.method, path: request.url });
    if (request.method === 'GET' && request.url === '/owned.png') { response.writeHead(200, { 'Content-Type': 'image/png' }); response.end(peer.media.png.bytes); return; }
    assert.equal(request.method, 'POST'); assert.equal(request.url, '/images/generations'); assert.equal(request.headers.authorization, 'Bearer ' + ownedKey);
    const chunks = []; for await (const bytes of request) chunks.push(bytes); const body = JSON.parse(Buffer.concat(chunks)), plan = shapes.get(body.prompt); assert.ok(plan);
    response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(body.prompt === 'url' ? { data: [{ url: baseUrl + '/owned.png' }] } : plan.response));
  });
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); baseUrl = 'http://127.0.0.1:' + server.address().port;
  const reopen = () => { diagnostic = createAssetService({ root: runtimeRoot, pollIntervalMs: 20, requestTimeoutMs: 1000 }); };
  const wait = async id => { const deadline = Date.now() + 3000; for (;;) { const { task } = await diagnostic.dispatch('generator/getTask', { taskId: id }); if (terminal.has(task.status)) return task; if (Date.now() > deadline) throw Error('Owned response diagnostic deadline'); await new Promise(resolve => setTimeout(resolve, 5)); } };
  const failed = [];
  try {
    reopen(); await diagnostic.dispatch('generator/saveProvider', { provider: { ...configuration, id: 'owned-diagnostics', baseUrl, apiKey: ownedKey, adapter: { ...configuration.adapter, outputSelectors: { url: 'url', base64: 'b64_json', mime: '', filename: '' } } } });
    for (const [prompt, plan] of shapes) {
      const before = requests.filter(row => row.method === 'POST').length;
      const { task: queued } = await diagnostic.dispatch('generator/createTask', { providerId: 'owned-diagnostics', kind: 'image', prompt }); const task = await wait(queued.id);
      assert.equal(requests.filter(row => row.method === 'POST').length, before + 1, 'Each explicit fixture submission issues exactly one POST');
      if (plan.pattern) { assert.equal(task.status, 'failed'); assert.equal(task.mayContinue, false); assert.equal(task.artifacts.length, 0); assert.match(task.error, plan.pattern); failed.push(task); }
      else { assert.equal(task.status, 'completed', task.error); assert.equal(task.artifacts.length, 1); assert.equal(task.artifacts[0].sha256, peer.media.png.sha256); }
      for (const secret of [ownedKey, replyPrompt, 'reply.invalid', encoded]) assert.equal(JSON.stringify(task).includes(secret), false);
    }
    const saved = fs.readFileSync(path.join(runtimeRoot, 'tasks.json'), 'utf8');
    for (const secret of [ownedKey, replyPrompt, 'reply.invalid', encoded]) assert.equal(saved.includes(secret), false, 'Response details never enter durable task state');
    const before = requests.length; await diagnostic.close(); reopen();
    for (const previous of failed) { const { task } = await diagnostic.dispatch('generator/getTask', { taskId: previous.id }); assert.equal(task.error, previous.error); assert.equal(task.status, 'failed'); }
    await new Promise(resolve => setTimeout(resolve, 40)); assert.equal(requests.length, before, 'Restart cannot resubmit failed image tasks');
    assert.equal(requests.filter(row => row.method === 'GET').length, 1, 'Only the explicit standard URL result downloads a file');
  } finally { await diagnostic?.close(); for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); }
});
