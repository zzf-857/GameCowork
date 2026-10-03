// Execute only the maintained transport helpers/hook with inert test doubles.
// No original Canvas application bundle, token service or external API is run.
import fs from 'node:fs';import vm from 'node:vm';import test from 'node:test';import assert from 'node:assert/strict';
const root=new URL('../../src/frontend/bundle/assets/',import.meta.url);
const extract=(source,name)=>{const start=source.indexOf('function '+name+'(');assert.ok(start>=0,name+' exists');const end=source.indexOf('\n}',start);assert.ok(end>start);return source.slice(start,end+2);};
const cases=[['index-BRxZ4eG7.js','RightSideBarPanel-JSPvAs5c.js','ox','cJ'],['index-DvRYaIVa.js','RightSideBarPanel-B2OWNNNX.js','rx','iJ']];
for(const[mainFile,sidebarFile,originName,urlName]of cases){
  const main=fs.readFileSync(new URL(mainFile,root),'utf8'),sidebar=fs.readFileSync(new URL(sidebarFile,root),'utf8');
  test(mainFile+' default sidebar URL preserves actual native workspace identity and the independent nonlocal route',()=>{
    for(const local of [true,false]){
      const window={GAMECOWORK_SHELL:local,location:{origin:'http://127.0.0.1:43333'}};window.parent=window;
      const ctx=vm.createContext({window,URL,URLSearchParams,ad:()=> 'dark',Ad:()=> 'dark'});
      vm.runInContext(extract(main,'gamecoworkUsesLocalAssetPage')+'\n'+extract(main,'gamecoworkAssetLocalUrl'),ctx);
      const start=main.indexOf('const '+originName+' = '),end=main.indexOf(',\n',start);assert.ok(start>0&&end>start);
      vm.runInContext(main.slice(start,end)+';\n'+extract(main,urlName),ctx);
      const workspace='local:F%3A%2Fowned%2Fproject',url=new URL(ctx[urlName]('F:/owned/Project 中文',workspace));
      assert.equal(url.origin,local?window.location.origin:'https://aicanvas.tuanjie.cn');
      assert.equal(url.pathname,local?'/codely-canvas/home':'/');
      assert.equal(url.searchParams.get('workspace_name'),'Project 中文');
      assert.match(url.searchParams.get('workspace_hash'),/^[a-f0-9]{8}$/);
      assert.equal(url.searchParams.get('gamecoworkWorkspace'),local?workspace:null);
      assert.equal(new URL(ctx[urlName]('',workspace)).pathname,local?'/codely-canvas/home':'/');
    }
  });
  test(sidebarFile+' existing iframe receives the native workspace key and keeps its actual sandbox/menu',()=>{
    const calls=[],ctx=vm.createContext({f:{jsx:(type,props)=>({type,props})},Lt:(...values)=>values.filter(Boolean).join(' '),$g:(...args)=>{calls.push(args);return'/owned-canvas';}});
    vm.runInContext(extract(sidebar,'pw'),ctx);const ref={};const tree=ctx.pw({isActive:true,workspaceRoot:'F:/owned/project',workspaceKey:'local:owned',title:'AI画布',iframeRef:ref});
    assert.deepEqual(calls,[['F:/owned/project','local:owned']]);assert.equal(tree.props.children.type,'iframe');assert.equal(tree.props.children.props.src,'/owned-canvas');assert.equal(tree.props.children.props.ref,ref);
    assert.match(tree.props.children.props.sandbox,/allow-scripts allow-same-origin/);
    assert.match(sidebar,/Ee && f\.jsx\(pw, \{ isActive: De, workspaceRoot: l, workspaceKey: e\.previewWorkspaceKey/);
    assert.match(sidebar,/label: t\("rightSidebar.aiCanvasTab"\),\s+onClick: \(\) => N\("aiCanvas"\)/);
  });
  function bridge(local,accessToken){
    const effects=[],cleanups=[],listeners=new Map(),sent=[],tokenRequests=[],refreshed=[],downloads=[];
    const frame={postMessage:(message,origin)=>sent.push({message,origin})};
    const window={location:{origin:'http://127.0.0.1:43333'},addEventListener:(kind,fn)=>listeners.set(kind,fn),removeEventListener:(kind,fn)=>{if(listeners.get(kind)===fn)listeners.delete(kind);}};
    const ctx=vm.createContext({window,document:{documentElement:{getAttribute:()=> 'dark'}},MutationObserver:class{observe(){}disconnect(){}},gamecoworkUsesLocalCanvas:()=>local,
      T:{useRef:value=>({current:value}),useState:value=>[typeof value==='function'?value():value,()=>{}],useCallback:fn=>fn,useEffect:fn=>effects.push(fn)},
      qa:local?window.location.origin:'https://aicanvas.tuanjie.cn',ru:kind=>{tokenRequests.push(kind);return Promise.resolve(null);},downloadGameCoworkMedia:(...args)=>downloads.push(args),gamecoworkNotifyDownload:()=>{},console,fetch:()=>{throw Error('No HTTP request expected in bridge fixture');}});
    vm.runInContext(extract(sidebar,'ip')+'\n'+extract(sidebar,'zT'),ctx);
    const ref=ctx.zT({enabled:true,accessToken,workspaces:[{workspaceName:'Owned',workspaceHash:'local:owned'}],onRefreshWorkspaces:()=>refreshed.push(true)});ref.current={contentWindow:frame};
    for(const effect of effects){const cleanup=effect();if(typeof cleanup==='function')cleanups.push(cleanup);}
    return{sent,tokenRequests,refreshed,downloads,deliver:(data,extra={})=>listeners.get('message')?.({data,origin:ctx.qa,source:frame,...extra}),close:()=>cleanups.forEach(fn=>fn()),effects,listeners,origin:ctx.qa};
  }
  test(sidebarFile+' native ready/workspace bridge never fetches or forwards a platform token',()=>{
    for(const token of [undefined,'owned-test-platform-token-must-not-forward']){
      const f=bridge(true,token);f.deliver({type:'ai-canvas-ready'});
      assert.equal(f.tokenRequests.length,0);assert.deepEqual(f.sent.map(value=>value.message.type),['gamecowork:local-session-changed','embed-style','codely:workspaces']);assert.ok(f.sent.every(value=>value.origin===f.origin&&!Object.hasOwn(value.message,'token')));
      const count=f.sent.length;f.deliver({type:'ai-canvas-ready'},{origin:'https://aicanvas.tuanjie.cn'});f.deliver({type:'ai-canvas-ready'},{source:{}});assert.equal(f.sent.length,count);
      f.deliver({type:'codely:refreshWorkspaces'});assert.equal(f.refreshed.length,1);f.close();assert.equal(f.listeners.size,0);
    }
  });
  test(sidebarFile+' nonlocal original bridge remains distinct from native local identity',()=>{
    const f=bridge(false,'owned-nonlocal-test-token');f.deliver({type:'ai-canvas-ready'});
    assert.equal(f.sent[0].message.type,'cowork-token');assert.equal(f.sent[0].origin,'https://aicanvas.tuanjie.cn');assert.equal(f.sent[2].message.type,'codely:workspaces');f.close();
  });
  test(sidebarFile+' only its real local iframe can initiate a native media save',()=>{
    const f=bridge(true),message={type:'openurl',url:'http://127.0.0.1:43333/api/codely-generator/local-inputs/i_owned/image.png',filename:'image.png'};
    f.deliver(message,{origin:'https://outside.invalid'});f.deliver(message,{source:{}});assert.equal(f.downloads.length,0);
    f.deliver(message);assert.equal(f.downloads.length,1);assert.equal(f.downloads[0][0],message.url);assert.equal(f.downloads[0][1],message.filename);
    f.close();f.deliver(message);assert.equal(f.downloads.length,1);
  });
}
