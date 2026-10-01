const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'../restored/core-gamecowork-binary/binary/out');
for(const file of ['index.js','index.beautified.js']) {
  const source=fs.readFileSync(path.join(root,file),'utf8');
  const pattern=file==='index.js'
    ? /request\(e,n,r\)\{let a=_V\(\);return new Promise\(\(s,reject\)=>\{[\s\S]*?this\.send\(e,n,a,r\)\}\)\}/g
    : /request\(e, n, r\) \{\s*let a = _V\(\);\s*return new Promise\(\(s, reject\) => \{[\s\S]*?\}\);\s*\}/g;
  const methods=[...source.matchAll(pattern)].map(match=>match[0]);
  assert.equal(methods.length,2,`Two real host messengers in ${file}`);
  for(const [index,method] of methods.entries()) {
    function fixture() {
      const object=vm.runInNewContext(`({${method}})`,{_V:()=>`host-${index}`});
      object.idListeners=new Map();
      object.send=(kind,data,id,workspace)=>{object.sent={kind,data,id,workspace};};
      return object;
    }
    test(`${file} messenger ${index}: workspace array stays raw`,async()=>{
      const messenger=fixture();
      const promise=messenger.request('getWorkspaceDirs',null,'a');
      messenger.idListeners.get(messenger.sent.id)({data:['F:/fixture/A']});
      assert.deepEqual(await promise,['F:/fixture/A']);
      assert.equal(messenger.sent.workspace,'a');
      assert.equal(messenger.idListeners.size,0);
    });
    test(`${file} messenger ${index}: structured host failure rejects and removes its listener`,async()=>{
      const messenger=fixture();
      const promise=messenger.request('readFile',{filepath:'../outside'},'a');
      messenger.idListeners.get(messenger.sent.id)({data:{__gamecoworkHostError:{code:'file_access_denied',message:'Outside opened workspace'}}});
      await assert.rejects(promise,error=>error.message==='Outside opened workspace'&&error.code==='file_access_denied');
      assert.equal(messenger.idListeners.size,0);
    });
    test(`${file} messenger ${index}: legitimate objects and false values are not error envelopes`,async()=>{
      for(const data of [{extensionVersion:'fixture',error:'ordinary-field'},false,null]) {
        const messenger=fixture();
        const promise=messenger.request('getIdeInfo',null,'b');
        messenger.idListeners.get(messenger.sent.id)({data});
        assert.equal(await promise,data);
      }
    });
  }
}
