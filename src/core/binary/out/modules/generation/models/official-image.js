'use strict';
// Fixed original Quick image builders and controls, never a client-supplied schema.
// Evidence: tests/fixtures/codely-generator-api-contract.json (eL, F1e, G1e, z1e, R5, OK)
// and original VNe controls: qwen layers 1..8; skybox full/distant and off/soft.
const SIZES = Object.freeze(['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9', 'auto']);
const RATIOS = Object.freeze(['1:1', '16:9', '4:3', '3:4', '9:16', '21:9']);
const IDENTITY_KEYS = ['studioKind', 'studioModelId'];
const quoteFieldsFor = id => ['frontier_flare', 'frontier_sunburst', 'sprite-animation'].includes(id) ? ['resolution', 'quality']
  : ['frontier-lite', 'seedream-lite', 'frontier-game-design', 'seedream-pro', 'frontier', 'hy-image-v3', 'qwen-image', 'game-ui-kit'].includes(id) ? ['resolution']
  : id === 'upscale-image' ? ['scale'] : id === 'qwen-layer' ? ['numLayers']
  : id === 'seedream-layer' ? ['resolution', 'numImages'] : [];
const rows = [
  ['frontier_flare', '全能耀斑', 'fal_frontier_flare', 16, '/editor/task/frontier_flare'],
  ['frontier_sunburst', '全能日辉', 'fal_frontier_sunburst', 16, '/editor/task/frontier_sunburst'],
  ['frontier-lite', 'Frontier-Lite', 'fal_frontier_lite', 9, '/editor/task/frontier-lite'],
  ['seedream-lite', 'Seedream 5.0 Lite', 'huoshan_seedream', 10, '/editor/task/huoshan-seedream-45-async'],
  ['frontier-game-design', 'Frontier Game Design', 'fal_frontier_game_design', 9, '/editor/task/frontier-game-design'],
  ['seedream-pro', 'Seedream 5.0 Pro', 'huoshan_seedream_pro', 10, '/editor/task/huoshan-seedream-pro-async'],
  ['frontier', 'Frontier', 'fal_nano_banana', 9, '/editor/task/frontier-effect'],
  ['hy-image-v3', '混元生图3.0', 'hy_image_v3', 3, '/editor/task/hy-image-v3'],
  ['qwen-image', '千问生图3.0 Pro', 'qwen_image', 3, '/editor/task/qwen-image'],
  ['upscale-image', '图像超分', 'fal_esrgan', 1, '/editor/task/upscale-image'],
  ['sprite-animation', '精灵图动画', 'fal_frontier_flare', 16, '/editor/task/sprite-animation'],
  ['game-ui-kit', '游戏 UI 套件', 'fal_frontier_game_design', 0, '/editor/task/game-ui-kit'],
  ['flare-skybox', '全能耀斑天空盒', 'flare_skybox', 16, '/editor/task/flare-skybox'],
  ['skybox', 'Rodin 天空盒', 'rodin_skybox', 0, '/editor/task/skybox'],
  ['qwen-layer', '图片分层', 'fal_image_layering', 1, '/editor/task/image-layering'],
  ['seedream-layer', 'Seedream 图片分层', 'huoshan_seedream_layer', 1, '/editor/task/seedream-image-layering'],
];
const MODELS = Object.freeze(Object.fromEntries(rows.map(([id, name, taskType, maxInputs, endpoint]) => [id, Object.freeze({
  id, name, mode: 'image', kind: 'image', taskType, maxInputs, maxImages: maxInputs, endpoint, visible: true,
  quoteFields: Object.freeze(quoteFieldsFor(id)),
  outputKinds: Object.freeze(['flare-skybox', 'skybox'].includes(id) ? ['image', 'file'] : ['image']),
  ...(id === 'seedream-layer' ? { auxiliary: true, originalKind: 'seedream-layering', maxOutputs: 17, outputMetadata: 'layers: url, zIndex, name, description, boundingBox' }
    : id === 'qwen-layer' ? { originalKind: 'layering', maxOutputs: 8, outputMetadata: 'layers: url, zIndex, name, description, boundingBox' }
    : id === 'flare-skybox' ? { originalKind: 'skybox', outputRequirements: '2K/8K PNG, EXR and relative depth image' }
    : id === 'skybox' ? { originalKind: 'skybox', outputRequirements: 'skybox_basic/skybox_high actual media and original download files' } : {}),
})]).concat([
  ['material', Object.freeze({ id: 'material', name: 'PBR 材质', mode: 'image', kind: 'image', visible: false, maxInputs: 0, outputKinds: Object.freeze(['image']), reason: 'Excluded by original P5 expression' })],
  ['sprite-atlas', Object.freeze({ id: 'sprite-atlas', name: '精灵图图集', mode: 'image', kind: 'image', visible: false, maxInputs: 1, outputKinds: Object.freeze(['image']), reason: 'Excluded by original F1e.filter in xN.image' })],
])));

