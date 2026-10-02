// Actual owned generation -> compatibility HTTP -> Codely's documented wire shapes.
// Original application code and official services are never executed here.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID, createHash } from 'node:crypto';
import { startAssetGenerationProvider } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js'), { createCodelyGeneratorApi } = require('../../src/core/binary/out/gamecowork-codely-generator.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/codely-generator-api-' + randomUUID()), store = path.join(root,'runtime'), workspaceNames = { 'workspace-a':'真实工程 A', 'workspace-b':'真实工程 B' }, sockets = new Set();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let assets, compatibility, provider, server, origin, imageTask, modelTask, videoTask, failedTask, reference;
const reopen = () => { assets = createAssetService({ root:store,pollIntervalMs:20,requestTimeoutMs:2000 }); compatibility = createCodelyGeneratorApi({assetService:assets}); };
async function terminal(taskId) { const deadline=Date.now()+5000; for(;;){const {task}=await assets.dispatch('generator/getTask',{taskId});if(['completed','failed','interrupted'].includes(task.status))return task;if(Date.now()>deadline)throw Error('Owned generation deadline');await new Promise(resolve=>setTimeout(resolve,10));} }
async function create(kind,prompt,workspaceKey,extra={}) { const result=await assets.dispatch('generator/createTask',{providerId:'owned',kind,prompt,...(workspaceKey?{workspaceKey}:{}),...extra});return terminal(result.task.id); }
async function api(method,route,{query={},body,scope}={}) {
  const url=new URL('/api/codely-generator'+route,origin);for(const [key,value]of Object.entries(query))url.searchParams.set(key,String(value));
  const response=await fetch(url,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(scope!==undefined?{'X-Owned-Scope':scope||'__global__'}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,body:await response.json()};
}
test.before(async()=>{
  provider=await startAssetGenerationProvider({root,plans:{OWN_MODEL:{kind:'model'},OWN_VIDEO:{kind:'video'},OWN_FAIL:{kind:'model',fail:true}}});reopen();
  await assets.dispatch('generator/saveProvider',{provider:{id:'owned',name:'Owned real generator',baseUrl:provider.baseUrl,kinds:['image','video','model'],model:'owned-fixture-model',authMode:'bearer',apiKey:provider.apiKey}});
  const inputId='i_'+randomUUID(),incoming=path.join(store,'incoming',inputId+'.bin');fs.mkdirSync(path.dirname(incoming),{recursive:true});fs.writeFileSync(incoming,provider.media.png.bytes);
  reference=assets.registerInput({inputId,filename:'原图.png',workspaceKey:'workspace-a',byteLength:provider.media.png.size,sha256:provider.media.png.sha256}).input;fs.unlinkSync(incoming);
  await assets.dispatch('generator/saveProvider',{provider:{id:'references',name:'Owned references',baseUrl:provider.baseUrl,kinds:['image'],model:'owned-reference-model',authMode:'bearer',apiKey:provider.apiKey,adapter:{create:{method:'POST',path:'/tasks',bodyTemplate:{kind:'{{kind}}',prompt:'{{prompt}}',image:'{{inputs.0.dataUrl}}'}}}}});
  imageTask=await create('image','Actual image prompt','workspace-a',{providerId:'references',inputIds:[reference.id],parameters:{width:48}});
  modelTask=await create('model','OWN_MODEL actual geometry','workspace-b');videoTask=await create('video','OWN_VIDEO global media','');failedTask=await create('model','OWN_FAIL deliberate error','workspace-a');
  assert.equal(imageTask.status,'completed');assert.equal(modelTask.status,'completed');assert.equal(videoTask.status,'completed');assert.equal(failedTask.status,'failed');
  server=http.createServer(async(request,response)=>{
    try{
      const url=new URL(request.url,origin),artifact=/^\/api\/codely-generator\/local-artifacts\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(url.pathname),input=/^\/api\/codely-generator\/local-inputs\/([^/]+)\/([^/]+)$/.exec(url.pathname);
      if(artifact||input){const metadata=artifact?assets.getArtifactPath(decodeURIComponent(artifact[1]),decodeURIComponent(artifact[2])):assets.getInputPath(decodeURIComponent(input[1]),url.searchParams.get('workspaceKey')||'');assert.equal(decodeURIComponent(artifact?artifact[3]:input[2]),metadata.filename);response.writeHead(200,{'Content-Type':metadata.mime});response.end(fs.readFileSync(metadata.path));return;}
      const chunks=[];for await(const chunk of request)chunks.push(chunk);const scope=request.headers['x-owned-scope'];
      const reply=await compatibility.dispatch({method:request.method,path:url.pathname,query:Object.fromEntries(url.searchParams),body:chunks.length?JSON.parse(Buffer.concat(chunks)):undefined,origin,workspaceNames,...(scope===undefined?{}:{workspaceKey:scope==='__global__'?'':scope})});
      response.writeHead(reply.status,{'Content-Type':'application/json'});response.end(JSON.stringify(reply.body));
    }catch{response.writeHead(500,{'Content-Type':'application/json'});response.end(JSON.stringify({error:'owned_test_server_error'}));}
  });
  server.on('connection',socket=>{sockets.add(socket);socket.on('close',()=>sockets.delete(socket));});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
});
test.after(async()=>{await assets?.close();await provider?.close();for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));});

