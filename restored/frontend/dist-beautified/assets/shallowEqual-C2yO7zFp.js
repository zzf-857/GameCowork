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
      (e._sentryDebugIds[n] = "da745ba4-4cfc-4ca6-97b3-504acf148d12"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-da745ba4-4cfc-4ca6-97b3-504acf148d12"));
  })();
} catch {}
function l(e, n) {
  return e === n ? e !== 0 || n !== 0 || 1 / e === 1 / n : e !== e && n !== n;
}
function r(e, n) {
  if (l(e, n)) return !0;
  if (typeof e != "object" || e === null || typeof n != "object" || n === null) return !1;
  const t = Object.keys(e),
    d = Object.keys(n);
  if (t.length !== d.length) return !1;
  for (let f = 0; f < t.length; f++)
    if (!Object.prototype.hasOwnProperty.call(n, t[f]) || !l(e[t[f]], n[t[f]])) return !1;
  return !0;
}
export { r as s };
