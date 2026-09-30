import { aK as n } from "./registry-CHHSpXp3.js";
import { r as f } from "./_.contribution-DfoCtOYw.js";
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
      (e._sentryDebugIds[d] = "5a1f5258-8192-4b29-953e-810046f67b4f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-5a1f5258-8192-4b29-953e-810046f67b4f"));
  })();
} catch {}
f({
  id: "css",
  extensions: [".css"],
  aliases: ["CSS", "css"],
  mimetypes: ["text/css"],
  loader: () => n(() => import("./css-DMQx7HAp.js"), []),
});
