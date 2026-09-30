import { p as xt } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  _ as s,
  s as bt,
  g as $t,
  q as wt,
  p as Ct,
  a as Dt,
  b as vt,
  l as X,
  I as Tt,
  e as kt,
  t as At,
  F as J,
  D as Q,
  G as Bt,
  J as rt,
} from "./registry-CHHSpXp3.js";
import { p as St } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      e = new t.Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "43b0e9ef-96d1-40e7-bb1a-0a19b14beb95"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-43b0e9ef-96d1-40e7-bb1a-0a19b14beb95"));
  })();
} catch {}
var st = s(() => ({ domains: new Map(), transitions: [] }), "createDefaultData"),
  G = st(),
  It = s(() => G.domains, "getDomains"),
  Mt = s(() => G.transitions, "getTransitions"),
  Lt = s((t) => {
    var e;
    if (t)
      for (const n of t) {
        const o = n.domain,
          c = ((e = n.items) != null ? e : []).map((d) => ({ label: d.label }));
        G.domains.set(o, { name: o, items: c });
      }
  }, "setDomains"),
  _t = s((t) => {
    t &&
      (G.transitions = t
        .filter((e) =>
          e.from === e.to
            ? (X.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`), !1)
            : !0,
        )
        .map((e) => ({ from: e.from, to: e.to, label: e.label || void 0 })));
  }, "setTransitions"),
  zt = s(() => J({ ...Bt.cynefin, ...Q().cynefin }), "getConfig"),
  Et = s(() => {
    (At(), (G = st()));
  }, "clear"),
  Y = {
    getDomains: It,
    getTransitions: Mt,
    setDomains: Lt,
    setTransitions: _t,
    getConfig: zt,
    clear: Et,
    setAccTitle: vt,
    getAccTitle: Dt,
    setDiagramTitle: Ct,
    getDiagramTitle: wt,
    getAccDescription: $t,
    setAccDescription: bt,
  },
  Nt = s((t) => {
    (xt(t, Y), Y.setDomains(t.domains), Y.setTransitions(t.transitions));
  }, "populate"),
  Pt = {
    parse: s(async (t) => {
      const e = await St("cynefin", t);
      (X.debug(e), Nt(e));
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
    const o = t.charCodeAt(n);
    ((e = (e << 5) - e + o), (e |= 0));
  }
  return e;
}
s(it, "hashString");
function ct(t, e) {
  return typeof t == "number" && Number.isFinite(t) && t !== 0 ? t : it(e);
}
s(ct, "resolveSeed");
function lt(t, e, n, o) {
  const c = t / 2,
    d = o != null ? o : t * 0.015,
    D = 7,
    N = e / D,
    f = [];
  for (let a = 0; a <= D; a++) {
    const p = V(n + a * 17) * d * 2 - d;
    f.push({ x: c + p, y: a * N });
  }
  let v = `M${f[0].x},${f[0].y}`;
  for (let a = 0; a < f.length - 1; a++) {
    const p = f[a],
      i = f[a + 1],
      m = (p.y + i.y) / 2,
      $ = a % 2 === 0 ? 1 : -1,
      g = d * 1.5 * $ * V(n + a * 31 + 7),
      P = p.x + g,
      R = m,
      W = i.x - g;
    v += ` C${P},${R} ${W},${m} ${i.x},${i.y}`;
  }
  return v;
}
s(lt, "generateFoldPath");
function dt(t, e, n, o) {
  const c = e / 2,
    d = o != null ? o : e * 0.015,
    D = 7,
    N = t / D,
    f = [];
  for (let a = 0; a <= D; a++) {
    const p = V(n + a * 23) * d * 2 - d;
    f.push({ x: a * N, y: c + p });
  }
  let v = `M${f[0].x},${f[0].y}`;
  for (let a = 0; a < f.length - 1; a++) {
    const p = f[a],
      i = f[a + 1],
      m = (p.x + i.x) / 2,
      $ = a % 2 === 0 ? 1 : -1,
      g = d * 1.5 * $ * V(n + a * 37 + 11),
      P = m,
      R = p.y + g,
      W = m,
      M = i.y - g;
    v += ` C${P},${R} ${W},${M} ${i.x},${i.y}`;
  }
  return v;
}
s(dt, "generateHorizontalBoundary");
function ft(t, e) {
  const n = t / 2,
    o = e * 0.5,
    c = e,
    d = t * 0.03;
  return [
    `M${n},${o}`,
    `C${n + d},${o + (c - o) * 0.2}`,
    `${n - d * 1.5},${o + (c - o) * 0.55}`,
    `${n + d * 0.5},${o + (c - o) * 0.75}`,
    `C${n - d},${o + (c - o) * 0.85}`,
    `${n + d * 0.3},${o + (c - o) * 0.95}`,
    `${n},${c}`,
  ].join(" ");
}
s(ft, "generateCliffPath");
function mt(t, e, n, o) {
  return [`M${t - n},${e}`, `A${n},${o} 0 1,1 ${t + n},${e}`, `A${n},${o} 0 1,1 ${t - n},${e}`, "Z"].join(" ");
}
s(mt, "generateConfusionPath");
var at = {
    complex: { model: "Probe → Sense → Respond", practice: "Emergent Practices" },
    complicated: { model: "Sense → Analyse → Respond", practice: "Good Practices" },
    clear: { model: "Sense → Categorise → Respond", practice: "Best Practices" },
    chaotic: { model: "Act → Sense → Respond", practice: "Novel Practices" },
    confusion: { model: "", practice: "Disorder" },
  },
  Rt = s((t, e) => {
    const n = t / 2,
      o = e / 2;
    return {
      complex: { cx: n / 2, cy: o / 2, x: 0, y: 0, w: n, h: o },
      complicated: { cx: n + n / 2, cy: o / 2, x: n, y: 0, w: n, h: o },
      chaotic: { cx: n / 2, cy: o + o / 2, x: 0, y: o, w: n, h: o },
      clear: { cx: n + n / 2, cy: o + o / 2, x: n, y: o, w: n, h: o },
      confusion: { cx: n, cy: o, x: n * 0.7, y: o * 0.7, w: n * 0.6, h: o * 0.6 },
    };
  }, "getDomainLayouts"),
  Wt = s(() => {
    const t = rt(),
      e = Q();
    return J(t, e.themeVariables).cynefin;
  }, "getCynefinDomainColors"),
  U = 3,
  Ft = s((t, e, n, o) => {
    var et;
    const c = o.db,
      d = c.getDomains(),
      D = c.getTransitions(),
      N = c.getDiagramTitle(),
      f = c.getAccTitle(),
      v = c.getAccDescription(),
      a = c.getConfig(),
      p = Wt();
    X.debug("Rendering Cynefin diagram");
    const i = a.width,
      m = a.height,
      $ = a.padding,
      g = a.showDomainDescriptions,
      P = a.boundaryAmplitude,
      R = i + $ * 2,
      W = m + $ * 2,
      M = {
        complex: p.complexBg,
        complicated: p.complicatedBg,
        clear: p.clearBg,
        chaotic: p.chaoticBg,
        confusion: p.confusionBg,
      },
      T = Tt(e);
    (kt(T, W, R, (et = a.useMaxWidth) != null ? et : !0),
      T.attr("viewBox", `0 0 ${R} ${W}`),
      f && T.append("title").text(f),
      v && T.append("desc").text(v));
    const k = T.append("g").attr("transform", `translate(${$}, ${$})`),
      F = Rt(i, m),
      Z = ct(a.seed, e),
      pt = k.append("g").attr("class", "cynefin-backgrounds"),
      j = ["complex", "complicated", "chaotic", "clear"];
    for (const l of j) {
      const r = F[l];
      pt.append("rect")
        .attr("class", "cynefinDomain")
        .attr("x", r.x)
        .attr("y", r.y)
        .attr("width", r.w)
        .attr("height", r.h)
        .attr("fill", M[l])
        .attr("fill-opacity", 0.4)
        .attr("stroke", "none");
    }
    const q = k.append("g").attr("class", "cynefin-boundaries");
    (q
      .append("path")
      .attr("class", "cynefinBoundary")
      .attr("d", lt(i, m, Z, P))
      .attr("fill", "none"),
      q
        .append("path")
        .attr("class", "cynefinBoundary")
        .attr("d", dt(i, m, Z + 100, P))
        .attr("fill", "none"),
      q.append("path").attr("class", "cynefinCliff").attr("d", ft(i, m)).attr("fill", "none"));
    const yt = i * 0.15,
      ut = m * 0.15;
    k.append("path")
      .attr("class", "cynefinConfusion")
      .attr("d", mt(i / 2, m / 2, yt, ut))
      .attr("fill", M.confusion)
      .attr("fill-opacity", 0.5);
    const K = k.append("g").attr("class", "cynefin-labels");
    for (const l of j) {
      const r = F[l];
      K.append("text")
        .attr("class", "cynefinDomainLabel")
        .attr("x", r.cx)
        .attr("y", g ? r.cy - 30 : r.cy)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(l.charAt(0).toUpperCase() + l.slice(1));
    }
    if (
      (K.append("text")
        .attr("class", "cynefinDomainLabel")
        .attr("x", i / 2)
        .attr("y", g ? m / 2 - 10 : m / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text("Confusion"),
      g)
    ) {
      const l = k.append("g").attr("class", "cynefin-subtitles");
      for (const r of j) {
        const u = F[r],
          y = at[r];
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
        .text(at.confusion.practice);
    }
    const O = k.append("g").attr("class", "cynefin-items"),
      A = 26,
      tt = 10,
      gt = ["complex", "complicated", "chaotic", "clear", "confusion"];
    for (const l of gt) {
      const r = d.get(l);
      if (!r || r.items.length === 0) continue;
      const u = F[l],
        y = l === "confusion";
      let L = r.items,
        _ = 0;
      y && r.items.length > U && ((_ = r.items.length - U), (L = r.items.slice(0, U)));
      let B;
      if (y) {
        const x = g ? 22 : 14;
        B = u.cy + x;
      } else B = u.cy + (g ? 25 : 15);
      if (
        ([...L].forEach((x, S) => {
          const w = B + S * (A + 4),
            I = O.append("g"),
            z = I.append("text")
              .attr("class", "cynefinItemText")
              .attr("x", 0)
              .attr("y", A / 2)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "central")
              .text(x.label);
          let b = x.label.length * 7;
          const h = z.node();
          if (h && typeof h.getBBox == "function") {
            const H = h.getBBox();
            H.width > 0 && (b = H.width);
          }
          const C = b + tt * 2,
            E = u.cx - C / 2;
          (I.attr("transform", `translate(${E}, ${w})`),
            I.insert("rect", "text")
              .attr("class", "cynefinItem")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", C)
              .attr("height", A)
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("fill", M[l])
              .attr("fill-opacity", 0.95),
            z.attr("x", C / 2).attr("y", A / 2));
        }),
        _ > 0)
      ) {
        const x = B + L.length * (A + 4),
          S = `+${_} more`,
          w = O.append("g"),
          I = w
            .append("text")
            .attr("class", "cynefinItemText")
            .attr("x", 0)
            .attr("y", A / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .text(S);
        let z = S.length * 7;
        const b = I.node();
        if (b && typeof b.getBBox == "function") {
          const E = b.getBBox();
          E.width > 0 && (z = E.width);
        }
        const h = z + tt * 2,
          C = u.cx - h / 2;
        (w.attr("transform", `translate(${C}, ${x})`),
          w
            .insert("rect", "text")
            .attr("class", "cynefinItemOverflow")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", h)
            .attr("height", A)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("fill", M[l])
            .attr("fill-opacity", 0.6),
          I.attr("x", h / 2).attr("y", A / 2));
      }
    }
    if (D.length > 0) {
      const l = T.select("defs").empty() ? T.append("defs") : T.select("defs"),
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
      const u = k.append("g").attr("class", "cynefin-arrows");
      D.forEach((y) => {
        const L = F[y.from],
          _ = F[y.to];
        if (!L || !_) return;
        if (y.from === y.to) {
          X.warn(`Cynefin renderer: skipping self-loop on domain "${y.from}"`);
          return;
        }
        const B = L.cx,
          x = L.cy,
          S = _.cx,
          w = _.cy,
          I = (B + S) / 2,
          z = (x + w) / 2,
          b = S - B,
          h = w - x,
          C = Math.sqrt(b * b + h * h),
          E = C * 0.15,
          H = -h / C,
          ht = b / C,
          nt = I + H * E,
          ot = z + ht * E;
        (u
          .append("path")
          .attr("class", "cynefinArrowLine")
          .attr("d", `M${B},${x} Q${nt},${ot} ${S},${w}`)
          .attr("fill", "none")
          .attr("marker-end", `url(#${r})`),
          y.label &&
            u
              .append("text")
              .attr("class", "cynefinArrowLabel")
              .attr("x", nt)
              .attr("y", ot - 6)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "auto")
              .text(y.label));
      });
    }
    N &&
      k
        .append("text")
        .attr("class", "cynefinTitle")
        .attr("x", i / 2)
        .attr("y", -$ / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(N);
  }, "draw"),
  Vt = { draw: Ft },
  Gt = s(() => {
    const t = rt(),
      e = Q();
    return J(t, e.themeVariables).cynefin;
  }, "getCynefinTheme"),
  Ht = s(() => {
    const t = Gt();
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
  Yt = Ht,
  Ut = { parser: Pt, db: Y, renderer: Vt, styles: Yt };
export { Ut as diagram };
