// Verify the imported source and local routing helpers without evaluating any
// original Canvas application bundle or making account/provider requests.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
import { verifyCodelyCanvasSource } from '../../tools/frontend/verify-canvas-source.mjs';
const root=fileURLToPath(new URL('../../src/frontend/bundle/codely-canvas/',import.meta.url));
const ledger=JSON.parse(fs.readFileSync(path.join(root,'source-ledger.json'),'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

test('Actual imported module/preload/style closure contains only ledgered local resources',async()=>{
  const report=await verifyCodelyCanvasSource(root);
  assert.equal(report.passed,true,report.errors.join('\n'));
  assert.equal(report.originalResources,ledger.entries.length);assert.equal(report.preservedBindings,24);
  assert.ok(report.dependencies>1000,'Check actual dependency graph, not just the entry module');
  assert.equal(report.files,ledger.entries.length+ledger.ownedFiles.length);
  assert.ok(report.nonLiteralImports.every(item=>typeof item.file==='string'&&Number.isInteger(item.offset)));
});

test('Every imported original Canvas resource has its precise current hash and source attribution',()=>{
  assert.ok(ledger.entries.length>=18);
  const files=new Set();
  for(const row of ledger.entries){
    assert.ok(!files.has(row.file));files.add(row.file);
    const bytes=fs.readFileSync(path.join(root,row.file));
    assert.equal(bytes.length,row.currentBytes,row.file);assert.equal(sha(bytes),row.currentSha256,row.file);
    assert.equal(new URL(row.sourceUrl).hostname,'aicanvas.tuanjie.cn');assert.match(row.sourceSha256,/^[a-f0-9]{64}$/);
    if(!row.patches.length)assert.equal(row.currentSha256,row.sourceSha256,'Unpatched original bytes: '+row.file);
    for(const patch of row.patches){assert.ok(patch.sourceByteStart>=0&&patch.sourceByteEnd>=patch.sourceByteStart);assert.ok(patch.reason&&typeof patch.replacement==='string');}
  }
  for(const row of ledger.ownedFiles)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file);
});

test('Actual original ReactFlow, eleven node renderers and editors remain byte-for-byte intact',()=>{
  assert.equal(ledger.preservedOriginalBindings.length,24);
  for(const binding of ledger.preservedOriginalBindings){const bytes=fs.readFileSync(path.join(root,binding.file));assert.equal(sha(bytes.subarray(binding.currentByteStart,binding.currentByteEnd)),binding.bindingSha256,binding.name);}
});

test('Local Canvas HTML enforces local loading and keeps the actual entry/style assets',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(html,/src="\/codely-canvas\/assets\/index-A8ll_iBT\.js"/);
  assert.match(html,/href="\/codely-canvas\/assets\/index-BzoDPGcU\.css"/);
  assert.match(html,/connect-src 'self'/);assert.match(html,/object-src 'none'/);
  assert.doesNotMatch(html,/<script[^>]+src="https?:/);
  const main=fs.readFileSync(path.join(root,'assets/index-A8ll_iBT.js'),'utf8');
  assert.doesNotMatch(main,/window\.location\.pathname|window\.history\.(?:replaceState|pushState)/);
  assert.match(main,/function xm\(e,t,n\)\{\}/);
});

test('Router namespace preserves original routes, query/hash and native history semantics',async()=>{
  const calls=[];
  const previous=globalThis.window;
  globalThis.window={location:{pathname:'/codely-canvas/canvas/canvasid=owned'},history:{replaceState:(...args)=>calls.push(['replace',...args]),pushState:(...args)=>calls.push(['push',...args])}};
  try{
    const api=await import(pathToFileURL(path.join(root,'canvas-local-boundary.js')).href);
    assert.equal(api.canvasPathname(),'/canvas/canvasid=owned');
    api.canvasPushState({appView:'canvas'},'','/canvas/canvasid=next?x=1#node');
    assert.equal(calls[0][3],'/codely-canvas/canvas/canvasid=next?x=1#node');
    api.canvasReplaceState({appView:'home'},'','/home');assert.equal(calls[1][3],'/codely-canvas/home');
    api.canvasReplaceState({appView:'canvas'},'');assert.equal(calls[2].length,3,'A two-argument history call does not gain an undefined URL');
    assert.equal(api.canvasHistoryUrl('/codely-canvas/home'),'/codely-canvas/home');
    assert.equal(api.canvasHistoryUrl('//outside.invalid'),'//outside.invalid','Cross-origin rejection remains the native History API responsibility');
  }finally{globalThis.window=previous;}
});

test('Local identity requires a successful local-session response and never creates platform credentials or credits',async()=>{
  const api=await import(pathToFileURL(path.join(root,'canvas-local-auth.js')).href);
  const payload={mode:'local',user:{id:'gamecowork-local',username:'Owned fixture local user',role:'local'},session:{id:crypto.randomUUID(),scope:'gamecowork-canvas-local'}};
  const calls=[];
  const session=await api.fetchCanvasLocalSession(async(url,options)=>{calls.push({url,options});return{ok:true,json:async()=>payload};});
  assert.equal(calls[0].url,'/codely-canvas/api/local/session');assert.equal(calls[0].options.credentials,'omit');assert.equal(calls[0].options.redirect,'error');
  const reports=[],value=api.makeCanvasLocalAuthValue(session,false,()=>{},()=>{},message=>reports.push(message));
  assert.equal(value.mode,'local');assert.equal(value.user.role,'local');assert.equal(value.tokens,null);
  assert.equal(value.getAccessToken(),payload.session.id);assert.equal(value.localSessionScope,'gamecowork-canvas-local');
  for(const key of ['points','vip','unity_id','api_token','membership'])assert.equal(Object.hasOwn(value.user,key),false);
  assert.deepEqual(await value.updatePoints(),{available:false,mode:'local'});
  await assert.rejects(value.login('unused','unused'),/本地模式/);value.loginWithUnity();assert.equal(reports.length,2);assert.equal(calls.length,1);
  const unknown=api.makeCanvasLocalAuthValue(null,false,()=>{},()=>{},()=>{});assert.equal(unknown.isLoggedIn,false);assert.equal(unknown.hasToken,false);assert.equal(unknown.getAccessToken(),null);
  for(const invalid of [{...payload,mode:'fixture'},{...payload,user:{...payload.user,role:'admin'}},{...payload,user:{...payload.user,points:0}},{...payload,tokens:{access_token:'not-a-local-session'}},{...payload,session:{...payload.session,id:'invented-static-token'}}])assert.throws(()=>api.validateCanvasLocalSession(invalid),/本地会话/);
  await assert.rejects(api.fetchCanvasLocalSession(async()=>({ok:false,status:503})),/503/);
  const source=fs.readFileSync(path.join(root,'canvas-local-auth.js'),'utf8');assert.doesNotMatch(source,/document\.cookie|localStorage|\/auth\/(?:login|exchange|points)/);
});

test('Official Canvas credits project only verified numeric fields and unknown credits remain unavailable',async()=>{
  const api=await import(pathToFileURL(path.join(root,'canvas-local-auth.js')).href);
  const official={mode:'codely-official',user:{id:'owned',username:'Owned User',role:'user'},points:{points:500,total:'800',token:'never-render',nested:{access_token:'never-render'}}};
  const overlay=api.validateCanvasOfficialOverlay(official);
  assert.deepEqual(overlay.points,{points:500,total:'800'});
  for(const points of [null,{},[],{points:NaN},{points:Infinity},{points:'1e8'},{points:'credential'}]){
    const value=api.makeCanvasLocalAuthValue({user:{},session:{id:'local-session',scope:'gamecowork-canvas-local'},official:api.validateCanvasOfficialOverlay({...official,points})},false,()=>{},()=>{},()=>{});
    assert.deepEqual(await value.updatePoints(),{available:false,mode:'codely-official',points:null});
  }
});

test('Mounted Canvas accepts only parent invalidation, aborts replaced reads and removes its listeners',async()=>{
  const source=fs.readFileSync(path.join(root,'canvas-local-auth.js'),'utf8'),effects=[],states=[],messages=new Map(),visibility=new Map(),requests=[],tokens=[];
  const parent={},host={parent,location:{origin:'http://127.0.0.1:40123'},addEventListener:(type,fn)=>messages.set(type,fn),removeEventListener:type=>messages.delete(type)};
  const doc={visibilityState:'visible',addEventListener:(type,fn)=>visibility.set(type,fn),removeEventListener:type=>visibility.delete(type)};
  const React={useState:initial=>{const state={value:initial};states.push(state);return[initial,value=>state.value=value];},useRef:value=>({current:value}),useCallback:fn=>fn,useMemo:fn=>fn(),useEffect:fn=>effects.push(fn),createElement:()=>null};
  const sandbox=vm.createContext({window:host,document:doc,AbortController,fetch:(url,options)=>new Promise(resolve=>requests.push({url,options,resolve}))});
  vm.runInContext(source.replaceAll('export ','')+'\nthis.provider=CanvasLocalAuthProvider;',sandbox);
  sandbox.provider({React,context:{Provider:{}},setRuntimeToken:value=>tokens.push(value),children:null});
  const dispose=effects[0](),flush=()=>new Promise(resolve=>setImmediate(resolve));
  const reply=async(index,official)=>{requests[index].resolve({ok:true,json:async()=>({mode:'local',user:{id:'gamecowork-local',username:'Local',role:'local'},session:{id:'00112233-4455-4677-8899-aabbccddeeff',scope:'gamecowork-canvas-local'},...(official?{official}:{})})});await flush();};
  const changed=(extra={})=>messages.get('message')({source:parent,origin:host.location.origin,data:{type:'gamecowork:local-session-changed'},...extra});
  changed({source:{}});changed({origin:'https://outside.invalid'});changed({data:{type:'cowork-token',token:'untrusted'}});assert.equal(requests.length,1);
  changed({data:{type:'gamecowork:local-session-changed',user:{username:'spoofed'}}});assert.equal(requests.length,2);assert.equal(requests[0].options.signal.aborted,true);
  await reply(1);assert.equal(states[0].value.user.username,'Local');await reply(0,{mode:'codely-official',user:{id:'old',username:'Stale',role:'user'},points:{points:1}});assert.equal(states[0].value.user.username,'Local');
  visibility.get('visibilitychange')();assert.equal(requests.length,3);dispose();assert.equal(requests[2].options.signal.aborted,true);assert.equal(messages.size,0);assert.equal(visibility.size,0);assert.equal(tokens.at(-1),'');
  await reply(2);assert.equal(tokens.at(-1),'');
});

test('Both maintained Canvas hosts and default sidebars notify already mounted local clients when their account changes',()=>{
  const hostRoot=new URL('../../src/frontend/bundle/assets/',import.meta.url);
  for(const name of ['index-BRxZ4eG7.js','index-DvRYaIVa.js']){
    const source=fs.readFileSync(new URL(name,hostRoot),'utf8');
    assert.match(source,/A\.current && h\(\{ type: "gamecowork:local-session-changed" \}\)/);
    assert.match(source,/\}, \[r, f, h\]\)/);
    assert.match(source,/p\.current\.contentWindow\.postMessage\(\{ type: "gamecowork:local-session-changed" \}, Di\)/);
    assert.match(source,/\}, \[E, K\]\)/);
  }
  for(const name of ['RightSideBarPanel-JSPvAs5c.js','RightSideBarPanel-B2OWNNNX.js']){
    const source=fs.readFileSync(new URL(name,hostRoot),'utf8');
    const start=source.indexOf('const b = T.useRef(p);'),end=source.indexOf('    T.useEffect(() => {\n      var v, m;',start);
    const expression=source.slice(start,end).replace(/,\s*$/,'')+'\n);';
    const sent=[],effects=[];
    vm.runInNewContext('(function(){'+expression+'})()', {T:{useRef:value=>({current:value}),useEffect:(fn,deps)=>effects.push({fn,deps})},p:null,t:'new-account',gamecoworkLocalCanvas:true,s:{current:true},a:{current:{contentWindow:{postMessage:(message,origin)=>sent.push({message,origin})}}},qa:'http://127.0.0.1:40123'});
    effects[0].fn();assert.equal(effects[0].deps[0],'new-account');assert.equal(sent.length,1);assert.deepEqual(JSON.parse(JSON.stringify(sent[0])),{message:{type:'gamecowork:local-session-changed'},origin:'http://127.0.0.1:40123'});
  }
});

