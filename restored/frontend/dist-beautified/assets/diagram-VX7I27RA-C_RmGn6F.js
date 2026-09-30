import { p as Se } from "./chunk-JWPE2WC7-s3iXxkV7.js";
import {
  _ as C,
  E as ve,
  y as ae,
  A as ee,
  D as xe,
  d as be,
  l as te,
  bf as B,
  j as U,
  b as we,
  a as Ce,
  n as Te,
  o as Le,
  g as $e,
  s as Ae,
  B as Fe,
  bg as Ne,
  p as Me,
} from "../index-CKZIQMcw.js";
import { s as _e } from "./chunk-POPQ4Y6H-C2t4NTa2.js";
import { p as ke } from "./cynefin-OW5HDTMX-BLrlwIew.js";
import { b as O } from "./defaultLocale-DX6XiGOO.js";
import { o as Q } from "./ordinal-Cboi1Yqb.js";
import "./init-Gi6I4Gst.js";
function ze(t) {
  var n = 0,
    l = t.children,
    a = l && l.length;
  if (!a) n = 1;
  else for (; --a >= 0;) n += l[a].value;
  t.value = n;
}
function Ve() {
  return this.eachAfter(ze);
}
function De(t, n) {
  let l = -1;
  for (const a of this) t.call(n, a, ++l, this);
  return this;
}
function Pe(t, n) {
  for (var l = this, a = [l], r, c, h = -1; (l = a.pop());)
    if ((t.call(n, l, ++h, this), (r = l.children))) for (c = r.length - 1; c >= 0; --c) a.push(r[c]);
  return this;
}
function Be(t, n) {
  for (var l = this, a = [l], r = [], c, h, p, g = -1; (l = a.pop());)
    if ((r.push(l), (c = l.children))) for (h = 0, p = c.length; h < p; ++h) a.push(c[h]);
  for (; (l = r.pop());) t.call(n, l, ++g, this);
  return this;
}
function Ee(t, n) {
  let l = -1;
  for (const a of this) if (t.call(n, a, ++l, this)) return a;
}
function Re(t) {
  return this.eachAfter(function (n) {
    for (var l = +t(n.data) || 0, a = n.children, r = a && a.length; --r >= 0;) l += a[r].value;
    n.value = l;
  });
}
function We(t) {
  return this.eachBefore(function (n) {
    n.children && n.children.sort(t);
  });
}
function He(t) {
  for (var n = this, l = Ie(n, t), a = [n]; n !== l;) ((n = n.parent), a.push(n));
  for (var r = a.length; t !== l;) (a.splice(r, 0, t), (t = t.parent));
  return a;
}
function Ie(t, n) {
  if (t === n) return t;
  var l = t.ancestors(),
    a = n.ancestors(),
    r = null;
  for (t = l.pop(), n = a.pop(); t === n;) ((r = t), (t = l.pop()), (n = a.pop()));
  return r;
}
function Oe() {
  for (var t = this, n = [t]; (t = t.parent);) n.push(t);
  return n;
}
function Ge() {
  return Array.from(this);
}
function qe() {
  var t = [];
  return (
    this.eachBefore(function (n) {
      n.children || t.push(n);
    }),
    t
  );
}
function Xe() {
  var t = this,
    n = [];
  return (
    t.each(function (l) {
      l !== t && n.push({ source: l.parent, target: l });
    }),
    n
  );
}
function* je() {
  var t = this,
    n,
    l = [t],
    a,
    r,
    c;
  do
    for (n = l.reverse(), l = []; (t = n.pop());)
      if ((yield t, (a = t.children))) for (r = 0, c = a.length; r < c; ++r) l.push(a[r]);
  while (l.length);
}
function ne(t, n) {
  t instanceof Map ? ((t = [void 0, t]), n === void 0 && (n = Ze)) : n === void 0 && (n = Ue);
  for (var l = new Z(t), a, r = [l], c, h, p, g; (a = r.pop());)
    if ((h = n(a.data)) && (g = (h = Array.from(h)).length))
      for (a.children = h, p = g - 1; p >= 0; --p)
        (r.push((c = h[p] = new Z(h[p]))), (c.parent = a), (c.depth = a.depth + 1));
  return l.eachBefore(Ke);
}
function Ye() {
  return ne(this).eachBefore(Je);
}
function Ue(t) {
  return t.children;
}
function Ze(t) {
  return Array.isArray(t) ? t[1] : null;
}
function Je(t) {
  (t.data.value !== void 0 && (t.value = t.data.value), (t.data = t.data.data));
}
function Ke(t) {
  var n = 0;
  do t.height = n;
  while ((t = t.parent) && t.height < ++n);
}
function Z(t) {
  ((this.data = t), (this.depth = this.height = 0), (this.parent = null));
}
Z.prototype = ne.prototype = {
  constructor: Z,
  count: Ve,
  each: De,
  eachAfter: Be,
  eachBefore: Pe,
  find: Ee,
  sum: Re,
  sort: We,
  path: He,
  ancestors: Oe,
  descendants: Ge,
  leaves: qe,
  links: Xe,
  copy: Ye,
  [Symbol.iterator]: je,
};
function Qe(t) {
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
function tt(t, n, l, a, r) {
  for (var c = t.children, h, p = -1, g = c.length, o = t.value && (a - n) / t.value; ++p < g;)
    ((h = c[p]), (h.y0 = l), (h.y1 = r), (h.x0 = n), (h.x1 = n += h.value * o));
}
function at(t, n, l, a, r) {
  for (var c = t.children, h, p = -1, g = c.length, o = t.value && (r - l) / t.value; ++p < g;)
    ((h = c[p]), (h.x0 = n), (h.x1 = a), (h.y0 = l), (h.y1 = l += h.value * o));
}
var nt = (1 + Math.sqrt(5)) / 2;
function lt(t, n, l, a, r, c) {
  for (var h = [], p = n.children, g, o, d = 0, y = 0, s = p.length, S, v, x = n.value, u, b, N, $, V, W, M; d < s;) {
    ((S = r - l), (v = c - a));
    do u = p[y++].value;
    while (!u && y < s);
    for (b = N = u, W = Math.max(v / S, S / v) / (x * t), M = u * u * W, V = Math.max(N / M, M / b); y < s; ++y) {
      if (
        ((u += o = p[y].value),
        o < b && (b = o),
        o > N && (N = o),
        (M = u * u * W),
        ($ = Math.max(N / M, M / b)),
        $ > V)
      ) {
        u -= o;
        break;
      }
      V = $;
    }
    (h.push((g = { value: u, dice: S < v, children: p.slice(d, y) })),
      g.dice ? tt(g, l, a, r, x ? (a += (v * u) / x) : c) : at(g, l, a, x ? (l += (S * u) / x) : r, c),
      (x -= u),
      (d = y));
  }
  return h;
}
const rt = (function t(n) {
  function l(a, r, c, h, p) {
    lt(n, a, r, c, h, p);
  }
  return (
    (l.ratio = function (a) {
      return t((a = +a) > 1 ? a : 1);
    }),
    l
  );
})(nt);
function st() {
  var t = rt,
    n = !1,
    l = 1,
    a = 1,
    r = [0],
    c = G,
    h = G,
    p = G,
    g = G,
    o = G;
  function d(s) {
    return ((s.x0 = s.y0 = 0), (s.x1 = l), (s.y1 = a), s.eachBefore(y), (r = [0]), n && s.eachBefore(et), s);
  }
  function y(s) {
    var S = r[s.depth],
      v = s.x0 + S,
      x = s.y0 + S,
      u = s.x1 - S,
      b = s.y1 - S;
    (u < v && (v = u = (v + u) / 2),
      b < x && (x = b = (x + b) / 2),
      (s.x0 = v),
      (s.y0 = x),
      (s.x1 = u),
      (s.y1 = b),
      s.children &&
        ((S = r[s.depth + 1] = c(s) / 2),
        (v += o(s) - S),
        (x += h(s) - S),
        (u -= p(s) - S),
        (b -= g(s) - S),
        u < v && (v = u = (v + u) / 2),
        b < x && (x = b = (x + b) / 2),
        t(s, v, x, u, b)));
  }
  return (
    (d.round = function (s) {
      return arguments.length ? ((n = !!s), d) : n;
    }),
    (d.size = function (s) {
      return arguments.length ? ((l = +s[0]), (a = +s[1]), d) : [l, a];
    }),
    (d.tile = function (s) {
      return arguments.length ? ((t = Qe(s)), d) : t;
    }),
    (d.padding = function (s) {
      return arguments.length ? d.paddingInner(s).paddingOuter(s) : d.paddingInner();
    }),
    (d.paddingInner = function (s) {
      return arguments.length ? ((c = typeof s == "function" ? s : q(+s)), d) : c;
    }),
    (d.paddingOuter = function (s) {
      return arguments.length ? d.paddingTop(s).paddingRight(s).paddingBottom(s).paddingLeft(s) : d.paddingTop();
    }),
    (d.paddingTop = function (s) {
      return arguments.length ? ((h = typeof s == "function" ? s : q(+s)), d) : h;
    }),
    (d.paddingRight = function (s) {
      return arguments.length ? ((p = typeof s == "function" ? s : q(+s)), d) : p;
    }),
    (d.paddingBottom = function (s) {
      return arguments.length ? ((g = typeof s == "function" ? s : q(+s)), d) : g;
    }),
    (d.paddingLeft = function (s) {
      return arguments.length ? ((o = typeof s == "function" ? s : q(+s)), d) : o;
    }),
    d
  );
}
var R,
  he =
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
          (this.setAccDescription = Ae));
      }
      getNodes() {
        return this.nodes;
      }
      getConfig() {
        var a;
        const n = Fe,
          l = ae();
        return ee({ ...n.treemap, ...((a = l.treemap) != null ? a : {}) });
      }
      addNode(n, l) {
        var a;
        (this.nodes.push(n),
          this.levels.set(n, l),
          l === 0 && (this.outerNodes.push(n), (a = this.root) != null || (this.root = n)));
      }
      getRoot() {
        return { name: "", children: this.outerNodes };
      }
      addClass(n, l) {
        var c;
        const a = (c = this.classes.get(n)) != null ? c : { id: n, styles: [], textStyles: [] },
          r = l.replace(/\\,/g, "§§§").replace(/,/g, ";").replace(/§§§/g, ",").split(";");
        (r &&
          r.forEach((h) => {
            (Ne(h) && (a != null && a.textStyles ? a.textStyles.push(h) : (a.textStyles = [h])),
              a != null && a.styles ? a.styles.push(h) : (a.styles = [h]));
          }),
          this.classes.set(n, a));
      }
      getClasses() {
        return this.classes;
      }
      getStylesForClass(n) {
        var l, a;
        return (a = (l = this.classes.get(n)) == null ? void 0 : l.styles) != null ? a : [];
      }
      clear() {
        (Me(),
          (this.nodes = []),
          (this.levels = new Map()),
          (this.outerNodes = []),
          (this.classes = new Map()),
          (this.root = void 0));
      }
    }),
    C(R, "TreeMapDB"),
    R);
