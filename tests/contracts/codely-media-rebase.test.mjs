// Persisted, owned media fixtures. No generator, fetch, or network is invoked.
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { createOwnedGenerationMedia } from '../fixtures/asset-generation-provider-fixture.mjs';
const require=createRequire(import.meta.url),{createAssetService}=require('../../src/core/binary/out/gamecowork-assets.js'),{createCodelyGeneratorApi}=require('../../src/core/binary/out/gamecowork-codely-generator.js');
const root=path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/codely-media-rebase-'+randomUUID()),store=path.join(root,'runtime'),media=createOwnedGenerationMedia(root),oldOrigin='http://127.0.0.1:41111',newOrigin='http://127.0.0.1:42222';
let assets,api,inputA,inputGlobal,inputDeleted,inputTampered,networkCalls=0;const snapshots=new Map(),originalFetch=globalThis.fetch;
const noFetch=async()=>{networkCalls++;throw Error('Media rebasing must never fetch');};
function register(filename,workspaceKey){const inputId='i_'+randomUUID(),file=path.join(store,'incoming',inputId+'.bin');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,media.png.bytes);try{return assets.registerInput({inputId,filename,workspaceKey,byteLength:media.png.size,sha256:media.png.sha256}).input;}finally{fs.unlinkSync(file);}}
const inputUrl=(input,origin=oldOrigin)=>origin+'/api/codely-generator/local-inputs/'+input.id+'/'+encodeURIComponent(input.filename)+'?workspaceKey='+encodeURIComponent(input.workspaceKey);
const artifactUrl=(taskId,artifactId,filename='owned.png',origin=oldOrigin)=>origin+'/api/codely-generator/local-artifacts/'+taskId+'/'+artifactId+'/'+encodeURIComponent(filename);
test.before(async()=>{
  globalThis.fetch=noFetch;
  assets=createAssetService({root:store,fetch:noFetch});inputA=register('参考图 A.png','workspace-a');inputGlobal=register('global.png','');inputDeleted=register('deleted.png','workspace-a');inputTampered=register('tampered.png','workspace-a');
  await assets.dispatch('generator/deleteInput',{inputId:inputDeleted.id,workspaceKey:'workspace-a'});const tampered=assets.getInputPath(inputTampered.id,'workspace-a').path;fs.appendFileSync(tampered,'tamper');await assets.close();
  const tasks={};for(const name of ['good','deleted','tampered','hardlinked']){const id='t_'+name,artifactId='a_'+name,file=path.join('assets',id,artifactId+'.png'),actual=path.join(store,file);fs.mkdirSync(path.dirname(actual),{recursive:true});
    if(name!=='deleted')fs.writeFileSync(actual,name==='tampered'?Buffer.concat([media.png.bytes,Buffer.from('tamper')]):media.png.bytes);
    if(name==='hardlinked')fs.linkSync(actual,path.join(root,'owned-hardlink-alias.png'));
    tasks[id]={id,providerId:'owned-fixture',kind:'image',model:'owned',prompt:'Owned persisted fixture',status:'completed',createdTime:'2026-10-02T00:00:00.000Z',updatedTime:'2026-10-02T00:00:00.000Z',discarded:false,parameters:{},inputs:[],artifacts:[{id:artifactId,filename:'owned.png',mime:'image/png',kind:'image',byteLength:media.png.size,sha256:media.png.sha256,_file:file}],_phase:'terminal'};
  }
  fs.writeFileSync(path.join(store,'tasks.json'),JSON.stringify(tasks));assets=createAssetService({root:store,fetch:noFetch});api=createCodelyGeneratorApi({assetService:assets});
  const graph={nodes:[{id:'image',data:{url:inputUrl(inputA),unchanged:{prompt:'Original text',number:17}}}],edges:[],viewport:{x:8,y:16,zoom:0.7}};fs.writeFileSync(path.join(root,'owned-canvas-graph.json'),JSON.stringify(graph));
  for(const file of [path.join(root,'owned-canvas-graph.json'),path.join(store,'inputs.json'),path.join(store,'tasks.json')])snapshots.set(file,fs.readFileSync(file));
});
test.after(async()=>{globalThis.fetch=originalFetch;await assets.close();});

