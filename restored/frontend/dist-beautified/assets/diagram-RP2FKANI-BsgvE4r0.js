import { p as _ } from "./chunk-ANTBXLJU-CTfKZ_Qj.js";
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
} from "./VscTheme-B-CSeuv5.js";
import { p as B } from "./treemap-75Q7IDZK-B-05wwdi.js";
import "./registry-CHHSpXp3.js";
import "./_baseUniq-B4kfiVVD.js";
import "./_basePickBy-BL7sFKyx.js";
import "./clone-CIq-NCRc.js";
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
      (e._sentryDebugIds[t] = "09600a40-fa11-4b5c-9998-3ad7564fe0e9"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-09600a40-fa11-4b5c-9998-3ad7564fe0e9"));
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
  U = l((e) => {
    m.axes = e.map((t) => {
      var a;
      return { name: t.name, label: (a = t.label) != null ? a : t.name };
    });
  }, "setAxes"),
  X = l((e) => {
    m.curves = e.map((t) => {
      var a;
      return { name: t.name, label: (a = t.label) != null ? a : t.name, entries: Z(t.entries) };
    });
  }, "setCurves"),
  Z = l((e) => {
    if (e[0].axis == null) return e.map((a) => a.value);
    const t = M();
    if (t.length === 0) throw new Error("Axes must be populated before curves for reference entries");
    return t.map((a) => {
      const r = e.find((n) => {
        var o;
        return ((o = n.axis) == null ? void 0 : o.$refText) === a.name;
      });
      if (r === void 0) throw new Error("Missing entry for axis " + a.label);
      return r.value;
    });
  }, "computeCurveEntries"),
  q = l((e) => {
    var a, r, n, o, i, s, c, d, p, u;
    const t = e.reduce((g, h) => ((g[h.name] = h), g), {});
    m.options = {
      showLegend: (r = (a = t.showLegend) == null ? void 0 : a.value) != null ? r : x.showLegend,
      ticks: (o = (n = t.ticks) == null ? void 0 : n.value) != null ? o : x.ticks,
      max: (s = (i = t.max) == null ? void 0 : i.value) != null ? s : x.max,
      min: (d = (c = t.min) == null ? void 0 : c.value) != null ? d : x.min,
      graticule: (u = (p = t.graticule) == null ? void 0 : p.value) != null ? u : x.graticule,
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
  K = l((e) => {
    _(e, y);
    const { axes: t, curves: a, options: r } = e;
    (y.setAxes(t), y.setCurves(a), y.setOptions(r));
  }, "populate"),
  Q = {
    parse: l(async (e) => {
      const t = await B("radar", e);
      (V.debug(t), K(t));
    }, "parse"),
  },
  tt = l((e, t, a, r) => {
    var v;
    const n = r.db,
      o = n.getAxes(),
      i = n.getCurves(),
      s = n.getOptions(),
      c = n.getConfig(),
      d = n.getDiagramTitle(),
      p = G(t),
      u = et(p, c),
      g = (v = s.max) != null ? v : Math.max(...i.map((b) => Math.max(...b.entries))),
      h = s.min,
      f = Math.min(c.width, c.height) / 2;
    (at(u, o, f, s.ticks, s.graticule),
      rt(u, o, f, c),
      A(u, o, i, h, g, s.graticule, c),
      I(u, i, s.showLegend, c),
      u
        .append("text")
        .attr("class", "radarTitle")
        .text(d)
        .attr("x", 0)
        .attr("y", -c.height / 2 - c.marginTop));
  }, "draw"),
  et = l((e, t) => {
    const a = t.width + t.marginLeft + t.marginRight,
      r = t.height + t.marginTop + t.marginBottom,
      n = { x: t.marginLeft + t.width / 2, y: t.marginTop + t.height / 2 };
    return (
      e.attr("viewbox", `0 0 ${a} ${r}`).attr("width", a).attr("height", r),
      e.append("g").attr("transform", `translate(${n.x}, ${n.y})`)
    );
  }, "drawFrame"),
  at = l((e, t, a, r, n) => {
    if (n === "circle")
      for (let o = 0; o < r; o++) {
        const i = (a * (o + 1)) / r;
        e.append("circle").attr("r", i).attr("class", "radarGraticule");
      }
    else if (n === "polygon") {
      const o = t.length;
      for (let i = 0; i < r; i++) {
        const s = (a * (i + 1)) / r,
          c = t
            .map((d, p) => {
              const u = (2 * p * Math.PI) / o - Math.PI / 2,
                g = s * Math.cos(u),
                h = s * Math.sin(u);
              return `${g},${h}`;
            })
            .join(" ");
        e.append("polygon").attr("points", c).attr("class", "radarGraticule");
      }
    }
  }, "drawGraticule"),
  rt = l((e, t, a, r) => {
    const n = t.length;
    for (let o = 0; o < n; o++) {
      const i = t[o].label,
        s = (2 * o * Math.PI) / n - Math.PI / 2;
      (e
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", a * r.axisScaleFactor * Math.cos(s))
        .attr("y2", a * r.axisScaleFactor * Math.sin(s))
        .attr("class", "radarAxisLine"),
        e
          .append("text")
          .text(i)
          .attr("x", a * r.axisLabelFactor * Math.cos(s))
          .attr("y", a * r.axisLabelFactor * Math.sin(s))
          .attr("class", "radarAxisLabel"));
    }
  }, "drawAxes");
function A(e, t, a, r, n, o, i) {
  const s = t.length,
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
      ? e.append("path").attr("d", L(u, i.curveTension)).attr("class", `radarCurve-${p}`)
      : o === "polygon" &&
        e
          .append("polygon")
          .attr("points", u.map((g) => `${g.x},${g.y}`).join(" "))
          .attr("class", `radarCurve-${p}`);
  });
}
l(A, "drawCurves");
function T(e, t, a, r) {
  const n = Math.min(Math.max(e, t), a);
  return (r * (n - t)) / (a - t);
}
l(T, "relativeRadius");
function L(e, t) {
  const a = e.length;
  let r = `M${e[0].x},${e[0].y}`;
  for (let n = 0; n < a; n++) {
    const o = e[(n - 1 + a) % a],
      i = e[n],
      s = e[(n + 1) % a],
      c = e[(n + 2) % a],
      d = { x: i.x + (s.x - o.x) * t, y: i.y + (s.y - o.y) * t },
      p = { x: s.x - (c.x - i.x) * t, y: s.y - (c.y - i.y) * t };
    r += ` C${d.x},${d.y} ${p.x},${p.y} ${s.x},${s.y}`;
  }
  return `${r} Z`;
}
l(L, "closedRoundCurve");
function I(e, t, a, r) {
  if (!a) return;
  const n = ((r.width / 2 + r.marginRight) * 3) / 4,
    o = (-(r.height / 2 + r.marginTop) * 3) / 4,
    i = 20;
  t.forEach((s, c) => {
    const d = e.append("g").attr("transform", `translate(${n}, ${o + c * i})`);
    (d.append("rect").attr("width", 12).attr("height", 12).attr("class", `radarLegendBox-${c}`),
      d.append("text").attr("x", 16).attr("y", 0).attr("class", "radarLegendText").text(s.label));
  });
}
l(I, "drawLegend");
var nt = { draw: tt },
  st = l((e, t) => {
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
  ot = l((e) => {
    const t = W(),
      a = w(),
      r = $(t, a.themeVariables),
      n = $(r.radar, e);
    return { themeVariables: r, radarOptions: n };
  }, "buildRadarStyleOptions"),
  it = l(({ radar: e } = {}) => {
    const { themeVariables: t, radarOptions: a } = ot(e);
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
	${st(t, a)}
	`;
  }, "styles"),
  mt = { parser: Q, db: y, renderer: nt, styles: it };
export { mt as diagram };
