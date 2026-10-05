// Real durable asset cache with an injected official executor; no real account
// or Provider is contacted and every generated image is verified from bytes.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const { minimalPayload } = require('../../src/core/binary/out/gamecowork-official-model-catalog.js');
const suiteRoot = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/codely-official-assets-' + randomUUID());
const media = createOwnedGenerationMedia(path.join(suiteRoot, 'media')), binding = 'a'.repeat(64), otherBinding = 'b'.repeat(64);
const sha = value => createHash('sha256').update(value).digest('hex'), delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(read, predicate, label = 'official task state') { const deadline = Date.now() + 3000; for (;;) { const value = await read(); if (predicate(value)) return value; if (Date.now() > deadline) throw Error('Fixture deadline: ' + label); await delay(5); } }
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
const inputUrl = inputId => 'http://127.0.0.1/owned-reference/' + inputId;
const withReferences = (data, inputIds) => ({ ...data, inputIds, parameters: { ...data.parameters, imageUrls: inputIds.map(inputUrl) } });
function fixture(name, overrides = {}, options = {}) {
  const store = path.join(suiteRoot, name), calls = []; let account = binding;
  const make = () => createAssetService({ root: store, pollIntervalMs: 20, requestTimeoutMs: 1000, ...options });
  const executor = {
    isAvailable() { return true; },
    assertOwner(task) { if (task._officialOwner !== account) throw Error('Account binding mismatch'); },
    async request(task, creating, signal) { calls.push({ task, creating, signal }); return { id: 'official-' + name, status: 'completed', progress: 100, outputs: [{ base64: media.png.bytes.toString('base64'), mime: media.png.mimeType, filename: '官方图片.png' }] }; },
    downloadProvider() { return { baseUrl: 'https://8.8.8.8', authMode: 'none' }; },
    ...overrides,
  };
  const service = make(); service.attachOfficialExecutor(executor);
  const data = { kind: 'image', model: 'frontier_flare', prompt: '真实官方图片任务 fixture', parameters: { ...minimalPayload('frontier_flare'), prompt: '真实官方图片任务 fixture' }, inputIds: [], workspaceKey: 'workspace-a', ownerBinding: binding };
  return { store, service, calls, executor, data, make, account(value) { account = value; }, read(taskId, target = service) { return target.dispatch('generator/getTask', { taskId }).then(value => value.task); } };
}
function register(service, bytes, workspaceKey = 'workspace-a') {
  const inputId = 'i_' + randomUUID(), incoming = path.join(service.root, 'incoming', inputId + '.bin'); fs.mkdirSync(path.dirname(incoming), { recursive: true }); fs.writeFileSync(incoming, bytes, { flag: 'wx' });
  try { return service.registerInput({ inputId, workspaceKey, filename: '参考.png', byteLength: bytes.length, sha256: sha(bytes) }).input; } finally { fs.unlinkSync(incoming); }
}

test('Official execution is private and cannot be enabled by renderer Provider/task JSON', async () => {
  const f = fixture('private');
  try {
    for (const kind of ['generator/attachOfficialExecutor', 'generator/createOfficialTask', 'generator/importOwnedArtifactInput']) await assert.rejects(() => f.service.dispatch(kind, f.data), /Unknown/);
    await assert.rejects(() => f.service.dispatch('generator/saveProvider', { provider: { id: 'codely-official', kinds: ['image'], baseUrl: 'http://127.0.0.1', authMode: 'none' } }), /not a configurable/);
    for (const change of [{ providerId: 'codely-official' }, { providerId: 'anything', serviceSource: 'codely-official' }, { providerId: 'anything', ownerBinding: binding }]) await assert.rejects(() => f.service.dispatch('generator/createTask', { ...f.data, ...change }), /internal account-bound/);
    assert.equal(f.calls.length, 0); assert.equal(f.service.getOwnedSnapshot().tasks.length, 0);
  } finally { await f.service.close(); }
});

