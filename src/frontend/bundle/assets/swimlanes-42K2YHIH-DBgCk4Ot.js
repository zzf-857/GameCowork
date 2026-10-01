import { aw as xi, l as Dn, _ as c, aJ as Ss } from "./registry-CHHSpXp3.js";
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
      e = new t.Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "fc903823-0201-4049-98b1-dccd7c96e956"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-fc903823-0201-4049-98b1-dccd7c96e956"));
  })();
} catch {}
var Cs = 5,
  an = 1e-5,
  ln = 1e-6;
function gn(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) e.push({ a: t[n], b: t[n + 1] });
  return e;
}
c(gn, "buildSegmentList");
function As(t, e, n, o) {
  const s = e.x - t.x,
    r = e.y - t.y,
    d = o.x - n.x,
    l = o.y - n.y,
    p = s * l - r * d;
  if (p === 0) return null;
  const y = n.x - t.x,
    f = n.y - t.y,
    g = (y * l - f * d) / p,
    M = (y * r - f * s) / p;
  return g <= ln || g >= 1 - ln || M <= ln || M >= 1 - ln
    ? null
    : { point: { x: t.x + g * s, y: t.y + g * r }, tA: g, tB: M };
}
c(As, "segmentIntersection");
function Hn(t) {
  return Math.abs(t.b.x - t.a.x) >= Math.abs(t.b.y - t.a.y);
}
c(Hn, "isHorizontalSeg");
function Rs(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const o = t[n],
      s = gn(o.points);
    for (let r = n + 1; r < t.length; r++) {
      const d = t[r],
        l = gn(d.points);
      for (const [p, y] of s.entries())
        for (const [f, g] of l.entries()) {
          const M = As(y.a, y.b, g.a, g.b);
          if (!M) continue;
          const i = Hn(y),
            u = Hn(g);
          (i !== u ? i : !1)
            ? e.push({ jumpEdgeId: o.id, otherEdgeId: d.id, segIndex: p, t: M.tA, point: M.point })
            : e.push({ jumpEdgeId: d.id, otherEdgeId: o.id, segIndex: f, t: M.tB, point: M.point });
        }
    }
  }
  return e;
}
c(Rs, "findEdgeIntersections");
function Ie(t) {
  const e = Math.round(t * 1e3) / 1e3;
  return Number.isInteger(e) ? `${e}` : `${e}`;
}
c(Ie, "fmt");
function je(t) {
  return `${Ie(t.x)},${Ie(t.y)}`;
}
c(je, "pointToString");
function Ns(t) {
  const e = t.b.x - t.a.x,
    n = t.b.y - t.a.y;
  return Math.abs(e) >= Math.abs(n) ? (e >= 0 ? 1 : 0) : n >= 0 ? 1 : 0;
}
c(Ns, "getArcSweepFlag");
var bi = 0.001;
function Os(t, e) {
  if (t.length < 2) return t.map((r) => ({ ...r }));
  const n = t.map((r) => ({ ...r })),
    o = e.arrowTypeStart && Ss[e.arrowTypeStart];
  if (o) {
    const r = t[0],
      d = t[1],
      l = Math.atan2(d.y - r.y, d.x - r.x);
    ((n[0].x = r.x + o * Math.cos(l)), (n[0].y = r.y + o * Math.sin(l)));
  }
  const s = e.arrowTypeEnd && Ss[e.arrowTypeEnd];
  if (s) {
    const r = t.length,
      d = t[r - 2],
      l = t[r - 1],
      p = Math.atan2(l.y - d.y, l.x - d.x);
    ((n[r - 1].x = l.x - s * Math.cos(p)), (n[r - 1].y = l.y - s * Math.sin(p)));
  }
  return n;
}
c(Os, "applyMarkerOffsets");
function Ps(t, e, n, o, s) {
  const r = t.point.x,
    d = t.point.y,
    l = { x: r - e * t.r, y: d - n * t.r },
    p = { x: r + e * t.r, y: d + n * t.r },
    y = [`L${je(l)}`];
  return (s === "arc" ? y.push(`A${Ie(t.r)},${Ie(t.r)} 0 0 ${o} ${je(p)}`) : y.push(`M${je(p)}`), y);
}
c(Ps, "emitJump");
function Xn(t, e, n, o) {
  const s = e.x - t.x,
    r = e.y - t.y,
    d = n.x - e.x,
    l = n.y - e.y,
    p = Math.hypot(s, r),
    y = Math.hypot(d, l);
  if (p < an || y < an) return null;
  const f = s / p,
    g = r / p,
    M = d / y,
    i = l / y,
    u = f * M + g * i,
    h = Math.max(-1, Math.min(1, u)),
    x = Math.acos(h);
  if (x < an || Math.abs(Math.PI - x) < an) return null;
  const I = Math.min(o / Math.sin(x / 2), p / 2, y / 2);
  return {
    startX: e.x - f * I,
    startY: e.y - g * I,
    endX: e.x + M * I,
    endY: e.y + i * I,
    ctrlX: e.x,
    ctrlY: e.y,
    cutLen: I,
  };
}
c(Xn, "computeRoundedCorner");
function Bs(t, e, n) {
  var y, f, g, M;
  const o = t.points;
  if (o.length < 2) return "";
  const s = Os(o, t),
    r = t.curve === "rounded",
    d = gn(s),
    l = new Map();
  for (const i of e) {
    const u = d[i.segIndex];
    if (!u) continue;
    const h = Math.hypot(u.b.x - u.a.x, u.b.y - u.a.y),
      x = (y = l.get(i.segIndex)) != null ? y : [];
    (x.push({ t: i.t, point: i.point, d: i.t * h, r: n.jumpRadius }), l.set(i.segIndex, x));
  }
  const p = [`M${je(s[0])}`];
  for (let i = 0; i < d.length; i++) {
    const u = d[i],
      h = Math.hypot(u.b.x - u.a.x, u.b.y - u.a.y),
      x = h === 0 ? 0 : (u.b.x - u.a.x) / h,
      I = h === 0 ? 0 : (u.b.y - u.a.y) / h,
      v = Ns(u);
    let E = 0;
    if (r && i > 0) {
      const S = Xn(s[i - 1], s[i], (f = s[i + 1]) != null ? f : s[i], Cs);
      S && (E = S.cutLen);
    }
    let C = h,
      a = null;
    r &&
      i < d.length - 1 &&
      ((a = Xn(s[i], s[i + 1], (g = s[i + 2]) != null ? g : s[i + 1], Cs)), a && (C = h - a.cutLen));
    const m = [...((M = l.get(i)) != null ? M : [])].sort((S, w) => S.t - w.t);
    for (const S of m) S.r = Math.min(S.r, S.d - E, C - S.d);
    for (let S = 0; S < m.length - 1; S++) {
      const w = m[S + 1].d - m[S].d;
      if (m[S].r + m[S + 1].r > w) {
        const L = w / 2;
        ((m[S].r = Math.min(m[S].r, L)), (m[S + 1].r = Math.min(m[S + 1].r, L)));
      }
    }
    for (const S of m) S.r < bi || p.push(...Ps(S, x, I, v, n.jumpStyle));
    r && a
      ? (p.push(`L${Ie(a.startX)},${Ie(a.startY)}`),
        p.push(`Q${Ie(a.ctrlX)},${Ie(a.ctrlY)} ${Ie(a.endX)},${Ie(a.endY)}`))
      : p.push(`L${je(u.b)}`);
  }
  return p.join(" ");
}
c(Bs, "rewriteEdgePath");
function ks(t) {
  return /^[\d\s+,.LMelm-]*$/.test(t);
}
c(ks, "isStraightPath");
function Fs(t) {
  return t ? t === "linear" || t === "rounded" || t === "step" || t === "stepBefore" || t === "stepAfter" : !0;
}
c(Fs, "curveSupportsLineHops");
function _s(t) {
  if (!t) return null;
  try {
    const e = typeof atob == "function" ? atob(t) : Buffer.from(t, "base64").toString(),
      n = JSON.parse(e);
    if (!Array.isArray(n)) return null;
    const o = [];
    for (const s of n) s && typeof s.x == "number" && typeof s.y == "number" && o.push({ x: s.x, y: s.y });
    return o.length >= 2 ? o : null;
  } catch {
    return null;
  }
}
c(_s, "decodeDataPoints");
function Ds(t, e, n) {
  var y, f, g;
  if (!n.enabled) return;
  const o = t.node();
  if (!o) return;
  const s = new Map();
  for (const M of e) s.set(M.id, M);
  const r = [],
    d = new Map();
  for (const M of e) {
    const i = typeof CSS < "u" && CSS.escape ? CSS.escape(M.id) : M.id,
      u = o.querySelector(`path[data-id="${i}"]`);
    if (!u) continue;
    d.set(M.id, u);
    const h = _s(u.getAttribute("data-points")),
      x = h != null ? h : M.points;
    r.push({ ...M, points: x });
  }
  const l = Rs(r);
  if (l.length === 0) return;
  const p = new Map();
  for (const M of l) {
    const i = (y = p.get(M.jumpEdgeId)) != null ? y : [];
    (i.push(M), p.set(M.jumpEdgeId, i));
  }
  for (const M of r) {
    const i = p.get(M.id);
    if (!i || i.length === 0) continue;
    const u = s.get(M.id),
      h = u == null ? void 0 : u.curve;
    if (h !== void 0 && !Fs(h)) continue;
    const x = d.get(M.id);
    if (!x) continue;
    if (h === void 0) {
      const m = (f = x.getAttribute("d")) != null ? f : "";
      if (!ks(m)) continue;
    }
    const I = (g = x.getAttribute("style")) != null ? g : "",
      v = /stroke-dasharray\s*:\s*0\s+([\d.]+)\s+[\d.]+\s+([\d.]+)/.exec(I),
      E = v ? Number.parseFloat(v[1]) : null,
      C = v ? Number.parseFloat(v[2]) : null,
      a = Bs(M, i, n);
    if ((x.setAttribute("d", a), E !== null && C !== null && typeof x.getTotalLength == "function")) {
      const m = x.getTotalLength(),
        S = Math.max(0, m - E - C),
        w = `0 ${E} ${S} ${C}`,
        L = I.replace(/stroke-dasharray\s*:[^;]*;?/g, `stroke-dasharray: ${w};`).replace(/;\s*;+/g, ";");
      x.setAttribute("style", L);
    }
  }
}
c(Ds, "applyLineJumpsToSvg");
function Hs(t, { measure: e }) {
  var r, d;
  const n = (d = (r = t.config) == null ? void 0 : r.swimlane) == null ? void 0 : d.lineHops;
  if (n === !1) return;
  const o = n === "gap" ? "gap" : "arc",
    s = t.edges
      .filter((l) => Array.isArray(l.points) && l.points.length >= 2)
      .map((l) => ({
        id: l.id,
        points: l.points,
        curve: l.curve,
        arrowTypeStart: l.arrowTypeStart,
        arrowTypeEnd: l.arrowTypeEnd,
      }));
  Ds(e.groups.edgePaths, s, { enabled: !0, jumpRadius: 6, jumpStyle: o });
}
c(Hs, "applySwimlaneLineJumps");
var Pn = "__swimlane_default__",
  Mi = 21,
  vs = 20;
function Yn(t) {
  var e;
  return Math.max((e = t.padding) != null ? e : vs, vs);
}
c(Yn, "topLaneHorizontalPadding");
function Xs(t) {
  const { x: e, y: n, width: o, height: s } = t,
    r = t.swimlaneContentTop;
  if (
    typeof e != "number" ||
    typeof n != "number" ||
    typeof o != "number" ||
    typeof s != "number" ||
    typeof r != "number" ||
    !Number.isFinite(e) ||
    !Number.isFinite(n) ||
    !Number.isFinite(o) ||
    !Number.isFinite(s) ||
    !Number.isFinite(r) ||
    o <= 0 ||
    s <= 0
  ) {
    delete t.groupTitleRect;
    return;
  }
  const d = n - s / 2,
    l = Math.min(r, n + s / 2),
    p = Math.min(Mi, Math.max(0, l - d)),
    y = d + p;
  if (y <= d) {
    delete t.groupTitleRect;
    return;
  }
  t.groupTitleRect = { left: e - o / 2, right: e + o / 2, top: d, bottom: y };
}
c(Xs, "assignTopLaneTitleRect");
function Ys(t) {
  var r, d;
  const e = t.direction,
    n = (r = t.nodes) != null ? r : (t.nodes = []);
  for (const l of (d = t.nodes) != null ? d : [])
    l.isGroup && !l.parentId && ((l.shape = "swimlane"), e && (l.direction = e));
  const o = n.filter((l) => !l.isGroup && !l.parentId);
  if (o.length === 0) return;
  let s = n.find((l) => l.id === Pn);
  s
    ? s.isGroup && ((s.shape = "swimlane"), e && (s.direction = e))
    : ((s = { id: Pn, label: "", isGroup: !0, shape: "swimlane", padding: 20, ...(e ? { direction: e } : {}) }),
      n.push(s));
  for (const l of o) l.parentId = Pn;
}
c(Ys, "prepareLayoutForSwimlanes");
function Gs(t) {
  var p, y, f;
  const e = new Map();
  for (const g of (p = t.nodes) != null ? p : []) e.set(g.id, g);
  const n = [];
  for (const g of (y = t.edges) != null ? y : []) {
    const M = typeof g.start == "string" ? g.start : void 0,
      i = typeof g.end == "string" ? g.end : void 0;
    !M || !i || g.labelNodeId || n.push({ id: g.id, src: M, dst: i, ref: g });
  }
  const o = (f = t.nodes) != null ? f : [],
    s = o.filter((g) => g.isGroup),
    r = o.filter((g) => !g.isGroup);
  return { nodes: [...[...s].reverse(), ...r].map((g) => g.id), edges: n, layout: t, nodeById: e };
}
c(Gs, "toGraphView");
function $s(t, e, n, o) {
  var M, i, u, h, x, I, v, E, C, a, m, S, w, L, O;
  const { layout: s } = t,
    r = t.nodeById,
    d = (M = o == null ? void 0 : o.layerGap) != null ? M : 100,
    l = (i = o == null ? void 0 : o.nodeGap) != null ? i : 40;
  let p = 0;
  for (const R of e.layers) {
    let k = 0;
    for (const D of R) {
      const J = r.get(D);
      if (!J) {
        k++;
        continue;
      }
      ((J.layer = p), (J.order = k));
      const at = (u = n.x[D]) != null ? u : k * l,
        gt = (h = n.y[D]) != null ? h : p * d;
      ((J.x = at), (J.y = gt), k++);
    }
    p++;
  }
  const y = (x = s.nodes) != null ? x : [],
    f = new Map(),
    g = [];
  for (const R of y) {
    if (!(R != null && R.isGroup)) continue;
    R.parentId || g.push(R);
    const k = y.filter((mt) => mt.parentId === R.id);
    let D = 1 / 0,
      J = -1 / 0,
      at = 1 / 0,
      gt = -1 / 0;
    for (const mt of k) {
      const St = (I = mt.x) != null ? I : n.x[mt.id],
        bt = (v = mt.y) != null ? v : n.y[mt.id],
        Pt = (E = mt.width) != null ? E : 0,
        kt = (C = mt.height) != null ? C : 0;
      St != null &&
        bt != null &&
        ((D = Math.min(D, St - Pt / 2)),
        (J = Math.max(J, St + Pt / 2)),
        (at = Math.min(at, bt - kt / 2)),
        (gt = Math.max(gt, bt + kt / 2)));
    }
    if (D === 1 / 0 || at === 1 / 0)
      ((R.x = (a = R.x) != null ? a : 0),
        (R.y = (m = R.y) != null ? m : 0),
        (R.width = (S = R.width) != null ? S : 0),
        (R.height = (w = R.height) != null ? w : 0));
    else {
      const mt = (L = R.padding) != null ? L : 20,
        St = R.parentId ? mt : 2 * Yn(R),
        bt = mt,
        Pt = Math.max(0, J - D) + St,
        kt = Math.max(0, gt - at) + bt,
        Xt = (D + J) / 2,
        ft = (at + gt) / 2;
      ((R.x = Xt), (R.y = ft), (R.width = Pt), (R.height = kt), f.set(R.id, { minX: D, maxX: J, minY: at, maxY: gt }));
    }
  }
  if (g.length > 0 && f.size > 0) {
    let R = 1 / 0,
      k = -1 / 0,
      D = 0;
    for (const J of g) {
      const at = (O = J.padding) != null ? O : 20;
      at > D && (D = at);
      const gt = f.get(J.id);
      gt && ((R = Math.min(R, gt.minY)), (k = Math.max(k, gt.maxY)));
    }
    if (R !== 1 / 0 && k !== -1 / 0) {
      const J = Math.max(0, k - R),
        gt = Math.max(D, 36),
        mt = J + 2 * gt,
        St = (R + k) / 2;
      for (const W of g) ((W.y = St), (W.height = mt), (W.swimlaneContentTop = R));
      const bt = [...g].sort((W, K) => {
          var tt, et;
          const V = (tt = W.x) != null ? tt : 0,
            G = (et = K.x) != null ? et : 0;
          return V - G;
        }),
        Pt = [],
        kt = [],
        Xt = [];
      for (const W of bt) {
        const K = f.get(W.id);
        if (!K) continue;
        const V = Math.max(0, K.maxX - K.minX) + 2 * Yn(W),
          G = (K.minX + K.maxX) / 2;
        (Pt.push(W.id), kt.push(G), Xt.push(V));
      }
      const ft = Pt.length;
      if (ft > 0) {
        const W = new Map();
        if (ft === 1) W.set(Pt[0], Xt[0]);
        else {
          const K = [];
          for (let nt = 0; nt < ft - 1; nt++) K.push(kt[nt + 1] - kt[nt]);
          const V = new Array(ft);
          V[0] = 0;
          for (let nt = 0; nt < ft - 1; nt++) V[nt + 1] = 2 * K[nt] - V[nt];
          let G = 0,
            tt = Number.POSITIVE_INFINITY;
          for (let nt = 0; nt < ft; nt++) {
            const yt = Xt[nt];
            nt % 2 === 0 ? (G = Math.max(G, yt - V[nt])) : (tt = Math.min(tt, V[nt] - yt));
          }
          let et = G;
          G <= tt ? (et = (G + tt) / 2) : (et = G);
          for (let nt = 0; nt < ft; nt++) {
            const yt = V[nt] + (nt % 2 === 0 ? et : -et),
              Lt = Math.max(Xt[nt], yt);
            W.set(Pt[nt], Lt);
          }
        }
        for (const K of g) {
          const V = W.get(K.id);
          (V != null && (K.width = V), Xs(K));
        }
      }
    }
  }
}
c($s, "writeBackToLayoutData");
var Ii = "[EdgeLabelNodes]";
function zs(t) {
  var d, l, p;
  const e = [],
    n = [],
    o = new Map();
  for (const y of t.nodes) o.set(y.id, y);
  for (const y of t.edges) {
    if (!y.label || y.label.length === 0 || y.isLayoutOnly || y.labelNodeId) continue;
    const f = y.start ? o.get(y.start) : void 0,
      g = y.end ? o.get(y.end) : void 0;
    if (!f || !g) {
      Dn.warn(Ii, `Edge ${y.id} has missing source or target node`);
      continue;
    }
    const M = `edge-label-${y.start}-${y.end}-${y.id}`,
      u = f.parentId !== g.parentId ? g.parentId : f.parentId,
      h = {
        id: M,
        label: y.label,
        edgeStart: (d = y.start) != null ? d : "",
        edgeEnd: (l = y.end) != null ? l : "",
        shape: "labelRect",
        width: 0,
        height: 0,
        isEdgeLabel: !0,
        isDummy: !0,
        parentId: u,
        isGroup: !1,
        labelStyle: Array.isArray(y.labelStyle) ? y.labelStyle[0] : (p = y.labelStyle) != null ? p : "",
        ...(f.dir ? { dir: f.dir } : {}),
      };
    (e.push(h), (y.labelNodeId = M), (y.label = void 0), (y.text = void 0));
    const x = { id: `${y.id}-to-label`, start: y.start, end: M, type: "normal", isLayoutOnly: !0 },
      I = { id: `${y.id}-from-label`, start: M, end: y.end, type: "normal", isLayoutOnly: !0 };
    n.push(x, I);
  }
  const s = [...t.nodes, ...e],
    r = [...t.edges, ...n];
  return { ...t, nodes: s, edges: r };
}
c(zs, "createEdgeLabelNodes");
var ne = 0.001;
function bo(t) {
  var r, d, l, p;
  const e = (r = t.x) != null ? r : 0,
    n = (d = t.y) != null ? d : 0,
    o = (l = t.width) != null ? l : 0,
    s = (p = t.height) != null ? p : 0;
  return o > 0 && s > 0 ? { cx: e, cy: n, rect: Ue(e, n, o, s) } : void 0;
}
c(bo, "measuredNodeRect");
function Mo(t) {
  var o;
  if (t.isGroup) return;
  const e = bo(t);
  return e ? { id: String((o = t.id) != null ? o : ""), cx: e.cx, cy: e.cy, rect: e.rect } : void 0;
}
c(Mo, "nodeBoundsInfoFor");
function xe(t, e, n = ne) {
  return Math.abs(t.x - e.x) < n && Math.abs(t.y - e.y) < n;
}
c(xe, "samePoint");
function Tt(t, e, n = ne) {
  return Math.abs(t.x - e.x) < n;
}
c(Tt, "sameX");
function At(t, e, n = ne) {
  return Math.abs(t.y - e.y) < n;
}
c(At, "sameY");
function jt(t, e, n = ne) {
  return At(t, e, n) && Math.abs(t.x - e.x) > n;
}
c(jt, "isHorizontalSegment");
function Ut(t, e, n = ne) {
  return Tt(t, e, n) && Math.abs(t.y - e.y) > n;
}
c(Ut, "isVerticalSegment");
function de(t, e, n, o) {
  return Math.max(0, Math.min(Math.max(t, e), Math.max(n, o)) - Math.max(Math.min(t, e), Math.min(n, o)));
}
c(de, "overlapLength");
function Ce(t, e, n = ne) {
  return t.horizontal && e.horizontal && At(t.a, e.a, n)
    ? de(t.a.x, t.b.x, e.a.x, e.b.x)
    : t.vertical && e.vertical && Tt(t.a, e.a, n)
      ? de(t.a.y, t.b.y, e.a.y, e.b.y)
      : 0;
}
c(Ce, "sameAxisSegmentOverlapLength");
function We(t, e = ne) {
  const n = [];
  for (let o = 0; o < t.length - 1; o++) {
    const s = t[o],
      r = t[o + 1],
      d = jt(s, r, e),
      l = Ut(s, r, e);
    (d || l) && n.push({ index: o, a: s, b: r, horizontal: d, vertical: l });
  }
  return n;
}
c(We, "orthogonalSegmentsForPoints");
function ye(t, e = ne) {
  const n = We(t, e);
  let o = 0;
  for (let s = 1; s < n.length; s++) n[s - 1].horizontal !== n[s].horizontal && o++;
  return o;
}
c(ye, "countOrthogonalBends");
function Ot(t, e = ne) {
  const n = [];
  for (const o of t) {
    const s = n.length > 0 ? n[n.length - 1] : void 0;
    (!s || !xe(s, o, e)) && n.push({ x: o.x, y: o.y });
  }
  return n;
}
c(Ot, "dedupeConsecutivePoints");
function Io(t, e = ne) {
  if (!t || t.length !== 4) return;
  const [n, o, s, r] = t;
  return jt(n, o, e) && Ut(o, s, e) && jt(s, r, e)
    ? { kind: "HVH", p0: n, p1: o, p2: s, p3: r }
    : Ut(n, o, e) && jt(o, s, e) && Ut(s, r, e)
      ? { kind: "VHV", p0: n, p1: o, p2: s, p3: r }
      : void 0;
}
c(Io, "classifyThreeSegmentRoute");
function vn(t, e, n, o = 0) {
  const s = Math.min(t.x, e.x),
    r = Math.max(t.x, e.x),
    d = Math.min(t.y, e.y),
    l = Math.max(t.y, e.y);
  return r > n.left - o && s < n.right + o && l > n.top - o && d < n.bottom + o;
}
c(vn, "segmentBoundsOverlapRect");
function So(t, e, n = 0) {
  return t.x > e.left + n && t.x < e.right - n && t.y > e.top + n && t.y < e.bottom - n;
}
c(So, "pointInsideRect");
function Vs(t, e) {
  return t.left <= e.left && t.right >= e.right && t.top <= e.top && t.bottom >= e.bottom;
}
c(Vs, "rectContainsRect");
function mn(t, e) {
  return t.left < e.right && t.right > e.left && t.top < e.bottom && t.bottom > e.top;
}
c(mn, "rectsOverlap");
function Gn(t, e) {
  return { left: t.left - e, right: t.right + e, top: t.top - e, bottom: t.bottom + e };
}
c(Gn, "inflateRect");
function Ue(t, e, n, o) {
  return { left: t - n / 2, right: t + n / 2, top: e - o / 2, bottom: e + o / 2 };
}
c(Ue, "rectFromCenterSize");
function ge(t) {
  var e;
  return (e = bo(t)) == null ? void 0 : e.rect;
}
c(ge, "rectOfNodeBounds");
function _e(t, e) {
  switch (e) {
    case "top":
      return { x: t.cx, y: t.rect.top };
    case "bottom":
      return { x: t.cx, y: t.rect.bottom };
    case "left":
      return { x: t.rect.left, y: t.cy };
    case "right":
      return { x: t.rect.right, y: t.cy };
  }
}
c(_e, "portForRectSide");
function Co(t, e, n, o, s, r = ne) {
  const d = e === "left" || e === "right",
    l = o === "left" || o === "right";
  if (d && l) {
    if ((e === "right" && o === "left" && t.x < n.x) || (e === "left" && o === "right" && t.x > n.x)) {
      if (At(t, n, r)) return [t, n];
      const g = (t.x + n.x) / 2;
      return [t, { x: g, y: t.y }, { x: g, y: n.y }, n];
    }
    if (e === o) {
      if (At(t, n, r)) return;
      const g = e === "left" ? Math.min(t.x, n.x) - s : Math.max(t.x, n.x) + s;
      return [t, { x: g, y: t.y }, { x: g, y: n.y }, n];
    }
    return;
  }
  if (!d && !l) {
    if (e === o) {
      if (Tt(t, n, r)) return;
      const M = e === "top" ? Math.min(t.y, n.y) - s : Math.max(t.y, n.y) + s;
      return [t, { x: t.x, y: M }, { x: n.x, y: M }, n];
    }
    if (!((e === "bottom" && o === "top" && t.y < n.y) || (e === "top" && o === "bottom" && t.y > n.y))) return;
    if (Tt(t, n, r)) return [t, n];
    const g = (t.y + n.y) / 2;
    return [t, { x: t.x, y: g }, { x: n.x, y: g }, n];
  }
  if (d && !l) {
    const f = (e === "right" && n.x > t.x) || (e === "left" && n.x < t.x),
      g = (o === "top" && t.y < n.y) || (o === "bottom" && t.y > n.y);
    return f && g ? [t, { x: n.x, y: t.y }, n] : void 0;
  }
  const p = (e === "bottom" && n.y > t.y) || (e === "top" && n.y < t.y),
    y = (o === "left" && t.x < n.x) || (o === "right" && t.x > n.x);
  return p && y ? [t, { x: t.x, y: n.y }, n] : void 0;
}
c(Co, "buildOrthogonalPortPath");
function vo(t, e, n, o) {
  return e === "left" || e === "right"
    ? [t, { x: o, y: t.y }, { x: o, y: n.y }, n]
    : [t, { x: t.x, y: o }, { x: n.x, y: o }, n];
}
c(vo, "buildSameSideTrackPath");
function Ln(t) {
  const e = new Map(),
    n = [];
  for (const o of t) {
    if (o.isEdgeLabel) continue;
    const s = Mo(o);
    s && (e.set(s.id, s), n.push({ id: s.id, rect: s.rect }));
  }
  return { nodeInfoById: e, realNodeRects: n };
}
c(Ln, "collectRealNodeBounds");
function Ne(t) {
  const e = [],
    n = [];
  for (const o of t) {
    const s = Mo(o);
    if (!s) continue;
    const r = { id: s.id, rect: s.rect };
    o.isEdgeLabel ? n.push(r) : e.push(r);
  }
  return { realNodeRects: e, labelNodeRects: n };
}
c(Ne, "collectNodeRectEntries");
function js(t, { includeEdgeLabels: e = !0 } = {}) {
  var o, s, r, d;
  const n = [];
  for (const l of t) {
    if (l.isGroup || (!e && l.isEdgeLabel)) continue;
    const p = (o = l.x) != null ? o : 0,
      y = (s = l.y) != null ? s : 0,
      f = (r = l.width) != null ? r : 0,
      g = (d = l.height) != null ? d : 0;
    n.push({ nodeId: l.id, ...Ue(p, y, f, g) });
  }
  return n;
}
c(js, "collectLayoutNodeRects");
function Lo(t, e, n = ne) {
  const o = t.start,
    s = t.end;
  if (!o || !s) return;
  const r = e.get(o),
    d = e.get(s);
  if (!(!r || !d))
    return {
      srcId: o,
      dstId: s,
      srcInfo: r,
      dstInfo: d,
      collinearX: Math.abs(r.cx - d.cx) < n,
      collinearY: Math.abs(r.cy - d.cy) < n,
    };
}
c(Lo, "getNodePairGeometry");
function Kt(t, e, n, o = [], s = 0) {
  for (const r of n) if (!o.includes(r.id) && vn(t, e, r.rect, -s)) return !0;
  return !1;
}
c(Kt, "segmentHitsAnyRect");
function wo(t, e, n, o, s = ne, r = 1e-6) {
  const d = At(t, e, s),
    l = Tt(t, e, s),
    p = At(n, o, s),
    y = Tt(n, o, s);
  if ((d && p) || (l && y) || !(d || l) || !(p || y)) return !1;
  const f = d ? { a: t, b: e } : { a: n, b: o },
    g = l ? { a: t, b: e } : { a: n, b: o },
    M = f.a.y,
    i = Math.min(f.a.x, f.b.x),
    u = Math.max(f.a.x, f.b.x),
    h = g.a.x,
    x = Math.min(g.a.y, g.b.y),
    I = Math.max(g.a.y, g.b.y);
  if (h < i || h > u || M < x || M > I) return !1;
  const v =
      (Math.abs(h - f.a.x) < r && Math.abs(M - f.a.y) < r) || (Math.abs(h - f.b.x) < r && Math.abs(M - f.b.y) < r),
    E = (Math.abs(h - g.a.x) < r && Math.abs(M - g.a.y) < r) || (Math.abs(h - g.b.x) < r && Math.abs(M - g.b.y) < r);
  return !(v && E);
}
c(wo, "orthogonalSegmentsCross");
function Us(t, e, n, o, s = ne) {
  const r = At(t, e, s),
    d = Tt(t, e, s),
    l = At(n, o, s),
    p = Tt(n, o, s);
  return d && p && Tt(t, n, s) ? de(t.y, e.y, n.y, o.y) > s : r && l && At(t, n, s) ? de(t.x, e.x, n.x, o.x) > s : !1;
}
c(Us, "sameAxisSegmentsOverlap");
function yn(t, e, n, o, { epsilon: s = ne, skipDegenerateOther: r = !1 } = {}) {
  for (const d of n) {
    if (d === o || d.isLayoutOnly) continue;
    const l = d.points;
    if (!(!l || l.length < 2))
      for (let p = 0; p < l.length - 1; p++) {
        const y = l[p],
          f = l[p + 1];
        if (!(r && xe(y, f, s)) && (wo(t, e, y, f, s) || Us(t, e, y, f, s))) return !0;
      }
  }
  return !1;
}
c(yn, "segmentConflictsWithAnyEdge");
function Le(t, e, n, o, s = ne) {
  const r = At(t, e, s),
    d = Tt(t, e, s),
    l = At(n, o, s),
    p = Tt(n, o, s);
  if (!((r && p) || (d && l))) return !1;
  const y = r ? { a: t, b: e } : { a: n, b: o },
    f = r ? { a: n, b: o } : { a: t, b: e },
    g = y.a.y,
    M = Math.min(y.a.x, y.b.x),
    i = Math.max(y.a.x, y.b.x),
    u = f.a.x,
    h = Math.min(f.a.y, f.b.y),
    x = Math.max(f.a.y, f.b.y);
  return u > M + s && u < i - s && g > h + s && g < x - s;
}
c(Le, "orthogonalSegmentsStrictlyCross");
function $n(t, e, n) {
  const o = Math.min(e, n),
    s = Math.max(e, n);
  return t > o + ne && t < s - ne;
}
c($n, "strictlyBetween");
function Ws(t, e, n) {
  return Tt(t, e) && Tt(e, n) ? $n(e.y, t.y, n.y) : At(t, e) && At(e, n) ? $n(e.x, t.x, n.x) : !1;
}
c(Ws, "isCollinearIntermediate");
function Ks(t) {
  let e = !1;
  const n = [];
  for (let o = 0; o < t.length; o++) {
    const s = n[n.length - 1],
      r = t[o],
      d = o + 1 < t.length ? t[o + 1] : void 0;
    if (s && d) {
      if (xe(s, d)) {
        (o++, (e = !0));
        continue;
      }
      if (Ws(s, r, d)) {
        e = !0;
        continue;
      }
    }
    n.push(r);
  }
  return { points: n, changed: e };
}
c(Ks, "simplifyPolylineOnce");
function pn(t) {
  const e = [t[0]];
  for (let o = 1; o < t.length; o++) {
    const s = e[e.length - 1],
      r = t[o];
    if (!Tt(s, r) && !At(s, r)) {
      const d = e.length >= 2 ? e[e.length - 2] : void 0,
        p = (d ? Tt(d, s) : !1) ? { x: s.x, y: r.y } : { x: r.x, y: s.y };
      e.push(p);
    }
    e.push(r);
  }
  const n = [];
  for (const o of e) {
    const s = n[n.length - 1];
    (!s || !xe(s, o)) && n.push(o);
  }
  return n;
}
c(pn, "orthogonalizePolyline");
function ve(t) {
  if (t.length < 3) return t;
  let e = [...t];
  for (let n = 0; n < 32; n++) {
    const o = Ks(e);
    if (((e = o.points), !o.changed)) break;
  }
  return e;
}
c(ve, "simplifyPolyline");
var ht = 0.001,
  Si = 0.5,
  Ls = 4;
