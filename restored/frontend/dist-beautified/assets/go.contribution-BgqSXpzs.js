import { aK as n } from "./registry-CHHSpXp3.js";
import { r as o } from "./_.contribution-DfoCtOYw.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "cc22d2d4-0562-45cc-87a0-8943079a503c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-cc22d2d4-0562-45cc-87a0-8943079a503c"));
  })();
} catch {}
o({ id: "go", extensions: [".go"], aliases: ["Go"], loader: () => n(() => import("./go-DiBsMeUf.js"), []) });
