// Real ConPTY + Rust WebSocket integration. Commands only inspect/create this
// run's own fixture data. No whoami, user profile, provider, or editor is read.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { StringDecoder } from "node:string_decoder";
import { createRequire } from "node:module";
import os from "node:os";

const exec=promisify(execFile),root=fileURLToPath(new URL("../../",import.meta.url));
const index=process.argv.indexOf("--binary");
const binary=path.resolve(index>=0?process.argv[index+1]:path.join(root,"src/shell/target/debug/GameCowork.exe"));
const runDir=path.join("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests",`terminal-e2e-${randomUUID()}`);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const alive=pid=>{try{process.kill(pid,0);return true;}catch(error){if(error.code==="ESRCH")return false;throw error;}};
const normalize=value=>String(value).replace(/\\/g,"/").replace(/^\/\/\?\//,"").replace(/\/+$/,"").toLowerCase();
async function until(predicate,label,timeout=10000){const deadline=Date.now()+timeout;while(Date.now()<deadline){if(await predicate())return;await delay(20);}assert.fail(`Timed out: ${label}`);}

function playwrightPath(){const explicit=process.env.GAMECOWORK_E2E_PLAYWRIGHT;if(explicit)return explicit;const require=createRequire(import.meta.url);try{return require.resolve("playwright");}catch{}
  const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),"npm-cache/_npx");const candidates=fs.readdirSync(cache).map(name=>path.join(cache,name,"node_modules/playwright/index.mjs")).filter(file=>fs.existsSync(file));assert.ok(candidates.length,"Cached Playwright is required for the real TerminalPanel check");return candidates[0];}
