// Large, valid, owned PNG through the actual HTTP/base64/cache path.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { deflateSync } from 'node:zlib';
import { randomUUID, createHash } from 'node:crypto';
const require = createRequire(import.meta.url), { createAssetService } = require('../../src/core/binary/out/gamecowork-assets.js');
const root = path.resolve('F:/AI/AgentMake/temp/GameCowork/tests/asset-large-output-' + randomUUID());
const crcTable = new Uint32Array(256); for (let i = 0; i < 256; i++) { let value = i; for (let bit = 0; bit < 8; bit++) value = value >>> 1 ^ (value & 1 ? 0xedb88320 : 0); crcTable[i] = value; }
function chunk(name, payload) { const bytes = Buffer.alloc(payload.length + 12); bytes.writeUInt32BE(payload.length); bytes.write(name, 4); payload.copy(bytes, 8); let crc = 0xffffffff; for (let i = 4; i < bytes.length - 4; i++) crc = crc >>> 8 ^ crcTable[(crc ^ bytes[i]) & 255]; bytes.writeUInt32BE((crc ^ 0xffffffff) >>> 0, bytes.length - 4); return bytes; }
const width = 2048, height = 1700, row = Buffer.alloc(width * 4), pixels = Buffer.alloc((row.length + 1) * height); row.fill(Buffer.from([16, 144, 224, 255])); for (let y = 0; y < height; y++) row.copy(pixels, y * (row.length + 1) + 1);
const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels, { level: 0 })), chunk('IEND', Buffer.alloc(0))]);
const base64 = png.toString('base64'), sha = bytes => createHash('sha256').update(bytes).digest('hex'), cases = new Map([['large', base64], ['large-invalid-end', base64.slice(0, -4) + 'AA=A']]);
let server, service, creates = 0; const sockets = new Set();
test.before(async () => {
  assert.ok(png.length > 13 * 1024 * 1024, 'Regression really crosses the previous multi-MiB regex stack boundary');
  server = http.createServer(async (request, response) => {
    const chunks = []; for await (const bytes of request) chunks.push(bytes); const body = JSON.parse(Buffer.concat(chunks)); creates++;
    const encoded = cases.get(body.prompt); assert.equal(typeof encoded, 'string');
    const result = JSON.stringify({ status: 'completed', outputs: [{ base64: encoded, mime: 'image/png' }] });
    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(result) }); response.end(result);
  });
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  service = createAssetService({ root: path.join(root, 'runtime'), pollIntervalMs: 20, requestTimeoutMs: 30000 });
  await service.dispatch('generator/saveProvider', { provider: { id: 'owned', name: 'Owned large image endpoint', baseUrl: 'http://127.0.0.1:' + server.address().port, kinds: ['image'], authMode: 'none', model: 'owned' } });
});
test.after(async () => { await service?.close(); for (const socket of sockets) socket.destroy(); await new Promise(resolve => server.close(resolve)); });
async function generate(prompt) {
  const { task: queued } = await service.dispatch('generator/createTask', { providerId: 'owned', kind: 'image', prompt }); const deadline = Date.now() + 10000;
  for (;;) { const { task } = await service.dispatch('generator/getTask', { taskId: queued.id }); if (['completed','failed','interrupted'].includes(task.status)) return task; if (Date.now() > deadline) throw Error('Owned large-output deadline'); await new Promise(resolve => setTimeout(resolve, 10)); }
}

test('A 13 MiB PNG returned as 18 MiB base64 completes through actual HTTP and exact cached bytes', async () => {
  const task = await generate('large'); assert.equal(task.status, 'completed', task.error); assert.equal(task.artifacts.length, 1); assert.equal(task.artifacts[0].byteLength, png.length); assert.equal(task.artifacts[0].sha256, sha(png));
  const resource = await service.dispatch('generator/getResource', { taskId: task.id, artifactId: task.artifacts[0].id }); assert.equal(resource.mime, 'image/png'); assert.equal(sha(Buffer.from(resource.base64, 'base64')), sha(png));
  const cached = service.getArtifactPath(task.id, task.artifacts[0].id); assert.equal(sha(fs.readFileSync(cached.path)), sha(png));
  assert.equal(creates, 1);
});

test('A padding error near the end of a multi-MiB output fails without stack overflow or artifacts', async () => {
  const task = await generate('large-invalid-end'); assert.equal(task.status, 'failed'); assert.equal(task.artifacts.length, 0); assert.match(task.error, /Invalid\/oversized base64/); assert.doesNotMatch(task.error, /stack/i);
});

test('Invalid alphabet, lengths, embedded padding and excessive trailing padding are rejected', async () => {
  let index = 0;
  for (const encoded of ['A', 'AA', 'AAA', 'A===', '====', 'AA===', 'AA=A', '=AAA', 'AA==AAAA', 'AAA-', 'AAA_', 'AA A', 'AA\nA', 'AAA\u0100']) {
    const prompt = 'invalid-' + index++; cases.set(prompt, encoded); const task = await generate(prompt); assert.equal(task.status, 'failed'); assert.equal(task.artifacts.length, 0); assert.match(task.error, /Invalid\/oversized base64/);
  }
});

test('Zero, one and two valid trailing padding characters pass grammar and reach media validation', async () => {
  let index = 0;
  for (const encoded of ['QUJDREVG', 'QUJDREU=', 'QUJDRA==']) {
    const prompt = 'valid-padding-' + index++; cases.set(prompt, encoded); const task = await generate(prompt); assert.equal(task.status, 'failed'); assert.match(task.error, /media is incomplete/); assert.doesNotMatch(task.error, /base64/);
  }
});
