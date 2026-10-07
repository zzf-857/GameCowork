'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const {inspectModelMedia:inspect}=require('../../src/core/binary/out/modules/media/model.js');
const obj=Buffer.from('# own triangle\nv 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3\n');
const fbxText=Buffer.from('; FBX 7.4.0 project file\nFBXHeaderExtension: {\n FBXVersion: 7400\n}\nObjects: {\n Model: 1, "Model::Cube", "Mesh" {\n }\n}\n');
const usda=Buffer.from('#usda 1.0\ndef Mesh "Triangle" {\n point3f[] points = [(0,0,0), (1,0,0), (0,1,0)]\n int[] faceVertexCounts = [3]\n int[] faceVertexIndices = [0,1,2]\n}\n');
function crc(bytes){let v=0xffffffff;for(const b of bytes){v^=b;for(let i=0;i<8;i++)v=v>>>1^(v&1?0xedb88320:0);}return(v^0xffffffff)>>>0;}
function zip(members,{aligned=false,descriptor=false,comment=''}={}){
  const locals=[],centrals=[];let offset=0;
  for(const member of members){const contents=member.bytes||obj,name=Buffer.from(member.name),method=member.method??0,encoded=method===8?zlib.deflateRawSync(contents):contents,flags=member.flags??(descriptor?8:0),sum=crc(contents);
    const pad=aligned?(64-(offset+30+name.length+4)%64)%64:0,extra=aligned?Buffer.alloc(4+pad):Buffer.alloc(0);if(aligned){extra.writeUInt16LE(0x1986);extra.writeUInt16LE(pad,2);}
    const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(flags,6);local.writeUInt16LE(method,8);if(!(flags&8)){local.writeUInt32LE(sum,14);local.writeUInt32LE(encoded.length,18);local.writeUInt32LE(contents.length,22);}local.writeUInt16LE(name.length,26);local.writeUInt16LE(extra.length,28);
    const tail=flags&8?Buffer.alloc(16):Buffer.alloc(0);if(flags&8){tail.writeUInt32LE(0x08074b50);tail.writeUInt32LE(sum,4);tail.writeUInt32LE(encoded.length,8);tail.writeUInt32LE(contents.length,12);}
    const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50);central.writeUInt16LE(0x0314,4);central.writeUInt16LE(20,6);central.writeUInt16LE(flags,8);central.writeUInt16LE(method,10);central.writeUInt32LE(sum,16);central.writeUInt32LE(encoded.length,20);central.writeUInt32LE(contents.length,24);central.writeUInt16LE(name.length,28);central.writeUInt32LE((member.attrs??0x81a40000)>>>0,38);central.writeUInt32LE(offset,42);
    const body=Buffer.concat([local,name,extra,encoded,tail]);locals.push(body);centrals.push(Buffer.concat([central,name]));offset+=body.length;
  }
  const central=Buffer.concat(centrals),ending=Buffer.alloc(22),comments=Buffer.from(comment);ending.writeUInt32LE(0x06054b50);ending.writeUInt16LE(members.length,8);ending.writeUInt16LE(members.length,10);ending.writeUInt32LE(central.length,12);ending.writeUInt32LE(offset,16);ending.writeUInt16LE(comments.length,20);
  return Buffer.concat([...locals,central,ending,comments]);
}
function binaryFbx(version=7400){
  const wide=version>=7500,header=wide?25:13;
  function node(name,start,children=[]){const nameBytes=Buffer.from(name),parts=[];let childStart=start+header+nameBytes.length;for(const child of children){const bytes=node(child.name,childStart,child.children||[]);parts.push(bytes);childStart+=bytes.length;}if(children.length){parts.push(Buffer.alloc(header));childStart+=header;}
    const h=Buffer.alloc(header);if(wide){h.writeBigUInt64LE(BigInt(childStart));}else h.writeUInt32LE(childStart);h[header-1]=nameBytes.length;return Buffer.concat([h,nameBytes,...parts]);}
  const magic=Buffer.from('Kaydara FBX Binary  \x00\x1a\x00','binary'),v=Buffer.alloc(4);v.writeUInt32LE(version);const first=node('FBXHeaderExtension',27),second=node('Objects',27+first.length,[{name:'Model'}]);return Buffer.concat([magic,v,first,second,Buffer.alloc(header)]);
}
function stl(){const bytes=Buffer.alloc(134);bytes.write('own triangle');bytes.writeUInt32LE(1,80);[0,0,1,0,0,0,1,0,0,0,1,0].forEach((v,i)=>bytes.writeFloatLE(v,84+i*4));return bytes;}
test('non-model files stay outside this inspector and recognized corrupt model bytes fail',()=>{
  assert.equal(inspect(Buffer.from('plain report')),null);
  assert.equal(inspect(Buffer.from('{"report":true}'),{filename:'report.json'}),null);
  assert.equal(inspect(Buffer.from('glTF'),{filename:'model.glb'}),null);
  assert.throws(()=>inspect(Buffer.from('not fbx'),{filename:'model.fbx'}));
  assert.throws(()=>inspect(Buffer.alloc(64*1024*1024+1),{filename:'large.obj'}),/64 MiB/);
});
test('OBJ geometry, positive/negative face indices and bounded text are checked',()=>{
  assert.equal(inspect(obj,{filename:'mesh.obj'}).faceCount,1);
  assert.equal(inspect(Buffer.from(obj.toString().replace('f 1 2 3','f -3 -2 -1'))).kind,'model');
  for(const contents of ['v 0 0 0\nf 1 2 3','v NaN 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3',obj.toString().replace('f 1 2 3','f 1 2 4'),obj+'csh malicious\n',obj+'mtllib ../unowned.mtl\n'])assert.throws(()=>inspect(Buffer.from(contents),{filename:'mesh.obj'}));
});
test('binary FBX 32-bit/64-bit records and ASCII scenes need valid bounds and scene nodes',()=>{
  assert.equal(inspect(binaryFbx()).version,7400);assert.equal(inspect(binaryFbx(7500)).version,7500);assert.equal(inspect(fbxText).binary,false);
  const broken=Buffer.from(binaryFbx());broken.writeUInt32LE(0xffffffff,27);assert.throws(()=>inspect(broken),/offset/);
  const malformed=Buffer.from(binaryFbx(7500));malformed.writeBigUInt64LE(2n**63n,27);assert.throws(()=>inspect(malformed),/64-bit/);
  assert.throws(()=>inspect(binaryFbx().subarray(0,-2)));
  assert.throws(()=>inspect(Buffer.from(fbxText.toString().replace('FBXVersion: 7400','FBXVersion: 9999'))));
  assert.throws(()=>inspect(Buffer.from(fbxText.toString().replace('Objects:','"Objects:'))));
});
test('FBX property tables and compressed arrays have decoded byte budgets',()=>{
  const base=binaryFbx();const pos=27,nameLength=base[pos+12];const props=Buffer.concat([Buffer.from('d'),Buffer.alloc(12),zlib.deflateSync(Buffer.alloc(8))]);props.writeUInt32LE(1,1);props.writeUInt32LE(1,5);props.writeUInt32LE(props.length-13,9);
  const originalEnd=base.readUInt32LE(pos),newEnd=originalEnd+props.length,h=Buffer.from(base.subarray(pos,pos+13));h.writeUInt32LE(newEnd);h.writeUInt32LE(1,4);h.writeUInt32LE(props.length,8);
  const suffix=Buffer.from(base.subarray(originalEnd));suffix.writeUInt32LE(suffix.readUInt32LE(0)+props.length);const modelPos=13+'Objects'.length;suffix.writeUInt32LE(suffix.readUInt32LE(modelPos)+props.length,modelPos);
  const bytes=Buffer.concat([base.subarray(0,pos),h,base.subarray(pos+13,pos+13+nameLength),props,suffix]);assert.equal(inspect(bytes).kind,'model');
  const bomb=Buffer.from(bytes);bomb.writeUInt32LE(100000000,pos+13+nameLength+1);assert.throws(()=>inspect(bomb),/expansion/);
  const count=Buffer.from(bytes);count.writeUInt32LE(1000001,pos+4);assert.throws(()=>inspect(count),/count|offset/);
});
test('STL requires complete real facets and finite coordinates',()=>{
  assert.equal(inspect(stl()).faceCount,1);const corrupt=stl();corrupt.writeFloatLE(NaN,88);assert.throws(()=>inspect(corrupt),/non-finite/);
  assert.throws(()=>inspect(stl().subarray(0,-1),{filename:'mesh.stl'}));
  const ascii=Buffer.from('solid triangle\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 1 0 0\nvertex 0 1 0\nendloop\nendfacet\nendsolid triangle\n');assert.equal(inspect(ascii).faceCount,1);
  assert.throws(()=>inspect(Buffer.from(ascii.toString().replace('vertex 1 0 0\n',''))));assert.throws(()=>inspect(Buffer.from(ascii+'facet normal 0 0 1\n')));
});
test('ZIP supports stored and deflated owned model members including descriptor and original report',()=>{
  for(const method of [0,8])for(const descriptor of [false,true]){const archive=zip([{name:'model.obj',bytes:obj,method},{name:'conversion-report.json',bytes:Buffer.from('{"converted":true}'),method}],{descriptor,comment:'owned'});const info=inspect(archive);assert.equal(info.extension,'zip');assert.equal(info.modelCount,1);assert.equal(info.entryCount,2);assert.equal(info.expandedByteLength,obj.length+18);}
});
test('ZIP central/local name, method, size, CRC and compressed-member tails must agree',()=>{
  const baseline=zip([{name:'model.obj',bytes:obj,method:8}]);const eocd=baseline.length-22,central=baseline.readUInt32LE(eocd+16);
  for(const [offset,value,size]of[[6,1,2],[8,0,2],[14,123,4],[18,1,4],[30,88,1],[central+16,123,4],[central+42,1,4]]){const copy=Buffer.from(baseline);if(size===1)copy[offset]=value;else if(size===2)copy.writeUInt16LE(value,offset);else copy.writeUInt32LE(value,offset);assert.throws(()=>inspect(copy));}
  assert.throws(()=>inspect(baseline.subarray(0,-1)),/directory/);
  const noModel=zip([{name:'report.json',bytes:Buffer.from('{}')}]);assert.throws(()=>inspect(noModel),/no model/);
});
test('ZIP blocks traversal, Windows collisions, executable paths and symlinks',()=>{
  for(const name of ['../model.obj','/model.obj','C:/model.obj','folder\\model.obj','folder/./model.obj','folder//model.obj','nul.obj','model.obj.','model.obj '])assert.throws(()=>inspect(zip([{name}])),/path/);
  assert.throws(()=>inspect(zip([{name:'Model.obj'},{name:'model.obj'}])),/duplicate/);
  assert.throws(()=>inspect(zip([{name:'linked.obj',attrs:0xa1ff0000}])),/linked/);
  assert.throws(()=>inspect(zip([{name:'model.obj'},{name:'payload.exe',bytes:Buffer.from('MZ')}])));
  assert.throws(()=>inspect(zip([{name:'model.obj'},{name:'hidden.bin',bytes:Buffer.from('MZpayload')}])));
  assert.throws(()=>inspect(zip([{name:'parent.obj'},{name:'parent.obj/child.obj'}])),/collision/);
});
test('ZIP bounds expansion before inflation and rejects split/encrypted archives',()=>{
  const bytes=zip([{name:'model.obj',method:8}]),central=bytes.readUInt32LE(bytes.length-6),large=Buffer.from(bytes);large.writeUInt32LE(64*1024*1024+1,central+24);assert.throws(()=>inspect(large),/budget/);
  const split=Buffer.from(bytes);split.writeUInt16LE(1,split.length-18);assert.throws(()=>inspect(split),/split/);
  assert.throws(()=>inspect(zip([{name:'model.obj',flags:1}])),/coding/);
});
test('OBJ package materials resolve only inside the same verified package',()=>{
  const mesh=Buffer.from('mtllib materials.mtl\n'+obj),material=Buffer.from('newmtl blue\nKd 0 0 1\n');assert.equal(inspect(zip([{name:'model.obj',bytes:mesh},{name:'materials.mtl',bytes:material}])).kind,'model');
  assert.throws(()=>inspect(mesh,{filename:'mesh.obj'}),/outside/);
  assert.throws(()=>inspect(zip([{name:'model.obj',bytes:mesh},{name:'materials.mtl',bytes:Buffer.from('map_Kd https://unowned.invalid/texture.png')}])));
});
test('USDZ requires stored aligned members and a first USD layer, with no external resources',()=>{
  assert.equal(inspect(zip([{name:'scene.usda',bytes:usda}],{aligned:true}),{filename:'scene.usdz'}).extension,'usdz');
  assert.throws(()=>inspect(zip([{name:'scene.usda',bytes:usda}]),{filename:'scene.usdz'}),/aligned/);
  assert.throws(()=>inspect(zip([{name:'scene.usda',bytes:usda,method:8}],{aligned:true}),{filename:'scene.usdz'}),/uncompressed/);
  assert.throws(()=>inspect(zip([{name:'model.obj'},{name:'scene.usda',bytes:usda}],{aligned:true}),{filename:'scene.usdz'}),/default layer/);
  assert.throws(()=>inspect(zip([{name:'scene.usda',bytes:Buffer.from('#usda 1.0\ndef Xform "Object" (references = @https://evil.invalid/object.usda@) {}')}],{aligned:true}),{filename:'scene.usdz'}));
});
