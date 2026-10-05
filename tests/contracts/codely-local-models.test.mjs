import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
import { cpaImageDescriptor, cpaImageModels, cpaImageModelId, cpaImageModelIds, cpaImageAspectRatios, cpaImage25Variants, gamecoworkCpaImage25Variant, gamecoworkCpaFamilyModelId, gamecoworkCpaMenuModels, gamecoworkCpaMenuLabel, extendGameCoworkModelRegistry, gamecoworkModelAcceptsReferences, gamecoworkIsThirdPartyModel, gamecoworkSetProviderDescriptors, gamecoworkCustomModel, gamecoworkModelProviderId, gamecoworkProviderModels, gamecoworkCpaParameterError, gamecoworkCpaFactLines } from '../../src/frontend/bundle/codely-generator/local-models.js';
import { gamecoworkGenerationReadiness, gamecoworkGenerationPresentation } from '../../src/frontend/bundle/codely-generator/local-generation.js';

const main=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js',import.meta.url),'utf8');
const program=(await babel.parsers.babel.parse(main,{parser:'babel'})).program;
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node))if(!['loc','extra','comments','tokens'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit);}}
function binding(name){for(const node of program.body){if(node.type==='FunctionDeclaration'&&node.id?.name===name)return node;if(node.type==='VariableDeclaration')for(const value of node.declarations)if(value.id?.name===name)return value;}throw Error('Missing real original binding: '+name);}
const source=name=>{const node=binding(name);return main.slice(node.start,node.end);};

test('The owned CPA group leaves every original official registry unchanged and contains only explicit third-party identities',()=>{
  const symbols=['OK','q1e','P5','iw','F1e','G1e','z1e','$1e','j1e','V1e','H1e','B1e','U1e','W1e'];
  const context={extendGameCoworkModelRegistry};
  for(const name of symbols)context[name]=['q1e','iw','$1e'].includes(name)?{id:name}:[{id:name}];
  const registry=vm.runInNewContext('('+source('xN').slice('xN='.length)+')',context);
  assert.equal(registry.image.filter(model=>gamecoworkIsThirdPartyModel(model.id)).length,0);assert.equal(registry.thirdparty,cpaImageModels);
  assert.equal(registry.image.find(model=>model.id==='iw'),context.iw,'The existing Frontier identity is untouched');
  assert.equal(registry.audio,context.B1e);assert.equal(registry.video[0],context.j1e[0]);
  const original={image:[context.iw],video:[]};const extended=extendGameCoworkModelRegistry(original);
  assert.equal(original.image.length,1);assert.equal(extended.image,original.image);assert.throws(()=>extendGameCoworkModelRegistry(extended),/Duplicate/);
  assert.equal(cpaImageDescriptor.label,'GPT Image 2 · CPA');
  for(const field of ['frontierImage','requiresFrontierSubscription','creditTaskType','paidGated','internalOnly','supportsSegmentation'])assert.equal(Object.hasOwn(cpaImageDescriptor,field),false,field+' must not imply original platform capability');
});

test('The original dropdown shows two CPA families while preserving the selected Image 2.5 variant and original official entries',()=>{
  const render=(type,props)=>({type,...props}),selected=[],context=vm.createContext({Ud:()=>[{}],Ba:()=>false,Sz:{image:'ImageIcon'},io:'FallbackIcon',f:{jsx:render,jsxs:render},Ke:(...values)=>values.filter(Boolean).join(' '),rw:models=>models[0],bc:'Popover',ih:'Trigger',_c:'Content',wo:'Chevron',Ji:'Check',gamecoworkCpaFamilyModelId,gamecoworkCpaMenuModels,gamecoworkCpaMenuLabel});
  vm.runInContext(source('FZ')+';this.selector=FZ;',context);
  for(const descriptor of cpaImageModels){
    const tree=context.selector({models:cpaImageModels,activeId:descriptor.id,onSelect:id=>selected.push(id),t:(key,options)=>options?.defaultValue||key,open:true,onOpenChange:()=>{}}),menu=tree.children[1].children.children;
    assert.equal(menu.length,2);assert.deepEqual(Array.from(menu,row=>row.children[1].children[0].children),['GPT Image 2 · CPA','GPT Image 2.5 · CPA']);
    assert.equal(menu.filter(row=>row['aria-pressed']).length,1);assert.equal(menu[descriptor.id===cpaImageModelId?0:1]['aria-pressed'],true);
    assert.equal(tree.children[0].children.children[1].children,descriptor.id===cpaImageModelId?'GPT Image 2 · CPA':'GPT Image 2.5 · CPA');
    menu[1].onClick();assert.equal(selected.at(-1),'cpa-gpt-image-2-5','The family entry selects the actual default route');
  }
  const original={id:'frontier_flare',label:'Original official model'};assert.deepEqual(gamecoworkCpaMenuModels([original]),[original]);assert.equal(gamecoworkCpaMenuLabel(original),original.label);
});

