import { a3 as f, a4 as d } from "./VscTheme-BExNMG_K.js";
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
      (e._sentryDebugIds[n] = "336f92ab-3bf7-49b0-8687-a25697495e18"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-336f92ab-3bf7-49b0-8687-a25697495e18"));
  })();
} catch {}
const a = (e, n) => f.lang.round(d.parse(e)[n]);
export { a as c };
