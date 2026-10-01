// Test-owned local CPP client. It validates the actual welcome project before
// sending commands; no original bridge/account/service is involved.
import assert from "node:assert/strict";
import net from "node:net";
import {randomUUID} from "node:crypto";
export const samePath=(a,b)=>String(a).replace(/\\/g,"/").replace(/^\/\/\?\//,"").toLowerCase()===String(b).replace(/\\/g,"/").replace(/^\/\/\?\//,"").toLowerCase();
export async function connectEditor(port,project){
  const socket=net.createConnection({host:"127.0.0.1",port});let bytes=Buffer.alloc(0),ready=false;
  const pending=new Map();let resolveReady,rejectReady;
  const initial=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
  const initialTimer=setTimeout(()=>rejectReady(new Error("Own local bridge welcome timeout")),6000);
  function wire(text){const value=Buffer.from(text),header=Buffer.alloc(8);header.writeBigUInt64BE(BigInt(value.length));return Buffer.concat([header,value]);}
  socket.on("error",error=>{rejectReady(error);for(const item of pending.values())item.reject(error);});
  socket.on("data",chunk=>{try{bytes=Buffer.concat([bytes,chunk]);if(!ready){const newline=bytes.indexOf(10);if(newline<0)return;const welcome=bytes.subarray(0,newline).toString();assert.match(welcome,/FRAMING=1/);const root=welcome.match(/PROJECT_ROOT=([^\s]+)/)?.[1];assert.ok(root&&samePath(decodeURIComponent(root),project),"Actual CPP welcome must identify the requested own project");bytes=bytes.subarray(newline+1);ready=true;clearTimeout(initialTimer);resolveReady();}while(bytes.length>=8){const size=Number(bytes.readBigUInt64BE());assert.ok(size<=1048576);if(bytes.length<size+8)return;const message=JSON.parse(bytes.subarray(8,size+8));bytes=bytes.subarray(size+8);pending.get(message.request_id)?.resolve(message.result);pending.delete(message.request_id);}}catch(error){rejectReady(error);socket.destroy();}});
  await initial.finally(()=>clearTimeout(initialTimer));socket.write(wire("CLIENT_VERSION=2"));
  return{close:()=>socket.destroy(),async call(action){const id=randomUUID();let timer;try{return await Promise.race([new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});socket.write(wire(JSON.stringify({type:"manage_window_bridge",params:{action},request_id:id})));}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("Own local bridge command timeout")),6000);})]);}finally{clearTimeout(timer);pending.delete(id);}}};
}