test('API header boundary only forwards an existing document owner and never invents one',async()=>{
  const api=await import(pathToFileURL(path.join(root,'canvas-local-auth.js')).href+'?header-test='+crypto.randomUUID());
  const oldWindow=globalThis.window,oldStorage=globalThis.sessionStorage;
  globalThis.window={location:{pathname:'/codely-canvas/home'}};
  globalThis.sessionStorage={getItem:()=>{throw Error('Local ownership must not read shared sessionStorage');},setItem:()=>{throw Error('Local ownership must not write shared sessionStorage');}};
  try{
    assert.equal(api.canvasLocalApiHeaders('own-session')['X-GameCowork-Canvas-Session'],undefined);
    const owner=api.createCanvasEditingOwner();assert.match(owner,/^gcw-canvas-[a-f0-9-]{36}$/);assert.equal(api.canvasLocalApiHeaders('own-session')['X-GameCowork-Canvas-Session'],owner);
    globalThis.window.location.pathname='/home';assert.equal(api.canvasLocalApiHeaders('own-session')['X-GameCowork-Canvas-Session'],undefined);assert.equal(api.createCanvasEditingOwner(),null);
  }finally{globalThis.window=oldWindow;globalThis.sessionStorage=oldStorage;}
});

test('Media upload captures the actual saved Canvas route and lease, never a graph workspace hash',async()=>{
  const api=await import(pathToFileURL(path.join(root,'canvas-local-auth.js')).href+'?media-test='+crypto.randomUUID());
  const oldWindow=globalThis.window,oldStorage=globalThis.sessionStorage;
  const id=crypto.randomUUID();
  globalThis.window={location:{pathname:'/codely-canvas/canvas/canvasid='+id}};globalThis.sessionStorage={getItem:()=>{throw Error('Shared storage must not identify media owner');}};
  try{
    assert.throws(()=>api.canvasUploadHeaders('Bearer own-runtime'),/编辑会话/);
    const owner=api.createCanvasEditingOwner();assert.deepEqual(api.canvasUploadHeaders('Bearer own-runtime'),{Authorization:'Bearer own-runtime','X-GameCowork-Canvas-ID':id,'X-GameCowork-Canvas-Session':owner});
    for(const route of ['/codely-canvas/home','/codely-canvas/canvas','/codely-canvas/canvas/workspaceid=arbitrary','/codely-canvas/canvas/canvasid=../another']){globalThis.window.location.pathname=route;assert.throws(()=>api.canvasUploadHeaders('Bearer own-runtime'),/已保存/);}
    const entry=ledger.entries.find(row=>row.file==='assets/factory-tgvWNlik.js');
    assert.deepEqual(entry.patches.filter(patch=>patch.stage==='canvas-media-cache-scope'&&patch.sourceBinding).map(patch=>patch.sourceBinding).sort(),['S','b','n','w']);
    const source=fs.readFileSync(path.join(root,entry.file),'utf8');assert.equal((source.match(/\.\.\.gcwCanvasUploadHeaders\(u\(\)\)/g)||[]).length,4);
  }finally{globalThis.window=oldWindow;globalThis.sessionStorage=oldStorage;}
});

