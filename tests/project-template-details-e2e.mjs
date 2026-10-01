// Real Rust catalog -> original main GUI -> both template detail tabs. The Core
// fixture only enumerates the selected real installed Editor, never launches it.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readEditorIdentity} from './editor-engine-fixture.mjs';

const repo=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2);
const option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const temp=path.resolve(repo,'../../temp/GameCowork');
const run=path.resolve(option('--output',path.join(temp,'template-details-'+randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase()+path.sep),'Output stays in own temp');
assert.ok(!fs.existsSync(run),'Each audit uses a new output directory');
const identity=readEditorIdentity(path.resolve(option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe')));
const previous=args.includes('--previous'),packaged=args.includes('--packaged');
const binary=path.resolve(option('--binary',path.join(repo,packaged?'app/GameCowork.exe':'restored/shell/target/debug/GameCowork.exe')));
const frontend=path.resolve(option('--frontend',path.join(repo,packaged?'app/frontend':'restored/frontend/dist-beautified')));
const archiveDirectory=path.join(path.dirname(identity.editor),'Data/Resources/PackageManager/ProjectTemplates');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const archiveHashes=()=>Object.fromEntries(fs.readdirSync(archiveDirectory).filter(name=>name.endsWith('.tgz')).map(name=>[name,sha(fs.readFileSync(path.join(archiveDirectory,name)))]));
const originalHashes=archiveHashes();
fs.mkdirSync(run,{recursive:true});
const checks=[],errors=[],consoleErrors=[],networkErrors=[],external=[],requests=[],responses=[],resources=[],cleanupErrors=[];
const ownPids=new Set();
let shell,context,page,gui,base,log='',failure,actual,packageMetadata;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function poll(fn,label,timeout=30000){const end=Date.now()+timeout;while(!await fn()){assert.ok(Date.now()<end,'Timed out: '+label);await delay(80);}}
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const alive=pid=>{try{process.kill(pid,0);return true;}catch{return false;}};
async function rpc(type,data={}){const response=await fetch(base+'/api/tauri/invoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messageType:type,messageId:randomUUID(),data})});assert.equal(response.status,200);return(await response.json()).data;}
function playwright(){try{return createRequire(import.meta.url).resolve('playwright');}catch{}const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),'npm-cache/_npx');const found=fs.readdirSync(cache).map(name=>path.join(cache,name,'node_modules/playwright/index.mjs')).find(file=>fs.existsSync(file));assert.ok(found);return found;}
function chromium(){const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),'ms-playwright');for(const name of fs.readdirSync(cache).filter(name=>/^chromium-\d+$/.test(name)).sort((a,b)=>+b.split('-')[1]-+a.split('-')[1]))for(const filename of ['chrome-win64/chrome.exe','chrome-win/chrome.exe']){const full=path.join(cache,name,filename);if(fs.existsSync(full))return full;}throw Error('Existing Chromium required');}
const formattedSize=value=>value>=1073741824?`${(value/1073741824).toFixed(2)} GB`:value>=1048576?`${(value/1048576).toFixed(2)} MB`:value>=1024?`${(value/1024).toFixed(2)} KB`:`${value} B`;
async function snapshot(name){fs.writeFileSync(path.join(run,name+'.aria.txt'),await gui.locator('body').ariaSnapshot());await page.screenshot({path:path.join(run,name+'.png'),fullPage:true,animations:'disabled'});}
try{
 shell=spawn(binary,[],{cwd:run,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,
  GAMECOWORK_APP_ROOT:run,GAMECOWORK_CORE_DIR:path.join(repo,'tests'),GAMECOWORK_CORE_ENTRY:path.join(repo,'tests/core-fixture.mjs'),
  GAMECOWORK_FRONTEND_DIR:frontend,GAMECOWORK_DATA_DIR:path.join(run,'app-data'),GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',
  GAMECOWORK_FIXTURE_DATA_DIR:run,GAMECOWORK_FIXTURE_LOG:path.join(run,'core-frames.jsonl'),
  GAMECOWORK_FIXTURE_TEMPLATE_EDITOR:identity.editor,GAMECOWORK_FIXTURE_TEMPLATE_VERSION:identity.version,GAMECOWORK_FIXTURE_TEMPLATE_PRODUCT:identity.engine}});
 const consume=bytes=>{log+=bytes.toString();const match=log.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//);if(match)base=match[1];};shell.stdout.on('data',consume);shell.stderr.on('data',consume);
 ownPids.add(shell.pid);
 await poll(()=>base,'owned Rust host');
 const list=await rpc('tjhub/getTemplates',{version:identity.version,architecture:'x86_64',editorPath:identity.editor,product:identity.engine});
 assert.equal(list.status,'success',JSON.stringify(list));assert.equal(list.content.supported,true);
 actual=list.content.templates.find(value=>value.name.endsWith('.template.3d'));assert.ok(actual);
 const archiveName=Object.keys(originalHashes).find(name=>originalHashes[name]===actual.archiveSha256);assert.ok(archiveName,'Catalog SHA selects exact installed tgz');
 const archive=path.join(archiveDirectory,archiveName);
 packageMetadata=JSON.parse(execFileSync(path.join(process.env.SystemRoot,'System32/tar.exe'),['-xOf',archive,'package/package.json'],{encoding:'utf8',windowsHide:true,maxBuffer:1024*1024}));
 assert.equal(actual.name,packageMetadata.name);assert.equal(actual.description,packageMetadata.description);assert.equal(actual.version,packageMetadata.version);
 assert.equal(actual.size,fs.statSync(archive).size);assert.equal(actual.buildPlatforms,null);assert.equal(actual.renderPipeline,null);
 const expected=Object.entries(packageMetadata.dependencies).sort(([a],[b])=>a.localeCompare(b)).map(([name,version])=>({name,packageName:name,version}));
 assert.ok(expected.length>0,'Selected actual archive has dependency evidence');assert.deepEqual(actual.packages,expected);
 check('Real native catalog projects exact package.json dependencies, archive bytes and honest unknown fields',true);
 const wrong=await rpc('tjhub/getTemplates',{version:identity.version,editorPath:path.join(run,'not-installed/Unity.exe'),product:identity.engine});
 check('Foreign Editor path remains rejected by the existing native selector',wrong.status==='error');
 const {chromium:browserType}=await import(pathToFileURL(playwright()).href);
 context=await browserType.launchPersistentContext(path.join(run,'browser'),{headless:true,executablePath:chromium(),viewport:{width:1440,height:960},locale:'zh-CN',colorScheme:'dark',serviceWorkers:'block',args:['--disable-background-networking','--disable-component-update','--no-first-run']});
 await context.route('**/*',route=>{const url=new URL(route.request().url());if(['127.0.0.1','localhost'].includes(url.hostname)||['data:','blob:'].includes(url.protocol))return route.continue();external.push(url.origin);return route.abort('blockedbyclient');});
 if(previous)await context.route('**/gui.html*',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(frontend,'gui.html'),'utf8').replaceAll('index-BRxZ4eG7.js','index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js','store-0rGrUshb.js')}));
 await context.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.vscMediaUrl='';window.workspacePaths=[];localStorage.setItem('gamecowork-version-update-seen-features',JSON.stringify(['multi-workspace','remote-access','unity-streaming','remote-workspace','unity-window-streaming']));});
 page=context.pages()[0];page.on('pageerror',error=>errors.push(String(error)));
 page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
 page.on('request',request=>{resources.push(new URL(request.url()).pathname);if(request.url().endsWith('/api/tauri/invoke'))try{const body=request.postDataJSON();requests.push(body.message||body);}catch{}});
 page.on('response',async response=>{const pathname=new URL(response.url()).pathname;if(pathname==='/api/tauri/invoke')try{const reply=await response.json();responses.push(reply);if(response.status()>=400)networkErrors.push({status:response.status(),pathname,messageType:reply.messageType,messageId:reply.messageId,error:reply.data?.error});}catch{}else if(response.status()>=400){let reply;try{reply=await response.json();}catch{}networkErrors.push({status:response.status(),pathname,reply});}});
 await page.goto(base,{waitUntil:'domcontentloaded'});await poll(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'embedded real GUI');gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
 const intro=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/});await intro.first().waitFor({state:'visible',timeout:4000}).catch(()=>{});
 for(let step=0;step<4&&await intro.count()&&await intro.first().isVisible();step++)await intro.first().click();
 await gui.getByText('项目',{exact:true}).first().click();await gui.getByRole('button',{name:/新项目/}).click();
 await gui.getByText(actual.displayName,{exact:true}).first().waitFor();await gui.getByText(actual.displayName,{exact:true}).first().click();
 await gui.getByText('查看详情',{exact:true}).click();
 const details=gui.getByTestId('gamecowork-template-details');await details.waitFor();assert.equal(await details.getAttribute('data-template-name'),actual.name);
 const information=details.getByTestId('gamecowork-template-information');await information.waitFor();
 const informationText=await information.innerText();assert.ok(informationText.includes(packageMetadata.description));assert.ok(informationText.includes(formattedSize(actual.size)));
 assert.equal((informationText.match(/未提供/g)||[]).length,2);assert.doesNotMatch(informationText,/undefined|NaN/);
 check('Original View Details information tab shows actual archive size and description without inventing platform or pipeline',true);await snapshot('01-information');
 await details.getByText('软件包',{exact:true}).click();
 const packages=details.getByTestId('gamecowork-template-packages');await packages.waitFor();
 const packageText=await packages.innerText();for(const dependency of expected){assert.ok(packageText.includes(dependency.name),dependency.name);assert.ok(packageText.includes(dependency.version),dependency.version);}
 assert.equal(await packages.locator(':scope > div').count(),expected.length);assert.doesNotMatch(packageText,/未提供/);
 check('Original packages tab displays every real dependency identity and version from native catalog',true);await snapshot('02-packages');
 await details.getByRole('button',{name:'关闭模板详情',exact:true}).click();await details.waitFor({state:'hidden'});
 await gui.getByText('查看详情',{exact:true}).click();await gui.getByTestId('gamecowork-template-information').waitFor();
 check('Closing and reopening the original detail dialog resets to usable information view',true);
 assert.ok(resources.includes(previous?'/assets/index-DvRYaIVa.js':'/assets/index-BRxZ4eG7.js'));
 assert.ok(resources.includes(previous?'/assets/TJHubRoute-D42CgVct.js':'/assets/TJHubRoute-DN1YDDd-.js'));
 check('Selected source generation actually loads its own Hub detail renderer',true);
 assert.ok(requests.some(request=>request.messageType==='tjhub/getTemplates'));assert.ok(responses.some(response=>response.data?.content?.templates?.some(row=>row.archiveSha256===actual.archiveSha256)));
 const frames=fs.readFileSync(path.join(run,'core-frames.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
 assert.equal(frames.find(frame=>frame.event==='started').parentPid,shell.pid);
 for(const frame of frames)if(frame.event==='started')ownPids.add(frame.pid);
 assert.ok(!requests.some(request=>/createProject|cancelCreateProject|install|uninstall|downloadTemplate|openProject|openEditor|auth|login|acp\//i.test(request.messageType)));
 check('Detail-only audit uses owned Core fixture and issues no creation, cancellation, install, Editor or Provider request',true);
 assert.deepEqual(archiveHashes(),originalHashes);check('Installed Editor archives remain byte-for-byte unchanged',true);
 // Keep exact Chromium/native and unsupported Core-fixture boundaries rather
 // than claiming that this isolated harness validates unrelated native/history
 // operations. Native template/catalog errors and thrown exceptions still fail.
 const nativeZoom=/^\[App\.tsx\] set_zoom_level (?:on mount failed|invoke failed): TypeError: Cannot read properties of undefined \(reading 'invoke'\)\n\s+at a \(http:\/\/127\.0\.0\.1:\d+\/assets\/core-mPlcS5K-\.js:/;
 const expectedFixtureFailure=entry=>entry.status===501&&entry.pathname==='/api/tauri/invoke'&&entry.messageType==='history/markAsRead'&&entry.error==='Fixture operation is not implemented: history/markAsRead'&&requests.some(request=>request.messageId===entry.messageId&&request.messageType==='history/markAsRead');
 const expectedPendingUpdate=entry=>entry.status===501&&entry.pathname==='/api/tauri/pending-update'&&entry.reply?.ok===false&&entry.reply?.error==='Host route is not implemented yet';
 const expectedHistoryEnvelope=responses.some(reply=>reply.messageType==='history/markAsRead'&&reply.data?.status==='error'&&reply.data?.error==='Fixture operation is not implemented: history/markAsRead'&&requests.some(request=>request.messageId===reply.messageId&&request.messageType==='history/markAsRead'));
 assert.deepEqual(networkErrors.filter(entry=>!expectedFixtureFailure(entry)&&!expectedPendingUpdate(entry)),[]);
 const knownBoundary=error=>(nativeZoom.test(error)&&error.includes(`at a (${base}/assets/core-mPlcS5K-.js:`))||
  /^Unable to send message: vscode is undefined ide\/setActiveSessionId \{sessionId: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}$/.test(error)||
  (expectedHistoryEnvelope&&error==='[history/markAsRead] Error: Fixture operation is not implemented: history/markAsRead')||
  (networkErrors.some(entry=>expectedFixtureFailure(entry)||expectedPendingUpdate(entry))&&error==='Failed to load resource: the server responded with a status of 501 (Not Implemented)');
 assert.deepEqual(consoleErrors.filter(error=>!knownBoundary(error)),[]);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);check('Both detail tabs emit no page exception, unexpected console error or external request',true);
}catch(error){failure=String(error.stack||error);await snapshot('failure').catch(()=>{});console.error(error);process.exitCode=1;}
finally{
 if(context)await context.close().catch(error=>cleanupErrors.push(String(error)));
 if(shell?.exitCode===null){const exited=new Promise(resolve=>shell.once('exit',resolve));shell.kill();await Promise.race([exited,delay(10000)]);}
 if(shell?.exitCode===null&&shell?.signalCode===null)cleanupErrors.push('Owned host did not exit');
 const framesFile=path.join(run,'core-frames.jsonl');if(fs.existsSync(framesFile))for(const line of fs.readFileSync(framesFile,'utf8').trim().split('\n'))try{const frame=JSON.parse(line);if(frame.event==='started'&&frame.parentPid===shell?.pid)ownPids.add(frame.pid);}catch{}
 await poll(()=>[...ownPids].every(pid=>!alive(pid)),'own host and fixture PIDs released',10000).catch(error=>cleanupErrors.push(String(error)));
 if(cleanupErrors.length){failure ||= cleanupErrors.join('\n');process.exitCode=1;}
 const expectedFixtureUnsupported=responses.filter(reply=>reply.messageType==='history/markAsRead'&&reply.data?.status==='error'&&reply.data?.error==='Fixture operation is not implemented: history/markAsRead');
 const expectedHostUnsupported=networkErrors.filter(entry=>entry.status===501&&entry.pathname==='/api/tauri/pending-update'&&entry.reply?.ok===false&&entry.reply?.error==='Host route is not implemented yet');
 fs.writeFileSync(path.join(run,'shell.log'),log);fs.writeFileSync(path.join(run,'result.json'),JSON.stringify({status:failure?'failed':'passed',checks,workflowChecks:checks.slice(0,8),errors,consoleErrors,networkErrors,expectedFixtureUnsupported,expectedHostUnsupported,external,cleanupErrors,failure,requests,responses,resources,run,binary,frontend,previous,packaged,identity,actual,packageMetadata,archiveHashes:originalHashes,hostPid:shell?.pid,ownPids:[...ownPids],ownPidsGone:[...ownPids].every(pid=>!alive(pid)),boundary:'Read-only template detail gate. Native zoom injection and VS Code boot are unavailable in Chromium; own Core fixture rejects history/markAsRead; native pending-update remains honestly HTTP 501. These exact unrelated boundaries remain in console/network evidence; eight checks verify template workflow and the ninth verifies its scoped error boundary, not all application features.'},null,2));
}
console.log(JSON.stringify({passed:checks.length,status:failure?'failed':'passed',run,previous,identity,ownPids:[...ownPids],ownPidsGone:[...ownPids].every(pid=>!alive(pid))},null,2));
