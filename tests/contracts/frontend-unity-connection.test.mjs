import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { unityConnectionEpochs, beginUnityConnectionProbe } from "../../src/frontend/bundle/assets/gamecowork-unity-connectors.js";

// Execute the actual two maintained UI generations. No application, Unity,
// Provider, network, project manifest or user data process is started.
const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
const generations = ["projectMenuFlows-B5bpQmCU.js", "projectMenuFlows-CXiqDIYb.js"];
const flush = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const ok = (content) => ({ status: "success", content });
function fixture(name, request, sharedEpochs = new Map()) {
  const source = fs.readFileSync(path.join(assets, name), "utf8").replaceAll("\r\n", "\n"),
    helpersStart = source.indexOf("const gamecoworkUnityQueryEpochs ="),
    helpersEnd = source.indexOf("\nfunction H(", helpersStart),
    launchStart = source.indexOf("\nasync function le("),
    launchEnd = source.indexOf("\nasync function Ve(", launchStart);
  assert.ok(helpersStart >= 0 && helpersEnd > helpersStart && launchStart >= 0 && launchEnd > launchStart);
  const state = {
    hub: { isHubMode: true, activeWorkspaceKey: "A", workspaces: [
      { workspaceKey: "A", workspaceDir: "F:/isolated/A" },
      { workspaceKey: "B", workspaceDir: "F:/isolated/B" },
    ] },
    unity: { workspaces: Object.fromEntries(["A", "B"].map((key) => [key, {
      projectInfo: { isUnityProject: true, hasUnityMcpPackage: true, engineType: "Unity", projectRoot: "F:/isolated/" + key },
      sessionStatuses: {}, connectionStatus: { status: "not-connected" }, isLaunching: false,
    }])) },
    session: { activeSessionId: null },
  }, requests = [], actions = [], errors = [], callbacks = new Map(), timers = new Map();
  let now = 0, timerId = 0;
  const action = (type) => (payload) => ({ type, payload });
  const dispatch = (value) => {
    if (value.thunk) return value.thunk(value.payload, api);
    actions.push(value);
    const target = value.payload?.workspaceKey ? state.unity.workspaces[value.payload.workspaceKey] : state.unity;
    if (!target) return value;
    if (value.type === "status") {
      target.sessionStatuses ||= {};
      target.sessionStatuses[value.payload.sessionId] = value.payload.status;
      target.connectionStatus = value.payload.status;
    } else if (value.type === "launch") target.isLaunching = value.payload.launching;
    else if (value.type === "pid") target.editorPid = value.payload.pid;
    else if (value.type === "project") target.projectInfo = value.payload.projectInfo || value.payload;
    else if (value.type === "loading") target.projectInfoLoading = value.payload.loading;
    return value;
  };
  const messenger = { request: (type, payload) => {
    requests.push({ type, payload: structuredClone(payload) });
    return Promise.resolve(request(type, payload));
  } }, api = { dispatch, extra: { ideMessenger: messenger }, getState: () => state };
  const context = vm.createContext({
    unityConnectionEpochs: sharedEpochs,
    window: { GAMECOWORK_SHELL: true }, console, Date: { now: () => now },
    setTimeout: (callback, milliseconds) => { const id = ++timerId; timers.set(id, { callback, due: now + milliseconds }); return id; },
    clearTimeout: (id) => timers.delete(id),
    _: (name, thunk) => { callbacks.set(name, thunk); return (payload) => ({ thunk, payload }); },
    C: action("status"), me: action("launch"), g: action("pid"), W: action("project"), R: action("loading"),
    T: (info, key) => action("project")({ workspaceKey: key, projectInfo: info }),
    z: (loading, key) => action("loading")({ workspaceKey: key, loading }),
    E: (message) => errors.push(message), I() {}, k: { t: (value) => value },
    Z: { getState: () => state }, re: action("dialog"), j: action("dialog-open"), w: action("dialog-message"),
    s: { jsx: (component, props) => ({ component, props }) }, De() {},
  });
  vm.runInContext(source.slice(helpersStart, helpersEnd) + source.slice(launchStart, launchEnd), context);
  return {
    state, requests, actions, errors, callbacks, context, api, messenger, timers,
    call: (type, payload) => callbacks.get(type)(payload, api),
    open: (version, supplied) => context.gamecoworkUnityOpenEditor(messenger, dispatch, version, null, null, supplied),
    async tick(milliseconds) {
      now += milliseconds;
      for (const [id, timer] of [...timers]) if (timer.due <= now) { timers.delete(id); timer.callback(); }
      await flush(); await flush();
    },
  };
}
for (const name of generations) {
  test(name + ": status connects a workspace before any chat/model session exists", async () => {
    const f = fixture(name, () => ok({ status: "connected", editorPid: 123 }));
    await f.call("unity/getStatus");
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "connected");
    assert.equal(f.state.unity.workspaces.A.sessionStatuses["local-editor:A"].status, "connected");
    assert.equal(f.requests[0].payload.workspaceKey, "A");
    assert.equal(f.requests[0].payload.sessionId, undefined);
    assert.equal(f.state.unity.workspaces.A.editorPid, 123);
  });
  test(name + ": manual disconnected status releases launching and keeps actionable error", async () => {
    const f = fixture(name, () => ok({ status: "not-connected", error: "Bridge package is not imported" }));
    f.state.unity.workspaces.A.isLaunching = true;
    await f.call("unity/refresh", { manual: true });
    assert.equal(f.state.unity.workspaces.A.isLaunching, false);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.error, "Bridge package is not imported");
  });
  test(name + ": captured owner cannot route a delayed reply or secondary request into another active project", async () => {
    const reply = deferred(), f = fixture(name, () => reply.promise), pending = f.call("unity/getStatus");
    f.state.hub.activeWorkspaceKey = "B";
    reply.resolve(ok({ status: "connected", editorPid: 124 }));
    await pending;
    assert.equal(f.requests[0].payload.workspaceKey, "A");
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "connected");
    assert.equal(f.state.unity.workspaces.B.connectionStatus.status, "not-connected");
    assert.ok(f.actions.every((value) => value.payload.workspaceKey === "A"));
  });
  test(name + ": a newer same-owner query supersedes an old connected reply", async () => {
    const reply = deferred();
    let count = 0;
    const f = fixture(name, () => ++count === 1 ? reply.promise : ok({ status: "not-connected", error: "Editor closed" }));
    const pending = f.call("unity/getStatus");
    await f.call("unity/refresh", { manual: true });
    reply.resolve(ok({ status: "connected" }));
    await pending;
    assert.equal(f.state.unity.workspaces.A.connectionStatus.error, "Editor closed");
  });
  test(name + ": a newer connector manual probe supersedes a delayed automatic poll", async () => {
    unityConnectionEpochs.clear();
    const reply = deferred(), f = fixture(name, () => reply.promise, unityConnectionEpochs);
    const pending = f.call("unity/getStatus");
    const manualIsCurrent = beginUnityConnectionProbe({ workspaceKey: "A" }, "status");
    f.api.dispatch({ type: "status", payload: {
      workspaceKey: "A", sessionId: "local-editor:A", status: { status: "not-connected", error: "Manual probe found Editor closed" },
    } });
    reply.resolve(ok({ status: "connected" }));
    await pending;
    assert.equal(manualIsCurrent(), true);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.error, "Manual probe found Editor closed");
  });
  test(name + ": an automatic poll supersedes a previous manual probe in the shared clock", async () => {
    unityConnectionEpochs.clear();
    const manualIsCurrent = beginUnityConnectionProbe({ workspaceKey: "A" }, "status"),
      f = fixture(name, () => ok({ status: "not-connected", error: "Latest automatic result" }), unityConnectionEpochs);
    await f.call("unity/getStatus");
    assert.equal(manualIsCurrent(), false);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.error, "Latest automatic result");
  });
  test(name + ": closing an owner discards its pending status", async () => {
    const reply = deferred(), f = fixture(name, () => reply.promise), pending = f.call("unity/getStatus");
    f.state.hub.workspaces = f.state.hub.workspaces.filter((item) => item.workspaceKey !== "A");
    reply.resolve(ok({ status: "connected" }));
    await pending;
    assert.equal(f.actions.length, 0);
  });
  test(name + ": installation receipt never replaces project metadata or claims connection", async () => {
    const installed = deferred(), info = {
      isUnityProject: true, hasUnityMcpPackage: true, engineType: "Unity", projectRoot: "F:/isolated/A",
    }, f = fixture(name, (type) => type === "unity/installMcpPackage"
      ? installed.promise : ok(ok(info)));
    const pending = f.call("unity/installMcpPackage");
    f.state.hub.activeWorkspaceKey = "B";
    installed.resolve(ok(ok({ manifestUpdated: true, requiresEditorImport: true, connected: false })));
    await pending;
    assert.deepEqual(f.state.unity.workspaces.A.projectInfo, info);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "not-connected");
    assert.ok(f.requests.every((value) => value.payload.workspaceKey === "A"));
    assert.deepEqual(f.requests.map((value) => value.type), ["unity/installMcpPackage", "unity/getProjectStatus"]);
  });
  test(name + ": nested install errors keep existing metadata and release the retry state", async () => {
    const f = fixture(name, () => ok({ status: "error", error: "manifest changed" }));
    const before = f.state.unity.workspaces.A.projectInfo;
    f.state.unity.workspaces.A.isLaunching = true;
    await assert.rejects(f.call("unity/installMcpPackage"), /manifest changed/);
    assert.equal(f.state.unity.workspaces.A.projectInfo, before);
    assert.equal(f.state.unity.workspaces.A.isLaunching, false);
    assert.equal(f.requests.length, 1);
  });
  test(name + ": a successful process launch only connects after a real connected status", async () => {
    const status = deferred(), f = fixture(name, (type) => type === "unity/openEditor"
      ? ok({ success: true, pid: 125 }) : status.promise), pending = f.open();
    await flush();
    assert.equal(f.state.unity.workspaces.A.editorPid, 125);
    assert.equal(f.state.unity.workspaces.A.isLaunching, true);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "not-connected");
    status.resolve(ok({ status: "connected", editorPid: 125 }));
    await pending;
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "connected");
    assert.equal(f.state.unity.workspaces.A.isLaunching, false);
    assert.equal(f.timers.size, 0);
  });
  test(name + ": a missing bridge ends launch wait and allows retry without editing a manifest", async () => {
    const f = fixture(name, () => ok({ success: true, pid: 125 }));
    f.state.unity.workspaces.A.projectInfo.hasUnityMcpPackage = false;
    await f.open();
    assert.equal(f.state.unity.workspaces.A.isLaunching, false);
    assert.match(f.state.unity.workspaces.A.connectionStatus.error, /GameCowork Bridge/);
    await f.open();
    assert.equal(f.requests.length, 2);
    assert.ok(f.requests.every((value) => value.type === "unity/openEditor"));
  });
  test(name + ": unreachable bridge wait stops after the finite deadline and permits a new attempt", async () => {
    const f = fixture(name, (type) => type === "unity/openEditor"
      ? ok({ success: true, pid: 126 }) : ok({ status: "not-connected", processStatus: "alive" }));
    const pending = f.open();
    await flush(); await flush();
    for (let i = 0; i < 30; i++) await f.tick(2000);
    await pending;
    assert.equal(f.state.unity.workspaces.A.isLaunching, false);
    assert.match(f.state.unity.workspaces.A.connectionStatus.error, /60 秒/);
    assert.equal(f.timers.size, 0);
    assert.ok(!f.actions.some((value) => value.type === "status" && value.payload.status.status === "connected"));
  });
  test(name + ": selection keeps the captured owner and actual candidate path/engine", async () => {
    let selected = false;
    const editor = { version: "2022.3.51f1c1", path: "F:/owned/Unity.exe", product: "unity" };
    const f = fixture(name, (type) => type === "unity/openEditor"
      ? (selected ? ok({ success: true, pid: 127 }) : ok({ needsSelection: true, availableEditors: [editor] }))
      : ok({ status: "connected", editorPid: 127 }));
    await f.open();
    const dialog = f.actions.find((value) => value.type === "dialog");
    assert.equal(f.state.unity.workspaces.A.isLaunching, false);
    f.state.hub.activeWorkspaceKey = "B"; selected = true;
    await dialog.payload.message.props.onSelect(editor);
    const payload = f.requests.filter((value) => value.type === "unity/openEditor").at(-1).payload;
    assert.equal(payload.workspaceKey, "A");
    assert.equal(payload.editorPath, editor.path);
    assert.equal(payload.product, "unity");
    assert.equal(f.state.unity.workspaces.B.connectionStatus.status, "not-connected");
  });
  test(name + ": independent workspace launches do not share the legacy global busy lock", async () => {
    const a = deferred(), b = deferred(), f = fixture(name, (type, payload) =>
      type === "unity/openEditor" ? (payload.workspaceKey === "A" ? a.promise : b.promise)
        : ok({ status: "connected", editorPid: payload.workspaceKey === "A" ? 128 : 129 }));
    const one = f.open(); f.state.hub.activeWorkspaceKey = "B"; const two = f.open();
    assert.equal(f.requests.length, 2);
    a.resolve(ok({ success: true, pid: 128 })); b.resolve(ok({ success: true, pid: 129 }));
    await Promise.all([one, two]);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "connected");
    assert.equal(f.state.unity.workspaces.B.connectionStatus.status, "connected");
  });
  test(name + ": malformed status success is a disconnected error", async () => {
    const f = fixture(name, () => ok({ connected: true }));
    await f.call("unity/getStatus");
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "not-connected");
    assert.match(f.state.unity.workspaces.A.connectionStatus.error, /不完整/);
  });
  test(name + ": failed metadata read preserves identification and releases its loading indicator", async () => {
    const f = fixture(name, () => ok({ status: "error", error: "metadata unavailable" }));
    const before = f.state.unity.workspaces.A.projectInfo;
    await f.call("unity/checkProjectStatus");
    assert.equal(f.state.unity.workspaces.A.projectInfo, before);
    assert.equal(f.state.unity.workspaces.A.projectInfoLoading, false);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.error, "metadata unavailable");
  });
  test(name + ": metadata belonging to another project cannot replace the captured owner", async () => {
    const f = fixture(name, () => ok(ok({ isUnityProject: true, hasUnityMcpPackage: true, projectRoot: "F:/isolated/B" })));
    const before = f.state.unity.workspaces.A.projectInfo;
    await f.call("unity/checkProjectStatus");
    assert.equal(f.state.unity.workspaces.A.projectInfo, before);
    assert.match(f.state.unity.workspaces.A.connectionStatus.error, /不匹配/);
  });
  test(name + ": incomplete installation success never publishes metadata or a connected state", async () => {
    const f = fixture(name, () => ok(ok({ manifestUpdated: true })));
    const before = f.state.unity.workspaces.A.projectInfo;
    await assert.rejects(f.call("unity/installMcpPackage"), /安装回执不完整/);
    assert.equal(f.state.unity.workspaces.A.projectInfo, before);
    assert.equal(f.requests.length, 1);
  });
  test(name + ": default local workspace updates the root state and sends an explicit route", async () => {
    const f = fixture(name, () => ok({ status: "connected" }));
    f.state.hub.isHubMode = false;
    await f.call("unity/getStatus");
    assert.equal(f.requests[0].payload.workspaceKey, "default");
    assert.equal(f.state.unity.sessionStatuses["local-editor:default"].status, "connected");
    assert.equal(f.actions[0].payload.workspaceKey, undefined);
  });
  test(name + ": actual exported launch flow delegates to the local workspace implementation", async () => {
    const f = fixture(name, (type) => type === "unity/openEditor"
      ? ok({ success: true, pid: 130 }) : ok({ status: "connected", editorPid: 130 }));
    await f.context.le(f.messenger, f.api.dispatch);
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "connected");
    assert.equal(f.requests[0].payload.workspaceKey, "A");
  });
  test(name + ": exported flow preserves an owner captured before a lazy import or workspace switch", async () => {
    const f = fixture(name, (type) => type === "unity/openEditor"
      ? ok({ success: true, pid: 131 }) : ok({ status: "connected", editorPid: 131 }));
    const owner = { workspaceKey: "A", workspaceRef: { runOn: "local", workspaceDir: "F:/isolated/A" } };
    f.state.hub.activeWorkspaceKey = "B";
    await f.context.le(f.messenger, f.api.dispatch, undefined, undefined, undefined, { route: owner });
    assert.equal(f.requests[0].payload.workspaceKey, "A");
    assert.equal(f.state.unity.workspaces.A.connectionStatus.status, "connected");
    assert.equal(f.state.unity.workspaces.B.connectionStatus.status, "not-connected");
  });
}
