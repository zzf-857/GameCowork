const fs=require('node:fs'),path=require('node:path'),test=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto'),{execFileSync}=require('node:child_process');
const {inspectVideoMedia}=require('../../src/core/binary/out/modules/media/video.js');
const root=path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/2026-10-07-ai-assets/thirdparty/video-'+randomUUID());
let media,landscape;
test.before(async()=>{
  const {createOwnedGenerationMedia}=await import('../fixtures/asset-generation-provider-fixture.mjs');media=createOwnedGenerationMedia(root);
  const file=path.join(root,'landscape-audio.mp4');execFileSync('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=0x17b89a:s=96x64:d=1','-f','lavfi','-i','sine=frequency=440:duration=1','-map','0:v','-map','1:a','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart','-shortest',file],{windowsHide:true,timeout:30000});landscape=fs.readFileSync(file);
});
function mp4Boxes(bytes,start=0,end=bytes.length){const rows=[];for(let offset=start;offset<end;){const size=bytes.readUInt32BE(offset);rows.push({type:bytes.toString('ascii',offset+4,offset+8),offset,start:offset+8,end:offset+size});offset+=size;}return rows;}
function movie(bytes){return mp4Boxes(bytes).find(box=>box.type==='moov');}
function videoTrack(bytes){return mp4Boxes(bytes,movie(bytes).start,movie(bytes).end).find(box=>box.type==='trak'&&bytes.subarray(box.start,box.end).includes(Buffer.from('vide')));}
function header(bytes){const track=videoTrack(bytes);return mp4Boxes(bytes,track.start,track.end).find(box=>box.type==='tkhd');}
function setMatrix(bytes,box,offset,values){for(let index=0;index<9;index++)bytes.writeInt32BE(values[index],box.start+offset+index*4);}
const identity=[65536,0,0,0,65536,0,0,0,1073741824],ninety=[0,65536,0,-65536,0,0,0,0,1073741824];
function atom(type,payload){const bytes=Buffer.alloc(payload.length+8);bytes.writeUInt32BE(bytes.length);bytes.write(type,4,4,'ascii');payload.copy(bytes,8);return bytes;}
function minimalMp4(version){const mvhd=Buffer.alloc(100);identity.forEach((value,index)=>mvhd.writeInt32BE(value,36+index*4));const tkhd=Buffer.alloc(version===1?96:84);tkhd[0]=version;tkhd[3]=1;const matrix=version===1?52:40;identity.forEach((value,index)=>tkhd.writeInt32BE(value,matrix+index*4));tkhd.writeUInt32BE(1280*65536,matrix+36);tkhd.writeUInt32BE(720*65536,matrix+40);const hdlr=Buffer.alloc(20);hdlr.write('vide',8);return Buffer.concat([atom('ftyp',Buffer.from('isom0000')),atom('moov',Buffer.concat([atom('mvhd',mvhd),atom('trak',Buffer.concat([atom('tkhd',tkhd),atom('mdia',atom('hdlr',hdlr))]))])),atom('mdat',Buffer.from([1]))]);}

