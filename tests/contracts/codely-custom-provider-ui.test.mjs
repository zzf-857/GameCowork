import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {gamecoworkSetProviderDescriptors,gamecoworkCustomModel,gamecoworkThirdPartyModels,gamecoworkProviderModels,gamecoworkCapabilityChoices,gamecoworkCustomParameterSettings,gamecoworkOpenAiImageSizePresets,gamecoworkPromptHintError,gamecoworkCpaFactLines,gamecoworkModelAcceptsReferences,gamecoworkCpaParameterError,cpaImage25Variants} from '../../src/frontend/bundle/codely-generator/local-models.js';
import {gamecoworkGenerationReadiness,gamecoworkGenerationPresentation} from '../../src/frontend/bundle/codely-generator/local-generation.js';
import {gamecoworkMediaDimensionFacts,gamecoworkOpenAiImageExactSizePresets,gamecoworkOpenAiSizeSelection,gamecoworkCustomImagePixelChanges,gamecoworkImageFormatLabel,gamecoworkCpaParameterSettings,cpaImageModels,gamecoworkMediaPrecisionSummary} from '../../src/frontend/bundle/codely-generator/local-models.js';
import {gamecoworkProviderForm,gamecoworkProviderSaveBody,gamecoworkProviderRequest,gamecoworkManualCapabilities,gamecoworkManualCapabilityForm,gamecoworkProviderProtocols} from '../../src/frontend/bundle/codely-generator/provider-manager.js';

const id='cust_'+ 'a'.repeat(32),second='cust_'+ 'b'.repeat(32);
const unknown={status:'unknown',evidence:'unknown',choices:[]};
const supported=(choices,evidence='tested')=>({status:'supported',evidence,choices});
const row=changes=>({id,stableStudioId:id,providerId:'owned-fixture',providerName:'Fixture',model:'gpt-image-2',upstreamModel:'gpt-image-2',label:'Fixture Image',protocol:'openai-images',kind:'image',mode:'image',generationAvailable:true,capabilities:{size:unknown,quality:unknown,outputFormat:unknown,aspectRatio:unknown,upscale:unknown,references:unknown},...changes});
const session=rows=>({mode:'gamecowork-local',capabilities:{models:{},localGeneration:false,providerDescriptors:rows}});
test.afterEach(()=>gamecoworkSetProviderDescriptors([]));

test('Official and custom results compare requested ratios with measured primary media, not thumbnails or reports',()=>{
  const task={status:'completed',type:'seedance2',input:{data:{ratio:'16:9',resolution:'720p'}},output:{data:{artifacts:[{mime:'video/mp4',role:'result',width:1280,height:720,dimensionKind:'display'}]}}};
  assert.ok(gamecoworkCpaFactLines(task).some(row=>row.label==='比例核验'&&row.value==='精确匹配请求比例'));
  assert.deepEqual(gamecoworkMediaDimensionFacts(task)[0],{label:'视频显示尺寸',value:'1280×720'});
  const mismatch={...task,output:{data:{artifacts:[{mime:'image/png',role:'preview',width:1280,height:720},{mime:'video/mp4',role:'result',width:720,height:1280,dimensionKind:'display'}]}}};
  assert.ok(gamecoworkMediaDimensionFacts(mismatch).some(row=>row.value==='已生成，请求比例不匹配'));
  const unknown={...task,providerReportedImage:{size:'1280x720'},output:{data:{artifacts:[{mime:'video/mp4',role:'result'}]}}};
  assert.ok(gamecoworkMediaDimensionFacts(unknown).some(row=>row.value==='文件尺寸未能核验'));
  const image={...task,input:{data:{imageSize:{width:1536,height:1024},aspectRatio:'3:2'}},output:{data:{artifacts:[{mime:'image/png',width:1536,height:1024,role:'result'}]}}};
  assert.ok(gamecoworkMediaDimensionFacts(image).some(row=>row.value==='已达到请求像素'));
  assert.ok(gamecoworkMediaDimensionFacts(image).some(row=>row.value==='精确匹配请求比例'));
  assert.equal(gamecoworkMediaDimensionFacts({...image,status:'running'}).some(row=>row.label==='比例核验'),false);
  const partial={...image,output:{data:{artifacts:[...image.output.data.artifacts,{mime:'video/webm',role:'result'}]}}};
  assert.equal(gamecoworkMediaDimensionFacts(partial).some(row=>row.value.startsWith('已达到请求')),false,'Unknown primary dimensions cannot be proved by a different matching result');
  assert.equal(gamecoworkMediaDimensionFacts(partial).filter(row=>row.value==='部分产物尺寸未能核验').length,2);
});

