const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const base=path.resolve(__dirname,'../../src/core/binary/out');
for(const file of ['index.js','index.beautified.js']) {
 const source=fs.readFileSync(path.join(base,file),'utf8');
 function section(from,to){const a=source.indexOf(from);const b=source.indexOf(to,a+from.length);assert.ok(a>=0&&b>a,`${file}: ${from}`);return source.slice(a,b);}
 test(`${file}: local mode neither loads nor refreshes a cloud configuration`,async()=>{
  let requests=0;let cacheReads=0;
  const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}},m(){},
   HI:{getInstance:()=>({getConfig:async()=>{requests++;throw Error('cloud must remain inactive');}})},
   lg:{existsSync:()=>{cacheReads++;return true;},readFileSync:()=>{cacheReads++;return 'old remote config';}},
   yua:()=>'/fixture/remote.yaml',COt:()=>null,FOt:new Map(),En:{warn(){}},
   fua:()=>'',G9e(){throw Error('cloud cache write');},wua(){},vua:()=>false});
  const code=section('function COt(t)','function G9e(t,')+'\n'+section('function Yua(t,','function Fua(t)');
  vm.runInContext(code,ctx);
  assert.equal(ctx.COt('local-user'),null);
  ctx.Yua('local-user','cached');
  assert.equal((await ctx.Vua('local-user')).supported,false);
  assert.equal(requests,0);assert.equal(cacheReads,0);
 });
 test(`${file}: nonlocal mode keeps remote config behavior`,async()=>{
  let requests=0;
  const ctx=vm.createContext({process:{env:{}},m(){},COt:()=>null,
   HI:{getInstance:()=>({getConfig:async()=>{requests++;return 'fixture cloud configuration';}})},
   G9e(){},wua(){},vua:()=>false,En:{warn(){}}});
  vm.runInContext(section('async function Vua(t)','function Fua(t)'),ctx);
  assert.equal((await ctx.Vua('fixture')).changed,true);assert.equal(requests,1);
 });
 test(`${file}: local YAML never enters the cloud-only loading branch`,()=>{
  const helper=section('async function eRi(t)','async function Lua(t)');
  assert.match(helper,/if\s*\(o\s*&&\s*process\.env\.GAMECOWORK_LOCAL_PROVIDER_MODE\s*!==\s*"1"\)/);
 });
 test(`${file}: an unconfigured local marketplace is explicitly unavailable`,async()=>{
  const anchor=source.indexOf('`/api/marketplace?');assert.ok(anchor>=0);
  const tail=source.slice(anchor);
  const prefix=tail.match(/p\s*=\s*async\s*\(G,\s*b\)\s*=>\s*\{if\(process\.env\.GAMECOWORK_LOCAL_PROVIDER_MODE==="1"\)return \{items:\[\],total:0,supported:false,reason:"A GameCowork marketplace source is not configured"\};/);
  assert.ok(prefix,`${file} contains the real remote fetch helper's local gate`);
  const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}}});
  const result=await vm.runInContext(`(async(G,b)=>${prefix[0].slice(prefix[0].indexOf('{'))}throw Error('remote fetch');})('skill',{})`,ctx);
  assert.equal(result.supported,false);assert.equal(result.total,0);assert.equal(result.items.length,0);
 });
 test(`${file}: local asset task polling reports an unconfigured Provider before any cloud authentication`,async()=>{
  const pattern=/n\("generator\/listTasks",\s*async\s*(?:\(G\)|G)\s*=>\s*\{(if\(process\.env\.GAMECOWORK_LOCAL_PROVIDER_MODE==="1"\)return \{tasks:\[\],total:0,page:1,size:0,supported:false,reason:"An asset generation Provider is not configured"\};)/;
  const matched=source.match(pattern);assert.ok(matched,'actual listTasks local gate');
  const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}}});
  const result=await vm.runInContext(`(async()=>{${matched[1]}throw Error('original cloud auth');})()`,ctx);
  assert.equal(result.supported,false);assert.equal(result.tasks.length,0);
 });
}
