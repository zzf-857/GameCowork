// A real Wry/WebView2 window with test-owned state and fixture Core. Native UI
// actions are performed separately through the Computer Use sky API; this
// launcher records ownership/lifetime and does not claim automated UI checks.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const repo=fileURLToPath(new URL('../../',import.meta.url)),exec=promisify(execFile);
const packaged=process.argv.includes('--packaged'),base=path.resolve(repo,'codelyreversebackup/work/tests');
const at=process.argv.indexOf('--output'),run=path.resolve(at<0?path.join(base,'native-window-'+randomUUID()):process.argv[at+1]);
assert.ok(run.toLowerCase().startsWith(base.toLowerCase()+path.sep));
assert.ok(!fs.existsSync(run),'Use a fresh native-window fixture directory');
fs.mkdirSync(run,{recursive:true});
const binary=path.join(repo,packaged?'app/GameCowork.exe':'src/shell/target/debug/GameCowork.exe');
const env={...process.env};
for(const name of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(name)||name==='NODE_OPTIONS')delete env[name];
Object.assign(env,{GAMECOWORK_TEST_MODE:'1',GAMECOWORK_APP_ROOT:path.join(repo,'app'),GAMECOWORK_DATA_DIR:path.join(run,'data'),
 GAMECOWORK_FRAMELESS_WINDOW:process.argv.includes('--frameless')?'1':'0',
 GAMECOWORK_FRONTEND_DIR:path.join(repo,packaged?'app/frontend':'src/frontend/bundle'),
 GAMECOWORK_CORE_DIR:path.join(repo,'tests'),GAMECOWORK_CORE_ENTRY:path.join(repo,'tests/fixtures/core-fixture.mjs'),
 GAMECOWORK_FIXTURE_DATA_DIR:run,GAMECOWORK_FIXTURE_LOG:path.join(run,'core-frames.jsonl')});
const owned=spawn(binary,['--workspace',run],{cwd:run,env,windowsHide:true,stdio:['ignore','pipe','pipe']});
let log='',origin,timer,error;
for(const output of[owned.stdout,owned.stderr])output.on('data',bytes=>{log+=bytes.toString();const match=log.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match&&!origin){origin=match[1];fs.writeFileSync(path.join(run,'session.json'),JSON.stringify({run,binary,packaged,pid:owned.pid,origin,started:true},null,2));console.log(JSON.stringify({run,binary,packaged,pid:owned.pid,origin}));}});
try{await new Promise((resolve,reject)=>{owned.once('error',reject);owned.once('exit',(code,signal)=>resolve({code,signal}));timer=setTimeout(()=>reject(Error('Native window observation deadline reached')),240000);});}
catch(failure){error=failure.message;process.exitCode=1;}
finally{
 clearTimeout(timer);
 if(owned.exitCode===null&&owned.signalCode===null){
  const result=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${owned.pid}').CommandLine`],{windowsHide:true});
  assert.ok(result.stdout.includes(run),'Cleanup verifies exact owned native-test marker');
  await exec('taskkill.exe',['/PID',String(owned.pid),'/T','/F'],{windowsHide:true});
 }
 fs.writeFileSync(path.join(run,'shell.log'),log);
 fs.writeFileSync(path.join(run,'lifetime.json'),JSON.stringify({run,binary,packaged,pid:owned.pid,exitCode:owned.exitCode,signalCode:owned.signalCode,error,nativeUiActionsVerified:false},null,2));
 console.log('Native fixture released: '+run);
}
