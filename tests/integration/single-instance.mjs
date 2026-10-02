// Real processes, kernel ownership and loopback forwarding; only test-owned
// state and a fixture Core are used. --native also verifies Wry restoration.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import test from 'node:test';

const repo=fileURLToPath(new URL('../../',import.meta.url)),exec=promisify(execFile);
const binaryArg=process.argv.indexOf('--binary');
const binary=path.resolve(binaryArg<0?path.join(repo,'src/shell/target/debug/GameCowork.exe'):process.argv[binaryArg+1]);
const native=process.argv.includes('--native');
const run=path.join('F:/AI/AgentMake/temp/GameCowork/tests','single-instance-'+randomUUID());
fs.mkdirSync(run,{recursive:true});
const owned=new Set(),checks=[];let completed=false;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate,message,timeout=15000){
  const deadline=Date.now()+timeout;
  while(Date.now()<deadline){const result=await predicate();if(result)return result;await delay(50);}
  assert.fail(message);
}
function environment(dataDir){
  const env={...process.env};
  for(const key of Object.keys(env))if(/^(GAMECOWORK_|CODELY_|OPENAI_|ANTHROPIC_|GEMINI_|AZURE_|AWS_)/.test(key)||key==='NODE_OPTIONS')delete env[key];
  Object.assign(env,{GAMECOWORK_HEADLESS:native?'0':'1',GAMECOWORK_TEST_MODE:'1',
    GAMECOWORK_APP_ROOT:path.join(repo,'app'),GAMECOWORK_DATA_DIR:dataDir,
    GAMECOWORK_CORE_DIR:run,GAMECOWORK_CORE_ENTRY:path.join(run,'core-entry.mjs'),
    GAMECOWORK_FRONTEND_DIR:path.join(repo,'src/frontend/bundle'),
    GAMECOWORK_FIXTURE_DATA_DIR:dataDir,GAMECOWORK_FIXTURE_LOG:path.join(dataDir,'core.jsonl'),
    GAMECOWORK_FIXTURE_SLOW_INIT_MATCH:'SlowInit',GAMECOWORK_FIXTURE_FAIL_INIT_MATCH:'FailInit'});
  return env;
}
function start(label,dataDir,args=[]){
  const child=spawn(binary,args,{cwd:run,env:environment(dataDir),windowsHide:true,stdio:['ignore','pipe','pipe']});
  const record={child,label,dataDir,output:'',url:null};owned.add(record);
  record.exit=new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}));});
  for(const output of[child.stdout,child.stderr])output.on('data',bytes=>{
    record.output+=bytes.toString();fs.appendFileSync(path.join(run,label+'.log'),bytes);
    const match=record.output.match(/\[shell\] HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);
    if(match)record.url=match[1];
  });
  return record;
}
async function stop(record){
  if(record.child.exitCode===null&&record.child.signalCode===null){
    // This PID was spawned by this test, using our unique fixture entry/data.
    await exec('taskkill.exe',['/PID',String(record.child.pid),'/F'],{windowsHide:true}).catch(()=>{});
    await Promise.race([record.exit,delay(3000)]);
  }
  owned.delete(record);
}
async function http(record,route,body){
  const response=await fetch(new URL(route,record.url),{method:body===undefined?'GET':'POST',
    headers:body===undefined?{}:{'Content-Type':'application/json'},
    body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(5000)});
  return {status:response.status,body:await response.json()};
}
function frames(dataDir){return fs.existsSync(path.join(dataDir,'core.jsonl'))?
  fs.readFileSync(path.join(dataDir,'core.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];}
async function ready(record){await until(()=>{
  if(record.child.exitCode!==null)assert.fail(record.output);
  return record.url;
},'Primary must start its real local service');return record;}
async function forwarded(record){let timer;let exit;
  try{exit=await Promise.race([record.exit,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Duplicate did not finish: '+record.output)),20000);})]);}
  finally{clearTimeout(timer);}
  assert.equal(exit.code,0,record.output);assert.equal(record.url,null,'Duplicate must not start an HTTP server');
  assert.match(record.output,/Activated running instance/);owned.delete(record);}

test('single instance forwards launch directories without creating a second Core', {skip:process.platform!=='win32'},async(t)=>{
  t.after(async()=>{for(const record of[...owned])await stop(record);
    fs.writeFileSync(path.join(run,'result.json'),JSON.stringify({passed:completed,native,checks},null,2));console.log('Artifacts: '+run);});
  fs.writeFileSync(path.join(run,'core-entry.mjs'),`import ${JSON.stringify(pathToFileURL(path.join(repo,'tests/fixtures/core-fixture.mjs')).href)};\n`);
  const data=path.join(run,'data'),project=path.join(run,'Project 中文');fs.mkdirSync(project,{recursive:true});
  let primary=await ready(start('primary',data,['--workspace',project]));
  const status=(await http(primary,'/api/tauri/status')).body;
  assert.equal(status.pid,primary.child.pid);assert.equal(status.desktopWindow,native);
  assert.ok(status.instanceId&&status.dataId);assert.equal(frames(data).filter(v=>v.event==='started').length,1);
  const initial=(await http(primary,'/api/tauri/hub/workspaces')).body;
  assert.ok(initial.workspaces.some(v=>path.resolve(v.workspaceDir)===path.resolve(project)));
  checks.push('First --workspace launch opens an existing directory in its actual Core');
  const extra=path.join(run,'Second 项目');fs.mkdirSync(extra);
  const duplicate=start('forward-directory',data,['--workspace',extra]);await forwarded(duplicate);
  assert.equal(frames(data).filter(v=>v.event==='started').length,1);
  const snapshot=(await http(primary,'/api/tauri/hub/workspaces')).body;
  assert.ok(snapshot.workspaces.some(v=>path.resolve(v.workspaceDir)===path.resolve(extra)));
  checks.push('Second launch forwards its directory and selects it in the original application');
  const slow=path.join(run,'SlowInit');fs.mkdirSync(slow);
  await forwarded(start('slow-activation',data,['--workspace',slow]));
  assert.equal(frames(data).filter(v=>v.event==='started').length,1);
  assert.equal(frames(data).filter(v=>v.event==='received'&&v.frame.messageType==='initWorkspace'&&
    v.frame.data?.workspace&&path.resolve(v.frame.data.workspace)===path.resolve(slow)).length,1);
  checks.push('Slow Core initialization is awaited without replaying the activation');
  const simultaneous=[start('duplicate-one',data),start('duplicate-two',data.toLowerCase())];
  await Promise.all(simultaneous.map(forwarded));
  assert.equal(frames(data).filter(v=>v.event==='started').length,1);
  assert.equal((await http(primary,'/api/tauri/status')).body.instanceId,status.instanceId);
  checks.push('Concurrent duplicate and case-alias launches retain one Core and one server');
  const invalid=start('invalid-arguments',data,['--workspace',path.join(run,'Missing')]);
  assert.equal((await invalid.exit).code,1);assert.equal(invalid.url,null);assert.equal(fs.existsSync(path.join(run,'Missing')),false);owned.delete(invalid);
  checks.push('Missing directory and invalid launch arguments fail without creating files or processes');
  const failedProject=path.join(run,'FailInit');fs.mkdirSync(failedProject);
  const selectedBeforeFailure=(await http(primary,'/api/tauri/hub/workspaces')).body.activeWorkspaceKey;
  const rejected=start('core-init-rejected',data,['--workspace',failedProject]);
  assert.equal((await rejected.exit).code,1);assert.equal(rejected.url,null);
  assert.match(rejected.output,/Fixture workspace initialization failed/);owned.delete(rejected);
  const afterRejected=(await http(primary,'/api/tauri/hub/workspaces')).body;
  assert.equal(afterRejected.activeWorkspaceKey,selectedBeforeFailure);
  assert.ok(!afterRejected.workspaces.some(v=>path.resolve(v.workspaceDir)===path.resolve(failedProject)));
  assert.equal(frames(data).filter(v=>v.event==='received'&&v.frame.messageType==='initWorkspace'&&
    v.frame.data?.workspace&&path.resolve(v.frame.data.workspace)===path.resolve(failedProject)).length,1);
  checks.push('A rejected forwarded initialization is reported once and retains the original selection');
  const activeBeforeStale=(await http(primary,'/api/tauri/hub/workspaces')).body.activeWorkspaceKey;
  const stale=(await http(primary,'/api/tauri/activate-instance',{instanceId:randomUUID(),workspace:project}));
  assert.equal(stale.status,409);
  assert.equal((await http(primary,'/api/tauri/hub/workspaces')).body.activeWorkspaceKey,activeBeforeStale);
  checks.push('Stale instance token cannot activate or change the selected workspace');
  if(native){
    assert.equal((await http(primary,'/api/tauri/minimize-window',{})).body.ok,true);
    await until(async()=>(await http(primary,'/api/tauri/window-state')).body.minimized===true,'Owned native window becomes minimized');
    await forwarded(start('native-restore',data));
    await until(async()=>(await http(primary,'/api/tauri/window-state')).body.minimized===false,'Second launch restores the actual Wry window');
    await until(async()=>(await http(primary,'/api/tauri/window-state')).body.focused===true,'Verified Wry window receives native foreground focus');
    checks.push('Actual Wry window is restored from minimized state after the second launch');
  }
  const oldMarker=fs.readFileSync(path.join(data,'instance.json'));
  await stop(primary);
  // Crash left metadata behind, but the OS closes the kernel lock and Job.
  assert.deepEqual(fs.readFileSync(path.join(data,'instance.json')),oldMarker);
  primary=await ready(start('after-crash',data));
  const restarted=(await http(primary,'/api/tauri/status')).body;
  assert.notEqual(restarted.instanceId,status.instanceId);assert.equal(restarted.dataId,status.dataId);
  assert.equal(frames(data).filter(v=>v.event==='started').length,2);
  checks.push('Crash recovery replaces stale metadata with a fresh verified generation');
  const isolated=await ready(start('different-data-directory',path.join(run,'isolated')));
  assert.notEqual((await http(isolated,'/api/tauri/status')).body.dataId,status.dataId);await stop(isolated);
  checks.push('Independent test data directories retain their isolated application instances');
  const before=frames(data).filter(v=>v.event==='started').length;
  // Invalid payload is sent to the verified instance; the rejection is surfaced.
  assert.equal((await http(primary,'/api/tauri/activate-instance',{instanceId:restarted.instanceId,workspace:12})).status,400);
  assert.equal(frames(data).filter(v=>v.event==='started').length,before);
  checks.push('Rejected activation retains the original Core and reports the real failure');
  completed=true;
});