test('Official completion freezes original payload/inputs and stores real verified pixels without private fields', async () => {
  const f = fixture('pixels');
  try {
    const input = register(f.service, media.png.bytes), parameters = { ...f.data.parameters, imageUrls: [inputUrl(input.id)] }, original = structuredClone(parameters);
    const { task: queued } = f.service.createOfficialTask({ ...f.data, inputIds: [input.id], parameters }); parameters.outputFormat = 'jpeg'; parameters.imageUrls.push(inputUrl('forged'));
    const task = await until(() => f.read(queued.id), task => task.status === 'completed');
    assert.equal(task.serviceSource, 'codely-official'); assert.equal(task.officialTaskId, 'official-pixels'); assert.equal(task.providerId, 'codely-official');
    assert.deepEqual(task.parameters, original); assert.deepEqual(f.calls[0].task.parameters, original); assert.equal(task.inputs[0].sha256, media.png.sha256); assert.equal(f.calls[0].task._officialOwner, binding);
    assert.equal(task.artifacts[0].sha256, media.png.sha256); const resource = f.service.getArtifactPath(task.id, task.artifacts[0].id); assert.deepEqual(fs.readFileSync(resource.path), media.png.bytes);
    assert.equal(task.artifacts[0].width, media.png.bytes.readUInt32BE(16)); assert.equal(task.artifacts[0].height, media.png.bytes.readUInt32BE(20));
    const serialized = JSON.stringify(task); for (const privateValue of ['_officialOwner', '_remoteId', '_file', binding, f.store]) assert.equal(serialized.includes(privateValue), false);
    const disk = JSON.parse(fs.readFileSync(path.join(f.store, 'tasks.json')))[task.id]; assert.equal(disk._officialOwner, binding); assert.equal(disk._remoteId, task.officialTaskId); assert.equal(fs.existsSync(path.join(f.store, 'providers.json')), false);
    assert.equal(f.calls.filter(row => row.creating).length, 1);
  } finally { await f.service.close(); }
});

test('Official input scope, kind, checksum and unsupported models fail before a submission', async () => {
  const f = fixture('preflight');
  try {
    const reference = register(f.service, media.png.bytes), video = register(f.service, media.webm.bytes);
    for (const change of [{ kind: 'video' }, { model: 'unmapped' }, { ownerBinding: 'account-name' }, { ...withReferences(f.data, [reference.id]), workspaceKey: 'workspace-b' }, withReferences(f.data, [video.id]), { ...withReferences(f.data, [reference.id, reference.id]), parameters: { ...f.data.parameters, imageUrls: [inputUrl(reference.id), inputUrl(reference.id) + '?alias=1'] } }, { inputPaths: ['F:/arbitrary'] }, { parameters: { access_token: 'never-store' } }, { parameters: { ...f.data.parameters, count: 1 } }]) assert.throws(() => f.service.createOfficialTask({ ...f.data, ...change }), undefined, 'Preflight must reject ' + JSON.stringify(change));
    const file = f.service.getInputPath(reference.id, 'workspace-a').path; fs.appendFileSync(file, 'tampered'); assert.throws(() => f.service.createOfficialTask(withReferences(f.data, [reference.id])), /integrity/); fs.writeFileSync(file, media.png.bytes);
    assert.equal(f.calls.length, 0); assert.equal(f.service.getOwnedSnapshot().tasks.length, 0);
  } finally { await f.service.close(); }
});

test('Registered input bytes are rechecked in the scheduled create preflight', async () => {
  const f = fixture('queued-input-change');
  try {
    const input = register(f.service, media.png.bytes), file = f.service.getInputPath(input.id, 'workspace-a').path;
    const { task } = f.service.createOfficialTask(withReferences(f.data, [input.id])); fs.appendFileSync(file, 'change-before-executor');
    const final = await until(() => f.read(task.id), task => task.status === 'failed'); assert.equal(final.mayContinue, false); assert.equal(f.calls.length, 0); fs.writeFileSync(file, media.png.bytes);
  } finally { await f.service.close(); }
});

