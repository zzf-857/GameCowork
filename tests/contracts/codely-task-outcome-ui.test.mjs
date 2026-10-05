import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import babel from '../../tools/node_modules/prettier/plugins/babel.mjs';
import {gamecoworkSubmissionUnknown,gamecoworkTaskOutcomeLabel,gamecoworkUnknownRetryHint,gamecoworkHistoryDefaultStatus,gamecoworkTaskErrorDetails,gamecoworkTaskErrorDetailsText,GameCoworkTaskErrorDetails} from '../../src/frontend/bundle/codely-generator/task-outcome.js';

const main=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js',import.meta.url),'utf8');
const program=(await babel.parsers.babel.parse(main,{parser:'babel'})).program;
const binding=name=>{const node=program.body.find(node=>node.type==='FunctionDeclaration'&&node.id?.name===name);assert.ok(node,'Actual preserved function '+name);return node;};
const source=name=>{const node=binding(name);return main.slice(node.start,node.end);};
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const [key,value]of Object.entries(node))if(!['loc','extra','comments','tokens'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit);}}
const unknown=()=>({id:'owned-unknown',status:'failed',errorCode:'local_submission_unknown',local:{submissionUnknown:true},error:'结果未知，请先核对服务端记录。'});
const helpers={gamecoworkSubmissionUnknown,gamecoworkTaskOutcomeLabel,gamecoworkUnknownRetryHint,gamecoworkTaskErrorDetails,GameCoworkTaskErrorDetails};
const render=(type,props)=>({type,...props});
const translation=key=>({'studio.task.failed':'生成失败','studio.task.retry':'重试','generation.status.failed':'失败'}[key]||key);
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('Only the explicit terminal code and boolean marker identify uncertain local submission',()=>{
  const record=unknown();assert.equal(gamecoworkSubmissionUnknown(record),true);assert.equal(gamecoworkSubmissionUnknown({data:record}),true);
  assert.equal(gamecoworkSubmissionUnknown({...record,local:undefined,submissionUnknown:true}),true);
  for(const change of [{errorCode:'local_task_interrupted'},{local:{submissionUnknown:'true'}},{local:undefined},{status:'running'},{status:'completed'},{errorCode:undefined}])assert.equal(gamecoworkSubmissionUnknown({...record,...change}),false);
  for(const value of [null,{},'fetch failed',{status:'failed',error:'fetch failed; create outcome is unknown and will not be resubmitted'}])assert.equal(gamecoworkSubmissionUnknown(value),false);
  assert.equal(gamecoworkTaskOutcomeLabel(record,'失败'),'结果未知');assert.equal(gamecoworkTaskOutcomeLabel(record,'Failed','en-US'),'Result unknown');
  assert.equal(gamecoworkTaskOutcomeLabel({status:'failed'},'失败'),'失败');assert.match(gamecoworkUnknownRetryHint(),/先核对服务端记录/);
});

function originalQuickHook(reply){
  let values=[],nextReply=reply;const calls=[],timers=[];
  const context=vm.createContext({...helpers,Date,Map,Set,xA:0,w_:100,iwe:3000,swe:600000,J1e:14400000,rwe:10,nwe:{},
    y:{useState:()=>[values,update=>{values=typeof update==='function'?update(values):update;}],useRef:value=>({current:value}),useCallback:fn=>fn,useEffect:()=>{}},
    setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout:()=>{},
    Mn:{post:async(path,body)=>{calls.push({method:'POST',path,body});return{taskId:'owned-server-task'};},get:async path=>{calls.push({method:'GET',path});return nextReply;},put:async()=>assert.fail('No discard operation was requested')},
    X1e:id=>'/task/'+id+'/status',owe:reply=>reply.taskId,wN:()=>false,ewe:status=>status==='failed'?'failed':'running',awe:error=>error.message,
    gamecoworkCpaFactLines:()=>[],k5:()=>assert.fail('Unknown create cannot fabricate a success artifact'),
  });
  vm.runInContext(source('hwe')+';this.hook=hwe();',context);
  return {hook:context.hook,calls,timers,values:()=>values,setReply:value=>{nextReply=value;}};
}

