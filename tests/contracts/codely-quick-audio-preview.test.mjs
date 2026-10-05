import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {quickAudioPreviewSource} from '../support/codely-quick-audio-preview-source.mjs';
const extracted = await quickAudioPreviewSource();
const api = vm.runInNewContext(extracted.helperScript + ';quickAudioProbe;', {y: {}, f: {}, _fe: 'icon', eb: 'pause-icon', xd: 'play-icon', ST: 'unmute-icon', wT: 'mute-icon'});
const oldClassifier = vm.runInNewContext(extracted.old('lwe') + ';lwe;');
const url = extension => `http://127.0.0.1:49199/owned-result.${extension}`;

test('original source reproduces preview MP3 image misclassification; the actual maintained helper fixes only known audio file extensions', () => {
  assert.equal(oldClassifier(url('mp3'), 'previewUrl', 'audio'), 'image');
  assert.equal(oldClassifier(url('opus'), 'thumbnailUrl', 'audio'), 'image');
  for (const extension of ['wav', 'mp3', 'aac', 'flac', 'ogg', 'm4a', 'opus']) for (const key of ['previewUrl', 'preview_url', 'thumbnailUrl', 'imageUrl', 'url']) {
    assert.equal(api.lwe(url(extension), key, 'audio'), 'audio', key + '.' + extension);
    assert.equal(api.lwe(url(extension.toUpperCase()) + '?download=1#part', key, 'image'), 'audio');
  }
  assert.equal(api.lwe(url('png'), 'previewUrl', 'audio'), 'image');
  assert.equal(api.lwe('http://127.0.0.1:49199/unknown', 'previewUrl', 'audio'), 'image');
  assert.equal(api.lwe(url('png') + '?name=audio.mp3', 'previewUrl', 'audio'), 'image', 'A query string cannot change the real file extension');
  assert.equal(api.lwe(url('mp4'), 'videoUrl', 'video'), oldClassifier(url('mp4'), 'videoUrl', 'video'));
  assert.equal(api.lwe(url('exr'), 'previewUrl', 'image'), 'file');
});

test('the original traversal, output picker, completion rule and audio renderer remain exact original bytes', () => {
  for (const symbol of ['_N', 'wN', 'cwe', 'uwe', 'k5', '_g', 'ewe', 'wZ', 'xZ', 'fE']) assert.equal(extracted.current(symbol), extracted.old(symbol), symbol + ' is reused without replacing the flow');
  assert.ok(extracted.current('xZ').includes('f.jsx("audio",{ref:n,src:t.url,preload:"metadata"'));
  assert.ok(extracted.current('xZ').includes('p.paused?p.play().catch(()=>{}):p.pause()'));
  assert.ok(extracted.current('wZ').includes('t.type==="audio"?f.jsx(xZ'));
});

test('original k5/_N/_g preserve clone preview-only result, deduplicate URLs and select the original audio component without requiring voiceId', () => {
  const address = url('mp3'), reply = {status: 'completed', output: {data: {previewUrl: address, audioUrl: address}}}, model = {id: 'minimax-voice', kind: 'voice-clone', mode: 'audio'};
  const result = api.k5('owned-clone-task', reply, model);
  assert.equal(api.ewe(reply.status, api.wN(reply), 0), 'succeeded');
  assert.equal(api.wN(reply), address); assert.equal(result.previewUrl, address); assert.equal(result.assets.length, 1);
  assert.equal(result.assets[0].key, 'previewUrl'); assert.equal(result.assets[0].type, 'audio'); assert.equal(api._g(result).type, 'audio');
  assert.equal(Object.hasOwn(result, 'voiceId'), false);
  assert.equal(api.ewe('running', address, 0), 'pending', 'Existing pending/completed policy remains original');
  const inputs = api._N({output: {data: {previewUrl: address}}, input: {url: url('wav')}, param: {url: url('flac')}, originalUrl: url('aac')}, 'result', [], new Set(), 'audio');
  assert.equal(inputs.length, 1); assert.equal(inputs[0].type, 'audio');
});

test('the source ledger and importer declare exactly the same limited reversible classification patch', () => {
  const ledger = JSON.parse(fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/source-ledger.json', import.meta.url), 'utf8'));
  const entry = ledger.files.find(row => row.path === 'assets/index-DZWJHC3S.js'), patch = entry.patches.find(row => row.reason.startsWith('Classify recognized audio file extensions'));
  assert.ok(patch); assert.equal(patch.before, 'function lwe(t,e="",n=""){const i=');
  assert.ok(patch.after.endsWith(';const i=')); assert.ok(!patch.after.includes('voiceId'));
  const importer = fs.readFileSync(new URL('../../tools/import-codely-generator.mjs', import.meta.url), 'utf8');
  assert.ok(importer.includes(patch.reason)); assert.ok(importer.includes('wav|mp3|aac|flac|ogg|m4a|opus'));
});