test('Actual encoded FFmpeg MP4/WebM files report stored video dimensions independently of a requested specification',()=>{
  for(const extension of ['mp4','webm']){const value=inspectVideoMedia(media[extension].bytes);assert.equal(value.width,32);assert.equal(value.height,32);assert.equal(value.encodedWidth,32);assert.equal(value.encodedHeight,32);assert.equal(value.dimensionKind,'display');assert.equal(value.dimensionsStatus,'known');}
  const value=inspectVideoMedia(landscape);assert.equal(value.width,96);assert.equal(value.height,64);assert.equal(value.encodedWidth,96);assert.equal(value.encodedHeight,64);
});
test('MP4 follows the video handler instead of audio-first track ordering and ignores disabled video tracks',()=>{
  const top=movie(landscape),children=mp4Boxes(landscape,top.start,top.end),tracks=children.filter(box=>box.type==='trak'),audio=tracks.find(box=>!landscape.subarray(box.start,box.end).includes(Buffer.from('vide'))),video=videoTrack(landscape);
  const reordered=Buffer.concat([landscape.subarray(0,top.start),...children.filter(box=>box.type!=='trak').map(box=>landscape.subarray(box.offset,box.end)),landscape.subarray(audio.offset,audio.end),landscape.subarray(video.offset,video.end),landscape.subarray(top.end)]);assert.equal(inspectVideoMedia(reordered).width,96);assert.equal(inspectVideoMedia(reordered).height,64);
  const disabled=Buffer.from(landscape),tkhd=header(disabled);disabled[tkhd.start+3]=0;assert.equal(inspectVideoMedia(disabled).dimensionsStatus,'unknown');
});
test('MP4 rotation changes presentation dimensions while encoded pixels stay exact; the modified real fixture is recognized by ffprobe',()=>{
  const bytes=Buffer.from(landscape);setMatrix(bytes,header(bytes),40,ninety);const output=path.join(root,'rotated-own.mp4');fs.writeFileSync(output,bytes,{flag:'wx'});
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height:stream_side_data=rotation','-of','json',output],{windowsHide:true,timeout:10000}).toString('utf8'));assert.equal(probe.streams[0].width,96);assert.equal(probe.streams[0].height,64);assert.equal(Math.abs(probe.streams[0].side_data_list[0].rotation),90);
  const value=inspectVideoMedia(bytes);assert.equal(value.width,64);assert.equal(value.height,96);assert.equal(value.encodedWidth,96);assert.equal(value.encodedHeight,64);assert.equal(value.rotationDegrees,90);
  const mvhd=mp4Boxes(bytes,movie(bytes).start,movie(bytes).end).find(box=>box.type==='mvhd');setMatrix(bytes,mvhd,36,ninety);const rotatedTwice=inspectVideoMedia(bytes);assert.equal(rotatedTwice.width,96);assert.equal(rotatedTwice.height,64);assert.equal(rotatedTwice.rotationDegrees,180);
});
test('MP4 version-one track headers retain 64-bit time field offsets; missing or unsupported matrices never invent dimensions',()=>{
  for(const version of [0,1]){const result=inspectVideoMedia(minimalMp4(version));assert.equal(result.width,1280);assert.equal(result.height,720);}
  const perspective=Buffer.from(landscape);setMatrix(perspective,header(perspective),40,[65536,0,1,0,65536,0,0,0,1073741824]);const unknown=inspectVideoMedia(perspective);assert.equal(unknown.width,undefined);assert.equal(unknown.height,undefined);assert.equal(unknown.encodedWidth,96);assert.equal(unknown.dimensionsStatus,'unknown');
  const fractional=Buffer.from(landscape);fractional.writeUInt32BE(96*65536+32768,header(fractional).start+76);assert.equal(inspectVideoMedia(fractional).width,undefined);
});
test('Multiple enabled MP4 video tracks stay unknown rather than assigning the first track pixels to the entire file',()=>{
  const top=movie(landscape),video=videoTrack(landscape),copy=landscape.subarray(video.offset,video.end),repeated=Buffer.concat([landscape.subarray(0,top.end),copy,landscape.subarray(top.end)]);repeated.writeUInt32BE(top.end-top.offset+copy.length,top.offset);assert.equal(inspectVideoMedia(repeated).width,undefined);assert.equal(inspectVideoMedia(repeated).dimensionsStatus,'unknown');
});
test('Truncated, oversized or nested MP4 boundaries are rejected, and extended top-level boxes remain bounded',()=>{
  for(const bytes of [landscape.subarray(0,landscape.length-1),Buffer.concat([landscape,Buffer.from([1])])])assert.throws(()=>inspectVideoMedia(bytes),/container/);
  const nested=Buffer.from(landscape),tkhd=header(nested);nested.writeUInt32BE(0xffffffff,tkhd.offset);assert.throws(()=>inspectVideoMedia(nested),/parent/);
  const large=Buffer.from(landscape);large.writeUInt32BE(0xffffffff,0);assert.throws(()=>inspectVideoMedia(large),/parent/);
  const original=mp4Boxes(landscape)[0],extended=Buffer.alloc(16);extended.writeUInt32BE(1);extended.write('ftyp',4);extended.writeBigUInt64BE(BigInt(original.end-original.offset+8),8);const valid=Buffer.concat([extended,landscape.subarray(original.start,original.end),landscape.subarray(original.end)]);assert.equal(inspectVideoMedia(valid).width,96);
  extended.writeBigUInt64BE(1n<<63n,8);assert.throws(()=>inspectVideoMedia(Buffer.concat([extended,landscape.subarray(original.start)])),/exceeds parent/);
});
function size(value){for(let length=1;length<=4;length++)if(value<(2**(length*7))-1){const bytes=Buffer.alloc(length);let n=value;for(let index=length-1;index>=0;index--){bytes[index]=n&255;n=Math.floor(n/256);}bytes[0]|=1<<(8-length);return bytes;}throw Error('Fixture size bound');}
function element(id,payload){const label=Buffer.from(id,'hex');return Buffer.concat([label,size(payload.length),payload]);}
function unsigned(id,value){let length=1;while(value>=2**(length*8))length++;const data=Buffer.alloc(length);data.writeUIntBE(value,0,length);return element(id,data);}
function webm(videoFields=[],{extraTracks=[],unknownSegment=false}={}){const header=element('1a45dfa3',element('4282',Buffer.from('webm'))),video=element('ae',Buffer.concat([unsigned('83',1),element('e0',Buffer.concat([unsigned('b0',96),unsigned('ba',64),...videoFields]))])),tracks=element('1654ae6b',Buffer.concat([...extraTracks,video])),payload=Buffer.concat([tracks,element('1f43b675',Buffer.from([0]))]);return Buffer.concat([header,unknownSegment?Buffer.concat([Buffer.from('1853806701ffffffffffffff','hex'),payload]):element('18538067',payload)]);}

