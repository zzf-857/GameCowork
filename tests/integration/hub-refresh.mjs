// Actual Rust HTTP host and existing discovery adapter, isolated Core snapshot.
// Never starts an Editor, accesses a real Hub registry, or activates a license.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const run = path.join('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests', 'hub-refresh-' + randomUUID());
const binary = path.resolve(option('--binary', path.join(repo, 'src/shell/target/debug/GameCowork.exe')));
const frontend = path.resolve(option('--frontend', path.join(repo, 'src/frontend/bundle')));
fs.mkdirSync(run, { recursive: true });
const project = path.join(run, 'projects', 'Owned project');
const settings = path.join(project, 'ProjectSettings');
fs.mkdirSync(settings, { recursive: true });
fs.mkdirSync(path.join(project, 'Assets'));
const version = path.join(settings, 'ProjectVersion.txt');
fs.writeFileSync(version, 'm_EditorVersion: 6000.0.1f1\n');
const editorFixture = path.join(run, 'fake-editor', 'Unity.exe');
fs.mkdirSync(path.dirname(editorFixture), { recursive: true });
fs.writeFileSync(editorFixture, 'OWNED EDITOR METADATA FIXTURE - NEVER EXECUTED\n', { flag: 'wx' });
const snapshot = path.join(run, 'hub-snapshot.json');
const writeSnapshot = value => fs.writeFileSync(snapshot, JSON.stringify(value));
const snapshotFor = technical => [{ product: 'unity', projects: [{ path: project, editor_version: technical }],
  editors: [{ path: editorFixture, version: technical }] }];
