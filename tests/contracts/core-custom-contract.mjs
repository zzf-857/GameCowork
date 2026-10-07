import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { zipFixture, sha256 } from "../fixtures/custom-fixtures.mjs";
const require = createRequire(import.meta.url);
const custom = require("../../src/core/binary/out/modules/custom/service.js");
const root = "F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/custom-contract-" + randomUUID();
fs.mkdirSync(root, { recursive: true });
const workspace = path.join(root, "workspace"), home = path.join(root, "home");
fs.mkdirSync(workspace); fs.mkdirSync(home);
test("Capability names reject traversal, drive names, reserved filenames and invalid scopes", () => {
  for (const value of ["../escape", "a/b", "a\\b", "C:root", "con", "nul", "lpt1", "", " "]) assert.throws(() => custom.capabilityName(value));
  assert.throws(() => custom.scope("global")); assert.equal(custom.capabilityName("owned-skill_1"), "owned-skill_1");
});
test("Create-new preserves existing contents and update requires its actual byte SHA", async () => {
  const options = { kind: "skills", name: "owned", scope: "workspace", workspace, home, contents: "ORIGINAL" };
  const created = await custom.createCapability(options); assert.equal(fs.readFileSync(created.path, "utf8"), "ORIGINAL");
  await assert.rejects(custom.createCapability({ ...options, contents: "REPLACED" }), /exist/i);
  const read = await custom.readCapability(options); assert.equal(read.sha256, sha256("ORIGINAL"));
  await assert.rejects(custom.updateCapability({ ...options, content: "REPLACED", expectedSha256: "0".repeat(64) }), /changed on disk/);
  assert.equal(fs.readFileSync(created.path, "utf8"), "ORIGINAL");
  const saved = await custom.updateCapability({ ...options, content: "UPDATED", expectedSha256: read.sha256 });
  assert.equal(saved.content, "UPDATED"); assert.equal(saved.sha256, sha256("UPDATED"));
});
test("Capability storage refuses a symlink that points outside its authorized root", async () => {
  const isolated = path.join(root, "linked-workspace"), outside = path.join(root, "outside"); fs.mkdirSync(isolated); fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(isolated, ".gamecowork-cli"), "junction");
  await assert.rejects(custom.createCapability({ kind: "skills", name: "escaped", scope: "workspace", workspace: isolated, home, contents: "NO" }), /link/);
  assert.deepEqual(fs.readdirSync(outside), []);
});
test("ZIP admission validates central/local paths, CRC and bounded expansion before any installer writes", () => {
  const safe = zipFixture({ "owned/SKILL.md": "---\nname: owned\ndescription: fixture\n---\nOwned instructions\n" });
  assert.deepEqual(custom.validateSkillUpload(safe.toString("base64"), "owned.zip"), safe);
  for (const filename of ["../owned.zip", "C:owned.zip", "owned.txt", "..zip"]) assert.throws(() => custom.validateSkillUpload(safe.toString("base64"), filename));
  for (const entry of ["../escape/SKILL.md", "/escape/SKILL.md", "a\\SKILL.md", "C:/SKILL.md", "a/../SKILL.md", "nul/SKILL.md"]) assert.throws(() => custom.validateSkillUpload(zipFixture({ [entry]: "x" }).toString("base64"), "owned.zip"));
  const corrupt = Buffer.from(safe); corrupt[35] ^= 1; assert.throws(() => custom.validateSkillUpload(corrupt.toString("base64"), "owned.zip"));
  assert.throws(() => custom.validateSkillUpload("%%", "owned.zip"));
});
for (const kind of ["commands", "agents"]) {
  test(`${kind}: scoped TOML create/read/edit/rename/delete preserves source, version and disabled settings`, async () => {
    const name = "owned-" + kind, content = kind === "commands" ? 'prompt = "Owned prompt"\n' : `name = "${name}"\ndescription = "Owned specialist"\n[prompts]\nsystem_prompt = "Owned instructions"\n`;
    const options = { kind, name, scope: "user", workspace, home, contents: content };
    const created = await custom.createCapability(options);
    assert.equal(created.path, path.join(home, kind, name + ".toml"));
    await assert.rejects(custom.createCapability(options), /exist/i);
    const read = await custom.readCapability(options);
    await assert.rejects(custom.updateCapability({ ...options, content: "NO", expectedSha256: "0".repeat(64) }), /changed on disk/);
    await assert.rejects(custom.readCapability({ ...options, path: path.join(workspace, "external.toml") }), /outside/);
    const concurrent = await Promise.allSettled(["ONE", "TWO"].map(content => custom.updateCapability({ ...options, content, expectedSha256: read.sha256 })));
    assert.equal(concurrent.filter(result => result.status === "fulfilled").length, 1);
    assert.equal(concurrent.filter(result => result.status === "rejected").length, 1);
    const latest = await custom.readCapability(options), newName = name + "-renamed";
    fs.writeFileSync(path.join(home, "settings.json"), JSON.stringify({ [kind]: { disabled: [name, "unrelated"] }, retained: { fixture: true } }));
    const renamedContent = kind === "commands" ? 'prompt = "Renamed prompt"\n' : `name = "${newName}"\ndescription = "Owned specialist"\n[prompts]\nsystem_prompt = "Owned instructions"\n`;
    const parseToml = () => kind === "commands" ? { prompt: "Renamed prompt" } : { name: newName, description: "Owned specialist", prompts: { system_prompt: "Owned instructions" } };
    const renamed = await custom.renameDefinition({ ...options, newName, content: renamedContent, expectedSha256: latest.sha256, parseToml });
    assert.equal(fs.existsSync(created.path), false); assert.equal(renamed.content, renamedContent);
    const settings = JSON.parse(fs.readFileSync(path.join(home, "settings.json"), "utf8"));
    assert.deepEqual(settings[kind].disabled, [newName, "unrelated"]); assert.deepEqual(settings.retained, { fixture: true });
    await assert.rejects(custom.deleteDefinition({ ...options, name: newName, expectedSha256: latest.sha256 }), /changed on disk/);
    await custom.deleteDefinition({ ...options, name: newName, expectedSha256: renamed.sha256 });
    assert.equal(fs.existsSync(renamed.path), false);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(home, "settings.json"), "utf8"))[kind].disabled, ["unrelated"]);
  });
  test(`${kind}: links, existing rename targets and stale deletion cannot overwrite data`, async () => {
    const name = "protected-" + kind, options = { kind, name, scope: "workspace", workspace, home, contents: "ORIGINAL" };
    const created = await custom.createCapability(options), current = await custom.readCapability(options);
    const target = path.join(path.dirname(created.path), name + "-target.toml"); fs.writeFileSync(target, "TARGET");
    await assert.rejects(custom.renameDefinition({ ...options, newName: name + "-target", content: "REPLACE", expectedSha256: current.sha256, parseToml: () => ({ prompt: "replace", name: name + "-target", description: "fixture", prompts: { system_prompt: "fixture" } }) }), /exist/i);
    assert.equal(fs.readFileSync(target, "utf8"), "TARGET"); assert.equal(fs.readFileSync(created.path, "utf8"), "ORIGINAL");
    fs.writeFileSync(created.path, "EXTERNAL"); await assert.rejects(custom.deleteDefinition({ ...options, expectedSha256: current.sha256 }), /changed on disk/);
    assert.equal(fs.readFileSync(created.path, "utf8"), "EXTERNAL");
    const linked = path.join(root, "linked-" + kind); fs.mkdirSync(linked); fs.mkdirSync(path.join(linked, ".gamecowork-cli"));
    fs.symlinkSync(path.dirname(created.path), path.join(linked, ".gamecowork-cli", kind), "junction");
    await assert.rejects(custom.createCapability({ ...options, workspace: linked, name: "escape" }), /link/);
    assert.equal(fs.existsSync(path.join(path.dirname(created.path), "escape.toml")), false);
  });
}
test("Definition admission rejects invalid prompts and mismatched agent identities", () => {
  for (const parsed of [{}, { prompt: 42 }, { prompt: "" }, { prompt: "owned", description: [] }]) assert.throws(() => custom.validateDefinition({ kind: "commands", name: "owned", content: "fixture", parseToml: () => parsed }));
  for (const parsed of [{ name: "other", description: "fixture", prompts: { system_prompt: "owned" } }, { name: "owned", description: "fixture" }]) assert.throws(() => custom.validateDefinition({ kind: "agents", name: "owned", content: "fixture", parseToml: () => parsed }));
});
