// Actual receiver logic with protocol fixtures. This does not prove editor pixels.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
const source=fs.readFileSync(new URL("../restored/frontend/dist-beautified/assets/gamecowork-image-frames.js",import.meta.url),"utf8");
function fixture(){
  const canvas={width:64,height:64,style:{},dataset:{},getContext:()=>({drawImage(){}})},errors=[],window={};let response;
  const ctx=vm.createContext({window,AbortController,Blob,Date,JSON,Number,createImageBitmap:async()=>({width:64,height:64,close(){}}),setTimeout:()=>1,clearTimeout(){}});vm.runInContext(source,ctx);
  const runner=new window.GameCoworkImageFrames({canvas,request:async()=>response,status(){},error:value=>errors.push(value),refresh(){}});runner.active=true;runner.streamId="own";
  function frame(epoch,revision,id=1){const headers=new Headers({"content-type":"image/jpeg","X-GameCowork-Stream-Id":"own","X-GameCowork-Frame-Id":String(id),"X-GameCowork-Frame-Width":"64","X-GameCowork-Frame-Height":"64","X-GameCowork-Capture-Epoch":epoch,"X-GameCowork-Geometry-Revision":String(revision),"X-GameCowork-Instance-Id":"-42"});response={status:200,ok:true,headers,body:{getReader:()=>({read:async()=>({done:true}),cancel:async()=>{},releaseLock(){}}),cancel:async()=>{}}};return response;}
  return{runner,canvas,errors,frame};
}
test("Displayed frame identity survives normal sequence advancement and changes on a reused stream",async()=>{
 const f=fixture(),a="a".repeat(32),b="b".repeat(32);f.frame(a,1,5);await f.runner.poll(0);assert.equal(f.runner.lastId,5);
 f.runner.inputBusy=true;f.runner.sendInput({type:"mousedown",x:20,y:20,captureEpoch:b,geometryRevision:99,instanceId:1});const queued=f.runner.inputs[0];assert.equal(queued.captureEpoch,a);assert.equal(queued.geometryRevision,1);assert.equal(queued.instanceId,-42);
 f.frame(a,1,6);await f.runner.poll(0);assert.equal(f.runner.inputs.length,1);assert.equal(queued.geometryRevision,1);
 f.frame(a,2,7);await f.runner.poll(0);assert.equal(f.runner.inputs.length,0);assert.equal(f.runner.geometryRevision,2);
 f.frame(b,1,1);await f.runner.poll(0);assert.equal(f.runner.lastId,1);assert.equal(f.canvas.dataset.captureEpoch,b);assert.equal(f.canvas.dataset.instanceId,"-42");assert.deepEqual(f.errors,[]);
});
test("Malformed capture identity never replaces the displayed frame or input identity",async()=>{
 const f=fixture(),epoch="a".repeat(32);f.frame(epoch,1);await f.runner.poll(0);
 for(const mutate of[r=>r.headers.delete("X-GameCowork-Capture-Epoch"),r=>r.headers.set("X-GameCowork-Geometry-Revision","0"),r=>r.headers.delete("X-GameCowork-Instance-Id"),r=>r.headers.set("X-GameCowork-Instance-Id","0"),r=>r.headers.set("X-GameCowork-Instance-Id","2147483648")]){const r=f.frame(epoch,2,2);mutate(r);await f.runner.poll(0);assert.equal(f.runner.lastId,1);assert.equal(f.runner.geometryRevision,1);assert.equal(f.canvas.dataset.captureEpoch,epoch);}
 assert.equal(f.errors.length,5);
});