function invalid(message) {
  const error = new Error(message); error.beforeRequest = true; error.code = 'invalid_official_image_request'; return error;
}
function specFor(id) {
  if (!Object.hasOwn(MODELS, id) || !MODELS[id].visible) throw invalid('Unsupported or hidden original image model');
  return MODELS[id];
}
function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw invalid('Invalid ' + label);
}
function fields(payload, allowed) {
  const set = new Set([...allowed, ...IDENTITY_KEYS]);
  if (Object.keys(payload).some(key => !set.has(key))) throw invalid('Unsupported original image parameter');
}
function choice(value, allowed, label) {
  if (!allowed.includes(value)) throw invalid('Invalid original ' + label);
}
function bool(value, label, optional = false) {
  if (!(optional && value === undefined) && typeof value !== 'boolean') throw invalid('Invalid original ' + label);
}
function prompt(value, optional = false, minimum = 1) {
  if (optional && value === undefined) return;
  if (typeof value !== 'string' || (!optional && [...value.trim()].length < minimum) || [...value].length > 32000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw invalid('Invalid original image prompt');
}
function dimensions(value, min, max, ratioMin, ratioMax, edgeMin = 1, edgeMax = 16777216) {
  if (typeof value !== 'string' || !/^[1-9]\d{0,7}x[1-9]\d{0,7}$/.test(value)) throw invalid('Invalid original image dimensions');
  const [width, height] = value.split('x').map(Number), area = width * height, ratio = width / height;
  if (![width, height].every(v => Number.isSafeInteger(v) && v >= edgeMin && v <= edgeMax) || area < min || area > max || ratio < ratioMin || ratio > ratioMax) throw invalid('Original image dimensions exceed model limits');
}
function frontierSize(value, options = SIZES) {
  if (typeof value === 'string') return choice(value, options, 'image size');
  object(value, 'original image dimensions');
  if (Object.keys(value).length !== 2 || !Object.hasOwn(value, 'width') || !Object.hasOwn(value, 'height') || ![value.width, value.height].every(v => Number.isInteger(v) && v >= 16 && v <= 3840) || value.width * value.height > 8294400) throw invalid('Invalid original Frontier dimensions');
}
function address(value) {
  if (typeof value !== 'string' || !value || value.length > 8192) throw invalid('Invalid original reference address');
  let parsed; try { parsed = new URL(value); } catch { throw invalid('Invalid original reference address'); }
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) throw invalid('Invalid original reference address');
}
function references(payload, key, max, required = false, singular = false) {
  const value = payload[key];
  if (value === undefined) { if (required) throw invalid('This original image model requires an owned reference'); return []; }
  if (singular) { address(value); return [value]; }
  if (!Array.isArray(value) || value.length > max || (required && !value.length)) throw invalid('Invalid original image references');
  value.forEach(address);
  if (new Set(value).size !== value.length) throw invalid('Duplicate original image references');
  return value;
}
function frontierPayload(id, payload) {
  const extended = ['frontier_flare', 'frontier_sunburst', 'sprite-animation'].includes(id);
  fields(payload, ['prompt', 'quality', 'outputFormat', 'isSegmentation', 'nativeSegmentation', 'imageSize', 'imageUrls', ...(extended ? ['background', 'outputCompression'] : [])]);
  const refs = references(payload, 'imageUrls', MODELS[id].maxInputs);
  prompt(payload.prompt, !extended && !!refs.length, extended ? 2 : 1);
  choice(payload.quality, extended ? ['medium'] : ['low', 'medium', 'high'], 'image quality');
  choice(payload.outputFormat, ['png', 'jpeg', 'webp'], 'image format');
  bool(payload.isSegmentation, 'segmentation'); bool(payload.nativeSegmentation, 'native segmentation');
  if (payload.isSegmentation && payload.nativeSegmentation || payload.nativeSegmentation && payload.outputFormat !== 'png') throw invalid('Inconsistent original segmentation parameters');
  frontierSize(payload.imageSize, id === 'sprite-animation' ? ['square_hd', 'square'] : SIZES);
  if (id === 'sprite-animation' && (typeof payload.imageSize !== 'string' || !payload.nativeSegmentation || payload.isSegmentation || payload.background !== 'transparent')) throw invalid('Original sprite animation requires its fixed transparent native output');
  if (extended) {
    choice(payload.background, payload.nativeSegmentation ? ['transparent'] : ['auto', 'opaque'], 'image background');
    if (payload.outputCompression !== undefined && (!['jpeg', 'webp'].includes(payload.outputFormat) || !Number.isInteger(payload.outputCompression) || payload.outputCompression < 0 || payload.outputCompression > 100)) throw invalid('Invalid original output compression');
  }
}
function validatePayload(modelId, value) {
  const spec = specFor(modelId); object(value, 'original image payload');
  for (const key of IDENTITY_KEYS) if (value[key] !== undefined && value[key] !== modelId) throw invalid('Conflicting original model identity');
  switch (modelId) {
    case 'frontier_flare': case 'frontier_sunburst': case 'frontier-game-design': case 'sprite-animation':
      frontierPayload(modelId, value); break;
    case 'frontier': case 'frontier-lite': {
      fields(value, ['prompt', 'aspectRatio', 'resolution', 'imageUrls', ...(modelId === 'frontier-lite' ? ['isSegmentation'] : [])]);
      const refs = references(value, 'imageUrls', spec.maxInputs); prompt(value.prompt, !!refs.length);
      choice(value.aspectRatio, RATIOS, 'aspect ratio'); if (value.resolution !== '1K') throw invalid('Original Frontier resolution is fixed to 1K');
      if (modelId === 'frontier-lite') bool(value.isSegmentation, 'segmentation'); break;
    }
    case 'seedream-lite': case 'seedream-pro': {
      fields(value, ['prompt', 'size', 'isSegmentation', 'imageUrls']);
      const refs = references(value, 'imageUrls', spec.maxInputs); prompt(value.prompt, !!refs.length); bool(value.isSegmentation, 'segmentation');
      dimensions(value.size, modelId === 'seedream-lite' ? 3686400 : 921600, modelId === 'seedream-lite' ? 16777216 : 4194304, 1 / 16, 16); break;
    }
    case 'hy-image-v3': case 'qwen-image': {
      fields(value, ['prompt', 'size', 'mode', 'images', ...(modelId === 'hy-image-v3' ? ['revise'] : [])]);
      const refs = references(value, 'images', spec.maxInputs); prompt(value.prompt, !!refs.length);
      choice(value.mode, ['text_to_image', 'image_to_image'], 'image mode');
      if (value.mode !== (refs.length ? 'image_to_image' : 'text_to_image')) throw invalid('Original image mode and references do not agree');
      if (modelId === 'hy-image-v3') { bool(value.revise, 'revise'); dimensions(value.size, 262144, 1048576, 0.25, 4, 512, 2048); }
      else dimensions(value.size, 262144, 4194304, 1 / 8, 8); break;
    }
    case 'upscale-image':
      fields(value, ['imageUrl', 'scale', 'model', 'outputFormat']); references(value, 'imageUrl', 1, true, true);
      choice(value.scale, [1, 2, 4, 8], 'upscale factor');
      if (value.model !== 'RealESRGAN_x4plus_anime_6B' || value.outputFormat !== 'png') throw invalid('Original upscale algorithm and PNG format are fixed'); break;
    case 'game-ui-kit':
      fields(value, ['prompt', 'imageSize', 'quality', 'isSegmentation', 'outputFormat']); prompt(value.prompt);
      choice(value.imageSize, ['square_hd', 'landscape_16_9'], 'UI canvas');
      choice(value.quality, ['low', 'medium', 'high'], 'image quality');
      if (value.isSegmentation !== false || value.outputFormat !== 'png') throw invalid('Original game UI output is an ordinary PNG'); break;
    case 'flare-skybox': {
      fields(value, ['prompt', 'imageUrls', 'sceneMode', 'nadirCorrection']); const refs = references(value, 'imageUrls', 16); prompt(value.prompt, !!refs.length);
      choice(value.sceneMode, ['full', 'distant'], 'skybox scene'); choice(value.nadirCorrection, ['off', 'soft'], 'skybox nadir correction'); break;
    }
    case 'skybox':
      fields(value, ['prompt', 'high_res']); prompt(value.prompt); bool(value.high_res, 'skybox resolution'); break;
    case 'qwen-layer':
      fields(value, ['prompt', 'imageUrl', 'numLayers']); prompt(value.prompt, true); references(value, 'imageUrl', 1, true, true);
      choice(value.numLayers, [1, 2, 3, 4, 5, 6, 7, 8], 'layer count'); break;
    case 'seedream-layer':
      fields(value, ['prompt', 'imageUrl', 'size']); prompt(value.prompt, true); references(value, 'imageUrl', 1, true, true);
      choice(value.size, ['auto', '1K', '1.5K', '2K'], 'layer size'); break;
  }
  return JSON.parse(JSON.stringify(value));
}
function quoteFor(modelId, value) {
  const spec = specFor(modelId), payload = validatePayload(modelId, value), base = { taskType: spec.taskType };
  switch (modelId) {
    case 'frontier_flare': case 'frontier_sunburst': case 'sprite-animation':
      return { ...base, resolution: typeof payload.imageSize === 'string' ? payload.imageSize : `${payload.imageSize.width}x${payload.imageSize.height}`, quality: payload.quality };
    case 'frontier-game-design': case 'game-ui-kit':
      return { ...base, resolution: typeof payload.imageSize === 'string' ? payload.imageSize : `${payload.imageSize.width}x${payload.imageSize.height}` };
    case 'frontier': case 'frontier-lite': return { ...base, resolution: '1K' };
    case 'seedream-lite': case 'seedream-pro': case 'qwen-image': return { ...base, resolution: payload.size };
    case 'hy-image-v3': return { ...base, resolution: '1k' };
    case 'upscale-image': return { ...base, scale: String(payload.scale) };
    case 'qwen-layer': return { ...base, numLayers: String(payload.numLayers) };
    case 'seedream-layer': return { ...base, resolution: payload.size, numImages: '17' };
    default: return base;
  }
}
function referenceSlots(modelId, value) {
  const payload = validatePayload(modelId, value);
  const key = ['hy-image-v3', 'qwen-image'].includes(modelId) ? 'images'
    : ['upscale-image', 'qwen-layer', 'seedream-layer'].includes(modelId) ? 'imageUrl' : 'imageUrls';
  if (payload[key] === undefined) return [];
  return (Array.isArray(payload[key]) ? payload[key] : [payload[key]]).map((url, index) => ({
    pointer: Array.isArray(payload[key]) ? `/${key}/${index}` : `/${key}`, value: url, mediaKinds: ['image'],
  }));
}
function minimalPayload(modelId, references = {}) {
  const spec = specFor(modelId);
  const images = Array.isArray(references.images) ? references.images.slice(0, spec.maxInputs) : [];
  const promptText = 'A simple blue cube on a plain white background';
  let result;
  switch (modelId) {
    case 'frontier_flare': case 'frontier_sunburst': case 'frontier-game-design': case 'sprite-animation':
      result = { prompt: modelId === 'sprite-animation' ? 'A blue cube rotating, 4 by 4 sprite sheet, sixteen animation frames' : promptText,
        quality: modelId === 'frontier-game-design' ? 'low' : 'medium', outputFormat: 'png', isSegmentation: false,
        nativeSegmentation: modelId === 'sprite-animation', imageSize: modelId === 'sprite-animation' ? 'square' : 'square' };
      if (modelId !== 'frontier-game-design') result.background = modelId === 'sprite-animation' ? 'transparent' : 'auto';
      if (images.length) result.imageUrls = images; break;
    case 'frontier': case 'frontier-lite':
      result = { prompt: promptText, aspectRatio: '1:1', resolution: '1K' };
      if (modelId === 'frontier-lite') result.isSegmentation = false;
      if (images.length) result.imageUrls = images; break;
    case 'seedream-lite': case 'seedream-pro':
      result = { prompt: promptText, size: modelId === 'seedream-lite' ? '1920x1920' : '960x960', isSegmentation: false };
      if (images.length) result.imageUrls = images; break;
    case 'hy-image-v3': case 'qwen-image':
      result = { prompt: promptText, size: '512x512', mode: images.length ? 'image_to_image' : 'text_to_image' };
      if (modelId === 'hy-image-v3') result.revise = false;
      if (images.length) result.images = images; break;
    case 'upscale-image': result = { imageUrl: images[0], scale: 1, model: 'RealESRGAN_x4plus_anime_6B', outputFormat: 'png' }; break;
    case 'game-ui-kit': result = { prompt: 'A simple game HUD with one blue button on a plain background', imageSize: 'square_hd', quality: 'low', isSegmentation: false, outputFormat: 'png' }; break;
    case 'flare-skybox': result = { prompt: 'A simple blue sky and flat grassy ground, seamless 360 degree panorama', imageUrls: images, sceneMode: 'distant', nadirCorrection: 'off' }; break;
    case 'skybox': result = { prompt: 'A simple blue sky and flat grassy ground', high_res: false }; break;
    case 'qwen-layer': result = { prompt: '', imageUrl: images[0], numLayers: 1 }; break;
    case 'seedream-layer': result = { prompt: '', imageUrl: images[0], size: '1K' }; break;
  }
  return validatePayload(modelId, result);
}
module.exports = { MODELS, validatePayload, quoteFor, referenceSlots, minimalPayload };
