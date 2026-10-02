import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";

const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
const helperSource = fs.readFileSync(assets + "gamecowork-editor-licensing.js", "utf8");
function helper(local) {
  const context = vm.createContext({ window: { GAMECOWORK_SHELL: local }, Error });
  const exports = vm.runInContext(helperSource.replaceAll("export ", "") +
    "\n({ createGameCoworkUnityLicenseView, workspaceLicenseAllowsOperation, isGameCoworkLocalMode })", context);
  return { context, ...exports };
}
function declaration(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0, name);
  return (source.slice(start - 6, start) === "async " ? "async " : "") + source.slice(start, source.indexOf("\n}", start) + 2);
}
const deferred = () => { let resolve; const promise = new Promise(value => { resolve = value; }); return { resolve, promise }; };
const jsx = (type, props) => ({ type, props });
function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
}
function text(tree) {
  if (typeof tree === "string") return tree;
  if (!tree || typeof tree !== "object") return "";
  return [tree?.props?.children].flat(Infinity).map(text).filter(Boolean).join(" ");
}
function viewFixture(handler) {
  const exports = helper(true), cells = [], effects = [], requestCalls = [], posts = [];
  let slot = 0;
  const same = (a, b) => a?.length === b?.length && a.every((value, index) => value === b[index]);
  const hooks = {
    useState(value) { const index = slot++; if (!(index in cells)) cells[index] = value; return [cells[index], value => { cells[index] = value; }]; },
    useRef(value) { const index = slot++; return cells[index] ??= { current: value }; },
    useCallback(callback, deps) { const index = slot++, previous = cells[index]; if (!previous || !same(previous.deps, deps)) cells[index] = { callback, deps }; return cells[index].callback; },
    useEffect(callback, deps) { const index = slot++, previous = cells[index]; if (!previous || !same(previous.deps, deps)) effects.push(() => { previous?.cleanup?.(); cells[index] = { deps, cleanup: callback() }; }); },
  };
  const view = exports.createGameCoworkUnityLicenseView({ jsx: { jsx, jsxs: jsx }, hooks, Button: "button" });
  const messenger = { request: async (kind, data) => { requestCalls.push({ kind, data }); return handler(kind, data); }, post: (kind, data) => posts.push({ kind, data }) };
  function render() { slot = 0; const tree = view({ onBack() {}, messenger }); while (effects.length) effects.shift()(); return tree; }
  return { render, requestCalls, posts, unmount() { for (const cell of cells) cell?.cleanup?.(); } };
}
const localStatus = { status: "success", content: { mode: "local", workspaceAllowed: true, isValid: null, editorLicenseValid: null, licenses: [] } };

test("Local workspaces require explicit local permission and never use Editor isValid", () => {
  const local = helper(true).workspaceLicenseAllowsOperation;
  assert.equal(local({ mode: "local", workspaceAllowed: true, isValid: null }), true);
  for (const content of [null, {}, { isValid: true }, { mode: "local", isValid: true }, { mode: "local", workspaceAllowed: false, isValid: true }])
    assert.equal(local(content), false);
  const official = helper(false).workspaceLicenseAllowsOperation;
  assert.equal(official({ isValid: true }), true);
  assert.equal(official({ isValid: false, workspaceAllowed: true }), false);
  assert.equal(official({ mode: "local", workspaceAllowed: true, isValid: null }), true);
});

test("The actual local view reads only workspace status and keeps separate undetected Editor scopes", async () => {
  const f = viewFixture(() => localStatus); f.render(); await new Promise(resolve => setImmediate(resolve));
  const tree = f.render(), strings = text(tree);
  assert.deepEqual(f.requestCalls.map(call => call.kind), ["tjhub/getLicenses"]);
  assert.match(strings, /Unity 许可证/); assert.match(strings, /本地项目管理无需 Unity 许可证/);
  assert.match(strings, /本地工作区操作可用/); assert.match(strings, /Unity 许可证：尚未检测/); assert.match(strings, /团结引擎许可证：尚未检测/);
  assert.deepEqual(f.posts, []);
  const links = nodes(tree).filter(node => node.props?.["data-testid"]?.match(/gamecowork-unity-(license-help|hub-download)/));
  for (const link of links) link.props.onClick();
  assert.deepEqual(f.posts, [
    { kind: "openUrl", data: "https://docs.unity.com/en-us/hub/manage-license" },
    { kind: "openUrl", data: "https://docs.unity.com/en-us/hub/install-hub" },
  ]);
});

