import { s as d, c as s, a as r, C as i } from "./chunk-TICWLB2K-ChwGtA5R.js";
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
      a = new e.Error().stack;
    a &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[a] = "927d7791-0315-48b1-9ffa-7b0cc2e26a9b"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-927d7791-0315-48b1-9ffa-7b0cc2e26a9b"));
  })();
} catch {}
var p = {
  parser: r,
  get db() {
    return new i();
  },
  renderer: s,
  styles: d,
  init: n((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { p as diagram };
