const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/GenerationModelViewer-DDhaO2so.js",
      "assets/registry-CHHSpXp3.js",
      "assets/registry-D9yfq9uG.css",
      "assets/three.module-zT1-IxDR.js",
      "assets/GLTFLoader-8WqSWalt.js",
      "assets/VscTheme-B-CSeuv5.js",
      "assets/VscTheme-SKSXuIBI.css",
      "assets/index-DvRYaIVa.js",
      "assets/MoveUpRightIcon-DNdGk26Y.js",
      "assets/store-0rGrUshb.js",
      "assets/unityInsightIndex-DGh4GXkO.js",
      "assets/projectMenuFlows-CXiqDIYb.js",
      "assets/openTjhubTab-sMo_OuBf.js",
      "assets/shallowEqual-5Hn7AXgh.js",
      "assets/core-BhBUY98M.js",
      "assets/index-ALCObGGK.css",
      "assets/theme-v2-C2li2Ih-.css",
      "assets/GenerationSkyboxViewer-DEVFMsq7.js",
    ]),
) => i.map((i) => d[i]);
import {
  r as l,
  bJ as W,
  bK as Pt,
  bL as R,
  bM as Ct,
  bN as Ce,
  bO as Xe,
  bP as L,
  bQ as A,
  bR as X,
  bS as ge,
  bT as $e,
  bU as $t,
  bV as se,
  bW as xe,
  bX as ue,
  bY as q,
  bZ as Ie,
  b_ as B,
  br as y,
  b$ as Ue,
  c0 as He,
  c1 as It,
  c2 as ee,
  c3 as Je,
  c4 as Be,
  c5 as pe,
  c6 as H,
  c7 as fe,
  c8 as oe,
  c9 as et,
  ca as Dt,
  cb as tt,
  cc as Ft,
  cd as rt,
  ce as Mt,
  cf as Ve,
  cg as Lt,
  ch as _t,
  ci as At,
  cj as nt,
  ck as at,
  cl as ot,
  cm as Ot,
  cn as Ze,
  co as lt,
  cp as Ut,
  cq as Ht,
  cr as Bt,
  cs as Vt,
  ct as me,
  cu as Zt,
  cv as Wt,
  cw as Gt,
  cx as Kt,
  cy as st,
  cz as zt,
  cA as Yt,
  cB as Qt,
  cC as qt,
  cD as Xt,
  cE as it,
  cF as Jt,
  cG as er,
  cH as tr,
  cI as rr,
  cJ as nr,
  cK as ar,
  j as r,
  u as ie,
  c as le,
  aK as ct,
} from "./registry-CHHSpXp3.js";
import {
  bW as or,
  bX as dt,
  bY as ut,
  bZ as U,
  b_ as lr,
  b$ as sr,
  c0 as ir,
  c1 as mt,
  c2 as cr,
  c3 as ke,
  c4 as dr,
  L as ft,
  bb as ur,
  c5 as mr,
  c6 as fr,
  c7 as pr,
  c8 as de,
  c9 as We,
  ca as Ge,
  cb as hr,
  cc as br,
  cd as xr,
  ce as vr,
  cf as gr,
  cg as Ke,
  ch as yr,
  ci as wr,
  cj as jr,
  ck as Er,
  cl as Se,
  cm as Nr,
  cn as kr,
  co as Tr,
  cp as Sr,
  cq as Rr,
} from "./VscTheme-B-CSeuv5.js";
import { f as ve } from "./cardAudioPlayer-DP-IbJW_.js";
import { g as Pr, a as Cr } from "./index-DvRYaIVa.js";
/* empty css                 */ import "./MoveUpRightIcon-DNdGk26Y.js";
import "./store-0rGrUshb.js";
import "./unityInsightIndex-DGh4GXkO.js";
import "./projectMenuFlows-CXiqDIYb.js";
import "./openTjhubTab-sMo_OuBf.js";
import "./shallowEqual-5Hn7AXgh.js";
import "./core-BhBUY98M.js";
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
      (e._sentryDebugIds[t] = "88e2fbc4-5a80-4956-b229-3303f9c3a61e"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-88e2fbc4-5a80-4956-b229-3303f9c3a61e"));
  })();
} catch {}
function $r(e, { container: t, accept: n, walk: a }) {
  let s = l.useRef(n),
    i = l.useRef(a);
  (l.useEffect(() => {
    ((s.current = n), (i.current = a));
  }, [n, a]),
    W(() => {
      if (!t || !e) return;
      let m = Pt(t);
      if (!m) return;
      let u = s.current,
        b = i.current,
        p = Object.assign((d) => u(d), { acceptNode: u }),
        c = m.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, p, !1);
      for (; c.nextNode();) b(c.currentNode);
    }, [t, e, s, i]));
}
function De(e, t) {
  let n = l.useRef([]),
    a = R(e);
  l.useEffect(() => {
    let s = [...n.current];
    for (let [i, m] of t.entries())
      if (n.current[i] !== m) {
        let u = a(t, s);
        return ((n.current = t), u);
      }
  }, [a, ...t]);
}
function Ir(e) {
  function t() {
    document.readyState !== "loading" && (e(), document.removeEventListener("DOMContentLoaded", t));
  }
  typeof window < "u" && typeof document < "u" && (document.addEventListener("DOMContentLoaded", t), t());
}
let ne = [];
Ir(() => {
  function e(t) {
    if (!(t.target instanceof HTMLElement) || t.target === document.body || ne[0] === t.target) return;
    let n = t.target;
    ((n = n.closest(Ct)),
      ne.unshift(n != null ? n : t.target),
      (ne = ne.filter((a) => a != null && a.isConnected)),
      ne.splice(10));
  }
  (window.addEventListener("click", e, { capture: !0 }),
    window.addEventListener("mousedown", e, { capture: !0 }),
    window.addEventListener("focus", e, { capture: !0 }),
    document.body.addEventListener("click", e, { capture: !0 }),
    document.body.addEventListener("mousedown", e, { capture: !0 }),
    document.body.addEventListener("focus", e, { capture: !0 }));
});
function Dr(e, t = typeof document < "u" ? document.defaultView : null, n) {
  let a = Ce(e, "escape");
  Xe(t, "keydown", (s) => {
    a && (s.defaultPrevented || (s.key === L.Escape && n(s)));
  });
}
function Fr() {
  var e;
  let [t] = l.useState(() =>
      typeof window < "u" && typeof window.matchMedia == "function" ? window.matchMedia("(pointer: coarse)") : null,
    ),
    [n, a] = l.useState((e = t == null ? void 0 : t.matches) != null ? e : !1);
  return (
    W(() => {
      if (!t) return;
      function s(i) {
        a(i.matches);
      }
      return (t.addEventListener("change", s), () => t.removeEventListener("change", s));
    }, [t]),
    n
  );
}
function Fe() {
  let e = l.useRef(!1);
  return (
    W(
      () => (
        (e.current = !0),
        () => {
          e.current = !1;
        }
      ),
      [],
    ),
    e
  );
}
function pt(e) {
  if (!e) return new Set();
  if (typeof e == "function") return new Set(e());
  let t = new Set();
  for (let n of e.current) n.current instanceof HTMLElement && t.add(n.current);
  return t;
}
let Mr = "div";
var ae = ((e) => (
  (e[(e.None = 0)] = "None"),
  (e[(e.InitialFocus = 1)] = "InitialFocus"),
  (e[(e.TabLock = 2)] = "TabLock"),
  (e[(e.FocusLock = 4)] = "FocusLock"),
  (e[(e.RestoreFocus = 8)] = "RestoreFocus"),
  (e[(e.AutoFocus = 16)] = "AutoFocus"),
  e
))(ae || {});
function Lr(e, t) {
  let n = l.useRef(null),
    a = X(n, t),
    { initialFocus: s, initialFocusFallback: i, containers: m, features: u = 15, ...b } = e;
  ge() || (u = 0);
  let p = $e(n);
  Ur(u, { ownerDocument: p });
  let c = Hr(u, { ownerDocument: p, container: n, initialFocus: s, initialFocusFallback: i });
  Br(u, { ownerDocument: p, container: n, containers: m, previousActiveElement: c });
  let d = $t(),
    o = R((T) => {
      let j = n.current;
      j &&
        ((E) => E())(() => {
          se(d.current, {
            [xe.Forwards]: () => {
              ue(j, q.First, { skipElements: [T.relatedTarget, i] });
            },
            [xe.Backwards]: () => {
              ue(j, q.Last, { skipElements: [T.relatedTarget, i] });
            },
          });
        });
    }),
    h = Ce(!!(u & 2), "focus-trap#tab-lock"),
    f = Ie(),
    x = l.useRef(!1),
    g = {
      ref: a,
      onKeyDown(T) {
        T.key == "Tab" &&
          ((x.current = !0),
          f.requestAnimationFrame(() => {
            x.current = !1;
          }));
      },
      onBlur(T) {
        if (!(u & 4)) return;
        let j = pt(m);
        n.current instanceof HTMLElement && j.add(n.current);
        let E = T.relatedTarget;
        E instanceof HTMLElement &&
          E.dataset.headlessuiFocusGuard !== "true" &&
          (ht(j, E) ||
            (x.current
              ? ue(
                  n.current,
                  se(d.current, { [xe.Forwards]: () => q.Next, [xe.Backwards]: () => q.Previous }) | q.WrapAround,
                  { relativeTo: T.target },
                )
              : T.target instanceof HTMLElement && ee(T.target)));
      },
    },
    P = B();
  return y.createElement(
    y.Fragment,
    null,
    h &&
      y.createElement(Ue, {
        as: "button",
        type: "button",
        "data-headlessui-focus-guard": !0,
        onFocus: o,
        features: He.Focusable,
      }),
    P({ ourProps: g, theirProps: b, defaultTag: Mr, name: "FocusTrap" }),
    h &&
      y.createElement(Ue, {
        as: "button",
        type: "button",
        "data-headlessui-focus-guard": !0,
        onFocus: o,
        features: He.Focusable,
      }),
  );
}
let _r = A(Lr),
  Ar = Object.assign(_r, { features: ae });
