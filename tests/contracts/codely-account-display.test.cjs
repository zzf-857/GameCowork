'use strict';
// Real shared broker and extracted handlers from both maintained Core entries.
// All account HTTP is an injected fixture; browser opening is only a spy.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),url=require('node:url');
const accountFile=path.resolve(__dirname,'../../src/core/binary/out/gamecowork-codely-account.js');
const base='http://127.0.0.1:8401',privateAccess='fixture-private-access-DO-NOT-DISPLAY',privateRefresh='fixture-private-refresh-DO-NOT-DISPLAY';
async function fixture(t,{profile={id:102427,username:'owned-user',email:'owned@example.invalid'},plan={plan_type:'pro',plan_tag:'TuanjieAIPro',is_active:true,has_seat:true},login=true}={}){
  const directory=fs.mkdtempSync('F:/AI/AgentMake/temp/GameCowork/account-display-'),module={exports:{}},calls=[],handlers=new Map(),events=[];
  const context=vm.createContext({module,exports:module.exports,require:specifier=>specifier.startsWith('.')?require(path.join(path.dirname(accountFile),specifier)):require(specifier),process:{env:{GAMECOWORK_CODELY_ACCOUNT_DIR:directory},pid:process.pid,platform:process.platform},Buffer,URL,URLSearchParams,AbortController,AbortSignal,Headers,FormData,Blob,TextDecoder,setTimeout,clearTimeout,console});
  vm.runInContext(fs.readFileSync(accountFile,'utf8'),context,{filename:accountFile});const account=module.exports;
  const fixtureFetch=async(address,options={})=>{
    const target=new URL(address);assert.equal(target.origin,base);assert.equal(options.method||'GET',target.pathname.startsWith('/auth/device/')&&target.pathname!=='/auth/device/poll'?'POST':'GET');calls.push(target.pathname);
    const responses={
      '/auth/device/initiate':{auth_request_token:'fixture-request',user_code:'MOCK-CODE',verification_uri:base+'/auth/device',verification_uri_complete:base+'/auth/device',expires_in:600,interval:1},
      '/auth/device/poll':{status:'authorized',authorization_code:'fixture-code'},
      '/auth/device/exchange':{access_token:privateAccess,refresh_token:privateRefresh,expires_in:3600},
      '/auth/external/me':profile,'/api/user/plan':plan,'/api/teams':{teams:[]},
    };
    assert.ok(Object.hasOwn(responses,target.pathname),'No generation/inference/key/unknown service calls');return new Response(JSON.stringify(responses[target.pathname]),{headers:{'Content-Type':'application/json'}});
  };
  const core={orgManager:{updateFromListTeams(){},getCurrentOrgId:()=>null,getOrganizations:()=>[],getCurrentOrgName:()=>null,getMultiTeamEnabled:()=>false,reset(){}}};
  const wiring=account.registerCoreWiring({core,messenger:{on:(name,fn)=>handlers.set(name,fn),request:async()=>assert.fail('Vault is directly injected'),send:(name,value)=>events.push({name,value})},logger:{warn(){},error(){}},overrides:{root:directory,baseUrl:base,fetch:fixtureFetch,autoDrive:false,vault:{seal:async(bytes)=>Buffer.from(bytes),unseal:async(bytes)=>Buffer.from(bytes)}}});
  await handlers.get('codelyAccount/status')();t.after(()=>wiring.broker.close());
  if(login){await handlers.get('codelyAccount/start')();assert.equal((await handlers.get('codelyAccount/poll')()).status,'completed');}
  return{account,wiring,handlers,calls,events};
}
function extractHandler(filename,name,nextName,account){
  const source=fs.readFileSync(path.resolve(__dirname,'../../src/core/binary/out/'+filename),'utf8'),start=source.indexOf(`n("${name}",`),end=source.indexOf(`n("${nextName}",`,start);
  assert.ok(start>=0&&end>start);const registration=source.slice(start,end).trim().replace(/,\s*$/,'');let handler,ideReads=0,legacyPlanReads=0;const opened=[];
  const context=vm.createContext({require:specifier=>{assert.equal(specifier,'./gamecowork-codely-account.js');return account;},n:(registered,fn)=>{assert.equal(registered,name);handler=fn;},t:{ide:{getIdeSettings:()=>({})},messenger:{request:async(kind,value)=>{assert.equal(kind,'openUrl');opened.push(value);}},configHandler:{controlPlaneClient:{getUserPlan:async()=>{legacyPlanReads++;assert.fail('Authenticated plan must remain broker-owned');}}}},ip:async()=>{ideReads++;return{API_URL:'https://api.gamecowork.invalid/'};},gZa:{resolve:url.resolve},msn:(base,path)=>new URL(path,base).toString(),URL});
  vm.runInContext(registration,context,{timeout:100});assert.equal(typeof handler,'function');return{handler,opened,ideReads:()=>ideReads,legacyPlanReads:()=>legacyPlanReads};
}
test('verified email and username reach the display DTO; UID and credentials keep their distinct meaning',async t=>{
  const f=await fixture(t),session=(await f.handlers.get('getControlPlaneSessionInfo')({data:{silent:true}}));assert.equal(session.account.id,'102427');assert.equal(session.account.email,'owned@example.invalid');assert.equal(session.account.username,'owned-user');assert.equal(session.account.label,'owned-user');
  for(const secret of[privateAccess,privateRefresh])assert.equal(JSON.stringify([session,f.events,f.wiring.broker.status()]).includes(secret),false);
});
test('missing or malformed email stays unknown and never falls back to numeric UID',async t=>{
  for(const email of[undefined,null,'','102427','missing-at-sign']){
    const f=await fixture(t,{profile:{id:102427,email}}),session=f.wiring.broker.status().session;assert.equal(session.account.email,null);assert.equal(session.account.username,null);assert.equal(session.account.id,'102427');assert.equal(session.account.label,'Codely 用户');
  }
});
test('an upstream profile cannot disguise a private token as a public display field',async t=>{
  const f=await fixture(t,{profile:{id:102427,username:privateAccess,email:privateRefresh+'@example.invalid'}}),session=f.wiring.broker.status().session;
  assert.equal(session.account.username,null);assert.equal(session.account.email,null);assert.equal(session.account.label,'Codely 用户');for(const secret of[privateAccess,privateRefresh])assert.equal(JSON.stringify([session,f.events]).includes(secret),false);
});
for(const filename of ['index.js','index.beautified.js']){
  test(`${filename}: authenticated usage links open the trusted public website without selecting an SDK API base`,async t=>{
    const f=await fixture(t),before=f.calls.length;
    const original=extractHandler(filename,'controlPlane/openUrl','controlPlane/openUrlV2',f.account);await original.handler({data:{path:'dashboard/usage'}});assert.deepEqual(original.opened,['https://codely.tuanjie.cn/dashboard/usage']);assert.equal(original.ideReads(),0);
    await original.handler({data:{path:'dashboard/usage',orgSlug:'a&next=https://outside.invalid'}});assert.equal(new URL(original.opened[1]).searchParams.get('org'),'a&next=https://outside.invalid');assert.equal(new URL(original.opened[1]).searchParams.size,1);
    const v2=extractHandler(filename,'controlPlane/openUrlV2','controlPlane/openBrowser',f.account);await v2.handler({data:{path:'dashboard/usage'}});assert.deepEqual(v2.opened,['https://codely.tuanjie.cn/dashboard/usage']);assert.equal(v2.ideReads(),0);
    assert.equal(f.calls.length,before,'URL selection performs no account or AI HTTP request');for(const secret of[privateAccess,privateRefresh])assert.equal(JSON.stringify([...original.opened,...v2.opened]).includes(secret),false);
    assert.match(fs.readFileSync(path.resolve(__dirname,'../../src/core/binary/out/'+filename),'utf8'),/API_URL\s*:\s*["']https:\/\/api\.gamecowork\.invalid\//,'Legacy network SDK base is not restored by the public-link fix');
  });
  test(`${filename}: local mode retains the existing disabled control-plane URL behavior`,async t=>{
    const f=await fixture(t,{login:false}),original=extractHandler(filename,'controlPlane/openUrl','controlPlane/openUrlV2',f.account);await original.handler({data:{path:'dashboard/usage'}});assert.deepEqual(original.opened,['https://api.gamecowork.invalid/dashboard/usage']);assert.equal(original.ideReads(),1);assert.equal(f.calls.length,0);
  });
  test(`${filename}: genuine Pro fields remain positive while missing seat/activity facts remain unknown`,async t=>{
    for(const raw of[{plan_type:'pro',plan_tag:'TuanjieAIPro',is_active:true,has_seat:true},{plan_type:'free',is_team_plan:true,has_seat:false,is_active:false},{plan_type:'pro',plan_tag:'TuanjieAIPro'}]){
      const f=await fixture(t,{plan:raw}),branch=extractHandler(filename,'controlPlane/getUserPlan','controlPlane/getUserUsageSummary',f.account),value=await branch.handler({data:{}});
      assert.equal(value.planType,raw.plan_type);assert.equal(value.planTag,raw.plan_tag);assert.equal(value.hasSeat,typeof raw.has_seat==='boolean'?raw.has_seat:null);assert.equal(value.isActive,typeof raw.is_active==='boolean'?raw.is_active:null);assert.equal(value.isTeamPlan,typeof raw.is_team_plan==='boolean'?raw.is_team_plan:null);assert.equal(branch.legacyPlanReads(),0);
      const cached=f.wiring.broker.status().plan;assert.equal(cached.hasSeat,value.hasSeat);assert.equal(cached.isActive,value.isActive);assert.equal(cached.isTeamPlan,value.isTeamPlan);
    }
  });
}
test('authenticated public links cannot escape the Codely host or accept embedded credentials',async t=>{
  const f=await fixture(t);for(const target of['//outside.invalid/dashboard/usage','https://outside.invalid/','https://user:secret@codely.tuanjie.cn/','javascript:alert(1)','dashboard\\usage'])assert.throws(()=>f.account.codelyAccountPublicControlPlaneUrl(target));
  assert.equal(f.account.codelyAccountPublicControlPlaneUrl('/dashboard/usage'),'https://codely.tuanjie.cn/dashboard/usage');
});