function de(t) {
  if (!t.length) return [];
  const n = [],
    l = [];
  return (
    t.forEach((a) => {
      const r = { name: a.name, children: a.type === "Leaf" ? void 0 : [] };
      for (
        r.classSelector = a == null ? void 0 : a.classSelector,
          a != null && a.cssCompiledStyles && (r.cssCompiledStyles = a.cssCompiledStyles),
          a.type === "Leaf" && a.value !== void 0 && (r.value = a.value);
        l.length > 0 && l[l.length - 1].level >= a.level;
      )
        l.pop();
      if (l.length === 0) n.push(r);
      else {
        const c = l[l.length - 1].node;
        c.children ? c.children.push(r) : (c.children = [r]);
      }
      a.type !== "Leaf" && l.push({ node: r, level: a.level });
    }),
    n
  );
}
C(de, "buildHierarchy");
var it = C((t, n) => {
    var c, h, p, g;
    Se(t, n);
    const l = [];
    for (const o of (c = t.TreemapRows) != null ? c : [])
      o.$type === "ClassDefStatement" &&
        n.addClass((h = o.className) != null ? h : "", (p = o.styleText) != null ? p : "");
    for (const o of (g = t.TreemapRows) != null ? g : []) {
      const d = o.item;
      if (!d) continue;
      const y = o.indent ? parseInt(o.indent) : 0,
        s = ot(d),
        S = d.classSelector ? n.getStylesForClass(d.classSelector) : [],
        v = S.length > 0 ? S : void 0,
        x = { level: y, name: s, type: d.$type, value: d.value, classSelector: d.classSelector, cssCompiledStyles: v };
      l.push(x);
    }
    const a = de(l),
      r = C((o, d) => {
        for (const y of o) (n.addNode(y, d), y.children && y.children.length > 0 && r(y.children, d + 1));
      }, "addNodesRecursively");
    r(a, 0);
  }, "populate"),
  ot = C((t) => (t.name ? String(t.name) : ""), "getItemName"),
  pe = {
    parser: { yy: void 0 },
    parse: C(async (t) => {
      var n;
      try {
        const a = await ke("treemap", t);
        te.debug("Treemap AST:", a);
        const r = (n = pe.parser) == null ? void 0 : n.yy;
        if (!(r instanceof he))
          throw new Error(
            "parser.parser?.yy was not a TreemapDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.",
          );
        it(a, r);
      } catch (l) {
        throw (te.error("Error parsing treemap:", l), l);
      }
    }, "parse"),
  },
  ct = 10,
  E = 10,
  X = 25,
  ht = C((t, n, l, a) => {
    var ie, oe;
    const r = a.db,
      c = r.getConfig(),
      h = (ie = c.padding) != null ? ie : ct,
      p = r.getDiagramTitle(),
      g = r.getRoot(),
      { themeVariables: o } = ae();
    if (!g) return;
    const d = p ? 30 : 0,
      y = xe(n),
      s = c.nodeWidth ? c.nodeWidth * E : 960,
      S = c.nodeHeight ? c.nodeHeight * E : 500,
      v = s,
      x = S + d;
    (y.attr("viewBox", `0 0 ${v} ${x}`), be(y, x, v, c.useMaxWidth));
    let u;
    try {
      const e = c.valueFormat || ",";
      if (e === "$0,0") u = C((i) => "$" + O(",")(i), "valueFormat");
      else if (e.startsWith("$") && e.includes(",")) {
        const i = /\.\d+/.exec(e),
          f = i ? i[0] : "";
        u = C((w) => "$" + O("," + f)(w), "valueFormat");
      } else if (e.startsWith("$")) {
        const i = e.substring(1);
        u = C((f) => "$" + O(i || "")(f), "valueFormat");
      } else u = O(e);
    } catch (e) {
      (te.error("Error creating format function:", e), (u = O(",")));
    }
    const b = Q().range([
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
      N = Q().range([
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
      $ = Q().range([
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
    p &&
      y
        .append("text")
        .attr("x", v / 2)
        .attr("y", d / 2)
        .attr("class", "treemapTitle")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(p);
    const V = y.append("g").attr("transform", `translate(0, ${d})`).attr("class", "treemapContainer"),
      W = ne(g)
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
        .paddingTop((e) => (e.children && e.children.length > 0 ? X + E : 0))
        .paddingInner(h)
        .paddingLeft((e) => (e.children && e.children.length > 0 ? E : 0))
        .paddingRight((e) => (e.children && e.children.length > 0 ? E : 0))
        .paddingBottom((e) => (e.children && e.children.length > 0 ? E : 0))
        .round(!0)(W),
      ue = le.descendants().filter((e) => e.children && e.children.length > 0),
      H = V.selectAll(".treemapSection")
        .data(ue)
        .enter()
        .append("g")
        .attr("class", "treemapSection")
        .attr("transform", (e) => `translate(${e.x0},${e.y0})`);
    (H.append("rect")
      .attr("width", (e) => e.x1 - e.x0)
      .attr("height", X)
      .attr("class", "treemapSectionHeader")
      .attr("fill", "none")
      .attr("fill-opacity", 0.6)
      .attr("stroke-width", 0.6)
      .attr("style", (e) => (e.depth === 0 ? "display: none;" : "")),
      H.append("clipPath")
        .attr("id", (e, i) => `clip-section-${n}-${i}`)
        .append("rect")
        .attr("width", (e) => Math.max(0, e.x1 - e.x0 - 12))
        .attr("height", X),
      H.append("rect")
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
          const i = B({ cssCompiledStyles: e.data.cssCompiledStyles });
          return i.nodeStyles + ";" + i.borderStyles.join(";");
        }),
      H.append("text")
        .attr("class", "treemapSectionLabel")
        .attr("x", 6)
        .attr("y", X / 2)
        .attr("dominant-baseline", "middle")
        .text((e) => (e.depth === 0 ? "" : e.data.name))
        .attr("font-weight", "bold")
        .attr("clip-path", (e, i) => `url(#clip-section-${n}-${i})`)
        .attr("style", (e) => {
          if (e.depth === 0) return "display: none;";
          const i =
              "dominant-baseline: middle; font-size: 12px; fill:" +
              $(e.data.name) +
              "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
            f = B({ cssCompiledStyles: e.data.cssCompiledStyles });
          return i + f.labelStyles.replace("color:", "fill:");
        })
        .each(function (e) {
          if (e.depth === 0) return;
          const i = U(this),
            f = e.data.name;
          i.text(f);
          const w = e.x1 - e.x0,
            L = 6;
          let T;
          c.showValues !== !1 && e.value ? (T = w - 10 - 30 - 10 - L) : (T = w - L - 6);
          const m = Math.max(15, T),
            _ = i.node();
          if (_.getComputedTextLength() > m) {
            let z = f;
            for (; z.length > 0;) {
              if (((z = f.substring(0, z.length - 1)), z.length === 0)) {
                (i.text("..."), _.getComputedTextLength() > m && i.text(""));
                break;
              }
              if ((i.text(z + "..."), _.getComputedTextLength() <= m)) break;
            }
          }
        }),
      c.showValues !== !1 &&
        H.append("text")
          .attr("class", "treemapSectionValue")
          .attr("x", (e) => e.x1 - e.x0 - 10)
          .attr("y", X / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .text((e) => (e.value ? u(e.value) : ""))
          .attr("font-style", "italic")
          .attr("style", (e) => {
            if (e.depth === 0) return "display: none;";
            const i =
                "text-anchor: end; dominant-baseline: middle; font-size: 10px; fill:" +
                $(e.data.name) +
                "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
              f = B({ cssCompiledStyles: e.data.cssCompiledStyles });
            return i + f.labelStyles.replace("color:", "fill:");
          }));
    const re = le.leaves(),
      A = re.length > 20,
      fe = A ? 16 : 38,
      j = A ? 14 : 28,
      D = A ? 4 : 8,
      I = A ? 4 : 6,
      J = A ? 2 : 4,
      se = A ? 8 : 10,
      K = A ? 1 : 2,
      Y = V.selectAll(".treemapLeafGroup")
        .data(re)
        .enter()
        .append("g")
        .attr(
          "class",
          (e, i) => `treemapNode treemapLeafGroup leaf${i}${e.data.classSelector ? ` ${e.data.classSelector}` : ""}x`,
        )
        .attr("transform", (e) => `translate(${e.x0},${e.y0})`);
    (Y.append("rect")
      .attr("width", (e) => e.x1 - e.x0)
      .attr("height", (e) => e.y1 - e.y0)
      .attr("class", "treemapLeaf")
      .attr("fill", (e) => (e.parent ? b(e.parent.data.name) : b(e.data.name)))
      .attr("style", (e) => B({ cssCompiledStyles: e.data.cssCompiledStyles }).nodeStyles)
      .attr("fill-opacity", 0.3)
      .attr("stroke", (e) => (e.parent ? b(e.parent.data.name) : b(e.data.name)))
      .attr("stroke-width", 3),
      Y.append("clipPath")
        .attr("id", (e, i) => `clip-${n}-${i}`)
        .append("rect")
        .attr("width", (e) => Math.max(0, e.x1 - e.x0 - 4))
        .attr("height", (e) => Math.max(0, e.y1 - e.y0 - 4)),
      Y.append("text")
        .attr("class", "treemapLabel")
        .attr("x", (e) => (e.x1 - e.x0) / 2)
        .attr("y", (e) => (e.y1 - e.y0) / 2)
        .attr("style", (e) => {
          const i = `text-anchor: middle; dominant-baseline: middle; font-size: ${fe}px;fill:` + $(e.data.name) + ";",
            f = B({ cssCompiledStyles: e.data.cssCompiledStyles });
          return i + f.labelStyles.replace("color:", "fill:");
        })
        .attr("clip-path", (e, i) => `url(#clip-${n}-${i})`)
        .text((e) => e.data.name)
        .each(function (e) {
          const i = U(this),
            f = e.x1 - e.x0,
            w = e.y1 - e.y0,
            L = i.node(),
            T = f - 2 * J,
            P = w - 2 * J;
          if (T < se || P < se) {
            i.style("display", "none");
            return;
          }
          let m = parseInt(i.style("font-size"), 10);
          const _ = 0.6;
          for (; L.getComputedTextLength() > T && m > D;) (m--, i.style("font-size", `${m}px`));
          let F = Math.max(I, Math.min(j, Math.round(m * _))),
            k = m + K + F;
          for (; k > P && m > D && (m--, (F = Math.max(I, Math.min(j, Math.round(m * _)))), !(F < I && m === D));)
            (i.style("font-size", `${m}px`), (k = m + K + F));
          (i.style("font-size", `${m}px`),
            A
              ? (m < D || P < D) && i.style("display", "none")
              : (L.getComputedTextLength() > T || m < D || P < m) && i.style("display", "none"));
        }),
      c.showValues !== !1 &&
        Y.append("text")
          .attr("class", "treemapValue")
          .attr("x", (i) => (i.x1 - i.x0) / 2)
          .attr("y", function (i) {
            return (i.y1 - i.y0) / 2;
          })
          .attr("style", (i) => {
            const f = `text-anchor: middle; dominant-baseline: hanging; font-size: ${j}px;fill:` + $(i.data.name) + ";",
              w = B({ cssCompiledStyles: i.data.cssCompiledStyles });
            return f + w.labelStyles.replace("color:", "fill:");
          })
          .attr("clip-path", (i, f) => `url(#clip-${n}-${f})`)
          .text((i) => (i.value ? u(i.value) : ""))
          .each(function (i) {
            const f = U(this),
              w = this.parentNode;
            if (!w) {
              f.style("display", "none");
              return;
            }
            const L = U(w).select(".treemapLabel");
            if (L.empty() || L.style("display") === "none") {
              f.style("display", "none");
              return;
            }
            const T = parseFloat(L.style("font-size")),
              m = Math.max(I, Math.min(j, Math.round(T * 0.6)));
            f.style("font-size", `${m}px`);
            const F = (i.y1 - i.y0) / 2 + T / 2 + K;
            f.attr("y", F);
            const k = i.x1 - i.x0,
              ce = i.y1 - i.y0 - 4,
              ye = k - 2 * J;
            f.node().getComputedTextLength() > ye || F + m > ce || m < I
              ? f.style("display", "none")
              : f.style("display", null);
          }));
    const ge = (oe = c.diagramPadding) != null ? oe : 8;
    _e(y, ge, "flowchart", (c == null ? void 0 : c.useMaxWidth) || !1);
  }, "draw"),
  dt = C(function (t, n) {
    return n.db.getClasses();
  }, "getClasses"),
  pt = { draw: ht, getClasses: dt },
  ut = {
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
    var g, o, d;
    const n = ve(),
      l = ae(),
      a = ee(n, l.themeVariables),
      r = ee(ut, t),
      c = (g = r.titleColor) != null ? g : a.titleColor,
      h = (o = r.labelColor) != null ? o : a.textColor,
      p = (d = r.valueColor) != null ? d : a.textColor;
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
    fill: ${h};
    font-size: ${r.labelFontSize};
  }
  .treemapValue {
    fill: ${p};
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
    parser: pe,
    get db() {
      return new he();
    },
    renderer: pt,
    styles: gt,
  };
export { Tt as diagram };
