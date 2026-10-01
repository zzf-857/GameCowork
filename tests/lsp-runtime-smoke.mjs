// Frozen real csharp-ls stdio preflight. This is not product LSP acceptance.
// Only owned SDK 10 projects and isolated NuGet/cache/log directories are used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID,createHash} from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';

const exec=promisify(execFile);
const args=process.argv.slice(2);
const option=(name,fallback)=>{const index=args.indexOf(name);return index<0?fallback:args[index+1];};
const base=path.resolve('F:/AI/AgentMake/temp/GameCowork');
const run=path.resolve(option('--output',path.join(base,'tests',`lsp-runtime-${randomUUID()}`)));
assert.ok(run.toLowerCase().startsWith(base.toLowerCase()+path.sep),'All preflight output must remain in temp/GameCowork');
assert.equal(fs.existsSync(run),false,'The test owns a newly created unique output directory');
fs.mkdirSync(run,{recursive:true});
const runtime=path.resolve(option('--runtime',path.join(base,'lsp-preparation-20261001-01/runtime/csharp-ls.exe')));
const ledgerFile=path.resolve(option('--ledger',path.join(path.dirname(runtime),'../dependency-ledger.json')));
const ledger=JSON.parse(fs.readFileSync(ledgerFile,'utf8'));
assert.equal(ledger.name,'csharp-ls');assert.equal(ledger.version,'0.21.0');
for(const record of ledger.files){const file=path.resolve(path.dirname(runtime),record.path);assert.ok(file.toLowerCase().startsWith(path.dirname(runtime).toLowerCase()+path.sep));assert.equal(fs.statSync(file).size,record.size,record.path);assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),record.sha256.toLowerCase(),record.path);}

