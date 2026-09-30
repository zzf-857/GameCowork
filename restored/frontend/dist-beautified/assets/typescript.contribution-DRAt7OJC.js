const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/typescript-oQI-5BfB.js", "assets/registry-CHHSpXp3.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as t } from "./registry-CHHSpXp3.js";
import { r as i } from "./_.contribution-DfoCtOYw.js";
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
      (e._sentryDebugIds[d] = "c076ac7e-cc08-4471-9cfc-7bdb2766dd3d"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c076ac7e-cc08-4471-9cfc-7bdb2766dd3d"));
  })();
} catch {}
i({
  id: "typescript",
  extensions: [".ts", ".tsx", ".cts", ".mts"],
  aliases: ["TypeScript", "ts", "typescript"],
  mimetypes: ["text/typescript"],
  loader: () => t(() => import("./typescript-oQI-5BfB.js"), __vite__mapDeps([0, 1, 2])),
});
