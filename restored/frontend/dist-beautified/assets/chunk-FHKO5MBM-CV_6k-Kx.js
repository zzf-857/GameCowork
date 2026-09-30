import { _ as i } from "./VscTheme-B-CSeuv5.js";
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
      t = new e.Error().stack;
    t &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[t] = "bd54a905-9996-40e7-bca2-2ec46de9d84f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-bd54a905-9996-40e7-bca2-2ec46de9d84f"));
  })();
} catch {}
var d,
  s =
    ((d = class {
      constructor(t) {
        ((this.init = t), (this.records = this.init()));
      }
      reset() {
        this.records = this.init();
      }
    }),
    i(d, "ImperativeState"),
    d);
export { s as I };
