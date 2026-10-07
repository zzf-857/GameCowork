import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const spec=require('../../src/core/binary/out/modules/generation/models/official-video-3d.js');
const fixture=JSON.parse(fs.readFileSync(new URL('../fixtures/codely-generator-api-contract.json',import.meta.url),'utf8'));
const originals=new Map(fixture.registry.models.map(m=>[m.id,m.fields]));
const normalize=value=>JSON.parse(JSON.stringify(value));
const url='http://127.0.0.1:12345/api/tauri/generator/inputs/owned.glb';
function builder(id,options,refs={}) {
  const source=originals.get(id).build;
  // Execute only extracted, side-effect-free builder functions in an empty VM.
  const context=vm.createContext({options,refs,Xy:'v3.5-20260815',Nu:{low:'fast',medium:'standard',high:'detailed',extreme:'extreme'},yA:'doubao-seedance-2-0-mini-260615',
    M5:(mode,ref)=>mode==='reference'||mode==='multimodal'&&ref.images?.length&&!ref.videos?.length&&!ref.audios?.length?'reference_image':mode});
  if(source.expression==='P1e')return {modelUrl:options.modelUrl,outputFormat:options.format==='auto'?'':options.format||''};
  return normalize(vm.runInContext(`(${source.functionSource})(options,refs)`,context,{timeout:100}));
}
function asOriginalOptions(id,p) {
  if(spec.MODELS[id].mode==='video')return {prompt:p.prompt,mode:p.mode==='reference_image'?'reference':p.mode,seedanceModel:p.model,ratio:p.ratio||p.videoRatio,resolution:p.resolution||p.videoResolution,duration:p.duration||p.videoDuration,size:p.imageSize};
  return {prompt:p.prompt||p.inputText,rodinTier:p.tier,rodinFaceLimit:p.qualityOverride,textureQuality:'low',pbr:p.pbr??p.enablePBR,quad:p.quad,faceLimit:p.faceLimit,faceCount:p.faceCount,resultFormat:p.resultFormat,modelUrl:p.modelUrl||p.url,format:p.outputFormat,texturePrompt:p.texturePromptText,segmentationGranularity:p.segmentationGranularity,splitByConnectivity:p.splitByConnectivity};
}
test('original Quick has exactly seven visible video and twelve visible 3D adapters',()=>{
  assert.equal(Object.values(spec.MODELS).filter(m=>m.visible&&m.mode==='video').length,7);
  assert.equal(Object.values(spec.MODELS).filter(m=>m.visible&&m.mode==='3d').length,12);
  for(const row of Object.values(spec.MODELS)) {assert.ok(originals.has(row.id));assert.ok(['model','video'].includes(row.kind));assert.ok(Object.isFrozen(row.quoteFields));}
  for(const id of ['enhance-video','viggle-motion']) {assert.equal(spec.MODELS[id].visible,false);assert.throws(()=>spec.minimalPayload(id));}
});
for(const row of Object.values(spec.MODELS).filter(m=>m.visible)) {
  test(`${row.id}: minimal payload matches the original pure Quick builder and quote`,()=>{
    const p=spec.minimalPayload(row.id,{models:[url]});
    assert.deepEqual(p,builder(row.id,asOriginalOptions(row.id,p)));
    const actual=spec.quoteFor(row.id,p),original=originals.get(row.id);
    const context=vm.createContext({options:asOriginalOptions(row.id,p),Xy:'v3.5-20260815',Nu:{low:'fast',medium:'standard',high:'detailed',extreme:'extreme'},yA:'doubao-seedance-2-0-mini-260615'});
    const taskType=typeof original.creditTaskType==='object'?vm.runInContext(`(${original.creditTaskType.functionSource})(options)`,context):original.creditTaskType;
    const query=original.creditParams?normalize(vm.runInContext(`(${original.creditParams.functionSource})(options)`,context)):{};
    assert.deepEqual(actual,{taskType,...query});
    assert.deepEqual(Object.keys(actual).filter(k=>k!=='taskType'),row.quoteFields);
    const clone=spec.validatePayload(row.id,p);assert.notEqual(clone,p);clone.surprise=true;assert.equal(p.surprise,undefined);
    assert.throws(()=>spec.validatePayload(row.id,{...p,endpoint:'https://unowned.invalid/'}));
    assert.throws(()=>spec.validatePayload(row.id,{...p,studioKind:'a-different-model'}));
  });
}
test('Seedance preserves three variants and fixes hidden long-duration boundaries',()=>{
  const p=spec.minimalPayload('seedance2');
  for(const version of spec.MODELS.seedance2.variants)assert.equal(spec.validatePayload('seedance2',{...p,model:version}).model,version);
  assert.throws(()=>spec.validatePayload('seedance2',{...p,model:'gpt-image'}));
  assert.throws(()=>spec.validatePayload('seedance2',{...p,duration:20}));
  assert.throws(()=>spec.validatePayload('minimax-h3',{...spec.minimalPayload('minimax-h3'),duration:20}));
  assert.throws(()=>spec.validatePayload('happyhorse-11',{...spec.minimalPayload('happyhorse-11'),duration:20}));
  assert.equal(spec.validatePayload('seedance25',{...spec.minimalPayload('seedance25'),duration:30}).duration,30);
});
test('frame and multimodal references have exact slots, types, mode and limits',()=>{
  const p={...spec.minimalPayload('seedance2'),mode:'first_last_frame',images:[url+'/first.png',url+'/last.png']};
  assert.deepEqual(spec.referenceSlots('seedance2',p),p.images.map((value,index)=>({pointer:`/images/${index}`,value,mediaKinds:['image']})));
  assert.throws(()=>spec.validatePayload('seedance2',{...p,images:[url]}));
  assert.throws(()=>spec.validatePayload('seedance2',{...p,videos:[url]}));
  const refs={...spec.minimalPayload('seedance25'),mode:'multimodal',images:Array.from({length:30},(_,i)=>`${url}/${i}.png`),videos:[url+'/v.mp4'],audios:[url+'/a.wav']};
  const slots=spec.referenceSlots('seedance25',refs);assert.equal(slots.length,32);assert.deepEqual(slots.at(-1),{pointer:'/audios/0',value:refs.audios[0],mediaKinds:['audio']});
  assert.throws(()=>spec.validatePayload('seedance25',{...refs,images:[...refs.images,url]}));
  assert.throws(()=>spec.validatePayload('seedance25',{...refs,mode:'text_to_video'}));
  assert.throws(()=>spec.validatePayload('minimax-h3-max',{...spec.minimalPayload('minimax-h3-max'),mode:'reference',images:[url]}));
});
test('Wan first/last frame and reference source fields remain original',()=>{
  const p={...spec.minimalPayload('wan3'),mode:'first_last_frame',first_frame:url+'/f.png',last_frame:url+'/l.png'};
  assert.deepEqual(spec.referenceSlots('wan3',p).map(s=>s.pointer),['/first_frame','/last_frame']);
  assert.throws(()=>spec.validatePayload('wan3',{...p,reference_images:[url]}));
  assert.throws(()=>spec.validatePayload('wan3',{...p,last_frame:undefined}));
  const r={...spec.minimalPayload('wan3'),mode:'reference',reference_images:[url],reference_videos:[url],reference_audios:[url]};
  assert.deepEqual(spec.referenceSlots('wan3',r).map(s=>s.mediaKinds[0]),['image','video','audio']);
});
test('Tripo cannot override version, fixed exports or original limits',()=>{
  for(const id of ['tripo-p2','tripo-p1','tripo-31']) {
    const p=spec.minimalPayload(id);assert.throws(()=>spec.validatePayload(id,{...p,modelVersion:'untrusted'}));assert.throws(()=>spec.validatePayload(id,{...p,withFbx:false}));
    const image={...p,imageUrl:url};delete image.prompt;assert.equal(spec.quoteFor(id,image).taskType,'tripo_image_to_model');
    assert.deepEqual(spec.referenceSlots(id,image),[{pointer:'/imageUrl',value:url,mediaKinds:['image']}]);
    assert.throws(()=>spec.validatePayload(id,{...image,prompt:'mixed source'}));
  }
  assert.throws(()=>spec.validatePayload('tripo-p1',{...spec.minimalPayload('tripo-p1'),quad:false}));
  assert.throws(()=>spec.validatePayload('tripo-p2',{...spec.minimalPayload('tripo-p2'),faceLimit:50000}));
  assert.throws(()=>spec.validatePayload('tripo-31',{...spec.minimalPayload('tripo-31'),quad:true,faceLimit:300000}));
});
test('dynamic quote metadata includes exactly both original Tripo builder branches',()=>{
  for(const id of ['tripo-p2','tripo-p1','tripo-31']) {
    const row=spec.MODELS[id];assert.deepEqual(row.quoteTaskTypes,['tripo_text_to_model','tripo_image_to_model']);assert.ok(Object.isFrozen(row.quoteTaskTypes));
    const original=originals.get(id).creditTaskType.functionSource,context=vm.createContext({});
    assert.equal(vm.runInContext(`(${original})({})`,context),row.quoteTaskTypes[0]);
    assert.equal(vm.runInContext(`(${original})({imageUrl:'owned-reference'})`,context),row.quoteTaskTypes[1]);
    const text=spec.minimalPayload(id),image={...text,imageUrl:url};delete image.prompt;
    assert.equal(spec.quoteFor(id,text).taskType,row.quoteTaskTypes[0]);assert.equal(spec.quoteFor(id,image).taskType,row.quoteTaskTypes[1]);
  }
  // The only other original dynamic task is hidden and cannot grant Pro access.
  assert.equal(spec.MODELS['viggle-motion'].visible,false);assert.deepEqual(spec.MODELS['viggle-motion'].quoteTaskTypes,['viggle_text_motion','viggle_video_motion']);
  assert.throws(()=>spec.quoteFor('viggle-motion',{}));
});
test('3D format and downstream operations reject source-free or arbitrary provider values',()=>{
  assert.equal(spec.minimalPayload('hy-31').resultFormat,'GLB');
  assert.equal(spec.minimalPayload('rodin-25').geometryFormat,'fbx');
  assert.throws(()=>spec.validatePayload('rodin-25',{...spec.minimalPayload('rodin-25'),geometryFormat:'glb'}));
  for(const id of ['blender-convert','mesh-seg','texture-model','decimate','unirig','mia']) {
    assert.throws(()=>spec.minimalPayload(id));
    const p=spec.minimalPayload(id,{models:[url]});assert.deepEqual(spec.referenceSlots(id,p).map(s=>s.mediaKinds),[['model']]);
  }
  assert.throws(()=>spec.validatePayload('mesh-seg',{...spec.minimalPayload('mesh-seg',{models:[url]}),segmentationGranularity:'invented'}));
  assert.throws(()=>spec.validatePayload('blender-convert',{modelUrl:url,outputFormat:'exe'}));
});
