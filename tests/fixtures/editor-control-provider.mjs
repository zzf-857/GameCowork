import http from 'node:http';
import {randomUUID} from 'node:crypto';

// Standalone fixture provider. Captures actual offered schemas and only accepts
// the exact tool-call ID it issued; it never contacts an external service.
export async function startEditorControlProvider({plans,onResult}){
 const requests=[],issued=new Map(),sockets=new Set();const model='editor-control-fixture',apiKey='fixture-no-real-key';
 const content=value=>typeof value==='string'?value:Array.isArray(value)?value.map(item=>item.text||'').join('\n'):'';
 const server=http.createServer(async(request,response)=>{
  let bytes='';for await(const chunk of request)bytes+=chunk;let body;
  try{body=bytes?JSON.parse(bytes):{};}catch{response.writeHead(400).end();return;}
  if(request.headers.authorization!==`Bearer ${apiKey}`){response.writeHead(401).end();return;}
  if(request.url==='/v1/models'){response.setHeader('Content-Type','application/json');response.end(JSON.stringify({object:'list',data:[{id:model,object:'model',owned_by:'fixture'}]}));return;}
  if(request.url!=='/v1/chat/completions'){response.writeHead(404).end();return;}
  const prompt=content([...(body.messages||[])].reverse().find(message=>message.role==='user')?.content),key=Object.keys(plans).sort((a,b)=>b.length-a.length).find(value=>prompt.includes(value));
  const offered=(body.tools||[]).filter(tool=>tool.function?.name==='unity_editor').map(tool=>tool.function);
  const selectedName=plans[key]?.toolName||'unity_editor',selected=(body.tools||[]).find(tool=>tool.function?.name===selectedName);
  const record={key,at:Date.now(),offeredEditorSchemas:offered,selectedToolName:selectedName,selectedToolSchema:selected?.function,stream:body.stream===true,toolResultMatchedIssuedId:false};requests.push(record);
  const ownResults=(body.messages||[]).filter(message=>message.role==='tool'&&issued.get(message.tool_call_id)?.key===key),ownResult=ownResults.at(-1);
  let calls=[],text=key+'_UNAVAILABLE';
  if(ownResult){record.toolResultMatchedIssuedId=true;record.issuedId=ownResult.tool_call_id;record.resultText=content(ownResult.content);record.toolResults=ownResults.map(message=>({issuedId:message.tool_call_id,index:issued.get(message.tool_call_id).index,resultText:content(message.content)}));record.observation=await onResult?.(plans[key],record);text=key+'_CAPTURED';}
  else if(key&&selected){
   const argumentsList=plans[key].toolCalls||[plans[key].arguments||plans[key]];
   calls=argumentsList.map((argumentsValue,index)=>{const id='editor-issued-'+randomUUID();issued.set(id,{key,index});return {id,type:'function',function:{name:selectedName,arguments:JSON.stringify(argumentsValue)}};});
   record.issuedId=calls[0].id;record.arguments=argumentsList[0];record.issuedIds=calls.map(call=>call.id);record.toolCalls=calls.map((call,index)=>({issuedId:call.id,index,arguments:argumentsList[index]}));
  }
  const id='editor-fixture-'+randomUUID();
  if(!body.stream){response.setHeader('Content-Type','application/json');response.end(JSON.stringify({id,object:'chat.completion',created:1,model,choices:[{index:0,message:calls.length?{role:'assistant',content:null,tool_calls:calls}:{role:'assistant',content:text},finish_reason:calls.length?'tool_calls':'stop'}],usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}}));return;}
  response.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache'});
  const send=(delta,finish_reason=null)=>response.write('data: '+JSON.stringify({id,object:'chat.completion.chunk',created:1,model,choices:[{index:0,delta,finish_reason}]})+'\n\n');
  send(calls.length?{tool_calls:calls.map((call,index)=>({index,...call}))}:{content:text});send({},calls.length?'tool_calls':'stop');response.end('data: [DONE]\n\n');
 });
 server.on('connection',socket=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 return {model,apiKey,baseUrl:`http://127.0.0.1:${server.address().port}/v1`,requests,async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}};
}
