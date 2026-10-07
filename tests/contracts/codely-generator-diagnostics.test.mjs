// Narrow production-broker diagnostics and self-history, exercised only over
// an owned loopback HTTP server with synthetic secrets and encrypted test vault.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {createCodelyAccountBroker} = require('../../src/core/binary/out/modules/account/broker.js');
const {minimalPayload} = require('../../src/core/binary/out/modules/generation/models/official-catalog.js');
const SECRET = {access: 'diag-access/+/Fixture~', refresh: 'diag-refresh+++token', cookie: 'diag-site-session-abc123', csrf: 'cS4!'};
const secrets = Object.values(SECRET);
const historyQuery = {startTime: '2026-10-03T00:00:00.000Z', endTime: '2026-10-03T02:00:00.000Z', page: 1, pageSize: 100};
const unicode = value => [...value].map(char => [...Buffer.from(char, 'utf16le')].reduce((out, byte, i, all) => i % 2 ? out : out + '\\u' + (byte + all[i + 1] * 256).toString(16).padStart(4, '0'), '')).join('');
const percent = value => [...Buffer.from(value)].map(byte => '%' + byte.toString(16).padStart(2, '0')).join('');
function expanded(value, depth = 0) {
  if (depth > 35) return value;
  if (typeof value === 'string') { try { return expanded(JSON.parse(value), depth + 1); } catch { return value.replace(/\\u([a-f\d]{4})/gi, (_, unit) => String.fromCharCode(parseInt(unit, 16))); } }
  if (Array.isArray(value)) return value.map(item => expanded(item, depth + 1));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key, expanded(item, depth + 1)]));
  return value;
}
function assertSecretFree(value) { const exposed = JSON.stringify(expanded(value)); for (const secret of secrets) assert.equal(exposed.includes(secret), false, 'Synthetic private credential stays redacted after consumer decoding'); }

