// Execute the maintained registration, holder lease and ACP helper from both
// shipped Core inputs. ACP updates are isolated fixtures; no files are rewound.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const directory = path.join(__dirname, '../../src/core/binary/out');
const actualPreview = () => ({ canRewind: true, changedFiles: ['Owned.cs'],
  totalLineAdded: 3, totalLineDeleted: 1, changedFileCount: 1, effectiveChangedFileCount: 1,
  fileDetails: [{ relativePath: 'Owned.cs', action: 'restore', lineAdded: 3, lineDeleted: 1, backupExists: true, currentExists: true }], invalidRecords: [] });
const success = 'Code rewind success. restored=1, deleted=0, skipped=0, failed=0';
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }

function between(source, start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `Actual source markers: ${start}`);
  return source.slice(a, b);
}

function fixture(source, options = {}) {
  const calls = [], events = [], warnings = [];
  let registered, inLease = false;
  const manager = { sendPrompt: async (session, prompt, callback) => {
    assert.equal(session, 'owned-acp');
    assert.equal(inLease, true, 'preview and code mutation retain the real holder lease');
    const command = prompt[0].text, type = command.split(' ')[1];
    calls.push(command);
    const behavior = options[type] ?? {};
    if (behavior.error) throw Error(behavior.error);
    if (behavior.wait) await behavior.wait;
    if (type === 'dryRun' && behavior.preview !== null) {
      callback({ sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: '' },
        _meta: { gamecowork: { rewindPreview: behavior.preview ?? actualPreview() } } });
    }
    const text = behavior.text ?? (type === 'code' ? success : '');
    const split = Math.floor(text.length / 2);
    for (const chunk of [text.slice(0, split), text.slice(split)]) {
      callback({ sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: chunk } });
    }
    return { stopReason: behavior.stopReason ?? 'end_turn' };
  } };
  const entry = { manager, acpSessionId: 'owned-acp', isStreaming: options.streaming === true };
  const holder = { current: options.unavailable ? undefined : entry, isDisposed: () => false,
    queue: { runExclusive: async callback => { assert.equal(inLease, false); inLease = true;
      try { return await callback(); } finally { inLease = false; } } } };
  const core = { getHolder: () => holder, getOrCreateAcpEntry: async () => undefined,
    pushHistoryListChanged: () => events.push('history.changed'),
    acpHistoryManager: { clearSessionStreamError: async session => {
      assert.equal(session, 'owned-session'); events.push('stream.clear');
      if (options.clearWait) await options.clearWait;
      if (options.clearError) throw Error(options.clearError);
    } }, messenger: { send: (kind, data) => events.push({ kind, data }) } };
  const context = vm.createContext({ t: core, console: { warn: (...args) => warnings.push(args) },
    _b: class extends Error { constructor(session) { super(`ACP session unavailable: ${session}`); } },
    n: (kind, handler) => { assert.equal(kind, 'history/rewind'); registered = handler; } });
  vm.runInContext(between(source, 'function gcuHistorySessionId(value)', 'var Fje'), context);
  vm.runInContext(between(source, 'async function HOe(', 'async function RMt('), context);
  vm.runInContext(between(source, 'async function uen(', 'async function pen('), context);
  vm.runInContext(between(source, 'n("history/rewind",', 'n("history/fork",') + 'void 0;', context);
  return { calls, events, warnings, run: (type = 'dryRun', data = {}) => registered({ data: { id: 2, sessionId: 'owned-session', type, ...data } }) };
}

