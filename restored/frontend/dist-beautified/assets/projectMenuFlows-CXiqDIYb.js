import { bj as k, j as s, c as b, C as ye, r as F, bk as Q } from "./registry-CHHSpXp3.js";
import {
  b5 as _,
  s as L,
  bi as ee,
  bj as xe,
  bk as he,
  bl as pe,
  bm as C,
  bn as me,
  bo as g,
  bp as V,
  bq as be,
  br as E,
  bs as R,
  bt as W,
  bu as je,
  bv as $,
  d as j,
  g as w,
  u as te,
  bw as se,
  bx as ge,
  by as we,
  bz as ve,
  bA as I,
  e as re,
  bB as ke,
  o as Ne,
} from "./VscTheme-B-CSeuv5.js";
import { s as Z } from "./store-0rGrUshb.js";
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
      (e._sentryDebugIds[t] = "c44fa2b1-73dd-4389-ac4b-43fbb7e76dc7"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c44fa2b1-73dd-4389-ac4b-43fbb7e76dc7"));
  })();
} catch {}
function P(e) {
  return "GameCowork Bridge";
}
const q = (e) => `连接失败，请安装${e}并且打开Unity编译后重试`,
  Le = /connection closed|timeout|not ready|not valid acp/i;
function N(e) {
  var d;
  if (!e.hub.isHubMode || !e.hub.activeWorkspaceKey) return {};
  const t = e.hub.workspaces.find((a) => a.workspaceKey === e.hub.activeWorkspaceKey);
  return t
    ? {
        workspaceKey: t.workspaceKey,
        workspaceRef: t.isRemote
          ? { runOn: "remote", machineId: (d = t.machineId) != null ? d : "", workspaceDir: t.workspaceDir }
          : { runOn: "local", workspaceDir: t.workspaceDir },
      }
    : {};
}
function Se(e, t) {
  const d = N(e);
  return { ...t, ...d };
}
function ne(e) {
  const t = N(e);
  return t.workspaceRef ? t : void 0;
}
function oe(e) {
  return L(e).isUnityProject;
}
function U(e) {
  return e.hub.isHubMode && !N(e).workspaceRef;
}
function T(e, t) {
  return t ? W({ workspaceKey: t, projectInfo: e }) : W(e);
}
function z(e, t) {
  return t ? R({ workspaceKey: t, loading: e }) : R(e);
}
const Oe = _("unity/checkProjectStatus", async (e, { dispatch: t, extra: d, getState: a }) => {
  var y, m, x;
  const { ideMessenger: o } = d,
    n = a(),
    l = N(n).workspaceKey;
  if (!o) {
    console.warn("IdeMessenger not ready yet, skipping Unity status check");
    return;
  }
  if (U(n)) return;
  t(z(!0, l));
  const f = 20,
    c = 2e3;
  try {
    let i;
    for (let p = 1; p <= f; p++) {
      try {
        i = await o.request("unity/getProjectStatus", ne(a()));
        const u = (i == null ? void 0 : i.status) === "success" ? i.content : void 0,
          h =
            (u == null ? void 0 : u.status) === "error" && Le.test((y = u == null ? void 0 : u.error) != null ? y : "");
        if ((i == null ? void 0 : i.status) === "success" && !h) break;
        const v =
          (x =
            (m = h ? (u == null ? void 0 : u.error) : null) != null
              ? m
              : (i == null ? void 0 : i.status) === "error"
                ? i.error
                : null) != null
            ? x
            : "unknown error";
        if ((i == null ? void 0 : i.status) === "error" && /not a unity project|invalid|permission/i.test(v)) break;
      } catch (u) {
        const h = u instanceof Error ? u.message : String(u);
        if (/not a unity project/i.test(h) || p >= f) throw u;
      }
      p < f && (await new Promise((u) => setTimeout(u, c)));
    }
    if ((i == null ? void 0 : i.status) == "success" && i.content) {
      const p = i.content,
        u = "status" in p ? p.content : p;
      t(T(u || V, l));
    } else t(T(V, l));
  } catch (i) {
    (console.error("Failed to detect Unity project status:", i), t(T(V, l)));
  } finally {
    t(z(!1, l));
  }
});
_("unity/installMcpPackage", async (e, { dispatch: t, extra: d, getState: a }) => {
  const { ideMessenger: o } = d,
    n = a(),
    r = N(n),
    l = L(n),
    f = P(l.engineType);
  if (!o) throw new Error("IdeMessenger not available");
  if (!U(n)) {
    if (be(n)) throw new Error("Unity project info is still loading");
    try {
      const c = await o.request("unity/installMcpPackage", ne(a()));
      if (c.status == "success" && c.content) {
        const y = c.content,
          m = "status" in y ? y.content : y;
        m && t(T(m, r.workspaceKey));
      } else {
        const y = k.t("toast.bridgeInstallFailed", { bridgeName: f });
        throw (E(y), new Error(y));
      }
    } catch (c) {
      console.error(`Failed to install ${f}:`, c);
      const y = c instanceof Error ? c.message : "Unknown error occurred";
      throw (E(k.t("toast.bridgeInstallFailedWithError", { bridgeName: f, error: y })), c);
    }
  }
});
const Te = _("unity/refresh", async (e, { dispatch: t, extra: d, getState: a }) => {
    var m, x, i, p, u, h;
    const { ideMessenger: o } = d,
      n = a(),
      r = N(n),
      l = L(n),
      f = P(l.engineType),
      c = ee(n);
    if (!o) throw new Error("IdeMessenger not available");
    if (U(n)) return;
    if (!oe(n)) {
      t(xe({ workspaceKey: r.workspaceKey }));
      return;
    }
    const y = (m = e == null ? void 0 : e.manual) != null ? m : !1;
    try {
      const v = he(n),
        O = pe(n),
        S = await o.request("unity/refresh", {
          manual: y,
          sessionId: c != null ? c : void 0,
          editorPid: v != null ? v : void 0,
          ...r,
        });
      if (S.status === "success") {
        const M = ((x = S.content) == null ? void 0 : x.status) || "not-connected",
          de = ((i = S.content) == null ? void 0 : i.userStatus) || "should-not-connected",
          B = (p = S.content) == null ? void 0 : p.processStatus,
          D = { status: M, userStatus: de, error: (u = S.content) == null ? void 0 : u.error };
        D.status === "error" && (D.error = q(f));
        const ue = O && M !== "connected" && B !== "dead",
          fe = O && M !== "connected" && B === "dead";
        if (
          (c && !ue && t(C({ sessionId: c, status: D, workspaceKey: r.workspaceKey })),
          fe &&
            (t(me({ launching: !1, workspaceKey: r.workspaceKey })), t(g({ pid: null, workspaceKey: r.workspaceKey }))),
          M === "connected" && !v)
        )
          try {
            const K = await o.request("unity/getEditorPid", { sessionId: c != null ? c : void 0, ...r });
            K.status === "success" &&
              (h = K.content) != null &&
              h.pid &&
              t(g({ pid: K.content.pid, workspaceKey: r.workspaceKey }));
          } catch {}
      }
    } catch (v) {
      throw (console.error("Failed to refresh Unity connection:", v), v);
    }
  }),
  Be = _("unity/getStatus", async (e, { dispatch: t, extra: d, getState: a }) => {
    var y, m, x;
    const { ideMessenger: o } = d,
      n = a(),
      r = N(n),
      l = L(n),
      f = P(l.engineType),
      c = e != null ? e : ee(n);
    if (!o) throw new Error("IdeMessenger not available");
    if (!U(n)) {
      if (!oe(n)) {
        c &&
          t(
            C({
              sessionId: c,
              status: { status: "not-connected", userStatus: "should-not-reconnected" },
              workspaceKey: r.workspaceKey,
            }),
          );
        return;
      }
      try {
        const i = await o.request("unity/getStatus", Se(a(), { sessionId: c }));
        if (i.status === "success") {
          const p = ((y = i.content) == null ? void 0 : y.status) || "not-connected",
            u = ((m = i.content) == null ? void 0 : m.userStatus) || "should-not-connected",
            h = { status: p, userStatus: u, error: (x = i.content) == null ? void 0 : x.error };
          (h.status === "error" && (h.error = q(f)),
            c && t(C({ sessionId: c, status: h, workspaceKey: r.workspaceKey })));
        } else
          c &&
            t(
              C({
                sessionId: c,
                status: { status: "not-connected", userStatus: "should-not-reconnected" },
                workspaceKey: r.workspaceKey,
              }),
            );
      } catch (i) {
        throw (console.error("Failed to get Unity status:", i), i);
      }
    }
  }),
  Re = _("unity/handleStatusUpdate", async (e, { dispatch: t, getState: d }) => {
    var x, i, p, u, h;
    const { sessionId: a, workspaceKey: o, ...n } = e,
      r = d();
    if (r.hub.isHubMode && !o) return;
    const l = o != null ? o : N(r).workspaceKey,
      f = l ? ((i = (x = r.unity.workspaces[l]) == null ? void 0 : x.projectInfo) != null ? i : L(r)) : L(r),
      c = P(f.engineType),
      y = n.status === "error" ? { ...n, error: q(c) } : n;
    ((l
      ? (u = (p = r.unity.workspaces[l]) == null ? void 0 : p.isLaunching) != null && u
      : (h = r.unity.isLaunching) != null && h) &&
      y.status !== "connected") ||
      t(C({ sessionId: a, status: y, workspaceKey: l }));
  });
