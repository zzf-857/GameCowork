// Explicit user-configurable synchronous response adapters through actual HTTP.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID, createHash } from 'node:crypto';
import { startAssetGenerationProvider } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/asset-adapter-' + randomUUID()), sha = bytes => createHash('sha256').update(bytes).digest('hex');
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
