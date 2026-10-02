import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { extractRegions, sha256 } from '../../tools/research/extract-unity-hub-reference.mjs';
import { UnityVersion } from '../../codelyreversebackup_fromunityhub/reusable/unity-version.mjs';
import { isValidFilename } from '../../codelyreversebackup_fromunityhub/reusable/filename-validation.mjs';
import { LockFilePath, ProjectSettingsFilesToWatch } from '../../codelyreversebackup_fromunityhub/reusable/project-constants.mjs';

test('source regions preserve UTF-8 and CRLF bytes, nested spans and one-based original lines', () => {
  const source = Buffer.from('前言\r\n//#region src/outer.ts\r\nvar label = "中文";\r\n//#region src/inner.ts\r\nvar inner = 1;\r\n//#endregion\r\n//#endregion\r\n');
  const [outer, inner] = extractRegions(source);
  assert.equal(outer.startLine, 2);
  assert.equal(outer.endLine, 7);
  assert.equal(inner.startLine, 4);
  assert.equal(inner.endLine, 6);
  assert.equal(outer.startByte, Buffer.byteLength('前言\r\n'));
  assert(outer.bytes.equals(source.subarray(outer.startByte, outer.endByteExclusive)));
  assert(inner.bytes.equals(Buffer.from('//#region src/inner.ts\r\nvar inner = 1;\r\n//#endregion\r\n')));
});

test('incomplete or mismatched region boundaries are rejected', () => {
  assert.throws(() => extractRegions(Buffer.from('//#endregion\n')), /Unmatched/);
  assert.throws(() => extractRegions(Buffer.from('//#region src/x.ts\nvar x = 1;\n')), /Unclosed/);
});

test('reference documentation links resolve within the workspace', () => {
  const root = fileURLToPath(new URL('../../codelyreversebackup_fromunityhub/', import.meta.url));
  const documents = fs.readdirSync(root).filter(name => name.endsWith('.md'));
  for (const document of documents) {
    const body = fs.readFileSync(path.join(root, document), 'utf8').replace(/```[\s\S]*?```/g, '');
    for (const link of body.matchAll(/\]\(([^\s)]+)\)/g)) {
      if (/^(?:[a-z]+:|#|\/)/i.test(link[1])) continue;
      assert(fs.existsSync(path.resolve(root, decodeURIComponent(link[1].split('#')[0]))), `${document}: ${link[1]}`);
    }
  }
  const documentManifest = JSON.parse(fs.readFileSync(path.join(root, '_EXTRACT-MANIFEST.json'), 'utf8'));
  for (const file of documentManifest.files) {
    const bytes = fs.readFileSync(path.join(root, file.path));
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(sha256(bytes), file.sha256.toLowerCase(), file.path);
  }
});

test('all frozen source outputs match their provenance ledger and pure adapters preserve listed source bodies', () => {
  const root = fileURLToPath(new URL('../../codelyreversebackup_fromunityhub/', import.meta.url));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, '_SOURCE-MANIFEST.json'), 'utf8'));
  assert.equal(manifest.source.package.version, '3.17.3');
  assert.equal(manifest.source.unpackComparedWithAsar, true);
  for (const file of manifest.generatedFiles) {
    const bytes = fs.readFileSync(path.join(root, file.path));
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(sha256(bytes), file.sha256, file.path);
  }
  for (const adapter of manifest.adapters.filter(adapter => adapter.path.endsWith('.mjs'))) {
    const expected = Buffer.concat([
      Buffer.from(adapter.changes.prefix),
      ...adapter.sources.map(source => fs.readFileSync(path.join(root, source.path))),
      Buffer.from(adapter.changes.suffix),
    ]);
    assert(fs.readFileSync(path.join(root, adapter.path)).equals(expected), adapter.path);
  }
  for (const fragment of manifest.fragments) {
    assert(fragment.endLine >= fragment.startLine);
    assert.equal(fragment.endByteExclusive - fragment.startByte, fragment.bytes);
    assert.equal(fragment.dependencies.resolution, 'incomplete-bundle-fragment');
    assert(manifest.chunks.some(chunk => chunk.path === fragment.sourceChunk && chunk.sha256 === fragment.sourceChunkSha256));
  }
});

test('original pure helpers retain useful behavior and original constraints without loading Hub services', () => {
  assert.equal(new UnityVersion('6000.0.23f1').compare('6000.0.22f1'), 1);
  assert.equal(UnityVersion.isAlpha('6000.6.0a3'), true);
  // Prefix acceptance is an original limitation, recorded rather than silently changed.
  assert.equal(UnityVersion.isValid('2022.3.53f1c1'), true);
  assert.equal(UnityVersion.isValid('invalid'), false);
  assert.equal(isValidFilename('My project'), true);
  for (const name of ['CON', 'con.txt', 'A/B', ' trailing', 'trailing.', 'A%B', 'A`B', '']) assert.equal(isValidFilename(name), false, name);
  assert.equal(LockFilePath, path.join('Temp', 'UnityLockfile'));
  assert.deepEqual(ProjectSettingsFilesToWatch, ['ProjectSettings.asset', 'ProjectVersion.txt']);
});
