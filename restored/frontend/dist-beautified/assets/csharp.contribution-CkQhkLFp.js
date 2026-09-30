import { aK as d } from "./registry-BL-NPVNy.js";
import { r as n } from "./_.contribution-BEPi9Fwm.js";
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
  loader: () => d(() => import("./csharp-BbQLP7Cn.js"), []),
});
