// Internal third-party image profile against a real owned HTTP fixture. No WAN.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { startAssetGenerationProvider } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const { CPA_IMAGE_MODELS } = require('../../src/core/binary/out/gamecowork-cpa-image-models.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/cpa-flexible-20261003/profile-' + randomUUID()), store = path.join(root, 'runtime');
let peer, service, configuration, providerBytes, completedTask;
const reopen = () => { service = createAssetService({ root: store, pollIntervalMs: 20, requestTimeoutMs: 200 }); };
const request = (modelId = 'cpa-gpt-image-2', extra = {}) => {
  const parameters = { prompt: 'Owned CPA flexible image', studioModelId: modelId, model: CPA_IMAGE_MODELS[modelId].model,
    size: '1536x1024', quality: 'low', outputFormat: 'png', ...extra };
  return { providerId: configuration.id, kind: 'image', model: parameters.model, prompt: parameters.prompt, workspaceKey: 'workspace-a', parameters, inputIds: [] };
};
async function done(taskId) {
  const deadline = Date.now() + 3000;
  for (;;) {
    const { task } = await service.dispatch('generator/getTask', { taskId });
    if (['completed', 'failed', 'interrupted', 'cancelled'].includes(task.status)) return task;
    if (Date.now() > deadline) throw Error('Owned CPA profile completion deadline');
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}
test.before(async () => {
  peer = await startAssetGenerationProvider({ root, plans: { HOLD_CPA_CREATE: { kind: 'image', holdCreate: true } } }); reopen();
  configuration = { id: 'legacy-cpa', name: 'Owned fixed CPA profile', kinds: ['image'], baseUrl: peer.baseUrl, model: 'gpt-image-2', authMode: 'bearer', apiKey: peer.apiKey,
    adapter: { responseMode: 'outputs', create: { method: 'POST', path: '/images/generations', bodyTemplate: {
      model: '{{model}}', prompt: '{{prompt}}', n: 1, size: '1024x1024', quality: 'low', output_format: 'png',
    } }, cancel: null, selectors: { outputs: 'data' }, outputSelectors: { url: 'url', base64: 'b64_json', mime: '', filename: '' } } };
  await service.dispatch('generator/saveProvider', { provider: configuration });
  providerBytes = fs.readFileSync(path.join(store, 'providers.json'));
});
test.after(async () => { await service?.close(); await peer?.close(); });

test('Internal CPA entry sends each exact model and selected dimensions despite a legacy fixed template', async () => {
  const cases = [
    ['cpa-gpt-image-2', '1536x1024', 'medium', 'png'],
    ['cpa-gpt-image-2-5', '1024x1536', 'auto', 'jpeg'],
    ['cpa-gpt-image-2-5-flare', '2048x1152', 'xhigh', 'webp'],
    ['cpa-gpt-image-2-5-sunburst', '1152x2048', 'max', 'png'],
  ];
  for (const [modelId, size, quality, outputFormat] of cases) {
    const input = request(modelId, { size, quality, outputFormat });
    const { task: initial } = service.createCpaImageTask(input);
    input.parameters.size = '1024x1024';
    const task = await done(initial.id); assert.equal(task.status, 'completed', task.error);
    const sent = peer.requests.at(-1);
    assert.equal(sent.method, 'POST'); assert.equal(sent.path, '/images/generations'); assert.equal(sent.authorized, true);
    assert.deepEqual(sent.body, { model: CPA_IMAGE_MODELS[modelId].model, prompt: input.prompt, n: 1, size, quality, output_format: outputFormat });
    assert.equal(task.parameters.size, size); assert.equal(task.parameters.studioModelId, modelId); assert.equal(task.model, CPA_IMAGE_MODELS[modelId].model);
    assert.equal(Object.hasOwn(task, '_cpaImageProfile'), false); assert.equal(task.artifacts[0].width, 48); assert.equal(task.artifacts[0].height, 32);
    completedTask = task;
  }
  assert.equal(peer.requests.length, 4); assert.deepEqual(fs.readFileSync(path.join(store, 'providers.json')), providerBytes);
  const persisted = JSON.parse(fs.readFileSync(path.join(store, 'tasks.json')));
  assert.equal(persisted[completedTask.id]._cpaImageProfile, 1);
  assert.equal(persisted[completedTask.id].parameters.size, '1152x2048');
});

test('A public generic task cannot activate the private profile through a studio model label', async () => {
  const input = request('cpa-gpt-image-2-5', { size: '1024x1536', quality: 'high', outputFormat: 'jpeg' });
  const { task: initial } = await service.dispatch('generator/createTask', input);
  const task = await done(initial.id); assert.equal(task.status, 'completed');
  assert.deepEqual(peer.requests.at(-1).body, { model: input.model, prompt: input.prompt, n: 1, size: '1024x1024', quality: 'low', output_format: 'png' });
  assert.equal(JSON.parse(fs.readFileSync(path.join(store, 'tasks.json')))[task.id]._cpaImageProfile, undefined);
  const before = peer.requests.length;
  for (const internal of [{ _cpaImageProfile: 1 }, { cpaImageProfile: 1 }, { createSpec: {} }, { bodyTemplateOverride: {} }]) {
    await assert.rejects(() => service.dispatch('generator/createTask', { ...input, ...internal }), /internal entry point/);
  }
  await assert.rejects(() => service.dispatch('generator/createCpaImageTask', input), /Unknown asset service operation/);
  assert.equal(peer.requests.length, before); assert.deepEqual(fs.readFileSync(path.join(store, 'providers.json')), providerBytes);
});

test('The private entry rejects ambiguous payloads, references and unsupported profiles before submission', async () => {
  const before = peer.requests.length;
  for (const change of [{ kind: 'video' }, { model: 'gpt-image-2.5' }, { prompt: 'A different prompt' }, { inputs: [] }, { inputPaths: [] }, { inputIds: ['i_owned'] }]) {
    assert.throws(() => service.createCpaImageTask({ ...request(), ...change }), /disagree|reference inputs/);
  }
  for (const parameters of [{ size: '1024x512' }, { size: '1001x1001' }, { quality: 'max' }, { outputFormat: 'gif' }, { model: 'gpt-image-9' }, { n: 2 }]) {
    assert.throws(() => service.createCpaImageTask(request('cpa-gpt-image-2', parameters)));
  }
  for (const [id, change] of [['wrong-route', { create: { method: 'POST', path: '/tasks' } }], ['task-mode', { responseMode: 'task' }], ['wrong-output', { selectors: { outputs: 'other' } }], ['multipart', { create: { method: 'POST', path: '/images/generations', bodyType: 'multipart', bodyTemplate: {}, fileFields: [] } }]]) {
    await service.dispatch('generator/saveProvider', { provider: { ...configuration, id, adapter: { ...configuration.adapter, ...change } } });
    assert.throws(() => service.createCpaImageTask({ ...request(), providerId: id }), /profile is unavailable/);
  }
  assert.equal(peer.requests.length, before);
});

test('Internal idempotency cannot be confused with an earlier generic request using the same key', async () => {
  const input = { ...request(), idempotencyKey: 'own-cpa-key' };
  const first = service.createCpaImageTask(input), same = service.createCpaImageTask(input);
  assert.equal(same.task.id, first.task.id); assert.equal((await done(first.task.id)).status, 'completed');
  const before = peer.requests.length;
  await assert.rejects(() => service.dispatch('generator/createTask', input), /Idempotency key conflicts/);
  assert.throws(() => service.createCpaImageTask({ ...input, parameters: { ...input.parameters, size: '1024x1536' } }), /Idempotency key conflicts/);
  assert.equal(peer.requests.length, before);
});

test('Completed private-profile history survives restart and is never generated again', async () => {
  const before = peer.requests.length;
  await service.close(); reopen();
  const { task } = await service.dispatch('generator/getTask', { taskId: completedTask.id });
  assert.equal(task.status, 'completed'); assert.equal(task.parameters.size, '1152x2048'); assert.equal(task.parameters.outputFormat, 'png');
  assert.equal(task.model, 'gpt-image-2.5-sunburst'); assert.equal(Object.hasOwn(task, '_cpaImageProfile'), false);
  assert.equal((await service.dispatch('generator/getResource', { taskId: task.id, artifactId: task.artifacts[0].id })).sha256, task.artifacts[0].sha256);
  await new Promise(resolve => setTimeout(resolve, 50)); assert.equal(peer.requests.length, before);
});

test('An unknown CPA creation outcome remains interrupted after restart without another POST', async () => {
  const input = request('cpa-gpt-image-2-5', { prompt: 'HOLD_CPA_CREATE owned', size: '1024x1536', quality: 'low' });
  const before = peer.requests.length, { task: initial } = service.createCpaImageTask(input);
  const task = await done(initial.id); assert.equal(task.status, 'interrupted'); assert.equal(task.mayContinue, true); assert.match(task.error, /will not be resubmitted/);
  assert.equal(peer.requests.length, before + 1);
  const persisted = JSON.parse(fs.readFileSync(path.join(store, 'tasks.json')))[task.id];
  assert.equal(persisted._cpaImageProfile, 1); assert.equal(persisted._remoteId, undefined); assert.equal(persisted.parameters.size, input.parameters.size);
  await service.close(); reopen(); await new Promise(resolve => setTimeout(resolve, 50));
  assert.equal((await service.dispatch('generator/getTask', { taskId: task.id })).task.status, 'interrupted'); assert.equal(peer.requests.length, before + 1);
});
