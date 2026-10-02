import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
import { cpaImageDescriptor, cpaImageModelId, extendGameCoworkModelRegistry, gamecoworkModelAcceptsReferences } from '../../src/frontend/bundle/codely-generator/local-models.js';
import { gamecoworkGenerationReadiness, gamecoworkGenerationPresentation } from '../../src/frontend/bundle/codely-generator/local-generation.js';

const main=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js',import.meta.url),'utf8');
const program=(await babel.parsers.babel.parse(main,{parser:'babel'})).program;
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node))if(!['loc','extra','comments','tokens'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit);}}
function binding(name){for(const node of program.body){if(node.type==='FunctionDeclaration'&&node.id?.name===name)return node;if(node.type==='VariableDeclaration')for(const value of node.declarations)if(value.id?.name===name)return value;}throw Error('Missing real original binding: '+name);}
const source=name=>{const node=binding(name);return main.slice(node.start,node.end);};

test('The owned CPA descriptor appends to the original registry without aliasing or modifying existing models',()=>{
  const symbols=['OK','q1e','P5','iw','F1e','G1e','z1e','$1e','j1e','V1e','H1e','B1e','U1e','W1e'];
  const context={extendGameCoworkModelRegistry};
  for(const name of symbols)context[name]=['q1e','iw','$1e'].includes(name)?{id:name}:[{id:name}];
  const registry=vm.runInNewContext('('+source('xN').slice('xN='.length)+')',context);
  assert.equal(registry.image.at(-1),cpaImageDescriptor);assert.equal(registry.image.filter(model=>model.id===cpaImageModelId).length,1);
  assert.equal(registry.image.find(model=>model.id==='iw'),context.iw,'The existing Frontier identity is untouched');
  assert.equal(registry.audio,context.B1e);assert.equal(registry.video[0],context.j1e[0]);
  const original={image:[context.iw],video:[]};const extended=extendGameCoworkModelRegistry(original);
  assert.equal(original.image.length,1);assert.equal(extended.image[0],original.image[0]);assert.throws(()=>extendGameCoworkModelRegistry(extended),/Duplicate/);
  assert.equal(cpaImageDescriptor.label,'GPT Image 2 · CPA');
  for(const field of ['frontierImage','requiresFrontierSubscription','creditTaskType','paidGated','internalOnly','supportsSegmentation'])assert.equal(Object.hasOwn(cpaImageDescriptor,field),false,field+' must not imply original platform capability');
});

test('The original parameter builder renders the proven CPA request controls with no invented size tiers or subscription controls',()=>{
  const state={size:'1024x1024',format:'png',genCount:1},noop=()=>{};
  const setters=new Proxy({},{get:()=>noop});
  const context=vm.createContext({DNe:{},FK:()=>['low']});vm.runInContext(source('VNe')+';this.parameters=VNe;',context);
  const result=context.parameters({mode:'image',model:cpaImageDescriptor,baseModel:cpaImageDescriptor,state,setters,t:key=>key});
  assert.deepEqual(Array.from(result.chips,chip=>chip.key),['canvas','format']);assert.equal(result.settings.length,0);
  assert.equal(result.chips[0].options[0].value,'1024x1024');assert.equal(result.chips[1].options[0].value,'png');
  assert.match(cpaImageDescriptor.info.note,/实际尺寸/);
  const payload=cpaImageDescriptor.build({...state,prompt:'Own prompt',resolution:'4K',quality:'high',segMode:'native',format:'webp'});
  assert.deepEqual(payload,{prompt:'Own prompt',model:'gpt-image-2',size:'1024x1024',quality:'low',outputFormat:'png',studioModelId:cpaImageModelId});
  assert.equal(cpaImageDescriptor.maxCount,1,'One click submits one actual original task; never multiply n in two layers');
});

test('Actual original reference and sketch capability consumers reject only the unverified CPA image-edit path',()=>{
  const context=vm.createContext({gamecoworkModelAcceptsReferences});
  vm.runInContext(source('jK')+';'+source('sw')+';'+source('kp')+';this.api={jK,sw,kp};',context);
  assert.equal(context.api.jK('image',cpaImageDescriptor),false);assert.equal(context.api.sw('image',cpaImageDescriptor),null);assert.equal(context.api.kp(cpaImageDescriptor,'image'),false);
  const frontier={id:'frontier-game-design',kind:'image',maxImages:9};
  assert.equal(context.api.jK('image',frontier),true);assert.equal(context.api.sw('image',frontier).capacity,9);assert.equal(context.api.kp(frontier,'image'),true);
});

