import { s, c as r, a as d, C as i } from "./chunk-TICWLB2K-BLuzT32u.js";
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
      a = new e.Error().stack;
    a &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[a] = "927d7791-0315-48b1-9ffa-7b0cc2e26a9b"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-927d7791-0315-48b1-9ffa-7b0cc2e26a9b"));
  })();
} catch {}
var c = {
  parser: d,
  get db() {
    return new i();
  },
  renderer: r,
  styles: s,
  init: n((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { c as diagram };
