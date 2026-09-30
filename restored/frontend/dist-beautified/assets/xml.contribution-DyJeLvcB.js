const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/xml-CxaoWy6S.js", "assets/registry-CHHSpXp3.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as i } from "./registry-CHHSpXp3.js";
import { r as n } from "./_.contribution-DfoCtOYw.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "e03c4067-455e-4797-9b2e-0dac4eb8e55a"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-e03c4067-455e-4797-9b2e-0dac4eb8e55a"));
  })();
} catch {}
n({
  id: "xml",
  extensions: [
    ".xml",
    ".xsd",
    ".dtd",
    ".ascx",
    ".csproj",
    ".config",
    ".props",
    ".targets",
    ".wxi",
    ".wxl",
    ".wxs",
    ".xaml",
    ".svg",
    ".svgz",
    ".opf",
    ".xslt",
    ".xsl",
  ],
  firstLine: "(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)",
  aliases: ["XML", "xml"],
  mimetypes: ["text/xml", "application/xml", "application/xaml+xml", "application/xml-dtd"],
  loader: () => i(() => import("./xml-CxaoWy6S.js"), __vite__mapDeps([0, 1, 2])),
});
