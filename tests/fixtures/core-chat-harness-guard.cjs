// Test-only tracing/barriers around the real Core -> real compiled Agent boundary.
// The actual prompt still reaches the guarded Agent and loopback provider; only
// explicitly marked fixture final receipts are replaced after the Agent settles.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
require(process.env.GAMECOWORK_CHAT_ROOT ? './chat-core-guard.cjs' : './core-chat-spawn-guard.cjs');
const root = path.resolve(process.env.GAMECOWORK_CHAT_ROOT || process.env.GAMECOWORK_SMOKE_ROOT);
const entry = path.resolve(process.env.GAMECOWORK_CORE_ENTRY).toLowerCase();
const expected = process.env.GAMECOWORK_HARNESS_CORE_SHA;
const heldSession = process.env.GAMECOWORK_HARNESS_HOLD_SESSION;
const events = path.join(root, 'harness-events.jsonl');
const releaseFile = path.join(root, 'harness-init.release');
let sequence = 0;
function trace(event, details = {}) {
  fs.appendFileSync(events, JSON.stringify({ sequence: ++sequence, event, time: Date.now(), corePid: process.pid, ...details }) + '\n');
}
async function release() {
  if (fs.existsSync(releaseFile)) return;
  await new Promise((resolve, reject) => {
    const watcher = fs.watch(root, (_event, name) => {
      if (String(name) === path.basename(releaseFile) && fs.existsSync(releaseFile)) finish();
    });
    const timer = setTimeout(() => finish(Error('Owned chat initialization barrier was not released')), 60000);
    function finish(error) { clearTimeout(timer); watcher.close(); error ? reject(error) : resolve(); }
    if (fs.existsSync(releaseFile)) finish();
  });
}
globalThis.__GAMECOWORK_HARNESS_TEST = {
  async create(manager, cwd, options, id) {
    const result = await manager.createSession(cwd, options);
    if (id === heldSession) {
      trace('initializationHeld', { sessionId: id, actorPid: manager.process?.pid });
      await release();
      trace('initializationReleased', { sessionId: id });
    }
    return result;
  },
  async acquire(queue, message) {
    const identity = { messageId: message.messageId, sessionId: message.data.continueSessionId,
      queuedFixture: JSON.stringify(message.data.messages || []).includes('GCW_HARNESS_QUEUED_CANCEL') };
    trace('queueWaiting', identity);
    const lease = await queue.acquire();
    trace('queueAcquired', identity);
    return lease;
  },
  async prompt(manager, sessionId, blocks, update) {
    const text = blocks.filter(item => item.type === 'text').at(-1)?.text || '';
    const scenario = /GCW_HARNESS_FINAL_(REFUSAL|LIMIT|MISSING|CANCELLED)/.exec(text)?.[1]
      || (/GCW_HARNESS_QUEUED_CANCEL/.test(text) ? 'QUEUED' : 'NORMAL');
    trace('promptDispatched', { sessionId, scenario });
    const receipt = await manager.sendPrompt(sessionId, blocks, update);
    trace('promptSettled', { sessionId, scenario, actualStopReason: receipt?.stopReason });
    switch (scenario) {
      case 'REFUSAL': return { stopReason: 'refusal' };
      case 'LIMIT': return { stopReason: 'max_tokens' };
      case 'MISSING': return {};
      case 'CANCELLED': return { stopReason: 'cancelled' };
      default: return receipt;
    }
  },
  async *stream(stream, message) {
    const identity = { messageId: message.messageId, sessionId: message.data.continueSessionId,
      queuedFixture: JSON.stringify(message.data.messages || []).includes('GCW_HARNESS_QUEUED_CANCEL') };
    try {
      for (;;) {
        const next = await stream.next();
        if (next.done) {
          trace('streamSettled', { ...identity, cancelled: next.value?.cancelled === true, stopReason: next.value?.stopReason });
          return next.value;
        }
        yield next.value;
      }
    } catch (error) {
      trace('streamFailed', { ...identity, code: error?.code });
      throw error;
    }
  },
};
const compile = Module.prototype._compile;
Module.prototype._compile = function(content, filename) {
  if (path.resolve(filename).toLowerCase() === entry) {
    if (!expected || crypto.createHash('sha256').update(content).digest('hex').toLowerCase() !== expected.toLowerCase())
      throw Error('Chat harness probe Core source SHA differs');
    const edits = [
      [/F\s*=\s*await y\.createSession\(Z,\s*Y\)/g,
        'F=await globalThis.__GAMECOWORK_HARNESS_TEST.create(y,Z,Y,e)', 2],
      [/p\s*=\s*await d\.queue\.acquire\(\)/g,
        'p=await globalThis.__GAMECOWORK_HARNESS_TEST.acquire(d.queue,e)', 1],
      [/let S\s*=\s*n\s*\.sendPrompt\(/g,
        'let S=globalThis.__GAMECOWORK_HARNESS_TEST.prompt(n,', 1],
      [/return t\.streamChatViaACPHandler\(G,\s*b,\s*t\.llmLogger,\s*h\)/g,
        'return globalThis.__GAMECOWORK_HARNESS_TEST.stream(t.streamChatViaACPHandler(G,b,t.llmLogger,h),G)', 1],
    ];
    for (const [pattern, replacement, count] of edits) {
      if ([...content.matchAll(pattern)].length !== count) throw Error('Chat harness exact maintained boundary count differs: ' + pattern);
      content = content.replace(pattern, replacement);
    }
    trace('sourceVerified', { sourceSha256: expected });
  }
  return compile.call(this, content, filename);
};
