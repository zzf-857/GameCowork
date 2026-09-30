import { p as E } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  _ as c,
  s as O,
  g as R,
  q as D,
  p as F,
  a as G,
  b as P,
  I as z,
  t as B,
  F as w,
  D as C,
  G as W,
  l as A,
  J as V,
  e as H,
} from "./registry-CHHSpXp3.js";
import { p as j } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      (e._sentryDebugIds[t] = "2517eff3-cc6f-48d5-ad09-722a2db898b2"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-2517eff3-cc6f-48d5-ad09-722a2db898b2"));
  })();
} catch {}
var m = { showLegend: !0, ticks: 5, max: null, min: 0, graticule: "circle" },
  b = 32,
  M = { axes: [], curves: [], options: m },
  h = structuredClone(M),
  N = W.radar,
  U = c(() => w({ ...N, ...C().radar }), "getConfig"),
  T = c(() => h.axes, "getAxes"),
  X = c(() => h.curves, "getCurves"),
  Y = c(() => h.options, "getOptions"),
  q = c((e) => {
    h.axes = e.map((t) => {
      var a;
      return { name: t.name, label: (a = t.label) != null ? a : t.name };
    });
  }, "setAxes"),
  J = c((e) => {
    h.curves = e.map((t) => {
      var a;
      return { name: t.name, label: (a = t.label) != null ? a : t.name, entries: K(t.entries) };
    });
  }, "setCurves"),
  K = c((e) => {
    if (e[0].axis == null) return e.map((a) => a.value);
    const t = T();
    if (t.length === 0) throw new Error("Axes must be populated before curves for reference entries");
    return t.map((a) => {
      const r = e.find((n) => {
        var s;
        return ((s = n.axis) == null ? void 0 : s.$refText) === a.name;
      });
      if (r === void 0) throw new Error("Missing entry for axis " + a.label);
      return r.value;
    });
  }, "computeCurveEntries"),
  Z = c((e) => {
    var a, r, n, s, l, o, i, d, p, u;
    const t = e.reduce((g, x) => ((g[x.name] = x), g), {});
    ((h.options = {
      showLegend: (r = (a = t.showLegend) == null ? void 0 : a.value) != null ? r : m.showLegend,
      ticks: (s = (n = t.ticks) == null ? void 0 : n.value) != null ? s : m.ticks,
      max: (o = (l = t.max) == null ? void 0 : l.value) != null ? o : m.max,
      min: (d = (i = t.min) == null ? void 0 : i.value) != null ? d : m.min,
      graticule: (u = (p = t.graticule) == null ? void 0 : p.value) != null ? u : m.graticule,
    }),
      h.options.ticks > b &&
        (A.warn(`Radar diagram ticks (${h.options.ticks}) exceeds maximum allowed (${b}). Using ${b} instead.`),
        (h.options.ticks = b)));
  }, "setOptions"),
  Q = c(() => {
    (B(), (h = structuredClone(M)));
  }, "clear"),
  y = {
    getAxes: T,
    getCurves: X,
    getOptions: Y,
    setAxes: q,
    setCurves: J,
    setOptions: Z,
    getConfig: U,
    clear: Q,
    setAccTitle: P,
    getAccTitle: G,
    setDiagramTitle: F,
    getDiagramTitle: D,
    getAccDescription: R,
    setAccDescription: O,
  },
  tt = c((e) => {
    E(e, y);
    const { axes: t, curves: a, options: r } = e;
    (y.setAxes(t), y.setCurves(a), y.setOptions(r));
  }, "populate"),
  et = {
    parse: c(async (e) => {
      const t = await j("radar", e);
      (A.debug(t), tt(t));
    }, "parse"),
  },
  at = c((e, t, a, r) => {
    var v;
    const n = r.db,
      s = n.getAxes(),
      l = n.getCurves(),
      o = n.getOptions(),
      i = n.getConfig(),
      d = n.getDiagramTitle(),
      p = z(t),
      u = rt(p, i),
      g = (v = o.max) != null ? v : Math.max(...l.map(($) => Math.max(...$.entries))),
      x = o.min,
      f = Math.min(i.width, i.height) / 2;
    (nt(u, s, f, o.ticks, o.graticule),
      st(u, s, f, i),
      L(u, s, l, x, g, o.graticule, i),
      k(u, l, o.showLegend, i),
      u
        .append("text")
        .attr("class", "radarTitle")
        .text(d)
        .attr("x", 0)
        .attr("y", -i.height / 2 - i.marginTop));
  }, "draw"),
  rt = c((e, t) => {
    var s;
    const a = t.width + t.marginLeft + t.marginRight,
      r = t.height + t.marginTop + t.marginBottom,
      n = { x: t.marginLeft + t.width / 2, y: t.marginTop + t.height / 2 };
    return (
      H(e, r, a, (s = t.useMaxWidth) != null ? s : !0),
      e.attr("viewBox", `0 0 ${a} ${r}`).attr("overflow", "visible"),
      e.append("g").attr("transform", `translate(${n.x}, ${n.y})`)
    );
  }, "drawFrame"),
  nt = c((e, t, a, r, n) => {
    if (n === "circle")
      for (let s = 0; s < r; s++) {
        const l = (a * (s + 1)) / r;
        e.append("circle").attr("r", l).attr("class", "radarGraticule");
      }
    else if (n === "polygon") {
      const s = t.length;
      for (let l = 0; l < r; l++) {
        const o = (a * (l + 1)) / r,
          i = t
            .map((d, p) => {
              const u = (2 * p * Math.PI) / s - Math.PI / 2,
                g = o * Math.cos(u),
                x = o * Math.sin(u);
              return `${g},${x}`;
            })
            .join(" ");
        e.append("polygon").attr("points", i).attr("class", "radarGraticule");
      }
    }
  }, "drawGraticule"),
  st = c((e, t, a, r) => {
    const n = t.length;
    for (let s = 0; s < n; s++) {
      const l = t[s].label,
        o = (2 * s * Math.PI) / n - Math.PI / 2,
        i = Math.cos(o),
        d = Math.sin(o);
      e.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", a * r.axisScaleFactor * i)
        .attr("y2", a * r.axisScaleFactor * d)
        .attr("class", "radarAxisLine");
      const p = i > 0.01 ? "start" : i < -0.01 ? "end" : "middle",
        u = d > 0.01 ? "hanging" : d < -0.01 ? "auto" : "central",
        g = 4;
      e.append("text")
        .text(l)
        .attr("x", a * r.axisLabelFactor * i + g * i)
        .attr("y", a * r.axisLabelFactor * d + g * d)
        .attr("text-anchor", p)
        .attr("dominant-baseline", u)
        .attr("class", "radarAxisLabel");
    }
  }, "drawAxes");
