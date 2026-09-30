import { _ as n, m as i, $ as o, L as l } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[t] = "e03d75c0-ed10-4f59-add2-90623b1352dd"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-e03d75c0-ed10-4f59-add2-90623b1352dd"));
  })();
} catch {}
var f = n((e, t) => {
    const r = e.append("rect");
    if (
      (r.attr("x", t.x),
      r.attr("y", t.y),
      r.attr("fill", t.fill),
      r.attr("stroke", t.stroke),
      r.attr("width", t.width),
      r.attr("height", t.height),
      t.name && r.attr("name", t.name),
      t.rx && r.attr("rx", t.rx),
      t.ry && r.attr("ry", t.ry),
      t.attrs !== void 0)
    )
      for (const s in t.attrs) r.attr(s, t.attrs[s]);
    return (t.class && r.attr("class", t.class), r);
  }, "drawRect"),
  c = n((e, t) => {
    const r = {
      x: t.startx,
      y: t.starty,
      width: t.stopx - t.startx,
      height: t.stopy - t.starty,
      fill: t.fill,
      stroke: t.stroke,
      class: "rect",
    };
    f(e, r).lower();
  }, "drawBackgroundRect"),
  p = n((e, t) => {
    const r = t.text.replace(o, " "),
      s = e.append("text");
    (s.attr("x", t.x),
      s.attr("y", t.y),
      s.attr("class", "legend"),
      s.style("text-anchor", t.anchor),
      t.class && s.attr("class", t.class));
    const a = s.append("tspan");
    return (a.attr("x", t.x + t.textMargin * 2), a.text(r), s);
  }, "drawText"),
  g = n((e, t, r, s) => {
    const a = e.append("image");
    (a.attr("x", t), a.attr("y", r));
    const d = l.sanitizeUrl(s);
    a.attr("xlink:href", d);
  }, "drawImage"),
  x = n((e, t, r, s) => {
    const a = e.append("use");
    (a.attr("x", t), a.attr("y", r));
    const d = l.sanitizeUrl(s);
    a.attr("xlink:href", `#${d}`);
  }, "drawEmbeddedImage"),
  m = n(
    () => ({ x: 0, y: 0, width: 100, height: 100, fill: "#EDF2AE", stroke: "#666", anchor: "start", rx: 0, ry: 0 }),
    "getNoteRect",
  ),
  h = n(
    () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      "text-anchor": "start",
      style: "#666",
      textMargin: 0,
      rx: 0,
      ry: 0,
      tspan: !0,
    }),
    "getTextObj",
  ),
  w = n(() => {
    let e = i(".mermaidTooltip");
    return (
      e.empty() &&
        (e = i("body")
          .append("div")
          .attr("class", "mermaidTooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("text-align", "center")
          .style("max-width", "200px")
          .style("padding", "2px")
          .style("font-size", "12px")
          .style("background", "#ffffde")
          .style("border", "1px solid #333")
          .style("border-radius", "2px")
          .style("pointer-events", "none")
          .style("z-index", "100")),
      e
    );
  }, "createTooltip");
export { c as a, m as b, x as c, f as d, g as e, w as f, h as g, p as h };
