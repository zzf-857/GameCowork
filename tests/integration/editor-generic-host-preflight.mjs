import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {readEditorIdentity,prepareEngineFixture} from '../support/editor-engine-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)),args=process.argv.slice(2),option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback,exec=promisify(execFile);
const run=path.resolve(option('--output','F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-generic-preflight-'+randomUUID())),project=path.join(run,'project');
assert.ok(run.replaceAll('\\','/').toLowerCase().startsWith('f:/ai/agentmake/temp/gamecowork/tests/editor-bridge-generic-'));assert.equal(fs.existsSync(project),false);
const editor=option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe'),identity=readEditorIdentity(editor);
prepareEngineFixture({repo,project,bridgePackage:path.join(repo,'src/editor-bridge'),identity});
fs.copyFileSync(path.join(repo,'tests/fixtures/editor-generic-host-preflight.cs'),path.join(project,'Assets/Editor/GameCoworkGenericHostPreflight.cs'));
const env={...process.env};for(const key of Object.keys(env))if(/^(GAMECOWORK_|CODELY_|OPENAI|ANTHROPIC|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete env[key];
const child=spawn(editor,['-projectPath',project,'-executeMethod','GameCoworkGenericHostPreflight.Boot','-logFile',path.join(run,'editor.log')],{cwd:run,env,windowsHide:true,stdio:'ignore'});
const alive=()=>{try{process.kill(child.pid,0);return true;}catch{return false;}},delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));let report,failure;
try{const until=Date.now()+120000;while(!fs.existsSync(path.join(project,'Temp/generic-preflight.json'))){assert.ok(alive(),'Own Editor stopped');assert.ok(Date.now()<until,'Own fixture deadline');await delay(150);}
report=JSON.parse(fs.readFileSync(path.join(project,'Temp/generic-preflight.json'),'utf8'));assert.equal(report.pid,child.pid);assert.equal(path.resolve(report.projectRoot),project);assert.equal(report.success,true,report.error);for(const name of ['hierarchy','inspector','custom-fifth'])assert.ok(report[name].occupied>report[name].width*report[name].height/2);assert.equal(report.customInput,1);console.log('Actual GUIView capture + fifth type SendEvent: PASS');
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;console.error(error.message);}
finally{if(alive()){fs.writeFileSync(path.join(project,'Temp/request-exit'),'');const until=Date.now()+10000;while(alive()&&Date.now()<until)await delay(100);if(alive()){const info=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${child.pid}').CommandLine`],{windowsHide:true});assert.ok(info.stdout.includes(project));await exec('taskkill.exe',['/PID',String(child.pid),'/F'],{windowsHide:true});}}
fs.writeFileSync(path.join(run,'result.json'),JSON.stringify({stage:'actual-api-preflight-not-product',identity,project,report,failure,ownEditorAlive:alive()},null,2));console.log('Artifacts: '+run);}
