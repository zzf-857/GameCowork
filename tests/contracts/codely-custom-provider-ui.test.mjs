import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {gamecoworkSetProviderDescriptors,gamecoworkCustomModel,gamecoworkThirdPartyModels,gamecoworkProviderModels,gamecoworkCapabilityChoices,gamecoworkCustomParameterSettings,gamecoworkOpenAiImageSizePresets,gamecoworkPromptHintError,gamecoworkCpaFactLines,gamecoworkModelAcceptsReferences,gamecoworkCpaParameterError,cpaImage25Variants} from '../../src/frontend/bundle/codely-generator/local-models.js';
import {gamecoworkGenerationReadiness,gamecoworkGenerationPresentation} from '../../src/frontend/bundle/codely-generator/local-generation.js';
import {gamecoworkProviderForm,gamecoworkProviderSaveBody,gamecoworkProviderRequest,gamecoworkManualCapabilities,gamecoworkProviderProtocols} from '../../src/frontend/bundle/codely-generator/provider-manager.js';

const id='cust_'+ 'a'.repeat(32),second='cust_'+ 'b'.repeat(32);
const unknown={status:'unknown',evidence:'unknown',choices:[]};
const supported=(choices,evidence='tested')=>({status:'supported',evidence,choices});
const row=changes=>({id,stableStudioId:id,providerId:'owned-fixture',providerName:'Fixture',model:'gpt-image-2',upstreamModel:'gpt-image-2',label:'Fixture Image',protocol:'openai-images',kind:'image',mode:'image',generationAvailable:true,capabilities:{size:unknown,quality:unknown,outputFormat:unknown,aspectRatio:unknown,upscale:unknown,references:unknown},...changes});
const session=rows=>({mode:'gamecowork-local',capabilities:{models:{},localGeneration:false,providerDescriptors:rows}});
test.afterEach(()=>gamecoworkSetProviderDescriptors([]));

