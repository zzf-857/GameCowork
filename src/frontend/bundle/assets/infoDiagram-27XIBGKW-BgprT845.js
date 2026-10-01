import { _ as n, l as d, I as o, e as s } from "./registry-BL-NPVNy.js";
import { p as i } from "./cynefin-OW5HDTMX-Cm6ltTqe.js";
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
      a = new e.Error().stack;
    a &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[a] = "bace78b3-590e-4d00-a0d6-aa343476eade"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-bace78b3-590e-4d00-a0d6-aa343476eade"));
  })();
} catch {}
var f = {
    parse: n(async (e) => {
      const a = await i("info", e);
      d.debug(a);
    }, "parse"),
  },
  g = { version: "11.17.2" },
  l = n(() => g.version, "getVersion"),
  p = { getVersion: l },
  b = n((e, a, t) => {
    d.debug(
      `rendering info diagram
` + e,
    );
    const r = o(a);
    (s(r, 100, 400, !0),
      r
        .append("g")
        .append("text")
        .attr("x", 100)
        .attr("y", 40)
        .attr("class", "version")
        .attr("font-size", 32)
        .style("text-anchor", "middle")
        .text(`v${t}`));
  }, "draw"),
  c = { draw: b },
  w = { parser: f, db: p, renderer: c };
export { w as diagram };
