import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
for (const [label, file, itemsAction, errorAction] of [
  ["current", "VscTheme-BExNMG_K.js", "pNt", "Ine"],
  ["previous", "VscTheme-B-CSeuv5.js", "dNt", "Nne"],
]) {
  const source = fs.readFileSync(assets + file, "utf8");
  const start = source.indexOf('sr("marketplace/fetchRemoteItems"');
  const end = source.indexOf("\n  }),\n  sSe", start);
  assert.ok(start >= 0 && end > start);
  const actualThunk = source.slice(start, end) + "\n  })";
  for (const unavailable of [true, false]) {
    test(`${label}: actual marketplace thunk ${unavailable ? "preserves unavailable-source metadata" : "retains a configured list"}`, async () => {
      const actions = [];
      const item = { id: "own-item", type: "skill", title: "Owned fixture" };
      const response = unavailable
        ? { status: "success", content: { items: [], total: 0, supported: false, reason: "Own source is not configured" } }
        : { status: "success", content: { items: [item], total: 1 } };
      let requests = 0;
      const context = vm.createContext({
        sr: (_name, callback) => callback, wAe: () => true,
        iSe: (loading) => ({ type: "loading", loading }),
        [itemsAction]: (payload) => ({ type: "items", payload }),
        [errorAction]: (error) => ({ type: "error", error }),
        CAe: (items) => items, console,
      });
      const thunk = vm.runInContext(actualThunk, context);
      await thunk(undefined, { dispatch: (action) => actions.push(action), getState: () => ({ marketplace: {} }),
        extra: { ideMessenger: { request: async (type) => { assert.equal(type, "marketplace/listRemote"); requests++; return response; } } } });
      assert.equal(requests, 1);
      const action = actions.find((entry) => entry.type === "items");
      assert.ok(action);
      assert.equal(action.payload.unsupportedReason, unavailable ? "Own source is not configured" : undefined);
      assert.equal(action.payload.items.length, unavailable ? 0 : 1);
      assert.ok(!actions.some((entry) => entry.type === "error" && entry.error));
      assert.equal(actions.at(-1).loading, false);
      assert.ok(source.includes('gamecoworkMarketplaceUnavailable = ze((state) => state.marketplace.unsupportedReason)'));
      assert.ok(source.includes('"data-testid": "gamecowork-marketplace-pending"'));
    });
  }
}
