import { c as a, s as d } from "./flowDiagram-HODETNUW-DAxKPldP.js";
import { _ as o } from "./registry-CHHSpXp3.js";
import "./chunk-5VM5RSS4-CMazv4IF.js";
import "./chunk-XXDRQBXY-BRnzwzQF.js";
import "./chunk-POPQ4Y6H-s3peuQj9.js";
import "./chunk-F27PBJKO-CJ7K7epz.js";
import "./channel-UB20JhvW.js";
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
      (e._sentryDebugIds[t] = "480141a3-ca5a-486b-ac7d-e170605c43a0"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-480141a3-ca5a-486b-ac7d-e170605c43a0"));
  })();
} catch {}
var n = o(
    (e) => `${d(e)}
  .swimlane.cluster rect {
    stroke: ${e.clusterBorder} !important;
  }
  [data-look="neo"].cluster rect {
    filter: none;
  }
`,
    "getStyles",
  ),
  r = n,
  g = a({ defaultLayout: "swimlane", styles: r });
export { g as diagram };
