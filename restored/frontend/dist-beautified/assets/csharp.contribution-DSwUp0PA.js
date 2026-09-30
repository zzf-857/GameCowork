import { aK as d } from "./registry-CHHSpXp3.js";
import { r as n } from "./_.contribution-DfoCtOYw.js";
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
      f = new e.Error().stack;
    f &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[f] = "9a725bf5-c52d-4bfa-a9f7-06ff5f59f35b"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-9a725bf5-c52d-4bfa-a9f7-06ff5f59f35b"));
  })();
} catch {}
n({
  id: "csharp",
  extensions: [".cs", ".csx", ".cake"],
  aliases: ["C#", "csharp"],
  loader: () => d(() => import("./csharp-DPWG3ykF.js"), []),
});
