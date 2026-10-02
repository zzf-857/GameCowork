// Real Core Tma/Pma and actual ACP notification dispatch; only process startup
// and the peer CLI are inert controlled fixtures. No retry or sleeping is used.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const directory = path.join(__dirname, '../../src/core/binary/out');
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }
function between(source, start, end, offset = 0) {
  const a = source.indexOf(start, offset), b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `Actual source markers: ${start}`); return source.slice(a, b);
}
function actualBlock(source, pattern, offset = 0) {
  const match = source.slice(offset).match(pattern); assert.ok(match, `Actual block: ${pattern}`);
  const start = offset + match.index, opening = source.indexOf('{', start); let depth = 0;
  for (let index = opening; index < source.length; index++) {
    if (source[index] === '{') depth++;
    else if (source[index] === '}' && --depth === 0) return source.slice(start, index + 1);
  }
  assert.fail('Unterminated actual Core block');
}

function fixture(source, options = {}) {
  const gate = deferred(), managers = [], messages = [], refreshed = [];
  const context = vm.createContext({ process: { env: {} }, Date, setTimeout, clearTimeout, Promise, AggregateError,
    console: { debug() {}, log() {}, warn() {}, error() {} },
    Cfi: () => 'chat', wUt: () => ({}), lUt: () => ({}), T9e: () => undefined, vfi: () => true, iUt: () => true,
    HI: { getInstance: () => ({ getAccessToken: () => '' }) }, Yfi: [], AP: () => true, Bpa: (_override, roots) => roots[0],
    yUt: async () => false, Yma: async () => false, nUt: () => undefined, fUt: () => false,
    _b: class extends Error { constructor(id) { super(`Disposed ACP owner: ${id}`); } },
  });
  vm.runInContext(between(source, 'function nI(', 'function Ffi('), context);
  vm.runInContext(actualBlock(source, /function Mpa\(/), context);
  const managerAt = source.search(/var Uq\s*=\s*class/);
  const notification = vm.runInContext('({' + actualBlock(source, /handleSessionNotification\(e\)\s*\{/, managerAt) + '})', context).handleSessionNotification;
  class PeerManager {
    constructor(config) { Object.assign(this, config); this.availableCommands = []; this.sessions = new Map(); this.closed = false; managers.push(this); }
    async initialize() {}
    async createSession() {
      this.sessions.set('owned-acp', {});
      this.handleSessionNotification({ sessionId: 'owned-acp', update: { sessionUpdate: 'available_commands_update', availableCommands: [
        { name: 'owned-command', description: 'Owned persisted command', _meta: { gamecowork: { kind: 'file' } } },
        { name: 'help', description: 'Built-in help', _meta: { gamecowork: { kind: 'built-in' } } },
      ] } });
      await gate.promise;
      return 'owned-acp';
    }
    handleSessionNotification(frame) { return notification.call(this, frame); }
    async shutdown() { this.closed = true; }
  }
  context.Uq = PeerManager;
  const owner = { acpSessionRegistry: new Map(), acpInitializing: new Map(), acpSessionHolders: new Map(),
    sessionLifecycle: { evictLruIfNeeded: async () => {}, startIdleReaper() {} },
    buildAcpStartupOptions: async () => ({ env: {}, args: [], currentSelectModel: '' }),
    ide: { getWorkspaceDirs: async () => ['F:/owned/project'] },
    messenger: { send: (kind, data) => messages.push({ kind, data }) },
    getHolder(id) { if (!this.acpSessionHolders.has(id)) this.acpSessionHolders.set(id, { disposed: false, isDisposed() { return this.disposed; } }); return this.acpSessionHolders.get(id); },
    runRefreshWithTimeout: async (_label, callback) => { try { await callback(); return true; } catch { return false; } },
    refreshCommandsForEntry: async entry => { refreshed.push(entry); return options.refreshFailure ? false : true; },
  };
  vm.runInContext(between(source, 'async function Tma(', 'function Oma('), context);
  vm.runInContext(between(source, 'async function Pma(', 'async function qma('), context);
  return { context, owner, gate, managers, messages, refreshed,
    init: id => context.Tma(owner, id || 'owned-session', {}), refresh: () => context.Pma(owner) };
}

for (const file of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(directory, file), 'utf8');
  test(`${file}: actual initialization replays cached commands that arrived before session/new returned`, async () => {
    const f = fixture(source), initialized = f.init(); await tick();
    assert.equal(f.managers.length, 1); assert.equal(f.managers[0].availableCommands.length, 2);
    assert.equal(f.owner.acpSessionRegistry.size, 0); assert.equal(f.messages.length, 0, 'A pending manager cannot publish before it owns the registry');
    f.gate.resolve(); const entry = await initialized;
    assert.equal(f.owner.acpSessionRegistry.get('owned-session'), entry);
    assert.equal(f.messages.length, 1); assert.equal(f.messages[0].kind, 'acp/availableCommandsUpdated');
    assert.equal(f.messages[0].data.commands[0].name, 'owned-command');
    assert.deepEqual(Array.from(f.messages[0].data.builtinCommandNames), ['help']);
  });
  test(`${file}: command refresh waits for pending initialization and refreshes its actual resulting owner`, async () => {
    const f = fixture(source), initialized = f.init(); await tick();
    let settled = false; const refresh = f.refresh().then(value => { settled = true; return value; });
    await tick(); assert.equal(settled, false); assert.equal(f.refreshed.length, 0);
    f.gate.resolve(); const entry = await initialized; const result = await refresh;
    assert.deepEqual(f.refreshed, [entry]); assert.equal(result.refreshed, 1); assert.equal(f.managers.length, 1);
  });
  test(`${file}: concurrent initialization shares one real manager and publishes bootstrap only once`, async () => {
    const f = fixture(source), first = f.init(), second = f.init(); await tick();
    assert.equal(f.managers.length, 1); f.gate.resolve();
    assert.equal(await first, await second); assert.equal(f.messages.length, 1);
  });
  test(`${file}: pending initialization failures propagate instead of claiming an empty successful refresh`, async () => {
    const f = fixture(source), initialized = f.init(); initialized.catch(() => {}); await tick();
    const refresh = f.refresh(); f.gate.reject(Error('Controlled ACP initialization failure'));
    await assert.rejects(initialized, /initialization failure/); await assert.rejects(refresh, /initializ/);
    assert.equal(f.owner.acpSessionRegistry.size, 0); assert.equal(f.messages.length, 0); assert.equal(f.refreshed.length, 0);
  });
  test(`${file}: disposed initialization cannot revive a closed holder or publish its cached commands`, async () => {
    const f = fixture(source), initialized = f.init(); await tick();
    f.owner.getHolder('owned-session').disposed = true; f.owner.acpInitializing.clear(); f.gate.resolve();
    await assert.rejects(initialized, /Disposed/);
    assert.equal(f.owner.acpSessionRegistry.size, 0); assert.equal(f.messages.length, 0); assert.equal(f.managers[0].closed, true);
  });
  test(`${file}: a detached closed workspace cannot publish or register its late initialization`, async () => {
    const f = fixture(source), initialized = f.init(); await tick(); f.owner.messenger.disposed = true; f.gate.resolve();
    await assert.rejects(initialized, /Disposed/); assert.equal(f.managers[0].closed, true);
    assert.equal(f.owner.acpSessionRegistry.size, 0); assert.equal(f.messages.length, 0);
  });
  test(`${file}: replaced or closed manager notifications cannot overwrite the current command list`, async () => {
    const f = fixture(source), initialized = f.init(); await tick(); f.gate.resolve(); await initialized;
    const old = f.managers[0]; f.messages.length = 0;
    f.owner.acpSessionRegistry.set('owned-session', { manager: { generation: 'replacement' } });
    old.handleSessionNotification({ sessionId: 'owned-acp', update: { sessionUpdate: 'available_commands_update', availableCommands: [{ name: 'stale-command' }] } });
    f.owner.acpSessionRegistry.clear(); old.handleSessionNotification({ sessionId: 'owned-acp', update: { sessionUpdate: 'available_commands_update', availableCommands: [{ name: 'closed-command' }] } });
    assert.equal(f.messages.length, 0);
  });
  test(`${file}: failed live refresh remains an error while a removed registry entry is not refreshed`, async () => {
    const f = fixture(source, { refreshFailure: true }), initialized = f.init(); await tick(); f.gate.resolve(); await initialized;
    await assert.rejects(f.refresh(), /refresh/);
    f.owner.acpSessionRegistry.clear(); const result = await f.refresh(); assert.equal(result.refreshed, 0);
    assert.equal(f.refreshed.length, 1);
  });
  test(`${file}: pending refresh does not resurrect an entry whose registry owner closed before startup completed`, async () => {
    const f = fixture(source), pending = deferred(), old = { manager: { generation: 'retired' } };
    f.owner.acpInitializing.set('closed-session', pending.promise);
    const refresh = f.refresh(); await tick(); f.owner.acpInitializing.clear(); pending.resolve(old);
    const result = await refresh; assert.equal(result.refreshed, 0); assert.equal(f.refreshed.length, 0);
    assert.equal(f.owner.acpSessionRegistry.size, 0); assert.equal(f.managers.length, 0);
  });
  test(`${file}: actual live refresh preserves the existing eight-second boundary and keeps its dirty state on failure`, async () => {
    const f = fixture(source), timers = [];
    f.context.setTimeout = (callback, duration) => { timers.push({ callback, duration }); return timers.length; };
    f.context.clearTimeout = () => {};
    vm.runInContext(between(source, 'async function zma(', 'async function Dma('), f.context);
    f.owner.runRefreshWithTimeout = (label, callback) => f.context.zma(f.owner, label, callback);
    const entry = { manager: { refreshAvailableCommands: () => new Promise(() => {}) }, needsCommandRefresh: true };
    const refresh = f.context.Kma(f.owner, entry); await tick();
    assert.equal(timers[0].duration, 8000); timers[0].callback();
    assert.equal(await refresh, false); assert.equal(entry.needsCommandRefresh, true);
  });
  test(`${file}: a never-settling existing initialization is bounded without spawning a replacement or claiming refresh`, async () => {
    const f = fixture(source), timers = [];
    f.context.setTimeout = (callback, duration) => { timers.push({ callback, duration }); return timers.length; };
    f.context.clearTimeout = () => {};
    f.owner.acpInitializing.set('hung-session', new Promise(() => {}));
    const refresh = f.refresh(); await tick(); assert.equal(timers[0].duration, 60000); timers[0].callback();
    await assert.rejects(refresh, /initialization.*60000ms/);
    assert.equal(f.managers.length, 0); assert.equal(f.refreshed.length, 0);
  });
  test(`${file}: actual ACP refresh method propagates RPC failures and requires the Agent's success acknowledgement`, async () => {
    const context = vm.createContext({ console: { log() {}, warn() {} }, ds: Error, sd: Error });
    const manager = vm.runInContext('({' + actualBlock(source, /async refreshAvailableCommands\(e\)\s*\{/) + '})', context);
    manager.sessions = new Map([['owned-acp', {}]]);
    for (const value of [undefined, null, {}, { success: false }]) {
      manager.connection = { sendRequest: async () => value };
      await assert.rejects(manager.refreshAvailableCommands('owned-acp'), /did not confirm/);
    }
    manager.connection = { sendRequest: async () => { throw Error('Controlled real command-refresh rejection'); } };
    await assert.rejects(manager.refreshAvailableCommands('owned-acp'), /command-refresh rejection/);
    const acknowledged = { success: true }; manager.connection = { sendRequest: async () => acknowledged };
    assert.equal(await manager.refreshAvailableCommands('owned-acp'), acknowledged);
  });
}
