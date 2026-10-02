import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../../src/agent/cli-main.beautified.js',import.meta.url),'utf8');
class Base {constructor(name,display,description,schema,command,kind){Object.assign(this,{name,display,description,schema,command,kind});}}
const ctx=vm.createContext({zu:Base,pF:{manage_scene:'manage_scene',manage_gameobject:'manage_gameobject',manage_editor:'manage_editor'},qk:{Read:'read',Other:'other'}});
for(const [begin,end] of [['(gcwSceneQueryTool = class','          (Yp = class {'],['(Vpe = class','          (Vpe.Name = "unity_editor")'],['(qpe = class','          (qpe.Name = "unity_package")'],['(RW = class','          (RW.Name = "unity_console")']]){
 const a=source.indexOf(begin),b=source.indexOf(end,a);assert.ok(a>0&&b>a);
 const text=source.slice(a,b+(end.includes('Name =')?end.length:0)).trim().replace(/[;,]$/,'');vm.runInContext(text,ctx);
}
const assets=new ctx.gcwAssetQueryTool(),editor=new ctx.Vpe(),packages=new ctx.qpe(),scene=new ctx.gcwSceneQueryTool(),objects=new ctx.gcwGameObjectQueryTool();
test('Actual asset/package descriptors expose only real local read operations and bounded input',()=>{
 assert.equal(assets.name,'unity_asset');assert.equal(assets.command,'manage_asset');assert.equal(assets.kind,'read');
 assert.deepEqual(Array.from(assets.schema.properties.action.enum),['search','get_info']);
 assert.equal(assets.validateToolParams({action:'get_info',path:'Assets/Owned.mat',generatePreview:true}),null);
 for(const extra of [{path:'../outside'},{pageSize:101},{pageNumber:1.2},{generatePreview:'true'},{filterDateAfter:'not-a-date'}])assert.ok(assets.validateToolParams({action:'search',...extra}));
 assert.deepEqual(Array.from(packages.schema.properties.action.enum),['list_packages']);assert.equal(packages.kind,'read');
 for(const action of ['install_package','remove_package'])assert.ok(packages.validateToolParams({action,id_or_url:'owned'}));
 for(const timeoutSeconds of [0,301,'2',1.2])assert.ok(packages.validateToolParams({action:'list_packages',timeoutSeconds}));
});
test('Actual read policy cannot shadow the executed action with command/operation selectors',()=>{
 const name='b'+String.fromCharCode(36)+'a',a=source.indexOf('    function '+name+'('),b=source.indexOf('\n    }',a)+6;assert.ok(a>0);
 const begin=source.indexOf('($0u = {'),end=source.indexOf('          (G0u =',begin);assert.ok(begin>0&&end>begin);
 ctx.j0u=new Set(['unity_screenshot']);vm.runInContext(source.slice(begin,end).trim().replace(/,$/,''),ctx);vm.runInContext(source.slice(a,b),ctx);
 const policy=ctx[name];
 for(const [tool,args] of [['unity_editor',{action:'play',command:'get_state'}],['unity_console',{action:'clear',command:'get'}],['unity_editor',{action:'stop',operation:'get_selection'}],['unity_scene',{action:'save',command:'get_hierarchy'}]])assert.equal(policy(tool,args),false);
 assert.ok(editor.validateToolParams({action:'play',command:'get_state'}));assert.ok(new ctx.RW().validateToolParams({action:'clear',scope:'all',command:'get'}));
 for(const [tool,action] of [['unity_editor','get_tags'],['unity_gameobject','get_components'],['unity_asset','search'],['unity_package','list_packages']])assert.equal(policy(tool,{action}),true);
});
test('Actual Editor descriptor offers context reads while preserving control validation',()=>{
 for(const action of ['get_project_root','get_selection','get_windows','get_tags','get_layers','get_active_tool'])assert.equal(editor.validateToolParams({action}),null);
 assert.ok(editor.validateToolParams({action:'set_active_tool'}));assert.ok(editor.validateToolParams({action:'resume'}));
 assert.equal(editor.validateToolParams({action:'resume',singleFrame:false}),null);
});
test('Actual mutation inputs reject incomplete transforms, bad targets and SaveAs paths before dispatch',()=>{
 for(const vector of [[1,2],[1,2,NaN],[1,2,Infinity],[1,2,1e40],['1',2,3]])assert.ok(objects.validateToolParams({action:'modify',target:{id:-1},position:vector}));
 for(const value of [{},{target:{}},{target:{id:1,name:'owned'}},{target:{id:1},setActive:'false'}])assert.ok(objects.validateToolParams({action:'modify',...value}));
 assert.ok(objects.validateToolParams({action:'create',name:'Owned',parent:{id:1,name:'Other'}}));
 assert.equal(objects.validateToolParams({action:'create',name:'Owned',parent:{id:-7},rotation:[0,90,0]}),null);
 for(const path of ['Assets/../Other.unity','F:/outside.unity','Assets/Owned.prefab','Assets\\Owned.unity'])assert.ok(scene.validateToolParams({action:'save',path}));
});
test('Actual mutation result verifier requires a completed original effect and actual save/object result',()=>{
 const a=source.indexOf('    function gcwVerifySceneMutation('),b=source.indexOf('\n    }',a)+6;assert.ok(a>0);
 vm.runInContext(source.slice(a,b),ctx);ctx.gcwEditorControlGuard=()=>{};
 const context={action:'save',canonicalRoot:'f:/owned',client:{normalizeProjectRootPath:value=>value.toLowerCase()}},good={success:true,applied:true,cancellationSupported:true,operationId:'a'.repeat(32),projectRoot:'F:/OWNED',command:'manage_scene',action:'save',saved:true,dirty:false,scenePath:'Assets/Owned.unity'};
 assert.equal(ctx.gcwVerifySceneMutation(context,good,'manage_scene').saved,true);
 for(const change of [{applied:false},{projectRoot:'F:/other'},{action:'create'},{command:'manage_gameobject'},{operationId:'wrong'},{saved:false},{dirty:true}])assert.throws(()=>ctx.gcwVerifySceneMutation(context,{...good,...change},'manage_scene'));
 context.action='modify';const modified={...good,action:'modify',command:'manage_gameobject',target:{instanceID:-6}};
 assert.equal(ctx.gcwVerifySceneMutation(context,modified,'manage_gameobject').target.instanceID,-6);
 assert.throws(()=>ctx.gcwVerifySceneMutation(context,{...modified,target:null},'manage_gameobject'));
 assert.match(source,/gcwControl && !gcwImmediateEffect/);
 assert.match(source,/Originating scene project changed while awaiting approval/);
});
test('Actual cancellation consumer retains confirmed effect state and keeps generic unrelated cancellations',()=>{
 const a=source.indexOf('    function gcwEditorCancellationReason('),b=source.indexOf('\n    }',a)+6;assert.ok(a>0);
 class Invocation {constructor(command,action){this.command=command;this.params={action};}}
 const scope=vm.createContext({mQ:Invocation,gcwIsEditorControl:(command,p)=>command==='manage_editor'&&p.action==='play',gcwIsSceneMutation:(command,p)=>command==='manage_scene'&&p.action==='save'});
 vm.runInContext(source.slice(a,b),scope);const call=new Invocation('manage_scene','save');
 assert.match(scope.gcwEditorCancellationReason(call,{data:{applied:true,cancelled:false}}),/applied:true.*did not roll it back/);
 assert.match(scope.gcwEditorCancellationReason(call,{data:{applied:false,cancelled:true}}),/applied:false/);
 assert.match(scope.gcwEditorCancellationReason(call,{data:{applied:null}}),/unconfirmed/);
 assert.equal(scope.gcwEditorCancellationReason(new Invocation('manage_editor','get_state'),{data:{applied:true}}),'User cancelled tool execution.');
 assert.equal(scope.gcwEditorCancellationReason({command:'manage_scene',params:{action:'save'}},{data:{applied:true}}),'User cancelled tool execution.');
 const start=source.indexOf('m.then(async (g) =>');assert.match(source.slice(start,start+1500),/setStatusInternal\(a, "cancelled", cancellationReason, E\)/);
});
test('Actual scheduler serializes own Unity effects in mixed tools while retaining query batching',()=>{
 const a=source.indexOf('            isSerialMutatorCall(e) {'),b=source.indexOf('            attemptExecutionOfScheduledCalls(e) {',a);assert.ok(a>0&&b>a);
 class Invocation {constructor(command,action){this.command=command;this.params={action};}}
 const scope=vm.createContext({mQ:Invocation,gcwIsEditorControl:(command,p)=>command==='manage_editor'&&p.action==='play',gcwIsSceneMutation:(command,p)=>command==='manage_scene'&&p.action==='save'||command==='manage_gameobject'&&['create','modify'].includes(p.action),ZJr:(_name,kind)=>kind==='edit'});
 vm.runInContext('class Scheduler {'+source.slice(a,b)+'}\nthis.Scheduler=Scheduler;',scope);
 const scheduler=new scope.Scheduler(),call=(command,action,kind='other')=>({invocation:new Invocation(command,action),request:{name:command},tool:{kind}});
 const read=call('manage_gameobject','find'),write=call('manage_gameobject','modify'),save=call('manage_scene','save');
 assert.equal(scheduler.isSerialMutatorCall(write),true);assert.equal(scheduler.isSerialMutatorCall(save),true);
 assert.equal(scheduler.isSerialMutatorCall(read),false);
 assert.equal(scheduler.nextExecutableBatch([read,read,write,save]).length,2);
 assert.equal(scheduler.nextExecutableBatch([write,save,read]).length,1);
 assert.equal(scheduler.nextExecutableBatch([save,read]).length,1);
});
