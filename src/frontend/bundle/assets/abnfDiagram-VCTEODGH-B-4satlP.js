import { g as u, r as d, d as a } from "./chunk-SVP7TREG-DfEOQl8W.js";
import { p } from "./chunk-JWPE2WC7-mi7oxMEc.js";
import { _ as t, l as o } from "./registry-BL-NPVNy.js";
import { b as m, M as c } from "./cynefin-OW5HDTMX-Cm6ltTqe.js";
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
      r = new e.Error().stack;
    r &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[r] = "e0427dea-0ab9-4d81-ba14-c333089d4c0b"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-e0427dea-0ab9-4d81-ba14-c333089d4c0b"));
  })();
} catch {}
var b = m().RailroadAbnf.parser.LangiumParser,
  i = t((e) => {
    const r = e.alternatives.map(g);
    return r.length === 1 ? r[0] : { type: "choice", alternatives: r };
  }, "transformAlternation"),
  g = t((e) => {
    const r = e.elements.map(v);
    return r.length === 1 ? r[0] : { type: "sequence", elements: r };
  }, "transformConcatenation"),
  y = t((e) => {
    if (e.includes("*")) {
      const [n, s] = e.split("*"),
        l = n ? parseInt(n, 10) : 0,
        f = s ? parseInt(s, 10) : 1 / 0;
      return { min: l, max: f };
    }
    const r = parseInt(e, 10);
    return { min: r, max: r };
  }, "parseRepeat"),
  v = t((e) => {
    const r = h(e.primary);
    if (!e.repeat) return r;
    const { min: n, max: s } = y(e.repeat);
    return n === 0 && s === 1 ? { type: "optional", element: r } : { type: "repetition", element: r, min: n, max: s };
  }, "transformElement"),
  h = t((e) => {
    switch (e.$type) {
      case "AbnfStringLiteral":
        return { type: "terminal", value: e.value };
      case "AbnfNumVal":
        return { type: "terminal", value: e.value };
      case "AbnfRuleName":
        return { type: "nonterminal", name: e.name };
      case "AbnfGroup":
        return i(e.element);
      case "AbnfOptionalGroup":
        return { type: "optional", element: i(e.element) };
      default:
        throw new Error(`Unsupported ABNF primary node: ${e.$type}`);
    }
  }, "transformPrimary"),
  w = t((e) => ({ name: e.name, definition: i(e.definition) }), "transformRule"),
  A = t((e) => {
    (p(e, a), e.title && a.setTitle(e.title), e.rules.map((r) => a.addRule(w(r))));
  }, "populateDb"),
  E = {
    parse: t((e) => {
      (a.clear(), o.debug("[ABNF Parser] Starting Langium parse"));
      const r = b.parse(e);
      if (r.lexerErrors.length > 0 || r.parserErrors.length > 0) throw new c(r);
      const n = r.value;
      (o.debug("[ABNF Parser] Parsed rules:", n.rules.length), A(n), o.debug("[ABNF Parser] Parse complete"));
    }, "parse"),
    parser: { yy: a },
  },
  _ = { parser: E, db: a, renderer: d, styles: u };
export { _ as diagram };