test('Original session/user routes identify the actual local mode and never fabricate official quota or login',async()=>{
  const local=await api('GET','/local-session');assert.equal(local.status,200);assert.deepEqual(local.body.user,{id:'gamecowork-local',name:'GameCowork 本地用户',accountMode:'local'});assert.equal(local.body.mode,'gamecowork-local');assert.equal(local.body.capabilities.localHistory,true);assert.equal(local.body.capabilities.localGeneration,false);
  assert.deepEqual((await api('GET','/user/me')).body,local.body.user);
  for(const route of ['/credit/my-credits','/credit/my-paid-status','/credit/cost-preview']){const result=await api('GET',route);assert.equal(result.status,503);assert.equal(result.body.credits,null);assert.equal(result.body.currentCredits,null);assert.equal(result.body.paidType,null);}
  assert.equal((await api('GET','/editor/sso/bootstrap')).status,401);assert.equal((await api('GET','/generation-history/access')).body.globalHistoryView,false);
});

test('Original task list/detail wire shapes contain actual owned output URLs and preserve real inputs',async()=>{
  const result=await api('GET','/tasks',{query:{status:'completed',page:1,pageSize:40,discarded:false}});assert.equal(result.status,200);assert.equal(result.body.total,3);assert.equal(result.body.size,3);
  assert.equal(Object.hasOwn(result.body,'content'),false);const row=result.body.tasks.find(task=>task.id===imageTask.id);assert.equal(row.category,'image');assert.equal(row.input.data.prompt,imageTask.prompt);assert.equal(row.input.data.width,48);assert.equal(row.workspaceName,'真实工程 A');
  assert.equal(row.output.data.artifacts[0].sha256,provider.media.png.sha256);assert.ok(row.output.data.imageUrl.startsWith(origin+'/api/codely-generator/local-artifacts/'));assert.equal(Object.hasOwn(row.output.data.artifacts[0],'base64'),false);
  const pixels=await fetch(row.output.data.imageUrl);assert.equal(pixels.headers.get('content-type'),'image/png');assert.equal(sha(Buffer.from(await pixels.arrayBuffer())),provider.media.png.sha256);
  const input=await fetch(row.input.data.imageUrls[0]);assert.equal(sha(Buffer.from(await input.arrayBuffer())),provider.media.png.sha256);
  for(const route of ['/task/'+imageTask.id+'/status','/editor/task/'+imageTask.id+'/id-status','/generation-history/task/'+imageTask.id])assert.equal((await api('GET',route)).body.id,imageTask.id);
  const model=(await api('GET','/tasks',{query:{category:'3d',status:'completed'}})).body.tasks[0];assert.equal(model.id,modelTask.id);assert.ok(model.output.data.modelUrl.endsWith('.glb'));
});

