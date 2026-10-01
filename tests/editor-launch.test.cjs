// Execute the real launch helper and handler with process/WMI/host stubs only.
// Neither the core startup nor any actual Hub/editor process is loaded here.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const test = require('node:test');

const project = path.join('F:/AI/AgentMake/temp/GameCowork/tests', `editor-helper-${randomUUID()}`, 'Project');
function extract(source, start, end) {
  const left = source.indexOf(start), right = source.indexOf(end, left + start.length);
  assert.ok(left >= 0 && right > left, `Missing boundary ${start}`);
  assert.equal(source.indexOf(start, left + start.length), -1, `Ambiguous boundary ${start}`);
  return source.slice(left, right);
}

for (const filename of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(__dirname, '../restored/core-gamecowork-binary/binary/out', filename), 'utf8');
  const helper = extract(source, 'async function $ba(', 'function eha(');
  const handler = extract(source, 'n("unity/openEditor",', 'n("unity/getEditorPid",');
  function context(options = {}) {
    const calls = { spawn: [], host: [], wmi: [], checks: [] };
    const ctx = vm.createContext({
      console: { warn() {}, log() {}, error() {} }, process: { env: { GAMECOWORK_CORE_JOB: options.job === false ? '' : '1' } },
      Vpe: value => value, w2i: async (root, pid) => { calls.checks.push([root, pid]); return !!options.alreadyOpen; },
      F2i: async () => true, kP: async () => ({ pid: 4301 }),
      Pba: () => options.missingVersion ? null : { editor: '2022.3.1f1', ...(options.tuanjieProject ? {tuanjie:'1.10.4'} : {}) },
      C2i: () => options.noEditor ? [] : options.editors || [{ version: '2022.3.1f1', path: 'F:/fixture/Unity.exe' }],
      A2i: () => true, Kx: false, zx: true,
      Q2i: (editorPath, projectPath) => { calls.wmi.push([editorPath, projectPath]); return options.wmiSuccess ? null : 'WMI fixture denied'; },
      cg: { spawn: (executable, args, config) => { calls.spawn.push({ executable, args, config }); return { pid: 4302, unref() {} }; } },
      n: (name, callback) => { assert.equal(name, 'unity/openEditor'); ctx.handler = callback; },
    });
    ctx.t = { ide: { getProjectRoot: async () => options.noRoot ? null : project }, messenger: {
      request: async (kind, data) => { calls.host.push({ kind, data }); return { success: true, pid: 4401 }; },
    } };
    vm.runInContext(helper + '\nglobalThis.launch = $ba;\n' + handler + '\nundefined;', ctx, { timeout: 1000 });
    return { ctx, calls };
  }

  test(`${filename}: already-open editor is focused without creating any process`, async () => {
    const { ctx, calls } = context({ alreadyOpen: true });
    const result = await ctx.handler({ data: { editorPid: 5100 } });
    assert.equal(result.success, true); assert.equal(result.alreadyOpen, true); assert.equal(result.pid, 5100);
    assert.equal(calls.spawn.length + calls.host.length + calls.wmi.length, 0);
  });
  test(`${filename}: same technical version chooses the exact requested engine and installation`,async()=>{
    const editors=[{product:'unity',version:'2022.3.1f1',path:'F:/fixture/Unity.exe'},
      {product:'tuanjie',version:'2022.3.1f1',path:'F:/fixture/Tuanjie-A/Tuanjie.exe'},
      {product:'tuanjie',version:'2022.3.1f1',path:'F:/fixture/Tuanjie-B/Tuanjie.exe'}];
    const {ctx,calls}=context({editors});
    const result=await ctx.handler({data:{version:'2022.3.1f1',product:'tuanjie',editorPath:String.raw`f:\fixture\Tuanjie-B\Tuanjie.exe`}});
    assert.equal(result.success,true);assert.equal(calls.wmi[0][0],editors[2].path);assert.equal(calls.host[0].data.editorPath,editors[2].path);assert.equal(calls.spawn.length,0);
    for(const selection of [{product:'unity',editorPath:editors[2].path},{product:'tuanjie',editorPath:'F:/unregistered/other.exe'},{product:'other'},{product:'tuanjie',editorPath:42}]){
      const f=context({editors});const failed=await f.ctx.handler({data:{version:'2022.3.1f1',...selection}});assert.equal(failed.success,false);assert.equal(f.calls.wmi.length+f.calls.host.length+f.calls.spawn.length,0);
    }
  });
  test(`${filename}: implicit engine comes from the actual project metadata without accepting a marketing version as identity`,async()=>{
    const editors=[{product:'tuanjie',version:'2022.3.1f1',path:'F:/fixture/Tuanjie.exe'},{product:'unity',version:'2022.3.1f1',path:'F:/fixture/Unity.exe'}];
    for(const tuanjieProject of [false,true]){const f=context({editors,tuanjieProject});assert.equal((await f.ctx.handler({data:{}})).success,true);assert.equal(f.calls.host[0].data.editorPath,editors[tuanjieProject?0:1].path);}
    const f=context({editors,tuanjieProject:true});assert.equal((await f.ctx.handler({data:{version:'1.10.4',product:'tuanjie'}})).success,false);assert.equal(f.calls.wmi.length+f.calls.host.length,0);
  });
  test(`${filename}: missing editor version returns selection details before any launch`, async () => {
    const { ctx, calls } = context({ noEditor: true });
    const result = await ctx.handler({ data: { version: 'other' } });
    assert.equal(result.success, false); assert.equal(result.needsSelection, true); assert.equal(result.requestedVersion, 'other');
    assert.equal(calls.spawn.length + calls.host.length + calls.wmi.length, 0);
  });
  test(`${filename}: successful WMI launch remains outside the direct core spawn branch`, async () => {
    const { ctx, calls } = context({ wmiSuccess: true });
    const result = await ctx.handler({ data: {} });
    assert.equal(result.success, true); assert.equal(result.pid, 4301);
    assert.equal(calls.wmi.length, 1); assert.equal(calls.host.length + calls.spawn.length, 0);
  });
  test(`${filename}: real handler delegates WMI failure to the native host with the resolved root`, async () => {
    const { ctx, calls } = context();
    const result = await ctx.handler({ data: { version: '2022.3.1f1', editorPid: 999 } });
    assert.equal(result.success, true); assert.equal(result.pid, 4401); assert.equal(result.launchMethod, 'native');
    assert.equal(result.requestedVersion, '2022.3.1f1'); assert.equal(calls.spawn.length, 0);
    assert.equal(calls.host[0].kind, 'launchDetachedEditor');
    assert.deepEqual(JSON.parse(JSON.stringify(calls.host[0].data)), { editorPath: 'F:/fixture/Unity.exe', projectPath: project });
    assert.equal(calls.checks[0][1], 999);
  });
  test(`${filename}: failed, malformed, or throwing native launcher never falls back into the core Job`, async () => {
    for (const launcher of [async () => ({ success: false, message: 'Native fixture refused' }), async () => null,
      async () => { throw new Error('Native fixture denied'); }]) {
      const { ctx, calls } = context();
      const result = await ctx.launch(project, undefined, undefined, launcher);
      assert.equal(result.success, false); assert.ok(result.message.length > 0); assert.equal(calls.spawn.length, 0);
    }
  });
  test(`${filename}: Job-bound core without host launcher fails explicitly`, async () => {
    const { ctx, calls } = context();
    const result = await ctx.launch(project);
    assert.equal(result.success, false); assert.match(result.message, /native host launcher is unavailable/);
    assert.equal(calls.spawn.length, 0);
  });
  test(`${filename}: non-Job standalone helper retains its direct-launch fallback`, async () => {
    const { ctx, calls } = context({ job: false });
    const result = await ctx.launch(project);
    assert.equal(result.success, true); assert.equal(result.pid, 4302); assert.equal(calls.spawn.length, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(calls.spawn[0].args)), ['-projectPath', project]);
  });
  test(`${filename}: missing project root is reported without consulting the native launcher`, async () => {
    const { ctx, calls } = context({ noRoot: true });
    const result = await ctx.handler({ data: {} });
    assert.equal(result.success, false); assert.match(result.message, /No project root/);
    assert.equal(calls.spawn.length + calls.host.length + calls.wmi.length, 0);
  });
}
