// Read-only extraction. Never imports Hub bundles or starts Hub/native/licensing code.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const defaults = Object.freeze({
  asar: 'E:/Unity Hub/EXE/resources/app.asar',
  unpack: 'F:/AI/AgentMake/temp/GameCowork/unity-hub-asar',
  output: fileURLToPath(new URL('../../codelyreversebackup_fromunityhub/', import.meta.url)),
});
export const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

export function readAsar(asarPath) {
  const bytes = fs.readFileSync(asarPath);
  assert(bytes.length > 16, 'Invalid ASAR header');
  const headerSize = bytes.readUInt32LE(4);
  const jsonSize = bytes.readUInt32LE(12);
  const dataStart = 8 + headerSize;
  assert(jsonSize <= headerSize - 8 && dataStart <= bytes.length, 'Invalid ASAR sizes');
  const header = JSON.parse(bytes.subarray(16, 16 + jsonSize).toString('utf8'));
  return {
    bytes, header,
    read(relativePath) {
      let node = header;
      for (const part of relativePath.split('/')) node = node.files?.[part];
      assert(node && !node.files && !node.unpacked && node.offset !== undefined, `Missing packed ASAR input: ${relativePath}`);
      const start = dataStart + Number(node.offset);
      assert(Number.isSafeInteger(start) && start >= dataStart && start + node.size <= bytes.length, 'Invalid ASAR entry bounds');
      return bytes.subarray(start, start + node.size);
    },
  };
}

// Byte offsets are computed from the original Buffer, preserving LF/CRLF and UTF-8.
export function extractRegions(bytes) {
  const regions = [];
  const stack = [];
  let start = 0;
  let lineNumber = 1;
  while (start < bytes.length) {
    const newline = bytes.indexOf(10, start);
    const end = newline === -1 ? bytes.length : newline + 1;
    const line = bytes.subarray(start, end).toString('utf8').replace(/\r?\n$/, '');
    const marker = /^\/\/#region\s+(.+)$/.exec(line);
    if (marker) stack.push({ originalPath: marker[1], startByte: start, startLine: lineNumber });
    if (/^\/\/#endregion\s*$/.test(line)) {
      assert(stack.length > 0, `Unmatched endregion at line ${lineNumber}`);
      const region = stack.pop();
      regions.push({ ...region, endByteExclusive: end, endLine: lineNumber, bytes: bytes.subarray(region.startByte, end) });
    }
    start = end;
    lineNumber++;
  }
  assert.equal(stack.length, 0, 'Unclosed source region');
  return regions.sort((a, b) => a.startByte - b.startByte);
}