test('New request presets have exact rational ratios while original rounded tuples remain unchanged',()=>{
  const core=createRequire(import.meta.url)('../../src/core/binary/out/modules/providers/catalog.js');
  assert.deepEqual(gamecoworkOpenAiImageExactSizePresets,core.OPENAI_IMAGE_EXACT_SIZE_PRESETS);
  let changed=0;
  for(const [tier,presets]of Object.entries(gamecoworkOpenAiImageExactSizePresets))for(const [ratio,size]of Object.entries(presets)) {
    const [w,h]=size.split('x').map(Number),[rw,rh]=ratio.split(':').map(Number);
    assert.equal(w*rh,h*rw);assert.equal(w%16,0);assert.equal(h%16,0);assert.ok(w*h>=655360&&w*h<=8294400&&w<=3840&&h<=3840);
    if(gamecoworkOpenAiImageSizePresets[tier][ratio]!==size)changed++;
  }
  assert.equal(changed,8);assert.equal(gamecoworkOpenAiImageSizePresets['2k']['2:3'],'1360x2048');
  assert.equal(gamecoworkOpenAiImageExactSizePresets['2k']['2:3'],'1344x2016');
});

test('Custom pixels can be chosen after a preset and clearing the nominal ratio retains the entered dimensions',()=>{
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size'})]);const model=gamecoworkCustomModel(id);
  const state={prompt:'Owned scene',size:'auto',quality:'auto',format:'png',ratio:'auto',resolutionHint:'3840x2160',aspectRatioHint:'16:9'},change=(field,value)=>state[field]=value;
  gamecoworkCustomParameterSettings(model,state,change).find(item=>item.key==='image-request-tier').onChange('custom');
  assert.equal(state.resolutionHint,'3840x2160');assert.equal(state.aspectRatioHint,'auto');
  Object.assign(state,gamecoworkCustomImagePixelChanges(model,'3200x2400'));
  assert.equal(gamecoworkCpaParameterError(model,state),'');assert.equal(model.build(state).resolutionHint,'3200x2400');
  gamecoworkCustomParameterSettings(model,state,change).find(item=>item.key==='image-request-aspect').onChange('auto');
  assert.equal(state.resolutionHint,'3200x2400');assert.equal(state.aspectRatioHint,'auto');
  assert.equal(gamecoworkCpaParameterError(model,state),'');
  for(const tier of Object.keys(gamecoworkOpenAiImageExactSizePresets))for(const aspect of Object.keys(gamecoworkOpenAiImageExactSizePresets[tier])) {
    gamecoworkCustomParameterSettings(model,state,change).find(item=>item.key==='image-request-tier').onChange(tier);
    gamecoworkCustomParameterSettings(model,state,change).find(item=>item.key==='image-request-aspect').onChange(aspect);
    assert.equal(state.resolutionHint,gamecoworkOpenAiImageExactSizePresets[tier][aspect]);assert.equal(gamecoworkCpaParameterError(model,state),'');
  }
});

