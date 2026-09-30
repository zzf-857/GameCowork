const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/yaml-F8Bq-L5n.js", "assets/registry-BL-NPVNy.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as n } from "./registry-BL-NPVNy.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "ea947c40-77f1-427d-acc0-2ccfd259913c"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-ea947c40-77f1-427d-acc0-2ccfd259913c"));
  })();
} catch {}
i({
  id: "yaml",
  extensions: [".yaml", ".yml"],
  aliases: ["YAML", "yaml", "YML", "yml"],
  mimetypes: ["application/x-yaml", "text/x-yaml"],
  loader: () => n(() => import("./yaml-F8Bq-L5n.js"), __vite__mapDeps([0, 1, 2])),
});
