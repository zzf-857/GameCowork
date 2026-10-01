import { u as N, r as S, j as p } from "./registry-BL-NPVNy.js";
import {
  W as Y,
  S as _,
  P as z,
  a as U,
  M as G,
  b as W,
  T as X,
  c as O,
  L as B,
  d as f,
} from "./three.module-C8hHHSST.js";
(function () {
  var r =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  r.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var r =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      l = new r.Error().stack;
    l &&
      ((r._sentryDebugIds = r._sentryDebugIds || {}),
      (r._sentryDebugIds[l] = "295407f3-9238-4ff5-a7b5-0908e3b1f481"),
      (r._sentryDebugIdIdentifier = "sentry-dbid-295407f3-9238-4ff5-a7b5-0908e3b1f481"));
  })();
} catch {}
function K({ url: r, title: l }) {
  const { t: w } = N(),
    M = S.useRef(null),
    [y, m] = S.useState("loading");
  return (
    S.useEffect(() => {
      const d = M.current;
      if (!d) return;
      m("loading");
      let t;
      try {
        t = new Y({ antialias: !0, powerPreference: "high-performance" });
      } catch {
        m("error");
        return;
      }
      let v = !1,
        i,
        u = 0,
        s = 0,
        b,
        x = 0,
        E = 0;
      const P = new _(),
        o = new z(70, 1, 0.1, 200),
        k = new U(100, 64, 40);
      k.scale(-1, 1, 1);
      const c = new G({ color: 2105376 }),
        T = new W(k, c);
      (P.add(T),
        t.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)),
        t.setClearColor(1118481, 1),
        t.domElement.setAttribute("aria-label", l),
        t.domElement.setAttribute("role", "img"),
        (t.domElement.tabIndex = 0),
        Object.assign(t.domElement.style, {
          cursor: "grab",
          display: "block",
          height: "100%",
          outline: "none",
          touchAction: "none",
          width: "100%",
        }),
        d.appendChild(t.domElement));
      const h = () => t.render(P, o),
        L = () => {
          s = f.clamp(s, -85, 85);
          const e = f.degToRad(90 - s),
            a = f.degToRad(u);
          (o.lookAt(100 * Math.sin(e) * Math.cos(a), 100 * Math.cos(e), 100 * Math.sin(e) * Math.sin(a)), h());
        },
        j = () => {
          const e = Math.max(d.clientWidth, 1),
            a = Math.max(d.clientHeight, 1);
          ((o.aspect = e / a), o.updateProjectionMatrix(), t.setSize(e, a, !1), h());
        },
        I = new ResizeObserver(j);
      (I.observe(d),
        j(),
        L(),
        new X().load(
          r,
          (e) => {
            if (v) {
              e.dispose();
              return;
            }
            ((i = e),
              (i.colorSpace = O),
              (i.minFilter = B),
              c.color.set(16777215),
              (c.map = i),
              (c.needsUpdate = !0),
              m("ready"),
              h());
          },
          void 0,
          () => {
            v || m("error");
          },
        ));
      const R = (e) => {
          ((b = e.pointerId),
            (x = e.clientX),
            (E = e.clientY),
            t.domElement.setPointerCapture(e.pointerId),
            (t.domElement.style.cursor = "grabbing"));
        },
        D = (e) => {
          b === e.pointerId &&
            ((u += (x - e.clientX) * 0.16), (s += (e.clientY - E) * 0.16), (x = e.clientX), (E = e.clientY), L());
        },
        g = (e) => {
          b === e.pointerId &&
            ((b = void 0),
            t.domElement.hasPointerCapture(e.pointerId) && t.domElement.releasePointerCapture(e.pointerId),
            (t.domElement.style.cursor = "grab"));
        },
        A = (e) => {
          (e.preventDefault(), (o.fov = f.clamp(o.fov + e.deltaY * 0.04, 35, 90)), o.updateProjectionMatrix(), h());
        },
        C = (e) => {
          if (e.key === "ArrowLeft") u -= 4;
          else if (e.key === "ArrowRight") u += 4;
          else if (e.key === "ArrowUp") s += 4;
          else if (e.key === "ArrowDown") s -= 4;
          else if (e.key === "+" || e.key === "=") o.fov -= 4;
          else if (e.key === "-" || e.key === "_") o.fov += 4;
          else return;
          (e.preventDefault(), (o.fov = f.clamp(o.fov, 35, 90)), o.updateProjectionMatrix(), L());
        },
        n = t.domElement;
      return (
        n.addEventListener("pointerdown", R),
        n.addEventListener("pointermove", D),
        n.addEventListener("pointerup", g),
        n.addEventListener("pointercancel", g),
        n.addEventListener("wheel", A, { passive: !1 }),
        n.addEventListener("keydown", C),
        () => {
          ((v = !0),
            I.disconnect(),
            n.removeEventListener("pointerdown", R),
            n.removeEventListener("pointermove", D),
            n.removeEventListener("pointerup", g),
            n.removeEventListener("pointercancel", g),
            n.removeEventListener("wheel", A),
            n.removeEventListener("keydown", C),
            i == null || i.dispose(),
            k.dispose(),
            c.dispose(),
            t.dispose(),
            n.remove());
        }
      );
    }, [l, r]),
    p.jsxs("div", {
      className: "relative h-full min-h-[22rem] w-full bg-black",
      children: [
        p.jsx("div", { ref: M, className: "absolute inset-0" }),
        y === "loading"
          ? p.jsx("div", {
              className:
                "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 text-xs text-white/75",
              children: w("generation.detail.skyboxLoading", "Loading immersive preview..."),
            })
          : null,
        y === "error"
          ? p.jsx("div", {
              role: "alert",
              className:
                "absolute inset-0 flex items-center justify-center bg-black/70 px-6 text-center text-sm text-white/80",
              children: w("generation.detail.skyboxError", "Unable to load immersive preview"),
            })
          : null,
        y === "ready"
          ? p.jsx("div", {
              className:
                "pointer-events-none absolute inset-x-0 bottom-3 text-center text-[0.6875rem] text-white/75 drop-shadow",
              children: w("generation.detail.skyboxHint", "Drag to look around · Scroll to zoom"),
            })
          : null,
      ],
    })
  );
}
export { K as default };
