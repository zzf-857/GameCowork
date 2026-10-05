// Real owned task persistence plus injected failures and loopback-only sockets.
// These tests never contact a configured user Provider or consume generation.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/asset-transport-' + randomUUID());
const terminal = new Set(['completed', 'failed', 'interrupted', 'cancelled']);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(read, label) {
  const deadline = Date.now() + 4000;
  for (;;) { const value = await read(); if (value) return value; assert.ok(Date.now() < deadline, label); await delay(5); }
}
async function fixture(name, { fetch, baseUrl = 'http://127.0.0.1:48321', timeoutMs = 1000, providerTimeoutMs, outputs = true, onUpdate } = {}) {
  const store = path.join(root, name);
  let service;
  const open = () => service = createAssetService({ root: store, fetch, requestTimeoutMs: timeoutMs, pollIntervalMs: 100, onUpdate });
  open();
  const provider = { id: 'owned', name: 'Owned transport', baseUrl, kinds: ['image'], model: 'owned-model', authMode: 'none',
    ...(providerTimeoutMs === undefined ? {} : { requestTimeoutMs: providerTimeoutMs }),
    adapter: { responseMode: outputs ? 'outputs' : 'task', create: { method: 'POST', path: '/images/generations', bodyTemplate: { prompt: '{{prompt}}' } },
      poll: { method: 'GET', path: '/tasks/{{taskId}}' }, cancel: null, selectors: { outputs: 'outputs' } } };
  await service.dispatch('generator/saveProvider', { provider });
  const query = (kind, data) => service.dispatch('generator/' + kind, data);
  return {
    store, query,
    create: async prompt => (await query('createTask', { providerId: 'owned', kind: 'image', prompt, workspaceKey: 'owned-workspace' })).task,
    task: async id => (await query('getTask', { taskId: id })).task,
    done: id => until(async () => { const task = (await query('getTask', { taskId: id })).task; return terminal.has(task.status) && task; }, 'Owned transport task must settle'),
    reopen: async () => { await service.close(); open(); },
    close: () => service.close(),
  };
}
function diagnostic(task, expected) {
  const value = task.transportDiagnostic;
  assert.ok(value);
  assert.deepEqual(Object.keys(value).sort(), ['code', 'elapsedMs', 'operation', 'stage', 'timeoutMs', ...(expected.httpStatus === undefined ? [] : ['httpStatus'])].sort());
  for (const [key, entry] of Object.entries(expected)) assert.equal(value[key], entry, key);
  assert.ok(Number.isSafeInteger(value.elapsedMs) && value.elapsedMs >= 0 && value.elapsedMs <= 2147483647);
  return value;
}
async function peer(handler) {
  const calls = [], sockets = new Set();
  const server = http.createServer(async (request, response) => {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString('utf8');
    calls.push({ method: request.method, route: request.url });
    handler(request, response, body);
  });
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { calls, baseUrl: 'http://127.0.0.1:' + server.address().port, close: async () => { for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); } };
}

test('Cause codes are bounded metadata, never raw errors; unknown creation persists without a second POST', async () => {
  const secret = 'cause-secret-' + randomUUID(), endpoint = 'https://cause.invalid/private?token=' + secret;
  const codes = ['UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_CONNECT_TIMEOUT', 'ECONNRESET', 'CERT_HAS_EXPIRED'];
  let calls = 0; const updates = [];
  const own = await fixture('causes', { providerTimeoutMs: 180000, onUpdate: task => updates.push(task), fetch: async (_url, init) => {
    calls++; const code = JSON.parse(init.body).prompt;
    const cause = Object.assign(Error(endpoint), { code, headers: { Authorization: secret } });
    throw Object.assign(new TypeError('fetch failed ' + endpoint, { cause }), { transportDiagnostic: { code: secret, url: endpoint } });
  } });
  try {
    const tasks = [];
    for (const code of codes) {
      const task = await own.done((await own.create(code)).id); tasks.push(task);
      assert.equal(task.status, 'interrupted'); assert.equal(task.mayContinue, true); assert.equal(task.submissionUnknown, true);
      diagnostic(task, { code, operation: 'create', stage: 'awaiting-response', timeoutMs: 180000 });
      assert.match(task.error, /create outcome is unknown and will not be resubmitted/);
    }
    const file = path.join(own.store, 'tasks.json'), before = fs.readFileSync(file);
    assert.equal(before.includes(Buffer.from(secret)), false); assert.equal(before.includes(Buffer.from('cause.invalid')), false);
    assert.equal(JSON.stringify(updates).includes(secret), false);
    for (const task of Object.values(JSON.parse(before))) assert.equal(Object.hasOwn(task, 'submissionUnknown'), false, 'submissionUnknown is DTO-only');
    await own.reopen(); await delay(140);
    for (const task of tasks) assert.deepEqual(await own.task(task.id), task);
    assert.deepEqual(fs.readFileSync(file), before, 'Reading/reopening terminal tasks must not migrate their bytes');
    assert.equal(calls, codes.length);
  } finally { await own.close(); }
});

