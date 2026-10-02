'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const test = require('node:test'), assert = require('node:assert/strict');

function actualFunction(source, name) {
  const start = source.indexOf('function ' + name + '(');
  assert.ok(start >= 0, 'Actual Core function is present: ' + name);
  const opening = source.indexOf('{', start); let depth = 0;
  for (let index = opening; index < source.length; index++) {
    if (source[index] === '{') depth++;
    else if (source[index] === '}' && --depth === 0) return source.slice(start, index + 1);
  }
  assert.fail('Unterminated Core function: ' + name);
}
for (const file of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(__dirname, '../../src/core/binary/out', file), 'utf8');
  function fixture({ projects = true, editors = true } = {}) {
    const calls = [], context = vm.createContext({
      PUt(product) { calls.push(['hub', product]); return 'owned-' + product; },
      Z2i(product, hub) { assert.ok(projects, 'Project scanning must not run while discovering editors'); calls.push(['projects', product, hub]); return [{ path: product + '/owned-project' }]; },
      qba(product) { assert.ok(editors, 'Editor scanning must not run while refreshing projects'); calls.push(['editors', product]); return [{ path: product + '/owned-editor' }]; },
    });
    for (const name of ['gcwHubProjects', 'gcwHubEditors', 'eha']) vm.runInContext(actualFunction(source, name), context);
    const handlers = new Map(); context.n = (kind, handler) => handlers.set(kind, handler);
    for (const route of ['unity/getHubProjects', 'unity/getHubEditors', 'unity/getHubProjectsAndEditors']) {
      const escaped = route.replaceAll('/', '\\/');
      const registration = source.match(new RegExp('n\\("' + escaped + '",\\s*\\(\\)\\s*=>\\s*[A-Za-z0-9_$]+\\(\\)\\)'));
      assert.ok(registration, 'Actual handler registration: ' + route); vm.runInContext(registration[0], context);
    }
    return { calls, run: kind => JSON.parse(JSON.stringify(handlers.get(kind)())) };
  }
  test(file + ': actual project route reads both products without enumerating any editor installation', () => {
    const f = fixture({ editors: false }), groups = f.run('unity/getHubProjects');
    assert.deepEqual(groups, ['tuanjie', 'unity'].map(product => ({ product, projects: [{ path: product + '/owned-project' }], editors: [] })));
    assert.deepEqual(f.calls, [['hub','tuanjie'],['projects','tuanjie','owned-tuanjie'],['hub','unity'],['projects','unity','owned-unity']]);
    f.run('unity/getHubProjects'); assert.equal(f.calls.filter(row => row[0] === 'projects').length, 4, 'Project refresh stays live');
  });
  test(file + ': actual editor route never probes recent projects', () => {
    const f = fixture({ projects: false }), groups = f.run('unity/getHubEditors');
    assert.deepEqual(groups, ['tuanjie', 'unity'].map(product => ({ product, projects: [], editors: [{ path: product + '/owned-editor' }] })));
    assert.deepEqual(f.calls, [['editors','tuanjie'],['editors','unity']]);
  });
  test(file + ': legacy combined discovery keeps both real scanner calls', () => {
    const f = fixture(), groups = f.run('unity/getHubProjectsAndEditors');
    assert.equal(groups.length, 2); assert.ok(groups.every(group => group.projects.length === 1 && group.editors.length === 1));
    assert.equal(f.calls.filter(row => row[0] === 'projects').length, 2); assert.equal(f.calls.filter(row => row[0] === 'editors').length, 2);
  });
}
