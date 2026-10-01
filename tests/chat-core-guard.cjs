// Preload only for the isolated real core chat E2E. Not a product dependency.
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const append = fs.appendFileSync.bind(fs);
const root = path.resolve(process.env.GAMECOWORK_CHAT_ROOT);
const core = path.resolve(process.env.GAMECOWORK_CHAT_CORE);
const source = path.resolve(process.env.GAMECOWORK_CLI_PROBE_SOURCE);
const agent = path.resolve(process.env.GAMECOWORK_CHAT_AGENT);
function inside(value, base) {
  if (typeof value === 'number') return true;
  if (value instanceof URL) value = url.fileURLToPath(value);
  const target = path.resolve(String(value)).toLowerCase();
  const expected = base.toLowerCase();
  return target === expected || target.startsWith(expected + path.sep);
}
function denied(operation, host, pathname) {
  const error = new Error(`Chat E2E blocked ${operation}`);
  error.code = 'EACCES';
  append(path.join(root, 'core-guard-events.jsonl'), JSON.stringify({ operation, ...(host ? { host, pathname, stack: error.stack.split('\n').slice(2, 18) } : {}) }) + '\n');
  return error;
}
const readable = value => inside(value, root) || inside(value, core) || inside(value, source);
for (const [names, allowed] of [
  [['readFile', 'readdir', 'stat', 'lstat', 'realpath', 'access'], readable],
  [['writeFile', 'appendFile', 'mkdir', 'unlink', 'rm', 'rmdir', 'truncate', 'chmod'], value => inside(value, root)],
]) for (const name of names) {
  for (const key of [name, name + 'Sync']) if (fs[key]) {
    const original = fs[key].bind(fs);
    fs[key] = (...args) => { if (!allowed(args[0])) throw denied(key); return original(...args); };
  }
  if (fs.promises[name]) {
    const original = fs.promises[name].bind(fs.promises);
    fs.promises[name] = async (...args) => { if (!allowed(args[0])) throw denied('promises.' + name); return original(...args); };
  }
}
const exists = fs.existsSync.bind(fs);
fs.existsSync = value => { if (!readable(value)) { denied('existsSync'); return false; } return exists(value); };
function writing(flags) {
  return typeof flags === 'number' ? Boolean(flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_APPEND)) : /[wa+]/i.test(String(flags));
}
for (const name of ['open', 'openSync']) {
  const original = fs[name].bind(fs);
  fs[name] = (...args) => { if (writing(args[1]) ? !inside(args[0], root) : !readable(args[0])) throw denied(name); return original(...args); };
}
const open = fs.promises.open.bind(fs.promises);
fs.promises.open = async (...args) => { if (writing(args[1]) ? !inside(args[0], root) : !readable(args[0])) throw denied('promises.open'); return open(...args); };
for (const name of ['copyFile', 'rename']) {
  for (const key of [name, name + 'Sync']) {
    const original = fs[key].bind(fs);
    fs[key] = (...args) => {
      if (!inside(args[1], root) || (name === 'rename' ? !inside(args[0], root) : !readable(args[0]))) throw denied(key);
      return original(...args);
    };
  }
  const original = fs.promises[name].bind(fs.promises);
  fs.promises[name] = async (...args) => {
    if (!inside(args[1], root) || (name === 'rename' ? !inside(args[0], root) : !readable(args[0]))) throw denied('promises.' + name);
    return original(...args);
  };
}
function loopback(value) {
  const host = typeof value === 'string' || value instanceof URL || (typeof Request !== 'undefined' && value instanceof Request)
    ? new URL(value instanceof Request ? value.url : String(value)).hostname : value?.hostname || value?.host;
  return !host || ['127.0.0.1', '::1', 'localhost', '[::1]'].includes(host);
}
function targetHost(value) {
  try { return typeof value === 'string' || value instanceof URL || (typeof Request !== 'undefined' && value instanceof Request)
    ? new URL(value instanceof Request ? value.url : String(value)).hostname : value?.hostname || value?.host; } catch { return 'unknown'; }
}
function targetPath(value) {
  try { return typeof value === 'string' || value instanceof URL || (typeof Request !== 'undefined' && value instanceof Request)
    ? new URL(value instanceof Request ? value.url : String(value)).pathname : String(value?.path || '').split('?')[0]; } catch { return 'unknown'; }
}
const fetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (...args) => loopback(args[0]) ? fetch(...args) : Promise.reject(denied('external-fetch', targetHost(args[0]), targetPath(args[0])));
for (const protocol of ['node:http', 'node:https']) {
  const module = require(protocol);
  for (const name of ['request', 'get']) {
    const original = module[name].bind(module);
    module[name] = (...args) => { if (!loopback(args[0])) throw denied('external-' + protocol + '.' + name, targetHost(args[0]), targetPath(args[0])); return original(...args); };
  }
}
const net = require('node:net');
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const options = args[0] && typeof args[0] === 'object' ? args[0] : { host: typeof args[1] === 'string' ? args[1] : undefined };
  if (!loopback(options)) { const error = denied('external-net', targetHost(options)); queueMicrotask(() => this.destroy(error)); return this; }
  return connect.apply(this, args);
};
const cp = require('node:child_process');
for (const name of ['spawn', 'spawnSync', 'execFile', 'execFileSync']) {
  const original = cp[name].bind(cp);
  cp[name] = (command, args, options, ...rest) => {
    const versionOnly = Array.isArray(args) && args.length === 1 && ['--version', '-v', '--help'].includes(args[0]);
    if (path.resolve(String(command)).toLowerCase() !== agent.toLowerCase() || options?.shell ||
      (options?.cwd && !inside(options.cwd, root) && !(versionOnly && inside(options.cwd, core)))) throw denied('child_process.' + name);
    const modelIndex = Array.isArray(args) ? args.indexOf('--model') : -1;
    append(path.join(root, 'core-spawn-events.jsonl'), JSON.stringify({ operation: name, ownAgent: true,
      modelArgument: modelIndex >= 0 ? args[modelIndex + 1] : null,
      keyPresent: Boolean(options?.env?.OPENAI_API_KEY), baseUrlLoopback: /^http:\/\/127\.0\.0\.1(?::\d+)?\//.test(options?.env?.OPENAI_BASE_URL || ''),
      cwdInsideFixture: options?.cwd ? inside(options.cwd, root) : null }) + '\n');
    return original(command, args, options, ...rest);
  };
}
for (const name of ['exec', 'execSync', 'fork']) cp[name] = () => { throw denied('child_process.' + name); };
