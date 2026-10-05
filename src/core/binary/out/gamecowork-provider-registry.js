'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const catalog=require('./gamecowork-provider-catalog.js'),vault=require('./gamecowork-provider-vault.js');
const clone=value=>JSON.parse(JSON.stringify(value));
const EXECUTABLE=new Set(['openai-images','generic-rest-task']);
const PARAMS=new Set(['size','quality','outputFormat','responseFormat','aspectRatio']);
const PROMPT_HINTS=new Set(['resolutionHint','aspectRatioHint']);
const FIELD={size:'size',quality:'quality',outputFormat:'output_format',responseFormat:'response_format',aspectRatio:'aspect_ratio'};
function createProviderRegistry(options) {
  if(!options?.root||!options.assetService)throw Error('Provider Registry requires its own root and Asset Service');
  const root=path.resolve(options.root),asset=options.assetService,seal=options.seal||vault.seal,unseal=options.unseal||vault.unseal,fetcher=options.fetch||globalThis.fetch;
  let state={version:1,providers:{}},closed=false,queue=Promise.resolve();const keys=new Map(),inflight=new Set();
  function checked(name,existing=false) {
    const full=path.resolve(root,name);if(full!==root&&!full.startsWith(root+path.sep))throw Error('Provider storage escaped its owner');
    for(let current=full;;current=path.dirname(current)){if(fs.existsSync(current)){const stat=fs.lstatSync(current);if(stat.isSymbolicLink()||stat.isFile()&&stat.nlink!==1)throw Error('Linked Provider storage is unsupported');}if(path.dirname(current)===current)break;}
    if(existing&&!fs.statSync(full).isFile())throw Error('Provider storage is not a regular file');return full;
  }
  function assert(){if(closed)throw Error('Provider Registry is closed');asset.assertRuntime();}
  function atomic(name,bytes) {
    assert();const destination=checked(name),temporary=checked(name+'.tmp-'+crypto.randomUUID());fs.mkdirSync(path.dirname(destination),{recursive:true,mode:0o700});checked(name);let fd,prepared=false;
    try{fd=fs.openSync(temporary,'wx',0o600);fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;prepared=true;
      for(let attempt=0;;attempt++){assert();checked(name);try{fs.renameSync(temporary,destination);prepared=false;break;}catch(error){if(attempt>=5||!['EPERM','EACCES','EBUSY'].includes(error.code))throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,20);}}
    }finally{if(fd!==undefined)fs.closeSync(fd);if(!prepared&&fs.existsSync(temporary))fs.unlinkSync(checked(path.relative(root,temporary),true));}
  }
  function persist(next){const bytes=Buffer.from(JSON.stringify(next));if(bytes.length>16*1024*1024)throw Error('Provider Registry exceeds 16 MiB');atomic('registry.json',bytes);state=next;}
  function secretForms(extraKey) {return [...new Set([...keys.values(),extraKey].filter(Boolean).flatMap(key=>[key,encodeURIComponent(key)]))];}
  function sanitize(value) {if(typeof value==='string'){for(const key of secretForms())value=value.replaceAll(key,'<redacted>');return value;}if(Array.isArray(value))return value.map(sanitize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([name])=>!name.startsWith('_')).map(([name,item])=>[sanitize(name),sanitize(item)]));return value;}
  function generationAvailable(provider,model){return EXECUTABLE.has(provider.protocol)&&provider.enabled&&provider.catalogReady===true&&(provider.authMode==='none'||!!keys.get(provider.id))&&model.available===true&&['image','video','model','audio'].includes(model.kind)&&model.capabilities.generation?.status!=='unsupported';}
  function publicProvider(provider){const {_revision,_deleted,...result}=provider;return sanitize({...result,...(provider.protocol==='openai-images'?{imageSizePolicyInfo:catalog.imageSizePolicyInfo(provider)}:{}),apiKeyConfigured:!!keys.get(provider.id),generationAvailable:(provider.models||[]).some(model=>generationAvailable(provider,model))});}
  function providerById(id){catalog.identifier(id);const provider=state.providers[id];if(!provider||provider._deleted)throw Error('Custom Provider not found');return provider;}
  function projection(provider) {
    if(!EXECUTABLE.has(provider.protocol))return null;
    const adapter=provider.protocol==='openai-images'?{responseMode:'outputs',create:{method:'POST',path:'/images/generations',bodyType:'json',bodyTemplate:{model:'{{model}}',prompt:'{{prompt}}',n:1}},poll:{method:'GET',path:'/tasks/{{taskId}}'},cancel:null,selectors:{outputs:'data'},outputSelectors:{url:'url',base64:'b64_json',mime:'',filename:''}}:provider.adapter;
    return {id:'managed_'+provider.id,name:provider.name,baseUrl:provider.baseUrl,kinds:provider.kinds,model:provider.defaultModel,enabled:provider.enabled,authMode:provider.authMode,apiKeyHeader:provider.apiKeyHeader,allowInsecureLan:provider.allowInsecureLan,requestTimeoutMs:provider.requestTimeoutMs,adapter};
  }
  function project(provider){const config=projection(provider);if(config)asset.saveManagedProvider(config,()=>keys.get(provider.id)||'',provider.id,provider._revision);else if(state.providers[provider.id]&&EXECUTABLE.has(state.providers[provider.id].protocol))asset.removeManagedProvider(provider.id);}
  function metadataHasSecret(metadata,key){const secrets=secretForms(key);const visit=value=>typeof value==='string'?secrets.some(secret=>value.includes(secret)):Array.isArray(value)?value.some(visit):value&&typeof value==='object'?Object.entries(value).some(([name,item])=>visit(name)||visit(item)):false;return visit(metadata);}
  function credentialRef(provider) {const ref=provider._credentialRef??provider.id+'.vault',escaped=provider.id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(typeof ref!=='string'||!new RegExp('^(?:'+escaped+'\\.vault|credential_'+escaped+'_[a-f0-9-]{36}\\.vault)$').test(ref))throw Error('Invalid Provider credential reference');return ref;}
  function getDescriptors() {
    if(closed)return [];return Object.values(state.providers).filter(provider=>!provider._deleted).flatMap(provider=>(provider.models||[]).map(model=>({id:model.stableStudioId,stableStudioId:model.stableStudioId,providerId:provider.id,upstreamModel:model.id,model:model.id,label:model.label,kind:model.kind,mode:model.kind==='model'?'3d':model.kind,protocol:provider.protocol,...(provider.protocol==='openai-images'?{imageSizePolicy:provider.imageSizePolicy,imageSizePolicyInfo:catalog.imageSizePolicyInfo(provider)}:{}),capabilities:clone(model.capabilities),generationAvailable:generationAvailable(provider,model),available:model.available===true,providerName:provider.name,defaultSelected:provider.defaultModel===model.id})));
  }
  function resolveModel(studioId) {
    if(typeof studioId!=='string'||!/^cust_[a-f0-9]{32}$/.test(studioId))throw Error('Invalid custom model descriptor ID');
    for(const provider of Object.values(state.providers))for(const model of provider.models||[])if(model.stableStudioId===studioId)return {...clone(model),providerId:provider.id,upstreamModel:model.id,protocol:provider.protocol,...(provider.protocol==='openai-images'?{imageSizePolicy:provider.imageSizePolicy,imageSizePolicyInfo:catalog.imageSizePolicyInfo(provider)}:{}),providerName:provider.name,providerDeleted:provider._deleted===true};
    throw Error('Custom model descriptor was not found');
  }
  async function save(data) {
    assert();const raw=data.provider,previous=raw?.id?state.providers[catalog.identifier(raw.id)]:undefined,provider=catalog.normalizeProvider(raw,previous?._deleted?undefined:previous);
    if(Object.keys(state.providers).filter(id=>!state.providers[id]._deleted).length>=64&&!previous)throw Error('Provider limit is 64');
    if(raw.apiKey!==undefined&&(typeof raw.apiKey!=='string'||raw.apiKey.length>8192||/[\u0000-\u001f\u007f]/.test(raw.apiKey)))throw Error('API Key must be bounded non-control text');
    if(raw.clearApiKey!==undefined&&typeof raw.clearApiKey!=='boolean')throw Error('clearApiKey must be boolean');
    const key=raw.clearApiKey===true?'':raw.apiKey||keys.get(provider.id)||'';
    if(metadataHasSecret(provider,key))throw Error('Provider credentials must not appear in metadata');
    const sameEndpoint=previous&&!previous._deleted&&previous.protocol===provider.protocol&&previous.baseUrl===provider.baseUrl&&previous.authMode===provider.authMode&&previous.apiKeyHeader===provider.apiKeyHeader&&keys.get(provider.id)===key;
    const models=previous?.models?.map(model=>({...model,available:sameEndpoint&&model.available===true,kind:provider.kinds.includes(model.kind)?model.kind:provider.kinds[0]}))||[];
    if(provider.defaultModel&&!models.some(model=>model.id===provider.defaultModel))models.push({id:provider.defaultModel,stableStudioId:catalog.studioId(provider.id,provider.defaultModel),label:provider.defaultModel,kind:provider.kinds[0],capabilities:catalog.unknownCapabilities(),available:false});
    Object.assign(provider,{models,catalogReady:sameEndpoint&&previous.catalogReady===true,catalogType:provider.protocol==='comfyui'?'model-files':'models',_revision:crypto.randomUUID(),...(sameEndpoint&&previous.catalogUpdatedTime?{catalogUpdatedTime:previous.catalogUpdatedTime}:{}),...(sameEndpoint&&previous.nodeTypes?{nodeTypes:previous.nodeTypes}:{}),updatedTime:new Date().toISOString()});
    if(metadataHasSecret(provider,key))throw Error('Provider credentials must not appear in metadata');
    const oldKey=keys.get(provider.id),oldRef=previous?credentialRef(previous):undefined,newRef=key&&key===oldKey&&oldRef?oldRef:key?'credential_'+provider.id+'_'+crypto.randomUUID()+'.vault':undefined;
    if(newRef)provider._credentialRef=newRef;
    const sealed=key&&newRef!==oldRef?await seal(Buffer.from(key,'utf8')):undefined;if(sealed&&(!Buffer.isBuffer(sealed)||!sealed.length||sealed.length>1024*1024||sealed.includes(Buffer.from(key))))throw Error('Provider vault did not return protected bounded bytes');
    assert();let newVaultWritten=false;
    try {
      // Immutable vault revision first, then one atomic registry pointer commit.
      // A crash before that commit leaves the old metadata/key pair intact.
      if(sealed){atomic(newRef,sealed);newVaultWritten=true;}keys.set(provider.id,key);
      project(provider);persist({...state,providers:{...state.providers,[provider.id]:provider}});
    }catch(error){if(oldKey===undefined)keys.delete(provider.id);else keys.set(provider.id,oldKey);if(newVaultWritten&&fs.existsSync(checked(newRef)))fs.unlinkSync(checked(newRef,true));if(previous&&!previous._deleted)project(previous);else asset.removeManagedProvider(provider.id);throw error;}
    if(oldRef&&oldRef!==newRef){try{if(fs.existsSync(checked(oldRef)))fs.unlinkSync(checked(oldRef,true));}catch{/* An unused encrypted revision is safer than claiming an already committed save failed. */}}
    return {provider:publicProvider(provider),models:getDescriptors()};
  }
  async function syncModels(data) {
    assert();const provider=providerById(data.providerId);if(!provider.enabled)throw Error('Provider is disabled');const key=keys.get(provider.id)||'';if(provider.authMode!=='none'&&!key)throw Error('Provider API Key is not configured');
    if(inflight.has(provider.id))throw Error('Provider catalog synchronization is already running');inflight.add(provider.id);
    try {const result=await catalog.fetchCatalog(provider,key,fetcher);assert();if(state.providers[provider.id]!==provider)throw Error('Provider changed during catalog synchronization');
      const current=catalog.normalizeModels(result.rows,provider,provider.models);if(current.some(model=>metadataHasSecret(model,key)))throw Error('Provider catalog contained credentials');const currentIds=new Set(current.map(model=>model.id));
      const models=[...current,...(provider.models||[]).filter(model=>!currentIds.has(model.id)).map(model=>({...model,available:false}))];
      const updated={...provider,models,catalogReady:true,catalogUpdatedTime:new Date().toISOString(),...(result.nodeTypes?{nodeTypes:result.nodeTypes}:{}),...(result.catalogType?{catalogType:result.catalogType}:{})};if(metadataHasSecret(updated,key))throw Error('Provider catalog contained credentials');persist({...state,providers:{...state.providers,[provider.id]:updated}});
      return {provider:publicProvider(updated),models:getDescriptors()};
    }catch(error){throw Error(sanitize(error.message||'Provider catalog failed'));}finally{inflight.delete(provider.id);}
  }
  function setCapabilities(data) {
    assert();const provider=providerById(data.providerId),model=provider.models.find(item=>item.id===data.modelId);if(!model)throw Error('Provider model was not found');
    const normalized=catalog.normalizeCapabilities(data.capabilities);if(metadataHasSecret(normalized,keys.get(provider.id)))throw Error('Capability metadata must not contain credentials');
    const merged={...model.capabilities,...Object.fromEntries(Object.keys(data.capabilities).map(name=>[name,normalized[name]]))},updated={...provider,models:provider.models.map(item=>item===model?{...item,capabilities:merged}:item)};
    persist({...state,providers:{...state.providers,[provider.id]:updated}});return {provider:publicProvider(updated),model:resolveModel(model.stableStudioId),models:getDescriptors()};
  }
  function remove(data) {
    assert();const provider=providerById(data.providerId);asset.removeManagedProvider(provider.id);const updated={...provider,enabled:false,_deleted:true,models:provider.models.map(model=>({...model,available:false}))};try{persist({...state,providers:{...state.providers,[provider.id]:updated}});}catch(error){project(provider);throw error;}keys.delete(provider.id);const ref=credentialRef(provider);try{if(fs.existsSync(checked(ref)))fs.unlinkSync(checked(ref,true));}catch{/* Tombstone is committed; an unused encrypted revision does not restore access. */}return {deleted:true,models:getDescriptors()};
  }
  async function create(studioId,payload,workspaceKey,probe) {
    await ready;assert();const model=resolveModel(studioId),provider=providerById(model.providerId);
    if(!generationAvailable(provider,model))throw Error('This custom model has no available generation adapter');
    if(!payload||typeof payload!=='object'||Array.isArray(payload)||Object.keys(payload).some(name=>!['studioModelId','model','prompt',...PARAMS,...PROMPT_HINTS,...(provider.protocol==='generic-rest-task'?['parameters']:[])].includes(name)))throw Error('Custom generation payload has unknown fields');
    if(payload.studioModelId!==studioId||payload.model!==undefined&&payload.model!==model.id)throw Error('Custom image model identity does not match its descriptor');
    if(typeof payload.prompt!=='string'||!payload.prompt.trim()||payload.prompt.length>32000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(payload.prompt))throw Error('Custom image prompt is invalid');
    const parameters={...(provider.protocol==='generic-rest-task'?catalog.bounded(payload.parameters||{},65536):{}),studioModelId:studioId,model:model.id,prompt:payload.prompt};const requestBody={model:'{{model}}',prompt:'{{prompt}}',n:1};
    for(const name of PROMPT_HINTS)if(payload[name]!==undefined){if(model.kind!=='image')throw Error('Resolution/ratio prompt requirements are only supported for image tasks');parameters[name]=payload[name];}
    if(probe&&(!probe||typeof probe!=='object'||Array.isArray(probe)||Object.keys(probe).some(name=>!PARAMS.has(name))))throw Error('Unsupported private image probe parameter');
    const supplied={...Object.fromEntries([...PARAMS].filter(name=>payload[name]!==undefined).map(name=>[name,payload[name]])),...(probe||{})};
    const useOpenaiSize=provider.protocol==='openai-images'&&provider.imageSizePolicy==='openai-size';
    const minimumPixels=catalog.isXcaiImageProvider(provider)?655360:0;
    const hintedSize=useOpenaiSize&&parameters.resolutionHint!==undefined&&parameters.resolutionHint!=='auto'?catalog.imageResolution(parameters.resolutionHint,minimumPixels):undefined;
    if(!probe&&useOpenaiSize&&(hintedSize||supplied.size!==undefined)&&model.capabilities.size?.status==='unsupported')throw Error('该模型已标记不支持接口尺寸参数，请切换提示词策略或修改模型配置');
    if(hintedSize&&supplied.size!==undefined&&supplied.size!==hintedSize.value)throw Error('OpenAI Images size and resolution target conflict');
    for(const [name,value] of Object.entries(supplied)) {
      if(typeof value!=='string'||!value||value.length>128||/[\u0000-\u001f\u007f]/.test(value))throw Error('Invalid custom image parameter');
      const capability=model.capabilities[name==='responseFormat'?'outputFormat':name];
      const policySize=useOpenaiSize&&name==='size'&&value!=='auto';if(policySize)catalog.imageResolution(value,minimumPixels);
      if(!probe&&!policySize&&(capability?.status!=='supported'||!capability.choices.includes(value)))throw Error('Custom image parameter is unknown, unsupported or outside declared choices: '+name);
      parameters[name]=value;requestBody[useOpenaiSize&&name==='size'?'size':capability?.requestField||FIELD[name]]='{{parameters.'+name+'}}';
    }
    if(hintedSize){parameters.size=hintedSize.value;requestBody.size='{{parameters.size}}';}
    const prompt=payload.prompt;
    if(metadataHasSecret(parameters,keys.get(provider.id)))throw Error('Credentials must not appear in image parameters');
    const requestPrompt=model.kind==='image'?catalog.composeImagePrompt(prompt,parameters,{imageSizePolicy:provider.imageSizePolicy}):undefined;
    if(requestPrompt!==undefined&&provider.protocol==='generic-rest-task') {
      const promptBound=value=>typeof value==='string'?/\{\{(?:prompt|parameters(?:\.prompt)?)\}\}/.test(value):Array.isArray(value)?value.some(promptBound):value&&typeof value==='object'?Object.values(value).some(promptBound):false;
      if(!promptBound(provider.adapter.create?.bodyTemplate))throw Error('Generic image adapter must send the task prompt through a supported template variable');
    }
    return asset.createManagedTask({providerId:'managed_'+provider.id,kind:model.kind,model:model.id,prompt,parameters,workspaceKey}, {studioId,...(requestPrompt!==undefined?{requestPrompt}:{}),...(provider.protocol==='openai-images'?{createSpec:{method:'POST',path:'/images/generations',bodyType:'json',bodyTemplate:requestBody}}:{})});
  }
  checked('');fs.mkdirSync(root,{recursive:true,mode:0o700});const file=checked('registry.json');if(fs.existsSync(file)){if(fs.statSync(checked('registry.json',true)).size>16*1024*1024)throw Error('Provider Registry exceeds 16 MiB');const stored=JSON.parse(fs.readFileSync(file));if(stored.version!==1||!stored.providers||typeof stored.providers!=='object'||Array.isArray(stored.providers))throw Error('Unsupported Provider Registry state');state=stored;}
  const ready=(async()=>{for(const [id,record] of Object.entries(state.providers)){catalog.identifier(id);if(record.id!==id)throw Error('Provider persisted identity mismatch');const normalized=catalog.normalizeProvider(record);if(!Array.isArray(record.models)||record.models.length>4096||typeof record._revision!=='string'||record._revision.length>128)throw Error('Invalid persisted Provider models/revision');
      const seen=new Set();const models=record.models.map(model=>{catalog.string(model.id,'model ID',256,true);if(model.stableStudioId!==catalog.studioId(id,model.id)||seen.has(model.id)||!normalized.kinds.includes(model.kind))throw Error('Provider persisted model identity mismatch');seen.add(model.id);return {id:model.id,label:catalog.string(model.label,'model label',256,true),stableStudioId:model.stableStudioId,kind:model.kind,available:model.available===true,capabilities:catalog.normalizeCapabilities(model.capabilities)};});
      const provider={...normalized,models,_revision:record._revision,_deleted:record._deleted===true,catalogReady:record.catalogReady===true,catalogType:record.protocol==='comfyui'?'model-files':'models',...(record._credentialRef?{_credentialRef:record._credentialRef}:{}),...(record.catalogUpdatedTime?{catalogUpdatedTime:catalog.string(record.catalogUpdatedTime,'catalog timestamp',128)}:{}),...(record.nodeTypes?{nodeTypes:catalog.bounded(record.nodeTypes,1024*1024)}:{})};state.providers[id]=provider;
      const secretFile=checked(credentialRef(provider));let key='';if(!record._deleted&&fs.existsSync(secretFile)){const stat=fs.statSync(checked(credentialRef(provider),true));if(stat.size>1024*1024)throw Error('Provider vault exceeds its byte budget');const bytes=await unseal(fs.readFileSync(secretFile));if(!Buffer.isBuffer(bytes)||bytes.length>8192)throw Error('Invalid Provider vault plaintext');key=new TextDecoder('utf-8',{fatal:true}).decode(bytes);catalog.string(key,'API Key',8192,true);}
      if(metadataHasSecret(provider,key))throw Error('Provider stored metadata contains credentials');keys.set(id,key);if(!provider._deleted)project(provider);
    }for(const provider of Object.values(state.providers))if(metadataHasSecret(provider))throw Error('Provider stored metadata contains credentials');})();ready.catch(()=>{});
  async function dispatch(operation,data={}) {await ready;assert();if(operation==='list')return {providers:Object.values(state.providers).filter(provider=>!provider._deleted).map(publicProvider),models:getDescriptors()};if(operation==='syncModels')return syncModels(data);
    const manualData=operation==='setModelCapabilities'?{...data,capabilities:Object.fromEntries(Object.entries(data.capabilities||{}).map(([name,item])=>[name,{...item,evidence:item?.status==='unknown'?'unknown':'manual'}]))}:data;
    const action=()=>operation==='save'?save(data):operation==='delete'?remove(data):operation==='setModelCapabilities'?setCapabilities(manualData):Promise.reject(Error('Unknown Provider Registry operation'));
    const pending=queue.then(action,action);queue=pending.catch(()=>{});return pending;
  }
  return {ready,dispatch,modelDescriptors:getDescriptors,resolveModel,async recordModelCapabilities(data){await ready;assert();return setCapabilities(data);},createGenerationTask:(id,payload,workspaceKey)=>create(id,payload,workspaceKey),createImageTask:(id,payload,workspaceKey)=>create(id,payload,workspaceKey),createImageTaskFromProbe:(id,payload,workspaceKey,probeParameters)=>create(id,payload,workspaceKey,probeParameters),async close(){await ready.catch(()=>{});closed=true;keys.clear();},root};
}
module.exports={createProviderRegistry};
