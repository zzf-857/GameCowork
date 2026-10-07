// Actual service policy/format boundaries with an own loopback HTTP fixture.
import fs from 'node:fs';import path from 'node:path';import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';import {createRequire} from 'node:module';
import {startAssetGenerationProvider} from '../fixtures/asset-generation-provider-fixture.mjs';
const require=createRequire(import.meta.url),{createAssetService}=require('../../src/core/binary/out/modules/generation/service.js'),root=path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/asset-policy-'+randomUUID());
let provider,service,base;const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function done(taskId){const deadline=Date.now()+5000;for(;;){const {task}=await service.dispatch('generator/getTask',{taskId});if(['completed','failed','interrupted'].includes(task.status))return task;if(Date.now()>deadline)throw Error('Owned policy task deadline');await wait(10);}}
test.before(async()=>{provider=await startAssetGenerationProvider({root,plans:{POLICY_BAD_PNG:{kind:'image',base64:true},POLICY_BAD_GLB:{kind:'model'},POLICY_PREVIEW_ONLY:{kind:'model',extensions:['png']}}});service=createAssetService({root:path.join(root,'runtime/generator'),pollIntervalMs:25,requestTimeoutMs:1000});base={id:'owned-policy',name:'Owned policy',baseUrl:provider.baseUrl,kinds:['image','video','model'],model:'owned',authMode:'bearer',apiKey:provider.apiKey};await service.dispatch('generator/saveProvider',{provider:base});});
test.after(async()=>{await service?.close();await provider?.close();});
test('Credential/template/header/selector/state-map errors are rejected before any remote generation',async()=>{
 const changes=[{apiKey:'bad\r\nvalue'},{apiKeyHeader:'Host'},{adapter:{create:{method:'CONNECT',path:'/tasks'}}},{adapter:{create:{method:'POST',path:'/../escape'}}},{adapter:{create:{method:'POST',path:'/tasks',bodyTemplate:{apiKey:'must-not-persist'}}}},{adapter:{create:{method:'POST',path:'/tasks',bodyTemplate:{prompt:'{{unknownVariable}}'}}}},{adapter:{selectors:{status:'__proto__.polluted'}}},{adapter:{statusMap:{failed:['completed']}}},{name:provider.apiKey},{baseUrl:provider.baseUrl+'/'+provider.apiKey},{baseUrl:'https://ai-generator.tuanjie.cn.'}];
 for(const change of changes)await assert.rejects(()=>service.dispatch('generator/saveProvider',{provider:{...base,...change}}));
 assert.equal(provider.requests.length,0);assert.equal(fs.readFileSync(path.join(root,'runtime/generator/providers.json'),'utf8').includes(provider.apiKey),false);
});
test('A damaged PNG checksum cannot become a completed image',async()=>{
 const original=provider.media.png.bytes,corrupt=Buffer.from(original);corrupt[41]^=1;provider.media.png.bytes=corrupt;
 try{const {task}=await service.dispatch('generator/createTask',{providerId:base.id,kind:'image',prompt:'POLICY_BAD_PNG'}),result=await done(task.id);assert.equal(result.status,'failed');assert.match(result.error,/PNG checksum/);assert.equal(result.artifacts.length,0);}finally{provider.media.png.bytes=original;}
});
test('GLB external resources are rejected before a renderer could fetch unrelated URLs',async()=>{
 const original=provider.media.glb.bytes,length=original.readUInt32LE(12),gltf=JSON.parse(original.toString('utf8',20,20+length));gltf.buffers[0].uri='https://127.0.0.1/private-not-requested';const json=Buffer.from(JSON.stringify(gltf)),padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]),binary=original.subarray(20+length),replacement=Buffer.alloc(20+padded.length+binary.length);original.subarray(0,20).copy(replacement);replacement.writeUInt32LE(replacement.length,8);replacement.writeUInt32LE(padded.length,12);padded.copy(replacement,20);binary.copy(replacement,20+padded.length);provider.media.glb.bytes=replacement;provider.media.glb.size=replacement.length;
 try{const {task}=await service.dispatch('generator/createTask',{providerId:base.id,kind:'model',prompt:'POLICY_BAD_GLB'}),result=await done(task.id);assert.equal(result.status,'failed');assert.match(result.error,/own resources/);assert.equal(result.artifacts.length,0);assert.equal(provider.requests.some(row=>row.path.includes('private-not-requested')),false);}finally{provider.media.glb.bytes=original;provider.media.glb.size=original.length;}
});
test('A model thumbnail alone is not a completed 3D model',async()=>{
 const {task}=await service.dispatch('generator/createTask',{providerId:base.id,kind:'model',prompt:'POLICY_PREVIEW_ONLY'}),result=await done(task.id);assert.equal(result.status,'failed');assert.match(result.error,/no actual primary asset/);assert.equal(result.artifacts.every(row=>row.kind==='image'),true);
});
test('Hard-linked state stores are not overwritten by provider persistence',async()=>{
 const file=path.join(root,'runtime/generator/providers.json'),outside=path.join(root,'state-hardlink.json'),before=fs.readFileSync(file);fs.linkSync(file,outside);
 try{await assert.rejects(()=>service.dispatch('generator/saveProvider',{provider:{...base,name:'Must reject'}}),/Linked/);assert.deepEqual(fs.readFileSync(outside),before);}finally{fs.unlinkSync(outside);}
});
