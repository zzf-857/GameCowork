import { i as a, j as f, k as b, l as s, m as t, o as l, q as r, r as u } from "./VscTheme-B-CSeuv5.js";
import "./registry-CHHSpXp3.js";
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
      i = new e.Error().stack;
    i &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[i] = "9297afc6-2d13-4278-a890-cf3243b30be5"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-9297afc6-2d13-4278-a890-cf3243b30be5"));
  })();
} catch {}
function g(e) {
  const { dispatch: i, tabs: d } = e;
  (i(a(!1)), f() && i(b("chat-only")));
  const n = d.find((o) => o.viewType === "tjhub");
  if (n) {
    (i(s(t)), i(l(n.id)));
    return;
  }
  (i(r()),
    i(s(t)),
    i(
      u({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        title: "Projects",
        isActive: !0,
        sessionId: t,
        viewType: "tjhub",
      }),
    ));
}
export { g as openTjhubTab };
