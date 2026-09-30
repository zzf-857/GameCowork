import { aK as n } from "./registry-BL-NPVNy.js";
import { r as o } from "./_.contribution-BEPi9Fwm.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "cc22d2d4-0562-45cc-87a0-8943079a503c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-cc22d2d4-0562-45cc-87a0-8943079a503c"));
  })();
} catch {}
o({ id: "go", extensions: [".go"], aliases: ["Go"], loader: () => n(() => import("./go-CDNSJfIU.js"), []) });
