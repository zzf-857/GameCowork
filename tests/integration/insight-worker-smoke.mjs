// Real recovered SQLite/Tree-sitter/YAML worker; no model or remote embedding.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const project=fileURLToPath(new URL('../../',import.meta.url));
const source=path.join(project,'src/unity-insight');
const run=path.resolve('F:/AI/AgentMake/temp/GameCowork',`insight-worker-${randomUUID()}`);
const fixture=path.join(run,'project'),home=path.join(run,'own-state');
for(const directory of[home,path.join(fixture,'Assets'),path.join(fixture,'ProjectSettings'),path.join(fixture,'Packages')])fs.mkdirSync(directory,{recursive:true});
fs.writeFileSync(path.join(fixture,'ProjectSettings/ProjectVersion.txt'),'m_EditorVersion: 2022.3.28f1\n');
fs.writeFileSync(path.join(fixture,'Packages/manifest.json'),'{}\n');
const guid={player:'a'.repeat(32),prefab:'b'.repeat(32),material:'c'.repeat(32),shader:'d'.repeat(32),helper:'e'.repeat(32)};
const write=(name,text,id)=>{fs.writeFileSync(path.join(fixture,'Assets',name),text);fs.writeFileSync(path.join(fixture,'Assets',name+'.meta'),`fileFormatVersion: 2\nguid: ${id}\n`);};
write('Player.cs','using UnityEngine;\nnamespace FixtureSpace {\n public class Player : MonoBehaviour {\n  public string marker = "GCW_INSIGHT_ALPHA";\n  public int Add(int n) {\n   return Helper.Compute(n);\n  }\n  public void Tick() {\n   Add(7);\n  }\n }\n}\n',guid.player);
write('Helper.cs','namespace FixtureSpace {\n public static class Helper {\n  public static int Compute(int n) { return n + 1; }\n }\n}\n',guid.helper);
write('Fixture.shader','Shader "Fixture/GCW_INSIGHT_SHADER" { Properties { _Tint("Tint", Color) = (1,1,1,1) } SubShader { Pass {} } }\n',guid.shader);
write('Default.mat',`%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:\n--- !u!21 &2100000\nMaterial:\n  m_Name: GCW_INSIGHT_MATERIAL\n  m_Shader: {fileID: 4800000, guid: ${guid.shader}, type: 3}\n`,guid.material);
write('Greeting.prefab',`%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:\n--- !u!1 &1000\nGameObject:\n  m_Name: FixtureCube\n  m_Component:\n  - component: {fileID: 11400}\n--- !u!114 &11400\nMonoBehaviour:\n  m_GameObject: {fileID: 1000}\n  m_Script: {fileID: 11500000, guid: ${guid.player}, type: 3}\n  m_Label: GCW_INSIGHT_YAML\n  m_Material: {fileID: 2100000, guid: ${guid.material}, type: 2}\n`,guid.prefab);
const env={...process.env};for(const key of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|UNITY_INSIGHT_|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete env[key];
Object.assign(env,{UNITY_INSIGHT_HOME:home,GAMECOWORK_INSIGHT_PROJECT:fixture,UNITY_INSIGHT_ALLOWED_PROJECT_ROOTS:fixture,GAMECOWORK_UNITY_METRICS_NO_EMIT:'1',UNITY_INSIGHT_LOG_LEVEL:'OFF',UNITY_INSIGHT_WATCH_DEBOUNCE_MS:'100'});
const binary=process.execPath,entry=path.join(source,'bundle/gamecowork-worker-entry.mjs'),guard=path.join(source,'bundle/gamecowork-worker-guard.cjs');
let child,carry='',stderr='',sequence=0;const pending=new Map(),checks=[],responses=[],pids=[];
function launch(){child=spawn(binary,['--require',guard,entry,'serve','--stdio','--project',fixture],{cwd:fixture,env,windowsHide:true,stdio:['pipe','pipe','pipe']});pids.push(child.pid);child.stdout.on('data',bytes=>{carry+=bytes.toString();let end;while((end=carry.indexOf('\n'))>=0){const line=carry.slice(0,end);carry=carry.slice(end+1);let reply;try{reply=JSON.parse(line);}catch{continue;}responses.push(reply);const owner=pending.get(reply.id);if(owner){pending.delete(reply.id);clearTimeout(owner.timer);owner.resolve(reply);}}});child.stderr.on('data',bytes=>stderr+=bytes.toString());child.once('exit',(code,signal)=>{for(const owner of pending.values()){clearTimeout(owner.timer);owner.reject(Error(`Worker exited before replying: ${code ?? signal}`));}pending.clear();});}
function rpc(method,params={}){const id=`insight-${++sequence}`;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error(`Worker RPC timeout: ${method}`));},60000);pending.set(id,{resolve,timer});child.stdin.write(JSON.stringify({id,method,params})+'\n');});}
const check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(`${name}: PASS`);};
async function stop(){if(!child||child.exitCode!==null||child.signalCode!==null)return;const current=child,ended=new Promise(resolve=>current.once('exit',resolve));await promisify(execFile)(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(current.pid),'/T','/F'],{windowsHide:true});await ended;}
let failure;
try{
 launch();const initialized=await rpc('initialize',{project_path:fixture});check('Actual worker initialized project protocol',initialized.status==='ok'&&initialized.data?.protocolVersion===4);
 const started=await rpc('index.build',{force:true});check('Actual index build was scheduled',started.status==='ok'&&started.data?.indexBuilding===true);
 let status;const deadline=Date.now()+60000;for(;;){const reply=await rpc('status');assert.equal(reply.status,'ok');status=reply.data;if(status.lastBuildError)throw Error(status.lastBuildError);if(status.indexReady&&!status.indexBuilding&&!status.indexSyncing)break;if(Date.now()>deadline)throw Error('Actual index did not finish');await new Promise(resolve=>setTimeout(resolve,100));}
 check('Real files were discovered and published',status.discoveredFileCount>=5&&typeof status.indexedAt==='string');
 const children=await rpc('cowork.vfs_children',{});check('Actual VFS returns project entries',children.status==='ok'&&children.data?.ready===true&&children.data.entries.length>0);
 const search=await rpc('cowork.vfs_search',{query:'GCW_INSIGHT',limit:50});check('Actual indexed content search returns fixture rows',search.status==='ok'&&search.data?.results?.length>0);
 check('CSharp, ShaderLab and Unity YAML actual contents were indexed',['Assets/Player.cs','Assets/Fixture.shader','Assets/Greeting.prefab'].every(file=>search.data.results.some(row=>row.path.startsWith(file))));
 const entry=await rpc('cowork.vfs_entry',{vfsPath:'Assets/Player.cs:/FixtureSpace/Player/Add.fn'});check('Tree-sitter extracted real method source',entry.status==='ok'&&entry.data.entry?.content?.includes('Helper.Compute(n)'));
 const refs=await rpc('cowork.vfs_refs',{vfsPath:'Assets/Default.mat',direction:'out',limit:50});check('Real material GUID reference resolves to shader',refs.status==='ok'&&refs.data.entries.some(row=>row.path.startsWith('Assets/Fixture.shader')));
 const incoming=await rpc('cowork.vfs_refs',{vfsPath:'Assets/Fixture.shader',direction:'in',limit:50});check('Real incoming GUID reference returns owning material',incoming.status==='ok'&&incoming.data.entries.some(row=>row.path.startsWith('Assets/Default.mat')));
 const calls=await rpc('cowork.vfs_refs',{vfsPath:'Assets/Player.cs:/FixtureSpace/Player/Add.fn',direction:'out',limit:50});check('Real CSharp call relation reaches helper method',calls.status==='ok'&&calls.data.entries.some(row=>row.path.includes('Helper.cs')&&row.path.includes('Compute')));
 const code=path.join(fixture,'Assets/Player.cs');fs.writeFileSync(code,fs.readFileSync(code,'utf8').replace('GCW_INSIGHT_ALPHA','GCW_INSIGHT_UPDATED'));
 const changeDeadline=Date.now()+10000;let changed;for(;;){changed=await rpc('cowork.vfs_search',{query:'GCW_INSIGHT_UPDATED',limit:50});if(changed.data?.results?.some(row=>row.path.startsWith('Assets/Player.cs')))break;if(Date.now()>changeDeadline)throw Error('Native watch did not synchronize actual code edit');await new Promise(resolve=>setTimeout(resolve,100));}
 check('Native watch synchronizes actual changed source bytes',changed.data.results.some(row=>row.lineText.includes('GCW_INSIGHT_UPDATED')));
 const obsolete=await rpc('cowork.vfs_search',{query:'GCW_INSIGHT_ALPHA',limit:50});check('Old indexed source text is removed after sync',obsolete.data.results.length===0);
 fs.renameSync(path.join(fixture,'Assets/Helper.cs'),path.join(fixture,'Assets/MovedHelper.cs'));fs.renameSync(path.join(fixture,'Assets/Helper.cs.meta'),path.join(fixture,'Assets/MovedHelper.cs.meta'));
 const renameDeadline=Date.now()+10000;let renamed;for(;;){renamed=await rpc('cowork.vfs_refs',{vfsPath:'Assets/Player.cs:/FixtureSpace/Player/Add.fn',direction:'out',limit:50});if(renamed.data?.entries?.some(row=>row.path.includes('MovedHelper.cs')))break;if(Date.now()>renameDeadline)throw Error('Rename did not update actual call reference');await new Promise(resolve=>setTimeout(resolve,100));}
 check('Rename rebuilds real call reference to new script path',renamed.data.entries.some(row=>row.path.includes('MovedHelper.cs'))&&!renamed.data.entries.some(row=>row.path.startsWith('Assets/Helper.cs:')));
 const forced=await rpc('index.build',{force:true});check('Explicit rebuild starts an actual build',forced.data.triggered===true||forced.data.indexBuilding===true);
 const forceDeadline=Date.now()+10000;for(;;){const reply=await rpc('status');if(reply.data?.lastBuildError)throw Error(reply.data.lastBuildError);if(reply.data.indexReady&&!reply.data.indexBuilding&&!reply.data.indexSyncing)break;if(Date.now()>forceDeadline)throw Error('Explicit rebuild did not finish');await new Promise(resolve=>setTimeout(resolve,100));}
 await stop();launch();const resumed=await rpc('initialize',{project_path:fixture});check('New worker process reopens actual published SQLite index',resumed.data?.indexReady===true);
 const persisted=await rpc('cowork.vfs_search',{query:'GCW_INSIGHT_UPDATED',limit:50});check('Restart retains actual updated indexed content',persisted.data.results.some(row=>row.path.startsWith('Assets/Player.cs')));
 check('Indexer never writes project cache or vendor state',!fs.existsSync(path.join(fixture,'.gamecowork-cli/UnityInsight'))&&resumed.data.indexPath.startsWith(home));
 const guardPath=path.join(home,'guard-events.jsonl');const denied=fs.existsSync(guardPath)?fs.readFileSync(guardPath,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];check('Actual indexing needed no external network or child command',!denied.some(record=>/external|child_process/.test(record.operation)));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;}
finally{await stop();for(const owner of pending.values())clearTimeout(owner.timer);fs.writeFileSync(path.join(run,'stderr.txt'),stderr);fs.writeFileSync(path.join(run,'responses.json'),JSON.stringify(responses,null,2));fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify({checks,failure,run,pids},null,2));console.log(JSON.stringify({run,passed:checks.filter(check=>check.passed).length,total:checks.length,failure:failure?.message,pids}));}
