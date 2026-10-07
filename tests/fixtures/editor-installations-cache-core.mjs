// Isolated discovery fixture with a releasable filesystem barrier. Never reads a
// real Hub registration, starts an Editor or makes a network/model request.
import fs from 'node:fs';
import path from 'node:path';
const root = fs.realpathSync(process.env.GAMECOWORK_FIXTURE_DATA_DIR);
const allowed = path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work');
if (!root.toLowerCase().startsWith(allowed.toLowerCase() + path.sep)) throw Error('Own isolated fixture directory required');
const configFile = path.join(root, 'discovery-control.json'), logFile = path.join(root, 'discovery-events.jsonl');
const log = value => fs.appendFileSync(logFile, JSON.stringify(value) + '\n');
const output = (message, status, value) => process.stdout.write(JSON.stringify({ ...message,
  data: status === 'success' ? { done: true, status, content: value } : { done: true, status, error: value } }) + '\r');
function own(file) { const resolved = path.resolve(file); if (!resolved.toLowerCase().startsWith(root.toLowerCase() + path.sep)) throw Error('Discovery fixture path escaped own root'); return resolved; }
async function barrier(file) {
  file = own(file); if (fs.existsSync(file)) return;
  await new Promise((resolve, reject) => {
    const watcher = fs.watch(path.dirname(file), () => { if (fs.existsSync(file)) finish(); });
    const timer = setTimeout(() => finish(Error('Own discovery barrier was not released')), 20000);
    function finish(error) { clearTimeout(timer); watcher.close(); error ? reject(error) : resolve(); }
    watcher.on('error', finish); if (fs.existsSync(file)) finish();
  });
}
async function receive(message) {
  if (message.messageType === 'initWorkspace' || message.messageType === 'shutdownWorkspace') return output(message, 'success', { ok: true });
  if (message.messageType === 'config/getSharedConfig') return output(message, 'success', {});
  if (['config/checkRemoteConfig','feedback/getProjectUploadState','getCurrentOrg'].includes(message.messageType)) return output(message, 'success', null);
  if (message.messageType === 'skills/list') return output(message, 'success', { skills: [] });
  if (message.messageType === 'extensions/list') return output(message, 'success', { extensions: [] });
  if (message.messageType === 'mcp/list') return output(message, 'success', { servers: [] });
  if (message.messageType === 'history/list') return output(message, 'success', []);
  if (message.messageType === 'history/markAsRead') return output(message, 'success', null);
  if (message.messageType === 'getHomedir') return output(message, 'success', root);
  if (message.messageType === 'samplePrompts/fetch') return output(message, 'success', { prompts:[],skillMap:{},extensionMap:{},requestId:'owned-cache-fixture' });
  if (message.messageType === 'settings/getGameCoworkHome') return output(message, 'success', { path:path.join(root,'cli-state'),isConfigured:false });
  if (message.messageType === 'config/getSerializedProfileInfo') return output(message, 'success', {
    result:{config:{models:[],selectedModelByRole:{chat:null,apply:null,edit:null,summarize:null,rerank:null,embed:null},slashCommands:[],contextProviders:[],tools:[],mcpServerStatuses:[],language:'zh'},errors:[],configLoadInterrupted:false},profileId:null,organizations:[],selectedOrgId:null,
  });
  if (!['unity/getHubProjects','unity/getHubEditors'].includes(message.messageType)) return output(message, 'error', 'Cache fixture does not implement ' + message.messageType);
  const projects = message.messageType === 'unity/getHubProjects';
  log({ event: projects ? 'projects-start' : 'scan-start', id: message.messageId, at: Date.now() });
  try {
    const control = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const gate = projects ? control.projectBarrierFile : control.barrierFile;
    if (gate) await barrier(gate);
    if (!projects && control.fail) throw Error('Owned discovery failure');
    const snapshot = JSON.parse(fs.readFileSync(own(control.snapshotFile), 'utf8'));
    output(message, 'success', snapshot.map(group => ({...group, ...(projects ? {editors:[]} : {projects:[]})}))); log({ event: projects ? 'projects-finished' : 'scan-finished', id: message.messageId, at: Date.now() });
  } catch (error) { output(message, 'error', error.message); log({ event: 'scan-failed', id: message.messageId, at: Date.now() }); }
}
log({ event: 'started', pid: process.pid, parentPid: process.ppid });
let carry = ''; process.stdin.setEncoding('utf8');
process.stdin.on('data', bytes => {
  carry += bytes; let at;
  while ((at = carry.search(/[\r\n]/)) >= 0) {
    const line = carry.slice(0, at).trim(); carry = carry.slice(at + 1);
    if (line) { try { receive(JSON.parse(line)).catch(error => log({ event: 'fixture-error', error: error.message })); } catch (error) { log({ event: 'fixture-error', error: error.message }); } }
  }
});
process.stdin.on('end', () => process.exit(0));
