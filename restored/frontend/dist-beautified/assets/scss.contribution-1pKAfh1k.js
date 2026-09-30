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
      s = new e.Error().stack;
    s &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[s] = "e940ba6b-fe74-42ed-8f2a-ccbf9403ad3d"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-e940ba6b-fe74-42ed-8f2a-ccbf9403ad3d"));
  })();
} catch {}
n({
  id: "scss",
  extensions: [".scss"],
  aliases: ["Sass", "sass", "scss"],
  mimetypes: ["text/x-scss", "text/scss"],
  loader: () => d(() => import("./scss-41zrjyMu.js"), []),
});
