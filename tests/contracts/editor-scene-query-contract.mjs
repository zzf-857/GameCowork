import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../../src/agent/cli-main.beautified.js',import.meta.url),'utf8');
class Base { constructor(name,display,description,schema,command,kind){Object.assign(this,{name,display,description,schema,command,kind});} }
const context=vm.createContext({zu:Base,pF:{manage_scene:'manage_scene',manage_gameobject:'manage_gameobject'},qk:{Read:'read',Other:'other'}});
const start=source.indexOf('(gcwSceneQueryTool = class'),end=source.indexOf('          (Yp = class {',start);
assert.ok(start>0&&end>start);vm.runInContext(source.slice(start,end).trim().replace(/,$/,''),context);
const scene=new context.gcwSceneQueryTool(),objects=new context.gcwGameObjectQueryTool();
test('Actual Agent registry retains query actions and exposes only the implemented approved scene/object edits',()=>{
 assert.equal(scene.name,'unity_scene');assert.equal(objects.name,'unity_gameobject');assert.equal(scene.kind,'other');assert.equal(objects.kind,'other');
 assert.deepEqual(Array.from(scene.schema.properties.action.enum),['get_hierarchy','save']);assert.deepEqual(Array.from(objects.schema.properties.action.enum),['find','list_children','get_components','create','modify']);
 const registry=source.slice(source.indexOf('(Yp.tools = ['),source.indexOf(']),',source.indexOf('(Yp.tools = [')));assert.match(registry,/new gcwSceneQueryTool\(\)/);assert.match(registry,/new gcwGameObjectQueryTool\(\)/);
 for(const action of ['delete','load','execute']) {assert.ok(scene.validateToolParams({action}));assert.ok(objects.validateToolParams({action}));}
 assert.equal(scene.validateToolParams({action:'save'}),null);
 assert.equal(objects.validateToolParams({action:'create',name:'Owned Empty',position:[1,2,3]}),null);
 assert.equal(objects.validateToolParams({action:'modify',target:{id:-9},setActive:false}),null);
});
test('Actual schemas reject ambiguous selector shapes and imprecise instance IDs',()=>{
 for(const term of ['1x','1.5','1e2','2147483648','-2147483649',''])assert.ok(objects.validateToolParams({action:'find',searchMethod:'by_id',searchTerm:term}));
 for(const term of ['-2147483648','0','2147483647'])assert.equal(objects.validateToolParams({action:'find',searchMethod:'by_id',searchTerm:term}),null);
 for(const target of [null,[],{},true,{id:1,name:'x'},{name:'x',extra:1},{id:1.5},{id:'2147483648'},{id:false},'',1.5])assert.ok(objects.validateToolParams({action:'get_components',target}));
 for(const target of [-123,{id:'-123'},{name:'Exact Name'},{hierarchy_path:'Root/Child'}])assert.equal(objects.validateToolParams({action:'get_components',target}),null);
 for(const key of ['findAll','searchInactive','includeNonPublicSerialized'])assert.ok(objects.validateToolParams({action:'find',searchTerm:'Owned', [key]:'true'}));
});
test('Actual @GameObject name consumer receives nested real query rows, including empty matches',()=>{
 for(const name of ['tmu','EQ','_Q','h_e']) {const begin=source.indexOf('    function '+name+'(');assert.ok(begin>0);vm.runInContext(source.slice(begin,source.indexOf('\n    }',begin)+6),context);}
 const populated={success:true,data:{success:true,data:[{name:'Own Child',instanceID:-9}]}};
 assert.equal(context._Q(populated),true);assert.deepEqual(Array.from(context.h_e(context.EQ(populated))),['Own Child']);
 const empty={success:true,data:{success:true,data:[]}};assert.equal(context._Q(empty),true);assert.deepEqual(Array.from(context.h_e(context.EQ(empty))),[]);
});
