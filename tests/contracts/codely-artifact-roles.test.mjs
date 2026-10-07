import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {startAssetGenerationProvider} from '../fixtures/asset-generation-provider-fixture.mjs';
const require=createRequire(import.meta.url),{createAssetService}=require('../../src/core/binary/out/modules/generation/service.js'),{createCodelyGeneratorApi}=require('../../src/core/binary/out/modules/generation/codely-api.js'),catalog=require('../../src/core/binary/out/modules/generation/models/official-catalog.js');
const root=path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/2026-10-07-ai-assets/thirdparty/roles-'+randomUUID()),store=path.join(root,'runtime'),scope='owned-role-workspace';
let peer,service,compatibility,official,legacy;
const open=()=>{service=createAssetService({root:store,pollIntervalMs:10,requestTimeoutMs:1000});};
const api=()=>createCodelyGeneratorApi({assetService:service,getOfficial:()=>null});
async function complete(id){for(let n=0;n<500;n++){const {task}=await service.dispatch('generator/getTask',{taskId:id});if(['completed','failed','interrupted'].includes(task.status))return task;await new Promise(resolve=>setTimeout(resolve,5));}throw Error('Owned role-cache fixture deadline');}
const detail=(compatibility,id)=>compatibility.dispatch({method:'GET',path:'/task/'+id+'/status',origin:peer.baseUrl,workspaceKey:scope});
test.before(async()=>{
  peer=await startAssetGenerationProvider({root,authMode:'none'});open();
  service.attachOfficialExecutor({isAvailable:()=>true,assertOwner:task=>assert.equal(task._officialOwner,'b'.repeat(64)),downloadProvider:()=>({baseUrl:peer.baseUrl,authMode:'none'}),async request(){return {id:'owned-role-remote',status:'completed',outputs:[{url:peer.baseUrl+'/artifacts/png',role:'preview'},{url:peer.baseUrl+'/artifacts/mp4',role:'result'}]};}});
  const parameters=catalog.minimalPayload('seedance2');official=await complete(service.createOfficialTask({model:'seedance2',kind:'video',prompt:parameters.prompt,parameters,workspaceKey:scope,inputIds:[],ownerBinding:'b'.repeat(64)}).task.id);assert.equal(official.status,'completed');
  await service.dispatch('generator/saveProvider',{provider:{id:'owned-no-role',name:'Owned legacy role cache',kinds:['image'],baseUrl:peer.baseUrl,model:'owned-image',authMode:'none'}});legacy=await complete((await service.dispatch('generator/createTask',{providerId:'owned-no-role',kind:'image',prompt:'Owned prior role-free artifact',workspaceKey:scope})).task.id);assert.equal(legacy.status,'completed');compatibility=api();
});
test.after(async()=>{await service?.close();await peer?.close();});
test('Actual verified preview/result files retain their exact cache roles in the original API DTO',async()=>{
  assert.deepEqual(official.artifacts.map(artifact=>artifact.role),['preview','result']);
  const response=await detail(compatibility,official.id);assert.equal(response.status,200);
  const artifacts=response.body.output.data.artifacts;assert.deepEqual(artifacts.map(artifact=>artifact.role),['preview','result']);
  assert.equal(artifacts[0].sha256,peer.media.png.sha256);assert.equal(artifacts[1].sha256,peer.media.mp4.sha256);
  assert.equal(artifacts.filter(artifact=>artifact.role!=='preview').length,1);assert.equal(artifacts.filter(artifact=>artifact.role!=='preview')[0].mime,'video/mp4');
  for(const artifact of official.artifacts)assert.equal(service.getArtifactPath(official.id,artifact.id).sha256,artifact.sha256);
});
test('An actual older role-free artifact does not acquire an inferred result or preview classification',async()=>{
  assert.equal(Object.hasOwn(legacy.artifacts[0],'role'),false);const response=await detail(compatibility,legacy.id);assert.equal(response.status,200);assert.equal(Object.hasOwn(response.body.output.data.artifacts[0],'role'),false);
});
test('Cold restoration retains verified role facts without rewriting cache or inventing roles for older records',async()=>{
  const file=path.join(store,'tasks.json'),before=fs.readFileSync(file);await service.close();open();compatibility=api();
  assert.deepEqual((await detail(compatibility,official.id)).body.output.data.artifacts.map(artifact=>artifact.role),['preview','result']);assert.equal(Object.hasOwn((await detail(compatibility,legacy.id)).body.output.data.artifacts[0],'role'),false);assert.deepEqual(fs.readFileSync(file),before);
});
test('Unknown, non-string and control-bearing role metadata are omitted by the fixed public whitelist',async()=>{
  const file=path.join(store,'tasks.json');await service.close();const original=fs.readFileSync(file),stored=JSON.parse(original);
  try {
    for(const value of ['primary','result ','preview\n',null,42,{role:'result'}]) {
      const candidate=structuredClone(stored);candidate[official.id].artifacts.forEach(artifact=>{artifact.role=value;});fs.writeFileSync(file,JSON.stringify(candidate));open();compatibility=api();
      const response=await detail(compatibility,official.id);assert.equal(response.status,200);assert.ok(response.body.output.data.artifacts.every(artifact=>!Object.hasOwn(artifact,'role')));await service.close();
    }
  } finally {fs.writeFileSync(file,original);open();compatibility=api();}
});
