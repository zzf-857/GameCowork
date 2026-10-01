import { _ as d } from "./VscTheme-BExNMG_K.js";
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
      (e._sentryDebugIds[i] = "bd54a905-9996-40e7-bca2-2ec46de9d84f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-bd54a905-9996-40e7-bca2-2ec46de9d84f"));
  })();
} catch {}
var t,
  s =
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
export { s as I };