function L(e, t, a, r, n, s, l) {
  const o = t.length,
    i = Math.min(l.width, l.height) / 2;
  a.forEach((d, p) => {
    if (d.entries.length !== o) return;
    const u = d.entries.map((g, x) => {
      const f = (2 * Math.PI * x) / o - Math.PI / 2,
        v = S(g, r, n, i),
        $ = v * Math.cos(f),
        _ = v * Math.sin(f);
      return { x: $, y: _ };
    });
    s === "circle"
      ? e.append("path").attr("d", I(u, l.curveTension)).attr("class", `radarCurve-${p}`)
      : s === "polygon" &&
        e
          .append("polygon")
          .attr("points", u.map((g) => `${g.x},${g.y}`).join(" "))
          .attr("class", `radarCurve-${p}`);
  });
}
c(L, "drawCurves");
function S(e, t, a, r) {
  const n = Math.min(Math.max(e, t), a);
  return (r * (n - t)) / (a - t);
}
c(S, "relativeRadius");
function I(e, t) {
  const a = e.length;
  let r = `M${e[0].x},${e[0].y}`;
  for (let n = 0; n < a; n++) {
    const s = e[(n - 1 + a) % a],
      l = e[n],
      o = e[(n + 1) % a],
      i = e[(n + 2) % a],
      d = { x: l.x + (o.x - s.x) * t, y: l.y + (o.y - s.y) * t },
      p = { x: o.x - (i.x - l.x) * t, y: o.y - (i.y - l.y) * t };
    r += ` C${d.x},${d.y} ${p.x},${p.y} ${o.x},${o.y}`;
  }
  return `${r} Z`;
}
c(I, "closedRoundCurve");
function k(e, t, a, r) {
  if (!a) return;
  const n = ((r.width / 2 + r.marginRight) * 3) / 4,
    s = (-(r.height / 2 + r.marginTop) * 3) / 4,
    l = 20;
  t.forEach((o, i) => {
    const d = e.append("g").attr("transform", `translate(${n}, ${s + i * l})`);
    (d.append("rect").attr("width", 12).attr("height", 12).attr("class", `radarLegendBox-${i}`),
      d.append("text").attr("x", 16).attr("y", 0).attr("class", "radarLegendText").text(o.label));
  });
}
c(k, "drawLegend");
var ot = { draw: at },
  it = c((e, t) => {
    let a = "";
    for (let r = 0; r < e.THEME_COLOR_LIMIT; r++) {
      const n = e[`cScale${r}`];
      a += `
		.radarCurve-${r} {
			color: ${n};
			fill: ${n};
			fill-opacity: ${t.curveOpacity};
			stroke: ${n};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${n};
			fill-opacity: ${t.curveOpacity};
			stroke: ${n};
		}
		`;
    }
    return a;
  }, "genIndexStyles"),
  lt = c((e) => {
    const t = V(),
      a = C(),
      r = w(t, a.themeVariables),
      n = w(r.radar, e);
    return { themeVariables: r, radarOptions: n };
  }, "buildRadarStyleOptions"),
  ct = c(({ radar: e } = {}) => {
    const { themeVariables: t, radarOptions: a } = lt(e);
    return `
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${it(t, a)}
	`;
  }, "styles"),
  gt = { parser: et, db: y, renderer: ot, styles: ct };
export { gt as diagram };
