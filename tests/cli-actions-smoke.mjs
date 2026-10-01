// Actual ACP tool/approval probe. Provider plans are loopback fixtures; writes
// are verified on disk and permission responses retain the real CLI RPC IDs.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID} from 'node:crypto';
import {startMockProvider} from './mock-provider.mjs';
import {createOwnedToolFixture} from './owned-tool-fixture.mjs';

const packageIndex=process.argv.indexOf('--package');
assert.ok(packageIndex>=0&&process.argv[packageIndex+1], 'Pass --package with a guarded CLI.');
const pkg=path.resolve(process.argv[packageIndex+1]);
assert.equal(JSON.parse(fs.readFileSync(path.join(pkg,'cli-package-manifest.json'),'utf8')).testGuardIncluded,true);
const root=path.resolve('F:/AI/AgentMake/temp/GameCowork',`cli-actions-${randomUUID()}`);
const workspace=path.join(root,'workspace');
for(const directory of[workspace,path.join(root,'cli-state'),path.join(root,'user-state')])fs.mkdirSync(directory,{recursive:true});
fs.mkdirSync(path.join(workspace,'.gamecowork-cli'));
const created=path.join(workspace,'approved.txt'),rejected=path.join(workspace,'rejected.txt'),cancelled=path.join(workspace,'cancelled.txt'),ask=path.join(workspace,'ask.txt');
const writeText='GCW_ACTION_WRITE_VERIFIED\n',replaceText='GCW_ACTION_REPLACE_VERIFIED\n';
const deniedText=text=>/cancel|reject|deni|declin|not.*execut/i.test(text);
const commands=createOwnedToolFixture(root,workspace);
const commandFor=name=>commands.scripts.find(script=>script.name===name).command;
const toolPlans={
 GCW_TOOL_WRITE_ALLOW:{toolName:'write_file',arguments:{file_path:created,content:writeText},verify:text=>fs.existsSync(created)&&fs.readFileSync(created,'utf8')===writeText&&/success|wrote|written/i.test(text)},
 GCW_TOOL_REPLACE_ALLOW:{steps:[
  {toolName:'read_file',arguments:{absolute_path:created},verify:text=>text.includes(writeText.trim())&&fs.readFileSync(created,'utf8')===writeText},
  {toolName:'replace',arguments:{file_path:created,old_string:writeText,new_string:replaceText},verify:text=>fs.readFileSync(created,'utf8')===replaceText&&/success|replaced|modified|edit/i.test(text)},
 ]},
 GCW_TOOL_WRITE_REJECT:{toolName:'write_file',arguments:{file_path:rejected,content:'MUST_NOT_BE_WRITTEN'},verify:text=>!fs.existsSync(rejected)&&deniedText(text)},
 GCW_TOOL_WRITE_CANCEL:{toolName:'write_file',arguments:{file_path:cancelled,content:'MUST_NOT_BE_WRITTEN'},verify:()=>false},
 GCW_TOOL_WRITE_ASK:{toolName:'write_file',arguments:{file_path:ask,content:'MUST_NOT_BE_WRITTEN'},verify:text=>!fs.existsSync(ask)&&deniedText(text)},
 GCW_TOOL_COMMAND_ALLOW:{toolName:'run_shell_command',arguments:{command:commandFor('success'),directory:workspace},verify:text=>fs.existsSync(commands.outputs.success)&&fs.readFileSync(commands.outputs.success,'utf8')==='GCW_COMMAND_SUCCESS'&&/Exit Code: 0/.test(text)&&text.includes('GCW_COMMAND_STDOUT_0')&&text.includes('GCW_COMMAND_STDERR_0')},
 GCW_TOOL_COMMAND_FAILURE:{toolName:'run_shell_command',arguments:{command:commandFor('failure'),directory:workspace},verify:text=>fs.existsSync(commands.outputs.failure)&&/Exit Code: 7/.test(text)&&text.includes('GCW_COMMAND_STDOUT_7')},
 GCW_TOOL_COMMAND_REJECT:{toolName:'run_shell_command',arguments:{command:commandFor('reject'),directory:workspace},verify:text=>!fs.existsSync(commands.outputs.reject)&&deniedText(text)},
 GCW_TOOL_COMMAND_CANCEL:{toolName:'run_shell_command',arguments:{command:commandFor('slow'),directory:workspace},verify:()=>false},
 GCW_TOOL_COMMAND_WAIT_CANCEL:{toolName:'run_shell_command',arguments:{command:commandFor('reject'),directory:workspace},verify:()=>false},
 GCW_TOOL_COMMAND_ASK:{toolName:'run_shell_command',arguments:{command:commandFor('success'),directory:workspace},verify:text=>fs.existsSync(commands.outputs.success)&&/Exit Code: 0/.test(text)&&text.includes('GCW_COMMAND_STDOUT_0')},
};
const mock=await startMockProvider({toolPlans});
fs.writeFileSync(path.join(workspace,'.gamecowork-cli/settings.json'),JSON.stringify({selectedAuthType:'gamecowork-oauth',model:mock.model,disableNextSpeakerCheck:true,
 contentGenerator:{authType:'gamecowork-oauth',wireApi:'chat',overrides:{model:{authType:'openai',wireApi:'chat'}}}}));
