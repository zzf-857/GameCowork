'use strict';
// Inspect model bytes only. No archive extraction, native importer or file IO.
// FBX node records: Blender's encode_bin.py. USDZ: openusd.org/spec_usdz.html.
const zlib=require('node:zlib');
const path=require('node:path').posix;
const MAX_FILE=64*1024*1024,MAX_EXPANDED=128*1024*1024,MAX_ENTRIES=4096;
const FBX_MAGIC=Buffer.from('Kaydara FBX Binary  \x00\x1a\x00','binary');
const MODEL_EXTENSIONS=new Set(['fbx','obj','stl','glb','gltf','usd','usda','usdc']);
const SIDECARS=new Set(['png','jpg','jpeg','webp','bmp','tga','exr','hdr','bin','mtl','json','txt']);
const CRC_TABLE=new Uint32Array(256);for(let n=0;n<256;n++){let v=n;for(let bit=0;bit<8;bit++)v=v>>>1^(v&1?0xedb88320:0);CRC_TABLE[n]=v;}
function crc(bytes){let v=0xffffffff;for(const b of bytes)v=v>>>8^CRC_TABLE[(v^b)&255];return(v^0xffffffff)>>>0;}
function bad(message){throw Error('Invalid/bounded model media: '+message);}
function range(bytes,offset,length,end=bytes.length){if(!Number.isSafeInteger(offset)||!Number.isSafeInteger(length)||offset<0||length<0||offset+length>end||end>bytes.length)bad('truncated structure');}
function u64(bytes,offset){range(bytes,offset,8);const v=bytes.readBigUInt64LE(offset);if(v>BigInt(Number.MAX_SAFE_INTEGER))bad('64-bit offset exceeds budget');return Number(v);}
function plain(bytes){try {const value=new TextDecoder('utf-8',{fatal:true}).decode(bytes);if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))bad('control text');return value;}catch{bad('invalid model text');}}
function relative(name,directory=false){
  if(typeof name!=='string'||!name||name.length>2048||name.includes('\\')||name.startsWith('/')||/[\u0000-\u001f\u007f:]/.test(name))bad('unsafe package path');
  const parts=(directory?name.slice(0,-1):name).split('/');
  if(parts.some(p=>!p||p==='.'||p==='..'||/[. ]$/.test(p)||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)))bad('unsafe package path');
  return parts.join('/').normalize('NFC');
}
function braces(value,{usd=false}={}) {
  let depth=0,quote=false,escape=false,comment=false;const clean=[];
  for(let i=0;i<value.length;i++) {const ch=value[i];
    if(comment){clean.push(ch==='\n'?'\n':' ');if(ch==='\n')comment=false;continue;}
    if(quote){clean.push(ch==='\n'?'\n':' ');if(escape){escape=false;continue;}if(ch==='\\'){escape=true;continue;}if(ch==='"')quote=false;continue;}
    if(ch==='"'){clean.push(' ');quote=true;continue;}if(ch===(usd?'#':';')){clean.push(' ');comment=true;continue;}
    clean.push(ch);
    if(ch==='{'){if(++depth>64)bad('text model nesting');}else if(ch==='}'&&--depth<0)bad('text model braces');
  }
  if(depth||quote||escape)bad('incomplete text model');return clean.join('');
}
function fbx(bytes){
  if(!bytes.subarray(0,FBX_MAGIC.length).equals(FBX_MAGIC)) {
    const value=plain(bytes);if(!/^\s*;\s*FBX\s+\d+/i.test(value))bad('ASCII FBX header');const clean=braces(value);
    const stack=[];let headers=0,objects=0,scenes=0,versions=0;
    for(const line of clean.split(/\r?\n/)){const name=line.match(/^\s*([A-Za-z_]\w*)\s*:/)?.[1];
      if(!stack.length&&name==='FBXHeaderExtension')headers++;if(!stack.length&&name==='Objects')objects++;
      if(stack.includes('Objects')&&['Geometry','Model','AnimationStack','AnimationCurve'].includes(name))scenes++;
      if(stack.includes('FBXHeaderExtension')&&/^\s*FBXVersion\s*:\s*7\d{3}\s*$/.test(line))versions++;
      for(const ch of line){if(ch==='{'){if(!name)bad('ASCII FBX anonymous node');stack.push(name);}else if(ch==='}')stack.pop();}
    }
    if(headers!==1||objects!==1||!scenes||versions!==1)bad('ASCII FBX scene structure');
    return{binary:false};
  }
  range(bytes,23,4);const version=bytes.readUInt32LE(23);if(version<7000||version>8000)bad('FBX version');
  const wide=version>=7500,header=wide?25:13;let nodes=0,totalProperties=0,expanded=0,headers=0,objects=0,scenes=0;
  const number=(offset)=>wide?u64(bytes,offset):bytes.readUInt32LE(offset);
  function props(offset,count,end) {
    if((totalProperties+=count)>1000000)bad('FBX property count');
    for(let i=0;i<count;i++) {
      range(bytes,offset,1,end);const type=String.fromCharCode(bytes[offset++]),scalar={Y:2,C:1,I:4,F:4,D:8,L:8}[type];
      if(scalar){range(bytes,offset,scalar,end);if(type==='F'&&!Number.isFinite(bytes.readFloatLE(offset))||type==='D'&&!Number.isFinite(bytes.readDoubleLE(offset)))bad('non-finite FBX value');offset+=scalar;continue;}
      if(type==='R'||type==='S'){range(bytes,offset,4,end);const size=bytes.readUInt32LE(offset);offset+=4;range(bytes,offset,size,end);if(size>MAX_FILE)bad('FBX property length');offset+=size;continue;}
      const unit={f:4,d:8,l:8,i:4,b:1,c:1}[type];if(!unit)bad('unknown FBX property type');
      range(bytes,offset,12,end);const length=bytes.readUInt32LE(offset),encoding=bytes.readUInt32LE(offset+4),size=bytes.readUInt32LE(offset+8),expected=length*unit;offset+=12;range(bytes,offset,size,end);
      if(expected>MAX_FILE||(expanded+=expected)>MAX_EXPANDED)bad('FBX array expansion');
      let array;if(encoding===0){if(size!==expected)bad('FBX array length');array=bytes.subarray(offset,offset+size);}
      else if(encoding===1){try{const result=zlib.inflateSync(bytes.subarray(offset,offset+size),{maxOutputLength:Math.max(1,expected),info:true});array=result.buffer;if(result.engine.bytesWritten!==size)bad('FBX compressed tail');}catch{bad('FBX compressed array');}if(array.length!==expected)bad('FBX decoded array length');}
      else bad('FBX array encoding');
      if(type==='f'||type==='d')for(let j=0;j<array.length;j+=unit)if(!Number.isFinite(type==='f'?array.readFloatLE(j):array.readDoubleLE(j)))bad('non-finite FBX array');
      offset+=size;
    }
    if(offset!==end)bad('FBX property table length');return offset;
  }
  function record(offset,parentEnd,depth=0,inObjects=false) {
    if(depth>64||++nodes>100000)bad('FBX node budget');range(bytes,offset,header,parentEnd);
    if(bytes.subarray(offset,offset+header).every(b=>b===0))return{end:offset+header,sentinel:true};
    const end=number(offset),count=number(offset+(wide?8:4)),propLength=number(offset+(wide?16:8)),nameLength=bytes[offset+header-1];
    if(end<=offset+header||end>parentEnd||count>1000000||!nameLength)bad('FBX node offsets');
    range(bytes,offset+header,nameLength,end);const name=bytes.toString('ascii',offset+header,offset+header+nameLength);if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))bad('FBX node name');
    if(!depth&&name==='FBXHeaderExtension')headers++;if(!depth&&name==='Objects')objects++;if(inObjects&&['Geometry','Model','AnimationStack','AnimationCurve'].includes(name))scenes++;
    let child=offset+header+nameLength;range(bytes,child,propLength,end);child=props(child,count,child+propLength);
    if(child<end){let terminated=false;while(child<end){const result=record(child,end,depth+1,inObjects||name==='Objects'&&!depth);child=result.end;if(result.sentinel){terminated=true;break;}}if(!terminated||child!==end)bad('FBX child sentinel');}
    return{end,sentinel:false};
  }
  let offset=27,terminated=false;while(offset<bytes.length){const result=record(offset,bytes.length);offset=result.end;if(result.sentinel){terminated=true;break;}}
  if(!terminated||headers!==1||objects!==1||!scenes)bad('FBX scene structure');
  // Standard footer contains a time/file ID, alignment, repeated version and padding.
  if(bytes.length-offset>512)bad('FBX unexpected trailing bytes');
  return{binary:true,version,nodeCount:nodes};
}
function obj(bytes,{packageNames,memberName}={}) {
  const value=plain(bytes);let vertices=0,normals=0,texcoords=0,faces=0;const resources=[];
  const finite=(tokens,min,max)=>{if(tokens.length<min||tokens.length>max||tokens.some(n=>!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/i.test(n)||!Number.isFinite(Number(n))||Math.abs(Number(n))>1e20))bad('OBJ numeric values');};
  const index=(n,total)=>{if(!/^-?[1-9]\d*$/.test(n)||Math.abs(Number(n))>total)bad('OBJ vertex index');};
  for(const line of value.split(/\r?\n/)) {
    if(line.length>1048576)bad('OBJ line budget');const source=line.replace(/#.*$/,'').trim();if(!source)continue;const [key,...tokens]=source.split(/\s+/);
    if(key==='v'){finite(tokens,3,4);if(++vertices>4000000)bad('OBJ vertex budget');}
    else if(key==='vn'){finite(tokens,3,3);normals++;}
    else if(key==='vt'){finite(tokens,1,3);texcoords++;}
    else if(key==='vp')finite(tokens,1,3);
    else if(key==='f'){if(tokens.length<3||tokens.length>65536)bad('OBJ polygon size');for(const token of tokens){const tuple=token.split('/');if(tuple.length>3||!tuple[0])bad('OBJ face tuple');index(tuple[0],vertices);if(tuple[1])index(tuple[1],texcoords);if(tuple[2])index(tuple[2],normals);}if(++faces>4000000)bad('OBJ face budget');}
    else if(key==='l'||key==='p'){for(const token of tokens)index(token.split('/')[0],vertices);}
    else if(key==='mtllib'){if(!tokens.length)bad('OBJ material reference');resources.push(...tokens);}
    else if(!['o','g','s','usemtl'].includes(key))bad('unsupported OBJ statement');
  }
  if(vertices<3||!faces)bad('OBJ has no mesh');
  for(const resource of resources){relative(resource);if(!packageNames||!packageNames.has(path.join(path.dirname(memberName),resource).toLowerCase()))bad('OBJ material is outside its owned package');}
  return{vertexCount:vertices,faceCount:faces};
}
function stl(bytes){
  if(bytes.length>=84){const count=bytes.readUInt32LE(80);if(count>0&&84+count*50===bytes.length){if(count>1000000)bad('STL face budget');for(let offset=84;offset<bytes.length;offset+=50)for(let p=0;p<48;p+=4)if(!Number.isFinite(bytes.readFloatLE(offset+p)))bad('STL non-finite coordinates');return{binary:true,faceCount:count};}}
  const value=plain(bytes);if(!/\bendsolid[^\r\n]*\s*$/.test(value))bad('STL closing record');const tokens=value.trim().split(/\s+/);let at=0,faces=0;
  const expect=(word)=>{if(tokens[at++]!==word)bad('ASCII STL grammar');};const number=()=>{if(!Number.isFinite(Number(tokens[at]))||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/i.test(tokens[at++]))bad('STL coordinates');};
  expect('solid');while(at<tokens.length&&tokens[at]!=='facet'&&tokens[at]!=='endsolid')at++;
  while(tokens[at]==='facet'){expect('facet');expect('normal');for(let i=0;i<3;i++)number();expect('outer');expect('loop');for(let v=0;v<3;v++){expect('vertex');for(let i=0;i<3;i++)number();}expect('endloop');expect('endfacet');if(++faces>1000000)bad('STL face budget');}
  expect('endsolid');if(tokens.slice(at).some(token=>['solid','endsolid','facet','vertex','normal','outer','loop','endloop','endfacet'].includes(token)))bad('STL trailing structure');if(!faces)bad('STL has no mesh');return{binary:false,faceCount:faces};
}
function usd(bytes,{packageNames,memberName}={}){
  if(bytes.toString('ascii',0,8)==='PXR-USDC'){
    range(bytes,0,88);if(bytes[8]!==0||bytes[9]>20)bad('USDC version');const offset=u64(bytes,16);range(bytes,offset,8);const count=u64(bytes,offset);if(count<6||count>64)bad('USDC section count');range(bytes,offset+8,count*32);const sections=new Set(),intervals=[];
    for(let i=0;i<count;i++){const item=offset+8+i*32,nameBytes=bytes.subarray(item,item+16),zero=nameBytes.indexOf(0);if(zero<1||!nameBytes.subarray(zero).every(b=>!b))bad('USDC section name');const name=nameBytes.toString('ascii',0,zero),start=u64(bytes,item+16),size=u64(bytes,item+24);if(!/^[A-Z]+$/.test(name)||sections.has(name)||start<88||size<1||start+size>offset)bad('USDC section bounds');sections.add(name);intervals.push([start,start+size]);}
    intervals.sort((a,b)=>a[0]-b[0]);for(let i=1;i<intervals.length;i++)if(intervals[i][0]<intervals[i-1][1])bad('USDC overlapping sections');
    for(const name of ['TOKENS','STRINGS','FIELDS','FIELDSETS','PATHS','SPECS'])if(!sections.has(name))bad('USDC missing scene section');
    return{binary:true,inspection:'container-structure'};
  }
  const value=plain(bytes);if(!/^#usda\s+1\.0/.test(value))bad('USDA header');braces(value,{usd:true});if(!/\b(?:def|over)\s+(?:\w+\s+)?"[^"\n]+"\s*(?:\([^]*?\))?\s*\{/.test(value))bad('USDA has no scene prim');
  for(const match of value.matchAll(/@([^@\r\n]+)@/g)){relative(match[1]);if(!packageNames||!packageNames.has(path.join(path.dirname(memberName),match[1]).toLowerCase()))bad('USD asset outside its owned package');}
  return{binary:false,inspection:'scene-structure'};
}
function gltf(bytes,{binary=false,packageNames,memberName}={}){
  let json,binarySize=0;
  if(binary){range(bytes,0,20);if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length||bytes.readUInt32LE(16)!==0x4e4f534a)bad('GLB container');const size=bytes.readUInt32LE(12);if(size%4||size>8*1024*1024)bad('GLB JSON budget');range(bytes,20,size);json=bytes.subarray(20,20+size);let at=20+size;while(at<bytes.length){range(bytes,at,8);const length=bytes.readUInt32LE(at),type=bytes.readUInt32LE(at+4);if(length%4)bad('GLB chunk alignment');range(bytes,at+8,length);if(type===0x004e4942)binarySize+=length;at+=8+length;}}
  else {if(bytes.length>8*1024*1024)bad('glTF JSON budget');json=bytes;}
  let scene;try{scene=JSON.parse(plain(json));}catch{bad('glTF JSON');}
  if(scene.asset?.version!=='2.0'||!Array.isArray(scene.meshes)||!scene.meshes.length||!Array.isArray(scene.accessors)||!Array.isArray(scene.buffers))bad('glTF has no geometry');
  for(const buffer of scene.buffers){if(!Number.isInteger(buffer.byteLength)||buffer.byteLength<1||buffer.byteLength>MAX_FILE||!buffer.uri&&(!binary||buffer.byteLength>binarySize))bad('glTF buffer bounds');}
  for(const resource of [...scene.buffers,...(scene.images||[])])if(resource.uri){
    if(/^data:[\w+./-]+;base64,[A-Za-z0-9+/=]+$/.test(resource.uri))continue;relative(resource.uri);if(!packageNames||!packageNames.has(path.join(path.dirname(memberName),resource.uri).toLowerCase()))bad('glTF resource outside its owned package');
  }
  return{inspection:'container-and-geometry'};
}
function extra(bytes,offset,length){range(bytes,offset,length);const end=offset+length;while(offset<end){range(bytes,offset,4,end);const id=bytes.readUInt16LE(offset),size=bytes.readUInt16LE(offset+2);offset+=4;range(bytes,offset,size,end);if(id===1)bad('ZIP64 is outside bounded package support');offset+=size;}}
function sidecar(bytes,extension) {
  if(bytes.subarray(0,2).toString('ascii')==='MZ'||bytes.subarray(0,4).equals(Buffer.from([127,69,76,70])))bad('executable package member');
  if(extension==='png'){
    if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))bad('PNG package texture');let offset=8,header=false,data=false,ended=false;
    while(offset<bytes.length){range(bytes,offset,12);const size=bytes.readUInt32BE(offset),type=bytes.toString('ascii',offset+4,offset+8);range(bytes,offset+8,size+4);if(crc(bytes.subarray(offset+4,offset+8+size))!==bytes.readUInt32BE(offset+8+size))bad('PNG texture checksum');
      if(!header){if(type!=='IHDR'||size!==13||!bytes.readUInt32BE(offset+8)||!bytes.readUInt32BE(offset+12)||bytes.readUInt32BE(offset+8)*bytes.readUInt32BE(offset+12)>16777216)bad('PNG texture dimensions');header=true;}if(type==='IDAT')data=true;offset+=size+12;if(type==='IEND'){if(size)bad('PNG texture terminator');ended=true;break;}}
    if(!ended||!data||offset!==bytes.length)bad('PNG texture incomplete');
  }else if(extension==='jpg'||extension==='jpeg'){if(bytes.length<4||bytes.readUInt16BE(0)!==0xffd8||bytes.readUInt16BE(bytes.length-2)!==0xffd9)bad('JPEG package texture');}
  else if(extension==='webp'){if(bytes.length<20||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||bytes.readUInt32LE(4)+8!==bytes.length)bad('WebP package texture');}
  else if(extension==='bmp'){if(bytes.length<54||bytes.toString('ascii',0,2)!=='BM'||bytes.readUInt32LE(2)!==bytes.length||bytes.readUInt32LE(10)>=bytes.length)bad('BMP package texture');}
  else if(extension==='tga'){if(bytes.length<18||![2,3,10,11].includes(bytes[2])||!bytes.readUInt16LE(12)||!bytes.readUInt16LE(14)||![8,16,24,32].includes(bytes[16]))bad('TGA package texture');}
  else if(extension==='hdr'){if(!bytes.toString('ascii',0,32).startsWith('#?RADIANCE'))bad('HDR package texture');}
  else if(extension==='exr'){if(bytes.length<100||bytes.readUInt32LE(0)!==20000630||(bytes.readUInt32LE(4)&255)!==2)bad('EXR package texture');}
}
function archive(bytes,{usdz=false}={}) {
  let eocd=-1;for(let offset=bytes.length-22;offset>=Math.max(0,bytes.length-65557);offset--)if(bytes.readUInt32LE(offset)===0x06054b50&&offset+22+bytes.readUInt16LE(offset+20)===bytes.length){eocd=offset;break;}if(eocd<0)bad('ZIP directory not complete');
  if(bytes.readUInt16LE(eocd+4)||bytes.readUInt16LE(eocd+6))bad('split ZIP');const count=bytes.readUInt16LE(eocd+10),centralSize=bytes.readUInt32LE(eocd+12),centralOffset=bytes.readUInt32LE(eocd+16);
  if(!count||count>MAX_ENTRIES||count!==bytes.readUInt16LE(eocd+8)||centralOffset+centralSize!==eocd)bad('ZIP directory bounds');range(bytes,centralOffset,centralSize,eocd);
  let at=centralOffset,expanded=0;const entries=[],names=new Set();
  for(let i=0;i<count;i++){
    range(bytes,at,46,eocd);if(bytes.readUInt32LE(at)!==0x02014b50)bad('ZIP central signature');
    const flags=bytes.readUInt16LE(at+8),method=bytes.readUInt16LE(at+10),sum=bytes.readUInt32LE(at+16),compressed=bytes.readUInt32LE(at+20),size=bytes.readUInt32LE(at+24),nameLength=bytes.readUInt16LE(at+28),extraLength=bytes.readUInt16LE(at+30),commentLength=bytes.readUInt16LE(at+32),disk=bytes.readUInt16LE(at+34),attrs=bytes.readUInt32LE(at+38),local=bytes.readUInt32LE(at+42);
    if(flags&~0x080e||![0,8].includes(method)||disk||size>MAX_FILE||(expanded+=size)>MAX_EXPANDED)bad('ZIP coding/expansion budget');range(bytes,at+46,nameLength+extraLength+commentLength,eocd);
    const nameBytes=bytes.subarray(at+46,at+46+nameLength);if(!(flags&0x0800)&&nameBytes.some(b=>b>127))bad('ZIP filename encoding');const rawName=plain(nameBytes),directory=rawName.endsWith('/'),name=relative(rawName,directory),normalized=name.toLowerCase();if(names.has(normalized))bad('ZIP duplicate member');names.add(normalized);
    const unixType=(attrs>>>16)&0xf000;if(unixType&&unixType!==0x8000&&unixType!==0x4000||unixType===0x4000&&!directory||unixType===0x8000&&directory)bad('ZIP linked/special member');
    extra(bytes,at+46+nameLength,extraLength);range(bytes,local,30,centralOffset);if(bytes.readUInt32LE(local)!==0x04034b50||bytes.readUInt16LE(local+6)!==flags||bytes.readUInt16LE(local+8)!==method)bad('ZIP local/central mismatch');
    const localNameLength=bytes.readUInt16LE(local+26),localExtraLength=bytes.readUInt16LE(local+28);range(bytes,local+30,localNameLength+localExtraLength,centralOffset);if(localNameLength!==nameLength||!bytes.subarray(local+30,local+30+localNameLength).equals(nameBytes))bad('ZIP member name mismatch');extra(bytes,local+30+localNameLength,localExtraLength);
    if(!(flags&8)&&(bytes.readUInt32LE(local+14)!==sum||bytes.readUInt32LE(local+18)!==compressed||bytes.readUInt32LE(local+22)!==size))bad('ZIP local size/checksum mismatch');
    if(flags&8)for(const [offset,expected]of[[14,sum],[18,compressed],[22,size]])if(bytes.readUInt32LE(local+offset)!==0&&bytes.readUInt32LE(local+offset)!==expected)bad('ZIP descriptor header mismatch');
    const start=local+30+localNameLength+localExtraLength;range(bytes,start,compressed,centralOffset);let end=start+compressed;
    if(flags&8){range(bytes,end,12,centralOffset);if(bytes.readUInt32LE(end)===0x08074b50){range(bytes,end,16,centralOffset);end+=4;}if(bytes.readUInt32LE(end)!==sum||bytes.readUInt32LE(end+4)!==compressed||bytes.readUInt32LE(end+8)!==size)bad('ZIP descriptor mismatch');end+=12;}
    let contents;if(method===0){if(compressed!==size)bad('ZIP stored size');contents=bytes.subarray(start,start+compressed);}else{try{const decoded=zlib.inflateRawSync(bytes.subarray(start,start+compressed),{maxOutputLength:Math.max(1,size),info:true});contents=decoded.buffer;if(decoded.engine.bytesWritten!==compressed)bad('ZIP compressed tail');}catch{bad('ZIP compressed member');}}
    if(contents.length!==size||crc(contents)!==sum||directory&&size)bad('ZIP member integrity');
    if(usdz&&(method!==0||start%64))bad('USDZ needs uncompressed 64-byte-aligned members');
    entries.push({name,directory,local,start,end,contents});at+=46+nameLength+extraLength+commentLength;
  }
  if(at!==eocd)bad('ZIP central tail');const ordered=[...entries].sort((a,b)=>a.local-b.local);let end=0;for(const entry of ordered){if(entry.local!==end)bad('ZIP hidden/overlapping local data');end=entry.end;}if(end!==centralOffset)bad('ZIP local directory gap');
  const types=new Map(entries.map(entry=>[entry.name.toLowerCase(),entry.directory]));for(const entry of entries){let parent=path.dirname(entry.name).toLowerCase();while(parent!=='.'){if(types.has(parent)&&!types.get(parent))bad('ZIP file/directory collision');parent=path.dirname(parent);}}
  if(usdz&&!['usd','usda','usdc'].includes(path.extname(ordered.find(e=>!e.directory)?.name||'').slice(1).toLowerCase()))bad('USDZ default layer must be first');
  let models=0;
  for(const entry of entries){if(entry.directory)continue;const ext=path.extname(entry.name).slice(1).toLowerCase();
    if(usdz&&!['usd','usda','usdc','png','jpg','jpeg','exr'].includes(ext))bad('unsupported USDZ member type');
    if(MODEL_EXTENSIONS.has(ext)){
      if(ext==='fbx')fbx(entry.contents);else if(ext==='obj')obj(entry.contents,{packageNames:names,memberName:entry.name});else if(ext==='stl')stl(entry.contents);else if(ext==='glb'||ext==='gltf')gltf(entry.contents,{binary:ext==='glb',packageNames:names,memberName:entry.name});else usd(entry.contents,{packageNames:names,memberName:entry.name});models++;
    }else if(!SIDECARS.has(ext))bad('unsupported model-package member');
    else if(['json','txt','mtl'].includes(ext)){if(entry.contents.length>8*1024*1024)bad('model sidecar text budget');const value=plain(entry.contents);if(ext==='json'){try{JSON.parse(value);}catch{bad('model report JSON');}}if(ext==='mtl'){
      if(/(?:^|\n)\s*(?:call|csh)\b/.test(value))bad('executable material statement');for(const line of value.split(/\r?\n/)){if(/^\s*(?:map_\w+|bump|disp|decal|refl)\s+/.test(line)){const texture=line.trim().split(/\s+/).at(-1);relative(texture);if(!names.has(path.join(path.dirname(entry.name),texture).toLowerCase()))bad('MTL texture outside its owned package');}}
    }}
    else sidecar(entry.contents,ext);
  }
  if(!models)bad('package contains no model');
  return{entryCount:entries.length,modelCount:models,expandedByteLength:expanded,inspection:'package-members-and-model-structure'};
}
function inspectModelMedia(bytes,{mimeHint='',filename=''}={}) {
  if(!Buffer.isBuffer(bytes))bad('Buffer required');if(bytes.length>MAX_FILE)bad('file exceeds 64 MiB');
  const hintExt=String(filename).split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase()||'';
  const hint=String(mimeHint).split(';')[0].toLowerCase().trim();
  const result=(mime,extension,details={})=>({mime,extension,kind:'model',...details});
  if(bytes.length>=4&&bytes.readUInt32LE(0)===0x04034b50||['zip','usdz'].includes(hintExt)||['application/zip','model/vnd.usdz+zip'].includes(hint))return result(hintExt==='usdz'||hint==='model/vnd.usdz+zip'?'model/vnd.usdz+zip':'application/zip',hintExt==='usdz'||hint==='model/vnd.usdz+zip'?'usdz':'zip',archive(bytes,{usdz:hintExt==='usdz'||hint==='model/vnd.usdz+zip'}));
  if(bytes.subarray(0,FBX_MAGIC.length).equals(FBX_MAGIC)||hintExt==='fbx'||/^\s*;\s*FBX\s+\d+/i.test(bytes.toString('ascii',0,100)))return result('application/vnd.autodesk.fbx','fbx',fbx(bytes));
  if(hintExt==='obj'||hint==='model/obj'||/^\s*(?:#[^\n]*\n\s*)*v\s+[-+\d.]/.test(bytes.toString('utf8',0,1024)))return result('model/obj','obj',obj(bytes));
  if(hintExt==='stl'||hint==='model/stl'||bytes.length>=84&&bytes.readUInt32LE(80)>0&&84+bytes.readUInt32LE(80)*50===bytes.length||/^\s*solid\s/.test(bytes.toString('ascii',0,100)))return result('model/stl','stl',stl(bytes));
  if(['usd','usda','usdc'].includes(hintExt)||bytes.toString('ascii',0,8)==='PXR-USDC'||bytes.toString('ascii',0,5)==='#usda')return result('model/vnd.usd',bytes.toString('ascii',0,8)==='PXR-USDC'?'usdc':'usda',usd(bytes));
  if(hintExt==='gltf'||hint==='model/gltf+json')return result('model/gltf+json','gltf',gltf(bytes));
  // Existing Core owns GLB validation; this helper does not supersede it.
  return null;
}
module.exports={inspectModelMedia};