test("An old local fake-valid status remains a visible permission error, with no activation fallback", async () => {
  const f = viewFixture(() => ({ status: "success", content: { mode: "local", isValid: true, licenses: [] } }));
  f.render(); await new Promise(resolve => setImmediate(resolve)); const tree = f.render();
  assert.ok(nodes(tree).some(node => node.props?.["data-testid"] === "gamecowork-license-error"));
  assert.ok(!text(tree).includes("本地工作区操作可用"));
  assert.match(text(tree), /Unity 许可证：尚未检测/);
  assert.deepEqual(f.requestCalls.map(call => call.kind), ["tjhub/getLicenses"]); assert.deepEqual(f.posts, []);
});

test("Repeated status refreshes are coalesced and late responses after unmount do not update the view", async () => {
  const reply = deferred(); const f = viewFixture(() => reply.promise);
  const tree = f.render(), refresh = nodes(tree).find(node => node.props?.["data-testid"] === "gamecowork-license-refresh");
  refresh.props.onClick(); refresh.props.onClick(); assert.equal(f.requestCalls.length, 1);
  f.unmount(); reply.resolve(localStatus); await new Promise(resolve => setImmediate(resolve));
  assert.ok(!text(f.render()).includes("本地工作区操作可用"));
});

for (const [label, file] of [["current", "TJHubRoute-DN1YDDd-.js"], ["previous", "TJHubRoute-D42CgVct.js"]]) {
  const source = fs.readFileSync(assets + file, "utf8");
  test(`${label}: the actual local license route chooses the shared Unity view while retaining the official branch`, () => {
    const f = helper(true); Object.assign(f.context, { n: { useContext: () => "messenger" }, ue: {}, e: { jsx }, GameCoworkUnityLicenseView: "local", gamecoworkOfficialLicensePage: "official" });
    const route = vm.runInContext(`(${declaration(source, "ro")})`, f.context);
    assert.equal(route({}).type, "local"); f.context.window.GAMECOWORK_SHELL = false;
    assert.equal(route({}).type, "official");
  });
  test(`${label}: the actual create/open precondition accepts workspace permission without a detected Editor license`, async () => {
    const start = source.indexOf("Ee = async () => {"), end = source.indexOf("\n    },", start);
    const expression = source.slice(start + "Ee = ".length, end + "\n    }".length);
    const f = helper(true); f.context.b = { request: async () => localStatus };
    const allowed = vm.runInContext(`(${expression})`, f.context);
    assert.equal(await allowed(), true);
    f.context.b.request = async () => ({ status: "success", content: { mode: "local", isValid: true } });
    assert.equal(await allowed(), false);
  });
  test(`${label}: local Manage licenses navigates to the Unity view instead of mounting the original activation dialog`, () => {
    const start = source.indexOf("p = n.useCallback(() => {", source.indexOf("function or(")), end = source.indexOf("\n    }, [r]);", start);
    const expression = source.slice(start + "p = n.useCallback(".length, end + "\n    }".length);
    const f = helper(true), states = []; f.context.a = value => states.push(value);
    const navigate = vm.runInContext(`(${expression})`, f.context); navigate();
    assert.deepEqual(states, ["licenses"]);
  });
  test(`${label}: the real Editor refresh function requests a fresh local scan and propagates failures`, async () => {
    const f = helper(true), calls = []; f.context.gamecoworkNormalizeEditor = value => value;
    const read = vm.runInContext(`(${declaration(source, "gamecoworkReadEditorRows")})`, f.context);
    const messenger = { request: async (kind, data) => { calls.push({ kind, data: data ? JSON.parse(JSON.stringify(data)) : undefined }); return { status: "success", content: { one: { version: "6000.0.5f1" } } }; } };
    await read(messenger, true); assert.deepEqual(calls, [{ kind: "tjhub/getEditors", data: { refresh: true } }]);
    f.context.window.GAMECOWORK_SHELL = false; await read(messenger, true); assert.equal(calls[1].data, undefined);
    messenger.request = async () => ({ status: "error", error: "Owned scan failure" });
    await assert.rejects(() => read(messenger, true), /Owned scan failure/);
  });
}