async function fixture(t, options = {}) {
  const directory = fs.mkdtempSync('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/generator-diagnostics-');
  const key = crypto.randomBytes(32), calls = [], events = [], logs = [], overrides = new Map();
  const vault = {
    async seal(bytes) { const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', key, iv), encrypted = Buffer.concat([cipher.update(bytes), cipher.final()]); return Buffer.concat([iv, cipher.getAuthTag(), encrypted]); },
    async unseal(bytes) { const cipher = crypto.createDecipheriv('aes-256-gcm', key, bytes.subarray(0,12)); cipher.setAuthTag(bytes.subarray(12,28)); return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]); },
  };
  let origin, broker;
  const server = http.createServer(async (request, response) => {
    const target = new URL(request.url, origin), bytes = []; for await (const chunk of request) bytes.push(chunk);
    const call = {method: request.method, path: target.pathname, query: Object.fromEntries(target.searchParams), headers: request.headers, body: Buffer.concat(bytes)}; calls.push(call);
    if (overrides.has(call.path)) return overrides.get(call.path)(call, response);
    let payload;
    if (call.path === '/auth/device/initiate') payload = {auth_request_token: 'own-diagnostic-request', user_code: 'TEST-CODE', verification_uri: origin + '/auth/device', verification_uri_complete: origin + '/auth/device?user_code=TEST-CODE', expires_in: 600, interval: 1};
    else if (call.path === '/auth/device/poll') payload = {status: 'authorized', authorization_code: 'own-diagnostic-code'};
    else if (call.path === '/auth/device/exchange') payload = {access_token: SECRET.access, refresh_token: SECRET.refresh, expires_in: 3600};
    else if (call.path === '/auth/external/me') payload = {id: 'owned-diagnostic-account', username: 'Owned test account'};
    else if (call.path === '/api/editor/sso/bootstrap') { response.setHeader('Set-Cookie', [`gen_sid=${SECRET.cookie}; Path=/; HttpOnly`, `_csrf=${SECRET.csrf}; Path=/`]); payload = {id: 'owned-diagnostic-account'}; }
    else if (call.path === '/api/sso/generate') payload = {data: {taskId: 'owned-diagnostic-task', status: 'queued'}};
    else if (call.path === '/api/task/owned-diagnostic-task/status') payload = {data: {id: 'owned-diagnostic-task', status: 'completed', output: {data: {text: 'Owned fixture'}}}};
    else if (call.path === '/api/tasks') payload = {tasks: [{id: 'owned-diagnostic-task', status: 'failed', input: {data: {prompt: 'Own bounded history'}}, output: {data: {error: {message: SECRET.cookie}}}}], total: 1, page: 1};
    else return response.writeHead(404).end('Owned missing route');
    response.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify(payload));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); origin = 'http://127.0.0.1:' + server.address().port;
  broker = await createCodelyAccountBroker({root: directory, vault, baseUrl: origin, autoDrive: false, requestTimeoutMs: options.timeoutMs || 1000,
    fetch: async (url, init) => { assert.equal(new URL(url).origin, origin, 'No official/WAN request is possible'); if (options.beforeFetch) await options.beforeFetch(new URL(url), init); return fetch(url, init); },
    emitter: (kind, data) => events.push({kind, data}), logger: {warn: value => logs.push(value), error: value => logs.push(value)},
  });
  t.after(async () => { broker.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  await broker.start(); assert.equal((await broker.poll()).status, 'completed');
  return {broker, calls, events, logs, overrides, origin, count: route => calls.filter(call => call.path === route).length};
}
const capture = async promise => { try { await promise; assert.fail('Expected a rejected official request'); } catch (error) { return error; } };

for (const status of [400, 422]) test(`HTTP ${status} preserves a bounded validation diagnostic after recursive secret removal`, async t => {
  const f = await fixture(t);
  const nested = JSON.stringify({message: 'Legitimate model validation failed', echo: unicode(secrets.join(' ')), access_token: 'unknown-extra-private-token'});
  f.overrides.set('/api/sso/generate', (_call, response) => response.writeHead(status, {'Content-Type': 'application/json'}).end(JSON.stringify({
    message: 'duration must match the supported option', detail: [{loc: ['data','duration'], msg: nested, input: SECRET.refresh}], error: {message: 'Reference format is invalid ' + percent(SECRET.cookie)}, code: 'invalid_duration',
    access_token: 'unselected-outer-private-value', stack: 'unselected-private-stack', debug: 'unselected-private-debug',
  })));
  const error = await capture(f.broker.generatorGenerate('frontier_flare', minimalPayload('frontier_flare')));
  assert.equal(error.httpStatus, status); assert.equal(error.code, 'server'); assert.equal(error.submissionUnknown, true);
  assert.ok(error.message.startsWith(`Official generator request failed (${status}): `));
  assert.match(error.safeDiagnostic, /supported option/); assert.match(error.safeDiagnostic, /Legitimate model validation/); assert.match(error.safeDiagnostic, /invalid_duration/); assert.match(error.safeDiagnostic, /\[redacted\]/);
  assertSecretFree({message: error.message, safeDiagnostic: error.safeDiagnostic, stack: error.stack});
  assert.doesNotMatch(error.message, /unknown-extra-private-token|unselected-outer-private-value|unselected-private-stack|unselected-private-debug/);
  assert.equal(f.count('/api/sso/generate'), 1, 'A failed POST is never automatically replayed'); assertSecretFree([f.events, f.logs, f.broker.status()]);
});

test('only whitelisted validation fields are relayed, including a single data envelope', async t => {
  const f = await fixture(t);
  f.overrides.set('/api/sso/generate', (_call,response) => response.writeHead(400).end(JSON.stringify({data: {message: 'unsupported duration', error: {message: 'wrong format', stack: 'private-stack'}, code: 17}, error: 'Unsupported original model kind', target: 'qwen-image', reason: 'unwhitelisted raw reason'})));
  const error = await capture(f.broker.generatorGenerate('frontier_flare', {}));
  assert.equal(error.safeDiagnostic, 'Unsupported original model kind; qwen-image; unsupported duration; wrong format; code: 17'); assert.doesNotMatch(error.message, /private-stack|unwhitelisted/);
});

for(const status of [400,422]) for(const field of ['error','msg','target']) test(`HTTP ${status} preserves original Quick ${field} string diagnostics without secrets or POST replay`,async t=>{
  const f=await fixture(t),message=`Original model kind was rejected ${SECRET.access} ${percent(SECRET.cookie)}`;
  f.overrides.set('/api/sso/generate',(_call,response)=>response.writeHead(status).end(JSON.stringify({data:{[field]:message},debug:'unselected-private-debug',access_token:'unselected-private-token'})));
  const error=await capture(f.broker.generatorGenerate('frontier_flare',minimalPayload('frontier_flare')));
  assert.equal(error.httpStatus,status);assert.equal(error.submissionUnknown,true);assert.match(error.safeDiagnostic,/Original model kind was rejected/);assert.match(error.safeDiagnostic,/\[redacted\]/);
  assertSecretFree({message:error.message,safeDiagnostic:error.safeDiagnostic,stack:error.stack});
  assert.doesNotMatch(error.message,/unselected-private/);assert.equal(f.count('/api/sso/generate'),1);
});

test('JSON message follows only original Quick diagnostic leaves and never exposes encoded debug objects',async t=>{
  const f=await fixture(t);
  for(const field of ['error','message','msg','target']) {
    f.overrides.set('/api/sso/generate',(_call,response)=>response.writeHead(400).end(JSON.stringify({message:JSON.stringify({[field]:'Original size is not supported',debug:'unselected-private-debug',access_token:'unselected-private-token'})})));
    const error=await capture(f.broker.generatorGenerate('frontier_flare',minimalPayload('frontier_flare')));
    assert.equal(error.safeDiagnostic,'Original size is not supported');assert.doesNotMatch(error.message,/unselected-private|[{}]/);
  }
  for(const message of [JSON.stringify({debug:'unselected-private-debug',echo:SECRET.cookie}),'{broken-private-json',JSON.stringify(['unselected-private-debug'])]) {
    f.overrides.set('/api/sso/generate',(_call,response)=>response.writeHead(400).end(JSON.stringify({message})));
    const error=await capture(f.broker.generatorGenerate('frontier_flare',minimalPayload('frontier_flare')));
    assert.equal(error.safeDiagnostic,undefined);assert.equal(error.message,'Official generator request failed (400)');assertSecretFree(error.message);
  }
  assert.equal(f.count('/api/sso/generate'),7,'Every explicit fixture request submits once; no automatic replay');
});

for (const [name, status, body] of [
  ['non-JSON validation body', 400, 'private plain body ' + SECRET.access],
  ['JSON scalar', 422, JSON.stringify('private scalar ' + SECRET.cookie)],
  ['JSON without selected fields', 400, JSON.stringify({access_token: 'unknown-private-secret', debug: SECRET.refresh})],
  ['oversized JSON', 422, JSON.stringify({message: 'oversized-body-' + 'a'.repeat(65536), detail: SECRET.access})],
  ['an unknown HTTP status', 503, JSON.stringify({message: 'private upstream overload ' + SECRET.access})],
  ['authorization HTTP failure', 401, JSON.stringify({detail: 'private unauthorized ' + SECRET.access})],
]) test(`${name} retains a fixed failure without echoing body contents`, async t => {
  const f = await fixture(t);
  f.overrides.set('/api/sso/generate', (_call,response) => response.writeHead(status, {'Content-Type': 'application/json'}).end(body));
  const error = await capture(f.broker.generatorGenerate('frontier_flare', {}));
  assert.equal(error.message, `Official generator request failed (${status})`); assert.equal(error.safeDiagnostic, undefined); assert.equal(error.submissionUnknown, true);
  assertSecretFree({message: error.message, stack: error.stack}); assert.equal(f.count('/api/sso/generate'), 1); assertSecretFree([f.events, f.logs]);
});

test('bounded diagnostics remove control characters and refuse excessive nesting', async t => {
  const f = await fixture(t);
  f.overrides.set('/api/sso/generate', (_call,response) => response.writeHead(422).end(JSON.stringify({message: 'format\n\u0001' + 'x'.repeat(3000), code: SECRET.access})));
  let error = await capture(f.broker.generatorGenerate('frontier_flare', {}));
  assert.equal(error.safeDiagnostic.length, 1200); assert.doesNotMatch(error.safeDiagnostic, /[\u0000-\u001f\u007f]/); assertSecretFree(error.safeDiagnostic);
  let nested = {message: SECRET.access}; for (let n = 0; n < 34; n++) nested = {nested};
  f.overrides.set('/api/sso/generate', (_call,response) => response.writeHead(400).end(JSON.stringify({detail: nested})));
  error = await capture(f.broker.generatorGenerate('frontier_flare', {})); assert.equal(error.safeDiagnostic, undefined); assert.equal(error.message, 'Official generator request failed (400)');
});

test('transport-injected status/diagnostic fields cannot cross the private facade', async t => {
  const f = await fixture(t, {beforeFetch: async url => { if (url.pathname === '/api/sso/generate') { const error = Error(SECRET.access); error.httpStatus = 400; error.safeDiagnostic = SECRET.refresh; throw error; } }});
  const error = await capture(f.broker.generatorGenerate('frontier_flare', {}));
  assert.equal(error.message, 'Official generator request failed (400)'); assert.equal(error.safeDiagnostic, undefined); assert.equal(error.submissionUnknown, true); assertSecretFree({message: error.message, stack: error.stack});
});

test('full-body timeout remains fixed even after HTTP 400 headers arrive, without POST retry', async t => {
  const f = await fixture(t, {timeoutMs: 100});
  f.overrides.set('/api/sso/generate', (_call,response) => { response.writeHead(400, {'Content-Type': 'application/json'}); response.write('{"detail":"' + SECRET.access); });
  const error = await capture(f.broker.generatorGenerate('frontier_flare', {}));
  assert.equal(error.code, 'timeout'); assert.equal(error.message, 'Official generator request timed out'); assert.equal(error.safeDiagnostic, undefined); assert.equal(error.submissionUnknown, true); assert.equal(f.count('/api/sso/generate'), 1); assertSecretFree({message: error.message, stack: error.stack});
});

test('success receipts and nested JSON still share the exact sanitizer, preserving ordinary encoded URLs', async t => {
  const f = await fixture(t), publicUrl = f.origin + '/media/owned%20image.png';
  f.overrides.set('/api/task/owned-diagnostic-task/status', (_call,response) => response.writeHead(200).end(JSON.stringify({data: {id: 'owned-diagnostic-task', status: 'failed', error: {message: JSON.stringify({detail: unicode(SECRET.access), cookie: 'unrecognized-cookie-value'})}, output: {data: {imageUrl: publicUrl, note: 'Echo ' + percent(SECRET.csrf), [unicode('access_token')]: 'unknown-untrusted-token'}}}})));
  const reply = await f.broker.generatorTaskStatus('owned-diagnostic-task');
  assert.equal(reply.data.output.data.imageUrl, publicUrl); assertSecretFree(reply); assert.doesNotMatch(JSON.stringify(expanded(reply)), /unrecognized-cookie-value|unknown-untrusted-token/);
});

test('self-history is a fixed GET with bounded date/paging and a redacted internal envelope', async t => {
  const f = await fixture(t), reply = await f.broker.generatorTaskHistory(historyQuery);
  const call = f.calls.at(-1); assert.equal(call.path, '/api/tasks'); assert.equal(call.method, 'GET');
  assert.deepEqual(call.query, {historyScope: 'self', excludeBase64: 'true', ...historyQuery, page: '1', pageSize: '100'});
  assert.equal(call.headers.authorization, 'Bearer ' + SECRET.access); assert.equal(call.headers['x-csrf-token'], SECRET.csrf); assert.ok(call.headers.cookie.includes(SECRET.cookie));
  assert.equal(reply.tasks[0].id, 'owned-diagnostic-task'); assert.equal(reply.total, 1); assert.equal(reply.tasks[0].output.data.error.message, '[redacted]'); assertSecretFree(reply);
  assert.equal(f.count('/api/sso/generate'), 0, 'Read-only reconciliation never creates a task');
});

test('history disallows global/user options, invalid dates and unbounded paging before network access', async t => {
  const f = await fixture(t), before = f.calls.length;
  for (const change of [{historyScope: 'all'}, {historyEmail: 'someone@example.test'}, {excludeBase64: false}, {path: '/api/admin/tasks'}, {startTime: '2026-02-30T00:00:00Z'}, {startTime: '2026-10-03'}, {endTime: historyQuery.startTime}, {endTime: '2026-10-03T25:00:00Z'}, {endTime: '2026-10-03T01:00:00+14:30'}, {page: 101}, {pageSize: 101}, {page: '1'}, {pageSize: 0}]) assert.throws(() => f.broker.generatorTaskHistory({...historyQuery, ...change}), error => error.code === 'policy');
  assert.throws(() => f.broker.generatorTaskHistory(), error => error.code === 'policy'); assert.equal(f.calls.length, before);
});

test('logout cannot publish a late self-history receipt', async t => {
  const f = await fixture(t); let held;
  f.overrides.set('/api/tasks', (_call,response) => { held = response; response.writeHead(200); response.write('{'); });
  const promise = f.broker.generatorTaskHistory(historyQuery);
  while (!held) await new Promise(resolve => setTimeout(resolve, 5));
  const rejected = assert.rejects(promise, error => error.code === 'cancelled' && error.safeDiagnostic === undefined);
  await f.broker.logout(); await rejected;
  held.end('"access_token":"' + SECRET.access + '"}'); assertSecretFree([f.events, f.logs, f.broker.status()]);
});

test('explicit cancellation settles a stalled self-history body without POST or receipt publication', async t => {
  const f = await fixture(t); let held;
  f.overrides.set('/api/tasks', (_call,response) => { held = response; response.writeHead(200); response.write('{'); });
  const controller = new AbortController(), promise = f.broker.generatorTaskHistory(historyQuery, controller.signal);
  while (!held) await new Promise(resolve => setTimeout(resolve, 5));
  const rejected = assert.rejects(promise, error => error.code === 'cancelled' && error.safeDiagnostic === undefined && error.submissionUnknown !== true && !error.message.includes(SECRET.access));
  controller.abort(Error(SECRET.access)); await rejected;
  held.end('"access_token":"' + SECRET.access + '"}');
  assert.equal(f.count('/api/tasks'), 1); assert.equal(f.count('/api/sso/generate'), 0); assertSecretFree([f.events, f.logs]);
});

test('the history capability remains a private facade method without renderer registration', () => {
  const source = fs.readFileSync(new URL('../../src/core/binary/out/modules/account/broker.js', import.meta.url), 'utf8');
  assert.match(source, /generatorTaskHistory: \(query, signal\) => wiring\.broker\.generatorTaskHistory\(query, signal\)/);
  const handlers = [...source.matchAll(/messenger\.on\("([^"]+)"/g)].map(match => match[1]);
  assert.equal(handlers.some(route => /generator.*history|history.*generator/i.test(route)), false);
});
