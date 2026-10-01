// Evaluate the actual two generations' approval hooks and keyboard matchers.
// This covers browser modifier semantics; it does not inject native OS keys.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const directory=fileURLToPath(new URL('../../src/frontend/bundle/assets/',import.meta.url));
const generations=[
  {index:'index-BRxZ4eG7.js',theme:'VscTheme-BExNMG_K.js',hook:'oN',permissionHook:'nN',keyboard:'at'},
  {index:'index-DvRYaIVa.js',theme:'VscTheme-B-CSeuv5.js',hook:'sN',permissionHook:'eN',keyboard:'At'},
];
const rejectionDescriptions=['Cancel pending tool call','Reject shell command','Reject shell confirmation'];
const key=(modifiers={})=>({key:'Backspace',ctrlKey:false,metaKey:false,altKey:false,shiftKey:false,repeat:false,...modifiers});

function actualMatcher(source){
  const start=source.indexOf('  matchesEvent(',source.indexOf('compositionEndedAt'));
  const end=source.indexOf('  getBindingSpecificity(',start);
  assert.ok(start>=0&&end>start,'Actual composition-aware keyboard matcher must be present');
  return vm.runInNewContext('({'+source.slice(start,end)+'}).matchesEvent');
}
function actualBindings(source,generation,platform,jetbrains){
  const start=source.indexOf('function '+generation.hook+'() {');
  const end=source.indexOf('\nfunction ',start+1);
  assert.ok(start>=0&&end>start,'Actual approval hook must be present');
  const hook=source.slice(start,end),bindings=[];
  const context={navigator:{platform},d:{useContext:()=>{}},tt:0,st:0,
    Ge:()=>()=>{},ze:()=>()=>{},M:()=>null,_o:()=>jetbrains,
    it:{CRITICAL:10},ot:{CRITICAL:10},
    [generation.keyboard]:(key,handler,options)=>bindings.push({key,handler,...options}),
  };
  for(const match of hook.matchAll(/\bM\(([$\w]+)\)/g))context[match[1]]=0;
  vm.runInNewContext(hook+'\n'+generation.hook+'();',context);
  return bindings.filter(binding=>rejectionDescriptions.includes(binding.description));
}
function actualPermissionBinding(source,generation,platform,jetbrains,change={}){
  const start=source.indexOf('function '+generation.permissionHook+'({ request: e }) {');
  const end=source.indexOf('\nfunction ',start+1),hook=source.slice(start,end);
  const declarations=hook.slice(hook.indexOf('  const gamecoworkPermissionRequests'),hook.indexOf(';',hook.indexOf('  const gamecoworkPermissionRequests'))+1);
  const replyStart=hook.indexOf('  const o = d.useCallback('),replyEnd=hook.indexOf(',\n    i =',replyStart);
  const reply=hook.slice(replyStart,replyEnd)+';';
  const bindingStart=hook.indexOf('    '+generation.keyboard+'("Backspace"'),bindingEnd=hook.indexOf('\n    '+generation.keyboard+'(',bindingStart+1);
  assert.ok(start>=0&&declarations&&replyStart>=0&&replyEnd>replyStart&&bindingStart>=0&&bindingEnd>bindingStart,'Actual Agent permission binding and reply must exist');
  const binding=hook.slice(bindingStart,bindingEnd).replace(/,\s*$/,';');
  const request={requestId:'permission-A',sessionId:'session-A',options:[{kind:'allow_once',optionId:'allow-issued'},{kind:'reject_once',optionId:'reject-issued'}],...change.request};
  const pending=change.pending||[request],calls=[];let captured;
  const selector=/gamecoworkPermissionRequests = M\(([$\w]+)\)/.exec(declarations)?.[1];
  assert.ok(selector,'Actual permission selector alias is present');
  const toolbar={isConnected:true,getClientRects:()=>[{}],closest:()=>change.hiddenAncestor||null,contains:()=>false,...change.toolbar};
  const focusedToolbar=change.focusedToolbar==='self'?toolbar:change.focusedToolbar||null;
  const context={navigator:{platform},window:{GAMECOWORK_SHELL:change.shell!==false},
    document:{activeElement:{closest:selector=>selector==='.tool-permission-toolbar'?focusedToolbar:change.focusedDialog||focusedToolbar}},
    getComputedStyle:()=>({visibility:change.visibility||'visible',display:'block'}),
    M:()=>pending,[selector]:0,_o:()=>jetbrains,e:request,n:{current:toolbar},
    d:{useCallback:fn=>fn},Es:(requestId,optionId)=>calls.push({requestId,optionId}),
    it:{CRITICAL:10},ot:{CRITICAL:10},
    [generation.keyboard]:(key,handler,options)=>{captured={key,handler,...options};},
  };
  vm.runInNewContext(declarations+'\n'+reply+'\n'+binding,context);
  return {binding:captured,calls};
}

