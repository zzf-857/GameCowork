// NODE_OPTIONS preload used exclusively by real-core-smoke.mjs, never by the product.
// No profile environment variables are changed. This guard prevents this test's
// Node process from reading unrelated profiles, writing outside its fixture,
// starting another program, or connecting to an external service.
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const originalAppend = fs.appendFileSync.bind(fs);
const originalExists = fs.existsSync.bind(fs);
const root = path.resolve(process.env.GAMECOWORK_SMOKE_ROOT);
const resources = path.resolve(process.env.GAMECOWORK_CORE_DIR);
const agent = process.env.GAMECOWORK_SMOKE_CLI_PATH ? path.resolve(process.env.GAMECOWORK_SMOKE_CLI_PATH) : null;
const agentPackage = agent ? path.dirname(agent) : null;
function inside(value, base) {
  if (typeof value === 'number') return true; // Existing stdio handles.
  if (value instanceof URL) value = url.fileURLToPath(value);
  const resolved = path.resolve(String(value)).toLowerCase();
  const expected = base.toLowerCase();
  return resolved === expected || resolved.startsWith(`${expected}${path.sep}`);
}
function denied(operation) {
  originalAppend(path.join(root, 'guard-events.jsonl'), JSON.stringify({ operation }) + '\n');
  const error = new Error(`isolated smoke blocked ${operation}`);
  error.code = 'EACCES';
  return error;
}
function readable(value) { return inside(value, root) || inside(value, resources) || (agentPackage && inside(value,agentPackage)); }
const reads = ['readFile', 'readdir', 'stat', 'lstat', 'access', 'realpath'];
const writes = ['writeFile', 'appendFile', 'mkdir', 'unlink', 'rm', 'rmdir', 'truncate', 'chmod'];
for (const [names, allowed] of [[reads, readable], [writes, value => inside(value, root)]]) {
  for (const name of names) {
    for (const key of [name, `${name}Sync`]) {
      const original = fs[key]?.bind(fs);
      if (original) fs[key] = (...args) => { if (!allowed(args[0])) throw denied(key); return original(...args); };
    }
    const original = fs.promises[name]?.bind(fs.promises);
    if (original) fs.promises[name] = async (...args) => { if (!allowed(args[0])) throw denied(`promises.${name}`); return original(...args); };
  }
}
fs.existsSync = value => {
  if (!readable(value)) { denied('existsSync'); return false; }
  return originalExists(value);
};
for (const name of ['rename', 'copyFile']) {
  for (const key of [name, `${name}Sync`]) {
    const original = fs[key].bind(fs);
    fs[key] = (...args) => {
      if (!inside(args[1], root) || (name === 'rename' ? !inside(args[0], root) : !readable(args[0]))) throw denied(key);
      return original(...args);
    };
  }
  const original = fs.promises[name].bind(fs.promises);
  fs.promises[name] = async (...args) => {
    if (!inside(args[1], root) || (name === 'rename' ? !inside(args[0], root) : !readable(args[0]))) throw denied(`promises.${name}`);
    return original(...args);
  };
}
function writing(flags) {
  return typeof flags === 'number'
    ? Boolean(flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_APPEND))
    : /[wa+]/i.test(String(flags));
}
for (const name of ['open', 'openSync']) {
  const original = fs[name].bind(fs);
  fs[name] = (...args) => {
    if (writing(args[1]) ? !inside(args[0], root) : !readable(args[0])) throw denied(name);
    return original(...args);
  };
}
const open = fs.promises.open.bind(fs.promises);
fs.promises.open = async (...args) => {
  if (writing(args[1]) ? !inside(args[0], root) : !readable(args[0])) throw denied('promises.open');
  return open(...args);
};
const net = require('node:net');
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const options = args[0] && typeof args[0] === 'object' ? args[0] : undefined;
  const host = options?.host || (typeof args[1] === 'string' ? args[1] : undefined);
  if (host && !['127.0.0.1', '::1', 'localhost'].includes(host)) {
    const error = denied('external-network');
    queueMicrotask(() => this.destroy(error));
    return this;
  }
  return connect.apply(this, args);
};
const cp = require('node:child_process');
for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
  const original = cp[name].bind(cp);
  cp[name] = (...args) => {
    if(agent&&['spawn','spawnSync','execFile','execFileSync'].includes(name)&&
       typeof args[0]==='string'&&path.resolve(args[0]).toLowerCase()===agent.toLowerCase()&&Array.isArray(args[1])) {
      const options={...(args[2]||{}),windowsHide:true,env:{...(args[2]?.env||process.env)}};
      // The compiled test Agent has its own embedded guard; avoid loading this
      // Node-core preload into Bun a second time.
      delete options.env.NODE_OPTIONS;
      return original(args[0],args[1],options,...args.slice(3));
    }
    throw denied(`child_process.${name}`);
  };
}
