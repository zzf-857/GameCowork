import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const root = path.join(repo, 'codelyreversebackup/work/2026-10-07-thirdparty-live/package-retirement-' + randomUUID());
const helper = path.join(repo, 'tools/resources/retire-precision-export.ps1');
const relative = 'frontend/codely-generator/precision-export.js';
const original = Buffer.from('Owned retired optional export fixture.\n');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const ps = value => "'" + value.replaceAll("'", "''") + "'";
function fixture(name, oldFiles = [{ path: relative, sha256: sha(original), size: original.length }], newFiles = []) {
  const directory = path.join(root, name), app = path.join(directory, 'app'), backup = path.join(directory, 'previous-binaries');
  const target = path.join(app, relative), prepared = path.join(directory, 'prepared.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, original);
  fs.writeFileSync(path.join(app, 'workspace.txt'), 'Owned workspace state');
  fs.writeFileSync(path.join(app, 'unknown.js'), 'Unregistered user file');
  fs.writeFileSync(path.join(app, 'package-manifest.json'), JSON.stringify({ product: 'GameCowork', files: oldFiles }));
  fs.writeFileSync(prepared, JSON.stringify({ product: 'GameCowork', files: newFiles }));
  const invoke = () => execFileSync('pwsh.exe', ['-NoProfile', '-NonInteractive', '-Command',
    `& ${ps(helper)} -OutputDirectory ${ps(app)} -PreparedManifest ${ps(prepared)} -BackupDirectory ${ps(backup)}`], { windowsHide: true, encoding: 'utf8' });
  return { directory, app, backup, target, prepared, invoke };
}
test('An exactly manifest-owned retired resource is backed up before removal; unknown files and user state remain', () => {
  const f = fixture('owned'); f.invoke();
  assert.equal(fs.existsSync(f.target), false);
  assert.deepEqual(fs.readFileSync(path.join(f.backup, relative)), original);
  assert.equal(fs.readFileSync(path.join(f.app, 'workspace.txt'), 'utf8'), 'Owned workspace state');
  assert.equal(fs.readFileSync(path.join(f.app, 'unknown.js'), 'utf8'), 'Unregistered user file');
});
test('Modified bytes and an unregistered resource are preserved', () => {
  const modified = fixture('modified'); fs.writeFileSync(modified.target, 'User modified bytes'); modified.invoke();
  assert.equal(fs.readFileSync(modified.target, 'utf8'), 'User modified bytes');
  assert.equal(fs.existsSync(path.join(modified.backup, relative)), false);
  const unknown = fixture('unknown', []); unknown.invoke(); assert.deepEqual(fs.readFileSync(unknown.target), original);
});
test('A current resource and ambiguous old ownership are preserved', () => {
  const entry = { path: relative, sha256: sha(original) };
  for (const f of [fixture('current', [entry], [entry]), fixture('duplicate', [entry, entry])]) { f.invoke(); assert.deepEqual(fs.readFileSync(f.target), original); }
});
test('Escaping manifest paths cannot nominate a deletion target', () => {
  for (const [index, unsafe] of ['../outside.js', '/absolute.js', 'F:/outside.js', 'frontend/codely-generator/../../precision-export.js', relative + ':stream'].entries()) {
    const f = fixture('escape-' + index, [{ path: unsafe, sha256: sha(original) }]);
    const outside = path.join(f.directory, 'outside.js'); fs.writeFileSync(outside, original);
    f.invoke(); assert.deepEqual(fs.readFileSync(f.target), original); assert.deepEqual(fs.readFileSync(outside), original);
  }
});
test('A junction below the package is rejected even if its external bytes match the old SHA', () => {
  const f = fixture('junction'), directory = path.dirname(f.target), outside = path.join(f.directory, 'outside');
  fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'precision-export.js'), original);
  fs.unlinkSync(f.target); fs.rmdirSync(directory); fs.symlinkSync(outside, directory, 'junction');
  f.invoke(); assert.deepEqual(fs.readFileSync(path.join(outside, 'precision-export.js')), original);
  assert.equal(fs.existsSync(path.join(f.backup, relative)), false);
});
test('Backup collisions preserve both the runtime resource and the existing backup', () => {
  const f = fixture('backup-collision'), backup = path.join(f.backup, relative); fs.mkdirSync(path.dirname(backup), { recursive: true }); fs.writeFileSync(backup, 'Existing backup');
  f.invoke(); assert.deepEqual(fs.readFileSync(f.target), original); assert.equal(fs.readFileSync(backup, 'utf8'), 'Existing backup');
});
