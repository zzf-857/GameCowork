// Actual compiled CLI -> an already running, independently owned Unity fixture.
// No editor is started here; no Provider prompt or installer is invoked.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID} from 'node:crypto';
const args=process.argv.slice(2);const option=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined;
assert.ok(option('--project')&&option('--package')&&option('--editor-pid'),'Pass --project, --package and --editor-pid from an owned live fixture.');
const editorProject=fs.realpathSync(option('--project')),pkg=path.resolve(option('--package'));
const base=fs.realpathSync('F:/AI/AgentMake/temp/GameCowork');
assert.ok(editorProject.toLowerCase().startsWith(base.toLowerCase()+path.sep));
assert.equal(JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8')).testGuardIncluded,true);
const editorPid=Number(option('--editor-pid'));assert.ok(Number.isInteger(editorPid)&&editorPid>0);process.kill(editorPid,0);
assert.ok(fs.statSync(path.join(editorProject,'Temp/.com-unity-gamecowork.json')).isFile());
const probe=path.join(editorProject,`.cli-bridge-probe-${randomUUID()}`),workspace=path.join(probe,'workspace');
for(const directory of[workspace,path.join(probe,'cli-state'),path.join(probe,'user-state')])fs.mkdirSync(directory,{recursive:true});
const env={...process.env};for(const key of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete env[key];
Object.assign(env,{GAMECOWORK_CLI_HOME:path.join(probe,'cli-state'),GAMECOWORK_USER_DATA_DIR:path.join(probe,'user-state'),GAMECOWORK_CLI_RESOURCE_DIR:path.join(pkg,'resources'),GAMECOWORK_LOCAL_PROVIDER_MODE:'1',GAMECOWORK_DISABLE_AUTO_UPDATE:'1',CUSTOM_AUTH:'1',
 GAMECOWORK_CLI_PROBE_ROOT:editorProject,GAMECOWORK_CLI_PROBE_SOURCE:pkg,OPENAI_API_KEY:'fixture-no-real-key',OPENAI_BASE_URL:'http://127.0.0.1:9/v1',OPENAI_MODEL:'fixture-model'});
const child=spawn(path.join(pkg,'gamecowork.exe'),['--experimental-acp','--auth-type','openai','--model','fixture-model','--upm=false'],{cwd:workspace,env,windowsHide:true,stdio:['pipe','pipe','pipe']});
let sequence=0,carry='',stderr='',failure;const pending=new Map(),checks=[];
const check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(`${name}: PASS`);};
child.stdout.on('data',bytes=>{carry+=bytes.toString();let end;while((end=carry.indexOf('\n'))>=0){const line=carry.slice(0,end);carry=carry.slice(end+1);let frame;try{frame=JSON.parse(line);}catch{continue;}if(!frame.method&&pending.has(frame.id)){const entry=pending.get(frame.id);pending.delete(frame.id);clearTimeout(entry.timer);entry.resolve(frame);}else if(frame.method&&frame.id!==undefined)child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:frame.id,error:{code:-32601,message:'Read-only bridge probe client'}})+'\n');}});
child.stderr.on('data',bytes=>stderr+=bytes.toString());
function rpc(method,params){const id=++sequence;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error(`Bridge RPC timeout: ${method}`));},20000);pending.set(id,{resolve,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});}
const meta={_meta:{gamecowork:{projectRoot:editorProject}}};
async function bridge(action,extra={}){const reply=await rpc(`_gamecowork/unity/window_bridge/${action}`,{...meta,...extra});assert.equal(reply.error,undefined);return reply.result;}
try{
 const init=await rpc('initialize',{protocolVersion:1,clientCapabilities:{fs:{readTextFile:false,writeTextFile:false},terminal:false}});check('Actual guarded Agent initializes',init.result?.protocolVersion===1);
 const windows=await bridge('list_windows');check('Actual Unity window list reaches ACP',windows.success===true&&Array.isArray(windows.data)&&windows.data.some(window=>window.typeName==='UnityEditor.SceneView'));
 const started=await bridge('start_stream_server',{port:0});check('Actual preview listener starts through CLI',started.success===true&&started.data?.running===true);
 check('Actual transport survives the CLI adapter',started.data.transport==='image-frames');check('Actual project and editor PID survive the CLI adapter',path.resolve(started.data.projectRoot).toLowerCase()===editorProject.toLowerCase()&&started.data.pid===editorPid);
 const capability=new URL(started.data.signalingUrl);check('Actual capability URL remains local and complete',capability.hostname==='127.0.0.1'&&/^\/api\/tauri\/window-bridge\/local\/[^/]+$/.test(capability.pathname));
 const bad=await bridge('start_stream_server',{port:-1});check('Actual adapter error is not wrapped as success',bad.success===false&&typeof bad.error==='string'&&bad.error.length>0);
 const status=await bridge('get_stream_server_status');check('Failed start does not lose existing server identity',status.success===true&&status.data.running===true&&status.data.transport==='image-frames'&&status.data.pid===editorPid);
 const stopped=await bridge('stop_stream_server');check('Actual preview listener stops through CLI',stopped.success===true&&stopped.data.running===false);
 const events=fs.readFileSync(path.join(editorProject,'guard-events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);check('Bridge probe attempted no external service',!events.some(event=>/fetch|https?\.request|net\.connect/.test(event.operation)));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;}
finally{
 for(const entry of pending.values())clearTimeout(entry.timer);
 if(child.exitCode===null&&child.signalCode===null){const ended=new Promise(resolve=>child.once('exit',resolve));await promisify(execFile)(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{windowsHide:true});await ended;}
 let editorStillAlive=false;try{process.kill(editorPid,0);editorStillAlive=true;}catch{}
 // Capability URLs remain in process memory; summaries never persist them.
 fs.writeFileSync(path.join(probe,'summary.json'),JSON.stringify({checks,failure,ownedCliPid:child.pid,editorPid,editorStillAlive,sourceSha256:JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8')).sourceSha256},null,2));
 fs.writeFileSync(path.join(probe,'stderr.txt'),stderr.replace(/http:\/\/127\.0\.0\.1:\d+\/api\/tauri\/window-bridge\/local\/[^\s"']+/g,'<local-capability>'));
 console.log(JSON.stringify({probe,passed:checks.filter(check=>check.passed).length,total:checks.length,failure:failure?.message,ownedCliPid:child.pid,editorStillAlive}));
}
