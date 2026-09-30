import { s as pe } from "./chunk-NRVI72HA-CeqxjBWY.js";
import {
  _ as C,
  a7 as ne,
  a8 as le,
  ab as fe,
  D as ge,
  B as K,
  cw as B,
  z as j,
  x as me,
  w as ye,
  V as Se,
  W as ve,
  v as xe,
  t as be,
  a9 as we,
  cx as Ce,
  a0 as Te,
} from "./VscTheme-B-CSeuv5.js";
import { p as Le } from "./chunk-ANTBXLJU-CTfKZ_Qj.js";
import { p as $e } from "./treemap-75Q7IDZK-B-05wwdi.js";
import { b as O } from "./defaultLocale-DLjId3QZ.js";
import { o as J } from "./ordinal-CMIbhwg4.js";
import "./registry-CHHSpXp3.js";
import "./_baseUniq-B4kfiVVD.js";
import "./_basePickBy-BL7sFKyx.js";
import "./clone-CIq-NCRc.js";
import "./init-BVqZKxlz.js";
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
  t.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
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
      a = new t.Error().stack;
    a &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[a] = "4cd189b7-799a-4a07-becd-d543852561fd"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-4cd189b7-799a-4a07-becd-d543852561fd"));
  })();
} catch {}
function Ae(t) {
  var a = 0,
    l = t.children,
    n = l && l.length;
  if (!n) a = 1;
  else for (; --n >= 0;) a += l[n].value;
  t.value = a;
}
function _e() {
  return this.eachAfter(Ae);
}
function ke(t, a) {
  let l = -1;
  for (const n of this) t.call(a, n, ++l, this);
  return this;
}
function Fe(t, a) {
  for (var l = this, n = [l], o, c, d = -1; (l = n.pop());)
    if ((t.call(a, l, ++d, this), (o = l.children))) for (c = o.length - 1; c >= 0; --c) n.push(o[c]);
  return this;
}
function Ne(t, a) {
  for (var l = this, n = [l], o = [], c, d, h, g = -1; (l = n.pop());)
    if ((o.push(l), (c = l.children))) for (d = 0, h = c.length; d < h; ++d) n.push(c[d]);
  for (; (l = o.pop());) t.call(a, l, ++g, this);
  return this;
}
function Me(t, a) {
  let l = -1;
  for (const n of this) if (t.call(a, n, ++l, this)) return n;
}
function ze(t) {
  return this.eachAfter(function (a) {
    for (var l = +t(a.data) || 0, n = a.children, o = n && n.length; --o >= 0;) l += n[o].value;
    a.value = l;
  });
}
function De(t) {
  return this.eachBefore(function (a) {
    a.children && a.children.sort(t);
  });
}
function Ve(t) {
  for (var a = this, l = Be(a, t), n = [a]; a !== l;) ((a = a.parent), n.push(a));
  for (var o = n.length; t !== l;) (n.splice(o, 0, t), (t = t.parent));
  return n;
}
function Be(t, a) {
  if (t === a) return t;
  var l = t.ancestors(),
    n = a.ancestors(),
    o = null;
  for (t = l.pop(), a = n.pop(); t === a;) ((o = t), (t = l.pop()), (a = n.pop()));
  return o;
}
function Ee() {
  for (var t = this, a = [t]; (t = t.parent);) a.push(t);
  return a;
}
function Pe() {
  return Array.from(this);
}
function Re() {
  var t = [];
  return (
    this.eachBefore(function (a) {
      a.children || t.push(a);
    }),
    t
  );
}
function Ie() {
  var t = this,
    a = [];
  return (
    t.each(function (l) {
      l !== t && a.push({ source: l.parent, target: l });
    }),
    a
  );
}
function* We() {
  var t = this,
    a,
    l = [t],
    n,
    o,
    c;
  do
    for (a = l.reverse(), l = []; (t = a.pop());)
      if ((yield t, (n = t.children))) for (o = 0, c = n.length; o < c; ++o) l.push(n[o]);
  while (l.length);
}
function Q(t, a) {
  t instanceof Map ? ((t = [void 0, t]), a === void 0 && (a = Ge)) : a === void 0 && (a = Oe);
  for (var l = new U(t), n, o = [l], c, d, h, g; (n = o.pop());)
    if ((d = a(n.data)) && (g = (d = Array.from(d)).length))
      for (n.children = d, h = g - 1; h >= 0; --h)
        (o.push((c = d[h] = new U(d[h]))), (c.parent = n), (c.depth = n.depth + 1));
  return l.eachBefore(Xe);
}
function He() {
  return Q(this).eachBefore(qe);
}
function Oe(t) {
  return t.children;
}
function Ge(t) {
  return Array.isArray(t) ? t[1] : null;
}
function qe(t) {
  (t.data.value !== void 0 && (t.value = t.data.value), (t.data = t.data.data));
}
function Xe(t) {
  var a = 0;
  do t.height = a;
  while ((t = t.parent) && t.height < ++a);
}
function U(t) {
  ((this.data = t), (this.depth = this.height = 0), (this.parent = null));
}
U.prototype = Q.prototype = {
  constructor: U,
  count: _e,
  each: ke,
  eachAfter: Ne,
  eachBefore: Fe,
  find: Me,
  sum: ze,
  sort: De,
  path: Ve,
  ancestors: Ee,
  descendants: Pe,
  leaves: Re,
  links: Ie,
  copy: He,
  [Symbol.iterator]: We,
};
function Ye(t) {
  if (typeof t != "function") throw new Error();
  return t;
}
function G() {
  return 0;
}
function q(t) {
  return function () {
    return t;
  };
}
function je(t) {
  ((t.x0 = Math.round(t.x0)), (t.y0 = Math.round(t.y0)), (t.x1 = Math.round(t.x1)), (t.y1 = Math.round(t.y1)));
}
function Ue(t, a, l, n, o) {
  for (var c = t.children, d, h = -1, g = c.length, i = t.value && (n - a) / t.value; ++h < g;)
    ((d = c[h]), (d.y0 = l), (d.y1 = o), (d.x0 = a), (d.x1 = a += d.value * i));
}
function Ze(t, a, l, n, o) {
  for (var c = t.children, d, h = -1, g = c.length, i = t.value && (o - l) / t.value; ++h < g;)
    ((d = c[h]), (d.x0 = a), (d.x1 = n), (d.y0 = l), (d.y1 = l += d.value * i));
}
var Je = (1 + Math.sqrt(5)) / 2;
function Ke(t, a, l, n, o, c) {
  for (var d = [], h = a.children, g, i, u = 0, m = 0, r = h.length, y, S, v = a.value, p, x, F, k, D, R, N; u < r;) {
    ((y = o - l), (S = c - n));
    do p = h[m++].value;
    while (!p && m < r);
    for (x = F = p, R = Math.max(S / y, y / S) / (v * t), N = p * p * R, D = Math.max(F / N, N / x); m < r; ++m) {
      if (
        ((p += i = h[m].value),
        i < x && (x = i),
        i > F && (F = i),
        (N = p * p * R),
        (k = Math.max(F / N, N / x)),
        k > D)
      ) {
        p -= i;
        break;
      }
      D = k;
    }
    (d.push((g = { value: p, dice: y < S, children: h.slice(u, m) })),
      g.dice ? Ue(g, l, n, o, v ? (n += (S * p) / v) : c) : Ze(g, l, n, v ? (l += (y * p) / v) : o, c),
      (v -= p),
      (u = m));
  }
  return d;
}
const Qe = (function t(a) {
  function l(n, o, c, d, h) {
    Ke(a, n, o, c, d, h);
  }
  return (
    (l.ratio = function (n) {
      return t((n = +n) > 1 ? n : 1);
    }),
    l
  );
})(Je);
function et() {
  var t = Qe,
    a = !1,
    l = 1,
    n = 1,
    o = [0],
    c = G,
    d = G,
    h = G,
    g = G,
    i = G;
  function u(r) {
    return ((r.x0 = r.y0 = 0), (r.x1 = l), (r.y1 = n), r.eachBefore(m), (o = [0]), a && r.eachBefore(je), r);
  }
  function m(r) {
    var y = o[r.depth],
      S = r.x0 + y,
      v = r.y0 + y,
      p = r.x1 - y,
      x = r.y1 - y;
    (p < S && (S = p = (S + p) / 2),
      x < v && (v = x = (v + x) / 2),
      (r.x0 = S),
      (r.y0 = v),
      (r.x1 = p),
      (r.y1 = x),
      r.children &&
        ((y = o[r.depth + 1] = c(r) / 2),
        (S += i(r) - y),
        (v += d(r) - y),
        (p -= h(r) - y),
        (x -= g(r) - y),
        p < S && (S = p = (S + p) / 2),
        x < v && (v = x = (v + x) / 2),
        t(r, S, v, p, x)));
  }
  return (
    (u.round = function (r) {
      return arguments.length ? ((a = !!r), u) : a;
    }),
    (u.size = function (r) {
      return arguments.length ? ((l = +r[0]), (n = +r[1]), u) : [l, n];
    }),
    (u.tile = function (r) {
      return arguments.length ? ((t = Ye(r)), u) : t;
    }),
    (u.padding = function (r) {
      return arguments.length ? u.paddingInner(r).paddingOuter(r) : u.paddingInner();
    }),
    (u.paddingInner = function (r) {
      return arguments.length ? ((c = typeof r == "function" ? r : q(+r)), u) : c;
    }),
    (u.paddingOuter = function (r) {
      return arguments.length ? u.paddingTop(r).paddingRight(r).paddingBottom(r).paddingLeft(r) : u.paddingTop();
    }),
    (u.paddingTop = function (r) {
      return arguments.length ? ((d = typeof r == "function" ? r : q(+r)), u) : d;
    }),
    (u.paddingRight = function (r) {
      return arguments.length ? ((h = typeof r == "function" ? r : q(+r)), u) : h;
    }),
    (u.paddingBottom = function (r) {
      return arguments.length ? ((g = typeof r == "function" ? r : q(+r)), u) : g;
    }),
    (u.paddingLeft = function (r) {
      return arguments.length ? ((i = typeof r == "function" ? r : q(+r)), u) : i;
    }),
    u
  );
}
var P,
  re =
    ((P = class {
      constructor() {
        ((this.nodes = []),
          (this.levels = new Map()),
          (this.outerNodes = []),
          (this.classes = new Map()),
          (this.setAccTitle = me),
          (this.getAccTitle = ye),
          (this.setDiagramTitle = Se),
          (this.getDiagramTitle = ve),
          (this.getAccDescription = xe),
          (this.setAccDescription = be));
      }
      getNodes() {
        return this.nodes;
      }
      getConfig() {
        var n;
        const a = we,
          l = le();
        return ne({ ...a.treemap, ...((n = l.treemap) != null ? n : {}) });
      }
      addNode(a, l) {
        var n;
        (this.nodes.push(a),
          this.levels.set(a, l),
          l === 0 && (this.outerNodes.push(a), (n = this.root) != null || (this.root = a)));
      }
      getRoot() {
        return { name: "", children: this.outerNodes };
      }
      addClass(a, l) {
        var c;
        const n = (c = this.classes.get(a)) != null ? c : { id: a, styles: [], textStyles: [] },
          o = l.replace(/\\,/g, "§§§").replace(/,/g, ";").replace(/§§§/g, ",").split(";");
        (o &&
          o.forEach((d) => {
            (Ce(d) && (n != null && n.textStyles ? n.textStyles.push(d) : (n.textStyles = [d])),
              n != null && n.styles ? n.styles.push(d) : (n.styles = [d]));
          }),
          this.classes.set(a, n));
      }
      getClasses() {
        return this.classes;
      }
      getStylesForClass(a) {
        var l, n;
        return (n = (l = this.classes.get(a)) == null ? void 0 : l.styles) != null ? n : [];
      }
      clear() {
        (Te(),
          (this.nodes = []),
          (this.levels = new Map()),
          (this.outerNodes = []),
          (this.classes = new Map()),
          (this.root = void 0));
      }
    }),
    C(P, "TreeMapDB"),
    P);
