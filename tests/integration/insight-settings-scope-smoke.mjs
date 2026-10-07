// Real Rust + Core handlers, with only owned temporary TOML settings. No Agent
// session, model, Editor, Provider or external network is needed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createInsightFixture} from '../fixtures/insight-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)),args=process.argv.slice(2);
const option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const packaged=args.includes('--packaged'),app=path.join(repo,'app');
const run=path.resolve(repo,'codelyreversebackup/work','insight-settings-scope-'+randomUUID());
const core=path.join(repo,packaged?'app/core':'src/core/binary/out'),agentPackage=path.resolve(option('--package','F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/cli-guarded-20261001-12'));
const agent=path.join(agentPackage,'gamecowork.exe'),binary=path.resolve(option('--binary',packaged?path.join(app,'GameCowork.exe'):path.join(repo,'src/shell/target/debug/GameCowork.exe')));
const resources=packaged?path.join(app,'cli/resources'):path.join(agentPackage,'resources');
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if(packaged){const manifest=JSON.parse(fs.readFileSync(path.join(app,'cli/cli-package-manifest.json')));assert.equal(manifest.testGuardIncluded,false);assert.equal(manifest.executableSha256.toLowerCase(),hash(path.join(app,'cli/gamecowork.exe')));assert.equal(hash(path.join(core,'index.js')),hash(path.join(repo,'src/core/binary/out/index.js')));assert.equal(hash(path.join(resources,'builtin-agents/unity-insight.toml')),hash(path.join(repo,'src/agent/resources/builtin-agents/unity-insight.toml')));}
const a=createInsightFixture(path.join(run,'A')),b=createInsightFixture(path.join(run,'B')),unopened=createInsightFixture(path.join(run,'unopened'));
const toml=root=>path.join(root,'.gamecowork-cli/agents/unity-insight.toml');
const user=path.join(run,'data/cli-state/agents/unity-insight.toml');
for(const [file,max]of[[toml(a.root),17],[toml(b.root),23],[toml(unopened.root),47],[user,33]]){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'# Managed by GameCowork (unityInsight.maxTurns).\n[run]\nmax_turns = '+max+'\n');}
const env={...process.env};for(const key of Object.keys(env))if(/^(GAMECOWORK_|CODELY_|UNITY_INSIGHT_|OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];
Object.assign(env,{GAMECOWORK_APP_ROOT:packaged?app:run,GAMECOWORK_DATA_DIR:path.join(run,'data'),GAMECOWORK_FRONTEND_DIR:packaged?path.join(app,'frontend'):path.join(repo,'src/frontend/bundle'),GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_AGENT_PATH:agent,GAMECOWORK_AGENT_RESOURCE_DIR:resources,GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_CHAT_ROOT:run,GAMECOWORK_CHAT_CORE:packaged?app:path.join(repo,'src/core'),GAMECOWORK_CHAT_AGENT:agent,GAMECOWORK_CLI_PROBE_ROOT:run,GAMECOWORK_CLI_PROBE_SOURCE:agentPackage,NODE_OPTIONS:'--require '+JSON.stringify(path.join(repo,'tests/fixtures/chat-core-guard.cjs'))});
let child,log='',origin,failure;const checks=[],responses=[],pids=[];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),check=(name,ok)=>{checks.push({name,passed:!!ok});assert.ok(ok,name);console.log(name+': PASS');};
async function http(route,body){const reply=await fetch(new URL(route,origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});const data=await reply.json();responses.push({route,status:reply.status,error:data.error,maxTurns:data.maxTurns});return {status:reply.status,data};}
const settings=(kind,body)=>http('/api/tauri/unity-insight/'+kind,body);
async function launch(){const start=log.length;child=spawn(binary,[],{cwd:run,env,windowsHide:true,stdio:['ignore','pipe','pipe']});pids.push(child.pid);child.stdout.on('data',bytes=>log+=bytes.toString());child.stderr.on('data',bytes=>log+=bytes.toString());const deadline=Date.now()+45000;while(!(origin=log.slice(start).match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/)?.[1])){assert.ok(Date.now()<deadline&&child.exitCode===null,'Owned host startup');await wait(100);}}
async function stop(){if(child&&child.exitCode===null){const done=new Promise(resolve=>child.once('exit',resolve));child.kill();await done;}}
try{
 await launch();
 const keyA=(await http('/api/tauri/hub/open-workspace',{path:a.root})).data.workspaceKey,keyB=(await http('/api/tauri/hub/open-workspace',{path:b.root})).data.workspaceKey;assert.ok(keyA&&keyB);
 let reply=await settings('get-max-turns',{scope:'workspace',workspaceKey:keyA});check('Workspace get binds omitted directory to opened A',reply.status===200&&reply.data.maxTurns===17&&!reply.data.error);
 reply=await settings('get-max-turns',{scope:'workspace',workspaceKey:keyA,workspaceDir:b.root});check('Workspace get cannot redirect A key into opened B',reply.status===200&&reply.data.maxTurns===17&&!reply.data.error);
 reply=await settings('get-max-turns',{scope:'workspace',workspaceKey:keyA,workspaceDir:unopened.root});check('Workspace get cannot redirect A key into unopened root',reply.status===200&&reply.data.maxTurns===17&&!reply.data.error);
 reply=await settings('get-max-turns',{scope:'workspace',workspaceDir:b.root});check('Directory-only get resolves only authorized opened B',reply.status===200&&reply.data.maxTurns===23&&!reply.data.error);
 reply=await settings('get-max-turns',{scope:'workspace',workspaceDir:unopened.root});check('Unopened directory-only settings request is rejected',reply.status===403);
 const untouched=fs.readFileSync(toml(b.root)),unopenedBytes=fs.readFileSync(toml(unopened.root));
 reply=await settings('set-max-turns',{scope:'workspace',workspaceKey:keyA,workspaceDir:b.root,maxTurns:15});check('Workspace set writes authorized A despite claimed B',reply.status===200&&reply.data.maxTurns===15&&!reply.data.error&&!fs.existsSync(toml(a.root)));
 check('Opened B and unopened project bytes stay untouched',fs.readFileSync(toml(b.root)).equals(untouched)&&fs.readFileSync(toml(unopened.root)).equals(unopenedBytes));
 reply=await settings('get-max-turns',{scope:'user',workspaceDir:unopened.root,workspaceKey:keyA});check('User get ignores unrelated project path and uses own CLI home',reply.status===200&&reply.data.maxTurns===33&&!reply.data.error);
 reply=await settings('set-max-turns',{scope:'user',workspaceDir:unopened.root,workspaceKey:keyA,maxTurns:15});check('User set restores default only in own CLI home',reply.status===200&&reply.data.maxTurns===15&&!reply.data.error&&!fs.existsSync(user)&&fs.readFileSync(toml(unopened.root)).equals(unopenedBytes));
 await http('/api/tauri/hub/close-workspace',{workspaceKey:keyA});reply=await settings('set-max-turns',{scope:'workspace',workspaceKey:keyA,workspaceDir:b.root,maxTurns:15});check('Closed workspace key cannot mutate opened B',reply.status>=400&&fs.readFileSync(toml(b.root)).equals(untouched));
 reply=await settings('set-max-turns',{scope:'workspace',workspaceKey:keyB,maxTurns:27});check('Actual nondefault setting uses the restored builtin agent template',reply.status===200&&reply.data.maxTurns===27&&!reply.data.error&&/max_turns\s*=\s*27/.test(fs.readFileSync(toml(b.root),'utf8')));
 reply=await settings('set-max-turns',{scope:'user',workspaceDir:unopened.root,maxTurns:34});check('Actual nondefault user setting changes only owned CLI home',reply.status===200&&reply.data.maxTurns===34&&!reply.data.error&&/max_turns\s*=\s*34/.test(fs.readFileSync(user,'utf8'))&&fs.readFileSync(toml(unopened.root)).equals(unopenedBytes));
 await stop();await launch();reply=await settings('get-max-turns',{scope:'workspace',workspaceKey:keyB,workspaceDir:unopened.root});check('Fresh host and Core reopen persisted authorized project setting',reply.status===200&&reply.data.maxTurns===27&&!reply.data.error);
 reply=await settings('get-max-turns',{scope:'user',workspaceDir:b.root});check('Fresh host and Core reopen persisted user setting without project redirect',reply.status===200&&reply.data.maxTurns===34&&!reply.data.error);
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;}
finally{
 await stop();
 const guard=path.join(run,'core-guard-events.jsonl'),attempts=fs.existsSync(guard)?fs.readFileSync(guard,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse).filter(record=>/^external/.test(record.operation)):[];
 if(attempts.length&&!failure){failure={message:'Unexpected external network attempt'};process.exitCode=1;}
 const ownPidGone=pids.every(pid=>{try{process.kill(pid,0);return false;}catch{return true;}});if(!ownPidGone)process.exitCode=1;
 fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify({run,packaged,binary,core,resources,checks,responses,failure,networkAttempts:attempts,ownPids:pids,ownPidGone},null,2));fs.writeFileSync(path.join(run,'shell.txt'),log);console.log(JSON.stringify({run,packaged,passed:checks.filter(c=>c.passed).length,total:checks.length,failure:failure?.message,networkAttempts:attempts.length,ownPidGone}));
}
