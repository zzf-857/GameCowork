// Owned Provider configuration UI inside the original Quick client's dialog.
// Credentials are write-only form values, never browser storage or API replies.
import { gamecoworkCapabilitySummary } from './local-models.js';

export const gamecoworkProviderProtocols=Object.freeze([
  {id:'openai-images',label:'OpenAI 图片接口',kinds:['image'],note:'通过图片 API 执行；可用参数由每个模型的证据决定。'},
  {id:'openai-chat',label:'OpenAI 聊天接口',kinds:['chat'],note:'保存配置和读取模型目录；聊天执行适配尚未接入。'},
  {id:'openai-responses',label:'OpenAI Responses 接口',kinds:['chat'],note:'保存配置和读取模型目录；Responses 执行适配尚未接入。'},
  {id:'generic-rest-task',label:'通用 REST 异步任务',kinds:['image','video','model','audio'],note:'通用任务创建 / 轮询可配置；非图片的原 Quick 生成入口尚未接入。'},
  {id:'ollama',label:'本地 Ollama',kinds:['chat'],note:'读取本地模型目录；聊天执行尚未接入。'},
  {id:'comfyui',label:'本地 ComfyUI 工作流',kinds:['image','video'],note:'保存 API 格式工作流与节点映射、检查本地服务；工作流执行尚未接入。'},
]);
const protocolById=id=>gamecoworkProviderProtocols.find(row=>row.id===id);
const emptyForm=()=>({id:'',name:'',baseUrl:'',protocol:'openai-images',kinds:['image'],authMode:'bearer',apiKey:'',apiKeyHeader:'X-API-Key',defaultModel:'',imageSizePolicy:'default',allowInsecureLan:false,enabled:true,requestTimeoutSeconds:120,adapterText:'',workflowText:'',clearApiKey:false});
export function gamecoworkProviderForm(provider) {
  if(!provider) return emptyForm();
  return {...emptyForm(),id:provider.id||'',name:provider.name||'',baseUrl:provider.baseUrl||'',protocol:provider.protocol||'openai-images',kinds:provider.kinds||['image'],authMode:provider.authMode||'bearer',apiKeyHeader:provider.apiKeyHeader||'X-API-Key',defaultModel:provider.defaultModel||'',imageSizePolicy:provider.imageSizePolicy||'default',allowInsecureLan:provider.allowInsecureLan===true,enabled:provider.enabled!==false,requestTimeoutSeconds:(provider.requestTimeoutMs||120000)/1000,adapterText:provider.adapter?JSON.stringify(provider.adapter,null,2):'',workflowText:provider.workflow?JSON.stringify(provider.workflow,null,2):''};
}
export function gamecoworkProviderSaveBody(form) {
  const protocol=protocolById(form.protocol); if(!protocol) throw Error('请选择已支持的配置协议');
  const provider={name:form.name.trim(),baseUrl:form.baseUrl.trim(),protocol:form.protocol,kinds:form.kinds.filter(kind=>protocol.kinds.includes(kind)),authMode:form.authMode,defaultModel:form.defaultModel.trim(),allowInsecureLan:form.allowInsecureLan===true,enabled:form.enabled!==false,requestTimeoutMs:Number(form.requestTimeoutSeconds)*1000};
  if(!Number.isInteger(provider.requestTimeoutMs)||provider.requestTimeoutMs<1000||provider.requestTimeoutMs>600000) throw Error('请求超时须为 1 至 600 秒');
  if(!provider.name||!provider.baseUrl) throw Error('请填写名称和接口地址');
  const url=new URL(provider.baseUrl);
  if(url.username||url.password||url.hash||url.search) throw Error('接口地址不能包含凭据、查询串或片段');
  if(!['https:','http:'].includes(url.protocol)) throw Error('请输入 HTTP 或 HTTPS 接口地址');
  const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if(url.protocol==='http:'&&!form.allowInsecureLan) throw Error('HTTP 本地或局域网服务需显式勾选授权');
  if(['ollama','comfyui'].includes(form.protocol)&&!local) throw Error('本地协议只接受明确的 localhost 地址');
  if(!provider.kinds.length) throw Error('请选择至少一种用途');
  if(form.protocol==='openai-images') {
    if(['prompt-only','openai-size'].includes(form.imageSizePolicy))provider.imageSizePolicy=form.imageSizePolicy;
    else if(form.id&&form.imageSizePolicy==='default')provider.imageSizePolicy=url.origin==='https://xcai.pro'&&url.pathname.replace(/\/+$/,'')==='/v1'?'openai-size':'prompt-only';
  }
  if(form.id) provider.id=form.id;
  if(form.apiKey) provider.apiKey=form.apiKey;
  if(form.clearApiKey) provider.clearApiKey=true;
  if(form.authMode==='header') provider.apiKeyHeader=form.apiKeyHeader.trim();
  for(const [field,text] of [['adapter',form.adapterText],['workflow',form.workflowText]]) if(text.trim()) {
    const value=JSON.parse(text); if(value===null||typeof value!=='object'||Array.isArray(value)) throw Error('高级配置必须是 JSON 对象'); provider[field]=value;
  }
  return {provider};
}
export async function gamecoworkProviderRequest(path,{method='GET',body,signal,fetcher=globalThis.fetch}={}) {
  if(!/^\/local\/providers(?:\/[^?#\\]+)?(?:\?[^#\\]*)?$/.test(path)) throw Error('Provider 管理仅可访问本机接口');
  const reply=await fetcher('/api/codely-generator'+path,{method,credentials:'omit',redirect:'error',cache:'no-store',signal,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
  const value=await reply.json();
  if(!reply.ok) throw Error(typeof value?.error==='string'?value.error:'Provider 操作失败');
  return value;
}
export function gamecoworkProviderOptions(readiness) {
  const rows=[{id:'cpa',name:'CPA',count:4}];
  for(const model of readiness?.providerDescriptors||[]) {
    if(!model.gamecoworkCustomProvider) continue;
    let row=rows.find(value=>value.id===model.providerId);
    if(!row) {row={id:model.providerId,name:model.providerName||model.providerId,count:0};rows.push(row);}
    row.count++;
  }
  return rows;
}
const capFields=[['size','输出尺寸'],['quality','质量档位'],['outputFormat','输出格式'],['aspectRatio','构图比例'],['references','参考图'],['upscale','独立超分']];
export function gamecoworkManualCapabilities(form) {
  const result={};
  for(const [field] of capFields) {
    if(form[field]?.dirty===false) continue;
    const status=form[field]?.status||'unknown',choices=(form[field]?.choicesText||'').split(/[\n,，]/).map(value=>value.trim()).filter(Boolean);
    result[field]={status,evidence:status==='unknown'?'unknown':'manual',...(status==='supported'?{choices:[...new Set(choices)]}:{}),...(form[field]?.source?{source:form[field].source.trim()}:{})};
  }
  return result;
}
export function GameCoworkProviderControls({React,Dialog,Popover,PopoverTrigger,PopoverContent,Chevron,readiness,selectedProvider,onSelect,onChanged}) {
  const h=React.createElement,[open,setOpen]=React.useState(false),[pickerOpen,setPickerOpen]=React.useState(false),[policyOpen,setPolicyOpen]=React.useState(false),[providers,setProviders]=React.useState([]),[form,setForm]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),[notice,setNotice]=React.useState(''),[modelForm,setModelForm]=React.useState(null);
  const request=React.useRef(null),alive=React.useRef(true);
  React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;request.current?.abort();}},[]);
  const load=async()=>{const value=await gamecoworkProviderRequest('/local/providers',{signal:request.current?.signal});if(alive.current)setProviders(Array.isArray(value.providers)?value.providers:[]);};
  const run=async action=>{if(busy)return;setBusy(true);setError('');request.current=new AbortController();try{await action();}catch(reason){if(alive.current&&reason?.name!=='AbortError')setError(reason.message||'Provider 操作失败');}finally{if(alive.current)setBusy(false);}};
  React.useEffect(()=>{void run(load);},[]);
  const show=()=>{setOpen(true);setForm(null);setModelForm(null);setNotice('');void run(load);};
  const close=()=>{if(policyOpen){setPolicyOpen(false);return;}if(busy)return;setForm(null);setModelForm(null);setOpen(false);setError('');};
  const changed=async()=>{await load();await onChanged();};
  const save=event=>{event.preventDefault();void run(async()=>{await gamecoworkProviderRequest('/local/providers',{method:'POST',body:gamecoworkProviderSaveBody(form),signal:request.current.signal});setForm(null);setNotice('配置已保存；密钥仅保存于本机 Core。请读取目录后选择模型。');await changed();});};
  const sync=provider=>void run(async()=>{await gamecoworkProviderRequest('/local/providers/'+encodeURIComponent(provider.id)+'/sync-models',{method:'POST',body:{},signal:request.current.signal});setNotice('连接检查完成；仅请求模型目录，没有发起生成。');await changed();});
  const remove=provider=>void run(async()=>{await gamecoworkProviderRequest('/local/providers/'+encodeURIComponent(provider.id),{method:'DELETE',signal:request.current.signal});setNotice('配置已删除，已有历史和项目文件保留。');await changed();});
  const set=(key,value)=>setForm(old=>({...old,[key]:value}));
  const input=(label,key,{type='text',...props}={})=>h('label',{className:'gamecowork-provider-field'},h('span',null,label),h('input',{...props,type,value:form[key],disabled:busy,onChange:event=>set(key,event.target.value),autoComplete:type==='password'?'new-password':'off'}));
  const select=(label,key,options)=>h('label',{className:'gamecowork-provider-field'},h('span',null,label),h('select',{value:form[key],disabled:busy,onChange:event=>{const value=event.target.value;setForm(old=>({...old,[key]:value,...(key==='protocol'?{kinds:protocolById(value).kinds,authMode:['ollama','comfyui'].includes(value)?'none':old.authMode}:{} )}));}},options.map(row=>h('option',{value:row.id,key:row.id},row.label))));
  const button=(label,action,props={})=>h('button',{type:'button',className:'generation-tag-button',disabled:busy,onClick:action,...props},label);
  const sizePolicies=[{id:'default',label:'按服务默认'},{id:'prompt-only',label:'仅提示词规格'},{id:'openai-size',label:'同时发送标准 size 参数和提示词'}];
  const sizePolicyPicker=()=>h('div',{className:'gamecowork-provider-field'},h('span',null,'尺寸参数发送策略'),h(Popover,{open:policyOpen,onOpenChange:setPolicyOpen},h(PopoverTrigger,{asChild:true},h('button',{type:'button',className:'studio-model-select','aria-label':'尺寸参数发送策略',disabled:busy},h('strong',null,sizePolicies.find(row=>row.id===form.imageSizePolicy)?.label||'按服务默认'),h(Chevron,{size:14}))),h(PopoverContent,{align:'start',mobileTitle:'尺寸参数发送策略',className:'studio-popover gamecowork-provider-policy-popover',onEscapeKeyDown:event=>{event.preventDefault();event.stopPropagation();setPolicyOpen(false);}},h('div',{role:'group','aria-label':'选择尺寸参数发送策略'},sizePolicies.map(row=>h('button',{key:row.id,type:'button',className:'studio-pop-item'+(form.imageSizePolicy===row.id?' is-active':''),'aria-pressed':form.imageSizePolicy===row.id,onClick:()=>{set('imageSizePolicy',row.id);setPolicyOpen(false);}},row.label))))),h('small',null,'标准 size 仅是请求发送策略，不表示上游已兑现像素，也不开放未知质量档位；其他服务可保留仅提示词。'));
  const options=gamecoworkProviderOptions(readiness).map(row=>({...row,name:providers.find(provider=>provider.id===row.id)?.name||row.name}));
  if(!options.some(row=>row.id===selectedProvider))options.push({id:selectedProvider,name:'原 Provider 当前不可用',count:0});
  const currentProvider=providers.find(provider=>provider.id===form?.id);
  let content;
  if(modelForm) {
    const {provider,model,values}=modelForm;
    content=h('form',{onSubmit:event=>{event.preventDefault();void run(async()=>{const capabilities=gamecoworkManualCapabilities(values);if(!Object.keys(capabilities).length)throw Error('尚未修改能力配置');await gamecoworkProviderRequest('/local/providers/'+encodeURIComponent(provider.id)+'/model-capabilities',{method:'PUT',body:{modelId:model.id,capabilities},signal:request.current.signal});setModelForm(null);setNotice('已保存手动能力配置；手动声明不是实测结果。');await changed();});}},h('h3',null,model.label||model.id),h('p',{role:'note'},'仅填写该模型实际支持的参数。手动配置将明确标为未验证；未知参数不会显示可操作按钮。'),...capFields.map(([field,label])=>h('fieldset',{key:field,className:'gamecowork-provider-cap'},h('legend',null,label),h('small',null,gamecoworkCapabilitySummary(model.capabilities?.[field])),h('select',{'aria-label':label+'支持状态',value:values[field]?.status||'unknown',disabled:busy,onChange:event=>setModelForm(old=>({...old,values:{...old.values,[field]:{...old.values[field],status:event.target.value,dirty:true}}}))},...['unknown','supported','unsupported'].map(value=>h('option',{value,key:value},{unknown:'未知',supported:'手动声明支持',unsupported:'手动声明不支持'}[value]))),values[field]?.status==='supported'&&h('input',{'aria-label':label+'选项',value:values[field]?.choicesText||'',placeholder:field==='upscale'?'倍率（仅能力记录）':'每项用逗号分隔',disabled:busy,onChange:event=>setModelForm(old=>({...old,values:{...old.values,[field]:{...old.values[field],choicesText:event.target.value,dirty:true}}}))}))),h('footer',null,button('返回',()=>setModelForm(null)),h('button',{type:'submit',className:'generation-tag-button',disabled:busy},'保存手动配置')));
  } else if(form) {
    const protocol=protocolById(form.protocol);
    content=h('form',{onSubmit:save},input('名称','name',{maxLength:100}),input('接口地址','baseUrl',{placeholder:'https://example.com/v1',maxLength:500}),select('协议','protocol',gamecoworkProviderProtocols),h('p',{role:'note'},protocol.note),form.protocol==='openai-images'&&sizePolicyPicker(),h('div',{className:'gamecowork-provider-kinds'},...protocol.kinds.map(kind=>h('label',{key:kind},h('input',{type:'checkbox',checked:form.kinds.includes(kind),disabled:busy,onChange:event=>set('kinds',event.target.checked?[...form.kinds,kind]:form.kinds.filter(value=>value!==kind))}),{image:'图片',video:'视频',chat:'大模型',model:'3D',audio:'音频'}[kind]))),select('认证','authMode',[{id:'none',label:'无需认证'},{id:'bearer',label:'Bearer Key'},{id:'header',label:'自定义请求头'}]),form.authMode==='header'&&input('密钥请求头名称','apiKeyHeader',{maxLength:100}),form.authMode!=='none'&&input(currentProvider?.apiKeyConfigured?'密钥（已保存，留空保留）':'密钥','apiKey',{type:'password',maxLength:4096}),currentProvider?.apiKeyConfigured&&h('label',null,h('input',{type:'checkbox',checked:form.clearApiKey,disabled:busy,onChange:event=>set('clearApiKey',event.target.checked)}),'清除已保存密钥'),h('label',{className:'gamecowork-provider-field'},h('span',null,'默认模型'),h('select',{value:form.defaultModel,disabled:busy,onChange:event=>set('defaultModel',event.target.value)},h('option',{value:''},'未选择'),...(currentProvider?.models||[]).map(model=>h('option',{key:model.id,value:model.id},model.label||model.id)))),input('请求超时（秒）','requestTimeoutSeconds',{type:'number',min:1,max:600,step:1}),h('label',null,h('input',{type:'checkbox',checked:form.enabled,disabled:busy,onChange:event=>set('enabled',event.target.checked)}),'启用 Provider'),h('label',null,h('input',{type:'checkbox',checked:form.allowInsecureLan,disabled:busy,onChange:event=>set('allowInsecureLan',event.target.checked)}),'明确授权访问填写的 HTTP 本地 / 局域网服务'),['generic-rest-task','comfyui'].includes(form.protocol)&&h('label',{className:'gamecowork-provider-field'},h('span',null,form.protocol==='comfyui'?'ComfyUI API 工作流与参数节点映射 JSON':'REST 创建 / 轮询 / 输出字段配置 JSON'),h('textarea',{value:form.protocol==='comfyui'?form.workflowText:form.adapterText,rows:7,disabled:busy,onChange:event=>set(form.protocol==='comfyui'?'workflowText':'adapterText',event.target.value),placeholder:form.protocol==='comfyui'?'{"graph":{"6":{"class_type":"CLIPTextEncode","inputs":{"text":""}}},"bindings":{"prompt":{"nodeId":"6","input":"text"}}}（仅格式示例，须填完整导出工作流；执行尚未接入）':'请按服务文档填写；不会自动猜测接口'})),h('footer',null,button('返回',()=>setForm(null)),h('button',{type:'submit',className:'generation-tag-button',disabled:busy},'保存')));
  } else {
    content=h('div',null,h('p',{role:'note'},'连接检查只读取目录，不生成内容。各模型的档位、尺寸与独立超分分别记录证据；未知能力不会当作可用按钮。'),button('添加 Provider',()=>setForm(emptyForm())),...providers.map(provider=>h('section',{key:provider.id,className:'gamecowork-provider-card'},h('h3',null,provider.name),h('small',null,provider.protocol+' · '+provider.baseUrl+' · '+(provider.apiKeyConfigured?'密钥已保存':'无已保存密钥')),h('div',{className:'gamecowork-provider-actions'},button('编辑',()=>setForm(gamecoworkProviderForm(provider))),button('读取模型 / 测试连接',()=>sync(provider)),button('删除',()=>remove(provider))),h('details',null,h('summary',null,`模型目录（${provider.models?.length||0}）`),...(provider.models||[]).map(model=>h('article',{key:model.id,className:'gamecowork-provider-model'},h('strong',null,model.label||model.id),h('small',null,provider.generationAvailable===true&&model.available===true&&model.kind==='image'?'图片生成已接线；实际能力以证据为准':model.kind==='image'?'目录已读取；当前图片入口或配置未就绪':'目录已读取；该用途的原 Quick 入口尚未接入'),...capFields.map(([field,label])=>h('div',{key:field},label+'：'+gamecoworkCapabilitySummary(model.capabilities?.[field]))),button('手动配置能力',()=>setModelForm({provider,model,values:Object.fromEntries(capFields.map(([field])=>[field,{status:model.capabilities?.[field]?.status||'unknown',choicesText:(model.capabilities?.[field]?.choices||[]).join(', '),source:model.capabilities?.[field]?.source||'',dirty:false}]))}))))))),h('footer',null,button('关闭',close)));
  }
  return h(React.Fragment,null,h('style',null,'.gamecowork-provider-policy-popover{z-index:1251!important;pointer-events:auto}.gamecowork-provider-manager{max-height:70vh;overflow:auto;color:var(--studio-text);color-scheme:inherit}.gamecowork-provider-manager option{background:var(--studio-surface-strong);color:var(--studio-text)}.gamecowork-provider-capability-note{max-width:420px;white-space:normal;font-size:11px;color:var(--studio-text-muted);line-height:1.4}.gamecowork-provider-field{display:flex;flex-direction:column;gap:6px;margin:12px 0}.gamecowork-provider-field input,.gamecowork-provider-field select,.gamecowork-provider-field textarea,.gamecowork-provider-cap input,.gamecowork-provider-cap select{padding:8px;border:1px solid var(--studio-border-strong);border-radius:7px;background:var(--studio-surface-strong);color:var(--studio-text);color-scheme:inherit}.gamecowork-provider-card{padding:14px 0;border-bottom:1px solid var(--studio-border)}.gamecowork-provider-card small,.gamecowork-provider-model small{display:block;color:var(--studio-text-muted)}.gamecowork-provider-actions, .gamecowork-provider-kinds{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.gamecowork-provider-model{margin:12px 0}.gamecowork-provider-cap{margin:8px 0;border:1px solid var(--studio-border);padding:8px}.gamecowork-provider-cap small{display:block}.gamecowork-provider-model div{font-size:12px;color:var(--studio-text-secondary)}.gamecowork-provider-selector{max-width:200px}.gamecowork-provider-selector strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gamecowork-provider-manager footer{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}'),h(Popover,{open:pickerOpen,onOpenChange:setPickerOpen},h(PopoverTrigger,{asChild:true},h('button',{type:'button',className:'studio-model-select gamecowork-provider-selector','aria-label':'第三方 Provider'},h('strong',null,options.find(row=>row.id===selectedProvider)?.name||'选择 Provider'),h(Chevron,{size:14}))),h(PopoverContent,{align:'start',mobileTitle:'选择第三方 Provider',className:'studio-popover gamecowork-provider-popover'},h('div',{role:'group','aria-label':'选择第三方 Provider'},options.map(row=>h('button',{type:'button',className:'studio-pop-item'+(row.id===selectedProvider?' is-active':''),'aria-pressed':row.id===selectedProvider,key:row.id,onClick:()=>{onSelect(row.id);setPickerOpen(false);}},row.name))))),button('管理 Provider',show,{className:'generation-tag-button gamecowork-provider-manage-button'}),open&&h(Dialog,{title:'自定义 Provider',description:'图片、视频、大模型与本地服务的独立配置；不会改变 Codely 官方权益。',wide:true,busy,onClose:close},h('div',{className:'gamecowork-provider-manager'},error&&h('p',{role:'alert'},error),notice&&h('p',{role:'status'},notice),content)));
}