const env={...process.env};for(const key of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete env[key];
Object.assign(env,{GAMECOWORK_CLI_HOME:path.join(root,'cli-state'),GAMECOWORK_USER_DATA_DIR:path.join(root,'user-state'),GAMECOWORK_CLI_RESOURCE_DIR:path.join(pkg,'resources'),
 GAMECOWORK_LOCAL_PROVIDER_MODE:'1',GAMECOWORK_DISABLE_AUTO_UPDATE:'1',CUSTOM_AUTH:'1',GAMECOWORK_CLI_PROBE_ROOT:root,GAMECOWORK_CLI_PROBE_SOURCE:pkg,
 OPENAI_API_KEY:mock.apiKey,OPENAI_BASE_URL:mock.baseUrl,OPENAI_MODEL:mock.model});
env.GAMECOWORK_CLI_TOOL_CAPS=JSON.stringify(commands);
let child,stdout='',stderr='',sequence=0,currentDecision='reject';const pending=new Map(),permissions=[],notifications=[],checks=[],ownedPids=[];
const check=(name,passed)=>{checks.push({name,passed:!!passed});assert.ok(passed,name);console.log(`${name}: PASS`);};
function respond(id,result){child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,result})+'\n');}
function launch(mode='default'){
 child=spawn(path.join(pkg,'gamecowork.exe'),['--experimental-acp','--upm=false','--collaboration-mode',mode,'--approval-mode','auto_edit','--disable-next-speaker-check'],{cwd:workspace,env,windowsHide:true,stdio:['pipe','pipe','pipe']});ownedPids.push(child.pid);let carry='';
 child.stdout.on('data',bytes=>{stdout+=bytes.toString();carry+=bytes.toString();let end;while((end=carry.indexOf('\n'))>=0){const line=carry.slice(0,end);carry=carry.slice(end+1);let frame;try{frame=JSON.parse(line);}catch{continue;}
  if(!frame.method&&pending.has(frame.id)){const owner=pending.get(frame.id);pending.delete(frame.id);clearTimeout(owner.timer);owner.resolve(frame);}
  else if(frame.method&&frame.id!==undefined){const params=frame.params||{};const name=params.toolCall?.name;permissions.push({id:frame.id,method:frame.method,toolName:name,options:params.options,toolCallId:params.toolCall?.toolCallId});
   if(frame.method==='session/request_permission'&&['write_file','replace','run_shell_command'].includes(name)){
    if(currentDecision==='hold')continue;
    const option=params.options.find(option=>option.kind===(currentDecision==='allow'?'allow_once':'reject_once'));assert.ok(option,'CLI supplied the selected permission kind');respond(frame.id,{outcome:{outcome:'selected',optionId:option.optionId}});
   }else respond(frame.id,{outcome:{outcome:'cancelled'}});
  }else notifications.push(frame);
 }});child.stderr.on('data',bytes=>stderr+=bytes.toString());
}
function rpc(method,params){const id=++sequence;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error(`RPC timeout: ${method}`));},25000);pending.set(id,{resolve,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});}
async function stop(){if(!child||child.exitCode!==null||child.signalCode!==null)return;const own=child;const ended=new Promise(resolve=>own.once('exit',resolve));await promisify(execFile)(commands.taskkill,['/PID',String(own.pid),'/T','/F'],{windowsHide:true});await ended;}
async function waitFor(test,label){const deadline=Date.now()+10000;while(!test()){if(Date.now()>deadline)throw Error(label);await new Promise(resolve=>setTimeout(resolve,20));}}
async function session(mode='default'){const init=await rpc('initialize',{protocolVersion:1,clientCapabilities:{fs:{readTextFile:false,writeTextFile:false},terminal:false}});check('Actual ACP initialization',init.result?.protocolVersion===1);const opened=await rpc('session/new',{cwd:workspace,mcpServers:[]});check('Actual configured session opens',typeof opened.result?.sessionId==='string');const modeChanged=await rpc('_gamecowork/session/set_mode',{sessionId:opened.result.sessionId,collaborationMode:mode,approvalMode:'default'});check('Actual 2D API changes auto-edit to strict default in one request',modeChanged.error===undefined&&typeof modeChanged.result==='object');const invalid=await rpc('_gamecowork/session/set_mode',{sessionId:opened.result.sessionId,collaborationMode:mode,approvalMode:'invalid-fixture-mode'});check('Actual 2D schema rejects invalid approval values',invalid.error?.code===-32602);return opened.result.sessionId;}
async function prompt(sessionId,key,decision){currentDecision=decision;return rpc('session/prompt',{sessionId,prompt:[{type:'text',text:`${key}: use exactly the requested tool on this owned fixture.`}]});}
let failure;
try{
 launch();const sid=await session();
 let before=permissions.length;const allowed=await prompt(sid,'GCW_TOOL_WRITE_ALLOW','allow');check('Approved real write ends normally',allowed.result?.stopReason==='end_turn');check('Approved file bytes are real',fs.readFileSync(created,'utf8')===writeText);check('Default file edit requires a real approval',permissions.slice(before).some(permission=>permission.toolName==='write_file'));check('Provider confirmed write using matching issued tool ID',mock.requests.some(request=>request.scenario==='GCW_TOOL_WRITE_ALLOW'&&request.toolResultMatchedIssuedId&&request.toolResultVerified));
 before=permissions.length;await prompt(sid,'GCW_TOOL_REPLACE_ALLOW','allow');check('Approved replace changes exact disk bytes',fs.readFileSync(created,'utf8')===replaceText);check('Replace requested its own approval',permissions.slice(before).some(permission=>permission.toolName==='replace'));check('Provider confirmed replace with actual matched result',mock.requests.some(request=>request.scenario==='GCW_TOOL_REPLACE_ALLOW'&&request.toolResultVerified));check('Read then replace used two separately verified real tool IDs',mock.requests.some(request=>request.scenario==='GCW_TOOL_REPLACE_ALLOW'&&request.requestedActionTool==='read_file')&&mock.requests.some(request=>request.scenario==='GCW_TOOL_REPLACE_ALLOW'&&request.toolResultVerified&&request.verifiedStepCount===2));
 await prompt(sid,'GCW_TOOL_WRITE_REJECT','reject');check('Rejected write never created a file',!fs.existsSync(rejected));check('Provider received actual rejection for the issued tool ID',mock.requests.some(request=>request.scenario==='GCW_TOOL_WRITE_REJECT'&&request.toolResultVerified));
 before=permissions.length;const held=prompt(sid,'GCW_TOOL_WRITE_CANCEL','hold');await waitFor(()=>permissions.slice(before).some(permission=>permission.toolName==='write_file'),'Waiting permission did not arrive');child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'session/cancel',params:{sessionId:sid}})+'\n');const result=await held;check('Cancel interrupts pending approval without executing tool',result.result?.stopReason==='cancelled'&&!fs.existsSync(cancelled));
 before=permissions.length;await prompt(sid,'GCW_TOOL_COMMAND_ALLOW','allow');check('Default command execution requests actual permission',permissions.slice(before).some(permission=>permission.toolName==='run_shell_command'));check('Real runner stdout/stderr and exit 0 returned with matching tool ID',mock.requests.some(request=>request.scenario==='GCW_TOOL_COMMAND_ALLOW'&&request.toolResultMatchedIssuedId&&request.toolResultVerified));
 await prompt(sid,'GCW_TOOL_COMMAND_FAILURE','allow');check('Real nonzero command exit 7 reaches Provider without fake success',mock.requests.some(request=>request.scenario==='GCW_TOOL_COMMAND_FAILURE'&&request.toolResultVerified));
 await prompt(sid,'GCW_TOOL_COMMAND_REJECT','reject');check('Rejected command never executes the fixture script',!fs.existsSync(commands.outputs.reject)&&mock.requests.some(request=>request.scenario==='GCW_TOOL_COMMAND_REJECT'&&request.toolResultVerified));
 before=permissions.length;const waitingCommand=prompt(sid,'GCW_TOOL_COMMAND_WAIT_CANCEL','hold');await waitFor(()=>permissions.slice(before).some(permission=>permission.toolName==='run_shell_command'),'Waiting command approval did not arrive');child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'session/cancel',params:{sessionId:sid}})+'\n');const waitingResult=await waitingCommand;check('Cancel pending command permission performs no execution',waitingResult.result?.stopReason==='cancelled'&&!fs.existsSync(commands.outputs.reject));
 const running=prompt(sid,'GCW_TOOL_COMMAND_CANCEL','allow');await waitFor(()=>fs.existsSync(commands.slowPidFile),'Actual slow command never started');const slowPid=JSON.parse(fs.readFileSync(commands.slowPidFile,'utf8')).pid;child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'session/cancel',params:{sessionId:sid}})+'\n');const stopped=await running;check('Cancel ends actual running command prompt',stopped.result?.stopReason==='cancelled');await waitFor(()=>{try{process.kill(slowPid,0);return false;}catch{return true;}},'Owned script remained alive after cancel');check('Cancel stops own real script before final output write',!fs.existsSync(commands.outputs.slow));
 await stop();launch('ask');const askSid=await session('ask');before=permissions.length;await prompt(askSid,'GCW_TOOL_WRITE_ASK','allow');check('Ask mode never writes the requested fixture',!fs.existsSync(ask));check('Ask mode file mutation does not offer an unsafe allow button',!permissions.slice(before).some(permission=>permission.toolName==='write_file'));fs.rmSync(commands.outputs.success);before=permissions.length;await prompt(askSid,'GCW_TOOL_COMMAND_ASK','allow');const askPermission=permissions.slice(before).find(permission=>permission.toolName==='run_shell_command');check('Ask command offers only once/reject rather than always allow',askPermission&&askPermission.options.every(option=>['allow_once','reject_once'].includes(option.kind)));check('Ask mode executes explicitly approved real command',mock.requests.some(request=>request.scenario==='GCW_TOOL_COMMAND_ASK'&&request.toolResultMatchedIssuedId&&request.toolResultVerified));
 const guardFile=path.join(root,'guard-events.jsonl');const events=fs.existsSync(guardFile)?fs.readFileSync(guardFile,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];check('All model requests stayed on loopback',!events.some(event=>/fetch|https?\.request|net\.connect/.test(event.operation)));
}catch(error){failure={message:error.message,stack:error.stack};process.exitCode=1;}
finally{await stop();for(const owner of pending.values())clearTimeout(owner.timer);await mock.close();fs.writeFileSync(path.join(root,'stdout.txt'),stdout);fs.writeFileSync(path.join(root,'stderr.txt'),stderr);fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify({checks,permissions,requests:mock.requests,notifications,failure,ownedPids},null,2));console.log(JSON.stringify({root,passed:checks.filter(check=>check.passed).length,total:checks.length,failure:failure?.message,ownedPids}));}
