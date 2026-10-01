// Actual maintained helpers, card renderer, and scanner from both generations.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const directory=fileURLToPath(new URL('../../src/frontend/bundle/assets/',import.meta.url));
const plain=value=>JSON.parse(JSON.stringify(value));
const editor={version:'2022.3.62t16',semver:'1.10.4',path:'E:/Actual Editor/Editor/Tuanjie.exe',product:'tuanjie',architecture:'x86_64',location:['E:/Actual Editor/Editor/Tuanjie.exe'],folderPath:'E:/Actual Editor/Editor',modules:[{id:'windows',selected:true}],buildPlatformShortNames:['Windows'],manual:true};
function runtime(source,shell=true){
 const helpers=source.slice(source.indexOf('function gamecoworkEditorProduct('),source.indexOf('function so('));
 assert.ok(helpers.startsWith('function gamecoworkEditorProduct('));
 const context=vm.createContext({window:{GAMECOWORK_SHELL:shell,location:{origin:'http://127.0.0.1:34343'}},eo:value=>value.substring(0,Math.max(value.lastIndexOf('/'),value.lastIndexOf('\\')))});
 vm.runInContext(helpers,context);return context;
}
function walk(node){if(!node||typeof node!=='object')return [];return [node,...Object.values(node).flatMap(value=>Array.isArray(value)?value.flatMap(walk):walk(value))];}
function actualScanner(source,context,{request,previous=[editor]}={}){
 const start=source.indexOf('  const Q = n.useCallback(async () => {',source.indexOf('function oo('));
 const end=source.indexOf('\n  }, [c]);',start),code=source.slice(start+'  const Q = n.useCallback('.length,end+4);
 assert.ok(start>=0&&end>start,'Actual installed-editor scan callback exists');
 const rows=[],errors=[],busy=[];Object.assign(context,{c:{request},Te:previous,gamecoworkInstalledGeneration:{current:0},x:value=>rows.push(value),gamecoworkSetInstalledError:value=>errors.push(value),gamecoworkSetInstalledBusy:value=>busy.push(value)});
 const run=vm.runInContext('('+code+')',context);return {run,rows,errors,busy};
}

