'use strict';
// Actual output normalizer -> durable verified media cache -> original API DTO.
// The only media HTTP transport is an owned loopback server with synthetic files.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {normalizeTaskReply}=require('../../src/core/binary/out/gamecowork-official-task-output.js');
const {createAssetService}=require('../../src/core/binary/out/gamecowork-assets.js');
const {createCodelyGeneratorApi}=require('../../src/core/binary/out/gamecowork-codely-generator.js');
const catalog=require('../../src/core/binary/out/gamecowork-official-model-catalog.js');
const root=path.join('F:/AI/AgentMake/temp/GameCowork/tests','official-task-output-'+crypto.randomUUID()),binding='b'.repeat(64);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
let media,server,origin;const downloads=[];
function wav(){const bytes=Buffer.alloc(16044);bytes.write('RIFF');bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(8000,24);bytes.writeUInt32LE(16000,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(bytes.length-44,40);return bytes;}
test.before(async()=>{
  const {createOwnedGenerationMedia}=await import('../fixtures/asset-generation-provider-fixture.mjs');media=createOwnedGenerationMedia(path.join(root,'media'));media.wav={bytes:wav(),mimeType:'audio/wav'};
  server=http.createServer((request,response)=>{assert.equal(request.headers.authorization,undefined);assert.equal(request.headers.cookie,undefined);downloads.push(request.url);const key=new URL(request.url,origin).pathname.match(/^\/owned\.(\w+)$/)?.[1],file=media[key];if(!file){response.writeHead(404).end();return;}response.writeHead(200,{'Content-Type':file.mimeType});response.end(file.bytes);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
});
test.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));});
async function until(read,condition){const deadline=Date.now()+3000;for(;;){const value=await read();if(condition(value))return value;if(Date.now()>deadline)throw Error('Owned output fixture did not settle');await new Promise(resolve=>setTimeout(resolve,5));}}
function input(service,bytes,filename,kind){const id='i_'+crypto.randomUUID(),staged=path.join(service.root,'incoming',id+'.bin');fs.mkdirSync(path.dirname(staged),{recursive:true});fs.writeFileSync(staged,bytes);const result=service.registerInput({inputId:id,filename,workspaceKey:'',sha256:hash(bytes),byteLength:bytes.length}).input;fs.unlinkSync(staged);assert.equal(result.kind,kind);return result;}
async function completed(id,makeOutput,{expect='completed',status='completed',before}={}){
  const service=createAssetService({root:path.join(root,id+'-'+crypto.randomUUID()),pollIntervalMs:15,requestTimeoutMs:1000}),calls=[];
  const image=input(service,media.png.bytes,'owned.png','image'),audio=input(service,media.wav.bytes,'owned.wav','audio');
  const refs={images:[origin+'/image/'+image.id],audios:[origin+'/audio/'+audio.id],models:[]};let payload=catalog.minimalPayload(id,refs);const slots=catalog.referenceSlots(id,payload),ids=slots.map(slot=>slot.mediaKinds[0]==='image'?image.id:audio.id);
  const executor={isAvailable:()=>true,assertOwner:task=>assert.equal(task._officialOwner,binding),downloadProvider:()=>({baseUrl:origin,authMode:'none'}),async request(task,creating){calls.push({creating});return normalizeTaskReply({data:{id:'remote-owned',status,output:{data:makeOutput()}}},creating,id);}};
  service.attachOfficialExecutor(executor);
  try{
    const task=service.createOfficialTask({kind:catalog.MODELS[id].kind,model:id,parameters:payload,prompt:payload.prompt||'',inputIds:ids,workspaceKey:'',ownerBinding:binding}).task;
    if(before)before(task,service);
    const actual=await until(()=>service.dispatch('generator/getTask',{taskId:task.id}).then(v=>v.task),row=>expect==='pending'?calls.length>1:['completed','failed','cancelled'].includes(row.status));
    if(expect==='pending'){assert.notEqual(actual.status,'completed');assert.equal(actual.artifacts.length,0);return {actual,calls};}
    assert.equal(actual.status,expect,actual.error);const api=createCodelyGeneratorApi({assetService:service,getOfficial:()=>null});
    const response=await api.dispatch({method:'GET',path:'/task/'+task.id+'/status',origin,workspaceKey:''});assert.equal(response.status,200);
    for(const artifact of actual.artifacts){const cached=service.getArtifactPath(task.id,artifact.id);assert.equal(hash(fs.readFileSync(cached.path)),artifact.sha256);}
    return {actual,response,calls};
  }finally{await service.close();}
}
test('only known terminal states authorize media collection; unknown/pending previews remain pending',async()=>{
  for(const state of ['pending','queued','running','retrying','processing','in_progress','surprising-status']){const result=normalizeTaskReply({id:'remote',status:state,previewUrl:origin+'/owned.png'},false,'frontier_flare');assert.notEqual(result.status,'completed');}
  for(const state of ['completed','succeeded','success'])assert.equal(normalizeTaskReply({id:'remote',status:state},false,'frontier_flare').status,'completed');
  for(const [state,result]of[['failed','failed'],['error','failed'],['canceled','cancelled'],['cancelled','cancelled']])assert.equal(normalizeTaskReply({id:'remote',status:state},false,'frontier_flare').status,result);
  assert.throws(()=>normalizeTaskReply({status:'completed'},true,'frontier_flare'),error=>error.submissionUnknown===true);
  const before=downloads.length;await completed('frontier_flare',()=>({previewUrl:origin+'/owned.png'}),{expect:'pending',status:'unrecognized'});assert.equal(downloads.length,before);
});
for(const [id,field,ext,kind]of[['frontier_flare','imageUrl','png','image'],['seedance2','videoUrl','mp4','video'],['sonilo-sfx','audioUrl','wav','audio'],['tripo-p1','modelUrl','glb','model']])test(`${kind}: real bytes enter cache and original API only exposes hydrated local addresses`,async()=>{
  const {actual,response,calls}=await completed(id,()=>({[field]:origin+'/owned.'+ext,...(catalog.MODELS[id].outputKinds.includes('image')?{thumbnailUrl:origin+'/owned.png'}:{})}));const output=response.body.output.data;
  assert.ok(output[field].startsWith(origin+'/api/codely-generator/local-artifacts/'));assert.equal(actual.artifacts.filter(row=>row.kind===kind&&row.role==='result').length,1);assert.equal(actual.artifacts.find(row=>row.kind===kind).sha256,hash(media[ext].bytes));assert.equal(calls.filter(call=>call.creating).length,1);
  for(const privateValue of [binding,'_officialOwner','_remoteId',path.join(root,id)])assert.equal(JSON.stringify(response).includes(privateValue),false);
});
test('completed image/video tasks with only thumbnails fail without inventing a primary file',async()=>{
  for(const [id,ext]of[['frontier_flare','png'],['seedance2','png'],['sonilo-sfx','wav']]){const {actual}=await completed(id,()=>({previewUrl:origin+'/owned.'+ext}),{expect:'failed'});assert.match(actual.error,/primary/);assert.equal(actual.artifacts.every(row=>row.role==='preview'),true);}
});
test('text and generated voice identity preserve actual structured results and verified text files',async()=>{
  const generated='A concise prompt describing the actual image.';
  const result=await completed('doubao-prompt',()=>({text:generated}));assert.equal(result.response.body.output.data.text,generated);assert.equal(result.actual.artifacts[0].kind,'text');assert.equal(result.actual.artifacts[0].sha256,hash(Buffer.from(generated)));
  const voice=await completed('minimax-voice',()=>({voiceId:'owned-generated-voice-123'}));assert.equal(voice.response.body.output.data.voiceId,'owned-generated-voice-123');assert.equal(voice.actual.artifacts[0].sha256,hash(Buffer.from('owned-generated-voice-123')));
  await completed('doubao-prompt',()=>({text:'',previewUrl:origin+'/owned.png'}),{expect:'failed'});
});
test('repeated URLs across layered output map to one cached artifact and retain layer metadata',async()=>{
  const result=await completed('qwen-layer',()=>({imageUrl:origin+'/owned.png',layers:[{url:origin+'/owned.png',zIndex:0,name:'Foreground',description:'Actual foreground',boundingBox:{x:0,y:0,width:48,height:32}}]}));
  assert.equal(result.actual.artifacts.length,1);const output=result.response.body.output.data;assert.equal(output.imageUrl,output.layers[0].url);assert.deepEqual(output.layers[0].boundingBox,{x:0,y:0,width:48,height:32});assert.equal(output.layers[0].name,'Foreground');assert.equal(output.layers[0].zIndex,0);
});
test('a duplicate primary URL is still a real result when preview arrives first',async()=>{
  const {actual,response}=await completed('frontier_flare',()=>({thumbnailUrl:origin+'/owned.png',imageUrl:origin+'/owned.png'}));assert.equal(actual.artifacts.length,1);assert.equal(actual.artifacts[0].role,'result');assert.equal(response.body.output.data.thumbnailUrl,response.body.output.data.imageUrl);
});
test('private input echoes, secret fields and original links never become generated output assets',()=>{
  const reply=normalizeTaskReply({id:'remote',status:'completed',output:{data:{imageUrl:origin+'/owned.png',input:{imageUrl:origin+'/unowned.png'},param:{sourceUrl:origin+'/unowned.png'},originalImageUrl:origin+'/original.png',originalVideoUrl:origin+'/original.mp4',original_model_url:origin+'/original.glb',authorization:'secret',access_token:'secret',nested:{cookie:'secret'}}}},false,'frontier_flare');
  assert.equal(reply.outputs.length,1);assert.equal(JSON.stringify(reply.outputTree).includes('unowned'),false);assert.equal(JSON.stringify(reply.outputTree).includes('secret'),false);assert.equal(JSON.stringify(reply.outputTree).includes('/original.'),false);
});
test('bounded output depth, arrays, text and URL auth cannot enter persistent result metadata',()=>{
  assert.throws(()=>normalizeTaskReply({id:'x',status:'completed',output:{url:'https://user:password@example.invalid/a.png'}},false,'frontier_flare'));
  let nested={imageUrl:origin+'/owned.png'};for(let depth=0;depth<14;depth++)nested={nested};assert.throws(()=>normalizeTaskReply({id:'x',status:'completed',output:nested},false,'frontier_flare'),/nesting/);
  assert.throws(()=>normalizeTaskReply({id:'x',status:'completed',output:{images:Array.from({length:129},()=>origin+'/owned.png')}},false,'frontier_flare'),/array/);
  assert.throws(()=>normalizeTaskReply({id:'x',status:'completed',output:{text:'A'.repeat(1024*1024+1)}},false,'doubao-prompt'),/text/);
});
