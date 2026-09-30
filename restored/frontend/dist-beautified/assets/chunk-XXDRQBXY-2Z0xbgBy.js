import { _ as f, m as d } from "./registry-BL-NPVNy.js";
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
      (e._sentryDebugIds[n] = "58f3ae9d-59e4-4990-8a7e-f7ff4dd02d0f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-58f3ae9d-59e4-4990-8a7e-f7ff4dd02d0f"));
  })();
} catch {}
var i = f((e, n) => {
  let o;
  return (
    n === "sandbox" && (o = d("#i" + e)),
    (n === "sandbox" ? d(o.nodes()[0].contentDocument.body) : d("body")).select(`[id="${e}"]`)
  );
}, "getDiagramElement");
export { i as g };
