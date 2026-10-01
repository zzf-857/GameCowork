import { p as se } from "./chunk-JWPE2WC7-mi7oxMEc.js";
import {
  _ as o,
  q as de,
  p as le,
  s as ce,
  g as me,
  a as ue,
  b as fe,
  l as h,
  d as $,
  m as xe,
  E as ge,
  t as he,
  F as be,
  D as E,
  G as pe,
  k as P,
  w as S,
  au as ve,
} from "./registry-BL-NPVNy.js";
import { p as we, i as ye } from "./cynefin-OW5HDTMX-Cm6ltTqe.js";
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
      (e._sentryDebugIds[n] = "09ce8d43-d169-4bc8-8d38-c08c9af10588"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-09ce8d43-d169-4bc8-8d38-c08c9af10588"));
  })();
} catch {}
var I = "position frame",
  N = "frame positioned",
  M = "position relation",
  C = "relation positioned",
  Pe = o(function (e) {
    h.debug("options str", e);
  }, "setOptions"),
  Se = o(function () {
    return {};
  }, "getOptions"),
  ke = o(function () {
    (O(), he());
  }, "clear");
function O() {
  R = {};
}
o(O, "reset");
var Me = pe.eventmodeling,
  Be = o(() => be({ ...Me, ...E().eventmodeling }), "getConfig"),
  R = {};