writeSnapshot(snapshotFor('6000.0.1f1'));
const child = spawn(binary, [], { cwd: run, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: {
  ...process.env, GAMECOWORK_APP_ROOT: run, GAMECOWORK_DATA_DIR: path.join(run, 'app-data'),
  GAMECOWORK_CORE_DIR: path.join(repo, 'tests'), GAMECOWORK_CORE_ENTRY: path.join(repo, 'tests/fixtures/core-fixture.mjs'),
  GAMECOWORK_FRONTEND_DIR: frontend, GAMECOWORK_HEADLESS: '1', GAMECOWORK_TEST_MODE: '1',
  GAMECOWORK_FIXTURE_DATA_DIR: run, GAMECOWORK_FIXTURE_HUB_SNAPSHOT: snapshot,
  GAMECOWORK_FIXTURE_LOG: path.join(run, 'core-frames.jsonl'),
} });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let base, output = '', failure, browser;
for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => {
  output += bytes.toString(); base ||= output.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1];
});
const checks = [];
const external = [], pageErrors = [], screenshots = [];
const check = (name, fn) => { fn(); checks.push(name); };
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function rpc(messageType, data = {}) {
  const result = await fetch(base + '/api/tauri/invoke', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageType, messageId: randomUUID(), data }), signal: AbortSignal.timeout(10000) });
  assert.equal(result.status, 200); return (await result.json()).data;
}
const content = result => { assert.equal(result.status, 'success', JSON.stringify(result)); return result.content; };
const list = async data => content(await rpc('tjhub/getRecentProjects', data));
async function browserAudit() {
  let module;
  try { module = createRequire(import.meta.url).resolve('playwright'); }
  catch {
    const cache = path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'npm-cache/_npx');
    module = fs.readdirSync(cache).map(value => path.join(cache, value, 'node_modules/playwright/index.mjs')).find(value => fs.existsSync(value));
  }
  assert.ok(module, 'A cached Playwright module is required');
  const cache = path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'ms-playwright');
  const chrome = fs.readdirSync(cache).filter(value => /^chromium-\d+$/.test(value)).sort((a,b) => +b.split('-')[1] - +a.split('-')[1])
    .flatMap(value => ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe'].map(file => path.join(cache, value, file))).find(value => fs.existsSync(value));
  assert.ok(chrome, 'A cached Chromium is required');
  const { chromium } = await import(pathToFileURL(module).href);
  browser = await chromium.launchPersistentContext(path.join(run, 'browser'), { executablePath: chrome, headless: true,
    viewport: {width: 1440, height: 960}, locale: 'zh-CN', colorScheme: 'dark', serviceWorkers: 'block' });
  const refreshes = [];
  await browser.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/tauri/invoke') {
      let body; try { body = route.request().postDataJSON(); body = body.message || body; } catch {}
      if (body?.messageType === 'tjhub/getRecentProjects' && body.data?.refresh === true) refreshes.push(body);
    }
    if (url.hostname === '127.0.0.1' || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
    external.push(url.origin); return route.abort('blockedbyclient');
  });
  if (args.includes('--previous')) await browser.route('**/gui.html*', route => route.fulfill({ contentType: 'text/html',
    body: fs.readFileSync(path.join(frontend, 'gui.html'), 'utf8')
      .replaceAll('index-BRxZ4eG7.js', 'index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js', 'VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js', 'store-0rGrUshb.js') }));
  await browser.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ''; });
  const page = browser.pages()[0] || await browser.newPage();
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto(base, {waitUntil: 'domcontentloaded'});
  const deadline = Date.now() + 30000;
  while (!page.frames().some(value => value.url().includes('/gui.html'))) { assert.ok(Date.now() < deadline); await delay(50); }
  const gui = page.frames().find(value => value.url().includes('/gui.html'));
  const next = gui.getByRole('button', {name: /^(下一步|Next|知道了|Got it)$/});
  await next.first().waitFor({state:'visible',timeout:4000}).catch(() => {});
  for (let i=0; i<4 && await next.count() && await next.first().isVisible(); i++) await next.first().click();
  await gui.getByText(/^(项目|Projects)$/).first().click();
  const status = gui.getByTestId('gamecowork-project-status');
  await status.filter({hasText:'检测到编辑器锁文件'}).waitFor({state:'visible'});
  async function capture(name) {
    const file = path.join(run, name + '.png');
    await page.screenshot({path:file,fullPage:true,animations:'disabled'}); screenshots.push(file);
    fs.writeFileSync(path.join(run,name+'.aria.txt'),await gui.locator('body').ariaSnapshot());
  }
  await capture('01-lock-presence');
  const moved = path.join(run,'projects','Browser moved project'); fs.renameSync(project,moved);
  await gui.getByTestId('gamecowork-projects-refresh').click();
  await status.filter({hasText:'项目目录不可用'}).waitFor({state:'visible'});
  await capture('02-missing-project');
  const favorite=gui.getByTestId('gamecowork-project-row').filter({hasText:'Owned project'}).getByTestId('gamecowork-project-favorite');
  async function favoriteState(expected) {const end=Date.now()+10000;while(await favorite.getAttribute('aria-pressed')!==String(expected)){assert.ok(Date.now()<end,'actual persisted favorite reaches UI');await delay(20);}}
  await favorite.click();await favoriteState(false);
  const offline=(await list()).find(row=>row.title==='Owned project');
  check('Real GUI can unfavorite an offline registered project without recreating its directory',()=>{
    assert.equal(offline.isFavorite,false);assert.equal(offline.pathExists,false);assert.equal(fs.existsSync(project),false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(run,'app-data/workspaces.json'),'utf8')).records.find(record=>record.workspace.workspaceDir.replaceAll('\\','/').toLowerCase()===project.replaceAll('\\','/').toLowerCase()).isFavorite,false);
  });
  await favorite.click();await favoriteState(true);
  fs.renameSync(moved,project);
  fs.unlinkSync(path.join(project,'Temp','UnityLockfile'));
  fs.writeFileSync(version,Buffer.alloc(1024*1024+1,120));
  await gui.getByTestId('gamecowork-projects-refresh').click();
  await status.filter({hasText:'项目元数据不可用'}).waitFor({state:'visible'});
  await capture('03-invalid-metadata');
  const invalidBytes=sha(version);await favorite.click();await favoriteState(false);await favorite.click();await favoriteState(true);
  check('Real GUI can change favorites while project metadata is invalid without rewriting that file',()=>{assert.equal(sha(version),invalidBytes);});
  fs.writeFileSync(version,'m_EditorVersion: 2022.3.62t16\nm_TuanjieEditorVersion: 1.10.4\n');
  await gui.getByTestId('gamecowork-projects-refresh').click();
  await status.waitFor({state:'detached'});
  assert.equal(refreshes.length,3);
  check('Real GUI refresh updates lock, missing directory, invalid metadata and recovery without dropping the project', () => {
    assert.equal(pageErrors.length,0); assert.equal(external.length,0);
  });
  await capture('04-restored-project');
  const other = path.join(run,'projects','Z initially newer project');
  fs.mkdirSync(path.join(other,'ProjectSettings'),{recursive:true});fs.mkdirSync(path.join(other,'Assets'));
  const otherVersion=path.join(other,'ProjectSettings','ProjectVersion.txt');fs.writeFileSync(otherVersion,'m_EditorVersion: 6000.0.1f1\n');
  const asset=path.join(project,'Assets','existing.cs'),otherAsset=path.join(other,'Assets','existing.cs');
  fs.writeFileSync(asset,'old content');fs.writeFileSync(otherAsset,'newer content');
  const old=new Date('2030-01-01T00:00:00Z'),newer=new Date('2031-01-01T00:00:00Z'),latest=new Date('2032-01-01T00:00:00Z');
  for(const file of [project,version,other,otherVersion,asset])fs.utimesSync(file,old,old);fs.utimesSync(otherAsset,newer,newer);
  writeSnapshot([{product:'unity',editors:[],projects:[{path:project,editor_version:'2022.3.62t16'},{path:other,editor_version:'6000.0.1f1'}]}]);
  const titles=gui.getByText(/^(Owned project|Z initially newer project)$/);
  async function waitOrder(expected) {const end=Date.now()+10000;while(JSON.stringify(await titles.allTextContents())!==JSON.stringify(expected)){assert.ok(Date.now()<end,'actual project title order');await delay(20);}}
  await gui.getByTestId('gamecowork-projects-refresh').click();await waitOrder(['Z initially newer project','Owned project']);
  const rootMtime=fs.statSync(project).mtimeMs,versionMtime=fs.statSync(version).mtimeMs;
  fs.writeFileSync(asset,'modified existing asset');fs.utimesSync(asset,latest,latest);
  await gui.getByTestId('gamecowork-projects-refresh').click();await waitOrder(['Owned project','Z initially newer project']);
  check('Real GUI sorts the actually changed asset project first without root/version or registration edits',()=>{
    assert.equal(fs.statSync(project).mtimeMs,rootMtime);assert.equal(fs.statSync(version).mtimeMs,versionMtime);
    assert.equal(pageErrors.length,0);assert.equal(external.length,0);
  });
  const latestRows=await list();check('HTTP project ordering agrees with actual content recency and declares scan scope',()=>{
    assert.equal(latestRows[0].title,'Owned project');assert.equal(latestRows[0].lastModifiedUnixMs,latest.getTime());
    assert.equal(latestRows[0].recencyScope,'assets-packages-project-settings-file-metadata');assert.equal(latestRows[0].scanIncomplete,false);
  });
  await capture('05-live-asset-recency-order');
}
try {
  const deadline = Date.now() + 15000;
  while (!base) { assert.ok(Date.now() < deadline && child.exitCode === null, output); await delay(50); }
  const first = content(await rpc('tjhub/getEditors'));
  check('Initial Editor identity comes from the existing Core adapter', () => assert.equal(Object.values(first)[0].version, '6000.0.1f1'));
  writeSnapshot(snapshotFor('6000.1.2f1'));
  const cached = content(await rpc('tjhub/getEditors'));
  check('Passive reads reuse the bounded Hub cache', () => assert.deepEqual(cached, first));
  const fresh = content(await rpc('tjhub/getEditors', { refresh: true }));
  check('Explicit refresh observes the new Editor version before cache expiry', () => assert.equal(Object.values(fresh)[0].version, '6000.1.2f1'));
  const invalid = await rpc('tjhub/getEditors', { refresh: 'true' });
  check('Malformed refresh is rejected instead of triggering discovery', () => { assert.equal(invalid.status, 'error'); assert.match(invalid.error, /boolean/); });
  content(await rpc('tjhub/addProject', { projectPath: project }));
  content(await rpc('tjhub/toggleFavorite', { projectPath: project, isFavorite: true }));
  const registration = path.join(run, 'app-data', 'workspaces.json');
  const registrationSha = sha(registration);
  for(const isFavorite of [null,'false',1]){const result=await rpc('tjhub/toggleFavorite',{projectPath:project,isFavorite});assert.equal(result.status,'error');assert.match(result.error,/boolean/);}
  check('Malformed favorite values are rejected without silently clearing the saved preference',()=>{assert.equal(sha(registration),registrationSha);});
  fs.writeFileSync(version, 'm_EditorVersion: 2022.3.62t16\nm_TuanjieEditorVersion: 1.10.4\n');
  let row = (await list()).find(value => value.isFavorite);
  check('Project listing reads current technical and marketing versions', () => {
    assert.equal(row.version, '2022.3.62t16'); assert.equal(row.editorVersion, row.version);
    assert.equal(row.semver, '1.10.4'); assert.equal(row.product, 'tuanjie'); assert.equal(row.pathExists, true);
  });
  const lockDir = path.join(project, 'Temp'); fs.mkdirSync(lockDir);
  fs.writeFileSync(path.join(lockDir, 'UnityLockfile'), 'fixture left after an Editor crash');
  row = (await list()).find(value => value.isFavorite);
  check('A leftover lock is disclosed without claiming an Editor connection', () => { assert.equal(row.lockFilePresent, true); assert.equal(row.editorConnected, undefined); });
  const moved = path.join(run, 'projects', 'Moved project');
  fs.renameSync(project, moved);
  row = (await list()).find(value => value.isFavorite);
  check('A missing project keeps its favorite and registration with an explicit warning', () => {
    assert.equal(row.pathExists, false); assert.match(row.metadataWarning, /path_not_found/); assert.equal(row.isFavorite, true);
  });
  const unfavorite=content(await rpc('tjhub/toggleFavorite',{projectPath:project,isFavorite:false}));
  check('Offline registered preference can be changed without filesystem inspection succeeding',()=>{assert.equal(unfavorite.isFavorite,false);assert.equal(unfavorite.pathExists,false);assert.equal(fs.existsSync(project),false);});
  content(await rpc('tjhub/toggleFavorite',{projectPath:project,isFavorite:true}));
  fs.renameSync(moved, project);
  row = (await list()).find(value => value.isFavorite);
  check('Restored directory is detected without adding a duplicate record', () => { assert.equal(row.pathExists, true); assert.equal(row.metadataWarning, null); });
  writeSnapshot([]);
  const retainedEditors = content(await rpc('tjhub/getEditors'));
  content(await rpc('tjhub/getRecentProjects', { refresh: true }));
  const independentEditors = content(await rpc('tjhub/getEditors'));
  check('Project refresh retains the independent installed Editor snapshot', () => assert.deepEqual(independentEditors, retainedEditors));
  const emptyEditors = content(await rpc('tjhub/getEditors', {refresh:true}));
  check('Explicit Editor refresh discovers actual removed installations', () => assert.deepEqual(emptyEditors, {}));
  const licensing = content(await rpc('tjhub/getLicenses'));
  check('Local workspace permission is distinct from undetected Unity and Tuanjie licenses', () => {
    assert.equal(licensing.workspaceAllowed, true); assert.equal(licensing.isValid, null); assert.equal(licensing.editorLicenseValid, null);
    assert.deepEqual(licensing.editorScopes.map(value => value.scope), ['unity-editor', 'tuanjie-editor']);
  });
  for (const type of ['activateLicense', 'activatePersonalLicense', 'generateLicenseRequest', 'importLicenseFile', 'returnLicense', 'updateServerConfig']) {
    const result = await rpc('tjhub/' + type, { filePath: 'must-not-open', serialNumber: 'fixture' });
    assert.equal(result.status, 'error'); assert.match(result.error, /official Unity Hub/);
  }
  const frames = fs.readFileSync(path.join(run, 'core-frames.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  check('License mutations never reach Core and listings never rewrite the registry', () => {
    assert.ok(!frames.some(value => /tjhub\/(activate|generateLicense|importLicense|returnLicense|updateServer)/.test(value.frame?.messageType || '')));
    assert.equal(sha(registration), registrationSha);
  });
  if (args.includes('--browser')) {
    await browserAudit();
    assert.equal(sha(registration), registrationSha, 'Browser refresh is read-only for the registry');
  }
} catch (error) { failure = error; }
finally {
  if (browser) await browser.close();
  if (child.exitCode === null && child.signalCode === null) {
    if (process.platform === 'win32') execFileSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'pipe' });
    else child.kill('SIGTERM');
    for (let i = 0; i < 100 && child.exitCode === null && child.signalCode === null; i++) await delay(50);
  }
  fs.writeFileSync(path.join(run, 'shell.log'), output);
  fs.writeFileSync(path.join(run, 'result.json'), JSON.stringify({ binary, frontend, checks, previous:args.includes('--previous'), external, pageErrors, screenshots,
    failure: failure?.stack, shellExited: child.exitCode !== null || child.signalCode !== null }, null, 2));
}
if (failure) throw failure;
console.log(JSON.stringify({ passed: checks.length, run }));
