// Local service readiness is separate from the original platform's account,
// subscription and credit fields. A global true value does not establish that
// any particular one of the original model descriptors has a local mapping.
import { cpaImageModelId, cpaImageUpstreamModel } from './local-models.js';

export function gamecoworkGenerationReadiness(reply) {
  const value = reply?.mode === 'gamecowork-local' ? reply?.capabilities?.localGeneration : undefined;
  const result = { mode: 'gamecowork-local', localGeneration: typeof value === 'boolean' ? value : null,
    state: value === false ? 'unconfigured' : 'unknown' };
  const models = reply?.mode === 'gamecowork-local' ? reply?.capabilities?.models : undefined;
  if (models && typeof models === 'object' && !Array.isArray(models)) {
    result.models = {};
    const model = models[cpaImageModelId];
    if (value === true && Object.hasOwn(models, cpaImageModelId) && model?.available === true &&
        model.model === cpaImageUpstreamModel && typeof model.providerId === 'string' &&
        /^[A-Za-z0-9_-]{1,100}$/.test(model.providerId)) {
      result.models[cpaImageModelId] = Object.freeze({ available: true, providerId: model.providerId, model: cpaImageUpstreamModel });
    }
    Object.freeze(result.models);
  }
  return result;
}

export function gamecoworkGenerationPresentation(readiness, language = 'zh', modelId) {
  const model = modelId === cpaImageModelId ? readiness?.models?.[cpaImageModelId] : undefined;
  if (readiness?.mode === 'gamecowork-local' && readiness.localGeneration === true && model?.available === true &&
      model.model === cpaImageUpstreamModel && typeof model.providerId === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(model.providerId)) {
    return { blocked: false, label: '', message: '' };
  }
  const unconfigured = readiness?.mode === 'gamecowork-local' &&
    (readiness.localGeneration === false && readiness.state === 'unconfigured' || !!readiness.models);
  const english = String(language).startsWith('en');
  return { blocked: true,
    label: english ? unconfigured ? 'Service not configured' : 'Local status not ready' : unconfigured ? '服务未配置' : '本地状态未就绪',
    message: english ? unconfigured ? 'This model is not connected to a local generation service.' : 'Local generation readiness is not yet verified. Please try again later.' : unconfigured ? '此模型尚未连接生成服务' : '本地生成状态尚未就绪，请稍后重试' };
}
