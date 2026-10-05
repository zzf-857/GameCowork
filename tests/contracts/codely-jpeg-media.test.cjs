'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {inspectJpegMedia} = require('../../src/core/binary/out/gamecowork-jpeg-media.js');
const fixture = require('../fixtures/codely-jpeg-media.json');
const source = name => Buffer.from(fixture.files[name].base64, 'base64');
const segment = (marker, body) => { const head = Buffer.from([255,marker,0,0]); head.writeUInt16BE(body.length + 2,2); return Buffer.concat([head,body]); };
function tinyJpeg(acSymbol = 0) {
  const table = (klass, symbol) => Buffer.from([klass,1,...Array(15).fill(0),symbol]);
  return Buffer.concat([Buffer.from([255,216]), segment(0xdb,Buffer.from([0,...Array(64).fill(1)])), segment(0xc0,Buffer.from([8,0,1,0,1,1,1,0x11,0])), segment(0xc4,Buffer.concat([table(0,0),table(0x10,acSymbol)])), segment(0xda,Buffer.from([1,1,0,0,63,0])), Buffer.from([0x3f,255,217])]);
}
function markers(bytes) {
  const result = []; let offset = 2;
  while (offset < bytes.length) {
    assert.equal(bytes[offset],255); const start = offset++; while (bytes[offset]===255)offset++; const marker=bytes[offset++];
    if (marker===217) {result.push({marker,start,end:offset});break;}
    const length=bytes.readUInt16BE(offset),body=offset+2,end=offset+length;result.push({marker,start,body,end});offset=end;
    if(marker===218){const scan=result.at(-1);scan.entropy=end;while(offset<bytes.length){if(bytes[offset++]!==255)continue;const point=offset-1;while(bytes[offset]===255)offset++;const code=bytes[offset++];if(code===0||code>=208&&code<=215)continue;scan.entropyEnd=point;offset=point;break;}}
  }
  return result;
}
for (const [name,row] of Object.entries(fixture.files)) {
  test(`self-generated ${name} JPEG validates complete markers/scans and actual dimensions`, () => {
    const bytes = source(name); assert.equal(bytes.length,row.byteLength); assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),row.sha256);
    const actual=inspectJpegMedia(bytes); assert.equal(actual.mime,'image/jpeg');assert.equal(actual.kind,'image');assert.equal(actual.extension,'jpg');
    assert.equal(actual.width,row.width);assert.equal(actual.height,row.height);assert.equal(actual.containerValidated,true);assert.equal(actual.codecDecoded,false);
    assert.equal(actual.progressive,name==='progressive');assert.equal(actual.entropyValidated,name==='progressive'?'scan-framing':'huffman-mcu');
    if(name==='progressive')assert.equal(actual.scanCount,10);
  });
  test(`${name} JPEG rejects truncation, missing EOI and trailing bytes`, () => {
    const bytes=source(name);
    for(const bad of [bytes.subarray(0,bytes.length-1),bytes.subarray(0,Math.floor(bytes.length/2)),Buffer.concat([bytes,Buffer.from('junk')])])assert.throws(()=>inspectJpegMedia(bad),/JPEG/);
  });
}
test('a minimal genuine one-pixel Huffman JPEG validates without relying on magic and EOI', () => {
  const media=inspectJpegMedia(tinyJpeg());assert.equal(media.width,1);assert.equal(media.height,1);assert.equal(media.entropyValidated,'huffman-mcu');
  assert.throws(()=>inspectJpegMedia(Buffer.from([255,216,255,217])),/EOI/);
  assert.throws(()=>inspectJpegMedia(Buffer.from([255,216,255,219,0,2,255,217])));
});
test('non-JPEG never becomes JPEG from metadata, and dimensions/size budgets stay bounded', () => {
  for(const bytes of [Buffer.alloc(0),Buffer.from([137,80,78,71,13,10,26,10]),Buffer.from('not image/jpeg')])assert.equal(inspectJpegMedia(bytes,{mimeHint:'image/jpeg',filename:'picture.jpg'}),null);
  assert.throws(()=>inspectJpegMedia(Buffer.alloc(64*1024*1024+1)),/64 MiB/);
  const bytes=tinyJpeg(),frame=markers(bytes).find(row=>row.marker===0xc0);
  const zero=Buffer.from(bytes);zero.writeUInt16BE(0,frame.body+1);assert.throws(()=>inspectJpegMedia(zero),/dimensions/);
  const huge=Buffer.from(bytes);huge.writeUInt16BE(8192,frame.body+1);huge.writeUInt16BE(8192,frame.body+3);assert.throws(()=>inspectJpegMedia(huge),/dimensions/);
  assert.throws(()=>inspectJpegMedia(huge,{panorama:true}),/entropy/, 'A panorama flag only extends dimensions; it cannot invent the missing MCU data');
});
test('marker lengths, missing tables and zero quantizers cannot pass with intact SOI/EOI', () => {
  const bytes=tinyJpeg(),list=markers(bytes),quant=list.find(row=>row.marker===0xdb),huffman=list.find(row=>row.marker===0xc4),frame=list.find(row=>row.marker===0xc0);
  for(const mutate of [value=>value.writeUInt16BE(1,quant.start+2),value=>{value[quant.body+1]=0;},value=>{value[frame.body]=12;},value=>{value[frame.body+7]=0;},value=>{value[frame.body+8]=3;}]){const value=Buffer.from(bytes);mutate(value);assert.throws(()=>inspectJpegMedia(value));}
  assert.throws(()=>inspectJpegMedia(Buffer.concat([bytes.subarray(0,huffman.start),bytes.subarray(huffman.end)])),/table/);
  assert.throws(()=>inspectJpegMedia(Buffer.concat([bytes.subarray(0,quant.start),bytes.subarray(quant.end)])),/quantization/);
});
test('canonical Huffman tables reject all-ones/oversubscribed codes and invalid symbols', () => {
  const bytes=tinyJpeg(),table=markers(bytes).find(row=>row.marker===0xc4);
  for(const mutate of [value=>{value[table.body+1]=2;},value=>{value[table.body+17]=12;},value=>{value[table.body]=0x30;}]){const value=Buffer.from(bytes);mutate(value);assert.throws(()=>inspectJpegMedia(value));}
});
test('baseline validates every MCU entropy code, coefficient run, padding and exact scan end', () => {
  const bytes=tinyJpeg(),scan=markers(bytes).find(row=>row.marker===0xda);
  for(const entropy of [Buffer.from([0x00]),Buffer.from([0xbf]),Buffer.from([0x3f,0x3f]),Buffer.from([255,0])]) {
    const value=Buffer.concat([bytes.subarray(0,scan.entropy),entropy,Buffer.from([255,217])]);assert.throws(()=>inspectJpegMedia(value));
  }
  const zeroRun=tinyJpeg(0xf0),at=markers(zeroRun).find(row=>row.marker===0xda).entropy;zeroRun[at]=0x07;
  assert.throws(()=>inspectJpegMedia(zeroRun),/zero-run/, 'Four ZRL symbols cannot advance beyond a 64-coefficient block');
});
test('a baseline scan cannot reference an undefined component or non-sequential spectral range', () => {
  const bytes=tinyJpeg(),scan=markers(bytes).find(row=>row.marker===0xda);
  for(const mutate of [value=>{value[scan.body+1]=77;},value=>{value[scan.body+2]=0x20;},value=>{value[scan.body+3]=1;},value=>{value[scan.body+4]=62;},value=>{value[scan.body+5]=1;}]){const value=Buffer.from(bytes);mutate(value);assert.throws(()=>inspectJpegMedia(value));}
});
test('restart intervals enforce the actual marker sequence and MCU boundary', () => {
  const bytes=source('restart'),index=bytes.indexOf(Buffer.from([255,208]));assert.ok(index>0);
  const corrupt=Buffer.from(bytes);corrupt[index+1]=211;assert.throws(()=>inspectJpegMedia(corrupt),/restart/);
  const interval=markers(bytes).find(row=>row.marker===221),noInterval=Buffer.from(bytes);noInterval.writeUInt16BE(0,interval.body);assert.throws(()=>inspectJpegMedia(noInterval),/entropy/);
  const tiny=tinyJpeg();assert.throws(()=>inspectJpegMedia(Buffer.concat([tiny.subarray(0,tiny.length-2),Buffer.from([255,208,255,217])])),/restart/);
});
test('progressive scans retain coefficient/refinement order and real entropy framing', () => {
  const bytes=source('progressive'),scans=markers(bytes).filter(row=>row.marker===218),first=scans[0],second=scans[1];
  for(const mutate of [
    value=>{value[first.end-2]=63;},
    value=>{value[second.end-3]=63;value[second.end-2]=1;},
    value=>{value[second.end-1]=0x52;},
    value=>{value[second.entropy]=255;value[second.entropy+1]=208;},
  ]){const value=Buffer.from(bytes);mutate(value);assert.throws(()=>inspectJpegMedia(value));}
  assert.throws(()=>inspectJpegMedia(Buffer.concat([bytes.subarray(0,first.entropy),bytes.subarray(first.entropyEnd)])),/empty/);
  assert.throws(()=>inspectJpegMedia(Buffer.concat([bytes.subarray(0,first.start),bytes.subarray(second.start)])),/scan order|component scans|Huffman/);
});
