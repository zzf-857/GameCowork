const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const assert = require('node:assert/strict');
const test = require('node:test');

// Extract the actual subprocess admission code, with inert process handles.
// This tests denied shapes without starting any command or touching profiles.
const source = fs.readFileSync(path.join(__dirname, '../fixtures/cli-probe-guard.cjs'), 'utf8');
test('path validation may inspect exact fixture ancestors but never read content, enumerate, write or inspect siblings', async () => {
  const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/guard-contract-owned');
  const base = path.dirname(root), calls = [], denied = [];
  const fakeFs = { promises: {} };
  for (const name of ['readFile','readdir','access','stat','lstat','realpath','writeFile','mkdir','rm']) {
    fakeFs[name] = fakeFs[name+'Sync'] = value => { calls.push({name,value}); return value; };
    fakeFs.promises[name] = async value => { calls.push({name,value}); return value; };
  }
  fakeFs.realpathSync.native = value => { calls.push({name:'realpathSync.native',value});return value; };
  fakeFs.realpath.native = value => { calls.push({name:'realpath.native',value});return value; };
  const context = vm.createContext({ fs:fakeFs,path,root,source:path.resolve('F:/isolated-runtime'),toolCaps:null,URL,
    exactPath:()=>false,inside:(value,boundary)=>{ const relative=path.relative(boundary,String(value));return relative===''||(!relative.startsWith('..')&&!path.isAbsolute(relative)); },
    denied:(operation,target)=>{denied.push({operation,target});return Error('Denied '+operation);},require });
  vm.runInContext(source.slice(source.indexOf('const readable ='),source.indexOf('const exists =')),context);
  assert.equal(fakeFs.lstatSync(base),base);
  assert.equal(await fakeFs.promises.realpath(base),base);
  assert.equal(fakeFs.realpathSync.native(base),base);
  assert.equal(fakeFs.realpath.native(base),base);
  for (const operation of ['readFileSync','readdirSync','writeFileSync','mkdirSync','rmSync'])
    assert.throws(()=>fakeFs[operation](base),/Denied/);
  assert.throws(()=>fakeFs.statSync(path.join(base,'sibling')),/Denied/);
  await assert.rejects(fakeFs.promises.lstat(path.join(base,'sibling')),/Denied/);
  assert.throws(()=>fakeFs.realpathSync.native(path.join(base,'sibling')),/Denied/);
  assert.throws(()=>fakeFs.realpath.native(path.join(base,'sibling')),/Denied/);
  assert.equal(calls.length,4);assert.equal(denied.length,9);
});
const left = source.indexOf("const cp = require('node:child_process');");
const right = source.indexOf('function loopback(', left);
assert.ok(left >= 0 && right > left);
function fixture(enabled = true) {
  const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/guard-contract-fixture');
  const workspace = path.join(root, 'workspace');
  let bytes = Buffer.from('trusted fixture script');
  const command = "& 'C:/fixture/node.exe' 'F:/fixture/script.mjs'; exit $LASTEXITCODE";
  const caps = { workspace, shell: path.resolve('C:/fixture/powershell.exe'), runner: path.resolve('C:/fixture/node.exe'),
    taskkill: path.resolve('C:/Windows/System32/taskkill.exe'), scripts: [{ path: path.join(workspace, 'script.mjs'),
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'), command }] };
  const calls = [], records = [];
  const cp = { spawn(executable, args, options) {
    const child = new EventEmitter();
    Object.assign(child, { pid: 3000 + calls.length, exitCode: null, signalCode: null });
    calls.push({ executable, args, options, child });
    return child;
  } };
  const exactPath = (a, b) => typeof a === 'string' && typeof b === 'string' && path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
  const ctx = vm.createContext({ toolCaps: enabled ? caps : null, path, root, exactPath,
    inside: (value, boundary) => path.resolve(value).toLowerCase().startsWith(path.resolve(boundary).toLowerCase() + path.sep),
    read: () => bytes, append: (_, record) => records.push(JSON.parse(record)),
    denied: operation => Object.assign(Error(operation), { code: 'EACCES' }),
    require: name => name === 'node:child_process' ? cp : require(name),
  });
  vm.runInContext(source.slice(left, right), ctx);
  return { cp, caps, calls, records, root, modify: () => { bytes = Buffer.from('modified script'); },
    launch: () => cp.spawn(caps.shell, ['-NoProfile', '-Command', command], { shell: false, cwd: workspace }) };
}

test('actual guard admits only the exact hashed runner command and workspace', () => {
  const f = fixture();
  const child = f.launch();
  assert.equal(child.pid, 3000);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].options.windowsHide, true);
  for (const [command, args, options] of [
    [f.caps.shell, ['-NoProfile', '-Command', f.caps.scripts[0].command + '; Get-Content outside'], { shell: false, cwd: f.caps.workspace }],
    [f.caps.shell, ['-NoProfile', '-Command', f.caps.scripts[0].command], { shell: true, cwd: f.caps.workspace }],
    [f.caps.shell, ['-NoProfile', '-Command', f.caps.scripts[0].command], { shell: false, cwd: path.dirname(f.caps.workspace) }],
    [f.caps.runner, [f.caps.scripts[0].path], { shell: false, cwd: f.caps.workspace }],
  ]) assert.throws(() => f.cp.spawn(command, args, options), /child_process.spawn/);
  f.modify();
  assert.throws(f.launch, /child_process.spawn/);
  assert.equal(f.calls.length, 1);
});

test('actual cancellation admission is limited to a live child created by this guard', () => {
  const f = fixture();
  const child = f.launch();
  assert.throws(() => f.cp.spawn('taskkill', ['/pid', '2999', '/f', '/t']), /child_process.spawn/);
  assert.throws(() => f.cp.spawn('taskkill', ['/pid', '3000', '/f', '/im', 'node.exe']), /child_process.spawn/);
  f.cp.spawn('taskkill', ['/pid', '3000', '/f', '/t']);
  assert.equal(f.calls[1].executable, f.caps.taskkill);
  child.exitCode = 0;
  child.emit('exit', 0);
  assert.throws(() => f.cp.spawn('taskkill', ['/pid', '3000', '/f', '/t']), /child_process.spawn/);
  assert.throws(() => f.cp.spawn('taskkill', ['/pid', '3001', '/f', '/t']), /child_process.spawn/);
  assert.equal(f.calls.length, 2);
});

test('without explicit own-script capabilities all subprocesses stay blocked', () => {
  const f = fixture(false);
  assert.throws(f.launch, /child_process.spawn/);
  for (const name of ['exec', 'execSync', 'execFile', 'spawnSync', 'fork']) assert.throws(() => f.cp[name]('fixture'), /child_process/);
  assert.equal(f.calls.length, 0);
});

test('owned stdio MCP exception requires exact local executable, script hashes, argv and workspace', () => {
  const f=fixture(),sha=crypto.createHash('sha256').update(Buffer.from('trusted fixture script')).digest('hex');
  f.caps.mcp={executable:path.join(f.root,'bin','owned-node.exe'),executableSha256:sha,script:path.join(f.root,'fixture with space.mjs'),scriptSha256:sha,workspace:f.caps.workspace};
  const caps=f.caps.mcp,options={cwd:caps.workspace,shell:false};
  const child=f.cp.spawn(caps.executable,[caps.script],options);assert.equal(child.pid,3000);assert.equal(f.records[0].commandKind,'exact-owned-stdio-mcp');
  for(const [command,args,opts] of [[caps.executable,[caps.script,'--other'],options],[caps.executable,[path.join(f.root,'different.mjs')],options],[caps.executable,[caps.script],{...options,shell:true}],[caps.executable,[caps.script],{...options,cwd:f.root}],[path.resolve('C:/unowned/node.exe'),[caps.script],options]])assert.throws(()=>f.cp.spawn(command,args,opts),/child_process.spawn/);
  caps.scriptSha256='0'.repeat(64);assert.throws(()=>f.cp.spawn(caps.executable,[caps.script],options),/child_process.spawn/);caps.scriptSha256=sha;
  caps.executableSha256='0'.repeat(64);assert.throws(()=>f.cp.spawn(caps.executable,[caps.script],options),/child_process.spawn/);caps.executableSha256=sha;
  f.modify();assert.throws(()=>f.cp.spawn(caps.executable,[caps.script],options),/child_process.spawn/);assert.equal(f.calls.length,1);
});
