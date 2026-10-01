// Preparation contracts only: reads installed executable metadata and copies an
// existing own temp template. Does not start Unity/Tuanjie, GPU, or a Provider.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {readEditorIdentity,prepareEngineFixture} from '../support/editor-engine-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)),run=path.resolve(repo,'../../temp/GameCowork/tests','editor-bridge-engine-prepare-'+randomUUID());
const editor='E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe';
const identity=readEditorIdentity(editor),source=path.join(run,'native-template-source');
const unityIdentity=readEditorIdentity('F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe');
const archive=path.join(path.dirname(editor),'Data/Resources/PackageManager/ProjectTemplates/cn.tuanjie.template.3d-8.1.4.tgz');
const readArchive=entry=>execFileSync(path.join(process.env.SystemRoot,'System32/tar.exe'),['-xOf',archive,'package/'+entry],{windowsHide:true,maxBuffer:8*1024*1024});
const packageMeta=JSON.parse(readArchive('package.json'));assert.equal(packageMeta.name,'cn.tuanjie.template.3d');
for(const directory of['Assets/Scenes','Packages','ProjectSettings'])fs.mkdirSync(path.join(source,directory),{recursive:true});
for(const extension of['.scene','.scene.meta'])fs.writeFileSync(path.join(source,'Assets/Scenes/SampleScene'+extension),readArchive('ProjectData~/Assets/Scenes/SampleScene'+extension));
fs.writeFileSync(path.join(source,'Packages/manifest.json'),JSON.stringify({dependencies:packageMeta.dependencies},null,2));fs.writeFileSync(path.join(source,'ProjectSettings/ProjectVersion.txt'),'m_EditorVersion: '+identity.version+'\nm_TuanjieEditorVersion: '+identity.version+'\n');
const bridgePackage=path.join(repo,'src/editor-bridge'),digest=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
test('Installed executable metadata distinguishes genuine Tuanjie and default Unity without executing either',()=>{assert.equal(identity.engine,'tuanjie');assert.equal(identity.version,'2022.3.62t16');assert.equal(unityIdentity.engine,'unity');assert.equal(unityIdentity.version,'2022.3.51f1c1');});
test('Owned Tuanjie template clone keeps full manifest and native .scene bytes',()=>{const project=path.join(run,'project'),manifestBefore=digest(path.join(source,'Packages/manifest.json')),scene='Assets/Scenes/SampleScene.scene',sceneBefore=digest(path.join(source,scene));const result=prepareEngineFixture({repo,project,templateProject:source,bridgePackage,identity});assert.equal(result.engine,'tuanjie');assert.equal(path.extname(result.scenePath),'.scene');const before=JSON.parse(fs.readFileSync(path.join(source,'Packages/manifest.json'))),after=JSON.parse(fs.readFileSync(path.join(project,'Packages/manifest.json')));for(const [key,value]of Object.entries(before.dependencies))assert.equal(after.dependencies[key],value);assert.equal(after.dependencies['cn.gamecowork.bridge'],'file:'+bridgePackage.replaceAll('\\','/'));assert.equal(digest(path.join(project,scene)),sceneBefore);assert.equal(digest(path.join(source,'Packages/manifest.json')),manifestBefore);assert.equal(digest(path.join(source,scene)),sceneBefore);assert.ok(!fs.existsSync(path.join(project,'Library')));assert.match(fs.readFileSync(path.join(project,'Assets/Editor/GameCoworkBridgeFixture.cs'),'utf8'),/root \+ "\/Assets\/fixture\.scene"/);assert.match(fs.readFileSync(path.join(repo,'tests/fixtures/editor-bridge-fixture.cs'),'utf8'),/root \+ "\/Assets\/fixture\.unity"/);});
test('Fixture rejects engine/version pretence and preserves default Unity fixture format',()=>{for(const settings of[{engine:'unity'},{version:'2022.3.51f1c1'}])assert.throws(()=>prepareEngineFixture({repo,project:path.join(run,'reject-'+randomUUID()),bridgePackage,identity,...settings}),/must match installed executable/);const project=path.join(run,'unity-default'),result=prepareEngineFixture({repo,project,bridgePackage,identity:unityIdentity});assert.equal(path.extname(result.scenePath),'.unity');assert.equal(fs.readFileSync(path.join(project,'ProjectSettings/ProjectVersion.txt'),'utf8'),'m_EditorVersion: 2022.3.51f1c1\n');assert.match(fs.readFileSync(path.join(project,'Assets/Editor/GameCoworkBridgeFixture.cs'),'utf8'),/root \+ "\/Assets\/fixture\.unity"/);});
test('Fixture does not clone unrelated projects outside the owned temp area',()=>{assert.throws(()=>prepareEngineFixture({repo,project:path.join(run,'reject-path'),templateProject:repo,bridgePackage,identity}),/previously created own temp/);});
console.log(JSON.stringify({preparationOnly:true,run,editor,identity}));
