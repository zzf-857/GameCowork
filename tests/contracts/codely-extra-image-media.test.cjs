const test = require('node:test');
const assert = require('node:assert/strict');
const { deflateSync } = require('node:zlib');
const { inspectExtraImageMedia } = require('../../src/core/binary/out/gamecowork-image-media.js');
function uint(value) { const buffer = Buffer.alloc(4); buffer.writeInt32LE(value); return buffer; }
function float(value) { const buffer = Buffer.alloc(4); buffer.writeFloatLE(value); return buffer; }
function attribute(name, type, data) { return Buffer.concat([Buffer.from(name + '\0' + type + '\0'), uint(data.length), data]); }
function channel(name, pixelType = 1) { return Buffer.concat([Buffer.from(name + '\0'), uint(pixelType), Buffer.alloc(4), uint(1), uint(1)]); }
function fixture({ width = 4, height = 3, compression = 0, channels = 3, fill = 0, yMin = 0, pixelType = 1 } = {}) {
  const head = Buffer.alloc(8); head.writeUInt32LE(20000630); head.writeUInt32LE(2, 4);
  const window = Buffer.concat([uint(0), uint(yMin), uint(width - 1), uint(yMin + height - 1)]);
  const header = Buffer.concat([head,
    attribute('channels', 'chlist', Buffer.concat(Array.from({ length: channels }, (_, i) => channel(String.fromCharCode(65 + i), pixelType)).concat([Buffer.from([0])]))),
    attribute('compression', 'compression', Buffer.from([compression])), attribute('dataWindow', 'box2i', window), attribute('displayWindow', 'box2i', window),
    attribute('lineOrder', 'lineOrder', Buffer.from([0])), attribute('pixelAspectRatio', 'float', float(1)),
    attribute('screenWindowCenter', 'v2f', Buffer.concat([float(0), float(0)])), attribute('screenWindowWidth', 'float', float(1)), Buffer.from([0]),
  ]);
  const blockLines = compression === 3 ? 16 : 1, count = Math.ceil(height / blockLines), table = Buffer.alloc(count * 8), chunks = [];
  let offset = header.length + table.length;
  for (let index = 0; index < count; index++) {
    const raw = Buffer.alloc(width * Math.min(blockLines, height - index * blockLines) * channels * (pixelType === 1 ? 2 : 4), fill);
    // Constant zero half pixels are already identical after EXR ZIP's even/odd
    // split. Its byte predictor encodes every byte after the first as 128.
    const filtered = Buffer.from(raw); if (fill === 0) filtered.fill(128, 1);
    const zipped = compression ? deflateSync(filtered) : raw, encoded = zipped.length < raw.length ? zipped : raw;
    const chunk = Buffer.concat([uint(yMin + index * blockLines), uint(encoded.length), encoded]);
    table.writeBigUInt64LE(BigInt(offset), index * 8); chunks.push(chunk); offset += chunk.length;
  }
  return { bytes: Buffer.concat([header, table, ...chunks]), tableOffset: header.length, chunkCount: count };
}
test('Complete ordinary single-part EXR reads all real uncompressed scanline pixel blocks', () => {
  const { bytes } = fixture({ width: 7, height: 5, yMin: -2 });
  const info = inspectExtraImageMedia(bytes, { filename: 'actual-skybox.exr', mimeHint: 'application/octet-stream' });
  assert.deepEqual(info, { mime: 'image/x-exr', extension: 'exr', kind: 'image', width: 7, height: 5, channels: 3, compression: 'none', decodedBytes: 210, validation: 'complete-scanline-pixel-storage' });
});
test('ZIPS and ZIP require the entire zlib stream and exact decoded pixel count, including the last partial block', () => {
  for (const compression of [2, 3]) {
    const { bytes, tableOffset } = fixture({ width: 128, height: 19, compression });
    const info = inspectExtraImageMedia(bytes); assert.equal(info.decodedBytes, 128 * 19 * 6); assert.equal(info.compression, compression === 2 ? 'zips' : 'zip');
    const corrupt = Buffer.from(bytes), first = Number(corrupt.readBigUInt64LE(tableOffset)); corrupt[first + 10] ^= 0xff;
    assert.throws(() => inspectExtraImageMedia(corrupt), /decompressed|length/);
  }
});
test('EXR header or magic alone cannot become a verified output', () => {
  const { bytes, tableOffset } = fixture();
  for (const truncated of [bytes.subarray(0, 4), bytes.subarray(0, 8), bytes.subarray(0, tableOffset), bytes.subarray(0, bytes.length - 1)]) assert.throws(() => inspectExtraImageMedia(truncated), /Invalid OpenEXR/);
  const appended = Buffer.concat([bytes, Buffer.from('fake trailing executable')]); assert.throws(() => inspectExtraImageMedia(appended), /unowned/);
});
test('Offset tables reject duplicate, overlapping, outside, unsafe and wrong-line pixel storage', () => {
  const { bytes, tableOffset } = fixture();
  const variants = [];
  let copy = Buffer.from(bytes); copy.writeBigUInt64LE(copy.readBigUInt64LE(tableOffset), tableOffset + 8); variants.push(copy);
  copy = Buffer.from(bytes); copy.writeBigUInt64LE(BigInt(tableOffset), tableOffset); variants.push(copy);
  copy = Buffer.from(bytes); copy.writeBigUInt64LE(2n ** 63n, tableOffset); variants.push(copy);
  copy = Buffer.from(bytes); copy.writeInt32LE(123, Number(copy.readBigUInt64LE(tableOffset))); variants.push(copy);
  copy = Buffer.from(bytes); copy.writeInt32LE(999999, Number(copy.readBigUInt64LE(tableOffset)) + 4); variants.push(copy);
  for (const variant of variants) assert.throws(() => inspectExtraImageMedia(variant), /offset|line|pixel block/);
});
test('Size bounds are derived from complete metadata before decompression or allocating a decoded image', () => {
  const { bytes } = fixture();
  const wide = Buffer.from(bytes), name = wide.indexOf(Buffer.from('dataWindow\0box2i\0')), start = name + Buffer.byteLength('dataWindow\0box2i\0') + 4;
  wide.writeInt32LE(200000, start + 8); assert.throws(() => inspectExtraImageMedia(wide), /bounds/);
  const huge = Buffer.from(bytes); huge.writeInt32LE(16383, start + 8); huge.writeInt32LE(16383, start + 12); assert.throws(() => inspectExtraImageMedia(huge), /bounds/);
  const sampled = Buffer.from(bytes), channel = sampled.indexOf(Buffer.from('A\0')); sampled.writeInt32LE(2, channel + 10); assert.throws(() => inspectExtraImageMedia(sampled), /subsampled/);
});
test('Recognized unsupported EXR layouts remain explicit errors instead of false verification', () => {
  const { bytes } = fixture();
  for (const flags of [0x202, 0x802, 0x1002, 0x800002]) { const copy = Buffer.from(bytes); copy.writeUInt32LE(flags, 4); assert.throws(() => inspectExtraImageMedia(copy), /scanline/); }
  for (const compression of [1, 4, 8]) assert.throws(() => inspectExtraImageMedia(fixture({ compression }).bytes), /compression/);
  assert.throws(() => inspectExtraImageMedia(Buffer.from('not EXR'), { filename: 'official.exr' }), /magic/);
  assert.equal(inspectExtraImageMedia(Buffer.from('ordinary unknown file')), null);
});
