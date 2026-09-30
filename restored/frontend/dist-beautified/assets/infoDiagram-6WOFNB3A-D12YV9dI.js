import { _ as r, B as t, ab as d, D as i, ac as s } from "./VscTheme-B-CSeuv5.js";
import { p as f } from "./treemap-75Q7IDZK-B-05wwdi.js";
import "./registry-CHHSpXp3.js";
import "./_baseUniq-B4kfiVVD.js";
import "./_basePickBy-BL7sFKyx.js";
import "./clone-CIq-NCRc.js";
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
      (e._sentryDebugIds[a] = "45eebea5-9220-4881-9e67-3f9a300855e1"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-45eebea5-9220-4881-9e67-3f9a300855e1"));
  })();
} catch {}
var g = {
    parse: r(async (e) => {
      const a = await f("info", e);
      t.debug(a);
    }, "parse"),
  },
  l = { version: s.version + "" },
  p = r(() => l.version, "getVersion"),
  u = { getVersion: p },
  b = r((e, a, o) => {
    t.debug(
      `rendering info diagram
` + e,
    );
    const n = d(a);
    (i(n, 100, 400, !0),
      n
        .append("g")
        .append("text")
        .attr("x", 100)
        .attr("y", 40)
        .attr("class", "version")
        .attr("font-size", 32)
        .style("text-anchor", "middle")
        .text(`v${o}`));
  }, "draw"),
  c = { draw: b },
  h = { parser: g, db: u, renderer: c };
export { h as diagram };
