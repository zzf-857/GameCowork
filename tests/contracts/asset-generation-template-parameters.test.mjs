// Per-task parameter templates through an owned loopback Provider. No real GEN.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { startAssetGenerationProvider } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/modules/generation/service.js');
const root = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/cpa-flexible-20261003/template-' + randomUUID());
let peer, service, configuration;
const terminal = new Set(['completed', 'failed', 'interrupted', 'cancelled']);
async function done(taskId) {
  const deadline = Date.now() + 3000;
  for (;;) {
    const { task } = await service.dispatch('generator/getTask', { taskId });
    if (terminal.has(task.status)) return task;
    if (Date.now() > deadline) throw Error('Owned dynamic template completion deadline');
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}
test.before(async () => {
  peer = await startAssetGenerationProvider({ root });
  service = createAssetService({ root: path.join(root, 'runtime'), pollIntervalMs: 20, requestTimeoutMs: 1000 });
  configuration = { id: 'dynamic-cpa', name: 'Owned parameter template', kinds: ['image'], baseUrl: peer.baseUrl, model: 'gpt-image-2', authMode: 'bearer', apiKey: peer.apiKey,
    adapter: { responseMode: 'outputs', create: { method: 'POST', path: '/images/generations', bodyTemplate: {
      model: '{{model}}', prompt: '{{prompt}}', size: '{{parameters.size}}', quality: '{{parameters.quality}}', output_format: '{{parameters.outputFormat}}',
      n: '{{parameters.n}}', options: '{{parameters.options}}', first: '{{parameters.palette.0}}', note: 'selected {{parameters.options.label}}',
    } }, cancel: null, selectors: { outputs: 'data' }, outputSelectors: { url: '', base64: 'b64_json', mime: '', filename: '' } } };
  await service.dispatch('generator/saveProvider', { provider: configuration });
});
test.after(async () => { await service?.close(); await peer?.close(); });

test('Saving a dynamic parameter template does not need invented task parameters', async () => {
  const { providers } = await service.dispatch('generator/listProviders');
  const saved = providers.find(item => item.id === configuration.id);
  assert.equal(saved.adapter.create.bodyTemplate.size, '{{parameters.size}}');
  assert.equal(saved.adapter.create.bodyTemplate.quality, '{{parameters.quality}}');
  assert.equal(saved.adapter.create.bodyTemplate.output_format, '{{parameters.outputFormat}}');
  assert.equal(peer.requests.length, 0);
  assert.equal(fs.readFileSync(path.join(root, 'runtime/providers.json'), 'utf8').includes(peer.apiKey), false);
});

test('Each task sends its selected model, landscape or portrait size and typed parameters', async () => {
  for (const [model, size, quality, outputFormat] of [['gpt-image-2', '1536x1024', 'medium', 'png'], ['gpt-image-2.5', '1024x1536', 'high', 'webp']]) {
    const parameters = { size, quality, outputFormat, n: 1, options: { transparent: false, label: 'own "label"\nline' }, palette: ['cyan', 'green'] };
    const { task: initial } = await service.dispatch('generator/createTask', { providerId: configuration.id, kind: 'image', model, prompt: 'Owned flexible image', parameters });
    const task = await done(initial.id); assert.equal(task.status, 'completed', task.error);
    const sent = peer.requests.at(-1);
    assert.equal(sent.path, '/images/generations'); assert.equal(sent.method, 'POST'); assert.equal(sent.authorized, true);
    assert.deepEqual(sent.body, { model, prompt: 'Owned flexible image', size, quality, output_format: outputFormat, n: 1,
      options: parameters.options, first: 'cyan', note: 'selected own "label"\nline' });
    assert.equal(task.model, model); assert.deepEqual(task.parameters, parameters);
    assert.equal(task.artifacts[0].width, 48); assert.equal(task.artifacts[0].height, 32, 'Output dimensions come from actual bytes');
  }
  assert.equal(peer.requests.length, 2, 'Synchronous tasks never poll or retry creation');
});

test('An unavailable task parameter fails before transport and does not invent a default', async () => {
  const before = peer.requests.length;
  const { task: initial } = await service.dispatch('generator/createTask', { providerId: configuration.id, kind: 'image', prompt: 'Do not submit', parameters: { quality: 'low' } });
  const task = await done(initial.id);
  assert.equal(task.status, 'failed'); assert.equal(task.mayContinue, false); assert.equal(task.artifacts.length, 0);
  assert.match(task.error, /unavailable body template variable: parameters.size/);
  await new Promise(resolve => setTimeout(resolve, 40));
  assert.equal(peer.requests.length, before);
});

test('Unknown fixed variables, unsafe parameter paths and out-of-range inputs remain rejected when saving', async () => {
  const before = peer.requests.length;
  for (const variable of ['unknownVariable', 'model.missing', 'parameters.constructor', 'parameters.nested.__proto__', 'parameters.prototype.key', 'parameters..size', 'parameters.size[0]', 'inputs.8.base64']) {
    await assert.rejects(() => service.dispatch('generator/saveProvider', { provider: { ...configuration, id: 'rejected-template', adapter: { ...configuration.adapter,
      create: { method: 'POST', path: '/images/generations', bodyTemplate: { selected: '{{' + variable + '}}' } } } } }), /body template variable/);
  }
  assert.equal(peer.requests.length, before);
  assert.equal((await service.dispatch('generator/listProviders')).providers.some(item => item.id === 'rejected-template'), false);
});

test('Dynamic placeholders do not relax the bounded JSON credential boundary', async () => {
  const before = peer.requests.length;
  for (const parameters of [{ size: '1024x1024', apiKey: 'must-not-enter-task' }, { options: { access_token: 'must-not-enter-task' } }, { n: Infinity }]) {
    await assert.rejects(() => service.dispatch('generator/createTask', { providerId: configuration.id, kind: 'image', prompt: 'Do not submit', parameters }), /Credentials belong|numbers must be finite/);
  }
  assert.equal(peer.requests.length, before);
});