test('Original history regeneration identifies CPA through explicit studioModelId using its actual registry lookup',()=>{
  const context=vm.createContext({sY:[{mode:'image',model:cpaImageDescriptor}],Fwe:payload=>payload.prompt,oY:value=>value});
  vm.runInContext(source('Owe')+';'+source('jwe')+';this.regenerate=jwe;',context);
  const payload=cpaImageDescriptor.build({prompt:'Regenerate the owned result'});
  const restored=context.regenerate({taskType:'gpt-image-2',category:'image',input:{data:payload}});
  assert.equal(restored.modelId,cpaImageModelId);assert.equal(restored.mode,'image');assert.equal(restored.prompt,payload.prompt);assert.equal(restored.payload.studioModelId,cpaImageModelId);
});

test('Only the selected CPA descriptor with an exact enabled local mapping is ready; no global grant or platform entitlement is inferred',()=>{
  const local={mode:'gamecowork-local',capabilities:{localGeneration:true,models:{[cpaImageModelId]:{available:true,providerId:'owned-cpa',model:'gpt-image-2'}}}};
  const ready=gamecoworkGenerationReadiness(local);
  assert.equal(gamecoworkGenerationPresentation(ready,'zh',cpaImageModelId).blocked,false);
  for(const id of [undefined,'frontier-game-design','frontier_flare','gpt-image-2'])assert.equal(gamecoworkGenerationPresentation(ready,'zh',id).blocked,true,id);
  for(const change of [{available:false},{available:'true'},{model:'another-model'},{providerId:''},{providerId:'../untrusted'}]){
    const invalid={...local,capabilities:{...local.capabilities,models:{[cpaImageModelId]:{...local.capabilities.models[cpaImageModelId],...change}}}};
    assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(invalid),'zh',cpaImageModelId).blocked,true);
  }
  for(const invalid of [{...local,mode:'official'},{...local,capabilities:{...local.capabilities,localGeneration:false}},{...local,capabilities:{localGeneration:true}},{...local,capabilities:{localGeneration:true,models:{}}}])assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(invalid),'zh',cpaImageModelId).blocked,true);
  assert.doesNotMatch(JSON.stringify(ready),/paidType|credits|subscriber|membership/);
  const hne=source('HNe');assert.ok(hne.includes('gcwGeneration=gamecoworkGenerationPresentation(gcwGenerationReadiness,Er.resolvedLanguage||Er.language,Z==null?void 0:Z.id)'),'The mounted original component uses its actual current selection');
});

test('The actual original submit and button allow the ready CPA profile without a paid status and dispatch exactly one correctly named task',()=>{
  const nodes=new Map();let button;
  walk(binding('HNe'),node=>{
    if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier')nodes.set(node.id.name,node.init);
    if(node.type==='ObjectExpression'&&node.properties.some(property=>property.key?.name==='className'&&main.slice(property.value.start,property.value.end).includes('studio-generate-button')))button=node;
  });
  const sent=[],ready=gamecoworkGenerationPresentation(gamecoworkGenerationReadiness({mode:'gamecowork-local',capabilities:{localGeneration:true,models:{[cpaImageModelId]:{available:true,providerId:'owned-cpa',model:'gpt-image-2'}}}}),'zh',cpaImageModelId);
  const context=vm.createContext({l:false,P:'image',Z:cpaImageDescriptor,Et:'none',ru:null,Gl:null,d:true,
    C1e:()=>{throw Error('The independent CPA model must not consume platform subscription state');},gcwGeneration:ready,wi:'',ef:'',Xh:4,pn:false,ce:'Own prompt',
    R:()=>{},t:(key,options)=>options?.defaultValue||key,hne:()=>cpaImageDescriptor.build({prompt:'Own prompt'}),w:value=>sent.push(value)});
  for(const name of ['au','tf','ep','$l','tp']){const node=nodes.get(name);assert.ok(node,name);vm.runInContext('this['+JSON.stringify(name)+']='+main.slice(node.start,node.end)+';',context);assert.equal(!!context[name],false,name+' remains inactive without forged paid/credit fields');}
  const disabled=button.properties.find(property=>property.key?.name==='disabled').value;
  assert.equal(vm.runInContext(main.slice(disabled.start,disabled.end),context),false);
  const submit=nodes.get('Tne');vm.runInContext('this.submit='+main.slice(submit.start,submit.end)+';',context);context.submit();
  assert.equal(sent.length,1);assert.equal(sent[0].model.id,cpaImageModelId);assert.equal(sent[0].payload.model,'gpt-image-2');assert.equal(sent[0].payload.studioModelId,cpaImageModelId);
});
