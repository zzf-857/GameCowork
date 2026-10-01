import { p as _ } from "./chunk-ANTBXLJU-DpvJzaT6.js";
import {
  _ as l,
  t as E,
  v as O,
  W as R,
  V as k,
  w as D,
  x as F,
  ab as G,
  a0 as P,
  a7 as $,
  a8 as w,
  a9 as z,
  B as V,
  as as W,
} from "./VscTheme-BExNMG_K.js";
import { p as B } from "./treemap-75Q7IDZK-Bp3sVUNO.js";
import "./registry-BL-NPVNy.js";
import "./_baseUniq-C9v6YMLn.js";
import "./_basePickBy-Cjj3jB3s.js";
import "./clone-DJH302tV.js";
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
      e = new t.Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "09600a40-fa11-4b5c-9998-3ad7564fe0e9"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-09600a40-fa11-4b5c-9998-3ad7564fe0e9"));
  })();
} catch {}
var x = { showLegend: !0, ticks: 5, max: null, min: 0, graticule: "circle" },
  C = { axes: [], curves: [], options: x },
  m = structuredClone(C),
  H = z.radar,
  j = l(() => $({ ...H, ...w().radar }), "getConfig"),
  M = l(() => m.axes, "getAxes"),
  N = l(() => m.curves, "getCurves"),
  Y = l(() => m.options, "getOptions"),
  U = l((t) => {
    m.axes = t.map((e) => {
      var a;
      return { name: e.name, label: (a = e.label) != null ? a : e.name };
    });
  }, "setAxes"),
  X = l((t) => {
    m.curves = t.map((e) => {
      var a;
      return { name: e.name, label: (a = e.label) != null ? a : e.name, entries: Z(e.entries) };
    });
  }, "setCurves"),
  Z = l((t) => {
    if (t[0].axis == null) return t.map((a) => a.value);
    const e = M();
    if (e.length === 0) throw new Error("Axes must be populated before curves for reference entries");
    return e.map((a) => {
      const r = t.find((n) => {
        var o;
        return ((o = n.axis) == null ? void 0 : o.$refText) === a.name;
      });
      if (r === void 0) throw new Error("Missing entry for axis " + a.label);
      return r.value;
    });
  }, "computeCurveEntries"),
  q = l((t) => {
    var a, r, n, o, i, s, c, d, p, u;
    const e = t.reduce((g, h) => ((g[h.name] = h), g), {});
    m.options = {
      showLegend: (r = (a = e.showLegend) == null ? void 0 : a.value) != null ? r : x.showLegend,
      ticks: (o = (n = e.ticks) == null ? void 0 : n.value) != null ? o : x.ticks,
      max: (s = (i = e.max) == null ? void 0 : i.value) != null ? s : x.max,
      min: (d = (c = e.min) == null ? void 0 : c.value) != null ? d : x.min,
      graticule: (u = (p = e.graticule) == null ? void 0 : p.value) != null ? u : x.graticule,
    };
  }, "setOptions"),
  J = l(() => {
    (P(), (m = structuredClone(C)));
  }, "clear"),
  y = {
    getAxes: M,
    getCurves: N,
    getOptions: Y,
    setAxes: U,
    setCurves: X,
    setOptions: q,
    getConfig: j,
    clear: J,
    setAccTitle: F,
    getAccTitle: D,
    setDiagramTitle: k,
    getDiagramTitle: R,
    getAccDescription: O,
    setAccDescription: E,
  },
  K = l((t) => {
    _(t, y);
    const { axes: e, curves: a, options: r } = t;
    (y.setAxes(e), y.setCurves(a), y.setOptions(r));
  }, "populate"),
  Q = {
    parse: l(async (t) => {
      const e = await B("radar", t);
      (V.debug(e), K(e));
    }, "parse"),
  },
  ee = l((t, e, a, r) => {
    var v;
    const n = r.db,
      o = n.getAxes(),
      i = n.getCurves(),
      s = n.getOptions(),
      c = n.getConfig(),
      d = n.getDiagramTitle(),
      p = G(e),
      u = te(p, c),
      g = (v = s.max) != null ? v : Math.max(...i.map((b) => Math.max(...b.entries))),
      h = s.min,
      f = Math.min(c.width, c.height) / 2;
    (ae(u, o, f, s.ticks, s.graticule),
      re(u, o, f, c),
      A(u, o, i, h, g, s.graticule, c),
      I(u, i, s.showLegend, c),
      u
        .append("text")
        .attr("class", "radarTitle")
        .text(d)
        .attr("x", 0)
        .attr("y", -c.height / 2 - c.marginTop));
  }, "draw"),
  te = l((t, e) => {
    const a = e.width + e.marginLeft + e.marginRight,
      r = e.height + e.marginTop + e.marginBottom,
      n = { x: e.marginLeft + e.width / 2, y: e.marginTop + e.height / 2 };
    return (
      t.attr("viewbox", `0 0 ${a} ${r}`).attr("width", a).attr("height", r),
      t.append("g").attr("transform", `translate(${n.x}, ${n.y})`)
    );
  }, "drawFrame"),
  ae = l((t, e, a, r, n) => {
    if (n === "circle")
      for (let o = 0; o < r; o++) {
        const i = (a * (o + 1)) / r;
        t.append("circle").attr("r", i).attr("class", "radarGraticule");
      }
    else if (n === "polygon") {
      const o = e.length;
      for (let i = 0; i < r; i++) {
        const s = (a * (i + 1)) / r,
          c = e
            .map((d, p) => {
              const u = (2 * p * Math.PI) / o - Math.PI / 2,
                g = s * Math.cos(u),
                h = s * Math.sin(u);
              return `${g},${h}`;
            })
            .join(" ");
        t.append("polygon").attr("points", c).attr("class", "radarGraticule");
      }
    }
  }, "drawGraticule"),
  re = l((t, e, a, r) => {
    const n = e.length;
    for (let o = 0; o < n; o++) {
      const i = e[o].label,
        s = (2 * o * Math.PI) / n - Math.PI / 2;
      (t
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", a * r.axisScaleFactor * Math.cos(s))
        .attr("y2", a * r.axisScaleFactor * Math.sin(s))
        .attr("class", "radarAxisLine"),
        t
          .append("text")
          .text(i)
          .attr("x", a * r.axisLabelFactor * Math.cos(s))
          .attr("y", a * r.axisLabelFactor * Math.sin(s))
          .attr("class", "radarAxisLabel"));
    }
  }, "drawAxes");
