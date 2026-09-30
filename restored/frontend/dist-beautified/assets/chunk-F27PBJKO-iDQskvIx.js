import { _ as a, m as d, $ as o, L as l } from "./registry-BL-NPVNy.js";
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
      (t._sentryDebugIds[e] = "e03d75c0-ed10-4f59-add2-90623b1352dd"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-e03d75c0-ed10-4f59-add2-90623b1352dd"));
  })();
} catch {}
var f = a((t, e) => {
    const r = t.append("rect");
    if (
      (r.attr("x", e.x),
      r.attr("y", e.y),
      r.attr("fill", e.fill),
      r.attr("stroke", e.stroke),
      r.attr("width", e.width),
      r.attr("height", e.height),
      e.name && r.attr("name", e.name),
      e.rx && r.attr("rx", e.rx),
      e.ry && r.attr("ry", e.ry),
      e.attrs !== void 0)
    )
      for (const s in e.attrs) r.attr(s, e.attrs[s]);
    return (e.class && r.attr("class", e.class), r);
  }, "drawRect"),
  y = a((t, e) => {
    const r = {
      x: e.startx,
      y: e.starty,
      width: e.stopx - e.startx,
      height: e.stopy - e.starty,
      fill: e.fill,
      stroke: e.stroke,
      class: "rect",
    };
    f(t, r).lower();
  }, "drawBackgroundRect"),
  p = a((t, e) => {
    const r = e.text.replace(o, " "),
      s = t.append("text");
    (s.attr("x", e.x),
      s.attr("y", e.y),
      s.attr("class", "legend"),
      s.style("text-anchor", e.anchor),
      e.class && s.attr("class", e.class));
    const n = s.append("tspan");
    return (n.attr("x", e.x + e.textMargin * 2), n.text(r), s);
  }, "drawText"),
  g = a((t, e, r, s) => {
    const n = t.append("image");
    (n.attr("x", e), n.attr("y", r));
    const i = l.sanitizeUrl(s);
    n.attr("xlink:href", i);
  }, "drawImage"),
  x = a((t, e, r, s) => {
    const n = t.append("use");
    (n.attr("x", e), n.attr("y", r));
    const i = l.sanitizeUrl(s);
    n.attr("xlink:href", `#${i}`);
  }, "drawEmbeddedImage"),
  m = a(
    () => ({ x: 0, y: 0, width: 100, height: 100, fill: "#EDF2AE", stroke: "#666", anchor: "start", rx: 0, ry: 0 }),
    "getNoteRect",
  ),
  h = a(
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
  w = a(() => {
    let t = d(".mermaidTooltip");
    return (
      t.empty() &&
        (t = d("body")
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
      t
    );
  }, "createTooltip");
export { y as a, m as b, x as c, f as d, g as e, w as f, h as g, p as h };
