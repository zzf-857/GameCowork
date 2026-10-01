import { s as a, b as d, a as r, S as f } from "./chunk-IMKFNOWR-DlDvO2yo.js";
import { _ as n } from "./registry-BL-NPVNy.js";
import "./chunk-XXDRQBXY-2Z0xbgBy.js";
import "./chunk-POPQ4Y6H-BzHSvZYn.js";
import "./chunk-F27PBJKO-iDQskvIx.js";
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
      t = new e.Error().stack;
    t &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[t] = "790fd57a-aff5-4b4c-8df1-a26ba8236559"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-790fd57a-aff5-4b4c-8df1-a26ba8236559"));
  })();
} catch {}
var u = {
  parser: r,
  get db() {
    return new f(2);
  },
  renderer: d,
  styles: a,
  init: n((e) => {
    (e.state || (e.state = {}), (e.state.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { u as diagram };
