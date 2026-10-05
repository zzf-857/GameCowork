// Manual opt-in only. Never register this script in the automatic fixture gate.
// Display an already completed, owned clone cache file in the installed original
// History GUI. GET-only local fixture: no Core/runtime, account or cloud request.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
const require = createRequire(import.meta.url), root = fileURLToPath(new URL('../../', import.meta.url)), args = process.argv.slice(2);
assert.ok(args.includes('--read-owned-cache'), 'Pass --read-owned-cache to explicitly select this manual read-only real-cache check; automatic gates must remain fixture-only');
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const temp = path.resolve(root, '../../temp/GameCowork'), run = path.resolve(option('--output', path.join(temp, 'cached-clone-audio-' + crypto.randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep));fs.mkdirSync(run,{recursive:true});
const frontend = path.resolve(option('--frontend', path.join(root,'app/frontend'))), cache = path.join(process.env.USERPROFILE,'.gamecowork/generator'), registry = path.join(cache,'tasks.json');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const originalRegistry = fs.readFileSync(registry), records = JSON.parse(originalRegistry);
const candidates = Object.values(records).filter(row => row.model === 'minimax-voice' && row.serviceSource === 'codely-official' && row.status === 'completed' && row.artifacts.some(artifact => artifact.mime === 'audio/mpeg'));
const task = structuredClone(option('--task-id') ? candidates.find(row=>row.id===option('--task-id')) : candidates.sort((a,b)=>b.createdTime.localeCompare(a.createdTime))[0]);
assert.ok(task,'An existing completed clone MP3 cache is required');
const audio = task.artifacts.find(row=>row.mime==='audio/mpeg'), file = path.resolve(cache,audio._file);
assert.ok(file.toLowerCase().startsWith(path.resolve(cache).toLowerCase()+path.sep));
for(let current=file;;current=path.dirname(current)){const stat=fs.lstatSync(current);assert.equal(stat.isSymbolicLink(),false);if(stat.isFile())assert.equal(stat.nlink,1);if(path.dirname(current)===current)break;}
const media = fs.readFileSync(file); assert.equal(media.length,audio.byteLength);assert.equal(sha(media),audio.sha256);
const {inspectAudioMedia}=require('../../src/core/binary/out/gamecowork-audio-media.js');assert.equal(inspectAudioMedia(media).mime,'audio/mpeg');
const publicValue=value=>Array.isArray(value)?value.map(publicValue):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>!key.startsWith('_')).map(([key,child])=>[key,publicValue(child)])):value;
const publicTask=publicValue(task), helperRoot=path.join(run,'readonly-adapter');fs.mkdirSync(helperRoot,{recursive:true});
const {createCodelyGeneratorApi}=require('../../src/core/binary/out/gamecowork-codely-generator.js');
const assetService={root:helperRoot,assertRuntime(){},getOwnedSnapshot:()=>({tasks:[publicTask],inputs:[]}),
  getArtifactPath(taskId,artifactId){assert.equal(taskId,task.id);assert.equal(artifactId,audio.id);return{path:file,...publicValue(audio)};},
  async dispatch(kind,data){if(kind==='generator/listProviders')return{providers:[]};if(kind==='generator/getTask'&&data.taskId===task.id)return{task:publicTask};throw Error('Read-only fixture rejects unneeded asset mutation');}};
