// Real Rust/Core, the maintained desktop GUI, and preserved nested Codely
// clients. Owned Provider media seed local history; original model generation
// remains explicitly unavailable until its model-specific mapping exists.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID, createHash } from 'node:crypto';
import { startAssetGenerationProvider } from '../fixtures/asset-generation-provider-fixture.mjs';
import { startMockProvider } from '../fixtures/mock-provider.mjs';
import { probeDefaultSidebarCanvas } from '../support/codely-sidebar-probe.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const option = (key, fallback) => process.argv.includes(key) ? process.argv[process.argv.indexOf(key) + 1] : fallback;
const previous = process.argv.includes('--previous'), packaged = process.argv.includes('--packaged'), inspect = process.argv.includes('--inspect'), cpaOnly = process.argv.includes('--cpa-only'), downloadOnly = process.argv.includes('--download-only');
assert.ok(!downloadOnly || !inspect && !cpaOnly, '--download-only is an independent full download interaction probe');
const temp = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work'), run = path.resolve(option('--output', path.join(temp, 'codely-assets-ui-' + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep), 'Owned outputs stay in the unified temp directory');
const app = path.resolve(option('--app-root', path.join(repo, 'app')));
const binary = path.resolve(option('--binary', packaged ? path.join(app, 'GameCowork.exe') : path.join(repo, 'src/shell/target/debug/GameCowork.exe')));
const frontend = packaged ? path.join(app, 'frontend') : path.join(repo, 'src/frontend/bundle');
const core = packaged ? path.join(app, 'core') : path.join(repo, 'src/core'), coreDir = packaged ? core : path.join(core, 'binary/out');
const agent = path.resolve(option('--agent', path.join(temp, 'logic-puzzle-next-20261002/guarded-cli-v4/gamecowork.exe'))), agentSource = path.dirname(agent);
const workspace = path.join(run, 'Owned Codely Workspace'), sha = value => createHash('sha256').update(value).digest('hex');
const manifest = JSON.parse(fs.readFileSync(path.join(agentSource, 'cli-package-manifest.json'), 'utf8'));
assert.equal(manifest.testGuardIncluded, true); assert.equal(manifest.sourceSha256.toLowerCase(), sha(fs.readFileSync(path.join(repo, 'src/agent/cli-main.beautified.js'))));
const binarySha256 = sha(fs.readFileSync(binary));
if (packaged) assert.equal(JSON.parse(fs.readFileSync(path.join(app, 'cli/cli-package-manifest.json'), 'utf8')).testGuardIncluded, false);
fs.mkdirSync(workspace, { recursive: true }); fs.writeFileSync(path.join(workspace, 'owned-workspace.txt'), 'Owned original-client UI fixture.\n');
const provider = await startAssetGenerationProvider({ root: path.join(run, 'mock-provider'), plans: {
  OWNED_HISTORY_IMAGE: { kind: 'image', immediate: true, base64: true },
  OWNED_HISTORY_VIDEO: { kind: 'video', extensions: ['webm'] }, OWNED_HISTORY_MODEL: { kind: 'model' },
} });
const chatProvider = await startMockProvider({chunkDelayMs:30});
let shell, context, page, gui, creator, history, canvas, origin, failure, canvasSaved, historyTag, referenceEvidence, textEditingComplete = false, shellLog = '', browserGeneration = 0;
const checks = [], pageErrors = [], external = [], apiEvents = [], actors = [], seeds = {}, artifacts = [], leaseEvents = [], responseReads = [], graphEvents = [];
const frameIds = new WeakMap(), frameOwners = new WeakMap(); let frameSequence = 0, leaseEvidence, sidebarLeaseEvidence;
let cpaEvidence, downloadEvidence;
const downloadChoices = [], downloadEvents = [], browserDownloads = [], downloadChoiceFile = path.join(run,'owned-download-choices.json');
if (downloadOnly) { fs.mkdirSync(path.join(run,'downloads'),{recursive:true}); fs.writeFileSync(downloadChoiceFile,'[]'); }
function frameId(frame) { if (!frameIds.has(frame)) frameIds.set(frame, ++frameSequence); return frameIds.get(frame); }
function observeCanvasGraph(response) {
  const request=response.request(),url=new URL(response.url());
  if(!/^\/codely-canvas\/api\/v1\/assets\/[^/]+(?:\/download)?$/.test(url.pathname))return;
  const event={path:url.pathname,method:request.method(),status:response.status(),frameId:frameId(request.frame()),time:Date.now()};
  const summarize=value=>(value?.nodes||[]).filter(node=>node.data?.nodeType==='text').map(node=>({id:node.id,textContent:node.data.textContent}));
  if(request.method()==='PUT'){
    try {const data=request.postDataJSON()?.data;if(typeof data==='string')event.textNodes=summarize(JSON.parse(data));}catch{}
    graphEvents.push(event);
  }else if(url.pathname.endsWith('/download')){
    graphEvents.push(event);responseReads.push(response.json().then(body=>{event.textNodes=summarize(body.data||body);}).catch(error=>{event.readError=error.message;}));
  }
}
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); console.log(name + ': PASS'); };
async function poll(predicate, label, timeout = 30000) { const deadline = Date.now() + timeout; while (!await predicate()) { assert.ok(Date.now() < deadline, 'Timed out: ' + label); await new Promise(resolve => setTimeout(resolve, 100)); } }
function modulePath() { try { return createRequire(import.meta.url).resolve('playwright'); } catch {} const root = path.join(process.env.LOCALAPPDATA, 'npm-cache/_npx'); return fs.readdirSync(root).map(name => path.join(root, name, 'node_modules/playwright/index.mjs')).filter(fs.existsSync).sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]; }
function chrome() { const root = path.join(process.env.LOCALAPPDATA, 'ms-playwright'); for (const directory of fs.readdirSync(root).filter(value => /^chromium-\d+$/.test(value)).sort((a,b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))) for (const file of ['chrome-win64/chrome.exe','chrome-win/chrome.exe']) if (fs.existsSync(path.join(root,directory,file))) return path.join(root,directory,file); }
function cleanEnv() { const env = {...process.env}; for (const key of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key) || key === 'NODE_OPTIONS') delete env[key]; return env; }
async function launch() {
  const env = {...cleanEnv(), GAMECOWORK_APP_ROOT:run, GAMECOWORK_FRONTEND_DIR:frontend, GAMECOWORK_CORE_DIR:coreDir, GAMECOWORK_CORE_ENTRY:path.join(coreDir,'index.js'), GAMECOWORK_DATA_DIR:path.join(run,'data'), GAMECOWORK_AGENT_PATH:agent, GAMECOWORK_AGENT_RESOURCE_DIR:path.join(agentSource,'resources'), GAMECOWORK_HEADLESS:'1', GAMECOWORK_TEST_MODE:'1', GAMECOWORK_PICK_FOLDER:workspace, GAMECOWORK_CHAT_ROOT:run, GAMECOWORK_CHAT_CORE:core, GAMECOWORK_CHAT_AGENT:agent, GAMECOWORK_CLI_PROBE_ROOT:run, GAMECOWORK_CLI_PROBE_SOURCE:agentSource, CUSTOM_AUTH:'1', BUN_RUNTIME_TRANSPILER_CACHE_PATH:path.join(run,'bun-cache'), NODE_OPTIONS:'--require '+JSON.stringify(path.join(repo,'tests/fixtures/chat-core-guard.cjs'))};
  if(downloadOnly){env.GAMECOWORK_TEST_DOWNLOAD_CHOICES=downloadChoiceFile;downloadChoices.length=0;fs.writeFileSync(downloadChoiceFile,'[]');}
  shell = spawn(binary, [], {cwd:run, env, windowsHide:true, stdio:['ignore','pipe','pipe']});
  const actor = {pid:shell.pid,exited:false}; actors.push(actor); shell.once('exit',(code,signal)=>Object.assign(actor,{exitCode:code,signalCode:signal,exited:true}));
  return new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(Error('Owned Rust/Core startup timeout')),60000);const consume=chunk=>{shellLog+=chunk.toString();output+=chunk.toString();const match=output.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match){clearTimeout(timer);resolve(match[1]);}};shell.stdout.on('data',consume);shell.stderr.on('data',consume);shell.once('error',reject);shell.once('exit',code=>{clearTimeout(timer);reject(Error('Owned shell exited '+code));});});
}
function gone(pid) { if (!pid) return true; try {process.kill(pid,0);return false;} catch(error) {return error.code==='ESRCH';} }
async function stopShell() { if (!shell) return; const owned=shell,actor=actors.find(value=>value.pid===owned.pid),lock=path.join(run,'data/core-state/generator/owner.lock');if(fs.existsSync(lock))actor.corePid=JSON.parse(fs.readFileSync(lock,'utf8')).pid;if(owned.exitCode===null&&owned.signalCode===null){const exit=new Promise(resolve=>owned.once('exit',resolve));owned.kill();await exit;}await poll(()=>gone(actor.pid)&&gone(actor.corePid),'owned shell and Core PIDs exit',15000);actor.gone=true;shell=undefined; }
async function api(route, {method='GET',body,headers={}}={}) { const response=await fetch(new URL(route,origin),{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(method==='GET'?{}:{Origin:new URL(origin).origin}),...headers},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,body:await response.json()}; }
async function rpc(messageType,data={}) {const result=await api('/api/tauri/invoke',{method:'POST',body:{messageType,messageId:randomUUID(),data}});assert.equal(result.body.data.status,'success',messageType+': '+JSON.stringify(result.body));return result.body.data.content;}
async function snapshot(name,frame=gui) { if(frame)fs.writeFileSync(path.join(run,name+'.aria.txt'),await frame.locator('body').ariaSnapshot());await page.screenshot({path:path.join(run,name+'.png'),fullPage:true,animations:'disabled'});artifacts.push(name); }
async function decodedPixels(locator){return locator.evaluate(async element=>{const width=element.videoWidth||element.naturalWidth||element.width,height=element.videoHeight||element.naturalHeight||element.height;if(!width||!height)throw Error('Media has no decoded pixels');const surface=element.tagName==='CANVAS'?element:document.createElement('canvas');if(surface!==element){surface.width=width;surface.height=height;surface.getContext('2d').drawImage(element,0,0);}const context=surface.getContext('2d'),pixels=context.getImageData(0,0,width,height).data,center=Array.from(context.getImageData(Math.floor(width/2),Math.floor(height/2),1,1).data),digest=await crypto.subtle.digest('SHA-256',pixels);return{width,height,center,sha256:Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('')};});}
async function state() {return gui.evaluate(async previous=>{const {s}=await import(previous?'/assets/store-0rGrUshb.js':'/assets/store-c6kNGz30.js');const value=s.getState();return{workspaces:value.hub.workspaces,workspaceKey:value.hub.activeWorkspaceKey,isStreaming:value.session.sessions[value.session.activeSessionId]?.isStreaming,models:(value.config.config.modelsByRole?.chat||[]).map(model=>model.title)};},previous);}
function framePath(frame) { try { return new URL(frame.url()).pathname; } catch { return ""; } }
async function startBrowser() {
  const {chromium}=await import(pathToFileURL(modulePath()).href);context=await chromium.launchPersistentContext(path.join(run,'browser-'+(++browserGeneration)),{headless:true,executablePath:chrome(),viewport:{width:1560,height:1020},locale:'zh-CN',timezoneId:'Asia/Shanghai',colorScheme:'dark',serviceWorkers:'block',args:['--enable-unsafe-swiftshader']});
  await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1'||['blob:','data:'].includes(url.protocol))return route.continue();external.push({origin:url.origin,path:url.pathname});return route.abort('blockedbyclient');});
  if(previous)await context.route('**/gui.html*',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(frontend,'gui.html'),'utf8').replaceAll('index-BRxZ4eG7.js','index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js','store-0rGrUshb.js')}));
  await context.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.workspacePaths=[];window.vscMediaUrl='';});page=context.pages()[0]||await context.newPage();page.on('pageerror',error=>pageErrors.push(error.stack||String(error)));page.on('response',response=>{const url=new URL(response.url()),request=response.request();if(url.pathname.startsWith('/api/codely-generator/')||url.pathname.startsWith('/codely-canvas/api/'))apiEvents.push({path:url.pathname,query:url.search,method:request.method(),status:response.status(),authorizationPresent:!!request.headers().authorization,workspace:request.headers()['x-gamecowork-workspace']});if(url.pathname.includes('/canvas-locks/')){const event={path:url.pathname,method:request.method(),status:response.status(),browserGeneration,frameId:frameId(request.frame())};try{const owner=request.postDataJSON()?.session_id;event.ownerHash=owner?sha(owner):null;if(owner)frameOwners.set(request.frame(),owner);}catch{}leaseEvents.push(event);if(request.method()!=='DELETE')responseReads.push(response.json().then(body=>{event.data=body.data;}).catch(error=>{event.readError=error.message;}));}});
  page.on('response',observeCanvasGraph);
  page.on('download',download=>browserDownloads.push({filename:download.suggestedFilename(),url:download.url()}));
  page.on('response',response=>{if(new URL(response.url()).pathname==='/api/tauri/download-url'){const event={status:response.status(),request:response.request().postDataJSON()};downloadEvents.push(event);responseReads.push(response.json().then(body=>event.body=body).catch(error=>event.error=error.message));}});
  await page.goto(origin,{waitUntil:'domcontentloaded'});await poll(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'real GUI frame');gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
  const next=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/});await next.first().waitFor({state:'visible',timeout:3500}).catch(()=>{});for(let i=0;i<4&&await next.count()&&await next.first().isVisible();i++)await next.first().click();
  if(!(await state()).workspaces.some(value=>path.resolve(value.workspaceDir)===workspace)){await gui.getByRole('button',{name:/^(打开工作区|Open Workspace)$/}).last().click();await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();await poll(async()=>(await state()).workspaces.some(value=>path.resolve(value.workspaceDir)===workspace),'owned workspace opened');}
  await gui.getByRole('button',{name:/^(AI资产生成|AI 资产生成|AI Asset Generation)$/}).first().click();await gui.getByTestId('ai-creation-panel').waitFor({state:'visible'});await poll(()=>gui.childFrames().some(frame=>framePath(frame)==='/lab3d'),'original Creator nested frame');creator=gui.childFrames().find(frame=>framePath(frame)==='/lab3d');
}
async function openHistory() {await gui.getByRole('tab',{name:/^(生成记录|生成历史|Generation History)$/}).click();await poll(()=>gui.childFrames().some(frame=>framePath(frame)==='/generation-history'),'original History nested frame');history=gui.childFrames().find(frame=>framePath(frame)==='/generation-history');await history.locator('.generation-history-toolbar').waitFor({state:'visible'});}
async function openCanvas() {await gui.getByRole('tab',{name:/^(画布|Canvas)$/}).click();await poll(()=>gui.childFrames().some(frame=>framePath(frame).startsWith('/codely-canvas/')),'original Canvas nested frame');canvas=gui.childFrames().find(frame=>framePath(frame).startsWith('/codely-canvas/'));await canvas.getByRole('button',{name:/空白画布|新建无限画布/}).first().waitFor({state:'visible',timeout:30000});}

