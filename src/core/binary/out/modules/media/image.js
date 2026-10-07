'use strict';
// OpenEXR scanline storage: https://openexr.com/en/latest/OpenEXRFileLayout.html
// This checks the complete offset table and actual uncompressed/zlib pixel bytes,
// rather than accepting a magic number/header as a verified skybox download.
// Missing descriptive attributes use the official InputFile compatibility defaults:
// https://github.com/AcademySoftwareFoundation/openexr/blob/main/src/lib/OpenEXRCore/validation.c
// Existing attributes still require their exact type, byte length and finite values.
const { inflateSync } = require('node:zlib');
const MAX_FILE = 64 * 1024 * 1024;
const MAX_PIXELS = 64 * 1024 * 1024;
const MAX_DECODED = 512 * 1024 * 1024;
function broken(message) { return new Error('Invalid OpenEXR image: ' + message); }
function check(condition, message) { if (!condition) throw broken(message); }
function inspectExtraImageMedia(value, { mimeHint = '', filename = '' } = {}) {
  if (!Buffer.isBuffer(value) && !(value instanceof Uint8Array)) throw new TypeError('Expected image bytes');
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  const exr = bytes.length >= 4 && bytes.readUInt32LE(0) === 20000630;
  if (!exr) {
    if (/\.exr$/i.test(filename) || /(?:^|\/)x?-?exr(?:$|;)/i.test(mimeHint)) throw broken('declared EXR has no valid magic number');
    return null;
  }
  check(bytes.length >= 16 && bytes.length <= MAX_FILE, 'file size is outside the supported bound');
  const flags = bytes.readUInt32LE(4);
  check((flags & 255) === 2 && (flags & ~0x4ff) === 0, 'only ordinary single-part scanline version 2 is supported');
  const maxName = flags & 0x400 ? 255 : 31;
  let offset = 8;
  const attributes = new Map();
  function text(limit, allowEmpty = false) {
    const start = offset, end = bytes.indexOf(0, start);
    check(end >= start && end - start <= limit && end < bytes.length, 'unterminated or oversized header string');
    check(allowEmpty || end > start, 'empty header string');
    const value = bytes.toString('utf8', start, end);
    check(!value.includes('\ufffd') && !/[\u0000-\u001f\u007f]/.test(value), 'invalid header string');
    offset = end + 1; return value;
  }
  for (let count = 0; ; count++) {
    check(offset < bytes.length && offset < 4 * 1024 * 1024 && count < 256, 'header is missing its bounded terminator');
    if (bytes[offset] === 0) { offset++; break; }
    const name = text(maxName), type = text(maxName);
    check(offset + 4 <= bytes.length, 'missing attribute size');
    const size = bytes.readInt32LE(offset); offset += 4;
    check(size >= 0 && size <= 4 * 1024 * 1024 && offset + size <= bytes.length, 'invalid attribute size');
    check(!attributes.has(name), 'duplicate attribute');
    attributes.set(name, { type, data: bytes.subarray(offset, offset + size) }); offset += size;
  }
  function attribute(name, type, size) {
    const value = attributes.get(name);
    check(value, 'missing ' + name);
    check(value.type === type && (size === undefined || value.data.length === size), 'malformed ' + name);
    return value.data;
  }
  const defaultedAttributes = [];
  function descriptiveAttribute(name, type, size, read, fallback) {
    if (!attributes.has(name)) { defaultedAttributes.push(name); return fallback; }
    return read(attribute(name, type, size));
  }
  function window(name) {
    const data = attribute(name, 'box2i', 16), xMin = data.readInt32LE(0), yMin = data.readInt32LE(4), xMax = data.readInt32LE(8), yMax = data.readInt32LE(12);
    const width = xMax - xMin + 1, height = yMax - yMin + 1;
    check(width > 0 && height > 0 && width <= 16384 && height <= 16384 && width * height <= MAX_PIXELS, name + ' exceeds image bounds');
    return { xMin, yMin, xMax, yMax, width, height };
  }
  const dataWindow = window('dataWindow'); window('displayWindow');
  const compression = attribute('compression', 'compression', 1)[0];
  check([0, 2, 3].includes(compression), 'compression requires an unavailable validated decoder');
  const lineOrder = attribute('lineOrder', 'lineOrder', 1)[0]; check(lineOrder <= 2, 'invalid line order');
  const aspect = descriptiveAttribute('pixelAspectRatio', 'float', 4, data => data.readFloatLE(0), 1); check(Number.isFinite(aspect) && aspect > 0, 'invalid pixel aspect ratio');
  const center = descriptiveAttribute('screenWindowCenter', 'v2f', 8, data => [data.readFloatLE(0), data.readFloatLE(4)], [0, 0]); check(center.every(Number.isFinite), 'invalid screen window center');
  const screenWidth = descriptiveAttribute('screenWindowWidth', 'float', 4, data => data.readFloatLE(0), 1); check(Number.isFinite(screenWidth) && screenWidth > 0, 'invalid screen window width');
  if (attributes.has('type')) check(attribute('type', 'string').toString('utf8') === 'scanlineimage', 'inconsistent image type');
  const channelBytes = attribute('channels', 'chlist');
  const channels = [], channelNames = new Set(); let channelOffset = 0, bytesPerPixel = 0;
  for (;;) {
    check(channelOffset < channelBytes.length, 'unterminated channel list');
    if (channelBytes[channelOffset] === 0) { check(channelOffset + 1 === channelBytes.length, 'trailing channel metadata'); break; }
    const end = channelBytes.indexOf(0, channelOffset);
    check(end > channelOffset && end - channelOffset <= maxName && end + 17 <= channelBytes.length && channels.length < 16, 'malformed channel list');
    const name = channelBytes.toString('utf8', channelOffset, end), info = end + 1;
    const pixelType = channelBytes.readInt32LE(info), linear = channelBytes[info + 4], xSampling = channelBytes.readInt32LE(info + 8), ySampling = channelBytes.readInt32LE(info + 12);
    check(!name.includes('\ufffd') && !channelNames.has(name) && [0, 1, 2].includes(pixelType) && linear <= 1 && channelBytes[info + 5] === 0 && channelBytes[info + 6] === 0 && channelBytes[info + 7] === 0, 'invalid channel description');
    check(xSampling === 1 && ySampling === 1, 'subsampled channels require an unavailable validated decoder');
    channelNames.add(name); channels.push({ name, pixelType }); bytesPerPixel += pixelType === 1 ? 2 : 4; channelOffset = info + 16;
  }
  check(channels.length > 0, 'empty channel list');
  const decodedBytes = dataWindow.width * dataWindow.height * bytesPerPixel;
  check(decodedBytes <= MAX_DECODED, 'decoded image exceeds memory bound');
  const blockLines = compression === 3 ? 16 : 1, chunkCount = Math.ceil(dataWindow.height / blockLines);
  if (attributes.has('chunkCount')) check(attribute('chunkCount', 'int', 4).readInt32LE(0) === chunkCount, 'inconsistent chunk count');
  const tableEnd = offset + chunkCount * 8; check(tableEnd < bytes.length, 'truncated offset table');
  const chunks = [], seenOffsets = new Set();
  for (let index = 0; index < chunkCount; index++) {
    const rawPosition = bytes.readBigUInt64LE(offset + index * 8);
    check(rawPosition <= BigInt(Number.MAX_SAFE_INTEGER), 'unrepresentable chunk offset');
    const position = Number(rawPosition);
    check(position >= tableEnd && position + 8 <= bytes.length && !seenOffsets.has(position), 'invalid or duplicate chunk offset');
    seenOffsets.add(position);
    const y = bytes.readInt32LE(position), size = bytes.readInt32LE(position + 4);
    check(y === dataWindow.yMin + index * blockLines, 'chunk line does not match the offset table');
    const lines = Math.min(blockLines, dataWindow.height - index * blockLines), decodedSize = dataWindow.width * lines * bytesPerPixel;
    check(size > 0 && size <= decodedSize && position + 8 + size <= bytes.length, 'truncated or oversized pixel block');
    const encoded = bytes.subarray(position + 8, position + 8 + size);
    if (compression === 0 || size === decodedSize) check(size === decodedSize, 'uncompressed pixel block has the wrong length');
    else {
      let decoded; try { decoded = inflateSync(encoded, { maxOutputLength: decodedSize, info: true }); } catch { throw broken('pixel block cannot be decompressed'); }
      check(decoded.buffer.length === decodedSize && decoded.engine.bytesWritten === encoded.length, 'compressed pixel block has the wrong length or trailing bytes');
    }
    chunks.push({ start: position, end: position + 8 + size });
  }
  chunks.sort((a, b) => a.start - b.start);
  let cursor = tableEnd;
  for (const chunk of chunks) { check(chunk.start === cursor, 'pixel blocks overlap or leave unowned bytes'); cursor = chunk.end; }
  check(cursor === bytes.length, 'file ends with unowned or missing pixel bytes');
  return { mime: 'image/x-exr', extension: 'exr', kind: 'image', width: dataWindow.width, height: dataWindow.height,
    channels: channels.length, compression: ['none', '', 'zips', 'zip'][compression], decodedBytes, validation: 'complete-scanline-pixel-storage',
    ...(defaultedAttributes.length ? { defaultedAttributes } : {}) };
}
module.exports = { inspectExtraImageMedia };
