// Both Core entries must register the Codely account broker through the same
// module and route their control-plane reads through it before the legacy
// (unauthenticated) client. Kept as text contracts so the two maintained
// entries cannot drift apart.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = "F:/AI/AgentMake/CyberSoftwares/GameCowork";
const beautified = fs.readFileSync(`${root}/src/core/binary/out/index.beautified.js`, "utf8");
const minified = fs.readFileSync(`${root}/src/core/binary/out/index.js`, "utf8");

test("Both Core entries register the account broker wiring once", () => {
  const moduleNeedle = './modules/account/broker.js';
  for (const [name, text] of [["index.beautified.js", beautified], ["index.js", minified]]) {
    const calls = [...text.matchAll(/require\((['"])\.\/modules\/account\/broker\.js\1\)\.registerCoreWiring\(/g)].length;
    assert.equal(calls, 1, `${name} must register the broker exactly once`);
    assert.ok(
      text.includes(moduleNeedle) && /require\((['"])\.\/modules\/account\/broker\.js\1\)\.registerCoreWiring\(/.test(text),
      `${name} must wire through the shared module`,
    );
  }
});

test("Both Core entries expose the official site surface RPCs and adapters", () => {
  assert.ok(fs.readFileSync(`${root}/src/core/binary/out/modules/account/broker.js`, "utf8")
    .includes('messenger.on("codelyAccount/canvasSnapshot"'), "the shared wiring must register the canvas snapshot RPC");
  const generator = fs.readFileSync(`${root}/src/core/binary/out/modules/generation/codely-api.js`, "utf8");
  assert.ok(generator.includes("codelyAccountOfficialSurface()"), "the Quick adapter must consult the official surface facade");
  assert.ok(generator.includes("codely-official"), "the Quick adapter must mark the official identity mode");
  const canvasAuth = fs.readFileSync(`${root}/src/frontend/bundle/codely-canvas/canvas-local-auth.js`, "utf8");
  assert.ok(canvasAuth.includes("validateCanvasOfficialOverlay"), "the canvas adapter must validate the official overlay");
  assert.ok(!/access_token/.test(canvasAuth.split("makeCanvasLocalAuthValue")[1] || ""), "the canvas auth value must never carry token fields");
});

test("Both Core entries consult the broker before the legacy control-plane client", () => {
  const branches = [
    ["getUserPlan", "controlPlaneClient.getUserPlan("],
    ["getUserUsageSummary", "controlPlaneClient.getUserUsageSummary("],
    ["getUserExhaustion", "controlPlaneClient.getUserExhaustion("],
  ];
  for (const text of [beautified, minified]) {
    for (const [method, legacy] of branches) {
      const at = text.indexOf(legacy);
      assert.ok(at > 0, `legacy ${method} call site missing`);
      const head = text.slice(Math.max(0, at - 400), at);
      assert.ok(
        head.includes(`codelyAccountDataCall("${method}"`) || text.slice(at - 400, at).includes(`codelyAccountDataCall("${method}"`),
        `broker-first branch missing for ${method}`,
      );
    }
    assert.ok(text.includes("codelyAccountOrgSnapshot(t)"), "refreshOrgList broker branch missing");
    assert.ok(text.includes("codelyAccountSwitchOrg(t,"), "switchOrg broker branch missing");
  }
});

test("Shell vault request kinds stay core-only and the broker module stays dependency-free", () => {
  const shellMain = fs.readFileSync(`${root}/src/shell/src/main.rs`, "utf8");
  assert.ok(shellMain.includes("codely_account::vault_host_response"), "shell must answer vault requests");
  assert.ok(shellMain.includes("codely_account::is_vault_request(kind)"), "core->host dispatch must admit vault requests");
  // Renderer-reachable workspace allowlist must not include the vault kinds.
  const allowlistStart = shellMain.indexOf('matches!(\n        kind,\n        "getWorkspaceDirs"');
  assert.ok(allowlistStart > 0, "renderer workspace allowlist block not found");
  const allowlist = shellMain.slice(allowlistStart, shellMain.indexOf(")", shellMain.indexOf('"getDiff"', allowlistStart)) + 1);
  assert.ok(!/gamecoworkAccount\/vault/.test(allowlist), "vault kinds must not be renderer-reachable");
  const moduleSource = fs.readFileSync(`${root}/src/core/binary/out/modules/account/broker.js`, "utf8");
  for (const dependency of ['require("electron")', 'require("axios")', "node-fetch"]) {
    assert.ok(!moduleSource.includes(dependency), `unexpected dependency ${dependency}`);
  }
  assert.ok(moduleSource.includes('client_name: CLIENT_NAME') && moduleSource.includes('CLIENT_NAME = "GameCowork"'));
});