function To(t, e, n) {
  const o = t;
  if (o.isLayoutOnly || !o.points || o.points.length < n) return;
  const s = o.start ? e.get(o.start) : void 0,
    r = o.end ? e.get(o.end) : void 0;
  return { edge: o, points: o.points, srcRect: s ? ge(s) : void 0, dstRect: r ? ge(r) : void 0 };
}
c(To, "endpointContextFor");
function qs(t, e, n) {
  if (At(t, e, ht)) return { x: t.x < n.left ? n.left : n.right, y: t.y };
  if (Tt(t, e, ht)) {
    const o = t.y < n.top ? n.top : n.bottom;
    return { x: t.x, y: o };
  }
  return { x: Math.min(n.right, Math.max(n.left, t.x)), y: Math.min(n.bottom, Math.max(n.top, t.y)) };
}
c(qs, "segmentEnterPoint");
function zn(t, e, n) {
  const o = n ? 1 : -1;
  let s = n ? 0 : t.length - 1;
  for (; s >= 0 && s < t.length && So(t[s], e, Si);) s += o;
  if (s < 0 || s >= t.length) return t;
  const r = s - o;
  if (r < 0 || r >= t.length) return t;
  const d = qs(t[s], t[r], e);
  return n ? [d, ...t.slice(s)] : [...t.slice(0, s + 1), d];
}
c(zn, "clipEndpoint");
function Js(t, e) {
  for (const n of t) {
    const o = To(n, e, 2);
    if (!o) continue;
    let s = [...o.points];
    (o.srcRect && (s = zn(s, o.srcRect, !0)),
      o.dstRect && (s = zn(s, o.dstRect, !1)),
      (s = ve(pn(s))),
      (s = Eo(s, o.srcRect, o.dstRect)),
      (o.edge.points = ve(pn(s))));
  }
}
c(Js, "clipEdgeEndpointsToNodeBoundaries");
function Vn(t, e, n, o = !1) {
  if (At(t, e, ht)) {
    if (e.y < n.top - ht || e.y > n.bottom + ht) return e;
    if (o) {
      if (t.x < n.left - ht) return { x: n.left, y: t.y };
      if (t.x > n.right + ht) return { x: n.right, y: t.y };
    }
    return { x: Math.abs(e.x - n.left) <= Math.abs(e.x - n.right) ? n.left : n.right, y: t.y };
  }
  if (Tt(t, e, ht)) {
    if (e.x < n.left - ht || e.x > n.right + ht) return e;
    if (o) {
      if (t.y < n.top - ht) return { x: t.x, y: n.top };
      if (t.y > n.bottom + ht) return { x: t.x, y: n.bottom };
    }
    const s = Math.abs(e.y - n.top) <= Math.abs(e.y - n.bottom);
    return { x: t.x, y: s ? n.top : n.bottom };
  }
  return e;
}
c(Vn, "snapEndpointToBoundary");
function xn(t, e, n) {
  const o = t[e];
  for (let s = e + n; s >= 0 && s < t.length; s += n) {
    const r = t[s];
    if (!xe(r, o, ht)) return r;
  }
  return t[e + n];
}
c(xn, "firstDistinctAdjacent");
function bn(t, e) {
  const n = t + Ls,
    o = e - Ls;
  return n <= o ? { lo: n, hi: o } : { lo: (t + e) / 2, hi: (t + e) / 2 };
}
c(bn, "cornerClearanceRange");
function jn(t, e, n) {
  const { lo: o, hi: s } = bn(e, n);
  return Math.min(s, Math.max(o, t));
}
c(jn, "clampToCornerClearance");
function Zs(t) {
  const e = Math.max(...t.map((o) => o.lo)),
    n = Math.min(...t.map((o) => o.hi));
  if (!(e > n)) return { lo: e, hi: n };
}
c(Zs, "intersectRanges");
function Un(t, e) {
  return e === "left" || e === "right" ? bn(t.top, t.bottom) : bn(t.left, t.right);
}
c(Un, "clearanceRangeForSide");
function Mn(t, e, n) {
  const o = t.y >= n.top - ht && t.y <= n.bottom + ht,
    s = t.x >= n.left - ht && t.x <= n.right + ht;
  if (At(t, e, ht) && o) {
    if (Math.abs(t.x - n.left) < ht) return "left";
    if (Math.abs(t.x - n.right) < ht) return "right";
  }
  if (Tt(t, e, ht) && s) {
    if (Math.abs(t.y - n.top) < ht) return "top";
    if (Math.abs(t.y - n.bottom) < ht) return "bottom";
  }
}
c(Mn, "terminalSideForSegment");
function Ze(t) {
  return t === "left" || t === "right";
}
c(Ze, "isHorizontalSide");
function Qs(t, e, n, o, s) {
  const r = [],
    d = n ? Mn(t, e, n) : void 0,
    l = o ? Mn(e, t, o) : void 0;
  return (
    n && d && Ze(d) === s && r.push(Un(n, d)),
    o && l && Ze(l) === s && r.push(Un(o, l)),
    r.length > 0 ? Zs(r) : void 0
  );
}
c(Qs, "straightClearanceRange");
function Wn(t, e, n, o, s) {
  const r = Qs(t, e, n, o, s);
  if (!r) return;
  const d = s ? t.y : t.x,
    l = Math.min(r.hi, Math.max(r.lo, d));
  if (!(Math.abs(l - d) < ht))
    return s
      ? [
          { x: t.x, y: l },
          { x: e.x, y: l },
        ]
      : [
          { x: l, y: t.y },
          { x: l, y: e.y },
        ];
}
c(Wn, "clearStraightEndpointCornerAxis");
function Eo(t, e, n) {
  var r, d;
  if (t.length !== 2) return t;
  const [o, s] = t;
  return At(o, s, ht)
    ? (r = Wn(o, s, e, n, !0)) != null
      ? r
      : t
    : Tt(o, s, ht) && (d = Wn(o, s, e, n, !1)) != null
      ? d
      : t;
}
c(Eo, "clearStraightEndpointCornerConnections");
function tr(t, e, n) {
  return Ze(n) ? { x: t.x, y: jn(t.y, e.top, e.bottom) } : { x: jn(t.x, e.left, e.right), y: t.y };
}
c(tr, "cornerClearedEndpoint");
function er(t, e, n, o, s, r) {
  const d = t.map((l) => ({ ...l }));
  for (let l = e; l >= 0 && l < t.length; l += n) {
    const p = t[l];
    if ((r && !At(p, o, ht)) || (!r && !Tt(p, o, ht))) break;
    r ? (d[l].y = s.y) : (d[l].x = s.x);
  }
  return d;
}
c(er, "moveCollinearEndpointRun");
function Kn(t, e, n) {
  if (t.length < 2) return t;
  const o = n ? 0 : t.length - 1,
    s = n ? 1 : -1,
    r = t[o],
    d = xn(t, o, s);
  if (!d) return t;
  const l = Mn(r, d, e);
  if (!l) return t;
  const p = Ze(l),
    y = tr(r, e, l);
  return xe(r, y, ht) ? t : er(t, o, s, r, y, p);
}
c(Kn, "clearEndpointCornerConnection");
function qn(t, e, n) {
  const o = Math.min(t.x, e.x) >= n.left - ht && Math.max(t.x, e.x) <= n.right + ht,
    s = Math.min(t.y, e.y) >= n.top - ht && Math.max(t.y, e.y) <= n.bottom + ht;
  if (Math.abs(t.y - n.top) < ht && Math.abs(e.y - n.top) < ht && o) return "top";
  if (Math.abs(t.y - n.bottom) < ht && Math.abs(e.y - n.bottom) < ht && o) return "bottom";
  if (Math.abs(t.x - n.left) < ht && Math.abs(e.x - n.left) < ht && s) return "left";
  if (Math.abs(t.x - n.right) < ht && Math.abs(e.x - n.right) < ht && s) return "right";
}
c(qn, "borderSideForSegment");
function Jn(t, e, n, o) {
  switch (t) {
    case "top":
      return Tt(e, n, ht) && n.y < o.top - ht;
    case "bottom":
      return Tt(e, n, ht) && n.y > o.bottom + ht;
    case "left":
      return At(e, n, ht) && n.x < o.left - ht;
    case "right":
      return At(e, n, ht) && n.x > o.right + ht;
  }
}
c(Jn, "leavesOutward");
function Zn(t, e, n) {
  if (t.length < 3) return t;
  if (n) {
    const r = qn(t[0], t[1], e);
    return r && Jn(r, t[1], t[2], e) ? t.slice(1) : t;
  }
  const o = t.length - 1,
    s = qn(t[o - 1], t[o], e);
  return s && Jn(s, t[o - 1], t[o - 2], e) ? t.slice(0, o) : t;
}
c(Zn, "collapseOwnBorderStub");
function nr(t, e, n) {
  let o = t;
  if (e) {
    const r = xn(o, 0, 1);
    if (r) {
      const d = Vn(r, o[0], e);
      d !== o[0] && (o = [d, ...o.slice(1)]);
    }
    o = Zn(o, e, !0);
  }
  if (n) {
    const r = o.length - 1,
      d = xn(o, r, -1);
    if (d) {
      const l = Vn(d, o[r], n, !0);
      l !== o[r] && (o = [...o.slice(0, r), l]);
    }
    o = Zn(o, n, !1);
  }
  const s = Eo(o, e, n);
  return s !== o || o.length === 2 ? s : (e && (o = Kn(o, e, !0)), n && (o = Kn(o, n, !1)), o);
}
c(nr, "snapAndCollapseEndpoints");
function Qn(t, e) {
  for (const n of t) {
    const o = To(n, e, 2);
    if (!o) continue;
    const s = Ot(o.points, ht),
      r = nr(s, o.srcRect, o.dstRect);
    if (r.length < 3) {
      o.edge.points = r;
      continue;
    }
    const d = [r[0], { ...r[0] }, ...r.slice(1, -1), r[r.length - 1], { ...r[r.length - 1] }];
    o.edge.points = d;
  }
}
c(Qn, "prepareEdgeEndpointsForRenderer");
function Ao(t) {
  return new Map(t.map((e) => [e.id, e]));
}
c(Ao, "buildNodeMap");
function or(t, e) {
  let n = t.parentId,
    o = null;
  for (; n;) {
    const s = e.get(n);
    if (!(s != null && s.isGroup)) break;
    ((o = s.id), (n = s.parentId));
  }
  return o;
}
c(or, "resolveTopLevelGroupId");
function to(t, e) {
  let n = 0,
    o = t.parentId;
  for (; o;) {
    const s = e.get(o);
    if (!(s != null && s.isGroup)) break;
    (n++, (o = s.parentId));
  }
  return n;
}
c(to, "groupDepth");
function Ro(t) {
  var r, d;
  let e = 1 / 0,
    n = -1 / 0,
    o = 1 / 0,
    s = -1 / 0;
  for (const l of t) {
    const p = l.x,
      y = l.y;
    if (typeof p != "number" || typeof y != "number") continue;
    const f = (r = l.width) != null ? r : 0,
      g = (d = l.height) != null ? d : 0;
    ((e = Math.min(e, p - f / 2)),
      (n = Math.max(n, p + f / 2)),
      (o = Math.min(o, y - g / 2)),
      (s = Math.max(s, y + g / 2)));
  }
  return e === 1 / 0 || o === 1 / 0 ? null : { minX: e, maxX: n, minY: o, maxY: s };
}
c(Ro, "boundsForChildren");
function sr(t, e) {
  var o;
  const n = (o = t.padding) != null ? o : 20;
  ((t.x = (e.minX + e.maxX) / 2),
    (t.y = (e.minY + e.maxY) / 2),
    (t.width = Math.max(0, e.maxX - e.minX) + n),
    (t.height = Math.max(0, e.maxY - e.minY) + n));
}
c(sr, "applyGroupBounds");
function rr(t) {
  const e = Ao(t),
    n = t.filter((o) => o.isGroup && o.parentId).sort((o, s) => to(s, e) - to(o, e));
  for (const o of n) {
    const s = t.filter((d) => d.parentId === o.id),
      r = Ro(s);
    r && sr(o, r);
  }
}
c(rr, "recomputeNestedGroupBounds");
function In(t, e) {
  var p, y, f;
  const n = (p = t.nodes) != null ? p : [],
    o = (y = t.edges) != null ? y : [],
    s = n.filter((g) => !g.isGroup);
  let r = 1 / 0,
    d = -1 / 0;
  for (const g of s) {
    const M = g[e];
    typeof M == "number" && ((r = Math.min(r, M)), (d = Math.max(d, M)));
  }
  if (!Number.isFinite(r) || !Number.isFinite(d)) return !1;
  const l = c((g) => r + d - g, "mirror");
  for (const g of n) {
    const M = g[e];
    typeof M == "number" && (g[e] = l(M));
    const i = g.groupTitleRect;
    i &&
      (g.groupTitleRect =
        e === "x" ? { ...i, left: l(i.right), right: l(i.left) } : { ...i, top: l(i.bottom), bottom: l(i.top) });
  }
  for (const g of o) for (const M of (f = g.points) != null ? f : []) M[e] = l(M[e]);
  return !0;
}
c(In, "mirrorAxis");
function ir(t) {
  var n;
  return ((n = t.nodes) != null ? n : []).some((o) => !o.isGroup) ? In(t, "y") : !0;
}
c(ir, "applyBtDirectionTransform");
function cr(t, e = "LR") {
  var D, J, at, gt, mt, St, bt, Pt, kt, Xt, ft;
  const n = (D = t.nodes) != null ? D : [],
    o = (J = t.edges) != null ? J : [],
    s = n.filter((W) => !W.isGroup);
  let r = 1 / 0,
    d = 1 / 0;
  for (const W of s) {
    const K = (at = W.x) != null ? at : 0,
      V = (gt = W.y) != null ? gt : 0;
    (K < r && (r = K), V < d && (d = V));
  }
  if (!Number.isFinite(r) || !Number.isFinite(d)) return !1;
  const l = 36;
  let p = 0,
    y = 0;
  for (const W of s) ((p += (mt = W.width) != null ? mt : 0), (y += (St = W.height) != null ? St : 0));
  const f = p / s.length,
    g = y / s.length,
    M = g > 0 ? Math.max(1, f / g) : 1;
  for (const W of s) {
    const K = (bt = W.x) != null ? bt : 0,
      G = (((Pt = W.y) != null ? Pt : 0) - d) * M + l,
      tt = K - r;
    ((W.x = G), (W.y = tt));
  }
  for (const W of o)
    if (W.points)
      for (const K of W.points) {
        const V = K.x,
          tt = (K.y - d) * M + l,
          et = V - r;
        ((K.x = tt), (K.y = et));
      }
  rr(n);
  const i = n.filter((W) => W.isGroup && !W.parentId);
  if (i.length === 0) return (e === "RL" && In(t, "x"), !0);
  const u = Ao(n),
    h = new Map();
  for (const W of n) {
    if (W.isGroup) continue;
    const K = or(W, u);
    if (!K) continue;
    const V = (kt = h.get(K)) != null ? kt : [];
    (V.push(W), h.set(K, V));
  }
  let x = 0;
  for (const W of i) {
    const K = (Xt = W.padding) != null ? Xt : 0;
    K > x && (x = K);
  }
  const I = [];
  let v = 1 / 0,
    E = -1 / 0;
  for (const W of i) {
    const K = (ft = h.get(W.id)) != null ? ft : [],
      V = Ro(K);
    V &&
      ((v = Math.min(v, V.minX)),
      (E = Math.max(E, V.maxX)),
      I.push({ lane: W, contentTop: V.minY, contentBottom: V.maxY, centerY: (V.minY + V.maxY) / 2 }));
  }
  if (v === 1 / 0 || E === -1 / 0) return !0;
  const C = Math.max(0, E - v),
    a = Math.max(x, 10),
    m = C + 2 * a,
    S = l + m,
    O = (v + E) / 2 - m / 2 - l,
    R = O + S / 2,
    k = Math.max(x, l);
  I.sort((W, K) => W.centerY - K.centerY);
  for (let W = 0; W < I.length; W++) {
    const K = I[W];
    let V, G;
    if ((W === 0 ? (V = K.contentTop - k) : (V = (I[W - 1].contentBottom + K.contentTop) / 2), W === I.length - 1))
      G = K.contentBottom + k;
    else {
      const nt = I[W + 1];
      G = (K.contentBottom + nt.contentTop) / 2;
    }
    const tt = Math.max(0, G - V),
      et = (V + G) / 2;
    ((K.lane.x = R),
      (K.lane.y = et),
      (K.lane.width = S),
      (K.lane.height = tt),
      (K.lane.swimlaneContentTop = K.contentTop),
      (K.lane.groupTitleRect = { left: O, right: O + l, top: V, bottom: G }));
  }
  return (e === "RL" && In(t, "x"), !0);
}
c(cr, "applyLrDirectionTransform");
var Me = 1e-6,
  Ci = 8,
  Bn = Ci,
  vi = [0, Bn, -8, 2 * Bn, -2 * Bn];
function ar(t, e) {
  const { nodeInfoById: n, realNodeRects: o } = Ln(e);
  for (const s of t) {
    if (s.isLayoutOnly) continue;
    const r = s.points;
    if (!r || r.length < 4) continue;
    const d = Io(Ot(r, Me), Me);
    if (!d) continue;
    const { p3: l } = d,
      p = d.kind === "HVH",
      y = Lo(s, n, Me);
    if (!y) continue;
    const { srcId: f, dstId: g, srcInfo: M, dstInfo: i, collinearX: u, collinearY: h } = y;
    if (u || h) continue;
    let x;
    const I = M.rect;
    for (const v of vi) {
      let E, C, a;
      if (p) {
        const R = i.cy > M.cy ? I.bottom : I.top,
          k = M.cx + v;
        if (k <= I.left + Me || k >= I.right - Me) continue;
        ((E = { x: k, y: R }), (C = { x: k, y: l.y }), (a = { x: l.x, y: l.y }));
      } else {
        const R = i.cx > M.cx ? I.right : I.left,
          k = M.cy + v;
        if (k <= I.top + Me || k >= I.bottom - Me) continue;
        ((E = { x: R, y: k }), (C = { x: l.x, y: k }), (a = { x: l.x, y: l.y }));
      }
      const m = xe(E, C, Me),
        S = xe(C, a, Me);
      if ((m && S) || (!m && Kt(E, C, o, [f], 1)) || (!S && Kt(C, a, o, [g], 1))) continue;
      const w = !m && yn(E, C, t, s, { epsilon: Me, skipDegenerateOther: !0 }),
        L = !S && yn(C, a, t, s, { epsilon: Me, skipDegenerateOther: !0 });
      if (!(w || L)) {
        m ? (x = [C, a]) : S ? (x = [E, C]) : (x = [E, C, a]);
        break;
      }
    }
    x && (s.points = x);
  }
}
c(ar, "portSwapToLShape");
function lr(t, e) {
  var l, p, y, f;
  const { realNodeRects: r, labelNodeRects: d } = Ne(e.values());
  for (const g of t) {
    if (g.isLayoutOnly) continue;
    const M = g.points;
    if (!M || M.length < 4) continue;
    const i = Ot(M, 0.001);
    if (i.length < 4) continue;
    const u = i.length - 1,
      h = i[u],
      x = i[u - 1],
      I = i[u - 2],
      v = h.x - x.x,
      E = h.y - x.y,
      C = Math.hypot(v, E);
    if (C >= 10 || C < 0.001) continue;
    const a = x.x - I.x,
      m = x.y - I.y;
    if (Math.hypot(a, m) < 0.001) continue;
    const w = jt(x, h, 0.001),
      L = Ut(x, h, 0.001),
      O = jt(I, x, 0.001),
      R = Ut(I, x, 0.001);
    if (!((w && R) || (L && O))) continue;
    const k = g.end,
      D = g.start,
      J = k ? e.get(k) : void 0;
    if (!J) continue;
    const at = (l = J.x) != null ? l : 0,
      gt = (p = J.y) != null ? p : 0,
      mt = ge(J);
    if (!mt) continue;
    let St, bt;
    if (R) {
      const V = m < 0;
      ((St = { x: at, y: I.y }), (bt = { x: at, y: V ? mt.bottom : mt.top }));
    } else {
      const V = a > 0;
      ((St = { x: I.x, y: gt }), (bt = { x: V ? mt.right : mt.left, y: gt }));
    }
    if (Kt(St, bt, r, k ? [k] : [], -2) || Kt(St, bt, d, [], -2)) continue;
    if (D) {
      const V = e.get(D),
        G = V ? ge(V) : void 0;
      if (G && So(St, G, 2)) continue;
    }
    const Pt = c((V, G) => `${V.x.toFixed(3)},${V.y.toFixed(3)}|${G.x.toFixed(3)},${G.y.toFixed(3)}`, "ownSegmentKey"),
      kt = new Set();
    for (let V = 0; V < i.length - 1; V++) kt.add(Pt(i[V], i[V + 1]));
    const Xt = c((V, G) => {
      for (const tt of t) {
        if (tt === g || tt.isLayoutOnly) continue;
        const et = tt.points;
        if (!(!et || et.length < 2))
          for (let nt = 0; nt < et.length - 1; nt++) {
            const yt = et[nt],
              Lt = et[nt + 1];
            if (!kt.has(Pt(yt, Lt)) && Le(V, G, yt, Lt, 0.001)) return !0;
          }
      }
      return !1;
    }, "segmentCrossesOtherEdge");
    if (Xt(St, bt)) continue;
    if (u - 3 >= 0) {
      const V = i[u - 3],
        G = [D, k].filter((tt) => !!tt);
      if (Kt(V, St, r, G, -2) || Xt(V, St)) continue;
    }
    const W = [...i.slice(0, u - 2), St, bt];
    g.points = W;
    const K = g.labelNodeId;
    if (K) {
      const V = e.get(K);
      if (V) {
        const G = (y = V.width) != null ? y : 0,
          tt = (f = V.height) != null ? f : 0;
        if (G > 0 && tt > 0) {
          let et,
            nt,
            yt = -1;
          for (let Lt = 0; Lt < W.length - 1; Lt++) {
            const Ft = W[Lt],
              Wt = W[Lt + 1],
              oe = Math.hypot(Wt.x - Ft.x, Wt.y - Ft.y),
              be = At(Ft, Wt, 0.001),
              Pe = Tt(Ft, Wt, 0.001);
            ((be && oe >= G + 2) || (Pe && oe >= tt + 2)) &&
              oe > yt &&
              ((yt = oe), (et = (Ft.x + Wt.x) / 2), (nt = (Ft.y + Wt.y) / 2));
          }
          et !== void 0 && nt !== void 0 && ((V.x = et), (V.y = nt));
        }
      }
    }
  }
}
c(lr, "collapseShortTerminalStub");
var rt = 0.001,
  ee = 8,
  Mt = We,
  kn = c((t, e) => Tt(t, e, rt) || At(t, e, rt), "orthogonallyAligned");
