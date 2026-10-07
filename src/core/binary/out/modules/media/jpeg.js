'use strict';
// Own bounded JPEG interchange validation. SOF0/SOF1 entropy is walked by MCU
// using canonical Huffman codes, without allocating/reconstructing pixels.
// SOF2 validates scan progression and complete entropy/marker framing only.
// Format reference: ITU-T T.81, annexes B, C, F and G:
// https://www.w3.org/Graphics/JPEG/itu-t81.pdf . No original app code is executed.
const MAX_BYTES = 64 * 1024 * 1024, MAX_SCANS = 1024, MAX_SEGMENTS = 8192;
function bad(message) { throw Error('Invalid/bounded JPEG: ' + message); }
function bounds(bytes, start, size) { if (!Number.isSafeInteger(start) || !Number.isSafeInteger(size) || start < 0 || size < 0 || start + size > bytes.length) bad('truncated marker/entropy'); }

class EntropyReader {
  constructor(bytes, start) { this.bytes = bytes; this.offset = start; this.bits = 0; this.value = 0; }
  read(count) {
    let value = 0;
    for (let n = 0; n < count; n++) {
      if (!this.bits) {
        bounds(this.bytes, this.offset, 1); this.value = this.bytes[this.offset++];
        if (this.value === 255) { bounds(this.bytes, this.offset, 1); if (this.bytes[this.offset++] !== 0) bad('entropy ends before required Huffman MCU data'); }
        this.bits = 8;
      }
      value = value * 2 + ((this.value >>> --this.bits) & 1);
    }
    return value;
  }
  symbol(table) {
    let code = 0;
    for (let length = 1; length <= 16; length++) { code = code * 2 + this.read(1); const symbol = table[length].get(code); if (symbol !== undefined) return symbol; }
    bad('invalid Huffman entropy code');
  }
  align() { if (this.bits && (this.value & ((1 << this.bits) - 1)) !== (1 << this.bits) - 1) bad('entropy fill bits are not all ones'); this.bits = 0; }
  marker() {
    const start = this.offset; bounds(this.bytes, start, 2);
    if (this.bytes[this.offset++] !== 255) bad('unexpected extra entropy after complete MCUs');
    while (this.bytes[this.offset] === 255) { this.offset++; bounds(this.bytes, this.offset, 1); }
    const marker = this.bytes[this.offset++]; if (!marker) bad('stuffed byte after complete MCUs');
    return {start, marker};
  }
}

function baselineScan(bytes, start, frame, scan, restartInterval, huffman) {
  const reader = new EntropyReader(bytes, start);
  const single = scan.components.length === 1, first = scan.components[0].component;
  const columns = single ? Math.ceil(frame.width * first.h / frame.h / 8) : Math.ceil(frame.width / (8 * frame.h));
  const rows = single ? Math.ceil(frame.height * first.v / frame.v / 8) : Math.ceil(frame.height / (8 * frame.v));
  const mcus = columns * rows; let restart = 0;
  for (let mcu = 0; mcu < mcus; mcu++) {
    if (restartInterval && mcu && mcu % restartInterval === 0) { reader.align(); const marker = reader.marker(); if (marker.marker !== 0xd0 + restart) bad('restart marker sequence/interval'); restart = (restart + 1) & 7; }
    for (const selected of scan.components) for (let block = 0; block < (single ? 1 : selected.component.h * selected.component.v); block++) {
      const dc = reader.symbol(huffman.get('0:' + selected.dc)); if (dc > 11) bad('DC coefficient bit width'); reader.read(dc);
      let coefficient = 1;
      while (coefficient < 64) {
        const symbol = reader.symbol(huffman.get('1:' + selected.ac)), run = symbol >>> 4, size = symbol & 15;
        if (!size) { if (!run) break; if (run !== 15 || coefficient + 16 > 64) bad('AC zero-run bounds'); coefficient += 16; }
        else { coefficient += run; if (size > 10 || coefficient >= 64) bad('AC coefficient bounds'); reader.read(size); coefficient++; }
      }
    }
  }
  reader.align(); const next = reader.marker();
  if (next.marker >= 0xd0 && next.marker <= 0xd7) bad('extra restart after final MCU');
  return next.start;
}

