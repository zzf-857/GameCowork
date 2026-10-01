// Actual maintained GUI -> Rust host -> recovered local SQLite worker. No model,
// fake index, remote embedding, existing Unity project, or original CLI runs.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { randomUUID, createHash } from 'node:crypto';
import { createInsightFixture } from './insight-fixture.mjs';
const project=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2),option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const packaged=args.includes('--packaged'),app=path.join(project,'app');
const base=path.resolve(project,'../../temp/GameCowork');
const run=path.resolve(option('--output',path.join(base,'insight-e2e-'+randomUUID())));
assert.ok(run.toLowerCase().startsWith(base.toLowerCase()+path.sep));
const binary=path.resolve(option('--binary',packaged?path.join(app,'GameCowork.exe'):path.join(project,'restored/shell/target/release/GameCowork.exe')));
const core=path.join(project,packaged?'app/core':'restored/core-gamecowork-binary/binary/out');
const frontend=path.join(project,packaged?'app/frontend':'restored/frontend/dist-beautified');
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const agentPackage=path.resolve(option('--package',path.join(base,'cli-guarded-20261001-12')));
const agent=path.join(agentPackage,'gamecowork.exe');
const agentManifest=JSON.parse(fs.readFileSync(path.join(agentPackage,'cli-package-manifest.json')));
assert.equal(agentManifest.testGuardIncluded,true);
assert.equal(agentManifest.sourceSha256.toLowerCase(),createHash('sha256').update(fs.readFileSync(path.join(project,'restored/cli-gamecowork/cli-main.beautified.js'))).digest('hex'));
if(packaged){
 const normal=JSON.parse(fs.readFileSync(path.join(app,'cli/cli-package-manifest.json')));assert.equal(normal.testGuardIncluded,false);assert.equal(normal.sourceSha256.toLowerCase(),agentManifest.sourceSha256.toLowerCase());assert.equal(normal.executableSha256.toLowerCase(),hash(path.join(app,'cli/gamecowork.exe')));
 const source=path.join(project,'restored/cli-unity-insight');
 for(const name of['package.json','bundle','resources']){
  const visit=relative=>{const current=path.join(source,relative);if(fs.statSync(current).isDirectory())for(const child of fs.readdirSync(current))visit(path.join(relative,child));else assert.equal(hash(path.join(app,'unity-insight',relative)),hash(current),'Assembled index resource must match source: '+relative);};visit(name);
 }
}
fs.mkdirSync(run,{recursive:true});
const fixture=createInsightFixture(path.join(run,'Project A'));
const other=createInsightFixture(path.join(run,'Project B'),'GCW_INSIGHT_B_ONLY');
const closed=createInsightFixture(path.join(run,'Unopened Project'),'GCW_INSIGHT_NOT_AUTHORIZED');
const checks=[],browserErrors=[],blocked=[],observed=[],workerPids=new Set(),shellPids=[];
let shell,context,page,gui,origin=option('--url'),workspaceKey,workspaceB,shellLog='',failure;
const check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(name+': PASS');};
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function poll(fn,name,timeout=15000){const end=Date.now()+timeout;while(!await fn()){assert.ok(Date.now()<end,'Timed out: '+name);await delay(100);}}
function cleanEnv(){const env={...process.env};for(const key of Object.keys(env))if(/^(GAMECOWORK_|CODELY_|UNITY_INSIGHT_|OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];return env;}
async function launch(){
 const env={...cleanEnv(),GAMECOWORK_APP_ROOT:packaged?app:run,GAMECOWORK_DATA_DIR:path.join(run,'data'),GAMECOWORK_FRONTEND_DIR:frontend,GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_AGENT_PATH:agent,GAMECOWORK_AGENT_RESOURCE_DIR:path.join(agentPackage,'resources'),GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_PICK_FOLDER:fixture.root,GAMECOWORK_CHAT_ROOT:run,GAMECOWORK_CHAT_CORE:packaged?core:path.dirname(path.dirname(core)),GAMECOWORK_CHAT_AGENT:agent,GAMECOWORK_CLI_PROBE_ROOT:run,GAMECOWORK_CLI_PROBE_SOURCE:agentPackage,BUN_RUNTIME_TRANSPILER_CACHE_PATH:path.join(run,'bun-cache'),NODE_OPTIONS:'--require '+JSON.stringify(path.join(project,'tests/chat-core-guard.cjs'))};
 shell=spawn(binary,[],{cwd:run,env,windowsHide:true,stdio:['ignore','pipe','pipe']});shellPids.push(shell.pid);
 return new Promise((resolve,reject)=>{let log='';const timer=setTimeout(()=>reject(Error('Host startup timeout')),45000);const data=bytes=>{log+=bytes.toString();shellLog+=bytes.toString();const match=log.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match){clearTimeout(timer);resolve(match[1]);}};shell.stdout.on('data',data);shell.stderr.on('data',data);shell.once('exit',code=>{clearTimeout(timer);reject(Error('Host exited '+code));});shell.once('error',reject);});
}
async function stopShell(){if(!shell||shell.exitCode!==null)return;const done=new Promise(resolve=>shell.once('exit',resolve));shell.kill();await done;}
async function http(route,body){const response=await fetch(new URL(route,origin),{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(35000)});const value=await response.json();if(value.pid)workerPids.add(value.pid);return {status:response.status,ok:response.ok,value};}
async function insight(operation,data={},key=workspaceKey){return http('/api/tauri/unity-insight/'+operation,{...data,workspaceKey:key});}
function playwright(){try{return createRequire(import.meta.url).resolve('playwright');}catch{}const cache=path.join(process.env.LOCALAPPDATA,'npm-cache/_npx');const candidates=fs.readdirSync(cache).map(name=>path.join(cache,name,'node_modules/playwright/index.mjs')).filter(fs.existsSync);assert.ok(candidates.length);return candidates[0];}
function chrome(){const cache=path.join(process.env.LOCALAPPDATA,'ms-playwright');for(const name of fs.readdirSync(cache).filter(name=>/^chromium-\d+$/.test(name)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]))){const file=path.join(cache,name,'chrome-win64/chrome.exe');if(fs.existsSync(file))return file;}}
async function snapshot(name){fs.writeFileSync(path.join(run,name+'.aria.txt'),await gui.locator('body').ariaSnapshot());await page.screenshot({path:path.join(run,name+'.png'),fullPage:true,animations:'disabled'});}
async function insightMenuDiagnostics(name){
 const dom=await gui.evaluate(()=>({focusTrace:window.__insightFocusTrace,portal:document.getElementById('headlessui-portal-root')?.outerHTML,menus:[...document.querySelectorAll('[role="menu"], [role="menuitem"]')].map(element=>({role:element.getAttribute('role'),text:element.textContent,hidden:element.getAttribute('aria-hidden'),rect:{width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height},ancestors:[...(()=>{const result=[];for(let current=element;current;current=current.parentElement)if(current.getAttribute('aria-hidden')||current.hasAttribute('inert'))result.push({tag:current.tagName,hidden:current.getAttribute('aria-hidden'),inert:current.hasAttribute('inert')});return result;})()]})),triggers:[...document.querySelectorAll('[data-telemetry-id="right_sidebar_extension_menu"]')].map(element=>({text:element.textContent,html:element.outerHTML,rect:{width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height}}))}));
 fs.writeFileSync(path.join(run,name+'-dom.json'),JSON.stringify(dom,null,2));
}
async function openInsightPreview(name='initial'){
 await gui.locator('[data-telemetry-id="toggle_right_sidebar"]').first().click();
 const trigger=gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]');await trigger.waitFor({state:'visible'});
 await trigger.click();
 const item=gui.getByRole('menuitem',{name:'Insight',exact:true});
 try { await item.waitFor({state:'visible'}); }
 catch(error){await insightMenuDiagnostics('menu-'+name+'-after-timeout');throw error;}
 if(name==='initial'){
  const trace=await gui.evaluate(()=>window.__insightFocusTrace||[]),back=[...trace].reverse().find(event=>event.event==='click'&&event.telemetry==='settings_back'),chosen=back&&trace.find(event=>event.event==='focus'&&event.telemetry==='toggle_right_sidebar'&&event.time>back.time);
  assert.ok(chosen,'The real Settings Back flow must choose the sidebar control');
  assert.equal(trace.some(event=>event.event==='focus'&&event.editable==='true'&&event.time>chosen.time),false,'An old Settings focus must not steal focus after choosing the sidebar');
 }
 await insightMenuDiagnostics('menu-'+name+'-opened');
 await snapshot('insight-preview-menu');await item.click();
}
async function startBrowser(profile){
 const {chromium}=await import(pathToFileURL(playwright()).href);context=await chromium.launchPersistentContext(path.join(run,profile),{headless:true,executablePath:chrome(),locale:'zh-CN',colorScheme:'dark',viewport:{width:1440,height:960},serviceWorkers:'block',args:['--disable-background-networking','--disable-component-update','--no-first-run']});
 context.setDefaultTimeout(10000);
 await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1'||['blob:','data:'].includes(url.protocol))return route.continue();blocked.push(url.origin);return route.abort('blockedbyclient');});
 await context.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.workspacePaths=[];window.vscMediaUrl='';});page=context.pages()[0]||await context.newPage();page.on('pageerror',error=>browserErrors.push(error.stack||String(error)));
 page.on('response',async response=>{if(response.url().includes('/api/tauri/unity-insight/'))try{const result=await response.json();observed.push({operation:new URL(response.url()).pathname.split('/').pop(),status:response.status(),request:response.request().postDataJSON(),result});if(result.pid)workerPids.add(result.pid);}catch{}});
 await page.goto(origin,{waitUntil:'domcontentloaded'});await poll(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'GUI iframe');gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
 await gui.evaluate(()=>{window.__insightFocusTrace=[];const record=value=>{window.__insightFocusTrace.push({time:performance.now(),...value});if(window.__insightFocusTrace.length>40)window.__insightFocusTrace.shift();};document.addEventListener('focusin',event=>record({event:'focus',tag:event.target.tagName,telemetry:event.target.getAttribute('data-telemetry-id'),editable:event.target.getAttribute('contenteditable')}));document.addEventListener('click',event=>record({event:'click',tag:event.target.tagName,telemetry:event.target.closest('[data-telemetry-id]')?.getAttribute('data-telemetry-id')}));window.addEventListener('message',event=>{if(event.data?.messageType==='focusContinueInputWithoutClear')record({event:'deferred-chat-focus'});});});
 const next=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/});await next.first().waitFor({state:'visible',timeout:2500}).catch(()=>{});for(let i=0;i<4&&await next.count()&&await next.first().isVisible();i++)await next.first().click();
 await snapshot('gui-'+profile);
}
async function openUI(root){await context.route(/\/api\/tauri\/pick-folder(?:-modal)?$/,route=>route.fulfill({contentType:'application/json',body:JSON.stringify({path:root,cancelled:false})}),{times:1});await gui.getByRole('button',{name:/^(打开工作区|Open Workspace)$/}).last().click();await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();await poll(async()=>{const state=(await http('/api/tauri/hub/workspaces')).value;return state.workspaces.some(w=>path.resolve(w.workspaceDir)===root);},'UI opened fixture');}
function networkAttempts(){const result=[...blocked.map(host=>({owner:'browser',host}))];for(const [owner,file]of[['core',path.join(run,'core-guard-events.jsonl')],['agent',path.join(run,'guard-events.jsonl')],['insight',path.join(run,'data/insight/guard-events.jsonl')]])if(fs.existsSync(file))for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean)){const value=JSON.parse(line);if(/^(external|fetch$|node:http|node:https|net\.)/.test(value.operation||''))result.push({owner,...value});}return result;}
try{
 if(!origin)origin=await launch();assert.equal(new URL(origin).hostname,'127.0.0.1');
 await startBrowser('profile-initial');await openUI(fixture.root);let state=(await http('/api/tauri/hub/workspaces')).value;workspaceKey=state.workspaces.find(w=>path.resolve(w.workspaceDir)===fixture.root)?.workspaceKey;check('Actual GUI opens authorized Unity fixture',!!workspaceKey);
 const cold=await insight('index-status');check('Unbuilt actual index reports idle without fabricated progress',cold.ok&&cold.value.status==='idle'&&cold.value.percent===0&&cold.value.indexedAt===null);
 const denied=await http('/api/tauri/unity-insight/ensure-index',{workspaceDir:closed.root});check('Unopened project cannot start an index worker',denied.status>=400);
 const started=await insight('ensure-index');check('HTTP schedules actual recovered worker build',started.ok&&started.value.indexBuilding===true&&started.value.pid>0);
 let ready;await poll(async()=>{ready=await insight('index-status');if(ready.value.status==='error')throw Error(ready.value.error);return ready.value.status==='ready';},'real SQLite publication',30000);check('HTTP reports ready only after real SQLite publication',ready.value.indexReady===true&&ready.value.percent===100&&typeof ready.value.indexedAt==='string');
 const content=await insight('vfs-search',{query:'GCW_INSIGHT',limit:100});check('HTTP searches real CSharp ShaderLab and Unity YAML rows',content.ok&&['Assets/Player.cs','Assets/Fixture.shader','Assets/Greeting.prefab'].every(name=>content.value.results.some(row=>row.path.startsWith(name))));
 const entry=await insight('vfs-entry',{vfsPath:fixture.method});check('HTTP returns actual parsed CSharp method content',entry.ok&&entry.value.entry.content.includes('Helper.Compute(n)'));
 const refs=await insight('vfs-refs',{vfsPath:'Assets/Default.mat',direction:'out',limit:100});check('HTTP resolves real material GUID to shader',refs.ok&&refs.value.entries.some(row=>row.path==='Assets/Fixture.shader'));
 fs.writeFileSync(fixture.code,fs.readFileSync(fixture.code,'utf8').replace(fixture.marker,'GCW_INSIGHT_UPDATED'));await poll(async()=>{const reply=await insight('vfs-search',{query:'GCW_INSIGHT_UPDATED'});return reply.value.results?.some(row=>row.lineText.includes('GCW_INSIGHT_UPDATED'));},'actual watch source synchronization');check('HTTP native watcher updates actual source bytes',true);
 const b=await http('/api/tauri/hub/open-workspace',{path:other.root});workspaceB=b.value.workspaceKey;await insight('ensure-index',{},workspaceB);await poll(async()=>(await insight('index-status',{},workspaceB)).value.status==='ready','B actual index');const [aRows,bRows]=await Promise.all([insight('vfs-search',{query:'GCW_INSIGHT_B_ONLY'}),insight('vfs-search',{query:'GCW_INSIGHT_B_ONLY'},workspaceB)]);check('Two live workers keep project contents isolated',aRows.value.results.length===0&&bRows.value.results.length>0);
 await http('/api/tauri/hub/switch-workspace',{workspaceKey});
 await gui.locator('[data-telemetry-id="open_settings"]').first().click();await snapshot('settings-navigation');
 await gui.locator('[data-telemetry-id="settings_nav_insightIndex"]').click();await poll(async()=>(await gui.locator('body').innerText()).includes('Project A'),'Insight project row');await snapshot('insight-settings');
 check('Actual Insight settings displays indexed fixture projects',(await gui.locator('body').innerText()).includes('Project A'));
 const row=gui.getByText('Project A',{exact:true}).locator('xpath=ancestor::div[contains(@class,"grid-cols")][1]');
 const forceBefore=observed.length;await row.getByRole('button').click();await poll(()=>observed.slice(forceBefore).some(record=>record.operation==='ensure-index'&&record.request.force===true&&record.status===200),'UI force rebuild request');
 await poll(async()=>(await insight('index-status')).value.status==='ready','UI rebuild SQLite publication');check('Actual UI rebuild button schedules and publishes real index',true);
 await row.getByRole('switch').click();await poll(async()=>(await insight('get-enabled')).value.enabled===false,'UI disabled actual worker');
 const disabled=await insight('vfs-search',{query:'GCW_INSIGHT'});check('Actual UI disabling stops worker and rejects searches',disabled.status===409);
 await row.getByRole('switch').click();await poll(async()=>(await insight('get-enabled')).value.enabled===true,'UI reenabled actual index');
 const retained=await insight('vfs-search',{query:'GCW_INSIGHT_UPDATED'});check('Actual UI enabling reopens persisted source bytes',retained.value.results.some(result=>result.path.startsWith('Assets/Player.cs')));
 await snapshot('insight-toggle-rebuild');
 await gui.locator('[data-telemetry-id="settings_back"]').click();
 await openInsightPreview();await gui.locator('[data-panel="unity-insight"]').waitFor({state:'visible'});await snapshot('insight-preview');
 const panel=gui.locator('[data-panel="unity-insight"]');await panel.getByRole('button',{name:'Assets',exact:true}).click();await panel.getByRole('button',{name:'Default.mat',exact:true}).click();
 await poll(async()=>(await panel.innerText()).includes('GCW_INSIGHT_MATERIAL'),'GUI actual indexed material content');check('Actual Insight GUI displays real indexed Unity YAML content',true);await snapshot('insight-material');
 const referencesToggle=panel.getByRole('button',{name:/查看引用|View references/});if(await referencesToggle.getAttribute('aria-expanded')!=='true')await referencesToggle.click();await panel.getByRole('tab',{name:/依赖项|依赖|Dependencies/}).last().click();
 await panel.locator('.tauri-unity-insight-view-reference__list [title="Assets/Fixture.shader"]').waitFor({state:'visible'});check('Actual GUI references list shows resolved real shader GUID dependency',observed.some(record=>record.operation==='vfs-refs'&&record.request.vfsPath==='Assets/Default.mat'&&record.request.direction==='out'&&record.result.entries.some(entry=>entry.path==='Assets/Fixture.shader')));await snapshot('insight-references');
 const oldPublication=await insight('index-status');assert.ok(oldPublication.value.publishedIndexPath,'Actual worker publication identity reaches HTTP status');assert.equal(oldPublication.value.protocolVersion,4);assert.ok(oldPublication.value.schemaVersion!=null);
 const materialFile=path.join(fixture.root,'Assets/Default.mat');fs.writeFileSync(materialFile,fs.readFileSync(materialFile,'utf8').replace('GCW_INSIGHT_MATERIAL','GCW_INSIGHT_REPUBLISHED'));
 const refreshFrom=observed.length;await insight('ensure-index',{force:true});let newPublication;
 await poll(async()=>{newPublication=await insight('index-status');return newPublication.value.status==='ready'&&newPublication.value.publishedIndexPath&&newPublication.value.publishedIndexPath!==oldPublication.value.publishedIndexPath;},'Actual worker publishes a distinct rebuilt SQLite generation');
 await poll(async()=>(await panel.innerText()).includes('GCW_INSIGHT_REPUBLISHED'),'Already-open VFS entry refreshes its content on actual published generation change');
 check('Published generation invalidates the actual GUI VFS cache without closing its entry',observed.slice(refreshFrom).some(record=>record.operation==='vfs-entry'&&record.request.vfsPath==='Assets/Default.mat'&&record.result.entry?.content?.includes('GCW_INSIGHT_REPUBLISHED')));
 fs.writeFileSync(path.join(run,'generation-cache-evidence.json'),JSON.stringify({old:oldPublication.value,new:newPublication.value,entryStayedOpen:true,refreshRequests:observed.slice(refreshFrom).filter(record=>record.operation==='vfs-entry')},null,2));await snapshot('insight-generation-refreshed');
 await panel.locator('.tauri-file-preview-panel__toolbar button').nth(1).click();await panel.locator('.file-preview-inputbox__input').fill('GCW_INSIGHT_UPDATED');
 await poll(()=>observed.some(record=>record.operation==='vfs-search'&&record.request.query==='GCW_INSIGHT_UPDATED'&&record.result.results?.some(row=>row.lineText.includes('GCW_INSIGHT_UPDATED'))),'GUI content search actual source rows');await snapshot('insight-content-search');
 check('Actual GUI content search renders updated indexed code',(await panel.innerText()).includes('GCW_INSIGHT_UPDATED'));
 const liveStatus=await insight('index-status');const oldPid=liveStatus.value.pid;
 await http('/api/tauri/hub/close-workspace',{workspaceKey});await poll(()=>{try{process.kill(oldPid,0);return false;}catch{return true;}},'closed A releases real worker');
 const afterClose=await insight('vfs-search',{query:'GCW_INSIGHT_UPDATED'});check('Closing workspace releases real worker and rejects old scope',afterClose.status>=400&&fs.readFileSync(fixture.code,'utf8').includes('GCW_INSIGHT_UPDATED'));
 const reopened=await http('/api/tauri/hub/open-workspace',{path:fixture.root});workspaceKey=reopened.value.workspaceKey;const republished=await insight('vfs-search',{query:'GCW_INSIGHT_UPDATED'});check('Reopening workspace uses a new worker and existing real index',republished.value.results.some(row=>row.path.startsWith('Assets/Player.cs')));
 await insight('set-enabled',{enabled:false},workspaceB);
 if(!option('--url')){
  await context.close();context=null;gui=null;await stopShell();origin=await launch();await startBrowser('profile-restarted');
  const registry=(await http('/api/tauri/hub/workspaces')).value;workspaceKey=registry.workspaces.find(w=>path.resolve(w.workspaceDir)===fixture.root)?.workspaceKey;workspaceB=registry.workspaces.find(w=>path.resolve(w.workspaceDir)===other.root)?.workspaceKey;
  const [restoredA,restoredB]=await Promise.all([insight('vfs-search',{query:'GCW_INSIGHT_UPDATED'}),insight('get-enabled',{},workspaceB)]);
  check('New host and browser reopen published actual index and persisted switch',restoredA.value.results.some(row=>row.path.startsWith('Assets/Player.cs'))&&restoredB.value.enabled===false);
  await openInsightPreview('restarted');const restarted=gui.locator('[data-panel="unity-insight"]');await restarted.getByRole('button',{name:'Assets',exact:true}).click();await restarted.getByRole('button',{name:'Player.cs',exact:true}).click();await poll(async()=>(await restarted.innerText()).includes('GCW_INSIGHT_UPDATED'),'new GUI actual persisted code');check('Fresh GUI displays actual persisted CSharp content after full restart',true);await snapshot('insight-restarted');
 }
 check('Local index UI needs no account or model authentication',(await gui.getByText(/Authentication required/,{exact:false}).count())===0&&browserErrors.length===0);
 // The UI interaction portion below is deliberately strict: inspect actual DOM
 // and real requests; never substitute direct HTTP for a failed button flow.
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;}
finally{
 if(option('--url')&&origin)for(const key of[workspaceKey,workspaceB].filter(Boolean))await http('/api/tauri/hub/close-workspace',{workspaceKey:key}).catch(()=>{});
 if(gui)await snapshot('final').catch(()=>{});if(context)await context.close();await stopShell();
 const attempts=networkAttempts();if(attempts.length&&!failure){failure={message:'Unexpected external network attempts'};process.exitCode=1;}
 const gone=()=>[...workerPids,...shellPids].every(pid=>{try{process.kill(pid,0);return false;}catch{return true;}});
 for(let i=0;i<50&&!gone();i++)await delay(100);const ownPidsGone=gone();
 if(!ownPidsGone&&!failure){failure={message:'Owned process cleanup incomplete'};process.exitCode=1;}
 fs.writeFileSync(path.join(run,'shell.txt'),shellLog);fs.writeFileSync(path.join(run,'http-observed.json'),JSON.stringify(observed,null,2));fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify({run,packaged,binary,core,frontend,checks,failure,browserErrors,networkAttempts:attempts,ownPidsGone,workerPids:[...workerPids],shellPids},null,2));console.log(JSON.stringify({run,packaged,passed:checks.filter(c=>c.passed).length,total:checks.length,failure:failure?.message,networkAttempts:attempts.length,ownPidsGone}));
}
