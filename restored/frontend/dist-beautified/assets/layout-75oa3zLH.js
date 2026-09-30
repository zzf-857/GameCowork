import {
  d7 as B,
  d8 as y,
  d9 as ye,
  da as Y,
  db as U,
  dc as Ye,
  dd as oe,
  de as Ue,
  df as In,
  dg as We,
  dh as _n,
  di as kn,
  dj as Cn,
  dk as ue,
  dl as jn,
  dm as An,
  dn as xe,
  dp as Oe,
  dq as de,
  dr as fe,
  ds as D,
  dt as qe,
  du as Xe,
  dv as Mn,
  dw as Rn,
  dx as T,
  dy as Sn,
  dz as $n,
  dA as Ee,
  dB as Fn,
  dC as He,
  dD as N,
  dE as Bn,
  dF as Dn,
  dG as Gn,
  dH as S,
  dI as Ke,
  dJ as ze,
  dK as Vn,
  dL as se,
  dM as Je,
  dN as Yn,
  dO as Qe,
  dP as Un,
  dQ as Wn,
  V as x,
  dR as c,
  dS as qn,
  dT as m,
  dU as M,
  dV as P,
  dW as W,
} from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[n] = "aba20d97-86a2-4f92-a49c-a229ffb4f9b4"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-aba20d97-86a2-4f92-a49c-a229ffb4f9b4"));
  })();
} catch {}
var Xn = /\s/;
function Hn(e) {
  for (var n = e.length; n-- && Xn.test(e.charAt(n)););
  return n;
}
var Kn = /^\s+/;
function zn(e) {
  return e && e.slice(0, Hn(e) + 1).replace(Kn, "");
}
var Te = NaN,
  Jn = /^[-+]0x[0-9a-f]+$/i,
  Qn = /^0b[01]+$/i,
  Zn = /^0o[0-7]+$/i,
  er = parseInt;
function nr(e) {
  if (typeof e == "number") return e;
  if (B(e)) return Te;
  if (y(e)) {
    var n = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = y(n) ? n + "" : n;
  }
  if (typeof e != "string") return e === 0 ? e : +e;
  e = zn(e);
  var r = Qn.test(e);
  return r || Zn.test(e) ? er(e.slice(2), r ? 2 : 8) : Jn.test(e) ? Te : +e;
}
var rr = 1 / 0,
  tr = 17976931348623157e292;
function $(e) {
  if (!e) return e === 0 ? e : 0;
  if (((e = nr(e)), e === rr || e === -1 / 0)) {
    var n = e < 0 ? -1 : 1;
    return n * tr;
  }
  return e === e ? e : 0;
}
function ir(e) {
  var n = $(e),
    r = n % 1;
  return n === n ? (r ? n - r : n) : 0;
}
var Pe = Object.create,
  ar = (function () {
    function e() {}
    return function (n) {
      if (!y(n)) return {};
      if (Pe) return Pe(n);
      e.prototype = n;
      var r = new e();
      return ((e.prototype = void 0), r);
    };
  })();
function or(e, n) {
  var r = -1,
    t = e.length;
  for (n || (n = Array(t)); ++r < t;) n[r] = e[r];
  return n;
}
function q(e, n, r) {
  n == "__proto__" && ye ? ye(e, n, { configurable: !0, enumerable: !0, value: r, writable: !0 }) : (e[n] = r);
}
var ur = Object.prototype,
  dr = ur.hasOwnProperty;
function X(e, n, r) {
  var t = e[n];
  (!(dr.call(e, n) && Y(t, r)) || (r === void 0 && !(n in e))) && q(e, n, r);
}
function fr(e, n, r, t) {
  var i = !r;
  r || (r = {});
  for (var o = -1, a = n.length; ++o < a;) {
    var u = n[o],
      d = void 0;
    (d === void 0 && (d = e[u]), i ? q(r, u, d) : X(r, u, d));
  }
  return r;
}
function C(e, n, r) {
  if (!y(r)) return !1;
  var t = typeof n;
  return (t == "number" ? U(r) && Ye(n, r.length) : t == "string" && n in r) ? Y(r[n], e) : !1;
}
function sr(e) {
  return oe(function (n, r) {
    var t = -1,
      i = r.length,
      o = i > 1 ? r[i - 1] : void 0,
      a = i > 2 ? r[2] : void 0;
    for (
      o = e.length > 3 && typeof o == "function" ? (i--, o) : void 0,
        a && C(r[0], r[1], a) && ((o = i < 3 ? void 0 : o), (i = 1)),
        n = Object(n);
      ++t < i;
    ) {
      var u = r[t];
      u && e(n, u, t, o);
    }
    return n;
  });
}
function cr(e) {
  var n = [];
  if (e != null) for (var r in Object(e)) n.push(r);
  return n;
}
var lr = Object.prototype,
  hr = lr.hasOwnProperty;
function vr(e) {
  if (!y(e)) return cr(e);
  var n = Ue(e),
    r = [];
  for (var t in e) (t == "constructor" && (n || !hr.call(e, t))) || r.push(t);
  return r;
}
function H(e) {
  return U(e) ? In(e, !0) : vr(e);
}
function I(e) {
  var n = e == null ? 0 : e.length;
  return n ? We(e) : [];
}
function pr(e) {
  return _n(kn(e, void 0, I), e + "");
}
var Ze = Cn(Object.getPrototypeOf, Object),
  br = "[object Object]",
  wr = Function.prototype,
  gr = Object.prototype,
  en = wr.toString,
  mr = gr.hasOwnProperty,
  yr = en.call(Object);
function xr(e) {
  if (!ue(e) || jn(e) != br) return !1;
  var n = Ze(e);
  if (n === null) return !0;
  var r = mr.call(n, "constructor") && n.constructor;
  return typeof r == "function" && r instanceof r && en.call(r) == yr;
}
var nn = typeof exports == "object" && exports && !exports.nodeType && exports,
  Le = nn && typeof module == "object" && module && !module.nodeType && module,
  Or = Le && Le.exports === nn,
  Ne = Or ? An.Buffer : void 0,
  Ie = Ne ? Ne.allocUnsafe : void 0;
function rn(e, n) {
  if (n) return e.slice();
  var r = e.length,
    t = Ie ? Ie(r) : new e.constructor(r);
  return (e.copy(t), t);
}
var Er = Object.prototype,
  Tr = Er.hasOwnProperty;
function Pr(e) {
  var n = e.length,
    r = new e.constructor(n);
  return (n && typeof e[0] == "string" && Tr.call(e, "index") && ((r.index = e.index), (r.input = e.input)), r);
}
function ce(e) {
  var n = new e.constructor(e.byteLength);
  return (new xe(n).set(new xe(e)), n);
}
function Lr(e, n) {
  var r = ce(e.buffer);
  return new e.constructor(r, e.byteOffset, e.byteLength);
}
var Nr = /\w*$/;
function Ir(e) {
  var n = new e.constructor(e.source, Nr.exec(e));
  return ((n.lastIndex = e.lastIndex), n);
}
var _e = Oe ? Oe.prototype : void 0,
  ke = _e ? _e.valueOf : void 0;
function _r(e) {
  return ke ? Object(ke.call(e)) : {};
}
function tn(e, n) {
  var r = n ? ce(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.length);
}
var kr = "[object Boolean]",
  Cr = "[object Date]",
  jr = "[object Map]",
  Ar = "[object Number]",
  Mr = "[object RegExp]",
  Rr = "[object Set]",
  Sr = "[object String]",
  $r = "[object Symbol]",
  Fr = "[object ArrayBuffer]",
  Br = "[object DataView]",
  Dr = "[object Float32Array]",
  Gr = "[object Float64Array]",
  Vr = "[object Int8Array]",
  Yr = "[object Int16Array]",
  Ur = "[object Int32Array]",
  Wr = "[object Uint8Array]",
  qr = "[object Uint8ClampedArray]",
  Xr = "[object Uint16Array]",
  Hr = "[object Uint32Array]";
