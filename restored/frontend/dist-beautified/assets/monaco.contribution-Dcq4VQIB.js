const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["assets/jsonMode-CaNUkgyL.js", "assets/registry-CHHSpXp3.js", "assets/registry-D9yfq9uG.css"]),
) => i.map((i) => d[i]);
import { aK as a, aL as r, aM as n } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[t] = "316f8772-dcae-4b6e-91c6-77686917cca9"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-316f8772-dcae-4b6e-91c6-77686917cca9"));
  })();
} catch {}
class d {
  constructor(t, i, s) {
    ((this._onDidChange = new r()),
      (this._languageId = t),
      this.setDiagnosticsOptions(i),
      this.setModeConfiguration(s));
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  get languageId() {
    return this._languageId;
  }
  get modeConfiguration() {
    return this._modeConfiguration;
  }
  get diagnosticsOptions() {
    return this._diagnosticsOptions;
  }
  setDiagnosticsOptions(t) {
    ((this._diagnosticsOptions = t || Object.create(null)), this._onDidChange.fire(this));
  }
  setModeConfiguration(t) {
    ((this._modeConfiguration = t || Object.create(null)), this._onDidChange.fire(this));
  }
}
const g = {
    validate: !0,
    allowComments: !0,
    schemas: [],
    enableSchemaRequest: !1,
    schemaRequest: "warning",
    schemaValidation: "warning",
    comments: "error",
    trailingCommas: "error",
  },
  u = {
    documentFormattingEdits: !0,
    documentRangeFormattingEdits: !0,
    completionItems: !0,
    hovers: !0,
    documentSymbols: !0,
    tokens: !0,
    colors: !0,
    foldingRanges: !0,
    diagnostics: !0,
    selectionRanges: !0,
  },
  c = new d("json", g, u),
  f = () => o().then((e) => e.getWorker());
function o() {
  return a(() => import("./jsonMode-CaNUkgyL.js"), __vite__mapDeps([0, 1, 2]));
}
n.register({
  id: "json",
  extensions: [".json", ".bowerrc", ".jshintrc", ".jscsrc", ".eslintrc", ".babelrc", ".har"],
  aliases: ["JSON", "json"],
  mimetypes: ["application/json"],
});
n.onLanguage("json", () => {
  o().then((e) => e.setupMode(c));
});
export { f as getWorker, c as jsonDefaults };
