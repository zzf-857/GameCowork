// Test-only preload. Real editor discovery reads public Hub editor metadata and
// installed software; personal projects/profiles, process launches, outside
// writes, and all Node outgoing connections are blocked. Core uses stdio and
// editor discovery needs no network. No Editor result is mocked.
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const root = path.resolve(process.env.GAMECOWORK_EDITOR_AUDIT_ROOT || '');
const temp = path.resolve('F:/AI/AgentMake/temp/GameCowork');
if (!root.toLowerCase().startsWith(temp.toLowerCase() + path.sep)) throw Error('Editor audit requires an isolated temp root');
const policy = JSON.parse(fs.readFileSync(path.join(root, 'read-policy.json'), 'utf8'));
const append = fs.appendFileSync.bind(fs), realpath = fs.realpathSync.bind(fs), exists = fs.existsSync.bind(fs);
const normalize = value => path.resolve(value instanceof URL ? url.fileURLToPath(value) : String(value)).toLowerCase();
const inside = (value, base) => typeof value === 'number' || normalize(value) === normalize(base) || normalize(value).startsWith(normalize(base) + path.sep);
const resources = path.resolve(process.env.GAMECOWORK_CORE_DIR);
const safeRoots = [root, resources, ...(policy.codeRoots || []), ...policy.installRoots];
const exactFiles = new Set(policy.hubFiles.map(normalize)), directories = new Set(policy.scanDirectories.map(normalize));
const readable = (value, operation) => typeof value === 'number' || safeRoots.some(base => inside(value, base)) ||
  exactFiles.has(normalize(value)) || (['stat', 'lstat', 'access', 'realpath', 'exists', 'readdir'].includes(operation) && directories.has(normalize(value)));
const realInside = value => {
  if (typeof value === 'number') return true;
  let resolved = path.resolve(value instanceof URL ? url.fileURLToPath(value) : String(value));
  while (!exists(resolved)) { const parent = path.dirname(resolved); if (parent === resolved) return false; resolved = parent; }
  return inside(realpath(resolved), root);
};
function event(operation, category) { append(path.join(root, 'guard-events.jsonl'), JSON.stringify({ operation, category }) + '\n'); }
function denied(operation, category = 'unrelated-read') { event(operation, category); const error = Error('Editor-only audit blocked ' + category); error.code = 'EACCES'; return error; }
const readDenied = (operation, value) => denied(operation, typeof value !== 'number' && path.basename(String(value)) === 'favoriteProjects.json' ? 'personal-project-read' : 'unrelated-read');
if (require('node:worker_threads').isMainThread)
  append(path.join(root, 'core-started.jsonl'), JSON.stringify({ pid: process.pid, parentPid: process.ppid, entry: process.argv[1], runtime: process.execPath }) + '\n');
for (const operation of ['readFile', 'readdir', 'stat', 'lstat', 'access', 'realpath']) {
  const category = operation === 'readFile' ? 'readFile' : operation;
  for (const method of [operation, operation + 'Sync']) {
    const original = fs[method]?.bind(fs);
    if (original) fs[method] = (...args) => { if (!readable(args[0], category)) throw readDenied(method, args[0]); return original(...args); };
  }
  const original = fs.promises[operation]?.bind(fs.promises);
  if (original) fs.promises[operation] = async (...args) => { if (!readable(args[0], category)) throw readDenied('promises.' + operation, args[0]); return original(...args); };
}
fs.existsSync = value => { if (!readable(value, 'exists')) { event('existsSync', 'unrelated-read'); return false; } return exists(value); };
for (const operation of ['writeFile', 'appendFile', 'mkdir', 'unlink', 'rm', 'rmdir', 'truncate', 'chmod', 'utimes', 'symlink', 'link']) {
  for (const method of [operation, operation + 'Sync']) {
    const original = fs[method]?.bind(fs);
    if (original) fs[method] = (...args) => { if (!inside(args[0], root) || !realInside(args[0]) || ['symlink', 'link'].includes(operation)) throw denied(method, 'outside-write'); return original(...args); };
  }
  const original = fs.promises[operation]?.bind(fs.promises);
  if (original) fs.promises[operation] = async (...args) => { if (!inside(args[0], root) || !realInside(args[0]) || ['symlink', 'link'].includes(operation)) throw denied('promises.' + operation, 'outside-write'); return original(...args); };
}
for (const operation of ['rename', 'copyFile']) {
  const allowed = args => inside(args[1], root) && realInside(args[1]) && (operation === 'rename' ? inside(args[0], root) && realInside(args[0]) : readable(args[0], 'readFile'));
  for (const method of [operation, operation + 'Sync']) { const original = fs[method].bind(fs); fs[method] = (...args) => { if (!allowed(args)) throw denied(method, 'outside-write'); return original(...args); }; }
  const original = fs.promises[operation].bind(fs.promises); fs.promises[operation] = async (...args) => { if (!allowed(args)) throw denied('promises.' + operation, 'outside-write'); return original(...args); };
}
const writing = flags => typeof flags === 'number' ? Boolean(flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_APPEND)) : /[wa+]/i.test(String(flags));
for (const operation of ['open', 'openSync']) { const original = fs[operation].bind(fs); fs[operation] = (...args) => { if (writing(args[1]) ? !inside(args[0], root) || !realInside(args[0]) : !readable(args[0], 'readFile')) throw denied(operation, writing(args[1]) ? 'outside-write' : 'unrelated-read'); return original(...args); }; }
const open = fs.promises.open.bind(fs.promises); fs.promises.open = async (...args) => { if (writing(args[1]) ? !inside(args[0], root) || !realInside(args[0]) : !readable(args[0], 'readFile')) throw denied('promises.open', writing(args[1]) ? 'outside-write' : 'unrelated-read'); return open(...args); };
const cp = require('node:child_process');
for (const method of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) cp[method] = command => {
  throw denied('child_process.' + method, typeof command === 'string' && /^reg\s+query\s+["']?HKCU\\/i.test(command) ? 'personal-project-registry' : 'process-launch');
};
const net = require('node:net');
net.Socket.prototype.connect = function () { throw denied('net.connect', 'outgoing-network'); };
for (const namespace of ['node:tls', 'node:http', 'node:https']) {
  const api = require(namespace);
  for (const method of namespace === 'node:tls' ? ['connect'] : ['request', 'get'])
    api[method] = () => { throw denied(namespace + '.' + method, 'outgoing-network'); };
}
if (globalThis.fetch) globalThis.fetch = async () => { throw denied('fetch', 'outgoing-network'); };