function W() {
  let e = Fe;
  const { ast: n } = R,
    t = A();
  if (!n) throw new Error("No data for EventModel");
  return (
    n.frames.forEach((i, a) => {
      const r = X(i, n.dataEntities, t);
      e = y(e, { $kind: I, index: a, frame: i, textProps: r });
      let d;
      J(i)
        ? (h.debug("source frame", i.sourceFrames),
          (d = n.frames.filter((l) => i.sourceFrames.some((c) => c.$refText === l.name))),
          d.forEach((l) => {
            e = y(e, { $kind: M, index: a, frame: i, sourceFrame: l });
          }))
        : (e = y(e, { $kind: M, index: a, frame: i }));
    }),
    (e = { ...e, sortedSwimlanesArray: T(e.swimlanes) }),
    e
  );
}
o(W, "getState");
function H(e) {
  R.ast = e;
}
o(H, "setAst");
var s = {
  swimlaneMinHeight: 70,
  swimlanePadding: 15,
  swimlaneGap: 10,
  boxPadding: 10,
  boxOverlap: 90,
  boxDefaultY: 0,
  boxMinWidth: 80,
  boxMaxWidth: 450,
  boxMinHeight: 80,
  boxMaxHeight: 750,
  contentStartX: 250,
  textMaxWidth: 450 - 2 * 10,
  boxTextFontWeight: "bold",
  boxTextPadding: 10,
  swimlaneTextFontWeight: "bold",
  labelUiAutomation: "UI/Automation",
  labelUiAutomationPrefix: "UI/A: ",
  labelCommandReadModel: "Command/Read Model",
  labelCommandReadModelPrefix: "C/RM: ",
  labelEvents: "Events",
  labelEventsPrefix: "Stream: ",
};
function A() {
  return s;
}
o(A, "getDiagramProps");
var Fe = { boxes: [], swimlanes: {}, relations: [], maxR: 0, sortedSwimlanesArray: [] };
function _(e) {
  const n = e.split(".");
  if (n.length === 2) return n[0];
}
o(_, "extractNamespace");
function U(e) {
  const n = e.split(".");
  return n.length === 2 ? n[1] : e;
}
o(U, "extractName");
function L(e, n) {
  if (!(!n || n.length === 0)) return Object.values(e).find((t) => t.namespace === n);
}
o(L, "findSwimlaneByNamespace");
function w(e, n, t) {
  return (
    Math.max(
      n,
      ...Object.keys(e)
        .filter((i) => {
          const a = Number.parseInt(i);
          return a > n && a < t;
        })
        .map((i) => Number.parseInt(i)),
    ) + 1
  );
}
o(w, "findNextAvailableIndex");
function V(e, n) {
  const t = _(e.entityIdentifier),
    i = L(n, t);
  switch (e.modelEntityType) {
    case "ui":
    case "pcr":
    case "processor":
      return i
        ? { index: i.index, label: i.namespace || s.labelUiAutomation }
        : t
          ? { index: w(n, 0, 100), label: s.labelUiAutomationPrefix + t }
          : { index: 0, label: s.labelUiAutomation };
    case "rmo":
    case "readmodel":
    case "cmd":
    case "command":
      return i
        ? { index: i.index, label: i.namespace || s.labelCommandReadModel }
        : t
          ? { index: w(n, 100, 200), label: s.labelCommandReadModelPrefix + t }
          : { index: 100, label: s.labelCommandReadModel };
    case "evt":
    case "event":
    default:
      return i
        ? { index: i.index, label: i.namespace || s.labelEvents }
        : t
          ? { index: w(n, 200, 300), label: s.labelEventsPrefix + t }
          : { index: 200, label: s.labelEvents };
  }
}
o(V, "calculateSwimlaneProps");
function G(e) {
  var t, i, a, r, d, l, c, m, x, u;
  const { themeVariables: n } = E();
  switch (e.modelEntityType) {
    case "ui":
      return { fill: (t = n.emUiFill) != null ? t : "white", stroke: (i = n.emUiStroke) != null ? i : "#dbdada" };
    case "pcr":
    case "processor":
      return {
        fill: (a = n.emProcessorFill) != null ? a : "#edb3f6",
        stroke: (r = n.emProcessorStroke) != null ? r : "#b88cbf",
      };
    case "rmo":
    case "readmodel":
      return {
        fill: (d = n.emReadModelFill) != null ? d : "#d3f1a2",
        stroke: (l = n.emReadModelStroke) != null ? l : "#a3b732",
      };
    case "cmd":
    case "command":
      return {
        fill: (c = n.emCommandFill) != null ? c : "#bcd6fe",
        stroke: (m = n.emCommandStroke) != null ? m : "#679ac3",
      };
    case "evt":
    case "event":
      return {
        fill: (x = n.emEventFill) != null ? x : "#ffb778",
        stroke: (u = n.emEventStroke) != null ? u : "#c19a0f",
      };
    default:
      return { fill: "red", stroke: "black" };
  }
}
o(G, "calculateEntityVisualProps");
function X(e, n, t) {
  var g;
  const i = E(),
    a = P((g = U(e.entityIdentifier)) != null ? g : "", i);
  let r;
  const d = {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    joinWith: "<br/>",
  };
  let c = `<b>${S(a, t.textMaxWidth, d)}</b>`;
  if (
    (e.dataInlineValue &&
      ((r = e.dataInlineValue),
      (r = r.substring(r.indexOf("{") + 1)),
      (r = r.substring(0, r.lastIndexOf("}") - 1)),
      (r = P(r, i)),
      (r = S(r, t.textMaxWidth, d)),
      (r = r.replaceAll(" ", "&nbsp;"))),
    e.dataReference)
  ) {
    const p = n.find((v) => {
      var D;
      return v.name === ((D = e.dataReference) == null ? void 0 : D.$refText);
    });
    p &&
      ((r = p.dataBlockValue),
      (r = r.substring(
        r.indexOf(`{
`) + 2,
      )),
      (r = r.substring(0, r.lastIndexOf("}") - 1)),
      (r = P(r, i)),
      (r = S(r, t.textMaxWidth, d)),
      (r = r.replaceAll(" ", "&nbsp;")),
      (r += "<br/>"));
  }
  const m = r !== void 0;
  m && (c += `<br/><br/><code style="text-align: left; display: block;max-width:${t.textMaxWidth}px">${r}</code>`);
  const x = { fontSize: d.fontSize, fontWeight: d.fontWeight, fontFamily: d.fontFamily },
    u = ve(c, x),
    b = m ? u.width / 3 : u.width,
    f = { content: c, width: b, height: u.height };
  return (h.debug(`[${e.name}] ${e.entityIdentifier} text`, f), f);
}
o(X, "calculateTextProps");
function Y(e, n) {
  const t = n,
    i = G(t.frame),
    a = { width: t.textProps.width + 2 * s.boxTextPadding, height: t.textProps.height + 2 * s.boxTextPadding };
  return [{ $kind: N, frame: t.frame, index: t.index, visual: i, dimension: a, textProps: t.textProps }];
}
o(Y, "decidePositionFrame");
function j(e, n, t) {
  return n === void 0
    ? s.contentStartX
    : n.index === e.index && e.r
      ? e.r + s.boxPadding
      : t === void 0
        ? s.contentStartX
        : t.r - s.boxOverlap + s.boxPadding;
}
o(j, "calculateX");
function z(e, n) {
  const t = [...e.map((i) => i.r), n];
  return Math.max(...t);
}
o(z, "calculateMaxRight");
function T(e) {
  return Object.values(e).sort((n, t) => n.index - t.index);
}
o(T, "sortedSwimlanesArray");
function K(e, n) {
  const t = n,
    i = V(t.frame, e.swimlanes);
  let a;
  i.index in e.swimlanes
    ? (a = e.swimlanes[i.index])
    : (a = {
        index: i.index,
        label: i.label,
        r: 0,
        y: i.index * s.swimlaneMinHeight + s.swimlaneGap,
        height: s.swimlaneMinHeight,
        maxHeight: s.swimlaneMinHeight,
      });
  const r = e.boxes.length > 0 ? e.boxes[e.boxes.length - 1] : void 0,
    d = e.previousSwimlaneNumber !== void 0 ? e.swimlanes[e.previousSwimlaneNumber] : void 0,
    l = {
      width: Math.max(s.boxMinWidth, Math.min(s.boxMaxWidth, t.dimension.width)) + 2 * s.boxPadding,
      height: Math.max(s.boxMinHeight, Math.min(s.boxMaxHeight, t.dimension.height)) + 2 * s.boxPadding,
    },
    c = j(a, d, r),
    m = c + l.width + s.boxPadding,
    x = z(Object.values(e.swimlanes), m);
  ((a.r = c + l.width),
    (a.maxHeight = Math.max(a.maxHeight, l.height)),
    (a.height = Math.max(s.swimlaneMinHeight, a.maxHeight) + 2 * s.swimlanePadding));
  const u = {
      x: c,
      y: s.swimlanePadding + a.y,
      r: m,
      dimension: l,
      leftSibling: !1,
      swimlane: a,
      visual: t.visual,
      text: t.textProps.content,
      frame: t.frame,
      index: t.index,
    },
    b = {
      ...e,
      boxes: [...e.boxes, u],
      swimlanes: { ...e.swimlanes, [`${a.index}`]: a },
      previousSwimlaneNumber: i.index,
      previousFrame: t.frame,
      maxR: x,
    },
    f = T(b.swimlanes);
  f.length > 0 && (f[0].y = 0);
  for (let g = 1; g < f.length; g++) {
    const p = f[g],
      v = f[g - 1];
    p.y = v.y + v.height + s.swimlaneGap;
  }
  return b;
}
o(K, "evolveFramePositioned");
function q(e, n) {
  return e === 0 && n.sourceFrames.length === 0;
}
o(q, "isFirstFrame");
function J(e) {
  return e.sourceFrames !== void 0 && e.sourceFrames !== null && e.sourceFrames.length > 0;
}
o(J, "hasSourceFrame");
function B(e, n) {
  if (n != null) return e.find((t) => t.frame.name === n.name);
}
o(B, "findBoxByFrame");
function Q(e, n, t) {
  if (!(t < 0))
    for (let i = t; i >= 0; i--) {
      const a = e[i];
      if (a.swimlane.index !== n) return a;
    }
}
o(Q, "findBoxByLineIndex");
function Z(e, n) {
  const t = n;
  if (ye(t.frame) || q(t.index, t.frame)) return [];
  const i = B(e.boxes, t.frame);
  if (i === void 0) throw new Error(`Target box not found for frame ${t.frame.name}`);
  let a;
  return (
    t.sourceFrame ? (a = B(e.boxes, t.sourceFrame)) : (a = Q(e.boxes, i.swimlane.index, t.index - 1)),
    a === void 0 ? [] : [{ $kind: C, frame: t.frame, index: t.index, sourceBox: a, targetBox: i }]
  );
}
o(Z, "decidePositionRelation");
function ee(e, n) {
  const t = n,
    i = {
      visual: { fill: "none", stroke: "#000" },
      source: { x: t.sourceBox.x, y: t.sourceBox.y },
      target: { x: t.targetBox.x, y: t.targetBox.y },
      sourceBox: t.sourceBox,
      targetBox: t.targetBox,
    };
  return { ...e, relations: [...e.relations, i] };
}
o(ee, "evolveRelationPositioned");
var Ee = { [I]: Y, [M]: Z },
  Re = { [N]: K, [C]: ee };
