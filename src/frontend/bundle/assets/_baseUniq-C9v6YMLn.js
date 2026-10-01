import { bu as U, d5 as w, d6 as L, bv as sn } from "./registry-BL-NPVNy.js";
import {
  bS as T,
  d9 as Rn,
  da as xn,
  bR as un,
  db as Mn,
  dc as on,
  dd as x,
  bP as N,
  de as mn,
  df as gn,
  dg as Cn,
  dh as E,
  d7 as ln,
  di as R,
  dj as Fn,
  dk as D,
  dl as Dn,
  dm as Gn,
  dn as $,
  bV as Un,
  dp as Nn,
  bQ as Bn,
  dq as Q,
  dr as Kn,
  ds as jn,
  bU as Hn,
  bT as dn,
  d5 as qn,
  dt as m,
} from "./VscTheme-BExNMG_K.js";
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
      (n._sentryDebugIds[e] = "107bbc08-2388-4be3-8f7a-7b8f82daa9f3"),
      (n._sentryDebugIdIdentifier = "sentry-dbid-107bbc08-2388-4be3-8f7a-7b8f82daa9f3"));
  })();
} catch {}
function cn(n, e) {
  for (var r = -1, t = n == null ? 0 : n.length, f = Array(t); ++r < t;) f[r] = e(n[r], r, n);
  return f;
}
var X = w ? w.prototype : void 0,
  J = X ? X.toString : void 0;
function bn(n) {
  if (typeof n == "string") return n;
  if (T(n)) return cn(n, bn) + "";
  if (U(n)) return J ? J.call(n) : "";
  var e = n + "";
  return e == "0" && 1 / n == -1 / 0 ? "-0" : e;
}
function Yn() {}
function pn(n, e) {
  for (var r = -1, t = n == null ? 0 : n.length; ++r < t && e(n[r], r, n) !== !1;);
  return n;
}
function Zn(n, e, r, t) {
  for (var f = n.length, i = r + -1; ++i < f;) if (e(n[i], i, n)) return i;
  return -1;
}
function Qn(n) {
  return n !== n;
}
function Xn(n, e, r) {
  for (var t = r - 1, f = n.length; ++t < f;) if (n[t] === e) return t;
  return -1;
}
function Jn(n, e, r) {
  return e === e ? Xn(n, e, r) : Zn(n, Qn, r);
}
function Wn(n, e) {
  var r = n == null ? 0 : n.length;
  return !!r && Jn(n, e, 0) > -1;
}
function O(n) {
  return un(n) ? Rn(n) : xn(n);
}
var zn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  Vn = /^\w*$/;
function B(n, e) {
  if (T(n)) return !1;
  var r = typeof n;
  return r == "number" || r == "symbol" || r == "boolean" || n == null || U(n)
    ? !0
    : Vn.test(n) || !zn.test(n) || (e != null && n in Object(e));
}
var kn = 500;
function ne(n) {
  var e = Mn(n, function (t) {
      return (r.size === kn && r.clear(), t);
    }),
    r = e.cache;
  return e;
}
var ee = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  re = /\\(\\)?/g,
  te = ne(function (n) {
    var e = [];
    return (
      n.charCodeAt(0) === 46 && e.push(""),
      n.replace(ee, function (r, t, f, i) {
        e.push(f ? i.replace(re, "$1") : t || r);
      }),
      e
    );
  });
function ie(n) {
  return n == null ? "" : bn(n);
}
function yn(n, e) {
  return T(n) ? n : B(n, e) ? [n] : te(ie(n));
}
function M(n) {
  if (typeof n == "string" || U(n)) return n;
  var e = n + "";
  return e == "0" && 1 / n == -1 / 0 ? "-0" : e;
}
function An(n, e) {
  e = yn(e, n);
  for (var r = 0, t = e.length; n != null && r < t;) n = n[M(e[r++])];
  return r && r == t ? n : void 0;
}
function fe(n, e, r) {
  var t = n == null ? void 0 : An(n, e);
  return t === void 0 ? r : t;
}
function K(n, e) {
  for (var r = -1, t = e.length, f = n.length; ++r < t;) n[f + r] = e[r];
  return n;
}
var W = w ? w.isConcatSpreadable : void 0;
function ae(n) {
  return T(n) || on(n) || !!(W && n && n[W]);
}
function wt(n, e, r, t, f) {
  var i = -1,
    a = n.length;
  for (r || (r = ae), f || (f = []); ++i < a;) {
    var s = n[i];
    r(s) ? K(f, s) : t || (f[f.length] = s);
  }
  return f;
}
function se(n, e, r, t) {
  var f = -1,
    i = n == null ? 0 : n.length;
  for (t && i && (r = n[++f]); ++f < i;) r = e(r, n[f], f, n);
  return r;
}
function ue(n, e) {
  return n && x(e, O(e), n);
}
function oe(n, e) {
  return n && x(e, N(e), n);
}
function Tn(n, e) {
  for (var r = -1, t = n == null ? 0 : n.length, f = 0, i = []; ++r < t;) {
    var a = n[r];
    e(a, r, n) && (i[f++] = a);
  }
  return i;
}
function hn() {
  return [];
}
var ge = Object.prototype,
  le = ge.propertyIsEnumerable,
  z = Object.getOwnPropertySymbols,
  j = z
    ? function (n) {
        return n == null
          ? []
          : ((n = Object(n)),
            Tn(z(n), function (e) {
              return le.call(n, e);
            }));
      }
    : hn;
