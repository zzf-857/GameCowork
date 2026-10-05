import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { randomUUID,createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
import {gamecoworkGenerationReadiness,gamecoworkGenerationPresentation,officialImageModelIds} from '../../src/frontend/bundle/codely-generator/local-generation.js';
const require=createRequire(import.meta.url);
const {createCodelyAccountBroker}=require('../../src/core/binary/out/gamecowork-codely-account.js');
const {createAssetService}=require('../../src/core/binary/out/gamecowork-assets.js');
const {createCodelyGeneratorApi}=require('../../src/core/binary/out/gamecowork-codely-generator.js');
const spec=require('../../src/core/binary/out/gamecowork-codely-official-generator.js');
const contract=JSON.parse(fs.readFileSync(new URL('../fixtures/codely-generator-api-contract.json',import.meta.url)));
const root=path.join('F:/AI/AgentMake/temp/GameCowork/tests','official-quick-'+randomUUID());
const media=createOwnedGenerationMedia(path.join(root,'media'));
const origin='http://127.0.0.1:43991', scope='workspace-a';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const payload=()=>({prompt:'A blue cube on a plain background',quality:'medium',outputFormat:'png',isSegmentation:false,nativeSegmentation:false,imageSize:'square_hd',background:'auto'});
async function until(read,good){const deadline=Date.now()+6000;for(;;){const value=await read();if(good(value))return value;assert.ok(Date.now()<deadline,'official fixture reaches its real terminal state');await new Promise(r=>setTimeout(r,10));}}
async function fixture(name){
  const calls=[],jobs=new Map(),state={paid:'paid',quote:7,failCreate:false,unknownCreate:false}; let port,serial=0;
  const access='fixture-access-'+randomUUID(), cookie='fixture-cookie-'+randomUUID();
  const server=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1:'+port),chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
    calls.push({path:url.pathname,method:req.method,query:Object.fromEntries(url.searchParams),hasAuthorization:!!req.headers.authorization,hasCookie:!!req.headers.cookie,body:body.toString('utf8')});
    const json=(data,status=200,headers={})=>{res.writeHead(status,{'Content-Type':'application/json',...headers});res.end(JSON.stringify(data));};
    if(url.pathname==='/auth/device/initiate')return json({auth_request_token:'fixture-request',user_code:'MOCK-CODE',verification_uri:'http://127.0.0.1:'+port+'/auth/device',verification_uri_complete:'http://127.0.0.1:'+port+'/auth/device',expires_in:900,interval:1});
    if(url.pathname==='/auth/device/poll')return json({status:'authorized',authorization_code:'fixture-code'});
    if(url.pathname==='/auth/device/exchange')return json({access_token:access,refresh_token:'fixture-refresh',expires_in:3600});
    if(url.pathname==='/auth/external/me')return json({id:'fixture-user',username:'fixture-user'});
    if(url.pathname==='/api/editor/sso/bootstrap')return json({id:'fixture-user' },200,{'Set-Cookie':['sid='+cookie+'; Path=/; HttpOnly','_csrf=fixture-csrf; Path=/']});
    if(url.pathname==='/api/user/me')return json({id:'fixture-user',username:'fixture-user'});
    if(url.pathname==='/api/credit/my-paid-status')return json({paidType:state.paid,productCode:'fixture-pro'});
    if(url.pathname==='/api/credit/my-credits')return json({currentCredits:1000});
    if(url.pathname==='/api/credit/cost-preview')return json({credits:state.quote});
    if(url.pathname==='/api/sso/upload/image'){
      assert.ok(body.includes(media.png.bytes),'official multipart uploads the verified owned PNG bytes');
      assert.match(req.headers['content-type'],/multipart\/form-data/);return json({url:'http://127.0.0.1:'+port+'/uploaded.png'});
    }
    if(url.pathname==='/api/sso/generate'){
      assert.equal(req.headers.authorization,'Bearer '+access);assert.ok(req.headers.cookie.includes(cookie));assert.equal(req.headers['x-csrf-token'],'fixture-csrf');
      if(state.failCreate)return json({error:'fixture failure'},500);
      if(state.unknownCreate)return json({status:'queued'});
      const request=JSON.parse(body);assert.ok(Object.hasOwn(spec.MODELS,request.kind));
      const id='official-'+(++serial);jobs.set(id,request);return json({data:{taskId:id,status:'queued'}});
    }
    if(url.pathname.startsWith('/api/task/')){
      const id=url.pathname.split('/')[3];assert.ok(jobs.has(id));return json({data:{id,status:'completed',output:{data:{imageUrl:'http://127.0.0.1:'+port+'/generated.png'}}}});
    }
    if(url.pathname==='/generated.png'){
      assert.equal(req.headers.authorization,undefined);assert.equal(req.headers.cookie,undefined);res.writeHead(200,{'Content-Type':'image/png'});return res.end(media.png.bytes);
    }
    return json({error:'fixture route missing'},404);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));port=server.address().port;
  const broker=await createCodelyAccountBroker({root:path.join(root,name,'account'),baseUrl:'http://127.0.0.1:'+port,fetch,autoDrive:false,
    vault:{seal:async bytes=>Buffer.from(bytes.toString('hex')),unseal:async bytes=>Buffer.from(bytes.toString(),'hex')}});
  await broker.start();await broker.poll();
  const service=createAssetService({root:path.join(root,name,'assets'),pollIntervalMs:20,requestTimeoutMs:2000});
  const facade=Object.fromEntries(['generationBinding','generatorOrigin','generatorUser','generatorCredits','generatorPaidStatus','generatorCostPreview','generatorGenerate','generatorTaskStatus','generatorUploadImage'].map(key=>[key,(...args)=>broker[key](...args)]));
  const api=createCodelyGeneratorApi({assetService:service,getOfficial:()=>broker.status().phase==='authenticated'?facade:null});
  const call=(method,url,body={},query={})=>api.dispatch({method,path:url,body,query,origin,workspaceKey:scope});
  return {api,service,broker,state,calls,jobs,facade,call,port,async close(){await service.close();broker.close();server.closeAllConnections();await new Promise(r=>server.close(r));}};
}

