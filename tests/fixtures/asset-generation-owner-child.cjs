'use strict';
// Own lifecycle/lock fixture only; no Provider is configured or called.
const path = require('node:path');
const { createAssetService } = require('../../src/core/binary/out/modules/generation/service.js');
const root = path.resolve(process.argv[2] || '');
if (!root.toLowerCase().startsWith(path.resolve('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work').toLowerCase() + path.sep)) throw Error('Owned temp root required');
let service;
try { service = createAssetService({ root }); process.stdout.write(JSON.stringify({ event: 'ready', pid: process.pid }) + '\n'); }
catch (error) { process.stdout.write(JSON.stringify({ event: 'rejected', message: error.message }) + '\n'); process.exitCode = 3; }
if (service) { process.stdin.setEncoding('utf8'); process.stdin.on('data', async value => { if (value.trim() === 'close') { await service.close(); process.stdin.pause(); process.exit(0); } }); }
