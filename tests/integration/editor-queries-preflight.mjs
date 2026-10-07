// Actual Unity API preflight. Its fixture-local candidate functions do not
// validate production handlers; editor-scene-queries-smoke covers that boundary.
// No Provider/original CLI is invoked.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {readEditorIdentity} from '../support/editor-engine-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)),exec=promisify(execFile),args=process.argv.slice(2),option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const run=path.resolve(option('--output',path.join('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests','editor-bridge-queries-'+randomUUID()))),project=path.join(run,'project');
assert.ok(run.replaceAll('\\','/').toLowerCase().startsWith('f:/ai/agentmake/temp/gamecowork/tests/editor-bridge-queries-'));assert.equal(fs.existsSync(project),false,'Preflight never overwrites an existing project');
const editor=path.resolve(option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe')),identity=readEditorIdentity(editor);assert.equal(identity.engine,'unity','This preflight fixture currently uses real Unity .unity scenes');
const pkg=path.resolve(option('--package','F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/cli-phase6-guarded-20261001-03')),manifest=JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8'));
const cliSourcePath=path.join(repo,'src/agent/cli-main.beautified.js'),cliSource=fs.readFileSync(cliSourcePath,'utf8'),sha=bytes=>createHash('sha256').update(bytes).digest('hex');assert.equal(manifest.testGuardIncluded,true);assert.equal(manifest.sourceSha256.toLowerCase(),sha(fs.readFileSync(cliSourcePath)));
for(const relative of ['Assets/Editor','Packages','ProjectSettings','Temp'])fs.mkdirSync(path.join(project,relative),{recursive:true});
fs.writeFileSync(path.join(project,'ProjectSettings/ProjectVersion.txt'),'m_EditorVersion: '+identity.version+'\n');
fs.writeFileSync(path.join(project,'Packages/manifest.json'),JSON.stringify({dependencies:{'cn.gamecowork.bridge':'file:'+path.join(repo,'src/editor-bridge').replaceAll('\\','/'),'com.unity.modules.imgui':'1.0.0'}},null,2));
fs.copyFileSync(path.join(repo,'tests/fixtures/editor-queries-fixture.cs'),path.join(project,'Assets/Editor/GameCoworkQueriesPreflight.cs'));
const checks=[],check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(name+': PASS');},alive=pid=>{try{process.kill(pid,0);return true;}catch{return false;}},delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let unity,cli,failure,rawReport,toolList,stdout='',stderr='';
function cleanEnv(){const env={...process.env};for(const key of Object.keys(env))if(/^(GAMECOWORK_|CODELY_|UNITY_INSIGHT_|OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];return env;}
async function waitFor(test,name,budget=120000){const until=Date.now()+budget;while(!await test()){if(!alive(unity.pid))throw Error('Own Editor exited before '+name);assert.ok(Date.now()<until,'Timed out: '+name);await delay(100);}}
function declaration(name){const start=cliSource.indexOf('    function '+name+'(');assert.ok(start>=0);return cliSource.slice(start,cliSource.indexOf('\n    }',start)+6);}
const helpers=vm.createContext({});for(const name of ['oUa','tmu','EQ','h_e','_Q'])vm.runInContext(declaration(name),helpers);
const fixtureRow={name:'Owned Object',instanceID:7},flat={success:true,data:[fixtureRow]},nested={success:true,data:{success:true,data:[fixtureRow]}},emptyNested={success:true,data:{success:true,data:[]}};
const registryStart=cliSource.indexOf('(Yp.tools = ['),registryEnd=cliSource.indexOf(']),',registryStart);assert.ok(registryStart>=0&&registryEnd>registryStart);
const classSymbols=[...cliSource.slice(registryStart,registryEnd).matchAll(/new ([\w$]+)\(/g)].map(match=>match[1]);
const registration=classSymbols.map(symbol=>({symbol,name:new RegExp('\\('+symbol.replaceAll('$','\\$')+'\\.Name = "([^"\\n]+)"').exec(cliSource)?.[1]||null}));
const protocol={sourceSha256:manifest.sourceSha256,registeredUnityCatalog:registration,
 find:{command:'manage_gameobject',params:{action:'find',searchTerm:'string',searchMethod:['by_id','by_name','by_path'],findAll:true,searchInactive:true}},hierarchy:{command:'manage_scene',params:{action:'get_hierarchy'}},
 selectors:{byId:helpers.oUa('7','by_id'),byPath:helpers.oUa('Root/Child','by_path'),byName:helpers.oUa('Child','by_name')},
 consumerEvidence:{flatRowNames:Array.from(helpers.h_e(helpers.EQ(flat))),nestedRowNames:Array.from(helpers.h_e(helpers.EQ(nested))),emptyNestedSuccess:helpers._Q(emptyNested),emptyFlatSuccess:helpers._Q({success:true,data:[]})},
 proposedCandidateSemantics:'Exact case-insensitive by_name, exact hierarchy path, signed integer instance IDs; duplicates returned with scene/instance/global identity. This fixture records API semantics only; editor-scene-queries-smoke separately verifies production handlers and the actual registered schemas.'};
fs.writeFileSync(path.join(run,'protocol-facts.json'),JSON.stringify(protocol,null,2));
try{
 const expectUnregistered=args.includes('--expect-unregistered');
 check(expectUnregistered?'Historical source catalog has no query schemas':'Current source catalog registers both query schemas',expectUnregistered?registration.every(tool=>!['unity_scene','unity_gameobject'].includes(tool.name)):['unity_scene','unity_gameobject'].every(name=>registration.some(tool=>tool.name===name)));
 check('Actual legacy name consumer requires its nested data array',protocol.consumerEvidence.flatRowNames.length===0&&protocol.consumerEvidence.nestedRowNames[0]==='Owned Object'&&protocol.consumerEvidence.emptyNestedSuccess===true&&protocol.consumerEvidence.emptyFlatSuccess===false);
 unity=spawn(editor,['-batchmode','-nographics','-projectPath',project,'-executeMethod','GameCoworkQueriesPreflight.Run','-logFile',path.join(run,'editor.log')],{cwd:run,env:cleanEnv(),windowsHide:true,stdio:'ignore'});
 await waitFor(()=>fs.existsSync(path.join(project,'Temp/editor-queries-preflight.json')),'actual Unity query report');rawReport=JSON.parse(fs.readFileSync(path.join(project,'Temp/editor-queries-preflight.json'),'utf8'));check('Actual selected Editor PID/root/version produced the report',rawReport.pid===unity.pid&&path.resolve(rawReport.projectRoot)===project&&rawReport.unityVersion===identity.version);assert.ok(rawReport.success,rawReport.error||'Own Unity query fixture failed');for(const item of rawReport.checks)check(item.name,item.passed);
 await waitFor(()=>fs.existsSync(path.join(project,'Temp/.com-unity-gamecowork.json')),'existing own bridge discovery');
 const env={...cleanEnv(),GAMECOWORK_LOCAL_PROVIDER_MODE:'1',GAMECOWORK_CLI_PROBE_ROOT:run,GAMECOWORK_CLI_PROBE_SOURCE:pkg,GAMECOWORK_CLI_HOME:path.join(run,'cli-state'),GAMECOWORK_USER_DATA_DIR:path.join(run,'core-state'),GAMECOWORK_CLI_RESOURCE_DIR:path.join(pkg,'resources'),TEMP:path.join(run,'tmp'),TMP:path.join(run,'tmp'),BUN_RUNTIME_TRANSPILER_CACHE_PATH:path.join(run,'bun-cache')};for(const directory of [env.TEMP,env.GAMECOWORK_CLI_HOME,env.GAMECOWORK_USER_DATA_DIR])fs.mkdirSync(directory,{recursive:true});
 cli=spawn(path.join(pkg,'gamecowork.exe'),['--list-tools'],{cwd:project,env,windowsHide:true,stdio:['ignore','pipe','pipe']});cli.stdout.on('data',bytes=>stdout+=bytes.toString());cli.stderr.on('data',bytes=>stderr+=bytes.toString());const exit=await Promise.race([new Promise(resolve=>cli.once('exit',resolve)),delay(30000).then(()=>{throw Error('Guarded tool catalog deadline expired');})]);check('Own guarded CLI lists actual tools without invoking a model',exit===0);toolList=[...stdout.matchAll(/^- ([^:]+):/gm)].map(match=>match[1]);check(expectUnregistered?'Historical connected catalog lacks query schemas':'Current connected catalog registers both query schemas',expectUnregistered?!toolList.includes('unity_gameobject')&&!toolList.includes('unity_scene'):toolList.includes('unity_gameobject')&&toolList.includes('unity_scene'));check('Actual connected CLI registers its real editor control tool',toolList.includes('unity_editor'));
 const guardFile=path.join(run,'guard-events.jsonl'),events=fs.existsSync(guardFile)?fs.readFileSync(guardFile,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];check('Guarded catalog attempted no external network',!events.some(event=>/^(fetch|external-|node:https?\.|net\.)/.test(event.operation||'')));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error.message);}
finally{
 if(unity&&alive(unity.pid)){fs.writeFileSync(path.join(project,'Temp/query-preflight-exit'),'');const until=Date.now()+15000;while(alive(unity.pid)&&Date.now()<until)await delay(100);if(alive(unity.pid)){const info=JSON.parse(await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`Get-CimInstance Win32_Process -Filter 'ProcessId = ${unity.pid}' | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress`],{windowsHide:true,encoding:'utf8'}).then(result=>result.stdout));assert.ok(String(info.CommandLine).includes(project),'PID cleanup still belongs to this exact query fixture');await exec('taskkill.exe',['/PID',String(unity.pid),'/F'],{windowsHide:true});}}
 if(cli&&alive(cli.pid))await exec('taskkill.exe',['/PID',String(cli.pid),'/F'],{windowsHide:true});
 fs.writeFileSync(path.join(run,'cli-tools-stdout.txt'),stdout);fs.writeFileSync(path.join(run,'cli-tools-stderr.txt'),stderr);fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify({stage:'query-preflight-not-product-integration',run,project,identity,checks,failure,rawReport,protocol,toolList,ownEditorAlive:unity?alive(unity.pid):false,ownCliAlive:cli?alive(cli.pid):false,fixtureSha256:sha(fs.readFileSync(path.join(repo,'tests/fixtures/editor-queries-fixture.cs')))},null,2));console.log('Artifacts: '+run);
}
