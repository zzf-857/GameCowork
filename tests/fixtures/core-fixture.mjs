// A deterministic core stdio fixture. It never loads the restored core, Hub,
// editor, CLI, account state, provider, or network.
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

const dataDir = path.resolve(process.env.GAMECOWORK_FIXTURE_DATA_DIR || process.env.GAMECOWORK_DATA_DIR || "");
const allowed = path.resolve("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work");
if (!dataDir.toLowerCase().startsWith(allowed.toLowerCase() + path.sep)) {
  throw new Error("Core fixture requires an isolated temp/GameCowork directory");
}
fs.mkdirSync(dataDir, { recursive: true });
// The default advertised Editor paths are inert owned files, so the real
// installation cache can inspect their metadata. Never overwrite a launch
// fixture already compiled at one of these paths or materialize custom inputs.
if (!process.env.GAMECOWORK_FIXTURE_HUB_SNAPSHOT && !process.env.GAMECOWORK_FIXTURE_TEMPLATE_EDITOR) {
  for (const name of ["Unity.exe", "Tuanjie.exe"]) {
    const file = path.join(dataDir, "fake-editors", name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!fs.existsSync(file)) fs.writeFileSync(file, "OWNED EDITOR METADATA FIXTURE - NEVER EXECUTED\n", { flag: "wx" });
  }
}
const logFile = process.env.GAMECOWORK_FIXTURE_LOG || path.join(dataDir, "fixture-frames.jsonl");
const projects = {
  a: process.env.GAMECOWORK_FIXTURE_PROJECT_A || path.join(dataDir, "projects", "A Unity 中文"),
  b: process.env.GAMECOWORK_FIXTURE_PROJECT_B || path.join(dataDir, "projects", "B Tuanjie"),
};
for (const [key, project] of Object.entries(projects)) {
  const resolved = path.resolve(project);
  if (!resolved.toLowerCase().startsWith(allowed.toLowerCase() + path.sep)) throw new Error("Fixture project escapes temp area");
  fs.mkdirSync(path.join(project, "ProjectSettings"), { recursive: true });
  fs.mkdirSync(path.join(project, "Assets"), { recursive: true });
  const version = key === "a" ? "m_EditorVersion: 2022.3.1f1\n" : "m_EditorVersion: 2022.3.2f1\nm_TuanjieEditorVersion: 1.6.1\n";
  if (!process.env.GAMECOWORK_FIXTURE_HUB_SNAPSHOT)
    fs.writeFileSync(path.join(project, "ProjectSettings", "ProjectVersion.txt"), version);
}
const log = (entry) => fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
const output = (message) => process.stdout.write(JSON.stringify(message) + "\r");
const success = (message, content) => output({ ...message, data: { done: true, status: "success", content } });
const failure = (message, error) => output({ ...message, data: { done: true, status: "error", error } });
const workspaces = new Map();
const callbacks = new Map();
const counts = new Map();
log({ event: "started", pid: process.pid, parentPid: process.ppid, entry: process.argv[1], runId: process.env.GAMECOWORK_FIXTURE_RUN_ID });

function hub() {
  // Optional editor-installations input preserves the real host's getEditors
  // projection while keeping every project and fixture file inside temp.
  if (process.env.GAMECOWORK_FIXTURE_HUB_SNAPSHOT) {
    const snapshotFile = fs.realpathSync(process.env.GAMECOWORK_FIXTURE_HUB_SNAPSHOT);
    if (!snapshotFile.toLowerCase().startsWith(allowed.toLowerCase() + path.sep))
      throw new Error("Hub snapshot fixture escapes temp area");
    const snapshot = JSON.parse(fs.readFileSync(snapshotFile, "utf8"));
    if (!Array.isArray(snapshot)) throw new Error("Hub snapshot fixture must be an array");
    for (const product of snapshot) for (const project of product.projects || []) {
      if (!path.resolve(project.path).toLowerCase().startsWith(allowed.toLowerCase() + path.sep))
        throw new Error("Hub snapshot project escapes temp area");
    }
    return snapshot;
  }
  if (process.env.GAMECOWORK_FIXTURE_TEMPLATE_EDITOR) {
    return [{product:process.env.GAMECOWORK_FIXTURE_TEMPLATE_PRODUCT||"unity",projects:[],editors:[{path:process.env.GAMECOWORK_FIXTURE_TEMPLATE_EDITOR,version:process.env.GAMECOWORK_FIXTURE_TEMPLATE_VERSION}]}];
  }
  return [
    { product: "unity", projects: [{ path: projects.a, editor_version: "2022.3.1f1", last_modified_display: "2026-10-01T00:00:00Z" }],
      editors: [{ path: path.join(dataDir, "fake-editors", "Unity.exe"), version: "2022.3.1f1" }] },
    { product: "tuanjie", projects: [{ path: projects.b, editor_version: "2022.3.2f1", tuanjie_editor_version: "1.6.1", last_modified_display: "2026-10-01T00:00:00Z" }],
      editors: [{ path: path.join(dataDir, "fake-editors", "Tuanjie.exe"), version: "2022.3.2f1", tuanjie_editor_version: "1.6.1" }] },
  ];
}

