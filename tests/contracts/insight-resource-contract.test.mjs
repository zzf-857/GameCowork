import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { insightHome, indexDirectory } from '../../src/unity-insight/bundle/gamecowork-worker-paths.js';
const project=fileURLToPath(new URL('../../',import.meta.url)),source=path.join(project,'src/unity-insight');
const run=path.resolve(project,'codelyreversebackup/work','insight-contract-'+randomUUID()),fixture=path.join(run,'project'),cache=path.join(run,'cache'),outside=path.join(run,'outside');
for(const directory of[fixture,cache,outside])fs.mkdirSync(directory,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(source,'resources/restore-manifest.json')));
for(const asset of manifest.assets){const bytes=fs.readFileSync(path.join(source,'resources',asset.path));assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);if(asset.path.endsWith('.wasm'))assert.ok(WebAssembly.validate(bytes));}
console.log('Restored parser bytes, licenses and actual WASM validate: PASS');
for(const worker of manifest.workers)assert.equal(createHash('sha256').update(fs.readFileSync(path.join(project,worker.source))).digest('hex'),worker.sha256);
assert.equal(manifest.workerVersion,'0.0.1');assert.equal(manifest.workerGitCommit,'6e92ad2ce0a2918d63e1faeb5e76d6660fdf8143');console.log('Read-only worker provenance and reported version are recorded: PASS');
assert.equal(insightHome({UNITY_INSIGHT_HOME:cache},()=>{throw Error('Must not access system homedir');}),cache);assert.equal(insightHome({},()=>outside),outside);
const oldHome=process.env.UNITY_INSIGHT_HOME,oldIndex=process.env.GAMECOWORK_INSIGHT_INDEX_DIR;process.env.UNITY_INSIGHT_HOME=cache;delete process.env.GAMECOWORK_INSIGHT_INDEX_DIR;
try{const target=indexDirectory(fixture,'must-not-be-used');assert.ok(target.startsWith(cache+path.sep));assert.equal(indexDirectory(path.join(fixture,'.'),'ignored'),target);process.env.GAMECOWORK_INSIGHT_INDEX_DIR=outside;assert.throws(()=>indexDirectory(fixture,'ignored'),/owned Insight home/);}finally{if(oldHome===undefined)delete process.env.UNITY_INSIGHT_HOME;else process.env.UNITY_INSIGHT_HOME=oldHome;if(oldIndex===undefined)delete process.env.GAMECOWORK_INSIGHT_INDEX_DIR;else process.env.GAMECOWORK_INSIGHT_INDEX_DIR=oldIndex;}
console.log('Explicit home is lazy and canonical cache rejects escape: PASS');
fs.writeFileSync(path.join(outside,'secret.txt'),'OWN_TEST_SENTINEL');fs.symlinkSync(outside,path.join(fixture,'escape'),'junction');
const probe=`const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'); const root=process.env.GAMECOWORK_INSIGHT_PROJECT,home=process.env.UNITY_INSIGHT_HOME; for(const fn of[()=>fs.readFileSync(path.join(root,'escape/secret.txt')),()=>fs.writeFileSync(path.join(root,'created.txt'),'bad'),()=>require('node:child_process').spawn('must-not-run',[])]) assert.throws(fn,/blocked/); fs.writeFileSync(path.join(home,'permitted.txt'),'OWN_CACHE'); assert.equal(fs.readFileSync(path.join(home,'permitted.txt'),'utf8'),'OWN_CACHE'); console.log('guard scope ok');`;
const result=spawnSync(process.execPath,['--require',path.join(source,'bundle/gamecowork-worker-guard.cjs'),'-e',probe],{env:{...process.env,GAMECOWORK_INSIGHT_PROJECT:fixture,UNITY_INSIGHT_HOME:cache},windowsHide:true,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);assert.ok(!fs.existsSync(path.join(fixture,'created.txt')));assert.equal(fs.readFileSync(path.join(outside,'secret.txt'),'utf8'),'OWN_TEST_SENTINEL');console.log('Real preload rejects junction reads, project writes and child commands: PASS');
console.log(JSON.stringify({passed:4,run}));
