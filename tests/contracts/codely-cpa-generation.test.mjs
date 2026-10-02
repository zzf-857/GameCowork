// Actual owned service + original Quick wire contract. Every HTTP operation is
// injected below; no LAN, official account, or paid generation service is called.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID, createHash } from 'node:crypto';
import { deflateSync, inflateSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const { createCodelyGeneratorApi } = require('../../src/core/binary/out/gamecowork-codely-generator.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/codely-cpa-generation-' + randomUUID());
const localOrigin = 'http://127.0.0.1:48721', lanOrigin = 'http://192.168.0.101:8317';
const modelId = 'cpa-gpt-image-2', apiKey = 'owned-isolated-cpa-' + randomUUID();
const sha = value => createHash('sha256').update(value).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const originalFetch = globalThis.fetch;
test.before(() => { globalThis.fetch = async () => { throw Error('External network is forbidden in CPA contracts'); }; });
test.after(() => { globalThis.fetch = originalFetch; });

// A generated RGBA fixture, not an arbitrary PNG header: the service validates
// every CRC and inflate output, and the contract compares the saved pixels.
const crc = bytes => { let value = 0xffffffff; for (const byte of bytes) { value ^= byte; for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0); } return (value ^ 0xffffffff) >>> 0; };
const chunk = (name, bytes) => { const label = Buffer.from(name), out = Buffer.alloc(bytes.length + 12); out.writeUInt32BE(bytes.length); label.copy(out, 4); bytes.copy(out, 8); out.writeUInt32BE(crc(Buffer.concat([label, bytes])), out.length - 4); return out; };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(4); ihdr.writeUInt32BE(3, 4); ihdr[8] = 8; ihdr[9] = 6;
const pixels = Buffer.alloc((4 * 4 + 1) * 3); for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) pixels.set([20 + x * 30, 60 + y * 40, 170, 255], y * 17 + x * 4 + 1);
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
const payload = prompt => ({ prompt, model: 'gpt-image-2', size: '1024x1024', quality: 'low', outputFormat: 'png', studioModelId: modelId });
const json = body => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
const configuration = changes => ({ id: 'own-cpa', name: 'Isolated CPA', kinds: ['image'], baseUrl: lanOrigin + '/v1', allowInsecureLan: true, requestTimeoutMs: 1000,
  model: 'gpt-image-2', enabled: true, authMode: 'bearer', apiKey,
  adapter: { responseMode: 'outputs', create: { method: 'POST', path: '/images/generations', bodyTemplate: {
    model: '{{model}}', prompt: '{{prompt}}', n: 1, size: '1024x1024', quality: 'low', output_format: 'png' } },
    cancel: null, selectors: { outputs: 'data' }, outputSelectors: { url: 'url', base64: 'b64_json', mime: '', filename: '' } }, ...changes });

async function fixture(t, fetchHandler = () => json({ data: [{ b64_json: png.toString('base64') }] })) {
  const directory = path.join(root, randomUUID()), requests = [];
  let service, api;
  function open() {
    service = createAssetService({ root: directory, pollIntervalMs: 10, requestTimeoutMs: 50, fetch: async (input, init) => {
      const url = new URL(input), headers = new Headers(init.headers);
      const record = { url: url.href, method: init.method, redirect: init.redirect, authorized: headers.get('Authorization') === 'Bearer ' + apiKey,
        body: typeof init.body === 'string' ? JSON.parse(init.body) : null };
      requests.push(record); return fetchHandler(url, init, record);
    } });
    api = createCodelyGeneratorApi({ assetService: service });
  }
  open(); t.after(async () => { await service.close(); });
  const dispatch = (method, route, { body, query = {}, scope = 'workspace-a' } = {}) => api.dispatch({ method, path: route, origin: localOrigin,
    query, body, ...(scope === undefined ? {} : { workspaceKey: scope }), workspaceNames: { 'workspace-a': 'Own Project A', 'workspace-b': 'Own Project B' } });
  return { directory, requests, dispatch, get service() { return service; }, async restart() { await service.close(); open(); },
    save: config => service.dispatch('generator/saveProvider', { provider: config }),
    bind: providerId => dispatch('PUT', '/local/model-bindings/' + modelId, { body: { providerId } }),
    session: () => dispatch('GET', '/local-session'),
    generate: (data = payload('Owned prompt'), scope = 'workspace-a', kind = modelId) => dispatch('POST', '/sso/generate', { body: { kind, data }, scope }),
    async terminal(taskId) { const deadline = Date.now() + 5000; for (;;) { const { task } = await service.dispatch('generator/getTask', { taskId }); if (['completed','failed','interrupted','cancelled'].includes(task.status)) return task; if (Date.now() > deadline) throw Error('Isolated CPA task completion deadline'); await sleep(5); } }
  };
}