const platforms=[
  {name:'Windows',platform:'Win32',jetbrains:false,modifiers:{ctrlKey:true}},
  {name:'Linux',platform:'Linux x86_64',jetbrains:false,modifiers:{ctrlKey:true}},
  {name:'Mac',platform:'MacIntel',jetbrains:false,modifiers:{metaKey:true}},
  {name:'Windows JetBrains',platform:'Win32',jetbrains:true,modifiers:{altKey:true}},
  {name:'Mac JetBrains',platform:'MacIntel',jetbrains:true,modifiers:{altKey:true}},
];

for(const generation of generations){
  const source=fs.readFileSync(directory+generation.index,'utf8').replaceAll('\r\n','\n');
  const matches=actualMatcher(fs.readFileSync(directory+generation.theme,'utf8').replaceAll('\r\n','\n'));
  for(const entry of platforms)test(generation.index+': '+entry.name+' Backspace matches all actual rejection flags',()=>{
    const bindings=actualBindings(source,generation,entry.platform,entry.jetbrains);
    assert.deepEqual(bindings.map(binding=>binding.description),rejectionDescriptions);
    for(const binding of bindings){
      assert.equal(matches(binding,key(entry.modifiers)),true,binding.description+' advertised modifier');
      assert.equal(matches(binding,key()),false,binding.description+' plain Backspace must not reject');
      assert.equal(matches(binding,key({ctrlKey:true,metaKey:true})),false,binding.description+' no Ctrl+Win chord');
      for(const modifiers of [{ctrlKey:true},{metaKey:true},{altKey:true}]){
        const expected=Object.keys(modifiers)[0]===Object.keys(entry.modifiers)[0];
        assert.equal(matches(binding,key(modifiers)),expected,binding.description+' exclusive platform modifier');
      }
    }
  });
  for(const entry of platforms)test(generation.index+': '+entry.name+' actual Agent binding matches modifiers and rejects the exact request',()=>{
    const {binding,calls}=actualPermissionBinding(source,generation,entry.platform,entry.jetbrains);
    assert.equal(binding.enabled,true);assert.equal(binding.capture,true);
    assert.equal(matches(binding,key(entry.modifiers)),true);
    assert.equal(matches(binding,key()),false);assert.equal(matches(binding,key({ctrlKey:true,metaKey:true})),false);
    assert.equal(binding.handler(key(entry.modifiers)),true);
    assert.deepEqual(calls,[{requestId:'permission-A',optionId:'reject-issued'}]);
  });
  test(generation.index+': actual Agent shortcut rejects stale, inactive, hidden and unavailable requests',()=>{
    for(const change of [
      {pending:[]},
      {pending:[{requestId:'permission-B',sessionId:'session-A'}]},
      {pending:[{requestId:'permission-A',sessionId:'session-B'}]},
      {toolbar:{isConnected:false}},
      {toolbar:{getClientRects:()=>[]}},
      {request:{options:[{kind:'reject_once',optionId:'reject-issued',disabled:true}]}},
      {request:{options:[{kind:'allow_once',optionId:'allow-issued'}]}},
      {shell:false},
      {focusedToolbar:{id:'another-permission-toolbar'}},
      {focusedDialog:{id:'another-dialog'}},
      {hiddenAncestor:{hidden:true}},
      {hiddenAncestor:{inert:true}},
      {hiddenAncestor:{'aria-hidden':true}},
      {visibility:'hidden'},
      {visibility:'collapse'},
    ]){
      const {binding,calls}=actualPermissionBinding(source,generation,'Win32',false,change);
      assert.equal(binding.handler(key({ctrlKey:true})),false,JSON.stringify(change));
      assert.deepEqual(calls,[],JSON.stringify(change));
    }
  });
  test(generation.index+': focused second permission owns the shortcut and a held key cannot drain requests',()=>{
    const second={requestId:'permission-second',sessionId:'session-A',options:[{kind:'reject_once',optionId:'reject-second'}]};
    const {binding,calls}=actualPermissionBinding(source,generation,'Win32',false,{request:second,pending:[{requestId:'permission-first',sessionId:'session-A'},second],focusedToolbar:'self'});
    assert.equal(binding.enabled,true,'Any current active request may own focused toolbar keys');
    assert.equal(binding.handler(key({ctrlKey:true,repeat:true})),false,'Auto-repeat must not reject another request');
    assert.deepEqual(calls,[]);
    assert.equal(binding.handler(key({ctrlKey:true})),true);
    assert.deepEqual(calls,[{requestId:'permission-second',optionId:'reject-second'}]);
  });
}
