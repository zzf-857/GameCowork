import { aq as pi, l as De, _ as c, aD as Ss } from "../index-CKZIQMcw.js";
var Cs = 5,
  ae = 1e-5,
  le = 1e-6;
function me(t) {
  const n = [];
  for (let e = 0; e < t.length - 1; e++) n.push({ a: t[e], b: t[e + 1] });
  return n;
}
c(me, "buildSegmentList");
function ws(t, n, e, o) {
  const s = n.x - t.x,
    r = n.y - t.y,
    d = o.x - e.x,
    l = o.y - e.y,
    x = s * l - r * d;
  if (x === 0) return null;
  const y = e.x - t.x,
    f = e.y - t.y,
    g = (y * l - f * d) / x,
    M = (y * r - f * s) / x;
  return g <= le || g >= 1 - le || M <= le || M >= 1 - le
    ? null
    : { point: { x: t.x + g * s, y: t.y + g * r }, tA: g, tB: M };
}
c(ws, "segmentIntersection");
function He(t) {
  return Math.abs(t.b.x - t.a.x) >= Math.abs(t.b.y - t.a.y);
}
c(He, "isHorizontalSeg");
function Rs(t) {
  const n = [];
  for (let e = 0; e < t.length; e++) {
    const o = t[e],
      s = me(o.points);
    for (let r = e + 1; r < t.length; r++) {
      const d = t[r],
        l = me(d.points);
      for (const [x, y] of s.entries())
        for (const [f, g] of l.entries()) {
          const M = ws(y.a, y.b, g.a, g.b);
          if (!M) continue;
          const i = He(y),
            u = He(g);
          (i !== u ? i : !1)
            ? n.push({ jumpEdgeId: o.id, otherEdgeId: d.id, segIndex: x, t: M.tA, point: M.point })
            : n.push({ jumpEdgeId: d.id, otherEdgeId: o.id, segIndex: f, t: M.tB, point: M.point });
        }
    }
  }
  return n;
}
c(Rs, "findEdgeIntersections");
function Sn(t) {
  const n = Math.round(t * 1e3) / 1e3;
  return Number.isInteger(n) ? `${n}` : `${n}`;
}
c(Sn, "fmt");
function Un(t) {
  return `${Sn(t.x)},${Sn(t.y)}`;
}
c(Un, "pointToString");
function Ns(t) {
  const n = t.b.x - t.a.x,
    e = t.b.y - t.a.y;
  return Math.abs(n) >= Math.abs(e) ? (n >= 0 ? 1 : 0) : e >= 0 ? 1 : 0;
}
c(Ns, "getArcSweepFlag");
var bi = 0.001;
function Os(t, n) {
  if (t.length < 2) return t.map((r) => ({ ...r }));
  const e = t.map((r) => ({ ...r })),
    o = n.arrowTypeStart && Ss[n.arrowTypeStart];
  if (o) {
    const r = t[0],
      d = t[1],
      l = Math.atan2(d.y - r.y, d.x - r.x);
    ((e[0].x = r.x + o * Math.cos(l)), (e[0].y = r.y + o * Math.sin(l)));
  }
  const s = n.arrowTypeEnd && Ss[n.arrowTypeEnd];
  if (s) {
    const r = t.length,
      d = t[r - 2],
      l = t[r - 1],
      x = Math.atan2(l.y - d.y, l.x - d.x);
    ((e[r - 1].x = l.x - s * Math.cos(x)), (e[r - 1].y = l.y - s * Math.sin(x)));
  }
  return e;
}
c(Os, "applyMarkerOffsets");
function Ps(t, n, e, o, s) {
  const r = t.point.x,
    d = t.point.y,
    l = { x: r - n * t.r, y: d - e * t.r },
    x = { x: r + n * t.r, y: d + e * t.r },
    y = [`L${Un(l)}`];
  return (s === "arc" ? y.push(`A${Sn(t.r)},${Sn(t.r)} 0 0 ${o} ${Un(x)}`) : y.push(`M${Un(x)}`), y);
}
c(Ps, "emitJump");
function Xe(t, n, e, o) {
  const s = n.x - t.x,
    r = n.y - t.y,
    d = e.x - n.x,
    l = e.y - n.y,
    x = Math.hypot(s, r),
    y = Math.hypot(d, l);
  if (x < ae || y < ae) return null;
  const f = s / x,
    g = r / x,
    M = d / y,
    i = l / y,
    u = f * M + g * i,
    h = Math.max(-1, Math.min(1, u)),
    p = Math.acos(h);
  if (p < ae || Math.abs(Math.PI - p) < ae) return null;
  const I = Math.min(o / Math.sin(p / 2), x / 2, y / 2);
  return {
    startX: n.x - f * I,
    startY: n.y - g * I,
    endX: n.x + M * I,
    endY: n.y + i * I,
    ctrlX: n.x,
    ctrlY: n.y,
    cutLen: I,
  };
}
c(Xe, "computeRoundedCorner");
function Bs(t, n, e) {
  var y, f, g, M;
  const o = t.points;
  if (o.length < 2) return "";
  const s = Os(o, t),
    r = t.curve === "rounded",
    d = me(s),
    l = new Map();
  for (const i of n) {
    const u = d[i.segIndex];
    if (!u) continue;
    const h = Math.hypot(u.b.x - u.a.x, u.b.y - u.a.y),
      p = (y = l.get(i.segIndex)) != null ? y : [];
    (p.push({ t: i.t, point: i.point, d: i.t * h, r: e.jumpRadius }), l.set(i.segIndex, p));
  }
  const x = [`M${Un(s[0])}`];
  for (let i = 0; i < d.length; i++) {
    const u = d[i],
      h = Math.hypot(u.b.x - u.a.x, u.b.y - u.a.y),
      p = h === 0 ? 0 : (u.b.x - u.a.x) / h,
      I = h === 0 ? 0 : (u.b.y - u.a.y) / h,
      v = Ns(u);
    let A = 0;
    if (r && i > 0) {
      const S = Xe(s[i - 1], s[i], (f = s[i + 1]) != null ? f : s[i], Cs);
      S && (A = S.cutLen);
    }
    let C = h,
      a = null;
    r &&
      i < d.length - 1 &&
      ((a = Xe(s[i], s[i + 1], (g = s[i + 2]) != null ? g : s[i + 1], Cs)), a && (C = h - a.cutLen));
    const m = [...((M = l.get(i)) != null ? M : [])].sort((S, E) => S.t - E.t);
    for (const S of m) S.r = Math.min(S.r, S.d - A, C - S.d);
    for (let S = 0; S < m.length - 1; S++) {
      const E = m[S + 1].d - m[S].d;
      if (m[S].r + m[S + 1].r > E) {
        const L = E / 2;
        ((m[S].r = Math.min(m[S].r, L)), (m[S + 1].r = Math.min(m[S + 1].r, L)));
      }
    }
    for (const S of m) S.r < bi || x.push(...Ps(S, p, I, v, e.jumpStyle));
    r && a
      ? (x.push(`L${Sn(a.startX)},${Sn(a.startY)}`),
        x.push(`Q${Sn(a.ctrlX)},${Sn(a.ctrlY)} ${Sn(a.endX)},${Sn(a.endY)}`))
      : x.push(`L${Un(u.b)}`);
  }
  return x.join(" ");
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
    const n = typeof atob == "function" ? atob(t) : Buffer.from(t, "base64").toString(),
      e = JSON.parse(n);
    if (!Array.isArray(e)) return null;
    const o = [];
    for (const s of e) s && typeof s.x == "number" && typeof s.y == "number" && o.push({ x: s.x, y: s.y });
    return o.length >= 2 ? o : null;
  } catch {
    return null;
  }
}
c(_s, "decodeDataPoints");
function Ds(t, n, e) {
  var y, f, g;
  if (!e.enabled) return;
  const o = t.node();
  if (!o) return;
  const s = new Map();
  for (const M of n) s.set(M.id, M);
  const r = [],
    d = new Map();
  for (const M of n) {
    const i = typeof CSS < "u" && CSS.escape ? CSS.escape(M.id) : M.id,
      u = o.querySelector(`path[data-id="${i}"]`);
    if (!u) continue;
    d.set(M.id, u);
    const h = _s(u.getAttribute("data-points")),
      p = h != null ? h : M.points;
    r.push({ ...M, points: p });
  }
  const l = Rs(r);
  if (l.length === 0) return;
  const x = new Map();
  for (const M of l) {
    const i = (y = x.get(M.jumpEdgeId)) != null ? y : [];
    (i.push(M), x.set(M.jumpEdgeId, i));
  }
  for (const M of r) {
    const i = x.get(M.id);
    if (!i || i.length === 0) continue;
    const u = s.get(M.id),
      h = u == null ? void 0 : u.curve;
    if (h !== void 0 && !Fs(h)) continue;
    const p = d.get(M.id);
    if (!p) continue;
    if (h === void 0) {
      const m = (f = p.getAttribute("d")) != null ? f : "";
      if (!ks(m)) continue;
    }
    const I = (g = p.getAttribute("style")) != null ? g : "",
      v = /stroke-dasharray\s*:\s*0\s+([\d.]+)\s+[\d.]+\s+([\d.]+)/.exec(I),
      A = v ? Number.parseFloat(v[1]) : null,
      C = v ? Number.parseFloat(v[2]) : null,
      a = Bs(M, i, e);
    if ((p.setAttribute("d", a), A !== null && C !== null && typeof p.getTotalLength == "function")) {
      const m = p.getTotalLength(),
        S = Math.max(0, m - A - C),
        E = `0 ${A} ${S} ${C}`,
        L = I.replace(/stroke-dasharray\s*:[^;]*;?/g, `stroke-dasharray: ${E};`).replace(/;\s*;+/g, ";");
      p.setAttribute("style", L);
    }
  }
}
c(Ds, "applyLineJumpsToSvg");
function Hs(t, { measure: n }) {
  var r, d;
  const e = (d = (r = t.config) == null ? void 0 : r.swimlane) == null ? void 0 : d.lineHops;
  if (e === !1) return;
  const o = e === "gap" ? "gap" : "arc",
    s = t.edges
      .filter((l) => Array.isArray(l.points) && l.points.length >= 2)
      .map((l) => ({
        id: l.id,
        points: l.points,
        curve: l.curve,
        arrowTypeStart: l.arrowTypeStart,
        arrowTypeEnd: l.arrowTypeEnd,
      }));
  Ds(n.groups.edgePaths, s, { enabled: !0, jumpRadius: 6, jumpStyle: o });
}
c(Hs, "applySwimlaneLineJumps");
var Be = "__swimlane_default__",
  Mi = 21,
  vs = 20;
