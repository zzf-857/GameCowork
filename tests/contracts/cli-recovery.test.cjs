const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const sourceFile = path.join(__dirname, '../../src/agent/cli-main.beautified.js');
const source = fs.readFileSync(sourceFile, 'utf8');
const start = source.indexOf('  function gcuCliProfileRoot(');
const end = source.indexOf('  var A$u =', start);
assert.ok(start >= 0 && end > start);
const helpers = source.slice(start, end);
function context(env = {}) {
  const ctx = vm.createContext({ process: { env: { ...env } }, require, __dirname: 'F:/fixture/cli' });
  vm.runInContext(helpers, ctx, { timeout: 1000 });
  return ctx;
}
test('CLI state root wins without reading the real profile', () => {
  const ctx = context({ GAMECOWORK_CLI_HOME: ' F:/fixture/cli-state ', GAMECOWORK_USER_DATA_DIR: 'F:/fixture/user-state' });
  assert.equal(ctx.gcuCliProfileRoot(() => { throw new Error('Profile fallback accessed'); }), path.resolve('F:/fixture/cli-state'));
});
test('CLI state helper supports the shared user-data override and normal fallback', () => {
  assert.equal(context({ GAMECOWORK_USER_DATA_DIR: 'F:/fixture/user-state' }).gcuCliProfileRoot(() => 'unused'), path.resolve('F:/fixture/user-state'));
  assert.equal(context().gcuCliProfileRoot(() => 'explicit-legacy-fixture'), 'explicit-legacy-fixture');
});
test('self-managed auth only recognizes actual custom providers and preserves OAuth', () => {
  const ctx = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' });
  for (const auth of ['openai', 'anthropic', 'gemini-api-key', 'vertex-ai']) assert.equal(ctx.gcuCliOwnProvider(auth), true);
  for (const auth of ['gamecowork-oauth', 'oauth-personal', 'qwen-oauth', 'invalid']) assert.equal(ctx.gcuCliOwnProvider(auth), false);
  assert.equal(context().gcuCliOwnProvider('openai'), false);
});
test('real Core W9e-shaped slot settings select the custom runtime driver without rewriting stored OAuth', () => {
  const settings = { selectedAuthType: 'gamecowork-oauth', contentGenerator: { authType: 'gamecowork-oauth', wireApi: 'chat', overrides: { model: { authType: 'openai', wireApi: 'chat' } } } };
  const before = JSON.stringify(settings);
  assert.equal(context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' }).gcuCliLocalAuth(settings), 'openai');
  assert.equal(context().gcuCliLocalAuth(settings), undefined);
  assert.equal(JSON.stringify(settings), before);
});
test('CLI resource directory is explicit and does not depend on an old build-machine path', () => {
  assert.equal(context({ GAMECOWORK_CLI_RESOURCE_DIR: ' F:/fixture/resources ' }).gcuCliResourceRoot(), 'F:/fixture/resources');
  assert.equal(context().gcuCliResourceRoot(), path.join('F:/fixture/cli', 'resources'));
});
test('local ACP session config loads the target project after a default-folder prewarm', async () => {
  const left = source.indexOf('        async newSessionConfig(e, t, r) {');
  const right = source.indexOf('        async cancel(e)', left);
  assert.ok(left >= 0 && right > left);
  const ctx = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' });
  let loadedTarget;
  const loaded = { merged: { selectedAuthType: 'gamecowork-oauth', contentGenerator: { overrides: { model: { authType: 'openai' } } }, model: 'target-model' },
    setRuntimeValue: (name, value) => { loaded.merged[name] = value; }, forScope: () => ({ settings: {} }) };
  ctx.fc = cwd => { loadedTarget = cwd; return loaded; };
  ctx.MMr = async merged => merged;
  const instance = vm.runInContext(`({${source.slice(left, right)}})`, ctx);
  instance.settings = { merged: { selectedAuthType: 'gamecowork-oauth', model: 'unconfigured-default' } };
  instance.extensions = []; instance.argv = {};
  const result = await instance.newSessionConfig('session-fixture', 'F:/fixture/target-project', []);
  assert.equal(loadedTarget, 'F:/fixture/target-project');
  assert.equal(result.selectedAuthType, 'openai');
  assert.equal(result.model, 'target-model');
  assert.equal(instance.settings.merged.model, 'unconfigured-default');
});
test('local provider mode skips the actual remote reporter before obtaining OAuth credentials', () => {
  const reporter = source.indexOf('            async getApiKey() {\n              if (!this.shouldSkipEmission())');
  const left = source.indexOf('            shouldSkipEmission() {', reporter);
  const right = source.indexOf('            getReportBaseUrl() {', left);
  assert.ok(left >= 0 && right > left);
  const method = source.slice(left, right);
  const ctx = vm.createContext({ process: { env: { GAMECOWORK_LOCAL_PROVIDER_MODE: '1' } }, Opn: 'GAMECOWORK_LITELLM_LOGGER_NO_EMIT' });
  assert.equal(vm.runInContext(`({${method}}).shouldSkipEmission()`, ctx), true);
});
test('local mode suppresses Unity UOS telemetry before dispatch and Sentry collection before capture', () => {
  const uosStart = source.indexOf('    function _nu() {');
  const uosEnd = source.indexOf('    async function nWr()', uosStart);
  const sentryStart = source.indexOf('    function Xw(e) {');
  const sentryEnd = source.indexOf('    function Tge(', sentryStart);
  assert.ok(uosStart >= 0 && uosEnd > uosStart && sentryStart >= 0 && sentryEnd > sentryStart);
  const ctx = vm.createContext({ process: { env: { GAMECOWORK_LOCAL_PROVIDER_MODE: '1' } } });
  vm.runInContext(source.slice(uosStart, uosEnd) + source.slice(sentryStart, sentryEnd), ctx);
  assert.equal(ctx._nu(), true);
  assert.equal(ctx.Xw({ getSentryConfig: () => ({ enabled: true }) }), false);
});
test('local ACP authentication does not advertise or fall back to vendor cloud login', () => {
  const left = source.indexOf('    function rRl() {');
  const right = source.indexOf('    D();', source.indexOf('    function sBr(', left));
  const ctx = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' });
  ctx.wt = { USE_OPENAI: 'openai', USE_ANTHROPIC: 'anthropic', USE_GEMINI: 'gemini-api-key', USE_VERTEX_AI: 'vertex-ai', GAMECOWORK_OAUTH: 'gamecowork-oauth' };
  vm.runInContext(source.slice(left, right), ctx);
  assert.equal(ctx.rRl().some(method => method.id === 'gamecowork-oauth'), false);
  assert.equal(ctx.sBr({ selectedAuthType: 'gamecowork-oauth', envGameCoworkToken: 'synthetic-token' }), undefined);
  assert.equal(ctx.sBr({ selectedAuthType: 'openai' }), 'openai');
});
test('every declared embedded asset exists and binary WebAssembly validates', () => {
  const resourceRoot = path.join(__dirname, '../../src/agent/resources');
  const manifest = JSON.parse(fs.readFileSync(path.join(resourceRoot, 'restore-manifest.json'), 'utf8'));
  assert.equal(manifest.assets.length, 28);
  for (const asset of manifest.assets) {
    const bytes = fs.readFileSync(path.join(resourceRoot, asset.path));
    assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'), asset.restoredSha256);
    if (asset.path.endsWith('.wasm')) assert.equal(WebAssembly.validate(bytes), true);
  }
  assert.ok(manifest.assets.find(asset => asset.path === 'builtin-agents/general-purpose.toml').originalBytes < 2048);
});

test('local organization operations report unavailable before constructing a cloud client', async () => {
  const left = source.indexOf('    async function Uwl(');
  const right = source.indexOf('    D();', left);
  assert.ok(left >= 0 && right > left);
  const ctx = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' });
  ctx.fl = { getInstance: () => { throw Error('Cloud client accessed'); } };
  vm.runInContext(source.slice(left, right), ctx);
  for (const method of ['gamecowork/org/list', 'gamecowork/org/switch']) {
    const result = await ctx.Uwl(method, { orgId: 'synthetic-org' });
    assert.equal(result.success, false);
    assert.equal(result.mode, 'local');
    assert.equal(result.currentOrgId, null);
    assert.match(result.error, /unavailable/);
  }
  assert.equal(await ctx.Uwl('unrelated-fixture-operation', {}), null);
});

test('local cloud client refuses device login while the normal initialized instance remains accessible', async () => {
  const left = source.indexOf('            static async getInstance() {');
  const right = source.indexOf('            static getInitializedInstance()', left);
  assert.ok(left >= 0 && right > left);
  for (const local of [false, true]) {
    const ctx = context(local ? { GAMECOWORK_LOCAL_PROVIDER_MODE: '1' } : {});
    ctx.e = { instance: { fixture: true } };
    const method = source.slice(left, right).replace('static async', 'async');
    const factory = vm.runInContext(`({${method}})`, ctx);
    if (local) await assert.rejects(factory.getInstance(), /cloud authentication is unavailable/);
    else {
      assert.equal(await factory.getInstance(), ctx.e.instance);
      let initialized = 0;
      ctx.e = class FixtureCloudClient { async initialize() { initialized++; } };
      ctx.e.instance = null;
      const actual = await factory.getInstance();
      assert.equal(actual, ctx.e.instance);
      assert.equal(initialized, 1);
    }
  }
});

test('local runtime disables only the official asset MCP and preserves the stored configuration and own services', () => {
  const servers = {
    cloud: { httpUrl: 'https://ai-generator.tuanjie.cn/mcp', trust: true },
    own: { httpUrl: 'http://127.0.0.1:39999/mcp', trust: false },
    remote: { url: 'https://owned-fixture.invalid/sse' },
    lookalike: { httpUrl: 'https://ai-generator.tuanjie.cn.owned-fixture.invalid/mcp' },
    stdio: { command: 'fixture-owned-tool' },
  };
  const before = JSON.stringify(servers);
  const result = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' }).gcuCliLocalMcpServers(servers);
  assert.equal(result.cloud.enabled, false);
  for (const name of ['own', 'remote', 'lookalike', 'stdio']) assert.equal(result[name], servers[name]);
  assert.equal(JSON.stringify(servers), before);
  assert.equal(context().gcuCliLocalMcpServers(servers).cloud, servers.cloud);
});

test('actual MCP connection refuses the official asset service before constructing its client', async () => {
  const left = source.indexOf('    async function kru(');
  const right = source.indexOf('    async function jH(', left);
  assert.ok(left >= 0 && right > left);
  for (const local of [false, true]) {
    const ctx = context(local ? { GAMECOWORK_LOCAL_PROVIDER_MODE: '1' } : {});
    ctx.Age = class { constructor() { throw Error('Fixture client construction'); } };
    vm.runInContext(source.slice(left, right), ctx);
    await assert.rejects(ctx.kru('cloud', { httpUrl: 'https://ai-generator.tuanjie.cn/mcp' }),
      local ? /cloud asset MCP is unavailable/ : /Fixture client construction/);
    await assert.rejects(ctx.kru('own', { httpUrl: 'http://127.0.0.1:39999/mcp' }), /Fixture client construction/);
  }
});

test('local telemetry initialization stops before SDK/config access despite inherited OTLP settings', () => {
  const left = source.indexOf('    function ptl(e) {');
  const right = source.indexOf('    function htl(e)', left);
  assert.ok(left >= 0 && right > left);
  const ctx = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1', OTEL_EXPORTER_OTLP_ENDPOINT: 'https://fixture.invalid/v1/traces' });
  ctx.Pc = () => { throw Error('Telemetry SDK accessed'); };
  vm.runInContext(source.slice(left, right), ctx);
  assert.equal(ctx.ptl({ getTelemetryEnabled: () => { throw Error('Telemetry config accessed'); } }), undefined);
});

test('Windows completion cleanup never kills an exited shell by raw PID and helper failures do not swallow actual exit', () => {
  const left = source.indexOf('    function xPa(e) {');
  const right = source.indexOf('    function kPa(', left);
  assert.ok(left >= 0 && right > left);
  const ctx = context();
  let spawns = 0;
  ctx.hQ = { spawn: () => { spawns++; throw Error('Fixture cleanup denied'); } };
  ctx.process.kill = () => { throw Error('Unexpected process kill'); };
  vm.runInContext(source.slice(left, right), ctx);
  assert.equal(ctx.avn(999999, true), null);
  assert.equal(spawns, 0);
  assert.doesNotThrow(() => ctx.xPa(999999));
  assert.equal(spawns, 1);
});

function actualWindowBridgeHelper(reply, failProjectRoot = false) {
  const unwrapStart = source.indexOf('    function Z4l(e) {');
  const unwrapEnd = source.indexOf('    function TH(', unwrapStart);
  const start = source.indexOf('    async function Yse(');
  const end = source.indexOf('    async function e3l(', start);
  assert.ok(unwrapStart >= 0 && unwrapEnd > unwrapStart && start >= 0 && end > start);
  const ctx = context();
  const calls = [];
  ctx.TH = (message, config) => {
    if (failProjectRoot) throw Error('Fixture project mismatch');
    calls.push({ projectRoot: message._meta?.gamecowork?.projectRoot, fallbackRoot: config.root });
  };
  ctx.tC = async (command, args) => {
    calls.push({ command, args });
    if (reply instanceof Error) throw reply;
    return reply;
  };
  ctx.qt = value => value?.message || String(value);
  vm.runInContext(source.slice(unwrapStart, unwrapEnd) + source.slice(start, end), ctx);
  return { ctx, calls };
}

test('actual window bridge helper retains transport, project identity, PID and capability URL', async () => {
  const payload = { status: 'success', transport: 'image-frames', projectRoot: 'F:/fixture/editor-project',
    pid: 12345, signalingUrl: 'http://127.0.0.1:39999/api/tauri/window-bridge/local/fixture-token', running: true, capturing: false };
  const { ctx, calls } = actualWindowBridgeHelper({ success: true, data: payload });
  const result = await ctx.Yse({ _meta: { gamecowork: { projectRoot: payload.projectRoot } } }, { root: 'fallback' }, 'start_stream_server', { port: 39999 });
  assert.equal(result.success, true);
  assert.equal(result.payload, payload);
  assert.equal(calls[0].projectRoot, payload.projectRoot);
  assert.equal(calls[1].command, 'manage_window_bridge');
  assert.equal(calls[1].args.action, 'start_stream_server');
  assert.equal(calls[1].args.port, 39999);
  const listed = actualWindowBridgeHelper({ success: true, data: [{ typeName: 'UnityEditor.SceneView' }] });
  assert.equal((await listed.ctx.Yse({}, {}, 'list_windows')).payload[0].typeName, 'UnityEditor.SceneView');
});

test('actual window bridge helper preserves adapter and nested failures rather than manufacturing success', async () => {
  for (const reply of [{ success: false, error: 'Fixture listener stopped' },
    { success: true, data: { status: 'error', error: 'Fixture texture unavailable' } },
    { success: true, data: { success: false, error: 'Fixture capture denied' } },
    new Error('Fixture socket failed'), { success: true, data: null }]) {
    const { ctx } = actualWindowBridgeHelper(reply);
    const result = await ctx.Yse({}, {}, 'start_stream_server');
    assert.equal(result.success, false);
    assert.equal(typeof result.error, 'string');
    assert.ok(result.error.length > 0);
  }
  const projectError = actualWindowBridgeHelper({ success: true, data: {} }, true);
  assert.equal((await projectError.ctx.Yse({}, {}, 'start_stream_server')).success, false);
  assert.equal(projectError.calls.length, 0);
});

test('actual mode reporter keeps strict default distinct from auto-edit in local mode', () => {
  const left = source.indexOf('    function Qwl(e) {');
  const right = source.indexOf('    function qwl(', left);
  assert.ok(left >= 0 && right > left);
  for (const local of [false, true]) {
    const ctx = context(local ? { GAMECOWORK_LOCAL_PROVIDER_MODE: '1' } : {});
    ctx.Zn = { DEFAULT: 'default' };
    vm.runInContext(source.slice(left, right), ctx);
    assert.equal(ctx.Qwl('default'), local ? 'default' : 'autoEdit');
    assert.equal(ctx.Qwl('auto_edit'), 'autoEdit');
    assert.equal(ctx.Qwl('yolo'), 'yolo');
  }
});

test('actual 2D mode handler sets strict default once without passing through auto-edit', async () => {
  const left = source.indexOf('          if (e === "gamecowork/session/set_mode") {');
  const right = source.indexOf('          if (e === "gamecowork/session/set_approval_mode")', left);
  assert.ok(left >= 0 && right > left);
  const ctx = context({ GAMECOWORK_LOCAL_PROVIDER_MODE: '1' });
  ctx.an = { DEFAULT: 'default', PLAN: 'plan', ASK: 'ask' };
  ctx.Zn = { DEFAULT: 'default', AUTO_EDIT: 'auto_edit', YOLO: 'yolo' };
  ctx.XRl = { safeParse: params => ({ success: true, data: params }) };
  const handler = vm.runInContext(`(async function(e,t){${source.slice(left, right)}})`, ctx);
  for (const collaboration of ['default', 'ask', 'plan']) {
    const calls = [];
    const instance = { sessions: new Map([['fixture-session', { setMode2D: (...args) => calls.push(args) }]]), waitForSessionInit: async () => {} };
    await handler.call(instance, 'gamecowork/session/set_mode', { sessionId: 'fixture-session', collaborationMode: collaboration, approvalMode: 'default' });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], collaboration);
    assert.equal(calls[0][1], 'default');
    assert.equal(calls[0][2].prePlanApprovalFromRequest, true);
  }
});
