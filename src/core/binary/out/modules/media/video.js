'use strict';
// Bounded container metadata, not codec decoding. Field layouts are checked
// against FFmpeg n8.0 mov_read_tkhd and the Matroska/EBML specifications:
// https://github.com/FFmpeg/FFmpeg/blob/n8.0/libavformat/mov.c
// https://www.matroska.org/technical/elements.html
// https://datatracker.ietf.org/doc/html/rfc8794
const MAX_FILE=64*1024*1024,MAX_ELEMENTS=20000,MAX_PIXELS=64*1024*1024;
const VISUAL_ENTRIES=new Set(['avc1','avc3','hvc1','hev1','vp08','vp09','av01','mp4v']);
function check(value,message){if(!value)throw Error('Invalid video container: '+message);}
function dimensions(width,height){return Number.isInteger(width)&&Number.isInteger(height)&&width>0&&height>0&&width<=16384&&height<=16384&&width*height<=MAX_PIXELS;}
function metadata(width,height,extra,source){return dimensions(width,height)?{width,height,dimensionKind:'display',dimensionsSource:source,dimensionsStatus:'known',...extra}:{dimensionsStatus:'unknown',...extra};}
function inspectMp4(bytes) {
  let count=0;
  function boxes(start,end) {
    const result=[];
    for(let offset=start;offset<end;) {
      check(++count<=MAX_ELEMENTS&&offset+8<=end,'MP4 box count or header bound');
      let size=bytes.readUInt32BE(offset),header=8;
      if(size===1){check(offset+16<=end,'truncated extended MP4 box');const extended=bytes.readBigUInt64BE(offset+8);check(extended<=BigInt(end-offset),'extended MP4 box exceeds parent');size=Number(extended);header=16;}
      else if(size===0)size=end-offset;
      check(size>=header&&size<=end-offset,'MP4 box exceeds its parent');
      result.push({type:bytes.toString('ascii',offset+4,offset+8),start:offset+header,end:offset+size});offset+=size;
    }
    return result;
  }
  const children=box=>boxes(box.start,box.end),one=(rows,type)=>{const found=rows.filter(box=>box.type===type);return found.length===1?found[0]:undefined;};
  const top=boxes(0,bytes.length),moov=one(top,'moov');check(moov&&top.some(box=>box.type==='mdat'&&box.end>box.start),'Incomplete MP4 media');
  const movie=children(moov),mvhd=one(movie,'mvhd');
  function rotation(box,offset) {
    if(!box||offset+36>box.end)return undefined;
    const values=Array.from({length:9},(_,index)=>bytes.readInt32BE(offset+index*4));
    if(values[2]!==0||values[5]!==0||values[8]!==1073741824)return undefined;
    const [a,b,c,d]=[values[0],values[1],values[3],values[4]].map(value=>value/65536);
    if(![a,b,c,d].every(value=>[0,1,-1].includes(value))||a*a+b*b!==1||c*c+d*d!==1||a*c+b*d!==0||a*d-b*c!==1)return undefined;
    return [a,b,c,d];
  }
  const movieVersion=mvhd&&bytes[mvhd.start],movieRotation=mvhd&&[0,1].includes(movieVersion)?rotation(mvhd,mvhd.start+(movieVersion===1?48:36)):undefined;
  function sampleDimensions(mdia) {
    const minf=one(children(mdia),'minf');if(!minf)return {};
    const stbl=one(children(minf),'stbl');if(!stbl)return {};
    const stsd=one(children(stbl),'stsd');if(!stsd||stsd.end-stsd.start<8)return {};
    const entries=boxes(stsd.start+8,stsd.end);if(entries.length!==bytes.readUInt32BE(stsd.start+4)||entries.length!==1)return {};
    const entry=entries[0];if(!VISUAL_ENTRIES.has(entry.type)||entry.end-entry.start<78)return {};
    const encodedWidth=bytes.readUInt16BE(entry.start+24),encodedHeight=bytes.readUInt16BE(entry.start+26);
    return dimensions(encodedWidth,encodedHeight)?{encodedWidth,encodedHeight}:{};
  }
  const tracks=[];
  for(const track of movie.filter(box=>box.type==='trak')) {
    const fields=children(track),mdia=one(fields,'mdia');if(!mdia)continue;
    const hdlr=one(children(mdia),'hdlr');if(!hdlr||hdlr.end-hdlr.start<12||bytes.toString('ascii',hdlr.start+8,hdlr.start+12)!=='vide')continue;
    const tkhd=one(fields,'tkhd'),version=tkhd&&bytes[tkhd.start];
    if(tkhd&&tkhd.end-tkhd.start>=4&&(bytes.readUInt32BE(tkhd.start)&1)===0)continue;
    const encoded=sampleDimensions(mdia);
    if(!tkhd||![0,1].includes(version)||tkhd.end-tkhd.start<(version===1?96:84)){tracks.push({dimensionsStatus:'unknown',...encoded});continue;}
    const position=tkhd.start+(version===1?52:40),trackRotation=rotation(tkhd,position);
    const rawWidth=bytes.readUInt32BE(position+36),rawHeight=bytes.readUInt32BE(position+40),width=rawWidth/65536,height=rawHeight/65536;
    if(!trackRotation||!movieRotation||!dimensions(width,height)){tracks.push({dimensionsStatus:'unknown',...encoded});continue;}
    const [a,b,c,d]=trackRotation,[e,f,g,h]=movieRotation,combined=[a*e+b*g,a*f+b*h,c*e+d*g,c*f+d*h];
    const rotationDegrees=(Math.round(Math.atan2(combined[1],combined[0])*180/Math.PI)+360)%360,swap=combined[0]===0;
    tracks.push(metadata(swap?height:width,swap?width:height,{...encoded,rotationDegrees},'mp4-video-track-header'));
  }
  return {mime:'video/mp4',extension:'mp4',kind:'video',...(tracks.length===1?tracks[0]:{dimensionsStatus:'unknown'})};
}
function inspectWebm(bytes) {
  let count=0;
  function vint(offset,end,id=false) {
    check(offset<end&&bytes[offset]!==0,'invalid EBML variable integer');let length=1,mask=128;while(!(bytes[offset]&mask)){mask>>=1;length++;}
    check(length<=(id?4:8)&&offset+length<=end,'truncated EBML variable integer');
    let value=BigInt(id?bytes[offset]:bytes[offset]&(mask-1));for(let index=1;index<length;index++)value=value*256n+BigInt(bytes[offset+index]);
    const unknown=!id&&value===(1n<<BigInt(length*7))-1n;
    check(unknown||value<=BigInt(Number.MAX_SAFE_INTEGER),'oversized EBML value');return {length,value:Number(value),unknown};
  }
  function elements(start,end,allowUnknown=[]) {
    const result=[];
    for(let offset=start;offset<end;) {
      check(++count<=MAX_ELEMENTS,'EBML element count bound');const id=vint(offset,end,true),size=vint(offset+id.length,end),data=offset+id.length+size.length;
      check(!size.unknown||allowUnknown.includes(id.value),'unsupported unknown-sized EBML element');
      check(size.unknown||size.value<=end-data,'EBML element exceeds its parent');
      const boundary=size.unknown?end:data+size.value;result.push({id:id.value,start:data,end:boundary,unknown:size.unknown});offset=boundary;
    }
    return result;
  }
  const children=element=>elements(element.start,element.end),one=(rows,id)=>{const found=rows.filter(element=>element.id===id);return found.length===1?found[0]:undefined;};
  function uint(element) {if(!element)return undefined;const size=element.end-element.start;if(size<1||size>8)return undefined;let value=0n;for(let index=element.start;index<element.end;index++)value=value*256n+BigInt(bytes[index]);return value<=BigInt(Number.MAX_SAFE_INTEGER)?Number(value):undefined;}
  const top=elements(0,bytes.length,[0x18538067]),header=one(top,0x1a45dfa3),segment=one(top,0x18538067);check(header&&segment,'missing EBML header or WebM segment');
  const docType=one(children(header),0x4282);check(docType&&bytes.toString('ascii',docType.start,docType.end)==='webm','unsupported EBML document type');
  const sections=elements(segment.start,segment.end,[0x1f43b675]);check(sections.some(element=>element.id===0x1f43b675&&element.end>element.start),'WebM has no stored cluster');
  const trackSection=one(sections,0x1654ae6b),tracks=[];
  for(const entry of trackSection?children(trackSection).filter(element=>element.id===0xae):[]) {
    const fields=children(entry);if(uint(one(fields,0x83))!==1)continue;
    const enabled=uint(one(fields,0xb9));if(enabled===0)continue;
    const video=one(fields,0xe0);if(!video){tracks.push({dimensionsStatus:'unknown'});continue;}
    const values=children(video),field=id=>uint(one(values,id));
    const encodedWidth=field(0xb0),encodedHeight=field(0xba);if(!dimensions(encodedWidth,encodedHeight)){tracks.push({dimensionsStatus:'unknown'});continue;}
    const encoded={encodedWidth,encodedHeight},crop=[0x54cc,0x54dd,0x54bb,0x54aa].map(id=>one(values,id)?field(id):0),unit=one(values,0x54b2)?field(0x54b2):0;
    if(unit!==0||crop.some(value=>!Number.isInteger(value)||value<0)||crop[0]+crop[1]>=encodedWidth||crop[2]+crop[3]>=encodedHeight||values.some(element=>element.id===0x7670)||field(0x53b8)>0){tracks.push({dimensionsStatus:'unknown',...encoded});continue;}
    const width=one(values,0x54b0)?field(0x54b0):encodedWidth-crop[0]-crop[1],height=one(values,0x54ba)?field(0x54ba):encodedHeight-crop[2]-crop[3];
    tracks.push(metadata(width,height,encoded,'webm-video-track'));
  }
  return {mime:'video/webm',extension:'webm',kind:'video',...(tracks.length===1?tracks[0]:{dimensionsStatus:'unknown'})};
}
function inspectVideoMedia(value) {
  if(!Buffer.isBuffer(value)&&!(value instanceof Uint8Array))throw TypeError('Expected video bytes');
  const bytes=Buffer.isBuffer(value)?value:Buffer.from(value.buffer,value.byteOffset,value.byteLength);
  const mp4=bytes.length>=8&&bytes.toString('ascii',4,8)==='ftyp',webm=bytes.length>=4&&bytes.readUInt32BE(0)===0x1a45dfa3;
  if(!mp4&&!webm)return null;check(bytes.length>=12&&bytes.length<=MAX_FILE,'file byte bound');return mp4?inspectMp4(bytes):inspectWebm(bytes);
}
module.exports={inspectVideoMedia};
