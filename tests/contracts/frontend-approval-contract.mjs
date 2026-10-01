import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../../src/frontend/bundle/assets/", import.meta.url));
function declaration(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0);
  return source.slice(start, source.indexOf("\n}", start) + 2);
}
function reducer(source, name) {
  const start = source.indexOf("      " + name + ": (e,");
  assert.ok(start >= 0, name + " exists in actual Redux source");
  const body = source.indexOf("=>", start) + 2;
  const end = source.indexOf("\n      },", body);
  return source.slice(start + name.length + 8, body - 2).trim() + " =>" + source.slice(body, end) + "\n}";
}
for (const [label, file, gui, permissionWait, clearPermission, clearShell] of [
  ["current", "VscTheme-BExNMG_K.js", "index-BRxZ4eG7.js", "F2n", "ggn", "_gn"],
  ["previous", "VscTheme-B-CSeuv5.js", "index-DvRYaIVa.js", "D2n", "mgn", "ggn"],
]) {
  const source = fs.readFileSync(path.join(assets, file), "utf8");
  const main = fs.readFileSync(path.join(assets, gui), "utf8");
  function fixture() {
    const context = vm.createContext({ window: { GAMECOWORK_SHELL: true },
      Pt: (state, id) => state.sessions[id], fo: (state) => state.sessions[state.activeSessionId],
      Zo() {}, eVe: () => false, Kc() {} });
    const start = source.indexOf("const gamecoworkShellApprovalWaiters =");
    const end = source.indexOf("export { gamecoworkWaitShellApproval", start);
    vm.runInContext(`const T$ = new Map();\n${declaration(source, permissionWait)}\n${declaration(source, "aet")}\n${source.slice(start, end)}\nglobalThis.wait = ${permissionWait};`, context);
    context.reducers = {};
    for (const name of ["addPendingAcpShellConfirmationRequest", "removePendingAcpShellConfirmationRequest", "clearPendingAcpShellConfirmationRequests", "clearPendingAcpPermissionRequests", "removeWorkspaceSessions"])
      context.reducers[name] = vm.runInContext(`(${reducer(source, name)})`, context);
    const session = (id, workspace) => ({ id, workspaceId: workspace, pendingAcpPermissionRequests: [], pendingAcpShellConfirmationRequests: [],
      isStreaming: true, streamAborter: { abort() { this.aborted = true; } } });
    const state = { activeSessionId: "b", sessions: { a: session("a", "A"), b: session("b", "B") },
      workspaceSessionIds: { A: ["a"], B: ["b"] }, sessionIdToWorkspaceKey: { a: "A", b: "B" } };
    return { context, state };
  }
  test(`${label}: shell confirmation is stored and removed by the payload's session owner`, () => {
    const { context: c, state } = fixture();
    c.reducers.addPendingAcpShellConfirmationRequest(state, { payload: { sessionId: "a", requestId: "shell-a" } });
    assert.equal(state.sessions.a.pendingAcpShellConfirmationRequests.length, 1);
    assert.equal(state.sessions.b.pendingAcpShellConfirmationRequests.length, 0);
    c.reducers.removePendingAcpShellConfirmationRequest(state, { payload: { sessionId: "a", requestId: "shell-a" } });
    assert.equal(state.sessions.a.pendingAcpShellConfirmationRequests.length, 0);
    assert.ok(main.includes("requestId: v.requestId, sessionId: v.sessionId"));
  });
  test(`${label}: clearing A resolves A's real waiters, preserving B's waiting approvals`, async () => {
    const { context: c, state } = fixture();
    state.sessions.a.pendingAcpPermissionRequests.push({ requestId: "a:write" });
    state.sessions.b.pendingAcpPermissionRequests.push({ requestId: "b:write" });
    state.sessions.a.pendingAcpShellConfirmationRequests.push({ requestId: "shell-a" });
    state.sessions.b.pendingAcpShellConfirmationRequests.push({ requestId: "shell-b" });
    const permissionA = c.wait("a:write"); c.wait("b:write");
    const shellA = c.gamecoworkWaitShellApproval("shell-a");
    assert.equal(c.gamecoworkWaitShellApproval("shell-a"), shellA, "Retransmission uses the existing waiter");
    c.gamecoworkWaitShellApproval("shell-b");
    c.reducers.clearPendingAcpPermissionRequests(state, { payload: { sessionId: "a" } });
    c.reducers.clearPendingAcpShellConfirmationRequests(state, { payload: { sessionId: "a" } });
    assert.equal(await permissionA, null);
    assert.equal(await shellA, "reject");
    assert.equal(state.sessions.b.pendingAcpPermissionRequests.length, 1);
    assert.equal(state.sessions.b.pendingAcpShellConfirmationRequests.length, 1);
    assert.equal(vm.runInContext("T$.size", c), 1);
    assert.equal(vm.runInContext("gamecoworkShellApprovalWaiters.size", c), 1);
    assert.ok(source.includes(`t(${clearPermission}(i ? { sessionId: i } : void 0))`));
    assert.ok(source.includes(`t(${clearShell}(i ? { sessionId: i } : void 0))`));
  });
  test(`${label}: workspace closure cancels only its approval waiters and live stream`, async () => {
    const { context: c, state } = fixture();
    state.sessions.a.pendingAcpPermissionRequests.push({ requestId: "a:write" });
    state.sessions.a.pendingAcpShellConfirmationRequests.push({ requestId: "shell-a" });
    const permissionA = c.wait("a:write"); const shellA = c.gamecoworkWaitShellApproval("shell-a");
    c.reducers.removeWorkspaceSessions(state, { payload: "A" });
    assert.equal(await permissionA, null); assert.equal(await shellA, "reject");
    assert.equal(state.sessions.a.isStreaming, false);
    assert.equal(state.sessions.a.streamAborter.aborted, true);
    assert.equal(state.sessions.b.isStreaming, true);
    assert.equal(state.sessions.b.streamAborter.aborted, undefined);
    assert.deepEqual(state.workspaceSessionIds.B, ["b"]);
  });
  test(`${label}: a model-supplied timer cannot automatically approve a local permission`, () => {
    const name = main.slice(main.lastIndexOf("\nfunction ", main.indexOf('s = n && typeof n == "object" && !Array.isArray(n) ? n.autoContinueAtMs'))).match(/function (\w+)\(/)[1];
    let effect, approved = false, timers = 0;
    const timer = vm.runInNewContext(`(${declaration(main, name)})`, {
      window: { GAMECOWORK_SHELL: true },
      d: { useState: (value) => [value, () => {}], useRef: (value) => ({ current: value }), useEffect: (callback) => { effect = callback; } },
      Es: () => { approved = true; }, setInterval: () => { timers++; }, clearInterval() {}, Date,
    });
    assert.equal(timer({ requestId: "a:unsafe-timer", toolCall: { rawInput: { autoContinueAtMs: Date.now() - 1, autoContinueMessage: "model-provided" } } }, "proceed_once"), null);
    effect(); assert.equal(approved, false); assert.equal(timers, 0);
    assert.ok(main.includes('"data-permission-option-id": p.optionId'));
    assert.ok(main.includes('_.has("allow_always") && a.jsx(Cs'));
  });
  test(`${label}: actual permission listener distinguishes selected cancel/reject from explicit user cancellation`, async () => {
    const current = label === "current";
    const start = main.indexOf(`("acp/requestPermission", async (v) => {`);
    const arrow = main.indexOf("async (v)", start);
    const end = main.indexOf("\n    }),", arrow);
    assert.ok(start >= 0 && arrow > start && end > arrow);
    const callback = main.slice(arrow, end) + "\n    }";
    let selection;
    const actions = [];
    const action = (name) => (payload) => ({ name, payload });
    const context = vm.createContext({ window: { GAMECOWORK_SHELL: true }, e: (entry) => actions.push(entry),
      [current ? "zE" : "$E"]: async () => selection,
      [current ? "Q0" : "U0"]: action("add"), [current ? "qE" : "WE"]: action("remove"),
      [current ? "Uh" : "Sh"]: action("reject"), [current ? "M0" : "N0"]: action("cancel"),
      [current ? "Pj" : "jj"]: () => "Cancelled fixture request",
    });
    vm.runInContext(declaration(main, "gamecoworkIsPermissionCancellation"), context);
    const handle = vm.runInContext(`(${callback})`, context);
    const request = { sessionId: "A", toolCall: { toolCallId: "write-a" },
      options: [{ optionId: "cancel", kind: "reject_once" }, { optionId: "proceed_once", kind: "allow_once" }] };
    selection = "cancel";
    assert.deepEqual(JSON.parse(JSON.stringify(await handle(request))), { outcome: { outcome: "selected", optionId: "cancel" } });
    assert.equal(actions.find((entry) => entry.name === "reject").payload.sessionId, "A");
    selection = { gamecoworkCancelled: true };
    assert.deepEqual(JSON.parse(JSON.stringify(await handle(request))), { outcome: { outcome: "cancelled" } });
    assert.equal(actions.find((entry) => entry.name === "cancel").payload.sessionId, "A");
    selection = "not-an-offered-option";
    assert.deepEqual(JSON.parse(JSON.stringify(await handle(request))), { outcome: { outcome: "cancelled" } });
    assert.equal(actions.at(-1).name, "remove");
    assert.equal(actions.at(-1).payload.sessionId, "A");
  });
  test(`${label}: a closed owner's automatic save is explicitly skipped rather than routed to B`, async () => {
    const start = source.indexOf('sr("session/update", async (e,');
    const end = source.indexOf("\n  });",start);
    assert.ok(start>=0&&end>start);
    const callback = source.slice(source.indexOf("async (e",start),end) + "\n  }";
    let requests=0,updates=0;
    const save = vm.runInNewContext(`(${callback})`,{window:{GAMECOWORK_SHELL:true}});
    const outcome=await save({sessionId:"a"},{getState:()=>({session:{sessions:{a:{workspaceId:"A"}},sessionIdToWorkspaceKey:{}},hub:{isHubMode:true,workspaces:[{workspaceKey:"B"}]}}),
      dispatch:()=>updates++,extra:{ideMessenger:{request:()=>requests++}}});
    assert.equal(outcome.skipped,true);assert.equal(outcome.reason,"workspaceClosed");
    assert.equal(requests,0);assert.equal(updates,0);
  });
}
