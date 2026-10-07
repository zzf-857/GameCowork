'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {inspectAudioMedia} = require('../../src/core/binary/out/modules/media/audio.js');
const fixture = require('../fixtures/codely-audio-media.json');
const source = name => Buffer.from(fixture.files[name].base64, 'base64');

for (const [name, expected] of Object.entries({wav: ['audio/wav', 'wav', 'pcm'], mp3: ['audio/mpeg', 'mp3', 'mp3'], flac: ['audio/flac', 'flac', 'flac'], aac: ['audio/aac', 'aac', 'aac'], opus: ['audio/ogg', 'opus', 'opus'], m4a: ['audio/mp4', 'm4a', 'aac']})) {
  test(`real self-generated ${name} container has complete audio frames and actual duration`, () => {
    const bytes = source(name), record = fixture.files[name];
    assert.equal(bytes.length, record.byteLength);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
    const media = inspectAudioMedia(bytes, {mimeHint: 'application/octet-stream', filename: 'wrong.png'});
    assert.equal(media.mime, expected[0]); assert.equal(media.extension, expected[1]); assert.equal(media.codec, expected[2]);
    assert.equal(media.kind, 'audio'); assert.equal(media.containerValidated, true); assert.equal(media.codecDecoded, false);
    assert.equal(media.channels, 1); assert.equal(media.sampleRate, 48000);
    assert.ok(media.durationSeconds >= 0.039 && media.durationSeconds < 0.1);
    assert.ok(media.sampleCount > 0);
  });
  test(`${name} cannot pass with a truncated final frame or arbitrary trailing bytes`, () => {
    const bytes = source(name);
    for (const value of [bytes.subarray(0, bytes.length - 1), bytes.subarray(0, Math.floor(bytes.length / 2)), Buffer.concat([bytes, Buffer.from('UNTRUSTED')])]) assert.throws(() => inspectAudioMedia(value), /Invalid\/incomplete audio/);
  });
}

test('a MIME or filename never turns arbitrary, image or model bytes into audio', () => {
  for (const bytes of [Buffer.from('not audio, despite the extension'), Buffer.from([137,80,78,71,13,10,26,10]), Buffer.from('glTFv2fake')]) assert.equal(inspectAudioMedia(bytes, {mimeHint: 'audio/mp3', filename: 'sound.mp3'}), null);
  assert.equal(inspectAudioMedia(Buffer.alloc(0)), null);
  assert.equal(inspectAudioMedia(new Uint8Array([1,2,3,4])), null);
  assert.throws(() => inspectAudioMedia('data'), /bytes are required/);
  assert.throws(() => inspectAudioMedia(Buffer.alloc(64 * 1024 * 1024 + 1)), /64 MiB/);
});

test('WAV validates rate, alignment, encoding and actual PCM data rather than only RIFF magic', () => {
  const original = source('wav'), fmt = original.indexOf(Buffer.from('fmt ')), data = original.indexOf(Buffer.from('data'));
  for (const mutate of [
    value => value.writeUInt32LE(1, fmt + 8 + 8),
    value => value.writeUInt16LE(3, fmt + 8 + 12),
    value => value.writeUInt16LE(85, fmt + 8),
    value => value.writeUInt32LE(value.readUInt32LE(data + 4) - 1, data + 4),
  ]) { const copy = Buffer.from(original); mutate(copy); assert.throws(() => inspectAudioMedia(copy)); }
  const fake = Buffer.alloc(44); fake.write('RIFF'); fake.writeUInt32LE(36, 4); fake.write('WAVE', 8);
  assert.throws(() => inspectAudioMedia(fake));
});

function id3Offset(value) { return value.toString('ascii', 0, 3) === 'ID3' ? 10 + value[6] * 2097152 + value[7] * 16384 + value[8] * 128 + value[9] : 0; }
test('MP3 validates bitrate, frame sizes, side information and missing reservoir references', () => {
  const original = source('mp3'), frame = id3Offset(original);
  for (const mutate of [
    value => { value[frame + 2] &= 15; },
    value => { value[frame + 1] = (value[frame + 1] & 0xe7) | 8; },
    value => { value[frame + 4] |= 128; },
    value => { value[frame + 1] &= 0xfe; },
  ]) { const copy = Buffer.from(original); mutate(copy); assert.throws(() => inspectAudioMedia(copy)); }
  if (frame) { const value = Buffer.from(original); value[6] = 128; assert.throws(() => inspectAudioMedia(value), /ID3/); }
  assert.throws(() => inspectAudioMedia(Buffer.from('ID3\x04\x00\x00\x00\x00\x00\x00')), /audio/);
});