async function exerciseCpaQuick() {
  const saved=await rpc('generator/saveProvider',{provider:{name:'Owned CPA image protocol',baseUrl:provider.baseUrl,model:'gpt-image-2',kinds:['image'],authMode:'bearer',apiKey:provider.apiKey,enabled:true,requestTimeoutMs:120000,
    adapter:{responseMode:'outputs',selectors:{outputs:'data'},outputSelectors:{base64:'b64_json'},cancel:null,create:{method:'POST',path:'/images/generations',bodyTemplate:{model:'{{model}}',prompt:'{{prompt}}',n:1,size:'1024x1024',quality:'low',output_format:'png'}}}}});
  const binding=await api('/api/codely-generator/local/model-bindings/cpa-gpt-image-2',{method:'PUT',body:{providerId:saved.provider.id}});assert.equal(binding.status,200);
  await creator.goto(creator.url(),{waitUntil:'domcontentloaded'});await creator.locator('.studio-model-select:not(.gamecowork-provider-selector)').waitFor({state:'visible'});
  await creator.getByRole('button',{name:'第三方',exact:true}).click();
  await creator.locator('.studio-model-select:not(.gamecowork-provider-selector)').click();await creator.locator('.studio-model-option').filter({has:creator.getByText('GPT Image 2 · CPA',{exact:true})}).click();
  const prompt='OWNED_CPA_IMAGE a crystal fixture';await creator.locator('textarea').first().fill(prompt);
  const generate=creator.locator('.studio-generate-button');await poll(()=>generate.isEnabled(),'only the explicitly bound CPA descriptor can generate');
  check('Original model menu enables the explicitly configured CPA descriptor without an official paid entitlement',await creator.getByText('需付费订阅',{exact:true}).count()===0);
  await snapshot('cpa-01-ready',creator);await generate.click();
  let task;await poll(async()=>{task=(await api('/api/codely-generator/tasks',{body:undefined})).body.tasks.find(value=>value.type==='cpa-gpt-image-2');return task?.status==='completed';},'original submit and polling complete an actual owned CPA-format image');
  const image=creator.locator('img[src*="/api/codely-generator/local-artifacts/"]').first();await poll(()=>image.evaluate(value=>value.complete&&value.naturalWidth===48&&value.naturalHeight===32),'original Quick result decodes actual output pixels');
  const pixels=await decodedPixels(image),calls=provider.requests.filter(value=>value.path==='/images/generations'&&value.method==='POST');
  check('One original submit reaches the configured image endpoint once using the requested route and verified account defaults',calls.length===1&&calls[0].authorized&&calls[0].body.model==='gpt-image-2'&&calls[0].body.n===1&&calls[0].body.size==='auto'&&calls[0].body.quality==='auto'&&calls[0].body.output_format==='png');
  check('Actual image dimensions come from generated PNG bytes without a promised request resolution',task.output.data.artifacts[0].width===48&&task.output.data.artifacts[0].height===32&&pixels.width===48&&pixels.height===32&&task.input.data.size==='auto');
  await snapshot('cpa-02-generated',creator);
  if(downloadOnly)await exerciseQuickDownload(image);
  await openHistory();await history.locator('.generation-card').first().click();await history.getByRole('dialog').waitFor({state:'visible'});
  const regenerate=history.getByRole('dialog').getByRole('button',{name:/再次生成/});await regenerate.click();
  await poll(async()=>(await creator.locator('.studio-model-select:not(.gamecowork-provider-selector)').textContent()).includes('GPT Image 2 · CPA')&&(await creator.locator('textarea').first().inputValue())===prompt,'original History regenerates the exact CPA descriptor and prompt draft');
  check('Original History regeneration restores the separate CPA tab and parameters without silently creating another task',await creator.getByRole('button',{name:'第三方',exact:true}).getAttribute('aria-pressed')==='true'&&provider.requests.filter(value=>value.path==='/images/generations'&&value.method==='POST').length===1);
  await snapshot('cpa-03-regenerated-draft',creator);
  const taskId=task.id;await context.close();context=undefined;await stopShell();origin=await launch();await startBrowser();await openHistory();await poll(()=>history.locator('.generation-card').count().then(count=>count===1),'fresh browser and host restore the CPA history');
  const restored=(await api('/api/codely-generator/task/'+taskId+'/status')).body,cap=(await api('/api/codely-generator/local-session')).body.capabilities;
  check('CPA mapping, original task parameters and generated bytes survive a real host restart without resubmission',restored.status==='completed'&&restored.input.data.studioModelId==='cpa-gpt-image-2'&&cap.models['cpa-gpt-image-2']?.providerId===saved.provider.id&&provider.requests.filter(value=>value.path==='/images/generations'&&value.method==='POST').length===1);
  cpaEvidence={taskId,providerId:saved.provider.id,pixels,actualDimensions:{width:48,height:32},requestedSize:'auto',quality:'auto',requests:calls,restoredModel:restored.input.data.studioModelId,liveService:false};
  await snapshot('cpa-04-restarted',history);
}

