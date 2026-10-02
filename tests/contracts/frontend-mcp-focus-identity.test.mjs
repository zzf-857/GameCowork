import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const assets=new URL('../../src/frontend/bundle/assets/',import.meta.url);
const variants=[['current','index-BRxZ4eG7.js','VscTheme-BExNMG_K.js','Mm','fcn'],['previous','index-DvRYaIVa.js','VscTheme-B-CSeuv5.js','Lm','hcn']];
for(const [label,mainFile,vscFile,modal,form]of variants){
  const main=fs.readFileSync(new URL(mainFile,assets),'utf8'),vsc=fs.readFileSync(new URL(vscFile,assets),'utf8');
  const begin=main.indexOf('function gamecoworkScheduleDialogFocus('),end=main.indexOf('\nconst '+modal+' =',begin);assert.ok(begin>=0&&end>begin);
  const source=main.slice(begin,end);
  function harness({initialNameFocus=false,noInput=false}={}){
    const listeners=new Map(),timers=new Map(),callbacks=[];let sequence=0;
    const eventOwner=(prefix,value)=>Object.assign(value,{addEventListener(type,fn){listeners.set(prefix+type,fn);},removeEventListener(type,fn){if(listeners.get(prefix+type)===fn)listeners.delete(prefix+type);}});
    let document;
    class Input{constructor(){this.isConnected=true;this.disabled=false;this.type='text';this.value='owned-stdio';this.selectionStart=0;this.selectionEnd=0;this.selectionDirection='none';this.focused=0;this.selected=0;this.hidden=false;this.rects=[{}];this.style={display:'block',visibility:'visible'};}closest(){return this.hidden?{}:null;}getClientRects(){return this.rects;}focus(){this.focused++;document.activeElement=this.redirect||this;}select(){this.selected++;this.selectionStart=0;this.selectionEnd=this.value.length;}}
    const name=new Input(),args=new Input(),origin={},body={},owner=new Input();owner.querySelector=()=>noInput?null:name;owner.contains=element=>[owner,name,args].includes(element);
    document=eventOwner('document:',{activeElement:initialNameFocus?name:origin,body});
    const window=eventOwner('window:',{location:{href:'http://127.0.0.1/gui.html'},getComputedStyle:element=>element.style,setTimeout(fn,delay){assert.equal(delay,50);callbacks.push(fn);timers.set(++sequence,fn);return sequence;},clearTimeout(id){timers.delete(id);}});
    const context=vm.createContext({document,window,HTMLInputElement:Input});vm.runInContext(source,context);
    const ref={current:owner},start=()=>context.gamecoworkScheduleDialogFocus(ref,true),force=()=>callbacks.at(-1)?.(),fire=(event,target)=>listeners.get('document:'+event)?.({target});
    return{name,args,origin,body,owner,document,window,ref,listeners,timers,start,force,fire};
  }
  test(label+': actual 50ms dialog callback focuses/selects the owned unchanged input and cleans its listeners',()=>{
    const h=harness();h.start();h.force();assert.equal(h.document.activeElement,h.name);assert.equal(h.name.focused,1);assert.equal(h.name.selected,1);assert.equal(h.listeners.size,0);assert.equal(h.timers.size,0);
  });
  test(label+': a user choosing command/argv cancels old name focus, even if its cleared callback is delivered late',()=>{
    const h=harness();h.start();h.document.activeElement=h.args;h.fire('focusin',h.args);h.force();assert.equal(h.document.activeElement,h.args);assert.equal(h.name.focused,0);assert.equal(h.name.selected,0);assert.equal(h.listeners.size,0);
  });
  test(label+': typing, pointer and keyboard intent preserve an already focused name instead of selecting its text',()=>{
    for(const event of ['beforeinput','input','pointerdown','keydown']){const h=harness({initialNameFocus:true});h.start();h.name.value='user edited name';h.fire(event,h.name);h.force();assert.equal(h.name.value,'user edited name');assert.equal(h.name.focused,0);assert.equal(h.name.selected,0);assert.equal(h.listeners.size,0);}
  });
  test(label+': changing an input selection cancels pending focus without requiring a key event',()=>{
    const h=harness({initialNameFocus:true});h.start();h.name.selectionStart=3;h.name.selectionEnd=8;h.fire('selectionchange');h.force();assert.equal(h.name.selected,0);assert.equal(h.name.selectionStart,3);assert.equal(h.name.selectionEnd,8);assert.equal(h.listeners.size,0);
  });
  test(label+': rerendering an active text field does not schedule another select-all or steal the user selection',()=>{
    const h=harness({initialNameFocus:true});h.name.selectionStart=3;h.name.selectionEnd=3;h.start();h.force();assert.equal(h.name.focused,0);assert.equal(h.name.selected,0);assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);assert.equal(h.name.selectionStart,3);
  });
  test(label+': close, replaced modal/ref, disconnected/hidden/disabled target and navigation cannot reuse an old timer',()=>{
    for(const change of [(h,stop)=>stop(),h=>{h.ref.current={};},h=>{h.owner.isConnected=false;},h=>{h.name.isConnected=false;},h=>{h.name.hidden=true;},h=>{h.name.disabled=true;},h=>{h.name.rects=[];},h=>{h.name.style.visibility='hidden';},h=>{h.window.location.href+='#other';},h=>h.listeners.get('window:pagehide')?.()]){const h=harness();const stop=h.start();change(h,stop);h.force();assert.equal(h.name.focused,0);assert.equal(h.name.selected,0);assert.equal(h.listeners.size,0);}
  });
  test(label+': a modal without text fields still receives normal initial container focus',()=>{const h=harness({noInput:true});h.owner.type='radio';h.start();h.force();assert.equal(h.document.activeElement,h.owner);assert.equal(h.owner.focused,1);assert.equal(h.owner.selected,0);});
  test(label+': another handler redirecting focus cannot leave a selection on the stale name target',()=>{const h=harness();h.name.redirect=h.args;h.start();h.force();assert.equal(h.document.activeElement,h.args);assert.equal(h.name.selected,0);});
  test(label+': actual modal effect owns message identity and delegates to the guarded callback',()=>{
    const body=main.slice(end,main.indexOf('\n};',end)+3);assert.ok(body.includes('return gamecoworkScheduleDialogFocus(t, r);'));assert.match(body,/\[e\.showDialog, r, e\.message\]/);assert.ok(!body.includes('const A = window.setTimeout('));
  });
  const helperStart=vsc.indexOf('function gamecoworkParseMcpArgs('),formStart=vsc.indexOf('const '+form+' = E.forwardRef',helperStart),submitStart=vsc.indexOf('  const M = async () => {',formStart),submitEnd=vsc.indexOf(',\n    N = async () => {',submitStart);assert.ok(helperStart>=0&&formStart>helperStart&&submitEnd>submitStart);
  const helpers=vsc.slice(helperStart,formStart),submit=vsc.slice(submitStart+'  const M = '.length,submitEnd);
  test(label+': actual MCP handler preserves independent identity while argv/env/type/storage change',async()=>{
    const rows=[],context={m:'owned-stdio',g:'stdio',x:'project',C:{command:'F:\\Owned Tools\\node.exe',argsString:'["server with space.mjs",""]',env:[],headers:[]},t:value=>rows.push(JSON.parse(JSON.stringify(value))),gamecoworkSetArgsError(){}};
    const invoke=vm.runInNewContext(helpers+'\n('+submit+')',context);await invoke();assert.equal(rows.at(-1).name,'owned-stdio');assert.deepEqual(rows.at(-1).args,['server with space.mjs','']);
    context.C.argsString='["different argv", "%HOME%"]';context.C.env=[{key:'OWNED',value:'fixture'}];context.x='global';await invoke();assert.equal(rows.at(-1).name,'owned-stdio');assert.deepEqual(rows.at(-1).args,['different argv','%HOME%']);assert.equal(rows.at(-1).storageLevel,'global');
    context.g='streamable-http';context.C.url='http://127.0.0.1/mcp';await invoke();assert.equal(rows.at(-1).name,'owned-stdio');assert.equal(rows.at(-1).url,context.C.url);assert.equal(rows.at(-1).args,undefined);
    context.m='owned-renamed';await invoke();assert.equal(rows.at(-1).name,'owned-renamed');
  });
  test(label+': actual Agent permission import/export selector reaches the active session permission vector',()=>{
    const permissionHook=label==='current'?'nN':'eN',start=main.indexOf('function '+permissionHook+'({ request: e }) {'),stop=main.indexOf('\nfunction ',start+1);
    const hook=main.slice(start,stop),alias=/gamecoworkPermissionRequests = M\(([$\w]+)\)/.exec(hook)?.[1];assert.ok(alias,'Permission hook calls its actual imported selector');
    const imported=new RegExp('([$\\w]+) as '+alias.replaceAll('$','\\$')+',').exec(main)?.[1];assert.ok(imported);
    const exported=new RegExp('([$\\w]+) as '+imported.replaceAll('$','\\$')+',').exec(vsc)?.[1];assert.ok(exported);
    const selected=new RegExp(exported.replaceAll('$','\\$')+' = yr\\(([$\\w]+), \\(e\\) => e\\)').exec(vsc);assert.ok(selected,'Actual imported export must be the identity projection of a request-vector getter');
    const getter=selected[1],getterStart=vsc.indexOf(getter+' = (e) => {'),getterEnd=vsc.indexOf('\n  },',getterStart);assert.ok(getterStart>=0&&getterEnd>getterStart);
    const getterSource=vsc.slice(getterStart+(getter+' = ').length,getterEnd+4),tr=/Tr = (\(e\) => e\.session\.sessions\[e\.session\.activeSessionId\])/.exec(vsc)?.[1];assert.ok(tr);
    const fn=vm.runInNewContext('const Tr='+tr+';const getter='+getterSource+';const project=(e)=>e;(state)=>project(getter(state));');
    const pendingA=[{requestId:'owned-A',sessionId:'A'}],pendingB=[{requestId:'owned-B',sessionId:'B'}],state={session:{activeSessionId:'A',sessions:{A:{pendingAcpPermissionRequests:pendingA},B:{pendingAcpPermissionRequests:pendingB}}}};
    assert.equal(fn(state),pendingA);state.session.activeSessionId='B';assert.equal(fn(state),pendingB);state.session.activeSessionId='missing';assert.deepEqual(JSON.parse(JSON.stringify(fn(state))),[]);
  });
}
