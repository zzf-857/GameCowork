const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../../src/core/binary/out');
const quiet = { debug() {}, warn() {}, error() {} };
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
async function drain(stream) {
  const chunks = [];
  for (;;) {
    const item = await stream.next();
    if (item.done) return { chunks, result: item.value };
    chunks.push(item.value);
  }
}

for (const file of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const start = source.search(/async\s*function\*\s*H6e\(/);
  const end = source.indexOf('function Gen(', start);
  assert.ok(start >= 0 && end > start, `${file}: extract the real ACP chat generator`);
  const helperStart = source.indexOf('function gcuAcpChatCancelled(');
  const prefix = helperStart >= 0 && helperStart < start ? source.slice(helperStart, start) : '';
  const generator = prefix + source.slice(start, end);
  const handlerStart = source.search(/async\s*\*\s*streamChatViaACPHandler\(/);
  const handlerEnd = source.indexOf('async shutdownACPForSession(', handlerStart);
  assert.ok(handlerStart >= 0 && handlerEnd > handlerStart, `${file}: extract the real foreground stream handler`);
  const handler = source.slice(handlerStart, handlerEnd);

  function fixture({ result = { stopReason: 'end_turn' }, prompt, modes, acquire, initialize } = {}) {
    const controller = new AbortController();
    const calls = [], sent = [], notifications = [], logs = [];
    const manager = {
      async modeRequest(...args) { calls.push(['mode', ...args]); await modes?.promise; },
      maybeUploadPromptAttachmentFilePaths() {},
      setPermissionRequestCallback(callback) { this.permissionCallback = callback; },
      async sendPrompt(id, blocks, update) {
        calls.push(['prompt', id, blocks]);
        update({ sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Owned partial answer' } });
        return prompt ? prompt.promise : result;
      },
    };
    const entry = { manager, acpSessionId: 'owned-acp-session', model: 'fixture-model',
      collaborationMode: 'default', approvalMode: 'default', lastUsedAt: 0, isStreaming: false };
    let released = 0;
    const holder = { current: entry, queue: { async acquire() { await acquire?.promise; return () => { released++; }; } } };
    const owner = {
      configHandler: { loadConfig: async () => ({ config: {} }) },
      async getOrCreateAcpEntry() { calls.push(['initialize']); await initialize?.promise; return entry; },
      checkRestart: () => false,
      getHolder: () => holder,
      send: (...args) => sent.push(args),
      sendIdeNotificationIfEnabled: value => { notifications.push(value); return false; },
      buildStreamingConversationHistory: async () => [],
      saveCheckpointThenApplyDeferredRestart() {},
      acpHistoryManager: {
        async clearSessionStreamError() { calls.push(['clear-error']); },
        async saveSessionStreamError(...args) { calls.push(['save-error', ...args]); },
        async markAsUnread() { return false; },
      },
    };
    const message = { messageId: 'owned-stream', data: { continueSessionId: 'owned-session', title: 'Fixture',
      messages: [{ role: 'user', content: 'Synthetic prompt' }], completionOptions: {}, approvalMode: 'default' } };
    const adapter = {
      chatMessagesToPrompt: messages => messages.map(item => ({ type: 'text', text: item.content })),
      collectPromptImageFileUrls: () => [],
      createEmptyAssistantMessage: () => ({ role: 'assistant', content: '' }),
      sessionUpdateToChatMessage: (update, current) => update.sessionUpdate === 'agent_message_chunk'
        ? { ...current, content: current.content + update.content.text } : current,
    };
    const context = vm.createContext({ console: quiet, Date, Promise, Set, AbortController,
      m() {}, Cl: adapter, jR: class {},
      gcuStoredSessionMode: async (_owner, input) => input, Xpa: () => ({}), Iya: async () => {}, Sx: () => 'RW',
      bpe: messages => messages, Tpa: value => value, hbe() {}, Zbe() {}, Al: () => 'owned-notification',
      k$t: () => false, fGa() {}, vbe: () => null,
    });
    vm.runInContext(generator + '\nglobalThis.streamHandler = ({' + handler + '}).streamChatViaACPHandler;', context);
    const options = { acpManager: manager, acpSessionId: entry.acpSessionId, abortController: controller,
      currentModel: entry.model, currentCollaborationMode: entry.collaborationMode, currentApprovalMode: entry.approvalMode,
      llmLogger: { createInteractionLog: () => ({ logItem: item => logs.push(item) }) } };
    return { context, owner, entry, message, controller, calls, sent, notifications, logs,
      released: () => released, run: () => drain(context.H6e(options, message)),
      runHandler: () => drain(context.streamHandler.call(owner, message, controller, options.llmLogger)) };
  }

  test(`${file}: normal final ACP receipt preserves real chunks and completion`, async () => {
    const f = fixture();
    const { chunks, result } = await f.run();
    assert.equal(chunks.map(chunk => chunk.content).join(''), 'Owned partial answer');
    assert.equal(result.completion, 'Owned partial answer');
    assert.equal(f.logs.filter(item => item.kind === 'success').length, 1);
  });

  test(`${file}: missing, refused, limited and invalid ACP final receipts cannot report success`, async () => {
    for (const result of [undefined, {}, { stopReason: 'refusal' }, { stopReason: 'max_tokens' },
      { stopReason: 'max_turn_requests' }, { stopReason: 'error' }, { stopReason: 'unexpected' }, { stopReason: '__proto__' }]) {
      const f = fixture({ result: result === undefined ? null : result });
      await assert.rejects(f.run(), /final|refus|limit|failed|invalid/i);
      assert.equal(f.logs.some(item => item.kind === 'success'), false);
    }
  });

  test(`${file}: Agent cancellation keeps partial output and is a cancelled terminal receipt`, async () => {
    const f = fixture({ result: { stopReason: 'cancelled' } });
    const { result } = await f.run();
    assert.equal(result.cancelled, true);
    assert.equal(result.completion, 'Owned partial answer');
    assert.equal(f.logs.some(item => item.kind === 'success'), false);
  });

  test(`${file}: cancelled requests cannot dispatch after a pending mode update`, async () => {
    const modes = deferred(), f = fixture({ modes });
    const pending = f.run();
    await new Promise(resolve => setImmediate(resolve));
    f.controller.abort(); modes.resolve();
    assert.equal((await pending).result.cancelled, true);
    assert.equal(f.calls.some(([kind]) => kind === 'prompt'), false);
  });

  test(`${file}: cancellation during initialization cannot dispatch a late prompt`, async () => {
    const initialize = deferred(), f = fixture({ initialize });
    const pending = f.runHandler();
    await new Promise(resolve => setImmediate(resolve));
    f.controller.abort(); initialize.resolve();
    assert.equal((await pending).result.cancelled, true);
    assert.equal(f.calls.some(([kind]) => kind === 'prompt'), false);
    assert.equal(f.notifications.length, 0);
  });

  test(`${file}: cancelling a queued turn releases only its lease and keeps the previous stream untouched`, async () => {
    const acquire = deferred(), f = fixture({ acquire });
    const previous = { isStreaming: false, currentMessageId: 'previous-stream' };
    f.entry.streamingState = previous;
    const pending = f.runHandler();
    await new Promise(resolve => setImmediate(resolve));
    f.controller.abort(); acquire.resolve();
    assert.equal((await pending).result.cancelled, true);
    assert.equal(f.calls.some(([kind]) => kind === 'prompt'), false);
    assert.equal(f.entry.streamingState, previous);
    assert.equal(f.sent.some(([kind]) => kind === 'stream/streamFinished' || kind === 'stream/userMessageBroadcast'), false);
    assert.equal(f.released(), 1);
  });

  test(`${file}: cancelled final receipts never trigger the Agent task finished notification`, async () => {
    const f = fixture({ result: { stopReason: 'cancelled' } });
    const { result } = await f.runHandler();
    assert.equal(result.cancelled, true);
    assert.equal(f.notifications.length, 0);
    assert.equal(f.sent.filter(([kind]) => kind === 'stream/streamFinished').length, 1);
  });

  test(`${file}: final failure persists its actual reason, releases the lease and never clears errors or announces success`, async () => {
    const f = fixture({ result: { stopReason: 'max_tokens' } });
    await assert.rejects(f.runHandler(), /token limit/);
    assert.equal(f.calls.filter(([kind]) => kind === 'save-error').length, 1);
    assert.match(f.calls.find(([kind]) => kind === 'save-error')[2].message, /token limit/);
    assert.equal(f.calls.some(([kind]) => kind === 'clear-error'), false);
    assert.equal(f.notifications.length, 0);
    assert.equal(f.entry.isStreaming, false);
    assert.equal(f.sent.filter(([kind]) => kind === 'stream/streamFinished').length, 1);
    assert.equal(f.released(), 1);
  });

  test(`${file}: a request already cancelled before iteration never initializes an Agent`, async () => {
    const f = fixture(); f.controller.abort();
    assert.equal((await f.runHandler()).result.cancelled, true);
    assert.equal(f.calls.length, 0);
    assert.equal(f.sent.length, 0);
  });

  test(`${file}: an explicit cancellation wins over a late prompt failure without a false success log`, async () => {
    const prompt = deferred(), f = fixture({ prompt });
    const pending = f.run();
    await new Promise(resolve => setImmediate(resolve));
    f.controller.abort(); prompt.reject(new Error('Owned late transport failure'));
    const { result } = await pending;
    assert.equal(result.cancelled, true);
    assert.equal(result.completion, 'Owned partial answer');
    assert.equal(f.logs.some(item => item.kind === 'success'), false);
  });
}
