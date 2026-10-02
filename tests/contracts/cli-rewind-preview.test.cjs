// Actual maintained RewindService plan/preview and ACP presentation methods;
// only the text-diff engine and path-policy helpers use narrow fixtures.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, '../../src/agent/cli-main.beautified.js'), 'utf8');
const base = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests');
const run = path.join(base, 'cli-rewind-preview-' + randomUUID());
fs.mkdirSync(run, { recursive: true });

function between(start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert.ok(a > 0 && b > a, `Actual CLI source: ${start}`); return source.slice(a, b);
}
function actualMethods() {
  return [between('            initializeRewindPathGuards()', '            getCurrentSnapshotId()'),
    between('            async previewCodeRestoreByPointIndex(', '            async restoreConversationByPointIndex('),
    between('            async restoreCodeAtPointIndex(', '            async pruneAtOrAfterPointIndex('),
    between('            backupPath(', '            afterBackupPath('),
    between('            collectCodeRestoreSnapshotsNewestToOldestAtPointIndex(', '            async readConversationRecordFromFile(')].join('\n');
}
function fixture(label) {
  const folder = path.join(run, label); fs.mkdirSync(folder); const workspace = path.join(folder, 'workspace'), backups = path.join(folder, 'backups');
  fs.mkdirSync(workspace); fs.mkdirSync(backups);
  fs.writeFileSync(path.join(workspace, 'later.cs'), 'after\n'); fs.writeFileSync(path.join(workspace, 'created.cs'), 'created\n');
  const originalBackup = path.join(backups, 'file-history/later-edit/files/before.bak'), secondBackup = path.join(backups, 'file-history/latest-edit/files/intermediate.bak');
  fs.mkdirSync(path.dirname(originalBackup), { recursive: true }); fs.mkdirSync(path.dirname(secondBackup), { recursive: true });
  fs.writeFileSync(originalBackup, 'before\n'); fs.writeFileSync(secondBackup, 'intermediate\n');
  const diffInputs = [], operations = [];
  const fileOperations = { ...fs.promises };
  const context = vm.createContext({ require, process, ha: { default: path }, pa: { default: fileOperations }, console,
    mf: value => { if (typeof value !== 'string' || path.isAbsolute(value) || value.includes('..')) throw Error('Invalid relative path'); return value; },
    xh: (target, root) => path.resolve(target).startsWith(path.resolve(root) + path.sep),
    W6: {}, fW: (oldName, newName, before, after) => {
      diffInputs.push({ oldName, before, after });
      const lines = text => text.split('\n').filter(Boolean);
      return { hunks: [{ lines: before === after ? [] : [...lines(before).map(line => '-' + line), ...lines(after).map(line => '+' + line)] }] };
    } });
  vm.runInContext(between('    function PEe(', '    var W6,'), context);
  const service = vm.runInContext('new (class {' + actualMethods() + '})()', context);
  service.projectRoot = workspace;
  service.projectTempDir = backups;
  service.initializeRewindPathGuards();
  service.sessionState = { snapshotList: [
    { snapshotId: 'target-empty-turn', messageId: 'target', promptText: 'A turn without file edits', files: [], changeSummary: {} },
    { snapshotId: 'later-edit', messageId: 'edit', files: [{ relativePath: 'later.cs', backupName: 'before.bak' }], changeSummary: { 'later.cs': { lineAdded: 1, lineDeleted: 1 } } },
    { snapshotId: 'new-file', messageId: 'create', files: [{ relativePath: 'created.cs', backupName: null }], changeSummary: {} },
    { snapshotId: 'latest-edit', messageId: 'latest', files: [{ relativePath: 'later.cs', backupName: 'intermediate.bak' }], changeSummary: {} },
  ] };
  service.exists = async file => { try { await fs.promises.access(file); return true; } catch { return false; } };
  const presenter = vm.runInContext('({' + between('      async handleRewindDryRun(', '      async processCommandResult(') + '})', context);
  const beforeState = JSON.stringify(service.sessionState);
  return { service, presenter, workspace, backups, originalBackup, secondBackup, fileOperations, diffInputs, operations, beforeState,
    rpc: index => presenter.handleRewindDryRun({ services: { config: { getRewindService: () => service } } }, index) };
}

test('Actual CLI previews later restore/delete actions even when the selected turn has no changeSummary', async () => {
  const f = fixture('cumulative'), result = await f.rpc(0), preview = result.meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, true); assert.equal(preview.changedFileCount, 2); assert.equal(preview.effectiveChangedFileCount, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(preview.changedFiles)), ['created.cs', 'later.cs']);
  const restored = preview.fileDetails.find(detail => detail.relativePath === 'later.cs'), deleted = preview.fileDetails.find(detail => detail.relativePath === 'created.cs');
  assert.equal(restored.action, 'restore'); assert.equal(restored.backupExists, true); assert.equal(restored.currentExists, true);
  assert.equal(deleted.action, 'delete'); assert.equal(deleted.backupExists, false); assert.equal(deleted.lineAdded, 1);
  assert.equal(preview.totalLineAdded, 2); assert.equal(preview.totalLineDeleted, 1);
  assert.ok(f.diffInputs.some(input => input.before === 'before\n' && input.after === 'after\n'));
  assert.ok(!f.diffInputs.some(input => input.before === 'intermediate\n'), 'oldest planned backup wins over the later snapshot');
  assert.equal(JSON.stringify(f.service.sessionState), f.beforeState, 'read-only preview does not truncate live rewind points');
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'after\n');
  assert.equal(fs.readFileSync(path.join(f.workspace, 'created.cs'), 'utf8'), 'created\n');
});