function Or(e = !0) {
  let t = l.useRef(ne.slice());
  return (
    De(
      ([n], [a]) => {
        (a === !0 &&
          n === !1 &&
          Je(() => {
            t.current.splice(0);
          }),
          a === !1 && n === !0 && (t.current = ne.slice()));
      },
      [e, ne, t],
    ),
    R(() => {
      var n;
      return (n = t.current.find((a) => a != null && a.isConnected)) != null ? n : null;
    })
  );
}
function Ur(e, { ownerDocument: t }) {
  let n = !!(e & 8),
    a = Or(n);
  (De(() => {
    n || ((t == null ? void 0 : t.activeElement) === (t == null ? void 0 : t.body) && ee(a()));
  }, [n]),
    It(() => {
      n && ee(a());
    }));
}
function Hr(e, { ownerDocument: t, container: n, initialFocus: a, initialFocusFallback: s }) {
  let i = l.useRef(null),
    m = Ce(!!(e & 1), "focus-trap#initial-focus"),
    u = Fe();
  return (
    De(() => {
      if (e === 0) return;
      if (!m) {
        s != null && s.current && ee(s.current);
        return;
      }
      let b = n.current;
      b &&
        Je(() => {
          if (!u.current) return;
          let p = t == null ? void 0 : t.activeElement;
          if (a != null && a.current) {
            if ((a == null ? void 0 : a.current) === p) {
              i.current = p;
              return;
            }
          } else if (b.contains(p)) {
            i.current = p;
            return;
          }
          if (a != null && a.current) ee(a.current);
          else {
            if (e & 16) {
              if (ue(b, q.First | q.AutoFocus) !== Be.Error) return;
            } else if (ue(b, q.First) !== Be.Error) return;
            if (s != null && s.current && (ee(s.current), (t == null ? void 0 : t.activeElement) === s.current)) return;
            console.warn("There are no focusable elements inside the <FocusTrap />");
          }
          i.current = t == null ? void 0 : t.activeElement;
        });
    }, [s, m, e]),
    i
  );
}
function Br(e, { ownerDocument: t, container: n, containers: a, previousActiveElement: s }) {
  let i = Fe(),
    m = !!(e & 4);
  Xe(
    t == null ? void 0 : t.defaultView,
    "focus",
    (u) => {
      if (!m || !i.current) return;
      let b = pt(a);
      n.current instanceof HTMLElement && b.add(n.current);
      let p = s.current;
      if (!p) return;
      let c = u.target;
      c && c instanceof HTMLElement
        ? ht(b, c)
          ? ((s.current = c), ee(c))
          : (u.preventDefault(), u.stopPropagation(), ee(p))
        : ee(s.current);
    },
    !0,
  );
}
function ht(e, t) {
  for (let n of e) if (n.contains(t)) return !0;
  return !1;
}
function bt(e) {
  var t;
  return (
    !!(e.enter || e.enterFrom || e.enterTo || e.leave || e.leaveFrom || e.leaveTo) ||
    ((t = e.as) != null ? t : vt) !== l.Fragment ||
    y.Children.count(e.children) === 1
  );
}
let ye = l.createContext(null);
ye.displayName = "TransitionContext";
var Vr = ((e) => ((e.Visible = "visible"), (e.Hidden = "hidden"), e))(Vr || {});
function Zr() {
  let e = l.useContext(ye);
  if (e === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
function Wr() {
  let e = l.useContext(we);
  if (e === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
let we = l.createContext(null);
we.displayName = "NestingContext";
function je(e) {
  return "children" in e
    ? je(e.children)
    : e.current.filter(({ el: t }) => t.current !== null).filter(({ state: t }) => t === "visible").length > 0;
}
function xt(e, t) {
  let n = Mt(e),
    a = l.useRef([]),
    s = Fe(),
    i = Ie(),
    m = R((h, f = oe.Hidden) => {
      let x = a.current.findIndex(({ el: g }) => g === h);
      x !== -1 &&
        (se(f, {
          [oe.Unmount]() {
            a.current.splice(x, 1);
          },
          [oe.Hidden]() {
            a.current[x].state = "hidden";
          },
        }),
        i.microTask(() => {
          var g;
          !je(a) && s.current && ((g = n.current) == null || g.call(n));
        }));
    }),
    u = R((h) => {
      let f = a.current.find(({ el: x }) => x === h);
      return (
        f ? f.state !== "visible" && (f.state = "visible") : a.current.push({ el: h, state: "visible" }),
        () => m(h, oe.Unmount)
      );
    }),
    b = l.useRef([]),
    p = l.useRef(Promise.resolve()),
    c = l.useRef({ enter: [], leave: [] }),
    d = R((h, f, x) => {
      (b.current.splice(0),
        t && (t.chains.current[f] = t.chains.current[f].filter(([g]) => g !== h)),
        t == null ||
          t.chains.current[f].push([
            h,
            new Promise((g) => {
              b.current.push(g);
            }),
          ]),
        t == null ||
          t.chains.current[f].push([
            h,
            new Promise((g) => {
              Promise.all(c.current[f].map(([P, T]) => T)).then(() => g());
            }),
          ]),
        f === "enter"
          ? (p.current = p.current.then(() => (t == null ? void 0 : t.wait.current)).then(() => x(f)))
          : x(f));
    }),
    o = R((h, f, x) => {
      Promise.all(c.current[f].splice(0).map(([g, P]) => P))
        .then(() => {
          var g;
          (g = b.current.shift()) == null || g();
        })
        .then(() => x(f));
    });
  return l.useMemo(
    () => ({ children: a, register: u, unregister: m, onStart: d, onStop: o, wait: p, chains: c }),
    [u, m, a, d, o, c, p],
  );
}
let vt = l.Fragment,
  gt = fe.RenderStrategy;
function Gr(e, t) {
  var n, a;
  let {
      transition: s = !0,
      beforeEnter: i,
      afterEnter: m,
      beforeLeave: u,
      afterLeave: b,
      enter: p,
      enterFrom: c,
      enterTo: d,
      entered: o,
      leave: h,
      leaveFrom: f,
      leaveTo: x,
      ...g
    } = e,
    [P, T] = l.useState(null),
    j = l.useRef(null),
    E = bt(e),
    $ = X(...(E ? [j, t, T] : t === null ? [] : [t])),
    I = (n = g.unmount) == null || n ? oe.Unmount : oe.Hidden,
    { show: w, appear: O, initial: Y } = Zr(),
    [D, S] = l.useState(w ? "visible" : "hidden"),
    F = Wr(),
    { register: G, unregister: V } = F;
  (W(() => G(j), [G, j]),
    W(() => {
      if (I === oe.Hidden && j.current) {
        if (w && D !== "visible") {
          S("visible");
          return;
        }
        return se(D, { hidden: () => V(j), visible: () => G(j) });
      }
    }, [D, j, G, V, w, I]));
  let K = ge();
  W(() => {
    if (E && K && D === "visible" && j.current === null)
      throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [j, D, K, E]);
  let Z = Y && !O,
    z = O && w && Y,
    v = l.useRef(!1),
    M = xt(() => {
      v.current || (S("hidden"), V(j));
    }, F),
    J = R((ce) => {
      v.current = !0;
      let N = ce ? "enter" : "leave";
      M.onStart(j, N, (k) => {
        k === "enter" ? i == null || i() : k === "leave" && (u == null || u());
      });
    }),
    C = R((ce) => {
      let N = ce ? "enter" : "leave";
      ((v.current = !1),
        M.onStop(j, N, (k) => {
          k === "enter" ? m == null || m() : k === "leave" && (b == null || b());
        }),
        N === "leave" && !je(M) && (S("hidden"), V(j)));
    });
  l.useEffect(() => {
    (E && s) || (J(w), C(w));
  }, [w, E, s]);
  let te = !(!s || !E || !K || Z),
    [, _] = et(te, P, w, { start: J, end: C }),
    he = Dt({
      ref: $,
      className:
        ((a = Ft(
          g.className,
          z && p,
          z && c,
          _.enter && p,
          _.enter && _.closed && c,
          _.enter && !_.closed && d,
          _.leave && h,
          _.leave && !_.closed && f,
          _.leave && _.closed && x,
          !_.transition && w && o,
        )) == null
          ? void 0
          : a.trim()) || void 0,
      ...tt(_),
    }),
    re = 0;
  (D === "visible" && (re |= H.Open),
    D === "hidden" && (re |= H.Closed),
    _.enter && (re |= H.Opening),
    _.leave && (re |= H.Closing));
  let be = B();
  return y.createElement(
    we.Provider,
    { value: M },
    y.createElement(
      rt,
      { value: re },
      be({
        ourProps: he,
        theirProps: g,
        defaultTag: vt,
        features: gt,
        visible: D === "visible",
        name: "Transition.Child",
      }),
    ),
  );
}
function Kr(e, t) {
  let { show: n, appear: a = !1, unmount: s = !0, ...i } = e,
    m = l.useRef(null),
    u = bt(e),
    b = X(...(u ? [m, t] : t === null ? [] : [t]));
  ge();
  let p = pe();
  if ((n === void 0 && p !== null && (n = (p & H.Open) === H.Open), n === void 0))
    throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [c, d] = l.useState(n ? "visible" : "hidden"),
    o = xt(() => {
      n || d("hidden");
    }),
    [h, f] = l.useState(!0),
    x = l.useRef([n]);
  W(() => {
    h !== !1 && x.current[x.current.length - 1] !== n && (x.current.push(n), f(!1));
  }, [x, n]);
  let g = l.useMemo(() => ({ show: n, appear: a, initial: h }), [n, a, h]);
  W(() => {
    n ? d("visible") : !je(o) && m.current !== null && d("hidden");
  }, [n, o]);
  let P = { unmount: s },
    T = R(() => {
      var $;
      (h && f(!1), ($ = e.beforeEnter) == null || $.call(e));
    }),
    j = R(() => {
      var $;
      (h && f(!1), ($ = e.beforeLeave) == null || $.call(e));
    }),
    E = B();
  return y.createElement(
    we.Provider,
    { value: o },
    y.createElement(
      ye.Provider,
      { value: g },
      E({
        ourProps: {
          ...P,
          as: l.Fragment,
          children: y.createElement(yt, { ref: b, ...P, ...i, beforeEnter: T, beforeLeave: j }),
        },
        theirProps: {},
        defaultTag: l.Fragment,
        features: gt,
        visible: c === "visible",
        name: "Transition",
      }),
    ),
  );
}
function zr(e, t) {
  let n = l.useContext(ye) !== null,
    a = pe() !== null;
  return y.createElement(
    y.Fragment,
    null,
    !n && a ? y.createElement(Re, { ref: t, ...e }) : y.createElement(yt, { ref: t, ...e }),
  );
}
let Re = A(Kr),
  yt = A(Gr),
  Me = A(zr),
  Yr = Object.assign(Re, { Child: Me, Root: Re });
var Qr = ((e) => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(Qr || {}),
  qr = ((e) => ((e[(e.SetTitleId = 0)] = "SetTitleId"), e))(qr || {});
let Xr = {
    0(e, t) {
      return e.titleId === t.id ? e : { ...e, titleId: t.id };
    },
  },
  Le = l.createContext(null);
Le.displayName = "DialogContext";
function Ee(e) {
  let t = l.useContext(Le);
  if (t === null) {
    let n = new Error(`<${e} /> is missing a parent <Dialog /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(n, Ee), n);
  }
  return t;
}
function Jr(e, t) {
  return se(t.type, Xr, e, t);
}
let ze = A(function (e, t) {
    let n = l.useId(),
      {
        id: a = `headlessui-dialog-${n}`,
        open: s,
        onClose: i,
        initialFocus: m,
        role: u = "dialog",
        autoFocus: b = !0,
        __demoMode: p = !1,
        unmount: c = !1,
        ...d
      } = e,
      o = l.useRef(!1);
    u = (function () {
      return u === "dialog" || u === "alertdialog"
        ? u
        : (o.current ||
            ((o.current = !0),
            console.warn(
              `Invalid role [${u}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`,
            )),
          "dialog");
    })();
    let h = pe();
    s === void 0 && h !== null && (s = (h & H.Open) === H.Open);
    let f = l.useRef(null),
      x = X(f, t),
      g = $e(f),
      P = s ? 0 : 1,
      [T, j] = l.useReducer(Jr, { titleId: null, descriptionId: null, panelRef: l.createRef() }),
      E = R(() => i(!1)),
      $ = R((C) => j({ type: 0, id: C })),
      I = ge() ? P === 0 : !1,
      [w, O] = Lt(),
      Y = {
        get current() {
          var C;
          return (C = T.panelRef.current) != null ? C : f.current;
        },
      },
      D = _t(),
      { resolveContainers: S } = At({ mainTreeNode: D, portals: w, defaultContainers: [Y] }),
      F = h !== null ? (h & H.Closing) === H.Closing : !1;
    (dt(p || F ? !1 : I, {
      allowed: R(() => {
        var C, te;
        return [(te = (C = f.current) == null ? void 0 : C.closest("[data-headlessui-portal]")) != null ? te : null];
      }),
      disallowed: R(() => {
        var C;
        return [(C = D == null ? void 0 : D.closest("body > *:not(#headlessui-portal-root)")) != null ? C : null];
      }),
    }),
      nt(I, S, (C) => {
        (C.preventDefault(), E());
      }),
      Dr(I, g == null ? void 0 : g.defaultView, (C) => {
        (C.preventDefault(),
          C.stopPropagation(),
          document.activeElement &&
            "blur" in document.activeElement &&
            typeof document.activeElement.blur == "function" &&
            document.activeElement.blur(),
          E());
      }),
      at(p || F ? !1 : I, g, S),
      ot(I, f, E));
    let [G, V] = ut(),
      K = l.useMemo(() => [{ dialogState: P, close: E, setTitleId: $, unmount: c }, T], [P, T, E, $, c]),
      Z = l.useMemo(() => ({ open: P === 0 }), [P]),
      z = {
        ref: x,
        id: a,
        role: u,
        tabIndex: -1,
        "aria-modal": p ? void 0 : P === 0 ? !0 : void 0,
        "aria-labelledby": T.titleId,
        "aria-describedby": G,
        unmount: c,
      },
      v = !Fr(),
      M = ae.None;
    I && !p && ((M |= ae.RestoreFocus), (M |= ae.TabLock), b && (M |= ae.AutoFocus), v && (M |= ae.InitialFocus));
    let J = B();
    return y.createElement(
      Ot,
      null,
      y.createElement(
        Ze,
        { force: !0 },
        y.createElement(
          lt,
          null,
          y.createElement(
            Le.Provider,
            { value: K },
            y.createElement(
              Ut,
              { target: f },
              y.createElement(
                Ze,
                { force: !1 },
                y.createElement(
                  V,
                  { slot: Z },
                  y.createElement(
                    O,
                    null,
                    y.createElement(
                      Ar,
                      { initialFocus: m, initialFocusFallback: f, containers: S, features: M },
                      y.createElement(
                        Ht,
                        { value: E },
                        J({
                          ourProps: z,
                          theirProps: d,
                          slot: Z,
                          defaultTag: en,
                          features: tn,
                          visible: P === 0,
                          name: "Dialog",
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }),
  en = "div",
  tn = fe.RenderStrategy | fe.Static;
function rn(e, t) {
  let { transition: n = !1, open: a, ...s } = e,
    i = pe(),
    m = e.hasOwnProperty("open") || i !== null,
    u = e.hasOwnProperty("onClose");
  if (!m && !u) throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");
  if (!m) throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");
  if (!u) throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");
  if (!i && typeof e.open != "boolean")
    throw new Error(
      `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${e.open}`,
    );
  if (typeof e.onClose != "function")
    throw new Error(
      `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${e.onClose}`,
    );
  return (a !== void 0 || n) && !s.static
    ? y.createElement(
        Ve,
        null,
        y.createElement(Yr, { show: a, transition: n, unmount: s.unmount }, y.createElement(ze, { ref: t, ...s })),
      )
    : y.createElement(Ve, null, y.createElement(ze, { ref: t, open: a, ...s }));
}
let nn = "div";
function an(e, t) {
  let n = l.useId(),
    { id: a = `headlessui-dialog-panel-${n}`, transition: s = !1, ...i } = e,
    [{ dialogState: m, unmount: u }, b] = Ee("Dialog.Panel"),
    p = X(t, b.panelRef),
    c = l.useMemo(() => ({ open: m === 0 }), [m]),
    d = R((g) => {
      g.stopPropagation();
    }),
    o = { ref: p, id: a, onClick: d },
    h = s ? Me : l.Fragment,
    f = s ? { unmount: u } : {},
    x = B();
  return y.createElement(h, { ...f }, x({ ourProps: o, theirProps: i, slot: c, defaultTag: nn, name: "Dialog.Panel" }));
}
let on = "div";
function ln(e, t) {
  let { transition: n = !1, ...a } = e,
    [{ dialogState: s, unmount: i }] = Ee("Dialog.Backdrop"),
    m = l.useMemo(() => ({ open: s === 0 }), [s]),
    u = { ref: t, "aria-hidden": !0 },
    b = n ? Me : l.Fragment,
    p = n ? { unmount: i } : {},
    c = B();
  return y.createElement(
    b,
    { ...p },
    c({ ourProps: u, theirProps: a, slot: m, defaultTag: on, name: "Dialog.Backdrop" }),
  );
}
let sn = "h2";
function cn(e, t) {
  let n = l.useId(),
    { id: a = `headlessui-dialog-title-${n}`, ...s } = e,
    [{ dialogState: i, setTitleId: m }] = Ee("Dialog.Title"),
    u = X(t);
  l.useEffect(() => (m(a), () => m(null)), [a, m]);
  let b = l.useMemo(() => ({ open: i === 0 }), [i]),
    p = { ref: u, id: a };
  return B()({ ourProps: p, theirProps: s, slot: b, defaultTag: sn, name: "Dialog.Title" });
}
let dn = A(rn),
  wt = A(an),
  un = A(ln),
  jt = A(cn),
  mn = Object.assign(dn, { Panel: wt, Title: jt, Description: or });
var fn = ((e) => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(fn || {}),
  pn = ((e) => ((e[(e.Pointer = 0)] = "Pointer"), (e[(e.Other = 1)] = "Other"), e))(pn || {}),
  hn = ((e) => (
    (e[(e.OpenMenu = 0)] = "OpenMenu"),
    (e[(e.CloseMenu = 1)] = "CloseMenu"),
    (e[(e.GoToItem = 2)] = "GoToItem"),
    (e[(e.Search = 3)] = "Search"),
    (e[(e.ClearSearch = 4)] = "ClearSearch"),
    (e[(e.RegisterItem = 5)] = "RegisterItem"),
    (e[(e.UnregisterItem = 6)] = "UnregisterItem"),
    (e[(e.SetButtonElement = 7)] = "SetButtonElement"),
    (e[(e.SetItemsElement = 8)] = "SetItemsElement"),
    e
  ))(hn || {});
function Te(e, t = (n) => n) {
  let n = e.activeItemIndex !== null ? e.items[e.activeItemIndex] : null,
    a = rr(t(e.items.slice()), (i) => i.dataRef.current.domRef.current),
    s = n ? a.indexOf(n) : null;
  return (s === -1 && (s = null), { items: a, activeItemIndex: s });
}
let bn = {
    1(e) {
      return e.menuState === 1 ? e : { ...e, activeItemIndex: null, menuState: 1 };
    },
    0(e) {
      return e.menuState === 0 ? e : { ...e, __demoMode: !1, menuState: 0 };
    },
    2: (e, t) => {
      var n, a, s, i, m;
      if (e.menuState === 1) return e;
      let u = { ...e, searchQuery: "", activationTrigger: (n = t.trigger) != null ? n : 1, __demoMode: !1 };
      if (t.focus === U.Nothing) return { ...u, activeItemIndex: null };
      if (t.focus === U.Specific) return { ...u, activeItemIndex: e.items.findIndex((c) => c.id === t.id) };
      if (t.focus === U.Previous) {
        let c = e.activeItemIndex;
        if (c !== null) {
          let d = e.items[c].dataRef.current.domRef,
            o = ke(t, {
              resolveItems: () => e.items,
              resolveActiveIndex: () => e.activeItemIndex,
              resolveId: (h) => h.id,
              resolveDisabled: (h) => h.dataRef.current.disabled,
            });
          if (o !== null) {
            let h = e.items[o].dataRef.current.domRef;
            if (
              ((a = d.current) == null ? void 0 : a.previousElementSibling) === h.current ||
              ((s = h.current) == null ? void 0 : s.previousElementSibling) === null
            )
              return { ...u, activeItemIndex: o };
          }
        }
      } else if (t.focus === U.Next) {
        let c = e.activeItemIndex;
        if (c !== null) {
          let d = e.items[c].dataRef.current.domRef,
            o = ke(t, {
              resolveItems: () => e.items,
              resolveActiveIndex: () => e.activeItemIndex,
              resolveId: (h) => h.id,
              resolveDisabled: (h) => h.dataRef.current.disabled,
            });
          if (o !== null) {
            let h = e.items[o].dataRef.current.domRef;
            if (
              ((i = d.current) == null ? void 0 : i.nextElementSibling) === h.current ||
              ((m = h.current) == null ? void 0 : m.nextElementSibling) === null
            )
              return { ...u, activeItemIndex: o };
          }
        }
      }
      let b = Te(e),
        p = ke(t, {
          resolveItems: () => b.items,
          resolveActiveIndex: () => b.activeItemIndex,
          resolveId: (c) => c.id,
          resolveDisabled: (c) => c.dataRef.current.disabled,
        });
      return { ...u, ...b, activeItemIndex: p };
    },
    3: (e, t) => {
      let n = e.searchQuery !== "" ? 0 : 1,
        a = e.searchQuery + t.value.toLowerCase(),
        s = (
          e.activeItemIndex !== null
            ? e.items.slice(e.activeItemIndex + n).concat(e.items.slice(0, e.activeItemIndex + n))
            : e.items
        ).find((m) => {
          var u;
          return ((u = m.dataRef.current.textValue) == null ? void 0 : u.startsWith(a)) && !m.dataRef.current.disabled;
        }),
        i = s ? e.items.indexOf(s) : -1;
      return i === -1 || i === e.activeItemIndex
        ? { ...e, searchQuery: a }
        : { ...e, searchQuery: a, activeItemIndex: i, activationTrigger: 1 };
    },
    4(e) {
      return e.searchQuery === "" ? e : { ...e, searchQuery: "", searchActiveItemIndex: null };
    },
    5: (e, t) => {
      let n = Te(e, (a) => [...a, { id: t.id, dataRef: t.dataRef }]);
      return { ...e, ...n };
    },
    6: (e, t) => {
      let n = Te(e, (a) => {
        let s = a.findIndex((i) => i.id === t.id);
        return (s !== -1 && a.splice(s, 1), a);
      });
      return { ...e, ...n, activationTrigger: 1 };
    },
    7: (e, t) => (e.buttonElement === t.element ? e : { ...e, buttonElement: t.element }),
    8: (e, t) => (e.itemsElement === t.element ? e : { ...e, itemsElement: t.element }),
  },
  _e = l.createContext(null);
_e.displayName = "MenuContext";
function Ne(e) {
  let t = l.useContext(_e);
  if (t === null) {
    let n = new Error(`<${e} /> is missing a parent <Menu /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(n, Ne), n);
  }
  return t;
}
function xn(e, t) {
  return se(t.type, bn, e, t);
}
let vn = l.Fragment;
function gn(e, t) {
  let { __demoMode: n = !1, ...a } = e,
    s = l.useReducer(xn, {
      __demoMode: n,
      menuState: n ? 0 : 1,
      buttonElement: null,
      itemsElement: null,
      items: [],
      searchQuery: "",
      activeItemIndex: null,
      activationTrigger: 1,
    }),
    [{ menuState: i, itemsElement: m, buttonElement: u }, b] = s,
    p = X(t);
  nt(i === 0, [u, m], (f, x) => {
    (b({ type: 1 }), nr(x, ar.Loose) || (f.preventDefault(), u == null || u.focus()));
  });
  let c = R(() => {
      b({ type: 1 });
    }),
    d = l.useMemo(() => ({ open: i === 0, close: c }), [i, c]),
    o = { ref: p },
    h = B();
  return y.createElement(
    tr,
    null,
    y.createElement(
      _e.Provider,
      { value: s },
      y.createElement(
        rt,
        { value: se(i, { 0: H.Open, 1: H.Closed }) },
        h({ ourProps: o, theirProps: a, slot: d, defaultTag: vn, name: "Menu" }),
      ),
    ),
  );
}
let yn = "button";
function wn(e, t) {
  var n;
  let a = l.useId(),
    { id: s = `headlessui-menu-button-${a}`, disabled: i = !1, autoFocus: m = !1, ...u } = e,
    [b, p] = Ne("Menu.Button"),
    c = Bt(),
    d = X(
      t,
      Vt(),
      R((w) => p({ type: 7, element: w })),
    ),
    o = R((w) => {
      switch (w.key) {
        case L.Space:
        case L.Enter:
        case L.ArrowDown:
          (w.preventDefault(), w.stopPropagation(), me.flushSync(() => p({ type: 0 })), p({ type: 2, focus: U.First }));
          break;
        case L.ArrowUp:
          (w.preventDefault(), w.stopPropagation(), me.flushSync(() => p({ type: 0 })), p({ type: 2, focus: U.Last }));
          break;
      }
    }),
    h = R((w) => {
      switch (w.key) {
        case L.Space:
          w.preventDefault();
          break;
      }
    }),
    f = R((w) => {
      var O;
      if (Zt(w.currentTarget)) return w.preventDefault();
      i ||
        (b.menuState === 0
          ? (me.flushSync(() => p({ type: 1 })), (O = b.buttonElement) == null || O.focus({ preventScroll: !0 }))
          : (w.preventDefault(), p({ type: 0 })));
    }),
    { isFocusVisible: x, focusProps: g } = Wt({ autoFocus: m }),
    { isHovered: P, hoverProps: T } = Gt({ isDisabled: i }),
    { pressed: j, pressProps: E } = Kt({ disabled: i }),
    $ = l.useMemo(
      () => ({
        open: b.menuState === 0,
        active: j || b.menuState === 0,
        disabled: i,
        hover: P,
        focus: x,
        autofocus: m,
      }),
      [b, P, x, j, i, m],
    ),
    I = st(
      c(),
      {
        ref: d,
        id: s,
        type: zt(e, b.buttonElement),
        "aria-haspopup": "menu",
        "aria-controls": (n = b.itemsElement) == null ? void 0 : n.id,
        "aria-expanded": b.menuState === 0,
        disabled: i || void 0,
        autoFocus: m,
        onKeyDown: o,
        onKeyUp: h,
        onClick: f,
      },
      g,
      T,
      E,
    );
  return B()({ ourProps: I, theirProps: u, slot: $, defaultTag: yn, name: "Menu.Button" });
}
let jn = "div",
  En = fe.RenderStrategy | fe.Static;
function Nn(e, t) {
  var n, a;
  let s = l.useId(),
    { id: i = `headlessui-menu-items-${s}`, anchor: m, portal: u = !1, modal: b = !0, transition: p = !1, ...c } = e,
    d = Yt(m),
    [o, h] = Ne("Menu.Items"),
    [f, x] = Qt(d),
    g = qt(),
    [P, T] = l.useState(null),
    j = X(
      t,
      d ? f : null,
      R((v) => h({ type: 8, element: v })),
      T,
    ),
    E = $e(o.itemsElement);
  d && (u = !0);
  let $ = pe(),
    [I, w] = et(p, P, $ !== null ? ($ & H.Open) === H.Open : o.menuState === 0);
  ot(I, o.buttonElement, () => {
    h({ type: 1 });
  });
  let O = o.__demoMode ? !1 : b && o.menuState === 0;
  at(O, E);
  let Y = o.__demoMode ? !1 : b && o.menuState === 0;
  dt(Y, { allowed: l.useCallback(() => [o.buttonElement, o.itemsElement], [o.buttonElement, o.itemsElement]) });
  let D = o.menuState !== 0,
    S = lr(D, o.buttonElement) ? !1 : I;
  (l.useEffect(() => {
    let v = o.itemsElement;
    v && o.menuState === 0 && v !== (E == null ? void 0 : E.activeElement) && v.focus({ preventScroll: !0 });
  }, [o.menuState, o.itemsElement, E]),
    $r(o.menuState === 0, {
      container: o.itemsElement,
      accept(v) {
        return v.getAttribute("role") === "menuitem"
          ? NodeFilter.FILTER_REJECT
          : v.hasAttribute("role")
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT;
      },
      walk(v) {
        v.setAttribute("role", "none");
      },
    }));
  let F = Ie(),
    G = R((v) => {
      var M, J, C;
      switch ((F.dispose(), v.key)) {
        case L.Space:
          if (o.searchQuery !== "") return (v.preventDefault(), v.stopPropagation(), h({ type: 3, value: v.key }));
        case L.Enter:
          if ((v.preventDefault(), v.stopPropagation(), h({ type: 1 }), o.activeItemIndex !== null)) {
            let { dataRef: te } = o.items[o.activeItemIndex];
            (J = (M = te.current) == null ? void 0 : M.domRef.current) == null || J.click();
          }
          it(o.buttonElement);
          break;
        case L.ArrowDown:
          return (v.preventDefault(), v.stopPropagation(), h({ type: 2, focus: U.Next }));
        case L.ArrowUp:
          return (v.preventDefault(), v.stopPropagation(), h({ type: 2, focus: U.Previous }));
        case L.Home:
        case L.PageUp:
          return (v.preventDefault(), v.stopPropagation(), h({ type: 2, focus: U.First }));
        case L.End:
        case L.PageDown:
          return (v.preventDefault(), v.stopPropagation(), h({ type: 2, focus: U.Last }));
        case L.Escape:
          (v.preventDefault(),
            v.stopPropagation(),
            me.flushSync(() => h({ type: 1 })),
            (C = o.buttonElement) == null || C.focus({ preventScroll: !0 }));
          break;
        case L.Tab:
          (v.preventDefault(),
            v.stopPropagation(),
            me.flushSync(() => h({ type: 1 })),
            Xt(o.buttonElement, v.shiftKey ? q.Previous : q.Next));
          break;
        default:
          v.key.length === 1 && (h({ type: 3, value: v.key }), F.setTimeout(() => h({ type: 4 }), 350));
          break;
      }
    }),
    V = R((v) => {
      switch (v.key) {
        case L.Space:
          v.preventDefault();
          break;
      }
    }),
    K = l.useMemo(() => ({ open: o.menuState === 0 }), [o.menuState]),
    Z = st(d ? g() : {}, {
      "aria-activedescendant": o.activeItemIndex === null || (n = o.items[o.activeItemIndex]) == null ? void 0 : n.id,
      "aria-labelledby": (a = o.buttonElement) == null ? void 0 : a.id,
      id: i,
      onKeyDown: G,
      onKeyUp: V,
      role: "menu",
      tabIndex: o.menuState === 0 ? 0 : void 0,
      ref: j,
      style: { ...c.style, ...x, "--button-width": Jt(o.buttonElement, !0).width },
      ...tt(w),
    }),
    z = B();
  return y.createElement(
    lt,
    { enabled: u ? e.static || I : !1 },
    z({ ourProps: Z, theirProps: c, slot: K, defaultTag: jn, features: En, visible: S, name: "Menu.Items" }),
  );
}
let kn = l.Fragment;
function Tn(e, t) {
  let n = l.useId(),
    { id: a = `headlessui-menu-item-${n}`, disabled: s = !1, ...i } = e,
    [m, u] = Ne("Menu.Item"),
    b = m.activeItemIndex !== null ? m.items[m.activeItemIndex].id === a : !1,
    p = l.useRef(null),
    c = X(t, p);
  W(() => {
    if (!m.__demoMode && m.menuState === 0 && b && m.activationTrigger !== 0)
      return er().requestAnimationFrame(() => {
        var S, F;
        (F = (S = p.current) == null ? void 0 : S.scrollIntoView) == null || F.call(S, { block: "nearest" });
      });
  }, [m.__demoMode, p, b, m.menuState, m.activationTrigger, m.activeItemIndex]);
  let d = sr(p),
    o = l.useRef({
      disabled: s,
      domRef: p,
      get textValue() {
        return d();
      },
    });
  (W(() => {
    o.current.disabled = s;
  }, [o, s]),
    W(() => (u({ type: 5, id: a, dataRef: o }), () => u({ type: 6, id: a })), [o, a]));
  let h = R(() => {
      u({ type: 1 });
    }),
    f = R((S) => {
      if (s) return S.preventDefault();
      (u({ type: 1 }), it(m.buttonElement));
    }),
    x = R(() => {
      if (s) return u({ type: 2, focus: U.Nothing });
      u({ type: 2, focus: U.Specific, id: a });
    }),
    g = ir(),
    P = R((S) => {
      (g.update(S), !s && (b || u({ type: 2, focus: U.Specific, id: a, trigger: 0 })));
    }),
    T = R((S) => {
      g.wasMoved(S) && (s || b || u({ type: 2, focus: U.Specific, id: a, trigger: 0 }));
    }),
    j = R((S) => {
      g.wasMoved(S) && (s || (b && u({ type: 2, focus: U.Nothing })));
    }),
    [E, $] = mt(),
    [I, w] = ut(),
    O = l.useMemo(() => ({ active: b, focus: b, disabled: s, close: h }), [b, s, h]),
    Y = {
      id: a,
      ref: c,
      role: "menuitem",
      tabIndex: s === !0 ? void 0 : -1,
      "aria-disabled": s === !0 ? !0 : void 0,
      "aria-labelledby": E,
      "aria-describedby": I,
      disabled: void 0,
      onClick: f,
      onFocus: x,
      onPointerEnter: P,
      onMouseEnter: P,
      onPointerMove: T,
      onMouseMove: T,
      onPointerLeave: j,
      onMouseLeave: j,
    },
    D = B();
  return y.createElement(
    $,
    null,
    y.createElement(w, null, D({ ourProps: Y, theirProps: i, slot: O, defaultTag: kn, name: "Menu.Item" })),
  );
}
let Sn = "div";
function Rn(e, t) {
  let [n, a] = mt(),
    s = e,
    i = { ref: t, "aria-labelledby": n, role: "group" },
    m = B();
  return y.createElement(a, null, m({ ourProps: i, theirProps: s, slot: {}, defaultTag: Sn, name: "Menu.Section" }));
}
let Pn = "header";
function Cn(e, t) {
  let n = l.useId(),
    { id: a = `headlessui-menu-heading-${n}`, ...s } = e,
    i = cr();
  W(() => i.register(a), [a, i.register]);
  let m = { id: a, ref: t, role: "presentation", ...i.props };
  return B()({ ourProps: m, theirProps: s, slot: {}, defaultTag: Pn, name: "Menu.Heading" });
}
let $n = "div";
function In(e, t) {
  let n = e,
    a = { ref: t, role: "separator" };
  return B()({ ourProps: a, theirProps: n, slot: {}, defaultTag: $n, name: "Menu.Separator" });
}
let Dn = A(gn),
  Et = A(wn),
  Nt = A(Nn),
  kt = A(Tn),
  Fn = A(Rn),
  Mn = A(Cn),
  Ln = A(In),
  _n = Object.assign(Dn, { Button: Et, Items: Nt, Item: kt, Section: Fn, Heading: Mn, Separator: Ln });
function An({ title: e, titleId: t, ...n }, a) {
  return l.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: a,
        "aria-labelledby": t,
      },
      n,
    ),
    e ? l.createElement("title", { id: t }, e) : null,
    l.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z",
    }),
  );
}
const On = l.forwardRef(An);
function Un({ title: e, titleId: t, ...n }, a) {
  return l.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: a,
        "aria-labelledby": t,
      },
      n,
    ),
    e ? l.createElement("title", { id: t }, e) : null,
    l.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
    }),
  );
}
const Hn = l.forwardRef(Un);
function Bn({ title: e, titleId: t, ...n }, a) {
  return l.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: a,
        "aria-labelledby": t,
      },
      n,
    ),
    e ? l.createElement("title", { id: t }, e) : null,
    l.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z",
    }),
  );
}
const Vn = l.forwardRef(Bn);
function Zn({ title: e, titleId: t, ...n }, a) {
  return l.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: a,
        "aria-labelledby": t,
      },
      n,
    ),
    e ? l.createElement("title", { id: t }, e) : null,
    l.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 5.25v13.5m-7.5-13.5v13.5" }),
  );
}
const Tt = l.forwardRef(Zn);
function Wn({ title: e, titleId: t, ...n }, a) {
  return l.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: a,
        "aria-labelledby": t,
      },
      n,
    ),
    e ? l.createElement("title", { id: t }, e) : null,
    l.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z",
    }),
  );
}
const St = l.forwardRef(Wn);
function Gn({ title: e, titleId: t, ...n }, a) {
  return l.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: a,
        "aria-labelledby": t,
      },
      n,
    ),
    e ? l.createElement("title", { id: t }, e) : null,
    l.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z",
    }),
  );
}
const Rt = l.forwardRef(Gn);
function Kn(e) {
  return r.jsx("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...e,
    children: r.jsx("path", {
      d: "M4.66536 12.8327L5.2487 8.74935H2.33203L7.58203 1.16602H8.7487L8.16536 5.83268H11.6654L5.83203 12.8327H4.66536Z",
      fill: "currentColor",
    }),
  });
}
const zn = l.lazy(() =>
    ct(
      () => import("./GenerationModelViewer-DDhaO2so.js"),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
    ),
  ),
  Yn = l.lazy(() => ct(() => import("./GenerationSkyboxViewer-DEVFMsq7.js"), __vite__mapDeps([17, 1, 2, 3]))),
  Qn = 50,
  qn = {
    "3d": "3D model generation details",
    image: "Image generation details",
    video: "Video generation details",
    audio: "Audio generation details",
    other: "Generation details",
  },
  Xn = {
    "2d": "2D",
    "3d": "3D",
    ai: "AI",
    api: "API",
    fbx: "FBX",
    glb: "GLB",
    gpt: "GPT",
    hd: "HD",
    openai: "OpenAI",
    stt: "STT",
    tts: "TTS",
    uhd: "UHD",
    vr: "VR",
  },
  Jn = new Set(["and", "for", "from", "of", "or", "to", "with"]),
  ea = new Set(["fal", "huoshan"]);
