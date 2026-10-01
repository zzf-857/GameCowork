import { conf as n, language as e } from "./typescript-oQI-5BfB.js";
import "./registry-CHHSpXp3.js";
(function () {
  var t =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  t.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
})();
try {
  (function () {
    var t =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      d = new t.Error().stack;
    d &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[d] = "35c8a716-0ed3-4fb5-bd1a-f8d504d3a79d"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-35c8a716-0ed3-4fb5-bd1a-f8d504d3a79d"));
  })();
} catch {}
const s = n,
  a = {
    defaultToken: "invalid",
    tokenPostfix: ".js",
    keywords: [
      "break",
      "case",
      "catch",
      "class",
      "continue",
      "const",
      "constructor",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "export",
      "extends",
      "false",
      "finally",
      "for",
      "from",
      "function",
      "get",
      "if",
      "import",
      "in",
      "instanceof",
      "let",
      "new",
      "null",
      "return",
      "set",
      "static",
      "super",
      "switch",
      "symbol",
      "this",
      "throw",
      "true",
      "try",
      "typeof",
      "undefined",
      "var",
      "void",
      "while",
      "with",
      "yield",
      "async",
      "await",
      "of",
    ],
    typeKeywords: [],
    operators: e.operators,
    symbols: e.symbols,
    escapes: e.escapes,
    digits: e.digits,
    octaldigits: e.octaldigits,
    binarydigits: e.binarydigits,
    hexdigits: e.hexdigits,
    regexpctl: e.regexpctl,
    regexpesc: e.regexpesc,
    tokenizer: e.tokenizer,
  };
export { s as conf, a as language };
