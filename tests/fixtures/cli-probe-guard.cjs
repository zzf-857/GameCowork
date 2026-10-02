// Test preload only. tools/build-cli.ps1 -GuardFile embeds it into a test artifact.
// The manifest marks guarded builds; they must never replace the product binary.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.env.GAMECOWORK_CLI_PROBE_ROOT);
const source = path.resolve(process.env.GAMECOWORK_CLI_PROBE_SOURCE);
const append = fs.appendFileSync.bind(fs);
const read = fs.readFileSync.bind(fs);
const toolCaps = process.env.GAMECOWORK_CLI_TOOL_CAPS ? JSON.parse(process.env.GAMECOWORK_CLI_TOOL_CAPS) : null;
const exactPath = (left, right) => typeof left === 'string' && typeof right === 'string'
  && path.resolve(left).toLowerCase() === path.resolve(right).toLowerCase();
globalThis.__GAMECOWORK_CLI_TEST_GUARD = true;
function inside(value, base) {
  if (typeof value === 'number') return true;
  if (value instanceof URL) value = require('node:url').fileURLToPath(value);
  const resolved = path.resolve(String(value)).toLowerCase();
  const boundary = base.toLowerCase();
  return resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`);
}
Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 10, 30);
function denied(operation, target, targetPath) {
  const error = new Error(`CLI test blocked ${operation}`);
  error.code = 'EACCES';
  let targetHint = typeof target === 'string' ? target : undefined;
  if (targetHint && process.env.USERPROFILE) targetHint = targetHint.replace(process.env.USERPROFILE, '<profile>');
  append(path.join(root, 'guard-events.jsonl'), JSON.stringify({ operation, targetHint, targetPath,
    callers: error.stack?.split('\n').slice(2, 14).map(line => line.replace(root, '<fixture>')) }) + '\n');
  return error;
}
const readable = value => inside(value, root) || inside(value, source)
  || (toolCaps && [toolCaps.shell, toolCaps.runner].some(executable => exactPath(String(value), executable)));
// Rewind's path checks inspect each ancestor of the owned fixture. Admit only
// metadata for these exact directories; this grants no content, enumeration,
// write or sibling access outside the fixture.
const metadataAncestors = new Set();
for (let directory = root; ; directory = path.dirname(directory)) {
  metadataAncestors.add(directory.toLowerCase());
  if (path.dirname(directory) === directory) break;
}
const metadataReadable = value => {
  if (readable(value)) return true;
  if (value instanceof URL) value = require('node:url').fileURLToPath(value);
  return metadataAncestors.has(path.resolve(String(value)).toLowerCase());
};
for (const [names, allowed] of [
  [['readFile', 'readdir', 'access'], readable],
  [['stat', 'lstat', 'realpath'], metadataReadable],
  [['writeFile', 'appendFile', 'mkdir', 'unlink', 'rm', 'rmdir', 'truncate', 'chmod'], value => inside(value, root)],
]) {
  for (const name of names) {
    for (const key of [name, `${name}Sync`]) {
      if (fs[key]) {
        const native = fs[key].native;
        const original = fs[key].bind(fs);
        const guarded = (...args) => { if (!allowed(args[0])) throw denied(key, args[0]); return original(...args); };
        if (typeof native === 'function') guarded.native = (...args) => {
          if (!allowed(args[0])) throw denied(`${key}.native`, args[0]);
          return native.apply(fs, args);
        };
        fs[key] = guarded;
      }
    }
    if (fs.promises[name]) {
      const original = fs.promises[name].bind(fs.promises);
      fs.promises[name] = async (...args) => { if (!allowed(args[0])) throw denied(`promises.${name}`, args[0]); return original(...args); };
    }
  }
}
const exists = fs.existsSync.bind(fs);
fs.existsSync = value => { if (!readable(value)) { denied('existsSync'); return false; } return exists(value); };
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
  return typeof flags === 'number' ? Boolean(flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_APPEND)) : /[wa+]/i.test(String(flags));
}
for (const name of ['open', 'openSync']) {
  const original = fs[name].bind(fs);
  fs[name] = (...args) => { if (writing(args[1]) ? !inside(args[0], root) : !readable(args[0])) throw denied(name, args[0]); return original(...args); };
}
const open = fs.promises.open.bind(fs.promises);
fs.promises.open = async (...args) => { if (writing(args[1]) ? !inside(args[0], root) : !readable(args[0])) throw denied('promises.open', args[0]); return open(...args); };
const cp = require('node:child_process');
const realSpawn = cp.spawn.bind(cp);
const ownedChildren = new Map();
cp.spawn = (command, args = [], options = {}) => {
  const mcp = toolCaps?.mcp;
  if (mcp && exactPath(command, mcp.executable) && inside(mcp.executable, root)
      && args.length === 1 && exactPath(args[0], mcp.script) && inside(mcp.script, root)
      && options.shell !== true && exactPath(options.cwd || process.cwd(), mcp.workspace)
      && /^[a-f0-9]{64}$/i.test(mcp.executableSha256 || "") && /^[a-f0-9]{64}$/i.test(mcp.scriptSha256 || "")
      && require('node:crypto').createHash('sha256').update(read(mcp.executable)).digest('hex') === mcp.executableSha256.toLowerCase()
      && require('node:crypto').createHash('sha256').update(read(mcp.script)).digest('hex') === mcp.scriptSha256.toLowerCase()) {
    const child = realSpawn(command, args, { ...options, windowsHide: true });
    ownedChildren.set(child.pid, child);
    child.once('exit', () => ownedChildren.delete(child.pid));
    append(path.join(root, 'guard-events.jsonl'), JSON.stringify({ operation: 'allowed.spawn', pid: child.pid,
      script: path.basename(mcp.script), commandKind: 'exact-owned-stdio-mcp' }) + '\n');
    return child;
  }
  if (toolCaps && exactPath(command, toolCaps.shell) && options.shell === false
      && exactPath(options.cwd, toolCaps.workspace) && args.length === 3
      && args[0] === '-NoProfile' && args[1] === '-Command') {
    const script = toolCaps.scripts.find(script => script.command === args[2]);
    if (script && inside(script.path, root) && /^[a-f0-9]{64}$/i.test(script.sha256)
        && require('node:crypto').createHash('sha256').update(read(script.path)).digest('hex') === script.sha256) {
      const child = realSpawn(command, args, { ...options, windowsHide: true });
      ownedChildren.set(child.pid, child);
      child.once('exit', () => ownedChildren.delete(child.pid));
      append(path.join(root, 'guard-events.jsonl'), JSON.stringify({ operation: 'allowed.spawn', pid: child.pid,
        script: path.basename(script.path), commandKind: 'exact-fixture-runner' }) + '\n');
      return child;
    }
  }
  // The actual CLI fallback cancels a Windows shell with taskkill. Accept only
  // the fixed argument vector for a still-live child created above, then use
  // the explicit system utility rather than resolving a client-supplied PATH.
  if (toolCaps && command === 'taskkill' && args.length === 4 && args[0] === '/pid'
      && args[2] === '/f' && args[3] === '/t' && /^\d+$/.test(args[1])) {
    const child = ownedChildren.get(Number(args[1]));
    if (child && child.exitCode === null && child.signalCode === null) {
      append(path.join(root, 'guard-events.jsonl'), JSON.stringify({ operation: 'allowed.cancel', pid: child.pid }) + '\n');
      return realSpawn(toolCaps.taskkill, args, { windowsHide: true });
    }
  }
  throw denied('child_process.spawn', command);
};
for (const key of ['spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) cp[key] = (...args) => { throw denied(`child_process.${key}`, args[0]); };
function loopback(value) {
  let host;
  if (typeof value === 'string' || value instanceof URL || (typeof Request !== 'undefined' && value instanceof Request)) host = new URL(value instanceof Request ? value.url : String(value)).hostname;
  else host = value?.hostname || value?.host;
  return !host || ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host);
}
const nativeFetch = globalThis.fetch.bind(globalThis);
function publicEndpoint(value) {
  if (typeof value === 'string' || value instanceof URL || (typeof Request !== 'undefined' && value instanceof Request)) {
    const url = new URL(value instanceof Request ? value.url : String(value)); return url.hostname;
  }
  return value?.hostname || value?.host || '';
}
function publicPath(value) {
  let pathname;
  if (typeof value === 'string' || value instanceof URL || (typeof Request !== 'undefined' && value instanceof Request)) {
    pathname = new URL(value instanceof Request ? value.url : String(value)).pathname;
  } else pathname = String(value?.path || '').split('?')[0];
  // Keep business endpoints useful for diagnosis, without query parameters or
  // long credential/identifier path segments. Never record headers or bodies.
  return pathname.split('/').map(part => part.length > 32 ? '<redacted>' : part).join('/');
}
globalThis.fetch = (...args) => { if (!loopback(args[0])) return Promise.reject(denied('fetch', publicEndpoint(args[0]), publicPath(args[0]))); return nativeFetch(...args); };
for (const protocol of ['node:http', 'node:https']) {
  const module = require(protocol);
  for (const name of ['request', 'get']) {
    const original = module[name].bind(module);
    module[name] = (...args) => { if (!loopback(args[0])) throw denied(`${protocol}.${name}`, publicEndpoint(args[0]), publicPath(args[0])); return original(...args); };
  }
}
const net = require('node:net');
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const options = args[0] && typeof args[0] === 'object' ? args[0] : { host: typeof args[1] === 'string' ? args[1] : undefined };
  if (!loopback(options)) { const error = denied('net.connect'); queueMicrotask(() => this.destroy(error)); return this; }
  return connect.apply(this, args);
};
if (globalThis.Bun) {
  const file = Bun.file.bind(Bun);
  Bun.file = (value, ...args) => { if (!readable(value)) throw denied('Bun.file'); return file(value, ...args); };
  const write = Bun.write.bind(Bun);
  Bun.write = (value, ...args) => { if (!inside(value?.name ?? value, root)) throw denied('Bun.write'); return write(value, ...args); };
}
