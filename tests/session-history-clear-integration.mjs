// HTTP -> actual Rust shell -> current Core -> guarded own Agent -> loopback mock.
// No GUI, real history, original program, external Provider, Editor or account.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {startMockProvider} from './mock-provider.mjs';
const repo=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2),exec=promisify(execFile);
const option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const temp=path.resolve(repo,'../../temp/GameCowork'),run=path.resolve(option('--output',path.join(temp,'session-history-clear-'+randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase()+path.sep));assert.ok(!fs.existsSync(run));fs.mkdirSync(run,{recursive:true});
const agent=path.resolve(option('--agent',path.join(temp,'cli-phase6-guarded-20261001-03/gamecowork.exe'))),agentRoot=path.dirname(agent);
const binary=path.resolve(option('--binary',path.join(repo,'restored/shell/target/debug/GameCowork.exe'))),core=path.join(repo,'restored/core-gamecowork-binary/binary/out');
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const manifest=JSON.parse(fs.readFileSync(path.join(agentRoot,'cli-package-manifest.json'),'utf8'));
assert.equal(manifest.testGuardIncluded,true);assert.equal(manifest.sourceSha256.toUpperCase(),sha(path.join(repo,'restored/cli-gamecowork/cli-main.beautified.js')));assert.equal(manifest.executableSha256.toUpperCase(),sha(agent));
assert.ok(fs.existsSync(binary)&&fs.existsSync(path.join(core,'build/Release/node_sqlite3.node')));
const workspaces={a:path.join(run,'Workspace A'),b:path.join(run,'Workspace B')};
for(const directory of Object.values(workspaces)){fs.mkdirSync(path.join(directory,'.gamecowork-cli'),{recursive:true});fs.writeFileSync(path.join(directory,'.gamecowork-cli/settings.json'),JSON.stringify({disableNextSpeakerCheck:true}));}
const mock=await startMockProvider({chunkDelayMs:100}),checks=[],frames=[],hosts=[],cleanupErrors=[];
const samePath=(a,b)=>String(a||'').replaceAll('\\','/').toLowerCase()===String(b||'').replaceAll('\\','/').toLowerCase();
const alive=pid=>{try{process.kill(pid,0);return true;}catch(error){if(error.code==='ESRCH')return false;throw error;}};
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function readLines(file){return fs.existsSync(file)?fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];}
const trace=()=>readLines(path.join(run,'process-events.jsonl'));
const agentsFor=workspace=>trace().filter(value=>value.event==='agent-spawn'&&value.acp&&samePath(value.cwd,workspace));
let shell,origin,controller,pump,eventError,log='',failure,keyA,keyB,idA,idB,pidA,pidB,clearReply,folderA,folderB;
const env={...process.env};for(const name of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|OTEL_)/.test(name)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(name)||name==='NODE_OPTIONS')delete env[name];
Object.assign(env,{GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_APP_ROOT:run,GAMECOWORK_DATA_DIR:path.join(run,'data'),
 GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_FRONTEND_DIR:path.join(repo,'restored/frontend/dist-beautified'),
 GAMECOWORK_AGENT_PATH:agent,GAMECOWORK_AGENT_RESOURCE_DIR:path.join(agentRoot,'resources'),GAMECOWORK_SMOKE_ROOT:run,GAMECOWORK_SMOKE_CLI_PATH:agent,
 GAMECOWORK_CLI_PROBE_ROOT:run,GAMECOWORK_CLI_PROBE_SOURCE:agentRoot,CUSTOM_AUTH:'1',BUN_RUNTIME_TRANSPILER_CACHE_PATH:path.join(run,'bun-cache'),
 NODE_OPTIONS:'--require '+JSON.stringify(path.join(repo,'tests/session-history-clear-guard.cjs'))});
