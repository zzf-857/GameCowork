import fs from 'node:fs'; import vm from 'node:vm'; import test from 'node:test'; import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../../src/frontend/bundle/assets/gamecowork-editor-installations.js', import.meta.url), 'utf8');
const context = vm.createContext({ Error });
vm.runInContext(source.replaceAll('export ', '') + '\nthis.api={createEditorInstallationsController,normalizeEditorInstallationSnapshot,editorInstallationCacheMessage};', context);
const { createEditorInstallationsController: create, editorInstallationCacheMessage: label } = context.api;
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a;reject=b; }); return {promise,resolve,reject}; };
const row = version => ({ path:'F:/own/Editor/Unity.exe',product:'unity',version,technicalVersion:version });
const dto = (version, extra={}) => ({ editors:version ? {[`unity:${version}:F:/own/Editor/Unity.exe`]:row(version)} : {},
  cache:{source:'persistent-cache',hasSnapshot:true,checkedAt:10,expiresAt:900010,stale:false,refreshing:false,error:null,...extra} });
const success = content => ({status:'success',content});
function controller(handler, options={}) {
  const updates=[], calls=[]; const api=create({messenger:{request:(kind,data)=>{calls.push({kind,data});return handler(kind,data);}}, normalize:value=>({...value}),local:true,
    onUpdate:value=>updates.push(value),...options});
  return {api,updates,calls,current:()=>updates.at(-1)};
}
test('Passive load uses cache DTO while explicit retry requests actual discovery',async()=>{
  const fixture=controller(async()=>success(dto('6000.0.1f1')));await fixture.api.read();await fixture.api.read(true);
  assert.equal(fixture.calls[0].kind,'tjhub/getEditorInstallations');assert.equal(fixture.calls[0].data.refresh,false);assert.equal(fixture.calls[1].data.refresh,true);
  assert.equal(fixture.current().rows[0].version,'6000.0.1f1');assert.equal(fixture.current().loading,false);
});
test('Warm rows never become a loading skeleton while explicit refresh is held',async()=>{
  const hold=deferred(),fixture=controller(()=>hold.promise,{initialRows:[row('old')],initialCache:dto('old').cache});const task=fixture.api.read(true);
  assert.equal(fixture.current().rows[0].version,'old');assert.equal(fixture.current().loading,false);assert.equal(fixture.current().busy,true);
  hold.resolve(success(dto('new',{checkedAt:20,source:'scan'})));await task;assert.equal(fixture.current().rows[0].version,'new');assert.equal(fixture.current().busy,false);
});
test('Scan error retains old rows and permits real retry instead of empty success',async()=>{
  let failed=true;const fixture=controller(async()=>failed?{status:'error',error:'own scanner unavailable'}:success(dto('new',{checkedAt:20})),{initialRows:[row('old')],initialCache:dto('old').cache});
  await fixture.api.read(true);assert.equal(fixture.current().rows[0].version,'old');assert.equal(fixture.current().cache.stale,true);assert.match(fixture.current().error,/unavailable/);
  failed=false;await fixture.api.read(true);assert.equal(fixture.current().rows[0].version,'new');assert.equal(fixture.current().error,null);
});
test('Real Changed event supersedes a late cached response without another RPC',async()=>{
  const hold=deferred(),fixture=controller(()=>hold.promise);const task=fixture.api.read(false);
  fixture.api.receive(dto('new',{checkedAt:20,source:'scan'}));hold.resolve(success(dto('old')));await task;
  assert.equal(fixture.current().rows[0].version,'new');assert.equal(fixture.calls.length,1);assert.equal(fixture.current().loading,false);
  fixture.api.receive(dto('stale',{checkedAt:5}));assert.equal(fixture.current().rows[0].version,'new');
});
test('Real background and identity failure metadata stay visible with existing rows',()=>{
  const fixture=controller(()=>Promise.resolve(success(dto('unused'))));const value=dto('known',{stale:true,refreshing:true,identityChanged:true});Object.values(value.editors)[0].installationAvailable=false;
  fixture.api.receive(value);assert.equal(fixture.current().rows[0].installationAvailable,false);assert.equal(fixture.current().busy,true);assert.match(label(fixture.current().cache),/文件信息发生变化/);
  fixture.api.receive(dto('known',{stale:true,error:'owned metadata error'}));assert.equal(fixture.current().rows.length,1);assert.match(label(fixture.current().cache),/保留上次/);
});
test('A newer successful event supersedes a late rejected HTTP request',async()=>{
  const hold=deferred(),fixture=controller(()=>hold.promise,{initialRows:[row('old')],initialCache:dto('old').cache});
  const task=fixture.api.read(true);fixture.api.receive(dto('fresh',{checkedAt:20,source:'scan'}));
  hold.reject(new Error('obsolete transport error'));await task;
  assert.equal(fixture.current().rows[0].version,'fresh');assert.equal(fixture.current().error,null);assert.equal(fixture.current().cache.stale,false);assert.equal(fixture.current().busy,false);
});
test('No-snapshot notification keeps initial loading until actual rows or error arrive',()=>{
  const fixture=controller(()=>Promise.resolve(success(dto(null))));fixture.api.receive(dto(null,{hasSnapshot:false,checkedAt:null,stale:true,refreshing:true}));
  assert.equal(fixture.current().rows,null);assert.equal(fixture.current().loading,true);
  fixture.api.receive(dto(null,{hasSnapshot:false,checkedAt:null,stale:true,error:'owned first scan failed'}));assert.equal(fixture.current().loading,false);assert.equal(fixture.current().rows,null);
});
test('Malformed DTO is an actionable failure and cannot replace warm rows',async()=>{
  const fixture=controller(async()=>success({editors:[],cache:{}}),{initialRows:[row('known')]});await fixture.api.read();
  assert.equal(fixture.current().rows[0].version,'known');assert.match(fixture.current().error,/格式无效/);assert.equal(fixture.current().loading,false);
});
test('Disposal rejects late result/event and preserves independent official route',async()=>{
  const hold=deferred(),fixture=controller(()=>hold.promise);const task=fixture.api.read();fixture.api.dispose();const count=fixture.updates.length;
  fixture.api.receive(dto('late'));hold.resolve(success(dto('late')));await task;assert.equal(fixture.updates.length,count);
  const official=controller(async()=>success({owned:row('official')}),{local:false});await official.api.read(true);assert.equal(official.calls[0].kind,'tjhub/getEditors');assert.equal(official.calls[0].data,undefined);
  official.api.receive(dto('local-only'));assert.equal(official.current().rows[0].version,'official');
});
test('Any mounted Editor consumer passively refreshes at actual expiry and rearms after the new snapshot',async()=>{
  let now=100,serial=0;const timers=new Map(),timerOptions={now:()=>now,setTimer:(callback,delay)=>{const id=++serial;timers.set(id,{callback,delay});return id;},clearTimer:id=>timers.delete(id)};
  const fixture=controller(async()=>success(dto(fixture.calls.length===1?'old':'new',{checkedAt:now,expiresAt:now+5000})),timerOptions);
  await fixture.api.read();assert.equal(fixture.calls.length,1);assert.equal(timers.size,1);assert.equal([...timers.values()][0].delay,5001);
  const scheduled=[...timers.values()][0];timers.clear();now=5101;scheduled.callback();await new Promise(setImmediate);
  assert.equal(fixture.calls.length,2);assert.equal(fixture.calls[1].data.refresh,false);assert.equal(fixture.current().rows[0].version,'new');
  assert.equal(timers.size,1);assert.equal([...timers.values()][0].delay,5001);
  fixture.api.dispose();assert.equal(timers.size,0);
});
test('Refreshing/error snapshots stop automatic expiry requests until an actual successful retry',async()=>{
  let serial=0;const timers=new Map();const fixture=controller(async()=>success(dto('recovered',{expiresAt:9000})),{now:()=>100,setTimer:(callback,delay)=>{const id=++serial;timers.set(id,{callback,delay});return id;},clearTimer:id=>timers.delete(id)});
  fixture.api.receive(dto('old',{expiresAt:5000}));assert.equal(timers.size,1);
  fixture.api.receive(dto('old',{expiresAt:5000,refreshing:true}));assert.equal(timers.size,0);
  fixture.api.receive(dto('old',{expiresAt:5000,error:'scan failed',stale:true}));assert.equal(timers.size,0);assert.equal(fixture.calls.length,0);
  await fixture.api.read(true);assert.equal(timers.size,1);assert.equal(fixture.current().error,null);fixture.api.dispose();
});
for(const file of ['TJHubRoute-D42CgVct.js','TJHubRoute-DN1YDDd-.js'])test(file+' actual pane wires passive boot, real Changed events and explicit scan without project coupling',()=>{
  const text=fs.readFileSync(new URL('../../src/frontend/bundle/assets/'+file,import.meta.url),'utf8');
  assert.match(text,/createEditorInstallationsController/);assert.match(text,/Ke\("tjhub\/editorInstallationsChanged", value => gamecoworkInstalledController.receive\(value\)/);
  assert.match(text,/Promise\.all\(\[O\(\), Q\(\)\]\)/);assert.match(text,/const Q = n.useCallback\(refresh => gamecoworkInstalledController.read\(refresh === !0\)/);
  assert.match(text,/disabled: gamecoworkInstalledBusy, onClick: \(\) => void Q\(!0\)/);assert.doesNotMatch(text,/onClick: \(\) => void Promise\.all\(\[O\(\), Q\(\)\]\)/);
  assert.match(text,/'?"?gamecowork-editor-unavailable/);assert.match(text,/gamecowork-editors-cache-status/);assert.match(text,/k\(state.loading\)/);
  assert.match(text,/Ke\("tjhub\/editorInstallationsChanged", value => gamecoworkProjectEditors.receive\(value\)/);
  assert.match(text,/void gamecoworkProjectEditors.read\(\)/);assert.match(text,/gamecoworkProjectEditors.dispose\(\)/);
  assert.doesNotMatch(text,/gamecoworkInstalledCache\.expiresAt - Date\.now/);
});
