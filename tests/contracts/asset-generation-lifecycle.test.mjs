// Real asset service, its durable store, and an owned loopback remote with barriers.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/asset-lifecycle-' + randomUUID());
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(predicate, label) { const deadline = Date.now() + 3000; while (!predicate()) { if (Date.now() > deadline) throw Error('Owned lifecycle deadline: ' + label); await delay(5); } }
async function fixture(name) {
  const calls = [], cancellations = [], sockets = new Set(); let state = 'running';
  const server = http.createServer(async (request, response) => {
    for await (const bytes of request) {}
    calls.push({ method: request.method, path: request.url });
    const send = value => { if (!response.destroyed && !response.writableEnded) { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(value)); } };
    if (request.method === 'DELETE') { const cancel = { closed: false, finish() { state = 'cancelled'; send({ id: 'owned-remote', status: state }); } }; cancellations.push(cancel); response.on('close', () => { cancel.closed = true; }); return; }
    send({ id: 'owned-remote', status: state, progress: 25 });
  });
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const store = path.join(root, name), service = createAssetService({ root: store, pollIntervalMs: 25, requestTimeoutMs: 30000 });
  const config = { id: 'owned', name: 'Owned original name', kinds: ['image'], baseUrl: 'http://127.0.0.1:' + server.address().port, model: 'owned-model', authMode: 'none' };
  await service.dispatch('generator/saveProvider', { provider: config });
  const { task } = await service.dispatch('generator/createTask', { providerId: config.id, kind: 'image', prompt: 'Owned lifecycle work' });
  await until(() => calls.some(row => row.method === 'GET'), 'actual original poll');
  return { service, config, store, task, calls, cancellations,
    async read() { return (await service.dispatch('generator/getTask', { taskId: task.id })).task; },
    async close() { for (const cancel of cancellations) cancel.finish(); await service.close(); for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); },
  };
}

test('Editing only the Provider display name preserves its running remote task', async () => {
  const f = await fixture('rename');
  try {
    const before = f.calls.filter(row => row.method === 'GET').length;
    await f.service.dispatch('generator/saveProvider', { provider: { ...f.config, name: 'New user-facing name' } });
    assert.equal((await f.read()).status, 'running');
    await until(() => f.calls.filter(row => row.method === 'GET').length > before, 'poll after renaming');
    assert.equal(f.calls.filter(row => row.method === 'POST').length, 1);
  } finally { await f.close(); }
});

test('An existing JSON Provider without the new bodyType fields keeps running after a name edit', async () => {
  const f = await fixture('legacy-body-type'); let reopened;
  try {
    await f.service.close(); const file = path.join(f.store, 'providers.json'), providers = JSON.parse(fs.readFileSync(file));
    for (const route of ['create','poll','cancel']) if (providers.owned.adapter[route]) delete providers.owned.adapter[route].bodyType;
    fs.writeFileSync(file, JSON.stringify(providers)); reopened = createAssetService({ root: f.store, pollIntervalMs: 25, requestTimeoutMs: 30000 });
    await reopened.dispatch('generator/saveProvider', { provider: { ...f.config, name: 'Renamed legacy JSON Provider' } });
    assert.equal((await reopened.dispatch('generator/getTask', { taskId: f.task.id })).task.status, 'running');
    assert.equal(f.calls.filter(row => row.method === 'POST').length, 1);
  } finally { await reopened?.close(); await f.close(); }
});

test('Repeated cancellation shares one in-flight remote request and returns one actual outcome', async () => {
  const f = await fixture('duplicate-cancel');
  try {
    const first = f.service.dispatch('generator/cancelTask', { taskId: f.task.id });
    await until(() => f.cancellations.length === 1, 'first cancel barrier');
    const second = f.service.dispatch('generator/cancelTask', { taskId: f.task.id });
    // Release all actual requests so both pre-fix calls settle; count is the contract.
    await delay(30); for (const cancel of f.cancellations) cancel.finish();
    const results = await Promise.all([first, second]);
    assert.equal(f.calls.filter(row => row.method === 'DELETE').length, 1);
    assert.ok(results.every(result => result.task.status === 'cancelled' && result.remoteCancellationConfirmed === true));
  } finally { await f.close(); }
});