function H(e) {
  var d, a;
  const t = je();
  return s.jsxs("div", {
    className: "p-4 pt-0",
    children: [
      s.jsx("h1", { className: "mb-1 text-center text-xl", children: (d = e.title) != null ? d : "Confirmation" }),
      s.jsx("p", { className: "text-center text-base", style: { whiteSpace: "pre-wrap" }, children: e.text }),
      s.jsxs("div", {
        className: "w/1/2 flex justify-end gap-2",
        children: [
          !!e.hideCancelButton ||
            s.jsx($, {
              variant: "outline",
              onClick: () => {
                var o;
                (t(j(!1)), t(w(void 0)), (o = e.onCancel) == null || o.call(e));
              },
              "data-focusable": "true",
              children: "Cancel",
            }),
          s.jsx($, {
            onClick: () => {
              (e.onConfirm(), t(j(!1)), t(w(void 0)));
            },
            "data-focusable": "true",
            children: (a = e.confirmText) != null ? a : "Confirm",
          }),
        ],
      }),
    ],
  });
}
function Ce(e) {
  return s.jsxs("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...e,
    children: [
      s.jsxs("g", {
        clipPath: "url(#clip0_7565_376)",
        children: [
          s.jsx("mask", {
            id: "mask0_7565_376",
            style: { maskType: "luminance" },
            maskUnits: "userSpaceOnUse",
            x: "0",
            y: "0",
            width: "14",
            height: "14",
            children: s.jsx("path", { d: "M13.0438 0H0.955078V14H13.0438V0Z", fill: "white" }),
          }),
          s.jsxs("g", {
            mask: "url(#mask0_7565_376)",
            children: [
              s.jsx("path", { d: "M0.955078 8.40015L2.76808 9.44618V11.5408L0.955078 8.40015Z", fill: "currentColor" }),
              s.jsx("path", { d: "M2.76808 11.5408L0.955078 8.40015V10.4938L2.76808 11.5408Z", fill: "currentColor" }),
              s.jsx("path", { d: "M11.2305 11.5381L13.0439 8.39673V10.4909L11.2305 11.5381Z", fill: "currentColor" }),
              s.jsx("path", { d: "M11.2305 9.44419L13.0432 8.39746L11.2305 11.5384V9.44419Z", fill: "currentColor" }),
              s.jsx("path", {
                d: "M3.37623 2.11035L5.79543 3.50662L3.37623 4.90312L0.957031 3.50662L3.37623 2.11035Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M3.375 4.90236L5.7942 3.50586V6.29839L3.375 7.69513V4.90236Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M3.37623 4.90236L0.957031 3.50586V6.29839L3.37623 7.69513V4.90236Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M10.6282 2.11035L13.0474 3.50685L10.6282 4.90312L8.20898 3.50662L10.6282 2.11035Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M10.627 4.90236L13.0462 3.50586V6.29839L10.627 7.69513V4.90236Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M10.6282 4.90236L8.20898 3.50586V6.29839L10.6282 7.69513V4.90236Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M6.99928 8.39673L9.41871 9.79323L6.99951 11.1897L4.58008 9.79323L6.99928 8.39673Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M7 11.1895L9.41943 9.79321V12.5857L7.00023 13.9825L7 11.1895Z",
                fill: "currentColor",
              }),
              s.jsx("path", {
                d: "M6.99928 11.1895L4.58008 9.79321V12.5857L6.99928 13.9825V11.1895Z",
                fill: "currentColor",
              }),
              s.jsx("path", { d: "M7.00073 0.017334L8.81443 1.0643H5.1875L7.00073 0.017334Z", fill: "currentColor" }),
              s.jsx("path", { d: "M7.00027 2.1112L8.81443 1.0647H5.1875L7.00027 2.1112Z", fill: "currentColor" }),
              s.jsx("path", {
                d: "M8.81443 5.94946L7.00097 6.99596L5.1875 5.9497L8.81443 5.94946Z",
                fill: "currentColor",
              }),
              s.jsx("path", { d: "M7 6.99596L8.81347 5.94946L7 9.09036V6.99596Z", fill: "currentColor" }),
              s.jsx("path", { d: "M7.00097 6.99573L5.1875 5.94946L7.00097 9.0899V6.99573Z", fill: "currentColor" }),
            ],
          }),
        ],
      }),
      s.jsx("defs", {
        children: s.jsx("clipPath", {
          id: "clip0_7565_376",
          children: s.jsx("rect", { width: "14", height: "14", fill: "white" }),
        }),
      }),
    ],
  });
}
function Y() {
  return s.jsx("div", {
    className: "flex min-h-16 items-center justify-center gap-2.5 text-sm text-[#8B919C]",
    children: "No data",
  });
}
function G() {
  return s.jsxs("div", {
    className: "flex min-h-16 items-center justify-center gap-2.5 text-sm text-[#8B919C]",
    children: [
      s.jsx("span", {
        className:
          "size-3 shrink-0 animate-spin rounded-full border-2 border-solid border-[#8B919C] border-t-transparent",
        "aria-hidden": !0,
      }),
      s.jsx("span", { children: "Loading..." }),
    ],
  });
}
const J = "cursor-pointer transition-colors rounded-lg group hover:bg-gamecowork-color-accent-subtle",
  Ee = "px-2 py-3 text-left text-2xs font-bold uppercase tracking-wider text-gamecowork-color-text-tertiary",
  _e = "flex bg-gamecowork-color-surface-disabled px-6 border-y border-solid border-gamecowork-color-border-subtle border-x-0";
