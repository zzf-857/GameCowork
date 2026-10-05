'use strict';
// Bounded container/frame validation, not a general-purpose codec decoder.
// No subprocess, network, browser MIME claim or filename grants media trust.
// FLAC frame rules: https://www.rfc-editor.org/rfc/rfc9639.html
// Opus packet/container rules: https://www.rfc-editor.org/rfc/rfc6716.html
// and https://www.rfc-editor.org/rfc/rfc7845.html .
const MAX_BYTES = 64 * 1024 * 1024;
const MAX_FRAMES = 1000000;
const MAX_SAMPLES = 192000 * 3600;
const fail = message => { throw new Error(`Invalid/incomplete audio: ${message}`); };
const ascii = (bytes, start, end) => bytes.toString('ascii', start, end);
function safeSamples(value) { if (!Number.isSafeInteger(value) || value < 1 || value > MAX_SAMPLES) fail('sample count budget'); return value; }
function result(mime, extension, detail = {}) { return {mime, extension, kind: 'audio', containerValidated: true, codecDecoded: false, ...detail}; }

function wav(bytes) {
  if (bytes.length < 44 || ascii(bytes, 8, 12) !== 'WAVE' || bytes.readUInt32LE(4) + 8 !== bytes.length) fail('WAVE RIFF bounds');
  let offset = 12, format, dataBytes = 0, dataChunks = 0;
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) fail('truncated WAVE chunk');
    const id = ascii(bytes, offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8, end = start + size;
    if (end > bytes.length || end + (size & 1) > bytes.length) fail('WAVE chunk bounds');
    if (id === 'fmt ') {
      if (format || size < 16) fail('duplicate/short WAVE format');
      let code = bytes.readUInt16LE(start);
      const channels = bytes.readUInt16LE(start + 2), sampleRate = bytes.readUInt32LE(start + 4), byteRate = bytes.readUInt32LE(start + 8), blockAlign = bytes.readUInt16LE(start + 12), bits = bytes.readUInt16LE(start + 14);
      if (code === 0xfffe) {
        if (size < 40 || bytes.readUInt16LE(start + 16) < 22 || bytes.readUInt16LE(start + 18) > bits) fail('WAVE extensible format');
        const tail = Buffer.from('00001000800000aa00389b71', 'hex');
        if (!bytes.subarray(start + 28, start + 40).equals(tail)) fail('unsupported WAVE subtype');
        code = bytes.readUInt32LE(start + 24);
      }
      if (![1, 3].includes(code) || channels < 1 || channels > 32 || sampleRate < 1000 || sampleRate > 192000 || ![8, 16, 24, 32, 64].includes(bits) || code === 3 && ![32, 64].includes(bits)) fail('unsupported WAVE encoding');
      if (blockAlign !== channels * bits / 8 || byteRate !== sampleRate * blockAlign) fail('WAVE frame/byte rate mismatch');
      format = {channels, sampleRate, bits, blockAlign, codec: code === 1 ? 'pcm' : 'float'};
    } else if (id === 'data') {
      if (!format || !size || size % format.blockAlign) fail('WAVE PCM frame bounds');
      dataBytes += size; dataChunks++;
    }
    offset = end + (size & 1);
  }
  if (!format || !dataChunks || offset !== bytes.length) fail('missing WAVE frames');
  const sampleCount = safeSamples(dataBytes / format.blockAlign);
  return result('audio/wav', 'wav', {codec: format.codec, channels: format.channels, sampleRate: format.sampleRate, sampleCount, durationSeconds: sampleCount / format.sampleRate});
}

