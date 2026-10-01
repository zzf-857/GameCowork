import { s as t, b as d, a as r, S as f } from "./chunk-IMKFNOWR-5xNtoqWY.js";
import { _ as n } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[a] = "790fd57a-aff5-4b4c-8df1-a26ba8236559"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-790fd57a-aff5-4b4c-8df1-a26ba8236559"));
  })();
} catch {}
var u = {
  parser: r,
  get db() {
    return new f(2);
  },
  renderer: d,
  styles: t,
  init: n((e) => {
    (e.state || (e.state = {}), (e.state.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { u as diagram };
