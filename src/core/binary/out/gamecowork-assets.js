'use strict';
// Own configurable REST generation service. No original OAuth/service fallback.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const dns = require('node:dns').promises;
const zlib = require('node:zlib');
const MAX_FILE = 64 * 1024 * 1024, MAX_JSON = 96 * 1024 * 1024;
const TERMINAL = new Set(['completed', 'failed', 'cancelled', 'interrupted']);
const KINDS = new Set(['image', 'video', 'model']);
const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
const SECRET_FIELD = /^(api[_-]?key|authorization|access[_-]?token|refresh[_-]?token|password|secret|bearer[_-]?token)$/i;
const DEFAULT_MAP = { queued: ['queued', 'pending'], running: ['running', 'processing', 'in_progress'], completed: ['completed', 'succeeded', 'success'], failed: ['failed', 'error'], cancelled: ['cancelled', 'canceled'] };
const DEFAULT_BODY = { kind: '{{kind}}', model: '{{model}}', prompt: '{{prompt}}', parameters: '{{parameters}}' };
const DEFAULT_OUTPUT_SELECTORS = { url: 'url', base64: 'base64', mime: 'mime', filename: 'filename' };
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const CRC_TABLE = new Uint32Array(256); for (let n = 0; n < 256; n++) { let value = n; for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0); CRC_TABLE[n] = value; }
function crc(bytes) { let value = 0xffffffff; for (const byte of bytes) value = (value >>> 8) ^ CRC_TABLE[(value ^ byte) & 255]; return (value ^ 0xffffffff) >>> 0; }
const clone = value => JSON.parse(JSON.stringify(value));
const stableJson = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
function boundedJson(value, limit = 1024 * 1024) {
  const visit = (item, depth = 0) => {
    if (depth > 20) throw Error('JSON nesting exceeds 20 levels');
    if (typeof item === 'number' && !Number.isFinite(item)) throw Error('JSON numbers must be finite');
    if (Array.isArray(item)) { if (item.length > 4096) throw Error('JSON array is too large'); for (const child of item) visit(child, depth + 1); }
    else if (item && typeof item === 'object') {
      if (Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) throw Error('Plain JSON objects are required');
      if (Object.keys(item).length > 4096) throw Error('JSON object is too large');
      for (const [key, child] of Object.entries(item)) { if (['__proto__', 'prototype', 'constructor'].includes(key)) throw Error('Unsafe JSON property'); if (SECRET_FIELD.test(key)) throw Error('Credentials belong in Provider authentication, not task/template JSON'); visit(child, depth + 1); }
    } else if (!['string', 'boolean', 'number', 'undefined'].includes(typeof item) && item !== null) throw Error('JSON-compatible values are required');
  };
  visit(value); const bytes = Buffer.from(JSON.stringify(value)); if (bytes.length > limit) throw Error('JSON payload exceeds its size budget'); return clone(value);
}
function text(value, name, limit, required = false) { if (typeof value !== 'string' || value.length > limit || (name === 'prompt' ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value) || required && !value.trim()) throw Error(name + ' must be bounded non-control text'); return value; }
function id(value, name) { if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(value) || ['__proto__', 'prototype', 'constructor'].includes(value)) throw Error('Invalid ' + name); return value; }
function acquireOwner(root, checked) {
  const lock = checked('owner.lock'), recovery = checked('owner.recovery.lock'), owner = { pid: process.pid, nonce: crypto.randomBytes(32).toString('hex'), createdTime: new Date().toISOString() };
  const read = file => { const stat = fs.lstatSync(file); if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 || stat.size > 4096) throw Error('Asset owner record is unsafe'); const bytes = fs.readFileSync(file), record = JSON.parse(bytes); if (!Number.isInteger(record.pid) || record.pid < 1 || !/^[a-f0-9]{64}$/.test(record.nonce)) throw Error('Asset owner identity is unknown'); return { bytes, record, identity: stat.dev + ':' + stat.ino }; };
  const write = file => { const descriptor = fs.openSync(file, 'wx', 0o600); try { fs.writeFileSync(descriptor, JSON.stringify(owner)); fs.fsyncSync(descriptor); } finally { fs.closeSync(descriptor); } };
  const same = file => { if (!fs.existsSync(file)) return false; const actual = read(file); return actual.record.pid === owner.pid && actual.record.nonce === owner.nonce; };
  const release = () => { if (same(lock)) fs.unlinkSync(lock); };
  if (fs.existsSync(recovery)) throw Error('Asset runtime ownership is being recovered; unknown recovery owners are not removed');
  try { write(lock); if (fs.existsSync(recovery)) { release(); throw Error('Asset runtime ownership changed during acquisition'); } }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    try { write(recovery); } catch { throw Error('Asset runtime ownership is busy or unknown'); }
    try {
      const before = read(lock); let dead = false; try { process.kill(before.record.pid, 0); } catch (probe) { if (probe.code === 'ESRCH') dead = true; else throw Error('Cannot verify the existing asset owner'); }
      if (!dead) throw Error('Asset runtime already has a live owner process');
      const after = read(lock); if (after.identity !== before.identity || !after.bytes.equals(before.bytes)) throw Error('Asset owner changed while checking stale ownership');
      fs.unlinkSync(lock); write(lock);
    } finally { if (same(recovery)) fs.unlinkSync(recovery); }
  }
  return { assert() { if (!same(lock)) throw Error('Asset runtime owner generation was replaced'); }, release };
}
function select(object, expression) {
  if (typeof expression !== 'string' || !expression || expression.length > 256) return undefined;
  const parts = expression.startsWith('/') ? expression.slice(1).split('/').map(part => part.replace(/~1/g, '/').replace(/~0/g, '~')) : expression.split('.');
  let result = object; for (const part of parts) { if (['__proto__', 'prototype', 'constructor'].includes(part) || result == null || !Object.prototype.hasOwnProperty.call(result, part)) return undefined; result = result[part]; } return result;
}
function render(template, variables) {
  if (typeof template === 'string') {
    const resolve = key => { if (!/^[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z0-9_]+)*$/.test(key)) throw Error('Unknown body template variable'); const value = select(variables, key); if (value === undefined) throw Error('Unknown or unavailable body template variable: ' + key); return value; };
    const exact = template.match(/^\{\{([^{}]+)\}\}$/); if (exact) return clone(resolve(exact[1]));
    return template.replace(/\{\{([^{}]+)\}\}/g, (_, key) => { const value = resolve(key); return typeof value === 'object' ? JSON.stringify(value) : String(value); });
  }
  if (Array.isArray(template)) return template.map(item => render(item, variables));
  if (template && typeof template === 'object') return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, render(value, variables)]));
  return template;
}
function inputTemplateIndexes(template, count) {
  const used = new Set();
  const visit = value => { if (typeof value === 'string') for (const match of value.matchAll(/\{\{([^{}]+)\}\}/g)) { if (match[1] === 'inputs') for (let index = 0; index < count; index++) used.add(index); const input = /^inputs\.(\d+)(?:\.(base64|dataUrl))?$/.exec(match[1]); if (input) used.add(Number(input[1])); } else if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === 'object') Object.values(value).forEach(visit); };
  visit(template); return used;
}
function privateIpv4(host) { const parts = host.split('.').map(Number); return /^\d+\.\d+\.\d+\.\d+$/.test(host) && parts.every(value => value >= 0 && value <= 255) && (parts[0] === 10 || parts[0] === 192 && parts[1] === 168 || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31); }
function safeUrl(value, base, allowedLanOrigin) {
  let url; try { url = new URL(value, base); } catch { throw Error('Invalid Provider URL'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw Error('Provider URLs must be HTTP(S) without embedded credentials or fragments');
  const host = url.hostname.toLowerCase().replace(/\.$/, ''); if (host === 'ai-generator.tuanjie.cn' || host.endsWith('.ai-generator.tuanjie.cn')) throw Error('The original asset service is not supported');
  if (url.protocol === 'http:' && !['127.0.0.1', 'localhost', '[::1]', '::1'].includes(host) && !(url.origin === allowedLanOrigin && privateIpv4(host))) throw Error('Unencrypted HTTP requires loopback or an explicitly authorized private LAN origin');
  return url;
}
function endpoint(provider, specification, remoteId) {
  const expanded = specification.path.replace(/\{\{taskId\}\}/g, encodeURIComponent(remoteId || ''));
  if (!expanded.startsWith('/') || expanded.startsWith('//') || expanded.includes('\\') || expanded.split(/[/?]/).some(part => ['.', '..'].includes(decodeURIComponent(part)))) throw Error('Provider route must be a bounded relative API path');
  const url = safeUrl(provider.baseUrl.replace(/\/+$/, '') + expanded, undefined, provider.allowInsecureLan === true ? new URL(provider.baseUrl).origin : undefined);
  if (url.origin !== new URL(provider.baseUrl).origin) throw Error('Provider route changed its origin'); return url;
}
function validBase64(value) {
  if (value.length % 4 !== 0) return false;
  let end = value.length;
  if (end && value.charCodeAt(end - 1) === 61) { end--; if (end && value.charCodeAt(end - 1) === 61) end--; }
  // Avoid repeated capture/backtracking regexes: supported 64 MiB outputs have
  // ~90 million base64 characters and must use bounded stack and linear work.
  for (let index = 0; index < end; index++) {
    const code = value.charCodeAt(index);
    if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47)) return false;
  }
  return true;
}
function mediaType(bytes) {
  if (bytes.length < 16) throw Error('Generated media is incomplete');
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    if (bytes.length < 45 || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR' || !bytes.readUInt32BE(16) || !bytes.readUInt32BE(20)) throw Error('Invalid PNG header');
    let offset = 8, ended = false; const data = [], width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20), depth = bytes[24], color = bytes[25], channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color];
    if (width * height > 16777216 || !channels || ![1, 2, 4, 8, 16].includes(depth) || bytes[26] || bytes[27] || bytes[28] > 1) throw Error('Unsupported/bounded PNG dimensions or coding');
    while (offset + 12 <= bytes.length) { const size = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8); if (size > bytes.length - offset - 12) throw Error('Truncated PNG chunk'); if (crc(bytes.subarray(offset + 4, offset + 8 + size)) !== bytes.readUInt32BE(offset + 8 + size)) throw Error('PNG checksum mismatch'); if (type === 'IDAT') data.push(bytes.subarray(offset + 8, offset + 8 + size)); offset += size + 12; if (type === 'IEND') { ended = true; break; } }
    if (!data.length || !ended || offset !== bytes.length) throw Error('Incomplete PNG data');
    const passes = bytes[28] === 0 ? [[0, 0, 1, 1]] : [[0, 0, 8, 8], [4, 0, 8, 8], [0, 4, 4, 8], [2, 0, 4, 4], [0, 2, 2, 4], [1, 0, 2, 2], [0, 1, 1, 2]], rows = [];
    for (const [x, y, dx, dy] of passes) { const columns = Math.max(0, Math.ceil((width - x) / dx)), count = Math.max(0, Math.ceil((height - y) / dy)); if (columns && count) rows.push({ count, length: Math.ceil(columns * channels * depth / 8) + 1 }); }
    const expected = rows.reduce((sum, row) => sum + row.count * row.length, 0); if (expected > 128 * 1024 * 1024) throw Error('Decoded PNG pixels exceed their budget'); let pixels; try { pixels = zlib.inflateSync(Buffer.concat(data), { maxOutputLength: expected }); } catch { throw Error('Invalid PNG compressed pixels'); } if (pixels.length !== expected) throw Error('PNG pixel dimensions do not match its data'); let rowOffset = 0; for (const row of rows) for (let index = 0; index < row.count; index++) { if (pixels[rowOffset] > 4) throw Error('Invalid PNG row filter'); rowOffset += row.length; } return { mime: 'image/png', extension: 'png', kind: 'image' };
  }
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[bytes.length - 2] === 255 && bytes[bytes.length - 1] === 217) return { mime: 'image/jpeg', extension: 'jpg', kind: 'image' };
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' && bytes.readUInt32LE(4) + 8 === bytes.length) return { mime: 'image/webp', extension: 'webp', kind: 'image' };
  if (bytes.toString('ascii', 4, 8) === 'ftyp') { let offset = 0, video = false, data = false; while (offset + 8 <= bytes.length) { const size = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8); if (size < 8 || offset + size > bytes.length) throw Error('Unsupported/incomplete MP4 box'); if (type === 'moov') video = true; if (type === 'mdat') data = true; offset += size; } if (!video || !data || offset !== bytes.length) throw Error('Incomplete MP4 media'); return { mime: 'video/mp4', extension: 'mp4', kind: 'video' }; }
  if (bytes.readUInt32BE(0) === 0x1a45dfa3 && bytes.includes(Buffer.from('webm')) && bytes.includes(Buffer.from([0x18, 0x53, 0x80, 0x67]))) return { mime: 'video/webm', extension: 'webm', kind: 'video' };
  if (bytes.readUInt32LE(0) === 0x46546c67) { if (bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length || bytes.readUInt32LE(16) !== 0x4e4f534a) throw Error('Invalid GLB container'); const length = bytes.readUInt32LE(12); if (length > 8 * 1024 * 1024 || length % 4 || 20 + length > bytes.length) throw Error('Invalid GLB JSON bounds'); let model; try { model = JSON.parse(bytes.toString('utf8', 20, 20 + length)); } catch { throw Error('Invalid GLB JSON'); } if (model.asset?.version !== '2.0' || !Array.isArray(model.meshes) || !model.meshes.length || !Array.isArray(model.accessors) || !Array.isArray(model.buffers)) throw Error('GLB has no usable model geometry'); for (const resource of [...model.buffers, ...(model.images || [])]) if (resource.uri && !/^data:[A-Za-z0-9+./-]+;base64,[A-Za-z0-9+/=]+$/.test(resource.uri)) throw Error('GLB must contain its own resources; external/relative buffers and textures are unsupported'); let offset = 20 + length, binarySize = 0; while (offset < bytes.length) { if (offset + 8 > bytes.length) throw Error('Truncated GLB chunk'); const size = bytes.readUInt32LE(offset); if (size % 4 || offset + size + 8 > bytes.length) throw Error('Invalid GLB binary bounds'); if (bytes.readUInt32LE(offset + 4) === 0x004e4942) binarySize += size; offset += size + 8; } for (const buffer of model.buffers) if (!Number.isInteger(buffer.byteLength) || buffer.byteLength < 1 || !buffer.uri && buffer.byteLength > binarySize) throw Error('GLB buffer is incomplete'); return { mime: 'model/gltf-binary', extension: 'glb', kind: 'model' }; }
  throw Error('Generated bytes are not a supported PNG/JPEG/WebP/MP4/WebM/GLB asset');
}
function createAssetService(options) {
  const root = options?.root; if (typeof root !== 'string' || !path.isAbsolute(root)) throw Error('Asset service requires a trusted absolute runtime root');
  const directory = path.resolve(root); for (let current = directory; ; current = path.dirname(current)) { if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw Error('Linked asset runtime roots are unsupported'); if (path.dirname(current) === current) break; } fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const fetcher = options.fetch || globalThis.fetch, pollInterval = options.pollIntervalMs ?? 1000, requestTimeout = options.requestTimeoutMs ?? 30000;
  if (typeof fetcher !== 'function' || !Number.isInteger(pollInterval) || pollInterval < 10 || !Number.isInteger(requestTimeout) || requestTimeout < 10 || requestTimeout > 600000) throw Error('Invalid asset service transport options');
  let disposed = false, fatalError, providers = {}, tasks = {}, canvases = {}, inputs = {}; const jobs = new Map(), timers = new Map(), secretValues = new Set();
  function checked(file, existing = false) {
    const full = path.resolve(directory, file); if (full !== directory && !full.startsWith(directory + path.sep)) throw Error('Asset storage path escaped its owner');
    for (let current = full; ; current = path.dirname(current)) { if (fs.existsSync(current)) { const stat = fs.lstatSync(current); if (stat.isSymbolicLink() || stat.isFile() && stat.nlink !== 1) throw Error('Linked asset runtime storage is unsupported'); } if (path.dirname(current) === current) break; }
    if (existing && !fs.statSync(full).isFile()) throw Error('Asset resource is not a regular file'); return full;
  }
  checked('');
  let owner;
  function atomic(file, bytes) { owner?.assert(); const full = checked(file); fs.mkdirSync(path.dirname(full), { recursive: true, mode: 0o700 }); checked(file); const temp = checked(file + '.tmp-' + crypto.randomUUID()); let handle; try { handle = fs.openSync(temp, 'wx', 0o600); fs.writeFileSync(handle, bytes); fs.fsyncSync(handle); fs.closeSync(handle); handle = undefined; checked(file); owner?.assert(); fs.renameSync(temp, full); } finally { if (handle !== undefined) fs.closeSync(handle); if (fs.existsSync(temp)) fs.unlinkSync(temp); } }
  function read(file, fallback) { const full = checked(file); if (!fs.existsSync(full)) return fallback; checked(file, true); if (fs.statSync(full).size > 64 * 1024 * 1024) throw Error('Asset state store exceeds 64 MiB'); return JSON.parse(fs.readFileSync(full)); }
  owner = acquireOwner(directory, checked);
  try {
  const masterFile = checked('master.key'); if (!fs.existsSync(masterFile)) fs.writeFileSync(masterFile, crypto.randomBytes(32), { flag: 'wx', mode: 0o600 }); checked('master.key', true); if (fs.statSync(masterFile).size !== 32) throw Error('Asset master key is invalid'); const master = fs.readFileSync(masterFile);
  function encrypt(value) { secretValues.add(value); const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', master, iv), bytes = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]); return { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: bytes.toString('base64') }; }
  function decrypt(value) { if (!value) return ''; const decipher = crypto.createDecipheriv('aes-256-gcm', master, Buffer.from(value.iv, 'base64')); decipher.setAuthTag(Buffer.from(value.tag, 'base64')); const result = Buffer.concat([decipher.update(Buffer.from(value.data, 'base64')), decipher.final()]).toString('utf8'); secretValues.add(result); return result; }
  function scrub(value) { if (typeof value === 'string') { let result = value; for (const provider of Object.values(providers)) decrypt(provider._key); for (const key of secretValues) if (key) result = result.replaceAll(key, '<redacted>'); return result; } if (Array.isArray(value)) return value.map(scrub); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, SECRET_FIELD.test(key) ? '<redacted>' : scrub(item)])); return value; }
  function persist() { const bytes = Buffer.from(JSON.stringify(tasks)); if (bytes.length > 64 * 1024 * 1024) throw Error('Task history exceeds 64 MiB'); atomic('tasks.json', bytes); }
  function publicProvider(provider) { const { _key, ...rest } = provider; return scrub({ ...rest, apiKeyConfigured: !!_key }); }
  function publicTask(task) { const result = {}; for (const [key, value] of Object.entries(task)) if (!key.startsWith('_')) result[key] = key === 'artifacts' ? value.map(artifact => Object.fromEntries(Object.entries(artifact).filter(([name]) => !name.startsWith('_')))) : value; return scrub(result); }
  function changed(task) { task.updatedTime = new Date().toISOString(); persist(); try { Promise.resolve(options.onUpdate?.(publicTask(task))).catch(() => {}); } catch {} }
  function taskById(taskId) { id(taskId, 'taskId'); const task = Object.prototype.hasOwnProperty.call(tasks, taskId) && tasks[taskId]; if (!task) throw Error('Owned task not found'); return task; }
  function inputScope(value) { return value ? text(value, 'workspaceKey', 2048, true) : ''; }
  function inputById(inputId, workspaceKey) { id(inputId, 'inputId'); const input = Object.prototype.hasOwnProperty.call(inputs, inputId) && inputs[inputId]; if (!input || input.workspaceKey !== inputScope(workspaceKey)) throw Error('Owned input not found in this workspace'); return input; }
  function publicInput(input) { return scrub(Object.fromEntries(Object.entries(input).filter(([key]) => !key.startsWith('_')))); }
  function inputFile(inputId, workspaceKey) { const input = inputById(inputId, workspaceKey), file = checked(input._file, true), stat = fs.statSync(file); if (stat.size !== input.byteLength || stat.size > MAX_FILE) throw Error('Reference input integrity check failed'); const bytes = fs.readFileSync(file); if (sha(bytes) !== input.sha256) throw Error('Reference input integrity check failed'); return { input, file, bytes }; }
  function registerInput(data) {
    if (disposed || fatalError) throw Error('Asset runtime is unavailable'); owner.assert();
    const inputId = id(data.inputId, 'inputId'); if (!/^i_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(inputId)) throw Error('Input registration requires a native generated identity');
    const workspaceKey = inputScope(data.workspaceKey), originalName = text(data.filename, 'filename', 255, true);
    if (data.path !== undefined || !Number.isInteger(data.byteLength) || data.byteLength < 1 || data.byteLength > MAX_FILE || typeof data.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(data.sha256)) throw Error('Invalid native input registration metadata');
    if (Object.prototype.hasOwnProperty.call(inputs, inputId)) { const existing = inputFile(inputId, workspaceKey).input; if (existing.byteLength !== data.byteLength || existing.sha256 !== data.sha256) throw Error('Input identity was already registered with different bytes'); return { input: publicInput(existing) }; }
    if (Object.keys(inputs).length >= 2048 || Object.values(inputs).reduce((sum, item) => sum + item.byteLength, 0) + data.byteLength > 4 * 1024 * 1024 * 1024) throw Error('Reference input storage limit reached; remove unused inputs');
    const staged = checked(path.join('incoming', inputId + '.bin'), true); if (fs.statSync(staged).size !== data.byteLength) throw Error('Native input byte length changed'); const bytes = fs.readFileSync(staged); if (sha(bytes) !== data.sha256) throw Error('Native input checksum changed'); const actual = mediaType(bytes);
    const basename = path.posix.basename(path.win32.basename(originalName)), stem = path.parse(basename).name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/[. ]+$/, '').slice(0, 100) || 'reference';
    const input = { id: inputId, filename: stem + '.' + actual.extension, mime: actual.mime, kind: actual.kind, byteLength: bytes.length, sha256: data.sha256, workspaceKey, createdTime: new Date().toISOString(), _file: path.join('inputs', inputId + '.' + actual.extension) }, next = { ...inputs, [inputId]: input };
    checked('inputs.json'); const destination = checked(input._file); if (fs.existsSync(destination)) throw Error('Reference input destination already exists'); atomic(input._file, bytes);
    try { atomic('inputs.json', Buffer.from(JSON.stringify(next))); } catch (error) { try { const file = checked(input._file, true); if (sha(fs.readFileSync(file)) === input.sha256) fs.unlinkSync(file); } catch {} throw error; }
    inputs = next; return { input: publicInput(input) };
  }
  function deleteInput(data) {
    const input = inputById(data.inputId, data.workspaceKey); if (Object.values(tasks).some(task => task.inputs?.some(reference => reference.id === input.id))) throw Error('Reference input is retained by generation history');
    const { file } = inputFile(input.id, input.workspaceKey), staged = checked(path.join('inputs', '.delete-' + input.id + '-' + crypto.randomUUID()));
    const next = { ...inputs }; delete next[input.id]; const before = Buffer.from(JSON.stringify(inputs));
    // A native preview denies FILE_SHARE_DELETE. Test that rename first, while
    // the original metadata still exists, rather than losing the retry handle.
    owner.assert(); fs.renameSync(file, staged); let committed = false;
    try { atomic('inputs.json', Buffer.from(JSON.stringify(next))); committed = true; fs.unlinkSync(checked(staged, true)); inputs = next; return { deleted: true }; }
    catch (error) {
      try {
        const rollback = checked(staged, true); if (fs.existsSync(checked(input._file)) || fs.statSync(rollback).size !== input.byteLength || sha(fs.readFileSync(rollback)) !== input.sha256) throw Error('Reference input changed while restoring failed deletion');
        owner.assert(); fs.renameSync(rollback, file); if (committed) atomic('inputs.json', before);
      } catch (recoveryError) { fatalError = Error('Reference input deletion recovery is required: ' + recoveryError.message); throw Error(error.message + '; ' + fatalError.message); }
      throw error;
    }
  }
  function normalizeSpec(value, fallback) {
    const specification = value || fallback; if (!specification || typeof specification !== 'object') throw Error('Provider route configuration is required'); const method = text(specification.method || fallback?.method || 'GET', 'method', 16, true).toUpperCase(), route = text(specification.path, 'route path', 2048, true); if (!METHODS.has(method)) throw Error('Unsupported HTTP method'); endpoint({ baseUrl: 'http://127.0.0.1' }, { path: route }, 'owned-id');
    const bodyType = specification.bodyType || 'json'; if (!['json', 'multipart'].includes(bodyType)) throw Error('Provider body type must be json or multipart'); if (bodyType === 'multipart' && method === 'GET') throw Error('Multipart requests require a body-capable HTTP method'); const result = { method, path: route, bodyType };
    if (specification.bodyTemplate !== undefined) { result.bodyTemplate = boundedJson(specification.bodyTemplate, 65536); render(result.bodyTemplate, { kind: 'image', model: 'owned-model', prompt: 'owned-prompt', parameters: {}, taskId: 'owned-id', workspaceKey: 'default', inputs: Array.from({ length: 8 }, (_, index) => ({ id: 'i_' + index, filename: 'reference.png', mime: 'image/png', kind: 'image', byteLength: 3, sha256: '0'.repeat(64), base64: 'YWJj', dataUrl: 'data:image/png;base64,YWJj' })) }); }
    if (bodyType === 'multipart') { if (result.bodyTemplate !== undefined && (!result.bodyTemplate || typeof result.bodyTemplate !== 'object' || Array.isArray(result.bodyTemplate))) throw Error('Multipart bodyTemplate must be a fields object'); const fields = specification.fileFields || []; if (!Array.isArray(fields) || fields.length > 8) throw Error('Multipart supports at most eight file fields'); result.fileFields = fields.map(field => { if (!field || typeof field !== 'object' || typeof field.name !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.\[\]-]{0,127}$/.test(field.name) || SECRET_FIELD.test(field.name) || field.inputIndex !== 'all' && (!Number.isInteger(field.inputIndex) || field.inputIndex < 0 || field.inputIndex > 7)) throw Error('Invalid multipart file field mapping'); return { name: field.name, inputIndex: field.inputIndex }; }); }
    else if (specification.fileFields !== undefined && (!Array.isArray(specification.fileFields) || specification.fileFields.length)) throw Error('File fields require multipart body type');
    return result;
  }
  function saveProvider(input) {
    const value = input?.provider; if (!value || typeof value !== 'object') throw Error('provider object is required'); const providerId = value.id ? id(value.id, 'providerId') : 'p_' + crypto.randomUUID(), previous = Object.prototype.hasOwnProperty.call(providers, providerId) && providers[providerId];
    if (Object.keys(providers).length >= 64 && !previous) throw Error('Provider limit is 64');
    if (value.allowInsecureLan !== undefined && typeof value.allowInsecureLan !== 'boolean') throw Error('LAN authorization must be an explicit boolean');
    const allowInsecureLan = value.allowInsecureLan ?? previous?.allowInsecureLan ?? false;
    const rawBase = text(value.baseUrl, 'baseUrl', 2048, true);
    const lanLiteral = /^http:\/\/((?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3})(?::\d+)?(?:\/|$)/i.exec(rawBase);
    const base = safeUrl(rawBase, undefined, allowInsecureLan && lanLiteral ? new URL(rawBase).origin : undefined); if (base.search) throw Error('API credentials/query values belong in route/auth configuration, not baseUrl');
    const timeoutMs = value.requestTimeoutMs ?? previous?.requestTimeoutMs;
    if (timeoutMs !== undefined && (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 600000)) throw Error('Provider requestTimeoutMs must be 1000..600000');
    const kinds = [...new Set(value.kinds || [])]; if (!kinds.length || kinds.length > 3 || kinds.some(kind => !KINDS.has(kind))) throw Error('Provider kinds must contain image, video or model');
    const authMode = value.authMode || 'none'; if (!['none', 'bearer', 'header'].includes(authMode)) throw Error('Unsupported authentication mode');
    const apiKeyHeader = value.apiKeyHeader || 'X-API-Key'; if (!/^[A-Za-z][A-Za-z0-9-]{0,63}$/.test(apiKeyHeader) || /^(host|cookie|content-type|content-length|transfer-encoding|proxy-authorization)$/i.test(apiKeyHeader)) throw Error('Unsafe API key header');
    const adapter = value.adapter || {}, selectors = { taskId: 'id', status: 'status', progress: 'progress', outputs: 'outputs', error: 'error', ...(adapter.selectors || {}) };
    for (const [name, selector] of Object.entries(selectors)) { if (!['taskId', 'status', 'progress', 'outputs', 'error'].includes(name)) throw Error('Unknown response selector'); text(selector, 'selector', 256, true); if (selector.split(/[/.]/).some(part => ['__proto__', 'prototype', 'constructor'].includes(part))) throw Error('Unsafe response selector'); }
    const responseMode = adapter.responseMode || 'task'; if (!['task', 'outputs'].includes(responseMode)) throw Error('Provider response mode must be task or outputs');
    const outputSelectors = { ...DEFAULT_OUTPUT_SELECTORS, ...(adapter.outputSelectors || {}) };
    for (const [name, selector] of Object.entries(outputSelectors)) { if (!Object.prototype.hasOwnProperty.call(DEFAULT_OUTPUT_SELECTORS, name)) throw Error('Unknown output selector'); text(selector, 'output selector', 256); if (selector.split(/[/.]/).some(part => ['__proto__', 'prototype', 'constructor'].includes(part))) throw Error('Unsafe output selector'); }
    if (!outputSelectors.url && !outputSelectors.base64) throw Error('An output URL or base64 selector is required');
    const map = {}, seenStates = new Map(); for (const state of ['queued', 'running', 'completed', 'failed', 'cancelled']) { const raw = adapter.statusMap?.[state] || DEFAULT_MAP[state]; if (!Array.isArray(raw) || !raw.length || raw.length > 32) throw Error('Status map must contain bounded raw-state arrays'); map[state] = raw.map(item => text(item, 'raw status', 100, true).trim().toLowerCase()); for (const value of map[state]) { if (seenStates.has(value) && seenStates.get(value) !== state) throw Error('Provider status mappings must not overlap'); seenStates.set(value, state); } }
    const provider = { id: providerId, name: text(value.name || providerId, 'name', 128, true), kinds, baseUrl: base.toString().replace(/\/+$/, ''), model: text(value.model || '', 'model', 256), enabled: value.enabled !== false, authMode, apiKeyHeader, adapter: { create: normalizeSpec(adapter.create, { method: 'POST', path: '/tasks', bodyTemplate: DEFAULT_BODY }), poll: normalizeSpec(adapter.poll, { method: 'GET', path: '/tasks/{{taskId}}' }), cancel: adapter.cancel === null ? null : normalizeSpec(adapter.cancel, { method: 'DELETE', path: '/tasks/{{taskId}}' }), selectors, statusMap: map, responseMode, outputSelectors } };
    if (allowInsecureLan) provider.allowInsecureLan = true;
    if (timeoutMs !== undefined) provider.requestTimeoutMs = timeoutMs;
    provider._key = value.clearApiKey === true ? undefined : typeof value.apiKey === 'string' && value.apiKey.length ? encrypt(text(value.apiKey, 'apiKey', 8192, true)) : previous?._key;
    const key = decrypt(provider._key); if (key) { const hasKey = item => typeof item === 'string' ? item.includes(key) : Array.isArray(item) ? item.some(hasKey) : item && typeof item === 'object' ? Object.values(item).some(hasKey) : false; const { _key, ...metadata } = provider; if (hasKey(metadata)) throw Error('API keys must not be embedded in Provider metadata, endpoint paths or templates'); }
    const next = { ...providers, [providerId]: provider }; const old = providers; providers = next; try { atomic('providers.json', Buffer.from(JSON.stringify(providers))); } catch (error) { providers = old; throw error; }
    const executionConfig = item => stableJson({ ...item, name: undefined, _key: undefined, adapter: { ...item.adapter, create: { ...item.adapter.create, bodyType: item.adapter.create.bodyType || 'json' }, poll: { ...item.adapter.poll, bodyType: item.adapter.poll.bodyType || 'json' }, cancel: item.adapter.cancel ? { ...item.adapter.cancel, bodyType: item.adapter.cancel.bodyType || 'json' } : null, responseMode: item.adapter.responseMode || 'task', outputSelectors: { ...DEFAULT_OUTPUT_SELECTORS, ...(item.adapter.outputSelectors || {}) } } });
    if (previous && (executionConfig(previous) !== executionConfig(provider) || decrypt(previous._key) !== decrypt(provider._key))) for (const task of Object.values(tasks)) if (task.providerId === providerId && !TERMINAL.has(task.status)) { stopJob(task.id); task.mayContinue = task._phase !== 'create_pending'; task.remoteCancellationConfirmed = false; task.status = 'interrupted'; task.error = task.mayContinue ? 'Provider configuration changed; an already submitted remote task may continue' : 'Provider configuration changed before the task was submitted'; changed(task); }
    return { provider: publicProvider(provider) };
  }
  function stopJob(taskId) { const timer = timers.get(taskId); if (timer) clearTimeout(timer); timers.delete(taskId); const job = jobs.get(taskId); if (job) job.controller.abort(); jobs.delete(taskId); }
  function schedule(task, delay = 0) { if (disposed || fatalError || TERMINAL.has(task.status) || jobs.has(task.id) || timers.has(task.id)) return; const timer = setTimeout(() => { timers.delete(task.id); work(task).catch(error => { fatalError = error; for (const timer of timers.values()) clearTimeout(timer); timers.clear(); for (const job of jobs.values()) job.controller.abort(); jobs.clear(); }); }, delay); timers.set(task.id, timer); }
  function headers(provider, url, json = false) { const result = {}; if (json) result['Content-Type'] = 'application/json'; if (url.origin === new URL(provider.baseUrl).origin) { const key = decrypt(provider._key); if (provider.authMode === 'bearer' && key) result.Authorization = 'Bearer ' + key; else if (provider.authMode === 'header' && key) result[provider.apiKeyHeader] = key; } return result; }
  async function request(url, init, signal, limit = MAX_JSON, timeoutMs = requestTimeout) {
    const controller = new AbortController(), abort = () => controller.abort(signal?.reason), timer = setTimeout(() => controller.abort(Error('Provider request deadline exceeded')), timeoutMs);
    if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    try { const response = await fetcher(url, { ...init, redirect: 'manual', signal: controller.signal }); const length = Number(response.headers.get('content-length')); if (Number.isFinite(length) && length > limit) { await response.body?.cancel(); throw Error('Provider response exceeds its byte budget'); } let count = 0, chunks = []; if (response.body) { const reader = response.body.getReader(); try { for (;;) { const { done, value } = await reader.read(); if (done) break; count += value.length; if (count > limit) { await reader.cancel(); throw Error('Provider response exceeds its byte budget'); } chunks.push(Buffer.from(value)); } } finally { reader.releaseLock(); } } return { status: response.status, headers: response.headers, bytes: Buffer.concat(chunks) }; } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  }
  async function call(provider, specification, task, signal) {
    let url, body, json;
    try {
      url = endpoint(provider, specification, task._remoteId); const cache = new Map();
      const inputBytes = index => { const snapshot = task.inputs?.[index]; if (!snapshot) throw Error('Reference input index is unavailable'); if (!cache.has(index)) { const loaded = inputFile(snapshot.id, task.workspaceKey); if (loaded.input.sha256 !== snapshot.sha256 || loaded.input.byteLength !== snapshot.byteLength) throw Error('Reference input snapshot changed'); cache.set(index, loaded.bytes); } return cache.get(index); };
      const variables = { kind: task.kind, model: task.model, prompt: task.prompt, parameters: task.parameters, taskId: task._remoteId || '', workspaceKey: task.workspaceKey || '', inputs: (task.inputs || []).map((input, index) => { let encoded; const base64 = () => encoded ?? (encoded = inputBytes(index).toString('base64')); return Object.defineProperties({ ...input }, { base64: { enumerable: true, get: base64 }, dataUrl: { enumerable: true, get: () => 'data:' + input.mime + ';base64,' + base64() } }); }) };
      if (specification.method !== 'GET') {
        if (specification.bodyType === 'multipart') {
          body = new FormData(); let size = 0; const fields = specification.bodyTemplate === undefined ? {} : render(specification.bodyTemplate, variables); if (!fields || typeof fields !== 'object' || Array.isArray(fields)) throw Error('Rendered multipart fields must be an object');
          for (const [name, value] of Object.entries(fields)) { if (!/^[A-Za-z0-9][A-Za-z0-9_.\[\]-]{0,127}$/.test(name)) throw Error('Invalid multipart text field name'); const field = typeof value === 'string' ? value : JSON.stringify(value); size += Buffer.byteLength(field) + Buffer.byteLength(name) + 1024; if (size > MAX_JSON) throw Error('Provider multipart body exceeds 96 MiB'); body.append(name, field); }
          for (const field of specification.fileFields || []) for (const index of field.inputIndex === 'all' ? (task.inputs || []).map((_, index) => index) : [field.inputIndex]) { const bytes = inputBytes(index), input = task.inputs[index]; size += bytes.length + Buffer.byteLength(input.filename) + 1024; if (size > MAX_JSON) throw Error('Provider multipart body exceeds 96 MiB'); body.append(field.name, new Blob([bytes], { type: input.mime }), input.filename); }
        } else if (specification.bodyTemplate !== undefined) { json = true; body = JSON.stringify(render(specification.bodyTemplate, variables)); if (Buffer.byteLength(body) > (task.inputs?.length ? MAX_JSON : 16 * 1024 * 1024)) throw Error('Provider request body exceeds its byte budget'); }
      }
    } catch (error) { error.beforeRequest = true; throw error; }
    const result = await request(url, { method: specification.method, headers: headers(provider, url, !!json), ...(body !== undefined ? { body } : {}) }, signal, MAX_JSON, provider.requestTimeoutMs ?? requestTimeout);
    if (result.status < 200 || result.status >= 300) { let detail = result.bytes.toString('utf8').slice(0, 1000); try { detail = JSON.stringify(scrub(JSON.parse(detail))); } catch { detail = scrub(detail); } const error = Error('Provider HTTP ' + result.status + ': ' + detail); error.httpStatus = result.status; throw error; }
    let response; try { response = JSON.parse(result.bytes); } catch { throw Error('Provider response is not JSON'); } return response;
  }
  function remoteState(provider, response) { const raw = select(response, provider.adapter.selectors.status); if (typeof raw !== 'string') return null; const normal = raw.trim().toLowerCase(); return Object.keys(provider.adapter.statusMap).find(key => provider.adapter.statusMap[key].includes(normal)) || null; }
  async function download(provider, value, signal) {
    const origin = new URL(provider.baseUrl).origin, allowedLanOrigin = provider.allowInsecureLan === true ? origin : undefined;
    let url = safeUrl(value, undefined, allowedLanOrigin);
    for (let index = 0; index < 4; index++) {
      if (url.origin !== origin) { if (url.protocol !== 'https:') throw Error('Cross-origin outputs require HTTPS'); const host = url.hostname.replace(/^\[|\]$/g, ''); const addresses = await dns.lookup(host, { all: true }); if (addresses.some(({ address }) => /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.|2(2[4-9]|3\d|4\d|5[0-5])\.|::(?:$|1$|ffff:)|f[cd]|fe80:)/i.test(address))) throw Error('Output URLs must not target private/local infrastructure'); }
      const result = await request(url, { method: 'GET', headers: headers(provider, url) }, signal, MAX_FILE, provider.requestTimeoutMs ?? requestTimeout);
      if ([301, 302, 303, 307, 308].includes(result.status)) { const location = result.headers.get('location'); if (!location) throw Error('Output redirect has no location'); url = safeUrl(location, url, allowedLanOrigin); continue; }
      if (result.status < 200 || result.status >= 300) throw Error('Output download HTTP ' + result.status); return { bytes: result.bytes, mime: result.headers.get('content-type')?.split(';')[0].trim().toLowerCase() };
    }
    throw Error('Output redirect budget exceeded');
  }
  async function collect(task, provider, response, job) {
    const rows = select(response, provider.adapter.selectors.outputs); if (!Array.isArray(rows) || !rows.length || rows.length > 8) throw Error('Completed Provider task requires 1..8 actual output files');
    task._phase = 'download'; changed(task);
    for (let index = 0; index < rows.length; index++) {
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      if (task.artifacts.some(artifact => artifact._outputIndex === index)) continue;
      const raw = rows[index]; if (!raw || typeof raw !== 'object') throw Error('Provider output must be an object'); const row = Object.fromEntries(Object.entries(provider.adapter.outputSelectors || DEFAULT_OUTPUT_SELECTORS).map(([name, selector]) => [name, select(raw, selector)])); let result;
      if (typeof row.base64 === 'string') { if (row.base64.length > Math.ceil(MAX_FILE / 3) * 4 + 4 || !validBase64(row.base64)) throw Error('Invalid/oversized base64 output'); result = { bytes: Buffer.from(row.base64, 'base64'), mime: row.mime }; }
      else if (typeof row.url === 'string') result = await download(provider, text(row.url, 'output URL', 8192, true), job.controller.signal);
      else throw Error('Provider output requires an actual URL or base64 bytes');
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      if (!result.bytes.length || result.bytes.length > MAX_FILE) throw Error('Generated file exceeds 64 MiB or is empty'); const actual = mediaType(result.bytes);
      // Object stores may supply a generic binary Content-Type. Both explicit
      // output metadata and transport media types must still match actual bytes.
      for (const declared of [row.mime, result.mime]) if (declared) { if (typeof declared !== 'string') throw Error('Generated MIME must be a string'); const mime = declared.split(';')[0].trim().toLowerCase(); if (mime !== 'application/octet-stream' && mime !== actual.mime) throw Error('Generated MIME does not match actual media bytes'); }
      if (actual.kind !== task.kind && !(task.kind !== 'image' && actual.kind === 'image')) throw Error('Generated output kind does not match the task');
      const artifactId = 'a_' + crypto.randomUUID(), filename = typeof row.filename === 'string' ? row.filename.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 120) : 'output-' + (index + 1) + '.' + actual.extension;
      const relative = path.join('assets', task.id, artifactId + '.' + actual.extension); atomic(relative, result.bytes);
      const dimensions = actual.mime === 'image/png' ? { width: result.bytes.readUInt32BE(16), height: result.bytes.readUInt32BE(20) } : {};
      task.artifacts.push({ id: artifactId, filename, mime: actual.mime, kind: actual.kind, byteLength: result.bytes.length, sha256: sha(result.bytes), ...dimensions, _file: relative, _outputIndex: index }); changed(task);
    }
    if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return; if (!task.artifacts.some(artifact => artifact.kind === task.kind)) throw Error('Provider returned no actual primary asset for this task kind'); task.status = 'completed'; task.progress = 100; task._phase = 'terminal'; if (task.cancelRequested) task.mayContinue = false; delete task.error; changed(task);
  }
  async function work(task) {
    if (disposed || TERMINAL.has(task.status) || jobs.has(task.id)) return; const provider = providers[task.providerId];
    if (!provider?.enabled || provider.authMode !== 'none' && !provider._key) { task.mayContinue = task._phase !== 'create_pending'; task.status = 'interrupted'; task.error = 'The task Provider is disabled, unavailable or missing its API key'; changed(task); return; }
    const job = { controller: new AbortController() }; jobs.set(task.id, job); let creating = !task._remoteId;
    try {
      if (creating && task._phase !== 'create_pending') { task.status = 'interrupted'; task.mayContinue = true; task.error = 'Create outcome is unknown; it will not be automatically submitted again'; changed(task); return; }
      if (creating) { task._phase = 'create_inflight'; changed(task); }
      const response = await call(provider, creating ? provider.adapter.create : provider.adapter.poll, task, job.controller.signal);
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      const remote = select(response, provider.adapter.selectors.taskId); if (provider.adapter.responseMode !== 'outputs' && typeof remote === 'string' && remote && remote.length <= 2048 && !/[\u0000-\u001f]/.test(remote)) task._remoteId = remote;
      let state = remoteState(provider, response); const progress = select(response, provider.adapter.selectors.progress), rawState = select(response, provider.adapter.selectors.status);
      // A configured synchronous response has no job ID/status. Actual bounded
      // output collection is still mandatory; pending/unknown states stay honest.
      if (creating && provider.adapter.responseMode === 'outputs' && rawState == null) state = 'completed';
      if (Number.isFinite(progress)) task.progress = Math.max(0, Math.min(100, progress));
      if (state === 'completed') { task.status = task.cancelRequested ? 'cancel_requested' : 'running'; task._phase = 'download'; changed(task); await collect(task, provider, response, job); }
      else if (state === 'failed') { task.status = 'failed'; task.mayContinue = false; task._phase = 'terminal'; const error = select(response, provider.adapter.selectors.error); task.error = scrub(typeof error === 'string' ? error : error?.message || 'Provider task failed'); changed(task); }
      else if (state === 'cancelled') { task.status = 'cancelled'; task._phase = 'terminal'; task.remoteCancellationConfirmed = true; task.mayContinue = false; changed(task); }
      else {
        if (!task._remoteId) { task.status = 'interrupted'; task.mayContinue = true; task.error = 'Provider response has no usable remote task ID; create will not be submitted again'; changed(task); }
        else { task._phase = 'remote_poll'; task.status = task.cancelRequested ? 'cancel_requested' : state || task.status; if (!state) task.error = 'Provider status is missing or unknown; completion is not assumed'; else delete task.error; changed(task); }
      }
    } catch (error) {
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      if (task._phase === 'download') { task.status = 'failed'; task.mayContinue = false; task._phase = 'terminal'; task.error = scrub(error.message); }
      else if (creating) { const rejected = error.httpStatus || error.beforeRequest; task.status = rejected ? 'failed' : 'interrupted'; task.mayContinue = !rejected; task._phase = 'terminal'; task.error = scrub(error.message + (rejected ? '' : '; create outcome is unknown and will not be resubmitted')); }
      else { task.error = scrub(error.message); task._phase = 'remote_poll'; }
      changed(task);
    } finally { if (jobs.get(task.id) === job) { jobs.delete(task.id); if (!disposed && !TERMINAL.has(task.status) && task._remoteId) schedule(task, pollInterval); } }
  }
  function createTask(data) {
    const providerId = id(data.providerId, 'providerId'), workspaceKey = data.workspaceKey ? text(data.workspaceKey, 'workspaceKey', 2048, true) : '', prompt = scrub(text(data.prompt, 'prompt', 32000, true)), requestedModel = data.model == null ? undefined : scrub(text(data.model, 'model', 256)), parameters = scrub(boundedJson(data.parameters || {}, 16 * 1024 * 1024));
    if (!KINDS.has(data.kind)) throw Error('Provider does not support this task kind');
    const inputIds = data.inputIds === undefined ? [] : data.inputIds; if (!Array.isArray(inputIds) || inputIds.length > 8 || new Set(inputIds).size !== inputIds.length) throw Error('Reference inputIds must contain at most eight distinct owned IDs'); inputIds.forEach(value => id(value, 'inputId')); if (data.inputs !== undefined || data.inputPaths !== undefined) throw Error('Reference inputs must use registered inputIds, never client paths or metadata');
    let idempotency;
    if (data.idempotencyKey !== undefined) {
      const key = text(data.idempotencyKey, 'idempotencyKey', 128, true); if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(key) || scrub(key) !== key) throw Error('Idempotency key must be bounded non-secret ASCII text');
      const requestSha256 = sha(stableJson({ kind: data.kind, prompt, model: requestedModel ?? null, parameters, ...(inputIds.length ? { inputIds } : {}) }));
      const existing = Object.values(tasks).find(task => task.providerId === providerId && (task.workspaceKey || '') === workspaceKey && task._idempotency?.key === key);
      if (existing) { if (existing._idempotency.requestSha256 !== requestSha256) throw Error('Idempotency key conflicts with an existing generation request'); return { task: publicTask(existing) }; }
      idempotency = { key, requestSha256 };
    }
    const provider = Object.prototype.hasOwnProperty.call(providers, providerId) && providers[providerId]; if (!provider?.enabled || provider.authMode !== 'none' && !provider._key) throw Error('Provider is unavailable, disabled or missing its API key'); if (!provider.kinds.includes(data.kind)) throw Error('Provider does not support this task kind');
    const taskInputs = inputIds.map(inputId => { const input = inputFile(inputId, workspaceKey).input; return Object.fromEntries(Object.entries(input).filter(([key]) => !key.startsWith('_'))); });
    if (taskInputs.reduce((sum, input) => sum + input.byteLength, 0) > MAX_FILE) throw Error('Reference inputs exceed the combined 64 MiB budget');
    const create = provider.adapter.create, used = inputTemplateIndexes(create.bodyTemplate, taskInputs.length);
    if (create.bodyType === 'multipart') for (const field of create.fileFields || []) { if (field.inputIndex === 'all') taskInputs.forEach((_, index) => used.add(index)); else { if (field.inputIndex >= taskInputs.length) throw Error('Multipart file field references an unavailable input index'); used.add(field.inputIndex); } }
    if (taskInputs.length && (create.method === 'GET' || taskInputs.some((_, index) => !used.has(index)))) throw Error('Provider create template/file fields must send every selected reference input');
    if (Object.keys(tasks).length >= 5000 || Object.values(tasks).filter(task => !TERMINAL.has(task.status)).length >= 16) throw Error('Task history/active-task limit reached');
    const now = new Date().toISOString(), task = { id: 't_' + crypto.randomUUID(), providerId: provider.id, kind: data.kind, prompt, model: requestedModel ?? scrub(text(provider.model, 'model', 256)), parameters, inputs: taskInputs, ...(workspaceKey ? { workspaceKey } : {}), status: 'queued', progress: 0, createdTime: now, updatedTime: now, discarded: false, artifacts: [], _phase: 'create_pending', ...(idempotency ? { _idempotency: idempotency } : {}) };
    task.input = { data: { prompt: task.prompt }, param: task.parameters }; tasks[task.id] = task; try { persist(); } catch (error) { delete tasks[task.id]; throw error; } schedule(task); return { task: publicTask(task) };
  }
  async function cancelTask(data) {
    const task = taskById(data.taskId); if (TERMINAL.has(task.status)) return { task: publicTask(task), remoteCancellationConfirmed: task.remoteCancellationConfirmed === true, mayContinue: task.mayContinue === true };
    const pending = jobs.get(task.id); if (pending?.kind === 'cancel') return pending.promise;
    stopJob(task.id); task.cancelRequested = true;
    if (!task._remoteId && task._phase === 'create_pending' || task._phase === 'download') { task.status = 'cancelled'; task._phase = 'terminal'; task.remoteCancellationConfirmed = false; task.mayContinue = false; changed(task); return { task: publicTask(task), remoteCancellationConfirmed: false, mayContinue: false }; }
    task.status = 'cancel_requested'; task.remoteCancellationConfirmed = false; task.mayContinue = true; changed(task);
    const provider = providers[task.providerId];
    if (!task._remoteId || !provider?.adapter.cancel) { task.status = task._remoteId ? 'cancel_requested' : 'interrupted'; task.error = task._remoteId ? 'This Provider has no cancellation route; remote generation may continue' : 'Create was interrupted before a remote ID was received; generation may continue remotely'; changed(task); if (task._remoteId) schedule(task, pollInterval); return { task: publicTask(task), remoteCancellationConfirmed: false, mayContinue: true }; }
    const job = { kind: 'cancel', controller: new AbortController(), promise: null }; jobs.set(task.id, job);
    const current = () => !disposed && jobs.get(task.id) === job && !job.controller.signal.aborted;
    job.promise = (async () => {
      try {
        try { const response = await call(provider, provider.adapter.cancel, task, job.controller.signal); if (!current()) throw Error('Cancellation was interrupted; remote generation may continue'); if (remoteState(provider, response) === 'cancelled') { task.status = 'cancelled'; task._phase = 'terminal'; task.remoteCancellationConfirmed = true; task.mayContinue = false; delete task.error; } else task.error = 'Provider did not confirm cancellation; remote generation may continue'; }
        catch (error) { if (!current()) throw Error('Cancellation was interrupted; remote generation may continue'); task.error = scrub(error.message + '; remote generation may continue'); }
        changed(task); return { task: publicTask(task), remoteCancellationConfirmed: task.remoteCancellationConfirmed === true, mayContinue: task.mayContinue === true };
      } finally { if (jobs.get(task.id) === job) { jobs.delete(task.id); if (task.status === 'cancel_requested') schedule(task, pollInterval); } }
    })();
    return job.promise;
  }
  function listTasks(data = {}) {
    const page = Number.isInteger(data.page) && data.page > 0 ? Math.min(data.page, 100000) : 1, size = Number.isInteger(data.pageSize) && data.pageSize > 0 ? Math.min(data.pageSize, 100) : 20;
    let rows = Object.values(tasks).filter(task => (!data.providerId || task.providerId === data.providerId) && (!data.kind && !data.category || task.kind === (data.kind || (data.category === '3d' ? 'model' : data.category))) && (!data.status || task.status === data.status) && (!data.workspaceKey || task.workspaceKey === data.workspaceKey) && (typeof data.discarded !== 'boolean' || task.discarded === data.discarded) && (!data.query || (task.prompt + ' ' + task.model).toLowerCase().includes(String(data.query).toLowerCase())) && (!data.startTime || Date.parse(task.createdTime) >= Date.parse(data.startTime)) && (!data.endTime || Date.parse(task.createdTime) <= Date.parse(data.endTime)));
    rows.sort((a, b) => b.createdTime.localeCompare(a.createdTime) || b.id.localeCompare(a.id)); return { tasks: rows.slice((page - 1) * size, page * size).map(publicTask), total: rows.length, page, size: Math.min(size, Math.max(0, rows.length - (page - 1) * size)) };
  }
  function getArtifactPath(taskId, artifactId) { owner.assert(); const task = taskById(taskId); id(artifactId, 'artifactId'); const artifact = task.artifacts.find(row => row.id === artifactId); if (!artifact) throw Error('Owned artifact not found'); const file = checked(artifact._file, true); if (fs.statSync(file).size > MAX_FILE) throw Error('Owned artifact exceeds 64 MiB'); const bytes = fs.readFileSync(file); if (bytes.length !== artifact.byteLength || sha(bytes) !== artifact.sha256) throw Error('Owned artifact integrity check failed'); return { path: file, mime: artifact.mime, filename: artifact.filename, byteLength: artifact.byteLength, sha256: artifact.sha256 }; }
  providers = read('providers.json', {}); tasks = read('tasks.json', {}); inputs = read('inputs.json', {}); canvases = read('canvases.json', { default: read('canvas.json', { version: 1, nodes: [], edges: [] }) });
  for (const provider of Object.values(providers)) decrypt(provider._key);
  for (const task of Object.values(tasks)) if (!TERMINAL.has(task.status)) { if (task._remoteId) schedule(task); else { task.status = 'interrupted'; task.mayContinue = task._phase !== 'create_pending'; task.error = 'Process restarted before a remote task ID was recorded; create is not resubmitted'; task._phase = 'terminal'; changed(task); } }
  async function dispatch(kind, data = {}) {
    if (disposed) throw Error('Asset service is closed'); owner.assert(); if (fatalError) throw Error('Asset runtime unavailable: ' + scrub(fatalError.message));
    switch (kind) {
      case 'generator/listProviders': return { providers: Object.values(providers).map(publicProvider) };
      case 'generator/getInputs': { const scope = inputScope(data.workspaceKey); return { inputs: Object.values(inputs).filter(input => input.workspaceKey === scope).sort((a, b) => b.createdTime.localeCompare(a.createdTime)).map(publicInput) }; }
      case 'generator/getInput': return { input: publicInput(inputFile(data.inputId, data.workspaceKey).input) };
      case 'generator/deleteInput': return deleteInput(data);
      case 'generator/saveProvider': return saveProvider(data);
      case 'generator/deleteProvider': { const providerId = id(data.providerId, 'providerId'); if (Object.values(tasks).some(task => task.providerId === providerId && !TERMINAL.has(task.status))) throw Error('Finish/cancel active tasks before deleting their Provider'); const deleted = Object.prototype.hasOwnProperty.call(providers, providerId); if (deleted) { const next = { ...providers }; delete next[providerId]; atomic('providers.json', Buffer.from(JSON.stringify(next))); providers = next; } return { deleted }; }
      case 'generator/createTask': return createTask(data);
      case 'generator/getTask': return { task: publicTask(taskById(data.taskId)) };
      case 'generator/cancelTask': return cancelTask(data);
      case 'generator/listTasks': return listTasks(data);
      case 'generator/updateTasksDiscarded': { if (!Array.isArray(data.taskIds) || !data.taskIds.length || data.taskIds.length > 200 || typeof data.discarded !== 'boolean') throw Error('Bounded taskIds/discarded are required'); const selected = [...new Set(data.taskIds)].map(taskById), before = selected.map(task => ({ discarded: task.discarded, updatedTime: task.updatedTime })); for (const task of selected) { task.discarded = data.discarded; task.updatedTime = new Date().toISOString(); } try { persist(); } catch (error) { selected.forEach((task, index) => Object.assign(task, before[index])); throw error; } return { updated: selected.length }; }
      case 'generator/getResource': { const resource = getArtifactPath(data.taskId, data.artifactId), { path: file, ...metadata } = resource; return { ...metadata, taskId: data.taskId, artifactId: data.artifactId, base64: fs.readFileSync(file).toString('base64') }; }
      case 'generator/resolveDownloadUrl': { const resource = getArtifactPath(data.taskId, data.artifactId); return { taskId: data.taskId, artifactId: data.artifactId, mime: resource.mime, filename: resource.filename, resourceMethod: 'generator/getResource', supported: true }; }
      case 'generator/getCanvas': { const scope = text(data.workspaceKey || data.scopeKey || 'default', 'workspaceKey', 2048, true), canvas = Object.prototype.hasOwnProperty.call(canvases, scope) ? canvases[scope] : { version: 1, nodes: [], edges: [] }; return { canvas: scrub(clone(canvas)), workspaceKey: scope }; }
      case 'generator/saveCanvas': { const scope = text(data.workspaceKey || data.scopeKey || 'default', 'workspaceKey', 2048, true), next = scrub(boundedJson(data.canvas, 1024 * 1024)); if (!next || typeof next !== 'object' || !Array.isArray(next.nodes) || !Array.isArray(next.edges)) throw Error('Canvas requires nodes/edges arrays'); const updated = { ...canvases, [scope]: next }, bytes = Buffer.from(JSON.stringify(updated)); if (bytes.length > 16 * 1024 * 1024) throw Error('Canvas store exceeds 16 MiB'); atomic('canvases.json', bytes); canvases = updated; return { canvas: scrub(clone(next)), workspaceKey: scope }; }
      default: throw Error('Unknown asset service operation');
    }
  }
  function assertRuntime() { if (disposed || fatalError) throw Error('Asset runtime is unavailable'); owner.assert(); }
  return { dispatch, getArtifactPath, registerInput, assertRuntime, inspectInputBytes(bytes) { assertRuntime(); if (!Buffer.isBuffer(bytes) || !bytes.length || bytes.length > MAX_FILE) throw Error('Reference file must contain 1 byte to 64 MiB'); return mediaType(bytes); }, getOwnedSnapshot() { assertRuntime(); return { tasks: Object.values(tasks).map(publicTask), inputs: Object.values(inputs).map(publicInput) }; }, getInputPath(inputId, workspaceKey) { assertRuntime(); const { input, file } = inputFile(inputId, workspaceKey); return { ...publicInput(input), path: file }; }, async close() { disposed = true; for (const timer of timers.values()) clearTimeout(timer); timers.clear(); for (const job of jobs.values()) job.controller.abort(); jobs.clear(); owner.release(); }, root: directory };
  } catch (error) { owner.release(); throw error; }
}
module.exports = { createAssetService };
