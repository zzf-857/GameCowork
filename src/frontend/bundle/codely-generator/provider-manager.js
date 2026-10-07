// Owned Provider configuration UI inside the original Quick client's dialog.
// Credentials are write-only form values, never browser storage or API replies.
import { gamecoworkCapabilitySummary, gamecoworkImageFormatLabel, gamecoworkCustomImagePixelChanges, gamecoworkMediaPrecisionSummary } from './local-models.js';

export const gamecoworkProviderProtocols=Object.freeze([
  {id:'openai-images',label:'OpenAI 图片接口',kinds:['image'],note:'通过图片 API 执行；可用参数由每个模型的证据决定。'},
  {id:'openai-chat',label:'OpenAI 聊天接口',kinds:['chat'],note:'保存配置和读取模型目录；聊天执行适配尚未接入。'},
  {id:'openai-responses',label:'OpenAI Responses 接口',kinds:['chat'],note:'保存配置和读取模型目录；Responses 执行适配尚未接入。'},
  {id:'generic-rest-task',label:'通用 REST 异步任务',kinds:['image','video','model','audio'],note:'图片、视频、音频及 3D 任务可按服务文档配置创建、轮询和输出映射；生成参数必须由请求模板实际发送。'},
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
export const gamecoworkCapabilityRequestFields=Object.freeze({size:Object.freeze(['size','resolution','image_size','size_preset']),quality:Object.freeze(['quality','quality_level']),outputFormat:Object.freeze(['output_format','format','response_format']),aspectRatio:Object.freeze(['aspect_ratio','ratio'])});
export function gamecoworkManualCapabilityForm(capabilities={}) {
  return Object.fromEntries(capFields.map(([field])=>[field,{status:capabilities[field]?.status||'unknown',choicesText:(capabilities[field]?.choices||[]).join(', '),source:capabilities[field]?.source||'',...(capabilities[field]?.requestField?{requestField:capabilities[field].requestField}:{}),dirty:false}]));
}
export function GameCoworkRestParameterInput({React,model,value,onChange}) {
  if (model?.protocol !== 'generic-rest-task') return null;
  const h=React.createElement;
  return h('label',{className:'gamecowork-rest-parameters',style:{display:'block',width:'100%',margin:'8px 0'}},
    h('span',null,({video:'视频',audio:'音频',model:'3D',image:'图片'}[model.kind]||'生成')+'服务参数'),
    h('textarea',{'aria-label':'服务生成参数 JSON',value,rows:3,spellCheck:false,onChange:event=>onChange(event.target.value),style:{display:'block',width:'100%',resize:'vertical',background:'var(--studio-surface-strong)',color:'var(--studio-text)',border:'1px solid var(--studio-border)',borderRadius:6,padding:8}}),
    h('small',{role:'note'},'按服务文档填写 JSON，例如视频的尺寸、比例和时长。字段须在 Provider 请求模板中映射；未映射时会阻止提交。请勿填写密钥。'));
}
export function GameCoworkImagePixelInputs({React,model,resolution,onChange}) {
  const match=/^(\d+)x(\d+)$/.exec(resolution||''),width=match?Number(match[1]):1024,height=match?Number(match[2]):1024;
  const api=model?.imageSizePolicy==='openai-size',h=React.createElement;
  const change=size=>Object.entries(gamecoworkCustomImagePixelChanges(model,size)).forEach(([field,value])=>onChange(field,value));
  return h('div',null,h('div',{className:'studio-pop-custom'},h('input',{type:'number',min:16,max:3840,step:16,'aria-label':api?'接口请求宽度':'提示词目标宽度',value:width,onChange:event=>change(Number(event.target.value)+'x'+height)}),h('b',null,'×'),h('input',{type:'number',min:16,max:3840,step:16,'aria-label':api?'接口请求高度':'提示词目标高度',value:height,onChange:event=>change(width+'x'+Number(event.target.value))})),h('small',{role:'note'},api?'明确提交具体请求像素；边长为 16 的倍数、最多 3840，总像素最多 8294400，长短边比最多 3。实际文件必须生成后核验。':'仅追加目标像素到提示词，不保证实际输出；输入宽高后由像素决定精确比例。'));
}
export function GameCoworkMediaPrecisionBadge({React,task}) {
  const summary=gamecoworkMediaPrecisionSummary(task);if(!summary)return null;
  const tone=summary.precision==='mismatch'?'var(--studio-text)': 'var(--studio-text-muted)';
  return React.createElement('small',{className:'gamecowork-media-precision-summary','data-media-precision':summary.precision,'aria-label':'生成文件尺寸与比例核验',title:summary.detail,style:{display:'block',fontSize:11,lineHeight:1.4,color:tone,whiteSpace:'normal',padding:'0 10px 10px'}},summary.text);
}
export function gamecoworkManualCapabilities(form) {
  const result={};
  for(const [field] of capFields) {
    if(form[field]?.dirty===false) continue;
    const status=form[field]?.status||'unknown',choices=(form[field]?.choicesText||'').split(/[\n,，]/).map(value=>value.trim()).filter(Boolean);
    const requestField=form[field]?.requestField;
    if(requestField!==undefined&&!gamecoworkCapabilityRequestFields[field]?.includes(requestField))throw Error('请选择该能力有效的上游参数字段');
    if(field==='outputFormat'&&status==='supported'&&choices.some(value=>!(requestField==='response_format'?['url','b64_json']:['png','jpeg','webp']).includes(value)))throw Error(requestField==='response_format'?'图片返回方式仅接受 url 或 b64_json；它不改变图片编码':'图片文件格式仅接受 png、jpeg 或 webp；URL/Base64 请选择 response_format 返回方式');
    result[field]={status,evidence:status==='unknown'?'unknown':'manual',...(status==='supported'?{choices:[...new Set(choices)]}:{}),...(form[field]?.source?{source:form[field].source.trim()}:{}),...(requestField!==undefined?{requestField}:{})};
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
  const capabilityEditor=([field,label])=>{
    const value=modelForm.values[field]||{},requestFields=gamecoworkCapabilityRequestFields[field],requestField=value.requestField||requestFields?.[0];
    const shownLabel=field==='outputFormat'?gamecoworkImageFormatLabel({requestField}):label;
    const update=change=>setModelForm(old=>({...old,values:{...old.values,[field]:{...old.values[field],...change,dirty:true}}}));
    return h('fieldset',{key:field,className:'gamecowork-provider-cap'},h('legend',null,shownLabel),h('small',null,gamecoworkCapabilitySummary(modelForm.model.capabilities?.[field])),
      requestFields&&h('label',null,h('span',null,'按服务文档选择上游参数字段'),h('select',{'aria-label':shownLabel+'上游字段',value:requestField,disabled:busy,onChange:event=>update({requestField:event.target.value})},...requestFields.map(name=>h('option',{key:name,value:name},name==='response_format'?'response_format（URL / Base64 返回）':name==='output_format'||name==='format'?name+'（图片编码格式）':name)))),
      h('select',{'aria-label':shownLabel+'支持状态',value:value.status||'unknown',disabled:busy,onChange:event=>update({status:event.target.value})},...['unknown','supported','unsupported'].map(status=>h('option',{value:status,key:status},{unknown:'未知',supported:'手动声明支持',unsupported:'手动声明不支持'}[status]))),
      value.status==='supported'&&h('input',{'aria-label':shownLabel+'选项',value:value.choicesText||'',placeholder:field==='upscale'?'倍率（仅能力记录）':field==='outputFormat'?requestField==='response_format'?'url, b64_json':'png, jpeg, webp':'每项用逗号分隔',disabled:busy,onChange:event=>update({choicesText:event.target.value})}),
      field==='outputFormat'&&h('small',null,requestField==='response_format'?'返回方式只决定用链接或 Base64 交付图片，不改变文件像素或 PNG/JPEG/WebP 编码。':'此项是图片文件编码；链接和 Base64 返回方式请单独选 response_format 字段。'));
  };
  let content;
  if(modelForm) {
    const {provider,model,values}=modelForm;
    content=h('form',{onSubmit:event=>{event.preventDefault();void run(async()=>{const capabilities=gamecoworkManualCapabilities(values);if(!Object.keys(capabilities).length&&modelForm.kind===model.kind)throw Error('尚未修改能力配置');await gamecoworkProviderRequest('/local/providers/'+encodeURIComponent(provider.id)+'/model-capabilities',{method:'PUT',body:{modelId:model.id,kind:modelForm.kind,capabilities},signal:request.current.signal});setModelForm(null);setNotice('已保存手动能力配置；手动声明不是实测结果。');await changed();});}},h('h3',null,model.label||model.id),h('label',{className:'gamecowork-provider-field'},h('span',null,'模型用途'),h('select',{'aria-label':'模型用途',value:modelForm.kind,disabled:busy,onChange:event=>setModelForm(old=>({...old,kind:event.target.value}))},...(provider.kinds||[]).map(kind=>h('option',{key:kind,value:kind},{image:'图片',video:'视频',audio:'音频',model:'3D',chat:'对话'}[kind]||kind)))),h('p',{role:'note'},'仅填写该模型实际支持的参数。手动配置将明确标为未验证；未知参数不会显示可操作按钮。'),...capFields.map(capabilityEditor),h('footer',null,button('返回',()=>setModelForm(null)),h('button',{type:'submit',className:'generation-tag-button',disabled:busy},'保存手动配置')));
  } else if(form) {
    const protocol=protocolById(form.protocol);
    content=h('form',{onSubmit:save},input('名称','name',{maxLength:100}),input('接口地址','baseUrl',{placeholder:'https://example.com/v1',maxLength:500}),select('协议','protocol',gamecoworkProviderProtocols),h('p',{role:'note'},protocol.note),form.protocol==='openai-images'&&sizePolicyPicker(),h('div',{className:'gamecowork-provider-kinds'},...protocol.kinds.map(kind=>h('label',{key:kind},h('input',{type:'checkbox',checked:form.kinds.includes(kind),disabled:busy,onChange:event=>set('kinds',event.target.checked?[...form.kinds,kind]:form.kinds.filter(value=>value!==kind))}),{image:'图片',video:'视频',chat:'大模型',model:'3D',audio:'音频'}[kind]))),select('认证','authMode',[{id:'none',label:'无需认证'},{id:'bearer',label:'Bearer Key'},{id:'header',label:'自定义请求头'}]),form.authMode==='header'&&input('密钥请求头名称','apiKeyHeader',{maxLength:100}),form.authMode!=='none'&&input(currentProvider?.apiKeyConfigured?'密钥（已保存，留空保留）':'密钥','apiKey',{type:'password',maxLength:4096}),currentProvider?.apiKeyConfigured&&h('label',null,h('input',{type:'checkbox',checked:form.clearApiKey,disabled:busy,onChange:event=>set('clearApiKey',event.target.checked)}),'清除已保存密钥'),h('label',{className:'gamecowork-provider-field'},h('span',null,'默认模型'),h('select',{value:form.defaultModel,disabled:busy,onChange:event=>set('defaultModel',event.target.value)},h('option',{value:''},'未选择'),...(currentProvider?.models||[]).map(model=>h('option',{key:model.id,value:model.id},model.label||model.id)))),input('请求超时（秒）','requestTimeoutSeconds',{type:'number',min:1,max:600,step:1}),h('label',null,h('input',{type:'checkbox',checked:form.enabled,disabled:busy,onChange:event=>set('enabled',event.target.checked)}),'启用 Provider'),h('label',null,h('input',{type:'checkbox',checked:form.allowInsecureLan,disabled:busy,onChange:event=>set('allowInsecureLan',event.target.checked)}),'明确授权访问填写的 HTTP 本地 / 局域网服务'),['generic-rest-task','comfyui'].includes(form.protocol)&&h('label',{className:'gamecowork-provider-field'},h('span',null,form.protocol==='comfyui'?'ComfyUI API 工作流与参数节点映射 JSON':'REST 创建 / 轮询 / 输出字段配置 JSON'),h('textarea',{value:form.protocol==='comfyui'?form.workflowText:form.adapterText,rows:7,disabled:busy,onChange:event=>set(form.protocol==='comfyui'?'workflowText':'adapterText',event.target.value),placeholder:form.protocol==='comfyui'?'{"graph":{"6":{"class_type":"CLIPTextEncode","inputs":{"text":""}}},"bindings":{"prompt":{"nodeId":"6","input":"text"}}}（仅格式示例，须填完整导出工作流；执行尚未接入）':'请按服务文档填写；不会自动猜测接口'})),h('footer',null,button('返回',()=>setForm(null)),h('button',{type:'submit',className:'generation-tag-button',disabled:busy},'保存')));
  } else {
    content=h('div',null,h('p',{role:'note'},'连接检查只读取目录，不生成内容。各模型的档位、尺寸与独立超分分别记录证据；未知能力不会当作可用按钮。'),button('添加 Provider',()=>setForm(emptyForm())),...providers.map(provider=>h('section',{key:provider.id,className:'gamecowork-provider-card'},h('h3',null,provider.name),h('small',null,provider.protocol+' · '+provider.baseUrl+' · '+(provider.apiKeyConfigured?'密钥已保存':'无已保存密钥')),h('div',{className:'gamecowork-provider-actions'},button('编辑',()=>setForm(gamecoworkProviderForm(provider))),button('读取模型 / 测试连接',()=>sync(provider)),button('删除',()=>remove(provider))),h('details',null,h('summary',null,`模型目录（${provider.models?.length||0}）`),...(provider.models||[]).map(model=>h('article',{key:model.id,className:'gamecowork-provider-model'},h('strong',null,model.label||model.id),h('small',null,provider.generationAvailable===true&&model.available===true&&['image','video','audio','model'].includes(model.kind)?'快速生成已接线（'+({image:'图片',video:'视频',audio:'音频',model:'3D'}[model.kind])+'）；实际能力以证据为准':'目录已读取；当前执行入口或配置未就绪'),...capFields.map(([field,label])=>h('div',{key:field},(field==='outputFormat'?gamecoworkImageFormatLabel(model.capabilities?.[field]):label)+'：'+gamecoworkCapabilitySummary(model.capabilities?.[field]))),button('手动配置能力',()=>setModelForm({provider,model,kind:model.kind,values:gamecoworkManualCapabilityForm(model.capabilities)}))))))),h('footer',null,button('关闭',close)));
  }
  return h(React.Fragment,null,h('style',null,'.gamecowork-provider-policy-popover{z-index:1251!important;pointer-events:auto}.gamecowork-provider-manager{max-height:70vh;overflow:auto;color:var(--studio-text);color-scheme:inherit}.gamecowork-provider-manager option{background:var(--studio-surface-strong);color:var(--studio-text)}.gamecowork-provider-capability-note{max-width:420px;white-space:normal;font-size:11px;color:var(--studio-text-muted);line-height:1.4}.gamecowork-provider-field{display:flex;flex-direction:column;gap:6px;margin:12px 0}.gamecowork-provider-field input,.gamecowork-provider-field select,.gamecowork-provider-field textarea,.gamecowork-provider-cap input,.gamecowork-provider-cap select{padding:8px;border:1px solid var(--studio-border-strong);border-radius:7px;background:var(--studio-surface-strong);color:var(--studio-text);color-scheme:inherit}.gamecowork-provider-card{padding:14px 0;border-bottom:1px solid var(--studio-border)}.gamecowork-provider-card small,.gamecowork-provider-model small{display:block;color:var(--studio-text-muted)}.gamecowork-provider-actions, .gamecowork-provider-kinds{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.gamecowork-provider-model{margin:12px 0}.gamecowork-provider-cap{margin:8px 0;border:1px solid var(--studio-border);padding:8px}.gamecowork-provider-cap small{display:block}.gamecowork-provider-model div{font-size:12px;color:var(--studio-text-secondary)}.gamecowork-provider-selector{max-width:200px}.gamecowork-provider-selector strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gamecowork-provider-manager footer{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}'),h(Popover,{open:pickerOpen,onOpenChange:setPickerOpen},h(PopoverTrigger,{asChild:true},h('button',{type:'button',className:'studio-model-select gamecowork-provider-selector','aria-label':'第三方 Provider'},h('strong',null,options.find(row=>row.id===selectedProvider)?.name||'选择 Provider'),h(Chevron,{size:14}))),h(PopoverContent,{align:'start',mobileTitle:'选择第三方 Provider',className:'studio-popover gamecowork-provider-popover'},h('div',{role:'group','aria-label':'选择第三方 Provider'},options.map(row=>h('button',{type:'button',className:'studio-pop-item'+(row.id===selectedProvider?' is-active':''),'aria-pressed':row.id===selectedProvider,key:row.id,onClick:()=>{onSelect(row.id);setPickerOpen(false);}},row.name))))),button('管理 Provider',show,{className:'generation-tag-button gamecowork-provider-manage-button'}),open&&h(Dialog,{title:'自定义 Provider',description:'图片、视频、大模型与本地服务的独立配置；不会改变 Codely 官方权益。',wide:true,busy,onClose:close},h('div',{className:'gamecowork-provider-manager'},error&&h('p',{role:'alert'},error),notice&&h('p',{role:'status'},notice),content)));
}
