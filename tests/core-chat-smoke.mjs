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
const root=path.resolve('F:/AI/AgentMake/temp/GameCowork',`core-chat-${randomUUID()}`);
const workspace=path.join(root,'workspace');fs.mkdirSync(workspace,{recursive:true});
const workspaceB=path.join(root,'workspace B');fs.mkdirSync(workspaceB);
const file=path.join(workspace,'fixture.txt');fs.writeFileSync(file,'GCW_FIXTURE_FILE_CONTENT\n');
const mock=await startMockProvider({fixtureFile:file});
const env={...process.env};
for(const key of Object.keys(env)) if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete env[key];
const core=packaged?path.join(appRoot,'core'):path.join(project,'restored/core-gamecowork-binary/binary/out');
Object.assign(env,{GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_APP_ROOT:appRoot,
  GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_FRONTEND_DIR:packaged?path.join(appRoot,'frontend'):path.join(project,'restored/frontend/dist-beautified'),
  GAMECOWORK_DATA_DIR:path.join(root,'data'),GAMECOWORK_AGENT_PATH:path.join(pkg,'gamecowork.exe'),GAMECOWORK_AGENT_RESOURCE_DIR:path.join(pkg,'resources'),
  GAMECOWORK_SMOKE_ROOT:root,GAMECOWORK_SMOKE_CLI_PATH:path.join(pkg,'gamecowork.exe'),
  GAMECOWORK_CLI_PROBE_ROOT:root,GAMECOWORK_CLI_PROBE_SOURCE:pkg,NODE_OPTIONS:`--require ${JSON.stringify(path.join(project,'tests/core-chat-spawn-guard.cjs'))}`});
