// Real original-API adapter, official executor and durable cache. The private
// account facade is injected and all transport/media are isolated fixtures.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url);
const { createAssetService } = require('../../src/core/binary/out/modules/generation/service.js');
const { createCodelyGeneratorApi } = require('../../src/core/binary/out/modules/generation/codely-api.js');
const { createOfficialImageExecutor, normalizeTaskReply, validatePayload } = require('../../src/core/binary/out/modules/generation/official-executor.js');
const root = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/official-generator-validation-' + randomUUID());
const media = createOwnedGenerationMedia(path.join(root, 'media')), binding = 'c'.repeat(64), scope = 'validation-workspace';
const origin = 'http://127.0.0.1:43993', officialOrigin = 'http://127.0.0.1:43994';
const sha = bytes => createHash('sha256').update(bytes).digest('hex'), delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const payload = () => ({ prompt: 'A blue cube on a plain background', quality: 'medium', outputFormat: 'png', isSegmentation: false, nativeSegmentation: false, imageSize: 'square_hd', background: 'auto' });
async function until(read, condition, message = 'official validation fixture state') {
  const deadline = Date.now() + 3000;
  for (;;) { const value = await read(); if (condition(value)) return value; assert.ok(Date.now() < deadline, message); await delay(5); }
}
function fixture(name, serviceOverrides = {}) {
  const state = { status: 'completed', failUpload: false, failGenerate: false }, calls = { uploads: [], generations: [], polls: [], downloads: [] }; let serial = 0;
  const service = createAssetService({ root: path.join(root, name), pollIntervalMs: 20, requestTimeoutMs: 1000, async fetch(url, init) {
    calls.downloads.push({ url: String(url), init });
    assert.equal(String(url), officialOrigin + '/output.png'); assert.deepEqual(init.headers, {});
    return new Response(media.png.bytes, { headers: { 'Content-Type': media.png.mimeType } });
  } });
  const official = {
    generationBinding() { return binding; }, generatorOrigin() { return officialOrigin; },
    async generatorPaidStatus() { return { paidType: 'paid', productCode: 'fixture-pro' }; },
    async generatorCostPreview() { return { data: { credits: 7 } }; },
    async generatorUploadImage(image) {
      calls.uploads.push({ ...image, bytes: Buffer.from(image.bytes) });
      if (state.failUpload) { const error = Error('Fixture upload POST failed'); error.httpStatus = 502; error.submissionUnknown = true; throw error; }
      return { data: { url: officialOrigin + '/reference-' + calls.uploads.length + '.png' } };
    },
    async generatorGenerate(model, parameters) {
      calls.generations.push({ model, parameters: structuredClone(parameters) });
      if (state.failGenerate) { const error = Error('Fixture generation POST failed'); error.httpStatus = 502; error.submissionUnknown = true; throw error; }
      return { data: { id: 'validation-task-' + (++serial), status: 'queued' } };
    },
    async generatorTaskStatus(taskId) {
      calls.polls.push(taskId);
      return { data: { id: taskId, status: state.status, output: { data: { imageUrl: officialOrigin + '/output.png' } } } };
    },
  };
  const apiService = { ...service, ...serviceOverrides }, api = createCodelyGeneratorApi({ assetService: apiService, getOfficial: () => official });
  const call = (body, extra = {}) => api.dispatch({ method: 'POST', path: '/sso/generate', body, origin, workspaceKey: scope, ...extra });
  const task = taskId => service.dispatch('generator/getTask', { taskId }).then(reply => reply.task);
  return { state, calls, service, apiService, api, official, call, task, close: () => service.close() };
}
function register(service, bytes = media.png.bytes) {
  const inputId = 'i_' + randomUUID(), staged = path.join(service.root, 'incoming', inputId + '.bin');
  fs.mkdirSync(path.dirname(staged), { recursive: true }); fs.writeFileSync(staged, bytes, { flag: 'wx' });
  try { return service.registerInput({ inputId, workspaceKey: scope, filename: 'reference.png', byteLength: bytes.length, sha256: sha(bytes) }).input; }
  finally { fs.unlinkSync(staged); }
}
const inputUrl = input => origin + '/api/codely-generator/local-inputs/' + input.id + '/' + encodeURIComponent(input.filename) + '?workspaceKey=' + encodeURIComponent(scope);
const artifactUrl = (task, artifact = task.artifacts[0]) => origin + '/api/codely-generator/local-artifacts/' + task.id + '/' + artifact.id + '/' + encodeURIComponent(artifact.filename);
const internalTask = (input, parameters = payload()) => ({ id: 't_' + randomUUID(), _officialOwner: binding, kind: 'image', model: 'frontier_flare', workspaceKey: scope, parameters, inputs: input ? [input] : [] });
async function generate(f, data = payload()) {
  const created = await f.call({ kind: 'frontier_flare', data }); assert.equal(created.status, 200, JSON.stringify(created));
  return until(() => f.task(created.body.taskId), task => task.status === 'completed');
}

