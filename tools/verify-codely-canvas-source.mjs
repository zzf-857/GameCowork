// Read-only import verification. Parse original JavaScript as data; never import
// or evaluate an application bundle, follow a URL, or inspect account state.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import babel from './node_modules/prettier/plugins/babel.mjs';

const defaultRoot=fileURLToPath(new URL('../src/frontend/bundle/codely-canvas/',import.meta.url));
const originalMainSha='037278e934adbf3e999f1205bd656ebf3cf87f68fd6bdcd32b7f446928fd8b82';
const originalBindings=new Set(['fQ','uB','aB','YE','Mz','Pz','Bz','Hz','Wz','Kz','Yz','Zz','$z','nB','GR','tI','HI','hI','HF','jB','jw','sF','YZ','jZ']);
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const relativePath=value=>typeof value==='string'&&value.length>0&&value.length<=2048&&!/[\\\u0000-\u001f:#?]/.test(value)&&!path.posix.isAbsolute(value)&&path.posix.normalize(value)===value&&!value.split('/').includes('..');
const stringValue=node=>node?.type==='StringLiteral'?node.value:node?.type==='TemplateLiteral'&&!node.expressions.length?node.quasis[0].value.cooked:null;
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const[key,value]of Object.entries(node))if(!['loc','extra','comments','tokens'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit);}}
function collectFiles(root,errors,sub=''){
  const files=[];
  for(const entry of fs.readdirSync(path.join(root,sub),{withFileTypes:true})){
    const relative=sub?sub+'/'+entry.name:entry.name,full=path.join(root,relative),stat=fs.lstatSync(full);
    if(stat.isSymbolicLink()){errors.push('Linked source input is unsupported: '+relative);continue;}
    if(stat.isDirectory())files.push(...collectFiles(root,errors,relative));
    else if(stat.isFile())files.push(relative);
    else errors.push('Non-regular source input: '+relative);
  }
  return files;
}