function chromiumPath(){if(process.env.GAMECOWORK_E2E_CHROME)return process.env.GAMECOWORK_E2E_CHROME;const cache=path.join(process.env.LOCALAPPDATA||os.tmpdir(),"ms-playwright");const versions=fs.readdirSync(cache).filter(name=>/^chromium-\d+$/.test(name)).sort((a,b)=>Number(b.split("-")[1])-Number(a.split("-")[1]));for(const version of versions){const binary=path.join(cache,version,"chrome-win64/chrome.exe");if(fs.existsSync(binary))return binary;}return undefined;}
async function terminalDOM(gui){return gui.locator("body").evaluate(body=>{
  const describe=node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return{tag:node.tagName,className:node.className,testId:node.getAttribute("data-testid"),role:node.getAttribute("role"),inlineStyle:node.getAttribute("style"),rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},style:{display:style.display,position:style.position,height:style.height,minHeight:style.minHeight,overflow:style.overflow},readOnly:node instanceof HTMLTextAreaElement?node.readOnly:undefined};};
  return [...body.querySelectorAll('[data-testid="terminal-panel"], [data-testid="terminal-viewport"], [data-testid="terminal-connection-status"], .xterm, .xterm-helper-textarea')].map(node=>({node:describe(node),ancestors:[node.parentElement,node.parentElement?.parentElement,node.parentElement?.parentElement?.parentElement].filter(Boolean).map(describe)}));
});}
async function browserTerminal(base,project){const {chromium}=await import(pathToFileURL(playwrightPath()).href);const context=await chromium.launchPersistentContext(path.join(runDir,"terminal-chromium-profile"),{headless:true,executablePath:chromiumPath(),viewport:{width:1440,height:960},locale:"zh-CN",colorScheme:"dark",serviceWorkers:"block",args:["--disable-background-networking","--disable-component-update","--no-first-run"]});let pid;
  let currentPage,currentGui;const frames=[],apiErrors=[];let terminalOutput="";
  try{const errors=[];await context.route("**/*",route=>{const url=new URL(route.request().url());return url.hostname==="127.0.0.1"||["data:","blob:"].includes(url.protocol)?route.continue():route.abort("blockedbyclient");});
    await context.addInitScript(()=>{window.vscMediaUrl="";window.workspacePaths=[];window.GAMECOWORK_SHELL=true;localStorage.setItem("gamecowork-language","zh");});
    const page=context.pages()[0]||await context.newPage();currentPage=page;page.on("pageerror",error=>errors.push(String(error)));page.on("response",async response=>{if(!response.url().includes("/api/tauri/")||!(response.headers()["content-type"]||"").includes("application/json"))return;try{const body=await response.json();const error=body?.error||body?.data?.error;if(response.status()>=400||error){let request;try{request=response.request().postDataJSON();}catch{}apiErrors.push({route:new URL(response.url()).pathname,status:response.status(),messageType:body?.messageType,error,request});}}catch{}});page.on("websocket",socket=>{if(!socket.url().includes("/api/tauri/terminal"))return;socket.on("framereceived",event=>{const payload=typeof event.payload==="string"?event.payload:event.payload.toString("utf8");frames.push({direction:"out",url:socket.url(),payload});terminalOutput+=payload;});socket.on("framesent",event=>frames.push({direction:"in",url:socket.url(),payload:typeof event.payload==="string"?event.payload:event.payload.toString("utf8")}));});await page.goto(base,{waitUntil:"domcontentloaded"});await until(()=>page.frames().some(frame=>frame.url().includes("/gui.html")),"real GUI frame",30000);const gui=page.frames().find(frame=>frame.url().includes("/gui.html"));currentGui=gui;
    for(let step=0;step<4;step++){const next=gui.getByRole("button",{name:/^(下一步|Next|知道了|Got it)$/});await next.first().waitFor({state:"visible",timeout:1000}).catch(()=>{});if(!await next.count()||!await next.first().isVisible())break;await next.first().click();}
    const projectButton=gui.getByRole("button",{name:path.basename(project),exact:true});await projectButton.first().waitFor({state:"visible",timeout:15000});await projectButton.first().click();
    fs.writeFileSync(path.join(runDir,"terminal-ui-before.aria.txt"),await gui.locator("body").ariaSnapshot());
    const toggle=gui.locator('[data-telemetry-id="toggle_bottom_terminal"]');await toggle.waitFor({state:"visible",timeout:15000});await toggle.click();
    const viewport=gui.getByTestId("terminal-viewport");await viewport.waitFor({state:"visible",timeout:15000});const bounds=await viewport.boundingBox();assert.ok(bounds&&bounds.width>100&&bounds.height>80,"Terminal viewport must fill the visible panel, not collapse to one row");await until(()=>terminalOutput.includes("PS "),"real PowerShell prompt before keyboard input",15000);const input=viewport.locator(".xterm-helper-textarea");await until(()=>input.evaluate(node=>!node.readOnly),"TerminalPanel enables stdin only after its real socket opens",15000);fs.writeFileSync(path.join(runDir,"terminal-ui-dom.json"),JSON.stringify(await terminalDOM(gui),null,2));await input.focus();
    await page.keyboard.type("[IO.File]::WriteAllText('ui-pty-pid.txt',$PID);[IO.File]::WriteAllText('ui-terminal-created.txt',('UI_'+'EXECUTED'));echo ('SCREEN_'+'READY')",{delay:1});await page.keyboard.press("Enter");
    await until(()=>fs.existsSync(path.join(project,"ui-terminal-created.txt"))&&fs.existsSync(path.join(project,"ui-pty-pid.txt")),"real UI keyboard completes pid and content file writes",15000);assert.equal(fs.readFileSync(path.join(project,"ui-terminal-created.txt"),"utf8"),"UI_EXECUTED");pid=Number(fs.readFileSync(path.join(project,"ui-pty-pid.txt"),"utf8"));assert.ok(alive(pid));
    fs.writeFileSync(path.join(runDir,"terminal-ui-after.aria.txt"),await gui.locator("body").ariaSnapshot());await page.screenshot({path:path.join(runDir,"terminal-ui.png"),fullPage:true,animations:"disabled"});assert.deepEqual(errors,[],"Real TerminalPanel has no fatal browser errors");
  }catch(error){if(currentPage)await currentPage.screenshot({path:path.join(runDir,"terminal-ui-failure.png"),fullPage:true,animations:"disabled"}).catch(()=>{});if(currentGui){fs.writeFileSync(path.join(runDir,"terminal-ui-failure.aria.txt"),await currentGui.locator("body").ariaSnapshot().catch(()=>""));fs.writeFileSync(path.join(runDir,"terminal-ui-failure-dom.json"),JSON.stringify(await terminalDOM(currentGui).catch(()=>[]),null,2));}throw error;
  }finally{fs.writeFileSync(path.join(runDir,"terminal-ui-ws.json"),JSON.stringify(frames,null,2));fs.writeFileSync(path.join(runDir,"terminal-ui-api-errors.json"),JSON.stringify(apiErrors,null,2));await context.close();if(pid)await until(()=>!alive(pid),"Closing the real browser releases its PTY");}
}

