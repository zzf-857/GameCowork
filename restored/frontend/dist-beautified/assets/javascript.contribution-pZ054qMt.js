const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/javascript-BSWItIaE.js",
      "assets/typescript-oQI-5BfB.js",
      "assets/registry-CHHSpXp3.js",
      "assets/registry-D9yfq9uG.css",
    ]),
) => i.map((i) => d[i]);
import { aK as i } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[d] = "b4bfb7fe-76a2-4fc4-8514-5500d8bfd7dc"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-b4bfb7fe-76a2-4fc4-8514-5500d8bfd7dc"));
  })();
} catch {}
f({
  id: "javascript",
  extensions: [".js", ".es6", ".jsx", ".mjs", ".cjs"],
  firstLine: "^#!.*\\bnode",
  filenames: ["jakefile"],
  aliases: ["JavaScript", "javascript", "js"],
  mimetypes: ["text/javascript"],
  loader: () => i(() => import("./javascript-BSWItIaE.js"), __vite__mapDeps([0, 1, 2, 3])),
});