test('Actual original Quick polling retains the uncertain marker and its retry callback cannot create again',async()=>{
  for(const reply of [unknown(),{data:unknown()}]){
    const run=originalQuickHook(reply);run.hook.generate({model:{id:'owned-image'},payload:{prompt:'Original prompt'},prompt:'Original prompt'});await tick();
    assert.equal(run.calls.filter(call=>call.method==='POST').length,1);assert.equal(run.timers.length,1);
    await run.timers.shift()();const task=run.values()[0];assert.equal(task.status,'failed');assert.equal(task.submissionUnknown,true);assert.equal(task.errorCode,'local_submission_unknown');
    assert.equal(task.serverTaskId,'owned-server-task');assert.equal(run.hook.retryTask(task),null);await tick();
    assert.equal(run.calls.filter(call=>call.method==='POST').length,1,'Explicit uncertain create is not replayed by original retry');assert.equal(run.timers.length,0);
  }
});

test('Actual ordinary failed retry and poll-timeout recovery retain their original distinct behavior',async()=>{
  const run=originalQuickHook({status:'failed',errorCode:'local_task_failed',error:'Provider HTTP 502'});
  run.hook.generate({model:{id:'owned-image'},payload:{prompt:'Ordinary failure'},prompt:'Ordinary failure'});await tick();await run.timers.shift()();
  const task=run.values()[0];assert.equal(task.submissionUnknown,false);run.hook.retryTask(task);await tick();assert.equal(run.calls.filter(call=>call.method==='POST').length,2);
  run.timers.length=0;const before=run.calls.length;run.hook.retryTask({...task,error:'poll-timeout',submissionUnknown:false});
  assert.equal(run.calls.length,before,'Original poll-timeout recovery schedules a GET instead of another POST');assert.equal(run.timers.length,1);
});

test('The actual original Quick failed card labels unknown outcomes and disables both the retry button and handler',()=>{
  const retries=[],context=vm.createContext({...helpers,Er:{language:'zh'},f:{jsx:render,jsxs:render},la:()=>()=>{},TS:'ErrorIcon',gZ:'OriginalReason',jc:'RetryIcon'});
  vm.runInContext(source('yZ')+';this.card=yZ;',context);
  const task={...unknown(),submissionUnknown:true,model:{label:'Owned image'},createdAt:100,finishedAt:200};
  const card=context.card({task,now:200,t:translation,onRetry:value=>retries.push(value)});let button,caption,reason;
  walk(card,node=>{if(node.type==='button')button=node;if(node.className==='studio-task-caption')caption=node;if(node.className==='studio-task-failed')reason=node;});
  assert.equal(card['data-submission-unknown'],true);assert.equal(button.disabled,true);assert.equal(button.title,gamecoworkUnknownRetryHint());button.onClick();assert.equal(retries.length,0);
  assert.equal(reason.style.color,'var(--studio-text-secondary)');assert.equal(caption.children[1].children,'结果未知');assert.equal(caption.children[1].className,undefined);
  const ordinary=context.card({task:{...task,errorCode:'local_task_failed',submissionUnknown:false,local:undefined},now:200,t:translation,onRetry:value=>retries.push(value)});let ordinaryButton,ordinaryCaption;
  walk(ordinary,node=>{if(node.type==='button')ordinaryButton=node;if(node.className==='studio-task-caption')ordinaryCaption=node;});
  assert.equal(ordinaryButton.disabled,false);ordinaryButton.onClick();assert.equal(retries.length,1);assert.equal(ordinaryCaption.children[1].children,'生成失败');assert.equal(ordinaryCaption.children[1].className,'is-danger');
});

