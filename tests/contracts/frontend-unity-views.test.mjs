import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
const windowTypes = ["UnityEditor.SceneView", "UnityEditor.GameView", "UnityEditor.InspectorWindow", "UnityEditor.SceneHierarchyWindow", "UnityEditor.ConsoleWindow", "UnityEditor.ProjectBrowser"];
const owner = { workspaceKey: "local:owned-a", workspaceRoot: "F:/owned/A" };
function source(name) { return fs.readFileSync(path.join(assets, name), "utf8").replaceAll("\r\n", "\n"); }
function method(text, name) {
  const start = text.indexOf(`function ${name}(`), end = text.indexOf("\n}\n", start) + 2;
  assert.ok(start >= 0 && end > start, `Actual ${name} method exists`);
  return text.slice(start, end);
}
function browser() {
  const messages = [];
  return { messages, window: { GAMECOWORK_SHELL: true, location: { origin: "http://127.0.0.1:31000" },
    postMessage: (...args) => messages.push(args) } };
}
for (const name of ["index-BRxZ4eG7.js", "index-DvRYaIVa.js"]) {
  const text = source(name), context = browser(), ctx = vm.createContext(context);
  vm.runInContext(method(text, "gamecoworkUnityViewsRequest") + method(text, "gamecoworkUnityViewsEntry"), ctx);
  const event = (data = owner) => ({ source: context.window, origin: context.window.location.origin,
    data: { source: "tauriShell", messageType: "shell/openUnityViews", data } });
  test(`${name}: the disconnected header opens only its fixed local view panel`, async () => {
    const marker = name === "index-BRxZ4eG7.js" ? "    Q = async () => {\n      if (window.GAMECOWORK_SHELL)" : "    T = async () => {\n      if (window.GAMECOWORK_SHELL)";
    const start = text.indexOf(marker), end = text.indexOf("\n    },", start);
    assert.ok(start >= 0 && end > start, "Actual header click callback exists");
    const callback = text.slice(start, end).replace(/^    [QT] = /, "") + "\n    }";
    ctx.unityViewsOwner = { workspaceKey: owner.workspaceKey, workspaceDir: owner.workspaceRoot };
    ctx.o = { request() { assert.fail("Discovering editor views cannot start a stream server"); } };
    const before = context.messages.length;
    await vm.runInContext(`(${callback})()`, ctx);
    assert.equal(context.messages.length, before + 1);
    const [message, target] = context.messages.at(-1);
    assert.equal(message.messageType, "shell/openUnityViews"); assert.equal(target, context.window.location.origin);
    assert.equal(message.data.workspaceKey, owner.workspaceKey); assert.equal(message.data.workspaceRoot, owner.workspaceRoot);
    assert.equal(message.data.windowType, undefined); assert.equal(message.data.url, undefined);
  });
  test(`${name}: view messages require the actual sender, origin and active project`, () => {
    assert.equal(ctx.gamecoworkUnityViewsRequest(event(), owner).type, "unityViews");
    for (const bad of [{ ...event(), source: {} }, { ...event(), origin: "http://other.invalid" },
      event({ ...owner, workspaceKey: "local:owned-b" }), event({ ...owner, workspaceRoot: "F:/owned/B" }),
      event({ ...owner, workspaceRoot: "F:/owned/A/../B" }), event({ workspaceKey: owner.workspaceKey }),
      event({ ...owner, windowType: "UnityEditor.UnsupportedWindow" }), event({ ...owner, windowType: null })]) {
      assert.equal(ctx.gamecoworkUnityViewsRequest(bad, owner), null);
    }
    assert.equal(ctx.gamecoworkUnityViewsRequest(event(), { workspaceKey: "", workspaceRoot: "" }), null);
  });
  test(`${name}: six supported view types retain owner identity without forwarding URLs or PIDs`, () => {
    for (const windowType of windowTypes) {
      const request = ctx.gamecoworkUnityViewsRequest(event({ ...owner, workspaceRoot: "f:\\owned\\a\\", windowType, url: "http://other.invalid", pid: 42 }), owner);
      assert.equal(request.windowType, windowType); assert.equal(request.workspaceRoot, owner.workspaceRoot);
      assert.equal(request.workspaceKey, owner.workspaceKey); assert.equal(request.url, undefined); assert.equal(request.pid, undefined);
    }
  });
  test(`${name}: a deferred UI open cannot act after the active project changes`, () => {
    const marker = name === "index-BRxZ4eG7.js" ? '        if (De.messageType === "shell/openUnityViews") {' : '        if (He.messageType === "shell/openUnityViews") {';
    const start = text.indexOf(marker), end = text.indexOf("\n        const streamScoped", start);
    assert.ok(start >= 0 && end > start, "Actual guarded message branch exists");
    const branch = text.slice(start, end), scheduled = [], opened = [], dispatches = [];
    const scope = { ...context, xe: event(), De: event().data, He: event().data, Rt: { current: owner.workspaceKey },
      F: owner.workspaceRoot, U: owner.workspaceRoot, Sn: request => opened.push(request), u: action => dispatches.push(action), Jr: value => value,
      gamecoworkUnityViewsRequest: ctx.gamecoworkUnityViewsRequest };
    scope.window = context.window; const previousTimer = scope.window.setTimeout;
    scope.window.setTimeout = callback => scheduled.push(callback);
    try {
      vm.runInNewContext(`(() => { ${branch} })()`, scope);
      assert.deepEqual(dispatches, [true]); assert.equal(opened.length, 0); assert.equal(scheduled.length, 1);
      scope.Rt.current = "local:owned-b"; scheduled.shift()(); assert.equal(opened.length, 0);
      scope.Rt.current = owner.workspaceKey;
      vm.runInNewContext(`(() => { ${branch} })()`, scope); scheduled.shift()();
      assert.equal(opened.length, 1); assert.equal(opened[0].workspaceKey, owner.workspaceKey);
    } finally { scope.window.setTimeout = previousTimer; }
  });
  test(`${name}: absent or remote workspaces never emit a local view request`, () => {
    const before = context.messages.length;
    for (const workspace of [undefined, { workspaceKey: owner.workspaceKey }, { workspaceKey: owner.workspaceKey, workspaceDir: "" },
      { workspaceKey: owner.workspaceKey, workspaceDir: owner.workspaceRoot, isRemote: true }]) assert.equal(ctx.gamecoworkUnityViewsEntry(workspace), false);
    assert.equal(context.messages.length, before);
  });
}
for (const name of ["RightSideBarPanel-B2OWNNNX.js", "RightSideBarPanel-JSPvAs5c.js"]) {
  const text = source(name), context = browser(), ctx = vm.createContext(context);
  const mappingStart = text.indexOf("const Bu = {"), mappingEnd = text.indexOf("\n  Xa =", mappingStart);
  assert.ok(mappingStart >= 0 && mappingEnd > mappingStart);
  vm.runInContext(text.slice(mappingStart, mappingEnd).replace(/,\s*$/, ";") + method(text, "gamecoworkOpenUnityViews") + method(text, "gamecoworkEditorCaptureMode"), ctx);
  const connected = { ...owner, isUnityProject: true, bridgeConnected: true, streamingDisabled: false };
  test(`${name}: disconnected discovery opens the panel without adding a capture`, () => {
    const panels = [], views = [];
    assert.equal(ctx.gamecoworkOpenUnityViews(owner, { ...connected, bridgeConnected: false }, panel => panels.push(panel), view => views.push(view)), true);
    assert.deepEqual(panels, ["unity"]); assert.deepEqual(views, []);
    assert.equal(ctx.gamecoworkOpenUnityViews({ ...owner, windowType: windowTypes[0] }, { ...connected, bridgeConnected: false }, () => assert.fail("No disconnected capture"), () => assert.fail("No disconnected capture")), false);
  });
  test(`${name}: explicit connected views reuse the real six-window mapping and capture modes`, () => {
    const panels = [], views = [];
    for (const windowType of windowTypes) assert.equal(ctx.gamecoworkOpenUnityViews({ ...owner, windowType }, connected, panel => panels.push(panel), view => views.push(view)), true);
    assert.deepEqual(views, ["scene_view", "game_view", "inspector", "hierarchy", "console", "project"]);
    assert.equal(panels.length, 6);
    for (const viewType of views) assert.equal(ctx.gamecoworkEditorCaptureMode({ viewType }), ["scene_view", "game_view"].includes(viewType) ? "render-content" : "editor-window");
  });
  test(`${name}: imperative delivery rejects an obsolete project or unsupported capture`, () => {
    const reject = () => assert.fail("Rejected request cannot alter this panel");
    for (const [payload, current] of [[owner, { ...connected, workspaceKey: "local:owned-b" }], [owner, { ...connected, workspaceRoot: "F:/owned/B" }],
      [owner, { ...connected, isUnityProject: false }], [{ ...owner, windowType: windowTypes[0] }, { ...connected, streamingDisabled: true }],
      [{ ...owner, windowType: "UnityEditor.UnsupportedWindow" }, connected]]) assert.equal(ctx.gamecoworkOpenUnityViews(payload, current, reject, reject), false);
  });
}
