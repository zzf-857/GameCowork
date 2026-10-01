import { I as z } from "./chunk-2Q5K7J3B-Bw3toqm2.js";
import { p as O } from "./chunk-JWPE2WC7-T25dSmDk.js";
import {
  _ as g,
  n as G,
  b as Y,
  s as P,
  o as F,
  g as Z,
  a as q,
  A as E,
  l as D,
  D as U,
  d as j,
  y as L,
  p as J,
  i as K,
  am as Q,
  B as ee,
  an as te,
} from "../index-DG7m4Xaq.js";
import { p as re } from "./cynefin-OW5HDTMX-FwiEsyvy.js";
var _ = /[─━│┃└┗├┣]/,
  S = /[└┗├┣]/,
  ne = /[─━]/,
  $ = /^[\s│┃]+$/,
  k = /^\s*(title[\t ]|accTitle[\t ]*:|accDescr[\t ]*[:{])/,
  N = /^\s*%%/,
  ie = "    ";
function M(r) {
  return r.some((t) => _.test(t));
}
g(M, "isBoxDrawingFormat");
function R(r) {
  for (const t of r) {
    const e = S.exec(t);
    if (e != null && e.index && e.index > 0) return e.index;
  }
  return 4;
}
g(R, "inferSegmentWidth");
function H(r, t) {
  return r.replace(/\bline\s+(\d+)\b/gi, (e, i) => {
    const a = parseInt(i, 10),
      o = t.get(a);
    return o ? `line ${o}` : e;
  });
}
g(H, "remapErrorLines");
function W(r) {
  const t = r.split(`
`),
    e = new Map();
  let i = -1;
  for (const [d, l] of t.entries())
    if (l.trim() === "treeView-beta") {
      i = d;
      break;
    }
  if (i === -1) return { text: r, lineMap: e };
  const a = [];
  for (let d = i + 1; d < t.length; d++) {
    const l = t[d];
    l.trim() === "" || N.test(l) || k.test(l) || $.test(l) || a.push(l.replace(/\t/g, "    "));
  }
  if (!M(a)) return { text: r, lineMap: e };
  const o = R(a),
    n = [];
  let s = 0;
  for (let d = 0; d <= i; d++) (n.push(t[d]), s++, e.set(s, d + 1));
  for (let d = i + 1; d < t.length; d++) {
    const l = t[d],
      u = l.trim(),
      c = d + 1;
    if (u === "") {
      (n.push(l), s++, e.set(s, c));
      continue;
    }
    if (N.test(l)) {
      (n.push(l), s++, e.set(s, c));
      continue;
    }
    if (k.test(l)) {
      (n.push(l), s++, e.set(s, c));
      continue;
    }
    if ($.test(l)) continue;
    const p = l.replace(/\t/g, "    "),
      h = S.exec(p);
    if ((h == null ? void 0 : h.index) !== void 0) {
      const m = h.index,
        w = Math.round(m / o) + 1;
      let f = m + 1;
      for (; f < p.length && ne.test(p[f]);) f++;
      for (; f < p.length && p[f] === " ";) f++;
      const v = p.slice(f).trimEnd();
      if (!v)
        throw new Error(`Line ${c}: Empty node — expected a filename or directory name after the box-drawing prefix`);
      const b = ie.repeat(w);
      (n.push(b + v), s++, e.set(s, c));
    } else {
      if (/^[\s─━│┃└┗├┣]+$/.test(p)) continue;
      if (_.test(p)) (n.push(l), s++, e.set(s, c));
      else {
        if (/^\s+/.test(p))
          throw new Error(
            `Line ${c}: Unexpected indentation without box-drawing characters. In box-drawing format, use ├── or └── prefixes for indented nodes.`,
          );
        (n.push(l), s++, e.set(s, c));
      }
    }
  }
  return {
    text: n.join(`
`),
    lineMap: e,
  };
}
g(W, "preprocessBoxDrawing");
var x = new z(() => ({ cnt: 1, stack: [{ id: 0, level: -1, name: "/", nodeType: "directory", children: [] }] })),
  oe = g(() => {
    (x.reset(), J());
  }, "clear"),
  se = g(() => x.records.stack[0], "getRoot"),
  ae = g(() => x.records.cnt, "getCount"),
  ce = ee.treeView,
  le = g(() => E(ce, L().treeView), "getConfig"),
  de = g((r, t, e, i, a, o) => {
    for (; r <= x.records.stack[x.records.stack.length - 1].level;) x.records.stack.pop();
    const n = {
      id: x.records.cnt++,
      level: r,
      name: t,
      nodeType: e,
      icon: a,
      cssClass: i,
      description: o,
      children: [],
    };
    (x.records.stack[x.records.stack.length - 1].children.push(n), x.records.stack.push(n));
  }, "addNode"),
  he = {
    clear: oe,
    addNode: de,
    getRoot: se,
    getCount: ae,
    getConfig: le,
    getAccTitle: q,
    getAccDescription: Z,
    getDiagramTitle: F,
    setAccDescription: P,
    setAccTitle: Y,
    setDiagramTitle: G,
  },
  I = he,
  pe = g((r) => {
    O(r, I);
    for (const t of r.nodes) {
      const e = typeof t.indent == "number" ? t.indent : 0;
      let i = t.name;
      const a = i.endsWith("/");
      a && (i = i.slice(0, -1));
      const o = a ? "directory" : "file",
        n = t.classAnnotation || void 0,
        s = t.iconAnnotation,
        d = s !== void 0 ? s || "none" : void 0,
        l = t.descAnnotation || void 0,
        u = l ? K(l, L()) : void 0;
      I.addNode(e, i, o, n, d, u);
    }
  }, "populate"),
  ge = {
    parse: g(async (r) => {
      const { text: t, lineMap: e } = W(r);
      try {
        const i = await re("treeView", t);
        (D.debug(i), pe(i));
      } catch (i) {
        throw (e.size > 0 && i instanceof Error && (i.message = H(i.message, e)), i);
      }
    }, "parse"),
  },
  C = {
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
function X(r, t) {
  var a, o;
  const e = (a = t == null ? void 0 : t.filenameIcons) == null ? void 0 : a[r];
  if (e) return e;
  const i = r.lastIndexOf(".");
  if (i > 0) {
    const n = r.substring(i).toLowerCase(),
      s = t == null ? void 0 : t.extensionIcons;
    return (o = s == null ? void 0 : s[n]) != null ? o : s == null ? void 0 : s[n.slice(1)];
  }
}
g(X, "detectIcon");
function y(r, t) {
  return r.includes(":") ? r : r in C.icons || !t ? `${C.prefix}:${r}` : `${t}:${r}`;
}
g(y, "qualifyIcon");
function T(r, t) {
  if (r.icon !== "none") {
    if (r.icon) return y(r.icon, t.defaultIconPack);
    if (t.showIcons) {
      if (r.nodeType === "file") {
        const e = X(r.name, t);
        if (e === "none") return;
        if (e) return y(e, t.defaultIconPack);
      }
      return `${C.prefix}:${r.nodeType === "directory" ? "folder" : "file"}`;
    }
  }
}
g(T, "getNodeIcon");
te([{ name: C.prefix, icons: C }]);
var B = 14,
  fe = 4,
  ue = 16,
  we = g(async (r, t) => {
    const e = [],
      i = g((o) => {
        const n = T(o, t);
        (n && e.push({ icon: n, node: o }), o.children.forEach(i));
      }, "collect");
    i(r);
    const a = await Promise.all(
      e.map(async ({ icon: o, node: n }) => ({ id: n.id, svg: await Q(o, { height: B, width: B }) })),
    );
    return new Map(a.map(({ id: o, svg: n }) => [o, n]));
  }, "resolveNodeIcons"),
  me = g((r, t, e, i, a, o) => {
    var b, V;
    const n = i.append("g");
    let s = "treeView-node-label";
    (e.nodeType === "directory" && (s += " treeView-node-dir"), e.cssClass && (s += ` ${e.cssClass}`));
    const d = B + fe,
      l = T(e, a),
      u = l !== void 0;
    l &&
      n
        .append("g")
        .attr("class", "treeView-node-icon")
        .attr("transform", `translate(${r + a.paddingX}, ${t + a.paddingY})`)
        .html((b = o.get(e.id)) != null ? b : "");
    const c = n.append("text").text(e.name).attr("dominant-baseline", "middle").attr("class", s),
      { height: p, width: h } = c.node().getBBox(),
      m = p + a.paddingY * 2,
      w = r + a.paddingX + (u ? d : 0);
    (c.attr("x", w), c.attr("y", t + m / 2));
    const f = w + h,
      v = h + a.paddingX * 2 + (u ? d : 0);
    return (
      (e.BBox = { x: r, y: t, width: v, height: m }),
      (V = e.cssClass) != null &&
        V.split(/\s+/).includes("highlight") &&
        n
          .insert("rect", ":first-child")
          .attr("x", r)
          .attr("y", t + 1)
          .attr("width", 0)
          .attr("height", m - 2)
          .attr("rx", 3)
          .attr("class", "treeView-highlight-bg"),
      { node: e, nodeGroup: n, labelRightEdge: f, centerY: t + m / 2 }
    );
  }, "positionLabel"),
  A = g(
    (r, t, e, i, a, o) =>
      r
        .append("line")
        .attr("x1", t)
        .attr("y1", e)
        .attr("x2", i)
        .attr("y2", a)
        .attr("stroke-width", o)
        .attr("class", "treeView-node-line"),
    "positionLine",
  ),
  ve = g((r, t, e, i) => {
    var u;
    let a = 0,
      o = 0;
    const n = [],
      s = g((c, p, h, m) => {
        const w = m * (h.rowIndent + h.paddingX),
          f = me(w, a, p, c, h, i);
        n.push(f);
        const { height: v, width: b } = p.BBox;
        (A(c, w - h.rowIndent, a + v / 2, w, a + v / 2, h.lineThickness), (o = Math.max(o, w + b)), (a += v));
      }, "drawNode"),
      d = g((c, p = 0) => {
        (s(r, c, e, p),
          c.children.forEach((f) => {
            d(f, p + 1);
          }));
        const { x: h, y: m, height: w } = c.BBox;
        if (c.children.length) {
          const { y: f, height: v } = c.children[c.children.length - 1].BBox;
          A(r, h + e.paddingX, m + w, h + e.paddingX, f + v / 2 + e.lineThickness / 2, e.lineThickness);
        }
      }, "processNode");
    d(t);
    const l = n.filter((c) => c.node.description);
    if (l.length > 0) {
      const p = Math.max(...n.map((h) => h.labelRightEdge)) + ue;
      for (const h of l) {
        const w = h.nodeGroup
          .append("text")
          .text(h.node.description)
          .attr("dominant-baseline", "middle")
          .attr("class", "treeView-node-description")
          .attr("x", p)
          .attr("y", h.centerY)
          .node()
          .getBBox();
        o = Math.max(o, p + w.width + e.paddingX);
      }
    }
    for (const c of n)
      if ((u = c.node.cssClass) != null && u.split(/\s+/).includes("highlight")) {
        const p = c.nodeGroup.select(".treeView-highlight-bg");
        if (!p.empty()) {
          const h = o - c.node.BBox.x + 8;
          (p.attr("width", h), (o = Math.max(o, c.node.BBox.x + h + 2)));
        }
      }
    return { totalHeight: a, totalWidth: o };
  }, "drawTree"),
  xe = g(async (r, t, e, i) => {
    D.debug(
      `Rendering treeView diagram
` + r,
    );
    const a = i.db,
      o = a.getRoot(),
      n = a.getConfig(),
      s = U(t),
      d = s.append("g");
    d.attr("class", "tree-view");
    const l = await we(o, n),
      { totalHeight: u, totalWidth: c } = ve(d, o, n, l);
    (s.attr("viewBox", `-${n.lineThickness / 2} 0 ${c} ${u}`), j(s, u, c, n.useMaxWidth));
  }, "draw"),
  be = { draw: xe },
  Ce = be,
  Ie = {
    labelFontSize: "16px",
    labelColor: "black",
    lineColor: "black",
    iconColor: "#546e7a",
    descriptionColor: "#6a9955",
    highlightBg: "rgba(255, 193, 7, 0.15)",
    highlightStroke: "#ffc107",
  },
  ye = g(({ treeView: r }) => {
    const {
      labelFontSize: t,
      labelColor: e,
      lineColor: i,
      iconColor: a,
      descriptionColor: o,
      highlightBg: n,
      highlightStroke: s,
    } = E(Ie, r);
    return `
    .treeView-node-label {
        font-size: ${t};
        fill: ${e};
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
        fill: ${n};
        stroke: ${s};
        stroke-width: 1;
    }
    `;
  }, "styles"),
  Be = ye,
  Ne = { db: I, renderer: Ce, parser: ge, styles: Be };
export { Ne as diagram };