function fr(t, e) {
  const s = c((i, u) => {
      var a, m, S, w;
      const h = (a = i.x) != null ? a : 0,
        x = (m = i.y) != null ? m : 0,
        I = u.x - h,
        v = u.y - x;
      let E = ((S = i.width) != null ? S : 0) / 2,
        C = ((w = i.height) != null ? w : 0) / 2;
      return Math.abs(v) * E > Math.abs(I) * C
        ? (v < 0 && (C = -C), { x: h + (v === 0 ? 0 : (C * I) / v), y: x + C })
        : (I < 0 && (E = -E), { x: h + E, y: x + (I === 0 ? 0 : (E * v) / I) });
    }, "rectIntersect"),
    r = c((i, u) => {
      var S, w, L;
      const h = Ot((S = i.points) != null ? S : []);
      if (h.length < 2) return;
      const x = u ? i.start : i.end,
        I = x ? e.get(x) : void 0,
        v = I ? ge(I) : void 0;
      if (!I || !x || !v) return;
      const E = u ? h[0] : h[h.length - 1],
        C = u ? h[1] : h[h.length - 2],
        a = s(I, E);
      let m = E;
      if ((kn(C, a) && (m = C), Tt(a, m, rt)))
        return {
          edge: i,
          edgeId: String((w = i.id) != null ? w : ""),
          nodeId: x,
          atStart: u,
          orientation: "V",
          coord: a.x,
          min: Math.min(a.y, m.y),
          max: Math.max(a.y, m.y),
          boundary: a,
          railEnd: m,
          rect: v,
        };
      if (At(a, m, rt))
        return {
          edge: i,
          edgeId: String((L = i.id) != null ? L : ""),
          nodeId: x,
          atStart: u,
          orientation: "H",
          coord: a.y,
          min: Math.min(a.x, m.x),
          max: Math.max(a.x, m.x),
          boundary: a,
          railEnd: m,
          rect: v,
        };
    }, "terminalLaneFor"),
    d = c((i, u) => Math.max(0, Math.min(i.max, u.max) - Math.max(i.min, u.min)), "projectedOverlapLength"),
    l = c(
      (i, u) =>
        i.nodeId !== u.nodeId || i.orientation !== u.orientation
          ? !1
          : i.orientation === "H"
            ? (Math.abs(i.boundary.x - i.rect.left) < 1 || Math.abs(i.boundary.x - i.rect.right) < 1) &&
              Tt(i.boundary, u.boundary, 1)
            : (Math.abs(i.boundary.y - i.rect.top) < 1 || Math.abs(i.boundary.y - i.rect.bottom) < 1) &&
              At(i.boundary, u.boundary, 1),
      "sameTerminalFace",
    ),
    p = c(
      (i, u) =>
        i.nodeId !== u.nodeId || i.orientation !== u.orientation
          ? !1
          : d(i, u) >= ee && Math.abs(i.coord - u.coord) < 0.5,
      "exactTerminalLaneConflict",
    ),
    y = c((i, u) => {
      if (i.nodeId !== u.nodeId || i.orientation !== u.orientation || i.orientation !== "H" || i.atStart === u.atStart)
        return !1;
      const h = d(i, u);
      if (h < ee) return !1;
      const x = i.rect.bottom - i.rect.top;
      return h < x || h > 2 * x ? !1 : l(i, u) && Math.abs(i.coord - u.coord) < 16;
    }, "nearTerminalLaneConflict"),
    f = c((i, u) => {
      var m;
      const h = Ot((m = i.edge.points) != null ? m : []);
      if (h.length < 2) return;
      const x =
          i.orientation === "V" ? { x: i.boundary.x + u, y: i.boundary.y } : { x: i.boundary.x, y: i.boundary.y + u },
        I = i.orientation === "V" ? { x: i.railEnd.x + u, y: i.railEnd.y } : { x: i.railEnd.x, y: i.railEnd.y + u };
      if (
        !c(
          () =>
            Math.abs(i.boundary.y - i.rect.top) < 1 || Math.abs(i.boundary.y - i.rect.bottom) < 1
              ? At(x, i.boundary, rt) && x.x >= i.rect.left + 1 && x.x <= i.rect.right - 1
              : Math.abs(i.boundary.x - i.rect.left) < 1 || Math.abs(i.boundary.x - i.rect.right) < 1
                ? Tt(x, i.boundary, rt) && x.y >= i.rect.top + 1 && x.y <= i.rect.bottom - 1
                : !1,
          "boundaryStaysOnSameFace",
        )()
      )
        return;
      if (i.atStart) {
        const S = h.length > 1 && xe(h[1], i.railEnd, rt),
          w = h.slice(S ? 2 : 1),
          L = w[0];
        return L && !kn(L, I) ? void 0 : [x, I, ...w];
      }
      const E = h.length > 1 && xe(h[h.length - 2], i.railEnd, rt),
        C = h.slice(0, E ? -2 : -1),
        a = C[C.length - 1];
      if (!(a && !kn(a, I))) return [...C, I, x];
    }, "shiftedCandidate"),
    g = c((i) => {
      var O, R, k, D, J;
      const u = i.edge,
        h = Ot((O = u.points) != null ? O : []);
      if (h.length !== 2) return !1;
      const x = u.start,
        I = u.end,
        v = x ? e.get(x) : void 0,
        E = I ? e.get(I) : void 0;
      if (!v || !E) return !1;
      const C = (R = v.x) != null ? R : 0,
        a = (k = v.y) != null ? k : 0,
        m = (D = E.x) != null ? D : 0,
        S = (J = E.y) != null ? J : 0,
        [w, L] = h;
      return (
        (At(w, L, rt) && Math.abs(a - S) < 1 && Math.abs(C - m) > 1) ||
        (Tt(w, L, rt) && Math.abs(C - m) < 1 && Math.abs(a - S) > 1)
      );
    }, "laneIsStraightCollinearConnector"),
    M = [-7, 7, -2 * 7, 2 * 7, -3 * 7, 3 * 7];
  for (let i = 0; i < 8; i++) {
    const u = t
      .filter((x) => !x.isLayoutOnly)
      .flatMap((x) => [r(x, !0), r(x, !1)])
      .filter((x) => !!x);
    let h = !1;
    for (let x = 0; x < u.length && !h; x++)
      for (let I = x + 1; I < u.length && !h; I++) {
        const v = u[x],
          E = u[I];
        if (v.edge === E.edge || !(p(v, E) || y(v, E))) continue;
        const C = !p(v, E),
          a = [v, E].sort((m, S) => {
            const w = g(m),
              L = g(S);
            return w !== L ? Number(w) - Number(L) : +!S.atStart - +!m.atStart;
          });
        for (const m of a) {
          for (const S of M) {
            const w = f(m, S);
            if (!w) continue;
            const L = r({ ...m.edge, points: w }, m.atStart);
            if (!(!L || u.some((O) => O.edge !== m.edge && (p(L, O) || (C && y(L, O)))))) {
              ((m.edge.points = w), (h = !0));
              break;
            }
          }
          if (h) break;
        }
      }
    if (!h) return;
  }
}
c(fr, "separateSharedRenderedTerminalLanes");
function dr(t, e) {
  var l;
  const { realNodeRects: o, labelNodeRects: s } = Ne(e.values()),
    r = c((p, y) => {
      const f = p.start,
        g = p.end,
        M = Mt(y);
      if (M.length !== y.length - 1) return !1;
      const i = [f, g].filter((u) => !!u);
      for (const u of M) if (Kt(u.a, u.b, o, i, -2) || Kt(u.a, u.b, s, [], -2)) return !1;
      for (const u of t) {
        if (u === p || u.isLayoutOnly) continue;
        const h = u.points;
        if (!(!h || h.length < 2)) {
          for (const x of M)
            for (const I of Mt(Ot(h))) if (Ce(x, I, 0.5) >= ee || Le(x.a, x.b, I.a, I.b, rt)) return !1;
        }
      }
      return !0;
    }, "candidateIsSafe"),
    d = c((p, y) => {
      if (y + 4 >= p.length) return;
      const f = p[y],
        g = p[y + 1],
        M = p[y + 2],
        i = p[y + 3],
        u = p[y + 4],
        h =
          jt(f, g) &&
          Ut(g, M) &&
          jt(M, i) &&
          Ut(i, u) &&
          Tt(f, i, rt) &&
          Tt(f, u, rt) &&
          Tt(g, M, rt) &&
          (g.x - f.x) * (i.x - M.x) < 0,
        x =
          Ut(f, g) &&
          jt(g, M) &&
          Ut(M, i) &&
          jt(i, u) &&
          At(f, i, rt) &&
          At(f, u, rt) &&
          At(g, M, rt) &&
          (g.y - f.y) * (i.y - M.y) < 0;
      if (h || x) return Ot([...p.slice(0, y + 1), u, ...p.slice(y + 5)]);
      if (y + 5 >= p.length) return;
      const I = p[y + 5],
        v =
          Ut(f, g) &&
          jt(g, M) &&
          Ut(M, i) &&
          jt(i, u) &&
          Ut(u, I) &&
          Tt(f, u, rt) &&
          Tt(f, I, rt) &&
          Tt(M, i, rt) &&
          (M.x - g.x) * (u.x - i.x) < 0,
        E =
          jt(f, g) &&
          Ut(g, M) &&
          jt(M, i) &&
          Ut(i, u) &&
          jt(u, I) &&
          At(f, u, rt) &&
          At(f, I, rt) &&
          At(M, i, rt) &&
          (M.y - g.y) * (u.y - i.y) < 0;
      if (!(!v && !E)) return Ot([...p.slice(0, y + 1), I, ...p.slice(y + 6)]);
    }, "withoutDogleg");
  for (let p = 0; p < 8; p++) {
    let y = !1;
    for (const f of t) {
      if (f.isLayoutOnly) continue;
      const g = Ot((l = f.points) != null ? l : []);
      for (let M = 0; M <= g.length - 5; M++) {
        const i = d(g, M);
        if (!(!i || !r(f, i))) {
          ((f.points = i), (y = !0));
          break;
        }
      }
      if (y) break;
    }
    if (!y) return;
  }
}
c(dr, "collapseRedundantRectangularDoglegs");
function eo(t, e) {
  const { realNodeRects: r, labelNodeRects: d } = Ne(e.values()),
    l = t.filter((u) => !u.isLayoutOnly),
    p = c((u, h, x) => {
      var I;
      return Ot(u === h ? (x != null ? x : []) : (I = u.points) != null ? I : []);
    }, "pointsFor"),
    y = c((u, h) => {
      let x = 0;
      for (let I = 0; I < l.length; I++) {
        const v = Mt(p(l[I], u, h));
        for (let E = I + 1; E < l.length; E++) {
          const C = Mt(p(l[E], u, h));
          for (const a of v) for (const m of C) Le(a.a, a.b, m.a, m.b, rt) && x++;
        }
      }
      return x;
    }, "strictCrossingCount"),
    f = c((u) => {
      const h = Mt(u);
      if (h.length !== 3) return;
      const x = h[1];
      if (!(h[0].horizontal === x.horizontal || h[2].horizontal === x.horizontal))
        return { index: x.index, horizontal: x.horizontal, vertical: x.vertical, segment: x };
    }, "middleRail"),
    g = c((u, h) => {
      const x = [u.start, u.end].filter((I) => !!I);
      return r.filter((I) => {
        if (x.includes(I.id)) return !1;
        const v = I.rect;
        return h.horizontal
          ? de(h.a.x, h.b.x, v.left, v.right) >= ee && h.a.y >= v.top - 2 && h.a.y <= v.bottom + 2
          : de(h.a.y, h.b.y, v.top, v.bottom) >= ee && h.a.x >= v.left - 2 && h.a.x <= v.right + 2;
      });
    }, "blockingRectsFor"),
    M = c((u, h, x) => {
      const I = u.map((E) => ({ ...E }));
      if (h.horizontal) ((I[h.index].y = x), (I[h.index + 1].y = x));
      else if (h.vertical) ((I[h.index].x = x), (I[h.index + 1].x = x));
      else return;
      const v = ve(Ot(I));
      return Mt(v).length === v.length - 1 ? v : void 0;
    }, "candidateByMovingRail"),
    i = c((u, h, x) => {
      const I = [u.start, u.end].filter((E) => !!E),
        v = Mt(h);
      if (v.length !== h.length - 1) return !1;
      for (const E of v) if (Kt(E.a, E.b, r, I, -2) || Kt(E.a, E.b, d, [], -2)) return !1;
      for (const E of l)
        if (E !== u) {
          for (const C of v) for (const a of Mt(p(E))) if (Ce(C, a, 0.5) >= ee) return !1;
        }
      return y(u, h) <= x;
    }, "candidateIsSafe");
  for (let u = 0; u < 8; u++) {
    const h = y();
    let x = !1;
    for (const I of l) {
      const v = p(I),
        E = f(v);
      if (!E) continue;
      const C = g(I, E.segment);
      if (C.length === 0) continue;
      const a = E.horizontal
        ? [Math.min(...C.map((m) => m.rect.top)) - 20, Math.max(...C.map((m) => m.rect.bottom)) + 20]
        : [Math.min(...C.map((m) => m.rect.left)) - 20, Math.max(...C.map((m) => m.rect.right)) + 20];
      for (const m of a) {
        const S = M(v, E.segment, m);
        if (!(!S || !i(I, S, h))) {
          ((I.points = S), (x = !0));
          break;
        }
      }
      if (x) break;
    }
    if (!x) return;
  }
}
c(eo, "liftObstacleHuggingSameSideRails");
function no(t, e) {
  var p;
  const o = c((y) => {
      const f = y.groupTitleRect;
      if (!(
        !f ||
        typeof f.left != "number" ||
        typeof f.right != "number" ||
        typeof f.top != "number" ||
        typeof f.bottom != "number" ||
        !Number.isFinite(f.left) ||
        !Number.isFinite(f.right) ||
        !Number.isFinite(f.top) ||
        !Number.isFinite(f.bottom) ||
        f.right <= f.left ||
        f.bottom <= f.top
      ))
        return { left: f.left, right: f.right, top: f.top, bottom: f.bottom };
    }, "validTitleRect"),
    s = c((y) => {
      if (!y.isGroup || y.parentId) return;
      const f = y.direction,
        g = typeof f == "string" ? f.toUpperCase() : "";
      if (g === "LR" || g === "RL" || g === "BT") return;
      const M = o(y),
        i = y.y,
        u = y.height;
      if (!M || typeof i != "number" || typeof u != "number" || !Number.isFinite(i) || !Number.isFinite(u) || u <= 0)
        return;
      const h = M.right - M.left,
        x = M.bottom - M.top;
      if (!(x <= 0 || h < x)) return { node: y, rect: M };
    }, "topLaneTitleFor"),
    r = c((y, f) => {
      if (!y.horizontal) return !1;
      const g = y.a.y;
      return g <= f.top + rt || g >= f.bottom - rt ? !1 : de(y.a.x, y.b.x, f.left, f.right) >= ee;
    }, "horizontalSegmentIntersectsTitle"),
    d = [...e.values()].map(s).filter((y) => !!y);
  if (d.length === 0) return;
  let l = 0;
  for (const y of t) {
    if (y.isLayoutOnly) continue;
    const f = Ot((p = y.points) != null ? p : []);
    for (const g of Mt(f)) for (const M of d) r(g, M.rect) && (l = Math.max(l, M.rect.bottom - g.a.y + 4));
  }
  if (!(l <= rt))
    for (const y of d) {
      const f = y.node.y,
        g = y.node.height;
      typeof f != "number" ||
        typeof g != "number" ||
        !Number.isFinite(f) ||
        !Number.isFinite(g) ||
        g <= 0 ||
        ((y.node.y = f - l / 2),
        (y.node.height = g + l),
        (y.node.groupTitleRect = { ...y.rect, top: y.rect.top - l, bottom: y.rect.bottom - l }));
    }
}
c(no, "liftTopLaneTitleBandsAboveRails");
function oo(t, e) {
  var y;
  const o = c((f) => {
      const g = f.groupTitleRect;
      if (!(
        !g ||
        typeof g.left != "number" ||
        typeof g.right != "number" ||
        typeof g.top != "number" ||
        typeof g.bottom != "number" ||
        !Number.isFinite(g.left) ||
        !Number.isFinite(g.right) ||
        !Number.isFinite(g.top) ||
        !Number.isFinite(g.bottom) ||
        g.right <= g.left ||
        g.bottom <= g.top
      ))
        return { left: g.left, right: g.right, top: g.top, bottom: g.bottom };
    }, "validTitleRect"),
    s = c((f) => {
      if (!f.isGroup || f.parentId || f.direction !== "LR") return;
      const M = o(f),
        i = f.x,
        u = f.width;
      if (!M || typeof i != "number" || typeof u != "number" || !Number.isFinite(i) || !Number.isFinite(u) || u <= 0)
        return;
      const h = M.right - M.left,
        x = M.bottom - M.top;
      if (!(h <= 0 || x < h)) return { node: f, rect: M };
    }, "leftLaneTitleFor"),
    r = c((f, g) => {
      if (!f.vertical) return !1;
      const M = f.a.x;
      return M <= g.left + rt || M >= g.right - rt ? !1 : de(f.a.y, f.b.y, g.top, g.bottom) >= ee;
    }, "verticalSegmentIntersectsTitle"),
    d = c((f, g) => {
      if (!f.horizontal) return !1;
      const M = f.a.y;
      return M <= g.top + rt || M >= g.bottom - rt ? !1 : de(f.a.x, f.b.x, g.left, g.right) >= ee;
    }, "horizontalSegmentIntersectsTitle"),
    l = [...e.values()].map(s).filter((f) => !!f);
  if (l.length === 0) return;
  let p = 0;
  for (const f of t) {
    if (f.isLayoutOnly) continue;
    const g = Ot((y = f.points) != null ? y : []);
    for (const M of Mt(g))
      for (const i of l)
        if (r(M, i.rect)) p = Math.max(p, i.rect.right - M.a.x + 4);
        else if (d(M, i.rect)) {
          const u = Math.min(M.a.x, M.b.x);
          p = Math.max(p, i.rect.right - u + 4);
        }
  }
  if (!(p <= rt))
    for (const f of l) {
      const g = f.node.x,
        M = f.node.width;
      typeof g != "number" ||
        typeof M != "number" ||
        !Number.isFinite(g) ||
        !Number.isFinite(M) ||
        M <= 0 ||
        ((f.node.x = g - p / 2),
        (f.node.width = M + p),
        (f.node.groupTitleRect = { ...f.rect, left: f.rect.left - p, right: f.rect.right - p }));
    }
}
c(oo, "shiftLeftLaneTitleBandsLeftOfRails");
function ur(t, e) {
  const { realNodeRects: o } = Ne(e.values()),
    s = t.filter((u) => !u.isLayoutOnly),
    r = c((u, h = new Map()) => {
      var x, I;
      return Ot((I = (x = h.get(u)) != null ? x : u.points) != null ? I : []);
    }, "replacementPointsFor"),
    d = c((u = new Map()) => {
      let h = 0;
      for (let x = 0; x < s.length; x++) {
        const I = Mt(r(s[x], u));
        for (let v = x + 1; v < s.length; v++) {
          const E = Mt(r(s[v], u));
          for (const C of I) for (const a of E) Le(C.a, C.b, a.a, a.b, rt) && h++;
        }
      }
      return h;
    }, "crossingCount"),
    l = c((u = new Map()) => s.reduce((h, x) => h + ye(r(x, u)), 0), "totalBends"),
    p = c((u) => {
      const h = r(u);
      if (h.length < 4) return;
      const x = h[h.length - 2],
        I = h[h.length - 1];
      if (!(!jt(x, I, rt) && !Ut(x, I, rt))) return { tailStart: x, terminal: I };
    }, "terminalTailFor"),
    y = c((u, h) => {
      const x = r(u);
      if (x.length < 3) return;
      const I = x[0],
        v = x[1];
      let E;
      if (jt(I, v, rt)) E = { x: v.x, y: h.tailStart.y };
      else if (Ut(I, v, rt)) E = { x: h.tailStart.x, y: v.y };
      else return;
      const C = ve(Ot([I, v, E, h.tailStart, h.terminal]));
      return Mt(C).length === C.length - 1 ? C : void 0;
    }, "candidateWithDestinationTail"),
    f = c((u, h) => {
      const x = [u.start, u.end].filter((I) => !!I);
      for (const I of Mt(h)) if (Kt(I.a, I.b, o, x, -2)) return !0;
      return !1;
    }, "pathHasNodeHit"),
    g = c((u, h, x) => {
      for (const I of s)
        if (I !== u) {
          for (const v of Mt(h)) for (const E of Mt(r(I, x))) if (Ce(v, E, 0.5) >= ee) return !0;
        }
      return !1;
    }, "pathHasSharedTrack"),
    M = c((u, h, x) => !f(u, h) && !g(u, h, x), "candidateIsSafe"),
    i = c(() => {
      var h;
      const u = new Map();
      for (const x of s) {
        const I = x.end;
        if (!I || !e.has(I) || r(x).length < 4) continue;
        const E = (h = u.get(I)) != null ? h : [];
        (E.push(x), u.set(I, E));
      }
      return u;
    }, "edgesByDestination");
  for (let u = 0; u < 4; u++) {
    const h = d();
    if (h === 0) return;
    const x = l();
    let I,
      v = h,
      E = x;
    for (const C of i().values())
      for (let a = 0; a < C.length; a++)
        for (let m = a + 1; m < C.length; m++) {
          const S = C[a],
            w = C[m],
            L = p(S),
            O = p(w);
          if (!L || !O) continue;
          const R = y(S, O),
            k = y(w, L);
          if (!R || !k) continue;
          const D = new Map([
            [S, R],
            [w, k],
          ]);
          if (!M(S, R, D) || !M(w, k, D)) continue;
          const J = d(D),
            at = l(D);
          J >= h || J > v || (J === v && at >= E) || ((I = D), (v = J), (E = at));
        }
    if (!I) return;
    for (const [C, a] of I) C.points = a;
  }
}
c(ur, "swapDestinationTerminalTailsToReduceCrossings");
function hr(t, e) {
  const { realNodeRects: r, labelNodeRects: d } = Ne(e.values()),
    l = t.filter((C) => !C.isLayoutOnly),
    p = c((C, a = new Map()) => {
      var m, S;
      return Ot((S = (m = a.get(C)) != null ? m : C.points) != null ? S : []);
    }, "replacementPointsFor"),
    y = c((C = new Map()) => {
      let a = 0;
      for (let m = 0; m < l.length; m++) {
        const S = Mt(p(l[m], C));
        for (let w = m + 1; w < l.length; w++) {
          const L = Mt(p(l[w], C));
          for (const O of S) for (const R of L) Le(O.a, O.b, R.a, R.b, rt) && a++;
        }
      }
      return a;
    }, "strictCrossingCount"),
    f = c((C = new Map()) => l.reduce((a, m) => a + ye(p(m, C)), 0), "totalBends"),
    g = c((C) => {
      const a = C.start,
        m = C.end,
        S = a ? e.get(a) : void 0,
        w = m ? e.get(m) : void 0,
        L = S ? ge(S) : void 0,
        O = w ? ge(w) : void 0;
      return L && O ? { src: L, dst: O } : void 0;
    }, "endpointRectsFor"),
    M = c((C, a, m) => {
      if (m.index <= 0 || m.index + 1 >= a.length - 1) return;
      const S = g(C);
      if (S) {
        if (m.vertical) {
          const w = m.a.x,
            L = Math.min(S.src.left, S.dst.left),
            O = Math.max(S.src.right, S.dst.right),
            R = w < L - rt ? "left" : w > O + rt ? "right" : void 0;
          return R
            ? {
                edge: C,
                points: a,
                segmentIndex: m.index,
                axis: "vertical",
                side: R,
                coord: w,
                min: Math.min(m.a.y, m.b.y),
                max: Math.max(m.a.y, m.b.y),
              }
            : void 0;
        }
        if (m.horizontal) {
          const w = m.a.y,
            L = Math.min(S.src.top, S.dst.top),
            O = Math.max(S.src.bottom, S.dst.bottom),
            R = w < L - rt ? "top" : w > O + rt ? "bottom" : void 0;
          return R
            ? {
                edge: C,
                points: a,
                segmentIndex: m.index,
                axis: "horizontal",
                side: R,
                coord: w,
                min: Math.min(m.a.x, m.b.x),
                max: Math.max(m.a.x, m.b.x),
              }
            : void 0;
        }
      }
    }, "externalRailForSegment"),
    i = c(() => {
      const C = [];
      for (const a of l) {
        const m = p(a);
        for (const S of Mt(m)) {
          const w = M(a, m, S);
          w && C.push(w);
        }
      }
      return C;
    }, "collectExternalRails"),
    u = c(
      (C, a) => C.edge !== a.edge && C.axis === a.axis && C.side === a.side && de(C.min, C.max, a.min, a.max) >= ee,
      "railsInteract",
    ),
    h = c((C) => {
      const a = [],
        m = new Set();
      for (const S of C) {
        if (m.has(S)) continue;
        const w = [S],
          L = [];
        for (m.add(S); w.length > 0;) {
          const O = w.pop();
          L.push(O);
          for (const R of C) !m.has(R) && u(O, R) && (m.add(R), w.push(R));
        }
        L.length > 1 && a.push(L);
      }
      return a;
    }, "connectedComponents"),
    x = c((C) => {
      const a = [];
      for (const m of C) a.some((S) => Math.abs(S - m.coord) < rt) || a.push(m.coord);
      for (; a.length < C.length;) {
        const m = Math.min(...a),
          S = Math.max(...a),
          w = C[0].side;
        a.push(w === "left" || w === "top" ? m - 12 * (C.length - a.length) : S + 12 * (C.length - a.length));
      }
      return a;
    }, "uniqueCoordsFor"),
    I = c((C) => {
      const a = C.map((w) => w.coord),
        m = x(C),
        S = [];
      if (C.length <= 6) {
        const w = new Array(m.length).fill(!1),
          L = [],
          O = c(() => {
            if (L.length === C.length) {
              L.some((R, k) => Math.abs(R - a[k]) >= rt) && S.push([...L]);
              return;
            }
            for (const [R, k] of m.entries()) w[R] || ((w[R] = !0), L.push(k), O(), L.pop(), (w[R] = !1));
          }, "visit");
        return (O(), S);
      }
      for (let w = 0; w < a.length; w++)
        for (let L = w + 1; L < a.length; L++) {
          const O = [...a];
          (([O[w], O[L]] = [O[L], O[w]]), S.push(O));
        }
      return S;
    }, "coordinateAssignmentsFor"),
    v = c((C, a) => {
      var w;
      const m = new Map();
      for (const [L, O] of C.entries()) {
        const R = a[L],
          k = (w = m.get(O.edge)) != null ? w : O.points.map((D) => ({ x: D.x, y: D.y }));
        (O.axis === "vertical"
          ? ((k[O.segmentIndex].x = R), (k[O.segmentIndex + 1].x = R))
          : ((k[O.segmentIndex].y = R), (k[O.segmentIndex + 1].y = R)),
          m.set(O.edge, k));
      }
      const S = new Map();
      for (const [L, O] of m) {
        const R = ve(Ot(O));
        if (Mt(R).length !== R.length - 1) return;
        S.set(L, R);
      }
      return S;
    }, "replacementsForAssignment"),
    E = c((C) => {
      for (const [a, m] of C) {
        const S = [a.start, a.end].filter((w) => !!w);
        for (const w of Mt(m)) if (Kt(w.a, w.b, r, S, -2) || Kt(w.a, w.b, d, [], -2)) return !1;
      }
      for (let a = 0; a < l.length; a++) {
        const m = l[a],
          S = C.has(m),
          w = Mt(p(m, C));
        for (let L = a + 1; L < l.length; L++) {
          const O = l[L];
          if (!S && !C.has(O)) continue;
          const R = Mt(p(O, C));
          for (const k of w) for (const D of R) if (Ce(k, D, 0.5) >= ee) return !1;
        }
      }
      return !0;
    }, "candidateIsSafe");
  for (let C = 0; C < 4; C++) {
    const a = y();
    if (a === 0) return;
    let m,
      S = a,
      w = f(),
      L = Number.POSITIVE_INFINITY;
    for (const O of h(i()))
      for (const R of I(O)) {
        const k = v(O, R);
        if (!k || !E(k)) continue;
        const D = y(k);
        if (D >= a) continue;
        const J = f(k),
          at = O.reduce((gt, mt, St) => gt + Math.abs(R[St] - mt.coord), 0);
        D > S || (D === S && (J > w || (J === w && at >= L))) || ((m = k), (S = D), (w = J), (L = at));
      }
    if (!m) return;
    for (const [O, R] of m) O.points = R;
  }
}
c(hr, "reassignCrossingExternalRailChannels");
function gr(t, e) {
  const { realNodeRects: o, labelNodeRects: s } = Ne(e.values()),
    r = t.filter((i) => !i.isLayoutOnly),
    d = c((i, u, h) => {
      var x;
      return Ot(i === u ? (h != null ? h : []) : (x = i.points) != null ? x : []);
    }, "pointsFor"),
    l = c(
      (i) =>
        Mt(i).reduce((u, h) => {
          const x = h.a.x - h.b.x,
            I = h.a.y - h.b.y;
          return u + Math.hypot(x, I);
        }, 0),
      "pathLength",
    ),
    p = c((i, u) => {
      let h = 0;
      for (let x = 0; x < r.length; x++) {
        const I = Mt(d(r[x], i, u));
        for (let v = x + 1; v < r.length; v++) {
          const E = Mt(d(r[v], i, u));
          for (const C of I) for (const a of E) Le(C.a, C.b, a.a, a.b, rt) && h++;
        }
      }
      return h;
    }, "strictCrossingCount"),
    y = c((i, u) => {
      if (i.horizontal) {
        const h = i.a.y;
        return (Math.abs(h - u.top) < 1 || Math.abs(h - u.bottom) < 1) && de(i.a.x, i.b.x, u.left, u.right) >= ee;
      }
      if (i.vertical) {
        const h = i.a.x;
        return (Math.abs(h - u.left) < 1 || Math.abs(h - u.right) < 1) && de(i.a.y, i.b.y, u.top, u.bottom) >= ee;
      }
      return !1;
    }, "segmentRunsAlongRectBorder"),
    f = c((i) => {
      const u = [i.start, i.end].filter((x) => !!x),
        h = [];
      for (const x of u) {
        const I = e.get(x),
          v = I ? ge(I) : void 0;
        v && h.push(v);
      }
      return h;
    }, "endpointRectsFor"),
    g = c((i, u) => {
      if (u + 3 >= i.length) return [];
      const h = i[u],
        x = i[u + 1],
        I = i[u + 2],
        v = i[u + 3],
        E = jt(h, x, rt) && Ut(x, I, rt) && jt(I, v, rt),
        C = Ut(h, x, rt) && jt(x, I, rt) && Ut(I, v, rt);
      if (!E && !C) return [];
      if (!(E ? Math.sign(x.x - h.x) !== Math.sign(v.x - I.x) : Math.sign(x.y - h.y) !== Math.sign(v.y - I.y)))
        return [];
      const m =
          Tt(h, v, rt) || At(h, v, rt)
            ? []
            : [
                { x: h.x, y: v.y },
                { x: v.x, y: h.y },
              ],
        S =
          m.length === 0
            ? [[...i.slice(0, u + 1), ...i.slice(u + 3)]]
            : m.map((L) => [...i.slice(0, u + 1), L, ...i.slice(u + 3)]),
        w = new Set();
      return S.map((L) => ve(Ot(L))).filter((L) => {
        if (Mt(L).length !== L.length - 1 || !L.some((R) => xe(R, v, rt))) return !1;
        const O = L.map((R) => `${R.x.toFixed(3)},${R.y.toFixed(3)}`).join("|");
        return w.has(O) ? !1 : (w.add(O), !0);
      });
    }, "shortcutCandidatesAt"),
    M = c((i, u, h) => {
      const x = [i.start, i.end].filter((v) => !!v),
        I = f(i);
      for (const v of Mt(u)) if (Kt(v.a, v.b, o, x, -2) || Kt(v.a, v.b, s, [], -2) || I.some((E) => y(v, E))) return !1;
      for (const v of r)
        if (v !== i) {
          for (const E of Mt(u)) for (const C of Mt(d(v))) if (Ce(E, C, 0.5) >= ee) return !1;
        }
      return p(i, u) <= h;
    }, "candidateIsSafe");
  for (let i = 0; i < 8; i++) {
    const u = p();
    let h,
      x,
      I = u,
      v = Number.POSITIVE_INFINITY,
      E = Number.POSITIVE_INFINITY;
    for (const C of r) {
      const a = d(C),
        m = ye(a, rt),
        S = l(a);
      for (let w = 0; w <= a.length - 4; w++)
        for (const L of g(a, w)) {
          const O = ye(L, rt),
            R = l(L);
          if (!(O < m || (O === m && R < S - rt)) || !M(C, L, u)) continue;
          const D = p(C, L);
          D > I || (D === I && (O > v || (O === v && R >= E))) || ((h = C), (x = L), (I = D), (v = O), (E = R));
        }
    }
    if (!h || !x) return;
    h.points = x;
  }
}
c(gr, "shortcutRedundantOrthogonalJogs");
function mr(t, e) {
  var De, tn, qe;
  const d = [];
  for (const N of e.values()) {
    if (N.isGroup || N.isEdgeLabel) continue;
    const F = (De = N.x) != null ? De : 0,
      _ = (tn = N.y) != null ? tn : 0,
      $ = ge(N);
    $ && d.push({ id: String((qe = N.id) != null ? qe : ""), cx: F, cy: _, rect: $ });
  }
  if (d.length === 0) return;
  const l = new Map(d.map((N) => [N.id, N])),
    p = d.map((N) => ({ id: N.id, rect: N.rect })),
    y = ["top", "bottom", "left", "right"],
    f = {
      top: Math.min(...d.map((N) => N.rect.top)) - 20,
      bottom: Math.max(...d.map((N) => N.rect.bottom)) + 20,
      left: Math.min(...d.map((N) => N.rect.left)) - 20,
      right: Math.max(...d.map((N) => N.rect.right)) + 20,
    },
    g = t.filter((N) => !N.isLayoutOnly),
    M = new Map(g.map((N, F) => [N, F])),
    i = c((N) => {
      const F = N === "left" || N === "top" ? -1 : 1,
        _ = [];
      for (let $ = 0; $ <= 2; $++) _.push(f[N] + F * 20 * $);
      return _;
    }, "outwardTracksForSide"),
    u = c((N, F = new Map()) => {
      var _, $;
      return Ot(($ = (_ = F.get(N)) != null ? _ : N.points) != null ? $ : []);
    }, "replacementPointsFor"),
    h = c((N, F) => {
      let _ = 0;
      for (const $ of N) for (const q of F) Le($.a, $.b, q.a, q.b, rt) && _++;
      return _;
    }, "crossingCountBetweenSegments"),
    x = c((N, F) => h(Mt(N), Mt(F)), "crossingCountBetweenPaths"),
    I = c((N = new Map()) => {
      let F = 0;
      const _ = [],
        $ = new Set(),
        q = [],
        ot = c((z) => {
          $.has(z) || ($.add(z), q.push(z));
        }, "addEdge");
      for (let z = 0; z < g.length; z++) {
        const Z = g[z],
          it = u(Z, N);
        for (let ct = z + 1; ct < g.length; ct++) {
          const Rt = g[ct],
            Bt = x(it, u(Rt, N));
          Bt > 0 && ((F += Bt), _.push({ first: Z, second: Rt, count: Bt }), ot(Z), ot(Rt));
        }
      }
      return (
        q.sort((z, Z) => {
          var it, ct;
          return ((it = M.get(z)) != null ? it : 0) - ((ct = M.get(Z)) != null ? ct : 0);
        }),
        { count: F, pairs: _, edgeSet: $, edges: q }
      );
    }, "crossingSnapshot"),
    v = c((N, F) => {
      const _ = new Set(F.keys());
      if (_.size === 0) return N.count;
      let $ = 0;
      for (const ot of N.pairs) (_.has(ot.first) || _.has(ot.second)) && ($ += ot.count);
      let q = 0;
      for (let ot = 0; ot < g.length; ot++) {
        const z = g[ot],
          Z = _.has(z),
          it = u(z, F);
        for (let ct = ot + 1; ct < g.length; ct++) {
          const Rt = g[ct];
          (!Z && !_.has(Rt)) || (q += x(it, u(Rt, F)));
        }
      }
      return N.count - $ + q;
    }, "crossingCountWithReplacements"),
    E = c((N) => {
      var q, ot, z;
      const F = new Map();
      for (const Z of N.pairs) {
        const it = (q = F.get(Z.first)) != null ? q : new Set();
        (it.add(Z.second), F.set(Z.first, it));
        const ct = (ot = F.get(Z.second)) != null ? ot : new Set();
        (ct.add(Z.first), F.set(Z.second, ct));
      }
      const _ = [],
        $ = new Set();
      for (const Z of N.edges) {
        if ($.has(Z)) continue;
        const it = [Z],
          ct = [];
        for ($.add(Z); it.length > 0;) {
          const Rt = it.pop();
          ct.push(Rt);
          for (const Bt of (z = F.get(Rt)) != null ? z : []) $.has(Bt) || ($.add(Bt), it.push(Bt));
        }
        (ct.sort((Rt, Bt) => {
          var ae, Zt;
          return ((ae = M.get(Rt)) != null ? ae : 0) - ((Zt = M.get(Bt)) != null ? Zt : 0);
        }),
          ct.length > 1 && _.push(ct));
      }
      return _;
    }, "crossingComponents"),
    C = c((N) => [N.start, N.end].filter((F) => !!F), "endpointIdsFor"),
    a = c((N) => {
      const F = [];
      for (const _ of E(N)) {
        const $ = new Set(_),
          q = new Set(_.flatMap((z) => C(z))),
          ot = [..._];
        for (const z of g) $.has(z) || (C(z).some((Z) => q.has(Z)) && ot.push(z));
        (ot.sort((z, Z) => {
          var it, ct;
          return ((it = M.get(z)) != null ? it : 0) - ((ct = M.get(Z)) != null ? ct : 0);
        }),
          F.push(ot));
      }
      return F;
    }, "pairSearchGroups"),
    m = c((N, F, _) => v(N, new Map([[F, _]])), "crossingCountWithSingleReplacement"),
    S = c((N) => {
      var _, $;
      const F = new Map();
      for (const q of N.pairs)
        (F.set(q.first, ((_ = F.get(q.first)) != null ? _ : 0) + q.count),
          F.set(q.second, (($ = F.get(q.second)) != null ? $ : 0) + q.count));
      return F;
    }, "currentCrossingsByEdge"),
    w = c(
      (N) =>
        N.slice(1).reduce((F, _, $) => {
          const q = N[$];
          return F + Math.abs(_.x - q.x) + Math.abs(_.y - q.y);
        }, 0),
      "pathLength",
    ),
    L = c((N = new Map()) => g.reduce((F, _) => F + ye(u(_, N)), 0), "totalBends"),
    O = c((N = new Map()) => g.reduce((F, _) => F + w(u(_, N)), 0), "totalLength"),
    R = c((N, F, _ = new Map()) => {
      const $ = Mt(F);
      for (const q of g)
        if (q !== N) {
          for (const ot of $) for (const z of Mt(u(q, _))) if (Ce(ot, z, 0.5) >= ee) return !0;
        }
      return !1;
    }, "pathHasSegmentConflict"),
    k = c((N, F) => {
      const _ = [N.start, N.end].filter(($) => !!$);
      for (const $ of Mt(F)) if (Kt($.a, $.b, p, _, -2)) return !0;
      return !1;
    }, "pathHitsNode"),
    D = c((N, F) => {
      const _ = ve(Ot(F));
      Mt(_).length === _.length - 1 && N.push(_);
    }, "pushOrthogonalCandidate"),
    J = c((N) => N === "left" || N === "right", "sideIsHorizontal"),
    at = c((N, F, _) => {
      switch (F) {
        case "left":
          return Math.min(N.x, _.x) - 20;
        case "right":
          return Math.max(N.x, _.x) + 20;
        case "top":
          return Math.min(N.y, _.y) - 20;
        case "bottom":
          return Math.max(N.y, _.y) + 20;
      }
    }, "localTrackForSameSide"),
    gt = c((N, F, _, $) => {
      const q = _ === "left" || _ === "top" ? -1 : 1,
        ot = [at(F, _, $), f[_]];
      for (const z of ot) for (let Z = 0; Z <= 2; Z++) D(N, vo(F, _, $, z + q * 20 * Z));
    }, "addSameSideCandidates"),
    mt = c((N, F, _, $, q) => {
      for (const ot of i(_)) for (const z of i(q)) D(N, [F, { x: ot, y: F.y }, { x: ot, y: z }, { x: $.x, y: z }, $]);
    }, "addHorizontalToVerticalCandidates"),
    St = c((N, F, _, $, q) => {
      for (const ot of i(_)) for (const z of i(q)) D(N, [F, { x: F.x, y: ot }, { x: z, y: ot }, { x: z, y: $.y }, $]);
    }, "addVerticalToHorizontalCandidates"),
    bt = c((N, F, _, $, q) => {
      const ot = [...i("top"), ...i("bottom")];
      for (const z of i(_))
        for (const Z of i(q))
          for (const it of ot) D(N, [F, { x: z, y: F.y }, { x: z, y: it }, { x: Z, y: it }, { x: Z, y: $.y }, $]);
    }, "addHorizontalPairCandidates"),
    Pt = c((N, F, _, $, q) => {
      const ot = [...i("left"), ...i("right")];
      for (const z of i(_))
        for (const Z of i(q))
          for (const it of ot) D(N, [F, { x: F.x, y: z }, { x: it, y: z }, { x: it, y: Z }, { x: $.x, y: Z }, $]);
    }, "addVerticalPairCandidates"),
    kt = c((N) => {
      const F = new Set();
      return N.map((_) => Ot(_)).filter((_) => {
        const $ = _.map((q) => `${q.x.toFixed(3)},${q.y.toFixed(3)}`).join("|");
        return F.has($) || _.length < 2 ? !1 : (F.add($), !0);
      });
    }, "dedupeCandidatePaths"),
    Xt = c((N, F, _, $) => {
      const q = [],
        ot = Co(N, F, _, $, 20, rt);
      (ot && D(q, ot), F === $ && gt(q, N, F, _));
      const z = J(F),
        Z = J($);
      return (
        z && !Z ? mt(q, N, F, _, $) : !z && Z ? St(q, N, F, _, $) : z ? bt(q, N, F, _, $) : Pt(q, N, F, _, $),
        kt(q)
      );
    }, "buildCandidatesForSides"),
    ft = c((N, F, _, $) => {
      const q = [...i("left"), ...i("right")],
        ot = [...i("top"), ...i("bottom")];
      for (const z of y) {
        const Z = _e($, z),
          it = z === "top" || z === "bottom" ? i(z) : ot;
        for (const ct of q) {
          D(N, [F, _, { x: ct, y: _.y }, { x: ct, y: Z.y }, Z]);
          for (const Rt of it) D(N, [F, _, { x: ct, y: _.y }, { x: ct, y: Rt }, { x: Z.x, y: Rt }, Z]);
        }
      }
    }, "addVerticalDepartureOuterTrackCandidates"),
    W = c((N, F, _, $) => {
      const q = [...i("left"), ...i("right")],
        ot = [...i("top"), ...i("bottom")];
      for (const z of y) {
        const Z = _e($, z),
          it = z === "left" || z === "right" ? i(z) : q;
        for (const ct of ot) {
          D(N, [F, _, { x: _.x, y: ct }, { x: Z.x, y: ct }, Z]);
          for (const Rt of it) D(N, [F, _, { x: _.x, y: ct }, { x: Rt, y: ct }, { x: Rt, y: Z.y }, Z]);
        }
      }
    }, "addHorizontalDepartureOuterTrackCandidates"),
    K = c((N) => {
      var it;
      const F = N.start,
        _ = N.end,
        $ = _ ? l.get(_) : void 0;
      if (!F || !$) return [];
      const q = Ot((it = N.points) != null ? it : []);
      if (q.length < 4) return [];
      const ot = q[0],
        z = q[1],
        Z = [];
      return (Ut(ot, z, rt) ? ft(Z, ot, z, $) : jt(ot, z, rt) && W(Z, ot, z, $), Z);
    }, "terminalPreservingOuterTrackCandidates"),
    V = c((N) => {
      const F = N.start,
        _ = N.end,
        $ = F ? l.get(F) : void 0,
        q = _ ? l.get(_) : void 0;
      if (!$ || !q) return [];
      const ot = [];
      for (const z of y) {
        const Z = _e($, z);
        for (const it of y) ot.push(...Xt(Z, z, _e(q, it), it));
      }
      return (ot.push(...K(N)), ot);
    }, "candidatePathsFor"),
    G = c(() => new Map(g.map((N) => [N, Mt(u(N))])), "currentSegmentsByEdge"),
    tt = c((N, F, _) => {
      var q;
      const $ = new Set();
      for (const ot of g) {
        if (ot === N) continue;
        const z = (q = _.get(ot)) != null ? q : Mt(u(ot));
        F.some((Z) => z.some((it) => Ce(Z, it, 0.5) >= ee)) && $.add(ot);
      }
      return $;
    }, "sharedTrackConflictsFor"),
    et = c((N, F, _, $) => {
      const q = new Set();
      return V(N)
        .map((z) => ve(Ot(z)))
        .filter((z) => {
          if (k(N, z)) return !1;
          const Z = z.map((it) => `${it.x.toFixed(3)},${it.y.toFixed(3)}`).join("|");
          return q.has(Z) || z.length < 2 ? !1 : (q.add(Z), !0);
        })
        .map((z) => {
          var ct, Rt;
          const Z = Mt(z);
          let it = 0;
          for (const Bt of g) Bt !== N && (it += h(Z, (ct = _.get(Bt)) != null ? ct : Mt(u(Bt))));
          return {
            candidate: z,
            candidateSegments: Z,
            crossings: F.count - ((Rt = $.get(N)) != null ? Rt : 0) + it,
            bends: ye(z, rt),
            totalBends: ye(z),
            length: w(z),
          };
        })
        .filter(({ crossings: z }) => z <= F.count)
        .sort((z, Z) => z.crossings - Z.crossings || z.bends - Z.bends || z.length - Z.length)
        .slice(0, 48)
        .map((z) => ({
          path: z.candidate,
          segments: z.candidateSegments,
          sharedTrackConflicts: tt(N, z.candidateSegments, _),
          totalBends: z.totalBends,
          length: z.length,
        }));
    }, "pairCandidatesFor"),
    nt = c((N, F, _, $, q, ot) => {
      var it;
      let z = 0;
      for (const ct of N.pairs)
        (ct.first === F || ct.second === F || ct.first === $ || ct.second === $) && (z += ct.count);
      let Z = h(_.segments, q.segments);
      for (const ct of g) {
        if (ct === F || ct === $) continue;
        const Rt = (it = ot.get(ct)) != null ? it : Mt(u(ct));
        Z += h(_.segments, Rt) + h(q.segments, Rt);
      }
      return N.count - z + Z;
    }, "pairCrossingCount"),
    yt = c((N, F) => {
      for (const _ of N.sharedTrackConflicts) if (_ !== F) return !1;
      return !0;
    }, "conflictsOnlyWith"),
    Lt = c((N, F) => N.segments.some((_) => F.segments.some(($) => Ce(_, $, 0.5) >= ee)), "candidatesShareTrack"),
    Ft = c((N, F, _, $) => yt(F, _.edge) && yt($, N.edge) && !Lt(F, $), "pairCandidatesAreCompatible"),
    Wt = c((N, F, _, $, q) => {
      var z, Z, it, ct;
      const ot = nt(N.current, F.edge, _, $.edge, q, N.baseSegments);
      if (!(ot >= N.current.count))
        return {
          replacements: new Map([
            [F.edge, _.path],
            [$.edge, q.path],
          ]),
          crossings: ot,
          bends:
            N.currentBends -
            ((z = N.baseBendsByEdge.get(F.edge)) != null ? z : 0) -
            ((Z = N.baseBendsByEdge.get($.edge)) != null ? Z : 0) +
            _.totalBends +
            q.totalBends,
          length:
            N.currentLength -
            ((it = N.baseLengthByEdge.get(F.edge)) != null ? it : 0) -
            ((ct = N.baseLengthByEdge.get($.edge)) != null ? ct : 0) +
            _.length +
            q.length,
        };
    }, "scorePairReplacement"),
    oe = c(
      (N, F) =>
        N.crossings < F.crossings ||
        (N.crossings === F.crossings && (N.bends < F.bends || (N.bends === F.bends && N.length < F.length))),
      "pairScoreIsBetter",
    ),
    be = c((N, F, _, $) => {
      let q = $;
      for (const ot of F.candidates)
        for (const z of _.candidates) {
          if (!Ft(F, ot, _, z)) continue;
          const Z = Wt(N, F, ot, _, z);
          Z && oe(Z, q) && (q = Z);
        }
      return q;
    }, "bestScoreForOptionPair"),
    Pe = c((N) => {
      const F = L(),
        _ = O(),
        $ = G(),
        q = S(N),
        ot = new Map(g.map((Bt) => [Bt, ye(u(Bt))])),
        z = new Map(g.map((Bt) => [Bt, w(u(Bt))])),
        Z = new Map(),
        it = a(N);
      for (const Bt of it)
        for (const ae of Bt) {
          if (Z.has(ae)) continue;
          const Zt = et(ae, N, $, q);
          Zt.length > 0 && Z.set(ae, { edge: ae, candidates: Zt });
        }
      let ct = { replacements: new Map(), crossings: N.count, bends: F, length: _ };
      const Rt = {
        current: N,
        currentBends: F,
        currentLength: _,
        baseBendsByEdge: ot,
        baseLengthByEdge: z,
        baseSegments: $,
      };
      for (const Bt of it) {
        const ae = new Set(Bt.filter((se) => N.edgeSet.has(se))),
          Zt = Bt.map((se) => Z.get(se)).filter((se) => !!se);
        for (let se = 0; se < Zt.length; se++) {
          const He = Zt[se];
          for (let Xe = se + 1; Xe < Zt.length; Xe++) {
            const Je = Zt[Xe];
            (!ae.has(He.edge) && !ae.has(Je.edge)) || (ct = be(Rt, He, Je, ct));
          }
        }
      }
      return ct.replacements.size > 0 ? ct.replacements : void 0;
    }, "bestPairedReplacement");
  for (let N = 0; N < 4; N++) {
    const F = I(),
      _ = F.count;
    if (_ === 0) return;
    let $,
      q,
      ot = _,
      z = Number.POSITIVE_INFINITY;
    for (const it of F.edges) {
      const ct = ye(u(it), rt);
      for (const Rt of V(it)) {
        const Bt = k(it, Rt),
          ae = !Bt && R(it, Rt),
          Zt = m(F, it, Rt),
          se = ye(Rt, rt);
        Bt ||
          ae ||
          !(Zt < _ || (Zt === _ && se < ct)) ||
          Zt > ot ||
          (Zt === ot && se >= z) ||
          (($ = it), (q = Rt), (ot = Zt), (z = se));
      }
    }
    if ($ && q) {
      $.points = q;
      continue;
    }
    const Z = Pe(F);
    if (!Z) return;
    for (const [it, ct] of Z) it.points = ct;
  }
}
c(mr, "resolveRenderedOrthogonalCrossings");
var Re = 0.001,
  Li = 8;
