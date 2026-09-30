const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/event-CswyesJe.js", "assets/core-BtpCLyE5.js", "assets/webview-Bmc8EURe.js"]),
) => i.map((i) => d[i]);
import {
  bj as B,
  r as i,
  aK as l1,
  c as u,
  j as e,
  u as e1,
  bf as Y1,
  bw as J1,
  bx as Q1,
  by as e2,
  bz as t2,
  bA as C2,
  bB as n2,
  bC as r2,
  bD as o2,
  bE as s2,
  bF as _,
  bG as m1,
  bH as i2,
  bI as a2,
  bq as l2,
  br as c2,
} from "./registry-BL-NPVNy.js";
/* empty css                 */ (function () {
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
      n = new t.Error().stack;
    n &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[n] = "0798d337-8ff4-42db-af60-85a0d5978f3c"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-0798d337-8ff4-42db-af60-85a0d5978f3c"));
  })();
} catch {}
async function h(t, n) {
  return fetch(`${window.location.origin}/api/tauri/invoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: { messageType: t, messageId: `${t}:${Date.now()}`, data: n != null ? n : {} } }),
  });
}
const v1 = new Map();
function T1(t) {
  const n = `${B.language}:${t}`;
  let s = v1.get(n);
  if (s === void 0) {
    const c = B.t(`petMessages.${t}`, { returnObjects: !0 });
    ((s = Array.isArray(c) ? c.length : 0), v1.set(n, s));
  }
  return s;
}
function A(t, n) {
  const s = T1(t);
  if (s === 0) return "";
  const c = Math.floor(Math.random() * s);
  return B.t(`petMessages.${t}.${c}`, n);
}
function u2(t) {
  if (!t) return "";
  const n = t.replace(/\\/g, "/").replace(/\/$/, "").split("/");
  return n.length <= 1 ? t : n[n.length - 1].length > 3 ? n[n.length - 1] : n.slice(-2).join("/");
}
function y1(t) {
  const { state: n, tool: s, detail: c, event: a } = t;
  return n === "review"
    ? c
      ? A("states.reviewDone", { detail: c })
      : A("states.review")
    : n === "idle" && !s
      ? ""
      : a === "SubagentStart" && c
        ? A("events.subagentStart", { detail: c })
        : a === "FileChanged" && c
          ? A("events.fileChanged", { path: u2(c) })
          : n === "running" && s
            ? A(`tools.${s}`, { detail: c || "" }) || A("runningDefault")
            : n === "running"
              ? A("runningDefault")
              : T1(`states.${n}`) > 0
                ? A(`states.${n}`)
                : "";
}
function b1(t, n) {
  const s = B.t(`settings.pets.${n}.${t}`, { returnObjects: !0, defaultValue: "" });
  if (Array.isArray(s)) {
    const c = s.length;
    if (c === 0) return "";
    const a = Math.floor(Math.random() * c);
    return B.t(`settings.pets.${n}.${t}.${a}`, { defaultValue: "" });
  }
  return typeof s == "string" ? s : "";
}
const j1 = 6;
function A1() {
  const t = i.useRef({ down: !1, dragging: !1, x: 0, y: 0 });
  return {
    onPointerDown(n) {
      t.current = { down: !0, dragging: !1, x: n.clientX, y: n.clientY };
    },
    onPointerMove(n) {
      const s = t.current;
      if (!s.down || s.dragging) return;
      const c = n.clientX - s.x,
        a = n.clientY - s.y;
      c * c + a * a < j1 * j1 || ((s.dragging = !0), h("pet/drag"));
    },
    onPointerUp() {
      t.current.down = !1;
    },
    isDragging() {
      return t.current.dragging;
    },
  };
}
const D1 = "gamecowork-theme",
  d2 = "gamecowork-language",
  f2 = "changeThemeMode";
function L1(t) {
  return t === "light" || t === "dark";
}
function p2(t) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(D1, JSON.stringify(t));
  } catch {}
}
function t1(t) {
  const n = i.useRef(t);
  ((n.current = t),
    i.useEffect(() => {
      let s;
      l1(
        async () => {
          const { listen: a } = await import("./event-CswyesJe.js");
          return { listen: a };
        },
        __vite__mapDeps([0, 1]),
      )
        .then(({ listen: a }) => {
          a(f2, (w) => {
            var d;
            L1(w.payload) && (p2(w.payload), (d = n.current) == null || d.call(n, w.payload));
          }).then((w) => {
            s = w;
          });
        })
        .catch(() => {});
      const c = (a) => {
        var w;
        if (a.key === D1 && a.newValue)
          try {
            const d = JSON.parse(a.newValue);
            L1(d) && (document.documentElement.setAttribute("data-theme", d), (w = n.current) == null || w.call(n, d));
          } catch {}
        a.key === d2 && (a.newValue === "en" || a.newValue === "zh") && B.changeLanguage(a.newValue);
      };
      return (
        window.addEventListener("storage", c),
        () => {
          (s == null || s(), window.removeEventListener("storage", c));
        }
      );
    }, []));
}
function F(t) {
  const n = i.useRef(t);
  ((n.current = t),
    i.useEffect(() => {
      let s,
        c = !1;
      return (
        l1(
          async () => {
            const { listen: a } = await import("./event-CswyesJe.js");
            return { listen: a };
          },
          __vite__mapDeps([0, 1]),
        )
          .then(({ listen: a }) =>
            a("pet-bus", (w) => {
              n.current(w.payload);
            }),
          )
          .then((a) => {
            c ? a() : (s = a);
          })
          .catch(() => {}),
        () => {
          ((c = !0), s == null || s());
        }
      );
    }, []));
}
const h2 = 5e3,
  M1 = '16px "Ark Pixel"',
  S1 = 280,
  x2 = 12,
  V1 = u(
    "leading-3 p-2 mr-px border border-solid border-gamecowork-color-border-strong",
    "bg-gamecowork-color-surface-input [font-family:'Ark_Pixel'] select-none",
    "text-gamecowork-color-text-tertiary text-sm",
  );
function w2() {
  const [t, n] = i.useState(""),
    [s, c] = i.useState(null),
    a = i.useRef(null),
    w = i.useRef(""),
    d = i.useRef(!1),
    g = i.useRef(!1),
    y = i.useRef(!1),
    j = i.useRef(0),
    L = i.useRef(null),
    Z = i.useRef(null),
    H = i.useCallback(async (x, b = !1) => {
      if (d.current) return;
      const E = ++j.current;
      try {
        await document.fonts.load(M1);
      } catch {}
      E === j.current &&
        (n(x),
        (g.current = !0),
        L.current && clearTimeout(L.current),
        (L.current = b
          ? null
          : setTimeout(() => {
              ((g.current = !1), (y.current = !1), j.current++, h("pet/hideBubble"));
            }, h2)));
    }, []),
    R = i.useCallback(() => {
      (j.current++,
        L.current && (clearTimeout(L.current), (L.current = null)),
        g.current && ((g.current = !1), (y.current = !1), h("pet/hideBubble")),
        n(""));
    }, []),
    p = i.useCallback(
      (x) => {
        const b = b1(x, "sayhello");
        b && H(b);
      },
      [H],
    ),
    S = i.useCallback(
      (x) => {
        const b = b1(x, "saybye");
        b && H(b);
      },
      [H],
    ),
    M = (x) => {
      ((a.current = x), c(x));
    },
    V = A1(),
    I = () => {
      if (V.isDragging()) return;
      const x = a.current;
      x && (M(null), (w.current = ""), h("pet/openSession", { sessionId: x }), R());
    };
  return (
    i.useLayoutEffect(() => {
      if (!t) return;
      const x = Z.current;
      if (!x) return;
      const b = Math.ceil(x.offsetWidth) + x2,
        E = Math.ceil(x.offsetHeight);
      (h("pet/resizeBubble", { width: b, height: E }), y.current || ((y.current = !0), h("pet/showBubble")));
    }, [t]),
    i.useEffect(
      () => () => {
        L.current && clearTimeout(L.current);
      },
      [],
    ),
    i.useEffect(() => {
      document.fonts.load(M1).catch(() => {});
    }, []),
    F((x) => {
      if (x.type === "stateUpdate") {
        const b = x;
        if (b.state === "waiting") {
          M(b.session || null);
          const N = y1(b);
          N && ((w.current = N), H(N, !0));
          return;
        }
        if (a.current) {
          (M(null), (w.current = ""), R());
          return;
        }
        const E = y1(b);
        E && H(E);
      } else
        x.type === "inputShown"
          ? ((d.current = !0), R())
          : x.type === "inputHidden"
            ? ((d.current = !1), a.current && w.current && H(w.current, !0))
            : x.type === "bubbleShow"
              ? g.current || H("👋")
              : x.type === "petGreet"
                ? typeof x.petId == "string" && p(x.petId)
                : x.type === "petBye" && typeof x.petId == "string" && S(x.petId);
    }),
    i.useEffect(() => {
      h("pet/getGreet")
        .then(async (x) => {
          var N, $;
          const b = await x.json(),
            E = ($ = (N = b == null ? void 0 : b.data) == null ? void 0 : N.content) == null ? void 0 : $.petId;
          typeof E == "string" && p(E);
        })
        .catch(() => {});
    }, [p]),
    t1(),
    e.jsxs("div", {
      className: u("flex flex-col justify-end items-end h-full"),
      children: [
        e.jsx("div", {
          ref: Z,
          "aria-hidden": !0,
          className: V1,
          style: { maxWidth: S1, width: "max-content", position: "fixed", left: -1e4, top: 0, visibility: "hidden" },
          children: t,
        }),
        e.jsx("div", {
          onClick: I,
          onPointerDown: V.onPointerDown,
          onPointerMove: V.onPointerMove,
          onPointerUp: V.onPointerUp,
          className: u(V1, s && "cursor-pointer"),
          style: { maxWidth: S1 },
          children: t,
        }),
      ],
    })
  );
}
function g2(t) {
  return e.jsx("svg", {
    width: "23",
    height: "23",
    viewBox: "0 0 23 23",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      d: "M6.00283 17.4794L4.79736 16.2507L9.8974 11.1275L4.79736 6.00428L6.00283 4.77563L11.126 9.89885L16.2493 4.77563L17.4547 6.00428L12.3547 11.1275L17.4547 16.2507L16.2493 17.4794L11.126 12.3561L6.00283 17.4794Z",
      fill: "currentColor",
    }),
  });
}
function m2() {
  const { t } = e1(),
    [n, s] = i.useState(null),
    [c, a] = i.useState(!1);
  if (
    (F((d) => {
      d.type === "filePreviewShow"
        ? (s({
            path: typeof d.path == "string" ? d.path : "",
            kind: d.kind === "video" ? "video" : "image",
            name: typeof d.name == "string" ? d.name : "",
          }),
          a(!1))
        : d.type === "filePreviewHide" && s(null);
    }),
    i.useEffect(() => {
      const d = (g) => {
        g.key === "Escape" && h("pet/hideFilePreview");
      };
      return (window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d));
    }, []),
    !n)
  )
    return null;
  const w = `${window.location.origin}/api/tauri/file-preview-media?path=${encodeURIComponent(n.path)}`;
  return e.jsxs("div", {
    className: "flex h-screen w-screen select-none flex-col bg-black",
    children: [
      e.jsxs("div", {
        className: "flex h-10 shrink-0 items-center justify-between px-4",
        children: [
          e.jsx("span", { className: "truncate text-white/80", title: n.name, children: n.name }),
          e.jsx(Y1, {
            size: "md",
            onClick: () => void h("pet/hideFilePreview"),
            className: "shrink-0 text-white/80 hover:bg-white/10 hover:text-white",
            children: e.jsx(g2, { className: "size-6" }),
          }),
        ],
      }),
      e.jsx("div", {
        className: "flex min-h-0 flex-1 items-center justify-center p-4",
        children: c
          ? e.jsx("span", { className: "text-sm text-white/60", children: t("petFilePreview.unsupported") })
          : n.kind === "video"
            ? e.jsx(
                "video",
                { src: w, controls: !0, autoPlay: !0, onError: () => a(!0), className: "max-h-full max-w-full" },
                n.path,
              )
            : e.jsx(
                "img",
                { src: w, alt: n.name, onError: () => a(!0), className: "max-h-full max-w-full object-contain" },
                n.path,
              ),
      }),
    ],
  });
}
function _1(t) {
  var s;
  if (!t) return "";
  const n = t.replace(/\\/g, "/").split("/").filter(Boolean);
  return (s = n[n.length - 1]) != null ? s : "";
}
function v2(t) {
  return e.jsxs("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", { d: "M9.04167 0.875H10.2083V2.04167H9.04167V0.875Z", fill: "currentColor", fillOpacity: "0.45" }),
      e.jsx("path", { d: "M7.875 3.20833V2.04167H9.04167V3.20833H7.875Z", fill: "currentColor", fillOpacity: "0.45" }),
      e.jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7.875 4.375V3.20833H6.70833V4.375H5.54167V5.54167H4.375V6.70833H3.20833V7.875H2.04167V9.04167H0.875L0.875 12.5417H4.375V11.375H5.54167V10.2083H6.70833V9.04167H7.875V7.875H9.04167V6.70833H10.2083V5.54167H11.375V4.375H12.5417V3.20833H11.375V2.04167H10.2083V3.20833H11.375V4.375H10.2083V5.54167H9.04167V4.375H7.875ZM7.875 4.375V5.54167H9.04167V6.70833H7.875V7.875H6.70833V9.04167H5.54167V10.2083H4.375V11.375H3.20833V10.2083H2.04167V9.04167H3.20833V7.875H4.375V6.70833H5.54167V5.54167H6.70833V4.375H7.875Z",
        fill: "currentColor",
        fillOpacity: "0.45",
      }),
    ],
  });
}
function y2(t) {
  return e.jsxs("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M6.41797 2.91667V1.75H7.58464V2.91667H8.7513V4.08333H7.58464V12.25H6.41797V4.08333H5.2513V2.91667H6.41797Z",
        fill: "currentColor",
      }),
      e.jsx("path", { d: "M4.08464 5.25V4.08333H5.2513V5.25H4.08464Z", fill: "currentColor" }),
      e.jsx("path", { d: "M4.08464 5.25V6.41667H2.91797V5.25H4.08464Z", fill: "currentColor" }),
      e.jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M9.91797 5.25V4.08333H8.7513V5.25H9.91797ZM9.91797 5.25H11.0846V6.41667H9.91797V5.25Z",
        fill: "currentColor",
      }),
    ],
  });
}
function b2(t) {
  return e.jsx("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      d: "M6.41667 12.25H7.58333L7.58333 7.58333L12.25 7.58333V6.41667L7.58333 6.41667L7.58333 1.75L6.41667 1.75L6.41667 6.41667L1.75 6.41667L1.75 7.58333L6.41667 7.58333L6.41667 12.25Z",
      fill: "currentColor",
      fillOpacity: "0.45",
    }),
  });
}
function j2(t) {
  return e.jsxs("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M3.5 1.75H8.16667L11.0833 4.66667V12.25H3.5V1.75Z",
        stroke: "currentColor",
        strokeOpacity: "0.45",
        strokeWidth: "1.16667",
        strokeLinejoin: "round",
      }),
      e.jsx("path", {
        d: "M8.16667 1.75V4.66667H11.0833",
        stroke: "currentColor",
        strokeOpacity: "0.45",
        strokeWidth: "1.16667",
        strokeLinejoin: "round",
      }),
    ],
  });
}
function L2(t) {
  return e.jsx("svg", {
    width: "7",
    height: "9",
    viewBox: "0 0 7 9",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 0V8.16667H2.33333V7H4.08333V5.83333H5.83333V4.66667H7V3.5H5.83333V2.33333H4.08333V1.16667H2.33333V0H0ZM2.33333 1.16667V2.33333H4.08333V3.5H5.83333V4.66667H4.08333V5.83333H2.33333V7H1.16667V1.16667H2.33333Z",
      fill: "white",
      fillOpacity: "0.93",
    }),
  });
}
function H1(t) {
  return e.jsx("svg", {
    width: "10",
    height: "14",
    viewBox: "0 0 10 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      d: "M6.41699 9.91626H5.25V8.75024H6.41699V9.91626ZM7.58301 8.75024H6.41699V7.58325H7.58301V8.75024ZM8.75 7.58325H7.58301V6.41626H8.75V7.58325ZM7.58301 6.41626H6.41699V5.25024H7.58301V6.41626ZM6.41699 5.25024H5.25V4.08325H6.41699V5.25024Z",
      fill: "currentColor",
    }),
  });
}
function M2(t) {
  return e.jsxs("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M3.40234 8.26395H4.37457L4.37457 7.29172L5.34679 7.29172L5.34679 6.3195L6.31901 6.3195V7.29172H7.29123L7.29123 8.26395H8.26346V7.29172L7.29123 7.29172V6.3195H6.31901L6.31901 5.34728L5.34679 5.34728V4.37506L4.37457 4.37506L4.37457 3.40284L3.40234 3.40283L3.40234 4.37506L4.37457 4.37506L4.37457 5.34728L5.34679 5.34728L5.34679 6.3195H4.37457L4.37457 7.29172H3.40234L3.40234 8.26395Z",
        fill: "currentColor",
      }),
      e.jsx("path", { d: "M8.26346 4.37505L7.29123 4.37505V3.40283L8.26346 3.40283V4.37505Z", fill: "currentColor" }),
      e.jsx("path", { d: "M7.29123 4.37505L6.31901 4.37505V5.34728L7.29123 5.34728V4.37505Z", fill: "currentColor" }),
    ],
  });
}
function S2(t) {
  return e.jsxs("svg", {
    width: "12",
    height: "13",
    viewBox: "0 0 12 13",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("mask", {
        id: "mask0_10063_28871",
        style: { maskType: "luminance" },
        maskUnits: "userSpaceOnUse",
        x: "0",
        y: "0",
        width: "12",
        height: "13",
        children: e.jsx("path", { d: "M11.2 0H0V12.9707H11.2V0Z", fill: "currentColor" }),
      }),
      e.jsxs("g", {
        mask: "url(#mask0_10063_28871)",
        children: [
          e.jsx("path", { d: "M0 7.78235L1.67971 8.75148V10.6921L0 7.78235Z", fill: "currentColor" }),
          e.jsx("path", { d: "M1.67971 10.6921L0 7.78235V9.72212L1.67971 10.6921Z", fill: "currentColor" }),
          e.jsx("path", { d: "M9.51953 10.6897L11.1997 7.7793V9.7195L9.51953 10.6897Z", fill: "currentColor" }),
          e.jsx("path", { d: "M9.51953 8.74956L11.199 7.77979L9.51953 10.6898V8.74956Z", fill: "currentColor" }),
          e.jsx("path", {
            d: "M2.24134 1.95508L4.48268 3.24869L2.24134 4.54252L0 3.24869L2.24134 1.95508Z",
            fill: "currentColor",
          }),
          e.jsx("path", {
            d: "M2.24219 4.54188L4.48353 3.24805V5.83527L2.24219 7.12932V4.54188Z",
            fill: "currentColor",
          }),
          e.jsx("path", { d: "M2.24134 4.54188L0 3.24805V5.83527L2.24134 7.12932V4.54188Z", fill: "currentColor" }),
          e.jsx("path", {
            d: "M8.96009 1.95508L11.2014 3.24891L8.96009 4.54252L6.71875 3.24869L8.96009 1.95508Z",
            fill: "currentColor",
          }),
          e.jsx("path", {
            d: "M8.96094 4.54188L11.2023 3.24805V5.83527L8.96094 7.12932V4.54188Z",
            fill: "currentColor",
          }),
          e.jsx("path", {
            d: "M8.96009 4.54188L6.71875 3.24805V5.83527L8.96009 7.12932V4.54188Z",
            fill: "currentColor",
          }),
          e.jsx("path", {
            d: "M5.60072 7.7793L7.84227 9.07313L5.60093 10.367L3.35938 9.07313L5.60072 7.7793Z",
            fill: "currentColor",
          }),
          e.jsx("path", {
            d: "M5.60156 10.3666L7.84312 9.073V11.6602L5.60178 12.9543L5.60156 10.3666Z",
            fill: "currentColor",
          }),
          e.jsx("path", { d: "M5.60071 10.3666L3.35938 9.073V11.6602L5.60071 12.9543V10.3666Z", fill: "currentColor" }),
          e.jsx("path", { d: "M5.6018 0.0158691L7.28216 0.985862H3.92188L5.6018 0.0158691Z", fill: "currentColor" }),
          e.jsx("path", { d: "M5.60137 1.95589L7.28216 0.986328H3.92188L5.60137 1.95589Z", fill: "currentColor" }),
          e.jsx("path", {
            d: "M7.28215 5.51184L5.60201 6.4814L3.92188 5.51206L7.28215 5.51184Z",
            fill: "currentColor",
          }),
          e.jsx("path", { d: "M5.60156 6.4814L7.2817 5.51184L5.60156 8.42182V6.4814Z", fill: "currentColor" }),
          e.jsx("path", { d: "M5.60201 6.48119L3.92188 5.51184L5.60201 8.42139V6.48119Z", fill: "currentColor" }),
        ],
      }),
    ],
  });
}
function V2(t) {
  return e.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13.3346 3.33333V2H2.66797V3.33333L4.0013 3.33333V6H5.33464L5.33464 7.33333H6.66797V8.66667H5.33464V10H4.0013V12.6667L2.66797 12.6667V14H13.3346V12.6667H12.0013V10H10.668V8.66667H9.33464V7.33333H10.668V6H12.0013V3.33333L13.3346 3.33333ZM10.668 6H9.33464V7.33333H6.66797V6H5.33464L5.33464 3.33333L10.668 3.33333V6ZM10.668 12.6667V10H9.33464V8.66667H6.66797V10H5.33464L5.33464 12.6667H10.668Z",
      fill: "currentColor",
    }),
  });
}
function E1(t) {
  return Array.isArray(t)
    ? t
        .filter((n) => n && typeof n.text == "string" && typeof n.color == "string")
        .map((n) => ({ id: typeof n.id == "string" && n.id ? n.id : n.text, text: n.text, color: n.color }))
    : [];
}
function I1(t) {
  const n = _1(t),
    s = n.lastIndexOf(".");
  return s < 0 ? "" : n.slice(s + 1).toLowerCase();
}
const H2 = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]),
  E2 = new Set(["mp4", "webm", "mov", "mkv"]),
  R1 = new Set(["feedback", "bug"]);
function P1(t) {
  return `${window.location.origin}/api/tauri/file-preview-media?path=${encodeURIComponent(t)}`;
}
const I2 = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/bmp": ".bmp",
  "image/svg+xml": ".svg",
  "text/plain": ".txt",
  "application/pdf": ".pdf",
};
function R2(t) {
  return new Promise((n, s) => {
    const c = new FileReader();
    ((c.onload = () => n(c.result)), (c.onerror = () => s(c.error)), c.readAsDataURL(t));
  });
}
function P2(t) {
  var s;
  if (t.name && t.name.trim()) return t.name.trim();
  const n = (s = I2[t.type.toLowerCase()]) != null ? s : "";
  return `pasted-${Date.now()}${n}`;
}
const N2 = {
  "No active session available": "petInput.errorNoSession",
  "Attachments are not supported on remote workspaces": "petInput.errorRemoteAttachments",
  "Remote workspace is offline or unreachable": "petInput.errorRemoteOffline",
};
function N1(t) {
  return Array.isArray(t)
    ? t
        .filter((n) => !!n && typeof n.id == "string" && typeof n.text == "string")
        .map((n) => ({
          id: n.id,
          text: n.text,
          attachments: Array.isArray(n.attachments) ? n.attachments.filter((s) => typeof s == "string") : [],
        }))
    : [];
}
const k2 = J1.create({
  name: "guideSegment",
  group: "inline",
  inline: !0,
  atom: !0,
  selectable: !1,
  addAttributes() {
    return { text: { default: "" } };
  },
  parseHTML() {
    return [{ tag: "span[data-guide-segment]" }];
  },
  renderHTML({ node: t }) {
    return ["span", { "data-guide-segment": "", class: "whitespace-pre" }, `${t.attrs.text} `];
  },
});
function Z2() {
  const { t, i18n: n } = e1(),
    [s, c] = i.useState(""),
    [a, w] = i.useState([]),
    [d, g] = i.useState([]),
    [y, j] = i.useState(null),
    [L, Z] = i.useState([]),
    H = i.useRef(""),
    R = i.useRef(null),
    [p, S] = i.useState(""),
    M = i.useRef(void 0),
    V = (C) => {
      C &&
        (window.clearTimeout(M.current),
        S(C),
        (M.current = window.setTimeout(() => {
          S("");
        }, 3500)));
    },
    I = i.useRef(null),
    [x, b] = i.useState(!1),
    [E, N] = i.useState(!1),
    $ = i.useRef(null),
    k = i.useRef(null),
    [, c1] = i.useState(0),
    O = k.current,
    C1 = A1(),
    B1 = (C) => {
      C.target.closest("[data-pet-no-drag]") || C1.onPointerDown(C);
    };
  i.useEffect(() => {
    const C = $.current;
    if (!C) return;
    const r = new Q1({
      element: C,
      extensions: [
        e2,
        t2,
        C2,
        n2.configure({
          HTMLAttributes: {
            class: "bg-gamecowork-color-surface-card text-gamecowork-color-text-default rounded px-2 py-px text-[0.8em]",
          },
        }),
        k2,
      ],
      content: "",
      editorProps: {
        attributes: {
          class: "[font-family:'Ark_Pixel'] block h-[30px] w-full overflow-y-auto text-sm outline-none bg-transparent",
        },
        handleKeyDown: (o, l) => {
          var f, v;
          return l.isComposing || l.keyCode === 229
            ? !1
            : l.key === "Enter"
              ? l.shiftKey
                ? (r2(o.state, o.dispatch), !0)
                : ((f = K.current) == null || f.call(K), !0)
              : l.key === "Escape"
                ? ((v = q.current) == null || v.call(q), !0)
                : !1;
        },
        handlePaste: (o, l) => {
          var v, m;
          const f = Array.from((m = (v = l.clipboardData) == null ? void 0 : v.files) != null ? m : []);
          return f.length === 0 ? !1 : (W1(f), !0);
        },
      },
      onUpdate: () => {
        c1((f) => f + 1);
        const o = k.current;
        if (!o) return;
        let l = !1;
        (o.state.doc.descendants((f) => (f.type.name === "guideSegment" ? ((l = !0), !1) : !0)), l || j(null));
      },
    });
    return (
      (k.current = r),
      c1((o) => o + 1),
      r.commands.focus("end"),
      () => {
        (window.clearTimeout(n1.current), (k.current = null), r.destroy());
      }
    );
  }, []);
  const u1 = async () => {
      var C;
      try {
        const o = await (await h("pet/getActiveSession")).json(),
          l = (C = o == null ? void 0 : o.data) == null ? void 0 : C.content,
          f = typeof (l == null ? void 0 : l.sessionId) == "string" ? l.sessionId : "";
        H.current = f;
      } catch {}
    },
    $1 = async () => {
      var C;
      try {
        const o = await (await h("pet/getUnityContext")).json(),
          l = (C = o == null ? void 0 : o.data) == null ? void 0 : C.content;
        c(typeof (l == null ? void 0 : l.name) == "string" ? l.name : "");
      } catch {}
    },
    O1 = async () => {
      var C;
      try {
        const o = await (await h("pet/getGuides")).json(),
          l = (C = o == null ? void 0 : o.data) == null ? void 0 : C.content;
        g(E1(l == null ? void 0 : l.guides));
      } catch {}
    },
    d1 = async () => {
      var C;
      try {
        const o = await (await h("pet/getPendingQueue", { sessionId: H.current })).json(),
          l = (C = o == null ? void 0 : o.data) == null ? void 0 : C.content;
        Z(N1(l == null ? void 0 : l.items));
      } catch {}
    };
  (i.useEffect(() => {
    (u1(), $1(), O1(), d1());
  }, []),
    F((C) => {
      if (C.type === "unityContext") {
        c(typeof C.name == "string" ? C.name : "");
        return;
      }
      if (C.type === "guidesChanged") {
        g(E1(C.guides));
        return;
      }
      if (C.type === "unityAddContext") {
        const r = Array.isArray(C.items) ? C.items : [],
          o = [],
          l = [];
        for (const f of r) {
          const v = typeof (f == null ? void 0 : f.path) == "string" ? f.path : "",
            m = typeof (f == null ? void 0 : f.name) == "string" && f.name ? f.name : v;
          m &&
            ((f == null ? void 0 : f.type) === "GameObject"
              ? l.push(
                  {
                    type: "mention",
                    attrs: {
                      id: "unity-gameobject",
                      label: m,
                      query: m,
                      itemType: "contextProvider",
                      dataUnityType: "GameObject",
                      dataUnityName: m,
                    },
                  },
                  { type: "text", text: " " },
                )
              : v && o.push(v));
        }
        (l.length > 0 && k.current && k.current.chain().focus("end").insertContent(l).run(),
          o.length > 0 &&
            w((f) => {
              const v = new Set(f);
              return [...f, ...o.filter((m) => !v.has(m))];
            }));
        return;
      }
      if (C.type === "queueChanged") {
        typeof C.sessionId == "string" && C.sessionId === H.current && Z(N1(C.items));
        return;
      }
      C.type === "activeSession" && C.sessionId !== H.current && u1().then(() => void d1());
    }),
    t1(),
    i.useEffect(() => {
      let C;
      return (
        l1(
          async () => {
            const { getCurrentWebview: r } = await import("./webview-Bmc8EURe.js");
            return { getCurrentWebview: r };
          },
          __vite__mapDeps([2, 1, 0]),
        )
          .then(({ getCurrentWebview: r }) =>
            r().onDragDropEvent((o) => {
              var f;
              const l = o.payload;
              if (l.type === "drop") {
                const v = (f = l.paths) != null ? f : [];
                v.length > 0 &&
                  w((m) => {
                    const P = new Set(m);
                    return [...m, ...v.filter((T) => !P.has(T))];
                  });
              }
            }),
          )
          .then((r) => {
            C = r;
          })
          .catch(() => {}),
        () => {
          C == null || C();
        }
      );
    }, []),
    i.useEffect(() => {
      const C = R.current;
      if (!C) return;
      I.current = null;
      const r = () => {
        (b(C.scrollLeft + C.clientWidth < C.scrollWidth - 1), N(C.scrollLeft > 0));
      };
      (r(), C.addEventListener("scroll", r, { passive: !0 }));
      const o = new ResizeObserver(r);
      return (
        o.observe(C),
        () => {
          (C.removeEventListener("scroll", r), o.disconnect());
        }
      );
    }, [a]));
  const W = () => {
      const C = k.current;
      return C
        ? C.state.doc.textBetween(
            0,
            C.state.doc.content.size,
            `
`,
            (r) => {
              var o;
              return r.type.name === "mention" ? `@${(o = r.attrs.label) != null ? o : r.attrs.id} ` : "";
            },
          )
        : "";
    },
    f1 = () => {
      const C = k.current;
      if (!C) return null;
      let r = null;
      return (
        C.state.doc.descendants((o, l) =>
          o.type.name === "guideSegment" ? ((r = { from: l, to: l + o.nodeSize }), !1) : !0,
        ),
        r
      );
    },
    G = y !== null ? W().trim() !== "" || a.length > 0 : (O ? !O.isEmpty : !1) || a.length > 0,
    X = i.useRef(!1),
    n1 = i.useRef(void 0),
    [U1, p1] = i.useState(!1),
    z1 = () => {
      var C;
      X.current ||
        ((X.current = !0),
        (C = k.current) == null || C.setEditable(!1),
        p1(!0),
        window.clearTimeout(n1.current),
        (n1.current = window.setTimeout(() => {
          X.current = !1;
          const r = k.current;
          (r && (r.commands.clearContent(), r.setEditable(!0), r.commands.focus("end")), j(null), w([]), p1(!1));
        }, 200)));
    },
    h1 = async () => {
      var o, l;
      if (X.current) return;
      const C = W().trim(),
        r = H.current;
      if (!G || !r) {
        G && !r && V(t("petInput.errorNoSession"));
        return;
      }
      if (y !== null && R1.has(y.id))
        h("pet/reportFeedback", { sessionId: r, title: y.text, description: C, locale: n.language, attachments: a });
      else
        try {
          const v = await (await h("pet/submitPrompt", { sessionId: r, text: C, attachments: a })).json();
          if (((o = v == null ? void 0 : v.data) == null ? void 0 : o.status) !== "success") {
            const m =
                typeof ((l = v == null ? void 0 : v.data) == null ? void 0 : l.error) == "string" ? v.data.error : "",
              P = N2[m];
            V(P ? t(P) : m);
            return;
          }
        } catch {
          V(t("petInput.errorSendFailed"));
          return;
        }
      z1();
    },
    F1 = () => {
      (w([]), h("pet/hideInput"));
    },
    K = i.useRef(() => {}),
    q = i.useRef(() => {});
  ((K.current = h1), (q.current = F1));
  const W1 = async (C) => {
      var r, o;
      for (const l of C)
        try {
          let f = await R2(l);
          if (l.type.startsWith("image/"))
            try {
              f = await o2(f);
            } catch {}
          const m = await (await h("pet/savePasteFile", { name: P2(l), dataUrl: f })).json(),
            P = (o = (r = m == null ? void 0 : m.data) == null ? void 0 : r.content) == null ? void 0 : o.path;
          typeof P == "string" && P && w((T) => (T.includes(P) ? T : [...T, P]));
        } catch {}
    },
    G1 = async () => {
      try {
        const r = await (
          await fetch(`${window.location.origin}/api/tauri/pick-file-modal`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent: "win-pet-input" }),
          })
        ).json();
        !(r != null && r.cancelled) &&
          typeof (r == null ? void 0 : r.path) == "string" &&
          w((o) => (o.includes(r.path) ? o : [...o, r.path]));
      } catch {}
    },
    X1 = (C) => {
      fetch(`${window.location.origin}/api/tauri/reveal-in-file-explorer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: C }),
      }).catch(() => {});
    },
    K1 = (C) => {
      var l;
      const r = R.current;
      if (!r || r.scrollWidth <= r.clientWidth) return;
      const o = (l = I.current) != null ? l : r.scrollLeft;
      w1(o + C.deltaY + C.deltaX);
    },
    x1 = (C) => {
      var o, l, f;
      const r = (f = (l = I.current) != null ? l : (o = R.current) == null ? void 0 : o.scrollLeft) != null ? f : 0;
      w1(r + C * 96);
    },
    w1 = (C) => {
      const r = R.current;
      if (!r) return;
      const o = r.scrollWidth - r.clientWidth,
        l = Math.min(o, Math.max(0, C));
      ((I.current = l), r.scrollTo({ left: l, behavior: "smooth" }));
    },
    q1 = (C) => {
      const r = k.current;
      if (!r) return;
      const o = C.text;
      if (R1.has(C.id)) {
        if ((y == null ? void 0 : y.id) === C.id) return;
        const m = r.chain().focus();
        let P = !1;
        const T = W();
        for (const J of d) {
          if (T === J.text) {
            (m.deleteRange({ from: 1, to: 1 + J.text.length }), (P = !0));
            break;
          }
          if (T.startsWith(`${J.text} `)) {
            (m.deleteRange({ from: 1, to: 1 + J.text.length + 1 }), (P = !0));
            break;
          }
        }
        P && m.run();
        const s1 = f1();
        (r
          .chain()
          .focus()
          .insertContentAt(s1 != null ? s1 : { from: 1, to: 1 }, [{ type: "guideSegment", attrs: { text: o } }])
          .run(),
          j({ id: C.id, text: o }));
        return;
      }
      j(null);
      const l = f1();
      l && r.chain().focus().deleteRange(l).run();
      const f = W();
      if (f === o || f.startsWith(`${o} `)) return;
      const v = r.chain().focus();
      for (const m of d)
        if (m.text !== o) {
          if (f === m.text) {
            v.deleteRange({ from: 1, to: 1 + m.text.length });
            break;
          }
          if (f.startsWith(`${m.text} `)) {
            v.deleteRange({ from: 1, to: 1 + m.text.length + 1 });
            break;
          }
        }
      (v.insertContentAt(1, `${o} `).run(), r.commands.focus("end"));
    },
    U = "border-gamecowork-color-border-strong",
    Y = "bg-gamecowork-color-surface-input",
    [D, g1] = i.useState(null),
    [r1, z] = i.useState(!1);
  i.useEffect(() => {
    const C = L.length > 0 ? L[0] : null,
      r = D;
    if ((r == null ? void 0 : r.id) === (C == null ? void 0 : C.id)) {
      r && !r1 && z(!0);
      return;
    }
    if (!r && C) {
      (g1(C), z(!1), requestAnimationFrame(() => requestAnimationFrame(() => z(!0))));
      return;
    }
    z(!1);
    const o = window.setTimeout(() => {
      (g1(C), C && requestAnimationFrame(() => requestAnimationFrame(() => z(!0))));
    }, 200);
    return () => window.clearTimeout(o);
  }, [L, D, r1]);
  const o1 = D ? D.attachments.map((C) => ` @${_1(C)}`).join("") : "";
  return e.jsxs("div", {
    className: u("h-full w-full flex flex-col justify-end items-start [font-family:'Ark_Pixel'] pb-px"),
    onPointerDown: B1,
    onPointerMove: C1.onPointerMove,
    onPointerUp: C1.onPointerUp,
    children: [
      D &&
        e.jsxs("div", {
          className: u(
            `w-[292px] box-content px-2 border border-px border-solid ${U} ${Y} h-4 flex items-center py-2 text-sm select-none transition-opacity duration-200 mb-3`,
            !r1 && "opacity-0",
          ),
          children: [
            e.jsx(V2, { className: u("shrink-0 text-gamecowork-color-text-secondary mr-2") }),
            e.jsxs("div", {
              className: "flex-1 min-w-0 truncate text-gamecowork-color-text-secondary text-sm",
              title: `${D.text}${o1}`,
              children: [D.text, o1 && e.jsx("span", { className: "text-gamecowork-color-text-tertiary", children: o1 })],
            }),
          ],
        }),
      e.jsxs("div", {
        className: u("flex flex-row cursor-grab select-none"),
        children: [
          d.map((C, r) =>
            e.jsx(
              "div",
              {
                className: u(
                  `py-1 text-sm select-none leading-5 border border-px border-b-0 border-r-0 border-solid w-14 text-center ${U} ${Y} tracking-[1px] cursor-pointer`,
                ),
                style: { color: C.color },
                onClick: () => q1(C),
                children: C.text,
              },
              `${r}-${C.text}`,
            ),
          ),
          e.jsx("div", {
            className: u(
              `h-7 flex flex-row items-center justify-center box-content border border-px border-b-0 border-solid w-7 ${U} ${Y} cursor-pointer`,
            ),
            onClick: () => void h("pet/openSettings"),
            children: e.jsx(v2, {}),
          }),
        ],
      }),
      p &&
        e.jsx("div", {
          className: u("px-2 py-1 text-sm leading-5 select-none", "text-gamecowork-color-text-secondary"),
          "data-pet-no-drag": !0,
          children: p,
        }),
      a.length > 0 &&
        e.jsx("div", {
          className: u(`px-2 pt-2 w-[292px] box-content border border-px border-b-0 border-solid ${U} ${Y}`),
          children: e.jsxs("div", {
            className: "relative",
            children: [
              e.jsx("div", {
                ref: R,
                onWheel: K1,
                className: "flex flex-row items-center gap-2 overflow-hidden",
                children: a.map((C) =>
                  e.jsxs(
                    "div",
                    {
                      title: C,
                      className: u("group relative flex flex-row flex-shrink-0 items-center size-10 select-none"),
                      children: [
                        H2.has(I1(C))
                          ? e.jsx("img", {
                              src: P1(C),
                              alt: "",
                              className: u("mr-2 size-10 cursor-pointer object-cover"),
                              onMouseDown: (r) => r.preventDefault(),
                              onClick: () => void h("pet/showFilePreview", { path: C }),
                            })
                          : E2.has(I1(C))
                            ? e.jsxs("div", {
                                className: u("relative cursor-pointer"),
                                onMouseDown: (r) => r.preventDefault(),
                                onClick: () => void h("pet/showFilePreview", { path: C }),
                                children: [
                                  e.jsx("video", {
                                    src: `${P1(C)}#t=0.1`,
                                    muted: !0,
                                    preload: "metadata",
                                    className: u("size-10 object-cover"),
                                  }),
                                  e.jsx("div", {
                                    className: u(
                                      "absolute size-[14px] bg-gamecowork-color-surface-overlay -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex items-center justify-center",
                                    ),
                                    children: e.jsx(L2, {}),
                                  }),
                                ],
                              })
                            : e.jsx("div", {
                                className: u("size-10 flex flex-row items-center justify-center"),
                                children: e.jsx(j2, {
                                  className: u("size-8 shrink-0 cursor-pointer"),
                                  onMouseDown: (r) => r.preventDefault(),
                                  onClick: () => X1(C),
                                }),
                              }),
                        e.jsx("div", {
                          className: u(
                            "absolute top-0 right-0 hidden size-3.5 group-hover:flex items-center justify-center bg-gamecowork-color-surface-overlay cursor-pointer",
                          ),
                          onMouseDown: (r) => r.preventDefault(),
                          onClick: (r) => {
                            (r.stopPropagation(), w((o) => o.filter((l) => l !== C)));
                          },
                          children: e.jsx(M2, { className: u("text-[rgba(255,255,255,.93)] size-4") }),
                        }),
                      ],
                    },
                    C,
                  ),
                ),
              }),
              E &&
                e.jsx("div", {
                  className: u(
                    "absolute left-0 top-1/2 -translate-y-1/2 ml-[-4px] z-10 flex size-3.5 items-center justify-center bg-gamecowork-color-surface-overlay cursor-pointer",
                  ),
                  onMouseDown: (C) => C.preventDefault(),
                  onClick: () => x1(-1),
                  children: e.jsx(H1, { className: u("text-gamecowork-color-text-primary rotate-180 ml-1") }),
                }),
              E &&
                e.jsx("div", {
                  className: u("pointer-events-none absolute left-0 top-0 bottom-0 w-4"),
                  style: { background: "linear-gradient(270deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.80) 100%)" },
                }),
              x &&
                e.jsx("div", {
                  className: u("pointer-events-none absolute right-0 top-0 bottom-0 w-4"),
                  style: { background: "linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.80) 100%)" },
                }),
              x &&
                e.jsx("div", {
                  className: u(
                    "absolute right-0 top-1/2 -translate-y-1/2 mr-[-4px] z-10 flex size-3.5 items-center justify-center bg-gamecowork-color-surface-overlay cursor-pointer text-gamecowork-color-text-primary",
                  ),
                  onMouseDown: (C) => C.preventDefault(),
                  onClick: () => x1(1),
                  children: e.jsx(H1, { className: u("mr-1") }),
                }),
            ],
          }),
        }),
      e.jsxs("div", {
        className: u(
          `w-[292px] h-[60px] bg-gamecowork-color-surface-input border border-solid ${U} box-content p-2`,
          a.length > 0 && "border-t-0",
        ),
        children: [
          e.jsxs("div", {
            className: u("relative overflow-hidden"),
            "data-pet-no-drag": !0,
            children: [
              (O == null ? void 0 : O.isEmpty) &&
                e.jsx("div", {
                  className: u(
                    "pointer-events-none absolute left-0 top-0 select-none text-sm text-gamecowork-color-text-tertiary",
                  ),
                  children: t("petInput.placeholder"),
                }),
              e.jsx("div", { ref: $, className: u("transition-opacity duration-200", U1 && "opacity-0") }),
            ],
          }),
          e.jsx("div", { className: u("h-2 w-full") }),
          e.jsxs("div", {
            className: u("flex flex-row items-center justify-center"),
            children: [
              e.jsx(b2, { className: u("w-4 h-4 mr-3 shrink-0 cursor-pointer"), onClick: () => void G1() }),
              e.jsxs("div", {
                className: u("flex-grow flex flex-row gap-1 items-center min-w-0"),
                children: [
                  s && e.jsx(S2, { className: u("text-gamecowork-color-text-secondary size-4 shrink-0") }),
                  e.jsx("div", {
                    className: u(
                      "flex-grow text-xs overflow-ellipsis truncate whitespace-nowrap min-w-0 tracking-[1px] text-gamecowork-color-text-secondary",
                    ),
                    title: s || void 0,
                    children: s || "",
                  }),
                ],
              }),
              e.jsx("div", {
                className: u(
                  "w-[22px] h-[22px] shrink-0 flex items-center justify-center ml-3",
                  G ? "bg-gamecowork-color-accent-default cursor-pointer" : "bg-gamecowork-color-surface-card cursor-default",
                ),
                onMouseDown: (C) => C.preventDefault(),
                onClick: () => void h1(),
                children: e.jsx(y2, {
                  className: u(G ? "text-gamecowork-color-text-primary" : "text-gamecowork-color-text-tertiary"),
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function T2(t) {
  return e.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      d: "M6.68337 4.1L10.5834 8L6.68337 11.9L5.81671 11.0167L8.83337 8L5.81671 4.98334L6.68337 4.1Z",
      fill: "currentColor",
    }),
  });
}
const A2 = [
  { action: "idle" },
  { action: "runRight" },
  { action: "runLeft" },
  { action: "waving" },
  { action: "jumping" },
  { action: "failed" },
  { action: "running" },
  { action: "review" },
];
function i1() {
  return e.jsx("div", { className: "h-px my-1 bg-gamecowork-color-border-subtle" });
}
function a1({ label: t, onClick: n, onMouseEnter: s }) {
  const c = (a) => {
    (a.stopPropagation(), h("pet/hideMenu"), n());
  };
  return e.jsx("div", {
    onMouseEnter: s,
    onClick: c,
    className: u(
      "rounded cursor-pointer px-3 h-7 text-sm hover:bg-gamecowork-color-interactive-hover",
      "flex flex-row items-center text-gamecowork-color-text-default",
    ),
    children: t,
  });
}
function k1({ label: t, active: n, onHover: s, onClick: c }) {
  const a = (d) => {
      s(d.currentTarget.offsetTop);
    },
    w = (d) => {
      (d.stopPropagation(), c == null || c());
    };
  return e.jsxs("div", {
    onMouseEnter: a,
    onClick: w,
    className: u(
      "cursor-pointer px-3 h-7 text-sm flex flex-row items-center justify-between",
      "text-gamecowork-color-text-default rounded",
      n ? "bg-gamecowork-color-interactive-hover" : "hover:bg-gamecowork-color-interactive-hover",
    ),
    children: [t, e.jsx(T2, { className: "opacity-60" })],
  });
}
function D2() {
  const { t } = e1();
  t1();
  const [n, s] = i.useState(null),
    c = (d, g, y) => {
      (s(d), h("pet/showSubmenu", { y: g, items: y }));
    },
    a = () => {
      (s(null), h("pet/hideSubmenu"));
    },
    w = A2.map(({ action: d }) => ({ label: t(`petMenu.states.${d}`), action: d }));
  return e.jsxs("div", {
    className: u(
      "w-full overflow-hidden rounded-xl p-1 select-none border border-solid shadow-lg",
      "bg-gamecowork-color-surface-elevated border-gamecowork-color-border-default",
    ),
    children: [
      e.jsx(a1, { label: t("petMenu.openHub"), onClick: () => void h("pet/openHub"), onMouseEnter: a }),
      e.jsx(i1, {}),
      e.jsx(k1, { label: t("petMenu.switchState"), active: n === "states", onHover: (d) => c("states", d, w) }),
      e.jsx(k1, { label: t("petMenu.petSize"), active: n === "sizes", onHover: (d) => c("sizes", d, []) }),
      e.jsx(i1, {}),
      e.jsx(a1, {
        label: t("petMenu.help"),
        onClick: () => void h("openUrl", { url: "https://codely.tuanjie.cn" }),
        onMouseEnter: a,
      }),
      e.jsx(i1, {}),
      e.jsx(a1, { label: t("petMenu.hide"), onClick: () => void h("pet/close"), onMouseEnter: a }),
    ],
  });
}
function _2(t) {
  return e.jsxs("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 1024 1024",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M0 0 C10.85 5.76 16.3 14.81 22.55 25.01 C24.54 28.24 26.57 31.42 28.69 34.56 C32.39 40.07 36.01 45.62 39.62 51.19 C47 62.54 54.51 73.79 62.06 85.03 C68.23 94.24 74.16 103.58 80 113 C80.61 113.95 81.22 114.91 81.84 115.89 C86.39 123.15 89.92 130.29 89 139 C87.44 145.23 85.6 150.66 82 156 C81.34 156 80.68 156 80 156 C80 156.66 80 157.32 80 158 C71.51 163.66 64.33 166.06 54.06 166.65 C52.52 166.75 50.98 166.84 49.39 166.94 C47.73 167.03 46.07 167.12 44.36 167.22 C42.62 167.32 40.88 167.43 39.08 167.53 C33.49 167.86 27.9 168.18 22.31 168.5 C18.66 168.71 15.01 168.93 11.37 169.14 C2.34 169.68 -6.69 170.19 -15.72 170.7 C-20.92 171 -26.12 171.3 -31.33 171.6 C-34.58 171.79 -37.83 171.97 -41.08 172.16 C-42.53 172.24 -43.98 172.33 -45.47 172.42 C-79.14 174.29 -79.14 174.29 -90.38 165.62 C-97.41 158.59 -99.73 153.11 -100.38 143.19 C-100.22 135.5 -97.76 129.63 -93.5 123.25 C-83.18 113.67 -72.44 112.85 -59 113 C-59 112.34 -59 111.68 -59 111 C-61.99 110.28 -64.99 109.62 -68 109 C-71.61 107.95 -75.21 106.89 -78.81 105.81 C-171.24 79.27 -275.81 87.2 -363 128 C-363.99 128.46 -364.98 128.92 -366 129.39 C-403.97 147.03 -438.51 169.48 -469.49 197.73 C-471.55 199.6 -473.65 201.42 -475.76 203.24 C-480.18 207.16 -484.4 211.25 -488.56 215.44 C-489.28 216.15 -489.99 216.86 -490.73 217.6 C-495.36 222.23 -499.73 227.03 -504 232 C-504.93 233.05 -505.86 234.1 -506.82 235.18 C-515.15 244.69 -522.63 254.73 -530 265 C-530.8 266.11 -531.6 267.22 -532.43 268.36 C-573.56 326.44 -598.44 394.37 -606 465 C-606.12 466.07 -606.23 467.14 -606.35 468.24 C-609.31 496.32 -609.07 524.94 -606 553 C-605.9 553.92 -605.9 553.92 -605.41 558.55 C-602.46 583.47 -597.44 608.03 -590 632 C-589.67 633.08 -589.33 634.16 -588.99 635.28 C-583.68 652.31 -577.27 668.72 -570 685 C-569.29 686.6 -568.57 688.2 -567.84 689.84 C-553.25 721.64 -533.28 751.29 -510.94 778.12 C-503.29 787.38 -501.03 795.1 -502 807 C-504.72 815.99 -508.45 821.72 -516.38 826.81 C-525.17 830.97 -532.56 832.28 -541.99 828.94 C-549.87 825.41 -554.72 820.72 -560 814 C-560.84 812.97 -561.68 811.94 -562.54 810.88 C-573.04 797.78 -582.95 784.14 -592 770 C-592.95 768.52 -593.9 767.04 -594.88 765.51 C-636.76 699.53 -661.79 623.89 -668 546 C-668.09 544.88 -668.19 543.76 -668.29 542.6 C-671.26 503.69 -668.92 464.37 -662 426 C-661.8 424.89 -661.6 423.78 -661.4 422.63 C-645.16 334.15 -603.55 251.68 -542.54 185.75 C-540.22 183.24 -537.95 180.69 -535.69 178.12 C-527.36 168.85 -518.48 160.08 -509 152 C-507.35 150.46 -505.71 148.92 -504.06 147.38 C-498.07 141.9 -491.66 137.03 -485.18 132.15 C-481.66 129.5 -478.2 126.79 -474.75 124.06 C-461.26 113.68 -446.74 104.48 -432 96 C-431.34 95.62 -431.34 95.62 -427.99 93.69 C-317.25 30.98 -186.65 13.85 -63.61 46.99 C-51.65 50.34 -39.78 54.07 -28 58 C-28.68 57.04 -29.35 56.09 -30.05 55.11 C-43.32 35.87 -43.32 35.87 -42 24 C-39.57 14.04 -36.26 8.13 -28 2 C-17.53 -2.61 -10.95 -4.29 0 0 Z ",
        fill: "currentColor",
        transform: "translate(703,3)",
      }),
      e.jsx("path", {
        d: "M0 0 C6.51 4.6 11.11 10.78 16 17 C16.5 17.62 16.5 17.62 19.05 20.77 C48.71 57.89 71.59 99.9 89 144 C89.39 144.97 89.77 145.95 90.17 146.95 C106.36 188.12 116.41 232.91 120 277 C120.04 277.53 120.04 277.53 120.26 280.2 C121.09 291.55 121.19 302.88 121.19 314.25 C121.19 317.47 121.21 320.68 121.22 323.9 C121.28 343.19 119.93 362.27 117.19 381.38 C117.1 381.98 117.1 381.98 116.67 385.04 C104.48 468.54 71.1 546.48 19.27 613.07 C17.3 615.61 15.39 618.21 13.5 620.81 C12.67 621.86 11.85 622.92 11 624 C10.34 624 9.68 624 9 624 C8.34 625.32 7.68 626.64 7 628 C5.52 629.74 3.99 631.45 2.44 633.12 C-1.9 637.81 -1.9 637.81 -3 640 C-3.66 640 -4.32 640 -5 640 C-5 640.66 -5 641.32 -5 642 C-5.66 642 -6.32 642 -7 642 C-7.66 643.32 -8.32 644.64 -9 646 C-10.78 647.97 -12.62 649.88 -14.5 651.76 C-15.61 652.88 -16.73 654 -17.88 655.15 C-19.05 656.32 -20.23 657.49 -21.44 658.69 C-22.58 659.83 -23.72 660.98 -24.89 662.16 C-30.9 668.15 -36.98 673.83 -43.63 679.11 C-46.67 681.54 -49.58 684.11 -52.5 686.69 C-72.5 703.84 -95.07 719.02 -118 732 C-118.83 732.47 -119.66 732.94 -120.51 733.42 C-234.2 797.46 -365.98 811.72 -491.5 777.16 C-499.15 775 -506.68 772.59 -514.16 769.9 C-515.1 769.6 -516.03 769.31 -517 769 C-517.33 769.33 -517.66 769.66 -518 770 C-515.87 773.73 -513.58 777.34 -511.3 780.97 C-506.78 788.9 -504.96 795.87 -506 805 C-508.83 814.5 -513.27 820.66 -521.69 825.94 C-529.9 829.87 -536.87 829.87 -545.62 827.44 C-557.24 822.17 -562.37 813.39 -569 803 C-571.03 799.89 -573.07 796.78 -575.11 793.67 C-581.08 784.57 -587.01 775.45 -592.94 766.31 C-596.52 760.79 -600.14 755.28 -603.81 749.81 C-609.75 740.95 -615.47 731.94 -621.2 722.95 C-624.87 717.18 -628.61 711.46 -632.4 705.77 C-636.6 698.51 -636.9 691.22 -636 683 C-634.73 679.18 -633.15 676.48 -631 673 C-630.44 672.09 -629.89 671.18 -629.31 670.25 C-619.2 660.41 -606.94 659.84 -593.51 659.13 C-592.91 659.1 -592.91 659.1 -589.89 658.92 C-585.96 658.7 -582.04 658.49 -578.12 658.27 C-575.37 658.12 -572.63 657.97 -569.89 657.81 C-564.15 657.49 -558.42 657.17 -552.69 656.86 C-545.35 656.46 -538.01 656.05 -530.67 655.63 C-525.01 655.32 -519.35 655 -513.7 654.69 C-510.99 654.54 -508.29 654.39 -505.58 654.24 C-501.8 654.02 -498.01 653.82 -494.23 653.61 C-493.12 653.55 -492.01 653.49 -490.87 653.42 C-468.95 652.24 -468.95 652.24 -458.25 659 C-451 665.82 -447.44 673.15 -446.69 683.19 C-447.28 692.25 -451.06 699.26 -457 706 C-467.18 713.55 -476.79 713.27 -489 713 C-489 713.66 -489 714.32 -489 715 C-486.35 715.72 -483.69 716.41 -481.02 717.03 C-476.34 718.16 -471.75 719.49 -467.12 720.81 C-431.8 730.49 -395.68 735.45 -359.06 735.31 C-358.53 735.31 -358.53 735.31 -355.84 735.31 C-296.65 735.11 -237.81 723.01 -184 698 C-182.97 697.52 -181.93 697.05 -180.86 696.56 C-144.09 679.61 -109.53 657.72 -79.58 630.34 C-77.51 628.47 -75.41 626.63 -73.3 624.82 C-68.5 620.56 -63.96 616.11 -59.44 611.56 C-58.63 610.75 -57.81 609.95 -56.98 609.12 C-52.11 604.24 -47.49 599.23 -43 594 C-42.08 592.96 -41.16 591.93 -40.22 590.86 C-23.77 572.04 -9.54 551.6 3 530 C3.76 528.7 4.51 527.41 5.29 526.07 C49.22 449.05 67.96 359.24 58 271 C57.88 269.88 57.75 268.75 57.63 267.6 C48.61 188.49 16.78 115.53 -32.41 53.3 C-46.36 35.5 -46.36 35.5 -46 23 C-44.13 12.88 -40.56 6.26 -32.06 0.19 C-21.05 -5.74 -11.36 -5.08 0 0 Z ",
        fill: "currentColor",
        transform: "translate(870,195)",
      }),
      e.jsx("path", {
        d: "M0 0 C1.31 -0 2.62 -0.01 3.97 -0.01 C8.38 -0.02 12.79 -0.03 17.2 -0.03 C20.36 -0.04 23.51 -0.04 26.67 -0.05 C35.25 -0.07 43.83 -0.08 52.41 -0.09 C57.78 -0.09 63.14 -0.1 68.5 -0.1 C85.27 -0.12 102.04 -0.14 118.81 -0.15 C138.17 -0.15 157.53 -0.18 176.9 -0.22 C191.86 -0.25 206.82 -0.27 221.79 -0.27 C230.73 -0.27 239.67 -0.28 248.61 -0.31 C257.01 -0.33 265.42 -0.33 273.83 -0.32 C276.92 -0.32 280 -0.33 283.09 -0.34 C287.3 -0.36 291.52 -0.35 295.73 -0.34 C296.95 -0.35 298.17 -0.36 299.42 -0.37 C309.12 -0.3 316.58 1.52 324.62 7.27 C330.65 13.72 333.81 20.52 334.5 29.33 C333.92 38.12 331.04 44.59 325.25 51.15 C317.75 57.48 312.61 59.43 302.87 59.27 C302.16 59.26 302.16 59.26 298.54 59.22 C297.99 59.21 297.99 59.21 295.25 59.15 C295.25 60.11 295.26 61.07 295.26 62.07 C295.31 72.12 295.34 82.18 295.36 92.24 C295.37 95.99 295.38 99.74 295.4 103.49 C295.42 108.89 295.43 114.29 295.44 119.69 C295.45 121.36 295.46 123.03 295.47 124.74 C295.48 141.74 293.06 154.01 282.68 167.84 C279.64 171.98 276.76 176.21 273.87 180.46 C269.22 187.29 264.5 194.07 259.66 200.78 C257.12 204.33 254.61 207.91 252.11 211.5 C250.27 214.12 248.41 216.72 246.54 219.32 C245.93 220.17 245.33 221.02 244.71 221.89 C243.47 223.63 242.22 225.36 240.97 227.09 C238.01 231.25 236.26 234.07 235.25 239.15 C237.61 243.01 237.61 243.01 241 247.46 C242.21 249.08 243.42 250.7 244.63 252.32 C245.24 253.13 245.85 253.94 246.48 254.77 C249.04 258.21 251.46 261.73 253.87 265.27 C254.77 266.58 255.66 267.88 256.58 269.23 C258.36 271.84 260.14 274.45 261.92 277.07 C266.85 284.28 271.86 291.4 277 298.46 C291.33 318.25 295.61 331.59 294.82 355.81 C294.7 361 294.6 366.2 294.5 371.39 C294.42 375 294.31 378.6 294.17 382.21 C293.99 387.41 293.89 392.61 293.82 397.81 C293.74 399.43 293.66 401.06 293.57 402.73 C293.55 410.33 293.55 410.33 295.25 414.15 C299.21 415.57 302.3 415.58 306.49 415.34 C313.74 414.96 318.86 418.14 324.56 422.27 C330.82 428.85 333.89 435.79 334.5 444.83 C333.88 455.52 330.06 462.18 322.25 469.15 C312.8 475.4 304.58 475.3 293.52 475.28 C292.88 475.28 292.88 475.28 289.63 475.29 C285.32 475.29 281.02 475.29 276.71 475.29 C273.63 475.3 270.54 475.3 267.45 475.3 C259.07 475.31 250.68 475.31 242.29 475.31 C235.29 475.32 228.29 475.32 221.29 475.32 C204.78 475.33 188.26 475.33 171.74 475.33 C154.7 475.33 137.67 475.34 120.63 475.36 C106 475.37 91.37 475.38 76.74 475.38 C68.01 475.38 59.27 475.38 50.53 475.39 C42.32 475.4 34.1 475.4 25.88 475.39 C22.87 475.39 19.85 475.39 16.84 475.4 C12.72 475.41 8.6 475.4 4.48 475.39 C3.29 475.4 2.11 475.4 0.88 475.41 C-12.46 475.35 -22.27 473.63 -32.13 463.77 C-37.64 456.16 -39.3 448.47 -38.13 439.21 C-35.43 429.29 -31.31 423.85 -22.75 418.15 C-17.23 415.14 -12.64 415.03 -6.47 415.08 C-5.03 415.09 -3.58 415.1 -2.1 415.11 C-0.99 415.12 0.11 415.13 1.25 415.15 C1.24 414.08 1.23 413.01 1.22 411.9 C1.14 401.8 1.08 391.69 1.04 381.58 C1.02 376.39 0.99 371.19 0.95 366 C0.89 360.02 0.88 354.04 0.86 348.06 C0.84 346.2 0.82 344.34 0.8 342.43 C0.79 340.69 0.79 338.95 0.79 337.16 C0.79 335.63 0.78 334.1 0.77 332.53 C2.26 318.89 13.08 306.87 20.8 296.01 C24.67 290.55 28.49 285.07 32.31 279.58 C32.99 278.6 33.68 277.62 34.38 276.61 C39.18 269.7 43.97 262.77 48.68 255.8 C50.47 253.25 52.35 250.75 54.28 248.3 C55.24 247.08 56.2 245.85 57.19 244.58 C57.62 244.05 57.62 244.05 59.84 241.33 C60.3 240.28 60.77 239.23 61.25 238.15 C59.92 234.85 59.92 234.85 57.25 231.15 C56.73 230.38 56.73 230.38 54.08 226.51 C52.89 224.82 51.69 223.14 50.5 221.46 C46.66 216.02 42.83 210.59 39.19 205.02 C35.95 200.11 32.52 195.35 29.06 190.58 C0.87 151.74 0.87 151.74 1.17 137.59 C1.18 136.73 1.18 136.73 1.25 132.38 C1.27 131.46 1.27 131.46 1.36 126.78 C1.39 122.89 1.42 118.99 1.45 115.1 C1.49 108.94 1.55 102.79 1.7 96.64 C1.83 90.71 1.85 84.78 1.86 78.85 C1.92 76.99 1.99 75.13 2.05 73.22 C1.99 64.51 1.99 64.51 0.25 60.15 C-4.84 58.1 -9.38 58.76 -14.75 59.15 C-22.75 56.69 -28.99 53.63 -33.48 46.34 C-38.62 36.58 -39.45 30.07 -36.75 19.15 C-32.66 10.97 -26.33 4.58 -17.75 1.15 C-11.79 -0.04 -6.05 -0 0 0 Z M60.25 59.15 C60.25 131.15 60.25 131.15 70.25 145.15 C72.34 148.18 74.43 151.22 76.5 154.27 C83.33 164.29 90.28 174.22 97.25 184.15 C128.27 228.38 128.27 228.38 127.25 242.15 C125.32 251.4 119.58 258.54 114.25 266.15 C113.17 267.7 112.09 269.26 110.97 270.86 C108.01 275.11 105.03 279.34 102.05 283.58 C99.15 287.7 96.26 291.83 93.37 295.96 C92.8 296.77 92.24 297.58 91.65 298.42 C88.48 302.95 85.32 307.49 82.16 312.03 C81.82 312.53 81.82 312.53 80.06 315.05 C78.74 316.95 77.42 318.85 76.1 320.76 C70.89 328.27 65.57 335.7 60.25 343.15 C60.25 366.91 60.25 390.67 60.25 415.15 C118 415.15 175.75 415.15 235.25 415.15 C235.25 343.15 235.25 343.15 221.25 323.15 C218.62 319.38 215.99 315.61 213.37 311.83 C212.03 309.9 210.68 307.96 209.33 306.02 C208.66 305.05 207.99 304.08 207.29 303.09 C205.24 300.14 203.19 297.19 201.14 294.24 C197.17 288.55 193.2 282.85 189.25 277.15 C188.63 276.26 188.02 275.37 187.38 274.46 C167.18 245.27 167.18 245.27 168.25 233.15 C171.08 221.65 178.47 212.63 185.25 203.15 C187.19 200.4 189.12 197.65 191.06 194.9 C192.04 193.52 193.01 192.15 194.01 190.73 C204.21 176.28 214.25 161.73 224.25 147.15 C227.88 141.87 231.51 136.59 235.25 131.15 C235.25 107.39 235.25 83.63 235.25 59.15 C177.5 59.15 119.75 59.15 60.25 59.15 Z ",
        fill: "currentColor",
        transform: "translate(364.7516174316406,274.8528289794922)",
      }),
    ],
  });
}
function B2(t) {
  return e.jsxs("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 512 540",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M0 0 C7.22 6.87 10.66 13.67 11.44 23.62 C10.66 33.14 7.73 38.27 1 45 C-2.43 47.84 -5.92 50.57 -9.45 53.27 C-12.56 55.66 -15.53 58.14 -18.5 60.69 C-36.35 75.34 -57.73 82.22 -80.62 82.12 C-81.7 82.12 -82.77 82.12 -83.87 82.12 C-91.31 82.08 -98.6 81.64 -106 81 C-108.12 80.97 -110.24 80.96 -112.36 80.97 C-114.22 80.98 -116.08 80.99 -118 81 C-99.72 120.45 -99.72 120.45 -91.38 138.44 C-91.11 139.02 -91.11 139.02 -89.75 141.95 C-86.12 149.76 -86.12 149.76 -85 152 C-81.6 152.04 -78.21 151.92 -74.81 151.75 C-74.28 151.72 -74.28 151.72 -71.61 151.6 C-64.21 151.22 -56.83 150.73 -49.44 150.21 C-3.03 146.96 -3.03 146.96 14.88 162.32 C18.63 165.83 22.32 169.4 26 173 C28.66 175.34 31.33 177.67 34 180 C36.17 182 38.34 184 40.5 186 C43.97 189.21 47.44 192.39 51 195.5 C55.71 199.62 60.29 203.87 64.88 208.13 C67.38 210.43 69.94 212.69 72.5 214.94 C81.19 222.54 87.37 228.94 88.44 240.94 C87.78 248.51 85.12 254.42 80 260 C77.09 261.77 77.09 261.77 73.94 263.25 C72.89 263.75 71.85 264.25 70.78 264.77 C63.03 268.21 55.76 268.02 47.94 265.12 C42.99 261.99 39.01 258.62 34.78 254.6 C32.15 252.14 29.44 249.87 26.62 247.62 C21.25 243.29 16.23 238.62 11.19 233.91 C7.52 230.56 3.7 227.46 -0.17 224.36 C-4.57 220.69 -8.71 216.74 -12.86 212.8 C-13.9 211.87 -14.93 210.95 -16 210 C-16.92 209.06 -17.84 208.12 -18.79 207.15 C-25.37 203.79 -30.55 205.97 -37.46 207.79 C-38.85 208.13 -40.24 208.47 -41.67 208.82 C-46.1 209.92 -50.52 211.05 -54.94 212.19 C-57.94 212.94 -60.94 213.68 -63.95 214.42 C-71.31 216.25 -78.66 218.11 -86 220 C-81.94 225.48 -77.76 230.55 -73.06 235.5 C-68.27 240.58 -63.52 245.67 -59 251 C-58.66 251.39 -58.66 251.39 -56.91 253.38 C-56.2 254.23 -55.49 255.07 -54.75 255.94 C-54.11 256.69 -53.46 257.44 -52.8 258.21 C-47.55 266.35 -46.94 276.16 -45.71 285.53 C-43.9 298.74 -41.95 311.92 -39.85 325.09 C-39.32 328.48 -38.78 331.87 -38.25 335.27 C-37.43 340.43 -36.61 345.6 -35.78 350.77 C-34.96 355.87 -34.15 360.98 -33.35 366.09 C-33.23 366.86 -33.23 366.86 -32.59 370.76 C-30.49 384.33 -30.45 393.95 -38.5 405.62 C-43.15 410.11 -47.82 413.06 -54 415 C-59.19 414.56 -59.19 414.56 -64 413 C-65.53 412.59 -67.05 412.18 -68.62 411.75 C-76.39 408.64 -81.74 404.19 -86 397 C-88.39 390.63 -89.69 384.55 -90.62 377.82 C-90.9 375.8 -91.19 373.78 -91.47 371.76 C-91.54 371.23 -91.54 371.23 -91.91 368.56 C-92.7 362.89 -93.54 357.24 -94.37 351.59 C-95.41 344.42 -96.44 337.24 -97.42 330.07 C-98.22 324.24 -99.07 318.42 -99.94 312.61 C-100.27 310.4 -100.57 308.2 -100.86 305.99 C-102.73 291.67 -105.82 282.63 -117 273 C-119.34 270.34 -121.67 267.67 -124 265 C-125.83 263 -127.66 261 -129.5 259 C-132.52 255.72 -135.5 252.42 -138.44 249.06 C-141.57 245.49 -144.77 241.99 -148 238.5 C-152.41 233.73 -156.78 228.94 -161 224 C-161.68 223.24 -162.36 222.47 -163.05 221.69 C-168.98 214.8 -172.98 207.8 -176.75 199.56 C-177.35 198.3 -177.94 197.03 -178.56 195.72 C-180.39 191.82 -182.19 187.91 -184 184 C-185.06 181.72 -186.13 179.43 -187.19 177.15 C-188.76 173.79 -190.32 170.43 -191.87 167.06 C-195.04 160.18 -198.26 153.33 -201.52 146.48 C-202.3 144.86 -203.07 143.23 -203.87 141.56 C-205.39 138.37 -206.91 135.18 -208.44 131.99 C-209.13 130.53 -209.83 129.08 -210.54 127.57 C-211.16 126.28 -211.78 124.99 -212.42 123.66 C-213.94 120.14 -215.04 116.7 -216 113 C-225.69 122.52 -234.59 131.51 -235.28 145.74 C-235.17 155.6 -232.95 165.12 -231.04 174.76 C-228.98 185.66 -227.92 194.18 -234 204 C-240.02 210.82 -245.32 214.97 -254.25 216.94 C-264.77 217.08 -272.27 214.38 -280 207 C-283.72 201.12 -285.68 196.39 -286.5 189.5 C-286.61 188.6 -286.61 188.6 -287.17 184.03 C-287.29 182.96 -287.42 181.89 -287.54 180.8 C-288.1 176.19 -288.71 171.6 -289.33 167 C-289.8 163.36 -290.28 159.71 -290.75 156.06 C-290.99 154.31 -291.22 152.55 -291.46 150.75 C-293.6 133.74 -293.98 119.8 -283.75 105.44 C-282.51 103.97 -281.27 102.51 -280 101 C-278.54 99.21 -277.08 97.42 -275.62 95.62 C-274.08 93.75 -272.54 91.87 -271 90 C-269.5 88.17 -268 86.33 -266.5 84.5 C-265.76 83.59 -265.01 82.69 -264.25 81.75 C-262.74 79.91 -261.24 78.07 -259.75 76.21 C-243.05 55.6 -226.81 44.23 -202.45 33.55 C-199.63 32.32 -196.82 31.06 -194.01 29.8 C-162.44 15.81 -138.04 14.75 -104.76 21.23 C-101.42 21.88 -98.08 22.5 -94.73 23.13 C-93.73 23.33 -92.73 23.53 -91.7 23.74 C-80.82 25.77 -70.93 25.14 -61 20 C-55.2 15.84 -49.61 11.42 -44 7 C-29.43 -4.22 -17.3 -10.56 0 0 Z M-39.19 18.81 C-56.05 31.8 -69.12 38.22 -91 37 C-100.03 35.68 -108.92 33.73 -117.84 31.84 C-146.11 26.16 -167.01 30.65 -192.58 42.45 C-196.13 44.06 -199.7 45.61 -203.29 47.14 C-204.49 47.66 -205.7 48.18 -206.94 48.71 C-209.25 49.71 -211.56 50.7 -213.88 51.68 C-228.44 58.02 -238.33 68.65 -248 81 C-249.37 82.69 -250.75 84.38 -252.12 86.06 C-252.86 86.97 -253.6 87.87 -254.37 88.8 C-256.41 91.28 -258.46 93.76 -260.51 96.23 C-261.74 97.72 -262.98 99.21 -264.25 100.75 C-265.41 102.15 -266.57 103.54 -267.77 104.98 C-276.24 115.5 -279.86 123.49 -278.52 137.25 C-278.25 139.62 -277.96 141.99 -277.67 144.36 C-277.52 145.62 -277.37 146.88 -277.22 148.17 C-276.9 150.83 -276.58 153.48 -276.25 156.13 C-275.75 160.18 -275.27 164.24 -274.8 168.29 C-274.49 170.88 -274.17 173.46 -273.86 176.04 C-273.72 177.25 -273.58 178.46 -273.43 179.71 C-272.07 190.46 -272.07 190.46 -269 195 C-263.98 198.74 -260.22 199.79 -254 199 C-249.11 196.51 -247.92 194.87 -245 190 C-244.35 181.68 -245.94 173.93 -247.5 165.81 C-250.85 147.25 -252.16 132.25 -241.25 115.99 C-237.45 110.94 -233.3 106.2 -229.08 101.48 C-226.66 98.74 -224.42 95.96 -222.19 93.06 C-219 90 -219 90 -215.03 89.42 C-211 90 -211 90 -208.96 92.48 C-208.44 93.7 -207.91 94.93 -207.38 96.19 C-206.72 97.65 -206.06 99.11 -205.38 100.62 C-204.59 102.4 -203.81 104.17 -203 106 C-201.39 109.37 -199.75 112.72 -198.11 116.07 C-192.3 127.96 -186.68 139.93 -181.13 151.94 C-176.43 162.11 -171.66 172.24 -166.88 182.38 C-166.14 183.93 -165.4 185.49 -164.65 187.1 C-160.7 195.45 -160.7 195.45 -159 199 C-158.76 199.53 -158.76 199.53 -157.52 202.23 C-154.71 207.35 -150.22 210.93 -145 213.44 C-138.31 214.69 -132.28 213.83 -125.72 212.26 C-124.1 211.88 -122.49 211.5 -120.83 211.1 C-119.09 210.69 -117.36 210.27 -115.57 209.84 C-113.76 209.41 -111.95 208.98 -110.09 208.53 C-105.26 207.39 -100.44 206.24 -95.62 205.08 C-90.81 203.93 -86.01 202.78 -81.2 201.64 C-79.33 201.19 -77.46 200.75 -75.54 200.29 C-68.32 198.57 -61.09 196.87 -53.87 195.16 C-49.41 194.1 -44.95 193.01 -40.49 191.91 C-38.07 191.33 -35.64 190.74 -33.21 190.16 C-32.15 189.89 -31.08 189.62 -29.99 189.34 C-23.97 187.93 -20.37 187.78 -15 191 C-11.86 193.6 -11.86 193.6 -8.75 196.62 C-4.79 200.39 -0.84 204.03 3.44 207.44 C9.09 211.97 14.31 216.92 19.59 221.88 C23.32 225.29 27.19 228.45 31.13 231.61 C35.88 235.57 40.34 239.84 44.84 244.08 C53.29 251.88 53.29 251.88 61 252 C65.71 250.37 68.27 248.15 71 244 C72.34 238.64 71.51 236.95 69 232 C63.25 225.4 56.61 219.71 50 214 C47.83 212.01 45.66 210.01 43.5 208 C38.73 203.58 33.89 199.27 29 195 C27.04 193.21 25.08 191.42 23.12 189.62 C22.1 188.68 21.07 187.74 20.02 186.77 C18.13 185.04 16.24 183.31 14.36 181.57 C11.93 179.36 9.47 177.17 7 175 C6.2 174.29 5.4 173.57 4.58 172.84 C-4.48 165.12 -13.53 161.29 -25.56 161.5 C-26.6 161.51 -27.64 161.53 -28.71 161.54 C-37.11 161.72 -45.48 162.25 -53.86 162.76 C-54.43 162.79 -54.43 162.79 -57.31 162.97 C-63.12 163.32 -68.93 163.7 -74.74 164.11 C-76.92 164.25 -79.09 164.4 -81.27 164.54 C-83.21 164.68 -85.16 164.81 -87.16 164.95 C-92 165 -92 165 -97 163 C-99.21 159.06 -101.14 155.22 -103 151.12 C-103.28 150.52 -103.28 150.52 -104.72 147.45 C-105.91 144.89 -107.09 142.34 -108.26 139.78 C-109.87 136.27 -111.5 132.78 -113.14 129.28 C-115.25 124.77 -117.35 120.25 -119.43 115.72 C-122.12 109.87 -124.87 104.04 -127.63 98.22 C-129.21 94.85 -130.79 91.49 -132.38 88.12 C-133.14 86.52 -133.91 84.91 -134.7 83.26 C-135.41 81.75 -136.11 80.25 -136.84 78.7 C-137.47 77.35 -138.11 76.01 -138.76 74.63 C-140.08 70.77 -140.2 68.86 -139 65 C-137 63 -137 63 -134.32 62.75 C-125.04 62.83 -115.91 63.55 -106.69 64.5 C-78.91 67.15 -54.07 66.75 -31 49 C-27.4 46.02 -23.86 42.99 -20.35 39.91 C-17.38 37.33 -14.35 34.86 -11.25 32.44 C-7 29 -7 29 -5 26 C-4.6 20.87 -4.4 17.22 -6.69 12.56 C-10.02 8.87 -12.93 7.12 -17.88 6.56 C-26.36 7.46 -32.67 13.71 -39.19 18.81 Z M-119.62 226.88 C-120.78 227.14 -121.94 227.41 -123.13 227.69 C-131.76 229.76 -131.76 229.76 -134 232 C-131.09 235.46 -128.11 238.73 -125 242 C-123.12 244.04 -121.25 246.08 -119.38 248.12 C-118.44 249.14 -117.51 250.15 -116.55 251.2 C-114.53 253.42 -112.54 255.67 -110.56 257.94 C-106.36 262.73 -102.02 267.39 -97.67 272.05 C-91.75 278.6 -90.82 284.31 -89.5 292.81 C-89.38 293.56 -89.38 293.56 -88.76 297.34 C-87.12 307.6 -85.56 317.87 -84.02 328.15 C-83.06 334.56 -82.08 340.97 -81.11 347.39 C-80.38 352.21 -79.67 357.04 -78.96 361.87 C-78.5 364.9 -78.04 367.93 -77.59 370.95 C-77.49 371.65 -77.49 371.65 -76.98 375.19 C-74.5 391.31 -74.5 391.31 -67.75 396.5 C-63.41 398.24 -60.64 398.59 -56 398 C-51.83 396.07 -50.16 394.24 -47.56 390.44 C-44.62 382.09 -47.24 372.82 -48.52 364.21 C-48.67 363.19 -48.82 362.18 -48.97 361.13 C-49.46 357.81 -49.96 354.49 -50.46 351.17 C-50.63 350.03 -50.8 348.89 -50.97 347.71 C-51.88 341.69 -52.78 335.66 -53.69 329.64 C-54.63 323.43 -55.55 317.21 -56.46 310.99 C-57.17 306.2 -57.9 301.41 -58.62 296.62 C-58.97 294.33 -59.31 292.04 -59.64 289.74 C-60.11 286.54 -60.6 283.34 -61.09 280.15 C-61.23 279.24 -61.23 279.24 -61.92 274.63 C-63.53 267.75 -67.09 263.7 -71.81 258.62 C-75.95 254.14 -79.98 249.59 -84 245 C-86.51 242.22 -89.04 239.46 -91.56 236.69 C-93.73 234.29 -95.88 231.88 -98 229.44 C-99.62 227.58 -101.26 225.74 -103 224 C-108.74 224 -114.08 225.54 -119.62 226.88 Z ",
        fill: "currentColor",
        transform: "translate(328,92)",
      }),
      e.jsx("path", {
        d: "M0 0 C12.43 8.54 19.95 20.43 22.81 35.25 C24.21 50.62 20.44 64.18 11.01 76.44 C2.44 85.89 -9.79 92.31 -22.52 93.64 C-38.03 93.86 -51.09 89.9 -62.88 79.69 C-72.82 69.49 -77.83 57.21 -78.25 43 C-78.04 28.72 -73.08 17.07 -63.38 6.5 C-46.22 -9.96 -20.1 -12.13 0 0 Z M-53.56 18.81 C-60.4 26.81 -63.3 35.27 -62.88 45.69 C-61.57 56.37 -57.16 63.83 -49.12 71.06 C-39.87 76.78 -31.64 78.94 -20.88 77.69 C-10.05 74.95 -3.32 69.43 3.12 60.56 C8.16 50.81 8.67 40.8 5.5 30.31 C0.62 20.81 -5.12 14.18 -15.06 9.88 C-29.92 5.25 -41.85 8.89 -53.56 18.81 Z ",
        fill: "currentColor",
        transform: "translate(133.875,15.3125)",
      }),
      e.jsx("path", {
        d: "M0 0 C1.39 -0.01 2.78 -0.01 4.22 -0.02 C4.99 -0.02 4.99 -0.02 8.88 -0.02 C10.49 -0.03 12.1 -0.03 13.76 -0.04 C19.11 -0.05 24.47 -0.06 29.82 -0.06 C33.53 -0.07 37.24 -0.07 40.94 -0.08 C48.73 -0.09 56.51 -0.1 64.29 -0.1 C74.28 -0.11 84.27 -0.13 94.25 -0.16 C101.91 -0.18 109.57 -0.18 117.23 -0.18 C120.92 -0.19 124.6 -0.19 128.28 -0.21 C133.43 -0.22 138.57 -0.22 143.72 -0.22 C145.25 -0.23 146.78 -0.23 148.36 -0.24 C149.76 -0.24 151.16 -0.23 152.6 -0.23 C153.82 -0.23 155.04 -0.23 156.29 -0.23 C159.49 0.14 159.49 0.14 164.49 3.14 C165.49 5.14 165.49 5.14 165.49 11.14 C160.58 16.05 159.64 16.26 153.02 16.28 C152.33 16.28 152.33 16.28 148.83 16.3 C148.06 16.3 148.06 16.3 144.2 16.3 C142.6 16.31 140.99 16.31 139.34 16.32 C134.02 16.33 128.7 16.34 123.38 16.34 C119.69 16.35 116.01 16.36 112.32 16.36 C104.59 16.37 96.85 16.38 89.12 16.38 C79.19 16.39 69.27 16.41 59.34 16.44 C51.72 16.46 44.11 16.46 36.5 16.46 C32.84 16.47 29.18 16.48 25.52 16.49 C20.4 16.51 15.29 16.5 10.17 16.5 C8.65 16.51 7.13 16.52 5.56 16.52 C4.17 16.52 2.78 16.51 1.34 16.51 C0.74 16.51 0.74 16.51 -2.32 16.51 C-5.51 16.14 -5.51 16.14 -10.51 13.14 C-12.51 9.14 -12.51 9.14 -11.51 4.14 C-7.34 -0.02 -5.76 0.01 0 0 Z ",
        fill: "currentColor",
        transform: "translate(38.50886535644531,448.85955810546875)",
      }),
      e.jsx("path", {
        d: "M0 0 C1.42 -0.01 2.84 -0.02 4.31 -0.03 C5.87 -0.03 7.43 -0.02 9.03 -0.01 C10.68 -0.02 12.32 -0.02 14.01 -0.03 C19.46 -0.05 24.9 -0.04 30.35 -0.02 C34.12 -0.03 37.9 -0.03 41.67 -0.03 C49.59 -0.04 57.5 -0.03 65.42 -0.01 C74.57 0.01 83.73 0 92.88 -0.02 C101.68 -0.04 110.48 -0.04 119.29 -0.03 C123.04 -0.02 126.78 -0.03 130.53 -0.04 C135.76 -0.05 140.99 -0.03 146.23 -0.01 C147.79 -0.02 149.34 -0.03 150.95 -0.03 C152.37 -0.02 153.8 -0.01 155.26 0 C155.88 0 155.88 0 159.01 0 C162.13 0.51 162.13 0.51 166.13 4.51 C167.32 9.28 166.59 10.42 164.13 14.51 C161.24 15.95 158.73 15.65 155.5 15.66 C154.08 15.67 152.66 15.68 151.2 15.69 C149.63 15.69 148.07 15.7 146.45 15.7 C145.63 15.7 145.63 15.7 141.48 15.73 C136.02 15.75 130.56 15.77 125.11 15.78 C124.18 15.78 124.18 15.78 119.48 15.8 C111.67 15.82 103.87 15.84 96.07 15.85 C84.87 15.87 73.68 15.9 62.49 15.96 C53.67 16 44.86 16.01 36.05 16.02 C32.3 16.03 28.54 16.04 24.79 16.07 C19.55 16.1 14.31 16.1 9.07 16.09 C7.5 16.11 5.94 16.12 4.33 16.14 C2.91 16.13 1.48 16.12 0.01 16.12 C-1.23 16.12 -2.47 16.12 -3.74 16.13 C-6.87 15.51 -6.87 15.51 -9.3 13.34 C-10.87 10.51 -10.87 10.51 -10.87 4.51 C-6.38 0.02 -5.95 0.01 0 0 Z ",
        fill: "currentColor",
        transform: "translate(52.8699951171875,488.4920654296875)",
      }),
      e.jsx("path", {
        d: "M0 0 C3 3 3 3 4.12 6.19 C3.87 14.04 -5.07 20.19 -10.39 25.53 C-11.08 26.21 -11.08 26.21 -14.54 29.67 C-15.24 30.37 -15.94 31.07 -16.66 31.79 C-18.83 33.95 -20.99 36.12 -23.15 38.28 C-24.51 39.64 -25.87 41 -27.27 42.4 C-28.51 43.64 -29.76 44.89 -31.04 46.17 C-35.47 50.41 -35.33 50 -42 50 C-46 46 -46 46 -47 41 C-44.79 38.05 -42.59 35.61 -40 33 C-39.01 31.99 -38.02 30.97 -37 29.92 C-33.52 26.39 -30.01 22.88 -26.5 19.38 C-25.3 18.17 -24.1 16.97 -22.87 15.73 C-22.29 15.15 -22.29 15.15 -19.34 12.21 C-18.29 11.16 -17.24 10.11 -16.16 9.03 C-15.12 8.03 -14.08 7.03 -13 6 C-11.84 4.88 -10.68 3.76 -9.48 2.61 C-6 0 -6 0 0 0 Z ",
        fill: "currentColor",
        transform: "translate(468,233)",
      }),
      e.jsx("path", {
        d: "M0 0 C3 3 3 3 3.62 6.31 C2.74 11.55 0.13 12.77 -4 16 C-6.64 17.8 -9.3 19.54 -12 21.25 C-19.04 25.73 -25.96 30.35 -32.83 35.1 C-36 37 -36 37 -41 38 C-44.25 37 -44.25 37 -47 35 C-48.19 31.62 -48.19 31.62 -48 28 C-44.28 23.58 -39.74 20.66 -34.93 17.52 C-33.37 16.5 -31.82 15.48 -30.22 14.43 C-28.6 13.38 -26.98 12.33 -25.31 11.25 C-23.68 10.18 -22.05 9.12 -20.37 8.02 C-5.88 -1.44 -5.88 -1.44 0 0 Z ",
        fill: "currentColor",
        transform: "translate(482,275)",
      }),
      e.jsx("path", {
        d: "M0 0 C3 3 3 3 3.58 6.07 C2.76 11.62 -0.13 15.46 -3.31 19.94 C-3.95 20.85 -4.58 21.77 -5.23 22.71 C-6.52 24.58 -7.82 26.45 -9.13 28.31 C-10.85 30.78 -12.53 33.28 -14.2 35.79 C-22.62 48.37 -22.62 48.37 -27 51 C-32 50 -32 50 -35 47 C-36.31 40 -33.61 36.04 -29.82 30.47 C-29.09 29.45 -28.37 28.43 -27.62 27.38 C-26.9 26.32 -26.17 25.26 -25.42 24.18 C-23.3 21.1 -21.15 18.05 -19 15 C-17.94 13.47 -16.88 11.93 -15.78 10.36 C-8.13 -0.57 -8.13 -0.57 0 0 Z ",
        fill: "currentColor",
        transform: "translate(428,220)",
      }),
    ],
  });
}
function $2(t) {
  return e.jsxs("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M0 0 C8.24 7.43 13.13 17.42 14.51 28.39 C15.13 44.56 7.39 60.97 2.2 75.97 C1.24 78.76 0.29 81.56 -0.66 84.35 C-1.23 85.99 -1.8 87.63 -2.38 89.32 C-3.49 93.27 -3.49 93.27 -2.49 96.27 C0.93 98.52 4.36 100.63 7.89 102.7 C9.98 103.96 12.08 105.21 14.18 106.46 C15.23 107.1 16.29 107.73 17.38 108.38 C22.05 111.19 26.66 114.1 31.26 117.02 C32.78 117.98 34.3 118.94 35.87 119.94 C38.1 121.36 40.31 122.8 42.51 124.27 C45.44 124.61 45.44 124.61 49.08 124.73 C50.44 124.78 51.81 124.83 53.21 124.88 C59.54 125.03 65.86 125.16 72.18 125.24 C75.49 125.3 78.8 125.39 82.1 125.51 C103.98 126.29 118.75 124.78 136.2 111.03 C139.22 108.72 142.42 106.92 145.77 105.12 C146.7 104.59 147.63 104.06 148.59 103.51 C150.42 102.46 152.26 101.46 154.13 100.48 C156.84 98.88 156.84 98.88 160.51 95.27 C160.06 90.9 159.14 88.28 157.51 84.27 C156.39 80.89 155.29 77.52 154.19 74.14 C150.92 64.29 150.92 64.29 149.4 59.79 C148.45 56.95 147.51 54.11 146.57 51.26 C146.29 50.42 146.29 50.42 144.86 46.17 C141.3 33.22 142.41 21.82 148.75 10.09 C155.14 -0.17 163.65 -6.94 175.51 -9.73 C188.96 -10.85 199.25 -8.39 210.51 -0.73 C221.03 8.23 225.04 19.93 229.19 32.75 C229.61 34.01 230.02 35.27 230.45 36.57 C231.77 40.57 233.08 44.57 234.39 48.58 C235.68 52.53 236.98 56.48 238.29 60.43 C239.13 63.01 239.98 65.59 240.83 68.17 C244.1 78.1 247.52 87.97 251.02 97.82 C255 109.68 254.98 121.91 249.51 133.27 C243.13 142.72 235.32 149.08 225.51 154.77 C223.73 155.81 221.95 156.86 220.17 157.91 C219.24 158.46 218.31 159 217.36 159.56 C212.53 162.45 207.77 165.45 203.01 168.45 C190.66 176.21 178.19 183.77 165.72 191.32 C159.68 194.98 153.67 198.67 147.66 202.36 C145.97 203.38 144.27 204.38 142.51 205.27 C142.1 207.59 141.77 209.92 141.51 212.27 C142.41 211.89 143.31 211.52 144.24 211.14 C159.43 204.86 174.63 198.58 189.89 192.45 C190.91 192.04 191.94 191.63 192.99 191.2 C203.8 186.88 215.19 185.06 226.51 188.89 C238.28 194.48 246.34 202.3 251.51 214.27 C255.04 224.53 254.47 235.24 250.51 245.27 C245.85 254.44 240.17 263.01 234.55 271.61 C231.27 276.64 228.04 281.7 224.82 286.77 C219.74 294.78 214.63 302.77 209.51 310.77 C204.46 318.65 199.42 326.55 194.39 334.45 C193.82 335.35 193.25 336.25 192.66 337.17 C189.79 341.68 186.92 346.2 184.05 350.72 C181.16 355.29 178.25 359.85 175.34 364.4 C174.07 366.38 172.81 368.37 171.55 370.36 C169.57 373.48 167.57 376.59 165.57 379.7 C164.97 380.66 164.37 381.61 163.75 382.59 C158.52 390.68 153.2 396.94 144.32 401.14 C143.13 401.72 141.94 402.29 140.72 402.88 C131.72 406.76 119.93 406.82 110.64 403.77 C99.23 398.2 91.32 391.79 86.2 379.89 C82.36 367.1 82.85 355.82 89.02 343.96 C91.62 339.25 94.46 334.69 97.32 330.14 C97.62 329.66 97.62 329.66 99.13 327.24 C100.59 324.91 102.05 322.59 103.51 320.27 C95.9 320.27 89.38 322.5 83.51 327.27 C80.78 336.61 81.38 345.87 81.68 355.53 C81.7 358.36 81.71 361.19 81.71 364.02 C81.75 371.48 81.88 378.93 82.05 386.38 C82.28 398.29 82.35 410.21 82.44 422.12 C82.49 426.27 82.57 430.42 82.66 434.57 C82.69 437.13 82.73 439.7 82.77 442.26 C82.81 443.41 82.84 444.55 82.87 445.73 C83.01 458.3 79.34 468.25 70.44 477.39 C61.01 486.33 50.52 489.34 37.57 489.2 C25.87 487.9 15.82 482.4 8.26 473.39 C1.33 463 -0.79 454.04 -0.58 441.58 C-0.56 440.54 -0.55 439.5 -0.54 438.42 C-0.5 436.15 -0.47 433.88 -0.43 431.61 C-0.34 426.62 -0.27 421.63 -0.2 416.63 C-0.17 413.95 -0.13 411.26 -0.09 408.57 C0.05 398.69 0.15 388.81 0.22 378.93 C0.24 377.49 0.25 376.05 0.26 374.57 C0.3 368.65 0.34 362.73 0.38 356.8 C0.49 340.01 0.64 323.22 0.94 306.43 C1.18 293.08 1.31 279.73 1.33 266.37 C1.35 259.31 1.41 252.26 1.6 245.2 C2.67 202.37 2.67 202.37 -4.18 192.32 C-10.59 186.31 -17.63 183.19 -25.92 180.56 C-31.76 178.45 -36.67 175.03 -41.8 171.58 C-43.74 170.35 -45.69 169.13 -47.64 167.91 C-48.11 167.61 -48.11 167.61 -50.53 166.1 C-53.6 164.2 -56.69 162.33 -59.78 160.46 C-60.81 159.84 -61.84 159.22 -62.9 158.58 C-64.84 157.42 -66.79 156.25 -68.74 155.09 C-81.64 147.34 -90.72 139.43 -96.49 125.27 C-101.05 102.47 -88.59 78.18 -81.48 56.83 C-79.92 52.12 -78.36 47.41 -76.81 42.7 C-75.81 39.67 -74.8 36.65 -73.8 33.63 C-73.34 32.24 -72.88 30.84 -72.41 29.41 C-67.61 15.08 -62.24 3.8 -49.68 -5.17 C-32.49 -13.66 -15.37 -11.84 0 0 Z M166.2 17.58 C162.55 22.58 161.4 25.97 161.7 32.15 C162.73 38.67 164.78 44.56 166.98 50.77 C167.89 53.39 168.8 56.02 169.71 58.64 C171.14 62.74 172.58 66.85 174.02 70.95 C175.42 74.93 176.79 78.91 178.17 82.89 C178.61 84.12 179.04 85.34 179.49 86.59 C181.57 92.62 183.29 97.8 182.51 104.27 C179.21 108.62 174.77 111.24 170.2 114.14 C168.7 115.1 167.2 116.05 165.65 117.04 C159 121.22 152.35 125.39 145.68 129.52 C144.74 130.11 143.79 130.69 142.82 131.3 C141.88 131.87 140.94 132.45 139.97 133.04 C137.54 134.61 135.16 136.27 132.85 138.01 C121.93 145.88 113.79 147.93 100.47 147.8 C98.7 147.81 96.94 147.83 95.12 147.84 C91.4 147.86 87.69 147.85 83.98 147.81 C78.35 147.77 72.74 147.85 67.12 147.95 C45.83 148.05 31.45 146.64 14.51 133.27 C11.37 131.19 8.16 129.23 4.95 127.27 C3.43 126.29 1.91 125.32 0.35 124.32 C-3.16 122.11 -6.68 119.94 -10.23 117.8 C-11.19 117.22 -12.15 116.64 -13.14 116.04 C-15 114.93 -16.86 113.82 -18.72 112.72 C-23.47 109.84 -25.56 108.15 -28.49 103.27 C-29.34 96.72 -27.06 90.83 -25.06 84.67 C-24.88 84.12 -24.88 84.12 -24 81.32 C-22.88 77.8 -21.75 74.28 -20.61 70.77 C-19.49 67.25 -18.37 63.73 -17.25 60.21 C-16.55 58.02 -15.86 55.84 -15.15 53.65 C-8.45 32.75 -8.45 32.75 -11.55 22.89 C-15.08 18.11 -19.2 14.91 -24.49 12.27 C-31.71 11.7 -36.35 12.35 -42.49 16.27 C-46.25 20.24 -47.95 24.42 -49.87 29.5 C-50.47 31.11 -51.08 32.71 -51.7 34.37 C-54.38 41.7 -56.95 49.06 -59.46 56.46 C-59.98 58.01 -60.51 59.56 -61.05 61.16 C-62.14 64.4 -63.24 67.65 -64.33 70.89 C-65.44 74.2 -66.56 77.51 -67.69 80.81 C-69.34 85.63 -70.96 90.45 -72.58 95.27 C-73.09 96.74 -73.6 98.21 -74.12 99.73 C-76.51 106.95 -78.4 112.65 -76.49 120.27 C-71.3 130.35 -62.94 135.01 -53.55 140.7 C-52.4 141.41 -51.25 142.11 -50.07 142.83 C-46.54 144.98 -43.02 147.12 -39.49 149.27 C-37.46 150.5 -35.43 151.73 -33.4 152.97 C-30.55 154.7 -27.7 156.44 -24.84 158.17 C-12.25 165.84 0.3 173.57 12.76 181.45 C13.86 182.15 14.96 182.84 16.09 183.56 C18.51 185.27 18.51 185.27 19.51 187.27 C19.62 190.63 19.65 194 19.66 197.36 C19.66 198.42 19.66 199.48 19.67 200.58 C19.68 204.16 19.68 207.74 19.69 211.32 C19.69 213.88 19.7 216.44 19.71 219 C19.72 224.52 19.73 230.05 19.74 235.57 C19.76 244.3 19.78 253.03 19.81 261.76 C19.88 286.6 19.94 311.43 19.99 336.26 C20.02 349.97 20.05 363.67 20.1 377.38 C20.12 386.06 20.14 394.74 20.15 403.42 C20.16 408.82 20.18 414.22 20.2 419.63 C20.2 422.13 20.21 424.64 20.21 427.14 C20.21 430.57 20.22 433.99 20.24 437.41 C20.24 439.32 20.25 441.24 20.25 443.21 C20.63 450.6 21.77 456.47 26.51 462.27 C33.22 467.33 38.09 467.72 46.51 467.27 C53.4 464.87 56.61 461.36 60.51 455.27 C61.91 449.67 61.66 444.14 61.67 438.41 C61.67 437.09 61.68 435.77 61.68 434.41 C61.7 431.54 61.7 428.68 61.71 425.81 C61.72 421.27 61.74 416.74 61.76 412.21 C61.83 399.31 61.88 386.42 61.91 373.53 C61.93 365.65 61.97 357.76 62.01 349.88 C62.03 346.87 62.04 343.87 62.04 340.86 C62.04 336.66 62.07 332.46 62.1 328.25 C62.09 327.63 62.09 327.63 62.09 324.47 C62.14 318.49 62.36 315.51 65.51 310.27 C69.35 308.41 73.07 306.83 77.05 305.32 C78.2 304.87 79.34 304.43 80.53 303.96 C84.2 302.53 87.89 301.11 91.57 299.7 C94.03 298.75 96.48 297.79 98.94 296.84 C104.49 294.68 110.04 292.53 115.6 290.4 C118.42 289.3 121.22 288.14 124.02 286.97 C128.94 285.1 131.48 284.79 136.51 286.27 C139.01 288.27 139.01 288.27 140.51 291.27 C141.27 298.88 139.62 302.69 135.39 308.95 C134.29 310.6 133.2 312.25 132.08 313.95 C131.79 314.38 131.79 314.38 130.31 316.57 C127.24 321.17 124.29 325.84 121.32 330.52 C120.74 331.44 120.15 332.36 119.54 333.31 C103.85 357.98 103.85 357.98 104.51 368.27 C107.31 376.25 110.09 379.56 117.51 383.27 C124.18 383.93 130.89 384.34 136.51 380.27 C140.95 376.27 143.87 371.83 147.01 366.77 C147.53 365.93 148.05 365.1 148.58 364.24 C150.23 361.59 151.87 358.93 153.51 356.27 C155.08 353.73 156.66 351.19 158.23 348.65 C159.86 346.02 161.48 343.39 163.11 340.77 C166.66 335.02 170.24 329.3 173.82 323.58 C179.16 315.06 184.44 306.52 189.7 297.95 C195.18 289.02 200.74 280.14 206.35 271.29 C231.03 232.06 231.03 232.06 228.57 221.08 C225.62 215.62 221.5 211.26 215.51 209.27 C205.27 208.3 197.73 211.43 188.37 215.36 C186.85 215.97 185.33 216.59 183.76 217.23 C178.92 219.2 174.09 221.2 169.26 223.2 C164.42 225.2 159.57 227.18 154.72 229.16 C151.71 230.39 148.7 231.63 145.7 232.88 C144.33 233.44 142.96 234 141.56 234.58 C140.36 235.08 139.17 235.57 137.94 236.08 C134.35 237.32 131.31 238.1 127.51 238.27 C122.51 235.27 122.51 235.27 120.51 232.27 C120 225.82 120.09 219.35 120.07 212.89 C120.04 211.09 120.01 209.28 119.97 207.42 C119.97 205.69 119.96 203.96 119.95 202.18 C119.95 201.39 119.95 201.39 119.91 197.37 C120.61 192.56 121.7 191.16 125.51 188.27 C127.84 187.26 130.17 186.26 132.51 185.27 C133.66 184.4 134.8 183.53 135.98 182.64 C141.36 178.63 146.97 175.18 152.7 171.7 C155.04 170.28 157.37 168.85 159.71 167.42 C160.87 166.71 162.02 166.01 163.21 165.28 C167.82 162.46 172.42 159.62 177.01 156.77 C182.75 153.21 188.49 149.67 194.24 146.15 C195.4 145.44 196.55 144.73 197.74 144.01 C199.98 142.64 202.22 141.27 204.46 139.91 C226.39 126.48 226.39 126.48 229.89 117.89 C231.29 109.76 228.45 102.39 225.86 94.76 C225.49 93.66 225.13 92.55 224.75 91.41 C223.55 87.84 222.35 84.27 221.14 80.7 C220.31 78.25 219.48 75.8 218.66 73.35 C217.03 68.52 215.39 63.7 213.75 58.87 C211.85 53.28 209.98 47.69 208.12 42.09 C207.19 39.36 206.26 36.62 205.32 33.89 C204.93 32.69 204.53 31.49 204.13 30.25 C201.36 22.3 197.74 16.34 190.76 11.27 C180.58 8.13 173.47 10.31 166.2 17.58 Z ",
        fill: "currentColor",
        transform: "translate(178.48828125,16.734375)",
      }),
      e.jsx("path", {
        d: "M0 0 C12.66 9.57 19.89 21.46 23 37 C24.02 53.74 20.77 67.36 9.75 80.25 C-0.16 90.67 -12.55 97.24 -27.04 98.2 C-42.75 98.44 -56.44 93.22 -67.75 82.34 C-78.86 70.78 -83.39 58.92 -84 43 C-83.16 27.4 -76.41 14.88 -65.25 4.19 C-46.65 -11.69 -20.55 -13.2 0 0 Z M-57 26 C-61.92 34.67 -62.78 42.18 -62 52 C-58.51 62.2 -53.45 68.74 -44 74 C-34.36 77.57 -26.27 77.86 -16.69 73.69 C-7.64 68.5 -2.79 62.9 0.88 52.88 C2.79 44.59 1.97 39.02 -1 31 C-6.39 22.61 -13.07 15.38 -23 13 C-37.07 11.42 -47.81 14.89 -57 26 Z ",
        fill: "currentColor",
        transform: "translate(282,29)",
      }),
    ],
  });
}
function O2(t) {
  return e.jsxs("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 1024 1024",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M0 0 C1.07 0.78 2.13 1.56 3.23 2.36 C26.49 19.79 46.83 41.89 63 66 C63.76 67.09 64.51 68.18 65.29 69.31 C71.83 78.88 77.5 88.79 83 99 C83.79 100.41 84.58 101.82 85.39 103.28 C137.45 198.22 147.07 316.52 132 422 C131.83 423.24 131.65 424.47 131.47 425.74 C120.14 504.54 89.23 587.08 33 645 C31.82 646.24 30.63 647.47 29.41 648.75 C21.43 656.92 13.19 664.22 4 671 C2.87 671.85 1.74 672.7 0.57 673.58 C-37.7 701.8 -84.13 714.72 -131.38 708.81 C-173.59 702.24 -210.45 681.39 -241 652 C-241.62 651.41 -241.62 651.41 -244.77 648.39 C-252.94 640.41 -260.18 632.15 -267 623 C-267.73 622.06 -268.46 621.13 -269.22 620.16 C-293.45 588.86 -311.31 552.35 -324 515 C-324.38 513.9 -324.77 512.79 -325.16 511.66 C-339.43 470.43 -346.86 427.34 -351 384 C-351.18 382.17 -351.35 380.35 -351.53 378.47 C-352.12 371.28 -352.18 364.11 -352.2 356.89 C-352.21 355.46 -352.21 354.02 -352.22 352.54 C-352.23 349.5 -352.24 346.47 -352.24 343.43 C-352.25 338.9 -352.28 334.37 -352.31 329.84 C-352.41 304.06 -350.66 278.5 -346.75 253 C-346.54 251.61 -346.33 250.23 -346.11 248.8 C-339.18 204.49 -327.34 160.56 -308 120 C-307.32 118.48 -306.64 116.97 -305.93 115.41 C-288.78 77.76 -263.09 39.48 -231 13 C-230.2 12.29 -229.41 11.58 -228.59 10.86 C-208.6 -6.57 -185.15 -19.76 -160 -28 C-158.58 -28.47 -157.15 -28.95 -155.68 -29.43 C-102.53 -45.68 -44.18 -32.62 0 0 Z M-203.5 75.69 C-218.29 92.18 -230.49 110.55 -241 130 C-241.6 131.08 -242.19 132.15 -242.81 133.26 C-247.81 142.42 -252.07 151.72 -256 161.38 C-256.3 162.12 -256.3 162.12 -257.84 165.88 C-301.6 274.58 -300.71 406.34 -255.54 514.42 C-241.7 546.61 -224.45 576.64 -200 602 C-199.56 602.48 -199.56 602.48 -197.32 604.91 C-174.88 628.53 -144.67 644.55 -112 647 C-75.16 647.76 -44.61 630.4 -18.17 606.11 C-14.89 602.92 -11.95 599.49 -9 596 C-7.8 594.72 -6.61 593.44 -5.38 592.12 C4.9 580.55 13.36 567.42 21 554 C21.8 552.63 22.6 551.25 23.42 549.84 C42.76 516 54.93 479.02 63.44 441.12 C63.77 439.66 64.1 438.19 64.44 436.68 C66.5 427.17 67.96 417.68 69 408 C64.84 409.66 60.9 411.48 56.88 413.44 C36.87 422.81 14.58 423.64 -6.43 416.9 C-28.86 408.71 -45.02 394.21 -56 373 C-57.95 368.4 -59.6 363.79 -61 359 C-61.36 357.81 -61.73 356.63 -62.11 355.4 C-66.6 333.3 -62.3 311.27 -51 292 C-37.73 272.01 -18.48 259.12 5 254 C26.57 250.45 45.84 255.15 65 265 C66.32 265.33 67.64 265.66 69 266 C65.64 239.39 59.47 213.43 51 188 C50.44 186.27 49.87 184.54 49.29 182.75 C29.88 125.11 -5.04 65.72 -61.19 37.75 C-113.71 13.81 -166.24 36.21 -203.5 75.69 Z ",
        fill: "currentColor",
        transform: "translate(406,175)",
      }),
      e.jsx("path", {
        d: "M0 0 C1.61 0.81 3.22 1.62 4.88 2.46 C17.18 8.94 28.07 16.47 39 25 C40.2 25.93 41.4 26.86 42.63 27.82 C45.14 29.82 47.58 31.9 50 34 C50 34.66 50 35.32 50 36 C51.32 36.66 52.64 37.32 54 38 C75.5 57.71 92.39 81.92 107 107 C107.28 107.46 107.28 107.46 108.72 109.79 C136.12 154.7 151.92 209.45 160 261 C160.26 262.48 160.52 263.96 160.79 265.48 C163.31 280.22 164.67 295.11 166 310 C166.09 310.91 166.09 310.91 166.53 315.52 C167.11 322.58 167.18 329.62 167.2 336.7 C167.21 338.1 167.21 339.49 167.22 340.93 C167.23 343.88 167.24 346.82 167.24 349.77 C167.25 354.17 167.28 358.56 167.31 362.96 C167.41 388.5 165.39 413.67 161.62 438.94 C161.52 439.67 161.52 439.67 160.98 443.35 C159.08 456 156.81 468.52 154 481 C153.77 482.06 153.53 483.11 153.29 484.2 C146.57 514.08 136.68 543.13 124 571 C123.58 571.93 123.16 572.87 122.73 573.83 C109.47 603.13 92.02 629.72 71 654 C69.89 655.29 68.78 656.58 67.64 657.9 C57.39 669.45 46.43 679.85 34 689 C32.89 689.84 31.79 690.68 30.65 691.54 C-6.81 719.31 -53.14 733.13 -99.63 726.75 C-130.53 721.42 -160.67 710.9 -186 692 C-187.13 691.17 -188.27 690.33 -189.43 689.48 C-206.14 676.92 -223.17 662.05 -234 644 C-232.89 640.66 -232.89 640.66 -230.82 636.86 C-230.08 635.45 -229.33 634.05 -228.56 632.61 C-227.76 631.15 -226.95 629.69 -226.12 628.19 C-220.24 617.3 -214.77 606.42 -210 595 C-209.27 593.26 -208.54 591.51 -207.79 589.72 C-207.5 589.02 -207.5 589.02 -206.06 585.5 C-205.48 584.07 -204.89 582.63 -204.29 581.16 C-203.86 580.11 -203.44 579.07 -203 578 C-199.21 581.79 -197.49 584.57 -195.06 589.25 C-175.77 624.13 -140.43 648.95 -102.57 660 C-72.56 667.77 -44.25 661.7 -17.79 646.36 C-9.27 641.06 -1.65 634.91 5.71 628.1 C7.71 626.27 9.78 624.53 11.88 622.81 C27.43 608.44 39.57 590.31 50 572 C50.79 570.66 51.58 569.32 52.39 567.95 C59.12 556.26 64.59 544.16 69.83 531.76 C70.79 529.5 71.77 527.24 72.75 524.98 C85.75 494.11 93.15 460.04 98 427 C94.3 428.48 91.05 430.01 87.56 431.88 C67.31 442.09 43.45 442.7 22.05 435.71 C-0.82 427.06 -17.83 411.28 -28.31 389.17 C-37.27 367.07 -37 342.98 -28 321 C-23.88 311.94 -18.64 304.39 -12 297 C-10.78 295.64 -9.57 294.28 -8.31 292.88 C9.41 276.95 31.08 269.16 54.79 269.73 C70.68 270.76 84.36 275.81 98 284 C91.33 245.43 82.5 209.04 67 173 C66.22 171.18 65.45 169.36 64.65 167.49 C53.3 141.56 38.48 118.36 20 97 C18.76 95.56 17.52 94.11 16.25 92.62 C-6.27 67.51 -36.62 49.04 -70.73 46.75 C-101.54 46.19 -132.03 57.99 -156 77 C-156.91 77.71 -157.82 78.42 -158.76 79.14 C-175.05 92.1 -175.05 92.1 -178 98 C-178.66 98 -179.32 98 -180 98 C-180.66 99.32 -181.32 100.64 -182 102 C-183.31 103.75 -184.65 105.47 -186 107.19 C-190.94 113.65 -194.94 120.53 -198.93 127.61 C-201 131 -201 131 -203 132 C-203.61 130.59 -204.21 129.19 -204.84 127.74 C-207.54 121.49 -210.27 115.24 -213 109 C-213.42 108.03 -213.84 107.07 -214.28 106.07 C-219.59 93.96 -225.37 82.44 -232.14 71.09 C-232.75 69.74 -233.37 68.39 -234 67 C-232.11 62.28 -230.71 60.28 -227.31 56.69 C-224.31 53.48 -221.37 50.27 -218.5 46.94 C-210.11 37.5 -201.09 29.59 -191 22 C-189.96 21.19 -188.91 20.38 -187.84 19.54 C-134.42 -20.62 -60.12 -30.33 0 0 Z ",
        fill: "currentColor",
        transform: "translate(803,157)",
      }),
    ],
  });
}
function U2(t) {
  return e.jsxs("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M0 0 C1.18 -0 2.37 -0.01 3.59 -0.01 C7.47 -0.02 11.35 -0.01 15.23 -0.01 C17.94 -0.01 20.66 -0.01 23.38 -0.01 C29.05 -0.02 34.73 -0.01 40.41 -0 C47.67 0.01 54.93 0 62.19 -0.01 C67.79 -0.02 73.4 -0.01 79 -0.01 C81.68 -0.01 84.35 -0.01 87.03 -0.01 C90.78 -0.02 94.52 -0.01 98.27 0 C99.36 -0 100.46 -0.01 101.58 -0.01 C121.37 0.1 133.38 6.74 147.17 20.39 C148.06 21.26 148.94 22.14 149.85 23.04 C151.71 24.88 153.57 26.72 155.43 28.57 C158.24 31.37 161.08 34.15 163.92 36.92 C165.74 38.72 167.55 40.53 169.36 42.33 C170.2 43.15 171.04 43.96 171.91 44.8 C184.07 57.05 186.86 70.05 186.86 86.98 C186.85 88.59 186.84 90.2 186.83 91.86 C186.83 92.7 186.83 92.7 186.82 96.93 C186.81 102.25 186.79 107.57 186.76 112.88 C186.75 116.5 186.74 120.12 186.73 123.73 C186.71 132.57 186.68 141.42 186.63 150.26 C187.45 150.25 187.45 150.25 191.58 150.18 C197.69 150.09 203.8 150.03 209.9 149.98 C212.54 149.96 215.17 149.93 217.8 149.88 C221.61 149.82 225.41 149.79 229.21 149.77 C230.38 149.74 231.54 149.72 232.74 149.69 C242.98 149.69 251.55 152.37 259.51 158.95 C268.6 168.45 272.18 177.62 271.94 190.69 C270.97 201.91 265.22 210.27 256.82 217.57 C249.01 222.59 242.11 224.76 232.85 224.76 C230.96 224.77 229.07 224.78 227.12 224.79 C225.08 224.78 223.05 224.77 221.01 224.75 C218.9 224.76 216.78 224.76 214.67 224.76 C210.25 224.76 205.83 224.75 201.41 224.73 C195.77 224.7 190.13 224.7 184.49 224.71 C180.13 224.72 175.77 224.71 171.4 224.7 C169.32 224.69 167.24 224.69 165.17 224.7 C162.25 224.7 159.34 224.68 156.42 224.66 C154.77 224.66 153.12 224.65 151.41 224.65 C139.83 223.71 130.33 219 122.63 210.26 C114.45 200.41 111.71 190.77 111.32 178.23 C111.28 176.95 111.23 175.66 111.19 174.33 C111.15 173.01 111.11 171.69 111.07 170.32 C111.03 168.97 110.99 167.62 110.94 166.23 C110.84 162.9 110.73 159.58 110.63 156.26 C104.08 162.5 97.56 168.78 91.08 175.1 C88.87 177.25 86.64 179.38 84.41 181.5 C81.21 184.55 78.05 187.64 74.89 190.73 C73.88 191.68 72.86 192.63 71.82 193.6 C69.35 196.07 67.26 198.17 65.63 201.26 C67.65 205.01 67.65 205.01 71.63 208.26 C72.68 209.33 73.72 210.4 74.79 211.5 C75.89 212.58 77 213.67 78.13 214.79 C79.35 215.99 80.57 217.2 81.82 218.44 C84.36 220.94 86.9 223.44 89.45 225.94 C101.78 238.17 111.66 249.28 111.81 267.42 C111.82 267.98 111.82 267.98 111.83 270.8 C111.83 271.39 111.83 271.39 111.85 274.37 C111.88 278.28 111.89 282.19 111.91 286.1 C111.91 287.44 111.92 288.77 111.92 290.15 C111.95 297.23 111.97 304.32 111.98 311.4 C112 317.25 112.03 323.1 112.07 328.95 C112.12 336.02 112.14 343.09 112.15 350.16 C112.15 352.85 112.17 355.54 112.19 358.23 C112.23 362 112.23 365.78 112.22 369.56 C112.23 370.65 112.25 371.75 112.27 372.88 C112.17 385.13 107.88 395.19 99.63 404.26 C89 413.66 78.82 416.66 65 416.53 C52.88 415.78 43.24 409.37 35.26 400.51 C29.35 390.95 26.1 382.28 27.43 370.97 C35.63 293.82 35.63 293.82 15.8 268.97 C3.27 254.24 -11.61 241.45 -26.99 229.8 C-38.93 220.71 -45.54 211.11 -47.87 196.02 C-49.39 181.76 -45.93 169.37 -38.37 157.26 C-29.76 146.92 -19.84 137.6 -10.32 128.11 C-8.81 126.61 -7.3 125.1 -5.8 123.6 C-1.87 119.68 2.05 115.76 5.98 111.84 C10.01 107.83 14.03 103.81 18.05 99.8 C25.91 91.95 33.77 84.1 41.63 76.26 C7.6 73.76 7.6 73.76 -1.05 78.94 C-5.25 82.62 -8.6 86.34 -11.99 90.76 C-14.33 93.48 -16.68 96.2 -19.03 98.92 C-20.09 100.19 -21.16 101.47 -22.26 102.79 C-29.88 111.3 -38.43 116.36 -49.74 118.07 C-60.68 118.44 -68.84 115.36 -78.05 109.57 C-86.51 101.11 -90.42 92.34 -90.87 80.45 C-90.31 58.52 -71.46 45.1 -57.05 30.59 C-55.25 28.78 -53.47 26.96 -51.68 25.14 C-49.07 22.47 -46.44 19.82 -43.8 17.17 C-43.02 16.37 -42.24 15.56 -41.43 14.73 C-29.3 2.65 -17.04 -0.06 0 0 Z M-27.15 30.64 C-28.02 31.5 -28.89 32.36 -29.79 33.24 C-30.71 34.16 -31.62 35.08 -32.57 36.03 C-33.53 36.98 -34.49 37.94 -35.48 38.92 C-37.5 40.93 -39.51 42.95 -41.53 44.97 C-44.61 48.06 -47.7 51.13 -50.8 54.2 C-52.77 56.16 -54.73 58.13 -56.69 60.09 C-57.62 61 -58.54 61.92 -59.5 62.86 C-64.95 68.38 -68.9 72.83 -69.74 80.82 C-69.13 86.4 -67.43 89.28 -63.3 93.07 C-58.21 96.86 -54.76 96.64 -48.37 96.26 C-42.53 93.37 -40.38 89.3 -37.17 83.77 C-28.95 71.42 -19.66 60.45 -5.37 55.26 C26.53 49.1 61.46 52.98 93.63 55.26 C93.05 55.84 92.46 56.43 91.85 57.03 C77.51 71.29 63.18 85.55 48.86 99.83 C41.93 106.73 35.01 113.63 28.07 120.52 C21.38 127.17 14.69 133.83 8.02 140.5 C5.47 143.04 2.91 145.58 0.36 148.12 C-3.22 151.67 -6.79 155.23 -10.35 158.79 C-11.42 159.84 -12.48 160.89 -13.57 161.97 C-21.45 169.89 -26.41 176.89 -26.68 188.38 C-26.54 198.6 -23.02 205.07 -16.14 212.56 C-12.14 216.45 -7.73 219.64 -3.22 222.94 C18.88 239.33 45.04 259.17 49.49 287.94 C52.59 312.43 51.01 337.82 48.67 362.33 C48.5 364.18 48.33 366.03 48.15 367.94 C47.98 369.55 47.81 371.17 47.64 372.83 C47.63 378.67 49.29 382.94 52.2 387.95 C57.08 392.58 62.51 394.96 69.13 395.88 C77.2 394.76 82.18 392.13 87.2 385.7 C90.77 379.19 90.79 373.72 90.81 366.48 C90.82 365.93 90.82 365.93 90.83 363.16 C90.85 359.52 90.86 355.88 90.87 352.25 C90.88 351 90.88 349.76 90.89 348.48 C90.91 341.9 90.92 335.32 90.93 328.75 C90.94 321.96 90.98 315.17 91.02 308.38 C91.04 303.16 91.05 297.93 91.05 292.71 C91.06 290.2 91.07 287.7 91.09 285.2 C91.11 281.69 91.11 278.19 91.1 274.68 C91.12 273.65 91.13 272.63 91.14 271.57 C91.09 263.51 89.31 257.55 84.2 251.27 C83.3 250.39 82.4 249.52 81.47 248.62 C80.95 248.12 80.95 248.12 78.35 245.57 C77.25 244.51 76.15 243.45 75.02 242.36 C72.7 240.09 70.38 237.81 68.06 235.53 C64.39 231.97 60.72 228.41 57.05 224.86 C53.51 221.41 49.98 217.95 46.46 214.49 C45.34 213.42 44.23 212.36 43.08 211.26 C42.07 210.27 41.06 209.27 40.03 208.25 C39.13 207.38 38.23 206.51 37.3 205.62 C36.75 204.84 36.2 204.06 35.63 203.26 C38.31 197.9 42.38 194.25 46.58 190.08 C47.51 189.16 48.44 188.23 49.39 187.27 C52.46 184.21 55.54 181.15 58.61 178.09 C60.74 175.96 62.87 173.84 64.99 171.71 C70.59 166.12 76.2 160.53 81.81 154.95 C87.53 149.25 93.25 143.54 98.96 137.83 C110.18 126.64 121.41 115.45 132.63 104.26 C132.64 104.77 132.64 104.77 132.65 107.36 C132.69 118 132.76 128.64 132.84 139.28 C132.87 143.25 132.89 147.22 132.91 151.19 C132.93 156.9 132.97 162.61 133.03 168.32 C133.03 169.21 133.03 169.21 133.03 173.7 C133.05 175.36 133.07 177.02 133.09 178.73 C133.1 180.19 133.11 181.64 133.12 183.15 C133.94 189.69 136.38 194 141.01 198.63 C147.05 203.01 151.9 203.51 159.28 203.55 C160.15 203.56 160.15 203.56 164.55 203.59 C166.42 203.59 168.3 203.59 170.22 203.59 C172.15 203.6 174.08 203.61 176.07 203.61 C180.15 203.63 184.22 203.63 188.3 203.63 C193.52 203.63 198.73 203.66 203.95 203.69 C208.94 203.72 213.92 203.72 218.91 203.72 C219.85 203.73 219.85 203.73 224.58 203.76 C226.32 203.76 228.06 203.75 229.86 203.74 C230.62 203.75 230.62 203.75 234.49 203.75 C240.29 203.06 244.06 200.96 248.01 196.7 C250.98 192.25 251.02 188.52 250.63 183.26 C248.44 178.38 246.09 175.23 241.63 172.26 C238.1 171.08 235.32 171.14 231.59 171.15 C230.13 171.15 228.67 171.15 227.16 171.15 C225.58 171.15 224 171.16 222.37 171.16 C220.76 171.16 219.14 171.16 217.48 171.17 C212.3 171.17 207.12 171.18 201.95 171.2 C198.44 171.2 194.94 171.21 191.44 171.21 C182.84 171.22 174.24 171.24 165.63 171.26 C165.64 170.09 165.65 168.92 165.65 167.71 C165.72 156.66 165.76 145.61 165.79 134.57 C165.81 128.89 165.83 123.21 165.86 117.53 C165.89 112.04 165.91 106.56 165.92 101.07 C165.92 98.98 165.94 96.89 165.95 94.8 C165.97 91.87 165.97 88.94 165.98 86 C165.98 84.33 165.99 82.67 166 80.95 C165.27 71.47 162.15 66.02 155.63 59.26 C155.01 58.6 155.01 58.6 151.83 55.28 C148.22 51.61 144.6 47.94 140.96 44.29 C139.41 42.72 137.85 41.15 136.3 39.57 C134.05 37.27 131.78 34.99 129.51 32.71 C128.17 31.35 126.82 29.99 125.44 28.59 C118.1 22.16 111.51 21.82 102.02 21.85 C100.76 21.85 99.5 21.84 98.21 21.83 C94.06 21.82 89.91 21.82 85.76 21.83 C82.87 21.82 79.98 21.82 77.1 21.81 C71.05 21.8 65 21.8 58.95 21.81 C51.2 21.82 43.45 21.8 35.7 21.77 C29.73 21.76 23.77 21.76 17.81 21.76 C14.95 21.76 12.09 21.76 9.24 21.74 C5.24 21.73 1.25 21.74 -2.75 21.76 C-3.93 21.75 -5.11 21.74 -6.32 21.73 C-15.62 21.81 -20.68 24.22 -27.15 30.64 Z ",
        fill: "currentColor",
        transform: "translate(229.365234375,89.7412109375)",
      }),
      e.jsx("path", {
        d: "M0 0 C4.9 3.52 8.92 7.43 12.99 11.83 C14.53 13.44 16.06 15.04 17.6 16.64 C19.99 19.15 22.36 21.67 24.72 24.21 C27.01 26.68 29.34 29.1 31.68 31.52 C32.38 32.3 33.08 33.08 33.81 33.88 C35.84 35.94 35.84 35.94 39.71 38.38 C43.5 36.04 43.5 36.04 46.71 32.38 C47.79 31.18 48.87 29.98 49.99 28.74 C51.05 27.55 52.11 26.36 53.21 25.13 C56.62 21.7 56.62 21.7 59.71 19.38 C63.52 21.07 63.52 21.07 66.71 25.38 C68.21 26.77 69.73 28.15 71.27 29.5 C71.84 30.14 71.84 30.14 74.71 33.38 C71.11 40.57 64.85 45.96 59.27 51.68 C57.76 53.24 56.27 54.8 54.8 56.38 C52.67 58.65 50.5 60.88 48.32 63.11 C47.03 64.45 45.74 65.8 44.41 67.19 C43.8 67.55 43.8 67.55 40.71 69.38 C37.35 67.4 37.35 67.4 33.71 63.38 C32.15 61.82 30.58 60.27 29.01 58.72 C27.25 56.92 25.48 55.12 23.71 53.31 C21.77 51.34 19.83 49.37 17.89 47.41 C14.85 44.33 11.82 41.24 8.8 38.15 C5.87 35.15 2.92 32.17 -0.04 29.18 C-0.93 28.26 -1.82 27.34 -2.75 26.39 C-9.05 20.06 -14.69 15.88 -23.86 14.88 C-28.8 15.44 -31.99 16.93 -36.29 19.38 C-37.28 19.71 -38.27 20.04 -39.29 20.38 C-43.69 29.16 -45.33 35.84 -42.29 45.38 C-35.14 53.92 -27.15 61.71 -19.28 69.59 C-18.62 70.26 -18.62 70.26 -15.26 73.63 C-12.47 76.43 -9.68 79.23 -6.88 82.03 C-3.31 85.61 0.26 89.2 3.82 92.79 C7.24 96.23 10.67 99.66 14.09 103.09 C15.37 104.38 16.64 105.67 17.96 107 C19.15 108.18 20.34 109.37 21.57 110.6 C22.61 111.65 23.65 112.69 24.73 113.77 C29.67 118.1 33.66 119.8 40.21 119.75 C40.75 119.76 40.75 119.76 43.49 119.78 C55.33 118.31 64.45 105.75 72.29 97.68 C74.06 95.88 75.84 94.07 77.61 92.27 C80.37 89.46 83.12 86.65 85.86 83.82 C88.53 81.08 91.22 78.35 93.92 75.62 C94.33 75.19 94.33 75.19 96.41 73.02 C98.74 70.68 98.74 70.68 102.71 67.38 C106.96 69.51 109.83 71.86 113.33 75.07 C114.48 76.08 115.63 77.1 116.81 78.14 C117.43 79.21 118.06 80.28 118.71 81.38 C114.16 87.54 108.42 92.84 103.03 98.26 C102.11 99.19 101.18 100.12 100.23 101.08 C98.28 103.04 96.33 104.99 94.38 106.95 C91.41 109.93 88.45 112.92 85.49 115.91 C83.59 117.82 81.68 119.73 79.78 121.63 C78.9 122.52 78.03 123.41 77.13 124.32 C66.98 134.44 55.85 141.82 41.14 142.63 C21.51 141.73 10.47 130.78 -2.81 117.47 C-4.4 115.89 -5.98 114.31 -7.57 112.74 C-10.88 109.44 -14.18 106.13 -17.48 102.82 C-21.69 98.6 -25.92 94.41 -30.16 90.22 C-33.43 86.97 -36.7 83.71 -39.96 80.44 C-41.51 78.89 -43.07 77.34 -44.63 75.8 C-56.83 63.74 -65.27 53.35 -66.67 35.63 C-65.97 25.8 -63.04 17.42 -57.29 9.38 C-56.74 8.53 -56.18 7.69 -55.61 6.82 C-40.51 -9.1 -18.41 -11.23 0 0 Z ",
        fill: "currentColor",
        transform: "translate(98.29443359375,278.6201171875)",
      }),
      e.jsx("path", {
        d: "M0 0 C12.67 11.18 21.49 25.36 23.56 42.38 C24.69 61.85 20.36 79.02 7.19 93.95 C-5.85 107.16 -21.58 114.25 -40.25 114.7 C-58.28 114.37 -73.96 107.91 -86.89 95.16 C-99.55 81.37 -105.01 65.03 -104.68 46.39 C-103.62 28.65 -95.45 13.33 -82.44 1.38 C-58.81 -18.83 -24.39 -18.57 0 0 Z M-68.81 17.76 C-78.71 27.65 -83.29 38.53 -83.44 52.38 C-82.11 65.34 -76.73 75.97 -66.88 84.45 C-55.92 91.7 -46.1 94.17 -32.94 92.82 C-20.18 89.49 -10.77 83.46 -3.44 72.38 C2.62 60.86 3.9 50.14 0.56 37.38 C-4.6 24.87 -11.64 16.28 -24.19 10.57 C-40.04 4.39 -55.27 8.23 -68.81 17.76 Z ",
        fill: "currentColor",
        transform: "translate(488.4375,18.6171875)",
      }),
      e.jsx("path", {
        d: "M0 0 C13.8 -0.02 27.61 -0.04 41.41 -0.05 C47.82 -0.06 54.23 -0.06 60.64 -0.08 C66.82 -0.09 72.99 -0.09 79.17 -0.09 C81.54 -0.1 83.9 -0.1 86.26 -0.11 C89.56 -0.11 92.86 -0.11 96.16 -0.11 C98.04 -0.12 99.92 -0.12 101.86 -0.12 C106 0 106 0 107 1 C107.1 4.33 107.13 7.67 107.12 11 C107.13 11.92 107.13 11.92 107.13 16.56 C107 21 107 21 106 22 C102.72 22.1 99.44 22.12 96.16 22.11 C95.64 22.11 95.64 22.11 93.02 22.11 C89.59 22.11 86.15 22.11 82.71 22.1 C80.34 22.1 77.96 22.09 75.59 22.09 C69.32 22.09 63.06 22.08 56.79 22.07 C50.41 22.06 44.02 22.05 37.63 22.05 C25.09 22.04 12.54 22.02 0 22 C0 14.74 0 7.48 0 0 Z ",
        fill: "currentColor",
        transform: "translate(32,90)",
      }),
      e.jsx("path", {
        d: "M0 0 C31.68 0 63.36 0 96 0 C96 6.93 96 13.86 96 21 C64.32 21 32.64 21 0 21 C0 14.07 0 7.14 0 0 Z ",
        fill: "currentColor",
        transform: "translate(0,165)",
      }),
    ],
  });
}
function Z1(t) {
  return e.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 1024 1024",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      d: "M0 0 C30.37 22.25 49.39 51.78 56.65 88.79 C61.83 123.73 53.61 158.83 33.78 188.04 C24.13 200.68 13.08 212.26 -0.22 221.04 C-0.71 221.36 -0.71 221.36 -3.17 223.02 C-17.6 232.35 -34.07 239.84 -51.22 242.04 C-49.54 244.83 -47.85 247.62 -46.16 250.41 C-45.22 251.96 -44.28 253.52 -43.31 255.12 C-40.66 259.35 -37.88 263.41 -35 267.48 C-31.99 271.8 -29.21 276.27 -26.41 280.72 C-21.55 288.41 -16.61 296.02 -11.54 303.57 C-9.12 307.2 -6.76 310.86 -4.41 314.54 C-3.68 315.67 -2.94 316.81 -2.19 317.98 C-0.59 320.46 0.97 322.96 2.53 325.47 C3.27 326.32 4.01 327.16 4.78 328.04 C9.29 327.13 11.74 326.16 15.66 323.96 C16.81 323.32 17.97 322.68 19.16 322.02 C20.39 321.32 21.63 320.63 22.9 319.91 C23.55 319.55 23.55 319.55 26.81 317.74 C30.8 315.51 34.79 313.27 38.78 311.04 C52.18 303.53 65.58 296.04 79.15 288.85 C80.13 288.32 81.11 287.79 82.12 287.25 C103.57 276 127.87 274.42 151.11 280.89 C175.91 288.65 194.61 305.16 206.59 328.04 C217.17 350.15 218.88 374.95 211.75 398.43 C201.4 427.34 180.92 443.8 154.66 457.86 C148.81 461 143.04 464.25 137.28 467.54 C128.79 472.35 120.26 477.07 111.69 481.73 C101.12 487.47 90.61 493.32 80.12 499.21 C67.48 506.3 54.82 513.35 42.12 520.33 C36.87 523.22 31.63 526.11 26.43 529.09 C2.99 542.51 -22.89 547.53 -49.54 541.04 C-63.09 536.81 -75.52 530.41 -86.22 521.04 C-86.92 520.43 -87.61 519.83 -88.33 519.21 C-96.99 511.18 -103.08 501.3 -109.47 491.47 C-110.63 489.71 -111.78 487.96 -112.94 486.2 C-115.07 482.96 -117.2 479.72 -119.31 476.48 C-120.27 475.01 -121.23 473.55 -122.22 472.04 C-122.76 471.19 -123.3 470.34 -123.85 469.47 C-125.26 467.29 -126.74 465.16 -128.22 463.04 C-128.88 463.04 -129.54 463.04 -130.22 463.04 C-131.51 465.09 -132.7 467.21 -133.85 469.35 C-138.03 476.96 -142.4 484.45 -146.85 491.91 C-153.04 502.32 -159.15 512.78 -165.17 523.28 C-165.75 524.29 -166.33 525.29 -166.92 526.32 C-167.46 527.28 -168.01 528.24 -168.57 529.22 C-169.69 531.13 -170.85 533.01 -172.05 534.86 C-173.55 537.18 -174.9 539.6 -176.22 542.04 C-174.23 546.03 -173.04 547.28 -169.66 549.97 C-169.17 550.37 -169.17 550.37 -166.67 552.36 C-161.35 556.49 -155.99 560.56 -150.63 564.63 C-145 568.98 -139.5 573.47 -134 577.98 C-129.54 581.59 -125 585.09 -120.43 588.57 C-115.82 592.11 -111.25 595.72 -106.68 599.32 C-103.42 601.88 -100.14 604.4 -96.85 606.91 C-67.73 629.26 -44.69 649.83 -38.79 687.6 C-35.48 713.32 -45.25 736.67 -55 759.89 C-59.47 770.57 -63.76 781.31 -68.04 792.06 C-79.39 820.58 -79.39 820.58 -85.1 834.22 C-90.85 848 -96.38 861.86 -101.91 875.72 C-102.87 878.12 -103.82 880.51 -104.78 882.91 C-112.55 902.35 -112.55 902.35 -115.78 910.46 C-118.09 916.24 -120.41 922.01 -122.72 927.79 C-123.4 929.48 -124.07 931.18 -124.77 932.93 C-135.72 960.14 -151.95 982.2 -179.47 994.47 C-203.13 1003.93 -229.05 1003.77 -252.52 993.83 C-262.95 988.78 -272.04 982.21 -280.22 974.04 C-281.05 973.22 -281.89 972.4 -282.74 971.55 C-300.55 953.06 -307.8 929.59 -307.46 904.27 C-306.45 882.09 -295.93 860.95 -287.54 840.72 C-285.95 836.88 -284.37 833.04 -282.79 829.2 C-282.4 828.26 -282.02 827.31 -281.61 826.34 C-277.43 816.13 -273.38 805.87 -269.37 795.59 C-266.84 789.12 -264.27 782.67 -261.58 776.26 C-258.74 769.51 -255.96 762.74 -253.16 755.97 C-252.55 754.5 -251.94 753.02 -251.31 751.5 C-250.13 748.64 -248.96 745.78 -247.81 742.92 C-246.82 740.5 -245.79 738.1 -244.71 735.72 C-243.45 732.82 -243.45 732.82 -242.22 728.04 C-244.22 724.91 -244.22 724.91 -247.66 722.47 C-248.89 721.56 -250.12 720.65 -251.39 719.71 C-252.65 718.83 -253.92 717.94 -255.22 717.04 C-257.33 715.42 -259.44 713.79 -261.54 712.16 C-262.61 711.34 -263.68 710.53 -264.79 709.69 C-268.57 706.76 -272.27 703.75 -275.97 700.72 C-283.03 694.96 -290.22 689.4 -297.48 683.91 C-299.87 682.07 -302.23 680.18 -304.53 678.22 C-307.22 676.04 -307.22 676.04 -310.22 675.04 C-310.88 676.69 -311.54 678.34 -312.22 680.04 C-314.02 683.14 -315.86 686.22 -317.72 689.29 C-318.81 691.08 -319.9 692.88 -320.99 694.68 C-321.53 695.57 -322.08 696.47 -322.64 697.4 C-324.96 701.26 -327.21 705.15 -329.47 709.04 C-344.25 734.14 -361.9 752.9 -390.43 762.06 C-399.3 764.34 -407.66 765.33 -416.8 765.3 C-417.91 765.3 -419.03 765.3 -420.17 765.31 C-423.88 765.32 -427.58 765.31 -431.28 765.31 C-433.94 765.31 -436.61 765.32 -439.27 765.33 C-446.5 765.34 -453.72 765.34 -460.94 765.34 C-466.98 765.34 -473.01 765.34 -479.05 765.35 C-493.31 765.36 -507.56 765.36 -521.81 765.35 C-536.49 765.34 -551.17 765.36 -565.85 765.38 C-578.47 765.4 -591.09 765.4 -603.72 765.4 C-611.25 765.4 -618.78 765.4 -626.31 765.41 C-633.39 765.43 -640.48 765.42 -647.57 765.41 C-650.16 765.41 -652.75 765.41 -655.34 765.42 C-687.18 765.51 -711.76 759.04 -735.41 737.16 C-754.28 716.75 -761.27 692.38 -760.4 664.98 C-758.9 639.77 -745.69 618.46 -727.22 602.04 C-708.62 587.07 -688.38 581.42 -664.78 581.49 C-663 581.48 -661.23 581.47 -659.41 581.46 C-653.59 581.43 -647.77 581.43 -641.96 581.43 C-637.88 581.41 -633.8 581.39 -629.72 581.38 C-620.08 581.34 -610.45 581.31 -600.81 581.3 C-589.95 581.29 -579.09 581.25 -568.23 581.21 C-553.05 581.15 -537.88 581.1 -522.7 581.08 C-519.11 581.07 -515.51 581.06 -511.92 581.04 C-504.12 581.01 -496.33 581.03 -488.53 581.24 C-487.88 581.26 -487.88 581.26 -484.57 581.33 C-482.2 581.38 -479.84 581.46 -477.47 581.56 C-472.4 581.66 -469.84 581.56 -465.88 578.24 C-463.37 574.33 -461.89 570.37 -460.22 566.04 C-458.23 562.26 -456.06 558.59 -453.91 554.91 C-452.78 552.92 -451.66 550.92 -450.54 548.92 C-442.42 534.5 -434.15 520.16 -425.86 505.83 C-421.75 498.72 -417.69 491.57 -413.66 484.41 C-408 474.35 -402.2 464.38 -396.37 454.42 C-392.6 447.98 -388.91 441.51 -385.22 435.04 C-378.21 422.74 -371.17 410.46 -364.09 398.21 C-360.71 392.35 -357.34 386.49 -353.99 380.61 C-353.29 379.38 -352.59 378.14 -351.86 376.87 C-350.52 374.52 -349.19 372.17 -347.85 369.81 C-344.04 363.12 -340.1 356.52 -336.02 349.99 C-333.24 345.43 -330.75 340.74 -328.22 336.04 C-326.89 333.7 -325.56 331.36 -324.22 329.04 C-330.81 328.93 -337.39 328.89 -343.97 328.91 C-346.21 328.91 -348.45 328.89 -350.69 328.85 C-353.91 328.8 -357.13 328.81 -360.36 328.84 C-362.29 328.83 -364.23 328.82 -366.23 328.81 C-371.22 330.04 -371.22 330.04 -374.72 334.77 C-375.54 336.51 -376.37 338.25 -377.22 340.04 C-377.77 341.02 -378.32 342 -378.89 343.01 C-379.32 343.82 -379.75 344.62 -380.2 345.45 C-380.7 346.39 -381.2 347.32 -381.71 348.28 C-381.97 348.76 -381.97 348.76 -383.29 351.22 C-388.22 360.39 -393.27 369.48 -398.41 378.52 C-402.11 385.03 -405.72 391.58 -409.29 398.16 C-411.26 401.79 -413.24 405.41 -415.22 409.04 C-415.73 409.97 -416.24 410.9 -416.77 411.86 C-422.47 422.24 -428.07 432.33 -436.22 441.04 C-436.9 441.79 -437.58 442.55 -438.29 443.34 C-455.69 461.86 -478.55 470.85 -503.6 472.29 C-531.68 471.04 -554.47 460.61 -573.91 440.58 C-590.62 422.15 -598.1 397.85 -597.04 373.29 C-594.61 343.6 -576.83 317.62 -562.26 292.38 C-558.12 285.16 -554.22 277.81 -550.29 270.47 C-546.25 262.93 -542.14 255.43 -537.97 247.96 C-534.43 241.62 -530.92 235.27 -527.41 228.91 C-526.73 227.67 -526.04 226.43 -525.33 225.16 C-522.05 219.2 -518.78 213.23 -515.59 207.22 C-515.02 206.16 -514.45 205.09 -513.86 203.99 C-512.81 202.02 -511.77 200.04 -510.74 198.06 C-498.13 174.4 -479.42 157.98 -454.22 148.66 C-439.68 144.36 -424.5 144.75 -409.48 144.81 C-407.23 144.81 -404.98 144.81 -402.73 144.81 C-396.67 144.81 -390.62 144.82 -384.56 144.83 C-378.21 144.84 -371.87 144.85 -365.52 144.85 C-353.52 144.85 -341.52 144.87 -329.52 144.89 C-315.85 144.91 -302.19 144.92 -288.52 144.93 C-260.42 144.96 -232.32 144.99 -204.22 145.04 C-204.43 144.14 -204.64 143.25 -204.86 142.33 C-205.13 141.16 -205.4 139.99 -205.68 138.79 C-205.95 137.63 -206.22 136.47 -206.5 135.27 C-213.88 102.16 -205.04 67.68 -188.22 39.04 C-182.95 31.08 -176.76 23.97 -170.22 17.04 C-169.03 15.74 -167.83 14.44 -166.6 13.1 C-146.8 -5.28 -124.31 -15.13 -98.22 -20.96 C-96.63 -21.33 -95.03 -21.7 -93.39 -22.08 C-61.12 -27.59 -26.99 -17.81 0 0 Z M-130.97 61.91 C-146.16 79.56 -149.06 99.47 -148.22 122.04 C-146.35 140.08 -135.42 156.14 -122.22 168.04 C-103.93 182.43 -83.35 186.07 -60.48 183.64 C-47.18 181.08 -35.24 173.92 -25.22 165.04 C-24.05 164 -22.87 162.97 -21.66 161.91 C-8.46 147.03 -1.85 130.58 -1.91 110.72 C-1.89 109.67 -1.88 108.62 -1.86 107.54 C-1.85 89.73 -9.01 72.97 -21.22 60.04 C-22 59.21 -22.77 58.38 -23.57 57.52 C-37.64 43.65 -55.64 37.08 -75.16 36.72 C-96.95 36.93 -116.14 46.17 -130.97 61.91 Z M-450.22 215.04 C-455.76 222.38 -460.1 230.08 -464.35 238.22 C-469.02 247.07 -473.76 255.85 -478.72 264.54 C-484.3 274.3 -489.62 284.18 -494.9 294.1 C-500.17 303.97 -505.6 313.73 -511.17 323.43 C-516.7 333.14 -521.97 342.98 -527.22 352.85 C-527.61 353.57 -527.61 353.57 -529.55 357.21 C-530.26 358.56 -530.98 359.91 -531.72 361.3 C-532.05 361.92 -532.05 361.92 -533.69 365.01 C-537.99 373.51 -537.41 384.18 -534.66 393.1 C-529.16 401.98 -523.28 407.94 -513.22 411.04 C-503.62 412.38 -495.54 411.67 -486.93 407.13 C-479.15 401.11 -474.73 393.15 -470.16 384.66 C-469.52 383.48 -468.87 382.31 -468.21 381.09 C-466.2 377.41 -464.21 373.73 -462.22 370.04 C-461.59 368.87 -460.96 367.7 -460.31 366.5 C-457.9 362.01 -455.48 357.53 -453.07 353.04 C-449.32 346.04 -445.47 339.1 -441.55 332.2 C-438.61 326.94 -435.76 321.65 -432.91 316.35 C-428.59 308.36 -424.24 300.39 -419.79 292.47 C-418.86 290.82 -417.93 289.17 -416.98 287.47 C-411.57 278.77 -405.97 272.91 -395.65 270.41 C-390.57 269.85 -385.51 269.88 -380.41 269.87 C-379.82 269.87 -379.82 269.87 -376.82 269.86 C-372.91 269.84 -368.99 269.84 -365.08 269.83 C-362.36 269.83 -359.63 269.82 -356.91 269.81 C-351.19 269.8 -345.48 269.8 -339.77 269.79 C-332.46 269.79 -325.15 269.77 -317.84 269.74 C-312.22 269.72 -306.59 269.71 -300.96 269.71 C-298.26 269.71 -295.57 269.7 -292.88 269.69 C-289.1 269.67 -285.33 269.67 -281.55 269.68 C-280.45 269.67 -279.34 269.66 -278.21 269.65 C-269.1 269.7 -262.04 271.35 -254.22 276.04 C-253.56 276.04 -252.9 276.04 -252.22 276.04 C-252.22 276.7 -252.22 277.36 -252.22 278.04 C-251.56 278.04 -250.9 278.04 -250.22 278.04 C-244.59 289.31 -241.69 297.53 -245.22 310.04 C-249.48 319.5 -254.67 328.42 -260.04 337.29 C-265.41 346.27 -270.64 355.3 -275.68 364.47 C-278.72 369.93 -281.87 375.33 -285.04 380.72 C-290.17 389.48 -295.21 398.27 -300.19 407.11 C-310.3 425.06 -320.56 442.91 -330.86 460.74 C-334.66 467.33 -338.45 473.93 -342.22 480.54 C-346.62 488.24 -351.04 495.92 -355.47 503.6 C-360.72 512.69 -365.95 521.79 -371.16 530.91 C-371.82 532.07 -372.48 533.23 -373.17 534.42 C-376.55 540.34 -379.92 546.26 -383.3 552.18 C-390.27 564.42 -397.3 576.63 -404.42 588.78 C-408.4 595.59 -412.28 602.45 -416.12 609.34 C-419.11 614.59 -422.23 619.76 -425.38 624.93 C-426.75 627.24 -428.02 629.63 -429.22 632.04 C-430.54 632.7 -431.86 633.36 -433.22 634.04 C-434.69 634.88 -436.15 635.73 -437.66 636.6 C-444.06 640.01 -449.25 640.16 -456.37 640.17 C-457.32 640.17 -457.32 640.17 -462.13 640.18 C-464.24 640.18 -466.35 640.18 -468.45 640.18 C-470.67 640.18 -472.89 640.18 -475.11 640.19 C-479.89 640.2 -484.67 640.2 -489.45 640.2 C-497.02 640.21 -504.58 640.23 -512.15 640.25 C-514.74 640.25 -517.33 640.26 -519.92 640.26 C-520.57 640.27 -520.57 640.27 -523.85 640.27 C-541.46 640.32 -559.07 640.35 -576.68 640.36 C-588.56 640.37 -600.44 640.39 -612.32 640.43 C-618.6 640.45 -624.89 640.46 -631.17 640.46 C-637.09 640.45 -643 640.47 -648.92 640.49 C-651.08 640.5 -653.25 640.5 -655.41 640.49 C-669.66 640.45 -681.53 640.46 -692.28 650.75 C-699.58 659.33 -701.1 669.13 -700.22 680.04 C-697.25 690.15 -691.41 697.76 -682.22 703.04 C-670.31 707.12 -658.05 706.45 -645.61 706.41 C-643.11 706.41 -640.62 706.41 -638.12 706.42 C-631.36 706.43 -624.6 706.42 -617.84 706.41 C-610.76 706.39 -603.68 706.4 -596.59 706.4 C-584.7 706.4 -572.81 706.39 -560.92 706.37 C-547.18 706.35 -533.44 706.35 -519.71 706.35 C-506.47 706.36 -493.24 706.35 -480.01 706.34 C-474.39 706.34 -468.76 706.34 -463.14 706.34 C-456.51 706.34 -449.89 706.33 -443.27 706.32 C-440.84 706.31 -438.41 706.31 -435.98 706.31 C-432.66 706.32 -429.34 706.31 -426.03 706.3 C-424.17 706.29 -422.31 706.29 -420.4 706.29 C-408.8 705.72 -399.42 703.22 -391.27 694.59 C-386.92 689.17 -383.66 683.05 -380.22 677.04 C-378.71 674.47 -377.19 671.91 -375.67 669.35 C-370.41 660.5 -365.22 651.61 -360.04 642.72 C-359.45 641.72 -358.86 640.72 -358.26 639.68 C-355.6 635.13 -352.95 630.57 -350.33 625.99 C-349.47 624.5 -348.61 623.01 -347.72 621.47 C-347.36 620.83 -347.36 620.83 -345.5 617.59 C-340.09 609.15 -334.17 603.52 -324.22 601.04 C-309.07 599.78 -300.58 605.15 -289.17 614.73 C-285.9 617.47 -282.59 620.07 -279.16 622.6 C-273.22 627 -267.46 631.61 -261.7 636.25 C-258.95 638.45 -256.19 640.63 -253.41 642.79 C-249.58 645.76 -245.78 648.78 -242 651.82 C-238.88 654.31 -235.74 656.77 -232.6 659.22 C-227.46 663.25 -222.39 667.34 -217.35 671.47 C-210.65 676.94 -203.81 682.16 -196.84 687.28 C-194.29 689.23 -191.8 691.27 -189.38 693.38 C-186.22 696.04 -186.22 696.04 -184.22 696.04 C-183.56 697.36 -182.9 698.68 -182.22 700.04 C-181.38 701.56 -180.53 703.09 -179.66 704.66 C-174.5 716.05 -176.6 725.9 -180.78 737.26 C-182.69 742.02 -184.66 746.75 -186.66 751.47 C-188.12 754.97 -189.57 758.46 -191.03 761.96 C-191.74 763.68 -192.46 765.39 -193.2 767.16 C-195.96 773.8 -198.63 780.48 -201.29 787.16 C-205.47 797.68 -209.71 808.17 -213.97 818.66 C-220.5 834.73 -226.98 850.82 -233.44 866.92 C-234.54 869.66 -235.64 872.39 -236.75 875.13 C-238.3 878.99 -239.85 882.86 -241.4 886.72 C-241.87 887.89 -242.35 889.06 -242.83 890.27 C-247.05 900.81 -248.7 909.49 -245.72 920.66 C-241.37 930.03 -235.71 935.57 -226.22 940.04 C-216.28 942.52 -206.78 942.11 -197.86 936.89 C-186.64 929.02 -183.14 917.34 -178.22 905.04 C-177.74 903.82 -177.25 902.6 -176.75 901.35 C-175.68 898.68 -174.62 896.02 -173.55 893.35 C-165.66 873.61 -157.73 853.88 -149.79 834.16 C-149.15 832.59 -148.52 831.02 -147.87 829.41 C-137.53 803.75 -127.19 778.09 -116.73 752.47 C-95.27 699.91 -95.27 699.91 -101.22 684.04 C-108.47 672.44 -120.06 664.51 -130.81 656.4 C-136.46 652.09 -141.94 647.6 -147.43 643.11 C-151.99 639.42 -156.62 635.85 -161.28 632.29 C-164.76 629.63 -168.17 626.89 -171.59 624.14 C-174.66 621.69 -177.75 619.27 -180.85 616.85 C-185.98 612.82 -191.05 608.73 -196.1 604.6 C-202.77 599.15 -209.61 593.96 -216.52 588.82 C-221.55 585.04 -226.41 581.09 -231.22 577.04 C-231.95 576.43 -231.95 576.43 -235.66 573.35 C-242.78 566.72 -244.91 561.03 -245.66 551.41 C-245.43 540.62 -240.38 531.84 -234.69 522.95 C-231.6 518.05 -228.69 513.05 -225.79 508.04 C-224.57 505.95 -223.36 503.87 -222.15 501.78 C-221.52 500.69 -220.88 499.6 -220.23 498.48 C-213.92 487.65 -207.57 476.85 -201.22 466.04 C-200.32 464.49 -199.42 462.95 -198.48 461.37 C-194.87 455.21 -191.24 449.06 -187.59 442.92 C-186.24 440.65 -184.89 438.37 -183.54 436.1 C-183.2 435.53 -183.2 435.53 -181.48 432.63 C-176.02 423.43 -170.66 414.17 -165.36 404.88 C-150.86 379.55 -150.86 379.55 -135.22 375.04 C-126.81 374.24 -120.41 376.09 -113.22 380.47 C-104.53 388.21 -98.78 398.18 -92.72 408.01 C-89.7 412.88 -86.52 417.62 -83.33 422.38 C-78.23 430.03 -73.21 437.73 -68.17 445.43 C-63.23 452.99 -58.25 460.53 -53.22 468.04 C-52.88 468.59 -52.88 468.59 -51.12 471.38 C-50.49 472.25 -49.87 473.13 -49.22 474.04 C-48.56 474.04 -47.9 474.04 -47.22 474.04 C-47.22 474.7 -47.22 475.36 -47.22 476.04 C-37.01 482.84 -28.57 485.43 -16.29 483.1 C-3.1 479.18 8.87 470.89 20.77 464.12 C27.77 460.14 34.82 456.28 41.9 452.47 C51.14 447.5 60.27 442.37 69.36 437.14 C82.79 429.43 96.33 421.91 109.9 414.47 C117.36 410.38 124.8 406.26 132.21 402.1 C132.7 401.83 132.7 401.83 135.18 400.45 C145.05 394.9 150.61 390.01 154.93 379.14 C157.48 369.79 156.31 360.53 151.78 352.04 C147.42 345.93 142.79 341.86 135.78 339.04 C134.87 338.62 133.96 338.21 133.03 337.79 C119.47 334.66 108.78 339.55 97.28 346.35 C95.45 347.42 93.62 348.48 91.79 349.55 C90.82 350.11 89.86 350.67 88.86 351.26 C83.31 354.46 77.7 357.56 72.09 360.66 C70.93 361.3 69.78 361.94 68.59 362.6 C65.32 364.41 62.05 366.23 58.78 368.04 C55.69 369.74 52.61 371.45 49.53 373.16 C48.14 373.93 46.75 374.7 45.31 375.5 C41.87 377.42 38.44 379.36 35.02 381.32 C1.1 400.73 1.1 400.73 -13.25 397.32 C-24.83 393.38 -29.58 386.06 -35.97 376.22 C-36.77 375.01 -37.58 373.79 -38.4 372.53 C-43.34 365 -48.17 357.41 -52.89 349.75 C-55.47 345.64 -58.15 341.62 -60.85 337.6 C-65.78 330.24 -70.59 322.82 -75.35 315.35 C-80.41 307.4 -85.53 299.5 -90.79 291.68 C-93.52 287.6 -96.18 283.47 -98.85 279.35 C-99.37 278.55 -99.89 277.76 -100.43 276.94 C-104.31 271.03 -108.08 265.06 -111.83 259.07 C-113.9 255.83 -115.96 252.59 -118.04 249.35 C-118.51 248.57 -118.51 248.57 -120.94 244.61 C-127 235.24 -132.43 229.7 -142.53 224.83 C-150.12 221.14 -156.63 216.06 -161.83 209.44 C-170.33 201.87 -182.86 203.84 -193.56 203.97 C-196.16 203.96 -198.76 203.96 -201.36 203.95 C-208.4 203.93 -215.44 203.97 -222.48 204.02 C-229.86 204.07 -237.23 204.07 -244.61 204.07 C-256.99 204.08 -269.38 204.12 -281.76 204.19 C-297.65 204.28 -313.54 204.31 -329.43 204.32 C-343.1 204.33 -356.76 204.37 -370.43 204.41 C-374.82 204.43 -379.21 204.43 -383.61 204.44 C-390.51 204.46 -397.4 204.49 -404.3 204.53 C-406.84 204.54 -409.37 204.55 -411.9 204.56 C-415.36 204.56 -418.81 204.59 -422.27 204.61 C-424.2 204.62 -426.14 204.63 -428.13 204.64 C-437.47 205.36 -443.27 208.87 -450.22 215.04 Z ",
      fill: "currentColor",
      transform: "translate(784.22265625,22.96484375)",
    }),
  });
}
function z2(t) {
  return e.jsxs("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 1024 1024",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: [
      e.jsx("path", {
        d: "M0 0 C4.88 4.8 9.06 10.02 12.81 15.75 C12.81 16.41 12.81 17.07 12.81 17.75 C13.49 17.19 14.17 16.64 14.88 16.06 C33.49 1.4 54.76 -6.35 78.54 -3.86 C93.97 -1.48 107.54 4.93 118.81 15.75 C119.58 16.45 120.34 17.15 121.13 17.88 C130.06 26.82 141.81 44.64 141.81 57.75 C142.66 57.04 143.51 56.32 144.38 55.59 C161.56 41.56 180.34 33.73 202.81 34.75 C224.75 37.66 242.2 46.19 256.56 63.19 C262.47 71.48 266.96 79.86 270.94 89.19 C271.9 91.4 272.86 93.62 273.82 95.83 C274.31 96.97 274.8 98.11 275.31 99.28 C277.79 105 280.33 110.68 282.88 116.38 C286.67 124.9 290.42 133.44 294.12 142 C297.31 149.37 300.6 156.69 304.04 163.95 C306.18 168.53 308.24 173.14 310.31 177.75 C312.85 183.42 315.41 189.07 318.06 194.69 C321.33 201.65 324.48 208.67 327.62 215.69 C328.17 216.91 328.72 218.14 329.29 219.41 C330.48 222.08 331.68 224.74 332.87 227.41 C343.02 250.08 353.22 272.72 363.61 295.27 C370.74 310.74 377.78 326.24 384.81 341.75 C386.24 344.9 387.67 348.05 389.1 351.2 C390.32 353.88 391.53 356.56 392.75 359.24 C394.42 362.89 396.14 366.51 397.88 370.12 C404.46 384.37 410.07 399.51 413.81 414.75 C414.22 416.38 414.63 418 415.05 419.68 C419.4 437.78 422.13 456.12 422.81 474.75 C422.85 475.85 422.89 476.95 422.94 478.08 C424.08 541.81 401.87 603.58 357.81 649.75 C357.4 650.19 357.4 650.19 355.29 652.39 C349.49 658.34 343.34 663.62 336.81 668.75 C335.87 669.51 334.93 670.26 333.96 671.04 C274.04 718.44 198.15 747.32 121.25 738.62 C90.72 734.76 62.4 725.1 34.81 711.75 C34.09 711.41 34.09 711.41 30.45 709.69 C-0.14 694.92 -28.47 674.33 -53.39 651.3 C-55.58 649.31 -57.8 647.34 -60.04 645.39 C-70.21 636.47 -79.99 627.25 -89.05 617.2 C-92.08 613.87 -95.16 610.6 -98.26 607.35 C-104.13 601.17 -109.82 594.96 -115.11 588.29 C-117.4 585.49 -119.8 582.84 -122.25 580.19 C-125.35 576.82 -128.3 573.42 -131.12 569.81 C-140.93 557.36 -152.22 546.11 -164.19 535.75 C-166.36 533.76 -168.53 531.76 -170.69 529.75 C-174.23 526.46 -177.79 523.23 -181.44 520.06 C-199.68 503.95 -210.65 484.3 -212.19 459.75 C-213.05 444.9 -210.19 429.91 -203.19 416.75 C-202.47 415.31 -201.74 413.86 -201 412.38 C-187.64 390.4 -169.17 376.97 -144.19 370.75 C-130.75 368.25 -116.19 368.53 -103.19 372.75 C-103.74 371.6 -104.29 370.45 -104.86 369.27 C-110.34 357.79 -115.56 346.23 -120.62 334.56 C-127.59 318.61 -134.67 302.71 -141.84 286.84 C-147.51 274.26 -153.14 261.66 -158.73 249.05 C-163.31 238.72 -167.9 228.39 -172.55 218.09 C-174.01 214.81 -175.47 211.53 -176.94 208.25 C-177.31 207.44 -177.31 207.44 -179.18 203.32 C-188.66 181.94 -192.75 161.62 -184.93 139.14 C-176.61 118.34 -161.12 104.35 -140.88 95.38 C-133.49 92.36 -127.18 90.65 -119.19 90.75 C-119.6 89.65 -120.01 88.55 -120.43 87.42 C-128.22 66.04 -130.02 46.66 -120.55 25.55 C-110.5 4.92 -93.81 -7.93 -72.4 -15.61 C-45.3 -23.76 -21.73 -16.87 0 0 Z M-73.19 39.75 C-78.46 46.51 -79.03 53.35 -78.19 61.75 C-77 65.81 -75.28 69.51 -73.44 73.31 C-72.42 75.52 -71.4 77.73 -70.38 79.94 C-69.85 81.07 -69.32 82.2 -68.77 83.36 C-66.75 87.7 -64.81 92.08 -62.88 96.46 C-57.38 108.97 -51.72 121.4 -46.05 133.83 C-39.87 147.41 -33.81 161.05 -27.77 174.69 C-23.61 184.06 -19.41 193.41 -15.19 202.75 C-12.94 207.73 -10.69 212.71 -8.44 217.69 C-7.84 219.01 -7.25 220.33 -6.63 221.68 C-1.45 233.16 3.7 244.64 8.85 256.13 C13.53 266.59 18.23 277.03 22.94 287.47 C24.81 291.6 26.67 295.74 28.52 299.88 C29.45 301.95 30.38 304.01 31.31 306.08 C32.92 309.66 34.52 313.23 36.12 316.81 C36.63 317.93 37.13 319.05 37.65 320.2 C48 343.37 48 343.37 44.5 355.19 C42.81 358.75 42.81 358.75 39.81 361.75 C39.81 362.41 39.81 363.07 39.81 363.75 C38.49 364.41 37.17 365.07 35.81 365.75 C34.82 366.29 33.83 366.82 32.81 367.38 C25.77 369.8 19.42 369.66 12.5 367.25 C2.1 360.2 -1.64 350.02 -6.5 338.81 C-7.28 337.05 -8.05 335.3 -8.85 333.49 C-10.91 328.84 -12.94 324.19 -14.97 319.54 C-16.94 315.03 -18.92 310.52 -20.91 306.02 C-23.94 299.11 -26.97 292.2 -30 285.29 C-35.14 273.55 -40.38 261.86 -45.64 250.18 C-48.33 244.21 -51.01 238.23 -53.69 232.25 C-56.95 224.98 -60.21 217.7 -63.47 210.43 C-64.57 207.99 -65.66 205.56 -66.75 203.12 C-67.28 201.93 -67.82 200.74 -68.37 199.52 C-71.61 192.3 -74.82 185.06 -78.01 177.82 C-79.97 173.4 -81.94 168.98 -83.92 164.56 C-85.02 162.11 -86.12 159.66 -87.21 157.2 C-91.37 148.3 -95.75 142.52 -105.19 138.75 C-116.44 137.44 -123.85 139.88 -133.06 146.56 C-138.43 152.04 -140.06 155.99 -140.62 163.69 C-140.51 171.41 -138.01 177.28 -134.75 184.19 C-134.17 185.46 -133.6 186.73 -133 188.05 C-131.75 190.82 -130.48 193.58 -129.21 196.34 C-126.37 202.52 -123.62 208.74 -120.85 214.95 C-117.98 221.39 -115.09 227.83 -112.21 234.26 C-109.81 239.59 -107.42 244.92 -105.03 250.25 C-102.42 256.09 -99.8 261.92 -97.19 267.75 C-89.28 285.38 -81.39 303.01 -73.5 320.65 C-69.65 329.25 -65.79 337.86 -61.93 346.46 C-57.94 355.34 -53.96 364.22 -50.04 373.13 C-49.14 375.15 -48.24 377.18 -47.34 379.2 C-44.79 384.94 -42.41 390.72 -40.18 396.59 C-34.11 412.16 -29.65 421.91 -14.19 429.75 C-11.89 431.33 -9.62 432.96 -7.38 434.62 C-1.81 438.63 3.83 442.52 9.5 446.38 C15.44 450.43 21.34 454.51 27.12 458.78 C31.58 462.04 36.12 465.19 40.65 468.36 C46.91 473.09 50.18 477.26 52.81 484.75 C53.5 492.73 52.26 498.53 48.25 505.44 C42.98 510.44 37.03 513.05 29.81 513.38 C19.42 512.85 11.93 506.59 3.83 500.68 C-0.68 497.39 -5.24 494.19 -9.81 491 C-11.53 489.8 -13.25 488.6 -14.96 487.4 C-15.83 486.8 -16.69 486.19 -17.58 485.57 C-21.84 482.59 -26.11 479.61 -30.38 476.62 C-31.21 476.04 -32.04 475.46 -32.9 474.86 C-38.11 471.21 -43.31 467.55 -48.5 463.88 C-55.27 459.09 -62.07 454.35 -68.88 449.62 C-76.3 444.47 -83.69 439.27 -91.04 434 C-116.09 416.12 -116.09 416.12 -134.19 417.75 C-145.93 421.3 -154.63 428.22 -160.5 439 C-164.69 448.3 -164.4 458.6 -161.56 468.31 C-154.77 481.01 -143.89 489.42 -133.19 498.75 C-125.4 505.63 -117.97 512.78 -110.62 520.12 C-109.55 521.18 -108.48 522.24 -107.38 523.34 C-100.86 529.84 -94.91 536.55 -89.19 543.75 C-87.2 546.09 -85.2 548.43 -83.19 550.75 C-79.51 555.01 -75.9 559.31 -72.38 563.69 C-68.89 567.99 -65.14 571.87 -61.19 575.75 C-60.7 576.32 -60.7 576.32 -58.21 579.21 C-53.21 584.96 -47.82 590.3 -42.44 595.69 C-41.42 596.72 -40.4 597.75 -39.34 598.82 C-33.66 604.51 -27.86 609.81 -21.58 614.83 C-18.67 617.17 -15.95 619.68 -13.25 622.25 C-7.52 627.55 -1.52 632.21 4.81 636.75 C6.08 637.68 7.34 638.6 8.64 639.55 C51.22 670.28 98.42 691.16 151.5 691.06 C152.38 691.07 152.38 691.07 156.86 691.11 C176.75 691.12 194.95 687.79 213.81 681.75 C215.28 681.28 216.75 680.81 218.27 680.33 C246.57 670.6 273.97 655.77 297.81 637.75 C298.97 636.88 300.13 636 301.32 635.11 C318.24 622.1 333.19 607.72 344.81 589.75 C345.31 588.99 345.31 588.99 347.81 585.12 C375.55 537.51 380.46 479.56 367 426.75 C361.75 407.88 354.1 390.53 345.76 372.88 C342.13 365.19 338.57 357.47 335 349.75 C334.24 348.11 333.48 346.46 332.7 344.77 C326.75 331.87 320.96 318.9 315.22 305.9 C312.01 298.64 308.76 291.41 305.31 284.25 C300.36 273.96 295.79 263.5 291.17 253.06 C286.4 242.28 281.54 231.53 276.62 220.81 C271.25 209.1 265.93 197.37 260.68 185.6 C257.23 177.88 253.74 170.19 250.23 162.5 C244.65 150.3 239.18 138.07 233.88 125.75 C218.4 89.87 218.4 89.87 205.81 83.75 C197.12 82.01 191.91 82.85 183.81 86.75 C176.69 92.04 172.96 97.15 170.81 105.75 C169.41 120.2 178.04 134.02 183.76 146.86 C187.49 155.23 191.08 163.66 194.66 172.1 C196.83 177.17 199.01 182.22 201.31 187.23 C204.19 193.5 206.8 199.87 209.44 206.25 C215.74 221.39 222.34 236.38 229.01 251.36 C247.73 293.46 247.73 293.46 243.25 306.19 C239.6 311.52 235.57 314.87 229.81 317.75 C221.48 319.24 215.27 318.56 207.75 314.62 C201.89 308.85 199.13 302.21 195.81 294.75 C195.04 293.01 194.26 291.27 193.46 289.48 C191.65 285.39 189.86 281.29 188.07 277.19 C184.19 268.3 180.22 259.47 176.25 250.62 C171.67 240.42 167.12 230.21 162.69 219.94 C158.2 209.56 153.53 199.27 148.83 188.99 C143.19 176.62 137.64 164.21 132.09 151.79 C127.57 141.66 123.01 131.55 118.44 121.44 C114.29 112.27 110.17 103.09 106.12 93.88 C105.68 92.88 105.24 91.88 104.79 90.85 C102.47 85.58 100.19 80.28 97.97 74.96 C97.49 73.84 97.02 72.72 96.53 71.56 C95.62 69.43 94.74 67.3 93.87 65.16 C90.45 57.16 86.09 50.52 78.62 45.69 C69.02 43.33 60.65 44.16 51.81 48.75 C45.99 53.08 42.21 56.85 39.81 63.75 C38.27 79.36 46.53 92.85 52.81 106.75 C53.57 108.43 54.32 110.11 55.1 111.84 C56.63 115.23 58.15 118.63 59.68 122.02 C62.57 128.43 65.44 134.84 68.31 141.25 C69.35 143.57 70.39 145.89 71.43 148.2 C72.56 150.72 73.68 153.23 74.81 155.75 C75.48 157.25 76.15 158.74 76.84 160.28 C84.23 176.76 91.61 193.24 98.87 209.78 C102.19 217.35 105.55 224.9 108.94 232.44 C109.47 233.62 110 234.8 110.55 236.02 C113 241.48 115.45 246.94 117.9 252.4 C132.9 285.8 132.9 285.8 138.31 298.31 C138.98 299.86 139.65 301.41 140.34 303 C143.86 311.96 143.41 318.93 139.81 327.75 C135.57 334.18 130.33 336.97 122.88 338.62 C116.35 338.83 111.54 337.65 105.75 334.62 C99.88 328.85 97.19 322.19 93.81 314.75 C92.79 312.57 91.76 310.39 90.73 308.21 C84.99 296.02 79.47 283.76 74.22 271.34 C71.38 264.68 68.37 258.09 65.38 251.5 C59.77 239.17 54.3 226.78 48.88 214.38 C42.88 200.68 36.79 187.03 30.57 173.43 C25.35 161.99 20.26 150.5 15.19 139 C14.98 138.54 14.98 138.54 13.96 136.21 C13.75 135.75 13.75 135.75 12.73 133.43 C7.64 121.87 2.5 110.32 -2.68 98.8 C-6.3 90.73 -9.91 82.65 -13.5 74.56 C-14 73.45 -14.5 72.33 -15.01 71.18 C-17.2 66.25 -19.38 61.31 -21.5 56.34 C-26.28 45.25 -30.11 36.65 -41.19 30.75 C-53.69 27.62 -63.64 31.52 -73.19 39.75 Z ",
        fill: "currentColor",
        transform: "translate(437.1875,159.25)",
      }),
      e.jsx("path", {
        d: "M0 0 C6.75 4.84 9.99 9.98 12 18 C12.31 23.23 11.54 27.2 9.84 32.14 C9.38 33.5 8.92 34.87 8.44 36.28 C7.95 37.74 7.45 39.19 6.94 40.69 C-6.99 82.6 -14.22 125.19 -14.25 169.38 C-14.25 170.41 -14.25 171.45 -14.25 172.52 C-14.25 196.1 -12.21 219.14 -8.36 242.4 C-7.78 249.83 -9.08 254.62 -13.19 260.81 C-19.04 267.24 -24 269.68 -32.62 270.38 C-40.51 269.82 -45.72 267.16 -51.44 261.75 C-56.74 253.99 -57.81 245.17 -59.06 236.06 C-59.23 234.86 -59.4 233.67 -59.58 232.43 C-60.06 228.96 -60.54 225.48 -61 222 C-61.22 220.38 -61.44 218.75 -61.66 217.08 C-69.06 156.83 -68.29 56.2 -30.52 4.62 C-22.16 -4.06 -10.54 -5.1 0 0 Z ",
        fill: "currentColor",
        transform: "translate(149,293)",
      }),
      e.jsx("path", {
        d: "M0 0 C6.4 4.41 12.56 9.43 18 15 C18 15.66 18 16.32 18 17 C19.32 17.66 20.64 18.32 22 19 C28.79 25.23 35.01 32.01 41 39 C42.62 40.77 44.25 42.54 45.88 44.31 C59.08 58.82 71.5 74.42 82 91 C82.9 92.39 83.8 93.78 84.73 95.22 C131.1 167.6 131.1 167.6 128 191 C126.22 197.29 122.67 201.48 118 206 C110.58 210 105.26 210.54 97 209 C89.58 206.21 85.06 202.13 81.49 194.97 C79.9 191.32 78.38 187.63 76.88 183.94 C71.35 170.77 65.1 158.37 58 146 C57.28 144.7 56.56 143.4 55.82 142.07 C40.41 114.35 20.67 87.22 -2 65 C-2.52 64.39 -2.52 64.39 -5.12 61.31 C-11.67 54.02 -18.98 47.52 -26.5 41.25 C-32.8 35.4 -35.68 29.89 -36.38 21.38 C-35.82 13.47 -33.17 8.25 -27.69 2.56 C-18.82 -3.6 -9.73 -5.31 0 0 Z ",
        fill: "currentColor",
        transform: "translate(810,128)",
      }),
    ],
  });
}
const F2 = {
  idle: _2,
  failed: B2,
  jumping: $2,
  review: O2,
  running: U2,
  runRight: Z1,
  runLeft: (t) => e.jsx(Z1, { ...t, style: { transform: "scaleX(-1)", ...t.style } }),
  waving: z2,
};
function W2() {
  const { t } = e1(),
    [n, s] = i.useState([]),
    [c, a] = i.useState(1),
    w = i.useRef(c);
  ((w.current = c),
    i.useEffect(() => {
      h("pet/getScale")
        .then(async (g) => {
          var L, Z;
          const y = await g.json(),
            j = (Z = (L = y == null ? void 0 : y.data) == null ? void 0 : L.content) == null ? void 0 : Z.scale;
          typeof j == "number" && a(j);
        })
        .catch(() => {});
    }, []),
    t1(),
    F((g) => {
      g.type === "submenuItems" && Array.isArray(g.items)
        ? s(g.items)
        : g.type === "scaleChanged" && typeof g.scale == "number" && a(g.scale);
    }));
  const d = (g) => {
    (h("pet/submenuAction", { action: g }), h("pet/hideSubmenu"), h("pet/hideMenu"));
  };
  if (n.length === 0) {
    const g = () => {
        h("pet/scaleStart");
      },
      y = (L) => {
        (a(L), h("pet/scale", { scale: L }));
      },
      j = () => {
        h("pet/scaleEnd", { scale: w.current });
      };
    return e.jsx("div", {
      className: u(
        "h-[60px] w-[200px] overflow-hidden rounded-xl p-3 select-none border border-solid shadow-lg",
        "bg-gamecowork-color-surface-elevated border-gamecowork-color-border-default flex items-center",
      ),
      children: e.jsx(s2, {
        min: 0.5,
        max: 3,
        step: 0.1,
        value: c,
        onChange: y,
        onDragStart: g,
        onDragEnd: j,
        minLabel: t("petMenu.sizeSmall"),
        maxLabel: t("petMenu.sizeLarge"),
        className: u("w-[200px]"),
      }),
    });
  }
  return e.jsx("div", {
    className: u(
      "w-[116px] overflow-hidden rounded-xl p-1 select-none border border-solid shadow-lg",
      "bg-gamecowork-color-surface-elevated border-gamecowork-color-border-default",
    ),
    children: n.map((g, y) => {
      const j = F2[g.action];
      return e.jsxs(
        "div",
        {
          onClick: () => d(g.action),
          className: u(
            "cursor-pointer px-3 h-8 text-sm hover:bg-gamecowork-color-interactive-hover",
            "flex flex-row items-center gap-2 text-gamecowork-color-text-default rounded",
          ),
          children: [
            j && e.jsx(j, { className: u("flex-shrink-0 size-4") }),
            e.jsx("span", { className: u("text-sm"), children: g.label }),
          ],
        },
        g.action,
      );
    }),
  });
}
const G2 = new Set(["idle", "running"]),
  Q = 128,
  X2 = 16;
