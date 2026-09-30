import { s as a, c as d, a as r, C as i } from "./chunk-TICWLB2K-BLuzT32u.js";
import { _ as n } from "./registry-BL-NPVNy.js";
import "./chunk-5VM5RSS4-C8njHi2S.js";
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
      s = new e.Error().stack;
    s &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[s] = "88e00e96-ff46-47db-ace0-db9068832bb6"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-88e00e96-ff46-47db-ace0-db9068832bb6"));
  })();
} catch {}
var p = {
  parser: r,
  get db() {
    return new i();
  },
  renderer: d,
  styles: a,
  init: n((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { p as diagram };
