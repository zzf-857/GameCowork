import { ap as d, aq as a } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[n] = "38ae2e55-36e3-4c7a-bf1f-12a65a058dee"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-38ae2e55-36e3-4c7a-bf1f-12a65a058dee"));
  })();
} catch {}
const o = (e, n) => d.lang.round(a.parse(e)[n]);
export { o as c };