test('Unknown, cyclic and over-depth causes cannot inject codes, messages or fabricated diagnostics', async () => {
  const secret = 'unknown-cause-secret-' + randomUUID(); let call = 0;
  const own = await fixture('unknown-causes', { fetch: async () => {
    const rootError = Error(secret); rootError.code = secret; rootError.assetTransportDiagnostic = { code: 'ECONNRESET', message: secret };
    if (call++ === 0) rootError.cause = rootError;
    else { let leaf = rootError; for (let index = 0; index < 4; index++) leaf = leaf.cause = Error(secret); leaf.code = 'UND_ERR_HEADERS_TIMEOUT'; }
    throw rootError;
  } });
  try {
    for (let index = 0; index < 2; index++) {
      const task = await own.done((await own.create('OWNED_UNKNOWN_' + index)).id);
      diagnostic(task, { code: 'TRANSPORT_ERROR', operation: 'create', stage: 'awaiting-response', timeoutMs: 1000 });
      assert.equal(task.submissionUnknown, true);
    }
    assert.equal(fs.readFileSync(path.join(own.store, 'tasks.json'), 'utf8').includes(secret), false);
  } finally { await own.close(); }
});

test('An actual loopback POST socket loss records native cause and preserves unknown submission on cold reopen', async () => {
  const server = await peer(request => request.socket.destroy());
  const own = await fixture('actual-socket', { baseUrl: server.baseUrl, providerTimeoutMs: 180000 });
  try {
    const task = await own.done((await own.create('OWNED_SOCKET_LOSS')).id);
    assert.equal(task.status, 'interrupted'); assert.equal(task.submissionUnknown, true);
    assert.ok(['UND_ERR_SOCKET', 'ECONNRESET'].includes(task.transportDiagnostic.code));
    diagnostic(task, { operation: 'create', stage: 'awaiting-response', timeoutMs: 180000 });
    await own.reopen(); await delay(140); assert.equal((await own.task(task.id)).submissionUnknown, true);
    assert.equal(server.calls.length, 1); assert.equal(server.calls[0].method, 'POST');
  } finally { await own.close(); await server.close(); }
});

test('The configured request deadline has its own classification and does not masquerade as socket/header timeout', async () => {
  const server = await peer(() => {}), own = await fixture('actual-deadline', { baseUrl: server.baseUrl, timeoutMs: 60 });
  try {
    const task = await own.done((await own.create('OWNED_DELAYED_HEADERS')).id);
    diagnostic(task, { code: 'PROVIDER_REQUEST_DEADLINE', operation: 'create', stage: 'awaiting-response', timeoutMs: 60 });
    assert.ok(task.transportDiagnostic.elapsedMs >= 40); assert.equal(task.submissionUnknown, true);
    assert.match(task.error, /^Provider request deadline exceeded/); assert.equal(server.calls.length, 1);
  } finally { await own.close(); await server.close(); }
});

test('Real HTTP rejection and an undecodable successful response retain distinct status and stage', async () => {
  const marker = 'raw-response-never-persist-' + randomUUID();
  const server = await peer((_request, response, body) => {
    if (JSON.parse(body).prompt === 'OWNED_HTTP_502') { response.writeHead(502, { 'Content-Type': 'application/json' }); response.end('{"error":"owned fixture rejected"}'); }
    else { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(marker); }
  }), own = await fixture('actual-http', { baseUrl: server.baseUrl });
  try {
    const rejected = await own.done((await own.create('OWNED_HTTP_502')).id);
    assert.equal(rejected.status, 'failed'); assert.equal(rejected.submissionUnknown, false);
    diagnostic(rejected, { code: 'HTTP_ERROR', operation: 'create', stage: 'http-response', timeoutMs: 1000, httpStatus: 502 });
    const invalid = await own.done((await own.create('OWNED_NOT_JSON')).id);
    assert.equal(invalid.status, 'interrupted'); assert.equal(invalid.submissionUnknown, true);
    diagnostic(invalid, { code: 'INVALID_JSON', operation: 'create', stage: 'decoding-response', timeoutMs: 1000, httpStatus: 200 });
    assert.equal(fs.readFileSync(path.join(own.store, 'tasks.json'), 'utf8').includes(marker), false);
    assert.equal(server.calls.length, 2);
  } finally { await own.close(); await server.close(); }
});

