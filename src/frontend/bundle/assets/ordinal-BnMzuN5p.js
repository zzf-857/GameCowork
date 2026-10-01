import { i as c } from "./init-BSqZKE-v.js";
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
      (e._sentryDebugIds[n] = "c0839ceb-46e2-4e04-982e-08d9636dfb23"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c0839ceb-46e2-4e04-982e-08d9636dfb23"));
  })();
} catch {}
class f extends Map {
  constructor(n, t = g) {
    if ((super(), Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: t } }), n != null))
      for (const [r, i] of n) this.set(r, i);
  }
  get(n) {
    return super.get(u(this, n));
  }
  has(n) {
    return super.has(u(this, n));
  }
  set(n, t) {
    return super.set(l(this, n), t);
  }
  delete(n) {
    return super.delete(a(this, n));
  }
}
function u({ _intern: e, _key: n }, t) {
  const r = n(t);
  return e.has(r) ? e.get(r) : t;
}
function l({ _intern: e, _key: n }, t) {
  const r = n(t);
  return e.has(r) ? e.get(r) : (e.set(r, t), t);
}
function a({ _intern: e, _key: n }, t) {
  const r = n(t);
  return (e.has(r) && ((t = e.get(r)), e.delete(r)), t);
}
function g(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
const d = Symbol("implicit");
function p() {
  var e = new f(),
    n = [],
    t = [],
    r = d;
  function i(o) {
    let s = e.get(o);
    if (s === void 0) {
      if (r !== d) return r;
      e.set(o, (s = n.push(o) - 1));
    }
    return t[s % t.length];
  }
  return (
    (i.domain = function (o) {
      if (!arguments.length) return n.slice();
      ((n = []), (e = new f()));
      for (const s of o) e.has(s) || e.set(s, n.push(s) - 1);
      return i;
    }),
    (i.range = function (o) {
      return arguments.length ? ((t = Array.from(o)), i) : t.slice();
    }),
    (i.unknown = function (o) {
      return arguments.length ? ((r = o), i) : r;
    }),
    (i.copy = function () {
      return p(n, t).unknown(r);
    }),
    c.apply(i, arguments),
    i
  );
}
export { p as o };
