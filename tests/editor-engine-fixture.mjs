import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

export function readEditorIdentity(editor) {
  assert.ok(fs.statSync(editor).isFile(),'Selected installed Editor executable must exist');
  const quoted="'"+editor.replaceAll("'","''")+"'";
  const script=`$item=Get-Item -LiteralPath ${quoted}; [pscustomobject]@{product=$item.VersionInfo.ProductName;version=$item.VersionInfo.ProductVersion} | ConvertTo-Json -Compress`;
  const info=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,encoding:'utf8',timeout:10000}));
  const engine=String(info.product).toLowerCase();assert.ok(['unity','tuanjie'].includes(engine),'Executable must report actual Unity or Tuanjie product identity');
  const version=String(info.version).split('_')[0];assert.match(version,/^\d{4}\.\d+\.\d+[a-zA-Z0-9.]+$/);
  return {engine,version,editor:path.resolve(editor)};
}

export function prepareEngineFixture({repo,project,templateProject,bridgePackage,identity,engine=identity.engine,version=identity.version}) {
  assert.equal(engine,identity.engine,'Requested fixture engine must match installed executable product');
  assert.equal(version,identity.version,'Requested fixture version must match installed executable metadata');
  const temp=path.resolve(repo,'../../temp/GameCowork');
  const inside=value=>path.resolve(value).toLowerCase().startsWith(temp.toLowerCase()+path.sep);
  assert.ok(inside(project),'Fixture output must stay in own temp');
  const sceneExtension=engine==='tuanjie'?'.scene':'.unity';
  let beforeManifest;
  if(templateProject){
    templateProject=fs.realpathSync(templateProject);assert.ok(inside(templateProject),'Template source must be a previously created own temp project');
    for(const name of['Assets','Packages','ProjectSettings'])fs.cpSync(path.join(templateProject,name),path.join(project,name),{recursive:true,filter:source=>{assert.ok(!fs.lstatSync(source).isSymbolicLink(),'Template clone does not follow links');return true;}});
    const actual=fs.readFileSync(path.join(project,'ProjectSettings/ProjectVersion.txt'),'utf8');
    assert.match(actual,new RegExp('^m_EditorVersion: '+version.replaceAll('.','\\.')+'\\s*$','m'));
    if(engine==='tuanjie')assert.match(actual,/^m_TuanjieEditorVersion:\s*\S+/m);
    else assert.doesNotMatch(actual,/^m_TuanjieEditorVersion:/m);
    beforeManifest=fs.readFileSync(path.join(project,'Packages/manifest.json'));
  }else{
    for(const name of['Assets','Packages','ProjectSettings'])fs.mkdirSync(path.join(project,name),{recursive:true});
    fs.writeFileSync(path.join(project,'ProjectSettings/ProjectVersion.txt'),'m_EditorVersion: '+version+'\n'+(engine==='tuanjie'?'m_TuanjieEditorVersion: '+version+'\n':''));
    beforeManifest=Buffer.from(JSON.stringify({dependencies:{'com.unity.modules.imgui':'1.0.0'}},null,2));
  }
  for(const name of['Assets/Editor','Temp'])fs.mkdirSync(path.join(project,name),{recursive:true});
  const manifest=JSON.parse(beforeManifest);assert.ok(manifest.dependencies&&typeof manifest.dependencies==='object');
  manifest.dependencies['cn.gamecowork.bridge']='file:'+bridgePackage.replaceAll('\\','/');
  fs.writeFileSync(path.join(project,'Temp/manifest-before-fixture-bridge.json'),beforeManifest);
  fs.writeFileSync(path.join(project,'Packages/manifest.json'),JSON.stringify(manifest,null,2));
  const input=fs.readFileSync(path.join(repo,'tests/editor-bridge-fixture.cs'),'utf8');
  assert.equal(input.split('root + "/Assets/fixture.unity"').length,2,'Known own test scene save location exists once');
  fs.writeFileSync(path.join(project,'Assets/Editor/GameCoworkBridgeFixture.cs'),input.replace('root + "/Assets/fixture.unity"','root + "/Assets/fixture'+sceneExtension+'"'));
  fs.copyFileSync(path.join(repo,'tests/editor-bridge-runtime-fixture.cs'),path.join(project,'Assets/GameCoworkBridgeRuntimeFixture.cs'));
  return {engine,version,scenePath:path.join(project,'Assets','fixture'+sceneExtension),templateProject};
}