test('Sibling documents sharing one host storage have distinct owners and reload creates a new generation',()=>{
  const helper=fs.readFileSync(path.join(root,'canvas-local-auth.js'),'utf8');
  const top={},storage=new Map([['canvas-session-id','legacy-shared-owner']]);let reads=0,writes=0;
  const shared={getItem:key=>{reads++;return storage.get(key);},setItem:(key,value)=>{writes++;storage.set(key,value);}};
  const canvas=crypto.randomUUID();
  function document(){
    const context=vm.createContext({window:{top,location:{pathname:'/codely-canvas/canvas/canvasid='+canvas}},sessionStorage:shared,crypto:{randomUUID:crypto.randomUUID}});
    vm.runInContext(helper.replaceAll('export ','')+'\nthis.api={createCanvasEditingOwner,existingCanvasEditingOwner,canvasLocalApiHeaders,canvasUploadHeaders};',context);
    return context.api;
  }
  const a=document(),b=document();assert.equal(a.existingCanvasEditingOwner(),null);assert.equal(b.existingCanvasEditingOwner(),null);
  const first=a.createCanvasEditingOwner(),second=b.createCanvasEditingOwner();assert.notEqual(first,second);assert.equal(a.createCanvasEditingOwner(),first);
  assert.equal(a.canvasLocalApiHeaders('own')['X-GameCowork-Canvas-Session'],first);assert.equal(b.canvasUploadHeaders('own')['X-GameCowork-Canvas-Session'],second);
  const reload=document();assert.equal(reload.existingCanvasEditingOwner(),null);assert.throws(()=>reload.canvasUploadHeaders('own'),/编辑会话/);assert.notEqual(reload.createCanvasEditingOwner(),first);
  assert.equal(reads,0);assert.equal(writes,0);assert.equal(storage.get('canvas-session-id'),'legacy-shared-owner');
  const main=fs.readFileSync(path.join(root,'assets/index-A8ll_iBT.js'),'utf8');assert.match(main,/function jV\(\)\{if\(gcwCanvasIsLocalRoute\(\)\)return gcwCanvasCreateEditingOwner\(\);let e=`canvas-session-id`/);
});

test('Opening a saved local Canvas reads the committed graph even before its delayed browser snapshot catches up',async()=>{
  const main=fs.readFileSync(path.join(root,'assets/index-A8ll_iBT.js'),'utf8');
  const program=(await babel.parsers.babel.parse(main,{parser:'babel'})).program;
  const findFunction=name=>program.body.find(node=>node.type==='FunctionDeclaration'&&node.id?.name===name);
  const mh=findFunction('Mh'),gallery=findFunction('sb');assert.ok(mh&&gallery);
  function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node))if(!['loc','extra','comments','tokens'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit);}}
  let openAsset;walk(gallery,node=>{if(node.type==='VariableDeclarator'&&node.id?.name==='De')openAsset=node.init;});assert.ok(openAsset,'Extract the real gallery open callback');
  const calls=[];walk(program,node=>{if(node.type==='CallExpression'&&node.callee?.name==='Mh')calls.push(node);});
  assert.equal(calls.length,5,'Audit workspace deep-link, asset deep-link, workspace message, personal and organization gallery cache gates');
  const id=crypto.randomUUID(),user='gamecowork-local',stale={canvasId:id,ownerUserId:user,nodes:[{id:'text',data:{textContent:[{text:'STALE_BROWSER_SNAPSHOT'}]}}]};
  const committed={...stale,nodes:[{id:'text',data:{textContent:[{text:'COMMITTED_AFTER_AUTOSAVE'}]}}]};
  let local=true,stored=JSON.stringify(stale),storageReads=0,downloadCalls=0,cachedGraphReads=0;
  const opened=[];
  const context=vm.createContext({gcwCanvasIsLocalRoute:()=>local,localStorage:{getItem:()=>{storageReads++;return stored;}},Eh:'owned-snapshot',
    x:[{id,description:''}],Wh:()=>null,u:null,i:null,l:{id:user},c:()=> 'owned-runtime-session',
    jh:()=>{cachedGraphReads++;return stale;},Fm:async(token,canvasId)=>{assert.equal(canvasId,id);downloadCalls++;return committed;},
    e:(...args)=>opened.push(args),console:{error:()=>{}}});
  vm.runInContext(main.slice(mh.start,mh.end)+'\nthis.cacheMatches=Mh;this.openSaved='+main.slice(openAsset.start,openAsset.end)+';',context);
  assert.equal(context.cacheMatches(id,user),false);assert.equal(storageReads,0,'A persisted local graph does not consult a potentially stale snapshot');
  await context.openSaved(id);
  assert.equal(downloadCalls,1);assert.equal(cachedGraphReads,0);assert.equal(opened[0][0],committed,'The original callback forwards the exact committed graph, including all original node data');
  // No clock advance or timer flush: this is the window after the native PUT
  // commits and before the original delayed localStorage Nh snapshot fires.
  local=false;assert.equal(context.cacheMatches(id,user),true);await context.openSaved(id);
  assert.equal(downloadCalls,1);assert.equal(cachedGraphReads,1);assert.equal(opened[1][0],stale,'The nonlocal original branch retains its prior behavior');
  assert.equal(context.cacheMatches(id,'another-user'),false);assert.equal(context.cacheMatches(crypto.randomUUID(),user),false);
  local=true;stored=JSON.stringify({...stale,canvasId:null});assert.equal(context.cacheMatches(null,user),true,'An unsaved local draft can still use its original snapshot');
  for(const invalid of ['',undefined,'not-a-saved-id',id.toUpperCase()]){stored=JSON.stringify({...stale,canvasId:invalid});assert.equal(context.cacheMatches(invalid,user),true,'The local fast-path only recognizes canonical persisted IDs');}
  stored='malformed';assert.equal(context.cacheMatches(null,user),false);
  const patch=ledger.entries.find(row=>row.file==='assets/index-A8ll_iBT.js').patches.find(row=>row.stage==='saved-local-canvas-read-through');
  assert.equal(patch.replacement,'if(gcwCanvasIsLocalRoute()&&typeof e===`string`&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(e))return!1;');assert.equal(patch.sourceByteStart,patch.sourceByteEnd);
});
