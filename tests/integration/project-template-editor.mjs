// Full template manifest remains intact. Dependencies are restored separately;
// Package Manager egress during verification is blocked by an owned proxy.
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';
import assert from 'node:assert/strict';import {spawn,execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
import {readEditorIdentity} from '../support/editor-engine-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url));const args=process.argv.slice(2);
const option=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const owned=path.resolve(repo,'codelyreversebackup/work');
const source=path.resolve(option('--project',''));
const cache=path.resolve(option('--cache',''));
for(const p of[source,cache])assert.ok(p.toLowerCase().startsWith(owned.toLowerCase()+path.sep));
assert.ok(fs.existsSync(path.join(cache,'dependency-ledger.json')));
const editor=path.resolve(option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe'));
const identity=readEditorIdentity(editor),scene='Assets/Scenes/SampleScene'+(identity.engine==='tuanjie'?'.scene':'.unity');
const run=path.join(owned,'tests','template-editor-'+randomUUID());const project=path.join(run,'project');
fs.mkdirSync(project,{recursive:true});for(const name of['Assets','Packages','ProjectSettings'])fs.cpSync(path.join(source,name),path.join(project,name),{recursive:true,errorOnExist:true});
const originalManifest=fs.readFileSync(path.join(project,'Packages/manifest.json'));
const originalScene=fs.readFileSync(path.join(project,scene));
const projectVersion=fs.readFileSync(path.join(project,'ProjectSettings/ProjectVersion.txt'),'utf8');
assert.match(projectVersion,new RegExp('^m_EditorVersion: '+identity.version.replaceAll('.','\\.')+'\\s*$','m'));
if(identity.engine==='tuanjie')assert.match(projectVersion,/^m_TuanjieEditorVersion:\s*\S+/m);
fs.mkdirSync(path.join(project,'Assets/Editor'),{recursive:true});
fs.writeFileSync(path.join(project,'Assets/Editor/GameCoworkTemplateVerification.cs'),`
using System; using System.IO; using UnityEngine; using UnityEditor; using UnityEditor.SceneManagement;
public static class GameCoworkTemplateVerification {
 [Serializable] public class Receipt { public string editorVersion,projectRoot,scene; public int cameras,lights; }
 public static void Verify() {
  var scene = EditorSceneManager.OpenScene("${scene}");
  var root = Path.GetFullPath(Path.Combine(Application.dataPath,".."));
  var receipt = new Receipt { editorVersion=Application.unityVersion,projectRoot=root,scene=scene.path,
   cameras=UnityEngine.Object.FindObjectsOfType<Camera>().Length,lights=UnityEngine.Object.FindObjectsOfType<Light>().Length };
  Directory.CreateDirectory(Path.Combine(root,"Temp"));
  File.WriteAllText(Environment.GetEnvironmentVariable("GAMECOWORK_TEMPLATE_RECEIPT"),JsonUtility.ToJson(receipt));
  EditorApplication.Exit(receipt.cameras > 0 && receipt.lights > 0 ? 0 : 7);
 }
}`);
const blocked=[],proxyConnectionErrors=[];const proxy=http.createServer((req,res)=>{blocked.push({method:req.method,target:req.url});res.writeHead(503);res.end('Offline owned template verification');});
proxy.on('connect',(req,socket)=>{socket.on('error',error=>proxyConnectionErrors.push(error.code||error.message));blocked.push({method:'CONNECT',target:req.url});socket.end('HTTP/1.1 503 Offline verification\r\nContent-Length: 0\r\n\r\n');});
await new Promise(resolve=>proxy.listen(0,'127.0.0.1',resolve));const proxyUrl='http://127.0.0.1:'+proxy.address().port;
// UPM_REGISTRY is supported by the selected Editor's own Package Manager
// server. Serve only hash-verified public preparation artifacts over loopback.
const ledger=JSON.parse(fs.readFileSync(path.join(cache,'dependency-ledger.json'),'utf8'));
const packages=new Map();const tarballs=new Map();const mirrorRequests=[];let registryUrl;
for(const item of ledger.filter(row=>row.source==='public-unity-registry')){
 const packageJson=JSON.parse(fs.readFileSync(path.join(cache,'extract',item.name+'@'+item.version,'package/package.json'),'utf8'));
 const tarball=path.join(cache,'downloads',item.name+'-'+item.version+'.tgz');
 assert.equal(createHash('sha1').update(fs.readFileSync(tarball)).digest('hex'),item.sha1);
 if(!packages.has(item.name))packages.set(item.name,[]);packages.get(item.name).push({item,packageJson});tarballs.set(item.name+'/'+item.version,tarball);
}
const mirror=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).slice(1);mirrorRequests.push(pathname);
 if(pathname==='-/ping'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true}));return;}
 if(pathname.startsWith('tarball/')){const file=tarballs.get(pathname.slice(8));if(!file){res.writeHead(404);return res.end();}res.setHeader('Content-Type','application/octet-stream');return fs.createReadStream(file).pipe(res);}
 const versions=packages.get(pathname);if(!versions){res.writeHead(404);return res.end(JSON.stringify({error:'Package not present in owned offline preparation'}));}
 const rows={};for(const {item,packageJson} of versions)rows[item.version]={...packageJson,dist:{shasum:item.sha1,tarball:registryUrl+'/tarball/'+item.name+'/'+item.version}};
 res.setHeader('Content-Type','application/json');res.end(JSON.stringify({name:pathname,versions:rows,'dist-tags':{latest:versions.at(-1).item.version}}));
});
await new Promise(resolve=>mirror.listen(0,'127.0.0.1',resolve));registryUrl='http://127.0.0.1:'+mirror.address().port;
const log=path.join(run,'editor.log');const unity=spawn(editor,['-batchmode','-projectPath',project,'-executeMethod','GameCoworkTemplateVerification.Verify','-disable-assembly-updater','-logFile',log],{
 windowsHide:true,stdio:'ignore',env:{...process.env,UPM_CACHE_ROOT:cache,UPM_NPM_CACHE_PATH:path.join(cache,'npm'),UPM_CACHE_PATH:path.join(cache,'packages'),UPM_GIT_LFS_CACHE_PATH:path.join(run,'git-lfs'),
 GAMECOWORK_TEMPLATE_RECEIPT:path.join(run,'template-verified.json'),UPM_REGISTRY:registryUrl,UPM_NPM_REGISTRY:registryUrl,HTTP_PROXY:proxyUrl,HTTPS_PROXY:proxyUrl,ALL_PROXY:proxyUrl,NO_PROXY:'localhost,127.0.0.1'}});
