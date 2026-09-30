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
      (e._sentryDebugIds[d] = "bc1ca052-7e82-4393-8cb1-38b6983f70ee"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-bc1ca052-7e82-4393-8cb1-38b6983f70ee"));
  })();
} catch {}
o({
  id: "shell",
  extensions: [".sh", ".bash"],
  aliases: ["Shell", "sh"],
  loader: () => n(() => import("./shell-uH7pvqM-.js"), []),
});