test('Actual History grid/list status chips and detail header preserve unknown versus failed labels',()=>{
  const context=vm.createContext({...helpers,Er:{language:'zh'},an:()=>({t:translation}),f:{jsx:render,jsxs:render}});
  vm.runInContext(source('KL')+';this.chip=KL;',context);
  const task=unknown(),chip=context.chip({status:'failed',task});assert.equal(chip.children,'结果未知');assert.equal(chip.className,'generation-status is-unknown');assert.equal(chip['data-submission-unknown'],true);
  assert.equal(context.chip({status:'completed',task:{...task,status:'completed'}}),null);assert.equal(context.chip({status:'failed',task:{status:'failed'}}).children,'失败');
  const consumers=[],headers=[];walk(program,node=>{if(node.type!=='CallExpression'||node.callee?.type!=='MemberExpression'||node.callee.object?.name!=='f'||node.callee.property?.name!=='jsx')return;
    if(node.arguments[0]?.name==='KL')consumers.push(node);
    if(node.arguments[0]?.value==='span'&&main.slice(node.start,node.end).includes('gamecoworkTaskOutcomeLabel(t,l(`generation.status.${t.status}`'))headers.push(node);
  });
  assert.equal(consumers.length,2);for(const consumer of consumers){const node=vm.runInNewContext('('+main.slice(consumer.start,consumer.end)+')',{f:{jsx:render},KL:'HistoryStatus',e:task});assert.equal(node.task,task);assert.equal(node.status,'failed');}
  assert.equal(headers.length,1);for(const value of [task,{status:'failed'}]){const result=vm.runInNewContext('('+main.slice(headers[0].start,headers[0].end)+')',{...helpers,f:{jsx:render},Er:{language:'zh'},t:value,l:translation});assert.equal(result.children,value===task?'结果未知':'失败');}
});

test('Original History regenerate parser still restores an uncertain record as an unchanged draft',()=>{
  const model={id:'owned-image',mode:'image'},context=vm.createContext({sY:[{mode:'image',model}],Fwe:payload=>payload.prompt,oY:value=>value,gamecoworkIsThirdPartyModel:()=>false,gamecoworkCustomModel:()=>null});
  vm.runInContext(source('Owe')+';'+source('jwe')+';this.regenerate=jwe;',context);
  const payload={studioModelId:'owned-image',prompt:'Restore the exact original words',size:'3840x2160',resolutionHint:'3840x2160',aspectRatioHint:'16:9'},draft=context.regenerate({...unknown(),taskType:'owned-image',category:'image',input:{data:payload}});
  assert.equal(draft.modelId,model.id);assert.equal(draft.prompt,payload.prompt);assert.deepEqual(JSON.parse(JSON.stringify(draft.payload)),payload);
});

test('Actual main History and tag queries include failed and unknown owned rows while remote and asset pickers stay completed-only',()=>{
  const queryCalls=[];walk(binding('UIe'),node=>{if(node.type==='CallExpression'&&['GZ','rIe'].includes(node.callee?.name))queryCalls.push(node);});
  assert.equal(queryCalls.length,2);
  for(const call of queryCalls){const query=call.arguments[0];assert.equal(query.type,'ObjectExpression');const status=query.properties.find(property=>property.key?.name==='status');assert.ok(status);
    assert.equal(status.value.type,'CallExpression');assert.equal(status.value.callee.name,'gamecoworkHistoryDefaultStatus');
    for(const user of [{accountMode:'local'},{accountMode:'codely-official'},null,{},{accountMode:'remote'}]){
      const value=vm.runInNewContext('('+main.slice(status.value.start,status.value.end)+')',{gamecoworkHistoryDefaultStatus,a:user});
      const local=user?.accountMode==='local'||user?.accountMode==='codely-official';assert.equal(value,local?undefined:'completed');
      const serialized=JSON.parse(JSON.stringify({status:value}));const rows=[{status:'completed'},{status:'failed'},{status:'failed',local:{submissionUnknown:true}}];
      assert.equal(rows.filter(row=>!serialized.status||row.status===serialized.status).length,local?3:1,'The actual original query defaults do not exclude unknown or failed owned rows');
    }
  }
  const pickers=[];walk(program,node=>{if(node.type==='CallExpression'&&node.callee?.name==='GZ'&&!queryCalls.includes(node))pickers.push(node);});assert.equal(pickers.length,1);
  for(const picker of pickers){const property=picker.arguments[0].properties.find(property=>property.key?.name==='status');assert.equal(property.value.value,'completed','Asset/task picker retains the original usable-media-only status filter');}
});

