'use strict';
// Exact original Quick variants (kK/OK and iw/Wv), not replacement models.
// Source: tests/fixtures/codely-generator-api-contract.json, registry.generatedVariants.
const fs = require('node:fs');
const {createHash} = require('node:crypto');
const catalog = require('./gamecowork-official-model-catalog.js');
const { MODELS, validatePayload, quoteFor, referenceSlots, setPointer } = catalog;
const { normalizeTaskReply } = require('./gamecowork-official-task-output.js');
function rejected(message) { const error=Error(message); error.beforeRequest=true; error.code='invalid_official_generation_request'; return error; }
function unwrap(value) { return value?.data && typeof value.data === 'object' ? value.data : value; }
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
        const reply=normalizeTaskReply(await official.generatorTaskStatus(task._remoteId,signal),false,task.model);
        if (reply.id && reply.id !== task._remoteId) { const error=Error('官方查询返回的任务身份与原提交不一致'); error.officialUnavailable=true; throw error; }
        return reply;
      }
      const payload=validatePayload(task.model,task.parameters);
      try {
        const paid=await official.generatorPaidStatus(); owner(task);
        if (!['paid','internal'].includes(paid.paidType)) throw rejected('此官方图片模型需要生成站有效的 Pro 权益');
        const quote=unwrap(await official.generatorCostPreview(quoteFor(task.model,payload),signal)); owner(task);
        if (!Number.isFinite(quote?.credits) || quote.credits < 0) throw rejected('官方报价不可用，本次不会提交生成');
        const slots=referenceSlots(task.model,payload);
        if(slots.length !== (task.inputs?.length || 0)) throw rejected('原始引用字段与冻结素材数量不一致');
        let referenceIndex=0;
        for(const reference of task.inputs || []) {
          const input=assetService.getInputPath(reference.id,task.workspaceKey),slot=slots[referenceIndex++];
          if (input.sha256 !== reference.sha256 || input.byteLength !== reference.byteLength || !slot.mediaKinds.includes(input.kind)) throw rejected('Reference input identity or bytes changed');
          const bytes=fs.readFileSync(input.path);
          if (bytes.length !== reference.byteLength || createHash('sha256').update(bytes).digest('hex') !== reference.sha256) throw rejected('Reference input bytes changed before upload');
          const request={bytes,mime:input.mime,filename:input.filename,kind:input.kind,conversion:task.model==='blender-convert'};
          const uploaded=unwrap(await (official.generatorUploadMedia ? official.generatorUploadMedia(request,signal) : official.generatorUploadImage(request,signal))); owner(task);
          const url=typeof uploaded === 'string' ? uploaded : uploaded?.url || uploaded?.downloadUrl || uploaded?.imageUrl;
          let parsed; try { parsed=new URL(url); } catch { throw rejected('官方参考图上传未返回有效地址'); }
          const testOrigin=new URL(official.generatorOrigin());
          if (parsed.username || parsed.password || parsed.protocol !== 'https:' && !(testOrigin.protocol === 'http:' && parsed.origin === testOrigin.origin)) throw rejected('官方参考图上传返回不受支持的地址');
          setPointer(payload,slot.pointer,url);
        }
      } catch(error) { error.beforeRequest=true; error.submissionUnknown=false; throw error; }
      owner(task);
      return normalizeTaskReply(await official.generatorGenerate(task.model,payload,signal),true,task.model);
    },
  };
}
module.exports={ ...catalog,unwrap,normalizeTaskReply,createOfficialImageExecutor };