function chooseDownload(choice){
  downloadChoices.push(choice);
  const staged=downloadChoiceFile+'.next';fs.writeFileSync(staged,JSON.stringify(downloadChoices));fs.renameSync(staged,downloadChoiceFile);
}
async function downloadButton(button,choice,{expectedSha,status=200,label}={}){
  const before=downloadEvents.length;chooseDownload(choice);
  await button.click();await poll(()=>downloadEvents.length>before&&downloadEvents[before].body,'original '+label+' download reaches a final native response');
  const event=downloadEvents[before];assert.equal(event.status,status,label+': '+JSON.stringify(event.body));
  if(choice.action==='cancel')assert.equal(event.body.cancelled,true);
  else if(status===200){assert.equal(event.body.ok,true);assert.equal(sha(fs.readFileSync(choice.path)),expectedSha);assert.equal(event.body.sha256,expectedSha);assert.equal(event.body.byteLength,fs.statSync(choice.path).size);await gui.getByText('文件已保存。',{exact:true}).last().waitFor({state:'visible'});}
  else assert.equal(event.body.ok,false);
  await page.waitForTimeout(150);
  assert.equal(downloadEvents.length,before+1,'An original click issues exactly one native save request');
  assert.equal(browserDownloads.length,0,'Native outcome does not trigger a browser fallback download');
  return event;
}
async function exerciseQuickDownload(image){
  await image.click();const original=creator.locator('.studio-asset-list button').first();await original.waitFor({state:'visible'});
  const saved=await downloadButton(original,{action:'save',path:path.join(run,'downloads/quick.png')},{expectedSha:provider.media.png.sha256,label:'Quick result'});
  const cancelled=await downloadButton(original,{action:'cancel'},{label:'Quick cancellation'});
  check('Original Quick result download saves the exact generated PNG and cancellation has no fallback',saved.body.ok&&cancelled.body.cancelled&&fs.readdirSync(path.join(run,'downloads')).length===1);
  downloadEvidence={quick:{saved,cancelled},actualButtons:true};await snapshot('download-01-quick',creator);
  await creator.locator('body').press('Escape');
}
async function exerciseDownloads(){
  // The CPA helper generates through the preserved Quick controls, downloads
  // through its original result button, and already performs a cold restart.
  await exerciseCpaQuick();
  const historyButton=history.locator('.generation-card-download-primary').first();await historyButton.waitFor({state:'visible'});
  const target=path.join(run,'downloads/history.png');
  const saved=await downloadButton(historyButton,{action:'save',path:target},{expectedSha:provider.media.png.sha256,label:'History card'});
  const repeated=await downloadButton(historyButton,{action:'save',path:target},{status:409,label:'History duplicate filename'});
  await gui.getByText('目标文件已存在，请换一个文件名保存。',{exact:true}).last().waitFor({state:'visible'});
  assert.equal(sha(fs.readFileSync(target)),provider.media.png.sha256);
  const cancelled=await downloadButton(historyButton,{action:'cancel'},{label:'History cancellation'});
  downloadEvidence.history={saved,repeated,cancelled};
  check('Original History download writes identical bytes, rejects a duplicate destination and honors cancellation',saved.body.ok&&repeated.body.ok===false&&cancelled.body.cancelled);
  await snapshot('download-02-history',history);

  await openCanvas();await canvas.getByRole('button',{name:'新建无限画布',exact:true}).click();await canvas.locator('.react-flow__pane').waitFor({state:'visible'});
  await poll(()=>Object.keys(canvasStore().assets).length===1,'download fixture canvas is actually persisted');
  const canvasId=Object.keys(canvasStore().assets)[0],canvasName='OWNED_DOWNLOAD_CANVAS';
  await canvas.getByTitle('点击编辑画布名称',{exact:true}).click();await canvas.getByPlaceholder('输入画布名称',{exact:true}).fill(canvasName);await canvas.getByPlaceholder('输入画布名称',{exact:true}).press('Enter');
  const pane=canvas.locator('.react-flow__pane');await pane.click({button:'right',position:{x:350,y:240}});await canvas.getByRole('button',{name:'添加节点',exact:true}).click();
  const [chooser]=await Promise.all([page.waitForEvent('filechooser'),canvas.getByText('媒体上传',{exact:true}).click()]);await chooser.setFiles([provider.media.png.file,provider.media.webm.file]);
  let imageNode,videoNode;await poll(()=>{const graph=JSON.parse(canvasStore().assets[canvasId].graph);imageNode=graph.nodes.find(node=>node.data.nodeType==='image'&&node.data.images?.length);videoNode=graph.nodes.find(node=>node.data.nodeType==='video'&&node.data.videos?.length);return !!imageNode&&!!videoNode;},'original Canvas upload creates registered image/video references');
  await canvas.getByRole('button',{name:'适应画布',exact:true}).click();
  const card=id=>canvas.locator('.react-flow__node[data-id="'+id+'"]');
  await poll(()=>card(imageNode.id).locator('img').first().evaluate(image=>image.complete&&image.naturalWidth===48),'uploaded Canvas image decodes');
  await poll(()=>card(videoNode.id).locator('video').evaluate(video=>video.readyState>=2&&video.videoWidth===32),'uploaded Canvas video decodes');
  await card(imageNode.id).getByText(provider.media.png.fileName,{exact:true}).click();
  const imageSaved=await downloadButton(canvas.locator('[data-tooltip="下载"] button'),{action:'save',path:path.join(run,'downloads/canvas.png')},{expectedSha:provider.media.png.sha256,label:'Canvas image'});
  const canvasCancelled=await downloadButton(canvas.locator('[data-tooltip="下载"] button'),{action:'cancel'},{label:'Canvas cancellation'});
  await card(videoNode.id).getByText(provider.media.webm.fileName,{exact:true}).click();
  const videoSaved=await downloadButton(canvas.locator('[data-tooltip="下载"] button'),{action:'save',path:path.join(run,'downloads/canvas.webm')},{expectedSha:provider.media.webm.sha256,label:'Canvas video'});
  check('Original Canvas image and video buttons save their real bytes through openurl and honor cancellation',imageSaved.body.ok&&videoSaved.body.ok&&canvasCancelled.body.cancelled);
  downloadEvidence.canvas={canvasId,imageNodeId:imageNode.id,videoNodeId:videoNode.id,imageSaved,videoSaved,cancelled:canvasCancelled};
  await snapshot('download-03-canvas',canvas);

  const imageUrl=imageNode.data.images[0],workspaceKey=(await state()).workspaceKey;
  const badScope=new URL(imageUrl);badScope.searchParams.set('workspaceKey',workspaceKey+'-foreign');
  const probes=[
    {label:'external source',body:{url:'https://external.invalid/owned.png',filename:'owned.png'}},
    {label:'local non-media route',body:{url:new URL('/api/tauri/health',origin).href,filename:'owned.png'}},
    {label:'foreign input scope',body:{url:badScope.href,filename:'owned.png'}},
    {label:'traversal filename',body:{url:imageUrl,filename:'../outside.png'}},
    {label:'client-selected path',body:{url:imageUrl,filename:'owned.png',path:path.join(run,'downloads/untrusted.png')}},
    {label:'blob source',body:{url:'blob:'+new URL(origin).origin+'/owned-unregistered',filename:'owned.png'}},
  ];
  const beforeFiles=fs.readdirSync(path.join(run,'downloads')).sort(),negative=[];
  for(const probe of probes){const result=await api('/api/tauri/download-url',{method:'POST',body:probe.body});assert.ok(result.status>=400,probe.label+': '+JSON.stringify(result));assert.equal(result.body.ok,false);negative.push({label:probe.label,...result});}
  const originRejected=await api('/api/tauri/download-url',{method:'POST',headers:{Origin:'https://external.invalid'},body:{url:imageUrl,filename:'owned.png'}});assert.ok(originRejected.status>=400);negative.push({label:'foreign Origin',...originRejected});
  const inputs=JSON.parse(fs.readFileSync(path.join(run,'data/core-state/generator/inputs.json'),'utf8')),inputId=decodeURIComponent(new URL(imageUrl).pathname.split('/').at(-2)),input=inputs[inputId];assert.ok(input);
  const mediaFile=path.join(run,'data/core-state/generator',input._file),originalBytes=fs.readFileSync(mediaFile),changedBytes=Buffer.from(originalBytes);changedBytes[changedBytes.length-1]^=1;
  try{fs.writeFileSync(mediaFile,changedBytes);const result=await api('/api/tauri/download-url',{method:'POST',body:{url:imageUrl,filename:'owned.png'}});assert.ok(result.status>=400);assert.equal(result.body.ok,false);negative.push({label:'changed registered SHA',...result});}finally{fs.writeFileSync(mediaFile,originalBytes);}
  assert.deepEqual(fs.readdirSync(path.join(run,'downloads')).sort(),beforeFiles);
  check('Real native HTTP rejects external, unregistered, wrong-scope, path-injected and changed media before any save',negative.every(value=>value.status>=400));downloadEvidence.negative=negative;

  const oldOrigin=new URL(origin).origin,requests=provider.requests.filter(value=>value.method==='POST').length;
  await context.close();context=undefined;await stopShell();origin=await launch();assert.notEqual(new URL(origin).origin,oldOrigin);await startBrowser();
  const stale=await api('/api/tauri/download-url',{method:'POST',body:{url:imageUrl,filename:'owned.png'}});assert.ok(stale.status>=400);assert.equal(stale.body.ok,false);
  await openCanvas();await canvas.getByText(canvasName,{exact:true}).click();await canvas.locator('.react-flow__node').first().waitFor({state:'visible'});await canvas.getByRole('button',{name:'适应画布',exact:true}).click();
  // Restored tall video nodes can fit at 155%, placing the image's original
  // floating toolbar behind the fixed header. Use the shipped zoom controls.
  await canvas.getByRole('button',{name:'缩小',exact:true}).click();await canvas.getByRole('button',{name:'缩小',exact:true}).click();
  const restored=card(imageNode.id),restoredImage=restored.locator('img').first();await poll(()=>restoredImage.evaluate(image=>image.complete&&image.naturalWidth===48),'new-port Canvas image actually decodes');
  assert.equal(new URL(await restoredImage.getAttribute('src'),origin).origin,new URL(origin).origin);await restored.getByText(provider.media.png.fileName,{exact:true}).click();
  const restarted=await downloadButton(canvas.locator('[data-tooltip="下载"] button'),{action:'save',path:path.join(run,'downloads/canvas-restarted.png')},{expectedSha:provider.media.png.sha256,label:'restarted Canvas'});
  assert.equal(provider.requests.filter(value=>value.method==='POST').length,requests);
  check('Cold restart rejects stale URLs while the original Canvas button saves the rebased media without regeneration',restarted.body.ok&&stale.status>=400);
  downloadEvidence.restart={oldOrigin,newOrigin:new URL(origin).origin,stale,restarted};
  await snapshot('download-04-restarted',canvas);
  await exerciseSidebarDownload({canvasId,canvasName,imageNodeId:imageNode.id});
  downloadEvidence.files=fs.readdirSync(path.join(run,'downloads')).sort().map(filename=>({filename,sha256:sha(fs.readFileSync(path.join(run,'downloads',filename)))}));
}
async function exerciseSidebarDownload({canvasId,canvasName,imageNodeId}){
  await prepareOwnedChat();
  // Release the actual Assets document's lease before opening the same graph
  // through the normal chat sidebar. No Redux state or owner is fabricated.
  await gui.getByRole('tab',{name:/^(画布|Canvas)$/}).click();
  await canvas.getByRole('button',{name:'返回',exact:true}).click();await canvas.getByRole('button',{name:'返回工作区',exact:true}).click();
  await canvas.getByRole('button',{name:'新建无限画布',exact:true}).waitFor({state:'visible'});
  await gui.locator('[data-telemetry-id="history_session"]').first().click();await gui.locator('main').getByText('Hello fixture',{exact:false}).waitFor({state:'visible'});
  const visible=async locator=>{for(let i=0;i<await locator.count();i++)if(await locator.nth(i).isVisible())return locator.nth(i);return null;};
  let extension=await visible(gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]'));
  if(!extension){const toggle=await visible(gui.locator('[data-telemetry-id="toggle_right_sidebar"]'));assert.ok(toggle);await toggle.click();await poll(async()=>!!await visible(gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]')),'real default sidebar opens');extension=await visible(gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]'));}
  await extension.click();await gui.getByRole('menuitem',{name:/^(AI\s*画布|AI\s*Canvas|画布)$/i}).click();
  const iframe=gui.getByTestId('right-sidebar-canvas-frame');await iframe.waitFor({state:'visible'});const handle=await iframe.elementHandle();let sidebar;try{sidebar=await handle.contentFrame();}finally{await handle.dispose();}assert.ok(sidebar);
  await poll(async()=>!!await visible(sidebar.getByRole('button',{name:'返回',exact:true}))||!!await visible(sidebar.getByText(canvasName,{exact:true})),'original default sidebar Canvas entry settles');
  if(await visible(sidebar.getByRole('button',{name:'返回',exact:true}))){await sidebar.getByRole('button',{name:'返回',exact:true}).click();await sidebar.getByRole('button',{name:'返回工作区',exact:true}).click();}
  await sidebar.getByText(canvasName,{exact:true}).click();const node=sidebar.locator('.react-flow__node[data-id="'+imageNodeId+'"]');await node.waitFor({state:'visible'});await sidebar.getByRole('button',{name:'适应画布',exact:true}).click();await poll(()=>node.locator('img').first().evaluate(image=>image.complete&&image.naturalWidth===48),'original sidebar image decodes');await node.getByText(provider.media.png.fileName,{exact:true}).click();
  const result=await downloadButton(sidebar.locator('[data-tooltip="下载"] button'),{action:'save',path:path.join(run,'downloads/sidebar.png')},{expectedSha:provider.media.png.sha256,label:'default sidebar Canvas'});
  check('Default right-sidebar Canvas original download button saves actual registered image bytes',result.body.ok&&new URL(gui.url()).searchParams.get('flexibleLayout')!=='1');
  downloadEvidence.sidebar={entry:'default-right-sidebar-extension-menu',canvasId,result};canvas=sidebar;await snapshot('download-05-default-sidebar',sidebar);
}