test('Explicit unknown status with a preview URL stays pending and the real cache never collects it', async () => {
  const f = fixture('unknown-preview');
  try {
    f.state.status = 'waiting-for-approval';
    const normalized = normalizeTaskReply({ data: { id: 'known-id', status: f.state.status, output: { data: { imageUrl: officialOrigin + '/preview.png' } } } }, false);
    assert.equal(normalized.status, 'waiting-for-approval'); assert.equal(normalized.outputs.length, 1);
    const created = await f.call({ kind: 'frontier_flare', data: payload() }); assert.equal(created.status, 200);
    await until(() => f.calls.polls.length, count => count >= 2);
    const pending = await f.task(created.body.taskId); assert.ok(['queued', 'running'].includes(pending.status)); assert.match(pending.error, /status is missing or unknown/);
    assert.equal(pending.artifacts.length, 0); assert.equal(f.calls.downloads.length, 0); assert.equal(fs.existsSync(path.join(f.service.root, 'assets', pending.id)), false);
    f.state.status = 'completed'; const final = await until(() => f.task(pending.id), task => task.status === 'completed');
    assert.equal(final.artifacts[0].sha256, media.png.sha256); assert.equal(f.calls.downloads.length, 1); assert.equal(f.calls.generations.length, 1);
  } finally { await f.close(); }
});

test('The actual Buffer read after input lookup must still match the frozen snapshot before upload', async () => {
  const f = fixture('read-after-lookup-change');
  try {
    const input = register(f.service), file = f.service.getInputPath(input.id, scope).path;
    const swapped = Buffer.from(media.png.bytes); swapped[41] ^= 1;
    const executor = createOfficialImageExecutor({ assetService: { ...f.service, getInputPath(inputId, workspaceKey) {
      const verified = f.service.getInputPath(inputId, workspaceKey); fs.writeFileSync(verified.path, swapped); return verified;
    } }, getOfficial: () => f.official });
    const task = internalTask(input, { ...payload(), imageUrls: [inputUrl(input)] });
    await assert.rejects(() => executor.request(task, true, new AbortController().signal), error => {
      assert.match(error.message, /bytes changed before upload/); assert.equal(error.beforeRequest, true); assert.equal(error.submissionUnknown, false); return true;
    });
    assert.deepEqual(fs.readFileSync(file), swapped); assert.equal(f.calls.uploads.length, 0); assert.equal(f.calls.generations.length, 0); fs.writeFileSync(file, media.png.bytes);
  } finally { await f.close(); }
});