test('Unknown custom capabilities submit only the fixed server route, upstream model and prompt',()=>{
  const ready=gamecoworkGenerationReadiness(session([row()])),model=gamecoworkCustomModel(id);
  assert.equal(gamecoworkGenerationPresentation(ready,'zh',id).blocked,false);
  assert.deepEqual(model.build({prompt:'Own fixture',size:'auto',quality:'auto',format:'png',ratio:'auto'}),{studioModelId:id,model:'gpt-image-2',prompt:'Own fixture'});
  const settings=gamecoworkCustomParameterSettings(model,{},()=>{});
  assert.deepEqual(settings.map(value=>value.key),['prompt-resolution-target','prompt-aspect-target']);
  assert.equal(settings.every(value=>value.label.includes('提示词要求')&&value.footer.includes('不保证')),true);
  assert.equal(gamecoworkModelAcceptsReferences(model),false);
  for(const field of ['size','quality','format','ratio']) assert.throws(()=>model.build({prompt:'Own fixture',[field]:'unverified'}),/没有验证/);
  assert.equal(cpaImage25Variants.map(value=>value.label).join(','),'默认,快速,精致');
  assert.equal(gamecoworkThirdPartyModels().length,5);
});
test('Model-specific supported controls preserve exact choices and manual evidence does not claim testing',()=>{
  const cap={size:supported(['1024x1024','1536x1024']),quality:supported(['low','high'],'manual'),outputFormat:supported(['png','webp'],'documented'),aspectRatio:unknown,upscale:supported(['2','4']),references:supported(['image'])};
  gamecoworkSetProviderDescriptors([row({capabilities:cap})]);const model=gamecoworkCustomModel(id),changes=[];
  const settings=gamecoworkCustomParameterSettings(model,{size:'1536x1024',quality:'high',format:'webp'},(field,value)=>changes.push([field,value]));
  assert.deepEqual(settings.map(value=>value.key),['provider-size','provider-quality','provider-outputFormat','prompt-resolution-target','prompt-aspect-target']);
  assert.match(settings[1].footer,/手动配置，未验证/);settings[0].onChange('1024x1024');assert.deepEqual(changes,[['size','1024x1024']]);
  assert.deepEqual(model.build({prompt:'Owned',size:'1536x1024',quality:'high',format:'webp'}),{studioModelId:id,model:'gpt-image-2',prompt:'Owned',size:'1536x1024',quality:'high',outputFormat:'webp'});
  assert.equal(gamecoworkModelAcceptsReferences(model),false,'A capability declaration does not implement a reference uploader');
  assert.equal(settings.some(value=>/upscale|超分/.test(value.key)),false,'Native output dimensions are not an independent upscaler');
  assert.match(gamecoworkCpaParameterError(model,{size:'4096x4096',quality:'low',format:'png'}),/没有验证/);
});
test('Prompt-only targets stay separate from unverified API options and preserve the original prompt',()=>{
  gamecoworkSetProviderDescriptors([row()]);const model=gamecoworkCustomModel(id),prompt='An actual game scene with a stone bridge and castle.';
  const payload=model.build({prompt,resolutionHint:'2048x1152',aspectRatioHint:'16:9'});
  assert.deepEqual(payload,{studioModelId:id,model:'gpt-image-2',prompt,resolutionHint:'2048x1152',aspectRatioHint:'16:9'});
  assert.equal(Object.hasOwn(payload,'size'),false);assert.equal(Object.hasOwn(payload,'quality'),false);
  assert.equal(gamecoworkPromptHintError({resolutionHint:'2048x1152',aspectRatioHint:'16:9'}),'');
  assert.match(gamecoworkPromptHintError({resolutionHint:'2048x2048',aspectRatioHint:'16:9'}),/冲突/);
  for(const value of ['1025x1024','4096x4096','16x3840','0x16','not-size']) assert.ok(gamecoworkPromptHintError({resolutionHint:value}));
  for(const value of ['4:1','100:1','0:1','landscape']) assert.ok(gamecoworkPromptHintError({aspectRatioHint:value}));
  assert.equal(gamecoworkPromptHintError({size:'1536x1024',resolutionHint:'3072x2048',aspectRatioHint:'3:2'}),'','Prompt target pixels may differ from the API request when composition agrees');
  assert.throws(()=>model.build({prompt,resolutionHint:'2048x2048',aspectRatioHint:'16:9'}),/冲突/);
  const executionPrompt=prompt+'\nTarget image dimensions: 2048x1152. Target aspect ratio: 16:9.';
  const facts=gamecoworkCpaFactLines({type:id,input:{data:payload},executionPrompt});
  assert.equal(facts.find(value=>value.label==='提示词目标尺寸').value,'2048x1152');
  assert.equal(facts.find(value=>value.label==='实际发送提示词').value,executionPrompt);
});
test('The explicit standard size policy exposes documented 1K/2K/4K pixels without manufacturing quality evidence',()=>{
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size',imageSizePolicyInfo:{evidence:'documented',actual4kTested:false,constraints:{minPixels:655360}}})]);const model=gamecoworkCustomModel(id),changed={resolutionHint:'auto',aspectRatioHint:'auto'};
  assert.equal(model.capabilities.size.status,'unknown');assert.equal(model.capabilities.quality.status,'unknown');
  const settings=gamecoworkCustomParameterSettings(model,changed,(field,value)=>changed[field]=value);
  assert.deepEqual(settings.map(item=>item.key),['image-request-tier','image-request-aspect','image-request-pixels']);
  assert.equal(settings.some(item=>item.key==='provider-quality'),false);assert.match(settings[0].footer,/实际输出已验证/);
  settings[0].onChange('4k');assert.equal(changed.resolutionHint,'2880x2880');
  gamecoworkCustomParameterSettings(model,changed,(field,value)=>changed[field]=value)[1].onChange('16:9');assert.equal(changed.resolutionHint,'3840x2160');
  gamecoworkCustomParameterSettings(model,changed,(field,value)=>changed[field]=value)[1].onChange('9:16');assert.equal(changed.resolutionHint,'2160x3840');
  const payload=model.build({...changed,prompt:'A detailed actual game environment.'});
  assert.equal(payload.resolutionHint,'2160x3840');assert.equal(payload.aspectRatioHint,'9:16');assert.equal(Object.hasOwn(payload,'size'),false,'Core freezes policy and derives size');assert.equal(Object.hasOwn(payload,'quality'),false);
  assert.deepEqual(model.build({prompt:'Service default'}),{studioModelId:id,model:'gpt-image-2',prompt:'Service default'});
  assert.ok(gamecoworkCpaParameterError(model,{resolutionHint:'640x1008'}),'Exact XCAI minimum pixel budget is enforced');
  assert.equal(gamecoworkCpaParameterError(model,{resolutionHint:'800x832'}),'');
});
test('All 27 published rounded presets agree with Core; arbitrary conflicting targets still fail',()=>{
  const core=createRequire(import.meta.url)('../../src/core/binary/out/gamecowork-provider-catalog.js');
  assert.deepEqual(gamecoworkOpenAiImageSizePresets,core.OPENAI_IMAGE_SIZE_PRESETS);
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size'})]);const model=gamecoworkCustomModel(id);
  for(const presets of Object.values(gamecoworkOpenAiImageSizePresets))for(const [ratio,size] of Object.entries(presets)) {
    const request={resolutionHint:size,aspectRatioHint:ratio};assert.equal(gamecoworkPromptHintError(request,model),'');assert.doesNotThrow(()=>core.composeImagePrompt('Actual mountain village scene.',request,{imageSizePolicy:'openai-size'}));
  }
  assert.ok(gamecoworkPromptHintError({resolutionHint:'3312x2496',aspectRatioHint:'4:3'},model));
  assert.throws(()=>core.composeImagePrompt('Actual scene.',{resolutionHint:'3312x2496',aspectRatioHint:'4:3'},{imageSizePolicy:'openai-size'}),/conflict/);
  assert.ok(gamecoworkPromptHintError({resolutionHint:'3312x2480',aspectRatioHint:'4:3'}),'Prompt-only preserves strict old behavior');
  assert.ok(gamecoworkPromptHintError({resolutionHint:'4096x4096'},model));
  const unsupported={...model,capabilities:{...model.capabilities,size:{status:'unsupported',evidence:'tested',choices:[]}}};
  assert.match(gamecoworkCpaParameterError(unsupported,{resolutionHint:'3840x2160',aspectRatioHint:'16:9'}),/不支持接口尺寸参数/);
  assert.equal(gamecoworkCpaParameterError(unsupported,{resolutionHint:'auto',aspectRatioHint:'auto'}),'','A service-default generation does not send size');
});
test('Provider default size policy does not block a new XCAI default and explicit reset updates an existing opt-out',()=>{
  const fresh={...gamecoworkProviderForm(),name:'Owned XCAI',baseUrl:'https://xcai.pro/v1'};
  assert.equal(Object.hasOwn(gamecoworkProviderSaveBody(fresh).provider,'imageSizePolicy'),false);
  const old={...fresh,id:'owned-xcai',imageSizePolicy:'prompt-only'};assert.equal(gamecoworkProviderSaveBody(old).provider.imageSizePolicy,'prompt-only');
  assert.equal(gamecoworkProviderSaveBody({...old,imageSizePolicy:'default',baseUrl:'https://XCAI.pro:443/v1/'}).provider.imageSizePolicy,'openai-size');
  assert.equal(gamecoworkProviderSaveBody({...old,imageSizePolicy:'default',baseUrl:'https://fixture.invalid/v1'}).provider.imageSizePolicy,'prompt-only');
  assert.equal(Object.hasOwn(gamecoworkProviderSaveBody({...old,protocol:'openai-chat',kinds:['chat']}).provider,'imageSizePolicy'),false);
});
test('Completed undersized files retain their success state and distinct request evidence',()=>{
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size'})]);
  const task={type:id,status:'completed',input:{data:{studioModelId:id,model:'gpt-image-2',prompt:'Actual scene',size:'3840x2160',resolutionHint:'3840x2160',aspectRatioHint:'16:9'}},output:{data:{artifacts:[{width:48,height:32,mime:'image/png',role:'result'}]}},providerReportedImage:{size:'3840x2160'},executionPrompt:'Actual scene\nRequired final image resolution: 3840 x 2160 pixels.'};
  const before=JSON.stringify(task),facts=gamecoworkCpaFactLines(task);
  assert.deepEqual(facts[0],{label:'像素核验',value:'已生成，目标像素未兑现'});assert.equal(facts.find(item=>item.label==='API 请求尺寸').value,'3840x2160');assert.equal(facts.find(item=>item.label==='文件像素').value,'48×32');assert.equal(JSON.stringify(task),before);
  assert.equal(gamecoworkCpaFactLines({...task,status:'running'}).some(item=>item.label==='像素核验'),false);
  assert.equal(gamecoworkCpaFactLines({...task,output:{data:{artifacts:[{width:3840,height:2160,mime:'image/png'}]}}})[0].value,'已达到请求像素');
  assert.equal(gamecoworkCpaFactLines({...task,output:{data:{artifacts:[{width:3840,height:2160,mime:'image/png'},{width:48,height:32,mime:'image/png'}]}}})[0].value,'部分图片目标像素未兑现');
  assert.equal(facts[1].label,'API 请求尺寸');
  assert.equal(gamecoworkCpaFactLines({...task,input:{data:{studioModelId:id}},providerReportedImage:{size:'48x32'}}).some(item=>item.label==='像素核验'),false,'A gateway report is not a requested pixel target');
  const prior={...task,input:{data:{studioModelId:id,resolutionHint:'2048x1152'}}};const priorFacts=gamecoworkCpaFactLines(prior);
  assert.equal(priorFacts.some(item=>item.label==='API 请求尺寸'),false,'A previous prompt-only hint never becomes evidence of an API field');assert.equal(priorFacts[0].value,'已生成，目标像素未兑现');
});
test('Dynamic descriptors reject spoofed identities and official models, and refresh removes stale routes',()=>{
  gamecoworkSetProviderDescriptors([row(),row({id:'qwen-image',stableStudioId:'qwen-image'}),row({id:second,stableStudioId:second,kind:'chat',mode:'chat'}),row({id:second,stableStudioId:second,providerId:'bad\nprovider'}),row({upstreamModel:'bad\nmodel'})]);
  assert.equal(gamecoworkThirdPartyModels().length,5);assert.equal(gamecoworkCustomModel(id).upstreamModel,'gpt-image-2');
  const ready=gamecoworkGenerationReadiness(session([row({generationAvailable:false})]));assert.equal(gamecoworkGenerationPresentation(ready,'zh',id).blocked,true);
  gamecoworkSetProviderDescriptors([]);assert.equal(gamecoworkCustomModel(id),undefined);
  for(const value of [unknown,{status:'supported',evidence:'unknown',choices:['high']},{status:'unsupported',evidence:'tested',choices:['high']}])assert.deepEqual(gamecoworkCapabilityChoices(value),[]);
});
test('Deleting a selected Provider blocks its draft and never silently selects CPA',()=>{
  const model=gamecoworkProviderModels(gamecoworkThirdPartyModels(),'removed-provider')[0];
  assert.equal(model.providerId,'removed-provider');assert.equal(model.generationAvailable,false);
  assert.equal(gamecoworkModelAcceptsReferences(model),false,'The removed Provider placeholder does not expose reference or sketch controls');
  assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(session([])),'zh',model.id).blocked,true);
  assert.throws(()=>model.build({prompt:'Preserved draft'}),/当前不可用/);
  assert.equal(gamecoworkProviderModels(gamecoworkThirdPartyModels(),'cpa').length,4);
});
test('Provider credential edits are write-only and local protocols require explicit localhost authorization',()=>{
  const base=gamecoworkProviderForm({id:'owned',name:'Owned',baseUrl:'https://fixture.invalid/v1',protocol:'openai-images',kinds:['image'],authMode:'bearer',apiKeyConfigured:true,defaultModel:'gpt-image-2'});
  assert.equal(base.apiKey,'');assert.equal('apiKey' in gamecoworkProviderSaveBody(base).provider,false);
  const withKey=gamecoworkProviderSaveBody({...base,apiKey:'owned-test-secret'});assert.equal(withKey.provider.apiKey,'owned-test-secret');
  assert.equal(gamecoworkProviderSaveBody({...base,clearApiKey:true}).provider.clearApiKey,true);
  const local={...base,protocol:'ollama',kinds:['chat'],authMode:'none',baseUrl:'http://localhost:11434'};
  assert.throws(()=>gamecoworkProviderSaveBody(local),/显式勾选/);assert.equal(gamecoworkProviderSaveBody({...local,allowInsecureLan:true}).provider.authMode,'none');
  assert.throws(()=>gamecoworkProviderSaveBody({...local,baseUrl:'http://192.168.1.2:11434',allowInsecureLan:true}),/localhost/);
  for(const baseUrl of ['https://name:secret@fixture.invalid/v1','https://fixture.invalid/v1?key=not-allowed','file:///private'])assert.throws(()=>gamecoworkProviderSaveBody({...base,baseUrl}));
  assert.equal(gamecoworkProviderProtocols.find(value=>value.id==='comfyui').note.includes('尚未接入'),true);
});
test('Unchanged documented/tested capabilities are not replaced by manual declarations',()=>{
  const values={size:{status:'supported',choicesText:'1024x1024',dirty:false},quality:{status:'supported',choicesText:'low, high,low',dirty:true}};
  assert.deepEqual(gamecoworkManualCapabilities(values).quality,{status:'supported',evidence:'manual',choices:['low','high']});
  assert.equal(Object.hasOwn(gamecoworkManualCapabilities(values),'size'),false);
});
test('Provider management calls only own configuration endpoints, omits cookies and cannot generate',async()=>{
  const calls=[],fetcher=async(url,init)=>{calls.push({url,init});return{ok:true,json:async()=>({providers:[]})};};
  assert.deepEqual(await gamecoworkProviderRequest('/local/providers',{fetcher}),{providers:[]});
  await gamecoworkProviderRequest('/local/providers/owned/model-capabilities',{method:'PUT',body:{modelId:'slash/model',capabilities:{}},fetcher});
  assert.equal(calls[0].url,'/api/codely-generator/local/providers');assert.equal(calls[0].init.credentials,'omit');assert.equal(calls[0].init.redirect,'error');
  assert.equal(JSON.parse(calls[1].init.body).modelId,'slash/model');
  for(const route of ['/sso/generate','https://fixture.invalid/models','//outside.invalid','/local/providers#invalid'])await assert.rejects(gamecoworkProviderRequest(route,{fetcher}),/本机接口/);
  assert.equal(calls.length,2);
});
test('The original Quick composition uses existing dialog and task flow without changing the audio renderer',()=>{
  const source=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js',import.meta.url),'utf8');
  assert.ok(source.includes('f.jsx(GameCoworkProviderControls,{React:y,Dialog:TM'));
  assert.ok(source.includes('thirdparty:gamecoworkThirdPartyModels()'));
  assert.ok(source.includes('gamecoworkCustomParameterSettings(e,'));
  assert.ok(source.includes('该历史 Provider 模型当前不可用，请先恢复原配置'));
  assert.ok(source.includes('gamecoworkCpaImage25Variant(Pe.id)&&f.jsx("div",{role:"group"'));
  const module=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/provider-manager.js',import.meta.url),'utf8');
  assert.doesNotMatch(module,/localStorage|sessionStorage|\/sso\/generate|Authorization:/);
});
