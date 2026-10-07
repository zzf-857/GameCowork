// All transports are absent. Evaluate only the source-grounded pure builders
// and the maintained Quick's two dimension helpers, then exercise real Core
// validation/reference/quote contracts for every selectable combination.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const catalog = require('../../src/core/binary/out/modules/generation/models/official-catalog.js');
const image = require('../../src/core/binary/out/modules/generation/models/official-image.js');
const video = require('../../src/core/binary/out/modules/generation/models/official-video-3d.js');
const fixture = JSON.parse(fs.readFileSync(new URL('../fixtures/codely-generator-api-contract.json', import.meta.url), 'utf8'));
const rows = new Map(fixture.registry.models.map(row => [row.id, row.fields]));
const quick = fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js', import.meta.url), 'utf8');
const copy = value => JSON.parse(JSON.stringify(value));
const urls = kind => Array.from({length: 50}, (_, i) => `http://127.0.0.1:41331/owned-${kind}-${i}.${kind === 'image' ? 'png' : kind === 'video' ? 'mp4' : 'wav'}`);
const images = urls('image'), videos = urls('video'), audios = urls('audio');
const namedRatios = {square_hd:'1:1',square:'1:1',portrait_4_3:'3:4',portrait_16_9:'9:16',landscape_4_3:'4:3',landscape_16_9:'16:9',auto:'1:1'};
const pixelTiers = {'1K':1024*1024,'2K':2048*2048,'4K':4096*4096};
const pixelRatios = ['1:1','3:4','4:3','9:16','16:9'];
function pureFunction(name, next) {
  const start = quick.indexOf(`function ${name}(`), end = quick.indexOf(next, start);
  assert.ok(start >= 0 && end > start, `Original pure helper ${name} still has its bounded source location`);
  return quick.slice(start, end).trim().replace(/;$/, '');
}
const context = vm.createContext({vN:namedRatios,Fu:pixelTiers,C5:3840,A5:3840*2160,Xy:'v3.5-20260815',Nu:{low:'fast',medium:'standard',high:'detailed',extreme:'extreme'},yA:'doubao-seedance-2-0-mini-260615'}, {codeGeneration:{strings:false,wasm:false}});
vm.runInContext(pureFunction('Ey','function ONe(') + ';' + pureFunction('yN','const eL='), context, {timeout:1000});
vm.runInContext('function Wv(t,e){if(t.images?.length)e.imageUrls=t.images;else if(t.imageUrl)e.imageUrls=[t.imageUrl];return e} function N5(){return "medium"} function M5(t,e){return t==="reference"||t==="multimodal"&&e.images?.length&&!e.videos?.length&&!e.audios?.length?"reference_image":t}', context, {timeout:1000});
const runFunction = source => vm.runInContext('(' + source + ')', context, {timeout:1000});
context.iw = {build:runFunction(rows.get('frontier-game-design').build.functionSource),creditParams:runFunction(rows.get('frontier-game-design').creditParams.functionSource)};
const variantSource = fixture.registry.generatedVariants.buildSource;
const variantStart = variantSource.indexOf('build: (e) => {') + 'build: '.length;
const variantEnd = variantSource.indexOf('\n    },\n    info:',variantStart) + '\n    }'.length;
context.I5 = {build:runFunction(variantSource.slice(variantStart,variantEnd)),creditParams:state=>({...context.iw.creditParams(state),quality:'medium'})};
function original(id) {
  return ['frontier_flare','frontier_sunburst'].includes(id) ? context.I5 : {
    build:runFunction(rows.get(id).build.functionSource),
    creditParams:rows.get(id).creditParams?.functionSource ? runFunction(rows.get(id).creditParams.functionSource) : ()=>({}),
  };
}
function verified(id,state,refs={}) {
  const model = catalog.MODELS[id], definition = original(id), payload = copy(definition.build(state,refs));
  assert.deepEqual(catalog.validatePayload(id,payload),payload,`${id}: full original payload accepted`);
  const taskType = typeof rows.get(id)?.creditTaskType === 'object' ? runFunction(rows.get(id).creditTaskType.functionSource)(state) : model.taskType;
  assert.deepEqual(catalog.quoteFor(id,payload),{taskType,...copy(definition.creditParams(state))},`${id}: original quote matches selected controls`);
  assert.equal(catalog.referenceSlots(id,payload).length, Object.values(payload).filter(Array.isArray).reduce((sum,value)=>sum+value.length,0) + ['imageUrl','first_frame','last_frame'].filter(key=>typeof payload[key]==='string').length);
  return payload;
}
function stateFor(id,overrides={}) {
  return {prompt:'A blue cube with a plain white background.',size:rows.get(id)?.sizeOptions?.[0]||'square',resolution:'1K',quality:'medium',format:'png',segMode:'none',segmentation:false,background:'auto',images:[],scale:1,numLayers:1,sceneMode:'full',nadirCorrection:'off',highRes:false,hyRevise:false,mode:'text_to_image',...overrides};
}
function referenceCounts(model,required=false) {
  return required ? [1] : [...new Set([0,1,model.maxInputs])].filter(count=>count<=model.maxInputs);
}
for (const id of ['seedream-lite','seedream-pro','hy-image-v3','qwen-image']) test(`${id}: all visible resolution/ratio/image-mode pairs reach Core with exact quote fields`,t=>{
  const definition = rows.get(id), model = image.MODELS[id];
  const tiers = Object.keys(pixelTiers).filter(tier=>pixelTiers[tier]>=definition.pixelMin&&pixelTiers[tier]<=definition.pixelMax);
  let cases=0;
  for(const tier of tiers) for(const ratio of pixelRatios) {
    const [w,h]=ratio.split(':').map(Number);if(w/h < definition.ratioMin || w/h > definition.ratioMax)continue;
    const size=context.Ey(tier,ratio),[width,height]=size.split('x').map(Number);
    assert.ok(width*height>=definition.pixelMin&&width*height<=definition.pixelMax,`${id} ${tier} ${ratio}: preset stays in pixel budget`);
    for(const count of referenceCounts(model)) for(const option of [false,true]) {
      const selected=images.slice(0,count),state=stateFor(id,{size,images:selected,hyRevise:option,segmentation:option});
      const payload=verified(id,state,{images:selected});
      assert.equal(payload.size,size);if(['hy-image-v3','qwen-image'].includes(id))assert.equal(payload.mode,count?'image_to_image':'text_to_image');cases++;
    }
  }
  t.diagnostic(`${cases} selectable combinations`);
});
for(const id of ['frontier','frontier-lite']) test(`${id}: every original ratio preserves fixed 1K, references and segmentation`,t=>{
  let cases=0;
  for(const ratio of rows.get(id).sizeOptions) for(const count of referenceCounts(image.MODELS[id])) for(const segmentation of [false,true]) {
    const selected=images.slice(0,count),payload=verified(id,stateFor(id,{size:ratio,images:selected,segmentation}),{images:selected});
    assert.equal(payload.aspectRatio,ratio);assert.equal(payload.resolution,'1K');cases++;
  }
  t.diagnostic(`${cases} selectable combinations`);
});
for(const id of ['frontier_flare','frontier_sunburst','frontier-game-design','sprite-animation','game-ui-kit']) test(`${id}: canvas/resolution/quality/format/segmentation/reference combinations preserve original builders`,t=>{
  const model=image.MODELS[id], definition=rows.get(id)||rows.get('frontier-game-design');
  const canvases=definition.sizeOptions, resolutions=['sprite-animation','game-ui-kit'].includes(id)?['1K']:['1K','2K','4K'];
  const qualities=['frontier-game-design','game-ui-kit'].includes(id)?['low','medium','high']:['medium'];
  const formats=id==='game-ui-kit'?['png']:['png','jpeg','webp'];
  const segmentations=['sprite-animation','game-ui-kit'].includes(id)?['none']:['none','smart','native'];
  let cases=0;
  for(const size of canvases) for(const resolution of resolutions) for(const quality of qualities) for(const format of formats) for(const segMode of segmentations) for(const count of referenceCounts(model)) {
    const selected=images.slice(0,count),state=stateFor(id,{size,resolution,quality,format,segMode,images:selected});
    const payload=verified(id,state,{images:selected});
    if(typeof payload.imageSize==='object') {
      assert.equal(`${payload.imageSize.width}x${payload.imageSize.height}`,context.yN(resolution,namedRatios[size]));
      assert.ok(payload.imageSize.width<=3840&&payload.imageSize.height<=3840&&payload.imageSize.width*payload.imageSize.height<=3840*2160);
    }
    if(id==='sprite-animation'){assert.equal(payload.nativeSegmentation,true);assert.equal(payload.background,'transparent');assert.equal(payload.outputFormat,'png');}
    cases++;
  }
  t.diagnostic(`${cases} selectable combinations`);
});
test('layering, skybox and upscale original size/count/switch options remain model-specific',()=>{
  for(const size of rows.get('seedream-layer').sizeOptions)verified('seedream-layer',stateFor('seedream-layer',{size,imageUrl:images[0]}));
  for(let numLayers=1;numLayers<=8;numLayers++)verified('qwen-layer',stateFor('qwen-layer',{numLayers,imageUrl:images[0]}));
  for(const sceneMode of ['full','distant'])for(const nadirCorrection of ['off','soft'])for(const count of [0,1,16])verified('flare-skybox',stateFor('flare-skybox',{sceneMode,nadirCorrection}),{images:images.slice(0,count)});
  for(const highRes of [false,true])verified('skybox',stateFor('skybox',{highRes}));
  for(const scale of rows.get('upscale-image').scales)verified('upscale-image',stateFor('upscale-image',{scale,imageUrl:images[0]}));
});
function videoRefs(mode,{full=false,id}={}) {
  const definition=rows.get(id);
  if(mode==='text_to_video')return {};
  if(mode==='first_frame')return {images:images.slice(0,1)};
  if(mode==='first_last_frame')return {images:images.slice(0,1),last:images[1]};
  const refs={images:images.slice(0,full?definition.maxImages||9:1)};
  if(mode==='multimodal'&&id!=='happyhorse-11'){refs.videos=videos.slice(0,full?definition.maxVideos||1:1);refs.audios=audios.slice(0,full?definition.maxAudios||1:1);}
  return refs;
}
for(const model of Object.values(video.MODELS).filter(model=>model.visible&&model.mode==='video')) test(`${model.id}: all legal modes/ratios/resolutions/durations/versions use original payload and quote`,t=>{
  const id=model.id,definition=rows.get(id),durations=definition.opts.durations.filter(duration=>duration<=(definition.opts.longDurationThreshold||Infinity));
  const modes=id==='effect-video'?['text_to_video']:definition.refModes||['text_to_video','first_frame','first_last_frame','reference','multimodal'];
  const variants=definition.variants?.map(variant=>variant.id)||[undefined];let cases=0,restricted=0;
  for(const mode of modes)for(const ratio of definition.opts.ratios)for(const resolution of definition.opts.resolutions)for(const duration of durations)for(const seedanceModel of variants)for(const full of [false,true]) {
    const state={prompt:'A static blue cube, gentle slow motion.',mode,ratio,resolution,duration,seedanceModel,size:'square_hd'},refs=videoRefs(mode,{id,full});
    if(id.startsWith('minimax')&&mode==='text_to_video'&&ratio==='adaptive') {
      const payload=copy(original(id).build(state,refs));assert.throws(()=>catalog.validatePayload(id,payload),/adaptive/);restricted++;continue;
    }
    const payload=verified(id,state,refs);assert.equal(payload.ratio||payload.videoRatio,ratio);assert.equal(payload.resolution||payload.videoResolution,resolution);
    assert.equal(payload.duration||payload.videoDuration,duration);cases++;
  }
  t.diagnostic(`${cases} selectable combinations; ${restricted} documented adaptive/text combinations rejected`);
});
test('non-Pro multi-segment durations and cross-model size/resolution values reject before quotation',()=>{
  for(const id of ['seedance2','minimax-h3','happyhorse-11'])for(const duration of rows.get(id).opts.durations.filter(value=>value>rows.get(id).opts.longDurationThreshold)) {
    assert.throws(()=>catalog.validatePayload(id,{...catalog.minimalPayload(id),duration}));
    assert.throws(()=>catalog.quoteFor(id,{...catalog.minimalPayload(id),duration}));
  }
  for(const id of ['seedance2','seedance25','minimax-h3-max']) {
    assert.throws(()=>catalog.validatePayload(id,{...catalog.minimalPayload(id),resolution:'1080P'}));
    assert.throws(()=>catalog.validatePayload(id,{...catalog.minimalPayload(id),ratio:'4:5'}));
  }
  for(const [id,size]of [['hy-image-v3','511x1024'],['hy-image-v3','2048x1024'],['qwen-image','100x3000'],['seedream-lite','1024x1024'],['seedream-pro','4096x4096']])assert.throws(()=>catalog.quoteFor(id,{...catalog.minimalPayload(id),size}));
});
