import { aM as n } from "./registry-CHHSpXp3.js";
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
      (e._sentryDebugIds[t] = "ba949270-d18a-4c16-b892-3c8891a51d2f"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-ba949270-d18a-4c16-b892-3c8891a51d2f"));
  })();
} catch {}
const i = {
    comments: { blockComment: ["<!--", "-->"] },
    brackets: [["<", ">"]],
    autoClosingPairs: [
      { open: "<", close: ">" },
      { open: "'", close: "'" },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: "<", close: ">" },
      { open: "'", close: "'" },
      { open: '"', close: '"' },
    ],
    onEnterRules: [
      {
        beforeText: new RegExp("<([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$", "i"),
        afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
        action: { indentAction: n.IndentAction.IndentOutdent },
      },
      {
        beforeText: new RegExp("<(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$", "i"),
        action: { indentAction: n.IndentAction.Indent },
      },
    ],
  },
  a = {
    defaultToken: "",
    tokenPostfix: ".xml",
    ignoreCase: !0,
    qualifiedName: /(?:[\w\.\-]+:)?[\w\.\-]+/,
    tokenizer: {
      root: [
        [/[^<&]+/, ""],
        { include: "@whitespace" },
        [/(<)(@qualifiedName)/, [{ token: "delimiter" }, { token: "tag", next: "@tag" }]],
        [/(<\/)(@qualifiedName)(\s*)(>)/, [{ token: "delimiter" }, { token: "tag" }, "", { token: "delimiter" }]],
        [/(<\?)(@qualifiedName)/, [{ token: "delimiter" }, { token: "metatag", next: "@tag" }]],
        [/(<\!)(@qualifiedName)/, [{ token: "delimiter" }, { token: "metatag", next: "@tag" }]],
        [/<\!\[CDATA\[/, { token: "delimiter.cdata", next: "@cdata" }],
        [/&\w+;/, "string.escape"],
      ],
      cdata: [
        [/[^\]]+/, ""],
        [/\]\]>/, { token: "delimiter.cdata", next: "@pop" }],
        [/\]/, ""],
      ],
      tag: [
        [/[ \t\r\n]+/, ""],
        [/(@qualifiedName)(\s*=\s*)("[^"]*"|'[^']*')/, ["attribute.name", "", "attribute.value"]],
        [/(@qualifiedName)(\s*=\s*)("[^">?\/]*|'[^'>?\/]*)(?=[\?\/]\>)/, ["attribute.name", "", "attribute.value"]],
        [/(@qualifiedName)(\s*=\s*)("[^">]*|'[^'>]*)/, ["attribute.name", "", "attribute.value"]],
        [/@qualifiedName/, "attribute.name"],
        [/\?>/, { token: "delimiter", next: "@pop" }],
        [/(\/)(>)/, [{ token: "tag" }, { token: "delimiter", next: "@pop" }]],
        [/>/, { token: "delimiter", next: "@pop" }],
      ],
      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/<!--/, { token: "comment", next: "@comment" }],
      ],
      comment: [
        [/[^<\-]+/, "comment.content"],
        [/-->/, { token: "comment", next: "@pop" }],
        [/<!--/, "comment.content.invalid"],
        [/[<\-]/, "comment.content"],
      ],
    },
  };
export { i as conf, a as language };
