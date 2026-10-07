// Actual Rust/Core/original GUI against a local official protocol fixture.
// All 43 contracts run through HTTP/cache; four categories also use the GUI.
// No production account, key or quota is used. Both network boundaries deny WAN.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
const require = createRequire(import.meta.url), root = fileURLToPath(new URL('../../', import.meta.url));
const { MODELS, minimalPayload, referenceSlots } = require('../../src/core/binary/out/modules/generation/models/official-catalog.js');
const args = process.argv.slice(2), option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const temp = path.resolve(root, 'codelyreversebackup/work'), run = path.resolve(option('--output', path.join(temp, 'all-models-' + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep)); fs.mkdirSync(run, { recursive: true });
const packaged = args.includes('--packaged'), previous = args.includes('--previous'), app = path.resolve(option('--app-root', path.join(root, 'app')));
const binary = path.resolve(option('--binary', packaged ? path.join(app, 'GameCowork.exe') : path.join(root, 'src/shell/target/debug/GameCowork.exe')));
const core = path.resolve(option('--core', packaged ? path.join(app, 'core') : path.join(root, 'src/core/binary/out')));
const frontend = path.resolve(option('--frontend', packaged ? path.join(app, 'frontend') : path.join(root, 'src/frontend/bundle')));
const runtime = path.resolve(option('--runtime', path.join(root, 'app/core/gamecowork-runtime.exe')));
const agent = path.resolve(option('--agent', path.join(temp, 'cli-official-programming-20261003-v3/gamecowork.exe')));
const agentManifest = JSON.parse(fs.readFileSync(path.join(path.dirname(agent), 'cli-package-manifest.json'), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(agentManifest.testGuardIncluded, true, 'Only a guarded test Agent is allowed');
assert.equal(agentManifest.sourceSha256.toLowerCase(), sha(fs.readFileSync(path.join(root, 'src/agent/cli-main.beautified.js'))));
const guard = path.join(root, 'tests/fixtures/codely-account-network-guard.cjs'), guardLog = path.join(run, 'network-guard.jsonl'), guardId = randomUUID();
const choices = path.join(run, 'download-choices.json'); fs.writeFileSync(choices, '[]');
const media = createOwnedGenerationMedia(path.join(run, 'media'));
const wav = Buffer.alloc(44 + 16000 * 2); wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(16000, 24); wav.writeUInt32LE(32000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(wav.length - 44, 40);
for (let i = 0; i < 16000; i++) wav.writeInt16LE(Math.round(Math.sin(i * Math.PI * 440 / 8000) * 1200), 44 + i * 2);
media.wav = { bytes: wav, mimeType: 'audio/wav', extension: 'wav', fileName: 'owned.wav', sha256: sha(wav) };
// A complete ordinary EXR with its real raw HALF pixel blocks, not a bare header.
const int = value => { const row = Buffer.alloc(4); row.writeInt32LE(value); return row; }, flt = value => { const row = Buffer.alloc(4); row.writeFloatLE(value); return row; };
const attr = (name, type, bytes) => Buffer.concat([Buffer.from(name + '\0' + type + '\0'), int(bytes.length), bytes]);
const exrHead = Buffer.alloc(8); exrHead.writeUInt32LE(20000630); exrHead.writeUInt32LE(2, 4);
const box = Buffer.concat([int(0), int(0), int(3), int(1)]);
const exrHeader = Buffer.concat([exrHead, attr('channels', 'chlist', Buffer.concat(['B', 'G', 'R'].map(name => Buffer.concat([Buffer.from(name + '\0'), int(1), Buffer.alloc(4), int(1), int(1)])).concat([Buffer.from([0])]))), attr('compression', 'compression', Buffer.from([0])), attr('dataWindow', 'box2i', box), attr('displayWindow', 'box2i', box), attr('lineOrder', 'lineOrder', Buffer.from([0])), attr('pixelAspectRatio', 'float', flt(1)), attr('screenWindowCenter', 'v2f', Buffer.alloc(8)), attr('screenWindowWidth', 'float', flt(1)), Buffer.from([0])]);
const exrTable = Buffer.alloc(16), exrChunks = [0, 1].map(y => Buffer.concat([int(y), int(24), Buffer.alloc(24)])); exrTable.writeBigUInt64LE(BigInt(exrHeader.length + 16)); exrTable.writeBigUInt64LE(BigInt(exrHeader.length + 48), 8);
const exr = Buffer.concat([exrHeader, exrTable, ...exrChunks]); media.exr = { bytes: exr, mimeType: 'image/x-exr', extension: 'exr', fileName: 'owned.exr', sha256: sha(exr) };
const access = 'e2e-main-' + randomUUID(), refresh = 'e2e-refresh-' + randomUUID();
const state = { creates: [], quotes: [], uploads: [], tasks: new Map(), errors: [], historyReads: [], historyMode: 'full', badRecoveryMedia: true }, checks = [], summaries = [], recoveryChecks = [];
let fixture, fixtureOrigin, shell, shellLog = '', origin, browser, page, gui, quick, corePid, hostPid;
function outputFor(id, data) {
  const url = extension => fixtureOrigin + '/media/owned.' + extension;
  if(data.prompt==='OWNED_MEDIA_RESUME_FIXTURE')return {imageUrl:fixtureOrigin+'/media/recovery.png'};
  if (id === 'seedream-layer') return { imageUrl: url('png'), layers: Array.from({ length: 16 }, (_, i) => ({ url: url('png') + '?layer=' + i, zIndex: i + 1, name: 'Owned layer ' + (i + 1), description: 'Isolated layer fixture', boundingBox: { x: 0, y: 0, width: 48, height: 32 } })) };
  if (id === 'qwen-layer') return { imageUrl: url('png'), layers: Array.from({ length: data.numLayers }, (_, i) => ({ url: url('png') + '?qwen=' + i, zIndex: i, name: 'Layer ' + i })) };
  if (id === 'flare-skybox') return { skybox_basic: url('png'), skybox_high: url('png') + '?high', exrUrl: url('exr'), depthUrl: url('png') + '?depth' };
  if (id === 'skybox') return { skybox_basic: url('png'), skybox_high: url('png') + '?high' };
  if (MODELS[id].kind === 'image') return { imageUrl: url('png') };
  if (MODELS[id].kind === 'model') return { glb_url: url('glb'), previewUrl: url('png') };
  if (MODELS[id].kind === 'video') return { videoUrl: url('mp4') };
  if (MODELS[id].kind === 'audio') return { audioUrl: url('wav') };
  return id === 'minimax-voice' ? { voiceId: 'owned-voice-id', text: '音色 ID：owned-voice-id' } : { text: 'An isolated blue cube on a white background.' };
}
async function startFixture() {
  fixture = http.createServer(async (request, response) => {
    const send = (body, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(body)); };
    try {
      const target = new URL(request.url, fixtureOrigin), chunks = []; for await (const chunk of request) chunks.push(chunk); const bytes = Buffer.concat(chunks);
      const body = /^application\/json/.test(request.headers['content-type'] || '') ? JSON.parse(bytes.toString() || '{}') : {};
      if (target.pathname === '/auth/device/initiate') return send({ auth_request_token: 'owned-request', user_code: 'TEST-CODE', verification_uri: fixtureOrigin + '/auth/device/verify', verification_uri_complete: fixtureOrigin + '/auth/device/verify?user_code=TEST-CODE', expires_in: 600, interval: 1 });
      if (target.pathname === '/auth/device/poll') return send({ status: 'authorized', authorization_code: 'owned-code' });
      if (target.pathname === '/auth/device/exchange' || target.pathname === '/auth/refresh') return send({ access_token: access, refresh_token: refresh, expires_in: 3600 });
      if (target.pathname === '/auth/external/me') return send({ id: 64002, username: 'Owned All Models Pro' });
      if (target.pathname === '/api/teams') return send({ teams: [{ team_id: 'owned-team', team_name: 'Owned Pro', is_current: true }], current_team_id: 'owned-team' });
      if (target.pathname === '/api/user/plan') return send({ plan_type: 'pro', is_active: true, has_seat: true });
      if (target.pathname === '/api/user/usage/summary') return send({ remaining_points: '1000', is_exhausted: false, details: [] });
      if (target.pathname === '/api/user/usage/exhaustion') return send({ is_exhausted: false });
      if (target.pathname === '/api/editor/sso/bootstrap') { response.writeHead(200, { 'Content-Type': 'application/json', 'Set-Cookie': ['gen_sid=owned-session; Path=/; HttpOnly', '_csrf=owned-csrf; Path=/'] }); return response.end(JSON.stringify({ id: 64002, name: 'Owned All Models Pro' })); }
      if (target.pathname === '/api/user/me') return send({ id: 64002, name: 'Owned All Models Pro', role: 'user' });
      if (target.pathname === '/api/credit/my-credits') return send({ currentCredits: 100000 });
      if (target.pathname === '/api/credit/my-paid-status') return send({ paidType: 'paid', productCode: 'fixture-pro' });
      if (target.pathname === '/api/credit/cost-preview') { state.quotes.push(Object.fromEntries(target.searchParams)); return send({ credits: 1 }); }
      if(target.pathname==='/api/tasks') {
        assert.equal(request.method,'GET');assert.equal(request.headers.authorization,'Bearer '+access);
        assert.equal(target.searchParams.get('historyScope'),'self');assert.equal(target.searchParams.get('excludeBase64'),'true');
        const start=Date.parse(target.searchParams.get('startTime')),end=Date.parse(target.searchParams.get('endTime'));
        assert.ok(Number.isFinite(start)&&Number.isFinite(end)&&start<end&&end-start<=125000);
        const page=Number(target.searchParams.get('page')),pageSize=Number(target.searchParams.get('pageSize'));assert.equal(pageSize,100);assert.ok(page>=1&&page<=3);
        state.historyReads.push({method:request.method,page,historyScope:'self',boundedWindowMs:end-start});
        if(state.historyMode==='empty')return send({tasks:[],total:0});
        const rows=[...state.tasks].filter(([,task])=>Date.parse(task.createdTime)>=start&&Date.parse(task.createdTime)<=end).map(([id,task])=>({id,type:task.kind,category:MODELS[task.kind].mode,createdTime:task.createdTime,input:{data:task.data}}));
        if(state.historyMode==='incomplete') {
          const matched=rows.find(row=>row.id===state.unknownRemoteId);assert.ok(matched);
          const padding=Array.from({length:299},(_,index)=>({id:'owned-history-padding-'+index,type:'frontier',category:'image',createdTime:matched.createdTime,input:{data:minimalPayload('frontier')}}));
          return send({tasks:[matched,...padding].slice((page-1)*100,page*100),total:301});
        }
        return send({tasks:rows.slice((page-1)*pageSize,page*pageSize),total:rows.length});
      }
      if (/^\/api\/sso\/upload\/(image|video|audio|model|model-conversion)$/.test(target.pathname)) {
        assert.equal(request.headers.authorization, 'Bearer ' + access); assert.equal(request.headers['x-csrf-token'], 'owned-csrf');
        const form = await new Response(bytes, { headers: { 'Content-Type': request.headers['content-type'] } }).formData();
        const files = [...form.entries()].filter(([, value]) => typeof value !== 'string'); assert.equal(files.length, 1);
        const file = files[0][1], raw = Buffer.from(await file.arrayBuffer()); state.uploads.push({ kind: target.pathname.split('/').at(-1), sha256: sha(raw), byteLength: raw.length });
        return send({ url: fixtureOrigin + '/uploaded/' + state.uploads.length + '/' + encodeURIComponent(file.name) });
      }
      if (target.pathname === '/api/sso/generate') {
        assert.equal(request.headers.authorization, 'Bearer ' + access); assert.equal(request.headers['x-csrf-token'], 'owned-csrf');
        assert.ok(Object.hasOwn(MODELS, body.kind)); state.creates.push(body); const id = 'owned-generation-' + state.creates.length;
        state.tasks.set(id, { ...body, polls: 0,createdTime:new Date().toISOString() });
        if(body.data.prompt==='OWNED_HTTP_RECONCILE_UNKNOWN'){state.unknownRemoteId=id;return send({error:'Owned fixture retained a task but the create response failed'},400);}
        return send({ taskId: id, status: 'queued' });
      }
      const taskId = target.pathname.match(/^\/api\/task\/(owned-generation-\d+)\/status$/)?.[1];
      if (taskId) { const task = state.tasks.get(taskId); assert.ok(task); task.polls++; return send({ id: taskId, status: 'completed', output: { data: outputFor(task.kind, task.data) } }); }
      if(target.pathname==='/media/recovery.png'){assert.equal(request.headers.authorization,undefined);assert.equal(request.headers.cookie,undefined);const bytes=state.badRecoveryMedia?Buffer.from('invalid PNG media fixture'):media.png.bytes;response.writeHead(200,{'Content-Type':'image/png','Content-Length':bytes.length});return response.end(bytes);}
      if (target.pathname.startsWith('/media/owned.')) { assert.equal(request.headers.authorization, undefined); assert.equal(request.headers.cookie, undefined); const row = media[target.pathname.split('.').at(-1)]; assert.ok(row); response.writeHead(200, { 'Content-Type': row.mimeType, 'Content-Length': row.bytes.length }); return response.end(row.bytes); }
      return send({ error: 'Isolated fixture unsupported route: ' + target.pathname }, 404);
    } catch (error) { state.errors.push(error.message); send({ error: error.message }, 500); }
  });
  await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve)); fixtureOrigin = 'http://127.0.0.1:' + fixture.address().port;
}
async function poll(read, label, timeout = 45000) { const deadline = Date.now() + timeout; while (!await read()) { assert.ok(Date.now() < deadline, 'Timed out: ' + label); await new Promise(resolve => setTimeout(resolve, 100)); } }
function gone(pid) { if (!pid) return true; try { process.kill(pid, 0); return false; } catch (error) { return error.code === 'ESRCH'; } }
function records() { return fs.existsSync(guardLog) ? fs.readFileSync(guardLog, 'utf8').split('\n').filter(Boolean).map(row => JSON.parse(row)).filter(row => row.runId === guardId) : []; }
function environment() { const value = { ...process.env }; for (const key of Object.keys(value)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|CODELY_|GAMECOWORK_)/.test(key) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key) || key === 'NODE_OPTIONS') delete value[key]; return value; }
async function launch() {
  shell = spawn(binary, [], { cwd: run, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...environment(), GAMECOWORK_APP_ROOT: run, GAMECOWORK_CORE_DIR: path.dirname(runtime), GAMECOWORK_CORE_ENTRY: path.join(core, 'index.js'), GAMECOWORK_FRONTEND_DIR: frontend, GAMECOWORK_DATA_DIR: path.join(run, 'data'), GAMECOWORK_USER_DATA_DIR: path.join(run, 'data/core-state'), CONTINUE_GLOBAL_DIR: path.join(run, 'core-home'), GAMECOWORK_CLI_HOME: path.join(run, 'cli-home'), GAMECOWORK_CLI_BIN: agent, GAMECOWORK_HEADLESS: '1', GAMECOWORK_TEST_MODE: '1', GAMECOWORK_DISABLE_AUTO_UPDATE: '1', GAMECOWORK_TEST_DOWNLOAD_CHOICES: choices, GAMECOWORK_CODELY_ACCOUNT_DIR: path.join(run, 'data/codely-account'), GAMECOWORK_CODELY_ACCOUNT_BASE_URL: fixtureOrigin, GAMECOWORK_E2E_GUARD_LOG: guardLog, GAMECOWORK_E2E_GUARD_RUN_ID: guardId, NODE_OPTIONS: '--require ' + JSON.stringify(guard) } });
  hostPid=shell.pid;
  shell.stdout.on('data', bytes => { shellLog += bytes; const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+)\//); if (match) origin = match[1]; }); shell.stderr.on('data', bytes => { shellLog += bytes; });
  await poll(() => { assert.equal(shell.exitCode, null, shellLog); return !!origin; }, 'owned host');
  await poll(() => records().some(row => row.event === 'initialized' && row.parentPid === shell.pid), 'real owned guarded Core');
  corePid = records().find(row => row.event === 'initialized' && row.parentPid === shell.pid).pid;
}
async function rpc(type, data = {}) { const messageId = randomUUID(), response = await fetch(origin + '/api/tauri/invoke', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageType: type, messageId, data }) }); assert.equal(response.status, 200); const row = await response.json(); assert.equal(row.messageId, messageId); assert.equal(row.data?.status, 'success', JSON.stringify(row.data)); return row.data.content; }
async function api(route, body, scope = '') { const response = await fetch(origin + '/api/codely-generator' + route, body === undefined ? {} : { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'X-GameCowork-Workspace': scope }, body: JSON.stringify(body) }); const value = await response.json(); assert.equal(response.status, 200, route + ': ' + JSON.stringify(value)); return value; }
async function upload(kind, row) { const form = new FormData(); form.append(kind, new Blob([row.bytes], { type: row.mimeType }), row.fileName); const response = await fetch(origin + '/api/codely-generator/sso/upload/' + kind, { method: 'POST', headers: { Origin: origin, 'X-GameCowork-Workspace': '' }, body: form }); const value = await response.json(); assert.equal(response.status, 200, JSON.stringify(value)); assert.equal(typeof value.url, 'string'); return value.url; }
async function completed(id) { let task; await poll(async () => { task = await api('/task/' + id + '/status'); assert.ok(!['failed', 'interrupted'].includes(task.status), JSON.stringify(task)); return task.status === 'completed'; }, id + ' actual complete cache', 120000); return task; }
async function verifyArtifacts(task) {
  assert.ok(task.output.data.artifacts.length > 0, 'No synthetic completion without artifacts');
  for (const row of task.output.data.artifacts) { assert.ok(row.url.startsWith(origin + '/api/codely-generator/local-artifacts/')); const response = await fetch(row.url); assert.equal(response.status, 200, task.type + ': ' + row.mime + ' ' + row.url); const bytes = Buffer.from(await response.arrayBuffer()); assert.equal(sha(bytes), row.sha256); assert.equal(bytes.length, row.byteLength); if (row.mime === 'text/plain') assert.ok(bytes.toString('utf8').trim()); else assert.ok(Object.values(media).some(media => media.sha256 === row.sha256)); }
}
async function recoveryHttpChecks(created) {
  const stable=created.find(row=>row.id==='frontier-lite'),before=state.creates.length;
  const resumed=await api('/task/'+stable.localId+'/resume',{});assert.equal(resumed.resumed,false);assert.equal(resumed.createRepeated,false);assert.equal(state.creates.length,before);
  recoveryChecks.push('Completed owned task resume is a no-op and never creates again');
  const rejected=async(route,{scope,body={}}={})=>{
    const historyBefore=state.historyReads.length,createBefore=state.creates.length;
    const response=await fetch(origin+'/api/codely-generator'+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(scope!==undefined?{'X-GameCowork-Workspace':scope}:{})},body:JSON.stringify(body)});
    const value=await response.json();assert.ok(response.status>=400,JSON.stringify(value));assert.equal(state.creates.length,createBefore);assert.equal(state.historyReads.length,historyBefore);return{status:response.status,value};
  };
  for(const action of ['resume','reconcile']) {
    const missing=await rejected('/task/'+stable.localId+'/'+action);assert.equal(missing.status,400);assert.equal(missing.value.error,'workspace_scope_required');
    await rejected('/task/'+stable.localId+'/'+action,{scope:'foreign-closed-workspace'});
    await rejected('/task/not-an-owned-local-task/'+action,{scope:'',body:{remoteId:'invented-remote-id'}});
  }
  recoveryChecks.push('Missing, foreign and invented local task recovery scopes fail in actual Rust HTTP before cloud history or create');
  const parameters={...minimalPayload('frontier-lite'),prompt:'OWNED_MEDIA_RESUME_FIXTURE'};
  const failed=await api('/sso/generate',{kind:'frontier-lite',data:parameters});let failedTask;
  await poll(async()=>{failedTask=await api('/task/'+failed.taskId+'/status');return failedTask.status==='failed';},'actual invalid media cache failure');
  const failedCache=await rpc('generator/getTask',{taskId:failed.taskId});assert.equal(typeof failedCache.task.officialTaskId,'string');assert.equal(failedCache.task.artifacts.length,0);
  const remote=state.tasks.get(failedCache.task.officialTaskId),pollsBefore=remote.polls,countBeforeResume=state.creates.length;state.badRecoveryMedia=false;
  const repaired=await api('/task/'+failed.taskId+'/resume',{});assert.equal(repaired.resumed,true);assert.equal(repaired.createRepeated,false);
  const complete=await completed(failed.taskId);await verifyArtifacts(complete);assert.equal(complete.officialTaskId,failedCache.task.officialTaskId);assert.ok(remote.polls>pollsBefore);assert.equal(state.creates.length,countBeforeResume);
  recoveryChecks.push('Invalid media cache resumes by querying the same recorded remote ID and collecting repaired bytes, with zero repeated cloud POSTs');
  const unknown=await api('/sso/generate',{kind:'frontier-lite',data:{...minimalPayload('frontier-lite'),prompt:'OWNED_HTTP_RECONCILE_UNKNOWN'}});let uncertain;
  await poll(async()=>{uncertain=await rpc('generator/getTask',{taskId:unknown.taskId});return uncertain.task.status==='interrupted';},'actual HTTP400 leaves an uncertain no-ID task');
  assert.equal(uncertain.task.officialTaskId,undefined);const unknownCreateCount=state.creates.length;
  await rejected('/task/'+unknown.taskId+'/resume',{scope:'',body:{remoteId:state.unknownRemoteId}});
  state.historyMode='empty';const noMatch=await api('/task/'+unknown.taskId+'/reconcile',{});assert.equal(noMatch.status,'no_match');assert.equal(noMatch.replayAllowed,false);assert.equal(noMatch.historyComplete,true);assert.equal((await rpc('generator/getTask',{taskId:unknown.taskId})).task.officialTaskId,undefined);assert.equal(state.creates.length,unknownCreateCount);
  state.historyMode='incomplete';const incomplete=await api('/task/'+unknown.taskId+'/reconcile',{});assert.equal(incomplete.status,'inconclusive');assert.equal(incomplete.historyComplete,false);assert.equal((await rpc('generator/getTask',{taskId:unknown.taskId})).task.officialTaskId,undefined);assert.equal(state.creates.length,unknownCreateCount);
  state.historyMode='full';const matched=await api('/task/'+unknown.taskId+'/reconcile',{});assert.equal(matched.status,'matched');assert.equal(matched.remoteId,state.unknownRemoteId);assert.equal(matched.replayAllowed,false);assert.equal(matched.historyComplete,true);assert.equal(state.creates.length,unknownCreateCount);
  const resumeKnown=await api('/task/'+unknown.taskId+'/resume',{});assert.equal(resumeKnown.resumed,true);assert.equal(resumeKnown.createRepeated,false);const known=await completed(unknown.taskId);await verifyArtifacts(known);assert.equal(known.officialTaskId,state.unknownRemoteId);assert.equal(state.creates.length,unknownCreateCount);
  assert.ok(state.historyReads.length>=5);assert.ok(state.historyReads.every(row=>row.method==='GET'&&row.historyScope==='self'));
  recoveryChecks.push('Unknown remote identity cannot be injected: reconciliation only reads bounded self-history, refuses empty/incomplete proof, then uniquely binds and GET-resumes without another cloud create');
  checks.push(...recoveryChecks);
}
function playwrightPath() { try { return createRequire(import.meta.url).resolve('playwright'); } catch {} const cache = path.join(process.env.LOCALAPPDATA, 'npm-cache/_npx'); return fs.readdirSync(cache).map(name => path.join(cache, name, 'node_modules/playwright/index.mjs')).filter(fs.existsSync).sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]; }
function chromiumPath() { const cache = path.join(process.env.LOCALAPPDATA, 'ms-playwright'); for (const name of fs.readdirSync(cache).filter(name => /^chromium-\d+$/.test(name)).sort((a,b) => Number(b.split('-')[1])-Number(a.split('-')[1]))) for (const file of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe']) if (fs.existsSync(path.join(cache,name,file))) return path.join(cache,name,file); throw Error('Prepared Chromium unavailable'); }
const external = [], pageErrors = [], downloads = [];
async function guiChecks() {
  const { chromium } = await import(pathToFileURL(playwrightPath()).href);
  browser = await chromium.launchPersistentContext(path.join(run,'browser'), { headless: true, executablePath: chromiumPath(), viewport: { width: 1560, height: 1020 }, locale: 'zh-CN', timezoneId: 'Asia/Shanghai', colorScheme: 'dark', serviceWorkers: 'block', args: ['--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  await browser.route('**/*', route => { const url = new URL(route.request().url()); if (url.hostname === '127.0.0.1' || ['blob:','data:'].includes(url.protocol)) return route.continue(); external.push({ host:url.hostname,path:url.pathname }); return route.abort('blockedbyclient'); });
  if(previous) await browser.route('**/gui.html*', route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(frontend,'gui.html'),'utf8').replaceAll('index-BRxZ4eG7.js','index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js','store-0rGrUshb.js')}));
  await browser.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.workspacePaths=[];window.vscMediaUrl='';});
  page=browser.pages()[0] || await browser.newPage(); page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('response',response=>{if(new URL(response.url()).pathname==='/api/tauri/download-url') void response.json().then(body=>downloads.push(body));});
  await page.goto(origin,{waitUntil:'domcontentloaded'}); await poll(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'original GUI'); gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
  const next=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/}); await next.first().waitFor({state:'visible',timeout:3500}).catch(()=>{}); for(let i=0;i<4&&await next.count()&&await next.first().isVisible();i++)await next.first().click();
  await gui.getByRole('button',{name:'AI资产生成',exact:true}).click(); await poll(()=>gui.childFrames().some(frame=>new URL(frame.url()||'about:blank').pathname==='/lab3d'),'original Quick'); quick=gui.childFrames().find(frame=>new URL(frame.url()||'about:blank').pathname==='/lab3d');
  const representatives=[['frontier-game-design',/^2D\s*生成$/],['tripo-p1',/^3D\s*生成$/],['sonilo-sfx',/^音乐音效$/],['minimax-h3',/^视频生成$/]];
  const destinations=representatives.map(([id])=>({action:'save',path:path.join(run,'downloads',id+'.'+({image:'png',model:'glb',audio:'wav',video:'mp4'}[MODELS[id].kind]))})); fs.mkdirSync(path.join(run,'downloads'),{recursive:true}); fs.writeFileSync(choices,JSON.stringify([...destinations,{action:'cancel'}]));
  for(const [id,modeLabel] of representatives) {
    const model=MODELS[id],prompt='OWNED_GUI_'+id+' a simple blue cube or soft click';
    await quick.getByRole('button',{name:modeLabel}).click(); await quick.locator('.studio-model-select').click(); await quick.locator('.studio-model-option').filter({has:quick.getByText(model.name,{exact:true})}).click(); await quick.locator('textarea').first().fill(prompt);
    const generate=quick.locator('.studio-generate-button'); await poll(()=>generate.isEnabled(),id+' original controls ready'); const before=state.creates.length; await generate.click();
    let task; await poll(async()=>{task=(await api('/tasks')).tasks.find(row=>row.input.data.studioModelId===id&&row.input.data.prompt===prompt); assert.ok(!task||!['failed','interrupted'].includes(task.status),JSON.stringify(task));return task?.status==='completed';},id+' actual GUI result',120000);
    assert.equal(state.creates.length,before+1); await verifyArtifacts(task);
    const card=quick.locator('.studio-task-card:not(.is-running):not(.is-failed)').filter({has:quick.getByText(model.name,{exact:true})}).first(); await card.locator('.studio-task-media').click(); await quick.locator('.studio-result-media').waitFor({state:'visible'});
    if(model.kind==='image') await poll(()=>quick.locator('.studio-result-media img').first().evaluate(img=>img.complete&&img.naturalWidth===48&&img.naturalHeight===32),'actual image pixels');
    if(model.kind==='audio'||model.kind==='video') { const element=quick.locator('.studio-result-media '+(model.kind==='audio'?'audio':'video')); await poll(()=>element.evaluate(value=>value.readyState>=2&&value.duration>0),'real '+model.kind+' metadata'); await quick.locator('.studio-result-media').getByRole('button',{name:'播放',exact:true}).first().click(); await poll(()=>element.evaluate(value=>value.currentTime>0&&!value.error),'real '+model.kind+' playback'); }
    if(model.kind==='model') {await poll(()=>quick.locator('.studio-result-media canvas').count(),'real GLB renderer');await poll(async()=>(await quick.locator('.studio-result-media .studio-viewer-badge b').textContent())==='1','actual GLB geometry has one triangle');}
    await quick.locator('.studio-asset-list button').first().click(); await poll(()=>downloads.length===destinations.findIndex(choice=>choice.path.includes(id))+1,id+' native save'); assert.equal(downloads.at(-1).ok,true); assert.equal(sha(fs.readFileSync(destinations.find(choice=>choice.path.includes(id)).path)),task.output.data.artifacts[0].sha256);
    if(id==='minimax-h3'){await quick.locator('.studio-asset-list button').first().click();await poll(()=>downloads.length===5,'native cancellation');assert.equal(downloads.at(-1).cancelled,true);}
    await page.screenshot({path:path.join(run,'gui-'+id+'.png'),fullPage:true}); await quick.locator('body').press('Escape');
    await gui.getByRole('tab',{name:/^(生成记录|生成历史)$/}).click(); await poll(()=>gui.childFrames().some(frame=>new URL(frame.url()||'about:blank').pathname==='/generation-history'),'original History'); const history=gui.childFrames().find(frame=>new URL(frame.url()||'about:blank').pathname==='/generation-history');
    // Original History can remain mounted across tabs. Its own search refreshes
    // the actual server list and selects this request's unique draft, not an
    // older API-only task with the same model label.
    const refreshed=page.waitForResponse(response=>{const url=new URL(response.url());return /^\/api\/codely-generator\/(?:editor\/)?tasks$/.test(url.pathname)&&url.searchParams.get('query')===prompt&&response.status()===200;});
    await history.locator('input[type="search"]').fill(prompt);await (await refreshed).json();
    await poll(async()=>await history.locator('.generation-card').filter({hasText:model.name}).count()===1,'unique original History search result');
    await history.locator('.generation-card').filter({hasText:model.name}).first().click();await history.getByRole('dialog').getByText(prompt,{exact:false}).first().waitFor({state:'visible'});await history.getByRole('dialog').getByRole('button',{name:/再次生成/}).click();await gui.getByRole('tab',{name:'快速生成',exact:true}).click();await poll(async()=>(await quick.locator('.studio-model-select').textContent()).includes(model.name)&&(await quick.locator('textarea').first().inputValue())===prompt,'restored '+id+' original draft');assert.equal(state.creates.length,before+1);
    checks.push(id+': original menu/button, actual preview/playback, native SHA save and History draft restoration');
  }
  assert.deepEqual(pageErrors,[]); assert.deepEqual(external,[]); checks.push('The selected original GUI generation uses the actual preserved UI without external requests');
}
async function stop() { if(browser){await browser.close();browser=null;} if(shell){const owned=shell;if(owned.exitCode===null&&owned.signalCode===null)owned.kill();await poll(()=>gone(owned.pid)&&gone(corePid),'own host/Core PIDs exit',20000);shell=null;} }
try {
  await startFixture(); await launch(); await rpc('getControlPlaneSessionInfo',{silent:false,useOnboarding:false}); await poll(async()=>(await rpc('codelyAccount/status')).phase==='authenticated','actual isolated device authorization');
  const session=await api('/local-session'); assert.equal(session.mode,'codely-official'); for(const [id,row]of Object.entries(MODELS))assert.deepEqual(session.capabilities.models[id],{available:true,model:id,kind:row.kind,mode:row.mode,service:'codely-official'});
  const refs={images:[await upload('image',media.png)],videos:[await upload('video',media.mp4)],audios:[await upload('audio',media.wav)],models:[await upload('model',media.glb)]};
  const created=[];
  for(const id of Object.keys(MODELS)){if(created.length&&created.length%8===0)await Promise.all(created.slice(-8).map(row=>completed(row.localId)));const payload=minimalPayload(id,refs),slots=referenceSlots(id,payload),before=state.creates.length;const result=await api('/sso/generate',{kind:id,data:payload});assert.equal(typeof result.taskId,'string');created.push({id,localId:result.taskId,slots:slots.length,before});}
  for(const item of created){const task=await completed(item.localId);assert.equal(task.input.data.studioModelId,item.id);assert.equal(task.category,MODELS[item.id].mode);await verifyArtifacts(task);const cache=await rpc('generator/getTask',{taskId:item.localId});const remote=state.tasks.get(cache.task.officialTaskId);assert.ok(remote,'public official ID is an actual fixture ID');assert.ok(remote.polls>0);summaries.push({model:item.id,kind:MODELS[item.id].kind,category:task.category,artifacts:task.output.data.artifacts.length,referenceCount:item.slots});}
  assert.equal(state.creates.length,43); checks.push('All 43 fixed original models submit once, poll actual task IDs and cache complete media/text with SHA over real Rust/Core HTTP');
  const layered=await completed(created.find(row=>row.id==='seedream-layer').localId); assert.equal(layered.output.data.layers.length,16); assert.ok(layered.output.data.artifacts.length>=17); assert.equal(layered.output.data.layers[15].zIndex,16); assert.ok(layered.output.data.layers.every(layer=>layer.url.startsWith(origin+'/api/codely-generator/local-artifacts/'))); checks.push('A real 17-file layered fixture preserves late layers and original layer metadata in History');
  const before=state.creates.length,response=await fetch(origin+'/api/codely-generator/sso/generate',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-GameCowork-Workspace':'foreign-closed-workspace'},body:JSON.stringify({kind:'upscale-image',data:minimalPayload('upscale-image',refs)})});assert.ok(response.status>=400);assert.equal(state.creates.length,before);checks.push('A foreign workspace reference request fails before any upstream generation');
  await recoveryHttpChecks(created);
  await guiChecks(); await stop(); const audit=records();assert.ok(audit.some(row=>row.event==='initialized'&&row.pid===corePid));assert.equal(audit.filter(row=>row.event==='blocked').length,0);assert.deepEqual(state.errors,[]);
  const result={generatedAt:new Date().toISOString(),packaged,previous,binary,core,frontend,checks,apiModels:summaries,guiModels:['frontier-game-design','tripo-p1','sonilo-sfx','minimax-h3'],recoveryChecks,readOnlyHistoryRequests:state.historyReads,upstreamCreates:state.creates.length,upstreamUploads:state.uploads.length,networkGuard:{corePid,blocked:0},hostPid,ownProcessesExited:gone(corePid)&&gone(hostPid)};
  fs.writeFileSync(path.join(run,'result.json'),JSON.stringify(result,null,2));console.log('Official all-models E2E passed: '+summaries.length+' API models and four GUI categories\nReport: '+path.join(run,'result.json'));
} catch(error) {if(page){await page.screenshot({path:path.join(run,'failure.png'),fullPage:true}).catch(()=>{});for(const [index,frame]of page.frames().entries())fs.writeFileSync(path.join(run,'failure-frame-'+index+'.aria.txt'),await frame.locator('body').ariaSnapshot().catch(()=>''));}if(quick)fs.writeFileSync(path.join(run,'failure-quick.aria.txt'),await quick.locator('body').ariaSnapshot().catch(()=>''));fs.writeFileSync(path.join(run,'failure.json'),JSON.stringify({error:error.message,upstreamCreates:state.creates.map(row=>row.kind),fixtureErrors:state.errors},null,2));throw error;}
finally {await stop();if(fixture)await new Promise(resolve=>fixture.close(resolve));}
