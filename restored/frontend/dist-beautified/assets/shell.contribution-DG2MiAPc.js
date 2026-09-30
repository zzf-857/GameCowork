import { aK as d } from "./registry-BL-NPVNy.js";
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
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "bc1ca052-7e82-4393-8cb1-38b6983f70ee"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-bc1ca052-7e82-4393-8cb1-38b6983f70ee"));
  })();
} catch {}
o({
  id: "shell",
  extensions: [".sh", ".bash"],
  aliases: ["Shell", "sh"],
  loader: () => d(() => import("./shell-ClWJPgEH.js"), []),
});