// The welcome page has no layout chooser. Prepare one actual guarded local chat,
// then use its normal sidebar row when checking the combined layout.
async function prepareOwnedChat(){
  await gui.locator('[data-telemetry-id="open_settings"]').first().click();await gui.locator('[data-telemetry-id="settings_nav_models"]').click();await gui.locator('[data-telemetry-id="add_model_provider"]').click();
  await gui.getByLabel(/^(服务提供方名称|Provider Name)$/).fill('Owned Canvas Layout Chat');await gui.getByLabel(/^(基础 URL|Base URL)$/).fill(chatProvider.baseUrl);await gui.getByLabel(/^(API 密钥|API Key)$/).fill(chatProvider.apiKey);await gui.locator('[data-telemetry-id="submit_provider_form"]').click();await gui.getByText('Owned Canvas Layout Chat',{exact:true}).first().waitFor({state:'visible'});
  await gui.locator('[data-telemetry-id="add_model_profile"]').click();await gui.getByLabel(/^(模型名称|Model Name)$/).fill(chatProvider.model);await gui.getByLabel(/^(显示名称|Display Name)$/).fill('Owned Canvas Layout Model');await gui.locator('[data-telemetry-id="submit_model_form"]').click();await gui.getByText('Owned Canvas Layout Model',{exact:true}).first().waitFor({state:'visible'});
  for(let slot=0;slot<2;slot++){await gui.locator('[data-telemetry-id="settings_select"]').nth(slot).click();await gui.locator('[data-telemetry-id="settings_select_option"]').filter({hasText:'Owned Canvas Layout Model'}).click();}
  await gui.locator('[data-telemetry-id="settings_back"]').click();await gui.getByRole('button',{name:/新建会话/}).first().click();await poll(async()=>(await state()).models.includes('Owned Canvas Layout Model'),'owned guarded chat model available');await gui.locator('[data-telemetry-id="model_select"]').first().click();await gui.getByText('Owned Canvas Layout Model',{exact:true}).last().click();
  await gui.locator('[contenteditable="true"]').first().fill('OWNED_CANVAS_LAYOUT_CHAT');await gui.locator('[data-telemetry-id="send_message"]').first().click();await gui.getByText('Hello fixture',{exact:false}).last().waitFor({state:'visible',timeout:30000});await poll(async()=>!(await state()).isStreaming,'guarded own chat reaches final frame');await gui.locator('[data-telemetry-id="history_session"]').first().waitFor({state:'visible'});
  check('A real guarded loopback chat supplies the normal session page for layout testing',chatProvider.requests.some(value=>value.url==='/v1/chat/completions'&&value.completed));await gui.getByRole('button',{name:/^(AI资产生成|AI 资产生成|AI Asset Generation)$/}).first().click();
}