test('WebM scopes pixels to a video TrackEntry and applies explicitly stored crop and pixel display dimensions',()=>{
  const audio=element('ae',Buffer.concat([unsigned('83',2),element('e1',unsigned('9f',2))]));const normal=inspectVideoMedia(webm([],{extraTracks:[audio],unknownSegment:true}));assert.equal(normal.width,96);assert.equal(normal.height,64);assert.equal(normal.encodedWidth,96);
  const cropped=inspectVideoMedia(webm([unsigned('54cc',3),unsigned('54dd',3),unsigned('54bb',2),unsigned('54aa',2)]));assert.equal(cropped.width,90);assert.equal(cropped.height,60);assert.equal(cropped.encodedWidth,96);assert.equal(cropped.encodedHeight,64);
  const display=inspectVideoMedia(webm([unsigned('54b0',128),unsigned('54ba',72),unsigned('54b2',0)]));assert.equal(display.width,128);assert.equal(display.height,72);assert.equal(display.encodedWidth,96);
});
test('WebM aspect-ratio units, duplicate pixel declarations, excessive crops and multiple enabled video tracks stay unknown',()=>{
  const another=element('ae',Buffer.concat([unsigned('83',1),element('e0',Buffer.concat([unsigned('b0',192),unsigned('ba',108)]))]));
  for(const bytes of [webm([unsigned('54b2',3),unsigned('54b0',16),unsigned('54ba',9)]),webm([unsigned('b0',120)]),webm([unsigned('54cc',96)]),webm([],{extraTracks:[another]}),webm([element('7670',Buffer.alloc(0))])]){const result=inspectVideoMedia(bytes);assert.equal(result.width,undefined);assert.equal(result.height,undefined);assert.equal(result.dimensionsStatus,'unknown');}
});
test('WebM element bounds, missing stored cluster, unknown-sized non-master data and parsing budgets reject without scanning pixel payload',()=>{
  const valid=webm();assert.throws(()=>inspectVideoMedia(valid.subarray(0,valid.length-1)),/parent/);
  const missing=Buffer.concat([element('1a45dfa3',element('4282',Buffer.from('webm'))),element('18538067',Buffer.alloc(0))]);assert.throws(()=>inspectVideoMedia(missing),/no stored cluster/);
  const unknown=webm([Buffer.from('b0ff','hex')]);assert.throws(()=>inspectVideoMedia(unknown),/unknown-sized/);
  const crowded=webm(Array.from({length:20001},()=>element('ec',Buffer.alloc(0))));assert.throws(()=>inspectVideoMedia(crowded),/count bound/);
  assert.equal(inspectVideoMedia(Buffer.from('ordinary text')),null);
});