test('Restoring a rounded historical draft preserves bytes and labels until an explicit new preset is selected',()=>{
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size'})]);const model=gamecoworkCustomModel(id);
  const state={prompt:'Own retained scene',size:'auto',quality:'auto',format:'png',ratio:'auto',resolutionHint:'1360x2048',aspectRatioHint:'2:3'},before=JSON.stringify(state),change=(field,value)=>state[field]=value;
  const selection=gamecoworkOpenAiSizeSelection(state.resolutionHint,state.aspectRatioHint);
  assert.equal(selection.alignment,'rounded');assert.equal(selection.tier,'legacy-2k');
  const setting=gamecoworkCustomParameterSettings(model,state,change).find(item=>item.key==='image-request-tier');
  assert.match(setting.options[0].label,/历史取整/);assert.equal(model.build(state).resolutionHint,'1360x2048');assert.equal(JSON.stringify(state),before);
  setting.onChange('2k');assert.equal(state.resolutionHint,'1344x2016');assert.equal(state.aspectRatioHint,'2:3');
});

test('Explicit API size and ratio cannot contradict a prompt target, and custom pixels synchronize supported ratios',()=>{
  const aspect={...supported(['1:1','4:3','16:9']),requestField:'aspect_ratio'};
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size',capabilities:{...row().capabilities,aspectRatio:aspect}})]);const model=gamecoworkCustomModel(id);
  const state={prompt:'Own scene',size:'auto',quality:'auto',format:'png',ratio:'1:1',resolutionHint:'1536x864',aspectRatioHint:'16:9'};
  assert.match(gamecoworkCpaParameterError(model,state),/接口构图比例与目标比例冲突/);assert.throws(()=>model.build(state));
  Object.assign(state,gamecoworkCustomImagePixelChanges(model,'3200x2400'));assert.equal(state.ratio,'4:3');assert.equal(gamecoworkCpaParameterError(model,state),'');
  state.size='1024x1024';assert.match(gamecoworkCpaParameterError(model,state),/接口尺寸与目标像素冲突/);
});

test('Manual capability edits preserve explicit upstream fields and distinguish response transport from image encoding',()=>{
  const prior={size:{...supported(['1024x1024']),requestField:'image_size'},quality:{...supported(['medium','high']),requestField:'quality_level'},outputFormat:{...supported(['url','b64_json']),requestField:'response_format'}};
  const form=gamecoworkManualCapabilityForm(prior);assert.deepEqual(gamecoworkManualCapabilities(form),{});
  form.quality={...form.quality,choicesText:'low, medium, high',dirty:true};form.outputFormat={...form.outputFormat,choicesText:'b64_json, url',dirty:true};
  const changed=gamecoworkManualCapabilities(form);assert.equal(changed.quality.requestField,'quality_level');assert.equal(changed.outputFormat.requestField,'response_format');
  assert.equal(gamecoworkImageFormatLabel(changed.outputFormat),'图片返回方式');assert.equal(gamecoworkImageFormatLabel({requestField:'output_format'}),'图片文件格式');
  assert.throws(()=>gamecoworkManualCapabilities({outputFormat:{status:'supported',choicesText:'b64_json',requestField:'output_format',dirty:true}}),/文件格式/);
  assert.throws(()=>gamecoworkManualCapabilities({outputFormat:{status:'supported',choicesText:'png',requestField:'response_format',dirty:true}}),/返回方式/);
  gamecoworkSetProviderDescriptors([row({capabilities:{...row().capabilities,outputFormat:prior.outputFormat}})]);const model=gamecoworkCustomModel(id);
  const state={size:'auto',quality:'auto',format:'b64_json',ratio:'auto',prompt:'Owned'};
  assert.equal(gamecoworkCustomParameterSettings(model,state,()=>{}).find(item=>item.key==='provider-outputFormat').label,'图片返回方式');
  assert.equal(model.build(state).outputFormat,'b64_json');
});

