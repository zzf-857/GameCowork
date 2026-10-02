import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
const operationsSource = fs.readFileSync(assets + "gamecowork-history-operations.js", "utf8");
const createOperations = vm.runInNewContext(operationsSource.replace("export function", "function") + "\ncreateGameCoworkHistoryOperations", { Date, Error });
const settingsErrorSource = fs.readFileSync(assets + "gamecowork-settings-errors.js", "utf8");
const keepAwakeFailureMessage = vm.runInNewContext(settingsErrorSource.replace("export function", "function") + "\nkeepAwakeFailureMessage", { Error });
test("Sleep-prevention persistence errors give a retry action and unknown reasons remain bounded", () => {
  assert.match(keepAwakeFailureMessage(new Error("Cannot persist keep-awake preference: workspace_state_replace_failed")), /设置未保存，原设置已保留/);
  assert.ok(!keepAwakeFailureMessage(new Error("Cannot persist keep-awake preference: workspace_state_replace_failed")).includes("workspace_state"));
  assert.ok(keepAwakeFailureMessage("Owned refusal " + "x".repeat(500)).length < 270);
});
function declaration(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf("\n}", start) + 2);
}
const deferred = () => { let resolve; const promise = new Promise(value => { resolve = value; }); return { promise, resolve }; };
for (const [label, file, hook, language, contextName, dispatchName, sessionSelector, ownerSelector, store, save, draft, draftConvert, branchId, metadata, modal, preview] of [
  ["current", "index-BRxZ4eG7.js", "pX", "Ie", "tt", "Ge", "_t", "Tg", "ot", "vk", "Jg", "hX", "Y0", "zg", "Ct", "xk"],
  ["previous", "index-DvRYaIVa.js", "dX", "ke", "st", "ze", "Ct", "Fg", "it", "wk", "qg", "uX", "J0", "Wg", "Bt", "yk"],
]) {
  const source = fs.readFileSync(assets + file, "utf8");
  test(`${label}: actual modal acquires focus once, refreshes only its timer as JSX changes, and releases its own claim`, () => {
    const name = modal === "Ct" ? "Mm" : "Lm", marker = `const ${name} = `, start = source.indexOf(marker) + marker.length;
    assert.ok(start > marker.length);
    const expression = source.slice(start, source.indexOf("\n  },", start) + 4);
    const effects = [], pending = [], ref = { current: null }; let slot = 0, requested = 0, released = 0, scheduled = 0, cancelled = 0;
    const context = vm.createContext({ d: { useRef: () => ref, isValidElement: () => true, useEffect: (callback, deps) => {
      const index = slot++, previous = effects[index];
      if (!previous || deps.some((value, i) => value !== previous.deps[i])) pending.push(() => { previous?.cleanup?.(); effects[index] = { deps, cleanup: callback() }; });
    } }, vi: () => ({ requestFocus: () => requested++, releaseFocus: () => released++ }),
      gamecoworkScheduleDialogFocus: () => { scheduled++; return () => cancelled++; }, at() {}, At() {}, it: { DIALOG: 1 }, ot: { DIALOG: 1 },
      Qn: { createPortal: value => value }, a: { jsx: (_type, props) => props, jsxs: (_type, props) => props },
      is: { isValidElement: () => true }, Ex: {}, _x: {}, We: {}, Ge: {}, mr: {}, Hs: {}, V_: {}, D_: {}, document: { body: {} },
    });
    const render = vm.runInContext(`(${expression})`, context);
    function frame(showDialog) { slot = 0; render({ showDialog, message: {}, hideClose: true, onClose() {} }); while (pending.length) pending.shift()(); }
    frame(false); assert.equal(released, 0, "a never-opened row does not release another dialog's focus");
    for (let i = 0; i < 5; i++) frame(true);
    assert.equal(requested, 1); assert.equal(scheduled, 5); assert.equal(cancelled, 4);
    frame(false); assert.equal(released, 1); assert.equal(cancelled, 5);
  });
  function fixture(handler = async () => null) {
    const history = [ { message: { role: "user", id: "u1" } }, { message: { role: "assistant", id: "a1" } }, { message: { role: "user", id: "u2" } }, { message: { role: "assistant", id: "a2" } } ];
    const state = { session: { activeSessionId: "a", sessions: { a: { workspaceId: "A", history }, b: { workspaceId: "B", history: [] } }, sessionIdToWorkspaceKey: {} },
      hub: { isHubMode: true, activeWorkspaceKey: "A", workspaces: [{ workspaceKey: "A", workspaceDir: "C:/owned/A" }, { workspaceKey: "B", workspaceDir: "C:/owned/B" }] } };
    const calls = [], actions = [], toasts = [], epochs = { A: 0, B: 0 };
    const messenger = { ide: { showToast: (level, message) => toasts.push({ level, message }) }, request: async (method, data) => {
      calls.push({ method, data });
      return await handler(method, data) ?? { status: "success", content: method === "history/fork" ? { sessionId: "branch", title: "Owned fork" } : method === "history/rewind" ? { canRewind: true, changedFiles: [], ...(data.type === "code" ? { applied: true } : {}) } : null };
    } };
    const action = type => payload => ({ type, payload });
    const jsx = (type, props) => ({ type, props });
    const context = vm.createContext({ createGameCoworkHistoryOperations: createOperations,
      d: { useContext: () => messenger, useRef: value => ({ current: value }), useEffect() {}, useMemo: fn => fn() },
      [language]: () => ({ t: key => key }), [contextName]: {}, [dispatchName]: () => value => actions.push(value),
      M: selector => typeof selector === "function" ? selector(state) : selector === "session" ? state.session.sessions.a : selector === "id" ? "a" : "A",
      [sessionSelector]: "session", pc: "id", Ps: "workspace", [ownerSelector]: () => () => "A", [store]: { getState: () => state },
      gamecoworkWorkspaceLease: (_state, key) => ({ key, epoch: epochs[key] }),
      gamecoworkWorkspaceLeaseCurrent: (current, lease) => current.hub.workspaces.some(row => row.workspaceKey === lease.key) && epochs[lease.key] === lease.epoch,
      [save]: value => value, [draftConvert]: (_editor, text) => ({ content: text }), [branchId]: (_source, id) => id,
      _a: action("branch"), [metadata]: action("metadata"), [draft]: action("draft"), $s: action("refresh"),
      gamecoworkHistoryToast: Object.fromEntries(["error", "warning", "info"].map(level => [level, message => toasts.push({ level, message })])),
      [modal]: action("show"), Tn: action("dialog"), An: "New conversation", a: { jsx }, [preview]: "preview",
    });
    const resolveItems = vm.runInContext(`(${declaration(source, hook)})`, context)("a");
    const items = resolveItems({ messageId: "u2", textContent: "Owned draft" });
    return { state, calls, actions, toasts, epochs, resolveItems, items, fork: items[0].onClick, rewind: items[1].onClick, both: items[2].onClick,
      dialog: () => actions.findLast(item => item.type === "dialog" && item.payload)?.payload.props,
      switchToB() { state.session.activeSessionId = "b"; state.hub.activeWorkspaceKey = "B"; },
      closeA() { state.hub.workspaces = state.hub.workspaces.filter(row => row.workspaceKey !== "A"); epochs.A++; },
    };
  }
  test(`${label}: both fork and rewind reject an active stream before any request`, async () => {
    const f = fixture(); f.state.session.sessions.a.isInChatRound = true;
    await f.fork(); await f.rewind(); await f.both();
    assert.equal(f.calls.length, 0); assert.equal(f.actions.length, 0); assert.equal(f.toasts.length, 3);
  });
  test(`${label}: unchanged message menus preserve component identity through sidebar and modal updates`, () => {
    const f = fixture();
    assert.equal(f.resolveItems({ messageId: "u2", textContent: "Owned draft" }), f.items);
    assert.notEqual(f.resolveItems({ messageId: "u2", textContent: "Edited draft" }), f.items);
  });
  test(`${label}: actual hook persists the branch before selecting it and prevents duplicate submissions`, async () => {
    const save = deferred(); const f = fixture(method => method === "history/save" ? save.promise : null);
    const pending = f.fork(); await new Promise(resolve => setImmediate(resolve)); await f.fork();
    assert.deepEqual(f.calls.map(call => call.method), ["history/fork", "history/save"]);
    assert.equal(f.actions.length, 0);
    save.resolve({ status: "success", content: null }); await pending;
    assert.deepEqual(f.actions.map(item => item.type), ["branch", "metadata", "refresh", "draft"]);
    assert.equal(f.actions[0].payload.workspaceKey, "A");
    assert.equal(f.actions[0].payload.session.history.length, 2);
    assert.ok(f.calls.every(call => call.data.workspaceKey === "A"));
  });
  test(`${label}: failed persistence compensates only the new branch and preserves the source`, async () => {
    const f = fixture(method => method === "history/save" ? { status: "success", content: { status: "error", error: "Owned save failure" } } : null);
    await f.fork();
    assert.deepEqual(f.calls.map(call => call.method), ["history/fork", "history/save", "history/delete"]);
    assert.equal(f.calls[2].data.id, "branch"); assert.equal(f.calls[2].data.workspaceKey, "A");
    assert.equal(f.actions.length, 0); assert.equal(f.state.session.activeSessionId, "a");
    assert.match(f.toasts[0].message, /Owned save failure/);
  });
  test(`${label}: switching to B while A forks preserves B and routes A persistence explicitly`, async () => {
    const reply = deferred(); const f = fixture(method => method === "history/fork" ? reply.promise : null);
    const pending = f.fork(); f.switchToB(); reply.resolve({ status: "success", content: { sessionId: "branch", title: "Owned fork" } }); await pending;
    assert.equal(f.state.session.activeSessionId, "b");
    assert.ok(f.calls.every(call => call.data.workspaceKey === "A"));
    assert.deepEqual(f.actions.map(item => item.type), ["metadata", "refresh"]);
    assert.equal(f.actions[0].payload.workspaceKey, "A");
  });
  test(`${label}: closed and reopened A discards a late fork from its previous lease`, async () => {
    const reply = deferred(); const f = fixture(method => method === "history/fork" ? reply.promise : null);
    const pending = f.fork(); f.closeA(); f.state.hub.workspaces.push({ workspaceKey: "A", workspaceDir: "C:/owned/A" });
    reply.resolve({ status: "success", content: { sessionId: "branch", title: "Owned fork" } }); await pending;
    assert.equal(f.calls.length, 1); assert.equal(f.actions.length, 0);
  });
  test(`${label}: a new stream while the branch is being saved removes only that incomplete branch`, async () => {
    const save = deferred(); const f = fixture(method => method === "history/save" ? save.promise : null);
    const pending = f.fork(); await new Promise(resolve => setImmediate(resolve));
    f.state.session.sessions.a.isStreaming = true; save.resolve({ status: "success", content: null }); await pending;
    assert.deepEqual(f.calls.map(call => call.method), ["history/fork", "history/save", "history/delete"]);
    assert.equal(f.calls[2].data.id, "branch"); assert.equal(f.calls[2].data.workspaceKey, "A");
    assert.equal(f.actions.length, 0); assert.ok(f.state.session.sessions.a); assert.ok(f.state.session.sessions.b);
  });
  test(`${label}: A's late rewind preview does not open a modal over B`, async () => {
    const reply = deferred(); const f = fixture(method => method === "history/rewind" ? reply.promise : null);
    const pending = f.rewind(); f.switchToB(); reply.resolve({ status: "success", content: { canRewind: true, changedFiles: [] } }); await pending;
    assert.equal(f.actions.length, 0);
  });
  test(`${label}: confirming a preview rechecks streaming and cannot write while a new turn is active`, async () => {
    const f = fixture(); await f.rewind(); f.state.session.sessions.a.isStreaming = true; await f.dialog().onConfirm();
    assert.equal(f.calls.length, 1); assert.equal(f.calls[0].data.type, "dryRun");
    assert.equal(f.toasts.at(-1).level, "warning");
  });
  test(`${label}: fork-and-rewind saves the matching sliced transcript after the code operation`, async () => {
    const f = fixture(); await f.both(); await f.dialog().onConfirm();
    assert.deepEqual(f.calls.map(call => call.method), ["history/rewind", "history/rewind", "history/fork", "history/save"]);
    assert.equal(f.calls[0].data.id, 1); assert.equal(f.calls[1].data.type, "code"); assert.equal(f.calls[2].data.id, 1);
    assert.equal(f.actions.find(item => item.type === "branch").payload.workspaceKey, "A");
  });
  test(`${label}: stale message history and unavailable checkpoints leave the dialog retryable without false success`, async () => {
    const f = fixture(); await f.rewind(); f.state.session.sessions.a.history.push({ message: { role: "user", id: "new" } }); await f.dialog().onConfirm();
    assert.equal(f.calls.length, 1); assert.match(f.toasts.at(-1).message, /conversation changed/); assert.ok(f.dialog());
    const unavailable = fixture(() => ({ status: "success", content: { canRewind: false } })); await unavailable.rewind();
    assert.equal(unavailable.actions.length, 0); assert.equal(unavailable.toasts[0].level, "error");
  });
  test(`${label}: a success envelope without confirmed code application cannot close the preview or claim success`, async () => {
    const f = fixture((method, data) => method === "history/rewind" && data.type === "code" ? { status: "success", content: { canRewind: true } } : null);
    await f.rewind(); await f.dialog().onConfirm();
    assert.equal(f.toasts.at(-1).level, "error"); assert.match(f.toasts.at(-1).message, /not confirmed/);
    assert.equal(f.actions.filter(item => item.type === "show" && item.payload === false).length, 0);
  });
  test(`${label}: persistent text changes with the same message ID invalidate the selected checkpoint`, async () => {
    for (const index of [0, 1]) {
      const f = fixture(); await f.rewind();
      f.state.session.sessions.a.history[index].message.content = "Owned edited text, unchanged ID";
      await f.dialog().onConfirm();
      assert.equal(f.calls.length, 1); assert.match(f.toasts.at(-1).message, /conversation changed/);
    }
  });
  test(`${label}: after code restores but branch persistence fails, retry creates only the branch`, async () => {
    let failSave = true;
    const f = fixture(method => method === "history/save" && failSave ? (failSave = false, { status: "error", error: "Owned persistence failure" }) : null);
    await f.both(); await f.dialog().onConfirm();
    assert.match(f.toasts.at(-1).message, /Code was restored/);
    await f.dialog().onConfirm();
    assert.equal(f.calls.filter(call => call.method === "history/rewind" && call.data.type === "code").length, 1);
    assert.equal(f.calls.filter(call => call.method === "history/fork").length, 2);
    assert.ok(f.actions.some(item => item.type === "branch"));
  });
}

