import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import vm from 'node:vm';
import { bindGameCoworkLocalIdentity, gamecoworkLocalIdentity } from '../../src/frontend/bundle/codely-generator/local-identity.js';
import { gamecoworkGenerationReadiness, gamecoworkGenerationPresentation } from '../../src/frontend/bundle/codely-generator/local-generation.js';

const localSession = { mode: 'gamecowork-local', user: { id: 'gamecowork-local', name: 'GameCowork 本地用户', accountMode: 'local' }, capabilities: { localHistory: true, localGeneration: false } };
const flush = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise(value => { resolve = value; }); return { promise, resolve }; };
function fixture() {
  const messages = new Map(), visibility = new Map(), requests = [], updates = [], parent = {};
  const hostWindow = { parent, location: { origin: 'http://127.0.0.1:41234' }, addEventListener: (name, listener) => messages.set(name, listener), removeEventListener: name => messages.delete(name) };
  const hostDocument = { visibilityState: 'visible', addEventListener: (name, listener) => visibility.set(name, listener), removeEventListener: name => visibility.delete(name) };
  const dispose = bindGameCoworkLocalIdentity({ hostWindow, hostDocument, onIdentity: value => updates.push(value), fetcher: (url, options) => {
    const result = deferred(); requests.push({ url, options, result }); return result.promise;
  } });
  return { requests, updates, dispose, hostWindow, hostDocument, messages, visibility,
    changed(extra = {}) { messages.get('message')?.({ source: parent, origin: hostWindow.location.origin, data: { type: 'gamecowork:local-session-changed' }, ...extra }); },
    async reply(index, value = localSession, ok = true) { requests[index].result.resolve({ ok, json: async () => value }); await flush(); },
  };
}
test('Local identity accepts only the actual own session and does not introduce platform privileges', () => {
  assert.deepEqual(gamecoworkLocalIdentity({ ...localSession, user: { ...localSession.user, email: 'not-used@unity.cn', role: 'admin', paidType: 'internal', accessToken: 'never-copied' } }), localSession.user);
  for (const value of [null, {}, { ...localSession, mode: 'official' }, { ...localSession, user: { ...localSession.user, id: 'official-user' } }, { ...localSession, capabilities: {} }]) assert.throws(() => gamecoworkLocalIdentity(value), /本地会话/);
});
test('Actual local identity binder reads its own endpoint with omitted credentials and reports readiness only after a valid response', async t => {
  const f = fixture(); t.after(f.dispose);
  assert.equal(f.requests[0].url, '/api/codely-generator/local-session');
  assert.equal(f.requests[0].options.credentials, 'omit'); assert.equal(f.requests[0].options.redirect, 'error'); assert.equal(f.requests[0].options.cache, 'no-store');
  assert.equal(f.updates.length, 0); await f.reply(0);
  assert.deepEqual(f.updates, [{ status: 'ready', user: localSession.user, generation: gamecoworkGenerationReadiness(localSession) }]);
});
test('Actual parent notifications invalidate local state without trusting message identities or official auth tokens', async t => {
  const f = fixture(); t.after(f.dispose); await f.reply(0);
  f.changed({ origin: 'https://codely.tuanjie.cn' }); f.changed({ source: {} }); f.changed({ data: { type: 'codely:auth', token: 'not-an-own-session' } });
  assert.equal(f.requests.length, 1);
  f.changed({ data: { type: 'gamecowork:local-session-changed', user: { id: 'spoofed' }, token: 'must-not-be-used' } });
  assert.equal(f.requests.length, 2); assert.equal(f.updates.length, 1); assert.equal(f.requests[1].options.headers, undefined);
  await f.reply(1); assert.deepEqual(f.updates.at(-1).user, localSession.user);
});
test('A replaced local identity request cannot overwrite the newer failure with late readiness', async t => {
  const f = fixture(); t.after(f.dispose); f.changed();
  assert.equal(f.requests[0].options.signal.aborted, true); await f.reply(1, {}, false);
  assert.deepEqual(f.updates, [{ status: 'anonymous', user: null, generation: gamecoworkGenerationReadiness(null), error: 'GameCowork 本地会话读取失败' }]);
  await f.reply(0); assert.equal(f.updates.length, 1);
});
test('Disposal aborts its own identity request and releases all listeners without a late store update', async () => {
  const f = fixture(); f.dispose(); assert.equal(f.requests[0].options.signal.aborted, true);
  assert.equal(f.messages.size, 0); assert.equal(f.visibility.size, 0); await f.reply(0); assert.equal(f.updates.length, 0);
});
test('The imported client reconstructs its original SHA and preserves all 45 original model descriptors byte for byte', () => {
  const base = new URL('../../src/frontend/bundle/codely-generator/', import.meta.url), ledger = JSON.parse(fs.readFileSync(new URL('source-ledger.json', base), 'utf8'));
  const entry = ledger.files.find(value => value.path === 'assets/index-DZWJHC3S.js'), current = fs.readFileSync(new URL(entry.path, base), 'utf8');
  let original = current;
  for (const patch of entry.patches.toReversed()) {
    assert.equal(original.slice(patch.charOffset, patch.charOffset + patch.after.length), patch.after);
    original = original.slice(0, patch.charOffset) + patch.before + original.slice(patch.charOffset + patch.after.length);
  }
  const originalBytes = Buffer.from(original), hash = bytes => createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash(originalBytes), entry.sourceSha256); assert.equal(hash(Buffer.from(current)), entry.currentSha256);
  const contract = JSON.parse(fs.readFileSync(new URL('../fixtures/codely-generator-api-contract.json', import.meta.url), 'utf8'));
  assert.equal(contract.registry.models.length, 45);
  for (const model of contract.registry.models) {
    const descriptor = originalBytes.subarray(model.sourceByteRange.startInclusive, model.sourceByteRange.endExclusive);
    assert.equal(hash(descriptor), model.sourceByteRange.sha256, model.id + ' original bytes');
    assert.ok(current.includes(descriptor.toString('utf8')), model.id + ' original descriptor remains present and unchanged');
  }
  assert.ok(current.includes('if(vs.getState().setHostOrigin(n.origin),i.type==="codely:auth"){return}'));
  assert.ok(current.includes('Yue(null);za.setState({user:e.user,fetchStatus:e.status==="ready"?"success":"failure",gamecoworkGeneration:e.generation})'));
});
test('Only an actual false capability means unconfigured; absent, invalid and global true stay unverified without platform entitlements', () => {
  const configured = gamecoworkGenerationPresentation(gamecoworkGenerationReadiness(localSession));
  assert.equal(configured.blocked, true); assert.equal(configured.label, '服务未配置'); assert.equal(configured.message, '此模型尚未连接生成服务');
  for (const value of [undefined, null, 'false', true, 0, {}]) {
    const readiness = gamecoworkGenerationReadiness({ ...localSession, capabilities: { localHistory: true, localGeneration: value } });
    const policy = gamecoworkGenerationPresentation(readiness); assert.equal(policy.blocked, true); assert.equal(policy.label, '本地状态未就绪');
    assert.doesNotMatch(JSON.stringify({readiness,policy}), /paidType|credits|subscriber|membership/);
  }
  assert.equal(gamecoworkGenerationPresentation(undefined, 'en').label, 'Local status not ready');
  assert.equal(gamecoworkGenerationPresentation(gamecoworkGenerationReadiness({...localSession,mode:'official'})).label, '本地状态未就绪');
});
test('The actual preserved main button and submit boundary cannot send an unavailable local model to official purchase or generation', () => {
  const source=fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js',import.meta.url),'utf8');
  const start=source.indexOf('disabled:gcwGeneration.blocked||'),end=source.indexOf(',children:[',start),properties=source.slice(start,end);assert.ok(start>0&&end>start);
  for(const readiness of [gamecoworkGenerationReadiness(localSession),gamecoworkGenerationReadiness(null)]) {
    const gcwGeneration=gamecoworkGenerationPresentation(readiness),messages=[];
    const submitPrefix=source.match(/Tne=\(\)=>\{if\(gcwGeneration\.blocked\)\{R\(gcwGeneration\.message\);return\}/)?.[0];assert.ok(submitPrefix);
    const Tne=vm.runInNewContext('('+submitPrefix.slice('Tne='.length)+'throw Error("Unverified model reached original generation");})',{gcwGeneration,R:value=>messages.push(value)});
    const button=vm.runInNewContext('({'+properties+'})',{gcwGeneration,tp:true,$l:true,au:true,tf:true,ep:true,wi:'',ef:'',KM:'official permission unknown',t:value=>value,gne(){throw Error('Must not navigate to official purchase');},Tne});
    assert.equal(button.disabled,true);assert.equal(button.title,gcwGeneration.message);button.onClick();assert.deepEqual(messages,[gcwGeneration.message]);
  }
  assert.ok(source.includes('children:gcwGeneration.blocked?gcwGeneration.label:t(tp?'));
  assert.ok(source.includes('(gcwGeneration.blocked||$l)&&f.jsxs("div",{className:"studio-paid-note"'));
});
test('Actual local request boundary freezes iframe workspace only for create/upload and never reads body scope', () => {
  const source = fs.readFileSync(new URL('../../src/frontend/bundle/codely-generator/assets/index-DZWJHC3S.js', import.meta.url), 'utf8');
  const capture = source.match(/const gamecoworkGeneratorWorkspace = [^;]+;/)?.[0]; assert.ok(capture);
  const start = source.indexOf('Mn.interceptors.request.use('), end = source.indexOf('Mn.interceptors.response.use(', start), expression = source.slice(start, end);
  function fixture(search) {
    const window = { location: { search } }, callbacks = [], context = vm.createContext({ window, URLSearchParams, Ba: () => false,
      Mn: { interceptors: { request: { use: handler => callbacks.push(handler) } } } });
    vm.runInContext(capture + expression, context); return { window, request: callbacks[0] };
  }
  const f = fixture('?gamecoworkWorkspace=owned-A'); f.window.location.search = '?gamecoworkWorkspace=late-B';
  const body = { get workspaceKey() { throw new Error('Body workspace must not define a generation owner'); } };
  for (const url of ['/sso/generate', '/sso/upload/image?entry=studio', '/sso/upload/model-conversion']) {
    const value = f.request({ method: 'post', url, data: body, headers: { Authorization: 'must-not-be-sent', 'X-Csrf-Token': 'must-not-be-sent', 'x-gamecowork-workspace': 'injected' } });
    assert.equal(value.headers['X-GameCowork-Workspace'], 'owned-A'); assert.equal(value.baseURL, '/api/codely-generator'); assert.equal(value.withCredentials, false);
    assert.equal(value.headers.Authorization, undefined); assert.equal(value.headers['X-Csrf-Token'], undefined);
  }
  for (const [method, url] of [['get','/tasks'],['get','/user/me'],['post','/tags'],['get','/sso/generate']]) {
    const value = f.request({ method, url, headers: { 'X-GameCowork-Workspace': 'not-used' } }); assert.ok(!Object.keys(value.headers).some(key => key.toLowerCase() === 'x-gamecowork-workspace'));
  }
  assert.equal(fixture('').request({method:'post',url:'/sso/generate',headers:{}}).headers['X-GameCowork-Workspace'], '', 'An empty captured scope is explicit global scope');
  for (const url of ['https://ai-generator.tuanjie.cn/api/sso/generate','//outside.invalid/path','relative/path','/bad\\route']) assert.throws(() => f.request({method:'post',url,headers:{}}), /Only local/);
});