function yr(t, e) {
  var h, x, I;
  const { nodeInfoById: n, realNodeRects: o } = Ln(e),
    s = ["top", "bottom", "left", "right"],
    r = 20,
    d = {
      top: Math.min(...o.map((v) => v.rect.top)) - r,
      bottom: Math.max(...o.map((v) => v.rect.bottom)) + r,
      left: Math.min(...o.map((v) => v.rect.left)) - r,
      right: Math.max(...o.map((v) => v.rect.right)) + r,
    },
    l = c((v, E, C, a) => {
      const m = [],
        S = Co(v, E, C, a, r, Re);
      return (S && m.push(S), E === a && m.push(vo(v, E, C, d[E])), m);
    }, "buildOrthogonalPathCandidates"),
    p = c((v, E) => {
      for (let C = 0; C < v.length - 1; C++) {
        const a = v[C],
          m = v[C + 1];
        if (Kt(a, m, o, E, 1)) return !0;
      }
      return !1;
    }, "pathHitsNode"),
    y = c((v, E, C = !1) => {
      let a = 0;
      const m = We(v, Re),
        S = E.start,
        w = E.end;
      for (const L of t) {
        if (L === E || L.isLayoutOnly) continue;
        const O = L.start,
          R = L.end;
        if (!C && S && w && (O === S || O === w || R === S || R === w)) continue;
        const k = L.points;
        if (!(!k || k.length < 2))
          for (const D of m)
            for (const J of We(k, Re)) {
              if (wo(D.a, D.b, J.a, J.b, Re, Re)) {
                a++;
                continue;
              }
              Ce(D, J, Re) >= Li && a++;
            }
      }
      return a;
    }, "pathConflictCount"),
    f = 4,
    g = c((v, E) => {
      const C = Math.abs(v.y - E.rect.top),
        a = Math.abs(v.y - E.rect.bottom),
        m = Math.abs(v.x - E.rect.left),
        S = Math.abs(v.x - E.rect.right);
      let w = "top",
        L = C;
      return (
        a < L && ((w = "bottom"), (L = a)),
        m < L && ((w = "left"), (L = m)),
        S < L && ((w = "right"), (L = S)),
        w
      );
    }, "nearestSideOfRect"),
    M = new Map(),
    i = c((v, E, C) => {
      var m;
      const a = (m = M.get(v)) != null ? m : [];
      (a.push({ side: E, edgeId: C }), M.set(v, a));
    }, "addFaceClaim");
  for (const v of t) {
    if (v.isLayoutOnly) continue;
    const E = (h = v.points) != null ? h : [];
    if (E.length < 1) continue;
    const C = (x = v.id) != null ? x : "",
      a = v.start,
      m = v.end;
    if (a) {
      const S = n.get(a);
      S && i(a, g(E[0], S), C);
    }
    if (m) {
      const S = n.get(m);
      S && i(m, g(E[E.length - 1], S), C);
    }
  }
  const u = c((v, E, C) => {
    var a, m;
    return (m = (a = M.get(v)) == null ? void 0 : a.some((S) => S.edgeId !== C && S.side === E)) != null ? m : !1;
  }, "faceIsClaimed");
  for (const v of t) {
    if (v.isLayoutOnly) continue;
    const E = v.points;
    if (!E || E.length < 2) continue;
    const C = ye(E, Re);
    if (C < f) continue;
    const a = v.start,
      m = v.end;
    if (!a || !m) continue;
    const S = n.get(a),
      w = n.get(m);
    if (!S || !w) continue;
    const L = (I = v.id) != null ? I : "",
      O = y(E, v, !0),
      R = y(E, v);
    let k,
      D = O,
      J = C;
    for (const at of s) {
      if (u(a, at, L)) continue;
      const gt = _e(S, at);
      for (const mt of s) {
        if (u(m, mt, L)) continue;
        const St = _e(w, mt);
        for (const bt of l(gt, at, St, mt)) {
          if (p(bt, [a, m])) continue;
          const Pt = ye(bt, Re);
          if (O > 0) {
            const kt = y(bt, v, !0);
            if (kt > D || (kt === D && Pt >= J)) continue;
            ((D = kt), (J = Pt), (k = bt));
            continue;
          }
          y(bt, v) > R || (Pt < J && ((J = Pt), (k = bt)));
        }
      }
    }
    if (k) {
      v.points = k;
      const at = M.get(a);
      at &&
        M.set(
          a,
          at.filter((mt) => mt.edgeId !== L),
        );
      const gt = M.get(m);
      (gt &&
        M.set(
          m,
          gt.filter((mt) => mt.edgeId !== L),
        ),
        i(a, g(k[0], S), L),
        i(m, g(k[k.length - 1], w), L));
    }
  }
}
c(yr, "simplifyDetouredEdges");
var he = 0.001,
  ws = 10,
  fn = 7;
