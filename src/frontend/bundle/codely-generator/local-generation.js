// Local service readiness is separate from the original platform's account,
// subscription and credit fields. A global true value does not establish that
// any particular one of the original model descriptors has a local mapping.
import { cpaImageModelId, cpaImageUpstreamModel } from './local-models.js';
export const officialImageModelIds = Object.freeze(['frontier_flare','frontier_sunburst']);

export function gamecoworkGenerationReadiness(reply) {
  // Official identity mode shares the same local service capabilities; CPA
  // generation readiness must not regress when the official session is live.
  const mode = reply?.mode === 'gamecowork-local' || reply?.mode === 'codely-official' ? reply.mode : undefined;
  const value = mode ? reply?.capabilities?.localGeneration : undefined;
  const result = { mode: mode || 'gamecowork-local', localGeneration: typeof value === 'boolean' ? value : null,
    state: value === false ? 'unconfigured' : 'unknown' };
  if (mode === 'codely-official' && reply?.capabilities?.officialGeneration === true) result.officialGeneration = true;
  const models = mode ? reply?.capabilities?.models : undefined;
  if (models && typeof models === 'object' && !Array.isArray(models)) {
    result.models = {};
    const model = models[cpaImageModelId];
    if (value === true && Object.hasOwn(models, cpaImageModelId) && model?.available === true &&
        model.model === cpaImageUpstreamModel && typeof model.providerId === 'string' &&
        /^[A-Za-z0-9_-]{1,100}$/.test(model.providerId)) {
      result.models[cpaImageModelId] = Object.freeze({ available: true, providerId: model.providerId, model: cpaImageUpstreamModel });
    }
    if (result.officialGeneration === true) for (const modelId of officialImageModelIds) {
      const official=models[modelId];
      if (Object.hasOwn(models,modelId) && official?.available === true && official.service === 'codely-official' && official.model === modelId && official.kind === 'image') {
        result.models[modelId]=Object.freeze({available:true,service:'codely-official',model:modelId,kind:'image'});
      }
    }
    Object.freeze(result.models);
  }
  return result;
}

export function gamecoworkGenerationPresentation(readiness, language = 'zh', modelId) {
  const model = readiness?.models?.[modelId];
  const known = readiness?.mode === 'gamecowork-local' || readiness?.mode === 'codely-official';
  if (readiness?.mode === 'codely-official' && readiness.officialGeneration === true && officialImageModelIds.includes(modelId) &&
      model?.available === true && model.service === 'codely-official' && model.model === modelId && model.kind === 'image') {
    return { blocked:false,label:'',message:'' };
  }
  if (known && readiness.localGeneration === true && model?.available === true &&
      model.model === cpaImageUpstreamModel && typeof model.providerId === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(model.providerId)) {
    return { blocked: false, label: '', message: '' };
  }
  const unconfigured = known &&
    (readiness.localGeneration === false && readiness.state === 'unconfigured' || !!readiness.models);
  const english = String(language).startsWith('en');
  return { blocked: true,
    label: english ? unconfigured ? 'Service not configured' : 'Local status not ready' : unconfigured ? '服务未配置' : '本地状态未就绪',
    message: english ? unconfigured ? 'This model is not connected to a local generation service.' : 'Local generation readiness is not yet verified. Please try again later.' : unconfigured ? '此模型尚未连接生成服务' : '本地生成状态尚未就绪，请稍后重试' };
}