function Ye(e) {
  const t = e
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter((n) => !!n && !ea.has(n.toLowerCase()));
  return t.length === 0
    ? ""
    : t
        .map((n, a) => {
          const s = n.toLowerCase(),
            i = Xn[s];
          return (
            i || (a > 0 && Jn.has(s) ? s : /^v\d/.test(s) ? "V" + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1))
          );
        })
        .join(" ");
}
function Qe({ url: e, poster: t, title: n }) {
  const { t: a } = ie(),
    s = l.useRef(null),
    [i, m] = l.useState(!1),
    [u, b] = l.useState(!1),
    [p, c] = l.useState(0),
    [d, o] = l.useState(0),
    h = () => {
      const f = s.current;
      f && (f.paused ? f.play() : f.pause());
    };
  return r.jsxs("div", {
    className:
      "group/media relative flex h-full min-h-[18rem] w-full items-center justify-center overflow-hidden bg-black",
    children: [
      r.jsx("video", {
        ref: s,
        src: e,
        poster: t,
        "aria-label": n,
        playsInline: !0,
        disablePictureInPicture: !0,
        disableRemotePlayback: !0,
        controlsList: "nofullscreen noremoteplayback",
        className: "max-h-full max-w-full cursor-pointer object-contain",
        onClick: h,
        onPlay: () => m(!0),
        onPause: () => m(!1),
        onEnded: () => m(!1),
        onLoadedMetadata: (f) => o(f.currentTarget.duration),
        onTimeUpdate: (f) => c(f.currentTarget.currentTime),
      }),
      !i &&
        r.jsx("button", {
          type: "button",
          "aria-label": a("generation.detail.play", "Play"),
          onClick: h,
          className:
            "absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-solid border-white/20 bg-black/45 text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-105",
          children: r.jsx(Se, { className: "ml-1 h-7 w-7" }),
        }),
      r.jsxs("div", {
        className:
          "absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 via-black/55 to-transparent px-4 pb-4 pt-10 text-white",
        children: [
          r.jsx("button", {
            type: "button",
            "aria-label": i ? a("generation.detail.pause", "Pause") : a("generation.detail.play", "Play"),
            onClick: h,
            className:
              "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-white/10 text-white hover:bg-white/20",
            children: i ? r.jsx(Tt, { className: "h-4 w-4" }) : r.jsx(Se, { className: "h-4 w-4" }),
          }),
          r.jsx("input", {
            type: "range",
            min: 0,
            max: d || 0,
            step: "0.01",
            value: Math.min(p, d || 0),
            "aria-label": a("generation.detail.progress", "Playback progress"),
            onChange: (f) => {
              const x = Number(f.target.value);
              (c(x), s.current && (s.current.currentTime = x));
            },
            className: "h-1 min-w-0 flex-1 cursor-pointer accent-white",
          }),
          r.jsxs("span", {
            className: "shrink-0 text-[0.6875rem] tabular-nums text-white/75",
            children: [ve(p), " / ", ve(d)],
          }),
          r.jsx("button", {
            type: "button",
            "aria-label": u ? a("generation.detail.unmute", "Unmute") : a("generation.detail.mute", "Mute"),
            onClick: () => {
              const f = !u;
              (b(f), s.current && (s.current.muted = f));
            },
            className:
              "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
            children: u ? r.jsx(Rt, { className: "h-4 w-4" }) : r.jsx(St, { className: "h-4 w-4" }),
          }),
        ],
      }),
    ],
  });
}
function qe({ url: e, title: t }) {
  const { t: n } = ie(),
    a = l.useRef(null),
    [s, i] = l.useState(!1),
    [m, u] = l.useState(!1),
    [b, p] = l.useState(0),
    [c, d] = l.useState(0),
    o = [28, 45, 68, 40, 76, 52, 88, 62, 38, 72, 48, 30],
    h = () => {
      const f = a.current;
      f && (f.paused ? f.play() : f.pause());
    };
  return r.jsxs("div", {
    className:
      "relative box-border flex h-full min-h-[18rem] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(58,221,211,.38),transparent_34%),radial-gradient(circle_at_78%_80%,rgba(139,92,246,.42),transparent_42%),linear-gradient(145deg,#102a35,#1d3350_48%,#30204d)] px-6",
    children: [
      r.jsx("audio", {
        ref: a,
        src: e,
        onPlay: () => i(!0),
        onPause: () => i(!1),
        onEnded: () => i(!1),
        onLoadedMetadata: (f) => d(f.currentTarget.duration),
        onTimeUpdate: (f) => p(f.currentTarget.currentTime),
      }),
      r.jsx("div", {
        className:
          "absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:28px_28px]",
      }),
      r.jsxs("div", {
        className:
          "relative mx-auto box-border flex w-full max-w-xl flex-col items-center rounded-[2rem] border border-solid border-white/15 bg-black/15 px-7 py-8 text-white shadow-2xl backdrop-blur-md",
        children: [
          r.jsx("div", {
            className: "mb-6 flex h-20 items-center justify-center gap-1.5",
            "aria-hidden": "true",
            children: o.map((f, x) =>
              r.jsx(
                "span",
                {
                  className: le(
                    "w-2 rounded-full bg-gradient-to-t from-cyan-300/60 to-violet-200/95 transition-all duration-300",
                    s && "animate-pulse",
                  ),
                  style: { height: `${f}%`, animationDelay: `${x * 55}ms` },
                },
                x,
              ),
            ),
          }),
          r.jsx(Vn, { className: "mb-3 h-6 w-6 text-cyan-100/90" }),
          r.jsx("div", {
            className: "mb-7 max-w-full truncate text-center text-sm font-medium text-white/90",
            children: t,
          }),
          r.jsxs("div", {
            className: "flex w-full items-center gap-3",
            children: [
              r.jsx("button", {
                type: "button",
                "aria-label": s ? n("generation.detail.pause", "Pause") : n("generation.detail.play", "Play"),
                onClick: h,
                className:
                  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-white/15 bg-white/15 text-white shadow-lg hover:bg-white/25",
                children: s ? r.jsx(Tt, { className: "h-5 w-5" }) : r.jsx(Se, { className: "ml-0.5 h-5 w-5" }),
              }),
              r.jsxs("div", {
                className: "min-w-0 flex-1",
                children: [
                  r.jsx("input", {
                    type: "range",
                    min: 0,
                    max: c || 0,
                    step: "0.01",
                    value: Math.min(b, c || 0),
                    "aria-label": n("generation.detail.progress", "Playback progress"),
                    onChange: (f) => {
                      const x = Number(f.target.value);
                      (p(x), a.current && (a.current.currentTime = x));
                    },
                    className: "h-1 w-full cursor-pointer accent-cyan-200",
                  }),
                  r.jsxs("div", {
                    className: "mt-2 flex justify-between text-[0.6875rem] tabular-nums text-white/65",
                    children: [r.jsx("span", { children: ve(b) }), r.jsx("span", { children: ve(c) })],
                  }),
                ],
              }),
              r.jsx("button", {
                type: "button",
                "aria-label": m ? n("generation.detail.unmute", "Unmute") : n("generation.detail.mute", "Mute"),
                onClick: () => {
                  const f = !m;
                  (u(f), a.current && (a.current.muted = f));
                },
                className:
                  "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
                children: m ? r.jsx(Rt, { className: "h-4 w-4" }) : r.jsx(St, { className: "h-4 w-4" }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ta(e) {
  return /(?:^|[\s_-])rodin(?:[\s_-]+)skybox(?:$|[\s_-])/i.test(e.trim());
}
function Pe({ url: e, title: t }) {
  const { t: n } = ie(),
    [a, s] = l.useState(null),
    i = (a == null ? void 0 : a.url) === e ? a : null;
  return r.jsxs("div", {
    className: "relative h-full w-full",
    children: [
      r.jsx(
        "img",
        {
          src: e,
          alt: t,
          className: "h-full max-h-full w-full object-contain",
          onLoad: (m) => {
            const { naturalWidth: u, naturalHeight: b } = m.currentTarget;
            s(u > 0 && b > 0 ? { url: e, width: u, height: b } : null);
          },
          onError: () => s(null),
        },
        e,
      ),
      i &&
        r.jsxs("div", {
          className:
            "pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-solid border-white/10 bg-black/30 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-md",
          children: [
            r.jsxs("svg", {
              viewBox: "0 0 18 18",
              "aria-hidden": "true",
              className: "h-4 w-4 text-white/55",
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "1.25",
              children: [
                r.jsx("rect", { x: "2.5", y: "3.5", width: "13", height: "11", rx: "1.5" }),
                r.jsx("path", { d: "M6.75 3.5v11M11.25 3.5v11M2.5 8.9h13" }),
              ],
            }),
            r.jsxs("div", {
              className: "flex items-baseline gap-1.5",
              children: [
                r.jsxs("span", {
                  className: "font-mono text-xs font-semibold tabular-nums text-white/90",
                  children: [i.width, " × ", i.height],
                }),
                r.jsx("span", {
                  className: "text-[0.625rem] font-medium tracking-wide text-white/60",
                  children: n("generation.detail.imageResolution", "Resolution"),
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function ra({ url: e, title: t }) {
  const { t: n } = ie(),
    [a, s] = l.useState("flat");
  return r.jsxs("div", {
    className: "relative h-full min-h-[22rem] w-full overflow-hidden",
    children: [
      a === "flat"
        ? r.jsx(Pe, { url: e, title: t })
        : r.jsx(l.Suspense, {
            fallback: r.jsx("div", {
              className: "flex h-full min-h-[22rem] items-center justify-center",
              children: r.jsx(ft, { className: "text-gamecowork-color-accent-default h-7 w-7 animate-spin" }),
            }),
            children: r.jsx(Yn, { url: e, title: t }),
          }),
      r.jsxs("div", {
        role: "group",
        "aria-label": n("generation.detail.skyboxView", "Skybox view"),
        className:
          "border-gamecowork-color-border-default bg-gamecowork-color-surface-elevated absolute left-1/2 top-3 z-10 flex -translate-x-1/2 overflow-hidden rounded-lg border border-solid p-0.5 shadow-lg",
        children: [
          r.jsxs("button", {
            type: "button",
            "aria-pressed": a === "flat",
            onClick: () => s("flat"),
            className: le(
              "flex h-8 cursor-pointer items-center gap-1.5 rounded-md border-none px-2.5 text-xs transition-colors",
              a === "flat"
                ? "bg-gamecowork-color-interactive-selected text-gamecowork-color-text-primary"
                : "text-gamecowork-color-text-secondary hover:bg-gamecowork-color-interactive-hover bg-transparent",
            ),
            children: [r.jsx(jr, { className: "h-3.5 w-3.5" }), n("generation.detail.skyboxFlat", "Flat")],
          }),
          r.jsxs("button", {
            type: "button",
            "aria-pressed": a === "immersive",
            onClick: () => s("immersive"),
            className: le(
              "flex h-8 cursor-pointer items-center gap-1.5 rounded-md border-none px-2.5 text-xs transition-colors",
              a === "immersive"
                ? "bg-gamecowork-color-interactive-selected text-gamecowork-color-text-primary"
                : "text-gamecowork-color-text-secondary hover:bg-gamecowork-color-interactive-hover bg-transparent",
            ),
            children: [r.jsx(Er, { className: "h-3.5 w-3.5" }), n("generation.detail.skyboxImmersive", "Immersive")],
          }),
        ],
      }),
    ],
  });
}
function na({ label: e }) {
  const { t } = ie();
  return r.jsxs("div", {
    className:
      "text-gamecowork-color-text-tertiary flex h-full min-h-[18rem] w-full flex-col items-center justify-center gap-3 text-center",
    children: [
      r.jsx(Nr, { className: "h-12 w-12 opacity-40" }),
      r.jsx("span", { className: "text-gamecowork-color-text-secondary text-sm font-medium", children: e }),
      r.jsx("span", {
        className: "max-w-sm px-6 text-xs leading-5",
        children: t(
          "generation.detail.noPreviewHint",
          "This result has no supported preview, but its files are available for download.",
        ),
      }),
    ],
  });
}
function aa({ prompt: e }) {
  const { t } = ie(),
    { copied: n, copyText: a } = kr(e),
    s = n ? t("generation.detail.copied", "Copied") : t("generation.detail.copyPrompt", "Copy prompt");
  return r.jsx("button", {
    type: "button",
    "data-testid": "copy-prompt",
    "aria-label": s,
    title: s,
    onClick: a,
    className: le(
      "ml-auto flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent transition-colors duration-200",
      n
        ? "text-gamecowork-color-status-success-text"
        : "text-gamecowork-color-text-tertiary hover:bg-gamecowork-color-interactive-hover hover:text-gamecowork-color-text-primary",
    ),
    children: n ? r.jsx(Tr, { className: "h-3.5 w-3.5" }) : r.jsx(Sr, { className: "h-3.5 w-3.5" }),
  });
}
function xa({
  task: e,
  onClose: t,
  onDownload: n,
  onDownloadAll: a,
  projectPath: s,
  onUseAsReference: i,
  referenceTargetHint: m,
  onDiscardStateChange: u,
  onRegenerate: b,
  navigation: p,
  editorIntegration: c,
}) {
  var he, re, be, ce;
  (l.useEffect(() => {
    if (dr())
      return (
        window.parent.postMessage(
          { source: "iframe", messageType: "shell/modalStateChanged", data: { open: !0 } },
          "*",
        ),
        () => {
          window.parent.postMessage(
            { source: "iframe", messageType: "shell/modalStateChanged", data: { open: !1 } },
            "*",
          );
        }
      );
  }, []),
    l.useEffect(() => {
      if (!p) return;
      const N = (k) => {
        if (k.key !== "ArrowLeft" && k.key !== "ArrowRight") return;
        const Q = document.activeElement;
        if (!(Q instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(Q.tagName) || Q.isContentEditable)))
          if (k.key === "ArrowLeft") {
            if (!p.hasPrev) return;
            (k.preventDefault(), p.onPrev());
          } else {
            if (!p.hasNext) return;
            (k.preventDefault(), p.onNext());
          }
      };
      return (window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N));
    }, [p]));
  const { t: d } = ie(),
    o = l.useMemo(() => Pr(e), [e]),
    h = l.useMemo(() => Ye(e.type) || d("generation.detail.unknown", "Unknown"), [d, e.type]),
    f = d(`generation.detail.categoryTitle.${o.category}`, qn[o.category]),
    x = d(`generation.status.${e.status}`, Ye(e.status) || d("generation.detail.unknown", "Unknown")),
    g = typeof e.creditsConsumed == "number" ? e.creditsConsumed : 0,
    P = l.useMemo(() => {
      if (!e.createdTime) return d("generation.detail.unknown", "Unknown");
      const N = new Date(e.createdTime);
      return Number.isNaN(N.getTime())
        ? d("generation.detail.unknown", "Unknown")
        : new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(N);
    }, [d, e.createdTime]),
    T = (c == null ? void 0 : c.status) === "opening" || (c == null ? void 0 : c.status) === "locating",
    [j, E] = l.useState((re = (he = o.downloads[0]) == null ? void 0 : he.url) != null ? re : ""),
    [$, I] = l.useState(!1),
    w = (be = o.downloads.find((N) => N.url === j)) != null ? be : o.downloads[0],
    O = s != null ? s : e.localPath;
  l.useEffect(() => {
    var N, k;
    E((k = (N = o.downloads[0]) == null ? void 0 : N.url) != null ? k : "");
  }, [o.downloads, e.id, e.taskId]);
  const Y =
      !!o.imageUrl && !o.videoUrl && !o.audioUrl && !o.modelAsset && (o.category === "image" || o.category === "other"),
    D = !!i && Y,
    [S, F] = l.useState("idle"),
    [G, V] = l.useState(null),
    K = l.useRef(null),
    Z = l.useRef(null),
    z = () => {
      Z.current !== null && (clearTimeout(Z.current), (Z.current = null));
    };
  l.useEffect(() => z, []);
  const [v, M] = l.useState("idle");
  l.useEffect(() => {
    (z(), (K.current = null), F("idle"), V(null), M("idle"));
  }, [e.id, e.taskId]);
  const J = () => {
    !u ||
      v === "pending" ||
      (M("pending"),
      Promise.resolve(u(!e.discarded))
        .catch(() => {})
        .finally(() => {
          M("idle");
        }));
  };
  l.useEffect(() => {
    if (!D) return;
    const N = (k) => {
      var Ae, Oe;
      if (((Ae = k.data) == null ? void 0 : Ae.messageType) !== wr) return;
      const Q = k.data.data;
      if (!(!Q || Q.requestId !== K.current)) {
        if ((z(), Q.ok)) {
          t();
          return;
        }
        (F("error"), V((Oe = Q.error) != null ? Oe : null), (Z.current = setTimeout(() => F("idle"), 4e3)));
      }
    };
    return (window.addEventListener("message", N), () => window.removeEventListener("message", N));
  }, [D, t]);
  const C = () => {
      if (!i || !o.imageUrl || S === "pending") return;
      const N = Rr();
      ((K.current = N),
        F("pending"),
        V(null),
        i({ requestId: N, title: o.title, prompt: o.prompt, imageUrl: o.imageUrl }),
        z(),
        (Z.current = setTimeout(() => {
          (F((k) => (k === "pending" ? "error" : k)), V((k) => (k != null ? k : "timeout")));
        }, 1e4)));
    },
    te = async () => {
      if ($ || o.downloads.length === 0) return;
      const N = o.downloads.map((k) => k.url);
      I(!0);
      try {
        if (a) {
          a(N);
          return;
        }
        for (let k = 0; k < N.length; k++) (n(N[k]), k < N.length - 1 && (await new Promise((Q) => setTimeout(Q, Qn))));
      } finally {
        I(!1);
      }
    },
    _ = (() => {
      if (o.category === "3d" && o.modelAsset) {
        const N = o.modelAsset.url.split("?")[0].toUpperCase().endsWith(".GLB") ? "GLB" : "FBX";
        return r.jsx(l.Suspense, {
          fallback: r.jsx("div", {
            className: "flex h-full min-h-[18rem] items-center justify-center",
            children: r.jsx(ft, { className: "text-gamecowork-color-accent-default h-7 w-7 animate-spin" }),
          }),
          children: r.jsx(zn, { url: o.modelAsset.url, format: N }),
        });
      }
      return o.imageUrl && ta(e.type)
        ? r.jsx(ra, { url: o.imageUrl, title: o.title })
        : o.category === "image" && o.imageUrl
          ? r.jsx(Pe, { url: o.imageUrl, title: o.title })
          : o.category === "video" && o.videoUrl
            ? r.jsx(Qe, { url: o.videoUrl, poster: o.thumbnailUrl, title: o.title })
            : o.category === "audio" && o.audioUrl
              ? r.jsx(qe, { url: o.audioUrl, title: o.title })
              : o.imageUrl
                ? r.jsx(Pe, { url: o.imageUrl, title: o.title })
                : o.videoUrl
                  ? r.jsx(Qe, { url: o.videoUrl, title: o.title })
                  : o.audioUrl
                    ? r.jsx(qe, { url: o.audioUrl, title: o.title })
                    : r.jsx(na, { label: d(`generation.category.${o.category}`, o.category) });
    })();
  return r.jsxs(mn, {
    open: !0,
    onClose: t,
    className: "relative z-[1200]",
    children: [
      r.jsx(un, {
        className: "fixed inset-0 bg-black/55 backdrop-blur-sm transition duration-200 data-[closed]:opacity-0",
      }),
      r.jsx("div", {
        className: "fixed inset-0 overflow-y-auto p-3 sm:p-5",
        children: r.jsx("div", {
          className: "flex min-h-full items-center justify-center",
          children: r.jsxs(wt, {
            className:
              "border-gamecowork-color-border-default bg-gamecowork-color-surface-primary text-gamecowork-color-text-default flex max-h-[calc(100vh-1.5rem)] w-full max-w-[104rem] flex-col overflow-hidden rounded-2xl border border-solid shadow-[0_28px_90px_rgba(0,0,0,.45)] transition duration-200 data-[closed]:scale-[.98] data-[closed]:opacity-0 xl:h-[min(48rem,calc(100vh-2.5rem))]",
            children: [
              r.jsxs("header", {
                className:
                  "border-gamecowork-color-border-subtle flex shrink-0 items-center gap-3 border-0 border-b border-solid px-4 py-3.5 sm:px-5",
                children: [
                  r.jsxs("div", {
                    className: "min-w-0 flex-1",
                    children: [
                      r.jsx(jt, {
                        className: "text-gamecowork-color-text-primary m-0 truncate text-base font-semibold",
                        children: f,
                      }),
                      r.jsxs("div", {
                        className: "text-gamecowork-color-text-tertiary mt-1 flex items-center gap-2 text-xs",
                        children: [
                          r.jsx("span", {
                            className:
                              "bg-gamecowork-color-interactive-hover text-gamecowork-color-text-secondary rounded-full px-2 py-0.5",
                            children: d(`generation.category.${o.category}`, o.category),
                          }),
                          r.jsx("span", { className: "min-w-0 truncate", children: h }),
                          r.jsx("span", { "aria-hidden": "true", children: "·" }),
                          r.jsx("span", { className: "shrink-0", children: x }),
                          g > 0
                            ? r.jsxs("span", {
                                "data-testid": "detail-credits-hint",
                                className: "group/credits relative inline-flex shrink-0 cursor-default items-center",
                                "aria-label": d("generation.detail.creditsUsed", "Credits used: {{credits}}", {
                                  credits: g,
                                }),
                                children: [
                                  r.jsx(Kn, {
                                    "aria-hidden": "true",
                                    className:
                                      "text-gamecowork-color-text-tertiary h-3 w-3 opacity-35 transition-opacity duration-200 group-hover/credits:opacity-100",
                                  }),
                                  r.jsx("span", {
                                    role: "tooltip",
                                    className:
                                      "border-gamecowork-color-border-default bg-gamecowork-color-surface-primary text-gamecowork-color-text-secondary pointer-events-none absolute top-[calc(100%+0.375rem)] left-1/2 z-[1300] -translate-x-1/2 rounded-md border border-solid px-2 py-1 text-[0.6875rem] tabular-nums whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-150 group-hover/credits:opacity-100",
                                    children: d("generation.detail.creditsUsed", "Credits used: {{credits}}", {
                                      credits: g,
                                    }),
                                  }),
                                ],
                              })
                            : null,
                          e.discarded &&
                            r.jsx("span", {
                              "data-testid": "detail-discarded-badge",
                              className:
                                "border-gamecowork-color-border-default text-gamecowork-color-text-tertiary shrink-0 rounded-full border border-solid px-2 py-0.5",
                              children: d("generation.discard.discardedFilter", "Discarded"),
                            }),
                        ],
                      }),
                    ],
                  }),
                  r.jsx("button", {
                    type: "button",
                    "aria-label": d("generation.detail.close", "Close details"),
                    onClick: t,
                    className:
                      "text-gamecowork-color-text-tertiary hover:bg-gamecowork-color-interactive-hover hover:text-gamecowork-color-text-primary flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent transition-colors",
                    children: r.jsx(ur, { className: "h-5 w-5" }),
                  }),
                ],
              }),
              r.jsxs("div", {
                className:
                  "grid min-h-0 flex-1 grid-cols-1 overflow-y-auto xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.85fr)] xl:overflow-hidden",
                children: [
                  r.jsxs("section", {
                    className:
                      "bg-gamecowork-color-surface-sunken relative flex min-h-[22rem] items-center justify-center overflow-hidden xl:min-h-0",
                    children: [
                      r.jsx("div", {
                        className:
                          "absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(128,128,128,.35)_1px,transparent_1px)] [background-size:18px_18px]",
                      }),
                      r.jsx("div", { className: "relative h-full min-h-[22rem] w-full xl:min-h-0", children: _ }),
                      p
                        ? r.jsxs(r.Fragment, {
                            children: [
                              r.jsx("button", {
                                type: "button",
                                "aria-label": d("generation.detail.previousRecord", "Previous record"),
                                title: d("generation.detail.previousRecord", "Previous record"),
                                "data-testid": "detail-prev-record",
                                onClick: p.onPrev,
                                disabled: !p.hasPrev,
                                className:
                                  "absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-solid border-white/20 bg-black/45 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60 disabled:pointer-events-none disabled:opacity-30",
                                children: r.jsx(mr, { className: "h-6 w-6" }),
                              }),
                              r.jsx("button", {
                                type: "button",
                                "aria-label": d("generation.detail.nextRecord", "Next record"),
                                title: d("generation.detail.nextRecord", "Next record"),
                                "data-testid": "detail-next-record",
                                onClick: p.onNext,
                                disabled: !p.hasNext,
                                className:
                                  "absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-solid border-white/20 bg-black/45 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60 disabled:pointer-events-none disabled:opacity-30",
                                children: r.jsx(fr, { className: "h-6 w-6" }),
                              }),
                            ],
                          })
                        : null,
                    ],
                  }),
                  r.jsxs("aside", {
                    className:
                      "border-gamecowork-color-border-subtle bg-gamecowork-color-surface-primary flex min-h-0 flex-col border-0 border-t border-solid xl:border-l xl:border-t-0",
                    children: [
                      r.jsxs("div", {
                        className: "min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5",
                        children: [
                          r.jsxs("section", {
                            children: [
                              r.jsxs("div", {
                                className:
                                  "text-gamecowork-color-text-secondary mb-2 flex min-w-0 items-center gap-2 text-xs font-medium",
                                children: [
                                  r.jsx(Hn, { className: "text-gamecowork-color-text-tertiary h-4 w-4 shrink-0" }),
                                  r.jsx("span", {
                                    className: "truncate",
                                    children: d("generation.detail.prompt", "Prompt"),
                                  }),
                                  o.prompt && r.jsx(aa, { prompt: o.prompt }),
                                ],
                              }),
                              r.jsx("div", {
                                className:
                                  "border-gamecowork-color-border-subtle bg-gamecowork-color-surface-sunken text-gamecowork-color-text-secondary max-w-full overflow-hidden whitespace-pre-wrap break-words rounded-xl border border-solid px-3.5 py-3 text-sm leading-6 [overflow-wrap:anywhere]",
                                children: o.prompt || d("generation.detail.noPrompt", "No prompt recorded"),
                              }),
                            ],
                          }),
                          r.jsxs("section", {
                            className: "grid grid-cols-2 gap-2.5",
                            children: [
                              r.jsxs("div", {
                                className:
                                  "border-gamecowork-color-border-subtle rounded-xl border border-solid px-3 py-2.5",
                                children: [
                                  r.jsxs("div", {
                                    className:
                                      "text-gamecowork-color-text-tertiary mb-1 flex items-center gap-1.5 text-[0.6875rem]",
                                    children: [
                                      r.jsx(On, { className: "h-3.5 w-3.5" }),
                                      d("generation.detail.createdAt", "Created"),
                                    ],
                                  }),
                                  r.jsx("div", {
                                    className: "text-gamecowork-color-text-primary text-xs leading-5",
                                    children: P,
                                  }),
                                ],
                              }),
                              r.jsxs("div", {
                                className:
                                  "border-gamecowork-color-border-subtle min-w-0 overflow-hidden rounded-xl border border-solid px-3 py-2.5",
                                children: [
                                  r.jsxs("div", {
                                    className:
                                      "text-gamecowork-color-text-tertiary mb-1 flex items-center gap-1.5 text-[0.6875rem]",
                                    children: [
                                      r.jsx(Cr, { className: "h-3.5 w-3.5 shrink-0" }),
                                      d("generation.detail.taskType", "Task type"),
                                    ],
                                  }),
                                  r.jsx("div", {
                                    className:
                                      "text-gamecowork-color-text-primary line-clamp-2 min-w-0 break-words text-xs font-medium leading-5 [overflow-wrap:anywhere]",
                                    children: h,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          O
                            ? r.jsxs("section", {
                                className: "border-gamecowork-color-border-subtle border-0 border-t border-solid pt-4",
                                children: [
                                  r.jsxs("div", {
                                    className:
                                      "text-gamecowork-color-text-secondary mb-2 flex min-w-0 items-center gap-2 text-xs font-medium",
                                    children: [
                                      r.jsx(pr, { className: "text-gamecowork-color-text-tertiary h-4 w-4 shrink-0" }),
                                      r.jsx("span", {
                                        className: "truncate",
                                        children: s
                                          ? d("generation.detail.projectPath", "Project path")
                                          : d("generation.detail.projectAsset", "{{editor}} project asset", {
                                              editor: (ce = c == null ? void 0 : c.editorName) != null ? ce : "Unity",
                                            }),
                                      }),
                                    ],
                                  }),
                                  r.jsx("div", {
                                    className:
                                      "border-gamecowork-color-border-subtle bg-gamecowork-color-surface-sunken text-gamecowork-color-text-secondary max-w-full break-all rounded-lg border border-solid px-3 py-2.5 font-mono text-[0.6875rem] leading-5",
                                    title: O,
                                    children: O,
                                  }),
                                ],
                              })
                            : null,
                          c != null && c.canReveal && c.status !== "idle"
                            ? r.jsx("div", {
                                className: le(
                                  "flex min-h-5 items-start gap-1.5 text-[0.6875rem] leading-5",
                                  c.status === "success"
                                    ? "text-gamecowork-color-status-success-text"
                                    : c.status === "error"
                                      ? "text-gamecowork-color-status-danger-text"
                                      : "text-gamecowork-color-text-tertiary",
                                ),
                                role: "status",
                                "aria-live": "polite",
                                children:
                                  c.status === "opening"
                                    ? r.jsxs(r.Fragment, {
                                        children: [
                                          r.jsx(de, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" }),
                                          r.jsx("span", {
                                            children: d(
                                              "generation.detail.openingEditor",
                                              "Opening {{editor}} and waiting for the Bridge...",
                                              { editor: c.editorName },
                                            ),
                                          }),
                                        ],
                                      })
                                    : c.status === "locating"
                                      ? r.jsxs(r.Fragment, {
                                          children: [
                                            r.jsx(de, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" }),
                                            r.jsx("span", {
                                              children: d(
                                                "generation.detail.locatingAsset",
                                                "Locating the asset in Project view...",
                                              ),
                                            }),
                                          ],
                                        })
                                      : c.status === "success"
                                        ? r.jsxs(r.Fragment, {
                                            children: [
                                              r.jsx(We, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
                                              r.jsx("span", {
                                                children: d(
                                                  "generation.detail.assetRevealed",
                                                  "Highlighted in {{editor}} Project view",
                                                  { editor: c.editorName },
                                                ),
                                              }),
                                            ],
                                          })
                                        : r.jsxs(r.Fragment, {
                                            children: [
                                              r.jsx(Ge, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
                                              r.jsx("span", {
                                                children:
                                                  c.error ||
                                                  d(
                                                    "generation.detail.revealFailed",
                                                    "Could not locate this asset in {{editor}}",
                                                    { editor: c.editorName },
                                                  ),
                                              }),
                                            ],
                                          }),
                              })
                            : null,
                        ],
                      }),
                      r.jsxs("footer", {
                        className:
                          "border-gamecowork-color-border-subtle bg-gamecowork-color-surface-primary flex shrink-0 flex-wrap items-center justify-between gap-2 border-0 border-t border-solid p-4 sm:px-5",
                        children: [
                          c != null && c.canReveal
                            ? r.jsxs("button", {
                                type: "button",
                                "data-testid": "reveal-in-editor",
                                onClick: c.onReveal,
                                disabled: T,
                                className:
                                  "border-gamecowork-color-border-default bg-gamecowork-color-surface-sunken text-gamecowork-color-text-primary hover:bg-gamecowork-color-interactive-hover flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-solid px-3 py-2 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-70",
                                children: [
                                  T
                                    ? r.jsx(de, { className: "h-4 w-4 animate-spin" })
                                    : r.jsx(hr, { className: "h-4 w-4" }),
                                  r.jsx("span", {
                                    children:
                                      c.status === "success"
                                        ? d("generation.detail.revealAgain", "Reveal again in {{editor}}", {
                                            editor: c.editorName,
                                          })
                                        : d("generation.detail.revealInEditor", "Reveal in {{editor}}", {
                                            editor: c.editorName,
                                          }),
                                  }),
                                ],
                              })
                            : null,
                          b
                            ? r.jsxs("button", {
                                type: "button",
                                "data-testid": "detail-regenerate-button",
                                onClick: b,
                                className:
                                  "border-gamecowork-color-accent-border bg-gamecowork-color-accent-default text-gamecowork-color-text-accent hover:bg-gamecowork-color-accent-hover flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-solid px-3 py-2 text-xs font-medium transition-colors",
                                children: [
                                  r.jsx(br, { className: "h-4 w-4" }),
                                  r.jsx("span", { children: d("generation.regenerate", "Regenerate") }),
                                ],
                              })
                            : null,
                          u
                            ? r.jsxs("button", {
                                type: "button",
                                "data-testid": "detail-discard-button",
                                onClick: J,
                                disabled: v === "pending",
                                title: e.discarded
                                  ? d(
                                      "generation.discard.restoreHint",
                                      "Restored records will reappear in the history list",
                                    )
                                  : d(
                                      "generation.discard.actionHint",
                                      "Discarded records are hidden from the history list and can be restored at any time",
                                    ),
                                className: le(
                                  "flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-solid px-3 py-2 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-70",
                                  e.discarded
                                    ? "border-gamecowork-color-accent-border bg-gamecowork-color-accent-default text-gamecowork-color-text-accent hover:bg-gamecowork-color-accent-hover"
                                    : "border-gamecowork-color-border-default bg-gamecowork-color-surface-sunken text-gamecowork-color-text-secondary hover:bg-gamecowork-color-interactive-hover hover:text-gamecowork-color-text-primary",
                                ),
                                children: [
                                  v === "pending"
                                    ? r.jsx(de, { className: "h-4 w-4 animate-spin" })
                                    : e.discarded
                                      ? r.jsx(xr, { className: "h-4 w-4" })
                                      : r.jsx(vr, { className: "h-4 w-4" }),
                                  r.jsx("span", {
                                    children: e.discarded
                                      ? d("generation.discard.restore", "Restore")
                                      : d("generation.discard.action", "Discard"),
                                  }),
                                ],
                              })
                            : null,
                          w
                            ? r.jsxs("div", {
                                className: "ml-auto flex min-h-9 max-w-full flex-wrap items-center justify-end gap-2",
                                children: [
                                  D
                                    ? r.jsxs("button", {
                                        type: "button",
                                        "data-testid": "use-as-reference",
                                        onClick: C,
                                        disabled: S === "pending",
                                        title: S === "error" && G ? G : m,
                                        className: le(
                                          "border-gamecowork-color-accent-border flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-solid px-3.5 py-2 text-xs font-medium text-white shadow-[0_4px_14px_color-mix(in_srgb,var(--gamecowork-color-accent-default)_38%,transparent)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--gamecowork-color-accent-default)_50%,transparent)] disabled:cursor-default",
                                          S === "error"
                                            ? "border-gamecowork-color-border-error bg-[linear-gradient(135deg,var(--gamecowork-color-border-error),color-mix(in_srgb,var(--gamecowork-color-border-error)_55%,#7a1f1f))]"
                                            : "bg-[linear-gradient(135deg,var(--gamecowork-color-accent-active),var(--gamecowork-color-accent-default))]",
                                        ),
                                        children: [
                                          S === "pending"
                                            ? r.jsx(de, { className: "h-4 w-4 animate-spin" })
                                            : S === "error"
                                              ? r.jsx(Ge, { className: "h-4 w-4" })
                                              : r.jsx(gr, { className: "h-4 w-4" }),
                                          r.jsx("span", {
                                            children:
                                              S === "pending"
                                                ? d("generation.reference.adding", "Adding…")
                                                : S === "error"
                                                  ? d("generation.reference.failed", "Failed to add")
                                                  : d("generation.reference.useAsReference", "Use as reference"),
                                          }),
                                        ],
                                      })
                                    : null,
                                  o.downloads.length > 1
                                    ? r.jsxs("button", {
                                        type: "button",
                                        "data-testid": "download-all",
                                        "aria-label": d("generation.downloadAll", "Download All"),
                                        onClick: () => void te(),
                                        disabled: $,
                                        className:
                                          "border-gamecowork-color-accent-border bg-gamecowork-color-accent-default text-gamecowork-color-text-accent hover:bg-gamecowork-color-accent-hover flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-solid px-3 py-2 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-70",
                                        children: [
                                          $
                                            ? r.jsx(de, { className: "h-4 w-4 animate-spin" })
                                            : r.jsx(Ke, { className: "h-4 w-4" }),
                                          r.jsx("span", { children: d("generation.downloadAll", "Download All") }),
                                        ],
                                      })
                                    : null,
                                  r.jsxs("div", {
                                    className:
                                      "border-gamecowork-color-accent-border relative flex min-h-9 max-w-full rounded-lg border border-solid",
                                    children: [
                                      r.jsxs("button", {
                                        type: "button",
                                        "aria-label": d("generation.detail.downloadSelected", "Download {{format}}", {
                                          format: w.label,
                                        }),
                                        onClick: () => n(w.url),
                                        className:
                                          "bg-gamecowork-color-accent-default text-gamecowork-color-text-accent hover:bg-gamecowork-color-accent-hover flex cursor-pointer items-center justify-center gap-2 rounded-l-[0.4375rem] border-none px-3 py-2 text-xs font-medium transition-colors",
                                        children: [
                                          r.jsx(Ke, { className: "h-4 w-4" }),
                                          r.jsx("span", { children: d("generation.download", "Download") }),
                                        ],
                                      }),
                                      o.downloads.length > 1
                                        ? r.jsxs(_n, {
                                            as: "div",
                                            className: "relative flex",
                                            children: [
                                              r.jsxs(Et, {
                                                type: "button",
                                                "aria-label": d(
                                                  "generation.showDownloadOptions",
                                                  "Show download options",
                                                ),
                                                className:
                                                  "border-gamecowork-color-accent-border bg-gamecowork-color-accent-default text-gamecowork-color-text-accent hover:bg-gamecowork-color-accent-hover flex min-w-[4.25rem] cursor-pointer items-center justify-center gap-1 rounded-r-[0.4375rem] border-0 border-l border-solid px-2.5 py-2 text-xs font-medium transition-colors",
                                                children: [
                                                  r.jsx("span", { className: "max-w-20 truncate", children: w.label }),
                                                  r.jsx(yr, { className: "h-3.5 w-3.5 shrink-0" }),
                                                ],
                                              }),
                                              r.jsx(Nt, {
                                                className:
                                                  "border-gamecowork-color-border-default bg-gamecowork-color-surface-primary absolute bottom-[calc(100%+0.5rem)] right-0 z-[1300] box-border max-h-80 min-w-36 overflow-y-auto overflow-x-hidden overscroll-contain rounded-lg border border-solid p-1 shadow-2xl focus:outline-none",
                                                children: o.downloads.map((N) =>
                                                  r.jsxs(
                                                    kt,
                                                    {
                                                      as: "button",
                                                      type: "button",
                                                      onClick: () => E(N.url),
                                                      className:
                                                        "text-gamecowork-color-text-primary data-[focus]:bg-gamecowork-color-interactive-hover flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border-none bg-transparent px-2.5 py-2 text-left text-xs focus:outline-none",
                                                      children: [
                                                        r.jsx("span", { className: "truncate", children: N.label }),
                                                        N.url === w.url
                                                          ? r.jsx(We, {
                                                              className:
                                                                "text-gamecowork-color-accent-default h-3.5 w-3.5 shrink-0",
                                                            })
                                                          : null,
                                                      ],
                                                    },
                                                    N.url,
                                                  ),
                                                ),
                                              }),
                                            ],
                                          })
                                        : r.jsx("span", {
                                            className:
                                              "border-gamecowork-color-accent-border bg-gamecowork-color-accent-default text-gamecowork-color-text-accent flex min-w-[4.25rem] items-center justify-center rounded-r-[0.4375rem] border-0 border-l border-solid px-2.5 py-2 text-xs font-medium",
                                            children: w.label,
                                          }),
                                    ],
                                  }),
                                ],
                              })
                            : r.jsx("span", {
                                className: "text-gamecowork-color-text-tertiary text-xs",
                                children: d("generation.detail.noFiles", "No downloadable files"),
                              }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    ],
  });
}
export { xa as GenerationDetailDialog };
