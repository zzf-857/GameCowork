import { s as r, c as a, a as d, C as f } from "./chunk-JBRWN2VN-C73ltaHL.js";
import { _ as i } from "./VscTheme-BExNMG_K.js";
import "./chunk-GLLZNHP4-CFc8j2Qt.js";
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
      s = new e.Error().stack;
    s &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[s] = "95108040-3f28-468c-9862-5fc9f2e84c5e"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-95108040-3f28-468c-9862-5fc9f2e84c5e"));
  })();
} catch {}
var b = {
  parser: d,
  get db() {
    return new f();
  },
  renderer: a,
  styles: r,
  init: i((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { b as diagram };