function Kr(e, n, r) {
  var t = e.constructor;
  switch (n) {
    case Fr:
      return ce(e);
    case kr:
    case Cr:
      return new t(+e);
    case Br:
      return Lr(e);
    case Dr:
    case Gr:
    case Vr:
    case Yr:
    case Ur:
    case Wr:
    case qr:
    case Xr:
    case Hr:
      return tn(e, r);
    case jr:
      return new t();
    case Ar:
    case Sr:
      return new t(e);
    case Mr:
      return Ir(e);
    case Rr:
      return new t();
    case $r:
      return _r(e);
  }
}
function an(e) {
  return typeof e.constructor == "function" && !Ue(e) ? ar(Ze(e)) : {};
}
var zr = "[object Map]";
function Jr(e) {
  return ue(e) && de(e) == zr;
}
var Ce = D && D.isMap,
  Qr = Ce ? fe(Ce) : Jr,
  Zr = "[object Set]";
function et(e) {
  return ue(e) && de(e) == Zr;
}
var je = D && D.isSet,
  nt = je ? fe(je) : et,
  rt = 1,
  on = "[object Arguments]",
  tt = "[object Array]",
  it = "[object Boolean]",
  at = "[object Date]",
  ot = "[object Error]",
  un = "[object Function]",
  ut = "[object GeneratorFunction]",
  dt = "[object Map]",
  ft = "[object Number]",
  dn = "[object Object]",
  st = "[object RegExp]",
  ct = "[object Set]",
  lt = "[object String]",
  ht = "[object Symbol]",
  vt = "[object WeakMap]",
  pt = "[object ArrayBuffer]",
  bt = "[object DataView]",
  wt = "[object Float32Array]",
  gt = "[object Float64Array]",
  mt = "[object Int8Array]",
  yt = "[object Int16Array]",
  xt = "[object Int32Array]",
  Ot = "[object Uint8Array]",
  Et = "[object Uint8ClampedArray]",
  Tt = "[object Uint16Array]",
  Pt = "[object Uint32Array]",
  b = {};
b[on] =
  b[tt] =
  b[pt] =
  b[bt] =
  b[it] =
  b[at] =
  b[wt] =
  b[gt] =
  b[mt] =
  b[yt] =
  b[xt] =
  b[dt] =
  b[ft] =
  b[dn] =
  b[st] =
  b[ct] =
  b[lt] =
  b[ht] =
  b[Ot] =
  b[Et] =
  b[Tt] =
  b[Pt] =
    !0;
b[ot] = b[un] = b[vt] = !1;
function F(e, n, r, t, i, o) {
  var a,
    u = n & rt;
  if (a !== void 0) return a;
  if (!y(e)) return e;
  var d = T(e);
  if (d) a = Pr(e);
  else {
    var f = de(e),
      s = f == un || f == ut;
    if (qe(e)) return rn(e, u);
    if (f == dn || f == on || (s && !i)) a = s ? {} : an(e);
    else {
      if (!b[f]) return i ? e : {};
      a = Kr(e, f, u);
    }
  }
  o || (o = new Xe());
  var l = o.get(e);
  if (l) return l;
  (o.set(e, a),
    nt(e)
      ? e.forEach(function (v) {
          a.add(F(v, n, r, v, e, o));
        })
      : Qr(e) &&
        e.forEach(function (v, w) {
          a.set(w, F(v, n, r, w, e, o));
        }));
  var h = Mn,
    p = d ? void 0 : h(e);
  return (
    Rn(p || e, function (v, w) {
      (p && ((w = v), (v = e[w])), X(a, w, F(v, n, r, w, e, o)));
    }),
    a
  );
}
var Lt = 1,
  Nt = 4;
function It(e) {
  return F(e, Lt | Nt);
}
var fn = Object.prototype,
  _t = fn.hasOwnProperty,
  kt = oe(function (e, n) {
    e = Object(e);
    var r = -1,
      t = n.length,
      i = t > 2 ? n[2] : void 0;
    for (i && C(n[0], n[1], i) && (t = 1); ++r < t;)
      for (var o = n[r], a = H(o), u = -1, d = a.length; ++u < d;) {
        var f = a[u],
          s = e[f];
        (s === void 0 || (Y(s, fn[f]) && !_t.call(e, f))) && (e[f] = o[f]);
      }
    return e;
  });
function re(e, n, r) {
  ((r !== void 0 && !Y(e[n], r)) || (r === void 0 && !(n in e))) && q(e, n, r);
}
function te(e, n) {
  if (!(n === "constructor" && typeof e[n] == "function") && n != "__proto__") return e[n];
}
function Ct(e) {
  return fr(e, H(e));
}
function jt(e, n, r, t, i, o, a) {
  var u = te(e, r),
    d = te(n, r),
    f = a.get(d);
  if (f) {
    re(e, r, f);
    return;
  }
  var s = o ? o(u, d, r + "", e, n, a) : void 0,
    l = s === void 0;
  if (l) {
    var h = T(d),
      p = !h && qe(d),
      v = !h && !p && Sn(d);
    ((s = d),
      h || p || v
        ? T(u)
          ? (s = u)
          : $n(u)
            ? (s = or(u))
            : p
              ? ((l = !1), (s = rn(d, !0)))
              : v
                ? ((l = !1), (s = tn(d, !0)))
                : (s = [])
        : xr(d) || Ee(d)
          ? ((s = u), Ee(u) ? (s = Ct(u)) : (!y(u) || Fn(u)) && (s = an(d)))
          : (l = !1));
  }
  (l && (a.set(d, s), i(s, d, t, o, a), a.delete(d)), re(e, r, s));
}
function sn(e, n, r, t, i) {
  e !== n &&
    He(
      n,
      function (o, a) {
        if ((i || (i = new Xe()), y(o))) jt(e, n, a, r, sn, t, i);
        else {
          var u = t ? t(te(e, a), o, a + "", e, n, i) : void 0;
          (u === void 0 && (u = o), re(e, a, u));
        }
      },
      H,
    );
}
function G(e) {
  var n = e == null ? 0 : e.length;
  return n ? e[n - 1] : void 0;
}
function At(e) {
  return function (n, r, t) {
    var i = Object(n);
    if (!U(n)) {
      var o = N(r);
      ((n = Bn(n)),
        (r = function (u) {
          return o(i[u], u, i);
        }));
    }
    var a = e(n, r, t);
    return a > -1 ? i[o ? n[a] : a] : void 0;
  };
}
var Mt = Math.max;
function Rt(e, n, r) {
  var t = e == null ? 0 : e.length;
  if (!t) return -1;
  var i = r == null ? 0 : ir(r);
  return (i < 0 && (i = Mt(t + i, 0)), Dn(e, N(n), i));
}
var le = At(Rt);
function cn(e, n) {
  var r = -1,
    t = U(e) ? Array(e.length) : [];
  return (
    Gn(e, function (i, o, a) {
      t[++r] = n(i, o, a);
    }),
    t
  );
}
function g(e, n) {
  var r = T(e) ? S : cn;
  return r(e, N(n));
}
function St(e, n) {
  return e == null ? e : He(e, Ke(n), H);
}
function $t(e, n) {
  return e && ze(e, Ke(n));
}
function Ft(e, n) {
  return e > n;
}
var Bt = Object.prototype,
  Dt = Bt.hasOwnProperty;
