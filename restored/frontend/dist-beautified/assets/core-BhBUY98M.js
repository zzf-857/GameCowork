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
      (e._sentryDebugIds[n] = "fd9dd8ca-b204-4ed1-a71f-eadfe1386202"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-fd9dd8ca-b204-4ed1-a71f-eadfe1386202"));
  })();
} catch {}
function t(e, n, r, o) {
  if (typeof n == "function" ? e !== n || !0 : !n.has(e))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return r === "m" ? o : r === "a" ? o.call(e) : o ? o.value : n.get(e);
}
function s(e, n, r, o, i) {
  if (typeof n == "function" ? e !== n || !0 : !n.has(e))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (n.set(e, r), r);
}
var d;
const f = "__TAURI_TO_IPC_KEY__";
function u(e, n = !1) {
  return window.__TAURI_INTERNALS__.transformCallback(e, n);
}
async function a(e, n = {}, r) {
  return window.__TAURI_INTERNALS__.invoke(e, n, r);
}
class l {
  get rid() {
    return t(this, d, "f");
  }
  constructor(n) {
    (d.set(this, void 0), s(this, d, n));
  }
  async close() {
    return a("plugin:resources|close", { rid: this.rid });
  }
}
d = new WeakMap();
export { l as R, f as S, a as i, u as t };
