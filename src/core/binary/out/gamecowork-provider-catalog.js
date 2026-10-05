'use strict';
// Provider names and model IDs are identifiers, never evidence of capability.
const crypto = require('node:crypto');
const PROTOCOLS = Object.freeze(['openai-images','openai-chat','openai-responses','generic-rest-task','ollama','comfyui']);
const IMAGE_SIZE_POLICIES = Object.freeze(['prompt-only','openai-size']);
// XCAI operator client /canvas/assets/index-CW8kB9IJ.js, SHA256
// d5006592db3335806afbbe999838831e169613ba401a9128333cdac67f7a0179.
// A published tier is a request preset, not proof of the returned pixel count.
const OPENAI_IMAGE_SIZE_PRESETS=Object.freeze({
  '1k':Object.freeze({'1:1':'1024x1024','2:3':'1024x1536','3:2':'1536x1024','4:3':'1024x768','3:4':'768x1024','16:9':'1536x864','9:16':'864x1536','21:9':'2016x864','9:21':'864x2016'}),
  '2k':Object.freeze({'1:1':'2048x2048','2:3':'1360x2048','3:2':'2048x1360','4:3':'2048x1536','3:4':'1536x2048','16:9':'2048x1152','9:16':'1152x2048','21:9':'2688x1152','9:21':'1152x2688'}),
  '4k':Object.freeze({'1:1':'2880x2880','2:3':'2336x3520','3:2':'3520x2336','4:3':'3312x2480','3:4':'2480x3312','16:9':'3840x2160','9:16':'2160x3840','21:9':'3840x1648','9:21':'1648x3840'})
});
const CAP_NAMES = Object.freeze(['size','quality','outputFormat','aspectRatio','references','generation','upscale']);
const REQUEST_FIELDS=Object.freeze({size:['size','resolution','image_size','size_preset'],quality:['quality','quality_level'],outputFormat:['output_format','format','response_format'],aspectRatio:['aspect_ratio','ratio']});
const SECRET = /^(?:api.?key|authorization|access.?token|refresh.?token|password|secret|cookie|bearer.?token)$/i;
const copy = value => JSON.parse(JSON.stringify(value));
function bounded(value, max = 1024 * 1024) {
  const visit = (item, depth = 0) => {
    if (depth > 20) throw Error('Provider JSON is too deeply nested');
    if (typeof item === 'number' && !Number.isFinite(item)) throw Error('Provider JSON numbers must be finite');
    if (Array.isArray(item)) { if (item.length > 4096) throw Error('Provider JSON array is too large'); item.forEach(child => visit(child,depth+1)); }
    else if (item && typeof item === 'object') { if (![Object.prototype,null].includes(Object.getPrototypeOf(item))) throw Error('Provider JSON must contain plain objects'); for(const [key,child] of Object.entries(item)) { if (['__proto__','prototype','constructor'].includes(key) || SECRET.test(key)) throw Error('Credentials and unsafe properties are not allowed in Provider JSON'); visit(child,depth+1); } }
    else if (item !== null && !['string','number','boolean','undefined'].includes(typeof item)) throw Error('Provider JSON values are unsupported');
  };
  visit(value); if (Buffer.byteLength(JSON.stringify(value)) > max) throw Error('Provider JSON exceeds its size budget'); return copy(value);
}
function string(value,name,max=256,required=false) { if(typeof value!=='string'||value.length>max||/[\u0000-\u001f\u007f]/.test(value)||required&&!value.trim()) throw Error(name+' must be bounded non-control text');return value; }
function identifier(value) { if(typeof value!=='string'||! /^[A-Za-z0-9_-]{1,80}$/.test(value)||['__proto__','prototype','constructor'].includes(value)) throw Error('Invalid Provider ID');return value; }
function privateIpv4(host) { const parts=host.split('.').map(Number);return /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(host)&&parts.every(n=>n<=255)&&(parts[0]===10||parts[0]===192&&parts[1]===168||parts[0]===172&&parts[1]>=16&&parts[1]<=31); }
function baseUrl(value,allowInsecureLan=false) {
  const raw=string(value,'baseUrl',2048,true);let url;try{url=new URL(raw);}catch{throw Error('Invalid Provider base URL');}
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash) throw Error('Provider URL must be HTTP(S) without credentials, query or fragment');
  const loopback=['127.0.0.1','localhost','[::1]'].includes(url.hostname);
  if(url.protocol==='http:'&&!loopback&&!(allowInsecureLan===true&&privateIpv4(url.hostname)&&/^http:\/\/(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}(?::\d+)?(?:\/|$)/i.test(raw))) throw Error('HTTP requires loopback or explicitly authorized private IPv4 LAN');
  const hostname=url.hostname.toLowerCase().replace(/\.$/,'');if(hostname==='ai-generator.tuanjie.cn'||hostname.endsWith('.ai-generator.tuanjie.cn')) throw Error('The original asset service is not a custom Provider');
  return url.toString().replace(/\/+$/,'');
}
function normalizeWorkflow(value) {
  if(value==null)return undefined;const workflow=bounded(value),graph=workflow.graph;
  if(!graph||typeof graph!=='object'||Array.isArray(graph)||!Object.keys(graph).length||Object.keys(graph).length>512) throw Error('ComfyUI workflow requires an API-format graph');
  for(const [nodeId,node] of Object.entries(graph)) {
    if(!/^\d{1,12}$/.test(nodeId)||!node||typeof node!=='object'||Array.isArray(node)||typeof node.class_type!=='string'||!node.class_type||node.class_type.length>128||!node.inputs||typeof node.inputs!=='object'||Array.isArray(node.inputs)) throw Error('ComfyUI workflow must contain API-format nodes with class_type and inputs');
  }
  const bindings=workflow.bindings||{};if(typeof bindings!=='object'||Array.isArray(bindings)||Object.keys(bindings).length>32)throw Error('Invalid ComfyUI parameter bindings');
  for(const [parameter,binding] of Object.entries(bindings)) {
    if(!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(parameter)||!binding||typeof binding!=='object'||typeof binding.nodeId!=='string'||typeof binding.input!=='string'||!Object.hasOwn(graph,binding.nodeId)||!Object.hasOwn(graph[binding.nodeId].inputs,binding.input)||Object.keys(binding).some(key=>!['nodeId','input'].includes(key)))throw Error('Workflow bindings must reference explicit existing node input fields');
  }
  return {graph,bindings};
}
function normalizeProvider(value,previous) {
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('provider object is required');
  const protocol=value.protocol??previous?.protocol;if(!PROTOCOLS.includes(protocol))throw Error('Unsupported Provider protocol');
  const kinds=[...new Set(value.kinds??previous?.kinds??(protocol==='openai-images'?['image']:['openai-chat','openai-responses','ollama'].includes(protocol)?['chat']:['image']))];
  const allowed=protocol==='openai-images'?['image']:['openai-chat','openai-responses','ollama'].includes(protocol)?['chat']:protocol==='comfyui'?['image','video']:['image','video','model','audio'];
  if(!kinds.length||kinds.some(kind=>!allowed.includes(kind)))throw Error('Provider kinds do not match its protocol');
  const authMode=value.authMode??previous?.authMode??'none';if(!['none','bearer','header'].includes(authMode))throw Error('Unsupported Provider authentication');
  const apiKeyHeader=string(value.apiKeyHeader??previous?.apiKeyHeader??'X-API-Key','apiKeyHeader',64,true);
  if(!/^[A-Za-z][A-Za-z0-9-]{0,63}$/.test(apiKeyHeader)||/^(host|cookie|content-type|content-length|transfer-encoding|proxy-authorization)$/i.test(apiKeyHeader))throw Error('Unsafe API key header');
  const allowInsecureLan=value.allowInsecureLan??previous?.allowInsecureLan??false;if(typeof allowInsecureLan!=='boolean')throw Error('LAN authorization must be an explicit boolean');
  const requestTimeoutMs=value.requestTimeoutMs??previous?.requestTimeoutMs??120000;if(!Number.isInteger(requestTimeoutMs)||requestTimeoutMs<1000||requestTimeoutMs>600000)throw Error('Provider timeout must be 1000..600000 ms');
  const result={id:value.id?identifier(value.id):previous?.id??'p_'+crypto.randomUUID(),name:string(value.name??previous?.name??'Custom Provider','name',128,true),protocol,kinds,baseUrl:baseUrl(value.baseUrl??previous?.baseUrl,allowInsecureLan),authMode,apiKeyHeader,allowInsecureLan,requestTimeoutMs,enabled:value.enabled??previous?.enabled??true,defaultModel:string(value.defaultModel??previous?.defaultModel??'','defaultModel',256)};
  if(typeof result.enabled!=='boolean')throw Error('enabled must be boolean');
  if(protocol==='openai-images') {
    const previousPolicy=previous?.protocol===protocol&&previous.baseUrl===result.baseUrl?previous.imageSizePolicy:undefined;
    const policy=value.imageSizePolicy===undefined?previousPolicy??(isXcaiImageProvider(result)?'openai-size':'prompt-only'):value.imageSizePolicy;
    if(!IMAGE_SIZE_POLICIES.includes(policy))throw Error('Unsupported image size policy');
    result.imageSizePolicy=policy;
  } else if(value.imageSizePolicy!==undefined)throw Error('Image size policy requires an OpenAI Images provider');
  const adapter=value.adapter??previous?.adapter;if(protocol==='generic-rest-task') {if(!adapter||typeof adapter!=='object')throw Error('Generic REST requires an explicit adapter');result.adapter=bounded(adapter,65536);}
  const workflow=value.workflow??previous?.workflow;if(protocol==='comfyui'&&workflow)result.workflow=normalizeWorkflow(workflow);
  return result;
}
function isXcaiImageProvider(provider) {return provider?.protocol==='openai-images'&&provider.baseUrl==='https://xcai.pro/v1';}
function imageSizePolicyInfo(provider) {
  if(provider?.protocol!=='openai-images')return undefined;
  if(provider.imageSizePolicy==='openai-size')return {evidence:isXcaiImageProvider(provider)?'documented':'manual',source:isXcaiImageProvider(provider)?'XCAI公开Canvas客户端以具体widthxheight发送OpenAI Images的size参数；仅确认请求规范，当前Key实际4K输出尚未实测。':'用户显式选择将目标像素作为OpenAI Images的size参数发送；真实输出与档位仍需分别验证。',actual4kTested:false,constraints:{maxSide:3840,sideMultiple:16,minPixels:isXcaiImageProvider(provider)?655360:0,maxPixels:8294400,maxAspectRatio:3}};
  return {evidence:'unknown',source:'目标尺寸仅追加到提示词，不向上游增加size参数；不保证实际输出像素。',actual4kTested:false};
}
function unknownCapabilities() {return Object.fromEntries(CAP_NAMES.map(name=>[name,{status:'unknown',evidence:'unknown',...(name==='upscale'?{}:{choices:[]})}]));}
function normalizeCapabilities(value) {
  const result=unknownCapabilities();if(value===undefined)return result;if(!value||typeof value!=='object'||Array.isArray(value))throw Error('capabilities must be an object');
  if(Object.keys(value).some(name=>!CAP_NAMES.includes(name)))throw Error('Unknown model capability');
  for(const name of Object.keys(value)) {
    const item=value[name];if(!item||typeof item!=='object'||Array.isArray(item)||!['unknown','supported','unsupported'].includes(item.status)||!['unknown','documented','tested','manual'].includes(item.evidence))throw Error('Capability requires an explicit status and evidence');
    if(item.status==='unknown'&&item.evidence!=='unknown'||item.status!=='unknown'&&item.evidence==='unknown')throw Error('Capability status and evidence disagree');
    const normalized={status:item.status,evidence:item.evidence};
    if(name!=='upscale') {const choices=item.choices??[];if(!Array.isArray(choices)||choices.length>128||new Set(choices).size!==choices.length||choices.some(choice=>typeof choice!=='string'||!choice||choice.length>128||/[\u0000-\u001f\u007f]/.test(choice))||item.status!=='supported'&&choices.length)throw Error('Capability choices must be bounded explicit supported values');normalized.choices=choices.slice();}
    if(item.source!==undefined)normalized.source=string(item.source,'capability source',2048);
    if(item.requestField!==undefined) {if(!REQUEST_FIELDS[name]?.includes(item.requestField))throw Error('Unsafe capability request field');normalized.requestField=item.requestField;}
    result[name]=normalized;
  }
  return bounded(result,65536);
}
function studioId(providerId,modelId) {return 'cust_'+crypto.createHash('sha256').update(providerId+'\0'+modelId).digest('hex').slice(0,32);}
function imageResolution(value,minimumPixels=0) {
  if(typeof value!=='string'||! /^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(value))throw Error('Image resolution requirement must use widthxheight');
  const [width,height]=value.split('x').map(Number);if(width<16||height<16||width>3840||height>3840||width%16||height%16||width*height>8294400||width*height<minimumPixels||Math.max(width,height)>Math.min(width,height)*3)throw Error('Image resolution requirement exceeds dimension, pixel or aspect-ratio limits');
  return {width,height,value:width+'x'+height};
}
function imageRatio(value) {
  if(typeof value!=='string'||! /^[1-9]\d?:[1-9]\d?$/.test(value))throw Error('Image ratio requirement must contain two integers from 1 to 99');const [width,height]=value.split(':').map(Number);
  if(Math.max(width,height)>Math.min(width,height)*3)throw Error('Image ratio requirement may not exceed 3:1');return {width,height,value:width+':'+height};
}
function matchesPublishedImageRatio(resolution,ratio) {return Object.values(OPENAI_IMAGE_SIZE_PRESETS).some(presets=>presets[ratio]===resolution);}
function composeImagePrompt(original,requestedSpecification={},context={}) {
  if(typeof original!=='string'||!original.trim()||original.length>32000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(original))throw Error('Image prompt must contain bounded text');
  if(!requestedSpecification||typeof requestedSpecification!=='object'||Array.isArray(requestedSpecification))throw Error('Image request specification must be an object');
  const spec=requestedSpecification;
  for(const name of ['resolutionHint','aspectRatioHint'])if(spec[name]!==undefined&&(typeof spec[name]!=='string'||!spec[name]||spec[name].length>32))throw Error('Image output requirement is invalid');
  const explicitResolution=spec.resolutionHint!==undefined,explicitRatio=spec.aspectRatioHint!==undefined;
  const resolution=explicitResolution?spec.resolutionHint==='auto'?undefined:imageResolution(spec.resolutionHint):typeof spec.size==='string'&&/^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(spec.size)?imageResolution(spec.size):undefined;
  let ratio=explicitRatio?spec.aspectRatioHint==='auto'?undefined:imageRatio(spec.aspectRatioHint):typeof spec.aspectRatio==='string'&&/^[1-9]\d?:[1-9]\d?$/.test(spec.aspectRatio)?imageRatio(spec.aspectRatio):undefined;
  if(resolution&&ratio&&resolution.width*ratio.height!==resolution.height*ratio.width&&!(context.imageSizePolicy==='openai-size'&&matchesPublishedImageRatio(resolution.value,ratio.value)))throw Error('Image resolution and aspect-ratio requirements conflict');
  if(resolution&&!ratio){let a=resolution.width,b=resolution.height;while(b){const next=a%b;a=b;b=next;}ratio={width:resolution.width/a,height:resolution.height/a,value:resolution.width/a+':'+resolution.height/a};}
  if(!resolution&&!ratio)return original;
  const constraints=[...(resolution?['Required final image resolution: '+resolution.width+' x '+resolution.height+' pixels.']:[]),...(ratio?['Required final image aspect ratio: '+ratio.value+'.']:[]),'Compose the whole scene for these output requirements.'];
  return original+'\n\n[Image output requirements]\n'+constraints.join('\n');
}
function normalizeModels(rows,provider,previous=[]) {
  if(!Array.isArray(rows)||rows.length>4096)throw Error('Provider model catalog exceeds 4096 entries');const seen=new Set(),old=new Map(previous.map(item=>[item.id,item]));
  return rows.map(row=> {const modelId=string(typeof row==='string'?row:row?.id,'model ID',256,true);if(seen.has(modelId))throw Error('Provider returned duplicate model IDs');seen.add(modelId);return {id:modelId,stableStudioId:studioId(provider.id,modelId),label:string(typeof row==='object'&&row.label||modelId,'model label',256,true),kind:provider.kinds[0],capabilities:old.get(modelId)?.capabilities??unknownCapabilities(),available:true};});
}
async function fetchCatalog(provider,key,fetcher=globalThis.fetch) {
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),Math.min(provider.requestTimeoutMs,30000));
  const headers={Accept:'application/json'};if(key&&provider.authMode==='bearer')headers.Authorization='Bearer '+key;else if(key&&provider.authMode==='header')headers[provider.apiKeyHeader]=key;
  const read=async(route,max=6*1024*1024)=> {const response=await fetcher(provider.baseUrl+route,{method:'GET',headers,redirect:'manual',signal:controller.signal});if(!response.ok){await response.body?.cancel();throw Error('Provider catalog HTTP '+response.status);}let bytes=0,chunks=[];if(response.body){for await(const chunk of response.body){bytes+=chunk.length;if(bytes>max){await response.body.cancel().catch(()=>{});throw Error('Provider catalog exceeds its byte budget');}chunks.push(Buffer.from(chunk));}}let body;try{body=JSON.parse(Buffer.concat(chunks));}catch{throw Error('Provider catalog is not JSON');}return body;};
  try {
    if(provider.protocol==='ollama') {const route=new URL(provider.baseUrl).pathname.replace(/\/+$/,'').endsWith('/api')?'/tags':'/api/tags';const body=await read(route);if(!Array.isArray(body.models))throw Error('Ollama model catalog has no models array');return {rows:body.models.map(row=>({id:row.name||row.model})),complete:true};}
    if(provider.protocol==='comfyui') {const info=await read('/object_info'),folders=await read('/models');if(!info||typeof info!=='object'||Array.isArray(info)||Object.keys(info).length>4096||Object.keys(info).some(name=>!name||name.length>256||/[\u0000-\u001f\u007f]/.test(name))||!Array.isArray(folders)||folders.length>128||new Set(folders).size!==folders.length||folders.some(name=>typeof name!=='string'||! /^[A-Za-z0-9_-]{1,80}$/.test(name)))throw Error('ComfyUI returned an invalid node/model directory');const rows=[];for(const folder of folders){const files=await read('/models/'+encodeURIComponent(folder));if(!Array.isArray(files)||files.length>4096||new Set(files).size!==files.length||files.some(file=>typeof file!=='string'||!file||file.length>256))throw Error('ComfyUI returned an invalid model-file directory');files.forEach(file=>rows.push({id:folder+'/'+file,label:folder+' / '+file}));if(rows.length>4096)throw Error('ComfyUI directory exceeds 4096 files');}return {rows,complete:true,nodeTypes:Object.keys(info),catalogType:'model-files'};}
    const body=await read('/models');if(!Array.isArray(body.data))throw Error('OpenAI model catalog has no data array');const totals=[body.total,body.total_count,body.totalCount,body.meta?.total,body.pagination?.total].filter(value=>value!==undefined);if(body.has_more===true||body.hasMore===true||body.next_page||body.nextPage||body.next_cursor||body.nextCursor||body.next||body.links?.next||body.pagination?.next||body.pagination?.has_more===true||totals.some(value=>!Number.isInteger(value)||value!==body.data.length))throw Error('Provider model catalog is paginated; complete directory could not be established');return {rows:body.data.map(row=>({id:row.id})),complete:true};
  }finally{clearTimeout(timer);}
}
module.exports={PROTOCOLS,IMAGE_SIZE_POLICIES,OPENAI_IMAGE_SIZE_PRESETS,CAP_NAMES,bounded,string,identifier,baseUrl,normalizeWorkflow,normalizeProvider,isXcaiImageProvider,imageSizePolicyInfo,imageResolution,matchesPublishedImageRatio,unknownCapabilities,normalizeCapabilities,studioId,normalizeModels,fetchCatalog,composeImagePrompt};