test('Explicit CPA binding persists, re-evaluates live profile availability, and never grants official quota', async t => {
  const f = await fixture(t), config = configuration();
  assert.equal((await f.session()).body.capabilities.localGeneration, false);
  await f.save(config); assert.deepEqual((await f.session()).body.capabilities.models, {});
  assert.deepEqual((await f.bind(config.id)).body, { modelId, configured: true });
  const expected = { [modelId]: { available: true, providerId: config.id, model: 'gpt-image-2' } };
  assert.deepEqual((await f.session()).body.capabilities.models, expected);
  await f.restart(); assert.deepEqual((await f.dispatch('GET', '/local/model-bindings')).body.models, expected);
  await f.save({ ...config, enabled: false }); assert.equal((await f.session()).body.capabilities.localGeneration, false);
  assert.equal((await f.generate()).status, 503);
  await f.save(config); await f.save({ ...config, apiKey: undefined, clearApiKey: true });
  assert.deepEqual((await f.session()).body.capabilities.models, {});
  await f.save(config); await f.service.dispatch('generator/deleteProvider', { providerId: config.id });
  assert.equal((await f.session()).body.capabilities.localGeneration, false);
  await f.save(config); assert.equal((await f.bind(null)).body.configured, false);
  await f.restart(); assert.deepEqual((await f.session()).body.capabilities.models, {});
  const credit = await f.dispatch('GET', '/credit/my-paid-status'); assert.equal(credit.status, 503); assert.equal(credit.body.paidType, null);
  assert.equal(f.requests.length, 0);
});

test('CPA capability requires the actual image model, API key, synchronous mode, method and route', async t => {
  const f = await fixture(t), valid = configuration();
  const invalid = [
    { enabled: false }, { model: 'gpt-image-1' }, { model: 'gpt-6.1-sol' }, { kinds: ['video'] },
    { apiKey: undefined, clearApiKey: true }, { authMode: 'none', apiKey: undefined, clearApiKey: true },
    { adapter: { ...valid.adapter, responseMode: 'task' } },
    { adapter: { ...valid.adapter, create: { ...valid.adapter.create, method: 'PUT' } } },
    { adapter: { ...valid.adapter, create: { ...valid.adapter.create, path: '/images/edits' } } }
  ];
  for (const change of invalid) {
    await f.save({ ...valid, ...change });
    const response = await f.bind(valid.id); assert.equal(response.status, 400, JSON.stringify(change));
    assert.deepEqual((await f.session()).body.capabilities.models, {});
  }
  await f.save(valid); assert.equal((await f.bind(valid.id)).status, 200);
  assert.equal((await f.dispatch('PUT', '/local/model-bindings/' + modelId, { body: { providerId: valid.id, model: 'some-other-model' } })).status, 400);
  assert.equal(f.requests.length, 0);
});

