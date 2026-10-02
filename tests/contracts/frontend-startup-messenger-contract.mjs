import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
for (const spec of [
  { name: "current", store: "store-c6kNGz30.js", gui: "index-BRxZ4eG7.js", env: "Ab", setup: "mF", storeAlias: "ot", persistor: "wF", cloud: "dF", render: "v5", redux: "LF", provider: "fF", theme: "VX", gate: "Lb", app: "KX" },
  { name: "previous", store: "store-0rGrUshb.js", gui: "index-DvRYaIVa.js", env: "ib", setup: "pF", storeAlias: "it", persistor: "gF", cloud: "lF", render: "y5", redux: "QF", provider: "uF", theme: "DX", gate: "Tb", app: "PX" },
]) {
  const source = fs.readFileSync(assets + spec.store, "utf8"), gui = fs.readFileSync(assets + spec.gui, "utf8");
  const start = source.indexOf("let gamecoworkDefaultStoreMessenger = Ld();"), end = source.indexOf("\nconst Vd =", start);
  const actualStoreSetup = source.slice(start, end).replace("export function", "function");
  function fixture() {
    const client = { resumes: 0, resumeHealthCheck() { this.resumes++; } }, state = { draft: "Owned unsaved draft", rehydrated: true };
    const persisted = { paused: false, key: "gamecowork", state }, created = [], persistors = [];
    class Cloud { attachWorkspaceEventBridge(store) { this.store = store; } }
    const context = vm.createContext({ Ld: () => client, La: ({ ideMessenger }) => { const value = { extra: ideMessenger, state }; created.push(value); return value; },
      ou() {}, ma: store => { persistors.push(store); return persisted; }, iu: Cloud });
    vm.runInContext(actualStoreSetup + "\nglobalThis.fixtureStore=fe;globalThis.fixturePersistor=la;", context);
    return { context, client, state, persisted, created, persistors, Cloud };
  }
  test(`${spec.name}: the getter returns the actual Redux extra client and preserves an explicit configured override`, () => {
    const f = fixture(); assert.equal(f.context.gamecoworkGetStoreMessenger(), f.context.fixtureStore.extra);
    const override = { ownedOverride: true }; const result = f.context.kd(override);
    assert.equal(result.store.extra, override); assert.equal(f.context.gamecoworkGetStoreMessenger(), override);
    const cloud = new f.Cloud(); const selected = f.context.kd(cloud); assert.equal(cloud.store, selected.store);
    assert.equal(f.context.gamecoworkGetStoreMessenger(), cloud);
  });
  test(`${spec.name}: actual native boot and remount use the existing store, persistor, drafts and one shared client`, async () => {
    const f = fixture(), begin = gui.lastIndexOf("(async () => {"), finish = gui.indexOf("\n})();", begin) + 6;
    assert.ok(begin >= 0 && finish > begin); const boot = gui.slice(begin, finish), rendered = [];
    const jsx = (type, props) => ({ type, props });
    Object.assign(f.context, { qt: () => true, Rn: () => false, [spec.env]() {}, document: { getElementById: () => ({}) },
      window: { sessionStorage: { setItem() {} } }, [spec.setup]: () => { throw new Error("Native boot must not recreate Redux or persistor"); },
      [spec.storeAlias]: f.context.fixtureStore, [spec.persistor]: f.context.fixturePersistor, [spec.cloud]: f.Cloud,
      [spec.render]: { createRoot: () => ({ render: value => rendered.push(value) }) }, is: { StrictMode: "strict" }, a: { jsx },
      [spec.redux]: "redux", [spec.provider]: "provider", [spec.theme]: "theme", [spec.gate]: "gate", [spec.app]: "app" });
    await vm.runInContext(boot, f.context); await vm.runInContext(boot, f.context);
    assert.equal(f.created.length, 1); assert.equal(f.persistors.length, 1); assert.equal(f.persisted.paused, false);
    assert.equal(f.state.draft, "Owned unsaved draft"); assert.equal(f.state.rehydrated, true);
    for (const tree of rendered) {
      const redux = tree.props.children; assert.equal(redux.props.store, f.context.fixtureStore);
      assert.equal(redux.props.children.props.messenger, f.context.fixtureStore.extra);
      assert.equal(redux.props.children.props.children.props.children.props.persistor, f.context.fixturePersistor);
    }
    assert.equal(f.client.resumes, 2, "both mounts ask the same client to resume; actual health probes are separately tested as idempotent");
  });
}