function id3End(bytes) {
  if (ascii(bytes, 0, 3) !== 'ID3') return 0;
  if (bytes.length < 10 || ![2, 3, 4].includes(bytes[3]) || bytes[4] === 255 || [6, 7, 8, 9].some(i => bytes[i] & 128)) fail('ID3 header');
  const size = bytes[6] * 2097152 + bytes[7] * 16384 + bytes[8] * 128 + bytes[9];
  const footer = bytes[3] === 4 && bytes[5] & 16 ? 10 : 0;
  const end = 10 + size + footer;
  if (end > bytes.length || footer && ascii(bytes, end - 10, end - 7) !== '3DI') fail('truncated ID3');
  return end;
}
class Bits {
  constructor(bytes, start = 0, end = bytes.length) { this.bytes = bytes; this.bit = start * 8; this.end = end * 8; }
  read(count) {
    if (!Number.isInteger(count) || count < 0 || count > 32 || this.bit + count > this.end) fail('truncated bitstream');
    let value = 0;
    for (let n = 0; n < count; n++, this.bit++) value = value * 2 + ((this.bytes[this.bit >>> 3] >>> (7 - (this.bit & 7))) & 1);
    return value;
  }
  skip(count) { if (!Number.isSafeInteger(count) || count < 0 || this.bit + count > this.end) fail('bitstream bounds'); this.bit += count; }
  unary() { let zeros = 0; while (this.read(1) === 0) { if (++zeros > MAX_BYTES * 8) fail('unary budget'); } return zeros; }
  alignZero() { while (this.bit & 7) if (this.read(1)) fail('nonzero alignment padding'); }
  get offset() { if (this.bit & 7) fail('unaligned stream'); return this.bit / 8; }
}
function mp3(bytes, start) {
  let offset = start, end = bytes.length, frames = 0, sampleCount = 0, stream, reservoir = 0;
  if (end - start >= 128 && ascii(bytes, end - 128, end - 125) === 'TAG') end -= 128;
  const bitrates1 = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320];
  const bitrates2 = [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160];
  while (offset < end) {
    if (++frames > MAX_FRAMES || offset + 4 > end) fail('truncated MP3 frame');
    const head = bytes.readUInt32BE(offset), version = (head >>> 19) & 3, layer = (head >>> 17) & 3, crcBytes = head & 0x10000 ? 0 : 2, bitrateIndex = (head >>> 12) & 15, rateIndex = (head >>> 10) & 3;
    if ((head >>> 21) !== 0x7ff || version === 1 || layer !== 1 || bitrateIndex === 0 || bitrateIndex === 15 || rateIndex === 3 || (head & 3) === 2) fail('MP3 layer III header');
    const sampleRate = [44100,48000,32000][rateIndex] / (version === 3 ? 1 : version === 2 ? 2 : 4), channels = ((head >>> 6) & 3) === 3 ? 1 : 2;
    const frameLength = Math.floor((version === 3 ? 144000 : 72000) * (version === 3 ? bitrates1 : bitrates2)[bitrateIndex] / sampleRate) + ((head >>> 9) & 1);
    const sideLength = version === 3 ? channels === 1 ? 17 : 32 : channels === 1 ? 9 : 17;
    if (frameLength <= 4 + crcBytes + sideLength || offset + frameLength > end) fail('MP3 frame length');
    if (crcBytes) {
      const protectedData = Buffer.concat([bytes.subarray(offset + 2, offset + 4), bytes.subarray(offset + 6, offset + 6 + sideLength)]);
      if (crc16(protectedData, 0, protectedData.length, 0xffff) !== bytes.readUInt16BE(offset + 4)) fail('MP3 protected header/side-info CRC');
    }
    if (stream && (stream.sampleRate !== sampleRate || stream.channels !== channels || stream.version !== version)) fail('MP3 stream changes');
    stream ||= {sampleRate, channels, version};
    const side = new Bits(bytes, offset + 4 + crcBytes, offset + 4 + crcBytes + sideLength);
    const mainDataBegin = side.read(version === 3 ? 9 : 8);
    if (mainDataBegin > reservoir) fail('MP3 bit reservoir references missing frames');
    side.skip(version === 3 ? channels === 1 ? 5 : 3 : channels === 1 ? 1 : 2);
    if (version === 3) side.skip(channels * 4);
    let partBits = 0;
    for (let granule = 0; granule < (version === 3 ? 2 : 1); granule++) for (let channel = 0; channel < channels; channel++) {
      partBits += side.read(12);
      if (side.read(9) > 288) fail('MP3 Huffman region bounds');
      side.skip(8 + (version === 3 ? 4 : 9));
      const switched = side.read(1);
      if (switched) {
        if (!side.read(2)) fail('MP3 switched block type');
        side.skip(1);
        for (let n = 0; n < 2; n++) if ([4,14].includes(side.read(5))) fail('MP3 reserved Huffman table');
        side.skip(9);
      } else {
        for (let n = 0; n < 3; n++) if ([4,14].includes(side.read(5))) fail('MP3 reserved Huffman table');
        const region0 = side.read(4), region1 = side.read(3);
        if (region0 + region1 > 20) fail('MP3 Huffman region layout');
      }
      side.skip((version === 3 ? 1 : 0) + 2);
    }
    const payload = frameLength - 4 - crcBytes - sideLength;
    if (partBits > (mainDataBegin + payload) * 8 || side.bit !== side.end) fail('MP3 main data bounds');
    reservoir = Math.min(version === 3 ? 511 : 255, reservoir + payload);
    sampleCount += version === 3 ? 1152 : 576;
    offset += frameLength;
  }
  if (!stream || !frames || offset !== end) fail('missing MP3 audio frames');
  safeSamples(sampleCount);
  return result('audio/mpeg', 'mp3', {codec: 'mp3', channels: stream.channels, sampleRate: stream.sampleRate, frameCount: frames, sampleCount, durationSeconds: sampleCount / stream.sampleRate});
}

