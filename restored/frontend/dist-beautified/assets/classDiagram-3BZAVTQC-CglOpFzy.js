import { s, c as a, a as r, C as i } from "./chunk-JBRWN2VN-e1MqmM4p.js";
import { _ as n } from "./VscTheme-B-CSeuv5.js";
import "./chunk-GLLZNHP4-n6A-sPkM.js";
import "./chunk-WVR4S24B-CStmHTxw.js";
import "./chunk-NRVI72HA-CeqxjBWY.js";
import "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[d] = "94c3f190-7040-41b2-b03d-504c9f606157"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-94c3f190-7040-41b2-b03d-504c9f606157"));
  })();
} catch {}
var p = {
  parser: r,
  get db() {
    return new i();
  },
  renderer: a,
  styles: s,
  init: n((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { p as diagram };
