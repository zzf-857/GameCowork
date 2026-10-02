import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createAssetGenerationComponents } from "../../src/frontend/bundle/assets/gamecowork-asset-generation.js";

// Execute the shipped messenger class and desktop relay, with isolated host/window
// fixtures. No app, core, Unity, provider, network, or user-data process is started.
const root = fileURLToPath(new URL("../../", import.meta.url));
const generations = [
  {
    name: "current",
    file: "VscTheme-BExNMG_K.js",
    className: "Kl",
    timeouts: "Mgn",
    timeoutBase: "Tgn",
    shellMessages: "Ngn",
    streamSet: "ore",
    streamRecovery: "G4e",
    streamRetry: "Ign",
    desktop: "index-DG7m4Xaq.js",
    gui: "index-BRxZ4eG7.js",
    slides: "J2",
    posthogProvider: "sj",
    telemetryWrapper: "ij",
    assetPanel: "PG", assetFrame: "QG", assetCanvas: "sq", assetBridge: "kG", assetBridgeEnd: "const Jm", languageHook: "Ie",
  },
  {
    name: "previous",
    file: "VscTheme-B-CSeuv5.js",
    className: "Yl",
    timeouts: "Cgn",
    timeoutBase: "wgn",
    shellMessages: "Tgn",
    streamSet: "ire",
    streamRecovery: "V4e",
    streamRetry: "Mgn",
    desktop: "index-CKZIQMcw.js",
    gui: "index-DvRYaIVa.js",
    slides: "X2",
    posthogProvider: "tj",
    telemetryWrapper: "rj",
    assetPanel: "jG", assetFrame: "kG", assetCanvas: "eq", assetBridge: "EG", assetBridgeEnd: "const qm", languageHook: "ke",
  },
];

function between(source, start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `Source markers found: ${start}`);
  return source.slice(a, b);
}
function namedFunction(source, name) {
  const start = source.indexOf(`function ${name}(`), end = source.indexOf('\n}', start);
  assert.ok(start >= 0 && end > start, 'Actual function ' + name);
  return source.slice(start, end + 2);
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

function fixture(spec, { ready = true, hostEnvironment = false } = {}) {
  const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.file), "utf8");
  const desktop = fs.readFileSync(path.join(root, "src/frontend/bundle", spec.desktop), "utf8");
  const classSource = between(source, `const ${spec.className} = class ${spec.className} {`, "\n};\n") + "\n};";
  const timeoutSource = between(source, `  ${spec.timeouts} = {`, "\n  },")
    .trim()
    .replace(`${spec.timeouts} = `, "") + "\n}";
  const staticSource = between(source, `(Vt(${spec.className}, "DEFAULT_REQUEST_TIMEOUT_MS"`, "\nlet ");
  const shellMessagesSource = between(source, `  ${spec.shellMessages} = new Set([`, "\n  ]),")
    .trim() + "\n]);";
  const relay = desktop.match(/rl != null && rl\.messageId && \(\(ge = Le\.contentWindow\) == null \|\| ge\.postMessage\(rl, "\*"\)\)/)?.[0];
  assert.ok(relay, "Actual desktop reply-forwarding expression found");

  let now = 0;
  let id = 0;
  let timerId = 0;
  let onSend;
  const listeners = new Set();
  const timers = new Map();
  const sent = [];
  const errors = [];
  const abortedStreams = new Set();
  let hostAvailable = false;
  const state = {
    hub: {
      isHubMode: true,
      activeWorkspaceKey: "local:F:/fixture/b",
      workspaces: [
        { workspaceKey: "local:F:/fixture/a", workspaceDir: "F:/fixture/a" },
        { workspaceKey: "local:F:/fixture/b", workspaceDir: "F:/fixture/b" },
      ],
    },
    session: { sessions: { "session-a": { workspaceId: "local:F:/fixture/a" } } },
  };
  const window = {
    addEventListener: (kind, handler) => kind === "message" && listeners.add(handler),
    removeEventListener: (kind, handler) => kind === "message" && listeners.delete(handler),
    parent: {
      postMessage(message) {
        sent.push(message);
        onSend?.(message);
      },
    },
  };
  const context = vm.createContext({
    console: { log() {}, debug() {}, error() {} },
    AbortController,
    Date: class extends Date { static now() { return now; } },
    setTimeout(callback, delay) {
      const timer = ++timerId;
      timers.set(timer, { callback, time: now + delay });
      return timer;
    },
    clearTimeout: (timer) => timers.delete(timer),
    clearInterval: (timer) => timers.delete(timer),
    window,
    qn: () => `fixture-${++id}`,
    Vt: (object, name, value) => { object[name] = value; },
    Ooe: class {},
    Roe: class {},
    nS: () => false,
    As: () => !hostEnvironment || hostAvailable,
    Is: () => !hostEnvironment || hostAvailable,
    Lo: () => ({ getState: () => state }),
    Ng: (sessionId) => (store) => store.session.sessions[sessionId]?.workspaceId,
    V4e: () => ({ runOn: "local", workspaceDir: "F:/fixture/a" }),
    W4e: () => ({ runOn: "local", workspaceDir: "F:/fixture/a" }),
    _Oe: (messageId) => abortedStreams.delete(messageId),
    bOe: (messageId) => abortedStreams.add(messageId),
  });
  if (hostEnvironment) context.localStorage = {};
  context[spec.timeoutBase] = 60000;
  context[spec.streamSet] = new Set();
  context[spec.streamRecovery] = 60000;
  context[spec.streamRetry] = 5000;
  vm.runInContext(`
    const ${spec.timeouts} = ${timeoutSource};
    const ${shellMessagesSource}
    ${classSource}
    ${staticSource}
    globalThis.messenger = new ${spec.className}();
  `, context);
  const messenger = context.messenger;
  messenger.handleRequestError = (kind, error) => { errors.push({ kind, error }); };
  if (ready) messenger.markConnectionReady();

  function forward(message) {
    context.rl = message;
    context.Le = { contentWindow: { postMessage(data) {
      for (const listener of [...listeners]) listener({ data });
    } } };
    vm.runInContext(relay, context);
  }

  return {
    messenger,
    state,
    sent,
    errors,
    timers,
    listeners,
    setHostAvailable(value) { hostAvailable = value; },
    get now() { return now; },
    onSend(handler) { onSend = handler; },
    reply(messageId, data, messageType = sent.at(-1)?.messageType) {
      forward({ messageId, messageType, data });
    },
    async advance(milliseconds) {
      const target = now + milliseconds;
      for (;;) {
        const next = [...timers.entries()]
          .filter(([, timer]) => timer.time <= target)
          .sort((a, b) => a[1].time - b[1].time)[0];
        if (!next) break;
        timers.delete(next[0]);
        now = next[1].time;
        next[1].callback();
        await flush();
      }
      now = target;
      await flush();
    },
    assertClean() {
      assert.equal(messenger.pendingRequests.size, 0, "pending request removed");
      assert.equal(messenger.routedWorkspaceKeysByMessageId.size, 0, "workspace route removed");
      assert.equal(messenger.connectionReadyCallbacks.length, 0, "connection waiter removed");
      assert.equal(timers.size, 0, "request timeout removed");
    },
  };
}