function de(n, e) {
  return x(n, j(n), e);
}
var ce = Object.getOwnPropertySymbols,
  wn = ce
    ? function (n) {
        for (var e = []; n;) (K(e, j(n)), (n = mn(n)));
        return e;
      }
    : hn;
function be(n, e) {
  return x(n, wn(n), e);
}
function _n(n, e, r) {
  var t = e(n);
  return T(n) ? t : K(t, r(n));
}
function G(n) {
  return _n(n, O, j);
}
function pe(n) {
  return _n(n, N, wn);
}
var ye = Object.prototype,
  Ae = ye.hasOwnProperty;
function Te(n) {
  var e = n.length,
    r = new n.constructor(e);
  return (e && typeof n[0] == "string" && Ae.call(n, "index") && ((r.index = n.index), (r.input = n.input)), r);
}
function he(n, e) {
  var r = e ? gn(n.buffer) : n.buffer;
  return new n.constructor(r, n.byteOffset, n.byteLength);
}
var we = /\w*$/;
function _e(n) {
  var e = new n.constructor(n.source, we.exec(n));
  return ((e.lastIndex = n.lastIndex), e);
}
var V = w ? w.prototype : void 0,
  k = V ? V.valueOf : void 0;
function Oe(n) {
  return k ? Object(k.call(n)) : {};
}
var $e = "[object Boolean]",
  Ee = "[object Date]",
  Ie = "[object Map]",
  Se = "[object Number]",
  Pe = "[object RegExp]",
  ve = "[object Set]",
  Le = "[object String]",
  Re = "[object Symbol]",
  xe = "[object ArrayBuffer]",
  Me = "[object DataView]",
  me = "[object Float32Array]",
  Ce = "[object Float64Array]",
  Fe = "[object Int8Array]",
  De = "[object Int16Array]",
  Ge = "[object Int32Array]",
  Ue = "[object Uint8Array]",
  Ne = "[object Uint8ClampedArray]",
  Be = "[object Uint16Array]",
  Ke = "[object Uint32Array]";
function je(n, e, r) {
  var t = n.constructor;
  switch (e) {
    case xe:
      return gn(n);
    case $e:
    case Ee:
      return new t(+n);
    case Me:
      return he(n, r);
    case me:
    case Ce:
    case Fe:
    case De:
    case Ge:
    case Ue:
    case Ne:
    case Be:
    case Ke:
      return Cn(n, r);
    case Ie:
      return new t();
    case Se:
    case Le:
      return new t(n);
    case Pe:
      return _e(n);
    case ve:
      return new t();
    case Re:
      return Oe(n);
  }
}
var He = "[object Map]";
function qe(n) {
  return L(n) && E(n) == He;
}
var nn = R && R.isMap,
  Ye = nn ? ln(nn) : qe,
  Ze = "[object Set]";
function Qe(n) {
  return L(n) && E(n) == Ze;
}
var en = R && R.isSet,
  Xe = en ? ln(en) : Qe,
  Je = 1,
  We = 2,
  ze = 4,
  On = "[object Arguments]",
  Ve = "[object Array]",
  ke = "[object Boolean]",
  nr = "[object Date]",
  er = "[object Error]",
  $n = "[object Function]",
  rr = "[object GeneratorFunction]",
  tr = "[object Map]",
  ir = "[object Number]",
  En = "[object Object]",
  fr = "[object RegExp]",
  ar = "[object Set]",
  sr = "[object String]",
  ur = "[object Symbol]",
  or = "[object WeakMap]",
  gr = "[object ArrayBuffer]",
  lr = "[object DataView]",
  dr = "[object Float32Array]",
  cr = "[object Float64Array]",
  br = "[object Int8Array]",
  pr = "[object Int16Array]",
  yr = "[object Int32Array]",
  Ar = "[object Uint8Array]",
  Tr = "[object Uint8ClampedArray]",
  hr = "[object Uint16Array]",
  wr = "[object Uint32Array]",
  g = {};
