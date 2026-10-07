'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {MODELS, validatePayload, quoteFor, referenceSlots, minimalPayload, structuredOutput} = require('../../src/core/binary/out/modules/generation/models/official-audio-text.js');
const contract = require('../fixtures/codely-generator-api-contract.json');
const media = {images: ['http://127.0.0.1:4321/owned/input.png'], videos: ['http://127.0.0.1:4321/owned/input.mp4'], audios: ['http://127.0.0.1:4321/owned/input.wav']};

test('the eight model identities and quote fields are grounded in the original descriptor fixture', () => {
  assert.equal(Object.keys(MODELS).length, 8);
  for (const [id, model] of Object.entries(MODELS)) {
    const original = contract.registry.models.find(row => row.id === id);
    assert.equal(model.name, original.fields.label);
    assert.equal(model.taskType, original.fields.creditTaskType);
    assert.equal(model.mode, original.uiMode);
    assert.deepEqual(model.quoteFields, original.fields.creditParams?.objectOutputKeys || []);
    assert.equal(model.visible, true);
    assert.ok(Object.isFrozen(model));
  }
});

test('source fixture byte ranges still identify every actual maintained original descriptor', () => {
  const ledger = require('../../src/frontend/bundle/codely-generator/source-ledger.json');
  const source = fs.readFileSync(path.resolve(__dirname, '../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js'), 'utf8');
  // Adapter patches shift byte positions: source ledger records both original
  // and current bytes, while the fixture captures each precise builder source.
  assert.ok(ledger && source.includes('sonilo-sfx') && source.includes('doubao-prompt'));
  for (const id of Object.keys(MODELS)) {
    const original = contract.registry.models.find(row => row.id === id);
    assert.match(original.sourceByteRange.sha256, /^[a-f0-9]{64}$/);
    assert.equal(typeof original.fields.build.functionSource, 'string');
    assert.ok(source.includes(original.fields.build.functionSource), `${id} original builder remains verbatim`);
  }
});

for (const id of Object.keys(MODELS)) test(`${id}: smallest original builder payload passes without inventing a service price`, () => {
  const payload = minimalPayload(id, media);
  const original = contract.registry.models.find(row => row.id === id).fields;
  assert.deepEqual(validatePayload(id, payload), payload);
  const quote = quoteFor(id, payload);
  assert.equal(quote.taskType, original.creditTaskType);
  assert.ok(!Object.hasOwn(quote, 'credits'));
  const keys = original.build.objectOutputKeys;
  for (const key of Object.keys(payload)) assert.ok(keys.includes(key), `${id}: ${key} is an actual builder field`);
});

test('duration controls preserve the original half-second rounding and minimum milliseconds', () => {
  assert.deepEqual(quoteFor('eleven-sfx', minimalPayload('eleven-sfx')), {taskType: 'fal_sound_effect', duration: '1'});
  assert.deepEqual(quoteFor('eleven-music', minimalPayload('eleven-music')), {taskType: 'fal_11music', duration: '3'});
  assert.deepEqual(quoteFor('huoshan-music', minimalPayload('huoshan-music')), {taskType: 'huoshan_music', duration: '30'});
  assert.throws(() => validatePayload('sonilo-music', {...minimalPayload('sonilo-music'), durationSeconds: 0.5}));
  assert.throws(() => validatePayload('eleven-sfx', {...minimalPayload('eleven-sfx'), durationSeconds: 0.75}));
  assert.throws(() => validatePayload('eleven-music', {...minimalPayload('eleven-music'), musicLengthMs: 2999}));
  assert.throws(() => validatePayload('huoshan-music', {...minimalPayload('huoshan-music'), duration: 29}));
});

test('all original audio formats are accepted, while invented codecs are rejected', () => {
  for (const id of ['sonilo-sfx', 'sonilo-music']) for (const outputFormat of ['wav', 'mp3', 'aac', 'flac']) assert.equal(validatePayload(id, {...minimalPayload(id), outputFormat}).outputFormat, outputFormat);
  for (const outputFormat of ['mp3_44100_128', 'mp3_44100_192', 'pcm_44100', 'opus_48000_128']) assert.equal(validatePayload('eleven-music', {...minimalPayload('eleven-music'), outputFormat}).outputFormat, outputFormat);
  assert.throws(() => validatePayload('eleven-sfx', {...minimalPayload('eleven-sfx'), outputFormat: 'wav'}));
  assert.throws(() => validatePayload('huoshan-music', {...minimalPayload('huoshan-music'), version: 'v6.0'}));
});

test('original prompt limits count unicode code points and retain one-character TTS', () => {
  assert.ok(validatePayload('eleven-sfx', {...minimalPayload('eleven-sfx'), text: '🌟'.repeat(450)}));
  assert.throws(() => validatePayload('eleven-sfx', {...minimalPayload('eleven-sfx'), text: '🌟'.repeat(451)}));
  assert.throws(() => validatePayload('eleven-music', {...minimalPayload('eleven-music'), prompt: 'a'.repeat(2001)}));
  assert.ok(validatePayload('minimax-tts', {...minimalPayload('minimax-tts'), prompt: '好'}));
  assert.throws(() => validatePayload('minimax-tts', {...minimalPayload('minimax-tts'), prompt: '好'.repeat(5001)}));
});

