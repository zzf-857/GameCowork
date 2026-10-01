import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const exec = promisify(execFile);
const root = fileURLToPath(new URL("../../", import.meta.url));
const binaryIndex = process.argv.indexOf("--binary");
const binary = path.resolve(binaryIndex >= 0 ? process.argv[binaryIndex + 1] : path.join(root, "src/shell/target/debug/GameCowork.exe"));
assert.ok(fs.existsSync(binary), `Build the Rust shell first: ${binary}`);
const tempBase = path.resolve("F:/AI/AgentMake/temp/GameCowork/tests");
const runRoot = path.join(tempBase, `shell-http-${randomUUID()}`);
fs.mkdirSync(runRoot, { recursive: true });
const fixture = path.join(root, "tests/fixtures/core-fixture.mjs");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value) => value.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
const owned = new Set();

async function start(name, { mode = "normal", dataDir = path.join(runRoot, name) } = {}) {
  fs.mkdirSync(dataDir, { recursive: true });
  const coreDir = path.join(dataDir, "fixture-core");
  fs.mkdirSync(coreDir, { recursive: true });
  const wrapper = path.join(dataDir, `core-entry-${randomUUID()}.mjs`);
  fs.writeFileSync(wrapper, `import ${JSON.stringify(pathToFileURL(fixture).href)};\n`);
  const logFile = path.join(dataDir, `fixture-${randomUUID()}.jsonl`);
  const log = path.join(dataDir, "shell.log");
  const child = spawn(binary, [], {
    cwd: root,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1",
      GAMECOWORK_APP_ROOT: path.join(root, "app"), GAMECOWORK_DATA_DIR: dataDir,
      GAMECOWORK_CORE_DIR: coreDir, GAMECOWORK_CORE_ENTRY: wrapper,
      GAMECOWORK_FRONTEND_DIR: path.join(root, "src/frontend/bundle"),
      GAMECOWORK_FIXTURE_DATA_DIR: dataDir, GAMECOWORK_FIXTURE_LOG: logFile,
      GAMECOWORK_FIXTURE_RUN_ID: name, GAMECOWORK_FIXTURE_HUB_MODE: mode,
      GAMECOWORK_FIXTURE_FAIL_INIT_MATCH: "FailCore" },
  });
  const server = { child, dataDir, wrapper, logFile, log, output: "", url: null };
  owned.add(server);
  let resolveStart, rejectStart;
  const ready = new Promise((resolve, reject) => { resolveStart = resolve; rejectStart = reject; });
  const timeout = setTimeout(() => rejectStart(new Error(`Shell startup timed out: ${server.output}`)), 15_000);
  for (const stream of [child.stdout, child.stderr]) stream.on("data", (chunk) => {
    const text = chunk.toString();
    server.output += text;
    fs.appendFileSync(log, text);
    const match = server.output.match(/\[shell\] HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/);
    if (match) { server.url = match[1]; resolveStart(server); }
  });
  child.once("error", rejectStart);
  child.once("exit", (code, signal) => { if (!server.url) rejectStart(new Error(`Shell exited before ready (${code}/${signal}): ${server.output}`)); });
  try { return await ready; } finally { clearTimeout(timeout); }
}

function frames(server) {
  return fs.existsSync(server.logFile) ? fs.readFileSync(server.logFile, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse) : [];
}

async function stop(server) {
  if (!owned.has(server)) return;
  if (server.child.exitCode === null && server.child.signalCode === null) {
    if (process.platform === "win32") {
      await exec("taskkill.exe", ["/PID", String(server.child.pid), "/T", "/F"], { windowsHide: true }).catch(() => {});
    } else { server.child.kill("SIGTERM"); }
    await Promise.race([new Promise((resolve) => server.child.once("exit", resolve)), delay(1000)]);
  }
  // If the shell crashed before tree cleanup, verify the unique fixture entry in
  // that precise child's command line before terminating it. Never kill by name.
  for (const record of frames(server).filter((entry) => entry.event === "started" && entry.parentPid === server.child.pid)) {
    if (process.platform !== "win32") continue;
    const pid = Number(record.pid);
    const { stdout } = await exec("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `(Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}' -ErrorAction SilentlyContinue).CommandLine`], { windowsHide: true }).catch(() => ({ stdout: "" }));
    if (stdout.toLowerCase().includes(server.wrapper.toLowerCase())) {
      await exec("taskkill.exe", ["/PID", String(pid), "/T", "/F"], { windowsHide: true }).catch(() => {});
    }
  }
  owned.delete(server);
}

async function http(server, route, body) {
  const response = await fetch(new URL(route, server.url), { method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000) });
  return { status: response.status, body: await response.json() };
}
async function invoke(server, kind, data = null, options = {}) {
  const id = options.id || `http-client-${randomUUID()}`;
  const message = { messageType: kind, messageId: id, data };
  const envelope = options.nested ? { message, ...(options.key ? { workspaceKey: options.key } : {}) }
    : { ...message, ...(options.key ? { workspaceKey: options.key } : {}) };
  const response = await http(server, "/api/tauri/invoke", envelope);
  assert.equal(response.status, 200, `${kind} has an application-level response`);
  if (response.body !== null) assert.equal(response.body.messageId, id, `${kind} keeps the original client ID`);
  return { id, frame: response.body };
}