test('Original Frontier variants freeze sixteen owned references while ordinary Providers retain their eight-input boundary', async () => {
  const f = fixture('sixteen-frontier-references');
  try {
    const references = Array.from({ length: 17 }, () => register(f.service, media.png.bytes));
    const inputIds = references.slice(0, 16).map(reference => reference.id), parameters = { ...f.data.parameters, imageUrls: inputIds.map(inputUrl) };
    const { task } = f.service.createOfficialTask({ ...f.data, inputIds, parameters }); const final = await until(() => f.read(task.id), task => task.status === 'completed');
    assert.equal(final.inputs.length, 16); assert.deepEqual(final.inputs.map(reference => reference.id), inputIds); assert.ok(final.inputs.every(reference => reference.sha256 === media.png.sha256)); assert.equal(f.calls[0].task.inputs.length, 16);
    assert.throws(() => f.service.createOfficialTask(withReferences(f.data, references.map(reference => reference.id))), /sixteen/); assert.equal(f.calls.filter(row => row.creating).length, 1);
    await f.service.dispatch('generator/saveProvider', { provider: { id: 'own-eight-only', kinds: ['image'], baseUrl: 'http://127.0.0.1:49199', authMode: 'none', adapter: { create: { method: 'POST', path: '/images', bodyType: 'multipart', fileFields: [{ name: 'image[]', inputIndex: 'all' }] } } } });
    await assert.rejects(() => f.service.dispatch('generator/createTask', { providerId: 'own-eight-only', kind: 'image', prompt: 'Eight-reference Provider boundary', workspaceKey: 'workspace-a', inputIds: inputIds.slice(0, 9) }), /eight/);
    assert.equal(f.service.getOwnedSnapshot().tasks.length, 1);
    const video = fixture('same-reference-distinct-first-last', { async request(task, creating, signal) { video.calls.push({ task, creating, signal }); return { id: 'same-reference-wan3', status: 'completed', outputs: [{ base64: media.webm.bytes.toString('base64'), mime: media.webm.mimeType, filename: 'first-last.webm' }] }; } });
    try {
      const frame = register(video.service, media.png.bytes), address = inputUrl(frame.id), payload = { ...minimalPayload('wan3'), mode: 'first_last_frame', first_frame: address, last_frame: address };
      const submitted = video.service.createOfficialTask({ ...video.data, kind: 'video', model: 'wan3', parameters: payload, inputIds: [frame.id, frame.id] }).task;
      const completed = await until(() => video.read(submitted.id), task => ['completed', 'failed'].includes(task.status));
      assert.equal(completed.status, 'completed', completed.error); assert.deepEqual(completed.inputs.map(input => input.id), [frame.id, frame.id]);
      assert.deepEqual(video.calls[0].task.parameters, payload); assert.equal(video.calls.filter(row => row.creating).length, 1);
      assert.equal(completed.artifacts[0].sha256, media.webm.sha256);
    } finally { await video.service.close(); }
  } finally { await f.service.close(); }
});

test('A recorded official remote ID resumes query after restart and is never recreated', async () => {
  const gate = deferred(), f = fixture('restart-known', { async request(task, creating, signal) { f.calls.push({ task, creating, signal }); if (creating) return { id: 'known-official-id', status: 'running', progress: 37 }; return gate.promise; } }); let reopened;
  try {
    const { task } = f.service.createOfficialTask(f.data); await until(() => f.calls, calls => calls.some(row => !row.creating)); await f.service.close();
    reopened = f.make(); const before = f.calls.length; await delay(40); assert.equal(f.calls.length, before, 'Restart waits for the internal account executor');
    const second = { ...f.executor, async request(snapshot, creating) { assert.equal(creating, false); f.calls.push({ task: snapshot, creating }); return { id: 'known-official-id', status: 'completed', outputs: [{ base64: media.png.bytes.toString('base64') }] }; } };
    reopened.attachOfficialExecutor(second); const final = await until(() => f.read(task.id, reopened), task => task.status === 'completed');
    assert.equal(final.officialTaskId, 'known-official-id'); assert.equal(f.calls.filter(row => row.creating).length, 1); assert.equal(f.calls.at(-1).task._remoteId, 'known-official-id');
    gate.resolve({ id: 'late-other-id', status: 'failed', error: 'late' }); await delay(20); assert.equal((await f.read(task.id, reopened)).status, 'completed');
  } finally { gate.resolve({}); await reopened?.close(); await f.service.close(); }
});

