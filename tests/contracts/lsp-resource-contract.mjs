// Frozen redistributable C# LSP resource contract; never assembles app/.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const hash=(bytes,algorithm='sha256',encoding='hex')=>createHash(algorithm).update(bytes).digest(encoding);
const within=(file,root)=>{const relative=path.relative(root,file);return relative!==''&&!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative);};
const normalRelative=value=>typeof value==='string'&&value.length>0&&!value.includes('\\')&&!path.posix.isAbsolute(value)&&!value.includes(':')&&value.split('/').every(part=>part&&part!=='.'&&part!=='..');
function inventory(root){
 const files=[];
 for(const entry of fs.readdirSync(root,{withFileTypes:true})){
  const file=path.join(root,entry.name),stat=fs.lstatSync(file);
  assert.equal(stat.isSymbolicLink(),false,`Linked resource is forbidden: ${file}`);
  if(stat.isDirectory())files.push(...inventory(file));else {assert.ok(stat.isFile(),file);files.push(file);}
 }
 return files;
}
export function verifyLspResources(input){
 const root=fs.realpathSync(path.resolve(input));
 for(const entry of ['runtime','dependency-ledger.json','dependency-ledger.sha256','LICENSE','README.md'])assert.equal(fs.lstatSync(path.join(root,entry)).isSymbolicLink(),false,`Linked resource input is forbidden: ${entry}`);
 const bytes=fs.readFileSync(path.join(root,'dependency-ledger.json'));
 const pin=fs.readFileSync(path.join(root,'dependency-ledger.sha256'),'utf8');
 assert.match(pin,/^[A-Fa-f0-9]{64}$/,'The compiler pin contains exactly 64 hex characters');
 assert.equal(hash(bytes),pin.toLowerCase(),'Frozen ledger pin');
 const ledger=JSON.parse(bytes);
 assert.equal(ledger.name,'csharp-ls');assert.equal(ledger.version,'0.21.0');
 assert.equal(ledger.source,'https://api.nuget.org/v3/index.json');
 assert.equal(ledger.files.length,298,'Original frozen 298-file closure');
 assert.equal(ledger.preparationLedgerSha256,'B9AB61F38084A89ED45B45EFDAC97A9553707DD337A45A02C782790E7BF2D234');
 assert.equal(ledger.package.repositoryCommit,'e1f0534a843db516024dc0b2a74df27b9e24adc6');
 assert.equal(ledger.runtimeRequirement.framework,'Microsoft.NETCore.App');assert.equal(ledger.runtimeRequirement.majorVersion,10);
 assert.equal(ledger.runtimeRequirement.bundled,false);assert.equal(ledger.entry.renamed,false);
 const runtime=path.join(root,'runtime'),canonicalRuntime=fs.realpathSync(runtime),records=new Map();
 assert.ok(within(canonicalRuntime,root),'Runtime remains inside its resource root');
 for(const record of ledger.files){
  assert.ok(normalRelative(record.path),`Unsafe resource path: ${record.path}`);assert.equal(records.has(record.path),false,`Duplicate resource: ${record.path}`);
  assert.match(record.sha256,/^[A-Fa-f0-9]{64}$/);assert.ok(Number.isSafeInteger(record.size)&&record.size>=0);
  const file=path.join(runtime,record.path);assert.ok(within(fs.realpathSync(file),canonicalRuntime),record.path);
  const content=fs.readFileSync(file);assert.equal(content.length,record.size,record.path);assert.equal(hash(content),record.sha256.toLowerCase(),record.path);records.set(record.path,record);
 }
 const actual=inventory(runtime).map(file=>path.relative(runtime,file).replaceAll('\\','/')).sort();
 assert.deepEqual(actual,[...records.keys()].sort(),'No unrecorded runtime resource');
 assert.ok(records.has('csharp-ls.exe'));
 const shim=fs.readFileSync(path.join(runtime,'csharp-ls.exe')),needle=Buffer.from('CSharpLanguageServer.dll');
 const offset=shim.indexOf(needle);assert.ok(offset>=0,'Managed assembly is embedded in the official shim');
 const assembly=shim.subarray(shim.lastIndexOf(0,offset)+1,shim.indexOf(0,offset)).toString('utf8').replaceAll('\\','/');
 assert.equal(assembly,'.store/csharp-ls/0.21.0/csharp-ls/0.21.0/tools/net10.0/any/CSharpLanguageServer.dll','The shim has no old absolute installation path');
 assert.ok(records.has(assembly));assert.equal(ledger.entry.executable,'runtime/csharp-ls.exe');assert.equal(ledger.entry.managedAssembly,'runtime/'+assembly);
 assert.equal(ledger.license.expression,'MIT');assert.equal(ledger.license.path,'LICENSE');
 assert.equal(ledger.license.sha256,'2077A187C02688A6E2E816EA81F846667C50D09C2EE5C7F0F82594B452E63118');
 const license=fs.readFileSync(path.join(root,'LICENSE'));assert.equal(hash(license),ledger.license.sha256.toLowerCase());
 assert.ok(license.toString('utf8').includes('Copyright (c) 2020-2021 Saulius Menkevičius'));
 assert.equal(ledger.license.source,'https://raw.githubusercontent.com/razzmatazz/csharp-language-server/0.21.0/LICENSE');
 assert.ok(normalRelative(ledger.package.path));assert.equal(ledger.package.licenseExpression,'MIT');
 const packageBytes=fs.readFileSync(path.join(root,ledger.package.path));
 assert.equal(hash(packageBytes),ledger.package.sha256.toLowerCase());assert.equal(hash(packageBytes,'sha512','base64'),ledger.package.rawArchiveSha512);
 assert.equal(ledger.package.url,'https://api.nuget.org/v3-flatcontainer/csharp-ls/0.21.0/csharp-ls.0.21.0.nupkg');
 const packageRoot=path.dirname(path.join(root,ledger.package.path)),nuspec=fs.readFileSync(path.join(packageRoot,'csharp-ls.nuspec'),'utf8');
 assert.equal(fs.readFileSync(path.join(packageRoot,'csharp-ls.0.21.0.nupkg.sha512'),'utf8').trim(),ledger.package.cachedArchiveSha512);
 assert.equal(JSON.parse(fs.readFileSync(path.join(packageRoot,'.nupkg.metadata'))).contentHash,ledger.package.nugetContentHash);
 assert.ok(nuspec.includes('<license type="expression">MIT</license>'));assert.ok(nuspec.includes(ledger.package.repositoryCommit));
 const deps=JSON.parse(fs.readFileSync(path.join(path.dirname(path.join(runtime,assembly)),'CSharpLanguageServer.deps.json')));
 const dependencies=Object.entries(deps.libraries).filter(([,value])=>value.type==='package').map(([idAndVersion,value])=>({idAndVersion,sha512:value.sha512}));
 assert.deepEqual(ledger.bundledDependencies.packages,dependencies);
 const config=JSON.parse(fs.readFileSync(path.join(path.dirname(path.join(runtime,assembly)),'CSharpLanguageServer.runtimeconfig.json')));
 assert.equal(config.runtimeOptions.framework.name,'Microsoft.NETCore.App');assert.equal(config.runtimeOptions.framework.version,'10.0.0');
 assert.ok(fs.statSync(path.join(root,'README.md')).isFile());
 return {root,runtimeFiles:records.size,ledgerSha256:pin,licenseSha256:ledger.license.sha256,bundledDependencyCount:dependencies.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),at=args.indexOf('--root'),root=path.resolve(at<0?path.join(project,'vendor/csharp-lsp'):args[at+1]);
 const result=verifyLspResources(root),checks=['Frozen source/runtime/package/license closure and relative shim verified'];
 let output;
 if(args.includes('--self-test')){
  output=path.join('F:/AI/AgentMake/temp/GameCowork/tests',`lsp-resources-${randomUUID()}`);
  const copy=path.join(output,'staging/lsp-csharp');fs.mkdirSync(path.dirname(copy),{recursive:true});
  if(process.platform==='win32'){
   const build=fs.readFileSync(path.join(project,'tools/build-local.ps1'),'utf8'),start=build.indexOf("$lspStaging = Join-Path $stagingRoot 'lsp-csharp'"),end=build.indexOf("if ($LASTEXITCODE -ne 0) { throw 'Staged C# LSP resources failed integrity checks.' }",start);
   assert.ok(start>=0&&end>start,'The production LSP staging block is present');
   const block=build.slice(start,end+"if ($LASTEXITCODE -ne 0) { throw 'Staged C# LSP resources failed integrity checks.' }".length);
   const quote=value=>"'"+value.replaceAll("'","''")+"'";
   const script=path.join(output,'stage-lsp-only.ps1');
   fs.writeFileSync(script,["$ErrorActionPreference = 'Stop'",`$lspSource = ${quote(root)}`,`$stagingRoot = ${quote(path.dirname(copy))}`,`$lspResourceContract = ${quote(fileURLToPath(import.meta.url))}`,block].join('\n'));
   execFileSync('pwsh.exe',['-NoProfile','-File',script],{cwd:project,windowsHide:true,timeout:30000,stdio:'pipe'});
   checks.push('Production PowerShell LSP staging block executes independently without building or updating app');
  }else fs.cpSync(root,copy,{recursive:true});
  verifyLspResources(copy);checks.push('Entire resource directory relocates with unchanged compiler pin');
  if(process.platform==='win32'){
   const trace=path.join(output,'staged-host-trace.log'),dotnetHome=path.join(output,'dotnet-home');fs.mkdirSync(dotnetHome);
   const env={...process.env,DOTNET_HOST_TRACE:'1',DOTNET_HOST_TRACEFILE:trace,DOTNET_CLI_HOME:dotnetHome,DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE:'1',DOTNET_NOLOGO:'1'};
   const version=execFileSync(path.join(copy,'runtime/csharp-ls.exe'),['--version'],{cwd:output,env,windowsHide:true,timeout:15000,encoding:'utf8'});
   assert.match(version,/csharp-ls, 0\.21\.0\.0/);
   const hostTrace=fs.readFileSync(trace,'utf8').replaceAll('\\','/').toLowerCase(),managed=path.join(copy,'runtime/.store/csharp-ls/0.21.0/csharp-ls/0.21.0/tools/net10.0/any/CSharpLanguageServer.dll').replaceAll('\\','/').toLowerCase();
   assert.ok(hostTrace.includes(`app path: [${managed}]`),'Host binds the actual relocated managed assembly');assert.equal(hostTrace.includes('lsp-preparation-20261001-01'),false,'Host does not probe the old preparation directory');
   checks.push('Staged real csharp-ls reports 0.21.0 and host trace binds only the relocated managed entry');
  }
  const cases=[
   ['Changed executable bytes','runtime/csharp-ls.exe',bytes=>{const changed=Buffer.from(bytes);changed[changed.length-1]^=1;return changed;}],
   ['Changed license bytes','LICENSE',bytes=>Buffer.concat([bytes,Buffer.from('changed')])],
   ['Changed compiler pin','dependency-ledger.sha256',()=>Buffer.from('0'.repeat(64))],
   ['Changed ledger bytes','dependency-ledger.json',bytes=>Buffer.concat([bytes,Buffer.from(' ')])]
  ];
  for(const [label,relative,change] of cases){const file=path.join(copy,relative),original=fs.readFileSync(file);fs.writeFileSync(file,change(original));assert.throws(()=>verifyLspResources(copy),undefined,label);fs.writeFileSync(file,original);checks.push(`${label} rejected`);}
  const extra=path.join(copy,'runtime/unrecorded.exe');fs.writeFileSync(extra,'not an upstream resource');assert.throws(()=>verifyLspResources(copy));fs.unlinkSync(extra);checks.push('Unrecorded executable resource rejected');
  verifyLspResources(copy);fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({success:true,...result,checks,assembledApp:false},null,2));
 }
 console.log(JSON.stringify({success:true,...result,checks:checks.length,report:output?path.join(output,'report.json'):null}));
}