function Gt(e, n) {
  return e != null && Dt.call(e, n);
}
function ln(e, n) {
  return e != null && Vn(e, n, Gt);
}
function hn(e, n) {
  return e < n;
}
function K(e, n) {
  var r = {};
  return (
    (n = N(n)),
    ze(e, function (t, i, o) {
      q(r, i, n(t, i, o));
    }),
    r
  );
}
function he(e, n, r) {
  for (var t = -1, i = e.length; ++t < i;) {
    var o = e[t],
      a = n(o);
    if (a != null && (u === void 0 ? a === a && !B(a) : r(a, u)))
      var u = a,
        d = o;
  }
  return d;
}
function O(e) {
  return e && e.length ? he(e, se, Ft) : void 0;
}
var ie = sr(function (e, n, r) {
  sn(e, n, r);
});
function j(e) {
  return e && e.length ? he(e, se, hn) : void 0;
}
function ve(e, n) {
  return e && e.length ? he(e, N(n), hn) : void 0;
}
function Vt(e, n, r, t) {
  if (!y(e)) return e;
  n = Je(n, e);
  for (var i = -1, o = n.length, a = o - 1, u = e; u != null && ++i < o;) {
    var d = Yn(n[i]),
      f = r;
    if (d === "__proto__" || d === "constructor" || d === "prototype") return e;
    if (i != a) {
      var s = u[d];
      ((f = void 0), f === void 0 && (f = y(s) ? s : Ye(n[i + 1]) ? [] : {}));
    }
    (X(u, d, f), (u = u[d]));
  }
  return e;
}
function Yt(e, n, r) {
  for (var t = -1, i = n.length, o = {}; ++t < i;) {
    var a = n[t],
      u = Qe(e, a);
    r(u, a) && Vt(o, Je(a, e), u);
  }
  return o;
}
function Ut(e, n) {
  var r = e.length;
  for (e.sort(n); r--;) e[r] = e[r].value;
  return e;
}
function Wt(e, n) {
  if (e !== n) {
    var r = e !== void 0,
      t = e === null,
      i = e === e,
      o = B(e),
      a = n !== void 0,
      u = n === null,
      d = n === n,
      f = B(n);
    if ((!u && !f && !o && e > n) || (o && a && d && !u && !f) || (t && a && d) || (!r && d) || !i) return 1;
    if ((!t && !o && !f && e < n) || (f && r && i && !t && !o) || (u && r && i) || (!a && i) || !d) return -1;
  }
  return 0;
}
function qt(e, n, r) {
  for (var t = -1, i = e.criteria, o = n.criteria, a = i.length, u = r.length; ++t < a;) {
    var d = Wt(i[t], o[t]);
    if (d) {
      if (t >= u) return d;
      var f = r[t];
      return d * (f == "desc" ? -1 : 1);
    }
  }
  return e.index - n.index;
}
function Xt(e, n, r) {
  n.length
    ? (n = S(n, function (o) {
        return T(o)
          ? function (a) {
              return Qe(a, o.length === 1 ? o[0] : o);
            }
          : o;
      }))
    : (n = [se]);
  var t = -1;
  n = S(n, fe(N));
  var i = cn(e, function (o, a, u) {
    var d = S(n, function (f) {
      return f(o);
    });
    return { criteria: d, index: ++t, value: o };
  });
  return Ut(i, function (o, a) {
    return qt(o, a, r);
  });
}
function Ht(e, n) {
  return Yt(e, n, function (r, t) {
    return Un(e, t);
  });
}
var V = pr(function (e, n) {
    return e == null ? {} : Ht(e, n);
  }),
  Kt = Math.ceil,
  zt = Math.max;
function Jt(e, n, r, t) {
  for (var i = -1, o = zt(Kt((n - e) / (r || 1)), 0), a = Array(o); o--;) ((a[++i] = e), (e += r));
  return a;
}
function Qt(e) {
  return function (n, r, t) {
    return (
      t && typeof t != "number" && C(n, r, t) && (r = t = void 0),
      (n = $(n)),
      r === void 0 ? ((r = n), (n = 0)) : (r = $(r)),
      (t = t === void 0 ? (n < r ? 1 : -1) : $(t)),
      Jt(n, r, t)
    );
  };
}
var L = Qt(),
  R = oe(function (e, n) {
    if (e == null) return [];
    var r = n.length;
    return (r > 1 && C(e, n[0], n[1]) ? (n = []) : r > 2 && C(n[0], n[1], n[2]) && (n = [n[0]]), Xt(e, We(n), []));
  }),
  Zt = 0;
