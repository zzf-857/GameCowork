const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/python-CCnKQRdB.js", "assets/registry-BL-NPVNy.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as o } from "./registry-BL-NPVNy.js";
import { r as f } from "./_.contribution-BEPi9Fwm.js";
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
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "3799942a-2994-4994-87fe-4679c8f46b66"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-3799942a-2994-4994-87fe-4679c8f46b66"));
  })();
} catch {}
f({
  id: "python",
  extensions: [".py", ".rpy", ".pyw", ".cpy", ".gyp", ".gypi"],
  aliases: ["Python", "py"],
  firstLine: "^#!/.*\\bpython[0-9.-]*\\b",
  loader: () => o(() => import("./python-CCnKQRdB.js"), __vite__mapDeps([0, 1, 2])),
});
