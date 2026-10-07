// Actual Rust HTTP + owned Core discovery barriers + persisted restart state.
// All executables are inert fixture files; no real Hub, Editor or license APIs.
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process'; import { randomUUID, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module'; import { pathToFileURL } from 'node:url'; import os from 'node:os';
import { dismissToastStack } from '../support/dismiss-toast-stack.mjs';
const repo = fileURLToPath(new URL('../../', import.meta.url));
const option = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const binary = path.resolve(option('--binary', path.join(repo, 'src/shell/target/debug/GameCowork.exe')));
const frontend = path.resolve(option('--frontend', path.join(repo, 'src/frontend/bundle'))), previous = process.argv.includes('--previous');
const run = path.join('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests', 'editor-installations-cache-' + randomUUID());
const data = path.join(run, 'app-data'), diskFile = path.join(data, 'installed-editors.json');
const snapshotFile = path.join(run, 'snapshot.json'), controlFile = path.join(run, 'discovery-control.json'), logFile = path.join(run, 'discovery-events.jsonl');
const exe = path.join(run, 'install/Editor/Unity.exe');
fs.mkdirSync(path.dirname(exe), { recursive: true }); fs.writeFileSync(exe, 'owned inert installation; never executed');
let child, base, failure, output = '', stopped = true, events = [], eventTask, eventAbort, browser; const checks = [], actors = [], exitedActors = new Set(), pageErrors=[], external=[], screenshots=[];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const logs = () => fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
const count = () => logs().filter(row => row.event === 'scan-start').length;
const check = (label, condition) => { assert.ok(condition, label); checks.push(label); console.log('PASS ' + label); };
let browserProject = null;
const rows = version => [{ product: 'unity', projects: browserProject ? [{path:browserProject,editor_version:'6000.5.6f1'}] : [], editors: [{ path: exe, version }] }];
function control(version, extra = {}) { fs.writeFileSync(snapshotFile, JSON.stringify(version === null ? [] : rows(version))); fs.writeFileSync(controlFile, JSON.stringify({ snapshotFile, ...extra })); }
const firstVersion = value => Object.values(value.editors)[0]?.version;
async function rpc(kind, data = {}) {
  const response = await fetch(base + '/api/tauri/invoke', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageType: kind, messageId: randomUUID(), data }), signal: AbortSignal.timeout(25000) });
  assert.equal(response.status, 200); return (await response.json()).data;
}
function content(value) { assert.equal(value.status, 'success', JSON.stringify(value)); return value.content; }
const list = async value => content(await rpc('tjhub/getEditorInstallations', value));
async function until(test, label, budget = 10000) { const end = Date.now() + budget; while (!await test()) { assert.ok(Date.now() < end && child?.exitCode === null, label + '\n' + output); await delay(20); } }
async function start() {
  const env = { ...process.env, GAMECOWORK_APP_ROOT: run, GAMECOWORK_DATA_DIR: data,
    GAMECOWORK_CORE_DIR: path.join(repo, 'tests'), GAMECOWORK_CORE_ENTRY: path.join(repo, 'tests/fixtures/editor-installations-cache-core.mjs'),
    GAMECOWORK_FRONTEND_DIR: frontend, GAMECOWORK_HEADLESS: '1', GAMECOWORK_TEST_MODE: '1', GAMECOWORK_FIXTURE_DATA_DIR: run };
  child = spawn(binary, [], { cwd: run, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env }); actors.push(child.pid); stopped = false; base = null;
  for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => { output += bytes.toString(); base ||= bytes.toString().match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1]; });
  await until(() => !!base, 'Own shell HTTP ready');
  eventAbort = new AbortController();
  const response = await fetch(base + '/api/tauri/events', { signal: eventAbort.signal }); assert.equal(response.status, 200);
  eventTask = (async () => { const reader = response.body.getReader(); let carry = ''; try { for (;;) { const part = await reader.read(); if (part.done) break; carry += new TextDecoder().decode(part.value); let at; while ((at = carry.indexOf('\n\n')) >= 0) { const block = carry.slice(0, at); carry = carry.slice(at + 2); const text = block.split('\n').find(line => line.startsWith('data:'))?.slice(5).trim(); if (text) { const value = JSON.parse(text); if (value.messageType === 'tjhub/editorInstallationsChanged') events.push(value.data); } } } } catch (error) { if (!eventAbort.signal.aborted) throw error; } finally { reader.releaseLock(); } })();
}
async function stop() {
  eventAbort?.abort(); await eventTask;
  if (child?.exitCode === null && child?.signalCode === null) {
    if (process.platform === 'win32') execFileSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'pipe' }); else child.kill('SIGTERM');
    await until(() => child.exitCode !== null || child.signalCode !== null, 'Own shell exits');
  }
  if (child && (child.exitCode !== null || child.signalCode !== null)) exitedActors.add(child.pid);
  stopped = true;
}
async function freshEvent(version, from) { await until(() => events.slice(from).some(value => !value.cache.refreshing && firstVersion(value) === version && !value.cache.error), 'Actual completed cache SSE'); return events.slice(from).find(value => !value.cache.refreshing && firstVersion(value) === version && !value.cache.error); }
async function browserAudit() {
  let module;
  try { module=createRequire(import.meta.url).resolve('playwright'); }
  catch { const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),'npm-cache/_npx');module=fs.readdirSync(cache).map(value=>path.join(cache,value,'node_modules/playwright/index.mjs')).find(fs.existsSync); }
  const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),'ms-playwright');
  const chrome=fs.readdirSync(cache).filter(value=>/^chromium-\d+$/.test(value)).sort((a,b)=>+b.split('-')[1]-+a.split('-')[1]).flatMap(value=>['chrome-win64/chrome.exe','chrome-win/chrome.exe'].map(file=>path.join(cache,value,file))).find(fs.existsSync);
  assert.ok(module&&chrome,'Existing cached Playwright/Chromium required');const {chromium}=await import(pathToFileURL(module).href);
  const requests=[];
  async function open(label, installed = true) {
    browser=await chromium.launchPersistentContext(path.join(run,'browser-'+label),{executablePath:chrome,headless:true,viewport:{width:1440,height:960},locale:'zh-CN',colorScheme:'dark',serviceWorkers:'block'});
    await browser.route('**/*',async route=>{const request=route.request(),url=new URL(request.url());if(url.pathname==='/api/tauri/invoke'){try{let body=request.postDataJSON();body=body.message||body;if(body)requests.push(body);}catch{}}if(url.hostname==='127.0.0.1'||['data:','blob:'].includes(url.protocol))return route.continue();external.push(url.origin);return route.abort('blockedbyclient');});
    if(previous)await browser.route('**/gui.html*',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(frontend,'gui.html'),'utf8').replaceAll('index-BRxZ4eG7.js','index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js','store-0rGrUshb.js')}));
    await browser.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.workspacePaths=[];window.vscMediaUrl='';});const page=browser.pages()[0]||await browser.newPage();page.on('pageerror',error=>pageErrors.push(String(error)));
    await page.goto(base,{waitUntil:'domcontentloaded'});await until(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'Real GUI frame');const gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
    const next=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/});await next.first().waitFor({state:'visible',timeout:2000}).catch(()=>{});for(let i=0;i<4&&await next.count()&&await next.first().isVisible();i++)await next.first().click();
    await gui.getByText(/^(项目|Projects)$/).first().click();if(installed)await gui.getByTestId('gamecowork-editor-installations-entry').click();return {page,gui};
  }
  async function capture(view,label){const file=path.join(run,label+'.png');await view.page.screenshot({path:file,fullPage:true,animations:'disabled'});screenshots.push(file);fs.writeFileSync(path.join(run,label+'.aria.txt'),await view.gui.locator('body').ariaSnapshot());}
  await stop();browserProject=path.join(run,'Owned cache project');fs.mkdirSync(path.join(browserProject,'ProjectSettings'),{recursive:true});fs.mkdirSync(path.join(browserProject,'Assets'));fs.writeFileSync(path.join(browserProject,'ProjectSettings','ProjectVersion.txt'),'m_EditorVersion: 6000.5.6f1\n');
  const gate=path.join(run,'gui-projects-release');control('6000.5.6f1',{projectBarrierFile:gate});const warmScans=count();await start();let view=await open('first');
  const cachedRow=view.gui.getByTestId('gamecowork-editor-row').filter({has:view.gui.locator('[data-testid="gamecowork-editor-display-version"]',{hasText:'6000.4.5f1'})});await cachedRow.waitFor({state:'visible',timeout:10000});
  check('Real restarted GUI shows cached Editor while the project discovery barrier is still held',!fs.existsSync(gate)&&await cachedRow.count()===1&&requests.some(row=>row.messageType==='tjhub/getEditorInstallations'&&row.data?.refresh===false)&&!requests.some(row=>row.messageType==='tjhub/getEditorInstallations'&&row.data?.refresh===true));
  await capture(view,'01-cached-first-display');check('Warm GUI project loading does not start any installed Editor discovery',count()===warmScans);fs.writeFileSync(gate,'release actual project scan');await until(()=>logs().some(row=>row.event==='projects-finished'),'Separate project scan completes');check('Project completion preserves the fresh installed cache without rescanning',count()===warmScans&&await cachedRow.isVisible());await browser.close();browser=null;await stop();
  const stale=JSON.parse(fs.readFileSync(diskFile,'utf8'));stale.checkedAt=Date.now()-15*60*1000+10000;fs.writeFileSync(diskFile,JSON.stringify(stale));const editorGate=path.join(run,'gui-editors-release');control('6000.5.6f1',{barrierFile:editorGate});await start();view=await open('expired',false);const projectRow=view.gui.getByTestId('gamecowork-project-row').filter({hasText:'Owned cache project'});await projectRow.waitFor({state:'visible'});check('Mounted project page initially reuses a still-valid Editor cache before its near expiry',count()===warmScans&&Date.now()<stale.checkedAt+15*60*1000);await until(()=>count()===warmScans+1,'Mounted project page expiry starts exactly one passive Editor scan',15000);check('Expired project GUI does not claim its new version installed before discovery',!fs.existsSync(editorGate)&&await projectRow.getAttribute('data-editor-installed')==='false');fs.writeFileSync(editorGate,'release actual Editor scan');await until(async()=>await projectRow.getAttribute('data-editor-installed')==='true','Project page receives actual installed Editor event');check('Mounted project page updates Editor availability from real Changed event without a remount or forced scan',count()===warmScans+1&&!requests.some(row=>row.messageType==='tjhub/getEditorInstallations'&&row.data?.refresh===true));await capture(view,'01b-project-background-editor-update');await view.gui.getByTestId('gamecowork-editor-installations-entry').click();const freshRow=view.gui.locator('[data-testid="gamecowork-editor-row"][data-editor-version="6000.5.6f1"]');await freshRow.waitFor({state:'visible',timeout:12000});
  check('Real Changed event replaces cached version after background discovery without forced pane scan',await freshRow.count()===1&&!requests.some(row=>row.messageType==='tjhub/getEditorInstallations'&&row.data?.refresh===true));
  await dismissToastStack(view.gui,until);const beforeProjects=requests.filter(row=>row.messageType==='tjhub/getRecentProjects').length;control('6000.7.8f1',{fail:true});await view.gui.getByTestId('gamecowork-editors-refresh').click();await view.gui.getByTestId('gamecowork-editors-error').waitFor({state:'visible'});
  check('Real GUI failed explicit scan keeps actual old rows and enables retry',await freshRow.isVisible()&&await view.gui.getByTestId('gamecowork-editors-retry').isEnabled()&&requests.filter(row=>row.messageType==='tjhub/getRecentProjects').length===beforeProjects);
  await capture(view,'02-failed-scan-retains-rows');control('6000.7.8f1');await view.gui.getByTestId('gamecowork-editors-retry').click();await view.gui.locator('[data-testid="gamecowork-editor-row"][data-editor-version="6000.7.8f1"]').waitFor({state:'visible'});
  check('Real GUI explicit retry recovers with new installed version',await view.gui.getByTestId('gamecowork-editors-error').count()===0);await capture(view,'03-explicit-retry');await browser.close();browser=null;
  await stop();const again=path.join(run,'gui-restart-release');control('6000.7.8f1',{projectBarrierFile:again});const recoveredScans=count();await start();const restarted=await open('second');await restarted.gui.locator('[data-testid="gamecowork-editor-row"][data-editor-version="6000.7.8f1"]').waitFor({state:'visible'});
  check('Second real host/browser restart reuses the recovered persisted installation without installed discovery',!fs.existsSync(again)&&count()===recoveredScans);await capture(restarted,'04-second-restart');fs.writeFileSync(again,'release own fixture');await browser.close();browser=null;
  check((previous?'Previous':'Current')+' real cache UI has no browser errors or outside network calls',pageErrors.length===0&&external.length===0);
}
try {
  control('6000.0.1f1'); await start(); const initial = await list();
  check('Initial actual HTTP discovery writes a fresh bounded snapshot', firstVersion(initial) === '6000.0.1f1' && initial.cache.source === 'scan' && initial.cache.stale === false && initial.cache.checkedAt > 0 && fs.existsSync(diskFile));
  await stop(); const previousScans = count(); await start(); const cached = await list();
  check('Restart shows persisted installation without another Core scan', firstVersion(cached) === '6000.0.1f1' && cached.cache.source === 'persistent-cache' && !cached.cache.stale && count() === previousScans);
  content(await rpc('tjhub/getRecentProjects',{refresh:true}));
  check('Project refresh uses separate Core discovery without rescanning or invalidating fresh installed Editors',count()===previousScans && firstVersion(await list())==='6000.0.1f1' && logs().some(row=>row.event==='projects-start'));
  const legacy = content(await rpc('tjhub/getEditors'));
  check('Legacy getEditors remains an installation map and reuses the persistent fast path', Object.values(legacy)[0].version === '6000.0.1f1' && !Object.hasOwn(legacy, 'cache') && count() === previousScans);
  const invalid = await rpc('tjhub/getEditorInstallations', { refresh: 'true' });
  check('Invalid refresh is rejected before any discovery', invalid.status === 'error' && /boolean/.test(invalid.error) && count() === previousScans);
  const gate = path.join(run, 'explicit-release'); control('6000.1.2f1', { barrierFile: gate }); const from = events.length;
  let resolved = false; const one = list({ refresh: true }).then(value => { resolved = true; return value; });
  await until(() => count() === previousScans + 1, 'Actual explicit Core scan reaches barrier');
  const two = list({ refresh: true }); const retained = await list();
  check('A held explicit scan leaves cached installation available without a skeleton', firstVersion(retained) === '6000.0.1f1' && retained.cache.refreshing && !resolved);
  fs.writeFileSync(gate, 'release own barrier'); const [fresh, joined] = await Promise.all([one, two]);
  check('Concurrent explicit refreshes share one real scan and publish actual updated rows', firstVersion(fresh) === '6000.1.2f1' && firstVersion(joined) === firstVersion(fresh) && count() === previousScans + 1 && !fresh.cache.stale);
  const finished = await freshEvent('6000.1.2f1', from);
  check('Background state event preserves the same installed DTO and honest completion metadata', finished.cache.source === 'scan' && finished.cache.checkedAt === fresh.cache.checkedAt && !finished.cache.refreshing);
  await stop(); const expiredDisk = JSON.parse(fs.readFileSync(diskFile, 'utf8')); expiredDisk.checkedAt = 0; fs.writeFileSync(diskFile, JSON.stringify(expiredDisk));
  const expiredGate = path.join(run, 'expired-release'); control('6000.2.3f1', { barrierFile: expiredGate }); await start(); const expiredFrom = events.length; const expired = await list();
  check('Expired restart returns stale snapshot immediately while its real scan is held', firstVersion(expired) === '6000.1.2f1' && expired.cache.stale && expired.cache.refreshing && expired.cache.checkedAt === 0);
  fs.writeFileSync(expiredGate, 'release own barrier'); const renewed = await freshEvent('6000.2.3f1', expiredFrom);
  check('Expired cache discovers a new installation version and persists it', !renewed.cache.stale && JSON.parse(fs.readFileSync(diskFile, 'utf8')).checkedAt > 0);
  const oldDisk = fs.readFileSync(diskFile); control('6000.9.9f1', { fail: true }); const failed = await rpc('tjhub/getEditorInstallations', { refresh: true }); const fallback = await list();
  check('Failed explicit scan returns failure while old rows/timestamp/disk remain available and stale', failed.status === 'error' && firstVersion(fallback) === '6000.2.3f1' && fallback.cache.stale && /Owned discovery failure/.test(fallback.cache.error) && fs.readFileSync(diskFile).equals(oldDisk));
  control('6000.3.4f1'); const recovered = await list({ refresh: true });
  check('Explicit retry bypasses passive cooldown and recovers the actual updated snapshot', firstVersion(recovered) === '6000.3.4f1' && !recovered.cache.stale && !recovered.cache.error);
  await stop(); fs.unlinkSync(exe); const missingGate = path.join(run, 'missing-release'); control(null, { barrierFile: missingGate }); await start(); const missingFrom = events.length; const missing = await list();
  check('Changed installation identity is disclosed on cached first display before scanning', firstVersion(missing) === '6000.3.4f1' && Object.values(missing.editors)[0].installationAvailable === false && missing.cache.identityChanged && missing.cache.stale);
  fs.writeFileSync(missingGate, 'release own barrier'); await until(() => events.slice(missingFrom).some(value => !value.cache.refreshing && !value.cache.error && Object.keys(value.editors).length === 0), 'Actual empty discovery');
  check('Confirmed removal replaces the old row with a real empty snapshot', Object.keys((await list()).editors).length === 0);
  await stop(); const emptyScans = count(); await start(); const empty = await list();
  check('A confirmed empty snapshot survives restart without repeated scanning', empty.cache.hasSnapshot && !empty.cache.stale && Object.keys(empty.editors).length === 0 && count() === emptyScans);
  await stop(); fs.writeFileSync(exe, 'own fixture executable recreated'); fs.writeFileSync(diskFile, 'invalid cache'); control('6000.4.5f1'); await start();
  const repaired = await list(); check('Corrupt persisted cache does not block startup and real discovery repairs it', firstVersion(repaired) === '6000.4.5f1' && repaired.cache.source === 'scan' && !repaired.cache.error);
  if(process.argv.includes('--browser'))await browserAudit();
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error.stack); }
finally {
  if(browser)await browser.close().catch(()=>{});
  if (!stopped) await stop().catch(error => { failure ||= { message: error.message, stack: error.stack }; process.exitCode = 1; });
  const fixtureRecords = logs().filter(row => row.event === 'started');
  const fixtureActors = fixtureRecords.map(row => row.pid); const ownActors = [...new Set([...actors, ...fixtureActors])];
  // The OS may reuse a PID after an observed child exit. Never mistake another
  // concurrent test's browser/Core for the process we originally started.
  const candidates = ownActors.filter(pid => (!exitedActors.has(pid) || fixtureActors.includes(pid)) && (() => { try { process.kill(pid, 0); return true; } catch { return false; } })());
  let activeRecords = null, identityProbeError = null;
  if (process.platform === 'win32' && candidates.length) {
    try {
      assert.ok(candidates.every(pid=>Number.isInteger(pid)&&pid>0));
      const filter=candidates.map(pid=>'ProcessId='+pid).join(' OR ');
      const raw=execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`Get-CimInstance Win32_Process -Filter '${filter}' | Select-Object ProcessId,ParentProcessId,ExecutablePath,CommandLine | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true,timeout:10000}).trim();
      const records=raw?JSON.parse(raw):[];activeRecords=Array.isArray(records)?records:[records];
    } catch(error) { identityProbeError=error.message; }
  }
  const reusedPids=[];
  const entry=path.join(repo,'tests/fixtures/editor-installations-cache-core.mjs').replaceAll('\\','/').toLowerCase();
  const survivors=candidates.filter(pid=>{
    if(!activeRecords)return true;
    const actual=activeRecords.find(record=>record.ProcessId===pid);if(!actual)return false;
    const expected=fixtureRecords.filter(record=>record.pid===pid);
    if(expected.length && (!expected.some(record=>record.parentPid===actual.ParentProcessId) || typeof actual.CommandLine==='string' && actual.CommandLine.length>0 && !actual.CommandLine.replaceAll('\\','/').toLowerCase().includes(entry))) {
      reusedPids.push({pid,parentPid:actual.ParentProcessId,executablePath:actual.ExecutablePath});return false;
    }
    return true;
  });
  if (survivors.length) { failure ||= { message: 'Owned cache test actors remain: ' + survivors.join(',') }; process.exitCode = 1; }
  fs.writeFileSync(path.join(run, 'shell.log'), output); fs.writeFileSync(path.join(run, 'events.json'), JSON.stringify(events, null, 2));
  fs.writeFileSync(path.join(run, 'summary.json'), JSON.stringify({ passed: !failure, checks, failure, binary, binarySha256: sha(binary),
    ownedActors: ownActors, observedShellExits:[...exitedActors], reusedPids, identityProbeError, survivors, discoveryCalls: count(), previous, screenshots, pageErrors, external, editorStarted: false, providerInvoked: false, realHubRegistryAccessed: false }, null, 2)); console.log('Artifacts: ' + run);
}
