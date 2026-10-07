// Original multipart request bytes -> trusted UUID staging -> actual local media.
// The tiny HTTP peer substitutes only the Rust staging transport, not Core parsing.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID, createHash } from 'node:crypto';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
const require=createRequire(import.meta.url),{createAssetService}=require('../../src/core/binary/out/modules/generation/service.js'),{createCodelyGeneratorApi}=require('../../src/core/binary/out/modules/generation/codely-api.js');
const root=path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/codely-generator-upload-'+randomUUID()),store=path.join(root,'runtime'),incoming=path.join(store,'incoming'),media=createOwnedGenerationMedia(root),sha=value=>createHash('sha256').update(value).digest('hex'),LIMIT=64*1024*1024;
const sockets=new Set(),receipts=[];let assets,compatibility,server,origin;
async function staged(raw,contentType,kind,scope='workspace-a',change={}) {
  const stagingId='i_'+randomUUID(),file=path.join(incoming,stagingId+'.bin');fs.writeFileSync(file,raw,{flag:'wx'});
  try {
    const result=await compatibility.upload({stagingId,byteLength:raw.length,sha256:sha(raw),contentType,kind,workspaceKey:scope,origin,...change});
    receipts.push({status:result.status,rawStagePreserved:fs.existsSync(file),decodedStageCount:fs.readdirSync(incoming).filter(name=>name.startsWith('i_')&&name!==stagingId+'.bin').length});return result;
  } finally {if(fs.existsSync(file))fs.unlinkSync(file);}
}
async function encoded(parts) {
  const form=new FormData();for(const part of parts)form.append(part.name,part.text??new Blob([part.bytes],{type:part.mime||'application/octet-stream'}),...(part.text===undefined?[part.filename||'owned.bin']:[]));
  const request=new Request('http://127.0.0.1/owned-encode',{method:'POST',body:form});return {raw:Buffer.from(await request.arrayBuffer()),contentType:request.headers.get('content-type')};
}
async function upload(kind,parts,{scope='workspace-a',contentType}={}) {
  const body=await encoded(parts),response=await fetch(origin+'/api/codely-generator/sso/upload/'+kind+'?entry=studio',{method:'POST',headers:{'Content-Type':contentType||body.contentType,'X-Owned-Workspace':scope},body:body.raw});return {status:response.status,body:await response.json()};
}
const count=()=>assets.getOwnedSnapshot().inputs.length;
test.before(async()=>{
  assets=createAssetService({root:store});compatibility=createCodelyGeneratorApi({assetService:assets});fs.mkdirSync(incoming,{recursive:true});fs.writeFileSync(path.join(incoming,'keep.txt'),'unrelated owned file');
  server=http.createServer(async(request,response)=>{
    try {
      const url=new URL(request.url,origin),resource=/^\/api\/codely-generator\/local-inputs\/([^/]+)\/([^/]+)$/.exec(url.pathname);
      if(request.method==='GET'&&resource){const metadata=assets.getInputPath(decodeURIComponent(resource[1]),url.searchParams.get('workspaceKey')||'');assert.equal(metadata.filename,decodeURIComponent(resource[2]));response.writeHead(200,{'Content-Type':metadata.mime});response.end(fs.readFileSync(metadata.path));return;}
      const chunks=[];for await(const bytes of request)chunks.push(bytes);const raw=Buffer.concat(chunks),kind=url.pathname.split('/').at(-1),result=await staged(raw,request.headers['content-type'],kind,request.headers['x-owned-workspace']||'');
      response.writeHead(result.status,{'Content-Type':'application/json'});response.end(JSON.stringify(result.body));
    }catch{response.writeHead(500,{'Content-Type':'application/json'});response.end(JSON.stringify({error:'owned_upload_peer_error'}));}
  });
  server.on('connection',socket=>{sockets.add(socket);socket.on('close',()=>sockets.delete(socket));});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
});
test.after(async()=>{await assets?.close();for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));});

test('Original image multipart uploads actual Unicode-named PNG bytes and returns the original {url} shape',async()=>{
  const result=await upload('image',[{name:'image',bytes:media.png.bytes,mime:'image/png',filename:'真实参考图.png'}]);assert.equal(result.status,200);assert.deepEqual(Object.keys(result.body),['url']);
  const url=new URL(result.body.url);assert.equal(url.origin,origin);assert.equal(url.searchParams.get('workspaceKey'),'workspace-a');assert.ok(decodeURIComponent(url.pathname).endsWith('/真实参考图.png'));
  const response=await fetch(url);assert.equal(response.headers.get('content-type'),'image/png');assert.equal(sha(Buffer.from(await response.arrayBuffer())),media.png.sha256);
  assert.equal(receipts.at(-1).rawStagePreserved,true);assert.equal(receipts.at(-1).decodedStageCount,0);assert.deepEqual(fs.readdirSync(incoming),['keep.txt']);
});

test('Original video and model-conversion fields retain their real supported media type',async()=>{
  for(const [kind,field,asset]of [['video','video',media.webm],['model','model',media.glb],['model-conversion','model',media.glb]]) {
    const result=await upload(kind,[{name:field,bytes:asset.bytes,mime:asset.mimeType,filename:asset.fileName}]);assert.equal(result.status,200);const response=await fetch(result.body.url);assert.equal(response.headers.get('content-type'),asset.mimeType);assert.equal(sha(Buffer.from(await response.arrayBuffer())),asset.sha256);
  }
});