test('Reattaching a stable executor retries only interrupted known-ID queries after account restoration', async () => {
  let complete = false; const f = fixture('same-executor-resume', { async request(task, creating) { f.calls.push({ task, creating }); return { id: 'stable-executor-id', status: complete ? 'completed' : 'running', outputs: complete ? [{ base64: media.png.bytes.toString('base64') }] : [] }; } });
  try {
    const { task } = f.service.createOfficialTask(f.data); f.service.attachOfficialExecutor(f.executor); await until(() => f.read(task.id), task => task.officialTaskId === 'stable-executor-id');
    f.account(otherBinding); const interrupted = await until(() => f.read(task.id), task => task.status === 'interrupted'); assert.equal(interrupted.mayContinue, true); const count = f.calls.length;
    f.service.attachOfficialExecutor(f.executor); await delay(30); assert.equal(f.calls.length, count, 'Different account cannot resume the task');
    f.account(binding); complete = true; f.service.attachOfficialExecutor(f.executor); const final = await until(() => f.read(task.id), task => task.status === 'completed'); assert.equal(final.officialTaskId, 'stable-executor-id'); assert.equal(f.calls.filter(row => row.creating).length, 1);
  } finally { await f.service.close(); }
});

test('Closing during official creation keeps an unknown outcome and restart never resubmits', async () => {
  const gate = deferred(), f = fixture('restart-unknown', { async request(task, creating, signal) { f.calls.push({ task, creating, signal }); return gate.promise; } }); let reopened;
  try {
    const { task } = f.service.createOfficialTask(f.data); await until(() => f.calls.length, count => count === 1); await f.service.close();
    reopened = f.make(); reopened.attachOfficialExecutor(f.executor); gate.resolve({ id: 'too-late', status: 'completed', outputs: [{ base64: media.png.bytes.toString('base64') }] }); await delay(50);
    const final = await f.read(task.id, reopened); assert.equal(final.status, 'interrupted'); assert.equal(final.mayContinue, true); assert.equal(final.officialTaskId, undefined); assert.equal(final.artifacts.length, 0); assert.equal(f.calls.length, 1);
  } finally { gate.resolve({}); await reopened?.close(); await f.service.close(); }
});

test('Official POST uncertainty stays interrupted even with an HTTP error and does not retry', async () => {
  const f = fixture('unknown-http', { async request(task, creating) { f.calls.push({ task, creating }); const error = Error('Fixture POST timeout'); error.httpStatus = 503; error.submissionUnknown = true; throw error; } }); let reopened;
  try {
    const { task } = f.service.createOfficialTask(f.data); const final = await until(() => f.read(task.id), task => task.status === 'interrupted'); assert.equal(final.mayContinue, true);
    await f.service.close(); reopened = f.make(); reopened.attachOfficialExecutor(f.executor); await delay(50); assert.equal(f.calls.length, 1); assert.equal((await f.read(task.id, reopened)).status, 'interrupted');
  } finally { await reopened?.close(); await f.service.close(); }
});

