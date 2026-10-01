import test from 'node:test';
import assert from 'node:assert/strict';
import {startMockProvider} from './mock-provider.mjs';

test('fixture tool sequence requires each issued ID and never declares partial read as edit success', async () => {
  let reads=0,edits=0,readState='before';
  const provider=await startMockProvider({toolPlans:{GCW_SEQUENCE:{steps:[
    {toolName:'read_file',arguments:{absolute_path:'fixture'},verify:text=>{reads++;return readState==='before'&&text==='actual-before';}},
    {toolName:'replace',arguments:{file_path:'fixture',old_string:'before',new_string:'after'},verify:text=>{edits++;return text==='actual-after';}},
  ]}}});
  const tools=['read_file','replace'].map(name=>({type:'function',function:{name,parameters:{type:'object',properties:{}}}}));
  const initial=[{role:'user',content:'GCW_SEQUENCE'}];
  const send=messages=>fetch(provider.baseUrl+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${provider.apiKey}`},body:JSON.stringify({model:provider.model,messages,tools,stream:false})}).then(response=>response.json());
  try{
    const first=await send(initial),read=first.choices[0].message.tool_calls[0];
    assert.equal(read.function.name,'read_file');
    const unissued=await send([...initial,{role:'tool',tool_call_id:'not-issued',content:'actual-before'}]);
    assert.equal(unissued.choices[0].message.tool_calls[0].function.name,'read_file');
    assert.equal(reads,0);
    const readMessages=[...initial,{role:'tool',tool_call_id:read.id,content:'actual-before'}];
    const second=await send(readMessages),edit=second.choices[0].message.tool_calls[0];
    assert.equal(edit.function.name,'replace');
    assert.equal(reads,1);assert.equal(edits,0);
    assert.equal(provider.requests.at(-1).stepResultVerified,true);
    assert.equal(provider.requests.at(-1).toolResultVerified,false);
    readState='after';
    const wrongEdit=await send([...readMessages,{role:'tool',tool_call_id:'not-issued-edit',content:'actual-after'}]);
    assert.equal(wrongEdit.choices[0].message.tool_calls[0].function.name,'replace');
    assert.equal(edits,0);
    const done=await send([...readMessages,{role:'tool',tool_call_id:edit.id,content:'actual-after'}]);
    assert.equal(done.choices[0].message.content,'GCW_SEQUENCE_CONFIRMED');
    assert.equal(reads,1);assert.equal(edits,1);
    assert.equal(provider.requests.at(-1).toolResultVerified,true);
    assert.equal(provider.requests.at(-1).verifiedStepCount,2);
  }finally{await provider.close();}
});

test('fixture verification failure stops the sequence and remains a failed result', async () => {
  const provider=await startMockProvider({toolPlans:{GCW_SEQUENCE_FAIL:{steps:[
    {toolName:'write_file',arguments:{file_path:'fixture',content:'fixture'},verify:()=>{throw Object.assign(Error('own fixture failure'),{code:'FIXTURE_NOT_CHANGED'});}},
    {toolName:'replace',arguments:{file_path:'fixture'},verify:()=>true},
  ]}}});
  const messages=[{role:'user',content:'GCW_SEQUENCE_FAIL'}];
  const tools=['write_file','replace'].map(name=>({type:'function',function:{name,parameters:{type:'object',properties:{}}}}));
  const send=messages=>fetch(provider.baseUrl+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${provider.apiKey}`},body:JSON.stringify({model:provider.model,messages,tools,stream:false})}).then(response=>response.json());
  try{
    const first=await send(messages),id=first.choices[0].message.tool_calls[0].id;
    const failed=await send([...messages,{role:'tool',tool_call_id:id,content:'not actual success'}]);
    assert.equal(failed.choices[0].message.content,'GCW_SEQUENCE_FAIL_FAILED');
    assert.equal(provider.requests.at(-1).toolResultVerified,false);
    assert.equal(provider.requests.at(-1).toolResultVerificationError,'FIXTURE_NOT_CHANGED');
    assert.equal(provider.requests.at(-1).requestedActionTool,undefined);
  }finally{await provider.close();}
});
