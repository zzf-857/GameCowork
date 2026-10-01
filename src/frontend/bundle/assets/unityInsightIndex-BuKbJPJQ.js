import { b4 as ne, n as P, b5 as T } from "./VscTheme-BExNMG_K.js";
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
      r = new e.Error().stack;
    r &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[r] = "92ccfa0a-0832-45ab-bf05-6c0304a4d14c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-92ccfa0a-0832-45ab-bf05-6c0304a4d14c"));
  })();
} catch {}
function h(e, r) {
  if (e[r] !== void 0) return r;
  const n = P(r);
  for (const t of Object.keys(e)) if (P(t) === n) return t;
}
function re(e) {
  var t, i, s, u, o, d, a;
  const r = [],
    n = new Set();
  for (const g of (i = (t = e.hub) == null ? void 0 : t.workspaces) != null ? i : []) {
    if (g.isRemote || g.isHomeWorkspace) continue;
    const y = (s = g.workspaceDir) == null ? void 0 : s.trim();
    if (
      !y ||
      (((a =
        (d = (o = (u = e.unity) == null ? void 0 : u.workspaces) == null ? void 0 : o[g.workspaceKey]) == null
          ? void 0
          : d.projectInfo) == null
        ? void 0
        : a.isUnityProject) !== !0 &&
        g.isUnityProject !== !0)
    )
      continue;
    const c = P(y);
    n.has(c) || (n.add(c), r.push(y));
  }
  return r;
}
function $(e, r) {
  const n = [],
    t = new Set(),
    i = (s) => {
      const u = s.trim();
      if (!u) return;
      const o = P(u);
      t.has(o) || (t.add(o), n.push(u));
    };
  i(r);
  for (const s of re(e)) i(s);
  return n;
}
const De = 1e3,
  me = 5e3,
  j = 15e3,
  te = 15 * 6e4,
  G = 6e4,
  ie = 30 * 6e4,
  se = 1e4,
  B = 2e3,
  K = 12e4,
  ue = 8,
  oe = {
    statusByPath: {},
    enabledByPath: {},
    forceRebuildByPath: {},
    statusFailCountByPath: {},
    forceRebuildGenerationByPath: {},
  };