test('Original Quick submission completes real PNG, preserves full payload/scope, and survives restart without secrets', async t => {
  const f = await fixture(t), config = configuration(); await f.save(config); await f.bind(config.id);
  const input = payload('原生 Quick 测试 "prompt"\nwith exact line'), created = await f.generate(input);
  assert.equal(created.status, 200); assert.deepEqual(Object.keys(created.body), ['taskId']);
  const task = await f.terminal(created.body.taskId); assert.equal(task.status, 'completed'); assert.equal(task.workspaceKey, 'workspace-a');
  assert.equal(task.model, 'gpt-image-2'); assert.deepEqual(task.parameters, input); assert.equal(task.artifacts.length, 1);
  assert.equal(task.artifacts[0].width, 4); assert.equal(task.artifacts[0].height, 3);
  assert.deepEqual(f.requests, [{ url: lanOrigin + '/v1/images/generations', method: 'POST', redirect: 'manual', authorized: true,
    body: { model: 'gpt-image-2', prompt: input.prompt, n: 1, size: '1024x1024', quality: 'low', output_format: 'png' } }]);
  const saved = await f.service.dispatch('generator/getResource', { taskId: task.id, artifactId: task.artifacts[0].id });
  assert.equal(saved.mime, 'image/png'); const bytes = Buffer.from(saved.base64, 'base64'); assert.equal(sha(bytes), sha(png));
  const dataLength = bytes.readUInt32BE(33); assert.deepEqual(inflateSync(bytes.subarray(41, 41 + dataLength)), pixels);
  for (const route of ['/task/' + task.id + '/status', '/editor/task/' + task.id + '/id-status', '/generation-history/task/' + task.id]) {
    const result = await f.dispatch('GET', route); assert.equal(result.status, 200); assert.equal(result.body.id, task.id); assert.equal(result.body.status, 'completed');
    assert.equal(result.body.type, modelId); assert.match(result.body.name, /CPA/); assert.equal(result.body.local.originalStudioModelKnown, false); assert.equal(result.body.local.descriptorSource, 'gamecowork-cpa-extension');
    assert.equal(result.body.output.data.artifacts[0].width, 4); assert.equal(result.body.output.data.artifacts[0].height, 3);
    assert.deepEqual(result.body.input.data, input); assert.equal(result.body.output.data.artifacts[0].sha256, sha(png));
    assert.equal(result.body.output.data.imageUrl, localOrigin + '/api/codely-generator/local-artifacts/' + task.id + '/' + task.artifacts[0].id + '/' + task.artifacts[0].filename);
    assert.equal((await f.dispatch('GET', route, { scope: 'workspace-b' })).status, 404);
  }
  assert.equal((await f.dispatch('GET', '/tasks', { scope: '', query: { status: 'completed' } })).body.total, 0);
  await f.restart(); const history = await f.dispatch('GET', '/tasks', { query: { category: 'image', status: 'completed', type: modelId, page: 1, pageSize: 40 } });
  assert.equal(history.body.total, 1); assert.equal(history.body.size, 1); assert.deepEqual(history.body.tasks[0].input.data, input); assert.equal(history.body.tasks[0].workspaceName, 'Own Project A');
  assert.equal(JSON.stringify({ created, task, saved, history, session: await f.session(), providers: await f.service.dispatch('generator/listProviders') }).includes(apiKey), false);
  for (const filename of ['providers.json','tasks.json','codely-generator-state.json']) assert.equal(fs.readFileSync(path.join(f.directory, filename), 'utf8').includes(apiKey), false, filename);
  assert.equal(f.requests.length, 1, 'Restart and reading history never resubmit generation');
});

test('No implicit model remapping, unsupported parameters, or missing workspace may submit a request', async t => {
  const f = await fixture(t); await f.save(configuration()); await f.bind('own-cpa');
  for (const kind of ['gpt-image-2','qwen-image','seedream-lite','gpt-6.1-sol']) assert.equal((await f.generate(payload('test'), 'workspace-a', kind)).status, 503, kind);
  for (const change of [{ size: '1536x1024' }, { quality: 'high' }, { outputFormat: 'jpeg' }, { model: 'gpt-image-1' }, { studioModelId: 'qwen-image' },
    { n: 2 }, { imageUrls: ['http://untrusted.invalid/ref.png'] }, { prompt: '' }, { arbitrary: true }]) {
    assert.equal((await f.generate({ ...payload('test'), ...change })).status, 400, JSON.stringify(change));
  }
  // Call directly to distinguish an omitted scope from the helper's explicit default.
  const api = createCodelyGeneratorApi({ assetService: f.service });
  assert.equal((await api.dispatch({ method: 'POST', path: '/sso/generate', origin: localOrigin, body: { kind: modelId, data: payload('test') } })).status, 400);
  assert.equal(f.requests.length, 0); assert.equal((await f.service.dispatch('generator/listTasks')).total, 0);
  const global = await f.generate(payload('Explicit global'), ''); assert.equal(global.status, 200); const task = await f.terminal(global.body.taskId);
  assert.equal(task.status, 'completed'); assert.equal(task.workspaceKey, undefined); assert.equal((await f.dispatch('GET', '/tasks', { scope: '' })).body.total, 1);
});