async function listen(server, route = "/api/tauri/events") {
  const abort = new AbortController();
  const response = await fetch(new URL(route, server.url), { signal: abort.signal });
  assert.equal(response.status, 200);
  const messages = [];
  const decoder = new TextDecoder();
  const pump = (async () => {
    let pending = "";
    try {
      for await (const chunk of response.body) {
        pending += decoder.decode(chunk, { stream: true });
        let index;
        while ((index = pending.indexOf("\n\n")) >= 0) {
          const block = pending.slice(0, index);
          pending = pending.slice(index + 2);
          const data = block.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
          if (data) {
            const envelope = JSON.parse(data);
            if (typeof envelope.hubWorkspaceKey === "string" && envelope.inner !== undefined) {
              const inner = typeof envelope.inner === "string" ? JSON.parse(envelope.inner) : envelope.inner;
              messages.push({ ...inner, _hubWorkspaceKey: envelope.hubWorkspaceKey, _hubWorkspaceRef: envelope.workspaceRef });
            } else { messages.push(envelope); }
          }
        }
      }
    } catch (error) { if (!abort.signal.aborted) throw error; }
  })();
  return { messages, close: async () => { abort.abort(); await pump; } };
}

async function until(predicate, message) {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) { if (predicate()) return; await delay(10); }
  assert.fail(message);
}

