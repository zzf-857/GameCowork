import {
  _ as g,
  V as _t,
  W as xt,
  t as vt,
  v as bt,
  x as wt,
  w as St,
  y as lt,
  a1 as Et,
  z as X,
  aD as Lt,
  a0 as Tt,
  K as At,
} from "./VscTheme-BExNMG_K.js";
import { o as Mt } from "./ordinal-BnMzuN5p.js";
import "./registry-BL-NPVNy.js";
import "./init-BSqZKE-v.js";
(function () {
  var t =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  t.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var t =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      n = new t.Error().stack;
    n &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[n] = "77d95163-0925-4662-b4a5-1fa3abe8ec79"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-77d95163-0925-4662-b4a5-1fa3abe8ec79"));
  })();
} catch {}
function It(t) {
  for (var n = (t.length / 6) | 0, r = new Array(n), l = 0; l < n;) r[l] = "#" + t.slice(l * 6, ++l * 6);
  return r;
}
const Nt = It("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");
function ct(t, n) {
  let r;
  if (n === void 0) for (const l of t) l != null && (r < l || (r === void 0 && l >= l)) && (r = l);
  else {
    let l = -1;
    for (let h of t) (h = n(h, ++l, t)) != null && (r < h || (r === void 0 && h >= h)) && (r = h);
  }
  return r;
}
function pt(t, n) {
  let r;
  if (n === void 0) for (const l of t) l != null && (r > l || (r === void 0 && l >= l)) && (r = l);
  else {
    let l = -1;
    for (let h of t) (h = n(h, ++l, t)) != null && (r > h || (r === void 0 && h >= h)) && (r = h);
  }
  return r;
}
function nt(t, n) {
  let r = 0;
  if (n === void 0) for (let l of t) (l = +l) && (r += l);
  else {
    let l = -1;
    for (let h of t) (h = +n(h, ++l, t)) && (r += h);
  }
  return r;
}
function Pt(t) {
  return t.target.depth;
}
function Ct(t) {
  return t.depth;
}
function Dt(t, n) {
  return n - 1 - t.height;
}
function mt(t, n) {
  return t.sourceLinks.length ? t.depth : n - 1;
}
function Ot(t) {
  return t.targetLinks.length ? t.depth : t.sourceLinks.length ? pt(t.sourceLinks, Pt) - 1 : 0;
}
function q(t) {
  return function () {
    return t;
  };
}
function ut(t, n) {
  return K(t.source, n.source) || t.index - n.index;
}
function ht(t, n) {
  return K(t.target, n.target) || t.index - n.index;
}
function K(t, n) {
  return t.y0 - n.y0;
}
function it(t) {
  return t.value;
}
function zt(t) {
  return t.index;
}
function $t(t) {
  return t.nodes;
}
function jt(t) {
  return t.links;
}
function ft(t, n) {
  const r = t.get(n);
  if (!r) throw new Error("missing: " + n);
  return r;
}
function yt({ nodes: t }) {
  for (const n of t) {
    let r = n.y0,
      l = r;
    for (const h of n.sourceLinks) ((h.y0 = r + h.width / 2), (r += h.width));
    for (const h of n.targetLinks) ((h.y1 = l + h.width / 2), (l += h.width));
  }
}
function Rt() {
  let t = 0,
    n = 0,
    r = 1,
    l = 1,
    h = 24,
    d = 8,
    p,
    k = zt,
    o = mt,
    a,
    c,
    _ = $t,
    x = jt,
    y = 6;
  function v() {
    const i = { nodes: _.apply(null, arguments), links: x.apply(null, arguments) };
    return (A(i), T(i), M(i), P(i), w(i), yt(i), i);
  }
  ((v.update = function (i) {
    return (yt(i), i);
  }),
    (v.nodeId = function (i) {
      return arguments.length ? ((k = typeof i == "function" ? i : q(i)), v) : k;
    }),
    (v.nodeAlign = function (i) {
      return arguments.length ? ((o = typeof i == "function" ? i : q(i)), v) : o;
    }),
    (v.nodeSort = function (i) {
      return arguments.length ? ((a = i), v) : a;
    }),
    (v.nodeWidth = function (i) {
      return arguments.length ? ((h = +i), v) : h;
    }),
    (v.nodePadding = function (i) {
      return arguments.length ? ((d = p = +i), v) : d;
    }),
    (v.nodes = function (i) {
      return arguments.length ? ((_ = typeof i == "function" ? i : q(i)), v) : _;
    }),
    (v.links = function (i) {
      return arguments.length ? ((x = typeof i == "function" ? i : q(i)), v) : x;
    }),
    (v.linkSort = function (i) {
      return arguments.length ? ((c = i), v) : c;
    }),
    (v.size = function (i) {
      return arguments.length ? ((t = n = 0), (r = +i[0]), (l = +i[1]), v) : [r - t, l - n];
    }),
    (v.extent = function (i) {
      return arguments.length
        ? ((t = +i[0][0]), (r = +i[1][0]), (n = +i[0][1]), (l = +i[1][1]), v)
        : [
            [t, n],
            [r, l],
          ];
    }),
    (v.iterations = function (i) {
      return arguments.length ? ((y = +i), v) : y;
    }));
  function A({ nodes: i, links: f }) {
    for (const [e, s] of i.entries()) ((s.index = e), (s.sourceLinks = []), (s.targetLinks = []));
    const u = new Map(i.map((e, s) => [k(e, s, i), e]));
    for (const [e, s] of f.entries()) {
      s.index = e;
      let { source: m, target: b } = s;
      (typeof m != "object" && (m = s.source = ft(u, m)),
        typeof b != "object" && (b = s.target = ft(u, b)),
        m.sourceLinks.push(s),
        b.targetLinks.push(s));
    }
    if (c != null) for (const { sourceLinks: e, targetLinks: s } of i) (e.sort(c), s.sort(c));
  }
  function T({ nodes: i }) {
    for (const f of i)
      f.value = f.fixedValue === void 0 ? Math.max(nt(f.sourceLinks, it), nt(f.targetLinks, it)) : f.fixedValue;
  }
  function M({ nodes: i }) {
    const f = i.length;
    let u = new Set(i),
      e = new Set(),
      s = 0;
    for (; u.size;) {
      for (const m of u) {
        m.depth = s;
        for (const { target: b } of m.sourceLinks) e.add(b);
      }
      if (++s > f) throw new Error("circular link");
      ((u = e), (e = new Set()));
    }
  }
  function P({ nodes: i }) {
    const f = i.length;
    let u = new Set(i),
      e = new Set(),
      s = 0;
    for (; u.size;) {
      for (const m of u) {
        m.height = s;
        for (const { source: b } of m.targetLinks) e.add(b);
      }
      if (++s > f) throw new Error("circular link");
      ((u = e), (e = new Set()));
    }
  }
  function O({ nodes: i }) {
    const f = ct(i, (s) => s.depth) + 1,
      u = (r - t - h) / (f - 1),
      e = new Array(f);
    for (const s of i) {
      const m = Math.max(0, Math.min(f - 1, Math.floor(o.call(null, s, f))));
      ((s.layer = m), (s.x0 = t + m * u), (s.x1 = s.x0 + h), e[m] ? e[m].push(s) : (e[m] = [s]));
    }
    if (a) for (const s of e) s.sort(a);
    return e;
  }
  function R(i) {
    const f = pt(i, (u) => (l - n - (u.length - 1) * p) / nt(u, it));
    for (const u of i) {
      let e = n;
      for (const s of u) {
        ((s.y0 = e), (s.y1 = e + s.value * f), (e = s.y1 + p));
        for (const m of s.sourceLinks) m.width = m.value * f;
      }
      e = (l - e + p) / (u.length + 1);
      for (let s = 0; s < u.length; ++s) {
        const m = u[s];
        ((m.y0 += e * (s + 1)), (m.y1 += e * (s + 1)));
      }
      S(u);
    }
  }
  function w(i) {
    const f = O(i);
    ((p = Math.min(d, (l - n) / (ct(f, (u) => u.length) - 1))), R(f));
    for (let u = 0; u < y; ++u) {
      const e = Math.pow(0.99, u),
        s = Math.max(1 - e, (u + 1) / y);
      ($(f, e, s), N(f, e, s));
    }
  }
  function N(i, f, u) {
    for (let e = 1, s = i.length; e < s; ++e) {
      const m = i[e];
      for (const b of m) {
        let E = 0,
          V = 0;
        for (const { source: Y, value: et } of b.targetLinks) {
          let H = et * (b.layer - Y.layer);
          ((E += I(Y, b) * H), (V += H));
        }
        if (!(V > 0)) continue;
        let G = (E / V - b.y0) * f;
        ((b.y0 += G), (b.y1 += G), j(b));
      }
      (a === void 0 && m.sort(K), C(m, u));
    }
  }
  function $(i, f, u) {
    for (let e = i.length, s = e - 2; s >= 0; --s) {
      const m = i[s];
      for (const b of m) {
        let E = 0,
          V = 0;
        for (const { target: Y, value: et } of b.sourceLinks) {
          let H = et * (Y.layer - b.layer);
          ((E += L(b, Y) * H), (V += H));
        }
        if (!(V > 0)) continue;
        let G = (E / V - b.y0) * f;
        ((b.y0 += G), (b.y1 += G), j(b));
      }
      (a === void 0 && m.sort(K), C(m, u));
    }
  }
  function C(i, f) {
    const u = i.length >> 1,
      e = i[u];
    (B(i, e.y0 - p, u - 1, f), D(i, e.y1 + p, u + 1, f), B(i, l, i.length - 1, f), D(i, n, 0, f));
  }
  function D(i, f, u, e) {
    for (; u < i.length; ++u) {
      const s = i[u],
        m = (f - s.y0) * e;
      (m > 1e-6 && ((s.y0 += m), (s.y1 += m)), (f = s.y1 + p));
    }
  }
  function B(i, f, u, e) {
    for (; u >= 0; --u) {
      const s = i[u],
        m = (s.y1 - f) * e;
      (m > 1e-6 && ((s.y0 -= m), (s.y1 -= m)), (f = s.y0 - p));
    }
  }
  function j({ sourceLinks: i, targetLinks: f }) {
    if (c === void 0) {
      for (const {
        source: { sourceLinks: u },
      } of f)
        u.sort(ht);
      for (const {
        target: { targetLinks: u },
      } of i)
        u.sort(ut);
    }
  }
  function S(i) {
    if (c === void 0) for (const { sourceLinks: f, targetLinks: u } of i) (f.sort(ht), u.sort(ut));
  }
  function I(i, f) {
    let u = i.y0 - ((i.sourceLinks.length - 1) * p) / 2;
    for (const { target: e, width: s } of i.sourceLinks) {
      if (e === f) break;
      u += s + p;
    }
    for (const { source: e, width: s } of f.targetLinks) {
      if (e === i) break;
      u -= s;
    }
    return u;
  }
  function L(i, f) {
    let u = f.y0 - ((f.targetLinks.length - 1) * p) / 2;
    for (const { source: e, width: s } of f.targetLinks) {
      if (e === i) break;
      u += s + p;
    }
    for (const { target: e, width: s } of i.sourceLinks) {
      if (e === f) break;
      u -= s;
    }
    return u;
  }
  return v;
}
var st = Math.PI,
  rt = 2 * st,
  F = 1e-6,
  Bt = rt - F;