async function seedHistory() {
  const saved=await rpc('generator/saveProvider',{provider:{name:'Owned loopback history preparation',baseUrl:provider.baseUrl,apiKey:provider.apiKey,authMode:'bearer',kinds:['image','video','model'],enabled:true}});
  const workspaceKey=(await state()).workspaceKey;
  for(const [kind,prompt,model] of [['image','OWNED_HISTORY_IMAGE','seedream-lite'],['video','OWNED_HISTORY_VIDEO','seedance2'],['model','OWNED_HISTORY_MODEL','tripo-p2']]){
    const created=await rpc('generator/createTask',{providerId:saved.provider.id,kind,prompt,model,parameters:{seed:7},workspaceKey,idempotencyKey:randomUUID()});
    await poll(async()=>{const value=(await rpc('generator/getTask',{taskId:created.task.id})).task;if(['failed','interrupted'].includes(value.status))throw Error('Owned media preparation failed: '+value.error);seeds[kind]=value;return value.status==='completed';},'actual '+kind+' media preparation');
  }
  check('Real owned Provider prepares decoded media history without using an original model API',Object.keys(seeds).length===3&&seeds.image.artifacts[0].sha256===provider.media.png.sha256&&seeds.video.artifacts[0].sha256===provider.media.webm.sha256&&seeds.model.artifacts[0].sha256===provider.media.glb.sha256);
}
function canvasStore(){const file=path.join(run,'data/codely-canvas/canvases.json');return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{assets:{}};}
async function emptyCanvasPoint(){return canvas.locator('.react-flow__pane').evaluate(pane=>{const rect=pane.getBoundingClientRect();for(const[x,y]of[[.85,.62],[.82,.78],[.5,.8],[.2,.75],[.2,.2]]){const clientX=rect.left+rect.width*x,clientY=rect.top+rect.height*y;if(document.elementFromPoint(clientX,clientY)===pane)return{x:rect.width*x,y:rect.height*y};}throw Error('No visible empty Canvas point is available');});}
async function exerciseCanvas(){
  await canvas.getByRole('button',{name:'新建无限画布',exact:true}).click();await canvas.locator('.react-flow__pane').waitFor({state:'visible'});
  await poll(()=>Object.keys(canvasStore().assets).length===1,'actual Canvas creation persisted by local service');
  const id=Object.keys(canvasStore().assets)[0];check('Original Canvas creates a real empty graph through its local asset service',JSON.parse(canvasStore().assets[id].graph).nodes.length===0);
  await canvas.getByTitle('点击编辑画布名称',{exact:true}).click();await canvas.getByPlaceholder('输入画布名称',{exact:true}).fill('OWNED_CANVAS_PERSISTENCE');await canvas.getByPlaceholder('输入画布名称',{exact:true}).press('Enter');
  await poll(()=>canvasStore().assets[id].name==='OWNED_CANVAS_PERSISTENCE','original Canvas rename persists');
  const pane=canvas.locator('.react-flow__pane');await pane.click({button:'right',position:{x:350,y:240}});await canvas.getByRole('button',{name:'添加节点',exact:true}).click();await canvas.getByText('文本',{exact:true}).last().waitFor({state:'visible'});await snapshot('04-original-node-menu',canvas);
  await canvas.getByText('文本',{exact:true}).last().click();const node=canvas.locator('.react-flow__node').first();await node.waitFor({state:'visible'});await snapshot('05-original-text-node',canvas);
  await poll(()=>JSON.parse(canvasStore().assets[id].graph).nodes.length===1,'original text-node creation persists');
  await node.click();const enlarge=node.locator('._toolbar_16xzv_235 > ._toolbarBtnWrap_16xzv_250').nth(3);await enlarge.hover();await enlarge.getByText('放大编辑',{exact:true}).waitFor({state:'visible'});await enlarge.getByRole('button').click();
  const editor=canvas.locator('.markdown-editor-content[contenteditable="true"]');await editor.waitFor({state:'visible'});await editor.fill('OWNED_CANVAS_TEXT');await snapshot('05b-original-markdown-editor',canvas);await canvas.locator('[data-overlay-window]').filter({has:editor}).getByTitle('关闭',{exact:true}).click();await editor.waitFor({state:'hidden'});
  await poll(()=>JSON.parse(canvasStore().assets[id].graph).nodes.some(value=>JSON.stringify(value.data.textContent || []).includes('OWNED_CANVAS_TEXT')),'original full Markdown editor persists actual textContent');textEditingComplete=true;check('Original TextNode floating toolbar opens the real Markdown editor and closing it persists entered text',await node.getByText('OWNED_CANVAS_TEXT',{exact:true}).isVisible());
  await pane.click({position:{x:100,y:100}});
  const before=JSON.parse(canvasStore().assets[id].graph).nodes[0],handle=await node.locator('[class*="textNodeFloatingTitle"]').boundingBox();assert.ok(handle);
  await page.mouse.move(handle.x+handle.width*.5,handle.y+handle.height*.5);await page.mouse.down();await page.mouse.move(handle.x+handle.width*.5+96,handle.y+handle.height*.5+54,{steps:12});await page.mouse.up();
  await poll(()=>{const after=JSON.parse(canvasStore().assets[id].graph).nodes.find(value=>value.id===before.id);return after&&(after.position.x!==before.position.x||after.position.y!==before.position.y);},'real node pointer movement reaches persisted graph');
  const graph=JSON.parse(canvasStore().assets[id].graph);canvasSaved={id,name:'OWNED_CANVAS_PERSISTENCE',node:graph.nodes.find(value=>value.id===before.id)};
  check('Original node menu creates a text node and pointer movement saves through the real service',canvasSaved.node?.data.nodeType==='text'&&apiEvents.some(event=>event.path.startsWith('/codely-canvas/api/v1/assets/')&&['PUT','PATCH'].includes(event.method)&&event.status===200));
  await snapshot('06-original-canvas-persisted',canvas);
  await exerciseCanvasMedia(id);
}
async function exerciseCanvasMedia(id){
  const file=path.join(run,'owned-two-segment.webm');
  execFileSync('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=red:s=64x36:r=15:d=1','-f','lavfi','-i','color=c=blue:s=64x36:r=15:d=1','-filter_complex','[0:v][1:v]concat=n=2:v=1:a=0[v]','-map','[v]','-c:v','libvpx-vp9','-pix_fmt','yuv420p','-an',file],{windowsHide:true,timeout:30000});
  const pane=canvas.locator('.react-flow__pane');await pane.click({button:'right',position:await emptyCanvasPoint()});await canvas.getByRole('button',{name:'添加节点',exact:true}).click();const[chooser]=await Promise.all([page.waitForEvent('filechooser'),canvas.getByText('媒体上传',{exact:true}).click()]);await chooser.setFiles([provider.media.png.file,file]);
  let imageNode,videoNode;await poll(()=>{const graph=JSON.parse(canvasStore().assets[id].graph);imageNode=graph.nodes.find(value=>value.data.nodeType==='image'&&value.data.images?.length&&!value.data.uploading);videoNode=graph.nodes.find(value=>value.data.nodeType==='video'&&value.data.videos?.length&&!value.data.uploading);return !!(imageNode&&videoNode);},'original media upload persists actual image and video nodes');
  await canvas.getByRole('button',{name:'适应画布',exact:true}).click();const videoCard=canvas.locator('.react-flow__node[data-id="'+videoNode.id+'"]'),imageCard=canvas.locator('.react-flow__node[data-id="'+imageNode.id+'"]');
  await poll(()=>imageCard.locator('img').first().evaluate(image=>image.complete&&image.naturalWidth===48&&image.naturalHeight===32),'original uploaded image decoded');const video=videoCard.locator('video');await poll(()=>video.evaluate(value=>value.readyState>=2&&value.videoWidth===64&&value.videoHeight===36),'original uploaded two-segment video decoded');
  const firstPixels=await decodedPixels(video);assert.ok(firstPixels.center[0]>200&&firstPixels.center[2]<40,'The first segment is actually red');
  if(!await video.evaluate(value=>value.paused)){await videoCard.locator('[class*="controlBar_"] button').first().click();await poll(()=>video.evaluate(value=>value.paused),'original video player pauses');}
  const progress=videoCard.locator('[class*="progressBarWrap_"]'),box=await progress.boundingBox();assert.ok(box&&box.width>20);await progress.click({position:{x:box.width*.75,y:box.height*.5}});
  let secondPixels;await poll(async()=>{if(!await video.evaluate(value=>value.currentTime>1.25&&!value.seeking&&value.paused))return false;secondPixels=await decodedPixels(video);return secondPixels.center[2]>200&&secondPixels.center[0]<40;},'original time bar seeks the paused video into the blue second segment');
  await videoCard.getByRole('button',{name:'截取当前帧',exact:true}).click();let capture;await poll(()=>{const graph=JSON.parse(canvasStore().assets[id].graph);capture=graph.nodes.find(value=>value.data.label==='视频截帧'&&value.data.images?.length);return !!capture&&graph.edges.some(edge=>edge.source===videoNode.id&&edge.target===capture.id&&edge.type==='flowing');},'original jZ frame upload creates an image node and real flowing edge');
  for(const url of [imageNode.data.images[0],videoNode.data.videos[0],capture.data.images[0]])assert.ok(new URL(url,origin).pathname.startsWith('/api/codely-generator/local-inputs/'),'Persisted media references actual owned native inputs, never a transient blob or data URI');
  await canvas.getByRole('button',{name:'适应画布',exact:true}).click();const capturedImage=canvas.locator('.react-flow__node[data-id="'+capture.id+'"] img').first();await poll(()=>capturedImage.evaluate(image=>image.complete&&image.naturalWidth===64&&image.naturalHeight===36),'actual captured PNG decoded');const capturedPixels=await decodedPixels(capturedImage);
  check('Original media upload, video time bar and frame capture produce the blue second segment and persist its image plus flowing edge',capturedPixels.sha256===secondPixels.sha256&&capturedPixels.sha256!==firstPixels.sha256&&apiEvents.some(value=>value.path==='/codely-canvas/api/editor/upload/video'&&value.status>=200&&value.status<300));
  canvasSaved.media={imageNodeId:imageNode.id,videoNodeId:videoNode.id,captureNodeId:capture.id,imagePixels:await decodedPixels(imageCard.locator('img').first()),firstPixels,secondPixels,capturedPixels,videoSha256:sha(fs.readFileSync(file)),originalOrigin:new URL(origin).origin};await snapshot('06b-original-video-captured',canvas);
}
async function exerciseQuick(){
  await gui.getByRole('tab',{name:/^(快速生成|Quick Generate)$/}).click();
  for(const [mode,name] of [['3d',/^3D\s*生成$/],['audio',/^音乐音效$/],['video',/^视频生成$/]]){
    const tab=creator.getByRole('button',{name});await tab.click();await poll(()=>tab.getAttribute('aria-pressed').then(value=>value==='true'),'original '+mode+' mode becomes active');await creator.locator('.studio-model-select').click();await creator.locator('.studio-model-menu').waitFor({state:'visible'});assert.ok(await creator.locator('.studio-model-option').count()>0);await snapshot('07-original-mode-'+mode,creator);await creator.locator('body').press('Escape');await creator.locator('.studio-model-menu').waitFor({state:'hidden'});
  }
  await creator.getByRole('button',{name:/^2D\s*生成$/}).click();check('Original 3D, audio and video modes switch and expose their own real model menus',true);
  await creator.locator('.studio-model-select').click();await creator.locator('.studio-model-menu').waitFor({state:'visible'});await snapshot('07-original-model-menu',creator);
  await creator.locator('.studio-model-option').filter({has:creator.getByText('Seedream 5.0 Lite',{exact:true})}).click();check('Original model selector changes its active descriptor without a replacement form',(await creator.locator('.studio-model-select').textContent()).includes('Seedream 5.0 Lite'));
  const chip=creator.locator('.studio-param-chip').first(),before=await chip.textContent();await chip.click();const parameters=creator.locator('.studio-popover[data-state="open"]');await parameters.waitFor({state:'visible'});await snapshot('08-original-parameters',creator);await parameters.getByRole('button',{name:/^16:9\s/}).click();await creator.locator('body').press('Escape');check('Original model parameter controls change the selected aspect ratio',await chip.textContent()!==before);
  await creator.getByRole('button',{name:'手绘草图',exact:true}).click();const sketch=creator.locator('.studio-sketch-dialog');await sketch.waitFor({state:'visible'});await snapshot('09-original-sketch-open',creator);
  const drawing=sketch.locator('canvas').first();await drawing.waitFor({state:'visible'});await poll(()=>sketch.getByRole('button',{name:'画笔',exact:true}).isEnabled(),'original sketch tools ready');const empty=await drawing.evaluate(node=>node.toDataURL()),box=await drawing.boundingBox();assert.ok(box&&box.width>100&&box.height>100);
  await page.mouse.move(box.x+box.width*.25,box.y+box.height*.45);await page.mouse.down();await page.mouse.move(box.x+box.width*.62,box.y+box.height*.57,{steps:18});await page.mouse.up();await poll(()=>drawing.evaluate(node=>node.toDataURL()).then(value=>value!==empty),'original sketch paints actual pixels');const painted=await drawing.evaluate(node=>node.toDataURL());
  await sketch.getByRole('button',{name:'撤销',exact:true}).click();await poll(()=>drawing.evaluate(node=>node.toDataURL()).then(value=>value===empty),'original sketch Undo restores actual pixels');await sketch.getByRole('button',{name:'重做',exact:true}).click();await poll(()=>drawing.evaluate(node=>node.toDataURL()).then(value=>value===painted),'original sketch Redo restores actual stroke');
  check('Original kZ sketch paints pixels and Undo/Redo operate on the actual drawing',true);await snapshot('10-original-sketch-drawn',creator);const paintedPixels=await decodedPixels(drawing);await sketch.getByRole('button',{name:'保存到参考图',exact:true}).click();await sketch.waitFor({state:'hidden'});const reference=creator.locator('img[src*="/local-inputs/"]').first();await poll(()=>reference.evaluate(image=>image.complete&&image.naturalWidth>0),'original sketch upload reference actually decodes');const savedPixels=await decodedPixels(reference);referenceEvidence={paintedPixels,savedPixels,url:await reference.getAttribute('src')};check('Original sketch Save to Reference uploads and decodes the exact drawn pixels locally',savedPixels.sha256===paintedPixels.sha256&&apiEvents.some(value=>value.path==='/api/codely-generator/sso/upload/image'&&value.status>=200&&value.status<300));await snapshot('10b-original-sketch-reference',creator);
  const unavailable=await api('/api/codely-generator/sso/generate',{method:'POST',headers:{'X-GameCowork-Workspace':(await state()).workspaceKey},body:{kind:'seedream-lite',data:{prompt:'OWNED_NOT_MAPPED_MODEL_PROBE',size:'2048x2048',isSegmentation:false}}});
  check('Unmapped original model generation returns explicit 503 rather than invented success or a quota claim',unavailable.status===503&&unavailable.body.error==='generation_provider_not_configured'&&unavailable.body.supported===false);
}
async function exerciseHistory(){
  await openHistory();await history.getByRole('button',{name:'列表视图',exact:true}).click();await poll(()=>history.locator('.generation-list-row').count().then(count=>count===3),'original list view rows');await poll(async()=>(await api('/api/codely-generator/user/ui-prefs')).body.generationViewMode==='list','real saved list preference');
  await history.getByRole('button',{name:'宫格视图',exact:true}).click();await poll(()=>history.locator('.generation-card').count().then(count=>count===3),'original grid view cards');
  for(const [name,model] of [['图片','seedream-lite'],['视频','seedance2'],['3D 模型','tripo-p2']]){await history.getByRole('navigation',{name:'全部',exact:true}).getByRole('button',{name,exact:true}).click();await poll(async()=>await history.locator('.generation-card').count()===1&&(await history.locator('.generation-card').textContent()).includes(model),'original '+name+' filter returns its matching row');}
  await history.getByRole('navigation',{name:'全部',exact:true}).getByRole('button',{name:'全部',exact:true}).click();await poll(()=>history.locator('.generation-card').count().then(count=>count===3),'cleared category filter');
  check('Original History grid/list controls and category filters use actual owned task rows',true);
  for(const [kind,model] of [['image','seedream-lite'],['video','seedance2'],['model','tripo-p2']]){
    await history.locator('.generation-card').filter({hasText:model}).click();const dialog=history.getByRole('dialog');await dialog.waitFor({state:'visible'});
    if(kind==='image')await poll(()=>dialog.locator('img').evaluateAll(images=>images.some(image=>image.complete&&image.naturalWidth===48&&image.naturalHeight===32)),'original History actual PNG decoding');
    else if(kind==='video')await poll(()=>dialog.locator('video').evaluate(video=>video.readyState>=2&&video.videoWidth===32&&video.duration>1),'original History actual WebM decoding');
    else {await dialog.locator('[data-generation-model-viewer="glb"]').waitFor({state:'visible'});await poll(()=>dialog.locator('.generation-preview-badge b').textContent().then(value=>value==='1'),'original History actual GLB triangle decoded');}
    await snapshot('11-original-history-'+kind,history);await history.locator('body').press('Escape');await dialog.waitFor({state:'hidden'});
  }
  check('Original History details decode real PNG, WebM and GLB through native local media URLs',true);
  await exerciseHistoryTags();
  await history.getByRole('button',{name:'日期范围',exact:true}).click();const dates=history.locator('.generation-date-range-popover');await dates.getByRole('button',{name:'上个月',exact:true}).click();await dates.locator('[role="gridcell"]:not(.is-outside)').first().click();await dates.locator('[role="gridcell"]:not(.is-outside)').first().click();await poll(()=>history.locator('.generation-card').count().then(count=>count===0),'original date range excludes current tasks');await history.locator('.generation-date-range-clear').click();await poll(()=>history.locator('.generation-card').count().then(count=>count===3),'original date clear restores tasks');
  check('Original History date range filters real task timestamps and clears correctly',apiEvents.some(event=>event.path==='/api/codely-generator/tasks'&&event.query.includes('startTime=')));
  const imageCard=history.locator('.generation-card').filter({hasText:'seedream-lite'});await imageCard.getByRole('button',{name:'废弃',exact:true}).click();await poll(async()=>(await rpc('generator/getTask',{taskId:seeds.image.id})).task.discarded===true,'actual original discard persists');await poll(()=>history.locator('.generation-card').count().then(count=>count===2),'discarded original row hidden');
  await history.getByRole('button',{name:'已废弃',exact:true}).click();await history.locator('.generation-card').filter({hasText:'seedream-lite'}).getByRole('button',{name:'恢复',exact:true}).click();await poll(async()=>(await rpc('generator/getTask',{taskId:seeds.image.id})).task.discarded===false,'actual original restore persists');await history.getByRole('button',{name:/退出.*废弃|返回全部/}).click();await poll(()=>history.locator('.generation-card').count().then(count=>count===3),'restored original row shown');
  check('Original History discard/restore updates actual Core state without deleting media',true);await history.getByRole('button',{name:'列表视图',exact:true}).click();await poll(async()=>(await api('/api/codely-generator/user/ui-prefs')).body.generationViewMode==='list','saved original list preference before restart');
}
async function exerciseHistoryTags(){
  await history.getByRole('button',{name:'标签',exact:true}).click();await history.getByRole('button',{name:'管理标签',exact:true}).click();const manager=history.getByRole('dialog',{name:'管理标签',exact:true});await manager.waitFor({state:'visible'});await manager.getByRole('button',{name:'新建标签',exact:true}).click();await manager.getByLabel('标签名称',{exact:true}).fill('OWNED_HISTORY_TAG');await manager.getByRole('button',{name:'新建标签',exact:true}).click();
  await poll(async()=>!!(historyTag=(await api('/api/codely-generator/tags')).body.tags.find(value=>value.name==='OWNED_HISTORY_TAG')),'original tag editor creates actual persisted tag');await history.locator('body').press('Escape');await manager.waitFor({state:'hidden'});
  await history.locator('.generation-card').filter({hasText:'seedream-lite'}).click();await history.getByRole('dialog').getByRole('button',{name:'编辑标签',exact:true}).click();const editor=history.getByRole('dialog',{name:'编辑标签',exact:true});await editor.getByRole('checkbox',{name:'OWNED_HISTORY_TAG',exact:true}).check();await editor.getByRole('button',{name:'保存修改',exact:true}).click();await editor.waitFor({state:'hidden'});
  await poll(async()=>(await api('/api/codely-generator/task/'+seeds.image.id+'/status')).body.tags.some(value=>value.id===historyTag.id),'original task tag selection persists actual relationship');await history.locator('body').press('Escape');await history.getByRole('dialog').waitFor({state:'hidden'});
  await history.getByRole('button',{name:'标签',exact:true}).click();await history.locator('.generation-tag-facet').filter({hasText:'OWNED_HISTORY_TAG'}).click();await history.locator('body').press('Escape');await poll(()=>history.locator('.generation-card').count().then(count=>count===1),'original tag filter reduces history to assigned task');assert.ok((await history.locator('.generation-card').textContent()).includes('seedream-lite'));await snapshot('11-original-history-tag-filter',history);
  await history.getByRole('button',{name:'清除筛选',exact:true}).click();await poll(()=>history.locator('.generation-card').count().then(count=>count===3),'original tag clear restores history');check('Original tag editor, task assignment and tag filtering persist real relationships',true);
}
async function restartAndCheck(){
  const posts=provider.requests.filter(value=>value.method==='POST').length;await context.close();context=undefined;await stopShell();origin=await launch();await startBrowser();await openHistory();await poll(()=>history.locator('.generation-list-row').count().then(count=>count===3),'fresh browser restores view preference and persisted actual history');
  const tag=(await api('/api/codely-generator/task/'+seeds.image.id+'/status')).body.tags.find(value=>value.id===historyTag.id);assert.ok(tag);
  await openCanvas();await canvas.getByText(canvasSaved.name,{exact:true}).click();await canvas.locator('.react-flow__node').first().waitFor({state:'visible'});assert.ok(await canvas.locator('.react-flow__node').first().getByText('文本',{exact:true}).isVisible());assert.ok(await canvas.locator('.react-flow__node').first().getByText('OWNED_CANVAS_TEXT',{exact:true}).isVisible());
  const node=JSON.parse(canvasStore().assets[canvasSaved.id].graph).nodes.find(value=>value.id===canvasSaved.node.id);check('A new browser profile and restarted Rust/Core restore the actual graph, position, tag relationship and History preference without generating again',node.position.x===canvasSaved.node.position.x&&node.position.y===canvasSaved.node.position.y&&provider.requests.filter(value=>value.method==='POST').length===posts);await snapshot('12-original-canvas-restarted',canvas);
  await canvas.getByRole('button',{name:'适应画布',exact:true}).click();const image=canvas.locator('.react-flow__node[data-id="'+canvasSaved.media.imageNodeId+'"] img').first(),video=canvas.locator('.react-flow__node[data-id="'+canvasSaved.media.videoNodeId+'"] video'),capture=canvas.locator('.react-flow__node[data-id="'+canvasSaved.media.captureNodeId+'"] img').first();
  await poll(()=>image.evaluate(value=>value.complete&&value.naturalWidth===48),'restarted uploaded image decodes');await poll(()=>video.evaluate(value=>value.readyState>=2&&value.videoWidth===64),'restarted uploaded video decodes');await poll(()=>capture.evaluate(value=>value.complete&&value.naturalWidth===64),'restarted captured PNG decodes');
  check('Fresh-origin restart restores actual uploaded image/video and second-frame PNG pixels through rebased owned media URLs',(await decodedPixels(image)).sha256===canvasSaved.media.imagePixels.sha256&&(await decodedPixels(capture)).sha256===canvasSaved.media.capturedPixels.sha256&&(await decodedPixels(video)).sha256===canvasSaved.media.firstPixels.sha256&&await video.evaluate(value=>new URL(value.currentSrc||value.src).origin)===new URL(origin).origin);await snapshot('12b-original-canvas-media-restarted',canvas);
}


