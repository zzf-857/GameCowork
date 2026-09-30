const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/javascript-DZN94MNg.js",
      "assets/typescript-T8RhZlkJ.js",
      "assets/registry-BL-NPVNy.js",
      "assets/registry-D9yfq9uG.css",
    ]),
) => i.map((i) => d[i]);
import { aK as f } from "./registry-BL-NPVNy.js";
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
      (e._sentryDebugIds[d] = "b4bfb7fe-76a2-4fc4-8514-5500d8bfd7dc"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-b4bfb7fe-76a2-4fc4-8514-5500d8bfd7dc"));
  })();
} catch {}
i({
  id: "javascript",
  extensions: [".js", ".es6", ".jsx", ".mjs", ".cjs"],
  firstLine: "^#!.*\\bnode",
  filenames: ["jakefile"],
  aliases: ["JavaScript", "javascript", "js"],
  mimetypes: ["text/javascript"],
  loader: () => f(() => import("./javascript-DZN94MNg.js"), __vite__mapDeps([0, 1, 2, 3])),
});
