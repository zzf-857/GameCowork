// Actual maintained handler/store methods; controlled async ACP/SQLite only.
// Disk deletion is restricted to this run's own unique temporary directories.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{randomUUID}=require('node:crypto');
const directory=path.join('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests','history-clear-'+randomUUID());
fs.mkdirSync(directory,{recursive:true});
const core=path.join(__dirname,'../../src/core/binary/out');
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function blockEnd(source,opening){let depth=0;for(let i=opening;i<source.length;i++){if(source[i]==='{')depth++;else if(source[i]==='}'&&--depth===0)return i+1;}throw Error('Unterminated actual source block');}
function methodAt(source,start){let nesting=0,parametersEnd=-1;for(let i=source.indexOf('(',start);i<source.length;i++){if(source[i]==='(')nesting++;else if(source[i]===')'&&--nesting===0){parametersEnd=i;break;}}assert.ok(parametersEnd>start);const opening=source.indexOf('{',parametersEnd);return source.slice(start,blockEnd(source,opening));}
function extracted(source){
 const start=source.indexOf('async function yl('),store=source.search(/var mOe\s*=\s*class/);
 assert.ok(start>=0&&store>start,'Actual database helpers exist');
 const clear=source.indexOf('async clearAll()',store),handler=source.indexOf('n("history/clear",'),next=source.indexOf('n("tabs/reportOpenTabs",',handler);
 assert.ok(clear>store&&handler>=0&&next>handler,'Actual clear store and registered handler exist');
 return{helpers:source.slice(start,store),clear:methodAt(source,clear),handler:source.slice(handler,next)+'void 0;'};
}
function lifecycleFixture(source,{checkpoint,shutdown}={}){
 const events=[],warnings=[],root=path.join(directory,'strict-chain-'+randomUUID());fs.mkdirSync(root);const marker=path.join(root,'owned-history.txt');fs.writeFileSync(marker,'History retained unless strict retirement completes');
 const context=vm.createContext({console:{warn:(...args)=>warnings.push(args)},AggregateError});
 const begin=source.indexOf('async function lGa('),end=source.indexOf('function oGa(',begin);assert.ok(begin>=0&&end>begin);vm.runInContext(source.slice(begin,end),context);
 const lifecycleMethods=['shutdownSession','shutdownAll','retireSession'].map(name=>{const at=source.indexOf('async '+name+'(');assert.ok(at>=0);return methodAt(source,at);});
 const lifecycle=vm.runInContext('({'+lifecycleMethods.join(',')+'})',context);
 lifecycle.registry=new Map();lifecycle.initializingMap=new Map();lifecycle.stopIdleReaper=()=>events.push('reaper.stop');
 const methods=['shutdownACPForSession','shutdownACP'].map(name=>{const at=source.indexOf('async '+name+'(');assert.ok(at>=0);return methodAt(source,at);});
 const owner=vm.runInContext('({'+methods.join(',')+'})',context),holders=new Map();owner.sessionLifecycle=lifecycle;owner.stopStreamingStateCleanup=()=>events.push('stream.cleanup.stop');
 const holderFor=(id,entry)=>({current:entry,queue:{runExclusive:callback=>callback()},sideQueue:{pause:()=>events.push('pause:'+id),resume:()=>events.push('resume:'+id)}});
 owner.getHolder=id=>{if(!holders.has(id))holders.set(id,holderFor(id,lifecycle.registry.get(id)));return holders.get(id);};owner.saveCheckpointForEntry=async id=>{events.push('checkpoint:'+id);return checkpoint?.(id);};
 const construction=source.search(/sessionLifecycle\s*=\s*new mbe/),callback=source.indexOf('retireSession:',construction),arrow=source.indexOf('=>',callback),opening=source.indexOf('{',arrow);
 assert.ok(construction>=0&&callback>construction&&arrow>callback);const retirementFactory=vm.runInContext('(function(){return '+source.slice(callback+'retireSession:'.length,blockEnd(source,opening))+';})',context);
 lifecycle.options={retireSession:retirementFactory.call(owner)};
 function add(id){const entry={manager:{shutdown:async()=>{events.push('shutdown:'+id);return shutdown?.(id);}}};lifecycle.registry.set(id,entry);holders.set(id,holderFor(id,entry));return entry;}
 let removed=false;const actual=extracted(source),registration=vm.createContext({n:(kind,handler)=>owner.clearHistory=handler,t:Object.assign(owner,{acpContextUsageBySessionId:{clear:()=>events.push('usage.clear')},pushHistoryListChanged:()=>events.push('publish')}),GOe:{clearAll:async()=>{removed=true;fs.rmSync(root,{recursive:true,force:true});}}});vm.runInContext(actual.handler,registration);
 return{owner,lifecycle,events,warnings,root,marker,add,removed:()=>removed};
}
function handlerFixture(actual,{shutdown,clear}={}){
 const events=[],usage=new Map([['own-session',{tokens:10}]]);let registered;
 const context=vm.createContext({GOe:{clearAll:()=>{events.push('clear');return clear?.();}},t:{
  shutdownACP:()=>{events.push('shutdown');return shutdown?.();},
  acpContextUsageBySessionId:{clear(){events.push('usage');usage.clear();}},
  pushHistoryListChanged(){events.push('publish');}
 },n:(kind,callback)=>{assert.equal(kind,'history/clear');registered=callback;}});
 vm.runInContext(actual.handler,context);assert.equal(typeof registered,'function');return{run:()=>registered({data:{}}),events,usage};
}
function storeFixture(actual,name){
 const folder=path.join(directory,name+'-'+randomUUID());assert.ok(path.resolve(folder).startsWith(path.resolve(directory)+path.sep));
 fs.mkdirSync(folder);const marker=path.join(folder,'owned-history.txt');fs.writeFileSync(marker,'Own disposable history fixture');
 const events=[],cache=new Map(),key='owned-workspace',opened=[];
 const makeDb=()=>({exec:async()=>{},close:async()=>{events.push('db.close');}});
 const context=vm.createContext({pMt:cache,Bha:()=>key,ePn:()=>path.join(folder,'sessions.sqlite'),
  AQ:async()=>{events.push('db.open');const db=makeDb();opened.push(db);return db;},kha:{default:{Database:function(){}}},BEi:'',OEi:async()=>{},TEi:async()=>{},
  _w:()=>folder,CR:{rmSync(target,options){assert.equal(target,folder);assert.ok(path.resolve(target).startsWith(path.resolve(directory)+path.sep));events.push('delete');fs.rmSync(target,options);}}
 });
 vm.runInContext(actual.helpers,context);const store=vm.runInContext('({'+actual.clear+'})',context);
 return{folder,marker,events,cache,key,context,store,opened,makeDb};
}
for(const name of ['index.js','index.beautified.js']){
 const source=fs.readFileSync(path.join(core,name),'utf8'),actual=extracted(source);
 test(name+': actual clear reply waits for ACP shutdown and actual deletion',async()=>{
  const shutdown=deferred(),clear=deferred(),f=handlerFixture(actual,{shutdown:()=>shutdown.promise,clear:()=>clear.promise});
  let settled=false;const result=f.run().then(value=>{settled=true;return value;});await tick();
  assert.deepEqual(f.events,['shutdown']);assert.equal(settled,false);assert.equal(f.usage.size,1);
  shutdown.resolve();await tick();assert.deepEqual(f.events,['shutdown','clear']);assert.equal(settled,false);assert.equal(f.usage.size,1);
  clear.resolve();assert.deepEqual(JSON.parse(JSON.stringify(await result)),{cleared:true});assert.deepEqual(f.events,['shutdown','clear','usage','publish']);assert.equal(f.usage.size,0);
 });
 test(name+': shutdown rejection never deletes histories or publishes success',async()=>{
  const f=handlerFixture(actual,{shutdown:async()=>{throw Error('Owned shutdown failed');}});
  await assert.rejects(f.run(),/Owned shutdown failed/);assert.deepEqual(f.events,['shutdown']);assert.equal(f.usage.size,1);
 });
 test(name+': actual deletion failure rejects without clearing UI metadata',async()=>{
  const f=handlerFixture(actual,{clear:async()=>{throw Error('Owned delete denied');}});
  await assert.rejects(f.run(),/Owned delete denied/);assert.deepEqual(f.events,['shutdown','clear']);assert.equal(f.usage.size,1);
 });
 test(name+': actual store waits for close, refuses concurrent database reopen and deletes only its owned directory',async()=>{
  const f=storeFixture(actual,name),close=deferred(),db={close:()=>{f.events.push('db.close');return close.promise;}};
  const entry={db,initPromise:null};f.cache.set(f.key,entry);const clearing=f.store.clearAll();await tick();
  assert.deepEqual(f.events,['db.close']);assert.equal(fs.existsSync(f.marker),true);assert.equal(f.cache.get(f.key),entry);
  await assert.rejects(f.context.yl(),/Session history is being cleared/);assert.equal(f.opened.length,0);
  close.resolve();await clearing;assert.deepEqual(f.events,['db.close','delete']);assert.equal(fs.existsSync(f.folder),false);assert.equal(f.cache.has(f.key),false);
  const fresh=await f.context.yl();assert.notEqual(fresh,db);assert.equal(f.opened.length,1);assert.equal(f.cache.get(f.key).db,fresh);
 });
 test(name+': actual clear closes a database whose initialization was already pending',async()=>{
  const f=storeFixture(actual,name),opening=deferred(),close=deferred();f.context.AQ=()=>{f.events.push('db.open');return opening.promise;};
  const database=f.context.yl(),clearing=f.store.clearAll();await tick();assert.deepEqual(f.events,['db.open']);assert.equal(fs.existsSync(f.marker),true);
  const db={exec:async()=>{},close:()=>{f.events.push('db.close');return close.promise;}};
  opening.resolve(db);assert.equal(await database,db);await tick();assert.deepEqual(f.events,['db.open','db.close']);assert.equal(fs.existsSync(f.marker),true);
  close.resolve();await clearing;assert.deepEqual(f.events,['db.open','db.close','delete']);assert.equal(f.cache.has(f.key),false);
 });
 test(name+': failed database close keeps the cache and history available for an explicit retry',async()=>{
  const f=storeFixture(actual,name);let attempt=0;const db={close:async()=>{f.events.push('db.close');if(++attempt===1)throw Error('Owned close denied');}},entry={db,initPromise:null};f.cache.set(f.key,entry);
  await assert.rejects(f.store.clearAll(),/Owned close denied/);assert.equal(fs.existsSync(f.marker),true);assert.equal(f.cache.get(f.key),entry);assert.equal(entry.db,db);assert.equal(entry.clearPromise,null);
  await f.store.clearAll();assert.deepEqual(f.events,['db.close','db.close','delete']);assert.equal(fs.existsSync(f.folder),false);assert.equal(f.cache.has(f.key),false);
 });
 test(name+': failed deletion retains a closed cache without faking clear completion, and retry works',async()=>{
  const f=storeFixture(actual,name),entry={db:f.makeDb(),initPromise:null};f.cache.set(f.key,entry);const remove=f.context.CR.rmSync;
  f.context.CR.rmSync=()=>{f.events.push('delete.fail');throw Error('Owned history file locked');};
  await assert.rejects(f.store.clearAll(),/Owned history file locked/);assert.equal(fs.existsSync(f.marker),true);assert.equal(f.cache.get(f.key),entry);assert.equal(entry.db,null);assert.equal(entry.clearPromise,null);
  f.context.CR.rmSync=remove;await f.store.clearAll();assert.deepEqual(f.events,['db.close','delete.fail','delete']);assert.equal(f.cache.has(f.key),false);
 });
 test(name+': concurrent actual clear operations share their close/deletion future',async()=>{
  const f=storeFixture(actual,name),close=deferred();f.cache.set(f.key,{db:{close:()=>{f.events.push('db.close');return close.promise;}},initPromise:null});
  const first=f.store.clearAll(),second=f.store.clearAll();await tick();assert.deepEqual(f.events,['db.close']);close.resolve();await Promise.all([first,second]);
  assert.deepEqual(f.events,['db.close','delete']);assert.equal(f.cache.has(f.key),false);
 });
 test(name+': actual history clear explicitly requires strict retirement',async()=>{
  let options;
  // Capture the real callback argument, rather than assuming a strict default.
  let registered;vm.runInNewContext(actual.handler,{n:(_,callback)=>registered=callback,GOe:{clearAll:async()=>{}},t:{shutdownACP:async input=>options=input,acpContextUsageBySessionId:{clear(){}},pushHistoryListChanged(){}}});
  await registered({});assert.equal(options?.strict,true);
 });
 test(name+': actual strict chain refuses clear after checkpoint failure but still cleans the process',async()=>{
  const f=lifecycleFixture(source,{checkpoint:async()=>{throw Error('Owned checkpoint failed');}});f.add('session-a');
  await assert.rejects(f.owner.clearHistory({}),/Owned checkpoint failed/);assert.equal(f.removed(),false);assert.equal(fs.existsSync(f.marker),true);
  assert.ok(f.events.includes('shutdown:session-a'));assert.ok(f.events.includes('resume:session-a'));assert.ok(!f.events.includes('publish'));assert.equal(f.lifecycle.registry.size,0);
 });
 test(name+': strict cleanup continues all active and initializing processes before reporting failures',async()=>{
  const f=lifecycleFixture(source,{shutdown:async id=>{if(id==='session-a')throw Error('Owned shutdown failed');}});f.add('session-a');f.add('session-b');
  f.lifecycle.initializingMap.set('session-c',Promise.resolve({manager:{shutdown:async()=>f.events.push('shutdown:session-c')}}));
  await assert.rejects(f.owner.clearHistory({}),/Owned shutdown failed/);assert.equal(f.removed(),false);assert.equal(fs.existsSync(f.marker),true);
  for(const id of ['session-a','session-b','session-c'])assert.ok(f.events.includes('shutdown:'+id),id+' cleanup still attempted');assert.equal(f.lifecycle.registry.size,1);assert.ok(f.lifecycle.registry.has('session-a'),'Failed shutdown retains its process owner for retry');assert.equal(f.lifecycle.initializingMap.size,0);
 });
 test(name+': strict initialization failure preserves histories after completing other cleanup',async()=>{
  const f=lifecycleFixture(source);f.add('session-a');const starting=deferred();f.lifecycle.initializingMap.set('session-b',starting.promise);
  const result=f.owner.clearHistory({});const rejection=assert.rejects(result,/Owned initialization failed/);await tick();assert.equal(f.removed(),false);assert.equal(fs.existsSync(f.marker),true);starting.reject(Error('Owned initialization failed'));await rejection;
  assert.ok(f.events.includes('shutdown:session-a'));assert.equal(f.lifecycle.registry.size,0);
 });
 test(name+': non-clear legacy shutdown retains its previous checkpoint-error tolerance',async()=>{
  const f=lifecycleFixture(source,{checkpoint:async()=>{throw Error('Owned checkpoint failed');}});f.add('session-a');await f.owner.shutdownACP();
  assert.ok(f.events.includes('shutdown:session-a'),f.warnings.map(args=>args.map(String).join(' ')).join('\n'));assert.ok(f.events.includes('resume:session-a'));assert.equal(f.removed(),false);assert.equal(f.lifecycle.registry.size,0);
 });
 test(name+': failed strict shutdown retains the same manager and a retry must stop it before deleting',async()=>{
  let attempts=0;const f=lifecycleFixture(source,{shutdown:async()=>{if(++attempts===1)throw Error('Owned shutdown retry required');}}),entry=f.add('session-a');
  await assert.rejects(f.owner.clearHistory({}),/Owned shutdown retry required/);assert.equal(f.removed(),false);assert.equal(f.lifecycle.registry.get('session-a'),entry);assert.equal(fs.existsSync(f.marker),true);
  await f.owner.clearHistory({});assert.equal(attempts,2);assert.equal(f.lifecycle.registry.size,0);assert.equal(f.removed(),true);assert.equal(fs.existsSync(f.marker),false);assert.equal(f.events.filter(event=>event==='publish').length,1);
 });
 test(name+': initialized manager whose first shutdown failed remains owned for the next clear',async()=>{
  let attempts=0;const f=lifecycleFixture(source),entry={manager:{shutdown:async()=>{f.events.push('shutdown:session-new');if(++attempts===1)throw Error('Owned initialized cleanup failed');}}};f.lifecycle.initializingMap.set('session-new',Promise.resolve(entry));
  await assert.rejects(f.owner.clearHistory({}),/Owned initialized cleanup failed/);assert.equal(f.lifecycle.registry.get('session-new'),entry);assert.equal(f.removed(),false);assert.equal(fs.existsSync(f.marker),true);
  await f.owner.clearHistory({});assert.equal(attempts,2);assert.equal(f.lifecycle.registry.size,0);assert.equal(f.removed(),true);
 });
 test(name+': strict retirement reports checkpoint and shutdown failures together while retaining cleanup ownership',async()=>{
  const f=lifecycleFixture(source,{checkpoint:async()=>{throw Error('Owned checkpoint failed');},shutdown:async()=>{throw Error('Owned shutdown failed');}}),entry=f.add('session-a');
  await assert.rejects(f.owner.clearHistory({}),error=>{assert.match(error.message,/Owned checkpoint failed/);assert.match(error.message,/Owned shutdown failed/);return true;});
  assert.equal(f.removed(),false);assert.equal(f.lifecycle.registry.get('session-a'),entry);assert.ok(f.events.includes('shutdown:session-a'));assert.ok(f.events.includes('resume:session-a'));
 });
}
test.after(()=>{fs.writeFileSync(path.join(directory,'scope.json'),JSON.stringify({coreEntries:['index.js','index.beautified.js'],actualExtractedMethods:true,controlledACPAndSQLite:true,onlyOwnedTemporaryHistory:true,realCoreOrCLIProcessStarted:false,providerInvoked:false},null,2));console.log('Artifacts: '+directory);});
