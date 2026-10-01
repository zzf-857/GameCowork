import { _ as r } from "./registry-BL-NPVNy.js";
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
      (e._sentryDebugIds[o] = "b359b8e2-50fc-4287-91f0-1bacfbc32219"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-b359b8e2-50fc-4287-91f0-1bacfbc32219"));
  })();
} catch {}
var b = 1;
function a() {
  if (!(typeof globalThis > "u")) return globalThis;
}
r(a, "getCaptureGlobal");
function m() {
  var e;
  return !!((e = a()) != null && e.mermaidCaptureSizes);
}
r(m, "shouldCaptureSizes");
function l() {
  return typeof location > "u" ? "browser-dev" : `${location.pathname}${location.search}`;
}
r(l, "capturedFromLocation");
function p(e, o) {
  var s, f, c;
  const n = a();
  if (!n) return;
  const t = o.node(),
    i = (s = t && "ownerSVGElement" in t ? t.ownerSVGElement : null) != null ? s : t,
    d = (f = i == null ? void 0 : i.id) != null ? f : "(unknown)";
  (c = n.mermaidCapturedSizes) != null || (n.mermaidCapturedSizes = []);
  const u = { svgId: d, sizes: e };
  (n.mermaidCapturedSizes.push(u), (n.mermaidLastCapturedSizes = u));
}
r(p, "emitCapturedSizes");
function h(e, o) {
  var t, i;
  const n = [];
  for (const d of o.nodes)
    d.isGroup || n.push({ id: d.id, width: (t = d.width) != null ? t : 0, height: (i = d.height) != null ? i : 0 });
  n.length !== 0 &&
    p({ metadata: { captureVersion: b, capturedAt: new Date().toISOString(), capturedFrom: l() }, nodes: n }, e);
}
r(h, "captureNodeSizes");
export { h as captureNodeSizes, m as shouldCaptureSizes };
