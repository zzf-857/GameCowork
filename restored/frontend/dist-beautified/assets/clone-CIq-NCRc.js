import { b as d } from "./_baseUniq-B4kfiVVD.js";
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
      (e._sentryDebugIds[n] = "4e3598f1-0fa6-449a-9b44-90086cc5c98c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-4e3598f1-0fa6-449a-9b44-90086cc5c98c"));
  })();
} catch {}
var f = 4;
function i(e) {
  return d(e, f);
}
export { i as c };
