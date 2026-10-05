// A loopback CPA report deliberately disagrees with its actual owned PNG bytes.
// This tests request intent, gateway claims and verified file metadata separately.
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createOwnedGenerationMedia} from '../fixtures/asset-generation-provider-fixture.mjs';

export async function startAccountCpaProvider(rootValue){
  const temp=path.resolve('F:/AI/AgentMake/temp/GameCowork'),root=path.resolve(rootValue),areas=['cpa-flexible-20261003','cpa-variant-buttons-20261003'].map(name=>path.join(temp,name));
  assert.ok(areas.some(area=>root.toLowerCase().startsWith(area.toLowerCase()+path.sep)),'The account fixture stays inside a named CPA temp area');
  fs.mkdirSync(root,{recursive:true});const media=createOwnedGenerationMedia(root),apiKey='owned-account-fixture-'+randomUUID(),requests=[],sockets=new Set();let baseUrl;
  const server=http.createServer(async(request,response)=>{
    try{
      let size=0,chunks=[];for await(const chunk of request){size+=chunk.length;assert.ok(size<=1024*1024,'Bounded fixture request');chunks.push(chunk);}
      const target=new URL(request.url,baseUrl),body=chunks.length?JSON.parse(Buffer.concat(chunks)):{};
      const authorized=request.headers.authorization==='Bearer '+apiKey;requests.push({method:request.method,path:target.pathname,authorized,body});
      response.setHeader('Content-Type','application/json');
      if(!authorized){response.writeHead(401);response.end(JSON.stringify({error:'Owned fixture authorization required'}));return;}
      if(request.method!=='POST'||target.pathname!=='/images/generations'){response.writeHead(404);response.end(JSON.stringify({error:'Unsupported owned fixture route'}));return;}
      response.writeHead(200);response.end(JSON.stringify({created:Math.floor(Date.now()/1000),size:'1254x1254',quality:'low',output_format:'png',data:[{b64_json:media.png.bytes.toString('base64')}]}));
    }catch(error){if(!response.headersSent)response.writeHead(400,{'Content-Type':'application/json'});response.end(JSON.stringify({error:error.message}));}
  });
  server.on('connection',socket=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});baseUrl='http://127.0.0.1:'+server.address().port;
  return{baseUrl,apiKey,media,requests,async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}};
}