function ot() {
  ((this._x0 = this._y0 = this._x1 = this._y1 = null), (this._ = ""));
}
function kt() {
  return new ot();
}
ot.prototype = kt.prototype = {
  constructor: ot,
  moveTo: function (t, n) {
    this._ += "M" + (this._x0 = this._x1 = +t) + "," + (this._y0 = this._y1 = +n);
  },
  closePath: function () {
    this._x1 !== null && ((this._x1 = this._x0), (this._y1 = this._y0), (this._ += "Z"));
  },
  lineTo: function (t, n) {
    this._ += "L" + (this._x1 = +t) + "," + (this._y1 = +n);
  },
  quadraticCurveTo: function (t, n, r, l) {
    this._ += "Q" + +t + "," + +n + "," + (this._x1 = +r) + "," + (this._y1 = +l);
  },
  bezierCurveTo: function (t, n, r, l, h, d) {
    this._ += "C" + +t + "," + +n + "," + +r + "," + +l + "," + (this._x1 = +h) + "," + (this._y1 = +d);
  },
  arcTo: function (t, n, r, l, h) {
    ((t = +t), (n = +n), (r = +r), (l = +l), (h = +h));
    var d = this._x1,
      p = this._y1,
      k = r - t,
      o = l - n,
      a = d - t,
      c = p - n,
      _ = a * a + c * c;
    if (h < 0) throw new Error("negative radius: " + h);
    if (this._x1 === null) this._ += "M" + (this._x1 = t) + "," + (this._y1 = n);
    else if (_ > F)
      if (!(Math.abs(c * k - o * a) > F) || !h) this._ += "L" + (this._x1 = t) + "," + (this._y1 = n);
      else {
        var x = r - d,
          y = l - p,
          v = k * k + o * o,
          A = x * x + y * y,
          T = Math.sqrt(v),
          M = Math.sqrt(_),
          P = h * Math.tan((st - Math.acos((v + _ - A) / (2 * T * M))) / 2),
          O = P / M,
          R = P / T;
        (Math.abs(O - 1) > F && (this._ += "L" + (t + O * a) + "," + (n + O * c)),
          (this._ +=
            "A" +
            h +
            "," +
            h +
            ",0,0," +
            +(c * x > a * y) +
            "," +
            (this._x1 = t + R * k) +
            "," +
            (this._y1 = n + R * o)));
      }
  },
  arc: function (t, n, r, l, h, d) {
    ((t = +t), (n = +n), (r = +r), (d = !!d));
    var p = r * Math.cos(l),
      k = r * Math.sin(l),
      o = t + p,
      a = n + k,
      c = 1 ^ d,
      _ = d ? l - h : h - l;
    if (r < 0) throw new Error("negative radius: " + r);
    (this._x1 === null
      ? (this._ += "M" + o + "," + a)
      : (Math.abs(this._x1 - o) > F || Math.abs(this._y1 - a) > F) && (this._ += "L" + o + "," + a),
      r &&
        (_ < 0 && (_ = (_ % rt) + rt),
        _ > Bt
          ? (this._ +=
              "A" +
              r +
              "," +
              r +
              ",0,1," +
              c +
              "," +
              (t - p) +
              "," +
              (n - k) +
              "A" +
              r +
              "," +
              r +
              ",0,1," +
              c +
              "," +
              (this._x1 = o) +
              "," +
              (this._y1 = a))
          : _ > F &&
            (this._ +=
              "A" +
              r +
              "," +
              r +
              ",0," +
              +(_ >= st) +
              "," +
              c +
              "," +
              (this._x1 = t + r * Math.cos(h)) +
              "," +
              (this._y1 = n + r * Math.sin(h)))));
  },
  rect: function (t, n, r, l) {
    this._ +=
      "M" + (this._x0 = this._x1 = +t) + "," + (this._y0 = this._y1 = +n) + "h" + +r + "v" + +l + "h" + -r + "Z";
  },
  toString: function () {
    return this._;
  },
};
function dt(t) {
  return function () {
    return t;
  };
}
function Vt(t) {
  return t[0];
}
function Ft(t) {
  return t[1];
}
var Wt = Array.prototype.slice;
function Ut(t) {
  return t.source;
}
function Gt(t) {
  return t.target;
}
function Yt(t) {
  var n = Ut,
    r = Gt,
    l = Vt,
    h = Ft,
    d = null;
  function p() {
    var k,
      o = Wt.call(arguments),
      a = n.apply(this, o),
      c = r.apply(this, o);
    if (
      (d || (d = k = kt()),
      t(d, +l.apply(this, ((o[0] = a), o)), +h.apply(this, o), +l.apply(this, ((o[0] = c), o)), +h.apply(this, o)),
      k)
    )
      return ((d = null), k + "" || null);
  }
  return (
    (p.source = function (k) {
      return arguments.length ? ((n = k), p) : n;
    }),
    (p.target = function (k) {
      return arguments.length ? ((r = k), p) : r;
    }),
    (p.x = function (k) {
      return arguments.length ? ((l = typeof k == "function" ? k : dt(+k)), p) : l;
    }),
    (p.y = function (k) {
      return arguments.length ? ((h = typeof k == "function" ? k : dt(+k)), p) : h;
    }),
    (p.context = function (k) {
      return arguments.length ? ((d = k == null ? null : k), p) : d;
    }),
    p
  );
}
function Ht(t, n, r, l, h) {
  (t.moveTo(n, r), t.bezierCurveTo((n = (n + l) / 2), r, n, h, l, h));
}
function Xt() {
  return Yt(Ht);
}
function qt(t) {
  return [t.source.x1, t.y0];
}
function Kt(t) {
  return [t.target.x0, t.y1];
}
function Qt() {
  return Xt().source(qt).target(Kt);
}
var at = (function () {
  var t = g(function (k, o, a, c) {
      for (a = a || {}, c = k.length; c--; a[k[c]] = o);
      return a;
    }, "o"),
    n = [1, 9],
    r = [1, 10],
    l = [1, 5, 10, 12],
    h = {
      trace: g(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        SANKEY: 4,
        NEWLINE: 5,
        csv: 6,
        opt_eof: 7,
        record: 8,
        csv_tail: 9,
        EOF: 10,
        "field[source]": 11,
        COMMA: 12,
        "field[target]": 13,
        "field[value]": 14,
        field: 15,
        escaped: 16,
        non_escaped: 17,
        DQUOTE: 18,
        ESCAPED_TEXT: 19,
        NON_ESCAPED_TEXT: 20,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        4: "SANKEY",
        5: "NEWLINE",
        10: "EOF",
        11: "field[source]",
        12: "COMMA",
        13: "field[target]",
        14: "field[value]",
        18: "DQUOTE",
        19: "ESCAPED_TEXT",
        20: "NON_ESCAPED_TEXT",
      },
      productions_: [0, [3, 4], [6, 2], [9, 2], [9, 0], [7, 1], [7, 0], [8, 5], [15, 1], [15, 1], [16, 3], [17, 1]],
      performAction: g(function (o, a, c, _, x, y, v) {
        var A = y.length - 1;
        switch (x) {
          case 7:
            const T = _.findOrCreateNode(y[A - 4].trim().replaceAll('""', '"')),
              M = _.findOrCreateNode(y[A - 2].trim().replaceAll('""', '"')),
              P = parseFloat(y[A].trim());
            _.addLink(T, M, P);
            break;
          case 8:
          case 9:
          case 11:
            this.$ = y[A];
            break;
          case 10:
            this.$ = y[A - 1];
            break;
        }
      }, "anonymous"),
      table: [
        { 3: 1, 4: [1, 2] },
        { 1: [3] },
        { 5: [1, 3] },
        { 6: 4, 8: 5, 15: 6, 16: 7, 17: 8, 18: n, 20: r },
        { 1: [2, 6], 7: 11, 10: [1, 12] },
        t(r, [2, 4], { 9: 13, 5: [1, 14] }),
        { 12: [1, 15] },
        t(l, [2, 8]),
        t(l, [2, 9]),
        { 19: [1, 16] },
        t(l, [2, 11]),
        { 1: [2, 1] },
        { 1: [2, 5] },
        t(r, [2, 2]),
        { 6: 17, 8: 5, 15: 6, 16: 7, 17: 8, 18: n, 20: r },
        { 15: 18, 16: 7, 17: 8, 18: n, 20: r },
        { 18: [1, 19] },
        t(r, [2, 3]),
        { 12: [1, 20] },
        t(l, [2, 10]),
        { 15: 21, 16: 7, 17: 8, 18: n, 20: r },
        t([1, 5, 10], [2, 7]),
      ],
      defaultActions: { 11: [2, 1], 12: [2, 5] },
      parseError: g(function (o, a) {
        if (a.recoverable) this.trace(o);
        else {
          var c = new Error(o);
          throw ((c.hash = a), c);
        }
      }, "parseError"),
      parse: g(function (o) {
        var a = this,
          c = [0],
          _ = [],
          x = [null],
          y = [],
          v = this.table,
          A = "",
          T = 0,
          M = 0,
          P = 2,
          O = 1,
          R = y.slice.call(arguments, 1),
          w = Object.create(this.lexer),
          N = { yy: {} };
        for (var $ in this.yy) Object.prototype.hasOwnProperty.call(this.yy, $) && (N.yy[$] = this.yy[$]);
        (w.setInput(o, N.yy), (N.yy.lexer = w), (N.yy.parser = this), typeof w.yylloc > "u" && (w.yylloc = {}));
        var C = w.yylloc;
        y.push(C);
        var D = w.options && w.options.ranges;
        typeof N.yy.parseError == "function"
          ? (this.parseError = N.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function B(E) {
          ((c.length = c.length - 2 * E), (x.length = x.length - E), (y.length = y.length - E));
        }
        g(B, "popStack");
        function j() {
          var E;
          return (
            (E = _.pop() || w.lex() || O),
            typeof E != "number" && (E instanceof Array && ((_ = E), (E = _.pop())), (E = a.symbols_[E] || E)),
            E
          );
        }
        g(j, "lex");
        for (var S, I, L, i, f = {}, u, e, s, m; ;) {
          if (
            ((I = c[c.length - 1]),
            this.defaultActions[I]
              ? (L = this.defaultActions[I])
              : ((S === null || typeof S > "u") && (S = j()), (L = v[I] && v[I][S])),
            typeof L > "u" || !L.length || !L[0])
          ) {
            var b = "";
            m = [];
            for (u in v[I]) this.terminals_[u] && u > P && m.push("'" + this.terminals_[u] + "'");
            (w.showPosition
              ? (b =
                  "Parse error on line " +
                  (T + 1) +
                  `:
` +
                  w.showPosition() +
                  `
Expecting ` +
                  m.join(", ") +
                  ", got '" +
                  (this.terminals_[S] || S) +
                  "'")
              : (b =
                  "Parse error on line " +
                  (T + 1) +
                  ": Unexpected " +
                  (S == O ? "end of input" : "'" + (this.terminals_[S] || S) + "'")),
              this.parseError(b, {
                text: w.match,
                token: this.terminals_[S] || S,
                line: w.yylineno,
                loc: C,
                expected: m,
              }));
          }
          if (L[0] instanceof Array && L.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + I + ", token: " + S);
          switch (L[0]) {
            case 1:
              (c.push(S),
                x.push(w.yytext),
                y.push(w.yylloc),
                c.push(L[1]),
                (S = null),
                (M = w.yyleng),
                (A = w.yytext),
                (T = w.yylineno),
                (C = w.yylloc));
              break;
            case 2:
              if (
                ((e = this.productions_[L[1]][1]),
                (f.$ = x[x.length - e]),
                (f._$ = {
                  first_line: y[y.length - (e || 1)].first_line,
                  last_line: y[y.length - 1].last_line,
                  first_column: y[y.length - (e || 1)].first_column,
                  last_column: y[y.length - 1].last_column,
                }),
                D && (f._$.range = [y[y.length - (e || 1)].range[0], y[y.length - 1].range[1]]),
                (i = this.performAction.apply(f, [A, M, T, N.yy, L[1], x, y].concat(R))),
                typeof i < "u")
              )
                return i;
              (e && ((c = c.slice(0, -1 * e * 2)), (x = x.slice(0, -1 * e)), (y = y.slice(0, -1 * e))),
                c.push(this.productions_[L[1]][0]),
                x.push(f.$),
                y.push(f._$),
                (s = v[c[c.length - 2]][c[c.length - 1]]),
                c.push(s));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    d = (function () {
      var k = {
        EOF: 1,
        parseError: g(function (a, c) {
          if (this.yy.parser) this.yy.parser.parseError(a, c);
          else throw new Error(a);
        }, "parseError"),
        setInput: g(function (o, a) {
          return (
            (this.yy = a || this.yy || {}),
            (this._input = o),
            (this._more = this._backtrack = this.done = !1),
            (this.yylineno = this.yyleng = 0),
            (this.yytext = this.matched = this.match = ""),
            (this.conditionStack = ["INITIAL"]),
            (this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 }),
            this.options.ranges && (this.yylloc.range = [0, 0]),
            (this.offset = 0),
            this
          );
        }, "setInput"),
        input: g(function () {
          var o = this._input[0];
          ((this.yytext += o), this.yyleng++, this.offset++, (this.match += o), (this.matched += o));
          var a = o.match(/(?:\r\n?|\n).*/g);
          return (
            a ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            o
          );
        }, "input"),
        unput: g(function (o) {
          var a = o.length,
            c = o.split(/(?:\r\n?|\n)/g);
          ((this._input = o + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - a)),
            (this.offset -= a));
          var _ = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            c.length - 1 && (this.yylineno -= c.length - 1));
          var x = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: c
                ? (c.length === _.length ? this.yylloc.first_column : 0) + _[_.length - c.length].length - c[0].length
                : this.yylloc.first_column - a,
            }),
            this.options.ranges && (this.yylloc.range = [x[0], x[0] + this.yyleng - a]),
            (this.yyleng = this.yytext.length),
            this
          );
        }, "unput"),
        more: g(function () {
          return ((this._more = !0), this);
        }, "more"),
        reject: g(function () {
          if (this.options.backtrack_lexer) this._backtrack = !0;
          else
            return this.parseError(
              "Lexical error on line " +
                (this.yylineno + 1) +
                `. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
` +
                this.showPosition(),
              { text: "", token: null, line: this.yylineno },
            );
          return this;
        }, "reject"),
        less: g(function (o) {
          this.unput(this.match.slice(o));
        }, "less"),
        pastInput: g(function () {
          var o = this.matched.substr(0, this.matched.length - this.match.length);
          return (o.length > 20 ? "..." : "") + o.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: g(function () {
          var o = this.match;
          return (
            o.length < 20 && (o += this._input.substr(0, 20 - o.length)),
            (o.substr(0, 20) + (o.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: g(function () {
          var o = this.pastInput(),
            a = new Array(o.length + 1).join("-");
          return (
            o +
            this.upcomingInput() +
            `
` +
            a +
            "^"
          );
        }, "showPosition"),
        test_match: g(function (o, a) {
          var c, _, x;
          if (
            (this.options.backtrack_lexer &&
              ((x = {
                yylineno: this.yylineno,
                yylloc: {
                  first_line: this.yylloc.first_line,
                  last_line: this.last_line,
                  first_column: this.yylloc.first_column,
                  last_column: this.yylloc.last_column,
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done,
              }),
              this.options.ranges && (x.yylloc.range = this.yylloc.range.slice(0))),
            (_ = o[0].match(/(?:\r\n?|\n).*/g)),
            _ && (this.yylineno += _.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: _
                ? _[_.length - 1].length - _[_.length - 1].match(/\r?\n?/)[0].length
                : this.yylloc.last_column + o[0].length,
            }),
            (this.yytext += o[0]),
            (this.match += o[0]),
            (this.matches = o),
            (this.yyleng = this.yytext.length),
            this.options.ranges && (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
            (this._more = !1),
            (this._backtrack = !1),
            (this._input = this._input.slice(o[0].length)),
            (this.matched += o[0]),
            (c = this.performAction.call(this, this.yy, this, a, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            c)
          )
            return c;
          if (this._backtrack) {
            for (var y in x) this[y] = x[y];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: g(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var o, a, c, _;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var x = this._currentRules(), y = 0; y < x.length; y++)
            if (((c = this._input.match(this.rules[x[y]])), c && (!a || c[0].length > a[0].length))) {
              if (((a = c), (_ = y), this.options.backtrack_lexer)) {
                if (((o = this.test_match(c, x[y])), o !== !1)) return o;
                if (this._backtrack) {
                  a = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return a
            ? ((o = this.test_match(a, x[_])), o !== !1 ? o : !1)
            : this._input === ""
              ? this.EOF
              : this.parseError(
                  "Lexical error on line " +
                    (this.yylineno + 1) +
                    `. Unrecognized text.
` +
                    this.showPosition(),
                  { text: "", token: null, line: this.yylineno },
                );
        }, "next"),
        lex: g(function () {
          var a = this.next();
          return a || this.lex();
        }, "lex"),
        begin: g(function (a) {
          this.conditionStack.push(a);
        }, "begin"),
        popState: g(function () {
          var a = this.conditionStack.length - 1;
          return a > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: g(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: g(function (a) {
          return ((a = this.conditionStack.length - 1 - Math.abs(a || 0)), a >= 0 ? this.conditionStack[a] : "INITIAL");
        }, "topState"),
        pushState: g(function (a) {
          this.begin(a);
        }, "pushState"),
        stateStackSize: g(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: g(function (a, c, _, x) {
          switch (_) {
            case 0:
              return (this.pushState("csv"), 4);
            case 1:
              return (this.pushState("csv"), 4);
            case 2:
              return 10;
            case 3:
              return 5;
            case 4:
              return 12;
            case 5:
              return (this.pushState("escaped_text"), 18);
            case 6:
              return 20;
            case 7:
              return (this.popState("escaped_text"), 18);
            case 8:
              return 19;
          }
        }, "anonymous"),
        rules: [
          /^(?:sankey-beta\b)/i,
          /^(?:sankey\b)/i,
          /^(?:$)/i,
          /^(?:((\u000D\u000A)|(\u000A)))/i,
          /^(?:(\u002C))/i,
          /^(?:(\u0022))/i,
          /^(?:([\u0020-\u0021\u0023-\u002B\u002D-\u007E])*)/i,
          /^(?:(\u0022)(?!(\u0022)))/i,
          /^(?:(([\u0020-\u0021\u0023-\u002B\u002D-\u007E])|(\u002C)|(\u000D)|(\u000A)|(\u0022)(\u0022))*)/i,
        ],
        conditions: {
          csv: { rules: [2, 3, 4, 5, 6, 7, 8], inclusive: !1 },
          escaped_text: { rules: [7, 8], inclusive: !1 },
          INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8], inclusive: !0 },
        },
      };
      return k;
    })();
  h.lexer = d;
  function p() {
    this.yy = {};
  }
  return (g(p, "Parser"), (p.prototype = h), (h.Parser = p), new p());
})();
at.parser = at;
var Q = at,
  J = [],
  tt = [],
  Z = new Map(),
  Zt = g(() => {
    ((J = []), (tt = []), (Z = new Map()), Tt());
  }, "clear"),
  W,
  Jt =
    ((W = class {
      constructor(n, r, l = 0) {
        ((this.source = n), (this.target = r), (this.value = l));
      }
    }),
    g(W, "SankeyLink"),
    W),
  te = g((t, n, r) => {
    J.push(new Jt(t, n, r));
  }, "addLink"),
  U,
  ee =
    ((U = class {
      constructor(n) {
        this.ID = n;
      }
    }),
    g(U, "SankeyNode"),
    U),
  ne = g((t) => {
    t = At.sanitizeText(t, lt());
    let n = Z.get(t);
    return (n === void 0 && ((n = new ee(t)), Z.set(t, n), tt.push(n)), n);
  }, "findOrCreateNode"),
  ie = g(() => tt, "getNodes"),
  se = g(() => J, "getLinks"),
  re = g(
    () => ({
      nodes: tt.map((t) => ({ id: t.ID })),
      links: J.map((t) => ({ source: t.source.ID, target: t.target.ID, value: t.value })),
    }),
    "getGraph",
  ),
  oe = {
    nodesMap: Z,
    getConfig: g(() => lt().sankey, "getConfig"),
    getNodes: ie,
    getLinks: se,
    getGraph: re,
    addLink: te,
    findOrCreateNode: ne,
    getAccTitle: St,
    setAccTitle: wt,
    getAccDescription: bt,
    setAccDescription: vt,
    getDiagramTitle: xt,
    setDiagramTitle: _t,
    clear: Zt,
  },
  z,
  gt =
    ((z = class {
      static next(n) {
        return new z(n + ++z.count);
      }
      constructor(n) {
        ((this.id = n), (this.href = `#${n}`));
      }
      toString() {
        return "url(" + this.href + ")";
      }
    }),
    g(z, "Uid"),
    (z.count = 0),
    z),
  ae = { left: Ct, right: Dt, center: Ot, justify: mt },
  le = g(function (t, n, r, l) {
    var B, j, S, I, L, i, f, u;
    const { securityLevel: h, sankey: d } = lt(),
      p = Et.sankey;
    let k;
    h === "sandbox" && (k = X("#i" + n));
    const o = h === "sandbox" ? X(k.nodes()[0].contentDocument.body) : X("body"),
      a = h === "sandbox" ? o.select(`[id="${n}"]`) : X(`[id="${n}"]`),
      c = (B = d == null ? void 0 : d.width) != null ? B : p.width,
      _ = (j = d == null ? void 0 : d.height) != null ? j : p.width,
      x = (S = d == null ? void 0 : d.useMaxWidth) != null ? S : p.useMaxWidth,
      y = (I = d == null ? void 0 : d.nodeAlignment) != null ? I : p.nodeAlignment,
      v = (L = d == null ? void 0 : d.prefix) != null ? L : p.prefix,
      A = (i = d == null ? void 0 : d.suffix) != null ? i : p.suffix,
      T = (f = d == null ? void 0 : d.showValues) != null ? f : p.showValues,
      M = l.db.getGraph(),
      P = ae[y];
    Rt()
      .nodeId((e) => e.id)
      .nodeWidth(10)
      .nodePadding(10 + (T ? 15 : 0))
      .nodeAlign(P)
      .extent([
        [0, 0],
        [c, _],
      ])(M);
    const w = Mt(Nt);
    a.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(M.nodes)
      .join("g")
      .attr("class", "node")
      .attr("id", (e) => (e.uid = gt.next("node-")).id)
      .attr("transform", function (e) {
        return "translate(" + e.x0 + "," + e.y0 + ")";
      })
      .attr("x", (e) => e.x0)
      .attr("y", (e) => e.y0)
      .append("rect")
      .attr("height", (e) => e.y1 - e.y0)
      .attr("width", (e) => e.x1 - e.x0)
      .attr("fill", (e) => w(e.id));
    const N = g(
      ({ id: e, value: s }) =>
        T
          ? `${e}
${v}${Math.round(s * 100) / 100}${A}`
          : e,
      "getText",
    );
    a.append("g")
      .attr("class", "node-labels")
      .attr("font-size", 14)
      .selectAll("text")
      .data(M.nodes)
      .join("text")
      .attr("x", (e) => (e.x0 < c / 2 ? e.x1 + 6 : e.x0 - 6))
      .attr("y", (e) => (e.y1 + e.y0) / 2)
      .attr("dy", `${T ? "0" : "0.35"}em`)
      .attr("text-anchor", (e) => (e.x0 < c / 2 ? "start" : "end"))
      .text(N);
    const $ = a
        .append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll(".link")
        .data(M.links)
        .join("g")
        .attr("class", "link")
        .style("mix-blend-mode", "multiply"),
      C = (u = d == null ? void 0 : d.linkColor) != null ? u : "gradient";
    if (C === "gradient") {
      const e = $.append("linearGradient")
        .attr("id", (s) => (s.uid = gt.next("linearGradient-")).id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (s) => s.source.x1)
        .attr("x2", (s) => s.target.x0);
      (e
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (s) => w(s.source.id)),
        e
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", (s) => w(s.target.id)));
    }
    let D;
    switch (C) {
      case "gradient":
        D = g((e) => e.uid, "coloring");
        break;
      case "source":
        D = g((e) => w(e.source.id), "coloring");
        break;
      case "target":
        D = g((e) => w(e.target.id), "coloring");
        break;
      default:
        D = C;
    }
    ($.append("path")
      .attr("d", Qt())
      .attr("stroke", D)
      .attr("stroke-width", (e) => Math.max(1, e.width)),
      Lt(void 0, a, 0, x));
  }, "draw"),
  ce = { draw: le },
  ue = g(
    (t) =>
      t
        .replaceAll(/^[^\S\n\r]+|[^\S\n\r]+$/g, "")
        .replaceAll(
          /([\n\r])+/g,
          `
`,
        )
        .trim(),
    "prepareTextForParsing",
  ),
  he = g(
    (t) => `.label {
      font-family: ${t.fontFamily};
    }`,
    "getStyles",
  ),
  fe = he,
  ye = Q.parse.bind(Q);
Q.parse = (t) => ye(ue(t));
var ke = { styles: fe, parser: Q, db: oe, renderer: ce };
export { ke as diagram };
