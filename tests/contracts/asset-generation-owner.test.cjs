'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), { spawn } = require('node:child_process');
const { createAssetService } = require('../../src/core/binary/out/modules/generation/service.js');
const base = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/asset-owner-' + crypto.randomUUID()); fs.mkdirSync(base, { recursive: true });
function child(root) {
  const processHandle = spawn(process.execPath, [path.resolve(__dirname, '../fixtures/asset-generation-owner-child.cjs'), root], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }); let output = '';
  const ready = new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error('Owned lock child deadline')), 5000); processHandle.stdout.on('data', bytes => { output += bytes; const end = output.indexOf('\n'); if (end >= 0) { clearTimeout(timer); resolve(JSON.parse(output.slice(0, end))); } }); processHandle.once('error', error => { clearTimeout(timer); reject(error); }); });
  const exited = new Promise(resolve => processHandle.once('exit', code => resolve(code))); return { processHandle, ready, exited };
}
test('Actual runtime lock rejects a live second process and clean close releases ownership', async () => {
  const root = path.join(base, 'live'), service = createAssetService({ root }); let second;
  try { second = child(root); const result = await second.ready; assert.equal(result.event, 'rejected'); assert.match(result.message, /live owner/); assert.equal(await second.exited, 3); assert.throws(() => createAssetService({ root }), /live owner/); }
  finally { if (second && second.processHandle.exitCode === null) second.processHandle.kill(); await service.close(); }
  assert.equal(fs.existsSync(path.join(root, 'owner.lock')), false); const reopened = createAssetService({ root }); await reopened.close();
});
test('A verified dead own child lease is recovered without deleting another process or losing state', async () => {
  const root = path.join(base, 'stale'), first = child(root); const ready = await first.ready; assert.equal(ready.event, 'ready'); assert.equal(ready.pid, first.processHandle.pid);
  const master = fs.readFileSync(path.join(root, 'master.key')); first.processHandle.kill(); await first.exited;
  const recovered = createAssetService({ root }); assert.deepEqual(fs.readFileSync(path.join(root, 'master.key')), master); assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'owner.lock'))).pid, process.pid); await recovered.close();
});
test('Unknown owner/recovery records are preserved and do not permit initialization', () => {
  for (const file of ['owner.lock', 'owner.recovery.lock']) { const root = path.join(base, file); fs.mkdirSync(root); const bytes = Buffer.from(JSON.stringify({ pid: 0, nonce: 'unknown' })); fs.writeFileSync(path.join(root, file), bytes); assert.throws(() => createAssetService({ root }), /unknown|identity/); assert.deepEqual(fs.readFileSync(path.join(root, file)), bytes); assert.equal(fs.existsSync(path.join(root, 'master.key')), false); }
});
test('Replacing the lock generation revokes the old service, and close preserves the replacement', async () => {
  const root = path.join(base, 'replacement'), service = createAssetService({ root }), replacement = { pid: process.pid, nonce: 'f'.repeat(64), createdTime: new Date().toISOString() };
  fs.writeFileSync(path.join(root, 'owner.lock'), JSON.stringify(replacement)); await assert.rejects(() => service.dispatch('generator/listProviders'), /generation was replaced/); await service.close(); assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'owner.lock'))).nonce, replacement.nonce);
});
test('Linked runtime parents are rejected before files are created outside the owner', () => {
  const target = path.join(base, 'link-target'), link = path.join(base, 'link'); fs.mkdirSync(target); fs.symlinkSync(target, link, 'junction'); assert.throws(() => createAssetService({ root: path.join(link, 'must-not-create') }), /Linked.*roots/); assert.equal(fs.existsSync(path.join(target, 'must-not-create')), false);
});
test('A malformed state store releases its own initialization lease', () => {
  const root = path.join(base, 'bad-store'); fs.mkdirSync(root); fs.writeFileSync(path.join(root, 'providers.json'), '{invalid'); assert.throws(() => createAssetService({ root })); assert.equal(fs.existsSync(path.join(root, 'owner.lock')), false);
});
