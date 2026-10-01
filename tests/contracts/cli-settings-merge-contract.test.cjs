const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../../src/agent/cli-main.beautified.js"), "utf8");
const start = source.indexOf("            computeMergedSettings() {"), end = source.indexOf("\n            forScope(", start);
assert.ok(start > 0 && end > start, "Extract the actual maintained CLI merge method");
const method = source.slice(start, end);
function merge(system, user, workspace) {
  const ctx = vm.createContext({ e: { mergeContentGenerator: () => undefined }, system, user, workspace });
  return JSON.parse(JSON.stringify(vm.runInContext("new (class { system = { settings: system }; user = { settings: user }; workspace = { settings: workspace }; " + method + " })().computeMergedSettings()", ctx)));
}
test("Actual CLI keeps system/user/workspace disabled agents as a unique union alongside other capability settings", () => {
  const result = merge({ agents: { disabled: ["system", "shared"], enabled: true, enableBuiltin: true } }, { agents: { disabled: ["global", "shared"], enableBuiltin: false }, commands: { disabled: ["global-command"] } }, { agents: { disabled: ["project", "shared"], enabled: false }, commands: { disabled: ["project-command"] } });
  assert.deepEqual(result.agents.disabled, ["system", "shared", "global", "project"]); assert.equal(result.agents.enabled, false); assert.equal(result.agents.enableBuiltin, false);
  assert.deepEqual(result.commands.disabled, ["global-command", "project-command"]);
});
test("Actual CLI does not reenable global agents when the workspace removes its own disabled entry", () => {
  const user = { agents: { disabled: ["global"] } }, workspace = { agents: { disabled: ["project"] }, retained: "fixture" };
  assert.deepEqual(merge({}, user, workspace).agents.disabled, ["global", "project"]);
  workspace.agents.disabled = []; assert.deepEqual(merge({}, user, workspace).agents.disabled, ["global"]);
  assert.deepEqual(merge({}, {}, {}).agents.disabled, []); assert.equal(merge({}, user, workspace).retained, "fixture");
});
