// Static repository checks only: no product, editor, provider or fixture is started.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
let references = 0;
const exists = value => fs.existsSync(path.resolve(root, value));
const required = [
  'src/shell/Cargo.toml', 'src/shell/Cargo.lock', 'src/shell/src/main.rs',
  'src/frontend/bundle/index.html', 'src/frontend/bundle/gui.html',
  'src/frontend/bundle/windowBridge.html',
  'src/core/binary/out/index.js', 'src/core/binary/out/index.beautified.js',
  'src/agent/cli-main.beautified.js', 'src/agent/resources/restore-manifest.json',
  'src/unity-insight/bundle/gamecowork-worker-entry.mjs',
  'src/editor-bridge/package.json', 'src/editor-bridge/AGENTS.md',
  'vendor/csharp-lsp/runtime/csharp-ls.exe',
  'vendor/csharp-lsp/dependency-ledger.json', 'vendor/csharp-lsp/dependency-ledger.sha256',
  'tools/build-local.ps1', 'tools/build-cli.ps1', 'tools/verify-local.ps1',
  'README.md', 'AGENTS.md', 'RESTORE_STATUS.md',
  'docs/ARCHITECTURE.md', 'docs/DEVELOPMENT.md', 'docs/PACKAGING.md',
];
for (const file of required) if (!exists(file)) errors.push(`Missing maintained input: ${file}`);
if (exists('restored')) errors.push('Legacy restored/ must not become a second source tree; see docs/ARCHITECTURE.md.');

const groups = new Set(['contracts', 'integration', 'e2e', 'fixtures', 'support']);
const testFiles = [];
for (const entry of fs.readdirSync(path.join(root, 'tests'), { withFileTypes: true })) {
  if (entry.isDirectory()) {
    if (!groups.has(entry.name)) errors.push(`Unknown test group: ${entry.name}`);
    else for (const name of fs.readdirSync(path.join(root, 'tests', entry.name))) {
      const file = `tests/${entry.name}/${name}`;
      if (fs.statSync(path.join(root, file)).isFile()) testFiles.push(file);
    }
  } else if (entry.name !== 'README.md') errors.push(`Place test input in a test group: tests/${entry.name}`);
}
for (const group of groups) if (!exists(`tests/${group}`)) errors.push(`Missing test group: ${group}`);

function checkReference(file, value, base = root) {
  if (value.includes('${') || value.includes('*')) return;
  references++;
  if (!fs.existsSync(path.resolve(base, value.replaceAll('\\\\', '\\')))) {
    errors.push(`${file}: missing path ${value}`);
  }
}

const tools = fs.readdirSync(path.join(root, 'tools'))
  .filter(name => /\.(?:mjs|ps1|py)$/.test(name) && name !== 'check-layout.mjs')
  .map(name => `tools/${name}`);
const rust = fs.readdirSync(path.join(root, 'src/shell/src'))
  .filter(name => name.endsWith('.rs')).map(name => `src/shell/src/${name}`);
for (const file of [...testFiles, ...tools, ...rust, 'src/agent/package.json']) {
  const body = fs.readFileSync(path.join(root, file), 'utf8');
  if (/restored[\\/](?:shell|frontend|core-gamecowork-binary|cli-gamecowork|cli-unity-insight|editor-bridge|lsp-csharp)/.test(body)) {
    errors.push(`${file}: legacy source path remains`);
  }
  const base = path.dirname(path.join(root, file));
  const localPatterns = [
    /(?:from\s+|require\(\s*|import\(\s*)['"](\.\.?\/[^'"]+)['"]/g,
    /new URL\(\s*['"](\.\.?\/[^'"]*)['"][^\n;]*?import\.meta\.url/g,
    /path\.(?:join|resolve)\(__dirname\s*,\s*['"]([^'"]+)['"]/g,
    /include_(?:str|bytes)!\(['"]([^'"]+)['"]\)/g,
  ];
  for (const pattern of localPatterns) for (const match of body.matchAll(pattern)) {
    checkReference(file, match[1], base);
  }
  // Only complete repository file literals; runtime paths and dynamic fragments
  // are exercised by the integration/E2E gates rather than guessed here.
  for (const match of body.matchAll(/['"]((?:src[/\\](?:shell|frontend|core|agent|unity-insight|editor-bridge)|vendor|tests|tools)[/\\][^'"\r\n]+\.(?:mjs|cjs|js|rs|cs|ps1|json|toml|sha256))['"]/g)) {
    checkReference(file, match[1]);
  }
  if (file === 'tools/verify-local.ps1') {
    for (const match of body.matchAll(/['"]((?:contracts|integration|e2e|fixtures|support)\/[^'"]+\.(?:mjs|cjs))['"]/g)) {
      checkReference(file, `tests/${match[1]}`);
    }
  }
}

// Check maintained documentation only; historical snapshots and read-only
// research intentionally retain old claims and external evidence locations.
const documents = [
  'README.md', 'AGENTS.md', 'docs/ARCHITECTURE.md', 'docs/DEVELOPMENT.md',
  'docs/PACKAGING.md', 'docs/UNITY_INTEGRATION.md', 'docs/DUAL_ENGINE_MULTI_PROJECT.md',
  'tests/README.md', 'tools/README.md', 'research/README.md',
  'src/frontend/README.md', 'src/frontend/PROJECT_MAP.md',
  'src/editor-bridge/AGENTS.md', 'src/editor-bridge/README.md',
  'src/unity-insight/README.md', 'vendor/csharp-lsp/README.md',
];
for (const file of documents) {
  if (!exists(file)) { errors.push(`Missing documentation: ${file}`); continue; }
  const body = fs.readFileSync(path.join(root, file), 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const match of body.matchAll(/\]\(([^\s)]+)\)/g)) {
    if (/^(?:[a-z]+:|#|\/)/i.test(match[1])) continue;
    const [target] = match[1].split('#');
    checkReference(file, decodeURIComponent(target), path.dirname(path.join(root, file)));
  }
}

const attributes = fs.readFileSync(path.join(root, '.gitattributes'), 'utf8');
for (const line of [
  '/vendor/csharp-lsp/runtime/** -text',
  '/vendor/csharp-lsp/dependency-ledger.json -text',
  '/vendor/csharp-lsp/dependency-ledger.sha256 -text',
  '/vendor/csharp-lsp/LICENSE -text',
  '/src/agent/resources/** -text', '/src/unity-insight/resources/** -text',
]) if (!attributes.split(/\r?\n/).includes(line)) errors.push(`Missing frozen-byte attribute: ${line}`);

assert.equal(errors.length, 0, `Repository layout checks failed:\n${[...new Set(errors)].join('\n')}`);
console.log(`Layout OK: ${testFiles.length} test inputs, ${documents.length} documents, ${references} path references.`);