test('Measured proportions report exact, rounded approximation and mismatch independently of gateway claims',()=>{
  const make=(w,h,ratio)=>({status:'completed',input:{data:{aspectRatio:ratio}},output:{data:{artifacts:[{mime:'image/png',role:'result',width:w,height:h}]}}});
  const value=task=>gamecoworkMediaDimensionFacts(task).find(row=>row.label==='比例核验').value;
  assert.equal(value(make(1920,1080,'16:9')),'精确匹配请求比例');
  assert.equal(value(make(1360,2048,'2:3')),'符合历史取整预设，比例近似');
  assert.equal(value(make(1672,941,'16:9')),'接近请求比例，非精确');
  assert.equal(value(make(941,1672,'9:16')),'接近请求比例，非精确');
  assert.equal(value(make(1024,1024,'16:9')),'已生成，请求比例不匹配');
  const pending={...make(1920,1080,'16:9'),status:'running'};assert.equal(gamecoworkMediaDimensionFacts(pending).some(row=>row.label==='比例核验'),false);
  const missing=make(1920,1080,'16:9');missing.output.data.artifacts.push({mime:'image/png',role:'result'});assert.equal(value(missing),'部分产物尺寸未能核验');
  const conflicted=make(1920,1080,'1:1');conflicted.input.data.aspectRatioHint='16:9';assert.match(value(conflicted),/历史接口与提示词比例要求冲突/);
});

test('CPA API size is an explicit draft opt-in and account-auto output stays byte-for-byte compatible',()=>{
  for(const model of cpaImageModels) {
    const state={prompt:'Owned CPA scene',size:'auto',quality:'auto',format:'png',ratio:'16:9',requestSizeMode:'auto',resolutionHint:'auto',aspectRatioHint:'auto'};
    const original=model.build(state);assert.equal(Object.hasOwn(original,'requestSizeMode'),false);assert.equal(original.size,'auto');assert.equal(original.quality,'auto');
    const change=(field,value)=>state[field]=value;
    gamecoworkCpaParameterSettings(model,state,change)[0].onChange('api-size');
    assert.equal(state.requestSizeMode,'api-size');assert.equal(state.resolutionHint,'1536x864');assert.equal(state.aspectRatioHint,'16:9');
    assert.equal(model.build(state).requestSizeMode,'api-size');assert.equal(model.build(state).size,'1536x864');assert.equal(model.build(state).quality,'auto');assert.equal(model.build(state).outputFormat,'png');
    assert.equal(gamecoworkCpaParameterSettings(model,state,change).find(item=>item.key==='image-request-tier').options.some(item=>item.value==='auto'),false,'The explicit API-size mode cannot select an undefined auto size');
    Object.assign(state,gamecoworkCustomImagePixelChanges({protocol:'openai-images',imageSizePolicy:'openai-size'},'3824x2064'));
    assert.equal(model.build(state).size,'3824x2064');assert.equal(model.build(state).aspectRatio,'auto','Core derives the exact pixel ratio even when its reduced integers exceed 99');
    state.quality='high';assert.throws(()=>model.build(state),/账户自动质量/);state.quality='auto';
    state.resolutionHint='1360x2048';state.aspectRatioHint='2:3';assert.throws(()=>model.build(state),/精确一致/);
    gamecoworkCpaParameterSettings(model,state,change)[0].onChange('auto');
    assert.equal(state.size,'auto');assert.equal(state.resolutionHint,'auto');assert.equal(state.requestSizeMode,'auto');assert.deepEqual(model.build(state),original);
  }
});

test('A restored CPA API-size draft retains its frozen request and changing controls never submits or rewrites it',()=>{
  const model=cpaImageModels[0],state={prompt:'Retained own scene',size:'1536x864',quality:'auto',format:'png',ratio:'16:9',requestSizeMode:'api-size',resolutionHint:'1536x864',aspectRatioHint:'16:9'},before=JSON.stringify(state);
  const settings=gamecoworkCpaParameterSettings(model,state,()=>assert.fail('Reading controls must not change a draft'));
  assert.equal(settings[0].value,'api-size');assert.equal(model.build(state).size,'1536x864');assert.equal(JSON.stringify(state),before);
  const legacy={...state,requestSizeMode:'auto',size:'1024x1024',quality:'low'};
  assert.throws(()=>model.build(legacy),/默认参数/);
  const source=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js',import.meta.url),'utf8');
  assert.ok(source.includes('gcwSetCpaSizeMode(ot.requestSizeMode==="api-size"?"api-size":"auto")'));
  assert.ok(source.includes('requestSizeMode:gcwCpaSizeMode'));
});

