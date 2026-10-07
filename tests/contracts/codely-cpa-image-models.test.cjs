'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {CPA_IMAGE_MODELS,validateCpaImageSize,validateCpaImagePayload,validateCpaImageAccountPayload,cpaImageRequestPrompt,isCpaImageProvider}=require('../../src/core/binary/out/modules/generation/models/cpa-image.js');
const payload=(descriptor,changes={})=>({prompt:'Owned image',model:descriptor.model,studioModelId:descriptor.id,size:'1536x1024',quality:'low',outputFormat:'png',...changes});
test('CPA retains every exact verified model ID including the gateway 2.5 alias',()=>{
  assert.deepEqual(Object.values(CPA_IMAGE_MODELS).map(row=>row.model),['gpt-image-2','gpt-image-2.5','gpt-image-2.5-flare','gpt-image-2.5-sunburst']);
  for(const row of Object.values(CPA_IMAGE_MODELS))assert.deepEqual(validateCpaImagePayload(row.id,payload(row)),payload(row));
});
test('CPA accepts precise square, landscape, portrait, auto and bounded custom dimensions',()=>{
  for(const size of ['auto','1024x1024','1536x1024','1024x1536','1536x864','864x1536','1280x720','2048x2048','3840x2160','2160x3840','2560x1024','1280x512'])assert.equal(validateCpaImageSize(size),size);
  for(const size of ['1024X1024',' 1024x1024','01024x1024','0x1024','1025x1024','4096x2048','3840x3840','1024x256','512x512','1024x1024&n=10','16x4096',{},1024])assert.throws(()=>validateCpaImageSize(size));
});
test('CPA validates model-specific quality and formats without allowing prompt/model/request overrides',()=>{
  for(const row of Object.values(CPA_IMAGE_MODELS))for(const quality of row.qualityOptions)for(const outputFormat of ['png','jpeg','webp'])assert.equal(validateCpaImagePayload(row.id,payload(row,{quality,outputFormat})).quality,quality);
  const old=CPA_IMAGE_MODELS['cpa-gpt-image-2'];
  for(const changes of [{quality:'max'},{outputFormat:'jpg'},{model:'gpt-image-2.5'},{n:2},{apiKey:'no'},{size:'512x512'},{prompt:''},{prompt:'bad\0input'},{studioModelId:'constructor'}])assert.throws(()=>validateCpaImagePayload(old.id,payload(old,changes)));
  for(const id of ['constructor','__proto__','frontier_flare','gpt-image-2.5'])assert.throws(()=>validateCpaImagePayload(id,payload(old)));
});
test('The CPA shared profile only accepts its existing JSON image route and standard response selectors',()=>{
  const provider={enabled:true,model:'gpt-image-2',kinds:['image'],authMode:'bearer',apiKeyConfigured:true,adapter:{responseMode:'outputs',create:{method:'POST',path:'/images/generations',bodyType:'json'},selectors:{outputs:'data'},outputSelectors:{base64:'b64_json',url:'url'}}};
  assert.equal(isCpaImageProvider(provider),true);
  for(const changes of [{enabled:'true'},{model:'gpt-6.1-sol'},{kinds:'image'},{apiKeyConfigured:false},{authMode:'none'},{adapter:{...provider.adapter,create:{...provider.adapter.create,bodyType:'multipart'}}},{adapter:{...provider.adapter,create:{...provider.adapter.create,path:'/chat/completions'}}},{adapter:{...provider.adapter,outputSelectors:{...provider.adapter.outputSelectors,url:'other'}}}])assert.equal(isCpaImageProvider({...provider,...changes}),false);
});
test('The active account profile rejects unfulfilled quality/format/exact-pixel overrides before upstream',()=>{
  const row=CPA_IMAGE_MODELS['cpa-gpt-image-2-5-flare'],base=payload(row,{size:'auto',quality:'auto',outputFormat:'png',aspectRatio:'auto'});
  for(const changes of[{size:'1024x1024'},{size:'1536x1024'},{quality:'high'},{quality:'xhigh'},{quality:'max'},{outputFormat:'jpeg'},{outputFormat:'webp'},{aspectRatio:'7:3'}])assert.throws(()=>validateCpaImageAccountPayload(row.id,{...base,...changes}));
  assert.deepEqual(validateCpaImageAccountPayload(row.id,base),base);
  for(const ratio of['1:1','3:2','2:3','16:9','9:16','4:3','3:4']){
    const input={...base,aspectRatio:ratio},checked=validateCpaImageAccountPayload(row.id,input);
    assert.equal(checked.prompt,input.prompt);assert.ok(cpaImageRequestPrompt(checked).includes(ratio));assert.ok(cpaImageRequestPrompt(checked).endsWith(input.prompt));
  }
  assert.equal(cpaImageRequestPrompt(base),base.prompt);
});
test('Explicit CPA API-size opt-in keeps original defaults while requiring legal precise pixels and matching ratios',()=>{
  for(const row of Object.values(CPA_IMAGE_MODELS)) {
    const input=payload(row,{size:'1536x864',quality:'auto',aspectRatio:'16:9',requestSizeMode:'api-size'}),checked=validateCpaImageAccountPayload(row.id,input);assert.deepEqual(checked,input);
    const prompt=cpaImageRequestPrompt(checked);assert.ok(prompt.startsWith(input.prompt+'\n\n'));assert.match(prompt,/1536 x 864 pixels/);assert.match(prompt,/aspect ratio: 16:9/);
    for(const change of [{size:'auto'},{size:'2048x1360',aspectRatio:'3:2'},{size:'1536x864',aspectRatio:'1:1'},{quality:'low'},{quality:'high'},{outputFormat:'jpeg'},{outputFormat:'webp'},{requestSizeMode:'anything'},{n:2},{providerId:'other'}])assert.throws(()=>validateCpaImageAccountPayload(row.id,{...input,...change}));
  }
  const row=CPA_IMAGE_MODELS['cpa-gpt-image-2'],custom=validateCpaImageAccountPayload(row.id,payload(row,{size:'3824x1296',quality:'auto',aspectRatio:'auto',requestSizeMode:'api-size'}));assert.match(cpaImageRequestPrompt(custom),/aspect ratio: 239:81/);
  const {OPENAI_IMAGE_EXACT_SIZE_PRESETS}=require('../../src/core/binary/out/modules/providers/catalog.js');for(const presets of Object.values(OPENAI_IMAGE_EXACT_SIZE_PRESETS))for(const [aspectRatio,size]of Object.entries(presets))validateCpaImageAccountPayload(row.id,payload(row,{size,quality:'auto',aspectRatio,requestSizeMode:'api-size'}));
  assert.throws(()=>validateCpaImageAccountPayload(row.id,payload(row,{size:'1536x864',quality:'auto',aspectRatio:'16:9'})),'An older non-auto payload cannot silently activate the new mode');
});
