import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../restored/frontend/dist-beautified/assets/", import.meta.url));
const generations = [
  ["current", "index-BRxZ4eG7.js", "RightSideBarPanel-JSPvAs5c.js", "QR", "I2", "kt"],
  ["previous", "index-DvRYaIVa.js", "RightSideBarPanel-B2OWNNNX.js", "kR", "E2", "St"],
];
function declaration(source, name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.ok(start >= 0, name + " exists in actual source");
  const end = source.indexOf("\n}", start);
  assert.ok(end > start);
  return source.slice(start, end + 2);
}
for (const [label, gui, panel, saveName, requestName, routingName] of generations) {
  const main = fs.readFileSync(assets + gui, "utf8");
  const sidebar = fs.readFileSync(assets + panel, "utf8");
  test(`${label}: missing LSP connectivity cannot become a green supported badge`, () => {
    const window = { GAMECOWORK_SHELL: true };
    const ready = vm.runInNewContext(`(${declaration(sidebar, "gamecoworkLspReady")})`, { window });
    assert.equal(ready(undefined, true), false);
    assert.equal(ready({}, true), false);
    assert.equal(ready({ lspStatus: { supported: true } }, true), false);
    assert.equal(ready({ lspStatus: { supported: true, connected: false } }, true), false);
    assert.equal(ready({ lspStatus: { supported: true, connected: true } }, true), true);
    assert.equal(ready({ lspStatus: { supported: true, connected: true } }, false), false);
    window.GAMECOWORK_SHELL = false;
    assert.equal(ready(undefined, true), true);
    assert.ok(main.includes("connected: t.connected"));
    assert.ok(sidebar.includes('"data-lsp-connected": gamecoworkLspReady(gamecoworkLspFile, ae)'));
  });
  test(`${label}: a disk conflict explains the preserved draft without exposing implementation terms`, () => {
    const window = { GAMECOWORK_SHELL: true };
    const i18n = { language: "zh-CN", t: (_key, options) => options.defaultValue };
    const describe = vm.runInNewContext(`(${declaration(main, "gamecoworkFileFailureMessage")})`, { window, Un: i18n });
    assert.equal(describe({ code: "file_changed", error: "SHA-256 mismatch" }), "文件已在磁盘上改变，保存失败。当前编辑内容已保留。");
    i18n.language = "en";
    assert.equal(describe({ code: "file_changed" }), "The file changed on disk. Your unsaved edits have been kept.");
    assert.equal(describe({ code: "permission", error: "Fixture denied" }), "Fixture denied");
    window.GAMECOWORK_SHELL = false;
    assert.equal(describe({ code: "file_changed", error: "Original host failure" }), "Original host failure");
  });
  test(`${label}: actual preview editability respects backend, virtual, source, and write-in-flight states`, () => {
    const readOnly = vm.runInNewContext(`(${declaration(sidebar, "gamecoworkPreviewReadOnly")})`);
    const tab = { id: "F:/fixture/a.txt", file: { kind: "text", readOnly: false } };
    assert.equal(readOnly(tab, true, false), false);
    assert.equal(readOnly({ ...tab, file: { ...tab.file, readOnly: true } }, true, false), true);
    assert.equal(readOnly({ ...tab, id: "virtual:answer" }, true, false), true);
    assert.equal(readOnly(tab, false, false), true);
    assert.equal(readOnly(tab, true, true), true);
    assert.ok(sidebar.includes("readOnly: gamecoworkPreviewReadOnly(e, m && (!g || y), gamecoworkSaving)"));
    assert.ok(sidebar.includes("isSaving: !!Yr"));
  });
  test(`${label}: undo eligibility protects dirty content and original workspace ownership`, () => {
    const canUndo = vm.runInNewContext(`(${declaration(sidebar, "gamecoworkCanUndoSave")})`, { window: { GAMECOWORK_SHELL: true } });
    const tab = { id: "a", path: "F:/fixture/a.txt", file: { readOnly: false }, isDirty: false };
    const saved = { id: "a", path: tab.path, changeId: "real-snapshot", workspaceRoute: "F:/fixture/A" };
    assert.equal(canUndo(tab, saved, false, saved.workspaceRoute), true);
    assert.equal(canUndo({ ...tab, isDirty: true }, saved, false, saved.workspaceRoute), false);
    assert.equal(canUndo({ ...tab, file: { readOnly: true } }, saved, false, saved.workspaceRoute), false);
    assert.equal(canUndo(tab, saved, false, "F:/fixture/B"), false);
    assert.equal(canUndo({ ...tab, id: "b" }, saved, false, saved.workspaceRoute), false);
    assert.equal(canUndo(tab, saved, true, saved.workspaceRoute), false);
    assert.equal(canUndo(tab, { ...saved, changeId: undefined }, false, saved.workspaceRoute), false);
  });
  test(`${label}: actual save returns the real snapshot receipt and propagates a failed write`, async () => {
    let result = { ok: true, applied: true, changeId: "receipt-from-host" };
    const calls = [];
    const save = vm.runInNewContext(`(${declaration(main, saveName)})`, { [requestName]: async (...args) => { calls.push(args); return result; } });
    assert.equal(await save("a.txt", "fixture-content", "A", "expected-file-hash"), result);
    assert.equal(calls[0][1], "save");
    assert.equal(calls[0][2].content, "fixture-content");
    assert.equal(calls[0][2].expectedSha256, "expected-file-hash");
    assert.equal(calls[0][3], "A");
    result = { error: "write denied" };
    await assert.rejects(save("a.txt", "new", "A"), /write denied/);
    assert.ok(sidebar.includes("const result = await el(Re, _e, route, qe.file.sha256)"));
    assert.ok(sidebar.includes("Kr(le, result?.afterSha256)"));
    assert.ok(main.includes("sha256: e.sha256"));
    assert.ok(!main.includes("console.log(\"[api] postFileExplorer"));
  });
  test(`${label}: actual undo sends the snapshot and captured route, rejecting outer success without restore`, async () => {
    const calls = [];
    let payload = { ok: true, applied: true, changeId: "receipt-from-host" };
    let status = true;
    const window = { GAMECOWORK_SHELL: true, location: { origin: "http://127.0.0.1:1234" } };
    const undo = vm.runInNewContext(`(${declaration(main, "gamecoworkUndoFileChange")})`, {
      window,
      [routingName]: (route) => ({ headers: { "X-Fixture-Route": route }, body: { workspaceDir: route } }),
      fetch: async (url, options) => { calls.push({ url, options }); return { ok: status, json: async () => payload }; },
    });
    await undo("receipt-from-host", "F:/fixture/A");
    assert.equal(calls[0].url, window.location.origin + "/api/tauri/file-changes/undo");
    assert.deepEqual(JSON.parse(calls[0].options.body), { changeId: "receipt-from-host", workspaceDir: "F:/fixture/A" });
    assert.equal(calls[0].options.headers["X-Fixture-Route"], "F:/fixture/A");
    payload = { ok: true, applied: false };
    await assert.rejects(undo("receipt-from-host", "A"), /not restored/);
    payload = { error: "file changed externally" }; status = false;
    await assert.rejects(undo("receipt-from-host", "A"), /file changed externally/);
    window.GAMECOWORK_SHELL = false;
    await assert.rejects(undo("receipt-from-host", "A"), /local saved change/);
    assert.equal(calls.length, 3);
  });
  test(`${label}: actual file EventSource preserves rescan and terminates a failed watcher`, () => {
    const start = main.lastIndexOf("\nfunction ", main.indexOf("new EventSource"));
    const name = main.slice(start).match(/function (\w+)\(/)[1];
    let eventSource;
    const events = [];
    class EventSource {
      constructor(url) { this.url = url; this.closed = 0; eventSource = this; }
      close() { this.closed++; }
    }
    const listen = vm.runInNewContext(`(${declaration(main, name)})`, {
      EventSource, URL, console,
      window: { location: { origin: "http://127.0.0.1:4321" } },
      [routingName]: () => ({ headers: {}, body: { workspaceDir: "F:/fixture/A" } }),
    });
    const close = listen((record) => events.push(record), undefined, "A");
    assert.equal(new URL(eventSource.url).searchParams.get("workspaceDir"), "F:/fixture/A");
    eventSource.onmessage({ data: JSON.stringify({ changes: [{ kind: "added", path: "." }], rescan: true }) });
    assert.equal(events[0].rescan, true);
    eventSource.onmessage({ data: JSON.stringify({ watcherFailed: true, error: "native watcher ended" }) });
    assert.equal(events[1].watcherFailed, true);
    assert.equal(events[1].changes.length, 0);
    assert.equal(eventSource.closed, 1);
    close();
    assert.equal(eventSource.closed, 2);
    assert.ok(sidebar.includes("fn(Object.keys(I.current))"));
    assert.ok(sidebar.includes("if (!Nr.current.has(openPath)) zr(openPath)"));
  });
  test(`${label}: local native delete/create events cannot be guessed into an unrelated rename`, () => {
    const normalize = vm.runInNewContext(`(${declaration(sidebar, "dw")})`, { window: { GAMECOWORK_SHELL: true } });
    const changes = [{ kind: "deleted", path: "old.txt", parentPath: "." }, { kind: "added", path: "unrelated.txt", parentPath: "." }];
    assert.equal(normalize(changes), changes);
    const rename = [{ kind: "renamed", oldPath: "old.txt", path: "new.txt", parentPath: "." }];
    assert.equal(normalize(rename), rename);
  });
}
