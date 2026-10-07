'use strict';
// Own media cache and generation tasks. Official execution is an internal,
// account-bound adapter; renderer-configured Providers never acquire it.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const dns = require('node:dns').promises;
const zlib = require('node:zlib');
const officialModels = require('./models/official-catalog.js');
const {inspectAudioMedia} = require('../media/audio.js');
const {inspectModelMedia} = require('../media/model.js');
const {inspectExtraImageMedia} = require('../media/image.js');
const {inspectHdrMedia}=require('../media/hdr.js');
const {inspectJpegMedia}=require('../media/jpeg.js');
const {inspectVideoMedia}=require('../media/video.js');
const { CPA_IMAGE_MODELS, validateCpaImagePayload, cpaImageRequestPrompt, isCpaImageProvider } = require('./models/cpa-image.js');
const MAX_FILE = 64 * 1024 * 1024, MAX_JSON = 96 * 1024 * 1024;
const TERMINAL = new Set(['completed', 'failed', 'cancelled', 'interrupted']);
const KINDS = new Set(['image', 'video', 'model']);
const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
const SECRET_FIELD = /^(api[_-]?key|authorization|access[_-]?token|refresh[_-]?token|password|secret|bearer[_-]?token)$/i;
const DEFAULT_MAP = { queued: ['queued', 'pending'], running: ['running', 'processing', 'in_progress'], completed: ['completed', 'succeeded', 'success'], failed: ['failed', 'error'], cancelled: ['cancelled', 'canceled'] };
const DEFAULT_BODY = { kind: '{{kind}}', model: '{{model}}', prompt: '{{prompt}}', parameters: '{{parameters}}' };
const DEFAULT_OUTPUT_SELECTORS = { url: 'url', base64: 'base64', mime: 'mime', filename: 'filename' };
const TRANSPORT_CODES = new Set(['UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ENETUNREACH', 'EHOSTUNREACH', 'CERT_HAS_EXPIRED', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'ERR_TLS_CERT_ALTNAME_INVALID']);
const transportFailures = new WeakMap();
function transportCode(error) {
  const seen = new Set();
  for (let cause = error, depth = 0; cause && typeof cause === 'object' && depth < 4 && !seen.has(cause); cause = cause.cause, depth++) {
    seen.add(cause); if (TRANSPORT_CODES.has(cause.code)) return cause.code;
  }
  return 'TRANSPORT_ERROR';
}
function transportError(message, diagnostic) {
  // Keep only our bounded classification. Native error messages/stacks and
  // causes may contain URLs, request fields or credentials and never persist.
  const error = Error(message); transportFailures.set(error, diagnostic); return error;
}
const CPA_IMAGE_CREATE = { method: 'POST', path: '/images/generations', bodyType: 'json', bodyTemplate: {
  model: '{{model}}', prompt: '{{prompt}}', n: 1, size: '{{parameters.size}}', quality: '{{parameters.quality}}', output_format: '{{parameters.outputFormat}}',
} };
function reportedCpaImage(response) {
  const result = {};
  if (!response || typeof response !== 'object' || Array.isArray(response)) return result;
  if (['auto', 'low', 'medium', 'high', 'xhigh', 'max'].includes(response.quality)) result.quality = response.quality;
  if (['png', 'jpeg', 'webp'].includes(response.output_format)) result.outputFormat = response.output_format;
  if (Object.values(CPA_IMAGE_MODELS).some(model => model.model === response.model)) result.model = response.model;
  if (response.size === 'auto') result.size = 'auto';
  else if (typeof response.size === 'string' && /^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(response.size)) {
    const [width, height] = response.size.split('x').map(Number);
    if (width <= 16384 && height <= 16384 && width * height <= 64 * 1024 * 1024) result.size = response.size;
  }
  return result;
}
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
function validateBodyTemplate(template, variables) {
  // Parameter values belong to each task. Validate their paths while saving the
  // adapter; resolve them only from the actual bounded task JSON before HTTP.
  const visit = value => {
    if (typeof value === 'string') for (const match of value.matchAll(/\{\{([^{}]+)\}\}/g)) {
      const key = match[1], parts = key.split('.');
      if (!/^[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z0-9_]+)*$/.test(key) || parts.some(part => ['__proto__', 'prototype', 'constructor'].includes(part))) throw Error('Unknown body template variable');
      if (parts[0] === 'parameters' && parts.length > 1) continue;
      if (select(variables, key) === undefined) throw Error('Unknown or unavailable body template variable: ' + key);
    }
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') Object.values(value).forEach(visit);
  };
  visit(template);
}
function inputTemplateIndexes(template, count) {
  const used = new Set();
  const visit = value => { if (typeof value === 'string') for (const match of value.matchAll(/\{\{([^{}]+)\}\}/g)) { if (match[1] === 'inputs') for (let index = 0; index < count; index++) used.add(index); const input = /^inputs\.(\d+)(?:\.(base64|dataUrl))?$/.exec(match[1]); if (input) used.add(Number(input[1])); } else if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === 'object') Object.values(value).forEach(visit); };
  visit(template); return used;
}
function privateIpv4(host) { const parts = host.split('.').map(Number); return /^\d+\.\d+\.\d+\.\d+$/.test(host) && parts.every(value => value >= 0 && value <= 255) && (parts[0] === 10 || parts[0] === 192 && parts[1] === 168 || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31); }
function safeUrl(value, base, allowedLanOrigin, officialDownload = false) {
  let url; try { url = new URL(value, base); } catch { throw Error('Invalid Provider URL'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw Error('Provider URLs must be HTTP(S) without embedded credentials or fragments');
  const host = url.hostname.toLowerCase().replace(/\.$/, ''); if (!officialDownload && (host === 'ai-generator.tuanjie.cn' || host.endsWith('.ai-generator.tuanjie.cn'))) throw Error('The original asset service is not supported');
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
function mediaType(bytes, hints = {}) {
  const jpeg=inspectJpegMedia(bytes,hints); if(jpeg) return jpeg;
  const hdr=inspectHdrMedia(bytes); if(hdr) return hdr;
  const extraImage = inspectExtraImageMedia(bytes,hints); if(extraImage) return extraImage;
  const audio = inspectAudioMedia(bytes,hints); if(audio) return audio;
  const model = inspectModelMedia(bytes,hints); if(model) return model;
  if(hints.output && (/^(?:application\/json|text\/plain)$/.test(hints.mimeHint || '') || /\.json$/i.test(hints.filename || '')) && bytes.length <= 2*1024*1024) {
    let content; try {content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);} catch {throw Error('Invalid UTF-8 result');}
    if(!content.trim() || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(content)) throw Error('Invalid text result');
    if(hints.mimeHint==='application/json' || /\.json$/i.test(hints.filename || '')) {try {JSON.parse(content);} catch {throw Error('Invalid JSON result');} return {mime:'application/json',extension:'json',kind:'file'};}
    return {mime:'text/plain',extension:'txt',kind:'text'};
  }
  if (bytes.length < 16) throw Error('Generated media is incomplete');
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    if (bytes.length < 45 || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR' || !bytes.readUInt32BE(16) || !bytes.readUInt32BE(20)) throw Error('Invalid PNG header');
    let offset = 8, ended = false; const data = [], width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20), depth = bytes[24], color = bytes[25], channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color];
    if (width * height > (hints.panorama ? 67108864 : 16777216) || !channels || ![1, 2, 4, 8, 16].includes(depth) || bytes[26] || bytes[27] || bytes[28] > 1) throw Error('Unsupported/bounded PNG dimensions or coding');
    while (offset + 12 <= bytes.length) { const size = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8); if (size > bytes.length - offset - 12) throw Error('Truncated PNG chunk'); if (crc(bytes.subarray(offset + 4, offset + 8 + size)) !== bytes.readUInt32BE(offset + 8 + size)) throw Error('PNG checksum mismatch'); if (type === 'IDAT') data.push(bytes.subarray(offset + 8, offset + 8 + size)); offset += size + 12; if (type === 'IEND') { ended = true; break; } }
    if (!data.length || !ended || offset !== bytes.length) throw Error('Incomplete PNG data');
    const passes = bytes[28] === 0 ? [[0, 0, 1, 1]] : [[0, 0, 8, 8], [4, 0, 8, 8], [0, 4, 4, 8], [2, 0, 4, 4], [0, 2, 2, 4], [1, 0, 2, 2], [0, 1, 1, 2]], rows = [];
    for (const [x, y, dx, dy] of passes) { const columns = Math.max(0, Math.ceil((width - x) / dx)), count = Math.max(0, Math.ceil((height - y) / dy)); if (columns && count) rows.push({ count, length: Math.ceil(columns * channels * depth / 8) + 1 }); }
    const expected = rows.reduce((sum, row) => sum + row.count * row.length, 0); if (expected > (hints.panorama ? 512 : 128) * 1024 * 1024) throw Error('Decoded PNG pixels exceed their budget'); let pixels; try { pixels = zlib.inflateSync(Buffer.concat(data), { maxOutputLength: expected }); } catch { throw Error('Invalid PNG compressed pixels'); } if (pixels.length !== expected) throw Error('PNG pixel dimensions do not match its data'); let rowOffset = 0; for (const row of rows) for (let index = 0; index < row.count; index++) { if (pixels[rowOffset] > 4) throw Error('Invalid PNG row filter'); rowOffset += row.length; } return { mime: 'image/png', extension: 'png', kind: 'image' };
  }
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' && bytes.readUInt32LE(4) + 8 === bytes.length) return { mime: 'image/webp', extension: 'webp', kind: 'image' };
  const video=inspectVideoMedia(bytes);if(video)return video;
  if (bytes.readUInt32LE(0) === 0x46546c67) { if (bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length || bytes.readUInt32LE(16) !== 0x4e4f534a) throw Error('Invalid GLB container'); const length = bytes.readUInt32LE(12); if (length > 8 * 1024 * 1024 || length % 4 || 20 + length > bytes.length) throw Error('Invalid GLB JSON bounds'); let model; try { model = JSON.parse(bytes.toString('utf8', 20, 20 + length)); } catch { throw Error('Invalid GLB JSON'); } if (model.asset?.version !== '2.0' || !Array.isArray(model.meshes) || !model.meshes.length || !Array.isArray(model.accessors) || !Array.isArray(model.buffers)) throw Error('GLB has no usable model geometry'); for (const resource of [...model.buffers, ...(model.images || [])]) if (resource.uri && !/^data:[A-Za-z0-9+./-]+;base64,[A-Za-z0-9+/=]+$/.test(resource.uri)) throw Error('GLB must contain its own resources; external/relative buffers and textures are unsupported'); let offset = 20 + length, binarySize = 0; while (offset < bytes.length) { if (offset + 8 > bytes.length) throw Error('Truncated GLB chunk'); const size = bytes.readUInt32LE(offset); if (size % 4 || offset + size + 8 > bytes.length) throw Error('Invalid GLB binary bounds'); if (bytes.readUInt32LE(offset + 4) === 0x004e4942) binarySize += size; offset += size + 8; } for (const buffer of model.buffers) if (!Number.isInteger(buffer.byteLength) || buffer.byteLength < 1 || !buffer.uri && buffer.byteLength > binarySize) throw Error('GLB buffer is incomplete'); return { mime: 'model/gltf-binary', extension: 'glb', kind: 'model' }; }
  throw Error('Generated bytes are not a supported PNG/JPEG/WebP/MP4/WebM/GLB asset');
}
function createAssetService(options) {
  const root = options?.root; if (typeof root !== 'string' || !path.isAbsolute(root)) throw Error('Asset service requires a trusted absolute runtime root');
  const directory = path.resolve(root); for (let current = directory; ; current = path.dirname(current)) { if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw Error('Linked asset runtime roots are unsupported'); if (path.dirname(current) === current) break; } fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const fetcher = options.fetch || globalThis.fetch, pollInterval = options.pollIntervalMs ?? 1000, requestTimeout = options.requestTimeoutMs ?? 30000;
  if (typeof fetcher !== 'function' || !Number.isInteger(pollInterval) || pollInterval < 10 || !Number.isInteger(requestTimeout) || requestTimeout < 10 || requestTimeout > 600000) throw Error('Invalid asset service transport options');
  let disposed = false, fatalError, officialExecutor, providers = {}, tasks = {}, canvases = {}, inputs = {}; const jobs = new Map(), timers = new Map(), secretValues = new Set(), managedCredentials = new Map();
  function checked(file, existing = false) {
    const full = path.resolve(directory, file); if (full !== directory && !full.startsWith(directory + path.sep)) throw Error('Asset storage path escaped its owner');
    for (let current = full; ; current = path.dirname(current)) { if (fs.existsSync(current)) { const stat = fs.lstatSync(current); if (stat.isSymbolicLink() || stat.isFile() && stat.nlink !== 1) throw Error('Linked asset runtime storage is unsupported'); } if (path.dirname(current) === current) break; }
    if (existing && !fs.statSync(full).isFile()) throw Error('Asset resource is not a regular file'); return full;
  }
  checked('');
  let owner;
  function atomic(file, bytes) {
    owner?.assert(); const full=checked(file); fs.mkdirSync(path.dirname(full),{recursive:true,mode:0o700}); checked(file);
    const temp=checked(file+'.tmp-'+crypto.randomUUID()); let handle, prepared=false;
    try {
      handle=fs.openSync(temp,'wx',0o600); fs.writeFileSync(handle,bytes); fs.fsyncSync(handle); fs.closeSync(handle); handle=undefined; prepared=true;
      // Windows readers/virus scanners can briefly deny replacement. Retry
      // only this already prepared local write, never a Provider POST, and
      // never unlink the last durable destination to make rename succeed.
      for(let attempt=0;;attempt++) {
        checked(file); checked(path.relative(directory,temp),true); owner?.assert();
        try {fs.renameSync(temp,full); prepared=false; break;}
        catch(error) {if(attempt>=5 || !['EPERM','EACCES','EBUSY'].includes(error.code)) throw error; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,20);}
      }
    } finally {if(handle!==undefined) fs.closeSync(handle); if(!prepared && fs.existsSync(temp)) fs.unlinkSync(checked(path.relative(directory,temp),true));}
  }
  function read(file, fallback) { const full = checked(file); if (!fs.existsSync(full)) return fallback; checked(file, true); if (fs.statSync(full).size > 64 * 1024 * 1024) throw Error('Asset state store exceeds 64 MiB'); return JSON.parse(fs.readFileSync(full)); }
  owner = acquireOwner(directory, checked);
  try {
  const masterFile = checked('master.key'); if (!fs.existsSync(masterFile)) fs.writeFileSync(masterFile, crypto.randomBytes(32), { flag: 'wx', mode: 0o600 }); checked('master.key', true); if (fs.statSync(masterFile).size !== 32) throw Error('Asset master key is invalid'); const master = fs.readFileSync(masterFile);
  function encrypt(value) { secretValues.add(value); const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', master, iv), bytes = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]); return { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: bytes.toString('base64') }; }
  function decrypt(value) { if (!value) return ''; const decipher = crypto.createDecipheriv('aes-256-gcm', master, Buffer.from(value.iv, 'base64')); decipher.setAuthTag(Buffer.from(value.tag, 'base64')); const result = Buffer.concat([decipher.update(Buffer.from(value.data, 'base64')), decipher.final()]).toString('utf8'); secretValues.add(result); return result; }
  function providerKey(provider) { if (!provider._managedRegistryRef) return decrypt(provider._key); const resolver = managedCredentials.get(provider._managedRegistryRef); if (!resolver) return ''; const key = resolver(); if (typeof key !== 'string') throw Error('Managed Provider credentials are not ready'); if (key) secretValues.add(key); return key; }
  function scrub(value) { if (typeof value === 'string') { let result = value; for (const provider of Object.values(providers)) providerKey(provider); for (const key of secretValues) if (key) result = result.replaceAll(key, '<redacted>'); return result; } if (Array.isArray(value)) return value.map(scrub); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, SECRET_FIELD.test(key) ? '<redacted>' : scrub(item)])); return value; }
  function persist() { const bytes = Buffer.from(JSON.stringify(tasks)); if (bytes.length > 64 * 1024 * 1024) throw Error('Task history exceeds 64 MiB'); atomic('tasks.json', bytes); }
  function publicProvider(provider) { const { _key, _managedRegistryRef, _managedVersion, ...rest } = provider; return scrub({ ...rest, apiKeyConfigured: !!providerKey(provider), ...(_managedRegistryRef ? { managed:true } : {}) }); }
  function publicTask(task) { const result = {}; for (const [key, value] of Object.entries(task)) if (!key.startsWith('_')) result[key] = key === 'artifacts' ? value.map(artifact => Object.fromEntries(Object.entries(artifact).filter(([name]) => !name.startsWith('_')))) : value; result.submissionUnknown = task.status === 'interrupted' && task.mayContinue === true && !task._remoteId; return scrub(result); }
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
    const staged = checked(path.join('incoming', inputId + '.bin'), true); if (fs.statSync(staged).size !== data.byteLength) throw Error('Native input byte length changed'); const bytes = fs.readFileSync(staged); if (sha(bytes) !== data.sha256) throw Error('Native input checksum changed'); const actual = mediaType(bytes,{filename:originalName});
    const basename = path.posix.basename(path.win32.basename(originalName)), stem = path.parse(basename).name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/[. ]+$/, '').slice(0, 100) || 'reference';
    const input = { id: inputId, filename: stem + '.' + actual.extension, mime: actual.mime, kind: actual.kind, byteLength: bytes.length, sha256: data.sha256, workspaceKey, createdTime: new Date().toISOString(), _file: path.join('inputs', inputId + '.' + actual.extension) }, next = { ...inputs, [inputId]: input };
    checked('inputs.json'); const destination = checked(input._file); if (fs.existsSync(destination)) throw Error('Reference input destination already exists'); atomic(input._file, bytes);
    try { atomic('inputs.json', Buffer.from(JSON.stringify(next))); } catch (error) { try { const file = checked(input._file, true); if (sha(fs.readFileSync(file)) === input.sha256) fs.unlinkSync(file); } catch {} throw error; }
    inputs = next; return { input: publicInput(input) };
  }
  function importOwnedArtifactInput(data) {
    assertRuntime(); const task = taskById(data.taskId), workspaceKey = inputScope(data.workspaceKey);
    if ((task.workspaceKey || '') !== workspaceKey) throw Error('Owned artifact not found in this workspace');
    const resource = getArtifactPath(task.id, data.artifactId), bytes = fs.readFileSync(resource.path);
    if (bytes.length !== resource.byteLength || sha(bytes) !== resource.sha256) throw Error('Owned artifact integrity check failed');
    const inputId = 'i_' + crypto.randomUUID(), stagedName = path.join('incoming', inputId + '.bin');
    atomic(stagedName, bytes);
    try { return registerInput({ inputId, workspaceKey, filename: resource.filename, byteLength: resource.byteLength, sha256: resource.sha256 }); }
    finally { const staged = checked(stagedName); if (fs.existsSync(staged)) fs.unlinkSync(checked(stagedName, true)); }
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
    if (specification.bodyTemplate !== undefined) { result.bodyTemplate = boundedJson(specification.bodyTemplate, 65536); validateBodyTemplate(result.bodyTemplate, { kind: 'image', model: 'owned-model', prompt: 'owned-prompt', parameters: {}, taskId: 'owned-id', workspaceKey: 'default', inputs: Array.from({ length: 8 }, (_, index) => ({ id: 'i_' + index, filename: 'reference.png', mime: 'image/png', kind: 'image', byteLength: 3, sha256: '0'.repeat(64), base64: 'YWJj', dataUrl: 'data:image/png;base64,YWJj' })) }); }
    if (bodyType === 'multipart') { if (result.bodyTemplate !== undefined && (!result.bodyTemplate || typeof result.bodyTemplate !== 'object' || Array.isArray(result.bodyTemplate))) throw Error('Multipart bodyTemplate must be a fields object'); const fields = specification.fileFields || []; if (!Array.isArray(fields) || fields.length > 8) throw Error('Multipart supports at most eight file fields'); result.fileFields = fields.map(field => { if (!field || typeof field !== 'object' || typeof field.name !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.\[\]-]{0,127}$/.test(field.name) || SECRET_FIELD.test(field.name) || field.inputIndex !== 'all' && (!Number.isInteger(field.inputIndex) || field.inputIndex < 0 || field.inputIndex > 7)) throw Error('Invalid multipart file field mapping'); return { name: field.name, inputIndex: field.inputIndex }; }); }
    else if (specification.fileFields !== undefined && (!Array.isArray(specification.fileFields) || specification.fileFields.length)) throw Error('File fields require multipart body type');
    return result;
  }
  function saveProvider(input, managed) {
    const value = input?.provider; if (!value || typeof value !== 'object') throw Error('provider object is required'); const providerId = value.id ? id(value.id, 'providerId') : 'p_' + crypto.randomUUID(), previous = Object.prototype.hasOwnProperty.call(providers, providerId) && providers[providerId];
    if (providerId === 'codely-official') throw Error('Official execution is not a configurable Provider');
    if (!managed && (previous?._managedRegistryRef || Object.keys(value).some(key => key.startsWith('_managed')))) throw Error('Managed Providers require the internal registry entry point');
    if (Object.keys(providers).length >= 64 && !previous) throw Error('Provider limit is 64');
    if (value.allowInsecureLan !== undefined && typeof value.allowInsecureLan !== 'boolean') throw Error('LAN authorization must be an explicit boolean');
    const allowInsecureLan = value.allowInsecureLan ?? previous?.allowInsecureLan ?? false;
    const rawBase = text(value.baseUrl, 'baseUrl', 2048, true);
    const lanLiteral = /^http:\/\/((?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3})(?::\d+)?(?:\/|$)/i.exec(rawBase);
    const base = safeUrl(rawBase, undefined, allowInsecureLan && lanLiteral ? new URL(rawBase).origin : undefined); if (base.search) throw Error('API credentials/query values belong in route/auth configuration, not baseUrl');
    const timeoutMs = value.requestTimeoutMs ?? previous?.requestTimeoutMs;
    if (timeoutMs !== undefined && (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 600000)) throw Error('Provider requestTimeoutMs must be 1000..600000');
    const kinds = [...new Set(value.kinds || [])]; if (!kinds.length || kinds.length > (managed ? 4 : 3) || kinds.some(kind => !KINDS.has(kind) && !(managed && kind === 'audio'))) throw Error('Provider kinds must contain image, video or model');
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
    if (managed) { provider._managedRegistryRef = managed.ref; provider._managedVersion = managed.version; }
    else provider._key = value.clearApiKey === true ? undefined : typeof value.apiKey === 'string' && value.apiKey.length ? encrypt(text(value.apiKey, 'apiKey', 8192, true)) : previous?._key;
    const key = providerKey(provider); if (key) { const hasKey = item => typeof item === 'string' ? item.includes(key) : Array.isArray(item) ? item.some(hasKey) : item && typeof item === 'object' ? Object.values(item).some(hasKey) : false; const { _key, ...metadata } = provider; if (hasKey(metadata)) throw Error('API keys must not be embedded in Provider metadata, endpoint paths or templates'); }
    const next = { ...providers, [providerId]: provider }; const old = providers; providers = next; try { atomic('providers.json', Buffer.from(JSON.stringify(providers))); } catch (error) { providers = old; throw error; }
    const executionConfig = item => stableJson({ ...item, name: undefined, _key: undefined, adapter: { ...item.adapter, create: { ...item.adapter.create, bodyType: item.adapter.create.bodyType || 'json' }, poll: { ...item.adapter.poll, bodyType: item.adapter.poll.bodyType || 'json' }, cancel: item.adapter.cancel ? { ...item.adapter.cancel, bodyType: item.adapter.cancel.bodyType || 'json' } : null, responseMode: item.adapter.responseMode || 'task', outputSelectors: { ...DEFAULT_OUTPUT_SELECTORS, ...(item.adapter.outputSelectors || {}) } } });
    if (previous && (executionConfig(previous) !== executionConfig(provider) || providerKey(previous) !== providerKey(provider))) for (const task of Object.values(tasks)) if (task.providerId === providerId && !TERMINAL.has(task.status)) { stopJob(task.id); delete task.transportDiagnostic; task.mayContinue = task._phase !== 'create_pending'; task.remoteCancellationConfirmed = false; task.status = 'interrupted'; task.error = task.mayContinue ? 'Provider configuration changed; an already submitted remote task may continue' : 'Provider configuration changed before the task was submitted'; changed(task); }
    return { provider: publicProvider(provider) };
  }
  function stopJob(taskId) { const timer = timers.get(taskId); if (timer) clearTimeout(timer); timers.delete(taskId); const job = jobs.get(taskId); if (job) job.controller.abort(); jobs.delete(taskId); }
  function schedule(task, delay = 0) { if (disposed || fatalError || TERMINAL.has(task.status) || jobs.has(task.id) || timers.has(task.id)) return; const timer = setTimeout(() => { timers.delete(task.id); work(task).catch(error => { fatalError = error; for (const timer of timers.values()) clearTimeout(timer); timers.clear(); for (const job of jobs.values()) job.controller.abort(); jobs.clear(); }); }, delay); timers.set(task.id, timer); }
  function headers(provider, url, json = false) { const result = {}; if (json) result['Content-Type'] = 'application/json'; if (url.origin === new URL(provider.baseUrl).origin) { const key = providerKey(provider); if (provider.authMode === 'bearer' && key) result.Authorization = 'Bearer ' + key; else if (provider.authMode === 'header' && key) result[provider.apiKeyHeader] = key; } return result; }
  async function request(url, init, signal, limit = MAX_JSON, timeoutMs = requestTimeout, operation = 'create') {
    const started = performance.now(); let stage = 'awaiting-response', httpStatus, deadlineExceeded = false, byteLimitExceeded = false;
    const diagnostic = code => ({ operation, stage, code, elapsedMs: Math.min(2147483647, Math.max(0, Math.floor(performance.now() - started))), timeoutMs, ...(Number.isInteger(httpStatus) && httpStatus >= 100 && httpStatus <= 599 ? { httpStatus } : {}) });
    const controller = new AbortController(), abort = () => controller.abort(signal?.reason), timer = setTimeout(() => { deadlineExceeded = true; controller.abort(Error('Provider request deadline exceeded')); }, timeoutMs);
    if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    try {
      const response = await fetcher(url, { ...init, redirect: 'manual', signal: controller.signal });
      httpStatus = response.status; stage = 'reading-response';
      const length = Number(response.headers.get('content-length'));
      if (Number.isFinite(length) && length > limit) { byteLimitExceeded = true; await response.body?.cancel(); throw Error('Provider response exceeds its byte budget'); }
      let count = 0, chunks = [];
      if (response.body) { const reader = response.body.getReader(); try { for (;;) { const { done, value } = await reader.read(); if (done) break; count += value.length; if (count > limit) { byteLimitExceeded = true; await reader.cancel(); throw Error('Provider response exceeds its byte budget'); } chunks.push(Buffer.from(value)); } } finally { reader.releaseLock(); } }
      return { status: response.status, headers: response.headers, bytes: Buffer.concat(chunks), diagnostic: diagnostic('RESPONSE_RECEIVED') };
    } catch (error) {
      const code = deadlineExceeded ? 'PROVIDER_REQUEST_DEADLINE' : signal?.aborted ? 'REQUEST_ABORTED' : byteLimitExceeded ? 'PROVIDER_RESPONSE_LIMIT' : transportCode(error);
      throw transportError(code === 'PROVIDER_REQUEST_DEADLINE' ? 'Provider request deadline exceeded' : code === 'PROVIDER_RESPONSE_LIMIT' ? 'Provider response exceeds its byte budget' : 'Provider transport failed', diagnostic(code));
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  }
  async function call(provider, specification, task, signal, operation = task._remoteId ? 'poll' : 'create') {
    let url, body, json;
    try {
      url = endpoint(provider, specification, task._remoteId); const cache = new Map();
      const inputBytes = index => { const snapshot = task.inputs?.[index]; if (!snapshot) throw Error('Reference input index is unavailable'); if (!cache.has(index)) { const loaded = inputFile(snapshot.id, task.workspaceKey); if (loaded.input.sha256 !== snapshot.sha256 || loaded.input.byteLength !== snapshot.byteLength) throw Error('Reference input snapshot changed'); cache.set(index, loaded.bytes); } return cache.get(index); };
      const requestParameters=task.providerProtocol==='generic-rest-task'&&task.providerParameters!==undefined?clone(task._managedRestParameters??task.providerParameters):task.parameters;
      if(task.providerProtocol==='generic-rest-task'&&task.providerParameters!==undefined)for(const [name,value]of Object.entries({model:task.model,prompt:task.prompt}))Object.defineProperty(requestParameters,name,{value,enumerable:Object.hasOwn(requestParameters,name)});
      const variables = { kind: task.kind, model: task.model, prompt: task.prompt, parameters: requestParameters, taskId: task._remoteId || '', workspaceKey: task.workspaceKey || '', inputs: (task.inputs || []).map((input, index) => { let encoded; const base64 = () => encoded ?? (encoded = inputBytes(index).toString('base64')); return Object.defineProperties({ ...input }, { base64: { enumerable: true, get: base64 }, dataUrl: { enumerable: true, get: () => 'data:' + input.mime + ';base64,' + base64() } }); }) };
      if (specification.method !== 'GET') {
        if (specification.bodyType === 'multipart') {
          body = new FormData(); let size = 0; const fields = specification.bodyTemplate === undefined ? {} : render(specification.bodyTemplate, variables); if (!fields || typeof fields !== 'object' || Array.isArray(fields)) throw Error('Rendered multipart fields must be an object');
          for (const [name, value] of Object.entries(fields)) { if (!/^[A-Za-z0-9][A-Za-z0-9_.\[\]-]{0,127}$/.test(name)) throw Error('Invalid multipart text field name'); const field = typeof value === 'string' ? value : JSON.stringify(value); size += Buffer.byteLength(field) + Buffer.byteLength(name) + 1024; if (size > MAX_JSON) throw Error('Provider multipart body exceeds 96 MiB'); body.append(name, field); }
          for (const field of specification.fileFields || []) for (const index of field.inputIndex === 'all' ? (task.inputs || []).map((_, index) => index) : [field.inputIndex]) { const bytes = inputBytes(index), input = task.inputs[index]; size += bytes.length + Buffer.byteLength(input.filename) + 1024; if (size > MAX_JSON) throw Error('Provider multipart body exceeds 96 MiB'); body.append(field.name, new Blob([bytes], { type: input.mime }), input.filename); }
        } else if (specification.bodyTemplate !== undefined) { json = true; body = JSON.stringify(render(specification.bodyTemplate, variables)); if (Buffer.byteLength(body) > (task.inputs?.length ? MAX_JSON : 16 * 1024 * 1024)) throw Error('Provider request body exceeds its byte budget'); }
      }
    } catch (error) { error.beforeRequest = true; throw error; }
    const result = await request(url, { method: specification.method, headers: headers(provider, url, !!json), ...(body !== undefined ? { body } : {}) }, signal, MAX_JSON, provider.requestTimeoutMs ?? requestTimeout, operation);
    if (result.status < 200 || result.status >= 300) { let detail = result.bytes.toString('utf8').slice(0, 1000); try { detail = JSON.stringify(scrub(JSON.parse(detail))); } catch { detail = scrub(detail); } const error = transportError('Provider HTTP ' + result.status + ': ' + detail, { ...result.diagnostic, stage: 'http-response', code: 'HTTP_ERROR' }); error.httpStatus = result.status; throw error; }
    let response; try { response = JSON.parse(result.bytes); } catch { throw transportError('Provider response is not JSON', { ...result.diagnostic, stage: 'decoding-response', code: 'INVALID_JSON' }); } return response;
  }
  function remoteState(provider, response) { const raw = select(response, provider.adapter.selectors.status); if (typeof raw !== 'string') return null; const normal = raw.trim().toLowerCase(); return Object.keys(provider.adapter.statusMap).find(key => provider.adapter.statusMap[key].includes(normal)) || null; }
  function isOfficial(task) { return task.serviceSource === 'codely-official'; }
  function assertOfficial(task, verifyInputs = false) {
    if (!officialExecutor || !officialExecutor.isAvailable()) { const error = Error('Official account service is unavailable; this task remains bound to its submitting account'); error.beforeRequest = true; error.officialUnavailable = true; throw error; }
    try { officialExecutor.assertOwner(task); }
    catch { const error = Error('Official account changed; this task remains bound to its submitting account'); error.beforeRequest = true; error.officialUnavailable = true; throw error; }
    if (verifyInputs) try { for (const snapshot of task.inputs || []) { const loaded = inputFile(snapshot.id, task.workspaceKey); if (loaded.input.sha256 !== snapshot.sha256 || loaded.input.byteLength !== snapshot.byteLength || loaded.input.mime !== snapshot.mime || loaded.input.kind !== snapshot.kind) throw Error('Reference input snapshot changed'); } } catch (error) { error.beforeRequest = true; throw error; }
    return officialExecutor;
  }
  function officialDownloadProvider(task) {
    const raw = assertOfficial(task).downloadProvider(task);
    if (!raw || raw.authMode !== 'none' || raw._key || raw.apiKey || raw.headers || raw.cookie) throw Error('Official media downloads must not contain account authentication');
    const base = safeUrl(text(raw.baseUrl, 'official media baseUrl', 2048, true), undefined, undefined, true);
    const loopbackFixture = base.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]', '::1'].includes(base.hostname);
    if (base.search || base.protocol !== 'https:' && !loopbackFixture) throw Error('Official media downloads require HTTPS or an internal loopback fixture');
    return { baseUrl: base.toString().replace(/\/+$/, ''), authMode: 'none', _officialDownload: true, _officialLoopbackFixture: loopbackFixture, adapter: { selectors: { taskId: 'id', status: 'status', progress: 'progress', outputs: 'outputs', error: 'error' }, statusMap: DEFAULT_MAP, outputSelectors: DEFAULT_OUTPUT_SELECTORS } };
  }
  async function download(provider, value, signal) {
    const origin = new URL(provider.baseUrl).origin, allowedLanOrigin = provider.allowInsecureLan === true ? origin : undefined;
    let url = safeUrl(value, undefined, allowedLanOrigin, provider._officialDownload === true);
    for (let index = 0; index < 4; index++) {
      if (url.origin !== origin || provider._officialDownload && !provider._officialLoopbackFixture) { if (url.protocol !== 'https:') throw Error('Cross-origin outputs require HTTPS'); const host = url.hostname.replace(/^\[|\]$/g, ''); const addresses = await dns.lookup(host, { all: true }); if (!addresses.length || addresses.some(({ address }) => /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.|2(2[4-9]|3\d|4\d|5[0-5])\.|::(?:$|1$|ffff:)|f[cd]|fe80:)/i.test(address))) throw Error('Output URLs must not target private/local infrastructure'); }
      const result = await request(url, { method: 'GET', headers: headers(provider, url) }, signal, MAX_FILE, provider.requestTimeoutMs ?? requestTimeout, 'download');
      if ([301, 302, 303, 307, 308].includes(result.status)) { const location = result.headers.get('location'); if (!location) throw Error('Output redirect has no location'); url = safeUrl(location, url, allowedLanOrigin, provider._officialDownload === true); continue; }
      if (result.status < 200 || result.status >= 300) throw transportError('Output download HTTP ' + result.status, { ...result.diagnostic, stage: 'http-response', code: 'HTTP_ERROR' }); return { bytes: result.bytes, mime: result.headers.get('content-type')?.split(';')[0].trim().toLowerCase() };
    }
    throw Error('Output redirect budget exceeded');
  }
  async function collect(task, provider, response, job) {
    const rows = select(response, provider.adapter.selectors.outputs);
    if (!isOfficial(task) && task.kind === 'image' && provider.adapter.responseMode === 'outputs' && provider.adapter.selectors.outputs === 'data') {
      // Record the proven response shape in the existing durable error only.
      // Neither raw replies nor provider-controlled strings belong in diagnostics.
      if (rows === undefined) throw Error('图片服务响应缺少 data 字段（data 缺失）；未取得图片，任务失败。');
      if (!Array.isArray(rows)) throw Error('图片服务响应的 data 不是数组（类型：' + (rows === null ? 'null' : typeof rows) + '）；未取得图片，任务失败。');
      if (!rows.length) throw Error('图片服务返回空 data 数组（0 张）；未取得图片，任务失败。');
      if (rows.length > 8) throw Error('图片服务返回的 data 数量超限（' + rows.length + ' 张，允许 1–8 张）；未保存结果，任务失败。');
    }
    if (!Array.isArray(rows) || !rows.length || rows.length > (isOfficial(task) ? 64 : 8)) throw Error(isOfficial(task) ? 'Completed official task requires 1..64 actual output files' : 'Completed Provider task requires 1..8 actual output files');
    task._phase = 'download'; changed(task);
    for (let index = 0; index < rows.length; index++) {
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      if (isOfficial(task)) assertOfficial(task);
      const cachedArtifact=task.artifacts.find(artifact => artifact._outputIndex === index);
      if(cachedArtifact) {
        getArtifactPath(task.id,cachedArtifact.id);
        if(isOfficial(task) && rows[index]?.role==='result' && cachedArtifact.role==='preview') {cachedArtifact.role='result'; changed(task);}
        continue;
      }
      const raw = rows[index]; if (!raw || typeof raw !== 'object') throw Error('Provider output must be an object'); const row = isOfficial(task) ? raw : Object.fromEntries(Object.entries(provider.adapter.outputSelectors || DEFAULT_OUTPUT_SELECTORS).map(([name, selector]) => [name, select(raw, selector)])); let result;
      if (isOfficial(task) && typeof row.text === 'string') {const bytes=Buffer.from(row.text,'utf8'); if(!bytes.length || bytes.length>1024*1024) throw Error('Official text result is empty/oversized'); result={bytes,mime:'text/plain'};}
      else if (typeof row.base64 === 'string') { if (row.base64.length > Math.ceil(MAX_FILE / 3) * 4 + 4 || !validBase64(row.base64)) throw Error('Invalid/oversized base64 output'); result = { bytes: Buffer.from(row.base64, 'base64'), mime: row.mime }; }
      else if (typeof row.url === 'string'&&row.url.startsWith('data:')) {
        // Some Images-compatible gateways expose URL transport as an inline
        // data URI. It is image bytes, never an external download or renderer URL.
        const inline=/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]*={0,2})$/.exec(row.url);
        if(!inline||inline[2].length>Math.ceil(MAX_FILE/3)*4+4||!validBase64(inline[2]))throw Error('Invalid/oversized inline image output');
        result={bytes:Buffer.from(inline[2],'base64'),mime:inline[1]};
      }
      else if (typeof row.url === 'string') result = await download(provider, text(row.url, 'output URL', 8192, true), job.controller.signal);
      else throw Error('Provider output requires an actual URL or base64 bytes');
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      if (isOfficial(task)) assertOfficial(task);
      if (!result.bytes.length || result.bytes.length > MAX_FILE) throw Error('Generated file exceeds 64 MiB or is empty');
      if(isOfficial(task) && task.artifacts.reduce((sum,item)=>sum+item.byteLength,0)+result.bytes.length>512*1024*1024) throw Error('Official output files exceed the combined 512 MiB budget'); const sourceName=row.filename || (typeof row.url==='string'&&!row.url.startsWith('data:') ? new URL(row.url).pathname.split('/').at(-1) : '');
      const actual = mediaType(result.bytes,{filename:sourceName,mimeHint:row.mime || result.mime,output:isOfficial(task),panorama:isOfficial(task) && ['flare-skybox','skybox'].includes(task.model)});
      let sourceContentType,sourceMimeCorrected=false;
      if(isOfficial(task) && typeof row.url==='string' && ['image/png','image/jpeg'].includes(actual.mime) && typeof result.mime==='string') {
        const transportMime=result.mime.split(';')[0].trim().toLowerCase();
        if(['image/png','image/jpeg','image/webp'].includes(transportMime) && transportMime!==actual.mime) {sourceContentType=transportMime; sourceMimeCorrected=true; result.mime=actual.mime;}
      }
      // Object stores may supply a generic binary Content-Type. Both explicit
      // output metadata and transport media types must still match actual bytes.
      for (const declared of [row.mime, result.mime]) if (declared) { if (typeof declared !== 'string') throw Error('Generated MIME must be a string'); const mime = declared.split(';')[0].trim().toLowerCase(); if (!['application/octet-stream','binary/octet-stream','application/binary','application/x-binary'].includes(mime) && !([actual.mime,...({'audio/wav':['audio/x-wav','audio/wave','audio/vnd.wave'],'audio/mpeg':['audio/mp3'],'audio/flac':['audio/x-flac'],'audio/ogg':['audio/opus','application/ogg'],'image/x-exr':['image/exr'],'image/vnd.radiance':['image/x-hdr','application/hdr'],'application/vnd.autodesk.fbx':['application/x-fbx','model/fbx'],'application/zip':['application/x-zip-compressed'],'model/stl':['application/sla'],'model/obj':['text/plain'],'model/vnd.usdz+zip':['application/zip']}[actual.mime] || [])].includes(mime))) throw Error(isOfficial(task) ? `Generated MIME ${/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(mime)?mime:'[invalid]'} does not match verified ${actual.mime} at output ${index}` : 'Generated MIME does not match actual media bytes'); }
      if(isOfficial(task) ? !officialModels.MODELS[task.model].outputKinds.includes(actual.kind) : actual.kind !== task.kind && !(task.kind !== 'image' && actual.kind === 'image')) throw Error('Generated output kind does not match the task');
      const artifactId = 'a_' + crypto.randomUUID(), filename = typeof row.filename === 'string' ? row.filename.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 120) : 'output-' + (index + 1) + '.' + actual.extension;
      const relative = path.join('assets', task.id, artifactId + '.' + actual.extension); atomic(relative, result.bytes);
      const dimensions = actual.kind==='video' ? Object.fromEntries(['width','height','encodedWidth','encodedHeight','rotationDegrees','dimensionKind','dimensionsSource','dimensionsStatus'].filter(name=>actual[name]!==undefined).map(name=>[name,actual[name]])) : actual.mime === 'image/png' ? { width: result.bytes.readUInt32BE(16), height: result.bytes.readUInt32BE(20) } : actual.width && actual.height ? {width:actual.width,height:actual.height} : actual.durationSeconds ? {durationSeconds:actual.durationSeconds} : {};
      task.artifacts.push({ id: artifactId, filename, mime: actual.mime, kind: actual.kind, byteLength: result.bytes.length, sha256: sha(result.bytes), ...dimensions, ...(isOfficial(task) ? {outputIndex:index,role:row.role || 'result',...(sourceMimeCorrected ? {sourceContentType,sourceMimeCorrected:true} : {})} : {}), _file: relative, _outputIndex: index }); changed(task);
    }
    if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
    const primaryKinds=isOfficial(task) ? officialModels.MODELS[task.model].primaryKinds || [task.kind] : [task.kind];
    if (!task.artifacts.some(artifact => primaryKinds.includes(artifact.kind) && artifact.role !== 'preview')) throw Error('Provider returned no actual primary asset for this task kind');
    if(isOfficial(task) && response.outputTree) {const project=value=>Array.isArray(value) ? value.map(project) : value && typeof value==='object' ? Number.isInteger(value.artifactIndex) ? {artifactIdIndex:value.artifactIndex} : Object.fromEntries(Object.entries(value).map(([k,v])=>[k,project(v)])) : value; task.officialOutput=project(response.outputTree);}
    if (!isOfficial(task) && (task._cpaImageProfile === 1 || task.managedStudioId)) {
      // A gateway report is distinct from both requested parameters and actual
      // verified media. Preserve only these bounded claims, never raw replies.
      const reported = reportedCpaImage(response);
      if (Object.keys(reported).length) task.providerReportedImage = reported;
      else delete task.providerReportedImage;
    }
    task.status = 'completed'; task.progress = 100; task._phase = 'terminal'; if (task.cancelRequested) task.mayContinue = false; delete task.error; changed(task);
  }
  async function work(task) {
    if (disposed || TERMINAL.has(task.status) || jobs.has(task.id)) return; const official = isOfficial(task), provider = providers[task.providerId];
    if (!official && (!provider?.enabled || provider.authMode !== 'none' && !providerKey(provider))) { delete task.transportDiagnostic; task.mayContinue = task._phase !== 'create_pending'; task.status = 'interrupted'; task.error = 'The task Provider is disabled, unavailable or missing its API key'; changed(task); return; }
    const job = { controller: new AbortController() }; jobs.set(task.id, job); let creating = !task._remoteId;
    try {
      if (creating && task._phase !== 'create_pending') { task.status = 'interrupted'; task.mayContinue = true; task.error = 'Create outcome is unknown; it will not be automatically submitted again'; changed(task); return; }
      const executor = official ? assertOfficial(task, creating) : undefined;
      if (creating) { task._phase = 'create_inflight'; changed(task); }
      let createSpec = provider?.adapter.create;
      if (!official && creating && task._managedCreate) createSpec = task._managedCreate;
      if (!official && creating && task._cpaImageProfile !== undefined) {
        if (task._cpaImageProfile !== 1 || !isCpaImageProvider(publicProvider(provider))) { const error = Error('CPA image Provider profile is unavailable or changed'); error.beforeRequest = true; throw error; }
        createSpec = CPA_IMAGE_CREATE;
      }
      let requestTask=task;
      if(!official&&creating&&task._cpaImageProfile===1) {
        const cpaPrompt=cpaImageRequestPrompt(task.parameters);
        if(task.parameters.requestSizeMode==='api-size'&&(task.prompt!==task.parameters.prompt||task.executionPrompt!==cpaPrompt||task._cpaRequestPromptSha256!==sha(Buffer.from(cpaPrompt)))){const error=Error('CPA explicit size request prompt integrity changed');error.beforeRequest=true;throw error;}
        requestTask={...task,prompt:cpaPrompt};
      }
      if(!official&&creating&&task._managedRequestPrompt!==undefined) {
        if(task.kind!=='image'||typeof task._managedRequestPrompt!=='string'||sha(Buffer.from(task.prompt))!==task._managedOriginalPromptSha256||sha(Buffer.from(task._managedRequestPrompt))!==task._managedRequestPromptSha256) {const error=Error('Managed image request prompt integrity changed');error.beforeRequest=true;throw error;}
        requestTask={...task,prompt:task._managedRequestPrompt,parameters:{...task.parameters,prompt:task._managedRequestPrompt}};
      }
      const response = official ? await executor.request(clone(task), creating, job.controller.signal) : await call(provider, creating ? createSpec : provider.adapter.poll, requestTask, job.controller.signal);
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      delete task.transportDiagnostic;
      const protocol = official ? { adapter: { selectors: { taskId: 'id', status: 'status', progress: 'progress', outputs: 'outputs', error: 'error' }, statusMap: DEFAULT_MAP } } : provider;
      const remote = select(response, protocol.adapter.selectors.taskId); if (protocol.adapter.responseMode !== 'outputs' && typeof remote === 'string' && remote && remote.length <= 2048 && !/[\u0000-\u001f]/.test(remote)) { if (official && task._remoteId && task._remoteId !== remote) throw Error('Official response changed the submitted remote task ID'); task._remoteId = remote; if (official) { task.officialTaskId = remote; changed(task); } }
      if (official) assertOfficial(task);
      if (official && !task._remoteId) { task.status = 'interrupted'; task.mayContinue = true; task._phase = 'terminal'; task.error = 'Official response has no usable remote task ID; create will not be submitted again'; changed(task); return; }
      let state = remoteState(protocol, response); const progress = select(response, protocol.adapter.selectors.progress), rawState = select(response, protocol.adapter.selectors.status);
      // A configured synchronous response has no job ID/status. Actual bounded
      // output collection is still mandatory; pending/unknown states stay honest.
      if (creating && protocol.adapter.responseMode === 'outputs' && rawState == null) state = 'completed';
      if (Number.isFinite(progress)) task.progress = Math.max(0, Math.min(100, progress));
      if (state === 'completed') { task.status = task.cancelRequested ? 'cancel_requested' : 'running'; task._phase = 'download'; changed(task); await collect(task, official ? officialDownloadProvider(task) : provider, response, job); }
      else if (state === 'failed') { task.status = 'failed'; task.mayContinue = false; task._phase = 'terminal'; const error = select(response, protocol.adapter.selectors.error); task.error = scrub(typeof error === 'string' ? error : error?.message || 'Provider task failed'); changed(task); }
      else if (state === 'cancelled') { task.status = 'cancelled'; task._phase = 'terminal'; task.remoteCancellationConfirmed = true; task.mayContinue = false; changed(task); }
      else {
        if (!task._remoteId) { task.status = 'interrupted'; task.mayContinue = true; task.error = 'Provider response has no usable remote task ID; create will not be submitted again'; changed(task); }
        else { task._phase = 'remote_poll'; task.status = task.cancelRequested ? 'cancel_requested' : state || task.status; if (!state) task.error = 'Provider status is missing or unknown; completion is not assumed'; else delete task.error; changed(task); }
      }
    } catch (error) {
      if (disposed || jobs.get(task.id) !== job || job.controller.signal.aborted) return;
      const diagnostic = transportFailures.get(error); if (diagnostic) task.transportDiagnostic = diagnostic; else delete task.transportDiagnostic;
      if (official && error.officialUnavailable) { task.status = 'interrupted'; task.mayContinue = !!task._remoteId || task._phase !== 'create_pending'; task._phase = task._remoteId ? 'remote_poll' : 'terminal'; task.error = scrub(error.message); }
      else if (task._phase === 'download') { task.status = 'failed'; task.mayContinue = false; task._phase = 'terminal'; task.error = scrub(error.message); }
      else if (creating) { const rejected = official ? error.beforeRequest === true && error.submissionUnknown !== true : error.httpStatus || error.beforeRequest; task.status = rejected ? 'failed' : 'interrupted'; task.mayContinue = !rejected; task._phase = 'terminal'; task.error = scrub(error.message + (rejected ? '' : '; create outcome is unknown and will not be resubmitted')); }
      else { task.error = scrub(error.message); task._phase = 'remote_poll'; }
      changed(task);
    } finally { if (jobs.get(task.id) === job) { jobs.delete(task.id); if (!disposed && !TERMINAL.has(task.status) && task._remoteId) schedule(task, pollInterval); } }
  }
  function createTask(data, cpaImage = false, managed) {
    if (data.providerId === 'codely-official' || data.serviceSource === 'codely-official' || data.ownerBinding !== undefined || data._officialOwner !== undefined) throw Error('Official generation requires the internal account-bound entry point');
    if (data._cpaImageProfile !== undefined || data.cpaImageProfile !== undefined || data._cpaRequestPromptSha256!==undefined || data.createSpec !== undefined || data.bodyTemplateOverride !== undefined || data._managedCreate !== undefined || data.managedStudioId !== undefined || data.providerProtocol !== undefined || data.providerParameters !== undefined || data._managedRestParameters !== undefined || data.requestPrompt !== undefined || data.executionPrompt !== undefined || data._managedRequestPrompt !== undefined || data._managedOriginalPromptSha256 !== undefined || data._managedRequestPromptSha256 !== undefined) throw Error('Generation profiles require the internal entry point');
    const providerId = id(data.providerId, 'providerId'), workspaceKey = data.workspaceKey ? text(data.workspaceKey, 'workspaceKey', 2048, true) : '', prompt = scrub(text(data.prompt, 'prompt', 32000, true)), requestedModel = data.model == null ? undefined : scrub(text(data.model, 'model', 256)), parameters = scrub(boundedJson(data.parameters || {}, 16 * 1024 * 1024));
    if (!KINDS.has(data.kind) && !(managed && data.kind === 'audio')) throw Error('Provider does not support this task kind');
    const inputIds = data.inputIds === undefined ? [] : data.inputIds; if (!Array.isArray(inputIds) || inputIds.length > 8 || new Set(inputIds).size !== inputIds.length) throw Error('Reference inputIds must contain at most eight distinct owned IDs'); inputIds.forEach(value => id(value, 'inputId')); if (data.inputs !== undefined || data.inputPaths !== undefined) throw Error('Reference inputs must use registered inputIds, never client paths or metadata');
    let idempotency;
    if (data.idempotencyKey !== undefined) {
      const key = text(data.idempotencyKey, 'idempotencyKey', 128, true); if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(key) || scrub(key) !== key) throw Error('Idempotency key must be bounded non-secret ASCII text');
      const requestSha256 = sha(stableJson({ kind: data.kind, prompt, model: requestedModel ?? null, parameters, ...(inputIds.length ? { inputIds } : {}), ...(cpaImage ? { adapterProfile: 'cpa-image-generations-v1' } : {}) }));
      const existing = Object.values(tasks).find(task => task.providerId === providerId && (task.workspaceKey || '') === workspaceKey && task._idempotency?.key === key);
      if (existing) { if (existing._idempotency.requestSha256 !== requestSha256) throw Error('Idempotency key conflicts with an existing generation request'); return { task: publicTask(existing) }; }
      idempotency = { key, requestSha256 };
    }
    const provider = Object.prototype.hasOwnProperty.call(providers, providerId) && providers[providerId]; if (!provider?.enabled || provider.authMode !== 'none' && !providerKey(provider)) throw Error('Provider is unavailable, disabled or missing its API key'); if (provider._managedRegistryRef && !managed) throw Error('Managed generation requires the internal registry entry point'); if (!provider.kinds.includes(data.kind)) throw Error('Provider does not support this task kind');
    const taskInputs = inputIds.map(inputId => { const input = inputFile(inputId, workspaceKey).input; return Object.fromEntries(Object.entries(input).filter(([key]) => !key.startsWith('_'))); });
    if (taskInputs.reduce((sum, input) => sum + input.byteLength, 0) > MAX_FILE) throw Error('Reference inputs exceed the combined 64 MiB budget');
    const create = managed?.createSpec || provider.adapter.create, used = inputTemplateIndexes(create.bodyTemplate, taskInputs.length);
    if (create.bodyType === 'multipart') for (const field of create.fileFields || []) { if (field.inputIndex === 'all') taskInputs.forEach((_, index) => used.add(index)); else { if (field.inputIndex >= taskInputs.length) throw Error('Multipart file field references an unavailable input index'); used.add(field.inputIndex); } }
    if (taskInputs.length && (create.method === 'GET' || taskInputs.some((_, index) => !used.has(index)))) throw Error('Provider create template/file fields must send every selected reference input');
    if (Object.keys(tasks).length >= 5000 || Object.values(tasks).filter(task => !TERMINAL.has(task.status)).length >= 16) throw Error('Task history/active-task limit reached');
    const now = new Date().toISOString(), task = { id: 't_' + crypto.randomUUID(), providerId: provider.id, kind: data.kind, prompt, model: requestedModel ?? scrub(text(provider.model, 'model', 256)), parameters, inputs: taskInputs, ...(workspaceKey ? { workspaceKey } : {}), status: 'queued', progress: 0, createdTime: now, updatedTime: now, discarded: false, artifacts: [], _phase: 'create_pending', ...(idempotency ? { _idempotency: idempotency } : {}), ...(cpaImage ? { _cpaImageProfile: 1 } : {}) };
    if(cpaImage&&parameters.requestSizeMode==='api-size'){task.executionPrompt=cpaImageRequestPrompt(parameters);task._cpaRequestPromptSha256=sha(Buffer.from(task.executionPrompt));}
    if(managed) {task.managedStudioId=managed.studioId;task.serviceSource='custom-provider';task._managedProviderVersion=provider._managedVersion;if(managed.createSpec)task._managedCreate=managed.createSpec;if(managed.providerParameters!==undefined){task.providerProtocol=managed.providerProtocol;task.providerParameters=managed.providerParameters;task._managedRestParameters=managed.requestParameters;}if(managed.requestPrompt!==undefined){task._managedRequestPrompt=managed.requestPrompt;task._managedOriginalPromptSha256=sha(Buffer.from(task.prompt));task._managedRequestPromptSha256=sha(Buffer.from(managed.requestPrompt));task.executionPrompt=managed.requestPrompt;}}
    task.input = { data: { prompt: task.prompt }, param: task.parameters }; tasks[task.id] = task; try { persist(); } catch (error) { delete tasks[task.id]; throw error; } schedule(task); return { task: publicTask(task) };
  }
  function saveManagedProvider(config, credentialResolver, ref, version) {
    assertRuntime(); id(ref, 'managed Provider reference'); if (typeof credentialResolver !== 'function' || typeof version !== 'string') throw Error('Invalid managed Provider credential bridge');
    const previousResolver = managedCredentials.get(ref); managedCredentials.set(ref, credentialResolver);
    try {
      const result=saveProvider({provider:config},{ref,version});
      for(const task of Object.values(tasks))if(task.providerId===config.id&&task._managedRestorePending&&task._remoteId&&task._managedProviderVersion===version&&config.enabled!==false&&(config.authMode==='none'||providerKey(providers[config.id]))) {
        delete task._managedRestorePending;task.status=task.cancelRequested?'cancel_requested':'running';task._phase='remote_poll';delete task.error;changed(task);schedule(task);
      }
      return result;
    }
    catch(error) { if(previousResolver)managedCredentials.set(ref,previousResolver);else managedCredentials.delete(ref);throw error; }
  }
  function createManagedTask(data, profile) {
    assertRuntime(); if (!profile || typeof profile.studioId !== 'string' || !/^cust_[a-f0-9]{32}$/.test(profile.studioId)) throw Error('Invalid managed model profile');
    const createSpec=profile.createSpec ? normalizeSpec(profile.createSpec) : undefined;
    let providerParameters,requestParameters;
    if(profile.providerParameters!==undefined) {if(profile.providerProtocol!=='generic-rest-task'||!profile.providerParameters||typeof profile.providerParameters!=='object'||Array.isArray(profile.providerParameters))throw Error('Managed REST parameters require a JSON object and explicit protocol');providerParameters=scrub(boundedJson(profile.providerParameters,65536));const supplied=profile.requestParameters??profile.providerParameters;if(!supplied||typeof supplied!=='object'||Array.isArray(supplied))throw Error('Managed REST request parameters must be a JSON object');requestParameters=scrub(boundedJson(supplied,65536));}
    const requestPrompt=profile.requestPrompt===undefined?undefined:scrub(text(profile.requestPrompt,'prompt',33024,true));if(requestPrompt!==undefined&&data.kind!=='image')throw Error('Managed request prompts require an image task');
    return createTask(data,false,{createSpec,studioId:profile.studioId,requestPrompt,...(providerParameters!==undefined?{providerParameters,requestParameters,providerProtocol:profile.providerProtocol}:{})});
  }
  function removeManagedProvider(ref) {
    assertRuntime();const providerId='managed_'+ref,provider=providers[providerId];if(!provider)return {deleted:false};if(provider._managedRegistryRef!==ref)throw Error('Managed Provider identity mismatch');
    if(Object.values(tasks).some(task=>task.providerId===providerId&&!TERMINAL.has(task.status)))throw Error('Finish/cancel active tasks before deleting their Provider');
    const next={...providers};delete next[providerId];atomic('providers.json',Buffer.from(JSON.stringify(next)));providers=next;managedCredentials.delete(ref);return {deleted:true};
  }
  function createCpaImageTask(data) {
    assertRuntime();
    const parameters = validateCpaImagePayload(data.parameters?.studioModelId, data.parameters), descriptor = CPA_IMAGE_MODELS[parameters.studioModelId];
    if (data.kind !== 'image' || data.model !== descriptor.model || data.prompt !== parameters.prompt) throw Error('CPA task and validated image parameters disagree');
    if (data.inputs !== undefined || data.inputPaths !== undefined || data.inputIds !== undefined && (!Array.isArray(data.inputIds) || data.inputIds.length)) throw Error('CPA image generation does not accept reference inputs');
    const provider = Object.hasOwn(providers, data.providerId) && providers[data.providerId];
    if (!provider || !isCpaImageProvider(publicProvider(provider))) throw Error('CPA image Provider profile is unavailable');
    return createTask({ ...data, parameters }, true);
  }
  function createOfficialTask(data) {
    assertRuntime();
    const descriptor=officialModels.MODELS[data.model];
    if(!descriptor || data.kind!==descriptor.kind) throw Error('Official model contract is not supported');
    if (typeof data.ownerBinding !== 'string' || !/^[a-f0-9]{64}$/.test(data.ownerBinding)) throw Error('Official task requires a verified account binding');
    if (data.inputs !== undefined || data.inputPaths !== undefined || data._remoteId !== undefined) throw Error('Official task inputs must use registered inputIds');
    const workspaceKey = inputScope(data.workspaceKey), prompt = scrub(text(data.prompt || '', 'prompt', 32000, false)), parameters = scrub(boundedJson(data.parameters || {}, 16 * 1024 * 1024)), inputIds = data.inputIds || [];
    if (!Array.isArray(inputIds) || inputIds.length > (descriptor.maxInputs ?? 16)) throw Error('Official reference inputIds exceed the model limit; Frontier permits sixteen');
    const slots=officialModels.referenceSlots(data.model,parameters);
    if(slots.length!==inputIds.length) throw Error('Official input slots do not match registered references');
    const referenceGroups=new Set(); for(let index=0;index<inputIds.length;index++){const group=inputIds[index]+':'+slots[index].pointer.replace(/\/\d+$/,''); if(referenceGroups.has(group)) throw Error('Duplicate registered reference in the same original field'); referenceGroups.add(group);}
    const taskInputs=inputIds.map((inputId,index)=>{const input=inputFile(inputId,workspaceKey).input; if(!slots[index].mediaKinds.includes(input.kind)) throw Error('Official reference media kind mismatch'); return clone(publicInput(input));});
    if (taskInputs.reduce((sum, input) => sum + input.byteLength, 0) > MAX_FILE) throw Error('Reference inputs exceed the combined 64 MiB budget');
    if (Object.keys(tasks).length >= 5000 || Object.values(tasks).filter(task => !TERMINAL.has(task.status)).length >= 16) throw Error('Task history/active-task limit reached');
    const now = new Date().toISOString(), task = { id: 't_' + crypto.randomUUID(), providerId: 'codely-official', serviceSource: 'codely-official', kind: descriptor.kind, prompt, model: data.model, parameters, inputs: taskInputs, ...(workspaceKey ? { workspaceKey } : {}), status: 'queued', progress: 0, createdTime: now, updatedTime: now, discarded: false, artifacts: [], _phase: 'create_pending', _officialOwner: data.ownerBinding };
    assertOfficial(task, true);
    task.input = { data: { prompt: task.prompt }, param: task.parameters }; tasks[task.id] = task; try { persist(); } catch (error) { delete tasks[task.id]; throw error; } schedule(task); return { task: publicTask(task) };
  }
  function attachOfficialExecutor(executor) {
    assertRuntime();
    if (!executor || !['isAvailable', 'assertOwner', 'request', 'downloadProvider'].every(key => typeof executor[key] === 'function')) throw Error('Invalid internal official executor');
    if (officialExecutor !== executor) for (const task of Object.values(tasks)) if (isOfficial(task) && !TERMINAL.has(task.status)) { stopJob(task.id); delete task.transportDiagnostic; task.mayContinue = task._phase !== 'create_pending'; task.status = 'interrupted'; task.error = 'Official executor changed; an already submitted task may continue'; if (task._remoteId) task._phase = 'remote_poll'; changed(task); }
    officialExecutor = executor;
    for (const task of Object.values(tasks)) if (isOfficial(task) && task._remoteId && task.status === 'interrupted' && ['remote_poll', 'download', 'create_inflight'].includes(task._phase)) {
      try { assertOfficial(task); task.status = task.cancelRequested ? 'cancel_requested' : 'running'; task._phase = 'remote_poll'; delete task.error; changed(task); schedule(task); } catch {}
    }
  }
  function resumeOfficialTask(data) {
    assertRuntime(); const task=taskById(data.taskId);
    if(!isOfficial(task) || !task._remoteId) throw Error('Only a recorded official remote task can resume; create is never repeated');
    if(inputScope(data.workspaceKey)!==(task.workspaceKey || '')) throw Error('Official task is not owned by the requested workspace');
    assertOfficial(task);
    if(task.status==='completed' || jobs.has(task.id)) return {task:publicTask(task),resumed:false};
    task.status='running'; task._phase='remote_poll'; task.cancelRequested=false; task.mayContinue=true; delete task.error; delete task.transportDiagnostic;
    changed(task); schedule(task); return {task:publicTask(task),resumed:true,createRepeated:false};
  }
  function officialReconciliationTask(taskId,workspaceKey) {
    assertRuntime(); const task=taskById(taskId);
    if(!isOfficial(task) || inputScope(workspaceKey)!==(task.workspaceKey || '')) throw Error('Official task scope is not owned');
    assertOfficial(task); return clone(task);
  }
  function adoptOfficialRemoteTask(taskId,workspaceKey,remoteId) {
    const task=officialReconciliationTask(taskId,workspaceKey);
    if(typeof remoteId!=='string' || !/^[A-Za-z0-9_-]{1,200}$/.test(remoteId) || task._remoteId && task._remoteId!==remoteId) throw Error('Reconciliation cannot replace a remote task identity');
    if(task._remoteId) return {task:publicTask(task),createRepeated:false};
    if(task.status!=='interrupted' || task._phase!=='terminal' || task.mayContinue!==true || jobs.has(taskId)) throw Error('Only an uncertain completed submission can reconcile');
    const owned=taskById(taskId); owned._remoteId=remoteId; owned.officialTaskId=remoteId; owned._phase='remote_poll'; owned.status='interrupted'; owned.mayContinue=true;
    owned.error='An existing remote task was reconciled; only query/download may resume'; changed(owned);
    return {task:publicTask(owned),createRepeated:false};
  }
  async function cancelTask(data) {
    const task = taskById(data.taskId); if (TERMINAL.has(task.status)) return { task: publicTask(task), remoteCancellationConfirmed: task.remoteCancellationConfirmed === true, mayContinue: task.mayContinue === true };
    const pending = jobs.get(task.id); if (pending?.kind === 'cancel') return pending.promise;
    stopJob(task.id); delete task.transportDiagnostic; task.cancelRequested = true;
    if (!task._remoteId && task._phase === 'create_pending' || task._phase === 'download') { task.status = 'cancelled'; task._phase = 'terminal'; task.remoteCancellationConfirmed = false; task.mayContinue = false; changed(task); return { task: publicTask(task), remoteCancellationConfirmed: false, mayContinue: false }; }
    task.status = 'cancel_requested'; task.remoteCancellationConfirmed = false; task.mayContinue = true; changed(task);
    const provider = providers[task.providerId];
    if (!task._remoteId || !provider?.adapter.cancel) { task.status = task._remoteId ? 'cancel_requested' : 'interrupted'; task.error = task._remoteId ? 'This Provider has no cancellation route; remote generation may continue' : 'Create was interrupted before a remote ID was received; generation may continue remotely'; changed(task); if (task._remoteId) schedule(task, pollInterval); return { task: publicTask(task), remoteCancellationConfirmed: false, mayContinue: true }; }
    const job = { kind: 'cancel', controller: new AbortController(), promise: null }; jobs.set(task.id, job);
    const current = () => !disposed && jobs.get(task.id) === job && !job.controller.signal.aborted;
    job.promise = (async () => {
      try {
        try { const response = await call(provider, provider.adapter.cancel, task, job.controller.signal, 'cancel'); if (!current()) throw Error('Cancellation was interrupted; remote generation may continue'); delete task.transportDiagnostic; if (remoteState(provider, response) === 'cancelled') { task.status = 'cancelled'; task._phase = 'terminal'; task.remoteCancellationConfirmed = true; task.mayContinue = false; delete task.error; } else task.error = 'Provider did not confirm cancellation; remote generation may continue'; }
        catch (error) { if (!current()) throw Error('Cancellation was interrupted; remote generation may continue'); const diagnostic = transportFailures.get(error); if (diagnostic) task.transportDiagnostic = diagnostic; else delete task.transportDiagnostic; task.error = scrub(error.message + '; remote generation may continue'); }
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
  for (const task of Object.values(tasks)) if (!TERMINAL.has(task.status)) { if (task._remoteId) { if (isOfficial(task) || providers[task.providerId]?._managedRegistryRef) { task.status = 'interrupted'; task.mayContinue = true; task._phase = 'remote_poll'; if(providers[task.providerId]?._managedRegistryRef)task._managedRestorePending=true;task.error = 'Task awaits its submitting account/Provider before querying its recorded remote ID'; changed(task); } else schedule(task); } else { task.status = 'interrupted'; task.mayContinue = task._phase !== 'create_pending'; task.error = 'Process restarted before a remote task ID was recorded; create is not resubmitted'; task._phase = 'terminal'; changed(task); } }
  async function dispatch(kind, data = {}) {
    if (disposed) throw Error('Asset service is closed'); owner.assert(); if (fatalError) throw Error('Asset runtime unavailable: ' + scrub(fatalError.message));
    switch (kind) {
      case 'generator/listProviders': return { providers: Object.values(providers).map(publicProvider) };
      case 'generator/resumeOfficialTask': return resumeOfficialTask(data);
      case 'generator/getInputs': { const scope = inputScope(data.workspaceKey); return { inputs: Object.values(inputs).filter(input => input.workspaceKey === scope).sort((a, b) => b.createdTime.localeCompare(a.createdTime)).map(publicInput) }; }
      case 'generator/getInput': return { input: publicInput(inputFile(data.inputId, data.workspaceKey).input) };
      case 'generator/deleteInput': return deleteInput(data);
      case 'generator/saveProvider': return saveProvider(data);
      case 'generator/deleteProvider': { const providerId = id(data.providerId, 'providerId'); if(providers[providerId]?._managedRegistryRef)throw Error('Managed Providers require the internal registry entry point'); if (Object.values(tasks).some(task => task.providerId === providerId && !TERMINAL.has(task.status))) throw Error('Finish/cancel active tasks before deleting their Provider'); const deleted = Object.prototype.hasOwnProperty.call(providers, providerId); if (deleted) { const next = { ...providers }; delete next[providerId]; atomic('providers.json', Buffer.from(JSON.stringify(next))); providers = next; } return { deleted }; }
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
  return { dispatch, getArtifactPath, registerInput, importOwnedArtifactInput, attachOfficialExecutor, createOfficialTask, createCpaImageTask, saveManagedProvider, createManagedTask, removeManagedProvider, officialReconciliationTask, adoptOfficialRemoteTask, assertRuntime, inspectInputBytes(bytes, hints = {}) { assertRuntime(); if (!Buffer.isBuffer(bytes) || !bytes.length || bytes.length > MAX_FILE) throw Error('Reference file must contain 1 byte to 64 MiB'); return mediaType(bytes,hints); }, getOwnedSnapshot() { assertRuntime(); return { tasks: Object.values(tasks).map(publicTask), inputs: Object.values(inputs).map(publicInput) }; }, getInputPath(inputId, workspaceKey) { assertRuntime(); const { input, file } = inputFile(inputId, workspaceKey); return { ...publicInput(input), path: file }; }, async close() { disposed = true; for (const timer of timers.values()) clearTimeout(timer); timers.clear(); for (const job of jobs.values()) job.controller.abort(); jobs.clear(); managedCredentials.clear(); owner.release(); }, root: directory };
  } catch (error) { owner.release(); throw error; }
}
module.exports = { createAssetService };
