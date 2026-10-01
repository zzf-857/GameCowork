import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

for (const file of ['index-DG7m4Xaq.js', 'index-CKZIQMcw.js']) {
  const source = fs.readFileSync(new URL('../restored/frontend/dist-beautified/' + file, import.meta.url), 'utf8');
  const begin = source.indexOf('    Me = async (Le) => {');
  assert.ok(begin >= 0, 'Actual desktop key handler must be present');
  const end = source.indexOf('\n    };', begin);
  assert.ok(end > begin);
  const handlerText = source.slice(begin, end + '\n    }'.length).trim().replace(/^Me = /, '');
  function fixture(shell, platform = 'Windows') {
    const calls = [];
    const handler = vm.runInNewContext('(' + handlerText + ')', {
      window: { GAMECOWORK_SHELL: shell }, navigator: { userAgent: platform },
      xn: async () => ({ invoke: async (...args) => calls.push(args) }), console,
    });
    return { handler, calls };
  }
  for (const shiftKey of [false, true]) {
    test(file + ': native C# ' + (shiftKey ? 'Shift+F12' : 'F12') + ' reaches Monaco', async () => {
      const { handler, calls } = fixture(true);
      let prevented = 0, stopped = 0;
      await handler({ key: 'F12', shiftKey, preventDefault: () => prevented++, stopPropagation: () => stopped++ });
      assert.equal(prevented, 0); assert.equal(stopped, 0); assert.equal(calls.length, 0);
    });
  }
  test(file + ': legacy Windows devtools handler retains its existing scope', async () => {
    const { handler, calls } = fixture(false);
    let prevented = 0, stopped = 0;
    await handler({ key: 'F12', preventDefault: () => prevented++, stopPropagation: () => stopped++ });
    assert.equal(prevented, 1); assert.equal(stopped, 1);
    assert.deepEqual(Array.from(calls[0]), ['toggle_devtools']);
  });
  test(file + ': unrelated keys and platform bypass capture', async () => {
    for (const [key, platform] of [['F11', 'Windows'], ['F12', 'Linux']]) {
      const { handler, calls } = fixture(false, platform);
      await handler({ key, preventDefault: () => assert.fail('Unexpected key capture'), stopPropagation: () => assert.fail('Unexpected key capture') });
      assert.equal(calls.length, 0);
    }
  });
}
