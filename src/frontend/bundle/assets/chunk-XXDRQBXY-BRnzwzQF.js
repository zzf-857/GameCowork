import { _ as f, m as n } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[d] = "58f3ae9d-59e4-4990-8a7e-f7ff4dd02d0f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-58f3ae9d-59e4-4990-8a7e-f7ff4dd02d0f"));
  })();
} catch {}
var i = f((e, d) => {
  let o;
  return (
    d === "sandbox" && (o = n("#i" + e)),
    (d === "sandbox" ? n(o.nodes()[0].contentDocument.body) : n("body")).select(`[id="${e}"]`)
  );
}, "getDiagramElement");
export { i as g };