test('The original Quick Image 2.5 buttons select exact default, fast and refined routes without creating a task',()=>{
  const nodes=new Map();let group;walk(binding('HNe'),node=>{if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier')nodes.set(node.id.name,node.init);if(node.type==='ObjectExpression'&&node.properties.some(property=>property.key?.value==='aria-label'&&property.value?.value==='Image 2.5 选项'))group=node;});assert.ok(group);
  const changes=[],render=(type,props)=>({type,...props}),draft={prompt:'Keep my composition',ratio:'16:9',size:'1600x896',quality:'high',format:'webp'},context=vm.createContext({F:cpaImageModels,Pe:cpaImageModels[1],cpaImage25Variants,gamecoworkCpaImage25Variant,f:{jsx:render},Ke:(...values)=>values.filter(Boolean).join(' '),G:id=>changes.push(['model',id]),R:()=>{},Qt:model=>{changes.push(['initialize',model.id]);Object.assign(draft,{ratio:'auto',size:'auto',quality:'auto',format:'png'});},w:()=>assert.fail('Variant selection must never submit generation')});
  vm.runInContext('this.li='+main.slice(nodes.get('li').start,nodes.get('li').end)+';',context);
  for(const descriptor of cpaImageModels.slice(1)){
    context.Pe=descriptor;const tree=vm.runInContext('('+main.slice(group.start,group.end)+')',context);
    assert.deepEqual(Array.from(tree.children,button=>button.children),['默认','快速','精致']);assert.equal(tree.children.filter(button=>button['aria-pressed']).length,1);assert.equal(tree.children.find(button=>button['aria-pressed']).children,gamecoworkCpaImage25Variant(descriptor.id).label);
    for(const [index,button]of tree.children.entries()){changes.length=0;button.onClick();const variant=cpaImage25Variants[index],model=cpaImageModels.find(model=>model.id===variant.id);assert.deepEqual(changes,[['model',variant.id]]);assert.equal(model.build({prompt:'Own draft'}).model,['gpt-image-2.5','gpt-image-2.5-flare','gpt-image-2.5-sunburst'][index]);assert.deepEqual(draft,{prompt:'Keep my composition',ratio:'16:9',size:'1600x896',quality:'high',format:'webp'});assert.match(gamecoworkCpaParameterError(model,draft),/账号默认参数/,'A route button is not acceptance of incompatible historical parameters');}
  }
  context.Pe=cpaImageDescriptor;changes.length=0;context.li(cpaImage25Variants[0].id);assert.deepEqual(changes,[['model',cpaImage25Variants[0].id],['initialize',cpaImage25Variants[0].id]]);assert.deepEqual(draft,{prompt:'Keep my composition',ratio:'auto',size:'auto',quality:'auto',format:'png'},'Cross-family changes retain original initialization and do not clear the prompt');
  assert.equal(gamecoworkCpaImage25Variant(cpaImageModelId),undefined,'Image 2 shows no Image 2.5 button group');
  assert.ok(source('HNe').includes('gamecoworkCpaImage25Variant(Pe.id)&&f.jsx("div",{role:"group"'));
  for(const [index,descriptor]of cpaImageModels.slice(1).entries()){assert.match(descriptor.label,new RegExp(cpaImage25Variants[index].label));assert.equal(gamecoworkCpaFactLines({type:descriptor.id})[0].value,cpaImage25Variants[index].label);}
});

test('The original parameter builder exposes composition hints and actual PNG format without unverified pixel or quality controls',()=>{
  const state={size:'auto',quality:'auto',format:'png',ratio:'16:9',genCount:1},noop=()=>{};
  const setters=new Proxy({},{get:()=>noop});
  const render=(type,props)=>({type,...props});
  const context=vm.createContext({DNe:{},FK:()=>['low'],f:{jsx:render,jsxs:render,Fragment:'Fragment'}});vm.runInContext(source('VNe')+';this.parameters=VNe;',context);
  const result=context.parameters({mode:'image',model:cpaImageDescriptor,baseModel:cpaImageDescriptor,state,setters,t:key=>key});
  assert.deepEqual(Array.from(result.chips,chip=>chip.key),['compositionRatio','format']);assert.equal(result.settings.length,0);
  assert.equal(result.chips[0].label,'构图比例目标');assert.equal(result.chips[0].options[0].label,'服务决定');assert.equal(result.chips[1].options[0].value,'png');
  assert.equal(result.chips[0].value,'16:9');assert.equal(result.chips[1].value,'png');assert.equal(result.chips[1].options.length,1);
  assert.doesNotMatch(JSON.stringify(result),/3840|2K|4K|type.*number|1024x1024/);
  assert.match(cpaImageDescriptor.info.size,/实际像素/);
  const payload=cpaImageDescriptor.build({...state,prompt:'Own prompt',resolution:'4K',segMode:'native'});
  assert.deepEqual(payload,{prompt:'Own prompt',model:'gpt-image-2',size:'auto',quality:'auto',outputFormat:'png',studioModelId:cpaImageModelId,aspectRatio:'16:9'});
  assert.equal(cpaImageDescriptor.maxCount,1,'One click submits one actual original task; never multiply n in two layers');
});

test('CPA builders enforce the verified account profile and keep ratio hints distinct from exact API dimensions',()=>{
  for(const model of cpaImageModels) for(const ratio of cpaImageAspectRatios) {
    const payload=model.build({prompt:'Own test',ratio});
    assert.equal(payload.size,'auto');assert.equal(payload.quality,'auto');assert.equal(payload.outputFormat,'png');assert.equal(payload.studioModelId,model.id);assert.equal(payload.aspectRatio,ratio);
    assert.equal(gamecoworkCpaParameterError(model,{size:'auto',quality:'auto',format:'png',ratio}),'');
  }
  for(const size of ['1024x1024','1536x1024','1024x1536','2048x2048'])assert.throws(()=>cpaImageDescriptor.build({prompt:'Own test',size}),/账号默认参数/,size);
  for(const quality of ['low','medium','high','xhigh','max'])for(const model of cpaImageModels)assert.throws(()=>model.build({prompt:'Own test',quality}),/账号默认参数/);
  for(const format of ['jpeg','webp','gif','svg','jpg'])assert.throws(()=>cpaImageDescriptor.build({prompt:'Own test',format}),/账号默认参数/);
  assert.throws(()=>cpaImageDescriptor.build({prompt:'Own test',ratio:'unsupported'}),/构图比例/);
  assert.deepEqual(cpaImageModelIds,['cpa-gpt-image-2','cpa-gpt-image-2-5','cpa-gpt-image-2-5-flare','cpa-gpt-image-2-5-sunburst']);
});

test('The original composition chip changes only a prompt ratio hint, without changing exact resolution or quality',()=>{
  const output=[],state={size:'auto',quality:'auto',format:'png',ratio:'auto'},noop=()=>{};
  const setters=new Proxy({setSize:()=>assert.fail('A composition hint cannot promise API pixels'),setQuality:()=>assert.fail('A composition hint cannot change account quality'),setRatio:value=>output.push(['ratio',value])},{get:(target,key)=>target[key]||noop});
  const render=(type,props)=>({type,...props}),context=vm.createContext({DNe:{},FK:()=>['low'],f:{jsx:render,jsxs:render,Fragment:'Fragment'}});
  vm.runInContext(source('VNe')+';this.parameters=VNe;',context);
  const chip=context.parameters({mode:'image',model:cpaImageDescriptor,baseModel:cpaImageDescriptor,state,setters,t:key=>key}).chips[0];
  chip.onChange('9:16');assert.deepEqual(output.splice(0),[['ratio','9:16']]);
  assert.match(chip.footer.children,/不保证精准分辨率/);assert.match(chip.footer.children,/质量由账号服务决定/);
  const returned=context.parameters({mode:'image',model:cpaImageDescriptor,baseModel:cpaImageDescriptor,state:{...state,ratio:'9:16'},setters,t:key=>key}).chips[0];
  assert.equal(returned.value,'9:16');assert.equal(returned.options.length,8);
});

test('Actual original reference and sketch capability consumers reject only the unverified CPA image-edit path',()=>{
  const context=vm.createContext({gamecoworkModelAcceptsReferences});
  vm.runInContext(source('jK')+';'+source('sw')+';'+source('kp')+';this.api={jK,sw,kp};',context);
  assert.equal(context.api.jK('image',cpaImageDescriptor),false);assert.equal(context.api.sw('image',cpaImageDescriptor),null);assert.equal(context.api.kp(cpaImageDescriptor,'image'),false);
  const removed=gamecoworkProviderModels([],'removed-provider')[0];
  assert.equal(context.api.jK('image',removed),false);assert.equal(context.api.sw('image',removed),null);assert.equal(context.api.kp(removed,'image'),false,'The actual original consumers hide references and sketch for an unavailable custom Provider');
  const frontier={id:'frontier-game-design',kind:'image',maxImages:9};
  assert.equal(context.api.jK('image',frontier),true);assert.equal(context.api.sw('image',frontier).capacity,9);assert.equal(context.api.kp(frontier,'image'),true);
});

test('Original history regeneration identifies CPA through explicit studioModelId using its actual registry lookup',()=>{
  const context=vm.createContext({sY:cpaImageModels.map(model=>({mode:'image',model})),Fwe:payload=>payload.prompt,oY:value=>value,gamecoworkIsThirdPartyModel,gamecoworkCustomModel});
  vm.runInContext(source('Owe')+';'+source('jwe')+';this.regenerate=jwe;',context);
  for(const model of cpaImageModels){
    const payload=model.build({prompt:'Regenerate the owned result',ratio:'9:16'});
    const restored=context.regenerate({taskType:payload.model,category:'image',input:{data:payload}});
    assert.equal(restored.modelId,model.id);assert.equal(restored.mode,'image');assert.equal(restored.prompt,payload.prompt);assert.equal(restored.payload.studioModelId,model.id);
    assert.equal(restored.payload.size,'auto');assert.equal(restored.payload.quality,'auto');assert.equal(restored.payload.outputFormat,'png');assert.equal(restored.payload.aspectRatio,'9:16');
  }
});

test('Original Quick tab switching and regeneration restore the separate CPA group with exact model and custom parameters',()=>{
  const nodes=new Map();walk(binding('HNe'),node=>{if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier')nodes.set(node.id.name,node.init);});
  const changes={},noop=()=>{},official={id:'frontier_flare',kind:'image'},context=vm.createContext({I:{image:[official],thirdparty:cpaImageModels},P:'image',gcwThirdParty:false,gcwEffectiveProvider:'cpa',gcwProvider:'cpa',ft:[],rw:models=>models[0],sw:()=>null,gamecoworkIsThirdPartyModel,gamecoworkProviderModels,gamecoworkModelProviderId,
    gcwSetProvider:value=>{context.gcwProvider=value;context.gcwEffectiveProvider=value;},gcwSetResolutionHint:noop,gcwSetAspectHint:noop,
    gcwSetThirdParty:value=>{context.gcwThirdParty=value;changes.thirdparty=value;},L:value=>{context.P=value;changes.mode=value;},R:noop,ct:noop,Qt:noop,G:value=>{changes.modelId=value;},z:noop,qs:noop,
    Bwe:()=>({refImgUrls:[],videoUrls:[],audioUrls:[]}),j:noop,pe:noop,Te:noop,qt:noop,Mt:noop,ai:noop,No:noop,Tt:noop,Ie:value=>{changes.size=value;},tt:value=>{changes.custom=value;},pt:value=>{changes.width=value;},ht:value=>{changes.height=value;},aY:()=>null,K:noop,D:noop,Ce:noop,Ve:noop,lt:value=>{changes.format=value;},mv:noop,FK:model=>model.qualityOptions,ee:value=>{changes.quality=value;},W:noop,ge:noop,Oe:noop,me:noop,Ue:noop,ue:noop,We:noop,St:noop,st:noop,ie:noop,dt:noop,$e:noop,le:noop,Ee:noop,jt:noop,Rt:noop,X:noop,vt:noop,te:noop,Se:noop,l:false});
  for(const symbol of ['Vt','wF']){const node=nodes.get(symbol);assert.ok(node);vm.runInContext('this.'+symbol+'='+main.slice(node.start,node.end)+';',context);}
  context.Vt('thirdparty');assert.equal(changes.thirdparty,true);assert.equal(changes.mode,'image');assert.equal(changes.modelId,cpaImageModelId);
  context.Vt('image');assert.equal(changes.thirdparty,false);assert.equal(changes.modelId,official.id);
  const descriptor=cpaImageModels[1],payload={prompt:'Restore own draft',model:'gpt-image-2.5',studioModelId:descriptor.id,size:'1600x896',quality:'xhigh',outputFormat:'webp',aspectRatio:'16:9'};
  context.wF({model:{id:descriptor.id,mode:'image'},payload,prompt:payload.prompt});
  assert.deepEqual(changes,{thirdparty:true,mode:'image',modelId:descriptor.id,size:'1600x896',custom:false,format:'webp',quality:'xhigh'});
  assert.equal(context.gcwProvider,'cpa','Original CPA history restores the actual CPA Provider identity');
  const historyMap=source('sY');assert.ok(historyMap.includes('mode:t==="thirdparty"?"image":t'));
});

test('Each CPA variant needs its own exact capability and never borrows another variant or official rights',()=>{
  for(const descriptor of cpaImageModels){
    const model=descriptor.build({prompt:'',size:'auto'}).model,proof={available:true,providerId:'own-cpa',model,service:'cpa',kind:'image',mode:'image'};
    const response={mode:'codely-official',capabilities:{localGeneration:true,models:{[descriptor.id]:proof}}};
    const ready=gamecoworkGenerationReadiness(response);
    assert.equal(gamecoworkGenerationPresentation(ready,'zh',descriptor.id).blocked,false);
    for(const other of cpaImageModels.filter(value=>value.id!==descriptor.id))assert.equal(gamecoworkGenerationPresentation(ready,'zh',other.id).blocked,true);
    for(const change of [{service:'codely-official'},{model:'gpt-image-1'},{kind:'video'},{mode:'3d'},{available:false},{providerId:'../elsewhere'}])assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness({...response,capabilities:{...response.capabilities,models:{[descriptor.id]:{...proof,...change}}}}),'zh',descriptor.id).blocked,true);
  }
});

test('Actual original form validation and submit reject unverified historical CPA parameters without dispatching a task',()=>{
  const nodes=new Map();walk(binding('HNe'),node=>{if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier')nodes.set(node.id.name,node.init);});
  for(const size of ['1024x1024','1536x1024','1024x1536','3008x800']){
    const messages=[],context=vm.createContext({Z:cpaImageDescriptor,De:size,Me:'low',Y:'png',ye:'auto',gcwResolutionHint:'auto',gcwAspectHint:'auto',gamecoworkCpaParameterError,t:key=>key,
      gcwGeneration:{blocked:false},$l:false,R:value=>messages.push(value),w:()=>assert.fail('Invalid dimensions reached original generation'),hne:()=>assert.fail('Invalid dimensions reached the payload builder')});
    const validation=nodes.get('ef'),submit=nodes.get('Tne');
    vm.runInContext('this.ef='+main.slice(validation.start,validation.end)+';this.submit='+main.slice(submit.start,submit.end)+';',context);
    assert.ok(context.ef);context.submit();assert.equal(messages.at(-1),context.ef);
  }
});

test('Only the explicit account-defaults action clears unsupported old parameters, and it creates no task',()=>{
  let reset,caption;walk(binding('HNe'),node=>{if(node.type!=='ObjectExpression')return;const children=node.properties.find(p=>p.key?.name==='children')?.value;if(children?.type==='ConditionalExpression'&&children.alternate?.value==='使用账号默认参数'&&children.consequent?.value==='使用当前可用参数'){reset=node.properties.find(p=>p.key?.name==='onClick')?.value;caption=children;}});assert.ok(reset);assert.ok(caption);
  const hints={resolution:'2048x2048',aspect:'9:16'},values={size:'1600x896',quality:'xhigh',format:'webp',ratio:'16:9'},context=vm.createContext({Z:cpaImageDescriptor,ye:values.ratio,Ie:value=>values.size=value,ee:value=>values.quality=value,lt:value=>values.format=value,tt:()=>{},D:value=>values.ratio=value,gcwSetResolutionHint:value=>hints.resolution=value,gcwSetAspectHint:value=>hints.aspect=value,R:()=>{},w:()=>assert.fail('Adopting account defaults cannot submit generation')});
  vm.runInContext('this.caption='+main.slice(caption.start,caption.end)+';this.reset='+main.slice(reset.start,reset.end)+';',context);
  assert.equal(context.caption,'使用账号默认参数','The actual original CPA action retains its account-defaults label');
  assert.deepEqual(values,{size:'1600x896',quality:'xhigh',format:'webp',ratio:'16:9'});
  context.reset();assert.deepEqual(values,{size:'auto',quality:'auto',format:'png',ratio:'16:9'});
  assert.deepEqual(hints,{resolution:'auto',aspect:'auto'});
  const id='cust_'+ 'e'.repeat(32);gamecoworkSetProviderDescriptors([{id,providerId:'owned-image',model:'owned-image-model',kind:'image',mode:'image',protocol:'openai-images',imageSizePolicy:'openai-size',capabilities:{}}]);
  const custom=gamecoworkCustomModel(id);context.ce='An actual game scene, preserved unchanged.';
  for(const sizeStatus of ['unknown','unsupported']) {
    context.Z={...custom,capabilities:{size:{status:sizeStatus,evidence:sizeStatus==='unknown'?'unknown':'tested',choices:[]}}};
    values.size='auto';values.quality='auto';values.format='png';values.ratio='auto';hints.resolution='4096x4096';hints.aspect='16:9';
    const state=()=>({...values,resolutionHint:hints.resolution,aspectRatioHint:hints.aspect});
    assert.ok(gamecoworkCpaParameterError(context.Z,state()),'The invalid or explicitly unsupported target initially blocks generation');
    assert.equal(vm.runInContext(main.slice(caption.start,caption.end),context),'使用当前可用参数');
    context.reset();assert.deepEqual(hints,{resolution:'auto',aspect:'auto'});assert.equal(gamecoworkCpaParameterError(context.Z,state()),'');
    assert.equal(context.ce,'An actual game scene, preserved unchanged.');
  }
  gamecoworkSetProviderDescriptors([]);
});

test('CPA facts separate requested values, provider claims and verified file pixels, without fabricating backend model confirmation',()=>{
  const row={type:'cpa-gpt-image-2-5',input:{data:{studioModelId:'cpa-gpt-image-2-5',model:'gpt-image-2.5',size:'1536x1024',quality:'high',outputFormat:'jpeg'}},output:{data:{artifacts:[{width:48,height:32,mime:'image/png',url:'https://secret.invalid/key'}]}},providerReportedImage:{quality:'low',size:'1254x1254',outputFormat:'png',apiKey:'do-not-display',model:'unverified-secret-model'}};
  const lines=gamecoworkCpaFactLines(row),values=Object.fromEntries(lines.map(line=>[line.label,line.value]));
  assert.equal(values['请求型号'],'gpt-image-2.5');assert.equal(values['实际型号'],'未确认');assert.equal(values['文件像素'],'48×32');assert.equal(values['文件格式'],'image/png');assert.equal(values['服务报告质量'],'low');assert.equal(values['服务报告尺寸'],'1254x1254');assert.equal(values['历史请求尺寸'],'1536x1024');assert.equal(values['历史请求质量'],'high');assert.equal(values['历史请求格式'],'jpeg');
  assert.doesNotMatch(JSON.stringify(lines),/secret|do-not-display|apiKey|confirmed/);
  assert.equal(gamecoworkCpaFactLines({...row,type:'frontier_flare',input:{data:{studioModelId:'frontier_flare'}}}).length,0);
  const report=gamecoworkCpaFactLines({...row,providerReportedImage:{model:'gpt-image-2.5-flare'}});assert.equal(report.find(line=>line.label==='实际型号').value,'gpt-image-2.5-flare');
  assert.equal(gamecoworkCpaFactLines({data:row},cpaImageModels[1],row.input.data).find(line=>line.label==='文件像素').value,'48×32');
  assert.ok(source('hwe').includes('gamecoworkCpaFactLines(B,w.model,w.payload)'));assert.ok(source('MZ').includes('gamecowork-cpa-execution-facts'));assert.ok(source('pQ').includes('gamecoworkCpaFactLines(t)'));
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
