import { u as Ae, r as h, j as x, C as In, c as Sn } from "./registry-CHHSpXp3.js";
import {
  u as wn,
  I as Pn,
  a as pn,
  b as En,
  c as xe,
  s as kn,
  d as Z,
  e as He,
  A as ze,
  n as he,
  f as An,
  p as be,
  g as me,
  S as Tn,
  h as Dn,
  P as Mn,
  C as Nn,
  L as jn,
  T as Fn,
} from "./VscTheme-B-CSeuv5.js";
import {
  s as Cn,
  r as On,
  a as Xe,
  b as _n,
  c as ye,
  d as ee,
  e as ne,
  f as Rn,
  g as Bn,
  l as Un,
  h as de,
  i as sn,
  j as Ln,
  k as Ie,
  m as Kn,
  n as Wn,
  o as $n,
  p as vn,
  q as Vn,
  t as Gn,
  R as qn,
  u as Ye,
  v as Je,
  w as Hn,
  x as zn,
  y as Te,
  z as Qe,
  A as Ze,
  B as Xn,
  C as Yn,
} from "./unityInsightIndex-DGh4GXkO.js";
import { n as rn, i as Jn, c as Qn, a as Zn, b as et, U as nt } from "./indexProgress-6mxI3W_J.js";
import { s as en } from "./shallowEqual-5Hn7AXgh.js";
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
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "1726ba42-418c-43bc-997b-e2f9a9ea8e6f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-1726ba42-418c-43bc-997b-e2f9a9ea8e6f"));
  })();
} catch {}
const Se = 8,
  nn = 5e3,
  tt = 1e3,
  st = 1500;
function it(e) {
  const { projectCount: n, loadingProjects: s, hubWorkspacesRefreshPending: g, emptyStateSettled: u } = e;
  return n === 0 && (s || g || !u);
}
async function we(e, n, s) {
  if (e.length === 0) return [];
  const g = Math.max(1, Math.min(n, e.length)),
    u = new Array(e.length);
  let f = 0;
  async function w() {
    for (;;) {
      const P = f++;
      if (P >= e.length) return;
      u[P] = await s(e[P], P);
    }
  }
  return (await Promise.all(Array.from({ length: g }, () => w())), u);
}
const an = 1,
  on = 60,
  Pe = 15;