test('A changed loopback origin rebases only verified persisted artifact/input identities',async()=>{
  const artifact=artifactUrl('t_good','a_good'),reference=inputUrl(inputA),global=inputUrl(inputGlobal),result=await api.rebaseMedia({origin:newOrigin,urls:[artifact,reference,global,artifact]});
  assert.deepEqual(result.replacements,{[artifact]:artifactUrl('t_good','a_good','owned.png',newOrigin),[reference]:inputUrl(inputA,newOrigin),[global]:inputUrl(inputGlobal,newOrigin)});
  assert.equal(networkCalls,0);for(const [file,before]of snapshots)assert.deepEqual(fs.readFileSync(file),before,'Rebasing changes neither graph bytes nor persistence');
});

test('Wrong filenames, scopes, route roots, extra query fields and traversal are not rewritten',async()=>{
  const reference=inputUrl(inputA),artifact=artifactUrl('t_good','a_good'),wrong=[artifactUrl('t_good','a_good','wrong.png'),reference.replace('workspace-a','workspace-b'),reference.replace('?workspaceKey=workspace-a',''),reference+'&workspaceKey=workspace-a',reference+'&download=1',artifact+'?download=1',reference.replace('/api/codely-generator/','/neighbor-root/'),oldOrigin+'/neighbor/../api/codely-generator/local-artifacts/t_good/a_good/owned.png',oldOrigin+'/neighbor/%2e%2e/api/codely-generator/local-artifacts/t_good/a_good/owned.png',artifact+'#fragment'];
  assert.deepEqual((await api.rebaseMedia({origin:newOrigin,urls:wrong})).replacements,{});assert.equal(networkCalls,0);
});

test('External hosts, unsafe schemes and credential-bearing URLs remain untouched without any proxy request',async()=>{
  const artifact=artifactUrl('t_good','a_good'),foreign=[artifact.replace(oldOrigin,'https://example.invalid'),artifact.replace(oldOrigin,'http://127.0.0.1.example.invalid:41111'),artifact.replace(oldOrigin,'https://127.0.0.1:41111'),artifact.replace(oldOrigin,'http://user:password@127.0.0.1:41111'),'file:///F:/outside.png','data:image/png;base64,AAAA','not a URL'];
  assert.deepEqual((await api.rebaseMedia({origin:newOrigin,urls:foreign})).replacements,{});assert.equal(networkCalls,0);
});

test('Deleted, tampered, linked and unknown media cannot be revived by changing their port',async()=>{
  const urls=[artifactUrl('t_deleted','a_deleted'),artifactUrl('t_tampered','a_tampered'),artifactUrl('t_hardlinked','a_hardlinked'),artifactUrl('t_unknown','a_unknown'),inputUrl(inputDeleted),inputUrl(inputTampered)];
  assert.deepEqual((await api.rebaseMedia({origin:newOrigin,urls})).replacements,{});assert.equal(networkCalls,0);
});

test('The helper accepts other canonical loopback origins but rejects caller-controlled storage roots and budgets',async()=>{
  const original=artifactUrl('t_good','a_good','owned.png','http://localhost:41111');
  assert.equal((await api.rebaseMedia({origin:'http://[::1]:42222',urls:[original]})).replacements[original],artifactUrl('t_good','a_good','owned.png','http://[::1]:42222'));
  for(const origin of ['https://example.invalid','http://example.invalid','http://127.0.0.1:42222/path','file:///F:/outside'])await assert.rejects(()=>api.rebaseMedia({origin,urls:[original]}));
  await assert.rejects(()=>api.rebaseMedia({origin:newOrigin,urls:[original],root:'F:/untrusted-root'}),/untrusted_media_root/);
  await assert.rejects(()=>api.rebaseMedia({origin:newOrigin,urls:Array(513).fill(original)}),/invalid_media_urls/);
  await assert.rejects(()=>api.rebaseMedia({origin:newOrigin,urls:['x'.repeat(2*1024*1024)]}),/media_urls_too_large/);
  await assert.rejects(()=>api.rebaseMedia({origin:newOrigin,urls:[{}]}),/invalid_media_urls/);assert.equal(networkCalls,0);
});

test('Reopening the owned service keeps the same media identity and does not migrate the saved graph',async()=>{
  await assets.close();assets=createAssetService({root:store,fetch:noFetch});api=createCodelyGeneratorApi({assetService:assets});
  const reference=inputUrl(inputA);assert.equal((await api.rebaseMedia({origin:newOrigin,urls:[reference]})).replacements[reference],inputUrl(inputA,newOrigin));
  for(const [file,before]of snapshots)assert.deepEqual(fs.readFileSync(file),before);assert.equal(networkCalls,0);
});
