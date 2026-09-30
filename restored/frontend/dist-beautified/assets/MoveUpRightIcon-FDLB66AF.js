import { j as n } from "./registry-BL-NPVNy.js";
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
      o = new e.Error().stack;
    o &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[o] = "100d5885-6f87-4597-88c3-68622ea1ab25"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-100d5885-6f87-4597-88c3-68622ea1ab25"));
  })();
} catch {}
function r(e) {
  return n.jsx("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...e,
    children: n.jsx("path", {
      d: "M6.75 13.5L11.25 9L6.75 4.5",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  });
}
function i(e) {
  return n.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...e,
    children: n.jsx("path", {
      d: "M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M11.3333 6.66667L8 10L4.66667 6.66667M8 10V2",
      stroke: "currentColor",
      strokeWidth: "1.33333",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  });
}
function d(e) {
  return n.jsx("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...e,
    children: n.jsx("path", {
      d: "M12.6666 7.33337V3.33337H8.66659M12.6666 3.33337L3.33325 12.6667",
      stroke: "currentColor",
      "stroke-width": "1.33333",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  });
}
export { r as C, i as D, d as M };
