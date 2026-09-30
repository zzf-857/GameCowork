import { s as a, b as d, a as r, S as n } from "./chunk-LXBSTHXV-BtlLjU_m.js";
import { _ as i } from "./VscTheme-B-CSeuv5.js";
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
      t = new e.Error().stack;
    t &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[t] = "199b34e9-2ec5-46cc-9f6a-59d95047e1fb"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-199b34e9-2ec5-46cc-9f6a-59d95047e1fb"));
  })();
} catch {}
var u = {
  parser: r,
  get db() {
    return new n(2);
  },
  renderer: d,
  styles: a,
  init: i((e) => {
    (e.state || (e.state = {}), (e.state.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { u as diagram };
