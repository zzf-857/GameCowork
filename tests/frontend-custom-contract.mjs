import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../restored/frontend/dist-beautified/assets/", import.meta.url));
function declaration(source, name) { const start = source.indexOf("function " + name + "("); assert.ok(start >= 0); return source.slice(source.slice(start - 6, start) === "async " ? start - 6 : start, source.indexOf("\n}", start) + 2); }
for (const [label, vscFile, mainFile, names, globalKey] of [
  ["current", "VscTheme-BExNMG_K.js", "index-BRxZ4eG7.js", ["DG", "OG", "KG"], "tm"],
  ["previous", "VscTheme-B-CSeuv5.js", "index-DvRYaIVa.js", ["RG", "HG", "PG"], "Zg"],
]) {
  const vsc = fs.readFileSync(assets + vscFile, "utf8").replaceAll("\r\n", "\n"), main = fs.readFileSync(assets + mainFile, "utf8").replaceAll("\r\n", "\n");
  test(`${label}: actual creation helpers reject traversal and outer/inner write failures`, () => {
    const ctx = vm.createContext({}); vm.runInContext(declaration(vsc, "gamecoworkCapabilityName") + declaration(vsc, "gamecoworkCapabilityResult"), ctx);
    assert.equal(ctx.gamecoworkCapabilityName("Owned Skill"), "owned-skill");
    for (const value of ["../escaped", "C:target", "a\\b", "con", "nul", "name/"]) assert.throws(() => ctx.gamecoworkCapabilityName(value));
    for (const response of [{ status: "error", error: "outer refused" }, { status: "success", content: { status: "error", error: "inner refused" } }]) assert.throws(() => ctx.gamecoworkCapabilityResult(response), /refused/);
    const result = { path: "owned/SKILL.md" }; assert.equal(ctx.gamecoworkCapabilityResult({ status: "success", content: result }), result);
  });
  test(`${label}: real installed-list consumers preserve routed errors rather than claiming no capabilities`, async () => {
    const ctx = vm.createContext({ console: { error() {} }, [globalKey]: "all" });
    for (const name of names) { vm.runInContext(declaration(main, name), ctx); await assert.rejects(ctx[name]({ request: async (_type, route) => { assert.equal(route.workspaceKey, "A"); return { status: "error", error: "owned route failed" }; } }, "A"), /owned route failed/); }
  });
  test(`${label}: local operation telemetry does not probe a device ID`, () => {
    const call=vsc.lastIndexOf('.ideMessenger.request("getUniqueId", void 0)'),start=vsc.lastIndexOf("\nfunction ",call),getter=/function ([$\w]+)\(/.exec(vsc.slice(start,call))?.[1];assert.ok(call>0&&getter,"Locate the actual device-ID request getter, independent of minified symbol names");
    let probes = 0; const messenger={ideMessenger:{request(){probes++;throw Error("ID probe must not run");}}};
    const ctx = vm.createContext({ window: { GAMECOWORK_SHELL: true }, rs:messenger,ns:messenger });
    vm.runInContext(declaration(vsc, getter), ctx); assert.equal(ctx[getter](), undefined); assert.equal(probes, 0);
  });
  test(`${label}: actual capability loader clears loading and retains a visible failure`, async () => {
    const writes = [], effects = []; let index = 0;
    const jsx = (_type, props) => props;
    const ctx = vm.createContext({ E: { useState: value => { const slot = index++; return [value, next => writes.push({ slot, next })]; }, useRef: value => ({ current: value }), useEffect: effect => effects.push(effect) }, Rt: () => ({ t: value => value }), p: { jsx, jsxs: jsx }, Ice: () => ({ enqueue: task => task() }), _ce: () => ({ enqueue: task => task() }) });
    const kbStart=vsc.indexOf("function kb({"); assert.ok(kbStart>0); const source=vsc.slice(kbStart,vsc.indexOf("\n}\n",kbStart)+2), queue = /await (\w+)\(a/.exec(source)?.[1]; assert.ok(queue); ctx[queue] = () => ({ enqueue: task => task() });
    for(const match of source.matchAll(/p\.jsxs?\((\w+)/g)) if(!(match[1] in ctx))ctx[match[1]]=()=>null;
    vm.runInContext(source, ctx); ctx.kb({ workspaceKey: "A", workspaceLabel: "A", fetchFn: async () => { throw vm.runInContext("new Error('Load failed')",ctx); }, fetchKey: "skills", onItemsLoaded: () => assert.fail("failure must not be installed as an empty list"), children: () => null });
    effects[0](); await new Promise(resolve => setTimeout(resolve, 0));
    assert.ok(writes.some(write => write.slot === 1 && write.next === false));
    assert.ok(writes.some(write => write.slot === 2 && write.next === "Load failed"));
  });
  test(`${label}: command/subagent list consumers retain scoped file versions and surface failures`, async () => {
    const ctx = vm.createContext({ wo: "all" });
    vm.runInContext(declaration(vsc, "gamecoworkCapabilityResult"), ctx);
    for (const kind of ["commands", "agents"]) {
      const marker = kind === "commands" ? 'return content.commands.map' : 'return content.agents.map';
      const index = vsc.indexOf(marker), start = vsc.lastIndexOf("async function ", index), name = /async function (\w+)/.exec(vsc.slice(start))[1];
      vm.runInContext(declaration(vsc, name), ctx);
      await assert.rejects(ctx[name]({ request: async () => ({ status: "error", error: "Owned list refused" }) }, "A", "A"), /Owned list refused/);
      const item = { name: "owned", path: "F:/owned/file.toml", source: "project", disabled: true, managed: true, sha256: "a".repeat(64) };
      const loaded = await ctx[name]({ request: async (_type, route) => { assert.equal(route.workspaceKey, "A"); return { status: "success", content: { [kind === "commands" ? "commands" : "agents"]: [item] } }; } }, "A", "A");
      assert.equal(loaded[0].sha256, item.sha256); assert.equal(loaded[0].managed, true); assert.equal(loaded[0].workspaceKey, "A");
    }
  });
}