test('Failure while reading a response or downloading an output preserves operation and known HTTP status', async () => {
  const marker = 'body-never-persist-' + randomUUID(); let baseUrl;
  const server = await peer((request, response, body) => {
    if (request.method === 'POST' && JSON.parse(body).prompt === 'OWNED_DOWNLOAD_LOSS') { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ outputs: [{ url: baseUrl + '/output.png' }] })); return; }
    response.writeHead(200, { 'Content-Type': request.method === 'GET' ? 'image/png' : 'application/json' }); response.write(marker);
    setTimeout(() => response.destroy(), 25);
  }); baseUrl = server.baseUrl;
  const own = await fixture('actual-body', { baseUrl });
  try {
    for (const [prompt, operation, status, unknown] of [['OWNED_RESPONSE_LOSS', 'create', 'interrupted', true], ['OWNED_DOWNLOAD_LOSS', 'download', 'failed', false]]) {
      const task = await own.done((await own.create(prompt)).id);
      assert.equal(task.status, status); assert.equal(task.submissionUnknown, unknown);
      diagnostic(task, { operation, stage: 'reading-response', timeoutMs: 1000, httpStatus: 200 });
      assert.ok(['UND_ERR_SOCKET', 'ECONNRESET'].includes(task.transportDiagnostic.code));
    }
    assert.equal(fs.readFileSync(path.join(own.store, 'tasks.json'), 'utf8').includes(marker), false);
    assert.equal(server.calls.filter(row => row.method === 'POST').length, 2);
  } finally { await own.close(); await server.close(); }
});

test('A later successful poll clears old transport diagnostics, and known remote IDs never become unknown creates', async () => {
  let posts = 0, polls = 0;
  const own = await fixture('poll-recovery', { outputs: false, fetch: async (_url, init) => {
    if (init.method === 'POST') { posts++; return new Response('{"id":"owned-remote","status":"running"}'); }
    if (++polls === 1) throw new TypeError('fetch failed', { cause: Object.assign(Error('not recorded'), { code: 'UND_ERR_SOCKET' }) });
    return new Response('{"id":"owned-remote","status":"cancelled"}');
  } });
  try {
    const created = await own.create('OWNED_POLL_RECOVERY');
    const pending = await until(async () => { const task = await own.task(created.id); return task.transportDiagnostic && task; }, 'First poll must record its failure');
    diagnostic(pending, { code: 'UND_ERR_SOCKET', operation: 'poll', stage: 'awaiting-response', timeoutMs: 1000 });
    assert.equal(pending.submissionUnknown, false);
    const finished = await own.done(created.id); assert.equal(finished.status, 'cancelled'); assert.equal(finished.transportDiagnostic, undefined);
    await own.close();
    const file = path.join(own.store, 'tasks.json'), stored = JSON.parse(fs.readFileSync(file));
    stored[created.id].status = 'interrupted'; stored[created.id].mayContinue = true; stored[created.id].error = 'Legacy unknown-looking text does not determine submission state';
    fs.writeFileSync(file, JSON.stringify(stored)); const before = fs.readFileSync(file);
    await own.reopen(); const restored = await own.task(created.id); assert.equal(restored.submissionUnknown, false);
    assert.deepEqual(fs.readFileSync(file), before); assert.equal(posts, 1);
  } finally { await own.close(); }
});

test('Provider reconfiguration replaces stale poll diagnostics without inventing an unknown creation', async () => {
  let posts = 0;
  const own = await fixture('reconfigured', { outputs: false, fetch: async (_url, init) => {
    if (init.method === 'POST') { posts++; return new Response('{"id":"owned-remote","status":"running"}'); }
    throw new TypeError('fetch failed', { cause: Object.assign(Error('not recorded'), { code: 'UND_ERR_SOCKET' }) });
  } });
  try {
    const created = await own.create('OWNED_CONFIG_CHANGE');
    await until(async () => (await own.task(created.id)).transportDiagnostic, 'Poll diagnostic must be recorded');
    const provider = (await own.query('listProviders')).providers[0];
    await own.query('saveProvider', { provider: { ...provider, enabled: false } });
    const task = await own.task(created.id);
    assert.equal(task.status, 'interrupted'); assert.equal(task.submissionUnknown, false);
    assert.equal(task.transportDiagnostic, undefined); assert.match(task.error, /Provider configuration changed/);
    assert.equal(posts, 1);
  } finally { await own.close(); }
});