function A(t, e, a, r, n, o, i) {
  const s = e.length,
    c = Math.min(i.width, i.height) / 2;
  a.forEach((d, p) => {
    if (d.entries.length !== s) return;
    const u = d.entries.map((g, h) => {
      const f = (2 * Math.PI * h) / s - Math.PI / 2,
        v = T(g, r, n, c),
        b = v * Math.cos(f),
        S = v * Math.sin(f);
      return { x: b, y: S };
    });
    o === "circle"
      ? t.append("path").attr("d", L(u, i.curveTension)).attr("class", `radarCurve-${p}`)
      : o === "polygon" &&
        t
          .append("polygon")
          .attr("points", u.map((g) => `${g.x},${g.y}`).join(" "))
          .attr("class", `radarCurve-${p}`);
  });
}
l(A, "drawCurves");
function T(t, e, a, r) {
  const n = Math.min(Math.max(t, e), a);
  return (r * (n - e)) / (a - e);
}
l(T, "relativeRadius");
function L(t, e) {
  const a = t.length;
  let r = `M${t[0].x},${t[0].y}`;
  for (let n = 0; n < a; n++) {
    const o = t[(n - 1 + a) % a],
      i = t[n],
      s = t[(n + 1) % a],
      c = t[(n + 2) % a],
      d = { x: i.x + (s.x - o.x) * e, y: i.y + (s.y - o.y) * e },
      p = { x: s.x - (c.x - i.x) * e, y: s.y - (c.y - i.y) * e };
    r += ` C${d.x},${d.y} ${p.x},${p.y} ${s.x},${s.y}`;
  }
  return `${r} Z`;
}
l(L, "closedRoundCurve");
function I(t, e, a, r) {
  if (!a) return;
  const n = ((r.width / 2 + r.marginRight) * 3) / 4,
    o = (-(r.height / 2 + r.marginTop) * 3) / 4,
    i = 20;
  e.forEach((s, c) => {
    const d = t.append("g").attr("transform", `translate(${n}, ${o + c * i})`);
    (d.append("rect").attr("width", 12).attr("height", 12).attr("class", `radarLegendBox-${c}`),
      d.append("text").attr("x", 16).attr("y", 0).attr("class", "radarLegendText").text(s.label));
  });
}
l(I, "drawLegend");
var ne = { draw: ee },
  se = l((t, e) => {
    let a = "";
    for (let r = 0; r < t.THEME_COLOR_LIMIT; r++) {
      const n = t[`cScale${r}`];
      a += `
		.radarCurve-${r} {
			color: ${n};
			fill: ${n};
			fill-opacity: ${e.curveOpacity};
			stroke: ${n};
			stroke-width: ${e.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${n};
			fill-opacity: ${e.curveOpacity};
			stroke: ${n};
		}
		`;
    }
    return a;
  }, "genIndexStyles"),
  oe = l((t) => {
    const e = W(),
      a = w(),
      r = $(e, a.themeVariables),
      n = $(r.radar, t);
    return { themeVariables: r, radarOptions: n };
  }, "buildRadarStyleOptions"),
  ie = l(({ radar: t } = {}) => {
    const { themeVariables: e, radarOptions: a } = oe(t);
    return `
	.radarTitle {
		font-size: ${e.fontSize};
		color: ${e.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
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
	${se(e, a)}
	`;
  }, "styles"),
  me = { parser: Q, db: y, renderer: ne, styles: ie };
export { me as diagram };
