import http from 'node:http';
import {randomUUID} from 'node:crypto';

// Test-specific loopback provider: one real assistant turn may issue different
// Editor tools. Only the exact IDs actually returned by the Agent are consumed.
export async function startSceneMutationProvider({plans}){
 const requests=[],issued=new Map(),sockets=new Set(),model='scene-mutation-fixture',apiKey='fixture-no-real-key';
 const content=value=>typeof value==='string'?value:Array.isArray(value)?value.map(item=>item.text||'').join('\n'):'';
 const server=http.createServer(async(request,response)=>{
  let bytes='';for await(const chunk of request)bytes+=chunk;let body;try{body=bytes?JSON.parse(bytes):{};}catch{response.writeHead(400).end();return;}
  if(request.headers.authorization!==`Bearer ${apiKey}`){response.writeHead(401).end();return;}
  if(request.url==='/v1/models'){response.setHeader('Content-Type','application/json');response.end(JSON.stringify({object:'list',data:[{id:model,object:'model',owned_by:'fixture'}]}));return;}
  if(request.url!=='/v1/chat/completions'){response.writeHead(404).end();return;}
  const prompt=content([...(body.messages||[])].reverse().find(message=>message.role==='user')?.content),key=Object.keys(plans).sort((a,b)=>b.length-a.length).find(value=>prompt.includes(value)),plan=plans[key];
  const requested=plan?.calls||[{toolName:plan?.toolName,arguments:plan?.arguments}],schemas=requested.map(call=>(body.tools||[]).find(tool=>tool.function?.name===call.toolName)?.function);
  const record={key,at:Date.now(),selectedToolName:requested[0].toolName,selectedToolSchema:schemas[0],selectedToolSchemas:schemas,stream:body.stream===true,toolResultMatchedIssuedId:false};requests.push(record);
  const ownResults=(body.messages||[]).filter(message=>message.role==='tool'&&issued.get(message.tool_call_id)?.key===key);let calls=[],text=key+'_UNAVAILABLE';
  if(ownResults.length){record.toolResultMatchedIssuedId=true;record.issuedId=ownResults.at(-1).tool_call_id;record.resultText=content(ownResults.at(-1).content);record.toolResults=ownResults.map(message=>({issuedId:message.tool_call_id,index:issued.get(message.tool_call_id).index,toolName:issued.get(message.tool_call_id).toolName,resultText:content(message.content)}));text=key+'_CAPTURED';}
  else if(key&&schemas.every(Boolean)){
   calls=requested.map((call,index)=>{const id='editor-issued-'+randomUUID();issued.set(id,{key,index,toolName:call.toolName});return {id,type:'function',function:{name:call.toolName,arguments:JSON.stringify(call.arguments)}};});
   record.issuedId=calls[0].id;record.issuedIds=calls.map(call=>call.id);record.arguments=requested[0].arguments;record.toolCalls=calls.map((call,index)=>({issuedId:call.id,index,toolName:requested[index].toolName,arguments:requested[index].arguments}));
  }
  const id='mutation-fixture-'+randomUUID();
  if(!body.stream){response.setHeader('Content-Type','application/json');response.end(JSON.stringify({id,object:'chat.completion',created:1,model,choices:[{index:0,message:calls.length?{role:'assistant',content:null,tool_calls:calls}:{role:'assistant',content:text},finish_reason:calls.length?'tool_calls':'stop'}],usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}}));return;}
  response.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache'});const send=(delta,finish_reason=null)=>response.write('data: '+JSON.stringify({id,object:'chat.completion.chunk',created:1,model,choices:[{index:0,delta,finish_reason}]})+'\n\n');
  send(calls.length?{tool_calls:calls.map((call,index)=>({index,...call}))}:{content:text});send({},calls.length?'tool_calls':'stop');response.end('data: [DONE]\n\n');
 });
 server.on('connection',socket=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 return {model,apiKey,baseUrl:`http://127.0.0.1:${server.address().port}/v1`,requests,async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}};
}
