import { _ as d, e as l, l as u } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[t] = "c0623d39-541f-4ac3-bb72-47003f113e95"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-c0623d39-541f-4ac3-bb72-47003f113e95"));
  })();
} catch {}
var b = d((e, t, i, o) => {
    e.attr("class", i);
    const { width: n, height: a, x: r, y: s } = c(e, t);
    l(e, a, n, o);
    const f = w(r, s, n, a, t);
    (e.attr("viewBox", f), u.debug(`viewBox configured: ${f} with padding: ${t}`));
  }, "setupViewPortForSVG"),
  c = d((e, t) => {
    var o;
    const i = ((o = e.node()) == null ? void 0 : o.getBBox()) || { width: 0, height: 0, x: 0, y: 0 };
    return { width: i.width + t * 2, height: i.height + t * 2, x: i.x, y: i.y };
  }, "calculateDimensionsWithPadding"),
  w = d((e, t, i, o, n) => `${e - n} ${t - n} ${i} ${o}`, "createViewBox");
export { b as s };
