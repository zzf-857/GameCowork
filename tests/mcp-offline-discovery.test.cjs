const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
for(const file of['index.js','index.beautified.js']){
 const source=fs.readFileSync(path.join(__dirname,'../restored/core-gamecowork-binary/binary/out',file),'utf8');const start=source.indexOf('async function gcuOfflineMcpDiscovery');const end=source.indexOf('async function gcuStoredSessionMode',start);assert.ok(start>=0&&end>start);const helper=source.slice(start,end);
 test(`${file}: no-model MCP enumeration reads real configured metadata without starting an authenticated Agent`,async()=>{
  const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}},mc:()=>'/own-cli',bMt:()=>({userMcpServers:{local:{command:'own-runner'}},workspaceMcpServers:{local:{command:'workspace-runner'},other:{httpUrl:'http://127.0.0.1:39999/mcp'}}}),gcuPersistedSessionModel:()=>null});vm.runInContext(helper,ctx);
  let discovery;const core={getAnyAcpEntry:()=>null,configHandler:{loadConfig:async()=>({config:{}})},getWorkspaceCwd:async()=>'/own-workspace',acpMcpServerToMcpServerStatus:records=>{discovery=records;return records;},getOrCreateAcpEntry(){throw Error('Authentication was started');}};
  const result=await ctx.gcuOfflineMcpDiscovery(core);assert.equal(result.discoveryState,'deferred');assert.equal(result.reason,'model_not_configured');assert.equal(result.servers.length,2);assert.equal(discovery.find(server=>server.name==='local').config.command,'workspace-runner');assert.ok(discovery.every(server=>server.status==='disconnected'));
 });
 test(`${file}: a configured model, live Agent or nonlocal host retains genuine ACP discovery`,async()=>{
  const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}},gcuPersistedSessionModel:()=>({title:'configured'})});vm.runInContext(helper,ctx);const core={getAnyAcpEntry:()=>null,configHandler:{loadConfig:async()=>({config:{}})}};assert.equal(await ctx.gcuOfflineMcpDiscovery(core),null);core.getAnyAcpEntry=()=>({live:true});assert.equal(await ctx.gcuOfflineMcpDiscovery(core),null);ctx.process.env.GAMECOWORK_LOCAL_PROVIDER_MODE='';assert.equal(await ctx.gcuOfflineMcpDiscovery(core),null);
 });
}