function aac(bytes, start) {
  const rates = [96000,88200,64000,48000,44100,32000,24000,22050,16000,12000,11025,8000,7350];
  let offset = start, frames = 0, stream;
  while (offset < bytes.length) {
    if (++frames > MAX_FRAMES || offset + 7 > bytes.length || bytes[offset] !== 255 || (bytes[offset + 1] & 0xf6) !== 0xf0) fail('ADTS sync/layer');
    const protectionAbsent = bytes[offset + 1] & 1, profile = (bytes[offset + 2] >>> 6) + 1, index = (bytes[offset + 2] >>> 2) & 15;
    const channels = ((bytes[offset + 2] & 1) << 2) | (bytes[offset + 3] >>> 6), sampleRate = rates[index], blocks = bytes[offset + 6] & 3;
    const length = ((bytes[offset + 3] & 3) << 11) | (bytes[offset + 4] << 3) | (bytes[offset + 5] >>> 5), header = protectionAbsent ? 7 : 9;
    if (!sampleRate || !channels || channels > 7 || blocks || length <= header || offset + length > bytes.length) fail('ADTS frame bounds/configuration');
    if (stream && (stream.sampleRate !== sampleRate || stream.channels !== channels || stream.profile !== profile)) fail('ADTS stream changes');
    stream ||= {sampleRate, channels, profile};
    offset += length;
  }
  if (!stream || !frames || offset !== bytes.length) fail('missing ADTS frames');
  const sampleCount = safeSamples(frames * 1024);
  return result('audio/aac', 'aac', {codec: 'aac', channels: stream.channels, sampleRate: stream.sampleRate, frameCount: frames, sampleCount, durationSeconds: sampleCount / stream.sampleRate});
}

