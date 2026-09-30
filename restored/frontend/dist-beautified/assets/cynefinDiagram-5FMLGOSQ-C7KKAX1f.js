import { p as gt } from "./chunk-JWPE2WC7-T25dSmDk.js";
import {
  _ as s,
  s as $t,
  g as bt,
  o as wt,
  n as Ct,
  a as Dt,
  b as vt,
  l as X,
  D as kt,
  d as At,
  p as Tt,
  A as Q,
  y as Z,
  B as Bt,
  E as rt,
} from "../index-DG7m4Xaq.js";
import { p as St } from "./cynefin-OW5HDTMX-FwiEsyvy.js";
var st = s(() => ({ domains: new Map(), transitions: [] }), "createDefaultData"),
  H = st(),
  Mt = s(() => H.domains, "getDomains"),
  zt = s(() => H.transitions, "getTransitions"),
  Lt = s((t) => {
    var e;
    if (t)
      for (const n of t) {
        const a = n.domain,
          c = ((e = n.items) != null ? e : []).map((f) => ({ label: f.label }));
        H.domains.set(a, { name: a, items: c });
      }
  }, "setDomains"),
  Nt = s((t) => {
    t &&
      (H.transitions = t
        .filter((e) =>
          e.from === e.to
            ? (X.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`), !1)
            : !0,
        )
        .map((e) => ({ from: e.from, to: e.to, label: e.label || void 0 })));
  }, "setTransitions"),
  Pt = s(() => Q({ ...Bt.cynefin, ...Z().cynefin }), "getConfig"),
  It = s(() => {
    (Tt(), (H = st()));
  }, "clear"),
  Y = {
    getDomains: Mt,
    getTransitions: zt,
    setDomains: Lt,
    setTransitions: Nt,
    getConfig: Pt,
    clear: It,
    setAccTitle: vt,
    getAccTitle: Dt,
    setDiagramTitle: Ct,
    getDiagramTitle: wt,
    getAccDescription: bt,
    setAccDescription: $t,
  },
  Wt = s((t) => {
    (gt(t, Y), Y.setDomains(t.domains), Y.setTransitions(t.transitions));
  }, "populate"),
  Rt = {
    parse: s(async (t) => {
      const e = await St("cynefin", t);
      (X.debug(e), Wt(e));
    }, "parse"),
  };
function V(t) {
  let e = (t + 1831565813) | 0;
  return (
    (e = Math.imul(e ^ (e >>> 15), e | 1)),
    (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
    ((e ^ (e >>> 14)) >>> 0) / 4294967296
  );
}
s(V, "seededRandom");
function it(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const a = t.charCodeAt(n);
    ((e = (e << 5) - e + a), (e |= 0));
  }
  return e;
}
s(it, "hashString");
function ct(t, e) {
  return typeof t == "number" && Number.isFinite(t) && t !== 0 ? t : it(e);
}
s(ct, "resolveSeed");
function lt(t, e, n, a) {
  const c = t / 2,
    f = a != null ? a : t * 0.015,
    D = 7,
    W = e / D,
    d = [];
  for (let o = 0; o <= D; o++) {
    const p = V(n + o * 17) * f * 2 - f;
    d.push({ x: c + p, y: o * W });
  }
  let v = `M${d[0].x},${d[0].y}`;
  for (let o = 0; o < d.length - 1; o++) {
    const p = d[o],
      i = d[o + 1],
      m = (p.y + i.y) / 2,
      b = o % 2 === 0 ? 1 : -1,
      h = f * 1.5 * b * V(n + o * 31 + 7),
      R = p.x + h,
      _ = m,
      E = i.x - h;
    v += ` C${R},${_} ${E},${m} ${i.x},${i.y}`;
  }
  return v;
}
s(lt, "generateFoldPath");
function ft(t, e, n, a) {
  const c = e / 2,
    f = a != null ? a : e * 0.015,
    D = 7,
    W = t / D,
    d = [];
  for (let o = 0; o <= D; o++) {
    const p = V(n + o * 23) * f * 2 - f;
    d.push({ x: o * W, y: c + p });
  }
  let v = `M${d[0].x},${d[0].y}`;
  for (let o = 0; o < d.length - 1; o++) {
    const p = d[o],
      i = d[o + 1],
      m = (p.x + i.x) / 2,
      b = o % 2 === 0 ? 1 : -1,
      h = f * 1.5 * b * V(n + o * 37 + 11),
      R = m,
      _ = p.y + h,
      E = m,
      z = i.y - h;
    v += ` C${R},${_} ${E},${z} ${i.x},${i.y}`;
  }
  return v;
}
s(ft, "generateHorizontalBoundary");
function dt(t, e) {
  const n = t / 2,
    a = e * 0.5,
    c = e,
    f = t * 0.03;
  return [
    `M${n},${a}`,
    `C${n + f},${a + (c - a) * 0.2}`,
    `${n - f * 1.5},${a + (c - a) * 0.55}`,
    `${n + f * 0.5},${a + (c - a) * 0.75}`,
    `C${n - f},${a + (c - a) * 0.85}`,
    `${n + f * 0.3},${a + (c - a) * 0.95}`,
    `${n},${c}`,
  ].join(" ");
}
s(dt, "generateCliffPath");
function mt(t, e, n, a) {
  return [`M${t - n},${e}`, `A${n},${a} 0 1,1 ${t + n},${e}`, `A${n},${a} 0 1,1 ${t - n},${e}`, "Z"].join(" ");
}
s(mt, "generateConfusionPath");
var ot = {
    complex: { model: "Probe → Sense → Respond", practice: "Emergent Practices" },
    complicated: { model: "Sense → Analyse → Respond", practice: "Good Practices" },
    clear: { model: "Sense → Categorise → Respond", practice: "Best Practices" },
    chaotic: { model: "Act → Sense → Respond", practice: "Novel Practices" },
    confusion: { model: "", practice: "Disorder" },
  },
  _t = s((t, e) => {
    const n = t / 2,
      a = e / 2;
    return {
      complex: { cx: n / 2, cy: a / 2, x: 0, y: 0, w: n, h: a },
      complicated: { cx: n + n / 2, cy: a / 2, x: n, y: 0, w: n, h: a },
      chaotic: { cx: n / 2, cy: a + a / 2, x: 0, y: a, w: n, h: a },
      clear: { cx: n + n / 2, cy: a + a / 2, x: n, y: a, w: n, h: a },
      confusion: { cx: n, cy: a, x: n * 0.7, y: a * 0.7, w: n * 0.6, h: a * 0.6 },
    };
  }, "getDomainLayouts"),
  Et = s(() => {
    const t = rt(),
      e = Z();
    return Q(t, e.themeVariables).cynefin;
  }, "getCynefinDomainColors"),
  U = 3,
  Ft = s((t, e, n, a) => {
    var et;
    const c = a.db,
      f = c.getDomains(),
      D = c.getTransitions(),
      W = c.getDiagramTitle(),
      d = c.getAccTitle(),
      v = c.getAccDescription(),
      o = c.getConfig(),
      p = Et();
    X.debug("Rendering Cynefin diagram");
    const i = o.width,
      m = o.height,
      b = o.padding,
      h = o.showDomainDescriptions,
      R = o.boundaryAmplitude,
      _ = i + b * 2,
      E = m + b * 2,
      z = {
        complex: p.complexBg,
        complicated: p.complicatedBg,
        clear: p.clearBg,
        chaotic: p.chaoticBg,
        confusion: p.confusionBg,
      },
      k = kt(e);
    (At(k, E, _, (et = o.useMaxWidth) != null ? et : !0),
      k.attr("viewBox", `0 0 ${_} ${E}`),
      d && k.append("title").text(d),
      v && k.append("desc").text(v));
    const A = k.append("g").attr("transform", `translate(${b}, ${b})`),
      F = _t(i, m),
      J = ct(o.seed, e),
      pt = A.append("g").attr("class", "cynefin-backgrounds"),
      j = ["complex", "complicated", "chaotic", "clear"];
    for (const l of j) {
      const r = F[l];
      pt.append("rect")
        .attr("class", "cynefinDomain")
        .attr("x", r.x)
        .attr("y", r.y)
        .attr("width", r.w)
        .attr("height", r.h)
        .attr("fill", z[l])
        .attr("fill-opacity", 0.4)
        .attr("stroke", "none");
    }
    const q = A.append("g").attr("class", "cynefin-boundaries");
    (q
      .append("path")
      .attr("class", "cynefinBoundary")
      .attr("d", lt(i, m, J, R))
      .attr("fill", "none"),
      q
        .append("path")
        .attr("class", "cynefinBoundary")
        .attr("d", ft(i, m, J + 100, R))
        .attr("fill", "none"),
      q.append("path").attr("class", "cynefinCliff").attr("d", dt(i, m)).attr("fill", "none"));
    const yt = i * 0.15,
      ut = m * 0.15;
    A.append("path")
      .attr("class", "cynefinConfusion")
      .attr("d", mt(i / 2, m / 2, yt, ut))
      .attr("fill", z.confusion)
      .attr("fill-opacity", 0.5);
    const K = A.append("g").attr("class", "cynefin-labels");
    for (const l of j) {
      const r = F[l];
      K.append("text")
        .attr("class", "cynefinDomainLabel")
        .attr("x", r.cx)
        .attr("y", h ? r.cy - 30 : r.cy)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(l.charAt(0).toUpperCase() + l.slice(1));
    }
    if (
      (K.append("text")
        .attr("class", "cynefinDomainLabel")
        .attr("x", i / 2)
        .attr("y", h ? m / 2 - 10 : m / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text("Confusion"),
      h)
    ) {
      const l = A.append("g").attr("class", "cynefin-subtitles");
      for (const r of j) {
        const u = F[r],
          y = ot[r];
        (l
          .append("text")
          .attr("class", "cynefinSubtitle")
          .attr("x", u.cx)
          .attr("y", u.cy - 10)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(y.model),
          l
            .append("text")
            .attr("class", "cynefinSubtitle")
            .attr("x", u.cx)
            .attr("y", u.cy + 5)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(y.practice));
      }
      l.append("text")
        .attr("class", "cynefinSubtitle")
        .attr("x", i / 2)
        .attr("y", m / 2 + 8)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(ot.confusion.practice);
    }
    const O = A.append("g").attr("class", "cynefin-items"),
      T = 26,
      tt = 10,
      ht = ["complex", "complicated", "chaotic", "clear", "confusion"];
    for (const l of ht) {
      const r = f.get(l);
      if (!r || r.items.length === 0) continue;
      const u = F[l],
        y = l === "confusion";
      let L = r.items,
        N = 0;
      y && r.items.length > U && ((N = r.items.length - U), (L = r.items.slice(0, U)));
      let B;
      if (y) {
        const g = h ? 22 : 14;
        B = u.cy + g;
      } else B = u.cy + (h ? 25 : 15);
      if (
        ([...L].forEach((g, S) => {
          const w = B + S * (T + 4),
            M = O.append("g"),
            P = M.append("text")
              .attr("class", "cynefinItemText")
              .attr("x", 0)
              .attr("y", T / 2)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "central")
              .text(g.label);
          let $ = g.label.length * 7;
          const x = P.node();
          if (x && typeof x.getBBox == "function") {
            const G = x.getBBox();
            G.width > 0 && ($ = G.width);
          }
          const C = $ + tt * 2,
            I = u.cx - C / 2;
          (M.attr("transform", `translate(${I}, ${w})`),
            M.insert("rect", "text")
              .attr("class", "cynefinItem")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", C)
              .attr("height", T)
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("fill", z[l])
              .attr("fill-opacity", 0.95),
            P.attr("x", C / 2).attr("y", T / 2));
        }),
        N > 0)
      ) {
        const g = B + L.length * (T + 4),
          S = `+${N} more`,
          w = O.append("g"),
          M = w
            .append("text")
            .attr("class", "cynefinItemText")
            .attr("x", 0)
            .attr("y", T / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .text(S);
        let P = S.length * 7;
        const $ = M.node();
        if ($ && typeof $.getBBox == "function") {
          const I = $.getBBox();
          I.width > 0 && (P = I.width);
        }
        const x = P + tt * 2,
          C = u.cx - x / 2;
        (w.attr("transform", `translate(${C}, ${g})`),
          w
            .insert("rect", "text")
            .attr("class", "cynefinItemOverflow")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", x)
            .attr("height", T)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("fill", z[l])
            .attr("fill-opacity", 0.6),
          M.attr("x", x / 2).attr("y", T / 2));
      }
    }
    if (D.length > 0) {
      const l = k.select("defs").empty() ? k.append("defs") : k.select("defs"),
        r = `cynefin-arrow-${e}`;
      l.append("marker")
        .attr("id", r)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 9)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("class", "cynefinArrowHead");
      const u = A.append("g").attr("class", "cynefin-arrows");
      D.forEach((y) => {
        const L = F[y.from],
          N = F[y.to];
        if (!L || !N) return;
        if (y.from === y.to) {
          X.warn(`Cynefin renderer: skipping self-loop on domain "${y.from}"`);
          return;
        }
        const B = L.cx,
          g = L.cy,
          S = N.cx,
          w = N.cy,
          M = (B + S) / 2,
          P = (g + w) / 2,
          $ = S - B,
          x = w - g,
          C = Math.sqrt($ * $ + x * x),
          I = C * 0.15,
          G = -x / C,
          xt = $ / C,
          nt = M + G * I,
          at = P + xt * I;
        (u
          .append("path")
          .attr("class", "cynefinArrowLine")
          .attr("d", `M${B},${g} Q${nt},${at} ${S},${w}`)
          .attr("fill", "none")
          .attr("marker-end", `url(#${r})`),
          y.label &&
            u
              .append("text")
              .attr("class", "cynefinArrowLabel")
              .attr("x", nt)
              .attr("y", at - 6)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "auto")
              .text(y.label));
      });
    }
    W &&
      A.append("text")
        .attr("class", "cynefinTitle")
        .attr("x", i / 2)
        .attr("y", -b / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(W);
  }, "draw"),
  Vt = { draw: Ft },
  Ht = s(() => {
    const t = rt(),
      e = Z();
    return Q(t, e.themeVariables).cynefin;
  }, "getCynefinTheme"),
  Gt = s(() => {
    const t = Ht();
    return `
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize - 1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize - 1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize + 2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`;
  }, "styles"),
  Yt = Gt,
  Ut = { parser: Rt, db: Y, renderer: Vt, styles: Yt };
export { Ut as diagram };