let status='failed',receipt;let timer;
try {
 const outcome=await new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(Error('Own Editor is still running after observation deadline; PID '+unity.pid)),180000);unity.once('error',reject);unity.once('exit',(code,signal)=>resolve({code,signal}));});
 clearTimeout(timer);assert.equal(outcome.code,0,JSON.stringify(outcome)+'; inspect '+log);
 receipt=JSON.parse(fs.readFileSync(path.join(run,'template-verified.json'),'utf8'));
 assert.equal(receipt.editorVersion,identity.version);assert.equal(path.resolve(receipt.projectRoot),project);assert.equal(receipt.scene,scene);assert.ok(receipt.cameras>0&&receipt.lights>0);
 assert.deepEqual(fs.readFileSync(path.join(project,'Packages/manifest.json')),originalManifest);
 assert.equal(createHash('sha256').update(fs.readFileSync(path.join(project,scene))).digest('hex'),createHash('sha256').update(originalScene).digest('hex'));
 assert.ok(proxyConnectionErrors.every(code=>code==='ECONNRESET'||code==='EPIPE'),'Unexpected verification proxy socket error');
 status='passed';console.log(JSON.stringify({status,run,editor,pid:unity.pid,receipt,blockedProxyAttempts:blocked,mirrorRequests,manifestPreserved:true,scenePreserved:true},null,2));
} catch(error){clearTimeout(timer);console.error(error);process.exitCode=1;}
finally {
 if(unity.exitCode===null&&unity.signalCode===null){
  const command=execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${unity.pid}').CommandLine`],{windowsHide:true,encoding:'utf8',timeout:10000});
  assert.ok(command.replaceAll('\\','/').toLowerCase().includes(project.replaceAll('\\','/').toLowerCase()),'Cleanup may stop only the exact spawned own project');
  const exited=new Promise(resolve=>unity.once('exit',resolve));
  execFileSync('taskkill.exe',['/PID',String(unity.pid),'/F','/T'],{windowsHide:true,timeout:10000});await exited;
 }
 fs.writeFileSync(path.join(run,'result.json'),JSON.stringify({status,run,editor,engine:identity.engine,editorVersion:identity.version,pid:unity.pid,receipt,blockedProxyAttempts:blocked,proxyConnectionErrors,mirrorRequests,manifestPreserved:status==='passed',scenePreserved:status==='passed',exitCode:unity.exitCode,signalCode:unity.signalCode},null,2));
 proxy.closeAllConnections();mirror.closeAllConnections();await new Promise(resolve=>proxy.close(resolve));await new Promise(resolve=>mirror.close(resolve));
}