test('AAC ADTS validates all frame lengths and codec/rate/channel configuration', () => {
  const original = source('aac');
  for (const mutate of [
    value => { value[2] |= 0x3c; },
    value => { value[2] &= 0xfe; value[3] &= 0x3f; },
    value => { value[3] |= 3; value[4] = 255; value[5] |= 224; },
    value => { value[6] |= 1; },
  ]) { const copy = Buffer.from(original); mutate(copy); assert.throws(() => inspectAudioMedia(copy)); }
});

function flacFrames(bytes) { let offset = 4, last = false; while (!last) { last = !!(bytes[offset] & 128); offset += 4 + bytes.readUIntBE(offset + 1, 3); } return offset; }
test('FLAC checks stream metadata, predictor/subframe layout and each actual frame CRC', () => {
  const original = source('flac'), frame = flacFrames(original);
  for (const mutate of [
    value => value.writeUInt16BE(0, 8),
    value => { value[frame + 1] |= 2; },
    value => { value[frame + 3] |= 1; },
    value => { value[value.length - 3] ^= 1; },
    value => { value[25] ^= 1; },
  ]) { const copy = Buffer.from(original); mutate(copy); assert.throws(() => inspectAudioMedia(copy)); }
});

function fixOggPageCrc(bytes, offset) {
  const count = bytes[offset + 26]; let end = offset + 27 + count;
  for (let n = 0; n < count; n++) end += bytes[offset + 27 + n];
  bytes.writeUInt32LE(0, offset + 22); let crc = 0;
  for (let i = offset; i < end; i++) { crc ^= bytes[i] << 24; for (let n = 0; n < 8; n++) crc = crc & 0x80000000 ? (crc << 1) ^ 0x04c11db7 : crc << 1; }
  bytes.writeUInt32LE(crc >>> 0, offset + 22);
}
function oggPages(bytes) { const pages = []; let offset = 0; while (offset < bytes.length) { pages.push(offset); let next = offset + 27 + bytes[offset + 26]; for (let n = 0; n < bytes[offset + 26]; n++) next += bytes[offset + 27 + n]; offset = next; } return pages; }
test('Ogg Opus validates page CRC, serial/sequence, packets and EOS even with recomputed CRC', () => {
  const original = source('opus'), pages = oggPages(original), last = pages.at(-1);
  let value = Buffer.from(original); value[value.length - 1] ^= 1; assert.throws(() => inspectAudioMedia(value), /CRC/);
  for (const [at, mutate] of [
    [last, row => { row[last + 5] &= 0xfb; }],
    [last, row => { row.writeUInt32LE(999, last + 18); }],
    [last, row => { row.writeBigUInt64LE(99999999n, last + 6); }],
    [0, row => { row[27 + row[26] + 18] = 1; }],
    [last, row => { const packet = last + 27 + row[last + 26]; row[packet] = 3; row[packet + 1] = 0; }],
  ]) { value = Buffer.from(original); mutate(value); fixOggPageCrc(value, at); assert.throws(() => inspectAudioMedia(value)); }
});

function findBox(bytes, type) { const position = bytes.indexOf(Buffer.from(type)); assert.ok(position >= 4, `${type} fixture box`); return position - 4; }
test('MP4 audio validates sound handler, AAC description, real sample offsets and timing', () => {
  const original = source('m4a'), stco = findBox(original, 'stco'), stts = findBox(original, 'stts'), stsz = findBox(original, 'stsz'), hdlr = findBox(original, 'hdlr'), mp4a = findBox(original, 'mp4a');
  for (const mutate of [
    value => value.writeUInt32BE(value.length + 100, stco + 16),
    value => value.writeUInt32BE(999999, stsz + 16),
    value => value.writeUInt32BE(0, stts + 20),
    value => value.write('urlx', mp4a + 4),
  ]) { const copy = Buffer.from(original); mutate(copy); assert.throws(() => inspectAudioMedia(copy)); }
  const video = Buffer.from(original); video.write('vide', hdlr + 16);
  assert.equal(inspectAudioMedia(video, {mimeHint: 'audio/mp4', filename: 'music.m4a'}), null, 'video handler remains video even when falsely labeled audio');
  const fake = Buffer.from('00000014667479704d344120000000004d344120000000086d6f6f760000000c6d64617400000000', 'hex');
  assert.equal(inspectAudioMedia(fake), null, 'moov + mdat with no sound track does not prove audio');
});