function D(e) {
  return e != null && (e.indexing || e.indexStatus === "building");
}
function m(e) {
  const r = e == null ? void 0 : e.trim();
  return r === "sync" || r === "reconcile";
}
function ve(e) {
  return e == null ? !1 : e.indexSyncing === !0 || m(e.progressPhase);
}
function V(e) {
  return (e == null ? void 0 : e.trim()) === "waiting";
}
function le(e, r) {
  return r.indexStatus !== "building" || m(r.progressPhase) || V(r.progressPhase)
    ? !1
    : e.observeOnly
      ? !0
      : !!e.ensureTriggered;
}
function H(e) {
  return !(!D(e) || m(e.progressPhase));
}
function Te(e, r) {
  return e.seenBuilding || e.deferred || e.ensureTriggered || (r != null && D(r))
    ? !0
    : e.observeOnly
      ? !1
      : !!e.ensureInFlight;
}
function de(e) {
  for (const r of Object.values(e)) if (!r.observeOnly) return !0;
  return !1;
}
function O(e) {
  let r,
    n = Number.POSITIVE_INFINITY;
  for (const [t, i] of Object.entries(e))
    i.observeOnly || i.ensureTriggered || i.seenBuilding || (i.createdAt < n && ((n = i.createdAt), (r = t)));
  return r;
}
function ae(e) {
  return e.observeOnly ? e.seenBuilding || e.deferred : !1;
}
function ce(e, r) {
  const n = h(e, r);
  if (n == null) return !1;
  const t = e[n];
  if (t.observeOnly || t.ensureTriggered || t.seenBuilding || O(e) !== n) return !1;
  for (const [i, s] of Object.entries(e))
    if (i !== n) {
      if (ae(s)) return !1;
      if (!s.observeOnly && (s.ensureInFlight || s.ensureTriggered || s.seenBuilding)) return !1;
    }
  return !0;
}
function _(e, r) {
  const n = h(e, r);
  if (n == null) return !1;
  const t = e[n];
  if (t.observeOnly || t.ensureTriggered || t.seenBuilding) return !1;
  for (const [s, u] of Object.entries(e))
    if (s !== n && !u.observeOnly && (u.ensureInFlight || u.ensureTriggered || u.seenBuilding)) return !0;
  const i = O(e);
  return i != null && i !== n;
}
function fe(e, r) {
  const n = h(e, r);
  if (n == null) return !1;
  const t = e[n];
  if (t.observeOnly || t.ensureTriggered || t.seenBuilding || O(e) !== n || _(e, r)) return !1;
  for (const [i, s] of Object.entries(e)) if (i !== n && s.observeOnly) return !0;
  return !1;
}
function ge(e) {
  let r,
    n = -1,
    t = Number.POSITIVE_INFINITY;
  for (const [i, s] of Object.entries(e)) {
    let u = -1;
    (s.ensureInFlight
      ? (u = 3)
      : s.seenBuilding || (s.ensureTriggered && !s.observeOnly) || (s.observeOnly && !s.deferred)
        ? (u = 2)
        : ((s.observeOnly && s.deferred) || (!s.observeOnly && s.deferred && !s.ensureTriggered && !s.seenBuilding)) &&
          (u = 1),
      !(u < 0) && (u > n || (u === n && s.createdAt < t)) && ((n = u), (t = s.createdAt), (r = i)));
  }
  return r;
}
function I(e, r) {
  var n;
  return (n = h(e.forceRebuildByPath, r)) != null ? n : r;
}
function R(e, r, n) {
  const t = I(e, r),
    i = e.forceRebuildByPath[t];
  if (!(!i || i.generation !== n)) return i;
}
function E(e, r) {
  const n = I(e, r);
  (delete e.forceRebuildByPath[n], delete e.statusFailCountByPath[n]);
}
function w(e, r, n) {
  var i, s;
  const t = (s = (i = h(e.forceRebuildByPath, r)) != null ? i : h(e.statusByPath, r)) != null ? s : r;
  ((e.statusByPath[t] = n), !D(n) && e.forceRebuildByPath[t] == null && delete e.statusFailCountByPath[t]);
}
function W(e, r, n) {
  if (!r || !n || r === n) return !1;
  const t = e.forceRebuildByPath[r];
  return t == null || e.forceRebuildByPath[n] != null
    ? !1
    : ((e.forceRebuildByPath[n] = t),
      delete e.forceRebuildByPath[r],
      e.statusByPath[r] !== void 0 && ((e.statusByPath[n] = e.statusByPath[r]), delete e.statusByPath[r]),
      e.statusFailCountByPath[r] !== void 0 &&
        ((e.statusFailCountByPath[n] = e.statusFailCountByPath[r]), delete e.statusFailCountByPath[r]),
      e.forceRebuildGenerationByPath[r] !== void 0 &&
        ((e.forceRebuildGenerationByPath[n] = e.forceRebuildGenerationByPath[r]),
        delete e.forceRebuildGenerationByPath[r]),
      e.enabledByPath[r] !== void 0 && e.enabledByPath[n] === void 0 && (e.enabledByPath[n] = e.enabledByPath[r]),
      !0);
}
const Y = ne({
    name: "unityInsightIndex",
    initialState: oe,
    reducers: {
      setInsightIndexEnabled(e, r) {
        const { path: n, enabled: t } = r.payload;
        e.enabledByPath[n] !== t && (e.enabledByPath[n] = t);
      },
      requestInsightIndexDiscover(e) {},
      setInsightIndexDiscoverActive(e, r) {},
      beginInsightIndexForceRebuild(e, r) {
        var d, a, g;
        const { path: n, now: t } = r.payload,
          i = h(e.forceRebuildByPath, n);
        if (i != null) {
          if (e.forceRebuildByPath[i].observeOnly) return;
          if (i !== n) {
            W(e, i, n);
            return;
          }
          return;
        }
        const s = ((d = e.forceRebuildGenerationByPath[n]) != null ? d : 0) + 1;
        ((e.forceRebuildGenerationByPath[n] = s),
          (e.forceRebuildByPath[n] = {
            deferred: !1,
            seenBuilding: !1,
            ensureTriggered: !1,
            observeOnly: !1,
            baselineIndexedAt: void 0,
            createdAt: t,
            generation: s,
            startedAt: void 0,
            nextRetryAt: t + B,
            ensureInFlight: !1,
            ensureEpoch: 0,
            ensureStartedAt: void 0,
          }),
          delete e.statusFailCountByPath[n]);
        const u = (a = h(e.statusByPath, n)) != null ? a : n,
          o = e.statusByPath[u];
        (u !== n && (delete e.statusByPath[u], delete e.statusFailCountByPath[u]),
          w(e, n, {
            indexStatus: "building",
            percent: 0,
            indexing: !0,
            error: null,
            indexedAt: (g = o == null ? void 0 : o.indexedAt) != null ? g : null,
            progressPhase: null,
            progressDetail: null,
          }));
      },
      rekeyInsightIndexPath(e, r) {
        const { from: n, to: t } = r.payload;
        W(e, n, t);
      },
      observeInsightIndexExternalBuild(e, r) {
        var a, g, y;
        const { path: n, now: t, progressPhase: i, awaitStatusBuilding: s } = r.payload;
        if (h(e.forceRebuildByPath, n) != null) return;
        const u = V(i),
          o = ((a = e.forceRebuildGenerationByPath[n]) != null ? a : 0) + 1;
        e.forceRebuildGenerationByPath[n] = o;
        const d = h(e.statusByPath, n);
        ((e.forceRebuildByPath[n] = {
          deferred: u,
          seenBuilding: s === !0 ? !1 : !u,
          ensureTriggered: !1,
          observeOnly: !0,
          baselineIndexedAt:
            (y = d != null ? ((g = e.statusByPath[d]) == null ? void 0 : g.indexedAt) : void 0) != null ? y : null,
          createdAt: t,
          generation: o,
          startedAt: t,
          nextRetryAt: t + B,
          ensureInFlight: !1,
          ensureEpoch: 0,
          ensureStartedAt: void 0,
        }),
          delete e.statusFailCountByPath[n]);
      },
      acknowledgeInsightIndexForceRebuild(e, r) {
        var c, l, b, A, L, U;
        const { deferred: n, triggered: t, generation: i, now: s, ensureEpoch: u, busyReason: o } = r.payload,
          d = I(e, r.payload.path),
          a = R(e, d, i);
        if (!a || (a.ensureInFlight && (u == null || a.ensureEpoch !== u))) return;
        const g = t || a.ensureTriggered,
          y = g
            ? a.baselineIndexedAt !== void 0
              ? a.baselineIndexedAt
              : (l = (c = e.statusByPath[d]) == null ? void 0 : c.indexedAt) != null
                ? l
                : null
            : a.baselineIndexedAt;
        ((e.forceRebuildByPath[d] = {
          deferred: n,
          seenBuilding: a.seenBuilding,
          ensureTriggered: g,
          observeOnly: a.observeOnly,
          baselineIndexedAt: y,
          createdAt: a.createdAt,
          generation: a.generation,
          startedAt: s,
          nextRetryAt: s + B,
          ensureInFlight: !1,
          ensureEpoch: a.ensureEpoch,
          ensureStartedAt: void 0,
          busyReason: n ? (o != null ? o : a.busyReason) : void 0,
        }),
          delete e.statusFailCountByPath[d]);
        const f = e.statusByPath[d];
        w(e, d, {
          indexStatus: "building",
          percent: a.seenBuilding && (b = f == null ? void 0 : f.percent) != null ? b : 0,
          indexing: !0,
          error: null,
          indexedAt: (A = f == null ? void 0 : f.indexedAt) != null ? A : null,
          progressPhase: a.seenBuilding && (L = f == null ? void 0 : f.progressPhase) != null ? L : null,
          progressDetail: a.seenBuilding && (U = f == null ? void 0 : f.progressDetail) != null ? U : null,
        });
      },
      clearInsightIndexForceRebuild(e, r) {
        const { generation: n } = r.payload,
          t = I(e, r.payload.path);
        if (n != null) {
          if (!R(e, t, n)) return;
        } else if (e.forceRebuildByPath[t] == null) return;
        E(e, t);
      },
      releaseInsightIndexForceRebuildEnsure(e, r) {
        const { generation: n, now: t, ensureEpoch: i } = r.payload,
          s = I(e, r.payload.path),
          u = R(e, s, n);
        !u ||
          !u.ensureInFlight ||
          (i != null && u.ensureEpoch !== i) ||
          ((u.ensureInFlight = !1), (u.ensureStartedAt = void 0), (u.nextRetryAt = t));
      },
      upsertInsightIndexStatus(e, r) {
        const { snap: n, generation: t } = r.payload,
          i = I(e, r.payload.path);
        if (t != null) {
          const s = e.forceRebuildByPath[i];
          if (s && s.generation !== t) return;
        }
        (w(e, i, n),
          !D(n) &&
            n.indexStatus !== "building" &&
            (n.indexStatus === "ready" || n.indexStatus === "error" || n.indexStatus === "idle") &&
            (t != null ? R(e, i, t) && E(e, i) : E(e, i)));
      },
      applyInsightIndexStatus(e, r) {
        const { snap: n, latchForceBuilding: t } = r.payload,
          i = I(e, r.payload.path);
        (delete e.statusFailCountByPath[i], (e.statusByPath[i] = n));
        const s = e.forceRebuildByPath[i];
        s && t && le(s, n) && ((s.seenBuilding = !0), (s.deferred = !1));
      },
      settleInsightIndexPath(e, r) {
        const n = I(e, r.payload.path),
          { snap: t } = r.payload;
        (E(e, n), w(e, n, t));
      },
      incrementInsightIndexStatusFail(e, r) {
        var t;
        const n = I(e, r.payload.path);
        e.statusFailCountByPath[n] = ((t = e.statusFailCountByPath[n]) != null ? t : 0) + 1;
      },
      setForceRebuildEnsureInFlight(e, r) {
        const { generation: n, ensureInFlight: t, nextRetryAt: i, ensureEpoch: s, now: u } = r.payload,
          o = I(e, r.payload.path),
          d = R(e, o, n);
        if (d) {
          if (t) {
            if (d.ensureInFlight) return;
            ((d.ensureEpoch += 1), (d.ensureInFlight = !0), (d.ensureStartedAt = u != null ? u : Date.now()));
          } else {
            if (s != null && d.ensureEpoch !== s) return;
            ((d.ensureInFlight = !1), (d.ensureStartedAt = void 0));
          }
          i != null && (d.nextRetryAt = i);
        }
      },
      markForceRebuildEnsureTriggered(e, r) {
        var o, d, a, g, y, f;
        const { generation: n, now: t } = r.payload,
          i = I(e, r.payload.path),
          s = R(e, i, n);
        if (!s) return;
        ((s.ensureTriggered = !0),
          s.baselineIndexedAt === void 0 &&
            (s.baselineIndexedAt = (d = (o = e.statusByPath[i]) == null ? void 0 : o.indexedAt) != null ? d : null),
          (s.deferred = !1),
          (s.busyReason = void 0),
          (s.startedAt = t));
        const u = e.statusByPath[i];
        w(e, i, {
          indexStatus: "building",
          percent: s.seenBuilding && (a = u == null ? void 0 : u.percent) != null ? a : 0,
          indexing: !0,
          error: null,
          indexedAt: (g = u == null ? void 0 : u.indexedAt) != null ? g : null,
          progressPhase: s.seenBuilding && (y = u == null ? void 0 : u.progressPhase) != null ? y : null,
          progressDetail: s.seenBuilding && (f = u == null ? void 0 : u.progressDetail) != null ? f : null,
        });
      },
      setForceRebuildDeferred(e, r) {
        const { generation: n, now: t, refreshStartedAt: i, busyReason: s } = r.payload,
          u = I(e, r.payload.path),
          o = R(e, u, n);
        o && ((o.deferred = !0), s != null && (o.busyReason = s), (i || o.startedAt == null) && (o.startedAt = t));
      },
    },
  }),
  {
    setInsightIndexEnabled: Oe,
    requestInsightIndexDiscover: ye,
    setInsightIndexDiscoverActive: _e,
    beginInsightIndexForceRebuild: he,
    rekeyInsightIndexPath: Me,
    observeInsightIndexExternalBuild: z,
    acknowledgeInsightIndexForceRebuild: Ie,
    clearInsightIndexForceRebuild: xe,
    releaseInsightIndexForceRebuildEnsure: be,
    upsertInsightIndexStatus: Be,
    applyInsightIndexStatus: M,
    settleInsightIndexPath: x,
    incrementInsightIndexStatusFail: Pe,
    setForceRebuildEnsureInFlight: S,
    markForceRebuildEnsureTriggered: J,
    setForceRebuildDeferred: F,
  } = Y.actions,
  Ce = Y.reducer,
  Ne = (e) => e.unityInsightIndex;
