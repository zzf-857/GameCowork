// Harmless scripts for real Agent command execution. A test artifact guard
// accepts only these exact runner/script commands and their original hashes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

export function createOwnedToolFixture(root, workspace=path.join(root,'workspace')) {
  const boundary=path.resolve('F:/AI/AgentMake/temp/GameCowork');
  root=path.resolve(root);workspace=path.resolve(workspace);
  assert.ok(root.toLowerCase().startsWith(boundary.toLowerCase()+path.sep));
  assert.ok(workspace.toLowerCase().startsWith(root.toLowerCase()+path.sep));
  assert.equal(process.platform,'win32');
  const runner=process.execPath;
  const shell=path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe');
  const taskkill=path.join(process.env.SystemRoot,'System32/taskkill.exe');
  for(const executable of[runner,shell,taskkill])assert.ok(fs.statSync(executable).isFile());
  const directory=path.join(workspace,'owned-tool-scripts');fs.mkdirSync(directory,{recursive:true});
  const outputs={},scripts=[];
  const quote=value=>`'${value.replaceAll("'","''")}'`;
  for(const [name,code] of[['success',0],['failure',7],['reject',0],['slow',0]]) {
    const file=path.join(directory,`${name}.mjs`),output=path.join(workspace,`command-${name}.txt`);
    outputs[name]=output;
    const literal=JSON.stringify(output);
    const source=`import fs from 'node:fs';\n`+
      (name==='slow' ? `fs.writeFileSync(${JSON.stringify(path.join(workspace,'command-slow-pid.json'))},JSON.stringify({pid:process.pid}));\nconsole.log('GCW_COMMAND_RUNNING');\nawait new Promise(resolve=>setTimeout(resolve,30000));\n` : '')+
      `fs.writeFileSync(${literal},'GCW_COMMAND_${name.toUpperCase()}');\nconsole.log('GCW_COMMAND_STDOUT_${code}');\nconsole.error('GCW_COMMAND_STDERR_${code}');\nprocess.exit(${code});\n`;
    fs.writeFileSync(file,source);
    // Propagate the actual native runner exit code; Windows PowerShell otherwise
    // normalizes a nonzero native code to its own command invocation status.
    const command=`& ${quote(runner)} ${quote(file)}; exit $LASTEXITCODE`;
    scripts.push({name,path:file,sha256:createHash('sha256').update(source).digest('hex'),command});
  }
  return {runner,shell,taskkill,workspace,scripts,outputs,slowPidFile:path.join(workspace,'command-slow-pid.json')};
}
