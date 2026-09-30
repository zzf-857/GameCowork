import { ap as d, aq as f } from "./registry-BL-NPVNy.js";
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
      (e._sentryDebugIds[n] = "38ae2e55-36e3-4c7a-bf1f-12a65a058dee"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-38ae2e55-36e3-4c7a-bf1f-12a65a058dee"));
  })();
} catch {}
const a = (e, n) => d.lang.round(f.parse(e)[n]);
export { a as c };
