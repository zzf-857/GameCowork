'use strict';
// Exact original Quick variants (kK/OK and iw/Wv), not replacement models.
// Source: tests/fixtures/codely-generator-api-contract.json, registry.generatedVariants.
const fs = require('node:fs');
const {createHash} = require('node:crypto');
const MODELS = Object.freeze({
  frontier_flare: Object.freeze({ id: 'frontier_flare', taskType: 'fal_frontier_flare', name: '全能耀斑' }),
  frontier_sunburst: Object.freeze({ id: 'frontier_sunburst', taskType: 'fal_frontier_sunburst', name: '全能日辉' }),
});
const SIZES = new Set(['square_hd','square','portrait_4_3','portrait_16_9','landscape_4_3','landscape_16_9','auto']);
const KEYS = new Set(['prompt','quality','outputFormat','isSegmentation','nativeSegmentation','imageSize','background','outputCompression','imageUrls','studioKind','studioModelId']);
function rejected(message) { const error = new Error(message); error.beforeRequest = true; error.code = 'invalid_official_image_request'; return error; }
function validatePayload(modelId, value) {
  if (!Object.hasOwn(MODELS, modelId) || !value || typeof value !== 'object' || Array.isArray(value)) throw rejected('Unsupported official image model or parameters');
  if (Object.keys(value).some(key => !KEYS.has(key))) throw rejected('The original image parameters contain an unsupported field');
  if (typeof value.prompt !== 'string' || [...value.prompt.trim()].length < 2 || [...value.prompt].length > 32000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.prompt)) throw rejected('提示词需为 2–32000 个字符');
  if (value.quality !== 'medium') throw rejected('当前官方图片接线支持原标准 medium 质量');
  if (!['png','jpeg','webp'].includes(value.outputFormat)) throw rejected('官方图片格式须为 PNG、JPEG 或 WebP');
  if (value.isSegmentation !== undefined && typeof value.isSegmentation !== 'boolean' || value.nativeSegmentation !== undefined && typeof value.nativeSegmentation !== 'boolean') throw rejected('Invalid segmentation parameters');
  if (value.isSegmentation || value.nativeSegmentation) throw rejected('官方分层输出尚未验收，请使用普通图片模式');
  if (typeof value.imageSize === 'string') { if (!SIZES.has(value.imageSize)) throw rejected('Unsupported original image size'); }
  else if (!value.imageSize || typeof value.imageSize !== 'object' || Array.isArray(value.imageSize) || Object.keys(value.imageSize).some(key => !['width','height'].includes(key)) ||
    ![value.imageSize.width,value.imageSize.height].every(v => Number.isInteger(v) && v >= 64 && v <= 3840) || value.imageSize.width*value.imageSize.height > 8294400) throw rejected('Invalid original image dimensions');
  if (!['auto','opaque','transparent'].includes(value.background)) throw rejected('Invalid original image background');
  if (value.outputCompression !== undefined && (!['jpeg','webp'].includes(value.outputFormat) || !Number.isInteger(value.outputCompression) || value.outputCompression < 0 || value.outputCompression > 100)) throw rejected('Invalid original output compression');
  if (value.studioModelId !== undefined && value.studioModelId !== modelId || value.studioKind !== undefined && value.studioKind !== modelId) throw rejected('Conflicting original model identity');
  if (value.imageUrls !== undefined && (!Array.isArray(value.imageUrls) || value.imageUrls.length > 16 || value.imageUrls.some(url => typeof url !== 'string' || !url || url.length > 8192))) throw rejected('Invalid original image references');
  return JSON.parse(JSON.stringify(value));
}
function quoteFor(modelId, payload) {
  return { taskType: MODELS[modelId].taskType,
    resolution: typeof payload.imageSize === 'string' ? payload.imageSize : `${payload.imageSize.width}x${payload.imageSize.height}`,
    quality: payload.quality };
}
function unwrap(value) { return value?.data && typeof value.data === 'object' ? value.data : value; }
function normalizeTaskReply(value, creating) {
  const row = unwrap(value);
  if (!row || typeof row !== 'object' || Array.isArray(row)) throw Error('Official generation returned an invalid task');
  const id = row.taskId || row.task_id || row.id;
  if (creating && (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,200}$/.test(id))) { const error=Error('Official create returned no usable task identity; submission outcome is unknown'); error.submissionUnknown=true; throw error; }
  const rawState = typeof row.status === 'string' ? row.status.toLowerCase() : null;
  const output = row.output?.data || row.result || row.output || row;
  const urls = [], seen = new Set();
  function visit(item, key='', depth=0) {
    if (depth > 12 || urls.length >= 8 || !item) return;
    if (typeof item === 'string') {
      if (!['imageUrl','image_url','imageUrls','images','outputUrl','output_url','url'].includes(key) || seen.has(item)) return;
      let parsed; try { parsed = new URL(item); } catch { return; }
      if (!['https:','http:'].includes(parsed.protocol) || parsed.username || parsed.password || item.length > 8192) throw Error('Official task returned an invalid image address');
      seen.add(item); urls.push({ url:item }); return;
    }
    if (Array.isArray(item)) { for(const child of item) visit(child,key,depth+1); return; }
    if (typeof item === 'object') for(const [name,child] of Object.entries(item)) if (!['input','param','originalImageUrl','originalUrl'].includes(name)) visit(child,name,depth+1);
  }
  visit(output);
  const pending = ['pending','queued','running','retrying','processing','in_progress'].includes(rawState);
  const failed = ['failed','error','cancelled','canceled'].includes(rawState);
  const status = failed ? rawState === 'cancelled' || rawState === 'canceled' ? 'cancelled' : 'failed'
    : ['completed','succeeded','success'].includes(rawState) ? 'completed'
    : pending ? ['pending','queued'].includes(rawState) ? 'queued' : 'running'
    : rawState || (creating && id ? 'queued' : undefined);
  const progress = Number.isFinite(row.progress) ? Math.min(100,Math.max(0,row.progress)) : undefined;
  return { ...(id ? {id} : {}), ...(status ? {status} : {}), ...(progress !== undefined ? {progress} : {}), outputs: urls,
    ...(failed ? {error:'Official generation failed; please inspect the original task'} : {}) };
}
function createOfficialImageExecutor({ assetService, getOfficial }) {
  function owner(task) {
    const official=getOfficial();
    if (!official || typeof official.generationBinding !== 'function' || official.generationBinding() !== task._officialOwner) {
      const error=rejected('官方账号已退出或改变，任务不会转交其他账号'); error.officialUnavailable=true; throw error;
    }
    return official;
  }
  return {
    isAvailable: () => !!getOfficial()?.generationBinding?.(),
    assertOwner: task => { owner(task); },
    downloadProvider: task => ({ baseUrl:owner(task).generatorOrigin(), authMode:'none' }),
    async request(task, creating, signal) {
      const official=owner(task);
      if (!creating) {
        const reply=normalizeTaskReply(await official.generatorTaskStatus(task._remoteId,signal),false);
        if (reply.id && reply.id !== task._remoteId) { const error=Error('官方查询返回的任务身份与原提交不一致'); error.officialUnavailable=true; throw error; }
        return reply;
      }
      const payload=validatePayload(task.model,task.parameters);
      try {
        const paid=await official.generatorPaidStatus(); owner(task);
        if (!['paid','internal'].includes(paid.paidType)) throw rejected('此官方图片模型需要生成站有效的 Pro 权益');
        const quote=unwrap(await official.generatorCostPreview(quoteFor(task.model,payload),signal)); owner(task);
        if (!Number.isFinite(quote?.credits) || quote.credits < 0) throw rejected('官方报价不可用，本次不会提交生成');
        if ((payload.imageUrls?.length || 0) !== (task.inputs?.length || 0)) throw rejected('Reference snapshots do not match the original image payload');
        const imageUrls=[];
        for(const reference of task.inputs || []) {
          const input=assetService.getInputPath(reference.id,task.workspaceKey);
          if (input.sha256 !== reference.sha256 || input.byteLength !== reference.byteLength || !input.mime.startsWith('image/')) throw rejected('Reference input identity or bytes changed');
          const bytes=fs.readFileSync(input.path);
          if (bytes.length !== reference.byteLength || createHash('sha256').update(bytes).digest('hex') !== reference.sha256) throw rejected('Reference input bytes changed before upload');
          const uploaded=unwrap(await official.generatorUploadImage({bytes,mime:input.mime,filename:input.filename},signal)); owner(task);
          const url=typeof uploaded === 'string' ? uploaded : uploaded?.url;
          let parsed; try { parsed=new URL(url); } catch { throw rejected('官方参考图上传未返回有效地址'); }
          const testOrigin=new URL(official.generatorOrigin());
          if (parsed.username || parsed.password || parsed.protocol !== 'https:' && !(testOrigin.protocol === 'http:' && parsed.origin === testOrigin.origin)) throw rejected('官方参考图上传返回不受支持的地址');
          imageUrls.push(url);
        }
        if (imageUrls.length) payload.imageUrls=imageUrls;
      } catch(error) { error.beforeRequest=true; error.submissionUnknown=false; throw error; }
      owner(task);
      return normalizeTaskReply(await official.generatorGenerate(task.model,payload,signal),true);
    },
  };
}
module.exports={ MODELS,validatePayload,quoteFor,unwrap,normalizeTaskReply,createOfficialImageExecutor };
