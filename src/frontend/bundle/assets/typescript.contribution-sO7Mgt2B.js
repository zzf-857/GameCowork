const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/typescript-T8RhZlkJ.js", "assets/registry-BL-NPVNy.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as d } from "./registry-BL-NPVNy.js";
import { r as i } from "./_.contribution-BEPi9Fwm.js";
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
      t = new e.Error().stack;
    t &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[t] = "c076ac7e-cc08-4471-9cfc-7bdb2766dd3d"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c076ac7e-cc08-4471-9cfc-7bdb2766dd3d"));
  })();
} catch {}
i({
  id: "typescript",
  extensions: [".ts", ".tsx", ".cts", ".mts"],
  aliases: ["TypeScript", "ts", "typescript"],
  mimetypes: ["text/typescript"],
  loader: () => d(() => import("./typescript-T8RhZlkJ.js"), __vite__mapDeps([0, 1, 2])),
});