const checks=[],owned=new Set();let failure;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const normalized=value=>String(value).replaceAll('\\','/').toLowerCase();
const alive=pid=>{try{process.kill(pid,0);return true;}catch{return false;}};
function environment(project){const env={...process.env,DOTNET_CLI_HOME:path.join(project,'cli-home'),DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_NOLOGO:'1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE:'1',MSBUILDDISABLENODEREUSE:'1',NUGET_PACKAGES:path.join(run,'nuget-packages'),NUGET_HTTP_CACHE_PATH:path.join(run,'nuget-http-cache'),NUGET_PLUGINS_CACHE_PATH:path.join(run,'nuget-plugin-cache'),NuGetAudit:'false',TEMP:path.join(project,'temporary'),TMP:path.join(project,'temporary')};for(const key of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];return env;}
async function makeProject(name,returnType){
 const root=path.join(run,name);fs.mkdirSync(path.join(root,'temporary'),{recursive:true});fs.mkdirSync(path.join(root,'cli-home'));
 fs.writeFileSync(path.join(root,'global.json'),JSON.stringify({sdk:{version:'10.0.103',rollForward:'disable'}}));
 fs.writeFileSync(path.join(root,'NuGet.Config'),'<?xml version="1.0" encoding="utf-8"?><configuration><packageSources><clear /></packageSources><auditSources><clear /></auditSources></configuration>');
 fs.writeFileSync(path.join(root,name+'.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><TargetFramework>net10.0</TargetFramework><ImplicitUsings>disable</ImplicitUsings><Nullable>enable</Nullable><NuGetAudit>false</NuGetAudit></PropertyGroup></Project>');
 const type=returnType==='int'?'int':'string';const left=type==='int'?'20':'"A"',right=type==='int'?'22':'"B"';
 const content=[`namespace GameCoworkLspFixture;`,'public sealed class Calculator','{',`    public ${type} Combine(${type} left, ${type} right) => left + right;`,`    public ${type} First() => Combine(${left}, ${right});`,`    public ${type} Second() => Combine(${left}, ${right});`,'}',''].join('\n');
 const file=path.join(root,'Calculator.cs');fs.writeFileSync(file,content);
 const logs=[];
 for(const command of[['new','sln','--format','sln','--name',name,'--output',root],['sln',path.join(root,name+'.sln'),'add',path.join(root,name+'.csproj')],['restore',path.join(root,name+'.csproj'),'--configfile',path.join(root,'NuGet.Config'),'--verbosity','quiet','-p:NuGetAudit=false','-p:RestoreIgnoreFailedSources=false']]){
  const result=await exec('dotnet',command,{cwd:root,env:environment(root),windowsHide:true,timeout:60000,maxBuffer:1024*1024});logs.push({command:['dotnet',...command],stdout:result.stdout,stderr:result.stderr});
 }
 fs.writeFileSync(path.join(root,'prepare.json'),JSON.stringify(logs,null,2));
 return{root,file,uri:pathToFileURL(file).href,solution:path.join(root,name+'.sln'),content,type};
}
function position(content,needle,occurrence=0){let offset=-1;for(let i=0;i<=occurrence;i++){offset=content.indexOf(needle,offset+1);assert.ok(offset>=0,needle);}const before=content.slice(0,offset);const lines=before.split('\n');return{line:lines.length-1,character:lines.at(-1).length};}
function hoverText(value){const content=value?.contents;if(Array.isArray(content))return content.map(item=>typeof item==='string'?item:item.value).join('\n');return typeof content==='string'?content:content?.value||'';}
function locations(value){return(Array.isArray(value)?value:value?[value]:[]).map(item=>item.uri?item:{uri:item.targetUri,range:item.targetSelectionRange||item.targetRange});}
async function until(fn,label,timeout=60000){const deadline=Date.now()+timeout;for(;;){const value=await fn();if(value)return value;assert.ok(Date.now()<deadline,`Timeout: ${label}`);await sleep(200);}}

class Rpc{
 constructor(project){this.project=project;this.sequence=0;this.pending=new Map();this.buffer=Buffer.alloc(0);this.messages=[];this.stderr='';this.descendants=[];this.closed=false;
  this.child=spawn(runtime,['--solution',project.solution,'--loglevel','warning'],{cwd:project.root,env:environment(project.root),windowsHide:true,stdio:['pipe','pipe','pipe']});owned.add(this);
  this.child.stdout.on('data',chunk=>{try{this.receive(chunk);}catch(error){this.rejectAll(error);}});this.child.stderr.on('data',chunk=>{this.stderr+=chunk;fs.appendFileSync(path.join(project.root,'server.stderr.log'),chunk);});
  this.child.on('error',error=>this.rejectAll(error));this.child.on('exit',(code,signal)=>{this.closed=true;this.exit={code,signal};this.rejectAll(new Error(`LSP exited ${code}/${signal}`));});
 }
 write(message){const content=Buffer.from(JSON.stringify(message),'utf8');this.child.stdin.write(Buffer.concat([Buffer.from(`Content-Length: ${content.length}\r\n\r\n`,'ascii'),content]));}
 notify(method,params){this.messages.push({direction:'client',method,...(['textDocument/didOpen','textDocument/didChange'].includes(method)?{version:params.textDocument.version}: {})});this.write({jsonrpc:'2.0',method,params});}
 request(method,params,timeout=30000){const id=++this.sequence;this.messages.push({direction:'client',id,method});return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);this.notify('$/cancelRequest',{id});reject(new Error(`${method} request timed out`));},timeout);this.pending.set(id,{resolve,reject,timer,method});this.write({jsonrpc:'2.0',id,method,...(params===undefined?{}:{params})});});}
 rejectAll(error){for(const record of this.pending.values()){clearTimeout(record.timer);record.reject(error);}this.pending.clear();}
 receive(chunk){this.buffer=Buffer.concat([this.buffer,chunk]);assert.ok(this.buffer.length<=4*1024*1024,'LSP frame has a bounded size');for(;;){const split=this.buffer.indexOf('\r\n\r\n');if(split<0)return;const header=this.buffer.subarray(0,split).toString('ascii');const match=header.match(/^Content-Length: (\d+)$/mi);assert.ok(match,'Server uses LSP Content-Length framing');const length=+match[1];assert.ok(length<=4*1024*1024);if(this.buffer.length<split+4+length)return;const message=JSON.parse(this.buffer.subarray(split+4,split+4+length).toString('utf8'));this.buffer=this.buffer.subarray(split+4+length);this.handle(message);}}
 handle(message){this.messages.push({direction:'server',...message});if(message.method){if(message.id!==undefined){let result=null,error;
   if(message.method==='workspace/configuration')result=(message.params.items||[]).map(item=>item.section==='csharp'?{solution:this.project.solution}:null);
   else if(message.method==='workspace/workspaceFolders')result=[{uri:pathToFileURL(this.project.root).href,name:path.basename(this.project.root)}];
   else if(message.method==='workspace/applyEdit')result={applied:false,failureReason:'The preflight does not apply server edits'};
   else if(!['client/registerCapability','client/unregisterCapability','window/workDoneProgress/create','window/showMessageRequest'].includes(message.method))error={code:-32601,message:'Unsupported preflight client method'};
   this.write({jsonrpc:'2.0',id:message.id,...(error?{error}:{result})});
  }return;}
  const pending=this.pending.get(message.id);if(!pending)return;clearTimeout(pending.timer);this.pending.delete(message.id);if(message.error)pending.reject(new Error(`${pending.method}: ${JSON.stringify(message.error)}`));else pending.resolve(message.result);
 }
 async initialize(){
  const result=await this.request('initialize',{
   processId:process.pid,clientInfo:{name:'GameCowork isolated LSP preflight',version:'1'},
   rootUri:pathToFileURL(this.project.root).href,
   workspaceFolders:[{uri:pathToFileURL(this.project.root).href,name:path.basename(this.project.root)}],
   capabilities:{workspace:{configuration:true,workspaceFolders:true,workDoneProgress:true},textDocument:{synchronization:{dynamicRegistration:false,didSave:true},hover:{contentFormat:['plaintext','markdown']},definition:{linkSupport:true},references:{dynamicRegistration:false}},general:{positionEncodings:['utf-16']}}
  },60000);
  assert.ok(result.capabilities);this.initialized=result;this.notify('initialized',{});
  this.notify('textDocument/didOpen',{textDocument:{uri:this.project.uri,languageId:'csharp',version:1,text:this.project.content}});return result;
 }
 async hover(content,needle='Combine',occurrence=1){return this.request('textDocument/hover',{textDocument:{uri:this.project.uri},position:position(content,needle,occurrence)});}
 async definition(content,needle='Combine',occurrence=1){return locations(await this.request('textDocument/definition',{textDocument:{uri:this.project.uri},position:position(content,needle,occurrence)}));}
 async references(content,needle='Combine',occurrence=1){return locations(await this.request('textDocument/references',{textDocument:{uri:this.project.uri},position:position(content,needle,occurrence),context:{includeDeclaration:true}}));}
 async collectDescendants(){if(process.platform!=='win32')return;const result=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`$ownedLspRows = @(Get-CimInstance Win32_Process); $ownedLspPending = @(${this.child.pid}); $ownedLspFound = @(); $ownedLspSeen = [Collections.Generic.HashSet[int]]::new(); while ($ownedLspPending.Count -gt 0) { $ownedLspNext = @(); foreach ($ownedLspParent in $ownedLspPending) { if (-not $ownedLspSeen.Add([int]$ownedLspParent)) { continue }; $ownedLspChildren = @($ownedLspRows | Where-Object ParentProcessId -eq $ownedLspParent); $ownedLspFound += $ownedLspChildren; $ownedLspNext += @($ownedLspChildren | ForEach-Object { $_.ProcessId }) }; $ownedLspPending = $ownedLspNext }; @($ownedLspFound | Select-Object ProcessId,ParentProcessId,CommandLine) | ConvertTo-Json -Compress`],{windowsHide:true,timeout:15000,maxBuffer:1024*1024});const parsed=result.stdout.trim()?JSON.parse(result.stdout):[];this.descendants=Array.isArray(parsed)?parsed:[parsed];}
 async stop(){if(!owned.has(this))return;await this.collectDescendants();if(!this.closed){await this.request('shutdown',undefined,10000);this.notify('exit',undefined);await until(()=>this.closed,'LSP graceful exit',10000);}assert.equal(this.exit.code,0,'Server exits normally after shutdown/exit');assert.equal(alive(this.child.pid),false);for(const descendant of this.descendants)await until(()=>!alive(descendant.ProcessId),`LSP descendant ${descendant.ProcessId} exit`,10000);owned.delete(this);}
 async cleanup(){if(!owned.has(this))return;await this.collectDescendants().catch(()=>{});if(alive(this.child.pid)){if(process.platform==='win32')await exec('taskkill.exe',['/PID',String(this.child.pid),'/T','/F'],{windowsHide:true}).catch(()=>{});else this.child.kill('SIGTERM');}for(const descendant of this.descendants){if(!alive(descendant.ProcessId))continue;if(process.platform==='win32'){const result=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${descendant.ProcessId}' -ErrorAction SilentlyContinue).CommandLine`],{windowsHide:true}).catch(()=>({stdout:''}));if(normalized(result.stdout).includes(normalized(this.project.root)))await exec('taskkill.exe',['/PID',String(descendant.ProcessId),'/T','/F'],{windowsHide:true}).catch(()=>{});}}owned.delete(this);}
 report(){return{pid:this.child.pid,project:this.project.root,initialize:this.initialized,exit:this.exit,descendants:this.descendants,messages:this.messages};}
}

const servers=[];
try{
 const projects=await Promise.all([makeProject('WorkspaceA','int'),makeProject('WorkspaceB','string')]);checks.push('Both owned SDK 10 projects restore using clear NuGet sources and the installed SDK only');
 const [a,b]=projects.map(project=>{const server=new Rpc(project);servers.push(server);return server;});
 const initialized=await Promise.all(servers.map(server=>server.initialize()));for(const response of initialized){assert.equal(response.capabilities.hoverProvider,true);assert.ok(response.capabilities.definitionProvider);assert.ok(response.capabilities.referencesProvider);}checks.push('Two frozen csharp-ls processes initialize with real hover/definition/references capabilities');
 const hoverA=await until(async()=>{const result=await a.hover(a.project.content);return hoverText(result).includes('int')&&hoverText(result).includes('Combine')?result:null;},'integer method semantic hover');const hoverB=await until(async()=>{const result=await b.hover(b.project.content);return hoverText(result).includes('string')&&hoverText(result).includes('Combine')?result:null;},'string method semantic hover');assert.ok(!hoverText(hoverA).includes('string left'));assert.ok(hoverText(hoverB).includes('string'));checks.push('Real semantic hover distinguishes identical class/method names in int A and string B');
 const definitions=await Promise.all([a.definition(a.project.content),b.definition(b.project.content)]);for(let index=0;index<2;index++){assert.equal(definitions[index].length,1);assert.equal(definitions[index][0].uri,projects[index].uri);assert.equal(definitions[index][0].range.start.line,3);}checks.push('Real definition resolves each call to its own workspace declaration and exact line');
 const refs=await Promise.all([a.references(a.project.content),b.references(b.project.content)]);for(let index=0;index<2;index++){assert.deepEqual(refs[index].map(item=>item.range.start.line).sort((x,y)=>x-y),[3,4,5]);assert.ok(refs[index].every(item=>item.uri===projects[index].uri));}checks.push('Real references find declaration plus both call sites without crossing A/B');
 const edited=a.project.content.replaceAll('Combine','UnsavedAdd').replace('public int Second() => UnsavedAdd(20, 22);','public int Second() => 0;');a.notify('textDocument/didChange',{textDocument:{uri:a.project.uri,version:2},contentChanges:[{text:edited}]});const unsavedHover=await until(async()=>{const result=await a.hover(edited,'UnsavedAdd',1);return hoverText(result).includes('UnsavedAdd')?result:null;},'unsaved renamed symbol');assert.ok(hoverText(unsavedHover).includes('int'));const unsavedDefinition=await a.definition(edited,'UnsavedAdd',1);assert.equal(unsavedDefinition[0].uri,a.project.uri);assert.equal(unsavedDefinition[0].range.start.line,3);const unsavedRefs=await a.references(edited,'UnsavedAdd',1);assert.deepEqual(unsavedRefs.map(item=>item.range.start.line).sort((x,y)=>x-y),[3,4]);assert.equal(fs.readFileSync(a.project.file,'utf8'),a.project.content);checks.push('didChange full text/version 2 changes hover/definition/reference semantics while disk bytes remain unchanged');
 const beforeB=await b.hover(b.project.content);assert.ok(hoverText(beforeB).includes('Combine'));assert.ok(!hoverText(beforeB).includes('UnsavedAdd'));checks.push('Unsaved A edits do not change B server content or semantic results');
 const unicode=edited.replace('    public int First() => UnsavedAdd(20, 22);','    // 😀 中文 keeps UTF-16 columns distinct from UTF-8 bytes\n    public int First() => /* 😀 */ UnsavedAdd(20, 22);');a.notify('textDocument/didChange',{textDocument:{uri:a.project.uri,version:3},contentChanges:[{text:unicode}]});const unicodeHover=await until(async()=>{const result=await a.hover(unicode,'UnsavedAdd',1);return hoverText(result).includes('UnsavedAdd')?result:null;},'UTF-16 Unicode position');assert.ok(hoverText(unicodeHover).includes('int'));const unicodeRefs=await a.references(unicode,'UnsavedAdd',1);assert.deepEqual(unicodeRefs.map(item=>item.range.start.line).sort((x,y)=>x-y),[3,5]);checks.push('Content-Length uses UTF-8 bytes while C# source positions and unsaved versions use UTF-16 columns');
 a.notify('textDocument/didClose',{textDocument:{uri:a.project.uri}});a.notify('textDocument/didOpen',{textDocument:{uri:a.project.uri,languageId:'csharp',version:1,text:a.project.content}});await until(async()=>{const result=await a.hover(a.project.content);return hoverText(result).includes('Combine')&&!hoverText(result).includes('UnsavedAdd');},'balanced close/reopen original semantic state');checks.push('Balanced didClose/reopen returns to original disk content without stale unsaved symbols');
 await a.stop();assert.equal(alive(b.child.pid),true);assert.ok(hoverText(await b.hover(b.project.content)).includes('string'));checks.push('A shutdown/exit reclaims its PID/descendants and leaves B serving real semantic requests');await b.stop();checks.push('B shutdown/exit also exits normally and leaves no recorded owned descendants');
}catch(error){failure=error;throw error;}finally{
 for(const server of [...owned])await server.cleanup();for(let index=0;index<servers.length;index++)fs.writeFileSync(path.join(run,`server-${index+1}.json`),JSON.stringify(servers[index].report(),null,2));
 fs.writeFileSync(path.join(run,'report.json'),JSON.stringify({success:!failure,preflightOnly:true,runtime,ledger:ledgerFile,frozenVersion:ledger.version,verifiedRuntimeFiles:ledger.files.length,checks,error:failure?.stack||null},null,2));console.log(JSON.stringify({success:!failure,checks:checks.length,preflightOnly:true,report:path.join(run,'report.json')}));
}