const api=createCodelyGeneratorApi({assetService,getOfficial:()=>null});
function playwrightPath(){try{return require.resolve('playwright');}catch{}const cache=path.join(process.env.LOCALAPPDATA,'npm-cache/_npx');return fs.readdirSync(cache).map(name=>path.join(cache,name,'node_modules/playwright/index.mjs')).filter(fs.existsSync).sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs)[0];}
function chromiumPath(){const cache=path.join(process.env.LOCALAPPDATA,'ms-playwright');for(const name of fs.readdirSync(cache).filter(name=>/^chromium-\d+$/.test(name)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1])))for(const file of ['chrome-win64/chrome.exe','chrome-win/chrome.exe'])if(fs.existsSync(path.join(cache,name,file)))return path.join(cache,name,file);throw Error('Prepared Chromium unavailable');}
const contentType=file=>({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.wasm':'application/wasm'}[path.extname(file)]||'application/octet-stream');
let server,origin,browser,page;const blocked=[],mutations=[],apiPaths=[],pageErrors=[];
try{
  server=http.createServer(async(request,response)=>{
    const target=new URL(request.url,origin),send=(body,status=200)=>{response.writeHead(status,{'Content-Type':'application/json'}).end(JSON.stringify(body));};
    if(request.method!=='GET'){mutations.push(target.pathname);send({error:'readonly_cache_fixture'},405);return;}
    if(target.pathname.startsWith('/api/codely-generator/local-artifacts/')){
      const expected='/api/codely-generator/local-artifacts/'+encodeURIComponent(task.id)+'/'+encodeURIComponent(audio.id)+'/'+encodeURIComponent(audio.filename);
      if(target.pathname!==expected){send({error:'owned_artifact_only'},404);return;}
      const range=/^bytes=(\d+)-(\d*)$/.exec(request.headers.range||'');let start=0,end=media.length-1,status=200;
      if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;if(start>end){response.writeHead(416,{'Content-Range':'bytes */'+media.length}).end();return;}status=206;}
      response.writeHead(status,{'Content-Type':'audio/mpeg','Content-Length':end-start+1,'Accept-Ranges':'bytes',...(status===206?{'Content-Range':`bytes ${start}-${end}/${media.length}`}:{})}).end(media.subarray(start,end+1));return;
    }
    if(target.pathname.startsWith('/api/codely-generator/')){
      apiPaths.push(target.pathname);const reply=await api.dispatch({method:'GET',path:target.pathname.slice('/api/codely-generator'.length),query:Object.fromEntries(target.searchParams),body:{},origin});
      send(reply.body,reply.status);return;
    }
    const relative=target.pathname==='/generation-history'?'codely-generator/index.html':decodeURIComponent(target.pathname).replace(/^\//,'');
    const staticFile=path.resolve(frontend,relative);if(!staticFile.toLowerCase().startsWith(frontend.toLowerCase()+path.sep)||!fs.existsSync(staticFile)||!fs.statSync(staticFile).isFile()){response.writeHead(404).end();return;}
    response.writeHead(200,{'Content-Type':contentType(staticFile)}).end(fs.readFileSync(staticFile));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
  const {chromium}=await import(pathToFileURL(playwrightPath()).href);browser=await chromium.launchPersistentContext(path.join(run,'browser'),{headless:true,executablePath:chromiumPath(),locale:'zh-CN',timezoneId:'Asia/Shanghai',serviceWorkers:'block',args:['--autoplay-policy=no-user-gesture-required']});
  await browser.route('**/*',async route=>{if(new URL(route.request().url()).origin!==origin){blocked.push('external-request-blocked');await route.abort();}else await route.continue();});
  page=await browser.newPage();page.on('pageerror',error=>pageErrors.push(error.message));
  await page.goto(origin+'/generation-history?embed=1&host=codely');
  await page.locator('.generation-card').first().waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('.generation-card').count(),1);await page.locator('.generation-card').first().click();
  const dialog=page.getByRole('dialog');await dialog.waitFor({state:'visible'});
  const player=dialog.locator('audio[src*="/api/codely-generator/local-artifacts/"]').first();await player.waitFor({state:'attached'});
  await player.evaluate(audio=>new Promise((resolve,reject)=>{if(audio.readyState>=2&&Number.isFinite(audio.duration)&&audio.duration>0)return resolve();audio.addEventListener('loadedmetadata',resolve,{once:true});audio.addEventListener('error',()=>reject(Error('Cached MP3 failed to decode')),{once:true});}));
  const duration=await player.evaluate(audio=>audio.duration);assert.ok(Number.isFinite(duration)&&duration>0);
  const play=dialog.getByRole('button',{name:/播放|play/i}).first();
  await play.waitFor({state:'visible'});assert.equal(await play.count(),1,'The preserved History dialog must provide its original playback button');
  await play.click();
  await page.waitForFunction(()=>{const audio=document.querySelector('[role="dialog"] audio');return audio&&!audio.paused&&audio.currentTime>0.25;});
  const playback=await player.evaluate(audio=>({durationSeconds:audio.duration,currentTime:audio.currentTime,paused:audio.paused,networkState:audio.networkState,readyState:audio.readyState,error:audio.error?.code??null}));
  assert.equal(playback.error,null);assert.equal(playback.paused,false);await player.evaluate(audio=>audio.pause());
  assert.deepEqual(pageErrors,[]);assert.equal(apiPaths.some(path=>path.includes('/sso/generate')),false);assert.deepEqual(blocked,[]);assert.equal(mutations.length,0,'The original read-only History playback must send no mutation requests');
  assert.equal(sha(fs.readFileSync(registry)),sha(originalRegistry),'The real owned task registry is never modified');assert.equal(sha(fs.readFileSync(file)),audio.sha256);
  const evidence={generatedAt:new Date().toISOString(),manualOwnedCacheRead:true,frontend,cachedTaskId:task.id,cachedArtifactId:audio.id,byteLength:audio.byteLength,sha256:audio.sha256,mime:audio.mime,originalHistoryDialog:true,originalPlayButton:true,playback,
    registryUnchanged:true,cacheBytesUnchanged:true,serverAllowedMethods:['GET'],blockedUiMutationCount:mutations.length,generationRequests:0,inferenceRequests:0,externalRequests:0};
  fs.writeFileSync(path.join(run,'result.json'),JSON.stringify(evidence,null,2));console.log('Installed original History reads and plays the existing owned clone MP3\nReport: '+path.join(run,'result.json'));
}catch(error){fs.writeFileSync(path.join(run,'failure.json'),JSON.stringify({error:error.message,apiPaths,blockedUiMutations:mutations,pageErrors,externalBlocked:blocked.length},null,2));throw error;}
finally{await browser?.close();if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
