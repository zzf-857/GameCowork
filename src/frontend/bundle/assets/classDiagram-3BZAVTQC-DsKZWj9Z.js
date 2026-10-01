import { s as r, c as a, a as d, C as i } from "./chunk-JBRWN2VN-C73ltaHL.js";
import { _ as n } from "./VscTheme-BExNMG_K.js";
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
      (e._sentryDebugIds[s] = "94c3f190-7040-41b2-b03d-504c9f606157"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-94c3f190-7040-41b2-b03d-504c9f606157"));
  })();
} catch {}
var c = {
  parser: d,
  get db() {
    return new i();
  },
  renderer: a,
  styles: r,
  init: n((e) => {
    (e.class || (e.class = {}), (e.class.arrowMarkerAbsolute = e.arrowMarkerAbsolute));
  }, "init"),
};
export { c as diagram };
