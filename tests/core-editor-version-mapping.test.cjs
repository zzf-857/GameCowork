const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{randomUUID}=require('node:crypto');
const root=path.join('F:/AI/AgentMake/temp/GameCowork/tests','editor-version-mapping-'+randomUUID());fs.mkdirSync(root,{recursive:true});
for(const name of ['index.js','index.beautified.js']){
 const source=fs.readFileSync(path.join(__dirname,'../restored/core-gamecowork-binary/binary/out',name),'utf8'),start=source.indexOf('function jba('),end=source.indexOf('function Pba(',start);assert.ok(start>=0&&end>start);
 const read=vm.runInNewContext(source.slice(start,end)+';jba',{hs:fs,Ca:path});
 test(name+': original scanner reads exact public duplicated-extension mapping and preserves technical keys',()=>{
  const dir=path.join(root,name+'-fallback');fs.mkdirSync(dir);fs.writeFileSync(path.join(dir,'versionMapping.json.json'),JSON.stringify({hmiRecommended:['2022.3.62t16'],beta:[],"2022.3.38t2":"1.3.2","2022.3.62t16":"1.10.4",noise:'unused'}));
  const actual=read(dir);assert.equal(actual['2022.3.38t2'],'1.3.2');assert.equal(actual['2022.3.62t16'],'1.10.4');assert.equal(actual.noise,undefined);assert.equal(actual.hmiRecommended,undefined);
  fs.writeFileSync(path.join(dir,'versionMapping.json'),JSON.stringify({'2022.3.62t16':'1.10.4-canonical'}));assert.equal(read(dir)['2022.3.62t16'],'1.10.4-canonical');
 });
 test(name+': missing malformed oversized and empty maps never invent a release version',()=>{
  const dir=path.join(root,name+'-invalid');fs.mkdirSync(dir);assert.equal(read(dir),null);
  for(const contents of ['{bad','null','[]','{}',' '.repeat(1024*1024+1)]){fs.writeFileSync(path.join(dir,'versionMapping.json'),contents);assert.equal(read(dir),null);}
  fs.writeFileSync(path.join(dir,'versionMapping.json.json'),JSON.stringify({'2022.3.62t16':'1.10.4'}));assert.equal(read(dir)['2022.3.62t16'],'1.10.4');
 });
}
