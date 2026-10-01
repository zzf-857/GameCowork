import { _ as n, l as r, I as o, e as s } from "./registry-CHHSpXp3.js";
import { p as i } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      r.debug(a);
    }, "parse"),
  },
  g = { version: "11.17.2" },
  l = n(() => g.version, "getVersion"),
  p = { getVersion: l },
  b = n((e, a, t) => {
    r.debug(
      `rendering info diagram
` + e,
    );
    const d = o(a);
    (s(d, 100, 400, !0),
      d
        .append("g")
        .append("text")
        .attr("x", 100)
        .attr("y", 40)
        .attr("class", "version")
        .attr("font-size", 32)
        .style("text-anchor", "middle")
        .text(`v${t}`));
  }, "draw"),
  u = { draw: b },
  w = { parser: f, db: p, renderer: u };
export { w as diagram };
