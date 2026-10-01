import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import {fileURLToPath} from "node:url";
const front=fileURLToPath(new URL("../../src/frontend/bundle/",import.meta.url));
for(const [name,rootName,message]of[["index-BRxZ4eG7.js","F","De"],["index-DvRYaIVa.js","U","He"]]){
  const source=fs.readFileSync(front+"/assets/"+name,"utf8");
  test(name+": actual stream handler rejects old-project, foreign-source and stale-generation messages",()=>{
    const start=source.indexOf('        const streamScoped = '),end=source.indexOf('\n        const ft = ',start);assert.ok(start>=0&&end>start);
    const window={location:{origin:"http://127.0.0.1:31001"}},epochs=new Map();
    const handler=vm.runInNewContext(`xe=>{const ${message}=xe.data;${source.slice(start,end)}return true;}`,{window,Rt:{current:"B"},[rootName]:"F:/own/B",Su:value=>String(value).replaceAll("\\","/").toLowerCase(),previewRequestEpochs:{current:epochs}});
    const event=scope=>({source:window,origin:window.location.origin,data:{messageType:"shell/openUnityWindowInPreview",data:scope}}),valid={workspaceKey:"B",workspaceRoot:"F:/own/B",requestGeneration:2};
    assert.equal(handler(event({...valid,workspaceKey:"A"})),undefined);assert.equal(handler({...event(valid),source:{}}),undefined);assert.equal(handler({...event(valid),origin:"https://outside.invalid"}),undefined);assert.equal(handler(event({...valid,workspaceRoot:"F:/own/A"})),undefined);assert.equal(handler(event(valid)),true);assert.equal(handler(event({...valid,requestGeneration:1})),undefined);assert.equal(handler(event({...valid,requestGeneration:3})),true);
  });
  test(name+": actual awaited URL resolver aborts after same-project stop or workspace switch",async()=>{
    const start=source.indexOf('    Uc = d.useCallback(async (scope) => {'),end=source.indexOf('\n    Yn = ',start);assert.ok(start>=0&&end>start);
    let release,calls=0;const epochs=new Map([["A",0]]),key={current:"A"};
    const context={d:{useCallback:fn=>fn},Ne:{current:true},Rt:key,[rootName]:"F:/own/A",Su:value=>value,previewRequestEpochs:{current:epochs},vn:()=>({workspaceKey:"A"}),f:{request:async()=>{calls++;return new Promise(resolve=>release=resolve);}},setTimeout};
    const resolve=vm.runInNewContext(source.slice(start,end).trim().replace(/^Uc = /,"").replace(/,$/,""),context);
    await assert.rejects(resolve({workspaceKey:"B",workspaceRoot:"F:/own/B",requestGeneration:0}),/Workspace changed/);assert.equal(calls,0);
    const stopped=resolve({workspaceKey:"A",workspaceRoot:"F:/own/A",requestGeneration:0});epochs.set("A",1);release({status:"success",content:{signalingUrl:"http://127.0.0.1:1234/local/a"}});await assert.rejects(stopped,/Workspace changed/);
    const switched=resolve({workspaceKey:"A",workspaceRoot:"F:/own/A",requestGeneration:1});key.current="B";release({status:"success",content:{signalingUrl:"http://127.0.0.1:1234/local/a"}});await assert.rejects(switched,/Workspace changed/);
  });
}
const html=fs.readFileSync(front+"/windowBridge.html","utf8");
test("Actual debounced key release cannot cross a capture generation or cancel a replacement timer",()=>{
  const start=html.indexOf('          document.addEventListener("keyup", (e) => {'),end=html.indexOf('          // Flush held keys when the page',start);assert.ok(start>0&&end>start);
  const timers=new Map(),inputs=[];let handler,sequence=0;const ctx=vm.createContext({document:{activeElement:null,addEventListener:(_name,fn)=>handler=fn},frontendHeldKeys:new Set(),pendingKeyupTimers:new Map(),capturing:true,imageStreamGeneration:1,KEYUP_DEBOUNCE_MS:60,setTimeout:fn=>{timers.set(++sequence,fn);return sequence;},clearTimeout(){},sendInput:value=>inputs.push(value)});
  vm.runInContext(html.slice(start,end),ctx);const event={key:"Control",code:"ControlLeft",ctrlKey:true};handler(event);const old=timers.get(1);ctx.imageStreamGeneration=2;old();assert.equal(inputs.length,0);
  handler(event);const replaced=timers.get(2);handler(event);replaced();assert.equal(ctx.pendingKeyupTimers.get("Control"),3);assert.equal(inputs.length,0);timers.get(3)();assert.equal(inputs.length,1);assert.equal(inputs[0].key,"Control");
});
test("Actual stream switch validates options before invalidating an active or queued capture",async()=>{
  const start=html.indexOf('        async function switchStream('),end=html.indexOf('        // =================== Parent panel',start);
  const calls=[],errors=[];let release;const ctx=vm.createContext({imageStreamGeneration:3,serverStoppedStream:false,autoWindowType:"old",autoWindowOptions:{},switchBusy:false,capturing:false,activeOffscreenWindowType:"old",log(){},showImageStatus:value=>errors.push(value),autoStartOffscreen:async()=>{calls.push({...ctx.autoWindowOptions});await new Promise(resolve=>release=resolve);}});
  vm.runInContext(html.slice(start,end),ctx);
  const first=ctx.switchStream("UnityEditor.InspectorWindow",{captureMode:"editor-window",instanceId:-42});await Promise.resolve();
  await ctx.switchStream("invalid",{captureMode:"unsupported"});assert.equal(ctx.autoWindowType,"UnityEditor.InspectorWindow");assert.equal(ctx.imageStreamGeneration,4);
  await ctx.switchStream("invalid",{instanceId:2147483648});assert.equal(ctx.imageStreamGeneration,4);
  await ctx.switchStream("UnityEditor.InspectorWindow",{captureMode:"editor-window",instanceId:-43});release();await new Promise(setImmediate);
  assert.equal(calls.length,2);assert.equal(calls[0].instanceId,-42);assert.equal(calls[1].instanceId,-43);release();await first;assert.equal(ctx.switchBusy,false);assert.equal(errors.length,2);
});
const helper=html.slice(html.indexOf('        async function discardStaleComposite('),html.indexOf('        async function startCompositeLayout('));
for(const mode of["start","update"]){
  test("Actual composite "+mode+" discards late response and stops only its old captured endpoint",async()=>{
    const marker=mode==="start"?'        async function startCompositeLayout(':'        async function updateCompositeLayout(',next=mode==="start"?'        async function updateCompositeLayout(':'        // Starts (or restarts) offscreen capture';
    const fn=html.slice(html.indexOf(marker),html.indexOf(next,html.indexOf(marker)));let release,started=0;const stopped=[];
    const ctx=vm.createContext({API:"http://127.0.0.1:1234/own-a",imageFrameTransport:true,imageCompositeId:"owned-receiver",imageStreamGeneration:0,serverStoppedStream:false,_compositeStarting:false,compositeLayout:{slots:[{slotId:"actual"}]},capturing:mode==="update",activeOffscreenWindowType:mode==="update"?"__composite__":"",checkHealth:async()=>{},getMainAreaSizeForStream:()=>({width:320,height:240}),buildCompositeRequestPayload:()=>({}),fetchJson:async()=>new Promise(resolve=>release=resolve),fetch:async(url,options)=>stopped.push({url,body:JSON.parse(options.body)}),AbortSignal,activeCompositeSlotId:"",currentWindowType:"",log(){},placeholder:{style:{}},startHeartbeat(){},startWebRTC:async()=>{started++;},trackWebRTCFps(){},startCompositeImageFrames:()=>{started++;},showImageStatus(){},notifyParentStreamStatus(){}});
    vm.runInContext(helper+fn,ctx);const pending=mode==="start"?ctx.startCompositeLayout():ctx.updateCompositeLayout();await new Promise(setImmediate);assert.equal(typeof release,"function");ctx.imageStreamGeneration++;ctx.serverStoppedStream=true;ctx.API="http://127.0.0.1:9999/own-b";release({slots:[],transport:"image-frames"});await pending;assert.equal(started,0);assert.equal(stopped.length,1);assert.equal(stopped[0].url,"http://127.0.0.1:1234/own-a/stream/stop");assert.deepEqual(stopped[0].body,{compositeId:"owned-receiver"});
  });
}
for(const name of["RightSideBarPanel-B2OWNNNX.js","RightSideBarPanel-JSPvAs5c.js"]){
  test(name+": layout save consumes only its captured iframe snapshot",()=>{
    const source=fs.readFileSync(front+"/assets/"+name,"utf8"),start=source.indexOf('        function Qe(bt) {',source.indexOf('    Tn = ')),end=source.indexOf('\n        }',start)+10;assert.ok(start>=0&&end>start);const frame={},other={},received=[];const ctx=vm.createContext({We:frame,window:{location:{origin:"http://127.0.0.1:31001"},clearTimeout(){},removeEventListener(){}},Pe:1,Me:slots=>received.push(slots)});vm.runInContext(source.slice(start,end),ctx);const msg={source:frame,origin:"http://127.0.0.1:31001",data:{source:"unityWindowBridge",messageType:"unity-window/composite-layout-snapshot",data:{slots:[{slotId:"A"}]}}};ctx.Qe({...msg,source:other});ctx.Qe({...msg,origin:"https://outside.invalid"});assert.equal(received.length,0);ctx.Qe(msg);assert.equal(received.length,1);
  });
}
