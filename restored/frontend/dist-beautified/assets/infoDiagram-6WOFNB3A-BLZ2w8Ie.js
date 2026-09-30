import { _ as r, B as t, ab as i, D as s, ac as d } from "./VscTheme-BExNMG_K.js";
import { p as f } from "./treemap-75Q7IDZK-Bp3sVUNO.js";
import "./registry-BL-NPVNy.js";
import "./_baseUniq-C9v6YMLn.js";
import "./_basePickBy-Cjj3jB3s.js";
import "./clone-DJH302tV.js";
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
  l = { version: d.version + "" },
  p = r(() => l.version, "getVersion"),
  u = { getVersion: p },
  b = r((e, a, o) => {
    t.debug(
      `rendering info diagram
` + e,
    );
    const n = i(a);
    (s(n, 100, 400, !0),
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