function forkFixture(source, options = {}) {
  const calls = [], events = [], errors = [], original = { sessionId: 'owned-session', title: 'Owned source', history: [{ message: { role: 'user', content: 'Preserve the original transcript' } }] };
  let registered, inLease = false;
  const entry = { acpSessionId: 'owned-acp', isStreaming: options.streaming === true,
    manager: { sendPrompt: async (session, prompt, callback) => {
      assert.equal(session, 'owned-acp'); assert.equal(inLease, true);
      calls.push(prompt[0].text);
      if (options.error) throw Error(options.error);
      if (options.wait) await options.wait;
      const text = options.text ?? 'Forked conversation seeded.';
      for (const part of [text.slice(0, 12), text.slice(12)]) callback({ sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: part } });
      return { stopReason: options.stopReason ?? 'end_turn' };
    } } };
  const holder = { current: options.unavailable ? undefined : entry, isDisposed: () => false,
    queue: { runExclusive: async callback => { assert.equal(inLease, false); inLease = true;
      try { return await callback(); } finally { inLease = false; } } } };
  const core = { getHolder: () => holder, getOrCreateAcpEntry: async () => undefined,
    ide: { getWorkspaceDirs: async () => ['F:/owned/workspace'] },
    pushHistoryListChanged: workspace => events.push({ kind: 'history.changed', workspace }),
    acpHistoryManager: { load: async id => {
      assert.equal(inLease, true, 'Persisted fork is verified under the source holder lease');
      events.push('checkpoint.read');
      assert.equal(id, 'owned-branch');
      if (options.loadWait) await options.loadWait;
      if (options.loadError) throw Error(options.loadError);
      return options.saved === undefined ? { sessionId: id, history: original.history.slice() } : options.saved;
    }, loadSessionMetadata: async id => { assert.equal(id, 'owned-session'); return original; } } };
  const context = vm.createContext({ t: core, Al: () => 'owned-branch', Bf: 'New conversation', process, Date,
    console: { error: (...args) => errors.push(args) },
    _b: class extends Error { constructor(session) { super(`ACP session unavailable: ${session}`); } },
    n: (kind, handler) => { assert.equal(kind, 'history/fork'); registered = handler; } });
  vm.runInContext(between(source, 'function gcuHistorySessionId(value)', 'var Fje'), context);
  vm.runInContext(between(source, 'async function HOe(', 'async function RMt('), context);
  vm.runInContext(between(source, 'async function pen(', 'async function BE('), context);
  vm.runInContext(between(source, 'n("history/fork",', 'n("history/save",') + 'void 0;', context);
  return { calls, events, errors, original, run: (data = {}) => registered({ data: { id: 1, sessionId: 'owned-session', ...data } }) };
}

