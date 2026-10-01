// Real Rust host -> real core -> reconstructed compiled Agent -> loopback model.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {startMockProvider} from './mock-provider.mjs';
const project=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2);const opt=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const packaged=args.includes('--packaged');const appRoot=path.resolve(opt('--app-root',path.join(project,'app')));
assert.ok(args.includes('--package'), 'Specify --package with a freshly built, guarded CLI package.');
const pkg=path.resolve(opt('--package'));
const agentManifest=JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8'));
assert.equal(agentManifest.testGuardIncluded,true);
if(packaged){const productAgent=JSON.parse(fs.readFileSync(path.join(appRoot,'cli/cli-package-manifest.json'),'utf8'));assert.equal(productAgent.testGuardIncluded,false);assert.equal(productAgent.sourceSha256,agentManifest.sourceSha256,'Guarded verification Agent must match the packaged Agent source.');}
const root=path.resolve('F:/AI/AgentMake/temp/GameCowork',`command-refresh-race-${randomUUID()}`);
const workspace=path.join(root,'workspace');fs.mkdirSync(workspace,{recursive:true});
const workspaceB=path.join(root,'workspace B');fs.mkdirSync(workspaceB);
const file=path.join(workspace,'fixture.txt');fs.writeFileSync(file,'GCW_FIXTURE_FILE_CONTENT\n');
const mock=await startMockProvider({toolPlans:{GCW_E2E_REFRESH_COMMAND:{steps:[]}}});
for(const root of [workspace,workspaceB]){fs.mkdirSync(path.join(root,".gamecowork-cli/commands"),{recursive:true});fs.writeFileSync(path.join(root,".gamecowork-cli/commands/owned-refresh.toml"),'prompt = "GCW_E2E_REFRESH_COMMAND: saved loopback command"\n');fs.writeFileSync(path.join(root,".gamecowork-cli/settings.json"),JSON.stringify({disableNextSpeakerCheck:true}));}
const env={...process.env};
for(const key of Object.keys(env)) if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete env[key];
const core=packaged?path.join(appRoot,'core'):path.join(project,'restored/core-gamecowork-binary/binary/out');
Object.assign(env,{GAMECOWORK_DEBUG:'1',GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_APP_ROOT:appRoot,
  GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_FRONTEND_DIR:packaged?path.join(appRoot,'frontend'):path.join(project,'restored/frontend/dist-beautified'),
  GAMECOWORK_DATA_DIR:path.join(root,'data'),GAMECOWORK_AGENT_PATH:path.join(pkg,'gamecowork.exe'),GAMECOWORK_AGENT_RESOURCE_DIR:path.join(pkg,'resources'),
  GAMECOWORK_SMOKE_ROOT:root,GAMECOWORK_SMOKE_CLI_PATH:path.join(pkg,'gamecowork.exe'),
  GAMECOWORK_CLI_PROBE_ROOT:root,GAMECOWORK_CLI_PROBE_SOURCE:pkg,NODE_OPTIONS:`--require ${JSON.stringify(path.join(project,'tests/core-chat-spawn-guard.cjs'))}`});
