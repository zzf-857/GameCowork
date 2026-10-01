import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const assets = new URL("../../src/frontend/bundle/assets/", import.meta.url);
const read = name => fs.readFileSync(new URL(name, assets), "utf8").replaceAll("\r\n", "\n");
function method(source, name) { const start = source.indexOf("function " + name + "("), end = source.indexOf("\n}\n", start) + 2; assert.ok(start >= 0 && end > start); return source.slice(start, end); }
function callback(source, name, next, constant = false) {
  const marker = (constant ? "  const " : "    ") + name + " = d.useCallback(", start = source.indexOf(marker), end = source.indexOf("    " + next + " = d.useCallback(", start);
  assert.ok(start >= 0 && end > start, `The actual ${name} callback remains extractable`);
  return source.slice(start, end).trim().replace(new RegExp("^(?:const )?" + name + " = "), "").replace(/,$/, ";");
}
function deferred() { let resolve, reject; const promise = new Promise((done, fail) => { resolve = done; reject = fail; }); return { promise, resolve, reject }; }
for (const [theme, index, normalize, setAction, fetchEnd, getter, preview] of [
  ["VscTheme-BExNMG_K.js", "index-BRxZ4eG7.js", "kie", "oxe", "ubn", "bh", "wX"],
  ["VscTheme-B-CSeuv5.js", "index-DvRYaIVa.js", "Sie", "sxe", "cbn", "vh", "pX"],
]) {
  const source = read(theme), ui = read(index), lifecycleStart = source.indexOf("const gamecoworkWorkspaceLifecycle ="), lifecycleEnd = source.indexOf("const zkt =", lifecycleStart);
  const helpers = source.slice(lifecycleStart, lifecycleEnd).replace(/^export .*$/gm, ""); assert.ok(lifecycleStart >= 0 && lifecycleEnd > lifecycleStart);
  const reducer = (name, next) => { const start = source.indexOf("      " + name + "(e,"), end = source.indexOf("\n      " + next + "(", start); assert.ok(start >= 0 && end > start); return "(" + source.slice(start, end).trim().replace(new RegExp("^" + name + "\\("), "function (").replace(/,$/, "") + ")"; };
  function fixture() {
    const rows = [{ workspaceKey: "A", workspaceDir: "F:/owned/A" }, { workspaceKey: "B", workspaceDir: "F:/owned/B" }];
    const state = { hub: { isHubMode: true, activeWorkspaceKey: "A", workspaces: rows, hiddenWorkspaceKeys: [], hasDispatchedCliPending: true }, session: { activeSessionId: "session-a", sessions: { "session-a": { workspaceId: "A", history: ["retained"] } }, sessionIdToWorkspaceKey: {}, sessionMetadataById: { "session-a": { workspaceDirectory: "F:/owned/A" } } }, tabs: { unsaved: "retained-user-buffer" } };
    const ctx = vm.createContext({ window: { GAMECOWORK_SHELL: true, location: { origin: "http://127.0.0.1:30000" } }, [normalize]: value => value, dS: values => values[0]?.workspaceKey || null, B9e: value => value.workspaceKey, $d: () => false });
    vm.runInContext(helpers, ctx);
    ctx.set = vm.runInContext(reducer("setHubWorkspaces", "setActiveWorkspaceKey"), ctx);
    ctx.activate = vm.runInContext(reducer("setActiveWorkspaceKey", "addHubWorkspace"), ctx);
    ctx.add = vm.runInContext(reducer("addHubWorkspace", "removeHubWorkspace"), ctx);
    ctx.remove = vm.runInContext(reducer("removeHubWorkspace", "hideWorkspace"), ctx);
    return { ctx, state, rows };
  }
  function fetchFixture() {
    const value = fixture(), pending = [], actions = [], { ctx, state } = value;
    Object.assign(ctx, { Og: () => false, sr: (_name, actual) => actual, P9e: entry => entry, fetch: () => { const request = deferred(); pending.push(request); return request.promise; },
      [setAction]: values => ({ type: "registry", values }), Kkt: key => ({ type: "cli-pending", key }), Qkt: () => ({ type: "cli-dispatched" }) });
    const start = source.indexOf("const zkt ="), end = source.indexOf("  " + fetchEnd + " = sr(", start); assert.ok(end > start);
    vm.runInContext(source.slice(start, end).trim().replace(/,$/, ";") + "globalThis.actualFetch = zkt;", ctx);
    return { ...value, pending, actions, fetch() { return ctx.actualFetch(undefined, { dispatch(action) { actions.push(action); if (action.type === "registry") ctx.set(state.hub, { payload: action.values }); }, getState: () => state }); } };
  }
  function callbackFixture(name, next, constant = false) {
    const value = fixture(), { ctx, state } = value, actions = [], visuals = [], old = index === "index-DvRYaIVa.js";
    Object.assign(ctx, { d: { useCallback: actual => actual }, [getter]: () => ({ getState: () => state }), console: { warn() {} },
      Ne: key => ctx.gamecoworkWorkspaceLive(state, key) ? state.hub.workspaces.find(row => row.workspaceKey === key) : undefined,
      u: action => actions.push(action), t: value => visuals.push(value) });
    return { ...value, actions, visuals, old, install() { return vm.runInContext(callback(ui, name, next, constant), ctx); } };
  }
  test(`${theme}: closing only A invalidates its lease; a failed close preserves the original UI and B`, () => {
    const { ctx, state, rows } = fixture(), a = ctx.gamecoworkWorkspaceLease(state, "A"), b = ctx.gamecoworkWorkspaceLease(state, "B");
    ctx.gamecoworkWorkspaceTransition("A", "closing");
    assert.equal(ctx.gamecoworkWorkspaceLeaseCurrent(state, a), false); assert.equal(ctx.gamecoworkWorkspaceLeaseCurrent(state, b), true);
    ctx.gamecoworkWorkspaceTransition("A", "failed"); assert.equal(state.hub.workspaces, rows); assert.equal(state.tabs.unsaved, "retained-user-buffer");
    assert.equal(ctx.gamecoworkWorkspaceLive(state, "A"), true); assert.equal(ctx.gamecoworkWorkspaceLeaseCurrent(state, a), false);
  });
  test(`${theme}: late cached adds and snapshots cannot resurrect A; confirmed reopen gets a fresh lease`, () => {
    const { ctx, state, rows } = fixture(), old = ctx.gamecoworkWorkspaceLease(state, "A");
    ctx.remove(state.hub, { payload: "A" }); ctx.add(state.hub, { payload: rows[0] }); ctx.activate(state.hub, { payload: "A" });
    ctx.set(state.hub, { payload: rows }); assert.deepEqual(state.hub.workspaces.map(row => row.workspaceKey), ["B"]); assert.equal(state.hub.activeWorkspaceKey, "B");
    ctx.gamecoworkWorkspaceTransition("A", "opened"); ctx.add(state.hub, { payload: rows[0] });
    assert.equal(ctx.gamecoworkWorkspaceLeaseCurrent(state, old), false); assert.equal(ctx.gamecoworkWorkspaceLeaseCurrent(state, ctx.gamecoworkWorkspaceLease(state, "A")), true);
  });
  test(`${theme}: the actual fetch thunk drops a pre-close registry snapshot`, async () => {
    const { ctx, state, rows } = fixture(); let release; const actions = [];
    Object.assign(ctx, { Og: () => false, sr: (_name, callback) => callback, P9e: value => value, fetch: () => new Promise(resolve => release = resolve), [setAction]: values => ({ values }) });
    const start = source.indexOf("const zkt ="), end = source.indexOf("  " + fetchEnd + " = sr(", start); assert.ok(end > start);
    vm.runInContext(source.slice(start, end).trim().replace(/,$/, ";") + "globalThis.actualFetch = zkt;", ctx);
    const pending = ctx.actualFetch(undefined, { dispatch: action => { actions.push(action); ctx.set(state.hub, { payload: action.values }); }, getState: () => state });
    ctx.remove(state.hub, { payload: "A" }); release({ ok: true, json: async () => ({ workspaces: rows }) }); await pending;
    assert.deepEqual(actions, []); assert.deepEqual(state.hub.workspaces.map(row => row.workspaceKey), ["B"]);
  });
  test(`${index}: the actual closed-owner action detaches the last session without deleting history or buffers`, () => {
    const { ctx, state } = fixture(), actions = [];
    state.hub.workspaces = []; state.hub.activeWorkspaceKey = null;
    Object.assign(ctx, { Ss: id => ({ type: "activate-session", id }), _a: payload => ({ type: "new-session", payload }), gamecoworkRememberedSession: () => null });
    vm.runInContext(method(ui, "gamecoworkDetachClosedOwner"), ctx); ctx.gamecoworkDetachClosedOwner(action => actions.push(action), state, "A");
    assert.equal(actions[0].type, "new-session"); assert.equal(actions[0].payload.skipProjectDraftRestore, true); assert.equal(actions[0].payload.workspaceKey, undefined);
    assert.deepEqual(state.session.sessions["session-a"].history, ["retained"]); assert.equal(state.tabs.unsaved, "retained-user-buffer");
  });
  test(`${index}: closed session metadata and encoded keys cannot become the active preview root`, () => {
    const { ctx, state } = fixture(); Object.assign(ctx, { pd: value => value, hd: value => value });
    vm.runInContext(method(ui, preview), ctx); ctx.remove(state.hub, { payload: "A" });
    assert.equal(ctx[preview](state), undefined); assert.equal(state.hub.activeWorkspaceKey, "B");
    state.session.sessions["session-a"].workspaceId = "B"; assert.equal(ctx[preview](state), "F:/owned/B");
  });
  test(`${index}: real Ne refuses its cached closed A while independently returning live B`, () => {
    const { ctx, state, rows } = fixture(); ctx.remove(state.hub, { payload: "A" });
    Object.assign(ctx, { d: { useCallback: callback => callback }, [getter]: () => ({ getState: () => state }), Je: { current: [] }, Bt: { current: { A: rows[0] } } });
    const start = ui.indexOf("    Ne = d.useCallback((L) => {"), end = ui.indexOf("    Rt = d.useCallback(", start); assert.ok(start > 0 && end > start);
    vm.runInContext("globalThis.resolveOwner = " + ui.slice(start, end).trim().replace(/^Ne = /, "").replace(/,$/, ";"), ctx);
    assert.equal(ctx.resolveOwner("A"), undefined); assert.equal(ctx.resolveOwner("B"), rows[1]);
  });
  test(`${theme}: a GET completing during A's close cannot erase A or set CLI pending`, async () => {
    const { ctx, state, rows, pending, actions, fetch } = fetchFixture(); state.hub.hasDispatchedCliPending = false;
    const request = fetch(); ctx.gamecoworkWorkspaceTransition("A", "closing");
    pending[0].resolve({ ok: true, json: async () => ({ workspaces: [{ ...rows[1], isCliWorkspace: true }] }) });
    const current = await request;
    assert.equal(current, rows); assert.deepEqual(actions, []); assert.equal(state.hub.activeWorkspaceKey, "A");
    ctx.gamecoworkWorkspaceTransition("A", "failed"); assert.equal(ctx.gamecoworkWorkspaceLive(state, "A"), true);
  });
  test(`${theme}: a registry response from before close/reopen cannot replace the new A`, async () => {
    const { ctx, state, rows, pending, actions, fetch } = fetchFixture(), request = fetch();
    ctx.remove(state.hub, { payload: "A" }); ctx.gamecoworkWorkspaceTransition("A", "opened");
    ctx.add(state.hub, { payload: { ...rows[0], displayName: "new generation" } });
    pending[0].resolve({ ok: true, json: async () => ({ workspaces: rows }) }); await request;
    assert.deepEqual(actions, []); assert.equal(state.hub.workspaces.find(row => row.workspaceKey === "A").displayName, "new generation");
    assert.equal(ctx.gamecoworkWorkspaceLive(state, "B"), true);
  });
  test(`${theme}: the most recent actual registry GET wins when responses arrive out of order`, async () => {
    const { state, rows, pending, actions, fetch } = fetchFixture(), first = fetch(), second = fetch();
    pending[1].resolve({ ok: true, json: async () => ({ workspaces: [rows[1]] }) }); await second;
    pending[0].resolve({ ok: true, json: async () => ({ workspaces: rows }) }); await first;
    assert.equal(actions.length, 1); assert.deepEqual(state.hub.workspaces.map(row => row.workspaceKey), ["B"]); assert.equal(state.hub.activeWorkspaceKey, "B");
  });
  test(`${index}: actual session-list replies cannot publish old A after close/reopen and do not cancel B`, async () => {
    const { ctx, state, actions, old, install } = callbackFixture("Qt", "nr"), pending = new Map(); let loading = {};
    Object.assign(ctx, { Ei: { current: {} }, OA: { current: {} }, dt: { current: {} }, Fi: payload => ({ type: "sessions", ...payload }), Os: () => true,
      [old ? "Z" : "ne"]: update => loading = update(loading), mn: (row, kind) => { assert.equal(kind, "history/list"); const request = deferred(); pending.set(row.workspaceKey, request); return request.promise; } });
    const actual = install(), a = actual("A"), b = actual("B"), oldA = pending.get("A");
    ctx.remove(state.hub, { payload: "A" }); ctx.gamecoworkWorkspaceTransition("A", "opened"); ctx.add(state.hub, { payload: { workspaceKey: "A", workspaceDir: "F:/owned/A" } });
    oldA.resolve([{ sessionId: "old-a" }]); assert.equal((await a).length, 0);
    pending.get("B").resolve([{ sessionId: "live-b" }]); await b;
    assert.deepEqual(actions.map(action => action.workspaceKey), ["B"]); assert.deepEqual(Array.from(actions[0].sessions, session => session.sessionId), ["live-b"]);
    const fresh = actual("A"); pending.get("A").resolve([{ sessionId: "new-a" }]); await fresh;
    assert.deepEqual(actions.map(action => action.workspaceKey), ["B", "A"]); assert.equal(Object.keys(loading).length, 0);
  });
  test(`${index}: an old session-list finally cannot clear a new A request's loading state`, async () => {
    const { ctx, state, actions, old, install } = callbackFixture("Qt", "nr"), pending = []; let loading = {};
    Object.assign(ctx, { Ei: { current: {} }, OA: { current: {} }, dt: { current: {} }, Fi: payload => ({ type: "sessions", ...payload }), Os: () => true,
      [old ? "Z" : "ne"]: update => loading = update(loading), mn: () => { const request = deferred(); pending.push(request); return request.promise; } });
    const actual = install(), first = actual("A"); ctx.remove(state.hub, { payload: "A" });
    ctx.gamecoworkWorkspaceTransition("A", "opened"); ctx.add(state.hub, { payload: { workspaceKey: "A", workspaceDir: "F:/owned/A" } }); const fresh = actual("A");
    assert.equal(pending.length, 2, "A's new lifetime must not reuse its old request"); pending[0].resolve([{ sessionId: "old-a" }]); await first;
    assert.equal(loading.A, true, "Only the current lifetime may clear its spinner"); assert.deepEqual(actions, []);
    pending[1].resolve([{ sessionId: "fresh-a" }]); await fresh; assert.equal(loading.A, undefined); assert.equal(actions[0].sessions[0].sessionId, "fresh-a");
  });
  for (const outcome of ["success", "rejection"]) test(`${index}: ${outcome} from an old active-stream query cannot activate a cached closed session`, async () => {
    const { ctx, state, actions, visuals, old, install } = callbackFixture("rr", "Wt", true), request = deferred(), resumes = [], remembered = [];
    const action = type => payload => ({ type, payload });
    Object.assign(ctx, { X: { viewType: "chat" }, F: { id: "different-session" }, U: { id: "different-session" }, e: null, C: { A: [{ sessionId: "session-a", title: "retained title" }] },
      Ke: { current: 0 }, De: { current: 0 }, lt: { current: new Set() }, ct: { current: new Set() }, Pe: () => state.session.sessions, Re: () => state.session.sessions,
      b() {}, B() {}, _() {}, Nq: () => false, Qq: () => false, Mq: () => false, Tq: () => false, ge: false, pt: { CHAT: "chat" }, c: value => value, h: {}, V: true,
      lr: action("activate-workspace"), zc: action("loading"), Vo: action("title"), Iu: action("create"), Eu: action("create"), Ss: action("activate-session"), qi: action("session-owner"),
      Vl: (_value, title) => title, $0: "marketplace", V0: "marketplace", vA: value => value, Rt: () => undefined,
      mn: (_row, kind) => { assert.equal(kind, "stream/getActiveStreams"); return request.promise; }, zx: value => resumes.push(value), Gx: value => resumes.push(value),
      af: value => remembered.push(value), of: value => remembered.push(value), Fc: () => { actions.push({ type: "cached-session-activation" }); return true; }, Uo: async () => {}, xs: () => assert.fail("A closed owner cannot create a fallback session") });
    const actual = install(), pending = actual("A", "session-a"); actions.length = 0; visuals.length = 0; ctx.remove(state.hub, { payload: "A" });
    if (outcome === "success") request.resolve({ activeStreams: [{ sessionId: "session-a", messageId: "old-message" }] }); else request.reject(new Error("Owned close cancelled the pending request"));
    assert.equal(await pending, false); assert.deepEqual(actions, []); assert.deepEqual(visuals, []); assert.deepEqual(resumes, []); assert.deepEqual(remembered, []);
  });
  for (const outcome of ["failure", "transport-failure", "reopened"]) test(`${index}: the actual ${outcome} close preserves live state and unsaved buffers`, async () => {
    const { ctx, state, rows } = fixture();
    const request = deferred(), dispatched = [], originalSession = state.session.sessions["session-a"];
    Object.assign(ctx, { d: { useCallback: actual => actual }, [getter]: () => ({ getState: () => state }), console: { warn() {} },
      Ne: key => state.hub.workspaces.find(row => row.workspaceKey === key), fetch: () => request.promise, pb: value => value, hb: value => value, vA: value => value,
      u: action => dispatched.push(action), Yx: key => ({ type: "remove", key }), Jx: key => ({ type: "remove", key }), Zx: key => ({ type: "remove-sessions", key }), gamecoworkDetachClosedOwner: () => assert.fail("An unsuccessful or stale close cannot detach a session") });
    const actual = vm.runInContext(callback(ui, "Rc", index === "index-DvRYaIVa.js" ? "ef" : "nf", true), ctx), pending = actual("A");
    if (outcome === "reopened") { ctx.gamecoworkWorkspaceTransition("A", "opened"); request.resolve({ ok: true }); }
    else if (outcome === "failure") request.resolve({ ok: false, status: 409, json: async () => ({ error: "Owned unsaved-state fixture refused close" }) });
    else request.reject(new Error("Owned transport fixture unavailable"));
    await pending; assert.deepEqual(dispatched, []); assert.equal(state.hub.workspaces, rows); assert.equal(state.hub.activeWorkspaceKey, "A");
    assert.equal(state.session.sessions["session-a"], originalSession); assert.equal(state.tabs.unsaved, "retained-user-buffer"); assert.equal(ctx.gamecoworkWorkspaceLive(state, "A"), true); assert.equal(ctx.gamecoworkWorkspaceLive(state, "B"), true);
  });
  test(`${theme}: the actual unscoped new-session reducer skips the closed owner's draft`, () => {
    const { ctx, state } = fixture(), legacy = theme === "VscTheme-B-CSeuv5.js", oldSession = state.session.sessions["session-a"], drafts = [];
    const ownerHelper = legacy ? "Qce" : "Kce";
    Object.assign(ctx, { fo: value => value.sessions[value.activeSessionId], qn: () => "unscoped-session", mu: id => ({ id, history: [] }), xf() {}, Kc() {},
      [legacy ? "Ufn" : "jfn"]: (_state, id, _session, key) => { drafts.push({ id, key }); return true; }, Y2: (value, id) => value.mainEditorContentTrigger = { sessionId: id, content: "empty" },
      [legacy ? "are" : "ire"]: { toolCallLimitDialog: null }, qV: () => undefined });
    vm.runInContext(method(source, ownerHelper), ctx);
    const start = source.indexOf("      newSession: (e, { payload: t }) => {"), end = source.indexOf("      ensureMarketplaceSession:", start); assert.ok(start >= 0 && end > start);
    const actual = vm.runInContext("(" + source.slice(start, end).trim().replace(/^newSession: /, "").replace(/,$/, "") + ")", ctx);
    actual(state.session, { payload: { skipProjectDraftRestore: true } });
    assert.equal(state.session.activeSessionId, "unscoped-session"); assert.equal(state.session.sessions["unscoped-session"].workspaceId, undefined);
    assert.equal(state.session.sessions["session-a"], oldSession); assert.deepEqual(oldSession.history, ["retained"]); assert.deepEqual(drafts, []); assert.equal(state.session.mainEditorContentTrigger.content, "empty");
    actual(state.session, { payload: { workspaceKey: "B" } }); assert.deepEqual(drafts, [{ id: "unscoped-session", key: "B" }]);
  });
  test(`${theme}: non-local hosts retain their former lease, add and snapshot semantics`, () => {
    const { ctx, state, rows } = fixture(); ctx.window.GAMECOWORK_SHELL = false;
    assert.equal(ctx.gamecoworkWorkspaceLive(state, "unregistered"), true); assert.equal(ctx.gamecoworkWorkspaceLeaseCurrent(state, null), true);
    const before = ctx.gamecoworkWorkspaceOwnerEpoch("A"); assert.equal(ctx.gamecoworkWorkspaceTransition("A", "closing"), undefined); assert.equal(ctx.gamecoworkWorkspaceOwnerEpoch("A"), before);
    ctx.remove(state.hub, { payload: "A" }); ctx.add(state.hub, { payload: rows[0] }); ctx.activate(state.hub, { payload: "unregistered" });
    assert.equal(state.hub.activeWorkspaceKey, "unregistered"); ctx.set(state.hub, { payload: rows }); assert.deepEqual(state.hub.workspaces.map(row => row.workspaceKey), ["A", "B"]);
  });
  test(`${index}: detaching A leaves B's active session and unsaved view untouched`, () => {
    const { ctx, state } = fixture(), actions = [], session = { workspaceId: "B", history: ["B history"] };
    state.session.activeSessionId = "session-b"; state.session.sessions["session-b"] = session;
    Object.assign(ctx, { Ss: id => ({ type: "activate-session", id }), _a: payload => ({ type: "new-session", payload }), gamecoworkRememberedSession: () => assert.fail("A's close cannot query B's session memory when B already owns the active session") });
    vm.runInContext(method(ui, "gamecoworkDetachClosedOwner"), ctx); ctx.remove(state.hub, { payload: "A" });
    ctx.gamecoworkDetachClosedOwner(action => actions.push(action), state, "A");
    assert.deepEqual(actions, []); assert.equal(state.session.activeSessionId, "session-b"); assert.equal(state.session.sessions["session-b"], session); assert.equal(state.tabs.unsaved, "retained-user-buffer");
  });
  test(`${index}: a confirmed close removes only A and restores B's remembered session`, async () => {
    const { ctx, state, rows } = fixture(), actions = [], request = deferred(), requests = []; state.session.sessions["session-b"] = { workspaceId: "B", history: ["B history"] };
    Object.assign(ctx, { d: { useCallback: actual => actual }, [getter]: () => ({ getState: () => state }), console: { warn() {} },
      Ne: key => state.hub.workspaces.find(row => row.workspaceKey === key), fetch: (url, options) => { requests.push({ url, body: JSON.parse(options.body) }); return request.promise; },
      pb: value => value, hb: value => value, vA: row => ({ runOn: "local", workspaceDir: row.workspaceDir }), Ss: id => ({ type: "activate-session", id }), _a: payload => ({ type: "new-session", payload }),
      gamecoworkRememberedSession: (_state, key) => key === "B" ? "session-b" : undefined,
      Yx: key => ({ type: index === "index-DvRYaIVa.js" ? "remove-sessions" : "remove", key }), Jx: key => ({ type: "remove", key }), Zx: key => ({ type: "remove-sessions", key }),
      u: action => { actions.push(action); if (action.type === "remove") ctx.remove(state.hub, { payload: action.key }); if (action.type === "activate-session") state.session.activeSessionId = action.id; } });
    vm.runInContext(method(ui, "gamecoworkDetachClosedOwner"), ctx);
    const actual = vm.runInContext(callback(ui, "Rc", index === "index-DvRYaIVa.js" ? "ef" : "nf", true), ctx), closing = actual("A");
    assert.equal(state.hub.workspaces, rows); assert.equal(ctx.gamecoworkWorkspaceLive(state, "B"), true); request.resolve({ ok: true }); await closing;
    assert.equal(requests[0].url, "http://127.0.0.1:30000/api/tauri/hub/close-workspace"); assert.equal(requests[0].body.workspaceKey, "A"); assert.equal(requests[0].body.workspaceRef.workspaceDir, "F:/owned/A");
    assert.deepEqual(state.hub.workspaces.map(row => row.workspaceKey), ["B"]); assert.equal(state.session.activeSessionId, "session-b"); assert.equal(actions.at(-1).type, "activate-session");
    assert.deepEqual(state.session.sessions["session-a"].history, ["retained"]); assert.equal(state.tabs.unsaved, "retained-user-buffer");
  });
  test(`${theme}: non-local hosts keep their previous out-of-order registry behavior`, async () => {
    const { ctx, state, rows, pending, actions, fetch } = fetchFixture(); ctx.window.GAMECOWORK_SHELL = false;
    const first = fetch(), second = fetch(); pending[1].resolve({ ok: true, json: async () => ({ workspaces: [rows[1]] }) }); await second;
    pending[0].resolve({ ok: true, json: async () => ({ workspaces: rows }) }); await first;
    assert.equal(actions.length, 2); assert.deepEqual(state.hub.workspaces.map(row => row.workspaceKey), ["A", "B"]);
  });
}