const recordedDetails=()=>({version:1,summary:'服务连接中断，生成结果未知',taskId:'t_owned',model:'gpt-image-2',requestedSize:'3840x2160',submissionUnknown:true,diagnosticRecorded:true,operation:'create',stage:'reading-response',code:'UND_ERR_SOCKET',httpStatus:null,elapsedMs:82625,timeoutMs:180000,createdTime:'2026-10-04T01:02:03.000Z',updatedTime:'2026-10-04T01:03:25.625Z',serviceMessage:'Owned gateway failure',detailUnavailable:null});

test('Structured detail projection keeps only bounded DTO fields and cannot copy raw response/cause secrets',()=>{
  const raw=recordedDetails(),secret='private-raw-marker',details=gamecoworkTaskErrorDetails({errorDetails:{...raw,token:secret,headers:{Authorization:secret},stack:secret,url:'https://private.invalid/'+secret,cause:{message:secret},body:secret}});
  assert.deepEqual(details,raw);assert.equal(gamecoworkTaskErrorDetails({data:{errorDetails:raw}}).taskId,raw.taskId);
  const text=gamecoworkTaskErrorDetailsText(details);assert.match(text,/实际请求耗时：82625 ms/);assert.match(text,/配置请求时限：180000 ms/);assert.match(text,/Owned gateway failure/);assert.doesNotMatch(text,/private-raw-marker|https:\/\/|Authorization/);
  const unsafe=gamecoworkTaskErrorDetails({errorDetails:{...raw,summary:'https://unsafe.invalid/?token=secret',taskId:'bad\nid',model:'https://unsafe.invalid/model',requestedSize:'3840x2160?key=secret',operation:'secret-operation',stage:'https://unsafe.invalid',code:'SECRET_CODE',httpStatus:999,elapsedMs:-1,timeoutMs:Infinity,createdTime:'not-a-time',serviceMessage:'Authorization: Bearer secret'}});
  for(const key of ['taskId','model','requestedSize','operation','stage','code','httpStatus','elapsedMs','timeoutMs','createdTime','serviceMessage'])assert.equal(unsafe[key],null,key);
  assert.equal(unsafe.summary,'请求未完成，请查看错误详情。');assert.equal(gamecoworkTaskErrorDetails({errorDetails:{...raw,version:2}}),null);
});

test('Legacy detail rows never reconstruct missing transport fields from error text or task timestamps',()=>{
  const details=gamecoworkTaskErrorDetails({error:'fetch failed; create outcome is unknown',serverTaskId:'t_legacy',errorDetails:{...recordedDetails(),taskId:null,diagnosticRecorded:false,serviceMessage:null,detailUnavailable:'not-recorded'}});
  assert.equal(details.taskId,'t_legacy');for(const key of ['operation','stage','code','httpStatus','elapsedMs','timeoutMs'])assert.equal(details[key],null);
  const text=gamecoworkTaskErrorDetailsText(details);assert.match(text,/错误代码：未记录/);assert.match(text,/实际请求耗时：未记录/);assert.match(text,/任务时间不等同于请求耗时/);assert.match(text,/任务创建时间：2026-10-04T01:02:03.000Z/);assert.doesNotMatch(text,/82625 ms|UND_ERR_SOCKET|fetch failed/);
});

