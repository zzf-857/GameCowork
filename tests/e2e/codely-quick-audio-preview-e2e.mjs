// Read-only native-media probe. Mount only the existing xZ audio element and
// its real play handler from extracted maintained code, not a replacement UI.
// Original full GUI coverage remains the separate Rust/Core/Quick E2E gate.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {quickAudioPreviewSource} from '../support/codely-quick-audio-preview-source.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url)), args = process.argv.slice(2), option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const temp = path.resolve(root, '../../temp/GameCowork'), run = path.resolve(option('--output', path.join(temp, 'quick-audio-preview-' + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep)); fs.mkdirSync(run, {recursive: true});
const frontend = path.resolve(option('--frontend', path.join(root, 'src/frontend/bundle'))), extracted = await quickAudioPreviewSource(frontend);
const encoded = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/codely-audio-media.json'), 'utf8'));
const availableCases = [
  {format:'mp3', extension:'mp3', key:'previewUrl', mime:'audio/mpeg'}, {format:'wav', extension:'wav', key:'previewUrl', mime:'audio/wav'},
  {format:'flac', extension:'flac', key:'thumbnailUrl', mime:'audio/flac'}, {format:'aac', extension:'aac', key:'imageUrl', mime:'audio/aac'},
  {format:'opus', extension:'ogg', key:'previewUrl', mime:'audio/ogg'}, {format:'opus', extension:'opus', key:'thumbnailUrl', mime:'audio/ogg'},
  {format:'m4a', extension:'m4a', key:'thumbnailUrl', mime:'audio/mp4'},
];
// The repair concerns clone MP3 preview and owned Opus thumbnail classification.
// Other container checks do not imply every tiny encoded fixture is playable.
const cases = args.includes('--all-formats') ? availableCases : availableCases.filter(row => ['mp3','opus'].includes(row.extension));
function playwrightPath() { try { return createRequire(import.meta.url).resolve('playwright'); } catch {} const cache = path.join(process.env.LOCALAPPDATA, 'npm-cache/_npx'); return fs.readdirSync(cache).map(name => path.join(cache,name,'node_modules/playwright/index.mjs')).filter(fs.existsSync).sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]; }
function chromiumPath() { const cache = path.join(process.env.LOCALAPPDATA, 'ms-playwright'); for (const name of fs.readdirSync(cache).filter(name => /^chromium-\d+$/.test(name)).sort((a,b) => Number(b.split('-')[1])-Number(a.split('-')[1]))) for(const file of ['chrome-win64/chrome.exe','chrome-win/chrome.exe']) if(fs.existsSync(path.join(cache,name,file)))return path.join(cache,name,file); throw Error('Prepared Chromium unavailable'); }
const html = `<!doctype html><meta charset="utf-8"><title>Owned original audio component probe</title><script src="/helpers.js"></script><script>
const parameters=new URLSearchParams(location.search),key=parameters.get('key'),file=parameters.get('file'),address=location.origin+'/media/'+file;
window.probe={events:[],setters:[],selected:null};
const reply={status:'completed',output:{data:{[key]:address}}},model={id:'minimax-voice',kind:'voice-clone',mode:'audio'};
const result=quickAudioProbe.k5('owned-clone',reply,model),selected=quickAudioProbe._g(result);
if(selected.type!=='audio')throw Error('Original task helpers did not select audio');probe.selected={type:selected.type,key:selected.key,url:selected.url};
let stateIndex=0;globalThis.y={useRef:()=>({current:null}),useState:value=>{const index=stateIndex++;return[value,next=>probe.setters.push({index,value:next})]}};
globalThis.f={jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
globalThis._fe='icon';globalThis.eb='icon';globalThis.xd='icon';globalThis.ST='icon';globalThis.wT='icon';
const view=quickAudioProbe.wZ({asset:selected,mode:'audio',isSkybox:false,textures:null,t:text=>text});
if(view.type!==quickAudioProbe.xZ)throw Error('Original wZ did not choose the original xZ renderer');
const tree=quickAudioProbe.xZ(view.props);let audioProps,playProps;
function find(node){if(!node||typeof node!=='object')return;if(node.type==='audio')audioProps=node.props;if(node.type==='button'&&node.props['aria-label']==='studio.viewer.play')playProps=node.props;const children=node.props?.children;if(Array.isArray(children))children.forEach(find);else find(children)}find(tree);
if(!audioProps||!playProps)throw Error('Original audio/control nodes missing');
addEventListener('DOMContentLoaded',()=>{const audio=document.createElement('audio');audio.id='owned-audio';audio.preload=audioProps.preload;audioProps.ref.current=audio;
for(const [event,handler] of [['loadedmetadata','onLoadedMetadata'],['timeupdate','onTimeUpdate'],['play','onPlay'],['pause','onPause'],['ended','onEnded']])audio.addEventListener(event,e=>{probe.events.push(event);audioProps[handler](e)});
audio.addEventListener('error',()=>{probe.error=audio.error?.code||'audio error'});audio.src=audioProps.src;document.body.append(audio);
const play=document.createElement('button');play.id='owned-play';play.textContent='Play original audio';play.onclick=playProps.onClick;document.body.append(play);});
</script>`;
let origin, server, browser;
const methods=[], blocked=[], summaries=[], requests=[];
try {
  server=http.createServer((request,response)=>{
    methods.push(request.method); if(request.method!=='GET'){response.writeHead(405).end();return;}
    const target=new URL(request.url,origin);requests.push({path:target.pathname,range:request.headers.range});
    if(target.pathname==='/'){response.writeHead(200,{'Content-Type':'text/html'}).end(html);return;}
    if(target.pathname==='/helpers.js'){response.writeHead(200,{'Content-Type':'text/javascript'}).end(extracted.helperScript);return;}
    const match=/^\/media\/owned\.(mp3|wav|flac|aac|ogg|opus|m4a)$/.exec(target.pathname);
    if(!match){response.writeHead(404).end();return;}
    const row=availableCases.find(row=>row.extension===match[1]),bytes=Buffer.from(encoded.files[row.format].base64,'base64');
    assert.equal(request.headers.authorization,undefined); assert.equal(request.headers.cookie,undefined);
    const range=/^bytes=(\d+)-(\d*)$/.exec(request.headers.range||'');let start=0,end=bytes.length-1,status=200;
    if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;if(start>end){response.writeHead(416,{'Content-Range':'bytes */'+bytes.length}).end();return;}status=206;}
    response.writeHead(status,{'Content-Type':row.mime,'Content-Length':end-start+1,'Accept-Ranges':'bytes',...(status===206?{'Content-Range':`bytes ${start}-${end}/${bytes.length}`}:{})});response.end(bytes.subarray(start,end+1));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
  const {chromium}=await import(pathToFileURL(playwrightPath()).href);
  browser=await chromium.launchPersistentContext(path.join(run,'browser'),{headless:true,executablePath:chromiumPath(),serviceWorkers:'block',args:['--autoplay-policy=no-user-gesture-required']});
  await browser.route('**/*',async route=>{if(new URL(route.request().url()).origin!==origin){blocked.push(route.request().url());await route.abort();}else await route.continue();});
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const row of cases){
    await page.goto(origin+'/?key='+row.key+'&file=owned.'+row.extension);
    await page.waitForFunction(()=>{const audio=document.getElementById('owned-audio');return audio?.readyState>=2&&Number.isFinite(audio.duration)&&audio.duration>0||window.probe?.error;});
    assert.equal(await page.evaluate(()=>probe.error),undefined,row.extension+' actual media loads');
    const duration=await page.locator('#owned-audio').evaluate(audio=>audio.duration);assert.ok(duration>0&&duration<1);
    await page.locator('#owned-play').click();await page.waitForFunction(()=>probe.events.includes('ended')||probe.error);
    const evidence=await page.evaluate(()=>({selected:probe.selected,events:probe.events,setters:probe.setters,currentTime:document.getElementById('owned-audio').currentTime,error:probe.error}));
    assert.equal(evidence.error,undefined,row.extension+' playback: '+JSON.stringify({evidence,requests}));assert.equal(evidence.selected.type,'audio');assert.equal(evidence.selected.key,row.key);assert.ok(evidence.events.includes('play'));assert.ok(evidence.currentTime>0);
    assert.ok(evidence.setters.some(value=>value.index===0&&value.value===true),'Original xZ play event updates its existing state');
    summaries.push({extension:row.extension,key:row.key,durationSeconds:duration,currentTime:evidence.currentTime,events:evidence.events,sha256:encoded.files[row.format].sha256});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);assert.ok(methods.every(method=>method==='GET'));
  const evidence={generatedAt:new Date().toISOString(),frontend,currentSourceSha256:extracted.currentSha256,originalSourceSha256:extracted.sourceSha256,checks:summaries,requests:methods.length,mutations:0,externalRequests:0};
  fs.writeFileSync(path.join(run,'result.json'),JSON.stringify(evidence,null,2));console.log('Original Quick audio preview: '+summaries.length+' native media loading/playback checks passed\nReport: '+path.join(run,'result.json'));
} catch(error) {
  fs.writeFileSync(path.join(run,'failure.json'),JSON.stringify({error:error.message,completed:summaries,requests,externalRequests:blocked.length,mutations:methods.filter(method=>method!=='GET').length},null,2));
  throw error;
} finally {await browser?.close();if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}}
