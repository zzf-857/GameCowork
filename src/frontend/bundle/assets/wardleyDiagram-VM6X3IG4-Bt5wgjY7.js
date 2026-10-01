import { p as Xt } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  _ as m,
  s as It,
  g as Yt,
  q as Ft,
  p as Bt,
  a as Rt,
  b as Dt,
  J as Ot,
  D as Wt,
  F as dt,
  l as ct,
  I as Gt,
  e as qt,
  t as _t,
  d as et,
} from "./registry-CHHSpXp3.js";
import { p as Ht } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
(function () {
  var a =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  a.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
})();
try {
  (function () {
    var a =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      o = new a.Error().stack;
    o &&
      ((a._sentryDebugIds = a._sentryDebugIds || {}),
      (a._sentryDebugIds[o] = "a6996b8a-ddeb-42c6-830b-f2ee8848380b"),
      (a._sentryDebugIdIdentifier = "sentry-dbid-a6996b8a-ddeb-42c6-830b-f2ee8848380b"));
  })();
} catch {}
var U = m((a, o) => {
    const e = a <= 1 ? a * 100 : a;
    if (e < 0 || e > 100) throw new Error(`${o} must be between 0-1 (decimal) or 0-100 (percentage). Received: ${a}`);
    return e;
  }, "toPercent"),
  B = m((a, o, e) => ({ x: U(o, `${e} evolution`), y: U(a, `${e} visibility`) }), "toCoordinates"),
  lt = m((a) => {
    if (a) {
      if (a === "+<>") return "bidirectional";
      if (a === "+<") return "backward";
      if (a === "+>") return "forward";
    }
  }, "getFlowFromPort"),
  jt = m((a) => {
    if (!(a != null && a.startsWith("+"))) return {};
    const o = /^\+'([^']*)'/.exec(a),
      e = o == null ? void 0 : o[1];
    return a.includes("<>")
      ? { flow: "bidirectional", label: e }
      : a.includes("<")
        ? { flow: "backward", label: e }
        : a.includes(">")
          ? { flow: "forward", label: e }
          : { label: e };
  }, "extractFlowFromArrow"),
  Vt = m((a, o) => {
    if ((Xt(a, o), a.size && o.setSize(a.size.width, a.size.height), a.evolution)) {
      const e = a.evolution.stages.map((r) =>
          r.secondName ? `${r.name.trim()} / ${r.secondName.trim()}` : r.name.trim(),
        ),
        f = a.evolution.stages.filter((r) => r.boundary !== void 0).map((r) => r.boundary);
      o.updateAxes({ stages: e, stageBoundaries: f });
    }
    if (
      (a.anchors.forEach((e) => {
        const f = B(e.visibility, e.evolution, `Anchor "${e.name}"`);
        o.addNode(e.name, e.name, f.x, f.y, "anchor");
      }),
      a.components.forEach((e) => {
        var w;
        const f = B(e.visibility, e.evolution, `Component "${e.name}"`),
          r = e.label ? (e.label.negX ? -1 : 1) * e.label.offsetX : void 0,
          d = e.label ? (e.label.negY ? -1 : 1) * e.label.offsetY : void 0,
          y = (w = e.decorator) == null ? void 0 : w.strategy;
        o.addNode(e.name, e.name, f.x, f.y, "component", r, d, e.inertia, y);
      }),
      a.notes.forEach((e) => {
        const f = B(e.visibility, e.evolution, `Note "${e.text}"`);
        o.addNote(e.text, f.x, f.y);
      }),
      a.pipelines.forEach((e) => {
        const f = o.getNode(e.parent);
        if (!f || typeof f.y != "number")
          throw new Error(`Pipeline "${e.parent}" must reference an existing component with coordinates.`);
        const r = f.y;
        (o.startPipeline(e.parent),
          e.components.forEach((d) => {
            const y = `${e.parent}_${d.name}`,
              w = d.label ? (d.label.negX ? -1 : 1) * d.label.offsetX : void 0,
              g = d.label ? (d.label.negY ? -1 : 1) * d.label.offsetY : void 0,
              S = U(d.evolution, `Pipeline component "${d.name}" evolution`);
            (o.addNode(y, d.name, S, r, "pipeline-component", w, g), o.addPipelineComponent(e.parent, y));
          }));
      }),
      a.links.forEach((e) => {
        var S;
        const f = !!e.arrow && (e.arrow.includes("-.->") || e.arrow.includes(".-."));
        let r = (S = lt(e.fromPort)) != null ? S : lt(e.toPort);
        const { flow: d, label: y } = jt(e.arrow);
        !r && d && (r = d);
        const w = e.linkLabel,
          g = y != null ? y : w;
        o.addLink(o.resolveNodeId(e.from), o.resolveNodeId(e.to), f, g, r);
      }),
      a.evolves.forEach((e) => {
        const f = o.getNode(e.component);
        if ((f == null ? void 0 : f.y) !== void 0) {
          const r = U(e.target, `Evolve target for "${e.component}"`);
          o.addTrend(e.component, r, f.y);
        }
      }),
      a.annotations.length > 0)
    ) {
      const e = a.annotations[0],
        f = B(e.x, e.y, "Annotations box");
      o.setAnnotationsBox(f.x, f.y);
    }
    (a.annotation.forEach((e) => {
      const f = B(e.x, e.y, `Annotation ${e.number}`);
      o.addAnnotation(e.number, [{ x: f.x, y: f.y }], e.text);
    }),
      a.accelerators.forEach((e) => {
        const f = B(e.x, e.y, `Accelerator "${e.name}"`);
        o.addAccelerator(e.name, f.x, f.y);
      }),
      a.deaccelerators.forEach((e) => {
        const f = B(e.x, e.y, `Deaccelerator "${e.name}"`);
        o.addDeaccelerator(e.name, f.x, f.y);
      }));
  }, "populateDb"),
  pt = {
    parser: { yy: void 0 },
    parse: m(async (a) => {
      var f;
      const o = await Ht("wardley", a);
      ct.debug(o);
      const e = (f = pt.parser) == null ? void 0 : f.yy;
      if (!e || typeof e.addNode != "function")
        throw new Error(
          "parser.parser?.yy was not a WardleyDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.",
        );
      Vt(o, e);
    }, "parse"),
  },
  O,
  Zt =
    ((O = class {
      constructor() {
        ((this.nodes = new Map()),
          (this.links = []),
          (this.trends = new Map()),
          (this.pipelines = new Map()),
          (this.annotations = []),
          (this.notes = []),
          (this.accelerators = []),
          (this.deaccelerators = []),
          (this.axes = {}));
      }
      addNode(o) {
        var r, d, y, w;
        const e = (r = this.nodes.get(o.id)) != null ? r : { id: o.id, label: o.label },
          f = {
            ...e,
            ...o,
            className: (d = o.className) != null ? d : e.className,
            labelOffsetX: (y = o.labelOffsetX) != null ? y : e.labelOffsetX,
            labelOffsetY: (w = o.labelOffsetY) != null ? w : e.labelOffsetY,
          };
        this.nodes.set(o.id, f);
      }
      addLink(o) {
        this.links.push(o);
      }
      addTrend(o) {
        this.trends.set(o.nodeId, o);
      }
      startPipeline(o) {
        this.pipelines.set(o, { nodeId: o, componentIds: [] });
        const e = this.nodes.get(o);
        e && (e.isPipelineParent = !0);
      }
      addPipelineComponent(o, e) {
        const f = this.pipelines.get(o);
        f && f.componentIds.push(e);
        const r = this.nodes.get(e);
        r && (r.inPipeline = !0);
      }
      addAnnotation(o) {
        this.annotations.push(o);
      }
      addNote(o) {
        this.notes.push(o);
      }
      addAccelerator(o) {
        this.accelerators.push(o);
      }
      addDeaccelerator(o) {
        this.deaccelerators.push(o);
      }
      setAnnotationsBox(o, e) {
        this.annotationsBox = { x: o, y: e };
      }
      setAxes(o) {
        this.axes = { ...this.axes, ...o };
      }
      setSize(o, e) {
        this.size = { width: o, height: e };
      }
      getNode(o) {
        return this.nodes.get(o);
      }
      resolveNodeId(o) {
        if (this.nodes.has(o)) return o;
        for (const [e, f] of this.nodes) if (f.label === o) return e;
        return o;
      }
      build() {
        const o = [];
        for (const e of this.nodes.values()) {
          if (typeof e.x != "number" || typeof e.y != "number")
            throw new Error(`Node "${e.label}" is missing coordinates`);
          o.push(e);
        }
        return {
          nodes: o,
          links: [...this.links],
          trends: [...this.trends.values()],
          pipelines: [...this.pipelines.values()],
          annotations: [...this.annotations],
          notes: [...this.notes],
          accelerators: [...this.accelerators],
          deaccelerators: [...this.deaccelerators],
          annotationsBox: this.annotationsBox,
          axes: { ...this.axes },
          size: this.size,
        };
      }
      clear() {
        (this.nodes.clear(),
          (this.links = []),
          this.trends.clear(),
          this.pipelines.clear(),
          (this.annotations = []),
          (this.notes = []),
          (this.accelerators = []),
          (this.deaccelerators = []),
          (this.annotationsBox = void 0),
          (this.axes = {}),
          (this.size = void 0));
      }
    }),
    m(O, "WardleyBuilder"),
    O),
  v = new Zt();
