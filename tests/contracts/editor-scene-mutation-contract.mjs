import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL('../../'+file,import.meta.url),'utf8');
const mutation=read('src/editor-bridge/Editor/Operations/EditorSceneMutations.cs'),queries=read('src/editor-bridge/Editor/Queries/EditorSceneQueries.cs');
test('Mutation dispatch remains limited and the separate actual read-only entry rejects write actions',()=>{
 assert.match(mutation,/command == "manage_gameobject" && \(action == "create" \|\| action == "modify"\) \|\| command == "manage_scene" && action == "save"/);
 assert.match(queries,/if \(action != "get_hierarchy"\) throw new NotSupportedException/);
 assert.match(queries,/Unsupported manage_gameobject action:/);
 for(const unsupported of ['SetValue(','SetNestedProperty','AddComponent(','LoadAssetAtPath','OpenScene(','SaveAsPrefabAsset'])assert.equal(mutation.includes(unsupported),false,unsupported);
});
test('Actual write submission follows parameter/root validation, records Undo and never SaveAs',()=>{
 const invoke=mutation.slice(mutation.indexOf('internal static string Invoke'));
 assert.ok(invoke.indexOf('position = Vector')<invoke.indexOf('BeginEffect(identity)'));
 assert.ok(invoke.indexOf('Storage(scene)')<invoke.indexOf('BeginEffect(identity)'));
 assert.match(invoke,/EditorSceneManager.SaveScene\(scene\)/);assert.doesNotMatch(invoke,/SaveScene\(scene,/);
 assert.match(invoke,/Undo.RegisterCreatedObjectUndo/);assert.match(invoke,/Undo.RecordObjects/);assert.match(invoke,/Undo.FlushUndoRecordObjects/);
 assert.match(invoke,/Finish\(identity, "failed"\); throw/);assert.doesNotMatch(invoke,/RevertAll|PerformUndo/);
});
test('Write storage validates original physical directories, non-linked scene files and exact loaded identity',()=>{
 assert.match(mutation,/rootIdentity = Identity\(originalRoot, false\).Key/);assert.match(mutation,/assetsIdentity = Identity/);
 assert.match(mutation,/Original scene project storage was replaced/);assert.match(mutation,/lease.DomainId != Bridge.EditorDomain/);
 assert.match(mutation,/file && result.Links != 1/);assert.match(mutation,/FileAttributes.ReparsePoint/);
 assert.match(mutation,/part == "\.\."/);assert.match(mutation,/Exactly one currently loaded ordinary scene/);
});
test('Transport budgets are validated before admission and do not manufacture operation completion',()=>{
 assert.match(mutation,/timeoutSeconds must be an integer in 1\.\.180/);
 assert.match(mutation,/\(double\)value % 1 != 0/);assert.match(mutation,/\(double\)value < 1 \|\| \(double\)value > 180/);
 const invoke=mutation.slice(mutation.indexOf('internal static string Invoke'));
 assert.ok(invoke.indexOf('Budget(input)')<invoke.indexOf('BeginEffect(identity)'));
 assert.equal((invoke.match(/Keys\(input,[^;]+"timeoutSeconds"\)/g)||[]).length,3);
 assert.doesNotMatch(mutation,/Thread\.Sleep|Timer|timeoutSeconds.*saved = true/);
});