test('Actual CLI reports a missing backup as unavailable without pretending the plan can restore it', async () => {
  const f = fixture('missing-backup'); fs.unlinkSync(f.originalBackup);
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false); assert.equal(preview.changedFiles.length, 2);
  assert.ok(preview.invalidRecords.some(record => record.relativePath === 'later.cs' && record.error.includes('backup file is missing')));
  assert.equal(preview.fileDetails.find(detail => detail.relativePath === 'later.cs').backupExists, false);
  assert.equal(JSON.stringify(f.service.sessionState), f.beforeState);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'after\n');
});

test('Actual CLI retains zero-line planned paths in the preview instead of silently omitting them', async () => {
  const f = fixture('zero-lines'); fs.writeFileSync(path.join(f.workspace, 'later.cs'), 'before\n');
  fs.writeFileSync(path.join(f.workspace, 'created.cs'), '');
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.deepEqual(JSON.parse(JSON.stringify(preview.changedFiles)), ['created.cs', 'later.cs']);
  assert.equal(preview.totalLineAdded, 0); assert.equal(preview.totalLineDeleted, 0);
  assert.equal(preview.fileDetails.length, 2); assert.equal(preview.effectiveChangedFileCount, 2);
});

test('Actual CLI unknown rewind point produces an honest empty unavailable preview', async () => {
  const f = fixture('unknown-point'), preview = (await f.rpc(99)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false); assert.equal(preview.changedFiles.length, 0); assert.equal(preview.fileDetails.length, 0);
  assert.equal(preview.changedFileCount, 0); assert.ok(preview.invalidRecords[0].error.includes('Invalid point index'));
  assert.equal(JSON.stringify(f.service.sessionState), f.beforeState);
});

test('Actual restore retains normal restore/delete behavior under frozen safe roots', async () => {
  const f = fixture('normal-restore'), result = await f.service.restoreCodeAtPointIndex({ targetIndex: 0 });
  assert.equal(result.status, 'success'); assert.equal(result.restoredCount, 1); assert.equal(result.deletedCount, 1);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'before\n');
  assert.equal(fs.existsSync(path.join(f.workspace, 'created.cs')), false);
});

test('Actual preview and complete-plan validation reject a target junction before any earlier safe file changes', async () => {
  const f = fixture('target-junction'), outside = path.join(run, 'outside-target'); fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'outside.cs'), 'outside sentinel');
  fs.symlinkSync(outside, path.join(f.workspace, 'jump'), process.platform === 'win32' ? 'junction' : 'dir');
  f.service.sessionState.snapshotList[0].files.push({ relativePath: 'jump/outside.cs', backupName: null });
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false); assert.ok(preview.invalidRecords.some(record => /reparse|symbolic-link/.test(record.error)));
  await assert.rejects(f.service.restoreCodeAtPointIndex({ targetIndex: 0 }), /reparse|symbolic-link/);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'after\n');
  assert.equal(fs.readFileSync(path.join(f.workspace, 'created.cs'), 'utf8'), 'created\n');
  assert.equal(fs.readFileSync(path.join(outside, 'outside.cs'), 'utf8'), 'outside sentinel');
});

test('Actual backup junction is rejected without reading or copying the external backup file', async () => {
  const f = fixture('backup-junction'), outside = path.join(run, 'outside-backup'); fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'before.bak'), 'outside backup sentinel');
  fs.unlinkSync(f.originalBackup); fs.rmdirSync(path.dirname(f.originalBackup));
  fs.symlinkSync(outside, path.dirname(f.originalBackup), process.platform === 'win32' ? 'junction' : 'dir');
  let readOutside = false; const read = f.fileOperations.readFile;
  f.fileOperations.readFile = async file => { if (path.resolve(file) === path.resolve(f.originalBackup)) readOutside = true; return read(file); };
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false); assert.equal(readOutside, false);
  await assert.rejects(f.service.restoreCodeAtPointIndex({ targetIndex: 0 }), /reparse|symbolic-link/);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'after\n');
  assert.equal(fs.readFileSync(path.join(outside, 'before.bak'), 'utf8'), 'outside backup sentinel');
});