test('Explicit official request preflight rejection records that no remote submission occurred', async () => {
  const f = fixture('request-preflight', { async request(task, creating) { f.calls.push({ task, creating }); const error = Error('Missing selected account'); error.beforeRequest = true; throw error; } });
  try { const { task } = f.service.createOfficialTask(f.data); const final = await until(() => f.read(task.id), task => task.status === 'failed'); assert.equal(final.mayContinue, false); assert.equal(final.officialTaskId, undefined); assert.equal(f.calls.length, 1); }
  finally { await f.service.close(); }
});

test('Cancelling before create prevents submission and cancelling an in-flight create preserves uncertainty', async () => {
  const gate = deferred(), f = fixture('cancel-create', { async request(task, creating, signal) { f.calls.push({ task, creating, signal }); return gate.promise; } });
  try {
    const first = f.service.createOfficialTask(f.data).task, cancelled = await f.service.dispatch('generator/cancelTask', { taskId: first.id }); assert.equal(cancelled.task.status, 'cancelled'); assert.equal(cancelled.mayContinue, false);
    const second = f.service.createOfficialTask(f.data).task; await until(() => f.calls.length, count => count === 1);
    const unknown = await f.service.dispatch('generator/cancelTask', { taskId: second.id }); assert.equal(unknown.task.status, 'interrupted'); assert.equal(unknown.mayContinue, true); assert.equal(unknown.remoteCancellationConfirmed, false);
    gate.resolve({ id: 'late-cancelled-create', status: 'completed', outputs: [{ base64: media.png.bytes.toString('base64') }] }); await delay(40); assert.equal((await f.read(second.id)).status, 'interrupted'); assert.equal(f.calls.length, 1);
  } finally { gate.resolve({}); await f.service.close(); }
});

test('A known official task cancellation reports remote continuation and queries the real outcome', async () => {
  let complete = false; const f = fixture('cancel-known', { async request(task, creating) { f.calls.push({ task, creating }); return { id: 'cancel-known-id', status: complete ? 'completed' : 'running', outputs: complete ? [{ base64: media.png.bytes.toString('base64') }] : [] }; } });
  try {
    const { task } = f.service.createOfficialTask(f.data); await until(() => f.read(task.id), task => task.officialTaskId === 'cancel-known-id');
    const result = await f.service.dispatch('generator/cancelTask', { taskId: task.id }); assert.equal(result.task.status, 'cancel_requested'); assert.equal(result.mayContinue, true); assert.equal(result.remoteCancellationConfirmed, false);
    complete = true; const final = await until(() => f.read(task.id), task => task.status === 'completed'); assert.equal(final.mayContinue, false); assert.equal(f.calls.filter(row => row.creating).length, 1);
  } finally { await f.service.close(); }
});

test('An account change before scheduled submission cannot send an old-account task', async () => {
  const f = fixture('owner-before-create');
  try { const { task } = f.service.createOfficialTask(f.data); f.account(otherBinding); const final = await until(() => f.read(task.id), task => task.status === 'interrupted'); assert.equal(final.mayContinue, false); assert.equal(f.calls.length, 0); }
  finally { await f.service.close(); }
});

test('An account change during create preserves the ID but blocks collection and cross-account restart queries', async () => {
  const gate = deferred(), f = fixture('owner-in-create', { async request(task, creating) { f.calls.push({ task, creating }); return gate.promise; } }); let reopened;
  try {
    const { task } = f.service.createOfficialTask(f.data); await until(() => f.calls.length, count => count === 1); f.account(otherBinding);
    gate.resolve({ id: 'old-owner-id', status: 'completed', outputs: [{ base64: media.png.bytes.toString('base64') }] }); const paused = await until(() => f.read(task.id), task => task.status === 'interrupted');
    assert.equal(paused.officialTaskId, 'old-owner-id'); assert.equal(paused.mayContinue, true); assert.equal(paused.artifacts.length, 0); await f.service.close();
    reopened = f.make(); reopened.attachOfficialExecutor(f.executor); await delay(40); assert.equal(f.calls.length, 1);
    f.account(binding); reopened.attachOfficialExecutor({ ...f.executor, async request(snapshot, creating) { assert.equal(creating, false); f.calls.push({ task: snapshot, creating }); return { id: 'old-owner-id', status: 'completed', outputs: [{ base64: media.png.bytes.toString('base64') }] }; } });
    const final = await until(() => f.read(task.id, reopened), task => task.status === 'completed'); assert.equal(final.artifacts[0].sha256, media.png.sha256); assert.equal(f.calls.filter(row => row.creating).length, 1);
  } finally { gate.resolve({}); await reopened?.close(); await f.service.close(); }
});

