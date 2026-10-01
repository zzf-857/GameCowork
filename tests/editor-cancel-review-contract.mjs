// Independent review of the maintained cancellation helper; inert transport,
// no Editor, desktop, provider or user state is started by these tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../restored/cli-gamecowork/cli-main.beautified.js',import.meta.url),'utf8');
function declaration(name){const start=source.indexOf('    async function '+name+'(');assert.ok(start>=0);return source.slice(start,source.indexOf('\n    }',start)+6);}
const cancel=declaration('gcwCancelEditorControl');
test('Actual cancellation follows unknown pre-registration state until the originating request becomes known',async()=>{
 let calls=0;const ctx=vm.createContext({Date,Promise,setTimeout,gcwEditorTransient:()=>false,gcwEditorControlWire:async()=>++calls===1?{cancelled:false,applied:null,state:'unknown'}:{cancelled:true,applied:false,state:'cancelled'}});
 vm.runInContext(cancel,ctx);const outcome=await ctx.gcwCancelEditorControl({requestId:'ntb-1'});
 assert.equal(outcome.cancelled,true,'Unknown from an early separate connection must not become the terminal cancellation outcome');assert.equal(outcome.applied,false);assert.ok(calls>=2);
});
test('Actual cancellation stays idempotent and reports an already applied effect without claiming rollback',async()=>{
 let calls=0;const ctx=vm.createContext({Date,Promise,setTimeout,gcwEditorTransient:()=>false,gcwEditorControlWire:async()=>{calls++;return{cancelled:false,applied:true,state:'applied',operationId:'owned-op'};}});
 vm.runInContext(cancel,ctx);const context={requestId:'ntb-1'},[first,second]=await Promise.all([ctx.gcwCancelEditorControl(context),ctx.gcwCancelEditorControl(context)]);
 assert.equal(calls,1);assert.equal(first,second);assert.equal(first.applied,true);assert.equal(first.cancelled,false);
});
test('Actual cancellation never submits a wire cancellation before an original request ID exists',async()=>{
 const ctx=vm.createContext({Date,Promise,setTimeout,gcwEditorControlWire:()=>assert.fail('No submitted request exists')});vm.runInContext(cancel,ctx);
 const result=await ctx.gcwCancelEditorControl({});assert.equal(result.cancelled,true);assert.equal(result.applied,false);assert.equal(result.state,'not_submitted');
});
test('Actual Wiki execution returns unsupported in local mode before dispatching any network action',async()=>{
 const wikiStart=source.indexOf('    function gcwLocalWikiUnsupported('),wikiEnd=source.indexOf('\n    }',wikiStart)+6;assert.ok(wikiStart>=0);
 const classStart=source.indexOf('(t6n = class extends a_e'),methodStart=source.indexOf('            async execute(e, t) {',classStart),methodEnd=source.indexOf('            async executeListCategories(',methodStart);assert.ok(classStart>=0&&methodStart>classStart&&methodEnd>methodStart);
 const ctx=vm.createContext({process:{env:{GAMECOWORK_LOCAL_PROVIDER_MODE:'1'}},a_e:class{},fetch:()=>assert.fail('Local Wiki must not fetch')});
 vm.runInContext(source.slice(wikiStart,wikiEnd)+'\nclass ReviewedWiki extends a_e { '+source.slice(methodStart,methodEnd)+' }\nthis.ReviewedWiki=ReviewedWiki;',ctx);
 for(const action of ['list_categories','list_category','read_article']){const tool=new ctx.ReviewedWiki();tool.params={action};for(const method of ['executeListCategories','executeListCategory','executeReadArticle'])tool[method]=()=>assert.fail('Local Wiki must not dispatch '+method);const result=await tool.execute({aborted:false});assert.equal(result.success,false);assert.equal(result.supported,false);assert.equal(result.code,'local_wiki_not_configured');}
});
function awaitHarness(replies){
 const transientStart=source.indexOf('    function gcwEditorTransient('),transientEnd=source.indexOf('\n    }',transientStart)+6,calls=[];
 const ctx=vm.createContext({Date,Promise,gcwEditorControlGuard:()=>{},gcwEditorControlConnect:async()=>{},eUa:async()=>{},tC:async(command,params,options)=>{calls.push({command,params,options});return replies.shift();}});
 vm.runInContext(source.slice(transientStart,transientEnd)+'\n'+declaration('gcwAwaitEditorControl'),ctx);
 const context={requestId:'ntb-1',operationId:'owned-op',identity:{clientId:'owned',cancelToken:'owned'},action:'play',deadline:Date.now()+10000,canonicalRoot:'owned-root',client:{normalizeProjectRootPath:value=>value}};
 const pending={operationId:'owned-op',controlAction:'play',projectRoot:'owned-root',controlStatus:'pending',pending:true},completed={...pending,controlStatus:'completed',pending:false,playMode:'playing',isCompiling:false,isUpdating:false};
 return{ctx,context,pending,completed,calls};
}
test('Actual pending completion survives explicit own reload errors without replaying the mutation',async()=>{
 const replies=[],h=awaitHarness(replies);replies.push({success:false,error:'Editor bridge is reloading'},{success:true,data:h.completed});
 const result=await h.ctx.gcwAwaitEditorControl(h.context,h.pending);assert.equal(result.pending,false);assert.equal(h.calls.length,2);
 for(const call of h.calls){assert.equal(call.command,'manage_editor');assert.equal(call.params.action,'get_state');assert.equal(call.options.maxConnectRetries,1);assert.equal(call.options.controlIdentity.requestId,'ntb-1');assert.equal(call.options.controlIdentity.operationId,'owned-op');}
});
test('Actual pending completion refuses another root or operation even when reported completed',async()=>{
 for(const change of [{projectRoot:'foreign-root'},{operationId:'foreign-op'}]){const h=awaitHarness([]);await assert.rejects(h.ctx.gcwAwaitEditorControl(h.context,{...h.completed,...change}),/operation\/root identity changed/);assert.equal(h.calls.length,0);}
});
test('Actual single-frame completion requires real frame advancement while paused',async()=>{
 const h=awaitHarness([]);h.context.action='resume';h.context.singleFrame=true;
 await assert.rejects(h.ctx.gcwAwaitEditorControl(h.context,{...h.completed,controlAction:'resume',playMode:'paused',runtimeFrame:100,startFrame:100}),/without the requested actual state/);
});
