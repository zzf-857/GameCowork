// Gateway claims are bounded metadata, distinct from requests and verified bytes.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/modules/generation/service.js');
const { minimalPayload } = require('../../src/core/binary/out/modules/generation/models/official-catalog.js');
const root = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/cpa-flexible-20261003/reported-' + randomUUID());
const key = 'owned-reported-key-' + randomUUID(), requests = [], sockets = new Set();
let service, peer, baseUrl, completed;
function png(width, height) {
  const crc = bytes => { let value = 0xffffffff; for (const byte of bytes) { value ^= byte; for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0); } return (value ^ 0xffffffff) >>> 0; };
  const chunk = (name, bytes) => { const label = Buffer.from(name), result = Buffer.alloc(bytes.length + 12); result.writeUInt32BE(bytes.length); label.copy(result, 4); bytes.copy(result, 8); result.writeUInt32BE(crc(Buffer.concat([label, bytes])), bytes.length + 8); return result; };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const pixels = Buffer.alloc((width * 4 + 1) * height);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
}
const bytes = png(1254, 1254), encoded = bytes.toString('base64');
const reported = { quality: 'medium', size: '1254x1254', output_format: 'png', model: 'gpt-image-2' };
const reopen = () => { service = createAssetService({ root, pollIntervalMs: 20, requestTimeoutMs: 1000 }); };
const input = prompt => ({ providerId: 'owned-cpa', kind: 'image', model: 'gpt-image-2.5', prompt, workspaceKey: 'workspace-a', inputIds: [], parameters: {
  prompt, model: 'gpt-image-2.5', studioModelId: 'cpa-gpt-image-2-5', size: '1536x1024', quality: 'high', outputFormat: 'webp',
} });
async function done(taskId) {
  const deadline = Date.now() + 3000;
  for (;;) {
    const { task } = await service.dispatch('generator/getTask', { taskId });
    if (['completed', 'failed', 'interrupted'].includes(task.status)) return task;
    if (Date.now() > deadline) throw Error('Owned reported-image completion deadline');
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}
test.before(async () => {
  peer = http.createServer(async (request, response) => {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks)); requests.push({ route: request.url, body });
    assert.equal(request.headers.authorization, 'Bearer ' + key);
    let metadata = {};
    if (body.prompt === 'reported' || body.prompt === 'generic' || body.prompt === 'bad-pixels' || body.prompt === 'http-error') metadata = { ...reported, token: key, prompt: 'DO_NOT_STORE_REPLY_PROMPT', headers: { Authorization: 'Bearer ' + key } };
    if (body.prompt === 'unsafe') metadata = { quality: 'https://example.invalid/result?token=' + key, size: '1254x1254?token=' + key, output_format: 'png\n' + key, model: key };
    if (body.prompt === 'partial') metadata = { quality: 'medium', size: '99999x99999', output_format: 'png', model: 'gpt-image-2?token=' + key };
    if (body.prompt === 'wrong-types') metadata = { quality: ['high'], size: { width: 1254, height: 1254 }, output_format: ['png'], model: { id: 'gpt-image-2' } };
    response.writeHead(body.prompt === 'http-error' ? 400 : 200, { 'Content-Type': 'application/json', 'X-Do-Not-Store': key });
    response.end(JSON.stringify({ ...metadata, data: [{ b64_json: body.prompt === 'bad-pixels' ? Buffer.from('not actual pixels').toString('base64') : encoded,
      quality: 'high', size: '1536x1024', output_format: 'webp', model: 'gpt-image-2.5' }] }));
  });
  peer.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise(resolve => peer.listen(0, '127.0.0.1', resolve)); baseUrl = 'http://127.0.0.1:' + peer.address().port; reopen();
  await service.dispatch('generator/saveProvider', { provider: { id: 'owned-cpa', name: 'Owned CPA report', kinds: ['image'], baseUrl, model: 'gpt-image-2', authMode: 'bearer', apiKey: key,
    adapter: { responseMode: 'outputs', create: { method: 'POST', path: '/images/generations', bodyTemplate: { model: '{{model}}', prompt: '{{prompt}}' } }, cancel: null,
      selectors: { outputs: 'data' }, outputSelectors: { url: '', base64: 'b64_json', mime: '', filename: '' } } } });
});
test.after(async () => { await service?.close(); for (const socket of sockets) socket.destroy(); await new Promise(resolve => peer?.close(resolve)); });

