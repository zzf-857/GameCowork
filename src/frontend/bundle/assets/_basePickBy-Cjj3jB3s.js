import {
  c as I,
  e as b,
  k as m,
  g as w,
  h as x,
  j as y,
  l as p,
  m as g,
  t as O,
  n as P,
} from "./_baseUniq-C9v6YMLn.js";
import {
  aS as _,
  bO as E,
  bP as c,
  bQ as T,
  bR as h,
  bS as S,
  bT as A,
  bU as F,
  bV as M,
} from "./VscTheme-BExNMG_K.js";
import { bt as N, bu as R, bv as o } from "./registry-BL-NPVNy.js";
(function () {
  var n =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  n.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var n =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      e = new n.Error().stack;
    e &&
      ((n._sentryDebugIds = n._sentryDebugIds || {}),
      (n._sentryDebugIds[e] = "27eb88e6-4421-46c5-9fd1-f33f0f2e7145"),
      (n._sentryDebugIdIdentifier = "sentry-dbid-27eb88e6-4421-46c5-9fd1-f33f0f2e7145"));
  })();
} catch {}
var D = 1 / 0,
  L = 17976931348623157e292;
function G(n) {
  if (!n) return n === 0 ? n : 0;
  if (((n = N(n)), n === D || n === -1 / 0)) {
    var e = n < 0 ? -1 : 1;
    return e * L;
  }
  return n === n ? n : 0;
}
function Y(n) {
  var e = G(n),
    t = e % 1;
  return e === e ? (t ? e - t : e) : 0;
}
function k(n) {
  var e = n == null ? 0 : n.length;
  return e ? I(n) : [];
}
var v = Object.prototype,
  $ = v.hasOwnProperty,
  j = _(function (n, e) {
    n = Object(n);
    var t = -1,
      i = e.length,
      r = i > 2 ? e[2] : void 0;
    for (r && E(e[0], e[1], r) && (i = 1); ++t < i;)
      for (var s = e[t], a = c(s), f = -1, d = a.length; ++f < d;) {
        var u = a[f],
          l = n[u];
        (l === void 0 || (T(l, v[u]) && !$.call(n, u))) && (n[u] = s[u]);
      }
    return n;
  });
function nn(n) {
  var e = n == null ? 0 : n.length;
  return e ? n[e - 1] : void 0;
}
function q(n) {
  return function (e, t, i) {
    var r = Object(e);
    if (!h(e)) {
      var s = b(t);
      ((e = m(e)),
        (t = function (f) {
          return s(r[f], f, r);
        }));
    }
    var a = n(e, t, i);
    return a > -1 ? r[s ? e[a] : a] : void 0;
  };
}
var z = Math.max;
function B(n, e, t) {
  var i = n == null ? 0 : n.length;
  if (!i) return -1;
  var r = t == null ? 0 : Y(t);
  return (r < 0 && (r = z(i + r, 0)), w(n, b(e), r));
}
var en = q(B);
function C(n, e) {
  var t = -1,
    i = h(n) ? Array(n.length) : [];
  return (
    x(n, function (r, s, a) {
      i[++t] = e(r, s, a);
    }),
    i
  );
}
function tn(n, e) {
  var t = S(n) ? y : C;
  return t(n, b(e));
}
var H = Object.prototype,
  K = H.hasOwnProperty;
function Q(n, e) {
  return n != null && K.call(n, e);
}
function rn(n, e) {
  return n != null && p(n, e, Q);
}
function U(n, e) {
  return n < e;
}
function X(n, e, t) {
  for (var i = -1, r = n.length; ++i < r;) {
    var s = n[i],
      a = e(s);
    if (a != null && (f === void 0 ? a === a && !R(a) : t(a, f)))
      var f = a,
        d = s;
  }
  return d;
}
function an(n) {
  return n && n.length ? X(n, A, U) : void 0;
}
function J(n, e, t, i) {
  if (!o(n)) return n;
  e = g(e, n);
  for (var r = -1, s = e.length, a = s - 1, f = n; f != null && ++r < s;) {
    var d = O(e[r]),
      u = t;
    if (d === "__proto__" || d === "constructor" || d === "prototype") return n;
    if (r != a) {
      var l = f[d];
      ((u = void 0), u === void 0 && (u = o(l) ? l : F(e[r + 1]) ? [] : {}));
    }
    (M(f, d, u), (f = f[d]));
  }
  return n;
}
function fn(n, e, t) {
  for (var i = -1, r = e.length, s = {}; ++i < r;) {
    var a = e[i],
      f = P(n, a);
    t(f, a) && J(s, g(a, n), f);
  }
  return s;
}
export { U as a, X as b, C as c, fn as d, an as e, k as f, en as g, rn as h, j as i, Y as j, nn as l, tn as m, G as t };
