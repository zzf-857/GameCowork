'use strict';
// Radiance RGBE: https://radsite.lbl.gov/radiance/refer/Notes/picture_format.html
// Validate every stored scanline without executing an image tool or allocating
// the expanded panorama. Modern component RLE and legacy pixel runs are bounded.
function inspectHdrMedia(bytes) {
  if(!Buffer.isBuffer(bytes) || !/^#\?(?:RADIANCE|RGBE)\n/.test(bytes.subarray(0,16).toString('ascii'))) return null;
  const end=bytes.indexOf(Buffer.from('\n\n'));
  if(end<0 || end>65536 || !/^FORMAT=32-bit_rle_rgbe$/m.test(bytes.toString('ascii',0,end))) throw Error('Invalid Radiance HDR header');
  const lineEnd=bytes.indexOf(10,end+2),resolution=lineEnd<0?null:/^([+-])Y (\d+) ([+-])X (\d+)$/.exec(bytes.toString('ascii',end+2,lineEnd));
  if(!resolution) throw Error('Unsupported HDR scanline orientation');
  const width=Number(resolution[4]),height=Number(resolution[2]);
  if(!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width<1 || height<1 || width*height>67108864 || bytes.length>64*1024*1024) throw Error('HDR dimensions or file exceed bounds');
  let offset=lineEnd+1;
  for(let y=0;y<height;y++) {
    if(offset+4>bytes.length) throw Error('Truncated HDR scanline');
    const modern=width>=8 && width<=32767 && bytes[offset]===2 && bytes[offset+1]===2 && !(bytes[offset+2]&128);
    if(modern) {
      if((bytes[offset+2]<<8|bytes[offset+3])!==width) throw Error('HDR scanline width mismatch'); offset+=4;
      for(let channel=0;channel<4;channel++) {let x=0; while(x<width) {if(offset>=bytes.length) throw Error('Truncated HDR component'); const code=bytes[offset++],count=code>128?code-128:code;
        if(!count || x+count>width || offset+(code>128?1:count)>bytes.length) throw Error('Invalid HDR component run'); offset+=code>128?1:count; x+=count;}}
    } else {
      let x=0,shift=0,previous=false;
      while(x<width) {if(offset+4>bytes.length) throw Error('Truncated HDR pixel'); const run=bytes[offset]===1 && bytes[offset+1]===1 && bytes[offset+2]===1;
        if(run) {const count=bytes[offset+3]*2**shift; if(!previous || shift>24 || !count || x+count>width) throw Error('Invalid legacy HDR pixel run'); x+=count; shift+=8;}
        else {x++; shift=0; previous=true;} offset+=4;}
    }
  }
  if(offset!==bytes.length) throw Error('Trailing HDR pixel bytes');
  return {mime:'image/vnd.radiance',extension:'hdr',kind:'image',width,height,containerValidated:true};
}
module.exports={inspectHdrMedia};
