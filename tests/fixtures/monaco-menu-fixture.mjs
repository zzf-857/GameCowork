// Read-only Chromium inspection of the shipped Monaco context-menu handlers.
// Menu visibility precedes installation of its delayed mouseup action handler.
// Do not replace the real click, trigger the action from JS, or assume a delay.
import {randomUUID} from 'node:crypto';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function createMonacoMenuProbe(context,page,frame){
 const session=await context.newCDPSession(page),contexts=new Map(),group='gamecowork-menu-'+randomUUID();
 session.on('Runtime.executionContextCreated',({context:value})=>{if(value.auxData?.isDefault)contexts.set(value.auxData.frameId,value.id);});
 session.on('Runtime.executionContextDestroyed',({executionContextId:id})=>{for(const[key,value]of contexts)if(value===id)contexts.delete(key);});
 session.on('Runtime.executionContextsCleared',()=>contexts.clear());
 await session.send('Runtime.enable');
 async function inspect(text){
  const tree=await session.send('Page.getFrameTree');
  function find(node){if(node.frame.url===frame.url())return node.frame.id;for(const child of node.childFrames||[]){const id=find(child);if(id)return id;}return null;}
  const frameId=find(tree.frameTree),contextId=contexts.get(frameId);
  if(!contextId)throw new Error('Current Monaco frame execution context is unavailable');
  const expression=`(()=>{const roots=[document];for(let index=0;index<roots.length;index++){for(const element of roots[index].querySelectorAll('*'))if(element.shadowRoot)roots.push(element.shadowRoot);for(const label of roots[index].querySelectorAll('.monaco-menu .action-label'))if(label.textContent.trim()===${JSON.stringify(text)})return label.closest('li.action-item');}return null;})()`;
  const value=await session.send('Runtime.evaluate',{expression,contextId,objectGroup:group,silent:true});
  if(value.exceptionDetails)throw new Error('Cannot inspect the actual Monaco menu item');
  if(value.result.subtype==='null'||!value.result.objectId)return{present:false,ready:false,handlers:[]};
  const result=await session.send('DOMDebugger.getEventListeners',{objectId:value.result.objectId});
  const handlers=[];
  for(const listener of result.listeners.filter(value=>value.type==='mouseup')){
   const objectId=listener.handler?.objectId||listener.originalHandler?.objectId;let source='';
   if(objectId){const body=await session.send('Runtime.callFunctionOn',{objectId,functionDeclaration:'function(){return Function.prototype.toString.call(this);}',returnByValue:true,silent:true});source=String(body.result.value||'');}
   // The base handler only removes the active class. The execution handler
   // installed by the shipped menu scheduler actually calls onClick.
   handlers.push({source,line:listener.lineNumber,column:listener.columnNumber,scriptId:listener.scriptId,invokesAction:source.includes('.onClick(')});
  }
  await session.send('Runtime.releaseObject',{objectId:value.result.objectId}).catch(()=>{});
  return{present:true,ready:handlers.some(handler=>handler.invokesAction),handlers};
 }
 return{inspect,async waitForReady(text,timeout=3000){const deadline=Date.now()+timeout;let last;while(Date.now()<deadline){last=await inspect(text);if(last.ready)return last;await sleep(10);}throw new Error('Actual Monaco mouseup action handler did not become ready: '+JSON.stringify(last));},async dispose(){await session.send('Runtime.releaseObjectGroup',{objectGroup:group}).catch(()=>{});await session.detach().catch(()=>{});}};
}
