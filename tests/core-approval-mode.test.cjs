const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const base=path.join(__dirname,'../restored/core-gamecowork-binary/binary/out');
for(const file of['index.js','index.beautified.js']){
 const source=fs.readFileSync(path.join(base,file),'utf8');
 const from=source.indexOf('async function gcuStoredSessionMode(');const end=source.indexOf('function gcuHistorySessionId',from);assert.ok(from>=0&&end>from);const helper=source.slice(from,end);
 const modeStart=source.indexOf('n("config/updateSelectMode",');const modeEnd=source.indexOf('n("acp/getSessionMode",',modeStart);assert.ok(modeStart>=0&&modeEnd>modeStart);const modeHandler=source.slice(modeStart,modeEnd);
 test(`${file}: saved strict mode applies only when a local prompt lacks an explicit mode`,async()=>{
  let reads=0;const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}}});vm.runInContext(helper,ctx);
  const core={acpHistoryManager:{loadSessionMode:async()=>{reads++;return{collaborationMode:'default',approvalMode:'default'};}}};
  const input={data:{continueSessionId:'fixture'}};const actual=await ctx.gcuStoredSessionMode(core,input,'fixture');assert.equal(actual.data.approvalMode,'default');assert.ok(input.data.approvalMode===undefined);
  for(const data of[{approvalMode:'autoEdit'},{collaborationMode:'ask',approvalMode:'default'},{mode:'yolo'}]){const input={data};assert.equal(await ctx.gcuStoredSessionMode(core,input,'fixture'),input);}
  assert.equal(reads,1);ctx.process.env.GAMECOWORK_LOCAL_PROVIDER_MODE='';assert.equal(await ctx.gcuStoredSessionMode(core,input,'fixture'),input);assert.equal(reads,1);
 });
 test(`${file}: choosing strict mode before the first prompt persists without spawning an Agent`,async()=>{
  let saved;const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}},console:{warn(){}},gcuHistorySessionId:id=>id,
   t:{getHolder:()=>({current:undefined}),acpHistoryManager:{saveSessionMode:async(...args)=>saved=args}},n:(name,fn)=>ctx.callback=fn,
   WZa(){throw Error('Unconfigured Agent must not be spawned by a preference');}});
  vm.runInContext(modeHandler+'undefined;',ctx);const result=await ctx.callback({data:{continueSessionId:'fixture',collaborationMode:'default',approvalMode:'default'}});
  assert.equal(result.deferred,true);assert.deepEqual(saved,['fixture','default','default']);
 });
 test(`${file}: live strict mode reaches the real manager protocol as an explicit default`,async()=>{
  const commands=[];const entry={acpSessionId:'actual-acp',collaborationMode:'default',approvalMode:'autoEdit',manager:{modeRequest:async(...args)=>commands.push(args)}};
  const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}},console:{warn(){}},
   t:{getHolder:()=>({current:entry}),acpHistoryManager:{saveSessionMode:async()=>{}}},n:(name,fn)=>ctx.callback=fn,
   WZa:async(core,id,callback)=>callback(entry)});
  vm.runInContext(modeHandler+'undefined;',ctx);await ctx.callback({data:{continueSessionId:'fixture',collaborationMode:'default',approvalMode:'default'}});
  assert.deepEqual(commands,[['actual-acp','default','default']]);assert.equal(entry.approvalMode,'default');
 });
}