test('Original category/search/date/workspace filters and pagination operate on actual records',async()=>{
  const page=await api('GET','/editor/tasks',{query:{status:'completed',pageSize:1,page:2}});assert.equal(page.body.tasks.length,1);assert.equal(page.body.total,3);assert.equal(page.body.page,2);
  const search=await api('GET','/tasks',{query:{status:'completed',query:'actual geometry',category:'3d'}});assert.deepEqual(search.body.tasks.map(task=>task.id),[modelTask.id]);
  const byName=await api('GET','/tasks',{query:{workspaceName:'真实工程 A',status:'completed'}});assert.deepEqual(byName.body.tasks.map(task=>task.id),[imageTask.id]);
  assert.deepEqual((await api('GET','/tasks',{query:{workspaceMissing:true,status:'completed'}})).body.tasks.map(task=>task.id),[videoTask.id]);
  assert.equal((await api('GET','/tasks',{query:{endTime:imageTask.createdTime}})).body.tasks.length,0,'End boundary is exclusive');
  assert.ok((await api('GET','/tasks',{query:{startTime:modelTask.createdTime}})).body.tasks.every(task=>Date.parse(task.createdTime)>=Date.parse(modelTask.createdTime)));
  assert.equal((await api('GET','/tasks',{query:{startTime:'not a date'}})).status,400);
});

test('All-owned history, explicit global and exact workspace scope remain distinct',async()=>{
  assert.equal((await api('GET','/tasks')).body.total,4);assert.equal((await api('GET','/tasks',{scope:''})).body.total,1);assert.equal((await api('GET','/tasks',{scope:'workspace-a'})).body.total,2);
  assert.equal((await api('GET','/task/'+modelTask.id+'/status',{scope:'workspace-a'})).status,404);
  assert.equal((await api('GET','/tasks',{query:{historyScope:'all'}})).status,403);assert.equal((await api('GET','/tasks',{query:{historyScope:'email',historyEmail:'unavailable@example.invalid'}})).status,403);
  assert.deepEqual((await api('GET','/generation-history/workspaces')).body.workspaces,['真实工程 A','真实工程 B']);
});

test('Original upload-record shape and native registration completion yield only real owned media URLs',async()=>{
  const listed=await api('GET','/upload/records',{query:{page:1,pageSize:500}});assert.equal(listed.body.records.length,1);assert.equal(listed.body.records[0].kind,'image');assert.equal(listed.body.records[0].sha256,reference.sha256);
  const done=await api('POST','/sso/upload/image',{body:{inputId:reference.id},scope:'workspace-a'});assert.equal(done.status,200);assert.equal(done.body.url,listed.body.records[0].url);
  assert.equal((await api('POST','/sso/upload/image',{body:{inputId:reference.id},scope:'workspace-b'})).status,404);assert.equal((await api('POST','/sso/upload/model',{body:{inputId:reference.id},scope:'workspace-a'})).status,400);
  const download=await api('GET','/sso/attachment/download-url',{query:{url:done.body.url}});assert.equal(download.body.url,done.body.url);
  assert.equal((await api('GET','/sso/attachment/download-url',{query:{url:'https://external.invalid/owned.png'}})).status,400);
});

test('Real tag CRUD, per-task update results, intersection counts and deletion preserve generation files',async()=>{
  const created=await api('POST','/tags',{body:{name:'角色',description:'本地真实标签'}}),second=await api('POST','/tags',{body:{name:'待用',description:''}});assert.equal(created.status,200);const firstId=created.body.id,secondId=second.body.id;assert.equal(created.body.scope,'user');
  assert.equal((await api('POST','/tags',{body:{name:'角色',description:'重复'}})).status,409);
  const updated=await api('PATCH','/tasks/tags',{body:{taskIds:[imageTask.id,'missing-task'],addTagIds:[firstId,secondId],removeTagIds:[]}});assert.deepEqual(updated.body.results,[{taskId:imageTask.id,updated:true},{taskId:'missing-task',updated:false,error:'task_not_found'}]);
  assert.equal((await api('PATCH','/editor/tasks/tags',{body:{taskIds:[modelTask.id],addTagIds:[firstId],removeTagIds:[]}})).body.results[0].updated,true);
  const listed=await api('GET','/tags',{query:{status:'completed'}});assert.equal(listed.body.tags.find(tag=>tag.id===firstId).count,2);assert.equal(listed.body.tags.find(tag=>tag.id===secondId).count,1);
  assert.deepEqual((await api('GET','/tasks',{query:{tagIds:firstId+','+secondId,status:'completed'}})).body.tasks.map(task=>task.id),[imageTask.id]);
  const renamed=await api('PATCH','/tags/'+secondId,{body:{name:'完成',description:'实际修改'}});assert.equal(renamed.body.name,'完成');
  const scoped=await api('PATCH','/tasks/tags',{body:{taskIds:[modelTask.id],addTagIds:[secondId],removeTagIds:[]},scope:'workspace-a'});assert.equal(scoped.body.results[0].updated,false);
  const before=assets.getArtifactPath(imageTask.id,imageTask.artifacts[0].id);assert.equal((await api('DELETE','/tags/'+secondId)).status,200);assert.equal(sha(fs.readFileSync(before.path)),provider.media.png.sha256);assert.equal((await api('GET','/task/'+imageTask.id+'/status')).body.tags.length,1);
});

