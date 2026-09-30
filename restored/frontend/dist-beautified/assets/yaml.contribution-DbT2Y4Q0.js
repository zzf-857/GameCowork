const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/yaml-5ZwimV5W.js", "assets/registry-CHHSpXp3.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
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
      (e._sentryDebugIds[d] = "ea947c40-77f1-427d-acc0-2ccfd259913c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-ea947c40-77f1-427d-acc0-2ccfd259913c"));
  })();
} catch {}
a({
  id: "yaml",
  extensions: [".yaml", ".yml"],
  aliases: ["YAML", "yaml", "YML", "yml"],
  mimetypes: ["application/x-yaml", "text/x-yaml"],
  loader: () => n(() => import("./yaml-5ZwimV5W.js"), __vite__mapDeps([0, 1, 2])),
});
