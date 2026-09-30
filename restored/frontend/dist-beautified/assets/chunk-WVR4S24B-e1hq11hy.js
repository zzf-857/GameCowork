import { _ as f, z as o } from "./VscTheme-BExNMG_K.js";
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
      (e._sentryDebugIds[n] = "c68c6c77-f78f-43e4-a775-1cadc840daff"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c68c6c77-f78f-43e4-a775-1cadc840daff"));
  })();
} catch {}
var i = f((e, n) => {
  let d;
  return (
    n === "sandbox" && (d = o("#i" + e)),
    (n === "sandbox" ? o(d.nodes()[0].contentDocument.body) : o("body")).select(`[id="${e}"]`)
  );
}, "getDiagramElement");
export { i as g };