function pe(e) {
  return Math.min(on, Math.max(an, Math.round(e)));
}
class De extends Error {
  constructor(n, s) {
    (super(n), (this.response = s), (this.name = "UnityInsightRequestError"));
  }
}
function ie(e) {
  var n;
  return e.indexStatus === "ready" || ((n = e.indexedAt) != null && n.trim())
    ? "indexed"
    : e.indexStatus === "building"
      ? "loading"
      : e.indexStatus === "idle" || e.indexStatus === "error" || (e.indexStatus === "unknown" && e.statusKnown === !0)
        ? "notIndexed"
        : "loading";
}
function It(e) {
  return ie(e) === "indexed";
}
function St(e) {
  return ie(e) === "notIndexed";
}
function wt(e) {
  return ie(e) === "loading";
}
function rt(e) {
  var n;
  return e.enabled || e.statusKnown !== !0
    ? !0
    : ie({
        indexStatus: (n = e.indexStatus) != null ? n : "unknown",
        indexedAt: e.indexedAt,
        statusKnown: e.statusKnown,
      }) === "loading";
}
function ln(e) {
  return e.enabled
    ? !(!e.rebuildActive && (e.indexSyncing === !0 || Te(e.progressPhase))) &&
        e.indexStatus !== "error" &&
        (e.indexing === !0 || e.indexStatus === "building" || e.rebuildActive === !0)
    : !1;
}
function dn(e) {
  return e.enabled && e.indexStatus !== "error" && !e.rebuildActive && (e.indexSyncing === !0 || Te(e.progressPhase));
}
function at(e) {
  var n;
  return !((n = e.indexedAt) != null && n.trim()) || ln(e) ? !1 : !dn(e);
}
function ot(e, n, s = Date.now()) {
  const g = e == null ? void 0 : e.trim();
  if (!g) return null;
  const u = new Date(g).getTime();
  if (Number.isNaN(u)) return null;
  const f = Math.max(0, Math.floor((s - u) / 6e4)),
    w =
      f < 1
        ? n("settings.insightIndex.justNow", { defaultValue: "just now" })
        : f < 60
          ? n("settings.insightIndex.minutesAgo", {
              count: f,
              defaultValue: f === 1 ? "1 minute ago" : `${f} minutes ago`,
            })
          : Math.floor(f / 60) < 24
            ? n("settings.insightIndex.hoursAgo", {
                count: Math.floor(f / 60),
                defaultValue: Math.floor(f / 60) === 1 ? "1 hour ago" : `${Math.floor(f / 60)} hours ago`,
              })
            : n("settings.insightIndex.daysAgo", {
                count: Math.floor(f / 60 / 24),
                defaultValue: Math.floor(f / 60 / 24) === 1 ? "1 day ago" : `${Math.floor(f / 60 / 24)} days ago`,
              });
  return n("settings.insightIndex.lastIndexed", { time: w, defaultValue: `${w} indexed` });
}
function lt(e) {
  return {
    indexStatus: e.indexStatus,
    indexedAt: e.indexedAt,
    statusKnown: !0,
    indexing: !1,
    indexSyncing: !1,
    progressPhase: null,
    progressDetail: null,
  };
}
function te(e, n) {
  return e instanceof Error && e.message.trim() ? e.message : typeof e == "string" && e.trim() ? e : n;
}
function se(e) {
  return (e instanceof DOMException && e.name === "AbortError") || (e instanceof Error && e.name === "AbortError");
}
function dt(e) {
  var s, g;
  if (se(e) || e instanceof TypeError) return !0;
  const n = e instanceof Error ? e.message.toLowerCase() : typeof e == "string" ? e.toLowerCase() : "";
  if (/timed?\s*out|econnrefused|network|failed to fetch|fetch failed|502|503|504/.test(n)) return !0;
  if (e instanceof De) {
    const u = (g = (s = e.response) == null ? void 0 : s.status) == null ? void 0 : g.toLowerCase();
    return u === "error" || u === "blocked" ? !1 : !!/failed with status 5\d\d/.test(n);
  }
  return !1;
}
function ut(e, n, s) {
  var g;
  return e.isUnityProject !== void 0
    ? e.isUnityProject
    : e.workspaceKey === Mn
      ? s.isUnityProject
      : ((g = n[e.workspaceKey]) == null ? void 0 : g.isUnityProject) === !0;
}
async function K(e, n = {}, s) {
  var w;
  const { response: g, data: u } = await Xn(`${window.location.origin}/api/tauri/unity-insight/${e}`, n, {
      timeoutMs: s == null ? void 0 : s.timeoutMs,
    }),
    f = u;
  if (!g.ok)
    throw new De(
      ((w = f == null ? void 0 : f.error) == null ? void 0 : w.trim()) ||
        `unity-insight/${e} failed with status ${g.status}`,
      f,
    );
  if (f && typeof f == "object" && f.ok === !1 && f.error) throw new Error(String(f.error));
  return f;
}
function Ee(e) {
  (window.dispatchEvent(new CustomEvent("gamecowork:unity-insight-feature-changed", { detail: e })),
    window.postMessage({ messageType: "gamecowork:unity-insight-feature-changed", data: e }, "*"));
  try {
    const n = new BroadcastChannel("gamecowork-unity-insight-feature");
    (n.postMessage(e), n.close());
  } catch {}
}
function un(e, n) {
  return e.indexing || e.rebuildActive === !0 ? Math.max(e.percent, n) : n;
}
function tn(e, n) {
  var u;
  const s = n.indexStatus === "building",
    g = sn(n) && !s;
  return {
    indexStatus: n.indexStatus,
    percent: s ? un(e, n.percent) : n.percent,
    indexing: s,
    indexSyncing: g,
    progressPhase: s || g ? ((u = n.progressPhase) != null ? u : g ? "sync" : null) : null,
    progressDetail: s || g ? n.progressDetail : null,
    indexedAt: n.indexedAt,
    statusKnown: !0,
  };
}
function ke(e, n, s) {
  var u, f, w, P, T, E;
  if (n) {
    if (!Yn(n, s)) {
      if (s) {
        const M = tn(e, s);
        return {
          ...e,
          ...M,
          rebuildActive: !1,
          rebuildSeenBuilding: n.seenBuilding,
          rebuildStartedAt: n.startedAt,
          rebuildDeferred: !1,
          rebuildEnsureTriggered: n.ensureTriggered,
          rebuildObserveOnly: n.observeOnly,
        };
      }
      return {
        ...e,
        rebuildActive: !1,
        rebuildSeenBuilding: n.seenBuilding,
        rebuildStartedAt: n.startedAt,
        rebuildDeferred: !1,
        rebuildEnsureTriggered: n.ensureTriggered,
        rebuildObserveOnly: n.observeOnly,
      };
    }
    const k = (u = s == null ? void 0 : s.indexStatus) != null ? u : "building",
      D =
        k === "building"
          ? n.seenBuilding
            ? un(e, (f = s == null ? void 0 : s.percent) != null ? f : 0)
            : (w = s == null ? void 0 : s.percent) != null
              ? w
              : 0
          : 0;
    return {
      ...e,
      indexStatus: "building",
      percent: D,
      indexing: !0,
      indexSyncing: !1,
      progressPhase: k === "building" && (P = s == null ? void 0 : s.progressPhase) != null ? P : null,
      progressDetail: k === "building" && (T = s == null ? void 0 : s.progressDetail) != null ? T : null,
      indexedAt: (E = s == null ? void 0 : s.indexedAt) != null ? E : e.indexedAt,
      statusKnown: s != null || e.statusKnown === !0,
      rebuildActive: !0,
      rebuildSeenBuilding: n.seenBuilding,
      rebuildStartedAt: n.startedAt,
      rebuildDeferred: n.deferred,
      rebuildEnsureTriggered: n.ensureTriggered,
      rebuildObserveOnly: n.observeOnly,
    };
  }
  if (!s)
    return {
      ...e,
      rebuildActive: !1,
      rebuildSeenBuilding: !1,
      rebuildStartedAt: void 0,
      rebuildDeferred: !1,
      rebuildEnsureTriggered: !1,
      rebuildObserveOnly: !1,
    };
  const g = tn(e, s);
  return {
    ...e,
    ...g,
    rebuildActive: !1,
    rebuildSeenBuilding: !1,
    rebuildStartedAt: void 0,
    rebuildDeferred: !1,
    rebuildEnsureTriggered: !1,
    rebuildObserveOnly: !1,
  };
}
function cn({ lineKey: e, label: n, percent: s, suffix: g }) {
  const u = s != null && s > 0;
  return x.jsx("div", {
    className: "flex min-w-0 items-center gap-1 overflow-hidden",
    role: "status",
    "aria-live": "polite",
    "aria-label": u ? `${n} ${s}%` : n,
    children: x.jsxs(
      "div",
      {
        className: "prompt-bubble-in flex min-w-0 items-center gap-1",
        children: [
          x.jsxs("span", {
            className: "phrase_cycler_text text-gamecowork-color-text-tertiary min-w-0 truncate",
            children: [n, u ? x.jsxs("span", { "aria-hidden": "true", children: [" ", s, "%"] }) : null],
          }),
          g,
        ],
      },
      e != null ? e : n,
    ),
  });
}
function ct({ percent: e, label: n, progressPhase: s, progressDetail: g, active: u }) {
  const { t: f } = Ae(),
    w = Math.min(Math.max(e, 0), 100),
    [P, T] = h.useState({ hadFraction: !1, prevPhase: null }),
    E = h.useMemo(() => Qn(P, u, rn(s), g), [P, u, s, g]),
    k = E.state;
  (k.hadFraction !== P.hadFraction || k.prevPhase !== P.prevPhase) && T(k);
  const { fraction: D, isStageStep: M, stepIndex: C } = E,
    V = et(C, nt.length, M ? D : null, w),
    N = Zn(s);
  return x.jsx(cn, {
    lineKey: `${n}\0${N.current}/${N.total}`,
    label: n,
    percent: V,
    suffix: x.jsx("span", {
      className: "text-gamecowork-color-text-tertiary shrink-0 text-xs leading-5",
      children: f("settings.insightIndex.indexStepProgress", {
        current: N.current,
        total: N.total,
        defaultValue: `(${N.current}/${N.total})`,
      }),
    }),
  });
}
function gt({ project: e, onToggle: n, onIndex: s, indexLabel: g, indexingLabel: u }) {
  var D, M;
  const { t: f } = Ae(),
    w = ln(e),
    P = dn(e),
    T = at(e) ? ot(e.indexedAt, f) : null,
    E =
      ((D = e.progressPhase) == null ? void 0 : D.trim()) === "reconcile"
        ? "settings.insightIndex.indexPhase.reconcile"
        : "settings.insightIndex.indexPhase.sync",
    k = ie(e);
  return x.jsxs("div", {
    className: "grid min-w-0 grid-cols-[1fr_auto] items-center p-3",
    children: [
      x.jsxs("div", {
        className: "flex min-w-0 flex-col",
        children: [
          x.jsxs("div", {
            className: "flex min-w-0 items-center gap-2",
            children: [
              x.jsx("div", {
                className: "text-gamecowork-color-text-primary truncate text-sm font-medium leading-6",
                children: e.name,
              }),
              k === "indexed"
                ? x.jsx("span", {
                    className:
                      "bg-gamecowork-color-surface-card border-gamecowork-color-border-subtle text-gamecowork-color-text-secondary shrink-0 rounded border border-solid px-[5px] py-px text-xs leading-[1.4]",
                    children: f("settings.insightIndex.indexedBadge"),
                  })
                : k === "loading"
                  ? x.jsx("span", {
                      className:
                        "bg-gamecowork-color-surface-card border-gamecowork-color-border-subtle text-gamecowork-color-text-tertiary shrink-0 rounded border border-solid px-[5px] py-px text-xs leading-[1.4]",
                      children: f("settings.insightIndex.loadingBadge"),
                    })
                  : x.jsx("span", {
                      className:
                        "bg-gamecowork-color-status-danger-muted border-gamecowork-color-status-danger-border text-gamecowork-color-status-danger-text shrink-0 rounded border border-solid px-[5px] py-px text-xs leading-[1.4]",
                      children: f("settings.insightIndex.notIndexedBadge"),
                    }),
            ],
          }),
          x.jsx("div", {
            className: "text-gamecowork-color-text-tertiary truncate text-xs leading-5",
            title: e.path,
            children: e.path,
          }),
        ],
      }),
      x.jsxs("div", {
        className: "flex shrink-0 items-center gap-3",
        children: [
          x.jsx("button", {
            type: "button",
            disabled: !e.enabled || e.indexing || e.toggling,
            onClick: (C) => {
              (C.preventDefault(), C.stopPropagation(), s());
            },
            className:
              "border-gamecowork-color-border-subtle text-gamecowork-color-text-primary hover:bg-gamecowork-color-interactive-hover flex h-[1.75rem] min-w-[3.5rem] cursor-pointer items-center justify-center rounded-lg border border-solid bg-transparent px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            children: g,
          }),
          x.jsx(Fn, { value: e.enabled, onChange: n, disabled: e.toggling }),
        ],
      }),
      w
        ? x.jsx("div", {
            className: "col-start-1 min-w-0",
            children: x.jsx(ct, {
              percent: e.percent,
              label: u,
              progressPhase: e.progressPhase,
              progressDetail: e.progressDetail,
              active: e.indexStatus === "building",
            }),
          })
        : P
          ? x.jsx("div", {
              className: "col-start-1 min-w-0",
              children: x.jsx(cn, {
                label: f(E, {
                  defaultValue:
                    ((M = e.progressPhase) == null ? void 0 : M.trim()) === "reconcile" ? "Reconciling…" : "Syncing…",
                }),
              }),
            })
          : T
            ? x.jsx("div", {
                className: "text-gamecowork-color-text-tertiary col-start-1 min-w-0 truncate text-xs leading-5",
                children: T,
              })
            : null,
    ],
  });
}
function ft({
  title: e,
  projects: n,
  loading: s,
  emptyLabel: g,
  loadingLabel: u,
  onToggle: f,
  onIndex: w,
  indexLabel: P,
  indexingLabel: T,
}) {
  return x.jsxs("div", {
    className: "mt-8",
    children: [
      x.jsx(Nn, { title: e, className: "text-gamecowork-color-text-tertiary mb-4 text-sm capitalize" }),
      x.jsx("div", {
        className: "bg-gamecowork-color-surface-card flex flex-col gap-2 rounded-[0.75rem] border",
        children:
          n.length === 0
            ? s
              ? x.jsxs("div", {
                  className: "text-gamecowork-color-text-tertiary flex items-center gap-2 px-3 py-4 text-sm",
                  children: [x.jsx(jn, { className: "h-4 w-4 shrink-0 animate-spin" }), x.jsx("span", { children: u })],
                })
              : x.jsx("div", { className: "text-gamecowork-color-text-tertiary px-3 py-4 text-sm", children: g })
            : n.map((E, k) =>
                x.jsx(
                  "div",
                  {
                    className: Sn(
                      k < n.length - 1 && "border-gamecowork-color-border-subtle border-0 border-b border-solid",
                    ),
                    children: x.jsx(gt, {
                      project: E,
                      onToggle: () => f(E.path),
                      onIndex: () => w(E.path),
                      indexLabel: P,
                      indexingLabel: T(E),
                    }),
                  },
                  E.path,
                ),
              ),
      }),
    ],
  });
}
function Pt({ isPlugin: e }) {
  const { t: n } = Ae(),
    s = wn(),
    g = h.useContext(Pn),
    u = pn(),
    { hubWorkspaces: f, projectInfoMap: w } = En(e),
    P = xe(kn),
    T = xe((t) => t.hub.isHubMode),
    E = xe(Cn),
    [k, D] = h.useState(!0),
    [M, C] = h.useState(Pe),
    [V, N] = h.useState(!1),
    [re, W] = h.useState([]),
    [gn, Me] = h.useState(!0),
    [fn, ue] = h.useState(() => !!T && !e),
    [xn, hn] = h.useState(!1),
    $ = h.useRef(re);
  $.current = re;
  const ce = h.useRef(0),
    G = h.useRef(new Set()),
    ge = h.useRef(() => {}),
    O = h.useCallback(
      (t) => {
        g.post("showToast", ["error", t]);
      },
      [g],
    ),
    Ne = h.useCallback(
      (t, l) => {
        const d = () => {
          (s(Z(!1)), s(me(void 0)));
        };
        (s(Z(!0)),
          s(
            He({
              message: x.jsx(ze, {
                mainText: n("settings.insightIndex.rebuildFailed.mainText"),
                subText: l,
                confirmText: n("settings.insightIndex.rebuildFailed.retry"),
                cancelText: n("common.cancel"),
                onConfirm: () => {
                  (d(), ge.current(t));
                },
                onCancel: d,
              }),
              size: "xs",
              closeOnBackdropClick: !1,
              hideClose: !0,
            }),
          ));
      },
      [s, n],
    ),
    ae = h.useMemo(() => {
      var d;
      const t = new Set(),
        l = [];
      for (const o of f) {
        if (o.isHomeWorkspace || o.isRemote || !ut(o, w, P)) continue;
        const r = (d = o.workspaceDir) == null ? void 0 : d.trim();
        if (!r) continue;
        const c = he(r);
        t.has(c) || (t.add(c), l.push(r));
      }
      return l;
    }, [P.isUnityProject, f, w]),
    fe = h.useMemo(
      () =>
        ae
          .map((t) => he(t))
          .sort()
          .join("\0"),
      [ae],
    ),
    je = h.useRef(ae);
  ((je.current = ae),
    h.useEffect(() => {
      if (!T || e) {
        ue(!1);
        return;
      }
      let t = !1;
      return (
        ue(!0),
        s(An())
          .catch(() => {})
          .finally(() => {
            t || ue(!1);
          }),
        () => {
          t = !0;
        }
      );
    }, [s, T, e]),
    h.useEffect(() => {
      fe && s(On());
    }, [s, fe]),
    h.useEffect(
      () => (
        s(Xe(!0)),
        () => {
          s(Xe(!1));
        }
      ),
      [s],
    ));
  const Fe = h.useCallback(async () => {
    try {
      const [t, l] = await Promise.all([
        K("get-enabled", { scope: "user" }, { timeoutMs: 8e3 }).catch(async (d) => {
          var r;
          if (se(d)) throw d;
          const o = await g.request("unityInsight/getEnabled", { scope: "user" });
          if (o.status !== "success")
            throw new Error((r = o == null ? void 0 : o.error) != null ? r : "Failed to load enable setting");
          return o.content;
        }),
        K("get-max-turns", { scope: "user" }, { timeoutMs: 8e3 }).catch(async (d) => {
          var r;
          if (se(d)) throw d;
          const o = await g.request("unityInsight/getMaxTurns", { scope: "user" });
          if (o.status !== "success")
            throw new Error((r = o == null ? void 0 : o.error) != null ? r : "Failed to load max turns");
          return o.content;
        }),
      ]);
      (D((t == null ? void 0 : t.enabled) === !0),
        C(typeof (l == null ? void 0 : l.maxTurns) == "number" ? pe(l.maxTurns) : Pe));
    } catch (t) {
      (console.warn("[InsightIndexPage] Failed to load global settings", t),
        O(te(t, n("settings.insightIndex.loadSettingsFailed"))));
    }
  }, [g, O, n]);
  h.useEffect(() => {
    Fe();
  }, [Fe]);
  const Ce = h.useCallback(
      async (t) => {
        var l;
        (D(t), N(!0));
        try {
          const d = await K("set-enabled", { enabled: t, scope: "user", disableAgent: !1 }, { timeoutMs: 15e3 }).catch(
            async (o) => {
              var c;
              if (se(o)) throw o;
              const r = await g.request("unityInsight/setEnabled", { enabled: t, scope: "user", disableAgent: !1 });
              if (r.status !== "success")
                throw new Error((c = r == null ? void 0 : r.error) != null ? c : "Failed to save enable setting");
              return r.content;
            },
          );
          if (d != null && d.error) throw new Error(d.error);
          (D((l = d == null ? void 0 : d.enabled) != null ? l : t), Ee({}));
        } catch (d) {
          (D(!t), O(te(d, n("settings.insightIndex.saveSettingsFailed"))));
        } finally {
          N(!1);
        }
      },
      [g, O, n],
    ),
    Oe = h.useCallback(
      async (t) => {
        const l = pe(t),
          d = M;
        (C(l), N(!0));
        try {
          const o = await K("set-max-turns", { maxTurns: l, scope: "user" }, { timeoutMs: 15e3 }).catch(async (r) => {
            var y;
            if (se(r)) throw r;
            const c = await g.request("unityInsight/setMaxTurns", { maxTurns: l, scope: "user" });
            if (c.status !== "success")
              throw new Error((y = c == null ? void 0 : c.error) != null ? y : "Failed to save max turns");
            return c.content;
          });
          if (o != null && o.error) throw new Error(o.error);
          typeof (o == null ? void 0 : o.maxTurns) == "number" && C(pe(o.maxTurns));
        } catch (o) {
          (C(d), O(te(o, n("settings.insightIndex.saveSettingsFailed"))));
        } finally {
          N(!1);
        }
      },
      [g, O, M, n],
    ),
    bn = h.useMemo(
      () => ({
        id: "insight-index-settings",
        title: n("settings.insightIndex.settings"),
        settings: [
          {
            type: "toggle",
            key: "enableForNewProjects",
            title: n("settings.insightIndex.enableForNewProjects.title"),
            description: n("settings.insightIndex.enableForNewProjects.description"),
            value: k,
            disabled: V,
            onToggle: () => {
              Ce(!k);
            },
          },
          {
            type: "number",
            key: "subagentMaxRounds",
            title: n("settings.insightIndex.subagentMaxRounds.title"),
            description: n("settings.insightIndex.subagentMaxRounds.description"),
            value: M,
            min: an,
            max: on,
            defaultValue: Pe,
            disabled: V,
            onChange: (t) => {
              Oe(t);
            },
          },
        ],
      }),
      [k, Ce, Oe, V, M, n],
    ),
    oe = h.useCallback(async (t) => s(_n(t)).unwrap(), [s]),
    _e = h.useCallback(
      async (t) => {
        const l = await K("get-enabled", { workspaceDir: t }),
          d = (l == null ? void 0 : l.enabled) === !0;
        return (s(ye({ path: t, enabled: d })), { enabled: d });
      },
      [s],
    ),
    Re = h.useCallback(
      (t) => {
        const l = u.getState();
        return ke(t, ne(l, t.path), ee(l, t.path));
      },
      [u],
    ),
    Be = h.useCallback(async () => {
      const t = ++ce.current,
        l = () => t !== ce.current,
        d = new Map($.current.map((m) => [m.path, m])),
        o = new Set(),
        r = [],
        c = (m) => {
          const a = m.trim();
          if (!a) return;
          const i = he(a);
          o.has(i) || (o.add(i), r.push(a));
        };
      for (const m of je.current) c(m);
      for (const m of Rn(u.getState())) c(m);
      const y = r.map((m) => {
        var _, R, p, S, A, I, j, F, v, L, q, H, z, X, Y, J, Q;
        const a = d.get(m),
          i = u.getState(),
          b = ee(i, m),
          B = Bn(i, m),
          U = {
            path: m,
            name: be(m),
            enabled: (R = (_ = a == null ? void 0 : a.enabled) != null ? _ : B) != null ? R : !1,
            indexStatus:
              (S = (p = b == null ? void 0 : b.indexStatus) != null ? p : a == null ? void 0 : a.indexStatus) != null
                ? S
                : "unknown",
            percent:
              (I = (A = b == null ? void 0 : b.percent) != null ? A : a == null ? void 0 : a.percent) != null ? I : 0,
            indexing:
              (F = (j = b == null ? void 0 : b.indexing) != null ? j : a == null ? void 0 : a.indexing) != null
                ? F
                : !1,
            indexSyncing:
              (L = (v = b == null ? void 0 : b.indexSyncing) != null ? v : a == null ? void 0 : a.indexSyncing) != null
                ? L
                : !1,
            progressPhase:
              (H = (q = b == null ? void 0 : b.progressPhase) != null ? q : a == null ? void 0 : a.progressPhase) !=
              null
                ? H
                : null,
            progressDetail:
              (X = (z = b == null ? void 0 : b.progressDetail) != null ? z : a == null ? void 0 : a.progressDetail) !=
              null
                ? X
                : null,
            indexedAt:
              (J = (Y = b == null ? void 0 : b.indexedAt) != null ? Y : a == null ? void 0 : a.indexedAt) != null
                ? J
                : null,
            statusKnown: b != null || (a == null ? void 0 : a.statusKnown) === !0,
            toggling: (Q = a == null ? void 0 : a.toggling) != null ? Q : !1,
            rebuildActive: !1,
            rebuildSeenBuilding: a == null ? void 0 : a.rebuildSeenBuilding,
            rebuildStartedAt: a == null ? void 0 : a.rebuildStartedAt,
            rebuildDeferred: a == null ? void 0 : a.rebuildDeferred,
            rebuildEnsureTriggered: a == null ? void 0 : a.rebuildEnsureTriggered,
            rebuildObserveOnly: a == null ? void 0 : a.rebuildObserveOnly,
          };
        return ke(U, ne(i, m), b);
      });
      if (!l()) {
        (W(y),
          y.length > 0 && Me(!1),
          r.length > 0 &&
            we(r, Se, async (m) => {
              if (!l())
                try {
                  const a = await Qe(m, { timeoutMs: nn });
                  if (l()) return;
                  s(Ze(m, a));
                } catch {}
            }));
        try {
          const m = await we(r, Se, async (a) => {
            var B, U, _, R, p, S, A, I, j, F, v, L, q, H, z, X, Y, J, Q;
            if (l())
              return {
                path: a,
                name: be(a),
                enabled: !1,
                indexStatus: "unknown",
                percent: 0,
                indexing: !1,
                indexSyncing: !1,
                progressPhase: null,
                progressDetail: null,
                indexedAt: null,
                statusKnown: !1,
                toggling: !1,
                rebuildActive: !1,
              };
            const i = (B = $.current.find((le) => le.path === a)) != null ? B : d.get(a),
              b = await _e(a).catch(() => {
                var le, Le, Ke, We, $e, ve, Ve, Ge, qe;
                return {
                  enabled: (le = i == null ? void 0 : i.enabled) != null ? le : !1,
                  indexStatus: (Le = i == null ? void 0 : i.indexStatus) != null ? Le : "unknown",
                  percent: (Ke = i == null ? void 0 : i.percent) != null ? Ke : 0,
                  indexing: (We = i == null ? void 0 : i.indexing) != null ? We : !1,
                  indexSyncing: ($e = i == null ? void 0 : i.indexSyncing) != null ? $e : !1,
                  progressPhase: (ve = i == null ? void 0 : i.progressPhase) != null ? ve : null,
                  progressDetail: (Ve = i == null ? void 0 : i.progressDetail) != null ? Ve : null,
                  indexedAt: (Ge = i == null ? void 0 : i.indexedAt) != null ? Ge : null,
                  statusKnown: (qe = i == null ? void 0 : i.statusKnown) != null ? qe : !1,
                };
              });
            return {
              path: a,
              name: be(a),
              enabled: (_ = (U = b.enabled) != null ? U : i == null ? void 0 : i.enabled) != null ? _ : !1,
              indexStatus:
                (p = (R = b.indexStatus) != null ? R : i == null ? void 0 : i.indexStatus) != null ? p : "unknown",
              percent: (A = (S = b.percent) != null ? S : i == null ? void 0 : i.percent) != null ? A : 0,
              indexing: (j = (I = b.indexing) != null ? I : i == null ? void 0 : i.indexing) != null ? j : !1,
              indexSyncing:
                (v = (F = b.indexSyncing) != null ? F : i == null ? void 0 : i.indexSyncing) != null ? v : !1,
              progressPhase:
                (q = (L = b.progressPhase) != null ? L : i == null ? void 0 : i.progressPhase) != null ? q : null,
              progressDetail:
                (z = (H = b.progressDetail) != null ? H : i == null ? void 0 : i.progressDetail) != null ? z : null,
              indexedAt: (Y = (X = b.indexedAt) != null ? X : i == null ? void 0 : i.indexedAt) != null ? Y : null,
              statusKnown: (J = i == null ? void 0 : i.statusKnown) != null ? J : !1,
              toggling: (Q = i == null ? void 0 : i.toggling) != null ? Q : !1,
              rebuildActive: !1,
              rebuildSeenBuilding: i == null ? void 0 : i.rebuildSeenBuilding,
              rebuildStartedAt: i == null ? void 0 : i.rebuildStartedAt,
              rebuildDeferred: i == null ? void 0 : i.rebuildDeferred,
              rebuildEnsureTriggered: i == null ? void 0 : i.rebuildEnsureTriggered,
              rebuildObserveOnly: i == null ? void 0 : i.rebuildObserveOnly,
            };
          });
          if (l()) return;
          W(m.map(Re));
        } catch (m) {
          if (l()) return;
          console.warn("[InsightIndexPage] Failed to load projects", m);
        } finally {
          l() || Me(!1);
        }
      }
    }, [s, fe, Re, _e, u]);
  (h.useEffect(() => {
    const t = window.setTimeout(() => hn(!0), st);
    return () => window.clearTimeout(t);
  }, []),
    h.useLayoutEffect(
      () => (
        Be(),
        () => {
          ce.current += 1;
        }
      ),
      [Be],
    ),
    h.useEffect(() => {
      let t = !1,
        l = !1;
      const d = async () => {
        if (t || l) return;
        const r = $.current.filter((c) => rt(c));
        if (r.length !== 0) {
          l = !0;
          try {
            await we(
              r.map((c) => c.path),
              Se,
              async (c) => {
                if (!t)
                  try {
                    const y = await Qe(c, { timeoutMs: nn });
                    if (t) return;
                    s(Ze(c, y));
                  } catch {}
              },
            );
          } finally {
            l = !1;
          }
        }
      };
      d();
      const o = window.setInterval(() => {
        d();
      }, tt);
      return () => {
        ((t = !0), window.clearInterval(o));
      };
    }, [s]),
    h.useEffect(() => {
      E &&
        W((t) => {
          let l = !1;
          const d = t.map((o) => {
            const r = Un(E, o.path),
              c = de(E, o.path);
            if (!r && !c) return o;
            if (!o.enabled && !c && r && !sn(r)) {
              const m = { ...o, ...lt(r) };
              return en(m, o) ? o : ((l = !0), m);
            }
            const y = ke(o, c, r);
            return en(y, o) ? o : ((l = !0), y);
          });
          return l ? d : t;
        });
    }, [E]));
  const mn = h.useCallback(
      async (t) => {
        var o;
        const l = $.current.find((r) => r.path === t);
        if (!l || l.toggling) return;
        const d = !l.enabled;
        W((r) => r.map((c) => (c.path === t ? { ...c, toggling: !0, enabled: d } : c)));
        try {
          const r = await K("set-enabled", { enabled: d, workspaceDir: t, scope: "workspace", promoteUserEnabled: !1 });
          if (r != null && r.error) throw new Error(r.error);
          const c = (o = r == null ? void 0 : r.enabled) != null ? o : d;
          (s(ye({ path: t, enabled: c })),
            W((y) => y.map((m) => (m.path === t ? { ...m, enabled: c, toggling: !1 } : m))),
            Ee({ enabled: c, workspaceDir: t }));
        } catch (r) {
          (console.warn("[InsightIndexPage] set-enabled failed", r),
            O(te(r, n("settings.insightIndex.toggleProjectFailed"))),
            s(ye({ path: t, enabled: l.enabled })),
            W((c) => c.map((y) => (y.path === t ? { ...y, enabled: l.enabled, toggling: !1 } : y))));
        }
      },
      [s, O, n],
    ),
    Ue = h.useCallback(
      async (t, l = !1) => {
        var m, a, i, b, B, U, _, R;
        const d = $.current.find((p) => p.path === t);
        if (!(d != null && d.enabled)) return;
        const o = de(u.getState().unityInsightIndex, t);
        if (o)
          if (o.observeOnly && !o.seenBuilding)
            try {
              const p = await oe(t);
              if (Ln(p)) return;
              s(Ie(t, o.generation));
            } catch {
              return;
            }
          else return;
        if (d.indexing || G.current.has(t)) {
          if (ne(u.getState(), t) || (d.indexing && (m = ee(u.getState(), t)) != null && m.indexing)) return;
          G.current.delete(t);
        }
        G.current.add(t);
        const r = s(Kn(t));
        if (r == null) {
          G.current.delete(t);
          return;
        }
        let c = !1,
          y = null;
        try {
          const p = u.getState().unityInsightIndex.forceRebuildByPath;
          if (!Wn(p, t)) {
            s($n(t, { generation: r, refreshStartedAt: vn(p, t) }));
            return;
          }
          const S = de(u.getState().unityInsightIndex, t);
          if (
            (S != null && S.ensureInFlight) ||
            (S != null && S.ensureTriggered) ||
            (S != null && S.seenBuilding) ||
            ((y = s(Vn(t, { generation: r, ensureInFlight: !0 }))), (c = y != null), !c)
          )
            return;
          const A = Gn(u.getState(), t),
            I = await K(
              "ensure-index",
              { workspaceDir: t, force: !0, closeBlockingProcesses: l, workspaceDirs: A },
              { timeoutMs: qn },
            );
          if ((I == null ? void 0 : I.ok) === !1)
            throw new Error((a = I == null ? void 0 : I.error) != null ? a : "ensure-index failed");
          const j = (I == null ? void 0 : I.status) === "busy",
            F = (I == null ? void 0 : I.triggered) === !0 || (I == null ? void 0 : I.status) === "building";
          if (!(F || j)) throw new Error(n("settings.insightIndex.rebuildFailed.notStarted"));
          Ee({ workspaceDir: t });
          const L = s(
            Ye(t, {
              deferred: j,
              triggered: F,
              generation: r,
              ensureEpoch: y != null ? y : void 0,
              busyReason: j ? ((I == null ? void 0 : I.reason) === "foreign_lock" ? "foreign_lock" : "daemon") : void 0,
            }),
          );
          if (((c = !1), !L)) {
            if (ne(u.getState(), t)) return;
            try {
              await oe(t);
            } catch {}
            return;
          }
          try {
            await oe(t);
          } catch {}
        } catch (p) {
          if (p instanceof De && ((i = p.response) == null ? void 0 : i.status) === "blocked") {
            const I = (b = p.response.blockingProcesses) != null ? b : [],
              j =
                I.length > 0
                  ? I.map((F) => `${F.name} (PID ${F.pid})`).join("、")
                  : n("settings.insightIndex.closeBlockingProcesses.unknownProcess");
            if (
              ((c = !1),
              !s(Ie(t, r)) ||
                !s(
                  Je(
                    t,
                    {
                      indexStatus: "ready",
                      percent: 100,
                      indexing: !1,
                      error: null,
                      indexedAt: (U = (B = ee(u.getState(), t)) == null ? void 0 : B.indexedAt) != null ? U : null,
                      progressPhase: null,
                      progressDetail: null,
                    },
                    r,
                  ),
                ))
            )
              return;
            (s(Z(!0)),
              s(
                He({
                  message: x.jsx(ze, {
                    mainText: n("settings.insightIndex.closeBlockingProcesses.mainText"),
                    subText: n("settings.insightIndex.closeBlockingProcesses.subText", { processes: j }),
                    confirmText: n("settings.insightIndex.closeBlockingProcesses.confirm"),
                    cancelText: n("common.cancel"),
                    onConfirm: () => {
                      (s(Z(!1)), s(me(void 0)), ge.current(t, !0));
                    },
                    onCancel: () => {
                      (s(Z(!1)), s(me(void 0)));
                    },
                  }),
                  size: "xs",
                  closeOnBackdropClick: !1,
                  hideClose: !0,
                }),
              ));
            return;
          }
          console.warn("[InsightIndexPage] ensure-index failed", p);
          const S = te(p, n("settings.insightIndex.indexProjectFailed"));
          if (
            ((c = !1),
            dt(p) &&
              s(
                Ye(t, {
                  deferred: !0,
                  triggered: !1,
                  generation: r,
                  ensureEpoch: y != null ? y : void 0,
                  busyReason: "daemon",
                }),
              ))
          ) {
            console.warn(
              "[InsightIndexPage] Keeping force-rebuild watch after transient ensure failure; store will retry",
              S,
            );
            return;
          }
          const A = de(u.getState().unityInsightIndex, t);
          if (
            A &&
            A.generation === r &&
            (A.ensureTriggered || A.seenBuilding || (A.ensureInFlight && (y == null || A.ensureEpoch !== y)))
          ) {
            console.warn(
              "[InsightIndexPage] Keeping force-rebuild watch after ensure failure; newer store arm owns it",
              S,
            );
            return;
          }
          if (
            !s(Ie(t, r)) ||
            !s(
              Je(
                t,
                {
                  indexStatus: "error",
                  percent: 0,
                  indexing: !1,
                  error: S,
                  indexedAt: (R = (_ = ee(u.getState(), t)) == null ? void 0 : _.indexedAt) != null ? R : null,
                  progressPhase: null,
                  progressDetail: null,
                },
                r,
              ),
            )
          )
            return;
          ne(u.getState(), t) || Ne(t, S);
        } finally {
          (G.current.delete(t), c && y != null && s(Hn(t, r, y)));
        }
      },
      [s, u, oe, Ne, n],
    );
  ge.current = Ue;
  const yn = it({
    projectCount: re.length,
    loadingProjects: gn,
    hubWorkspacesRefreshPending: fn,
    emptyStateSettled: xn,
  });
  return x.jsxs("div", {
    className: "bg-gamecowork-color-surface-primary flex h-full flex-col",
    children: [
      x.jsx(Tn, { title: n("settings.tabs.insightIndex") }),
      x.jsx(In, {
        className: "min-h-0 flex-1",
        children: x.jsxs("div", {
          className: "flex flex-col pb-8",
          children: [
            x.jsx(Dn, { group: bn, isFirst: !0 }),
            x.jsx(ft, {
              title: n("settings.insightIndex.projects"),
              projects: re,
              loading: yn,
              emptyLabel: n("settings.insightIndex.projectsEmpty"),
              loadingLabel: n("common.loading"),
              onToggle: mn,
              onIndex: Ue,
              indexLabel: n("settings.insightIndex.indexAction"),
              indexingLabel: (t) => {
                var o;
                if (
                  t.rebuildDeferred ||
                  zn(t.progressPhase) ||
                  (t.rebuildActive &&
                    !t.rebuildObserveOnly &&
                    !t.rebuildEnsureTriggered &&
                    !t.rebuildSeenBuilding &&
                    (t.indexing || t.indexStatus === "building" || t.indexStatus === "unknown"))
                )
                  return n("settings.insightIndex.indexPhase.waiting", { defaultValue: "Waiting…" });
                const l = rn(t.progressPhase);
                if (l && l !== "sync" && l !== "reconcile") {
                  const r = Jn(l);
                  if (r) return n(`settings.insightIndex.indexPhase.${r}`, { defaultValue: r });
                }
                const d = (o = t.progressPhase) == null ? void 0 : o.trim();
                return d && !Te(d) ? d : n("settings.insightIndex.indexBuilding", { defaultValue: "Indexing…" });
              },
            }),
          ],
        }),
      }),
    ],
  });
}
export {
  Pt as default,
  ot as formatInsightLastIndexedLabel,
  ie as insightIndexBadgeKind,
  lt as paintInsightDisabledStatusFields,
  rt as shouldPollInsightProjectStatus,
  It as shouldShowInsightIndexedBadge,
  at as shouldShowInsightLastIndexed,
  wt as shouldShowInsightLoadingBadge,
  St as shouldShowInsightNotIndexedBadge,
  ln as shouldShowInsightProjectProgress,
  it as shouldShowInsightProjectsLoading,
};
