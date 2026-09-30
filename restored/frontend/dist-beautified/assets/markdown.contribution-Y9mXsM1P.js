import { aK as n } from "./registry-BL-NPVNy.js";
import { r as o } from "./_.contribution-BEPi9Fwm.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "d3b57b17-29f8-4fd2-b00e-a50c5ac18df9"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-d3b57b17-29f8-4fd2-b00e-a50c5ac18df9"));
  })();
} catch {}
o({
  id: "markdown",
  extensions: [".md", ".markdown", ".mdown", ".mkdn", ".mkd", ".mdwn", ".mdtxt", ".mdtext"],
  aliases: ["Markdown", "markdown"],
  loader: () => n(() => import("./markdown-DCmFEgGL.js"), []),
});
