const test=require('node:test'),assert=require('node:assert/strict');
const {inspectHdrMedia}=require('../../src/core/binary/out/modules/media/hdr.js');
const header=(w,h)=>Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h} +X ${w}\n`);
test('HDR validates each real scanline and all four bounded component runs',()=>{
  const line=Buffer.from([2,2,0,8,136,128,136,64,136,32,136,129]),image=Buffer.concat([header(8,2),line,line]);
  const actual=inspectHdrMedia(image);assert.equal(actual.width,8);assert.equal(actual.height,2);
  for(const broken of [image.subarray(0,-1),Buffer.concat([image,Buffer.from([0])]),Buffer.concat([header(9,2),line,line])])assert.throws(()=>inspectHdrMedia(broken));
  const bad=Buffer.from(image);bad[header(8,2).length+4]=137;assert.throws(()=>inspectHdrMedia(bad),/run/);
});
test('Legacy HDR real pixels and repeats reject missing prior pixels and overflow',()=>{
  const actual=Buffer.concat([header(4,1),Buffer.from([128,64,32,129,1,1,1,3])]);assert.equal(inspectHdrMedia(actual).width,4);
  assert.throws(()=>inspectHdrMedia(Buffer.concat([header(4,1),Buffer.from([1,1,1,4])])),/run/);
  assert.throws(()=>inspectHdrMedia(Buffer.concat([header(99999999,1),Buffer.alloc(4)])),/bounds/);
  assert.equal(inspectHdrMedia(Buffer.from('ordinary unrelated bytes')),null);
});
