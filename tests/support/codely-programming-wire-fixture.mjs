import http from 'node:http';
import assert from 'node:assert/strict';
import {startMockProvider} from '../fixtures/mock-provider.mjs';

// Loopback-only adapter around the existing real-Agent tool/stream fixture.
// It records the actual model/reasoning wire and lets each fixture response
// retain its real selected model instead of returning one generic model ID.
export async function startProgrammingWireFixture({models,apiKey,fixtureFile}) {
  assert.ok(Array.isArray(models)&&models.length>0&&models.every(model=>typeof model==='string'&&model.length>0));
  const peers=new Map();
  for(const model of new Set(models))peers.set(model,await startMockProvider({model,apiKey,fixtureFile,slowIntervalMs:1200}));
  const wireRequests=[],sockets=new Set();
  const server=http.createServer(async(req,res)=>{
    const chunks=[];let byteLength=0;
    for await(const chunk of req){byteLength+=chunk.length;if(byteLength>16*1024*1024){res.writeHead(413);res.end();return;}chunks.push(chunk);}
    let body;try{body=chunks.length?JSON.parse(Buffer.concat(chunks).toString('utf8')):{};}catch{res.writeHead(400);res.end();return;}
    const record={method:req.method,path:req.url,model:body.model,reasoningEffort:body.reasoning_effort,reasoning:body.reasoning,thinking:body.thinking,
      authorized:req.headers.authorization===`Bearer ${apiKey}`,stream:body.stream===true};
    wireRequests.push(record);
    if(req.url==='/v1/models') {
      res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({object:'list',data:[{id:'fixture-raw-must-stay-hidden',object:'model',owned_by:'fixture'}]}));return;
    }
    const peer=peers.get(body.model);
    if(!peer){res.writeHead(400,{'content-type':'application/json'});res.end(JSON.stringify({error:{message:'Unknown canonical fixture model'}}));return;}
    const target=new URL(req.url,peer.baseUrl),upstream=http.request(target,{method:req.method,headers:{...req.headers,host:target.host}},response=>{
      res.writeHead(response.statusCode,response.headers);response.pipe(res);
    });
    upstream.on('error',()=>{if(!res.destroyed&&!res.headersSent){res.writeHead(502);res.end();}});
    res.once('close',()=>{if(!res.writableFinished)upstream.destroy();});
    upstream.end(Buffer.concat(chunks));
  });
  server.on('connection',socket=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return {
    apiKey,baseUrl:`http://127.0.0.1:${server.address().port}/v1`,wireRequests,
    get requests(){return [...peers.values()].flatMap(peer=>peer.requests);},
    async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));await Promise.all([...peers.values()].map(peer=>peer.close()));},
  };
}
