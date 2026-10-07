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
  'src/core/binary/out/modules/generation/service.js',
  'src/core/binary/out/modules/account/broker.js',
  'src/agent/cli-main.beautified.js', 'src/agent/resources/restore-manifest.json',
  'src/unity-insight/bundle/gamecowork-worker-entry.mjs',
  'src/editor-bridge/package.json', 'src/editor-bridge/AGENTS.md',
  'vendor/csharp-lsp/runtime/csharp-ls.exe',
  'vendor/csharp-lsp/dependency-ledger.json', 'vendor/csharp-lsp/dependency-ledger.sha256',
  'tools/build-local.ps1', 'tools/build-cli.ps1', 'tools/verify-local.ps1',
  'README.md', 'AGENTS.md', 'RESTORE_STATUS.md',
  'docs/architecture/overview.md', 'docs/development/guide.md', 'docs/development/packaging.md',
];
for (const file of required) if (!exists(file)) errors.push(`Missing maintained input: ${file}`);
if (exists('restored')) errors.push('Legacy restored/ must not become a second source tree; see docs/architecture/overview.md.');

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

function filesUnder(directory, excluded = new Set()) {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true })
    .flatMap(entry => entry.isDirectory()
      ? excluded.has(entry.name) ? [] : filesUnder(`${directory}/${entry.name}`, excluded)
      : [`${directory}/${entry.name}`]);
}
const tools = filesUnder('tools', new Set(['research', 'node_modules']))
  .filter(file => /\.(?:mjs|ps1|py)$/.test(file) && file !== 'tools/check-layout.mjs');
const rust = filesUnder('src/shell/src').filter(file => file.endsWith('.rs'));
const coreModules = filesUnder('src/core/binary/out/modules').filter(file => file.endsWith('.js'));
for (const file of [...testFiles, ...tools, ...rust, ...coreModules, 'src/agent/package.json']) {
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
    /#\[path\s*=\s*['"]([^'"]+)['"]\]/g,
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
  'README.md', 'AGENTS.md', 'docs/architecture/overview.md', 'docs/development/guide.md',
  'docs/development/packaging.md', 'docs/editor/integration.md', 'docs/editor/multi-project.md',
  'tests/README.md', 'tools/README.md', 'research/README.md',
  'src/frontend/README.md', 'src/frontend/PROJECT_MAP.md',
  'src/editor-bridge/AGENTS.md', 'src/editor-bridge/README.md',
  'src/unity-insight/README.md', 'vendor/csharp-lsp/README.md',
];
for (const file of filesUnder('docs').filter(file => file.endsWith('.md') && !file.startsWith('docs/history/'))) {
  if (!documents.includes(file)) documents.push(file);
}
for (const file of ['src/core/README.md', 'src/shell/README.md', 'codelyreversebackup/README.md',
  'tools/research/README.md', 'docs/history/README.md', 'docs/history/HANDOFF.md']) {
  if (exists(file) && !documents.includes(file)) documents.push(file);
}
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

// Unity identities travel with their assets when classes are grouped by feature.
const bridgeFiles = filesUnder('src/editor-bridge/Editor');
const guids = new Set();
for (const file of bridgeFiles) {
  if (/\.(?:cs|asmdef)$/.test(file) && !exists(`${file}.meta`)) errors.push(`Missing Unity asset identity: ${file}`);
  if (!file.endsWith('.meta')) continue;
  if (!exists(file.slice(0, -5))) errors.push(`Orphan Unity metadata: ${file}`);
  const match = /^guid:\s*([a-f0-9]{32})\s*$/m.exec(fs.readFileSync(path.join(root, file), 'utf8'));
  if (!match || guids.has(match[1])) errors.push(`Invalid or duplicate Unity GUID: ${file}`);
  else guids.add(match[1]);
}
if (!fs.readFileSync(path.join(root, '.gitignore'), 'utf8').split(/\r?\n/).includes('/codelyreversebackup/work/')) {
  errors.push('Keep local logs, plans, backups, builds and fixtures ignored under codelyreversebackup/work/.');
}
const rootDocuments = new Set(['README.md', 'AGENTS.md', 'RESTORE_STATUS.md']);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  if (entry.name.endsWith('.md') && !rootDocuments.has(entry.name)) {
    errors.push(`Classify documentation under docs/ or research/: ${entry.name}`);
  }
  if (/\.(?:log|bak|backup|tmp|zcode-session|jsonl)$/i.test(entry.name)) {
    errors.push(`Place scratch output in codelyreversebackup/work/: ${entry.name}`);
  }
}
for (const directory of ['src', 'tools', 'tests']) {
  for (const file of filesUnder(directory, new Set(['node_modules', 'resources', 'target', 'research']))) {
    if (/\.(?:log|bak|backup|tmp|zcode-session|jsonl)$/i.test(file)) {
      errors.push(`Scratch output mixed with maintained input: ${file}`);
    }
  }
}

assert.equal(errors.length, 0, `Repository layout checks failed:\n${[...new Set(errors)].join('\n')}`);
console.log(`Layout OK: ${testFiles.length} test inputs, ${documents.length} documents, ${references} path references.`);
