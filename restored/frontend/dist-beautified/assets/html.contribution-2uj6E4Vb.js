const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/html-DHeuDzeg.js", "assets/registry-BL-NPVNy.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as d } from "./registry-BL-NPVNy.js";
import { r as n } from "./_.contribution-BEPi9Fwm.js";
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
      (e._sentryDebugIds[t] = "3ead14ed-032f-4b60-b004-837a3c25aab7"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-3ead14ed-032f-4b60-b004-837a3c25aab7"));
  })();
} catch {}
n({
  id: "html",
  extensions: [".html", ".htm", ".shtml", ".xhtml", ".mdoc", ".jsp", ".asp", ".aspx", ".jshtm"],
  aliases: ["HTML", "htm", "html", "xhtml"],
  mimetypes: ["text/html", "text/x-jshtm", "text/template", "text/ng-template"],
  loader: () => d(() => import("./html-DHeuDzeg.js"), __vite__mapDeps([0, 1, 2])),
});
