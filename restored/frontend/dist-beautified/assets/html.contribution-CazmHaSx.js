const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/html-DIJv7wUR.js", "assets/registry-CHHSpXp3.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as d } from "./registry-CHHSpXp3.js";
import { r as a } from "./_.contribution-DfoCtOYw.js";
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
      (e._sentryDebugIds[t] = "3ead14ed-032f-4b60-b004-837a3c25aab7"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-3ead14ed-032f-4b60-b004-837a3c25aab7"));
  })();
} catch {}
a({
  id: "html",
  extensions: [".html", ".htm", ".shtml", ".xhtml", ".mdoc", ".jsp", ".asp", ".aspx", ".jshtm"],
  aliases: ["HTML", "htm", "html", "xhtml"],
  mimetypes: ["text/html", "text/x-jshtm", "text/template", "text/ng-template"],
  loader: () => d(() => import("./html-DIJv7wUR.js"), __vite__mapDeps([0, 1, 2])),
});