test('A safe HTTP status recovered by Core remains visible on old records without inventing transport timing',()=>{
  const details=gamecoworkTaskErrorDetails({errorDetails:{...recordedDetails(),summary:'上游服务暂不可用（HTTP 502）',submissionUnknown:false,diagnosticRecorded:false,httpStatus:502,detailUnavailable:'not-recorded'}});
  assert.equal(details.httpStatus,502);for(const key of ['operation','stage','code','elapsedMs','timeoutMs'])assert.equal(details[key],null);
  const text=gamecoworkTaskErrorDetailsText(details);assert.match(text,/HTTP 状态：502/);assert.match(text,/任务尺寸参数：3840x2160/);assert.doesNotMatch(text,/API 请求尺寸|实际请求耗时：82625/);
});

test('Detail formatting explains operation/stage and distinguishes no extra note from missing or hidden records',()=>{
  const base=recordedDetails(),text=gamecoworkTaskErrorDetailsText(base);
  assert.match(text,/请求操作：提交生成（create）/);assert.match(text,/发生阶段：读取响应体（reading-response）/);assert.match(text,/记录说明：无额外说明/);assert.doesNotMatch(text,/详细说明缺失标记/);
  for(const [operation,label]of [['poll','查询任务状态'],['download','下载生成文件'],['cancel','提交取消请求']])assert.ok(gamecoworkTaskErrorDetailsText({...base,operation}).includes(`请求操作：${label}（${operation}）`));
  for(const [stage,label]of [['awaiting-response','等待服务响应'],['http-response','收到 HTTP 响应'],['decoding-response','解析服务响应']])assert.ok(gamecoworkTaskErrorDetailsText({...base,stage}).includes(`发生阶段：${label}（${stage}）`));
  for(const [detailUnavailable,note]of [['not-recorded','未保存详细说明'],['redacted','详细说明含敏感内容，已隐藏'],['unparseable','服务返回内容无法安全解析为错误说明']])assert.ok(gamecoworkTaskErrorDetailsText({...base,detailUnavailable}).includes(`记录说明：${note}（${detailUnavailable}）`));
});

test('Every received 401/402/404/502/503 remains visible, and absent HTTP receipts differ from unrecorded history',()=>{
  for(const httpStatus of [401,402,404,502,503])for(const diagnosticRecorded of [true,false]){
    const details=gamecoworkTaskErrorDetails({errorDetails:{...recordedDetails(),diagnosticRecorded,httpStatus,stage:'http-response',code:'HTTP_ERROR',submissionUnknown:false}});
    assert.equal(details.httpStatus,httpStatus);assert.ok(gamecoworkTaskErrorDetailsText(details).includes(`HTTP 状态：${httpStatus}`));
    const ui=detailHarness({errorDetails:details},async()=>{});let tree=ui.render();labelled(tree,'查看错误详情').onClick();tree=ui.render();assert.ok(find(tree,node=>node['data-error-field']==='httpStatus').children.includes(String(httpStatus)));
  }
  for(const [diagnosticRecorded,stage,expected]of [[true,'awaiting-response','未收到 HTTP 状态码'],[false,'awaiting-response','未记录'],[true,'reading-response','未记录']]){
    const details=gamecoworkTaskErrorDetails({errorDetails:{...recordedDetails(),diagnosticRecorded,stage,httpStatus:null}});
    assert.ok(gamecoworkTaskErrorDetailsText(details).includes(`HTTP 状态：${expected}`));
    const ui=detailHarness({errorDetails:details},async()=>{});let tree=ui.render();labelled(tree,'查看错误详情').onClick();tree=ui.render();assert.ok(find(tree,node=>node['data-error-field']==='httpStatus').children.includes(expected));
  }
});

test('The actual original Quick terminal poll preserves safe detail DTO and server ID for the reusable original Dialog',async()=>{
  const raw={...unknown(),errorDetails:recordedDetails()},run=originalQuickHook(raw);
  run.hook.generate({model:{id:'owned-image'},payload:{prompt:'Original'},prompt:'Original'});await tick();await run.timers.shift()();
  const task=run.values()[0];assert.deepEqual(task.errorDetails,recordedDetails());assert.equal(task.serverTaskId,'owned-server-task');
  const context=vm.createContext({...helpers,y:{useState:value=>[value,()=>{}],useRef:()=>({current:null}),useLayoutEffect:()=>{}},TNe:()=>task.error,f:{jsx:render,jsxs:render,Fragment:'Fragment'},Ke:(...v)=>v.filter(Boolean).join(' '),TM:'OriginalDialog',xb:()=>{}});
  vm.runInContext(source('gZ')+';this.reason=gZ;',context);const result=context.reason({task,t:translation});assert.equal(result.type,GameCoworkTaskErrorDetails);assert.equal(result.Dialog,'OriginalDialog');assert.equal(result.task,task);
});

