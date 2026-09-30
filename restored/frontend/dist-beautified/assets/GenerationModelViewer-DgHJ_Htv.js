import { r as i, u as K, j as t, c as Q } from "./registry-BL-NPVNy.js";
import {
  C as ee,
  S as te,
  P as ne,
  W as se,
  c as oe,
  A as re,
  H as ae,
  D as U,
  G as ie,
  e as W,
  f as le,
  B as _,
  V as $,
  g as ce,
} from "./three.module-C8hHHSST.js";
import { O as de, G as ue, F as fe } from "./GLTFLoader-D_VqbMdM.js";
import { L as me } from "./VscTheme-BExNMG_K.js";
import { F as he } from "./index-BRxZ4eG7.js";
/* empty css                 */ import "./MoveUpRightIcon-FDLB66AF.js";
import "./store-c6kNGz30.js";
import "./unityInsightIndex-BuKbJPJQ.js";
import "./projectMenuFlows-B5bpQmCU.js";
import "./openTjhubTab-qOsuwIY5.js";
import "./shallowEqual-C2yO7zFp.js";
import "./core-BtpCLyE5.js";
(function () {
  var n =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  n.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var n =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      o = new n.Error().stack;
    o &&
      ((n._sentryDebugIds = n._sentryDebugIds || {}),
      (n._sentryDebugIds[o] = "30fb4c6b-362d-47b9-809a-180897b3d4a3"),
      (n._sentryDebugIdIdentifier = "sentry-dbid-30fb4c6b-362d-47b9-809a-180897b3d4a3"));
  })();
} catch {}
function pe({ title: n, titleId: o, ...a }, s) {
  return i.createElement(
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
        ref: s,
        "aria-labelledby": o,
      },
      a,
    ),
    n ? i.createElement("title", { id: o }, n) : null,
    i.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    }),
  );
}
const Z = i.forwardRef(pe);
function be(n) {
  let o = 0;
  return (
    n.traverse((a) => {
      var p, b, x, g;
      const s = a;
      if (!s.isMesh) return;
      const r =
          (g =
            (x = (p = s.geometry.index) == null ? void 0 : p.count) != null
              ? x
              : (b = s.geometry.getAttribute("position")) == null
                ? void 0
                : b.count) != null
            ? g
            : 0,
        d = s,
        u = d.isInstancedMesh ? d.count : 1;
      o += Math.floor(r / 3) * u;
    }),
    o
  );
}
function F(n) {
  const o = new Set(),
    a = new Set();
  (n.traverse((s) => {
    var u;
    const r = s;
    if (!r.isMesh) return;
    ((u = r.geometry) == null || u.dispose(),
      (Array.isArray(r.material) ? r.material : [r.material]).forEach((p) => {
        p && a.add(p);
      }));
  }),
    a.forEach((s) => {
      for (const r of Object.values(s)) r instanceof W && o.add(r);
      if (s instanceof le)
        for (const r of Object.values(s.uniforms)) {
          const d = Array.isArray(r.value) ? r.value : [r.value];
          for (const u of d) u instanceof W && o.add(u);
        }
      s.dispose();
    }),
    o.forEach((s) => s.dispose()));
}
function Te({ url: n, format: o }) {
  var O;
  const { t: a, i18n: s } = K(),
    r = i.useRef(null),
    d = i.useRef(null),
    u = i.useRef(null),
    [p, b] = i.useState(!0),
    [x, g] = i.useState(!1),
    [y, q] = i.useState(!0),
    [D, N] = i.useState(null);
  (i.useEffect(() => {
    d.current && (d.current.autoRotate = y);
  }, [y]),
    i.useEffect(() => {
      const m = r.current;
      if (!m) return;
      (b(!0), g(!1), N(null));
      let w = !1,
        H = 0,
        R = null,
        l = null,
        L = null;
      const Y = new ee(),
        v = new te(),
        j = new ne(35, 1, 0.01, 100);
      (j.position.set(3.4, 2.2, 4.2), (u.current = j));
      let c;
      try {
        c = new se({ antialias: !0, alpha: !0, powerPreference: "high-performance" });
      } catch {
        (b(!1), g(!0));
        return;
      }
      (c.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)),
        (c.outputColorSpace = oe),
        (c.toneMapping = re),
        (c.toneMappingExposure = 1.15),
        (c.domElement.className = "block h-full w-full"),
        m.appendChild(c.domElement));
      const h = new de(j, c.domElement);
      ((h.enableDamping = !0),
        (h.dampingFactor = 0.075),
        (h.autoRotate = y),
        (h.autoRotateSpeed = 1.25),
        (h.minDistance = 1.6),
        (h.maxDistance = 10),
        h.target.set(0, 0, 0),
        (d.current = h),
        v.add(new ae(16777215, 3359061, 2.1)));
      const B = new U(16777215, 3.2);
      (B.position.set(4, 6, 5), v.add(B));
      const z = new U(9090303, 1.8);
      (z.position.set(-4, 2, -3), v.add(z));
      const E = new ie(10, 24, 7041664, 4674921),
        A = E.material;
      ((A.transparent = !0), (A.opacity = 0.22), (E.position.y = -1.22), v.add(E));
      const V = (e, f = []) => {
          if (w) {
            F(e);
            return;
          }
          const k = new _().setFromObject(e).getSize(new $()),
            S = Math.max(k.x, k.y, k.z);
          if (!Number.isFinite(S) || S <= 0) {
            (console.error("[ModelViewer] invalid bounds:", { largestAxis: S, size: k, url: n }), F(e), b(!1), g(!0));
            return;
          }
          e.scale.multiplyScalar(2.4 / S);
          const J = new _().setFromObject(e).getCenter(new $());
          (e.position.sub(J),
            e.traverse((M) => {
              const T = M;
              T.isMesh && ((T.castShadow = !0), (T.receiveShadow = !0));
            }),
            N(be(e)),
            (R = e),
            v.add(e),
            f.length > 0 && ((l = new ce(e)), f.forEach((M) => (l == null ? void 0 : l.clipAction(M).play()))),
            b(!1));
        },
        C = (e) => {
          w || (console.error("[ModelViewer] load failed:", e, { url: n, format: o }), b(!1), g(!0), N(null));
        };
      fetch(n)
        .then((e) => {
          if (!e.ok) throw new Error(`HTTP ${e.status} ${e.statusText}`);
          return e.blob();
        })
        .then((e) => {
          w ||
            ((L = URL.createObjectURL(e)),
            o === "GLB"
              ? new ue().load(L, (f) => V(f.scene, f.animations), void 0, C)
              : new fe().load(L, (f) => V(f, f.animations), void 0, C));
        })
        .catch(C);
      const G = () => {
          const e = Math.max(m.clientWidth, 1),
            f = Math.max(m.clientHeight, 1);
          ((j.aspect = e / f), j.updateProjectionMatrix(), c.setSize(e, f, !1));
        },
        I = new ResizeObserver(G);
      (I.observe(m), G());
      const P = () => {
        H = requestAnimationFrame(P);
        const e = Y.getDelta();
        (l == null || l.update(e), h.update(), c.render(v, j));
      };
      return (
        P(),
        () => {
          ((w = !0),
            cancelAnimationFrame(H),
            I.disconnect(),
            h.dispose(),
            (d.current = null),
            (u.current = null),
            l == null || l.stopAllAction(),
            l && R && l.uncacheRoot(R),
            R && F(R),
            L && URL.revokeObjectURL(L),
            E.geometry.dispose(),
            A.dispose(),
            c.dispose(),
            c.domElement.remove());
        }
      );
    }, [o, n]));
  const X = () => {
    const m = u.current,
      w = d.current;
    !m || !w || (m.position.set(3.4, 2.2, 4.2), w.target.set(0, 0, 0), w.update());
  };
  return t.jsxs("div", {
    "data-generation-model-viewer": o.toLowerCase(),
    className: "relative h-full min-h-[18rem] w-full overflow-hidden",
    children: [
      t.jsx("div", { ref: r, className: "absolute inset-0" }),
      D !== null &&
        !p &&
        !x &&
        t.jsxs("div", {
          className:
            "pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-solid border-white/10 bg-black/30 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-md",
          children: [
            t.jsxs("svg", {
              viewBox: "0 0 18 18",
              "aria-hidden": "true",
              className: "h-4 w-4 text-white/55",
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "1.25",
              children: [
                t.jsx("path", { d: "M9 2.25 16 15.5H2L9 2.25Z" }),
                t.jsx("path", { d: "m9 2.25 2.25 8.75M2 15.5 11.25 11 16 15.5" }),
              ],
            }),
            t.jsxs("div", {
              className: "flex items-baseline gap-1.5",
              children: [
                t.jsx("span", {
                  className: "font-mono text-xs font-semibold tabular-nums text-white/90",
                  children: D.toLocaleString((O = s.resolvedLanguage) != null ? O : s.language),
                }),
                t.jsx("span", {
                  className: "text-[0.625rem] font-medium tracking-wide text-white/60",
                  children: a("generation.detail.triangleCount", "Triangles"),
                }),
              ],
            }),
          ],
        }),
      t.jsxs("div", {
        className:
          "absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-solid border-white/10 bg-black/30 p-1 shadow-lg backdrop-blur-md",
        children: [
          t.jsx("button", {
            type: "button",
            "aria-label": a("generation.detail.autoRotate", "Auto rotate"),
            "aria-pressed": y,
            onClick: () => q((m) => !m),
            className: Q(
              "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none text-white/75 transition-colors hover:bg-white/10 hover:text-white",
              y && "bg-white/15 text-white",
            ),
            children: t.jsx(he, { className: "h-4 w-4" }),
          }),
          t.jsx("button", {
            type: "button",
            "aria-label": a("generation.detail.resetView", "Reset view"),
            onClick: X,
            className:
              "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-white/75 transition-colors hover:bg-white/10 hover:text-white",
            children: t.jsx(Z, { className: "h-4 w-4" }),
          }),
        ],
      }),
      p &&
        t.jsxs("div", {
          className:
            "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 text-sm text-white/70 backdrop-blur-[1px]",
          children: [
            t.jsx(me, { className: "h-7 w-7 animate-spin" }),
            t.jsx("span", { children: a("generation.detail.loadingModel", "Loading 3D model…") }),
          ],
        }),
      x &&
        t.jsxs("div", {
          className: "absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center text-white/70",
          children: [
            t.jsx(Z, { className: "h-9 w-9 opacity-60" }),
            t.jsx("span", {
              className: "text-sm font-medium text-white/90",
              children: a("generation.detail.modelError", "Unable to preview this model"),
            }),
            t.jsx("span", {
              className: "text-xs leading-5",
              children: a("generation.detail.modelErrorHint", "The file can still be downloaded from the file list."),
            }),
          ],
        }),
      !x &&
        t.jsx("div", {
          className:
            "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/35 px-3 py-1 text-[0.625rem] text-white/65 backdrop-blur-sm",
          children: a("generation.detail.modelHint", "Drag to rotate · Scroll to zoom"),
        }),
    ],
  });
}
export { be as countObjectTriangles, Te as default, F as disposeObject };
