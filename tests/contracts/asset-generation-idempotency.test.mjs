// Actual HTTP requests, owned media, and persisted task identities; no Provider quota.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/asset-idempotency-' + randomUUID()), store = path.join(root, 'runtime');
const media = createOwnedGenerationMedia(root), requests = [], remote = new Map(), sockets = new Set();
let baseUrl, service, server, sequence = 0;
const start = () => createAssetService({ root: store, pollIntervalMs: 20, requestTimeoutMs: 1000 });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(predicate, label) { const deadline = Date.now() + 3000; while (!await predicate()) { if (Date.now() > deadline) throw Error('Owned HTTP deadline: ' + label); await delay(5); } }
const dispatch = (kind, data) => service.dispatch('generator/' + kind, data);
const input = (prompt, key, overrides = {}) => ({ providerId: 'owned-a', workspaceKey: 'workspace-a', kind: 'image', prompt, ...(key === undefined ? {} : { idempotencyKey: key }), ...overrides });
async function done(taskId) { let task; await until(async () => { task = (await dispatch('getTask', { taskId })).task; return ['completed','failed','interrupted'].includes(task.status); }, 'task terminal'); return task; }
const creates = prompt => requests.filter(row => row.method === 'POST' && row.body.prompt === prompt).length;
function output(task) {
  if (task.prompt.startsWith('mime:')) {
    const name = task.prompt.slice(5), row = { url: baseUrl + '/media/' + name };
    if (name === 'generic-row') row.mime = 'application/octet-stream';
    if (name === 'wrong-row') row.mime = 'image/jpeg';
    if (name === 'wrong-http') row.mime = 'image/png';
    return row;
  }
  return { base64: media.png.bytes.toString('base64'), mime: 'image/png' };
}
test.before(async () => {
  server = http.createServer(async (request, response) => {
    try {
      const chunks = []; for await (const bytes of request) chunks.push(bytes);
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks)) : {}, route = request.url;
      requests.push({ method: request.method, route, body });
      if (route.startsWith('/media/')) {
        const name = route.slice('/media/'.length), bytes = Buffer.from(media.png.bytes);
        if (name === 'corrupt') bytes[41] ^= 1;
        response.writeHead(200, { 'Content-Type': name === 'wrong-http' ? 'image/jpeg' : 'application/octet-stream', 'Content-Length': bytes.length }); response.end(bytes); return;
      }
      let task;
      if (request.method === 'POST') { task = { id: 'owned-' + (++sequence), prompt: body.prompt, status: body.prompt.startsWith('hold:') ? 'running' : 'completed' }; remote.set(task.id, task); }
      else task = remote.get(route.slice('/tasks/'.length));
      if (request.method === 'POST' && body.prompt.startsWith('hold-response:')) return;
      response.writeHead(task ? 200 : 404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(task ? { id: task.id, status: task.status, progress: task.status === 'completed' ? 100 : 20, ...(task.status === 'completed' ? { outputs: [output(task)] } : {}) } : { error: 'Owned task missing' }));
    } catch (error) { if (!response.headersSent) response.writeHead(500, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: error.message })); }
  });
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); baseUrl = 'http://127.0.0.1:' + server.address().port; service = start();
  for (const id of ['owned-a', 'owned-b']) await dispatch('saveProvider', { provider: { id, name: id, kinds: ['image'], baseUrl, model: 'owned-model', authMode: 'none' } });
});
test.after(async () => { await service?.close(); for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); });

test('Generic binary MIME is accepted only after actual PNG validation; explicit false types still fail', async () => {
  for (const name of ['generic', 'generic-row', 'wrong-row', 'wrong-http', 'corrupt']) {
    const { task: initial } = await dispatch('createTask', input('mime:' + name)); const task = await done(initial.id);
    if (name.startsWith('generic')) {
      assert.equal(task.status, 'completed'); assert.equal(task.artifacts[0].mime, 'image/png');
      const resource = await dispatch('getResource', { taskId: task.id, artifactId: task.artifacts[0].id });
      assert.deepEqual(Buffer.from(resource.base64, 'base64'), media.png.bytes);
    } else { assert.equal(task.status, 'failed'); assert.equal(task.artifacts.length, 0); assert.match(task.error, name === 'corrupt' ? /PNG checksum/ : /MIME does not match/); }
  }
});

