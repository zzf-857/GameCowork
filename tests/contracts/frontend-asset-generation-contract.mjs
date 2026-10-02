import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetResponse,assetJsonObject,assetError,assetTerminalStatuses,assetProviderForm,assetTaskQuery,assetInputMetadata,assetFileFields,assetValidateInputFiles,assetUploadInput,assetInputLimit,createAssetGenerationComponents} from '../../src/frontend/bundle/assets/gamecowork-asset-generation.js';
test('Actual response helper rejects RPC/nested failure and keeps real task fields',()=>{
 const task={id:'t_owned',status:'running',progress:12};assert.deepEqual(assetResponse({status:'success',content:{task}}),{task});
 for(const value of [{status:'error',error:'owned RPC failure'},{status:'success',content:{success:false,error:'owned inner failure'}},{success:false,error:{message:'owned structured failure'}}])assert.throws(()=>assetResponse(value),/owned/);
});
test('Actual JSON form helper accepts object templates and rejects incomplete/scalar values',()=>{
 assert.deepEqual(assetJsonObject('{"parameters":"{{parameters}}"}'),{parameters:'{{parameters}}'});
 for(const value of ['{','[]','null','42','"text"'])assert.throws(()=>assetJsonObject(value));
});
test('Cancelled and interrupted are terminal, cancellation request is not zero effect',()=>{
 for(const value of ['completed','failed','cancelled','interrupted'])assert.equal(assetTerminalStatuses.has(value),true);
 for(const value of ['queued','running','cancel_requested'])assert.equal(assetTerminalStatuses.has(value),false);
 assert.ok(assetError('Bearer own-test-secret error').includes('[已隐藏]'));assert.ok(!assetError('Bearer own-test-secret error').includes('own-test-secret'));assert.ok(assetError('x'.repeat(1000)).length<=300);
});
test('Both GUI generations preserve the earlier prototype source but mount the original asset and Canvas hosts',()=>{
 for(const [file,context,viewer] of [['index-BRxZ4eG7.js','tt','GenerationModelViewer-DgHJ_Htv.js'],['index-DvRYaIVa.js','st','GenerationModelViewer-DDhaO2so.js']]){
  const source=fs.readFileSync(new URL('../../src/frontend/bundle/assets/'+file,import.meta.url),'utf8');
  assert.match(source,/import \{ createAssetGenerationComponents \} from "\.\/gamecowork-asset-generation\.js"/);
  assert.ok(source.includes('useMessenger: () => d.useContext('+context+')'));
  assert.ok(source.includes(viewer)&&source.includes('default: module.default'));
  assert.equal((source.match(/a\.jsx\(gamecoworkLocalAssetPanel,/g)||[]).length,0);
  assert.equal((source.match(/a\.jsx\(gamecoworkLocalCanvasPanel,/g)||[]).length,0);
  for(const component of ['gamecoworkLegacyAssetPanel','gamecoworkLegacyCanvasFrame','gamecoworkLegacyCanvasPanel'])assert.equal((source.match(new RegExp('a\\.jsx\\('+component+',','g'))||[]).length,1);
  assert.equal((source.match(/a\.jsx\(gamecoworkAssetPending,/g)||[]).length,0);
 }
});
test('Factory keeps per-runtime dependency injection and no original service download path',()=>{
 const source=fs.readFileSync(new URL('../../src/frontend/bundle/assets/gamecowork-asset-generation.js',import.meta.url),'utf8');
 const components=createAssetGenerationComponents({React:{createElement(){}}});assert.equal(typeof components.AssetPanel,'function');assert.equal(typeof components.CanvasPanel,'function');
 assert.doesNotMatch(source,/ai-generator\.tuanjie|aicanvas\.tuanjie|download-url|localStorage.*apiKey|window\.prompt|window\.confirm/);
 assert.match(source,/generator\/getResource/);assert.match(source,/generator\/saveCanvas/);assert.match(source,/overwrite: false/);assert.match(source,/scope\.current !== saveDialog\.workspaceKey/);
});
test('Editing a Provider preserves an explicitly absent cancellation route and never rehydrates its key',()=>{
 const value=assetProviderForm({id:'p_owned',apiKey:'must-not-enter-form',adapter:{cancel:null,create:{path:'/images',bodyTemplate:{prompt:'{{prompt}}'}}}});
 assert.equal(value.cancel.path,'');assert.equal(value.apiKey,'');assert.equal(value.create.path,'/images');assert.deepEqual(value.create.bodyTemplate,{prompt:'{{prompt}}'});
 assert.equal(assetProviderForm({}).cancel.path,'/tasks/{{taskId}}');
});
test('History filters apply only to the history view, never to fresh generation or Canvas outputs',()=>{
 const filters={workspaceKey:'A',discarded:true,page:4,queryText:'old-only',historyKind:'model'};
 assert.deepEqual(assetTaskQuery({...filters,view:'history'}),{workspaceKey:'A',pageSize:20,discarded:true,page:4,query:'old-only',kind:'model'});
 for(const view of ['create','canvas','settings'])assert.deepEqual(assetTaskQuery({...filters,view}),{workspaceKey:'A',pageSize:20,discarded:false,page:1});
});

// Execute the actual maintained component with a deterministic hook host. Async
// requests are deliberately reordered; no duplicated component implementation.
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
const ownedProvider={id:'p_owned',name:'Owned Provider',enabled:true,kinds:['image','video','model'],model:'owned-default'};
const ownedTask={id:'t_owned',providerId:'p_owned',workspaceKey:'A',kind:'model',status:'completed',prompt:'Owned original prompt',model:'owned-original-model',parameters:{seed:7,enabled:true},artifacts:[]};
const ownedInput={id:'i_owned',filename:'owned-reference.png',mime:'image/png',byteLength:5,sha256:'a'.repeat(64),workspaceKey:'A'};
function componentFixture(handler=()=>undefined,options={}) {
 const previousWindow=globalThis.window;globalThis.window={addEventListener(){},removeEventListener(){}};
 const slots=[],effects=[],calls=[];let cursor=0,dirty=true,tree,workspace={workspaceKey:'A'},mounted=true;
 const same=(left,right)=>left&&right&&left.length===right.length&&left.every((value,index)=>Object.is(value,right[index]));
 const React={
  createElement:(type,props,...children)=>({type,props:{...props,children:children.flat(Infinity)}}),
  useState(initial){const index=cursor++;if(!(index in slots))slots[index]=typeof initial==='function'?initial():initial;return[slots[index],value=>{const next=typeof value==='function'?value(slots[index]):value;if(!Object.is(slots[index],next)){slots[index]=next;dirty=true;}}];},
  useRef(value){const index=cursor++;return slots[index]??(slots[index]={current:value});},
  useCallback(callback,deps){const index=cursor++;if(!same(slots[index]?.deps,deps))slots[index]={deps,value:callback};return slots[index].value;},
  useEffect(callback,deps){const index=cursor++;if(!same(slots[index]?.deps,deps)){const previous=slots[index];slots[index]={deps,cleanup:previous?.cleanup};effects.push(()=>{previous?.cleanup?.();slots[index].cleanup=callback();});}},
 };
 const messenger={request:async(method,data)=>{
  calls.push({method,data});const override=await handler(method,data);if(override!==undefined)return override;
  return{status:'success',content:method==='generator/listProviders'?{providers:[ownedProvider]}:method==='generator/listTasks'?{tasks:[],total:0}:method==='generator/getTask'?{task:ownedTask}:method==='generator/getCanvas'?{canvas:{nodes:[],edges:[]}}:{}};
 }};
 const {AssetPanel}=createAssetGenerationComponents({React,useMessenger:()=>messenger,useWorkspace:()=>workspace,...options});let Component=AssetPanel,componentProps;
 function render(){let rounds=0;do{assert.ok(++rounds<50,'component settles without render loop');dirty=false;cursor=0;tree=Component(componentProps);while(effects.length)effects.shift()();}while(dirty&&mounted);}
 function descendants(value){if(!value||typeof value!=='object')return[];return[value,...(value.props?.children||[]).flatMap(descendants)];}
 function nodes(){return descendants(tree);}
 const label=node=>(node?.props?.children||[]).map(child=>typeof child==='string'||typeof child==='number'?String(child):label(child)).join('');
 function find(predicate){const value=nodes().find(predicate);assert.ok(value,'Expected actual component element');return value;}
 async function flush(){for(let n=0;n<6;n++){if(dirty&&mounted)render();await new Promise(resolve=>setImmediate(resolve));}if(dirty&&mounted)render();}
 return{calls,flush,nodes,label,find,async click(text){find(node=>node.type==='button'&&label(node)===text).props.onClick();await flush();},async input(name,value){find(node=>node.props?.['aria-label']===name).props.onChange({target:{value}});await flush();},async chooseFiles(files){find(node=>node.props?.['aria-label']==='选择生成参考文件').props.onChange({target:{files,value:'owned-choice'}});await flush();},async scope(key){workspace={workspaceKey:key};dirty=true;await flush();},async mountChild(node,props){for(const value of slots)value?.cleanup?.();slots.length=0;effects.length=0;Component=node.type;componentProps={...node.props,...props};dirty=true;await flush();},dispose(){mounted=false;for(const value of slots)value?.cleanup?.();if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;},get tree(){return tree;}};
}
test('Reference form validates aggregate bounds, field indexes and cross-workspace metadata',()=>{
 assert.deepEqual(assetFileFields('[{"name":"image[]","inputIndex":"all"},{"name":"mask","inputIndex":1}]'),[{name:'image[]',inputIndex:'all'},{name:'mask',inputIndex:1}]);
 for(const value of ['{}','[]','[{"name":"image","inputIndex":8}]','[{"name":"image","inputIndex":-1}]','[{"name":"","inputIndex":0}]'])assert.throws(()=>assetFileFields(value));
 assert.doesNotThrow(()=>assetValidateInputFiles([{name:'owned.glb',size:assetInputLimit}]));
 assert.throws(()=>assetValidateInputFiles([{name:'owned.png',size:assetInputLimit}],[ownedInput]),/总大小/);
 assert.throws(()=>assetValidateInputFiles(Array.from({length:9},()=>({name:'owned.png',size:5}))),/最多选择/);
 assert.throws(()=>assetValidateInputFiles([{name:'owned.html',size:5}]),/请选择/);
 assert.throws(()=>assetInputMetadata(ownedInput,'B'),/其它工作区/);
 assert.deepEqual(assetInputMetadata({...ownedInput,path:'C:/not-exposed',base64:'not-exposed'},'A'),ownedInput);
});
test('Actual upload helper posts the original File only to the local binary route and verifies the returned size',async()=>{
 const file=new File(['owned'],'参考 图.png',{type:'image/png'}),calls=[],controller=new AbortController();
 const fetcher=async(url,options)=>{calls.push({url,options});return{ok:true,json:async()=>({input:{...ownedInput,filename:file.name}})};};
 const result=await assetUploadInput(file,{workspaceKey:'A',signal:controller.signal,fetcher});
 assert.equal(result.id,ownedInput.id);assert.equal(calls[0].options.body,file);assert.equal(calls[0].options.signal,controller.signal);assert.equal(calls[0].options.redirect,'error');assert.equal(calls[0].options.headers['Content-Type'],'application/octet-stream');
 const target=new URL(calls[0].url,'http://127.0.0.1:1234');assert.equal(target.pathname,'/api/tauri/generator/inputs');assert.equal(target.searchParams.get('filename'),file.name);assert.equal(target.searchParams.get('workspaceKey'),'A');
 await assert.rejects(assetUploadInput(file,{workspaceKey:'A',fetcher:async()=>({ok:true,json:async()=>({input:{...ownedInput,byteLength:6}})})}),/大小/);
 await assert.rejects(assetUploadInput(file,{workspaceKey:'A',fetcher:async()=>({ok:false,json:async()=>({error:'owned upload denied'})})}),/owned upload denied/);
});
test('Actual multipart Provider form sends typed file mapping and retains the normal field template',async t=>{
 const f=componentFixture();t.after(()=>f.dispose());await f.flush();await f.click('生成服务');await f.click('编辑');
 let saved;await f.mountChild(f.find(node=>typeof node.type==='function'&&node.type.name==='ProviderForm'),{initial:{...ownedProvider,baseUrl:'http://127.0.0.1:1234'},onSave:async value=>{saved=value;}});
 await f.click('展开自定义接口配置');await f.input('创建任务请求格式','multipart');await f.input('创建任务文件字段 JSON','[{"name":"image[]","inputIndex":"all"}]');await f.input('创建任务请求 JSON 模板','{"prompt":"{{prompt}}","parameters":"{{parameters}}"}');
 await f.find(node=>node.type==='form').props.onSubmit({preventDefault(){}});await f.flush();
 assert.equal(saved.adapter.create.bodyType,'multipart');assert.deepEqual(saved.adapter.create.fileFields,[{name:'image[]',inputIndex:'all'}]);assert.deepEqual(saved.adapter.create.bodyTemplate,{prompt:'{{prompt}}',parameters:'{{parameters}}'});
});
test('Actual reference selection stays local, removed uploads abort, and a late reply never restores the removed row',async t=>{
 const delayed=deferred(),uploads=[];const f=componentFixture(undefined,{fetch:async(url,options)=>{uploads.push({url,options});return delayed.promise;}});t.after(()=>f.dispose());await f.flush();await f.input('生成提示词','Owned reference prompt');
 await f.chooseFiles([new File(['owned'],ownedInput.filename,{type:'image/png'})]);assert.equal(uploads.length,1);assert.equal(f.find(node=>node.type==='button'&&f.label(node)==='生成图片').props.disabled,true);assert.equal(f.calls.filter(call=>call.method==='generator/createTask').length,0);
 await f.click('移除参考文件');assert.equal(uploads[0].options.signal.aborted,true);delayed.resolve({ok:true,json:async()=>({input:ownedInput})});await f.flush();
 assert.ok(!f.nodes().some(node=>String(node.props?.['data-testid']||'').startsWith('asset-reference-')));assert.equal(f.find(node=>node.type==='button'&&f.label(node)==='生成图片').props.disabled,false);
});
test('Actual create freezes only prepared input identities and regenerating restores them without uploading again',async t=>{
 const uploads=[];const f=componentFixture(method=>method==='generator/listTasks'?{tasks:[{...ownedTask,inputs:[ownedInput],inputIds:[ownedInput.id]}],total:1}:method==='generator/getTask'?{task:{...ownedTask,inputs:[ownedInput],inputIds:[ownedInput.id]}}:undefined,{fetch:async(url,options)=>{uploads.push({url,options});return{ok:true,json:async()=>({input:ownedInput})};}});t.after(()=>f.dispose());await f.flush();
 await f.chooseFiles([new File(['owned'],ownedInput.filename,{type:'image/png'})]);await f.input('生成提示词','Owned reference prompt');
 await f.find(node=>node.props?.['data-testid']==='asset-create-form').props.onSubmit({preventDefault(){}});await f.flush();
 const request=f.calls.find(call=>call.method==='generator/createTask').data;assert.deepEqual(request.inputIds,[ownedInput.id]);assert.ok(!JSON.stringify(request).includes('data:image/'));assert.equal(request.inputs,undefined);
 await f.click('移除参考文件');assert.deepEqual(request.inputIds,[ownedInput.id],'editing the next draft does not mutate a submitted task');
 await f.click('使用相同参数再生成');assert.equal(uploads.length,1);assert.ok(f.nodes().some(node=>node.props?.['data-testid']==='asset-reference-'+ownedInput.id));assert.equal(f.find(node=>node.props?.['aria-label']==='生成提示词').props.value,ownedTask.prompt);
});
test('Actual reference uploads are cancelled and late replies discarded across a workspace A to B to A change',async t=>{
 const delayed=deferred();let signal;const f=componentFixture(undefined,{fetch:async(_url,options)=>{signal=options.signal;return delayed.promise;}});t.after(()=>f.dispose());await f.flush();await f.chooseFiles([new File(['owned'],ownedInput.filename)]);
 await f.scope('B');assert.equal(signal.aborted,true);await f.scope('A');delayed.resolve({ok:true,json:async()=>({input:ownedInput})});await f.flush();assert.ok(!f.nodes().some(node=>String(node.props?.['data-testid']||'').startsWith('asset-reference-')));
});
test('Actual failed reference uploads remain visible and block generation until explicitly removed',async t=>{
 const f=componentFixture(undefined,{fetch:async()=>({ok:false,json:async()=>({error:'owned unsupported bytes'})})});t.after(()=>f.dispose());await f.flush();await f.input('生成提示词','Owned reference prompt');await f.chooseFiles([new File(['owned'],ownedInput.filename)]);
 assert.ok(f.nodes().some(node=>node.props?.role==='alert'&&f.label(node).includes('owned unsupported bytes')));assert.equal(f.find(node=>node.type==='button'&&f.label(node)==='生成图片').props.disabled,true);assert.equal(f.calls.filter(call=>call.method==='generator/createTask').length,0);
 await f.click('移除参考文件');assert.equal(f.find(node=>node.type==='button'&&f.label(node)==='生成图片').props.disabled,false);
});
test('Actual Provider form submits explicit synchronous output selectors and preserves a disabled cancellation route',async t=>{
 const f=componentFixture();t.after(()=>f.dispose());await f.flush();await f.click('生成服务');await f.click('编辑');
 let saved;await f.mountChild(f.find(node=>typeof node.type==='function'&&node.type.name==='ProviderForm'),{initial:{...ownedProvider,baseUrl:'http://127.0.0.1:1234',adapter:{cancel:null}},onSave:async value=>{saved=value;}});
 await f.click('展开自定义接口配置');assert.equal(f.find(node=>node.props?.['aria-label']==='取消任务接口路径').props.value,'');
 await f.input('生成服务返回方式','outputs');await f.input('响应字段选择器 JSON','{"outputs":"data"}');await f.input('输出字段选择器 JSON','{"url":"","base64":"b64_json","mime":"","filename":"name"}');
 assert.ok(!f.nodes().some(node=>node.props?.['aria-label']==='查询任务接口路径'));
 await f.find(node=>node.type==='form').props.onSubmit({preventDefault(){}});await f.flush();
 assert.equal(saved.adapter.responseMode,'outputs');assert.equal(saved.adapter.cancel,null);assert.deepEqual(saved.adapter.outputSelectors,{url:'',base64:'b64_json',mime:'',filename:'name'});assert.equal(saved.adapter.selectors.outputs,'data');assert.equal(saved.apiKey,undefined);
});
test('Actual component keeps Provider management usable when task loading fails and clears a recovered read error',async t=>{
 let failed=true;const f=componentFixture(method=>method==='generator/listTasks'&&failed?Promise.reject(Error('owned history read failed')):undefined);t.after(()=>f.dispose());await f.flush();
 assert.ok(f.nodes().some(node=>node.props?.role==='alert'&&f.label(node).includes('owned history read failed')));
 await f.click('生成服务');assert.ok(f.nodes().some(node=>node.type==='strong'&&f.label(node)==='Owned Provider'));
 failed=false;await f.click('重试读取');assert.ok(!f.nodes().some(node=>node.props?.role==='alert'&&f.label(node).includes('owned history read failed')));
});
test('Actual component restores an off-page Canvas task from its persisted identity before regenerating',async t=>{
 const node={id:'n_owned',taskId:'t_owned',artifactId:'a_owned',filename:'owned.glb',mime:'model/gltf-binary',kind:'model',x:24,y:24,width:220,height:180};
 const f=componentFixture(method=>method==='generator/getCanvas'?{canvas:{nodes:[node],edges:[]}}:method==='generator/getResource'?{mime:'model/gltf-binary',base64:'b3duZWQ='}:undefined);t.after(()=>f.dispose());await f.flush();
 await f.click('Canvas');await f.click('再生成');assert.equal(f.calls.filter(call=>call.method==='generator/getTask').length,1);
 assert.equal(f.find(node=>node.props?.['aria-label']==='生成提示词').props.value,ownedTask.prompt);
 assert.equal(f.find(node=>node.props?.['aria-label']==='生成模型').props.value,ownedTask.model);
 assert.deepEqual(JSON.parse(f.find(node=>node.props?.['aria-label']==='生成参数 JSON').props.value),ownedTask.parameters);
 assert.equal(f.find(node=>node.props?.['aria-label']==='生成服务').props.value,ownedTask.providerId);
});
test('Actual component does not turn a failed Canvas read into permission to overwrite its saved board',async t=>{
 let failed=true;const f=componentFixture(method=>method==='generator/getCanvas'&&failed?Promise.reject(Error('owned canvas read failed')):undefined);t.after(()=>f.dispose());await f.flush();await f.click('Canvas');
 assert.equal(f.find(node=>node.type==='button'&&f.label(node)==='保存 Canvas').props.disabled,true);
 assert.ok(f.nodes().some(node=>node.props?.role==='alert'&&f.label(node).includes('owned canvas read failed')));
 failed=false;await f.click('重试读取 Canvas');assert.equal(f.find(node=>node.type==='button'&&f.label(node)==='保存 Canvas').props.disabled,false);
});
test('Actual component refuses a late regenerate after A to B to A instead of replacing the current draft',async t=>{
 const delayed=deferred();const f=componentFixture(method=>method==='generator/listTasks'?{tasks:[ownedTask],total:1}:method==='generator/getTask'?delayed.promise:undefined);t.after(()=>f.dispose());await f.flush();
 await f.click('使用相同参数再生成');await f.scope('B');await f.scope('A');await f.input('生成提示词','Current draft after reopening');delayed.resolve({task:ownedTask});await f.flush();
 assert.equal(f.find(node=>node.props?.['aria-label']==='生成提示词').props.value,'Current draft after reopening');
});
test('Actual component never silently selects another Provider when the original regeneration service is gone',async t=>{
 const f=componentFixture(method=>method==='generator/listTasks'?{tasks:[{...ownedTask,providerId:'p_removed'}],total:1}:method==='generator/getTask'?{task:{...ownedTask,providerId:'p_removed'}}:undefined);t.after(()=>f.dispose());await f.flush();await f.click('使用相同参数再生成');
 assert.equal(f.find(node=>node.props?.['aria-label']==='生成服务').props.value,'');assert.equal(f.find(node=>node.props?.['aria-label']==='生成模型').props.value,ownedTask.model);
 assert.ok(f.nodes().some(node=>node.type==='button'&&f.label(node)==='生成3D 模型'&&node.props.disabled));
});
test('Actual component continues polling after a transient history failure until the task really completes',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let reads=0;
 const f=componentFixture(method=>{if(method==='generator/listTasks'){reads++;if(reads===2)throw Error('owned polling interruption');return{tasks:[{...ownedTask,status:reads>=3?'completed':'running'}],total:1};}});t.after(()=>f.dispose());await f.flush();
 assert.equal(reads,1);t.mock.timers.tick(2500);await f.flush();assert.equal(reads,2);assert.ok(f.nodes().some(node=>node.props?.role==='alert'&&f.label(node).includes('owned polling interruption')));
 t.mock.timers.tick(2500);await f.flush();assert.equal(reads,3);assert.ok(f.nodes().some(node=>node.props?.role==='status'&&f.label(node)==='已完成'));assert.ok(!f.nodes().some(node=>node.props?.role==='alert'));
 t.mock.timers.tick(5000);await f.flush();assert.equal(reads,3);
});