function te(e, n) {
  const t = Ee[n.$kind];
  if (t == null) return [];
  const i = t(e, n);
  return (h.debug("decided events", i), i);
}
o(te, "decide");
function ne(e, n) {
  const t = n.reduce((i, a) => {
    const r = Re[a.$kind];
    return r == null ? i : r(i, a);
  }, e);
  return (h.debug("evolve events", { state: e, newState: t, events: n }), t);
}
o(ne, "evolve");
function y(e, n) {
  const t = te(e, n);
  return ne(e, t);
}
o(y, "dispatch");
var F = {
    getConfig: Be,
    setOptions: Pe,
    getOptions: Se,
    clear: ke,
    setAccTitle: fe,
    getAccTitle: ue,
    getAccDescription: me,
    setAccDescription: ce,
    setDiagramTitle: le,
    getDiagramTitle: de,
    setAst: H,
    getDiagramProps: A,
    getState: W,
  },
  Ae = {
    parse: o(async (e) => {
      const n = await we("eventmodeling", e);
      (h.debug(n), F.setAst(n), se(n, F));
    }, "parse"),
  },
  k = $(),
  Te = k == null ? void 0 : k.eventmodeling;
function ie(e, n) {
  return (t) => {
    const i = t.swimlane.y + n.swimlanePadding,
      a = e.append("g").attr("class", "em-box");
    (a
      .append("rect")
      .attr("x", t.x)
      .attr("y", i)
      .attr("rx", "3")
      .attr("width", t.dimension.width)
      .attr("height", t.dimension.height)
      .attr("stroke", t.visual.stroke)
      .attr("fill", t.visual.fill),
      a
        .append("foreignObject")
        .attr("x", t.x + n.boxPadding)
        .attr("y", i + 10)
        .attr("width", t.dimension.width - 2 * n.boxPadding)
        .attr("height", t.dimension.height - 2 * n.boxPadding)
        .append("xhtml:div")
        .style("display", "table")
        .style("height", "100%")
        .style("width", "100%")
        .append("span")
        .style("display", "table-cell")
        .style("text-align", "center")
        .style("vertical-align", "middle")
        .html(t.text));
  };
}
o(ie, "renderD3Box");
function ae(e, n) {
  return e > n;
}
o(ae, "dirUpwards");
function re(e, n, t, i) {
  return (a) => {
    var f;
    const r = a.sourceBox.swimlane.y + n.swimlanePadding,
      d = a.targetBox.swimlane.y + n.swimlanePadding,
      l = ae(r, d),
      c = a.sourceBox.x + (a.sourceBox.dimension.width * 2) / 3,
      m = a.targetBox.x + a.targetBox.dimension.width / 3;
    let x, u;
    (h.debug(`rendering relation up=${l} for `, { sourceBox: a.sourceBox, targetBox: a.targetBox }),
      l ? ((x = r), (u = d + a.targetBox.dimension.height)) : ((x = r + a.sourceBox.dimension.height), (u = d)));
    const b = (f = i.emRelationStroke) != null ? f : a.visual.stroke;
    e.append("path")
      .attr("class", "em-relation")
      .attr("fill", a.visual.fill)
      .attr("stroke", b)
      .attr("stroke-width", "1")
      .attr("marker-end", `url(#${t})`)
      .attr("d", `M${c} ${x} L${m} ${u}`);
  };
}
o(re, "renderD3Relation");
function oe(e, n, t, i) {
  return (a) => {
    var c, m;
    const r = e.append("g").attr("class", "em-swimlane"),
      d = (c = i.emSwimlaneBackgroundOdd) != null ? c : "rgb(250,250,250)",
      l = (m = i.emSwimlaneBackgroundStroke) != null ? m : "rgb(240,240,240)";
    (r
      .append("rect")
      .attr("x", 0)
      .attr("y", a.y)
      .attr("rx", "3")
      .attr("width", n + t.swimlanePadding)
      .attr("height", a.height)
      .attr("fill", d)
      .attr("stroke", l),
      r
        .append("text")
        .attr("font-weight", t.swimlaneTextFontWeight)
        .attr("x", 30)
        .attr("y", a.y + 30)
        .text(a.label));
  };
}
o(oe, "renderD3Swimlane");
var De = o(function (e, n, t, i) {
    var f, g;
    if (
      (h.debug(
        "in eventmodeling renderer",
        e +
          `
`,
        "id:",
        n,
        t,
      ),
      !Te)
    )
      throw new Error("EventModeling config not found");
    const a = i.db,
      { themeVariables: r, eventmodeling: d } = $(),
      l = xe(`[id="${n}"]`),
      c = a.getDiagramProps(),
      m = a.getState(),
      x = `em-arrowhead-${n}`,
      u = (f = r.emArrowhead) != null ? f : "#000000";
    (m.sortedSwimlanesArray.forEach(oe(l, m.maxR, c, r)),
      m.boxes.forEach(ie(l, c)),
      m.relations.forEach(re(l, c, x, r)),
      l
        .append("defs")
        .append("marker")
        .attr("id", x)
        .attr("markerWidth", "10")
        .attr("markerHeight", "7")
        .attr("refX", "10")
        .attr("refY", "3.5")
        .attr("orient", "auto")
        .append("polygon")
        .attr("points", "0 0, 10 3.5, 0 7")
        .attr("fill", u),
      ge(void 0, l, (g = d == null ? void 0 : d.padding) != null ? g : 30, d == null ? void 0 : d.useMaxWidth));
  }, "draw"),
  $e = { draw: De },
  Ie = o((e) => "", "getStyles"),
  Ne = Ie,
  He = { parser: Ae, db: F, renderer: $e, styles: Ne };
export { He as diagram };