test('Concurrent identical scoped keys create exactly one remote task and survive restart', async () => {
  const original = input('idempotent original', 'owned-key-1', { parameters: { width: 48, options: { alpha: true, seed: 9 } } });
  const [first, second] = await Promise.all([dispatch('createTask', original), dispatch('createTask', original)]);
  assert.equal(first.task.id, second.task.id); const task = await done(first.task.id); assert.equal(task.status, 'completed'); assert.equal(creates(original.prompt), 1);
  assert.equal(JSON.stringify(task).includes('owned-key-1'), false, 'Internal idempotency metadata is not a task DTO field');
  await service.close(); service = start();
  const replay = await dispatch('createTask', { ...original, parameters: { options: { seed: 9, alpha: true }, width: 48 } });
  assert.equal(replay.task.id, first.task.id); assert.equal(replay.task.status, 'completed'); assert.equal(creates(original.prompt), 1);
  assert.equal(JSON.parse(fs.readFileSync(path.join(store, 'tasks.json')))[task.id]._idempotency.key, 'owned-key-1');
});

test('A persisted in-progress key resumes only its original remote task after restart', async () => {
  const original = input('hold:restart', 'held-key'), first = await dispatch('createTask', original);
  await until(() => requests.some(row => row.method === 'GET' && remote.get(row.route.slice('/tasks/'.length))?.prompt === original.prompt), 'actual initial poll');
  const peerTask = [...remote.values()].find(task => task.prompt === original.prompt), pollsBefore = requests.filter(row => row.method === 'GET' && row.route === '/tasks/' + peerTask.id).length;
  await service.close(); service = start();
  const replay = await dispatch('createTask', original); assert.equal(replay.task.id, first.task.id);
  await until(() => requests.filter(row => row.method === 'GET' && row.route === '/tasks/' + peerTask.id).length > pollsBefore, 'same remote task resumed');
  peerTask.status = 'completed'; assert.equal((await done(first.task.id)).status, 'completed'); assert.equal(creates(original.prompt), 1);
});

test('Changed payload under an existing scoped key is rejected before any second remote create', async () => {
  const original = input('conflict original', 'conflict-key', { parameters: { seed: 1 } }), first = await dispatch('createTask', original); await done(first.task.id);
  const count = requests.length;
  for (const change of [{ prompt: 'changed prompt' }, { parameters: { seed: 2 } }, { model: 'another-model' }, { kind: 'video' }]) await assert.rejects(() => dispatch('createTask', { ...original, ...change }), /Idempotency key conflicts/);
  assert.equal(requests.length, count); assert.equal(creates(original.prompt), 1);
});

test('An unknown create outcome remains the same interrupted task on replay and restart', async () => {
  const original = input('hold-response:unknown outcome', 'unknown-key'), { task: initial } = await dispatch('createTask', original);
  const task = await done(initial.id); assert.equal(task.status, 'interrupted'); assert.equal(task.mayContinue, true);
  assert.equal((await dispatch('createTask', original)).task.id, task.id);
  await service.close(); service = start();
  const replay = await dispatch('createTask', original); assert.equal(replay.task.id, task.id); assert.equal(replay.task.status, 'interrupted'); assert.equal(replay.task.mayContinue, true);
  assert.equal(creates(original.prompt), 1, 'No second create is sent when the first request outcome is unknown');
});

test('Identical text keys in another Provider or workspace never return another scope task', async () => {
  const original = input('scope isolation', 'shared-scoped-key'), tasks = [];
  for (const change of [{}, { providerId: 'owned-b' }, { workspaceKey: 'workspace-b' }]) {
    const request = { ...original, ...change }, { task } = await dispatch('createTask', request); tasks.push(task); await done(task.id);
    assert.equal((await dispatch('createTask', request)).task.id, task.id);
  }
  assert.equal(new Set(tasks.map(task => task.id)).size, 3); assert.equal(creates(original.prompt), 3);
});

test('Legacy requests without keys remain independent and invalid keys never reach transport', async () => {
  const original = input('legacy independent'), [first, second] = await Promise.all([dispatch('createTask', original), dispatch('createTask', original)]);
  assert.notEqual(first.task.id, second.task.id); await done(first.task.id); await done(second.task.id); assert.equal(creates(original.prompt), 2);
  const count = requests.length;
  for (const idempotencyKey of ['', null, 123, 'x'.repeat(129), 'unsafe\nkey', '../path', 'key with spaces']) await assert.rejects(() => dispatch('createTask', { ...original, idempotencyKey }));
  assert.equal(requests.length, count);
});

test('Failed persistence does not reserve an idempotency key or submit remote work', async () => {
  const original = input('persist retry', 'persist-retry-key'), file = path.join(store, 'tasks.json'), alias = path.join(root, 'owned-task-hardlink.json'); fs.linkSync(file, alias);
  try { await assert.rejects(() => dispatch('createTask', original), /Linked/); assert.equal(creates(original.prompt), 0); }
  finally { fs.unlinkSync(alias); }
  const { task } = await dispatch('createTask', original); assert.equal((await done(task.id)).status, 'completed'); assert.equal(creates(original.prompt), 1);
  assert.equal((await dispatch('createTask', original)).task.id, task.id);
});