for (const file of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(directory, file), 'utf8');
  test(`${file}: actual preview comes only from ACP metadata and cannot mutate GUI state`, async () => {
    const f = fixture(source), result = await f.run();
    assert.deepEqual(JSON.parse(JSON.stringify(result)), actualPreview());
    assert.deepEqual(f.calls, ['/rewind dryRun 2']); assert.deepEqual(f.events, []);
  });
  test(`${file}: session, index and type are validated before acquiring or prompting ACP`, async () => {
    for (const data of [{ sessionId: '../outside' }, { sessionId: '' }, { id: -1 }, { id: '2' }, { id: 1.5 }, { id: Number.MAX_SAFE_INTEGER + 1 }, { type: 'both' }]) {
      const f = fixture(source); await assert.rejects(f.run('dryRun', data), /Invalid/);
      assert.deepEqual(f.calls, []); assert.deepEqual(f.events, []);
    }
  });
  test(`${file}: unavailable ACP and rejected prompts propagate without preview or history success`, async () => {
    for (const options of [{ unavailable: true }, { dryRun: { error: 'Controlled ACP failure' } }, { streaming: true }]) {
      const f = fixture(source, options); await assert.rejects(f.run(), /unavailable|ACP failure|streaming/);
      assert.deepEqual(f.events, []);
    }
  });
  test(`${file}: missing or malformed checkpoint metadata never becomes a fabricated canRewind success`, async () => {
    for (const preview of [null, {}, { canRewind: true }, { ...actualPreview(), totalLineAdded: -1 }, { ...actualPreview(), changedFiles: [123] }]) {
      const f = fixture(source, { dryRun: { preview } }); await assert.rejects(f.run(), /valid rewind checkpoint preview/);
      assert.deepEqual(f.events, []);
    }
  });
  test(`${file}: real no-snapshot preview stays false, and code preflight prevents any write`, async () => {
    const preview = { ...actualPreview(), canRewind: false, changedFiles: [], fileDetails: [], changedFileCount: 0, effectiveChangedFileCount: 0,
      invalidRecords: [{ relativePath: '', error: 'Invalid point index: 2' }] };
    const f = fixture(source, { dryRun: { preview } }); assert.equal((await f.run()).canRewind, false);
    await assert.rejects(f.run('code'), /No restorable code checkpoint/);
    assert.deepEqual(f.calls, ['/rewind dryRun 2', '/rewind dryRun 2']); assert.deepEqual(f.events, []);
  });
  test(`${file}: textual CLI errors and cancelled ACP responses reject even if metadata was sent`, async () => {
    for (const behavior of [{ text: 'Error: Rewind service unavailable.' }, { stopReason: 'cancelled' }, { stopReason: 'max_tokens' }]) {
      const f = fixture(source, { dryRun: behavior }); await assert.rejects(f.run(), /Rewind failed|did not complete/);
      assert.deepEqual(f.events, []);
    }
  });
  test(`${file}: code rechecks the real preview under one lease and acknowledges actual restored counts`, async () => {
    const wait = deferred(), f = fixture(source, { code: { wait: wait.promise } });
    let settled = false; const operation = f.run('code').then(result => { settled = true; return result; });
    await tick(); assert.deepEqual(f.calls, ['/rewind dryRun 2', '/rewind code 2']);
    assert.equal(settled, false); assert.deepEqual(f.events, []);
    wait.resolve(); const result = await operation;
    assert.equal(result.applied, true); assert.equal(result.restoredCount, 1); assert.equal(result.failedFileCount, 0);
    assert.deepEqual(f.events.slice(0, 2), ['history.changed', 'stream.clear']);
    assert.equal(f.events[2].kind, 'stream/streamError'); assert.equal(f.events[2].data.error, null);
  });
  test(`${file}: unconfirmed, partial, skipped, no-op and failed code results cannot clear errors or notify success`, async () => {
    for (const behavior of [{ error: 'Controlled code RPC failure' }, { text: '' }, { text: 'No code changes to restore for this rewind point' },
      { text: 'Error: Code rewind partial. restored=1, deleted=0, skipped=0, failed=1' },
      { text: 'Code rewind success. restored=0, deleted=0, skipped=1, failed=0' },
      { text: 'Code rewind success. restored=1, deleted=0, skipped=0, failed=1' },
      { text: 'Code rewind success. restored=0, deleted=0, skipped=0, failed=0' }, { text: success, stopReason: 'cancelled' }]) {
      const f = fixture(source, { code: behavior }); await assert.rejects(f.run('code'), /RPC failure|confirm|Rewind failed|every checkpoint|did not complete/);
      assert.deepEqual(f.events, []);
    }
  });
  test(`${file}: a metadata cleanup failure preserves the old stream error after confirmed code restoration`, async () => {
    const f = fixture(source, { clearError: 'Controlled SQLite failure' }); const result = await f.run('code');
    assert.equal(result.applied, true); assert.deepEqual(f.events, ['history.changed', 'stream.clear']);
    assert.equal(f.warnings.length, 1); assert.match(f.warnings[0][0], /Code restored but could not clear/);
  });
  test(`${file}: fork returns its existing metadata contract only after ACP seed and persisted checkpoint verification`, async () => {
    const acp = deferred(), disk = deferred(), f = forkFixture(source, { wait: acp.promise, loadWait: disk.promise });
    let settled = false; const operation = f.run().then(value => { settled = true; return value; });
    await tick(); assert.deepEqual(f.calls, ['/fork owned-session 1 owned-branch']);
    assert.deepEqual(f.events, []); assert.equal(settled, false);
    acp.resolve(); await tick(); assert.deepEqual(f.events, ['checkpoint.read']); assert.equal(settled, false);
    disk.resolve(); const result = await operation;
    assert.equal(result.sessionId, 'owned-branch'); assert.equal(result.title, 'Owned source (forked)');
    assert.equal(result.workspaceDirectory, 'F:/owned/workspace'); assert.deepEqual(JSON.parse(JSON.stringify(result.history)), []);
    assert.equal(result.useUppercaseProjectHash, true); assert.ok(Number.isFinite(Date.parse(result.dateUpdated)));
    assert.deepEqual(f.events, ['checkpoint.read', { kind: 'history.changed', workspace: 'F:/owned/workspace' }]);
    assert.equal(f.original.history[0].message.content, 'Preserve the original transcript');
  });
  test(`${file}: fork ACP failures, textual errors, absent checkpoints and cancellations never advertise a fabricated session`, async () => {
    for (const options of [{ unavailable: true }, { streaming: true }, { error: 'Controlled fork ACP failure' },
      { text: 'Error: Cannot fork conversation because a turn is still in progress.' },
      { text: 'No saved checkpoint found with tag: owned-session.' }, { text: '' },
      { stopReason: 'cancelled' }, { text: 'Forked conversation seeded.', loadError: 'Persisted fork not found' },
      { saved: null }, { saved: { sessionId: 'another-session', history: [] } }, { saved: { sessionId: 'owned-branch' } }]) {
      const f = forkFixture(source, options); await assert.rejects(f.run(), /unavailable|streaming|ACP failure|Fork failed|confirm|did not complete|not found|not persisted/);
      assert.ok(!f.events.some(event => event.kind === 'history.changed'));
      assert.equal(f.original.sessionId, 'owned-session'); assert.equal(f.original.history.length, 1);
    }
  });
  test(`${file}: fork validates both session and numeric index before calling ACP or reading history`, async () => {
    for (const data of [{ sessionId: '../outside' }, { sessionId: '' }, { id: -1 }, { id: '1' }, { id: 1.5 }]) {
      const f = forkFixture(source); await assert.rejects(f.run(data), /Invalid/);
      assert.deepEqual(f.calls, []); assert.deepEqual(f.events, []);
    }
  });
}
