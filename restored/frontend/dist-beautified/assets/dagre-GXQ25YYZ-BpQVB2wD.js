import {
  _ as m,
  aq as J,
  ar as v,
  c as T,
  Q as F,
  l as y,
  as as j,
  at as S,
  au as q,
  av as W,
  aw as Q,
  ax as B,
  ay as U,
  az as K,
  aA as I,
  aj as M,
  ah as V,
  aB as Z,
  aC as $,
} from "../index-DG7m4Xaq.js";
import { l as ee } from "./layout-Bxldjh8R.js";
var G = m((r, e, s) => Math.max(e, Math.min(s, r)), "clamp"),
  k = m((r = "TB") => {
    switch (r) {
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
  te = m(
    (r) => r === "flowchart" || r === "flowchart-v2" || r === "stateDiagram" || r === "er" || r === "classDiagram",
    "shouldMergeSelfLoopSegments",
  ),
  re = ["x", "y", "width", "height", "labelBBox", "intersect", "calcIntersect", "diff", "clusterNode"],
  ae = m((r, e, s, g, d) => {
    const c = [],
      p = new Set();
    if (
      (s.forEach(({ start: f, end: a }) => {
        (f !== g && p.add(f), a !== g && p.add(a));
      }),
      p.forEach((f) => {
        const a = r.node(f);
        typeof (a == null ? void 0 : a.x) == "number" && typeof (a == null ? void 0 : a.y) == "number" && c.push(a);
      }),
      c.length === 0 &&
        s.forEach(({ edge: f }) => {
          var a;
          ((a = f.points) != null ? a : []).forEach((t) => {
            typeof (t == null ? void 0 : t.x) == "number" && typeof (t == null ? void 0 : t.y) == "number" && c.push(t);
          });
        }),
      c.length === 0)
    )
      return k(d);
    const i = c.reduce((f, a) => ({ x: f.x + a.x / c.length, y: f.y + a.y / c.length }), { x: 0, y: 0 }),
      l = i.x - e.x,
      o = i.y - e.y;
    return Math.abs(l) > Math.abs(o) ? (l > 0 ? "right" : "left") : Math.abs(o) > 0 ? (o > 0 ? "bottom" : "top") : k(d);
  }, "getSelfLoopSide"),
  oe = m((r, e = "top", s = 0, g = 0) => {
    const d = r.x,
      c = r.y - s,
      p = r.width / 2,
      i = r.height / 2,
      l = Math.max(36, Math.min(100, r.width * 0.8)),
      o = G(Math.max(g, r.width * 0.35), 36, l),
      f = G(Math.min(r.width, r.height) * 0.45, 24, 48);
    switch (e) {
      case "bottom": {
        const a = c + i;
        return [
          { x: d - o / 2, y: a },
          { x: d - o / 2, y: a + f },
          { x: d + o / 2, y: a + f },
          { x: d + o / 2, y: a },
        ];
      }
      case "right": {
        const a = d + p;
        return [
          { x: a, y: c - o / 2 },
          { x: a + f, y: c - o / 2 },
          { x: a + f, y: c + o / 2 },
          { x: a, y: c + o / 2 },
        ];
      }
      case "left": {
        const a = d - p;
        return [
          { x: a, y: c - o / 2 },
          { x: a - f, y: c - o / 2 },
          { x: a - f, y: c + o / 2 },
          { x: a, y: c + o / 2 },
        ];
      }
      case "top":
      default: {
        const a = c - i;
        return [
          { x: d - o / 2, y: a },
          { x: d - o / 2, y: a - f },
          { x: d + o / 2, y: a - f },
          { x: d + o / 2, y: a },
        ];
      }
    }
  }, "getSelfLoopPoints"),
  ne = m((r, e, s = "top", g = 0, d = {}) => {
    var f, a;
    const p = r.x,
      i = r.y - g,
      l = (f = d.width) != null ? f : 0,
      o = (a = d.height) != null ? a : 0;
    switch (s) {
      case "bottom":
        return { x: p, y: Math.max(...e.map((t) => t.y)) + o / 2 + 4 };
      case "right":
        return { x: Math.max(...e.map((t) => t.x)) + l / 2 + 4, y: i };
      case "left":
        return { x: Math.min(...e.map((t) => t.x)) - l / 2 - 4, y: i };
      case "top":
      default:
        return { x: p, y: Math.min(...e.map((t) => t.y)) - o / 2 - 4 };
    }
  }, "getSelfLoopLabelPosition"),
  A = m((r, e = 0, { mergeSelfLoops: s = !0 } = {}) => {
    var p;
    const g = new Map(),
      d = [],
      c = (p = r.graph()) == null ? void 0 : p.rankdir;
    return (
      r.edges().forEach((i) => {
        const l = r.edge(i);
        if (s && l.selfLoop) {
          const o = l.selfLoop.id;
          (g.has(o) || g.set(o, []), g.get(o).push({ edge: l, start: i.v, end: i.w }));
        } else d.push({ edge: l, start: i.v, end: i.w });
      }),
      g.forEach((i) => {
        var N, b, x, D, X, C, R, P;
        if (i.length !== 3) {
          i.forEach((E) => d.push(E));
          return;
        }
        i.sort((E, H) => E.edge.selfLoop.order - H.edge.selfLoop.order);
        const [l, o, f] = i,
          a =
            (x = (b = (N = l.edge.originalEdge) != null ? N : o.edge.originalEdge) != null ? b : f.edge.originalEdge) !=
            null
              ? x
              : o.edge,
          t = r.node(a.start);
        if (!t) {
          i.forEach((E) => d.push(E));
          return;
        }
        const w = { width: o.edge.width, height: o.edge.height },
          L = ae(r, t, i, a.start, c),
          h = oe(t, L, e, (D = w.width) != null ? D : 0),
          n = ne(t, h, L, e, w),
          u = {
            ...o.edge,
            ...a,
            id: a.id,
            points: h,
            start: a.start,
            end: a.end,
            x: n.x,
            y: n.y,
            width: w.width,
            height: w.height,
            labelStyle: o.edge.labelStyle,
            fromCluster:
              (C = (X = l.edge.fromCluster) != null ? X : o.edge.fromCluster) != null ? C : f.edge.fromCluster,
            toCluster: (P = (R = l.edge.toCluster) != null ? R : o.edge.toCluster) != null ? P : f.edge.toCluster,
          };
        (delete u.selfLoop, delete u.originalEdge, d.push({ edge: u, start: u.start, end: u.end }));
      }),
      d
    );
  }, "getEdgesToRender"),
  Y = m(async ({ element: r, graph: e, diagramType: s, id: g, parentCluster: d, siteConfig: c }) => {
    const p = e.graph().rankdir;
    y.trace("Dir in recursive render - dir:", p);
    const { clusters: i, edgePaths: l, edgeLabels: o, nodes: f, rootGroups: a } = q(r, { edgePathsClass: "edgePaths" });
    (e.nodes() ? y.info("Recursive render XXX", e.nodes()) : y.info("No nodes found for", e),
      e.edges().length > 0 && y.info("Recursive edges", e.edge(e.edges()[0])));
    const t = te(s);
    (await Promise.all(
      e.nodes().map(async function (h) {
        const n = e.node(h);
        if (d !== void 0) {
          const u = JSON.parse(JSON.stringify(d.clusterData));
          (y.trace(
            `Setting data for parent cluster XXX
 Node.id = `,
            h,
            `
 data=`,
            u.height,
            `
Parent cluster`,
            d.height,
          ),
            e.setNode(d.id, u),
            e.parent(h) || (y.trace("Setting parent", h, d.id), e.setParent(h, d.id, u)));
        }
        if ((y.info("(Insert) Node XXX" + h + ": " + JSON.stringify(e.node(h))), n != null && n.clusterNode)) {
          y.info("Cluster identified XBX", h, n.width, e.node(h));
          const { ranksep: u, nodesep: N } = e.graph();
          n.graph.setGraph({ ...n.graph.graph(), ranksep: u + 25, nodesep: N });
          const b = await ce({
              element: f,
              graph: n.graph,
              diagramType: s,
              id: g,
              parentCluster: e.node(h),
              siteConfig: c,
            }),
            x = b.elem;
          (W(n, x),
            (n.diff = b.diff || 0),
            y.info("New compound node after recursive render XAX", h, "width", n.width, "height", n.height),
            Q(x, n));
        } else
          e.children(h).length > 0
            ? (y.trace("Cluster - the non recursive path XBX", h, n.id, n, n.width, "Graph:", e),
              y.trace(B(n.id, e)),
              S.set(n.id, { id: B(n.id, e), node: n }))
            : (y.trace("Node - the non recursive path XAX", h, f, e.node(h), p),
              await U(f, e.node(h), { config: c, dir: p }));
      }),
    ),
      await m(async () => {
        const h = e.edges().map(async function (n) {
          var N, b, x, D, X, C, R, P;
          const u = e.edge(n.v, n.w, n.name);
          if (
            (y.info("Edge " + n.v + " -> " + n.w + ": " + JSON.stringify(n)),
            y.info("Edge " + n.v + " -> " + n.w + ": ", n, " ", JSON.stringify(e.edge(n))),
            y.info("Fix", S, "ids:", n.v, n.w, "Translating: ", S.get(n.v), S.get(n.w)),
            t && u.selfLoop)
          ) {
            if (u.selfLoop.order !== 1) return;
            const E = {
              ...u.originalEdge,
              ...u,
              id: u.selfLoop.id,
              startLabelLeft:
                (b = (N = u.originalEdge) == null ? void 0 : N.startLabelLeft) != null ? b : u.startLabelLeft,
              startLabelRight:
                (D = (x = u.originalEdge) == null ? void 0 : x.startLabelRight) != null ? D : u.startLabelRight,
              endLabelLeft: (C = (X = u.originalEdge) == null ? void 0 : X.endLabelLeft) != null ? C : u.endLabelLeft,
              endLabelRight:
                (P = (R = u.originalEdge) == null ? void 0 : R.endLabelRight) != null ? P : u.endLabelRight,
            };
            (await I(o, E), (u.width = E.width), (u.height = E.height), (u.labelStyle = E.labelStyle));
            return;
          }
          await I(o, u);
        });
        await Promise.all(h);
      }, "processEdges")());
    const { subGraphTitleTotalMargin: L } = K(c);
    return {
      elem: a,
      graph: e,
      groups: { clusters: i, edgePaths: l, edgeLabels: o, nodes: f, rootGroups: a },
      diagramType: s,
      id: g,
      mergeSelfLoops: t,
      subGraphTitleTotalMargin: L,
    };
  }, "measureDagreGraph"),
  _ = m((r) => {
    (y.info("############################################# XXX"),
      y.info("###                Layout                 ### XXX"),
      y.info("############################################# XXX"),
      ee(r));
  }, "runDagreGraphLayout"),
  se = m((r, e, s) => {
    var c, p, i;
    const g = r.node(e);
    if (!g) return;
    const d = { ...g };
    return (
      g != null && g.clusterNode
        ? (d.y = ((c = g.y) != null ? c : 0) + s)
        : r.children(e).length > 0
          ? (d.height = ((p = g.height) != null ? p : 0) + s)
          : (d.y = ((i = g.y) != null ? i : 0) + s / 2),
      d
    );
  }, "normalizeDagreNode"),
  O = m((r, e) => {
    re.forEach((s) => {
      e[s] !== void 0 && (r[s] = e[s]);
    });
  }, "applyDagreNodeLayout"),
  ie = m((r, e, s, g) => {
    var d, c, p;
    return {
      ...r,
      start: (d = r.start) != null ? d : e,
      end: (c = r.end) != null ? c : s,
      points: ((p = r.points) != null ? p : []).map((i) => ({ ...i, y: typeof i.y == "number" ? i.y + g : i.y })),
    };
  }, "normalizeDagreEdge"),
  de = m((r, e) => {
    const { graph: s, mergeSelfLoops: g, subGraphTitleTotalMargin: d = 0 } = e,
      c = new Map(r.nodes.map((i) => [i.id, i]));
    v(s).forEach((i) => {
      const l = se(s, i, d);
      if (!l) return;
      O(s.node(i), l);
      const o = c.get(i);
      o && O(o, l);
    });
    const p = d / 2;
    return ((r.edges = A(s, p, { mergeSelfLoops: g }).map(({ edge: i, start: l, end: o }) => ie(i, l, o, p))), r);
  }, "applyDagreLayoutResult"),
  le = m(
    async ({
      elem: r,
      graph: e,
      groups: { clusters: s, edgePaths: g },
      diagramType: d,
      id: c,
      mergeSelfLoops: p,
      subGraphTitleTotalMargin: i,
    }) => {
      let l = 0;
      await Promise.all(
        v(e).map(async function (a) {
          var w;
          const t = e.node(a);
          if (
            (y.info("Position XBX => " + a + ": (" + t.x, "," + t.y, ") width: ", t.width, " height: ", t.height),
            t != null && t.clusterNode)
          )
            ((t.y += i),
              y.info("A tainted cluster node XBX1", a, t.id, t.width, t.height, t.x, t.y, e.parent(a)),
              (S.get(t.id).node = t),
              M(t));
          else if (e.children(a).length > 0) {
            (y.info("A pure cluster node XBX1", a, t.id, t.x, t.y, t.width, t.height, e.parent(a)),
              (t.height += i),
              e.node(t.parentId));
            const L = (t == null ? void 0 : t.padding) / 2 || 0,
              h = ((w = t == null ? void 0 : t.labelBBox) == null ? void 0 : w.height) || 0,
              n = h - L || 0;
            (y.debug("OffsetY", n, "labelHeight", h, "halfPadding", L), await V(s, t), (S.get(t.id).node = t));
          } else {
            const L = e.node(t.parentId);
            ((t.y += i / 2),
              y.info(
                "A regular node XBX1 - using the padding",
                t.id,
                "parent",
                t.parentId,
                t.width,
                t.height,
                t.x,
                t.y,
                "offsetY",
                t.offsetY,
                "parent",
                L,
                L == null ? void 0 : L.offsetY,
                t,
              ),
              M(t));
          }
        }),
      );
      const o = i / 2;
      return (
        A(e, o, { mergeSelfLoops: p }).forEach(function ({ edge: a, start: t, end: w }) {
          (y.info("Edge " + t + " -> " + w + ": " + JSON.stringify(a), a), a.points.forEach((u) => (u.y += o)));
          const L = e.node(t),
            h = e.node(w),
            n = Z(g, a, S, d, L, h, c);
          $(a, n);
        }),
        e.nodes().forEach(function (a) {
          const t = e.node(a);
          (y.info(a, t.type, t.diff), t.isGroup && (l = t.diff));
        }),
        y.warn("Returning from recursive render XAX", r, l),
        { elem: r, diff: l }
      );
    },
    "paintDagreLayoutCore",
  ),
  ce = m(async (r) => {
    const e = await Y(r);
    return (_(e.graph), await le(e));
  }, "renderDagreSubgraph"),
  z = m((r) => {
    var s, g, d, c, p, i;
    const e = new F({ multigraph: !0, compound: !0 })
      .setGraph({
        rankdir: r.direction,
        nodesep:
          ((s = r.config) == null ? void 0 : s.nodeSpacing) ||
          r.nodeSpacing ||
          ((d = (g = r.config) == null ? void 0 : g.flowchart) == null ? void 0 : d.nodeSpacing),
        ranksep:
          ((c = r.config) == null ? void 0 : c.rankSpacing) ||
          r.rankSpacing ||
          ((i = (p = r.config) == null ? void 0 : p.flowchart) == null ? void 0 : i.rankSpacing),
        marginx: 8,
        marginy: 8,
      })
      .setDefaultEdgeLabel(function () {
        return {};
      });
    return (
      r.nodes.forEach((l) => {
        (e.setNode(l.id, { ...l }), l.parentId && e.setParent(l.id, l.parentId));
      }),
      y.debug("Edges:", r.edges),
      r.edges.forEach((l) => {
        if (l.start === l.end) {
          const o = l.start,
            f = o + "---" + o + "---1",
            a = o + "---" + o + "---2",
            t = e.node(o);
          (e.setNode(f, {
            domId: f,
            id: f,
            parentId: t.parentId,
            labelStyle: "",
            label: "",
            padding: 0,
            shape: "labelRect",
            style: "",
            width: 10,
            height: 10,
          }),
            e.setParent(f, t.parentId),
            e.setNode(a, {
              domId: a,
              id: a,
              parentId: t.parentId,
              labelStyle: "",
              padding: 0,
              shape: "labelRect",
              label: "",
              style: "",
              width: 10,
              height: 10,
            }),
            e.setParent(a, t.parentId));
          const w = structuredClone(l),
            L = structuredClone(l),
            h = structuredClone(l),
            n = structuredClone(l);
          ((L.originalEdge = w),
            (L.selfLoop = { id: w.id, order: 0 }),
            (h.originalEdge = w),
            (h.selfLoop = { id: w.id, order: 1 }),
            (n.originalEdge = w),
            (n.selfLoop = { id: w.id, order: 2 }),
            (L.label = ""),
            (L.arrowTypeEnd = "none"),
            (L.endLabelLeft = ""),
            (L.endLabelRight = ""),
            (L.startLabelLeft = ""),
            (L.id = o + "-cyclic-special-1"),
            (h.startLabelRight = ""),
            (h.startLabelLeft = ""),
            (h.endLabelLeft = ""),
            (h.endLabelRight = ""),
            (h.arrowTypeStart = "none"),
            (h.arrowTypeEnd = "none"),
            (h.id = o + "-cyclic-special-mid"),
            (n.label = ""),
            (n.startLabelRight = ""),
            (n.startLabelLeft = ""),
            (n.arrowTypeStart = "none"),
            t.isGroup && ((L.fromCluster = o), (n.toCluster = o)),
            (n.id = o + "-cyclic-special-2"),
            (n.arrowTypeStart = "none"),
            e.setEdge(o, f, L, o + "-cyclic-special-0"),
            e.setEdge(f, a, h, o + "-cyclic-special-1"),
            e.setEdge(a, o, n, o + "-cyclic-special-2"));
        } else e.setEdge(l.start, l.end, { ...l }, l.id);
      }),
      j(e),
      { graph: e }
    );
  }, "prepareLayoutForDagre"),
  ge = m(async (r, { element: e, preparedLayout: s }) => {
    const g = s != null ? s : z(r),
      d = T(),
      c = await Y({
        element: e,
        graph: g.graph,
        diagramType: r.type,
        id: r.diagramId,
        parentCluster: void 0,
        siteConfig: d,
      });
    return ((g.measuredLayout = c), c);
  }, "measureDagreLayout"),
  fe = m((r, e) => {
    var g;
    const s = (g = e.preparedLayout) == null ? void 0 : g.measuredLayout;
    if (!s) throw new Error("runDagreLayoutCore requires measureDagreLayout to run first");
    return (_(s.graph), de(r, s), s);
  }, "runDagreLayoutCore"),
  he = m(
    (r, { measure: e }) =>
      v(e.graph)
        .map((s) => e.graph.node(s))
        .filter(Boolean),
    "getDagrePaintNodes",
  ),
  ue = m((r, e, { measure: s }) => (r ? s.graph.node(r) : void 0), "getDagreEdgeNode"),
  Le = J({
    prepareLayout: z,
    measureLayout: ge,
    runLayoutCore: fe,
    paintOptions: {
      clusterDb: S,
      getNodes: he,
      getEdgeNode: ue,
      skipNode: m((r, { measure: e }) => !e.graph.hasNode(r.id), "skipNode"),
      isCluster: m((r, { measure: e }) => {
        var s;
        return e.graph.hasNode(r.id) && ((s = e.graph.children(r.id)) != null ? s : []).length > 0;
      }, "isCluster"),
    },
  });
export {
  de as applyDagreLayoutResult,
  A as getEdgesToRender,
  ge as measureDagreLayout,
  z as prepareLayoutForDagre,
  Le as render,
  fe as runDagreLayoutCore,
};
