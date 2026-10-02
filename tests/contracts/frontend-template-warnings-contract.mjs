// Exercise the actual two-generation diagnostic renderer and response setters.
// Corrupt archives are a native Rust fixture concern; these are UI contracts.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const directory=fileURLToPath(new URL('../../src/frontend/bundle/assets/',import.meta.url));
const warnings=[
 {archive:'损坏模板.tgz',error:'Invalid template metadata: unexpected EOF <fixture>'},
 {archive:'missing-metadata.TGZ',error:'Template has no package.json'},
];
function render(source,diagnostics,shell=true){
 const start=source.indexOf('window.GAMECOWORK_SHELL && gamecoworkSkippedTemplates.length > 0 && e.jsxs("details", {');
 const end=source.indexOf('\n          e.jsxs("div", {',start);
 assert.ok(start>=0&&end>start,'Extract the actual warning presentation expression');
 const jsx=(type,props)=>({type,props});
 const context=vm.createContext({window:{GAMECOWORK_SHELL:shell},gamecoworkSkippedTemplates:diagnostics,e:{jsx,jsxs:jsx}});
 return vm.runInContext('('+source.slice(start,end).trim().replace(/,$/,'')+')',context);
}
function nodes(value){if(!value||typeof value!=='object')return [];return [value,...Object.values(value).flatMap(v=>Array.isArray(v)?v.flatMap(nodes):nodes(v))];}
const plain=value=>JSON.parse(JSON.stringify(value));
for(const file of ['TJHubRoute-D42CgVct.js','TJHubRoute-DN1YDDd-.js']){
 const source=fs.readFileSync(directory+file,'utf8');
 test(file+': actual warning presentation keeps skipped count and exact native diagnostic text',()=>{
  const result=render(source,warnings),all=nodes(result);
  assert.equal(result.type,'details');assert.equal(result.props['data-testid'],'gamecowork-template-warnings');
  assert.equal(all.find(node=>node.type==='summary').props.children,'有 2 个本地模板无法读取，已略过');
  assert.deepEqual(plain(all.filter(node=>node.type==='li').map(node=>node.props.children)),warnings.map(item=>`${item.archive}：${item.error}`));
  assert.ok(!all.some(node=>node.type==='script'||node.props?.dangerouslySetInnerHTML));
 });
 test(file+': the actual renderer hides empty diagnostics and non-native sessions',()=>{
  assert.equal(render(source,[]),false);assert.equal(render(source,warnings,false),false);
 });
 test(file+': actual renderer supplies labels for missing optional diagnostic fields',()=>{
  const result=render(source,[{}]);assert.equal(nodes(result).find(node=>node.type==='li').props.children,'未知模板：无法读取');
 });
 test(file+': actual initial and refresh setters discard absent or malformed skipped arrays',()=>{
  const statements=[...source.matchAll(/gamecoworkSetSkippedTemplates\(Array\.isArray\((oe|z)\.skippedTemplates\) \? \1\.skippedTemplates : \[\]\);/g)];
  assert.equal(statements.length,2,'Both native request paths update diagnostics');
  for(const [statement,identifier]of statements){
   for(const response of [{skippedTemplates:warnings},{},{skippedTemplates:null},{skippedTemplates:'wrong'},{skippedTemplates:{archive:'wrong'}}]){
    let captured;const context=vm.createContext({[identifier]:response,gamecoworkSetSkippedTemplates:value=>{captured=value;}});
    vm.runInContext(statement,context);
    assert.deepEqual(plain(captured),Array.isArray(response.skippedTemplates)?response.skippedTemplates:[]);
   }
  }
 });
}
