// Extract the real bundle handler and filesystem inspector; do not start the core or an editor.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const vm = require('node:vm');
const crypto = require('node:crypto');
const test = require('node:test');

const base = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests');
const root = path.join(base, `project-status-${crypto.randomUUID()}`);
fs.mkdirSync(root, { recursive: true });
test.after(() => {
  const resolved = fs.realpathSync(root);
  const resolvedBase = fs.realpathSync(base);
  assert.ok(resolved.startsWith(`${resolvedBase}${path.sep}`));
  assert.ok(path.basename(resolved).startsWith('project-status-'));
  fs.rmSync(resolved, { recursive: true });
});

function extract(source, start, end) {
  const left = source.indexOf(start);
  const right = source.indexOf(end, left + start.length);
  assert.ok(left >= 0 && right > left, `Missing helper ${start}`);
  assert.equal(source.indexOf(start, left + start.length), -1, `Ambiguous helper ${start}`);
  return source.slice(left, right);
}
function project(name, text, dependencies = {}) {
  const directory = path.join(root, name);
  for (const folder of ['Assets', 'ProjectSettings', 'Packages']) fs.mkdirSync(path.join(directory, folder), { recursive: true });
  fs.writeFileSync(path.join(directory, 'ProjectSettings', 'ProjectVersion.txt'), text);
  fs.writeFileSync(path.join(directory, 'Packages', 'manifest.json'), JSON.stringify({ dependencies }));
  return directory;
}
function digest(directory) {
  return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => {
      const filename = path.join(entry.parentPath || entry.path, entry.name);
      return [path.relative(directory, filename), crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')];
    }).sort((a,b) => a[0].localeCompare(b[0]));
}