test('default TTS voice, native choices and returned identities have bounded actual settings', () => {
  assert.equal(minimalPayload('minimax-tts').voiceSetting.voiceId, '');
  for (const voiceId of ['Chinese (Mandarin)_Gentleman', 'Chinese (Mandarin)_Warm_Bestie', 'English_WiseScholar', 'English_captivating_female1', 'own_clone_123']) assert.ok(validatePayload('minimax-tts', {...minimalPayload('minimax-tts'), voiceSetting: {voiceId, speed: 2, vol: 10}}));
  for (const voiceSetting of [{voiceId: '', speed: 2.1, vol: 1}, {voiceId: '', speed: 1, vol: -1}, {voiceId: 'http://bad', speed: 1, vol: 1}, {voiceId: '', speed: 1, vol: 1, token: 'secret'}]) assert.throws(() => validatePayload('minimax-tts', {...minimalPayload('minimax-tts'), voiceSetting}));
});

test('Sonilo video references can omit text but never fabricate a quote duration', () => {
  const payload = {videoUrl: media.videos[0], durationSeconds: 1, outputFormat: 'wav'};
  assert.deepEqual(referenceSlots('sonilo-sfx', payload), [{pointer: '/videoUrl', value: media.videos[0], mediaKinds: ['video']}]);
  assert.ok(validatePayload('sonilo-music', {...payload, durationSeconds: undefined}));
  assert.throws(() => quoteFor('sonilo-music', {...payload, durationSeconds: undefined}), /actual reference duration/);
  assert.throws(() => validatePayload('sonilo-sfx', {...payload, videoUrl: 'file:///some.mp4'}));
});

test('multimodal references preserve each typed pointer and original per-media limits', () => {
  const payload = {styleHint: '', ...media};
  assert.deepEqual(referenceSlots('doubao-prompt', payload), [
    {pointer: '/images/0', value: media.images[0], mediaKinds: ['image']},
    {pointer: '/videos/0', value: media.videos[0], mediaKinds: ['video']},
    {pointer: '/audios/0', value: media.audios[0], mediaKinds: ['audio']},
  ]);
  assert.throws(() => validatePayload('doubao-prompt', {}));
  assert.throws(() => validatePayload('doubao-prompt', {images: Array(11).fill(media.images[0])}));
  assert.throws(() => validatePayload('doubao-prompt', {videos: [media.videos[0], media.videos[0]]}));
  assert.throws(() => validatePayload('doubao-prompt', {audios: ['https://name:password@example.test/source.wav']}));
  assert.deepEqual(referenceSlots('minimax-voice', minimalPayload('minimax-voice', media)), [{pointer: '/audioUrl', value: media.audios[0], mediaKinds: ['audio']}]);
});

test('the original prompt-wand action uses its separate no-media payload', () => {
  for (const target of ['image', '3d', 'audio', 'video']) {
    const payload = {mode: 'optimize', prompt: '一个简洁的蓝色图标', target, lang: ''};
    assert.deepEqual(referenceSlots('doubao-prompt', payload), []);
    assert.deepEqual(quoteFor('doubao-prompt', payload), {taskType: 'doubao_multimodal'});
  }
  assert.ok(validatePayload('doubao-prompt', {mode: 'optimize', prompt: 'wind', target: 'audio', audioKind: 'sfx', lang: 'en'}));
  assert.ok(validatePayload('doubao-prompt', {mode: 'optimize', prompt: 'walk', target: '3d', imageBased: false, lang: ''}));
  assert.throws(() => validatePayload('doubao-prompt', {mode: 'optimize', prompt: 'wind', target: 'image', audioKind: 'sfx'}));
  assert.throws(() => validatePayload('doubao-prompt', {mode: 'optimize', prompt: 'wind', target: 'audio', images: media.images}));
});

test('a successful reply preserves only real text or returned voice identity, never pending preview', () => {
  assert.deepEqual(structuredOutput('doubao-prompt', {status: 'completed', output: {data: {text: '  A blue icon.  '}}}), {text: 'A blue icon.'});
  assert.equal(structuredOutput('doubao-prompt', {status: 'running', text: 'early preview'}), null);
  assert.equal(structuredOutput('doubao-prompt', {status: 'completed', text: 'https://example.test/image.png'}), null);
  assert.deepEqual(structuredOutput('minimax-voice', {data: {status: 'completed', output: {data: {voice_id: 'own_voice_12'}}}}), {voiceId: 'own_voice_12', text: '音色 ID：own_voice_12'});
  assert.equal(structuredOutput('minimax-voice', {status: 'completed', voiceId: ''}), null);
  assert.equal(structuredOutput('minimax-voice', {status: 'completed', voiceId: 'https://example.test'}), null);
  assert.equal(structuredOutput('sonilo-sfx', {status: 'completed', text: 'not audio'}), null);
});

test('all models reject extra auth/provider fields and conflicting identities before a request', () => {
  for (const id of Object.keys(MODELS)) {
    const payload = minimalPayload(id, media);
    for (const extra of [{apiKey: 'should-not-submit'}, {providerId: 'cpa'}, {studioModelId: 'different'}, {studioKind: 'audio'}]) assert.throws(() => validatePayload(id, {...payload, ...extra}), error => error.beforeRequest === true);
    const copy = validatePayload(id, {...payload, studioKind: id, studioModelId: id});
    assert.notEqual(copy, payload);
    if (copy.voiceSetting) assert.notEqual(copy.voiceSetting, payload.voiceSetting);
  }
  assert.throws(() => validatePayload('__proto__', {}));
});