function invoke(messenger, method) {
  const payload = { sessionId: "session-a" };
  if (method === "immediate") return messenger.requestWithMessageIdImmediate("history/list", payload).response;
  return messenger[method]("history/list", payload);
}

for (const spec of generations) {
  test(`${spec.name}: the client created before native bootstrap resumes a real handshake without assuming readiness`, async () => {
    const f = fixture(spec, { ready: false, hostEnvironment: true });
    assert.equal(f.messenger.connectionReady, false); assert.equal(f.sent.length, 0);
    f.setHostAvailable(true);
    const request = f.messenger.request("history/list", { sessionId: "session-a" });
    await flush(); assert.equal(f.sent.length, 0); assert.equal(f.messenger.connectionReadyCallbacks.length, 1);
    f.onSend(message => f.reply(message.messageId, { status: "success", done: true, content: message.messageType === "ping" ? "pong" : ["owned"] }, message.messageType));
    f.messenger.resumeHealthCheck(); f.messenger.resumeHealthCheck();
    const value = await request; await flush();
    assert.equal(value.status, "success"); assert.equal(f.messenger.connectionReady, true);
    assert.equal(f.sent.filter(message => message.messageType === "ping").length, 1);
    assert.equal(f.sent.filter(message => message.messageType === "history/list").length, 1); f.assertClean();
  });
  test(`${spec.name}: an obsolete health probe cannot mark a stopped and resumed generation ready`, async () => {
    const f = fixture(spec, { ready: false, hostEnvironment: true }); f.setHostAvailable(true);
    f.messenger.resumeHealthCheck(); const old = f.sent.at(-1); f.messenger.stopHealthCheck();
    f.messenger.resumeHealthCheck(); const current = f.sent.at(-1); assert.notEqual(old.messageId, current.messageId);
    f.reply(old.messageId, { status: "success", content: "pong" }, "ping"); await flush();
    assert.equal(f.messenger.connectionReady, false);
    f.reply(current.messageId, { status: "success", content: "pong" }, "ping"); await flush();
    assert.equal(f.messenger.connectionReady, true); await f.advance(5000);
    assert.equal(f.sent.filter(message => message.messageType === "ping").length, 2); f.assertClean();
  });
  test(`${spec.name}: unavailable non-native environments remain unready instead of being marked ready`, async () => {
    const f = fixture(spec, { ready: false, hostEnvironment: true });
    f.messenger.resumeHealthCheck(); await flush(); await f.advance(5000);
    assert.equal(f.messenger.connectionReady, false); assert.equal(f.sent.length, 0); f.assertClean();
  });
  for (const localMode of [true, false]) {
    test(`${spec.name}: asset/Canvas entry ${localMode ? "mounts the original host components" : "preserves other hosts"}`, () => {
      const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.gui), "utf8");
      const helpers = between(source, "function gamecoworkUsesLocalAssetPage() {", `function ${spec.assetPanel}(`);
      const main = between(source, `function ${spec.assetPanel}(`, "function gamecoworkLegacyAssetPanel(");
      const frame = between(source, `function ${spec.assetFrame}(`, "function gamecoworkLegacyCanvasFrame(");
      const canvas = between(source, `function ${spec.assetCanvas}(`, "function gamecoworkLegacyCanvasPanel(");
      const context = vm.createContext({
        window: { GAMECOWORK_SHELL: localMode, parent: {} },
        a: { jsx: (component, props) => ({ component: component.name, props }) },
        createAssetGenerationComponents,
        d: { createElement() {}, lazy: (load) => ({ load }) }, qt: () => localMode,
        gamecoworkLegacyAssetPanel() {}, gamecoworkLegacyCanvasFrame() {}, gamecoworkLegacyCanvasPanel() {},
      });
      vm.runInContext(`${helpers}\n${main}\n${frame}\n${canvas}\nglobalThis.entries = [${spec.assetPanel}, ${spec.assetFrame}, ${spec.assetCanvas}];`, context);
      const expected = ["gamecoworkLegacyAssetPanel", "gamecoworkLegacyCanvasFrame", "gamecoworkLegacyCanvasPanel"];
      assert.deepEqual([...context.entries].map((entry) => entry({}).component), expected);
      context.window.GAMECOWORK_SHELL = false;
      context.window.parent.GAMECOWORK_SHELL = true;
      assert.deepEqual([...context.entries].map((entry) => entry({}).component), expected, "Same-origin child preserves the original host components");
    });
  }

  test(`${spec.name}: original asset bridge synchronizes local theme and locale without ever reading or publishing credentials`, () => {
    const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.gui), "utf8");
    const helper = between(source, "function gamecoworkUsesLocalAssetPage() {", "const { AssetPanel: gamecoworkLocalAssetPanel,");
    const bridge = between(source, `function ${spec.assetBridge}(`, spec.assetBridgeEnd);
    const sent = [];
    const listeners = [];
    const frame = { postMessage: (message, origin) => sent.push({message,origin}) };
    const session = { get accessToken() { throw new Error('Native asset bridge must never read a token'); } };
    const i18n = { language: "zh", t: () => "https://ai-generator.tuanjie.cn/lab3d" };
    const context = vm.createContext({
      URL, window: { GAMECOWORK_SHELL: true, location: {origin:'http://127.0.0.1:41234'}, parent: {}, addEventListener: (_type, handler) => listeners.push(handler), removeEventListener() {} },
      document: { documentElement: {}, body: {} }, MutationObserver: class { observe() {} disconnect() {} },
      d: { useCallback: (fn) => fn, useRef: (value) => ({ current: value }), useEffect: (fn) => fn() },
      Ie: () => ({ i18n }), ke: () => ({ i18n }), yn: () => ({ session }),
      M: () => "chinese", h3: () => false, p3: "https://ai-generator.tuanjie.cn/lab3d", wo: () => false,
      g3: (url) => new URL(url).origin, ad: () => "dark", Ad: () => "dark", Xv: () => "zh", qv: () => "zh",
      fixtureRef: { current: { contentWindow: frame } },
    });
    if (spec.name === "previous") {
      context.p3 = (url) => new URL(url).origin;
      context.h3 = "https://ai-generator.tuanjie.cn/lab3d";
      context.f3 = () => false;
    }
    vm.runInContext(`${helper}\n${bridge}\n${spec.assetBridge}({iframeRef: fixtureRef});`, context);
    assert.ok(sent.some(row=>row.message.type==='gamecowork:local-session-changed'));
    assert.ok(sent.some(row=>row.message.type==='codely:theme'&&row.message.theme==='dark'));
    assert.ok(sent.some(row=>row.message.type==='codely:locale'&&row.message.locale==='zh'));
    const count=sent.length;
    for (const listener of listeners) {
      listener({ source: frame, origin: "https://ai-generator.tuanjie.cn", data: { type: "codely:ready" } });
      listener({ source: {}, origin: "http://127.0.0.1:41234", data: { type: "codely:ready" } });
      listener({ source: frame, origin: "null", data: { type: "codely:ready" } });
    }
    assert.equal(sent.length,count,'Wrong origin or frame cannot trigger identity/theme delivery');
    for(const listener of listeners)listener({source:frame,origin:'http://127.0.0.1:41234',data:{type:'codely:ready'}});
    assert.equal(sent.length,count+3);
    assert.ok(sent.every(row=>row.origin==='http://127.0.0.1:41234'&&!('token' in row.message)&&row.message.type!=='codely:auth'));
  });
  test(`${spec.name}: native creator and Canvas URLs capture each render's workspace while preserving original remote hosts elsewhere`, () => {
    const source=fs.readFileSync(path.join(root,'src/frontend/bundle/assets',spec.gui),'utf8'),old=spec.name==='previous';
    const names={creator:old?'TG':'MG',history:old?'LG':'jG',canvas:old?'Zz':'nq',canvasBase:old?'yg':'bg'};
    for(const local of [true,false]) {
      const window={GAMECOWORK_SHELL:local,parent:{},location:{origin:'http://127.0.0.1:41234'},localStorage:{getItem(){assert.equal(local,false,'Native creator must not consult an external URL override');return'https://owned-other-host.invalid/lab3d';}}};
      const context=vm.createContext({window,URL,URLSearchParams,ad:()=> 'dark',Ad:()=> 'dark',TG:'original-override',FG:'original-override',[names.canvasBase]:local?window.location.origin:'https://aicanvas.tuanjie.cn'});
      vm.runInContext([namedFunction(source,'gamecoworkUsesLocalAssetPage'),namedFunction(source,'gamecoworkAssetLocalUrl'),namedFunction(source,names.creator),namedFunction(source,names.history),namedFunction(source,names.canvas)].join('\n')+`\nglobalThis.paths={creator:${names.creator},history:${names.history},canvas:${names.canvas}};`,context);
      const creator=new URL(context.paths.creator('https://ai-generator.tuanjie.cn/lab3d','owned-A')),history=new URL(context.paths.history(creator.toString())),canvas=new URL(context.paths.canvas('F:/Owned/Project A','owned-A'));
      assert.equal(creator.origin,local?window.location.origin:'https://owned-other-host.invalid');assert.equal(creator.pathname,'/lab3d');assert.equal(creator.searchParams.get('host'),'codely');assert.equal(history.pathname,'/generation-history');
      assert.equal(canvas.origin,local?window.location.origin:'https://aicanvas.tuanjie.cn');assert.equal(canvas.searchParams.get('workspace_name'),'Project A');assert.match(canvas.searchParams.get('workspace_hash'),/^[a-f0-9]{8}$/);
      if(local){assert.equal(creator.searchParams.get('gamecoworkWorkspace'),'owned-A');assert.equal(creator.searchParams.get('theme'),'dark');assert.equal(canvas.pathname,'/codely-canvas/home');assert.equal(canvas.searchParams.get('gamecoworkWorkspace'),'owned-A');assert.notEqual(context.paths.creator('', 'owned-B'),creator.toString());assert.equal(new URL(context.paths.creator('', '')).searchParams.get('gamecoworkWorkspace'),'');}
    }
  });
  test(`${spec.name}: both actual Canvas hosts honor local source/origin and never consult a native token fallback`, () => {
    const source=fs.readFileSync(path.join(root,'src/frontend/bundle/assets',spec.gui),'utf8'),old=spec.name==='previous';
    for(const standalone of [false,true]) {
      const sent=[],listeners=[],frame={postMessage:(message,origin)=>sent.push({message,origin})},session={get accessToken(){throw Error('Native Canvas must never read an access token');}};
      const jsx=(_type,props)=>props,workspaces=[{workspaceKey:'owned-A',workspaceDir:'F:/Owned/Project A'}];
      const context=vm.createContext({URL,URLSearchParams,window:{GAMECOWORK_SHELL:true,location:{origin:'http://127.0.0.1:41234'},parent:{},addEventListener:(_name,handler)=>listeners.push(handler),removeEventListener(){}},
        document:{documentElement:{getAttribute:()=> 'dark'},body:{}},MutationObserver:class{observe(){}disconnect(){}},
        d:{useRef:value=>({current:value===null?{contentWindow:frame}:value}),useState:value=>[typeof value==='function'?value():value,()=>{}],useCallback:value=>value,useEffect:callback=>callback()},
        a:{jsx,jsxs:jsx},Z:()=>'',J:()=>'',Ie:()=>({t:(_key,fallback)=>fallback}),ke:()=>({t:(_key,fallback)=>fallback}),yn:()=>({session}),wo:()=>false,
        ls:'workspaces',Ps:'active',vc:'modal',M:selector=>selector==='workspaces'?workspaces:selector==='active'?'owned-A':selector==='modal'?null:false,
        Ge:()=>()=>{},ze:()=>()=>{},Ea:()=>({}),Zr:'header',f3:'icon',d3:'icon',ad:()=> 'dark',Ad:()=> 'dark',Ax:()=> 'dark',ix:()=> 'dark',kF(){throw Error('Native Canvas must not request a credential fallback');},
        gamecoworkUsesLocalAssetPage:()=>true,
      });
      const origin=old?'qm':'Jm',home=old?'IG':'FG',check=old?'SG':'UG',base=old?'yg':'bg',canvasUrl=old?'Zz':'nq';
      vm.runInContext(namedFunction(source,'gamecoworkAssetLocalUrl')+`\nconst ${origin}=window.location.origin,${home}=${origin}+"/codely-canvas/home",${check}=${origin},${base}=${origin},Di=${origin};\n`+namedFunction(source,canvasUrl)+'\n'+namedFunction(source,standalone?'gamecoworkLegacyCanvasPanel':'gamecoworkLegacyCanvasFrame')+`\n${standalone?'gamecoworkLegacyCanvasPanel({})':'gamecoworkLegacyCanvasFrame({src:"http://127.0.0.1:41234/codely-canvas/home",title:"Canvas"})'};`,context);
      for(const listener of listeners){listener({source:frame,origin:'https://aicanvas.tuanjie.cn',data:{type:'ai-canvas-ready'}});listener({source:{},origin:'http://127.0.0.1:41234',data:{type:'ai-canvas-ready'}});}
      assert.equal(sent.length,0,'Foreign origin/frame cannot trigger Canvas host responses');
      for(const listener of listeners)listener({source:frame,origin:'http://127.0.0.1:41234',data:{type:'ai-canvas-ready'}});
      assert.ok(sent.some(row=>row.message.type==='gamecowork:local-session-changed'));assert.ok(sent.some(row=>row.message.type==='embed-style'));assert.ok(sent.some(row=>row.message.type==='codely:workspaces'));
      assert.ok(sent.every(row=>row.origin==='http://127.0.0.1:41234'&&!('token'in row.message)&&!['cowork-token','logout'].includes(row.message.type)));
    }
  });

  for (const localMode of [true, false]) {
    test(`${spec.name}: business telemetry initialization ${localMode ? "stays off in the local host" : "preserves other hosts"}`, () => {
      const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.gui), "utf8");
      const provider = between(source, `function ${spec.posthogProvider}(e) {`, "\nvar ");
      const wrapper = between(source, `const ${spec.telemetryWrapper} = ({ children: e }) => {`, "\nfunction ");
      const calls = { posthog: 0, sentry: [], optOut: 0, closed: 0 };
      const clear = { clear() {} };
      const context = vm.createContext({
        window: { GAMECOWORK_SHELL: localMode },
        console: { warn() {}, error() {} },
        d: { useMemo: (fn) => fn(), useEffect: (fn) => fn() },
        M: (selector) => selector({ config: { config: { allowAnonymousTelemetry: true } } }),
        yn: () => ({ session: { account: { id: "fixture-local-user" } } }),
        oj: () => false, sj: () => false, _o: () => false,
        SN: "fixture-dsn", IN: "fixture-dsn", EN: "fixture-dsn", _N: "fixture-dsn",
        lA: { init() { calls.posthog++; }, opt_out_capturing() { calls.optOut++; } },
        l2: { Provider: "fixture-provider" }, c2: { Provider: "fixture-provider" },
        is: { createElement: () => null }, os: { createElement: () => null },
        a: { jsx: () => null },
        T7: (options) => calls.sentry.push(options), U7: (options) => calls.sentry.push(options),
        S7() {}, E7() {}, XB() {}, qB() {},
        xC: (value) => value, vC: (value) => value, dU() {}, lU() {},
        wt: () => ({ close() { calls.closed++; } }), St: () => clear, It: () => clear,
      });
      vm.runInContext(`${provider}\n${wrapper}\n${spec.posthogProvider}({apiKey: "fixture-public-key"});\n${spec.telemetryWrapper}({children: null});`, context);
      assert.equal(calls.posthog, localMode ? 0 : 1);
      assert.equal(calls.sentry.length, localMode ? 0 : 1);
      if (localMode) assert.equal(calls.closed, 1);
      else assert.equal(calls.sentry[0].enabled, true);
      assert.ok(calls.optOut >= 1);
    });
  }

  test(`${spec.name}: introduction reflects explicit available and pending capabilities`, () => {
    const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.gui), "utf8");
    const helper = between(source, "function gamecoworkCapabilityStatus(", `function ${spec.slides}(`);
    const context = vm.createContext({});
    vm.runInContext(`${helper}\nglobalThis.status = gamecoworkCapabilityStatus;`, context);
    assert.equal(context.status({ localWorkspaces: true, remoteWorkspaces: false, editorStreaming: false }, true),
      "本地多工作区已接通；远程访问正在接入；编辑器串流正在接入");
    assert.equal(context.status({ localWorkspaces: true, remoteWorkspaces: true, editorStreaming: true }, false),
      "Local workspaces connected; Remote access connected; Editor streaming connected");
    assert.equal(context.status({ editorRenderedViews:true, editorStreaming:false },true),
      "Scene/Game 实时预览已接通；完整编辑器串流正在接入");
  });

  test(`${spec.name}: unavailable capability metadata preserves legacy introduction behavior`, () => {
    const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.gui), "utf8");
    const helper = between(source, "function gamecoworkCapabilityStatus(", `function ${spec.slides}(`);
    const context = vm.createContext({});
    vm.runInContext(`${helper}\nglobalThis.status = gamecoworkCapabilityStatus;`, context);
    for (const value of [null, undefined, {}, { editorStreaming: "planned" }]) assert.equal(context.status(value, true), "");
  });
  test(`${spec.name}: own introduction uses a local vector image with actual capability state`, () => {
    const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.gui), "utf8");
    const helper = between(source, "function gamecoworkIntroductionImage(", `function ${spec.slides}(`);
    const window = { GAMECOWORK_SHELL: true };
    const render = vm.runInNewContext(`(${helper.trim()})`, { window, encodeURIComponent });
    const url = render("https://original.example/guide.gif", 1, { remoteWorkspaces: false }, true);
    assert.ok(url.startsWith("data:image/svg+xml;"));
    const svg = decodeURIComponent(url.split(",")[1]);
    assert.ok(svg.includes("远程访问"));
    assert.ok(svg.includes("正在接入"));
    assert.ok(!svg.includes("https://"));
    window.GAMECOWORK_SHELL = false;
    assert.equal(render("https://original.example/guide.gif", 1, null, true), "https://original.example/guide.gif");
  });

  test(`${spec.name}: native header actions use the local HTTP host without Tauri`, async () => {
    const desktop = fs.readFileSync(path.join(root, "src/frontend/bundle", spec.desktop), "utf8");
    const component = spec.name === "current" ? "pbi" : "fbi";
    const helper = between(desktop, "function E8e() {", `function ${component}() {`);
    const actions = between(between(desktop, `function ${component}() {`, "function T8e(n)"), "  const t = Cn.useCallback", "  return wi.jsx");
    const calls = [];
    const context = vm.createContext({
      URLSearchParams,
      window: { GAMECOWORK_SHELL: true, location: { origin: "http://127.0.0.1:9000", search: "" } },
      Cn: { useCallback: (handler) => handler },
      fetch: (url, options) => { calls.push({ url, options }); return Promise.resolve({ ok: true }); },
      $N() { throw new Error("Native host must not use unavailable Tauri APIs"); },
      e() {},
    });
    vm.runInContext(`${helper}\n${actions}\nglobalThis.actions = [t, i, r];`, context);
    for (const action of context.actions) await action();
    assert.deepEqual(calls.map((call) => new URL(call.url).pathname), [
      "/api/tauri/minimize-window", "/api/tauri/toggle-maximize-window", "/api/tauri/close-window",
    ]);
    assert.ok(calls.every((call) => call.options.method === "POST"));
  });

  test(`${spec.name}: GUI titlebar messages use native host actions and leave unrelated messages alone`, () => {
    const desktop = fs.readFileSync(path.join(root, "src/frontend/bundle", spec.desktop), "utf8");
    const component = spec.name === "current" ? "pbi" : "fbi";
    const helper = between(desktop, "function E8e() {", `function ${component}() {`);
    const requests = [], window = { GAMECOWORK_SHELL: true, location: { origin: "http://127.0.0.1:9000", search: "" } };
    const route = vm.runInNewContext(`${helper}\ngamecoworkNativeTitlebarMessage`, { window, URLSearchParams, fetch: (url, options) => { requests.push({url,options}); } });
    for (const kind of ["shell/startDragging", "shell/titlebarDoubleClick", "shell/macOSTitlebarDoubleClick", "shell/minimizeWindow", "shell/toggleMaximizeWindow", "shell/closeWindow"]) assert.equal(route(kind), true);
    assert.deepEqual(requests.map(row=>new URL(row.url).pathname), ["/api/tauri/start-dragging", "/api/tauri/toggle-maximize-window", "/api/tauri/toggle-maximize-window", "/api/tauri/minimize-window", "/api/tauri/toggle-maximize-window", "/api/tauri/close-window"]);
    assert.ok(requests.every(row=>row.options.method==="POST"));
    for(const kind of ["toString", "__proto__", "shell/openFile", undefined]) assert.equal(route(kind),false);
    window.GAMECOWORK_SHELL=false;assert.equal(route("shell/startDragging"),false);assert.equal(requests.length,6);
  });

  test(`${spec.name}: native maximize state rejects late replies and cancels on unmount`, async () => {
    const desktop = fs.readFileSync(path.join(root, "src/frontend/bundle", spec.desktop), "utf8");
    const helper=between(desktop,"function gamecoworkSyncNativeMaximize(","function L8e(");
    const listeners={},requests=[],values=[];
    const window={location:{origin:"http://127.0.0.1:9000"},addEventListener:(kind,fn)=>listeners[kind]=fn,removeEventListener:kind=>delete listeners[kind]};
    const bind=vm.runInNewContext(`${helper}\ngamecoworkSyncNativeMaximize`,{window,AbortController,AbortSignal,fetch:(_,options)=>new Promise(resolve=>requests.push({resolve,signal:options.signal}))});
    const dispose=bind(value=>values.push(value));listeners.resize();assert.equal(requests[0].signal.aborted,true);
    requests[1].resolve({json:async()=>({ok:true,maximized:false})});await flush();
    requests[0].resolve({json:async()=>({ok:true,maximized:true})});await flush();assert.deepEqual(values,[false]);
    listeners.focus();dispose();assert.equal(requests[2].signal.aborted,true);requests[2].resolve({json:async()=>({ok:true,maximized:true})});await flush();
    assert.deepEqual(values,[false]);assert.deepEqual(Object.keys(listeners),[]);
  });

  test(`${spec.name}: real desktop reply resolves the routed request and clears state`, async () => {
    const f = fixture(spec);
    const promise = f.messenger.request("history/list", { sessionId: "session-a" });
    await flush();
    const message = f.sent[0];
    assert.equal(message.workspaceKey, "local:F:/fixture/a");
    assert.equal(message.workspaceRef.workspaceDir, "F:/fixture/a");
    assert.equal(f.messenger.routedWorkspaceKeysByMessageId.get(message.messageId), message.workspaceKey);
    f.reply(message.messageId, { done: true, status: "success", content: [{ path: "F:/fixture/a" }] });
    const reply = await promise;
    assert.equal(reply.status, "success");
    assert.equal(reply.content[0].path, "F:/fixture/a");
    f.assertClean();
  });
  test(`${spec.name}: actual incoming permission listener keeps A's original route after A closes and B is active`, async () => {
    const source = fs.readFileSync(path.join(root, "src/frontend/bundle/assets", spec.file), "utf8");
    const listenerSource = between(source, "function ma(e, t, n, r) {", "\nfunction Mx(");
    const f = fixture(spec);
    let listener, cleanup, choose;
    const chosen = new Promise(resolve => { choose = resolve; });
    const context = vm.createContext({
      E: { useContext: () => f.messenger, useEffect: (effect) => { cleanup = effect(); } }, Ft: {},
      Ogn: () => true, Agn: () => true,
      window: { addEventListener: (_type, handler) => { listener = handler; }, removeEventListener() {} },
    });
    vm.runInContext(`${listenerSource}\nma("acp/requestPermission", () => fixtureChoice);`, Object.assign(context, {fixtureChoice: chosen}));
    const handling = listener({ data: {messageType:"acp/requestPermission",messageId:"incoming-a",_hubWorkspaceKey:"local:F:/fixture/a",data:{sessionId:"session-a"}} });
    await flush();
    f.state.hub.workspaces = f.state.hub.workspaces.filter(item => item.workspaceKey !== "local:F:/fixture/a");
    f.state.hub.activeWorkspaceKey = "local:F:/fixture/b";
    choose({outcome:{outcome:"cancelled"}});
    await handling;
    assert.equal(f.sent.at(-1).messageId, "incoming-a");
    assert.equal(f.sent.at(-1).workspaceKey, "local:F:/fixture/a");
    f.assertClean(); cleanup();
  });

  test(`${spec.name}: backend error remains an error envelope for the UI`, async () => {
    const f = fixture(spec);
    const promise = f.messenger.request("tjhub/getEditors", { sessionId: "session-a" });
    await flush();
    f.reply(f.sent[0].messageId, { done: true, status: "error", error: "Editor enumeration failed" });
    assert.equal((await promise).error, "Editor enumeration failed");
    assert.equal(f.errors[0].error, "Editor enumeration failed");
    f.assertClean();
  });

  for (const method of ["request", "requestWithMessageId", "immediate"]) {
    test(`${spec.name}: ${method} preserves its successful response shape`, async () => {
      const f = fixture(spec);
      const promise = invoke(f.messenger, method);
      await flush();
      const messageId = f.sent[0].messageId;
      f.reply(messageId, { done: true, status: "success", content: [] });
      const result = await promise;
      if (method === "requestWithMessageId") {
        assert.equal(result.messageId, messageId);
        assert.equal(result.data.status, "success");
      } else assert.equal(result.status, "success");
      f.assertClean();
    });

    test(`${spec.name}: ${method} rejects a missing reply after 30 seconds`, async () => {
      const f = fixture(spec);
      const result = assert.rejects(invoke(f.messenger, method), (error) => error.code === "REQUEST_TIMEOUT");
      await f.advance(29999);
      assert.equal(f.messenger.pendingRequests.size, 1);
      await f.advance(1);
      await result;
      assert.equal(f.errors.length, 1);
      f.assertClean();
      f.reply(f.sent[0].messageId, { done: true, status: "success", content: [] });
      f.assertClean();
    });

    test(`${spec.name}: ${method} propagates transport failures and removes routing`, async () => {
      const f = fixture(spec);
      f.onSend(() => { throw new Error("fixture host disconnected"); });
      await assert.rejects(invoke(f.messenger, method), /fixture host disconnected/);
      assert.equal(f.errors.length, 1);
      f.assertClean();
    });
  }

  for (const replyId of [null, "shell-replaced-id"]) {
    test(`${spec.name}: unmatched desktop reply ${replyId} reaches a bounded failure`, async () => {
      const f = fixture(spec);
      const result = assert.rejects(f.messenger.request("tjhub/getEditors", { sessionId: "session-a" }), /timed out/);
      await flush();
      f.reply(replyId, { done: true, status: "success", content: [] });
      assert.equal(f.messenger.pendingRequests.size, 1);
      await f.advance(30000);
      await result;
      f.assertClean();
    });
  }

  test(`${spec.name}: timed out connection wait cannot send a late request`, async () => {
    const f = fixture(spec, { ready: false });
    const result = assert.rejects(f.messenger.request("tjhub/getEditors", { sessionId: "session-a" }), /timed out/);
    assert.equal(f.messenger.connectionReadyCallbacks.length, 1);
    await f.advance(30000);
    await result;
    f.messenger.markConnectionReady();
    await flush();
    assert.equal(f.sent.length, 0);
    f.assertClean();
  });

  test(`${spec.name}: no-handler retries end after one retry and one second`, async () => {
    const f = fixture(spec);
    f.onSend((message) => f.reply(message.messageId, {
      done: true,
      status: "error",
      error: `No handler for message type "${message.messageType}"`,
    }));
    const promise = f.messenger.request("fixture/unsupported", { sessionId: "session-a" });
    await flush();
    assert.equal(f.sent.length, 1);
    await f.advance(1000);
    const result = await promise;
    assert.equal(result.status, "error");
    assert.equal(f.sent.length, 2);
    assert.equal(f.errors.length, 1);
    f.assertClean();
  });

  test(`${spec.name}: retry time is included in the ordinary request deadline`, async () => {
    const f = fixture(spec);
    const result = assert.rejects(f.messenger.request("fixture/unsupported", { sessionId: "session-a" }), /timed out/);
    await f.advance(28000);
    f.reply(f.sent[0].messageId, { done: true, status: "error", error: "No handler for message type fixture/unsupported" });
    await flush();
    await f.advance(1000);
    assert.equal(f.sent.length, 2);
    await f.advance(1000);
    await result;
    assert.equal(f.now, 30000);
    f.assertClean();
  });

  test(`${spec.name}: existing long-operation timeout contracts are preserved`, async () => {
    const f = fixture(spec);
    assert.equal(f.messenger.getRequestTimeout("tjhub/getRecentProjects"), 30000);
    assert.equal(f.messenger.getRequestTimeout("history/load"), 60000);
    assert.equal(f.messenger.getRequestTimeout("unity/invokeTool"), 120000);
    const result = assert.rejects(f.messenger.request("unity/invokeTool", { sessionId: "session-a" }), /120000ms/);
    await f.advance(30000);
    assert.equal(f.messenger.pendingRequests.size, 1);
    await f.advance(90000);
    await result;
    f.assertClean();
  });

  test(`${spec.name}: streams keep their independent lifetime and ordered chunks`, async () => {
    const f = fixture(spec);
    const stream = f.messenger.streamRequest("fixture/stream", { sessionId: "session-a" }, undefined, "stream-fixture");
    const first = stream.next();
    await f.advance(31000);
    assert.equal(f.messenger.pendingRequests.size, 0);
    assert.equal(f.listeners.size, 2);
    f.reply("stream-fixture", { done: false, status: "success", content: "first" }, "fixture/stream");
    await f.advance(100);
    assert.equal((await first).value[0], "first");
    const second = stream.next();
    await flush();
    f.reply("stream-fixture", { done: false, status: "success", content: "second" }, "fixture/stream");
    f.reply("stream-fixture", { done: true, status: "success", content: "complete" }, "fixture/stream");
    await f.advance(100);
    assert.equal((await second).value[0], "second");
    const finished = await stream.next();
    assert.equal(finished.done, true);
    assert.equal(finished.value, "complete");
    assert.equal(f.listeners.size, 1);
    f.assertClean();
  });
}
