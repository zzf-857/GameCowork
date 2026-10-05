'use strict';
const {MODELS}=require('./gamecowork-official-model-catalog.js');
const URL_FIELDS=new Set(['imageUrl','image_url','image_urls','imageUrls','images','outputUrl','output_url','url','videoUrl','video_url','videos','audioUrl','audio_url','audios','glb_url','modelUrl','modelURL','modelUrls','fbxUrl','fbx_url','objUrl','stlUrl','usdzUrl','previewUrl','thumbnailUrl','downloadUrl','atlasUrl','skybox_basic','skybox_high','layers','motionAssets','texture_diffuse','texture_normal','texture_metallic','texture_roughness','exrUrl','hdrUrl','depthUrl','fileUrl','files','archiveUrl','reportUrl']);
function normalizeTaskReply(value,creating,modelId) {
  const row=value?.data && typeof value.data==='object' ? value.data : value;
  if (!row || typeof row!=='object' || Array.isArray(row)) throw Error('Official generation returned an invalid task');
  const id=row.taskId || row.task_id || row.id;
  if (creating && (typeof id!=='string' || !/^[A-Za-z0-9_-]{1,200}$/.test(id))) {const error=Error('Official create returned no usable task identity; submission outcome is unknown'); error.submissionUnknown=true; throw error;}
  const rawState=typeof row.status==='string' ? row.status.toLowerCase() : null;
  const pending=['pending','queued','running','retrying','processing','in_progress'].includes(rawState),failed=['failed','error','cancelled','canceled'].includes(rawState);
  const status=failed ? ['cancelled','canceled'].includes(rawState) ? 'cancelled' : 'failed' : ['completed','succeeded','success'].includes(rawState) ? 'completed' : pending ? ['pending','queued'].includes(rawState) ? 'queued' : 'running' : rawState || (creating && id ? 'queued' : undefined);
  const outputs=[],model=MODELS[modelId],output=row.output?.data || row.result || row.output || row;
  function visit(item,key='',depth=0) {
    if(depth>12) throw Error('Official output exceeds nesting limit');
    if(typeof item==='string') {
      if((URL_FIELDS.has(key) || /\.(?:png|jpe?g|webp|exr|hdr|mp4|webm|wav|mp3|aac|flac|ogg|opus|m4a|glb|fbx|obj|stl|usdz|zip|json)(?:[?#]|$)/i.test(item)) && /^https?:\/\//i.test(item)) {
        const parsed=new URL(item); if(parsed.username || parsed.password || item.length>8192) throw Error('Invalid official media address');
        // Original Quick _N/k5 selects the actual voice-clone audio preview as
        // its result. It does not require an invented voice identity field.
        const preview=/preview|thumbnail/i.test(key) && modelId!=='minimax-voice';
        const existing=outputs.findIndex(row=>row.url===item); if(existing>=0) {if(!preview) outputs[existing].role='result'; return {artifactIndex:existing};}
        if(outputs.length>=64) throw Error('Official output exceeds file limit'); const index=outputs.length;
        outputs.push({url:item,role:preview?'preview':'result'}); return {artifactIndex:index};
      }
      if(key==='text' && model?.outputKinds?.includes('text') && item.trim() && !/^https?:\/\//i.test(item)) {if(Buffer.byteLength(item)>1024*1024 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(item)) throw Error('Invalid official text output'); outputs.push({text:item,mime:'text/plain',filename:'result.txt'}); return item;}
      if(['voiceId','voice_id','name','description','type','format','rig','label'].includes(key) && item.length<=4096 && !/[\u0000-\u001f]/.test(item)) return item;
      return undefined;
    }
    if(typeof item==='number' && Number.isFinite(item) || typeof item==='boolean' || item===null) return item;
    if(Array.isArray(item)) {if(item.length>128) throw Error('Official output array exceeds limit'); return item.map(child=>visit(child,key,depth+1)??null);}
    if(item && typeof item==='object') {const result={}; for(const [name,child] of Object.entries(item)) {if(['input','param','__proto__','constructor','prototype'].includes(name) || /^original/i.test(name) || /token|cookie|secret|authorization|api.?key/i.test(name)) continue; const next=visit(child,name,depth+1); if(next!==undefined) result[name]=next;} return result;}
  }
  let outputTree=visit(output);
  if(modelId==='minimax-voice' && status==='completed' && !outputs.some(row=>typeof row.text==='string')) {const voice=output.voiceId || output.voice_id || row.voiceId || row.voice_id; if(typeof voice==='string' && /^[A-Za-z0-9 _().-]{1,128}$/.test(voice)) {outputs.push({text:voice,mime:'text/plain',filename:'voice-id.txt'}); outputTree={...outputTree,voiceId:voice,text:voice};}}
  if(model?.outputKinds?.includes('text') && !outputs.length && typeof row.text==='string' && row.text.trim() && Buffer.byteLength(row.text)<=1024*1024 && !/^https?:\/\//i.test(row.text) && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(row.text)) {outputs.push({text:row.text,mime:'text/plain',filename:'result.txt'}); outputTree={...outputTree,text:row.text};}
  if(Buffer.byteLength(JSON.stringify(outputTree||{}))>2*1024*1024) throw Error('Official result metadata exceeds limit');
  const message=[row.error?.message,row.errorMessage,typeof row.error==='string'?row.error:null,row.message].find(value=>typeof value==='string' && value.trim());
  const safeError=message ? message.replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,700) : 'Official generation failed; please inspect the original task';
  return {...(id ? {id} : {}),...(status ? {status} : {}),...(Number.isFinite(row.progress) ? {progress:Math.min(100,Math.max(0,row.progress))} : {}),outputs,outputTree,...(failed ? {error:safeError} : {})};
}
module.exports={normalizeTaskReply};