export async function verifyCodelyCanvasSource(root=defaultRoot){
  const errors=[],warnings=[],known=new Map(),bytesByFile=new Map();
  root=path.resolve(root);
  const ledger=JSON.parse(fs.readFileSync(path.join(root,'source-ledger.json'),'utf8'));
  for(const entry of [...ledger.entries,...ledger.ownedFiles]){
    if(!relativePath(entry.file)){errors.push('Invalid ledger path');continue;}
    if(known.has(entry.file)){errors.push('Duplicate ledger path: '+entry.file);continue;}
    known.set(entry.file,entry);
    const full=path.join(root,entry.file);
    if(!fs.existsSync(full)){errors.push('Missing source input: '+entry.file);continue;}
    if(fs.lstatSync(full).isSymbolicLink()){errors.push('Linked source input: '+entry.file);continue;}
    const bytes=fs.readFileSync(full);bytesByFile.set(entry.file,bytes);
    const expected=entry.currentSha256||entry.sha256;
    if(!/^[a-f0-9]{64}$/.test(expected||'')||digest(bytes)!==expected)errors.push('Current SHA mismatch: '+entry.file);
    if(entry.currentBytes!==undefined&&entry.currentBytes!==bytes.length)errors.push('Current size mismatch: '+entry.file);
    if(entry.sourceUrl){
      const url=new URL(entry.sourceUrl);
      if(url.protocol!=='https:'||url.hostname!=='aicanvas.tuanjie.cn'||url.search||url.hash)errors.push('Unexpected source origin: '+entry.file);
      if(!/^[a-f0-9]{64}$/.test(entry.sourceSha256||''))errors.push('Invalid source hash: '+entry.file);
      if(!entry.patches?.length&&entry.currentSha256!==entry.sourceSha256)errors.push('Unexplained imported-byte change: '+entry.file);
      for(const patch of entry.patches||[])if(!Number.isInteger(patch.sourceByteStart)||!Number.isInteger(patch.sourceByteEnd)||patch.sourceByteStart<0||patch.sourceByteEnd<patch.sourceByteStart||patch.sourceByteEnd>entry.sourceBytes||!/^[a-f0-9]{64}$/.test(patch.sourceTextSha256||'')||typeof patch.replacement!=='string'||!patch.reason)errors.push('Invalid exact patch record: '+entry.file);
    }
  }
  for(const file of collectFiles(root,errors))if(file!=='source-ledger.json'&&!known.has(file))errors.push('Unledgered source input: '+file);
  const main=known.get('assets/index-A8ll_iBT.js');
  if(main?.sourceSha256!==originalMainSha)errors.push('The original Canvas client SHA anchor changed');
  const bindings=new Set();
  for(const binding of ledger.preservedOriginalBindings||[]){
    if(bindings.has(binding.name)||!originalBindings.has(binding.name))errors.push('Unexpected/duplicate original binding proof: '+binding.name);
    bindings.add(binding.name);const bytes=bytesByFile.get(binding.file);
    if(binding.sourceSha256!==originalMainSha||!bytes||binding.currentByteStart<0||binding.currentByteEnd>bytes.length||binding.currentByteEnd<=binding.currentByteStart||digest(bytes.subarray(binding.currentByteStart,binding.currentByteEnd))!==binding.bindingSha256)errors.push('Original component proof mismatch: '+binding.name);
  }
  for(const name of originalBindings)if(!bindings.has(name))errors.push('Missing original component proof: '+name);
  let dependencyCount=0;const dependencyGraph=[],nonLiteralImports=[];
  for(const[file,bytes]of bytesByFile){
    const refs=[],text=bytes.toString('utf8');
    if(file.endsWith('.js')||file.endsWith('.mjs')){
      try{
        const ast=await babel.parsers.babel.parse(text,{parser:'babel'});
        walk(ast,node=>{
          if(node.type==='ImportDeclaration'||node.type==='ExportAllDeclaration'||node.type==='ExportNamedDeclaration'&&node.source)refs.push({kind:'esm-import',reference:stringValue(node.source)});
          if(node.type==='ImportExpression'||node.type==='CallExpression'&&node.callee?.type==='Import'){
            const reference=stringValue(node.source||node.arguments?.[0]);
            if(reference!==null)refs.push({kind:'dynamic-import',reference});else nonLiteralImports.push({file,offset:node.start});
          }
          if(node.type==='VariableDeclarator'&&node.id?.name==='__vite__mapDeps')walk(node.init,child=>{const reference=stringValue(child);if(reference?.startsWith('assets/'))refs.push({kind:'vite-preload',reference});});
        });
      }catch(error){errors.push('JavaScript parse failed: '+file+' ('+error.message+')');}
    }
    if(file.endsWith('.css'))for(const match of text.matchAll(/url\(([^)]+)\)/g))refs.push({kind:'css-resource',reference:match[1].replace(/^["']|["']$/g,'')});
    if(file.endsWith('.html'))for(const match of text.matchAll(/<(?:script|link|img|source|video|audio|iframe)\b[^>]*\b(?:src|href)=["']([^"']+)["']/g))refs.push({kind:'html-resource',reference:match[1]});
    const dependencies=[];
    for(const {kind,reference}of refs){
      if(!reference||/^(?:data:|blob:|#)/.test(reference))continue;
      if(/^(?:https?:|\/\/)/.test(reference)){errors.push('Nonlocal literal '+kind+': '+file);continue;}
      const candidate=reference.startsWith('/codely-canvas/')?reference.slice('/codely-canvas/'.length):reference.startsWith('assets/')?reference:reference.startsWith('/')?reference.slice(1):path.posix.normalize(path.posix.join(path.posix.dirname(file),reference));
      const target=candidate.split(/[?#]/)[0];dependencyCount++;
      if(!relativePath(target)||!known.has(target))errors.push('Missing/unledgered '+kind+': '+file+' -> '+target);
      dependencies.push({kind,reference,file:target});
    }
    if(dependencies.length)dependencyGraph.push({file,dependencies});
  }
  if(ledger.knownMissing?.length)errors.push('Ledger still declares missing static dependencies');
  if(nonLiteralImports.length)warnings.push(nonLiteralImports.length+' nonliteral dynamic imports require runtime coverage; they are not asserted to be a literal static closure');
  return {passed:errors.length===0,files:known.size,originalResources:ledger.entries.length,preservedBindings:bindings.size,dependencies:dependencyCount,nonLiteralImports,errors,warnings,dependencyGraph};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const report=await verifyCodelyCanvasSource();
    for(const error of report.errors)console.error(error);
    for(const warning of report.warnings)console.log('NOTE '+warning);
    console.log(`Canvas source ${report.passed?'OK':'FAILED'}: ${report.originalResources} original resources, ${report.preservedBindings} original bindings, ${report.dependencies} literal dependency references.`);
    if(!report.passed)process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=1;}
}