function pe(e) {
  var n = ++Zt;
  return Wn(e) + n;
}
function ei(e, n, r) {
  for (var t = -1, i = e.length, o = n.length, a = {}; ++t < i;) {
    var u = t < o ? n[t] : void 0;
    r(a, e[t], u);
  }
  return a;
}
function ni(e, n) {
  return ei(e || [], n || [], X);
}
class ri {
  constructor() {
    var n = {};
    ((n._next = n._prev = n), (this._sentinel = n));
  }
  dequeue() {
    var n = this._sentinel,
      r = n._prev;
    if (r !== n) return (Ae(r), r);
  }
  enqueue(n) {
    var r = this._sentinel;
    (n._prev && n._next && Ae(n), (n._next = r._next), (r._next._prev = n), (r._next = n), (n._prev = r));
  }
  toString() {
    for (var n = [], r = this._sentinel, t = r._prev; t !== r;) (n.push(JSON.stringify(t, ti)), (t = t._prev));
    return "[" + n.join(", ") + "]";
  }
}
function Ae(e) {
  ((e._prev._next = e._next), (e._next._prev = e._prev), delete e._next, delete e._prev);
}
function ti(e, n) {
  if (e !== "_next" && e !== "_prev") return n;
}
var ii = qn(1);
function ai(e, n) {
  if (e.nodeCount() <= 1) return [];
  var r = ui(e, n || ii),
    t = oi(r.graph, r.buckets, r.zeroIdx);
  return I(
    g(t, function (i) {
      return e.outEdges(i.v, i.w);
    }),
  );
}
function oi(e, n, r) {
  for (var t = [], i = n[n.length - 1], o = n[0], a; e.nodeCount();) {
    for (; (a = o.dequeue());) J(e, n, r, a);
    for (; (a = i.dequeue());) J(e, n, r, a);
    if (e.nodeCount()) {
      for (var u = n.length - 2; u > 0; --u)
        if (((a = n[u].dequeue()), a)) {
          t = t.concat(J(e, n, r, a, !0));
          break;
        }
    }
  }
  return t;
}
function J(e, n, r, t, i) {
  var o = i ? [] : void 0;
  return (
    c(e.inEdges(t.v), function (a) {
      var u = e.edge(a),
        d = e.node(a.v);
      (i && o.push({ v: a.v, w: a.w }), (d.out -= u), ae(n, r, d));
    }),
    c(e.outEdges(t.v), function (a) {
      var u = e.edge(a),
        d = a.w,
        f = e.node(d);
      ((f.in -= u), ae(n, r, f));
    }),
    e.removeNode(t.v),
    o
  );
}
function ui(e, n) {
  var r = new x(),
    t = 0,
    i = 0;
  (c(e.nodes(), function (u) {
    r.setNode(u, { v: u, in: 0, out: 0 });
  }),
    c(e.edges(), function (u) {
      var d = r.edge(u.v, u.w) || 0,
        f = n(u),
        s = d + f;
      (r.setEdge(u.v, u.w, s), (i = Math.max(i, (r.node(u.v).out += f))), (t = Math.max(t, (r.node(u.w).in += f))));
    }));
  var o = L(i + t + 3).map(function () {
      return new ri();
    }),
    a = t + 1;
  return (
    c(r.nodes(), function (u) {
      ae(o, a, r.node(u));
    }),
    { graph: r, buckets: o, zeroIdx: a }
  );
}
function ae(e, n, r) {
  r.out ? (r.in ? e[r.out - r.in + n].enqueue(r) : e[e.length - 1].enqueue(r)) : e[0].enqueue(r);
}
function di(e) {
  var n = e.graph().acyclicer === "greedy" ? ai(e, r(e)) : fi(e);
  c(n, function (t) {
    var i = e.edge(t);
    (e.removeEdge(t), (i.forwardName = t.name), (i.reversed = !0), e.setEdge(t.w, t.v, i, pe("rev")));
  });
  function r(t) {
    return function (i) {
      return t.edge(i).weight;
    };
  }
}
function fi(e) {
  var n = [],
    r = {},
    t = {};
  function i(o) {
    Object.prototype.hasOwnProperty.call(t, o) ||
      ((t[o] = !0),
      (r[o] = !0),
      c(e.outEdges(o), function (a) {
        Object.prototype.hasOwnProperty.call(r, a.w) ? n.push(a) : i(a.w);
      }),
      delete r[o]);
  }
  return (c(e.nodes(), i), n);
}
function si(e) {
  c(e.edges(), function (n) {
    var r = e.edge(n);
    if (r.reversed) {
      e.removeEdge(n);
      var t = r.forwardName;
      (delete r.reversed, delete r.forwardName, e.setEdge(n.w, n.v, r, t));
    }
  });
}
function _(e, n, r, t) {
  var i;
  do i = pe(t);
  while (e.hasNode(i));
  return ((r.dummy = n), e.setNode(i, r), i);
}
function ci(e) {
  var n = new x().setGraph(e.graph());
  return (
    c(e.nodes(), function (r) {
      n.setNode(r, e.node(r));
    }),
    c(e.edges(), function (r) {
      var t = n.edge(r.v, r.w) || { weight: 0, minlen: 1 },
        i = e.edge(r);
      n.setEdge(r.v, r.w, { weight: t.weight + i.weight, minlen: Math.max(t.minlen, i.minlen) });
    }),
    n
  );
}
function vn(e) {
  var n = new x({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return (
    c(e.nodes(), function (r) {
      e.children(r).length || n.setNode(r, e.node(r));
    }),
    c(e.edges(), function (r) {
      n.setEdge(r, e.edge(r));
    }),
    n
  );
}
function Me(e, n) {
  var r = e.x,
    t = e.y,
    i = n.x - r,
    o = n.y - t,
    a = e.width / 2,
    u = e.height / 2;
  if (!i && !o) throw new Error("Not possible to find intersection inside of the rectangle");
  var d, f;
  return (
    Math.abs(o) * a > Math.abs(i) * u
      ? (o < 0 && (u = -u), (d = (u * i) / o), (f = u))
      : (i < 0 && (a = -a), (d = a), (f = (a * o) / i)),
    { x: r + d, y: t + f }
  );
}
function z(e) {
  var n = g(L(pn(e) + 1), function () {
    return [];
  });
  return (
    c(e.nodes(), function (r) {
      var t = e.node(r),
        i = t.rank;
      m(i) || (n[i][t.order] = r);
    }),
    n
  );
}
function li(e) {
  var n = j(
    g(e.nodes(), function (r) {
      return e.node(r).rank;
    }),
  );
  c(e.nodes(), function (r) {
    var t = e.node(r);
    ln(t, "rank") && (t.rank -= n);
  });
}
function hi(e) {
  var n = j(
      g(e.nodes(), function (o) {
        return e.node(o).rank;
      }),
    ),
    r = [];
  c(e.nodes(), function (o) {
    var a = e.node(o).rank - n;
    (r[a] || (r[a] = []), r[a].push(o));
  });
  var t = 0,
    i = e.graph().nodeRankFactor;
  c(r, function (o, a) {
    m(o) && a % i !== 0
      ? --t
      : t &&
        c(o, function (u) {
          e.node(u).rank += t;
        });
  });
}
function Re(e, n, r, t) {
  var i = { width: 0, height: 0 };
  return (arguments.length >= 4 && ((i.rank = r), (i.order = t)), _(e, "border", i, n));
}
function pn(e) {
  return O(
    g(e.nodes(), function (n) {
      var r = e.node(n).rank;
      if (!m(r)) return r;
    }),
  );
}
function vi(e, n) {
  var r = { lhs: [], rhs: [] };
  return (
    c(e, function (t) {
      n(t) ? r.lhs.push(t) : r.rhs.push(t);
    }),
    r
  );
}
function pi(e, n) {
  return n();
}
function bi(e) {
  function n(r) {
    var t = e.children(r),
      i = e.node(r);
    if ((t.length && c(t, n), Object.prototype.hasOwnProperty.call(i, "minRank"))) {
      ((i.borderLeft = []), (i.borderRight = []));
      for (var o = i.minRank, a = i.maxRank + 1; o < a; ++o)
        (Se(e, "borderLeft", "_bl", r, i, o), Se(e, "borderRight", "_br", r, i, o));
    }
  }
  c(e.children(), n);
}
function Se(e, n, r, t, i, o) {
  var a = { width: 0, height: 0, rank: o, borderType: n },
    u = i[n][o - 1],
    d = _(e, "border", a, r);
  ((i[n][o] = d), e.setParent(d, t), u && e.setEdge(u, d, { weight: 1 }));
}
function wi(e) {
  var n = e.graph().rankdir.toLowerCase();
  (n === "lr" || n === "rl") && bn(e);
}
function gi(e) {
  var n = e.graph().rankdir.toLowerCase();
  ((n === "bt" || n === "rl") && mi(e), (n === "lr" || n === "rl") && (yi(e), bn(e)));
}
function bn(e) {
  (c(e.nodes(), function (n) {
    $e(e.node(n));
  }),
    c(e.edges(), function (n) {
      $e(e.edge(n));
    }));
}
function $e(e) {
  var n = e.width;
  ((e.width = e.height), (e.height = n));
}
function mi(e) {
  (c(e.nodes(), function (n) {
    Q(e.node(n));
  }),
    c(e.edges(), function (n) {
      var r = e.edge(n);
      (c(r.points, Q), Object.prototype.hasOwnProperty.call(r, "y") && Q(r));
    }));
}
function Q(e) {
  e.y = -e.y;
}
function yi(e) {
  (c(e.nodes(), function (n) {
    Z(e.node(n));
  }),
    c(e.edges(), function (n) {
      var r = e.edge(n);
      (c(r.points, Z), Object.prototype.hasOwnProperty.call(r, "x") && Z(r));
    }));
}
function Z(e) {
  var n = e.x;
  ((e.x = e.y), (e.y = n));
}
function xi(e) {
  ((e.graph().dummyChains = []),
    c(e.edges(), function (n) {
      Oi(e, n);
    }));
}
function Oi(e, n) {
  var r = n.v,
    t = e.node(r).rank,
    i = n.w,
    o = e.node(i).rank,
    a = n.name,
    u = e.edge(n),
    d = u.labelRank;
  if (o !== t + 1) {
    e.removeEdge(n);
    var f = void 0,
      s,
      l;
    for (l = 0, ++t; t < o; ++l, ++t)
      ((u.points = []),
        (f = { width: 0, height: 0, edgeLabel: u, edgeObj: n, rank: t }),
        (s = _(e, "edge", f, "_d")),
        t === d && ((f.width = u.width), (f.height = u.height), (f.dummy = "edge-label"), (f.labelpos = u.labelpos)),
        e.setEdge(r, s, { weight: u.weight }, a),
        l === 0 && e.graph().dummyChains.push(s),
        (r = s));
    e.setEdge(r, i, { weight: u.weight }, a);
  }
}
function Ei(e) {
  c(e.graph().dummyChains, function (n) {
    var r = e.node(n),
      t = r.edgeLabel,
      i;
    for (e.setEdge(r.edgeObj, t); r.dummy;)
      ((i = e.successors(n)[0]),
        e.removeNode(n),
        t.points.push({ x: r.x, y: r.y }),
        r.dummy === "edge-label" && ((t.x = r.x), (t.y = r.y), (t.width = r.width), (t.height = r.height)),
        (n = i),
        (r = e.node(n)));
  });
}
function be(e) {
  var n = {};
  function r(t) {
    var i = e.node(t);
    if (Object.prototype.hasOwnProperty.call(n, t)) return i.rank;
    n[t] = !0;
    var o = j(
      g(e.outEdges(t), function (a) {
        return r(a.w) - e.edge(a).minlen;
      }),
    );
    return ((o === Number.POSITIVE_INFINITY || o === void 0 || o === null) && (o = 0), (i.rank = o));
  }
  c(e.sources(), r);
}
function A(e, n) {
  return e.node(n.w).rank - e.node(n.v).rank - e.edge(n).minlen;
}
function wn(e) {
  var n = new x({ directed: !1 }),
    r = e.nodes()[0],
    t = e.nodeCount();
  n.setNode(r, {});
  for (var i, o; Ti(n, e) < t;) ((i = Pi(n, e)), (o = n.hasNode(i.v) ? A(e, i) : -A(e, i)), Li(n, e, o));
  return n;
}
function Ti(e, n) {
  function r(t) {
    c(n.nodeEdges(t), function (i) {
      var o = i.v,
        a = t === o ? i.w : o;
      !e.hasNode(a) && !A(n, i) && (e.setNode(a, {}), e.setEdge(t, a, {}), r(a));
    });
  }
  return (c(e.nodes(), r), e.nodeCount());
}
function Pi(e, n) {
  return ve(n.edges(), function (r) {
    if (e.hasNode(r.v) !== e.hasNode(r.w)) return A(n, r);
  });
}
function Li(e, n, r) {
  c(e.nodes(), function (t) {
    n.node(t).rank += r;
  });
}
function Ni() {}
Ni.prototype = new Error();
function gn(e, n, r) {
  T(n) || (n = [n]);
  var t = (e.isDirected() ? e.successors : e.neighbors).bind(e),
    i = [],
    o = {};
  return (
    c(n, function (a) {
      if (!e.hasNode(a)) throw new Error("Graph does not have node: " + a);
      mn(e, a, r === "post", o, t, i);
    }),
    i
  );
}
function mn(e, n, r, t, i, o) {
  Object.prototype.hasOwnProperty.call(t, n) ||
    ((t[n] = !0),
    r || o.push(n),
    c(i(n), function (a) {
      mn(e, a, r, t, i, o);
    }),
    r && o.push(n));
}
function Ii(e, n) {
  return gn(e, n, "post");
}
function _i(e, n) {
  return gn(e, n, "pre");
}
E.initLowLimValues = ge;
E.initCutValues = we;
E.calcCutValue = yn;
E.leaveEdge = On;
E.enterEdge = En;
E.exchangeEdges = Tn;
function E(e) {
  ((e = ci(e)), be(e));
  var n = wn(e);
  (ge(n), we(n, e));
  for (var r, t; (r = On(n));) ((t = En(n, e, r)), Tn(n, e, r, t));
}
function we(e, n) {
  var r = Ii(e, e.nodes());
  ((r = r.slice(0, r.length - 1)),
    c(r, function (t) {
      ki(e, n, t);
    }));
}
function ki(e, n, r) {
  var t = e.node(r),
    i = t.parent;
  e.edge(r, i).cutvalue = yn(e, n, r);
}
function yn(e, n, r) {
  var t = e.node(r),
    i = t.parent,
    o = !0,
    a = n.edge(r, i),
    u = 0;
  return (
    a || ((o = !1), (a = n.edge(i, r))),
    (u = a.weight),
    c(n.nodeEdges(r), function (d) {
      var f = d.v === r,
        s = f ? d.w : d.v;
      if (s !== i) {
        var l = f === o,
          h = n.edge(d).weight;
        if (((u += l ? h : -h), ji(e, r, s))) {
          var p = e.edge(r, s).cutvalue;
          u += l ? -p : p;
        }
      }
    }),
    u
  );
}
function ge(e, n) {
  (arguments.length < 2 && (n = e.nodes()[0]), xn(e, {}, 1, n));
}
function xn(e, n, r, t, i) {
  var o = r,
    a = e.node(t);
  return (
    (n[t] = !0),
    c(e.neighbors(t), function (u) {
      Object.prototype.hasOwnProperty.call(n, u) || (r = xn(e, n, r, u, t));
    }),
    (a.low = o),
    (a.lim = r++),
    i ? (a.parent = i) : delete a.parent,
    r
  );
}
function On(e) {
  return le(e.edges(), function (n) {
    return e.edge(n).cutvalue < 0;
  });
}
function En(e, n, r) {
  var t = r.v,
    i = r.w;
  n.hasEdge(t, i) || ((t = r.w), (i = r.v));
  var o = e.node(t),
    a = e.node(i),
    u = o,
    d = !1;
  o.lim > a.lim && ((u = a), (d = !0));
  var f = M(n.edges(), function (s) {
    return d === Fe(e, e.node(s.v), u) && d !== Fe(e, e.node(s.w), u);
  });
  return ve(f, function (s) {
    return A(n, s);
  });
}
function Tn(e, n, r, t) {
  var i = r.v,
    o = r.w;
  (e.removeEdge(i, o), e.setEdge(t.v, t.w, {}), ge(e), we(e, n), Ci(e, n));
}
function Ci(e, n) {
  var r = le(e.nodes(), function (i) {
      return !n.node(i).parent;
    }),
    t = _i(e, r);
  ((t = t.slice(1)),
    c(t, function (i) {
      var o = e.node(i).parent,
        a = n.edge(i, o),
        u = !1;
      (a || ((a = n.edge(o, i)), (u = !0)), (n.node(i).rank = n.node(o).rank + (u ? a.minlen : -a.minlen)));
    }));
}
function ji(e, n, r) {
  return e.hasEdge(n, r);
}
function Fe(e, n, r) {
  return r.low <= n.lim && n.lim <= r.lim;
}
function Ai(e) {
  switch (e.graph().ranker) {
    case "network-simplex":
      Be(e);
      break;
    case "tight-tree":
      Ri(e);
      break;
    case "longest-path":
      Mi(e);
      break;
    default:
      Be(e);
  }
}
var Mi = be;
function Ri(e) {
  (be(e), wn(e));
}
function Be(e) {
  E(e);
}
function Si(e) {
  var n = _(e, "root", {}, "_root"),
    r = $i(e),
    t = O(P(r)) - 1,
    i = 2 * t + 1;
  ((e.graph().nestingRoot = n),
    c(e.edges(), function (a) {
      e.edge(a).minlen *= i;
    }));
  var o = Fi(e) + 1;
  (c(e.children(), function (a) {
    Pn(e, n, i, o, t, r, a);
  }),
    (e.graph().nodeRankFactor = i));
}
function Pn(e, n, r, t, i, o, a) {
  var u = e.children(a);
  if (!u.length) {
    a !== n && e.setEdge(n, a, { weight: 0, minlen: r });
    return;
  }
  var d = Re(e, "_bt"),
    f = Re(e, "_bb"),
    s = e.node(a);
  (e.setParent(d, a),
    (s.borderTop = d),
    e.setParent(f, a),
    (s.borderBottom = f),
    c(u, function (l) {
      Pn(e, n, r, t, i, o, l);
      var h = e.node(l),
        p = h.borderTop ? h.borderTop : l,
        v = h.borderBottom ? h.borderBottom : l,
        w = h.borderTop ? t : 2 * t,
        k = p !== v ? 1 : i - o[a] + 1;
      (e.setEdge(d, p, { weight: w, minlen: k, nestingEdge: !0 }),
        e.setEdge(v, f, { weight: w, minlen: k, nestingEdge: !0 }));
    }),
    e.parent(a) || e.setEdge(n, d, { weight: 0, minlen: i + o[a] }));
}
function $i(e) {
  var n = {};
  function r(t, i) {
    var o = e.children(t);
    (o &&
      o.length &&
      c(o, function (a) {
        r(a, i + 1);
      }),
      (n[t] = i));
  }
  return (
    c(e.children(), function (t) {
      r(t, 1);
    }),
    n
  );
}
function Fi(e) {
  return W(
    e.edges(),
    function (n, r) {
      return n + e.edge(r).weight;
    },
    0,
  );
}
function Bi(e) {
  var n = e.graph();
  (e.removeNode(n.nestingRoot),
    delete n.nestingRoot,
    c(e.edges(), function (r) {
      var t = e.edge(r);
      t.nestingEdge && e.removeEdge(r);
    }));
}
function Di(e, n, r) {
  var t = {},
    i;
  c(r, function (o) {
    for (var a = e.parent(o), u, d; a;) {
      if (((u = e.parent(a)), u ? ((d = t[u]), (t[u] = a)) : ((d = i), (i = a)), d && d !== a)) {
        n.setEdge(d, a);
        return;
      }
      a = u;
    }
  });
}
function Gi(e, n, r) {
  var t = Vi(e),
    i = new x({ compound: !0 }).setGraph({ root: t }).setDefaultNodeLabel(function (o) {
      return e.node(o);
    });
  return (
    c(e.nodes(), function (o) {
      var a = e.node(o),
        u = e.parent(o);
      (a.rank === n || (a.minRank <= n && n <= a.maxRank)) &&
        (i.setNode(o),
        i.setParent(o, u || t),
        c(e[r](o), function (d) {
          var f = d.v === o ? d.w : d.v,
            s = i.edge(f, o),
            l = m(s) ? 0 : s.weight;
          i.setEdge(f, o, { weight: e.edge(d).weight + l });
        }),
        Object.prototype.hasOwnProperty.call(a, "minRank") &&
          i.setNode(o, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] }));
    }),
    i
  );
}
function Vi(e) {
  for (var n; e.hasNode((n = pe("_root"))););
  return n;
}
function Yi(e, n) {
  for (var r = 0, t = 1; t < n.length; ++t) r += Ui(e, n[t - 1], n[t]);
  return r;
}
function Ui(e, n, r) {
  for (
    var t = ni(
        r,
        g(r, function (f, s) {
          return s;
        }),
      ),
      i = I(
        g(n, function (f) {
          return R(
            g(e.outEdges(f), function (s) {
              return { pos: t[s.w], weight: e.edge(s).weight };
            }),
            "pos",
          );
        }),
      ),
      o = 1;
    o < r.length;
  )
    o <<= 1;
  var a = 2 * o - 1;
  o -= 1;
  var u = g(new Array(a), function () {
      return 0;
    }),
    d = 0;
  return (
    c(
      i.forEach(function (f) {
        var s = f.pos + o;
        u[s] += f.weight;
        for (var l = 0; s > 0;) (s % 2 && (l += u[s + 1]), (s = (s - 1) >> 1), (u[s] += f.weight));
        d += f.weight * l;
      }),
    ),
    d
  );
}
function Wi(e) {
  var n = {},
    r = M(e.nodes(), function (u) {
      return !e.children(u).length;
    }),
    t = O(
      g(r, function (u) {
        return e.node(u).rank;
      }),
    ),
    i = g(L(t + 1), function () {
      return [];
    });
  function o(u) {
    if (!ln(n, u)) {
      n[u] = !0;
      var d = e.node(u);
      (i[d.rank].push(u), c(e.successors(u), o));
    }
  }
  var a = R(r, function (u) {
    return e.node(u).rank;
  });
  return (c(a, o), i);
}
function qi(e, n) {
  return g(n, function (r) {
    var t = e.inEdges(r);
    if (t.length) {
      var i = W(
        t,
        function (o, a) {
          var u = e.edge(a),
            d = e.node(a.v);
          return { sum: o.sum + u.weight * d.order, weight: o.weight + u.weight };
        },
        { sum: 0, weight: 0 },
      );
      return { v: r, barycenter: i.sum / i.weight, weight: i.weight };
    } else return { v: r };
  });
}
function Xi(e, n) {
  var r = {};
  (c(e, function (i, o) {
    var a = (r[i.v] = { indegree: 0, in: [], out: [], vs: [i.v], i: o });
    m(i.barycenter) || ((a.barycenter = i.barycenter), (a.weight = i.weight));
  }),
    c(n.edges(), function (i) {
      var o = r[i.v],
        a = r[i.w];
      !m(o) && !m(a) && (a.indegree++, o.out.push(r[i.w]));
    }));
  var t = M(r, function (i) {
    return !i.indegree;
  });
  return Hi(t);
}
function Hi(e) {
  var n = [];
  function r(o) {
    return function (a) {
      a.merged || ((m(a.barycenter) || m(o.barycenter) || a.barycenter >= o.barycenter) && Ki(o, a));
    };
  }
  function t(o) {
    return function (a) {
      (a.in.push(o), --a.indegree === 0 && e.push(a));
    };
  }
  for (; e.length;) {
    var i = e.pop();
    (n.push(i), c(i.in.reverse(), r(i)), c(i.out, t(i)));
  }
  return g(
    M(n, function (o) {
      return !o.merged;
    }),
    function (o) {
      return V(o, ["vs", "i", "barycenter", "weight"]);
    },
  );
}
function Ki(e, n) {
  var r = 0,
    t = 0;
  (e.weight && ((r += e.barycenter * e.weight), (t += e.weight)),
    n.weight && ((r += n.barycenter * n.weight), (t += n.weight)),
    (e.vs = n.vs.concat(e.vs)),
    (e.barycenter = r / t),
    (e.weight = t),
    (e.i = Math.min(n.i, e.i)),
    (n.merged = !0));
}
function zi(e, n) {
  var r = vi(e, function (s) {
      return Object.prototype.hasOwnProperty.call(s, "barycenter");
    }),
    t = r.lhs,
    i = R(r.rhs, function (s) {
      return -s.i;
    }),
    o = [],
    a = 0,
    u = 0,
    d = 0;
  (t.sort(Ji(!!n)),
    (d = De(o, i, d)),
    c(t, function (s) {
      ((d += s.vs.length), o.push(s.vs), (a += s.barycenter * s.weight), (u += s.weight), (d = De(o, i, d)));
    }));
  var f = { vs: I(o) };
  return (u && ((f.barycenter = a / u), (f.weight = u)), f);
}
function De(e, n, r) {
  for (var t; n.length && (t = G(n)).i <= r;) (n.pop(), e.push(t.vs), r++);
  return r;
}
function Ji(e) {
  return function (n, r) {
    return n.barycenter < r.barycenter ? -1 : n.barycenter > r.barycenter ? 1 : e ? r.i - n.i : n.i - r.i;
  };
}
function Ln(e, n, r, t) {
  var i = e.children(n),
    o = e.node(n),
    a = o ? o.borderLeft : void 0,
    u = o ? o.borderRight : void 0,
    d = {};
  a &&
    (i = M(i, function (v) {
      return v !== a && v !== u;
    }));
  var f = qi(e, i);
  c(f, function (v) {
    if (e.children(v.v).length) {
      var w = Ln(e, v.v, r, t);
      ((d[v.v] = w), Object.prototype.hasOwnProperty.call(w, "barycenter") && Zi(v, w));
    }
  });
  var s = Xi(f, r);
  Qi(s, d);
  var l = zi(s, t);
  if (a && ((l.vs = I([a, l.vs, u])), e.predecessors(a).length)) {
    var h = e.node(e.predecessors(a)[0]),
      p = e.node(e.predecessors(u)[0]);
    (Object.prototype.hasOwnProperty.call(l, "barycenter") || ((l.barycenter = 0), (l.weight = 0)),
      (l.barycenter = (l.barycenter * l.weight + h.order + p.order) / (l.weight + 2)),
      (l.weight += 2));
  }
  return l;
}
function Qi(e, n) {
  c(e, function (r) {
    r.vs = I(
      r.vs.map(function (t) {
        return n[t] ? n[t].vs : t;
      }),
    );
  });
}
function Zi(e, n) {
  m(e.barycenter)
    ? ((e.barycenter = n.barycenter), (e.weight = n.weight))
    : ((e.barycenter = (e.barycenter * e.weight + n.barycenter * n.weight) / (e.weight + n.weight)),
      (e.weight += n.weight));
}
function ea(e) {
  var n = pn(e),
    r = Ge(e, L(1, n + 1), "inEdges"),
    t = Ge(e, L(n - 1, -1, -1), "outEdges"),
    i = Wi(e);
  Ve(e, i);
  for (var o = Number.POSITIVE_INFINITY, a, u = 0, d = 0; d < 4; ++u, ++d) {
    (na(u % 2 ? r : t, u % 4 >= 2), (i = z(e)));
    var f = Yi(e, i);
    f < o && ((d = 0), (a = It(i)), (o = f));
  }
  Ve(e, a);
}
function Ge(e, n, r) {
  return g(n, function (t) {
    return Gi(e, t, r);
  });
}
function na(e, n) {
  var r = new x();
  c(e, function (t) {
    var i = t.graph().root,
      o = Ln(t, i, r, n);
    (c(o.vs, function (a, u) {
      t.node(a).order = u;
    }),
      Di(t, r, o.vs));
  });
}
function Ve(e, n) {
  c(n, function (r) {
    c(r, function (t, i) {
      e.node(t).order = i;
    });
  });
}
function ra(e) {
  var n = ia(e);
  c(e.graph().dummyChains, function (r) {
    for (
      var t = e.node(r), i = t.edgeObj, o = ta(e, n, i.v, i.w), a = o.path, u = o.lca, d = 0, f = a[d], s = !0;
      r !== i.w;
    ) {
      if (((t = e.node(r)), s)) {
        for (; (f = a[d]) !== u && e.node(f).maxRank < t.rank;) d++;
        f === u && (s = !1);
      }
      if (!s) {
        for (; d < a.length - 1 && e.node((f = a[d + 1])).minRank <= t.rank;) d++;
        f = a[d];
      }
      (e.setParent(r, f), (r = e.successors(r)[0]));
    }
  });
}
function ta(e, n, r, t) {
  var i = [],
    o = [],
    a = Math.min(n[r].low, n[t].low),
    u = Math.max(n[r].lim, n[t].lim),
    d,
    f;
  d = r;
  do ((d = e.parent(d)), i.push(d));
  while (d && (n[d].low > a || u > n[d].lim));
  for (f = d, d = t; (d = e.parent(d)) !== f;) o.push(d);
  return { path: i.concat(o.reverse()), lca: f };
}
function ia(e) {
  var n = {},
    r = 0;
  function t(i) {
    var o = r;
    (c(e.children(i), t), (n[i] = { low: o, lim: r++ }));
  }
  return (c(e.children(), t), n);
}
function aa(e, n) {
  var r = {};
  function t(i, o) {
    var a = 0,
      u = 0,
      d = i.length,
      f = G(o);
    return (
      c(o, function (s, l) {
        var h = ua(e, s),
          p = h ? e.node(h).order : d;
        (h || s === f) &&
          (c(o.slice(u, l + 1), function (v) {
            c(e.predecessors(v), function (w) {
              var k = e.node(w),
                me = k.order;
              (me < a || p < me) && !(k.dummy && e.node(v).dummy) && Nn(r, w, v);
            });
          }),
          (u = l + 1),
          (a = p));
      }),
      o
    );
  }
  return (W(n, t), r);
}
function oa(e, n) {
  var r = {};
  function t(o, a, u, d, f) {
    var s;
    c(L(a, u), function (l) {
      ((s = o[l]),
        e.node(s).dummy &&
          c(e.predecessors(s), function (h) {
            var p = e.node(h);
            p.dummy && (p.order < d || p.order > f) && Nn(r, h, s);
          }));
    });
  }
  function i(o, a) {
    var u = -1,
      d,
      f = 0;
    return (
      c(a, function (s, l) {
        if (e.node(s).dummy === "border") {
          var h = e.predecessors(s);
          h.length && ((d = e.node(h[0]).order), t(a, f, l, u, d), (f = l), (u = d));
        }
        t(a, f, a.length, d, o.length);
      }),
      a
    );
  }
  return (W(n, i), r);
}
function ua(e, n) {
  if (e.node(n).dummy)
    return le(e.predecessors(n), function (r) {
      return e.node(r).dummy;
    });
}
function Nn(e, n, r) {
  if (n > r) {
    var t = n;
    ((n = r), (r = t));
  }
  Object.prototype.hasOwnProperty.call(e, n) ||
    Object.defineProperty(e, n, { enumerable: !0, configurable: !0, value: {}, writable: !0 });
  var i = e[n];
  Object.defineProperty(i, r, { enumerable: !0, configurable: !0, value: !0, writable: !0 });
}
function da(e, n, r) {
  if (n > r) {
    var t = n;
    ((n = r), (r = t));
  }
  return !!e[n] && Object.prototype.hasOwnProperty.call(e[n], r);
}
function fa(e, n, r, t) {
  var i = {},
    o = {},
    a = {};
  return (
    c(n, function (u) {
      c(u, function (d, f) {
        ((i[d] = d), (o[d] = d), (a[d] = f));
      });
    }),
    c(n, function (u) {
      var d = -1;
      c(u, function (f) {
        var s = t(f);
        if (s.length) {
          s = R(s, function (w) {
            return a[w];
          });
          for (var l = (s.length - 1) / 2, h = Math.floor(l), p = Math.ceil(l); h <= p; ++h) {
            var v = s[h];
            o[f] === f && d < a[v] && !da(r, f, v) && ((o[v] = f), (o[f] = i[f] = i[v]), (d = a[v]));
          }
        }
      });
    }),
    { root: i, align: o }
  );
}
function sa(e, n, r, t, i) {
  var o = {},
    a = ca(e, n, r, i),
    u = i ? "borderLeft" : "borderRight";
  function d(l, h) {
    for (var p = a.nodes(), v = p.pop(), w = {}; v;)
      (w[v] ? l(v) : ((w[v] = !0), p.push(v), (p = p.concat(h(v)))), (v = p.pop()));
  }
  function f(l) {
    o[l] = a.inEdges(l).reduce(function (h, p) {
      return Math.max(h, o[p.v] + a.edge(p));
    }, 0);
  }
  function s(l) {
    var h = a.outEdges(l).reduce(function (v, w) {
        return Math.min(v, o[w.w] - a.edge(w));
      }, Number.POSITIVE_INFINITY),
      p = e.node(l);
    h !== Number.POSITIVE_INFINITY && p.borderType !== u && (o[l] = Math.max(o[l], h));
  }
  return (
    d(f, a.predecessors.bind(a)),
    d(s, a.successors.bind(a)),
    c(t, function (l) {
      o[l] = o[r[l]];
    }),
    o
  );
}
function ca(e, n, r, t) {
  var i = new x(),
    o = e.graph(),
    a = ba(o.nodesep, o.edgesep, t);
  return (
    c(n, function (u) {
      var d;
      c(u, function (f) {
        var s = r[f];
        if ((i.setNode(s), d)) {
          var l = r[d],
            h = i.edge(l, s);
          i.setEdge(l, s, Math.max(a(e, f, d), h || 0));
        }
        d = f;
      });
    }),
    i
  );
}
function la(e, n) {
  return ve(P(n), function (r) {
    var t = Number.NEGATIVE_INFINITY,
      i = Number.POSITIVE_INFINITY;
    return (
      St(r, function (o, a) {
        var u = wa(e, a) / 2;
        ((t = Math.max(o + u, t)), (i = Math.min(o - u, i)));
      }),
      t - i
    );
  });
}
function ha(e, n) {
  var r = P(n),
    t = j(r),
    i = O(r);
  c(["u", "d"], function (o) {
    c(["l", "r"], function (a) {
      var u = o + a,
        d = e[u],
        f;
      if (d !== n) {
        var s = P(d);
        ((f = a === "l" ? t - j(s) : i - O(s)),
          f &&
            (e[u] = K(d, function (l) {
              return l + f;
            })));
      }
    });
  });
}
function va(e, n) {
  return K(e.ul, function (r, t) {
    if (n) return e[n.toLowerCase()][t];
    var i = R(g(e, t));
    return (i[1] + i[2]) / 2;
  });
}
function pa(e) {
  var n = z(e),
    r = ie(aa(e, n), oa(e, n)),
    t = {},
    i;
  c(["u", "d"], function (a) {
    ((i = a === "u" ? n : P(n).reverse()),
      c(["l", "r"], function (u) {
        u === "r" &&
          (i = g(i, function (l) {
            return P(l).reverse();
          }));
        var d = (a === "u" ? e.predecessors : e.successors).bind(e),
          f = fa(e, i, r, d),
          s = sa(e, i, f.root, f.align, u === "r");
        (u === "r" &&
          (s = K(s, function (l) {
            return -l;
          })),
          (t[a + u] = s));
      }));
  });
  var o = la(e, t);
  return (ha(t, o), va(t, e.graph().align));
}
function ba(e, n, r) {
  return function (t, i, o) {
    var a = t.node(i),
      u = t.node(o),
      d = 0,
      f;
    if (((d += a.width / 2), Object.prototype.hasOwnProperty.call(a, "labelpos")))
      switch (a.labelpos.toLowerCase()) {
        case "l":
          f = -a.width / 2;
          break;
        case "r":
          f = a.width / 2;
          break;
      }
    if (
      (f && (d += r ? f : -f),
      (f = 0),
      (d += (a.dummy ? n : e) / 2),
      (d += (u.dummy ? n : e) / 2),
      (d += u.width / 2),
      Object.prototype.hasOwnProperty.call(u, "labelpos"))
    )
      switch (u.labelpos.toLowerCase()) {
        case "l":
          f = u.width / 2;
          break;
        case "r":
          f = -u.width / 2;
          break;
      }
    return (f && (d += r ? f : -f), (f = 0), d);
  };
}
function wa(e, n) {
  return e.node(n).width;
}
function ga(e) {
  ((e = vn(e)),
    ma(e),
    $t(pa(e), function (n, r) {
      e.node(r).x = n;
    }));
}
function ma(e) {
  var n = z(e),
    r = e.graph().ranksep,
    t = 0;
  c(n, function (i) {
    var o = O(
      g(i, function (a) {
        return e.node(a).height;
      }),
    );
    (c(i, function (a) {
      e.node(a).y = t + o / 2;
    }),
      (t += o + r));
  });
}
function Ua(e, n) {
  var r = pi;
  r("layout", () => {
    var t = r("  buildLayoutGraph", () => ka(e));
    (r("  runLayout", () => ya(t, r)), r("  updateInputGraph", () => xa(e, t)));
  });
}
function ya(e, n) {
  (n("    makeSpaceForEdgeLabels", () => Ca(e)),
    n("    removeSelfEdges", () => Da(e)),
    n("    acyclic", () => di(e)),
    n("    nestingGraph.run", () => Si(e)),
    n("    rank", () => Ai(vn(e))),
    n("    injectEdgeLabelProxies", () => ja(e)),
    n("    removeEmptyRanks", () => hi(e)),
    n("    nestingGraph.cleanup", () => Bi(e)),
    n("    normalizeRanks", () => li(e)),
    n("    assignRankMinMax", () => Aa(e)),
    n("    removeEdgeLabelProxies", () => Ma(e)),
    n("    normalize.run", () => xi(e)),
    n("    parentDummyChains", () => ra(e)),
    n("    addBorderSegments", () => bi(e)),
    n("    order", () => ea(e)),
    n("    insertSelfEdges", () => Ga(e)),
    n("    adjustCoordinateSystem", () => wi(e)),
    n("    position", () => ga(e)),
    n("    positionSelfEdges", () => Va(e)),
    n("    removeBorderNodes", () => Ba(e)),
    n("    normalize.undo", () => Ei(e)),
    n("    fixupEdgeLabelCoords", () => $a(e)),
    n("    undoCoordinateSystem", () => gi(e)),
    n("    translateGraph", () => Ra(e)),
    n("    assignNodeIntersects", () => Sa(e)),
    n("    reversePoints", () => Fa(e)),
    n("    acyclic.undo", () => si(e)));
}
function xa(e, n) {
  (c(e.nodes(), function (r) {
    var t = e.node(r),
      i = n.node(r);
    t && ((t.x = i.x), (t.y = i.y), n.children(r).length && ((t.width = i.width), (t.height = i.height)));
  }),
    c(e.edges(), function (r) {
      var t = e.edge(r),
        i = n.edge(r);
      ((t.points = i.points), Object.prototype.hasOwnProperty.call(i, "x") && ((t.x = i.x), (t.y = i.y)));
    }),
    (e.graph().width = n.graph().width),
    (e.graph().height = n.graph().height));
}
var Oa = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"],
  Ea = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" },
  Ta = ["acyclicer", "ranker", "rankdir", "align"],
  Pa = ["width", "height"],
  La = { width: 0, height: 0 },
  Na = ["minlen", "weight", "width", "height", "labeloffset"],
  Ia = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" },
  _a = ["labelpos"];