for (const [label, file, name, preview, devices] of [
  ["current", "VscTheme-BExNMG_K.js", "Hdn", "$dn", "zdn"],
  ["previous", "VscTheme-B-CSeuv5.js", "$dn", "zdn", "qdn"],
]) {
  const source = fs.readFileSync(assets + file, "utf8");
  function settingFixture(handler) {
    const updates = [], stateUpdates = [], requests = []; let stateIndex = 0;
    const jsx = (type, props) => ({ type, props });
    const context = vm.createContext({ Error, keepAwakeFailureMessage, E: { useContext: () => ({ request: async (method, data) => { requests.push({ method, data }); return handler(method, data); } }),
      useState: value => { const index = stateIndex++; return [value, next => stateUpdates.push({ index, value: next })]; }, useRef: value => ({ current: value }) },
      Rt: () => ({ t: key => key }), Ft: {}, p: { jsx, jsxs: jsx }, Do: "title", In: "scroll", Yf: "group", [devices]: "devices", [preview]: "preview", c$: value => updates.push({ tunnel: value }),
    });
    const tree = vm.runInContext(`(${declaration(source, name)})`, context)({ tunnelEnabled: false, setTunnelEnabled: value => updates.push({ tunnel: value }),
      tunnelPreferenceTouchedRef: { current: false }, keepAwake: false, setKeepAwake: value => updates.push({ awake: value }) });
    function groups(node) { if (!node || typeof node !== "object") return []; return [...(node.props?.group ? [node.props.group] : []), ...[node.props?.children].flat(Infinity).flatMap(groups)]; }
    return { toggle: groups(tree).find(group => group.id === "powerAndAvailability").settings[0], remote: groups(tree).find(group => group.id === "remoteAccess").settings[0], updates, stateUpdates, requests };
  }
  test(`${label}: sleep prevention works independently of a tunnel and waits for confirmed backend state`, async () => {
    const response = deferred(); const f = settingFixture(() => response.promise);
    assert.equal(f.toggle.disabled, false);
    const pending = f.toggle.onToggle(); await f.toggle.onToggle(); assert.equal(f.requests.length, 1); assert.equal(f.updates.length, 0);
    response.resolve({ status: "success", content: { status: "success", enabled: true, requestedEnabled: true, active: true, suppressed: false } }); await pending;
    assert.deepEqual(f.updates, [{ awake: true }]); assert.equal(f.stateUpdates.at(-1).value, false);
  });
  test(`${label}: a refused sleep setting keeps the previous value and exposes the failure`, async () => {
    const f = settingFixture(() => ({ status: "success", content: { status: "error", error: "Owned refusal" } }));
    await f.toggle.onToggle(); assert.equal(f.updates.length, 0); assert.ok(f.stateUpdates.some(update => typeof update.value === "string" && update.value.includes("Owned refusal")));
    assert.ok(declaration(source, name).includes('"data-testid": "gamecowork-keep-awake-error"'));
  });
  test(`${label}: attempting an unavailable tunnel does not change sleep prevention`, async () => {
    const f = settingFixture(() => ({ status: "error", error: "Remote access is not configured" }));
    f.remote.onToggle(); await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(f.requests.map(item => item.method), ["tauri/setTunnelEnabled"]);
    assert.ok(!f.updates.some(item => "awake" in item));
  });
}
