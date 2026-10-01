import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { discoverUnityProject, unityDiscoveryOwner, GameCoworkUnityDiscovery, unityConnectionEpochs } from "../restored/frontend/dist-beautified/assets/gamecowork-unity-connectors.js";

const owner = unityDiscoveryOwner({ workspaceKey: "A", workspaceRoot: "F:/owned/A", isOpen: true, isRemote: false });
const metadata = { isUnityProject: true, engineType: "unity", projectRoot: "F:/owned/A", hasUnityMcpPackage: false };
const flat = node => !node ? [] : Array.isArray(node) ? node.flatMap(flat) : typeof node === "object" ? [node, ...flat(node.props?.children)] : [];
function hooks() {
  const states = [], refs = [], effects = []; let stateIndex, refIndex, effectIndex;
  const react = { useState(initial) { const index = stateIndex++; if (!(index in states)) states[index] = initial; return [states[index], value => { states[index] = typeof value === "function" ? value(states[index]) : value; }]; },
    useRef(initial) { const index = refIndex++; return refs[index] ||= { current: initial }; },
    useEffect(callback, dependencies) { const index = effectIndex++, previous = effects[index]; if (!previous || dependencies.some((value, entry) => value !== previous.dependencies[entry])) { previous?.cleanup?.(); effects[index] = { dependencies, cleanup: callback() }; } } };
  const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
  return { render(props) { stateIndex = refIndex = effectIndex = 0; return GameCoworkUnityDiscovery({ ...props, react, jsx }); },
    cleanup() { effects.forEach(effect => effect.cleanup?.()); } };
}
function discoveryProps(extra = {}) { return { workspaceKey: "A", workspaceRoot: "F:/owned/A", isOpen: true, isRemote: false, messenger: { request() { assert.fail("Opening discovery must be read-only UI"); } }, onProjectInfo() { assert.fail("No metadata is published merely by opening"); }, ...extra }; }