async function openOwnedCanvasInFrame(frame){
  // Workspace-aware original hosts may create/open their workspace canvas on
  // entry. Return through its original menu before selecting our shared graph.
  await poll(async()=>await frame.getByText(canvasSaved.name,{exact:true}).isVisible()||await frame.getByRole('button',{name:'返回',exact:true}).isVisible(),'original Canvas entry settles');
  if(await frame.getByRole('button',{name:'返回',exact:true}).isVisible()){await frame.getByRole('button',{name:'返回',exact:true}).click();await frame.getByRole('button',{name:'返回工作区',exact:true}).click();}
  await frame.getByText(canvasSaved.name,{exact:true}).click();
}
async function exerciseCanvasLeaseIsolation(){
  // This is the original client's optional query entry, not the default shell
  // layout. Navigate its real GUI URL; never inject Redux/React layout state.
  const flexibleUrl=new URL(gui.url());flexibleUrl.searchParams.set('flexibleLayout','1');await gui.goto(flexibleUrl.href,{waitUntil:'domcontentloaded'});
  await gui.getByRole('button',{name:/^(AI资产生成|AI 资产生成|AI Asset Generation)$/}).first().click();await openCanvas();await canvas.getByText(canvasSaved.name,{exact:true}).click();await canvas.locator('.react-flow__node').first().waitFor({state:'visible'});
  const first=canvas,firstId=frameId(first),id=canvasSaved.id,lockPath='/codely-canvas/api/v1/canvas-locks/'+id;
  const acquired=(frame,yes)=>leaseEvents.findLast(event=>event.path===lockPath+'/acquire'&&event.frameId===frame&&event.data?.acquired===yes);
  await poll(()=>!!acquired(firstId,true),'the existing Assets Canvas owns its real lease');const firstOwner=acquired(firstId,true).ownerHash;
  const selectChat=async()=>{await gui.locator('[data-telemetry-id="history_session"]').first().click();await gui.locator('main').getByText('Hello fixture',{exact:false}).waitFor({state:'visible'});await gui.locator('[data-telemetry-id="layout_mode_selector"]').waitFor({state:'visible'});};
  await selectChat();await gui.locator('[data-telemetry-id="layout_mode_selector"]').click();await snapshot('12c-original-flexible-layout-menu',gui);await gui.getByRole('menuitem',{name:'对话+画布',exact:true}).click();
  await poll(()=>gui.childFrames().some(frame=>frame!==first&&framePath(frame).startsWith('/codely-canvas/')),'normal chat layout mounts its own second Canvas document');
  let second=gui.childFrames().find(frame=>frame!==first&&framePath(frame).startsWith('/codely-canvas/'));const secondId=frameId(second);
  canvas=second;await openOwnedCanvasInFrame(second);await second.getByText('画布已在其他位置打开，请关闭后才能操作',{exact:true}).waitFor({state:'visible'});// Original NV/PV + BroadcastChannel guard blocks same-host owners before HTTP.
  // Use the actual second document owner already observed opening its workspace
  // canvas for a separate native negative probe, without altering either UI.
  const secondOwner=sha(frameOwners.get(second));const ownSession=await api('/codely-canvas/api/local/session');
  const denied=await api(lockPath+'/acquire',{method:'POST',headers:{Authorization:'Bearer '+ownSession.body.session.id},body:{session_id:frameOwners.get(second),force:false}});assert.equal(denied.status,200);assert.equal(denied.body.data.acquired,false);
  check('Original optional flexible chat-plus-canvas layout preserves the hidden Assets iframe and denies its distinct second document editing owner',!first.isDetached()&&gui.childFrames().filter(frame=>framePath(frame).startsWith('/codely-canvas/')).length===2&&!!firstOwner&&!!secondOwner&&firstOwner!==secondOwner);
  leaseEvidence={entry:'original-client-optional-flexibleLayout=1',defaultLayout:false,firstFrame:firstId,secondFrame:secondId,firstOwnerHash:firstOwner,secondOwnerHash:secondOwner,originalClientBlockedBeforeHttp:true,nativeNegativeProbe:{status:denied.status,acquired:denied.body.data.acquired}};canvas=second;await snapshot('13-original-two-canvas-lease-conflict',second);
  await gui.getByRole('button',{name:/^(AI资产生成|AI 资产生成|AI Asset Generation)$/}).first().click();await first.getByRole('button',{name:'返回',exact:true}).click();await first.getByRole('button',{name:'返回工作区',exact:true}).click();await first.getByRole('button',{name:'新建无限画布',exact:true}).waitFor({state:'visible'});
  await poll(()=>leaseEvents.some(event=>event.path===lockPath&&event.method==='DELETE'&&event.ownerHash===firstOwner&&event.status===200),'original Return to Workspace releases the first lease');
  leaseEvidence.secondDocumentSurvivesAssetNavigation=!second.isDetached();await selectChat();
  // The original Assets navigation selects chat-only. Reopen the optional
  // column through its actual menu when that navigation detached the document.
  if(!gui.childFrames().some(frame=>frame!==first&&framePath(frame).startsWith('/codely-canvas/'))){
    await gui.locator('[data-telemetry-id="layout_mode_selector"]').click();
    await gui.getByRole('menuitem',{name:'对话+画布',exact:true}).click();
  }
  await poll(()=>gui.childFrames().some(frame=>frame!==first&&framePath(frame).startsWith('/codely-canvas/')),'chat Canvas returns after original first-owner release');
  second=gui.childFrames().find(frame=>frame!==first&&framePath(frame).startsWith('/codely-canvas/'));canvas=second;const resumedId=frameId(second);
  if(await second.getByRole('button',{name:'重试',exact:true}).isVisible())await second.getByRole('button',{name:'重试',exact:true}).click();
  else await openOwnedCanvasInFrame(second);
  await poll(()=>!!acquired(resumedId,true),'chat Canvas acquires after original first-owner release');await second.getByText('画布已在其他位置打开，请关闭后才能操作',{exact:true}).waitFor({state:'hidden'});leaseEvidence.resumedFrame=resumedId;leaseEvidence.resumedOwnerHash=acquired(resumedId,true).ownerHash;
  const node=second.locator('.react-flow__node[data-id="'+canvasSaved.node.id+'"]');await node.click();const enlarge=node.locator('._toolbar_16xzv_235 > ._toolbarBtnWrap_16xzv_250').nth(3);await enlarge.hover();await enlarge.getByRole('button').click();const editor=second.locator('.markdown-editor-content[contenteditable="true"]');await editor.fill('OWNED_CANVAS_SECOND_DOCUMENT');await second.locator('[data-overlay-window]').filter({has:editor}).getByTitle('关闭',{exact:true}).click();
  await poll(()=>JSON.parse(canvasStore().assets[id].graph).nodes.some(value=>JSON.stringify(value.data.textContent||[]).includes('OWNED_CANVAS_SECOND_DOCUMENT')),'the newly acquired document really saves updated text');
  check('Original Return to Workspace releases the first lease and the chat Canvas takes ownership and saves real text',leaseEvidence.resumedOwnerHash!==firstOwner&&await node.getByText('OWNED_CANVAS_SECOND_DOCUMENT',{exact:true}).isVisible());await snapshot('14-original-second-canvas-saved',second);
  await gui.getByRole('button',{name:/^(AI资产生成|AI 资产生成|AI Asset Generation)$/}).first().click();await first.getByText(canvasSaved.name,{exact:true}).click();canvas=first;
  // Navigation may naturally unmount the chat column. Preserve that lifecycle fact
  // instead of mutating its React tree or forcing a hidden iframe to stay mounted.
  if(!second.isDetached()){
    await first.getByText('画布已在其他位置打开，请关闭后才能操作',{exact:true}).waitFor({state:'visible'});leaseEvidence.oldDocumentBlocked=true;
  }else{
    await first.locator('.react-flow__node[data-id="'+canvasSaved.node.id+'"]').getByText('OWNED_CANVAS_SECOND_DOCUMENT',{exact:true}).waitFor({state:'visible'});leaseEvidence.oldDocumentReloadedLatest=true;
  }
  check('Revisiting the original Assets document cannot overwrite the second document saved graph',JSON.parse(canvasStore().assets[id].graph).nodes.some(value=>JSON.stringify(value.data.textContent||[]).includes('OWNED_CANVAS_SECOND_DOCUMENT'))&&(leaseEvidence.oldDocumentBlocked||leaseEvidence.oldDocumentReloadedLatest));await snapshot('15-original-lease-lifecycle',first);
}

