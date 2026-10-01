import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../restored/frontend/dist-beautified/assets/", import.meta.url));
function declaration(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0);
  return source.slice(start, source.indexOf("\n}",start)+2);
}
for(const [label,file,dialog,language,input,modal] of [
  ["current","index-BRxZ4eG7.js","az","Ie","_d","Mm"],
  ["previous","index-DvRYaIVa.js","oz","ke","Bd","Lm"],
]) {
  const source=fs.readFileSync(assets+file,"utf8");
  function fixture(onRename) {
    const setters=[];let count=0,closed=0;
    const jsx=(_component,props)=>({props});
    const context=vm.createContext({d:{useState:()=>{const index=count++;return[index===0?"Owned new title":index===1?false:"",value=>setters.push({index,value})];},useRef:value=>({current:value}),useEffect(){}},
      a:{jsx,jsxs:jsx},[language]:()=>({t:key=>key}),[input]:()=>{},[modal]:()=>{},Zt:()=>{}});
    const render=vm.runInContext(`(${declaration(source,dialog)})`,context);
    const element=render({showDialog:true,currentTitle:"Old title",onRename,onClose:()=>closed++});
    return {submit:element.props.onEnter,setters,get closed(){return closed;}};
  }
  test(`${label}: actual rename dialog waits for persistence, blocking duplicate Enter`,async()=>{
    let complete,calls=0;
    const pending=new Promise(resolve=>{complete=resolve;});
    const f=fixture(()=>{calls++;return pending;});
    const first=f.submit();await f.submit();
    assert.equal(calls,1);assert.equal(f.closed,0);
    assert.ok(f.setters.some(item=>item.index===1&&item.value===true));
    complete();await first;assert.equal(f.closed,1);
    assert.equal(f.setters.at(-1).value,false);
  });
  test(`${label}: actual rename failure stays editable and does not close`,async()=>{
    const f=fixture(async()=>{throw new Error("Owned refusal");});
    await f.submit();assert.equal(f.closed,0);
    assert.ok(f.setters.some(item=>item.index===2&&item.value.includes("Owned refusal")));
    assert.equal(f.setters.at(-1).value,false);
    assert.ok(source.includes('"data-testid": "gamecowork-session-rename-error"'));
  });
  test(`${label}: history envelope errors cannot be mistaken for successful local title changes`,()=>{
    const requireSuccess=vm.runInNewContext(`(${declaration(source,"gamecoworkRequireHistorySuccess")})`);
    assert.throws(()=>requireSuccess({status:"error",error:"Owned backend failure"}),/Owned backend failure/);
    assert.throws(()=>requireSuccess({data:{status:"success",content:{status:"error",error:"Owned inner failure"}}}),/Owned inner failure/);
    const ok={status:"success",content:null};assert.equal(requireSuccess(ok),ok);
  });
  test(`${label}: a remembered conversation is accepted only for its original workspace`,()=>{
    const context=vm.createContext({});
    vm.runInContext(`const gamecoworkWorkspaceSessionMemory=new Map();\n${declaration(source,"gamecoworkRememberedSession")}\nglobalThis.remember=(key,id)=>gamecoworkWorkspaceSessionMemory.set(key,id);`,context);
    const state={session:{sessions:{a:{workspaceId:"A"},b:{workspaceId:"B"}},sessionIdToWorkspaceKey:{}}};
    context.remember("B","b");assert.equal(context.gamecoworkRememberedSession(state,"B"),"b");
    context.remember("B","a");assert.equal(context.gamecoworkRememberedSession(state,"B"),undefined);
    assert.ok(source.includes("owner === e.workspaceKey) return"));
  });
}
