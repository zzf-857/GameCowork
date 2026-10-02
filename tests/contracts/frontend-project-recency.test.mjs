import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../../src/frontend/bundle/assets/gamecowork-project-status.js',import.meta.url),'utf8');
const context=vm.createContext({});
vm.runInContext(source.replaceAll('export ','')+'\nthis.api={projectModifiedAt,projectStatusMessage}',context);
const {projectModifiedAt:at,projectStatusMessage:status}=context.api;
test('Sorting prefers actual host milliseconds over ambiguous display timestamps',()=>{
  const rows=[{lastModified:'bad',lastModifiedUnixMs:20},{lastModified:'2099-01-01',lastModifiedUnixMs:10},{lastModified:'bad'}];
  assert.deepEqual(rows.sort((a,b)=>at(b)-at(a)).map(at),[20,10,0]);
  assert.equal(at({lastModified:'2026-10-02T00:00:00Z'}),Date.parse('2026-10-02T00:00:00Z'));
});
test('Incomplete recency remains distinct from unavailable project metadata',()=>{
  assert.equal(status({scanIncomplete:true,recencyWarning:'budget',metadataWarning:'budget'}),'项目修改时间扫描未完成');
  assert.equal(status({pathExists:false,scanIncomplete:true,recencyWarning:'budget'}),'项目目录不可用');
  assert.equal(status({metadataWarning:'cannot read ProjectVersion'}),'项目元数据不可用');
});
for(const file of ['TJHubRoute-D42CgVct.js','TJHubRoute-DN1YDDd-.js'])test(file+' preserves actual recency, stable invalid dates and recovery',()=>{
  const code=fs.readFileSync(new URL('../../src/frontend/bundle/assets/'+file,import.meta.url),'utf8');
  assert.match(code,/lastModifiedUnixMs: Number\.isFinite\(F.lastModifiedUnixMs\)/);
  assert.match(code,/scanIncomplete: F.scanIncomplete === !0/);
  assert.match(code,/gamecoworkProjectModifiedAt\(te\) - gamecoworkProjectModifiedAt\(ce\)/);
  assert.doesNotMatch(code,/new Date\([^)]*lastModified\)/);
  assert.match(code,/\(\(ke = G\), w\(G\), R\(null\)\)/);
});
