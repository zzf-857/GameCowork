// GameCowork-owned descriptor, not an original Codely model or an alias for one.
// CPA has verified only this text-to-image request profile so far. The requested
// size is input metadata; output dimensions must come from the actual image.
export const cpaImageModelId = 'cpa-gpt-image-2';
export const cpaImageUpstreamModel = 'gpt-image-2';

export const cpaImageDescriptor = Object.freeze({
  id: cpaImageModelId,
  label: 'GPT Image 2 · CPA',
  kind: 'image',
  gamecoworkTextOnly: true,
  maxCount: 1,
  maxImages: 0,
  agentAvailable: false,
  // The original generic size menu uses state.size. Deliberately do not opt
  // into its sizeKey:"size" tiers/custom sizes or Frontier subscription UI.
  sizeOptions: Object.freeze(['1024x1024']),
  formats: Object.freeze(['png']),
  defaultQuality: 'low',
  qualityOptions: Object.freeze(['low']),
  info: Object.freeze({
    note: '通过已配置的 CPA 调用 gpt-image-2；当前验证文生图、low 质量、单张 PNG。请求 1024×1024，实际尺寸以返回图片为准。',
    size: '请求 1024×1024；服务可能返回不同尺寸，以实际图片像素为准。',
  }),
  build(state) {
    return {
      prompt: state.prompt,
      model: cpaImageUpstreamModel,
      size: '1024x1024',
      quality: 'low',
      outputFormat: 'png',
      studioModelId: cpaImageModelId,
    };
  },
});

export function extendGameCoworkModelRegistry(registry) {
  if (!registry || !Array.isArray(registry.image)) throw new TypeError('Original image model registry is unavailable');
  if (registry.image.some(model => model.id === cpaImageModelId)) throw new Error('Duplicate GameCowork model descriptor');
  return { ...registry, image: [...registry.image, cpaImageDescriptor] };
}

export function gamecoworkModelAcceptsReferences(model) {
  return model?.id !== cpaImageModelId || model?.gamecoworkTextOnly !== true;
}