for (const filename of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(__dirname, '../restored/core-gamecowork-binary/binary/out', filename), 'utf8');
  const statusStart = source.search(/\bvar R9e\s*=/);
  assert.ok(statusStart >= 0);
  const statusHelpers = source.slice(statusStart, source.indexOf('function DOt(', statusStart));
  const pathHelper = extract(source, 'function TOt(', 'function ab(');
  const hostHelpers = extract(source, 'async function Jma(', 'async function _ma(');
  const handler = extract(source, 'n("unity/getProjectStatus",', 'n("unity/installMcpPackage",');
  function host(projectRoot, entry = null, localMode = false) {
    const hooks = [];
    const ctx = vm.createContext({
      QW: fs, eL: path, ipa: url, ya: () => {},
      console: { error: () => {} },
      process: {env: {GAMECOWORK_LOCAL_PROVIDER_MODE:localMode?'1':''}},
      n: (name, callback) => { ctx.handler = callback; },
      y: (...args) => hooks.push(['connected-workspace-hook', ...args]),
      g: (...args) => hooks.push(['workspace-monitor-hook', ...args]),
    });
    vm.runInContext(pathHelper + '\n' + statusHelpers + '\n' + hostHelpers, ctx, { timeout: 1000 });
    const core = {
      ide: { getProjectRoot: async () => projectRoot },
      getAnyAcpEntry: () => entry,
      resolveUnityProjectRoot: data => ctx.Jma(core, data),
      emptyUnityProjectStatus: () => ctx.Sma(core),
      fetchUnityProjectStatusForMessage: async () => { throw new Error('ACP must not be called without an active entry'); },
    };
    ctx.t = core;
    vm.runInContext(handler + '\nundefined;', ctx, { timeout: 1000 });
    return { invoke: data => ctx.handler({ data }), ctx, core, hooks };
  }

  test(`${filename}: a regular folder succeeds without starting ACP or claiming an editor connection`, async () => {
    const directory = path.join(root, `${filename}-regular`);
    fs.mkdirSync(directory);
    const { invoke, hooks } = host(directory);
    const result = await invoke({});
    assert.equal(result.status, 'success');
    assert.equal(result.content.isUnityProject, false);
    assert.equal(result.content.hasUnityMcpPackage, false);
    assert.equal(result.content.engineType, null);
    assert.equal(result.content.engineVersion, null);
    assert.equal(result.content.connected, undefined);
    assert.equal(hooks.length, 0);
  });

  test(`${filename}: no host root returns the actual empty status schema`, async () => {
    const { invoke, hooks } = host(undefined);
    const result = await invoke({});
    assert.equal(result.status, 'success');
    assert.equal(result.content.isUnityProject, false);
    assert.equal(result.content.projectRoot, null);
    assert.equal(result.content.manifestPath, null);
    assert.equal(hooks.length, 0);
  });

  test(`${filename}: Unity metadata and bridge version come from real fixture files without writes`, async () => {
    const directory = project(`${filename}-unity`, 'm_EditorVersion: 2022.3.1f1\n', { 'cn.gamecowork.bridge': '1.2.3' });
    const before = digest(directory);
    const { invoke, hooks } = host(directory);
    const result = await invoke({});
    assert.equal(result.status, 'success');
    assert.equal(result.content.isUnityProject, true);
    assert.equal(result.content.engineType, 'Unity');
    assert.equal(result.content.engineVersion, '2022.3.1f1');
    assert.equal(result.content.hasUnityMcpPackage, true);
    assert.equal(result.content.installedPackageVersion, '1.2.3');
    assert.equal(result.content.projectRoot, directory);
    assert.equal(result.content.manifestPath, path.join(directory, 'Packages', 'manifest.json'));
    assert.equal(result.content.connected, undefined);
    assert.equal(hooks.length, 0);
    assert.deepEqual(digest(directory), before);
  });

  test(`${filename}: Tuanjie metadata and a file URI use the host's real path inspector`, async () => {
    const directory = project(`${filename}-tuanjie`, 'm_EditorVersion: 2022.3.2f1\nm_TuanjieEditorVersion: 1.6.1\n', { 'cn.tuanjie.codely.bridge': '9.9.9' });
    const before = digest(directory);
    const { invoke } = host(undefined);
    const result = await invoke({ workspaceRef: { workspaceDir: url.pathToFileURL(directory).href } });
    assert.equal(result.status, 'success');
    assert.equal(result.content.isUnityProject, true);
    assert.equal(result.content.engineType, 'Tuanjie');
    assert.equal(result.content.engineVersion, '1.6.1');
    assert.equal(result.content.projectRoot, directory);
    assert.equal(result.content.hasUnityMcpPackage, false, 'Official bridge registration is not the forked bridge');
    assert.equal(result.content.installedPackageVersion, null);
    assert.deepEqual(digest(directory), before);
  });

  test(`${filename}: an embedded bridge package reports its actual package version`, async () => {
    const directory = project(`${filename}-embedded`, 'm_EditorVersion: 6000.0.1f1\n', { 'cn.gamecowork.bridge': 'file:cn.gamecowork.bridge' });
    const packageDirectory = path.join(directory, 'Packages', 'cn.gamecowork.bridge');
    fs.mkdirSync(packageDirectory);
    fs.writeFileSync(path.join(packageDirectory, 'package.json'), '{"version":"0.9.0"}\n');
    const before = digest(directory);
    const result = await host(directory).invoke({});
    assert.equal(result.content.hasUnityMcpPackage, true);
    assert.equal(result.content.installedPackageVersion, '0.9.0');
    assert.deepEqual(digest(directory), before);
  });

  test(`${filename}: an existing ACP entry retains its original status and hooks`, async () => {
    const entry = { fixture: 'existing-acp' };
    const { invoke, core, hooks } = host('unused-local-fallback', entry);
    const expected = { isUnityProject: true, engineType: 'Unity', engineVersion: 'live-fixture' };
    core.fetchUnityProjectStatusForMessage = async (data, actualEntry) => {
      assert.equal(actualEntry, entry);
      assert.equal(data.marker, 'request');
      return { projectRoot: 'acp-fixture-root', projectStatus: expected };
    };
    const result = await invoke({ marker: 'request' });
    assert.equal(result.status, 'success');
    assert.equal(result.content, expected);
    assert.equal(hooks.length, 2);
  });
  test(`${filename}: local project status with a real ACP entry never installs or refreshes official assets`,async()=>{
    const entry={fixture:'existing-acp'};
    const {invoke,core,hooks}=host('fixture',entry,true);
    const expected={isUnityProject:true,engineType:'Unity',engineVersion:'fixture-live'};
    core.fetchUnityProjectStatusForMessage=async()=>({projectRoot:'fixture-workspace',projectStatus:expected});
    const result=await invoke({});assert.equal(result.content,expected);assert.equal(hooks.length,0);
    const begin=source.indexOf(filename==='index.js'?'let G="TJGenerators"':'let G = "TJGenerators"');
    const block=source.slice(begin,source.indexOf('n("unity/getProjectStatus",',begin));
    for(const name of ['g','y'])assert.match(block,new RegExp(name+'\\s*=\\s*async\\s*(?:\\([^)]*\\)|[\\w$]+)\\s*=>\\s*\\{if\\(process.env.GAMECOWORK_LOCAL_PROVIDER_MODE===\"1\"\\)return;'));
  });
}
