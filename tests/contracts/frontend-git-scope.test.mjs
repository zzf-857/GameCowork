import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const assets = new URL('../../src/frontend/bundle/assets/', import.meta.url);
for (const [panel, theme] of [['RightSideBarPanel-JSPvAs5c.js', 'VscTheme-BExNMG_K.js'], ['RightSideBarPanel-B2OWNNNX.js', 'VscTheme-B-CSeuv5.js']]) {
  const source = fs.readFileSync(new URL(panel, assets), 'utf8').replaceAll('\r\n', '\n');
  const data = fs.readFileSync(new URL(theme, assets), 'utf8').replaceAll('\r\n', '\n');
  const start = source.indexOf('function jT({ isOpen: e,'), end = source.indexOf('\n}', start) + 2;
  const lifeStart = data.indexOf('const gamecoworkWorkspaceLifecycle ='), lifeEnd = data.indexOf('const zkt =', lifeStart);
  assert.ok(start >= 0 && end > start && lifeStart >= 0 && lifeEnd > lifeStart);
  const helpers = data.slice(lifeStart, lifeEnd).replace(/^export .*$/gm, '');
  function fixture(shell = true) {
    let resolve;
    const states = [], calls = [], state = { hub: { workspaces: [{ workspaceKey: 'A' }, { workspaceKey: 'B' }] } };
    const pending = new Promise(done => { resolve = done; });
    const context = vm.createContext({ window: { GAMECOWORK_SHELL: shell },
      gamecoworkSidebarStore: { getState: () => state },
      T: { useState: () => [null, value => states.push(value)], useRef: () => ({ current: 0 }), useCallback: fn => fn, useEffect: fn => fn() },
      Xc: (...args) => { calls.push(args); return pending; },
    });
    vm.runInContext(helpers + '\n' + source.slice(start, end), context);
    return { context, states, calls, state, resolve,
      run: key => context.jT({ isOpen: true, workspaceRoot: 'F:/owned/' + key, workspaceRoute: { workspaceKey: key }, workspaceKey: key }),
    };
  }
  test(panel + ': a closing or closed owner cannot issue a new Git query', () => {
    const f = fixture(); f.context.gamecoworkWorkspaceTransition('A', 'closing'); f.run('A');
    assert.equal(f.calls.length, 0); assert.equal(f.states.at(-1), false);
    f.context.gamecoworkWorkspaceTransition('A', 'closed'); f.run('A'); assert.equal(f.calls.length, 0);
    f.run('B'); assert.equal(f.calls.length, 1); assert.equal(f.calls[0][1].workspaceKey, 'B');
  });
  test(panel + ': late old-owner Git results cannot write into a reopened generation', async () => {
    const f = fixture(); f.run('A'); assert.equal(f.calls.length, 1);
    f.context.gamecoworkWorkspaceTransition('A', 'closing'); f.context.gamecoworkWorkspaceTransition('A', 'closed');
    f.context.gamecoworkWorkspaceTransition('A', 'opened'); f.resolve({ hasRepo: true }); await new Promise(setImmediate);
    assert.ok(!f.states.includes(true));
  });
  test(panel + ': live B and other hosts retain actual Git detection', async () => {
    for (const shell of [true, false]) {
      const f = fixture(shell); f.context.gamecoworkWorkspaceTransition('A', 'closed'); f.run(shell ? 'B' : 'A');
      f.resolve({ hasRepo: true }); await new Promise(setImmediate); assert.equal(f.states.at(-1), true);
    }
  });
}

for (const [file, name, routeName, storeName] of [['index-BRxZ4eG7.js', 'k2', 'kt', 'bh'], ['index-DvRYaIVa.js', 'S2', 'St', 'vh']]) {
  const source = fs.readFileSync(new URL(file, assets), 'utf8').replaceAll('\r\n', '\n');
  const start = source.indexOf('async function ' + name + '('), end = source.indexOf('\n}', start) + 2;
  assert.ok(start >= 0 && end > start);
  test(file + ': every Git probe checks its explicit owner before crossing the host boundary', async () => {
    const calls = [], state = { hub: { isHubMode: true, workspaces: [{ workspaceKey: 'B', workspaceDir: 'F:/owned/B' }] } };
    const read = vm.runInNewContext('(' + source.slice(start, end) + ')', {
      window: { GAMECOWORK_SHELL: true }, [storeName]: () => ({ getState: () => state }),
      [routeName]: root => ({ body: { workspaceRef: { runOn: 'local', workspaceDir: root } } }),
      gamecoworkWorkspaceLive: (_state, key) => key === 'B',
      ms: async (...args) => { calls.push(args); return []; }, ws: value => value,
    });
    await assert.rejects(read('F:/owned/A', 'F:/owned/A'), error => error.code === 'WorkspaceQueryCancelled');
    assert.equal(calls.length, 0);
    await read('F:/owned/B', 'F:/owned/B'); assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'findGitRepositories');
  });
}
