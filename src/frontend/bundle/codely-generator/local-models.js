// GameCowork-owned third-party descriptors. They do not grant Codely rights.
// The CPA account proxy ignored its size/quality/format trials, so the fixed
// CPA descriptors retain service defaults and composition hints. Custom image
// Providers below may explicitly opt into standard API size requests.
export const cpaImageModelId = 'cpa-gpt-image-2';
export const cpaImageUpstreamModel = 'gpt-image-2';
export const cpaImageSizeOptions = Object.freeze(['auto']);
export const cpaImageAspectRatios = Object.freeze(['auto', '1:1', '3:2', '2:3', '16:9', '9:16', '4:3', '3:4']);
const profiles = Object.freeze([
  [cpaImageModelId, cpaImageUpstreamModel, 'GPT Image 2 · CPA'],
  ['cpa-gpt-image-2-5', 'gpt-image-2.5', 'GPT Image 2.5 · 默认 · CPA'],
  ['cpa-gpt-image-2-5-flare', 'gpt-image-2.5-flare', 'GPT Image 2.5 · 快速 · CPA'],
  ['cpa-gpt-image-2-5-sunburst', 'gpt-image-2.5-sunburst', 'GPT Image 2.5 · 精致 · CPA'],
]);
export const cpaImage25Variants = Object.freeze([
  Object.freeze({ id: 'cpa-gpt-image-2-5', label: '默认' }),
  Object.freeze({ id: 'cpa-gpt-image-2-5-flare', label: '快速' }),
  Object.freeze({ id: 'cpa-gpt-image-2-5-sunburst', label: '精致' }),
]);
export const cpaImageModels = Object.freeze(profiles.map(([id, model, label]) => Object.freeze({
  id, label, kind: 'image', gamecoworkThirdParty: true, gamecoworkTextOnly: true,
  maxCount: 1, maxImages: 0, agentAvailable: false,
  sizeOptions: cpaImageSizeOptions,
  formats: Object.freeze(['png']), defaultQuality: 'auto', qualityOptions: Object.freeze(['auto']),
  aspectRatios: cpaImageAspectRatios,
  info: Object.freeze({
    note: `CPA 请求型号 ${model}；请求路由不代表已确认后台实际型号。`,
    size: '比例作为提示词提交，实际像素由账号服务决定，不保证精准分辨率。质量由账号服务决定，原始输出 PNG。',
  }),
  build(state) {
    const size = state.size || 'auto', quality = state.quality || 'auto', outputFormat = state.format || 'png', aspectRatio = state.ratio || 'auto';
    const error = gamecoworkCpaParameterError({ id }, { size, quality, format: outputFormat, ratio: aspectRatio });
    if (error) throw new Error(error);
    return { prompt: state.prompt, model, size, quality, outputFormat, studioModelId: id, aspectRatio };
  },
})));
export const cpaImageDescriptor = cpaImageModels[0];
export const cpaImageModelIds = Object.freeze(cpaImageModels.map(model => model.id));
const customModels = new Map();
export const gamecoworkPromptResolutionHints=Object.freeze(['auto','1024x1024','1536x1024','1024x1536','2048x1152','1152x2048','2048x2048','3840x2160']);
export const gamecoworkPromptAspectHints=Object.freeze(['auto','1:1','3:2','2:3','16:9','9:16','4:3','3:4']);
// Exact pixel presets published by XCAI's public canvas client. These establish
// request construction, not tested output dimensions or a quality tier.
export const gamecoworkOpenAiImageSizePresets=Object.freeze({
  '1k':Object.freeze({'1:1':'1024x1024','2:3':'1024x1536','3:2':'1536x1024','4:3':'1024x768','3:4':'768x1024','16:9':'1536x864','9:16':'864x1536','21:9':'2016x864','9:21':'864x2016'}),
  '2k':Object.freeze({'1:1':'2048x2048','2:3':'1360x2048','3:2':'2048x1360','4:3':'2048x1536','3:4':'1536x2048','16:9':'2048x1152','9:16':'1152x2048','21:9':'2688x1152','9:21':'1152x2688'}),
  '4k':Object.freeze({'1:1':'2880x2880','2:3':'2336x3520','3:2':'3520x2336','4:3':'3312x2480','3:4':'2480x3312','16:9':'3840x2160','9:16':'2160x3840','21:9':'3840x1648','9:21':'1648x3840'}),
});
const openAiSizeMode=model=>model?.protocol==='openai-images'&&model.imageSizePolicy==='openai-size';
export function gamecoworkOpenAiSizeSelection(resolution,aspect) {
  for(const [tier,presets] of Object.entries(gamecoworkOpenAiImageSizePresets)) {
    if(aspect&&presets[aspect]===resolution)return {tier,aspect};
    for(const [ratio,size] of Object.entries(presets))if(size===resolution)return {tier,aspect:ratio};
  }
  return {tier:resolution&&resolution!=='auto'?'custom':'auto',aspect:aspect||'auto'};
}
export function gamecoworkPromptHintError(state,descriptor) {
  const resolution=state.resolutionHint||'auto',ratio=state.aspectRatioHint||'auto';let size,aspect;
  if(resolution!=='auto') {
    const match=/^([1-9]\d{0,3})x([1-9]\d{0,3})$/.exec(resolution);
    if(!match) return '提示词目标尺寸须为宽x高';
    size=match.slice(1).map(Number);
    const minPixels=openAiSizeMode(descriptor)?descriptor.imageSizePolicyInfo?.constraints?.minPixels||0:0;
    if(size.some(value=>value<16||value>3840||value%16)||size[0]*size[1]>8294400||size[0]*size[1]<minPixels||Math.max(...size)/Math.min(...size)>3) return `目标边长须为 16 的倍数、16–3840，像素 ${minPixels?minPixels+'–':''}8294400 以内且长短边比不超过 3`;
  }
  if(ratio!=='auto') {
    const match=/^([1-9]\d?):([1-9]\d?)$/.exec(ratio);
    if(!match) return '提示词目标比例须为整数宽:高';
    aspect=match.slice(1).map(Number);
    if(Math.max(...aspect)/Math.min(...aspect)>3) return '提示词目标比例的长短边比不能超过 3';
  }
  const apiSize=typeof state.size==='string'?/^([1-9]\d{0,3})x([1-9]\d{0,3})$/.exec(state.size):null;
  const apiRatio=typeof state.ratio==='string'?/^([1-9]\d?):([1-9]\d?)$/.exec(state.ratio):null;
  const effectiveSize=size||apiSize?.slice(1).map(Number),effectiveRatio=aspect||apiRatio?.slice(1).map(Number);
  const roundedPreset=openAiSizeMode(descriptor)&&effectiveSize&&effectiveRatio&&Object.values(gamecoworkOpenAiImageSizePresets).some(presets=>presets[effectiveRatio.join(':')]===effectiveSize.join('x'));
  if(effectiveSize&&effectiveRatio&&!roundedPreset&&effectiveSize[0]*effectiveRatio[1]!==effectiveSize[1]*effectiveRatio[0])return '目标尺寸与构图比例冲突，请调整其中一项或选择服务决定';
  return '';
}
const customId = value => typeof value === 'string' && /^cust_[a-f0-9]{32}$/.test(value);
const cleanText = (value, limit = 160) => typeof value === 'string' && value.length <= limit && !/[\u0000-\u001f\u007f]/.test(value) ? value : '';
export function gamecoworkCapabilityChoices(capability) {
  if (capability?.status !== 'supported' || !['documented', 'tested', 'manual'].includes(capability.evidence) || !Array.isArray(capability.choices)) return [];
  return [...new Set(capability.choices.filter(value => !!cleanText(value, 128)))].slice(0, 128);
}
export function gamecoworkCapabilitySummary(capability) {
  const status = capability?.status === 'supported' ? '支持' : capability?.status === 'unsupported' ? '不支持' : '未知';
  const evidence = {documented:'文档依据',tested:'实测依据',manual:'手动配置，未验证',unknown:'尚无依据'}[capability?.evidence] || '尚无依据';
  const choices = gamecoworkCapabilityChoices(capability);
  return `${status} · ${evidence}${choices.length ? ' · '+choices.join(' / ') : ''}`;
}
export function gamecoworkSetProviderDescriptors(rows) {
  customModels.clear();
  if (!Array.isArray(rows)) return [];
  for (const row of rows.slice(0, 4096)) {
    const id = row?.stableStudioId || row?.id, model = row?.upstreamModel || row?.model;
    if (!customId(id) || row.kind !== 'image' || row.mode !== 'image' || !(/^[A-Za-z0-9_-]{1,80}$/.test(row.providerId||'')) || ['__proto__','prototype','constructor'].includes(row.providerId) || !cleanText(model, 256) || customModels.has(id)) continue;
    const capabilities = row.capabilities || {}, sizes = gamecoworkCapabilityChoices(capabilities.size), qualities = gamecoworkCapabilityChoices(capabilities.quality), formats = gamecoworkCapabilityChoices(capabilities.outputFormat), ratios = gamecoworkCapabilityChoices(capabilities.aspectRatio);
    const descriptor = Object.freeze({ id, providerId:row.providerId, providerName:cleanText(row.providerName,128), upstreamModel:model, label:cleanText(row.label, 256)||model, kind:'image', mode:'image', protocol:cleanText(row.protocol,80), gamecoworkThirdParty:true, gamecoworkCustomProvider:true,
      gamecoworkTextOnly:true, maxCount:1, maxImages:0, agentAvailable:false, generationAvailable:row.generationAvailable===true, defaultSelected:row.defaultSelected===true,
      imageSizePolicy:row.protocol==='openai-images'&&row.imageSizePolicy==='openai-size'?'openai-size':'prompt-only', imageSizePolicyInfo:row.imageSizePolicyInfo||{},
      capabilities, sizeOptions:Object.freeze(sizes.length?sizes:['auto']), qualityOptions:Object.freeze(qualities.length?qualities:['auto']),
      formats:Object.freeze(formats.length?formats:['png']), defaultQuality:qualities[0]||'auto', aspectRatios:Object.freeze(ratios.length?ratios:['auto']),
      info:Object.freeze({note:`自定义 Provider · 请求型号 ${model}`,size:`${row.protocol==='openai-images'&&row.imageSizePolicy==='openai-size'?'已启用标准 size 参数与提示词规格；实际输出像素未验证。':''}尺寸支持证据：${gamecoworkCapabilitySummary(capabilities.size)}；质量：${gamecoworkCapabilitySummary(capabilities.quality)}；独立超分：${gamecoworkCapabilitySummary(capabilities.upscale)}。高分辨率生图不代表独立超分。`}),
      build(state) {
        const error=gamecoworkCpaParameterError(this,state); if(error) throw new Error(error);
        const payload={studioModelId:id,model,prompt:state.prompt};
        for(const [key,stateKey] of [['size','size'],['quality','quality'],['outputFormat','format'],['aspectRatio','ratio']]) {
          const choices=gamecoworkCapabilityChoices(capabilities[key]);
          if(choices.length&&!(key==='size'&&openAiSizeMode(this))) payload[key]=state[stateKey]||choices[0];
        }
        if(state.resolutionHint&&state.resolutionHint!=='auto')payload.resolutionHint=state.resolutionHint;
        if(state.aspectRatioHint&&state.aspectRatioHint!=='auto')payload.aspectRatioHint=state.aspectRatioHint;
        // New targets are sent as hints. Core freezes the chosen policy and
        // derives request size. A saved older explicit size remains distinct.
        if(openAiSizeMode(this)&&!payload.resolutionHint&&state.size&&state.size!=='auto')payload.size=state.size;
        return payload;
      },
    });
    customModels.set(id,descriptor);
  }
  return [...customModels.values()];
}
export function gamecoworkCustomModel(modelId) { return customModels.get(modelId); }
export function gamecoworkThirdPartyModels() { return [...cpaImageModels,...customModels.values()]; }
export function gamecoworkModelProviderId(model) { return model?.gamecoworkCustomProvider ? model.providerId : 'cpa'; }
export function gamecoworkProviderModels(models,providerId) {
  const result=models.filter(model=>gamecoworkModelProviderId(model)===providerId);
  if(result.length) return result;
  return [{id:'gamecowork-provider-unavailable',providerId,label:'该 Provider 模型当前不可用',kind:'image',gamecoworkThirdParty:true,gamecoworkCustomProvider:true,gamecoworkTextOnly:true,maxCount:1,maxImages:0,generationAvailable:false,capabilities:{},sizeOptions:['auto'],qualityOptions:['auto'],formats:['png'],defaultQuality:'auto',aspectRatios:['auto'],info:{note:'请恢复原 Provider 配置或明确选择其它 Provider。',size:'原 Provider 没有可用目录；不会自动改用 CPA 或其它服务。'},build(){throw Error('该 Provider 模型当前不可用');}}];
}
export function gamecoworkCustomParameterSettings(model,state,onChange,customResolutionFooter) {
  if(!model?.gamecoworkCustomProvider) return [];
  const result=[];
  for(const [field,stateKey,label] of [['size','size','输出尺寸'],['quality','quality','质量档位'],['outputFormat','format','输出格式'],['aspectRatio','ratio','构图比例目标']]) {
    if(field==='size'&&openAiSizeMode(model))continue;
    const capability=model.capabilities?.[field], choices=gamecoworkCapabilityChoices(capability);
    if(!choices.length) continue;
    const current=state[stateKey]||choices[0];
    result.push({key:'provider-'+field,label,value:current,options:choices.map(value=>({value,label:value==='auto'?'服务决定':value.replace('x','×')})),onChange:value=>onChange(stateKey,value),footer:gamecoworkCapabilitySummary(capability)+(field==='size'?'；输出分辨率不代表独立超分。':'')});
  }
  const resolution=state.resolutionHint||'auto',aspect=state.aspectRatioHint||'auto';
  if(openAiSizeMode(model)) {
    const selection=gamecoworkOpenAiSizeSelection(resolution,aspect),ratio=selection.aspect;
    result.push({key:'image-request-tier',label:'接口尺寸档位',value:selection.tier,options:[{value:'auto',label:'服务决定'},{value:'1k',label:'1K'},{value:'2k',label:'2K'},{value:'4k',label:'4K'},{value:'custom',label:'自定义像素'}],onChange:tier=>{
      onChange('size','auto');
      if(tier==='auto'){onChange('resolutionHint','auto');onChange('aspectRatioHint','auto');return;}
      if(tier==='custom'){onChange('resolutionHint',resolution==='auto'?'1024x1024':resolution);return;}
      const chosen=Object.hasOwn(gamecoworkOpenAiImageSizePresets[tier],ratio)?ratio:'1:1';
      onChange('resolutionHint',gamecoworkOpenAiImageSizePresets[tier][chosen]);onChange('aspectRatioHint',chosen);
    },footer:'按上游公开像素表发送标准 size 参数，并追加提示词规格；采用 16 像素取整预设。接口接线不代表实际输出已验证，4K 不等于 high 质量或独立超分。'});
    result.push({key:'image-request-aspect',label:'接口尺寸比例',value:ratio,options:[{value:'auto',label:'服务决定'},...Object.keys(gamecoworkOpenAiImageSizePresets['1k']).map(value=>({value,label:value}))],onChange:chosen=>{
      onChange('size','auto');onChange('aspectRatioHint',chosen);
      if(chosen==='auto'){onChange('resolutionHint','auto');return;}
      const tier=gamecoworkOpenAiImageSizePresets[selection.tier]?selection.tier:'1k';
      onChange('resolutionHint',gamecoworkOpenAiImageSizePresets[tier][chosen]);
    },footer:`${resolution==='auto'?'服务决定尺寸':resolution.replace('x','×')}；实际文件像素需要生成后核对，不保证上游兑现。`});
    result.push({key:'image-request-pixels',label:'接口请求像素',value:resolution==='auto'?'服务决定':resolution.replace('x','×'),options:[],footer:customResolutionFooter||'自定义实际请求像素，仍需核对上游返回。'});
    return result;
  }
  result.push({key:'prompt-resolution-target',label:'目标尺寸（提示词要求）',value:gamecoworkPromptResolutionHints.includes(resolution)?resolution:'__custom__',options:[...gamecoworkPromptResolutionHints.map(value=>({value,label:value==='auto'?'服务决定':value.replace('x','×')})),{value:'__custom__',label:'自定义目标'}],onChange:value=>onChange('resolutionHint',value==='__custom__'?resolution==='auto'?'1024x1024':resolution:value),footer:customResolutionFooter||'仅作为提示词要求发送，不保证上游输出像素；不是独立超分。'});
  result.push({key:'prompt-aspect-target',label:'目标比例（提示词要求）',value:aspect,options:gamecoworkPromptAspectHints.map(value=>({value,label:value==='auto'?'服务决定':value})),onChange:value=>onChange('aspectRatioHint',value),footer:'仅作为提示词要求发送，不保证上游构图或像素。'});
  return result;
}
export function gamecoworkIsThirdPartyModel(modelId) { return cpaImageModelIds.includes(modelId) || customId(modelId); }
export function gamecoworkCpaImage25Variant(modelId) { return cpaImage25Variants.find(variant => variant.id === modelId); }
export function gamecoworkCpaFamilyModelId(modelId) { return gamecoworkCpaImage25Variant(modelId) ? cpaImage25Variants[0].id : modelId; }
export function gamecoworkCpaMenuModels(models) { return models.filter(model => gamecoworkCpaFamilyModelId(model.id) === model.id); }
export function gamecoworkCpaMenuLabel(model) { return gamecoworkCpaImage25Variant(model.id) ? 'GPT Image 2.5 · CPA' : model.label; }
export function gamecoworkCpaParameterError(descriptor, state) {
  if (descriptor?.gamecoworkCustomProvider) {
    if(openAiSizeMode(descriptor)&&descriptor.capabilities?.size?.status==='unsupported'&&(state.resolutionHint&&state.resolutionHint!=='auto'||state.size&&state.size!=='auto'))return '该模型已标记不支持接口尺寸参数，请切换提示词策略或修改模型配置';
    for(const [key,stateKey,fallback] of [['size','size','auto'],['quality','quality','auto'],['outputFormat','format','png'],['aspectRatio','ratio','auto']]) {
      const choices=gamecoworkCapabilityChoices(descriptor.capabilities?.[key]), value=state[stateKey]||fallback;
      if(key==='size'&&openAiSizeMode(descriptor)) {
        if(value!=='auto') {const error=gamecoworkPromptHintError({resolutionHint:value},descriptor);if(error)return error;}
        continue;
      }
      if(choices.length ? !choices.includes(value) : value!==fallback) return '该 Provider 模型没有验证这些历史参数，请选择当前可用参数';
    }
    return gamecoworkPromptHintError(state,descriptor);
  }
  const model = cpaImageModels.find(value => value.id === descriptor?.id);
  if (!model) return '';
  if ((state.size || 'auto') !== 'auto' || (state.quality || 'auto') !== 'auto' || (state.format || 'png') !== 'png') return '当前账号代理未验证这些历史请求参数；请先使用账号默认参数';
  if (!model.aspectRatios.includes(state.ratio || state.aspectRatio || 'auto')) return '请选择可用的构图比例提示';
  return '';
}
export function gamecoworkCpaFactLines(reply, selectedModel, originalPayload) {
  const value = reply?.data?.output || reply?.data?.providerReportedImage ? reply.data : reply;
  const input = value?.input?.data || originalPayload || {};
  const id = selectedModel?.id || input.studioModelId || value?.type;
  const descriptor = cpaImageModels.find(model => model.id === id) || customModels.get(id);
  if (!descriptor) return [];
  const model = descriptor.upstreamModel || profiles.find(row => row[0] === id)[1], reported = value?.providerReportedImage || {};
  const variant = gamecoworkCpaImage25Variant(id);
  const facts = [...(variant ? [{ label: '选项', value: variant.label }] : []), { label: '请求型号', value: model }, { label: '实际型号', value: reported.model===model || profiles.some(row => row[1] === reported.model) ? reported.model : '未确认' }];
  if(descriptor.gamecoworkCustomProvider) {
    if(typeof input.resolutionHint==='string'&&/^([1-9]\d{0,3})x([1-9]\d{0,3})$/.test(input.resolutionHint))facts.push({label:'提示词目标尺寸',value:input.resolutionHint});
    if(typeof input.aspectRatioHint==='string'&&/^([1-9]\d?):([1-9]\d?)$/.test(input.aspectRatioHint))facts.push({label:'提示词目标比例',value:input.aspectRatioHint});
  }
  const files = value?.output?.data?.artifacts;
  if (Array.isArray(files)) for (const file of files.slice(0, 16)) {
    if (Number.isInteger(file?.width) && Number.isInteger(file?.height) && file.width > 0 && file.height > 0 && file.width <= 16384 && file.height <= 16384 && file.width * file.height <= 64 * 1024 * 1024) facts.push({ label: '文件像素', value: `${file.width}×${file.height}` });
    if (['image/png', 'image/jpeg', 'image/webp'].includes(file?.mime)) facts.push({ label: '文件格式', value: file.mime });
  }
  if(descriptor.gamecoworkCustomProvider&&value?.status==='completed'&&Array.isArray(files)) {
    const target=typeof input.size==='string'&&/^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(input.size)?input.size:typeof input.resolutionHint==='string'&&/^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(input.resolutionHint)?input.resolutionHint:null;
    const valid=files.filter(file=>Number.isInteger(file?.width)&&Number.isInteger(file?.height)&&file.width>0&&file.height>0&&file.width<=16384&&file.height<=16384&&file.width*file.height<=64*1024*1024);
    const primary=valid.some(file=>file.role==='result')?valid.filter(file=>file.role==='result'):valid;
    if(target&&primary.length) {
      const matched=primary.filter(file=>`${file.width}x${file.height}`===target).length;
      facts.unshift({label:'像素核验',value:matched===primary.length?'已达到请求像素':matched?'部分图片目标像素未兑现':'已生成，目标像素未兑现'});
    }
  }
  if (['auto', 'low', 'medium', 'high', 'xhigh', 'max'].includes(reported.quality)) facts.push({ label: '服务报告质量', value: reported.quality });
  if (['png', 'jpeg', 'webp'].includes(reported.outputFormat)) facts.push({ label: '服务报告格式', value: reported.outputFormat });
  if (reported.size === 'auto' || typeof reported.size === 'string' && /^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(reported.size)) facts.push({ label: '服务报告尺寸', value: reported.size });
  if (typeof input.size === 'string' && (input.size === 'auto' || /^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(input.size))) {
    const fact={label:descriptor.gamecoworkCustomProvider?'API 请求尺寸':'历史请求尺寸',value:input.size};
    if(descriptor.gamecoworkCustomProvider)facts.splice(facts[0]?.label==='像素核验'?1:0,0,fact);else facts.push(fact);
  }
  if (['auto', 'low', 'medium', 'high', 'xhigh', 'max'].includes(input.quality)) facts.push({ label: '历史请求质量', value: input.quality });
  if (['png', 'jpeg', 'webp'].includes(input.outputFormat)) facts.push({ label: '历史请求格式', value: input.outputFormat });
  if(descriptor.gamecoworkCustomProvider&&typeof value?.executionPrompt==='string'&&value.executionPrompt.length<=33000)facts.push({label:'实际发送提示词',value:value.executionPrompt});
  return facts;
}
export function extendGameCoworkModelRegistry(registry) {
  if (!registry || !Array.isArray(registry.image)) throw new TypeError('Original image model registry is unavailable');
  if (Object.hasOwn(registry, 'thirdparty') || Object.values(registry).some(group => Array.isArray(group) && group.some(model => gamecoworkIsThirdPartyModel(model.id)))) throw new Error('Duplicate GameCowork model descriptor');
  return { ...registry, thirdparty: cpaImageModels };
}
export function gamecoworkModelAcceptsReferences(model) {
  return !(model?.gamecoworkCustomProvider===true || gamecoworkIsThirdPartyModel(model?.id)) || model?.gamecoworkTextOnly !== true;
}
