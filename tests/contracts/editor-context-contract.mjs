import fs from 'node:fs';import test from 'node:test';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../../src/editor-bridge/Editor/Queries/EditorContextQueries.cs',import.meta.url),'utf8');
test('Context route reuses both established root/selection handlers and exposes exact read actions',()=>{
 for(const action of ['get_selection','get_project_root','get_windows','get_tags','get_layers','get_active_tool'])assert.ok(source.includes('"'+action+'"'));
 assert.match(source,/EditorReadOnly\.Invoke\("manage_editor", action\)/);assert.match(source,/default: throw new NotSupportedException/);
});
test('Context implementation has no editor mutation, window creation/focus or preferences write route',()=>{
 assert.doesNotMatch(source,/Selection\.[\w]+\s*=|Tools\.[\w]+\s*=|EditorPrefs\s*\.|\.Focus\(|\.Show\(|GetWindow\(|CreateInstance|SetDirty|SaveAssets|ApplyModifiedProperties/);
 assert.match(source,/Resources\.FindObjectsOfTypeAll<EditorWindow>/);assert.match(source,/InternalEditorUtility\.tags/);assert.match(source,/LayerMask\.LayerToName/);
});
test('Collection/geometry/response bounds are explicit and windows report actual instance identity',()=>{
 assert.match(source,/MaxWindows = 256, MaxTags = 1024, MaxName = 4096, MaxBytes = 900000/);assert.match(source,/float\.IsNaN/);assert.match(source,/float\.IsInfinity/);
 assert.match(source,/instanceID = id, instanceId = id/);assert.match(source,/EditorWindow\.focusedWindow == window/);assert.match(source,/customToolUnavailableReason/);
});
test('New Context source has a valid stable Unity import identity',()=>{
 const meta=fs.readFileSync(new URL('../../src/editor-bridge/Editor/Queries/EditorContextQueries.cs.meta',import.meta.url),'utf8');assert.match(meta,/^guid: [a-f0-9]{32}$/m);
});