function so(t, e) {
  const n = e ? 0 : t.length - 1,
    o = e ? 1 : -1,
    s = t[n],
    r = t[n + o];
  if (!s || !r) return;
  const d = r.x - s.x,
    l = r.y - s.y;
  if (!(Math.abs(d) + Math.abs(l) < he)) {
    if (Math.abs(l) <= he) {
      const y = s.x + Math.sign(d) * ws;
      return { left: Math.min(s.x, y), right: Math.max(s.x, y), top: s.y - fn, bottom: s.y + fn };
    }
    if (Math.abs(d) <= he) {
      const y = s.y + Math.sign(l) * ws;
      return { left: s.x - fn, right: s.x + fn, top: Math.min(s.y, y), bottom: Math.max(s.y, y) };
    }
    return { left: Math.min(s.x, r.x), right: Math.max(s.x, r.x), top: Math.min(s.y, r.y), bottom: Math.max(s.y, r.y) };
  }
}
c(so, "markerClearanceRectFor");
function pr(t) {
  return {
    left: Math.min(t.left, t.right),
    right: Math.max(t.left, t.right),
    top: Math.min(t.top, t.bottom),
    bottom: Math.max(t.top, t.bottom),
  };
}
c(pr, "normalizeRect");
function ro(t, e) {
  const n = Ot(e),
    o = so(n, !0),
    s = so(n, !1);
  return [o, s].some((r) => r && mn(t, pr(r)));
}
c(ro, "labelOverlapsOwnMarker");
function un(t, e) {
  var u, h, x, I, v, E;
  const n = [];
  for (const C of t) {
    if (C.isLayoutOnly) continue;
    const a = C.points;
    if (!(!a || a.length < 2)) for (let m = 0; m < a.length - 1; m++) n.push({ edgeId: C.id, p1: a[m], p2: a[m + 1] });
  }
  const o = [],
    s = [];
  for (const C of e.values()) {
    const a = C.isGroup,
      m = C.parentId;
    if (a && !m) {
      const w = ge(C);
      w && s.push({ id: C.id, rect: w });
      continue;
    }
    if (a || C.isEdgeLabel) continue;
    const S = ge(C);
    S && o.push({ nodeId: C.id, rect: S });
  }
  const r = 3,
    d = 1,
    l = 12,
    p = c((C, a) => {
      const m = Gn(a, r);
      for (const { nodeId: S, rect: w } of o) if (S !== C && mn(m, w)) return !0;
      return !1;
    }, "labelOverlapsForeignNode"),
    y = c((C, a) => {
      const m = Gn(a, r);
      for (const S of n) if (S.edgeId !== C && vn(S.p1, S.p2, m)) return !0;
      return !1;
    }, "labelOverlapsForeignEdge"),
    f = c((C, a, m) => p(C, m) || y(a, m), "labelOverlapsAnything"),
    g = [],
    M = c((C) => {
      for (const { id: a, rect: m } of s) if (Vs(m, C)) return a;
    }, "findContainingLane"),
    i = c((C, a) => g.some((m) => m.labelId !== C && mn(a, m.rect)), "overlapsPlacedLabel");
  for (const C of t) {
    if (C.isLayoutOnly) continue;
    const a = C.labelNodeId;
    if (!a) continue;
    const m = e.get(a);
    if (!m) continue;
    const S = C.points;
    if (!S || S.length < 2) continue;
    const w = (u = m.width) != null ? u : 0,
      L = (h = m.height) != null ? h : 0;
    if (w <= 0 || L <= 0) continue;
    const O = [];
    for (let G = 0; G < S.length - 1; G++) {
      const tt = S[G],
        et = S[G + 1],
        nt = Math.abs(tt.x - et.x),
        yt = Math.abs(tt.y - et.y);
      (nt < he && yt < he) ||
        (nt >= he && yt >= he) ||
        O.push({
          idx: G,
          length: nt + yt,
          orientation: nt >= he ? "horizontal" : "vertical",
          midX: (tt.x + et.x) / 2,
          midY: (tt.y + et.y) / 2,
        });
    }
    if (O.length === 0) continue;
    const R = O.length >= 3 ? O.filter((G) => G.idx > 0 && G.idx < O.length - 1) : O,
      k = R.length > 0 ? R : O,
      D = w >= L ? "horizontal" : "vertical",
      J = c(
        (G) =>
          [...G].sort((tt, et) => {
            const nt = tt.orientation === D,
              yt = et.orientation === D;
            if (nt !== yt) return nt ? -1 : 1;
            const Lt = tt.length >= (tt.orientation === "horizontal" ? w : L) + 2,
              Ft = et.length >= (et.orientation === "horizontal" ? w : L) + 2;
            return Lt !== Ft ? (Lt ? -1 : 1) : et.length - tt.length;
          }),
        "rankSegments",
      ),
      at = O[0],
      gt = O[O.length - 1],
      mt = [0.5, 0.25, 0.75, 0.05, 0.95, 0.15, 0.85, 0.1, 0.9],
      St = c((G, tt) => {
        const et = S[G.idx],
          nt = S[G.idx + 1];
        return { midX: et.x + (nt.x - et.x) * tt, midY: et.y + (nt.y - et.y) * tt };
      }, "anchorAtT"),
      bt = c((G, tt, et) => Math.min(et, Math.max(tt, G)), "clamp"),
      Pt = c(
        (G, tt) =>
          G.midX >= tt.left - he && G.midX <= tt.right + he && G.midY >= tt.top - he && G.midY <= tt.bottom + he,
        "pointInsideRectInclusive",
      ),
      kt = c((G) => {
        const tt = Ue(G.midX, G.midY, w, L),
          et = M(tt);
        if (et) return { laneId: et, anchor: G, rect: tt };
        const nt = s.find(({ rect: Pe }) => Pt(G, Pe));
        if (!nt) return;
        const yt = nt.rect.left + w / 2 + d,
          Lt = nt.rect.right - w / 2 - d,
          Ft = nt.rect.top + L / 2 + d,
          Wt = nt.rect.bottom - L / 2 - d;
        if (yt > Lt || Ft > Wt) return;
        const oe = { midX: bt(G.midX, yt, Lt), midY: bt(G.midY, Ft, Wt) },
          be = Ue(oe.midX, oe.midY, w, L);
        return Pt(G, be) ? { laneId: nt.id, anchor: oe, rect: be } : void 0;
      }, "placementForAnchor"),
      Xt = c(
        (G, tt, et) => (G.orientation === "horizontal" ? Math.abs(tt.midX - et.x) : Math.abs(tt.midY - et.y)),
        "distanceAlongSegment",
      ),
      ft = c((G, tt) => {
        const nt = (G.orientation === "horizontal" ? w / 2 : L / 2) + l;
        if (G === at) {
          const yt = S[G.idx];
          if (Xt(G, tt, yt) + he < nt) return !1;
        }
        if (G === gt) {
          const yt = S[G.idx + 1];
          if (Xt(G, tt, yt) + he < nt) return !1;
        }
        return !0;
      }, "labelClearsTerminalEndpoints"),
      W = c((G) => {
        const tt = J(G);
        for (const et of tt)
          for (const nt of mt) {
            const yt = St(et, nt);
            if (!ft(et, yt)) continue;
            const Lt = kt(yt);
            if (Lt && !ro(Lt.rect, S) && !i(a, Lt.rect) && !f(a, C.id, Lt.rect))
              return { laneId: Lt.laneId, anchor: Lt.anchor };
          }
      }, "tryPool"),
      K = c((G, tt, et = !1) => {
        const nt = J(G);
        for (const yt of nt) {
          const Lt = { midX: yt.midX, midY: yt.midY };
          if (tt && !ft(yt, Lt)) continue;
          const Ft = kt(Lt);
          if (Ft && !ro(Ft.rect, S) && !i(a, Ft.rect) && !p(a, Ft.rect) && (et || !y(C.id, Ft.rect)))
            return { laneId: Ft.laneId, anchor: Ft.anchor };
        }
      }, "findLaneContainingFallback"),
      V =
        (E =
          (v = (I = (x = W(k)) != null ? x : k.length < O.length ? W(O) : void 0) != null ? I : K(O, !0)) != null
            ? v
            : K(O, !1)) != null
          ? E
          : K(O, !1, !0);
    if (V) {
      ((m.x = V.anchor.midX), (m.y = V.anchor.midY), (m.parentId = V.laneId));
      const G = Ue(V.anchor.midX, V.anchor.midY, w, L),
        tt = g.findIndex((et) => et.labelId === a);
      tt >= 0 ? (g[tt] = { labelId: a, rect: G }) : g.push({ labelId: a, rect: G });
    }
  }
}
c(un, "anchorLabelsToPolyline");
var Fn = 1e-6,
  wi = 8,
  Ts = wi / 2,
  Ti = 3;
function io(t, e) {
  return t < e ? `${t}::${e}` : `${e}::${t}`;
}
c(io, "pairKey");
function xr(t, e) {
  var d, l;
  const { nodeInfoById: n, realNodeRects: o } = Ln(e),
    s = new Map();
  for (const p of e) {
    const y = p.id;
    if (!p.isGroup && p.isEdgeLabel) {
      s.set(y, { w: (d = p.width) != null ? d : 0, h: (l = p.height) != null ? l : 0 });
      continue;
    }
  }
  const r = c((p, y, f, g) => {
    const M = io(y, f);
    let i = 0;
    const u = c((h) => {
      if (!h) return;
      const x = s.get(h);
      if (!x) return;
      const I = g === "x" ? x.w / 2 : x.h / 2;
      I > i && (i = I);
    }, "consider");
    u(p.labelNodeId);
    for (const h of t) {
      if (h === p || h.isLayoutOnly) continue;
      const x = h.start,
        I = h.end;
      !x || !I || (io(x, I) === M && u(h.labelNodeId));
    }
    return i > 0 ? i + Ti : 0;
  }, "labelClearanceFor");
  for (const p of t) {
    if (p.isLayoutOnly) continue;
    const y = p.points;
    if (!Io(y, Fn)) continue;
    const f = Lo(p, n, Fn);
    if (!f) continue;
    const { srcId: g, dstId: M, srcInfo: i, dstInfo: u, collinearX: h, collinearY: x } = f;
    if (h === x) continue;
    let I, v;
    if (h) {
      const S = u.cy > i.cy;
      ((I = { x: i.cx, y: S ? i.rect.bottom : i.rect.top }), (v = { x: u.cx, y: S ? u.rect.top : u.rect.bottom }));
    } else {
      const S = u.cx > i.cx;
      ((I = { x: S ? i.rect.right : i.rect.left, y: i.cy }), (v = { x: S ? u.rect.left : u.rect.right, y: u.cy }));
    }
    if (Kt(I, v, o, [g, M], 1)) continue;
    const C = r(p, g, M, h ? "x" : "y"),
      a = C > Ts ? C : Ts,
      m = [0, a, -a];
    for (const S of m) {
      const w = { ...I },
        L = { ...v };
      if (h) {
        if (
          ((w.x += S),
          (L.x += S),
          w.x <= i.rect.left || w.x >= i.rect.right || L.x <= u.rect.left || L.x >= u.rect.right)
        )
          continue;
      } else if (
        ((w.y += S), (L.y += S), w.y <= i.rect.top || w.y >= i.rect.bottom || L.y <= u.rect.top || L.y >= u.rect.bottom)
      )
        continue;
      if (!Kt(w, L, o, [g, M], 1) && !yn(w, L, t, p, { epsilon: Fn })) {
        p.points = [w, L];
        break;
      }
    }
  }
}
c(xr, "straightenCollinearSiblingDetours");
function co(t, e) {
  const { realNodeRects: p, labelNodeRects: y } = Ne(e.values()),
    f = c(
      (a, m) => We(m, 0.001).map((S) => ({ ...S, edge: a, interior: S.index >= 1 && S.index <= m.length - 3 })),
      "segmentsFor",
    ),
    g = c(() => {
      const a = [];
      for (const m of t) {
        if (m.isLayoutOnly) continue;
        const S = m.points;
        !S || S.length < 2 || a.push(...f(m, Ot(S)));
      }
      return a;
    }, "allSegments"),
    M = c(
      (a, m) =>
        a.horizontal && m.horizontal
          ? de(a.a.x, a.b.x, m.a.x, m.b.x) >= 8 && Math.abs(a.a.y - m.a.y) < 7
          : a.vertical && m.vertical
            ? de(a.a.y, a.b.y, m.a.y, m.b.y) >= 8 && Math.abs(a.a.x - m.a.x) < 7
            : !1,
      "hasCrowdedParallelTrack",
    ),
    i = c((a, m) => {
      const S = a.start,
        w = a.end,
        L = f(a, m);
      if (L.length !== m.length - 1) return !1;
      const O = [S, w].filter((k) => !!k),
        R = a.labelNodeId ? [a.labelNodeId] : [];
      for (const k of L) if (Kt(k.a, k.b, p, O, -2) || Kt(k.a, k.b, y, R, -2)) return !1;
      for (const k of t) {
        if (k === a || k.isLayoutOnly) continue;
        const D = k.points;
        if (!(!D || D.length < 2)) {
          for (const J of L) for (const at of f(k, Ot(D))) if (M(J, at) || Le(J.a, J.b, at.a, at.b, 0.001)) return !1;
        }
      }
      return !0;
    }, "candidateIsSafe"),
    u = c((a, m) => {
      var L;
      const S = Ot((L = a.edge.points) != null ? L : []);
      if (S.length < 4 || a.index >= S.length - 1) return;
      const w = S.map((O) => ({ ...O }));
      if (a.horizontal) ((w[a.index].y += m), (w[a.index + 1].y += m));
      else if (a.vertical) ((w[a.index].x += m), (w[a.index + 1].x += m));
      else return;
      return f(a.edge, w).length === w.length - 1 ? w : void 0;
    }, "shiftedCandidate"),
    h = c((a, m) => {
      var S, w;
      return { x: (S = a.x) != null ? S : (m.left + m.right) / 2, y: (w = a.y) != null ? w : (m.top + m.bottom) / 2 };
    }, "nodeCenter"),
    x = c((a) => {
      var D;
      const m = a.edge,
        S = Ot((D = m.points) != null ? D : []);
      if (S.length !== 4 || a.index !== 1) return;
      const w = m.start ? e.get(m.start) : void 0,
        L = m.end ? e.get(m.end) : void 0,
        O = w ? ge(w) : void 0,
        R = L ? ge(L) : void 0,
        k = S.slice(a.index + 2);
      if (!(!w || !L || !O || !R || k.length === 0))
        return { sourceCenter: h(w, O), targetCenter: h(L, R), sourceRect: O, tail: k };
    }, "sourceDetourContextFor"),
    I = c((a, m, S, w, L, O) => {
      const R = w.y >= S.y,
        k = R ? L.bottom : L.top,
        D = k + (R ? 20 : -20);
      if ((R && a.b.y <= D + 0.001) || (!R && a.b.y >= D - 0.001)) return;
      const J = a.a.x + m;
      return Ot([{ x: S.x, y: k }, { x: S.x, y: D }, { x: J, y: D }, { x: J, y: a.b.y }, ...O], 0.001);
    }, "verticalSourceDetour"),
    v = c((a, m, S, w, L, O) => {
      const R = w.x >= S.x,
        k = R ? L.right : L.left,
        D = k + (R ? 20 : -20);
      if ((R && a.b.x <= D + 0.001) || (!R && a.b.x >= D - 0.001)) return;
      const J = a.a.y + m;
      return Ot([{ x: k, y: S.y }, { x: D, y: S.y }, { x: D, y: J }, { x: a.b.x, y: J }, ...O], 0.001);
    }, "horizontalSourceDetour"),
    E = c((a, m) => {
      const S = x(a);
      if (S) {
        if (a.vertical) return I(a, m, S.sourceCenter, S.targetCenter, S.sourceRect, S.tail);
        if (a.horizontal) return v(a, m, S.sourceCenter, S.targetCenter, S.sourceRect, S.tail);
      }
    }, "sourceDetourCandidate"),
    C = [-7, 7, -2 * 7, 2 * 7, -3 * 7, 3 * 7];
  for (let a = 0; a < 12; a++) {
    const m = g();
    let S = !1;
    for (let w = 0; w < m.length && !S; w++)
      for (let L = w + 1; L < m.length && !S; L++) {
        const O = m[w],
          R = m[L];
        if (O.edge === R.edge || !M(O, R)) continue;
        const k = [O, R].filter((D) => D.interior);
        for (const D of k) {
          for (const J of C) {
            const at = u(D, J);
            if (at && i(D.edge, at)) {
              ((D.edge.points = at), (S = !0));
              break;
            }
            const gt = E(D, J);
            if (gt && i(D.edge, gt)) {
              ((D.edge.points = gt), (S = !0));
              break;
            }
          }
          if (S) break;
        }
      }
    if (!S) return;
  }
}
c(co, "nudgeSharedInteriorSubpaths");
function br(t, e, n, o) {
  const s = e.x - t.x,
    r = e.y - t.y,
    d = o.x - n.x,
    l = o.y - n.y,
    p = s * l - r * d;
  if (Math.abs(p) < 1e-10) return !1;
  const y = n.x - t.x,
    f = n.y - t.y,
    g = (y * l - f * d) / p,
    M = (y * r - f * s) / p,
    i = 0.01;
  return g > i && g < 1 - i && M > i && M < 1 - i;
}
c(br, "segmentsIntersect");
function Mr(t) {
  var l, p, y;
  const e = (l = t.nodes) != null ? l : [],
    n = (p = t.edges) != null ? p : [],
    o = [];
  if (!n.length || !e.length) return o;
  const s = js(e),
    r = [];
  for (const f of n) {
    if (f.isLayoutOnly) continue;
    const g = f.points;
    if (!g || g.length < 2) continue;
    const M = f.start,
      i = f.end,
      u = f.labelNodeId,
      h = (y = f.id) != null ? y : `${M}->${i}`;
    for (const x of s)
      if (!(x.nodeId === M || x.nodeId === i) && !(u && x.nodeId === u)) {
        for (let I = 0; I < g.length - 1; I++)
          if (vn(g[I], g[I + 1], x, -1)) {
            o.push({
              type: "edge-node-overlap",
              edgeId: h,
              targetId: x.nodeId,
              detail: `segment ${I} passes through node "${x.nodeId}"`,
            });
            break;
          }
      }
    for (let x = 0; x < g.length - 1; x++) r.push({ edgeId: h, start: M, end: i, p1: g[x], p2: g[x + 1] });
  }
  const d = new Set();
  for (let f = 0; f < r.length; f++)
    for (let g = f + 1; g < r.length; g++) {
      const M = r[f],
        i = r[g];
      if (
        M.edgeId !== i.edgeId &&
        !(M.start === i.start || M.start === i.end || M.end === i.start || M.end === i.end) &&
        br(M.p1, M.p2, i.p1, i.p2)
      ) {
        const u = M.edgeId < i.edgeId ? `${M.edgeId}|${i.edgeId}` : `${i.edgeId}|${M.edgeId}`;
        d.has(u) ||
          (d.add(u),
          o.push({
            type: "edge-edge-crossing",
            edgeId: M.edgeId,
            targetId: i.edgeId,
            detail: `edges "${M.edgeId}" and "${i.edgeId}" cross`,
          }));
      }
    }
  if (o.length > 0) {
    const f = o.filter((M) => M.type === "edge-node-overlap").length,
      g = o.filter((M) => M.type === "edge-edge-crossing").length;
    Dn.warn(`[SWIMLANE_VALIDATE] ${o.length} issue(s) detected: ${f} edge-node overlap(s), ${g} edge crossing(s)`);
    for (const M of o) Dn.warn(`[SWIMLANE_VALIDATE]   ${M.type}: ${M.detail}`);
  }
  return o;
}
c(Mr, "validateSwimlanesLayout");
function Ir(t, e) {
  var l, p;
  const n = (l = t.nodes) != null ? l : [],
    o = (p = t.edges) != null ? p : [],
    s = n.filter((y) => !y.isGroup);
  if (((e === "LR" || e === "RL") && s.length > 0 && !cr(t, e)) || (e === "BT" && s.length > 0 && !ir(t))) return;
  for (const y of o) {
    if (y.isLayoutOnly) continue;
    const f = y.points;
    !f || f.length < 2 || (y.points = ve(pn(f)));
  }
  (yr(o, n), xr(o, n), ar(o, n));
  const r = new Map();
  for (const y of n) r.set(String(y.id), y);
  (un(o, r), Js(o, r), lr(o, r), co(o, r), fr(o, r), dr(o, r), eo(o, r), ur(o, r));
  const d = c(() => {
    (mr(o, r), hr(o, r), gr(o, r), un(o, r), Qn(o, r), eo(o, r), un(o, r), Qn(o, r));
  }, "finalizeRenderedEdges");
  (d(), co(o, r), d(), no(o, r), oo(o, r), no(o, r), oo(o, r));
}
c(Ir, "postProcessSwimlaneLayout");
function Oe(t) {
  const e = new Map(t.nodeById),
    n = new Set(),
    o = [];
  for (const r of t.edges) {
    if (!e.has(r.src) || !e.has(r.dst)) continue;
    const d = `${r.id}:${r.src}->${r.dst}`;
    n.has(d) || (n.add(d), o.push(r));
  }
  return { nodes: [...e.keys()], edges: o, layout: t.layout, nodeById: e };
}
c(Oe, "normalizeGraph");
function No(t, e) {
  return t.edges.filter((n) => n.dst === e);
}
c(No, "incoming");
function Sr(t) {
  const e = new Map();
  for (const n of t.nodes) e.set(n, []);
  for (const n of t.edges) e.get(n.src).push(n.dst);
  return e;
}
c(Sr, "buildSuccessorMap");
function Oo(t) {
  const e = Sr(t);
  for (const n of e.values()) n.sort((o, s) => o.localeCompare(s));
  return e;
}
c(Oo, "buildSortedSuccessorMap");
function Po(t) {
  var n;
  const e = new Map();
  for (const o of t.nodes) e.set(o, 0);
  for (const o of t.edges) e.set(o.dst, ((n = e.get(o.dst)) != null ? n : 0) + 1);
  return e;
}
c(Po, "buildInDegreeMap");
function Bo(t) {
  return [...t.entries()]
    .filter(([, e]) => e === 0)
    .map(([e]) => e)
    .sort((e, n) => e.localeCompare(n));
}
c(Bo, "sortedZeroInDegreeNodes");
function wn(t, e = () => !0) {
  const n = new Map(),
    o = new Map();
  for (const s of t.nodes) (n.set(s, []), o.set(s, []));
  for (const s of t.edges) e(s) && (o.get(s.src).push(s.dst), n.get(s.dst).push(s.src));
  return { preds: n, succs: o };
}
c(wn, "buildPredecessorSuccessorMaps");
function ko(t, e, n, o) {
  var d, l, p, y;
  let s = 0;
  for (const f of t.nodes)
    (o != null && o.skipGroups && (d = t.nodeById.get(f)) != null && d.isGroup) ||
      (s = Math.max(s, (l = n[f]) != null ? l : 0));
  const r = Array.from({ length: s + 1 }, () => []);
  for (const f of e)
    (o != null && o.skipGroups && (p = t.nodeById.get(f)) != null && p.isGroup) ||
      r[Math.max(0, (y = n[f]) != null ? y : 0)].push(f);
  return r;
}
c(ko, "buildLayersFromRanks");
function Qe(t) {
  var r, d, l;
  const e = Po(t),
    n = Bo(e),
    o = [],
    s = Oo(t);
  for (; n.length;) {
    const p = n.shift();
    o.push(p);
    for (const y of (r = s.get(p)) != null ? r : [])
      if ((e.set(y, ((d = e.get(y)) != null ? d : 0) - 1), ((l = e.get(y)) != null ? l : 0) === 0)) {
        let f = 0;
        for (; f < n.length && n[f] < y;) f++;
        n.splice(f, 0, y);
      }
  }
  return o.length === t.nodes.length ? o : null;
}
c(Qe, "topoSortIfAcyclic");
function Ke(t) {
  const e = new Map();
  let n = 0;
  for (const o of t) (e.set(o, n), n++);
  return e;
}
c(Ke, "buildLayerIndex");
function Fo(t) {
  const e = new Array(t.length),
    n = c((o, s) => {
      if (s - o <= 1) return 0;
      const r = (o + s) >> 1;
      let d = n(o, r) + n(r, s),
        l = o,
        p = r,
        y = o;
      for (; l < r || p < s;) p >= s || (l < r && t[l] <= t[p]) ? (e[y++] = t[l++]) : ((e[y++] = t[p++]), (d += r - l));
      for (let f = o; f < s; f++) t[f] = e[f];
      return d;
    }, "count");
  return n(0, t.length);
}
c(Fo, "countInversions");
function Cr(t) {
  const e = Oe(t),
    n = new Map();
  for (const f of e.nodes) n.set(f, []);
  for (const f of e.edges) n.get(f.src).push(f);
  for (const f of n.values())
    f.sort((g, M) => (g.dst === M.dst ? g.id.localeCompare(M.id) : g.dst.localeCompare(M.dst)));
  const o = Object.create(null);
  for (const f of e.nodes) o[f] = 0;
  const s = [],
    r = c((f) => {
      var g;
      o[f] = 1;
      for (const M of (g = n.get(f)) != null ? g : []) {
        const i = M.dst;
        o[i] === 0 ? r(i) : o[i] === 1 && s.push(M);
      }
      o[f] = 2;
    }, "dfs"),
    d = [...e.nodes].sort((f, g) => f.localeCompare(g));
  for (const f of d) o[f] === 0 && r(f);
  const l = new Set(s.map((f) => `${f.id}:${f.src}->${f.dst}`)),
    p = e.edges.map((f) =>
      l.has(`${f.id}:${f.src}->${f.dst}`) ? { id: f.id, src: f.dst, dst: f.src, weight: f.weight, ref: f.ref } : f,
    );
  return { acyclic: { nodes: [...e.nodes], edges: p, layout: e.layout, nodeById: new Map(e.nodeById) }, reversed: s };
}
c(Cr, "removeCycles_DFS");
function vr(t) {
  const e = new Map(),
    n = c((o) => {
      if (e.has(o)) return e.get(o);
      const s = t.nodeById.get(o);
      if (!s) return (e.set(o, null), null);
      const r = s.parentId;
      if (!r) return (e.set(o, null), null);
      const d = n(r),
        l = d != null ? d : r;
      return (e.set(o, l), l);
    }, "resolve");
  for (const o of t.nodes) n(o);
  return e;
}
c(vr, "buildTopLaneMap");
function we(t) {
  const e = vr(t);
  return (n) => {
    var o;
    return (o = e.get(n)) != null ? o : null;
  };
}
c(we, "createTopLaneResolver");
function Tn(t) {
  var n;
  const e = [];
  for (const o of (n = t.layout.nodes) != null ? n : []) o.isGroup && !o.parentId && e.push(o.id);
  return [...new Set(e)].reverse();
}
c(Tn, "buildTopLaneOrder");
function _o(t, e) {
  const n = Tn(t);
  if (!e || e.length === 0) return n;
  const o = new Set(n),
    s = new Set(),
    r = [];
  for (const d of e) !o.has(d) || s.has(d) || (s.add(d), r.push(d));
  for (const d of n) s.has(d) || r.push(d);
  return r;
}
c(_o, "resolveTopLaneOrder");
var Ei = { EPSILON: 1e-6 },
  Sn = { GRAVITY_ITERATIONS: 8, MAX_CROSSING_OPTIMIZATION_PASSES: 4, DEFAULT_COMPACT_SINGLE_INPUT: !0 },
  Es = { DEFAULT_LAYER_GAP: 100, DEFAULT_NODE_GAP: 40 };
