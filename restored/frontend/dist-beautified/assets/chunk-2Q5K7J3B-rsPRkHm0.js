import { _ as n } from "./registry-BL-NPVNy.js";
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
      i = new e.Error().stack;
    i &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[i] = "23917cec-c5c9-4a43-af2f-6d65a50b893a"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-23917cec-c5c9-4a43-af2f-6d65a50b893a"));
  })();
} catch {}
var t,
  f =
    ((t = class {
      constructor(i) {
        ((this.init = i), (this.records = this.init()));
      }
      reset() {
        this.records = this.init();
      }
    }),
    n(t, "ImperativeState"),
    t);
export { f as I };
