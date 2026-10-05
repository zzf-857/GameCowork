// Extract only maintained pure task helpers and the existing xZ audio component.
// No original application entry, auth bootstrap, model request or React app runs.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
export async function quickAudioPreviewSource(frontend = path.join(root, 'src/frontend/bundle')) {
  const directory = path.join(frontend, 'codely-generator'), ledger = JSON.parse(fs.readFileSync(path.join(directory, 'source-ledger.json'), 'utf8'));
  const entry = ledger.files.find(row => row.path === 'assets/index-DZWJHC3S.js'), bytes = fs.readFileSync(path.join(directory, entry.path)), maintained = bytes.toString('utf8');
  assert.equal(hash(bytes), entry.currentSha256);
  let original = maintained;
  for (const patch of entry.patches.toReversed()) { assert.equal(original.slice(patch.charOffset, patch.charOffset + patch.after.length), patch.after); original = original.slice(0, patch.charOffset) + patch.before + original.slice(patch.charOffset + patch.after.length); }
  assert.equal(hash(Buffer.from(original)), entry.sourceSha256);
  async function functions(text) {
    const parsed = (await babel.parsers.babel.parse(text, {parser: 'babel'})).program, nodes = new Map();
    for (const node of parsed.body) {
      if (node.type === 'FunctionDeclaration') nodes.set(node.id.name, {start: node.start, end: node.end});
      if (node.type === 'VariableDeclaration') for (const row of node.declarations) if (row.id.type === 'Identifier') nodes.set(row.id.name, {start: row.start, end: row.end, declaration: true});
    }
    return name => { const node = nodes.get(name); assert.ok(node, 'Actual original binding exists: ' + name); return (node.declaration ? 'const ' : '') + text.slice(node.start, node.end) + (node.declaration ? ';' : ''); };
  }
  const current = await functions(maintained), old = await functions(original);
  const names = ['lwe', '_N', 'wN', 'cwe', 'uwe', 'k5', '_g', 'ewe', 'wZ', 'xZ', 'fE'];
  return {current, old, maintained, original, currentSha256: entry.currentSha256, sourceSha256: entry.sourceSha256,
    helperScript: current('bN') + '\n' + names.map(current).join('\n') + '\nglobalThis.quickAudioProbe={lwe,_N,wN,cwe,uwe,k5,_g,ewe,wZ,xZ};'};
}
