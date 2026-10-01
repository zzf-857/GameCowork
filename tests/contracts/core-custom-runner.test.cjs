const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const { EventEmitter } = require("node:events"), { StringDecoder } = require("node:string_decoder");
const { randomUUID } = require("node:crypto");
const base = path.join(__dirname, "../../src/core/binary/out");
for (const file of ["index.js", "index.beautified.js"]) {
  const source = fs.readFileSync(path.join(base, file), "utf8"), start = source.indexOf(file === "index.js" ? "runGameCoworkCliCommand(e,n,r," : "runGameCoworkCliCommand(e, n, r,"), end = source.indexOf("async isItemTooBig(", start);
  assert.ok(start >= 0 && end > start); const method = source.slice(start, end);
  function harness() {
    const child = new EventEmitter(); child.stdout = new EventEmitter(); child.stderr = new EventEmitter(); child.killed = 0; child.kill = () => { child.killed++; };
    let options; const ctx = vm.createContext({ process: { env: { GAMECOWORK_LOCAL_PROVIDER_MODE: "1" } }, require: () => ({ runtimeTemp: () => "F:/owned/runtime/tmp" }), console: { debug() {}, error() {} }, setTimeout, clearTimeout, Gqt: { StringDecoder }, dya: { spawn: (_binary, _args, actual) => { options = actual; return child; } } });
    const runner = vm.runInContext("new (class { " + method + " })()", ctx); return { child, options: () => options, run: (total = 100, idle = 20) => runner.runGameCoworkCliCommand("owned-cli", ["skills", "list"], "F:/owned/project", total, idle) };
  }
  test(`${file}: actual runner accepts only exit 0 and sets own subprocess temp`, async () => {
    const h = harness(), pending = h.run(); h.child.stdout.emit("data", Buffer.from("Discovered skills")); h.child.emit("close", 0); assert.equal(await pending, "Discovered skills"); assert.equal(h.options().env.TEMP, "F:/owned/runtime/tmp"); assert.equal(h.options().env.TMP, "F:/owned/runtime/tmp"); assert.equal(h.child.killed, 0);
  });
  test(`${file}: partial stdout does not disguise a nonzero or signaled failure`, async () => {
    for (const code of [1, null]) { const h = harness(), pending = h.run(); h.child.stdout.emit("data", Buffer.from("Partial output")); h.child.emit("close", code); await assert.rejects(pending, /Partial output/); }
  });
  test(`${file}: actual idle timeout rejects partial output and terminates its own command`, async () => {
    const h = harness(), pending = h.run(100, 5); h.child.stdout.emit("data", Buffer.from("Partial output")); await assert.rejects(pending, /stopped responding/); assert.equal(h.child.killed, 1); h.child.emit("close", 0);
  });
  test(`${file}: actual overall timeout rejects partial output even if idle is longer`, async () => {
    const h = harness(), pending = h.run(5, 100); h.child.stdout.emit("data", Buffer.from("Partial output")); await assert.rejects(pending, /timed out/); assert.equal(h.child.killed, 1); h.child.emit("close", 0);
  });
  test(`${file}: actual definition handlers pin storage, attach file SHA and propagate CLI failure`, async () => {
    const root = path.join("F:/AI/AgentMake/temp/GameCowork/commands-subagents", "core-handlers-" + randomUUID()), workspace = path.join(root, "workspace"), home = path.join(root, "home");
    fs.mkdirSync(workspace, { recursive: true }); fs.mkdirSync(home);
    const handlers = new Map(), actions = [], refreshes = [];
    const core = {
      getWorkspaceCwd: async () => workspace, resolveCliPath: () => "owned-agent", refreshCommandsForAllSessions: async () => refreshes.push("commands"), refreshAgentsForAllSessions: async () => refreshes.push("agents"), refreshSkillsForAllSessions: async () => refreshes.push("skills"),
      parseCliListOutput: output => JSON.parse(output), runGameCoworkCliCommand: async () => "[]", runCliManageAction: async (...args) => { actions.push(args); return { status: "success" }; }
    };
    const ctx = vm.createContext({ process: { env: { GAMECOWORK_LOCAL_PROVIDER_MODE: "1", GAMECOWORK_CLI_HOME: home } }, t: core, n: (type, handler) => handlers.set(type, handler), require: name => name === "./gamecowork-custom.js" ? require(path.join(base, "gamecowork-custom.js")) : assert.fail(name), Htr: { parse: () => ({ prompt: "Owned command" }) } });
    const first = source.indexOf("const gamecoworkCustomOptions"), last = source.indexOf('n("skills/reloadAcp"', first);
    const customSection = source.slice(first, last).replace(/\(\s*$/, "");
    const listStart = source.indexOf('n("commands/list"'), listEnd = source.indexOf('n("acp/refreshCommands"', listStart);
    vm.runInContext(customSection + "\n" + source.slice(listStart, listEnd).replace(/,\s*$/, ";"), ctx);
    const created = await handlers.get("custom/create")({ data: { kind: "commands", name: "owned", content: 'prompt = "Owned command"\n', scope: "workspace", workspace: root, home: root } });
    assert.equal(created.path, path.join(workspace, ".gamecowork-cli/commands/owned.toml")); assert.deepEqual(refreshes, ["commands"]);
    core.runGameCoworkCliCommand = async () => JSON.stringify([{ name: "owned", path: created.path, source: "project", disabled: false }, { name: "external", path: path.join(root, "outside.toml"), source: "user", disabled: false }]);
    const list = await handlers.get("commands/list")(); assert.equal(list.commands[0].managed, true); assert.match(list.commands[0].sha256, /^[a-f0-9]{64}$/); assert.equal(list.commands[1].managed, false);
    await handlers.get("commands/disable")({ data: { name: "owned", path: created.path, expectedSha256: list.commands[0].sha256, scope: "workspace" } });
    assert.deepEqual(Array.from(actions[0]), ["commands", "disable", "owned", undefined, "workspace"]);
    await assert.rejects(handlers.get("commands/delete")({ data: { name: "owned", path: created.path, expectedSha256: "0".repeat(64), scope: "workspace" } }), /changed on disk/); assert.equal(fs.existsSync(created.path), true);
    core.runGameCoworkCliCommand = async () => { throw new Error("Owned CLI discovery failed"); };
    await assert.rejects(handlers.get("commands/list")(), /Owned CLI discovery failed/); await assert.rejects(handlers.get("subagents/list")(), /Owned CLI discovery failed/);
    const notifyStart = source.indexOf('n("acp/notifyUpdate"'), notifyEnd = source.indexOf('n("acp/modelProfiles"', notifyStart);
    vm.runInContext(source.slice(notifyStart, notifyEnd).replace(/,\s*$/, ";"), ctx);
    core.restartAllAcpSessions = () => assert.fail("A capability refresh must preserve other workspace sessions");
    const previousRefreshes = refreshes.length;
    await handlers.get("acp/notifyUpdate")({ data: { type: "command" } });
    await handlers.get("acp/notifyUpdate")({ data: { type: "subagent" } });
    assert.deepEqual(refreshes.slice(previousRefreshes), ["commands", "agents"]);
  });
}