function X(e, r) {
  const n = h(e.statusByPath, r);
  return n != null ? e.statusByPath[n] : void 0;
}
function p(e, r) {
  const n = h(e.forceRebuildByPath, r);
  return n != null ? e.forceRebuildByPath[n] : void 0;
}
const Le = (e, r) => X(e.unityInsightIndex, r),
  Ue = (e, r) => {
    const n = h(e.unityInsightIndex.enabledByPath, r);
    return n != null ? e.unityInsightIndex.enabledByPath[n] : void 0;
  },
  je = (e, r) => {
    const n = p(e.unityInsightIndex, r);
    if (n)
      return {
        deferred: n.deferred,
        seenBuilding: n.seenBuilding,
        startedAt: n.startedAt,
        observeOnly: n.observeOnly,
        ensureTriggered: n.ensureTriggered,
        ensureInFlight: n.ensureInFlight,
      };
  },
  Ge = (e) => Object.keys(e.unityInsightIndex.forceRebuildByPath);
function k(e, r, n) {
  const t = p(e.unityInsightIndex, r);
  return t != null && t.generation === n;
}
async function C(e, r, n) {
  const t = new AbortController(),
    i = n == null ? void 0 : n.timeoutMs,
    s = typeof i == "number" ? window.setTimeout(() => t.abort(), i) : void 0;
  try {
    const u = await fetch(e, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(n == null ? void 0 : n.headers) },
      body: JSON.stringify(r),
      signal: t.signal,
    });
    let o = null;
    try {
      o = await u.json();
    } catch {
      o = null;
    }
    return { response: u, data: o };
  } finally {
    s != null && window.clearTimeout(s);
  }
}
function Re(e, r) {
  const n = e.trim();
  if (!n) return null;
  for (const i of r) if (i === n) return i;
  const t = P(n);
  for (const i of r) if (P(i) === t) return i;
  return null;
}
function Ae(e) {
  var a;
  const r = ((a = e == null ? void 0 : e.status) != null ? a : "unknown").toLowerCase();
  let n = "unknown";
  (e != null && e.indexBuilding) || r === "building"
    ? (n = "building")
    : r === "error"
      ? (n = "error")
      : (e != null && e.indexReady) || r === "ready"
        ? (n = "ready")
        : (r === "disabled" || r === "idle") && (n = "idle");
  const t =
      typeof (e == null ? void 0 : e.percent) == "number"
        ? Math.min(Math.max(e.percent, 0), 100)
        : n === "ready"
          ? 100
          : 0,
    i = typeof (e == null ? void 0 : e.error) == "string" && e.error.trim() ? e.error.trim() : null,
    s = typeof (e == null ? void 0 : e.indexedAt) == "string" && e.indexedAt.trim() ? e.indexedAt.trim() : null,
    u =
      typeof (e == null ? void 0 : e.progressPhase) == "string" && e.progressPhase.trim()
        ? e.progressPhase.trim()
        : null,
    o =
      typeof (e == null ? void 0 : e.progressDetail) == "string" && e.progressDetail.trim()
        ? e.progressDetail.trim()
        : null;
  if ((e == null ? void 0 : e.indexSyncing) === !0 || m(u)) {
    const g = (e == null ? void 0 : e.indexReady) === !0 || r === "ready";
    return {
      indexStatus: g ? "ready" : "idle",
      percent: g
        ? typeof (e == null ? void 0 : e.percent) == "number"
          ? Math.min(Math.max(e.percent, 0), 100)
          : 100
        : 0,
      indexing: !1,
      indexSyncing: !0,
      error: null,
      indexedAt: s,
      progressPhase: u != null ? u : "sync",
      progressDetail: o,
    };
  }
  return {
    indexStatus: n,
    percent: t,
    indexing: n === "building",
    indexSyncing: !1,
    error: i,
    indexedAt: s,
    progressPhase: n === "building" ? u : null,
    progressDetail: n === "building" ? o : null,
  };
}
async function N(e, r) {
  var s;
  const { response: n, data: t } = await C(
      `${window.location.origin}/api/tauri/unity-insight/index-status`,
      { workspaceDir: e },
      { timeoutMs: r == null ? void 0 : r.timeoutMs },
    ),
    i = t;
  if (!n.ok)
    throw new Error(
      ((s = i == null ? void 0 : i.error) == null ? void 0 : s.trim()) ||
        `unity-insight/index-status failed with status ${n.status}`,
    );
  if (i && typeof i == "object" && i.ok === !1 && i.error) throw new Error(String(i.error));
  return Ae(i);
}
function Q(e, r) {
  return (n, t) => {
    var s, u;
    const i = (s = h(t().unityInsightIndex.forceRebuildByPath, e)) != null ? s : e;
    return (
      n(M({ path: i, snap: r, latchForceBuilding: !0 })),
      H(r) &&
        h(t().unityInsightIndex.forceRebuildByPath, e) == null &&
        n(z({ path: i, now: Date.now(), progressPhase: r.progressPhase })),
      n(ee()),
      (u = t().unityInsightIndex.statusByPath[i]) != null ? u : r
    );
  };
}
function v(e) {
  return (r, n) => {
    var s, u;
    const t = e != null && e.trim() ? P(e.trim()) : null,
      i = n().unityInsightIndex.forceRebuildByPath;
    for (const o of Object.keys(i)) {
      const d = n().unityInsightIndex.forceRebuildByPath[o];
      if (!(d != null && d.observeOnly) || d.deferred || d.seenBuilding || (t != null && P(o) === t)) continue;
      const a = n().unityInsightIndex.statusByPath[o];
      let g = "idle",
        y = 0,
        f = null;
      ((a == null ? void 0 : a.indexStatus) === "ready"
        ? ((g = "ready"), (y = (s = a.percent) != null ? s : 100))
        : (a == null ? void 0 : a.indexStatus) === "error"
          ? ((g = "error"), (f = a.error))
          : a != null && a.indexedAt && ((g = "ready"), (y = 100)),
        r(
          x({
            path: o,
            snap: {
              indexStatus: g,
              percent: y,
              indexing: !1,
              error: f,
              indexedAt: (u = a == null ? void 0 : a.indexedAt) != null ? u : null,
              progressPhase: null,
              progressDetail: null,
            },
          }),
        ));
    }
  };
}
async function Z(e, r, n) {
  var u;
  const { response: t, data: i } = await C(
      `${window.location.origin}/api/tauri/unity-insight/ensure-index`,
      { workspaceDir: e, ...(n ? { force: !0 } : {}), workspaceDirs: r },
      { timeoutMs: K },
    ),
    s = i;
  if (!t.ok)
    throw new Error(
      ((u = s == null ? void 0 : s.error) == null ? void 0 : u.trim()) ||
        `unity-insight/ensure-index failed with status ${t.status}`,
    );
  return s != null ? s : {};
}
async function we(e, r) {
  return Z(e, r, !0);
}
function We(e) {
  return (r, n) => {
    const t = p(n().unityInsightIndex, e);
    r(he({ path: e, now: Date.now() }));
    const i = p(n().unityInsightIndex, e);
    return !i || i.observeOnly || (t && !t.observeOnly) ? null : i.generation;
  };
}
function qe(e, r) {
  return (n, t) => {
    var u;
    const i = (u = h(t().unityInsightIndex.forceRebuildByPath, e)) != null ? u : e,
      s = t().unityInsightIndex.forceRebuildByPath[i];
    return !s ||
      s.generation !== r.generation ||
      (s.ensureInFlight && (r.ensureEpoch == null || s.ensureEpoch !== r.ensureEpoch))
      ? !1
      : (n(
          Ie({
            path: i,
            deferred: r.deferred,
            triggered: r.triggered,
            generation: r.generation,
            ensureEpoch: r.ensureEpoch,
            busyReason: r.busyReason,
            now: Date.now(),
          }),
        ),
        !0);
  };
}
function $e(e, r) {
  return (n, t) => {
    var s;
    const i = (s = h(t().unityInsightIndex.forceRebuildByPath, e)) != null ? s : e;
    if (r != null) {
      if (!k(t(), i, r)) return !1;
    } else if (t().unityInsightIndex.forceRebuildByPath[i] == null) return !1;
    return (n(xe({ path: i, generation: r })), !0);
  };
}
function Ke(e, r, n) {
  return (t, i) => {
    var o;
    const s = (o = h(i().unityInsightIndex.forceRebuildByPath, e)) != null ? o : e,
      u = i().unityInsightIndex.forceRebuildByPath[s];
    !u || u.generation !== r || !u.ensureInFlight || t(be({ path: s, generation: r, now: Date.now(), ensureEpoch: n }));
  };
}
function Ve(e, r) {
  return (n, t) => {
    var o;
    const i = (o = h(t().unityInsightIndex.forceRebuildByPath, e)) != null ? o : e,
      s = t().unityInsightIndex.forceRebuildByPath[i];
    if (!s || s.generation !== r.generation) return !1;
    const u = Date.now();
    return (
      n(F({ path: i, generation: r.generation, now: u, refreshStartedAt: r.refreshStartedAt })),
      n(S({ path: i, generation: r.generation, ensureInFlight: !1, nextRetryAt: u + B, now: u })),
      !0
    );
  };
}
function q(e, r) {
  return (n, t) => {
    var d;
    const i = (d = h(t().unityInsightIndex.forceRebuildByPath, e)) != null ? d : e;
    if (!r.ensureInFlight)
      return (
        n(
          S({
            path: i,
            generation: r.generation,
            ensureInFlight: !1,
            nextRetryAt: r.nextRetryAt,
            ensureEpoch: r.ensureEpoch,
            now: Date.now(),
          }),
        ),
        null
      );
    const s = t().unityInsightIndex.forceRebuildByPath[i];
    if (!s || s.generation !== r.generation || s.ensureInFlight) return null;
    const u = s.ensureEpoch;
    n(S({ path: i, generation: r.generation, ensureInFlight: !0, nextRetryAt: r.nextRetryAt, now: Date.now() }));
    const o = t().unityInsightIndex.forceRebuildByPath[i];
    return !o || o.generation !== r.generation || !o.ensureInFlight || o.ensureEpoch === u ? null : o.ensureEpoch;
  };
}
function He(e, r, n) {
  return (t, i) => {
    var u;
    const s = (u = h(i().unityInsightIndex.forceRebuildByPath, e)) != null ? u : e;
    if (n != null) {
      const o = i().unityInsightIndex.forceRebuildByPath[s];
      if (o && o.generation !== n) return !1;
    }
    return (t(Be({ path: s, snap: r, generation: n })), !0);
  };
}
function Fe(e) {
  return async (r, n) => {
    var d, a, g;
    const t = n().unityInsightIndex.forceRebuildByPath,
      i = t[e];
    if (!i || i.observeOnly || i.ensureInFlight || i.seenBuilding || i.ensureTriggered) return;
    if (!ce(t, e)) {
      const y = Date.now(),
        f = _(t, e);
      (r(F({ path: e, generation: i.generation, now: y, refreshStartedAt: f })),
        r(S({ path: e, generation: i.generation, ensureInFlight: !1, nextRetryAt: y + B })));
      return;
    }
    const s = i.generation,
      u = Date.now(),
      o = r(q(e, { generation: s, ensureInFlight: !0, nextRetryAt: u + B }));
    if (o != null)
      try {
        const y = await we(e, $(n(), e));
        if (!k(n(), e, s)) return;
        if (y.ok === !1) {
          r(
            x({
              path: e,
              snap: {
                indexStatus: "error",
                percent: 0,
                indexing: !1,
                error: ((d = y.error) == null ? void 0 : d.trim()) || "ensure-index failed",
                indexedAt:
                  (g = (a = n().unityInsightIndex.statusByPath[e]) == null ? void 0 : a.indexedAt) != null ? g : null,
                progressPhase: null,
                progressDetail: null,
              },
            }),
          );
          return;
        }
        if (y.status === "building" || y.triggered === !0) {
          r(J({ path: e, generation: s, now: Date.now() }));
          return;
        }
        y.status === "busy" &&
          r(
            F({
              path: e,
              generation: s,
              now: Date.now(),
              busyReason: y.reason === "foreign_lock" ? "foreign_lock" : "daemon",
            }),
          );
      } catch {
        k(n(), e, s) && r(F({ path: e, generation: s, now: Date.now(), busyReason: "daemon" }));
      } finally {
        k(n(), e, s) && r(q(e, { generation: s, ensureInFlight: !1, ensureEpoch: o, nextRetryAt: Date.now() + B }));
      }
  };
}
function Se(e, r) {
  var n;
  return (r == null ? void 0 : r.indexStatus) === "error" && (e.seenBuilding || e.ensureTriggered)
    ? { ok: !1, triggered: !1, status: "error", error: r.error }
    : e.observeOnly || e.ensureTriggered || e.seenBuilding
      ? { ok: !0, triggered: !0, status: "building" }
      : e.deferred || e.ensureInFlight
        ? { ok: !0, triggered: !1, status: "busy", reason: (n = e.busyReason) != null ? n : "daemon" }
        : { ok: !0, triggered: !1, status: "busy", reason: "daemon" };
}
function Ye(e) {
  return async (r, n) => {
    var u, o;
    const t = e.trim();
    if (!t) return { ok: !1, triggered: !1, status: "error", error: "workspaceDir is required" };
    const i = p(n().unityInsightIndex, t);
    if (i) return Se(i, X(n().unityInsightIndex, t));
    const s = n().unityInsightIndex.forceRebuildByPath;
    if (de(s)) return { ok: !0, triggered: !1, status: "busy", reason: "daemon" };
    if (Object.values(s).some((d) => d.observeOnly && (d.seenBuilding || d.deferred)))
      return { ok: !0, triggered: !1, status: "busy", reason: "foreign_lock" };
    try {
      const d = await Z(t, $(n(), t), !1);
      return d.ok === !1
        ? {
            ok: !1,
            triggered: !1,
            status: "error",
            error: ((u = d.error) == null ? void 0 : u.trim()) || "ensure-index failed",
          }
        : d.status === "building" || d.triggered === !0
          ? (r(ye()), { ok: !0, triggered: !0, status: "building" })
          : d.status === "busy"
            ? { ok: !0, triggered: !1, status: "busy", reason: d.reason === "foreign_lock" ? "foreign_lock" : "daemon" }
            : d.status === "ready"
              ? { ok: !0, triggered: !1, status: "ready" }
              : {
                  ok: !0,
                  triggered: !1,
                  status: (o = d.status) != null ? o : "busy",
                  error: d.error,
                  reason: d.reason,
                };
    } catch (d) {
      return { ok: !1, triggered: !1, status: "error", error: d instanceof Error ? d.message : String(d) };
    }
  };
}
function ee() {
  return (e, r) => {
    var i, s, u, o, d, a, g, y;
    const n = Date.now(),
      t = Object.keys(r().unityInsightIndex.forceRebuildByPath);
    for (const f of t) {
      const c = r().unityInsightIndex.forceRebuildByPath[f];
      if (!c) continue;
      const l = r().unityInsightIndex.statusByPath[f];
      if (c.observeOnly) {
        if (c.seenBuilding && (l == null ? void 0 : l.indexStatus) === "ready") {
          e(
            x({
              path: f,
              snap: {
                indexStatus: "ready",
                percent: 100,
                indexing: !1,
                error: null,
                indexedAt: (i = l.indexedAt) != null ? i : null,
                progressPhase: null,
                progressDetail: null,
              },
            }),
          );
          continue;
        }
        if (
          !c.seenBuilding &&
          ((l == null ? void 0 : l.indexStatus) === "ready" ||
            (l == null ? void 0 : l.indexStatus) === "idle" ||
            (l == null ? void 0 : l.indexStatus) === "unknown" ||
            (l == null ? void 0 : l.indexStatus) === "error")
        ) {
          if (!c.deferred || l.indexStatus === "error") continue;
          e(
            x({
              path: f,
              snap: {
                indexStatus: l.indexStatus === "unknown" ? "idle" : l.indexStatus,
                percent: l.indexStatus === "ready" ? ((s = l.percent) != null ? s : 100) : 0,
                indexing: !1,
                error: null,
                indexedAt: (u = l.indexedAt) != null ? u : null,
                progressPhase: null,
                progressDetail: null,
              },
            }),
          );
          continue;
        }
        if ((l == null ? void 0 : l.indexStatus) === "error" && c.seenBuilding) {
          e(
            x({
              path: f,
              snap: {
                indexStatus: "error",
                percent: 0,
                indexing: !1,
                error: l.error,
                indexedAt: l.indexedAt,
                progressPhase: null,
                progressDetail: null,
              },
            }),
          );
          continue;
        }
        continue;
      }
      if (!c.ensureInFlight) {
        const b =
          c.ensureTriggered &&
          c.baselineIndexedAt !== void 0 &&
          (l == null ? void 0 : l.indexStatus) === "ready" &&
          l.indexedAt != null &&
          l.indexedAt !== c.baselineIndexedAt;
        if ((c.ensureTriggered && c.seenBuilding && (l == null ? void 0 : l.indexStatus) === "ready") || b) {
          e(
            x({
              path: f,
              snap: {
                indexStatus: "ready",
                percent: 100,
                indexing: !1,
                error: null,
                indexedAt: (o = l == null ? void 0 : l.indexedAt) != null ? o : null,
                progressPhase: null,
                progressDetail: null,
              },
            }),
          );
          continue;
        }
      }
      if ((l == null ? void 0 : l.indexStatus) === "error") {
        const b = c.ensureTriggered && c.startedAt != null && n - c.startedAt > se;
        if (c.seenBuilding || b) {
          e(
            x({
              path: f,
              snap: {
                indexStatus: "error",
                percent: 0,
                indexing: !1,
                error: l.error,
                indexedAt: l.indexedAt,
                progressPhase: null,
                progressDetail: null,
              },
            }),
          );
          continue;
        }
      }
      if (
        !c.ensureTriggered &&
        !c.ensureInFlight &&
        !c.deferred &&
        c.startedAt == null &&
        n - c.createdAt > j &&
        ((l == null ? void 0 : l.indexStatus) === "ready" ||
          (l == null ? void 0 : l.indexStatus) === "idle" ||
          ((l == null ? void 0 : l.indexStatus) === "unknown" && l.indexedAt != null))
      ) {
        e(
          x({
            path: f,
            snap: {
              indexStatus: l.indexStatus === "unknown" ? "ready" : l.indexStatus,
              percent:
                l.indexStatus === "ready" || l.indexStatus === "unknown" ? ((d = l.percent) != null ? d : 100) : 0,
              indexing: !1,
              error: null,
              indexedAt: (a = l.indexedAt) != null ? a : null,
              progressPhase: null,
              progressDetail: null,
            },
          }),
        );
        continue;
      }
      if (c.ensureInFlight && c.ensureStartedAt != null && n - c.ensureStartedAt > K) {
        (e(F({ path: f, generation: c.generation, now: n })),
          e(S({ path: f, generation: c.generation, ensureInFlight: !1, nextRetryAt: n + B })));
        continue;
      }
      if (!c.seenBuilding && !c.ensureTriggered && !c.ensureInFlight && c.startedAt != null) {
        const b = r().unityInsightIndex.forceRebuildByPath;
        if (!_(b, f)) {
          let A = c.deferred ? (c.busyReason === "foreign_lock" ? G : te) : j;
          if ((fe(b, f) && (A = G), n - c.startedAt > A)) {
            e(
              x({
                path: f,
                snap: {
                  indexStatus: "error",
                  percent: 0,
                  indexing: !1,
                  error: "Force rebuild did not start in time",
                  indexedAt: (g = l == null ? void 0 : l.indexedAt) != null ? g : null,
                  progressPhase: null,
                  progressDetail: null,
                },
              }),
            );
            continue;
          }
        }
      }
      if (c.ensureTriggered && !c.seenBuilding && c.startedAt != null && n - c.startedAt > ie) {
        e(
          x({
            path: f,
            snap: {
              indexStatus: "error",
              percent: 0,
              indexing: !1,
              error: "Force rebuild did not finish in time",
              indexedAt: (y = l == null ? void 0 : l.indexedAt) != null ? y : null,
              progressPhase: null,
              progressDetail: null,
            },
          }),
        );
        continue;
      }
      !c.seenBuilding && !c.ensureTriggered && !c.ensureInFlight && n >= c.nextRetryAt && e(Fe(f));
    }
  };
}
const ze = T("unityInsightIndex/pollTick", async (e, { dispatch: r, getState: n }) => {
    var i, s, u;
    const t = ge(n().unityInsightIndex.forceRebuildByPath);
    if (t)
      try {
        const o = await N(t);
        r(M({ path: t, snap: o, latchForceBuilding: !0 }));
      } catch (o) {
        if (n().unityInsightIndex.forceRebuildByPath[t] != null) {
          const a = n().unityInsightIndex.forceRebuildByPath[t];
          if (
            (a == null ? void 0 : a.seenBuilding) === !0 &&
            (r(Pe({ path: t })), ((i = n().unityInsightIndex.statusFailCountByPath[t]) != null ? i : 0) >= ue)
          ) {
            const y = o instanceof Error && o.message.trim() ? o.message.trim() : "index-status unavailable";
            r(
              x({
                path: t,
                snap: {
                  indexStatus: "error",
                  percent: 0,
                  indexing: !1,
                  error: y,
                  indexedAt:
                    (u = (s = n().unityInsightIndex.statusByPath[t]) == null ? void 0 : s.indexedAt) != null ? u : null,
                  progressPhase: null,
                  progressDetail: null,
                },
              }),
            );
          }
        }
      }
    r(ee());
  }),
  Je = T("unityInsightIndex/refreshStatus", async (e, { dispatch: r }) => {
    const n = await N(e);
    return r(Q(e, n));
  }),
  pe = 3e3,
  Ee = 5e3,
  Xe = T("unityInsightIndex/discoverActiveBuild", async (e, { dispatch: r, getState: n }) => {
    var f;
    const t = e.map((c) => c.trim()).filter(Boolean);
    if (t.length === 0) return null;
    const { response: i, data: s } = await C(
      `${window.location.origin}/api/tauri/unity-insight/active-build`,
      { workspaceDirs: t },
      { timeoutMs: pe },
    );
    if (!i.ok) throw new Error(`unity-insight/active-build failed with status ${i.status}`);
    const u = s,
      o = typeof (u == null ? void 0 : u.workspaceDir) == "string" ? u.workspaceDir.trim() : "",
      d = typeof (u == null ? void 0 : u.pid) == "number" && Number.isFinite(u.pid) && u.pid > 0 ? u.pid : null;
    if (!o) return (d == null && r(v(null)), null);
    const a = Re(o, t);
    if (!a) return (r(v(null)), null);
    r(v(a));
    const g = h(n().unityInsightIndex.forceRebuildByPath, a);
    if (g != null) {
      const c = n().unityInsightIndex.forceRebuildByPath[g];
      return (
        c &&
          !c.observeOnly &&
          !c.ensureTriggered &&
          !c.ensureInFlight &&
          r(J({ path: g, generation: c.generation, now: Date.now() })),
        g
      );
    }
    const y = n().unityInsightIndex.statusByPath[a];
    (r(
      M({
        path: a,
        snap: {
          indexStatus: "building",
          percent: 0,
          indexing: !0,
          error: null,
          indexedAt: (f = y == null ? void 0 : y.indexedAt) != null ? f : null,
          progressPhase: null,
          progressDetail: null,
        },
        latchForceBuilding: !1,
      }),
    ),
      r(z({ path: a, now: Date.now(), progressPhase: null, awaitStatusBuilding: !0 })));
    try {
      const c = await N(a, { timeoutMs: Ee });
      H(c) && r(Q(a, c));
    } catch {}
    return a;
  });
export {
  Q as A,
  C as B,
  Te as C,
  re as D,
  he as E,
  z as F,
  Ie as G,
  be as H,
  Be as I,
  xe as J,
  ze as K,
  Xe as L,
  me as M,
  De as N,
  Ce as O,
  Ye as P,
  K as R,
  _e as a,
  Je as b,
  Oe as c,
  Le as d,
  je as e,
  Ge as f,
  Ue as g,
  p as h,
  ve as i,
  D as j,
  $e as k,
  X as l,
  We as m,
  ce as n,
  Ve as o,
  _ as p,
  q,
  ye as r,
  Ne as s,
  $ as t,
  qe as u,
  He as v,
  Ke as w,
  V as x,
  m as y,
  N as z,
};
