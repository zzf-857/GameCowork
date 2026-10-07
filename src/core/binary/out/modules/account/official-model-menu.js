'use strict';
// Presentation comes from the original /api/config/v3 config.models, never
// from a guessed alias table or the unfiltered OpenAI /v1/models directory.
const crypto=require('node:crypto');
const ROLES=new Set(['chat','summarize','apply','edit','embed','rerank']);
function text(value,limit=256){return typeof value==='string'&&value.trim()&&value.length<=limit&&!/[\u0000-\u001f\u007f]/.test(value)?value:undefined;}
function choices(value,numeric=false){if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.options)||value.options.length>32)return undefined;const valid=item=>numeric?Number.isSafeInteger(item)&&item>0&&item<=16777216:!!text(item,64);if(!valid(value.default)||!value.options.length||!value.options.every(valid)||!value.options.includes(value.default))return undefined;return{default:value.default,options:[...value.options]};}
function menuId(model,name){return 'codely-official:'+Buffer.from(model).toString('base64url')+':'+crypto.createHash('sha256').update(name).digest('hex').slice(0,16);}
function projectModelMenu(config,{secrets=[]}={}){
  if(!config||typeof config!=='object'||Array.isArray(config)||!Array.isArray(config.models)||config.models.length>256)throw Error('Official model configuration has no bounded models array');
  const models=[];
  for(const row of config.models){
    if(row&&row.disabled!==undefined&&typeof row.disabled!=='boolean')throw Error('Official builtin disabled must be boolean');
    const name=text(row?.name),model=text(row?.model);if(!name||!model||secrets.some(secret=>secret&&(name.includes(secret)||model.includes(secret))))continue;
    const roles=row.roles===undefined?['chat','summarize','apply','edit']:Array.isArray(row.roles)?row.roles.filter(role=>ROLES.has(role)):[];if(!roles.length)continue;
    const extras={},source=row.extras&&typeof row.extras==='object'&&!Array.isArray(row.extras)?row.extras:{};
    for(const [key,numeric]of [['thinkingEfforts',false],['maxContextLengths',true],['model',false]]){const selected=choices(source[key],numeric);if(selected&&!secrets.some(secret=>secret&&JSON.stringify(selected).includes(secret)))extras[key]=selected;}
    if(text(source.model)&&!secrets.some(secret=>secret&&source.model.includes(secret)))extras.model=source.model;
    const wireOptions=choices(source.wireApi),declaredWire=typeof source.wireApi==='string'?source.wireApi:wireOptions?.default||row.wireApi;
    if(['chat','responses','messages'].includes(declaredWire))extras.wireApi=wireOptions&&wireOptions.options.every(value=>['chat','responses','messages'].includes(value))?wireOptions:declaredWire;
    const capabilities=Array.isArray(row.capabilities)?row.capabilities.filter(value=>['tool_use','image_input'].includes(value)):[];
    const result={name,model,roles:[...roles],disabled:row.disabled===true,officialBuiltin:true,officialModelId:menuId(model,name),extras,capabilities};
    if(name==='Frontier'&&model==='Frontier'){result.disabled=true;result.placeholder=true;}
    const defaults=row.defaultCompletionOptions;
    if(defaults&&typeof defaults==='object'&&!Array.isArray(defaults)){
      const safe={};for(const key of ['contextLength','maxTokens','temperature','topP','topK','frequencyPenalty','presencePenalty'])if(typeof defaults[key]==='number'&&Number.isFinite(defaults[key])&&Math.abs(defaults[key])<=16777216)safe[key]=defaults[key];
      if(Object.keys(safe).length)result.defaultCompletionOptions=safe;
    }
    if(Number.isSafeInteger(row.contextLength)&&row.contextLength>0&&row.contextLength<=16777216)result.contextLength=row.contextLength;
    if(text(row.class_name,128)&&!secrets.some(secret=>secret&&row.class_name.includes(secret)))result.class_name=row.class_name;
    if(typeof row.rate==='number'&&Number.isFinite(row.rate)&&row.rate>=0&&row.rate<=1000000)result.rate=row.rate;
    if(text(row.description,4096)&&!secrets.some(secret=>secret&&row.description.includes(secret)))result.description=row.description;
    if(text(row.logoUrl,2048)&&!secrets.some(secret=>secret&&row.logoUrl.includes(secret))&&!/[?&](?:token|key|signature|auth)=/i.test(row.logoUrl))result.logoUrl=row.logoUrl;
    models.push(result);
  }
  // Original tRi appends this disabled placeholder only if chat models exist.
  if(models.some(row=>row.roles.includes('chat'))&&!models.some(row=>row.name==='Frontier'))models.push({name:'Frontier',model:'Frontier',roles:['chat'],disabled:true,officialBuiltin:true,placeholder:true,officialModelId:menuId('Frontier','Frontier'),description:'The most advanced mystery model.',extras:{},capabilities:[]});
  return models;
}
module.exports={projectModelMenu,menuId};
