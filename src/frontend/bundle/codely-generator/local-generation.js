// Local service readiness is separate from the original platform's account,
// subscription and credit fields. A global true value does not establish that
// any particular one of the original model descriptors has a local mapping.
import { cpaImageModelId, cpaImageModels, gamecoworkSetProviderDescriptors, gamecoworkCustomModel } from './local-models.js';
// Static mirror of the fixed Core contracts. Runtime capabilities may enable
// only these exact model/kind/mode identities; the response is not a registry.
const officialModels = Object.freeze({
  'frontier_flare': Object.freeze({kind:'image',mode:'image'}),
  'frontier_sunburst': Object.freeze({kind:'image',mode:'image'}),
  'frontier-lite': Object.freeze({kind:'image',mode:'image'}),
  'seedream-lite': Object.freeze({kind:'image',mode:'image'}),
  'frontier-game-design': Object.freeze({kind:'image',mode:'image'}),
  'seedream-pro': Object.freeze({kind:'image',mode:'image'}),
  'frontier': Object.freeze({kind:'image',mode:'image'}),
  'hy-image-v3': Object.freeze({kind:'image',mode:'image'}),
  'qwen-image': Object.freeze({kind:'image',mode:'image'}),
  'upscale-image': Object.freeze({kind:'image',mode:'image'}),
  'sprite-animation': Object.freeze({kind:'image',mode:'image'}),
  'game-ui-kit': Object.freeze({kind:'image',mode:'image'}),
  'flare-skybox': Object.freeze({kind:'image',mode:'image'}),
  'skybox': Object.freeze({kind:'image',mode:'image'}),
  'qwen-layer': Object.freeze({kind:'image',mode:'image'}),
  'seedream-layer': Object.freeze({kind:'image',mode:'image'}),
  'seedance2': Object.freeze({kind:'video',mode:'video'}),
  'seedance25': Object.freeze({kind:'video',mode:'video'}),
  'minimax-h3': Object.freeze({kind:'video',mode:'video'}),
  'minimax-h3-max': Object.freeze({kind:'video',mode:'video'}),
  'wan3': Object.freeze({kind:'video',mode:'video'}),
  'happyhorse-11': Object.freeze({kind:'video',mode:'video'}),
  'effect-video': Object.freeze({kind:'video',mode:'video'}),
  'rodin-25': Object.freeze({kind:'model',mode:'3d'}),
  'tripo-p2': Object.freeze({kind:'model',mode:'3d'}),
  'tripo-p1': Object.freeze({kind:'model',mode:'3d'}),
  'tripo-31': Object.freeze({kind:'model',mode:'3d'}),
  'hy-31': Object.freeze({kind:'model',mode:'3d'}),
  'blender-convert': Object.freeze({kind:'model',mode:'3d'}),
  'mesh-seg': Object.freeze({kind:'model',mode:'3d'}),
  'texture-model': Object.freeze({kind:'model',mode:'3d'}),
  'decimate': Object.freeze({kind:'model',mode:'3d'}),
  'unirig': Object.freeze({kind:'model',mode:'3d'}),
  'mia': Object.freeze({kind:'model',mode:'3d'}),
  'motion': Object.freeze({kind:'model',mode:'3d'}),
  'sonilo-sfx': Object.freeze({kind:'audio',mode:'audio'}),
  'sonilo-music': Object.freeze({kind:'audio',mode:'audio'}),
  'eleven-sfx': Object.freeze({kind:'audio',mode:'audio'}),
  'eleven-music': Object.freeze({kind:'audio',mode:'audio'}),
  'huoshan-music': Object.freeze({kind:'audio',mode:'audio'}),
  'minimax-tts': Object.freeze({kind:'audio',mode:'audio'}),
  'minimax-voice': Object.freeze({kind:'text',mode:'audio'}),
  'doubao-prompt': Object.freeze({kind:'text',mode:'image'}),
});
export const officialModelIds = Object.freeze(Object.keys(officialModels));
export const officialImageModelIds = Object.freeze(officialModelIds.filter(id => officialModels[id].kind === 'image'));
function verifiedOfficial(modelId, model) {
  if (!Object.hasOwn(officialModels, modelId)) return false;
  const expected = officialModels[modelId];
  return !!model && model.available === true && model.service === 'codely-official' && model.model === modelId &&
    model.kind === expected.kind && model.mode === expected.mode;
}
function verifiedCpa(modelId, model) {
  const descriptor = cpaImageModels.find(value => value.id === modelId);
  if (!descriptor || model?.available !== true || typeof model.providerId !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(model.providerId)) return false;
  const upstream = descriptor.build({ prompt: '', size: 'auto' }).model;
  // The original Image 2 capability omitted these newly explicit display fields.
  const legacy = modelId === cpaImageModelId && model.service === undefined && model.kind === undefined && model.mode === undefined;
  return model.model === upstream && (legacy || model.service === 'cpa' && model.kind === 'image' && model.mode === 'image');
}

