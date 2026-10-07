// Real maintained Node/Core scans actual installed Editors. No Hub/Editor/CLI
// executable is started. A test-only guard blocks personal project discovery;
// GUI getRecentProjects is explicitly rejected, not replaced with a fake Editor
// result. The installed-editor responses and frontend files are unmodified.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readEditorIdentity} from '../support/editor-engine-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)),args=process.argv.slice(2);
const option=(name,value)=>args.includes(name)?args[args.indexOf(name)+1]:value;
const packaged=args.includes('--packaged'),previous=args.includes('--previous');
const temp=path.resolve(repo,'codelyreversebackup/work'),run=path.resolve(option('--output',path.join(temp,'editor-installations-real-'+randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase()+path.sep));assert.ok(!fs.existsSync(run)||fs.readdirSync(run).length===0,'Use a new owned output directory');fs.mkdirSync(run,{recursive:true});
const app=path.join(repo,'app'),core=path.resolve(option('--core',path.join(repo,packaged?'app/core':'src/core/binary/out')));
const runtime=path.resolve(option('--runtime',path.join(app,'core/gamecowork-runtime.exe'))),runtimeCore=path.dirname(runtime);
const frontend=path.resolve(option('--frontend',path.join(repo,packaged?'app/frontend':'src/frontend/bundle'))),binary=path.resolve(option('--binary',path.join(repo,packaged?'app/GameCowork.exe':'src/shell/target/debug/GameCowork.exe')));
const guard=path.join(repo,'tests/fixtures/editor-installations-real-core-guard.cjs'),normalize=value=>path.resolve(value).toLowerCase();
const samePath=(a,b)=>String(a||'').replaceAll('\\','/').toLowerCase()===String(b||'').replaceAll('\\','/').toLowerCase();
const hubDirectories=['UnityHub','TuanjieHub'].map(name=>path.join(process.env.APPDATA,name));
const hubFiles=hubDirectories.flatMap(dir=>['secondaryInstallPath.json','editors-v2.json','editors.json','versionMapping.json','versionMapping.json.json'].map(name=>path.join(dir,name)));
const installRoots=new Set(),scanDirectories=[...hubDirectories];
const addRoot=value=>{if(typeof value==='string'&&fs.existsSync(value)&&fs.statSync(value).isDirectory())installRoots.add(fs.realpathSync(value));};
for(const dir of hubDirectories){
  const secondary=path.join(dir,'secondaryInstallPath.json');if(fs.existsSync(secondary)){const location=JSON.parse(fs.readFileSync(secondary,'utf8'));if(typeof location==='string')addRoot(location.trim().replace(/^"|"$/g,''));}
  for(const name of ['editors-v2.json','editors.json']){const file=path.join(dir,name);if(!fs.existsSync(file))continue;const value=JSON.parse(fs.readFileSync(file,'utf8'));for(const editor of value.data||[])for(const location of Array.isArray(editor.location)?editor.location:editor.location?[editor.location]:[]){if(typeof location!=='string'||!fs.existsSync(location))continue;addRoot(fs.statSync(location).isFile()?path.dirname(path.dirname(location)):location);}}
}
const programFiles=process.env.ProgramFiles;
if(programFiles){scanDirectories.push(programFiles);for(const type of ['Unity','Tuanjie'])addRoot(path.join(programFiles,type,'Hub/Editor'));for(const name of fs.readdirSync(programFiles))if(/^(?:Unity|Tuanjie) /.test(name))addRoot(path.join(programFiles,name));}
assert.ok(installRoots.size,'Real public Hub metadata identifies installed Editor roots');
fs.writeFileSync(path.join(run,'read-policy.json'),JSON.stringify({hubFiles,scanDirectories,installRoots:[...installRoots],codeRoots:[core]},null,2));
const publicHashes=new Map(hubFiles.filter(file=>fs.existsSync(file)).map(file=>[file,createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
const checks=[],errors=[],external=[],editorResponses=[],apiKinds=[],resourceRequests=[],cleanupErrors=[],ownPids=new Set();
let shell,context,page,gui,origin,failure,editors=[],shellLog='',blockedPersonalProjectRequests=0;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function poll(fn,label,timeout=30000){const end=Date.now()+timeout;while(!await fn()){assert.ok(Date.now()<end,'Timed out: '+label);await delay(80);}}
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
const alive=pid=>{try{process.kill(pid,0);return true;}catch{return false;}};
const callOf=request=>{try{const value=JSON.parse(request.postData());return value.message||value;}catch{return null;}};
function playwright(){if(option('--playwright',process.env.GAMECOWORK_E2E_PLAYWRIGHT))return option('--playwright',process.env.GAMECOWORK_E2E_PLAYWRIGHT);try{return createRequire(import.meta.url).resolve('playwright');}catch{}const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),'npm-cache/_npx');const found=fs.readdirSync(cache).map(name=>path.join(cache,name,'node_modules/playwright/index.mjs')).filter(file=>fs.existsSync(file));assert.ok(found.length);return found[0];}
function chrome(){if(option('--chrome',process.env.GAMECOWORK_E2E_CHROME))return option('--chrome',process.env.GAMECOWORK_E2E_CHROME);const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),'ms-playwright');for(const name of fs.readdirSync(cache).filter(name=>/^chromium-\d+$/.test(name)).sort((a,b)=>+b.split('-')[1]-+a.split('-')[1]))for(const file of ['chrome-win64/chrome.exe','chrome-win/chrome.exe'])if(fs.existsSync(path.join(cache,name,file)))return path.join(cache,name,file);throw Error('A cached Chromium is required');}
function safeEditor(editor){return{product:editor.product,path:editor.path,version:editor.version,semver:editor.semver,technicalVersion:editor.technicalVersion,marketingVersion:editor.marketingVersion,tuanjieVersion:editor.tuanjieVersion,unityVersion:editor.unityVersion,displayVersion:editor.displayVersion,versionInfoSource:editor.versionInfoSource,versionInfoWarning:editor.versionInfoWarning,architecture:editor.architecture,location:editor.location,folderPath:editor.folderPath,manual:editor.manual,overallStatus:editor.overallStatus,buildPlatformShortNames:editor.buildPlatformShortNames,modules:(editor.modules||[]).map(module=>({id:module.id,name:module.name,selected:module.selected})),moduleInfoAvailable:editor.moduleInfoAvailable,moduleInfoSource:editor.moduleInfoSource,moduleInfoWarning:editor.moduleInfoWarning};}
async function rpc(type){const id=randomUUID(),response=await fetch(origin+'/api/tauri/invoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messageType:type,messageId:id,data:{}})});assert.equal(response.status,200);const reply=await response.json();assert.equal(reply.messageId,id);assert.equal(reply.data?.done,true);assert.equal(reply.data?.status,'success');return reply.data.content;}
async function snapshot(name){assert.equal(await gui.getByText('显示现有本地安装；下载安装、模块变更和移除暂未接通。',{exact:true}).count(),1,'Snapshots only capture the installation page');fs.writeFileSync(path.join(run,name+'.aria.txt'),await gui.locator('body').ariaSnapshot());await page.screenshot({path:path.join(run,name+'.png'),fullPage:true,animations:'disabled'});}
try{
  assert.ok(fs.existsSync(runtime)&&fs.existsSync(path.join(core,'index.js')),'Actual maintained Node runtime and selected Core entry exist');
  const env={...process.env,GAMECOWORK_APP_ROOT:run,GAMECOWORK_CORE_DIR:runtimeCore,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_FRONTEND_DIR:frontend,
    GAMECOWORK_DATA_DIR:path.join(run,'data'),GAMECOWORK_USER_DATA_DIR:path.join(run,'data/core-state'),GAMECOWORK_EDITOR_AUDIT_ROOT:run,
    GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',NODE_OPTIONS:'--require '+JSON.stringify(guard)};
  for(const key of ['GAMECOWORK_AGENT_PATH','GAMECOWORK_CLI_PATH','GAMECOWORK_CLI_BASE_DIR','GAMECOWORK_HOME','GAMECOWORK_APP_HOME','GAMECOWORK_FIXTURE_HUB_SNAPSHOT'])delete env[key];
  shell=spawn(binary,[],{cwd:run,windowsHide:true,stdio:['ignore','pipe','pipe'],env});ownPids.add(shell.pid);
  const consume=chunk=>{shellLog+=chunk.toString();const match=shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//);if(match)origin=match[1];};shell.stdout.on('data',consume);shell.stderr.on('data',consume);
  await poll(()=>origin||shell.exitCode!==null,'isolated real Core host');assert.ok(origin,'Real Core host becomes ready');
  const startedFile=path.join(run,'core-started.jsonl');await poll(()=>fs.existsSync(startedFile),'actual guard-loaded main Core startup');
  const started=fs.readFileSync(startedFile,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));assert.equal(started.length,1);
  assert.equal(started[0].parentPid,shell.pid);assert.ok(Number.isInteger(started[0].pid)&&started[0].pid>0);assert.ok(samePath(started[0].entry,path.join(core,'index.js')));assert.ok(samePath(started[0].runtime,runtime));ownPids.add(started[0].pid);
  check('Dedicated guard is loaded in the exact owned packaged Node/Core before discovery',true);
  const catalog=await rpc('tjhub/getEditors');assert.ok(catalog&&typeof catalog==='object'&&!Array.isArray(catalog));editors=Object.values(catalog);
  const operations=fs.readFileSync(path.join(run,'guard-events.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
  check('Real Core personal-project registry and favorite-project reads are actually blocked',operations.some(record=>record.category==='personal-project-registry')&&operations.some(record=>record.category==='personal-project-read'));
  const counts={unity:editors.filter(editor=>editor.product==='unity').length,tuanjie:editors.filter(editor=>editor.product==='tuanjie').length};
  check('Actual Node/Core discovery and Rust adapter return Unity '+option('--expected-unity','8')+' and Tuanjie '+option('--expected-tuanjie','2'),counts.unity===+option('--expected-unity','8')&&counts.tuanjie===+option('--expected-tuanjie','2')&&editors.length===counts.unity+counts.tuanjie);
  const validated=[];
  for(const editor of editors){const pe=readEditorIdentity(editor.path);assert.equal(pe.engine,editor.product);assert.ok(typeof editor.version==='string'&&editor.version.length>0);assert.ok(Array.isArray(editor.location)&&editor.location.some(location=>samePath(location,editor.path)));assert.ok(samePath(editor.folderPath,path.dirname(editor.path)));assert.ok(Array.isArray(editor.modules)&&Array.isArray(editor.buildPlatformShortNames));assert.equal(editor.manual,true);validated.push({...safeEditor(editor),actualExecutableProduct:pe.engine,actualExecutableVersion:pe.version,coreVersionDiffersFromPE:editor.version!==pe.version});}
  check('Every actual Editor path exists with matching executable product and honest module/location arrays',validated.length===editors.length);
  const expectedMarketing={'2022.3.38t2':'1.3.2','2022.3.62t16':'1.10.4'};
  for(const [technical,marketing] of Object.entries(expectedMarketing)){const editor=editors.find(editor=>editor.product==='tuanjie'&&editor.version===technical);assert.ok(editor);assert.equal(editor.technicalVersion,technical);assert.equal(editor.unityVersion,technical);assert.equal(editor.marketingVersion,marketing);assert.equal(editor.tuanjieVersion,marketing);assert.equal(editor.displayVersion,marketing);assert.equal(editor.semver,marketing);}
  check('Actual public Tuanjie mapping supplies 1.3.2/1.10.4 while preserving both exact technical selection versions',true);
  fs.writeFileSync(path.join(run,'actual-editors.json'),JSON.stringify({counts,editors:validated},null,2));
  const {chromium}=await import(pathToFileURL(playwright()).href);context=await chromium.launchPersistentContext(path.join(run,'browser-profile'),{headless:true,executablePath:chrome(),viewport:{width:1440,height:960},locale:'zh-CN',colorScheme:'dark',serviceWorkers:'block',args:['--disable-background-networking','--disable-component-update','--no-first-run']});
  await context.route('**/*',route=>{const request=route.request(),target=new URL(request.url());if(target.hostname!=='127.0.0.1'&&!['data:','blob:'].includes(target.protocol)){external.push(target.origin);return route.abort('blockedbyclient');}
    if(target.pathname==='/api/tauri/invoke'){const call=callOf(request);if(call?.messageType==='tjhub/getRecentProjects'){blockedPersonalProjectRequests++;return route.fulfill({contentType:'application/json',body:JSON.stringify({messageId:call.messageId,messageType:call.messageType,data:{done:true,status:'error',error:'Editor-only audit omits personal Hub projects'}})});}}
    return route.continue();});
  if(previous)await context.route('**/gui.html*',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(frontend,'gui.html'),'utf8').replaceAll('index-BRxZ4eG7.js','index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js','store-0rGrUshb.js')}));
  await context.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.vscMediaUrl='';window.workspacePaths=[];localStorage.setItem('gamecowork-version-update-seen-features',JSON.stringify(['multi-workspace','remote-access','unity-streaming','remote-workspace','unity-window-streaming']));});
  page=context.pages()[0]||await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{const target=new URL(request.url());if(target.pathname.endsWith('.js'))resourceRequests.push(target.pathname);const call=callOf(request);if(call?.messageType)apiKinds.push(call.messageType);});
  page.on('response',async response=>{if(callOf(response.request())?.messageType!=='tjhub/getEditors')return;try{const reply=await response.json();editorResponses.push({messageId:reply.messageId,status:reply.data?.status,done:reply.data?.done,editors:Object.values(reply.data?.content||{}).map(safeEditor)});}catch{}});
  await page.goto(origin,{waitUntil:'domcontentloaded'});await poll(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'actual wrapper GUI');gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
  const next=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/});await next.first().waitFor({state:'visible',timeout:4000}).catch(()=>{});for(let step=0;step<4&&await next.count()&&await next.first().isVisible();step++)await next.first().click();
  await gui.evaluate(async previous=>{const {s:store}=await import(previous?'/assets/store-0rGrUshb.js':'/assets/store-c6kNGz30.js');store.dispatch({type:'hub/setTjhubInitialView',payload:'install'});},previous);
  await gui.getByRole('button',{name:'项目',exact:true}).click();
  const rows=gui.getByTestId('gamecowork-editor-row');await poll(async()=>await rows.count()===editors.length,'actual scanned ten-row installation UI');
  check('Unmodified real installed-editor callbacks populate all ten GUI rows',editorResponses.some(response=>response.status==='success'&&response.done===true&&response.editors.length===editors.length));
  const uiRows=await rows.evaluateAll(elements=>elements.map(element=>({product:element.dataset.editorProduct,path:element.dataset.editorPath,version:element.dataset.editorVersion,semver:element.dataset.editorSemver,text:element.textContent})));
  for(const editor of editors){const matches=uiRows.filter(row=>samePath(row.path,editor.path)&&row.product===editor.product);assert.equal(matches.length,1);assert.equal(matches[0].version,editor.version);assert.equal(matches[0].semver,editor.semver);assert.ok(matches[0].text.includes(editor.semver));}
  check('Actual GUI rows preserve each distinct executable, engine, Core version and displayed semver',true);await snapshot('01-actual-ten-editors');
  const presentation=[];
  for(const editor of editors){const candidates=await rows.all(),matched=[];for(const candidate of candidates)if(samePath(await candidate.getAttribute('data-editor-path'),editor.path))matched.push(candidate);assert.equal(matched.length,1);const selected=matched[0];
    const icon=selected.getByTestId('gamecowork-editor-icon');await poll(()=>icon.evaluate(image=>image.complete&&image.naturalWidth>0),'actual '+editor.product+' icon decoding');assert.equal(new URL(await icon.getAttribute('src'),origin).pathname,'/icons/'+editor.product+'.png');assert.equal(await icon.getAttribute('alt'),editor.product==='tuanjie'?'团结 编辑器':'Unity 编辑器');
    const primary=selected.getByTestId('gamecowork-editor-display-version');assert.equal(await primary.textContent(),editor.displayVersion);
    const info=await selected.evaluate(element=>{const icon=element.querySelector('[data-testid="gamecowork-editor-icon"]'),primary=element.querySelector('[data-testid="gamecowork-editor-display-version"]'),secondary=element.querySelector('[data-testid="gamecowork-editor-technical-version"]');return{src:icon.getAttribute('src'),alt:icon.getAttribute('alt'),width:icon.getBoundingClientRect().width,height:icon.getBoundingClientRect().height,naturalWidth:icon.naturalWidth,naturalHeight:icon.naturalHeight,primary:primary.textContent,primarySize:getComputedStyle(primary).fontSize,secondary:secondary?.textContent,secondaryTag:secondary?.tagName,secondarySize:secondary?getComputedStyle(secondary).fontSize:null};});
    assert.ok(info.width>0&&info.height>0);if(editor.product==='tuanjie'){assert.equal(info.secondary,'Unity '+editor.technicalVersion);assert.equal(info.secondaryTag,'SMALL');assert.ok(parseFloat(info.secondarySize)<parseFloat(info.primarySize));}else assert.equal(info.secondary,undefined);presentation.push({path:editor.path,product:editor.product,...info});}
  fs.writeFileSync(path.join(run,'actual-editor-presentation.json'),JSON.stringify(presentation,null,2));check('Actual decoded Unity/Tuanjie icons differ and Tuanjie uses primary marketing with smaller Unity technical version',true);
  check('Selected real frontend generation actually loads its GUI and Hub chunks',resourceRequests.includes(previous?'/assets/index-DvRYaIVa.js':'/assets/index-BRxZ4eG7.js')&&resourceRequests.includes(previous?'/assets/TJHubRoute-D42CgVct.js':'/assets/TJHubRoute-DN1YDDd-.js'));
  const selected=editors.find(editor=>editor.product==='tuanjie'&&editor.version==='2022.3.62t16')||editors.find(editor=>editor.product==='tuanjie');const selectedRow=rows.filter({has:gui.getByText(selected.semver,{exact:true})});assert.equal(await selectedRow.count(),1);
  await selectedRow.getByRole('button',{name:'管理',exact:true}).click();const reveal=gui.getByRole('menuitem',{name:'在资源管理器中显示',exact:true});await reveal.waitFor();const revealed=page.waitForResponse(response=>response.url().endsWith('/api/tauri/reveal-in-file-explorer'));await reveal.click();const revealResponse=await revealed;assert.ok(samePath(JSON.parse(revealResponse.request().postData()).path,selected.folderPath));assert.equal((await revealResponse.json()).ok,true);
  check('Actual discovered Editor menu dispatches that exact directory through host TEST_MODE',true);
  await gui.getByRole('button',{name:'搜索',exact:true}).click();const search=gui.getByPlaceholder('搜索',{exact:true});await search.fill(selected.semver);await poll(async()=>await rows.count()===editors.filter(editor=>editor.version.toLowerCase().includes(selected.semver.toLowerCase())||editor.semver.toLowerCase().includes(selected.semver.toLowerCase())).length,'actual catalog version search');
  check('Search selects actual catalog entries by preserved technical/display version',await rows.count()>0&&await rows.count()<editors.length);await search.fill('NO_INSTALLED_EDITOR_MATCH');await gui.getByText('没有结果',{exact:true}).waitFor();assert.equal(await rows.count(),0);await search.fill('');await poll(async()=>await rows.count()===editors.length,'clear restores full real catalog');
  check('No-result and clear restore the full real ten-row catalog without rewriting any Editor success response',true);await snapshot('02-actual-filter-restored');
  const unsafe=/^(?:acp\/(?:initSession|chat)|llm\/|tjhub\/(?:install|uninstall|removeEditor|createProject|openProject|addProject|addFromDisk|locateEditor|activate|login))/;
  check('Read-only installation audit issues no model session, Editor launch, install, mutation, activation or login',!apiKinds.some(type=>unsafe.test(type)));
  check('Installation renderer has no uncaught exceptions or external browser requests',errors.length===0&&external.length===0);
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;if(gui&&await gui.getByTestId('gamecowork-editors-local-boundary').count())await snapshot('failure').catch(()=>{});}
finally{
  try{await context?.close();}catch(error){cleanupErrors.push('browser: '+error.message);}
  try{const trace=path.join(run,'core-started.jsonl');if(fs.existsSync(trace))for(const line of fs.readFileSync(trace,'utf8').trim().split('\n').filter(Boolean)){const record=JSON.parse(line);assert.equal(record.parentPid,shell.pid);assert.ok(samePath(record.entry,path.join(core,'index.js')));ownPids.add(record.pid);}}catch(error){cleanupErrors.push('Core trace: '+error.message);}
  try{if(shell&&alive(shell.pid)){shell.kill();await poll(()=>!alive(shell.pid),'owned real Core host exit',10000);}await poll(()=>[...ownPids].every(pid=>!alive(pid)),'owned real Node/Core Job cleanup',10000);}catch(error){cleanupErrors.push('cleanup: '+error.message);}
  const ownPidsGone=cleanupErrors.length===0&&[...ownPids].every(pid=>!alive(pid));if(!ownPidsGone&&!failure){failure={message:'Owned process cleanup incomplete'};process.exitCode=1;}
  const guardOperations={};const trace=path.join(run,'guard-events.jsonl');if(fs.existsSync(trace))for(const line of fs.readFileSync(trace,'utf8').trim().split('\n').filter(Boolean)){const record=JSON.parse(line);const key=record.category+':'+record.operation;guardOperations[key]=(guardOperations[key]||0)+1;}
  const publicMetadataUnchanged=[...publicHashes].every(([file,hash])=>fs.existsSync(file)&&createHash('sha256').update(fs.readFileSync(file)).digest('hex')===hash);if(!publicMetadataUnchanged&&!failure){failure={message:'Public Hub Editor metadata changed during readonly audit'};process.exitCode=1;}
  fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify({run,packaged,previous,binary,core,coreEntry:path.join(core,'index.js'),coreRuntime:runtime,frontend,checks,failure,errors,external,editors:editors.map(safeEditor),editorResponses,apiKinds,resourceRequests,blockedPersonalProjectRequests,guardOperations,publicMetadataUnchanged,ownPids:[...ownPids],ownPidsGone,cleanupErrors,
    boundary:'Unmodified real Core public installed-editor discovery and GUI. Test-only read/write/process/network guard blocks personal project/registry discovery and all Node outgoing networking; GUI personal-project RPCs explicitly rejected. No Hub, Editor, CLI, model Provider, installer, or license operation runs; Explorer only checks native callback in TEST_MODE. Core directory/Hub version mapping remains distinct from independently read EXE ProductVersion.'},null,2));
  console.log(JSON.stringify({run,packaged,previous,passed:checks.length,editors:editors.length,unity:editors.filter(editor=>editor.product==='unity').length,tuanjie:editors.filter(editor=>editor.product==='tuanjie').length,failure:failure?.message,ownPidsGone,publicMetadataUnchanged}));
}
