// Real shipped GUI and Rust create an actual installed Editor template. The
// stdio fixture only enumerates that Editor; it explicitly refuses to fake launch.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('../../',import.meta.url));
const args=process.argv.slice(2); const option=(name,value)=>args.includes(name)?args[args.indexOf(name)+1]:value;
const temp=path.resolve(root,'../../temp/GameCowork');
const run=path.resolve(option('--output',path.join(temp,'project-templates-'+randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase()+path.sep));
const editor=path.resolve(option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe'));
const version=option('--version','2022.3.51f1c1');
const product=option('--product','unity');
const packaged=args.includes('--packaged');const app=path.join(root,'app');
const binary=path.resolve(option('--binary',path.join(root,packaged?'app/GameCowork.exe':'src/shell/target/debug/GameCowork.exe')));
const parent=path.join(run,'Created Projects');fs.mkdirSync(parent,{recursive:true});
const checks=[],errors=[],external=[],requests=[],responses=[];let shell,browser,page,gui,base,log='';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function poll(fn,label,timeout=30000){const end=Date.now()+timeout;while(!await fn()){if(Date.now()>end)throw Error('Timed out: '+label);await pause(80);}}
async function rpc(type,data={}){const res=await fetch(base+'/api/tauri/invoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messageType:type,messageId:randomUUID(),data})});assert.equal(res.status,200);return(await res.json()).data;}
function playwright(){const require=createRequire(import.meta.url);try{return require.resolve('playwright');}catch{}const cache=path.join(process.env.LOCALAPPDATA,'npm-cache/_npx');return fs.readdirSync(cache).map(name=>path.join(cache,name,'node_modules/playwright/index.mjs')).filter(p=>fs.existsSync(p))[0];}
function chrome(){const cache=path.join(process.env.LOCALAPPDATA,'ms-playwright');const names=fs.readdirSync(cache).filter(n=>/^chromium-\d+$/.test(n)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]));for(const n of names)for(const p of ['chrome-win64/chrome.exe','chrome-win/chrome.exe']){const candidate=path.join(cache,n,p);if(fs.existsSync(candidate))return candidate;}}
const snapshot=async label=>{fs.writeFileSync(path.join(run,label+'.aria.txt'),await gui.locator('body').ariaSnapshot());await page.screenshot({path:path.join(run,label+'.png'),fullPage:true});};
try {
 shell=spawn(binary,[],{cwd:run,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,
   GAMECOWORK_APP_ROOT:run,GAMECOWORK_CORE_DIR:path.join(root,'tests'),GAMECOWORK_CORE_ENTRY:path.join(root,'tests/fixtures/core-fixture.mjs'),
   GAMECOWORK_FRONTEND_DIR:path.join(root,packaged?'app/frontend':'src/frontend/bundle'),GAMECOWORK_DATA_DIR:path.join(run,'app-data'),GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',
   GAMECOWORK_PICK_FOLDER:parent,GAMECOWORK_FIXTURE_DATA_DIR:run,GAMECOWORK_FIXTURE_LOG:path.join(run,'core-frames.jsonl'),
   GAMECOWORK_FIXTURE_TEMPLATE_EDITOR:editor,GAMECOWORK_FIXTURE_TEMPLATE_VERSION:version,GAMECOWORK_FIXTURE_TEMPLATE_PRODUCT:product,GAMECOWORK_FIXTURE_HUB_DELAY_MS:args.includes('--slow-hub-cancel')?'2000':'0'}});
 const consume=b=>{log+=b.toString();const m=log.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//);if(m)base=m[1];};shell.stdout.on('data',consume);shell.stderr.on('data',consume);
 await poll(()=>base,'own Rust host');
 const list=await rpc('tjhub/getTemplates',{version,architecture:'x86_64',editorPath:editor,product});
 assert.equal(list.status,'success',JSON.stringify(list));assert.equal(list.content.supported,true);assert.ok(list.content.templates.length>=2);
 const actual=list.content.templates.find(t=>t.name.endsWith('.template.3d'));assert.ok(actual);assert.equal(actual.status,'READY');checks.push('Native catalog reads actual installed Editor archives with real metadata and SHA');
 const {chromium}=await import(pathToFileURL(playwright()).href);
 browser=await chromium.launchPersistentContext(path.join(run,'browser'),{headless:true,executablePath:chrome(),viewport:{width:1440,height:960},locale:'zh-CN',colorScheme:'dark',serviceWorkers:'block',args:['--disable-background-networking','--disable-component-update','--no-first-run']});
 await browser.route('**/*',route=>{const u=new URL(route.request().url());if(['127.0.0.1','localhost'].includes(u.hostname)||['data:','blob:'].includes(u.protocol))return route.continue();external.push(u.origin);return route.abort('blockedbyclient');});
 await browser.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.vscMediaUrl='';window.workspacePaths=[];localStorage.setItem('gamecowork-version-update-seen-features',JSON.stringify(['multi-workspace','remote-access','unity-streaming','remote-workspace','unity-window-streaming']));});
 page=browser.pages()[0];page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(r.url().endsWith('/api/tauri/invoke')){try{const body=JSON.parse(r.postData());requests.push(body.message||body);}catch{}}});
 page.on('response',async r=>{if(r.url().endsWith('/api/tauri/invoke'))try{responses.push(await r.json());}catch{}});
 await page.goto(base,{waitUntil:'domcontentloaded'});await poll(()=>page.frames().some(f=>f.url().includes('/gui.html')),'real GUI');gui=page.frames().find(f=>f.url().includes('/gui.html'));
 const intro=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/});await intro.first().waitFor({state:'visible',timeout:4000}).catch(()=>{});
 for(let step=0;step<4&&await intro.count()&&await intro.first().isVisible();step++){await intro.first().click();await pause(100);}
 await gui.getByText('项目',{exact:true}).first().click();await gui.getByRole('button',{name:/新项目/}).click();
 await gui.getByText('3D',{exact:true}).first().waitFor({timeout:30000});await gui.getByText('3D',{exact:true}).first().click();
 await gui.getByRole('textbox').last().fill('Template 中文 Project');
 await gui.getByRole('button',{name:/app-data.*Projects/}).click();
 await poll(()=>gui.getByRole('button',{name:parent}).isVisible().catch(()=>false),'selected parent');
 assert.equal(await gui.getByText('启用在线服务',{exact:true}).count(),0);await snapshot('01-ready-template');checks.push('Real New Project UI selects exact installed Editor identity, template, Unicode name and disk parent');
 await gui.getByRole('button',{name:'创建项目',exact:true}).click();
 const target=path.join(parent,'Template 中文 Project');await poll(()=>fs.existsSync(path.join(target,'ProjectSettings/ProjectVersion.txt')),'actual created files');
 await poll(()=>requests.some(r=>r.messageType==='tjhub/createProject'),'native create request');
 const call=requests.find(r=>r.messageType==='tjhub/createProject');assert.equal(path.resolve(call.data.editorPath),editor);assert.equal(call.data.product,product);assert.equal(call.data.archiveSha256,actual.archiveSha256);assert.ok(call.data.creationId);
 await poll(()=>responses.some(r=>r.messageId===call.messageId&&r.data?.done),'actual terminal creation response');
 const completed=responses.find(r=>r.messageId===call.messageId&&r.data?.done);assert.equal(completed.data.status,'success',JSON.stringify(completed));assert.equal(completed.data.content.created,true);
 const templateDir=path.join(path.dirname(editor),'Data/Resources/PackageManager/ProjectTemplates');
 const archive=path.join(templateDir,fs.readdirSync(templateDir).find(name=>name.startsWith(actual.name+'-')&&name.endsWith('.tgz')));
 const sceneRelative='Assets/Scenes/SampleScene.'+(product==='tuanjie'?'scene':'unity');
 const expected=execFileSync(path.join(process.env.SystemRoot,'System32/tar.exe'),['-xOf',archive,'package/ProjectData~/'+sceneRelative],{windowsHide:true,maxBuffer:8*1024*1024});
 const scene=fs.readFileSync(path.join(target,sceneRelative));assert.equal(createHash('sha256').update(scene).digest('hex'),createHash('sha256').update(expected).digest('hex'));
 assert.equal(fs.readFileSync(path.join(target,'ProjectSettings/ProjectVersion.txt'),'utf8'),'m_EditorVersion: '+version+'\n'+(product==='tuanjie'?'m_TuanjieEditorVersion: '+version+'\n':''));assert.ok(JSON.parse(fs.readFileSync(path.join(target,'Packages/manifest.json'))).dependencies);assert.equal(fs.existsSync(path.join(target,'Library')),false);
 checks.push('Actual Scene bytes equal the installed template; manifest and selected ProjectVersion exist without copied generated Library');
 await poll(async()=>{const recent=await rpc('tjhub/getRecentProjects');return recent.content.some(p=>path.resolve(p.path)===target);},'actual local project registration');checks.push('Actual creation registers the real project locally without pretending Editor launch succeeded');
 await snapshot('02-created-project');
 const duplicate=await rpc('tjhub/createProject',{...call.data,creationId:randomUUID()});assert.equal(duplicate.status,'error');assert.equal(duplicate.error,'PROJECT_EXISTS');assert.deepEqual(fs.readFileSync(path.join(target,sceneRelative)),scene);checks.push('Duplicate creation preserves the existing actual project and fails explicitly');
 const bad=await rpc('tjhub/createProject',{...call.data,creationId:randomUUID(),projectName:'../escape'});assert.equal(bad.status,'error');assert.equal(fs.existsSync(path.join(run,'escape')),false);checks.push('Unsafe project names cannot escape the selected parent');
 const cloud=await rpc('tjhub/createProject',{...call.data,creationId:randomUUID(),projectName:'Cloud Must Not Exist',uosEnabled:true});assert.equal(cloud.status,'error');assert.equal(fs.existsSync(path.join(parent,'Cloud Must Not Exist')),false);checks.push('Unconfigured cloud requests are rejected before filesystem creation');
 // Real UI unmount must send the matching cancellation while native extraction
 // is still pending, rather than opening a late-created project after Back.
 await gui.getByText('项目',{exact:true}).first().click();await gui.getByRole('button',{name:/新项目/}).click();
 await gui.getByText('3D',{exact:true}).first().waitFor();await gui.getByText('3D',{exact:true}).first().click();
 await gui.getByRole('textbox').last().fill('Cancelled Project');
 await gui.getByRole('button',{name:/app-data.*Projects/}).click();await poll(()=>gui.getByRole('button',{name:parent}).isVisible().catch(()=>false),'cancel parent');
 await gui.getByRole('button',{name:'创建项目',exact:true}).click();
 await poll(()=>requests.filter(r=>r.messageType==='tjhub/createProject').length>=2,'second actual create');
 await gui.getByText('新项目',{exact:true}).first().click();
 await poll(()=>requests.some(r=>r.messageType==='tjhub/cancelCreateProject'),'real UI cancellation');
 const cancelCall=requests.find(r=>r.messageType==='tjhub/cancelCreateProject');assert.equal(cancelCall.data.creationId,requests.filter(r=>r.messageType==='tjhub/createProject').at(-1).data.creationId);
 await pause(1500);assert.equal(fs.existsSync(path.join(parent,'Cancelled Project')),false);assert.equal(fs.readdirSync(parent).some(n=>n.startsWith('.gamecowork-create-')),false);
 await snapshot('03-cancelled-project');checks.push('Back from creating UI cancels the owning real extraction, cleans staging and never opens a late project');
 if(args.includes('--slow-hub-cancel')){
   console.log('Waiting for the actual 60-second Hub cache expiry before delayed discovery cancellation');
   await pause(61000);
   const creationId=randomUUID();const creating=rpc('tjhub/createProject',{...call.data,creationId,projectName:'Cancelled During Hub'});
   await pause(100);const cancellation=await rpc('tjhub/cancelCreateProject',{creationId});assert.equal(cancellation.content.cancelRequested,true);
   const outcome=await creating;assert.equal(outcome.status,'error');assert.equal(outcome.error,'PROJECT_CREATION_CANCELLED');
   assert.equal(fs.existsSync(path.join(parent,'Cancelled During Hub')),false);checks.push('Cancellation during actual delayed Hub discovery prevents late directory creation');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);checks.push('No browser errors or external request attempts');
 console.log(JSON.stringify({status:'passed',checks,run,binary,editor,target,packaged,external,errors},null,2));
} catch(error){await snapshot('failure').catch(()=>{});console.error(error);process.exitCode=1;}
finally{if(browser)await browser.close();if(shell?.exitCode===null){shell.kill();await poll(()=>shell.exitCode!==null||shell.signalCode!==null,'own host exit',10000).catch(()=>{});}fs.writeFileSync(path.join(run,'shell.log'),log);fs.writeFileSync(path.join(run,'result.json'),JSON.stringify({checks,errors,external,requests,responses,binary,editor,run,packaged},null,2));}