// HTTP upgrade + RFC6455 framing uses built-in Node modules so tests can send a
// real browser Origin header without installing a WebSocket client dependency.
function connect(url,origin){
  const target=new URL(url),key=randomBytes(16).toString("base64");
  const socket=net.createConnection({host:target.hostname,port:Number(target.port)});
  let pending=Buffer.alloc(0),upgraded=false,settled=false,controlTail="";const decoder=new StringDecoder("utf8");
  let resolveReady,rejectReady;
  const ready=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
  const client={socket,ready,output:"",events:[],closed:false,closeCode:null,status:null,
    sendBinary(data){send(2,Buffer.from(data));},sendText(value){send(1,Buffer.from(typeof value==="string"?value:JSON.stringify(value)));},
    close(){if(!client.closed)send(8,Buffer.from([3,232]));},destroy(){socket.destroy();}};
  function send(opcode,data){const mask=randomBytes(4);let header;
    if(data.length<126){header=Buffer.from([0x80|opcode,0x80|data.length]);}
    else if(data.length<=65535){header=Buffer.alloc(4);header[0]=0x80|opcode;header[1]=0x80|126;header.writeUInt16BE(data.length,2);}
    else{header=Buffer.alloc(10);header[0]=0x80|opcode;header[1]=0x80|127;header.writeBigUInt64BE(BigInt(data.length),2);}
    const masked=Buffer.from(data);for(let i=0;i<masked.length;i++)masked[i]^=mask[i%4];socket.write(Buffer.concat([header,mask,masked]));
  }
  socket.once("connect",()=>socket.write(`GET ${target.pathname}${target.search} HTTP/1.1\r\nHost: ${target.host}\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\nOrigin: ${origin}\r\n\r\n`));
  socket.on("data",chunk=>{
    pending=Buffer.concat([pending,chunk]);
    if(!upgraded){const boundary=pending.indexOf("\r\n\r\n");if(boundary<0)return;const headers=pending.subarray(0,boundary).toString();client.status=Number(headers.match(/^HTTP\/1\.1 (\d+)/)?.[1]);
      if(client.status!==101){settled=true;resolveReady(client);socket.destroy();return;}
      const expected=createHash("sha1").update(key+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");assert.equal(headers.match(/^sec-websocket-accept:\s*(\S+)/im)?.[1],expected);
      upgraded=true;settled=true;resolveReady(client);pending=pending.subarray(boundary+4);
    }
    while(pending.length>=2){const opcode=pending[0]&15;let length=pending[1]&127,offset=2;if(length===126){if(pending.length<4)return;length=pending.readUInt16BE(2);offset=4;}else if(length===127){if(pending.length<10)return;length=Number(pending.readBigUInt64BE(2));offset=10;}
      assert.ok(length<2*1024*1024,"Terminal frame stays bounded");if(pending.length<offset+length)return;const data=pending.subarray(offset,offset+length);pending=pending.subarray(offset+length);
      if(opcode===2){const text=decoder.write(data);client.output+=text;const controls=controlTail+text;if(controls.includes("\x1b[6n"))client.sendBinary("\x1b[1;1R");controlTail=controls.slice(-3);}
      else if(opcode===1){try{client.events.push(JSON.parse(data.toString()));}catch{client.output+=data.toString();}}
      else if(opcode===8){client.closeCode=data.length>=2?data.readUInt16BE(0):null;client.closed=true;socket.end();}
      else if(opcode===9){send(10,data);}
    }
  });
  socket.on("error",error=>{if(!settled)rejectReady(error);});socket.on("close",()=>{client.closed=true;if(!settled)rejectReady(new Error("WebSocket closed before upgrade"));});
  return client;
}

test("real Windows terminal WebSocket executes, resizes, exits, and isolates lifecycle",{skip:process.platform!=="win32"},async t=>{
  assert.ok(fs.existsSync(binary));fs.mkdirSync(runDir,{recursive:true});const data=path.join(runDir,"app-data"),coreDir=path.join(runDir,"fake-core");fs.mkdirSync(coreDir,{recursive:true});
  const wrapper=path.join(runDir,`core-entry-${randomUUID()}.mjs`);fs.writeFileSync(wrapper,`import ${JSON.stringify(pathToFileURL(path.join(root,"tests/fixtures/core-fixture.mjs")).href)};\n`);
  const logFile=path.join(runDir,"core.jsonl");const shell=spawn(binary,[],{cwd:root,windowsHide:true,stdio:["ignore","pipe","pipe"],env:{...process.env,GAMECOWORK_HEADLESS:"1",GAMECOWORK_TEST_MODE:"1",GAMECOWORK_APP_ROOT:path.join(root,"app"),GAMECOWORK_DATA_DIR:data,GAMECOWORK_CORE_DIR:coreDir,GAMECOWORK_CORE_ENTRY:wrapper,GAMECOWORK_FRONTEND_DIR:path.join(root,"src/frontend/bundle"),GAMECOWORK_FIXTURE_DATA_DIR:runDir,GAMECOWORK_FIXTURE_LOG:logFile,GAMECOWORK_FIXTURE_RUN_ID:"terminal-e2e"}});
  let output="",base;for(const stream of [shell.stdout,shell.stderr])stream.on("data",bytes=>{output+=bytes.toString();fs.appendFileSync(path.join(runDir,"shell.log"),bytes);const found=output.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);if(found)base=found[1];});
  const clients=[],ownedPids=[];let editorPid,editorPath;
  async function post(route,body){const response=await fetch(new URL(route,base),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(5000)});return{status:response.status,body:await response.json()};}
  async function terminal(cwd,origin=new URL(base).origin,extra={}){const url=new URL("/api/tauri/terminal",base);url.protocol="ws:";url.searchParams.set("workspaceDir",cwd);url.searchParams.set("cols","80");url.searchParams.set("rows","24");for(const [key,value]of Object.entries(extra))url.searchParams.set(key,String(value));const client=connect(url,origin);clients.push(client);await client.ready;return client;}
  async function run(client,command,marker){client.sendBinary(command+"\r");await until(()=>client.output.includes(marker),`actual PTY marker ${marker}`,15000);}
  try{
    await until(()=>base,"headless Rust host",15000);const origin=new URL(base).origin;
    const a=path.join(runDir,"projects","A Unity 中文"),b=path.join(runDir,"projects","B Tuanjie");
    const wa=(await post("/api/tauri/hub/open-workspace",{path:a})).body;const wb=(await post("/api/tauri/hub/open-workspace",{path:b})).body;assert.ok(wa.ok&&wb.ok);
    await t.test("foreign Origin, unopened directory, remote request and invalid dimensions are rejected",async()=>{
      assert.equal((await terminal(a,"http://foreign.invalid")).status,403);
      const outside=path.join(runDir,"unopened");fs.mkdirSync(outside);assert.notEqual((await terminal(outside)).status,101);
      assert.notEqual((await terminal(a,origin,{workspaceRef:JSON.stringify({runOn:"remote",machineId:"fixture",workspaceDir:a})})).status,101);
      assert.equal((await terminal(a,origin,{cols:"0"})).status,400);
    });
    const first=await terminal(a);assert.equal(first.status,101);
    await t.test("binary stdin creates actual fixture data and cwd stays at the granted root",async()=>{
      await run(first,"[IO.File]::WriteAllText('pty-pid.txt',$PID);[IO.File]::WriteAllText('pty-cwd.txt',(Get-Location).Path);[IO.File]::WriteAllText('pty-created.txt',('REAL_'+'EXECUTION'));echo ('PTY_'+'READY')","PTY_READY");
      assert.equal(fs.readFileSync(path.join(a,"pty-created.txt"),"utf8"),"REAL_EXECUTION");assert.equal(normalize(fs.readFileSync(path.join(a,"pty-cwd.txt"),"utf8")),normalize(a));
      ownedPids.push({pid:Number(fs.readFileSync(path.join(a,"pty-pid.txt"),"utf8")),cwd:a});
    });
    await t.test("JSON resize changes the actual console and exit reports the real code",async()=>{
      first.sendText({type:"resize",cols:111,rows:37});await run(first,"[IO.File]::WriteAllText('pty-size.txt',([Console]::WindowWidth.ToString()+'x'+[Console]::WindowHeight.ToString()));echo ('SIZE_'+'READY')","SIZE_READY");assert.equal(fs.readFileSync(path.join(a,"pty-size.txt"),"utf8"),"111x37");
      first.sendText({type:"resize",cols:0,rows:20});await until(()=>first.events.some(event=>event.type==="error"),"actual resize validation");
      first.sendBinary("exit 9\r");await until(()=>first.events.some(event=>event.type==="exit"),"actual process exit");assert.equal(first.events.find(event=>event.type==="exit").exitCode,9);await until(()=>first.closed,"normal terminal socket close");assert.equal(first.closeCode,1000);await until(()=>!alive(ownedPids[0].pid),"exited PTY pid gone");
    });
    await t.test("workspace closing terminates its PTY while a different workspace terminal remains live",async()=>{
      const ta=await terminal(a),tb=await terminal(b);await run(ta,"[IO.File]::WriteAllText('pty-close-pid.txt',$PID);echo ('A_'+'ALIVE')","A_ALIVE");await run(tb,"[IO.File]::WriteAllText('pty-live-pid.txt',$PID);echo ('B_'+'ALIVE')","B_ALIVE");
      const pa=Number(fs.readFileSync(path.join(a,"pty-close-pid.txt"),"utf8")),pb=Number(fs.readFileSync(path.join(b,"pty-live-pid.txt"),"utf8"));ownedPids.push({pid:pa,cwd:a},{pid:pb,cwd:b});assert.ok(alive(pa)&&alive(pb));
      assert.equal((await post("/api/tauri/hub/close-workspace",{workspaceKey:wa.workspaceKey})).body.ok,true);await until(()=>!alive(pa),"closed workspace's PTY killed");assert.ok(alive(pb));tb.close();await until(()=>!alive(pb),"tab close terminates only its shell");
    });
    await t.test("real shipped TerminalPanel accepts keyboard input and renders a terminal",{skip:process.argv.includes("--skip-browser")||process.argv.includes("--no-browser")},()=>browserTerminal(base,b));
    await t.test("root-only termination reclaims terminal descendants and preserves an independent editor",async()=>{
      const editorDir=path.join(runDir,"fake-editors");fs.mkdirSync(editorDir,{recursive:true});editorPath=path.join(editorDir,"Unity.exe");
      await exec("rustc.exe",["--edition","2021",path.join(root,"tests/fixtures/editor-launch-fixture.rs"),"-o",editorPath],{windowsHide:true});
      const launched=(await post("/api/tauri/invoke",{messageType:"fixture/nativeLaunch",messageId:`terminal-editor-${randomUUID()}`,workspaceKey:wb.workspaceKey,data:{editorPath,projectPath:b}})).body;
      assert.equal(launched.data.status,"success");assert.equal(launched.data.content.success,true);editorPid=launched.data.content.pid;await until(()=>fs.existsSync(path.join(b,"fixture-editor-ready.pid")),"independent editor ready");
      const terminalB=await terminal(b);await run(terminalB,"[IO.File]::WriteAllText('pty-root-pid.txt',$PID);echo ('ROOT_'+'READY')","ROOT_READY");const pid=Number(fs.readFileSync(path.join(b,"pty-root-pid.txt"),"utf8"));ownedPids.push({pid,cwd:b});assert.ok(alive(pid));
      const childEntry=path.join(b,`pty-child-${randomUUID()}.mjs`),childReady=path.join(b,"pty-child-ready.json");
      fs.writeFileSync(childEntry,`import fs from 'node:fs';fs.writeFileSync(${JSON.stringify(childReady)},JSON.stringify({pid:process.pid,parentPid:process.ppid,entry:process.argv[1]}));console.log('CHILD_READY');setInterval(()=>{},1000);\n`);
      const psQuote=value=>"'"+value.replace(/'/g,"''")+"'";await run(terminalB,`& ${psQuote(process.execPath)} ${psQuote(childEntry)}`,"CHILD_READY");const child=JSON.parse(fs.readFileSync(childReady,"utf8"));assert.equal(child.parentPid,pid);ownedPids.push({pid:child.pid,cwd:b,entry:childEntry});assert.ok(alive(child.pid)&&alive(editorPid));
      await exec("taskkill.exe",["/PID",String(shell.pid),"/F"],{windowsHide:true});await until(()=>!alive(pid)&&!alive(child.pid),"PTY Job closes its shell and later descendant when only root PID is terminated");assert.ok(alive(editorPid),"Independent editor must survive PTY/core job closing");
    });
    fs.writeFileSync(path.join(runDir,"result.json"),JSON.stringify({passed:true,ownedTerminalPids:ownedPids.map(item=>item.pid),independentEditorSurvived:true,editorPid},null,2));
  }finally{
    for(const client of clients)client.destroy();if(shell.exitCode===null&&shell.signalCode===null)await exec("taskkill.exe",["/PID",String(shell.pid),"/F"],{windowsHide:true}).catch(()=>{});
    for(const item of ownedPids){if(!alive(item.pid))continue;const {stdout}=await exec("powershell.exe",["-NoProfile","-NonInteractive","-Command",`Get-CimInstance Win32_Process -Filter 'ProcessId = ${item.pid}' -ErrorAction SilentlyContinue | Select-Object ParentProcessId,CommandLine | ConvertTo-Json -Compress`],{windowsHide:true});const info=stdout.trim()?JSON.parse(stdout):null;if((info?.ParentProcessId===shell.pid&&info.CommandLine?.includes("-NoLogo -NoProfile -NoExit"))||(item.entry&&info?.CommandLine?.includes(item.entry)))await exec("taskkill.exe",["/PID",String(item.pid),"/F"],{windowsHide:true}).catch(()=>{});}
    if(editorPid&&alive(editorPid)){const {stdout}=await exec("powershell.exe",["-NoProfile","-NonInteractive","-Command",`(Get-CimInstance Win32_Process -Filter 'ProcessId = ${editorPid}').CommandLine`],{windowsHide:true});if(stdout.toLowerCase().includes(editorPath.toLowerCase()))await exec("taskkill.exe",["/PID",String(editorPid),"/F"],{windowsHide:true});}
    console.log(`Artifacts: ${runDir}`);
  }
});
