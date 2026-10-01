import { p as re } from "./chunk-JWPE2WC7-mi7oxMEc.js";
import {
  ad as $,
  a8 as P,
  be as ie,
  _ as g,
  g as oe,
  s as se,
  a as le,
  b as ce,
  q as de,
  p as ue,
  l as W,
  d as ge,
  F as fe,
  I as pe,
  Q as he,
  e as me,
  t as ve,
  G as ye,
} from "./registry-BL-NPVNy.js";
import { p as we } from "./cynefin-OW5HDTMX-Cm6ltTqe.js";
import { d as Z } from "./arc-DXqqVeYx.js";
import { o as xe } from "./ordinal-DcU6rL3G.js";
import "./init-BaHtlhPg.js";
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
  e.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
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
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "e43e5738-a580-4040-9415-a836d014db5c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-e43e5738-a580-4040-9415-a836d014db5c"));
  })();
} catch {}
function be(e, n) {
  return n < e ? -1 : n > e ? 1 : n >= e ? 0 : NaN;
}
function Se(e) {
  return e;
}
function Ae() {
  var e = Se,
    n = be,
    b = null,
    T = $(0),
    c = $(P),
    f = $(0);
  function i(t) {
    var r,
      l = (t = ie(t)).length,
      p,
      S,
      C = 0,
      h = new Array(l),
      o = new Array(l),
      m = +T.apply(this, arguments),
      _ = Math.min(P, Math.max(-P, c.apply(this, arguments) - m)),
      E,
      R = Math.min(Math.abs(_) / l, f.apply(this, arguments)),
      d = R * (_ < 0 ? -1 : 1),
      A;
    for (r = 0; r < l; ++r) (A = o[(h[r] = r)] = +e(t[r], r, t)) > 0 && (C += A);
    for (
      n != null
        ? h.sort(function (z, v) {
            return n(o[z], o[v]);
          })
        : b != null &&
          h.sort(function (z, v) {
            return b(t[z], t[v]);
          }),
        r = 0,
        S = C ? (_ - l * d) / C : 0;
      r < l;
      ++r, m = E
    )
      ((p = h[r]),
        (A = o[p]),
        (E = m + (A > 0 ? A * S : 0) + d),
        (o[p] = { data: t[p], index: r, value: A, startAngle: m, endAngle: E, padAngle: R }));
    return o;
  }
  return (
    (i.value = function (t) {
      return arguments.length ? ((e = typeof t == "function" ? t : $(+t)), i) : e;
    }),
    (i.sortValues = function (t) {
      return arguments.length ? ((n = t), (b = null), i) : n;
    }),
    (i.sort = function (t) {
      return arguments.length ? ((b = t), (n = null), i) : b;
    }),
    (i.startAngle = function (t) {
      return arguments.length ? ((T = typeof t == "function" ? t : $(+t)), i) : T;
    }),
    (i.endAngle = function (t) {
      return arguments.length ? ((c = typeof t == "function" ? t : $(+t)), i) : c;
    }),
    (i.padAngle = function (t) {
      return arguments.length ? ((f = typeof t == "function" ? t : $(+t)), i) : f;
    }),
    i
  );
}
var De = ye.pie,
  B = { sections: new Map(), showData: !1 },
  F = B.sections,
  V = B.showData,
  Ce = structuredClone(De),
  $e = g(() => structuredClone(Ce), "getConfig"),
  Te = g(() => {
    ((F = new Map()), (V = B.showData), ve());
  }, "clear"),
  Ee = g(({ label: e, value: n }) => {
    if (n < 0)
      throw new Error(
        `"${e}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`,
      );
    F.has(e) || (F.set(e, n), W.debug(`added new section: ${e}, with value: ${n}`));
  }, "addSection"),
  ke = g(() => F, "getSections"),
  _e = g((e) => {
    V = e;
  }, "setShowData"),
  ze = g(() => V, "getShowData"),
  J = {
    getConfig: $e,
    clear: Te,
    setDiagramTitle: ue,
    getDiagramTitle: de,
    setAccTitle: ce,
    getAccTitle: le,
    setAccDescription: se,
    getAccDescription: oe,
    addSection: Ee,
    getSections: ke,
    setShowData: _e,
    getShowData: ze,
  },
  Me = g((e, n) => {
    (re(e, n), n.setShowData(e.showData), e.sections.map(n.addSection));
  }, "populateDb"),
  Re = {
    parse: g(async (e) => {
      const n = await we("pie", e);
      (W.debug(n), Me(n, J));
    }, "parse"),
  },
  Ie = g(
    (e) => `
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
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
  Le = Ie,
  Fe = g((e) => {
    const n = [...e.values()].reduce((c, f) => c + f, 0),
      b = [...e.entries()].map(([c, f]) => ({ label: c, value: f })).filter((c) => (c.value / n) * 100 >= 1);
    return Ae()
      .value((c) => c.value)
      .sort(null)(b);
  }, "createPieArcs"),
  Ne = g((e, n, b, T) => {
    var X, Y;
    W.debug(
      `rendering pie chart
` + e,
    );
    const c = T.db,
      f = ge(),
      i = fe(c.getConfig(), f.pie),
      t = 40,
      r = 18,
      l = 4,
      p = 450,
      S = p,
      C = pe(n),
      h = C.append("g");
    h.attr("transform", "translate(" + S / 2 + "," + p / 2 + ")");
    const { themeVariables: o } = f;
    let [m] = he(o.pieOuterStrokeWidth);
    m != null || (m = 2);
    const _ = i.legendPosition,
      E = i.textPosition,
      R = i.donutHole > 0 && i.donutHole <= 0.9 ? i.donutHole : 0,
      d = Math.min(S, p) / 2 - t,
      A = Z()
        .innerRadius(R * d)
        .outerRadius(d),
      z = Z()
        .innerRadius(d * E)
        .outerRadius(d * E),
      v = h.append("g");
    v.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", d + m / 2)
      .attr("class", "pieOuterCircle");
    const I = c.getSections(),
      K = Fe(I),
      ee = [o.pie1, o.pie2, o.pie3, o.pie4, o.pie5, o.pie6, o.pie7, o.pie8, o.pie9, o.pie10, o.pie11, o.pie12];
    let N = 0;
    I.forEach((a) => {
      N += a;
    });
    const U = K.filter((a) => ((a.data.value / N) * 100).toFixed(0) !== "0"),
      G = xe(ee).domain([...I.keys()]);
    (v
      .selectAll("mySlices")
      .data(U)
      .enter()
      .append("path")
      .attr("d", A)
      .attr("fill", (a) => G(a.data.label))
      .attr("class", (a) => {
        let s = "pieCircle";
        return (
          i.highlightSlice === "hover"
            ? (s += " highlightedOnHover")
            : i.highlightSlice === a.data.label && (s += " highlighted"),
          s
        );
      }),
      v
        .selectAll("mySlices")
        .data(U)
        .enter()
        .append("text")
        .text((a) => ((a.data.value / N) * 100).toFixed(0) + "%")
        .attr("transform", (a) => "translate(" + z.centroid(a) + ")")
        .style("text-anchor", "middle")
        .attr("class", "slice"));
    const te = h
        .append("text")
        .text(c.getDiagramTitle())
        .attr("x", 0)
        .attr("y", -400 / 2)
        .attr("class", "pieTitleText"),
      M = [...I.entries()].map(([a, s]) => ({ label: a, value: s })),
      D = h.selectAll(".legend").data(M).enter().append("g").attr("class", "legend");
    (D.append("rect")
      .attr("width", r)
      .attr("height", r)
      .style("fill", (a) => G(a.label))
      .style("stroke", (a) => G(a.label)),
      D.append("text")
        .attr("x", r + l)
        .attr("y", r - l)
        .text((a) => (c.getShowData() ? `${a.label} [${a.value}]` : a.label)));
    const k = Math.max(
      ...D.selectAll("text")
        .nodes()
        .map((a) => {
          var s;
          return (s = a == null ? void 0 : a.getBoundingClientRect().width) != null ? s : 0;
        }),
    );
    let L = p,
      H = S + t;
    const u = r + l,
      O = M.length * u;
    switch (_) {
      case "center":
        D.attr("transform", (a, s) => {
          const y = (u * M.length) / 2,
            w = -k / 2 - (r + l),
            x = s * u - y;
          return "translate(" + w + "," + x + ")";
        });
        break;
      case "top":
        ((L += O),
          D.attr("transform", (a, s) => {
            const y = d,
              w = -k / 2 - (r + l),
              x = s * u - y;
            return `translate(${w}, ${x})`;
          }),
          v.attr("transform", () => `translate(0, ${O + u})`));
        break;
      case "bottom":
        ((L += O),
          D.attr("transform", (a, s) => {
            const y = -d - u,
              w = -k / 2 - (r + l),
              x = s * u - y;
            return "translate(" + w + "," + x + ")";
          }));
        break;
      case "left":
        ((H += r + l + k),
          D.attr("transform", (a, s) => {
            const y = (u * M.length) / 2,
              w = -d - (r + l),
              x = s * u - y;
            return "translate(" + w + "," + x + ")";
          }),
          v.attr("transform", () => `translate(${k + r + l}, 0)`));
        break;
      case "right":
      default:
        ((H += r + l + k),
          D.attr("transform", (a, s) => {
            const y = (u * M.length) / 2,
              w = 12 * r,
              x = s * u - y;
            return "translate(" + w + "," + x + ")";
          }));
        break;
    }
    const j = (Y = (X = te.node()) == null ? void 0 : X.getBoundingClientRect().width) != null ? Y : 0,
      ae = S / 2 - j / 2,
      ne = S / 2 + j / 2,
      q = Math.min(0, ae),
      Q = Math.max(H, ne) - q;
    (C.attr("viewBox", `${q} 0 ${Q} ${L}`), me(C, L, Q, i.useMaxWidth));
  }, "draw"),
  Ge = { draw: Ne },
  je = { parser: Re, db: J, renderer: Ge, styles: Le };
export { je as diagram };
