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
    const apiSize=state.requestSizeMode==='api-size';
    const size = apiSize&&state.resolutionHint&&state.resolutionHint!=='auto'?state.resolutionHint:state.size||'auto', quality = state.quality || 'auto', outputFormat = state.format || 'png';
    const aspectRatio=apiSize?state.aspectRatioHint!==undefined?state.aspectRatioHint:state.ratio||'auto':state.ratio||'auto';
    const error = gamecoworkCpaParameterError({ id }, { ...state,size,quality,format:outputFormat,ratio:aspectRatio });
    if (error) throw new Error(error);
    return { prompt: state.prompt, model, size, quality, outputFormat, studioModelId: id, aspectRatio,...(apiSize?{requestSizeMode:'api-size'}:{}) };
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
// Own exact-ratio request presets, derived on the same 16-pixel lattice and
// bounded pixel budget. Changed tuples are not the operator's published table.
export const gamecoworkOpenAiImageExactSizePresets=Object.freeze({
  '1k':gamecoworkOpenAiImageSizePresets['1k'],
  '2k':Object.freeze({...gamecoworkOpenAiImageSizePresets['2k'],'2:3':'1344x2016','3:2':'2016x1344'}),
  '4k':Object.freeze({...gamecoworkOpenAiImageSizePresets['4k'],'2:3':'2336x3504','3:2':'3504x2336','4:3':'3264x2448','3:4':'2448x3264','21:9':'3808x1632','9:21':'1632x3808'}),
});
const openAiSizeMode=model=>model?.protocol==='openai-images'&&model.imageSizePolicy==='openai-size';
export function gamecoworkOpenAiSizeSelection(resolution,aspect) {
  for(const [tier,presets] of Object.entries(gamecoworkOpenAiImageExactSizePresets)) {
    if(aspect&&presets[aspect]===resolution)return {tier,aspect,alignment:'exact'};
    for(const [ratio,size] of Object.entries(presets))if(size===resolution)return {tier,aspect:ratio,alignment:'exact'};
  }
  for(const [tier,presets] of Object.entries(gamecoworkOpenAiImageSizePresets)) {
    if(aspect&&presets[aspect]===resolution)return {tier:'legacy-'+tier,baseTier:tier,aspect,alignment:'rounded'};
    for(const [ratio,size] of Object.entries(presets))if(size===resolution)return {tier:'legacy-'+tier,baseTier:tier,aspect:ratio,alignment:'rounded'};
  }
  const pair=pixelPair(resolution),implied=pair?Object.keys(gamecoworkOpenAiImageExactSizePresets['1k']).find(value=>sameRatio(ratioPair(value),pair)):undefined;
  return {tier:resolution&&resolution!=='auto'?'custom':'auto',aspect:aspect&&aspect!=='auto'?aspect:implied||'auto',alignment:'custom'};
}
const pixelPair=value=>typeof value==='string'?/^([1-9]\d{0,3})x([1-9]\d{0,3})$/.exec(value)?.slice(1).map(Number):undefined;
const ratioPair=value=>typeof value==='string'?/^([1-9]\d?):([1-9]\d?)$/.exec(value)?.slice(1).map(Number):undefined;
const sameRatio=(left,right)=>left&&right&&left[0]*right[1]===left[1]*right[0];
function matchingApiRatio(model,pair) {
  const choices=gamecoworkCapabilityChoices(model?.capabilities?.aspectRatio);
  return choices.find(value=>sameRatio(ratioPair(value),pair)) || (choices.includes('auto')?'auto':undefined);
}
// Only a deliberate control action changes a draft; restoration never calls
// this helper or substitutes a new exact tuple for an older rounded request.
export function gamecoworkCustomImagePixelChanges(model,size) {
  const pair=pixelPair(size),ratio=matchingApiRatio(model,pair);
  return {resolutionHint:size,aspectRatioHint:'auto',...(openAiSizeMode(model)?{size:'auto'}:{}),...(ratio!==undefined?{ratio}:{})};
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
  const apiSize=pixelPair(state.size),apiRatio=ratioPair(state.ratio);
  if(size&&apiSize&&(size[0]!==apiSize[0]||size[1]!==apiSize[1]))return '接口尺寸与目标像素冲突，请统一两项设置';
  if(aspect&&apiRatio&&!sameRatio(aspect,apiRatio))return '接口构图比例与目标比例冲突，请统一两项设置';
  const effectiveSize=size||apiSize,effectiveRatio=aspect||apiRatio;
  const roundedPreset=openAiSizeMode(descriptor)&&effectiveSize&&effectiveRatio&&Object.values(gamecoworkOpenAiImageSizePresets).some(presets=>presets[effectiveRatio.join(':')]===effectiveSize.join('x'));
  if(effectiveSize&&effectiveRatio&&!roundedPreset&&effectiveSize[0]*effectiveRatio[1]!==effectiveSize[1]*effectiveRatio[0])return '目标尺寸与构图比例冲突，请调整其中一项或选择服务决定';
  return '';
}
const customId = value => typeof value === 'string' && /^cust_[a-f0-9]{32}$/.test(value);
const customModes = Object.freeze({image:'image',video:'video',audio:'audio',model:'3d'});
export function gamecoworkRestParameters(value = '{}') {
  if (typeof value === 'string' && value.length > 16000) throw Error('服务参数不能超过 16000 个字符');
  let parsed;
  try { parsed = typeof value === 'string' ? JSON.parse(value || '{}') : value; } catch { throw Error('服务参数必须是有效的 JSON 对象'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || ![Object.prototype,null].includes(Object.getPrototypeOf(parsed))) throw Error('服务参数必须是 JSON 对象');
  const inspect = (item,depth=0) => {
    if (depth > 8) throw Error('服务参数嵌套过深');
    if (item && typeof item === 'object') {
      if (Object.keys(item).length > 128) throw Error('服务参数项目过多');
      for (const [key,child] of Object.entries(item)) {
        if (/^(?:__proto__|prototype|constructor|authorization|cookie|api[-_]?key|access[-_]?token|secret|password)$/i.test(key)) throw Error('服务参数不能包含凭据或保留字段');
        inspect(child,depth+1);
      }
    } else if (typeof item === 'number' && !Number.isFinite(item)) throw Error('服务参数数值无效');
  };
  inspect(parsed);
  if (['studioModelId','studioKind','model','prompt','providerId','inputIds'].some(key=>Object.hasOwn(parsed,key))) throw Error('服务参数不能覆盖模型、提示词或素材身份');
  if (JSON.stringify(parsed).length > 16000) throw Error('服务参数不能超过 16000 个字符');
  return structuredClone(parsed);
}
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
export function gamecoworkImageFormatLabel(capability) {return capability?.requestField==='response_format'?'图片返回方式':'图片文件格式';}
export function gamecoworkSetProviderDescriptors(rows) {
  customModels.clear();
  if (!Array.isArray(rows)) return [];
  for (const row of rows.slice(0, 4096)) {
    const id = row?.stableStudioId || row?.id, model = row?.upstreamModel || row?.model;
    if (!customId(id) || !Object.hasOwn(customModes,row.kind) || row.mode !== customModes[row.kind] || row.kind !== 'image' && row.protocol !== 'generic-rest-task' || !(/^[A-Za-z0-9_-]{1,80}$/.test(row.providerId||'')) || ['__proto__','prototype','constructor'].includes(row.providerId) || !cleanText(model, 256) || customModels.has(id)) continue;
    const capabilities = row.capabilities || {}, sizes = gamecoworkCapabilityChoices(capabilities.size), qualities = gamecoworkCapabilityChoices(capabilities.quality), formats = gamecoworkCapabilityChoices(capabilities.outputFormat), ratios = gamecoworkCapabilityChoices(capabilities.aspectRatio);
    const descriptor = Object.freeze({ id, providerId:row.providerId, providerName:cleanText(row.providerName,128), upstreamModel:model, label:cleanText(row.label, 256)||model, kind:row.kind, mode:row.mode, protocol:cleanText(row.protocol,80), gamecoworkThirdParty:true, gamecoworkCustomProvider:true,
      gamecoworkTextOnly:true, maxCount:1, maxImages:0, agentAvailable:false, generationAvailable:row.generationAvailable===true, defaultSelected:row.defaultSelected===true,
      imageSizePolicy:row.protocol==='openai-images'&&row.imageSizePolicy==='openai-size'?'openai-size':'prompt-only', imageSizePolicyInfo:row.imageSizePolicyInfo||{},
      capabilities, sizeOptions:Object.freeze(sizes.length?sizes:['auto']), qualityOptions:Object.freeze(qualities.length?qualities:['auto']),
      formats:Object.freeze(formats.length?formats:['png']), defaultQuality:qualities[0]||'auto', aspectRatios:Object.freeze(ratios.length?ratios:['auto']),
      info:Object.freeze({note:`自定义 Provider · 请求型号 ${model}`,size:`${row.protocol==='openai-images'&&row.imageSizePolicy==='openai-size'?'按配置的尺寸字段提交精确像素与提示词规格；实际输出须核验。':''}尺寸支持证据：${gamecoworkCapabilitySummary(capabilities.size)}；质量：${gamecoworkCapabilitySummary(capabilities.quality)}；独立超分：${gamecoworkCapabilitySummary(capabilities.upscale)}。高分辨率生图不代表独立超分。`}),
      build(state) {
        const error=gamecoworkCpaParameterError(this,state); if(error) throw new Error(error);
        const payload={studioModelId:id,model,prompt:state.prompt};
        if (this.protocol === 'generic-rest-task') payload.parameters = gamecoworkRestParameters(state.providerParameters);
        if (this.kind !== 'image') return payload;
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
  if(!model?.gamecoworkCustomProvider || model.kind !== 'image') return [];
  const result=[];
  for(const [field,stateKey,label] of [['size','size','输出尺寸'],['quality','quality','质量档位'],['outputFormat','format','输出格式'],['aspectRatio','ratio','构图比例目标']]) {
    if(field==='size'&&openAiSizeMode(model))continue;
    const capability=model.capabilities?.[field], choices=gamecoworkCapabilityChoices(capability);
    if(!choices.length) continue;
    const current=state[stateKey]||choices[0];
    const shownLabel=field==='outputFormat'?gamecoworkImageFormatLabel(capability):field==='aspectRatio'?'接口构图比例':label;
    result.push({key:'provider-'+field,label:shownLabel,value:current,options:choices.map(value=>({value,label:value==='auto'?'服务决定':value==='url'?'图片 URL':value==='b64_json'?'Base64 图片数据':value.replace('x','×')})),onChange:value=>{
      onChange(stateKey,value);
      if(field==='aspectRatio'&&(value==='auto'||ratioPair(value)))onChange('aspectRatioHint',value);
    },footer:gamecoworkCapabilitySummary(capability)+(field==='size'?'；输出分辨率不代表独立超分。':field==='aspectRatio'?'；须与像素和目标比例一致。':field==='outputFormat'&&capability.requestField==='response_format'?'；仅决定图片如何返回，不改变 PNG/JPEG/WebP 编码。':'')});
  }
  const resolution=state.resolutionHint||'auto',aspect=state.aspectRatioHint||'auto';
  if(openAiSizeMode(model)) {
    const selection=gamecoworkOpenAiSizeSelection(resolution,aspect),ratio=aspect==='auto'?'auto':aspect;
    const change=values=>Object.entries(values).forEach(([key,value])=>onChange(key,value));
    const legacyOptions=selection.alignment==='rounded'?[{value:selection.tier,label:'历史取整 '+selection.baseTier.toUpperCase()}]:[];
    result.push({key:'image-request-tier',label:'接口尺寸档位',value:selection.tier,options:[...legacyOptions,{value:'auto',label:'服务决定'},{value:'1k',label:'1K'},{value:'2k',label:'2K'},{value:'4k',label:'4K'},{value:'custom',label:'自定义像素'}],onChange:tier=>{
      if(tier===selection.tier&&tier.startsWith('legacy-'))return;
      onChange('size','auto');
      if(tier==='auto'){onChange('resolutionHint','auto');onChange('aspectRatioHint','auto');return;}
      if(tier==='custom'){change(gamecoworkCustomImagePixelChanges(model,resolution==='auto'?'1024x1024':resolution));return;}
      if(!gamecoworkOpenAiImageExactSizePresets[tier])return;
      const chosen=Object.hasOwn(gamecoworkOpenAiImageExactSizePresets[tier],aspect==='auto'?selection.aspect:aspect)?aspect==='auto'?selection.aspect:aspect:'1:1';
      change({resolutionHint:gamecoworkOpenAiImageExactSizePresets[tier][chosen],aspectRatioHint:chosen});
      const apiRatio=matchingApiRatio(model,ratioPair(chosen));if(apiRatio!==undefined)onChange('ratio',apiRatio);
    },footer:selection.alignment==='rounded'?'旧历史取整像素原样保留，比例仅近似；点击新档位才应用精确比例预设。':'新预设由本应用按精确比例和 16 像素步长推导；按所配尺寸字段提交，实际输出仍须核验。4K 不等于 high 质量或独立超分。'});
    result.push({key:'image-request-aspect',label:'接口尺寸比例',value:ratio,options:[{value:'auto',label:resolution==='auto'?'服务决定':'由像素决定'},...Object.keys(gamecoworkOpenAiImageExactSizePresets['1k']).map(value=>({value,label:value}))],onChange:chosen=>{
      onChange('size','auto');onChange('aspectRatioHint',chosen);
      if(chosen==='auto'){const apiRatio=matchingApiRatio(model,pixelPair(resolution));if(apiRatio!==undefined)onChange('ratio',apiRatio);return;}
      const tier=gamecoworkOpenAiImageExactSizePresets[selection.baseTier||selection.tier]?selection.baseTier||selection.tier:'1k';
      onChange('resolutionHint',gamecoworkOpenAiImageExactSizePresets[tier][chosen]);
      const apiRatio=matchingApiRatio(model,ratioPair(chosen));if(apiRatio!==undefined)onChange('ratio',apiRatio);
    },footer:`${resolution==='auto'?'服务决定尺寸':resolution.replace('x','×')}；实际文件像素需要生成后核对，不保证上游兑现。`});
    result.push({key:'image-request-pixels',label:'接口请求像素',value:resolution==='auto'?'服务决定':resolution.replace('x','×'),options:[],footer:customResolutionFooter||'自定义实际请求像素，仍需核对上游返回。'});
    return result;
  }
  result.push({key:'prompt-resolution-target',label:'目标尺寸（提示词要求）',value:gamecoworkPromptResolutionHints.includes(resolution)?resolution:'__custom__',options:[...gamecoworkPromptResolutionHints.map(value=>({value,label:value==='auto'?'服务决定':value.replace('x','×')})),{value:'__custom__',label:'自定义目标'}],onChange:value=>onChange('resolutionHint',value==='__custom__'?resolution==='auto'?'1024x1024':resolution:value),footer:customResolutionFooter||'仅作为提示词要求发送，不保证上游输出像素；不是独立超分。'});
  result.push({key:'prompt-aspect-target',label:'目标比例（提示词要求）',value:aspect,options:gamecoworkPromptAspectHints.map(value=>({value,label:value==='auto'?'服务决定':value})),onChange:value=>onChange('aspectRatioHint',value),footer:'仅作为提示词要求发送，不保证上游构图或像素。'});
  return result;
}
export function gamecoworkCpaParameterSettings(model,state,onChange,customResolutionFooter) {
  if(!cpaImageModelIds.includes(model?.id))return [];
  const apiSize=state.requestSizeMode==='api-size',view={...model,protocol:'openai-images',imageSizePolicy:'openai-size',gamecoworkCustomProvider:true,capabilities:{},imageSizePolicyInfo:{constraints:{minPixels:655360}}};
  const mode={key:'cpa-request-size-mode',label:'CPA 尺寸请求方式',value:apiSize?'api-size':'auto',options:[{value:'auto',label:'账号自动尺寸'},{value:'api-size',label:'接口请求尺寸（待验证）'}],onChange:value=>{
    onChange('requestSizeMode',value);onChange('quality','auto');onChange('format','png');onChange('size','auto');
    if(value!=='api-size'){onChange('resolutionHint','auto');onChange('aspectRatioHint','auto');if(!model.aspectRatios.includes(state.ratio))onChange('ratio','auto');return;}
    const retained=state.resolutionHint&&state.resolutionHint!=='auto'?state.resolutionHint:pixelPair(state.size)?state.size:undefined;
    const aspect=model.aspectRatios.includes(state.ratio)&&state.ratio!=='auto'?state.ratio:'1:1';
    const size=retained||gamecoworkOpenAiImageExactSizePresets['1k'][aspect];
    onChange('resolutionHint',size);onChange('aspectRatioHint',sameRatio(pixelPair(size),ratioPair(aspect))?aspect:'auto');
  },footer:'账号自动尺寸沿用原默认请求；只有主动启用接口尺寸后才发送具体 size。图片仍单张、账户自动质量、PNG；新尺寸是否兑现须核验。'};
  if(apiSize)return [mode,...gamecoworkCustomParameterSettings(view,state,onChange,customResolutionFooter).map(setting=>setting.key==='image-request-tier'?{...setting,options:setting.options.filter(option=>option.value!=='auto')}:setting)];
  return [mode,{key:'compositionRatio',label:'构图比例目标',value:model.aspectRatios.includes(state.ratio)?state.ratio:'auto',options:model.aspectRatios.map(value=>({value,label:value==='auto'?'服务决定':value})),onChange:value=>onChange('ratio',value),footer:'仅通过提示词表达构图比例，实际像素由 CPA 服务决定。'}];
}
export function gamecoworkIsThirdPartyModel(modelId) { return cpaImageModelIds.includes(modelId) || customId(modelId); }
export function gamecoworkCpaImage25Variant(modelId) { return cpaImage25Variants.find(variant => variant.id === modelId); }
export function gamecoworkCpaFamilyModelId(modelId) { return gamecoworkCpaImage25Variant(modelId) ? cpaImage25Variants[0].id : modelId; }
export function gamecoworkCpaMenuModels(models) { return models.filter(model => gamecoworkCpaFamilyModelId(model.id) === model.id); }
export function gamecoworkCpaMenuLabel(model) { return gamecoworkCpaImage25Variant(model.id) ? 'GPT Image 2.5 · CPA' : model.label; }
export function gamecoworkCpaParameterError(descriptor, state) {
  if (descriptor?.gamecoworkCustomProvider) {
    if (descriptor.protocol === 'generic-rest-task') {
      try { gamecoworkRestParameters(state.providerParameters); } catch (error) { return error.message; }
    }
    if (descriptor.kind !== 'image') return '';
    if(openAiSizeMode(descriptor)&&descriptor.capabilities?.size?.status==='unsupported'&&(state.resolutionHint&&state.resolutionHint!=='auto'||state.size&&state.size!=='auto'))return '该模型已标记不支持接口尺寸参数，请切换提示词策略或修改模型配置';
    for(const [key,stateKey,fallback] of [['size','size','auto'],['quality','quality','auto'],['outputFormat','format','png'],['aspectRatio','ratio','auto']]) {
      const choices=gamecoworkCapabilityChoices(descriptor.capabilities?.[key]), value=state[stateKey]||fallback;
      if(key==='size'&&openAiSizeMode(descriptor)) {
        if(value!=='auto') {const error=gamecoworkPromptHintError({resolutionHint:value},descriptor);if(error)return error;}
        continue;
      }
      if(choices.length ? !choices.includes(value) : value!==fallback) return '该 Provider 模型没有验证这些历史参数，请选择当前可用参数';
      if(key==='outputFormat'&&choices.length&&!(descriptor.capabilities?.outputFormat?.requestField==='response_format'?['url','b64_json']:['png','jpeg','webp']).includes(value))return descriptor.capabilities?.outputFormat?.requestField==='response_format'?'图片返回方式仅接受 URL 或 Base64 数据，不是图片编码格式':'图片文件格式须为 PNG/JPEG/WebP；URL/Base64 需配置图片返回方式';
    }
    return gamecoworkPromptHintError(state,descriptor);
  }
  const model = cpaImageModels.find(value => value.id === descriptor?.id);
  if (!model) return '';
  if(state.requestSizeMode!==undefined&&!['auto','api-size'].includes(state.requestSizeMode))return '请选择有效的 CPA 尺寸请求方式';
  if(state.requestSizeMode==='api-size') {
    const size=state.resolutionHint&&state.resolutionHint!=='auto'?state.resolutionHint:state.size||'auto';
    if(size==='auto')return '接口尺寸模式须明确选择请求像素';
    if((state.quality||'auto')!=='auto'||(state.format||'png')!=='png')return 'CPA 接口尺寸模式仍采用账户自动质量和 PNG';
    const view={protocol:'openai-images',imageSizePolicy:'openai-size',imageSizePolicyInfo:{constraints:{minPixels:655360}}};
    const error=gamecoworkPromptHintError({resolutionHint:size},view);if(error)return error;
    const aspect=state.aspectRatioHint!==undefined?state.aspectRatioHint:state.ratio||state.aspectRatio||'auto';
    if(aspect!=='auto'&&(!ratioPair(aspect)||!sameRatio(pixelPair(size),ratioPair(aspect))))return 'CPA 接口请求像素与比例须精确一致；旧取整预设请主动改用新档位';
    return '';
  }
  if ((state.size || 'auto') !== 'auto' || (state.quality || 'auto') !== 'auto' || (state.format || 'png') !== 'png') return '当前账号代理未验证这些历史请求参数；请先使用账号默认参数';
  if (!model.aspectRatios.includes(state.ratio || state.aspectRatio || 'auto')) return '请选择可用的构图比例提示';
  return '';
}
export function gamecoworkCpaFactLines(reply, selectedModel, originalPayload) {
  const value = reply?.data?.output || reply?.data?.providerReportedImage ? reply.data : reply;
  const input = value?.input?.data || originalPayload || {};
  const id = selectedModel?.id || input.studioModelId || value?.type;
  const descriptor = cpaImageModels.find(model => model.id === id) || customModels.get(id);
  if (!descriptor) return gamecoworkMediaDimensionFacts(value, originalPayload);
  const model = descriptor.upstreamModel || profiles.find(row => row[0] === id)[1], reported = value?.providerReportedImage || {};
  const variant = gamecoworkCpaImage25Variant(id);
  const reportedModel=reported.model===model || profiles.some(row=>row[1]===reported.model)?reported.model:null;
  const facts = [...(variant ? [{ label: '选项', value: variant.label }] : []), { label: '请求型号', value: model },...(reportedModel?[{label:'服务报告型号',value:reportedModel}]:[]), { label: '实际型号', value:'未确认' }];
  if(descriptor.gamecoworkCustomProvider) {
    if(typeof input.resolutionHint==='string'&&/^([1-9]\d{0,3})x([1-9]\d{0,3})$/.test(input.resolutionHint))facts.push({label:'提示词目标尺寸',value:input.resolutionHint});
    if(typeof input.aspectRatioHint==='string'&&/^([1-9]\d?):([1-9]\d?)$/.test(input.aspectRatioHint))facts.push({label:'提示词目标比例',value:input.aspectRatioHint});
  }
  const files = value?.output?.data?.artifacts;
  if (Array.isArray(files)) for (const file of files.slice(0, 16)) {
    if (Number.isInteger(file?.width) && Number.isInteger(file?.height) && file.width > 0 && file.height > 0 && file.width <= 16384 && file.height <= 16384 && file.width * file.height <= 64 * 1024 * 1024 && !['preview','thumbnail','poster','depth'].includes(file.role)) facts.push({ label: file.dimensionKind==='display'?'视频显示尺寸':'文件像素', value: `${file.width}×${file.height}` });
    if (['image/png', 'image/jpeg', 'image/webp'].includes(file?.mime)) facts.push({ label: '文件格式', value: file.mime });
  }
  if((descriptor.gamecoworkCustomProvider||input.requestSizeMode==='api-size')&&value?.status==='completed'&&Array.isArray(files)) {
    const target=typeof input.size==='string'&&/^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(input.size)?input.size:typeof input.resolutionHint==='string'&&/^[1-9]\d{0,3}x[1-9]\d{0,3}$/.test(input.resolutionHint)?input.resolutionHint:null;
    const media=files.filter(file=>/^(image|video)\//.test(file?.mime||'')&&!['preview','thumbnail','poster','depth'].includes(file.role));
    const primary=media.some(file=>file.role==='result')?media.filter(file=>file.role==='result'):media;
    const valid=primary.filter(file=>Number.isInteger(file?.width)&&Number.isInteger(file?.height)&&file.width>0&&file.height>0&&file.width<=16384&&file.height<=16384&&file.width*file.height<=64*1024*1024);
    if(target) {
      const matched=valid.filter(file=>`${file.width}x${file.height}`===target).length;
      facts.unshift({label:'像素核验',value:!valid.length?'文件尺寸未能核验':valid.length<primary.length?'部分产物尺寸未能核验':matched===primary.length?'已达到请求像素':matched?'部分图片目标像素未兑现':'已生成，目标像素未兑现'});
    }
  }
  if (['auto', 'low', 'medium', 'high', 'xhigh', 'max'].includes(reported.quality)) facts.push({ label: '服务报告质量', value: reported.quality });
  if (['png', 'jpeg', 'webp'].includes(reported.outputFormat)) facts.push({ label: '服务报告格式', value: reported.outputFormat });
  if (reported.size === 'auto' || typeof reported.size === 'string' && /^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(reported.size)) facts.push({ label: '服务报告尺寸', value: reported.size });
  if (typeof input.size === 'string' && (input.size === 'auto' || /^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(input.size))) {
    const fact={label:descriptor.gamecoworkCustomProvider||input.requestSizeMode==='api-size'?'API 请求尺寸':'历史请求尺寸',value:input.size};
    if(descriptor.gamecoworkCustomProvider||input.requestSizeMode==='api-size')facts.splice(facts[0]?.label==='像素核验'?1:0,0,fact);else facts.push(fact);
  }
  if (['auto', 'low', 'medium', 'high', 'xhigh', 'max'].includes(input.quality)) facts.push({ label: '历史请求质量', value: input.quality });
  if (['png', 'jpeg', 'webp'].includes(input.outputFormat)) facts.push({ label: '历史请求格式', value: input.outputFormat });
  if(descriptor.gamecoworkCustomProvider&&typeof value?.executionPrompt==='string'&&value.executionPrompt.length<=33000)facts.push({label:'实际发送提示词',value:value.executionPrompt});
  return [...facts,...gamecoworkMediaDimensionFacts(value,originalPayload,{includePixels:false})];
}
// Request intent and measured file metadata are separate facts. Never infer
// dimensions from a gateway report, thumbnail, model name or resolution tier.
export function gamecoworkMediaDimensionFacts(reply, originalPayload, {includePixels=true}={}) {
  const value=reply?.data?.output?reply.data:reply,input=value?.input?.data||originalPayload||{},parameters=input.parameters||{};
  const files=Array.isArray(value?.output?.data?.artifacts)?value.output.data.artifacts:[];
  const media=files.filter(file=>/^(image|video)\//.test(file?.mime||'')&&!['preview','thumbnail','poster','depth'].includes(file.role));
  const primary=media.some(file=>file.role==='result')?media.filter(file=>file.role==='result'):media;
  const valid=primary.filter(file=>Number.isInteger(file.width)&&Number.isInteger(file.height)&&file.width>0&&file.height>0&&file.width<=16384&&file.height<=16384&&file.width*file.height<=64*1024*1024);
  const namedRatios={square_hd:'1:1',square:'1:1',portrait_4_3:'3:4',portrait_16_9:'9:16',landscape_4_3:'4:3',landscape_16_9:'16:9'};
  const apiRatio=[input.aspectRatio,input.ratio,input.videoRatio,parameters.aspect_ratio,parameters.aspectRatio,parameters.ratio].find(item=>typeof item==='string'&&/^[1-9]\d?:[1-9]\d?$/.test(item));
  const hintRatio=ratioPair(input.aspectRatioHint)?input.aspectRatioHint:undefined;
  const ratio=apiRatio||hintRatio||namedRatios[input.imageSize];
  const size=[typeof input.imageSize==='object'&&input.imageSize?`${input.imageSize.width}x${input.imageSize.height}`:input.imageSize,input.size,input.resolutionHint,parameters.size].find(item=>typeof item==='string'&&/^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(item));
  const facts=[];
  if(includePixels)for(const file of valid)facts.push({label:file.dimensionKind==='display'?'视频显示尺寸':'文件像素',value:`${file.width}×${file.height}`});
  if(value?.status!=='completed')return facts;
  if(size&&includePixels){facts.unshift({label:'请求尺寸',value:size});const matched=valid.filter(file=>`${file.width}x${file.height}`===size).length;facts.unshift({label:'像素核验',value:!valid.length?'文件尺寸未能核验':valid.length<primary.length?'部分产物尺寸未能核验':matched===primary.length?'已达到请求像素':matched?'部分产物目标像素未兑现':'已生成，目标像素未兑现'});}
  if(ratio){
    const pair=ratioPair(ratio),exact=valid.filter(file=>sameRatio([file.width,file.height],pair)).length;
    const rounded=valid.filter(file=>!sameRatio([file.width,file.height],pair)&&Object.values(gamecoworkOpenAiImageSizePresets).some(presets=>Object.entries(presets).some(([nominal,size])=>sameRatio(ratioPair(nominal),pair)&&size===`${file.width}x${file.height}`))).length;
    const near=valid.filter(file=>!sameRatio([file.width,file.height],pair)&&Math.abs(file.width*pair[1]-file.height*pair[0])<=Math.max(...pair)).length;
    const approximated=valid.filter(file=>!sameRatio([file.width,file.height],pair)&&(Math.abs(file.width*pair[1]-file.height*pair[0])<=Math.max(...pair)||Object.values(gamecoworkOpenAiImageSizePresets).some(presets=>Object.entries(presets).some(([nominal,size])=>sameRatio(ratioPair(nominal),pair)&&size===`${file.width}x${file.height}`)))).length;
    let verification=!valid.length?'文件尺寸未能核验':valid.length<primary.length?'部分产物尺寸未能核验':exact===primary.length?'精确匹配请求比例':exact+approximated===primary.length?exact?'部分产物仅近似匹配请求比例':rounded===primary.length?'符合历史取整预设，比例近似':near?'接近请求比例，非精确':'仅近似匹配请求比例':exact||approximated?'部分产物请求比例不匹配':'已生成，请求比例不匹配';
    if(apiRatio&&hintRatio&&!sameRatio(ratioPair(apiRatio),ratioPair(hintRatio))){facts.push({label:'提示词目标比例',value:hintRatio});verification='历史接口与提示词比例要求冲突，无法确认统一目标';}
    facts.push({label:'请求比例',value:ratio},{label:'比例核验',value:verification});
  }
  return facts;
}
export function gamecoworkMediaPrecisionSummary(task) {
  const facts=Array.isArray(task?.cpaFacts)?task.cpaFacts:gamecoworkCpaFactLines(task);
  const pixels=facts.find(row=>['文件像素','视频显示尺寸'].includes(row?.label)&&/^\d+×\d+$/.test(row.value))?.value;
  const pixel=facts.find(row=>row?.label==='像素核验')?.value||'',ratio=facts.find(row=>row?.label==='比例核验')?.value||'';
  if(!pixels&&!pixel&&!ratio)return null;
  const labels=[];let precision='measured';
  if(pixel.includes('未兑现')){labels.push('未达到请求尺寸');precision='mismatch';}
  else if(pixel.includes('未能核验')){labels.push('尺寸未知');precision='unknown';}
  else if(pixel.includes('已达到')){labels.push('请求尺寸精确匹配');precision='exact';}
  if(ratio.includes('不匹配')){labels.push('比例不匹配');precision='mismatch';}
  else if(ratio.includes('近似')||ratio.includes('接近')){labels.push('比例近似');if(!['mismatch','unknown'].includes(precision))precision='approximate';}
  else if(ratio.includes('冲突')||ratio.includes('未能核验')){labels.push('比例未知');if(precision!=='mismatch')precision='unknown';}
  else if(ratio.includes('精确')){labels.push('比例精确匹配');if(precision==='measured')precision='exact';}
  return {precision,text:[pixels,...labels].filter(Boolean).join(' · '),detail:[pixel,ratio].filter(Boolean).join('；')};
}
export function extendGameCoworkModelRegistry(registry) {
  if (!registry || !Array.isArray(registry.image)) throw new TypeError('Original image model registry is unavailable');
  if (Object.hasOwn(registry, 'thirdparty') || Object.values(registry).some(group => Array.isArray(group) && group.some(model => gamecoworkIsThirdPartyModel(model.id)))) throw new Error('Duplicate GameCowork model descriptor');
  return { ...registry, thirdparty: cpaImageModels };
}
export function gamecoworkModelAcceptsReferences(model) {
  return !(model?.gamecoworkCustomProvider===true || gamecoworkIsThirdPartyModel(model?.id)) || model?.gamecoworkTextOnly !== true;
}
