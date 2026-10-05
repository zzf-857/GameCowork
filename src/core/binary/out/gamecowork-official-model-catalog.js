'use strict';
// Hidden/internal static descriptors never become ordinary Pro capabilities.
const modules = [require('./gamecowork-official-image-models.js'), require('./gamecowork-official-video-3d-models.js'), require('./gamecowork-official-audio-text-models.js')];
const all = {}, owners = new Map();
for (const module of modules) for (const [id, model] of Object.entries(module.MODELS)) {
  if (Object.hasOwn(all,id)) throw Error('Duplicate official model contract: '+id);
  all[id] = Object.freeze(model); owners.set(id,module);
}
const MODELS = Object.freeze(Object.fromEntries(Object.entries(all).filter(([,model])=>model.visible !== false)));
function contract(id) {if (!Object.hasOwn(MODELS,id)) {const error=Error('此模型没有已接入的官方 Pro 契约'); error.beforeRequest=true; throw error;} return owners.get(id);}
function validatePayload(id,payload) {return contract(id).validatePayload(id,payload);}
function quoteFor(id,payload) {return contract(id).quoteFor(id,payload);}
function referenceSlots(id,payload) {return contract(id).referenceSlots(id,payload);}
function minimalPayload(id,refs={}) {return contract(id).minimalPayload(id,refs);}
function setPointer(value,pointer,replacement) {
  const parts=pointer.split('/').slice(1).map(part=>part.replace(/~1/g,'/').replace(/~0/g,'~'));
  if (!parts.length || parts.some(part=>['__proto__','prototype','constructor'].includes(part))) throw Error('Invalid official reference pointer');
  let parent=value; for(const part of parts.slice(0,-1)) {if(!parent || typeof parent!=='object' || !Object.hasOwn(parent,part)) throw Error('Missing original reference field'); parent=parent[part];}
  const last=parts.at(-1); if(!parent || typeof parent!=='object' || !Object.hasOwn(parent,last)) throw Error('Missing original reference field'); parent[last]=replacement;
}
module.exports={MODELS,validatePayload,quoteFor,referenceSlots,minimalPayload,setPointer};
