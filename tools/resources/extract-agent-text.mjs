// Recover the declared embedded asset records without executing the original binary.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1]) throw new Error(`${name} requires a path`);
  return path.resolve(args[index + 1]);
}
const binaryFile = option('--source', path.join(project, 'original/Tuanjie Cowork/cli/bin/win32-x64/codely.exe'));
const outputRoot = option('--output', path.join(project, 'src/agent/resources'));
const binary = fs.readFileSync(binaryFile);
const decoder = new TextDecoder('utf8', { fatal: true });
const source = fs.readFileSync(path.join(project, 'src/agent/cli-main.beautified.js'), 'utf8');
const variables = new Map([...source.matchAll(/var ([\w$]+) = "(B:\/~BUN\/root\/[^"\r\n]+)";/g)].map(match => [match[1], match[2]]));
const objectStart = source.indexOf('var b3l = {');
const objectEnd = source.indexOf('globalThis.__GAMECOWORK_EMBEDDED_ASSETS = b3l;', objectStart);
if (objectStart < 0 || objectEnd < 0) throw new Error('Embedded asset manifest declaration is missing');
const firstAsset = binary.indexOf(Buffer.from('name = "explore"'));
if (firstAsset < 0 || binary.indexOf(Buffer.from('name = "explore"'), firstAsset + 1) >= 0) throw new Error('Ambiguous physical asset section');
const records = [...source.slice(objectStart, objectEnd).matchAll(/"([^"]+)": ([\w$]+),/g)].map(match => {
  const virtualPath = variables.get(match[2]);
  if (!virtualPath) throw new Error(`Asset variable ${match[2]} has no virtual file path`);
  const header = binary.indexOf(Buffer.from(virtualPath + '\0'), firstAsset - 256);
  if (header < 0) throw new Error(`Embedded asset header not found: ${match[1]}`);
  return { path: match[1], virtualPath, header, start: header + Buffer.byteLength(virtualPath) + 1 };
}).sort((left, right) => left.header - right.header);
const manifest = { method: 'declared Bun virtual-path NUL records; sequential boundary validation', binarySha256: createHash('sha256').update(binary).digest('hex'), assets: [] };
for (const [index, record] of records.entries()) {
  const { path: relativePath, start } = record;
  if (path.isAbsolute(relativePath) || relativePath.split('/').includes('..')) throw new Error('Unsafe embedded asset path');
  const end = relativePath.endsWith('.wasm') && index + 1 < records.length
    ? records[index + 1].header - 1
    : binary.indexOf(0, start);
  if (end < start || binary[end] !== 0 || end - start > 8 * 1024 * 1024) throw new Error(`Invalid embedded asset boundary: ${relativePath}`);
  const original = binary.subarray(start, end);
  let restored;
  if (relativePath.endsWith('.wasm')) {
    if (!WebAssembly.validate(original)) throw new Error(`Invalid restored WebAssembly module: ${relativePath}`);
    restored = original;
  } else {
    let text;
    try { text = decoder.decode(original); } catch { throw new Error(`Embedded text asset is not UTF-8: ${relativePath}, offset ${start}, length ${original.length}`); }
    if (text.includes('\0')) throw new Error(`Embedded text asset contains an unexpected binary delimiter: ${relativePath}`);
    for (const [before, after] of [['CODELY', 'GAMECOWORK'], ['Codely', 'GameCowork'], ['codely', 'gamecowork']]) text = text.split(before).join(after);
    restored = Buffer.from(text);
  }
  const output = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, restored);
  manifest.assets.push({ path: relativePath, offset: start, originalBytes: original.length, originalSha256: createHash('sha256').update(original).digest('hex'), restoredSha256: createHash('sha256').update(restored).digest('hex') });
}
fs.writeFileSync(path.join(outputRoot, 'restore-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ restoredAssets: manifest.assets.length, originalBytes: manifest.assets.map(asset => ({ path: asset.path, bytes: asset.originalBytes })), output: outputRoot }));
