// Actual main desktop/GUI -> Sidebar menus -> Rust/Core -> own Editor -> shipped
// WindowBridge canvas. No standalone wrapper, fake frames, model Provider, user
// project, or original executable is used. Existing Editor licensing only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {randomUUID,createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {readEditorIdentity,prepareEngineFixture} from './editor-engine-fixture.mjs';
import {connectEditor} from './editor-test-support.mjs';
const repo=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2),option=(name,value)=>args.includes(name)?args[args.indexOf(name)+1]:value;
const exec=promisify(execFile),delay=ms=>new Promise(resolve=>setTimeout(resolve,ms)),sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const numberOption=(name,fallback,min,max,integer=false)=>{const value=Number(option(name,fallback));assert.ok(Number.isFinite(value)&&value>=min&&value<=max&&(!integer||Number.isInteger(value)),name+' must be '+(integer?'an integer ':'')+'between '+min+' and '+max);return value;};
const viewport={width:numberOption('--viewport-width',1600,480,8192,true),height:numberOption('--viewport-height',1000,480,8192,true)},browserDpr=numberOption('--dpr',1,.5,8);
const resizeViewport=args.includes('--resize-width')||args.includes('--resize-height')?{width:numberOption('--resize-width',1280,480,8192,true),height:numberOption('--resize-height',900,480,8192,true)}:null;
const packaged=args.includes('--packaged'),previous=args.includes('--previous'),app=path.resolve(option('--app-root',path.join(repo,'app')));
const run=path.resolve(option('--output','F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-generic-product-'+randomUUID())),project=path.join(run,'project');
assert.ok(run.replaceAll('\\','/').toLowerCase().startsWith('f:/ai/agentmake/temp/gamecowork/tests/editor-bridge-generic-product-'));assert.equal(fs.existsSync(run),false,'Use a fresh unique owned fixture');
const editor=path.resolve(option('--editor','F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe')),identity=readEditorIdentity(editor);
const binary=path.resolve(option('--binary',packaged?path.join(app,'GameCowork.exe'):path.join(repo,'restored/shell/target/debug/GameCowork.exe'))),frontend=packaged?path.join(app,'frontend'):path.join(repo,'restored/frontend/dist-beautified');
const coreContainer=packaged?path.join(app,'core'):path.join(repo,'restored/core-gamecowork-binary'),core=packaged?coreContainer:path.join(coreContainer,'binary/out'),bridgePackage=packaged?path.join(app,'editor-bridge'):path.join(repo,'restored/editor-bridge');
const agent=path.resolve(option('--agent','F:/AI/AgentMake/temp/GameCowork/cli-phase6-guarded-20261001-03/gamecowork.exe')),agentSource=path.dirname(agent),manifest=JSON.parse(fs.readFileSync(path.join(agentSource,'cli-package-manifest.json'),'utf8'));
assert.equal(manifest.testGuardIncluded,true);assert.equal(manifest.sourceSha256.toLowerCase(),sha(path.join(repo,'restored/cli-gamecowork/cli-main.beautified.js')));
if(packaged){const normal=JSON.parse(fs.readFileSync(path.join(app,'cli/cli-package-manifest.json'),'utf8'));assert.equal(normal.testGuardIncluded,false);assert.equal(normal.sourceSha256.toLowerCase(),manifest.sourceSha256.toLowerCase());assert.equal(normal.executableSha256.toLowerCase(),sha(path.join(app,'cli/gamecowork.exe')));for(const relative of['Editor/GenericWindowHost.cs','Editor/PreviewStreams.cs'])assert.equal(sha(path.join(bridgePackage,relative)),sha(path.join(repo,'restored/editor-bridge',relative)),'Package must contain current generic bridge '+relative);}
const samePath=(a,b)=>String(a||'').replaceAll('\\','/').replace(/^\/\/\?\//,'').toLowerCase()===String(b||'').replaceAll('\\','/').replace(/^\/\/\?\//,'').toLowerCase();
const alive=pid=>{try{process.kill(pid,0);return true;}catch(error){if(error.code==='ESRCH')return false;throw error;}};
const redact=value=>String(value).replace(/(?<![0-9a-f])[0-9a-f]{48}(?![0-9a-f])/gi,'<owned-preview-capability>');
const checks=[],errors=[],external=[],rpc=[],networkFrames=[],streamOperations=[],inputRequests=[],inputResponses=[],clickEvidence=[],apiErrors=[],cleanupErrors=[],captureEvidence=[],frameObservationErrors=[],frameTransportErrors=[],closeBoundaries=[],teardownEvidence=[],harnessCancellationEvidence=[];
const jpegFrames=new Map();
const frameLifecycles=new Map(),failedFrameRequests=new Map();
const observerTasks=new Set(),requestStarts=new WeakMap();
let workspaceCloseHttpAt=null;
let lastStopHttpAt=null,cleanupStartedAt=null;
let cleanupHadLiveObservers=true;
let observationStage='startup';
function trackObserver(promise){
  const startedAt=Date.now(),stage=observationStage;
  const task=Promise.resolve(promise).catch(error=>{
    if(cleanupStartedAt!==null&&!cleanupHadLiveObservers&&/Target.*closed|context.*disposed/i.test(error.message))
      harnessCancellationEvidence.push({stage,finishStage:observationStage,startedAtUtc:new Date(startedAt).toISOString(),endedAtUtc:new Date().toISOString(),message:error.message});
    else errors.push(redact('Actual browser response observer: '+error.message));
  }).finally(()=>observerTasks.delete(task));
  observerTasks.add(task);return task;
}
async function drainObservers(){await until(()=>observerTasks.size===0,'actual HTTP observers finish after stopped capture',10000);}
let unity,shell,context,page,gui,preview,origin,workspaceKey,cpp,failure,shellLog='',workspaceCloseRequested=false;
async function until(fn,label,budget=30000){const end=Date.now()+budget;while(!await fn()){if(unity)assert.ok(alive(unity.pid),'Owned Editor remains alive: '+label);assert.ok(Date.now()<end,'Deadline: '+label);await delay(100);}}
const pass=(name,condition=true)=>{assert.ok(condition,name);checks.push(name);};
function observe(){return JSON.parse(fs.readFileSync(path.join(project,'Temp/generic-product-observed.json'),'utf8'));}
async function post(route,body){const response=await fetch(new URL(route,origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});return{status:response.status,body:await response.json()};}
async function invoke(type,data={}){const reply=await post('/api/tauri/invoke',{messageType:type,messageId:randomUUID(),data,workspaceKey});assert.equal(reply.status,200);assert.equal(reply.body.data?.status,'success',JSON.stringify(reply.body.data));return reply.body.data.content;}
async function streamStatus(){const reply=await invoke('unity/windowBridge/getStreamServerStatus');return reply.content||reply.data||reply;}
async function guiOwnerState(){return gui.evaluate(async storeFile=>{const module=await import('/assets/'+storeFile),state=module.s.getState();return{activeWorkspaceKey:state.hub.activeWorkspaceKey,workspaceKeys:state.hub.workspaces.map(item=>item.workspaceKey),sessionId:state.session.activeSessionId};},previous?'store-0rGrUshb.js':'store-c6kNGz30.js');}
async function closeBoundary(phase){closeBoundaries.push({phase,atUtc:new Date().toISOString(),owner:await guiOwnerState()});}
function playwright(){try{return createRequire(import.meta.url).resolve('playwright');}catch{}const cache=path.join(process.env.LOCALAPPDATA,'npm-cache/_npx');return fs.readdirSync(cache).map(name=>path.join(cache,name,'node_modules/playwright/index.mjs')).find(fs.existsSync);}
function chrome(){const cache=path.join(process.env.LOCALAPPDATA,'ms-playwright'),directory=fs.readdirSync(cache).filter(name=>/^chromium-\d+$/.test(name)).sort((a,b)=>+b.split('-')[1]-+a.split('-')[1])[0];return process.env.GAMECOWORK_E2E_CHROME||path.join(cache,directory,'chrome-win64/chrome.exe');}
async function snapshot(name){
  if(gui){
    fs.writeFileSync(path.join(run,name+'.aria.txt'),await gui.locator('body').ariaSnapshot());
    const projection=await gui.evaluate(async storeFile=>{
      const module=await import('/assets/'+storeFile),state=module.s.getState(),unity=value=>({
        projectInfo:value?.projectInfo,connectionStatus:value?.connectionStatus,projectInfoLoading:value?.projectInfoLoading,isLaunching:value?.isLaunching,editorPid:value?.editorPid,
      });
      return{hub:{isHubMode:state.hub.isHubMode,activeWorkspaceKey:state.hub.activeWorkspaceKey,workspaces:state.hub.workspaces.map(item=>({workspaceKey:item.workspaceKey,workspaceDir:item.workspaceDir,isRemote:item.isRemote}))},
        unity:{root:unity(state.unity),workspaces:Object.fromEntries(Object.entries(state.unity.workspaces||{}).map(([key,value])=>[key,unity(value)]))},
        panels:Array.from(document.querySelectorAll('[data-preview-owner-key]')).map(node=>({...node.dataset}))};
    },previous?'store-0rGrUshb.js':'store-c6kNGz30.js').catch(error=>({error:error.message}));
    fs.writeFileSync(path.join(run,name+'.owner.json'),redact(JSON.stringify(projection,null,2)));
  }
  if(page)await page.screenshot({path:path.join(run,name+'.png'),fullPage:true,animations:'disabled'});
}
async function receiver(){await until(()=>page.frames().some(frame=>frame.url().includes('/windowBridge.html')),'real Sidebar WindowBridge iframe');preview=page.frames().find(frame=>frame.url().includes('/windowBridge.html'));return preview.locator('#streamCanvas');}
async function liveCanvas(expected){let canvas;await until(async()=>{const rejected=streamOperations.find(operation=>/dimensions.*out of bounds|fps must be|Preview dimensions/i.test(operation.response?.error||''));if(rejected)throw new Error('Actual Editor rejects capture: '+rejected.response.error+'; request='+JSON.stringify(rejected.request));try{canvas=await receiver();return await canvas.getAttribute('data-frame-state')==='streaming'&&Number(await canvas.getAttribute('data-decoded-streams')||1)===expected;}catch{return false;}},'actual '+expected+' decoded complete EditorWindow streams');return canvas;}
async function addView(label,initial=false){if(initial)await gui.getByRole('button',{name:'添加 Unity 视图',exact:true}).click();else await gui.locator('[data-telemetry-id="streaming_add_view"]').click();await gui.getByRole('button',{name:/^(添加视图|Add View)$/}).hover();await gui.getByRole('button',{name:label,exact:true}).first().click();await page.keyboard.press('Escape');await until(()=>gui.locator('.tauri-right-sidebar-panel__content > div[aria-hidden="true"][style*="z-index: 50"]').count().then(count=>count===0),'real view menu closed',5000);}
async function openStreaming(){await gui.locator('[data-telemetry-id="right_sidebar_extension_menu"]').click();await gui.getByText(/^(串流|编辑器串流|Streaming)$/).last().click();}
async function closeStreaming(){
  observationStage='stop-preview';
  const tab=gui.getByRole('tab',{name:/^(串流|Streaming)(\s|$)/});
  const hit=await tab.evaluate(node=>{
    const rect=node.getBoundingClientRect();
    for(const fraction of[.5,.1,.25,.75,.9]){
      const x=rect.left+rect.width*fraction,y=rect.top+rect.height*.5,actual=document.elementFromPoint(x,y);
      if(actual&&(actual===node||node.contains(actual)))return{position:{x:rect.width*fraction,y:rect.height*.5},rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},hit:actual.tagName};
    }
    return{position:null,rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
  });
  clickEvidence.push({kind:'streaming-tab-real-hit-target',...hit});
  assert.ok(hit.position,'Actual streaming tab must have an uncovered mouse target for user close');
  await tab.hover({position:hit.position});await tab.getByRole('button',{name:/关闭|Close/}).click();
  await until(async()=>{const state=await streamStatus();return state.capturing===false&&state.streamCount===0;},'user stop releases native streams');
}
function frameType(frame){
  if(frame.windowType)return frame.windowType;
  for(const operation of [...streamOperations].reverse()){
    const entries=[...(operation.response?.streams||[]),...(operation.response?.slots||[])],entry=entries.find(entry=>entry.streamId===frame.streamId);
    if(entry?.windowType)return entry.windowType;
  }
}
async function currentFrame(type){await until(()=>networkFrames.some(frame=>frameType(frame)===type&&frame.status===200&&frame.delivered&&frame.jpeg),'real JPEG frame metadata '+type);const frame=networkFrames.findLast(frame=>frameType(frame)===type&&frame.status===200&&frame.delivered&&frame.jpeg);return{...frame,windowType:type,typeSource:frame.windowType?'header':'actual-native-stream-descriptor'};}
async function canvasPoint(type,point){const canvas=await receiver(),values=await canvas.evaluate(node=>({width:node.width,height:node.height,frames:JSON.parse(node.dataset.streamFrames||'[]'),single:{windowType:node.dataset.windowType,streamId:node.dataset.streamId,frameId:Number(node.dataset.frameId),frameWidth:node.width,frameHeight:node.height,contentRect:JSON.parse(node.dataset.contentRect||'null'),windowContentRect:JSON.parse(node.dataset.windowContentRect||'null'),sourceWidth:Number(node.dataset.sourceWidth),sourceHeight:Number(node.dataset.sourceHeight),pixelsPerPoint:Number(node.dataset.pixelsPerPoint),instanceId:Number(node.dataset.instanceId),captureEpoch:node.dataset.captureEpoch,geometryRevision:Number(node.dataset.geometryRevision)}}));
  let slot={rect:{x:0,y:0,w:1,h:1}},frame=values.frames.find(frame=>frame.windowType===type)||values.single;assert.equal(frame.windowType,type);assert.ok(frame.frameId>0);
  if(values.frames.length){const operation=streamOperations.findLast(operation=>operation.response?.slots?.some(slot=>slot.streamId===frame.streamId));assert.ok(operation,'Actual compound response identifies the displayed slot');slot=operation.response.slots.find(slot=>slot.streamId===frame.streamId);}
  const content=frame.contentRect,windowRect=frame.windowContentRect;assert.ok(content&&windowRect);
  const px=content.x+(point.x+windowRect[0])*frame.pixelsPerPoint/frame.sourceWidth*content.w,py=content.y+(point.y+windowRect[1])*frame.pixelsPerPoint/frame.sourceHeight*content.h;
  const x=slot.rect.x*values.width+px/frame.frameWidth*slot.rect.w*values.width,y=slot.rect.y*values.height+py/frame.frameHeight*slot.rect.h*values.height,bounds=await canvas.boundingBox();assert.ok(bounds);
  return{x:bounds.x+x/values.width*bounds.width,y:bounds.y+y/values.height*bounds.height,pixelX:x,pixelY:y,instanceId:frame.instanceId,streamId:frame.streamId,displayedFrame:frame,slot,bounds,control:point};}
function assertGuiMetadata(frame){assert.equal(frame.captureMode,'editor-window');assert.equal(frame.captureBackend,'unity-guiview');assert.equal(frame.includesToolbar,true);assert.match(frame.captureEpoch,/^[0-9a-f]{32}$/i);assert.ok(frame.geometryRevision>0);assert.ok(Number.isInteger(frame.instanceId)&&frame.instanceId!==0);}
function jpegDimensions(bytes){
  assert.ok(bytes.length>=4&&bytes[0]===255&&bytes[1]===216,'Actual receiver response contains a JPEG start marker');
  for(let offset=2;offset+3<bytes.length;){
    if(bytes[offset++]!==255)continue;while(bytes[offset]===255)offset++;const marker=bytes[offset++];
    if(marker===217||marker===218)break;if(marker===1||(marker>=208&&marker<=216))continue;
    const length=bytes.readUInt16BE(offset);assert.ok(length>=2&&offset+length<=bytes.length,'Actual JPEG segment stays within its encoded bytes');
    if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){
      assert.ok(length>=8);return{width:bytes.readUInt16BE(offset+5),height:bytes.readUInt16BE(offset+3),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
    }
    offset+=length;
  }
  throw new Error('Actual JPEG has no supported dimension marker');
}
function nativeFrame(address,headers,status){
  const parsed=name=>JSON.parse(headers[name]||'null');
  return{status,frameId:Number(headers['x-gamecowork-frame-id']),streamId:address.searchParams.get('streamId'),windowType:headers['x-gamecowork-window-type'],
    captureMode:headers['x-gamecowork-capture-mode'],captureBackend:headers['x-gamecowork-capture-backend'],includesToolbar:headers['x-gamecowork-includes-toolbar']==='true',
    captureEpoch:headers['x-gamecowork-capture-epoch'],geometryRevision:Number(headers['x-gamecowork-geometry-revision']),instanceId:Number(headers['x-gamecowork-instance-id']),
    dpi:Number(headers['x-gamecowork-pixels-per-point']),width:Number(headers['x-gamecowork-frame-width']),height:Number(headers['x-gamecowork-frame-height']),
    sourceWidth:Number(headers['x-gamecowork-source-width']),sourceHeight:Number(headers['x-gamecowork-source-height']),
    contentRect:parsed('x-gamecowork-content-rect'),windowContentRect:parsed('x-gamecowork-window-content-rect')};
}
async function recordFramePassthrough(route){
  const request=route.request(),address=new URL(request.url()),owner=request.frame(),lifecycle=frameLifecycles.get(owner)||0,
    stage=observationStage,startedAt=Date.now();let frame,actual;
  try{
    // Exactly one real HTTP request, with the existing browser's request scope.
    // The same original status, headers and bytes are passed to its receiver.
    actual=await route.fetch({maxRedirects:0,maxRetries:0});const headers=actual.headers(),bytes=await actual.body();
    frame={status:actual.status(),streamId:address.searchParams.get('streamId'),apiPrefix:address.origin+address.pathname.replace(/\/frame$/,''),delivered:false};
    try{
      Object.assign(frame,nativeFrame(address,headers,actual.status()));
      if(frame.status===200){
        assert.ok((headers['content-type']||'').startsWith('image/jpeg'),'Actual successful frame must be JPEG');
        frame.jpeg=jpegDimensions(bytes);
        assert.equal(frame.jpeg.width,frame.width);assert.equal(frame.jpeg.height,frame.height);
        assert.ok(frame.jpeg.width>=16&&frame.jpeg.width<=1920&&frame.jpeg.height>=16&&frame.jpeg.height<=1080,'Actual native JPEG is bounded before delivery');
      }else{
        frame.pollError=JSON.parse(bytes.toString('utf8')).error;
        assert.equal(frame.status,409,'Unexpected live frame HTTP status');
        assert.equal(frame.pollError,'No real editor frame has been rendered yet','Only actual initial-frame readiness is accepted without pixels');
      }
    }catch(error){frame.validationError=error.message;errors.push(redact('Actual native frame validation: '+error.message));}
    networkFrames.push(frame);
    await route.fulfill({status:actual.status(),headers,body:bytes});
    frame.delivered=true;
    if(frame.jpeg&&!frame.validationError){
      jpegFrames.set(frame.streamId+'|'+frame.captureEpoch+'|'+frame.frameId,{bytes,captureEpoch:frame.captureEpoch,frameId:frame.frameId});
      while(jpegFrames.size>64)jpegFrames.delete(jpegFrames.keys().next().value);
    }
  }catch(error){
    await delay(0);
    const detached=owner.isDetached(),navigated=(frameLifecycles.get(owner)||0)!==lifecycle,
      requestFailure=failedFrameRequests.get(request)||'',
      aborted=/ERR_ABORTED|NS_BINDING_ABORTED/i.test(requestFailure+' '+error.message),
      stopBoundary=['stop-preview','close-workspace','cleanup'].includes(observationStage)||['stop-preview','close-workspace','cleanup'].includes(stage),
      ended=detached||navigated||aborted,
      explicitEnd=[lastStopHttpAt,workspaceCloseHttpAt,cleanupStartedAt].some(at=>at!==null&&at>=startedAt);
    const apiPrefix=address.origin+address.pathname.replace(/\/frame$/,''),
      streamId=frame?.streamId||address.searchParams.get('streamId'),
      matchesCapturedSource=networkFrames.some(value=>value.apiPrefix===apiPrefix&&value.streamId===streamId&&value.delivered&&value.status===200),
      detail={streamId,apiPrefix,frameId:frame?.frameId,captureEpoch:frame?.captureEpoch,message:error.message,
      stage,finishStage:observationStage,startedAtUtc:new Date(startedAt).toISOString(),endedAtUtc:new Date().toISOString(),detached,navigated,requestFailure,observationLifecycleEnded:ended,afterWorkspaceClose:workspaceCloseRequested};
    if(explicitEnd&&ended&&stopBoundary&&/ERR_ABORTED|NS_BINDING_ABORTED|Invalid InterceptionId|Target.*closed|context.*disposed/i.test(error.message+' '+requestFailure)){
      if(frame)frame.observationCancelled=true;
      frameObservationErrors.push(detail);
    }else{
      detail.expectedCloseCandidate=!!(workspaceCloseHttpAt&&Date.now()>=workspaceCloseHttpAt&&matchesCapturedSource&&/ECONNREFUSED/.test(error.message));
      frameTransportErrors.push(detail);
      if(!detail.expectedCloseCandidate)errors.push(redact('Actual frame HTTP passthrough: '+error.message));
    }
    await route.abort('failed').catch(()=>{});
  }finally{await actual?.dispose();}
}
async function captureGeometry(stage,expected){
  observationStage=stage;
  const canvas=await liveCanvas(expected);let evidence;
  await until(async()=>{
    const displayed=await canvas.evaluate(node=>{
      const rect=node.getBoundingClientRect(),area=document.getElementById('mainArea').getBoundingClientRect();
      return{width:node.width,height:node.height,css:{width:rect.width,height:rect.height},area:{width:area.width,height:area.height},
        dpr:window.devicePixelRatio,normalized:window.GameCoworkCaptureSize?.({width:Math.round(area.width),height:Math.round(area.height),dpr:window.devicePixelRatio}),
        frames:JSON.parse(node.dataset.streamFrames||'[]')};
    });
    if(displayed.frames.length!==expected||!displayed.normalized||displayed.width!==displayed.normalized.width||displayed.height!==displayed.normalized.height)return false;
    const sources=[];
    for(const frame of displayed.frames){
      const network=networkFrames.findLast(value=>value.status===200&&value.delivered&&value.jpeg&&value.streamId===frame.streamId&&value.frameId===frame.frameId&&value.captureEpoch===frame.captureEpoch);
      const operation=streamOperations.findLast(value=>value.response?.slots?.some(slot=>slot.streamId===frame.streamId)),descriptor=operation?.response.slots.find(slot=>slot.streamId===frame.streamId);
      if(!network||!descriptor||operation.response.width!==displayed.width||operation.response.height!==displayed.height||
        Math.abs(Math.max(16,operation.request.width*descriptor.rect.w)-frame.frameWidth)>1||
        Math.abs(Math.max(16,operation.request.height*descriptor.rect.h)-frame.frameHeight)>1)return false;
      sources.push({frame,network,descriptor,request:{width:operation.request.width,height:operation.request.height,dpr:operation.request.dpr,fps:operation.request.fps},response:{width:operation.response.width,height:operation.response.height}});
    }
    evidence={stage,...displayed,sources};return true;
  },'fresh same-identity JPEG and displayed slot geometry '+stage);
  assert.ok(evidence.width>=16&&evidence.width<=1920&&evidence.height>=16&&evidence.height<=1080,'Parent canvas stays within JPEG bridge allocation limits');
  assert.ok(evidence.normalized,'The actual receiver exposes the sizing contract');
  assert.equal(evidence.width,evidence.normalized.width);assert.equal(evidence.height,evidence.normalized.height);
  assert.ok(Math.abs(evidence.css.width/evidence.css.height-evidence.width/evidence.height)<=Math.max(.01,2/evidence.height),'Backing dimensions keep the actual display aspect within integer rounding');
  assert.equal(evidence.dpr,browserDpr,'Browser DPR is measured independently from the native Editor DPI');
  for(const [index,source]of evidence.sources.entries()){
    const {frame,network,descriptor,request,response}=source,rect=frame.contentRect;
    assertGuiMetadata(frame);assert.ok(network.jpeg.width>=16&&network.jpeg.width<=1920&&network.jpeg.height>=16&&network.jpeg.height<=1080);
    assert.equal(network.jpeg.width,network.width);assert.equal(network.jpeg.height,network.height);assert.equal(network.jpeg.width,frame.frameWidth);assert.equal(network.jpeg.height,frame.frameHeight);
    assert.equal(response.width,evidence.width);assert.equal(response.height,evidence.height);assert.equal(request.width,response.width);assert.equal(request.height,response.height);
    assert.ok(request.fps>=1&&request.fps<=30&&request.dpr>=.5&&request.dpr<=4);assert.equal(request.dpr,evidence.normalized.dpr);
    assert.equal(network.instanceId,frame.instanceId);assert.equal(network.geometryRevision,frame.geometryRevision);assert.equal(network.dpi,frame.pixelsPerPoint);
    assert.equal(network.sourceWidth,frame.sourceWidth);assert.equal(network.sourceHeight,frame.sourceHeight);
    assert.equal(network.captureMode,frame.captureMode);assert.equal(network.captureBackend,frame.captureBackend);assert.equal(network.includesToolbar,frame.includesToolbar);
    assert.deepEqual(network.contentRect,[rect.x,rect.y,rect.w,rect.h]);assert.deepEqual(network.windowContentRect,frame.windowContentRect);
    assert.ok(Math.abs(frame.frameWidth-Math.max(16,evidence.width*descriptor.rect.w))<=1&&Math.abs(frame.frameHeight-Math.max(16,evidence.height*descriptor.rect.h))<=1,'Actual slot pixels follow parent normalized size');
    assert.ok(rect.x>=0&&rect.y>=0&&rect.w>0&&rect.h>0&&rect.x+rect.w<=frame.frameWidth+.01&&rect.y+rect.h<=frame.frameHeight+.01);
    assert.ok(Math.abs(rect.w/rect.h-frame.sourceWidth/frame.sourceHeight)<=.01,'Actual frame ROI preserves the real Editor GUI source aspect');
    const encoded=jpegFrames.get(frame.streamId+'|'+frame.captureEpoch+'|'+frame.frameId);assert.ok(encoded,'The displayed exact JPEG packet remains recorded');assert.equal(createHash('sha256').update(encoded.bytes).digest('hex'),network.jpeg.sha256);fs.writeFileSync(path.join(run,stage+'-'+index+'.jpg'),encoded.bytes);
  }
  captureEvidence.push(evidence);pass('Actual JPEG, parent canvas, slots and GUI ROI agree: '+stage);return evidence;
}
async function resizedInput(stage){
  const frames=await(await receiver()).evaluate(node=>JSON.parse(node.dataset.streamFrames||'[]')),
    hierarchy=frames.find(frame=>frame.windowType==='UnityEditor.SceneHierarchyWindow'),inspector=frames.find(frame=>frame.windowType==='UnityEditor.InspectorWindow');
  assert.ok(hierarchy&&inspector);
  const rowFile=path.join(project,'Temp/hierarchy-row-'+hierarchy.instanceId+'.json');await until(()=>fs.existsSync(rowFile),'current resized Hierarchy row');
  const betaPoint=await canvasPoint(hierarchy.windowType,JSON.parse(fs.readFileSync(rowFile,'utf8')));
  await page.mouse.click(betaPoint.x,betaPoint.y);await until(()=>observe().selection==='Owned Beta','resized hierarchy focuses Beta');
  await page.keyboard.press('ArrowUp');await until(()=>observe().selection==='Owned Alpha','actual resized hierarchy keyboard selects Alpha');
  const nextBeta=await canvasPoint(hierarchy.windowType,JSON.parse(fs.readFileSync(rowFile,'utf8')));
  clickEvidence.push({kind:stage+'-hierarchy-click',...nextBeta});await page.mouse.click(nextBeta.x,nextBeta.y);await until(()=>observe().selection==='Owned Beta','actual resized hierarchy click selects Beta');
  const controlFile=path.join(project,'Temp/inspector-control-'+inspector.instanceId+'.json');await until(()=>fs.existsSync(controlFile)&&JSON.parse(fs.readFileSync(controlFile,'utf8')).targetName==='Owned Beta','resized actual Inspector control targets Beta');
  const before=observe(),button=await canvasPoint(inspector.windowType,JSON.parse(fs.readFileSync(controlFile,'utf8')));
  clickEvidence.push({kind:stage+'-inspector-click',...button});await page.mouse.click(button.x,button.y);await until(()=>observe().betaX===before.betaX+1,'resized actual Inspector serialized effect');assert.equal(observe().alphaX,before.alphaX);
  pass('Resized real Hierarchy keyboard/click and Inspector affect the correct object: '+stage);
}
try{
  fs.mkdirSync(run,{recursive:true});prepareEngineFixture({repo,project,bridgePackage,identity});fs.copyFileSync(path.join(repo,'tests/editor-generic-product-fixture.cs'),path.join(project,'Assets/Editor/GameCoworkGenericProductFixture.cs'));
  const editorEnv={...process.env};for(const key of Object.keys(editorEnv))if(/^(GAMECOWORK_|CODELY_|OPENAI|ANTHROPIC|OTEL_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key))delete editorEnv[key];
  unity=spawn(editor,['-projectPath',project,'-executeMethod','GameCoworkGenericProductFixture.Boot','-logFile',path.join(run,'editor.log')],{cwd:run,env:editorEnv,windowsHide:true,stdio:'ignore'});
  await until(()=>fs.existsSync(path.join(project,'Temp/generic-product-ready.json'))&&fs.existsSync(path.join(project,'Temp/.com-unity-gamecowork.json')),'own licensed Editor imports generic bridge',120000);const ready=JSON.parse(fs.readFileSync(path.join(project,'Temp/generic-product-ready.json'),'utf8'));assert.equal(ready.pid,unity.pid);assert.ok(samePath(ready.root,project));
  cpp=await connectEditor(JSON.parse(fs.readFileSync(path.join(project,'Temp/.com-unity-gamecowork.json'),'utf8')).unity_port,project);pass('Actual selected '+identity.engine+' imports its own generic UPM and creates owned Alpha/Beta');
  const env={...process.env};for(const key of Object.keys(env))if(/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(key)||/^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(key)||key==='NODE_OPTIONS')delete env[key];
  Object.assign(env,{GAMECOWORK_HEADLESS:'1',GAMECOWORK_TEST_MODE:'1',GAMECOWORK_APP_ROOT:run,GAMECOWORK_DATA_DIR:path.join(run,'data'),GAMECOWORK_FRONTEND_DIR:frontend,GAMECOWORK_CORE_DIR:core,GAMECOWORK_CORE_ENTRY:path.join(core,'index.js'),GAMECOWORK_AGENT_PATH:agent,GAMECOWORK_AGENT_RESOURCE_DIR:path.join(agentSource,'resources'),GAMECOWORK_PICK_FOLDER:project,GAMECOWORK_CHAT_ROOT:run,GAMECOWORK_CHAT_CORE:coreContainer,GAMECOWORK_CHAT_AGENT:agent,GAMECOWORK_CLI_PROBE_ROOT:run,GAMECOWORK_CLI_PROBE_SOURCE:agentSource,CUSTOM_AUTH:'1',BUN_RUNTIME_TRANSPILER_CACHE_PATH:path.join(run,'bun-cache'),NODE_OPTIONS:'--require '+JSON.stringify(path.join(repo,'tests/chat-core-guard.cjs'))});
  shell=spawn(binary,[],{cwd:run,env,windowsHide:true,stdio:['ignore','pipe','pipe']});for(const stream of[shell.stdout,shell.stderr])stream.on('data',bytes=>{shellLog+=redact(bytes.toString());const match=shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match)origin=match[1];});await until(()=>origin,'real Rust/Core host');pass('Actual Rust/Core uses isolated data and same-source guarded Agent without Provider setup');
  const {chromium}=await import(pathToFileURL(playwright()).href);context=await chromium.launchPersistentContext(path.join(run,'browser-profile'),{headless:true,executablePath:chrome(),viewport,deviceScaleFactor:browserDpr,locale:'zh-CN',colorScheme:'dark',serviceWorkers:'block',args:['--disable-background-networking','--disable-component-update','--no-first-run']});
  await context.route('**/*',route=>{const target=new URL(route.request().url());if(target.hostname==='127.0.0.1'){if(target.pathname.endsWith('/frame')&&/\/api\/tauri\/window-bridge\/local\/[0-9a-f]{48}\/frame$/.test(target.pathname))return trackObserver(recordFramePassthrough(route));return route.continue();}if(['data:','blob:'].includes(target.protocol))return route.continue();external.push(target.origin);return route.abort('blockedbyclient');});
  if(previous)await context.route('**/gui.html*',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(frontend,'gui.html'),'utf8').replaceAll('index-BRxZ4eG7.js','index-DvRYaIVa.js').replaceAll('VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js').replaceAll('store-c6kNGz30.js','store-0rGrUshb.js')}));
  await context.addInitScript(()=>{window.GAMECOWORK_SHELL=true;window.workspacePaths=[];window.vscMediaUrl='';localStorage.setItem('gamecowork-language','zh');});page=context.pages()[0]||await context.newPage();page.on('pageerror',error=>errors.push(redact(error.stack||error.message)));
  page.on('framenavigated',frame=>frameLifecycles.set(frame,(frameLifecycles.get(frame)||0)+1));
  page.on('framedetached',frame=>frameLifecycles.set(frame,(frameLifecycles.get(frame)||0)+1));
  page.on('requestfailed',request=>failedFrameRequests.set(request,request.failure()?.errorText||''));
  page.on('request',request=>{requestStarts.set(request,{at:Date.now(),stage:observationStage});if(!request.url().includes('/api/tauri/'))return;let body;try{body=request.postDataJSON();}catch{}const message=body?.message||body;if(message?.messageType)rpc.push({type:message.messageType,data:message.data,workspaceKey:body.workspaceKey||message.workspaceKey});const address=new URL(request.url());if(address.pathname.endsWith('/input'))inputRequests.push(body);if(address.pathname.endsWith('/stream/stop')||message?.messageType==='unity/windowBridge/stopStreamServer')lastStopHttpAt=Date.now();if(address.pathname==='/api/tauri/hub/close-workspace'){workspaceCloseHttpAt=Date.now();closeBoundaries.push({phase:'actual-close-http-start',atUtc:new Date(workspaceCloseHttpAt).toISOString()});}});
  page.on('response',response=>trackObserver((async()=>{const address=new URL(response.url()),headers=response.headers();
    if(address.pathname.endsWith('/frame'))return; // Original bytes already recorded by the real HTTP passthrough.
    if(address.pathname.endsWith('/input')){inputResponses.push({status:response.status(),request:response.request().postDataJSON(),response:await response.json()});return;}
    if(/\/stream\/(?:start|update)-/.test(address.pathname)){streamOperations.push({route:address.pathname.split('/').slice(-2).join('/'),request:response.request().postDataJSON(),response:await response.json()});return;}
    if(address.pathname==='/api/tauri/invoke'){const reply=await response.json(),start=requestStarts.get(response.request());if(reply?.data?.status==='error'||reply?.data?.content?.error)apiErrors.push({type:reply.messageType,error:redact(reply.data.error||reply.data.content.error),afterWorkspaceClose:workspaceCloseRequested,startedAtUtc:start?new Date(start.at).toISOString():null,finishAtUtc:new Date().toISOString(),startStage:start?.stage,startedBeforeClose:!!(start&&workspaceCloseHttpAt&&start.at<workspaceCloseHttpAt)});}
  })()));
  await page.goto(origin,{waitUntil:'domcontentloaded'});await until(()=>page.frames().some(frame=>frame.url().includes('/gui.html')),'actual main GUI');gui=page.frames().find(frame=>frame.url().includes('/gui.html'));
  for(let step=0;step<4;step++){const next=gui.getByRole('button',{name:/^(下一步|Next|知道了|Got it)$/}).first();if(step===0)await next.waitFor({state:'visible',timeout:3000}).catch(()=>{});if(!await next.isVisible())break;await next.click();}
  await gui.getByRole('button',{name:/^(打开工作区|Open Workspace)$/}).last().click();await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();await until(async()=>{const registry=await fetch(new URL('/api/tauri/hub/workspaces',origin)).then(response=>response.json());workspaceKey=registry.workspaces.find(entry=>samePath(entry.workspaceDir,project))?.workspaceKey;return !!workspaceKey;},'actual product picker opens owned Editor root');pass('Original main workspace entry selects exact own Editor project');
  const metadata=await invoke('unity/getProjectStatus'),projectInfo=metadata.content||metadata;assert.equal(projectInfo.engineType,identity.engine==='tuanjie'?'Tuanjie':'Unity');assert.ok(samePath(projectInfo.projectRoot,project));pass('Real Core metadata and main workspace preserve selected engine/root');
  if(args.includes('--connector-entry')){
    await gui.locator('[data-telemetry-id="open_unity_editor"]').first().click();
    const card=gui.locator('[data-testid="unity-connectors"]');await card.waitFor({state:'visible'});
    const starts=rpc.filter(record=>record.type==='unity/windowBridge/startStreamServer').length;
    await card.locator('[data-telemetry-id="unity_open_views"]').click();
    await gui.getByRole('button',{name:'添加 Unity 视图',exact:true}).waitFor({state:'visible'});
    assert.equal(rpc.filter(record=>record.type==='unity/windowBridge/startStreamServer').length,starts);
    pass('Pure connector discovery opens the real sidebar without starting a capture');
    const panel=gui.locator('[data-testid="unity-streaming-connectors"]');await panel.waitFor({state:'visible'});
    const connectorTypes=await panel.locator('[data-unity-view-type]').evaluateAll(nodes=>nodes.map(node=>({type:node.dataset.unityViewType,visible:node.getBoundingClientRect().width>0&&node.getBoundingClientRect().height>0})));
    assert.deepEqual(connectorTypes.map(item=>item.type).sort(),['UnityEditor.SceneView','UnityEditor.GameView','UnityEditor.SceneHierarchyWindow','UnityEditor.InspectorWindow','UnityEditor.ConsoleWindow','UnityEditor.ProjectBrowser'].sort());assert.ok(connectorTypes.every(item=>item.visible),'All six connector types are visibly rendered in the real panel');
    await until(async()=>await panel.locator('[data-unity-view-type]:disabled').count()===0,'real Editor connectivity enables all six side-panel connectors without a chat');
    pass('Dedicated streaming panel enables six view connectors before creating a chat or model');await snapshot('00-real-streaming-panel-connectors');
    await panel.locator('[data-unity-view-type="UnityEditor.SceneHierarchyWindow"]').click();
    await snapshot('01-real-sidebar-entry');
  }else{
    await gui.locator('[data-telemetry-id="toggle_right_sidebar"]').first().click();await openStreaming();await snapshot('01-real-sidebar-entry');await addView('Hierarchy',true);
  }
  let canvas=await liveCanvas(1);await captureGeometry('initial-hierarchy',1);
  const hierarchy=await currentFrame('UnityEditor.SceneHierarchyWindow');assertGuiMetadata(hierarchy);assert.equal(observe().selection,'Owned Alpha');pass('Original Sidebar Hierarchy menu renders actual complete GUI with epoch/geometry/toolbar metadata');
  const sceneSetup=path.join(project,'Temp/hierarchy-setup-'+hierarchy.instanceId+'.json');await until(()=>fs.existsSync(sceneSetup),'own Scene expanded once as declared fixture setup');assert.equal(JSON.parse(fs.readFileSync(sceneSetup,'utf8')).fixtureSetup,true);
  const rowFile=path.join(project,'Temp/hierarchy-row-'+hierarchy.instanceId+'.json');await until(()=>fs.existsSync(rowFile),'actual streamed Hierarchy GUIView records Beta row');const betaRow=JSON.parse(fs.readFileSync(rowFile,'utf8'));assert.equal(betaRow.instanceId,hierarchy.instanceId);assert.equal(betaRow.targetName,'Owned Beta');assert.equal(betaRow.binding,'GUIView.current.actualView + authoritative screenPosition/contentOffset');
  const witnessFile=path.join(project,'Temp/hierarchy-witness-'+hierarchy.instanceId+'.json');await until(()=>fs.existsSync(witnessFile),'real Beta row repaint witness');let witnessEvidence;await until(async()=>{const point=await canvasPoint('UnityEditor.SceneHierarchyWindow',JSON.parse(fs.readFileSync(witnessFile,'utf8'))),color=await (await receiver()).evaluate((node,point)=>Array.from(node.getContext('2d').getImageData(Math.round(point.x),Math.round(point.y),1,1).data),{x:point.pixelX,y:point.pixelY});witnessEvidence={point,color};return color[1]>160&&color[0]<80&&color[2]<80;},'actual displayed canvas contains Beta row repaint witness');clickEvidence.push({kind:'beta-row-actually-visible',...witnessEvidence});
  const betaPoint=await canvasPoint('UnityEditor.SceneHierarchyWindow',betaRow);clickEvidence.push({kind:'beta-click',...betaPoint});await page.mouse.click(betaPoint.x,betaPoint.y);await until(()=>observe().selection==='Owned Beta','actual main canvas Hierarchy click selects Beta');pass('Real main canvas input changes actual Selection to owned Beta');await snapshot('02-main-hierarchy-beta');
  if(args.includes('--connector-entry')){
    await gui.locator('[data-testid="unity-streaming-connectors"] [data-unity-view-type="UnityEditor.InspectorWindow"]').click();
  }else await addView('Inspector');
  canvas=await liveCanvas(2);const inspector=await currentFrame('UnityEditor.InspectorWindow');assertGuiMetadata(inspector);pass('Actual Inspector entry produces a second independent complete GUI source');
  const controlFile=path.join(project,'Temp/inspector-control-'+inspector.instanceId+'.json');await until(()=>fs.existsSync(controlFile)&&JSON.parse(fs.readFileSync(controlFile,'utf8')).targetName==='Owned Beta','actual streamed Inspector GUIView instance records its live control');const control=JSON.parse(fs.readFileSync(controlFile,'utf8'));assert.equal(control.instanceId,inspector.instanceId);assert.equal(control.binding,'GUIView.current.actualView + authoritative screenPosition/contentOffset');
  const before=observe(),button=await canvasPoint('UnityEditor.InspectorWindow',control);clickEvidence.push({kind:'inspector-click',...button});await page.mouse.click(button.x,button.y);await until(()=>observe().betaX===before.betaX+1,'actual main Inspector serialized Transform change');assert.equal(observe().alphaX,before.alphaX);pass('Actual Inspector canvas modifies only selected Beta via ApplyModifiedProperties');await snapshot('03-main-inspector-serialized');
  const initialGeometry=await captureGeometry('initial-two-window',2);
  if(resizeViewport){
    observationStage='resize';
    await page.setViewportSize(resizeViewport);
    await until(async()=>{try{const values=await(await receiver()).evaluate(node=>({width:node.width,height:node.height}));return values.width!==initialGeometry.width||values.height!==initialGeometry.height;}catch{return false;}},'large-to-small receiver allocation changes');
    canvas=await liveCanvas(2);const smaller=await captureGeometry('resized-two-window',2);
    for(const source of smaller.sources){const before=initialGeometry.sources.find(item=>item.frame.windowType===source.frame.windowType);assert.ok(before);assert.ok(source.frame.geometryRevision>before.frame.geometryRevision||source.frame.captureEpoch!==before.frame.captureEpoch,'Resize uses a fresh actual frame mapping');}
    await resizedInput('large-to-small');await snapshot('03b-main-resized-input');
  }
  const beforeCloseFrames=await canvas.evaluate(node=>JSON.parse(node.dataset.streamFrames||'[]'));assert.equal(beforeCloseFrames.length,2);
  await closeStreaming();pass('Main user close-preview flow releases native full-GUI capture');
  await until(()=>rpc.some(record=>record.type==='save_unity_streaming_layout'&&JSON.parse(record.data.contents).tabs?.length===2),'actual two-window layout saved on user close');const saved=JSON.parse(rpc.findLast(record=>record.type==='save_unity_streaming_layout').data.contents);for(const tab of saved.tabs){assert.equal(tab.captureMode,'editor-window');assert.equal(tab.workspaceKey,workspaceKey);assert.ok(samePath(tab.workspaceRoot,project));}assert.deepEqual(JSON.parse(fs.readFileSync(path.join(run,'data/unity-streaming-layout.json'),'utf8')),saved);pass('Real save-layout keeps both complete-GUI modes and exact workspace root/key');
  observationStage='restore-preview';await openStreaming();await gui.getByRole('button',{name:'添加 Unity 视图',exact:true}).click();await gui.getByRole('button',{name:/加载最新布局|上次布局|Last Layout/}).click();canvas=await liveCanvas(2);assert.equal(await canvas.getAttribute('data-slot-count'),'2');
  const restoredFrames=await canvas.evaluate(node=>JSON.parse(node.dataset.streamFrames||'[]'));assert.deepEqual(restoredFrames.map(frame=>frame.windowType).sort(),['UnityEditor.InspectorWindow','UnityEditor.SceneHierarchyWindow']);
  for(const frame of restoredFrames){assertGuiMetadata(frame);assert.equal(frame.workspaceKey,workspaceKey);assert.ok(samePath(frame.workspaceRoot,project));assert.ok(frame.frameId>0);assert.notEqual(frame.captureEpoch,beforeCloseFrames.find(before=>before.windowType===frame.windowType).captureEpoch,'Reopened actual displayed source owns a fresh capture epoch');
    const operation=streamOperations.findLast(operation=>operation.response?.slots?.some(slot=>slot.streamId===frame.streamId));assert.ok(operation);const descriptor=operation.response.slots.find(slot=>slot.streamId===frame.streamId);assert.equal(descriptor.windowType,frame.windowType);assert.equal(descriptor.captureMode,'editor-window');assert.equal(descriptor.includesToolbar,true);assert.ok(networkFrames.some(network=>network.streamId===frame.streamId&&network.captureEpoch===frame.captureEpoch&&network.instanceId===frame.instanceId),'Displayed source is backed by an actual same-identity native frame');}
  clickEvidence.push({kind:'restored-displayed-identities',beforeCloseFrames,restoredFrames});pass('Main reopen restores exact two-slot full-GUI layout without render-content fallback');await captureGeometry('restored-two-window',2);if(resizeViewport)await resizedInput('restored-after-resize');await snapshot('04-main-layout-restored');
  const section=gui.locator('[class*="group/workspace-section"]').filter({has:gui.getByRole('button',{name:'project',exact:true})});await section.hover();await section.getByRole('button',{name:/工作区选项|Workspace options/i}).click();observationStage='close-workspace';workspaceCloseRequested=true;await closeBoundary('close-click');await gui.locator('[data-telemetry-id="remove_workspace"]').click();await closeBoundary('close-request-started');
  await until(async()=>!(await fetch(new URL('/api/tauri/hub/workspaces',origin)).then(response=>response.json())).workspaces.some(entry=>entry.workspaceKey===workspaceKey),'main sidebar closes workspace');await until(async()=>{const state=(await cpp.call('get_stream_server_status')).data;return state.streamCount===0&&state.capturing===false;},'closing project releases generic capture');await closeBoundary('native-closed');
  await until(async()=>{const owner=await guiOwnerState();return owner.activeWorkspaceKey!==workspaceKey&&!owner.workspaceKeys.includes(workspaceKey);},'actual GUI owner and projection settle after workspace close');await closeBoundary('actual-gui-settled');
  const rejected=await post('/api/tauri/invoke',{messageType:'unity/windowBridge/startStreamServer',messageId:randomUUID(),data:{},workspaceKey});assert.equal(rejected.body.data.status,'error');pass('Closing actual main workspace releases all capture, settles GUI ownership and rejects late old-root restart');await snapshot('05-main-workspace-closed');
  const attempts=[];for(const name of['core-guard-events.jsonl','guard-events.jsonl']){const file=path.join(run,name);if(fs.existsSync(file))for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean)){const entry=JSON.parse(line);if(/^(external-|fetch$|node:http\.|node:https\.|net\.)/.test(entry.operation||''))attempts.push(entry.operation);}}
  await drainObservers();const finalOwner=await guiOwnerState(),finalNative=(await cpp.call('get_stream_server_status')).data,finalRegistry=await fetch(new URL('/api/tauri/hub/workspaces',origin)).then(response=>response.json());
  assert.ok(finalOwner.activeWorkspaceKey!==workspaceKey&&!finalOwner.workspaceKeys.includes(workspaceKey),'Closed GUI owner does not revive after HTTP callbacks finish');assert.equal(finalNative.streamCount,0);assert.equal(finalNative.capturing,false);assert.equal(finalNative.running,false);assert.ok(!finalRegistry.workspaces.some(item=>item.workspaceKey===workspaceKey));
  for(const detail of frameTransportErrors.filter(item=>item.expectedCloseCandidate)){
    assert.ok(closeBoundaries.some(boundary=>boundary.phase==='native-closed'),'The matching own native listener was actually stopped');
    detail.confirmedOwnKey=workspaceKey;detail.registryClosed=true;detail.nativeStreamCount=finalNative.streamCount;detail.nativeRunning=finalNative.running;detail.guiSettled=true;
    teardownEvidence.push(detail);
  }
  const unexpectedApiErrors=apiErrors.filter(error=>!(error.startedBeforeClose&&error.afterWorkspaceClose&&error.type==='findGitRepositories'&&error.error.startsWith('Workspace is not open: ')&&samePath(error.error.slice('Workspace is not open: '.length).trim(),project)));
  assert.deepEqual(unexpectedApiErrors,[],'Any live-scope API error must fail; only the exact already-closed root Git response is an expected boundary');assert.ok(inputResponses.length>0);assert.ok(inputResponses.every(reply=>reply.status===200&&reply.response.success===true),'All actual receiver input callbacks succeed without hidden stale rejection');
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(attempts,[]);assert.ok(!rpc.some(record=>/^(?:llm\/|acp\/chat)/.test(record.type)));pass('Whole-product workflow needs no Provider request and emits no external/browser error');
}catch(error){failure={message:error.message,stack:redact(error.stack||'')};process.exitCode=1;await snapshot('failure').catch(()=>{});}
finally{
  observationStage='cleanup';
  if(fs.existsSync(path.join(project,'Temp')))for(const file of fs.readdirSync(path.join(project,'Temp')).filter(file=>/^(generic-product-(ready|observed)|hierarchy-(row|setup|witness)-|inspector-control-)/.test(file)&&file.endsWith('.json')))
    fs.copyFileSync(path.join(project,'Temp',file),path.join(run,file));
  try{await drainObservers();cleanupHadLiveObservers=observerTasks.size!==0;cleanupStartedAt=Date.now();await context?.close();await drainObservers();}catch(error){cleanupErrors.push(error.message);}cpp?.close();
  if(origin&&workspaceKey)await post('/api/tauri/invoke',{messageType:'unity/windowBridge/stopStreamServer',messageId:randomUUID(),data:{},workspaceKey}).catch(()=>{});
  try{if(shell&&alive(shell.pid)){shell.kill();await until(()=>!alive(shell.pid),'owned Rust host cleanup',10000);}}catch(error){cleanupErrors.push(error.message);}
  try{if(unity&&alive(unity.pid)){fs.writeFileSync(path.join(project,'Temp/request-exit'),'');const deadline=Date.now()+10000;while(alive(unity.pid)&&Date.now()<deadline)await delay(100);if(alive(unity.pid)){const info=await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${unity.pid}').CommandLine`],{windowsHide:true});assert.ok(info.stdout.includes(project));await exec('taskkill.exe',['/PID',String(unity.pid),'/F'],{windowsHide:true});}}}catch(error){cleanupErrors.push(error.message);}
  const ownPidsGone=cleanupErrors.length===0&&(!unity||!alive(unity.pid))&&(!shell||!alive(shell.pid));if(!ownPidsGone&&!failure){failure={message:'Owned product process cleanup incomplete'};process.exitCode=1;}
  if(errors.length&&!failure){failure={message:'Late real response/transport errors after cleanup: '+errors.join('\n')};process.exitCode=1;}
  if(frameTransportErrors.some(item=>item.expectedCloseCandidate&&!item.guiSettled)&&!failure){failure={message:'Unconfirmed own-listener teardown transport failure'};process.exitCode=1;}
  fs.writeFileSync(path.join(run,'shell.log'),shellLog);fs.writeFileSync(path.join(run,'result.json'),redact(JSON.stringify({stage:'actual-main-sidebar-rust-core-generic-editor-product',run,packaged,previous,identity,project,binary,core,frontend,bridgePackage,viewport,browserDpr,resizeViewport,checks,failure,errors,external,apiErrors,rpc,networkFrames,streamOperations,inputRequests,inputResponses,clickEvidence,captureEvidence,frameObservationErrors,frameTransportErrors,closeBoundaries,teardownEvidence,harnessCancellationEvidence,editorPid:unity?.pid,hostPid:shell?.pid,ownPidsGone,cleanupErrors,agentSourceSha256:manifest.sourceSha256},null,2)));console.log(JSON.stringify({run,engine:identity.engine,packaged,previous,viewport,browserDpr,passed:checks.length,failure:failure?.message,ownPidsGone}));
}
