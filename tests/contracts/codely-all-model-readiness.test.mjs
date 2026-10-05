import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { officialModelIds, officialImageModelIds, gamecoworkGenerationReadiness, gamecoworkGenerationPresentation } from '../../src/frontend/bundle/codely-generator/local-generation.js';
import { cpaImageModelId, cpaImageUpstreamModel } from '../../src/frontend/bundle/codely-generator/local-models.js';
const require = createRequire(import.meta.url);
const { MODELS } = require('../../src/core/binary/out/gamecowork-official-model-catalog.js');
function reply(models, extra = {}) {
  return { mode: 'codely-official', capabilities: { officialGeneration: true, localGeneration: false, models, ...extra } };
}
const proof = row => ({ available: true, service: 'codely-official', model: row.id, kind: row.kind, mode: row.mode });
const canUse = (response, id) => !gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(response), 'zh', id).blocked;
test('The readiness mirror matches every fixed official contract across all four original categories', () => {
  assert.deepEqual(officialModelIds, Object.keys(MODELS));
  assert.deepEqual(officialImageModelIds, Object.values(MODELS).filter(row => row.kind === 'image').map(row => row.id));
  assert.equal(officialModelIds.length, 43);
  const modes = new Set(), kinds = new Set();
  for (const row of Object.values(MODELS)) {
    const read = gamecoworkGenerationReadiness(reply({ [row.id]: proof(row) }));
    assert.equal(gamecoworkGenerationPresentation(read, 'en', row.id).blocked, false, row.id);
    assert.deepEqual(read.models[row.id], proof(row));
    assert.equal(Object.isFrozen(read.models[row.id]), true);
    for (const other of officialModelIds.filter(id => id !== row.id)) assert.equal(gamecoworkGenerationPresentation(read, 'zh', other).blocked, true, other);
    modes.add(row.mode); kinds.add(row.kind);
  }
  assert.deepEqual([...modes].sort(), ['3d', 'audio', 'image', 'video']);
  assert.deepEqual([...kinds].sort(), ['audio', 'image', 'model', 'text', 'video']);
});
test('Each service, model, kind, mode and availability field must be explicitly correct for the selected model', () => {
  for (const row of Object.values(MODELS)) {
    for (const change of [{ available: false }, { available: 'true' }, { available: undefined }, { service: 'custom-provider' }, { service: undefined },
      { model: row.id + '-alias' }, { model: undefined }, { kind: row.kind === 'image' ? 'model' : 'image' }, { kind: undefined }, { mode: row.mode === 'video' ? 'audio' : 'video' }, { mode: undefined }]) {
      assert.equal(canUse(reply({ [row.id]: { ...proof(row), ...change } }), row.id), false, row.id + JSON.stringify(change));
    }
    for (const capabilities of [{ officialGeneration: false }, { officialGeneration: 'true' }, { officialGeneration: undefined }]) assert.equal(canUse(reply({ [row.id]: proof(row) }, capabilities), row.id), false);
    const local = { ...reply({ [row.id]: proof(row) }), mode: 'gamecowork-local' };
    assert.equal(canUse(local, row.id), false);
  }
});
test('Hidden or injected models cannot acquire a capability from a global flag, prototype or another model proof', () => {
  const all = Object.fromEntries(Object.values(MODELS).map(row => [row.id, proof(row)]));
  for (const id of ['material', 'sprite-atlas', 'viggle-motion', 'enhance-video', 'unpublished-model', '__proto__', 'constructor']) {
    const response = reply({ ...all, [id]: { available: true, service: 'codely-official', model: id, kind: 'image', mode: 'image' } }, { localGeneration: true });
    assert.equal(canUse(response, id), false, id);
    assert.equal(Object.hasOwn(gamecoworkGenerationReadiness(response).models, id), false);
  }
  const inherited = Object.create({ frontier_flare: proof(MODELS.frontier_flare) });
  assert.equal(canUse(reply(inherited), 'frontier_flare'), false);
  assert.equal(canUse(reply({}, { localGeneration: true }), 'frontier_flare'), false);
});
test('CPA remains a separate exact ID and upstream mapping in either local or official identity mode', () => {
  const cpa = { available: true, providerId: 'owned-cpa', model: cpaImageUpstreamModel };
  for (const mode of ['gamecowork-local', 'codely-official']) {
    const response = { mode, capabilities: { localGeneration: true, officialGeneration: false, models: { [cpaImageModelId]: cpa } } };
    assert.equal(canUse(response, cpaImageModelId), true);
    for (const id of officialModelIds) assert.equal(canUse({ ...response, capabilities: { ...response.capabilities, models: { [id]: cpa } } }, id), false);
    // Presentation is also strict when called with hand-built readiness values.
    assert.equal(gamecoworkGenerationPresentation({ mode, localGeneration: true, models: { fabricated: cpa } }, 'zh', 'fabricated').blocked, true);
    for (const change of [{ providerId: '../elsewhere' }, { model: 'gpt-image-1' }, { available: 'true' }]) assert.equal(canUse({ ...response, capabilities: { ...response.capabilities, models: { [cpaImageModelId]: { ...cpa, ...change } } } }, cpaImageModelId), false);
  }
});