test('Wrong boundaries, unexpected fields and multiple files never register a synthetic input',async()=>{
  const before=count(),image={name:'image',bytes:media.png.bytes,mime:'image/png',filename:'owned.png'};
  const wrong=await upload('image',[image],{contentType:'multipart/form-data; boundary=wrong-owned-boundary'});assert.equal(wrong.status,400);assert.equal(wrong.body.error,'invalid_multipart_body');
  for(const parts of [[image,image],[{...image,name:'model'}],[{name:'image',text:'not a file'}],[image,{name:'metadata',text:'unexpected'}]]){const result=await upload('image',parts);assert.equal(result.status,400);assert.equal(result.body.error,'single_matching_file_required');}
  const body=await encoded([image]);assert.equal((await staged(body.raw,'application/json','image')).status,400);assert.equal(count(),before);assert.deepEqual(fs.readdirSync(incoming),['keep.txt']);
});

test('Raw UUID identity, metadata checksum and byte-length changes are rejected without touching arbitrary paths',async()=>{
  const body=await encoded([{name:'image',bytes:media.png.bytes,mime:'image/png',filename:'owned.png'}]),before=count();
  for(const change of [{sha256:'0'.repeat(64)},{byteLength:body.raw.length+1},{path:'F:/must-not-read'},{filePath:'F:/must-not-read'},{stagingId:'../neighbor'},{workspaceKey:undefined}]){const result=await staged(body.raw,body.contentType,'image','workspace-a',change);assert.equal(result.status,400);}
  assert.equal(count(),before);assert.equal(fs.readFileSync(path.join(incoming,'keep.txt'),'utf8'),'unrelated owned file');
});

test('Raw body and decoded file limits are separate and oversized single files fail before registration',async()=>{
  const small=await encoded([{name:'image',bytes:media.png.bytes,mime:'image/png',filename:'owned.png'}]),before=count();
  const rawLimit=await staged(small.raw,small.contentType,'image','workspace-a',{byteLength:LIMIT+256*1024+1});assert.equal(rawLimit.status,413);assert.equal(rawLimit.body.error,'multipart_too_large');
  const result=await upload('image',[{name:'image',bytes:Buffer.alloc(LIMIT+1),mime:'image/png',filename:'too-large.png'}]);assert.equal(result.status,413);assert.equal(result.body.error,'reference_file_too_large');assert.equal(count(),before);assert.deepEqual(fs.readdirSync(incoming),['keep.txt']);
});

test('Actual unsupported or mismatched media produces a clear error, not an uploaded URL',async()=>{
  const before=count(),wave=Buffer.alloc(44);wave.write('RIFF',0);wave.writeUInt32LE(36,4);wave.write('WAVE',8);
  for(const [kind,field,bytes,mime]of [['audio','audio',wave,'audio/wav'],['model','model',Buffer.from('owned unsupported FBX content'), 'application/octet-stream'],['image','image',media.glb.bytes,'image/png']]){
    const result=await upload(kind,[{name:field,bytes,mime,filename:'owned.bin'}]);assert.equal(result.status,415);assert.equal(Object.hasOwn(result.body,'url'),false);
  }
  assert.equal(count(),before);
});

test('Decoded temporary files are cleaned after registration storage failure while the raw stage stays native-owned',async()=>{
  const state=path.join(store,'inputs.json'),alias=path.join(root,'owned-inputs-hardlink.json'),before=count();fs.linkSync(state,alias);
  try{const result=await upload('image',[{name:'image',bytes:media.png.bytes,mime:'image/png',filename:'failure.png'}]);assert.equal(result.status,500);assert.equal(count(),before);assert.equal(receipts.at(-1).rawStagePreserved,true);assert.equal(receipts.at(-1).decodedStageCount,0);assert.deepEqual(fs.readdirSync(incoming),['keep.txt']);}finally{fs.unlinkSync(alias);}
});

test('Adjacent workspace uploads remain separate after persistence and cannot resolve each other input identity',async()=>{
  const result=await upload('image',[{name:'image',bytes:media.png.bytes,mime:'image/png',filename:'scope-b.png'}],{scope:'workspace-b'});assert.equal(result.status,200);const url=new URL(result.body.url),inputId=decodeURIComponent(url.pathname.split('/').at(-2));
  assert.equal(url.searchParams.get('workspaceKey'),'workspace-b');assert.throws(()=>assets.getInputPath(inputId,'workspace-a'),/not found/);assert.equal(assets.getInputPath(inputId,'workspace-b').sha256,media.png.sha256);
  await assets.close();assets=createAssetService({root:store});compatibility=createCodelyGeneratorApi({assetService:assets});assert.equal(assets.getInputPath(inputId,'workspace-b').sha256,media.png.sha256);assert.equal((await assets.dispatch('generator/getInputs',{workspaceKey:'workspace-a'})).inputs.some(input=>input.id===inputId),false);
});