g[On] =
  g[Ve] =
  g[gr] =
  g[lr] =
  g[ke] =
  g[nr] =
  g[dr] =
  g[cr] =
  g[br] =
  g[pr] =
  g[yr] =
  g[tr] =
  g[ir] =
  g[En] =
  g[fr] =
  g[ar] =
  g[sr] =
  g[ur] =
  g[Ar] =
  g[Tr] =
  g[hr] =
  g[wr] =
    !0;
g[er] = g[$n] = g[or] = !1;
function C(n, e, r, t, f, i) {
  var a,
    s = e & Je,
    u = e & We,
    c = e & ze;
  if (a !== void 0) return a;
  if (!sn(n)) return n;
  var l = T(n);
  if (l) {
    if (((a = Te(n)), !s)) return Fn(n, a);
  } else {
    var o = E(n),
      d = o == $n || o == rr;
    if (D(n)) return Dn(n, s);
    if (o == En || o == On || (d && !f)) {
      if (((a = u || d ? {} : Gn(n)), !s)) return u ? be(n, oe(a, n)) : de(n, ue(a, n));
    } else {
      if (!g[o]) return f ? n : {};
      a = je(n, o, s);
    }
  }
  i || (i = new $());
  var h = i.get(n);
  if (h) return h;
  (i.set(n, a),
    Xe(n)
      ? n.forEach(function (b) {
          a.add(C(b, e, r, b, n, i));
        })
      : Ye(n) &&
        n.forEach(function (b, p) {
          a.set(p, C(b, e, r, p, n, i));
        }));
  var y = c ? (u ? pe : G) : u ? N : O,
    A = l ? void 0 : y(n);
  return (
    pn(A || n, function (b, p) {
      (A && ((p = b), (b = n[p])), Un(a, p, C(b, e, r, p, n, i)));
    }),
    a
  );
}
var _r = "__lodash_hash_undefined__";
function Or(n) {
  return (this.__data__.set(n, _r), this);
}
function $r(n) {
  return this.__data__.has(n);
}
function I(n) {
  var e = -1,
    r = n == null ? 0 : n.length;
  for (this.__data__ = new Nn(); ++e < r;) this.add(n[e]);
}
I.prototype.add = I.prototype.push = Or;
I.prototype.has = $r;
function Er(n, e) {
  for (var r = -1, t = n == null ? 0 : n.length; ++r < t;) if (e(n[r], r, n)) return !0;
  return !1;
}
function In(n, e) {
  return n.has(e);
}
var Ir = 1,
  Sr = 2;
function Sn(n, e, r, t, f, i) {
  var a = r & Ir,
    s = n.length,
    u = e.length;
  if (s != u && !(a && u > s)) return !1;
  var c = i.get(n),
    l = i.get(e);
  if (c && l) return c == e && l == n;
  var o = -1,
    d = !0,
    h = r & Sr ? new I() : void 0;
  for (i.set(n, e), i.set(e, n); ++o < s;) {
    var y = n[o],
      A = e[o];
    if (t) var b = a ? t(A, y, o, e, n, i) : t(y, A, o, n, e, i);
    if (b !== void 0) {
      if (b) continue;
      d = !1;
      break;
    }
    if (h) {
      if (
        !Er(e, function (p, _) {
          if (!In(h, _) && (y === p || f(y, p, r, t, i))) return h.push(_);
        })
      ) {
        d = !1;
        break;
      }
    } else if (!(y === A || f(y, A, r, t, i))) {
      d = !1;
      break;
    }
  }
  return (i.delete(n), i.delete(e), d);
}
function Pr(n) {
  var e = -1,
    r = Array(n.size);
  return (
    n.forEach(function (t, f) {
      r[++e] = [f, t];
    }),
    r
  );
}
function H(n) {
  var e = -1,
    r = Array(n.size);
  return (
    n.forEach(function (t) {
      r[++e] = t;
    }),
    r
  );
}
var vr = 1,
  Lr = 2,
  Rr = "[object Boolean]",
  xr = "[object Date]",
  Mr = "[object Error]",
  mr = "[object Map]",
  Cr = "[object Number]",
  Fr = "[object RegExp]",
  Dr = "[object Set]",
  Gr = "[object String]",
  Ur = "[object Symbol]",
  Nr = "[object ArrayBuffer]",
  Br = "[object DataView]",
  rn = w ? w.prototype : void 0,
  F = rn ? rn.valueOf : void 0;
