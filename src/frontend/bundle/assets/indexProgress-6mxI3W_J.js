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
      (e._sentryDebugIds[n] = "dd2b7f8b-b29e-4203-a899-b4cca9b3150c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-dd2b7f8b-b29e-4203-a899-b4cca9b3150c"));
  })();
} catch {}
const b = [
  "waiting",
  "bootstrap",
  "discovery",
  "extract",
  "resolve",
  "materialize",
  "vfs_rewrite",
  "finalize",
  "publish",
  "reconcile",
  "sync",
];
function I(e) {
  const n = e == null ? void 0 : e.trim();
  return n && b.includes(n) ? n : null;
}
const l = [
  { key: "waiting", phases: ["waiting"] },
  { key: "extract", phases: ["bootstrap", "discovery", "extract"] },
  { key: "resolve", phases: ["resolve"] },
  { key: "publish", phases: ["materialize", "vfs_rewrite", "finalize", "publish"] },
];
function f(e) {
  var t;
  const n = I(e);
  return n && (t = l.find((i) => i.phases.includes(n))) != null ? t : null;
}
function h(e) {
  const n = f(e);
  if (!n) return 0;
  const t = l.indexOf(n);
  return t === -1 ? 0 : t;
}
function p(e) {
  var n, t;
  return (t = (n = f(e)) == null ? void 0 : n.key) != null ? t : null;
}
function y(e) {
  return { current: h(e) + 1, total: l.length };
}
function g(e) {
  if (!e) return null;
  const n = e.match(/\((\d+)\s*\/\s*(\d+)\)/);
  if (!n) return null;
  const t = Number(n[1]),
    i = Number(n[2]);
  return !Number.isFinite(t) || !Number.isFinite(i) || i <= 0
    ? null
    : { current: t, total: i, fraction: Math.min(Math.max(t / i, 0), 1) };
}
const u = new Set(["extract", "resolve"]);
function S(e, n, t, i) {
  const r = h(t),
    o = l[r],
    a = o != null && o.phases.some((d) => u.has(d));
  if (!n || !a) return { state: { hadFraction: !1, prevPhase: null }, fraction: null, isStageStep: a, stepIndex: r };
  let c = e.hadFraction,
    s = e.prevPhase;
  if ((t !== s && ((s = t), (c = !1)), t && u.has(t))) {
    const d = g(i);
    return d
      ? { state: { hadFraction: !0, prevPhase: s }, fraction: 0.01 + d.fraction * 0.98, isStageStep: a, stepIndex: r }
      : { state: { hadFraction: c, prevPhase: s }, fraction: c ? 0.99 : 0.01, isStageStep: a, stepIndex: r };
  }
  return { state: { hadFraction: c, prevPhase: s }, fraction: 0.01, isStageStep: a, stepIndex: r };
}
function m(e, n, t, i, r) {
  var s;
  const o = (s = r == null ? void 0 : r.hideEdgePercent) != null ? s : !0,
    a = e <= 0 || e >= n - 1,
    c = Math.round(Math.min(Math.max(i, 0), 100));
  return a ? (o ? 0 : c) : t != null ? Math.round(t * 100) : c;
}
export { l as U, y as a, m as b, S as c, p as i, I as n };