test('Actual original Frontier variant builders are accepted without replacing their model identities',()=>{
  const original=contract.registry.models.find(model=>model.id==='frontier-game-design').fields.build.functionSource;
  const context=vm.createContext({un:'/editor/task',Wv:(state,value)=>({...value,...(state.images?.length?{imageUrls:state.images}:{})}),N5:()=> 'medium',yN:()=>undefined,vN:{},DK:['medium'],kK:contract.registry.generatedVariants.variants.map(v=>({...v,taskType:v.taskType}))});
  const variants=contract.registry.generatedVariants.buildSource.slice(contract.registry.generatedVariants.buildSource.indexOf('const OK'),contract.registry.generatedVariants.buildSource.indexOf('  I5 =')).trim().replace(/,$/,';');
  vm.runInContext('const iw={build:('+original+'),creditParams:()=>({})};'+variants+'globalThis.models=OK;',context);
  for(const model of context.models){const result=model.build({prompt:payload().prompt,size:'square_hd',quality:'medium',format:'png',segMode:'none',background:'auto',images:[]});assert.deepEqual(spec.validatePayload(model.id,JSON.parse(JSON.stringify(result))),payload());}
  assert.deepEqual(Object.values(spec.MODELS).filter(model=>model.kind==='image').map(model=>model.id),officialImageModelIds);
});
test('Only explicit official model capabilities unlock the original two entries; CPA and unrelated models stay separate',()=>{
  const reply={mode:'codely-official',capabilities:{localGeneration:false,officialGeneration:true,models:{frontier_flare:{available:true,model:'frontier_flare',kind:'image',mode:'image',service:'codely-official'}}}};
  assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(reply),'zh','frontier_flare').blocked,false);
  for(const altered of [{...reply,mode:'gamecowork-local'},{...reply,capabilities:{...reply.capabilities,officialGeneration:false}},{...reply,capabilities:{...reply.capabilities,models:{frontier_flare:{available:true,model:'frontier_flare'}}}}])assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(altered),'zh','frontier_flare').blocked,true);
  for(const id of ['qwen-image','cpa-gpt-image-2','frontier_sunburst'])assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(reply),'zh',id).blocked,true);
});
test('Original API submits once with actual quote/session then caches verified pixels and preserves original history',async()=>{
  const f=await fixture('complete');try{
    const ready=await f.call('GET','/local-session');assert.equal(ready.body.capabilities.officialGeneration,true);
    const quote=await f.call('GET','/credit/cost-preview',{}, {taskType:'fal_frontier_flare',resolution:'square_hd',quality:'medium'});assert.equal(quote.body.credits,7);
    const created=await f.call('POST','/sso/generate',{kind:'frontier_flare',data:payload()});assert.equal(created.status,200);
    const final=await until(()=>f.call('GET','/task/'+created.body.taskId+'/status'),reply=>reply.body.status==='completed');
    assert.equal(f.calls.filter(c=>c.path==='/api/sso/generate').length,1);assert.deepEqual(JSON.parse(f.calls.find(c=>c.path==='/api/sso/generate').body),{kind:'frontier_flare',data:payload()});
    assert.equal(final.body.input.data.studioModelId,'frontier_flare');assert.equal(final.body.input.data.studioKind,'frontier_flare');assert.ok(final.body.output.data.imageUrl.startsWith(origin+'/api/codely-generator/local-artifacts/'));
    const task=(await f.service.dispatch('generator/getTask',{taskId:created.body.taskId})).task;assert.equal(task.officialTaskId,'official-1');assert.equal(task.artifacts[0].sha256,sha(media.png.bytes));assert.equal(task.artifacts[0].width,48);
    assert.equal(JSON.stringify(final).includes('fixture-access-'),false);assert.equal(JSON.stringify(final).includes('fixture-cookie-'),false);
  }finally{await f.close();}
});
test('Owned references upload verified bytes, change only upstream URLs, and reject foreign scope or external references',async()=>{
  const f=await fixture('reference');try{
    const inputId='i_'+randomUUID();const staging=path.join(f.service.root,'incoming',inputId+'.bin');fs.mkdirSync(path.dirname(staging),{recursive:true});fs.writeFileSync(staging,media.png.bytes);
    const input=f.service.registerInput({inputId,filename:'reference.png',byteLength:media.png.bytes.length,sha256:sha(media.png.bytes),workspaceKey:scope}).input;fs.unlinkSync(staging);
    const local=origin+'/api/codely-generator/local-inputs/'+input.id+'/reference.png?workspaceKey='+scope;
    const request={...payload(),imageUrls:[local]};const created=await f.call('POST','/sso/generate',{kind:'frontier_flare',data:request});await until(()=>f.service.dispatch('generator/getTask',{taskId:created.body.taskId}),r=>r.task.status==='completed');
    const sent=JSON.parse(f.calls.find(c=>c.path==='/api/sso/generate').body);assert.deepEqual(sent.data,{...payload(),imageUrls:['http://127.0.0.1:'+f.port+'/uploaded.png']});
    assert.deepEqual((await f.service.dispatch('generator/getTask',{taskId:created.body.taskId})).task.parameters,request);
    for(const url of ['https://external.invalid/a.png',local.replace(scope,'workspace-b')]){const rejected=await f.call('POST','/sso/generate',{kind:'frontier_flare',data:{...payload(),imageUrls:[url]}});assert.ok(rejected.status>=400);}
    assert.equal(f.calls.filter(c=>c.path==='/api/sso/generate').length,1);
  }finally{await f.close();}
});
test('Paid state and a numeric real quote are mandatory; unsupported models/parameters do not create remote tasks',async()=>{
  const f=await fixture('gates');try{
    f.state.paid='unpaid';assert.equal((await f.call('POST','/sso/generate',{kind:'frontier_flare',data:payload()})).status,403);
    f.state.paid='paid';f.state.quote=null;const created=await f.call('POST','/sso/generate',{kind:'frontier_flare',data:payload()});const final=await until(()=>f.service.dispatch('generator/getTask',{taskId:created.body.taskId}),r=>r.task.status==='failed');assert.match(final.task.error,/报价/);
    for(const data of [{...payload(),quality:'high'},{...payload(),apiKey:'forged'},{...payload(),nativeSegmentation:true}])assert.equal((await f.call('POST','/sso/generate',{kind:'frontier_flare',data})).status,400);
    assert.equal((await f.call('POST','/sso/generate',{kind:'material',data:payload()})).status,503);assert.equal(f.calls.filter(c=>c.path==='/api/sso/generate').length,0);
  }finally{await f.close();}
});
test('A failed or ambiguous official POST is never automatically sent again',async()=>{
  const f=await fixture('unknown');try{
    f.state.failCreate=true;const created=await f.call('POST','/sso/generate',{kind:'frontier_flare',data:payload()});const final=await until(()=>f.service.dispatch('generator/getTask',{taskId:created.body.taskId}),r=>r.task.status==='interrupted');
    assert.equal(final.task.mayContinue,true);await new Promise(r=>setTimeout(r,100));assert.equal(f.calls.filter(c=>c.path==='/api/sso/generate').length,1);
    const normalized=spec.normalizeTaskReply({data:{id:'official-a',status:'running',output:{data:{imageUrl:'https://example.invalid/preview.png'}}}},false);assert.equal(normalized.status,'running');
    assert.equal(spec.normalizeTaskReply({data:{id:'official-a',status:'completed',input:{imageUrl:'https://example.invalid/reference.png'}}},false).outputs.length,0);
  }finally{await f.close();}
});