function Kr(n, e, r, t, f, i, a) {
  switch (r) {
    case Br:
      if (n.byteLength != e.byteLength || n.byteOffset != e.byteOffset) return !1;
      ((n = n.buffer), (e = e.buffer));
    case Nr:
      return !(n.byteLength != e.byteLength || !i(new Q(n), new Q(e)));
    case Rr:
    case xr:
    case Cr:
      return Bn(+n, +e);
    case Mr:
      return n.name == e.name && n.message == e.message;
    case Fr:
    case Gr:
      return n == e + "";
    case mr:
      var s = Pr;
    case Dr:
      var u = t & vr;
      if ((s || (s = H), n.size != e.size && !u)) return !1;
      var c = a.get(n);
      if (c) return c == e;
      ((t |= Lr), a.set(n, e));
      var l = Sn(s(n), s(e), t, f, i, a);
      return (a.delete(n), l);
    case Ur:
      if (F) return F.call(n) == F.call(e);
  }
  return !1;
}
var jr = 1,
  Hr = Object.prototype,
  qr = Hr.hasOwnProperty;
function Yr(n, e, r, t, f, i) {
  var a = r & jr,
    s = G(n),
    u = s.length,
    c = G(e),
    l = c.length;
  if (u != l && !a) return !1;
  for (var o = u; o--;) {
    var d = s[o];
    if (!(a ? d in e : qr.call(e, d))) return !1;
  }
  var h = i.get(n),
    y = i.get(e);
  if (h && y) return h == e && y == n;
  var A = !0;
  (i.set(n, e), i.set(e, n));
  for (var b = a; ++o < u;) {
    d = s[o];
    var p = n[d],
      _ = e[d];
    if (t) var Z = a ? t(_, p, d, e, n, i) : t(p, _, d, n, e, i);
    if (!(Z === void 0 ? p === _ || f(p, _, r, t, i) : Z)) {
      A = !1;
      break;
    }
    b || (b = d == "constructor");
  }
  if (A && !b) {
    var S = n.constructor,
      P = e.constructor;
    S != P &&
      "constructor" in n &&
      "constructor" in e &&
      !(typeof S == "function" && S instanceof S && typeof P == "function" && P instanceof P) &&
      (A = !1);
  }
  return (i.delete(n), i.delete(e), A);
}
var Zr = 1,
  tn = "[object Arguments]",
  fn = "[object Array]",
  v = "[object Object]",
  Qr = Object.prototype,
  an = Qr.hasOwnProperty;
function Xr(n, e, r, t, f, i) {
  var a = T(n),
    s = T(e),
    u = a ? fn : E(n),
    c = s ? fn : E(e);
  ((u = u == tn ? v : u), (c = c == tn ? v : c));
  var l = u == v,
    o = c == v,
    d = u == c;
  if (d && D(n)) {
    if (!D(e)) return !1;
    ((a = !0), (l = !1));
  }
  if (d && !l) return (i || (i = new $()), a || Kn(n) ? Sn(n, e, r, t, f, i) : Kr(n, e, u, r, t, f, i));
  if (!(r & Zr)) {
    var h = l && an.call(n, "__wrapped__"),
      y = o && an.call(e, "__wrapped__");
    if (h || y) {
      var A = h ? n.value() : n,
        b = y ? e.value() : e;
      return (i || (i = new $()), f(A, b, r, t, i));
    }
  }
  return d ? (i || (i = new $()), Yr(n, e, r, t, f, i)) : !1;
}
function q(n, e, r, t, f) {
  return n === e ? !0 : n == null || e == null || (!L(n) && !L(e)) ? n !== n && e !== e : Xr(n, e, r, t, q, f);
}
var Jr = 1,
  Wr = 2;
