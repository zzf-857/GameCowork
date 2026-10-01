// Actual host/Core/Agent/loopback conversations and durable history operations.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';import {randomUUID} from 'node:crypto';
import {startMockProvider} from '../fixtures/mock-provider.mjs';
const project=fileURLToPath(new URL('../../',import.meta.url));const args=process.argv.slice(2);
const opt=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const pkg=path.resolve(opt('--package','F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-08'));
assert.equal(JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8')).testGuardIncluded,true);
const root=path.resolve('F:/AI/AgentMake/temp/GameCowork',`session-history-${randomUUID()}`);
const a=path.join(root,'project A'),b=path.join(root,'project B');for(const dir of[a,b])fs.mkdirSync(dir,{recursive:true});
const mock=await startMockProvider();const core=path.join(project,'src/core/binary/out');
const env={...process.env};for(const key of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];
Object.assign(env,{GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_APP_ROOT:path.join(project,'app'),
 GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_FRONTEND_DIR:path.join(project,'src/frontend/bundle'),
 GAMECOWORK_DATA_DIR:path.join(root,'data'),GAMECOWORK_AGENT_PATH:path.join(pkg,'gamecowork.exe'),GAMECOWORK_AGENT_RESOURCE_DIR:path.join(pkg,'resources'),
 GAMECOWORK_SMOKE_ROOT:root,GAMECOWORK_SMOKE_CLI_PATH:path.join(pkg,'gamecowork.exe'),GAMECOWORK_CLI_PROBE_ROOT:root,GAMECOWORK_CLI_PROBE_SOURCE:pkg,
 NODE_OPTIONS:`--require ${JSON.stringify(path.join(project,'tests/fixtures/core-chat-spawn-guard.cjs'))}`});
const binary=path.resolve(opt('--binary',path.join(project,'src/shell/target/debug/GameCowork.exe')));
let child,origin,log='',controller,pump;const frames=[],checks=[],pids=[];
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(test,label){const deadline=Date.now()+45000;while(Date.now()<deadline){if(await test())return;await delay(20);}throw Error(`Timed out: ${label}`);}
function check(label,condition){checks.push({label,passed:!!condition});assert.ok(condition,label);console.log(`PASS ${label}`);}
async function start(){origin=undefined;child=spawn(binary,[],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});pids.push(child.pid);
 for(const output of[child.stdout,child.stderr])output.on('data',data=>{log+=data;const match=String(data).match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match)origin=match[1];});
 await until(()=>origin,'startup');controller=new AbortController();const response=await fetch(new URL('/api/tauri/events',origin),{signal:controller.signal});
 pump=(async()=>{let carry='';const decoder=new TextDecoder();try{for await(const data of response.body){carry+=decoder.decode(data,{stream:true}).replace(/\r\n/g,'\n');let split;while((split=carry.indexOf('\n\n'))>=0){const event=carry.slice(0,split);carry=carry.slice(split+2);const payload=event.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trim()).join('\n');if(payload){const value=JSON.parse(payload);frames.push(value.inner||value);}}}}catch(error){if(!controller.signal.aborted)throw error;}})();}
async function stop(){controller?.abort();await pump?.catch(()=>{});if(child&&child.exitCode===null){const current=child;const exit=new Promise(resolve=>current.once('exit',resolve));await promisify(execFile)('taskkill.exe',['/PID',String(current.pid),'/F'],{windowsHide:true});await exit;}}
async function http(route,body){const response=await fetch(new URL(route,origin),{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(70000)});assert.ok(response.ok,route);return response.json();}
async function rpc(kind,data,key,{error=false}={}){const frame=await http('/api/tauri/invoke',{message:{messageType:kind,messageId:randomUUID(),data},workspaceKey:key});
 if(error){check(`${kind} explicitly fails`,frame?.data?.status==='error'||frame?.data?.content?.status==='error');return frame;}
 for(const item of[frame?.data,frame?.data?.content,frame?.data?.content?.result])assert.ok(item?.status!=='error'&&item?.success!==false,`${kind}: ${item?.error}`);
 return frame?.data?.content;}
async function chat(key,id,title,text){const mid=randomUUID();const ack=await http('/api/tauri/invoke',{workspaceKey:key,message:{messageType:'llm/streamChat',messageId:mid,data:{messages:[{role:'user',content:text}],continueSessionId:id,title,currentModel:title,completionOptions:{},messageOptions:{},_deferResponseToSse:true}}});assert.equal(ack,null);
 await until(()=>frames.some(frame=>frame.messageId===mid&&frame.data?.done),'actual chat completion');const done=frames.find(frame=>frame.messageId===mid&&frame.data?.done);assert.equal(done.data.status,'success',done.data.error);check('A real loopback conversation completed',JSON.stringify(frames.filter(frame=>frame.messageId===mid)).includes('Hello fixture'));}
