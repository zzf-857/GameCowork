import { s as a, c as d, a as r, C as i } from "./chunk-JBRWN2VN-e1MqmM4p.js";
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
      s = new e.Error().stack;
    s &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[s] = "95108040-3f28-468c-9862-5fc9f2e84c5e"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-95108040-3f28-468c-9862-5fc9f2e84c5e"));
  })();
} catch {}
var c = {
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
export { c as diagram };