export function gamecoworkGenerationReadiness(reply) {
  // Official identity mode shares the same local service capabilities; CPA
  // generation readiness must not regress when the official session is live.
  const mode = reply?.mode === 'gamecowork-local' || reply?.mode === 'codely-official' ? reply.mode : undefined;
  const value = mode ? reply?.capabilities?.localGeneration : undefined;
  const result = { mode: mode || 'gamecowork-local', localGeneration: typeof value === 'boolean' ? value : null,
    state: value === false ? 'unconfigured' : 'unknown' };
  const custom=gamecoworkSetProviderDescriptors(mode ? reply?.capabilities?.providerDescriptors : []);
  if(custom.length) result.providerDescriptors=Object.freeze(custom);
  if (mode === 'codely-official' && reply?.capabilities?.officialGeneration === true) result.officialGeneration = true;
  const models = mode && reply?.capabilities?.models && typeof reply.capabilities.models==='object' && !Array.isArray(reply.capabilities.models) ? reply.capabilities.models : {};
  if (Object.keys(models).length || mode && reply?.capabilities?.models && typeof reply.capabilities.models==='object' && !Array.isArray(reply.capabilities.models) || custom.length) {
    result.models = {};
    if (value === true) for (const descriptor of cpaImageModels) {
      const model = models[descriptor.id];
      if (Object.hasOwn(models, descriptor.id) && verifiedCpa(descriptor.id, model)) result.models[descriptor.id] = Object.freeze({ available: true, providerId: model.providerId, model: model.model, service: 'cpa', kind: 'image', mode: 'image' });
    }
    for(const descriptor of custom) if(descriptor.generationAvailable) result.models[descriptor.id]=Object.freeze({available:true,providerId:descriptor.providerId,model:descriptor.upstreamModel,service:'custom-provider',kind:'image',mode:'image'});
    if (result.officialGeneration === true) for (const modelId of officialModelIds) {
      const official=models[modelId];
      if (Object.hasOwn(models,modelId) && verifiedOfficial(modelId,official)) {
        result.models[modelId]=Object.freeze({available:true,service:'codely-official',model:modelId,kind:official.kind,mode:official.mode});
      }
    }
    Object.freeze(result.models);
  }
  return result;
}

export function gamecoworkGenerationPresentation(readiness, language = 'zh', modelId) {
  const model = readiness?.models && Object.hasOwn(readiness.models,modelId) ? readiness.models[modelId] : undefined;
  const known = readiness?.mode === 'gamecowork-local' || readiness?.mode === 'codely-official';
  if (readiness?.mode === 'codely-official' && readiness.officialGeneration === true && verifiedOfficial(modelId,model)) {
    return { blocked:false,label:'',message:'' };
  }
  if (known && readiness.localGeneration === true && verifiedCpa(modelId, model)) {
    return { blocked: false, label: '', message: '' };
  }
  const custom=gamecoworkCustomModel(modelId);
  if(known && custom?.generationAvailable===true && model?.available===true && model.service==='custom-provider' && model.providerId===custom.providerId && model.model===custom.upstreamModel && model.kind==='image' && model.mode==='image') return {blocked:false,label:'',message:''};
  const unconfigured = known &&
    (readiness.localGeneration === false && readiness.state === 'unconfigured' || !!readiness.models);
  const english = String(language).startsWith('en');
  return { blocked: true,
    label: english ? unconfigured ? 'Service not configured' : 'Local status not ready' : unconfigured ? '服务未配置' : '本地状态未就绪',
    message: english ? unconfigured ? 'This model is not connected to a local generation service.' : 'Local generation readiness is not yet verified. Please try again later.' : unconfigured ? '此模型尚未连接生成服务' : '本地生成状态尚未就绪，请稍后重试' };
}
