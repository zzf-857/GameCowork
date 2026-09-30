import {
  _ as L,
  aw as z,
  ax as I,
  d as J,
  V as F,
  l as y,
  ay as W,
  az as S,
  aA as j,
  aB as q,
  aC as U,
  aD as v,
  aE as V,
  aF as K,
  aG as B,
  ao as M,
  am as Q,
  aH as Z,
  aI as $,
} from "./registry-BL-NPVNy.js";
import { l as ee } from "./layout-DnjO4kuL.js";
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
      e = new t.Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "ad0f2291-c249-4cb8-bd18-2d7e1b40478e"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-ad0f2291-c249-4cb8-bd18-2d7e1b40478e"));
  })();
} catch {}
var G = L((t, e, s) => Math.max(e, Math.min(s, t)), "clamp"),
  k = L((t = "TB") => {
    switch (t) {
      case "BT":
        return "bottom";
      case "LR":
        return "right";
      case "RL":
        return "left";
      case "TB":
      default:
        return "top";
    }
  }, "getDefaultSelfLoopSide"),
  te = L(
    (t) => t === "flowchart" || t === "flowchart-v2" || t === "stateDiagram" || t === "er" || t === "classDiagram",
    "shouldMergeSelfLoopSegments",
  ),
  re = ["x", "y", "width", "height", "labelBBox", "intersect", "calcIntersect", "diff", "clusterNode"],
  oe = L((t, e, s, g, d) => {
    const c = [],
      p = new Set();
    if (
      (s.forEach(({ start: f, end: o }) => {
        (f !== g && p.add(f), o !== g && p.add(o));
      }),
      p.forEach((f) => {
        const o = t.node(f);
        typeof (o == null ? void 0 : o.x) == "number" && typeof (o == null ? void 0 : o.y) == "number" && c.push(o);
      }),
      c.length === 0 &&
        s.forEach(({ edge: f }) => {
          var o;
          ((o = f.points) != null ? o : []).forEach((r) => {
            typeof (r == null ? void 0 : r.x) == "number" && typeof (r == null ? void 0 : r.y) == "number" && c.push(r);
          });
        }),
      c.length === 0)
    )
      return k(d);
    const i = c.reduce((f, o) => ({ x: f.x + o.x / c.length, y: f.y + o.y / c.length }), { x: 0, y: 0 }),
      l = i.x - e.x,
      a = i.y - e.y;
    return Math.abs(l) > Math.abs(a) ? (l > 0 ? "right" : "left") : Math.abs(a) > 0 ? (a > 0 ? "bottom" : "top") : k(d);
  }, "getSelfLoopSide"),
  ae = L((t, e = "top", s = 0, g = 0) => {
    const d = t.x,
      c = t.y - s,
      p = t.width / 2,
      i = t.height / 2,
      l = Math.max(36, Math.min(100, t.width * 0.8)),
      a = G(Math.max(g, t.width * 0.35), 36, l),
      f = G(Math.min(t.width, t.height) * 0.45, 24, 48);
    switch (e) {
      case "bottom": {
        const o = c + i;
        return [
          { x: d - a / 2, y: o },
          { x: d - a / 2, y: o + f },
          { x: d + a / 2, y: o + f },
          { x: d + a / 2, y: o },
        ];
      }
      case "right": {
        const o = d + p;
        return [
          { x: o, y: c - a / 2 },
          { x: o + f, y: c - a / 2 },
          { x: o + f, y: c + a / 2 },
          { x: o, y: c + a / 2 },
        ];
      }
      case "left": {
        const o = d - p;
        return [
          { x: o, y: c - a / 2 },
          { x: o - f, y: c - a / 2 },
          { x: o - f, y: c + a / 2 },
          { x: o, y: c + a / 2 },
        ];
      }
      case "top":
      default: {
        const o = c - i;
        return [
          { x: d - a / 2, y: o },
          { x: d - a / 2, y: o - f },
          { x: d + a / 2, y: o - f },
          { x: d + a / 2, y: o },
        ];
      }
    }
  }, "getSelfLoopPoints"),
  ne = L((t, e, s = "top", g = 0, d = {}) => {
    var f, o;
    const p = t.x,
      i = t.y - g,
      l = (f = d.width) != null ? f : 0,
      a = (o = d.height) != null ? o : 0;
    switch (s) {
      case "bottom":
        return { x: p, y: Math.max(...e.map((r) => r.y)) + a / 2 + 4 };
      case "right":
        return { x: Math.max(...e.map((r) => r.x)) + l / 2 + 4, y: i };
      case "left":
        return { x: Math.min(...e.map((r) => r.x)) - l / 2 - 4, y: i };
      case "top":
      default:
        return { x: p, y: Math.min(...e.map((r) => r.y)) - a / 2 - 4 };
    }
  }, "getSelfLoopLabelPosition"),
  O = L((t, e = 0, { mergeSelfLoops: s = !0 } = {}) => {
    var p;
    const g = new Map(),
      d = [],
      c = (p = t.graph()) == null ? void 0 : p.rankdir;
    return (
      t.edges().forEach((i) => {
        const l = t.edge(i);
        if (s && l.selfLoop) {
          const a = l.selfLoop.id;
          (g.has(a) || g.set(a, []), g.get(a).push({ edge: l, start: i.v, end: i.w }));
        } else d.push({ edge: l, start: i.v, end: i.w });
      }),
      g.forEach((i) => {
        var D, E, x, N, X, R, C, P;
        if (i.length !== 3) {
          i.forEach((w) => d.push(w));
          return;
        }
        i.sort((w, H) => w.edge.selfLoop.order - H.edge.selfLoop.order);
        const [l, a, f] = i,
          o =
            (x = (E = (D = l.edge.originalEdge) != null ? D : a.edge.originalEdge) != null ? E : f.edge.originalEdge) !=
            null
              ? x
              : a.edge,
          r = t.node(o.start);
        if (!r) {
          i.forEach((w) => d.push(w));
          return;
        }
        const m = { width: a.edge.width, height: a.edge.height },
          b = oe(t, r, i, o.start, c),
          u = ae(r, b, e, (N = m.width) != null ? N : 0),
          n = ne(r, u, b, e, m),
          h = {
            ...a.edge,
            ...o,
            id: o.id,
            points: u,
            start: o.start,
            end: o.end,
            x: n.x,
            y: n.y,
            width: m.width,
            height: m.height,
            labelStyle: a.edge.labelStyle,
            fromCluster:
              (R = (X = l.edge.fromCluster) != null ? X : a.edge.fromCluster) != null ? R : f.edge.fromCluster,
            toCluster: (P = (C = l.edge.toCluster) != null ? C : a.edge.toCluster) != null ? P : f.edge.toCluster,
          };
        (delete h.selfLoop, delete h.originalEdge, d.push({ edge: h, start: h.start, end: h.end }));
      }),
      d
    );
  }, "getEdgesToRender"),
  A = L(async ({ element: t, graph: e, diagramType: s, id: g, parentCluster: d, siteConfig: c }) => {
    const p = e.graph().rankdir;
    y.trace("Dir in recursive render - dir:", p);
    const { clusters: i, edgePaths: l, edgeLabels: a, nodes: f, rootGroups: o } = j(t, { edgePathsClass: "edgePaths" });
    (e.nodes() ? y.info("Recursive render XXX", e.nodes()) : y.info("No nodes found for", e),
      e.edges().length > 0 && y.info("Recursive edges", e.edge(e.edges()[0])));
    const r = te(s);
    (await Promise.all(
      e.nodes().map(async function (u) {
        const n = e.node(u);
        if (d !== void 0) {
          const h = JSON.parse(JSON.stringify(d.clusterData));
          (y.trace(
            `Setting data for parent cluster XXX
 Node.id = `,
            u,
            `
 data=`,
            h.height,
            `
Parent cluster`,
            d.height,
          ),
            e.setNode(d.id, h),
            e.parent(u) || (y.trace("Setting parent", u, d.id), e.setParent(u, d.id, h)));
        }
        if ((y.info("(Insert) Node XXX" + u + ": " + JSON.stringify(e.node(u))), n != null && n.clusterNode)) {
          y.info("Cluster identified XBX", u, n.width, e.node(u));
          const { ranksep: h, nodesep: D } = e.graph();
          n.graph.setGraph({ ...n.graph.graph(), ranksep: h + 25, nodesep: D });
          const E = await ce({
              element: f,
              graph: n.graph,
              diagramType: s,
              id: g,
              parentCluster: e.node(u),
              siteConfig: c,
            }),
            x = E.elem;
          (q(n, x),
            (n.diff = E.diff || 0),
            y.info("New compound node after recursive render XAX", u, "width", n.width, "height", n.height),
            U(x, n));
        } else
          e.children(u).length > 0
            ? (y.trace("Cluster - the non recursive path XBX", u, n.id, n, n.width, "Graph:", e),
              y.trace(v(n.id, e)),
              S.set(n.id, { id: v(n.id, e), node: n }))
            : (y.trace("Node - the non recursive path XAX", u, f, e.node(u), p),
              await V(f, e.node(u), { config: c, dir: p }));
      }),
    ),
      await L(async () => {
        const u = e.edges().map(async function (n) {
          var D, E, x, N, X, R, C, P;
          const h = e.edge(n.v, n.w, n.name);
          if (
            (y.info("Edge " + n.v + " -> " + n.w + ": " + JSON.stringify(n)),
            y.info("Edge " + n.v + " -> " + n.w + ": ", n, " ", JSON.stringify(e.edge(n))),
            y.info("Fix", S, "ids:", n.v, n.w, "Translating: ", S.get(n.v), S.get(n.w)),
            r && h.selfLoop)
          ) {
            if (h.selfLoop.order !== 1) return;
            const w = {
              ...h.originalEdge,
              ...h,
              id: h.selfLoop.id,
              startLabelLeft:
                (E = (D = h.originalEdge) == null ? void 0 : D.startLabelLeft) != null ? E : h.startLabelLeft,
              startLabelRight:
                (N = (x = h.originalEdge) == null ? void 0 : x.startLabelRight) != null ? N : h.startLabelRight,
              endLabelLeft: (R = (X = h.originalEdge) == null ? void 0 : X.endLabelLeft) != null ? R : h.endLabelLeft,
              endLabelRight:
                (P = (C = h.originalEdge) == null ? void 0 : C.endLabelRight) != null ? P : h.endLabelRight,
            };
            (await B(a, w), (h.width = w.width), (h.height = w.height), (h.labelStyle = w.labelStyle));
            return;
          }
          await B(a, h);
        });
        await Promise.all(u);
      }, "processEdges")());
    const { subGraphTitleTotalMargin: b } = K(c);
    return {
      elem: o,
      graph: e,
      groups: { clusters: i, edgePaths: l, edgeLabels: a, nodes: f, rootGroups: o },
      diagramType: s,
      id: g,
      mergeSelfLoops: r,
      subGraphTitleTotalMargin: b,
    };
  }, "measureDagreGraph"),
  T = L((t) => {
    (y.info("############################################# XXX"),
      y.info("###                Layout                 ### XXX"),
      y.info("############################################# XXX"),
      ee(t));
  }, "runDagreGraphLayout"),
  se = L((t, e, s) => {
    var c, p, i;
    const g = t.node(e);
    if (!g) return;
    const d = { ...g };
    return (
      g != null && g.clusterNode
        ? (d.y = ((c = g.y) != null ? c : 0) + s)
        : t.children(e).length > 0
          ? (d.height = ((p = g.height) != null ? p : 0) + s)
          : (d.y = ((i = g.y) != null ? i : 0) + s / 2),
      d
    );
  }, "normalizeDagreNode"),
  _ = L((t, e) => {
    re.forEach((s) => {
      e[s] !== void 0 && (t[s] = e[s]);
    });
  }, "applyDagreNodeLayout"),
  ie = L((t, e, s, g) => {
    var d, c, p;
    return {
      ...t,
      start: (d = t.start) != null ? d : e,
      end: (c = t.end) != null ? c : s,
      points: ((p = t.points) != null ? p : []).map((i) => ({ ...i, y: typeof i.y == "number" ? i.y + g : i.y })),
    };
  }, "normalizeDagreEdge"),
  de = L((t, e) => {
    const { graph: s, mergeSelfLoops: g, subGraphTitleTotalMargin: d = 0 } = e,
      c = new Map(t.nodes.map((i) => [i.id, i]));
    I(s).forEach((i) => {
      const l = se(s, i, d);
      if (!l) return;
      _(s.node(i), l);
      const a = c.get(i);
      a && _(a, l);
    });
    const p = d / 2;
    return ((t.edges = O(s, p, { mergeSelfLoops: g }).map(({ edge: i, start: l, end: a }) => ie(i, l, a, p))), t);
  }, "applyDagreLayoutResult"),
  le = L(
    async ({
      elem: t,
      graph: e,
      groups: { clusters: s, edgePaths: g },
      diagramType: d,
      id: c,
      mergeSelfLoops: p,
      subGraphTitleTotalMargin: i,
    }) => {
      let l = 0;
      await Promise.all(
        I(e).map(async function (o) {
          var m;
          const r = e.node(o);
          if (
            (y.info("Position XBX => " + o + ": (" + r.x, "," + r.y, ") width: ", r.width, " height: ", r.height),
            r != null && r.clusterNode)
          )
            ((r.y += i),
              y.info("A tainted cluster node XBX1", o, r.id, r.width, r.height, r.x, r.y, e.parent(o)),
              (S.get(r.id).node = r),
              M(r));
          else if (e.children(o).length > 0) {
            (y.info("A pure cluster node XBX1", o, r.id, r.x, r.y, r.width, r.height, e.parent(o)),
              (r.height += i),
              e.node(r.parentId));
            const b = (r == null ? void 0 : r.padding) / 2 || 0,
              u = ((m = r == null ? void 0 : r.labelBBox) == null ? void 0 : m.height) || 0,
              n = u - b || 0;
            (y.debug("OffsetY", n, "labelHeight", u, "halfPadding", b), await Q(s, r), (S.get(r.id).node = r));
          } else {
            const b = e.node(r.parentId);
            ((r.y += i / 2),
              y.info(
                "A regular node XBX1 - using the padding",
                r.id,
                "parent",
                r.parentId,
                r.width,
                r.height,
                r.x,
                r.y,
                "offsetY",
                r.offsetY,
                "parent",
                b,
                b == null ? void 0 : b.offsetY,
                r,
              ),
              M(r));
          }
        }),
      );
      const a = i / 2;
      return (
        O(e, a, { mergeSelfLoops: p }).forEach(function ({ edge: o, start: r, end: m }) {
          (y.info("Edge " + r + " -> " + m + ": " + JSON.stringify(o), o), o.points.forEach((h) => (h.y += a)));
          const b = e.node(r),
            u = e.node(m),
            n = Z(g, o, S, d, b, u, c);
          $(o, n);
        }),
        e.nodes().forEach(function (o) {
          const r = e.node(o);
          (y.info(o, r.type, r.diff), r.isGroup && (l = r.diff));
        }),
        y.warn("Returning from recursive render XAX", t, l),
        { elem: t, diff: l }
      );
    },
    "paintDagreLayoutCore",
  ),
  ce = L(async (t) => {
    const e = await A(t);
    return (T(e.graph), await le(e));
  }, "renderDagreSubgraph"),
  Y = L((t) => {
    var s, g, d, c, p, i;
    const e = new F({ multigraph: !0, compound: !0 })
      .setGraph({
        rankdir: t.direction,
        nodesep:
          ((s = t.config) == null ? void 0 : s.nodeSpacing) ||
          t.nodeSpacing ||
          ((d = (g = t.config) == null ? void 0 : g.flowchart) == null ? void 0 : d.nodeSpacing),
        ranksep:
          ((c = t.config) == null ? void 0 : c.rankSpacing) ||
          t.rankSpacing ||
          ((i = (p = t.config) == null ? void 0 : p.flowchart) == null ? void 0 : i.rankSpacing),
        marginx: 8,
        marginy: 8,
      })
      .setDefaultEdgeLabel(function () {
        return {};
      });
    return (
      t.nodes.forEach((l) => {
        (e.setNode(l.id, { ...l }), l.parentId && e.setParent(l.id, l.parentId));
      }),
      y.debug("Edges:", t.edges),
      t.edges.forEach((l) => {
        if (l.start === l.end) {
          const a = l.start,
            f = a + "---" + a + "---1",
            o = a + "---" + a + "---2",
            r = e.node(a);
          (e.setNode(f, {
            domId: f,
            id: f,
            parentId: r.parentId,
            labelStyle: "",
            label: "",
            padding: 0,
            shape: "labelRect",
            style: "",
            width: 10,
            height: 10,
          }),
            e.setParent(f, r.parentId),
            e.setNode(o, {
              domId: o,
              id: o,
              parentId: r.parentId,
              labelStyle: "",
              padding: 0,
              shape: "labelRect",
              label: "",
              style: "",
              width: 10,
              height: 10,
            }),
            e.setParent(o, r.parentId));
          const m = structuredClone(l),
            b = structuredClone(l),
            u = structuredClone(l),
            n = structuredClone(l);
          ((b.originalEdge = m),
            (b.selfLoop = { id: m.id, order: 0 }),
            (u.originalEdge = m),
            (u.selfLoop = { id: m.id, order: 1 }),
            (n.originalEdge = m),
            (n.selfLoop = { id: m.id, order: 2 }),
            (b.label = ""),
            (b.arrowTypeEnd = "none"),
            (b.endLabelLeft = ""),
            (b.endLabelRight = ""),
            (b.startLabelLeft = ""),
            (b.id = a + "-cyclic-special-1"),
            (u.startLabelRight = ""),
            (u.startLabelLeft = ""),
            (u.endLabelLeft = ""),
            (u.endLabelRight = ""),
            (u.arrowTypeStart = "none"),
            (u.arrowTypeEnd = "none"),
            (u.id = a + "-cyclic-special-mid"),
            (n.label = ""),
            (n.startLabelRight = ""),
            (n.startLabelLeft = ""),
            (n.arrowTypeStart = "none"),
            r.isGroup && ((b.fromCluster = a), (n.toCluster = a)),
            (n.id = a + "-cyclic-special-2"),
            (n.arrowTypeStart = "none"),
            e.setEdge(a, f, b, a + "-cyclic-special-0"),
            e.setEdge(f, o, u, a + "-cyclic-special-1"),
            e.setEdge(o, a, n, a + "-cyclic-special-2"));
        } else e.setEdge(l.start, l.end, { ...l }, l.id);
      }),
      W(e),
      { graph: e }
    );
  }, "prepareLayoutForDagre"),
  ge = L(async (t, { element: e, preparedLayout: s }) => {
    const g = s != null ? s : Y(t),
      d = J(),
      c = await A({
        element: e,
        graph: g.graph,
        diagramType: t.type,
        id: t.diagramId,
        parentCluster: void 0,
        siteConfig: d,
      });
    return ((g.measuredLayout = c), c);
  }, "measureDagreLayout"),
  fe = L((t, e) => {
    var g;
    const s = (g = e.preparedLayout) == null ? void 0 : g.measuredLayout;
    if (!s) throw new Error("runDagreLayoutCore requires measureDagreLayout to run first");
    return (T(s.graph), de(t, s), s);
  }, "runDagreLayoutCore"),
  ue = L(
    (t, { measure: e }) =>
      I(e.graph)
        .map((s) => e.graph.node(s))
        .filter(Boolean),
    "getDagrePaintNodes",
  ),
  he = L((t, e, { measure: s }) => (t ? s.graph.node(t) : void 0), "getDagreEdgeNode"),
  be = z({
    prepareLayout: Y,
    measureLayout: ge,
    runLayoutCore: fe,
    paintOptions: {
      clusterDb: S,
      getNodes: ue,
      getEdgeNode: he,
      skipNode: L((t, { measure: e }) => !e.graph.hasNode(t.id), "skipNode"),
      isCluster: L((t, { measure: e }) => {
        var s;
        return e.graph.hasNode(t.id) && ((s = e.graph.children(t.id)) != null ? s : []).length > 0;
      }, "isCluster"),
    },
  });
export {
  de as applyDagreLayoutResult,
  O as getEdgesToRender,
  ge as measureDagreLayout,
  Y as prepareLayoutForDagre,
  be as render,
  fe as runDagreLayoutCore,
};
