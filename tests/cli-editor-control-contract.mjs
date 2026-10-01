import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const source=fs.readFileSync(new URL('../restored/cli-gamecowork/cli-main.beautified.js',import.meta.url),'utf8');
const start=source.indexOf('    var gcwEditorControlClientId;'),end=source.indexOf('    var mQ,',start);assert.ok(start>0&&end>start);
const normalize=value=>String(value).replaceAll('\\','/').toLowerCase();
function fixture(responses=[]){
 let root='F:/contract/project',connected=true,connects=0;const calls=[];
 const client={normalizeProjectRootPath:normalize,isConnected:()=>connected,handshakeProjectRoot:root,editorControlCancellation:true,editorControlDomain:'a'.repeat(32),connect:async()=>{connects++;connected=true;}};
 const abort=signal=>{if(signal?.aborted){const error=new Error('aborted');error.name='AbortError';throw error;}};
 const context=vm.createContext({require,Buffer,process:{env:{}},Date,JSON,Error,AbortController,setTimeout,clearTimeout,
  ks:{getProjectRoot:()=>root},r_:abort,zg:()=>Object.assign(new Error('aborted'),{name:'AbortError'}),eUa:async(_,signal)=>abort(signal),
  tC:async(command,params,options)=>{calls.push({command,params,options});const next=responses.shift();if(next instanceof Error){connected=false;throw next;}return {success:true,data:next};}});
 vm.runInContext(source.slice(start,end),context);
 const make=(params={action:'play'},signal)=>context.gcwEditorControlContext(params,client,signal);
 return {context,make,calls,get connects(){return connects;},setRoot:value=>root=value};
}
const state=(extra={})=>({operationId:'own-op',controlAction:'play',projectRoot:'F:/contract/project',pending:true,controlStatus:'pending',playMode:'stopped',isCompiling:false,isUpdating:false,...extra});
test('Actual helper waits for completed state and polls only the original read query',async()=>{
 const f=fixture([state(),state({pending:false,controlStatus:'completed',playMode:'playing'})]),ctx=f.make();
 try{const result=await f.context.gcwAwaitEditorControl(ctx,state());assert.equal(result.pending,false);assert.equal(f.calls.length,2);assert.ok(f.calls.every(call=>call.command==='manage_editor'&&call.params.action==='get_state'&&call.options.maxConnectRetries===1));assert.ok(f.calls.every(call=>call.options.controlIdentity.requestId===ctx.requestId));}finally{ctx.dispose();}
});
test('Actual helper reconnects a known reload without resending the original effect',async()=>{
 const f=fixture([new Error('Editor bridge is reloading'),state({pending:false,controlStatus:'completed',playMode:'playing'})]),ctx=f.make();
 try{await f.context.gcwAwaitEditorControl(ctx,state());assert.equal(f.connects,1);assert.ok(f.calls.every(call=>call.params.action==='get_state'));}finally{ctx.dispose();}
});
test('Actual helper rejects mismatched root or operation identity and false target completion',async()=>{
 for(const wrong of [state({projectRoot:'F:/other'}),state({operationId:'other-op'}),state({controlAction:'stop'}),state({pending:false,controlStatus:'completed',playMode:'stopped'})]){
  const f=fixture(),ctx=f.make();ctx.operationId='own-op';try{await assert.rejects(f.context.gcwAwaitEditorControl(ctx,wrong),/identity|actual state/);}finally{ctx.dispose();}
 }
});
test('Actual helper freezes origin and stops before dispatch after caller cancellation',async()=>{
 const f=fixture(),controller=new AbortController(),ctx=f.make({action:'play'},controller.signal);controller.abort();
 try{await assert.rejects(f.context.gcwAwaitEditorControl(ctx,state()),/aborted/);assert.equal(f.calls.length,0);}finally{ctx.dispose();}
 const g=fixture(),other=g.make();g.setRoot('F:/other');try{await assert.rejects(g.context.gcwAwaitEditorControl(other,state()),/project changed/);assert.equal(g.calls.length,0);}finally{other.dispose();}
});
test('Actual helper enforces finite budget and single-frame real advancement',async()=>{
 const f=fixture();for(const seconds of [0,181,1.5,'30'])assert.throws(()=>f.make({action:'play',timeoutSeconds:seconds}),/1\.\.180/);
 const ctx=f.make({action:'resume',singleFrame:true});ctx.operationId='own-op';try{await assert.rejects(f.context.gcwAwaitEditorControl(ctx,state({controlAction:'resume',pending:false,controlStatus:'completed',playMode:'paused',runtimeFrame:10,startFrame:10})),/actual state/);ctx.deadline=Date.now()-1;await assert.rejects(f.context.gcwAwaitEditorControl(ctx,state()),/budget expired/);}finally{ctx.dispose();}
});
