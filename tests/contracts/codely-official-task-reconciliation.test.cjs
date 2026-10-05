const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../src/core/binary/out/gamecowork-official-model-catalog.js');
const { reconcile, MATCH_WINDOW_MS, CLOCK_SKEW_MS } = require('../../src/core/binary/out/gamecowork-official-task-reconciliation.js');
const created = '2026-10-03T17:31:02.123Z', milliseconds = Date.parse(created);
const references = { images: ['http://127.0.0.1:43000/owned/input.png'], videos: ['http://127.0.0.1:43000/owned/input.mp4'], audios: ['http://127.0.0.1:43000/owned/input.wav'], models: ['http://127.0.0.1:43000/owned/input.glb'] };
const clone = value => JSON.parse(JSON.stringify(value));
function local(model = 'qwen-image', changes = {}) { return { model, createdTime: created, parameters: catalog.minimalPayload(model, references), serviceSource: 'codely-official', ...changes }; }
function remote(task, changes = {}) { return { id: 'remote-original-1', type: task.model, category: catalog.MODELS[task.model].mode, createdTime: new Date(milliseconds + 2500).toISOString(), input: { data: clone(task.parameters) }, ...changes }; }
function replaceReferences(task, host = 'https://generator.example.invalid') { const result = clone(task.parameters); for (const [index, slot] of catalog.referenceSlots(task.model, result).entries()) { const kind = slot.mediaKinds[0], extension = { image: 'jpg', model: 'fbx', video: 'webm', audio: 'mp3' }[kind]; catalog.setPointer(result, slot.pointer, host + '/uploaded/actual-' + index + '.' + extension + '?signed=owned-fixture'); } return result; }
test('Every fixed exact model ID needs complete real builder parameters, and local/upload URL differences do not prevent a unique proof', () => {
  for (const model of Object.keys(catalog.MODELS)) {
    const task = local(model), row = remote(task, { input: { data: replaceReferences(task) } });
    const result = reconcile(task, [row]);
    assert.equal(result.status, 'matched', model + ': ' + JSON.stringify(result)); assert.equal(result.remoteId, row.id); assert.equal(result.matchCount, 1); assert.equal(result.replayAllowed, false);
    assert.doesNotMatch(JSON.stringify(result), /owned-fixture|generator\.example|uploaded\/|blue cube|voiceSetting/);
  }
});
test('A match requires all original scalar and nested scalar values, including false/zero and quality/duration knobs', () => {
  for (const [model, change] of [['qwen-image', { size: '1024x1024' }], ['frontier-game-design', { quality: 'high' }], ['skybox', { high_res: true }], ['sonilo-sfx', { durationSeconds: 2 }], ['minimax-tts', { voiceSetting: { voiceId: '', speed: 1.1, vol: 1 } }]]) {
    const task = local(model), row = remote(task, { input: { data: { ...task.parameters, ...change } } });
    assert.equal(reconcile(task, [row]).status, 'no_match', model);
  }
  const task = local('frontier-game-design'); const row = remote(task); row.input.data.prompt = task.parameters.prompt + ' ';
  assert.equal(reconcile(task, [row]).status, 'no_match', 'Near or whitespace-normalized prompts are not proof');
});
test('Missing input, unknown model/time, bad IDs or contradictory source metadata stay inconclusive', () => {
  const task = local();
  for (const change of [{ input: undefined }, { input: { data: { prompt: task.parameters.prompt } } }, { type: 'unpublished-kind' }, { createdTime: undefined }, { createdTime: '2026-10-03 17:31:02' }, { createdTime: '2026-02-30T17:31:02Z' }, { id: '' }, { taskId: 'other-remote' }, { input: { data: { ...task.parameters, studioModelId: 'unknown-model' } } }]) {
    const row = remote(task, change); for (const key of Object.keys(row)) if (row[key] === undefined) delete row[key];
    assert.equal(reconcile(task, [row]).status, 'inconclusive', JSON.stringify(change));
  }
  assert.equal(reconcile({ ...task, model: 'unknown-model' }, [remote(task)]).status, 'inconclusive');
  assert.equal(reconcile({ ...task, createdTime: 'date without time zone' }, []).status, 'inconclusive');
  assert.equal(reconcile({ ...task, officialTaskId: 'known-remote' }, [remote(task)]).status, 'inconclusive');
});
test('Cross-model rows and bounded old/future creation times cannot be selected as the nearest match', () => {
  const task = local('frontier-lite');
  assert.equal(reconcile(task, [remote(task, { type: 'frontier' })]).status, 'no_match');
  for (const delta of [-CLOCK_SKEW_MS - 1, MATCH_WINDOW_MS + 1]) assert.equal(reconcile(task, [remote(task, { createdTime: new Date(milliseconds + delta).toISOString() })]).status, 'no_match');
  for (const delta of [-CLOCK_SKEW_MS, MATCH_WINDOW_MS]) assert.equal(reconcile(task, [remote(task, { createdTime: new Date(milliseconds + delta).toISOString() })]).status, 'matched');
});
test('Original createdTime ISO and createTime Unix seconds are accepted only when aliases agree', () => {
  const task = local(), row = remote(task); row.createTime = Math.floor(Date.parse(row.createdTime) / 1000);
  assert.equal(reconcile(task, [row]).status, 'matched');
  const seconds = { ...row }; delete seconds.createdTime; assert.equal(reconcile(task, [seconds]).status, 'matched');
  const wrongUnits = { ...seconds, createTime: seconds.createTime * 1000 }; assert.equal(reconcile(task, [wrongUnits]).status, 'inconclusive');
  assert.equal(reconcile(task, [{ ...row, createTime: row.createTime + 20 }]).status, 'inconclusive');
  assert.equal(reconcile(task, [remote(task, { createdTime: '2026-10-04T01:31:04.623+08:00' })]).status, 'matched');
});
test('Legitimate studio metadata may identify a shared upstream family, but conflicts never become authoritative', () => {
  const task = local('sprite-animation'), row = remote(task, { type: 'fal_frontier_flare' });
  assert.equal(reconcile(task, [row]).status, 'inconclusive', 'Flare native parameters also validate; the shared taskType is insufficient');
  row.input.data.studioKind = 'sprite-animation'; row.input.data.studioModelId = 'sprite-animation';
  assert.equal(reconcile(task, [row]).status, 'matched');
  row.input.data.studioKind = 'frontier_flare'; assert.equal(reconcile(task, [row]).status, 'inconclusive');
});
test('Original alias task types and dynamic Tripo text/image task types resolve only exact versioned payloads', () => {
  for (const [model, type] of [['frontier', 'image_design'], ['sonilo-sfx', 'sound_sfx'], ['sonilo-music', 'sound_music'], ['hy-image-v3', 'hy_image_v3']]) {
    const task = local(model); assert.equal(reconcile(task, [remote(task, { type })]).status, 'matched', model);
  }
  for (const model of ['tripo-p1', 'tripo-p2', 'tripo-31']) {
    const task = local(model), payload = task.parameters;
    assert.equal(reconcile(task, [remote(task, { type: 'tripo_text_to_model' })]).status, 'matched', model);
    const image = { ...payload, imageUrl: references.images[0] }; delete image.prompt;
    const referenceTask = { ...task, parameters: image }, row = remote(referenceTask, { type: 'tripo_image_to_model', input: { data: replaceReferences(referenceTask) } });
    assert.equal(reconcile(referenceTask, [row]).status, 'matched', model + ' reference');
  }
});
test('Duplicate pagination rows for one identical task deduplicate; multiple or contradictory real tasks remain ambiguous', () => {
  const task = local(), row = remote(task);
  assert.equal(reconcile(task, [row, clone(row)]).status, 'matched');
  const multiple = reconcile(task, [row, { ...clone(row), id: 'another-remote-original' }]); assert.equal(multiple.status, 'inconclusive'); assert.equal(multiple.reason, 'ambiguous_matches'); assert.equal(multiple.matchCount, 2);
  assert.equal(reconcile(task, [row, { ...clone(row), type: 'hy-image-v3' }]).status, 'inconclusive');
  const unknown = remote(task, { id: 'unknown-second', input: { data: { prompt: task.parameters.prompt } } }); assert.equal(reconcile(task, [row, unknown]).status, 'inconclusive');
});
test('Reference pointers retain array order, count and media kinds; arbitrary URL-valued scalars do not disappear', () => {
  const task = local('frontier-lite'); task.parameters.imageUrls = [references.images[0], references.images[0] + '?second'];
  const row = remote(task, { input: { data: replaceReferences(task, 'https://other-upload-host.example.invalid') } }); assert.equal(reconcile(task, [row]).status, 'matched');
  const fewer = clone(row); fewer.input.data.imageUrls.pop(); assert.equal(reconcile(task, [fewer]).status, 'no_match');
  const wrongKind = clone(row); wrongKind.input.data.imageUrls[0] = 'https://server.example.invalid/upload/video.mp4'; assert.equal(reconcile(task, [wrongKind]).status, 'inconclusive');
  const unrecognized = local('game-ui-kit'); unrecognized.parameters.prompt = 'https://arbitrary.example.invalid/output.png'; assert.equal(reconcile(unrecognized, [remote(unrecognized)]).status, 'inconclusive');
  const extra = local('game-ui-kit'), remoteExtra = remote(extra); remoteExtra.input.data.serverUrl = 'https://arbitrary.example.invalid/private'; assert.equal(reconcile(extra, [remoteExtra]).status, 'inconclusive');
  const poisoned = clone(row); poisoned.input.data.imageUrls[0] = 'file:///private.png'; assert.equal(reconcile(task, [poisoned]).status, 'inconclusive');
});
test('Original input.param and input.data merge only with complete, non-conflicting retained fields', () => {
  const task = local('qwen-image'), payload = task.parameters;
  const row = remote(task, { input: { param: { size: payload.size, mode: payload.mode }, data: { prompt: payload.prompt, images: payload.images } } });
  assert.equal(reconcile(task, [row]).status, 'matched');
  row.input.data.size = '1024x1024'; assert.equal(reconcile(task, [row]).status, 'inconclusive');
});
test('Zero history matches do not prove absence, completion of pagination, zero charging, or permission to replay a POST', () => {
  const result = reconcile(local(), []);
  assert.deepEqual(result, { status: 'no_match', matchCount: 0, replayAllowed: false, historyCompletenessAssessed: false, absenceProven: false });
  assert.doesNotMatch(JSON.stringify(result), /charged|free|completed|not_created/);
});