test('Completed cards expose real mismatches and approximate ratios without elevating echoed model or size fields',()=>{
  gamecoworkSetProviderDescriptors([row({imageSizePolicy:'openai-size'})]);const model=gamecoworkCustomModel(id);
  const task={type:id,status:'completed',input:{data:{studioModelId:id,size:'3840x2160',aspectRatioHint:'16:9'}},output:{data:{artifacts:[{mime:'image/png',role:'result',width:1672,height:941}]}},providerReportedImage:{model:'gpt-image-2',size:'3840x2160',quality:'auto'}};
  const facts=gamecoworkCpaFactLines(task,model),summary=gamecoworkMediaPrecisionSummary({...task,cpaFacts:facts});
  assert.equal(summary.precision,'mismatch');assert.match(summary.text,/1672×941.*未达到请求尺寸.*比例近似/);
  assert.equal(facts.find(item=>item.label==='服务报告型号').value,'gpt-image-2');assert.equal(facts.find(item=>item.label==='实际型号').value,'未确认');
  assert.equal(task.status,'completed');assert.equal(task.providerReportedImage.size,'3840x2160');
  const cpa={status:'completed',type:cpaImageModels[0].id,input:{data:{studioModelId:cpaImageModels[0].id,aspectRatio:'16:9'}},output:task.output};
  assert.equal(gamecoworkMediaPrecisionSummary(cpa).precision,'approximate');
  assert.match(gamecoworkMediaPrecisionSummary(cpa).text,/1672×941.*比例近似/);
  const sunburst={...task,input:{data:{studioModelId:id,size:'2048x2048',aspectRatioHint:'1:1'}},output:{data:{artifacts:[{mime:'image/png',role:'result',width:1672,height:940}]}}};
  assert.match(gamecoworkMediaPrecisionSummary(sunburst).text,/1672×940.*未达到请求尺寸.*比例不匹配/);
});

test('REST descriptors preserve declared media kind, typed service parameters and exact history identity',()=>{
  for(const [kind,mode] of [['video','video'],['audio','audio'],['model','3d']]) {
    const ready=gamecoworkGenerationReadiness(session([row({kind,mode,protocol:'generic-rest-task'})]));
    const model=gamecoworkCustomModel(id),parameters={resolution:'720p',aspect_ratio:'16:9',seconds:5,options:{audio:false,seeds:[1,2]}};
    assert.equal(model.kind,kind);assert.equal(model.mode,mode);
    assert.equal(gamecoworkGenerationPresentation(ready,'zh',id).blocked,false);
    assert.deepEqual(model.build({prompt:'Owned clip',providerParameters:JSON.stringify(parameters)}),{studioModelId:id,model:'gpt-image-2',prompt:'Owned clip',parameters});
    assert.deepEqual(gamecoworkCustomParameterSettings(model,{},()=>{}),[],'Unrelated official image controls cannot silently apply to a REST video');
    for(const value of ['[]','null','{"resolution":','{"model":"other"}','{"apiKey":"secret"}','{"options":{"__proto__":{}}}'])assert.throws(()=>model.build({prompt:'Owned',providerParameters:value}),/参数/);
    const spoof={...ready,models:{[id]:{...ready.models[id],kind:'image',mode:'image'}}};
    assert.equal(gamecoworkGenerationPresentation(spoof,'zh',id).blocked,true);
  }
});

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
  assert.match(gamecoworkPromptHintError({size:'1536x1024',resolutionHint:'3072x2048',aspectRatioHint:'3:2'}),/接口尺寸与目标像素冲突/,'Explicit API and prompt targets must agree even when their ratios match');
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
  assert.equal(settings.some(item=>item.key==='provider-quality'),false);assert.match(settings[0].footer,/实际输出仍须核验/);
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
  const core=createRequire(import.meta.url)('../../src/core/binary/out/modules/providers/catalog.js');
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
