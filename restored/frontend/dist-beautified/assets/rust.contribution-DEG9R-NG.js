import { aK as n } from "./registry-CHHSpXp3.js";
import { r as a } from "./_.contribution-DfoCtOYw.js";
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
      (e._sentryDebugIds[d] = "731a255a-9e53-4c23-af91-63b057e0f9ba"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-731a255a-9e53-4c23-af91-63b057e0f9ba"));
  })();
} catch {}
a({
  id: "rust",
  extensions: [".rs", ".rlib"],
  aliases: ["Rust", "rust"],
  loader: () => n(() => import("./rust-CS0wt5oL.js"), []),
});
