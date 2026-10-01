// Restore only the public parser assets required by the recovered local worker.
// The reference installation is read-only; no Agent executable or user state is copied.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const project=fileURLToPath(new URL('../',import.meta.url));
const input=path.join(project,'original/Tuanjie Cowork/cli/bin/win32-x64/lib/node_modules');
const output=path.join(project,'restored/cli-unity-insight/resources');
const items=[
 ['web-tree-sitter/tree-sitter.js','web-tree-sitter/tree-sitter.cjs'],
 ['web-tree-sitter/tree-sitter.wasm','web-tree-sitter/tree-sitter.wasm'],
 ['web-tree-sitter/LICENSE','web-tree-sitter/LICENSE'],
 ['tree-sitter-wasms/out/tree-sitter-c_sharp.wasm','tree-sitter-c_sharp.wasm'],
 ['tree-sitter-wasms/LICENSE','c-sharp-grammar-LICENSE'],
];
const assets=[];
for(const [source,destination] of items){
 const bytes=fs.readFileSync(path.join(input,source));
 if(destination.endsWith('.wasm')&&!WebAssembly.validate(bytes))throw Error(`Invalid source WebAssembly: ${source}`);
 const target=path.join(output,destination);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
 assets.push({source:`original/Tuanjie Cowork/cli/bin/win32-x64/lib/node_modules/${source}`,path:destination,
  bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const versions=['web-tree-sitter','tree-sitter-wasms'].map(name=>{
 const metadata=JSON.parse(fs.readFileSync(path.join(input,name,'package.json'),'utf8'));
 return{name:metadata.name,version:metadata.version,license:metadata.license};
});
const workerDirectory=path.join(project,'original/Tuanjie Cowork/cli/bin/win32-x64/lib/bundle');
const workers=['unity-insight-cli.js','indexBuildWorker.js','indexSyncWorker.js','sqliteQueryWorker.js','yamlExtractWorker.js','shimmer-worker.js'].map(name=>{
 const bytes=fs.readFileSync(path.join(workerDirectory,name));
 return {source:'original/Tuanjie Cowork/cli/bin/win32-x64/lib/bundle/'+name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),purpose:'Read-only original worker reference; maintained restoration includes explicit parser paths, isolated cache/home and scope guard.'};
});
fs.writeFileSync(path.join(output,'restore-manifest.json'),JSON.stringify({purpose:'Local C# syntax extraction for restored Unity Insight workers; no network or model inference.',workerVersion:'0.0.1',workerGitCommit:'6e92ad2ce0a2918d63e1faeb5e76d6660fdf8143',versions,assets,workers},null,2)+'\n');
console.log(JSON.stringify({output,assets:assets.length,versions}));