function progressiveFraming(bytes, start, restartInterval) {
  let offset = start, entropy = 0, intervalBytes = 0, restart = 0;
  while (offset < bytes.length) {
    if (bytes[offset] !== 255) { offset++; entropy++; intervalBytes++; continue; }
    const markerStart = offset++; bounds(bytes, offset, 1);
    if (bytes[offset] === 0) { offset++; entropy++; intervalBytes++; continue; }
    while (bytes[offset] === 255) { offset++; bounds(bytes, offset, 1); }
    const marker = bytes[offset++];
    if (!marker) bad('marker fill bytes before an entropy-stuffed zero');
    if (marker >= 0xd0 && marker <= 0xd7) {
      if (!restartInterval || !intervalBytes || marker !== 0xd0 + restart) bad('progressive restart framing');
      restart = (restart + 1) & 7; intervalBytes = 0; continue;
    }
    if (!entropy || !intervalBytes) bad('empty/truncated progressive entropy scan');
    return markerStart;
  }
  bad('missing marker after entropy scan');
}

function inspectJpegMedia(input, {panorama = false} = {}) {
  if (!Buffer.isBuffer(input) && !(input instanceof Uint8Array)) bad('byte input is required');
  const bytes = Buffer.isBuffer(input) ? input : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  if (bytes.length > MAX_BYTES) bad('64 MiB file budget');
  if (bytes.length < 2 || bytes[0] !== 255 || bytes[1] !== 0xd8) return null;
  let offset = 2, segments = 0, scans = 0, frame, restartInterval = 0, ended = false;
  const quantization = new Map(), huffman = new Map(), completed = new Set();
  const readFrame = (marker, body, end) => {
    if (frame || ![0xc0, 0xc1, 0xc2].includes(marker)) bad('unsupported/duplicate frame coding');
    bounds(bytes, body, 6);
    const precision = bytes[body], height = bytes.readUInt16BE(body + 1), width = bytes.readUInt16BE(body + 3), count = bytes[body + 5];
    if (precision !== 8 || !width || !height || width * height > (panorama ? 67108864 : 16777216) || count < 1 || count > 4 || body + 6 + count * 3 !== end) bad('frame dimensions/precision/components');
    const components = new Map(); let h = 0, v = 0, blocks = 0;
    for (let n = 0; n < count; n++) {
      const position = body + 6 + n * 3, id = bytes[position], horizontal = bytes[position + 1] >>> 4, vertical = bytes[position + 1] & 15, table = bytes[position + 2];
      if (components.has(id) || !horizontal || horizontal > 4 || !vertical || vertical > 4 || table > 3) bad('component sampling/identity');
      h = Math.max(h, horizontal); v = Math.max(v, vertical); blocks += horizontal * vertical;
      components.set(id, {id, index: n, h: horizontal, v: vertical, table, progression: Array(64).fill(-1)});
    }
    if (blocks > 10) bad('MCU sampling block budget');
    frame = {width, height, h, v, components, coding: marker, progressive: marker === 0xc2};
  };
  while (offset < bytes.length) {
    if (++segments > MAX_SEGMENTS || bytes[offset++] !== 255) bad('marker framing/budget');
    while (bytes[offset] === 255) { offset++; bounds(bytes, offset, 1); }
    bounds(bytes, offset, 1); const marker = bytes[offset++];
    if (marker === 0xd9) { if (!frame || !scans || offset !== bytes.length) bad('EOI before data or trailing bytes'); ended = true; break; }
    if (!marker || marker === 0xd8 || marker === 1 || marker >= 0xd0 && marker <= 0xd7) bad('standalone/reserved marker outside entropy');
    bounds(bytes, offset, 2); const length = bytes.readUInt16BE(offset), body = offset + 2, end = offset + length;
    if (length < 2) bad('marker segment length'); bounds(bytes, offset, length); offset = end;
    if (marker === 0xdb) {
      let position = body;
      while (position < end) {
        const info = bytes[position++], precision = info >>> 4, id = info & 15;
        if (precision > 1 || id > 3 || position + 64 * (precision + 1) > end) bad('quantization table bounds');
        for (let n = 0; n < 64; n++) { const value = precision ? bytes.readUInt16BE(position) : bytes[position]; if (!value) bad('zero quantization value'); position += precision + 1; }
        quantization.set(id, {precision});
      }
      if (position !== end || position === body) bad('empty quantization segment');
    } else if (marker === 0xc4) {
      let position = body;
      while (position < end) {
        bounds(bytes, position, 17); if (position + 17 > end) bad('Huffman table segment bounds');
        const info = bytes[position++], klass = info >>> 4, id = info & 15, counts = [...bytes.subarray(position, position + 16)]; position += 16;
        const count = counts.reduce((sum,value) => sum + value, 0);
        if (klass > 1 || id > 3 || !count || count > 256 || position + count > end) bad('Huffman table bounds/class');
        const tables = Array.from({length: 17}, () => new Map()), symbols = new Set(); let code = 0, available = 1;
        for (let size = 1; size <= 16; size++) {
          available = available * 2 - counts[size - 1]; if (available <= 0) bad('over-subscribed/all-ones Huffman codes');
          for (let n = 0; n < counts[size - 1]; n++) {
            const symbol = bytes[position++];
            if (symbols.has(symbol) || klass === 0 && symbol > 11 || klass === 1 && (symbol & 15) > 10) bad('invalid Huffman coefficient symbol');
            symbols.add(symbol); tables[size].set(code++, symbol);
          }
          code *= 2;
        }
        huffman.set(klass + ':' + id, tables);
      }
      if (position !== end || position === body) bad('empty Huffman segment');
    } else if ([0xc0, 0xc1, 0xc2].includes(marker)) readFrame(marker, body, end);
    else if (marker >= 0xc0 && marker <= 0xcf) bad('unsupported JPEG coding marker');
    else if (marker === 0xdd) { if (length !== 4) bad('restart interval length'); restartInterval = bytes.readUInt16BE(body); }
    else if (marker === 0xda) {
      if (!frame || ++scans > MAX_SCANS || body >= end) bad('scan without bounded frame');
      const count = bytes[body]; if (!count || count > frame.components.size || body + 1 + count * 2 + 3 !== end) bad('scan component length');
      const selected = [], ids = new Set();
      for (let n = 0; n < count; n++) {
        const id = bytes[body + 1 + n * 2], info = bytes[body + 2 + n * 2], component = frame.components.get(id), dc = info >>> 4, ac = info & 15;
        if (!component || ids.has(id) || dc > (frame.coding === 0xc0 ? 1 : 3) || ac > (frame.coding === 0xc0 ? 1 : 3) || !quantization.has(component.table) || quantization.get(component.table).precision !== 0 || selected.length && component.index <= selected.at(-1).component.index) bad('scan component/quantization identity');
        ids.add(id); selected.push({component, dc, ac});
      }
      const spectral = body + 1 + count * 2, first = bytes[spectral], last = bytes[spectral + 1], high = bytes[spectral + 2] >>> 4, low = bytes[spectral + 2] & 15;
      if (!frame.progressive) {
        if (first || last !== 63 || high || low || selected.some(row => completed.has(row.component.id) || !huffman.has('0:' + row.dc) || !huffman.has('1:' + row.ac))) bad('sequential scan/table/component order');
        for (const row of selected) completed.add(row.component.id);
        offset = baselineScan(bytes, end, frame, {components: selected}, restartInterval, huffman);
      } else {
        if (first > last || last > 63 || first === 0 && last !== 0 || first !== 0 && count !== 1 || high > 13 || low > 13 || high && high !== low + 1) bad('progressive spectral/refinement parameters');
        for (const row of selected) {
          if ((!first && !high && !huffman.has('0:' + row.dc)) || first && !huffman.has('1:' + row.ac)) bad('missing progressive Huffman table');
          for (let coefficient = first; coefficient <= last; coefficient++) {
            const previous = row.component.progression[coefficient]; if (high ? previous !== high : previous !== -1) bad('progressive coefficient scan order'); row.component.progression[coefficient] = low;
          }
          if (!first) completed.add(row.component.id);
        }
        offset = progressiveFraming(bytes, end, restartInterval);
      }
    } else if (!(marker >= 0xe0 && marker <= 0xef) && marker !== 0xfe) bad('unsupported/reserved JPEG segment');
  }
  if (!ended || !frame || completed.size !== frame.components.size) bad('incomplete frame/component scans');
  return {mime: 'image/jpeg', extension: 'jpg', kind: 'image', width: frame.width, height: frame.height, channels: frame.components.size, progressive: frame.progressive,
    scanCount: scans, containerValidated: true, entropyValidated: frame.progressive ? 'scan-framing' : 'huffman-mcu', codecDecoded: false};
}
module.exports = {inspectJpegMedia};
