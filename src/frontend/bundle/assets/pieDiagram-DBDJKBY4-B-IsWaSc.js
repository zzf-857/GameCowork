import { p as j } from "./chunk-ANTBXLJU-CTfKZ_Qj.js";
import {
  al as y,
  ag as M,
  b7 as Y,
  _ as u,
  v as Z,
  t as q,
  w as H,
  x as J,
  W as K,
  V as Q,
  B as _,
  y as X,
  a7 as ee,
  ab as te,
  av as ae,
  D as ne,
  a0 as re,
  a9 as ie,
} from "./VscTheme-B-CSeuv5.js";
import { p as se } from "./treemap-75Q7IDZK-B-05wwdi.js";
import { d as O } from "./arc-DCTIKd7a.js";
import { o as le } from "./ordinal-CMIbhwg4.js";
import "./registry-CHHSpXp3.js";
import "./_baseUniq-B4kfiVVD.js";
import "./_basePickBy-BL7sFKyx.js";
import "./clone-CIq-NCRc.js";
import "./init-BVqZKxlz.js";
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
      a = new e.Error().stack;
    a &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[a] = "e7e8b473-6049-44a9-a319-e30e558d15dd"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-e7e8b473-6049-44a9-a319-e30e558d15dd"));
  })();
} catch {}
function oe(e, a) {
  return a < e ? -1 : a > e ? 1 : a >= e ? 0 : NaN;
}
function ce(e) {
  return e;
}
function de() {
  var e = ce,
    a = oe,
    h = null,
    w = y(0),
    s = y(M),
    o = y(0);
  function l(t) {
    var r,
      c = (t = Y(t)).length,
      p,
      S,
      v = 0,
      d = new Array(c),
      i = new Array(c),
      g = +w.apply(this, arguments),
      x = Math.min(M, Math.max(-M, s.apply(this, arguments) - g)),
      m,
      T = Math.min(Math.abs(x) / c, o.apply(this, arguments)),
      C = T * (x < 0 ? -1 : 1),
      f;
    for (r = 0; r < c; ++r) (f = i[(d[r] = r)] = +e(t[r], r, t)) > 0 && (v += f);
    for (
      a != null
        ? d.sort(function (A, b) {
            return a(i[A], i[b]);
          })
        : h != null &&
          d.sort(function (A, b) {
            return h(t[A], t[b]);
          }),
        r = 0,
        S = v ? (x - c * C) / v : 0;
      r < c;
      ++r, g = m
    )
      ((p = d[r]),
        (f = i[p]),
        (m = g + (f > 0 ? f * S : 0) + C),
        (i[p] = { data: t[p], index: r, value: f, startAngle: g, endAngle: m, padAngle: T }));
    return i;
  }
  return (
    (l.value = function (t) {
      return arguments.length ? ((e = typeof t == "function" ? t : y(+t)), l) : e;
    }),
    (l.sortValues = function (t) {
      return arguments.length ? ((a = t), (h = null), l) : a;
    }),
    (l.sort = function (t) {
      return arguments.length ? ((h = t), (a = null), l) : h;
    }),
    (l.startAngle = function (t) {
      return arguments.length ? ((w = typeof t == "function" ? t : y(+t)), l) : w;
    }),
    (l.endAngle = function (t) {
      return arguments.length ? ((s = typeof t == "function" ? t : y(+t)), l) : s;
    }),
    (l.padAngle = function (t) {
      return arguments.length ? ((o = typeof t == "function" ? t : y(+t)), l) : o;
    }),
    l
  );
}
var ue = ie.pie,
  z = { sections: new Map(), showData: !1 },
  $ = z.sections,
  F = z.showData,
  pe = structuredClone(ue),
  fe = u(() => structuredClone(pe), "getConfig"),
  ge = u(() => {
    (($ = new Map()), (F = z.showData), re());
  }, "clear"),
  he = u(({ label: e, value: a }) => {
    if (a < 0)
      throw new Error(
        `"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`,
      );
    $.has(e) || ($.set(e, a), _.debug(`added new section: ${e}, with value: ${a}`));
  }, "addSection"),
  me = u(() => $, "getSections"),
  ve = u((e) => {
    F = e;
  }, "setShowData"),
  ye = u(() => F, "getShowData"),
  P = {
    getConfig: fe,
    clear: ge,
    setDiagramTitle: Q,
    getDiagramTitle: K,
    setAccTitle: J,
    getAccTitle: H,
    setAccDescription: q,
    getAccDescription: Z,
    addSection: he,
    getSections: me,
    setShowData: ve,
    getShowData: ye,
  },
  we = u((e, a) => {
    (j(e, a), a.setShowData(e.showData), e.sections.map(a.addSection));
  }, "populateDb"),
  Se = {
    parse: u(async (e) => {
      const a = await se("pie", e);
      (_.debug(a), we(a, P));
    }, "parse"),
  },
  xe = u(
    (e) => `
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,
    "getStyles",
  ),
  De = xe,
  Ae = u((e) => {
    const a = [...e.values()].reduce((s, o) => s + o, 0),
      h = [...e.entries()]
        .map(([s, o]) => ({ label: s, value: o }))
        .filter((s) => (s.value / a) * 100 >= 1)
        .sort((s, o) => o.value - s.value);
    return de().value((s) => s.value)(h);
  }, "createPieArcs"),
  be = u((e, a, h, w) => {
    _.debug(
      `rendering pie chart
` + e,
    );
    const s = w.db,
      o = X(),
      l = ee(s.getConfig(), o.pie),
      t = 40,
      r = 18,
      c = 4,
      p = 450,
      S = p,
      v = te(a),
      d = v.append("g");
    d.attr("transform", "translate(" + S / 2 + "," + p / 2 + ")");
    const { themeVariables: i } = o;
    let [g] = ae(i.pieOuterStrokeWidth);
    g != null || (g = 2);
    const x = l.textPosition,
      m = Math.min(S, p) / 2 - t,
      T = O().innerRadius(0).outerRadius(m),
      C = O()
        .innerRadius(m * x)
        .outerRadius(m * x);
    d.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", m + g / 2)
      .attr("class", "pieOuterCircle");
    const f = s.getSections(),
      A = Ae(f),
      b = [i.pie1, i.pie2, i.pie3, i.pie4, i.pie5, i.pie6, i.pie7, i.pie8, i.pie9, i.pie10, i.pie11, i.pie12];
    let E = 0;
    f.forEach((n) => {
      E += n;
    });
    const N = A.filter((n) => ((n.data.value / E) * 100).toFixed(0) !== "0"),
      k = le(b);
    (d
      .selectAll("mySlices")
      .data(N)
      .enter()
      .append("path")
      .attr("d", T)
      .attr("fill", (n) => k(n.data.label))
      .attr("class", "pieCircle"),
      d
        .selectAll("mySlices")
        .data(N)
        .enter()
        .append("text")
        .text((n) => ((n.data.value / E) * 100).toFixed(0) + "%")
        .attr("transform", (n) => "translate(" + C.centroid(n) + ")")
        .style("text-anchor", "middle")
        .attr("class", "slice"),
      d
        .append("text")
        .text(s.getDiagramTitle())
        .attr("x", 0)
        .attr("y", -400 / 2)
        .attr("class", "pieTitleText"));
    const R = [...f.entries()].map(([n, D]) => ({ label: n, value: D })),
      I = d
        .selectAll(".legend")
        .data(R)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (n, D) => {
          const L = r + c,
            B = (L * R.length) / 2,
            V = 12 * r,
            U = D * L - B;
          return "translate(" + V + "," + U + ")";
        });
    (I.append("rect")
      .attr("width", r)
      .attr("height", r)
      .style("fill", (n) => k(n.label))
      .style("stroke", (n) => k(n.label)),
      I.append("text")
        .attr("x", r + c)
        .attr("y", r - c)
        .text((n) => (s.getShowData() ? `${n.label} [${n.value}]` : n.label)));
    const W = Math.max(
        ...I.selectAll("text")
          .nodes()
          .map((n) => {
            var D;
            return (D = n == null ? void 0 : n.getBoundingClientRect().width) != null ? D : 0;
          }),
      ),
      G = S + t + r + c + W;
    (v.attr("viewBox", `0 0 ${G} ${p}`), ne(v, p, G, l.useMaxWidth));
  }, "draw"),
  Te = { draw: be },
  Re = { parser: Se, db: P, renderer: Te, styles: De };
export { Re as diagram };