test("Unknown discovery opens without launching, installing, capturing or probing", () => {
  const harness = hooks(), props = discoveryProps({ reason: "Initial metadata failed: owned fixture" }), tree = harness.render(props), nodes = flat(tree);
  assert.equal(tree.props["data-testid"], "unity-streaming-discovery");
  assert.ok(nodes.some(node => node.props?.children === "Initial metadata failed: owned fixture"));
  assert.equal(nodes.filter(node => node.type === "button").length, 1);
  assert.equal(nodes.find(node => node.type === "button").props.disabled, false); harness.cleanup();
});
test("Discovery preserves the fixed route, actual failure, retry and authoritative non-Unity result", async () => {
  const calls = []; let attempts = 0;
  const messenger = { request: async (kind, route) => { calls.push({ kind, route }); if (++attempts === 1) throw new Error("Owned metadata unavailable"); return attempts === 2 ? metadata : { isUnityProject: false, projectRoot: null }; } };
  const harness = hooks(), published = [], props = discoveryProps({ messenger, onProjectInfo: value => published.push(value) });
  await flat(harness.render(props)).find(node => node.type === "button").props.onClick();
  let nodes = flat(harness.render(props)); assert.ok(nodes.some(node => node.props?.children === "Owned metadata unavailable")); assert.equal(nodes.find(node => node.type === "button").props.disabled, false);
  await nodes.find(node => node.type === "button").props.onClick(); assert.equal(published[0].engineType, "Unity");
  await flat(harness.render(props)).find(node => node.type === "button").props.onClick();
  assert.equal(published[1].isUnityProject, false); assert.ok(flat(harness.render(props)).some(node => /不是 Unity/.test(String(node.props?.children))));
  assert.ok(calls.every(call => call.kind === "unity/getProjectStatus" && call.route.workspaceKey === "A" && call.route.workspaceRef.workspaceDir === "F:/owned/A")); harness.cleanup();
});
test("Closed, switched and superseded discovery replies cannot publish metadata", async () => {
  for (const transition of ["closed", "switched", "superseded"]) {
    let resolve; const published = [], harness = hooks(), props = discoveryProps({ messenger: { request: () => new Promise(done => resolve = done) }, onProjectInfo: value => published.push(value) });
    const pending = flat(harness.render(props)).find(node => node.type === "button").props.onClick();
    if (transition === "closed") harness.render({ ...props, isOpen: false });
    else if (transition === "switched") harness.render({ ...props, workspaceKey: "B", workspaceRoot: "F:/owned/B" });
    else unityConnectionEpochs.set("local-editor:A:project", unityConnectionEpochs.get("local-editor:A:project") + 1);
    resolve(metadata); await pending; assert.deepEqual(published, []); harness.cleanup();
  }
});
test("Recognition cannot substitute another project or accept an incomplete true response", async () => {
  for (const value of [{ ...metadata, projectRoot: "F:/owned/B" }, { ...metadata, projectRoot: null }, { ...metadata, engineType: null }, { projectRoot: "F:/owned/A" }])
    await assert.rejects(discoverUnityProject({ request: async () => value }, owner), /匹配|缺少目录|不完整/);
  assert.equal(await discoverUnityProject({ request: async () => metadata }, owner, () => false), null);
});
test("Discovery refuses closed and remote routes before requesting anything", async () => {
  assert.equal(unityDiscoveryOwner({ workspaceKey: "A", workspaceRoot: "F:/owned/A", isOpen: false }), null);
  assert.equal(unityDiscoveryOwner({ workspaceKey: "A", workspaceRoot: "F:/owned/A", isOpen: true, isRemote: true }), null);
  await assert.rejects(discoverUnityProject({ request() { assert.fail("Invalid routes cannot query"); } }, null), /本地工作区/);
});
test("The real request helper has a 12-second deadline and clears its timer", async () => {
  const source = fs.readFileSync(new URL("../restored/frontend/dist-beautified/assets/gamecowork-unity-connectors.js", import.meta.url), "utf8").replace(/^export /gm, "");
  const timers = [], cleared = [], ctx = vm.createContext({ setTimeout: (callback, delay) => { timers.push({ callback, delay }); return timers.length; }, clearTimeout: id => cleared.push(id) });
  vm.runInContext(source, ctx); const pending = ctx.discoverUnityProject({ request: () => new Promise(() => {}) }, owner);
  assert.equal(timers[0].delay, 12000); timers[0].callback(); await assert.rejects(pending, /超时/); assert.deepEqual(cleared, [1]);
});
for (const [name, action] of [["VscTheme-BExNMG_K.js", "Pyn"], ["VscTheme-B-CSeuv5.js", "Lyn"]]) {
  const source = fs.readFileSync(new URL("../restored/frontend/dist-beautified/assets/" + name, import.meta.url), "utf8"), start = source.indexOf("function GameCoworkUnityPanel("), end = source.indexOf("\n}\n", start) + 2;
  assert.ok(start >= 0 && end > start);
  const state = { hub: { activeWorkspaceKey: "A", workspaces: [{ workspaceKey: "A", workspaceDir: "F:/owned/A" }] }, unity: { projectInfo: { isUnityProject: false, projectRoot: null }, connectionStatus: { status: "not-connected", error: "Owned initial detection failed" } } }, dispatched = [];
  const ctx = vm.createContext({ ze: selector => selector(state), Oke: value => value.unity, Rke: value => value.hub.activeWorkspaceKey,
    Vn: () => value => dispatched.push(value), E: { useContext: () => ({}) }, Ft: {}, p: { jsx: (type, props) => ({ type, props }) },
    GameCoworkUnityDiscovery: "discovery", GameCoworkUnityConnector: "connector", [action]: value => value });
  vm.runInContext(source.slice(start, end), ctx);
  test(`${name}: the actual panel falls back for missing metadata and preserves registry ownership`, () => {
    const props = { workspaceKey: "A", workspaceRoot: "F:/owned/A" }; let tree = ctx.GameCoworkUnityPanel(props);
    assert.equal(tree.type, "discovery"); assert.equal(tree.props.isOpen, true); assert.equal(tree.props.reason, "Owned initial detection failed");
    tree.props.onProjectInfo(metadata); assert.equal(dispatched.at(-1).workspaceKey, "A");
    state.unity.projectInfo = metadata; assert.equal(ctx.GameCoworkUnityPanel(props).type, "connector");
    state.unity.projectInfo = { ...metadata, projectRoot: "F:/owned/B" }; assert.equal(ctx.GameCoworkUnityPanel(props).type, "discovery");
    state.hub.activeWorkspaceKey = "B"; tree = ctx.GameCoworkUnityPanel(props); assert.equal(tree.type, "discovery"); assert.equal(tree.props.isOpen, false);
    state.hub.activeWorkspaceKey = "A"; state.hub.workspaces = []; assert.equal(ctx.GameCoworkUnityPanel(props).props.isOpen, false);
  });
}
for (const name of ["RightSideBarPanel-B2OWNNNX.js", "RightSideBarPanel-JSPvAs5c.js"]) {
  const source = fs.readFileSync(new URL("../restored/frontend/dist-beautified/assets/" + name, import.meta.url), "utf8").replaceAll("\r\n", "\n");
  const start = source.indexOf("function gamecoworkOpenUnityViews("), end = source.indexOf("\n  Xa =", start);
  const ctx = vm.createContext({ window: { GAMECOWORK_SHELL: true } }); vm.runInContext(source.slice(start, end).replace(/,\s*$/, ";"), ctx);
  test(`${name}: unknown entry can open its owned panel but cannot launch a typed capture`, () => {
    const owner = { workspaceKey: "A", workspaceRoot: "F:/owned/A", canOpenUnityPanel: true, isUnityProject: false, bridgeConnected: true }, panels = [], views = [];
    assert.equal(ctx.gamecoworkOpenUnityViews({ workspaceKey: "A", workspaceRoot: "F:/owned/A" }, owner, value => panels.push(value), value => views.push(value)), true);
    assert.equal(ctx.gamecoworkOpenUnityViews({ workspaceKey: "A", workspaceRoot: "F:/owned/A", windowType: "UnityEditor.SceneView" }, owner, () => assert.fail("No unknown capture"), () => assert.fail("No unknown capture")), false);
    assert.equal(ctx.gamecoworkOpenUnityViews({ workspaceKey: "A", workspaceRoot: "F:/owned/A" }, { ...owner, canOpenUnityPanel: false, isUnityProject: true }, () => assert.fail("Closed route"), () => assert.fail("Closed route")), false);
    assert.deepEqual(panels, ["unity"]); assert.deepEqual(views, []);
  });
  const tabStart = source.indexOf("function AT("), tabEnd = source.indexOf("\nfunction NT(", tabStart);
  const tabs = vm.createContext({ T: { useMemo: callback => callback() }, Sr: () => ({ t: value => value }), f: { jsx: () => ({}) }, Tp: {}, oo: {} });
  vm.runInContext(source.slice(tabStart, tabEnd), tabs);
  test(`${name}: unknown streaming tab remains visible without claiming Unity Insight availability`, () => {
    const props = { tabOrder: ["unity", "unityInsight"], tabs: [], currentTerminalTabs: [], activeTab: "unity", isUnityProject: false, canOpenUnityPanel: true };
    assert.deepEqual(Array.from(tabs.AT(props), value => value.key), ["unity"]);
    assert.equal(tabs.AT({ ...props, canOpenUnityPanel: false }).length, 0);
  });
}