function Lr(t, e) {
  var a, m, S, w;
  const n = Oe(t),
    o = (a = e == null ? void 0 : e.laneOf) != null ? a : () => null,
    s = e == null ? void 0 : e.rankHint,
    { preds: r } = wn(n);
  for (const L of r.values()) L.sort((O, R) => O.localeCompare(R));
  const d = (m = Qe(n)) != null ? m : [...n.nodes].sort((L, O) => L.localeCompare(O)),
    l = new Map();
  for (const [L, O] of d.entries()) l.set(O, L);
  const p = new Map(),
    y = new Map();
  for (const L of n.nodes) y.set(L, []);
  for (const L of d) {
    const O = ((S = r.get(L)) != null ? S : []).filter((R) => p.has(R));
    if (O.length > 0) {
      const R = wr(L, O, { laneOf: o, rankHint: s, topoIndex: l });
      (p.set(L, R), y.get(R).push(L));
    } else p.has(L) || p.set(L, null);
  }
  for (const L of n.nodes) p.has(L) || p.set(L, null);
  const f = new Set();
  for (const L of n.nodes) ((w = p.get(L)) != null ? w : null) === null && f.add(L);
  const g = [...f].sort((L, O) => {
      var D, J;
      const R = (D = l.get(L)) != null ? D : 0,
        k = (J = l.get(O)) != null ? J : 0;
      return R === k ? L.localeCompare(O) : R - k;
    }),
    M = Tr(n),
    i = new Map();
  for (const [L, O] of M.entries())
    i.set(
      L,
      [...O].sort((R, k) => R.localeCompare(k)),
    );
  const u = Er(i),
    h = Ar(i),
    x = new Map();
  for (const L of n.nodes) x.set(L, []);
  for (const L of h)
    for (const O of L.nodes) {
      const R = x.get(O);
      R ? R.push(L.id) : x.set(O, [L.id]);
    }
  const I = [],
    v = [],
    E = new Set(),
    C = c((L) => {
      var O;
      if (!E.has(L)) {
        (E.add(L), I.push(L));
        for (const R of (O = y.get(L)) != null ? O : []) C(R);
        v.push(L);
      }
    }, "walk");
  for (const L of g) C(L);
  for (const L of d) C(L);
  return {
    parent: p,
    children: y,
    roots: g,
    componentOf: u,
    blocks: h,
    nodeBlocks: x,
    adjacency: i,
    preorder: I,
    postorder: v,
    topologicalOrder: d,
  };
}
c(Lr, "buildDrivingTree");
function wr(t, e, n) {
  const o = n.laneOf(t);
  return [...e].sort((r, d) => {
    var h, x, I, v;
    const l = n.laneOf(r),
      p = n.laneOf(d),
      y = l != null && l === o,
      f = p != null && p === o;
    if (y !== f) return y ? -1 : 1;
    const g = (h = n.rankHint) == null ? void 0 : h[r],
      M = (x = n.rankHint) == null ? void 0 : x[d];
    if (g != null && M != null && g !== M) return M - g;
    const i = (I = n.topoIndex.get(r)) != null ? I : 0,
      u = (v = n.topoIndex.get(d)) != null ? v : 0;
    return i !== u ? i - u : r.localeCompare(d);
  })[0];
}
c(wr, "chooseParent");
function Tr(t) {
  const e = new Map();
  for (const n of t.nodes) e.set(n, new Set());
  for (const n of t.edges) (e.get(n.src).add(n.dst), e.get(n.dst).add(n.src));
  return e;
}
c(Tr, "buildAdjacency");
function Er(t) {
  var o;
  const e = new Map();
  let n = 0;
  for (const s of t.keys()) {
    if (e.has(s)) continue;
    const r = [s];
    for (; r.length > 0;) {
      const d = r.pop();
      if (!e.has(d)) {
        e.set(d, n);
        for (const l of (o = t.get(d)) != null ? o : []) e.has(l) || r.push(l);
      }
    }
    n++;
  }
  return e;
}
c(Er, "assignComponents");
function Ar(t) {
  const e = new Map(),
    n = new Map(),
    o = [],
    s = [];
  let r = 0;
  const d = c((l, p) => {
    var y, f, g, M, i, u, h, x, I;
    (e.set(l, ++r), n.set(l, r));
    for (const v of (y = t.get(l)) != null ? y : [])
      v !== p &&
        (e.has(v)
          ? ((u = e.get(v)) != null ? u : 0) < ((h = e.get(l)) != null ? h : 0) &&
            (o.push([l, v]), n.set(l, Math.min((x = n.get(l)) != null ? x : r, (I = e.get(v)) != null ? I : r)))
          : (o.push([l, v]),
            d(v, l),
            n.set(l, Math.min((f = n.get(l)) != null ? f : r, (g = n.get(v)) != null ? g : r)),
            ((M = n.get(v)) != null ? M : 0) >= ((i = e.get(l)) != null ? i : 0) && s.push(Rr(l, v, o, s.length))));
  }, "visit");
  for (const l of t.keys()) e.has(l) || d(l, null);
  return s;
}
c(Ar, "computeBlocks");
function Rr(t, e, n, o) {
  const s = [],
    r = new Set();
  for (; n.length > 0;) {
    const d = n.pop();
    if ((s.push(d), r.add(d[0]), r.add(d[1]), (d[0] === t && d[1] === e) || (d[0] === e && d[1] === t))) break;
  }
  return { id: o, edges: s, nodes: [...r] };
}
c(Rr, "popBlock");
function Nr(t, e, n) {
  var v, E, C;
  const o = [...t.nodes],
    s = new Map();
  for (const [a, m] of o.entries()) s.set(m, a);
  const r = o.length,
    d = new Array(r).fill(-1),
    l = new Array(r).fill(0),
    p = [],
    y = new Set();
  for (const a of o) {
    const m = (v = n.parent.get(a)) != null ? v : null,
      S = s.get(a);
    S != null && m == null && ((d[S] = -1), (l[S] = 0), y.has(a) || (y.add(a), p.push(a)));
  }
  for (; p.length > 0;) {
    const a = p.shift(),
      m = s.get(a);
    if (m == null) continue;
    const S = (E = n.children.get(a)) != null ? E : [];
    for (const w of S) {
      if (y.has(w)) continue;
      const L = s.get(w);
      L != null && ((d[L] = m), (l[L] = l[m] + 1), y.add(w), p.push(w));
    }
  }
  for (const a of o) {
    if (y.has(a)) continue;
    const m = s.get(a);
    m != null && ((d[m] = -1), (l[m] = 0), y.add(a));
  }
  const f = Math.max(1, Math.ceil(Math.log2(Math.max(1, r))) + 1),
    g = Array.from({ length: f }, () => new Array(r).fill(-1));
  for (let a = 0; a < r; a++) g[0][a] = d[a];
  for (let a = 1; a < f; a++)
    for (let m = 0; m < r; m++) {
      const S = g[a - 1][m];
      g[a][m] = S === -1 ? -1 : g[a - 1][S];
    }
  const M = c((a, m) => {
      if (a === -1 || m === -1) return -1;
      l[a] < l[m] && ([a, m] = [m, a]);
      const S = l[a] - l[m];
      for (let w = 0; w < f; w++) if ((S >> w) & 1 && ((a = g[w][a]), a === -1)) return -1;
      if (a === m) return a;
      for (let w = f - 1; w >= 0; w--) {
        const L = g[w][a],
          O = g[w][m];
        L === -1 || O === -1 || (L !== O && ((a = L), (m = O)));
      }
      return g[0][a];
    }, "lcaIndex"),
    i = Array.from({ length: r }, () => new Map());
  for (const a of t.edges) {
    let m = a.src,
      S = a.dst,
      w = e[m],
      L = e[S];
    if (w == null || L == null || (w > L && (([m, S] = [S, m]), ([w, L] = [L, w])), w == null || L == null || w === L))
      continue;
    const O = s.get(m),
      R = s.get(S);
    if (O == null || R == null) continue;
    const k = M(O, R);
    if (k === -1) continue;
    const D = i[k];
    for (let J = w; J < L; J++) D.set(J, ((C = D.get(J)) != null ? C : 0) + 1);
  }
  const u = new Map(),
    h = c((a, m) => {
      var S;
      if (m.size !== 0) for (const [w, L] of m) a.set(w, ((S = a.get(w)) != null ? S : 0) + L);
    }, "mergeInto"),
    x = new Set(),
    I = c((a) => {
      var O, R;
      const m = s.get(a);
      x.add(a);
      const S = m == null ? void 0 : i[m],
        w = S ? new Map(S) : new Map(),
        L = (O = n.children.get(a)) != null ? O : [];
      for (const k of L) {
        const D = I(k),
          J = e[a];
        if (J != null) {
          let at = u.get(a);
          at || ((at = new Map()), u.set(a, at));
          let gt = (R = D.get(J)) != null ? R : 0;
          const mt = e[k];
          (mt != null && mt > J && (gt += 1), at.set(k, gt));
        }
        h(w, D);
      }
      return w;
    }, "dfs");
  for (const a of n.roots) x.has(a) || I(a);
  for (const a of o) x.has(a) || I(a);
  return u;
}
c(Nr, "computeSubtreeCrossCounts");
function Or(t, e, n) {
  const o = new Map(),
    s = c((r) => {
      var p, y;
      let d = (p = n[r]) != null ? p : 0;
      const l = [...((y = e.get(r)) != null ? y : [])];
      l.sort(Do(n));
      for (const f of l) {
        s(f);
        const g = o.get(f);
        g != null && (d = Math.min(d, g));
      }
      o.set(r, d);
    }, "annotate");
  for (const r of t) s(r);
  return o;
}
c(Or, "annotateMinimumLayers");
function Do(t) {
  return (e, n) => {
    var r, d;
    const o = (r = t[e]) != null ? r : 0,
      s = (d = t[n]) != null ? d : 0;
    return o === s ? e.localeCompare(n) : o - s;
  };
}
c(Do, "compareByRankThenId");
function Pr(t, e, n, o) {
  var p, y;
  let s = 0;
  for (const f of e) {
    const g = (p = n[f]) != null ? p : 0;
    g > s && (s = g);
  }
  const r = Array.from({ length: s + 1 }, () => []),
    d = new Set(),
    l = c((f) => {
      var M;
      if (d.has(f)) return;
      d.add(f);
      const g = (M = n[f]) != null ? M : 0;
      (r[g] || (r[g] = []), r[g].push(f));
      for (const i of o(f)) l(i);
    }, "emit");
  for (const f of t) l(f);
  for (const f of e)
    if (!d.has(f)) {
      const g = (y = n[f]) != null ? y : 0;
      (r[g] || (r[g] = []), r[g].push(f), d.add(f));
    }
  return r;
}
c(Pr, "emitNodesInTreeOrder");
function Br(t) {
  const e = [];
  for (const n of t) {
    const o = new Set(),
      s = [];
    for (const r of n) o.has(r) || (o.add(r), s.push(r));
    e.push(s);
  }
  return e;
}
c(Br, "deduplicateLayers");
function kr(t, e, n, o) {
  return (s) => {
    var f, g, M;
    const r = (f = t.get(s)) != null ? f : [];
    if (r.length === 0) return [];
    const d = (g = e[s]) != null ? g : 0,
      l = [],
      p = [],
      y = n.get(s);
    for (const i of r) {
      const u = (M = o.get(i)) != null ? M : d;
      u > d ? l.push({ child: i, min: u }) : p.push(i);
    }
    return (
      l.sort((i, u) => (i.min === u.min ? i.child.localeCompare(u.child) : i.min - u.min)),
      p.sort((i, u) => {
        var E, C, a, m;
        const h = (E = y == null ? void 0 : y.get(i)) != null ? E : 0,
          x = (C = y == null ? void 0 : y.get(u)) != null ? C : 0;
        if (h !== x) return h - x;
        const I = (a = o.get(i)) != null ? a : d,
          v = (m = o.get(u)) != null ? m : d;
        return I !== v ? I - v : i.localeCompare(u);
      }),
      [...l.map((i) => i.child), ...p]
    );
  };
}
c(kr, "createChildOrderer");
function Cn(t, e, n) {
  const o = Lr(t, { rankHint: e, laneOf: n }),
    { children: s, roots: r } = o;
  for (const g of t.nodes) s.has(g) || s.set(g, []);
  const d = Nr(t, e, o),
    l = [...r].sort(Do(e)),
    p = Or(l, s, e),
    y = kr(s, e, d, p);
  let f = Pr(l, t.nodes, e, y);
  return ((f = Br(f)), f);
}
c(Cn, "buildMultitreeLayerOrder");
function Fr(t, e, n) {
  const o = new Set(t),
    s = new Set(e),
    r = Ke(e),
    d = [];
  for (const l of n) o.has(l.src) && s.has(l.dst) && d.push(r.get(l.dst));
  return Fo(d);
}
c(Fr, "countCrossingsBetweenAdjacent");
function ao(t, e, n) {
  const o = [];
  for (const r of e) {
    const d = n[r.src],
      l = n[r.dst];
    if (d == null || l == null || d === l) continue;
    let p = r.src,
      y = r.dst,
      f = d,
      g = l;
    d > l && ((p = r.dst), (y = r.src), (f = l), (g = d));
    for (let M = f; M < g; M++) o.push({ id: `${r.id}@${M}`, src: p, dst: y, ref: r.ref });
  }
  let s = 0;
  for (let r = 0; r + 1 < t.length; r++) s += Fr(t[r], t[r + 1], o);
  return s;
}
c(ao, "totalCrossings");
function _r(t, e) {
  var p, y, f;
  const n = { ...e },
    { preds: o } = wn(t),
    s = we(t),
    r = Cn(t, n, s);
  let d = ao(r, t.edges, n);
  const l = Sn.MAX_CROSSING_OPTIMIZATION_PASSES;
  for (let g = 0; g < l; g++) {
    let M = !1;
    const i = [...t.nodes].sort((u, h) => {
      var x, I;
      return ((x = n[h]) != null ? x : 0) - ((I = n[u]) != null ? I : 0);
    });
    for (const u of i) {
      const h = (p = n[u]) != null ? p : 0;
      if (h === 0) continue;
      let x = 0;
      for (const C of (y = o.get(u)) != null ? y : []) x = Math.max(x, ((f = n[C]) != null ? f : 0) + 1);
      if (x >= h) continue;
      const I = h;
      n[u] = x;
      const v = Cn(t, n, s),
        E = ao(v, t.edges, n);
      E < d ? ((d = E), (M = !0)) : (n[u] = I);
    }
    if (!M) break;
  }
  return n;
}
c(_r, "optimizeRanksByCrossings");
function Dr(t, e) {
  var s, r;
  const n = we(t),
    o = [...t.nodes].sort((d, l) => {
      var p, y;
      return ((p = e[d]) != null ? p : 0) - ((y = e[l]) != null ? y : 0) || d.localeCompare(l);
    });
  for (const d of o) {
    const l = n(d);
    if (!l) continue;
    const p = t.edges.filter((I) => I.src === d);
    if (p.length === 0) continue;
    let y = !1,
      f = 0;
    for (const I of p) {
      const v = n(I.dst);
      v == null || v === l ? (y = !0) : f++;
    }
    if (f === 0 || y) continue;
    let g = 0,
      M = !1;
    for (const I of t.edges) {
      if (I.dst !== d) continue;
      const v = n(I.src);
      v && (v === l ? (M = !0) : g++);
    }
    if (g > 0 || !M) continue;
    const i = (s = e[d]) != null ? s : 0,
      u = i + f;
    let h = 0;
    for (const I of t.edges) I.dst === d && (h = Math.max(h, ((r = e[I.src]) != null ? r : 0) + 1));
    const x = Math.max(i, h, u);
    x !== i && (e[d] = x);
  }
}
c(Dr, "adjustCrossLaneSources");
function Hr(t, e) {
  var p, y, f, g, M, i;
  const n = Oe(t),
    o = (p = Qe(n)) != null ? p : [...n.nodes].sort(),
    s = (y = e == null ? void 0 : e.compactSingleInput) != null ? y : !1,
    r = we(n);
  let d = Object.create(null);
  for (const u of o) {
    const h = No(n, u),
      x =
        e != null && e.ignoreCrossLaneEdges
          ? h.filter((I) => {
              const v = r(I.src),
                E = r(u);
              return !v || !E ? !0 : v === E;
            })
          : h;
    if (x.length === 0) d[u] = 0;
    else if (s && x.length === 1) {
      const I = x[0].src,
        v = r(I),
        E = r(u);
      v !== E ? (d[u] = (f = d[I]) != null ? f : 0) : (d[u] = ((g = d[I]) != null ? g : 0) + 1);
    } else {
      let I = -1 / 0;
      for (const v of x) I = Math.max(I, ((M = d[v.src]) != null ? M : 0) + 1);
      d[u] = I === -1 / 0 ? 0 : I;
    }
  }
  return (
    (i = e == null ? void 0 : e.optimizeRanksByCrossings) != null && i && (d = _r(n, d)),
    e != null && e.ignoreCrossLaneEdges && Dr(n, d),
    { layers: Cn(n, d, r), rankOf: d, dummy: new Set() }
  );
}
c(Hr, "assignLayers_LongestPath");
function Xr(t, e) {
  var u, h, x, I, v, E;
  const n = Oe(t),
    s = {
      ...Hr(n, {
        compactSingleInput: e == null ? void 0 : e.compactSingleInput,
        ignoreCrossLaneEdges: e == null ? void 0 : e.ignoreCrossLaneEdges,
        optimizeRanksByCrossings: e == null ? void 0 : e.optimizeRanksByCrossings,
      }).rankOf,
    },
    r = we(n),
    { preds: d, succs: l } = wn(n, (C) => {
      if (e != null && e.ignoreCrossLaneEdges) {
        const a = r(C.src),
          m = r(C.dst);
        if (a && m && a !== m) return !1;
      }
      return !0;
    }),
    p = (u = Qe(n)) != null ? u : [...n.nodes],
    y = [...p].reverse(),
    f = c((C, a) => {
      var L, O, R;
      let m = 0;
      for (const k of (L = d.get(C)) != null ? L : []) m = Math.max(m, ((O = s[k]) != null ? O : 0) + 1);
      let S = Number.POSITIVE_INFINITY;
      const w = (R = l.get(C)) != null ? R : [];
      return (
        w.length > 0 &&
          (S = Math.min(
            ...w.map((k) => {
              var D;
              return ((D = s[k]) != null ? D : 0) - 1;
            }),
          )),
        Number.isFinite(S) || (S = Math.max(m, a)),
        Math.min(Math.max(a, m), S)
      );
    }, "clampFeasible"),
    g = Sn.GRAVITY_ITERATIONS,
    M = c((C) => {
      var m, S, w, L;
      let a = !1;
      for (const O of C) {
        const R = (m = d.get(O)) != null ? m : [],
          k = (S = l.get(O)) != null ? S : [];
        if (R.length === 0 && k.length === 0) continue;
        const D =
            R.length > 0
              ? R.reduce((mt, St) => {
                  var bt;
                  return mt + ((bt = s[St]) != null ? bt : 0) + 1;
                }, 0) / R.length
              : (w = s[O]) != null
                ? w
                : 0,
          J =
            k.length > 0
              ? k.reduce((mt, St) => {
                  var bt;
                  return mt + ((bt = s[St]) != null ? bt : 0) - 1;
                }, 0) / k.length
              : (L = s[O]) != null
                ? L
                : 0,
          at = Math.round((D + J) / 2),
          gt = f(O, at);
        gt !== s[O] && ((s[O] = gt), (a = !0));
      }
      return a;
    }, "relaxOrder");
  for (let C = 0; C < g; C++) {
    const a = M(p),
      m = M(y);
    if (!a && !m) break;
  }
  for (const C of p) {
    let a = 0;
    for (const m of (h = d.get(C)) != null ? h : []) a = Math.max(a, ((x = s[m]) != null ? x : 0) + 1);
    ((I = s[C]) != null ? I : 0) < a && (s[C] = a);
  }
  for (const C of y) {
    const a = (v = l.get(C)) != null ? v : [];
    if (a.length > 0) {
      const m = Math.min(
        ...a.map((S) => {
          var w;
          return ((w = s[S]) != null ? w : 0) - 1;
        }),
      );
      ((E = s[C]) != null ? E : 0) > m && (s[C] = m);
    }
  }
  return { layers: ko(n, p, s), rankOf: s, dummy: new Set() };
}
c(Xr, "assignLayers_Gravity");
function Yr(t) {
  var r, d, l;
  const e = Po(t),
    n = Oo(t);
  let o = Bo(e);
  const s = [];
  for (; o.length > 0;) {
    const p = [];
    for (const y of o) {
      s.push(y);
      for (const f of (r = n.get(y)) != null ? r : [])
        (e.set(f, ((d = e.get(f)) != null ? d : 0) - 1), ((l = e.get(f)) != null ? l : 0) === 0 && p.push(f));
    }
    o = p.sort((y, f) => y.localeCompare(f));
  }
  return s.length === t.nodes.length ? s : null;
}
c(Yr, "topoSortByGenerationIfAcyclic");
function Gr(t, e) {
  var f, g, M, i;
  const n = Oe(t),
    o =
      (e == null ? void 0 : e.direction) === "LR"
        ? (f = Yr(n)) != null
          ? f
          : [...n.nodes].sort()
        : (g = Qe(n)) != null
          ? g
          : [...n.nodes].sort(),
    s = we(n),
    r = c((u) => {
      var h;
      return (h = s(u)) != null ? h : u;
    }, "laneOf"),
    d = Object.create(null),
    l = new Map(),
    p = c((u, h) => {
      var I;
      return ((I = e == null ? void 0 : e.ignoreCrossLaneEdges) != null ? I : !0) ? (r(u) === r(h) ? 1 : 0) : 1;
    }, "edgeWeight");
  for (const u of o) {
    const h = n.nodeById.get(u);
    if (h != null && h.isGroup) continue;
    const x = No(n, u);
    let I = 0;
    if (x.length > 0)
      for (const a of x) {
        const m = a.src,
          S = (M = d[m]) != null ? M : 0;
        I = Math.max(I, S + p(m, u));
      }
    const v = r(u),
      E = (i = l.get(v)) != null ? i : 0,
      C = Math.max(I, E);
    ((d[u] = C), l.set(v, C + 1));
  }
  return { layers: ko(n, o, d, { skipGroups: !0 }), rankOf: d, dummy: new Set() };
}
c(Gr, "assignLayers_LaneAwareCompact");
function $r(t, e) {
  var i, u;
  const n = Oe(e),
    { rankOf: o } = t,
    s = t.layers.map((h) => [...h]),
    r = new Set(t.dummy ? [...t.dummy] : []);
  let d = 0;
  const l = new Map(n.nodeById),
    p = c((h) => {
      const x = `placeholder-${d++}`,
        I = { id: x, isGroup: !1, isDummy: !0, width: 0, height: 0 };
      for (l.set(x, I), r.add(x); s.length <= h;) s.push([]);
      return (s[h].push(x), (o[x] = h), x);
    }, "addDummyAt"),
    y = [...n.edges].sort((h, x) =>
      h.id === x.id
        ? h.src === x.src
          ? h.dst.localeCompare(x.dst)
          : h.src.localeCompare(x.src)
        : h.id.localeCompare(x.id),
    ),
    f = [];
  for (const h of y) {
    const x = (i = o[h.src]) != null ? i : 0,
      I = (u = o[h.dst]) != null ? u : 0;
    if (I - x <= 1) {
      f.push(h);
      continue;
    }
    let v = h.src;
    for (let C = x + 1, a = 0; C < I; C++, a++) {
      const m = p(C);
      (f.push({ id: `${h.id}#${a}`, src: v, dst: m, weight: h.weight, ref: h.ref }), (v = m));
    }
    const E = I - x - 2;
    f.push({ id: `${h.id}#${Math.max(E + 1, 0)}`, src: v, dst: h.dst, weight: h.weight, ref: h.ref });
  }
  const M = {
    nodes: [...n.nodes, ...[...r].filter((h) => !n.nodes.includes(h))],
    edges: f,
    layout: n.layout,
    nodeById: l,
  };
  return { layering: { layers: s, rankOf: o, dummy: r }, graphWithDummies: M };
}
c($r, "makeProperLayering");
function lo(t) {
  const e = t.length;
  if (e === 0) return Number.POSITIVE_INFINITY;
  const n = [...t].sort((o, s) => o - s);
  return e % 2 === 1 ? n[(e - 1) / 2] : 0.5 * (n[e / 2 - 1] + n[e / 2]);
}
c(lo, "median");
function fo(t) {
  return t.length === 0 ? Number.POSITIVE_INFINITY : t.reduce((n, o) => n + o, 0) / t.length;
}
c(fo, "barycenter");
function zr(t, e, n, o) {
  const s = new Map();
  for (const r of t) s.set(r, []);
  for (const r of n)
    o === "down"
      ? e.has(r.src) && s.has(r.dst) && s.get(r.dst).push(e.get(r.src))
      : e.has(r.dst) && s.has(r.src) && s.get(r.src).push(e.get(r.dst));
  return s;
}
c(zr, "neighborPositionsFor");
function Vr(t, e, n) {
  var r, d;
  const o = (r = n.get(t)) != null ? r : 0,
    s = (d = n.get(e)) != null ? d : 0;
  return o !== s ? o - s : t.localeCompare(e);
}
c(Vr, "currentOrderTieBreak");
function uo(t, e, n) {
  const o = new Set(t),
    s = new Set(e),
    r = Ke(t),
    d = Ke(e),
    l = [];
  for (const y of n) o.has(y.src) && s.has(y.dst) && l.push({ u: r.get(y.src), v: d.get(y.dst) });
  l.sort((y, f) => (y.u === f.u ? y.v - f.v : y.u - f.u));
  const p = l.map((y) => y.v);
  return Fo(p);
}
c(uo, "countCrossingsBetweenAdjacent");
function hn(t, e, n) {
  return [...t].sort((o, s) => {
    var l, p;
    const r = lo((l = e.get(o)) != null ? l : []),
      d = lo((p = e.get(s)) != null ? p : []);
    return r === d ? Vr(o, s, n) : isFinite(r) ? (isFinite(d) ? r - d : -1) : 1;
  });
}
c(hn, "sortByHeuristic");
function ho(t, e, n, o, s, r) {
  var M, i, u;
  const d = Ke(t),
    l = Ke(e),
    p = zr(e, d, n, o);
  if (!s || !r || r.length === 0) return hn(e, p, l);
  const y = new Map();
  for (const h of e) {
    const x = s(h),
      I = (M = y.get(x)) != null ? M : [];
    (I.push(h), y.set(x, I));
  }
  const f = [];
  for (const h of r) {
    const x = y.get(h);
    if (!x || x.length === 0) continue;
    const I = hn(x, p, l);
    f.push(...I);
  }
  const g = y.get(null);
  if (g && g.length > 0) {
    const h = hn(g, p, l);
    for (const x of h) {
      const I = fo((i = p.get(x)) != null ? i : []);
      let v = f.length;
      if (isFinite(I))
        for (const [E, C] of f.entries()) {
          const a = fo((u = p.get(C)) != null ? u : []);
          if (I < a) {
            v = E;
            break;
          }
        }
      f.splice(v, 0, x);
    }
  }
  return f;
}
c(ho, "reorderLayer");
function go(t, e, n, o, s) {
  const r = [...e],
    d = new Set(t),
    l = new Set(e),
    p = o ? new Set(o) : null,
    y = n.filter((h) => d.has(h.src) && l.has(h.dst)),
    f = p ? n.filter((h) => l.has(h.src) && p.has(h.dst)) : void 0,
    g = c((h) => {
      let x = uo(t, h, y);
      return (f && o && (x += uo(h, o, f)), x);
    }, "crossingScore"),
    M = s ? new Map() : null;
  if (s && M) for (const h of e) M.set(h, s(h));
  let i = !0,
    u = g(r);
  for (; i;) {
    i = !1;
    for (let h = 0; h + 1 < r.length; h++) {
      if (M) {
        const v = M.get(r[h]),
          E = M.get(r[h + 1]);
        if (v !== E) continue;
      }
      const x = u;
      [r[h], r[h + 1]] = [r[h + 1], r[h]];
      const I = g(r);
      I < x ? ((u = I), (i = !0)) : ([r[h], r[h + 1]] = [r[h + 1], r[h]]);
    }
  }
  return r;
}
c(go, "transposeImprove");
function jr(t, e, n) {
  const o = t.layers.map((l) => [...l]),
    s = e.edges,
    r = we(e),
    d = _o(e, n == null ? void 0 : n.laneOrder);
  for (let l = 0; l < 3; l++) {
    for (let p = 1; p < o.length; p++)
      ((o[p] = ho(o[p - 1], o[p], s, "down", r, d)), (o[p] = go(o[p - 1], o[p], s, o[p + 1], r)));
    for (let p = o.length - 2; p >= 0; p--)
      ((o[p] = ho(o[p + 1], o[p], s, "up", r, d)), (o[p] = go(o[p + 1], o[p], s, o[p - 1], r)));
  }
  return { layers: o };
}
c(jr, "orderLayers");
function Ur(t, e, n) {
  var O, R, k, D, J, at, gt, mt, St, bt, Pt, kt, Xt;
  const o = (O = n == null ? void 0 : n.layerGap) != null ? O : Es.DEFAULT_LAYER_GAP,
    s = (R = n == null ? void 0 : n.nodeGap) != null ? R : Es.DEFAULT_NODE_GAP,
    r = (k = n == null ? void 0 : n.laneGap) != null ? k : s * 2,
    d = (D = n == null ? void 0 : n.direction) != null ? D : "TB",
    l = d === "LR" || d === "RL",
    p = t.layers,
    y = Object.create(null),
    f = Object.create(null),
    g = c((ft) => e.nodeById.get(ft), "getNode"),
    M = c((ft) => {
      var W, K;
      return (K = (W = g(ft)) == null ? void 0 : W.width) != null ? K : 0;
    }, "getWidth"),
    i = c((ft) => {
      var W, K;
      return (K = (W = g(ft)) == null ? void 0 : W.height) != null ? K : 0;
    }, "getHeight"),
    u = we(e),
    h = _o(e, n == null ? void 0 : n.laneOrder),
    x = p.map((ft) => ft.reduce((W, K) => Math.max(W, i(K)), 0)),
    I = [];
  if (l)
    for (let ft = 0; ft + 1 < p.length; ft++) {
      const W = p[ft].reduce((yt, Lt) => Math.max(yt, M(Lt)), 0),
        K = p[ft + 1].reduce((yt, Lt) => Math.max(yt, M(Lt)), 0),
        V = x[ft],
        G = x[ft + 1],
        tt = V / 2 + G / 2,
        et = (W + K) / 2,
        nt = Math.max(0, et - tt - o);
      I.push(nt);
    }
  const v = new Set();
  for (const ft of p) for (const W of ft) v.add(u(W));
  const E = v.has(null),
    C = h.filter((ft) => v.has(ft)),
    a = [...(E ? [null] : []), ...C],
    m = Object.create(null);
  for (const ft of C) m[ft] = 0;
  E && (m.null = 0);
  for (const ft of p) {
    const W = Object.create(null),
      K = [];
    for (const V of ft) {
      const G = u(V);
      G === null ? K.push(V) : (W[G] || (W[G] = [])).push(V);
    }
    for (const [V, G] of Object.entries(W)) {
      const tt = G.reduce((et, nt) => et + M(nt), 0) + s * Math.max(0, G.length - 1);
      m[V] = Math.max((J = m[V]) != null ? J : 0, tt);
    }
    if (E && K.length) {
      const V = K.reduce((G, tt) => G + M(tt), 0) + s * Math.max(0, K.length - 1);
      m.null = Math.max((at = m.null) != null ? at : 0, V);
    }
  }
  const S = new Map();
  {
    const ft = a.map((V) => {
      var G;
      return (G = V === null ? m.null : m[V]) != null ? G : 0;
    });
    let K = -(ft.reduce((V, G) => V + G, 0) + r * Math.max(0, a.length - 1)) / 2;
    for (let V = 0; V < a.length; V++) {
      const G = a[V],
        tt = (gt = ft[V]) != null ? gt : 0,
        et = K + tt / 2;
      (S.set(G, et), (K += tt), V < a.length - 1 && (K += r));
    }
  }
  let w = 0;
  for (const [ft, W] of p.entries()) {
    const K = (mt = x[ft]) != null ? mt : 0,
      V = new Map();
    for (const tt of W) {
      const et = u(tt),
        nt = (St = V.get(et)) != null ? St : [];
      (nt.push(tt), V.set(et, nt));
    }
    for (const tt of a) {
      const et = (bt = V.get(tt)) != null ? bt : [];
      if (et.length === 0) continue;
      const nt = S.get(tt);
      if (et.length === 1) {
        const yt = et[0];
        ((y[yt] = nt), (f[yt] = w + K / 2));
      } else {
        const yt = et.map((Wt) => M(Wt)),
          Lt = yt.reduce((Wt, oe) => Wt + oe, 0) + s * (et.length - 1);
        let Ft = nt - Lt / 2;
        for (const [Wt, oe] of et.entries()) {
          const be = yt[Wt];
          ((y[oe] = Ft + be / 2), (f[oe] = w + K / 2), (Ft += be + s));
        }
      }
    }
    const G = (Pt = I[ft]) != null ? Pt : 0;
    w += K + o + G;
  }
  const L = new Map();
  for (const ft of e.edges) {
    const W = ft.ref.id;
    (L.has(W) || L.set(W, []), L.get(W).push(ft));
  }
  for (const [, ft] of L) {
    if (ft.length === 0) continue;
    const W = ft[0].ref,
      K = W.start,
      V = W.end;
    if (K == null || V == null) continue;
    const G = Math.round((((kt = y[K]) != null ? kt : 0) + ((Xt = y[V]) != null ? Xt : 0)) / 2),
      tt = new Set();
    for (const et of ft) (tt.add(et.src), tt.add(et.dst));
    for (const et of tt) {
      if (et === K || et === V) continue;
      const nt = e.nodeById.get(et);
      nt != null && nt.isDummy && (y[et] = G);
    }
  }
  return { x: y, y: f };
}
c(Ur, "assignCoordinates");
var Wr = 8;
function Kr(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++) ((e ^= t.charCodeAt(n)), (e = Math.imul(e, 16777619)));
  return e >>> 0;
}
c(Kr, "hashString");
function qr(t) {
  let e = t >>> 0;
  return () => {
    e += 1831565813;
    let n = e;
    return (
      (n = Math.imul(n ^ (n >>> 15), n | 1)),
      (n ^= n + Math.imul(n ^ (n >>> 7), n | 61)),
      ((n ^ (n >>> 14)) >>> 0) / 4294967296
    );
  };
}
c(qr, "mulberry32");
function Jr(t, e) {
  const n = [...t],
    o = qr(e);
  for (let s = n.length - 1; s > 0; s--) {
    const r = Math.floor(o() * (s + 1));
    [n[s], n[r]] = [n[r], n[s]];
  }
  return n;
}
c(Jr, "deterministicShuffle");
function Zr(t, e) {
  var o;
  let n = 0;
  for (const [s, r] of t.entries()) n += Math.abs(s - ((o = e.get(r)) != null ? o : s));
  return n;
}
c(Zr, "sourceDistance");
function mo(t, e) {
  const n = new Map();
  for (const [s, r] of t.entries()) n.set(r, s);
  let o = 0;
  for (const { a: s, b: r, weight: d } of e) {
    const l = n.get(s),
      p = n.get(r);
    l == null || p == null || (o += d * Math.abs(l - p));
  }
  return o;
}
c(mo, "laneArrangementCost");
function Qr(t) {
  var r;
  const e = Tn(t);
  if (e.length < 2) return [];
  const n = new Map(e.map((d, l) => [d, l])),
    o = we(t),
    s = new Map();
  for (const d of (r = t.layout.edges) != null ? r : []) {
    if (d.isLayoutOnly) continue;
    const l = typeof d.start == "string" ? d.start : void 0,
      p = typeof d.end == "string" ? d.end : void 0;
    if (!l || !p || !t.nodeById.has(l) || !t.nodeById.has(p)) continue;
    const y = o(l),
      f = o(p);
    if (!y || !f || y === f) continue;
    const g = n.get(y),
      M = n.get(f);
    if (g == null || M == null) continue;
    const [i, u] = g <= M ? [y, f] : [f, y],
      h = `${i}\0${u}`,
      x = s.get(h);
    x ? x.weight++ : s.set(h, { a: i, b: u, weight: 1 });
  }
  return [...s.values()];
}
c(Qr, "buildWeightedLaneEdges");
function yo(t, e, n) {
  const o = [...t];
  let s = mo(o, e),
    r = !0,
    d = 0;
  const l = Math.max(1, o.length);
  for (; r && d < l;) {
    ((r = !1), d++);
    for (let p = 0; p + 1 < o.length; p++) {
      [o[p], o[p + 1]] = [o[p + 1], o[p]];
      const y = mo(o, e);
      y < s ? ((s = y), (r = !0)) : ([o[p], o[p + 1]] = [o[p + 1], o[p]]);
    }
  }
  return { order: o, cost: s, sourceDistance: Zr(o, n) };
}
c(yo, "greedySwitch");
function ti(t, e) {
  return t.cost !== e.cost ? t.cost < e.cost : t.sourceDistance < e.sourceDistance;
}
c(ti, "isBetterCandidate");
function ei(t, e, n) {
  const o = [...e]
    .sort((s, r) => (s.a === r.a ? s.b.localeCompare(r.b) : s.a.localeCompare(r.a)))
    .map(({ a: s, b: r, weight: d }) => `${s}:${r}:${d}`)
    .join("|");
  return Kr(`${t.join("|")}#${o}#${n}`);
}
c(ei, "seedForRestart");
function ni(t, e = {}) {
  var l;
  const n = Tn(t);
  if (n.length < 2) return n;
  const o = Qr(t);
  if (o.length === 0) return n;
  const s = new Map(n.map((p, y) => [p, y]));
  let r = yo(n, o, s);
  const d = Math.max(0, (l = e.restarts) != null ? l : Wr);
  for (let p = 0; p < d; p++) {
    const y = ei(n, o, p),
      f = Jr(n, y),
      g = yo(f, o, s);
    ti(g, r) && (r = g);
  }
  return r.order;
}
c(ni, "optimizeTopLaneOrder");
function oi(t, e) {
  var i, u, h, x;
  const n = (i = e == null ? void 0 : e.ignoreCrossLaneEdges) != null ? i : !0,
    o = (u = e == null ? void 0 : e.optimizeRanksByCrossings) != null ? u : !0,
    s = Oe(t),
    r = e != null && e.automaticLaneOrdering ? ni(s, { restarts: Wr }) : void 0,
    d = Cr(s),
    l = d.acyclic,
    p = n
      ? Gr(l, {
          compactSingleInput:
            (h = e == null ? void 0 : e.compactSingleInput) != null ? h : Sn.DEFAULT_COMPACT_SINGLE_INPUT,
          ignoreCrossLaneEdges: !0,
          direction: e == null ? void 0 : e.direction,
        })
      : Xr(l, {
          compactSingleInput:
            (x = e == null ? void 0 : e.compactSingleInput) != null ? x : Sn.DEFAULT_COMPACT_SINGLE_INPUT,
          ignoreCrossLaneEdges: !1,
          optimizeRanksByCrossings: o,
        }),
    { layering: y, graphWithDummies: f } = $r(p, l),
    g = jr(y, f, { laneOrder: r }),
    M = Ur(g, f, {
      layerGap: e == null ? void 0 : e.layerGap,
      nodeGap: e == null ? void 0 : e.nodeGap,
      direction: e == null ? void 0 : e.direction,
      laneOrder: r,
    });
  return { acyclic: l, reversed: d.reversed, layering: y, ordered: g, coordinates: M };
}
c(oi, "sugiyamaLayout");
var It = Ei.EPSILON,
  Ai = 8,
  ke = 15,
  Ve = 15,
  dn = 25,
  pe = 20,
  _n = 10;
