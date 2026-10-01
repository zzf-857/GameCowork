import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { unityReply, unityOwner, openUnityViews, setupUnityBridge, unityViews } from '../../src/frontend/bundle/assets/gamecowork-unity-connectors.js';

const owner = unityOwner({ isUnityProject: true, projectRoot: 'F:/owned/A' }, 'A');
test('Bridge install receipt is followed by actual same-project metadata, never substituted for it', async () => {
  const calls = [], metadata = { isUnityProject: true, projectRoot: 'F:/owned/A', hasUnityMcpPackage: true };
  const messenger = { request: async (kind, route) => {
    calls.push({ kind, route });
    return { status: 'success', content: { status: 'success', content: kind === 'unity/installMcpPackage'
      ? { requiresEditorImport: true, connected: false, manifestUpdated: true } : metadata } };
  } };
  assert.equal(await setupUnityBridge(messenger, owner), metadata);
  assert.deepEqual(calls.map(call => call.kind), ['unity/installMcpPackage', 'unity/getProjectStatus']);
  assert.ok(calls.every(call => call.route === owner));
});
test('An obsolete installation response cannot probe or publish into another workspace', async () => {
  const calls = [], messenger = { request: async kind => { calls.push(kind); return { requiresEditorImport: true }; } };
  assert.equal(await setupUnityBridge(messenger, owner, () => false), null);
  assert.deepEqual(calls, ['unity/installMcpPackage']);
});
test('Wrong-project metadata and nested failures remain errors', async () => {
  const messenger = { request: async kind => kind === 'unity/installMcpPackage' ? { requiresEditorImport: true }
    : { isUnityProject: true, projectRoot: 'F:/owned/B' } };
  await assert.rejects(setupUnityBridge(messenger, owner), /身份不匹配/);
  assert.throws(() => unityReply({ status: 'success', content: { status: 'error', error: 'actual failure' } }), /actual failure/);
});
test('Opening the connectors is a pure same-origin UI message with fixed ownership', () => {
  const messages = [], target = { location: { origin: 'http://127.0.0.1:35001' }, postMessage: (...args) => messages.push(args) };
  assert.equal(openUnityViews(owner, undefined, target), true);
  for (const view of unityViews) assert.equal(openUnityViews(owner, view[2], target), true);
  assert.equal(openUnityViews(owner, 'Unknown.Editor', target), false);
  assert.equal(openUnityViews({ workspaceRef: { runOn: 'remote', workspaceDir: 'F:/owned/A' } }, undefined, target), false);
  assert.equal(messages.length, 7);
  for (const [message, origin] of messages) {
    assert.equal(message.messageType, 'shell/openUnityViews'); assert.equal(message.data.workspaceKey, 'A');
    assert.equal(message.data.workspaceRoot, 'F:/owned/A'); assert.equal(origin, target.location.origin);
  }
});

for (const [filename, selector] of [['VscTheme-BExNMG_K.js', 'Joe'], ['VscTheme-B-CSeuv5.js', 'ese']]) {
  const source = fs.readFileSync(new URL('../../src/frontend/bundle/assets/' + filename, import.meta.url), 'utf8');
  const start = source.indexOf('const ' + selector + ' = (e) => {'), end = source.indexOf('\n  },', start) + 4;
  const select = vm.runInNewContext(source.slice(start, end) + '; ' + selector, { window: { GAMECOWORK_SHELL: true }, Im: state => state.unity });
  test(filename + ': editor connectivity works before creating a chat session', () => {
    assert.equal(select({ unity: { connectionStatus: { status: 'connected' }, sessionStatuses: {}, isLaunching: false } }), 'connected');
    assert.equal(select({ unity: { connectionStatus: { status: 'not-connected' }, sessionStatuses: {}, isLaunching: true } }), 'launching');
  });
  test(filename + ': stale ACP session connectivity cannot hide a disconnected local editor', () => {
    const status = { status: 'not-connected', error: 'offline' }, unity = { connectionStatus: { status: 'connected' }, sessionStatuses: { oldChat: { status: 'connected' } }, isLaunching: false };
    const reducerStart = source.indexOf('setSessionStatus: (e, t) => {'), reducerEnd = source.indexOf('\n      setEditorPid:', reducerStart);
    const text = source.slice(reducerStart + 'setSessionStatus: '.length, reducerEnd).trim().replace(/,$/, '');
    const setStatus = vm.runInNewContext('(' + text + ')', { window: { GAMECOWORK_SHELL: true }, $c: state => state.unity });
    setStatus({ unity }, { payload: { workspaceKey: 'A', sessionId: 'local-editor:A', status } });
    assert.equal(unity.connectionStatus, status);
    assert.equal(select({ unity, session: { activeSessionId: 'oldChat' } }), 'disconnected');
    // Late old ACP replies must not regain authority over the real editor probe.
    setStatus({ unity }, { payload: { workspaceKey: 'A', sessionId: 'oldChat', status: { status: 'connected' } } });
    assert.equal(unity.connectionStatus, status);
  });
}
