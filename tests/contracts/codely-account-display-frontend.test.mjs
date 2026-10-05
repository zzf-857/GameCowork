import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
import { gamecoworkAccountDisplay, gamecoworkOpenAccountUsage } from '../../src/frontend/bundle/assets/gamecowork-account-display.js';
const realPlan = {planType:'pro',planTag:'TuanjieAIPro',isActive:true,isTeamPlan:false,hasSeat:true};
const session = (extra={}) => ({mode:'codely',account:{id:'102427',label:'Fixture Named User',username:'Fixture Named User',email:null,...extra}});
test('Public account presentation distinguishes username, actual email and account ID without reading credentials',()=>{
  const official=session(),read=gamecoworkAccountDisplay(official,realPlan);
  assert.equal(read.displayName,'Fixture Named User');assert.equal(read.displayEmail,'');assert.equal(read.accountDetail,'账号 ID: 102427');assert.equal(read.displaySubtext,'账号 ID: 102427');assert.equal(read.planBadge,'Pro');
  Object.defineProperty(official,'accessToken',{get(){throw Error('A presentation helper must never inspect credentials');}});
  assert.equal(gamecoworkAccountDisplay(official,realPlan).planBadge,'Pro');
  const email=gamecoworkAccountDisplay(session({email:'actual@example.invalid'}),realPlan,'en');assert.equal(email.accountDetail,'Email: actual@example.invalid');
  assert.equal(gamecoworkAccountDisplay(session({email:'102427'}),realPlan).accountDetail,'账号 ID: 102427');
  assert.equal(gamecoworkAccountDisplay(session({label:'102427',username:null}),realPlan).displayName,'Codely 用户');
  const name=gamecoworkAccountDisplay(session({label:'Other verified display',username:'Chosen username'}),realPlan);assert.equal(name.displayName,'Chosen username');
});
test('Pro needs an official account and an explicitly active real Pro plan; unknown seat is distinct from a denied seat',()=>{
  assert.equal(gamecoworkAccountDisplay(session(),{...realPlan,isTeamPlan:true,hasSeat:null}).planBadge,'Pro');
  for(const plan of [{...realPlan,isActive:false},{...realPlan,isActive:null},{...realPlan,isActive:undefined},{...realPlan,isTeamPlan:true,hasSeat:false},{...realPlan,planType:'free'},{...realPlan,planType:'not-pro'},{...realPlan,isActive:false,isPlanActive:true}])assert.notEqual(gamecoworkAccountDisplay(session(),plan).planBadge,'Pro');
  const local={mode:'local',account:{id:'gamecowork-local',label:'GameCowork 本地用户'}};assert.equal(gamecoworkAccountDisplay(local,realPlan).planBadge,'');assert.equal(gamecoworkAccountDisplay(local,realPlan).displaySubtext,'gamecowork-local');
  assert.equal(gamecoworkAccountDisplay({mode:'invented',account:session().account},realPlan).planBadge,'');
});
test('The original usage RPC is fixed and explicit; local or missing identity cannot send it',()=>{
  const posts=[],messenger={post:(...args)=>posts.push(args)};
  for(const value of [null,{mode:'local',account:session().account},{mode:'codely',account:{id:'102427'}}])assert.equal(gamecoworkOpenAccountUsage(value,messenger),false);
  assert.deepEqual(posts,[]);assert.equal(gamecoworkOpenAccountUsage(session(),messenger),true);assert.deepEqual(posts,[['controlPlane/openUrl',{path:'dashboard/usage',orgSlug:undefined}]]);
});
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node))if(!['loc','extra','comments','tokens'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit);}}
const specs=[{file:'index-BRxZ4eG7.js',profile:'U3',menu:'Rz',translate:'Ie',dispatch:'Ge',plan:'nk',windows:'mb',usage:'Ed',info:'kS',seat:'b'},
  {file:'index-DvRYaIVa.js',profile:'F3',menu:'Nz',translate:'ke',dispatch:'ze',plan:'ek',windows:'gb',usage:'Cd',info:'IS',seat:'B'}];