const binary=path.resolve(opt('--binary',packaged?path.join(appRoot,'GameCowork.exe'):path.join(project,'restored/shell/target/debug/GameCowork.exe')));
let shell;
let log='',origin;const checks=[],timings=[];const frames=[];let eventsAbort,eventPump,eventError;
const ownedPids=[],cleanup=[];
const check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(`${name}: PASS`);};
function launchHost(){origin=undefined;const current=spawn(binary,[],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});shell=current;ownedPids.push(current.pid);console.log(`OWN_HOST_PID=${current.pid}`);for(const output of[current.stdout,current.stderr])output.on('data',chunk=>{const text=chunk.toString();log+=text;const match=text.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match&&current===shell)origin=match[1];});}
launchHost();
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(test,name,ms=60000){const end=Date.now()+ms;while(Date.now()<end){if(eventError)throw eventError;if(test())return;await delay(20);}throw Error(name);}
async function rpc(kind,data,workspaceKey){const started=Date.now(),id=randomUUID();const response=await fetch(new URL('/api/tauri/invoke',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:{messageType:kind,messageId:id,data},...(workspaceKey?{workspaceKey}:{})}),signal:AbortSignal.timeout(30000)});const result=await response.json();assert.ok(response.ok,`${kind}: HTTP ${response.status}`);for(const value of[result?.data,result?.data?.content,result?.data?.content?.result])if(value?.status==='error'||value?.success===false)throw Error(`${kind}: ${value.error||'Inner operation failed'}`);timings.push({kind,id,workspaceKey,elapsedMs:Date.now()-started});return {id,result};}
async function subscribe(){eventError=undefined;const controller=new AbortController();eventsAbort=controller;const events=await fetch(new URL('/api/tauri/events',origin),{signal:controller.signal});eventPump=(async()=>{let carry='';const decoder=new TextDecoder();try{for await(const bytes of events.body){carry+=decoder.decode(bytes,{stream:true}).replace(/\r\n/g,'\n');let p;while((p=carry.indexOf('\n\n'))>=0){const block=carry.slice(0,p);carry=carry.slice(p+2);const data=block.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trim()).join('\n');if(data){const envelope=JSON.parse(data);frames.push(envelope.inner?{...envelope.inner,_hubWorkspaceKey:envelope.hubWorkspaceKey}:envelope);}}}}catch(error){if(!controller.signal.aborted)eventError=error;}})();}
async function stopHost(){eventsAbort?.abort();await eventPump?.catch(()=>{});if(shell.exitCode===null){const current=shell;const exited=new Promise(resolve=>current.once('exit',resolve));await promisify(execFile)('taskkill.exe',['/PID',String(current.pid),'/F'],{windowsHide:true});await exited;cleanup.push({pid:current.pid,exited:current.exitCode!==null});}}
function chatFrames(id){return frames.filter(frame=>frame.messageId===id&&frame.messageType==='llm/streamChat');}
async function startChat(key,sid,title,text){const id=randomUUID();const ack=await fetch(new URL('/api/tauri/invoke',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:{messageType:'llm/streamChat',messageId:id,data:{messages:[{role:'user',content:text}],continueSessionId:sid,title,currentModel:title,completionOptions:{},messageOptions:{},_deferResponseToSse:true}},workspaceKey:key})}).then(response=>response.json());assert.equal(ack,null);return{id,key,sid};}
async function completeChat(chat,marker){await until(()=>chatFrames(chat.id).some(frame=>frame.data?.done),'Actual stream did not complete');const chunks=chatFrames(chat.id),last=chunks.find(frame=>frame.data?.done);if(last.data.status==='error')throw Error(`Actual stream failed: ${last.data.error}`);check('Actual stream terminal success',last.data.status==='success');check('All stream frames kept their workspace route',chunks.every(frame=>frame._hubWorkspaceKey===chat.key));check(`Actual output ${marker} traversed Core/SSE`,JSON.stringify(chunks).includes(marker));check('A real command content frame survives concurrent refresh',chunks.some(frame=>frame.data.done===false));return chunks;}
function assistantText(value){if(Array.isArray(value))return value.map(assistantText).join('');if(value&&typeof value==='object'){if(value.role==='assistant'&&typeof value.content==='string')return value.content;return Object.values(value).map(assistantText).join('');}return '';}
try{
  await until(()=>origin,'Host startup',35000);await subscribe();
  const opened=await fetch(new URL('/api/tauri/hub/open-workspace',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:workspace})}).then(r=>r.json()),key=opened.workspaceKey;
  const openedB=await fetch(new URL('/api/tauri/hub/open-workspace',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:workspaceB})}).then(r=>r.json()),keyB=openedB.workspaceKey;
  const provider=await rpc('acp/modelProfiles',{method:'addProvider',meta:{name:'Fixture',baseUrl:mock.baseUrl,apiKey:mock.apiKey,authType:'openai'}},key),providerId=provider.result.data.content.result.id,modelId=`${providerId}:${mock.model}`;
  await rpc('acp/modelProfiles',{method:'add',meta:{name:modelId,model:mock.model,providerId,displayName:'Fixture model',wireApi:'chat',roles:['model'],authType:'openai'}},key);
  await rpc('acp/modelProfiles',{method:'setProviderSlots',meta:{providerId,flashModelId:modelId,multimodalModelId:modelId}},key);
  async function selectModel(workspaceKey){await rpc('config/refreshProfiles',{reason:'Isolated race fixture'},workspaceKey);const state=await rpc('config/getSerializedProfileInfo',{},workspaceKey),model=state.result.data.content.result.config.modelsByRole.chat.find(item=>item.extras?.customModelId===modelId);assert.ok(model);await rpc('config/updateSelectedModel',{profileId:state.result.data.content.profileId,role:'chat',title:model.title},workspaceKey);return model.title;}
  const title=await selectModel(key),titleB=await selectModel(keyB);
  async function refreshScopes(round){
    await Promise.all([key,keyB].flatMap(scope=>[
      rpc('acp/refreshCommands',{},scope),rpc('acp/notifyUpdate',{type:'command'},scope),rpc('acp/notifyUpdate',{type:'subagent'},scope),rpc('commands/list',{},scope),rpc('subagents/list',{},scope)
    ]));
    check(`Concurrent scope refresh round ${round} completes within the real frontend deadline`,true);
  }
  for(let cold=0;cold<3;cold++){
    if(cold){await stopHost();launchHost();await until(()=>origin,'Cold restart startup',35000);await subscribe();}
    const sid=randomUUID(),sidB=randomUUID();
    const initializing=Promise.all([rpc('acp/initSession',{continueSessionId:sid,currentModel:title},key),rpc('acp/initSession',{continueSessionId:sidB,currentModel:titleB},keyB)]);
    await Promise.all([initializing,refreshScopes(`${cold}-startup`)]);
    check(`Cold ${cold} publishes both real initialized sessions amid concurrent refresh`,true);
    for(let round=0;round<5;round++)await refreshScopes(`${cold}-${round}`);
    const before=mock.requests.length,chatA=await startChat(key,sid,title,'/owned-refresh'),chatB=await startChat(keyB,sidB,titleB,'/owned-refresh');
    await Promise.all([completeChat(chatA,'GCW_E2E_REFRESH_COMMAND_CONFIRMED'),completeChat(chatB,'GCW_E2E_REFRESH_COMMAND_CONFIRMED'),refreshScopes(`${cold}-streaming`)]);
    check(`Cold ${cold} real saved command expands through both compiled Agents`,mock.requests.slice(before).filter(request=>request.scenario==='GCW_E2E_REFRESH_COMMAND').length>=2);
  }
  check('No vendor network request was attempted',!fs.readFileSync(path.join(root,'guard-events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse).some(event=>/fetch|https?\.request|net\.connect/.test(event.operation)));

}catch(error){fs.writeFileSync(path.join(root,'failure.txt'),error.stack||String(error));throw error;}
finally{
  await stopHost().catch(error=>{console.error(`Owned process cleanup: ${error.message}`);process.exitCode=1;});
  await mock.close();fs.writeFileSync(path.join(root,'host.log'),log);
  fs.writeFileSync(path.join(root,'frames.json'),JSON.stringify(frames,null,2));
  fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify({checks,timings,requests:mock.requests,fixtureDirectory:root,ownedPids,cleanup,packaged,binary,core,agentSourceSha256:agentManifest.sourceSha256},null,2));
  console.log(`Artifacts: ${root}`);
}