function crc8(bytes, start, end) { let value = 0; for (let i = start; i < end; i++) { value ^= bytes[i]; for (let n = 0; n < 8; n++) value = value & 128 ? ((value << 1) ^ 7) & 255 : value << 1; } return value; }
function crc16(bytes, start, end, initial = 0) { let value = initial; for (let i = start; i < end; i++) { value ^= bytes[i] << 8; for (let n = 0; n < 8; n++) value = value & 32768 ? ((value << 1) ^ 0x8005) & 65535 : value << 1; } return value; }
function flacInteger(bytes, cursor) {
  const first = bytes[cursor.offset++];
  if (first < 128) return first;
  let count = 0; for (let mask = 128; first & mask; mask >>>= 1) count++;
  if (count < 2 || count > 7) fail('FLAC UTF-8 frame/sample number');
  let value = first & ((1 << (7 - count)) - 1);
  for (let i = 1; i < count; i++) { const next = bytes[cursor.offset++]; if (next === undefined || (next & 192) !== 128) fail('FLAC UTF-8 continuation'); value = value * 64 + (next & 63); }
  if (!Number.isSafeInteger(value) || value > MAX_SAMPLES || value < ({2:128,3:2048,4:65536,5:2097152,6:67108864,7:2147483648})[count]) fail('FLAC frame/sample number budget/overlong code');
  return value;
}
function flacSubframe(bits, blockSize, bitDepth) {
  if (bits.read(1)) fail('FLAC subframe padding');
  const type = bits.read(6), wasted = bits.read(1);
  if (wasted) bitDepth -= bits.unary() + 1;
  if (bitDepth < 1 || bitDepth > 33) fail('FLAC wasted-bit bounds');
  if (type === 0) { bits.skip(bitDepth); return; }
  if (type === 1) { bits.skip(blockSize * bitDepth); return; }
  const order = type >= 8 && type <= 12 ? type - 8 : type >= 32 ? (type & 31) + 1 : -1;
  if (order < 0 || order > blockSize) fail('FLAC reserved subframe/predictor');
  bits.skip(order * bitDepth);
  if (type >= 32) { const precision = bits.read(4) + 1; if (precision === 16 || bits.read(5) >= 16) fail('FLAC LPC precision/negative shift'); bits.skip(order * precision); }
  const method = bits.read(2), partitionOrder = bits.read(4), partitions = 2 ** partitionOrder;
  if (method > 1 || blockSize % partitions || blockSize / partitions <= order) fail('FLAC residual partitions');
  const width = method === 0 ? 4 : 5, escape = (1 << width) - 1;
  for (let n = 0; n < partitions; n++) {
    const count = blockSize / partitions - (n === 0 ? order : 0), parameter = bits.read(width);
    if (parameter === escape) { const raw = bits.read(5); bits.skip(count * raw); }
    else for (let sample = 0; sample < count; sample++) { bits.unary(); bits.skip(parameter); }
  }
}
function flac(bytes) {
  let offset = 4, stream, last = false, metadata = 0;
  while (!last) {
    if (++metadata > 128 || offset + 4 > bytes.length) fail('FLAC metadata bounds');
    const type = bytes[offset] & 127, size = bytes.readUIntBE(offset + 1, 3), start = offset + 4;
    last = !!(bytes[offset] & 128);
    if (type === 127 || start + size > bytes.length) fail('FLAC metadata type/size');
    if (metadata === 1 && type !== 0 || type === 0 && stream) fail('FLAC first/duplicate STREAMINFO');
    if (type === 0) {
      if (size !== 34) fail('FLAC STREAMINFO length');
      const packed = bytes.readBigUInt64BE(start + 10), sampleRate = Number(packed >> 44n), channels = Number((packed >> 41n) & 7n) + 1, bitDepth = Number((packed >> 36n) & 31n) + 1, totalSamples = Number(packed & 0xfffffffffn);
      const minBlock = bytes.readUInt16BE(start), maxBlock = bytes.readUInt16BE(start + 2);
      if (sampleRate < 1000 || sampleRate > 192000 || bitDepth < 4 || bitDepth > 32 || minBlock < 16 || maxBlock < minBlock || totalSamples > MAX_SAMPLES) fail('FLAC stream configuration');
      stream = {sampleRate, channels, bitDepth, totalSamples, minBlock, maxBlock};
    }
    offset = start + size;
  }
  if (!stream || offset === bytes.length) fail('missing FLAC frames');
  let frames = 0, sampleCount = 0, strategy;
  while (offset < bytes.length) {
    const start = offset;
    if (++frames > MAX_FRAMES || offset + 6 > bytes.length || bytes[offset] !== 255 || (bytes[offset + 1] & 0xfe) !== 0xf8 || bytes[offset + 3] & 1) fail('FLAC frame header');
    const variable = bytes[offset + 1] & 1, blockCode = bytes[offset + 2] >>> 4, rateCode = bytes[offset + 2] & 15, channelAssignment = bytes[offset + 3] >>> 4, depthCode = (bytes[offset + 3] >>> 1) & 7;
    if (strategy !== undefined && strategy !== variable) fail('FLAC blocking strategy changes'); strategy = variable;
    const cursor = {offset: offset + 4}, frameNumber = flacInteger(bytes, cursor);
    if (frameNumber !== (variable ? sampleCount : frames - 1)) fail('FLAC frame continuity');
    let blockSize = blockCode === 1 ? 192 : blockCode >= 2 && blockCode <= 5 ? 576 * 2 ** (blockCode - 2) : blockCode >= 8 ? 256 * 2 ** (blockCode - 8) : 0;
    if (blockCode === 6) { if (cursor.offset >= bytes.length) fail('FLAC block size'); blockSize = bytes[cursor.offset++] + 1; }
    if (blockCode === 7) { if (cursor.offset + 2 > bytes.length) fail('FLAC block size'); blockSize = bytes.readUInt16BE(cursor.offset) + 1; cursor.offset += 2; }
    if (!blockSize || blockSize > stream.maxBlock) fail('FLAC block bounds');
    let sampleRate = [stream.sampleRate,88200,176400,192000,8000,16000,22050,24000,32000,44100,48000,96000][rateCode];
    if (rateCode === 12) { if (cursor.offset >= bytes.length) fail('FLAC sample rate'); sampleRate = bytes[cursor.offset++] * 1000; }
    if (rateCode === 13 || rateCode === 14) { if (cursor.offset + 2 > bytes.length) fail('FLAC sample rate'); sampleRate = bytes.readUInt16BE(cursor.offset) * (rateCode === 14 ? 10 : 1); cursor.offset += 2; }
    const depth = depthCode === 0 ? stream.bitDepth : ({1:8,2:12,4:16,5:20,6:24,7:32})[depthCode];
    const channels = channelAssignment <= 7 ? channelAssignment + 1 : channelAssignment <= 10 ? 2 : 0;
    if (sampleRate !== stream.sampleRate || depth !== stream.bitDepth || channels !== stream.channels || cursor.offset >= bytes.length || crc8(bytes, start, cursor.offset) !== bytes[cursor.offset]) fail('FLAC header configuration/CRC');
    const bits = new Bits(bytes, cursor.offset + 1);
    for (let channel = 0; channel < channels; channel++) flacSubframe(bits, blockSize, depth + ((channelAssignment === 8 && channel === 1 || channelAssignment === 9 && channel === 0 || channelAssignment === 10 && channel === 1) ? 1 : 0));
    bits.alignZero(); offset = bits.offset;
    if (offset + 2 > bytes.length || crc16(bytes, start, offset) !== bytes.readUInt16BE(offset)) fail('FLAC frame CRC/truncation');
    offset += 2; sampleCount += blockSize; safeSamples(sampleCount);
  }
  if (stream.totalSamples && sampleCount !== stream.totalSamples) fail('FLAC total samples mismatch');
  return result('audio/flac', 'flac', {codec: 'flac', channels: stream.channels, sampleRate: stream.sampleRate, frameCount: frames, sampleCount, durationSeconds: sampleCount / stream.sampleRate});
}

