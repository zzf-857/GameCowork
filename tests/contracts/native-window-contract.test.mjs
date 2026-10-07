import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
const source=fs.readFileSync(new URL('../../src/shell/src/platform/native_window.js',import.meta.url),'utf8');
function fixture(pathname='/gui.html',frameless=true){
  const handlers={},requests=[],window={GAMECOWORK_FRAMELESS_WINDOW:frameless,addEventListener:(type,handler)=>handlers[type]=handler};
  const location={protocol:'http:',hostname:'127.0.0.1',origin:'http://127.0.0.1:31000',pathname};
  window.top=window;window.location=location;
  vm.runInNewContext(source,{window,location,document:{documentElement:{}},getComputedStyle:()=>({fontSize:'16px',getPropertyValue:()=> '2.25rem'}),fetch:(url,options)=>{requests.push({url,options});return Promise.resolve();},console});
  return{window,handlers,requests};
}
const caption={button:0,clientY:20,detail:1,target:{closest:()=>null},stopImmediatePropagation(){},preventDefault(){}};
test('Native caption blank space routes a drag and double click through the actual local host',()=>{
  const state=fixture();state.handlers.mousedown(caption);state.handlers.dblclick({...caption,detail:2});
  assert.deepEqual(state.requests.map(row=>new URL(row.url).pathname),['/api/tauri/start-dragging','/api/tauri/toggle-maximize-window']);
  assert.ok(state.requests.every(row=>row.options.method==='POST'));
});
test('Native caption never intercepts controls, canvas, modifier clicks or content below its height',()=>{
  const state=fixture();
  for(const event of [{...caption,target:{closest:()=>({})}},{...caption,clientY:36},{...caption,clientY:-1},{...caption,button:2},{...caption,ctrlKey:true},{...caption,altKey:true},{...caption,shiftKey:true},{...caption,metaKey:true},{...caption,detail:2}])state.handlers.mousedown(event);
  assert.equal(state.requests.length,0);
});
test('Native caption listeners are absent in actual preview/media frames',()=>{
  for(const pathname of ['/windowBridge.html','/pet.html','/remote/gui.html']){
    const state=fixture(pathname);assert.deepEqual(Object.keys(state.handlers),[]);assert.equal(state.window.GAMECOWORK_SHELL,true);
  }
});
test('The verified system-caption mode does not install new capture listeners',()=>{
  const state=fixture('/gui.html',false);assert.deepEqual(Object.keys(state.handlers),[]);
});
test('An iframe caption uses top-level IPC once and prevents the legacy duplicate caption event',()=>{
  const state=fixture(),topMessages=[],childMessages=[];let stopped=0;
  state.window.ipc={postMessage:message=>childMessages.push(message)};
  state.window.top={location:state.window.location,ipc:{postMessage:message=>topMessages.push(message)}};
  state.handlers.mousedown({...caption,stopImmediatePropagation(){stopped++;}});
  assert.deepEqual(topMessages,['gamecowork.window.start-dragging']);assert.equal(childMessages.length,0);assert.equal(state.requests.length,0);assert.equal(stopped,1);
  state.handlers.dblclick({...caption,detail:2,stopImmediatePropagation(){stopped++;}});assert.equal(stopped,2);assert.equal(state.requests.length,1);
});