try{
 await start();const keyA=(await http('/api/tauri/hub/open-workspace',{path:a})).workspaceKey;const keyB=(await http('/api/tauri/hub/open-workspace',{path:b})).workspaceKey;
 const provider=await rpc('acp/modelProfiles',{method:'addProvider',meta:{name:'History fixture',baseUrl:mock.baseUrl,apiKey:mock.apiKey,authType:'openai',source:'user'}},keyA);const providerId=provider.result.id;
 const modelId=`${providerId}:${mock.model}`;await rpc('acp/modelProfiles',{method:'add',meta:{name:modelId,model:mock.model,providerId,displayName:'History model',wireApi:'chat',roles:['model'],authType:'openai'}},keyA);
 await rpc('acp/modelProfiles',{method:'setProviderSlots',meta:{providerId,flashModelId:modelId,multimodalModelId:modelId}},keyA);
 async function select(key){await rpc('config/refreshProfiles',{reason:'History test fixture'},key);const profile=await rpc('config/getSerializedProfileInfo',{},key);const model=profile.result.config.modelsByRole.chat.find(model=>model.extras?.customModelId===modelId);assert.ok(model);await rpc('config/updateSelectedModel',{profileId:profile.profileId,role:'chat',title:model.title},key);return model.title;}
 const titleA=await select(keyA),titleB=await select(keyB),idA=randomUUID(),idB=randomUUID();await chat(keyA,idA,titleA,'History A actual fixture conversation');await chat(keyB,idB,titleB,'History B actual fixture conversation');
 check('A list excludes B sessions',(await rpc('history/list',{},keyA)).every(session=>session.sessionId!==idB));
 check('B list excludes A sessions',(await rpc('history/list',{},keyB)).every(session=>session.sessionId!==idA));
 await rpc('history/renameTitle',{sessionId:idA,title:'Renamed genuine A'},keyA);check('Rename persisted in actual metadata',(await rpc('history/list',{},keyA)).find(session=>session.sessionId===idA)?.title==='Renamed genuine A');
 for(const state of['pinned','archived','active']){await rpc('history/updateState',{sessionId:idA,state},keyA);check(`${state} persists`,(await rpc('history/list',{},keyA)).find(session=>session.sessionId===idA)?.state===state);}
 await rpc('history/markAsUnread',{sessionId:idA},keyA);check('Unread persists',(await rpc('history/list',{},keyA)).find(session=>session.sessionId===idA)?.unread===true);
 await rpc('history/markAsRead',{sessionId:idA},keyA);check('Read persists',(await rpc('history/list',{},keyA)).find(session=>session.sessionId===idA)?.unread===false);
 await rpc('history/renameTitle',{sessionId:randomUUID(),title:'must fail'},keyA,{error:true});
 await rpc('history/updateState',{sessionId:idA,state:'invalid-state'},keyA,{error:true});
 await rpc('history/load',{id:idB},keyA,{error:true});
 // Exercise delete after restart: the original holder is no longer live.
 await stop();await start();check('Rename survives host restart',(await rpc('history/list',{},keyA)).find(session=>session.sessionId===idA)?.title==='Renamed genuine A');
 await rpc('history/delete',{id:idA},keyA);check('Deleted metadata disappears',(await rpc('history/list',{},keyA)).every(session=>session.sessionId!==idA));
 await rpc('history/load',{id:idA},keyA,{error:true});await stop();await start();check('Deleted session cannot resurrect from checkpoint scan',(await rpc('history/list',{},keyA)).every(session=>session.sessionId!==idA));
 check('Deleting A preserves B',(await rpc('history/list',{},keyB)).some(session=>session.sessionId===idB));
 check('No external service requests',!fs.readFileSync(path.join(root,'guard-events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse).some(item=>/fetch|https?\.request|net\.connect/.test(item.operation)));
}catch(error){fs.writeFileSync(path.join(root,'failure.txt'),error.stack);throw error;}
finally{await stop();await mock.close();fs.writeFileSync(path.join(root,'host.log'),log);fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({checks,root,pids,requests:mock.requests},null,2));console.log(`Artifacts: ${root}`);}
