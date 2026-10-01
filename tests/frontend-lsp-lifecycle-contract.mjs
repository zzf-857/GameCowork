// Execute maintained source callbacks with deliberately reordered real promises.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
const assets=fileURLToPath(new URL('../restored/frontend/dist-beautified/assets/',import.meta.url));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn){const limit=Date.now()+2500;while(!fn()){assert.ok(Date.now()<limit,'Deferred callback did not run');await wait(5);}}
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return{promise,resolve,reject};}
function declaration(source,name){const start=source.indexOf('function '+name+'('),end=source.indexOf('\n}',start);assert.ok(start>=0&&end>start,name);return source.slice(start,end+2);}
function events(){const callbacks=new Map();return{addEventListener(name,callback){if(!callbacks.has(name))callbacks.set(name,new Set());callbacks.get(name).add(callback);},removeEventListener(name,callback){callbacks.get(name)?.delete(callback);},dispatchEvent(event){for(const callback of callbacks.get(event.type)||[])callback(event);}};}
function model(text='class C { int Method() => 1; }'){let dispose;return{uri:{fsPath:'F:/Workspace A/a.cs',toString:()=> 'file:///F:/Workspace%20A/a.cs'},isDisposed:()=>false,getValue:()=>text,getVersionId:()=>1,onDidChangeContent:()=>({dispose(){}}),onWillDispose(callback){dispose=callback;return{dispose(){}};},close(){dispose?.();}};}
const state=(generation,enabled=true)=>({workspaceKey:'stable-A',generation,enabled,supported:true,connected:enabled,ready:enabled,workspaceDir:'F:/Workspace A'});
function clientScope(window,fetchStatus,request){return{window,DOMException,AbortController,setTimeout,clearTimeout,crypto:{randomUUID:()=> 'query-'+Math.random()},gamecoworkLspVersions:new Map(),gamecoworkLspRoute:route=>({...route}),gamecoworkLspMessage:error=>error.message,gamecoworkFetchLspStatus:fetchStatus,gamecoworkLspState(value,route){window.dispatchEvent({type:'gamecowork:lsp-state',detail:{...value,workspaceDir:route.workspaceDir}});},gamecoworkLspRequest:request};}
for(const[label,file,panel]of[['current','index-BRxZ4eG7.js','RightSideBarPanel-JSPvAs5c.js'],['previous','index-DvRYaIVa.js','RightSideBarPanel-B2OWNNNX.js']]){
 const source=fs.readFileSync(assets+file,'utf8'),sidebar=fs.readFileSync(assets+panel,'utf8');
 test(`${label}: delayed initial disabled status and later old events cannot replace the newly enabled generation`,async()=>{
  const initial=deferred(),window=events(),calls=[],emitted=[];let fetches=0;
  window.addEventListener('gamecowork:lsp-state',event=>emitted.push(event.detail.generation));
  const scope=clientScope(window,()=>++fetches===1?initial.promise:Promise.resolve(state(9)),async(kind,data,route)=>{calls.push({kind,data,route});return kind==='lsp/hover'?{version:data.version,hover:{contents:{value:'generation9 semantics'}}}:{version:data.version};});
  const create=vm.runInNewContext(`(${declaration(source,'gamecoworkCreateLspClient')})`,scope),client=create({workspaceDir:'F:/Workspace A'}),document=model();
  client.track(document,'a.cs');await until(()=>fetches===1);
  window.dispatchEvent({type:'gamecowork:lsp-state',detail:state(9)});
  initial.resolve(state(8,false));await until(()=>calls.some(call=>call.kind==='lsp/syncDocument'));
  // Includes an independent old notification after initial discovery has settled.
  window.dispatchEvent({type:'gamecowork:lsp-state',detail:state(8,false)});
  const answer=await client.query('lsp/hover',document,{lineNumber:1,column:16});
  assert.equal(answer.contents.value,'generation9 semantics');
  assert.ok(calls.filter(call=>call.kind!=='lsp/closeDocument').every(call=>call.route.generation===9));
  assert.equal(emitted.filter(generation=>generation===8).length,1,'Only the injected stale event exists; the old fetch must never be published');
  client.dispose();
 });
 test(`${label}: a delayed old close carries its owner version after the same URI has reopened and synchronized`,async()=>{
  const pending=deferred(),window=events(),calls=[];let serverVersion=0;
  const scope=clientScope(window,async()=>state(9),async(kind,data,route)=>{
   calls.push({kind,data,route});
   if(kind==='lsp/syncDocument'){serverVersion=data.version;if(data.version===1)return pending.promise;return{version:data.version};}
   if(kind==='lsp/closeDocument'){if(serverVersion===data.version)serverVersion=0;return{};}
   if(kind==='lsp/hover')return{version:data.version,hover:{contents:{value:'new document owner'}}};return{};
  });
  const create=vm.runInNewContext(`(${declaration(source,'gamecoworkCreateLspClient')})`,scope),client=create({workspaceDir:'F:/Workspace A'}),old=model(),fresh=model('class C { int Reopened() => 2; }');
  client.track(old,'a.cs');await until(()=>calls.some(call=>call.kind==='lsp/syncDocument'&&call.data.version===1));
  old.close();client.track(fresh,'a.cs');await until(()=>calls.some(call=>call.kind==='lsp/syncDocument'&&call.data.version===2));
  pending.resolve({version:1});await until(()=>calls.some(call=>call.kind==='lsp/closeDocument'));
  assert.equal(calls.find(call=>call.kind==='lsp/closeDocument').data.version,1);
  assert.equal(serverVersion,2,'Old owner cleanup cannot close the newly submitted version');
  assert.equal((await client.query('lsp/hover',fresh,{lineNumber:1,column:16})).contents.value,'new document owner');
  client.dispose();
 });
 function paneScope(){
  const values={status:state(8,false),enabled:false,busy:false,error:''};
  const scope={window:{...events(),GAMECOWORK_SHELL:true},AbortController,console:{warn(){}},t:true,ae:false,cr:'F:/Workspace A',r:'F:/Workspace A',n:{workspaceDir:'F:/Workspace A'},gamecoworkLspDocumentRoute:{workspaceDir:'F:/Workspace A'},we:{current:false},gamecoworkLspEpoch:{current:0},gamecoworkLspOwner:{current:'F:/Workspace A'},gamecoworkLspStatusEpoch:{current:0},gamecoworkLspStatusRef:{current:values.status},gamecoworkSetLspStatus:value=>{values.status=value;},de:value=>{values.enabled=value;},gamecoworkSetLspBusy:value=>{values.busy=value;},gamecoworkSetLspError:value=>{values.error=value;}};
  const helperStart=sidebar.indexOf('    function gamecoworkApplyLspStatus('),helperEnd=sidebar.indexOf('\n    T.useEffect(',helperStart);assert.ok(helperStart>0&&helperEnd>helperStart);
  scope.gamecoworkApplyLspStatus=vm.runInNewContext(`(${sidebar.slice(helperStart,helperEnd).trim()})`,scope);
  return{scope,values};
 }
 function toggle(scope){const start=sidebar.indexOf('en = T.useCallback(async () => {'),end=sidebar.indexOf('}, [ae, cr, n, r, qe]);',start);assert.ok(start>0&&end>start);return vm.runInNewContext(`(async () => {${sidebar.slice(start+'en = T.useCallback(async () => {'.length,end)}})`,scope);}
 function statusEffect(scope){const marker=sidebar.indexOf('      const initialEpoch = gamecoworkLspStatusEpoch.current;'),start=sidebar.lastIndexOf('    T.useEffect(() => {',marker),end=sidebar.indexOf('    }, [t, cr, JSON.stringify(gamecoworkLspDocumentRoute)]);',marker);assert.ok(start>0&&end>marker);return vm.runInNewContext(`(() => {${sidebar.slice(start+'    T.useEffect(() => {'.length,end)}})`,scope);}
 test(`${label}: slow A enable cannot alter B status, enabled flag, error or busy ownership`,async()=>{
  for(const reject of[false,true]){const{scope,values}=paneScope(),pending=deferred();scope.Ug=()=>pending.promise;scope.gamecoworkFetchLspStatus=async()=>{throw Error('Old A callback must not refresh B');};const running=toggle(scope)();assert.equal(values.busy,true);
   scope.gamecoworkLspOwner.current='F:/Workspace B';scope.gamecoworkLspEpoch.current++;Object.assign(values,{status:{workspaceKey:'stable-B',generation:12,enabled:false},enabled:false,busy:true,error:'B owns this status'});const expected=JSON.stringify(values);
   reject?pending.reject(Error('A failed')):pending.resolve(state(9));await running;assert.equal(JSON.stringify(values),expected);
  }
 });
 test(`${label}: failed preference persistence refreshes actual stopped status rather than restoring a false connected badge`,async()=>{
  const{scope,values}=paneScope();scope.ae=true;values.status=state(9);values.enabled=true;scope.gamecoworkLspStatusRef.current=values.status;scope.Ug=async()=>{const error=new Error('Preferences are read only');error.code='lsp_preferences_failed';throw error;};let fetches=0;scope.gamecoworkFetchLspStatus=async()=>{fetches++;return state(10,false);};
  await toggle(scope)();assert.equal(fetches,1);assert.equal(values.status.generation,10);assert.equal(values.status.connected,false);assert.equal(values.enabled,false);assert.equal(values.busy,false);assert.match(values.error,/Preferences/);
 });
 test(`${label}: pane rejects stale initial status and synchronous old events before React can commit a render`,async()=>{
  const{scope,values}=paneScope(),initial=deferred();scope.gamecoworkFetchLspStatus=()=>initial.promise;
  const cleanup=statusEffect(scope)();
  scope.window.dispatchEvent({type:'gamecowork:lsp-state',detail:state(9)});
  scope.window.dispatchEvent({type:'gamecowork:lsp-state',detail:state(8,false)});
  initial.resolve(state(8,false));await wait(0);
  assert.equal(values.status.generation,9);assert.equal(values.enabled,true);assert.equal(scope.gamecoworkLspStatusRef.current.generation,9);cleanup();
 });
 test(`${label}: non-C# custom files, scoped foreign tabs, removed documents and virtual/diff files never probe language status`,async()=>{
  const resolve=vm.runInNewContext(`(${declaration(sidebar,'gamecoworkCSharpRoute')})`),route={runOn:'local',workspaceDir:'F:/Workspace A'},document={id:'a.cs',path:'a.cs',file:{kind:'text',path:'a.cs'}};
  assert.equal(resolve(document,'F:/Workspace A',route),route);
  for(const tab of [null,{...document,path:'SKILL.md'},{...document,path:'gemini-extension.json'},{...document,file:null},{...document,isLoading:true},{...document,error:'removed'},{...document,id:'virtual:a.cs'},{...document,diff:{}},{...document,workspaceRoute:{workspaceDir:'F:/Workspace B'}},{...document,workspaceRoute:{...route,runOn:'remote'}},{...document,file:{kind:'text',path:'F:/Workspace B/a.cs'}}]){
   const{scope}=paneScope();let calls=0;scope.gamecoworkLspDocumentRoute=resolve(tab,'F:/Workspace A',route);scope.gamecoworkFetchLspStatus=async()=>{calls++;return state(9);};assert.equal(statusEffect(scope)(),undefined);await wait(0);assert.equal(calls,0);
  }
 });
 test(`${label}: leaving a C# pane aborts its exact pending status fetch and ignores late results`,async()=>{
  const{scope,values}=paneScope(),pending=deferred();let signal,captured;scope.gamecoworkFetchLspStatus=(route,requestSignal)=>{captured=route;signal=requestSignal;return pending.promise;};
  const cleanup=statusEffect(scope)(),before=JSON.stringify(values);assert.equal(captured,scope.gamecoworkLspDocumentRoute);assert.equal(signal.aborted,false);cleanup();assert.equal(signal.aborted,true);pending.resolve(state(9));await wait(0);assert.equal(JSON.stringify(values),before);
 });
 test(`${label}: an unavailable status cannot trigger background sync or language queries even with a persisted enabled flag`,async()=>{
  const window=events(),calls=[],scope=clientScope(window,async()=>({...state(9),supported:false,ready:false,connected:false,failure:{code:'lsp_runtime_missing'}}),async(kind)=>{calls.push(kind);return{};});
  const create=vm.runInNewContext(`(${declaration(source,'gamecoworkCreateLspClient')})`,scope),client=create({workspaceDir:'F:/Workspace A'}),document=model();client.track(document,'a.cs');assert.equal(await client.query('lsp/hover',document,{lineNumber:1,column:16}),null);assert.deepEqual(calls,[]);client.dispose();
 });
 for(const transition of ['live','cleanup','replacement'])test(`${label}: editor initialization after awaited model setup respects ${transition} ownership`,async()=>{
  const start=sidebar.indexOf('          const te = B.current;'),end=sidebar.indexOf('        }),\n        () => {',start);assert.ok(start>0&&end>start);
  const pending=deferred(),registered=[],reference=()=>({current:null});
  const editor={disposed:false,onDidChangeModel(){},onKeyDown(){},addAction(action){registered.push('action:'+action.id);},getModel(){return this.disposed?null:{};},getPosition(){return this.disposed?null:{lineNumber:1,column:1};}};
  const scope={V:false,B:{current:{path:'a.cs',content:'class A {}'}},E:{current:editor},z:editor,Ve:()=>pending.promise,window:{GAMECOWORK_SHELL:true},console:{info(){},debug(){}},Aa:{F12:12},R:reference(),q:reference(),L:reference(),O:reference(),I:reference(),gamecoworkGoDefinition:reference(),gamecoworkFindReferences:reference(),an:{registerEditorOpener(){registered.push('opener');return{dispose(){}};},registerLinkOpener(){registered.push('link');return{dispose(){}};}},$l:{registerHoverProvider(){registered.push('hover');return{dispose(){}};},registerDefinitionProvider(){registered.push('definition');return{dispose(){}};},registerReferenceProvider(){registered.push('references');return{dispose(){}};}}};
  const continuation=vm.runInNewContext(`(async()=>{${sidebar.slice(start,end)}})`,scope),running=continuation();
  if(transition==='cleanup'){editor.disposed=true;scope.V=true;scope.E.current=null;}
  if(transition==='replacement')scope.E.current={};
  pending.resolve();await running;
  assert.deepEqual(registered,transition==='live'?['hover','definition','references','action:gamecowork.csharp.definition','action:gamecowork.csharp.references','opener','link']:[]);
  assert.equal(typeof scope.gamecoworkGoDefinition.current,transition==='live'?'function':'object');
 });
}