function detailHarness(task,copyText){
  const slots=[];let cursor=0;
  const React={Fragment:'Fragment',createElement:(type,props,...children)=>({type,...props,children}),useState:initial=>{const index=cursor++;if(!(index in slots))slots[index]=initial;return[slots[index],value=>{slots[index]=value;}];},useRef:initial=>{const index=cursor++;return slots[index]??(slots[index]={current:initial});},useEffect:()=>{}};
  return {render:()=>{cursor=0;return GameCoworkTaskErrorDetails({React,Dialog:'OriginalDialog',task,copyText});}};
}
function find(tree,predicate){let result;walk(tree,node=>{if(!result&&predicate(node))result=node;});assert.ok(result,'Expected error details element');return result;}
const labelled=(tree,label)=>find(tree,node=>node.type==='button'&&node.children?.includes(label));

test('Visible details action reuses the original Dialog and shows exact values, selectable text and copy success/failure',async()=>{
  const copies=[];let denied=false;const task={...unknown(),errorDetails:recordedDetails()},ui=detailHarness(task,async text=>{copies.push(text);if(denied)throw Error('Clipboard denied');});
  let tree=ui.render();labelled(tree,'查看错误详情').onClick();tree=ui.render();const dialog=find(tree,node=>node.type==='OriginalDialog');assert.equal(dialog.title,'错误详情');assert.equal(dialog.wide,true);
  const content=find(tree,node=>node['data-testid']==='gamecowork-task-error-details');for(const [field,value]of [['code','UND_ERR_SOCKET'],['elapsedMs','82625 ms'],['timeoutMs','180000 ms'],['httpStatus','未记录'],['serviceMessage','Owned gateway failure'],['detailUnavailable','无额外说明']])assert.ok(find(content,node=>node['data-error-field']===field).children.includes(value));
  assert.match(find(tree,node=>node.type==='style').children.join(''),/user-select:text/);
  await labelled(tree,'复制错误详情').onClick();tree=ui.render();assert.ok(find(tree,node=>node.role==='status').children.includes('错误详情已复制。'));assert.equal(copies[0],gamecoworkTaskErrorDetailsText(recordedDetails()));
  denied=true;await labelled(tree,'复制错误详情').onClick();tree=ui.render();assert.ok(find(tree,node=>node.role==='alert').children.includes('复制失败，请手动选择并复制详情内容。'));assert.equal(copies[1],copies[0]);
  labelled(tree,'关闭').onClick();tree=ui.render();assert.throws(()=>find(tree,node=>node.type==='OriginalDialog'));
});

test('Actual History inserts the shared error viewer beside its original facts without replacing regenerate behavior',()=>{
  const nodes=[];walk(program,node=>{if(node.type==='CallExpression'&&node.callee?.object?.name==='f'&&node.callee?.property?.name==='jsx'&&node.arguments[0]?.name==='GameCoworkTaskErrorDetails')nodes.push(node);});
  assert.equal(nodes.length,2,'Quick and History each reuse one shared view');
  for(const node of nodes){const result=vm.runInNewContext('('+main.slice(node.start,node.end)+')',{f:{jsx:render},GameCoworkTaskErrorDetails:'OwnedErrorDetails',y:'OriginalReact',TM:'OriginalDialog',xb:'OriginalClipboard',t:unknown()});assert.equal(result.Dialog,'OriginalDialog');assert.equal(result.copyText,'OriginalClipboard');assert.equal(result.React,'OriginalReact');}
});
