import { i, t as o } from "./core-BtpCLyE5.js";
(function () {
  var e =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  e.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var e =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "a98adb2f-c155-45a8-89f8-36a26633feff"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-a98adb2f-c155-45a8-89f8-36a26633feff"));
  })();
} catch {}
var d;
(function (e) {
  ((e.WINDOW_RESIZED = "tauri://resize"),
    (e.WINDOW_MOVED = "tauri://move"),
    (e.WINDOW_CLOSE_REQUESTED = "tauri://close-requested"),
    (e.WINDOW_DESTROYED = "tauri://destroyed"),
    (e.WINDOW_FOCUS = "tauri://focus"),
    (e.WINDOW_BLUR = "tauri://blur"),
    (e.WINDOW_SCALE_FACTOR_CHANGED = "tauri://scale-change"),
    (e.WINDOW_THEME_CHANGED = "tauri://theme-changed"),
    (e.WINDOW_CREATED = "tauri://window-created"),
    (e.WINDOW_SUSPENDED = "tauri://suspended"),
    (e.WINDOW_RESUMED = "tauri://resumed"),
    (e.WEBVIEW_CREATED = "tauri://webview-created"),
    (e.DRAG_ENTER = "tauri://drag-enter"),
    (e.DRAG_OVER = "tauri://drag-over"),
    (e.DRAG_DROP = "tauri://drag-drop"),
    (e.DRAG_LEAVE = "tauri://drag-leave"));
})(d || (d = {}));
async function r(e, n) {
  (window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(e, n),
    await i("plugin:event|unlisten", { event: e, eventId: n }));
}
async function u(e, n, t) {
  var a;
  const f =
    typeof (t == null ? void 0 : t.target) == "string"
      ? { kind: "AnyLabel", label: t.target }
      : (a = t == null ? void 0 : t.target) !== null && a !== void 0
        ? a
        : { kind: "Any" };
  return i("plugin:event|listen", { event: e, target: f, handler: o(n) }).then((l) => async () => r(e, l));
}
async function c(e, n, t) {
  return u(
    e,
    (a) => {
      (r(e, a.id), n(a));
    },
    t,
  );
}
async function _(e, n) {
  await i("plugin:event|emit", { event: e, payload: n });
}
async function D(e, n, t) {
  await i("plugin:event|emit_to", {
    target: typeof e == "string" ? { kind: "AnyLabel", label: e } : e,
    event: n,
    payload: t,
  });
}
export { d as TauriEvent, _ as emit, D as emitTo, u as listen, c as once };