test('Official URL downloads and redirected CDN requests carry no account authentication', async () => {
  const downloads = []; const f = fixture('no-cdn-auth', { async request(task, creating) { f.calls.push({ task, creating }); return { id: 'cdn-task-id', status: 'completed', outputs: [{ url: 'https://8.8.8.8/first.png', mime: media.png.mimeType }] }; } }, { async fetch(url, init) { downloads.push({ url: String(url), init }); return downloads.length === 1 ? new Response(null, { status: 302, headers: { location: 'https://8.8.4.4/final.png' } }) : new Response(media.png.bytes, { headers: { 'Content-Type': 'application/octet-stream' } }); } });
  try {
    const { task } = f.service.createOfficialTask(f.data); const final = await until(() => f.read(task.id), task => ['completed', 'failed'].includes(task.status)); assert.equal(final.status, 'completed', final.error); assert.equal(downloads.length, 2);
    for (const row of downloads) { assert.deepEqual(row.init.headers, {}); assert.equal(row.init.redirect, 'manual'); assert.equal(row.init.method, 'GET'); }
  } finally { await f.service.close(); }
});

test('Account changes during a media download prevent newly received bytes from entering history', async () => {
  const gate = deferred(); let downloading = false;
  const f = fixture('owner-during-download', { async request(task, creating) { f.calls.push({ task, creating }); return { id: 'download-owner-id', status: 'completed', outputs: [{ url: 'https://8.8.8.8/owned.png' }] }; } }, { async fetch() { downloading = true; return gate.promise; } });
  try {
    const { task } = f.service.createOfficialTask(f.data); await until(() => downloading, value => value); f.account(otherBinding); gate.resolve(new Response(media.png.bytes, { headers: { 'Content-Type': media.png.mimeType } }));
    const final = await until(() => f.read(task.id), task => task.status === 'interrupted'); assert.equal(final.mayContinue, true); assert.equal(final.artifacts.length, 0); assert.equal(final.officialTaskId, 'download-owner-id'); assert.equal(f.calls.filter(row => row.creating).length, 1);
  } finally { gate.resolve(new Response()); await f.service.close(); }
});

test('Official same-origin private HTTPS downloads and authentication-bearing download descriptors are rejected', async () => {
  for (const [name, provider, pattern] of [['private-same-origin', { baseUrl: 'https://127.0.0.1', authMode: 'none' }, /private\/local/], ['auth-descriptor', { baseUrl: 'https://8.8.8.8', authMode: 'bearer', _key: 'never-forward' }, /must not contain account authentication/]]) {
    let downloads = 0; const f = fixture(name, { downloadProvider() { return provider; }, async request(task, creating) { f.calls.push({ task, creating }); return { id: name + '-id', status: 'completed', outputs: [{ url: provider.baseUrl + '/owned.png' }] }; } }, { async fetch() { downloads++; return new Response(media.png.bytes); } });
    try { const { task } = f.service.createOfficialTask(f.data); const final = await until(() => f.read(task.id), task => task.status === 'failed'); assert.match(final.error, pattern); assert.equal(downloads, 0); assert.equal(final.artifacts.length, 0); }
    finally { await f.service.close(); }
  }
});

