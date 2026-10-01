const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
for(const file of['RightSideBarPanel-JSPvAs5c.js','RightSideBarPanel-B2OWNNNX.js']){
 const source=fs.readFileSync(path.join(__dirname,'../../src/frontend/bundle/assets',file),'utf8');const left=source.indexOf('async function gamecoworkStreamingLayout(');const end=source.indexOf('\n}',left);assert.ok(left>=0&&end>left);
 const helper=source.slice(left,end+2);
 test(`${file}: actual saved and restored tabs retain full-window capture mode`,()=>{
  const start=source.indexOf('function gamecoworkEditorCaptureMode('),stop=source.indexOf('async function gamecoworkStreamingLayout(',start);
  const ctx=vm.createContext({});vm.runInContext(source.slice(start,stop),ctx);
  assert.equal(ctx.gamecoworkEditorCaptureMode({viewType:'scene_view'}),'render-content');
  assert.equal(ctx.gamecoworkEditorCaptureMode({viewType:'inspector'}),'editor-window');
  const tabs=[{id:'own',viewType:'scene_view',captureMode:'editor-window',workspaceKey:'local:a',workspaceRoot:'F:/A',instanceId:-42}];
  const slots=ctx.vk([{activeTab:tabs[0]}],.5,null);assert.equal(slots[0].captureMode,'editor-window');
  const saved=ctx.xk([],tabs,slots,'saved',tabs[0],'now');assert.equal(saved.tabs[0].captureMode,'editor-window');assert.equal(saved.slots[0].captureMode,'editor-window');assert.equal(saved.tabs[0].instanceId,undefined);
  const mapStart=source.indexOf('const Qe = Me.tabs.map((ct, _t) => {'),mapEnd=source.indexOf('\n      gt = ',mapStart);assert.ok(mapStart>0&&mapEnd>mapStart);
  vm.runInContext(source.slice(mapStart,mapEnd).replace(/,\s*$/,';')+'globalThis.restored = Qe;',Object.assign(ctx,{Me:saved,Pe:1,workspaceKey:'local:other',e:'F:/other'}));
  assert.equal(ctx.restored[0].captureMode,'editor-window');assert.equal(ctx.restored[0].workspaceRoot,'F:/A');assert.equal(ctx.restored[0].instanceId,undefined);
 });
 test(`${file}: local Wry layout uses the actual HTTP host instead of an absent Tauri invoke`,async()=>{
  const calls=[];const ctx=vm.createContext({window:{GAMECOWORK_SHELL:true,location:{origin:'http://127.0.0.1:31000'}},crypto:{randomUUID:()=> 'owned-layout'},fetch:async(url,init)=>{calls.push({url,body:JSON.parse(init.body)});return{ok:true,json:async()=>({data:{status:'success',content:'{"kind":"fixture"}'}})}},ru(){throw Error('Tauri was called');}});
  vm.runInContext(helper,ctx);assert.equal(await ctx.gamecoworkStreamingLayout('read_unity_streaming_layout'),'{"kind":"fixture"}');assert.equal(calls[0].body.messageType,'read_unity_streaming_layout');assert.equal(calls[0].body.messageId,'owned-layout');
  ctx.fetch=async()=>({ok:true,json:async()=>({data:{status:'error',error:'controlled preference failure'}})});await assert.rejects(ctx.gamecoworkStreamingLayout('save_unity_streaming_layout',{contents:'fixture'}),/controlled preference failure/);
 });
 test(`${file}: other hosts preserve their native Tauri layout contract`,async()=>{
  const calls=[];const ctx=vm.createContext({window:{GAMECOWORK_SHELL:false},ru:async(...args)=>{calls.push(args);return 'native result';}});vm.runInContext(helper,ctx);const args={contents:'native'};assert.equal(await ctx.gamecoworkStreamingLayout('save_unity_streaming_layout',args),'native result');assert.equal(calls[0][1],args);
 });
 test(`${file}: closing a preview awaits its actual layout snapshot before tearing down the iframe`,async()=>{
  const start=source.indexOf('    xs = T.useCallback(');assert.ok(start>=0);const body=source.slice(start,source.indexOf('\n        else if (Ze === "git"',start));
  assert.match(body,/async \(Ze\) =>/);const branch=body.slice(body.indexOf('if (Ze === "unity")'));
  let release;const order=[];const pending=new Promise(resolve=>release=resolve);
  const close=vm.runInNewContext(`(async Ze=>{${branch}})`,{pt:async()=>{order.push('snapshot');await pending;order.push('saved');},yt:async()=>order.push('stop'),nr:()=>order.push('remove')});
  const completion=close('unity');await Promise.resolve();assert.deepEqual(order,['snapshot']);release();await completion;assert.deepEqual(order,['snapshot','saved','stop','remove']);
 });
}
