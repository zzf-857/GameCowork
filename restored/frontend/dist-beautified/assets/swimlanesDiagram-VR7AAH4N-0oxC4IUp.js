import { c as a, s as o } from "./flowDiagram-HODETNUW-BO4Ik9Rr.js";
import { _ as n } from "./registry-BL-NPVNy.js";
import "./chunk-5VM5RSS4-C8njHi2S.js";
import "./chunk-XXDRQBXY-2Z0xbgBy.js";
import "./chunk-POPQ4Y6H-BzHSvZYn.js";
import "./chunk-F27PBJKO-iDQskvIx.js";
import "./channel-0rJEtiuR.js";
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
      (e._sentryDebugIds[t] = "480141a3-ca5a-486b-ac7d-e170605c43a0"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-480141a3-ca5a-486b-ac7d-e170605c43a0"));
  })();
} catch {}
var r = n(
    (e) => `${o(e)}
  .swimlane.cluster rect {
    stroke: ${e.clusterBorder} !important;
  }
  [data-look="neo"].cluster rect {
    filter: none;
  }
`,
    "getStyles",
  ),
  d = r,
  b = a({ defaultLayout: "swimlane", styles: d });
export { b as diagram };
