import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
function methods(source) {
  const start = source.indexOf("async function gamecoworkPassiveUnityQuery("), end = source.indexOf("\n}\n", source.indexOf("function gamecoworkPassiveUnityEpoch(", start)) + 2;
  assert.ok(start >= 0 && end > start); return source.slice(start, end);
}
for (const name of ["index-BRxZ4eG7.js", "index-DvRYaIVa.js", "VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js"]) {
  const source = fs.readFileSync(assets + name, "utf8").replaceAll("\r\n", "\n");
  const ctx = vm.createContext({ window: { GAMECOWORK_SHELL: true } }); vm.runInContext(methods(source), ctx);
  const route = { workspaceKey: "A", workspaceRef: { runOn: "local", workspaceDir: "F:/owned/A" } };
  const payload = { command: "manage_editor", toolParams: { action: "get_state" }, ...route };
  function messenger({ result, packagePresent = true, project = true } = {}) {
    const calls = [], errors = [];
    return { calls, errors,
      request: async (type, data) => { calls.push({ type, data, normal: true }); return result; },
      requestWithMessageId: async (type, data) => { calls.push({ type, data }); return { messageId: "owned", data: type === "unity/getProjectStatus" ? { status: "success", content: { status: "success", content: { isUnityProject: project, hasUnityMcpPackage: packagePresent } } } : result }; },
      handleRequestError: async (type, error) => errors.push({ type, error }),
    };
  }
  test(`${name}: a transient disconnected bridge retains the real failure and unknown state without an install toast`, async () => {
    const result = { status: "error", error: "GameCowork Editor Bridge is not connected. Install the local package." }, client = messenger({ result });
    const actual = await ctx.gamecoworkPassiveUnityQuery(client, payload);
    assert.equal(actual.status, "error"); assert.equal(actual.error, result.error); assert.equal(actual.unknown, true); assert.equal(actual.reason, "editor_disconnected");
    assert.equal(client.errors.length, 0); assert.equal(client.calls[0].data, payload); assert.equal(client.calls[1].type, "unity/getProjectStatus");
    assert.equal(client.calls[1].data.workspaceKey, "A"); assert.equal(client.calls[1].data.workspaceRef, route.workspaceRef);
  });
  test(`${name}: a real missing package or hard failure keeps original error feedback`, async () => {
    for (const result of [{ status: "error", error: "Editor Bridge is not connected. Install the local package." }, { status: "success", content: { status: "error", error: "Unsupported read tool" } }]) {
      const client = messenger({ result, packagePresent: false }), actual = await ctx.gamecoworkPassiveUnityQuery(client, payload);
      assert.equal(actual, result); assert.equal(actual.unknown, undefined); assert.equal(client.errors.length, 1);
    }
  });
  test(`${name}: a connected reply is unchanged and never probes package metadata`, async () => {
    const result = { status: "success", content: { status: "success", response: { data: { isPlaying: true, playMode: "playing" } } } }, client = messenger({ result });
    assert.equal(await ctx.gamecoworkPassiveUnityQuery(client, payload), result); assert.equal(client.calls.length, 1); assert.equal(client.errors.length, 0);
  });
  test(`${name}: explicit actions and other hosts retain normal request/error handling`, async () => {
    const result = { status: "error", error: "Explicit action failed" }, client = messenger({ result });
    assert.equal(await ctx.gamecoworkPassiveUnityQuery(client, { ...payload, toolParams: { action: "play" } }), result);
    ctx.window.GAMECOWORK_SHELL = false;
    assert.equal(await ctx.gamecoworkPassiveUnityQuery(client, payload), result); ctx.window.GAMECOWORK_SHELL = true;
    assert.equal(client.calls.length, 2); assert.ok(client.calls.every(call => call.normal));
  });
  test(`${name}: an obsolete callback does not probe metadata or publish its old error`, async () => {
    const client = messenger({ result: { status: "error", error: "Editor Bridge is not connected" } });
    const reply = await ctx.gamecoworkPassiveUnityQuery(client, payload, () => false);
    assert.equal(reply.status, "unknown"); assert.equal(reply.stale, true); assert.equal(client.calls.length, 1); assert.equal(client.errors.length, 0);
  });
  test(`${name}: an implicit active owner is captured before the first await and metadata cannot fall into another project`, async () => {
    const client=messenger({result:{status:"error",error:"Editor Bridge is not connected"}}), routeKeys=new Map();
    client.routedWorkspaceKeysByMessageId=routeKeys;client.resolveHubWorkspaceRoute=(_payload,id)=>{routeKeys.set(id,"A");return route;};
    await ctx.gamecoworkPassiveUnityQuery(client,{command:"manage_editor",toolParams:{action:"get_state"}});
    assert.equal(client.calls[0].data.workspaceKey,"A");assert.equal(client.calls[1].data.workspaceKey,"A");assert.equal(client.calls[1].data.workspaceRef,route.workspaceRef);assert.equal(routeKeys.size,0);
  });
  test(`${name}: passive listener status is quiet during reload while explicit listener mutation stays normal`, async () => {
    const result={status:"error",error:"Editor Bridge is not connected"},client=messenger({result});
    const status=await ctx.gamecoworkPassiveUnityQuery(client,{command:"_internal_asset_listening",toolParams:{action:"status"},...route});
    assert.equal(status.status,"error");assert.equal(status.unknown,true);assert.equal(client.errors.length,0);
    await ctx.gamecoworkPassiveUnityQuery(client,{command:"_internal_asset_listening",toolParams:{action:"set",paused:true},...route});
    assert.equal(client.calls.at(-1).normal,true);
  });
  test(`${name}: query epochs discard old same-owner replies without cancelling another owner's query`, () => {
    const epochs = new Map(), first = ctx.gamecoworkPassiveUnityEpoch(epochs, { workspaceKey: "A" }), b = ctx.gamecoworkPassiveUnityEpoch(epochs, { workspaceKey: "B" }), latest = ctx.gamecoworkPassiveUnityEpoch(epochs, { workspaceKey: "A" });
    assert.equal(first(), false); assert.equal(latest(), true); assert.equal(b(), true);
    let current = true; const changed = ctx.gamecoworkPassiveUnityEpoch(epochs, { workspaceKey: "B" }, () => current); assert.equal(changed(), true); current = false; assert.equal(changed(), false);
  });
}