function ka(e) {
  var n = new x({ multigraph: !0, compound: !0 }),
    r = ne(e.graph());
  return (
    n.setGraph(ie({}, Ea, ee(r, Oa), V(r, Ta))),
    c(e.nodes(), function (t) {
      var i = ne(e.node(t));
      (n.setNode(t, kt(ee(i, Pa), La)), n.setParent(t, e.parent(t)));
    }),
    c(e.edges(), function (t) {
      var i = ne(e.edge(t));
      n.setEdge(t, ie({}, Ia, ee(i, Na), V(i, _a)));
    }),
    n
  );
}
function Ca(e) {
  var n = e.graph();
  ((n.ranksep /= 2),
    c(e.edges(), function (r) {
      var t = e.edge(r);
      ((t.minlen *= 2),
        t.labelpos.toLowerCase() !== "c" &&
          (n.rankdir === "TB" || n.rankdir === "BT" ? (t.width += t.labeloffset) : (t.height += t.labeloffset)));
    }));
}
function ja(e) {
  c(e.edges(), function (n) {
    var r = e.edge(n);
    if (r.width && r.height) {
      var t = e.node(n.v),
        i = e.node(n.w),
        o = { rank: (i.rank - t.rank) / 2 + t.rank, e: n };
      _(e, "edge-proxy", o, "_ep");
    }
  });
}
function Aa(e) {
  var n = 0;
  (c(e.nodes(), function (r) {
    var t = e.node(r);
    t.borderTop &&
      ((t.minRank = e.node(t.borderTop).rank), (t.maxRank = e.node(t.borderBottom).rank), (n = O(n, t.maxRank)));
  }),
    (e.graph().maxRank = n));
}
function Ma(e) {
  c(e.nodes(), function (n) {
    var r = e.node(n);
    r.dummy === "edge-proxy" && ((e.edge(r.e).labelRank = r.rank), e.removeNode(n));
  });
}
function Ra(e) {
  var n = Number.POSITIVE_INFINITY,
    r = 0,
    t = Number.POSITIVE_INFINITY,
    i = 0,
    o = e.graph(),
    a = o.marginx || 0,
    u = o.marginy || 0;
  function d(f) {
    var s = f.x,
      l = f.y,
      h = f.width,
      p = f.height;
    ((n = Math.min(n, s - h / 2)),
      (r = Math.max(r, s + h / 2)),
      (t = Math.min(t, l - p / 2)),
      (i = Math.max(i, l + p / 2)));
  }
  (c(e.nodes(), function (f) {
    d(e.node(f));
  }),
    c(e.edges(), function (f) {
      var s = e.edge(f);
      Object.prototype.hasOwnProperty.call(s, "x") && d(s);
    }),
    (n -= a),
    (t -= u),
    c(e.nodes(), function (f) {
      var s = e.node(f);
      ((s.x -= n), (s.y -= t));
    }),
    c(e.edges(), function (f) {
      var s = e.edge(f);
      (c(s.points, function (l) {
        ((l.x -= n), (l.y -= t));
      }),
        Object.prototype.hasOwnProperty.call(s, "x") && (s.x -= n),
        Object.prototype.hasOwnProperty.call(s, "y") && (s.y -= t));
    }),
    (o.width = r - n + a),
    (o.height = i - t + u));
}
function Sa(e) {
  c(e.edges(), function (n) {
    var r = e.edge(n),
      t = e.node(n.v),
      i = e.node(n.w),
      o,
      a;
    (r.points ? ((o = r.points[0]), (a = r.points[r.points.length - 1])) : ((r.points = []), (o = i), (a = t)),
      r.points.unshift(Me(t, o)),
      r.points.push(Me(i, a)));
  });
}
function $a(e) {
  c(e.edges(), function (n) {
    var r = e.edge(n);
    if (Object.prototype.hasOwnProperty.call(r, "x"))
      switch (((r.labelpos === "l" || r.labelpos === "r") && (r.width -= r.labeloffset), r.labelpos)) {
        case "l":
          r.x -= r.width / 2 + r.labeloffset;
          break;
        case "r":
          r.x += r.width / 2 + r.labeloffset;
          break;
      }
  });
}
function Fa(e) {
  c(e.edges(), function (n) {
    var r = e.edge(n);
    r.reversed && r.points.reverse();
  });
}
function Ba(e) {
  (c(e.nodes(), function (n) {
    if (e.children(n).length) {
      var r = e.node(n),
        t = e.node(r.borderTop),
        i = e.node(r.borderBottom),
        o = e.node(G(r.borderLeft)),
        a = e.node(G(r.borderRight));
      ((r.width = Math.abs(a.x - o.x)),
        (r.height = Math.abs(i.y - t.y)),
        (r.x = o.x + r.width / 2),
        (r.y = t.y + r.height / 2));
    }
  }),
    c(e.nodes(), function (n) {
      e.node(n).dummy === "border" && e.removeNode(n);
    }));
}
function Da(e) {
  c(e.edges(), function (n) {
    if (n.v === n.w) {
      var r = e.node(n.v);
      (r.selfEdges || (r.selfEdges = []), r.selfEdges.push({ e: n, label: e.edge(n) }), e.removeEdge(n));
    }
  });
}
function Ga(e) {
  var n = z(e);
  c(n, function (r) {
    var t = 0;
    c(r, function (i, o) {
      var a = e.node(i);
      ((a.order = o + t),
        c(a.selfEdges, function (u) {
          _(
            e,
            "selfedge",
            { width: u.label.width, height: u.label.height, rank: a.rank, order: o + ++t, e: u.e, label: u.label },
            "_se",
          );
        }),
        delete a.selfEdges);
    });
  });
}
function Va(e) {
  c(e.nodes(), function (n) {
    var r = e.node(n);
    if (r.dummy === "selfedge") {
      var t = e.node(r.e.v),
        i = t.x + t.width / 2,
        o = t.y,
        a = r.x - i,
        u = t.height / 2;
      (e.setEdge(r.e, r.label),
        e.removeNode(n),
        (r.label.points = [
          { x: i + (2 * a) / 3, y: o - u },
          { x: i + (5 * a) / 6, y: o - u },
          { x: i + a, y: o },
          { x: i + (5 * a) / 6, y: o + u },
          { x: i + (2 * a) / 3, y: o + u },
        ]),
        (r.label.x = r.x),
        (r.label.y = r.y));
    }
  });
}
function ee(e, n) {
  return K(V(e, n), Number);
}
function ne(e) {
  var n = {};
  return (
    c(e, function (r, t) {
      n[t.toLowerCase()] = r;
    }),
    n
  );
}
export { Ua as l };