test('Internal loopback media fixtures are accepted while private cross-origin outputs are blocked', async () => {
  let downloads = 0; const f = fixture('loopback-download', { downloadProvider() { return { baseUrl: 'http://127.0.0.1:49199', authMode: 'none' }; }, async request(task, creating) { f.calls.push({ task, creating }); return { id: 'fixture-id-' + f.calls.length, status: 'completed', outputs: [{ url: f.calls.length === 1 ? 'http://127.0.0.1:49199/owned.png' : 'https://127.0.0.1/unsafe.png' }] }; } }, { async fetch() { downloads++; return new Response(media.png.bytes, { headers: { 'Content-Type': media.png.mimeType } }); } });
  try {
    const first = f.service.createOfficialTask(f.data).task; assert.equal((await until(() => f.read(first.id), task => task.status === 'completed')).status, 'completed');
    const second = f.service.createOfficialTask(f.data).task, failed = await until(() => f.read(second.id), task => task.status === 'failed'); assert.match(failed.error, /private\/local/); assert.equal(downloads, 1); assert.equal(failed.artifacts.length, 0);
  } finally { await f.service.close(); }
});

test('Official malformed bytes, MIME mismatch and missing remote ID never produce completed history', async () => {
  for (const [name, output, remote] of [['bad-bytes', { base64: Buffer.from('not-image-data-at-all').toString('base64') }, 'bad-bytes-id'], ['bad-mime', { base64: media.png.bytes.toString('base64'), mime: 'image/jpeg' }, 'bad-mime-id'], ['missing-id', { base64: media.png.bytes.toString('base64') }, undefined]]) {
    const f = fixture(name, { async request(task, creating) { f.calls.push({ task, creating }); return { id: remote, status: 'completed', outputs: [output] }; } });
    try { const { task } = f.service.createOfficialTask(f.data); const final = await until(() => f.read(task.id), task => ['failed', 'interrupted'].includes(task.status)); assert.equal(final.artifacts.length, 0); assert.equal(final.status, remote ? 'failed' : 'interrupted'); if (!remote) assert.equal(final.mayContinue, true); }
    finally { await f.service.close(); }
  }
});

test('History artifact import copies only verified same-scope bytes and cleans its staging file', async () => {
  const f = fixture('history-input');
  try {
    const { task } = f.service.createOfficialTask(f.data); const final = await until(() => f.read(task.id), task => task.status === 'completed'), artifactId = final.artifacts[0].id;
    assert.throws(() => f.service.importOwnedArtifactInput({ taskId: task.id, artifactId, workspaceKey: 'workspace-b' }), /not found/);
    const imported = f.service.importOwnedArtifactInput({ taskId: task.id, artifactId, workspaceKey: 'workspace-a' }).input; assert.equal(imported.sha256, media.png.sha256); assert.equal(imported.workspaceKey, 'workspace-a'); assert.deepEqual(fs.readFileSync(f.service.getInputPath(imported.id, 'workspace-a').path), media.png.bytes);
    assert.deepEqual(fs.readdirSync(path.join(f.store, 'incoming')), []);
    const registry = path.join(f.store, 'inputs.json'), alias = path.join(suiteRoot, 'history-input-hardlink.json'); fs.linkSync(registry, alias);
    try { assert.throws(() => f.service.importOwnedArtifactInput({ taskId: task.id, artifactId, workspaceKey: 'workspace-a' }), /Linked/); assert.deepEqual(fs.readdirSync(path.join(f.store, 'incoming')), []); assert.equal(f.service.getOwnedSnapshot().inputs.length, 1); }
    finally { fs.unlinkSync(alias); }
    const resource = f.service.getArtifactPath(task.id, artifactId); fs.appendFileSync(resource.path, 'tamper');
    assert.throws(() => f.service.importOwnedArtifactInput({ taskId: task.id, artifactId, workspaceKey: 'workspace-a' }), /integrity/); assert.equal(f.service.getOwnedSnapshot().inputs.length, 1);
  } finally { await f.service.close(); }
});
