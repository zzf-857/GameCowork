import { g as l, r as f, d as n } from "./chunk-SVP7TREG-BxLYyp2_.js";
import { p as u } from "./chunk-JWPE2WC7-CKTugQKa.js";
import { _ as t, l as o } from "./registry-CHHSpXp3.js";
import { a as p, M as d } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      (e._sentryDebugIds[r] = "f10c3e1e-0df3-4ad9-8d57-06449c29c99b"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-f10c3e1e-0df3-4ad9-8d57-06449c29c99b"));
  })();
} catch {}
var m = p().RailroadEbnf.parser.LangiumParser,
  s = t((e) => {
    const r = e.alternatives.map(c);
    return r.length === 1 ? r[0] : { type: "choice", alternatives: r };
  }, "transformChoice"),
  c = t((e) => {
    const r = e.elements.map(y);
    return r.length === 1 ? r[0] : { type: "sequence", elements: r };
  }, "transformSequence"),
  i = t((e) => {
    switch (e.$type) {
      case "EbnfTerminal":
        return { type: "terminal", value: e.value };
      case "EbnfNonTerminal":
        return { type: "nonterminal", name: e.name };
      case "EbnfSpecial":
        return { type: "special", text: e.text };
      case "EbnfGroup":
        return s(e.element);
      case "EbnfOptional":
        return { type: "optional", element: s(e.element) };
      case "EbnfRepetition":
        return { type: "repetition", element: s(e.element), min: 0, max: 1 / 0 };
      default:
        throw new Error(`Unsupported EBNF primary node: ${e.$type}`);
    }
  }, "transformPrimary"),
  b = t((e, r) => {
    switch (r.$type) {
      case "EbnfOptionalPostfix":
        return { type: "optional", element: e };
      case "EbnfZeroOrMorePostfix":
        return { type: "repetition", element: e, min: 0, max: 1 / 0 };
      case "EbnfOneOrMorePostfix":
        return { type: "repetition", element: e, min: 1, max: 1 / 0 };
      case "EbnfExceptionPostfix":
        return { type: "sequence", elements: [e, { type: "terminal", value: "-" }, i(r.except)] };
      default:
        throw new Error(`Unsupported EBNF postfix node: ${r.$type}`);
    }
  }, "transformPostfix"),
  y = t((e) => e.postfixes.reduce((r, a) => b(r, a), i(e.base)), "transformTerm"),
  g = t((e) => ({ name: e.name, definition: s(e.definition) }), "transformRule"),
  E = t((e) => {
    (u(e, n), e.title && n.setTitle(e.title), e.rules.map((r) => n.addRule(g(r))));
  }, "populateDb"),
  v = {
    parse: t((e) => {
      (n.clear(), o.debug("[EBNF Parser] Starting Langium parse"));
      const r = m.parse(e);
      if (r.lexerErrors.length > 0 || r.parserErrors.length > 0) throw new d(r);
      const a = r.value;
      (o.debug("[EBNF Parser] Parsed rules:", a.rules.length), E(a), o.debug("[EBNF Parser] Parse complete"));
    }, "parse"),
    parser: { yy: n },
  },
  T = { parser: v, db: n, renderer: f, styles: l };
export { T as diagram };
