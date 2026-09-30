import { _ as f, z as d } from "./VscTheme-B-CSeuv5.js";
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
      n = new e.Error().stack;
    n &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[n] = "c68c6c77-f78f-43e4-a775-1cadc840daff"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c68c6c77-f78f-43e4-a775-1cadc840daff"));
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