const OGG_CRC = new Uint32Array(256);
for (let index = 0; index < 256; index++) { let value = index << 24; for (let n = 0; n < 8; n++) value = value & 0x80000000 ? (value << 1) ^ 0x04c11db7 : value << 1; OGG_CRC[index] = value >>> 0; }
function oggCrc(bytes, start, end) { let value = 0; for (let i = start; i < end; i++) value = ((value << 8) ^ OGG_CRC[((value >>> 24) ^ (i >= start + 22 && i < start + 26 ? 0 : bytes[i])) & 255]) >>> 0; return value; }
function opusPacket(packet) {
  if (!packet.length) fail('empty Opus packet');
  const toc = packet[0], config = toc >>> 3, code = toc & 3;
  const frameSamples = config < 12 ? [480,960,1920,2880][config & 3] : config < 16 ? [480,960][config & 1] : [120,240,480,960][config & 3];
  let frames = code === 0 ? 1 : code === 3 ? 0 : 2, offset = 1, end = packet.length;
  const lengths = [];
  const size = () => { if (offset >= end) fail('Opus frame size'); const value = packet[offset++]; if (value < 252) return value; if (offset >= end) fail('Opus extended frame size'); return value + 4 * packet[offset++]; };
  if (code === 3) {
    if (offset >= end) fail('Opus frame count'); const flags = packet[offset++]; frames = flags & 63;
    if (!frames || frames > 48) fail('Opus frame count bounds');
    if (flags & 64) { let padding = 0, part; do { if (offset >= end) fail('Opus padding'); part = packet[offset++]; padding += part === 255 ? 254 : part; if (padding > packet.length) fail('Opus padding bounds'); } while (part === 255); end -= padding; if (end < offset) fail('Opus padding overlap'); }
    if (flags & 128) for (let n = 0; n < frames - 1; n++) lengths.push(size());
    else { if ((end - offset) % frames) fail('Opus CBR frame bounds'); lengths.push(...Array(frames).fill((end - offset) / frames)); }
  } else if (code === 1) { if ((end - offset) % 2) fail('Opus two-frame CBR bounds'); lengths.push((end - offset) / 2, (end - offset) / 2); }
  else if (code === 2) lengths.push(size());
  if (lengths.length < frames) lengths.push(end - offset - lengths.reduce((a,b) => a + b, 0));
  if (lengths.some(value => value < 0 || value > 1275) || lengths.reduce((a,b) => a + b, 0) !== end - offset || frameSamples * frames > 5760) fail('Opus packet duration/frame bounds');
  return frameSamples * frames;
}
function oggOpus(bytes) {
  let offset = 0, pages = 0, serial, sequence = 0, partial = [], packetBytes = 0, packetCount = 0, header, sampleCount = 0, eos = false, finalGranule;
  const packet = value => {
    if (++packetCount > MAX_FRAMES) fail('Ogg packet budget');
    if (packetCount === 1) {
      if (value.length !== 19 || ascii(value, 0, 8) !== 'OpusHead' || value[8] !== 1 || ![1,2].includes(value[9]) || value[18] !== 0) fail('unsupported OpusHead');
      header = {channels: value[9], preSkip: value.readUInt16LE(10)};
    } else if (packetCount === 2) {
      if (value.length < 16 || ascii(value, 0, 8) !== 'OpusTags') fail('OpusTags');
      const vendor = value.readUInt32LE(8); let cursor = 12 + vendor;
      if (cursor + 4 > value.length) fail('Opus vendor bounds'); const count = value.readUInt32LE(cursor); cursor += 4;
      if (count > 4096) fail('Opus comment budget');
      for (let n = 0; n < count; n++) { if (cursor + 4 > value.length) fail('Opus comment'); const length = value.readUInt32LE(cursor); cursor += 4 + length; if (cursor > value.length) fail('Opus comment bounds'); }
    } else { sampleCount += opusPacket(value); safeSamples(sampleCount); }
  };
  while (offset < bytes.length) {
    const start = offset;
    if (++pages > MAX_FRAMES || eos || offset + 27 > bytes.length || ascii(bytes, offset, offset + 4) !== 'OggS' || bytes[offset + 4] !== 0 || bytes[offset + 5] & 248) fail('Ogg page header');
    const flags = bytes[offset + 5], granule = bytes.readBigUInt64LE(offset + 6), pageSerial = bytes.readUInt32LE(offset + 14), pageSequence = bytes.readUInt32LE(offset + 18), segments = bytes[offset + 26];
    if (pages === 1 && (!(flags & 2) || flags & 1) || pages > 1 && flags & 2 || pageSequence !== sequence++ || serial !== undefined && serial !== pageSerial || !!(flags & 1) !== !!partial.length) fail('Ogg stream/page continuity');
    serial = pageSerial;
    const bodyStart = offset + 27 + segments;
    if (bodyStart > bytes.length) fail('Ogg segment table');
    let bodyLength = 0; for (let n = 0; n < segments; n++) bodyLength += bytes[offset + 27 + n];
    const end = bodyStart + bodyLength;
    if (end > bytes.length || oggCrc(bytes, start, end) !== bytes.readUInt32LE(offset + 22)) fail('Ogg page CRC/bounds');
    let body = bodyStart; const packetsBefore = packetCount;
    for (let n = 0; n < segments; n++) {
      const length = bytes[offset + 27 + n]; partial.push(bytes.subarray(body, body + length)); packetBytes += length; body += length;
      if (packetBytes > 2 * 1024 * 1024) fail('Ogg packet budget');
      if (length < 255) { packet(Buffer.concat(partial, packetBytes)); partial = []; packetBytes = 0; }
    }
    if (granule !== 0xffffffffffffffffn) {
      const current = Number(granule);
      // Standalone generated files start at zero. Cropped/live streams with a
      // nonzero initial granule are deliberately outside this cache contract.
      if (!Number.isSafeInteger(current) || packetCount <= 2 && current !== 0 || current > sampleCount || packetCount > 2 && !(flags & 4) && current !== sampleCount || finalGranule !== undefined && current < finalGranule) fail('Opus granule bounds');
      finalGranule = current;
    } else if (packetCount > packetsBefore || flags & 4) fail('Opus completed packet with missing granule');
    eos = !!(flags & 4); offset = end;
  }
  if (!eos || partial.length || packetCount < 3 || finalGranule === undefined || finalGranule <= header.preSkip) fail('truncated Ogg/Opus stream');
  return result('audio/ogg', 'opus', {codec: 'opus', channels: header.channels, sampleRate: 48000, sampleCount: finalGranule - header.preSkip, packetCount: packetCount - 2, durationSeconds: (finalGranule - header.preSkip) / 48000});
}

