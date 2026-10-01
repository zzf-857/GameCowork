import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../restored/frontend/dist-beautified/assets/", import.meta.url));
function declaration(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0);
  const actualStart = source.slice(start - 6, start) === "async " ? start - 6 : start;
  return source.slice(actualStart, source.indexOf("\n}", start) + 2);
}
for (const [label, gui, hook, contextName] of [
  ["current", "index-BRxZ4eG7.js", "W2", "tt"],
  ["previous", "index-DvRYaIVa.js", "$2", "st"],
]) {
  const source = fs.readFileSync(assets + gui, "utf8");
  const helper = vm.runInNewContext(`(${declaration(source, "gamecoworkReadOptionalGenerationNotifications")})`);
  test(`${label}: a missing optional generation log does not issue readFile`, async () => {
    const calls = [];
    const result = await helper({ fileExists: async (file) => { calls.push(["exists", file]); return false; },
      readFile: async () => { throw new Error("Missing optional log must not reach readFile"); } }, "F:/fixture/Library/notifications.jsonl");
    assert.equal(result, "");
    assert.deepEqual(calls, [["exists", "F:/fixture/Library/notifications.jsonl"]]);
  });
  test(`${label}: existing optional content uses the real reader and genuine errors still propagate`, async () => {
    let fail = false;
    const calls = [];
    const ide = { fileExists: async () => true, readFile: async (...args) => {
      calls.push(args); if (fail) throw new Error("Fixture permission failure"); return '{"task_id":"owned"}\n';
    } };
    assert.equal(await helper(ide, "F:/fixture/log.jsonl"), '{"task_id":"owned"}\n');
    assert.deepEqual(calls[0], ["F:/fixture/log.jsonl", true, "utf8"]);
    fail = true;
    await assert.rejects(helper(ide, "F:/fixture/log.jsonl"), /Fixture permission failure/);
  });
  test(`${label}: the local pending asset mode does not poll the original generator namespace`, () => {
    const empty = new Map();
    let effect, state, timers = 0;
    const context = vm.createContext({
      window: { GAMECOWORK_SHELL: true }, gl: empty, [contextName]: {},
      d: { useContext: () => ({ ide: { readFile() { throw new Error("Unexpected original log read"); } } }),
        useState: () => [empty, (value) => { state = value; }], useEffect: (callback) => { effect = callback; } },
      setTimeout: () => { timers++; },
    });
    vm.runInContext(`${declaration(source, "gamecoworkUsesLocalAssetPage")}\n${declaration(source, hook)}\nglobalThis.notify = ${hook};`, context);
    assert.equal(context.notify("F:/fixture/A", true), empty);
    const cleanup = effect();
    assert.equal(state, empty);
    assert.equal(timers, 0);
    cleanup();
  });
}
