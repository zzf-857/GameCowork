import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
const asset = fs.readFileSync(new URL('../../src/editor-bridge/Editor/EditorAssetQueries.cs', import.meta.url), 'utf8');
const packages = fs.readFileSync(new URL('../../src/editor-bridge/Editor/EditorPackageQueries.cs', import.meta.url), 'utf8');
test('Own asset queries retain original parameter/output names and declare all finite search/preview bounds', () => {
  for (const field of ['searchPattern', 'filterType', 'filterDateAfter', 'pageSize', 'pageNumber', 'generatePreview', 'totalAssets', 'previewBase64', 'previewWidth', 'previewHeight']) assert.ok(asset.includes(field), field);
  assert.match(asset, /ScanLimit = 4096, PageLimit = 100, ResponseLimit = 900000/);
  assert.match(asset, /PreviewLimit = 131072, PreviewBudget = 393216, PreviewCountLimit = 4/);
  assert.match(asset, /queryComplete/); assert.match(asset, /totalAssetsExact/); assert.match(asset, /invalidAssetCount/);
});
test('Asset get/search never import/save/change user editor state, and preview uses only real native pixels with cleanup', () => {
  assert.doesNotMatch(asset, /AssetDatabase\.(?:Refresh|ImportAsset|CreateAsset|SaveAssets|DeleteAsset)|Selection\s*\.|EditorPrefs\s*\.|GetMiniThumbnail|File\.Write/);
  assert.match(asset, /AssetPreview\.GetAssetPreview\(asset\)/); assert.match(asset, /AssetPreview\.IsLoadingAssetPreview/);
  assert.match(asset, /unsupported-no-graphics/); assert.match(asset, /previewReady = true/);
  assert.match(asset, /finally \{ RenderTexture\.active = previous;.*ReleaseTemporary.*DestroyImmediate/);
  assert.match(asset, /FileAttributes\.ReparsePoint/); assert.match(asset, /currently registered package/);
});
test('Package listing consumes registered runtime PackageInfo, never manifest text or network UPM operations', () => {
  assert.match(packages, /PackageInfo\.GetAllRegisteredPackages\(\)/);
  assert.match(packages, /currently-loaded-registered-packages/); assert.match(packages, /registeredPackagesOnly = true/);
  assert.doesNotMatch(packages, /Client\.(?:List|Add|Remove)\s*\(|File\.(?:Read\w*|Write\w*)\s*\(|JsonUtility\.FromJson\s*\(/);
  assert.match(packages, /registered\.Clone\(\)/); assert.match(packages, /PackageLimit = 1024, DependencyLimit = 128/);
  for (const field of ['name', 'version', 'displayName', 'description', 'source', 'assetPath', 'resolvedPath', 'isDirectDependency', 'queryComplete']) assert.ok(packages.includes(field), field);
});
