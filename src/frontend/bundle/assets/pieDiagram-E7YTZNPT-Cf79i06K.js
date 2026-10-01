import { p as rt } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  ad as $,
  a8 as P,
  be as it,
  _ as g,
  g as ot,
  s as st,
  a as lt,
  b as ct,
  q as dt,
  p as ut,
  l as W,
  d as gt,
  F as ft,
  I as pt,
  Q as ht,
  e as mt,
  t as vt,
  G as yt,
} from "./registry-CHHSpXp3.js";
import { p as wt } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
import { d as Z } from "./arc-DVkJVnDn.js";
import { o as xt } from "./ordinal-D17R3C1y.js";
import "./init-Dti9YEyp.js";
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
      n = new t.Error().stack;
    n &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[n] = "e43e5738-a580-4040-9415-a836d014db5c"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-e43e5738-a580-4040-9415-a836d014db5c"));
  })();
} catch {}
function St(t, n) {
  return n < t ? -1 : n > t ? 1 : n >= t ? 0 : NaN;
}
function bt(t) {
  return t;
}
function At() {
  var t = bt,
    n = St,
    S = null,
    T = $(0),
    c = $(P),
    f = $(0);
  function i(e) {
    var r,
      l = (e = it(e)).length,
      p,
      b,
      C = 0,
      h = new Array(l),
      o = new Array(l),
      m = +T.apply(this, arguments),
      _ = Math.min(P, Math.max(-P, c.apply(this, arguments) - m)),
      E,
      R = Math.min(Math.abs(_) / l, f.apply(this, arguments)),
      d = R * (_ < 0 ? -1 : 1),
      A;
    for (r = 0; r < l; ++r) (A = o[(h[r] = r)] = +t(e[r], r, e)) > 0 && (C += A);
    for (
      n != null
        ? h.sort(function (z, v) {
            return n(o[z], o[v]);
          })
        : S != null &&
          h.sort(function (z, v) {
            return S(e[z], e[v]);
          }),
        r = 0,
        b = C ? (_ - l * d) / C : 0;
      r < l;
      ++r, m = E
    )
      ((p = h[r]),
        (A = o[p]),
        (E = m + (A > 0 ? A * b : 0) + d),
        (o[p] = { data: e[p], index: r, value: A, startAngle: m, endAngle: E, padAngle: R }));
    return o;
  }
  return (
    (i.value = function (e) {
      return arguments.length ? ((t = typeof e == "function" ? e : $(+e)), i) : t;
    }),
    (i.sortValues = function (e) {
      return arguments.length ? ((n = e), (S = null), i) : n;
    }),
    (i.sort = function (e) {
      return arguments.length ? ((S = e), (n = null), i) : S;
    }),
    (i.startAngle = function (e) {
      return arguments.length ? ((T = typeof e == "function" ? e : $(+e)), i) : T;
    }),
    (i.endAngle = function (e) {
      return arguments.length ? ((c = typeof e == "function" ? e : $(+e)), i) : c;
    }),
    (i.padAngle = function (e) {
      return arguments.length ? ((f = typeof e == "function" ? e : $(+e)), i) : f;
    }),
    i
  );
}
var Dt = yt.pie,
  B = { sections: new Map(), showData: !1 },
  F = B.sections,
  V = B.showData,
  Ct = structuredClone(Dt),
  $t = g(() => structuredClone(Ct), "getConfig"),
  Tt = g(() => {
    ((F = new Map()), (V = B.showData), vt());
  }, "clear"),
  Et = g(({ label: t, value: n }) => {
    if (n < 0)
      throw new Error(
        `"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`,
      );
    F.has(t) || (F.set(t, n), W.debug(`added new section: ${t}, with value: ${n}`));
  }, "addSection"),
  kt = g(() => F, "getSections"),
  _t = g((t) => {
    V = t;
  }, "setShowData"),
  zt = g(() => V, "getShowData"),
  J = {
    getConfig: $t,
    clear: Tt,
    setDiagramTitle: ut,
    getDiagramTitle: dt,
    setAccTitle: ct,
    getAccTitle: lt,
    setAccDescription: st,
    getAccDescription: ot,
    addSection: Et,
    getSections: kt,
    setShowData: _t,
    getShowData: zt,
  },
  Mt = g((t, n) => {
    (rt(t, n), n.setShowData(t.showData), t.sections.map(n.addSection));
  }, "populateDb"),
  Rt = {
    parse: g(async (t) => {
      const n = await wt("pie", t);
      (W.debug(n), Mt(n, J));
    }, "parse"),
  },
  It = g(
    (t) => `
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
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
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,
    "getStyles",
  ),
  Lt = It,
  Ft = g((t) => {
    const n = [...t.values()].reduce((c, f) => c + f, 0),
      S = [...t.entries()].map(([c, f]) => ({ label: c, value: f })).filter((c) => (c.value / n) * 100 >= 1);
    return At()
      .value((c) => c.value)
      .sort(null)(S);
  }, "createPieArcs"),
  Nt = g((t, n, S, T) => {
    var X, Y;
    W.debug(
      `rendering pie chart
` + t,
    );
    const c = T.db,
      f = gt(),
      i = ft(c.getConfig(), f.pie),
      e = 40,
      r = 18,
      l = 4,
      p = 450,
      b = p,
      C = pt(n),
      h = C.append("g");
    h.attr("transform", "translate(" + b / 2 + "," + p / 2 + ")");
    const { themeVariables: o } = f;
    let [m] = ht(o.pieOuterStrokeWidth);
    m != null || (m = 2);
    const _ = i.legendPosition,
      E = i.textPosition,
      R = i.donutHole > 0 && i.donutHole <= 0.9 ? i.donutHole : 0,
      d = Math.min(b, p) / 2 - e,
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
      K = Ft(I),
      tt = [o.pie1, o.pie2, o.pie3, o.pie4, o.pie5, o.pie6, o.pie7, o.pie8, o.pie9, o.pie10, o.pie11, o.pie12];
    let N = 0;
    I.forEach((a) => {
      N += a;
    });
    const U = K.filter((a) => ((a.data.value / N) * 100).toFixed(0) !== "0"),
      G = xt(tt).domain([...I.keys()]);
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
    const et = h
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
      H = b + e;
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
    const j = (Y = (X = et.node()) == null ? void 0 : X.getBoundingClientRect().width) != null ? Y : 0,
      at = b / 2 - j / 2,
      nt = b / 2 + j / 2,
      q = Math.min(0, at),
      Q = Math.max(H, nt) - q;
    (C.attr("viewBox", `${q} 0 ${Q} ${L}`), mt(C, L, Q, i.useMaxWidth));
  }, "draw"),
  Gt = { draw: Nt },
  jt = { parser: Rt, db: J, renderer: Gt, styles: Lt };
export { jt as diagram };