function ft() {
  return et()["wardley-beta"];
}
m(ft, "getConfig");
function ht(a, o, e, f, r, d, y, w, g) {
  v.addNode({
    id: a,
    label: o,
    x: e,
    y: f,
    className: r,
    labelOffsetX: d,
    labelOffsetY: y,
    inertia: w,
    sourceStrategy: g,
  });
}
m(ht, "addNode");
function xt(a, o, e = !1, f, r) {
  v.addLink({ source: a, target: o, dashed: e, label: f, flow: r });
}
m(xt, "addLink");
function gt(a, o, e) {
  v.addTrend({ nodeId: a, targetX: o, targetY: e });
}
m(gt, "addTrend");
function ut(a, o, e) {
  v.addAnnotation({ number: a, coordinates: o, text: e });
}
m(ut, "addAnnotation");
function yt(a, o, e) {
  v.addNote({ text: a, x: o, y: e });
}
m(yt, "addNote");
function mt(a, o, e) {
  v.addAccelerator({ name: a, x: o, y: e });
}
m(mt, "addAccelerator");
function wt(a, o, e) {
  v.addDeaccelerator({ name: a, x: o, y: e });
}
m(wt, "addDeaccelerator");
function bt(a, o) {
  v.setAnnotationsBox(a, o);
}
m(bt, "setAnnotationsBox");
function kt(a, o) {
  v.setSize(a, o);
}
m(kt, "setSize");
function $t(a) {
  v.startPipeline(a);
}
m($t, "startPipeline");
function vt(a, o) {
  v.addPipelineComponent(a, o);
}
m(vt, "addPipelineComponent");
function Pt(a) {
  v.setAxes(a);
}
m(Pt, "updateAxes");
function St(a) {
  return v.getNode(a);
}
m(St, "getNode");
function Mt(a) {
  return v.resolveNodeId(a);
}
m(Mt, "resolveNodeId");
function Nt() {
  return v.build();
}
m(Nt, "getWardleyData");
function Ct() {
  (v.clear(), _t());
}
m(Ct, "clear");
var Jt = {
    getConfig: ft,
    addNode: ht,
    addLink: xt,
    addTrend: gt,
    addAnnotation: ut,
    addNote: yt,
    addAccelerator: mt,
    addDeaccelerator: wt,
    setAnnotationsBox: bt,
    setSize: kt,
    startPipeline: $t,
    addPipelineComponent: vt,
    updateAxes: Pt,
    getNode: St,
    resolveNodeId: Mt,
    getWardleyData: Nt,
    clear: Ct,
    setAccTitle: Dt,
    getAccTitle: Rt,
    setDiagramTitle: Bt,
    getDiagramTitle: Ft,
    getAccDescription: Yt,
    setAccDescription: It,
  },
  Ut = ["Genesis", "Custom Built", "Product", "Commodity"],
  Kt = m(() => {
    var o, e, f, r, d, y, w, g, S, N, k, z, $, R, E, L, C, T, Y, _, H, A, l, W, G, q, j, V, K;
    const { themeVariables: a } = et();
    return {
      backgroundColor:
        (f = (e = (o = a.wardley) == null ? void 0 : o.backgroundColor) != null ? e : a.background) != null
          ? f
          : "#fff",
      axisColor: (d = (r = a.wardley) == null ? void 0 : r.axisColor) != null ? d : "#000",
      axisTextColor:
        (g = (w = (y = a.wardley) == null ? void 0 : y.axisTextColor) != null ? w : a.primaryTextColor) != null
          ? g
          : "#222",
      gridColor: (N = (S = a.wardley) == null ? void 0 : S.gridColor) != null ? N : "rgba(100, 100, 100, 0.2)",
      componentFill: (z = (k = a.wardley) == null ? void 0 : k.componentFill) != null ? z : "#fff",
      componentStroke: (R = ($ = a.wardley) == null ? void 0 : $.componentStroke) != null ? R : "#000",
      componentLabelColor:
        (C = (L = (E = a.wardley) == null ? void 0 : E.componentLabelColor) != null ? L : a.primaryTextColor) != null
          ? C
          : "#222",
      linkStroke: (Y = (T = a.wardley) == null ? void 0 : T.linkStroke) != null ? Y : "#000",
      evolutionStroke: (H = (_ = a.wardley) == null ? void 0 : _.evolutionStroke) != null ? H : "#dc3545",
      annotationStroke: (l = (A = a.wardley) == null ? void 0 : A.annotationStroke) != null ? l : "#000",
      annotationTextColor:
        (q = (G = (W = a.wardley) == null ? void 0 : W.annotationTextColor) != null ? G : a.primaryTextColor) != null
          ? q
          : "#222",
      annotationFill:
        (K = (V = (j = a.wardley) == null ? void 0 : j.annotationFill) != null ? V : a.background) != null ? K : "#fff",
    };
  }, "getTheme"),
  Qt = m(() => {
    var o, e, f, r, d, y, w, g, S;
    const a = et()["wardley-beta"];
    return {
      width: (o = a == null ? void 0 : a.width) != null ? o : 900,
      height: (e = a == null ? void 0 : a.height) != null ? e : 600,
      padding: (f = a == null ? void 0 : a.padding) != null ? f : 48,
      nodeRadius: (r = a == null ? void 0 : a.nodeRadius) != null ? r : 6,
      nodeLabelOffset: (d = a == null ? void 0 : a.nodeLabelOffset) != null ? d : 8,
      axisFontSize: (y = a == null ? void 0 : a.axisFontSize) != null ? y : 12,
      labelFontSize: (w = a == null ? void 0 : a.labelFontSize) != null ? w : 10,
      showGrid: (g = a == null ? void 0 : a.showGrid) != null ? g : !1,
      useMaxWidth: (S = a == null ? void 0 : a.useMaxWidth) != null ? S : !0,
    };
  }, "getConfigValues"),
  te = m((a, o, e, f) => {
    var at, rt, ot, nt, st, it;
    ct.debug(
      `Rendering Wardley map
` + a,
    );
    const r = Qt(),
      d = Kt(),
      y = r.nodeRadius * 1.6,
      w = f.db,
      g = w.getWardleyData(),
      S = w.getDiagramTitle(),
      N = (rt = (at = g.size) == null ? void 0 : at.width) != null ? rt : r.width,
      k = (nt = (ot = g.size) == null ? void 0 : ot.height) != null ? nt : r.height,
      z = Gt(o);
    (z.selectAll("*").remove(), qt(z, k, N, r.useMaxWidth), z.attr("viewBox", `0 0 ${N} ${k}`));
    const $ = z.append("g").attr("class", "wardley-map"),
      R = z.append("defs");
    (R.append("marker")
      .attr("id", `arrow-${o}`)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", d.evolutionStroke)
      .attr("stroke", "none"),
      R.append("marker")
        .attr("id", `link-arrow-end-${o}`)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 9)
        .attr("refY", 5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", d.linkStroke)
        .attr("stroke", "none"),
      R.append("marker")
        .attr("id", `link-arrow-start-${o}`)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 1)
        .attr("refY", 5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 10 0 L 0 5 L 10 10 z")
        .attr("fill", d.linkStroke)
        .attr("stroke", "none"),
      $.append("rect")
        .attr("class", "wardley-background")
        .attr("width", N)
        .attr("height", k)
        .attr("fill", d.backgroundColor));
    const E = N - r.padding * 2,
      L = k - r.padding * 2;
    S &&
      $.append("text")
        .attr("class", "wardley-title")
        .attr("x", N / 2)
        .attr("y", r.padding / 2)
        .attr("fill", d.axisTextColor)
        .attr("font-size", r.axisFontSize * 1.05)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(S);
    const C = m((t) => r.padding + (t / 100) * E, "projectX"),
      T = m((t) => k - r.padding - (t / 100) * L, "projectY"),
      Y = $.append("g").attr("class", "wardley-axes");
    (Y.append("line")
      .attr("x1", r.padding)
      .attr("x2", N - r.padding)
      .attr("y1", k - r.padding)
      .attr("y2", k - r.padding)
      .attr("stroke", d.axisColor)
      .attr("stroke-width", 1),
      Y.append("line")
        .attr("x1", r.padding)
        .attr("x2", r.padding)
        .attr("y1", r.padding)
        .attr("y2", k - r.padding)
        .attr("stroke", d.axisColor)
        .attr("stroke-width", 1));
    const _ = (st = g.axes.xLabel) != null ? st : "Evolution",
      H = (it = g.axes.yLabel) != null ? it : "Visibility";
    (Y.append("text")
      .attr("class", "wardley-axis-label wardley-axis-label-x")
      .attr("x", r.padding + E / 2)
      .attr("y", k - r.padding / 4)
      .attr("fill", d.axisTextColor)
      .attr("font-size", r.axisFontSize)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text(_),
      Y.append("text")
        .attr("class", "wardley-axis-label wardley-axis-label-y")
        .attr("x", r.padding / 3)
        .attr("y", r.padding + L / 2)
        .attr("fill", d.axisTextColor)
        .attr("font-size", r.axisFontSize)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90 ${r.padding / 3} ${r.padding + L / 2})`)
        .text(H));
    const A = g.axes.stages && g.axes.stages.length > 0 ? g.axes.stages : Ut;
    if (A.length > 0) {
      const t = $.append("g").attr("class", "wardley-stages"),
        s = g.axes.stageBoundaries,
        n = [];
      if (s && s.length === A.length) {
        let i = 0;
        s.forEach((c) => {
          (n.push({ start: i, end: c }), (i = c));
        });
      } else {
        const i = 1 / A.length;
        A.forEach((c, p) => {
          n.push({ start: p * i, end: (p + 1) * i });
        });
      }
      A.forEach((i, c) => {
        const p = n[c],
          h = r.padding + p.start * E,
          x = r.padding + p.end * E,
          u = (h + x) / 2;
        (c > 0 &&
          t
            .append("line")
            .attr("x1", h)
            .attr("x2", h)
            .attr("y1", r.padding)
            .attr("y2", k - r.padding)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5 5")
            .attr("opacity", 0.8),
          t
            .append("text")
            .attr("class", "wardley-stage-label")
            .attr("x", u)
            .attr("y", k - r.padding / 1.5)
            .attr("fill", d.axisTextColor)
            .attr("font-size", r.axisFontSize - 2)
            .attr("text-anchor", "middle")
            .text(i));
      });
    }
    if (r.showGrid) {
      const t = $.append("g").attr("class", "wardley-grid");
      for (let s = 1; s < 4; s++) {
        const n = s / 4,
          i = r.padding + E * n;
        (t
          .append("line")
          .attr("x1", i)
          .attr("x2", i)
          .attr("y1", r.padding)
          .attr("y2", k - r.padding)
          .attr("stroke", d.gridColor)
          .attr("stroke-dasharray", "2 6"),
          t
            .append("line")
            .attr("x1", r.padding)
            .attr("x2", N - r.padding)
            .attr("y1", k - r.padding - L * n)
            .attr("y2", k - r.padding - L * n)
            .attr("stroke", d.gridColor)
            .attr("stroke-dasharray", "2 6"));
      }
    }
    const l = new Map();
    if (
      (g.nodes.forEach((t) => {
        l.set(t.id, { x: C(t.x), y: T(t.y), node: t });
      }),
      g.pipelines.length > 0)
    ) {
      const t = $.append("g").attr("class", "wardley-pipelines"),
        s = $.append("g").attr("class", "wardley-pipeline-links");
      g.pipelines.forEach((n) => {
        if (n.componentIds.length === 0) return;
        const i = n.componentIds
          .map((x) => ({ id: x, pos: l.get(x), node: g.nodes.find((u) => u.id === x) }))
          .filter((x) => x.pos && x.node)
          .sort((x, u) => x.node.x - u.node.x);
        for (let x = 0; x < i.length - 1; x++) {
          const u = i[x],
            b = i[x + 1];
          s.append("line")
            .attr("class", "wardley-pipeline-evolution-link")
            .attr("x1", u.pos.x)
            .attr("y1", u.pos.y)
            .attr("x2", b.pos.x)
            .attr("y2", b.pos.y)
            .attr("stroke", d.linkStroke)
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4");
        }
        let c = 1 / 0,
          p = -1 / 0,
          h = 0;
        if (
          (n.componentIds.forEach((x) => {
            const u = l.get(x);
            u && ((c = Math.min(c, u.x)), (p = Math.max(p, u.x)), (h = u.y));
          }),
          c !== 1 / 0 && p !== -1 / 0)
        ) {
          const u = r.nodeRadius * 4,
            b = h - u / 2,
            M = l.get(n.nodeId);
          if (M) {
            const I = (c + p) / 2;
            ((M.x = I), (M.y = b - y / 6));
          }
          t.append("rect")
            .attr("class", "wardley-pipeline-box")
            .attr("x", c - 15)
            .attr("y", b)
            .attr("width", p - c + 15 * 2)
            .attr("height", u)
            .attr("fill", "none")
            .attr("stroke", d.axisColor)
            .attr("stroke-width", 1.5)
            .attr("rx", 4)
            .attr("ry", 4);
        }
      });
    }
    const W = $.append("g").attr("class", "wardley-links"),
      G = new Map();
    g.pipelines.forEach((t) => {
      G.set(t.nodeId, new Set(t.componentIds));
    });
    const q = g.links.filter((t) => {
      if (!l.has(t.source) || !l.has(t.target)) return !1;
      const s = G.get(t.target);
      return !(s != null && s.has(t.source));
    });
    (W.selectAll("line")
      .data(q)
      .enter()
      .append("line")
      .attr("class", (t) => `wardley-link${t.dashed ? " wardley-link--dashed" : ""}`)
      .attr("x1", (t) => {
        const s = l.get(t.source),
          n = l.get(t.target),
          c = g.nodes.find((u) => u.id === t.source).isPipelineParent ? y / Math.sqrt(2) : r.nodeRadius,
          p = n.x - s.x,
          h = n.y - s.y,
          x = Math.sqrt(p * p + h * h);
        return s.x + (p / x) * c;
      })
      .attr("y1", (t) => {
        const s = l.get(t.source),
          n = l.get(t.target),
          c = g.nodes.find((u) => u.id === t.source).isPipelineParent ? y / Math.sqrt(2) : r.nodeRadius,
          p = n.x - s.x,
          h = n.y - s.y,
          x = Math.sqrt(p * p + h * h);
        return s.y + (h / x) * c;
      })
      .attr("x2", (t) => {
        const s = l.get(t.source),
          n = l.get(t.target),
          c = g.nodes.find((u) => u.id === t.target).isPipelineParent ? y / Math.sqrt(2) : r.nodeRadius,
          p = s.x - n.x,
          h = s.y - n.y,
          x = Math.sqrt(p * p + h * h);
        return n.x + (p / x) * c;
      })
      .attr("y2", (t) => {
        const s = l.get(t.source),
          n = l.get(t.target),
          c = g.nodes.find((u) => u.id === t.target).isPipelineParent ? y / Math.sqrt(2) : r.nodeRadius,
          p = s.x - n.x,
          h = s.y - n.y,
          x = Math.sqrt(p * p + h * h);
        return n.y + (h / x) * c;
      })
      .attr("stroke", d.linkStroke)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", (t) => (t.dashed ? "6 6" : null))
      .attr("marker-end", (t) =>
        t.flow === "forward" || t.flow === "bidirectional" ? `url(#link-arrow-end-${o})` : null,
      )
      .attr("marker-start", (t) =>
        t.flow === "backward" || t.flow === "bidirectional" ? `url(#link-arrow-start-${o})` : null,
      ),
      W.selectAll("text")
        .data(q.filter((t) => t.label))
        .enter()
        .append("text")
        .attr("class", "wardley-link-label")
        .attr("x", (t) => {
          const s = l.get(t.source),
            n = l.get(t.target),
            i = (s.x + n.x) / 2,
            c = n.y - s.y,
            p = n.x - s.x,
            h = Math.sqrt(p * p + c * c),
            x = 8,
            u = c / h;
          return i + u * x;
        })
        .attr("y", (t) => {
          const s = l.get(t.source),
            n = l.get(t.target),
            i = (s.y + n.y) / 2,
            c = n.x - s.x,
            p = n.y - s.y,
            h = Math.sqrt(c * c + p * p),
            x = 8,
            u = -c / h;
          return i + u * x;
        })
        .attr("fill", d.axisTextColor)
        .attr("font-size", r.labelFontSize)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("transform", (t) => {
          const s = l.get(t.source),
            n = l.get(t.target),
            i = (s.x + n.x) / 2,
            c = (s.y + n.y) / 2,
            p = n.x - s.x,
            h = n.y - s.y,
            x = Math.sqrt(p * p + h * h),
            u = 8,
            b = h / x,
            M = -p / x,
            I = i + b * u,
            Z = c + M * u;
          let D = (Math.atan2(h, p) * 180) / Math.PI;
          return ((D > 90 || D < -90) && (D += 180), `rotate(${D} ${I} ${Z})`);
        })
        .text((t) => t.label));
    const j = $.append("g").attr("class", "wardley-trends"),
      V = g.trends
        .map((t) => {
          const s = l.get(t.nodeId);
          if (!s) return null;
          const n = C(t.targetX),
            i = T(t.targetY),
            c = n - s.x,
            p = i - s.y,
            h = Math.sqrt(c * c + p * p),
            x = r.nodeRadius + 2,
            u = h > x ? n - (c / h) * x : n,
            b = h > x ? i - (p / h) * x : i;
          return { origin: s, targetX: n, targetY: i, adjustedX2: u, adjustedY2: b };
        })
        .filter((t) => t !== null);
    j.selectAll("line")
      .data(V)
      .enter()
      .append("line")
      .attr("class", "wardley-trend")
      .attr("x1", (t) => t.origin.x)
      .attr("y1", (t) => t.origin.y)
      .attr("x2", (t) => t.adjustedX2)
      .attr("y2", (t) => t.adjustedY2)
      .attr("stroke", d.evolutionStroke)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 4")
      .attr("marker-end", `url(#arrow-${o})`);
    const X = $.append("g")
      .attr("class", "wardley-nodes")
      .selectAll("g")
      .data(g.nodes)
      .enter()
      .append("g")
      .attr("class", (t) =>
        ["wardley-node", t.className ? `wardley-node--${t.className}` : ""].filter(Boolean).join(" "),
      );
    (X.filter((t) => t.sourceStrategy === "outsource")
      .append("circle")
      .attr("class", "wardley-outsource-overlay")
      .attr("cx", (t) => l.get(t.id).x)
      .attr("cy", (t) => l.get(t.id).y)
      .attr("r", r.nodeRadius * 2)
      .attr("fill", "#666")
      .attr("stroke", d.componentStroke)
      .attr("stroke-width", 1),
      X.filter((t) => t.sourceStrategy === "buy")
        .append("circle")
        .attr("class", "wardley-buy-overlay")
        .attr("cx", (t) => l.get(t.id).x)
        .attr("cy", (t) => l.get(t.id).y)
        .attr("r", r.nodeRadius * 2)
        .attr("fill", "#ccc")
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 1),
      X.filter((t) => t.sourceStrategy === "build")
        .append("circle")
        .attr("class", "wardley-build-overlay")
        .attr("cx", (t) => l.get(t.id).x)
        .attr("cy", (t) => l.get(t.id).y)
        .attr("r", r.nodeRadius * 2)
        .attr("fill", "#eee")
        .attr("stroke", "#000")
        .attr("stroke-width", 1));
    const F = X.filter((t) => t.sourceStrategy === "market");
    (F.append("circle")
      .attr("class", "wardley-market-overlay")
      .attr("cx", (t) => l.get(t.id).x)
      .attr("cy", (t) => l.get(t.id).y)
      .attr("r", r.nodeRadius * 2)
      .attr("fill", "white")
      .attr("stroke", d.componentStroke)
      .attr("stroke-width", 1),
      X.filter((t) => !t.isPipelineParent && t.sourceStrategy !== "market" && t.className !== "anchor")
        .append("circle")
        .attr("cx", (t) => l.get(t.id).x)
        .attr("cy", (t) => l.get(t.id).y)
        .attr("r", r.nodeRadius)
        .attr("fill", d.componentFill)
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 1));
    const Q = r.nodeRadius * 0.7,
      P = r.nodeRadius * 1.2;
    if (
      (F.append("line")
        .attr("class", "wardley-market-line")
        .attr("x1", (t) => l.get(t.id).x)
        .attr("y1", (t) => l.get(t.id).y - P)
        .attr("x2", (t) => l.get(t.id).x - P * Math.cos(Math.PI / 6))
        .attr("y2", (t) => l.get(t.id).y + P * Math.sin(Math.PI / 6))
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 1),
      F.append("line")
        .attr("class", "wardley-market-line")
        .attr("x1", (t) => l.get(t.id).x - P * Math.cos(Math.PI / 6))
        .attr("y1", (t) => l.get(t.id).y + P * Math.sin(Math.PI / 6))
        .attr("x2", (t) => l.get(t.id).x + P * Math.cos(Math.PI / 6))
        .attr("y2", (t) => l.get(t.id).y + P * Math.sin(Math.PI / 6))
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 1),
      F.append("line")
        .attr("class", "wardley-market-line")
        .attr("x1", (t) => l.get(t.id).x + P * Math.cos(Math.PI / 6))
        .attr("y1", (t) => l.get(t.id).y + P * Math.sin(Math.PI / 6))
        .attr("x2", (t) => l.get(t.id).x)
        .attr("y2", (t) => l.get(t.id).y - P)
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 1),
      F.append("circle")
        .attr("class", "wardley-market-dot")
        .attr("cx", (t) => l.get(t.id).x)
        .attr("cy", (t) => l.get(t.id).y - P)
        .attr("r", Q)
        .attr("fill", "white")
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 2),
      F.append("circle")
        .attr("class", "wardley-market-dot")
        .attr("cx", (t) => l.get(t.id).x - P * Math.cos(Math.PI / 6))
        .attr("cy", (t) => l.get(t.id).y + P * Math.sin(Math.PI / 6))
        .attr("r", Q)
        .attr("fill", "white")
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 2),
      F.append("circle")
        .attr("class", "wardley-market-dot")
        .attr("cx", (t) => l.get(t.id).x + P * Math.cos(Math.PI / 6))
        .attr("cy", (t) => l.get(t.id).y + P * Math.sin(Math.PI / 6))
        .attr("r", Q)
        .attr("fill", "white")
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 2),
      X.filter((t) => t.isPipelineParent === !0)
        .append("rect")
        .attr("x", (t) => l.get(t.id).x - y / 2)
        .attr("y", (t) => l.get(t.id).y - y / 2)
        .attr("width", y)
        .attr("height", y)
        .attr("fill", d.componentFill)
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 1),
      X.filter((t) => t.inertia === !0)
        .append("line")
        .attr("class", "wardley-inertia")
        .attr("x1", (t) => {
          const s = l.get(t.id);
          let n = t.isPipelineParent ? y / 2 + 15 : r.nodeRadius + 15;
          return (t.sourceStrategy && (n += r.nodeRadius + 10), s.x + n);
        })
        .attr("y1", (t) => {
          const s = l.get(t.id),
            n = t.isPipelineParent ? y : r.nodeRadius * 2;
          return s.y - n / 2;
        })
        .attr("x2", (t) => {
          const s = l.get(t.id);
          let n = t.isPipelineParent ? y / 2 + 15 : r.nodeRadius + 15;
          return (t.sourceStrategy && (n += r.nodeRadius + 10), s.x + n);
        })
        .attr("y2", (t) => {
          const s = l.get(t.id),
            n = t.isPipelineParent ? y : r.nodeRadius * 2;
          return s.y + n / 2;
        })
        .attr("stroke", d.componentStroke)
        .attr("stroke-width", 6),
      X.append("text")
        .attr("x", (t) => {
          var c;
          const s = l.get(t.id);
          if (t.className === "anchor") return t.labelOffsetX !== void 0 ? s.x + t.labelOffsetX : s.x;
          let n = r.nodeLabelOffset;
          t.sourceStrategy && t.labelOffsetX === void 0 && (n += 10);
          const i = (c = t.labelOffsetX) != null ? c : n;
          return s.x + i;
        })
        .attr("y", (t) => {
          var c;
          const s = l.get(t.id);
          if (t.className === "anchor") return t.labelOffsetY !== void 0 ? s.y + t.labelOffsetY : s.y - 3;
          let n = -r.nodeLabelOffset;
          t.sourceStrategy && t.labelOffsetY === void 0 && (n -= 10);
          const i = (c = t.labelOffsetY) != null ? c : n;
          return s.y + i;
        })
        .attr("class", "wardley-node-label")
        .attr("fill", (t) =>
          t.className === "evolved" ? d.evolutionStroke : t.className === "anchor" ? "#000" : d.componentLabelColor,
        )
        .attr("font-size", r.labelFontSize)
        .attr("font-weight", (t) => (t.className === "anchor" ? "bold" : "normal"))
        .attr("text-anchor", (t) => (t.className === "anchor" ? "middle" : "start"))
        .attr("dominant-baseline", (t) => (t.className === "anchor" ? "middle" : "auto"))
        .text((t) => t.label),
      g.annotations.length > 0)
    ) {
      const t = $.append("g").attr("class", "wardley-annotations");
      if (
        (g.annotations.forEach((s) => {
          const n = s.coordinates.map((i) => ({ x: C(i.x), y: T(i.y) }));
          if (n.length > 1)
            for (let i = 0; i < n.length - 1; i++)
              t.append("line")
                .attr("class", "wardley-annotation-line")
                .attr("x1", n[i].x)
                .attr("y1", n[i].y)
                .attr("x2", n[i + 1].x)
                .attr("y2", n[i + 1].y)
                .attr("stroke", d.axisColor)
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", "4 4");
          n.forEach((i) => {
            const c = t.append("g").attr("class", "wardley-annotation");
            (c
              .append("circle")
              .attr("cx", i.x)
              .attr("cy", i.y)
              .attr("r", 10)
              .attr("fill", "white")
              .attr("stroke", d.axisColor)
              .attr("stroke-width", 1.5),
              c
                .append("text")
                .attr("x", i.x)
                .attr("y", i.y)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", 10)
                .attr("fill", d.axisTextColor)
                .attr("font-weight", "bold")
                .text(s.number));
          });
        }),
        g.annotationsBox)
      ) {
        let s = C(g.annotationsBox.x),
          n = T(g.annotationsBox.y);
        const i = 10,
          c = 16,
          p = 11,
          h = t.append("g").attr("class", "wardley-annotations-box"),
          x = [...g.annotations].filter((b) => b.text).sort((b, M) => b.number - M.number),
          u = [];
        if (
          (x.forEach((b, M) => {
            const I = h
              .append("text")
              .attr("x", s + i)
              .attr("y", n + i + (M + 1) * c)
              .attr("font-size", p)
              .attr("fill", d.axisTextColor)
              .attr("text-anchor", "start")
              .attr("dominant-baseline", "middle")
              .text(`${b.number}. ${b.text}`);
            u.push(I);
          }),
          u.length > 0)
        ) {
          let b = 0,
            M = 0;
          u.forEach((tt) => {
            const J = tt.node(),
              Lt = J.getComputedTextLength();
            b = Math.max(b, Lt);
            const At = J.getBBox();
            M = Math.max(M, At.height);
          });
          const I = b + i * 2 + 105,
            Z = x.length * c + i * 2 + M / 2,
            D = r.padding,
            Tt = N - r.padding - I,
            zt = r.padding,
            Et = k - r.padding - Z;
          ((s = Math.max(D, Math.min(s, Tt))),
            (n = Math.max(zt, Math.min(n, Et))),
            u.forEach((tt, J) => {
              tt.attr("x", s + i).attr("y", n + i + (J + 1) * c);
            }),
            h
              .insert("rect", "text")
              .attr("x", s)
              .attr("y", n)
              .attr("width", I)
              .attr("height", Z)
              .attr("fill", "white")
              .attr("stroke", d.axisColor)
              .attr("stroke-width", 1.5)
              .attr("rx", 4)
              .attr("ry", 4));
        }
      }
    }
    if (g.notes.length > 0) {
      const t = $.append("g").attr("class", "wardley-notes");
      g.notes.forEach((s) => {
        const n = C(s.x),
          i = T(s.y);
        t.append("text")
          .attr("x", n)
          .attr("y", i)
          .attr("text-anchor", "start")
          .attr("font-size", 11)
          .attr("fill", d.axisTextColor)
          .attr("font-weight", "bold")
          .text(s.text);
      });
    }
    if (g.accelerators.length > 0) {
      const t = $.append("g").attr("class", "wardley-accelerators");
      g.accelerators.forEach((s) => {
        const n = C(s.x),
          i = T(s.y),
          c = 60,
          p = 30,
          h = 20,
          x = `
        M ${n} ${i - p / 2}
        L ${n + c - h} ${i - p / 2}
        L ${n + c - h} ${i - p / 2 - 8}
        L ${n + c} ${i}
        L ${n + c - h} ${i + p / 2 + 8}
        L ${n + c - h} ${i + p / 2}
        L ${n} ${i + p / 2}
        Z
      `;
        (t.append("path").attr("d", x).attr("fill", "white").attr("stroke", d.componentStroke).attr("stroke-width", 1),
          t
            .append("text")
            .attr("x", n + c / 2)
            .attr("y", i + p / 2 + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("fill", d.axisTextColor)
            .attr("font-weight", "bold")
            .text(s.name));
      });
    }
    if (g.deaccelerators.length > 0) {
      const t = $.append("g").attr("class", "wardley-deaccelerators");
      g.deaccelerators.forEach((s) => {
        const n = C(s.x),
          i = T(s.y),
          c = 60,
          p = 30,
          h = 20,
          x = `
        M ${n + c} ${i - p / 2}
        L ${n + h} ${i - p / 2}
        L ${n + h} ${i - p / 2 - 8}
        L ${n} ${i}
        L ${n + h} ${i + p / 2 + 8}
        L ${n + h} ${i + p / 2}
        L ${n + c} ${i + p / 2}
        Z
      `;
        (t.append("path").attr("d", x).attr("fill", "white").attr("stroke", d.componentStroke).attr("stroke-width", 1),
          t
            .append("text")
            .attr("x", n + c / 2)
            .attr("y", i + p / 2 + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("fill", d.axisTextColor)
            .attr("font-weight", "bold")
            .text(s.name));
      });
    }
  }, "draw"),
  ee = { draw: te },
  ae = m(({ wardley: a } = {}) => {
    const o = Ot(),
      e = Wt(),
      f = dt(o, e.themeVariables),
      r = dt(f.wardley, a);
    return `
  .wardley-background {
    fill: ${r.backgroundColor};
  }
  .wardley-axes line, .wardley-axes path {
    stroke: ${r.axisColor};
  }
  .wardley-axis-label {
    fill: ${r.axisTextColor};
  }
  .wardley-stage-label {
    fill: ${r.axisTextColor};
  }
  .wardley-grid line {
    stroke: ${r.gridColor};
  }
  .wardley-node circle {
    fill: ${r.componentFill};
    stroke: ${r.componentStroke};
  }
  .wardley-node-label {
    fill: ${r.componentLabelColor};
  }
  .wardley-link {
    stroke: ${r.linkStroke};
  }
  .wardley-link--dashed {
    stroke-dasharray: 4 4;
  }
  .wardley-link-label {
    fill: ${r.axisTextColor};
  }
  .wardley-trend line {
    stroke: ${r.evolutionStroke};
  }
  .wardley-annotation-line {
    stroke: ${r.annotationStroke};
  }
  .wardley-annotation circle {
    fill: ${r.annotationFill};
    stroke: ${r.annotationStroke};
  }
  .wardley-annotation text {
    fill: ${r.annotationTextColor};
  }
  .wardley-annotations-box rect {
    fill: ${r.annotationFill};
    stroke: ${r.annotationStroke};
  }
  .wardley-annotations-box text {
    fill: ${r.annotationTextColor};
  }
  .wardley-pipeline-box {
    stroke: ${r.componentStroke};
  }
  .wardley-notes text {
    fill: ${r.axisTextColor};
  }
  `;
  }, "styles"),
  se = { parser: pt, db: Jt, renderer: ee, styles: ae };
export { se as diagram };
