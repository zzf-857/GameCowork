// Import the reviewed original Quick Generate / History client as maintained
// input. This script reads bytes and rewrites explicit resource/transport
// boundaries only; it never imports, evaluates or executes the application JS.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'src/frontend/bundle/codely-generator');
const manifestPath = path.join(destination, 'source-ledger.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const option = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1]; };
const sourceRoot = option('--reference-root');
const staticLedgerPath = option('--static-ledger');
const cdnBase = 'https://ai.cdn.tuanjie.cn/static/dist';
const localBase = '/codely-generator';
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function verifiedFile(file, expected) {
  const bytes = fs.readFileSync(file);
  assert.equal(sha(bytes), expected.toLowerCase(), `Source SHA mismatch: ${file}`);
  return bytes;
}
function verifyInstalled({ checkAdapters = true } = {}) {
  const ledger = readJson(manifestPath);
  for (const entry of ledger.files) {
    const bytes = verifiedFile(path.join(destination, entry.path), entry.currentSha256);
    assert.equal(bytes.length, entry.currentBytes, entry.path + ' byte length');
    if (entry.patches.length) {
      let text = bytes.toString('utf8');
      for (const patch of entry.patches.toReversed()) {
        assert.equal(text.slice(patch.charOffset, patch.charOffset + patch.after.length), patch.after, entry.path + ': exact patch ' + patch.reason);
        text = text.slice(0, patch.charOffset) + patch.before + text.slice(patch.charOffset + patch.after.length);
      }
      assert.equal(sha(Buffer.from(text)), entry.sourceSha256, entry.path + ': reverse patches reconstruct original bytes');
    } else assert.equal(sha(bytes), entry.sourceSha256, entry.path + ': untouched original bytes');
  }
  if (checkAdapters) for (const adapter of ledger.localAdapters || []) verifiedFile(path.join(destination, adapter.path), adapter.sha256);
  for (const host of ledger.hostAdapter?.files || []) {
    let text = verifiedFile(path.join(destination, host.path), host.currentSha256).toString('utf8');
    for (const patch of host.patches.toReversed()) {
      assert.equal(text.slice(patch.charOffset, patch.charOffset + patch.after.length), patch.after, host.path + ': exact host patch ' + patch.reason);
      text = text.slice(0, patch.charOffset) + patch.before + text.slice(patch.charOffset + patch.after.length);
    }
    assert.equal(sha(Buffer.from(text)), host.beforeSha256, host.path + ': host patches preserve the rest of the maintained bundle');
  }
  console.log(`Original Codely client verified: ${ledger.files.length} files; exact reversible patches and source hashes match.`);
  return ledger;
}
if (process.argv.includes('--check')) { verifyInstalled(); process.exit(0); }
assert.ok(sourceRoot, 'Pass --reference-root with the reviewed codely-assets-reference-20261002 directory');
const sourceLedgerFile = path.resolve(sourceRoot, 'public-ledger.json');
const sourceLedger = readJson(sourceLedgerFile);
assert.equal(sourceLedger.files.length, 7, 'The reviewed Quick/History source ledger contains seven original public files');
assert.equal(sourceLedger.jsEvaluated, false);
const originalSources = sourceLedger.files.map(entry => ({ ...entry, bytesBuffer: verifiedFile(entry.file, entry.sha256) }));
const previous = fs.existsSync(manifestPath) ? verifyInstalled({ checkAdapters: false }) : null;
const files = [], missingDependencies = [];

function addSource(source, outputPath, transform) {
  assert.ok(!outputPath.split('/').some(value => value === '..' || value === '.') && !path.isAbsolute(outputPath));
  const patches = [];
  let text = transform ? source.bytesBuffer.toString('utf8') : '';
  function at(charOffset, before, after, reason) {
    assert.equal(text.slice(charOffset, charOffset + before.length), before, 'Exact source patch: ' + reason);
    patches.push({ reason, charOffset, byteOffsetBeforePatch: Buffer.byteLength(text.slice(0, charOffset)), before, after });
    text = text.slice(0, charOffset) + after + text.slice(charOffset + before.length);
  }
  function replace(before, after, reason, expectedCount) {
    const indexes = []; let offset = 0;
    while ((offset = text.indexOf(before, offset)) !== -1) { indexes.push(offset); offset += before.length; }
    if (expectedCount !== undefined) assert.equal(indexes.length, expectedCount, 'Expected source matches: ' + reason);
    else assert.ok(indexes.length, 'Source match exists: ' + reason);
    for (const index of indexes.toReversed()) at(index, before, after, reason);
  }
  if (transform) transform({ get text() { return text; }, replace, at });
  const bytes = transform ? Buffer.from(text) : source.bytesBuffer;
  const absolute = path.join(destination, outputPath), previousEntry = previous?.files.find(entry => entry.path === outputPath);
  if (fs.existsSync(absolute)) assert.ok(previousEntry || sha(fs.readFileSync(absolute)) === sha(bytes), 'Refuse to replace an untracked existing input: ' + outputPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, bytes);
  files.push({ path: outputPath, sourceUrl: source.url, sourceFile: source.file, sourceBytes: source.bytesBuffer.length,
    sourceSha256: sha(source.bytesBuffer), currentBytes: bytes.length, currentSha256: sha(bytes), patches });
}

const csp = "default-src 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' data: blob:; worker-src 'self' blob:; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
const page = originalSources.find(entry => entry.url.includes('/lab3d?'));
addSource(page, 'index.html', editor => {
  const scripts = [...editor.text.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].filter(match => /collectEvent|TeaAnalyticsObject|collect-autotrack/.test(match[0]));
  assert.equal(scripts.length, 3, 'Exactly three original analytics script elements are removed');
  for (const [index, match] of scripts.entries().toArray().toReversed()) editor.at(match.index, match[0], `<!-- Original analytics block ${index + 1} removed for the local host. -->`, 'Remove original analytics script ' + (index + 1));
  editor.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`, 'Constrain every client resource and request to the local host', 1);
  editor.replace(cdnBase, localBase, 'Localize original HTML asset references');
});
for (const source of originalSources.filter(entry => new URL(entry.url).pathname.includes('/assets/'))) {
  const filename = path.posix.basename(new URL(source.url).pathname);
  if (filename === 'index-DZWJHC3S.js') addSource(source, 'assets/' + filename, editor => {
    const identityImport = `import { bindGameCoworkLocalIdentity } from ${JSON.stringify(path.posix.relative('assets', 'local-identity.js'))};\nimport { gamecoworkGenerationPresentation } from ${JSON.stringify(path.posix.relative('assets', 'local-generation.js'))};\nconst gamecoworkGeneratorWorkspace = new URLSearchParams(window.location.search).get("gamecoworkWorkspace") || "";\n`;
    editor.at(0, '', identityImport, 'Import the owned local identity boundary and freeze this iframe URL workspace without replacing original UI components');
    editor.replace('function o1e(){y.useEffect(()=>{const t=()=>{',
      'function o1e(){y.useEffect(()=>{const gcwIdentityCleanup=bindGameCoworkLocalIdentity({onIdentity:e=>{Yue(null);za.setState({user:e.user,fetchStatus:e.status==="ready"?"success":"failure",gamecoworkGeneration:e.generation});vs.getState().setAuthStatus(e.status==="ready"?"authed":"anonymous",!0)}});const t=()=>{',
      'Bind the original identity stores to the actual own local session; authed is local readiness only', 1);
    editor.replace('if(vs.getState().setHostOrigin(n.origin),i.type==="codely:auth"){const r=i.token||null,s=r!==kl();Yue(r),vs.getState().setAuthStatus(r?"authed":"anonymous",s),s1e(i.token);return}',
      'if(vs.getState().setHostOrigin(n.origin),i.type==="codely:auth"){return}',
      'Ignore official token messages in the local derivative; theme, locale, prefill and file-drop branches remain original', 1);
    editor.replace('return window.addEventListener("message",e),()=>{document.removeEventListener("visibilitychange",t),window.removeEventListener("message",e)}},[])}',
      'return window.addEventListener("message",e),()=>{gcwIdentityCleanup();document.removeEventListener("visibilitychange",t),window.removeEventListener("message",e)}},[])}',
      'Release the owned local identity request and listeners with the original host bridge lifecycle', 1);
    editor.replace('function HNe(){var CF,AF,RF,PF,NF,IF,kF,DF,LF,OF,FF,jF,UF,BF,zF;const{t}=an()',
      'function HNe(){var CF,AF,RF,PF,NF,IF,kF,DF,LF,OF,FF,jF,UF,BF,zF;const gcwGeneration=gamecoworkGenerationPresentation(za(e=>e.gamecoworkGeneration),Er.resolvedLanguage||Er.language);const{t}=an()',
      'Read the independent own local generation readiness without changing model builders or platform entitlement fields', 1);
    editor.replace('Tne=()=>{if(R(""),$l)', 'Tne=()=>{if(gcwGeneration.blocked){R(gcwGeneration.message);return}if(R(""),$l)',
      'Reject original submit shortcuts while the local model service is unconfigured or unverified', 1);
    editor.replace('disabled:tp?!1:$l||au||tf||ep||wi!==""||!!ef,onClick:tp?gne:Tne,title:tp?void 0:',
      'disabled:gcwGeneration.blocked||(tp?!1:$l||au||tf||ep||wi!==""||!!ef),onClick:gcwGeneration.blocked?Tne:tp?gne:Tne,title:gcwGeneration.blocked?gcwGeneration.message:tp?void 0:',
      'Keep the original action button but disable unavailable local generation and never route it to an official purchase action', 1);
    editor.replace('f.jsx("strong",{children:t(tp?$l?', 'f.jsx("strong",{children:gcwGeneration.blocked?gcwGeneration.label:t(tp?$l?',
      'Display the real local service state in the original primary button', 1);
    editor.replace('$l&&f.jsxs("div",{className:"studio-paid-note",role:"status",children:[f.jsx(io,{size:14}),KM]})',
      '(gcwGeneration.blocked||$l)&&f.jsxs("div",{className:"studio-paid-note",role:"status",children:[f.jsx(io,{size:14}),gcwGeneration.blocked?gcwGeneration.message:KM]})',
      'Reuse the existing status area for the local service reason instead of an official subscription claim', 1);
    for (const before of ['au&&f.jsxs("div",{className:"studio-paid-note"','tf&&!au&&!$l&&f.jsxs("div",{className:"studio-paid-note"','ep&&!au&&!tf&&f.jsxs("div",{className:"studio-paid-note"']) {
      editor.replace(before, '!gcwGeneration.blocked&&' + before, 'Do not present official subscription messages as the cause of missing local service', 1);
    }
    editor.replace('https://ai-generator.tuanjie.cn/api', '/api/codely-generator', 'Point the original API client and environment descriptors at the local compatibility service');
    editor.replace('const Mn=Di.create({baseURL:"/api/codely-generator",withCredentials:!0});', 'const Mn=Di.create({baseURL:"/api/codely-generator",withCredentials:!1});', 'Never enable original cross-origin credentials', 1);
    editor.replace('Mn.interceptors.request.use(t=>(t.headers["X-Csrf-Token"]=I7.get("_csrf"),t.headers.isMobile=String(Ba(window.location.search)),bS&&(t.headers.Authorization=`Bearer ${bS}`),t),t=>t);',
      'Mn.interceptors.request.use(t=>{if(typeof t.url!=="string"||!t.url.startsWith("/")||t.url.startsWith("//")||t.url.includes("\\\\"))throw new Error("Only local Codely compatibility routes are available");t.baseURL="/api/codely-generator";t.withCredentials=!1;for(const e of Object.keys(t.headers||{}))if(["authorization","x-csrf-token","cookie","x-gamecowork-workspace"].includes(e.toLowerCase()))delete t.headers[e];if(!["get","head","options"].includes(String(t.method||"get").toLowerCase())&&(t.url.split("?")[0]==="/sso/generate"||t.url.startsWith("/sso/upload/")))t.headers["X-GameCowork-Workspace"]=gamecoworkGeneratorWorkspace;t.headers.isMobile=String(Ba(window.location.search));return t},t=>t);',
      'Keep original request shapes, reject remote URLs and credential headers, and bind only generation/upload mutations to the captured iframe workspace', 1);
    editor.replace(cdnBase, localBase, 'Localize original static asset bases and decoder URLs');
    editor.at(0, '', `import { extendGameCoworkModelRegistry, gamecoworkModelAcceptsReferences } from ${JSON.stringify(path.posix.relative('assets', 'local-models.js'))};\n`, 'Import the explicitly named owned CPA descriptor without changing original descriptors');
    editor.replace('xN={image:[', 'xN=extendGameCoworkModelRegistry({image:[', 'Extend original xN at its registry composition boundary', 1);
    editor.replace('"3d":[...U1e,...W1e]};function rw', '"3d":[...U1e,...W1e]});function rw', 'Close owned registry extension before original derived lookup maps are created', 1);
    editor.replace('function jK(t,e){return e?', 'function jK(t,e){if(!gamecoworkModelAcceptsReferences(e))return!1;return e?', 'Keep the verified text-only CPA model out of original reference-image controls; all original model capabilities remain unchanged', 1);
    editor.replace('const gcwGeneration=gamecoworkGenerationPresentation(za(e=>e.gamecoworkGeneration),Er.resolvedLanguage||Er.language);', 'const gcwGenerationReadiness=za(e=>e.gamecoworkGeneration);', 'Subscribe to local capability state without treating it as a global model grant', 1);
    editor.replace('?R5:Pe,[Fe,oe]', '?R5:Pe,gcwGeneration=gamecoworkGenerationPresentation(gcwGenerationReadiness,Er.resolvedLanguage||Er.language,Z==null?void 0:Z.id),[Fe,oe]', 'Resolve local readiness for the actual selected original menu descriptor', 1);
  });
  else if (filename.endsWith('.css')) addSource(source, 'assets/' + filename, editor => editor.replace(cdnBase, localBase, 'Localize original stylesheet font and background URLs'));
  else addSource(source, 'assets/' + filename);
}
if (staticLedgerPath) {
  const staticLedger = readJson(staticLedgerPath), entries = Array.isArray(staticLedger) ? staticLedger : staticLedger.files || staticLedger.entries || staticLedger.records;
  assert.ok(Array.isArray(entries), 'Static dependency ledger must contain file entries');
  for (const entry of entries) {
    const url = entry.url, namedFile = entry.file || entry.path || entry.output;
    if (!url?.startsWith(cdnBase)) continue; // Canvas has its own maintained client and source ledger.
    const file = namedFile && path.resolve(path.dirname(path.resolve(staticLedgerPath)), namedFile);
    if (entry.status !== 200 || !file || !entry.sha256) { missingDependencies.push({ url, status: entry.status, reason: entry.error || 'No verified successful byte download' }); continue; }
    assert.ok(url.startsWith(cdnBase + '/'), 'Static dependency is an exact original CDN resource: ' + url);
    const relative = new URL(url).pathname.slice('/static/dist/'.length);
    if (files.some(value => value.path === relative)) continue;
    addSource({ ...entry, file, bytesBuffer: verifiedFile(file, entry.sha256) }, relative);
  }
}
const ledger = { schemaVersion: 1, purpose: 'Original Codely Quick Generate and History client reuse; UI/model/parameter components remain original',
  sourceLedger: { path: sourceLedgerFile, sha256: sha(fs.readFileSync(sourceLedgerFile)) },
  ...(staticLedgerPath ? { staticDependencyLedger: { path: path.resolve(staticLedgerPath), sha256: sha(fs.readFileSync(staticLedgerPath)) } } : {}),
  sourceLayer: 'Anonymous public client referenced by the original installed Codely host; not an executable-embedded client or a proven historical screenshot version',
  routes: ['/lab3d', '/generation-history'], staticBase: localBase, apiBase: '/api/codely-generator',
  authentication: 'Original UI consumes an explicitly identified own GameCowork local user. Official token, subscription and credit state remain absent/unknown; no official account or entitlements are fabricated',
  localAdapters: ['local-identity.js','local-generation.js','local-models.js'].map(file => ({ path: file, role: file === 'local-identity.js' ? 'Own local-session identity and lifecycle only; not original Codely source' : file === 'local-models.js' ? 'Explicitly named CPA GPT Image 2 extension; preserves all original model descriptors and parameter components' : 'Own local generation readiness and labels; does not create platform entitlements or modify original model builders', sha256: sha(fs.readFileSync(path.join(destination, file))) })),
  ...(previous?.hostAdapter ? { hostAdapter: previous.hostAdapter } : {}),
  files, missingDependencies };
fs.writeFileSync(manifestPath, JSON.stringify(ledger, null, 2) + '\n');
verifyInstalled();