function boxes(bytes, start, end) {
  const out = []; let offset = start;
  while (offset < end) {
    if (out.length > 100000 || offset + 8 > end) fail('MP4 box budget/truncation');
    let size = bytes.readUInt32BE(offset), header = 8;
    if (size === 1) { if (offset + 16 > end) fail('MP4 extended box'); size = Number(bytes.readBigUInt64BE(offset + 8)); header = 16; }
    if (size === 0) size = end - offset;
    if (!Number.isSafeInteger(size) || size < header || offset + size > end) fail('MP4 box bounds');
    out.push({type: ascii(bytes, offset + 4, offset + 8), start: offset, body: offset + header, end: offset + size}); offset += size;
  }
  return out;
}
function unique(list, type, required = true) { const matching = list.filter(row => row.type === type); if (matching.length > 1 || required && !matching.length) fail(`MP4 ${type} identity`); return matching[0]; }
function table(bytes, box, stride) {
  if (!box || box.body + 8 > box.end || bytes.readUInt32BE(box.body) !== 0) fail('MP4 sample table header');
  const count = bytes.readUInt32BE(box.body + 4);
  if (count > MAX_FRAMES || box.body + 8 + count * stride !== box.end) fail('MP4 sample table bounds');
  return Array.from({length: count}, (_, index) => box.body + 8 + index * stride);
}
function aacConfig(bytes, esds) {
  if (!esds || esds.body + 6 > esds.end || bytes.readUInt32BE(esds.body) !== 0) fail('MP4 AAC decoder config');
  function descriptor(start, end) {
    if (start + 2 > end) fail('MP4 ES descriptor'); const tag = bytes[start++]; let length = 0, steps = 0, next;
    do { if (start >= end || ++steps > 4) fail('MP4 ES length'); next = bytes[start++]; length = length * 128 + (next & 127); } while (next & 128);
    if (start + length > end) fail('MP4 ES bounds'); return {tag, body: start, end: start + length};
  }
  const es = descriptor(esds.body + 4, esds.end); if (es.tag !== 3 || es.body + 3 > es.end) fail('MP4 ES identity');
  let cursor = es.body + 3; const flags = bytes[es.body + 2];
  if (flags & 128) cursor += 2;
  if (flags & 64) { if (cursor >= es.end) fail('MP4 ES URL'); cursor += bytes[cursor] + 1; }
  if (flags & 32) cursor += 2;
  const dc = descriptor(cursor, es.end); if (dc.tag !== 4 || dc.body + 13 > dc.end || bytes[dc.body] !== 0x40 || (bytes[dc.body + 1] >>> 2) !== 5) fail('MP4 unsupported audio codec');
  const asc = descriptor(dc.body + 13, dc.end); if (asc.tag !== 5 || asc.end - asc.body < 2) fail('MP4 AudioSpecificConfig');
  const bits = new Bits(bytes, asc.body, asc.end), profile = bits.read(5), rateIndex = bits.read(4);
  const sampleRate = rateIndex === 15 ? bits.read(24) : [96000,88200,64000,48000,44100,32000,24000,22050,16000,12000,11025,8000,7350][rateIndex], channels = bits.read(4);
  if (profile !== 2 || !sampleRate || sampleRate > 192000 || !channels || channels > 7) fail('MP4 unsupported AAC configuration');
  return {codec: 'aac', sampleRate, channels};
}
function mp4Audio(bytes) {
  const root = boxes(bytes, 0, bytes.length), ftyp = unique(root, 'ftyp'), moov = unique(root, 'moov'), mdat = root.filter(row => row.type === 'mdat');
  if (ftyp.end - ftyp.body < 8 || !mdat.length || mdat.every(row => row.body === row.end) || root.some(row => row.type === 'moof')) fail('MP4 audio container');
  const tracks = boxes(bytes, moov.body, moov.end).filter(row => row.type === 'trak');
  const audio = [];
  for (const track of tracks) {
    const mdia = unique(boxes(bytes, track.body, track.end), 'mdia'), media = boxes(bytes, mdia.body, mdia.end), hdlr = unique(media, 'hdlr');
    if (hdlr.body + 12 > hdlr.end) fail('MP4 track handler');
    const handler = ascii(bytes, hdlr.body + 8, hdlr.body + 12);
    if (handler === 'vide') return null;
    if (handler !== 'soun') continue;
    const mdhd = unique(media, 'mdhd'), version = bytes[mdhd.body];
    if (![0,1].includes(version) || mdhd.end - mdhd.body < (version === 1 ? 36 : 24)) fail('MP4 audio duration');
    const timescale = bytes.readUInt32BE(mdhd.body + (version === 1 ? 20 : 12)), duration = version === 1 ? Number(bytes.readBigUInt64BE(mdhd.body + 24)) : bytes.readUInt32BE(mdhd.body + 16);
    if (!timescale || !Number.isSafeInteger(duration) || duration <= 0 || duration / timescale > 3600) fail('MP4 audio timescale');
    const minf = unique(media, 'minf'), mediaInfo = boxes(bytes, minf.body, minf.end), dinf = unique(mediaInfo, 'dinf'), dref = unique(boxes(bytes, dinf.body, dinf.end), 'dref');
    if (dref.body + 8 > dref.end || bytes.readUInt32BE(dref.body + 4) !== 1) fail('MP4 audio resource count');
    const dataRefs = boxes(bytes, dref.body + 8, dref.end);
    if (dataRefs.length !== 1 || dataRefs[0].type !== 'url ' || dataRefs[0].body + 4 !== dataRefs[0].end || bytes.readUInt32BE(dataRefs[0].body) !== 1) fail('MP4 external audio resource');
    const stbl = unique(mediaInfo, 'stbl'), list = boxes(bytes, stbl.body, stbl.end), stsd = unique(list, 'stsd');
    if (stsd.body + 8 > stsd.end || bytes.readUInt32BE(stsd.body) !== 0 || bytes.readUInt32BE(stsd.body + 4) !== 1) fail('MP4 audio sample description');
    const descriptions = boxes(bytes, stsd.body + 8, stsd.end), desc = descriptions[0];
    if (descriptions.length !== 1 || desc.type !== 'mp4a' || desc.end - desc.body < 28 || bytes.readUInt16BE(desc.body + 6) !== 1 || bytes.readUInt16BE(desc.body + 8) !== 0) fail('MP4 unsupported sample entry');
    const config = aacConfig(bytes, unique(boxes(bytes, desc.body + 28, desc.end), 'esds'));
    const stsz = unique(list, 'stsz');
    if (stsz.body + 12 > stsz.end || bytes.readUInt32BE(stsz.body) !== 0) fail('MP4 sample sizes');
    const fixed = bytes.readUInt32BE(stsz.body + 4), count = bytes.readUInt32BE(stsz.body + 8);
    if (!count || count > MAX_FRAMES || stsz.body + 12 + (fixed ? 0 : count * 4) !== stsz.end) fail('MP4 sample size bounds');
    const sizes = Array.from({length: count}, (_, i) => fixed || bytes.readUInt32BE(stsz.body + 12 + i * 4));
    if (sizes.some(size => !size || size > MAX_BYTES)) fail('MP4 empty/oversized sample');
    const stts = table(bytes, unique(list, 'stts'), 8); let timedSamples = 0, timedDuration = 0;
    for (const position of stts) { const n = bytes.readUInt32BE(position), delta = bytes.readUInt32BE(position + 4); if (!n || !delta) fail('MP4 sample timing'); timedSamples += n; timedDuration += n * delta; }
    if (timedSamples !== count || timedDuration !== duration) fail('MP4 audio sample count/duration mismatch');
    const stco = unique(list, 'stco', false), co64 = unique(list, 'co64', false);
    if (!!stco === !!co64) fail('MP4 chunk offset identity');
    const chunks = table(bytes, stco || co64, stco ? 4 : 8).map(position => stco ? bytes.readUInt32BE(position) : Number(bytes.readBigUInt64BE(position)));
    if (!chunks.length || chunks.some(value => !Number.isSafeInteger(value))) fail('MP4 chunk offsets');
    const mapping = table(bytes, unique(list, 'stsc'), 12).map(position => ({first: bytes.readUInt32BE(position), count: bytes.readUInt32BE(position + 4), description: bytes.readUInt32BE(position + 8)}));
    if (!mapping.length || mapping[0].first !== 1 || mapping.some((row, i) => !row.count || row.description !== 1 || row.first > chunks.length || i && row.first <= mapping[i - 1].first)) fail('MP4 sample-to-chunk mapping');
    let sampleIndex = 0, mapIndex = 0, previousEnd = 0;
    for (let chunk = 0; chunk < chunks.length; chunk++) {
      if (mapIndex + 1 < mapping.length && mapping[mapIndex + 1].first === chunk + 1) mapIndex++;
      let position = chunks[chunk]; if (position < previousEnd) fail('MP4 overlapping audio chunks');
      for (let n = 0; n < mapping[mapIndex].count; n++) {
        if (sampleIndex >= sizes.length) fail('MP4 sample mapping overflow'); const end = position + sizes[sampleIndex++];
        if (!mdat.some(row => position >= row.body && end <= row.end)) fail('MP4 audio sample outside mdat'); position = end;
      }
      previousEnd = position;
    }
    if (sampleIndex !== count) fail('MP4 missing audio samples');
    const sampleCount = duration * config.sampleRate / timescale;
    if (!Number.isSafeInteger(sampleCount) || sampleCount < 1 || sampleCount > MAX_SAMPLES) fail('MP4 decoded sample timing budget');
    audio.push({...config, sampleCount, frameCount: count, durationSeconds: duration / timescale});
  }
  if (!audio.length) return null;
  if (audio.length !== 1) fail('MP4 multiple audio tracks');
  return result('audio/mp4', 'm4a', audio[0]);
}