function po(t, e, n) {
  var f, g;
  const o = (f = t.x) != null ? f : 0,
    s = (g = t.y) != null ? g : 0,
    r = e.x - o,
    d = e.y - s,
    l = Math.abs(r),
    p = Math.abs(d);
  return l < It && p < It
    ? n
    : p > It && p * 3 >= l
      ? d > 0
        ? "bottom"
        : "top"
      : l > It
        ? r > 0
          ? "right"
          : "left"
        : n;
}
c(po, "chooseOrthogonalSide");
function xo(t, e) {
  return Math.abs(t.to - e.from) < It || Math.abs(t.to - e.to) < It ? t.to : t.from;
}
c(xo, "sharedLineEndpointCoord");
function Fe(t, e) {
  return t.orient === "vertical" ? { x: t.coord, y: e } : { x: e, y: t.coord };
}
c(Fe, "pointOnLine");
function si(t, e) {
  var F,
    _,
    $,
    q,
    ot,
    z,
    Z,
    it,
    ct,
    Rt,
    Bt,
    ae,
    Zt,
    se,
    He,
    Xe,
    Je,
    Ho,
    Xo,
    Yo,
    Go,
    $o,
    zo,
    Vo,
    jo,
    Uo,
    Wo,
    Ko,
    qo,
    Jo,
    Zo,
    Qo,
    ts,
    es,
    ns,
    os,
    ss,
    rs,
    is,
    cs,
    as,
    ls,
    fs,
    ds,
    us,
    hs,
    gs,
    ms,
    ys;
  const n = (F = t.nodes) != null ? F : [],
    o = (_ = t.edges) != null ? _ : [],
    s = [];
  for (const b of o) b.isLayoutOnly || s.push({ ...b, __originalEdge: b });
  const r = new Map(),
    d = new Map(),
    l = [],
    p = e === "LR";
  for (const b of n) r.set(b.id, b);
  const y = n.filter((b) => b.isGroup && !b.parentId);
  for (const b of y) {
    const T = { id: b.id },
      B = c((A) => {
        (d.set(A.id, T), n.filter((P) => P.parentId === A.id).forEach(B));
      }, "assignLane");
    B(b);
  }
  const f = n
      .filter((b) => !b.isGroup && !b.isEdgeLabel)
      .map((b) => {
        var Q, lt, U, Y;
        const T = (Q = b.width) != null ? Q : 10,
          B = (lt = b.height) != null ? lt : 10,
          A = (U = b.x) != null ? U : 0,
          P = (Y = b.y) != null ? Y : 0,
          X = Ai;
        return {
          nodeId: b.id,
          minX: A - T / 2 - X,
          maxX: A + T / 2 + X,
          minY: P - B / 2 - X,
          maxY: P + B / 2 + X,
          visualXHalfExtent: p ? B / 2 + X : T / 2 + X,
        };
      }),
    g = c((b, T, B, A) => {
      let P = l.find((X) => X.orientation === b && Math.abs(X.coord - T) < 1);
      return (
        P ||
          ((P = { id: `pipe-${b}-${T.toFixed(0)}`, orientation: b, coord: T, spanMin: B, spanMax: A, tracks: [] }),
          l.push(P)),
        (P.spanMin = Math.min(P.spanMin, B)),
        (P.spanMax = Math.max(P.spanMax, A)),
        P
      );
    }, "getOrAddPipe"),
    M = c((b, T) => {
      var Q, lt, U, Y;
      const B = (Q = b.width) != null ? Q : 10,
        A = (lt = b.height) != null ? lt : 10,
        P = (U = b.x) != null ? U : 0,
        X = (Y = b.y) != null ? Y : 0;
      switch (T) {
        case "top":
          return { x: P, y: X - A / 2 };
        case "bottom":
          return { x: P, y: X + A / 2 };
        case "left":
          return { x: P - B / 2, y: X };
        case "right":
          return { x: P + B / 2, y: X };
      }
    }, "portForSide"),
    i = c((b, T, B) => M(b, po(b, T, B ? "bottom" : "top")), "getOrthogonalPort"),
    u = [],
    h = [],
    x = new Set(),
    I = 1e3,
    v = c((b, T, B) => {
      if (u.length === 0) return 0;
      const A = Math.abs(T.y - B.y) < It,
        P = Math.abs(T.x - B.x) < It;
      if (!A && !P) return 0;
      let X = 0;
      if (A) {
        const Q = T.y,
          lt = Math.min(T.x, B.x) - It,
          U = Math.max(T.x, B.x) + It;
        if (U <= lt) return 0;
        for (const Y of u)
          Y.edgeIndex === b ||
            Y.orientation !== "vertical" ||
            Y.pipe.coord < lt ||
            Y.pipe.coord > U ||
            (Y.from - It <= Q && Y.to + It >= Q && (X += I));
      } else if (P) {
        const Q = T.x,
          lt = Math.min(T.y, B.y) - It,
          U = Math.max(T.y, B.y) + It;
        if (U <= lt) return 0;
        for (const Y of u)
          Y.edgeIndex === b ||
            Y.orientation !== "horizontal" ||
            Y.pipe.coord < lt ||
            Y.pipe.coord > U ||
            (Y.from - It <= Q && Y.to + It >= Q && (X += I));
      }
      return X;
    }, "crossingPenalty"),
    E = s
      .map((b, T) => {
        var Y, Ct, xt, ut;
        if (!b.start || !b.end) return { idx: T, crossLane: 0, dx: 0, dy: 0 };
        const B = r.get(b.start),
          A = r.get(b.end),
          P = d.get(b.start),
          X = d.get(b.end),
          Q = P && X && P.id !== X.id ? 1 : 0,
          lt = B && A ? Math.abs(((Y = A.x) != null ? Y : 0) - ((Ct = B.x) != null ? Ct : 0)) : 0,
          U = B && A ? Math.abs(((xt = A.y) != null ? xt : 0) - ((ut = B.y) != null ? ut : 0)) : 0;
        return { idx: T, crossLane: Q, dx: lt, dy: U };
      })
      .sort((b, T) => {
        if (b.crossLane !== T.crossLane) return T.crossLane - b.crossLane;
        const B = b.dx + b.dy,
          A = T.dx + T.dy;
        return Math.abs(B - A) > 1 ? B - A : b.idx - T.idx;
      })
      .map((b) => b.idx),
    C = c((b, T, B, A) => {
      const P = Math.min(b.x, T.x),
        X = Math.max(b.x, T.x),
        Q = Math.min(b.y, T.y),
        lt = Math.max(b.y, T.y);
      return !!f.find((Y) =>
        (B && Y.nodeId === B) || (A && Y.nodeId === A)
          ? !1
          : Math.abs(b.x - T.x) > It
            ? Y.minY < b.y && Y.maxY > b.y && Y.maxX > P && Y.minX < X
            : Y.minX < b.x && Y.maxX > b.x && Y.maxY > Q && Y.minY < lt,
      );
    }, "isSegmentBlocked"),
    a = new Map(),
    m = new Map();
  for (const b of s)
    !b.start ||
      !b.end ||
      b.start === b.end ||
      (m.set(b.start, (($ = m.get(b.start)) != null ? $ : 0) + 1),
      m.set(b.end, ((q = m.get(b.end)) != null ? q : 0) + 1));
  const S = c((b, T) => po(b, T, "bottom"), "determineSide"),
    w = new Map();
  for (const [b, T] of s.entries()) {
    if (!T.start || !T.end || T.start === T.end || (T.points && T.points.length > 0)) continue;
    const B = r.get(T.start),
      A = r.get(T.end);
    if (!B || !A) continue;
    const P = ((ot = A.x) != null ? ot : 0) - ((z = B.x) != null ? z : 0),
      X = ((Z = A.y) != null ? Z : 0) - ((it = B.y) != null ? it : 0);
    w.set(b, {
      edgeIdx: b,
      srcId: T.start,
      dstId: T.end,
      srcSide: S(B, { x: (ct = A.x) != null ? ct : 0, y: (Rt = A.y) != null ? Rt : 0 }),
      dstSide: S(A, { x: (Bt = B.x) != null ? Bt : 0, y: (ae = B.y) != null ? ae : 0 }),
      absDx: Math.abs(P),
      absDy: Math.abs(X),
      dxSign: Math.sign(P),
      dySign: Math.sign(X),
    });
  }
  const L = c(
      (b) =>
        b.srcSide === "top" || b.srcSide === "bottom"
          ? b.absDx === 0
            ? 1 / 0
            : b.absDy / b.absDx
          : b.absDy === 0
            ? 1 / 0
            : b.absDx / b.absDy,
      "preferenceStrength",
    ),
    O = c(
      (b) =>
        b.srcSide === "top" || b.srcSide === "bottom"
          ? b.dxSign >= 0
            ? "right"
            : "left"
          : b.dySign >= 0
            ? "bottom"
            : "top",
      "secondarySide",
    ),
    R = new Map();
  for (const b of w.values()) {
    const T = `${b.srcId}:${b.srcSide}`;
    (R.has(T) || R.set(T, []), R.get(T).push(b));
  }
  const k = new Map(),
    D = c((b, T) => `${b}:${T}`, "loadKey");
  for (const b of w.values())
    (k.set(D(b.srcId, b.srcSide), ((Zt = k.get(D(b.srcId, b.srcSide))) != null ? Zt : 0) + 1),
      k.set(D(b.dstId, b.dstSide), ((se = k.get(D(b.dstId, b.dstSide))) != null ? se : 0) + 1));
  for (const b of R.values())
    if (!(b.length < 2)) {
      b.sort((T, B) => {
        const A = L(T),
          P = L(B);
        return Math.abs(A - P) > 1e-9 ? P - A : T.edgeIdx - B.edgeIdx;
      });
      for (let T = 1; T < b.length; T++) {
        const B = b[T],
          A = O(B),
          P = (He = k.get(D(B.srcId, B.srcSide))) != null ? He : 0,
          X = (Xe = k.get(D(B.srcId, A))) != null ? Xe : 0;
        X >= P || (k.set(D(B.srcId, B.srcSide), P - 1), k.set(D(B.srcId, A), X + 1), (B.srcSide = A));
      }
    }
  const J = c((b) => {
      const T = b == null ? void 0 : b.shape;
      return T === "question" || T === "diamond";
    }, "isDiamondNode"),
    at = new Map();
  for (const b of w.values()) (at.has(b.dstId) || at.set(b.dstId, new Set()), at.get(b.dstId).add(b.dstSide));
  for (const b of w.values()) {
    if (!J(r.get(b.srcId))) continue;
    const T = at.get(b.srcId);
    if (!(T != null && T.has(b.srcSide))) continue;
    const B = O(b);
    if (T.has(B) || ((Je = k.get(D(b.srcId, B))) != null ? Je : 0) > 0) continue;
    const A = (Ho = k.get(D(b.srcId, b.srcSide))) != null ? Ho : 0;
    (k.set(D(b.srcId, b.srcSide), Math.max(0, A - 1)), k.set(D(b.srcId, B), 1), (b.srcSide = B));
  }
  for (const b of w.values()) {
    const { edgeIdx: T, srcId: B, dstId: A, srcSide: P, dstSide: X } = b,
      Q = r.get(B),
      lt = r.get(A),
      U = `${B}:${P}:src`,
      Y = P === "top" || P === "bottom" ? ((Xo = lt.x) != null ? Xo : 0) : (Yo = lt.y) != null ? Yo : 0;
    (a.has(U) || a.set(U, []), a.get(U).push({ edgeIdx: T, oppositeCoord: Y }));
    const Ct = `${A}:${X}:dst`,
      xt = X === "top" || X === "bottom" ? ((Go = Q.x) != null ? Go : 0) : ($o = Q.y) != null ? $o : 0;
    (a.has(Ct) || a.set(Ct, []), a.get(Ct).push({ edgeIdx: T, oppositeCoord: xt }));
  }
  const gt = new Map(),
    mt = 8;
  for (const [b, T] of a) {
    if (T.length < 2) continue;
    T.sort((Nt, $t) => Nt.oppositeCoord - $t.oppositeCoord);
    const B = b.split(":"),
      A = B.slice(0, -2).join(":"),
      P = B[B.length - 2],
      X = B[B.length - 1],
      Q = r.get(A);
    if (!Q) continue;
    const U = P === "left" || P === "right" ? ((zo = Q.height) != null ? zo : 10) : (Vo = Q.width) != null ? Vo : 10,
      Y = Q.shape,
      xt = Y === "question" || Y === "diamond" ? U * 0.3 : U,
      dt = Math.min(20, Math.max(mt, xt / (T.length + 1))),
      Et = -(dt * (T.length - 1)) / 2;
    for (const [Nt, $t] of T.entries()) {
      const Qt = Et + Nt * dt,
        Ye = `${$t.edgeIdx}:${X}`;
      gt.set(Ye, Qt);
    }
  }
  const St = c((b) => {
      var T;
      return !!((T = s[b]) != null && T.labelNodeId);
    }, "edgeHasLabelNode"),
    bt = c((b, T) => {
      var B, A;
      return b
        ? ((B = a.get(`${b}:${T}:src`)) != null ? B : []).some(({ edgeIdx: P }) => St(P)) ||
            ((A = a.get(`${b}:${T}:dst`)) != null ? A : []).some(({ edgeIdx: P }) => St(P))
        : !1;
    }, "faceHasLabelNode"),
    Pt = c(
      (b, T, B) => (T === "top" || T === "bottom" ? { x: b.x + B, y: b.y } : { x: b.x, y: b.y + B }),
      "applyPortOffset",
    ),
    kt = c((b, T, B) => {
      var ut, dt, pt, Et, Nt, $t;
      const A = w.get(b),
        P = { x: (ut = B.x) != null ? ut : 0, y: (dt = B.y) != null ? dt : 0 },
        X = { x: (pt = T.x) != null ? pt : 0, y: (Et = T.y) != null ? Et : 0 },
        Q = (Nt = A == null ? void 0 : A.srcSide) != null ? Nt : S(T, P),
        lt = ($t = A == null ? void 0 : A.dstSide) != null ? $t : S(B, X);
      let U = A ? M(T, A.srcSide) : i(T, P, !0),
        Y = A ? M(B, A.dstSide) : i(B, X, !1);
      const Ct = gt.get(`${b}:src`),
        xt = gt.get(`${b}:dst`);
      return (
        Ct !== void 0 && (U = Pt(U, Q, Ct)),
        xt !== void 0 && (Y = Pt(Y, lt, xt)),
        { pSrcPort: U, pDstPort: Y, srcSide: Q, dstSide: lt }
      );
    }, "portsForEdge");
  for (const b of E) {
    const T = s[b];
    if (((h[b] = []), !T.start || !T.end || (T.points && T.points.length > 0) || T.start === T.end)) continue;
    const B = r.get(T.start),
      A = r.get(T.end);
    if (!B || !A) continue;
    const { pSrcPort: P, pDstPort: X, srcSide: Q, dstSide: lt } = kt(b, B, A),
      U = { ...P },
      Y = { ...X },
      Ct = Q === "top" || Q === "bottom",
      xt = lt === "top" || lt === "bottom";
    if (Ct) {
      const H = P.y > ((jo = B.y) != null ? jo : 0);
      U.y = H ? P.y + pe : P.y - pe;
    } else {
      const H = P.x > ((Uo = B.x) != null ? Uo : 0);
      U.x = H ? P.x + pe : P.x - pe;
    }
    if (xt) {
      const H = X.y > ((Wo = A.y) != null ? Wo : 0);
      Y.y = H ? X.y + pe : X.y - pe;
    } else {
      const H = X.x > ((Ko = A.x) != null ? Ko : 0);
      Y.x = H ? X.x + pe : X.x - pe;
    }
    const ut = c((H, j) => {
        for (const st of f)
          if (!j.includes(st.nodeId) && H.x > st.minX && H.x < st.maxX && H.y > st.minY && H.y < st.maxY)
            return { inside: !0, obstacle: st };
        return { inside: !1 };
      }, "isPointInObstacle"),
      dt = c((H, j, st, wt, Gt) => {
        var qt, vt, te, le;
        if (Gt) {
          const Vt = H.y > ((qt = j.y) != null ? qt : 0);
          return {
            x: ((vt = st.x) != null ? vt : 0) >= H.x ? wt.maxX + ke : wt.minX - ke,
            y: Vt ? wt.maxY + Ve : wt.minY - Ve,
            leavesPositiveSide: Vt,
          };
        }
        const _t = H.x > ((te = j.x) != null ? te : 0),
          zt = ((le = st.y) != null ? le : 0) >= H.y;
        return { x: _t ? wt.maxX + ke : wt.minX - ke, y: zt ? wt.maxY + Ve : wt.minY - Ve, leavesPositiveSide: _t };
      }, "obstacleDetour");
    let pt = [];
    const Et = [T.start, T.end],
      Nt = ut(U, Et);
    if (Nt.inside && Nt.obstacle) {
      const H = Nt.obstacle;
      if (Ct) {
        const j = dt(P, B, A, H, !0);
        ((U.x = j.x), (U.y = j.y));
        const st = j.leavesPositiveSide ? Math.min(H.minY - 2, P.y + pe) : Math.max(H.maxY + 2, P.y - pe);
        pt = [
          { x: P.x, y: st },
          { x: j.x, y: st },
          { x: j.x, y: j.y },
        ];
      } else {
        const j = dt(P, B, A, H, !1),
          st = j.leavesPositiveSide ? Math.min(H.minX - 2, P.x + pe) : Math.max(H.maxX + 2, P.x - pe);
        ((U.x = j.x),
          (U.y = j.y),
          (pt = [
            { x: st, y: P.y },
            { x: st, y: j.y },
            { x: j.x, y: j.y },
          ]));
      }
    }
    let $t = [];
    const Qt = ut(Y, Et);
    if (Qt.inside && Qt.obstacle) {
      const H = Qt.obstacle;
      if (xt) {
        const j = dt(X, A, B, H, !0);
        ((Y.x = j.x),
          (Y.y = j.y),
          ($t = [
            { x: j.x, y: j.y },
            { x: X.x, y: j.y },
          ]));
      } else {
        const j = dt(X, A, B, H, !1);
        ((Y.x = j.x),
          (Y.y = j.y),
          ($t = [
            { x: j.x, y: j.y },
            { x: j.x, y: X.y },
          ]));
      }
    }
    if (pt.length === 0 && $t.length === 0) {
      const H = ke,
        j = Math.abs(U.x - Y.x) < H,
        st = Math.abs(U.y - Y.y) < H,
        wt = gt.get(`${b}:src`) !== void 0 || gt.get(`${b}:dst`) !== void 0,
        Gt =
          ((Zo = (Jo = a.get(`${(qo = T.start) != null ? qo : ""}:${Q}:src`)) == null ? void 0 : Jo.length) != null
            ? Zo
            : 0) +
          ((es = (ts = a.get(`${(Qo = T.start) != null ? Qo : ""}:${Q}:dst`)) == null ? void 0 : ts.length) != null
            ? es
            : 0),
        _t =
          ((ss = (os = a.get(`${(ns = T.end) != null ? ns : ""}:${lt}:src`)) == null ? void 0 : os.length) != null
            ? ss
            : 0) +
          ((cs = (is = a.get(`${(rs = T.end) != null ? rs : ""}:${lt}:dst`)) == null ? void 0 : is.length) != null
            ? cs
            : 0),
        zt = Gt > 1 || _t > 1,
        qt = (ls = m.get((as = T.start) != null ? as : "")) != null ? ls : 0,
        vt = (ds = m.get((fs = T.end) != null ? fs : "")) != null ? ds : 0,
        te = (Gt > 1 && bt(T.start, Q)) || (_t > 1 && bt(T.end, lt)),
        le = Gt <= 1 || qt <= 2,
        Vt = _t <= 1 || vt <= 2;
      if ((j || st) && !wt && (!zt || (zt && !te && le && Vt)) && !C(P, X, T.start, T.end)) {
        ((T.points = [{ ...P }, { ...U }, { ...Y }, { ...X }]), x.add(b));
        const Dt = st ? "horizontal" : "vertical",
          fe = st ? P.y : P.x,
          Ht = st ? Math.min(P.x, X.x) : Math.min(P.y, X.y),
          Yt = st ? Math.max(P.x, X.x) : Math.max(P.y, X.y),
          ue = {
            id: `fast-path-${Dt}-${fe.toFixed(0)}-${b}`,
            orientation: Dt,
            coord: fe,
            spanMin: Ht,
            spanMax: Yt,
            tracks: [],
          };
        u.push({ edgeIndex: b, segmentIndex: 0, orientation: Dt, pipe: ue, trackIndex: 0, from: Ht, to: Yt });
        continue;
      }
    }
    const Ye = g("vertical", U.x, U.y, U.y);
    U.x = Ye.coord;
    const ai = g("vertical", Y.x, Y.y, Y.y);
    Y.x = ai.coord;
    let Te = Math.min(U.x, Y.x) - 50,
      Ee = Math.max(U.x, Y.x) + 50,
      Ge = Math.min(U.y, Y.y) - 50,
      $e = Math.max(U.y, Y.y) + 50;
    for (const H of f) {
      const j = Math.min(U.x, Y.x),
        st = Math.max(U.x, Y.x),
        wt = Math.min(U.y, Y.y),
        Gt = Math.max(U.y, Y.y);
      H.minX < st &&
        H.maxX > j &&
        H.minY < Gt &&
        H.maxY > wt &&
        ((Te = Math.min(Te, H.minX - dn)),
        (Ee = Math.max(Ee, H.maxX + dn)),
        (Ge = Math.min(Ge, H.minY - dn)),
        ($e = Math.max($e, H.maxY + dn)));
    }
    for (const H of f) {
      if (H.maxX < Te || H.minX > Ee || H.maxY < Ge || H.minY > $e) continue;
      const j = ke;
      (g("horizontal", H.minY - j, Te, Ee), g("horizontal", H.maxY + j, Te, Ee));
      const st = Ve;
      (g("vertical", H.minX - st, Ge, $e), g("vertical", H.maxX + st, Ge, $e));
    }
    (g("horizontal", U.y, Te, Ee), g("horizontal", Y.y, Te, Ee));
    const li = l.filter((H) => H.orientation === "horizontal" && H.coord >= Ge && H.coord <= $e),
      fi = l.filter((H) => H.orientation === "vertical" && H.coord >= Te && H.coord <= Ee),
      en = c((H, j) => `${H.toFixed(1)},${j.toFixed(1)}`, "getKey"),
      nn = en(U.x, U.y),
      ps = en(Y.x, Y.y),
      on = new Map(),
      En = new Map(),
      An = new Map(),
      sn = new Set(),
      Be = [];
    (on.set(nn, 0), An.set(nn, "n"), Be.push({ key: nn, f: Math.hypot(Y.x - U.x, Y.y - U.y), pt: U }), sn.add(nn));
    let re = [];
    const Ae = c((H, j) => C(H, j, T.start, T.end), "checkSegmentBlocked"),
      Rn = { x: Y.x, y: U.y },
      di = Ae(U, Rn),
      ui = Ae(Rn, Y),
      hi = di || ui,
      Nn = { x: U.x, y: Y.y },
      gi = Ae(U, Nn),
      mi = Ae(Nn, Y);
    if (
      (hi
        ? gi || mi || (Math.abs(U.x - Y.x) < It ? (re = [U, Y]) : (re = [U, Nn, Y]))
        : Math.abs(U.y - Y.y) < It || Math.abs(U.x - Y.x) < It
          ? (re = [U, Y])
          : (re = [U, Rn, Y]),
      re.length === 0)
    )
      for (; Be.length > 0;) {
        Be.sort((vt, te) => vt.f - te.f);
        const H = Be.shift();
        if ((sn.delete(H.key), H.key === ps)) {
          let vt = ps,
            te = Y;
          for (re = [te]; En.has(vt);) {
            const le = En.get(vt);
            (re.unshift(le), (te = le), (vt = en(le.x, le.y)));
          }
          break;
        }
        const j = H.pt.x,
          st = H.pt.y,
          wt = fi.sort((vt, te) => vt.coord - te.coord),
          Gt = wt.findIndex((vt) => Math.abs(vt.coord - j) < 1),
          _t = li.sort((vt, te) => vt.coord - te.coord),
          zt = _t.findIndex((vt) => Math.abs(vt.coord - st) < 1),
          qt = [];
        (Gt > 0 && qt.push({ x: wt[Gt - 1].coord, y: st }),
          Gt >= 0 && Gt < wt.length - 1 && qt.push({ x: wt[Gt + 1].coord, y: st }),
          zt > 0 && qt.push({ x: j, y: _t[zt - 1].coord }),
          zt >= 0 && zt < _t.length - 1 && qt.push({ x: j, y: _t[zt + 1].coord }));
        for (const vt of qt) {
          const te = Math.min(j, vt.x),
            le = Math.max(j, vt.x),
            Vt = Math.min(st, vt.y),
            ce = Math.max(st, vt.y);
          if (
            f.some((me) =>
              me.nodeId === T.start || me.nodeId === T.end
                ? !1
                : te !== le
                  ? me.minY < st && me.maxY > st && me.maxX > te && me.minX < le
                  : me.minX < j && me.maxX > j && me.maxY > Vt && me.minY < ce,
            )
          )
            continue;
          const Dt = en(vt.x, vt.y),
            fe = Math.abs(vt.x - j) + Math.abs(vt.y - st),
            Ht = v(b, H.pt, vt);
          let Yt = 0;
          const ue = Y.x - U.x,
            ze = Y.y - U.y,
            rn = vt.x - j,
            On = vt.y - st;
          (((ze > 10 && On < -5) || (ze < -10 && On > 5)) && (Yt = Math.abs(On) * 100),
            ((ue > 10 && rn < -5) || (ue < -10 && rn > 5)) && (Yt += Math.abs(rn) * 50));
          let xs = 0;
          const bs = (us = An.get(H.key)) != null ? us : "n",
            Ms = Math.abs(rn) > It ? "h" : "v";
          bs !== "n" && bs !== Ms && (xs = 50);
          const yi = fe + Ht + Yt + xs,
            cn = ((hs = on.get(H.key)) != null ? hs : 1 / 0) + yi,
            Is = Math.abs(Y.x - vt.x) + Math.abs(Y.y - vt.y);
          if (cn < ((gs = on.get(Dt)) != null ? gs : 1 / 0))
            if ((En.set(Dt, H.pt), on.set(Dt, cn), An.set(Dt, Ms), !sn.has(Dt)))
              (Be.push({ key: Dt, f: cn + Is, pt: vt }), sn.add(Dt));
            else {
              const me = Be.findIndex((pi) => pi.key === Dt);
              me !== -1 && (Be[me].f = cn + Is);
            }
        }
      }
    if ((re.length === 0 && (re = [U, { x: U.x, y: Y.y }, Y]), re.length > 4)) {
      const H = re[0],
        j = re[re.length - 1];
      let st = Math.min(H.x, j.x),
        wt = Math.max(H.x, j.x),
        Gt = Math.min(H.y, j.y),
        _t = Math.max(H.y, j.y);
      for (const Vt of re)
        ((st = Math.min(st, Vt.x)), (wt = Math.max(wt, Vt.x)), (Gt = Math.min(Gt, Vt.y)), (_t = Math.max(_t, Vt.y)));
      const zt = wt > Math.max(H.x, j.x),
        qt = st < Math.min(H.x, j.x);
      if (p) {
        const Vt = Ve;
        if (zt) {
          const ce = Math.max(H.x, j.x),
            Jt = Math.min(H.y, j.y),
            Dt = Math.max(H.y, j.y),
            fe = f.filter((Ht) => Ht.minX < ce && Ht.maxX > ce && Ht.minY < Dt && Ht.maxY > Jt);
          if (fe.length > 0) {
            let Ht = Math.max(H.x, j.x);
            for (const Yt of fe) {
              const ue = (Yt.minX + Yt.maxX) / 2;
              if (Yt.visualXHalfExtent === void 0 || isNaN(Yt.visualXHalfExtent)) continue;
              const ze = ue + Yt.visualXHalfExtent + Vt;
              Ht = Math.max(Ht, ze);
            }
            isNaN(Ht) || (wt = Ht);
          }
        }
        if (qt) {
          const ce = f.filter(
            (Jt) => Jt.minX < Math.min(H.x, j.x) + Vt && Jt.minY < Math.max(H.y, j.y) && Jt.maxY > Math.min(H.y, j.y),
          );
          if (ce.length > 0) {
            let Jt = Math.min(H.x, j.x);
            for (const Dt of ce) {
              const Ht = (Dt.minX + Dt.maxX) / 2 - Dt.visualXHalfExtent - Vt;
              Jt = Math.min(Jt, Ht);
            }
            st = Jt;
          }
        }
      }
      const vt = c((Vt) => {
          const ce = j.y > H.y,
            Jt = f.filter((Ht) => {
              const Yt = Math.min(H.x, j.x) < Ht.maxX && Math.max(H.x, j.x) > Ht.minX,
                ue = Math.min(H.y, j.y) < Ht.maxY && Math.max(H.y, j.y) > Ht.minY;
              return Yt && ue;
            });
          let Dt = Jt;
          if (p && Jt.length > 0) {
            const Ht = Jt.filter((Yt) => Yt.minX < Vt && Yt.maxX > Vt);
            Ht.length > 0 && (Dt = Ht);
          }
          if (Dt.length === 0) return j.y;
          const fe = ke;
          if (ce) {
            const Yt = Math.max(...Dt.map((ue) => ue.maxY)) + fe;
            if (Yt < j.y - It) return Yt;
          } else {
            const Yt = Math.min(...Dt.map((ue) => ue.minY)) - fe;
            if (Yt > j.y + It) return Yt;
          }
          return j.y;
        }, "findBestReturnY"),
        te = c((Vt) => {
          const ce = vt(Vt),
            Jt = { x: Vt, y: H.y },
            Dt = { x: Vt, y: ce },
            fe = { x: j.x, y: ce },
            Ht = Ae(H, Jt),
            Yt = Ae(Jt, Dt),
            ue = Ae(Dt, fe),
            ze = ce !== j.y ? Ae(fe, j) : !1;
          return !Ht && !Yt && !ue && !ze ? (Math.abs(ce - j.y) < It ? [H, Jt, Dt, j] : [H, Jt, Dt, fe, j]) : null;
        }, "trySimplifyWithDetourX"),
        le = zt && !qt ? te(wt) : qt && !zt ? te(st) : null;
      le && (re = le);
    }
    const ie = [P, ...pt, ...re, ...$t.reverse(), X];
    if (ie.length >= 3) {
      const H = ie[ie.length - 1],
        j = ie[ie.length - 2],
        st = ie[ie.length - 3],
        wt = Math.abs(st.y - j.y) < It && Math.abs(j.y - H.y) < It,
        Gt = Math.abs(st.x - j.x) < It && Math.abs(j.x - H.x) < It;
      if (wt) {
        const _t = Math.sign(j.x - st.x),
          zt = Math.sign(H.x - st.x);
        _t !== 0 && _t === zt && Math.abs(j.x - st.x) > Math.abs(H.x - st.x) && ie.splice(-2, 1);
      } else if (Gt) {
        const _t = Math.sign(j.y - st.y),
          zt = Math.sign(H.y - st.y);
        _t !== 0 && _t === zt && Math.abs(j.y - st.y) > Math.abs(H.y - st.y) && ie.splice(-2, 1);
      }
    }
    const Se = [ie[0]];
    for (let H = 1; H < ie.length - 1; H++) {
      if (H === 1) {
        Se.push(ie[H]);
        continue;
      }
      const j = Se[Se.length - 1],
        st = ie[H],
        wt = ie[H + 1];
      if (Math.abs(j.y - st.y) < It && Math.abs(st.y - wt.y) < It) {
        const Gt = st.x > j.x,
          _t = wt.x > st.x;
        if (Gt !== _t) {
          Se.push(st);
          continue;
        }
        continue;
      }
      if (Math.abs(j.x - st.x) < It && Math.abs(st.x - wt.x) < It) {
        const Gt = st.y > j.y,
          _t = wt.y > st.y;
        if (Gt !== _t) {
          Se.push(st);
          continue;
        }
        continue;
      }
      Se.push(st);
    }
    Se.push(ie[ie.length - 1]);
    for (let H = 0; H < Se.length - 1; H++) {
      const j = Se[H],
        st = Se[H + 1],
        wt = Math.abs(j.x - st.x) < It ? "vertical" : "horizontal",
        Gt = wt === "vertical" ? j.x : j.y,
        _t = wt === "vertical" ? Math.min(j.y, st.y) : Math.min(j.x, st.x),
        zt = wt === "vertical" ? Math.max(j.y, st.y) : Math.max(j.x, st.x),
        qt = g(wt, Gt, _t, zt),
        vt = { edgeIndex: b, segmentIndex: H, orientation: wt, pipe: qt, trackIndex: 0, from: _t, to: zt };
      (u.push(vt),
        h[b].push(u.length - 1),
        qt.tracks[0] || (qt.tracks[0] = { index: 0, coord: qt.coord, segments: [] }),
        qt.tracks[0].segments.push({ edgeIndex: b, segmentIndex: H, from: _t, to: zt }));
    }
  }
  const Xt = c((b, T) => b.from < T.to && T.from < b.to, "segmentsOverlap"),
    ft = c((b, T, B, A) => {
      const P = !A.segments.some((Q) => (Q.edgeIndex !== T.edgeIndex || Q.segmentIndex !== T.segmentIndex) && Xt(Q, b)),
        X = !B.segments.some((Q) => (Q.edgeIndex !== b.edgeIndex || Q.segmentIndex !== b.segmentIndex) && Xt(Q, T));
      return P && X
        ? ((b.trackIndex = A.index),
          (T.trackIndex = B.index),
          (B.segments = [
            ...B.segments.filter((Q) => Q.edgeIndex !== b.edgeIndex || Q.segmentIndex !== b.segmentIndex),
            { edgeIndex: T.edgeIndex, segmentIndex: T.segmentIndex, from: T.from, to: T.to },
          ]),
          (A.segments = [
            ...A.segments.filter((Q) => Q.edgeIndex !== T.edgeIndex || Q.segmentIndex !== T.segmentIndex),
            { edgeIndex: b.edgeIndex, segmentIndex: b.segmentIndex, from: b.from, to: b.to },
          ]),
          !0)
        : !1;
    }, "trySwapSegmentsAcrossTracks"),
    W = c((b) => {
      const T = b.tracks.length;
      return ((b.tracks[T] = { index: T, coord: b.coord, segments: [] }), T);
    }, "createNewTrack"),
    K = c((b, T) => {
      const B = b.pipe.tracks[b.trackIndex];
      ((B.segments = B.segments.filter((P) => P.edgeIndex !== b.edgeIndex || P.segmentIndex !== b.segmentIndex)),
        (b.trackIndex = T),
        b.pipe.tracks[T].segments.push({
          edgeIndex: b.edgeIndex,
          segmentIndex: b.segmentIndex,
          from: b.from,
          to: b.to,
        }));
    }, "moveSegmentToTrack"),
    V = c((b, T) => {
      const B = h[b.edgeIndex];
      for (const A of B) {
        const P = u[A];
        P.pipe === b.pipe && K(P, T);
      }
    }, "moveSegmentChainToTrack"),
    G = c((b) => {
      const T = h[b.edgeIndex],
        B = T.indexOf(u.indexOf(b)),
        A = [];
      return (B > 0 && A.push(u[T[B - 1]]), B < T.length - 1 && A.push(u[T[B + 1]]), A);
    }, "getAdjacentSegmentsAlongEdge"),
    tt = c((b, T) => {
      if (b.orientation === T.orientation) return !1;
      const B = b.orientation === "horizontal" ? b : T,
        A = b.orientation === "horizontal" ? T : b;
      return A.pipe.coord > B.from && A.pipe.coord < B.to && B.pipe.coord > A.from && B.pipe.coord < A.to;
    }, "haveAnyCrossing"),
    et = c((b, T) => {
      for (const B of b.tracks)
        if (!B.segments.some((P) => (P.edgeIndex !== T.edgeIndex || P.segmentIndex !== T.segmentIndex) && Xt(P, T)))
          return B.index;
      return -1;
    }, "findAvailableTrack"),
    nt = c((b, T) => {
      if (b.trackIndex === T.trackIndex) return Xt(b, T);
      const B = G(b),
        A = G(T);
      return B.some((P) => A.some((X) => tt(P, X)));
    }, "segmentsConflict"),
    yt = c((b, T, B) => {
      if (ft(b, T, b.pipe.tracks[b.trackIndex], T.pipe.tracks[T.trackIndex])) return;
      const A = et(b.pipe, T);
      B(T, A !== -1 ? A : W(b.pipe));
    }, "resolveTrackConflict"),
    Lt = c((b) => {
      let T = 0;
      for (let B = 0; B < b.length; B++)
        for (let A = B + 1; A < b.length; A++) {
          const P = b[B],
            X = b[A];
          P.pipe === X.pipe && nt(P, X) && (T++, yt(P, X, V));
        }
      return T;
    }, "resolveHandleConflicts"),
    Ft = new Map(),
    Wt = c((b) => {
      if (Ft.has(b)) return Ft.get(b);
      const T = h[b];
      if (T.length === 0) {
        const lt = { dest: 0, deviation: 0, base: 0, delta: 0 };
        return (Ft.set(b, lt), lt);
      }
      const A = u[T[0]].pipe.coord;
      let P = A;
      for (let lt = 1; lt < T.length; lt++) {
        const U = u[T[lt]];
        if (U.orientation === "horizontal") {
          const Y = U.from,
            Ct = U.to;
          P = Math.abs(Y - A) > Math.abs(Ct - A) ? Y : Ct;
          break;
        }
      }
      const X = Math.abs(P - A),
        Q = { dest: P, deviation: X, base: A, delta: P - A };
      return (Ft.set(b, Q), Q);
    }, "getDestInfo"),
    oe = c(() => {
      let b = 0;
      const T = new Map();
      for (const [A, P] of s.entries())
        h[A].length !== 0 && P.start && (T.has(P.start) || T.set(P.start, []), T.get(P.start).push(A));
      const B = c((A) => {
        var Y, Ct, xt, ut;
        const P = s[A];
        if (!P.start || !P.end) return 0;
        const X = r.get(P.start),
          Q = r.get(P.end);
        if (!X || !Q) return 0;
        const lt = ((Y = Q.x) != null ? Y : 0) - ((Ct = X.x) != null ? Ct : 0),
          U = ((xt = Q.y) != null ? xt : 0) - ((ut = X.y) != null ? ut : 0);
        return Math.abs(lt) + Math.abs(U);
      }, "getEdgeDistance");
      for (const A of T.values()) {
        A.sort((X, Q) => {
          const lt = Wt(X),
            U = Wt(Q);
          if (Math.abs(lt.deviation - U.deviation) > 1) return lt.deviation - U.deviation;
          if (Math.abs(lt.dest - U.dest) > 1) return lt.dest - U.dest;
          const Y = B(X),
            Ct = B(Q);
          if (Math.abs(Y - Ct) > 1) return Ct - Y;
          const xt = h[X].length,
            ut = h[Q].length;
          if (xt !== ut) return xt - ut;
          if (xt === 1) {
            const dt = h[X][0],
              pt = h[Q][0];
            if (u[dt] && u[pt]) {
              const Et = u[dt],
                Nt = u[pt],
                $t = Math.abs(Et.to - Et.from),
                Qt = Math.abs(Nt.to - Nt.from);
              if (Math.abs($t - Qt) > 1) return $t - Qt;
            }
          }
          return 0;
        });
        const P = A.map((X) => u[h[X][0]]);
        b += Lt(P);
      }
      return b;
    }, "fixSourceHandleCrossings"),
    be = c(() => {
      let b = 0;
      const T = new Map();
      for (const [B, A] of s.entries())
        h[B].length !== 0 && A.end && (T.has(A.end) || T.set(A.end, []), T.get(A.end).push(B));
      for (const B of T.values()) {
        B.sort((P, X) => {
          const Q = c((Y) => {
              const Ct = h[Y];
              if (Ct.length < 2) return 0;
              const xt = u[Ct[Ct.length - 2]];
              return Math.abs(xt.to - xt.from);
            }, "getDist"),
            lt = Q(P),
            U = Q(X);
          return Math.abs(lt - U) > 0.1 ? lt - U : P - X;
        });
        const A = B.map((P) => u[h[P][h[P].length - 1]]);
        b += Lt(A);
      }
      return b;
    }, "fixTargetHandleCrossings"),
    Pe = c(() => {
      let b = 0;
      for (const T of l) {
        const B = [];
        for (const A of T.tracks)
          for (const P of A.segments) {
            const X = h[P.edgeIndex].find((Q) => u[Q].segmentIndex === P.segmentIndex);
            X !== void 0 && B.push(u[X]);
          }
        B.sort((A, P) => A.edgeIndex - P.edgeIndex || A.segmentIndex - P.segmentIndex);
        for (let A = 0; A < B.length; A++)
          for (let P = A + 1; P < B.length; P++) {
            const X = B[A],
              Q = B[P];
            nt(X, Q) && (b++, yt(X, Q, K));
          }
      }
      return b;
    }, "fixPipeCrossings");
  let De = 0;
  const tn = 10;
  for (; De < tn;) {
    let b = 0;
    if (((b += oe()), (b += be()), (b += Pe()), b === 0)) break;
    De++;
  }
  const qe = new Map();
  for (const b of l) {
    const T = [];
    (b.tracks.forEach((A) => {
      A.segments.forEach((P) => {
        T.push({ edgeIndex: P.edgeIndex, segmentIndex: P.segmentIndex, trackIndex: A.index, from: P.from, to: P.to });
      });
    }),
      T.sort((A, P) => A.from - P.from));
    const B = [];
    if (T.length > 0) {
      let A = [T[0]],
        P = T[0].to;
      for (let X = 1; X < T.length; X++) {
        const Q = T[X];
        Q.from < P ? (A.push(Q), (P = Math.max(P, Q.to))) : (B.push(A), (A = [Q]), (P = Q.to));
      }
      B.push(A);
    }
    for (const A of B) {
      const P = new Set();
      A.forEach((dt) => P.add(dt.trackIndex));
      const X = new Map();
      A.forEach((dt) => {
        var Et;
        const pt = Wt(dt.edgeIndex);
        X.set(dt.trackIndex, ((Et = X.get(dt.trackIndex)) != null ? Et : 0) + pt.delta);
      });
      const Q = [...P].filter((dt) => {
          var pt;
          return ((pt = X.get(dt)) != null ? pt : 0) < -1;
        }),
        lt = [...P].filter((dt) => {
          var pt;
          return ((pt = X.get(dt)) != null ? pt : 0) > 1;
        }),
        U = [...P].filter((dt) => {
          var pt;
          return Math.abs((pt = X.get(dt)) != null ? pt : 0) <= 1;
        });
      (Q.sort((dt, pt) => {
        var Et, Nt;
        return ((Et = X.get(pt)) != null ? Et : 0) - ((Nt = X.get(dt)) != null ? Nt : 0);
      }),
        lt.sort((dt, pt) => {
          var Et, Nt;
          return ((Et = X.get(dt)) != null ? Et : 0) - ((Nt = X.get(pt)) != null ? Nt : 0);
        }));
      const Y = c((dt, pt) => {
        A.filter((Et) => Et.trackIndex === dt).forEach((Et) => {
          const Nt = x.has(Et.edgeIndex) ? b.coord : pt;
          qe.set(`${Et.edgeIndex}-${Et.segmentIndex}`, Nt);
        });
      }, "assignCoord");
      let Ct = 0;
      for (const dt of Q) (Ct++, Y(dt, b.coord - Ct * _n));
      if (U.length === 0 && P.size > 0) {
        const dt = [...P].sort((Nt, $t) => {
            var Qt, Ye;
            return Math.abs((Qt = X.get(Nt)) != null ? Qt : 0) - Math.abs((Ye = X.get($t)) != null ? Ye : 0);
          })[0],
          pt = Q.indexOf(dt);
        pt !== -1 && Q.splice(pt, 1);
        const Et = lt.indexOf(dt);
        (Et !== -1 && lt.splice(Et, 1), U.push(dt));
      }
      let xt = 0;
      for (const dt of U) {
        if (xt === 0) Y(dt, b.coord);
        else {
          const pt = xt % 2 === 1 ? 1 : -1,
            Et = Math.ceil(xt / 2);
          Y(dt, b.coord + pt * Et * _n * 0.5);
        }
        xt++;
      }
      let ut = 0;
      for (const dt of lt) (ut++, Y(dt, b.coord + ut * _n));
    }
  }
  for (const [b, T] of s.entries()) {
    const B = (ms = h[b]) != null ? ms : [];
    if (B.length === 0) continue;
    const A = [],
      P = r.get(T.start),
      X = r.get(T.end),
      { pSrcPort: Q, pDstPort: lt } = kt(b, P, X),
      U = B.map((xt) => {
        var pt;
        const ut = u[xt],
          dt = (pt = qe.get(`${ut.edgeIndex}-${ut.segmentIndex}`)) != null ? pt : ut.pipe.coord;
        return { orient: ut.orientation, coord: dt, from: ut.from, to: ut.to };
      });
    A.push(Q);
    for (let xt = 0; xt < U.length; xt++) {
      const ut = U[xt],
        dt = A[A.length - 1],
        pt = ut.orient === "vertical" ? dt.y : dt.x,
        Et = ut.orient === "vertical" ? dt.x : dt.y,
        Nt = U[xt + 1],
        $t = xt < U.length - 1;
      if ((Math.abs(Et - ut.coord) > It && A.push(Fe(ut, pt)), $t && Nt.orient === ut.orient))
        if (Math.abs(ut.coord - Nt.coord) > It) {
          const Qt = ut.orient === "vertical" ? (pt + Nt.from) / 2 : xo(ut, Nt);
          A.push(Fe(ut, Qt), Fe(Nt, Qt));
        } else (xt === 0 || xt === U.length - 2) && A.push(Fe(ut, xo(ut, Nt)));
      else if ($t) A.push(Fe(ut, Nt.coord));
      else {
        const Qt = Math.abs(ut.from - pt) < Math.abs(ut.to - pt) ? ut.to : ut.from;
        A.push(Fe(ut, Qt));
      }
    }
    const Y = A[A.length - 1];
    (Math.abs(Y.x - lt.x) > It || Math.abs(Y.y - lt.y) > It) && A.push(lt);
    const Ct = [];
    A.length > 0 && Ct.push(A[0]);
    for (let xt = 1; xt < A.length; xt++) {
      const ut = A[xt],
        dt = Ct[Ct.length - 1];
      (Math.abs(ut.x - dt.x) > It || Math.abs(ut.y - dt.y) > It) && Ct.push(ut);
    }
    T.points = Ct;
  }
  for (const b of s) {
    const T = b.__originalEdge;
    T && b.points && (T.points = b.points);
  }
  t.edges = ((ys = t.edges) != null ? ys : []).filter((b) => !b.isLayoutOnly);
  const N = c((b, T) => {
    var Et, Nt, $t, Qt;
    const B = (Et = T.x) != null ? Et : 0,
      A = (Nt = T.y) != null ? Nt : 0,
      P = ($t = T.width) != null ? $t : 0,
      X = (Qt = T.height) != null ? Qt : 0;
    if (P <= 0 || X <= 0) return b;
    const Q = B - P / 2,
      lt = B + P / 2,
      U = A - X / 2,
      Y = A + X / 2;
    if (b.x < Q || b.x > lt || b.y < U || b.y > Y) return b;
    const Ct = b.x - Q,
      xt = lt - b.x,
      ut = b.y - U,
      dt = Y - b.y,
      pt = Math.min(Ct, xt, ut, dt);
    return pt === Ct
      ? { x: Q, y: b.y }
      : pt === xt
        ? { x: lt, y: b.y }
        : pt === ut
          ? { x: b.x, y: U }
          : { x: b.x, y: Y };
  }, "nodeBoundaryClamp");
  for (const b of t.edges) {
    const T = b.points;
    if (!T || T.length < 2) continue;
    const B = b.start,
      A = b.end,
      P = B ? r.get(B) : void 0,
      X = A ? r.get(A) : void 0;
    (P && (T[0] = N(T[0], P)), X && (T[T.length - 1] = N(T[T.length - 1], X)));
  }
  return t;
}
c(si, "routeEdgesOrthogonal");
function ri(t) {
  var e;
  return (e = t.direction) != null ? e : "TB";
}
c(ri, "getSwimlaneDirection");
function ii(t) {
  var f, g, M, i, u, h, x, I, v, E, C, a;
  const e = Gs(t),
    n = (g = (f = t.config.flowchart) == null ? void 0 : f.nodeSpacing) != null ? g : 40,
    o = (i = (M = t.config.flowchart) == null ? void 0 : M.rankSpacing) != null ? i : 100,
    s = (h = (u = t.config.swimlane) == null ? void 0 : u.ignoreCrossLaneEdges) != null ? h : !0,
    r = (I = (x = t.config.swimlane) == null ? void 0 : x.optimizeRanksByCrossings) != null ? I : !0,
    d = (E = (v = t.config.swimlane) == null ? void 0 : v.automaticLaneOrdering) != null ? E : !1,
    l = ri(t),
    { ordered: p, coordinates: y } = oi(e, {
      nodeGap: n,
      layerGap: o,
      ignoreCrossLaneEdges: s,
      optimizeRanksByCrossings: r,
      automaticLaneOrdering: d,
      direction: l,
    });
  $s(e, p, y, { nodeGap: n, layerGap: o });
  for (const m of (C = t.edges) != null ? C : []) delete m.points;
  si(t, l);
  for (const m of (a = t.edges) != null ? a : []) (!m.curve || m.curve === "basis") && (m.curve = "rounded");
  return (Ir(t, l), Mr(t), l);
}
c(ii, "runSwimlaneLayoutCore");
function ci(t) {
  Ys(t);
  const e = zs(t);
  ((t.nodes = e.nodes), (t.edges = e.edges));
}
c(ci, "prepareSwimlaneLayout");
var Oi = xi({ prepareLayout: ci, runLayoutCore: ii, afterPaint: Hs });
export { Oi as render };
