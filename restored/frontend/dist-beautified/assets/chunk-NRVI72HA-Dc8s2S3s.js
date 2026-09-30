import { _ as d, D as c, B as l } from "./VscTheme-BExNMG_K.js";
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
      (e._sentryDebugIds[t] = "59fcd74c-3f13-43ce-91ef-3dfc839867a8"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-59fcd74c-3f13-43ce-91ef-3dfc839867a8"));
  })();
} catch {}
var g = d((e, t, i, o) => {
    e.attr("class", i);
    const { width: n, height: f, x: a, y: s } = u(e, t);
    c(e, f, n, o);
    const r = w(a, s, n, f, t);
    (e.attr("viewBox", r), l.debug(`viewBox configured: ${r} with padding: ${t}`));
  }, "setupViewPortForSVG"),
  u = d((e, t) => {
    var o;
    const i = ((o = e.node()) == null ? void 0 : o.getBBox()) || { width: 0, height: 0, x: 0, y: 0 };
    return { width: i.width + t * 2, height: i.height + t * 2, x: i.x, y: i.y };
  }, "calculateDimensionsWithPadding"),
  w = d((e, t, i, o, n) => `${e - n} ${t - n} ${i} ${o}`, "createViewBox");
export { g as s };