const binary=path.resolve(opt('--binary',packaged?path.join(appRoot,'GameCowork.exe'):path.join(project,'restored/shell/target/debug/GameCowork.exe')));
let shell;
let log='',origin;const checks=[];const frames=[];let eventsAbort,eventPump,eventError;
const ownedPids=[],cleanup=[];
const check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(`${name}: PASS`);};
function launchHost(){origin=undefined;const current=spawn(binary,[],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});shell=current;ownedPids.push(current.pid);console.log(`OWN_HOST_PID=${current.pid}`);for(const output of[current.stdout,current.stderr])output.on('data',chunk=>{const text=chunk.toString();log+=text;const match=text.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match&&current===shell)origin=match[1];});}
launchHost();
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(test,name,ms=60000){const end=Date.now()+ms;while(Date.now()<end){if(eventError)throw eventError;if(test())return;await delay(20);}throw Error(name);}
async function rpc(kind,data,workspaceKey){const id=randomUUID();const response=await fetch(new URL('/api/tauri/invoke',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:{messageType:kind,messageId:id,data},...(workspaceKey?{workspaceKey}:{})}),signal:AbortSignal.timeout(70000)});const result=await response.json();assert.ok(response.ok,`${kind}: HTTP ${response.status}`);for(const value of[result?.data,result?.data?.content,result?.data?.content?.result])if(value?.status==='error'||value?.success===false)throw Error(`${kind}: ${value.error||'Inner operation failed'}`);return {id,result};}
async function subscribe(){eventError=undefined;const controller=new AbortController();eventsAbort=controller;const events=await fetch(new URL('/api/tauri/events',origin),{signal:controller.signal});eventPump=(async()=>{let carry='';const decoder=new TextDecoder();try{for await(const bytes of events.body){carry+=decoder.decode(bytes,{stream:true}).replace(/\r\n/g,'\n');let p;while((p=carry.indexOf('\n\n'))>=0){const block=carry.slice(0,p);carry=carry.slice(p+2);const data=block.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trim()).join('\n');if(data){const envelope=JSON.parse(data);frames.push(envelope.inner?{...envelope.inner,_hubWorkspaceKey:envelope.hubWorkspaceKey}:envelope);}}}}catch(error){if(!controller.signal.aborted)eventError=error;}})();}
async function stopHost(){eventsAbort?.abort();await eventPump?.catch(()=>{});if(shell.exitCode===null){const current=shell;const exited=new Promise(resolve=>current.once('exit',resolve));await promisify(execFile)('taskkill.exe',['/PID',String(current.pid),'/F'],{windowsHide:true});await exited;cleanup.push({pid:current.pid,exited:current.exitCode!==null});}}
function chatFrames(id){return frames.filter(frame=>frame.messageId===id&&frame.messageType==='llm/streamChat');}
async function startChat(key,sid,title,text){const id=randomUUID();const ack=await fetch(new URL('/api/tauri/invoke',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:{messageType:'llm/streamChat',messageId:id,data:{messages:[{role:'user',content:text}],continueSessionId:sid,title,currentModel:title,completionOptions:{},messageOptions:{},_deferResponseToSse:true}},workspaceKey:key})}).then(response=>response.json());assert.equal(ack,null);return{id,key,sid};}
async function completeChat(chat,marker){await until(()=>chatFrames(chat.id).some(frame=>frame.data?.done),'Actual stream did not complete');const chunks=chatFrames(chat.id),last=chunks.find(frame=>frame.data?.done);if(last.data.status==='error')throw Error(`Actual stream failed: ${last.data.error}`);check('Actual stream terminal success',last.data.status==='success');check('All stream frames kept their workspace route',chunks.every(frame=>frame._hubWorkspaceKey===chat.key));check(`Actual output ${marker} traversed Core/SSE`,JSON.stringify(chunks).includes(marker));check('Multiple content frames survived the real protocol',chunks.filter(frame=>frame.data.done===false).length>=2);return chunks;}
function assistantText(value){if(Array.isArray(value))return value.map(assistantText).join('');if(value&&typeof value==='object'){if(value.role==='assistant'&&typeof value.content==='string')return value.content;return Object.values(value).map(assistantText).join('');}return '';}
try{
  await until(()=>origin,'Host startup',35000);check('Real host startup',true);
  await subscribe();
  const opened=await fetch(new URL('/api/tauri/hub/open-workspace',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:workspace})}).then(r=>r.json());check('Open actual fixture workspace',opened.ok);
  const key=opened.workspaceKey;
  const openedB=await fetch(new URL('/api/tauri/hub/open-workspace',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:workspaceB})}).then(response=>response.json());check('Open independent workspace B',openedB.ok);const keyB=openedB.workspaceKey;
  const provider=await rpc('acp/modelProfiles',{method:'addProvider',meta:{name:'Fixture',baseUrl:mock.baseUrl,apiKey:mock.apiKey,authType:'openai'}},key);
  const providerId=provider.result.data.content.result.id;check('Save real local provider',typeof providerId==='string');
  const modelId=`${providerId}:${mock.model}`;
  const added=await rpc('acp/modelProfiles',{method:'add',meta:{name:modelId,model:mock.model,providerId,displayName:'Fixture model',wireApi:'chat',roles:['model'],authType:'openai'}},key);
  check('Save real model',added.result.data.content.result.success);
  await rpc('acp/modelProfiles',{method:'setProviderSlots',meta:{providerId,flashModelId:modelId,multimodalModelId:modelId}},key);
  const serialized=await rpc('config/getSerializedProfileInfo',{},key);
  fs.writeFileSync(path.join(root,'config-shape.json'),JSON.stringify({contentKeys:Object.keys(serialized.result.data.content||{}),modelTitles:serialized.result.data.content?.result?.config?.modelsByRole?.chat?.map(m=>m.title)},null,2));
  async function selectModel(workspaceKey){await rpc('config/refreshProfiles',{reason:'Isolated shared model fixture updated'},workspaceKey);const state=await rpc('config/getSerializedProfileInfo',{},workspaceKey);const model=state.result.data.content.result.config.modelsByRole.chat.find(item=>item.extras?.customModelId===modelId);check('Actual config loaded the saved model',!!model);await rpc('config/updateSelectedModel',{profileId:state.result.data.content.profileId,role:'chat',title:model.title},workspaceKey);return model.title;}
  const title=await selectModel(key),titleB=await selectModel(keyB),sid=randomUUID(),sidB=randomUUID();
  const [chatA,chatB]=await Promise.all([startChat(key,sid,title,'GCW_E2E_A'),startChat(keyB,sidB,titleB,'GCW_E2E_B')]);
  const [streamA,streamB]=await Promise.all([completeChat(chatA,'GCW_REPLY_A_COMPLETE'),completeChat(chatB,'GCW_REPLY_B_COMPLETE')]);
  check('Concurrent A and B never cross-delivered output',!JSON.stringify(streamA).includes('GCW_REPLY_B')&&!JSON.stringify(streamB).includes('GCW_REPLY_A'));
  check('Provider really received both authorized prompts',mock.requests.some(request=>request.scenario==='workspace-a'&&request.authorized)&&mock.requests.some(request=>request.scenario==='workspace-b'&&request.authorized));
  const read=await startChat(key,randomUUID(),title,'GCW_E2E_READ_FILE: read the fixture using your actual read tool.');await completeChat(read,'GCW_TOOL_READ_CONFIRMED');check('Actual read tool bytes returned to Provider',mock.requests.some(request=>request.requestedReadTool)&&mock.requests.some(request=>request.readToolResultContainsFixture));check('Read-only fixture remained unchanged',fs.readFileSync(file,'utf8')==='GCW_FIXTURE_FILE_CONTENT\n');
  const slow=await startChat(key,sid,title,'GCW_E2E_SLOW: test cancellation');await until(()=>chatFrames(slow.id).some(frame=>JSON.stringify(frame).includes('GCW_SLOW_STARTED')),'Slow actual stream did not start');
  const abort=await fetch(new URL('/api/tauri/invoke',origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:{messageType:'abort',messageId:slow.id,data:null},workspaceKey:key})}).then(response=>response.json());assert.equal(abort.messageId,slow.id);
  await until(()=>chatFrames(slow.id).some(frame=>frame.data?.done),'Cancel terminal frame not received');const cancelled=chatFrames(slow.id).at(-1).data;check('Cancel finalized as a normal cancelled stream',cancelled.done===true&&cancelled.status==='success'&&cancelled.content?.cancelled===true);
  await until(()=>mock.requests.some(request=>request.scenario==='slow'&&request.aborted),'Actual Provider HTTP connection was not aborted');check('Cancel propagated to actual Provider connection',mock.requests.some(request=>request.scenario==='slow'&&request.aborted));
  const text=assistantText(streamA.map(frame=>frame.data.content));check('History uses actual returned Assistant text',text.includes('GCW_REPLY_A_COMPLETE'));
  await rpc('history/save',{sessionId:sid,title:'Fixture A',workspaceDirectory:workspace,selectedChatModelTitle:title,history:[{message:{role:'user',content:'GCW_E2E_A'}},{message:{role:'assistant',content:text}}]},key);
  const history=await rpc('history/load',{id:sid},key);check('Saved actual history contains Provider output',history.result.data.content.sessionId===sid&&JSON.stringify(history.result.data.content.history).includes('GCW_REPLY_A_COMPLETE'));
  await stopHost();launchHost();await until(()=>origin,'Restart startup',35000);await subscribe();
  const snapshot=await fetch(new URL('/api/tauri/hub/workspaces',origin)).then(response=>response.json());check('Actual host restart restored A and B registry',snapshot.workspaces.some(item=>item.workspaceKey===key)&&snapshot.workspaces.some(item=>item.workspaceKey===keyB));
  const restored=await rpc('history/load',{id:sid},key);check('Actual Core restart restored same durable session history',restored.result.data.content.sessionId===sid&&JSON.stringify(restored.result.data.content.history).includes('GCW_REPLY_A_COMPLETE'));
  const resumedTitle=await selectModel(key);const resumed=await startChat(key,sid,resumedTitle,'Third synthetic fixture turn after restart');await completeChat(resumed,'Hello fixture');check('Resumed Provider prompt retained persisted first turn',mock.requests.filter(request=>request.url==='/v1/chat/completions'&&request.stream).at(-1).firstTurnPresent);
  const guardEvents=fs.readFileSync(path.join(root,'guard-events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);check('No vendor network requests were attempted',!guardEvents.some(event=>/fetch|https?\.request|net\.connect/.test(event.operation)));
}catch(error){fs.writeFileSync(path.join(root,'failure.txt'),error.stack||String(error));throw error;}
finally{
  await stopHost().catch(error=>{console.error(`Owned process cleanup: ${error.message}`);process.exitCode=1;});
  await mock.close();fs.writeFileSync(path.join(root,'host.log'),log);
  fs.writeFileSync(path.join(root,'frames.json'),JSON.stringify(frames,null,2));
  fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify({checks,requests:mock.requests,fixtureDirectory:root,ownedPids,cleanup,packaged,binary,core,agentSourceSha256:agentManifest.sourceSha256},null,2));
  console.log(`Artifacts: ${root}`);
}
