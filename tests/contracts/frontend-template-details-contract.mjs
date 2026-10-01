// Extract the actual template detail renderer, including its source helpers.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const directory=fileURLToPath(new URL('../../src/frontend/bundle/assets/',import.meta.url));
function render(source,template,tab){
 const start=source.indexOf('function io('),end=source.indexOf('function fo(',start);
 assert.ok(start>=0&&end>start,'Extract real formatter and ho renderer');
 const jsx=(type,props)=>typeof type==='function'?type(props):{type,props};
 const context=vm.createContext({e:{jsx,jsxs:jsx},t:value=>value,q:()=>({t:(key,options)=>options?.defaultValue||key}),
  n:{useState:()=>[tab,()=>{}]},St:'tabs',ne:'button',ze:'close-icon',he:'scroll'});
 vm.runInContext(source.slice(start,end),context);
 return context.ho({template,onClose:()=>{}});
}
function nodes(value){if(!value||typeof value!=='object')return [];return [value,...Object.values(value).flatMap(v=>Array.isArray(v)?v.flatMap(nodes):nodes(v))];}
function text(value){if(value===null||value===undefined||typeof value==='boolean')return '';if(typeof value!=='object')return String(value);return Object.values(value).map(v=>Array.isArray(v)?v.map(text).join(' '):text(v)).join(' ');}
const detail={name:'com.gamecowork.real',displayName:'Actual Template',description:'Actual archive description',version:'1.2.3',type:'CORE',
 size:2048,renderPipeline:null,buildPlatforms:null,packages:[{name:'com.unity.textmeshpro',packageName:'com.unity.textmeshpro',version:'3.0.6'}]};
for(const file of ['TJHubRoute-D42CgVct.js','TJHubRoute-DN1YDDd-.js']){
 const source=fs.readFileSync(directory+file,'utf8');
 test(file+': actual information preserves archive metadata and reports unsupported optional fields honestly',()=>{
  const result=render(source,detail,'information'),all=nodes(result);
  assert.ok(all.some(node=>node.props?.['data-testid']==='gamecowork-template-information'));
  assert.match(text(result),/Actual archive description/);assert.match(text(result),/2\.00 KB/);
  assert.ok((text(result).match(/未提供/g)||[]).length===2);
  assert.doesNotMatch(text(result),/renderPipelineBuiltin|platformWindows/);
 });
 test(file+': actual packages tab renders exact dependency identities and versions',()=>{
  const result=render(source,detail,'packages');assert.match(text(result),/com\.unity\.textmeshpro/);assert.match(text(result),/3\.0\.6/);
  assert.ok(nodes(result).some(node=>node.props?.['data-testid']==='gamecowork-template-packages'));
  assert.doesNotMatch(text(result),/未提供|noPackages/);
 });
 test(file+': absent arrays render missing metadata rather than an empty dependency claim',()=>{
  const missing={name:detail.name,displayName:detail.displayName,version:detail.version,type:'CORE'};
  assert.match(text(render(source,missing,'information')),/未提供/);
  const result=render(source,missing,'packages');assert.match(text(result),/未提供/);assert.doesNotMatch(text(result),/noPackages/);
  assert.doesNotMatch(text(render(source,missing,'information')),/undefined B|NaN/);
 });
 test(file+': explicit empty dependencies keep the real no-packages state',()=>{
  const result=render(source,{...detail,packages:[]},'packages');assert.match(text(result),/noPackages/);assert.doesNotMatch(text(result),/未提供/);
 });
 test(file+': malformed optional metadata cannot crash either actual tab',()=>{
  for(const value of [null,42,'wrong',{},[null],[42]]){
   const malformed={...detail,packages:value,buildPlatforms:value,size:'wrong',description:42};
   assert.match(text(render(source,malformed,'information')),/未提供/);
   assert.match(text(render(source,malformed,'packages')),/未提供/);
  }
 });
}
