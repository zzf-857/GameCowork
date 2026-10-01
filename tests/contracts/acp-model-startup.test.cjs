const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),test=require('node:test'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../src/core/binary/out');
for(const file of ['index.js','index.beautified.js']) {
  const source=fs.readFileSync(path.join(root,file),'utf8');const raw=file==='index.js';
  const begin=source.indexOf(raw?'async function Tma(t,e,n)':'async function Tma(t, e, n)');
  const end=source.indexOf(raw?'let c=(async()=>{':'  let c = (async () => {',begin);
  assert.ok(begin>=0&&end>begin);
  const helperStart=source.indexOf('function gcuPersistedSessionModel(');
  const prefix=source.slice(helperStart,begin)+source.slice(begin,end)+'return {prepared:n};}';
  const model={title:'Saved local model',model:'fixture-model',extras:{customModelId:'fixture-id'}};
  function fixture(local=true) {
    let loads=0,syncs=0;const restarts=[];
    const owner={configHandler:{loadConfig:async()=>{loads++;return{config:{selectedModelByRole:{chat:model}}};}},
      acpSessionRegistry:new Map(),acpInitializing:new Map(),defaultMemoryRWMode:'RW',
      restartAcpProcessForSession:async(id,entry,options)=>{restarts.push({id,entry,options});return {restarted:true,options};}};
    const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:local?'1':''}},console:{debug:()=>{}},Date,
      pV:config=>config?.selectedModelByRole?.chat,Iya:async(t,value)=>{syncs++;t.activeCustomModel={id:value.extras.customModelId};},
      oV:()=>[{id:'fixture-id',model:'fixture-model',displayName:model.title,providerId:'own-provider',wireApi:'chat',roles:['model']}],
      Cfi:()=> 'chat',wUt:t=>t.activeCustomModel?{credential:'fixture'}:{},lUt:()=>({}),T9e:()=>undefined,vfi:()=>true,
      iUt:(a,b)=>JSON.stringify(a)===JSON.stringify(b),Afi:(entry,options)=>entry.modelTitle===options?.currentSelectedModel?.title});
    vm.runInContext(prefix,ctx);
    return {ctx,owner,restarts,stats:()=>({loads,syncs})};
  }
  test(`${file}: history-first initialization restores a saved local model and credentials`,async()=>{
    const f=fixture();const result=await f.ctx.Tma(f.owner,'history-session',{modelTitle:model.title,cwdOverride:'fixture'});
    assert.equal(result.prepared.currentSelectedModel.title,model.title);assert.equal(f.owner.activeCustomModel.id,'fixture-id');
    assert.deepEqual(f.stats(),{loads:1,syncs:1});
  });
  test(`${file}: model-less prewarm failure retries once with newly selected local credentials`,async()=>{
    const f=fixture();const pending=Promise.reject(new Error('Authentication required'));pending.catch(()=>{});
    f.owner.acpInitializing.set('session',pending);
    const result=await f.ctx.Tma(f.owner,'session',{currentSelectedModel:model});
    assert.equal(result.prepared._gcuInitRetried,true);assert.equal(f.owner.acpInitializing.size,0);
    const exhausted=fixture();const failure=Promise.reject(new Error('Real configured provider failure'));failure.catch(()=>{});
    exhausted.owner.acpInitializing.set('session',failure);
    await assert.rejects(exhausted.ctx.Tma(exhausted.owner,'session',{currentSelectedModel:model,_gcuInitRetried:true}),/Real configured provider failure/);
  });
  test(`${file}: joining an obsolete initializing model restarts instead of reusing the wrong one`,async()=>{
    const f=fixture();const old={modelTitle:'Old model',lastUsedAt:0};f.owner.acpInitializing.set('session',Promise.resolve(old));
    const result=await f.ctx.Tma(f.owner,'session',{currentSelectedModel:model});
    assert.equal(result.restarted,true);assert.equal(f.restarts[0].options.currentSelectedModel.title,model.title);
  });
  test(`${file}: nonlocal host preserves existing initialization and authentication behavior`,async()=>{
    const f=fixture(false);const old={modelTitle:'Original host',lastUsedAt:0};f.owner.acpInitializing.set('session',Promise.resolve(old));
    assert.equal(await f.ctx.Tma(f.owner,'session',{}),old);assert.deepEqual(f.stats(),{loads:0,syncs:0});
  });
  test(`${file}: persisted model choice survives an empty lazy profile without selecting another provider`,async()=>{
    const f=fixture();f.owner.configHandler.loadConfig=async()=>({config:{modelsByRole:{chat:[]},selectedModelByRole:{}}});
    const result=await f.ctx.Tma(f.owner,'restored',{modelTitle:model.title});
    assert.equal(result.prepared.currentSelectedModel.extras.customModelId,'fixture-id');
    assert.equal(f.owner.activeCustomModel.id,'fixture-id');
  });
  test(`${file}: saved session model wins over another selected workspace provider`,()=>{
    const f=fixture();const other={title:'Other provider',model:'other',extras:{customModelId:'other-id'}};
    const resolved=f.ctx.gcuPersistedSessionModel(f.owner,other,model.title);
    assert.equal(resolved.extras.customModelId,'fixture-id');
    assert.throws(()=>f.ctx.gcuPersistedSessionModel(f.owner,other,'Deleted model'),/no longer configured/);
  });
}