try {
  origin=await launch();await startBrowser();
  const session=await api('/api/codely-generator/local-session'),quota=await api('/api/codely-generator/credit/my-credits'),sso=await api('/api/codely-generator/editor/sso/bootstrap');
  check('Actual identity is explicitly GameCowork local while original quota and SSO remain unavailable',session.status===200&&session.body.mode==='gamecowork-local'&&session.body.user.accountMode==='local'&&quota.status===503&&quota.body.currentCredits===null&&sso.status===401);
  await creator.locator('.studio-topbar-tabs').waitFor({state:'visible',timeout:30000});
  for(const name of [/^2D\s*生成$/,/^3D\s*生成$/,/^音乐音效$/,/^视频生成$/])assert.ok(await creator.getByRole('button',{name}).isVisible());
  check('Real two-level GUI mounts the original three Host tabs and four Quick Generate modes',await gui.getByRole('tab').count()===3&&new URL(creator.url()).origin===new URL(origin).origin&&new URL(creator.url()).searchParams.get('gamecoworkWorkspace')===(await state()).workspaceKey);
  const unavailableButton=creator.getByRole('button',{name:'服务未配置',exact:true});await unavailableButton.waitFor({state:'visible'});check('Original Quick button honestly shows the local service is unconfigured without an official subscription claim',await unavailableButton.isDisabled()&&await creator.getByText('此模型尚未连接生成服务',{exact:true}).isVisible()&&await creator.getByText('需付费订阅',{exact:true}).count()===0);
  if(downloadOnly){await exerciseDownloads();check('Original download clients avoid external traffic, browser fallback and fatal errors',external.length===0&&browserDownloads.length===0&&pageErrors.length===0);}
  else if(cpaOnly){await exerciseCpaQuick();check('Preserved CPA client uses no external request and produces no fatal browser error',external.length===0&&pageErrors.length===0);}
  else {
  await snapshot('01-original-quick',creator);await seedHistory();if(!inspect)await prepareOwnedChat();await openHistory();await poll(()=>history.locator('.generation-card,.generation-list-row').count().then(count=>count===3),'three actual original History rows');await snapshot('02-original-history',history);
  await openCanvas();await snapshot('03-original-canvas-home',canvas);
  if(!inspect){
    await exerciseCanvas();await exerciseQuick();await exerciseHistory();await restartAndCheck();
    if(process.argv.includes('--flexible-layout'))await exerciseCanvasLeaseIsolation();
    else { const sidebar=await probeDefaultSidebarCanvas({gui,page,poll,snapshot,canvasStore,canvasSaved,check,api});canvas=sidebar.canvas;sidebarLeaseEvidence=sidebar.evidence; }
    check('Preserved clients use no external request and produce no fatal browser error',external.length===0&&pageErrors.length===0);
  }
  }
} catch(error) {failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error.stack);if(page){await snapshot('failure',canvas||history||creator||gui).catch(()=>{});if(gui)fs.writeFileSync(path.join(run,'failure-gui.aria.txt'),await gui.locator('body').ariaSnapshot().catch(()=>''));}}
finally {await context?.close();await Promise.allSettled(responseReads);await stopShell();await provider.close();await chatProvider.close();fs.writeFileSync(path.join(run,'shell.log'),shellLog);fs.writeFileSync(path.join(run,'result.json'),JSON.stringify({passed:!failure,fullInteractionValidation:!inspect&&!failure&&(downloadOnly?!!downloadEvidence?.restart:cpaOnly?!!cpaEvidence:textEditingComplete),previous,packaged,inspect,binary,binarySha256,checks,failure,pageErrors,external,apiEvents,leaseEvents,leaseEvidence,sidebarLeaseEvidence,graphEvents,actors,ownProcessesExited:actors.every(actor=>actor.exited&&actor.gone),artifacts,seedTasks:seeds,cpaOnly,cpaEvidence,downloadOnly,downloadEvidence,downloadEvents,browserDownloads,canvasSaved,historyTag,referenceEvidence,textEditingComplete,chatRequests:chatProvider.requests,realCore:true,realProvider:false,originalComponentSourceReused:true,originalModelGenerationMapped:false,expectedGenerateUnavailable:503,remainingOriginalTextEditorEntry:!textEditingComplete},null,2));console.log('Artifacts: '+run);}
