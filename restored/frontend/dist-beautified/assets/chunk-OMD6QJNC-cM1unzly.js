import { _ as a, N as l, H as d } from "./VscTheme-BExNMG_K.js";
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
      (t._sentryDebugIds[e] = "29258e23-d70c-438b-827d-f50e593a89e3"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-29258e23-d70c-438b-827d-f50e593a89e3"));
  })();
} catch {}
var o = a((t, e) => {
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
      for (const n in e.attrs) r.attr(n, e.attrs[n]);
    return (e.class && r.attr("class", e.class), r);
  }, "drawRect"),
  c = a((t, e) => {
    const r = {
      x: e.startx,
      y: e.starty,
      width: e.stopx - e.startx,
      height: e.stopy - e.starty,
      fill: e.fill,
      stroke: e.stroke,
      class: "rect",
    };
    o(t, r).lower();
  }, "drawBackgroundRect"),
  g = a((t, e) => {
    const r = e.text.replace(l, " "),
      n = t.append("text");
    (n.attr("x", e.x),
      n.attr("y", e.y),
      n.attr("class", "legend"),
      n.style("text-anchor", e.anchor),
      e.class && n.attr("class", e.class));
    const s = n.append("tspan");
    return (s.attr("x", e.x + e.textMargin * 2), s.text(r), n);
  }, "drawText"),
  y = a((t, e, r, n) => {
    const s = t.append("image");
    (s.attr("x", e), s.attr("y", r));
    const i = d.sanitizeUrl(n);
    s.attr("xlink:href", i);
  }, "drawImage"),
  x = a((t, e, r, n) => {
    const s = t.append("use");
    (s.attr("x", e), s.attr("y", r));
    const i = d.sanitizeUrl(n);
    s.attr("xlink:href", `#${i}`);
  }, "drawEmbeddedImage"),
  p = a(
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
  );
export { c as a, h as b, x as c, o as d, y as e, g as f, p as g };
