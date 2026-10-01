import { s as a, b as r, a as d, S as n } from "./chunk-LXBSTHXV-u8t2AoyC.js";
import { _ as i } from "./VscTheme-BExNMG_K.js";
import "./chunk-WVR4S24B-e1hq11hy.js";
import "./chunk-NRVI72HA-Dc8s2S3s.js";
import "./registry-BL-NPVNy.js";
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
      (e._sentryDebugIds[t] = "199b34e9-2ec5-46cc-9f6a-59d95047e1fb"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-199b34e9-2ec5-46cc-9f6a-59d95047e1fb"));
  })();
} catch {}
var u = {
  parser: d,
  get db() {
    return new n(2);
  },
  renderer: r,
  styles: a,
  init: i((e) => {
    (e.state || (e.state = {}), (e.state.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { u as diagram };