const group = originalPath => {
  if (/^(src\/(main\/services\/licenseService|types\/licenses|common\/utilities\/LicenseFilters)|node_modules\/@licensing\/licensing-sdk)\//.test(originalPath)) return 'unity-licensing';
  if (/^src\/main\/services\/(unityTemplate|editorApp)\//.test(originalPath) || /^src\/types\/templates\//.test(originalPath)) return 'project-templates';
  if (/^src\/main\/services\/(projectService|localProject)\//.test(originalPath) || /^src\/types\/projects\//.test(originalPath)) return 'project-management';
  if (/^src\/main\/services\/editorManager\//.test(originalPath) || /^node_modules\/@unity\/hub-(unity-version|generate-releases)\//.test(originalPath)) return 'editor-management';
  if (/^src\/main\/services\/(localInstaller|downloadEngine)\//.test(originalPath) || /^src\/types\/(installs|downloads)\//.test(originalPath)) return 'editor-management';
  if (/^src\/main\/services\/sourceControl\/(SourceControlStateManagementService|gitCredentialManager)\.ts$/.test(originalPath) || /^src\/(core\/src\/file-system\/fs(?:-utils)?|common\/utilities\/sourceControl|types\/common\/sourceControl)\.ts$/.test(originalPath)) return 'project-management';
  if (/^node_modules\/@unity\/hub-unity-gitignore\/dist\/index\.mjs$/.test(originalPath)) return 'project-management';
  if (/^src\/(main\/common\/(hubCache|editor-helper(?:-win32)?)|common\/editor-helpers)\.ts$/.test(originalPath)) return 'shared';
  return null;
};

const runtimeDependencies = {
  'project-management': ['Node path/fs/os', 'Hub storage and preferences DI', 'ProjectService/LocalProject/EditorApp', 'Hub window, IPC and postal events', 'VCS/Unity Cloud services and analytics when used by the fragment'],
  'project-templates': ['Node fs/path/child_process', 'Hub tar/file-system helper', 'Installed Editor manager and version/architecture identity', 'Hub template cache, DI and events', 'Unity Cloud catalog/download and licensing for original create/open flow'],
  'editor-management': ['Node fs/path/child_process', 'Hub editor registry/version/native launch/elevation modules', 'Hub installation/download state machine and DI', 'Release/catalog HTTP clients, platform helpers and storage'],
  'unity-licensing': ['Unity licensing SDK 1.17.4', 'Unity.Licensing.Client process and named-pipe IPC', 'Unity account/entitlement APIs and installed-Editor event source', 'Hub DI/storage/logger and SDK transitive bindings'],
  shared: ['Specific Hub globals/import aliases declared in the owning bundle; inspect fragment and chunk imports'],
};

export function buildReference({ asarPath = defaults.asar, unpackPath = defaults.unpack } = {}) {
  const archive = readAsar(asarPath);
  const packageBytes = archive.read('package.json');
  assert.equal(sha256(fs.readFileSync(path.join(unpackPath, 'package.json'))), sha256(packageBytes), 'Unpacked package does not match ASAR');
  const packageInfo = JSON.parse(packageBytes.toString('utf8'));
  const files = new Map([['source-metadata/package.json.txt', packageBytes]]);
  const fragments = [];
  const chunks = [];
  for (const entry of fs.readdirSync(path.join(unpackPath, 'build/main'), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const sourcePath = `build/main/${entry.name}`;
    const unpackBytes = fs.readFileSync(path.join(unpackPath, sourcePath));
    const allRegions = extractRegions(unpackBytes);
    const selected = allRegions.filter(region => group(region.originalPath));
    if (!selected.length) continue;
    const archiveBytes = archive.read(sourcePath);
    assert(unpackBytes.equals(archiveBytes), `Unpacked chunk differs from installed ASAR: ${sourcePath}`);
    const imports = [...unpackBytes.toString('utf8').matchAll(/^import .+? from ["']([^"']+)["'];?$/gm)].map(match => ({ specifier: match[1], statement: match[0] }));
    chunks.push({ path: sourcePath, sha256: sha256(unpackBytes), bytes: unpackBytes.length, imports, importsScope: 'Owning chunk imports; a superset, not a resolved dependency closure of each fragment' });
    for (const region of selected) {
      const domain = group(region.originalPath);
      assert(!region.originalPath.split('/').includes('..') && !/[\\:\0]/.test(region.originalPath), 'Unsafe region path');
      const outputPath = `source-fragments/${domain}/${region.originalPath}.js.txt`;
      assert(!files.has(outputPath), `Duplicate original source marker: ${region.originalPath}`);
      files.set(outputPath, region.bytes);
      fragments.push({
        path: outputPath, domain, originalPath: region.originalPath, sourceChunk: sourcePath,
        sourceChunkSha256: sha256(unpackBytes), startLine: region.startLine, endLine: region.endLine,
        startByte: region.startByte, endByteExclusive: region.endByteExclusive,
        sha256: sha256(region.bytes), bytes: region.bytes.length,
        declaredBindings: [...region.bytes.toString('utf8').matchAll(/^(?:var|let|const|function|async function|class)\s+([\w$]+)/gm)].map(match => match[1]),
        dependencies: { resolution: 'incomplete-bundle-fragment', owningChunkImports: sourcePath, requiredRuntimeFamilies: runtimeDependencies[domain] },
        reuse: domain === 'unity-licensing' ? 'Unity-specific reference only; no activation/client execution in GameCowork' : 'Exact compiled source region; Hub globals/import aliases remain unresolved; not standalone',
      });
    }
  }
  const get = originalPath => {
    const matches = fragments.filter(fragment => fragment.originalPath === originalPath);
    assert.equal(matches.length, 1, `Expected one original region: ${originalPath}`);
    return matches[0];
  };
  const adapters = [];
  const adapt = (outputPath, originalPaths, prefix, suffix, limitation) => {
    const sources = originalPaths.map(get);
    const sourceBytes = sources.map(source => files.get(source.path));
    const bytes = Buffer.concat([Buffer.from(prefix), ...sourceBytes, Buffer.from(suffix)]);
    files.set(outputPath, bytes);
    adapters.push({ path: outputPath, sha256: sha256(bytes), bytes: bytes.length, sources: sources.map(source => ({ path: source.path, sha256: source.sha256 })), changes: { prefix, suffix, body: 'Original source-region bytes unchanged, concatenated in listed order' }, limitation });
  };
  adapt('reusable/unity-version.mjs', ['node_modules/@unity/hub-unity-version/dist/index.mjs'], '', '\nexport { e as UnityVersion };\n', 'Original regex is prefix-only and retains original channel comparisons; do not use as strict path/security validation or silently conflate Tuanjie versions');
  const constants = get('src/main/services/projectService/projectConstants.ts');
  adapt('reusable/project-constants.mjs', [constants.originalPath], "import path from 'node:path';\n", `\nexport { ${constants.declaredBindings.join(', ')} };\n`, 'Unity-specific file/key names. Persistence keys must be mapped to GameCowork own state, never official Hub storage');
  adapt('reusable/filename-validation.mjs', ['src/core/src/file-system/fs-utils.ts', 'src/core/src/file-system/fs.ts'], "import os from 'node:os';\nimport path from 'node:path';\n", '\nexport { isValidFilename, isValidPath, getMaxFilenameLength, getMaxPathLength };\n', 'Original stricter cross-platform policy rejects backtick/percent, trailing space/dot, Windows reserved devices and names above 255 code units; no canonical-path ownership or collision check');
  const ignoreSource = get('node_modules/@unity/hub-unity-gitignore/dist/index.mjs');
  const ignoreText = files.get(ignoreSource.path).toString('utf8');
  const literal = /var e = `([\s\S]*)`;\r?\n\/\/#endregion\r?\n?$/.exec(ignoreText);
  assert(literal && !literal[1].includes('${') && !literal[1].includes('\\') && !literal[1].includes('`'), 'Gitignore is not a simple static template literal');
  const ignoreBytes = Buffer.from(literal[1]);
  files.set('reusable/unity-project.gitignore', ignoreBytes);
  adapters.push({ path: 'reusable/unity-project.gitignore', sha256: sha256(ignoreBytes), bytes: ignoreBytes.length, sources: [{ path: ignoreSource.path, sha256: ignoreSource.sha256 }], changes: { body: 'Static template-literal payload extracted without evaluating JS' }, limitation: 'Source comment declares github/gitignore CC0-1.0, synced 2025-12-18. Unity conventions; do not overwrite an existing project gitignore' });
  const index = [
    '# Unity Hub 原字节片段索引', '',
    `来源：Unity Hub ${packageInfo.version}；${fragments.length} 个区域、${chunks.length} 个已核对 ASAR 的 chunk。`, '',
    '`.js.txt` 保存原始 bundle 区域，含原有 region 标记；不能作为独立模块 import。SHA、字节偏移、chunk 导入及运行依赖见 [_SOURCE-MANIFEST.json](_SOURCE-MANIFEST.json)。', '',
    '| 域 | 原始源码路径 / 本地片段 | 来源 chunk | 原行号 |',
    '| --- | --- | --- | --- |',
    ...fragments.map(fragment => `| ${fragment.domain} | [${fragment.originalPath}](${fragment.path}) | ${path.basename(fragment.sourceChunk)} | ${fragment.startLine}–${fragment.endLine} |`), '',
  ].join('\n');
  files.set('_SOURCE-INDEX.md', Buffer.from(index));
  const manifest = {
    schemaVersion: 2, generatedForDate: '2026-10-02', tool: 'tools/research/extract-unity-hub-reference.mjs',
    source: { installDirectory: path.dirname(path.dirname(path.resolve(asarPath))).replaceAll('\\', '/'), asarPath: asarPath.replaceAll('\\', '/'), asarSha256: sha256(archive.bytes), asarBytes: archive.bytes.length, unpackPath: unpackPath.replaceAll('\\', '/'), unpackComparedWithAsar: true, package: { name: packageInfo.name, version: packageInfo.version, sha256: sha256(packageBytes), licenseMetadata: packageInfo.license }, licenseMetadataScope: 'Packaged metadata recorded as evidence; does not establish the licensing terms of every bundled dependency, template or native client' },
    safety: { execution: 'None: Buffer/JSON/region parsing only', inspectedState: 'Installed static application archive and its existing unpack only; no account, credential, license or project state', nativeModules: 'Not copied or executed', productionIntegration: 'Backup is not in default build. Reusable adapters include no Hub service or network code.' },
    chunks, fragments, adapters,
    generatedFiles: [...files].map(([relativePath, bytes]) => ({ path: relativePath, sha256: sha256(bytes), bytes: bytes.length })).sort((a, b) => a.path.localeCompare(b.path, 'en')),
  };
  return { manifest, files };
}

export function extractReference({ outputPath = defaults.output, check = false, ...options } = {}) {
  for (const sourceRoot of [path.dirname(path.dirname(options.asarPath ?? defaults.asar)), options.unpackPath ?? defaults.unpack]) {
    const relativeOutput = path.relative(path.resolve(sourceRoot), path.resolve(outputPath));
    assert(relativeOutput.startsWith(`..${path.sep}`) || relativeOutput === '..' || path.isAbsolute(relativeOutput), 'Output cannot be inside the read-only source installation or unpack');
  }
  const { manifest, files } = buildReference(options);
  const manifestPath = path.join(outputPath, '_SOURCE-MANIFEST.json');
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  files.set('_SOURCE-MANIFEST.json', manifestBytes);
  if (check) {
    for (const [relativePath, bytes] of files) assert(fs.readFileSync(path.join(outputPath, relativePath)).equals(bytes), `Reference output differs: ${relativePath}`);
  } else {
    for (const [relativePath, bytes] of files) {
      const destination = path.join(outputPath, relativePath);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, bytes);
    }
  }
  return { fragments: manifest.fragments.length, adapters: manifest.adapters.length, chunks: manifest.chunks.length, asarSha256: manifest.source.asarSha256, checked: check };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const options = {};
  while (args.length) {
    const flag = args.shift();
    if (flag === '--check') options.check = true;
    else if (['--asar', '--unpack', '--output'].includes(flag)) {
      const value = args.shift();
      assert(value, `Missing value for ${flag}`);
      options[{ '--asar': 'asarPath', '--unpack': 'unpackPath', '--output': 'outputPath' }[flag]] = value;
    } else throw new Error(`Unknown argument: ${flag}`);
  }
  console.log(JSON.stringify(extractReference(options), null, 2));
}