function inspectAudioMedia(bytes, {mimeHint, filename} = {}) {
  if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) fail('bytes are required');
  const data = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (data.length > MAX_BYTES) fail('64 MiB size budget');
  if (data.length < 4) return null;
  if (ascii(data, 0, 4) === 'RIFF' && ascii(data, 8, 12) === 'WAVE') return wav(data);
  if (ascii(data, 0, 4) === 'fLaC') return flac(data);
  if (ascii(data, 0, 4) === 'OggS') return oggOpus(data);
  if (data.length >= 8 && ascii(data, 4, 8) === 'ftyp') return mp4Audio(data);
  const offset = id3End(data);
  if (offset || data[0] === 255 && (data[1] & 0xe0) === 0xe0) {
    if (offset + 2 > data.length) fail('ID3 without audio');
    if (data[offset] === 255 && (data[offset + 1] & 0xf6) === 0xf0) return aac(data, offset);
    return mp3(data, offset);
  }
  // A hint never changes unknown bytes into audio. Truncated recognized headers
  // are rejected explicitly when a caller presents them as an audio file.
  if (/^audio\//i.test(mimeHint || '') && /^(RIFF|ID3|fLaC|OggS)/.test(ascii(data, 0, 4))) fail('truncated recognized audio');
  return null;
}
module.exports = {inspectAudioMedia};
