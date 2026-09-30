import { p as Se } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  _ as C,
  J as ve,
  D as ae,
  F as ee,
  I as xe,
  e as be,
  l as te,
  cQ as E,
  m as J,
  b as we,
  a as Ce,
  p as Te,
  q as Le,
  g as $e,
  s as _e,
  G as Ae,
  cR as Fe,
  t as Ne,
} from "./registry-CHHSpXp3.js";
import { s as Me } from "./chunk-POPQ4Y6H-s3peuQj9.js";
import { p as ke } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
import { b as O } from "./defaultLocale-D1A86z7I.js";
import { o as K } from "./ordinal-D17R3C1y.js";
import "./init-Dti9YEyp.js";
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
      (t._sentryDebugIds[a] = "cb6488af-2234-40a6-ac29-ccc598be5362"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-cb6488af-2234-40a6-ac29-ccc598be5362"));
  })();
} catch {}
function De(t) {
  var a = 0,
    l = t.children,
    n = l && l.length;
  if (!n) a = 1;
  else for (; --n >= 0;) a += l[n].value;
  t.value = a;
}
function ze() {
  return this.eachAfter(De);
}
function Ve(t, a) {
  let l = -1;
  for (const n of this) t.call(a, n, ++l, this);
  return this;
}
function Pe(t, a) {
  for (var l = this, n = [l], r, c, d = -1; (l = n.pop());)
    if ((t.call(a, l, ++d, this), (r = l.children))) for (c = r.length - 1; c >= 0; --c) n.push(r[c]);
  return this;
}
function Ee(t, a) {
  for (var l = this, n = [l], r = [], c, d, u, g = -1; (l = n.pop());)
    if ((r.push(l), (c = l.children))) for (d = 0, u = c.length; d < u; ++d) n.push(c[d]);
  for (; (l = r.pop());) t.call(a, l, ++g, this);
  return this;
}
function Be(t, a) {
  let l = -1;
  for (const n of this) if (t.call(a, n, ++l, this)) return n;
}
function Re(t) {
  return this.eachAfter(function (a) {
    for (var l = +t(a.data) || 0, n = a.children, r = n && n.length; --r >= 0;) l += n[r].value;
    a.value = l;
  });
}
function Ie(t) {
  return this.eachBefore(function (a) {
    a.children && a.children.sort(t);
  });
}
function We(t) {
  for (var a = this, l = He(a, t), n = [a]; a !== l;) ((a = a.parent), n.push(a));
  for (var r = n.length; t !== l;) (n.splice(r, 0, t), (t = t.parent));
  return n;
}
function He(t, a) {
  if (t === a) return t;
  var l = t.ancestors(),
    n = a.ancestors(),
    r = null;
  for (t = l.pop(), a = n.pop(); t === a;) ((r = t), (t = l.pop()), (a = n.pop()));
  return r;
}
function Oe() {
  for (var t = this, a = [t]; (t = t.parent);) a.push(t);
  return a;
}
function Ge() {
  return Array.from(this);
}
function qe() {
  var t = [];
  return (
    this.eachBefore(function (a) {
      a.children || t.push(a);
    }),
    t
  );
}
function Xe() {
  var t = this,
    a = [];
  return (
    t.each(function (l) {
      l !== t && a.push({ source: l.parent, target: l });
    }),
    a
  );
}
function* Ye() {
  var t = this,
    a,
    l = [t],
    n,
    r,
    c;
  do
    for (a = l.reverse(), l = []; (t = a.pop());)
      if ((yield t, (n = t.children))) for (r = 0, c = n.length; r < c; ++r) l.push(n[r]);
  while (l.length);
}
function ne(t, a) {
  t instanceof Map ? ((t = [void 0, t]), a === void 0 && (a = Qe)) : a === void 0 && (a = Je);
  for (var l = new Q(t), n, r = [l], c, d, u, g; (n = r.pop());)
    if ((d = a(n.data)) && (g = (d = Array.from(d)).length))
      for (n.children = d, u = g - 1; u >= 0; --u)
        (r.push((c = d[u] = new Q(d[u]))), (c.parent = n), (c.depth = n.depth + 1));
  return l.eachBefore(Ze);
}
function je() {
  return ne(this).eachBefore(Ue);
}
function Je(t) {
  return t.children;
}
function Qe(t) {
  return Array.isArray(t) ? t[1] : null;
}
function Ue(t) {
  (t.data.value !== void 0 && (t.value = t.data.value), (t.data = t.data.data));
}
function Ze(t) {
  var a = 0;
  do t.height = a;
  while ((t = t.parent) && t.height < ++a);
}
function Q(t) {
  ((this.data = t), (this.depth = this.height = 0), (this.parent = null));
}
Q.prototype = ne.prototype = {
  constructor: Q,
  count: ze,
  each: Ve,
  eachAfter: Ee,
  eachBefore: Pe,
  find: Be,
  sum: Re,
  sort: Ie,
  path: We,
  ancestors: Oe,
  descendants: Ge,
  leaves: qe,
  links: Xe,
  copy: je,
  [Symbol.iterator]: Ye,
};
function Ke(t) {
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
function et(t) {
  ((t.x0 = Math.round(t.x0)), (t.y0 = Math.round(t.y0)), (t.x1 = Math.round(t.x1)), (t.y1 = Math.round(t.y1)));
}
function tt(t, a, l, n, r) {
  for (var c = t.children, d, u = -1, g = c.length, o = t.value && (n - a) / t.value; ++u < g;)
    ((d = c[u]), (d.y0 = l), (d.y1 = r), (d.x0 = a), (d.x1 = a += d.value * o));
}
function at(t, a, l, n, r) {
  for (var c = t.children, d, u = -1, g = c.length, o = t.value && (r - l) / t.value; ++u < g;)
    ((d = c[u]), (d.x0 = a), (d.x1 = n), (d.y0 = l), (d.y1 = l += d.value * o));
}
var nt = (1 + Math.sqrt(5)) / 2;
function lt(t, a, l, n, r, c) {
  for (var d = [], u = a.children, g, o, h = 0, y = 0, s = u.length, S, v, x = a.value, p, b, N, _, z, I, M; h < s;) {
    ((S = r - l), (v = c - n));
    do p = u[y++].value;
    while (!p && y < s);
    for (b = N = p, I = Math.max(v / S, S / v) / (x * t), M = p * p * I, z = Math.max(N / M, M / b); y < s; ++y) {
      if (
        ((p += o = u[y].value),
        o < b && (b = o),
        o > N && (N = o),
        (M = p * p * I),
        (_ = Math.max(N / M, M / b)),
        _ > z)
      ) {
        p -= o;
        break;
      }
      z = _;
    }
    (d.push((g = { value: p, dice: S < v, children: u.slice(h, y) })),
      g.dice ? tt(g, l, n, r, x ? (n += (v * p) / x) : c) : at(g, l, n, x ? (l += (S * p) / x) : r, c),
      (x -= p),
      (h = y));
  }
  return d;
}
const rt = (function t(a) {
  function l(n, r, c, d, u) {
    lt(a, n, r, c, d, u);
  }
  return (
    (l.ratio = function (n) {
      return t((n = +n) > 1 ? n : 1);
    }),
    l
  );
})(nt);
function st() {
  var t = rt,
    a = !1,
    l = 1,
    n = 1,
    r = [0],
    c = G,
    d = G,
    u = G,
    g = G,
    o = G;
  function h(s) {
    return ((s.x0 = s.y0 = 0), (s.x1 = l), (s.y1 = n), s.eachBefore(y), (r = [0]), a && s.eachBefore(et), s);
  }
  function y(s) {
    var S = r[s.depth],
      v = s.x0 + S,
      x = s.y0 + S,
      p = s.x1 - S,
      b = s.y1 - S;
    (p < v && (v = p = (v + p) / 2),
      b < x && (x = b = (x + b) / 2),
      (s.x0 = v),
      (s.y0 = x),
      (s.x1 = p),
      (s.y1 = b),
      s.children &&
        ((S = r[s.depth + 1] = c(s) / 2),
        (v += o(s) - S),
        (x += d(s) - S),
        (p -= u(s) - S),
        (b -= g(s) - S),
        p < v && (v = p = (v + p) / 2),
        b < x && (x = b = (x + b) / 2),
        t(s, v, x, p, b)));
  }
  return (
    (h.round = function (s) {
      return arguments.length ? ((a = !!s), h) : a;
    }),
    (h.size = function (s) {
      return arguments.length ? ((l = +s[0]), (n = +s[1]), h) : [l, n];
    }),
    (h.tile = function (s) {
      return arguments.length ? ((t = Ke(s)), h) : t;
    }),
    (h.padding = function (s) {
      return arguments.length ? h.paddingInner(s).paddingOuter(s) : h.paddingInner();
    }),
    (h.paddingInner = function (s) {
      return arguments.length ? ((c = typeof s == "function" ? s : q(+s)), h) : c;
    }),
    (h.paddingOuter = function (s) {
      return arguments.length ? h.paddingTop(s).paddingRight(s).paddingBottom(s).paddingLeft(s) : h.paddingTop();
    }),
    (h.paddingTop = function (s) {
      return arguments.length ? ((d = typeof s == "function" ? s : q(+s)), h) : d;
    }),
    (h.paddingRight = function (s) {
      return arguments.length ? ((u = typeof s == "function" ? s : q(+s)), h) : u;
    }),
    (h.paddingBottom = function (s) {
      return arguments.length ? ((g = typeof s == "function" ? s : q(+s)), h) : g;
    }),
    (h.paddingLeft = function (s) {
      return arguments.length ? ((o = typeof s == "function" ? s : q(+s)), h) : o;
    }),
    h
  );
}
var R,
  de =
    ((R = class {
      constructor() {
        ((this.nodes = []),
          (this.levels = new Map()),
          (this.outerNodes = []),
          (this.classes = new Map()),
          (this.setAccTitle = we),
          (this.getAccTitle = Ce),
          (this.setDiagramTitle = Te),
          (this.getDiagramTitle = Le),
          (this.getAccDescription = $e),
          (this.setAccDescription = _e));
      }
      getNodes() {
        return this.nodes;
      }
      getConfig() {
        var n;
        const a = Ae,
          l = ae();
        return ee({ ...a.treemap, ...((n = l.treemap) != null ? n : {}) });
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
          r = l.replace(/\\,/g, "§§§").replace(/,/g, ";").replace(/§§§/g, ",").split(";");
        (r &&
          r.forEach((d) => {
            (Fe(d) && (n != null && n.textStyles ? n.textStyles.push(d) : (n.textStyles = [d])),
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
        (Ne(),
          (this.nodes = []),
          (this.levels = new Map()),
          (this.outerNodes = []),
          (this.classes = new Map()),
          (this.root = void 0));
      }
    }),
    C(R, "TreeMapDB"),
    R);
function he(t) {
  if (!t.length) return [];
  const a = [],
    l = [];
  return (
    t.forEach((n) => {
      const r = { name: n.name, children: n.type === "Leaf" ? void 0 : [] };
      for (
        r.classSelector = n == null ? void 0 : n.classSelector,
          n != null && n.cssCompiledStyles && (r.cssCompiledStyles = n.cssCompiledStyles),
          n.type === "Leaf" && n.value !== void 0 && (r.value = n.value);
        l.length > 0 && l[l.length - 1].level >= n.level;
      )
        l.pop();
      if (l.length === 0) a.push(r);
      else {
        const c = l[l.length - 1].node;
        c.children ? c.children.push(r) : (c.children = [r]);
      }
      n.type !== "Leaf" && l.push({ node: r, level: n.level });
    }),
    a
  );
}
C(he, "buildHierarchy");
var it = C((t, a) => {
    var c, d, u, g;
    Se(t, a);
    const l = [];
    for (const o of (c = t.TreemapRows) != null ? c : [])
      o.$type === "ClassDefStatement" &&
        a.addClass((d = o.className) != null ? d : "", (u = o.styleText) != null ? u : "");
    for (const o of (g = t.TreemapRows) != null ? g : []) {
      const h = o.item;
      if (!h) continue;
      const y = o.indent ? parseInt(o.indent) : 0,
        s = ot(h),
        S = h.classSelector ? a.getStylesForClass(h.classSelector) : [],
        v = S.length > 0 ? S : void 0,
        x = { level: y, name: s, type: h.$type, value: h.value, classSelector: h.classSelector, cssCompiledStyles: v };
      l.push(x);
    }
    const n = he(l),
      r = C((o, h) => {
        for (const y of o) (a.addNode(y, h), y.children && y.children.length > 0 && r(y.children, h + 1));
      }, "addNodesRecursively");
    r(n, 0);
  }, "populate"),
  ot = C((t) => (t.name ? String(t.name) : ""), "getItemName"),
  ue = {
    parser: { yy: void 0 },
    parse: C(async (t) => {
      var a;
      try {
        const n = await ke("treemap", t);
        te.debug("Treemap AST:", n);
        const r = (a = ue.parser) == null ? void 0 : a.yy;
        if (!(r instanceof de))
          throw new Error(
            "parser.parser?.yy was not a TreemapDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.",
          );
        it(n, r);
      } catch (l) {
        throw (te.error("Error parsing treemap:", l), l);
      }
    }, "parse"),
  },
  ct = 10,
  B = 10,
  X = 25,
  dt = C((t, a, l, n) => {
    var ie, oe;
    const r = n.db,
      c = r.getConfig(),
      d = (ie = c.padding) != null ? ie : ct,
      u = r.getDiagramTitle(),
      g = r.getRoot(),
      { themeVariables: o } = ae();
    if (!g) return;
    const h = u ? 30 : 0,
      y = xe(a),
      s = c.nodeWidth ? c.nodeWidth * B : 960,
      S = c.nodeHeight ? c.nodeHeight * B : 500,
      v = s,
      x = S + h;
    (y.attr("viewBox", `0 0 ${v} ${x}`), be(y, x, v, c.useMaxWidth));
    let p;
    try {
      const e = c.valueFormat || ",";
      if (e === "$0,0") p = C((i) => "$" + O(",")(i), "valueFormat");
      else if (e.startsWith("$") && e.includes(",")) {
        const i = /\.\d+/.exec(e),
          f = i ? i[0] : "";
        p = C((w) => "$" + O("," + f)(w), "valueFormat");
      } else if (e.startsWith("$")) {
        const i = e.substring(1);
        p = C((f) => "$" + O(i || "")(f), "valueFormat");
      } else p = O(e);
    } catch (e) {
      (te.error("Error creating format function:", e), (p = O(",")));
    }
    const b = K().range([
        "transparent",
        o.cScale0,
        o.cScale1,
        o.cScale2,
        o.cScale3,
        o.cScale4,
        o.cScale5,
        o.cScale6,
        o.cScale7,
        o.cScale8,
        o.cScale9,
        o.cScale10,
        o.cScale11,
      ]),
      N = K().range([
        "transparent",
        o.cScalePeer0,
        o.cScalePeer1,
        o.cScalePeer2,
        o.cScalePeer3,
        o.cScalePeer4,
        o.cScalePeer5,
        o.cScalePeer6,
        o.cScalePeer7,
        o.cScalePeer8,
        o.cScalePeer9,
        o.cScalePeer10,
        o.cScalePeer11,
      ]),
      _ = K().range([
        o.cScaleLabel0,
        o.cScaleLabel1,
        o.cScaleLabel2,
        o.cScaleLabel3,
        o.cScaleLabel4,
        o.cScaleLabel5,
        o.cScaleLabel6,
        o.cScaleLabel7,
        o.cScaleLabel8,
        o.cScaleLabel9,
        o.cScaleLabel10,
        o.cScaleLabel11,
      ]);
    u &&
      y
        .append("text")
        .attr("x", v / 2)
        .attr("y", h / 2)
        .attr("class", "treemapTitle")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(u);
    const z = y.append("g").attr("transform", `translate(0, ${h})`).attr("class", "treemapContainer"),
      I = ne(g)
        .sum((e) => {
          var i;
          return (i = e.value) != null ? i : 0;
        })
        .sort((e, i) => {
          var f, w;
          return ((f = i.value) != null ? f : 0) - ((w = e.value) != null ? w : 0);
        }),
      le = st()
        .size([s, S])
        .paddingTop((e) => (e.children && e.children.length > 0 ? X + B : 0))
        .paddingInner(d)
        .paddingLeft((e) => (e.children && e.children.length > 0 ? B : 0))
        .paddingRight((e) => (e.children && e.children.length > 0 ? B : 0))
        .paddingBottom((e) => (e.children && e.children.length > 0 ? B : 0))
        .round(!0)(I),
      pe = le.descendants().filter((e) => e.children && e.children.length > 0),
      W = z
        .selectAll(".treemapSection")
        .data(pe)
        .enter()
        .append("g")
        .attr("class", "treemapSection")
        .attr("transform", (e) => `translate(${e.x0},${e.y0})`);
    (W.append("rect")
      .attr("width", (e) => e.x1 - e.x0)
      .attr("height", X)
      .attr("class", "treemapSectionHeader")
      .attr("fill", "none")
      .attr("fill-opacity", 0.6)
      .attr("stroke-width", 0.6)
      .attr("style", (e) => (e.depth === 0 ? "display: none;" : "")),
      W.append("clipPath")
        .attr("id", (e, i) => `clip-section-${a}-${i}`)
        .append("rect")
        .attr("width", (e) => Math.max(0, e.x1 - e.x0 - 12))
        .attr("height", X),
      W.append("rect")
        .attr("width", (e) => e.x1 - e.x0)
        .attr("height", (e) => e.y1 - e.y0)
        .attr("class", (e, i) => `treemapSection section${i}`)
        .attr("fill", (e) => b(e.data.name))
        .attr("fill-opacity", 0.6)
        .attr("stroke", (e) => N(e.data.name))
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.4)
        .attr("style", (e) => {
          if (e.depth === 0) return "display: none;";
          const i = E({ cssCompiledStyles: e.data.cssCompiledStyles });
          return i.nodeStyles + ";" + i.borderStyles.join(";");
        }),
      W.append("text")
        .attr("class", "treemapSectionLabel")
        .attr("x", 6)
        .attr("y", X / 2)
        .attr("dominant-baseline", "middle")
        .text((e) => (e.depth === 0 ? "" : e.data.name))
        .attr("font-weight", "bold")
        .attr("clip-path", (e, i) => `url(#clip-section-${a}-${i})`)
        .attr("style", (e) => {
          if (e.depth === 0) return "display: none;";
          const i =
              "dominant-baseline: middle; font-size: 12px; fill:" +
              _(e.data.name) +
              "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
            f = E({ cssCompiledStyles: e.data.cssCompiledStyles });
          return i + f.labelStyles.replace("color:", "fill:");
        })
        .each(function (e) {
          if (e.depth === 0) return;
          const i = J(this),
            f = e.data.name;
          i.text(f);
          const w = e.x1 - e.x0,
            L = 6;
          let T;
          c.showValues !== !1 && e.value ? (T = w - 10 - 30 - 10 - L) : (T = w - L - 6);
          const m = Math.max(15, T),
            k = i.node();
          if (k.getComputedTextLength() > m) {
            const $ = "...";
            let D = f;
            for (; D.length > 0;) {
              if (((D = f.substring(0, D.length - 1)), D.length === 0)) {
                (i.text($), k.getComputedTextLength() > m && i.text(""));
                break;
              }
              if ((i.text(D + $), k.getComputedTextLength() <= m)) break;
            }
          }
        }),
      c.showValues !== !1 &&
        W.append("text")
          .attr("class", "treemapSectionValue")
          .attr("x", (e) => e.x1 - e.x0 - 10)
          .attr("y", X / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .text((e) => (e.value ? p(e.value) : ""))
          .attr("font-style", "italic")
          .attr("style", (e) => {
            if (e.depth === 0) return "display: none;";
            const i =
                "text-anchor: end; dominant-baseline: middle; font-size: 10px; fill:" +
                _(e.data.name) +
                "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
              f = E({ cssCompiledStyles: e.data.cssCompiledStyles });
            return i + f.labelStyles.replace("color:", "fill:");
          }));
    const re = le.leaves(),
      A = re.length > 20,
      fe = A ? 16 : 38,
      Y = A ? 14 : 28,
      V = A ? 4 : 8,
      H = A ? 4 : 6,
      U = A ? 2 : 4,
      se = A ? 8 : 10,
      Z = A ? 1 : 2,
      j = z
        .selectAll(".treemapLeafGroup")
        .data(re)
        .enter()
        .append("g")
        .attr(
          "class",
          (e, i) => `treemapNode treemapLeafGroup leaf${i}${e.data.classSelector ? ` ${e.data.classSelector}` : ""}x`,
        )
        .attr("transform", (e) => `translate(${e.x0},${e.y0})`);
    (j
      .append("rect")
      .attr("width", (e) => e.x1 - e.x0)
      .attr("height", (e) => e.y1 - e.y0)
      .attr("class", "treemapLeaf")
      .attr("fill", (e) => (e.parent ? b(e.parent.data.name) : b(e.data.name)))
      .attr("style", (e) => E({ cssCompiledStyles: e.data.cssCompiledStyles }).nodeStyles)
      .attr("fill-opacity", 0.3)
      .attr("stroke", (e) => (e.parent ? b(e.parent.data.name) : b(e.data.name)))
      .attr("stroke-width", 3),
      j
        .append("clipPath")
        .attr("id", (e, i) => `clip-${a}-${i}`)
        .append("rect")
        .attr("width", (e) => Math.max(0, e.x1 - e.x0 - 4))
        .attr("height", (e) => Math.max(0, e.y1 - e.y0 - 4)),
      j
        .append("text")
        .attr("class", "treemapLabel")
        .attr("x", (e) => (e.x1 - e.x0) / 2)
        .attr("y", (e) => (e.y1 - e.y0) / 2)
        .attr("style", (e) => {
          const i = `text-anchor: middle; dominant-baseline: middle; font-size: ${fe}px;fill:` + _(e.data.name) + ";",
            f = E({ cssCompiledStyles: e.data.cssCompiledStyles });
          return i + f.labelStyles.replace("color:", "fill:");
        })
        .attr("clip-path", (e, i) => `url(#clip-${a}-${i})`)
        .text((e) => e.data.name)
        .each(function (e) {
          const i = J(this),
            f = e.x1 - e.x0,
            w = e.y1 - e.y0,
            L = i.node(),
            T = f - 2 * U,
            P = w - 2 * U;
          if (T < se || P < se) {
            i.style("display", "none");
            return;
          }
          let m = parseInt(i.style("font-size"), 10);
          const k = 0.6;
          for (; L.getComputedTextLength() > T && m > V;) (m--, i.style("font-size", `${m}px`));
          let F = Math.max(H, Math.min(Y, Math.round(m * k))),
            $ = m + Z + F;
          for (; $ > P && m > V && (m--, (F = Math.max(H, Math.min(Y, Math.round(m * k)))), !(F < H && m === V));)
            (i.style("font-size", `${m}px`), ($ = m + Z + F));
          (i.style("font-size", `${m}px`),
            A
              ? (m < V || P < V) && i.style("display", "none")
              : (L.getComputedTextLength() > T || m < V || P < m) && i.style("display", "none"));
        }),
      c.showValues !== !1 &&
        j
          .append("text")
          .attr("class", "treemapValue")
          .attr("x", (i) => (i.x1 - i.x0) / 2)
          .attr("y", function (i) {
            return (i.y1 - i.y0) / 2;
          })
          .attr("style", (i) => {
            const f = `text-anchor: middle; dominant-baseline: hanging; font-size: ${Y}px;fill:` + _(i.data.name) + ";",
              w = E({ cssCompiledStyles: i.data.cssCompiledStyles });
            return f + w.labelStyles.replace("color:", "fill:");
          })
          .attr("clip-path", (i, f) => `url(#clip-${a}-${f})`)
          .text((i) => (i.value ? p(i.value) : ""))
          .each(function (i) {
            const f = J(this),
              w = this.parentNode;
            if (!w) {
              f.style("display", "none");
              return;
            }
            const L = J(w).select(".treemapLabel");
            if (L.empty() || L.style("display") === "none") {
              f.style("display", "none");
              return;
            }
            const T = parseFloat(L.style("font-size")),
              m = Math.max(H, Math.min(Y, Math.round(T * 0.6)));
            f.style("font-size", `${m}px`);
            const F = (i.y1 - i.y0) / 2 + T / 2 + Z;
            f.attr("y", F);
            const $ = i.x1 - i.x0,
              ce = i.y1 - i.y0 - 4,
              ye = $ - 2 * U;
            f.node().getComputedTextLength() > ye || F + m > ce || m < H
              ? f.style("display", "none")
              : f.style("display", null);
          }));
    const ge = (oe = c.diagramPadding) != null ? oe : 8;
    Me(y, ge, "flowchart", (c == null ? void 0 : c.useMaxWidth) || !1);
  }, "draw"),
  ht = C(function (t, a) {
    return a.db.getClasses();
  }, "getClasses"),
  ut = { draw: dt, getClasses: ht },
  pt = {
    sectionStrokeColor: "black",
    sectionStrokeWidth: "1",
    sectionFillColor: "#efefef",
    leafStrokeColor: "black",
    leafStrokeWidth: "1",
    leafFillColor: "#efefef",
    labelFontSize: "12px",
    valueFontSize: "10px",
    titleFontSize: "14px",
  },
  ft = C(({ treemap: t } = {}) => {
    var g, o, h;
    const a = ve(),
      l = ae(),
      n = ee(a, l.themeVariables),
      r = ee(pt, t),
      c = (g = r.titleColor) != null ? g : n.titleColor,
      d = (o = r.labelColor) != null ? o : n.textColor,
      u = (h = r.valueColor) != null ? h : n.textColor;
    return `
  .treemapNode.section {
    stroke: ${r.sectionStrokeColor};
    stroke-width: ${r.sectionStrokeWidth};
    fill: ${r.sectionFillColor};
  }
  .treemapNode.leaf {
    stroke: ${r.leafStrokeColor};
    stroke-width: ${r.leafStrokeWidth};
    fill: ${r.leafFillColor};
  }
  .treemapLabel {
    fill: ${d};
    font-size: ${r.labelFontSize};
  }
  .treemapValue {
    fill: ${u};
    font-size: ${r.valueFontSize};
  }
  .treemapTitle {
    fill: ${c};
    font-size: ${r.titleFontSize};
  }
  `;
  }, "getStyles"),
  gt = ft,
  Tt = {
    parser: ue,
    get db() {
      return new de();
    },
    renderer: ut,
    styles: gt,
  };
export { Tt as diagram };
