import { _ as t } from "./registry-BL-NPVNy.js";
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
      f = new e.Error().stack;
    f &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[f] = "8ff19c18-463c-4eb4-980f-09572b1feee0"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-8ff19c18-463c-4eb4-980f-09572b1feee0"));
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