// Original maintained sidebar getter/fetch branch: current main sidebar
// he=M(JS), ve=M(YS), then he!==null || !ve || dispatch(nk()); previous
// ue=M(qS), me=M(XS), then ue!==null || !me || dispatch(ek()).
// An authenticated personal/default account may precede organization Redux
// initialization. The original user menu fetched usage without fetching plan.
// The smallest correction invokes the existing hV plan thunk from the original
// account component; menus, controls, usage path and Core authentication stay.
function renderer(spec,publicSession,account=realPlan){
  const source=fs.readFileSync(new URL('../../src/frontend/bundle/assets/'+spec.file,import.meta.url),'utf8');
  const program=babel.parsers.babel.parse(source,{parser:'babel'}).program;
  const binding=name=>{const node=program.body.find(node=>node.type==='FunctionDeclaration'&&node.id?.name===name);assert.ok(node,'Actual '+name+' component');return node;};
  const profile=binding(spec.profile),menu=binding(spec.menu),effects=[],actions=[],posts=[];
  const state={account:{...account,isPlanActive:account.isActive,usageWindows:[]}};
  const context={gamecoworkAccountDisplay,gamecoworkOpenAccountUsage,console,window:{addEventListener(){},removeEventListener(){}},setTimeout:()=>0,clearTimeout(){},
    a:{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props}),Fragment:'fragment'},
    d:{useState:initial=>[initial,()=>{}],useRef:initial=>({current:initial}),useCallback:callback=>callback,useEffect:effect=>effects.push(effect),useContext:()=>({post:(...args)=>posts.push(args),request:async()=>({status:'success',content:{visible:false}})})},
    M:selector=>typeof selector==='function'?selector(state):null,yn:()=>({session:publicSession,login(){}}),Rn:()=>false,qt:()=>false,
    Vg:()=>({start(){}}),Og:()=>({start(){}}),Z:(...parts)=>parts.filter(Boolean).join(' '),J:(...parts)=>parts.filter(Boolean).join(' '),
    [spec.translate]:()=>({t:key=>key,i18n:{language:'zh'}}),[spec.dispatch]:()=>action=>actions.push(action),[spec.plan]:payload=>({type:'actual-plan-thunk',payload}),
    [spec.windows]:()=>[],[spec.usage]:()=>({type:'usage-thunk'}),[spec.info]:()=>({type:'account-info-thunk'})};
  // Leaf UI symbols and unrelated selectors are stubs. The actual account/menu
  // functions, hook callbacks and generated props below remain source-derived.
  for(const node of [profile,menu])walk(node,entry=>{if(entry.type==='Identifier'&&!Object.hasOwn(context,entry.name)&&!['Object','String','Number','Date','Math','Promise','JSON','Set','Array'].includes(entry.name))context[entry.name]=()=>null;});
  const built=vm.createContext(context);vm.runInContext(source.slice(profile.start,profile.end)+'\n'+source.slice(menu.start,menu.end)+'\nthis.renderProfile='+spec.profile+';this.renderMenu='+spec.menu+';',built);
  return{tree:built.renderProfile({displayName:'Wrong old name',displaySubtext:'102427',displayEmail:'102427',isAuthenticated:true,planType:null}),menu:built.renderMenu,effects,actions,posts};
}
function textNodes(node,result=[]){if(node===null||node===undefined)return result;if(typeof node==='string')result.push(node);else if(Array.isArray(node))node.forEach(child=>textNodes(child,result));else if(typeof node==='object'&&node.props)textNodes(node.props.children,result);return result;}
for(const spec of specs)test(spec.file+': actual account component uses broker fields, fetches the plan without org-dependent gating and renders UID as an ID',async()=>{
  const official=renderer(spec,session()),triggerText=textNodes(official.tree.props.trigger);
  assert.ok(triggerText.includes('Fixture Named User'));assert.ok(triggerText.includes('Pro'));assert.ok(triggerText.includes('账号 ID: 102427'));assert.ok(!triggerText.includes('Wrong old name'));
  const menuProps=official.tree.props.children.props;assert.equal(menuProps.accountDetail,'账号 ID: 102427');assert.equal(Object.hasOwn(menuProps,'displayEmail'),false);
  const menuTree=official.menu({...menuProps,usageWindows:[]});assert.ok(textNodes(menuTree).includes('账号 ID: 102427'));assert.ok(!textNodes(menuTree).some(text=>text.startsWith('userProfile.email')));
  official.effects[0]();assert.equal(official.actions[0].type,'actual-plan-thunk');assert.equal(official.actions[0].payload.skipTtl,true);
  official.tree.props.onOpenChange(true);assert.equal(official.actions.filter(action=>action.type==='actual-plan-thunk').length,2);menuProps.onAccount();assert.deepEqual(official.posts,[['controlPlane/openUrl',{path:'dashboard/usage',orgSlug:undefined}]]);
  const local=renderer(spec,{mode:'local',account:{id:'gamecowork-local',label:'GameCowork 本地用户'}});local.effects[0]();local.tree.props.onOpenChange(true);local.tree.props.children.props.onAccount();assert.deepEqual(local.actions,[]);assert.deepEqual(local.posts,[]);assert.ok(!textNodes(local.tree.props.trigger).includes('Pro'));
});