test('CPA stores gateway medium/png/1254 claims separately from high/webp/landscape request and actual pixels', async () => {
  const { task: queued } = service.createCpaImageTask(input('reported')); completed = await done(queued.id);
  assert.equal(completed.status, 'completed', completed.error);
  assert.deepEqual(requests.at(-1), { route: '/images/generations', body: { model: 'gpt-image-2.5', prompt: 'reported', n: 1, size: '1536x1024', quality: 'high', output_format: 'webp' } });
  assert.deepEqual(completed.providerReportedImage, { quality: 'medium', size: '1254x1254', outputFormat: 'png', model: 'gpt-image-2' });
  assert.equal(completed.model, 'gpt-image-2.5'); assert.equal(completed.parameters.quality, 'high'); assert.equal(completed.parameters.outputFormat, 'webp'); assert.equal(completed.parameters.size, '1536x1024');
  assert.equal(completed.artifacts[0].width, 1254); assert.equal(completed.artifacts[0].height, 1254); assert.equal(completed.artifacts[0].mime, 'image/png');
  const saved = fs.readFileSync(path.join(root, 'tasks.json'), 'utf8');
  for (const value of [key, 'DO_NOT_STORE_REPLY_PROMPT', 'X-Do-Not-Store', 'Authorization', 'b64_json']) assert.equal(saved.includes(value), false, value);
});

test('Missing gateway fields and nested-only claims never inherit requested values', async () => {
  const { task: queued } = service.createCpaImageTask(input('absent')); const task = await done(queued.id);
  assert.equal(task.status, 'completed'); assert.equal(Object.hasOwn(task, 'providerReportedImage'), false);
  assert.equal(task.parameters.quality, 'high'); assert.equal(task.artifacts[0].mime, 'image/png');
});

test('Unsafe strings, signed URLs, oversized sizes and wrong types are omitted independently', async () => {
  for (const prompt of ['unsafe', 'wrong-types', 'partial']) {
    const { task: queued } = service.createCpaImageTask(input(prompt)); const task = await done(queued.id);
    assert.equal(task.status, 'completed', task.error);
    if (prompt === 'partial') assert.deepEqual(task.providerReportedImage, { quality: 'medium', outputFormat: 'png' });
    else assert.equal(Object.hasOwn(task, 'providerReportedImage'), false);
    assert.equal(JSON.stringify(task).includes(key), false);
  }
});

test('Malformed output bytes and failed HTTP replies cannot publish a verified CPA report', async () => {
  for (const prompt of ['bad-pixels', 'http-error']) {
    const { task: queued } = service.createCpaImageTask(input(prompt)); const task = await done(queued.id);
    assert.equal(task.status, 'failed'); assert.equal(Object.hasOwn(task, 'providerReportedImage'), false); assert.equal(task.artifacts.length, 0);
  }
});

test('A generic Provider task remains unchanged even if its reply contains the same claims', async () => {
  const { task: queued } = await service.dispatch('generator/createTask', input('generic')); const task = await done(queued.id);
  assert.equal(task.status, 'completed'); assert.equal(Object.hasOwn(task, 'providerReportedImage'), false);
});

test('An official task does not acquire CPA gateway-report metadata', async () => {
  const binding = 'a'.repeat(64);
  service.attachOfficialExecutor({ isAvailable: () => true, assertOwner(task) { assert.equal(task._officialOwner, binding); },
    async request() { return { ...reported, id: 'owned-official-report', status: 'completed', outputs: [{ base64: encoded, mime: 'image/png' }] }; },
    downloadProvider() { return { baseUrl, authMode: 'none' }; } });
  const parameters = minimalPayload('frontier_flare');
  const { task: queued } = service.createOfficialTask({ kind: 'image', model: 'frontier_flare', prompt: parameters.prompt, parameters, inputIds: [], workspaceKey: 'workspace-a', ownerBinding: binding });
  const task = await done(queued.id);
  assert.equal(task.status, 'completed', task.error); assert.equal(Object.hasOwn(task, 'providerReportedImage'), false);
});

test('Safe gateway-report metadata persists across restart without another generation', async () => {
  const count = requests.length;
  await service.close(); reopen();
  const task = (await service.dispatch('generator/getTask', { taskId: completed.id })).task;
  assert.deepEqual(task.providerReportedImage, completed.providerReportedImage); assert.equal(task.parameters.size, '1536x1024');
  assert.equal(task.artifacts[0].width, 1254); assert.equal(task.artifacts[0].mime, 'image/png');
  await new Promise(resolve => setTimeout(resolve, 40)); assert.equal(requests.length, count);
});
