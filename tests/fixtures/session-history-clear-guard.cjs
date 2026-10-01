// Test-only read/write/network/process guard plus actual redacted PID evidence.
require('./core-chat-spawn-guard.cjs');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(process.env.GAMECOWORK_SMOKE_ROOT),agent=path.resolve(process.env.GAMECOWORK_SMOKE_CLI_PATH);
const temp=path.resolve('F:/AI/AgentMake/temp/GameCowork');
if(!root.toLowerCase().startsWith(temp.toLowerCase()+path.sep))throw Error('History clear integration requires its owned temporary root');
const record=value=>fs.appendFileSync(path.join(root,'process-events.jsonl'),JSON.stringify(value)+'\n');
record({event:'core-start',pid:process.pid,parentPid:process.ppid,entry:process.argv[1],cwd:process.cwd()});
const original=cp.spawn.bind(cp);
cp.spawn=(command,args,options,...rest)=>{
 const child=original(command,args,options,...rest);
 if(typeof command==='string'&&path.resolve(command).toLowerCase()===agent.toLowerCase()){
  const flags=(args||[]).filter(value=>typeof value==='string'&&value.startsWith('--'));
  record({event:'agent-spawn',pid:child.pid,corePid:process.pid,command,cwd:options?.cwd,flags,acp:flags.includes('--experimental-acp')});
  child.once('exit',(code,signal)=>record({event:'agent-exit',pid:child.pid,corePid:process.pid,code,signal}));
 }
 return child;
};
