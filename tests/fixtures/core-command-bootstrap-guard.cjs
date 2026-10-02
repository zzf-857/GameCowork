// Test-only preload: retain the existing isolation guard, trace metadata, and
// hold a real CLI session/new result before Core ownership registration.
require('./core-chat-spawn-guard.cjs');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), Module = require('node:module');
const root = path.resolve(process.env.GAMECOWORK_SMOKE_ROOT);
const entry = path.resolve(process.env.GAMECOWORK_CORE_ENTRY).toLowerCase();
const expected = process.env.GAMECOWORK_BOOTSTRAP_CORE_SHA;
const held = new Set(JSON.parse(process.env.GAMECOWORK_BOOTSTRAP_HOLD_SESSIONS || '[]'));
const traceFile = path.join(root, 'bootstrap-events.jsonl'), releases = path.join(root, 'releases');
let sequence = 0;
function trace(event, details = {}) { fs.appendFileSync(traceFile, JSON.stringify({ sequence: ++sequence, event, time: Date.now(), ...details }) + '\n'); }
async function release(id) {
  const file = path.join(releases, id + '.release');
  if (fs.existsSync(file)) return;
  await new Promise((resolve, reject) => {
    const watcher = fs.watch(releases, (_event, name) => { if (String(name) === id + '.release' && fs.existsSync(file)) finish(); });
    const timer = setTimeout(() => finish(Error('Owned bootstrap test barrier was not released')), 90000);
    function finish(error) { clearTimeout(timer); watcher.close(); error ? reject(error) : resolve(); }
    if (fs.existsSync(file)) finish();
  });
}
globalThis.__GAMECOWORK_BOOTSTRAP_TEST = {
  trace,
  async create(manager, cwd, options, id) {
    const actorPid = manager.process?.pid;
    trace('sessionCreateBegin', { id, actorPid, corePid: process.pid });
    const shutdown = manager.shutdown.bind(manager);
    manager.shutdown = async () => { trace('managerShutdownBegin', { id, actorPid }); const value = await shutdown(); trace('managerShutdownDone', { id, actorPid }); return value; };
    const value = await manager.createSession(cwd, options);
    trace('sessionCreateReturned', { id, commandCount: manager.availableCommands.length });
    if (held.has(id)) { trace('barrierHeld', { id }); await release(id); trace('barrierReleased', { id }); }
    return value;
  },
};
const compile = Module.prototype._compile;
Module.prototype._compile = function(content, filename) {
  if (path.resolve(filename).toLowerCase() === entry) {
    if (crypto.createHash('sha256').update(content).digest('hex').toLowerCase() !== expected.toLowerCase()) throw Error('Bootstrap probe Core source SHA differs');
    const edits = [
      [/F\s*=\s*await y\.createSession\(Z,\s*Y\)/g, 'F=await globalThis.__GAMECOWORK_BOOTSTRAP_TEST.create(y,Z,Y,e)', 2],
      [/onAvailableCommandsUpdate:\s*(?:\(A\)|A)\s*=>\s*\{/g, match => match + 'globalThis.__GAMECOWORK_BOOTSTRAP_TEST.trace("commandsNotification",{id:e,owned:nI(t,e,y)?.manager===y,names:A.map(command=>command.name)});'],
      [/t\.acpSessionRegistry\.set\(e,\s*v\);/g, match => match + 'globalThis.__GAMECOWORK_BOOTSTRAP_TEST.trace("registryRegistered",{id:e,messengerDisposed:t.messenger.disposed===true});'],
      [/async function Pma\(t\)\s*\{/g, match => match + 'globalThis.__GAMECOWORK_BOOTSTRAP_TEST.trace("refreshBegin",{workspaceId:t.messenger.workspaceId,liveCount:t.acpSessionRegistry.size,pendingIds:Array.from(t.acpInitializing.keys())});'],
      [/return \{ refreshed, skipped, pendingInit: initializing\.length \};/g, 'globalThis.__GAMECOWORK_BOOTSTRAP_TEST.trace("refreshDone",{workspaceId:t.messenger.workspaceId,refreshed,skipped,pendingInit:initializing.length});return {refreshed,skipped,pendingInit:initializing.length};'],
    ];
    for (const [pattern, replacement, expectedCount = 1] of edits) {
      const matches = [...content.matchAll(pattern)];
      if (matches.length !== expectedCount) throw Error('Bootstrap probe exact maintained boundary count differs: ' + pattern);
      content = content.replace(pattern, replacement);
    }
    trace('sourceVerified', { sourceSha256: expected, controlledSessionCount: held.size, corePid: process.pid });
  }
  return compile.call(this, content, filename);
};
