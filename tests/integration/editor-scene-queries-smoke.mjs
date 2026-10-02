// Actual own Unity project -> own TCP queries -> same-source guarded Agent ACP.
// Default invokes no model/Provider. --issued-tools uses only the loopback model
// fixture; neither mode uses an original CLI/bridge, activation or user project.
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {readEditorIdentity} from '../support/editor-engine-fixture.mjs';
import {startEditorControlProvider} from '../fixtures/editor-control-provider.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)),exec=promisify(execFile);
const option=(key,fallback)=>process.argv.includes(key)?process.argv[process.argv.indexOf(key)+1]:fallback;
const appRoot=process.argv.includes('--app')?path.resolve(option('--app')):process.argv.includes('--packaged')?path.join(repo,'app'):null;
const bridgePackage=appRoot?path.join(appRoot,'editor-bridge'):path.join(repo,'src/editor-bridge');
const editor=path.resolve(option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe')),identity=readEditorIdentity(editor);
assert.equal(identity.engine,'unity','This query fixture currently uses Unity .unity scenes');
const pkg=path.resolve(option('--package','F:/AI/AgentMake/temp/GameCowork/scene-query-guarded-20261002'));
const manifest=JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8'));
const sha=value=>createHash('sha256').update(value).digest('hex');
assert.equal(manifest.testGuardIncluded,true);assert.equal(manifest.sourceSha256.toLowerCase(),sha(fs.readFileSync(path.join(repo,'src/agent/cli-main.beautified.js'))));
assert.equal(manifest.executableSha256.toLowerCase(),sha(fs.readFileSync(path.join(pkg,'gamecowork.exe'))));
const run=path.join('F:/AI/AgentMake/temp/GameCowork/tests','editor-bridge-scene-queries-'+randomUUID()),project=path.join(run,'工程 查询');
const issuedTools=process.argv.includes('--issued-tools');
const checks=[],queryEvidence=[],notifications=[],permissions=[],packageVerified=[],pending=new Map(),delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));let unity,cli,provider,normalCatalog,stderr='',stdout='',carry='',sequence=0,failure;
const alive=pid=>{try{process.kill(pid,0);return true;}catch(error){if(error.code==='ESRCH')return false;throw error;}};
const same=(a,b)=>String(a).replaceAll('\\','/').toLowerCase()===String(b).replaceAll('\\','/').toLowerCase();
const check=(name,condition)=>{checks.push({name,passed:!!condition});assert.ok(condition,name);console.log(name+': PASS');};
async function until(test,name,budget=90000){const end=Date.now()+budget;while(!await test()){if(unity&&!alive(unity.pid))throw Error('Own Editor exited before '+name);if(Date.now()>end)throw Error('Timed out: '+name);await delay(100);}}
function cleanEnv(){const env={...process.env};for(const key of Object.keys(env))if(/^(GAMECOWORK_|CODELY_|UNITY_INSIGHT_|OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];return env;}
function wire(text){const body=Buffer.from(text),header=Buffer.alloc(8);header.writeBigUInt64BE(BigInt(body.length));return Buffer.concat([header,body]);}
async function tcp(type,params){
 const config=JSON.parse(fs.readFileSync(path.join(project,'Temp/.com-unity-gamecowork.json'),'utf8'));assert.equal(config.unity_host,'127.0.0.1');assert.ok(same(config.project_path,path.join(project,'Assets')));
 const socket=net.createConnection({host:'127.0.0.1',port:config.unity_port}),id=randomUUID();let bytes=Buffer.alloc(0),ready=false;
 try{return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{reject(Error('Query TCP timeout'));socket.destroy();},7000);socket.on('error',error=>{clearTimeout(timer);reject(error);});socket.on('data',chunk=>{try{
  bytes=Buffer.concat([bytes,chunk]);if(!ready){const newline=bytes.indexOf(10);if(newline<0)return;const banner=bytes.subarray(0,newline).toString();assert.ok(same(decodeURIComponent(banner.match(/PROJECT_ROOT=([^\s]+)/)[1]),project));bytes=bytes.subarray(newline+1);ready=true;socket.write(wire('CLIENT_VERSION=2'));socket.write(wire(JSON.stringify({type,params,request_id:id})));}
  if(bytes.length>=8){const size=Number(bytes.readBigUInt64BE());assert.ok(size<=1048576);if(bytes.length<size+8)return;const response=JSON.parse(bytes.subarray(8,8+size));assert.equal(response.request_id,id);clearTimeout(timer);queryEvidence.push({type,params,result:response.result});resolve(response.result);}
 }catch(error){clearTimeout(timer);reject(error);socket.destroy();}});});}finally{socket.destroy();}
}
function rpc(method,params){const id=++sequence;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('Query ACP timeout: '+method));},30000);pending.set(id,{resolve,reject,timer});cli.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});}
async function query(type,params){const result=await tcp(type,params);assert.equal(result.success,true,JSON.stringify(result));assert.equal(result.data.success,true);assert.ok(same(result.data.projectRoot,project));return result.data;}
async function agentQuery(type,params){const reply=await rpc('_gamecowork/unity/tool/invoke',{command:type,toolParams:params,_meta:{gamecowork:{projectRoot:project}}});assert.equal(reply.error,undefined);assert.equal(reply.result?.success,true,JSON.stringify(reply));assert.equal(reply.result.response.success,true);return reply.result.response;}
try{
 fs.mkdirSync(run,{recursive:true});
 if(appRoot){
  const normal=JSON.parse(fs.readFileSync(path.join(appRoot,'cli/cli-package-manifest.json'),'utf8')),appManifest=JSON.parse(fs.readFileSync(path.join(appRoot,'package-manifest.json'),'utf8'));
  assert.equal(normal.testGuardIncluded,false,'Packaged normal Agent must not contain a test guard');assert.equal(normal.sourceSha256.toLowerCase(),manifest.sourceSha256.toLowerCase(),'Packaged normal/guarded Agents must share the maintained source');
  const relevant=appManifest.files.filter(file=>file.path==='GameCowork.exe'||file.path.startsWith('cli/')||file.path.startsWith('editor-bridge/'));
  assert.ok(relevant.some(file=>file.path==='GameCowork.exe')&&relevant.some(file=>file.path==='cli/gamecowork.exe')&&relevant.some(file=>file.path==='editor-bridge/Editor/EditorSceneQueries.cs'),'Package ledger must include actual host, normal Agent and query implementation');
  const paths=new Set();for(const file of relevant){assert.equal(paths.has(file.path),false,'Duplicate package resource path');paths.add(file.path);const absolute=path.resolve(appRoot,file.path);assert.ok(absolute.toLowerCase().startsWith(appRoot.toLowerCase()+path.sep),'Package resource must stay inside app');const bytes=fs.readFileSync(absolute);assert.equal(bytes.length,file.size);assert.equal(sha(bytes),file.sha256.toLowerCase(),'Packaged resource SHA: '+file.path);packageVerified.push({path:file.path,size:file.size,sha256:file.sha256});}
  assert.equal(sha(fs.readFileSync(path.join(appRoot,'cli/gamecowork.exe'))),normal.executableSha256.toLowerCase());assert.equal(JSON.parse(fs.readFileSync(path.join(bridgePackage,'package.json'),'utf8')).name,'cn.gamecowork.bridge');
  check('Actual package host/normal-Agent/editor resources match their SHA ledger',true);
 }
 for(const folder of ['Assets/Editor','Packages','ProjectSettings','Temp'])fs.mkdirSync(path.join(project,folder),{recursive:true});
 fs.writeFileSync(path.join(project,'ProjectSettings/ProjectVersion.txt'),'m_EditorVersion: '+identity.version+'\n');
 fs.writeFileSync(path.join(project,'Packages/manifest.json'),JSON.stringify({dependencies:{'cn.gamecowork.bridge':'file:'+bridgePackage.replaceAll('\\','/'),'com.unity.modules.imgui':'1.0.0'}},null,2));
 fs.copyFileSync(path.join(repo,'tests/fixtures/editor-scene-query-fixture.cs'),path.join(project,'Assets/Editor/GameCoworkSceneQueryFixture.cs'));
 fs.copyFileSync(path.join(repo,'tests/fixtures/editor-scene-query-component.cs'),path.join(project,'Assets/GameCoworkQueryComponent.cs'));
 const env={...cleanEnv(),UPM_CACHE_ROOT:path.join(run,'upm-cache'),UPM_NPM_CACHE_PATH:path.join(run,'upm-npm-cache'),UPM_GIT_LFS_CACHE_PATH:path.join(run,'upm-git-lfs-cache')};
 unity=spawn(editor,['-batchmode','-nographics','-projectPath',project,'-executeMethod','GameCoworkSceneQueryFixture.Boot','-disable-assembly-updater','-logFile',path.join(run,'editor.log')],{cwd:run,env,windowsHide:true,stdio:'ignore'});
 await until(()=>fs.existsSync(path.join(project,'Temp/scene-query-ready.json'))&&fs.existsSync(path.join(project,'Temp/.com-unity-gamecowork.json')),'own scene fixture');
 const ready=JSON.parse(fs.readFileSync(path.join(project,'Temp/scene-query-ready.json'),'utf8'));
 check('Actual existing-license Editor produces the own project/scene identities',ready.pid===unity.pid&&same(ready.projectRoot,project)&&ready.unityVersion===identity.version);
 const saved=['Assets/QueriesA.unity','Assets/QueriesB.unity','Assets/QueriesClosed.unity','Assets/QueryAsset.prefab'].map(file=>({file,sha:sha(fs.readFileSync(path.join(project,file)))}));
 const hierarchy=await query('manage_scene',{action:'get_hierarchy'});
 check('Actual hierarchy includes additive and unsaved scenes, excludes preview scenes',hierarchy.scenes.length===3&&hierarchy.data.length===3&&hierarchy.data.some(node=>node.instanceID===ready.unsavedId));
 const a=hierarchy.data.find(node=>node.instanceID===ready.rootA),active=a.children.find(node=>node.instanceID===ready.activeA),inactive=a.children.find(node=>node.name==='InactiveParent');
 check('Actual hierarchy retains parent/sibling/scene/global IDs and inactive descendants',active.parentID===ready.rootA&&active.scenePath==='Assets/QueriesA.unity'&&active.globalObjectId&&inactive.children[0].activeSelf&&!inactive.children[0].activeInHierarchy&&a.children.length===3);
 const find=(searchTerm,extra={})=>query('manage_gameobject',{action:'find',searchTerm,searchMethod:'by_name',findAll:true,searchInactive:true,...extra});
 check('Exact case-insensitive by_name retains duplicate identities',(await find('activechild')).data.length===2);
 const peers=await find('Peer');check('Same-name siblings retain distinct instance IDs',peers.data.length===2&&new Set(peers.data.map(value=>value.instanceID)).size===2);
 check('Exact by_path keeps ambiguous additive paths',(await find('QueryRoot/ActiveChild',{searchMethod:'by_path'})).data.length===2);
 check('findAll false returns one real candidate',(await find('Peer',{findAll:false})).data.length===1);
 check('searchInactive false respects inactive ancestors',(await find('InactiveChild',{searchInactive:false})).data.length===0&&(await find('InactiveChild')).data[0].instanceID===ready.inactiveChild);
 check('Missing name is a successful empty actual match list',(await find('MissingOwnObject')).data.length===0);
 check('Exact instance ID resolves its actual loaded object',(await find(String(ready.activeA),{searchMethod:'by_id'})).data[0].instanceID===ready.activeA);
 for(const [name,id] of [['prefab asset',ready.prefabId],['closed scene',ready.closedId],['preview scene',ready.previewId]])check('by_id excludes '+name,(await find(String(id),{searchMethod:'by_id'})).data.length===0);
 check('Queries exclude asset and preview names',(await find('PrefabAssetOnly')).data.length===0&&(await find('PreviewOnly')).data.length===0);
 const children=await query('manage_gameobject',{action:'list_children',target:{id:ready.rootA}});check('Direct child listing returns real direct children and order',children.data.length===3&&children.data.every((child,index)=>child.parentID===ready.rootA&&child.siblingIndex===index));
 const components=await query('manage_gameobject',{action:'get_components',target:{id:ready.activeA}}),owned=components.data.find(value=>value.type==='GameCoworkQueryComponent');
 check('Actual serialized component readback exposes custom values without invoking getters',components.data.some(value=>value.type==='UnityEngine.Light')&&owned.properties.some(value=>value.path==='health'&&value.value==='37')&&owned.properties.some(value=>value.path==='label'&&value.value==='owned-query-sentinel')&&!owned.properties.some(value=>value.path==='ThrowingGetter'));
 check('Actual nested serialized fields and array values remain readable',owned.properties.some(value=>value.path==='details.score'&&value.value==='91')&&owned.properties.some(value=>value.path==='sampleValues.Array.data[1]'&&value.value==='5'));
 const hidden=await query('manage_gameobject',{action:'get_components',target:{id:ready.activeA},includeNonPublicSerialized:true});
 check('Hidden serialized fields require the explicit query flag',!owned.properties.some(value=>value.path==='hiddenValue')&&hidden.data.find(value=>value.type==='GameCoworkQueryComponent').properties.some(value=>value.path==='hiddenValue'&&value.value==='hidden-query-sentinel'));
 for(const params of [{action:'find',searchMethod:'by_id',searchTerm:'1x'},{action:'find',searchMethod:'by_id',searchTerm:'2147483648'},{action:'find',searchTerm:'x',findAll:'true'},{action:'list_children',target:'QueryRoot'},{action:'get_components',target:{id:ready.activeA,name:'x'}},{action:'delete',target:{id:ready.activeA}}])check('Invalid/ambiguous/write query is rejected: '+JSON.stringify(params),(await tcp('manage_gameobject',params)).success===false);
 check('Scene write action is rejected',(await tcp('manage_scene',{action:'save'})).success===false);
 fs.writeFileSync(path.join(project,'Temp/query-observe'),'');await until(()=>fs.existsSync(path.join(project,'Temp/query-observed.json')),'post-query observation',10000);
 const observed=JSON.parse(fs.readFileSync(path.join(project,'Temp/query-observed.json'),'utf8'));
 check('Actual queries preserve scene bytes, dirty flags, selection and loaded scene count',saved.every(value=>value.sha===sha(fs.readFileSync(path.join(project,value.file))))&&observed.selection===ready.activeA&&observed.sceneCount===ready.sceneCount&&observed.sceneADirty===ready.sceneADirty&&observed.sceneBDirty===ready.sceneBDirty);
 const agentEnv={...cleanEnv(),GAMECOWORK_LOCAL_PROVIDER_MODE:'1',GAMECOWORK_DISABLE_AUTO_UPDATE:'1',GAMECOWORK_CLI_PROBE_ROOT:run,GAMECOWORK_CLI_PROBE_SOURCE:pkg,GAMECOWORK_CLI_HOME:path.join(run,'cli-state'),GAMECOWORK_USER_DATA_DIR:path.join(run,'core-state'),GAMECOWORK_CLI_RESOURCE_DIR:path.join(pkg,'resources'),TEMP:path.join(run,'tmp'),TMP:path.join(run,'tmp'),BUN_RUNTIME_TRANSPILER_CACHE_PATH:path.join(run,'bun-cache')};
 for(const folder of [agentEnv.TEMP,agentEnv.GAMECOWORK_CLI_HOME,agentEnv.GAMECOWORK_USER_DATA_DIR])fs.mkdirSync(folder,{recursive:true});
 if(issuedTools){
  provider=await startEditorControlProvider({plans:{GCW_QUERY_HIERARCHY:{toolName:'unity_scene',arguments:{action:'get_hierarchy'}},GCW_QUERY_COMPONENTS:{toolName:'unity_gameobject',arguments:{action:'get_components',target:{id:ready.activeA}}}}});
  fs.mkdirSync(path.join(project,'.gamecowork-cli'),{recursive:true});fs.writeFileSync(path.join(project,'.gamecowork-cli/settings.json'),JSON.stringify({selectedAuthType:'gamecowork-oauth',model:provider.model,disableNextSpeakerCheck:true,telemetry:{enabled:false},contentGenerator:{authType:'gamecowork-oauth',wireApi:'chat',overrides:{model:{authType:'openai',wireApi:'chat'}}}}));
  Object.assign(agentEnv,{CUSTOM_AUTH:'1',OPENAI_API_KEY:provider.apiKey,OPENAI_BASE_URL:provider.baseUrl,OPENAI_MODEL:provider.model});
 }
 const listed=await exec(path.join(pkg,'gamecowork.exe'),['--list-tools'],{cwd:project,env:agentEnv,windowsHide:true,timeout:30000,maxBuffer:4*1024*1024});fs.writeFileSync(path.join(run,'tools.txt'),listed.stdout);
 check('Actual connected same-source Agent catalog registers both query schemas',listed.stdout.includes('- unity_scene:')&&listed.stdout.includes('- unity_gameobject:'));
 if(appRoot){
  const normalEnv={...agentEnv,GAMECOWORK_CLI_HOME:path.join(run,'normal-cli-state'),GAMECOWORK_USER_DATA_DIR:path.join(run,'normal-core-state'),GAMECOWORK_CLI_RESOURCE_DIR:path.join(appRoot,'cli/resources'),GAMECOWORK_HOME:path.join(run,'normal-installation'),GAMECOWORK_CLI_INTERNAL_DISABLE_AUTO_UPDATE:'1'};
  for(const directory of [normalEnv.GAMECOWORK_CLI_HOME,normalEnv.GAMECOWORK_USER_DATA_DIR,normalEnv.GAMECOWORK_HOME])fs.mkdirSync(directory,{recursive:true});
  const normalListed=await exec(path.join(appRoot,'cli/gamecowork.exe'),['--list-tools'],{cwd:project,env:normalEnv,windowsHide:true,timeout:30000,maxBuffer:4*1024*1024});fs.writeFileSync(path.join(run,'normal-tools.txt'),normalListed.stdout);fs.writeFileSync(path.join(run,'normal-tools-stderr.txt'),normalListed.stderr);
  normalCatalog=[...normalListed.stdout.matchAll(/^- ([^:]+):/gm)].map(match=>match[1]);check('Actual unguarded packaged normal Agent lists both query tools using its packaged resources',normalCatalog.includes('unity_scene')&&normalCatalog.includes('unity_gameobject'));
 }
 cli=spawn(path.join(pkg,'gamecowork.exe'),['--experimental-acp',issuedTools?'--upm=true':'--upm=false','--collaboration-mode','default','--approval-mode','default','--disable-next-speaker-check'],{cwd:project,env:agentEnv,windowsHide:true,stdio:['pipe','pipe','pipe']});
 cli.stdout.on('data',chunk=>{stdout+=chunk.toString();carry+=chunk.toString();let end;while((end=carry.indexOf('\n'))>=0){const line=carry.slice(0,end);carry=carry.slice(end+1);let message;try{message=JSON.parse(line);}catch{continue;}if(!message.method&&pending.has(message.id)){const item=pending.get(message.id);pending.delete(message.id);clearTimeout(item.timer);item.resolve(message);}else if(message.method&&message.id!==undefined){
  if(issuedTools&&message.method==='session/request_permission'){permissions.push(message.params);const allow=message.params.options?.find(option=>option.kind==='allow_once');cli.stdin.write(JSON.stringify({jsonrpc:'2.0',id:message.id,result:{outcome:allow?{outcome:'selected',optionId:allow.optionId}:{outcome:'cancelled'}}})+'\n');}
  else cli.stdin.write(JSON.stringify({jsonrpc:'2.0',id:message.id,error:{code:-32601,message:'Read-only query probe'}})+'\n');
 }else notifications.push(message);}});cli.stderr.on('data',bytes=>stderr+=bytes.toString());
 const init=await rpc('initialize',{protocolVersion:1,clientCapabilities:{fs:{readTextFile:false,writeTextFile:false},terminal:false}});check('Actual guarded Agent initializes without a model',init.result?.protocolVersion===1);
 const connected=await rpc('_gamecowork/unity/window_bridge/list_windows',{_meta:{gamecowork:{projectRoot:project}}});check('Actual Agent TCP bridge connects to its frozen own root',connected.result?.success===true);
 const agentHierarchy=await agentQuery('manage_scene',{action:'get_hierarchy'});check('Actual Agent ACP hierarchy returns real scene identities',agentHierarchy.data.some(value=>value.instanceID===ready.rootA)&&same(agentHierarchy.projectRoot,project));
 check('Actual Agent ACP component query reads the owned sentinel',(await agentQuery('manage_gameobject',{action:'get_components',target:{id:ready.activeA}})).data.find(value=>value.type==='GameCoworkQueryComponent').properties.some(value=>value.value==='owned-query-sentinel'));
 const names=await rpc('_gamecowork/unity/context/gameobject_names',{query:'Peer',_meta:{gamecowork:{projectRoot:project}}});check('Actual @GameObject names consumer receives both actual rows',names.result?.success===true&&names.result.names.length===2&&names.result.names.every(name=>name==='Peer'));
 const context=await rpc('_gamecowork/unity/context/gameobject',{query:String(ready.activeA),_meta:{gamecowork:{projectRoot:project}}});check('Actual @GameObject context includes actual scene/object identity',context.result?.success===true&&context.result.content.includes('ActiveChild')&&context.result.content.includes(String(ready.activeA)));
 if(issuedTools){
  const opened=await rpc('session/new',{cwd:project,mcpServers:[]}),sessionId=opened.result?.sessionId;assert.equal(typeof sessionId,'string');
  for(const key of ['GCW_QUERY_HIERARCHY','GCW_QUERY_COMPONENTS']){
   const prompted=await rpc('session/prompt',{sessionId,prompt:[{type:'text',text:key+': use exactly the requested issued read-only query on this owned Unity test project.'}]});assert.equal(prompted.result?.stopReason,'end_turn',JSON.stringify(prompted));
   const record=provider.requests.find(value=>value.key===key&&value.toolResultMatchedIssuedId);assert.ok(record,'The model result must match its exact issued tool-call ID');
   const schema=record.selectedToolSchema;assert.equal(schema?.name,key==='GCW_QUERY_HIERARCHY'?'unity_scene':'unity_gameobject');
   if(key==='GCW_QUERY_HIERARCHY')check('Actual model-issued unity_scene returns its exact tool ID and physical hierarchy',schema.parameters.properties.action.enum.length===1&&schema.parameters.properties.action.enum[0]==='get_hierarchy'&&record.resultText.includes(String(ready.rootA))&&record.resultText.includes('Assets/QueriesA.unity')&&record.resultText.includes('completed successfully'));
   else check('Actual model-issued unity_gameobject reads its exact target/sentinel with its issued tool ID',schema.parameters.properties.target.type==='object'&&record.resultText.includes(String(ready.activeA))&&record.resultText.includes('owned-query-sentinel')&&record.resultText.includes('details.score')&&record.resultText.includes('completed successfully'));
  }
  check('Actual Agent tool notifications record the model-issued query completion',['unity_scene','unity_gameobject'].every(name=>{const record=provider.requests.find(value=>value.selectedToolName===name&&value.toolResultMatchedIssuedId);return notifications.some(value=>value.params?.update?.sessionUpdate==='tool_call_update'&&value.params.update.toolCallId===record?.issuedId&&value.params.update.status==='completed');}));
 }
 fs.writeFileSync(path.join(project,'Temp/query-close-a'),'');await until(()=>fs.existsSync(path.join(project,'Temp/query-a-closed')),'explicit fixture scene close',10000);
 check('Closed scene invalidates its old ID without reopening it',(await find(String(ready.activeA),{searchMethod:'by_id'})).data.length===0&&(await query('manage_scene',{action:'get_hierarchy'})).scenes.length===2);
 const events=fs.existsSync(path.join(run,'guard-events.jsonl'))?fs.readFileSync(path.join(run,'guard-events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];
 check('Guarded Agent attempted no outside network',!events.some(event=>/^(fetch|external-|node:https?\.|net\.)/.test(event.operation||'')));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error.message);}
finally{
 for(const item of pending.values())clearTimeout(item.timer);
 if(cli&&alive(cli.pid))await exec('taskkill.exe',['/PID',String(cli.pid),'/T','/F'],{windowsHide:true});
 if(provider)await provider.close();
 if(unity&&alive(unity.pid)){fs.writeFileSync(path.join(project,'Temp/query-exit'),'');const end=Date.now()+15000;while(alive(unity.pid)&&Date.now()<end)await delay(100);if(alive(unity.pid)){const proc=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${unity.pid}').CommandLine`],{windowsHide:true});assert.ok(proc.stdout.includes(project),'PID still belongs to this exact own query project');await exec('taskkill.exe',['/PID',String(unity.pid),'/T','/F'],{windowsHide:true});}}
 fs.writeFileSync(path.join(run,'stdout.txt'),stdout);fs.writeFileSync(path.join(run,'stderr.txt'),stderr);
 fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify({passed:!failure,mode:appRoot?'packaged-resources-with-guarded-agent':'source',packagedResources:!!appRoot,packageresources:!!appRoot,guardedAgent:true,appRoot,bridgePackage,normalAgent:appRoot?path.join(appRoot,'cli/gamecowork.exe'):null,normalCatalog,packageVerified,hostExeVerifiedOnly:!!appRoot,checks,failure,queryEvidence,project,editor,editorPid:unity?.pid,agentSourceSha256:manifest.sourceSha256,ownEditorAlive:unity?alive(unity.pid):false,ownCliAlive:cli?alive(cli.pid):false,modelInvoked:issuedTools,providerInvoked:issuedTools?'loopback-fixture':false,providerRequests:provider?.requests,notifications,permissions},null,2));console.log('Artifacts: '+run);
}
