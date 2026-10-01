import { _ as a, N as l, H as d } from "./VscTheme-B-CSeuv5.js";
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
      (e._sentryDebugIds[t] = "29258e23-d70c-438b-827d-f50e593a89e3"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-29258e23-d70c-438b-827d-f50e593a89e3"));
  })();
} catch {}
var o = a((e, t) => {
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
      for (const n in t.attrs) r.attr(n, t.attrs[n]);
    return (t.class && r.attr("class", t.class), r);
  }, "drawRect"),
  c = a((e, t) => {
    const r = {
      x: t.startx,
      y: t.starty,
      width: t.stopx - t.startx,
      height: t.stopy - t.starty,
      fill: t.fill,
      stroke: t.stroke,
      class: "rect",
    };
    o(e, r).lower();
  }, "drawBackgroundRect"),
  g = a((e, t) => {
    const r = t.text.replace(l, " "),
      n = e.append("text");
    (n.attr("x", t.x),
      n.attr("y", t.y),
      n.attr("class", "legend"),
      n.style("text-anchor", t.anchor),
      t.class && n.attr("class", t.class));
    const s = n.append("tspan");
    return (s.attr("x", t.x + t.textMargin * 2), s.text(r), n);
  }, "drawText"),
  y = a((e, t, r, n) => {
    const s = e.append("image");
    (s.attr("x", t), s.attr("y", r));
    const i = d.sanitizeUrl(n);
    s.attr("xlink:href", i);
  }, "drawImage"),
  x = a((e, t, r, n) => {
    const s = e.append("use");
    (s.attr("x", t), s.attr("y", r));
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
