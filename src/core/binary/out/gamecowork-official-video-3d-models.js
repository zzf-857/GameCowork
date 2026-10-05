'use strict';
// Original Quick builders: j1e/U1e/V1e/H1e/W1e in index-DZWJHC3S.js.
// Enumerations are the original controls, not an unrestricted provider JSON schema.
const RATIOS = ['16:9','4:3','1:1','3:4','9:16','21:9','adaptive'];
const TEXTURE_VERSION = 'v3.5-20260815';
const TRIPO_VERSIONS = {'tripo-p2':'P2-20260801','tripo-p1':'P1-20260311','tripo-31':'v3.1-20260211'};
const SEEDANCE_VARIANTS = Object.freeze(['doubao-seedance-2-0-mini-260615','doubao-seedance-2-0-fast-260128','doubao-seedance-2-0-260128']);
const VIDEO = {
  seedance2:{resolutions:['480p','720p'],durations:[4,5,8,12,15],ratios:RATIOS,images:9,videos:3,audios:3,model:SEEDANCE_VARIANTS},
  seedance25:{resolutions:['480p','720p'],durations:[4,5,8,12,15,20,25,30],ratios:RATIOS,images:30,videos:10,audios:10,model:['doubao-seedance-2-5-260628']},
  'minimax-h3':{resolutions:['768P','2K'],durations:[4,8,12,15],ratios:RATIOS,images:9,videos:1,audios:1,model:['MiniMax-H3']},
  'minimax-h3-max':{resolutions:['480P','768P'],durations:[5,8,12,15],ratios:RATIOS,images:1,videos:0,audios:0,model:['MiniMax-H3-Max']},
  wan3:{resolutions:['480P','720P','1080P'],durations:[5,8,12,20,30],ratios:['adaptive','16:9','4:3','1:1','3:4','9:16'],images:9,videos:1,audios:1},
  'happyhorse-11':{resolutions:['720P','1080P'],durations:[3,5,8,12,15],ratios:['16:9','9:16','1:1','4:3','3:4'],images:9,videos:0,audios:0},
  'effect-video':{resolutions:['480p','720p'],durations:[5,8,12,15],ratios:['16:9','9:16','1:1','4:3'],images:0,videos:0,audios:0},
};
function row(id,name,mode,taskType,maxInputs,extra={}) {
  const quoteFields=id==='texture-model'?['model','textureQuality']
    :Object.hasOwn(TRIPO_VERSIONS,id)?['model','textureQuality','texture','pbr',...(id!=='tripo-p1'?['quad']:[])]
      :VIDEO[id]&&id!=='effect-video'?['resolution','duration',...(VIDEO[id].model?['model']:[])]:[];
  return Object.freeze({id,name,mode,kind:mode==='3d'?'model':'video',taskType,maxInputs,quoteFields:Object.freeze(quoteFields),
    ...(Object.hasOwn(TRIPO_VERSIONS,id)?{quoteTaskTypes:Object.freeze(['tripo_text_to_model','tripo_image_to_model'])}:{}),
    outputKinds:Object.freeze(mode==='3d'?['model','image','file']:['video','image']),visible:true,...extra});
}
const MODELS=Object.freeze({
  seedance2:row('seedance2','Seedance 2','video','huoshan_seedance2',15,{variants:SEEDANCE_VARIANTS}),
  seedance25:row('seedance25','Seedance 2.5','video','huoshan_seedance2',50),
  'minimax-h3':row('minimax-h3','MiniMax H3','video','minimax_h3_video',11),
  'minimax-h3-max':row('minimax-h3-max','MiniMax H3 Max','video','minimax_h3_video',2),
  wan3:row('wan3','Wan 3','video','wan3_video',11),
  'happyhorse-11':row('happyhorse-11','HappyHorse 1.1','video','happyhorse_video',9),
  'effect-video':row('effect-video','特效视频','video','effect_video_wf',0),
  'enhance-video':row('enhance-video','视频超分','video','huoshan_video_enhance',1,{visible:false,reason:'original-internal-only'}),
  'rodin-25':row('rodin-25','Rodin 2.5','3d','rodin_generation',1),
  'tripo-p2':row('tripo-p2','Tripo P2','3d','tripo_text_to_model',1),
  'tripo-p1':row('tripo-p1','Tripo P1','3d','tripo_text_to_model',1),
  'tripo-31':row('tripo-31','Tripo 3.1','3d','tripo_text_to_model',1),
  'hy-31':row('hy-31','Hy 3.1','3d','tencent_generation',1),
  'blender-convert':row('blender-convert','模型格式转换','3d','blender_convert',1,{pollTimeoutMs:1800000}),
  'mesh-seg':row('mesh-seg','3D 网格分割','3d','tripo_mesh_segmentation',1),
  'texture-model':row('texture-model','3D 重贴图','3d','tripo_texture_model',1),
  decimate:row('decimate','3D 智能减面','3d','tripo_highpoly_to_lowpoly',1),
  unirig:row('unirig','通用绑骨','3d','unirig_rig',1),
  mia:row('mia','人形绑骨','3d','mia_rig',1),
  motion:row('motion','混元角色动作','3d','hy_motion_generate',0),
  'viggle-motion':row('viggle-motion','V角色动作','3d','viggle_text_motion',1,{visible:false,reason:'original-internal-only',quoteTaskTypes:Object.freeze(['viggle_text_motion','viggle_video_motion']),videoQuotePath:'/credit/viggle-video-quote'}),
});
function fail(message) { const error=new Error(message);error.code='invalid_official_generation_request';error.beforeRequest=true;throw error; }
function model(id) { if(!Object.hasOwn(MODELS,id)||!MODELS[id].visible) fail('此模型不是当前 Pro 可见的官方 Quick 模型');return MODELS[id]; }
function keys(value,allowed) { if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value))||Object.keys(value).some(k=>!allowed.includes(k))) fail('原模型参数包含不支持的字段'); }
function one(value,options,label) { if(!options.includes(value)) fail(`不支持的${label}`); }
function bool(value,label,optional=false) { if(optional&&value===undefined)return;if(typeof value!=='boolean')fail(`无效的${label}`); }
function text(value,label,max=32000,required=true) { if(value===undefined&&!required)return;if(typeof value!=='string'||[...value].length>max||required&&!value.trim()||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))fail(`无效的${label}`); }
function address(value) { if(typeof value!=='string'||!value||value.length>8192||/[\u0000-\u001f\u007f]/.test(value))fail('无效的自有参考素材地址');let parsed;try{parsed=new URL(value);}catch{fail('无效的自有参考素材地址');}if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)fail('无效的自有参考素材地址'); }
function list(value,max,label) { if(value===undefined)return[];if(!Array.isArray(value)||value.length>max||Object.keys(value).length!==value.length||Object.keys(value).some((key,index)=>key!==String(index)))fail(`${label}超出原模型限制`);value.forEach(address);return value; }
function identity(id,p) { if(p.studioKind!==undefined&&p.studioKind!==id||p.studioModelId!==undefined&&p.studioModelId!==id)fail('原模型身份不一致'); }
function count(actual,expected) { if(actual!==expected)fail('参考素材与原视频模式不一致'); }
function validateVideo(id,p) {
  const config=VIDEO[id];
  if(id==='effect-video') {
    keys(p,['prompt','videoDuration','videoRatio','videoResolution','imageSize','studioKind','studioModelId']);
    text(p.prompt,'提示词');one(p.videoDuration,config.durations,'视频时长');one(p.videoRatio,config.ratios,'视频比例');one(p.videoResolution,config.resolutions,'视频分辨率');
    if(typeof p.imageSize!=='string'||!(/^\d{2,4}x\d{2,4}$/.test(p.imageSize)||['square_hd','square','portrait_4_3','portrait_16_9','landscape_4_3','landscape_16_9','auto'].includes(p.imageSize)))fail('无效的原特效图片尺寸');
    if(/^\d+x\d+$/.test(p.imageSize)){const [w,h]=p.imageSize.split('x').map(Number);if(w<64||h<64||w>4096||h>4096)fail('无效的原特效图片尺寸');}
    return;
  }
  const common=['mode','prompt','ratio','resolution','duration','studioKind','studioModelId'];
  const extra=id==='wan3'?['first_frame','last_frame','reference_images','reference_videos','reference_audios']
    :id==='happyhorse-11'?['first_frame','references','watermark']
      :['model','images','videos','audios',...(id==='seedance2'?['seed']:id==='seedance25'?['output_format']:[])];
  keys(p,[...common,...extra]);one(p.ratio,config.ratios,'视频比例');one(p.resolution,config.resolutions,'视频分辨率');one(p.duration,config.durations,'视频时长');
  if(config.model)one(p.model,config.model,'视频模型版本');
  if(id==='seedance2'&&p.seed!==-1)fail('Seedance 原参数 seed 必须为 -1');
  if(id==='seedance25'&&p.output_format!=='mp4')fail('Seedance 2.5 原输出格式必须为 MP4');
  if(id==='happyhorse-11'&&p.watermark!==false)fail('HappyHorse 原 watermark 参数必须为 false');
  const seedance=id.startsWith('seedance');
  const modes=id==='happyhorse-11'?['text_to_video','first_frame','reference_image']
    :id==='minimax-h3-max'?['text_to_video','first_frame','first_last_frame']
      :seedance?['text_to_video','first_frame','first_last_frame','reference_image','multimodal']
        :['text_to_video','first_frame','first_last_frame','reference'];
  one(p.mode,modes,'视频模式');
  let images,videos,audios;
  if(id==='wan3') {
    if(p.first_frame!==undefined)address(p.first_frame);if(p.last_frame!==undefined)address(p.last_frame);
    images=list(p.reference_images,config.images,'参考图');videos=list(p.reference_videos,config.videos,'参考视频');audios=list(p.reference_audios,config.audios,'参考音频');
    if(p.mode==='first_frame'||p.mode==='first_last_frame'){if(!p.first_frame)fail('缺少视频首帧');count(+!!p.last_frame,p.mode==='first_last_frame'?1:0);count(images.length+videos.length+audios.length,0);}
    else {count(+!!p.first_frame+ +!!p.last_frame,0);if(p.mode==='text_to_video')count(images.length+videos.length+audios.length,0);else if(!images.length&&!videos.length&&!audios.length)fail('缺少视频参考素材');}
  } else if(id==='happyhorse-11') {
    if(p.first_frame!==undefined)address(p.first_frame);images=list(p.references,config.images,'参考图');videos=[];audios=[];
    if(p.mode==='first_frame'){if(!p.first_frame)fail('缺少视频首帧');count(images.length,0);}else {count(+!!p.first_frame,0);if(p.mode==='reference_image'&&!images.length)fail('缺少视频参考图');if(p.mode==='text_to_video')count(images.length,0);}
  } else {
    images=list(p.images,Math.max(2,config.images),'参考图');videos=list(p.videos,config.videos,'参考视频');audios=list(p.audios,config.audios,'参考音频');
    if(p.mode==='text_to_video')count(images.length+videos.length+audios.length,0);
    else if(p.mode==='first_frame'||p.mode==='first_last_frame'){count(images.length,p.mode==='first_frame'?1:2);count(videos.length+audios.length,0);}
    else {
      if(images.length>config.images)fail('参考图超出原模型限制');
      if(!images.length&&!videos.length&&!audios.length)fail('缺少视频参考素材');
      if(p.mode==='reference_image') {if(!images.length)fail('缺少视频参考图');count(videos.length+audios.length,0);}
    }
  }
  if(p.mode==='text_to_video'&&p.ratio==='adaptive'&&id.startsWith('minimax'))fail('MiniMax 文生模式不支持 adaptive 比例');
  text(p.prompt,'提示词',seedance?4000:32000,p.mode==='text_to_video');
}
function validate3d(id,p) {
  if(id==='rodin-25') {
    keys(p,['prompt','imageUrls','tier','qualityOverride','textureMode','geometryFormat','studioKind','studioModelId']);
    const images=list(p.imageUrls,1,'3D参考图');text(p.prompt,'提示词',32000,!images.length);
    one(p.tier,['Gen-2.5-Extreme-Low','Gen-2.5-Low','Gen-2.5-Medium','Gen-2.5-High','Gen-2.5-Extreme-High'],'Rodin 档位');
    if(p.qualityOverride!==undefined)one(p.qualityOverride,[20000,60000,150000,500000],'Rodin 面数');
    if(p.textureMode!=='medium'||p.geometryFormat!=='fbx')fail('Rodin 原 Quick 纹理和几何参数不一致');return;
  }
  if(Object.hasOwn(TRIPO_VERSIONS,id)) {
    keys(p,['modelVersion','textureVersion','textureQuality','texture','pbr',...(id!=='tripo-p1'?['quad']:[]),'faceLimit','exportUv','withFbx','imageUrl','prompt','studioKind','studioModelId']);
    if(p.modelVersion!==TRIPO_VERSIONS[id]||p.textureVersion!==TEXTURE_VERSION||p.texture!==true||p.exportUv!==true||p.withFbx!==true)fail('Tripo 原 Quick 模型与导出参数不一致');
    bool(p.pbr,'PBR');if(id==='tripo-p2'&&p.quad!==true)fail('Tripo P2 原 Quick 固定四边面');if(id==='tripo-31')bool(p.quad,'Quad');
    if(p.textureQuality!==undefined)one(p.textureQuality,['fast','standard','detailed','extreme'],'纹理质量');else if(id!=='tripo-31')fail('缺少 Tripo 纹理质量');
    if(p.faceLimit!==undefined)one(p.faceLimit,id==='tripo-31'?p.quad?[150000]:[150000,300000,500000,1000000]:[5000,10000,20000],'Tripo 面数');
    if(p.imageUrl!==undefined){address(p.imageUrl);if(p.prompt!==undefined)fail('Tripo 原图生模型不传提示词');}else text(p.prompt,'提示词');return;
  }
  if(id==='hy-31') {
    keys(p,['model','enablePBR','faceCount','resultFormat','imageUrl','prompt','studioKind','studioModelId']);if(p.model!=='3.1')fail('混元模型版本不一致');bool(p.enablePBR,'PBR');
    if(p.faceCount!==undefined)one(p.faceCount,[50000,100000,500000,1000000,1500000],'混元面数');one(p.resultFormat,['GLB','FBX','STL','USDZ'],'混元导出格式');
    if(p.imageUrl!==undefined){address(p.imageUrl);if(p.prompt!==undefined)fail('混元原图生模型不传提示词');}else text(p.prompt,'提示词');return;
  }
  if(id==='motion'){keys(p,['inputText','studioKind','studioModelId']);text(p.inputText,'动作描述');return;}
  if(id==='blender-convert') {keys(p,['modelUrl','outputFormat','studioKind','studioModelId']);address(p.modelUrl);one(p.outputFormat,['','glb','fbx'],'模型转换格式');return;}
  if(id==='unirig'||id==='mia'){keys(p,['modelUrl','studioKind','studioModelId']);address(p.modelUrl);return;}
  if(id==='mesh-seg') {
    keys(p,['url','modelVersion','segmentationGranularity','splitByConnectivity','withFbx','studioKind','studioModelId']);address(p.url);
    if(p.modelVersion!=='v2.0-20260430'||p.segmentationGranularity!=='balanced'||p.withFbx!==true)fail('网格分割原 Quick 参数不一致');bool(p.splitByConnectivity,'连通分割',true);return;
  }
  if(id==='texture-model') {
    keys(p,['url','modelVersion','textureQuality','texturePromptText','withFbx','studioKind','studioModelId']);address(p.url);
    if(p.modelVersion!==TEXTURE_VERSION||p.withFbx!==true)fail('重贴图原 Quick 参数不一致');one(p.textureQuality,['fast','standard','detailed','extreme'],'纹理质量');text(p.texturePromptText,'纹理描述');return;
  }
  if(id==='decimate'){keys(p,['url','faceLimit','withFbx','studioKind','studioModelId']);address(p.url);if(p.withFbx!==true)fail('减面原导出参数不一致');if(p.faceLimit!==undefined)one(p.faceLimit,[5000,10000,20000],'减面目标面数');}
}
function validatePayload(id,value) { const spec=model(id);keys(value,Object.keys(value||{}));identity(id,value);if(spec.mode==='video')validateVideo(id,value);else validate3d(id,value);return JSON.parse(JSON.stringify(value)); }
function quoteFor(id,payload) {
  const p=validatePayload(id,payload),spec=model(id);
  if(id==='effect-video')return{taskType:spec.taskType};
  if(spec.mode==='video')return{taskType:spec.taskType,resolution:p.resolution,duration:String(p.duration),...(p.model?{model:p.model}:{})};
  if(Object.hasOwn(TRIPO_VERSIONS,id))return{taskType:p.imageUrl?'tripo_image_to_model':'tripo_text_to_model',model:p.modelVersion,textureQuality:p.textureQuality||'standard',texture:true,pbr:p.pbr,...(p.quad!==undefined?{quad:p.quad}:{})};
  if(id==='texture-model')return{taskType:spec.taskType,model:TEXTURE_VERSION,textureQuality:p.textureQuality};
  return{taskType:spec.taskType};
}
function referenceSlots(id,payload) {
  const p=validatePayload(id,payload),result=[];
  const single=(key,mediaKinds)=>{if(p[key]!==undefined)result.push({pointer:`/${key}`,value:p[key],mediaKinds});};
  const array=(key,mediaKinds)=>{for(const [index,value]of(p[key]||[]).entries())result.push({pointer:`/${key}/${index}`,value,mediaKinds});};
  for(const key of['imageUrl','first_frame','last_frame'])single(key,['image']);
  for(const key of['imageUrls','images','reference_images','references'])array(key,['image']);
  for(const key of['videos','reference_videos'])array(key,['video']);
  for(const key of['audios','reference_audios'])array(key,['audio']);
  for(const key of['modelUrl','url'])single(key,['model']);
  return result;
}
function minimalPayload(id,{images=[],videos=[],audios=[],models=[]}={}) {
  const spec=model(id),prompt='A simple low-poly humanoid standing in a neutral pose.';
  if(spec.mode==='video') {
    const config=VIDEO[id];
    if(id==='effect-video')return validatePayload(id,{prompt:'A small gentle blue glow on a black background.',videoDuration:5,videoRatio:'1:1',videoResolution:'480p',imageSize:'square_hd'});
    return validatePayload(id,{mode:'text_to_video',prompt:'A static blue cube on a plain background, slight slow motion.',ratio:id==='wan3'?'1:1':config.ratios[0],resolution:config.resolutions[0],duration:config.durations[0],...(config.model?{model:config.model[0]}:{}),...(id==='seedance2'?{seed:-1}:id==='seedance25'?{output_format:'mp4'}:id==='happyhorse-11'?{watermark:false}:{})});
  }
  if(id==='rodin-25')return validatePayload(id,{prompt,tier:'Gen-2.5-Extreme-Low',qualityOverride:20000,textureMode:'medium',geometryFormat:'fbx'});
  if(Object.hasOwn(TRIPO_VERSIONS,id))return validatePayload(id,{modelVersion:TRIPO_VERSIONS[id],textureVersion:TEXTURE_VERSION,textureQuality:'fast',texture:true,pbr:false,...(id==='tripo-p2'?{quad:true}:id==='tripo-31'?{quad:false}:{}),faceLimit:id==='tripo-31'?150000:5000,exportUv:true,withFbx:true,prompt});
  if(id==='hy-31')return validatePayload(id,{model:'3.1',enablePBR:false,faceCount:50000,resultFormat:'GLB',prompt});
  if(id==='motion')return validatePayload(id,{inputText:'walk forward'});
  const source=models[0];if(!source)fail('此模型需要先取得自有 3D 参考产物');
  if(id==='blender-convert')return validatePayload(id,{modelUrl:source,outputFormat:/\.fbx(?:[?#]|$)/i.test(source)?'glb':'fbx'});
  if(id==='unirig'||id==='mia')return validatePayload(id,{modelUrl:source});
  if(id==='mesh-seg')return validatePayload(id,{url:source,modelVersion:'v2.0-20260430',segmentationGranularity:'balanced',withFbx:true});
  if(id==='texture-model')return validatePayload(id,{url:source,modelVersion:TEXTURE_VERSION,textureQuality:'fast',texturePromptText:'Plain blue cloth.',withFbx:true});
  return validatePayload(id,{url:source,faceLimit:5000,withFbx:true});
}
module.exports={MODELS,validatePayload,quoteFor,referenceSlots,minimalPayload};