test('Old cancellation cannot overwrite an interruption caused by changed Provider routing', async () => {
  const f = await fixture('changed-provider');
  try {
    const cancellation = f.service.dispatch('generator/cancelTask', { taskId: f.task.id }).then(value => ({ value }), error => ({ error }));
    await until(() => f.cancellations.length === 1, 'cancel before routing change');
    await f.service.dispatch('generator/saveProvider', { provider: { ...f.config, model: 'new-model' } });
    f.cancellations[0].finish();
    const result = await cancellation, task = await f.read();
    assert.ok(result.error, 'Caller is told its cancellation owner was interrupted');
    assert.equal(task.status, 'interrupted'); assert.equal(task.mayContinue, true); assert.equal(task.remoteCancellationConfirmed, false);
    assert.match(task.error, /configuration changed/);
    assert.equal((await f.service.dispatch('generator/cancelTask', { taskId: f.task.id })).mayContinue, true, 'A repeated local cancellation never claims the unknown remote work stopped');
    assert.equal(f.calls.filter(row => row.method === 'POST').length, 1, 'Changed routing never submits the old task again');
  } finally { await f.close(); }
});

test('A failed discard write preserves the task metadata before a successful retry', async () => {
  const f = await fixture('discard-rollback');
  try {
    await f.service.dispatch('generator/saveProvider', { provider: { ...f.config, enabled: false } });
    const before = await f.read(), taskPath = path.join(f.store, 'tasks.json'), alias = path.join(root, 'owned-discard-hardlink.json');
    const bytes = fs.readFileSync(taskPath); fs.linkSync(taskPath, alias);
    try {
      await assert.rejects(() => f.service.dispatch('generator/updateTasksDiscarded', { taskIds: [f.task.id], discarded: true }), /Linked/);
      const after = await f.read(); assert.equal(after.discarded, false); assert.equal(after.updatedTime, before.updatedTime);
      assert.deepEqual(fs.readFileSync(taskPath), bytes);
    } finally { fs.unlinkSync(alias); }
    assert.equal((await f.service.dispatch('generator/updateTasksDiscarded', { taskIds: [f.task.id], discarded: true })).updated, 1);
    assert.equal((await f.read()).discarded, true);
  } finally { await f.close(); }
});

test('Closing the asset service aborts pending cancel I/O and late replies never write history', async () => {
  const f = await fixture('close-cancel');
  try {
    const cancellation = f.service.dispatch('generator/cancelTask', { taskId: f.task.id }).then(value => ({ value }), error => ({ error }));
    await until(() => f.cancellations.length === 1, 'cancel before close');
    await f.service.close(); const persisted = fs.readFileSync(path.join(f.store, 'tasks.json'));
    await until(() => f.cancellations[0].closed, 'cancel HTTP socket is released by service close');
    const result = await cancellation; assert.ok(result.error); assert.match(result.error.message, /interrupted|closed/);
    f.cancellations[0].finish(); assert.deepEqual(fs.readFileSync(path.join(f.store, 'tasks.json')), persisted);
    assert.equal(fs.existsSync(path.join(f.store, 'owner.lock')), false);
  } finally { await f.close(); }
});

test('A failed Provider deletion preserves the in-memory and disk configuration for a safe retry', async () => {
  const f = await fixture('delete-rollback');
  try {
    await f.service.dispatch('generator/saveProvider', { provider: { ...f.config, enabled: false } });
    const configPath = path.join(f.store, 'providers.json'), alias = path.join(root, 'owned-delete-hardlink.json');
    const bytes = fs.readFileSync(configPath); fs.linkSync(configPath, alias);
    try {
      await assert.rejects(() => f.service.dispatch('generator/deleteProvider', { providerId: f.config.id }), /Linked/);
      assert.equal((await f.service.dispatch('generator/listProviders')).providers.length, 1);
      assert.deepEqual(fs.readFileSync(configPath), bytes);
    } finally { fs.unlinkSync(alias); }
    assert.equal((await f.service.dispatch('generator/deleteProvider', { providerId: f.config.id })).deleted, true);
  } finally { await f.close(); }
});
