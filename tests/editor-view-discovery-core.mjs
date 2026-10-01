// Narrow disconnected metadata/history wrapper around the shared stdio fixture.
// It only reads the owned manifest; actual package writes belong to the Rust host.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(process.env.GAMECOWORK_FIXTURE_DATA_DIR || "");
assertOwned(root);
const logFile = path.resolve(process.env.GAMECOWORK_FIXTURE_LOG || path.join(root, "core-frames.jsonl"));
assertOwned(logFile);
const controlFile = process.env.GAMECOWORK_FIXTURE_DISCOVERY_CONTROL && path.resolve(process.env.GAMECOWORK_FIXTURE_DISCOVERY_CONTROL);
if (controlFile) assertOwned(controlFile);
const projects = new Map();
const write = message => process.stdout.write(JSON.stringify(message) + "\r");
const log = message => fs.appendFileSync(logFile, JSON.stringify({ event: "received", frame: message, handledBy: "editor-view-discovery-core" }) + "\n");
function assertOwned(value) { if (!value.toLowerCase().startsWith(path.resolve("F:/AI/AgentMake/temp/GameCowork").toLowerCase() + path.sep)) throw new Error("Discovery fixture must remain below temp/GameCowork"); }
function success(message, content) { write({ ...message, data: { done: true, status: "success", content } }); }
function history(workspaceId, project) {
  const sessionId = "fixture-view-" + createHash("sha256").update(workspaceId).digest("hex").slice(0, 16);
  return { sessionId, title: "Connector history " + path.basename(project), workspaceDirectory: project, dateCreated: "2026-10-01T00:00:00Z", state: "active", unread: false,
    history: [{ message: { id: sessionId + "-user", role: "user", content: "Inspect this owned fixture" } }, { message: { id: sessionId + "-assistant", role: "assistant", content: "Owned disconnected fixture; no model or Editor is used." } }] };
}
function handle(message) {
  const type = message.messageType;
  if (type === "initWorkspace") { const project = path.resolve(message.data?.workspace || ""); assertOwned(project); projects.set(message.data.workspaceId, project); }
  if (type === "shutdownWorkspace") projects.delete(message.data?.workspaceId);
  const project = projects.get(message.workspaceId);
  if (project && ["unity/getProjectStatus", "unity/getStatus", "unity/getEngineType", "unity/refresh", "history/list", "history/load", "stream/getActiveStreams", "generator/listTasks"].includes(type)) {
    log(message);
    if (type === "history/list") { const session = history(message.workspaceId, project); const { history: ignored, ...meta } = session; success(message, [meta]); return true; }
    if (type === "history/load") { success(message, history(message.workspaceId, project)); return true; }
    if (type === "stream/getActiveStreams") { success(message, { activeStreams: [] }); return true; }
    if (type === "generator/listTasks") { success(message, { tasks: [], total: 0, supported: false }); return true; }
    const version = fs.readFileSync(path.join(project, "ProjectSettings/ProjectVersion.txt"), "utf8");
    const engineType = version.includes("m_TuanjieEditorVersion:") ? "Tuanjie" : "Unity";
    if (type === "unity/getEngineType") { success(message, { type: engineType }); return true; }
    const manifest = JSON.parse(fs.readFileSync(path.join(project, "Packages/manifest.json"), "utf8"));
    const metadata = { isUnityProject: true, engineType, engineVersion: version.match(/m_EditorVersion:\s*(\S+)/)?.[1], projectRoot: project,
      hasUnityMcpPackage: typeof manifest.dependencies?.["cn.gamecowork.bridge"] === "string", installedPackageVersion: null,
      connected: false, ...(type !== "unity/getProjectStatus" ? { status: "disconnected" } : {}), pid: null };
    if (type === "unity/getProjectStatus" && controlFile) {
      const control = JSON.parse(fs.readFileSync(controlFile, "utf8"));
      if (control.phase === "non-unity") { success(message, { isUnityProject: false, projectRoot: project, hasUnityMcpPackage: false, engineType: null }); return true; }
      if (control.phase === "delayed-a" && project === control.delayedRoot && message.data?.workspaceKey === message.workspaceId) {
        fs.appendFileSync(logFile, JSON.stringify({ event: "discovery-delay-scheduled", workspaceId: message.workspaceId, marker: control.marker }) + "\n");
        setTimeout(() => { fs.appendFileSync(logFile, JSON.stringify({ event: "discovery-delay-delivered", workspaceId: message.workspaceId, projectRoot: project, marker: control.marker }) + "\n"); success(message, metadata); }, 1200);
        return true;
      }
      if (control.phase !== "known") { write({ ...message, data: { done: true, status: "error", error: "Owned discovery metadata permission probe unavailable" } }); return true; }
    }
    success(message, metadata);
    return true;
  }
  return false;
}
const child = spawn(process.execPath, [fileURLToPath(new URL("./core-fixture.mjs", import.meta.url))], { env: process.env, windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
child.stdout.pipe(process.stdout); child.stderr.pipe(process.stderr); child.on("exit", code => process.exit(code ?? 1));
let pending = "";
process.stdin.setEncoding("utf8"); process.stdin.on("data", chunk => {
  pending += chunk;
  let marker;
  while ((marker = pending.indexOf("\r")) >= 0) { const frame = pending.slice(0, marker).trim(); pending = pending.slice(marker + 1); if (!frame) continue; const message = JSON.parse(frame); if (!handle(message)) child.stdin.write(frame + "\r"); }
});
process.stdin.on("end", () => child.stdin.end());
