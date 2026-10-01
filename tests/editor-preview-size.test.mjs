// Execute the actual shipped sizing and composite sizing paths. The inert canvas
// only records allocation; real JPEG/ROI/input proof lives in the product E2E.
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const root=fileURLToPath(new URL("../restored/frontend/dist-beautified/",import.meta.url));
const frames=fs.readFileSync(root+"assets/gamecowork-image-frames.js","utf8").replaceAll("\r\n","\n");
const html=fs.readFileSync(root+"windowBridge.html","utf8").replaceAll("\r\n","\n");
function canvas(){return{width:0,height:0,dataset:{},style:{},getContext:()=>({fillRect(){},strokeRect(){},fillText(){},drawImage(){}})};}
function runtime(fetch=()=>assert.fail("Sizing contract must never access a real network")){
  const window={},context=vm.createContext({window,document:{createElement:()=>canvas()},fetch,AbortSignal,URL,Map,Set,JSON,Number,Math,setTimeout,clearTimeout});
  vm.runInContext(frames,context);
  assert.equal(typeof window.GameCoworkCaptureSize,"function","Shipped global sizing helper is installed");
  return{window,context,size:value=>JSON.parse(JSON.stringify(window.GameCoworkCaptureSize(value)))};
}
const sizing=runtime();
const bounds=value=>{assert.ok(Number.isInteger(value.width)&&value.width>=16&&value.width<=1920);assert.ok(Number.isInteger(value.height)&&value.height>=16&&value.height<=1080);assert.ok(Number.isFinite(value.dpr)&&value.dpr>=.5&&value.dpr<=4);};
test("Actual helper fits landscape and 4K portrait with a shared scale",()=>{
  for(const [input,expected]of[
    [{width:3840,height:2160,dpr:1},{width:1920,height:1080,dpr:1}],
    [{width:2160,height:3840,dpr:2},{width:607,height:1080,dpr:2}],
    [{width:2560,height:1369,dpr:1},{width:1920,height:1026,dpr:1}],
    [{width:400,height:1700,dpr:1},{width:254,height:1080,dpr:1}],
    [{width:8192,height:8192,dpr:4},{width:1080,height:1080,dpr:4}],
  ]){const output=sizing.size(input);assert.deepEqual(output,expected);bounds(output);const sx=output.width/input.width,sy=output.height/input.height;assert.ok(Math.abs(sx-sy)<=Math.max(1/input.width,1/input.height),"Only floor rounding differs between both fitted axes");}
});
test("Browser DPR remains independent from backing resolution",()=>{
  for(const dpr of[.5,1,1.25,2,3,4,8]){
    const output=sizing.size({width:640,height:480,dpr});
    assert.equal(output.width,640);assert.equal(output.height,480);assert.equal(output.dpr,Math.max(.5,Math.min(4,dpr)));
  }
});
test("Fractions floor and every positive preview allocation has the 16 pixel minimum",()=>{
  assert.deepEqual(sizing.size({width:641.9,height:359.4,dpr:1.5}),{width:641,height:359,dpr:1.5});
  for(const width of[.01,.5,1,15.9,16,16.9])for(const height of[.01,1,15.9,16,16.9]){
    const output=sizing.size({width,height,dpr:1});bounds(output);assert.equal(output.width,Math.max(16,Math.floor(width)));assert.equal(output.height,Math.max(16,Math.floor(height)));
  }
  bounds(sizing.size({width:1,height:16384,dpr:1}));
  bounds(sizing.size({width:16384,height:1,dpr:1}));
});
test("Nonfinite, missing, zero and negative dimensions fail before allocation",()=>{
  for(const bad of[NaN,Infinity,-Infinity,undefined,null,0,-1])
    for(const input of[{width:bad,height:480,dpr:1},{width:640,height:bad,dpr:1}])
      assert.throws(()=>sizing.size(input),/尚未显示/);
});
test("DPR invalid values have a finite default and legal finite values clamp",()=>{
  for(const dpr of[NaN,Infinity,-Infinity,undefined,null,0,-1])
    assert.equal(sizing.size({width:640,height:480,dpr}).dpr,1);
  assert.equal(sizing.size({width:640,height:480,dpr:.1}).dpr,.5);
  assert.equal(sizing.size({width:640,height:480,dpr:99}).dpr,4);
});
function method(name){
  const begin=html.indexOf("        function "+name+"("),end=html.indexOf("\n        }",begin);
  assert.ok(begin>=0&&end>begin,"Actual HTML method exists: "+name);
  return html.slice(begin,end)+"\n        }";
}
test("Main-area start and composite update use the same bounded CSS size",()=>{
  const fps=html.match(/const STREAM_FPS\s*=\s*\d+;/)?.[0];assert.ok(fps,"Actual HTML FPS declaration exists");
  const context=vm.createContext({window:{devicePixelRatio:2,GameCoworkCaptureSize:sizing.window.GameCoworkCaptureSize},
    $:()=>({getBoundingClientRect:()=>({width:2560,height:1800})}),imageFrameTransport:true,
    compositeLayout:{slots:[],layoutPreset:"",focusedSlotId:""},imageCompositeId:"contract",
    resolveCompositeApplyMode:()=>"replace",log(){}});
  vm.runInContext(fps+method("getMainAreaSizeForStream")+method("buildCompositeRequestPayload"),context);
  const start=JSON.parse(JSON.stringify(context.getMainAreaSizeForStream())),update=JSON.parse(JSON.stringify(context.buildCompositeRequestPayload({width:2560,height:1800,dpr:2},"update")));
  bounds(start);assert.equal(start.width,1536);assert.equal(start.height,1080);assert.equal(start.dpr,2);
  assert.equal(update.width,start.width);assert.equal(update.height,start.height);assert.equal(update.dpr,start.dpr);assert.ok(update.fps>=1&&update.fps<=30);
});
test("Resize flush cannot send an unbounded CSS allocation or browser DPR",async()=>{
  const requests=[];
  const context=vm.createContext({window:{devicePixelRatio:8,GameCoworkCaptureSize:sizing.window.GameCoworkCaptureSize},
    imageMultiProjectFrames:null,capturing:true,pendingResizeW:3840,pendingResizeH:2160,lastSentResizeW:0,lastSentResizeH:0,lastSentResizeDpr:0,
    imageFrameTransport:true,activeOffscreenWindowType:"single",imageCompositeId:"contract",compositeLayout:null,
    apiFetch:async(route,options)=>{requests.push({route,body:JSON.parse(options.body)});return{ok:true};},showImageStatus(){}});
  vm.runInContext(method("flushPendingResize"),context);context.flushPendingResize();await Promise.resolve();
  assert.equal(requests[0].route,"/stream/resize");assert.deepEqual(requests[0].body,{width:1920,height:1080,dpr:4});
  context.flushPendingResize();await Promise.resolve();assert.equal(requests.length,1,"Same large CSS allocation deduplicates after normalization");
  context.pendingResizeW=7680;context.pendingResizeH=4320;context.flushPendingResize();await Promise.resolve();assert.equal(requests.length,1,"Different large CSS dimensions producing the same backing size do not restart the capture");
  context.window.devicePixelRatio=2;context.flushPendingResize();await Promise.resolve();assert.equal(requests.length,2,"An independent DPR change triggers resize");assert.equal(requests[1].body.dpr,2);
});
test("Multi-project ResizeObserver flush shares the normalized dedupe and preserves DPR changes",async()=>{
  const requests=[],context=vm.createContext({window:{devicePixelRatio:2,GameCoworkCaptureSize:sizing.window.GameCoworkCaptureSize},
    imageMultiProjectFrames:{layout:{},start:async(layout,size)=>requests.push(size)},capturing:true,compositeLayout:{},
    lastSentResizeW:0,lastSentResizeH:0,lastSentResizeDpr:0,getMainAreaSizeForStream:()=>sizing.size({width:2560,height:1800,dpr:context.window.devicePixelRatio}),showImageStatus(){}});
  vm.runInContext(method("flushPendingResize"),context);context.flushPendingResize();await Promise.resolve();
  context.flushPendingResize();await Promise.resolve();assert.equal(requests.length,1);
  assert.deepEqual(JSON.parse(JSON.stringify(requests[0])),{width:1536,height:1080,dpr:2});
  context.window.devicePixelRatio=1.5;context.flushPendingResize();await Promise.resolve();assert.equal(requests.length,2);assert.equal(requests[1].dpr,1.5);
});
test("Multi-project POST, response model and actual composite canvas allocate the same normalized size",async()=>{
  const requests=[],received=[],stageCanvas=canvas(),{window}=runtime(async(url,options)=>{
    assert.ok(url.endsWith("/stream/start-composite"));const request=JSON.parse(options.body);requests.push(request);
    const response={width:request.width,height:request.height,slots:request.slots.map(slot=>({...slot,supported:false,reason:"Contract sizing only"}))};
    received.push(response);return{ok:true,json:async()=>response};
  });
  const multi=new window.GameCoworkMultiProjectFrames({canvas:stageCanvas,compositeId:"sizing-contract",status(){},error:assert.fail});
  multi.endpoint=async()=>"http://127.0.0.1/contract";
  const layout={focusedSlotId:"A",slots:[{workspaceKey:"fixture-A",workspaceRoot:"F:/isolated/A",slotId:"A",windowType:"ContractUnsupported",rect:{x:0,y:0,w:1,h:1}}]};
  for(const size of[{width:2560,height:1800,dpr:2},{width:2160,height:3840,dpr:8},{width:640,height:480,dpr:1}]){
    await multi.start(layout,size);
    const request=requests.at(-1),response=received.at(-1),expected=sizing.size(size);bounds(request);
    assert.equal(stageCanvas.width,request.width);assert.equal(stageCanvas.height,request.height);
    assert.equal(stageCanvas.width,response.width);assert.equal(stageCanvas.height,response.height);
    assert.deepEqual({width:stageCanvas.width,height:stageCanvas.height,dpr:request.dpr},expected);
    assert.ok(request.fps>=1&&request.fps<=30);assert.equal(stageCanvas.dataset.frameState,"disconnected","Inert contract never claims a rendered frame");
  }
});
test("Identical normalized layout events retain actual reader objects and avoid replacing captures",async()=>{
  const requests=[],{window}=runtime(async(url,options)=>{
    if(url.endsWith("/stream/stop"))return{ok:true,json:async()=>({})};
    assert.ok(url.endsWith("/stream/start-composite"));const request=JSON.parse(options.body);requests.push(request);
    return{ok:true,json:async()=>({width:request.width,height:request.height,slots:request.slots.map(slot=>({...slot,supported:true,streamId:"contract:"+slot.slotId}))})};
  });
  // Only the asynchronous JPEG consumer is paused in this structural contract;
  // its real constructor/identity and the actual coordinator/reconcile run.
  // Real decode and input remain mandatory in the owned Editor product E2E.
  window.GameCoworkImageFrames.prototype.start=function(){this.active=true;};
  const multi=new window.GameCoworkMultiProjectFrames({canvas:canvas(),compositeId:"signature-contract",status(){},error:assert.fail});
  multi.endpoint=async()=>"http://127.0.0.1/contract";
  const layout={focusedSlotId:"A",slots:[{workspaceKey:"fixture-A",workspaceRoot:"F:/isolated/A",slotId:"A",windowType:"UnityEditor.SceneHierarchyWindow",rect:{x:0,y:0,w:1,h:1}}]};
  await multi.start(layout,{width:3840,height:2160,dpr:2});const reader=multi.composite.runners[0].runner,array=multi.composite.runners;
  await multi.start(JSON.parse(JSON.stringify(layout)),{width:7680,height:4320,dpr:2});
  assert.equal(requests.length,1,"A cloned layout with identical normalized size sends no second start");
  assert.equal(multi.composite.runners,array);assert.equal(multi.composite.runners[0].runner,reader);
  await multi.start(layout,{width:640,height:480,dpr:2});assert.equal(requests.length,2,"A real backing resize sends a new capture request");
  const changed=JSON.parse(JSON.stringify(layout));changed.slots[0].rect.w=.5;
  await multi.start(changed,{width:640,height:480,dpr:2});assert.equal(requests.length,3,"Changing the actual slot rect applies a new layout");
  await multi.stop();await multi.start(changed,{width:640,height:480,dpr:2});assert.equal(requests.length,4,"Stop/reopen never deduplicates away a fresh capture start");
  assert.notEqual(multi.composite.runners[0].runner,reader,"Reopened preview owns a new real reader object");await multi.stop();
});
