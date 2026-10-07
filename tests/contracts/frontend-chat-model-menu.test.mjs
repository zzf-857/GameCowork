import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
import { officialProgrammingMenu, refreshOfficialProgrammingMenu } from '../../src/frontend/bundle/assets/gamecowork-official-models.js';

const assets = fileURLToPath(new URL('../../src/frontend/bundle/assets/', import.meta.url));
const scrub = value => Array.isArray(value) ? value.map(scrub) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).filter(([key]) => !key.startsWith('__') && !['loc','start','end','extra','leadingComments','trailingComments','innerComments','comments','tokens'].includes(key)).sort(([a],[b]) => a.localeCompare(b)).map(([key,item]) => [key,scrub(item)])) : value;
function walk(node, visit) { if (!node || typeof node !== 'object') return; visit(node); for (const [key,value] of Object.entries(node)) if (!key.startsWith('__') && !['loc','extra','comments','tokens'].includes(key)) { if (Array.isArray(value)) value.forEach(child => walk(child,visit)); else if (value && typeof value === 'object') walk(value,visit); } }
const jsx = (type, props) => ({ type, props });
const records = [
  { name:'current', file:'index-BRxZ4eG7.js', toolbar:'dL', panel:'oL', icon:'rL', rate:'sL', supports:'uw', iconWrap:'Aw', iconArray:'nL', language:'Ie', modelSelect:'Ng', preference:'q5',
    hashes:{oL:'88bee77b4870f3f5d7c5c9ca1a1e9348cf9fa98e9b8ab7df4b5e8c5418cc8617',rL:'255adda4f256e643c232dd80637de3a1d5bb09600e6fd2eafa4b55abdeff119c',sL:'c48bc9c4c15787d7a390a157078e3199e9663bef84e1a1569c94069bf6c85501',uw:'ea8f6f1a512adc281f9bd062b03336aac3a402e9dbddd460989e377e6e9cc946'} },
  { name:'previous', file:'index-DvRYaIVa.js', toolbar:'lL', panel:'sL', icon:'nL', rate:'tL', supports:'lw', iconWrap:'iw', iconArray:'eL', language:'ke', modelSelect:'Qg', preference:'y0',
    hashes:{sL:'d2f43b5f63bbdf5d99400848ee9572107cafe86e99bbb6c894e8c62aed02f4f7',nL:'1065763d5d46b699c01c60862db02ebfff84ba1ea73ce0c00ca9e43c240d2c79',tL:'7bba62e0e6b4f00a7e787c0ffb0e8b8d117158a8b92b09284b092d681a1c1c0b',lw:'dacd5fea1e87617c50fe32c0533d2f7f6cad0ff11d061d65b7960a394132a574'} },
];
const thinking = { default:'max', options:['high','max'] };
function metadata(pro = true) {
  return [
    ['Core (GLM-5.3)','catalog-core',0.25,true], ['Basic','catalog-basic',0.1,false],
    ['GLM-5.3-FLASH','catalog-flash',0.1,true], ['DeepSeek-V4.1-Flash','catalog-deepseek',0.1,true],
    ['KIMI-K3','catalog-kimi',1,true], ['Frontier','catalog-frontier',null,true],
  ].map(([title,model,rate,advanced],index) => ({ title,model,provider:'openai',rate,disabled:index===5 || !pro && index!==1,customedModel:false,
    extras:{officialModelId:'official-fixture-'+index,...(advanced?{thinkingEfforts:thinking,maxContextLengths:{default:32768,options:[32768,65536]}}:{})} }));
}
for (const spec of records) {
  const source = fs.readFileSync(path.join(assets,spec.file),'utf8'), program = (await babel.parsers.babel.parse(source,{parser:'babel'})).program;
  const declaration = name => { const value=program.body.find(node=>node.type==='FunctionDeclaration'&&node.id?.name===name); assert.ok(value,name); return value; };
  const text = node => source.slice(node.start,node.end);
  const toolbar=declaration(spec.toolbar), variables=[]; walk(toolbar,node=>{if(node.type==='VariableDeclarator')variables.push(node);});
  const groups=variables.find(node=>node.init?.type==='CallExpression'&&node.init.arguments[0]?.type==='ArrowFunctionExpression'&&text(node.init.arguments[0]).includes('standard-models'))?.init.arguments[0]; assert.ok(groups);
  const badge=variables.find(node=>node.id?.name===(spec.name==='current'?'ye':'W')&&node.init?.callee?.property?.name==='useCallback')?.init.arguments[0]; assert.ok(badge);
  const callback=name=>variables.find(node=>node.id?.name===name&&node.init?.callee?.property?.name==='useCallback')?.init.arguments[0];
  function fixture(models, selected=models.at(-1), busy=false) {
    const actions=[], requests=[], notices=[], memo={};
    const iconModels=['claude','gpt','deepseek','kimi','frontier','core','basic'].map(keyword=>({keyword,name:keyword==='gpt'?'chatgpt':keyword,Logo:()=>{}}));
    const messenger={async request(kind,data){requests.push({kind,data});return {status:'success',content:{}};}};
    const context=vm.createContext({a:{jsx,jsxs:jsx},console:{warn(){},error(){}},Map,JSON,Number,
      [spec.iconWrap]:()=>{},[spec.iconArray]:iconModels,pC:()=>{},hC:()=>{},zT:()=>{},WT:()=>{},
      [spec.modelSelect]:payload=>({type:'config/updateSelectedModel',payload}),[spec.preference]:title=>memo[title],
      T:model=>model.title,te:model=>model.title,dw:()=>{},uw:()=>{},
      t:action=>actions.push(action),s:async()=>busy,f:'owned-session',o:key=>key==='models.builtInModels'?'内置模型':key,
      n:messenger,Ba:value=>notices.push(value),r:{},z:()=>{},v:()=>{},Ae:undefined,ce:undefined,Z:undefined,ie:undefined,W:undefined,H:undefined,re:undefined,
      ne:models,N:models,se:selected,F:selected,l:{selectedReasoningEffort:null},w:{modelReasoningEfforts:{}},
      E:{current:0},x:{getState:()=>({config:{sharedConfig:{}}})},Wl:payload=>({type:'config/sharedConfig',payload}),_h:value=>value,
      v0:payload=>({type:'session/reasoningEffort',payload})});
    for(const name of [spec.rate,spec.icon,spec.supports])vm.runInContext(text(declaration(name)),context);
    if(spec.name==='current') {
      // Same native stable-key input tuple as VscTheme det(), without credentials.
      context.x0=model=>JSON.stringify([model.provider??'',model.model||model.title,model.apiBase??'',model.extras?.customModelId??'',model.extras?.providerId??'',model.extras?.wireApi??'']);
      context.ye=vm.runInContext('('+text(badge)+')',context);
    } else context.W=vm.runInContext('('+text(badge)+')',context);
    const result=vm.runInContext('('+text(groups)+')',context)();
    return {context,result,actions,requests,notices};
  }
  test(`${spec.name}: original panel, icon, multiplier and reasoning detection ASTs remain unchanged`,()=>{
    for(const [name,hash]of Object.entries(spec.hashes))assert.equal(crypto.createHash('sha256').update(JSON.stringify(scrub(declaration(name)))).digest('hex'),hash,name);
  });
  test(`${spec.name}: native metadata retains builtin order/icons/rates and independent Provider group`,()=>{
    const models=metadata(),custom={title:'User configured model',model:'configured-local',customedModel:true,extras:{providerName:'本地cpa',thinkingEfforts:{default:'high',options:['high','max']}}};
    const f=fixture([...models,custom]),builtin=f.result[0],own=f.result[1];
    assert.equal(builtin.key,'standard-models');assert.equal(builtin.title,'内置模型');assert.deepEqual(Array.from(builtin.items,item=>item.key),models.map(model=>model.title));
    assert.deepEqual(Array.from(builtin.items,item=>item.icon.props.name),['core','basic','basic','deepseek','kimi','frontier']);
    assert.deepEqual(Array.from(builtin.items,item=>item.right?.props.children??null),['0.25x','0.1x','0.1x','0.1x','1.0x',null]);
    assert.equal(builtin.items[5].disabled,true);assert.equal(own.title,'本地cpa');assert.equal(own.items[0].icon.props.name,'custom');assert.equal(own.items[0].right,null);
    assert.equal(f.result.length,2);assert.equal(f.requests.length,0,'Building groups must not enable/key/refresh');
  });
  test(`${spec.name}: non-Pro disabled metadata cannot be clicked, Basic and local models remain independent`,async()=>{
    const models=metadata(false),custom={title:'Configured external',model:'external',customedModel:true,extras:{providerName:'Owned Provider'}};
    const f=fixture([...models,custom]);for(const row of f.result[0].items.filter(item=>item.disabled))await row.onClick();assert.equal(f.actions.length,0);
    await f.result[0].items[1].onClick();assert.equal(f.actions[0].payload.modelTitle,'Basic');assert.equal(f.actions[0].payload.role,'chat');
    assert.equal(f.result[1].items[0].disabled,false);assert.equal(f.requests.length,0);
  });
  test(`${spec.name}: enabled selection uses the original thunk and streaming blocks selection`,async()=>{
    const f=fixture(metadata(),metadata()[1]);await f.result[0].items[0].onClick();assert.equal(f.actions[0].type,'config/updateSelectedModel');assert.equal(f.actions[0].payload.modelTitle,'Core (GLM-5.3)');assert.equal(f.actions[0].payload.initialContextLength,32768);
    if(spec.name==='previous')assert.equal(f.actions[0].payload.initialReasoningEffort,'max');
    const busy=fixture(metadata(),metadata()[1],true);await busy.result[0].items[0].onClick();assert.equal(busy.actions.length,0);assert.equal(busy.notices.length,1);
  });
  test(`${spec.name}: actual configured reasoning callback keeps native persistence/request semantics`,async()=>{
    const f=fixture(metadata(),metadata()[0]),fn=callback(spec.name==='current'?'be':'se');assert.ok(fn);
    await vm.runInContext('('+text(fn)+')',f.context)('high');
    if(spec.name==='current') {assert.equal(f.requests[0].kind,'config/updateSharedConfig');assert.equal(f.requests[0].data.modelReasoningEffortUpdate.reasoningEffort,'high');assert.equal(f.requests[0].data.modelReasoningEffortUpdate.modelKey,f.context.x0(metadata()[0]));}
    else assert.deepEqual(JSON.parse(JSON.stringify(f.actions[0].payload)),{reasoningEffort:'high',modelTitle:'Core (GLM-5.3)',persist:true});
  });
  test(`${spec.name}: only opening the native model trigger refreshes metadata; render never requests a key`,async()=>{
    const nodes=[];walk(toolbar,node=>{if(node.type==='ObjectProperty'&&node.key?.name==='onOpenChange'&&node.value?.type==='ArrowFunctionExpression'&&text(node.value).includes('refreshOfficialProgrammingMenu'))nodes.push(node.value);});assert.equal(nodes.length,1);
    const calls=[],open=[];const context=vm.createContext({k:value=>open.push(value),K:value=>open.push(value),n:{owned:true},Ba(){},refreshOfficialProgrammingMenu:(messenger)=>{assert.equal(messenger.owned,true);calls.push('metadata');}});
    const fn=vm.runInContext('('+text(nodes[0])+')',context);fn(false);assert.equal(calls.length,0);fn(true);assert.deepEqual(calls,['metadata']);assert.deepEqual(open,[false,true]);
    assert.ok(!text(groups).includes('officialProgrammingMenu'));assert.ok(!source.includes('启用 Codely 官方 · Pro 模型'));
  });
}

