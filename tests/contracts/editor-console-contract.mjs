import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const agent=fs.readFileSync(new URL('../../src/agent/cli-main.beautified.js',import.meta.url),'utf8');
const reader=fs.readFileSync(new URL('../../src/editor-bridge/Editor/EditorConsole.cs',import.meta.url),'utf8');
const declaration=name=>{const begin=agent.indexOf('    '+(name==='f_e'?'async ':'')+'function '+name+'(');assert.ok(begin>0);return agent.slice(begin,agent.indexOf('\n    }',begin)+6);};
test('Actual console context keeps failed execution visible rather than reporting an empty success',async()=>{
 let returned={success:false,llmContent:'Own Console API unavailable',error:{message:'structured API unavailable'}};
 class RW {build(){return {execute:async()=>returned};}}
 const ctx=vm.createContext({RW,lJr:value=>value,k3r:error=>error.message});vm.runInContext(declaration('f_e'),ctx);
 const failed=await ctx.f_e('error');assert.equal(failed.success,false);assert.equal(failed.content,'Own Console API unavailable');assert.equal(failed.error,'structured API unavailable');
 returned={success:true,llmContent:'{"data":[{"message":"own sentinel"}]}'};assert.equal((await ctx.f_e('all')).success,true);
});
test('Read path never sets Console flags, filtering or EditorPrefs; partial native scope stays explicit',()=>{
 assert.doesNotMatch(reader,/EditorPrefs\s*\.|SetConsoleFlag|SetFilteringText|\.SetValue\(/);
 assert.match(reader,/nativeConsoleFiltersApplied = true/);assert.match(reader,/current-native-console-view/);assert.match(reader,/finally \{ if \(begun\) end\.Invoke/);
 assert.ok(reader.indexOf('Selective errors_only clearing')<reader.indexOf('BeginEffect(identity)'));
});
test('Actual clear verification rejects missing effect/root identity and accepts only a completed all-clear',()=>{
 const ctx=vm.createContext({gcwEditorControlGuard(){}});vm.runInContext(declaration('gcwVerifyConsoleClear'),ctx);
 const context={canonicalRoot:'f:/own',client:{normalizeProjectRootPath:value=>value.toLowerCase()}},good={success:true,cleared:true,applied:true,cancellationSupported:true,scope:'all',operationId:'a'.repeat(32),projectRoot:'F:/OWN'};
 assert.equal(ctx.gcwVerifyConsoleClear(context,good).cleared,true);
 for(const extra of [{success:false},{cleared:false},{applied:false},{cancellationSupported:false},{scope:'errors_only'},{projectRoot:'F:/other'},{operationId:'unknown'}])assert.throws(()=>ctx.gcwVerifyConsoleClear(context,{...good,...extra}),/identity/);
});
