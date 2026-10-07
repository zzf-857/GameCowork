import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { MODELS, validatePayload, quoteFor, referenceSlots, minimalPayload } = require('../../src/core/binary/out/modules/generation/models/official-image.js');
const fixture = JSON.parse(fs.readFileSync(new URL('../fixtures/codely-generator-api-contract.json', import.meta.url), 'utf8'));
const reference = 'http://127.0.0.1:41331/api/codely-generator/local-inputs/i_fixture/reference.png';
const clone = value => JSON.parse(JSON.stringify(value));
const sandbox = vm.createContext({ vN: { square_hd: '1:1', square: '1:1', portrait_4_3: '3:4', portrait_16_9: '9:16', landscape_4_3: '4:3', landscape_16_9: '16:9', auto: '1:1' } }, { codeGeneration: { strings: false, wasm: false } });
// Only the original pure builder expressions are evaluated in this VM. The
// application, requests, credential storage and original executable are absent.
vm.runInContext('function Wv(t,e){if(t.images?.length)e.imageUrls=t.images;else if(t.imageUrl)e.imageUrls=[t.imageUrl];return e} function N5(){return "medium"}', sandbox, { timeout: 1000 });
const originalDesign = fixture.registry.models.find(row => row.id === 'frontier-game-design');
sandbox.iw = { build: vm.runInContext('(' + originalDesign.fields.build.functionSource + ')', sandbox, { timeout: 1000 }), creditParams: vm.runInContext('(' + originalDesign.fields.creditParams.functionSource + ')', sandbox, { timeout: 1000 }) };
const variantSource = fixture.registry.generatedVariants.buildSource;
const builderStart = variantSource.indexOf('build: (e) => {') + 'build: '.length;
const builderEnd = variantSource.indexOf('\n    },\n    info:', builderStart) + '\n    }'.length;
sandbox.I5 = { build: vm.runInContext('(' + variantSource.slice(builderStart, builderEnd) + ')', sandbox, { timeout: 1000 }), creditParams: value => ({ ...sandbox.iw.creditParams(value), quality: 'medium' }) };
function stateFor(id, payload) {
  return { prompt: payload.prompt, quality: payload.quality, format: payload.outputFormat, size: payload.imageSize || payload.size || payload.aspectRatio,
    resolution: '1K', segmentation: payload.isSegmentation, segMode: payload.nativeSegmentation ? 'native' : payload.isSegmentation ? 'smart' : 'none',
    background: payload.background, outputCompression: payload.outputCompression, images: payload.imageUrls || payload.images || (payload.imageUrl ? [payload.imageUrl] : []),
    imageUrl: payload.imageUrl, scale: payload.scale, numLayers: payload.numLayers, sceneMode: payload.sceneMode,
    nadirCorrection: payload.nadirCorrection, highRes: payload.high_res, hyRevise: payload.revise, mode: payload.mode };
}
function originalBuilder(id) {
  if (id === 'frontier_flare' || id === 'frontier_sunburst') return sandbox.I5.build;
  return vm.runInContext('(' + fixture.registry.models.find(row => row.id === id).fields.build.functionSource + ')', sandbox, { timeout: 1000 });
}
for (const row of Object.values(MODELS).filter(row => row.visible)) {
  test(row.id + ': minimal payload is exactly the original pure builder output and original price parameters', () => {
    const payload = minimalPayload(row.id, { images: [reference] }), state = stateFor(row.id, payload);
    const original = clone(originalBuilder(row.id)(state, { images: state.images }));
    assert.deepEqual(payload, original);
    const definition = fixture.registry.models.find(model => model.id === row.id);
    assert.equal(row.taskType, definition?.fields.creditTaskType || fixture.registry.generatedVariants.variants.find(model => model.id === row.id).taskType);
    const expectedParams = row.id === 'frontier_flare' || row.id === 'frontier_sunburst' ? sandbox.I5.creditParams(state)
      : definition.fields.creditParams?.functionSource ? vm.runInContext('(' + definition.fields.creditParams.functionSource + ')', sandbox, { timeout: 1000 })(state) : {};
    assert.deepEqual(quoteFor(row.id, payload), { taskType: row.taskType, ...clone(expectedParams) });
    assert.deepEqual(Object.keys(expectedParams).sort(), [...row.quoteFields].sort());
    const inputSlots = referenceSlots(row.id, payload);
    assert.equal(inputSlots.length, row.maxInputs ? 1 : 0);
    for (const slot of inputSlots) { assert.equal(slot.value, reference); assert.deepEqual(slot.mediaKinds, ['image']); assert.match(slot.pointer, /^\/(?:imageUrls|images|imageUrl)(?:\/0)?$/); }
    const result = validatePayload(row.id, { ...payload, studioKind: row.id, studioModelId: row.id });
    result.prompt = 'changed independently';
    assert.deepEqual(payload, minimalPayload(row.id, { images: [reference] }));
    assert.throws(() => validatePayload(row.id, { ...payload, upstream: 'https://evil.invalid/' }), /Unsupported/);
    assert.throws(() => validatePayload(row.id, { ...payload, studioModelId: 'other-model' }), /identity/);
  });
}
test('Literal models excluded by the actual original catalog remain unavailable', () => {
  assert.equal(MODELS.material.visible, false); assert.equal(MODELS['sprite-atlas'].visible, false);
  for (const id of ['material', 'sprite-atlas', 'missing', '__proto__']) assert.throws(() => minimalPayload(id, { images: [reference] }), /hidden|Unsupported/);
  const grouped = fixture.registry.models.filter(row => row.uiMode === 'image' && !/Excluded/.test(row.catalogMembershipNote) && row.id !== 'doubao-prompt').map(row => row.id);
  assert.deepEqual(Object.keys(MODELS).filter(id => MODELS[id].visible).sort(), [...grouped, 'frontier_flare', 'frontier_sunburst'].sort());
});
test('Owned reference slots preserve exact order and each original model maximum', () => {
  for (const id of ['frontier_flare', 'frontier-game-design', 'seedream-lite', 'hy-image-v3', 'qwen-image', 'flare-skybox']) {
    const row = MODELS[id], initial = minimalPayload(id), key = ['hy-image-v3', 'qwen-image'].includes(id) ? 'images' : 'imageUrls';
    const urls = Array.from({ length: row.maxInputs }, (_, i) => reference + '?index=' + i);
    const payload = { ...initial, [key]: urls, ...(['hy-image-v3', 'qwen-image'].includes(id) ? { mode: 'image_to_image' } : {}) };
    assert.deepEqual(referenceSlots(id, payload).map(slot => slot.pointer), urls.map((_, i) => '/' + key + '/' + i));
    assert.throws(() => validatePayload(id, { ...payload, [key]: [...urls, reference + '?extra'] }), /references/);
    assert.throws(() => validatePayload(id, { ...payload, [key]: [reference, reference] }), /Duplicate/);
    for (const bad of ['file:///private.png', 'data:image/png;base64,AA==', 'https://user:pass@example.com/input.png']) assert.throws(() => validatePayload(id, { ...payload, [key]: [bad] }), /address/);
  }
});
test('Pixel dimensions and modes enforce each model own limits before any price or upload', () => {
  const cases = [
    ['seedream-lite', '1919x1919'], ['seedream-pro', '959x959'], ['seedream-pro', '4096x4096'],
    ['qwen-image', '512x511'], ['qwen-image', '100x3000'], ['hy-image-v3', '256x1024'], ['hy-image-v3', '2048x2048'],
  ];
  for (const [id, size] of cases) assert.throws(() => validatePayload(id, { ...minimalPayload(id), size }), /dimensions/);
  for (const id of ['hy-image-v3', 'qwen-image']) {
    assert.throws(() => validatePayload(id, { ...minimalPayload(id), mode: 'image_to_image' }), /agree/);
    assert.throws(() => validatePayload(id, { ...minimalPayload(id), images: [reference] }), /agree/);
    assert.equal(validatePayload(id, { ...minimalPayload(id), images: [reference], mode: 'image_to_image' }).images[0], reference);
  }
});
test('Frontier standard, custom, smart and native parameters remain model specific', () => {
  const game = minimalPayload('frontier-game-design');
  for (const quality of ['low', 'medium', 'high']) assert.equal(validatePayload('frontier-game-design', { ...game, quality }).quality, quality);
  const sized = { ...game, imageSize: { width: 3840, height: 2160 } };
  assert.deepEqual(quoteFor('frontier-game-design', sized), { taskType: 'fal_frontier_game_design', resolution: '3840x2160' });
  assert.throws(() => validatePayload('frontier-game-design', { ...game, imageSize: { width: 3840, height: 3840 } }), /dimensions/);
  assert.throws(() => validatePayload('frontier-game-design', { ...game, imageSize: { width: 1024, height: 1024, task: 'injected' } }), /dimensions/);
  for (const id of ['frontier_flare', 'frontier_sunburst']) {
    const initial = minimalPayload(id);
    assert.throws(() => validatePayload(id, { ...initial, quality: 'low' }), /quality/);
    assert.equal(validatePayload(id, { ...initial, isSegmentation: true }).isSegmentation, true);
    assert.equal(validatePayload(id, { ...initial, nativeSegmentation: true, background: 'transparent' }).nativeSegmentation, true);
    assert.throws(() => validatePayload(id, { ...initial, nativeSegmentation: true }), /background/);
    assert.throws(() => validatePayload(id, { ...initial, isSegmentation: true, nativeSegmentation: true, background: 'transparent' }), /segmentation/);
    assert.equal(validatePayload(id, { ...initial, outputFormat: 'jpeg', outputCompression: 0 }).outputCompression, 0);
    assert.throws(() => validatePayload(id, { ...initial, outputCompression: 50 }), /compression/);
  }
});
test('Layering, sprite, skybox and upscale reject cross model knobs or fabricated algorithms', () => {
  const ref = { images: [reference] };
  for (const id of ['qwen-layer', 'seedream-layer', 'upscale-image']) assert.throws(() => minimalPayload(id), /reference/);
  const layer = minimalPayload('qwen-layer', ref);
  for (let numLayers = 1; numLayers <= 8; numLayers++) assert.equal(validatePayload('qwen-layer', { ...layer, numLayers }).numLayers, numLayers);
  for (const numLayers of [0, 9, '3', 3.5]) assert.throws(() => validatePayload('qwen-layer', { ...layer, numLayers }), /count/);
  const sprite = minimalPayload('sprite-animation');
  assert.throws(() => validatePayload('sprite-animation', { ...sprite, nativeSegmentation: false }), /sprite|background/);
  assert.throws(() => validatePayload('sprite-animation', { ...sprite, imageSize: 'landscape_16_9' }), /size/);
  const sky = minimalPayload('flare-skybox');
  assert.equal(validatePayload('flare-skybox', { ...sky, nadirCorrection: 'soft', sceneMode: 'full' }).sceneMode, 'full');
  assert.throws(() => validatePayload('flare-skybox', { ...sky, nadirCorrection: 'on' }), /nadir/);
  assert.throws(() => validatePayload('skybox', { ...minimalPayload('skybox'), imageUrls: [reference] }), /Unsupported/);
  const upscale = minimalPayload('upscale-image', ref);
  assert.throws(() => validatePayload('upscale-image', { ...upscale, model: 'untrusted-binary' }), /algorithm/);
  assert.throws(() => validatePayload('upscale-image', { ...upscale, scale: 3 }), /factor/);
});