function Ye(t) {
  var n;
  return Math.max((n = t.padding) != null ? n : vs, vs);
}
c(Ye, "topLaneHorizontalPadding");
function Xs(t) {
  const { x: n, y: e, width: o, height: s } = t,
    r = t.swimlaneContentTop;
  if (
    typeof n != "number" ||
    typeof e != "number" ||
    typeof o != "number" ||
    typeof s != "number" ||
    typeof r != "number" ||
    !Number.isFinite(n) ||
    !Number.isFinite(e) ||
    !Number.isFinite(o) ||
    !Number.isFinite(s) ||
    !Number.isFinite(r) ||
    o <= 0 ||
    s <= 0
  ) {
    delete t.groupTitleRect;
    return;
  }
  const d = e - s / 2,
    l = Math.min(r, e + s / 2),
    x = Math.min(Mi, Math.max(0, l - d)),
    y = d + x;
  if (y <= d) {
    delete t.groupTitleRect;
    return;
  }
  t.groupTitleRect = { left: n - o / 2, right: n + o / 2, top: d, bottom: y };
}
c(Xs, "assignTopLaneTitleRect");
function Ys(t) {
  var r, d;
  const n = t.direction,
    e = (r = t.nodes) != null ? r : (t.nodes = []);
  for (const l of (d = t.nodes) != null ? d : [])
    l.isGroup && !l.parentId && ((l.shape = "swimlane"), n && (l.direction = n));
  const o = e.filter((l) => !l.isGroup && !l.parentId);
  if (o.length === 0) return;
  let s = e.find((l) => l.id === Be);
  s
    ? s.isGroup && ((s.shape = "swimlane"), n && (s.direction = n))
    : ((s = { id: Be, label: "", isGroup: !0, shape: "swimlane", padding: 20, ...(n ? { direction: n } : {}) }),
      e.push(s));
  for (const l of o) l.parentId = Be;
}
c(Ys, "prepareLayoutForSwimlanes");
function Gs(t) {
  var x, y, f;
  const n = new Map();
  for (const g of (x = t.nodes) != null ? x : []) n.set(g.id, g);
  const e = [];
  for (const g of (y = t.edges) != null ? y : []) {
    const M = typeof g.start == "string" ? g.start : void 0,
      i = typeof g.end == "string" ? g.end : void 0;
    !M || !i || g.labelNodeId || e.push({ id: g.id, src: M, dst: i, ref: g });
  }
  const o = (f = t.nodes) != null ? f : [],
    s = o.filter((g) => g.isGroup),
    r = o.filter((g) => !g.isGroup);
  return { nodes: [...[...s].reverse(), ...r].map((g) => g.id), edges: e, layout: t, nodeById: n };
}
c(Gs, "toGraphView");
function $s(t, n, e, o) {
  var M, i, u, h, p, I, v, A, C, a, m, S, E, L, O;
  const { layout: s } = t,
    r = t.nodeById,
    d = (M = o == null ? void 0 : o.layerGap) != null ? M : 100,
    l = (i = o == null ? void 0 : o.nodeGap) != null ? i : 40;
  let x = 0;
  for (const R of n.layers) {
    let k = 0;
    for (const D of R) {
      const J = r.get(D);
      if (!J) {
        k++;
        continue;
      }
      ((J.layer = x), (J.order = k));
      const at = (u = e.x[D]) != null ? u : k * l,
        gt = (h = e.y[D]) != null ? h : x * d;
      ((J.x = at), (J.y = gt), k++);
    }
    x++;
  }
  const y = (p = s.nodes) != null ? p : [],
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
      const St = (I = mt.x) != null ? I : e.x[mt.id],
        bt = (v = mt.y) != null ? v : e.y[mt.id],
        Pt = (A = mt.width) != null ? A : 0,
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
        (R.height = (E = R.height) != null ? E : 0));
    else {
      const mt = (L = R.padding) != null ? L : 20,
        St = R.parentId ? mt : 2 * Ye(R),
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
          var tt, nt;
          const V = (tt = W.x) != null ? tt : 0,
            G = (nt = K.x) != null ? nt : 0;
          return V - G;
        }),
        Pt = [],
        kt = [],
        Xt = [];
      for (const W of bt) {
        const K = f.get(W.id);
        if (!K) continue;
        const V = Math.max(0, K.maxX - K.minX) + 2 * Ye(W),
          G = (K.minX + K.maxX) / 2;
        (Pt.push(W.id), kt.push(G), Xt.push(V));
      }
      const ft = Pt.length;
      if (ft > 0) {
        const W = new Map();
        if (ft === 1) W.set(Pt[0], Xt[0]);
        else {
          const K = [];
          for (let et = 0; et < ft - 1; et++) K.push(kt[et + 1] - kt[et]);
          const V = new Array(ft);
          V[0] = 0;
          for (let et = 0; et < ft - 1; et++) V[et + 1] = 2 * K[et] - V[et];
          let G = 0,
            tt = Number.POSITIVE_INFINITY;
          for (let et = 0; et < ft; et++) {
            const yt = Xt[et];
            et % 2 === 0 ? (G = Math.max(G, yt - V[et])) : (tt = Math.min(tt, V[et] - yt));
          }
          let nt = G;
          G <= tt ? (nt = (G + tt) / 2) : (nt = G);
          for (let et = 0; et < ft; et++) {
            const yt = V[et] + (et % 2 === 0 ? nt : -nt),
              Lt = Math.max(Xt[et], yt);
            W.set(Pt[et], Lt);
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
  var d, l, x;
  const n = [],
    e = [],
    o = new Map();
  for (const y of t.nodes) o.set(y.id, y);
  for (const y of t.edges) {
    if (!y.label || y.label.length === 0 || y.isLayoutOnly || y.labelNodeId) continue;
    const f = y.start ? o.get(y.start) : void 0,
      g = y.end ? o.get(y.end) : void 0;
    if (!f || !g) {
      De.warn(Ii, `Edge ${y.id} has missing source or target node`);
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
        labelStyle: Array.isArray(y.labelStyle) ? y.labelStyle[0] : (x = y.labelStyle) != null ? x : "",
        ...(f.dir ? { dir: f.dir } : {}),
      };
    (n.push(h), (y.labelNodeId = M), (y.label = void 0), (y.text = void 0));
    const p = { id: `${y.id}-to-label`, start: y.start, end: M, type: "normal", isLayoutOnly: !0 },
      I = { id: `${y.id}-from-label`, start: M, end: y.end, type: "normal", isLayoutOnly: !0 };
    e.push(p, I);
  }
  const s = [...t.nodes, ...n],
    r = [...t.edges, ...e];
  return { ...t, nodes: s, edges: r };
}
c(zs, "createEdgeLabelNodes");
var en = 0.001;
function bo(t) {
  var r, d, l, x;
  const n = (r = t.x) != null ? r : 0,
    e = (d = t.y) != null ? d : 0,
    o = (l = t.width) != null ? l : 0,
    s = (x = t.height) != null ? x : 0;
  return o > 0 && s > 0 ? { cx: n, cy: e, rect: Wn(n, e, o, s) } : void 0;
}
c(bo, "measuredNodeRect");
function Mo(t) {
  var o;
  if (t.isGroup) return;
  const n = bo(t);
  return n ? { id: String((o = t.id) != null ? o : ""), cx: n.cx, cy: n.cy, rect: n.rect } : void 0;
}
c(Mo, "nodeBoundsInfoFor");
function bn(t, n, e = en) {
  return Math.abs(t.x - n.x) < e && Math.abs(t.y - n.y) < e;
}
c(bn, "samePoint");
function Tt(t, n, e = en) {
  return Math.abs(t.x - n.x) < e;
}
c(Tt, "sameX");
function wt(t, n, e = en) {
  return Math.abs(t.y - n.y) < e;
}
c(wt, "sameY");
function jt(t, n, e = en) {
  return wt(t, n, e) && Math.abs(t.x - n.x) > e;
}
c(jt, "isHorizontalSegment");
function Ut(t, n, e = en) {
  return Tt(t, n, e) && Math.abs(t.y - n.y) > e;
}
c(Ut, "isVerticalSegment");
function un(t, n, e, o) {
  return Math.max(0, Math.min(Math.max(t, n), Math.max(e, o)) - Math.max(Math.min(t, n), Math.min(e, o)));
}
c(un, "overlapLength");
function vn(t, n, e = en) {
  return t.horizontal && n.horizontal && wt(t.a, n.a, e)
    ? un(t.a.x, t.b.x, n.a.x, n.b.x)
    : t.vertical && n.vertical && Tt(t.a, n.a, e)
      ? un(t.a.y, t.b.y, n.a.y, n.b.y)
      : 0;
}
c(vn, "sameAxisSegmentOverlapLength");
function Kn(t, n = en) {
  const e = [];
  for (let o = 0; o < t.length - 1; o++) {
    const s = t[o],
      r = t[o + 1],
      d = jt(s, r, n),
      l = Ut(s, r, n);
    (d || l) && e.push({ index: o, a: s, b: r, horizontal: d, vertical: l });
  }
  return e;
}
c(Kn, "orthogonalSegmentsForPoints");
function xn(t, n = en) {
  const e = Kn(t, n);
  let o = 0;
  for (let s = 1; s < e.length; s++) e[s - 1].horizontal !== e[s].horizontal && o++;
  return o;
}
c(xn, "countOrthogonalBends");
function Ot(t, n = en) {
  const e = [];
  for (const o of t) {
    const s = e.length > 0 ? e[e.length - 1] : void 0;
    (!s || !bn(s, o, n)) && e.push({ x: o.x, y: o.y });
  }
  return e;
}
c(Ot, "dedupeConsecutivePoints");
function Io(t, n = en) {
  if (!t || t.length !== 4) return;
  const [e, o, s, r] = t;
  return jt(e, o, n) && Ut(o, s, n) && jt(s, r, n)
    ? { kind: "HVH", p0: e, p1: o, p2: s, p3: r }
    : Ut(e, o, n) && jt(o, s, n) && Ut(s, r, n)
      ? { kind: "VHV", p0: e, p1: o, p2: s, p3: r }
      : void 0;
}
c(Io, "classifyThreeSegmentRoute");
function Le(t, n, e, o = 0) {
  const s = Math.min(t.x, n.x),
    r = Math.max(t.x, n.x),
    d = Math.min(t.y, n.y),
    l = Math.max(t.y, n.y);
  return r > e.left - o && s < e.right + o && l > e.top - o && d < e.bottom + o;
}
c(Le, "segmentBoundsOverlapRect");
function So(t, n, e = 0) {
  return t.x > n.left + e && t.x < n.right - e && t.y > n.top + e && t.y < n.bottom - e;
}
c(So, "pointInsideRect");
function Vs(t, n) {
  return t.left <= n.left && t.right >= n.right && t.top <= n.top && t.bottom >= n.bottom;
}
c(Vs, "rectContainsRect");
function ye(t, n) {
  return t.left < n.right && t.right > n.left && t.top < n.bottom && t.bottom > n.top;
}
c(ye, "rectsOverlap");
function Ge(t, n) {
  return { left: t.left - n, right: t.right + n, top: t.top - n, bottom: t.bottom + n };
}
c(Ge, "inflateRect");
function Wn(t, n, e, o) {
  return { left: t - e / 2, right: t + e / 2, top: n - o / 2, bottom: n + o / 2 };
}
c(Wn, "rectFromCenterSize");
function mn(t) {
  var n;
  return (n = bo(t)) == null ? void 0 : n.rect;
}
c(mn, "rectOfNodeBounds");
function Dn(t, n) {
  switch (n) {
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
c(Dn, "portForRectSide");
function Co(t, n, e, o, s, r = en) {
  const d = n === "left" || n === "right",
    l = o === "left" || o === "right";
  if (d && l) {
    if ((n === "right" && o === "left" && t.x < e.x) || (n === "left" && o === "right" && t.x > e.x)) {
      if (wt(t, e, r)) return [t, e];
      const g = (t.x + e.x) / 2;
      return [t, { x: g, y: t.y }, { x: g, y: e.y }, e];
    }
    if (n === o) {
      if (wt(t, e, r)) return;
      const g = n === "left" ? Math.min(t.x, e.x) - s : Math.max(t.x, e.x) + s;
      return [t, { x: g, y: t.y }, { x: g, y: e.y }, e];
    }
    return;
  }
  if (!d && !l) {
    if (n === o) {
      if (Tt(t, e, r)) return;
      const M = n === "top" ? Math.min(t.y, e.y) - s : Math.max(t.y, e.y) + s;
      return [t, { x: t.x, y: M }, { x: e.x, y: M }, e];
    }
    if (!((n === "bottom" && o === "top" && t.y < e.y) || (n === "top" && o === "bottom" && t.y > e.y))) return;
    if (Tt(t, e, r)) return [t, e];
    const g = (t.y + e.y) / 2;
    return [t, { x: t.x, y: g }, { x: e.x, y: g }, e];
  }
  if (d && !l) {
    const f = (n === "right" && e.x > t.x) || (n === "left" && e.x < t.x),
      g = (o === "top" && t.y < e.y) || (o === "bottom" && t.y > e.y);
    return f && g ? [t, { x: e.x, y: t.y }, e] : void 0;
  }
  const x = (n === "bottom" && e.y > t.y) || (n === "top" && e.y < t.y),
    y = (o === "left" && t.x < e.x) || (o === "right" && t.x > e.x);
  return x && y ? [t, { x: t.x, y: e.y }, e] : void 0;
}
c(Co, "buildOrthogonalPortPath");
function vo(t, n, e, o) {
  return n === "left" || n === "right"
    ? [t, { x: o, y: t.y }, { x: o, y: e.y }, e]
    : [t, { x: t.x, y: o }, { x: e.x, y: o }, e];
}
c(vo, "buildSameSideTrackPath");
function Ee(t) {
  const n = new Map(),
    e = [];
  for (const o of t) {
    if (o.isEdgeLabel) continue;
    const s = Mo(o);
    s && (n.set(s.id, s), e.push({ id: s.id, rect: s.rect }));
  }
  return { nodeInfoById: n, realNodeRects: e };
}
c(Ee, "collectRealNodeBounds");
function On(t) {
  const n = [],
    e = [];
  for (const o of t) {
    const s = Mo(o);
    if (!s) continue;
    const r = { id: s.id, rect: s.rect };
    o.isEdgeLabel ? e.push(r) : n.push(r);
  }
  return { realNodeRects: n, labelNodeRects: e };
}
c(On, "collectNodeRectEntries");
function js(t, { includeEdgeLabels: n = !0 } = {}) {
  var o, s, r, d;
  const e = [];
  for (const l of t) {
    if (l.isGroup || (!n && l.isEdgeLabel)) continue;
    const x = (o = l.x) != null ? o : 0,
      y = (s = l.y) != null ? s : 0,
      f = (r = l.width) != null ? r : 0,
      g = (d = l.height) != null ? d : 0;
    e.push({ nodeId: l.id, ...Wn(x, y, f, g) });
  }
  return e;
}
c(js, "collectLayoutNodeRects");
function Lo(t, n, e = en) {
  const o = t.start,
    s = t.end;
  if (!o || !s) return;
  const r = n.get(o),
    d = n.get(s);
  if (!(!r || !d))
    return {
      srcId: o,
      dstId: s,
      srcInfo: r,
      dstInfo: d,
      collinearX: Math.abs(r.cx - d.cx) < e,
      collinearY: Math.abs(r.cy - d.cy) < e,
    };
}
c(Lo, "getNodePairGeometry");
function Kt(t, n, e, o = [], s = 0) {
  for (const r of e) if (!o.includes(r.id) && Le(t, n, r.rect, -s)) return !0;
  return !1;
}
c(Kt, "segmentHitsAnyRect");
function Eo(t, n, e, o, s = en, r = 1e-6) {
  const d = wt(t, n, s),
    l = Tt(t, n, s),
    x = wt(e, o, s),
    y = Tt(e, o, s);
  if ((d && x) || (l && y) || !(d || l) || !(x || y)) return !1;
  const f = d ? { a: t, b: n } : { a: e, b: o },
    g = l ? { a: t, b: n } : { a: e, b: o },
    M = f.a.y,
    i = Math.min(f.a.x, f.b.x),
    u = Math.max(f.a.x, f.b.x),
    h = g.a.x,
    p = Math.min(g.a.y, g.b.y),
    I = Math.max(g.a.y, g.b.y);
  if (h < i || h > u || M < p || M > I) return !1;
  const v =
      (Math.abs(h - f.a.x) < r && Math.abs(M - f.a.y) < r) || (Math.abs(h - f.b.x) < r && Math.abs(M - f.b.y) < r),
    A = (Math.abs(h - g.a.x) < r && Math.abs(M - g.a.y) < r) || (Math.abs(h - g.b.x) < r && Math.abs(M - g.b.y) < r);
  return !(v && A);
}
c(Eo, "orthogonalSegmentsCross");
function Us(t, n, e, o, s = en) {
  const r = wt(t, n, s),
    d = Tt(t, n, s),
    l = wt(e, o, s),
    x = Tt(e, o, s);
  return d && x && Tt(t, e, s) ? un(t.y, n.y, e.y, o.y) > s : r && l && wt(t, e, s) ? un(t.x, n.x, e.x, o.x) > s : !1;
}
c(Us, "sameAxisSegmentsOverlap");
function xe(t, n, e, o, { epsilon: s = en, skipDegenerateOther: r = !1 } = {}) {
  for (const d of e) {
    if (d === o || d.isLayoutOnly) continue;
    const l = d.points;
    if (!(!l || l.length < 2))
      for (let x = 0; x < l.length - 1; x++) {
        const y = l[x],
          f = l[x + 1];
        if (!(r && bn(y, f, s)) && (Eo(t, n, y, f, s) || Us(t, n, y, f, s))) return !0;
      }
  }
  return !1;
}
c(xe, "segmentConflictsWithAnyEdge");
function En(t, n, e, o, s = en) {
  const r = wt(t, n, s),
    d = Tt(t, n, s),
    l = wt(e, o, s),
    x = Tt(e, o, s);
  if (!((r && x) || (d && l))) return !1;
  const y = r ? { a: t, b: n } : { a: e, b: o },
    f = r ? { a: e, b: o } : { a: t, b: n },
    g = y.a.y,
    M = Math.min(y.a.x, y.b.x),
    i = Math.max(y.a.x, y.b.x),
    u = f.a.x,
    h = Math.min(f.a.y, f.b.y),
    p = Math.max(f.a.y, f.b.y);
  return u > M + s && u < i - s && g > h + s && g < p - s;
}
c(En, "orthogonalSegmentsStrictlyCross");
function $e(t, n, e) {
  const o = Math.min(n, e),
    s = Math.max(n, e);
  return t > o + en && t < s - en;
}
c($e, "strictlyBetween");
function Ws(t, n, e) {
  return Tt(t, n) && Tt(n, e) ? $e(n.y, t.y, e.y) : wt(t, n) && wt(n, e) ? $e(n.x, t.x, e.x) : !1;
}
c(Ws, "isCollinearIntermediate");
function Ks(t) {
  let n = !1;
  const e = [];
  for (let o = 0; o < t.length; o++) {
    const s = e[e.length - 1],
      r = t[o],
      d = o + 1 < t.length ? t[o + 1] : void 0;
    if (s && d) {
      if (bn(s, d)) {
        (o++, (n = !0));
        continue;
      }
      if (Ws(s, r, d)) {
        n = !0;
        continue;
      }
    }
    e.push(r);
  }
  return { points: e, changed: n };
}
c(Ks, "simplifyPolylineOnce");
function pe(t) {
  const n = [t[0]];
  for (let o = 1; o < t.length; o++) {
    const s = n[n.length - 1],
      r = t[o];
    if (!Tt(s, r) && !wt(s, r)) {
      const d = n.length >= 2 ? n[n.length - 2] : void 0,
        x = (d ? Tt(d, s) : !1) ? { x: s.x, y: r.y } : { x: r.x, y: s.y };
      n.push(x);
    }
    n.push(r);
  }
  const e = [];
  for (const o of n) {
    const s = e[e.length - 1];
    (!s || !bn(s, o)) && e.push(o);
  }
  return e;
}
c(pe, "orthogonalizePolyline");
function Ln(t) {
  if (t.length < 3) return t;
  let n = [...t];
  for (let e = 0; e < 32; e++) {
    const o = Ks(n);
    if (((n = o.points), !o.changed)) break;
  }
  return n;
}
c(Ln, "simplifyPolyline");
var ht = 0.001,
  Si = 0.5,
  Ls = 4;
function To(t, n, e) {
  const o = t;
  if (o.isLayoutOnly || !o.points || o.points.length < e) return;
  const s = o.start ? n.get(o.start) : void 0,
    r = o.end ? n.get(o.end) : void 0;
  return { edge: o, points: o.points, srcRect: s ? mn(s) : void 0, dstRect: r ? mn(r) : void 0 };
}
c(To, "endpointContextFor");
function qs(t, n, e) {
  if (wt(t, n, ht)) return { x: t.x < e.left ? e.left : e.right, y: t.y };
  if (Tt(t, n, ht)) {
    const o = t.y < e.top ? e.top : e.bottom;
    return { x: t.x, y: o };
  }
  return { x: Math.min(e.right, Math.max(e.left, t.x)), y: Math.min(e.bottom, Math.max(e.top, t.y)) };
}
c(qs, "segmentEnterPoint");
function ze(t, n, e) {
  const o = e ? 1 : -1;
  let s = e ? 0 : t.length - 1;
  for (; s >= 0 && s < t.length && So(t[s], n, Si);) s += o;
  if (s < 0 || s >= t.length) return t;
  const r = s - o;
  if (r < 0 || r >= t.length) return t;
  const d = qs(t[s], t[r], n);
  return e ? [d, ...t.slice(s)] : [...t.slice(0, s + 1), d];
}
c(ze, "clipEndpoint");
function Js(t, n) {
  for (const e of t) {
    const o = To(e, n, 2);
    if (!o) continue;
    let s = [...o.points];
    (o.srcRect && (s = ze(s, o.srcRect, !0)),
      o.dstRect && (s = ze(s, o.dstRect, !1)),
      (s = Ln(pe(s))),
      (s = Ao(s, o.srcRect, o.dstRect)),
      (o.edge.points = Ln(pe(s))));
  }
}
c(Js, "clipEdgeEndpointsToNodeBoundaries");
function Ve(t, n, e, o = !1) {
  if (wt(t, n, ht)) {
    if (n.y < e.top - ht || n.y > e.bottom + ht) return n;
    if (o) {
      if (t.x < e.left - ht) return { x: e.left, y: t.y };
      if (t.x > e.right + ht) return { x: e.right, y: t.y };
    }
    return { x: Math.abs(n.x - e.left) <= Math.abs(n.x - e.right) ? e.left : e.right, y: t.y };
  }
  if (Tt(t, n, ht)) {
    if (n.x < e.left - ht || n.x > e.right + ht) return n;
    if (o) {
      if (t.y < e.top - ht) return { x: t.x, y: e.top };
      if (t.y > e.bottom + ht) return { x: t.x, y: e.bottom };
    }
    const s = Math.abs(n.y - e.top) <= Math.abs(n.y - e.bottom);
    return { x: t.x, y: s ? e.top : e.bottom };
  }
  return n;
}
c(Ve, "snapEndpointToBoundary");
function be(t, n, e) {
  const o = t[n];
  for (let s = n + e; s >= 0 && s < t.length; s += e) {
    const r = t[s];
    if (!bn(r, o, ht)) return r;
  }
  return t[n + e];
}
c(be, "firstDistinctAdjacent");
function Me(t, n) {
  const e = t + Ls,
    o = n - Ls;
  return e <= o ? { lo: e, hi: o } : { lo: (t + n) / 2, hi: (t + n) / 2 };
}
c(Me, "cornerClearanceRange");
function je(t, n, e) {
  const { lo: o, hi: s } = Me(n, e);
  return Math.min(s, Math.max(o, t));
}
c(je, "clampToCornerClearance");
function Zs(t) {
  const n = Math.max(...t.map((o) => o.lo)),
    e = Math.min(...t.map((o) => o.hi));
  if (!(n > e)) return { lo: n, hi: e };
}
c(Zs, "intersectRanges");
function Ue(t, n) {
  return n === "left" || n === "right" ? Me(t.top, t.bottom) : Me(t.left, t.right);
}
c(Ue, "clearanceRangeForSide");
function Ie(t, n, e) {
  const o = t.y >= e.top - ht && t.y <= e.bottom + ht,
    s = t.x >= e.left - ht && t.x <= e.right + ht;
  if (wt(t, n, ht) && o) {
    if (Math.abs(t.x - e.left) < ht) return "left";
    if (Math.abs(t.x - e.right) < ht) return "right";
  }
  if (Tt(t, n, ht) && s) {
    if (Math.abs(t.y - e.top) < ht) return "top";
    if (Math.abs(t.y - e.bottom) < ht) return "bottom";
  }
}
c(Ie, "terminalSideForSegment");
function Qn(t) {
  return t === "left" || t === "right";
}
c(Qn, "isHorizontalSide");
function Qs(t, n, e, o, s) {
  const r = [],
    d = e ? Ie(t, n, e) : void 0,
    l = o ? Ie(n, t, o) : void 0;
  return (
    e && d && Qn(d) === s && r.push(Ue(e, d)),
    o && l && Qn(l) === s && r.push(Ue(o, l)),
    r.length > 0 ? Zs(r) : void 0
  );
}
c(Qs, "straightClearanceRange");
function We(t, n, e, o, s) {
  const r = Qs(t, n, e, o, s);
  if (!r) return;
  const d = s ? t.y : t.x,
    l = Math.min(r.hi, Math.max(r.lo, d));
  if (!(Math.abs(l - d) < ht))
    return s
      ? [
          { x: t.x, y: l },
          { x: n.x, y: l },
        ]
      : [
          { x: l, y: t.y },
          { x: l, y: n.y },
        ];
}
c(We, "clearStraightEndpointCornerAxis");
function Ao(t, n, e) {
  var r, d;
  if (t.length !== 2) return t;
  const [o, s] = t;
  return wt(o, s, ht)
    ? (r = We(o, s, n, e, !0)) != null
      ? r
      : t
    : Tt(o, s, ht) && (d = We(o, s, n, e, !1)) != null
      ? d
      : t;
}
c(Ao, "clearStraightEndpointCornerConnections");
function tr(t, n, e) {
  return Qn(e) ? { x: t.x, y: je(t.y, n.top, n.bottom) } : { x: je(t.x, n.left, n.right), y: t.y };
}
c(tr, "cornerClearedEndpoint");
function nr(t, n, e, o, s, r) {
  const d = t.map((l) => ({ ...l }));
  for (let l = n; l >= 0 && l < t.length; l += e) {
    const x = t[l];
    if ((r && !wt(x, o, ht)) || (!r && !Tt(x, o, ht))) break;
    r ? (d[l].y = s.y) : (d[l].x = s.x);
  }
  return d;
}
c(nr, "moveCollinearEndpointRun");
function Ke(t, n, e) {
  if (t.length < 2) return t;
  const o = e ? 0 : t.length - 1,
    s = e ? 1 : -1,
    r = t[o],
    d = be(t, o, s);
  if (!d) return t;
  const l = Ie(r, d, n);
  if (!l) return t;
  const x = Qn(l),
    y = tr(r, n, l);
  return bn(r, y, ht) ? t : nr(t, o, s, r, y, x);
}
c(Ke, "clearEndpointCornerConnection");
function qe(t, n, e) {
  const o = Math.min(t.x, n.x) >= e.left - ht && Math.max(t.x, n.x) <= e.right + ht,
    s = Math.min(t.y, n.y) >= e.top - ht && Math.max(t.y, n.y) <= e.bottom + ht;
  if (Math.abs(t.y - e.top) < ht && Math.abs(n.y - e.top) < ht && o) return "top";
  if (Math.abs(t.y - e.bottom) < ht && Math.abs(n.y - e.bottom) < ht && o) return "bottom";
  if (Math.abs(t.x - e.left) < ht && Math.abs(n.x - e.left) < ht && s) return "left";
  if (Math.abs(t.x - e.right) < ht && Math.abs(n.x - e.right) < ht && s) return "right";
}
c(qe, "borderSideForSegment");
function Je(t, n, e, o) {
  switch (t) {
    case "top":
      return Tt(n, e, ht) && e.y < o.top - ht;
    case "bottom":
      return Tt(n, e, ht) && e.y > o.bottom + ht;
    case "left":
      return wt(n, e, ht) && e.x < o.left - ht;
    case "right":
      return wt(n, e, ht) && e.x > o.right + ht;
  }
}
c(Je, "leavesOutward");
function Ze(t, n, e) {
  if (t.length < 3) return t;
  if (e) {
    const r = qe(t[0], t[1], n);
    return r && Je(r, t[1], t[2], n) ? t.slice(1) : t;
  }
  const o = t.length - 1,
    s = qe(t[o - 1], t[o], n);
  return s && Je(s, t[o - 1], t[o - 2], n) ? t.slice(0, o) : t;
}
c(Ze, "collapseOwnBorderStub");
function er(t, n, e) {
  let o = t;
  if (n) {
    const r = be(o, 0, 1);
    if (r) {
      const d = Ve(r, o[0], n);
      d !== o[0] && (o = [d, ...o.slice(1)]);
    }
    o = Ze(o, n, !0);
  }
  if (e) {
    const r = o.length - 1,
      d = be(o, r, -1);
    if (d) {
      const l = Ve(d, o[r], e, !0);
      l !== o[r] && (o = [...o.slice(0, r), l]);
    }
    o = Ze(o, e, !1);
  }
  const s = Ao(o, n, e);
  return s !== o || o.length === 2 ? s : (n && (o = Ke(o, n, !0)), e && (o = Ke(o, e, !1)), o);
}
c(er, "snapAndCollapseEndpoints");
function Qe(t, n) {
  for (const e of t) {
    const o = To(e, n, 2);
    if (!o) continue;
    const s = Ot(o.points, ht),
      r = er(s, o.srcRect, o.dstRect);
    if (r.length < 3) {
      o.edge.points = r;
      continue;
    }
    const d = [r[0], { ...r[0] }, ...r.slice(1, -1), r[r.length - 1], { ...r[r.length - 1] }];
    o.edge.points = d;
  }
}
c(Qe, "prepareEdgeEndpointsForRenderer");
function wo(t) {
  return new Map(t.map((n) => [n.id, n]));
}
c(wo, "buildNodeMap");
function or(t, n) {
  let e = t.parentId,
    o = null;
  for (; e;) {
    const s = n.get(e);
    if (!(s != null && s.isGroup)) break;
    ((o = s.id), (e = s.parentId));
  }
  return o;
}
c(or, "resolveTopLevelGroupId");
function to(t, n) {
  let e = 0,
    o = t.parentId;
  for (; o;) {
    const s = n.get(o);
    if (!(s != null && s.isGroup)) break;
    (e++, (o = s.parentId));
  }
  return e;
}
c(to, "groupDepth");
function Ro(t) {
  var r, d;
  let n = 1 / 0,
    e = -1 / 0,
    o = 1 / 0,
    s = -1 / 0;
  for (const l of t) {
    const x = l.x,
      y = l.y;
    if (typeof x != "number" || typeof y != "number") continue;
    const f = (r = l.width) != null ? r : 0,
      g = (d = l.height) != null ? d : 0;
    ((n = Math.min(n, x - f / 2)),
      (e = Math.max(e, x + f / 2)),
      (o = Math.min(o, y - g / 2)),
      (s = Math.max(s, y + g / 2)));
  }
  return n === 1 / 0 || o === 1 / 0 ? null : { minX: n, maxX: e, minY: o, maxY: s };
}
c(Ro, "boundsForChildren");
function sr(t, n) {
  var o;
  const e = (o = t.padding) != null ? o : 20;
  ((t.x = (n.minX + n.maxX) / 2),
    (t.y = (n.minY + n.maxY) / 2),
    (t.width = Math.max(0, n.maxX - n.minX) + e),
    (t.height = Math.max(0, n.maxY - n.minY) + e));
}
c(sr, "applyGroupBounds");
function rr(t) {
  const n = wo(t),
    e = t.filter((o) => o.isGroup && o.parentId).sort((o, s) => to(s, n) - to(o, n));
  for (const o of e) {
    const s = t.filter((d) => d.parentId === o.id),
      r = Ro(s);
    r && sr(o, r);
  }
}
c(rr, "recomputeNestedGroupBounds");
function Se(t, n) {
  var x, y, f;
  const e = (x = t.nodes) != null ? x : [],
    o = (y = t.edges) != null ? y : [],
    s = e.filter((g) => !g.isGroup);
  let r = 1 / 0,
    d = -1 / 0;
  for (const g of s) {
    const M = g[n];
    typeof M == "number" && ((r = Math.min(r, M)), (d = Math.max(d, M)));
  }
  if (!Number.isFinite(r) || !Number.isFinite(d)) return !1;
  const l = c((g) => r + d - g, "mirror");
  for (const g of e) {
    const M = g[n];
    typeof M == "number" && (g[n] = l(M));
    const i = g.groupTitleRect;
    i &&
      (g.groupTitleRect =
        n === "x" ? { ...i, left: l(i.right), right: l(i.left) } : { ...i, top: l(i.bottom), bottom: l(i.top) });
  }
  for (const g of o) for (const M of (f = g.points) != null ? f : []) M[n] = l(M[n]);
  return !0;
}
c(Se, "mirrorAxis");
function ir(t) {
  var e;
  return ((e = t.nodes) != null ? e : []).some((o) => !o.isGroup) ? Se(t, "y") : !0;
}
c(ir, "applyBtDirectionTransform");
function cr(t, n = "LR") {
  var D, J, at, gt, mt, St, bt, Pt, kt, Xt, ft;
  const e = (D = t.nodes) != null ? D : [],
    o = (J = t.edges) != null ? J : [],
    s = e.filter((W) => !W.isGroup);
  let r = 1 / 0,
    d = 1 / 0;
  for (const W of s) {
    const K = (at = W.x) != null ? at : 0,
      V = (gt = W.y) != null ? gt : 0;
    (K < r && (r = K), V < d && (d = V));
  }
  if (!Number.isFinite(r) || !Number.isFinite(d)) return !1;
  const l = 36;
  let x = 0,
    y = 0;
  for (const W of s) ((x += (mt = W.width) != null ? mt : 0), (y += (St = W.height) != null ? St : 0));
  const f = x / s.length,
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
          nt = V - r;
        ((K.x = tt), (K.y = nt));
      }
  rr(e);
  const i = e.filter((W) => W.isGroup && !W.parentId);
  if (i.length === 0) return (n === "RL" && Se(t, "x"), !0);
  const u = wo(e),
    h = new Map();
  for (const W of e) {
    if (W.isGroup) continue;
    const K = or(W, u);
    if (!K) continue;
    const V = (kt = h.get(K)) != null ? kt : [];
    (V.push(W), h.set(K, V));
  }
  let p = 0;
  for (const W of i) {
    const K = (Xt = W.padding) != null ? Xt : 0;
    K > p && (p = K);
  }
  const I = [];
  let v = 1 / 0,
    A = -1 / 0;
  for (const W of i) {
    const K = (ft = h.get(W.id)) != null ? ft : [],
      V = Ro(K);
    V &&
      ((v = Math.min(v, V.minX)),
      (A = Math.max(A, V.maxX)),
      I.push({ lane: W, contentTop: V.minY, contentBottom: V.maxY, centerY: (V.minY + V.maxY) / 2 }));
  }
  if (v === 1 / 0 || A === -1 / 0) return !0;
  const C = Math.max(0, A - v),
    a = Math.max(p, 10),
    m = C + 2 * a,
    S = l + m,
    O = (v + A) / 2 - m / 2 - l,
    R = O + S / 2,
    k = Math.max(p, l);
  I.sort((W, K) => W.centerY - K.centerY);
  for (let W = 0; W < I.length; W++) {
    const K = I[W];
    let V, G;
    if ((W === 0 ? (V = K.contentTop - k) : (V = (I[W - 1].contentBottom + K.contentTop) / 2), W === I.length - 1))
      G = K.contentBottom + k;
    else {
      const et = I[W + 1];
      G = (K.contentBottom + et.contentTop) / 2;
    }
    const tt = Math.max(0, G - V),
      nt = (V + G) / 2;
    ((K.lane.x = R),
      (K.lane.y = nt),
      (K.lane.width = S),
      (K.lane.height = tt),
      (K.lane.swimlaneContentTop = K.contentTop),
      (K.lane.groupTitleRect = { left: O, right: O + l, top: V, bottom: G }));
  }
  return (n === "RL" && Se(t, "x"), !0);
}
c(cr, "applyLrDirectionTransform");
var In = 1e-6,
  Ci = 8,
  fe = Ci,
  vi = [0, fe, -fe, 2 * fe, -2 * fe];
function ar(t, n) {
  const { nodeInfoById: e, realNodeRects: o } = Ee(n);
  for (const s of t) {
    if (s.isLayoutOnly) continue;
    const r = s.points;
    if (!r || r.length < 4) continue;
    const d = Io(Ot(r, In), In);
    if (!d) continue;
    const { p3: l } = d,
      x = d.kind === "HVH",
      y = Lo(s, e, In);
    if (!y) continue;
    const { srcId: f, dstId: g, srcInfo: M, dstInfo: i, collinearX: u, collinearY: h } = y;
    if (u || h) continue;
    let p;
    const I = M.rect;
    for (const v of vi) {
      let A, C, a;
      if (x) {
        const R = i.cy > M.cy ? I.bottom : I.top,
          k = M.cx + v;
        if (k <= I.left + In || k >= I.right - In) continue;
        ((A = { x: k, y: R }), (C = { x: k, y: l.y }), (a = { x: l.x, y: l.y }));
      } else {
        const R = i.cx > M.cx ? I.right : I.left,
          k = M.cy + v;
        if (k <= I.top + In || k >= I.bottom - In) continue;
        ((A = { x: R, y: k }), (C = { x: l.x, y: k }), (a = { x: l.x, y: l.y }));
      }
      const m = bn(A, C, In),
        S = bn(C, a, In);
      if ((m && S) || (!m && Kt(A, C, o, [f], 1)) || (!S && Kt(C, a, o, [g], 1))) continue;
      const E = !m && xe(A, C, t, s, { epsilon: In, skipDegenerateOther: !0 }),
        L = !S && xe(C, a, t, s, { epsilon: In, skipDegenerateOther: !0 });
      if (!(E || L)) {
        m ? (p = [C, a]) : S ? (p = [A, C]) : (p = [A, C, a]);
        break;
      }
    }
    p && (s.points = p);
  }
}
c(ar, "portSwapToLShape");
function lr(t, n) {
  var l, x, y, f;
  const { realNodeRects: r, labelNodeRects: d } = On(n.values());
  for (const g of t) {
    if (g.isLayoutOnly) continue;
    const M = g.points;
    if (!M || M.length < 4) continue;
    const i = Ot(M, 0.001);
    if (i.length < 4) continue;
    const u = i.length - 1,
      h = i[u],
      p = i[u - 1],
      I = i[u - 2],
      v = h.x - p.x,
      A = h.y - p.y,
      C = Math.hypot(v, A);
    if (C >= 10 || C < 0.001) continue;
    const a = p.x - I.x,
      m = p.y - I.y;
    if (Math.hypot(a, m) < 0.001) continue;
    const E = jt(p, h, 0.001),
      L = Ut(p, h, 0.001),
      O = jt(I, p, 0.001),
      R = Ut(I, p, 0.001);
    if (!((E && R) || (L && O))) continue;
    const k = g.end,
      D = g.start,
      J = k ? n.get(k) : void 0;
    if (!J) continue;
    const at = (l = J.x) != null ? l : 0,
      gt = (x = J.y) != null ? x : 0,
      mt = mn(J);
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
      const V = n.get(D),
        G = V ? mn(V) : void 0;
      if (G && So(St, G, 2)) continue;
    }
    const Pt = c((V, G) => `${V.x.toFixed(3)},${V.y.toFixed(3)}|${G.x.toFixed(3)},${G.y.toFixed(3)}`, "ownSegmentKey"),
      kt = new Set();
    for (let V = 0; V < i.length - 1; V++) kt.add(Pt(i[V], i[V + 1]));
    const Xt = c((V, G) => {
      for (const tt of t) {
        if (tt === g || tt.isLayoutOnly) continue;
        const nt = tt.points;
        if (!(!nt || nt.length < 2))
          for (let et = 0; et < nt.length - 1; et++) {
            const yt = nt[et],
              Lt = nt[et + 1];
            if (!kt.has(Pt(yt, Lt)) && En(V, G, yt, Lt, 0.001)) return !0;
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
      const V = n.get(K);
      if (V) {
        const G = (y = V.width) != null ? y : 0,
          tt = (f = V.height) != null ? f : 0;
        if (G > 0 && tt > 0) {
          let nt,
            et,
            yt = -1;
          for (let Lt = 0; Lt < W.length - 1; Lt++) {
            const Ft = W[Lt],
              Wt = W[Lt + 1],
              on = Math.hypot(Wt.x - Ft.x, Wt.y - Ft.y),
              Mn = wt(Ft, Wt, 0.001),
              Bn = Tt(Ft, Wt, 0.001);
            ((Mn && on >= G + 2) || (Bn && on >= tt + 2)) &&
              on > yt &&
              ((yt = on), (nt = (Ft.x + Wt.x) / 2), (et = (Ft.y + Wt.y) / 2));
          }
          nt !== void 0 && et !== void 0 && ((V.x = nt), (V.y = et));
        }
      }
    }
  }
}
c(lr, "collapseShortTerminalStub");
var rt = 0.001,
  nn = 8,
  Mt = Kn,
  ke = c((t, n) => Tt(t, n, rt) || wt(t, n, rt), "orthogonallyAligned");
function fr(t, n) {
  const s = c((i, u) => {
      var a, m, S, E;
      const h = (a = i.x) != null ? a : 0,
        p = (m = i.y) != null ? m : 0,
        I = u.x - h,
        v = u.y - p;
      let A = ((S = i.width) != null ? S : 0) / 2,
        C = ((E = i.height) != null ? E : 0) / 2;
      return Math.abs(v) * A > Math.abs(I) * C
        ? (v < 0 && (C = -C), { x: h + (v === 0 ? 0 : (C * I) / v), y: p + C })
        : (I < 0 && (A = -A), { x: h + A, y: p + (I === 0 ? 0 : (A * v) / I) });
    }, "rectIntersect"),
    r = c((i, u) => {
      var S, E, L;
      const h = Ot((S = i.points) != null ? S : []);
      if (h.length < 2) return;
      const p = u ? i.start : i.end,
        I = p ? n.get(p) : void 0,
        v = I ? mn(I) : void 0;
      if (!I || !p || !v) return;
      const A = u ? h[0] : h[h.length - 1],
        C = u ? h[1] : h[h.length - 2],
        a = s(I, A);
      let m = A;
      if ((ke(C, a) && (m = C), Tt(a, m, rt)))
        return {
          edge: i,
          edgeId: String((E = i.id) != null ? E : ""),
          nodeId: p,
          atStart: u,
          orientation: "V",
          coord: a.x,
          min: Math.min(a.y, m.y),
          max: Math.max(a.y, m.y),
          boundary: a,
          railEnd: m,
          rect: v,
        };
      if (wt(a, m, rt))
        return {
          edge: i,
          edgeId: String((L = i.id) != null ? L : ""),
          nodeId: p,
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
              wt(i.boundary, u.boundary, 1),
      "sameTerminalFace",
    ),
    x = c(
      (i, u) =>
        i.nodeId !== u.nodeId || i.orientation !== u.orientation
          ? !1
          : d(i, u) >= nn && Math.abs(i.coord - u.coord) < 0.5,
      "exactTerminalLaneConflict",
    ),
    y = c((i, u) => {
      if (i.nodeId !== u.nodeId || i.orientation !== u.orientation || i.orientation !== "H" || i.atStart === u.atStart)
        return !1;
      const h = d(i, u);
      if (h < nn) return !1;
      const p = i.rect.bottom - i.rect.top;
      return h < p || h > 2 * p ? !1 : l(i, u) && Math.abs(i.coord - u.coord) < 16;
    }, "nearTerminalLaneConflict"),
    f = c((i, u) => {
      var m;
      const h = Ot((m = i.edge.points) != null ? m : []);
      if (h.length < 2) return;
      const p =
          i.orientation === "V" ? { x: i.boundary.x + u, y: i.boundary.y } : { x: i.boundary.x, y: i.boundary.y + u },
        I = i.orientation === "V" ? { x: i.railEnd.x + u, y: i.railEnd.y } : { x: i.railEnd.x, y: i.railEnd.y + u };
      if (
        !c(
          () =>
            Math.abs(i.boundary.y - i.rect.top) < 1 || Math.abs(i.boundary.y - i.rect.bottom) < 1
              ? wt(p, i.boundary, rt) && p.x >= i.rect.left + 1 && p.x <= i.rect.right - 1
              : Math.abs(i.boundary.x - i.rect.left) < 1 || Math.abs(i.boundary.x - i.rect.right) < 1
                ? Tt(p, i.boundary, rt) && p.y >= i.rect.top + 1 && p.y <= i.rect.bottom - 1
                : !1,
          "boundaryStaysOnSameFace",
        )()
      )
        return;
      if (i.atStart) {
        const S = h.length > 1 && bn(h[1], i.railEnd, rt),
          E = h.slice(S ? 2 : 1),
          L = E[0];
        return L && !ke(L, I) ? void 0 : [p, I, ...E];
      }
      const A = h.length > 1 && bn(h[h.length - 2], i.railEnd, rt),
        C = h.slice(0, A ? -2 : -1),
        a = C[C.length - 1];
      if (!(a && !ke(a, I))) return [...C, I, p];
    }, "shiftedCandidate"),
    g = c((i) => {
      var O, R, k, D, J;
      const u = i.edge,
        h = Ot((O = u.points) != null ? O : []);
      if (h.length !== 2) return !1;
      const p = u.start,
        I = u.end,
        v = p ? n.get(p) : void 0,
        A = I ? n.get(I) : void 0;
      if (!v || !A) return !1;
      const C = (R = v.x) != null ? R : 0,
        a = (k = v.y) != null ? k : 0,
        m = (D = A.x) != null ? D : 0,
        S = (J = A.y) != null ? J : 0,
        [E, L] = h;
      return (
        (wt(E, L, rt) && Math.abs(a - S) < 1 && Math.abs(C - m) > 1) ||
        (Tt(E, L, rt) && Math.abs(C - m) < 1 && Math.abs(a - S) > 1)
      );
    }, "laneIsStraightCollinearConnector"),
    M = [-7, 7, -14, 14, -21, 21];
  for (let i = 0; i < 8; i++) {
    const u = t
      .filter((p) => !p.isLayoutOnly)
      .flatMap((p) => [r(p, !0), r(p, !1)])
      .filter((p) => !!p);
    let h = !1;
    for (let p = 0; p < u.length && !h; p++)
      for (let I = p + 1; I < u.length && !h; I++) {
        const v = u[p],
          A = u[I];
        if (v.edge === A.edge || !(x(v, A) || y(v, A))) continue;
        const C = !x(v, A),
          a = [v, A].sort((m, S) => {
            const E = g(m),
              L = g(S);
            return E !== L ? Number(E) - Number(L) : +!S.atStart - +!m.atStart;
          });
        for (const m of a) {
          for (const S of M) {
            const E = f(m, S);
            if (!E) continue;
            const L = r({ ...m.edge, points: E }, m.atStart);
            if (!(!L || u.some((O) => O.edge !== m.edge && (x(L, O) || (C && y(L, O)))))) {
              ((m.edge.points = E), (h = !0));
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
function dr(t, n) {
  var l;
  const { realNodeRects: o, labelNodeRects: s } = On(n.values()),
    r = c((x, y) => {
      const f = x.start,
        g = x.end,
        M = Mt(y);
      if (M.length !== y.length - 1) return !1;
      const i = [f, g].filter((u) => !!u);
      for (const u of M) if (Kt(u.a, u.b, o, i, -2) || Kt(u.a, u.b, s, [], -2)) return !1;
      for (const u of t) {
        if (u === x || u.isLayoutOnly) continue;
        const h = u.points;
        if (!(!h || h.length < 2)) {
          for (const p of M)
            for (const I of Mt(Ot(h))) if (vn(p, I, 0.5) >= nn || En(p.a, p.b, I.a, I.b, rt)) return !1;
        }
      }
      return !0;
    }, "candidateIsSafe"),
    d = c((x, y) => {
      if (y + 4 >= x.length) return;
      const f = x[y],
        g = x[y + 1],
        M = x[y + 2],
        i = x[y + 3],
        u = x[y + 4],
        h =
          jt(f, g) &&
          Ut(g, M) &&
          jt(M, i) &&
          Ut(i, u) &&
          Tt(f, i, rt) &&
          Tt(f, u, rt) &&
          Tt(g, M, rt) &&
          (g.x - f.x) * (i.x - M.x) < 0,
        p =
          Ut(f, g) &&
          jt(g, M) &&
          Ut(M, i) &&
          jt(i, u) &&
          wt(f, i, rt) &&
          wt(f, u, rt) &&
          wt(g, M, rt) &&
          (g.y - f.y) * (i.y - M.y) < 0;
      if (h || p) return Ot([...x.slice(0, y + 1), u, ...x.slice(y + 5)]);
      if (y + 5 >= x.length) return;
      const I = x[y + 5],
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
        A =
          jt(f, g) &&
          Ut(g, M) &&
          jt(M, i) &&
          Ut(i, u) &&
          jt(u, I) &&
          wt(f, u, rt) &&
          wt(f, I, rt) &&
          wt(M, i, rt) &&
          (M.y - g.y) * (u.y - i.y) < 0;
      if (!(!v && !A)) return Ot([...x.slice(0, y + 1), I, ...x.slice(y + 6)]);
    }, "withoutDogleg");
  for (let x = 0; x < 8; x++) {
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
function no(t, n) {
  const { realNodeRects: r, labelNodeRects: d } = On(n.values()),
    l = t.filter((u) => !u.isLayoutOnly),
    x = c((u, h, p) => {
      var I;
      return Ot(u === h ? (p != null ? p : []) : (I = u.points) != null ? I : []);
    }, "pointsFor"),
    y = c((u, h) => {
      let p = 0;
      for (let I = 0; I < l.length; I++) {
        const v = Mt(x(l[I], u, h));
        for (let A = I + 1; A < l.length; A++) {
          const C = Mt(x(l[A], u, h));
          for (const a of v) for (const m of C) En(a.a, a.b, m.a, m.b, rt) && p++;
        }
      }
      return p;
    }, "strictCrossingCount"),
    f = c((u) => {
      const h = Mt(u);
      if (h.length !== 3) return;
      const p = h[1];
      if (!(h[0].horizontal === p.horizontal || h[2].horizontal === p.horizontal))
        return { index: p.index, horizontal: p.horizontal, vertical: p.vertical, segment: p };
    }, "middleRail"),
    g = c((u, h) => {
      const p = [u.start, u.end].filter((I) => !!I);
      return r.filter((I) => {
        if (p.includes(I.id)) return !1;
        const v = I.rect;
        return h.horizontal
          ? un(h.a.x, h.b.x, v.left, v.right) >= nn && h.a.y >= v.top - 2 && h.a.y <= v.bottom + 2
          : un(h.a.y, h.b.y, v.top, v.bottom) >= nn && h.a.x >= v.left - 2 && h.a.x <= v.right + 2;
      });
    }, "blockingRectsFor"),
    M = c((u, h, p) => {
      const I = u.map((A) => ({ ...A }));
      if (h.horizontal) ((I[h.index].y = p), (I[h.index + 1].y = p));
      else if (h.vertical) ((I[h.index].x = p), (I[h.index + 1].x = p));
      else return;
      const v = Ln(Ot(I));
      return Mt(v).length === v.length - 1 ? v : void 0;
    }, "candidateByMovingRail"),
    i = c((u, h, p) => {
      const I = [u.start, u.end].filter((A) => !!A),
        v = Mt(h);
      if (v.length !== h.length - 1) return !1;
      for (const A of v) if (Kt(A.a, A.b, r, I, -2) || Kt(A.a, A.b, d, [], -2)) return !1;
      for (const A of l)
        if (A !== u) {
          for (const C of v) for (const a of Mt(x(A))) if (vn(C, a, 0.5) >= nn) return !1;
        }
      return y(u, h) <= p;
    }, "candidateIsSafe");
  for (let u = 0; u < 8; u++) {
    const h = y();
    let p = !1;
    for (const I of l) {
      const v = x(I),
        A = f(v);
      if (!A) continue;
      const C = g(I, A.segment);
      if (C.length === 0) continue;
      const a = A.horizontal
        ? [Math.min(...C.map((m) => m.rect.top)) - 20, Math.max(...C.map((m) => m.rect.bottom)) + 20]
        : [Math.min(...C.map((m) => m.rect.left)) - 20, Math.max(...C.map((m) => m.rect.right)) + 20];
      for (const m of a) {
        const S = M(v, A.segment, m);
        if (!(!S || !i(I, S, h))) {
          ((I.points = S), (p = !0));
          break;
        }
      }
      if (p) break;
    }
    if (!p) return;
  }
}
c(no, "liftObstacleHuggingSameSideRails");
function eo(t, n) {
  var x;
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
        p = M.bottom - M.top;
      if (!(p <= 0 || h < p)) return { node: y, rect: M };
    }, "topLaneTitleFor"),
    r = c((y, f) => {
      if (!y.horizontal) return !1;
      const g = y.a.y;
      return g <= f.top + rt || g >= f.bottom - rt ? !1 : un(y.a.x, y.b.x, f.left, f.right) >= nn;
    }, "horizontalSegmentIntersectsTitle"),
    d = [...n.values()].map(s).filter((y) => !!y);
  if (d.length === 0) return;
  let l = 0;
  for (const y of t) {
    if (y.isLayoutOnly) continue;
    const f = Ot((x = y.points) != null ? x : []);
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
c(eo, "liftTopLaneTitleBandsAboveRails");
function oo(t, n) {
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
        p = M.bottom - M.top;
      if (!(h <= 0 || p < h)) return { node: f, rect: M };
    }, "leftLaneTitleFor"),
    r = c((f, g) => {
      if (!f.vertical) return !1;
      const M = f.a.x;
      return M <= g.left + rt || M >= g.right - rt ? !1 : un(f.a.y, f.b.y, g.top, g.bottom) >= nn;
    }, "verticalSegmentIntersectsTitle"),
    d = c((f, g) => {
      if (!f.horizontal) return !1;
      const M = f.a.y;
      return M <= g.top + rt || M >= g.bottom - rt ? !1 : un(f.a.x, f.b.x, g.left, g.right) >= nn;
    }, "horizontalSegmentIntersectsTitle"),
    l = [...n.values()].map(s).filter((f) => !!f);
  if (l.length === 0) return;
  let x = 0;
  for (const f of t) {
    if (f.isLayoutOnly) continue;
    const g = Ot((y = f.points) != null ? y : []);
    for (const M of Mt(g))
      for (const i of l)
        if (r(M, i.rect)) x = Math.max(x, i.rect.right - M.a.x + 4);
        else if (d(M, i.rect)) {
          const u = Math.min(M.a.x, M.b.x);
          x = Math.max(x, i.rect.right - u + 4);
        }
  }
  if (!(x <= rt))
    for (const f of l) {
      const g = f.node.x,
        M = f.node.width;
      typeof g != "number" ||
        typeof M != "number" ||
        !Number.isFinite(g) ||
        !Number.isFinite(M) ||
        M <= 0 ||
        ((f.node.x = g - x / 2),
        (f.node.width = M + x),
        (f.node.groupTitleRect = { ...f.rect, left: f.rect.left - x, right: f.rect.right - x }));
    }
}
c(oo, "shiftLeftLaneTitleBandsLeftOfRails");
function ur(t, n) {
  const { realNodeRects: o } = On(n.values()),
    s = t.filter((u) => !u.isLayoutOnly),
    r = c((u, h = new Map()) => {
      var p, I;
      return Ot((I = (p = h.get(u)) != null ? p : u.points) != null ? I : []);
    }, "replacementPointsFor"),
    d = c((u = new Map()) => {
      let h = 0;
      for (let p = 0; p < s.length; p++) {
        const I = Mt(r(s[p], u));
        for (let v = p + 1; v < s.length; v++) {
          const A = Mt(r(s[v], u));
          for (const C of I) for (const a of A) En(C.a, C.b, a.a, a.b, rt) && h++;
        }
      }
      return h;
    }, "crossingCount"),
    l = c((u = new Map()) => s.reduce((h, p) => h + xn(r(p, u)), 0), "totalBends"),
    x = c((u) => {
      const h = r(u);
      if (h.length < 4) return;
      const p = h[h.length - 2],
        I = h[h.length - 1];
      if (!(!jt(p, I, rt) && !Ut(p, I, rt))) return { tailStart: p, terminal: I };
    }, "terminalTailFor"),
    y = c((u, h) => {
      const p = r(u);
      if (p.length < 3) return;
      const I = p[0],
        v = p[1];
      let A;
      if (jt(I, v, rt)) A = { x: v.x, y: h.tailStart.y };
      else if (Ut(I, v, rt)) A = { x: h.tailStart.x, y: v.y };
      else return;
      const C = Ln(Ot([I, v, A, h.tailStart, h.terminal]));
      return Mt(C).length === C.length - 1 ? C : void 0;
    }, "candidateWithDestinationTail"),
    f = c((u, h) => {
      const p = [u.start, u.end].filter((I) => !!I);
      for (const I of Mt(h)) if (Kt(I.a, I.b, o, p, -2)) return !0;
      return !1;
    }, "pathHasNodeHit"),
    g = c((u, h, p) => {
      for (const I of s)
        if (I !== u) {
          for (const v of Mt(h)) for (const A of Mt(r(I, p))) if (vn(v, A, 0.5) >= nn) return !0;
        }
      return !1;
    }, "pathHasSharedTrack"),
    M = c((u, h, p) => !f(u, h) && !g(u, h, p), "candidateIsSafe"),
    i = c(() => {
      var h;
      const u = new Map();
      for (const p of s) {
        const I = p.end;
        if (!I || !n.has(I) || r(p).length < 4) continue;
        const A = (h = u.get(I)) != null ? h : [];
        (A.push(p), u.set(I, A));
      }
      return u;
    }, "edgesByDestination");
  for (let u = 0; u < 4; u++) {
    const h = d();
    if (h === 0) return;
    const p = l();
    let I,
      v = h,
      A = p;
    for (const C of i().values())
      for (let a = 0; a < C.length; a++)
        for (let m = a + 1; m < C.length; m++) {
          const S = C[a],
            E = C[m],
            L = x(S),
            O = x(E);
          if (!L || !O) continue;
          const R = y(S, O),
            k = y(E, L);
          if (!R || !k) continue;
          const D = new Map([
            [S, R],
            [E, k],
          ]);
          if (!M(S, R, D) || !M(E, k, D)) continue;
          const J = d(D),
            at = l(D);
          J >= h || J > v || (J === v && at >= A) || ((I = D), (v = J), (A = at));
        }
    if (!I) return;
    for (const [C, a] of I) C.points = a;
  }
}
c(ur, "swapDestinationTerminalTailsToReduceCrossings");
function hr(t, n) {
  const { realNodeRects: r, labelNodeRects: d } = On(n.values()),
    l = t.filter((C) => !C.isLayoutOnly),
    x = c((C, a = new Map()) => {
      var m, S;
      return Ot((S = (m = a.get(C)) != null ? m : C.points) != null ? S : []);
    }, "replacementPointsFor"),
    y = c((C = new Map()) => {
      let a = 0;
      for (let m = 0; m < l.length; m++) {
        const S = Mt(x(l[m], C));
        for (let E = m + 1; E < l.length; E++) {
          const L = Mt(x(l[E], C));
          for (const O of S) for (const R of L) En(O.a, O.b, R.a, R.b, rt) && a++;
        }
      }
      return a;
    }, "strictCrossingCount"),
    f = c((C = new Map()) => l.reduce((a, m) => a + xn(x(m, C)), 0), "totalBends"),
    g = c((C) => {
      const a = C.start,
        m = C.end,
        S = a ? n.get(a) : void 0,
        E = m ? n.get(m) : void 0,
        L = S ? mn(S) : void 0,
        O = E ? mn(E) : void 0;
      return L && O ? { src: L, dst: O } : void 0;
    }, "endpointRectsFor"),
    M = c((C, a, m) => {
      if (m.index <= 0 || m.index + 1 >= a.length - 1) return;
      const S = g(C);
      if (S) {
        if (m.vertical) {
          const E = m.a.x,
            L = Math.min(S.src.left, S.dst.left),
            O = Math.max(S.src.right, S.dst.right),
            R = E < L - rt ? "left" : E > O + rt ? "right" : void 0;
          return R
            ? {
                edge: C,
                points: a,
                segmentIndex: m.index,
                axis: "vertical",
                side: R,
                coord: E,
                min: Math.min(m.a.y, m.b.y),
                max: Math.max(m.a.y, m.b.y),
              }
            : void 0;
        }
        if (m.horizontal) {
          const E = m.a.y,
            L = Math.min(S.src.top, S.dst.top),
            O = Math.max(S.src.bottom, S.dst.bottom),
            R = E < L - rt ? "top" : E > O + rt ? "bottom" : void 0;
          return R
            ? {
                edge: C,
                points: a,
                segmentIndex: m.index,
                axis: "horizontal",
                side: R,
                coord: E,
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
        const m = x(a);
        for (const S of Mt(m)) {
          const E = M(a, m, S);
          E && C.push(E);
        }
      }
      return C;
    }, "collectExternalRails"),
    u = c(
      (C, a) => C.edge !== a.edge && C.axis === a.axis && C.side === a.side && un(C.min, C.max, a.min, a.max) >= nn,
      "railsInteract",
    ),
    h = c((C) => {
      const a = [],
        m = new Set();
      for (const S of C) {
        if (m.has(S)) continue;
        const E = [S],
          L = [];
        for (m.add(S); E.length > 0;) {
          const O = E.pop();
          L.push(O);
          for (const R of C) !m.has(R) && u(O, R) && (m.add(R), E.push(R));
        }
        L.length > 1 && a.push(L);
      }
      return a;
    }, "connectedComponents"),
    p = c((C) => {
      const a = [];
      for (const m of C) a.some((S) => Math.abs(S - m.coord) < rt) || a.push(m.coord);
      for (; a.length < C.length;) {
        const m = Math.min(...a),
          S = Math.max(...a),
          E = C[0].side;
        a.push(E === "left" || E === "top" ? m - 12 * (C.length - a.length) : S + 12 * (C.length - a.length));
      }
      return a;
    }, "uniqueCoordsFor"),
    I = c((C) => {
      const a = C.map((E) => E.coord),
        m = p(C),
        S = [];
      if (C.length <= 6) {
        const E = new Array(m.length).fill(!1),
          L = [],
          O = c(() => {
            if (L.length === C.length) {
              L.some((R, k) => Math.abs(R - a[k]) >= rt) && S.push([...L]);
              return;
            }
            for (const [R, k] of m.entries()) E[R] || ((E[R] = !0), L.push(k), O(), L.pop(), (E[R] = !1));
          }, "visit");
        return (O(), S);
      }
      for (let E = 0; E < a.length; E++)
        for (let L = E + 1; L < a.length; L++) {
          const O = [...a];
          (([O[E], O[L]] = [O[L], O[E]]), S.push(O));
        }
      return S;
    }, "coordinateAssignmentsFor"),
    v = c((C, a) => {
      var E;
      const m = new Map();
      for (const [L, O] of C.entries()) {
        const R = a[L],
          k = (E = m.get(O.edge)) != null ? E : O.points.map((D) => ({ x: D.x, y: D.y }));
        (O.axis === "vertical"
          ? ((k[O.segmentIndex].x = R), (k[O.segmentIndex + 1].x = R))
          : ((k[O.segmentIndex].y = R), (k[O.segmentIndex + 1].y = R)),
          m.set(O.edge, k));
      }
      const S = new Map();
      for (const [L, O] of m) {
        const R = Ln(Ot(O));
        if (Mt(R).length !== R.length - 1) return;
        S.set(L, R);
      }
      return S;
    }, "replacementsForAssignment"),
    A = c((C) => {
      for (const [a, m] of C) {
        const S = [a.start, a.end].filter((E) => !!E);
        for (const E of Mt(m)) if (Kt(E.a, E.b, r, S, -2) || Kt(E.a, E.b, d, [], -2)) return !1;
      }
      for (let a = 0; a < l.length; a++) {
        const m = l[a],
          S = C.has(m),
          E = Mt(x(m, C));
        for (let L = a + 1; L < l.length; L++) {
          const O = l[L];
          if (!S && !C.has(O)) continue;
          const R = Mt(x(O, C));
          for (const k of E) for (const D of R) if (vn(k, D, 0.5) >= nn) return !1;
        }
      }
      return !0;
    }, "candidateIsSafe");
  for (let C = 0; C < 4; C++) {
    const a = y();
    if (a === 0) return;
    let m,
      S = a,
      E = f(),
      L = Number.POSITIVE_INFINITY;
    for (const O of h(i()))
      for (const R of I(O)) {
        const k = v(O, R);
        if (!k || !A(k)) continue;
        const D = y(k);
        if (D >= a) continue;
        const J = f(k),
          at = O.reduce((gt, mt, St) => gt + Math.abs(R[St] - mt.coord), 0);
        D > S || (D === S && (J > E || (J === E && at >= L))) || ((m = k), (S = D), (E = J), (L = at));
      }
    if (!m) return;
    for (const [O, R] of m) O.points = R;
  }
}
c(hr, "reassignCrossingExternalRailChannels");
function gr(t, n) {
  const { realNodeRects: o, labelNodeRects: s } = On(n.values()),
    r = t.filter((i) => !i.isLayoutOnly),
    d = c((i, u, h) => {
      var p;
      return Ot(i === u ? (h != null ? h : []) : (p = i.points) != null ? p : []);
    }, "pointsFor"),
    l = c(
      (i) =>
        Mt(i).reduce((u, h) => {
          const p = h.a.x - h.b.x,
            I = h.a.y - h.b.y;
          return u + Math.hypot(p, I);
        }, 0),
      "pathLength",
    ),
    x = c((i, u) => {
      let h = 0;
      for (let p = 0; p < r.length; p++) {
        const I = Mt(d(r[p], i, u));
        for (let v = p + 1; v < r.length; v++) {
          const A = Mt(d(r[v], i, u));
          for (const C of I) for (const a of A) En(C.a, C.b, a.a, a.b, rt) && h++;
        }
      }
      return h;
    }, "strictCrossingCount"),
    y = c((i, u) => {
      if (i.horizontal) {
        const h = i.a.y;
        return (Math.abs(h - u.top) < 1 || Math.abs(h - u.bottom) < 1) && un(i.a.x, i.b.x, u.left, u.right) >= nn;
      }
      if (i.vertical) {
        const h = i.a.x;
        return (Math.abs(h - u.left) < 1 || Math.abs(h - u.right) < 1) && un(i.a.y, i.b.y, u.top, u.bottom) >= nn;
      }
      return !1;
    }, "segmentRunsAlongRectBorder"),
    f = c((i) => {
      const u = [i.start, i.end].filter((p) => !!p),
        h = [];
      for (const p of u) {
        const I = n.get(p),
          v = I ? mn(I) : void 0;
        v && h.push(v);
      }
      return h;
    }, "endpointRectsFor"),
    g = c((i, u) => {
      if (u + 3 >= i.length) return [];
      const h = i[u],
        p = i[u + 1],
        I = i[u + 2],
        v = i[u + 3],
        A = jt(h, p, rt) && Ut(p, I, rt) && jt(I, v, rt),
        C = Ut(h, p, rt) && jt(p, I, rt) && Ut(I, v, rt);
      if (!A && !C) return [];
      if (!(A ? Math.sign(p.x - h.x) !== Math.sign(v.x - I.x) : Math.sign(p.y - h.y) !== Math.sign(v.y - I.y)))
        return [];
      const m =
          Tt(h, v, rt) || wt(h, v, rt)
            ? []
            : [
                { x: h.x, y: v.y },
                { x: v.x, y: h.y },
              ],
        S =
          m.length === 0
            ? [[...i.slice(0, u + 1), ...i.slice(u + 3)]]
            : m.map((L) => [...i.slice(0, u + 1), L, ...i.slice(u + 3)]),
        E = new Set();
      return S.map((L) => Ln(Ot(L))).filter((L) => {
        if (Mt(L).length !== L.length - 1 || !L.some((R) => bn(R, v, rt))) return !1;
        const O = L.map((R) => `${R.x.toFixed(3)},${R.y.toFixed(3)}`).join("|");
        return E.has(O) ? !1 : (E.add(O), !0);
      });
    }, "shortcutCandidatesAt"),
    M = c((i, u, h) => {
      const p = [i.start, i.end].filter((v) => !!v),
        I = f(i);
      for (const v of Mt(u)) if (Kt(v.a, v.b, o, p, -2) || Kt(v.a, v.b, s, [], -2) || I.some((A) => y(v, A))) return !1;
      for (const v of r)
        if (v !== i) {
          for (const A of Mt(u)) for (const C of Mt(d(v))) if (vn(A, C, 0.5) >= nn) return !1;
        }
      return x(i, u) <= h;
    }, "candidateIsSafe");
  for (let i = 0; i < 8; i++) {
    const u = x();
    let h,
      p,
      I = u,
      v = Number.POSITIVE_INFINITY,
      A = Number.POSITIVE_INFINITY;
    for (const C of r) {
      const a = d(C),
        m = xn(a, rt),
        S = l(a);
      for (let E = 0; E <= a.length - 4; E++)
        for (const L of g(a, E)) {
          const O = xn(L, rt),
            R = l(L);
          if (!(O < m || (O === m && R < S - rt)) || !M(C, L, u)) continue;
          const D = x(C, L);
          D > I || (D === I && (O > v || (O === v && R >= A))) || ((h = C), (p = L), (I = D), (v = O), (A = R));
        }
    }
    if (!h || !p) return;
    h.points = p;
  }
}
c(gr, "shortcutRedundantOrthogonalJogs");
function mr(t, n) {
  var Hn, ne, Jn;
  const d = [];
  for (const N of n.values()) {
    if (N.isGroup || N.isEdgeLabel) continue;
    const F = (Hn = N.x) != null ? Hn : 0,
      _ = (ne = N.y) != null ? ne : 0,
      $ = mn(N);
    $ && d.push({ id: String((Jn = N.id) != null ? Jn : ""), cx: F, cy: _, rect: $ });
  }
  if (d.length === 0) return;
  const l = new Map(d.map((N) => [N.id, N])),
    x = d.map((N) => ({ id: N.id, rect: N.rect })),
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
      for (const $ of N) for (const q of F) En($.a, $.b, q.a, q.b, rt) && _++;
      return _;
    }, "crossingCountBetweenSegments"),
    p = c((N, F) => h(Mt(N), Mt(F)), "crossingCountBetweenPaths"),
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
            Bt = p(it, u(Rt, N));
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
          (!Z && !_.has(Rt)) || (q += p(it, u(Rt, F)));
        }
      }
      return N.count - $ + q;
    }, "crossingCountWithReplacements"),
    A = c((N) => {
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
          var ln, Zt;
          return ((ln = M.get(Rt)) != null ? ln : 0) - ((Zt = M.get(Bt)) != null ? Zt : 0);
        }),
          ct.length > 1 && _.push(ct));
      }
      return _;
    }, "crossingComponents"),
    C = c((N) => [N.start, N.end].filter((F) => !!F), "endpointIdsFor"),
    a = c((N) => {
      const F = [];
      for (const _ of A(N)) {
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
    E = c(
      (N) =>
        N.slice(1).reduce((F, _, $) => {
          const q = N[$];
          return F + Math.abs(_.x - q.x) + Math.abs(_.y - q.y);
        }, 0),
      "pathLength",
    ),
    L = c((N = new Map()) => g.reduce((F, _) => F + xn(u(_, N)), 0), "totalBends"),
    O = c((N = new Map()) => g.reduce((F, _) => F + E(u(_, N)), 0), "totalLength"),
    R = c((N, F, _ = new Map()) => {
      const $ = Mt(F);
      for (const q of g)
        if (q !== N) {
          for (const ot of $) for (const z of Mt(u(q, _))) if (vn(ot, z, 0.5) >= nn) return !0;
        }
      return !1;
    }, "pathHasSegmentConflict"),
    k = c((N, F) => {
      const _ = [N.start, N.end].filter(($) => !!$);
      for (const $ of Mt(F)) if (Kt($.a, $.b, x, _, -2)) return !0;
      return !1;
    }, "pathHitsNode"),
    D = c((N, F) => {
      const _ = Ln(Ot(F));
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
        const Z = Dn($, z),
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
        const Z = Dn($, z),
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
        const Z = Dn($, z);
        for (const it of y) ot.push(...Xt(Z, z, Dn(q, it), it));
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
        F.some((Z) => z.some((it) => vn(Z, it, 0.5) >= nn)) && $.add(ot);
      }
      return $;
    }, "sharedTrackConflictsFor"),
    nt = c((N, F, _, $) => {
      const q = new Set();
      return V(N)
        .map((z) => Ln(Ot(z)))
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
            bends: xn(z, rt),
            totalBends: xn(z),
            length: E(z),
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
    et = c((N, F, _, $, q, ot) => {
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
    Lt = c((N, F) => N.segments.some((_) => F.segments.some(($) => vn(_, $, 0.5) >= nn)), "candidatesShareTrack"),
    Ft = c((N, F, _, $) => yt(F, _.edge) && yt($, N.edge) && !Lt(F, $), "pairCandidatesAreCompatible"),
    Wt = c((N, F, _, $, q) => {
      var z, Z, it, ct;
      const ot = et(N.current, F.edge, _, $.edge, q, N.baseSegments);
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
    on = c(
      (N, F) =>
        N.crossings < F.crossings ||
        (N.crossings === F.crossings && (N.bends < F.bends || (N.bends === F.bends && N.length < F.length))),
      "pairScoreIsBetter",
    ),
    Mn = c((N, F, _, $) => {
      let q = $;
      for (const ot of F.candidates)
        for (const z of _.candidates) {
          if (!Ft(F, ot, _, z)) continue;
          const Z = Wt(N, F, ot, _, z);
          Z && on(Z, q) && (q = Z);
        }
      return q;
    }, "bestScoreForOptionPair"),
    Bn = c((N) => {
      const F = L(),
        _ = O(),
        $ = G(),
        q = S(N),
        ot = new Map(g.map((Bt) => [Bt, xn(u(Bt))])),
        z = new Map(g.map((Bt) => [Bt, E(u(Bt))])),
        Z = new Map(),
        it = a(N);
      for (const Bt of it)
        for (const ln of Bt) {
          if (Z.has(ln)) continue;
          const Zt = nt(ln, N, $, q);
          Zt.length > 0 && Z.set(ln, { edge: ln, candidates: Zt });
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
        const ln = new Set(Bt.filter((sn) => N.edgeSet.has(sn))),
          Zt = Bt.map((sn) => Z.get(sn)).filter((sn) => !!sn);
        for (let sn = 0; sn < Zt.length; sn++) {
          const Xn = Zt[sn];
          for (let Yn = sn + 1; Yn < Zt.length; Yn++) {
            const Zn = Zt[Yn];
            (!ln.has(Xn.edge) && !ln.has(Zn.edge)) || (ct = Mn(Rt, Xn, Zn, ct));
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
      const ct = xn(u(it), rt);
      for (const Rt of V(it)) {
        const Bt = k(it, Rt),
          ln = !Bt && R(it, Rt),
          Zt = m(F, it, Rt),
          sn = xn(Rt, rt);
        Bt ||
          ln ||
          !(Zt < _ || (Zt === _ && sn < ct)) ||
          Zt > ot ||
          (Zt === ot && sn >= z) ||
          (($ = it), (q = Rt), (ot = Zt), (z = sn));
      }
    }
    if ($ && q) {
      $.points = q;
      continue;
    }
    const Z = Bn(F);
    if (!Z) return;
    for (const [it, ct] of Z) it.points = ct;
  }
}
c(mr, "resolveRenderedOrthogonalCrossings");
var Nn = 0.001,
  Li = 8;
function yr(t, n) {
  var h, p, I;
  const { nodeInfoById: e, realNodeRects: o } = Ee(n),
    s = ["top", "bottom", "left", "right"],
    r = 20,
    d = {
      top: Math.min(...o.map((v) => v.rect.top)) - r,
      bottom: Math.max(...o.map((v) => v.rect.bottom)) + r,
      left: Math.min(...o.map((v) => v.rect.left)) - r,
      right: Math.max(...o.map((v) => v.rect.right)) + r,
    },
    l = c((v, A, C, a) => {
      const m = [],
        S = Co(v, A, C, a, r, Nn);
      return (S && m.push(S), A === a && m.push(vo(v, A, C, d[A])), m);
    }, "buildOrthogonalPathCandidates"),
    x = c((v, A) => {
      for (let C = 0; C < v.length - 1; C++) {
        const a = v[C],
          m = v[C + 1];
        if (Kt(a, m, o, A, 1)) return !0;
      }
      return !1;
    }, "pathHitsNode"),
    y = c((v, A, C = !1) => {
      let a = 0;
      const m = Kn(v, Nn),
        S = A.start,
        E = A.end;
      for (const L of t) {
        if (L === A || L.isLayoutOnly) continue;
        const O = L.start,
          R = L.end;
        if (!C && S && E && (O === S || O === E || R === S || R === E)) continue;
        const k = L.points;
        if (!(!k || k.length < 2))
          for (const D of m)
            for (const J of Kn(k, Nn)) {
              if (Eo(D.a, D.b, J.a, J.b, Nn, Nn)) {
                a++;
                continue;
              }
              vn(D, J, Nn) >= Li && a++;
            }
      }
      return a;
    }, "pathConflictCount"),
    f = 4,
    g = c((v, A) => {
      const C = Math.abs(v.y - A.rect.top),
        a = Math.abs(v.y - A.rect.bottom),
        m = Math.abs(v.x - A.rect.left),
        S = Math.abs(v.x - A.rect.right);
      let E = "top",
        L = C;
      return (
        a < L && ((E = "bottom"), (L = a)),
        m < L && ((E = "left"), (L = m)),
        S < L && ((E = "right"), (L = S)),
        E
      );
    }, "nearestSideOfRect"),
    M = new Map(),
    i = c((v, A, C) => {
      var m;
      const a = (m = M.get(v)) != null ? m : [];
      (a.push({ side: A, edgeId: C }), M.set(v, a));
    }, "addFaceClaim");
  for (const v of t) {
    if (v.isLayoutOnly) continue;
    const A = (h = v.points) != null ? h : [];
    if (A.length < 1) continue;
    const C = (p = v.id) != null ? p : "",
      a = v.start,
      m = v.end;
    if (a) {
      const S = e.get(a);
      S && i(a, g(A[0], S), C);
    }
    if (m) {
      const S = e.get(m);
      S && i(m, g(A[A.length - 1], S), C);
    }
  }
  const u = c((v, A, C) => {
    var a, m;
    return (m = (a = M.get(v)) == null ? void 0 : a.some((S) => S.edgeId !== C && S.side === A)) != null ? m : !1;
  }, "faceIsClaimed");
  for (const v of t) {
    if (v.isLayoutOnly) continue;
    const A = v.points;
    if (!A || A.length < 2) continue;
    const C = xn(A, Nn);
    if (C < f) continue;
    const a = v.start,
      m = v.end;
    if (!a || !m) continue;
    const S = e.get(a),
      E = e.get(m);
    if (!S || !E) continue;
    const L = (I = v.id) != null ? I : "",
      O = y(A, v, !0),
      R = y(A, v);
    let k,
      D = O,
      J = C;
    for (const at of s) {
      if (u(a, at, L)) continue;
      const gt = Dn(S, at);
      for (const mt of s) {
        if (u(m, mt, L)) continue;
        const St = Dn(E, mt);
        for (const bt of l(gt, at, St, mt)) {
          if (x(bt, [a, m])) continue;
          const Pt = xn(bt, Nn);
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
        i(m, g(k[k.length - 1], E), L));
    }
  }
}
c(yr, "simplifyDetouredEdges");
var gn = 0.001,
  Es = 10,
  de = 7;
function so(t, n) {
  const e = n ? 0 : t.length - 1,
    o = n ? 1 : -1,
    s = t[e],
    r = t[e + o];
  if (!s || !r) return;
  const d = r.x - s.x,
    l = r.y - s.y;
  if (!(Math.abs(d) + Math.abs(l) < gn)) {
    if (Math.abs(l) <= gn) {
      const y = s.x + Math.sign(d) * Es;
      return { left: Math.min(s.x, y), right: Math.max(s.x, y), top: s.y - de, bottom: s.y + de };
    }
    if (Math.abs(d) <= gn) {
      const y = s.y + Math.sign(l) * Es;
      return { left: s.x - de, right: s.x + de, top: Math.min(s.y, y), bottom: Math.max(s.y, y) };
    }
    return { left: Math.min(s.x, r.x), right: Math.max(s.x, r.x), top: Math.min(s.y, r.y), bottom: Math.max(s.y, r.y) };
  }
}
c(so, "markerClearanceRectFor");
function xr(t) {
  return {
    left: Math.min(t.left, t.right),
    right: Math.max(t.left, t.right),
    top: Math.min(t.top, t.bottom),
    bottom: Math.max(t.top, t.bottom),
  };
}
c(xr, "normalizeRect");
function ro(t, n) {
  const e = Ot(n),
    o = so(e, !0),
    s = so(e, !1);
  return [o, s].some((r) => r && ye(t, xr(r)));
}
c(ro, "labelOverlapsOwnMarker");
function he(t, n) {
  var u, h, p, I, v, A;
  const e = [];
  for (const C of t) {
    if (C.isLayoutOnly) continue;
    const a = C.points;
    if (!(!a || a.length < 2)) for (let m = 0; m < a.length - 1; m++) e.push({ edgeId: C.id, p1: a[m], p2: a[m + 1] });
  }
  const o = [],
    s = [];
  for (const C of n.values()) {
    const a = C.isGroup,
      m = C.parentId;
    if (a && !m) {
      const E = mn(C);
      E && s.push({ id: C.id, rect: E });
      continue;
    }
    if (a || C.isEdgeLabel) continue;
    const S = mn(C);
    S && o.push({ nodeId: C.id, rect: S });
  }
  const r = 3,
    d = 1,
    l = 12,
    x = c((C, a) => {
      const m = Ge(a, r);
      for (const { nodeId: S, rect: E } of o) if (S !== C && ye(m, E)) return !0;
      return !1;
    }, "labelOverlapsForeignNode"),
    y = c((C, a) => {
      const m = Ge(a, r);
      for (const S of e) if (S.edgeId !== C && Le(S.p1, S.p2, m)) return !0;
      return !1;
    }, "labelOverlapsForeignEdge"),
    f = c((C, a, m) => x(C, m) || y(a, m), "labelOverlapsAnything"),
    g = [],
    M = c((C) => {
      for (const { id: a, rect: m } of s) if (Vs(m, C)) return a;
    }, "findContainingLane"),
    i = c((C, a) => g.some((m) => m.labelId !== C && ye(a, m.rect)), "overlapsPlacedLabel");
  for (const C of t) {
    if (C.isLayoutOnly) continue;
    const a = C.labelNodeId;
    if (!a) continue;
    const m = n.get(a);
    if (!m) continue;
    const S = C.points;
    if (!S || S.length < 2) continue;
    const E = (u = m.width) != null ? u : 0,
      L = (h = m.height) != null ? h : 0;
    if (E <= 0 || L <= 0) continue;
    const O = [];
    for (let G = 0; G < S.length - 1; G++) {
      const tt = S[G],
        nt = S[G + 1],
        et = Math.abs(tt.x - nt.x),
        yt = Math.abs(tt.y - nt.y);
      (et < gn && yt < gn) ||
        (et >= gn && yt >= gn) ||
        O.push({
          idx: G,
          length: et + yt,
          orientation: et >= gn ? "horizontal" : "vertical",
          midX: (tt.x + nt.x) / 2,
          midY: (tt.y + nt.y) / 2,
        });
    }
    if (O.length === 0) continue;
    const R = O.length >= 3 ? O.filter((G) => G.idx > 0 && G.idx < O.length - 1) : O,
      k = R.length > 0 ? R : O,
      D = E >= L ? "horizontal" : "vertical",
      J = c(
        (G) =>
          [...G].sort((tt, nt) => {
            const et = tt.orientation === D,
              yt = nt.orientation === D;
            if (et !== yt) return et ? -1 : 1;
            const Lt = tt.length >= (tt.orientation === "horizontal" ? E : L) + 2,
              Ft = nt.length >= (nt.orientation === "horizontal" ? E : L) + 2;
            return Lt !== Ft ? (Lt ? -1 : 1) : nt.length - tt.length;
          }),
        "rankSegments",
      ),
      at = O[0],
      gt = O[O.length - 1],
      mt = [0.5, 0.25, 0.75, 0.05, 0.95, 0.15, 0.85, 0.1, 0.9],
      St = c((G, tt) => {
        const nt = S[G.idx],
          et = S[G.idx + 1];
        return { midX: nt.x + (et.x - nt.x) * tt, midY: nt.y + (et.y - nt.y) * tt };
      }, "anchorAtT"),
      bt = c((G, tt, nt) => Math.min(nt, Math.max(tt, G)), "clamp"),
      Pt = c(
        (G, tt) =>
          G.midX >= tt.left - gn && G.midX <= tt.right + gn && G.midY >= tt.top - gn && G.midY <= tt.bottom + gn,
        "pointInsideRectInclusive",
      ),
      kt = c((G) => {
        const tt = Wn(G.midX, G.midY, E, L),
          nt = M(tt);
        if (nt) return { laneId: nt, anchor: G, rect: tt };
        const et = s.find(({ rect: Bn }) => Pt(G, Bn));
        if (!et) return;
        const yt = et.rect.left + E / 2 + d,
          Lt = et.rect.right - E / 2 - d,
          Ft = et.rect.top + L / 2 + d,
          Wt = et.rect.bottom - L / 2 - d;
        if (yt > Lt || Ft > Wt) return;
        const on = { midX: bt(G.midX, yt, Lt), midY: bt(G.midY, Ft, Wt) },
          Mn = Wn(on.midX, on.midY, E, L);
        return Pt(G, Mn) ? { laneId: et.id, anchor: on, rect: Mn } : void 0;
      }, "placementForAnchor"),
      Xt = c(
        (G, tt, nt) => (G.orientation === "horizontal" ? Math.abs(tt.midX - nt.x) : Math.abs(tt.midY - nt.y)),
        "distanceAlongSegment",
      ),
      ft = c((G, tt) => {
        const et = (G.orientation === "horizontal" ? E / 2 : L / 2) + l;
        if (G === at) {
          const yt = S[G.idx];
          if (Xt(G, tt, yt) + gn < et) return !1;
        }
        if (G === gt) {
          const yt = S[G.idx + 1];
          if (Xt(G, tt, yt) + gn < et) return !1;
        }
        return !0;
      }, "labelClearsTerminalEndpoints"),
      W = c((G) => {
        const tt = J(G);
        for (const nt of tt)
          for (const et of mt) {
            const yt = St(nt, et);
            if (!ft(nt, yt)) continue;
            const Lt = kt(yt);
            if (Lt && !ro(Lt.rect, S) && !i(a, Lt.rect) && !f(a, C.id, Lt.rect))
              return { laneId: Lt.laneId, anchor: Lt.anchor };
          }
      }, "tryPool"),
      K = c((G, tt, nt = !1) => {
        const et = J(G);
        for (const yt of et) {
          const Lt = { midX: yt.midX, midY: yt.midY };
          if (tt && !ft(yt, Lt)) continue;
          const Ft = kt(Lt);
          if (Ft && !ro(Ft.rect, S) && !i(a, Ft.rect) && !x(a, Ft.rect) && (nt || !y(C.id, Ft.rect)))
            return { laneId: Ft.laneId, anchor: Ft.anchor };
        }
      }, "findLaneContainingFallback"),
      V =
        (A =
          (v = (I = (p = W(k)) != null ? p : k.length < O.length ? W(O) : void 0) != null ? I : K(O, !0)) != null
            ? v
            : K(O, !1)) != null
          ? A
          : K(O, !1, !0);
    if (V) {
      ((m.x = V.anchor.midX), (m.y = V.anchor.midY), (m.parentId = V.laneId));
      const G = Wn(V.anchor.midX, V.anchor.midY, E, L),
        tt = g.findIndex((nt) => nt.labelId === a);
      tt >= 0 ? (g[tt] = { labelId: a, rect: G }) : g.push({ labelId: a, rect: G });
    }
  }
}
c(he, "anchorLabelsToPolyline");
var Fe = 1e-6,
  Ei = 8,
  Ts = Ei / 2,
  Ti = 3;
function io(t, n) {
  return t < n ? `${t}::${n}` : `${n}::${t}`;
}
c(io, "pairKey");
function pr(t, n) {
  var d, l;
  const { nodeInfoById: e, realNodeRects: o } = Ee(n),
    s = new Map();
  for (const x of n) {
    const y = x.id;
    if (!x.isGroup && x.isEdgeLabel) {
      s.set(y, { w: (d = x.width) != null ? d : 0, h: (l = x.height) != null ? l : 0 });
      continue;
    }
  }
  const r = c((x, y, f, g) => {
    const M = io(y, f);
    let i = 0;
    const u = c((h) => {
      if (!h) return;
      const p = s.get(h);
      if (!p) return;
      const I = g === "x" ? p.w / 2 : p.h / 2;
      I > i && (i = I);
    }, "consider");
    u(x.labelNodeId);
    for (const h of t) {
      if (h === x || h.isLayoutOnly) continue;
      const p = h.start,
        I = h.end;
      !p || !I || (io(p, I) === M && u(h.labelNodeId));
    }
    return i > 0 ? i + Ti : 0;
  }, "labelClearanceFor");
  for (const x of t) {
    if (x.isLayoutOnly) continue;
    const y = x.points;
    if (!Io(y, Fe)) continue;
    const f = Lo(x, e, Fe);
    if (!f) continue;
    const { srcId: g, dstId: M, srcInfo: i, dstInfo: u, collinearX: h, collinearY: p } = f;
    if (h === p) continue;
    let I, v;
    if (h) {
      const S = u.cy > i.cy;
      ((I = { x: i.cx, y: S ? i.rect.bottom : i.rect.top }), (v = { x: u.cx, y: S ? u.rect.top : u.rect.bottom }));
    } else {
      const S = u.cx > i.cx;
      ((I = { x: S ? i.rect.right : i.rect.left, y: i.cy }), (v = { x: S ? u.rect.left : u.rect.right, y: u.cy }));
    }
    if (Kt(I, v, o, [g, M], 1)) continue;
    const C = r(x, g, M, h ? "x" : "y"),
      a = C > Ts ? C : Ts,
      m = [0, a, -a];
    for (const S of m) {
      const E = { ...I },
        L = { ...v };
      if (h) {
        if (
          ((E.x += S),
          (L.x += S),
          E.x <= i.rect.left || E.x >= i.rect.right || L.x <= u.rect.left || L.x >= u.rect.right)
        )
          continue;
      } else if (
        ((E.y += S), (L.y += S), E.y <= i.rect.top || E.y >= i.rect.bottom || L.y <= u.rect.top || L.y >= u.rect.bottom)
      )
        continue;
      if (!Kt(E, L, o, [g, M], 1) && !xe(E, L, t, x, { epsilon: Fe })) {
        x.points = [E, L];
        break;
      }
    }
  }
}
c(pr, "straightenCollinearSiblingDetours");
function co(t, n) {
  const { realNodeRects: x, labelNodeRects: y } = On(n.values()),
    f = c(
      (a, m) => Kn(m, 0.001).map((S) => ({ ...S, edge: a, interior: S.index >= 1 && S.index <= m.length - 3 })),
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
          ? un(a.a.x, a.b.x, m.a.x, m.b.x) >= 8 && Math.abs(a.a.y - m.a.y) < 7
          : a.vertical && m.vertical
            ? un(a.a.y, a.b.y, m.a.y, m.b.y) >= 8 && Math.abs(a.a.x - m.a.x) < 7
            : !1,
      "hasCrowdedParallelTrack",
    ),
    i = c((a, m) => {
      const S = a.start,
        E = a.end,
        L = f(a, m);
      if (L.length !== m.length - 1) return !1;
      const O = [S, E].filter((k) => !!k),
        R = a.labelNodeId ? [a.labelNodeId] : [];
      for (const k of L) if (Kt(k.a, k.b, x, O, -2) || Kt(k.a, k.b, y, R, -2)) return !1;
      for (const k of t) {
        if (k === a || k.isLayoutOnly) continue;
        const D = k.points;
        if (!(!D || D.length < 2)) {
          for (const J of L) for (const at of f(k, Ot(D))) if (M(J, at) || En(J.a, J.b, at.a, at.b, 0.001)) return !1;
        }
      }
      return !0;
    }, "candidateIsSafe"),
    u = c((a, m) => {
      var L;
      const S = Ot((L = a.edge.points) != null ? L : []);
      if (S.length < 4 || a.index >= S.length - 1) return;
      const E = S.map((O) => ({ ...O }));
      if (a.horizontal) ((E[a.index].y += m), (E[a.index + 1].y += m));
      else if (a.vertical) ((E[a.index].x += m), (E[a.index + 1].x += m));
      else return;
      return f(a.edge, E).length === E.length - 1 ? E : void 0;
    }, "shiftedCandidate"),
    h = c((a, m) => {
      var S, E;
      return { x: (S = a.x) != null ? S : (m.left + m.right) / 2, y: (E = a.y) != null ? E : (m.top + m.bottom) / 2 };
    }, "nodeCenter"),
    p = c((a) => {
      var D;
      const m = a.edge,
        S = Ot((D = m.points) != null ? D : []);
      if (S.length !== 4 || a.index !== 1) return;
      const E = m.start ? n.get(m.start) : void 0,
        L = m.end ? n.get(m.end) : void 0,
        O = E ? mn(E) : void 0,
        R = L ? mn(L) : void 0,
        k = S.slice(a.index + 2);
      if (!(!E || !L || !O || !R || k.length === 0))
        return { sourceCenter: h(E, O), targetCenter: h(L, R), sourceRect: O, tail: k };
    }, "sourceDetourContextFor"),
    I = c((a, m, S, E, L, O) => {
      const R = E.y >= S.y,
        k = R ? L.bottom : L.top,
        D = k + (R ? 20 : -20);
      if ((R && a.b.y <= D + 0.001) || (!R && a.b.y >= D - 0.001)) return;
      const J = a.a.x + m;
      return Ot([{ x: S.x, y: k }, { x: S.x, y: D }, { x: J, y: D }, { x: J, y: a.b.y }, ...O], 0.001);
    }, "verticalSourceDetour"),
    v = c((a, m, S, E, L, O) => {
      const R = E.x >= S.x,
        k = R ? L.right : L.left,
        D = k + (R ? 20 : -20);
      if ((R && a.b.x <= D + 0.001) || (!R && a.b.x >= D - 0.001)) return;
      const J = a.a.y + m;
      return Ot([{ x: k, y: S.y }, { x: D, y: S.y }, { x: D, y: J }, { x: a.b.x, y: J }, ...O], 0.001);
    }, "horizontalSourceDetour"),
    A = c((a, m) => {
      const S = p(a);
      if (S) {
        if (a.vertical) return I(a, m, S.sourceCenter, S.targetCenter, S.sourceRect, S.tail);
        if (a.horizontal) return v(a, m, S.sourceCenter, S.targetCenter, S.sourceRect, S.tail);
      }
    }, "sourceDetourCandidate"),
    C = [-7, 7, -14, 14, -21, 21];
  for (let a = 0; a < 12; a++) {
    const m = g();
    let S = !1;
    for (let E = 0; E < m.length && !S; E++)
      for (let L = E + 1; L < m.length && !S; L++) {
        const O = m[E],
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
            const gt = A(D, J);
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
function br(t, n, e, o) {
  const s = n.x - t.x,
    r = n.y - t.y,
    d = o.x - e.x,
    l = o.y - e.y,
    x = s * l - r * d;
  if (Math.abs(x) < 1e-10) return !1;
  const y = e.x - t.x,
    f = e.y - t.y,
    g = (y * l - f * d) / x,
    M = (y * r - f * s) / x,
    i = 0.01;
  return g > i && g < 1 - i && M > i && M < 1 - i;
}
c(br, "segmentsIntersect");
function Mr(t) {
  var l, x, y;
  const n = (l = t.nodes) != null ? l : [],
    e = (x = t.edges) != null ? x : [],
    o = [];
  if (!e.length || !n.length) return o;
  const s = js(n),
    r = [];
  for (const f of e) {
    if (f.isLayoutOnly) continue;
    const g = f.points;
    if (!g || g.length < 2) continue;
    const M = f.start,
      i = f.end,
      u = f.labelNodeId,
      h = (y = f.id) != null ? y : `${M}->${i}`;
    for (const p of s)
      if (!(p.nodeId === M || p.nodeId === i) && !(u && p.nodeId === u)) {
        for (let I = 0; I < g.length - 1; I++)
          if (Le(g[I], g[I + 1], p, -1)) {
            o.push({
              type: "edge-node-overlap",
              edgeId: h,
              targetId: p.nodeId,
              detail: `segment ${I} passes through node "${p.nodeId}"`,
            });
            break;
          }
      }
    for (let p = 0; p < g.length - 1; p++) r.push({ edgeId: h, start: M, end: i, p1: g[p], p2: g[p + 1] });
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
    De.warn(`[SWIMLANE_VALIDATE] ${o.length} issue(s) detected: ${f} edge-node overlap(s), ${g} edge crossing(s)`);
    for (const M of o) De.warn(`[SWIMLANE_VALIDATE]   ${M.type}: ${M.detail}`);
  }
  return o;
}
c(Mr, "validateSwimlanesLayout");
function Ir(t, n) {
  var l, x;
  const e = (l = t.nodes) != null ? l : [],
    o = (x = t.edges) != null ? x : [],
    s = e.filter((y) => !y.isGroup);
  if (((n === "LR" || n === "RL") && s.length > 0 && !cr(t, n)) || (n === "BT" && s.length > 0 && !ir(t))) return;
  for (const y of o) {
    if (y.isLayoutOnly) continue;
    const f = y.points;
    !f || f.length < 2 || (y.points = Ln(pe(f)));
  }
  (yr(o, e), pr(o, e), ar(o, e));
  const r = new Map();
  for (const y of e) r.set(String(y.id), y);
  (he(o, r), Js(o, r), lr(o, r), co(o, r), fr(o, r), dr(o, r), no(o, r), ur(o, r));
  const d = c(() => {
    (mr(o, r), hr(o, r), gr(o, r), he(o, r), Qe(o, r), no(o, r), he(o, r), Qe(o, r));
  }, "finalizeRenderedEdges");
  (d(), co(o, r), d(), eo(o, r), oo(o, r), eo(o, r), oo(o, r));
}
c(Ir, "postProcessSwimlaneLayout");
function Pn(t) {
  const n = new Map(t.nodeById),
    e = new Set(),
    o = [];
  for (const r of t.edges) {
    if (!n.has(r.src) || !n.has(r.dst)) continue;
    const d = `${r.id}:${r.src}->${r.dst}`;
    e.has(d) || (e.add(d), o.push(r));
  }
  return { nodes: [...n.keys()], edges: o, layout: t.layout, nodeById: n };
}
c(Pn, "normalizeGraph");
function No(t, n) {
  return t.edges.filter((e) => e.dst === n);
}
c(No, "incoming");
function Sr(t) {
  const n = new Map();
  for (const e of t.nodes) n.set(e, []);
  for (const e of t.edges) n.get(e.src).push(e.dst);
  return n;
}
c(Sr, "buildSuccessorMap");
function Oo(t) {
  const n = Sr(t);
  for (const e of n.values()) e.sort((o, s) => o.localeCompare(s));
  return n;
}
c(Oo, "buildSortedSuccessorMap");
function Po(t) {
  var e;
  const n = new Map();
  for (const o of t.nodes) n.set(o, 0);
  for (const o of t.edges) n.set(o.dst, ((e = n.get(o.dst)) != null ? e : 0) + 1);
  return n;
}
c(Po, "buildInDegreeMap");
function Bo(t) {
  return [...t.entries()]
    .filter(([, n]) => n === 0)
    .map(([n]) => n)
    .sort((n, e) => n.localeCompare(e));
}
c(Bo, "sortedZeroInDegreeNodes");
function Te(t, n = () => !0) {
  const e = new Map(),
    o = new Map();
  for (const s of t.nodes) (e.set(s, []), o.set(s, []));
  for (const s of t.edges) n(s) && (o.get(s.src).push(s.dst), e.get(s.dst).push(s.src));
  return { preds: e, succs: o };
}
c(Te, "buildPredecessorSuccessorMaps");
function ko(t, n, e, o) {
  var d, l, x, y;
  let s = 0;
  for (const f of t.nodes)
    (o != null && o.skipGroups && (d = t.nodeById.get(f)) != null && d.isGroup) ||
      (s = Math.max(s, (l = e[f]) != null ? l : 0));
  const r = Array.from({ length: s + 1 }, () => []);
  for (const f of n)
    (o != null && o.skipGroups && (x = t.nodeById.get(f)) != null && x.isGroup) ||
      r[Math.max(0, (y = e[f]) != null ? y : 0)].push(f);
  return r;
}
c(ko, "buildLayersFromRanks");
function te(t) {
  var r, d, l;
  const n = Po(t),
    e = Bo(n),
    o = [],
    s = Oo(t);
  for (; e.length;) {
    const x = e.shift();
    o.push(x);
    for (const y of (r = s.get(x)) != null ? r : [])
      if ((n.set(y, ((d = n.get(y)) != null ? d : 0) - 1), ((l = n.get(y)) != null ? l : 0) === 0)) {
        let f = 0;
        for (; f < e.length && e[f] < y;) f++;
        e.splice(f, 0, y);
      }
  }
  return o.length === t.nodes.length ? o : null;
}
c(te, "topoSortIfAcyclic");
function qn(t) {
  const n = new Map();
  let e = 0;
  for (const o of t) (n.set(o, e), e++);
  return n;
}
c(qn, "buildLayerIndex");
function Fo(t) {
  const n = new Array(t.length),
    e = c((o, s) => {
      if (s - o <= 1) return 0;
      const r = (o + s) >> 1;
      let d = e(o, r) + e(r, s),
        l = o,
        x = r,
        y = o;
      for (; l < r || x < s;) x >= s || (l < r && t[l] <= t[x]) ? (n[y++] = t[l++]) : ((n[y++] = t[x++]), (d += r - l));
      for (let f = o; f < s; f++) t[f] = n[f];
      return d;
    }, "count");
  return e(0, t.length);
}
c(Fo, "countInversions");
function Cr(t) {
  const n = Pn(t),
    e = new Map();
  for (const f of n.nodes) e.set(f, []);
  for (const f of n.edges) e.get(f.src).push(f);
  for (const f of e.values())
    f.sort((g, M) => (g.dst === M.dst ? g.id.localeCompare(M.id) : g.dst.localeCompare(M.dst)));
  const o = Object.create(null);
  for (const f of n.nodes) o[f] = 0;
  const s = [],
    r = c((f) => {
      var g;
      o[f] = 1;
      for (const M of (g = e.get(f)) != null ? g : []) {
        const i = M.dst;
        o[i] === 0 ? r(i) : o[i] === 1 && s.push(M);
      }
      o[f] = 2;
    }, "dfs"),
    d = [...n.nodes].sort((f, g) => f.localeCompare(g));
  for (const f of d) o[f] === 0 && r(f);
  const l = new Set(s.map((f) => `${f.id}:${f.src}->${f.dst}`)),
    x = n.edges.map((f) =>
      l.has(`${f.id}:${f.src}->${f.dst}`) ? { id: f.id, src: f.dst, dst: f.src, weight: f.weight, ref: f.ref } : f,
    );
  return { acyclic: { nodes: [...n.nodes], edges: x, layout: n.layout, nodeById: new Map(n.nodeById) }, reversed: s };
}
c(Cr, "removeCycles_DFS");
function vr(t) {
  const n = new Map(),
    e = c((o) => {
      if (n.has(o)) return n.get(o);
      const s = t.nodeById.get(o);
      if (!s) return (n.set(o, null), null);
      const r = s.parentId;
      if (!r) return (n.set(o, null), null);
      const d = e(r),
        l = d != null ? d : r;
      return (n.set(o, l), l);
    }, "resolve");
  for (const o of t.nodes) e(o);
  return n;
}
c(vr, "buildTopLaneMap");
function Tn(t) {
  const n = vr(t);
  return (e) => {
    var o;
    return (o = n.get(e)) != null ? o : null;
  };
}
c(Tn, "createTopLaneResolver");
function Ae(t) {
  var e;
  const n = [];
  for (const o of (e = t.layout.nodes) != null ? e : []) o.isGroup && !o.parentId && n.push(o.id);
  return [...new Set(n)].reverse();
}
c(Ae, "buildTopLaneOrder");
function _o(t, n) {
  const e = Ae(t);
  if (!n || n.length === 0) return e;
  const o = new Set(e),
    s = new Set(),
    r = [];
  for (const d of n) !o.has(d) || s.has(d) || (s.add(d), r.push(d));
  for (const d of e) s.has(d) || r.push(d);
  return r;
}
c(_o, "resolveTopLaneOrder");
var Ai = { EPSILON: 1e-6 },
  Ce = { GRAVITY_ITERATIONS: 8, MAX_CROSSING_OPTIMIZATION_PASSES: 4, DEFAULT_COMPACT_SINGLE_INPUT: !0 },
  As = { DEFAULT_LAYER_GAP: 100, DEFAULT_NODE_GAP: 40 };
function Lr(t, n) {
  var a, m, S, E;
  const e = Pn(t),
    o = (a = n == null ? void 0 : n.laneOf) != null ? a : () => null,
    s = n == null ? void 0 : n.rankHint,
    { preds: r } = Te(e);
  for (const L of r.values()) L.sort((O, R) => O.localeCompare(R));
  const d = (m = te(e)) != null ? m : [...e.nodes].sort((L, O) => L.localeCompare(O)),
    l = new Map();
  for (const [L, O] of d.entries()) l.set(O, L);
  const x = new Map(),
    y = new Map();
  for (const L of e.nodes) y.set(L, []);
  for (const L of d) {
    const O = ((S = r.get(L)) != null ? S : []).filter((R) => x.has(R));
    if (O.length > 0) {
      const R = Er(L, O, { laneOf: o, rankHint: s, topoIndex: l });
      (x.set(L, R), y.get(R).push(L));
    } else x.has(L) || x.set(L, null);
  }
  for (const L of e.nodes) x.has(L) || x.set(L, null);
  const f = new Set();
  for (const L of e.nodes) ((E = x.get(L)) != null ? E : null) === null && f.add(L);
  const g = [...f].sort((L, O) => {
      var D, J;
      const R = (D = l.get(L)) != null ? D : 0,
        k = (J = l.get(O)) != null ? J : 0;
      return R === k ? L.localeCompare(O) : R - k;
    }),
    M = Tr(e),
    i = new Map();
  for (const [L, O] of M.entries())
    i.set(
      L,
      [...O].sort((R, k) => R.localeCompare(k)),
    );
  const u = Ar(i),
    h = wr(i),
    p = new Map();
  for (const L of e.nodes) p.set(L, []);
  for (const L of h)
    for (const O of L.nodes) {
      const R = p.get(O);
      R ? R.push(L.id) : p.set(O, [L.id]);
    }
  const I = [],
    v = [],
    A = new Set(),
    C = c((L) => {
      var O;
      if (!A.has(L)) {
        (A.add(L), I.push(L));
        for (const R of (O = y.get(L)) != null ? O : []) C(R);
        v.push(L);
      }
    }, "walk");
  for (const L of g) C(L);
  for (const L of d) C(L);
  return {
    parent: x,
    children: y,
    roots: g,
    componentOf: u,
    blocks: h,
    nodeBlocks: p,
    adjacency: i,
    preorder: I,
    postorder: v,
    topologicalOrder: d,
  };
}
c(Lr, "buildDrivingTree");
function Er(t, n, e) {
  const o = e.laneOf(t);
  return [...n].sort((r, d) => {
    var h, p, I, v;
    const l = e.laneOf(r),
      x = e.laneOf(d),
      y = l != null && l === o,
      f = x != null && x === o;
    if (y !== f) return y ? -1 : 1;
    const g = (h = e.rankHint) == null ? void 0 : h[r],
      M = (p = e.rankHint) == null ? void 0 : p[d];
    if (g != null && M != null && g !== M) return M - g;
    const i = (I = e.topoIndex.get(r)) != null ? I : 0,
      u = (v = e.topoIndex.get(d)) != null ? v : 0;
    return i !== u ? i - u : r.localeCompare(d);
  })[0];
}
c(Er, "chooseParent");
function Tr(t) {
  const n = new Map();
  for (const e of t.nodes) n.set(e, new Set());
  for (const e of t.edges) (n.get(e.src).add(e.dst), n.get(e.dst).add(e.src));
  return n;
}
c(Tr, "buildAdjacency");
function Ar(t) {
  var o;
  const n = new Map();
  let e = 0;
  for (const s of t.keys()) {
    if (n.has(s)) continue;
    const r = [s];
    for (; r.length > 0;) {
      const d = r.pop();
      if (!n.has(d)) {
        n.set(d, e);
        for (const l of (o = t.get(d)) != null ? o : []) n.has(l) || r.push(l);
      }
    }
    e++;
  }
  return n;
}
c(Ar, "assignComponents");
function wr(t) {
  const n = new Map(),
    e = new Map(),
    o = [],
    s = [];
  let r = 0;
  const d = c((l, x) => {
    var y, f, g, M, i, u, h, p, I;
    (n.set(l, ++r), e.set(l, r));
    for (const v of (y = t.get(l)) != null ? y : [])
      v !== x &&
        (n.has(v)
          ? ((u = n.get(v)) != null ? u : 0) < ((h = n.get(l)) != null ? h : 0) &&
            (o.push([l, v]), e.set(l, Math.min((p = e.get(l)) != null ? p : r, (I = n.get(v)) != null ? I : r)))
          : (o.push([l, v]),
            d(v, l),
            e.set(l, Math.min((f = e.get(l)) != null ? f : r, (g = e.get(v)) != null ? g : r)),
            ((M = e.get(v)) != null ? M : 0) >= ((i = n.get(l)) != null ? i : 0) && s.push(Rr(l, v, o, s.length))));
  }, "visit");
  for (const l of t.keys()) n.has(l) || d(l, null);
  return s;
}
c(wr, "computeBlocks");
function Rr(t, n, e, o) {
  const s = [],
    r = new Set();
  for (; e.length > 0;) {
    const d = e.pop();
    if ((s.push(d), r.add(d[0]), r.add(d[1]), (d[0] === t && d[1] === n) || (d[0] === n && d[1] === t))) break;
  }
  return { id: o, edges: s, nodes: [...r] };
}
c(Rr, "popBlock");
function Nr(t, n, e) {
  var v, A, C;
  const o = [...t.nodes],
    s = new Map();
  for (const [a, m] of o.entries()) s.set(m, a);
  const r = o.length,
    d = new Array(r).fill(-1),
    l = new Array(r).fill(0),
    x = [],
    y = new Set();
  for (const a of o) {
    const m = (v = e.parent.get(a)) != null ? v : null,
      S = s.get(a);
    S != null && m == null && ((d[S] = -1), (l[S] = 0), y.has(a) || (y.add(a), x.push(a)));
  }
  for (; x.length > 0;) {
    const a = x.shift(),
      m = s.get(a);
    if (m == null) continue;
    const S = (A = e.children.get(a)) != null ? A : [];
    for (const E of S) {
      if (y.has(E)) continue;
      const L = s.get(E);
      L != null && ((d[L] = m), (l[L] = l[m] + 1), y.add(E), x.push(E));
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
      for (let E = 0; E < f; E++) if ((S >> E) & 1 && ((a = g[E][a]), a === -1)) return -1;
      if (a === m) return a;
      for (let E = f - 1; E >= 0; E--) {
        const L = g[E][a],
          O = g[E][m];
        L === -1 || O === -1 || (L !== O && ((a = L), (m = O)));
      }
      return g[0][a];
    }, "lcaIndex"),
    i = Array.from({ length: r }, () => new Map());
  for (const a of t.edges) {
    let m = a.src,
      S = a.dst,
      E = n[m],
      L = n[S];
    if (E == null || L == null || (E > L && (([m, S] = [S, m]), ([E, L] = [L, E])), E == null || L == null || E === L))
      continue;
    const O = s.get(m),
      R = s.get(S);
    if (O == null || R == null) continue;
    const k = M(O, R);
    if (k === -1) continue;
    const D = i[k];
    for (let J = E; J < L; J++) D.set(J, ((C = D.get(J)) != null ? C : 0) + 1);
  }
  const u = new Map(),
    h = c((a, m) => {
      var S;
      if (m.size !== 0) for (const [E, L] of m) a.set(E, ((S = a.get(E)) != null ? S : 0) + L);
    }, "mergeInto"),
    p = new Set(),
    I = c((a) => {
      var O, R;
      const m = s.get(a);
      p.add(a);
      const S = m == null ? void 0 : i[m],
        E = S ? new Map(S) : new Map(),
        L = (O = e.children.get(a)) != null ? O : [];
      for (const k of L) {
        const D = I(k),
          J = n[a];
        if (J != null) {
          let at = u.get(a);
          at || ((at = new Map()), u.set(a, at));
          let gt = (R = D.get(J)) != null ? R : 0;
          const mt = n[k];
          (mt != null && mt > J && (gt += 1), at.set(k, gt));
        }
        h(E, D);
      }
      return E;
    }, "dfs");
  for (const a of e.roots) p.has(a) || I(a);
  for (const a of o) p.has(a) || I(a);
  return u;
}
c(Nr, "computeSubtreeCrossCounts");
function Or(t, n, e) {
  const o = new Map(),
    s = c((r) => {
      var x, y;
      let d = (x = e[r]) != null ? x : 0;
      const l = [...((y = n.get(r)) != null ? y : [])];
      l.sort(Do(e));
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
  return (n, e) => {
    var r, d;
    const o = (r = t[n]) != null ? r : 0,
      s = (d = t[e]) != null ? d : 0;
    return o === s ? n.localeCompare(e) : o - s;
  };
}
c(Do, "compareByRankThenId");
function Pr(t, n, e, o) {
  var x, y;
  let s = 0;
  for (const f of n) {
    const g = (x = e[f]) != null ? x : 0;
    g > s && (s = g);
  }
  const r = Array.from({ length: s + 1 }, () => []),
    d = new Set(),
    l = c((f) => {
      var M;
      if (d.has(f)) return;
      d.add(f);
      const g = (M = e[f]) != null ? M : 0;
      (r[g] || (r[g] = []), r[g].push(f));
      for (const i of o(f)) l(i);
    }, "emit");
  for (const f of t) l(f);
  for (const f of n)
    if (!d.has(f)) {
      const g = (y = e[f]) != null ? y : 0;
      (r[g] || (r[g] = []), r[g].push(f), d.add(f));
    }
  return r;
}
c(Pr, "emitNodesInTreeOrder");
function Br(t) {
  const n = [];
  for (const e of t) {
    const o = new Set(),
      s = [];
    for (const r of e) o.has(r) || (o.add(r), s.push(r));
    n.push(s);
  }
  return n;
}
c(Br, "deduplicateLayers");
function kr(t, n, e, o) {
  return (s) => {
    var f, g, M;
    const r = (f = t.get(s)) != null ? f : [];
    if (r.length === 0) return [];
    const d = (g = n[s]) != null ? g : 0,
      l = [],
      x = [],
      y = e.get(s);
    for (const i of r) {
      const u = (M = o.get(i)) != null ? M : d;
      u > d ? l.push({ child: i, min: u }) : x.push(i);
    }
    return (
      l.sort((i, u) => (i.min === u.min ? i.child.localeCompare(u.child) : i.min - u.min)),
      x.sort((i, u) => {
        var A, C, a, m;
        const h = (A = y == null ? void 0 : y.get(i)) != null ? A : 0,
          p = (C = y == null ? void 0 : y.get(u)) != null ? C : 0;
        if (h !== p) return h - p;
        const I = (a = o.get(i)) != null ? a : d,
          v = (m = o.get(u)) != null ? m : d;
        return I !== v ? I - v : i.localeCompare(u);
      }),
      [...l.map((i) => i.child), ...x]
    );
  };
}
c(kr, "createChildOrderer");
function ve(t, n, e) {
  const o = Lr(t, { rankHint: n, laneOf: e }),
    { children: s, roots: r } = o;
  for (const g of t.nodes) s.has(g) || s.set(g, []);
  const d = Nr(t, n, o),
    l = [...r].sort(Do(n)),
    x = Or(l, s, n),
    y = kr(s, n, d, x);
  let f = Pr(l, t.nodes, n, y);
  return ((f = Br(f)), f);
}
c(ve, "buildMultitreeLayerOrder");
function Fr(t, n, e) {
  const o = new Set(t),
    s = new Set(n),
    r = qn(n),
    d = [];
  for (const l of e) o.has(l.src) && s.has(l.dst) && d.push(r.get(l.dst));
  return Fo(d);
}
c(Fr, "countCrossingsBetweenAdjacent");
function ao(t, n, e) {
  const o = [];
  for (const r of n) {
    const d = e[r.src],
      l = e[r.dst];
    if (d == null || l == null || d === l) continue;
    let x = r.src,
      y = r.dst,
      f = d,
      g = l;
    d > l && ((x = r.dst), (y = r.src), (f = l), (g = d));
    for (let M = f; M < g; M++) o.push({ id: `${r.id}@${M}`, src: x, dst: y, ref: r.ref });
  }
  let s = 0;
  for (let r = 0; r + 1 < t.length; r++) s += Fr(t[r], t[r + 1], o);
  return s;
}
c(ao, "totalCrossings");
function _r(t, n) {
  var x, y, f;
  const e = { ...n },
    { preds: o } = Te(t),
    s = Tn(t),
    r = ve(t, e, s);
  let d = ao(r, t.edges, e);
  const l = Ce.MAX_CROSSING_OPTIMIZATION_PASSES;
  for (let g = 0; g < l; g++) {
    let M = !1;
    const i = [...t.nodes].sort((u, h) => {
      var p, I;
      return ((p = e[h]) != null ? p : 0) - ((I = e[u]) != null ? I : 0);
    });
    for (const u of i) {
      const h = (x = e[u]) != null ? x : 0;
      if (h === 0) continue;
      let p = 0;
      for (const C of (y = o.get(u)) != null ? y : []) p = Math.max(p, ((f = e[C]) != null ? f : 0) + 1);
      if (p >= h) continue;
      const I = h;
      e[u] = p;
      const v = ve(t, e, s),
        A = ao(v, t.edges, e);
      A < d ? ((d = A), (M = !0)) : (e[u] = I);
    }
    if (!M) break;
  }
  return e;
}
c(_r, "optimizeRanksByCrossings");
function Dr(t, n) {
  var s, r;
  const e = Tn(t),
    o = [...t.nodes].sort((d, l) => {
      var x, y;
      return ((x = n[d]) != null ? x : 0) - ((y = n[l]) != null ? y : 0) || d.localeCompare(l);
    });
  for (const d of o) {
    const l = e(d);
    if (!l) continue;
    const x = t.edges.filter((I) => I.src === d);
    if (x.length === 0) continue;
    let y = !1,
      f = 0;
    for (const I of x) {
      const v = e(I.dst);
      v == null || v === l ? (y = !0) : f++;
    }
    if (f === 0 || y) continue;
    let g = 0,
      M = !1;
    for (const I of t.edges) {
      if (I.dst !== d) continue;
      const v = e(I.src);
      v && (v === l ? (M = !0) : g++);
    }
    if (g > 0 || !M) continue;
    const i = (s = n[d]) != null ? s : 0,
      u = i + f;
    let h = 0;
    for (const I of t.edges) I.dst === d && (h = Math.max(h, ((r = n[I.src]) != null ? r : 0) + 1));
    const p = Math.max(i, h, u);
    p !== i && (n[d] = p);
  }
}
c(Dr, "adjustCrossLaneSources");
function Hr(t, n) {
  var x, y, f, g, M, i;
  const e = Pn(t),
    o = (x = te(e)) != null ? x : [...e.nodes].sort(),
    s = (y = n == null ? void 0 : n.compactSingleInput) != null ? y : !1,
    r = Tn(e);
  let d = Object.create(null);
  for (const u of o) {
    const h = No(e, u),
      p =
        n != null && n.ignoreCrossLaneEdges
          ? h.filter((I) => {
              const v = r(I.src),
                A = r(u);
              return !v || !A ? !0 : v === A;
            })
          : h;
    if (p.length === 0) d[u] = 0;
    else if (s && p.length === 1) {
      const I = p[0].src,
        v = r(I),
        A = r(u);
      v !== A ? (d[u] = (f = d[I]) != null ? f : 0) : (d[u] = ((g = d[I]) != null ? g : 0) + 1);
    } else {
      let I = -1 / 0;
      for (const v of p) I = Math.max(I, ((M = d[v.src]) != null ? M : 0) + 1);
      d[u] = I === -1 / 0 ? 0 : I;
    }
  }
  return (
    (i = n == null ? void 0 : n.optimizeRanksByCrossings) != null && i && (d = _r(e, d)),
    n != null && n.ignoreCrossLaneEdges && Dr(e, d),
    { layers: ve(e, d, r), rankOf: d, dummy: new Set() }
  );
}
c(Hr, "assignLayers_LongestPath");
function Xr(t, n) {
  var u, h, p, I, v, A;
  const e = Pn(t),
    s = {
      ...Hr(e, {
        compactSingleInput: n == null ? void 0 : n.compactSingleInput,
        ignoreCrossLaneEdges: n == null ? void 0 : n.ignoreCrossLaneEdges,
        optimizeRanksByCrossings: n == null ? void 0 : n.optimizeRanksByCrossings,
      }).rankOf,
    },
    r = Tn(e),
    { preds: d, succs: l } = Te(e, (C) => {
      if (n != null && n.ignoreCrossLaneEdges) {
        const a = r(C.src),
          m = r(C.dst);
        if (a && m && a !== m) return !1;
      }
      return !0;
    }),
    x = (u = te(e)) != null ? u : [...e.nodes],
    y = [...x].reverse(),
    f = c((C, a) => {
      var L, O, R;
      let m = 0;
      for (const k of (L = d.get(C)) != null ? L : []) m = Math.max(m, ((O = s[k]) != null ? O : 0) + 1);
      let S = Number.POSITIVE_INFINITY;
      const E = (R = l.get(C)) != null ? R : [];
      return (
        E.length > 0 &&
          (S = Math.min(
            ...E.map((k) => {
              var D;
              return ((D = s[k]) != null ? D : 0) - 1;
            }),
          )),
        Number.isFinite(S) || (S = Math.max(m, a)),
        Math.min(Math.max(a, m), S)
      );
    }, "clampFeasible"),
    g = Ce.GRAVITY_ITERATIONS,
    M = c((C) => {
      var m, S, E, L;
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
              : (E = s[O]) != null
                ? E
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
    const a = M(x),
      m = M(y);
    if (!a && !m) break;
  }
  for (const C of x) {
    let a = 0;
    for (const m of (h = d.get(C)) != null ? h : []) a = Math.max(a, ((p = s[m]) != null ? p : 0) + 1);
    ((I = s[C]) != null ? I : 0) < a && (s[C] = a);
  }
  for (const C of y) {
    const a = (v = l.get(C)) != null ? v : [];
    if (a.length > 0) {
      const m = Math.min(
        ...a.map((S) => {
          var E;
          return ((E = s[S]) != null ? E : 0) - 1;
        }),
      );
      ((A = s[C]) != null ? A : 0) > m && (s[C] = m);
    }
  }
  return { layers: ko(e, x, s), rankOf: s, dummy: new Set() };
}
c(Xr, "assignLayers_Gravity");
function Yr(t) {
  var r, d, l;
  const n = Po(t),
    e = Oo(t);
  let o = Bo(n);
  const s = [];
  for (; o.length > 0;) {
    const x = [];
    for (const y of o) {
      s.push(y);
      for (const f of (r = e.get(y)) != null ? r : [])
        (n.set(f, ((d = n.get(f)) != null ? d : 0) - 1), ((l = n.get(f)) != null ? l : 0) === 0 && x.push(f));
    }
    o = x.sort((y, f) => y.localeCompare(f));
  }
  return s.length === t.nodes.length ? s : null;
}
c(Yr, "topoSortByGenerationIfAcyclic");
function Gr(t, n) {
  var f, g, M, i;
  const e = Pn(t),
    o =
      (n == null ? void 0 : n.direction) === "LR"
        ? (f = Yr(e)) != null
          ? f
          : [...e.nodes].sort()
        : (g = te(e)) != null
          ? g
          : [...e.nodes].sort(),
    s = Tn(e),
    r = c((u) => {
      var h;
      return (h = s(u)) != null ? h : u;
    }, "laneOf"),
    d = Object.create(null),
    l = new Map(),
    x = c((u, h) => {
      var I;
      return ((I = n == null ? void 0 : n.ignoreCrossLaneEdges) != null ? I : !0) ? (r(u) === r(h) ? 1 : 0) : 1;
    }, "edgeWeight");
  for (const u of o) {
    const h = e.nodeById.get(u);
    if (h != null && h.isGroup) continue;
    const p = No(e, u);
    let I = 0;
    if (p.length > 0)
      for (const a of p) {
        const m = a.src,
          S = (M = d[m]) != null ? M : 0;
        I = Math.max(I, S + x(m, u));
      }
    const v = r(u),
      A = (i = l.get(v)) != null ? i : 0,
      C = Math.max(I, A);
    ((d[u] = C), l.set(v, C + 1));
  }
  return { layers: ko(e, o, d, { skipGroups: !0 }), rankOf: d, dummy: new Set() };
}
c(Gr, "assignLayers_LaneAwareCompact");
function $r(t, n) {
  var i, u;
  const e = Pn(n),
    { rankOf: o } = t,
    s = t.layers.map((h) => [...h]),
    r = new Set(t.dummy ? [...t.dummy] : []);
  let d = 0;
  const l = new Map(e.nodeById),
    x = c((h) => {
      const p = `placeholder-${d++}`,
        I = { id: p, isGroup: !1, isDummy: !0, width: 0, height: 0 };
      for (l.set(p, I), r.add(p); s.length <= h;) s.push([]);
      return (s[h].push(p), (o[p] = h), p);
    }, "addDummyAt"),
    y = [...e.edges].sort((h, p) =>
      h.id === p.id
        ? h.src === p.src
          ? h.dst.localeCompare(p.dst)
          : h.src.localeCompare(p.src)
        : h.id.localeCompare(p.id),
    ),
    f = [];
  for (const h of y) {
    const p = (i = o[h.src]) != null ? i : 0,
      I = (u = o[h.dst]) != null ? u : 0;
    if (I - p <= 1) {
      f.push(h);
      continue;
    }
    let v = h.src;
    for (let C = p + 1, a = 0; C < I; C++, a++) {
      const m = x(C);
      (f.push({ id: `${h.id}#${a}`, src: v, dst: m, weight: h.weight, ref: h.ref }), (v = m));
    }
    const A = I - p - 2;
    f.push({ id: `${h.id}#${Math.max(A + 1, 0)}`, src: v, dst: h.dst, weight: h.weight, ref: h.ref });
  }
  const M = {
    nodes: [...e.nodes, ...[...r].filter((h) => !e.nodes.includes(h))],
    edges: f,
    layout: e.layout,
    nodeById: l,
  };
  return { layering: { layers: s, rankOf: o, dummy: r }, graphWithDummies: M };
}
c($r, "makeProperLayering");
function lo(t) {
  const n = t.length;
  if (n === 0) return Number.POSITIVE_INFINITY;
  const e = [...t].sort((o, s) => o - s);
  return n % 2 === 1 ? e[(n - 1) / 2] : 0.5 * (e[n / 2 - 1] + e[n / 2]);
}
c(lo, "median");
function fo(t) {
  return t.length === 0 ? Number.POSITIVE_INFINITY : t.reduce((e, o) => e + o, 0) / t.length;
}
c(fo, "barycenter");
function zr(t, n, e, o) {
  const s = new Map();
  for (const r of t) s.set(r, []);
  for (const r of e)
    o === "down"
      ? n.has(r.src) && s.has(r.dst) && s.get(r.dst).push(n.get(r.src))
      : n.has(r.dst) && s.has(r.src) && s.get(r.src).push(n.get(r.dst));
  return s;
}
c(zr, "neighborPositionsFor");
function Vr(t, n, e) {
  var r, d;
  const o = (r = e.get(t)) != null ? r : 0,
    s = (d = e.get(n)) != null ? d : 0;
  return o !== s ? o - s : t.localeCompare(n);
}
c(Vr, "currentOrderTieBreak");
function uo(t, n, e) {
  const o = new Set(t),
    s = new Set(n),
    r = qn(t),
    d = qn(n),
    l = [];
  for (const y of e) o.has(y.src) && s.has(y.dst) && l.push({ u: r.get(y.src), v: d.get(y.dst) });
  l.sort((y, f) => (y.u === f.u ? y.v - f.v : y.u - f.u));
  const x = l.map((y) => y.v);
  return Fo(x);
}
c(uo, "countCrossingsBetweenAdjacent");
function ge(t, n, e) {
  return [...t].sort((o, s) => {
    var l, x;
    const r = lo((l = n.get(o)) != null ? l : []),
      d = lo((x = n.get(s)) != null ? x : []);
    return r === d ? Vr(o, s, e) : isFinite(r) ? (isFinite(d) ? r - d : -1) : 1;
  });
}
c(ge, "sortByHeuristic");
function ho(t, n, e, o, s, r) {
  var M, i, u;
  const d = qn(t),
    l = qn(n),
    x = zr(n, d, e, o);
  if (!s || !r || r.length === 0) return ge(n, x, l);
  const y = new Map();
  for (const h of n) {
    const p = s(h),
      I = (M = y.get(p)) != null ? M : [];
    (I.push(h), y.set(p, I));
  }
  const f = [];
  for (const h of r) {
    const p = y.get(h);
    if (!p || p.length === 0) continue;
    const I = ge(p, x, l);
    f.push(...I);
  }
  const g = y.get(null);
  if (g && g.length > 0) {
    const h = ge(g, x, l);
    for (const p of h) {
      const I = fo((i = x.get(p)) != null ? i : []);
      let v = f.length;
      if (isFinite(I))
        for (const [A, C] of f.entries()) {
          const a = fo((u = x.get(C)) != null ? u : []);
          if (I < a) {
            v = A;
            break;
          }
        }
      f.splice(v, 0, p);
    }
  }
  return f;
}
c(ho, "reorderLayer");
function go(t, n, e, o, s) {
  const r = [...n],
    d = new Set(t),
    l = new Set(n),
    x = o ? new Set(o) : null,
    y = e.filter((h) => d.has(h.src) && l.has(h.dst)),
    f = x ? e.filter((h) => l.has(h.src) && x.has(h.dst)) : void 0,
    g = c((h) => {
      let p = uo(t, h, y);
      return (f && o && (p += uo(h, o, f)), p);
    }, "crossingScore"),
    M = s ? new Map() : null;
  if (s && M) for (const h of n) M.set(h, s(h));
  let i = !0,
    u = g(r);
  for (; i;) {
    i = !1;
    for (let h = 0; h + 1 < r.length; h++) {
      if (M) {
        const v = M.get(r[h]),
          A = M.get(r[h + 1]);
        if (v !== A) continue;
      }
      const p = u;
      [r[h], r[h + 1]] = [r[h + 1], r[h]];
      const I = g(r);
      I < p ? ((u = I), (i = !0)) : ([r[h], r[h + 1]] = [r[h + 1], r[h]]);
    }
  }
  return r;
}
c(go, "transposeImprove");
function jr(t, n, e) {
  const o = t.layers.map((l) => [...l]),
    s = n.edges,
    r = Tn(n),
    d = _o(n, e == null ? void 0 : e.laneOrder);
  for (let l = 0; l < 3; l++) {
    for (let x = 1; x < o.length; x++)
      ((o[x] = ho(o[x - 1], o[x], s, "down", r, d)), (o[x] = go(o[x - 1], o[x], s, o[x + 1], r)));
    for (let x = o.length - 2; x >= 0; x--)
      ((o[x] = ho(o[x + 1], o[x], s, "up", r, d)), (o[x] = go(o[x + 1], o[x], s, o[x - 1], r)));
  }
  return { layers: o };
}
c(jr, "orderLayers");
function Ur(t, n, e) {
  var O, R, k, D, J, at, gt, mt, St, bt, Pt, kt, Xt;
  const o = (O = e == null ? void 0 : e.layerGap) != null ? O : As.DEFAULT_LAYER_GAP,
    s = (R = e == null ? void 0 : e.nodeGap) != null ? R : As.DEFAULT_NODE_GAP,
    r = (k = e == null ? void 0 : e.laneGap) != null ? k : s * 2,
    d = (D = e == null ? void 0 : e.direction) != null ? D : "TB",
    l = d === "LR" || d === "RL",
    x = t.layers,
    y = Object.create(null),
    f = Object.create(null),
    g = c((ft) => n.nodeById.get(ft), "getNode"),
    M = c((ft) => {
      var W, K;
      return (K = (W = g(ft)) == null ? void 0 : W.width) != null ? K : 0;
    }, "getWidth"),
    i = c((ft) => {
      var W, K;
      return (K = (W = g(ft)) == null ? void 0 : W.height) != null ? K : 0;
    }, "getHeight"),
    u = Tn(n),
    h = _o(n, e == null ? void 0 : e.laneOrder),
    p = x.map((ft) => ft.reduce((W, K) => Math.max(W, i(K)), 0)),
    I = [];
  if (l)
    for (let ft = 0; ft + 1 < x.length; ft++) {
      const W = x[ft].reduce((yt, Lt) => Math.max(yt, M(Lt)), 0),
        K = x[ft + 1].reduce((yt, Lt) => Math.max(yt, M(Lt)), 0),
        V = p[ft],
        G = p[ft + 1],
        tt = V / 2 + G / 2,
        nt = (W + K) / 2,
        et = Math.max(0, nt - tt - o);
      I.push(et);
    }
  const v = new Set();
  for (const ft of x) for (const W of ft) v.add(u(W));
  const A = v.has(null),
    C = h.filter((ft) => v.has(ft)),
    a = [...(A ? [null] : []), ...C],
    m = Object.create(null);
  for (const ft of C) m[ft] = 0;
  A && (m.null = 0);
  for (const ft of x) {
    const W = Object.create(null),
      K = [];
    for (const V of ft) {
      const G = u(V);
      G === null ? K.push(V) : (W[G] || (W[G] = [])).push(V);
    }
    for (const [V, G] of Object.entries(W)) {
      const tt = G.reduce((nt, et) => nt + M(et), 0) + s * Math.max(0, G.length - 1);
      m[V] = Math.max((J = m[V]) != null ? J : 0, tt);
    }
    if (A && K.length) {
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
        nt = K + tt / 2;
      (S.set(G, nt), (K += tt), V < a.length - 1 && (K += r));
    }
  }
  let E = 0;
  for (const [ft, W] of x.entries()) {
    const K = (mt = p[ft]) != null ? mt : 0,
      V = new Map();
    for (const tt of W) {
      const nt = u(tt),
        et = (St = V.get(nt)) != null ? St : [];
      (et.push(tt), V.set(nt, et));
    }
    for (const tt of a) {
      const nt = (bt = V.get(tt)) != null ? bt : [];
      if (nt.length === 0) continue;
      const et = S.get(tt);
      if (nt.length === 1) {
        const yt = nt[0];
        ((y[yt] = et), (f[yt] = E + K / 2));
      } else {
        const yt = nt.map((Wt) => M(Wt)),
          Lt = yt.reduce((Wt, on) => Wt + on, 0) + s * (nt.length - 1);
        let Ft = et - Lt / 2;
        for (const [Wt, on] of nt.entries()) {
          const Mn = yt[Wt];
          ((y[on] = Ft + Mn / 2), (f[on] = E + K / 2), (Ft += Mn + s));
        }
      }
    }
    const G = (Pt = I[ft]) != null ? Pt : 0;
    E += K + o + G;
  }
  const L = new Map();
  for (const ft of n.edges) {
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
    for (const nt of ft) (tt.add(nt.src), tt.add(nt.dst));
    for (const nt of tt) {
      if (nt === K || nt === V) continue;
      const et = n.nodeById.get(nt);
      et != null && et.isDummy && (y[nt] = G);
    }
  }
  return { x: y, y: f };
}
c(Ur, "assignCoordinates");
var Wr = 8;
function Kr(t) {
  let n = 2166136261;
  for (let e = 0; e < t.length; e++) ((n ^= t.charCodeAt(e)), (n = Math.imul(n, 16777619)));
  return n >>> 0;
}
c(Kr, "hashString");
function qr(t) {
  let n = t >>> 0;
  return () => {
    n += 1831565813;
    let e = n;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
c(qr, "mulberry32");
function Jr(t, n) {
  const e = [...t],
    o = qr(n);
  for (let s = e.length - 1; s > 0; s--) {
    const r = Math.floor(o() * (s + 1));
    [e[s], e[r]] = [e[r], e[s]];
  }
  return e;
}
c(Jr, "deterministicShuffle");
function Zr(t, n) {
  var o;
  let e = 0;
  for (const [s, r] of t.entries()) e += Math.abs(s - ((o = n.get(r)) != null ? o : s));
  return e;
}
c(Zr, "sourceDistance");
function mo(t, n) {
  const e = new Map();
  for (const [s, r] of t.entries()) e.set(r, s);
  let o = 0;
  for (const { a: s, b: r, weight: d } of n) {
    const l = e.get(s),
      x = e.get(r);
    l == null || x == null || (o += d * Math.abs(l - x));
  }
  return o;
}
c(mo, "laneArrangementCost");
function Qr(t) {
  var r;
  const n = Ae(t);
  if (n.length < 2) return [];
  const e = new Map(n.map((d, l) => [d, l])),
    o = Tn(t),
    s = new Map();
  for (const d of (r = t.layout.edges) != null ? r : []) {
    if (d.isLayoutOnly) continue;
    const l = typeof d.start == "string" ? d.start : void 0,
      x = typeof d.end == "string" ? d.end : void 0;
    if (!l || !x || !t.nodeById.has(l) || !t.nodeById.has(x)) continue;
    const y = o(l),
      f = o(x);
    if (!y || !f || y === f) continue;
    const g = e.get(y),
      M = e.get(f);
    if (g == null || M == null) continue;
    const [i, u] = g <= M ? [y, f] : [f, y],
      h = `${i}\0${u}`,
      p = s.get(h);
    p ? p.weight++ : s.set(h, { a: i, b: u, weight: 1 });
  }
  return [...s.values()];
}
c(Qr, "buildWeightedLaneEdges");
function yo(t, n, e) {
  const o = [...t];
  let s = mo(o, n),
    r = !0,
    d = 0;
  const l = Math.max(1, o.length);
  for (; r && d < l;) {
    ((r = !1), d++);
    for (let x = 0; x + 1 < o.length; x++) {
      [o[x], o[x + 1]] = [o[x + 1], o[x]];
      const y = mo(o, n);
      y < s ? ((s = y), (r = !0)) : ([o[x], o[x + 1]] = [o[x + 1], o[x]]);
    }
  }
  return { order: o, cost: s, sourceDistance: Zr(o, e) };
}
c(yo, "greedySwitch");
function ti(t, n) {
  return t.cost !== n.cost ? t.cost < n.cost : t.sourceDistance < n.sourceDistance;
}
c(ti, "isBetterCandidate");
function ni(t, n, e) {
  const o = [...n]
    .sort((s, r) => (s.a === r.a ? s.b.localeCompare(r.b) : s.a.localeCompare(r.a)))
    .map(({ a: s, b: r, weight: d }) => `${s}:${r}:${d}`)
    .join("|");
  return Kr(`${t.join("|")}#${o}#${e}`);
}
c(ni, "seedForRestart");
function ei(t, n = {}) {
  var l;
  const e = Ae(t);
  if (e.length < 2) return e;
  const o = Qr(t);
  if (o.length === 0) return e;
  const s = new Map(e.map((x, y) => [x, y]));
  let r = yo(e, o, s);
  const d = Math.max(0, (l = n.restarts) != null ? l : Wr);
  for (let x = 0; x < d; x++) {
    const y = ni(e, o, x),
      f = Jr(e, y),
      g = yo(f, o, s);
    ti(g, r) && (r = g);
  }
  return r.order;
}
c(ei, "optimizeTopLaneOrder");
function oi(t, n) {
  var i, u, h, p;
  const e = (i = n == null ? void 0 : n.ignoreCrossLaneEdges) != null ? i : !0,
    o = (u = n == null ? void 0 : n.optimizeRanksByCrossings) != null ? u : !0,
    s = Pn(t),
    r = n != null && n.automaticLaneOrdering ? ei(s, { restarts: Wr }) : void 0,
    d = Cr(s),
    l = d.acyclic,
    x = e
      ? Gr(l, {
          compactSingleInput:
            (h = n == null ? void 0 : n.compactSingleInput) != null ? h : Ce.DEFAULT_COMPACT_SINGLE_INPUT,
          ignoreCrossLaneEdges: !0,
          direction: n == null ? void 0 : n.direction,
        })
      : Xr(l, {
          compactSingleInput:
            (p = n == null ? void 0 : n.compactSingleInput) != null ? p : Ce.DEFAULT_COMPACT_SINGLE_INPUT,
          ignoreCrossLaneEdges: !1,
          optimizeRanksByCrossings: o,
        }),
    { layering: y, graphWithDummies: f } = $r(x, l),
    g = jr(y, f, { laneOrder: r }),
    M = Ur(g, f, {
      layerGap: n == null ? void 0 : n.layerGap,
      nodeGap: n == null ? void 0 : n.nodeGap,
      direction: n == null ? void 0 : n.direction,
      laneOrder: r,
    });
  return { acyclic: l, reversed: d.reversed, layering: y, ordered: g, coordinates: M };
}
c(oi, "sugiyamaLayout");
var It = Ai.EPSILON,
  wi = 8,
  Fn = 15,
  jn = 15,
  ue = 25,
  pn = 20,
  _e = 10;
function xo(t, n, e) {
  var f, g;
  const o = (f = t.x) != null ? f : 0,
    s = (g = t.y) != null ? g : 0,
    r = n.x - o,
    d = n.y - s,
    l = Math.abs(r),
    x = Math.abs(d);
  return l < It && x < It
    ? e
    : x > It && x * 3 >= l
      ? d > 0
        ? "bottom"
        : "top"
      : l > It
        ? r > 0
          ? "right"
          : "left"
        : e;
}
c(xo, "chooseOrthogonalSide");
function po(t, n) {
  return Math.abs(t.to - n.from) < It || Math.abs(t.to - n.to) < It ? t.to : t.from;
}
c(po, "sharedLineEndpointCoord");
function _n(t, n) {
  return t.orient === "vertical" ? { x: t.coord, y: n } : { x: n, y: t.coord };
}
c(_n, "pointOnLine");
function si(t, n) {
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
    ln,
    Zt,
    sn,
    Xn,
    Yn,
    Zn,
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
    ns,
    es,
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
  const e = (F = t.nodes) != null ? F : [],
    o = (_ = t.edges) != null ? _ : [],
    s = [];
  for (const b of o) b.isLayoutOnly || s.push({ ...b, __originalEdge: b });
  const r = new Map(),
    d = new Map(),
    l = [],
    x = n === "LR";
  for (const b of e) r.set(b.id, b);
  const y = e.filter((b) => b.isGroup && !b.parentId);
  for (const b of y) {
    const T = { id: b.id },
      B = c((w) => {
        (d.set(w.id, T), e.filter((P) => P.parentId === w.id).forEach(B));
      }, "assignLane");
    B(b);
  }
  const f = e
      .filter((b) => !b.isGroup && !b.isEdgeLabel)
      .map((b) => {
        var Q, lt, U, Y;
        const T = (Q = b.width) != null ? Q : 10,
          B = (lt = b.height) != null ? lt : 10,
          w = (U = b.x) != null ? U : 0,
          P = (Y = b.y) != null ? Y : 0,
          X = wi;
        return {
          nodeId: b.id,
          minX: w - T / 2 - X,
          maxX: w + T / 2 + X,
          minY: P - B / 2 - X,
          maxY: P + B / 2 + X,
          visualXHalfExtent: x ? B / 2 + X : T / 2 + X,
        };
      }),
    g = c((b, T, B, w) => {
      let P = l.find((X) => X.orientation === b && Math.abs(X.coord - T) < 1);
      return (
        P ||
          ((P = { id: `pipe-${b}-${T.toFixed(0)}`, orientation: b, coord: T, spanMin: B, spanMax: w, tracks: [] }),
          l.push(P)),
        (P.spanMin = Math.min(P.spanMin, B)),
        (P.spanMax = Math.max(P.spanMax, w)),
        P
      );
    }, "getOrAddPipe"),
    M = c((b, T) => {
      var Q, lt, U, Y;
      const B = (Q = b.width) != null ? Q : 10,
        w = (lt = b.height) != null ? lt : 10,
        P = (U = b.x) != null ? U : 0,
        X = (Y = b.y) != null ? Y : 0;
      switch (T) {
        case "top":
          return { x: P, y: X - w / 2 };
        case "bottom":
          return { x: P, y: X + w / 2 };
        case "left":
          return { x: P - B / 2, y: X };
        case "right":
          return { x: P + B / 2, y: X };
      }
    }, "portForSide"),
    i = c((b, T, B) => M(b, xo(b, T, B ? "bottom" : "top")), "getOrthogonalPort"),
    u = [],
    h = [],
    p = new Set(),
    I = 1e3,
    v = c((b, T, B) => {
      if (u.length === 0) return 0;
      const w = Math.abs(T.y - B.y) < It,
        P = Math.abs(T.x - B.x) < It;
      if (!w && !P) return 0;
      let X = 0;
      if (w) {
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
    A = s
      .map((b, T) => {
        var Y, Ct, pt, ut;
        if (!b.start || !b.end) return { idx: T, crossLane: 0, dx: 0, dy: 0 };
        const B = r.get(b.start),
          w = r.get(b.end),
          P = d.get(b.start),
          X = d.get(b.end),
          Q = P && X && P.id !== X.id ? 1 : 0,
          lt = B && w ? Math.abs(((Y = w.x) != null ? Y : 0) - ((Ct = B.x) != null ? Ct : 0)) : 0,
          U = B && w ? Math.abs(((pt = w.y) != null ? pt : 0) - ((ut = B.y) != null ? ut : 0)) : 0;
        return { idx: T, crossLane: Q, dx: lt, dy: U };
      })
      .sort((b, T) => {
        if (b.crossLane !== T.crossLane) return T.crossLane - b.crossLane;
        const B = b.dx + b.dy,
          w = T.dx + T.dy;
        return Math.abs(B - w) > 1 ? B - w : b.idx - T.idx;
      })
      .map((b) => b.idx),
    C = c((b, T, B, w) => {
      const P = Math.min(b.x, T.x),
        X = Math.max(b.x, T.x),
        Q = Math.min(b.y, T.y),
        lt = Math.max(b.y, T.y);
      return !!f.find((Y) =>
        (B && Y.nodeId === B) || (w && Y.nodeId === w)
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
  const S = c((b, T) => xo(b, T, "bottom"), "determineSide"),
    E = new Map();
  for (const [b, T] of s.entries()) {
    if (!T.start || !T.end || T.start === T.end || (T.points && T.points.length > 0)) continue;
    const B = r.get(T.start),
      w = r.get(T.end);
    if (!B || !w) continue;
    const P = ((ot = w.x) != null ? ot : 0) - ((z = B.x) != null ? z : 0),
      X = ((Z = w.y) != null ? Z : 0) - ((it = B.y) != null ? it : 0);
    E.set(b, {
      edgeIdx: b,
      srcId: T.start,
      dstId: T.end,
      srcSide: S(B, { x: (ct = w.x) != null ? ct : 0, y: (Rt = w.y) != null ? Rt : 0 }),
      dstSide: S(w, { x: (Bt = B.x) != null ? Bt : 0, y: (ln = B.y) != null ? ln : 0 }),
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
  for (const b of E.values()) {
    const T = `${b.srcId}:${b.srcSide}`;
    (R.has(T) || R.set(T, []), R.get(T).push(b));
  }
  const k = new Map(),
    D = c((b, T) => `${b}:${T}`, "loadKey");
  for (const b of E.values())
    (k.set(D(b.srcId, b.srcSide), ((Zt = k.get(D(b.srcId, b.srcSide))) != null ? Zt : 0) + 1),
      k.set(D(b.dstId, b.dstSide), ((sn = k.get(D(b.dstId, b.dstSide))) != null ? sn : 0) + 1));
  for (const b of R.values())
    if (!(b.length < 2)) {
      b.sort((T, B) => {
        const w = L(T),
          P = L(B);
        return Math.abs(w - P) > 1e-9 ? P - w : T.edgeIdx - B.edgeIdx;
      });
      for (let T = 1; T < b.length; T++) {
        const B = b[T],
          w = O(B),
          P = (Xn = k.get(D(B.srcId, B.srcSide))) != null ? Xn : 0,
          X = (Yn = k.get(D(B.srcId, w))) != null ? Yn : 0;
        X >= P || (k.set(D(B.srcId, B.srcSide), P - 1), k.set(D(B.srcId, w), X + 1), (B.srcSide = w));
      }
    }
  const J = c((b) => {
      const T = b == null ? void 0 : b.shape;
      return T === "question" || T === "diamond";
    }, "isDiamondNode"),
    at = new Map();
  for (const b of E.values()) (at.has(b.dstId) || at.set(b.dstId, new Set()), at.get(b.dstId).add(b.dstSide));
  for (const b of E.values()) {
    if (!J(r.get(b.srcId))) continue;
    const T = at.get(b.srcId);
    if (!(T != null && T.has(b.srcSide))) continue;
    const B = O(b);
    if (T.has(B) || ((Zn = k.get(D(b.srcId, B))) != null ? Zn : 0) > 0) continue;
    const w = (Ho = k.get(D(b.srcId, b.srcSide))) != null ? Ho : 0;
    (k.set(D(b.srcId, b.srcSide), Math.max(0, w - 1)), k.set(D(b.srcId, B), 1), (b.srcSide = B));
  }
  for (const b of E.values()) {
    const { edgeIdx: T, srcId: B, dstId: w, srcSide: P, dstSide: X } = b,
      Q = r.get(B),
      lt = r.get(w),
      U = `${B}:${P}:src`,
      Y = P === "top" || P === "bottom" ? ((Xo = lt.x) != null ? Xo : 0) : (Yo = lt.y) != null ? Yo : 0;
    (a.has(U) || a.set(U, []), a.get(U).push({ edgeIdx: T, oppositeCoord: Y }));
    const Ct = `${w}:${X}:dst`,
      pt = X === "top" || X === "bottom" ? ((Go = Q.x) != null ? Go : 0) : ($o = Q.y) != null ? $o : 0;
    (a.has(Ct) || a.set(Ct, []), a.get(Ct).push({ edgeIdx: T, oppositeCoord: pt }));
  }
  const gt = new Map(),
    mt = 8;
  for (const [b, T] of a) {
    if (T.length < 2) continue;
    T.sort((Nt, $t) => Nt.oppositeCoord - $t.oppositeCoord);
    const B = b.split(":"),
      w = B.slice(0, -2).join(":"),
      P = B[B.length - 2],
      X = B[B.length - 1],
      Q = r.get(w);
    if (!Q) continue;
    const U = P === "left" || P === "right" ? ((zo = Q.height) != null ? zo : 10) : (Vo = Q.width) != null ? Vo : 10,
      Y = Q.shape,
      pt = Y === "question" || Y === "diamond" ? U * 0.3 : U,
      dt = Math.min(20, Math.max(mt, pt / (T.length + 1))),
      At = -(dt * (T.length - 1)) / 2;
    for (const [Nt, $t] of T.entries()) {
      const Qt = At + Nt * dt,
        Gn = `${$t.edgeIdx}:${X}`;
      gt.set(Gn, Qt);
    }
  }
  const St = c((b) => {
      var T;
      return !!((T = s[b]) != null && T.labelNodeId);
    }, "edgeHasLabelNode"),
    bt = c((b, T) => {
      var B, w;
      return b
        ? ((B = a.get(`${b}:${T}:src`)) != null ? B : []).some(({ edgeIdx: P }) => St(P)) ||
            ((w = a.get(`${b}:${T}:dst`)) != null ? w : []).some(({ edgeIdx: P }) => St(P))
        : !1;
    }, "faceHasLabelNode"),
    Pt = c(
      (b, T, B) => (T === "top" || T === "bottom" ? { x: b.x + B, y: b.y } : { x: b.x, y: b.y + B }),
      "applyPortOffset",
    ),
    kt = c((b, T, B) => {
      var ut, dt, xt, At, Nt, $t;
      const w = E.get(b),
        P = { x: (ut = B.x) != null ? ut : 0, y: (dt = B.y) != null ? dt : 0 },
        X = { x: (xt = T.x) != null ? xt : 0, y: (At = T.y) != null ? At : 0 },
        Q = (Nt = w == null ? void 0 : w.srcSide) != null ? Nt : S(T, P),
        lt = ($t = w == null ? void 0 : w.dstSide) != null ? $t : S(B, X);
      let U = w ? M(T, w.srcSide) : i(T, P, !0),
        Y = w ? M(B, w.dstSide) : i(B, X, !1);
      const Ct = gt.get(`${b}:src`),
        pt = gt.get(`${b}:dst`);
      return (
        Ct !== void 0 && (U = Pt(U, Q, Ct)),
        pt !== void 0 && (Y = Pt(Y, lt, pt)),
        { pSrcPort: U, pDstPort: Y, srcSide: Q, dstSide: lt }
      );
    }, "portsForEdge");
  for (const b of A) {
    const T = s[b];
    if (((h[b] = []), !T.start || !T.end || (T.points && T.points.length > 0) || T.start === T.end)) continue;
    const B = r.get(T.start),
      w = r.get(T.end);
    if (!B || !w) continue;
    const { pSrcPort: P, pDstPort: X, srcSide: Q, dstSide: lt } = kt(b, B, w),
      U = { ...P },
      Y = { ...X },
      Ct = Q === "top" || Q === "bottom",
      pt = lt === "top" || lt === "bottom";
    if (Ct) {
      const H = P.y > ((jo = B.y) != null ? jo : 0);
      U.y = H ? P.y + pn : P.y - pn;
    } else {
      const H = P.x > ((Uo = B.x) != null ? Uo : 0);
      U.x = H ? P.x + pn : P.x - pn;
    }
    if (pt) {
      const H = X.y > ((Wo = w.y) != null ? Wo : 0);
      Y.y = H ? X.y + pn : X.y - pn;
    } else {
      const H = X.x > ((Ko = w.x) != null ? Ko : 0);
      Y.x = H ? X.x + pn : X.x - pn;
    }
    const ut = c((H, j) => {
        for (const st of f)
          if (!j.includes(st.nodeId) && H.x > st.minX && H.x < st.maxX && H.y > st.minY && H.y < st.maxY)
            return { inside: !0, obstacle: st };
        return { inside: !1 };
      }, "isPointInObstacle"),
      dt = c((H, j, st, Et, Gt) => {
        var qt, vt, tn, fn;
        if (Gt) {
          const Vt = H.y > ((qt = j.y) != null ? qt : 0);
          return {
            x: ((vt = st.x) != null ? vt : 0) >= H.x ? Et.maxX + Fn : Et.minX - Fn,
            y: Vt ? Et.maxY + jn : Et.minY - jn,
            leavesPositiveSide: Vt,
          };
        }
        const _t = H.x > ((tn = j.x) != null ? tn : 0),
          zt = ((fn = st.y) != null ? fn : 0) >= H.y;
        return { x: _t ? Et.maxX + Fn : Et.minX - Fn, y: zt ? Et.maxY + jn : Et.minY - jn, leavesPositiveSide: _t };
      }, "obstacleDetour");
    let xt = [];
    const At = [T.start, T.end],
      Nt = ut(U, At);
    if (Nt.inside && Nt.obstacle) {
      const H = Nt.obstacle;
      if (Ct) {
        const j = dt(P, B, w, H, !0);
        ((U.x = j.x), (U.y = j.y));
        const st = j.leavesPositiveSide ? Math.min(H.minY - 2, P.y + pn) : Math.max(H.maxY + 2, P.y - pn);
        xt = [
          { x: P.x, y: st },
          { x: j.x, y: st },
          { x: j.x, y: j.y },
        ];
      } else {
        const j = dt(P, B, w, H, !1),
          st = j.leavesPositiveSide ? Math.min(H.minX - 2, P.x + pn) : Math.max(H.maxX + 2, P.x - pn);
        ((U.x = j.x),
          (U.y = j.y),
          (xt = [
            { x: st, y: P.y },
            { x: st, y: j.y },
            { x: j.x, y: j.y },
          ]));
      }
    }
    let $t = [];
    const Qt = ut(Y, At);
    if (Qt.inside && Qt.obstacle) {
      const H = Qt.obstacle;
      if (pt) {
        const j = dt(X, w, B, H, !0);
        ((Y.x = j.x),
          (Y.y = j.y),
          ($t = [
            { x: j.x, y: j.y },
            { x: X.x, y: j.y },
          ]));
      } else {
        const j = dt(X, w, B, H, !1);
        ((Y.x = j.x),
          (Y.y = j.y),
          ($t = [
            { x: j.x, y: j.y },
            { x: j.x, y: X.y },
          ]));
      }
    }
    if (xt.length === 0 && $t.length === 0) {
      const H = Fn,
        j = Math.abs(U.x - Y.x) < H,
        st = Math.abs(U.y - Y.y) < H,
        Et = gt.get(`${b}:src`) !== void 0 || gt.get(`${b}:dst`) !== void 0,
        Gt =
          ((Zo = (Jo = a.get(`${(qo = T.start) != null ? qo : ""}:${Q}:src`)) == null ? void 0 : Jo.length) != null
            ? Zo
            : 0) +
          ((ns = (ts = a.get(`${(Qo = T.start) != null ? Qo : ""}:${Q}:dst`)) == null ? void 0 : ts.length) != null
            ? ns
            : 0),
        _t =
          ((ss = (os = a.get(`${(es = T.end) != null ? es : ""}:${lt}:src`)) == null ? void 0 : os.length) != null
            ? ss
            : 0) +
          ((cs = (is = a.get(`${(rs = T.end) != null ? rs : ""}:${lt}:dst`)) == null ? void 0 : is.length) != null
            ? cs
            : 0),
        zt = Gt > 1 || _t > 1,
        qt = (ls = m.get((as = T.start) != null ? as : "")) != null ? ls : 0,
        vt = (ds = m.get((fs = T.end) != null ? fs : "")) != null ? ds : 0,
        tn = (Gt > 1 && bt(T.start, Q)) || (_t > 1 && bt(T.end, lt)),
        fn = Gt <= 1 || qt <= 2,
        Vt = _t <= 1 || vt <= 2;
      if ((j || st) && !Et && (!zt || (zt && !tn && fn && Vt)) && !C(P, X, T.start, T.end)) {
        ((T.points = [{ ...P }, { ...U }, { ...Y }, { ...X }]), p.add(b));
        const Dt = st ? "horizontal" : "vertical",
          dn = st ? P.y : P.x,
          Ht = st ? Math.min(P.x, X.x) : Math.min(P.y, X.y),
          Yt = st ? Math.max(P.x, X.x) : Math.max(P.y, X.y),
          hn = {
            id: `fast-path-${Dt}-${dn.toFixed(0)}-${b}`,
            orientation: Dt,
            coord: dn,
            spanMin: Ht,
            spanMax: Yt,
            tracks: [],
          };
        u.push({ edgeIndex: b, segmentIndex: 0, orientation: Dt, pipe: hn, trackIndex: 0, from: Ht, to: Yt });
        continue;
      }
    }
    const Gn = g("vertical", U.x, U.y, U.y);
    U.x = Gn.coord;
    const ai = g("vertical", Y.x, Y.y, Y.y);
    Y.x = ai.coord;
    let An = Math.min(U.x, Y.x) - 50,
      wn = Math.max(U.x, Y.x) + 50,
      $n = Math.min(U.y, Y.y) - 50,
      zn = Math.max(U.y, Y.y) + 50;
    for (const H of f) {
      const j = Math.min(U.x, Y.x),
        st = Math.max(U.x, Y.x),
        Et = Math.min(U.y, Y.y),
        Gt = Math.max(U.y, Y.y);
      H.minX < st &&
        H.maxX > j &&
        H.minY < Gt &&
        H.maxY > Et &&
        ((An = Math.min(An, H.minX - ue)),
        (wn = Math.max(wn, H.maxX + ue)),
        ($n = Math.min($n, H.minY - ue)),
        (zn = Math.max(zn, H.maxY + ue)));
    }
    for (const H of f) {
      if (H.maxX < An || H.minX > wn || H.maxY < $n || H.minY > zn) continue;
      const j = Fn;
      (g("horizontal", H.minY - j, An, wn), g("horizontal", H.maxY + j, An, wn));
      const st = jn;
      (g("vertical", H.minX - st, $n, zn), g("vertical", H.maxX + st, $n, zn));
    }
    (g("horizontal", U.y, An, wn), g("horizontal", Y.y, An, wn));
    const li = l.filter((H) => H.orientation === "horizontal" && H.coord >= $n && H.coord <= zn),
      fi = l.filter((H) => H.orientation === "vertical" && H.coord >= An && H.coord <= wn),
      ee = c((H, j) => `${H.toFixed(1)},${j.toFixed(1)}`, "getKey"),
      oe = ee(U.x, U.y),
      xs = ee(Y.x, Y.y),
      se = new Map(),
      we = new Map(),
      Re = new Map(),
      re = new Set(),
      kn = [];
    (se.set(oe, 0), Re.set(oe, "n"), kn.push({ key: oe, f: Math.hypot(Y.x - U.x, Y.y - U.y), pt: U }), re.add(oe));
    let rn = [];
    const Rn = c((H, j) => C(H, j, T.start, T.end), "checkSegmentBlocked"),
      Ne = { x: Y.x, y: U.y },
      di = Rn(U, Ne),
      ui = Rn(Ne, Y),
      hi = di || ui,
      Oe = { x: U.x, y: Y.y },
      gi = Rn(U, Oe),
      mi = Rn(Oe, Y);
    if (
      (hi
        ? gi || mi || (Math.abs(U.x - Y.x) < It ? (rn = [U, Y]) : (rn = [U, Oe, Y]))
        : Math.abs(U.y - Y.y) < It || Math.abs(U.x - Y.x) < It
          ? (rn = [U, Y])
          : (rn = [U, Ne, Y]),
      rn.length === 0)
    )
      for (; kn.length > 0;) {
        kn.sort((vt, tn) => vt.f - tn.f);
        const H = kn.shift();
        if ((re.delete(H.key), H.key === xs)) {
          let vt = xs,
            tn = Y;
          for (rn = [tn]; we.has(vt);) {
            const fn = we.get(vt);
            (rn.unshift(fn), (tn = fn), (vt = ee(fn.x, fn.y)));
          }
          break;
        }
        const j = H.pt.x,
          st = H.pt.y,
          Et = fi.sort((vt, tn) => vt.coord - tn.coord),
          Gt = Et.findIndex((vt) => Math.abs(vt.coord - j) < 1),
          _t = li.sort((vt, tn) => vt.coord - tn.coord),
          zt = _t.findIndex((vt) => Math.abs(vt.coord - st) < 1),
          qt = [];
        (Gt > 0 && qt.push({ x: Et[Gt - 1].coord, y: st }),
          Gt >= 0 && Gt < Et.length - 1 && qt.push({ x: Et[Gt + 1].coord, y: st }),
          zt > 0 && qt.push({ x: j, y: _t[zt - 1].coord }),
          zt >= 0 && zt < _t.length - 1 && qt.push({ x: j, y: _t[zt + 1].coord }));
        for (const vt of qt) {
          const tn = Math.min(j, vt.x),
            fn = Math.max(j, vt.x),
            Vt = Math.min(st, vt.y),
            an = Math.max(st, vt.y);
          if (
            f.some((yn) =>
              yn.nodeId === T.start || yn.nodeId === T.end
                ? !1
                : tn !== fn
                  ? yn.minY < st && yn.maxY > st && yn.maxX > tn && yn.minX < fn
                  : yn.minX < j && yn.maxX > j && yn.maxY > Vt && yn.minY < an,
            )
          )
            continue;
          const Dt = ee(vt.x, vt.y),
            dn = Math.abs(vt.x - j) + Math.abs(vt.y - st),
            Ht = v(b, H.pt, vt);
          let Yt = 0;
          const hn = Y.x - U.x,
            Vn = Y.y - U.y,
            ie = vt.x - j,
            Pe = vt.y - st;
          (((Vn > 10 && Pe < -5) || (Vn < -10 && Pe > 5)) && (Yt = Math.abs(Pe) * 100),
            ((hn > 10 && ie < -5) || (hn < -10 && ie > 5)) && (Yt += Math.abs(ie) * 50));
          let ps = 0;
          const bs = (us = Re.get(H.key)) != null ? us : "n",
            Ms = Math.abs(ie) > It ? "h" : "v";
          bs !== "n" && bs !== Ms && (ps = 50);
          const yi = dn + Ht + Yt + ps,
            ce = ((hs = se.get(H.key)) != null ? hs : 1 / 0) + yi,
            Is = Math.abs(Y.x - vt.x) + Math.abs(Y.y - vt.y);
          if (ce < ((gs = se.get(Dt)) != null ? gs : 1 / 0))
            if ((we.set(Dt, H.pt), se.set(Dt, ce), Re.set(Dt, Ms), !re.has(Dt)))
              (kn.push({ key: Dt, f: ce + Is, pt: vt }), re.add(Dt));
            else {
              const yn = kn.findIndex((xi) => xi.key === Dt);
              yn !== -1 && (kn[yn].f = ce + Is);
            }
        }
      }
    if ((rn.length === 0 && (rn = [U, { x: U.x, y: Y.y }, Y]), rn.length > 4)) {
      const H = rn[0],
        j = rn[rn.length - 1];
      let st = Math.min(H.x, j.x),
        Et = Math.max(H.x, j.x),
        Gt = Math.min(H.y, j.y),
        _t = Math.max(H.y, j.y);
      for (const Vt of rn)
        ((st = Math.min(st, Vt.x)), (Et = Math.max(Et, Vt.x)), (Gt = Math.min(Gt, Vt.y)), (_t = Math.max(_t, Vt.y)));
      const zt = Et > Math.max(H.x, j.x),
        qt = st < Math.min(H.x, j.x);
      if (x) {
        const Vt = jn;
        if (zt) {
          const an = Math.max(H.x, j.x),
            Jt = Math.min(H.y, j.y),
            Dt = Math.max(H.y, j.y),
            dn = f.filter((Ht) => Ht.minX < an && Ht.maxX > an && Ht.minY < Dt && Ht.maxY > Jt);
          if (dn.length > 0) {
            let Ht = Math.max(H.x, j.x);
            for (const Yt of dn) {
              const hn = (Yt.minX + Yt.maxX) / 2;
              if (Yt.visualXHalfExtent === void 0 || isNaN(Yt.visualXHalfExtent)) continue;
              const Vn = hn + Yt.visualXHalfExtent + Vt;
              Ht = Math.max(Ht, Vn);
            }
            isNaN(Ht) || (Et = Ht);
          }
        }
        if (qt) {
          const an = f.filter(
            (Jt) => Jt.minX < Math.min(H.x, j.x) + Vt && Jt.minY < Math.max(H.y, j.y) && Jt.maxY > Math.min(H.y, j.y),
          );
          if (an.length > 0) {
            let Jt = Math.min(H.x, j.x);
            for (const Dt of an) {
              const Ht = (Dt.minX + Dt.maxX) / 2 - Dt.visualXHalfExtent - Vt;
              Jt = Math.min(Jt, Ht);
            }
            st = Jt;
          }
        }
      }
      const vt = c((Vt) => {
          const an = j.y > H.y,
            Jt = f.filter((Ht) => {
              const Yt = Math.min(H.x, j.x) < Ht.maxX && Math.max(H.x, j.x) > Ht.minX,
                hn = Math.min(H.y, j.y) < Ht.maxY && Math.max(H.y, j.y) > Ht.minY;
              return Yt && hn;
            });
          let Dt = Jt;
          if (x && Jt.length > 0) {
            const Ht = Jt.filter((Yt) => Yt.minX < Vt && Yt.maxX > Vt);
            Ht.length > 0 && (Dt = Ht);
          }
          if (Dt.length === 0) return j.y;
          const dn = Fn;
          if (an) {
            const Yt = Math.max(...Dt.map((hn) => hn.maxY)) + dn;
            if (Yt < j.y - It) return Yt;
          } else {
            const Yt = Math.min(...Dt.map((hn) => hn.minY)) - dn;
            if (Yt > j.y + It) return Yt;
          }
          return j.y;
        }, "findBestReturnY"),
        tn = c((Vt) => {
          const an = vt(Vt),
            Jt = { x: Vt, y: H.y },
            Dt = { x: Vt, y: an },
            dn = { x: j.x, y: an },
            Ht = Rn(H, Jt),
            Yt = Rn(Jt, Dt),
            hn = Rn(Dt, dn),
            Vn = an !== j.y ? Rn(dn, j) : !1;
          return !Ht && !Yt && !hn && !Vn ? (Math.abs(an - j.y) < It ? [H, Jt, Dt, j] : [H, Jt, Dt, dn, j]) : null;
        }, "trySimplifyWithDetourX"),
        fn = zt && !qt ? tn(Et) : qt && !zt ? tn(st) : null;
      fn && (rn = fn);
    }
    const cn = [P, ...xt, ...rn, ...$t.reverse(), X];
    if (cn.length >= 3) {
      const H = cn[cn.length - 1],
        j = cn[cn.length - 2],
        st = cn[cn.length - 3],
        Et = Math.abs(st.y - j.y) < It && Math.abs(j.y - H.y) < It,
        Gt = Math.abs(st.x - j.x) < It && Math.abs(j.x - H.x) < It;
      if (Et) {
        const _t = Math.sign(j.x - st.x),
          zt = Math.sign(H.x - st.x);
        _t !== 0 && _t === zt && Math.abs(j.x - st.x) > Math.abs(H.x - st.x) && cn.splice(-2, 1);
      } else if (Gt) {
        const _t = Math.sign(j.y - st.y),
          zt = Math.sign(H.y - st.y);
        _t !== 0 && _t === zt && Math.abs(j.y - st.y) > Math.abs(H.y - st.y) && cn.splice(-2, 1);
      }
    }
    const Cn = [cn[0]];
    for (let H = 1; H < cn.length - 1; H++) {
      if (H === 1) {
        Cn.push(cn[H]);
        continue;
      }
      const j = Cn[Cn.length - 1],
        st = cn[H],
        Et = cn[H + 1];
      if (Math.abs(j.y - st.y) < It && Math.abs(st.y - Et.y) < It) {
        const Gt = st.x > j.x,
          _t = Et.x > st.x;
        if (Gt !== _t) {
          Cn.push(st);
          continue;
        }
        continue;
      }
      if (Math.abs(j.x - st.x) < It && Math.abs(st.x - Et.x) < It) {
        const Gt = st.y > j.y,
          _t = Et.y > st.y;
        if (Gt !== _t) {
          Cn.push(st);
          continue;
        }
        continue;
      }
      Cn.push(st);
    }
    Cn.push(cn[cn.length - 1]);
    for (let H = 0; H < Cn.length - 1; H++) {
      const j = Cn[H],
        st = Cn[H + 1],
        Et = Math.abs(j.x - st.x) < It ? "vertical" : "horizontal",
        Gt = Et === "vertical" ? j.x : j.y,
        _t = Et === "vertical" ? Math.min(j.y, st.y) : Math.min(j.x, st.x),
        zt = Et === "vertical" ? Math.max(j.y, st.y) : Math.max(j.x, st.x),
        qt = g(Et, Gt, _t, zt),
        vt = { edgeIndex: b, segmentIndex: H, orientation: Et, pipe: qt, trackIndex: 0, from: _t, to: zt };
      (u.push(vt),
        h[b].push(u.length - 1),
        qt.tracks[0] || (qt.tracks[0] = { index: 0, coord: qt.coord, segments: [] }),
        qt.tracks[0].segments.push({ edgeIndex: b, segmentIndex: H, from: _t, to: zt }));
    }
  }
  const Xt = c((b, T) => b.from < T.to && T.from < b.to, "segmentsOverlap"),
    ft = c((b, T, B, w) => {
      const P = !w.segments.some((Q) => (Q.edgeIndex !== T.edgeIndex || Q.segmentIndex !== T.segmentIndex) && Xt(Q, b)),
        X = !B.segments.some((Q) => (Q.edgeIndex !== b.edgeIndex || Q.segmentIndex !== b.segmentIndex) && Xt(Q, T));
      return P && X
        ? ((b.trackIndex = w.index),
          (T.trackIndex = B.index),
          (B.segments = [
            ...B.segments.filter((Q) => Q.edgeIndex !== b.edgeIndex || Q.segmentIndex !== b.segmentIndex),
            { edgeIndex: T.edgeIndex, segmentIndex: T.segmentIndex, from: T.from, to: T.to },
          ]),
          (w.segments = [
            ...w.segments.filter((Q) => Q.edgeIndex !== T.edgeIndex || Q.segmentIndex !== T.segmentIndex),
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
      for (const w of B) {
        const P = u[w];
        P.pipe === b.pipe && K(P, T);
      }
    }, "moveSegmentChainToTrack"),
    G = c((b) => {
      const T = h[b.edgeIndex],
        B = T.indexOf(u.indexOf(b)),
        w = [];
      return (B > 0 && w.push(u[T[B - 1]]), B < T.length - 1 && w.push(u[T[B + 1]]), w);
    }, "getAdjacentSegmentsAlongEdge"),
    tt = c((b, T) => {
      if (b.orientation === T.orientation) return !1;
      const B = b.orientation === "horizontal" ? b : T,
        w = b.orientation === "horizontal" ? T : b;
      return w.pipe.coord > B.from && w.pipe.coord < B.to && B.pipe.coord > w.from && B.pipe.coord < w.to;
    }, "haveAnyCrossing"),
    nt = c((b, T) => {
      for (const B of b.tracks)
        if (!B.segments.some((P) => (P.edgeIndex !== T.edgeIndex || P.segmentIndex !== T.segmentIndex) && Xt(P, T)))
          return B.index;
      return -1;
    }, "findAvailableTrack"),
    et = c((b, T) => {
      if (b.trackIndex === T.trackIndex) return Xt(b, T);
      const B = G(b),
        w = G(T);
      return B.some((P) => w.some((X) => tt(P, X)));
    }, "segmentsConflict"),
    yt = c((b, T, B) => {
      if (ft(b, T, b.pipe.tracks[b.trackIndex], T.pipe.tracks[T.trackIndex])) return;
      const w = nt(b.pipe, T);
      B(T, w !== -1 ? w : W(b.pipe));
    }, "resolveTrackConflict"),
    Lt = c((b) => {
      let T = 0;
      for (let B = 0; B < b.length; B++)
        for (let w = B + 1; w < b.length; w++) {
          const P = b[B],
            X = b[w];
          P.pipe === X.pipe && et(P, X) && (T++, yt(P, X, V));
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
      const w = u[T[0]].pipe.coord;
      let P = w;
      for (let lt = 1; lt < T.length; lt++) {
        const U = u[T[lt]];
        if (U.orientation === "horizontal") {
          const Y = U.from,
            Ct = U.to;
          P = Math.abs(Y - w) > Math.abs(Ct - w) ? Y : Ct;
          break;
        }
      }
      const X = Math.abs(P - w),
        Q = { dest: P, deviation: X, base: w, delta: P - w };
      return (Ft.set(b, Q), Q);
    }, "getDestInfo"),
    on = c(() => {
      let b = 0;
      const T = new Map();
      for (const [w, P] of s.entries())
        h[w].length !== 0 && P.start && (T.has(P.start) || T.set(P.start, []), T.get(P.start).push(w));
      const B = c((w) => {
        var Y, Ct, pt, ut;
        const P = s[w];
        if (!P.start || !P.end) return 0;
        const X = r.get(P.start),
          Q = r.get(P.end);
        if (!X || !Q) return 0;
        const lt = ((Y = Q.x) != null ? Y : 0) - ((Ct = X.x) != null ? Ct : 0),
          U = ((pt = Q.y) != null ? pt : 0) - ((ut = X.y) != null ? ut : 0);
        return Math.abs(lt) + Math.abs(U);
      }, "getEdgeDistance");
      for (const w of T.values()) {
        w.sort((X, Q) => {
          const lt = Wt(X),
            U = Wt(Q);
          if (Math.abs(lt.deviation - U.deviation) > 1) return lt.deviation - U.deviation;
          if (Math.abs(lt.dest - U.dest) > 1) return lt.dest - U.dest;
          const Y = B(X),
            Ct = B(Q);
          if (Math.abs(Y - Ct) > 1) return Ct - Y;
          const pt = h[X].length,
            ut = h[Q].length;
          if (pt !== ut) return pt - ut;
          if (pt === 1) {
            const dt = h[X][0],
              xt = h[Q][0];
            if (u[dt] && u[xt]) {
              const At = u[dt],
                Nt = u[xt],
                $t = Math.abs(At.to - At.from),
                Qt = Math.abs(Nt.to - Nt.from);
              if (Math.abs($t - Qt) > 1) return $t - Qt;
            }
          }
          return 0;
        });
        const P = w.map((X) => u[h[X][0]]);
        b += Lt(P);
      }
      return b;
    }, "fixSourceHandleCrossings"),
    Mn = c(() => {
      let b = 0;
      const T = new Map();
      for (const [B, w] of s.entries())
        h[B].length !== 0 && w.end && (T.has(w.end) || T.set(w.end, []), T.get(w.end).push(B));
      for (const B of T.values()) {
        B.sort((P, X) => {
          const Q = c((Y) => {
              const Ct = h[Y];
              if (Ct.length < 2) return 0;
              const pt = u[Ct[Ct.length - 2]];
              return Math.abs(pt.to - pt.from);
            }, "getDist"),
            lt = Q(P),
            U = Q(X);
          return Math.abs(lt - U) > 0.1 ? lt - U : P - X;
        });
        const w = B.map((P) => u[h[P][h[P].length - 1]]);
        b += Lt(w);
      }
      return b;
    }, "fixTargetHandleCrossings"),
    Bn = c(() => {
      let b = 0;
      for (const T of l) {
        const B = [];
        for (const w of T.tracks)
          for (const P of w.segments) {
            const X = h[P.edgeIndex].find((Q) => u[Q].segmentIndex === P.segmentIndex);
            X !== void 0 && B.push(u[X]);
          }
        B.sort((w, P) => w.edgeIndex - P.edgeIndex || w.segmentIndex - P.segmentIndex);
        for (let w = 0; w < B.length; w++)
          for (let P = w + 1; P < B.length; P++) {
            const X = B[w],
              Q = B[P];
            et(X, Q) && (b++, yt(X, Q, K));
          }
      }
      return b;
    }, "fixPipeCrossings");
  let Hn = 0;
  const ne = 10;
  for (; Hn < ne;) {
    let b = 0;
    if (((b += on()), (b += Mn()), (b += Bn()), b === 0)) break;
    Hn++;
  }
  const Jn = new Map();
  for (const b of l) {
    const T = [];
    (b.tracks.forEach((w) => {
      w.segments.forEach((P) => {
        T.push({ edgeIndex: P.edgeIndex, segmentIndex: P.segmentIndex, trackIndex: w.index, from: P.from, to: P.to });
      });
    }),
      T.sort((w, P) => w.from - P.from));
    const B = [];
    if (T.length > 0) {
      let w = [T[0]],
        P = T[0].to;
      for (let X = 1; X < T.length; X++) {
        const Q = T[X];
        Q.from < P ? (w.push(Q), (P = Math.max(P, Q.to))) : (B.push(w), (w = [Q]), (P = Q.to));
      }
      B.push(w);
    }
    for (const w of B) {
      const P = new Set();
      w.forEach((dt) => P.add(dt.trackIndex));
      const X = new Map();
      w.forEach((dt) => {
        var At;
        const xt = Wt(dt.edgeIndex);
        X.set(dt.trackIndex, ((At = X.get(dt.trackIndex)) != null ? At : 0) + xt.delta);
      });
      const Q = [...P].filter((dt) => {
          var xt;
          return ((xt = X.get(dt)) != null ? xt : 0) < -1;
        }),
        lt = [...P].filter((dt) => {
          var xt;
          return ((xt = X.get(dt)) != null ? xt : 0) > 1;
        }),
        U = [...P].filter((dt) => {
          var xt;
          return Math.abs((xt = X.get(dt)) != null ? xt : 0) <= 1;
        });
      (Q.sort((dt, xt) => {
        var At, Nt;
        return ((At = X.get(xt)) != null ? At : 0) - ((Nt = X.get(dt)) != null ? Nt : 0);
      }),
        lt.sort((dt, xt) => {
          var At, Nt;
          return ((At = X.get(dt)) != null ? At : 0) - ((Nt = X.get(xt)) != null ? Nt : 0);
        }));
      const Y = c((dt, xt) => {
        w.filter((At) => At.trackIndex === dt).forEach((At) => {
          const Nt = p.has(At.edgeIndex) ? b.coord : xt;
          Jn.set(`${At.edgeIndex}-${At.segmentIndex}`, Nt);
        });
      }, "assignCoord");
      let Ct = 0;
      for (const dt of Q) (Ct++, Y(dt, b.coord - Ct * _e));
      if (U.length === 0 && P.size > 0) {
        const dt = [...P].sort((Nt, $t) => {
            var Qt, Gn;
            return Math.abs((Qt = X.get(Nt)) != null ? Qt : 0) - Math.abs((Gn = X.get($t)) != null ? Gn : 0);
          })[0],
          xt = Q.indexOf(dt);
        xt !== -1 && Q.splice(xt, 1);
        const At = lt.indexOf(dt);
        (At !== -1 && lt.splice(At, 1), U.push(dt));
      }
      let pt = 0;
      for (const dt of U) {
        if (pt === 0) Y(dt, b.coord);
        else {
          const xt = pt % 2 === 1 ? 1 : -1,
            At = Math.ceil(pt / 2);
          Y(dt, b.coord + xt * At * _e * 0.5);
        }
        pt++;
      }
      let ut = 0;
      for (const dt of lt) (ut++, Y(dt, b.coord + ut * _e));
    }
  }
  for (const [b, T] of s.entries()) {
    const B = (ms = h[b]) != null ? ms : [];
    if (B.length === 0) continue;
    const w = [],
      P = r.get(T.start),
      X = r.get(T.end),
      { pSrcPort: Q, pDstPort: lt } = kt(b, P, X),
      U = B.map((pt) => {
        var xt;
        const ut = u[pt],
          dt = (xt = Jn.get(`${ut.edgeIndex}-${ut.segmentIndex}`)) != null ? xt : ut.pipe.coord;
        return { orient: ut.orientation, coord: dt, from: ut.from, to: ut.to };
      });
    w.push(Q);
    for (let pt = 0; pt < U.length; pt++) {
      const ut = U[pt],
        dt = w[w.length - 1],
        xt = ut.orient === "vertical" ? dt.y : dt.x,
        At = ut.orient === "vertical" ? dt.x : dt.y,
        Nt = U[pt + 1],
        $t = pt < U.length - 1;
      if ((Math.abs(At - ut.coord) > It && w.push(_n(ut, xt)), $t && Nt.orient === ut.orient))
        if (Math.abs(ut.coord - Nt.coord) > It) {
          const Qt = ut.orient === "vertical" ? (xt + Nt.from) / 2 : po(ut, Nt);
          w.push(_n(ut, Qt), _n(Nt, Qt));
        } else (pt === 0 || pt === U.length - 2) && w.push(_n(ut, po(ut, Nt)));
      else if ($t) w.push(_n(ut, Nt.coord));
      else {
        const Qt = Math.abs(ut.from - xt) < Math.abs(ut.to - xt) ? ut.to : ut.from;
        w.push(_n(ut, Qt));
      }
    }
    const Y = w[w.length - 1];
    (Math.abs(Y.x - lt.x) > It || Math.abs(Y.y - lt.y) > It) && w.push(lt);
    const Ct = [];
    w.length > 0 && Ct.push(w[0]);
    for (let pt = 1; pt < w.length; pt++) {
      const ut = w[pt],
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
    var At, Nt, $t, Qt;
    const B = (At = T.x) != null ? At : 0,
      w = (Nt = T.y) != null ? Nt : 0,
      P = ($t = T.width) != null ? $t : 0,
      X = (Qt = T.height) != null ? Qt : 0;
    if (P <= 0 || X <= 0) return b;
    const Q = B - P / 2,
      lt = B + P / 2,
      U = w - X / 2,
      Y = w + X / 2;
    if (b.x < Q || b.x > lt || b.y < U || b.y > Y) return b;
    const Ct = b.x - Q,
      pt = lt - b.x,
      ut = b.y - U,
      dt = Y - b.y,
      xt = Math.min(Ct, pt, ut, dt);
    return xt === Ct
      ? { x: Q, y: b.y }
      : xt === pt
        ? { x: lt, y: b.y }
        : xt === ut
          ? { x: b.x, y: U }
          : { x: b.x, y: Y };
  }, "nodeBoundaryClamp");
  for (const b of t.edges) {
    const T = b.points;
    if (!T || T.length < 2) continue;
    const B = b.start,
      w = b.end,
      P = B ? r.get(B) : void 0,
      X = w ? r.get(w) : void 0;
    (P && (T[0] = N(T[0], P)), X && (T[T.length - 1] = N(T[T.length - 1], X)));
  }
  return t;
}
c(si, "routeEdgesOrthogonal");
function ri(t) {
  var n;
  return (n = t.direction) != null ? n : "TB";
}
c(ri, "getSwimlaneDirection");
function ii(t) {
  var f, g, M, i, u, h, p, I, v, A, C, a;
  const n = Gs(t),
    e = (g = (f = t.config.flowchart) == null ? void 0 : f.nodeSpacing) != null ? g : 40,
    o = (i = (M = t.config.flowchart) == null ? void 0 : M.rankSpacing) != null ? i : 100,
    s = (h = (u = t.config.swimlane) == null ? void 0 : u.ignoreCrossLaneEdges) != null ? h : !0,
    r = (I = (p = t.config.swimlane) == null ? void 0 : p.optimizeRanksByCrossings) != null ? I : !0,
    d = (A = (v = t.config.swimlane) == null ? void 0 : v.automaticLaneOrdering) != null ? A : !1,
    l = ri(t),
    { ordered: x, coordinates: y } = oi(n, {
      nodeGap: e,
      layerGap: o,
      ignoreCrossLaneEdges: s,
      optimizeRanksByCrossings: r,
      automaticLaneOrdering: d,
      direction: l,
    });
  $s(n, x, y, { nodeGap: e, layerGap: o });
  for (const m of (C = t.edges) != null ? C : []) delete m.points;
  si(t, l);
  for (const m of (a = t.edges) != null ? a : []) (!m.curve || m.curve === "basis") && (m.curve = "rounded");
  return (Ir(t, l), Mr(t), l);
}
c(ii, "runSwimlaneLayoutCore");
function ci(t) {
  Ys(t);
  const n = zs(t);
  ((t.nodes = n.nodes), (t.edges = n.edges));
}
c(ci, "prepareSwimlaneLayout");
var Oi = pi({ prepareLayout: ci, runLayoutCore: ii, afterPaint: Hs });
export { Oi as render };