function se(t) {
  if (!t.length) return [];
  const a = [],
    l = [];
  return (
    t.forEach((n) => {
      const o = { name: n.name, children: n.type === "Leaf" ? void 0 : [] };
      for (
        o.classSelector = n == null ? void 0 : n.classSelector,
          n != null && n.cssCompiledStyles && (o.cssCompiledStyles = [n.cssCompiledStyles]),
          n.type === "Leaf" && n.value !== void 0 && (o.value = n.value);
        l.length > 0 && l[l.length - 1].level >= n.level;
      )
        l.pop();
      if (l.length === 0) a.push(o);
      else {
        const c = l[l.length - 1].node;
        c.children ? c.children.push(o) : (c.children = [o]);
      }
      n.type !== "Leaf" && l.push({ node: o, level: n.level });
    }),
    a
  );
}
C(se, "buildHierarchy");
var tt = C((t, a) => {
    var c, d, h, g;
    Le(t, a);
    const l = [];
    for (const i of (c = t.TreemapRows) != null ? c : [])
      i.$type === "ClassDefStatement" &&
        a.addClass((d = i.className) != null ? d : "", (h = i.styleText) != null ? h : "");
    for (const i of (g = t.TreemapRows) != null ? g : []) {
      const u = i.item;
      if (!u) continue;
      const m = i.indent ? parseInt(i.indent) : 0,
        r = at(u),
        y = u.classSelector ? a.getStylesForClass(u.classSelector) : [],
        S = y.length > 0 ? y.join(";") : void 0,
        v = { level: m, name: r, type: u.$type, value: u.value, classSelector: u.classSelector, cssCompiledStyles: S };
      l.push(v);
    }
    const n = se(l),
      o = C((i, u) => {
        for (const m of i) (a.addNode(m, u), m.children && m.children.length > 0 && o(m.children, u + 1));
      }, "addNodesRecursively");
    o(n, 0);
  }, "populate"),
  at = C((t) => (t.name ? String(t.name) : ""), "getItemName"),
  ie = {
    parser: { yy: void 0 },
    parse: C(async (t) => {
      var a;
      try {
        const n = await $e("treemap", t);
        K.debug("Treemap AST:", n);
        const o = (a = ie.parser) == null ? void 0 : a.yy;
        if (!(o instanceof re))
          throw new Error(
            "parser.parser?.yy was not a TreemapDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.",
          );
        tt(n, o);
      } catch (l) {
        throw (K.error("Error parsing treemap:", l), l);
      }
    }, "parse"),
  },
  nt = 10,
  E = 10,
  X = 25,
  lt = C((t, a, l, n) => {
    var te, ae;
    const o = n.db,
      c = o.getConfig(),
      d = (te = c.padding) != null ? te : nt,
      h = o.getDiagramTitle(),
      g = o.getRoot(),
      { themeVariables: i } = le();
    if (!g) return;
    const u = h ? 30 : 0,
      m = fe(a),
      r = c.nodeWidth ? c.nodeWidth * E : 960,
      y = c.nodeHeight ? c.nodeHeight * E : 500,
      S = r,
      v = y + u;
    (m.attr("viewBox", `0 0 ${S} ${v}`), ge(m, v, S, c.useMaxWidth));
    let p;
    try {
      const e = c.valueFormat || ",";
      if (e === "$0,0") p = C((s) => "$" + O(",")(s), "valueFormat");
      else if (e.startsWith("$") && e.includes(",")) {
        const s = /\.\d+/.exec(e),
          f = s ? s[0] : "";
        p = C((w) => "$" + O("," + f)(w), "valueFormat");
      } else if (e.startsWith("$")) {
        const s = e.substring(1);
        p = C((f) => "$" + O(s || "")(f), "valueFormat");
      } else p = O(e);
    } catch (e) {
      (K.error("Error creating format function:", e), (p = O(",")));
    }
    const x = J().range([
        "transparent",
        i.cScale0,
        i.cScale1,
        i.cScale2,
        i.cScale3,
        i.cScale4,
        i.cScale5,
        i.cScale6,
        i.cScale7,
        i.cScale8,
        i.cScale9,
        i.cScale10,
        i.cScale11,
      ]),
      F = J().range([
        "transparent",
        i.cScalePeer0,
        i.cScalePeer1,
        i.cScalePeer2,
        i.cScalePeer3,
        i.cScalePeer4,
        i.cScalePeer5,
        i.cScalePeer6,
        i.cScalePeer7,
        i.cScalePeer8,
        i.cScalePeer9,
        i.cScalePeer10,
        i.cScalePeer11,
      ]),
      k = J().range([
        i.cScaleLabel0,
        i.cScaleLabel1,
        i.cScaleLabel2,
        i.cScaleLabel3,
        i.cScaleLabel4,
        i.cScaleLabel5,
        i.cScaleLabel6,
        i.cScaleLabel7,
        i.cScaleLabel8,
        i.cScaleLabel9,
        i.cScaleLabel10,
        i.cScaleLabel11,
      ]);
    h &&
      m
        .append("text")
        .attr("x", S / 2)
        .attr("y", u / 2)
        .attr("class", "treemapTitle")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(h);
    const D = m.append("g").attr("transform", `translate(0, ${u})`).attr("class", "treemapContainer"),
      R = Q(g)
        .sum((e) => {
          var s;
          return (s = e.value) != null ? s : 0;
        })
        .sort((e, s) => {
          var f, w;
          return ((f = s.value) != null ? f : 0) - ((w = e.value) != null ? w : 0);
        }),
      ee = et()
        .size([r, y])
        .paddingTop((e) => (e.children && e.children.length > 0 ? X + E : 0))
        .paddingInner(d)
        .paddingLeft((e) => (e.children && e.children.length > 0 ? E : 0))
        .paddingRight((e) => (e.children && e.children.length > 0 ? E : 0))
        .paddingBottom((e) => (e.children && e.children.length > 0 ? E : 0))
        .round(!0)(R),
      oe = ee.descendants().filter((e) => e.children && e.children.length > 0),
      I = D.selectAll(".treemapSection")
        .data(oe)
        .enter()
        .append("g")
        .attr("class", "treemapSection")
        .attr("transform", (e) => `translate(${e.x0},${e.y0})`);
    (I.append("rect")
      .attr("width", (e) => e.x1 - e.x0)
      .attr("height", X)
      .attr("class", "treemapSectionHeader")
      .attr("fill", "none")
      .attr("fill-opacity", 0.6)
      .attr("stroke-width", 0.6)
      .attr("style", (e) => (e.depth === 0 ? "display: none;" : "")),
      I.append("clipPath")
        .attr("id", (e, s) => `clip-section-${a}-${s}`)
        .append("rect")
        .attr("width", (e) => Math.max(0, e.x1 - e.x0 - 12))
        .attr("height", X),
      I.append("rect")
        .attr("width", (e) => e.x1 - e.x0)
        .attr("height", (e) => e.y1 - e.y0)
        .attr("class", (e, s) => `treemapSection section${s}`)
        .attr("fill", (e) => x(e.data.name))
        .attr("fill-opacity", 0.6)
        .attr("stroke", (e) => F(e.data.name))
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.4)
        .attr("style", (e) => {
          if (e.depth === 0) return "display: none;";
          const s = B({ cssCompiledStyles: e.data.cssCompiledStyles });
          return s.nodeStyles + ";" + s.borderStyles.join(";");
        }),
      I.append("text")
        .attr("class", "treemapSectionLabel")
        .attr("x", 6)
        .attr("y", X / 2)
        .attr("dominant-baseline", "middle")
        .text((e) => (e.depth === 0 ? "" : e.data.name))
        .attr("font-weight", "bold")
        .attr("style", (e) => {
          if (e.depth === 0) return "display: none;";
          const s =
              "dominant-baseline: middle; font-size: 12px; fill:" +
              k(e.data.name) +
              "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
            f = B({ cssCompiledStyles: e.data.cssCompiledStyles });
          return s + f.labelStyles.replace("color:", "fill:");
        })
        .each(function (e) {
          if (e.depth === 0) return;
          const s = j(this),
            f = e.data.name;
          s.text(f);
          const w = e.x1 - e.x0,
            $ = 6;
          let A;
          c.showValues !== !1 && e.value ? (A = w - 10 - 30 - 10 - $) : (A = w - $ - 6);
          const _ = Math.max(15, A),
            b = s.node();
          if (b.getComputedTextLength() > _) {
            const T = "...";
            let L = f;
            for (; L.length > 0;) {
              if (((L = f.substring(0, L.length - 1)), L.length === 0)) {
                (s.text(T), b.getComputedTextLength() > _ && s.text(""));
                break;
              }
              if ((s.text(L + T), b.getComputedTextLength() <= _)) break;
            }
          }
        }),
      c.showValues !== !1 &&
        I.append("text")
          .attr("class", "treemapSectionValue")
          .attr("x", (e) => e.x1 - e.x0 - 10)
          .attr("y", X / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .text((e) => (e.value ? p(e.value) : ""))
          .attr("font-style", "italic")
          .attr("style", (e) => {
            if (e.depth === 0) return "display: none;";
            const s =
                "text-anchor: end; dominant-baseline: middle; font-size: 10px; fill:" +
                k(e.data.name) +
                "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
              f = B({ cssCompiledStyles: e.data.cssCompiledStyles });
            return s + f.labelStyles.replace("color:", "fill:");
          }));
    const ce = ee.leaves(),
      Y = D.selectAll(".treemapLeafGroup")
        .data(ce)
        .enter()
        .append("g")
        .attr(
          "class",
          (e, s) => `treemapNode treemapLeafGroup leaf${s}${e.data.classSelector ? ` ${e.data.classSelector}` : ""}x`,
        )
        .attr("transform", (e) => `translate(${e.x0},${e.y0})`);
    (Y.append("rect")
      .attr("width", (e) => e.x1 - e.x0)
      .attr("height", (e) => e.y1 - e.y0)
      .attr("class", "treemapLeaf")
      .attr("fill", (e) => (e.parent ? x(e.parent.data.name) : x(e.data.name)))
      .attr("style", (e) => B({ cssCompiledStyles: e.data.cssCompiledStyles }).nodeStyles)
      .attr("fill-opacity", 0.3)
      .attr("stroke", (e) => (e.parent ? x(e.parent.data.name) : x(e.data.name)))
      .attr("stroke-width", 3),
      Y.append("clipPath")
        .attr("id", (e, s) => `clip-${a}-${s}`)
        .append("rect")
        .attr("width", (e) => Math.max(0, e.x1 - e.x0 - 4))
        .attr("height", (e) => Math.max(0, e.y1 - e.y0 - 4)),
      Y.append("text")
        .attr("class", "treemapLabel")
        .attr("x", (e) => (e.x1 - e.x0) / 2)
        .attr("y", (e) => (e.y1 - e.y0) / 2)
        .attr("style", (e) => {
          const s = "text-anchor: middle; dominant-baseline: middle; font-size: 38px;fill:" + k(e.data.name) + ";",
            f = B({ cssCompiledStyles: e.data.cssCompiledStyles });
          return s + f.labelStyles.replace("color:", "fill:");
        })
        .attr("clip-path", (e, s) => `url(#clip-${a}-${s})`)
        .text((e) => e.data.name)
        .each(function (e) {
          const s = j(this),
            f = e.x1 - e.x0,
            w = e.y1 - e.y0,
            $ = s.node(),
            A = 4,
            V = f - 2 * A,
            _ = w - 2 * A;
          if (V < 10 || _ < 10) {
            s.style("display", "none");
            return;
          }
          let b = parseInt(s.style("font-size"), 10);
          const M = 8,
            T = 28,
            L = 0.6,
            z = 6,
            W = 2;
          for (; $.getComputedTextLength() > V && b > M;) (b--, s.style("font-size", `${b}px`));
          let H = Math.max(z, Math.min(T, Math.round(b * L))),
            Z = b + W + H;
          for (; Z > _ && b > M && (b--, (H = Math.max(z, Math.min(T, Math.round(b * L)))), !(H < z && b === M));)
            (s.style("font-size", `${b}px`), (Z = b + W + H));
          (s.style("font-size", `${b}px`),
            ($.getComputedTextLength() > V || b < M || _ < b) && s.style("display", "none"));
        }),
      c.showValues !== !1 &&
        Y.append("text")
          .attr("class", "treemapValue")
          .attr("x", (s) => (s.x1 - s.x0) / 2)
          .attr("y", function (s) {
            return (s.y1 - s.y0) / 2;
          })
          .attr("style", (s) => {
            const f = "text-anchor: middle; dominant-baseline: hanging; font-size: 28px;fill:" + k(s.data.name) + ";",
              w = B({ cssCompiledStyles: s.data.cssCompiledStyles });
            return f + w.labelStyles.replace("color:", "fill:");
          })
          .attr("clip-path", (s, f) => `url(#clip-${a}-${f})`)
          .text((s) => (s.value ? p(s.value) : ""))
          .each(function (s) {
            const f = j(this),
              w = this.parentNode;
            if (!w) {
              f.style("display", "none");
              return;
            }
            const $ = j(w).select(".treemapLabel");
            if ($.empty() || $.style("display") === "none") {
              f.style("display", "none");
              return;
            }
            const A = parseFloat($.style("font-size")),
              V = 28,
              _ = 0.6,
              b = 6,
              M = 2,
              T = Math.max(b, Math.min(V, Math.round(A * _)));
            f.style("font-size", `${T}px`);
            const z = (s.y1 - s.y0) / 2 + A / 2 + M;
            f.attr("y", z);
            const W = s.x1 - s.x0,
              ue = s.y1 - s.y0 - 4,
              he = W - 2 * 4;
            f.node().getComputedTextLength() > he || z + T > ue || T < b
              ? f.style("display", "none")
              : f.style("display", null);
          }));
    const de = (ae = c.diagramPadding) != null ? ae : 8;
    pe(m, de, "flowchart", (c == null ? void 0 : c.useMaxWidth) || !1);
  }, "draw"),
  rt = C(function (t, a) {
    return a.db.getClasses();
  }, "getClasses"),
  st = { draw: lt, getClasses: rt },
  it = {
    sectionStrokeColor: "black",
    sectionStrokeWidth: "1",
    sectionFillColor: "#efefef",
    leafStrokeColor: "black",
    leafStrokeWidth: "1",
    leafFillColor: "#efefef",
    labelColor: "black",
    labelFontSize: "12px",
    valueFontSize: "10px",
    valueColor: "black",
    titleColor: "black",
    titleFontSize: "14px",
  },
  ot = C(({ treemap: t } = {}) => {
    const a = ne(it, t);
    return `
  .treemapNode.section {
    stroke: ${a.sectionStrokeColor};
    stroke-width: ${a.sectionStrokeWidth};
    fill: ${a.sectionFillColor};
  }
  .treemapNode.leaf {
    stroke: ${a.leafStrokeColor};
    stroke-width: ${a.leafStrokeWidth};
    fill: ${a.leafFillColor};
  }
  .treemapLabel {
    fill: ${a.labelColor};
    font-size: ${a.labelFontSize};
  }
  .treemapValue {
    fill: ${a.valueColor};
    font-size: ${a.valueFontSize};
  }
  .treemapTitle {
    fill: ${a.titleColor};
    font-size: ${a.titleFontSize};
  }
  `;
  }, "getStyles"),
  ct = ot,
  wt = {
    parser: ie,
    get db() {
      return new re();
    },
    renderer: st,
    styles: ct,
  };
export { wt as diagram };