test('Discarded status and flat original UI preferences persist across service recreation',async()=>{
  assert.equal((await api('PUT','/tasks/discarded',{body:{taskIds:[imageTask.id],discarded:true}})).body.updated,1);
  assert.deepEqual((await api('GET','/tasks',{query:{discarded:true}})).body.tasks.map(task=>task.id),[imageTask.id]);assert.equal((await assets.dispatch('generator/getTask',{taskId:imageTask.id})).task.discarded,true);
  assert.deepEqual((await api('PUT','/user/ui-prefs',{body:{prefs:{generationViewMode:'list'}}})).body,{generationViewMode:'list'});
  const tagBefore=(await api('GET','/task/'+imageTask.id+'/status')).body.tags[0].id;await assets.close();reopen();
  assert.deepEqual((await api('GET','/editor/user/ui-prefs')).body,{generationViewMode:'list'});assert.equal((await api('GET','/task/'+imageTask.id+'/status')).body.tags[0].id,tagBefore);assert.equal((await api('GET','/tasks',{query:{discarded:true}})).body.total,1);
  assert.equal((await api('PUT','/user/ui-prefs',{body:{prefs:{generationViewMode:'not-a-layout'}}})).status,400);
});

test('Generation without an explicit original-model mapping fails without charging the configured provider',async()=>{
  const before=provider.requests.length,result=await api('POST','/sso/generate',{body:{kind:'frontier_flare',data:{prompt:'Do not submit',quality:'medium'}}});assert.equal(result.status,503);assert.equal(result.body.error,'generation_provider_not_configured');assert.equal(provider.requests.length,before);
  assert.equal((await api('GET','/sso/assets/search')).status,503);
});

test('Failed local persistence never reports successful preference/tag mutations',async()=>{
  const file=path.join(store,'codely-generator-state.json'),alias=path.join(root,'owned-state-hardlink.json'),before=fs.readFileSync(file);fs.linkSync(file,alias);
  try{assert.equal((await api('PUT','/user/ui-prefs',{body:{prefs:{generationViewMode:'grid'}}})).status,500);assert.equal((await api('POST','/tags',{body:{name:'不得虚报保存'}})).status,500);assert.deepEqual(fs.readFileSync(file),before);assert.deepEqual((await api('GET','/user/ui-prefs')).body,{generationViewMode:'list'});assert.equal((await api('GET','/tags')).body.tags.some(tag=>tag.name==='不得虚报保存'),false);}finally{fs.unlinkSync(alias);}
});

test('The private API refuses non-loopback origins and never emits account secrets or internal storage paths',async()=>{
  for(const bad of ['https://127.0.0.1:1234','http://external.invalid','http://127.0.0.1:1234/path','http://user:pass@127.0.0.1:1234'])assert.equal((await compatibility.dispatch({method:'GET',path:'/local-session',origin:bad})).status,400);
  const result=JSON.stringify((await api('GET','/tasks')).body);assert.equal(result.includes(provider.apiKey),false);assert.equal(result.includes(store),false);assert.equal(result.includes('_file'),false);
});
