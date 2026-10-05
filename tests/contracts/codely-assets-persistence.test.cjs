const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{randomUUID}=require('node:crypto');
const {createAssetService}=require('../../src/core/binary/out/gamecowork-assets.js');
test('A transient Windows rename denial retries the prepared local bytes and preserves last durable state',async()=>{
  const root=path.join('F:/AI/AgentMake/temp/GameCowork/tests','asset-persist-'+randomUUID()),service=createAssetService({root});
  const first={nodes:[{id:'old',value:1}],edges:[]},next={nodes:[{id:'new',value:2}],edges:[]};
  await service.dispatch('generator/saveCanvas',{canvas:first}); const destination=path.join(root,'canvases.json'),before=fs.readFileSync(destination),rename=fs.renameSync;let attempts=0;
  fs.renameSync=(source,target)=>{if(target===destination && attempts++<2){assert.ok(fs.readFileSync(destination).equals(before));const error=Error('owned fixture transient denial');error.code='EPERM';throw error;}return rename(source,target);};
  try {await service.dispatch('generator/saveCanvas',{canvas:next});assert.equal(attempts,3);assert.deepEqual(JSON.parse(fs.readFileSync(destination)).default,next);}
  finally {fs.renameSync=rename;await service.close();}
});
test('An exhausted rename denial keeps both the old file and prepared bytes without deleting destination',async()=>{
  const root=path.join('F:/AI/AgentMake/temp/GameCowork/tests','asset-persist-'+randomUUID()),service=createAssetService({root}),destination=path.join(root,'canvases.json');
  const first={nodes:[{id:'old'}],edges:[]},next={nodes:[{id:'pending'}],edges:[]};await service.dispatch('generator/saveCanvas',{canvas:first});const before=fs.readFileSync(destination),rename=fs.renameSync;let attempts=0;
  fs.renameSync=(source,target)=>{if(target===destination){attempts++;const error=Error('owned fixture denial');error.code='EACCES';throw error;}return rename(source,target);};
  try {await assert.rejects(service.dispatch('generator/saveCanvas',{canvas:next}),/fixture denial/);assert.equal(attempts,6);assert.ok(fs.readFileSync(destination).equals(before));const prepared=fs.readdirSync(root).filter(name=>name.startsWith('canvases.json.tmp-'));assert.equal(prepared.length,1);assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,prepared[0]))).default,next);assert.deepEqual((await service.dispatch('generator/getCanvas')).canvas,first);}
  finally {fs.renameSync=rename;await service.close();}
});
