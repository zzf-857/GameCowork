'use strict';
const {imageOutputRequirements,composeImagePrompt}=require('../../providers/catalog.js');
// Explicit third-party CPA models. These are independent of Codely Pro and
// retain the exact gateway IDs verified by its read-only model inventory.
const legacyQualities = Object.freeze(['auto','low','medium','high']);
const modernQualities = Object.freeze([...legacyQualities,'xhigh','max']);
const rows = [
  ['cpa-gpt-image-2','GPT Image 2 · CPA','gpt-image-2',legacyQualities],
  ['cpa-gpt-image-2-5','GPT Image 2.5 · CPA','gpt-image-2.5',modernQualities],
  ['cpa-gpt-image-2-5-flare','GPT Image 2.5 Flare · CPA','gpt-image-2.5-flare',modernQualities],
  ['cpa-gpt-image-2-5-sunburst','GPT Image 2.5 Sunburst · CPA','gpt-image-2.5-sunburst',modernQualities],
];
const CPA_IMAGE_MODELS = Object.freeze(Object.fromEntries(rows.map(([id,name,model,qualityOptions])=>[id,Object.freeze({id,name,model,kind:'image',mode:'image',qualityOptions})])));
const LEGACY_CPA_IMAGE_MODEL_ID = 'cpa-gpt-image-2';
const OUTPUT_FORMATS = Object.freeze(['png','jpeg','webp']);
// Account-proxy measurements did not honor quality/format/pixel overrides.
// These active controls express framing instructions, never exact pixels.
const CPA_IMAGE_ACCOUNT_POLICY=Object.freeze({size:'auto',quality:'auto',outputFormat:'png',aspectRatios:Object.freeze(['auto','1:1','3:2','2:3','16:9','9:16','4:3','3:4'])});
function validateCpaImageSize(value) {
  if (value === 'auto') return value;
  if (typeof value !== 'string' || !/^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(value)) throw Error('图片尺寸须为 auto 或 宽x高');
  const [width,height] = value.split('x').map(Number), pixels = width*height;
  if (width%16 || height%16 || width>3840 || height>3840 || Math.max(width,height)>3*Math.min(width,height) || pixels<655360 || pixels>8294400) {
    throw Error('宽高须为16的倍数且不超过3840，长宽比不超过3:1，总像素须在655360至8294400之间');
  }
  return value;
}
function validateCpaImagePayload(modelId,payload) {
  const descriptor = Object.hasOwn(CPA_IMAGE_MODELS,modelId) ? CPA_IMAGE_MODELS[modelId] : null;
  if (!descriptor || !payload || typeof payload!=='object' || Array.isArray(payload)) throw Error('第三方图片型号无效');
  if (Object.keys(payload).some(key=>!['prompt','model','size','quality','outputFormat','studioModelId','aspectRatio','requestSizeMode'].includes(key)) || payload.model!==descriptor.model || payload.studioModelId!==descriptor.id) throw Error('第三方图片参数与所选型号不匹配');
  if (typeof payload.prompt!=='string' || !payload.prompt.trim() || payload.prompt.length>32000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(payload.prompt)) throw Error('请输入有效图片描述');
  validateCpaImageSize(payload.size);
  if (!descriptor.qualityOptions.includes(payload.quality) || !OUTPUT_FORMATS.includes(payload.outputFormat)) throw Error('所选图片质量或格式不受此型号支持');
  if(payload.requestSizeMode!==undefined&&payload.requestSizeMode!=='api-size')throw Error('请选择有效的 CPA 接口尺寸请求模式');
  if(payload.requestSizeMode==='api-size') {
    if(payload.size==='auto'||payload.quality!=='auto'||payload.outputFormat!=='png')throw Error('CPA 接口尺寸请求须提供明确像素，并保持服务默认画质与原始 PNG');
    if(payload.aspectRatio!==undefined&&payload.aspectRatio!=='auto'&&(typeof payload.aspectRatio!=='string'||! /^[1-9]\d?:[1-9]\d?$/.test(payload.aspectRatio)))throw Error('请选择有效的接口尺寸比例');
    imageOutputRequirements({size:payload.size,aspectRatio:payload.aspectRatio});
  } else if (payload.aspectRatio!==undefined && !CPA_IMAGE_ACCOUNT_POLICY.aspectRatios.includes(payload.aspectRatio)) throw Error('请选择有效的构图比例提示');
  return {prompt:payload.prompt,model:descriptor.model,size:payload.size,quality:payload.quality,outputFormat:payload.outputFormat,studioModelId:descriptor.id,...(payload.aspectRatio!==undefined?{aspectRatio:payload.aspectRatio}:{}),...(payload.requestSizeMode==='api-size'?{requestSizeMode:'api-size'}:{})};
}
function validateCpaImageAccountPayload(modelId,payload) {
  const checked=validateCpaImagePayload(modelId,payload);
  if(checked.requestSizeMode!=='api-size'&&(checked.size!=='auto' || checked.quality!=='auto' || checked.outputFormat!=='png')) throw Error('当前 CPA 默认模式只使用服务默认画质、原始 PNG 和构图提示；明确选择接口尺寸请求后才会发送精确像素');
  return {...checked,aspectRatio:checked.aspectRatio||'auto'};
}
function cpaImageRequestPrompt(parameters) {
  if(parameters.requestSizeMode==='api-size')return composeImagePrompt(parameters.prompt,{size:validateCpaImageSize(parameters.size),aspectRatio:parameters.aspectRatio});
  const ratio=parameters.aspectRatio;
  if(!ratio || ratio==='auto')return parameters.prompt;
  if(!CPA_IMAGE_ACCOUNT_POLICY.aspectRatios.includes(ratio))throw Error('Invalid CPA framing hint');
  const [width,height]=ratio.split(':').map(Number), direction=width>height?'landscape format, wider than it is tall':width<height?'portrait format, taller than it is wide':'square format';
  return `The frame must be in ${ratio} ${direction}. ${parameters.prompt}`;
}
function isCpaImageProvider(provider) {
  const selector = (value,expected)=>value===expected || value==='/'+expected;
  return !!(provider?.enabled===true && Object.values(CPA_IMAGE_MODELS).some(row=>row.model===provider.model) && Array.isArray(provider.kinds) && provider.kinds.includes('image') &&
    ['bearer','header'].includes(provider.authMode) && provider.apiKeyConfigured===true && provider.adapter?.responseMode==='outputs' && provider.adapter.create?.method==='POST' &&
    provider.adapter.create.path==='/images/generations' && selector(provider.adapter.selectors?.outputs,'data') && selector(provider.adapter.outputSelectors?.base64,'b64_json') &&
    (!provider.adapter.outputSelectors?.url || selector(provider.adapter.outputSelectors.url,'url')) &&
    (!provider.adapter.create.contentType || provider.adapter.create.contentType==='application/json') &&
    (!provider.adapter.create.bodyType || provider.adapter.create.bodyType==='json'));
}
module.exports={CPA_IMAGE_MODELS,LEGACY_CPA_IMAGE_MODEL_ID,OUTPUT_FORMATS,CPA_IMAGE_ACCOUNT_POLICY,validateCpaImageSize,validateCpaImagePayload,validateCpaImageAccountPayload,cpaImageRequestPrompt,isCpaImageProvider};
