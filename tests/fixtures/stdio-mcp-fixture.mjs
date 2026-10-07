// Own newline-JSON MCP fixture. The parent must supply a unique temp root; this
// executable never reads a user project, invokes a command, or opens a network.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import assert from 'node:assert/strict';
const root=path.resolve(process.env.GAMECOWORK_STDIO_MCP_FIXTURE_ROOT||'');
const owned=path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work');
assert.ok(root.toLowerCase().startsWith(owned.toLowerCase()+path.sep),'MCP fixture needs its own temp root');
assert.ok(fs.statSync(root).isDirectory());
const log=path.join(root,'stdio-mcp-events.jsonl');
function record(value){fs.appendFileSync(log,JSON.stringify(value)+'\n');}
record({event:'started',pid:process.pid,cwd:process.cwd(),marker:process.env.GAMECOWORK_STDIO_MCP_SENTINEL||null});
const input=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
input.on('line',line=>{
  if(Buffer.byteLength(line)>65536){process.exitCode=7;input.close();return;}
  let message;try{message=JSON.parse(line);}catch{process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:null,error:{code:-32700,message:'Invalid JSON'}})+'\n');return;}
  record({event:'request',method:message.method,id:message.id,name:message.params?.name,arguments:message.params?.arguments,
    called:message.method==='tools/call'&&message.params?.name==='owned_echo'&&typeof message.params?.arguments?.value==='string'});
  if(message.id===undefined)return;
  let result,error;
  switch(message.method){
    case 'initialize':result={protocolVersion:message.params?.protocolVersion||'2024-11-05',capabilities:{tools:{}},serverInfo:{name:'GameCowork owned stdio MCP',version:'1.0.0'}};break;
    case 'ping':result={};break;
    case 'tools/list':result={tools:[{name:'owned_echo',description:'Return a test-owned echo marker without files or network',inputSchema:{type:'object',properties:{value:{type:'string'}},required:['value'],additionalProperties:false}}]};break;
    case 'tools/call':
      if(message.params?.name!=='owned_echo'||typeof message.params?.arguments?.value!=='string')error={code:-32602,message:'Unknown tool or invalid fixture token'};
      else result={content:[{type:'text',text:'OWNED_MCP_ECHO:'+message.params.arguments.value},{type:'text',text:JSON.stringify({pid:process.pid,marker:process.env.GAMECOWORK_STDIO_MCP_SENTINEL||null})}],isError:false};break;
    case 'resources/list':result={resources:[]};break;
    case 'prompts/list':result={prompts:[]};break;
    default:error={code:-32601,message:'Unsupported owned fixture method'};
  }
  process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:message.id,...(error?{error}:{result})})+'\n');
});
input.on('close',()=>{record({event:'stdin-closed',pid:process.pid});});
process.once('exit',code=>record({event:'exited',pid:process.pid,code}));