function ae({
  columns: e,
  data: t,
  loading: d,
  getRowKey: a,
  onRowClick: o,
  selectedKey: n,
  emptyContent: r,
  loadingContent: l,
  className: f,
  headerClassName: c,
  rowClassName: y,
  stickyHeader: m = !1,
  maxHeight: x,
}) {
  return s.jsxs("div", {
    className: b("flex w-full flex-col", f),
    children: [
      s.jsx("div", {
        className: b(_e, m && "sticky top-0 z-10", c),
        children: e.map((i) =>
          s.jsx(
            "div",
            { className: b(Ee, i.headerClassName), style: i.flex ? { flex: i.flex } : void 0, children: i.header },
            i.key,
          ),
        ),
      }),
      m
        ? s.jsx(ye, {
            className: b("flex-none min-h-0 min-w-0", x && "max-h-" + x),
            style: x ? { maxHeight: x } : void 0,
            scrollableNodeProps: { "data-focusable": !0, "data-focus-direction": "vertical" },
            children: s.jsx("div", {
              className: "px-6 py-2 flex flex-col gap-1",
              children: d
                ? l || s.jsx(G, {})
                : t.length === 0
                  ? r || s.jsx(Y, {})
                  : t.map((i) => {
                      const p = a(i),
                        u = n === p;
                      return s.jsx(
                        "div",
                        {
                          className: b("flex", J, u && "bg-gamecowork-color-interactive-selected", y),
                          "data-selected": u,
                          onClick: () => (o == null ? void 0 : o(i)),
                          "data-focus-item": "true",
                          "data-focus-enter-action": "click",
                          role: o ? "button" : void 0,
                          tabIndex: o ? 0 : void 0,
                          children: e.map((h) =>
                            s.jsx(
                              "div",
                              {
                                className: b(
                                  "px-2 py-3 text-xs text-gamecowork-color-text-tertiary flex",
                                  h.className,
                                  h.cellClassName,
                                ),
                                style: h.flex ? { flex: h.flex } : void 0,
                                children: h.render(i, u),
                              },
                              h.key,
                            ),
                          ),
                        },
                        p,
                      );
                    }),
            }),
          })
        : s.jsx("div", {
            className: b("px-6 py-2 flex flex-col gap-1", x && "max-h-" + x),
            style: x ? { maxHeight: x } : void 0,
            "data-focusable": "true",
            "data-focus-direction": "vertical",
            children: d
              ? l || s.jsx(G, {})
              : t.length === 0
                ? r || s.jsx(Y, {})
                : t.map((i) => {
                    const p = a(i),
                      u = n === p;
                    return s.jsx(
                      "div",
                      {
                        className: b("flex", J, u && "bg-gamecowork-color-interactive-selected", y),
                        "data-selected": u,
                        onClick: () => (o == null ? void 0 : o(i)),
                        "data-focus-item": "true",
                        "data-focus-enter-action": "click",
                        role: o ? "button" : void 0,
                        tabIndex: o ? 0 : void 0,
                        children: e.map((h) =>
                          s.jsx(
                            "div",
                            {
                              className: b(
                                "px-2 py-3 text-xs text-gamecowork-color-text-tertiary flex",
                                h.className,
                                h.cellClassName,
                              ),
                              style: h.flex ? { flex: h.flex } : void 0,
                              children: h.render(i, u),
                            },
                            h.key,
                          ),
                        ),
                      },
                      p,
                    );
                  }),
          }),
    ],
  });
}
function Me(e) {
  if (!e) return "Unknown";
  const d = Math.floor(Date.now() / 1e3) - e;
  if (d < 3600 * 24) {
    const o = Math.floor(d / 3600);
    return o <= 0 ? "Modified just now" : `Modified ${o} ${o === 1 ? "hour" : "hours"} ago`;
  }
  const a = Math.floor(d / (3600 * 24));
  return a === 1 ? "Modified Yesterday" : a < 7 ? `Modified ${a} days ago` : "Modified 1 week ago";
}
const Ie = [
  {
    key: "name",
    header: "Project Name",
    flex: "1 1 25%",
    render: (e) =>
      s.jsx("div", {
        className: "flex items-center gap-2",
        children: s.jsxs("div", {
          children: [
            s.jsx("div", {
              className: b("font-semibold text-sm leading-5 text-gamecowork-color-text-default"),
              children: e.name,
            }),
            s.jsx("div", { className: "text-xs text-gamecowork-color-text-tertiary", children: Me(e.lastModifiedTs) }),
          ],
        }),
      }),
  },
  {
    key: "path",
    header: "File Path",
    flex: "1 1 55%",
    cellClassName: "truncate items-center text-gamecowork-color-text-tertiary",
    render: (e) =>
      s.jsx(Q, {
        text: e.path,
        placement: "top",
        children: s.jsx("span", { className: "truncate", children: e.path }),
      }),
  },
  {
    key: "version",
    header: "Editor Version",
    flex: "0 0 120px",
    cellClassName: "justify-start items-center text-gamecowork-color-text-tertiary",
    render: (e) => {
      var t;
      return s.jsx("span", {
        className: b("inline-block py-0.5 px-0 rounded-[0.25rem]"),
        children: (t = e.editorVersion) != null ? t : "-",
      });
    },
  },
];
function Pe({ projects: e, onSelect: t, onClose: d, isLoading: a = !1 }) {
  const o = te(),
    [n, r] = F.useState(null),
    [l, f] = F.useState("tuanjie"),
    c = e.filter((x) => x.type === l),
    y = async () => {
      n && (await t(n), o(j(!1)), o(w(void 0)));
    },
    m = () => {
      (d(), o(j(!1)), o(w(void 0)));
    };
  return s.jsx(se, {
    icon: s.jsx(we, { className: "size-5" }),
    onCancel: m,
    onConfirm: y,
    confirmDisabled: !n,
    confirmText: "Open",
    cancelButtonClassName: "bg-transparent hover:bg-transparent text-gamecowork-color-text-tertiary",
    children: s.jsxs("div", {
      className: "w-full min-h-[22.5rem] flex-col",
      children: [
        s.jsxs("div", {
          className: "p-8 pb-6",
          children: [
            s.jsx("h3", {
              className: "text-2xl font-bold text-gamecowork-color-text-default m-0 mb-1",
              children: "Project",
            }),
            s.jsx("p", {
              className: "mt-1 text-sm leading-5 text-gamecowork-color-text-disabled mb-6",
              children: "Select a project to open",
            }),
            s.jsxs("div", {
              className: "flex rounded-lg w-fit bg-gamecowork-color-surface-base",
              children: [
                s.jsxs("button", {
                  className: b(
                    "flex items-center gap-1 px-4 h-7 rounded-md text-sm font-medium transition-all border-none cursor-pointer",
                    l === "tuanjie"
                      ? "bg-gamecowork-color-text-default text-gamecowork-color-surface-card"
                      : "bg-transparent text-gamecowork-color-text-secondary",
                  ),
                  onClick: () => {
                    (f("tuanjie"), r(null));
                  },
                  children: [s.jsx(Ce, { className: "size-4 shrink-0" }), "Tuanjie"],
                }),
                s.jsxs("button", {
                  className: b(
                    "flex items-center gap-1 px-4 h-7 rounded-md text-sm font-medium transition-all border-none cursor-pointer",
                    l === "unity"
                      ? "bg-gamecowork-color-text-default text-gamecowork-color-surface-card"
                      : "bg-transparent text-gamecowork-color-text-secondary",
                  ),
                  onClick: () => {
                    (f("unity"), r(null));
                  },
                  children: [s.jsx(ge, { className: "size-4 shrink-0" }), "Unity"],
                }),
              ],
            }),
          ],
        }),
        s.jsx("div", {
          className: "flex-1 pb-4",
          children: s.jsx(ae, {
            columns: Ie,
            data: c,
            rowClassName:
              "hover:bg-gamecowork-color-interactive-hover data-[selected=true]:bg-gamecowork-color-interactive-pressed",
            loading: a,
            getRowKey: (x) => x.path,
            onRowClick: r,
            selectedKey: n == null ? void 0 : n.path,
            stickyHeader: !0,
            maxHeight: "360px",
          }),
        }),
      ],
    }),
  });
}
const Ue = [
  {
    key: "version",
    header: "Editor Version",
    flex: "0 0 200px",
    render: (e) => {
      const t = !!e.tuanjie_editor_version,
        d = t ? e.tuanjie_editor_version : e.version;
      return s.jsxs("div", {
        className: "flex flex-col",
        children: [
          s.jsx("span", { className: "font-semibold text-sm leading-5 text-gamecowork-color-text-default", children: d }),
          t &&
            e.tuanjie_editor_version !== e.version &&
            s.jsx("span", { className: "text-xs text-gamecowork-color-text-tertiary", children: e.version }),
        ],
      });
    },
  },
  {
    key: "path",
    header: "Install Path",
    flex: "1 1 auto",
    cellClassName: "truncate items-center text-gamecowork-color-text-tertiary",
    render: (e) =>
      s.jsx(Q, {
        text: e.path,
        placement: "top",
        children: s.jsx("span", { className: "truncate", children: e.path }),
      }),
  },
];
function De({ editors: e, requestedVersion: t, onSelect: d, onClose: a }) {
  const o = te(),
    [n, r] = F.useState(null),
    l = async () => {
      n && (await d(n), o(j(!1)), o(w(void 0)));
    },
    f = () => {
      (a(), o(j(!1)), o(w(void 0)));
    };
  return s.jsx(se, {
    icon: s.jsx(ve, { className: "size-5" }),
    onCancel: f,
    onConfirm: l,
    confirmDisabled: !n,
    confirmText: "Open",
    cancelButtonClassName: "bg-transparent hover:bg-transparent text-gamecowork-color-text-tertiary",
    children: s.jsxs("div", {
      className: "w-full min-h-[20rem] flex-col",
      children: [
        s.jsxs("div", {
          className: "p-8 pb-6",
          children: [
            s.jsx("h3", {
              className: "text-2xl font-bold text-gamecowork-color-text-default m-0 mb-1",
              children: "Select Editor Version",
            }),
            s.jsx("p", {
              className: "mt-1 text-sm leading-5 text-gamecowork-color-text-disabled mb-2",
              children: t
                ? `Editor ${t} is not installed. Choose an installed editor to open this project.`
                : "Choose an installed editor to open this project.",
            }),
          ],
        }),
        s.jsx("div", {
          className: b("flex-1 pb-4"),
          children: s.jsx(ae, {
            columns: Ue,
            data: e,
            rowClassName:
              "hover:bg-gamecowork-color-interactive-hover data-[selected=true]:bg-gamecowork-color-interactive-pressed",
            getRowKey: (c) => `${c.version}\0${c.path}`,
            onRowClick: r,
            selectedKey: n ? `${n.version}\0${n.path}` : void 0,
            stickyHeader: !0,
            maxHeight: "320px",
          }),
        }),
      ],
    }),
  });
}
function ie() {
  const e = Z.getState().tabs.tabs[0];
  e && Z.dispatch(Ne(e.id));
}
async function ce(e, t, d, a) {
  var r, l;
  const o = typeof t == "string" ? t : t.path,
    n = d != null ? d : typeof t == "string" ? void 0 : t.type;
  try {
    const f = await e.request("initWorkspace", { path: o, ...(n !== void 0 && { projectType: n }) });
    if (f && f.status === "error") {
      (console.error("Failed to open project:", f.error),
        typeof f.error == "string" && f.error.startsWith("path_not_found:")
          ? (E(k.t("history.folderNotFound", { path: o })),
            (r = a == null ? void 0 : a.onRefreshRecent) == null || r.call(a))
          : f.error === "already_open" && I(k.t("history.projectAlreadyOpen", { path: o })));
      return;
    }
    (ie(), (l = a == null ? void 0 : a.onDone) == null || l.call(a));
  } catch (f) {
    console.error("Failed to open project:", f);
  }
}
async function Ke(e, t, d) {
  try {
    const a = await e.request("tauri/newWindow", void 0);
    (a == null ? void 0 : a.status) === "error" &&
      a != null &&
      a.error &&
      (t(
        w(
          s.jsx(H, {
            title: "New Window",
            text: a.error,
            confirmText: "OK",
            hideCancelButton: !0,
            onConfirm: () => {},
          }),
        ),
      ),
      t(j(!0)));
  } catch (a) {
    const o = a instanceof Error ? a.message : "Failed to open new window.";
    (t(w(s.jsx(H, { title: "New Window", text: o, confirmText: "OK", hideCancelButton: !0, onConfirm: () => {} }))),
      t(j(!0)));
  } finally {
  }
}
let A = !1;
async function X(e) {
  var t;
  try {
    const d = await e.request("unity/getEditorPid", {});
    if (d.status === "success" && (t = d.content) != null && t.pid) return d.content.pid;
  } catch {}
  return null;
}
async function le(e, t, d, a, o) {
  if (A) {
    I(k.t("sidebar.editorOpening"));
    return;
  }
  A = !0;
  const n = Z.getState().hub.activeWorkspaceKey;
  try {
    let r;
    if (a) r = await a(d);
    else {
      const l = await e.request("unity/openEditor", { ...(d ? { version: d } : {}), ...(o ? { editorPid: o } : {}) });
      if (l.status !== "success") {
        (console.warn("[openUnityEditorFlow] request failed", l), t(g({ pid: null, workspaceKey: n })));
        return;
      }
      r = l.content;
    }
    if (r != null && r.alreadyOpen) {
      if (r.pid) t(g({ pid: r.pid, workspaceKey: n }));
      else {
        const l = await X(e);
        t(g({ pid: l, workspaceKey: n }));
      }
      t(Te({ manual: !0 }));
      return;
    }
    if (r != null && r.success) {
      (r.pid
        ? t(g({ pid: r.pid, workspaceKey: n }))
        : setTimeout(async () => {
            const l = await X(e);
            t(g({ pid: l, workspaceKey: n }));
          }, 3e3),
        I(k.t("sidebar.editorLaunching")));
      return;
    }
    if (r != null && r.needsSelection && Array.isArray(r.availableEditors)) {
      const l = r.availableEditors;
      if (l.length === 0) {
        (r.hubInstalled
          ? e.request("tauri/openHub", void 0)
          : E(
              r.requestedVersion
                ? k.t("sidebar.editorVersionNotInstalled", { version: r.requestedVersion })
                : k.t("sidebar.noEditorAvailable"),
            ),
          t(g({ pid: null, workspaceKey: n })));
        return;
      }
      (t(
        re({
          message: s.jsx(De, {
            editors: l,
            requestedVersion: r.requestedVersion,
            onSelect: (f) => le(e, t, f.version, a),
            onClose: () => {
              (t(j(!1)), t(w(void 0)));
            },
          }),
          size: "lg",
        }),
      ),
        t(j(!0)));
      return;
    }
    (r && !r.success && console.warn("[openUnityEditorFlow] open failed", r.message),
      t(g({ pid: null, workspaceKey: n })));
  } catch (r) {
    (t(g({ pid: null, workspaceKey: n })), console.warn("[openUnityEditorFlow] failed", r));
  } finally {
    A = !1;
  }
}
async function Ve(e, t, d) {
  const a = async (n, r) => {
      await ce(e, n, r, { onDone: d == null ? void 0 : d.onAfterProjectSelected });
    },
    o = (n, r) => {
      t(
        re({
          message: s.jsx(Pe, {
            projects: n,
            isLoading: r,
            onSelect: a,
            onClose: () => {
              (t(j(!1)), t(w(void 0)));
            },
          }),
          size: "lg",
        }),
      );
    };
  (o([], !0), t(j(!0)));
  try {
    const n = await e.request("unity/getHubProjectsAndEditors", void 0);
    if (n && n.status === "success" && Array.isArray(n.content)) {
      const r = [];
      (n.content.forEach((l) => {
        const f = l.product === "tuanjie" ? "tuanjie" : "unity";
        l.projects &&
          Array.isArray(l.projects) &&
          l.projects.forEach((c) => {
            var i;
            const m =
              String((i = c.path) != null ? i : "")
                .split(/[/\\]/)
                .filter(Boolean)
                .pop() || c.path;
            let x = "Unknown";
            (c.last_modified_display
              ? (x = `Last open: ${c.last_modified_display}`)
              : c.last_modified && (x = `Last open: ${new Date(c.last_modified * 1e3).toLocaleDateString()}`),
              r.push({
                path: c.path,
                name: m,
                type: f,
                editorVersion: c.editor_version,
                lastModified: x,
                lastModifiedTs: c.last_modified,
              }));
          });
      }),
        o(
          r.sort((l, f) => {
            var c, y;
            return ((c = f.lastModifiedTs) != null ? c : 0) - ((y = l.lastModifiedTs) != null ? y : 0);
          }),
          !1,
        ));
      return;
    }
    o([], !1);
  } catch (n) {
    (console.error("Failed to load game projects:", n), o([], !1));
  }
}
function Ae(e, t) {
  e === "error" ? E(t) : e === "warning" ? ke(t) : I(t);
}
const We = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      newWindowFlow: Ke,
      openGameProjectFlow: Ve,
      openUnityEditorFlow: le,
      selectGameProjectFlow: ce,
      showProjectMenuToast: Ae,
      switchToChatTab: ie,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
export {
  H as C,
  ce as a,
  le as b,
  Oe as c,
  ie as d,
  Be as e,
  P as g,
  Re as h,
  Ke as n,
  Ve as o,
  We as p,
  Te as r,
  Ae as s,
};