test('Actual project root generation replacement is refused before writes to the replacement directory', async () => {
  const f = fixture('root-generation'), retained = f.workspace + '-retained';
  assert.ok(path.resolve(retained).startsWith(run + path.sep));
  fs.renameSync(f.workspace, retained); fs.mkdirSync(f.workspace); fs.writeFileSync(path.join(f.workspace, 'later.cs'), 'new root sentinel');
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false); assert.ok(preview.invalidRecords.some(record => /identity changed/.test(record.error)));
  await assert.rejects(f.service.restoreCodeAtPointIndex({ targetIndex: 0 }), /identity changed/);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'new root sentinel');
  assert.equal(fs.readFileSync(path.join(retained, 'later.cs'), 'utf8'), 'after\n');
});

test('Actual execution rechecks a target substituted after plan validation and stops before the copy', async () => {
  const f = fixture('execution-recheck'), outside = path.join(run, 'outside-after-plan'); fs.mkdirSync(outside);
  fs.writeFileSync(path.join(outside, 'later.cs'), 'outside post-check sentinel');
  // Deterministic substitution at the existing mkdir await verifies the final
  // check, not an assertion that every possible OS scheduling race is closed.
  const mkdir = f.fileOperations.mkdir; let replaced = false;
  f.fileOperations.mkdir = async (...args) => {
    const result = await mkdir(...args);
    if (!replaced && path.resolve(args[0]) === path.resolve(f.workspace)) {
      replaced = true; fs.unlinkSync(path.join(f.workspace, 'later.cs'));
      // Replace the original leaf with a hard-link alias; no symlink privileges
      // are needed, and overwriting it would alter the external sentinel.
      fs.linkSync(path.join(outside, 'later.cs'), path.join(f.workspace, 'later.cs'));
    }
    return result;
  };
  const result = await f.service.restoreCodeAtPointIndex({ targetIndex: 0 });
  assert.equal(result.status, 'failed'); assert.equal(result.restoredCount, 0);
  assert.ok(result.failedFiles[0].error.includes('hard-link aliases'));
  assert.equal(fs.readFileSync(path.join(outside, 'later.cs'), 'utf8'), 'outside post-check sentinel');
  assert.equal(fs.readFileSync(path.join(f.workspace, 'created.cs'), 'utf8'), 'created\n');
});

test('Actual new-file restoration uses COPYFILE_EXCL and rejects an unexpected leaf created before copy', async () => {
  const f = fixture('exclusive-new-file'); fs.unlinkSync(path.join(f.workspace, 'later.cs'));
  const copy = f.fileOperations.copyFile; let flags;
  f.fileOperations.copyFile = async (from, to, mode) => {
    flags = mode; fs.writeFileSync(to, 'concurrent new leaf sentinel'); return copy(from, to, mode);
  };
  const result = await f.service.restoreCodeAtPointIndex({ targetIndex: 0 });
  assert.equal(flags, fs.constants.COPYFILE_EXCL); assert.equal(result.restoredCount, 0);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'concurrent new leaf sentinel');
  assert.equal(fs.readFileSync(path.join(f.workspace, 'created.cs'), 'utf8'), 'created\n');
});

test('Actual backup-root generation replacement is refused before checkpoint reads or file writes', async () => {
  const f = fixture('backup-root-generation'), retained = f.backups + '-retained';
  assert.ok(path.resolve(retained).startsWith(run + path.sep));
  fs.renameSync(f.backups, retained); fs.mkdirSync(path.dirname(f.originalBackup), { recursive: true });
  fs.writeFileSync(f.originalBackup, 'replacement backup sentinel');
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false); assert.ok(preview.invalidRecords.some(record => /identity changed/.test(record.error)));
  await assert.rejects(f.service.restoreCodeAtPointIndex({ targetIndex: 0 }), /identity changed/);
  assert.equal(fs.readFileSync(path.join(f.workspace, 'later.cs'), 'utf8'), 'after\n');
});

test('Actual file symbolic links are rejected before checkpoint reads and code writes', async t => {
  const f = fixture('file-symlink'), outside = path.join(run, 'outside-symlink.cs'); fs.writeFileSync(outside, 'outside symbolic-link sentinel');
  fs.unlinkSync(path.join(f.workspace, 'later.cs'));
  try { fs.symlinkSync(outside, path.join(f.workspace, 'later.cs'), 'file'); }
  catch (error) { if (error.code === 'EPERM') { t.skip('Windows account cannot create file symlinks; real directory-junction cases ran separately'); return; } throw error; }
  assert.equal(fs.lstatSync(path.join(f.workspace, 'later.cs')).isSymbolicLink(), true);
  const preview = (await f.rpc(0)).meta.gamecowork.rewindPreview;
  assert.equal(preview.canRewind, false);
  await assert.rejects(f.service.restoreCodeAtPointIndex({ targetIndex: 0 }), /reparse|symbolic-link/);
  assert.equal(fs.readFileSync(outside, 'utf8'), 'outside symbolic-link sentinel');
});

test.after(() => {
  assert.ok(fs.realpathSync(run).startsWith(fs.realpathSync(base) + path.sep));
  fs.rmSync(run, { recursive: true });
});
