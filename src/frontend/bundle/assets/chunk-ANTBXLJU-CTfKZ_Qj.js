import { _ as t } from "./VscTheme-B-CSeuv5.js";
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
      f = new e.Error().stack;
    f &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[f] = "2ff13a6d-c574-4ac9-9fb5-8d3ecbde1f6b"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-2ff13a6d-c574-4ac9-9fb5-8d3ecbde1f6b"));
  })();
} catch {}
function c(e, f) {
  var n, i, o;
  (e.accDescr && ((n = f.setAccDescription) == null || n.call(f, e.accDescr)),
    e.accTitle && ((i = f.setAccTitle) == null || i.call(f, e.accTitle)),
    e.title && ((o = f.setDiagramTitle) == null || o.call(f, e.title)));
}
t(c, "populateCommonDb");
export { c as p };
