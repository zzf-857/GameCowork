import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
const assets=fileURLToPath(new URL('../restored/frontend/dist-beautified/assets/',import.meta.url));
const generations=[['current','index-BRxZ4eG7.js','RightSideBarPanel-JSPvAs5c.js','JR','YR','qR','XR','Km','kt'],['previous','index-DvRYaIVa.js','RightSideBarPanel-B2OWNNNX.js','zR','qR','WR','GR','Dm','St']];
function declaration(source,name){const start=source.search(new RegExp(`(?:async )?function ${name}\\(`));assert.ok(start>=0);const end=source.indexOf('\n}',start);assert.ok(end>start);return source.slice(start,end+2);}
for(const[label,mainFile,panelFile,head,index,action,branch,changed,route]of generations){
 const main=fs.readFileSync(assets+mainFile,'utf8'),panel=fs.readFileSync(assets+panelFile,'utf8');
 test(`${label}: actual HEAD/index fetch preserves an empty file and propagates failure`,async()=>{
  const calls=[];let result='';const scope={ms:async(...args)=>{calls.push(args);return{data:{status:'success',content:result}};},ws:vm.runInNewContext(`(${declaration(main,'ws')})`),[route]:r=>r};
  for(const[name,type]of[[head,'getFileAtHead'],[index,'getFileAtIndex']]){
   const read=vm.runInNewContext(`(${declaration(main,name)})`,scope);assert.equal(await read('repo','中文.txt','selected'),'');assert.equal(calls.at(-1)[0],type);assert.equal(calls.at(-1)[2],'selected');
   result={success:false};await assert.rejects(read('repo','a','selected'),/content/);result='';
   scope.ms=async()=>({data:{status:'error',error:'fixture binary/conflict failure'}});const failed=vm.runInNewContext(`(${declaration(main,name)})`,scope);await assert.rejects(failed('repo','a','selected'),/binary\/conflict/);scope.ms=async(...args)=>{calls.push(args);return{data:{status:'success',content:result}};};
  }
 });
 test(`${label}: mutation and branch APIs require actual receipts`,async()=>{
  let result={ok:true,branch:'feature'};const scope={window:{GAMECOWORK_SHELL:true},[route]:r=>r,ms:async()=>({data:{status:'success',content:result}}),ws:vm.runInNewContext(`(${declaration(main,'ws')})`)};
  const apply=vm.runInNewContext(`(${declaration(main,action)})`,scope),switchBranch=vm.runInNewContext(`(${declaration(main,branch)})`,scope);assert.equal((await apply('repo','stage',['a'],'A')).ok,true);await switchBranch('repo','feature','A');result={success:false};await assert.rejects(apply('repo','stage',['a'],'A'),/confirm/);await assert.rejects(switchBranch('repo','feature','A'),/confirm/);result={ok:true,branch:'wrong'};await assert.rejects(switchBranch('repo','feature','A'),/confirm/);
 });
 test(`${label}: actual diff selects HEAD/index/working text and fails visibly for binary/conflict/read errors`,async()=>{
  const diff=vm.runInNewContext(`(${declaration(panel,'gamecoworkGitDiffContents')})`);const calls=[];const readHead=async p=>{calls.push(['HEAD',p]);return'baseline';},readIndex=async p=>{calls.push(['index',p]);return'staged';},readWorking=async()=>({kind:'text',content:'working'});const change={path:'new.txt',repoPath:'new.txt',oldRepoPath:'old.txt',staged:true};
  assert.deepEqual(Array.from(await diff(change,'staged',readHead,readIndex,readWorking)),['baseline','staged']);assert.deepEqual(calls,[['HEAD','old.txt'],['index','new.txt']]);calls.length=0;
  assert.deepEqual(Array.from(await diff(change,'unstaged',readHead,readIndex,readWorking)),['staged','working']);assert.deepEqual(calls,[['index','new.txt']]);
  assert.deepEqual(Array.from(await diff({path:'new.txt'},'untracked',readHead,readIndex,async()=>({kind:'text',content:''}))),['','']);
  await assert.rejects(diff({...change,conflicted:true},'staged',readHead,readIndex,readWorking),/conflicts/);
  await assert.rejects(diff(change,'unstaged',readHead,readIndex,async()=>({kind:'binary'})),/text diff/);
  await assert.rejects(diff(change,'unstaged',readHead,readIndex,async()=>{throw new Error('permission denied');}),/permission denied/);
  assert.deepEqual(Array.from(await diff({...change,status:' D'},'unstaged',readHead,readIndex,async()=>{throw new Error('File not found');})),['staged','']);
  await assert.rejects(diff({...change,status:' D'},'unstaged',readHead,readIndex,async()=>{throw new Error('permission denied');}),/permission denied/);
  assert.ok(panel.includes('gamecoworkGitError || x("filePreview.gitActionFailedDescription")'));assert.ok(panel.includes('if (Nr.current.size) throw new Error'));assert.ok(!panel.includes('_a(le, yt).catch(() => null)'));
 });
 test(`${label}: native status failure cannot be rendered as an empty clean repository`,async()=>{
  const strict=mainFile.includes('BRx')?'U2':'F2';const read=vm.runInNewContext(`(${declaration(main,changed)})`,{window:{GAMECOWORK_SHELL:true},[strict]:async()=>{throw new Error('fixture Git unavailable');}});await assert.rejects(read('repo','A'),/unavailable/);
 });
}
