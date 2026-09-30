import { conf as i, language as e } from "./typescript-T8RhZlkJ.js";
import "./registry-BL-NPVNy.js";
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
  t.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
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
      n = new t.Error().stack;
    n &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[n] = "35c8a716-0ed3-4fb5-bd1a-f8d504d3a79d"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-35c8a716-0ed3-4fb5-bd1a-f8d504d3a79d"));
  })();
} catch {}
const d = i,
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
export { d as conf, a as language };