test('All artifact references validate before any history input import, including a corrupt later artifact', async () => {
  let f, imports = 0; f = fixture('validate-before-import', { importOwnedArtifactInput(data) { imports++; return f.service.importOwnedArtifactInput(data); } });
  try {
    const first = await generate(f), second = await generate(f); assert.equal(f.service.getOwnedSnapshot().inputs.length, 0);
    const resource = f.service.getArtifactPath(second.id, second.artifacts[0].id); fs.appendFileSync(resource.path, 'corrupted-later-artifact');
    const rejected = await f.call({ kind: 'frontier_flare', data: { ...payload(), imageUrls: [artifactUrl(first), artifactUrl(second)] } });
    assert.ok(rejected.status >= 400); assert.equal(imports, 0); assert.equal(f.service.getOwnedSnapshot().inputs.length, 0); assert.equal(f.calls.generations.length, 2);
    const foreign = await f.call({ kind: 'frontier_flare', data: { ...payload(), imageUrls: [artifactUrl(first), 'https://external.invalid/unowned.png'] } });
    assert.equal(foreign.status, 400); assert.equal(imports, 0); assert.equal(f.service.getOwnedSnapshot().inputs.length, 0);
  } finally { await f.close(); }
});

test('Duplicate owned artifacts and inputs reject before imports or official submission', async () => {
  let f, imports = 0; f = fixture('duplicate-references', { importOwnedArtifactInput(data) { imports++; return f.service.importOwnedArtifactInput(data); } });
  try {
    const source = await generate(f), input = register(f.service);
    for (const reference of [artifactUrl(source), inputUrl(input)]) {
      const reply = await f.call({ kind: 'frontier_flare', data: { ...payload(), imageUrls: [reference, reference] } });
      assert.equal(reply.status, 400); assert.equal(reply.body.error, 'invalid_official_image_parameters');
    }
    assert.equal(imports, 0); assert.equal(f.service.getOwnedSnapshot().inputs.length, 1); assert.equal(f.calls.generations.length, 1);
  } finally { await f.close(); }
});

test('The real original API/executor preserves all sixteen reference images and rejects seventeen before upload', async () => {
  const f = fixture('sixteen-api-references');
  try {
    const inputs = Array.from({ length: 17 }, () => register(f.service)), imageUrls = inputs.slice(0, 16).map(inputUrl);
    assert.equal(validatePayload('frontier_flare', { ...payload(), imageUrls }).imageUrls.length, 16);
    const task = await generate(f, { ...payload(), imageUrls }); assert.equal(task.inputs.length, 16); assert.deepEqual(task.inputs.map(input => input.id), inputs.slice(0, 16).map(input => input.id));
    assert.equal(f.calls.uploads.length, 16); assert.ok(f.calls.uploads.every(upload => sha(upload.bytes) === media.png.sha256));
    assert.deepEqual(f.calls.generations[0].parameters.imageUrls, Array.from({ length: 16 }, (_, index) => officialOrigin + '/reference-' + (index + 1) + '.png'));
    const rejected = await f.call({ kind: 'frontier_flare', data: { ...payload(), imageUrls: inputs.map(inputUrl) } }); assert.equal(rejected.status, 400);
    assert.equal(f.calls.uploads.length, 16); assert.equal(f.calls.generations.length, 1); assert.equal(f.service.getOwnedSnapshot().tasks.length, 1);
  } finally { await f.close(); }
});