test('Menu compatibility composer preserves original groups without duplicate official custom/enable rows',()=>{
  const groups=[{key:'standard-models',items:[]}];let calls=0;assert.equal(officialProgrammingMenu(groups,{request(){calls++;}}),groups);assert.equal(calls,0);
});
test('Read-only metadata refresh shares a pending RPC, never obtains credentials or writes models in the renderer',async()=>{
  const calls=[];let complete;const messenger={request(kind,data){calls.push({kind,data});return new Promise(resolve=>{complete=resolve;});}};
  const first=refreshOfficialProgrammingMenu(messenger),second=refreshOfficialProgrammingMenu(messenger);assert.equal(calls.length,1);assert.equal(calls[0].kind,'codelyOfficial/refreshMenu');
  complete({status:'success',content:{ready:true,source:'original-config-v3',modelCount:6}});assert.equal((await first).ready,true);assert.equal((await second).ready,true);
  assert.ok(!calls.some(call=>call.kind==='codelyOfficial/enable'||/key|session\/new|streamChat/.test(call.kind)));
});
test('Unavailable account metadata is honest; malformed/error replies cannot manufacture a ready directory',async()=>{
  const expected={ready:false,source:'original-config-v3',modelCount:0,unavailableReason:'not_signed_in'};assert.deepEqual(await refreshOfficialProgrammingMenu({request:async()=>({status:'success',content:expected})}),expected);
  let notifications=0;const empty={ready:true,source:'original-config-v3',modelCount:0};assert.deepEqual(await refreshOfficialProgrammingMenu({request:async()=>({status:'success',content:empty})},()=>notifications++),empty);assert.equal(notifications,0,'A legitimate empty permission directory is not an invalid-receipt error');
  for(const content of [{ready:true,modelCount:2},{ready:true,source:'original-config-v3',modelCount:-1},{ready:true,source:'raw-models',modelCount:9}])assert.equal((await refreshOfficialProgrammingMenu({request:async()=>({status:'success',content})})).ready,false);
  let notice;assert.equal((await refreshOfficialProgrammingMenu({request:async()=>({status:'error',error:'Owned metadata failure'})},text=>notice=text)).ready,false);assert.equal(notice,'Owned metadata failure');
});
test('Existing custom reasoning metadata remains configurable; unknown models are not given fabricated six-tier capability',async()=>{
  for(const file of ['VscTheme-BExNMG_K.js','VscTheme-B-CSeuv5.js']){
    const source=fs.readFileSync(path.join(assets,file),'utf8'),start=source.indexOf('function coworkCustomReasoningConfig('),end=source.indexOf('\n}',start)+2;assert.ok(start>=0&&end>start);
    const decorate=vm.runInNewContext('('+source.slice(start,end)+')');const configured={title:'Configured GPT',model:'gpt-6.1-sol',customedModel:true,extras:{thinkingEfforts:{default:'max',options:['high','max']}}},unknown={title:'Unknown GPT',model:'gpt-6.1-sol',customedModel:true,extras:{}},native={title:'Core',model:'gemini-3.8-flash-high',customedModel:false,extras:{}};
    const result=decorate({modelsByRole:{chat:[configured,unknown,native]},selectedModelByRole:{chat:configured}});assert.equal(result.modelsByRole.chat[0],configured);assert.equal(result.modelsByRole.chat[1],unknown);assert.equal(result.modelsByRole.chat[2],native);assert.equal(result.selectedModelByRole.chat,configured);
  }
});
