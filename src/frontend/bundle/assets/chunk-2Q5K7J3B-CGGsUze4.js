import { _ as d } from "./registry-CHHSpXp3.js";
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
      i = new e.Error().stack;
    i &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[i] = "23917cec-c5c9-4a43-af2f-6d65a50b893a"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-23917cec-c5c9-4a43-af2f-6d65a50b893a"));
  })();
} catch {}
var t,
  a =
    ((t = class {
      constructor(i) {
        ((this.init = i), (this.records = this.init()));
      }
      reset() {
        this.records = this.init();
      }
    }),
    d(t, "ImperativeState"),
    t);
export { a as I };
