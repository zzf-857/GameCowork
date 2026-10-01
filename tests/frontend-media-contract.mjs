import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets=fileURLToPath(new URL("../restored/frontend/dist-beautified/assets/",import.meta.url));
function declaration(source,name){const start=source.indexOf("function "+name+"(");assert.ok(start>=0);const asyncStart=source.slice(start-6,start)==="async "?start-6:start;return source.slice(asyncStart,source.indexOf("\n}",start)+2);}
for(const [label,gui,panel,routing,decode] of[
 ["current","index-BRxZ4eG7.js","RightSideBarPanel-JSPvAs5c.js","kt","Om"],
 ["previous","index-DvRYaIVa.js","RightSideBarPanel-B2OWNNNX.js","St","Pm"],
]){
 const main=fs.readFileSync(assets+gui,"utf8"),sidebar=fs.readFileSync(assets+panel,"utf8");
 test(`${label}: actual media URL uses the local registered route and captured workspace`,()=>{
  const at=main.indexOf('window.GAMECOWORK_SHELL ? "/api/tauri/file-explorer/media"');
  const name=main.slice(main.lastIndexOf("\nfunction ",at)).match(/function (\w+)\(/)[1];
  const window={GAMECOWORK_SHELL:true,location:{origin:"http://127.0.0.1:1234"}};
  const urlFor=vm.runInNewContext(`(${declaration(main,name)})`,{window,URL,[routing]:route=>({body:{workspaceDir:route},headers:{}}),[decode]:path=>path});
  const url=new URL(urlFor("owned.webm","F:/fixture/A"));
  assert.equal(url.pathname,"/api/tauri/file-explorer/media");assert.equal(url.searchParams.get("workspaceDir"),"F:/fixture/A");assert.equal(url.searchParams.get("path"),"owned.webm");
  window.GAMECOWORK_SHELL=false;assert.equal(new URL(urlFor("owned.webm","A")).pathname,"/api/tauri/file-preview-media");
 });
 test(`${label}: actual model loader consumes UTF-8 GLTF JSON without forcing base64`,async()=>{
  let parsed;
  const context=vm.createContext({window:{atob:value=>Buffer.from(value,"base64").toString("binary")},Uint8Array,TextDecoder,
    V9:()=>"gltf",O9:()=>[],Zm:async()=>({}),Ku:class{},z4:class{parse(value,_base,done){parsed=JSON.parse(value);done({scene:{fixture:true}});}}});
  vm.runInContext(`${declaration(sidebar,"aa")}\n${declaration(sidebar,"Ys")}\n${declaration(sidebar,"Xm")}\n${declaration(sidebar,"L9")}`,context);
  const content='{"asset":{"version":"2.0"},"scenes":[]}';
  assert.equal((await context.L9({path:"owned.gltf",encoding:"utf-8",content},()=>{})).fixture,true);
  assert.equal(parsed.asset.version,"2.0");
  await context.L9({path:"owned.gltf",encoding:"base64",content:Buffer.from(content).toString("base64")},()=>{});
  assert.equal(parsed.asset.version,"2.0");
 });
 function reducer(){const context=vm.createContext({});vm.runInContext(["$c","Vo","Kc","_T"].map(name=>declaration(sidebar,name)).join("\n"),context);return context._T;}
 const initial=(dirty=false)=>({tabs:[{id:"old.txt",path:"old.txt",file:{path:"old.txt",kind:"text",content:dirty?"DRAFT":"BEFORE"},savedContent:"BEFORE",isDirty:dirty,isPreview:!dirty}],activeId:"old.txt",history:["old.txt"],historyIndex:0});
 test(`${label}: actual renamed-tab identity/navigation follows the file and refresh accepts its new path`,()=>{
  const reduce=reducer();let state=reduce(initial(),{type:"markExternalRenamed",oldPath:"old.txt",newPath:"new.txt"});
  assert.equal(state.activeId,"new.txt");assert.equal(state.history[0],"new.txt");assert.equal(state.tabs[0].file.path,"new.txt");
  state=reduce(state,{type:"setTabResult",id:"new.txt",file:{path:"new.txt",kind:"text",content:"AFTER"}});
  assert.equal(state.tabs[0].file.content,"AFTER");
  const recreated=reduce(state,{type:"openFile",path:"old.txt",pinned:true});
  assert.equal(recreated.activeId,"old.txt");
  assert.ok(recreated.tabs.find(tab=>tab.id==="old.txt").isLoading);
 });
 test(`${label}: actual late refresh and delete preserve an unsaved draft after rename`,()=>{
  const reduce=reducer();let state=reduce(initial(true),{type:"markExternalRenamed",oldPath:"old.txt",newPath:"new.txt"});
  const refused=reduce(state,{type:"setTabResult",id:"new.txt",file:{path:"new.txt",kind:"text",content:"EXTERNAL"}});
  assert.equal(refused,state);assert.equal(state.tabs[0].file.content,"DRAFT");assert.equal(state.tabs[0].isDirty,true);
  state=reduce(state,{type:"markExternalDeleted",path:"new.txt"});
  assert.equal(state.tabs[0].externalStatus.kind,"deleted");assert.equal(state.tabs[0].file.content,"DRAFT");assert.equal(state.tabs[0].isDirty,true);
 });
}
