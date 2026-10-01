// Execute only the extracted storage helpers, never the core's startup code.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const test = require('node:test');

const fixtureBase = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests');
const fixtureRoot = path.join(fixtureBase, `core-user-data-${randomUUID()}`);
fs.mkdirSync(fixtureRoot, { recursive: true });
test.after(() => {
  const resolved = fs.realpathSync(fixtureRoot);
  const base = fs.realpathSync(fixtureBase);
  assert.ok(resolved.startsWith(`${base}${path.sep}`));
  assert.ok(path.basename(resolved).startsWith('core-user-data-'));
  fs.rmSync(resolved, { recursive: true });
});

function extract(source, start, end) {
  const left = source.indexOf(start);
  const right = source.indexOf(end, left + start.length);
  assert.ok(left >= 0 && right > left, `Missing helper boundary ${start}`);
  assert.equal(source.indexOf(start, left + start.length), -1, `Ambiguous helper ${start}`);
  return source.slice(left, right);
}

for (const filename of ['index.js', 'index.beautified.js']) {
  const source = fs.readFileSync(path.join(__dirname, '../restored/core-gamecowork-binary/binary/out', filename), 'utf8');
  const helpers = [
    extract(source, 'function gcuDataOverride()', 'function SOt('),
    extract(source, 'function CEi()', 'async function QEi()'),
    extract(source, 'function gcuClipboardDir(', 'async function gha('),
  ].join('\n');

  function context(env, legacyRoot = path.join(fixtureRoot, 'legacy-profile')) {
    const homedir = () => legacyRoot;
    const value = vm.createContext({
      process: { env: { ...env }, platform: 'win32' },
      ape: path, Sua: { homedir }, aRi: '.gamecowork', XOt: 'settings.json',
      FR: fs, LOt: { parse: JSON.parse }, OP: { default: path },
      uOe: { default: { homedir } }, FEi: 'unity-metrics-distinct-id', Dx: path,
    });
    vm.runInContext(helpers, value, { timeout: 1000 });
    return value;
  }

  test(`${filename}: explicit directory wins over E2E and all profile paths`, () => {
    const explicit = path.join(fixtureRoot, `${filename}-isolated 中文`);
    const ctx = context({
      GAMECOWORK_USER_DATA_DIR: ` ${explicit} `,
      GAMECOWORK_E2E: '1', GAMECOWORK_E2E_USER_DATA_DIR: path.join(fixtureRoot, 'other-e2e'),
      LOCALAPPDATA: path.join(fixtureRoot, 'legacy-appdata'),
      XDG_DATA_HOME: path.join(fixtureRoot, 'legacy-xdg'),
    });
    ctx.Sua.homedir = () => { throw new Error('Profile fallback was accessed'); };
    ctx.uOe.default.homedir = ctx.Sua.homedir;
    assert.equal(ctx._ua(), explicit);
    assert.equal(ctx.CEi(), path.join(explicit, 'metrics', 'unity-metrics-distinct-id'));
    assert.equal(ctx.gcuClipboardDir(undefined), path.join(explicit, 'clipboard'));
  });

  test(`${filename}: existing E2E directory remains supported and takes precedence over fallback`, () => {
    const e2e = path.join(fixtureRoot, `${filename}-e2e`);
    const ctx = context({ GAMECOWORK_USER_DATA_DIR: '   ', GAMECOWORK_E2E: '1', GAMECOWORK_E2E_USER_DATA_DIR: ` ${e2e} ` });
    assert.equal(ctx._ua(), e2e);
    assert.equal(ctx.CEi(), path.join(e2e, 'metrics', 'unity-metrics-distinct-id'));
    assert.equal(ctx.gcuClipboardDir(undefined), path.join(e2e, 'clipboard'));
  });

  test(`${filename}: fallback storage keeps GameCowork's own namespace`, () => {
    const profile = path.join(fixtureRoot, 'fallback-profile');
    const local = path.join(fixtureRoot, 'fallback-appdata');
    const ctx = context({ GAMECOWORK_E2E: '0', GAMECOWORK_E2E_USER_DATA_DIR: 'ignored', LOCALAPPDATA: local }, profile);
    assert.equal(ctx._ua(), path.join(profile, '.gamecowork'));
    assert.equal(ctx.CEi(), path.join(local, 'GameCowork', 'unity-metrics-distinct-id'));
  });

  test(`${filename}: clipboard files in an opened project keep their project location`, () => {
    const workspace = path.join(fixtureRoot, 'Project A');
    const ctx = context({ GAMECOWORK_USER_DATA_DIR: path.join(fixtureRoot, 'isolated') });
    assert.equal(ctx.gcuClipboardDir(workspace), path.join(workspace, '.gamecowork', 'clipboard'));
  });

  test(`${filename}: settings writes reach the isolated directory and preserve legacy fixture data`, () => {
    const legacyRoot = path.join(fixtureRoot, `${filename}-legacy-profile`);
    const legacyFile = path.join(legacyRoot, '.gamecowork', 'settings.json');
    const isolated = path.join(fixtureRoot, `${filename}-write-fixture`);
    fs.mkdirSync(path.dirname(legacyFile), { recursive: true });
    fs.writeFileSync(legacyFile, '{"fixture":"preserve"}\n');
    const ctx = context({ GAMECOWORK_USER_DATA_DIR: isolated }, legacyRoot);
    ctx.P2({ fixture: 'isolated', migratedToSingleProvider: true });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(isolated, 'settings.json'), 'utf8')), { fixture: 'isolated', migratedToSingleProvider: true });
    assert.equal(fs.readFileSync(legacyFile, 'utf8'), '{"fixture":"preserve"}\n');
  });
}
