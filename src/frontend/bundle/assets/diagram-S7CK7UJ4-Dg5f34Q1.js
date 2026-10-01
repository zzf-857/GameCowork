import { I as z } from "./chunk-2Q5K7J3B-CGGsUze4.js";
import { p as O } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  _ as p,
  p as G,
  b as Y,
  s as F,
  q as P,
  g as q,
  a as Z,
  F as D,
  l as _,
  I as U,
  e as j,
  D as A,
  t as J,
  k as K,
  as as Q,
  G as ee,
  at as te,
} from "./registry-CHHSpXp3.js";
import { p as ne } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      t = new e.Error().stack;
    t &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[t] = "7a64c2d1-1c15-423d-9164-c8094fc7b67d"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-7a64c2d1-1c15-423d-9164-c8094fc7b67d"));
  })();
} catch {}
var L = /[─━│┃└┗├┣]/,
  S = /[└┗├┣]/,
  re = /[─━]/,
  E = /^[\s│┃]+$/,
  N = /^\s*(title[\t ]|accTitle[\t ]*:|accDescr[\t ]*[:{])/,
  V = /^\s*%%/,
  ie = "    ";
function M(e) {
  return e.some((t) => L.test(t));
}
p(M, "isBoxDrawingFormat");
function R(e) {
  for (const t of e) {
    const n = S.exec(t);
    if (n != null && n.index && n.index > 0) return n.index;
  }
  return 4;
}
p(R, "inferSegmentWidth");
function H(e, t) {
  return e.replace(/\bline\s+(\d+)\b/gi, (n, i) => {
    const a = parseInt(i, 10),
      o = t.get(a);
    return o ? `line ${o}` : n;
  });
}
p(H, "remapErrorLines");
function W(e) {
  const t = e.split(`
`),
    n = new Map();
  let i = -1;
  for (const [l, c] of t.entries())
    if (c.trim() === "treeView-beta") {
      i = l;
      break;
    }
  if (i === -1) return { text: e, lineMap: n };
  const a = [];
  for (let l = i + 1; l < t.length; l++) {
    const c = t[l];
    c.trim() === "" || V.test(c) || N.test(c) || E.test(c) || a.push(c.replace(/\t/g, "    "));
  }
  if (!M(a)) return { text: e, lineMap: n };
  const o = R(a),
    r = [];
  let s = 0;
  for (let l = 0; l <= i; l++) (r.push(t[l]), s++, n.set(s, l + 1));
  for (let l = i + 1; l < t.length; l++) {
    const c = t[l],
      u = c.trim(),
      d = l + 1;
    if (u === "") {
      (r.push(c), s++, n.set(s, d));
      continue;
    }
    if (V.test(c)) {
      (r.push(c), s++, n.set(s, d));
      continue;
    }
    if (N.test(c)) {
      (r.push(c), s++, n.set(s, d));
      continue;
    }
    if (E.test(c)) continue;
    const f = c.replace(/\t/g, "    "),
      h = S.exec(f);
    if ((h == null ? void 0 : h.index) !== void 0) {
      const m = h.index,
        w = Math.round(m / o) + 1;
      let g = m + 1;
      for (; g < f.length && re.test(f[g]);) g++;
      for (; g < f.length && f[g] === " ";) g++;
      const v = f.slice(g).trimEnd();
      if (!v)
        throw new Error(`Line ${d}: Empty node — expected a filename or directory name after the box-drawing prefix`);
      const x = ie.repeat(w);
      (r.push(x + v), s++, n.set(s, d));
    } else {
      if (/^[\s─━│┃└┗├┣]+$/.test(f)) continue;
      if (L.test(f)) (r.push(c), s++, n.set(s, d));
      else {
        if (/^\s+/.test(f))
          throw new Error(
            `Line ${d}: Unexpected indentation without box-drawing characters. In box-drawing format, use ├── or └── prefixes for indented nodes.`,
          );
        (r.push(c), s++, n.set(s, d));
      }
    }
  }
  return {
    text: r.join(`
`),
    lineMap: n,
  };
}
p(W, "preprocessBoxDrawing");
var b = new z(() => ({ cnt: 1, stack: [{ id: 0, level: -1, name: "/", nodeType: "directory", children: [] }] })),
  oe = p(() => {
    (b.reset(), J());
  }, "clear"),
  se = p(() => b.records.stack[0], "getRoot"),
  ae = p(() => b.records.cnt, "getCount"),
  de = ee.treeView,
  ce = p(() => D(de, A().treeView), "getConfig"),
  le = p((e, t, n, i, a, o) => {
    for (; e <= b.records.stack[b.records.stack.length - 1].level;) b.records.stack.pop();
    const r = {
      id: b.records.cnt++,
      level: e,
      name: t,
      nodeType: n,
      icon: a,
      cssClass: i,
      description: o,
      children: [],
    };
    (b.records.stack[b.records.stack.length - 1].children.push(r), b.records.stack.push(r));
  }, "addNode"),
  he = {
    clear: oe,
    addNode: le,
    getRoot: se,
    getCount: ae,
    getConfig: ce,
    getAccTitle: Z,
    getAccDescription: q,
    getDiagramTitle: P,
    setAccDescription: F,
    setAccTitle: Y,
    setDiagramTitle: G,
  },
  I = he,
  fe = p((e) => {
    O(e, I);
    for (const t of e.nodes) {
      const n = typeof t.indent == "number" ? t.indent : 0;
      let i = t.name;
      const a = i.endsWith("/");
      a && (i = i.slice(0, -1));
      const o = a ? "directory" : "file",
        r = t.classAnnotation || void 0,
        s = t.iconAnnotation,
        l = s !== void 0 ? s || "none" : void 0,
        c = t.descAnnotation || void 0,
        u = c ? K(c, A()) : void 0;
      I.addNode(n, i, o, r, l, u);
    }
  }, "populate"),
  pe = {
    parse: p(async (e) => {
      const { text: t, lineMap: n } = W(e);
      try {
        const i = await ne("treeView", t);
        (_.debug(i), fe(i));
      } catch (i) {
        throw (n.size > 0 && i instanceof Error && (i.message = H(i.message, n)), i);
      }
    }, "parse"),
  },
  y = {
    prefix: "mermaid-treeview",
    height: 24,
    width: 24,
    icons: {
      folder: {
        body: '<path fill="currentColor" d="M10.59 4.59A2 2 0 0 0 9.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.17z"/>',
      },
      file: {
        body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.42l-4.82-4.82A2 2 0 0 0 13.17 2H6Zm7.5 1.9l4.6 4.6h-3.6a1 1 0 0 1-1-1V3.9Z" clip-rule="evenodd"/>',
      },
    },
  };
function X(e, t) {
  var a, o;
  const n = (a = t == null ? void 0 : t.filenameIcons) == null ? void 0 : a[e];
  if (n) return n;
  const i = e.lastIndexOf(".");
  if (i > 0) {
    const r = e.substring(i).toLowerCase(),
      s = t == null ? void 0 : t.extensionIcons;
    return (o = s == null ? void 0 : s[r]) != null ? o : s == null ? void 0 : s[r.slice(1)];
  }
}
p(X, "detectIcon");
function C(e, t) {
  return e.includes(":") ? e : e in y.icons || !t ? `${y.prefix}:${e}` : `${t}:${e}`;
}
p(C, "qualifyIcon");
function B(e, t) {
  if (e.icon !== "none") {
    if (e.icon) return C(e.icon, t.defaultIconPack);
    if (t.showIcons) {
      if (e.nodeType === "file") {
        const n = X(e.name, t);
        if (n === "none") return;
        if (n) return C(n, t.defaultIconPack);
      }
      return `${y.prefix}:${e.nodeType === "directory" ? "folder" : "file"}`;
    }
  }
}
p(B, "getNodeIcon");
te([{ name: y.prefix, icons: y }]);
var T = 14,
  ge = 4,
  ue = 16,
  we = p(async (e, t) => {
    const n = [],
      i = p((o) => {
        const r = B(o, t);
        (r && n.push({ icon: r, node: o }), o.children.forEach(i));
      }, "collect");
    i(e);
    const a = await Promise.all(
      n.map(async ({ icon: o, node: r }) => ({ id: r.id, svg: await Q(o, { height: T, width: T }) })),
    );
    return new Map(a.map(({ id: o, svg: r }) => [o, r]));
  }, "resolveNodeIcons"),
  me = p((e, t, n, i, a, o) => {
    var x, k;
    const r = i.append("g");
    let s = "treeView-node-label";
    (n.nodeType === "directory" && (s += " treeView-node-dir"), n.cssClass && (s += ` ${n.cssClass}`));
    const l = T + ge,
      c = B(n, a),
      u = c !== void 0;
    c &&
      r
        .append("g")
        .attr("class", "treeView-node-icon")
        .attr("transform", `translate(${e + a.paddingX}, ${t + a.paddingY})`)
        .html((x = o.get(n.id)) != null ? x : "");
    const d = r.append("text").text(n.name).attr("dominant-baseline", "middle").attr("class", s),
      { height: f, width: h } = d.node().getBBox(),
      m = f + a.paddingY * 2,
      w = e + a.paddingX + (u ? l : 0);
    (d.attr("x", w), d.attr("y", t + m / 2));
    const g = w + h,
      v = h + a.paddingX * 2 + (u ? l : 0);
    return (
      (n.BBox = { x: e, y: t, width: v, height: m }),
      (k = n.cssClass) != null &&
        k.split(/\s+/).includes("highlight") &&
        r
          .insert("rect", ":first-child")
          .attr("x", e)
          .attr("y", t + 1)
          .attr("width", 0)
          .attr("height", m - 2)
          .attr("rx", 3)
          .attr("class", "treeView-highlight-bg"),
      { node: n, nodeGroup: r, labelRightEdge: g, centerY: t + m / 2 }
    );
  }, "positionLabel"),
  $ = p(
    (e, t, n, i, a, o) =>
      e
        .append("line")
        .attr("x1", t)
        .attr("y1", n)
        .attr("x2", i)
        .attr("y2", a)
        .attr("stroke-width", o)
        .attr("class", "treeView-node-line"),
    "positionLine",
  ),
  ve = p((e, t, n, i) => {
    var u;
    let a = 0,
      o = 0;
    const r = [],
      s = p((d, f, h, m) => {
        const w = m * (h.rowIndent + h.paddingX),
          g = me(w, a, f, d, h, i);
        r.push(g);
        const { height: v, width: x } = f.BBox;
        ($(d, w - h.rowIndent, a + v / 2, w, a + v / 2, h.lineThickness), (o = Math.max(o, w + x)), (a += v));
      }, "drawNode"),
      l = p((d, f = 0) => {
        (s(e, d, n, f),
          d.children.forEach((g) => {
            l(g, f + 1);
          }));
        const { x: h, y: m, height: w } = d.BBox;
        if (d.children.length) {
          const { y: g, height: v } = d.children[d.children.length - 1].BBox;
          $(e, h + n.paddingX, m + w, h + n.paddingX, g + v / 2 + n.lineThickness / 2, n.lineThickness);
        }
      }, "processNode");
    l(t);
    const c = r.filter((d) => d.node.description);
    if (c.length > 0) {
      const f = Math.max(...r.map((h) => h.labelRightEdge)) + ue;
      for (const h of c) {
        const w = h.nodeGroup
          .append("text")
          .text(h.node.description)
          .attr("dominant-baseline", "middle")
          .attr("class", "treeView-node-description")
          .attr("x", f)
          .attr("y", h.centerY)
          .node()
          .getBBox();
        o = Math.max(o, f + w.width + n.paddingX);
      }
    }
    for (const d of r)
      if ((u = d.node.cssClass) != null && u.split(/\s+/).includes("highlight")) {
        const f = d.nodeGroup.select(".treeView-highlight-bg");
        if (!f.empty()) {
          const h = o - d.node.BBox.x + 8;
          (f.attr("width", h), (o = Math.max(o, d.node.BBox.x + h + 2)));
        }
      }
    return { totalHeight: a, totalWidth: o };
  }, "drawTree"),
  be = p(async (e, t, n, i) => {
    _.debug(
      `Rendering treeView diagram
` + e,
    );
    const a = i.db,
      o = a.getRoot(),
      r = a.getConfig(),
      s = U(t),
      l = s.append("g");
    l.attr("class", "tree-view");
    const c = await we(o, r),
      { totalHeight: u, totalWidth: d } = ve(l, o, r, c);
    (s.attr("viewBox", `-${r.lineThickness / 2} 0 ${d} ${u}`), j(s, u, d, r.useMaxWidth));
  }, "draw"),
  xe = { draw: be },
  ye = xe,
  Ie = {
    labelFontSize: "16px",
    labelColor: "black",
    lineColor: "black",
    iconColor: "#546e7a",
    descriptionColor: "#6a9955",
    highlightBg: "rgba(255, 193, 7, 0.15)",
    highlightStroke: "#ffc107",
  },
  Ce = p(({ treeView: e }) => {
    const {
      labelFontSize: t,
      labelColor: n,
      lineColor: i,
      iconColor: a,
      descriptionColor: o,
      highlightBg: r,
      highlightStroke: s,
    } = D(Ie, e);
    return `
    .treeView-node-label {
        font-size: ${t};
        fill: ${n};
        white-space: pre;
    }
    .treeView-node-dir {
        font-weight: bold;
    }
    .treeView-node-line {
        stroke: ${i};
    }
    .treeView-node-icon {
        color: ${a};
    }
    .treeView-node-description {
        font-size: ${t};
        fill: ${o};
        font-style: italic;
        white-space: pre;
    }
    .treeView-highlight-bg {
        fill: ${r};
        stroke: ${s};
        stroke-width: 1;
    }
    `;
  }, "styles"),
  Te = Ce,
  Ve = { db: I, renderer: ye, parser: pe, styles: Te };
export { Ve as diagram };