test('Insecure LAN requires explicit authorization and an RFC1918 dotted-decimal literal', async t => {
  const f = await fixture(t);
  for (const baseUrl of [lanOrigin + '/v1','http://10.1.2.3/v1','http://172.16.2.3/v1']) {
    await assert.rejects(() => f.save(configuration({ baseUrl, allowInsecureLan: false })), /explicitly authorized/);
    await assert.rejects(() => f.save(configuration({ baseUrl, allowInsecureLan: 'true' })), /explicit boolean/);
    assert.equal((await f.save(configuration({ baseUrl }))).provider.allowInsecureLan, true);
  }
  for (const baseUrl of ['http://8.8.8.8/v1','http://100.64.0.1/v1','http://169.254.1.1/v1','http://172.15.0.1/v1','http://172.32.0.1/v1','http://192.169.0.1/v1','http://private-host.invalid/v1','http://[fd00::1]/v1',
    'http://0xc0a80065:8317/v1','http://3232235621:8317/v1','http://0300.0250.0.0145:8317/v1']) {
    await assert.rejects(() => f.save(configuration({ baseUrl })), undefined, baseUrl);
  }
  for (const requestTimeoutMs of [999,600001,1000.5,'1000',NaN]) await assert.rejects(() => f.save(configuration({ requestTimeoutMs })), /1000\.\.600000/);
  for (const requestTimeoutMs of [1000,600000]) assert.equal((await f.save(configuration({ requestTimeoutMs }))).provider.requestTimeoutMs, requestTimeoutMs);
  assert.equal(f.requests.length, 0);
});

test('Authorized same-origin LAN output downloads real bytes; cross-origin redirects never receive credentials', async t => {
  for (const redirect of [null,'http://192.168.0.102:8317/other.png','http://192.168.0.101:8318/other.png','http://8.8.8.8/other.png','http://127.0.0.1/other.png']) {
    const f = await fixture(t, (url, init) => init.method === 'POST' ? json({ data: [{ url: lanOrigin + '/output.png' }] }) :
      redirect ? new Response(null, { status: 302, headers: { Location: redirect } }) : new Response(png, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } }));
    await f.save(configuration()); await f.bind('own-cpa'); const created = await f.generate(); const task = await f.terminal(created.body.taskId);
    assert.equal(task.status, redirect ? 'failed' : 'completed', redirect || 'same origin');
    assert.equal(task.artifacts.length, redirect ? 0 : 1);
    assert.equal(f.requests.length, 2); assert.ok(f.requests.every(row => new URL(row.url).origin === lanOrigin && row.authorized && row.redirect === 'manual'));
    if (!redirect) assert.equal(task.artifacts[0].sha256, sha(png));
  }
});

test('Create redirects are not followed and cannot silently submit an authorized task to another origin', async t => {
  const f = await fixture(t, () => new Response(null, { status: 307, headers: { Location: 'http://192.168.0.102:8317/v1/images/generations' } }));
  await f.save(configuration()); await f.bind('own-cpa'); const created = await f.generate(), task = await f.terminal(created.body.taskId);
  assert.notEqual(task.status, 'completed'); assert.equal(task.artifacts.length, 0); assert.equal(f.requests.length, 1); assert.equal(f.requests[0].redirect, 'manual');
});

test('Per-provider request deadline applies to both create and output download', async t => {
  for (const stage of ['create','download']) {
    let aborted = false;
    const f = await fixture(t, (url, init) => {
      if (stage === 'download' && init.method === 'POST') return json({ data: [{ url: lanOrigin + '/output.png' }] });
      return new Promise((resolve, reject) => {
        const abort = () => { aborted = true; reject(init.signal.reason || Error('Owned fixture aborted')); };
        if (init.signal.aborted) abort(); else init.signal.addEventListener('abort', abort, { once: true });
      });
    });
    await f.save(configuration({ requestTimeoutMs: 1000 })); await f.bind('own-cpa'); const started = Date.now(), created = await f.generate(), task = await f.terminal(created.body.taskId);
    assert.equal(aborted, true, stage); assert.notEqual(task.status, 'completed'); assert.equal(task.artifacts.length, 0); assert.match(task.error, /deadline/i);
    assert.ok(Date.now() - started >= 800, 'Provider deadline overrides the service default of 50 ms: ' + stage);
    assert.equal(f.requests.length, stage === 'create' ? 1 : 2);
  }
});
