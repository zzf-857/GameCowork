// Loopback-only custom asset Provider. It serves owned, decodable media and
// remote task lifecycles; no production Provider, account or user files are used.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import assert from 'node:assert/strict';

const fixtureArea = path.resolve('F:/AI/AgentMake/temp/GameCowork');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function ownRoot(value) {
  const root = path.resolve(value);
  assert.ok(root.toLowerCase().startsWith(fixtureArea.toLowerCase() + path.sep), 'Owned asset fixture stays in temp/GameCowork');
  fs.mkdirSync(root, { recursive: true });
  for (let current = root; current.toLowerCase() !== fixtureArea.toLowerCase(); current = path.dirname(current))
    assert.ok(!fs.lstatSync(current).isSymbolicLink(), 'Owned asset fixture refuses linked directories');
  return root;
}

// The PNG/GLB construction follows the existing owned file-media-e2e fixture.
// MP4/WebM are actually encoded by the already-installed local FFmpeg.
export function createOwnedGenerationMedia(rootValue, { ffmpeg = 'ffmpeg' } = {}) {
  const root = ownRoot(rootValue), folder = path.join(root, 'provider-media');
  fs.mkdirSync(folder, { recursive: true });
  const paths = Object.fromEntries(['png', 'glb', 'mp4', 'webm'].map(extension => [extension, path.join(folder, 'owned.' + extension)]));
  for (const file of Object.values(paths)) assert.ok(!fs.existsSync(file), 'Existing owned media is preserved: ' + file);
  const crc = bytes => { let value = 0xffffffff; for (const byte of bytes) { value ^= byte; for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0); } return (value ^ 0xffffffff) >>> 0; };
  const chunk = (kind, data) => { const label = Buffer.from(kind), result = Buffer.alloc(data.length + 12); result.writeUInt32BE(data.length, 0); label.copy(result, 4); data.copy(result, 8); result.writeUInt32BE(crc(Buffer.concat([label, data])), data.length + 8); return result; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(48, 0); ihdr.writeUInt32BE(32, 4); ihdr[8] = 8; ihdr[9] = 6;
  const rgba = Buffer.alloc((48 * 4 + 1) * 32); for (let y = 0; y < 32; y++) for (let x = 0; x < 48; x++) { const offset = y * (48 * 4 + 1) + 1 + x * 4; rgba[offset] = 20 + x * 4; rgba[offset + 1] = 150; rgba[offset + 2] = 170; rgba[offset + 3] = 255; }
  fs.writeFileSync(paths.png, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(rgba)), chunk('IEND', Buffer.alloc(0))]), { flag: 'wx' });
  const positions = Buffer.from(new Float32Array([-.6, 0, 0, .6, 0, 0, 0, .8, 0]).buffer);
  const gltf = { asset: { version: '2.0', generator: 'GameCowork owned asset Provider fixture' }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }], meshes: [{ primitives: [{ attributes: { POSITION: 0 }, material: 0 }] }], materials: [{ doubleSided: true, pbrMetallicRoughness: { baseColorFactor: [.1, .8, .5, 1], metallicFactor: 0, roughnessFactor: 1 } }], buffers: [{ byteLength: positions.length }], bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: positions.length, target: 34962 }], accessors: [{ bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [-.6, 0, 0], max: [.6, .8, 0] }] };
  const json = Buffer.from(JSON.stringify(gltf)), padded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]), glb = Buffer.alloc(28 + padded.length + positions.length);
  glb.writeUInt32LE(0x46546c67, 0); glb.writeUInt32LE(2, 4); glb.writeUInt32LE(glb.length, 8); glb.writeUInt32LE(padded.length, 12); glb.writeUInt32LE(0x4e4f534a, 16); padded.copy(glb, 20); glb.writeUInt32LE(positions.length, 20 + padded.length); glb.writeUInt32LE(0x004e4942, 24 + padded.length); positions.copy(glb, 28 + padded.length);
  fs.writeFileSync(paths.glb, glb, { flag: 'wx' });
  execFileSync(ffmpeg, ['-nostdin', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x17b89a:s=32x32:d=1.5', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', paths.mp4], { windowsHide: true, timeout: 30000 });
  execFileSync(ffmpeg, ['-nostdin', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x17b89a:s=32x32:d=1.5', '-c:v', 'libvpx-vp9', '-an', paths.webm], { windowsHide: true, timeout: 30000 });
  const mime = { png: 'image/png', glb: 'model/gltf-binary', mp4: 'video/mp4', webm: 'video/webm' };
  return Object.fromEntries(Object.entries(paths).map(([extension, file]) => { const bytes = fs.readFileSync(file); return [extension, { extension, file, bytes, mimeType: mime[extension], fileName: path.basename(file), size: bytes.length, sha256: sha(bytes) }]; }));
}

export async function startAssetGenerationProvider({ root, media, plans = {}, apiKey = 'owned-fixture-' + randomUUID(), authMode = 'bearer', apiKeyHeader = 'X-API-Key' } = {}) {
  assert.ok(['none', 'bearer', 'header'].includes(authMode), 'Owned fixture authentication mode');
  const directory = ownRoot(root || path.join(fixtureArea, 'tests', 'asset-provider-' + randomUUID())), assets = media || createOwnedGenerationMedia(directory);
  const requests = [], tasks = new Map(), sockets = new Set(), timers = new Set(); let baseUrl, sequence = 0;
  const sanitize = value => {
    if (typeof value === 'string') return /^data:[^,]+;base64,/.test(value) ? '<owned-inline-media>' : value.replaceAll(apiKey, '<fixture-key>');
    if (Array.isArray(value)) return value.map(sanitize);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /api.?key|authorization|token|secret|password/i.test(key) ? '<redacted>' : sanitize(item)]));
    return value;
  };
  const send = (response, status, value, headers = {}) => { if (!response.destroyed) { response.writeHead(status, { 'Content-Type': 'application/json', ...headers }); response.end(JSON.stringify(sanitize(value))); } };
  const outputs = (kind, plan) => {
    const extensions = plan.extensions || (plan.multiple ? kind === 'image' ? ['png', 'png'] : kind === 'video' ? ['mp4', 'webm'] : ['glb', 'png'] : [kind === 'image' ? 'png' : kind === 'video' ? 'mp4' : 'glb']);
    return extensions.map((extension, index) => { const asset = assets[extension]; assert.ok(asset, 'Owned output extension exists'); return { id: 'owned-output-' + index, filename: asset.fileName, mime: plan.mimeOverride || asset.mimeType, size: asset.size, sha256: asset.sha256, ...(plan.base64 ? { base64: asset.bytes.toString('base64') } : { url: baseUrl + '/artifacts/' + (plan.oversized ? 'oversized' : extension) }) }; });
  };
  const snapshot = task => ({ id: task.id, status: task.status, progress: task.progress, ...(task.status === 'completed' ? { outputs: outputs(task.kind, task.plan) } : {}), ...(task.status === 'failed' ? { error: { code: 'owned_generation_failure', message: 'Owned fixture generation failed' } } : {}) });
  const taskWire = (task, result = snapshot(task)) => task.plan.wrap ? { [task.plan.wrap]: result } : result;
  const server = http.createServer(async (request, response) => {
    try {
      const target = new URL(request.url, baseUrl), route = target.pathname;
      const contentType = request.headers['content-type'] || '', multipart = /^multipart\/form-data;/i.test(contentType), inputFiles = [];
      let body, byteCount = 0, chunks = []; for await (const bytes of request) { byteCount += bytes.length; if (byteCount > (multipart ? 65 : 1) * 1024 * 1024) { send(response, 413, { error: 'Fixture body exceeds its request budget' }); return; } chunks.push(bytes); }
      try {
        if (multipart) {
          body = {}; const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } }).formData();
          for (const [field, value] of form.entries()) {
            if (typeof value === 'string') body[field] = value;
            else { const bytes = Buffer.from(await value.arrayBuffer()); inputFiles.push({ field, filename: value.name, mime: value.type, byteLength: bytes.length, sha256: sha(bytes) }); }
          }
        } else body = chunks.length ? JSON.parse(Buffer.concat(chunks)) : {};
      } catch { send(response, 400, { error: multipart ? 'Invalid multipart body' : 'Invalid JSON' }); return; }
      if (typeof body.imageData === 'string' && /^data:[^,]+;base64,/.test(body.imageData)) { const [header, encoded] = body.imageData.split(','), bytes = Buffer.from(encoded, 'base64'); inputFiles.push({ field: 'imageData', mime: header.slice(5, -7), byteLength: bytes.length, sha256: sha(bytes) }); }
      const authorized = authMode === 'none' || (authMode === 'bearer' ? request.headers.authorization === 'Bearer ' + apiKey : request.headers[apiKeyHeader.toLowerCase()] === apiKey);
      const record = { method: request.method, path: route, authorized, authHeaderPresent: !!(request.headers.authorization || request.headers[apiKeyHeader.toLowerCase()]), body: sanitize(body), ...(inputFiles.length ? { inputFiles } : {}), ...(multipart ? { multipart: true } : {}), at: Date.now() }; requests.push(record);
      if (request.method === 'GET' && route.startsWith('/artifacts/')) {
        if (route === '/artifacts/oversized') { response.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': 64 * 1024 * 1024 + 1 }); response.end(assets.png.bytes); return; }
        const asset = assets[route.slice('/artifacts/'.length)]; if (!asset) { send(response, 404, { error: 'Owned output not found' }); return; }
        response.writeHead(200, { 'Content-Type': asset.mimeType, 'Content-Length': asset.size, 'Cache-Control': 'no-store' }); response.end(asset.bytes); return;
      }
      if (!authorized) { send(response, 401, { error: 'Fixture authentication required' }); return; }
      if (request.method === 'POST' && (route === '/tasks' || route === '/images/generations' || route === '/images/edits')) {
        const prompt = typeof body.prompt === 'string' ? body.prompt : '', key = Object.keys(plans).sort((a, b) => b.length - a.length).find(value => prompt.includes(value));
        const plan = plans[key] || {}, kind = plan.kind || body.modelKind || body.kind || (route.startsWith('/images/') ? 'image' : undefined); record.planKey = key;
        if (!['image', 'video', 'model'].includes(kind)) { send(response, 400, { error: 'kind must be image, video or model' }); return; }
        if (plan.unsafeEchoKeyError) { response.writeHead(503, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: { message: apiKey } })); return; }
        if (plan.createStatus) { send(response, plan.createStatus, { error: plan.error || 'Owned deliberate create failure' }, plan.createStatus === 429 ? { 'Retry-After': '1' } : {}); return; }
        if (plan.holdCreate) { record.held = true; return; }
        const id = 'owned-task-' + (++sequence) + '-' + randomUUID(), immediate = plan.immediate ?? kind === 'image';
        const task = { id, kind, plan, key, status: immediate ? 'completed' : 'queued', progress: immediate ? 100 : 0, pollCount: 0, cancelCount: 0, input: sanitize(body) }; tasks.set(id, task); record.taskId = id;
        const complete = () => {
          if (route.startsWith('/images/')) send(response, 200, { created: Math.floor(Date.now() / 1000), data: outputs('image', { ...plan, base64: true }).map(row => ({ b64_json: row.base64 })) });
          else send(response, 200, taskWire(task));
        };
        if (plan.createDelayMs) { assert.ok(Number.isInteger(plan.createDelayMs) && plan.createDelayMs > 0 && plan.createDelayMs <= 30000); const timer = setTimeout(() => { timers.delete(timer); complete(); }, plan.createDelayMs); timers.add(timer); response.once('close', () => { clearTimeout(timer); timers.delete(timer); }); } else complete();
        return;
      }
      const id = route.match(/^\/tasks\/(owned-task-[a-z0-9-]+)$/)?.[1], task = id && tasks.get(id);
      if (!task) { send(response, 404, { error: 'Owned task not found' }); return; } record.taskId = id;
      if (request.method === 'DELETE') {
        task.cancelCount++;
        if (task.plan.cancelConflict) { send(response, 409, { error: 'Owned running task cannot be cancelled', remoteCancelled: false }); return; }
        if (task.status === 'completed') { send(response, 409, { error: 'Owned task already completed', remoteCancelled: false }); return; }
        task.status = 'cancelled'; task.progress = 0; send(response, 200, taskWire(task, { ...snapshot(task), remoteCancelled: true })); return;
      }
      if (request.method !== 'GET') { send(response, 405, { error: 'Owned method not supported' }); return; }
      task.pollCount++;
      if (task.plan.pollHttpStatus) { send(response, task.plan.pollHttpStatus, { error: 'Owned deliberate poll error' }); return; }
      if (!['completed', 'cancelled'].includes(task.status)) {
        const threshold = task.plan.pendingPolls ?? 1;
        task.status = task.pollCount <= threshold ? 'processing' : task.plan.fail ? 'failed' : 'completed'; task.progress = task.status === 'processing' ? 35 : task.status === 'completed' ? 100 : 35;
      }
      const result = snapshot(task), override = task.plan.statusSequence?.[task.pollCount - 1];
      if (task.plan.statusSequence && task.pollCount <= task.plan.statusSequence.length) { if (override === null) delete result.status; else result.status = override; }
      send(response, 200, taskWire(task, result));
    } catch (error) { send(response, 500, { error: error.message }); }
  });
  server.on('connection', socket => { sockets.add(socket); socket.once('close', () => sockets.delete(socket)); });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); }); baseUrl = 'http://127.0.0.1:' + server.address().port;
  return { baseUrl, apiKey, requests, tasks, media: assets, root: directory, async close() { for (const timer of timers) clearTimeout(timer); for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); } };
}
