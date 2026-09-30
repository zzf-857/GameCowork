import { g as l, r as s, d as n } from "./chunk-SVP7TREG-BxLYyp2_.js";
import { p as d } from "./chunk-JWPE2WC7-CKTugQKa.js";
import { _ as t, l as o } from "./registry-CHHSpXp3.js";
import { c as p, M as f } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      r = new e.Error().stack;
    r &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[r] = "65d35393-339f-4c38-a663-fb8d897c6e62"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-65d35393-339f-4c38-a663-fb8d897c6e62"));
  })();
} catch {}
var u = p().Railroad.parser.LangiumParser,
  a = t((e) => {
    switch (e.$type) {
      case "RailroadTerminalExpr":
        return { type: "terminal", value: e.value };
      case "RailroadNonTerminalExpr":
        return { type: "nonterminal", name: e.name };
      case "RailroadSpecialExpr":
        return { type: "special", text: e.text };
      case "RailroadSequenceExpr": {
        const r = e.elements.map(a);
        return r.length === 1 ? r[0] : { type: "sequence", elements: r };
      }
      case "RailroadChoiceExpr": {
        const r = e.alternatives.map(a);
        return r.length === 1 ? r[0] : { type: "choice", alternatives: r };
      }
      case "RailroadOptionalExpr":
        return { type: "optional", element: a(e.element) };
      case "RailroadOneOrMoreExpr":
        return { type: "repetition", element: a(e.element), min: 1, max: 1 / 0 };
      case "RailroadZeroOrMoreExpr":
        return { type: "repetition", element: a(e.element), min: 0, max: 1 / 0 };
      default:
        throw new Error(`Unsupported railroad expression: ${e.$type}`);
    }
  }, "transformExpression"),
  m = t((e) => ({ name: e.name, definition: a(e.definition) }), "transformRule"),
  c = t((e) => {
    (d(e, n), e.title && n.setTitle(e.title), e.rules.map((r) => n.addRule(m(r))));
  }, "populateDb"),
  y = {
    parse: t((e) => {
      (n.clear(), o.debug("[Railroad Parser] Starting Langium parse"));
      const r = u.parse(e);
      if (r.lexerErrors.length > 0 || r.parserErrors.length > 0) throw new f(r);
      const i = r.value;
      (o.debug("[Railroad Parser] Parsed rules:", i.rules.length), c(i), o.debug("[Railroad Parser] Parse complete"));
    }, "parse"),
    parser: { yy: n },
  },
  h = { parser: y, db: n, renderer: s, styles: l };
export { h as diagram };
