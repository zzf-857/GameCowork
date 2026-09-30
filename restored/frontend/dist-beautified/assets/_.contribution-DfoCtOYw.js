import { aM as t } from "./registry-CHHSpXp3.js";
(function () {
  var a =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  a.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
})();
try {
  (function () {
    var a =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      e = new a.Error().stack;
    e &&
      ((a._sentryDebugIds = a._sentryDebugIds || {}),
      (a._sentryDebugIds[e] = "16cdbf5b-d3a1-4f05-98de-3f32eb0fdbbc"),
      (a._sentryDebugIdIdentifier = "sentry-dbid-16cdbf5b-d3a1-4f05-98de-3f32eb0fdbbc"));
  })();
} catch {}
const s = {},
  d = {};
class i {
  static getOrCreate(e) {
    return (d[e] || (d[e] = new i(e)), d[e]);
  }
  constructor(e) {
    ((this._languageId = e),
      (this._loadingTriggered = !1),
      (this._lazyLoadPromise = new Promise((o, n) => {
        ((this._lazyLoadPromiseResolve = o), (this._lazyLoadPromiseReject = n));
      })));
  }
  load() {
    return (
      this._loadingTriggered ||
        ((this._loadingTriggered = !0),
        s[this._languageId].loader().then(
          (e) => this._lazyLoadPromiseResolve(e),
          (e) => this._lazyLoadPromiseReject(e),
        )),
      this._lazyLoadPromise
    );
  }
}
function g(a) {
  const e = a.id;
  ((s[e] = a), t.register(a));
  const o = i.getOrCreate(e);
  (t.registerTokensProviderFactory(e, { create: async () => (await o.load()).language }),
    t.onLanguageEncountered(e, async () => {
      const n = await o.load();
      t.setLanguageConfiguration(e, n.conf);
    }));
}
export { g as r };