function zr(n, e, r, t) {
  var f = r.length,
    i = f;
  if (n == null) return !i;
  for (n = Object(n); f--;) {
    var a = r[f];
    if (a[2] ? a[1] !== n[a[0]] : !(a[0] in n)) return !1;
  }
  for (; ++f < i;) {
    a = r[f];
    var s = a[0],
      u = n[s],
      c = a[1];
    if (a[2]) {
      if (u === void 0 && !(s in n)) return !1;
    } else {
      var l = new $(),
        o;
      if (!(o === void 0 ? q(c, u, Jr | Wr, t, l) : o)) return !1;
    }
  }
  return !0;
}
function Pn(n) {
  return n === n && !sn(n);
}
function Vr(n) {
  for (var e = O(n), r = e.length; r--;) {
    var t = e[r],
      f = n[t];
    e[r] = [t, f, Pn(f)];
  }
  return e;
}
function vn(n, e) {
  return function (r) {
    return r == null ? !1 : r[n] === e && (e !== void 0 || n in Object(r));
  };
}
function kr(n) {
  var e = Vr(n);
  return e.length == 1 && e[0][2]
    ? vn(e[0][0], e[0][1])
    : function (r) {
        return r === n || zr(r, n, e);
      };
}
function nt(n, e) {
  return n != null && e in Object(n);
}
function et(n, e, r) {
  e = yn(e, n);
  for (var t = -1, f = e.length, i = !1; ++t < f;) {
    var a = M(e[t]);
    if (!(i = n != null && r(n, a))) break;
    n = n[a];
  }
  return i || ++t != f ? i : ((f = n == null ? 0 : n.length), !!f && jn(f) && Hn(a, f) && (T(n) || on(n)));
}
function rt(n, e) {
  return n != null && et(n, e, nt);
}
var tt = 1,
  it = 2;
function ft(n, e) {
  return B(n) && Pn(e)
    ? vn(M(n), e)
    : function (r) {
        var t = fe(r, n);
        return t === void 0 && t === e ? rt(r, n) : q(e, t, tt | it);
      };
}
function at(n) {
  return function (e) {
    return e == null ? void 0 : e[n];
  };
}
function st(n) {
  return function (e) {
    return An(e, n);
  };
}
function ut(n) {
  return B(n) ? at(M(n)) : st(n);
}
function Ln(n) {
  return typeof n == "function" ? n : n == null ? dn : typeof n == "object" ? (T(n) ? ft(n[0], n[1]) : kr(n)) : ut(n);
}
function ot(n, e) {
  return n && qn(n, e, O);
}
function gt(n, e) {
  return function (r, t) {
    if (r == null) return r;
    if (!un(r)) return n(r, t);
    for (var f = r.length, i = -1, a = Object(r); ++i < f && t(a[i], i, a) !== !1;);
    return r;
  };
}
var Y = gt(ot);
function lt(n) {
  return typeof n == "function" ? n : dn;
}
function _t(n, e) {
  var r = T(n) ? pn : Y;
  return r(n, lt(e));
}
function dt(n, e) {
  var r = [];
  return (
    Y(n, function (t, f, i) {
      e(t, f, i) && r.push(t);
    }),
    r
  );
}
function Ot(n, e) {
  var r = T(n) ? Tn : dt;
  return r(n, Ln(e));
}
function ct(n, e) {
  return cn(e, function (r) {
    return n[r];
  });
}
function $t(n) {
  return n == null ? [] : ct(n, O(n));
}
function Et(n) {
  return n === void 0;
}
function bt(n, e, r, t, f) {
  return (
    f(n, function (i, a, s) {
      r = t ? ((t = !1), i) : e(r, i, a, s);
    }),
    r
  );
}
function It(n, e, r) {
  var t = T(n) ? se : bt,
    f = arguments.length < 3;
  return t(n, Ln(e), r, f, Y);
}
var pt = 1 / 0,
  yt =
    m && 1 / H(new m([, -0]))[1] == pt
      ? function (n) {
          return new m(n);
        }
      : Yn,
  At = 200;
function St(n, e, r) {
  var t = -1,
    f = Wn,
    i = n.length,
    a = !0,
    s = [],
    u = s;
  if (i >= At) {
    var c = e ? null : yt(n);
    if (c) return H(c);
    ((a = !1), (f = In), (u = new I()));
  } else u = e ? [] : s;
  n: for (; ++t < i;) {
    var l = n[t],
      o = e ? e(l) : l;
    if (((l = l !== 0 ? l : 0), a && o === o)) {
      for (var d = u.length; d--;) if (u[d] === o) continue n;
      (e && u.push(o), s.push(l));
    } else f(u, o, r) || (u !== s && u.push(o), s.push(l));
  }
  return s;
}
export {
  dt as A,
  Er as B,
  Yn as C,
  I as S,
  St as a,
  C as b,
  wt as c,
  _t as d,
  Ln as e,
  Ot as f,
  Zn as g,
  Y as h,
  Et as i,
  cn as j,
  O as k,
  et as l,
  yn as m,
  An as n,
  lt as o,
  ot as p,
  rt as q,
  It as r,
  ie as s,
  M as t,
  Wn as u,
  $t as v,
  In as w,
  Jn as x,
  pe as y,
  Tn as z,
};