function K2(t) {
  return e.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...t,
    children: e.jsx("path", {
      d: "M14 10C14 10.3536 13.8595 10.6928 13.6095 10.9428C13.3594 11.1929 13.0203 11.3333 12.6667 11.3333H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10Z",
      stroke: "currentColor",
      strokeWidth: "1.33333",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  });
}
function q2() {
  const t = i.useRef(null),
    [n, s] = i.useState(1),
    [c, a] = i.useState(""),
    [w, d] = i.useState(!1),
    g = i.useRef({ anim: _.Idle, repeat: !0 }),
    y = i.useRef(!1),
    j = i.useRef(null),
    L = () => {
      var M;
      ((y.current = !1), (j.current = null));
      const { anim: p, repeat: S } = g.current;
      (M = t.current) == null || M.playAnimation(p, S);
    };
  (i.useEffect(() => {
    (h("pet/getScale")
      .then(async (p) => {
        var V, I;
        const S = await p.json(),
          M = (I = (V = S == null ? void 0 : S.data) == null ? void 0 : V.content) == null ? void 0 : I.scale;
        typeof M == "number" && s(M);
      })
      .catch(() => {}),
      h("pet/getSelectedPet")
        .then(async (p) => {
          var V, I;
          const S = await p.json(),
            M = (I = (V = S == null ? void 0 : S.data) == null ? void 0 : V.content) == null ? void 0 : I.petId;
          typeof M == "string" && m1.some((x) => x.id === M) && a(M);
        })
        .catch(() => {}));
  }, []),
    F((p) => {
      var S, M, V, I, x, b;
      if (p.type === "stateUpdate") {
        const E =
            ((S = p.state) == null ? void 0 : S.charAt(0).toUpperCase()) +
            ((M = p.state) == null ? void 0 : M.slice(1)),
          N = (V = _[E]) != null ? V : _.Idle;
        ((g.current = { anim: N, repeat: G2.has(p.state) }),
          y.current || (I = t.current) == null || I.playAnimation(N, g.current.repeat));
      } else
        p.type === "petMove"
          ? (p.direction === "left" || p.direction === "right") &&
            ((y.current = !0),
            j.current !== p.direction &&
              ((j.current = p.direction),
              (x = t.current) == null || x.playAnimation(p.direction === "left" ? _.RunLeft : _.RunRight, !0, !0)))
          : p.type === "petMoveEnd"
            ? y.current && L()
            : p.type === "petChanged"
              ? typeof p.petId == "string" &&
                m1.some((E) => E.id === p.petId) &&
                (a(p.petId), (g.current = { anim: _.Idle, repeat: !0 }))
              : p.type === "scaleChanged" && s((b = p.scale) != null ? b : 1);
    }));
  const Z = (p) => {
      p.button === 0 && h("pet/drag");
    },
    H = (p) => {
      (p.preventDefault(), p.stopPropagation(), h("pet/showMenu", { x: p.screenX, y: p.screenY }));
    },
    R = X2 * Math.max(n, 1);
  return e.jsxs("div", {
    onMouseDown: Z,
    onContextMenu: H,
    onMouseLeave: () => d(!1),
    className: "relative flex h-full w-full select-none items-start justify-start overflow-hidden bg-transparent",
    children: [
      e.jsx("div", {
        "data-pet-wrapper": !0,
        onMouseEnter: () => d(!0),
        className: "relative",
        style: { transform: `scale(${n})`, transformOrigin: "top left", width: `${Q}px`, height: `${Q}px` },
        children: e.jsx(i2, {
          ref: t,
          spriteUrl: a2(c),
          fps: 6,
          useCanvas: !0,
          fixedSize: Q,
          onReady: () => void h("pet/ready"),
        }),
      }),
      w &&
        e.jsx(K2, {
          onMouseDown: (p) => p.stopPropagation(),
          onClick: () => void h("pet/toggleInput"),
          className: "absolute cursor-pointer text-[#7B7B7B]",
          style: { left: Q * n - R, top: 0, width: R, height: R },
        }),
    ],
  });
}
function Y2() {
  var n;
  const t = (n = new URLSearchParams(window.location.search).get("route")) != null ? n : window.location.pathname;
  return t === "/pet"
    ? e.jsx(q2, {})
    : t === "/pet/menu"
      ? e.jsx(D2, {})
      : t === "/pet/bubble"
        ? e.jsx(w2, {})
        : t === "/pet/submenu"
          ? e.jsx(W2, {})
          : t === "/pet/input"
            ? e.jsx(Z2, {})
            : t === "/pet/file-preview"
              ? e.jsx(m2, {})
              : null;
}
const J2 = document.getElementById("root");
l2.createRoot(J2).render(e.jsx(c2.StrictMode, { children: e.jsx(Y2, {}) }));
