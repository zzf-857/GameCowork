const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const test=require('node:test');const assert=require('node:assert/strict');
const base=path.join(__dirname,'../restored/core-gamecowork-binary/binary/out');
for(const file of['index.js','index.beautified.js']){
 const source=fs.readFileSync(path.join(base,file),'utf8');
 const start=source.indexOf('function gcuHistorySessionId(value)');const end=source.indexOf('var Fje',start);assert.ok(start>=0&&end>start);const helper=source.slice(start,end);
 function method(name){const start=source.indexOf(`async ${name}(e,n)`,source.indexOf('var Fje'));assert.ok(start>=0,name);const end=source.indexOf('\n }',start);assert.ok(end>start);return source.slice(start,end+3);}
 function context(changes=1){const operations=[];const ctx=vm.createContext({yl:async()=>({run:async(...args)=>{operations.push(args);return{changes};}}),Date});vm.runInContext(helper,ctx);return{ctx,operations};}
 function handler(name,next,ctx){const start=source.indexOf(`n("${name}",`);const end=source.indexOf(`n("${next}",`,start);assert.ok(start>=0&&end>start);ctx.n=(name,callback)=>ctx.callback=callback;vm.runInContext(source.slice(start,end)+'undefined;',ctx);return ctx.callback;}
 test(`${file}: IDs are rejected before any path or database operation`,()=>{
  const {ctx}=context();for(const id of['../outside','a/b','a\\b','CON','NUL.json','x:y','',undefined,17])assert.throws(()=>ctx.gcuHistorySessionId(id),/Invalid session ID/);
  assert.equal(ctx.gcuHistorySessionId('bfda37cf-f8a4-48d7-aeb7-27a6c49681dc'),'bfda37cf-f8a4-48d7-aeb7-27a6c49681dc');
  const loadStart=source.indexOf('n("history/load",');const guard=source.indexOf('gcuHistorySessionId(G.data?.id)',loadStart);assert.ok(guard>loadStart&&guard<source.indexOf('GO(b)',loadStart));
 });
 test(`${file}: rename checks input and actual updated rows`,async()=>{
  const yes=context();const rename=vm.runInContext(`({${method('renameTitle')}}).renameTitle`,yes.ctx);
  await rename('fixture-session','  用户标题  ');assert.equal(yes.operations[0][1],'用户标题');
  for(const title of['',null,' '.repeat(10),'x'.repeat(257)])await assert.rejects(rename('fixture-session',title),/title/);
  const missing=context(0);const absent=vm.runInContext(`({${method('renameTitle')}}).renameTitle`,missing.ctx);await assert.rejects(absent('missing','valid'),/not found/);
 });
 test(`${file}: state updates have real row and state validation`,async()=>{
  const good=context();const update=vm.runInContext(`({${method('updateState')}}).updateState`,good.ctx);
  for(const state of['active','pinned','archived'])await update('fixture-session',state);assert.equal(good.operations.length,3);
  await assert.rejects(update('fixture-session','fabricated-state'),/Invalid session state/);
  const missing=context(0);const updateMissing=vm.runInContext(`({${method('updateState')}}).updateState`,missing.ctx);await assert.rejects(updateMissing('missing','active'),/not found/);
 });
 test(`${file}: save and rename propagate actual storage errors`,async()=>{
  for(const [name,next,managerMethod,data]of[['history/save','history/updateState','saveSessionMeta',{sessionId:'fixture'}],['history/renameTitle','history/markAsRead','renameTitle',{sessionId:'fixture',title:'Name'}]]){
   const {ctx}=context();ctx.console={error(){}};ctx.t={acpSessionRegistry:new Map(),acpHistoryManager:{[managerMethod]:async()=>{throw Error('controlled disk write failed');}}};
   await assert.rejects(handler(name,next,ctx)({data}),/controlled disk write failed/);
  }
 });
 test(`${file}: delete awaits durable metadata before notifying the GUI`,async()=>{
  const {ctx}=context();let release;let notifications=0;
  const deletion=new Promise(resolve=>release=resolve);ctx.GOe={delete:()=>deletion};ctx.console={debug(){},error(){}};
  ctx.t={acpContextUsageBySessionId:new Map(),getHolder:()=>({dispose:async callbacks=>{await callbacks.deleteHistory();}}),pushHistoryListChanged:()=>notifications++};
  const pending=handler('history/delete','history/load',ctx)({data:{id:'fixture-session'}});await Promise.resolve();assert.equal(notifications,0);
  release();await pending;assert.equal(notifications,1);
 });
}