for(const name of ['TJHubRoute-DN1YDDd-.js','TJHubRoute-D42CgVct.js']){
 const source=fs.readFileSync(directory+name,'utf8');
 test(name+': old native entries normalize real paths without fabricated module metadata',()=>{
  const ctx=runtime(source),old={version:editor.version,path:'E:\\Actual Editor\\Editor\\Tuanjie.exe',product:'tuanjie'};
  const value=ctx.gamecoworkNormalizeEditor(old);
  assert.equal(value.path,editor.path);assert.deepEqual(plain(value.location),[editor.path]);assert.equal(value.folderPath,editor.folderPath);
  assert.equal(value.semver,editor.version);assert.equal(value.manual,true);assert.equal(value.modules,undefined);assert.equal(value.buildPlatformShortNames,undefined);assert.equal(value.gamecoworkModuleMetadataMissing,true);
 });
 test(name+': actual source arrays and marketing/build versions remain distinct',()=>{
  const ctx=runtime(source),value=ctx.gamecoworkNormalizeEditor(editor);
  assert.equal(value.modules,editor.modules);assert.equal(value.buildPlatformShortNames,editor.buildPlatformShortNames);
  assert.equal(value.version,'2022.3.62t16');assert.equal(value.semver,'1.10.4');assert.equal(value.gamecoworkModuleMetadataMissing,false);
  assert.equal(ctx.gamecoworkNormalizeEditor({...editor,moduleInfoAvailable:false}).gamecoworkModuleMetadataMissing,true);
 });
 test(name+': explicit Tuanjie versions remain primary while the Unity technical alias is separate',()=>{
  const ctx=runtime(source);
  for(const [technical,tuanjie] of [['2022.3.38t2','1.3.2'],['2022.3.62t16','1.10.4']]){
   const value={...editor,version:technical,technicalVersion:technical,unityVersion:technical,tuanjieVersion:tuanjie,marketingVersion:tuanjie,semver:technical};
   const display=ctx.gamecoworkEditorPresentation(value);
   assert.equal(display.primaryVersion,tuanjie);assert.equal(display.technicalVersion,technical);assert.equal(display.secondaryVersion,'Unity '+technical);
   assert.equal(ctx.gamecoworkNormalizeEditor(value).version,technical,'Display never rewrites the selection identity');
   assert.equal(ctx.gamecoworkEditorSearchMatches(value,tuanjie),true);assert.equal(ctx.gamecoworkEditorSearchMatches(value,technical),true);
   assert.equal(ctx.gamecoworkEditorRowKey(value),ctx.gamecoworkEditorRowKey({...value,tuanjieVersion:'9.9.9',marketingVersion:'9.9.9'}));
   const unity=ctx.gamecoworkEditorPresentation({...value,product:'unity',path:'E:/Actual Editor/Editor/Unity.exe'});
   assert.equal(unity.primaryVersion,technical);assert.equal(unity.secondaryVersion,'');assert.equal(unity.tuanjieVersion,null);
  }
 });
 test(name+': missing or technical-alias Tuanjie metadata falls back honestly without guessing semver',()=>{
  const ctx=runtime(source);
  for(const fields of [{},{tuanjieVersion:null,marketingVersion:null},{tuanjieVersion:editor.version},{marketingVersion:editor.version},{tuanjieVersion:'2022.3.38t2'}]){
   const display=ctx.gamecoworkEditorPresentation({...editor,semver:'1.10.4',...fields});
   assert.equal(display.primaryVersion,editor.version);assert.equal(display.secondaryVersion,'');assert.equal(display.tuanjieVersion,null);assert.match(display.versionTitle,/未获取到团结版本信息/);
  }
 });
 test(name+': actual engine PNG assets and smaller adjacent technical text are emitted by the renderer',()=>{
  const ctx=runtime(source);Object.assign(ctx,{e:{Fragment:'fragment',jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})},t:(...names)=>names.join(' '),De:'legacy-unknown-editor'});
  const tj={...editor,tuanjieVersion:'1.10.4',unityVersion:editor.version},u={...tj,product:'unity',path:'E:/Actual Editor/Editor/Unity.exe'};
  const tjIcon=ctx.gamecoworkEditorIcon(tj,'w-6 h-6'),uIcon=ctx.gamecoworkEditorIcon(u,'w-6 h-6');
  assert.equal(tjIcon.type,'img');assert.equal(tjIcon.props.src,'/icons/tuanjie.png');assert.equal(uIcon.props.src,'/icons/unity.png');assert.notEqual(tjIcon.props.alt,uIcon.props.alt);
  assert.ok(fs.existsSync(fileURLToPath(new URL('../../src/frontend/bundle'+tjIcon.props.src,import.meta.url))));
  assert.notDeepEqual(fs.readFileSync(fileURLToPath(new URL('../../src/frontend/bundle'+tjIcon.props.src,import.meta.url))),fs.readFileSync(fileURLToPath(new URL('../../src/frontend/bundle'+uIcon.props.src,import.meta.url))),'Distinct real asset bytes');
  const tree=ctx.gamecoworkEditorVersion(tj),parts=walk(tree),primary=parts.find(part=>part.props?.['data-testid']==='gamecowork-editor-display-version'),secondary=parts.find(part=>part.props?.['data-testid']==='gamecowork-editor-technical-version');
  assert.equal(primary.props.children,'1.10.4');assert.equal(secondary.type,'small');assert.equal(secondary.props.children,'Unity '+editor.version);assert.equal(secondary.props.style.fontSize,'11px');
  assert.equal(walk(ctx.gamecoworkEditorVersion(u)).filter(part=>part.props?.['data-testid']==='gamecowork-editor-technical-version').length,0);
 });
 test(name+': engine plus actual path determines stable installation identity',()=>{
  const ctx=runtime(source),key=ctx.gamecoworkEditorRowKey(editor);
  assert.equal(key,ctx.gamecoworkEditorRowKey({...editor,version:'different registry label'}));
  assert.notEqual(key,ctx.gamecoworkEditorRowKey({...editor,product:'unity'}));assert.notEqual(key,ctx.gamecoworkEditorRowKey({...editor,path:'E:/Other Editor/Tuanjie.exe',location:[]}));
 });
 test(name+': exact local editor choices separate equal technical versions and never guess a project path',()=>{
  const ctx=runtime(source),unity={...editor,product:'unity',path:'F:/Unity/Editor/Unity.exe'},rows=[editor,unity];
  assert.notEqual(ctx.gamecoworkEditorSelectionKey(editor),ctx.gamecoworkEditorSelectionKey(unity));
  assert.equal(ctx.gamecoworkInitialEditorSelection(rows,editor.version,editor.architecture), '','Ambiguous unbound selection requires explicit user choice');
  assert.equal(ctx.gamecoworkInitialEditorSelection(rows,editor.version,editor.architecture,{product:'unity',editorPath:unity.path}),ctx.gamecoworkEditorSelectionKey(unity));
  assert.deepEqual(plain(ctx.gamecoworkProjectEditorIdentity({path:'F:/Project/Tuanjie.exe'})),{product:'',editorPath:''});
  assert.equal(ctx.gamecoworkProjectEditorSameIdentity({product:'tuanjie',editorPath:editor.path},ctx.gamecoworkEditorIdentity(unity)),false);
  assert.equal(ctx.gamecoworkProjectEditorSameIdentity({product:'tuanjie',editorPath:'E:/Other/Tuanjie.exe'},ctx.gamecoworkEditorIdentity(editor)),false);
  assert.deepEqual(plain(ctx.gamecoworkProjectLaunchIdentity({product:'tuanjie',path:'F:/Project'},ctx.gamecoworkEditorIdentity(unity))),{product:'unity',editorPath:unity.path});
 });
 test(name+': actual qt modal chooses the second equal-version installation and confirms its exact identity',()=>{
  const ctx=runtime(source),unity={...editor,product:'unity',path:'F:/Unity/Editor/Unity.exe'},rows=[editor,unity],calls=[];let selected;
  Object.assign(ctx,{q:()=>({t:(key,options)=>options?.version||key}),n:{useState:initial=>{if(selected===undefined)selected=typeof initial==='function'?initial():initial;return[selected,value=>selected=value];}},t:(...names)=>names.join(' '),e:{jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})}});
  for(const symbol of['ne','ze','he','rs','Io','Ao'])ctx[symbol]=symbol;
  vm.runInContext(source.slice(source.indexOf('function qt('),source.indexOf('function Ao(',source.indexOf('function qt('))),ctx);
  const props={projectName:'Owned project',editors:rows,currentVersion:editor.version,currentArchitecture:editor.architecture,currentEditorIdentity:{product:'tuanjie',editorPath:editor.path},onSelect:(...args)=>calls.push(args),onClose:()=>{},onInstallEditor:()=>{}};
  const first=ctx.qt(props),choices=walk(first).filter(node=>node.type==='Io');assert.equal(choices.length,2);assert.notEqual(choices[0].props.value,choices[1].props.value);assert.notEqual(choices[0].key,choices[1].key);
  choices[1].props.onClick();const second=ctx.qt(props),footer=walk(second).find(node=>node.type==='Ao');assert.equal(footer.props.hasSelection,true);footer.props.onConfirm();
  assert.deepEqual(plain(calls),[[editor.version,editor.architecture,{product:'unity',editorPath:unity.path}]]);
 });
 test(name+': native project-open callbacks carry identity through shortcut and conversion paths',()=>{
  assert.match(source,/onSelect: \(y, G, identity\) => \{[\s\S]{0,110}P\(m, y, G, identity\)/);
  assert.match(source,/y === m\.version && G === m\.architecture && gamecoworkProjectEditorSameIdentity\(m, selectedIdentity\)/);
  assert.match(source,/await Qe\(m, selectedIdentity\)/);
  assert.match(source,/version: m\.version, architecture: m\.architecture, \.\.\.gamecoworkProjectLaunchIdentity\(m, selectedIdentity\)/);
  assert.match(source,/version: y, architecture: G, \.\.\.gamecoworkProjectLaunchIdentity\(m, selectedIdentity\)/);
 });
 test(name+': nonlocal editor modal retains its legacy two-argument callback and version keys',()=>{
  const ctx=runtime(source,false),calls=[];Object.assign(ctx,{q:()=>({t:(key,options)=>options?.version||key}),n:{useState:initial=>[typeof initial==='function'?initial():initial,()=>{}]},t:()=>'',e:{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}});for(const symbol of['ne','ze','he','rs','Io','Ao'])ctx[symbol]=symbol;
  vm.runInContext(source.slice(source.indexOf('function qt('),source.indexOf('function Ao(',source.indexOf('function qt('))),ctx);
  const tree=ctx.qt({editors:[editor],currentVersion:editor.version,currentArchitecture:editor.architecture,onSelect:(...args)=>calls.push(args)});walk(tree).find(node=>node.type==='Ao').props.onConfirm();assert.deepEqual(plain(calls),[[editor.version,editor.architecture]]);assert.equal(ctx.gamecoworkEditorSelectionKey(editor),editor.version+'-'+editor.architecture);assert.deepEqual(plain(ctx.gamecoworkProjectLaunchIdentity({},editor)),{});
 });
 test(name+': same-version project counts and filters preserve engine and optional exact Editor binding',()=>{
  const ctx=runtime(source),project={version:editor.version,architecture:'x86_64',product:'tuanjie',path:'F:/Owned Project'};
  assert.equal(ctx.gamecoworkProjectMatchesEditor(project,editor,false),true);
  assert.equal(ctx.gamecoworkProjectMatchesEditor({...project,product:'unity'},editor,false),false);
  assert.equal(ctx.gamecoworkProjectMatchesEditor({...project,product:undefined,path:'F:/Project/Unity.exe'},editor,false),false);
  assert.equal(ctx.gamecoworkProjectMatchesEditor({...project,editorPath:'E:/Other Editor/Tuanjie.exe'},editor,false),false);
  assert.equal(ctx.gamecoworkProjectMatchesEditor({...project,editorPath:editor.path.toUpperCase()},editor,false),true);
  assert.equal(ctx.gamecoworkEditorMatchesFilter({...editor,product:'unity'},ctx.gamecoworkEditorIdentity(editor)),false);
  assert.equal(runtime(source,false).gamecoworkProjectMatchesEditor({...project,product:'unity'},editor,false),true,'Legacy non-local callbacks retain prior matching');
 });
 test(name+': actual installed-card renderer handles absent arrays and emits exact callback identity',()=>{
  const ctx=runtime(source),calls=[];Object.assign(ctx,{q:()=>({t:(key,options)=>options?.defaultValue||key}),n:{useContext:()=>({}),useState:()=>[false,()=>{}]},ue:0,t:()=>'',je:()=>false,e:{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}});
  for(const symbol of ['De','A','Gt','lt','ge','ye','Jt','pe','to','Qs'])ctx[symbol]=symbol;
  const start=source.indexOf('function so('),end=source.indexOf('\nlet Te =',start);vm.runInContext(source.slice(start,end),ctx);
  const tree=ctx.so({editor:{version:editor.version,semver:editor.semver,path:editor.path,product:editor.product},projectCount:1,onViewProjects:(...args)=>calls.push(args)});
  assert.equal(tree.props['data-testid'],'gamecowork-editor-row');assert.equal(tree.props['data-editor-path'],editor.path);
  assert.ok(walk(tree).some(node=>node.props?.['data-testid']==='gamecowork-editor-modules-status'));
  const button=walk(tree).find(node=>node.props?.['data-testid']==='gamecowork-editor-view-projects');assert.ok(button);button.props.onClick();
  assert.equal(calls[0][0],editor.version);assert.equal(calls[0][1],undefined);assert.deepEqual(plain(calls[0][2]),{product:'tuanjie',editorPath:editor.path});
 });
 test(name+': actual projects-page projection retains explicit engine and Editor binding before filtering',()=>{
  const ctx=runtime(source),start=source.indexOf('          .map((F) => {',source.indexOf('function _o(')),body=source.indexOf('(F) => {',start),end=source.indexOf('\n          })\n          .filter',body);
  assert.ok(start>=0&&end>body,'Actual recent-projects projection exists');Object.assign(ctx,{Ts:()=>null,Ls:()=>null});
  const project=vm.runInContext('('+source.slice(body,end+'\n          }'.length)+')',ctx);
  const native={localProjectId:'own-project',path:'F:/Own Project',version:editor.version,architecture:'x86_64',product:'tuanjie',engineType:'tuanjie',editorPath:editor.path,preferredEditorPath:editor.path};
  const mapped=project(native);assert.equal(mapped.product,'tuanjie');assert.equal(mapped.engineType,'tuanjie');assert.equal(mapped.editorPath,editor.path);assert.equal(mapped.preferredEditorPath,editor.path);
  assert.equal(ctx.gamecoworkProjectMatchesEditorFilter(mapped,ctx.gamecoworkEditorIdentity(editor)),true);
  assert.equal(ctx.gamecoworkProjectMatchesEditorFilter(project({...native,product:'unity',engineType:'unity'}),ctx.gamecoworkEditorIdentity(editor)),false);
  assert.equal(ctx.gamecoworkProjectMatchesEditorFilter(project({...native,product:undefined,engineType:undefined,path:'F:/Project/Tuanjie.exe'}),ctx.gamecoworkEditorIdentity(editor)),false,'No project-path engine guess');
  assert.equal(project({...native,product:undefined}).product,'tuanjie','Existing native engineType is a factual fallback');
 });
 test(name+': failed actual scan preserves previous rows and exposes the backend error',async()=>{
  const ctx=runtime(source),previous=[editor],scan=actualScanner(source,ctx,{previous,request:async()=>({status:'error',error:'own editor registry unavailable'})});
  await scan.run();assert.equal(ctx.Te,previous);assert.deepEqual(scan.rows,[]);assert.deepEqual(scan.errors,['own editor registry unavailable']);assert.deepEqual(scan.busy,[true,false]);
 });
 test(name+': actual successful empty scan is distinct from malformed or failed responses',async()=>{
  const ctx=runtime(source),scan=actualScanner(source,ctx,{request:async()=>({status:'success',content:{}})});await scan.run();assert.deepEqual(plain(scan.rows),[[]]);assert.deepEqual(scan.errors,[null]);
  for(const content of [null,'wrong DTO',{bad:null}])await assert.rejects(ctx.gamecoworkReadEditorRows({request:async()=>({status:'success',content})}));
 });
 test(name+': latest scan owns rows and stale failures cannot replace its state',async()=>{
  const ctx=runtime(source),pending=[];const scan=actualScanner(source,ctx,{request:()=>new Promise(resolve=>pending.push(resolve))});const first=scan.run(),second=scan.run();
  pending[1]({status:'success',content:{actual:editor}});await second;pending[0]({status:'error',error:'late old scan failure'});await first;
  assert.equal(scan.rows.length,1);assert.deepEqual(scan.errors,[null]);assert.deepEqual(scan.busy,[true,true,false]);
 });
 test(name+': visible retry, navigation identity and local action boundaries are wired',()=>{
  assert.match(source,/"data-testid": "gamecowork-editors-error", role: "alert"/);assert.match(source,/"data-testid": "gamecowork-editors-retry"[\s\S]{0,150}onClick: \(\) => void Q\(\)/);
  assert.match(source,/editorIdentityFilter: gamecoworkInstallationFilter/);assert.match(source,/onViewProjects: \(w, g, identity\)/);
  assert.match(source,/"data-testid": "gamecowork-editor-installations-entry"/);assert.match(source,/"data-testid": "gamecowork-editor-reveal"/);
  assert.match(source,/l && !H && !window.GAMECOWORK_SHELL && se\(\)/);
  assert.match(source,/label: a\("tjhub.install.removeFromCowork"\),\s*disabled: !!window.GAMECOWORK_SHELL/);
  assert.match(source,/onClick: se,\s*disabled: !!window.GAMECOWORK_SHELL/);
 });
}