function hostRoot(message, mode = "root") {
  const id = `fixture-host-${randomUUID()}`;
  callbacks.set(id, { message, mode });
  output({ messageType: "getProjectRoot", messageId: id, workspaceId: message.workspaceId, data: null });
}

function receive(message) {
  log({ event: "received", frame: message });
  if (callbacks.has(message.messageId)) {
    const { message: owner, mode } = callbacks.get(message.messageId);
    callbacks.delete(message.messageId);
    if (mode === "gui") {
      if (message.data?.done !== undefined) return failure(owner,"GUI host callback must preserve raw data");
      return success(owner,{rawData:message.data,workspace:message.workspaceId});
    }
    if (mode === "host-error") {
      if (!message.data?.__gamecoworkHostError) return failure(owner,"Missing rejecting host error marker");
      return failure(owner,message.data.__gamecoworkHostError.message);
    }
    if (mode === "native") {
      if (!message.data || Object.hasOwn(message.data, "done") || typeof message.data.success !== "boolean")
        return failure(owner, "Native launch callback must contain a raw success result");
      return success(owner, message.data);
    }
    if (mode === "permission") {
      const raw = message.data && !Object.hasOwn(message.data, "done") && message.data.outcome?.outcome === "selected";
      if (!raw || message.workspaceId !== owner.workspaceId) return failure(owner, "Permission callback lost its raw payload or workspace identity");
      return success(owner, { rawData: true, outcome: message.data.outcome, callbackMessageId: message.messageId, workspaceId: message.workspaceId });
    }
    const raw = typeof message.data === "string";
    if (!raw) return failure(owner, "Host root callback must contain raw string data, not a done/content envelope");
    return success(owner, mode === "editor"
      ? { success: true, message: "Fixture editor launch recorded; no editor was started", root: message.data, workspaceId: owner.workspaceId }
      : { root: message.data, workspaceId: owner.workspaceId, rawData: raw });
  }
  const kind = message.messageType;
  const countKey = `${kind}:${message.data?.marker || ""}`;
  counts.set(countKey, (counts.get(countKey) || 0) + 1);
  if (kind === "initWorkspace") {
    const { workspaceId, workspace } = message.data || {};
    if (!workspaceId || !workspace) return failure(message, "Fixture init requires workspaceId and workspace");
    if (process.env.GAMECOWORK_FIXTURE_FAIL_INIT_MATCH && String(workspace).includes(process.env.GAMECOWORK_FIXTURE_FAIL_INIT_MATCH)) {
      return failure(message, "Fixture workspace initialization failed");
    }
    workspaces.set(workspaceId, workspace);
    if (process.env.GAMECOWORK_FIXTURE_SLOW_INIT_MATCH && String(workspace).includes(process.env.GAMECOWORK_FIXTURE_SLOW_INIT_MATCH)) {
      setTimeout(() => success(message, {ok:true}), 2500);
      return;
    }
    return success(message, { ok: true });
  }
  if (kind === "shutdownWorkspace") {
    workspaces.delete(message.data?.workspaceId);
    return success(message, { ok: true });
  }
  if (["unity/getHubProjectsAndEditors", "unity/getHubProjects", "unity/getHubEditors"].includes(kind)) {
    const selectedHub = () => hub().map(group => ({...group,
      ...(kind === "unity/getHubProjects" ? {editors:[]} : {}),
      ...(kind === "unity/getHubEditors" ? {projects:[]} : {})}));
    const hubDelay = Number(process.env.GAMECOWORK_FIXTURE_HUB_DELAY_MS || 0);
    if (hubDelay > 0 && counts.get(countKey) > 1) {
      setTimeout(() => success(message,selectedHub()),hubDelay);
      return;
    }
    const mode = process.env.GAMECOWORK_FIXTURE_HUB_MODE || "normal";
    if (mode === "error") return failure(message, "Fixture Hub scan failed");
    if (mode === "invalid") return success(message, { invalid: true });
    return success(message, mode === "empty" ? [] : selectedHub());
  }
  if (kind === "fixture/getStats") return success(message, { counts: Object.fromEntries(counts), workspaces: Object.fromEntries(workspaces) });
  if (!workspaces.has(message.workspaceId)) return failure(message, `Fixture workspace is not initialized: ${message.workspaceId}`);
  if (kind === "fixture/startDescendant") {
    const entry = path.join(dataDir, `descendant-${randomUUID()}.mjs`);
    const ready = path.join(dataDir, `descendant-ready-${randomUUID()}.json`);
    fs.writeFileSync(entry, `import fs from "node:fs";\nfs.writeFileSync(${JSON.stringify(ready)}, JSON.stringify({pid:process.pid,parentPid:process.ppid,entry:process.argv[1]}));\nsetInterval(()=>{},1000);\n`);
    const child = spawn(process.execPath, [entry], { stdio: "ignore", windowsHide: true });
    log({ event: "descendantSpawned", pid: child.pid, parentPid: process.pid, entry, ready });
    child.once("error", (error) => failure(message, `Fixture descendant spawn failed: ${error.message}`));
    const deadline = Date.now() + 3000;
    const awaitReady = () => {
      if (fs.existsSync(ready)) return success(message, JSON.parse(fs.readFileSync(ready, "utf8")));
      if (Date.now() >= deadline) return failure(message, "Fixture descendant did not start");
      setTimeout(awaitReady, 10);
    };
    awaitReady();
    return;
  }
  if (kind === "config/getSharedConfig") return success(message, {});
  if (kind === "unity/getProjectStatus" || kind === "unity/getStatus") {
    const workspace = workspaces.get(message.workspaceId);
    const versionFile = path.join(workspace, "ProjectSettings", "ProjectVersion.txt");
    const version = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, "utf8") : "";
    return success(message, { isUnityProject: version.includes("m_EditorVersion:"), engineType: version.includes("m_TuanjieEditorVersion:") ? "tuanjie" : "unity",
      hasUnityMcpPackage: false, installedPackageVersion: null, projectRoot: workspace, connected: false, status: "disconnected" });
  }
  if (kind === "unity/getEngineType") {
    const versionFile = path.join(workspaces.get(message.workspaceId), "ProjectSettings", "ProjectVersion.txt");
    const version = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, "utf8") : "";
    return success(message, { type: version.includes("m_TuanjieEditorVersion:") ? "tuanjie" : "unity" });
  }
  if (kind === "config/checkRemoteConfig") return success(message, null);
  if (kind === "skills/list") return success(message, { skills: [] });
  if (kind === "extensions/list") return success(message, { extensions: [] });
  if (kind === "mcp/list") return success(message, { servers: [] });
  if (kind === "samplePrompts/fetch") return success(message, { prompts: [], skillMap: {}, extensionMap: {}, requestId: "fixture-local" });
  if (kind === "feedback/getProjectUploadState" || kind === "getCurrentOrg" || kind === "versionUpdate/markFeatureSeen") return success(message, null);
  if (kind === "settings/getGameCoworkHome") return success(message, { path: process.env.GAMECOWORK_CLI_HOME || path.join(dataDir, "cli-state"), isConfigured: false });
  if (kind === "getHomedir") return success(message, dataDir);
  if (kind === "history/list") return success(message, []);
  // The general UI fixture has no generation Providers, tasks or saved Canvas.
  // Only read-only empty state is modelled here; media/CRUD tests use the owned
  // asset-service Provider fixture and the real Core instead.
  if (kind === "generator/listProviders") return success(message, { providers: [] });
  if (kind === "generator/listTasks") return success(message, { tasks: [], total: 0, page: message.data?.page || 1, size: 0 });
  if (kind === "generator/getCanvas") return success(message, { canvas: { version: 1, nodes: [], edges: [] }, workspaceKey: message.data?.workspaceKey || "default" });
  if (kind === "config/getSerializedProfileInfo") return success(message, {
    result: { config: { models: [], selectedModelByRole: { chat: null, apply: null, edit: null, summarize: null, rerank: null, embed: null },
      slashCommands: [], contextProviders: [], tools: [], mcpServerStatuses: [], language: "zh" }, errors: [], configLoadInterrupted: false },
    profileId: null, organizations: [], selectedOrgId: null,
  });
  if (kind === "fixture/echo") return success(message, { workspaceId: message.workspaceId, input: message.data, count: counts.get(countKey) });
  if (kind === "fixture/root") return hostRoot(message);
  if (kind === "fixture/gui-callback" || kind === "fixture/unsupported-host") {
    const id=`fixture-callback-${randomUUID()}`;
    const callback=kind==='fixture/unsupported-host'?'getNotImplementedFixture':message.data.kind;
    if(!['getNotImplementedFixture','getWebviewHistory','getWebviewHistoryLength','getCurrentSessionId'].includes(callback))return failure(message,'Unknown fixture callback');
    callbacks.set(id,{message,mode:kind==='fixture/unsupported-host'?'host-error':'gui'});
    output({messageType:callback,messageId:id,workspaceId:message.workspaceId,data:null});return;
  }
  if (kind === "fixture/permission") {
    const id = `fixture-permission-${randomUUID()}`;
    callbacks.set(id, { message, mode: "permission" });
    output({ messageType: "acp/requestPermission", messageId: id, workspaceId: message.workspaceId,
      data: { sessionId: `fixture-session-${message.workspaceId}`, toolCall: { toolCallId: randomUUID(), name: "fixture_file_permission", title: "Fixture permission request", kind: "other", status: "pending", rawInput: {} },
        options: [{ optionId: "allow_once", name: "Allow once", kind: "allow_once" }, { optionId: "reject_once", name: "Reject", kind: "reject_once" }] } });
    return;
  }
  if (kind === "fixture/nativeLaunch") {
    const id = `fixture-native-${randomUUID()}`;
    callbacks.set(id, { message, mode: "native" });
    output({ messageType: "launchDetachedEditor", messageId: id, workspaceId: message.workspaceId, data: message.data });
    return;
  }
  if (kind === "fixture/lateEvent") {
    setTimeout(() => output({ messageType: "config/sharedConfigChanged", messageId: `fixture-event-${randomUUID()}`, workspaceId: message.workspaceId,
      data: { marker: message.data.marker, staleFixtureEvent: true } }), 100);
    return success(message, { scheduled: true });
  }
  if (kind === "unity/openEditor" && process.env.GAMECOWORK_FIXTURE_TEMPLATE_EDITOR)
    return success(message,{success:false,message:"This isolated template test stops after actual project creation; Editor launch is checked separately"});
  if (kind === "unity/openEditor") return hostRoot(message, "editor");
  if (kind === "fixture/stream" || kind === "llm/streamChat") {
    output({ ...message, data: { done: false, status: "success", content: "chunk-1" } });
    setTimeout(() => output({ ...message, data: { done: false, status: "success", content: "chunk-2" } }), 5);
    setTimeout(() => success(message, { complete: true }), 10);
    return;
  }
  if (kind === "fixture/error") return failure(message, "Fixture operation failed");
  if (kind === "abort") return;
  return failure(message, `Fixture operation is not implemented: ${kind}`);
}

process.stdin.setEncoding("utf8");
let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let index;
  while ((index = buffer.search(/[\r\n]/)) >= 0) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (!line) continue;
    try { receive(JSON.parse(line)); }
    catch (error) { log({ event: "parseError", error: String(error) }); }
  }
});
process.stdin.on("end", () => process.exit(0));
