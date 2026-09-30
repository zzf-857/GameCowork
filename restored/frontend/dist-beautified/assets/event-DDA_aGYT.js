import { i as d, t as o } from "./core-BhBUY98M.js";
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
  e.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
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
var i;
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
})(i || (i = {}));
async function r(e, n) {
  (window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(e, n),
    await d("plugin:event|unlisten", { event: e, eventId: n }));
}
async function u(e, n, a) {
  var t;
  const f =
    typeof (a == null ? void 0 : a.target) == "string"
      ? { kind: "AnyLabel", label: a.target }
      : (t = a == null ? void 0 : a.target) !== null && t !== void 0
        ? t
        : { kind: "Any" };
  return d("plugin:event|listen", { event: e, target: f, handler: o(n) }).then((l) => async () => r(e, l));
}
async function _(e, n, a) {
  return u(
    e,
    (t) => {
      (r(e, t.id), n(t));
    },
    a,
  );
}
async function c(e, n) {
  await d("plugin:event|emit", { event: e, payload: n });
}
async function D(e, n, a) {
  await d("plugin:event|emit_to", {
    target: typeof e == "string" ? { kind: "AnyLabel", label: e } : e,
    event: n,
    payload: a,
  });
}
export { i as TauriEvent, c as emit, D as emitTo, u as listen, _ as once };
