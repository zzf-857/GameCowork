import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const directory=fileURLToPath(new URL('../../src/frontend/bundle/assets/',import.meta.url));
const tick=()=>new Promise(resolve=>setImmediate(resolve));
for(const name of ['RightSideBarPanel-JSPvAs5c.js','RightSideBarPanel-B2OWNNNX.js']){
 const source=fs.readFileSync(directory+name,'utf8');
 const hi=source.slice(source.indexOf('    hi = (Me) =>',source.indexOf('controlRequest = T.useRef'))+9,source.indexOf(',\n    Kn = (Me) =>',source.indexOf('controlRequest = T.useRef')));
 const lrStart=source.indexOf('    lr = () => {',source.indexOf('controlRequest = T.useRef'));
 const lr=source.slice(lrStart+9,source.indexOf(',\n    Kr = () =>',lrStart));
 test(name+': refresh acknowledgement ignores passive, foreign and obsolete control replies',async()=>{
  const listeners=new Set(),timers=new Set(),window={location:{origin:'http://127.0.0.1:34567'},addEventListener:(_,listener)=>listeners.add(listener),removeEventListener:(_,listener)=>listeners.delete(listener)};
  let sent,resolved=false;const context={window,workspaceKey:'owned-A',e:'F:/owned-A',previewEpoch:{current:7},zr:value=>{sent=value;},setTimeout:callback=>{timers.add(callback);return callback;},clearTimeout:timer=>timers.delete(timer)};
  const fn=vm.runInNewContext('('+hi+')',context);const promise=fn({action:'refresh'}).then(result=>{resolved=true;return result;});
  const emit=(data,extra={})=>{for(const listener of [...listeners])listener({source:window,origin:window.location.origin,data:{source:'tauriShell',messageType:'shell/unityGameControlResult',data:{workspaceKey:'owned-A',workspaceRoot:'F:/owned-A',requestGeneration:7,...data}},...extra});};
  emit({requestId:'passive-state',action:'get_state',success:true});emit({requestId:sent.requestId,action:'play',success:true});emit({requestId:sent.requestId,action:'refresh',success:true,workspaceKey:'owned-B'});emit({requestId:sent.requestId,action:'refresh',success:true},{source:{}});await tick();assert.equal(resolved,false);
  emit({requestId:sent.requestId,action:'refresh',success:true});const result=await promise;assert.equal(result.action,'refresh');assert.equal(listeners.size,0);assert.equal(timers.size,0);
 });
 for(const outcome of ['success','failure','timeout','exception'])test(name+': Play waits for successful refresh ('+outcome+')',async()=>{
  const calls=[],modes=[],pending=[],phases=[],ref={current:null};let complete,reject;
  const refresh=new Promise((resolve,no)=>{complete=resolve;reject=no;});
  const context={Te:false,controlRequest:ref,we:'stopped',zr:value=>calls.push(value),ae:{current:false},Kn:value=>calls.push(value),xe:value=>phases.push(value),be:()=>{},Ve:()=>{},Ne:value=>pending.push(value),Be:{current:null},fe:value=>modes.push(value),l:value=>value,hi:()=>refresh,setTimeout:()=>1,clearTimeout:()=>{}};
  const fn=vm.runInNewContext('('+lr+')',context);fn();assert.deepEqual(calls,[]);assert.deepEqual(modes,[],'No optimistic Play Mode before actual control');assert.equal(pending[0],true);
  if(outcome==='success')complete({success:true,hasErrors:false,errors:0});else if(outcome==='failure')complete({success:false});else if(outcome==='timeout')complete(null);else reject(new Error('real refresh failure'));
  await tick();if(outcome==='success')assert.deepEqual(calls.map(value=>value.action),['play']);else{assert.deepEqual(calls,[]);assert.ok(phases.includes('failed'));}
 });
}
