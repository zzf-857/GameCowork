import { b as f } from "./_baseUniq-C9v6YMLn.js";
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
      (e._sentryDebugIds[n] = "4e3598f1-0fa6-449a-9b44-90086cc5c98c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-4e3598f1-0fa6-449a-9b44-90086cc5c98c"));
  })();
} catch {}
var d = 4;
function i(e) {
  return f(e, d);
}
export { i as c };
