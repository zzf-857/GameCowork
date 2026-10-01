const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const assets = path.join(__dirname, "../../src/frontend/bundle/assets");
for (const file of ["VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js"]) {
  const source = fs.readFileSync(path.join(assets, file), "utf8"), start = source.indexOf("function gamecoworkScheduleChatFocus("), end = source.indexOf("\n}\n", start) + 2;
  assert.ok(start >= 0 && end > start); const helper = source.slice(start, end);
  function harness() {
    const registered = new Map(), messages = [], timers = new Map(); let sequence = 0;
    function owner(key, values) { return Object.assign(values, { addEventListener: (type, listener) => registered.set(key + type, listener), removeEventListener: (type, listener) => { if (registered.get(key + type) === listener) registered.delete(key + type); } }); }
    const target = { isConnected: true, hidden: false, visible: true, closest() { return this.hidden ? {} : null; }, getClientRects() { return this.visible ? [{}] : []; } }, body = {}, origin = {};
    const document = owner("document:", { body, activeElement: origin, target, querySelector() { return this.target; } });
    const window = owner("window:", { location: { href: "http://127.0.0.1/gui.html" }, postMessage: value => messages.push(value) });
    const ctx = vm.createContext({ document, window, setTimeout: callback => { timers.set(++sequence, callback); return sequence; }, clearTimeout: id => timers.delete(id) });
    vm.runInContext(helper, ctx);
    return { target, body, document, window, registered, messages, run: () => ctx.gamecoworkScheduleChatFocus(), fire: (key, event = {}) => registered.get(key)?.(event), tick: () => { for (const [id, callback] of [...timers]) { timers.delete(id); callback(); } } };
  }
  test(`${file}: Settings Back focuses the unchanged visible chat after normal handoff and releases listeners`, () => {
    const h = harness(); h.run(); h.document.activeElement = h.body; h.tick(); assert.equal(h.messages.length, 1); assert.equal(h.messages[0].messageType, "focusContinueInputWithoutClear"); assert.equal(h.registered.size, 0);
  });
  test(`${file}: a subsequent toolbar pointer, keyboard or focus choice cancels stale chat focus`, () => {
    for (const key of ["document:pointerdown", "document:keydown", "document:focusin"]) {
      const h = harness(); h.run(); const menu = {}; h.document.activeElement = menu; h.fire(key, { target: menu }); h.tick(); assert.equal(h.messages.length, 0); assert.equal(h.registered.size, 0);
    }
  });
  test(`${file}: replaced/hidden chat and route changes cannot receive an old Settings focus`, () => {
    for (const mutate of [h => { h.document.target = {}; }, h => { h.target.isConnected = false; }, h => { h.target.hidden = true; }, h => { h.target.visible = false; }, h => { h.window.location.href += "#/other"; }, h => h.fire("window:popstate"), h => h.fire("window:hashchange"), h => h.fire("window:pagehide")]) {
      const h = harness(); h.run(); mutate(h); h.tick(); assert.equal(h.messages.length, 0); assert.equal(h.registered.size, 0);
    }
  });
}
