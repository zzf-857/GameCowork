import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const assets = fileURLToPath(new URL("../restored/frontend/dist-beautified/assets/", import.meta.url));
for (const file of ["TerminalPanel-DaIbEA-8.js", "TerminalPanel-CZlNfaqp.js"]) {
  const source = fs.readFileSync(assets + file, "utf8");
  const start = source.indexOf("function wh(");
  const end = source.indexOf("\nexport { wh", start);
  assert.ok(start >= 0 && end > start);
  test(`${file}: actual terminal locks stdin until OPEN and locks again after close`, () => {
    let terminal, socket, onData, index = 0;
    const effects = [], phases = [], output = [];
    const viewport = { clientWidth: 100, clientHeight: 100 };
    const jsx = (component, props) => ({ component, props });
    class Terminal {
      constructor(options) { this.options = options; this.buffer = { active: { viewportY: 0, baseY: 0 } }; terminal = this; }
      loadAddon() {} open() {} attachCustomKeyEventHandler() {} scrollToBottom() {} focus() {} dispose() {} write(value) { output.push(value); }
      onData(handler) { onData = handler; return { dispose() {} }; }
      onResize() { return { dispose() {} }; }
      userType(value) { if (!this.options.disableStdin) onData(value); }
    }
    class WebSocket {
      static OPEN = 1; static CONNECTING = 0;
      constructor() { this.readyState = 0; this.handlers = {}; this.sent = []; socket = this; }
      addEventListener(type, handler) { this.handlers[type] = handler; }
      send(value) { this.sent.push(value); }
      close() { this.readyState = 3; }
    }
    class Observer { observe() {} disconnect() {} }
    const context = vm.createContext({
      Ye: { useRef: (value) => ({ current: index++ === 0 ? viewport : value }),
        useState: (value) => [value, (phase) => phases.push(phase)], useEffect: (effect) => effects.push(effect) },
      jr: () => ({ t: (_key, options) => options?.defaultValue || _key }), ns: { jsx, jsxs: jsx },
      _h: 6, uh: Terminal, tn: class { fit() {} }, tr: () => ({}), ph: () => "ws://127.0.0.1:1234/api/tauri/terminal",
      WebSocket, TextEncoder, Uint8Array, ArrayBuffer, Blob, ResizeObserver: Observer, MutationObserver: Observer,
      requestAnimationFrame: () => 1, cancelAnimationFrame() {}, document: { documentElement: {} },
    });
    const render = vm.runInContext(`(${source.slice(start, end)})`, context);
    const element = render({ workspaceRoot: "F:/fixture/A", isActive: true });
    assert.equal(element.props.style.position, undefined,
      "Do not override the CSS absolute inset layout needed by the xterm viewport");
    assert.equal(element.props.children[0].props["data-testid"], "terminal-connection-status");
    assert.equal(element.props.children[0].props.children, "正在连接终端…");
    const cleanup = effects[0]();
    assert.equal(terminal.options.disableStdin, true);
    terminal.userType("DO_NOT_DROP_EARLY_INPUT");
    assert.equal(socket.sent.length, 0);
    socket.readyState = WebSocket.OPEN; socket.handlers.open();
    assert.equal(terminal.options.disableStdin, false);
    assert.equal(phases.at(-1), "connected");
    assert.equal(JSON.parse(socket.sent[0]).type, "resize");
    terminal.userType("fixture-command\r");
    assert.equal(new TextDecoder().decode(socket.sent[1]), "fixture-command\r");
    socket.readyState = 3; socket.handlers.close({ code: 1006 });
    assert.equal(terminal.options.disableStdin, true);
    assert.equal(phases.at(-1), "disconnected");
    terminal.userType("NO_CLOSED_INPUT");
    assert.equal(socket.sent.length, 2);
    assert.ok(output.length);
    cleanup();
  });
}