test("real Rust shell HTTP contract with isolated fake core", async (t) => {
  t.after(async () => { for (const server of [...owned]) await stop(server); console.log(`Artifacts: ${runRoot}`); });
  let server = await start("normal");
  const dataDir = server.dataDir;
  const a = path.join(dataDir, "projects", "A Unity 中文");
  const b = path.join(dataDir, "projects", "B Tuanjie");
  const ordinary = path.join(dataDir, "projects", "Ordinary");
  fs.mkdirSync(ordinary, { recursive: true });
  let wa, wb;
  const featureId = `fixture-feature-${randomUUID()}`;

  await t.test("installed Editor selection reaches actual Core routing with exact engine and executable",async()=>{
    const local=await start("editor-selection");
    try {
    const project=path.join(local.dataDir,"projects","B Tuanjie");
    const selected={product:"tuanjie",editorPath:"F:/own-fixture/Tuanjie-B/Tuanjie.exe",version:"2022.3.1f1",architecture:"x86_64"};
    const reply=await invoke(local,"tjhub/openProject",{path:project,...selected});
    assert.equal(reply.frame.data.status,"success");
    const sent=frames(local).filter(entry=>entry.event==="received").map(entry=>entry.frame).filter(frame=>frame.messageType==="unity/openEditor").at(-1);assert.ok(sent);
    assert.deepEqual(sent.data,selected);
    const registry=await http(local,"/api/tauri/hub/workspaces");
    assert.equal(registry.body.workspaces.length,1);
    assert.equal(normalize(registry.body.workspaces[0].workspaceDir),normalize(project));
    // This fixture verifies the real Rust routing boundary; it launches no Editor.
    } finally { await stop(local); }
  });

  await t.test("real file browsing, media, search and scoped native reads",async()=>{
    const local=await start("files");
    try {
      const project=path.join(local.dataDir,"projects","A Unity 中文");
      const outside=path.join(local.dataDir,"not-opened","private.txt");
      fs.mkdirSync(path.dirname(outside),{recursive:true});
      fs.writeFileSync(outside,"PRIVATE-OUTSIDE");
      fs.writeFileSync(path.join(project,"hello 中文.txt"),"hello 😀\r\nneedle second\r\n");
      const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6KfQAAAAASUVORK5CYII=","base64");
      fs.writeFileSync(path.join(project,"pixel.png"),png);
      fs.mkdirSync(path.join(project,'Packages'),{recursive:true});
      fs.writeFileSync(path.join(project,'Packages','manifest.json'),'{"dependencies":{"fixture-existing":"1.0.0"}}\n');
      const opened=(await http(local,"/api/tauri/hub/open-workspace",{path:project})).body;
      const beforeManifest=fs.readFileSync(path.join(project,'Packages','manifest.json'),'utf8');
      const install=await invoke(local,'unity/installMcpPackage',{}, {key:opened.workspaceKey});
      assert.equal(install.frame.data.status,'success');assert.equal(install.frame.data.content.content.connected,false);
      const changedManifest=JSON.parse(fs.readFileSync(path.join(project,'Packages','manifest.json'),'utf8'));
      assert.match(changedManifest.dependencies['cn.gamecowork.bridge'],/^file:.*editor-bridge$/);
      const installedAgain=await invoke(local,'unity/installMcpPackage',{}, {key:opened.workspaceKey});
      assert.equal(installedAgain.frame.data.content.content.alreadyInstalled,true);
      const installUndo=await http(local,'/api/tauri/file-changes/undo',{changeId:install.frame.data.content.content.changeId,workspaceKey:opened.workspaceKey});
      assert.equal(installUndo.status,200);assert.equal(fs.readFileSync(path.join(project,'Packages','manifest.json'),'utf8'),beforeManifest);
      fs.mkdirSync(path.join(project,'.git'));
      const repositories=await invoke(local,'findGitRepositories',{dir:project},{key:opened.workspaceKey});
      assert.equal(repositories.frame.data.status,'success');
      assert.equal(repositories.frame.data.content.length,1);
      assert.equal(normalize(repositories.frame.data.content[0].repoDir),normalize(project));
      const gitRoot=await invoke(local,'getGitRootPath',{dir:'hello 中文.txt'},{key:opened.workspaceKey});
      assert.equal(normalize(gitRoot.frame.data.content),normalize(project));
      const listing=await http(local,"/api/tauri/file-explorer",{path:'.',mode:'list',workspaceKey:opened.workspaceKey});
      assert.equal(listing.status,200);
      assert.ok(listing.body.directory.entries.some(e=>e.name==='hello 中文.txt'&&e.kind==='file'));
      const previewURL=new URL('/api/tauri/file-explorer',local.url);
      previewURL.searchParams.set('mode','file');previewURL.searchParams.set('path','hello 中文.txt');
      const preview=await fetch(previewURL,{headers:{'X-Workspace-Dir':encodeURIComponent(project)}}).then(r=>r.json());
      assert.equal(preview.file.content,'hello 😀\r\nneedle second\r\n');
      assert.equal(preview.file.readOnly,false);
      const eventsURL=new URL('/api/tauri/file-explorer/events',local.url);
      eventsURL.searchParams.set('workspaceRef',JSON.stringify({runOn:'local',workspaceDir:project}));
      const watch=await listen(local,eventsURL);
      try {
        const originalPath=path.join(project,'watch 原文件.txt');
        const renamedPath=path.join(project,'watch 新文件.txt');
        fs.writeFileSync(originalPath,'native SSE watcher');
        await until(()=>watch.messages.some(m=>m.changes?.some(c=>c.kind==='added'&&c.path==='watch 原文件.txt')),'Native file create reached SSE');
        fs.renameSync(originalPath,renamedPath);
        await until(()=>watch.messages.some(m=>m.changes?.some(c=>c.kind==='renamed'&&c.oldPath==='watch 原文件.txt'&&c.path==='watch 新文件.txt')),'Native file rename reached SSE');
        fs.unlinkSync(renamedPath);
        await until(()=>watch.messages.some(m=>m.changes?.some(c=>c.kind==='deleted'&&c.path==='watch 新文件.txt')),'Native file delete reached SSE');
      } finally {await watch.close();}
      const range=await invoke(local,'readRangeInFile',{filepath:'hello 中文.txt',range:{start:{line:0,character:6},end:{line:0,character:8}}},{key:opened.workspaceKey});
      assert.equal(range.frame.data.content,'😀');
      const denied=await invoke(local,'readFile',{filepath:outside},{key:opened.workspaceKey});
      assert.equal(denied.frame.data.status,'error');
      assert.match(denied.frame.data.error,/outside|authorized|allowed/i);
      const escaped=await http(local,'/api/tauri/file-explorer',{path:outside,mode:'file',workspaceKey:opened.workspaceKey});
      assert.equal(escaped.status,403);assert.ok(!JSON.stringify(escaped.body).includes('PRIVATE-OUTSIDE'));
      const claimed=await http(local,'/api/tauri/file-explorer',{path:'.',workspaceDir:path.dirname(outside)});
      assert.equal(claimed.status,403);
      const image=await http(local,'/api/tauri/local-file-content',{path:path.join(project,'pixel.png'),workspaceKey:opened.workspaceKey});
      assert.equal(image.status,200);assert.deepEqual(Buffer.from(image.body.content.split(',')[1],'base64'),png);
      const mediaURL=new URL('/api/tauri/file-explorer/media',local.url);mediaURL.searchParams.set('path',path.join(project,'pixel.png'));
      const media=await fetch(mediaURL);assert.equal(media.status,200);assert.equal(media.headers.get('content-type'),'image/png');
      assert.deepEqual(Buffer.from(await media.arrayBuffer()),png);
      const stream=await fetch(new URL('/api/tauri/file-explorer/search-stream',local.url),{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({path:'.',mode:'search',query:'needle',workspaceKey:opened.workspaceKey,options:{matchCase:true}})});
      assert.equal(stream.status,200);assert.match(stream.headers.get('content-type'),/ndjson/);
      const records=(await stream.text()).trim().split('\n').map(JSON.parse);
      assert.ok(records.some(row=>row.type==='match'&&row.result.lineNumber===2&&row.result.lineText.includes('needle second')));
      const original=fs.readFileSync(path.join(project,'hello 中文.txt'),'utf8');
      const save=await http(local,'/api/tauri/file-explorer',{path:'hello 中文.txt',mode:'save',content:'saved by explicit UI action',workspaceKey:opened.workspaceKey});
      assert.equal(save.status,200);assert.equal(save.body.ok,true);
      assert.equal(fs.readFileSync(path.join(project,'hello 中文.txt'),'utf8'),'saved by explicit UI action');
      assert.equal(fs.readFileSync(save.body.backupPath,'utf8'),original);
      const stale=await http(local,'/api/tauri/file-explorer',{path:'hello 中文.txt',mode:'save',content:'must not replace',expectedSha256:save.body.beforeSha256,workspaceKey:opened.workspaceKey});
      assert.equal(stale.status,409);assert.equal(fs.readFileSync(path.join(project,'hello 中文.txt'),'utf8'),'saved by explicit UI action');
      const undo=await http(local,'/api/tauri/file-changes/undo',{changeId:save.body.changeId,workspaceKey:opened.workspaceKey});
      assert.equal(undo.status,200);assert.equal(fs.readFileSync(path.join(project,'hello 中文.txt'),'utf8'),original);
      fs.writeFileSync(path.join(project,'.env'),'SYNTHETIC-SENSITIVE');
      const protectedFile=await http(local,'/api/tauri/file-explorer',{path:'.env',mode:'save',content:'blocked',workspaceKey:opened.workspaceKey});
      assert.equal(protectedFile.status,403);assert.equal(fs.readFileSync(path.join(project,'.env'),'utf8'),'SYNTHETIC-SENSITIVE');
      await http(local,'/api/tauri/hub/close-workspace',{workspaceKey:opened.workspaceKey});
      const closed=await http(local,'/api/tauri/file-explorer',{path:'.',mode:'list',workspaceKey:opened.workspaceKey});
      assert.ok(closed.status>=400);
      const lateAbort=await invoke(local,'abort',{}, {key:opened.workspaceKey});
      assert.equal(lateAbort.frame.data.status,'success');assert.equal(lateAbort.frame.data.content.alreadyClosed,true);
    }finally {await stop(local);}
  });

  await t.test("original IDs, single core send, actionable errors, honest capabilities", async () => {
    const status = await http(server, "/api/tauri/status");
    assert.equal(status.body.mode, "local");
    const capabilities = (await http(server, "/api/tauri/capabilities")).body;
    assert.equal(capabilities.remoteWorkspaces, false);
    assert.equal(capabilities.editorStreaming, false);
    const recent = await invoke(server, "tjhub/getRecentProjects");
    assert.equal(recent.frame.data.status, "success");
    assert.deepEqual(new Set(recent.frame.data.content.map((project) => project.product)), new Set(["unity", "tuanjie"]));
    const marker = randomUUID();
    const echoed = await invoke(server, "fixture/echo", { marker });
    assert.equal(echoed.frame.data.content.count, 1);
    assert.equal(frames(server).filter((entry) => entry.frame?.messageType === "fixture/echo" && entry.frame.data?.marker === marker).length, 1);
    const unsupported = await invoke(server, "fixture/not-implemented");
    assert.equal(unsupported.frame.data.status, "error");
    assert.match(unsupported.frame.data.error, /not implemented/);
    const create = await invoke(server, "tjhub/createProject", { projectName: "DoNotCreate", projectPath: dataDir });
    assert.equal(create.frame.data.status, "error");
    assert.ok(!fs.existsSync(path.join(dataDir, "DoNotCreate")));
    const remote = await http(server, "/api/tauri/hub/open-workspace", { workspaceRef: { runOn: "remote", machineId: "fixture", workspaceDir: "/remote" } });
    assert.equal(remote.body.ok, false);
    assert.match(remote.body.error, /Remote/);
    const unknown = await http(server, "/api/tauri/undefined-route", {});
    assert.equal(unknown.status, 501);
    assert.equal(unknown.body.ok, false);
    const unseen = await invoke(server, "versionUpdate/getSeenFeatures", { platform: "desktop" });
    assert.deepEqual(unseen.frame.data.content.features, []);
    const marks = await Promise.all([invoke(server, "versionUpdate/markFeatureSeen", { platform: "desktop", featureId }),
      invoke(server, "versionUpdate/markFeatureSeen", { platform: "desktop", featureId })]);
    assert.ok(marks.every((mark) => mark.frame.data.status === "success"));
    assert.deepEqual((await invoke(server, "versionUpdate/getSeenFeatures", { platform: "desktop" })).frame.data.content.features, [featureId]);
    assert.deepEqual((await invoke(server, "versionUpdate/getSeenFeatures", { platform: "unity" })).frame.data.content.features, []);
    assert.equal((await invoke(server, "versionUpdate/markFeatureSeen", { platform: "desktop", featureId: "" })).frame.data.status, "error");
    const keepAwake=await invoke(server,'tauri/getKeepAwake');
    assert.equal(keepAwake.frame.data.content,false);
    assert.equal((await invoke(server,'tauri/setKeepAwake',{enabled:true})).frame.data.status,'error');
    assert.equal((await invoke(server,'read_unity_streaming_layout')).frame.data.content,null);
    assert.equal((await invoke(server,'save_unity_streaming_layout',{contents:'{"invalid":true}'})).frame.data.status,'error');
    const layout={kind:'gamecowork.unity-composite-layout',version:1,tabs:[{viewType:'scene',label:'Scene'}],slots:[{viewType:'scene',rect:{x:0,y:0,w:1,h:1}}],signalingUrl:'must-not-persist'};
    assert.equal((await invoke(server,'save_unity_streaming_layout',{contents:JSON.stringify(layout)})).frame.data.status,'success');
    const savedLayout=JSON.parse((await invoke(server,'read_unity_streaming_layout')).frame.data.content);
    assert.equal(savedLayout.tabs[0].viewType,'scene');assert.ok(!JSON.stringify(savedLayout).includes('must-not-persist'));
  });

  await t.test("register A/B and a plain directory, open, switch and reject invalid paths", async () => {
    assert.deepEqual((await http(server, "/api/tauri/hub/workspaces")).body.workspaces, []);
    for (const projectPath of [a, b, ordinary]) {
      const added = await invoke(server, "tjhub/addProject", { projectPath });
      assert.equal(added.frame.data.status, "success");
    }
    assert.equal((await http(server, "/api/tauri/hub/workspaces")).body.workspaces.length, 0);
    const openedA = await http(server, "/api/tauri/hub/open-workspace", { path: a, editorType: "app" });
    const openedB = await http(server, "/api/tauri/hub/open-workspace", { path: b, editorType: "app" });
    assert.equal(openedA.body.ok, true); assert.equal(openedB.body.ok, true);
    wa = openedA.body; wb = openedB.body;
    const sessionMarker=randomUUID();
    assert.equal((await invoke(server,'ide/setActiveSessionId',{sessionId:sessionMarker},{key:wa.workspaceKey})).frame.data.status,'success');
    assert.equal(JSON.parse(fs.readFileSync(path.join(dataDir,'active-sessions.json'),'utf8'))[wa.workspaceKey],sessionMarker);
    await invoke(server,'ide/setActiveSessionId',{sessionId:null},{key:wa.workspaceKey});
    assert.ok(!(wa.workspaceKey in JSON.parse(fs.readFileSync(path.join(dataDir,'active-sessions.json'),'utf8'))));
    assert.notEqual(wa.workspaceKey, wb.workspaceKey);
    const snapshot = (await http(server, "/api/tauri/hub/workspaces")).body;
    assert.equal(snapshot.workspaces.length, 2);
    assert.equal(snapshot.activeWorkspaceKey, wb.workspaceKey);
    assert.deepEqual(new Set(snapshot.workspaces.map((w) => w.engineType)), new Set(["unity", "tuanjie"]));
    assert.ok(snapshot.workspaces.every((w) => w.isRemote === false));
    const switchA = await http(server, "/api/tauri/hub/switch-workspace", { workspaceKey: wa.workspaceKey });
    assert.equal(switchA.body.ok, true);
    assert.equal((await http(server, "/api/tauri/workspace-dir")).body.dir, wa.workspaceDir);
    const missing = await http(server, "/api/tauri/hub/open-workspace", { path: path.join(dataDir, "does-not-exist") });
    assert.equal(missing.body.ok, false);
    assert.match(missing.body.error, /^path_not_found:/);
    const invalid = await invoke(server, "tjhub/addProject", { projectPath: "" });
    assert.equal(invalid.frame.data.status, "error");
    const favorite = await invoke(server, "tjhub/toggleFavorite", { projectPath: a, isFavorite: true });
    assert.equal(favorite.frame.data.content.isFavorite, true);
  });

  await t.test("A/B request targets and raw core-to-host roots cannot cross", async () => {
    await http(server, "/api/tauri/hub/switch-workspace", { workspaceKey: wb.workspaceKey });
    const [rootA, rootB] = await Promise.all([
      invoke(server, "fixture/root", null, { key: wa.workspaceKey, nested: true }),
      invoke(server, "fixture/root", null, { key: wb.workspaceKey }),
    ]);
    for (const [response, workspace] of [[rootA, wa], [rootB, wb]]) {
      assert.equal(response.frame.data.status, "success");
      assert.equal(response.frame.data.content.workspaceId, workspace.workspaceKey);
      assert.equal(normalize(response.frame.data.content.root), normalize(workspace.workspaceDir));
      assert.equal(response.frame.data.content.rawData, true);
    }
    const rawCallbacks = frames(server).filter((entry) => entry.frame?.messageType === "getProjectRoot");
    assert.equal(rawCallbacks.length, 2);
    assert.ok(rawCallbacks.every((entry) => typeof entry.frame.data === "string"));
  });

  await t.test("GUI-owned get callbacks reach the owning view and unsupported host gets reject",async()=>{
    const sse=await listen(server);
    try {
      for(const [kind,value] of [['getCurrentSessionId','synthetic-view-session'],['getWebviewHistoryLength',1],['getWebviewHistory',[{role:'user',content:'synthetic history'}]]]) {
        const operation=invoke(server,'fixture/gui-callback',{kind},{key:wa.workspaceKey});
        await until(()=>sse.messages.some(message=>message.messageType===kind),'GUI callback reaches SSE instead of generic get fallback');
        const callback=sse.messages.find(message=>message.messageType===kind);
        assert.equal(callback._hubWorkspaceKey,wa.workspaceKey);
        await invoke(server,kind,value,{id:callback.messageId,key:wb.workspaceKey});
        const result=await operation;assert.deepEqual(result.frame.data.content.rawData,value);
        assert.equal(result.frame.data.content.workspace,wa.workspaceKey);
      }
      const unsupported=await invoke(server,'fixture/unsupported-host',{}, {key:wa.workspaceKey});
      assert.equal(unsupported.frame.data.status,'error');assert.match(unsupported.frame.data.error,/not implemented/);
    }finally{await sse.close();}
  });

  await t.test("failed core initialization rolls back the durable registry and active workspace", async () => {
    const fail = path.join(dataDir, "projects", "FailCore");
    fs.mkdirSync(fail, { recursive: true });
    const before = (await http(server, "/api/tauri/hub/workspaces")).body;
    const result = await http(server, "/api/tauri/hub/open-workspace", { path: fail });
    assert.equal(result.body.ok, false);
    assert.match(result.body.error, /initialization failed/);
    assert.deepEqual((await http(server, "/api/tauri/hub/workspaces")).body, before);
    const registry = JSON.parse(fs.readFileSync(path.join(dataDir, "workspaces.json"), "utf8"));
    assert.ok(!registry.records.some((record) => normalize(record.workspace.workspaceDir) === normalize(fail)));
    assert.ok(fs.statSync(fail).isDirectory());
  });

  await t.test("stream delivers both chunks and terminal SSE with the client ID", async () => {
    const sse = await listen(server);
    try {
      const streamed = await invoke(server, "fixture/stream", { marker: randomUUID() }, { key: wa.workspaceKey });
      assert.equal(streamed.frame.data.done, true);
      await until(() => sse.messages.filter((m) => m.messageId === streamed.id).length >= 3, "All stream frames reached SSE");
      const streamFrames = sse.messages.filter((m) => m.messageId === streamed.id);
      assert.deepEqual(streamFrames.map((m) => m.data.done), [false, false, true]);
      assert.deepEqual(streamFrames.slice(0, 2).map((m) => m.data.content), ["chunk-1", "chunk-2"]);
      assert.ok(streamFrames.every((m) => m.workspaceId === wa.workspaceKey));
      assert.ok(streamFrames.every((m) => m._hubWorkspaceKey === wa.workspaceKey && normalize(m._hubWorkspaceRef.workspaceDir) === normalize(wa.workspaceDir)));
      const deferred = await invoke(server, "fixture/stream", { _deferResponseToSse: true }, { key: wb.workspaceKey });
      assert.equal(deferred.frame, null);
      await until(() => sse.messages.filter((m) => m.messageId === deferred.id).length >= 3, "Deferred stream completes over SSE");
      assert.ok(sse.messages.filter((m) => m.messageId === deferred.id).every((m) => m.workspaceId === wb.workspaceKey && m._hubWorkspaceKey === wb.workspaceKey));
    } finally { await sse.close(); }
  });

  await t.test("core-origin permission callback keeps its ID and raw data for the originating workspace", async () => {
    const sse = await listen(server);
    try {
      const operation = invoke(server, "fixture/permission", {}, { key: wa.workspaceKey });
      await until(() => sse.messages.some((m) => m.messageType === "acp/requestPermission"), "Permission request reached GUI SSE");
      const permission = sse.messages.find((m) => m.messageType === "acp/requestPermission");
      assert.equal(permission._hubWorkspaceKey, wa.workspaceKey);
      const payload = { outcome: { outcome: "selected", optionId: "allow_once" } };
      // An unrelated active workspace must not change the recorded callback target.
      const answered = await invoke(server, "acp/requestPermission", payload, { id: permission.messageId, key: wb.workspaceKey, nested: true });
      assert.equal(answered.frame, null);
      const completed = await operation;
      assert.equal(completed.frame.data.status, "success");
      assert.equal(completed.frame.data.content.rawData, true);
      assert.equal(completed.frame.data.content.workspaceId, wa.workspaceKey);
      assert.equal(completed.frame.data.content.callbackMessageId, permission.messageId);
      const delivered = frames(server).filter((e) => e.frame?.messageId === permission.messageId);
      assert.equal(delivered.length, 1);
      assert.deepEqual(delivered[0].frame.data, payload);
    } finally { await sse.close(); }
  });

  await t.test("close persists across restart; project removal never deletes directories", async () => {
    const sse = await listen(server);
    const staleMarker = randomUUID();
    let closed;
    try {
      await invoke(server, "fixture/lateEvent", { marker: staleMarker }, { key: wb.workspaceKey });
      closed = await http(server, "/api/tauri/hub/close-workspace", { workspaceKey: wb.workspaceKey });
      await delay(200);
      assert.ok(!sse.messages.some((m) => m.data?.marker === staleMarker), "Closed workspace cannot send late state into the active GUI");
    } finally { await sse.close(); }
    assert.equal(closed.body.ok, true);
    const afterClose = (await http(server, "/api/tauri/hub/workspaces")).body;
    assert.deepEqual(afterClose.workspaces.map((w) => w.workspaceKey), [wa.workspaceKey]);
    assert.equal(afterClose.activeWorkspaceKey, wa.workspaceKey);
    const closedRoute = await invoke(server, "fixture/echo", {}, { key: wb.workspaceKey });
    assert.equal(closedRoute.frame.data.status, "error");
    await stop(server);
    server = await start("restart", { dataDir });
    const restored = (await http(server, "/api/tauri/hub/workspaces")).body;
    assert.deepEqual(restored.workspaces.map((w) => w.workspaceKey), [wa.workspaceKey]);
    assert.equal(restored.activeWorkspaceKey, wa.workspaceKey);
    assert.deepEqual((await invoke(server, "versionUpdate/getSeenFeatures", { platform: "desktop" })).frame.data.content.features, [featureId]);
    const restoredRoot = await invoke(server, "fixture/root", null, { key: wa.workspaceKey });
    assert.equal(normalize(restoredRoot.frame.data.content.root), normalize(a));
    const projectsBefore = await invoke(server, "tjhub/getRecentProjects");
    assert.ok(projectsBefore.frame.data.content.find((p) => normalize(p.path) === normalize(a)).isFavorite);
    const removed = await invoke(server, "tjhub/removeProject", { projectPath: ordinary });
    assert.equal(removed.frame.data.status, "success");
    assert.ok(fs.statSync(ordinary).isDirectory());
    assert.ok(fs.statSync(a).isDirectory());
    assert.ok(fs.statSync(b).isDirectory());
    const recent = (await http(server, "/api/tauri/recent-projects")).body;
    assert.equal(recent.length, 2);
    assert.ok(recent.every((entry) => entry.location === "local" && entry.projectType === "app"));
  });

  await t.test("Hub removal stays hidden after restart and explicit re-adding restores the project", async () => {
    assert.equal((await invoke(server, "tjhub/removeProject", { projectPath: b })).frame.data.status, "success");
    const hidden = await invoke(server, "tjhub/getRecentProjects");
    assert.ok(!hidden.frame.data.content.some((project) => normalize(project.path) === normalize(b)));
    assert.equal((await invoke(server, "tjhub/addProject", { projectPath: b })).frame.data.status, "success");
    assert.ok((await invoke(server, "tjhub/getRecentProjects")).frame.data.content.some((project) => normalize(project.path) === normalize(b)));
    await invoke(server, "tjhub/removeProject", { projectPath: b });
    await stop(server);
    server = await start("hidden-restart", { dataDir });
    assert.ok(!(await invoke(server, "tjhub/getRecentProjects")).frame.data.content.some((project) => normalize(project.path) === normalize(b)));
    assert.ok(fs.statSync(b).isDirectory());
    assert.equal((await http(server, "/api/tauri/hub/workspaces")).body.activeWorkspaceKey, wa.workspaceKey);
  });

  for (const mode of ["empty", "error", "invalid"]) await t.test(`Hub ${mode} result settles without fabricated projects`, async () => {
    const isolated = await start(`hub-${mode}`, { mode });
    try {
      const projects = await invoke(isolated, "tjhub/getRecentProjects");
      const editors = await invoke(isolated, "tjhub/getEditors");
      if (mode === "empty") {
        assert.equal(projects.frame.data.status, "success");
        assert.deepEqual(projects.frame.data.content, []);
        assert.deepEqual(editors.frame.data.content, {});
      } else {
        assert.equal(projects.frame.data.status, "error");
        assert.equal(editors.frame.data.status, "error");
        assert.match(projects.frame.data.error, /Hub/);
      }
      assert.equal((await http(isolated, "/api/tauri/hub/workspaces")).body.workspaces.length, 0);
      if (mode === "empty") {
        const home = await http(isolated, "/api/tauri/hub/open-workspace", { homeWorkspace: true, editorType: "app" });
        assert.equal(home.body.ok, true);
        assert.equal((await http(isolated, "/api/tauri/hub/workspaces")).body.workspaces[0].isHomeWorkspace, true);
        await http(isolated, "/api/tauri/hub/close-workspace", { workspaceKey: home.body.workspaceKey });
        assert.equal((await http(isolated, "/api/tauri/hub/workspaces")).body.workspaces.length, 0);
      }
    } finally { await stop(isolated); }
  });
});
