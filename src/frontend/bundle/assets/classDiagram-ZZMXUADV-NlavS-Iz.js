import { s as a, c as s, a as r, C as i } from "./chunk-TICWLB2K-ChwGtA5R.js";
import { _ as n } from "./registry-CHHSpXp3.js";
import "./chunk-5VM5RSS4-CMazv4IF.js";
import "./chunk-XXDRQBXY-BRnzwzQF.js";
import "./chunk-POPQ4Y6H-s3peuQj9.js";
import "./chunk-F27PBJKO-CJ7K7epz.js";
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
      (e._sentryDebugIds[d] = "88e00e96-ff46-47db-ace0-db9068832bb6"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-88e00e96-ff46-47db-ace0-db9068832bb6"));
  })();
} catch {}
var p = {
  parser: r,
  get db() {
    return new i();
  },
  renderer: s,
  styles: a,
  init: n((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { p as diagram };
