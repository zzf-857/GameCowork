// Actual own licensed Editor and AssetDatabase/UPM registry. No model, Provider,
// original bridge, package install/remove, user project or user caches are used.
import fs from 'node:fs'; import path from 'node:path'; import net from 'node:net';
import assert from 'node:assert/strict'; import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util'; import { randomUUID, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url'; import { readEditorIdentity } from '../support/editor-engine-fixture.mjs';
const repo = fileURLToPath(new URL('../../', import.meta.url)), exec = promisify(execFile);
const option = (key, fallback) => process.argv.includes(key) ? process.argv[process.argv.indexOf(key) + 1] : fallback;
const editor = path.resolve(option('--editor', 'F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe')), identity = readEditorIdentity(editor);
assert.equal(identity.engine, 'unity');
const run = path.join('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests', 'editor-bridge-assets-packages-' + randomUUID()), project = path.join(run, '工程 Asset Query');
const bridge = path.resolve(option('--bridge', path.join(repo, 'src/editor-bridge')));
const bridgeSnapshot = path.join(run, 'bridge-source-snapshot');
const checks = [], evidence = [], delay = ms => new Promise(resolve => setTimeout(resolve, ms)); let unity, failure, graceful = false;
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const ownAlive = () => !!unity && unity.exitCode === null && unity.signalCode === null && alive(unity.pid);
function check(label, condition) { checks.push({ label, passed: !!condition }); assert.ok(condition, label); console.log('PASS ' + label); }
async function until(predicate, label, timeout = 120000) { const end = Date.now() + timeout; while (Date.now() < end) { if (unity && !ownAlive()) throw Error('Own Editor exited during ' + label); if (predicate()) return; await delay(30); } throw Error('Timed out: ' + label); }
async function query(type, params, success = true) {
  const config = JSON.parse(fs.readFileSync(path.join(project, 'Temp/.com-unity-gamecowork.json'), 'utf8')), requestId = randomUUID();
  assert.equal(config.reason, 'GameCowork local editor bridge'); assert.equal(config.unity_host, '127.0.0.1');
  assert.equal(path.resolve(path.dirname(config.project_path)).toLowerCase(), path.resolve(project).toLowerCase());
  const socket = net.createConnection({ host: config.unity_host, port: config.unity_port }); let bytes = Buffer.alloc(0), welcomed = false;
  try { const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error('Own asset query TCP deadline exceeded')), 10000);
    socket.on('error', error => { clearTimeout(timer); reject(error); });
    socket.on('data', chunk => { try { bytes = Buffer.concat([bytes, chunk]);
      if (!welcomed) { const end = bytes.indexOf(10); if (end < 0) return; const banner = bytes.subarray(0, end).toString('ascii');
        assert.ok(banner.startsWith('WELCOME UNITY-TCP ')); const reported = decodeURIComponent(banner.match(/PROJECT_ROOT=(\S+)/)[1]);
        assert.equal(path.resolve(reported).toLowerCase(), path.resolve(project).toLowerCase()); bytes = bytes.subarray(end + 1); welcomed = true;
        const payload = Buffer.from(JSON.stringify({ type, params, request_id: requestId })), header = Buffer.alloc(8); header.writeBigUInt64BE(BigInt(payload.length)); socket.write(Buffer.concat([header, payload]));
      }
      if (bytes.length < 8) return; const size = Number(bytes.readBigUInt64BE()); assert.ok(size > 0 && size <= 1048576); if (bytes.length < 8 + size) return;
      const reply = JSON.parse(bytes.subarray(8, 8 + size)); assert.equal(reply.request_id, requestId); clearTimeout(timer); resolve(reply);
    } catch (error) { clearTimeout(timer); reject(error); } }); });
    evidence.push({ type, params, result }); const response = result.result ?? result;
    assert.equal(response.success, success, JSON.stringify(result)); return response.data;
  } finally { socket.destroy(); }
}
try {
  for (const directory of ['Assets/Editor', 'Packages/com.gamecowork.query-fixture', 'ProjectSettings', 'Temp']) fs.mkdirSync(path.join(project, directory), { recursive: true });
  fs.cpSync(bridge, bridgeSnapshot, { recursive: true, filter: source => { assert.ok(!fs.lstatSync(source).isSymbolicLink(), 'Own bridge snapshot does not follow links'); return true; } });
  fs.writeFileSync(path.join(project, 'ProjectSettings/ProjectVersion.txt'), 'm_EditorVersion: ' + identity.version + '\n');
  fs.writeFileSync(path.join(project, 'Packages/manifest.json'), JSON.stringify({ dependencies: { 'cn.gamecowork.bridge': 'file:' + bridgeSnapshot.replaceAll('\\', '/'), 'com.unity.modules.imgui': '1.0.0' } }, null, 2));
  fs.writeFileSync(path.join(project, 'Packages/com.gamecowork.query-fixture/package.json'), JSON.stringify({ name: 'com.gamecowork.query-fixture', version: '0.0.7', displayName: 'Owned registered embedded package', description: 'Actual embedded fixture; absent from text manifest dependencies' }));
  fs.writeFileSync(path.join(project, 'Packages/com.gamecowork.query-fixture/OwnedPackage.txt'), 'GCW_OWNED_REGISTERED_PACKAGE_ASSET\n');
  fs.mkdirSync(path.join(project, 'Packages/com.gamecowork.query-bounds'));
  fs.writeFileSync(path.join(project, 'Packages/com.gamecowork.query-bounds/package.json'), JSON.stringify({ name: 'com.gamecowork.query-bounds', version: '0.0.3', displayName: 'Owned bounded package metadata', description: 'x'.repeat(4500) }));
  fs.copyFileSync(path.join(repo, 'tests/fixtures/editor-asset-package-fixture.cs'), path.join(project, 'Assets/Editor/GameCoworkAssetPackageFixture.cs'));
  fs.copyFileSync(path.join(repo, 'tests/fixtures/editor-asset-query-component.cs'), path.join(project, 'Assets/GameCoworkAssetQueryComponent.cs'));
  const env = { ...process.env }; for (const key of Object.keys(env)) if (/^(CODELY_|GAMECOWORK_|OPENAI|ANTHROPIC|GEMINI|AZURE|AWS)/.test(key) || key === 'NODE_OPTIONS') delete env[key];
  Object.assign(env, { UPM_CACHE_ROOT: path.join(run, 'upm-cache'), UPM_NPM_CACHE_PATH: path.join(run, 'upm-npm-cache'), UPM_GIT_LFS_CACHE_PATH: path.join(run, 'upm-git-lfs-cache') });
  const flags = ['-batchmode', ...(process.argv.includes('--graphics') ? [] : ['-nographics']), '-projectPath', project, '-executeMethod', 'GameCoworkAssetPackageFixture.Boot', '-disable-assembly-updater', '-logFile', path.join(run, 'editor.log')];
  unity = spawn(editor, flags, { cwd: run, env, windowsHide: true, stdio: 'ignore' });
  await until(() => fs.existsSync(path.join(project, 'Temp/asset-package-ready.json')) && fs.existsSync(path.join(project, 'Temp/.com-unity-gamecowork.json')), 'actual Unity compilation and fixture setup');
  const ready = JSON.parse(fs.readFileSync(path.join(project, 'Temp/asset-package-ready.json'), 'utf8'));
  check('Actual existing-license Unity compiled the full own bridge and created the fixture', ready.pid === unity.pid && ready.unityVersion === identity.version);
  const files = ['Packages/manifest.json', 'Packages/packages-lock.json', ready.texturePath, ready.materialPath, ready.prefabPath, 'Assets/AssetQueries/OwnedScene.unity'];
  const before = files.map(file => ({ file, sha: sha(path.join(project, file)) }));
  const search = await query('manage_asset', { action: 'search', path: 'Assets/AssetQueries', searchPattern: 'Owned', pageSize: 2, pageNumber: 1 });
  check('Actual indexed asset search returns original paged shape and exact source paths', search.success && search.queryComplete && search.data.totalAssets >= 4 && search.data.pageSize === 2 && search.data.assets.length === 2 && search.data.assets.every(asset => asset.path.startsWith('Assets/AssetQueries/') && asset.guid));
  const next = await query('manage_asset', { action: 'search', path: 'Assets/AssetQueries', searchPattern: 'Owned', pageSize: 2, pageNumber: 2 });
  check('Actual pages are deterministic and do not repeat the prior page', !next.data.assets.some(asset => search.data.assets.some(previous => previous.path === asset.path)));
  const texture = await query('manage_asset', { action: 'get_info', path: ready.texturePath });
  check('Actual texture metadata identifies registered type, GUID, imported ID and UTC write time', texture.data.assetType === 'UnityEngine.Texture2D' && texture.data.guid && texture.data.instanceID !== 0 && texture.data.previewStatus === 'not-requested' && Number.isFinite(Date.parse(texture.data.lastWriteTimeUtc)));
  const folder = await query('manage_asset', { action: 'get_info', path: 'Assets/AssetQueries' });
  check('Actual folder metadata retains its native AssetDatabase folder/type identity', folder.data.isFolder && folder.data.guid && folder.data.assetType !== 'Unknown');
  const prefab = await query('manage_asset', { action: 'get_info', path: ready.prefabPath });
  check('Actual prefab metadata reads its native Transform component identity', prefab.data.components.some(component => component.typeName === 'UnityEngine.Transform' && component.instanceID !== 0));
  const bounded = await query('manage_asset', { action: 'get_info', path: ready.boundedPrefabPath });
  check('Actual large prefab component metadata is bounded and explicitly incomplete', bounded.data.components.length === 32 && bounded.data.componentsTruncated && bounded.truncated && !bounded.queryComplete);
  const typed = await query('manage_asset', { action: 'search', path: 'Assets/AssetQueries', filterType: 'Texture2D', searchPattern: 'OwnedTexture' });
  check('Actual AssetDatabase type filter is honored', typed.data.assets.length === 1 && typed.data.assets[0].path === ready.texturePath);
  const empty = await query('manage_asset', { action: 'search', path: 'Assets/AssetQueries', filterDateAfter: '2999-01-01T00:00:00Z' });
  check('Actual date filtering returns an honest complete empty page', empty.queryComplete && empty.data.totalAssets === 0);
  const packageAsset = await query('manage_asset', { action: 'get_info', path: ready.packageAssetPath });
  check('Actual registered Packages mount asset is queried using its resolved physical root', packageAsset.data.path === ready.packageAssetPath && packageAsset.data.assetType === 'UnityEngine.TextAsset' && packageAsset.data.guid);
  const packageSearch = await query('manage_asset', { action: 'search', path: 'Packages/com.gamecowork.query-fixture', searchPattern: 'OwnedPackage' });
  check('Actual registered package folder can be scoped in AssetDatabase search', packageSearch.data.assets.some(asset => asset.path === ready.packageAssetPath));
  const packages = await query('manage_package', { action: 'list_packages' }), embedded = packages.data.find(pkg => pkg.name === 'com.gamecowork.query-fixture');
  check('Loaded package listing includes real embedded installation absent from manifest text', packages.success && packages.scope === 'currently-loaded-registered-packages' && packages.registeredPackagesOnly && !packages.networkRequestStarted && embedded?.version === '0.0.7' && embedded.source === 'Embedded' && path.resolve(embedded.resolvedPath) === path.resolve(path.join(project, 'Packages/com.gamecowork.query-fixture')));
  check('Loaded package rows preserve original name/version/displayName/description/source fields', packages.data.some(pkg => pkg.name === 'cn.gamecowork.bridge') && packages.data.every(pkg => ['name', 'version', 'displayName', 'description', 'source'].every(field => typeof pkg[field] === 'string')));
  const boundedPackage = packages.data.find(pkg => pkg.name === 'com.gamecowork.query-bounds');
  check('Actual overlong loaded-package metadata reports truncation instead of claiming complete output', boundedPackage?.textTruncated && boundedPackage.description.endsWith('[truncated]') && packages.truncated && !packages.queryComplete);
  const preview = await query('manage_asset', { action: 'get_info', path: ready.texturePath, generatePreview: true });
  if (ready.graphicsDevice === 'Null') check('Headless preview request is explicitly unsupported without fabricated PNG', !preview.queryComplete && !preview.data.previewReady && preview.data.previewStatus === 'unsupported-no-graphics' && !preview.data.previewBase64);
  else {
    let current = preview, end = Date.now() + 8000;
    while (!current.data.previewReady && current.data.previewStatus === 'pending' && Date.now() < end) { await delay(100); current = await query('manage_asset', { action: 'get_info', path: ready.texturePath, generatePreview: true }); }
    if (current.data.previewReady) { const png = Buffer.from(current.data.previewBase64, 'base64'); check('Native ready preview contains actual PNG bytes and bounded matching dimensions', png.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && png.length <= 131072 && png.readUInt32BE(16) === current.data.previewWidth && png.readUInt32BE(20) === current.data.previewHeight && current.data.previewWidth <= 256 && current.data.previewHeight <= 256); }
    else check('Unavailable/pending graphics preview stays explicit and cannot claim ready pixels', !current.queryComplete && !current.data.previewReady && !current.data.previewBase64 && current.data.previewStatus !== 'ready');
  }
  for (const params of [{ action: 'get_info', path: '../outside' }, { action: 'get_info', path: 'C:/outside.txt' }, { action: 'get_info', path: 'Packages/com.not-registered/Missing.txt' }, { action: 'get_info', path: ready.texturePath, generatePreview: 'true' }, { action: 'search', path: ready.texturePath }, { action: 'search', pageSize: 101 }, { action: 'search', pageNumber: 0 }, { action: 'search', filterDateAfter: 'not-a-date' }, { action: 'modify', path: ready.texturePath }]) await query('manage_asset', params, false);
  check('Invalid paths/types/pages/date filters and asset writes are explicitly rejected', true);
  for (const params of [{ action: 'install_package', id_or_url: 'com.unity.some-package' }, { action: 'remove_package', package_name: 'com.gamecowork.query-fixture' }, { action: 'list_packages', timeoutSeconds: '300' }]) await query('manage_package', params, false);
  check('Package writes and invalid timeout types are not silently accepted by read handlers', true);
  fs.writeFileSync(path.join(project, 'Temp/asset-package-observe'), 'Observe only'); await until(() => fs.existsSync(path.join(project, 'Temp/asset-package-observed.json')), 'query state preservation', 10000);
  const observed = JSON.parse(fs.readFileSync(path.join(project, 'Temp/asset-package-observed.json'), 'utf8'));
  check('Queries preserve asset/scene/manifest/lock bytes and actual selection/scene dirty state', before.every(item => item.sha === sha(path.join(project, item.file))) && observed.selectedId === ready.selectedId && observed.sceneCount === ready.sceneCount && observed.sceneDirty === ready.sceneDirty);
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error.message); }
finally {
  if (ownAlive()) { fs.writeFileSync(path.join(project, 'Temp/asset-package-exit'), 'Exit own fixture'); const end = Date.now() + 15000; while (ownAlive() && Date.now() < end) await delay(50); graceful = !ownAlive();
    if (!graceful) { const record = await exec('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `(Get-CimInstance Win32_Process -Filter 'ProcessId = ${unity.pid}').CommandLine`], { windowsHide: true }); assert.ok(record.stdout.replaceAll('\\', '/').toLowerCase().includes(run.replaceAll('\\', '/').toLowerCase()), 'Cleanup verifies the exact own run identity'); await exec('taskkill.exe', ['/PID', String(unity.pid), '/T', '/F'], { windowsHide: true }); } }
  fs.writeFileSync(path.join(run, 'summary.json'), JSON.stringify({ passed: !failure, checks, failure, evidence, editor, project, bridgePackage: bridge, bridgeSnapshot,
    querySourceSha256: { assets: sha(path.join(bridgeSnapshot, 'Editor/Queries/EditorAssetQueries.cs')), packages: sha(path.join(bridgeSnapshot, 'Editor/Queries/EditorPackageQueries.cs')) },
    editorPid: unity?.pid, ownEditorAlive: ownAlive(), gracefulEditorExit: graceful, providerInvoked: false, queryPhaseOnly: true }, null, 2)); console.log('Artifacts: ' + run);
}
