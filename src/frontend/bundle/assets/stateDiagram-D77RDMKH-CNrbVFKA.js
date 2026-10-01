import { s as A, a as W, S as N } from "./chunk-IMKFNOWR-DlDvO2yo.js";
import {
  _ as u,
  d as t,
  m as M,
  l as S,
  e as G,
  V as P,
  n as z,
  W as U,
  X as C,
  R as D,
  B as F,
} from "./registry-BL-NPVNy.js";
import { l as I } from "./layout-DnjO4kuL.js";
import "./chunk-XXDRQBXY-2Z0xbgBy.js";
import "./chunk-POPQ4Y6H-BzHSvZYn.js";
import "./chunk-F27PBJKO-iDQskvIx.js";
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
      a = new e.Error().stack;
    a &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[a] = "5efaf12d-d51c-4510-aa3a-48b56dcca6e4"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-5efaf12d-d51c-4510-aa3a-48b56dcca6e4"));
  })();
} catch {}
var O = u(
    (e) =>
      e
        .append("circle")
        .attr("class", "start-state")
        .attr("r", t().state.sizeUnit)
        .attr("cx", t().state.padding + t().state.sizeUnit)
        .attr("cy", t().state.padding + t().state.sizeUnit),
    "drawStartState",
  ),
  X = u(
    (e) =>
      e
        .append("line")
        .style("stroke", "grey")
        .style("stroke-dasharray", "3")
        .attr("x1", t().state.textHeight)
        .attr("class", "divider")
        .attr("x2", t().state.textHeight * 2)
        .attr("y1", 0)
        .attr("y2", 0),
    "drawDivider",
  ),
  J = u((e, a) => {
    const s = e
        .append("text")
        .attr("x", 2 * t().state.padding)
        .attr("y", t().state.textHeight + 2 * t().state.padding)
        .attr("font-size", t().state.fontSize)
        .attr("class", "state-title")
        .text(a.id),
      c = s.node().getBBox();
    return (
      e
        .insert("rect", ":first-child")
        .attr("x", t().state.padding)
        .attr("y", t().state.padding)
        .attr("width", c.width + 2 * t().state.padding)
        .attr("height", c.height + 2 * t().state.padding)
        .attr("rx", t().state.radius),
      s
    );
  }, "drawSimpleState"),
  Y = u((e, a) => {
    const s = u(function (o, m, y) {
        const E = o
          .append("tspan")
          .attr("x", 2 * t().state.padding)
          .text(m);
        y || E.attr("dy", t().state.textHeight);
      }, "addTspan"),
      r = e
        .append("text")
        .attr("x", 2 * t().state.padding)
        .attr("y", t().state.textHeight + 1.3 * t().state.padding)
        .attr("font-size", t().state.fontSize)
        .attr("class", "state-title")
        .text(a.descriptions[0])
        .node()
        .getBBox(),
      g = r.height,
      p = e
        .append("text")
        .attr("x", t().state.padding)
        .attr("y", g + t().state.padding * 0.4 + t().state.dividerMargin + t().state.textHeight)
        .attr("class", "state-description");
    let i = !0,
      d = !0;
    a.descriptions.forEach(function (o) {
      (i || (s(p, o, d), (d = !1)), (i = !1));
    });
    const b = e
        .append("line")
        .attr("x1", t().state.padding)
        .attr("y1", t().state.padding + g + t().state.dividerMargin / 2)
        .attr("y2", t().state.padding + g + t().state.dividerMargin / 2)
        .attr("class", "descr-divider"),
      f = p.node().getBBox(),
      l = Math.max(f.width, r.width);
    return (
      b.attr("x2", l + 3 * t().state.padding),
      e
        .insert("rect", ":first-child")
        .attr("x", t().state.padding)
        .attr("y", t().state.padding)
        .attr("width", l + 2 * t().state.padding)
        .attr("height", f.height + g + 2 * t().state.padding)
        .attr("rx", t().state.radius),
      e
    );
  }, "drawDescrState"),
  $ = u((e, a, s) => {
    const c = t().state.padding,
      r = 2 * t().state.padding,
      g = e.node().getBBox(),
      p = g.width,
      i = g.x,
      d = e
        .append("text")
        .attr("x", 0)
        .attr("y", t().state.titleShift)
        .attr("font-size", t().state.fontSize)
        .attr("class", "state-title")
        .text(a.id),
      f = d.node().getBBox().width + r;
    let l = Math.max(f, p);
    l === p && (l = l + r);
    let o;
    const m = e.node().getBBox();
    (a.doc, (o = i - c), f > p && (o = (p - l) / 2 + c), Math.abs(i - m.x) < c && f > p && (o = i - (f - p) / 2));
    const y = 1 - t().state.textHeight;
    return (
      e
        .insert("rect", ":first-child")
        .attr("x", o)
        .attr("y", y)
        .attr("class", s ? "alt-composit" : "composit")
        .attr("width", l)
        .attr("height", m.height + t().state.textHeight + t().state.titleShift + 1)
        .attr("rx", "0"),
      d.attr("x", o + c),
      f <= p && d.attr("x", i + (l - r) / 2 - f / 2 + c),
      e
        .insert("rect", ":first-child")
        .attr("x", o)
        .attr("y", t().state.titleShift - t().state.textHeight - t().state.padding)
        .attr("width", l)
        .attr("height", t().state.textHeight * 3)
        .attr("rx", t().state.radius),
      e
        .insert("rect", ":first-child")
        .attr("x", o)
        .attr("y", t().state.titleShift - t().state.textHeight - t().state.padding)
        .attr("width", l)
        .attr("height", m.height + 3 + 2 * t().state.textHeight)
        .attr("rx", t().state.radius),
      e
    );
  }, "addTitleAndBox"),
  q = u(
    (e) => (
      e
        .append("circle")
        .attr("class", "end-state-outer")
        .attr("r", t().state.sizeUnit + t().state.miniPadding)
        .attr("cx", t().state.padding + t().state.sizeUnit + t().state.miniPadding)
        .attr("cy", t().state.padding + t().state.sizeUnit + t().state.miniPadding),
      e
        .append("circle")
        .attr("class", "end-state-inner")
        .attr("r", t().state.sizeUnit)
        .attr("cx", t().state.padding + t().state.sizeUnit + 2)
        .attr("cy", t().state.padding + t().state.sizeUnit + 2)
    ),
    "drawEndState",
  ),
  V = u((e, a) => {
    let s = t().state.forkWidth,
      c = t().state.forkHeight;
    if (a.parentId) {
      let r = s;
      ((s = c), (c = r));
    }
    return e
      .append("rect")
      .style("stroke", "black")
      .style("fill", "black")
      .attr("width", s)
      .attr("height", c)
      .attr("x", t().state.padding)
      .attr("y", t().state.padding);
  }, "drawForkJoinState"),
  Z = u((e, a, s, c) => {
    let r = 0;
    const g = c.append("text");
    (g.style("text-anchor", "start"), g.attr("class", "noteText"));
    let p = e.replace(/\r\n/g, "<br/>");
    p = p.replace(/\n/g, "<br/>");
    const i = p.split(z.lineBreakRegex);
    let d = 1.25 * t().state.noteMargin;
    for (const b of i) {
      const f = b.trim();
      if (f.length > 0) {
        const l = g.append("tspan");
        if ((l.text(f), d === 0)) {
          const o = l.node().getBBox();
          d += o.height;
        }
        ((r += d), l.attr("x", a + t().state.noteMargin), l.attr("y", s + r + 1.25 * t().state.noteMargin));
      }
    }
    return { textWidth: g.node().getBBox().width, textHeight: r };
  }, "_drawLongText"),
  j = u((e, a) => {
    a.attr("class", "state-note");
    const s = a.append("rect").attr("x", 0).attr("y", t().state.padding),
      c = a.append("g"),
      { textWidth: r, textHeight: g } = Z(e, 0, 0, c);
    return (s.attr("height", g + 2 * t().state.noteMargin), s.attr("width", r + t().state.noteMargin * 2), s);
  }, "drawNote"),
  L = u(function (e, a) {
    const s = a.id,
      c = { id: s, label: a.id, width: 0, height: 0 },
      r = e.append("g").attr("id", s).attr("class", "stateGroup");
    (a.type === "start" && O(r),
      a.type === "end" && q(r),
      (a.type === "fork" || a.type === "join") && V(r, a),
      a.type === "note" && j(a.note.text, r),
      a.type === "divider" && X(r),
      a.type === "default" && a.descriptions.length === 0 && J(r, a),
      a.type === "default" && a.descriptions.length > 0 && Y(r, a));
    const g = r.node().getBBox();
    return ((c.width = g.width + 2 * t().state.padding), (c.height = g.height + 2 * t().state.padding), c);
  }, "drawState"),
  _ = 0,
  K = u(function (e, a, s) {
    const c = u(function (d) {
      switch (d) {
        case N.relationType.AGGREGATION:
          return "aggregation";
        case N.relationType.EXTENSION:
          return "extension";
        case N.relationType.COMPOSITION:
          return "composition";
        case N.relationType.DEPENDENCY:
          return "dependency";
      }
    }, "getRelationType");
    a.points = a.points.filter((d) => !Number.isNaN(d.y));
    const r = a.points,
      g = U()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
          return d.y;
        })
        .curve(C),
      p = e
        .append("path")
        .attr("d", g(r))
        .attr("id", "edge" + _)
        .attr("class", "transition");
    let i = "";
    if (
      (t().state.arrowMarkerAbsolute && (i = D(!0)),
      p.attr("marker-end", "url(" + i + "#" + c(N.relationType.DEPENDENCY) + "End)"),
      s.title !== void 0)
    ) {
      const d = e.append("g").attr("class", "stateLabel"),
        { x: b, y: f } = F.calcLabelPosition(a.points),
        l = z.getRows(s.title);
      let o = 0;
      const m = [];
      let y = 0,
        E = 0;
      for (let x = 0; x <= l.length; x++) {
        const h = d
            .append("text")
            .attr("text-anchor", "middle")
            .text(l[x])
            .attr("x", b)
            .attr("y", f + o),
          w = h.node().getBBox();
        ((y = Math.max(y, w.width)),
          (E = Math.min(E, w.x)),
          S.info(w.x, b, f + o),
          o === 0 && ((o = h.node().getBBox().height), S.info("Title height", o, f)),
          m.push(h));
      }
      let k = o * l.length;
      if (l.length > 1) {
        const x = (l.length - 1) * o * 0.5;
        (m.forEach((h, w) => h.attr("y", f + w * o - x)), (k = o * l.length));
      }
      const n = d.node().getBBox();
      (d
        .insert("rect", ":first-child")
        .attr("class", "box")
        .attr("x", b - y / 2 - t().state.padding / 2)
        .attr("y", f - k / 2 - t().state.padding / 2 - 3.5)
        .attr("width", y + t().state.padding)
        .attr("height", k + t().state.padding),
        S.info(n));
    }
    _++;
  }, "drawEdge"),
  B,
  H = {},
  Q = u(function () {}, "setConf"),
  tt = u(function (e) {
    e.append("defs")
      .append("marker")
      .attr("id", "dependencyEnd")
      .attr("refX", 19)
      .attr("refY", 7)
      .attr("markerWidth", 20)
      .attr("markerHeight", 28)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
  }, "insertMarkers"),
  et = u(function (e, a, s, c) {
    B = t().state;
    const r = t().securityLevel;
    let g;
    r === "sandbox" && (g = M("#i" + a));
    const p = r === "sandbox" ? M(g.nodes()[0].contentDocument.body) : M("body"),
      i = r === "sandbox" ? g.nodes()[0].contentDocument : document;
    S.debug("Rendering diagram " + e);
    const d = p.select(`[id='${a}']`);
    tt(d);
    const b = c.db.getRootDoc(),
      f = d.append("g").attr("id", a + "-root");
    R(b, f, void 0, !1, p, i, c);
    const l = B.padding,
      o = d.node().getBBox(),
      m = o.width + l * 2,
      y = o.height + l * 2,
      E = m * 1.75;
    (G(d, y, E, B.useMaxWidth), d.attr("viewBox", `${o.x - B.padding}  ${o.y - B.padding} ` + m + " " + y));
  }, "draw"),
  at = u((e) => (e ? e.length * B.fontSizeFactor : 1), "getLabelWidth"),
  R = u((e, a, s, c, r, g, p) => {
    const i = new P({ compound: !0, multigraph: !0 });
    let d,
      b = !0;
    for (d = 0; d < e.length; d++)
      if (e[d].stmt === "relation") {
        b = !1;
        break;
      }
    (s
      ? i.setGraph({
          rankdir: "LR",
          multigraph: !0,
          compound: !0,
          ranker: "tight-tree",
          ranksep: b ? 1 : B.edgeLengthFactor,
          nodeSep: b ? 1 : 50,
          isMultiGraph: !0,
        })
      : i.setGraph({
          rankdir: "TB",
          multigraph: !0,
          compound: !0,
          ranksep: b ? 1 : B.edgeLengthFactor,
          nodeSep: b ? 1 : 50,
          ranker: "tight-tree",
          isMultiGraph: !0,
        }),
      i.setDefaultEdgeLabel(function () {
        return {};
      }));
    const f = p.db.getStates(),
      l = p.db.getRelations(),
      o = Object.keys(f);
    for (const n of o) {
      const x = f[n];
      s && (x.parentId = s);
      let h;
      if (x.doc) {
        let w = a.append("g").attr("id", x.id).attr("class", "stateGroup");
        h = R(x.doc, w, x.id, !c, r, g, p);
        {
          w = $(w, x, c);
          let v = w.node().getBBox();
          ((h.width = v.width), (h.height = v.height + B.padding / 2), (H[x.id] = { y: B.compositTitleSize }));
        }
      } else h = L(a, x, i);
      if (x.note) {
        const w = { descriptions: [], id: x.id + "-note", note: x.note, type: "note" },
          v = L(a, w, i);
        (x.note.position === "left of"
          ? (i.setNode(h.id + "-note", v), i.setNode(h.id, h))
          : (i.setNode(h.id, h), i.setNode(h.id + "-note", v)),
          i.setParent(h.id, h.id + "-group"),
          i.setParent(h.id + "-note", h.id + "-group"));
      } else i.setNode(h.id, h);
    }
    S.debug("Count=", i.nodeCount(), i);
    let m = 0;
    (l.forEach(function (n) {
      (m++,
        S.debug("Setting edge", n),
        i.setEdge(
          n.id1,
          n.id2,
          { relation: n, width: at(n.title), height: B.labelHeight * z.getRows(n.title).length, labelpos: "c" },
          "id" + m,
        ));
    }),
      I(i),
      S.debug("Graph after layout", i.nodes()));
    const y = a.node();
    i.nodes().forEach(function (n) {
      n !== void 0 && i.node(n) !== void 0
        ? (S.warn("Node " + n + ": " + JSON.stringify(i.node(n))),
          r
            .select("#" + y.id + " #" + n)
            .attr(
              "transform",
              "translate(" +
                (i.node(n).x - i.node(n).width / 2) +
                "," +
                (i.node(n).y + (H[n] ? H[n].y : 0) - i.node(n).height / 2) +
                " )",
            ),
          r.select("#" + y.id + " #" + n).attr("data-x-shift", i.node(n).x - i.node(n).width / 2),
          g.querySelectorAll("#" + y.id + " #" + n + " .divider").forEach((h) => {
            const w = h.parentElement;
            let v = 0,
              T = 0;
            (w &&
              (w.parentElement && (v = w.parentElement.getBBox().width),
              (T = parseInt(w.getAttribute("data-x-shift"), 10)),
              Number.isNaN(T) && (T = 0)),
              h.setAttribute("x1", 0 - T + 8),
              h.setAttribute("x2", v - T - 8));
          }))
        : S.debug("No Node " + n + ": " + JSON.stringify(i.node(n)));
    });
    let E = y.getBBox();
    (i.edges().forEach(function (n) {
      n !== void 0 &&
        i.edge(n) !== void 0 &&
        (S.debug("Edge " + n.v + " -> " + n.w + ": " + JSON.stringify(i.edge(n))), K(a, i.edge(n), i.edge(n).relation));
    }),
      (E = y.getBBox()));
    const k = { id: s || "root", label: s || "root", width: 0, height: 0 };
    return (
      (k.width = E.width + 2 * B.padding),
      (k.height = E.height + 2 * B.padding),
      S.debug("Doc rendered", k, i),
      k
    );
  }, "renderDoc"),
  it = { setConf: Q, draw: et },
  lt = {
    parser: W,
    get db() {
      return new N(1);
    },
    renderer: it,
    styles: A,
    init: u((e) => {
      (e.state || (e.state = {}), (e.state.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
    }, "init"),
  };
export { lt as diagram };
