const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const test=require('node:test');const assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../../src/core/binary/out');
for(const file of ['index.js','index.beautified.js']) {
  const source=fs.readFileSync(path.join(base,file),'utf8');
  const start=source.indexOf('async function Lua(t)');const end=source.indexOf('async function nRi(t)',start);
  const lua=source.slice(start,end);
  const xStart=source.indexOf('async function Xx(t)');
  const gate=file==='index.js'?'if(w||!f)return':'  if (w || !f) return';
  const xEnd=source.indexOf(gate,xStart);
  assert.ok(start>=0&&end>start&&xStart>=0&&xEnd>xStart);
  const jsonLoader=source.slice(xStart,xEnd)+'return {config:f,errors:y,configLoadInterrupted:w};}';
  function fixture(local,token) {
    let getterCalls=0;let imported=0;let forwardedToken;
    const config=()=>({modelsByRole:{chat:[],edit:[],apply:[],summarize:[]}});
    const profiles={profiles:[{name:'local:fixture-model',model:'fixture-model',roles:['model']}]};
    const input={ide:{getIdeInfo:async()=>({ideType:'gamecowork-desktop'}),getUniqueId:async()=> 'fixture-user'},
      ideSettings:{},ideSettingsPromise:Promise.resolve({}),uniqueId:'fixture-user',controlPlaneClient:{getAccessToken:async()=>token,isSignedIn:async()=>!!token},
      getGameCoworkModelProfilesList:async()=>{getterCalls++;return profiles;}};
    const globals={process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:local?'1':''}},
      HI:{getInstance:()=>({getAccessToken:()=>token})},
      eRi:async()=>({config:{},errors:[]}),tRi:async(options)=>{forwardedToken=options.accessToken;return{config:config(),errors:[]};},
      Nua:async(options)=>{const actual=options.gamecoworkModelProfilesList||await options.getGameCoworkModelProfilesList();
        for(const model of actual.profiles){options.config.modelsByRole.chat.push({title:model.model,extras:{customModelId:model.name}});imported++;}},
      $l:{getInstance:()=>({getSharedConfig:()=>({})})},gfe:(value)=>value,
      Jw:()=>'/fixture/config.json',QOt:{default:{existsSync:()=>false}},dua:()=>{},hd:value=>value,mO:()=>'/fixture/config.yaml',
      cua:async()=>({config:config(),errors:[],configLoadInterrupted:false})};
    const ctx=vm.createContext(globals);vm.runInContext(lua+'\n'+jsonLoader,ctx);
    return {input,ctx,stats:()=>({getterCalls,imported,forwardedToken})};
  }
  test(`${file}: local YAML loads configured models without manufacturing a cloud token`,async()=>{
    const f=fixture(true,undefined);const result=await f.ctx.Lua(f.input);
    assert.equal(result.config.modelsByRole.chat[0].extras.customModelId,'local:fixture-model');
    assert.equal(f.stats().getterCalls,1);assert.equal(f.stats().forwardedToken,undefined);
  });
  test(`${file}: nonlocal YAML keeps its original cloud authentication gate`,async()=>{
    const anonymous=fixture(false,undefined);assert.equal((await anonymous.ctx.Lua(anonymous.input)).config.modelsByRole.chat.length,0);
    assert.equal(anonymous.stats().getterCalls,0);
    const signed=fixture(false,'synthetic-cloud-token');assert.equal((await signed.ctx.Lua(signed.input)).config.modelsByRole.chat.length,1);
    assert.equal(signed.stats().forwardedToken,'synthetic-cloud-token');
  });
  test(`${file}: local JSON imports the same provider profiles`,async()=>{
    const f=fixture(true,undefined);const result=await f.ctx.Xx(f.input);
    assert.equal(result.config.modelsByRole.chat[0].extras.customModelId,'local:fixture-model');
    assert.equal(f.stats().getterCalls,1);
    const legacy=fixture(false,undefined);assert.equal((await legacy.ctx.Xx(legacy.input)).config.modelsByRole.chat.length,0);
  });
}
