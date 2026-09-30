import { j as e, ar as T, bp as C, c as b, r as o, u as k, bq as A, br as P } from "./registry-CHHSpXp3.js";
import {
  bC as N,
  bD as I,
  bE as R,
  bF as D,
  I as E,
  bG as w,
  bH as L,
  bI as z,
  bJ as _,
  bK as M,
  bL as q,
  bM as B,
  bN as H,
} from "./VscTheme-B-CSeuv5.js";
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
      s = new t.Error().stack;
    s &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[s] = "408cc0a4-5b46-4091-962a-25524914d6ff"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-408cc0a4-5b46-4091-962a-25524914d6ff"));
  })();
} catch {}
function F(t) {
  return e.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "currentColor",
    ...t,
    children: e.jsx("path", {
      d: "M10.7834 8.66666H2.66675V7.33333H10.7834L7.05008 3.6L8.00008 2.66666L13.3334 8L8.00008 13.3333L7.05008 12.4L10.7834 8.66666Z",
      fill: "currentColor",
    }),
  });
}
function O(t) {
  const { children: s, className: c, ...r } = t;
  return e.jsxs(T, {
    variant: "primary",
    size: "lg",
    className: C("hover:gap-6 transition-all duration-200", c),
    ...r,
    children: [s, e.jsx(F, { className: "size-4" })],
  });
}
function V(t) {
  const { label: s, labelClassName: c, ...r } = t;
  return e.jsxs("label", {
    className: "inline-flex cursor-pointer items-center gap-2 group",
    children: [
      e.jsxs("span", {
        className: b("relative inline-flex size-4 shrink-0 items-center justify-center rounded", {
          "border border-solid border-codely-primary-light size-3.5": !r.checked,
        }),
        children: [
          e.jsx("input", {
            type: "checkbox",
            className: "peer absolute inset-0 size-full cursor-pointer opacity-0",
            ...r,
          }),
          e.jsx("span", {
            className: "pointer-events-none hidden size-full items-center justify-center peer-checked:inline-flex",
            children: e.jsx(N, { className: "size-4 text-codely-color-accent-default" }),
          }),
        ],
      }),
      e.jsx("span", {
        className: b("text-sm text-foreground text-[#35C9A9] active:text-[#008563] group-hover:underline", c),
        children: s,
      }),
    ],
  });
}
const W = I(R)`
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--codely-color-text-secondary);

  * {
    margin: 0;
  }

  p:not(:last-child), ul:not(:last-child) {
    margin-bottom: 24px;
  }

  ul {
    padding-left: 1em;
  }

  code {
    font-size: 0.85em;
    font-weight: 500;
    color: var(--codely-color-accent-default);
    background-color: var(--codely-color-surface-card);
    border: 1px solid var(--codely-color-border-subtle);
    border-radius: 4px;
    padding: 2px 4px;
  }
`;
function j(t) {
  const { darkPicture: s, lightPicture: c, title: r, description: i, notification: a } = t;
  return e.jsxs("div", {
    className: "relative max-w-[44.9375rem] mx-auto",
    children: [
      e.jsxs("div", {
        className: "text-center",
        children: [
          e.jsx("img", { className: "dark-display max-w-[32rem] w-full", src: s }),
          e.jsx("img", { className: "light-display max-w-[32rem] w-full", src: c }),
        ],
      }),
      e.jsx("h3", { className: "m-0 mb-4 text-xl text-codely-color-text-primary font-semibold", children: r }),
      e.jsx(W, { children: i }),
      a &&
        e.jsx("div", {
          className:
            "mt-10 bg-codely-color-surface-card border border-solid border-codely-color-border-subtle rounded-lg p-4",
          children: a,
        }),
    ],
  });
}
function G(t) {
  const { title: s, description: c, isLast: r, isActive: i, showCheck: a, stepRef: u, onClick: d } = t;
  return e.jsxs("div", {
    ref: u,
    onClick: d,
    className: b("mb-8", { "mb-4": i, "mb-0": r }),
    children: [
      e.jsxs("h3", {
        className: b(
          "flex items-center justify-between gap-2.5 text-base font-medium text-codely-color-text-tertiary m-0 hover:text-codely-color-text-tertiary-hover cursor-pointer",
          { "text-codely-color-text-primary font-semibold text-xl mb-2.5": i },
        ),
        children: [e.jsx("span", { children: s }), a && e.jsx(N, { className: "size-6" })],
      }),
      e.jsx("p", {
        className: b("m-0 text-sm text-codely-color-text-secondary leading-5 hidden", { block: i }),
        children: c,
      }),
    ],
  });
}
const v = 8;
function J(t) {
  const { items: s, checkedSteps: c, currentStep: r, onChange: i } = t,
    [a, u] = o.useState({ top: 0, height: 0 }),
    d = o.useRef(null),
    h = o.useRef([]),
    y = o.useCallback(
      (p) => (n) => {
        h.current[p] = n;
      },
      [],
    );
  return (
    o.useEffect(() => {
      const p = () => {
        const g = d.current,
          l = h.current[r];
        if (!g || !l) return;
        const x = g.getBoundingClientRect(),
          f = l.getBoundingClientRect(),
          m = f.top - x.top + v,
          S = f.height - v * 2;
        u({ top: m, height: S });
      };
      p();
      const n = new ResizeObserver(p);
      return (d.current && n.observe(d.current), h.current.forEach((g) => g && n.observe(g)), () => n.disconnect());
    }, [r]),
    e.jsxs("div", {
      ref: d,
      className: "relative overflow-hidden pl-7 mb-12",
      children: [
        e.jsx("div", { className: "absolute left-2 top-0 bottom-0 w-0.5 bg-codely-color-surface-elevated" }),
        e.jsx("div", {
          className:
            "absolute left-[0.4375rem] rounded-full w-1 bg-codely-color-accent-default transition-all duration-200 ease-out",
          style: { top: a.top, height: a.height, filter: "drop-shadow(0 0 4px rgba(53, 201, 169, 0.5))" },
        }),
        s.map((p, n) =>
          e.jsx(
            G,
            {
              isLast: n === s.length - 1,
              title: p.title,
              description: p.description,
              isActive: n === r,
              showCheck: c.length > 0 && c.includes(n) && r !== n,
              stepRef: y(n),
              onClick: () => i(n),
            },
            p.title,
          ),
        ),
      ],
    })
  );
}
function K() {
  const { t } = k();
  return e.jsxs("div", {
    children: [
      e.jsx("h3", {
        className: "text-base font-medium text-codely-color-text-primary m-0 mb-2",
        children: t("workflowNotification.title"),
      }),
      e.jsx("p", {
        className: "text-sm leading-6 text-codely-color-text-secondary m-0",
        children: t("workflowNotification.description"),
      }),
      e.jsx("p", {
        className: "text-sm leading-6 text-codely-color-accent-default m-0",
        children: t("workflowNotification.menuPath"),
      }),
    ],
  });
}
function U() {
  const { t } = k();
  D();
  const s = o.useContext(E),
    [c, r] = o.useState(!1),
    [i, a] = o.useState(0),
    [u, d] = o.useState([i]),
    h = [
      { title: t("walkthrough.steps.aiPartnerTitle"), description: t("walkthrough.steps.aiPartnerDescription") },
      {
        title: t("walkthrough.steps.openTuanjieAITitle"),
        description: w()
          ? t("walkthrough.steps.openTuanjieAIAppDescription")
          : t("walkthrough.steps.openTuanjieAIDescription"),
      },
      {
        title: t("walkthrough.steps.chatWithTuanjieAITitle"),
        description: t("walkthrough.steps.chatWithTuanjieAIDescription"),
      },
      {
        title: t("walkthrough.steps.accessPastConversationsTitle"),
        description: t("walkthrough.steps.accessPastConversationsDescription"),
      },
    ],
    y = o.useMemo(() => {
      switch (i) {
        case 0:
          return e.jsx(j, {
            darkPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-dark.png",
            lightPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-light.png",
            title: t("walkthrough.detail.aiPartnerTitle"),
            description: t("walkthrough.detail.aiPartnerDescription"),
            notification: e.jsx(K, {}),
          });
        case 1:
          return e.jsx(j, {
            darkPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-dark.png",
            lightPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-light.png",
            title: w() ? t("walkthrough.detail.openTitleApp") : t("walkthrough.detail.openTitle"),
            description: t("walkthrough.detail.openDescription"),
          });
        case 2:
          return e.jsx(j, {
            darkPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-dark.png",
            lightPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-light.png",
            title: t("walkthrough.detail.chatTitle"),
            description: t("walkthrough.detail.chatDescription"),
          });
        case 3:
          return e.jsx(j, {
            darkPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-dark.png",
            lightPicture: "https://codesearch-plugins.cdn.tuanjie.cn/public/plugins/get-started-light.png",
            title: t("walkthrough.detail.historyTitle"),
            description: t("walkthrough.detail.historyDescription"),
          });
        default:
          return null;
      }
    }, [i, t]),
    p = (l) => {
      if ((a(l), !u.includes(l))) {
        const x = [...u, l];
        (x.sort((f, m) => f - m), d(x));
      }
    },
    n = () => {
      r(!0);
      const l = Array.from({ length: h.length }, (x, f) => f);
      (d(l), a(l[l.length - 1]), s == null || s.request("drill/updateProgress", { steps: l }));
    },
    g = () => {
      if (i === h.length - 1) {
        s == null || s.request("drill/drillCompleted", void 0);
        return;
      } else {
        const l = i + 1;
        if ((a(l), !u.includes(l))) {
          const x = [...u, l];
          (x.sort((f, m) => f - m), d(x), s == null || s.request("drill/updateProgress", { steps: x }));
        }
      }
    };
  return (
    o.useEffect(() => {
      u.length === h.length && r(!0);
    }, [i]),
    o.useEffect(() => {
      s &&
        s.request("drill/getProgress", void 0).then((l) => {
          l.status === "success" &&
            l.content &&
            (d(l.content.steps),
            a(l.content.steps[l.content.steps.length - 1]),
            l.content.steps.length === h.length && r(!0));
        });
    }, [s]),
    o.useEffect(() => {
      L() && document.documentElement.setAttribute("data-theme", "vscode");
    }, []),
    e.jsxs("div", {
      className: "min-h-full h-auto flex flex-1 flex-col relative overflow-x-hidden",
      children: [
        e.jsxs("div", {
          className: "absolute inset-0 flex pointer-events-none",
          "aria-hidden": "true",
          children: [
            e.jsx("div", {
              className:
                "w-full xl:[width:50%] 2xl:[width:max(33.333%,calc(50%_-_13.333rem))] shrink-0 bg-codely-color-surface-sidebar",
            }),
            e.jsx("div", {
              className:
                "flex-1 hidden lg:block from-codely-color-accent-muted to-codely-color-surface-primary bg-gradient-to-b border-0 border-l border-solid border-codely-color-border-subtle",
            }),
          ],
        }),
        e.jsx("div", {
          className: "flex flex-1 flex-col items-center justify-center",
          children: e.jsxs("div", {
            className: "relative max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-8 2xl:grid-cols-9 h-full",
            children: [
              e.jsx("div", {
                className: "flex flex-1 shrink-0 flex-col xl:col-span-4 2xl:col-span-3",
                children: e.jsx("div", {
                  className: "h-full flex justify-end py-8 pl-8 pr-[3.25rem]",
                  children: e.jsxs("div", {
                    className: "flex flex-col justify-between",
                    children: [
                      e.jsxs("h1", {
                        className: "text-4xl text-codely-color-text-primary font-bold mt-0 mb-4",
                        children: [
                          t("walkthrough.getStarted"),
                          e.jsx("br", {}),
                          e.jsx("span", {
                            className: "text-codely-color-accent-default",
                            children: t("walkthrough.withTuanjieAI"),
                          }),
                        ],
                      }),
                      e.jsx("p", {
                        className: "text-codely-color-text-secondary mt-0 mb-12 text-sm leading-6 font-normal",
                        children: t("walkthrough.description"),
                      }),
                      e.jsx(J, { items: h, checkedSteps: u, currentStep: i, onChange: p }),
                      e.jsx(O, {
                        onClick: g,
                        className: "mt-auto w-fit px-6 py-2.5 mb-3",
                        children: i === h.length - 1 ? t("walkthrough.welcomeToTuanjieAI") : t("walkthrough.nextStep"),
                      }),
                      e.jsx(V, { label: t("walkthrough.markAsAllDone"), checked: c, onChange: n }),
                    ],
                  }),
                }),
              }),
              e.jsx("div", {
                className: "xl:flex hidden flex-1 justify-start xl:col-span-4 2xl:col-span-6",
                children: e.jsx("div", { className: "flex flex-1 flex-col p-10", children: y }),
              }),
            ],
          }),
        }),
      ],
    })
  );
}
z();
_();
(async () => (
  M(),
  A.createRoot(document.getElementById("root")).render(
    e.jsx(P.StrictMode, {
      children: e.jsx(q, { children: e.jsx(B, { children: e.jsx(H, { children: e.jsx(U, {}) }) }) }),
    }),
  )
))();
