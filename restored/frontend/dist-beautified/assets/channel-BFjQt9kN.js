import { a3 as d, a4 as f } from "./VscTheme-B-CSeuv5.js";
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
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "336f92ab-3bf7-49b0-8687-a25697495e18"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-336f92ab-3bf7-49b0-8687-a25697495e18"));
  })();
} catch {}
const a = (e, n) => d.lang.round(f.parse(e)[n]);
export { a as c };
