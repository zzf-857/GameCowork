// The local host supplies one authorized project and one owned cache root.
// This preload is inherited by Node worker threads; it never rewrites HOME.
const fs=require('node:fs'),path=require('node:path'),url=require('node:url');
const project=path.resolve(process.env.GAMECOWORK_INSIGHT_PROJECT);
const cache=path.resolve(process.env.UNITY_INSIGHT_HOME);
const source=path.resolve(__dirname,'..');
// Native canonicalization must not recurse through our public lstat wrappers.
const actual=(fs.realpathSync.native||fs.realpathSync).bind(fs),append=fs.appendFileSync.bind(fs);
const within=(value,root)=>value===root||value.startsWith(root+path.sep);
function allowed(value,roots){
 if(typeof value==='number')return true;
 if(value instanceof URL)value=url.fileURLToPath(value);
 let candidate=path.resolve(String(value));
 const normalized=candidate.toLowerCase();
 if(!roots.some(root=>within(normalized,root.toLowerCase())))return false;
 for(;;){try{candidate=actual(candidate);break;}catch(error){if(error.code!=='ENOENT'&&error.code!=='ENOTDIR')return false;const parent=path.dirname(candidate);if(parent===candidate)return false;candidate=parent;}}
 return roots.some(root=>within(candidate.toLowerCase(),root.toLowerCase()));
}
function fail(operation){const error=Object.assign(Error(`Local Insight blocked ${operation}`),{code:'EACCES'});try{append(path.join(cache,'guard-events.jsonl'),JSON.stringify({operation})+'\n');}catch{}return error;}
const readAllowed=value=>allowed(value,[project,cache,source]);
const writeAllowed=value=>allowed(value,[cache]);
for(const [names,check] of[[['readFile','readdir','stat','lstat','realpath','access'],readAllowed],[['writeFile','appendFile','mkdir','unlink','rm','rmdir','truncate','chmod'],writeAllowed]])for(const name of names){
 for(const key of[name,name+'Sync'])if(fs[key]){const original=fs[key].bind(fs);fs[key]=(...args)=>{if(!check(args[0]))throw fail(key);return original(...args);};}
 if(fs.promises[name]){const original=fs.promises[name].bind(fs.promises);fs.promises[name]=async(...args)=>{if(!check(args[0]))throw fail('promises.'+name);return original(...args);};}
}
const exists=fs.existsSync.bind(fs);fs.existsSync=value=>readAllowed(value)&&exists(value);
const writing=flags=>typeof flags==='number'?Boolean(flags&(fs.constants.O_WRONLY|fs.constants.O_RDWR|fs.constants.O_CREAT|fs.constants.O_TRUNC|fs.constants.O_APPEND)):/[wa+]/.test(String(flags));
for(const key of['open','openSync']){const original=fs[key].bind(fs);fs[key]=(...args)=>{if(!(writing(args[1])?writeAllowed(args[0]):readAllowed(args[0])))throw fail(key);return original(...args);};}
const open=fs.promises.open.bind(fs.promises);fs.promises.open=async(...args)=>{if(!(writing(args[1])?writeAllowed(args[0]):readAllowed(args[0])))throw fail('promises.open');return open(...args);};
for(const [key,check] of[['createReadStream',readAllowed],['createWriteStream',writeAllowed]]){const original=fs[key].bind(fs);fs[key]=(...args)=>{if(!check(args[0]))throw fail(key);return original(...args);};}
for(const name of['rename','copyFile']){
 for(const key of[name,name+'Sync']){const original=fs[key].bind(fs);fs[key]=(...args)=>{if(!writeAllowed(args[1])||!(name==='rename'?writeAllowed(args[0]):readAllowed(args[0])))throw fail(key);return original(...args);};}
 const original=fs.promises[name].bind(fs.promises);fs.promises[name]=async(...args)=>{if(!writeAllowed(args[1])||!(name==='rename'?writeAllowed(args[0]):readAllowed(args[0])))throw fail('promises.'+name);return original(...args);};
}
const sqlite=require('node:sqlite'),Database=sqlite.DatabaseSync;
sqlite.DatabaseSync=new Proxy(Database,{construct(target,args,newTarget){if(args[0]!==':memory:'&&!writeAllowed(args[0]))throw fail('sqlite.open');return Reflect.construct(target,args,newTarget);}});
const cp=require('node:child_process');for(const name of['exec','execFile','execSync','execFileSync','spawn','spawnSync','fork'])cp[name]=()=>{throw fail('child_process.'+name);};
const loopback=value=>{if(typeof value==='string'||value instanceof URL)return['127.0.0.1','localhost','::1','[::1]'].includes(new URL(String(value)).hostname);return['127.0.0.1','localhost','::1','[::1]'].includes(value?.hostname||value?.host||'127.0.0.1');};
const fetch=globalThis.fetch.bind(globalThis);globalThis.fetch=(...args)=>{if(!loopback(args[0]))return Promise.reject(fail('external.fetch'));return fetch(...args);};
for(const name of['node:http','node:https']){const module=require(name);for(const key of['request','get']){const original=module[key].bind(module);module[key]=(...args)=>{if(!loopback(args[0]))throw fail('external.'+name+'.'+key);return original(...args);};}}
const net=require('node:net'),connect=net.Socket.prototype.connect;net.Socket.prototype.connect=function(...args){const options=typeof args[0]==='object'?args[0]:{host:typeof args[1]==='string'?args[1]:'127.0.0.1'};if(!loopback(options))throw fail('external.net');return connect.apply(this,args);};
require('node:module').syncBuiltinESMExports();
