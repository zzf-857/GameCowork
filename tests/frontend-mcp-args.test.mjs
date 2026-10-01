import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const variants=[['VscTheme-BExNMG_K.js','fcn'],['VscTheme-B-CSeuv5.js','hcn']];
for(const [file,form] of variants){
  const source=fs.readFileSync(new URL('../restored/frontend/dist-beautified/assets/'+file,import.meta.url),'utf8');
  const begin=source.indexOf('function gamecoworkParseMcpArgs('),end=source.indexOf('const '+form+' = E.forwardRef',begin);
  assert.ok(begin>=0&&end>begin);const helpers=source.slice(begin,end),functions=vm.runInNewContext(helpers+'\n({parse:gamecoworkParseMcpArgs,format:gamecoworkFormatMcpArgs})');
  const plain=value=>JSON.parse(JSON.stringify(value));
  test(file+': exact JSON edit roundtrip preserves Windows paths, spaces, empty values and literal shell syntax',()=>{
    const args=['F:\\Fixture Projects\\server.mjs','--label','值 with space','','F:\\Cache Dir\\','"quote"','$(ignored)','%USERPROFILE%'];
    assert.deepEqual(plain(functions.parse(functions.format(args))),args);
    assert.deepEqual(plain(functions.parse('')),[]);assert.deepEqual(plain(functions.parse('[]')),[]);
  });
  test(file+': quoted legacy input retains argument boundaries without variable expansion',()=>{
    assert.deepEqual(plain(functions.parse('--file "F:\\Fixture Projects\\server.mjs" --name \'中文 空格\' "" %TEMP%')),['--file','F:\\Fixture Projects\\server.mjs','--name','中文 空格','','%TEMP%']);
    assert.deepEqual(plain(functions.parse('C:\\node\\server.mjs one\\ two')),['C:\\node\\server.mjs','one two']);
  });
  test(file+': invalid arrays, NUL, oversized and incomplete quotes fail before submission',()=>{
    for(const value of ['[1]','[null]','["unterminated"','"unterminated','x\0y','x'.repeat(32769)])assert.throws(()=>functions.parse(value));
    for(const value of [null,{},['safe',0],['\0']])assert.throws(()=>functions.format(value));
  });
  test(file+': actual form submit saves parsed argv or shows a validation error without issuing a write',async()=>{
    const bodyStart=source.indexOf('  const M = async () => {',end),bodyEnd=source.indexOf(',\n    N = async () => {',bodyStart);
    assert.ok(bodyStart>end&&bodyEnd>bodyStart);const body=source.slice(bodyStart+'  const M = '.length,bodyEnd),submitted=[],errors=[];
    const context={m:'owned-mcp',g:'stdio',C:{command:'node',argsString:'["F:\\\\Fixture Projects\\\\server.mjs",""]',env:[{key:'EMPTY',value:''}],headers:[]},x:'project',t:value=>submitted.push(plain(value)),gamecoworkSetArgsError:message=>errors.push(message)};
    const invoke=vm.runInNewContext(helpers+'\n('+body+')',context);await invoke();assert.equal(submitted.length,1);assert.deepEqual(submitted[0].args,['F:\\Fixture Projects\\server.mjs','']);assert.deepEqual(submitted[0].env,[{key:'EMPTY',value:''}]);
    context.C.argsString='"unterminated';await invoke();assert.equal(submitted.length,1);assert.match(errors.at(-1),/unclosed quote/);
    context.g='streamable-http';context.C.url='http://127.0.0.1/mcp';await invoke();assert.equal(submitted.length,2);assert.equal(submitted[1].args,undefined);assert.equal(submitted[1].url,'http://127.0.0.1/mcp');
  });
}