test('An upload POST failure remains generation preflight failure, while a generation POST keeps its unknown outcome', async () => {
  const f = fixture('submission-error-flags');
  try {
    const input = register(f.service), parameters = { ...payload(), imageUrls: [inputUrl(input)] };
    const executor = createOfficialImageExecutor({ assetService: f.service, getOfficial: () => f.official });
    f.state.failUpload = true;
    await assert.rejects(() => executor.request(internalTask(input, parameters), true, new AbortController().signal), error => {
      assert.equal(error.beforeRequest, true); assert.equal(error.submissionUnknown, false); assert.match(error.message, /upload POST failed/); return true;
    });
    assert.equal(f.calls.uploads.length, 1); assert.equal(f.calls.generations.length, 0);
    const preflight = await f.call({ kind: 'frontier_flare', data: parameters }); assert.equal(preflight.status, 200);
    const failed = await until(() => f.task(preflight.body.taskId), task => task.status === 'failed'); assert.equal(failed.mayContinue, false); assert.equal(failed.officialTaskId, undefined); assert.equal(f.calls.generations.length, 0);
    f.state.failUpload = false; f.state.failGenerate = true;
    await assert.rejects(() => executor.request(internalTask(null), true, new AbortController().signal), error => {
      assert.equal(error.beforeRequest, undefined); assert.equal(error.submissionUnknown, true); assert.match(error.message, /generation POST failed/); return true;
    });
    const submitted = await f.call({ kind: 'frontier_flare', data: payload() }); assert.equal(submitted.status, 200);
    const unknown = await until(() => f.task(submitted.body.taskId), task => task.status === 'interrupted'); assert.equal(unknown.mayContinue, true); assert.equal(unknown.officialTaskId, undefined);
    await delay(50); assert.equal(f.calls.generations.length, 2, 'One direct invocation plus one real cache task; neither is replayed');
  } finally { await f.close(); }
});

test('A late import failure reclaims only new inputs belonging to the failed request', async () => {
  let f, imports = 0; f = fixture('import-rollback', { importOwnedArtifactInput(data) {
    imports++; if (imports === 2) throw Error('Fixture second import failed'); return f.service.importOwnedArtifactInput(data);
  } });
  try {
    const existing = register(f.service), first = await generate(f, { ...payload(), imageUrls: [inputUrl(existing)] }), second = await generate(f);
    const baseline = f.service.getOwnedSnapshot().inputs;
    const reply = await f.call({ kind: 'frontier_flare', data: { ...payload(), imageUrls: [artifactUrl(first), artifactUrl(second)] } });
    assert.ok(reply.status >= 400); assert.equal(imports, 2); assert.deepEqual(f.service.getOwnedSnapshot().inputs, baseline);
    assert.equal(f.calls.generations.length, 2); assert.equal(f.service.getInputPath(existing.id, scope).sha256, media.png.sha256);
    assert.deepEqual(fs.readdirSync(path.join(f.service.root, 'incoming')), []);
  } finally { await f.close(); }
});

test('Import failure preserves a new input already retained by another legitimate cache task', async () => {
  let f, imports = 0, retainedTaskId, retainedInputId; f = fixture('import-retained-record', { importOwnedArtifactInput(data) {
    imports++; if (imports === 2) throw Error('Fixture second import failed after another legitimate task retained the first');
    const imported = f.service.importOwnedArtifactInput(data); retainedInputId = imported.input.id;
    const queued = f.service.createOfficialTask({ kind: 'image', model: 'frontier_flare', prompt: payload().prompt, parameters: { ...payload(), imageUrls: [inputUrl(imported.input)] }, inputIds: [imported.input.id], workspaceKey: scope, ownerBinding: binding });
    retainedTaskId = queued.task.id; return imported;
  } });
  try {
    const first = await generate(f), second = await generate(f);
    const reply = await f.call({ kind: 'frontier_flare', data: { ...payload(), imageUrls: [artifactUrl(first), artifactUrl(second)] } });
    assert.ok(reply.status >= 400); assert.equal(imports, 2); assert.equal(f.service.getOwnedSnapshot().inputs.length, 1); assert.equal(f.service.getOwnedSnapshot().inputs[0].id, retainedInputId);
    const retained = await until(() => f.task(retainedTaskId), task => task.status === 'completed'); assert.equal(retained.inputs[0].id, retainedInputId); assert.equal(retained.inputs[0].sha256, media.png.sha256);
    assert.equal(f.service.getInputPath(retainedInputId, scope).sha256, media.png.sha256); assert.equal(f.calls.generations.length, 3);
  } finally { await f.close(); }
});
