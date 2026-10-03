import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { downloadGameCoworkMedia } from '../../src/frontend/bundle/codely-generator/local-download.js';

const receipt = { ok: true, path: 'F:/owned/素材.png', byteLength: 4096, sha256: 'a'.repeat(64) };
async function attempt(result, ok = true) {
  const requests = [], notifications = [];
  const value = await downloadGameCoworkMedia('http://127.0.0.1:43210/api/codely-generator/local-inputs/i_owned/素材.png?workspaceKey=owned', '素材.png', (...args) => notifications.push(args), async (...args) => {
    requests.push(args);
    if (result instanceof Error) throw result;
    return { ok, json: async () => result };
  });
  return { requests, notifications, value };
}

test('Original download fields reach only the native save boundary and success requires a real saved-file receipt', async () => {
  const saved = await attempt(receipt);
  assert.equal(saved.requests.length, 1);
  const [url, options] = saved.requests[0];
  assert.equal(url, '/api/tauri/download-url');
  assert.equal(options.method, 'POST');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.redirect, 'error');
  assert.deepEqual(Object.keys(JSON.parse(options.body)), ['url', 'filename']);
  assert.deepEqual(saved.value, receipt);
  assert.deepEqual(saved.notifications, [['success', '文件已保存。']]);
});

test('Native cancellation is quiet and never causes a second request or fallback', async () => {
  const cancelled = await attempt({ cancelled: true });
  assert.deepEqual(cancelled.value, { cancelled: true });
  assert.equal(cancelled.requests.length, 1);
  assert.deepEqual(cancelled.notifications, []);
});

test('HTTP failure, false inner success, malformed receipt and transport error cannot claim a save', async () => {
  for (const [body, ok] of [[receipt, false], [{ ok: true }, true], [{ ...receipt, sha256: '' }, true], [{ ...receipt, byteLength: 0 }, true], [{ ...receipt, cancelled: true }, true], [{ success: true }, true], [new Error('connection closed'), true]]) {
    const failed = await attempt(body, ok);
    assert.deepEqual(failed.value, { ok: false });
    assert.equal(failed.requests.length, 1);
    assert.equal(failed.notifications.length, 1);
    assert.equal(failed.notifications[0][0], 'error');
  }
  const duplicate = await attempt({ error: 'download_destination_exists', message: 'private path must not be echoed' }, false);
  assert.match(duplicate.notifications[0][1], /已存在/);
  assert.doesNotMatch(duplicate.notifications[0][1], /private path/);
  const disconnected = await attempt(new Error('connection closed'));
  assert.match(disconnected.notifications[0][1], /无法确认保存结果.*检查目标文件/);
});

for (const [main, sidebar, payload] of [['index-BRxZ4eG7.js', 'RightSideBarPanel-JSPvAs5c.js', 've'], ['index-DvRYaIVa.js', 'RightSideBarPanel-B2OWNNNX.js', 'me']]) {
  test(main + ' and its sidebar keep original message/source checks and route native downloads before original browser fallback', () => {
    const base = new URL('../../src/frontend/bundle/assets/', import.meta.url);
    const source = fs.readFileSync(new URL(main, base), 'utf8'), side = fs.readFileSync(new URL(sidebar, base), 'utf8');
    const start = source.indexOf('!== "codely:download"'), end = source.indexOf('window.open(', start), listener = source.slice(start, end);
    assert.ok(start > 0 && end > start);
    assert.match(listener, /!C\((?:he|ue).source\)/);
    assert.match(listener, /(?:he|ue).origin !== X.current.targetOrigin/);
    assert.ok(listener.includes(`await downloadGameCoworkMedia(${payload}.url, ${payload}.filename, gamecoworkNotifyDownload);\n          return;`));
    assert.match(source, /void downloadGameCoworkMedia\(x, E, gamecoworkNotifyDownload\);\n\s+return;/);
    assert.match(side, /g.source !== .*a.current[\s\S]{0,100}g.origin !== qa/);
    assert.match(side, /if \(gamecoworkLocalCanvas\) \{\s+void downloadGameCoworkMedia\(E, S, gamecoworkNotifyDownload\);\s+return;/);
  });
}