async function poll(predicate,label,timeout=60000){const end=Date.now()+timeout;while(Date.now()<end){if(eventError)throw eventError;if(await predicate())return;await delay(40);}throw Error('Timed out: '+label);}
function pass(label,condition=true){assert.ok(condition,label);checks.push(label);console.log('PASS '+label);fs.writeFileSync(path.join(run,'progress.json'),JSON.stringify({checks,keyA,keyB,idA,idB,pidA,pidB},null,2));}
async function start(){origin=undefined;eventError=undefined;shell=spawn(binary,[],{cwd:run,env,windowsHide:true,stdio:['ignore','pipe','pipe']});hosts.push(shell.pid);const current=shell;let launchLog='';
 for(const output of[current.stdout,current.stderr])output.on('data',bytes=>{const text=bytes.toString();log+=text;launchLog+=text;const match=launchLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(current===shell&&match)origin=match[1];});
 await poll(()=>{if(current.exitCode!==null)throw Error('Owned shell exited before startup');return origin;},'owned actual shell startup');
 controller=new AbortController();const response=await fetch(new URL('/api/tauri/events',origin),{signal:controller.signal});assert.equal(response.status,200);
 pump=(async()=>{let carry='';const decoder=new TextDecoder();try{for await(const bytes of response.body){carry+=decoder.decode(bytes,{stream:true}).replaceAll('\r\n','\n');let split;while((split=carry.indexOf('\n\n'))>=0){const event=carry.slice(0,split);carry=carry.slice(split+2);const data=event.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trim()).join('\n');if(data){const envelope=JSON.parse(data);frames.push(envelope.inner?{...envelope.inner,_workspace:envelope.hubWorkspaceKey}:envelope);}}}}catch(error){if(!controller.signal.aborted)eventError=error;}})();
}
async function stop(){controller?.abort();await pump?.catch(()=>{});if(shell&&alive(shell.pid)){const child=shell;await exec('taskkill.exe',['/PID',String(child.pid),'/F'],{windowsHide:true});await poll(()=>!alive(child.pid),'owned shell exit',10000);}}
async function http(route,data){const response=await fetch(new URL(route,origin),{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(90000)});assert.ok(response.ok,route+' HTTP '+response.status);return response.json();}
async function rpc(type,data,key,{allowError=false}={}){const id=randomUUID(),reply=await http('/api/tauri/invoke',{workspaceKey:key,message:{messageType:type,messageId:id,data}});assert.equal(reply.messageId,id);if(!allowError){assert.equal(reply.data?.status,'success',type+': '+JSON.stringify(reply.data));for(const value of[reply.data.content,reply.data.content?.result])assert.ok(value?.status!=='error'&&value?.success!==false,type+': '+JSON.stringify(value));}return allowError?reply:reply.data.content;}
async function select(key,modelId){await rpc('config/refreshProfiles',{reason:'Own history-clear integration'},key);const serialized=await rpc('config/getSerializedProfileInfo',{},key),model=serialized.result.config.modelsByRole.chat.find(model=>model.extras?.customModelId===modelId);assert.ok(model);await rpc('config/updateSelectedModel',{profileId:serialized.profileId,role:'chat',title:model.title},key);return model.title;}
async function chat(key,sid,title,text,marker){const id=randomUUID(),ack=await http('/api/tauri/invoke',{workspaceKey:key,message:{messageType:'llm/streamChat',messageId:id,data:{messages:[{role:'user',content:text}],continueSessionId:sid,title,currentModel:title,completionOptions:{},messageOptions:{},_deferResponseToSse:true}}});assert.equal(ack,null);
 await poll(()=>frames.some(frame=>frame.messageId===id&&frame.data?.done),'actual Agent chat completion');const stream=frames.filter(frame=>frame.messageId===id),done=stream.find(frame=>frame.data?.done);assert.equal(done.data.status,'success',JSON.stringify(done.data));assert.ok(JSON.stringify(stream).includes(marker));assert.ok(stream.every(frame=>frame._workspace===key));pass('Actual scoped Agent conversation completed '+marker);
}
async function processSnapshot(pid){const{stdout}=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}' | Select-Object ProcessId,ParentProcessId,Name,ExecutablePath,CommandLine | ConvertTo-Json -Compress`],{windowsHide:true});return stdout.trim()?JSON.parse(stdout):null;}
try{
 await start();keyA=(await http('/api/tauri/hub/open-workspace',{path:workspaces.a})).workspaceKey;keyB=(await http('/api/tauri/hub/open-workspace',{path:workspaces.b})).workspaceKey;assert.notEqual(keyA,keyB);pass('Actual shell opens independent owned A/B roots');
 const provider=await rpc('acp/modelProfiles',{method:'addProvider',meta:{name:'Owned clear provider',baseUrl:mock.baseUrl,apiKey:mock.apiKey,authType:'openai',source:'user'}},keyA),providerId=provider.result.id,modelId=providerId+':'+mock.model;
 await rpc('acp/modelProfiles',{method:'add',meta:{name:modelId,model:mock.model,providerId,displayName:'Owned clear model',wireApi:'chat',roles:['model'],authType:'openai'}},keyA);await rpc('acp/modelProfiles',{method:'setProviderSlots',meta:{providerId,flashModelId:modelId,multimodalModelId:modelId}},keyA);
 const titleA=await select(keyA,modelId),titleB=await select(keyB,modelId);idA=randomUUID();idB=randomUUID();
 await chat(keyA,idA,titleA,'GCW_E2E_A owned clear conversation','GCW_REPLY_A_COMPLETE');await chat(keyB,idB,titleB,'GCW_E2E_B preserved conversation','GCW_REPLY_B_COMPLETE');
 const listA=await rpc('history/list',{},keyA),listB=await rpc('history/list',{},keyB);assert.ok(listA.some(item=>item.sessionId===idA));assert.ok(listB.some(item=>item.sessionId===idB));assert.ok(listA.every(item=>item.sessionId!==idB));assert.ok(listB.every(item=>item.sessionId!==idA));pass('Actual persisted history lists preserve A/B ownership');
 folderA=await rpc('history/getSessionFolderPath',{},keyA);folderB=await rpc('history/getSessionFolderPath',{},keyB);assert.ok(path.resolve(folderA).toLowerCase().startsWith(run.toLowerCase()+path.sep));assert.ok(path.resolve(folderB).toLowerCase().startsWith(run.toLowerCase()+path.sep));assert.ok(!samePath(folderA,folderB));pass('Real A/B Core history directories are distinct inside owned temp');
 const actualA=agentsFor(workspaces.a).filter(item=>alive(item.pid)),actualB=agentsFor(workspaces.b).filter(item=>alive(item.pid));assert.equal(actualA.length,1,JSON.stringify(actualA));assert.equal(actualB.length,1,JSON.stringify(actualB));pidA=actualA[0].pid;pidB=actualB[0].pid;assert.notEqual(pidA,pidB);
 const snapshots=await Promise.all([processSnapshot(pidA),processSnapshot(pidB)]);for(const[index,item]of snapshots.entries()){const record=index===0?actualA[0]:actualB[0];assert.ok(item);assert.equal(item.ParentProcessId,record.corePid);assert.ok(samePath(item.ExecutablePath,agent));}fs.writeFileSync(path.join(run,'live-agent-processes.json'),JSON.stringify({actualA,actualB,snapshots},null,2));pass('Actual idle-live ACP PIDs associate exact guarded executable, Core parent and A/B cwd');
 clearReply=await rpc('history/clear',{},keyA);assert.deepEqual(clearReply,{cleared:true});pass('A history clear reports completed cleared:true');
 await poll(()=>!alive(pidA),'A ACP exits after strict clear',15000);assert.ok(trace().some(event=>event.event==='agent-exit'&&event.pid===pidA));assert.ok(alive(pidB));pass('Actual A ACP PID exits while B ACP PID stays alive');
 assert.deepEqual(await rpc('history/list',{},keyA),[]);assert.ok((await rpc('history/list',{},keyB)).some(item=>item.sessionId===idB));assert.ok(JSON.stringify((await rpc('history/load',{id:idB},keyB)).history).includes('GCW_REPLY_B_COMPLETE'));pass('A real history list is empty and B actual assistant history is retained');
 const loadA=await rpc('history/load',{id:idA},keyA,{allowError:true});fs.writeFileSync(path.join(run,'cleared-session-load.json'),JSON.stringify(loadA,null,2));assert.equal(loadA.data?.status,'error','A cleared session must not be restored from a parked checkpoint');pass('Cleared A session cannot reload through checkpoint fallback');
 await stop();await poll(()=>!alive(pidA)&&!alive(pidB),'own old Agent PIDs exit with host',15000);await start();
 assert.deepEqual(await rpc('history/list',{},keyA),[]);assert.ok((await rpc('history/list',{},keyB)).some(item=>item.sessionId===idB));assert.ok(JSON.stringify((await rpc('history/load',{id:idB},keyB)).history).includes('GCW_REPLY_B_COMPLETE'));pass('Cold actual host/Core restart keeps A empty and B real assistant history durable');
 const coldA=await rpc('history/load',{id:idA},keyA,{allowError:true});assert.equal(coldA.data?.status,'error');assert.deepEqual(await rpc('history/list',{},keyA),[]);pass('Cold cleared-session load cannot repopulate A history');
 const attempts=readLines(path.join(run,'guard-events.jsonl')).filter(event=>/external-|fetch|https?\.request|net\.connect/.test(event.operation));assert.deepEqual(attempts,[]);assert.ok(mock.requests.some(record=>record.scenario==='workspace-a'&&record.authorized&&record.completed));assert.ok(mock.requests.some(record=>record.scenario==='workspace-b'&&record.authorized&&record.completed));pass('Only authorized loopback mock Provider requests occurred');
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error.stack);}
finally{
 try{await stop();const owned=trace().filter(record=>record.event==='core-start'||record.event==='agent-spawn').map(record=>record.pid).filter(Number.isInteger);await poll(()=>owned.every(pid=>!alive(pid)),'all own Core/Agent PIDs exited',15000);}catch(error){cleanupErrors.push(error.message);process.exitCode=1;}
 await mock.close();fs.writeFileSync(path.join(run,'host.log'),log);fs.writeFileSync(path.join(run,'frames.json'),JSON.stringify(frames,null,2));
 const records=trace(),owned=[...new Set([...hosts,...records.filter(record=>['core-start','agent-spawn'].includes(record.event)).map(record=>record.pid)])].filter(Number.isInteger);
 fs.writeFileSync(path.join(run,'report.json'),JSON.stringify({stage:'HTTP-CLI-real-shell-current-Core-guarded-Agent-loopback-no-GUI',run,binary,core,coreSha256:sha(path.join(core,'index.js')),agent,agentSourceSha256:manifest.sourceSha256,agentExecutableSha256:manifest.executableSha256,workspaces,keyA,keyB,idA,idB,pidA,pidB,folderA,folderB,clearReply,checks,failure,processEvents:records,ownedPids:owned,ownPidsGone:owned.every(pid=>!alive(pid)),cleanupErrors,requests:mock.requests},null,2));console.log(JSON.stringify({run,checks:checks.length,failure:failure?.message,ownPidsGone:owned.every(pid=>!alive(pid)),cleanupErrors}));
}
