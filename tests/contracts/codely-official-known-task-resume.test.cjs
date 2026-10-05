'use strict';
// Known-ID recovery uses the real cache/API/executor and an owned HTTP fixture.
// No original application, real account or commercial Provider is contacted.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {createAssetService}=require('../../src/core/binary/out/gamecowork-assets.js');
const {createCodelyGeneratorApi}=require('../../src/core/binary/out/gamecowork-codely-generator.js');
const catalog=require('../../src/core/binary/out/gamecowork-official-model-catalog.js');
const root=path.join('F:/AI/AgentMake/temp/GameCowork/tests','official-known-resume-'+crypto.randomUUID()),scope='owned-workspace',binding='b'.repeat(64),otherBinding='c'.repeat(64);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
let media;
test.before(async()=>{
  const {createOwnedGenerationMedia}=await import('../fixtures/asset-generation-provider-fixture.mjs');media=createOwnedGenerationMedia(path.join(root,'media'));
  const file=path.join(root,'media','synthetic-voice.mp3');execFileSync('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i','sine=frequency=440:sample_rate=44100:duration=1.5','-c:a','libmp3lame','-b:a','64k',file],{windowsHide:true,timeout:30000});
  media.mp3={bytes:fs.readFileSync(file),mimeType:'audio/mpeg',file};
  const audio=path.join(root,'media','synthetic-reference.wav');execFileSync('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i','sine=frequency=440:sample_rate=16000:duration=11','-c:a','pcm_s16le',audio],{windowsHide:true,timeout:30000});media.wav={bytes:fs.readFileSync(audio),mimeType:'audio/wav',file:audio};
});
async function until(read,condition){const deadline=Date.now()+4000;for(;;){const value=await read();if(condition(value))return value;if(Date.now()>deadline)throw Error('Owned recovery fixture did not settle');await new Promise(resolve=>setTimeout(resolve,5));}}
async function fixture(t,{kind='image',noRemoteId=false,partial=false}={}){
  const state={binding,badMime:true,changedRemoteId:false},calls=[],mediaGets=[];let origin;
  const server=http.createServer(async(request,response)=>{
    const url=new URL(request.url,origin),chunks=[];for await(const chunk of request)chunks.push(chunk);const bytes=Buffer.concat(chunks);calls.push({method:request.method,path:url.pathname});
    const json=value=>response.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(value));
    if(url.pathname==='/api/credit/cost-preview')return json({credits:3});
    if(url.pathname==='/api/sso/upload/audio'){assert.match(request.headers['content-type'],/multipart/);assert.ok(bytes.includes(media.wav.bytes));return json({url:origin+'/owned-reference.wav'});}
    if(url.pathname==='/api/sso/generate'){assert.equal(request.method,'POST');assert.equal(JSON.parse(bytes).kind,kind==='audio'?'minimax-voice':partial?'tripo-p1':'frontier_flare');return json(noRemoteId?{status:'queued'}:{id:'remote-owned',status:'running'});}
    if(url.pathname==='/api/task/remote-owned/status'){
      const output=kind==='audio'?{audioUrl:origin+'/output.mp3'}:partial?{thumbnailUrl:origin+'/output.png',modelUrl:origin+'/output.glb'}:{imageUrl:origin+'/output.png'};
      return json({id:state.changedRemoteId?'unrelated-remote':'remote-owned',status:'completed',output:{data:output}});
    }
    const extension=url.pathname.match(/^\/output\.(png|glb|mp3)$/)?.[1];if(extension){
      assert.equal(request.headers.authorization,undefined);assert.equal(request.headers.cookie,undefined);mediaGets.push(extension);
      const file=media[extension],bad=state.badMime&&(!partial||extension==='glb');response.writeHead(200,{'Content-Type':bad?'text/html':file.mimeType});response.end(file.bytes);return;
    }
    response.writeHead(404).end('{}');
  });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
  const fetcher=async(url,options)=>{assert.equal(new URL(url).origin,origin,'Every request stays inside the fixture');const response=await fetch(url,options);if(!response.ok)throw Error('Owned HTTP request rejected');return response;};
  const official={generationBinding:()=>state.binding,generatorOrigin:()=>origin,generatorPaidStatus:async()=>({paidType:'paid'}),
    generatorCostPreview:async(query,signal)=>(await fetcher(origin+'/api/credit/cost-preview?'+new URLSearchParams(query),{signal})).json(),
    generatorGenerate:async(id,data,signal)=>(await fetcher(origin+'/api/sso/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:id,data}),signal})).json(),
    generatorTaskStatus:async(id,signal)=>(await fetcher(origin+'/api/task/'+encodeURIComponent(id)+'/status',{signal})).json(),
    generatorUploadMedia:async(reference,signal)=>{const form=new FormData();form.append(reference.kind,new Blob([reference.bytes],{type:reference.mime}),reference.filename);return(await fetcher(origin+'/api/sso/upload/'+reference.kind,{method:'POST',body:form,signal})).json();}};
  const service=createAssetService({root:path.join(root,'cache-'+crypto.randomUUID()),pollIntervalMs:15,requestTimeoutMs:1000,fetch:fetcher}),api=createCodelyGeneratorApi({assetService:service,getOfficial:()=>official});
  t.after(async()=>{await service.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));});
  const call=(method,route,body={},workspaceKey=scope)=>api.dispatch({method,path:route,body,origin,...(workspaceKey===undefined?{}:{workspaceKey})});
  const read=id=>service.dispatch('generator/getTask',{taskId:id}).then(value=>value.task);
  const create=async()=>{
    const id=kind==='audio'?'minimax-voice':partial?'tripo-p1':'frontier_flare';let refs={};
    if(kind==='audio'){
      const inputId='i_'+crypto.randomUUID(),staged=path.join(service.root,'incoming',inputId+'.bin');fs.mkdirSync(path.dirname(staged),{recursive:true});fs.writeFileSync(staged,media.wav.bytes);
      const input=service.registerInput({inputId,filename:'voice-source.wav',workspaceKey:scope,byteLength:media.wav.bytes.length,sha256:sha(media.wav.bytes)}).input;fs.unlinkSync(staged);
      refs={audios:[origin+'/api/codely-generator/local-inputs/'+input.id+'/'+input.filename+'?workspaceKey='+scope]};
    }
    const response=await call('POST','/sso/generate',{kind:id,data:catalog.minimalPayload(id,refs)});assert.equal(response.status,200);return response.body.taskId;
  };
  return{state,calls,mediaGets,service,api,origin,read,call,create,postCount:()=>calls.filter(call=>call.method==='POST'&&call.path==='/api/sso/generate').length,pollCount:()=>calls.filter(call=>call.method==='GET'&&call.path==='/api/task/remote-owned/status').length};
}
test('an official known-ID MIME failure resumes GET/collect without repeating generation or changing identity',async t=>{
  const f=await fixture(t),id=await f.create(),failed=await until(()=>f.read(id),row=>row.status==='failed');assert.equal(failed.officialTaskId,'remote-owned');assert.equal(f.postCount(),1);const before=f.pollCount();
  f.state.badMime=false;const resumed=await f.call('POST','/task/'+id+'/resume');assert.equal(resumed.status,200);assert.deepEqual(resumed.body,{taskId:id,resumed:true,createRepeated:false});
  const completed=await until(()=>f.read(id),row=>row.status==='completed');assert.equal(completed.id,id);assert.equal(completed.officialTaskId,'remote-owned');assert.equal(f.postCount(),1);assert.ok(f.pollCount()>before);assert.equal(completed.artifacts[0].sha256,sha(media.png.bytes));
  const beforeDone=f.calls.length;assert.deepEqual((await f.call('POST','/task/'+id+'/resume')).body,{taskId:id,resumed:false,createRepeated:false});await new Promise(resolve=>setTimeout(resolve,35));assert.equal(f.calls.length,beforeDone);
});
test('resume refuses foreign workspace, omitted scope and replacement account without contacting the task',async t=>{
  const f=await fixture(t),id=await f.create();await until(()=>f.read(id),row=>row.status==='failed');const count=f.calls.length;
  const foreign=await f.call('POST','/task/'+id+'/resume',{},'someone-else-workspace');assert.equal(foreign.status,404);
  const unscoped=await f.api.dispatch({method:'POST',path:'/task/'+id+'/resume',body:{},origin:f.origin});assert.equal(unscoped.status,403);
  await assert.rejects(f.service.dispatch('generator/resumeOfficialTask',{taskId:id,workspaceKey:'foreign'}),/workspace/);
  f.state.binding=otherBinding;assert.notEqual((await f.call('POST','/task/'+id+'/resume')).status,200);assert.equal(f.calls.length,count);assert.equal(f.postCount(),1);
});
test('an unknown receipt has no resume authority, including client-supplied remote IDs',async t=>{
  const f=await fixture(t,{noRemoteId:true}),id=await f.create(),unknown=await until(()=>f.read(id),row=>row.status==='interrupted');assert.equal(unknown.officialTaskId,undefined);const count=f.calls.length;
  assert.equal((await f.call('POST','/task/t_not_owned/resume')).status,404);
  const response=await f.call('POST','/task/'+id+'/resume',{officialTaskId:'remote-owned',_remoteId:'remote-owned'});assert.notEqual(response.status,200);assert.equal(f.calls.length,count);assert.equal(f.postCount(),1);assert.equal(f.pollCount(),0);
});
test('known-ID recovery retains verified cached artifacts and collects only missing original output indices',async t=>{
  const f=await fixture(t,{partial:true}),id=await f.create(),failed=await until(()=>f.read(id),row=>row.status==='failed');assert.equal(failed.artifacts.length,1);assert.equal(failed.artifacts[0].kind,'image');const retained=failed.artifacts[0];assert.deepEqual(f.mediaGets,['png','glb']);
  f.state.badMime=false;assert.equal((await f.call('POST','/task/'+id+'/resume')).status,200);const completed=await until(()=>f.read(id),row=>row.status==='completed');assert.equal(completed.artifacts[0].id,retained.id);assert.equal(completed.artifacts[0].sha256,retained.sha256);assert.equal(completed.artifacts[1].sha256,sha(media.glb.bytes));assert.deepEqual(f.mediaGets,['png','glb','glb']);assert.equal(f.postCount(),1);
});
test('a poll cannot substitute a different remote ID during known task recovery',async t=>{
  const f=await fixture(t),id=await f.create();await until(()=>f.read(id),row=>row.status==='failed');const mediaBefore=f.mediaGets.length;f.state.badMime=false;f.state.changedRemoteId=true;
  assert.equal((await f.call('POST','/task/'+id+'/resume')).status,200);const stopped=await until(()=>f.read(id),row=>row.status==='interrupted');assert.equal(stopped.officialTaskId,'remote-owned');assert.equal(f.postCount(),1);assert.equal(f.mediaGets.length,mediaBefore);assert.match(stopped.error,/任务身份/);
});
test('voice-clone actual MP3 is a valid primary result and known-ID recovery never clones again',async t=>{
  const f=await fixture(t,{kind:'audio'}),id=await f.create();await until(()=>f.read(id),row=>row.status==='failed');assert.equal(f.postCount(),1);f.state.badMime=false;
  assert.equal((await f.call('POST','/task/'+id+'/resume')).status,200);const completed=await until(()=>f.read(id),row=>row.status==='completed');assert.equal(completed.kind,'text');assert.equal(completed.artifacts.length,1);assert.equal(completed.artifacts[0].kind,'audio');assert.equal(completed.artifacts[0].mime,'audio/mpeg');assert.equal(completed.artifacts[0].sha256,sha(media.mp3.bytes));assert.equal(f.postCount(),1);
  const dto=await f.call('GET','/task/'+id+'/status');assert.equal(dto.body.category,'audio');assert.ok(dto.body.output.data.audioUrl.startsWith(f.origin+'/api/codely-generator/local-artifacts/'));assert.equal(dto.body.output.data.text,undefined);
  execFileSync('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-i',media.mp3.file,'-f','null','-'],{windowsHide:true,timeout:30000,stdio:['ignore','ignore','pipe']});
});
