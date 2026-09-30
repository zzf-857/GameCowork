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
      (e._sentryDebugIds[t] = "fe7de909-232c-4587-bea8-90f618445d2e"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-fe7de909-232c-4587-bea8-90f618445d2e"));
  })();
} catch {}
const i = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ],
  d = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
    comments: { blockComment: ["<!--", "-->"] },
    brackets: [
      ["<!--", "-->"],
      ["<", ">"],
      ["{", "}"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" },
    ],
    onEnterRules: [
      {
        beforeText: new RegExp(`<(?!(?:${i.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
        afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
        action: { indentAction: n.IndentAction.IndentOutdent },
      },
      {
        beforeText: new RegExp(`<(?!(?:${i.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
        action: { indentAction: n.IndentAction.Indent },
      },
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*<!--\\s*#region\\b.*-->"),
        end: new RegExp("^\\s*<!--\\s*#endregion\\b.*-->"),
      },
    },
  },
  r = {
    defaultToken: "",
    tokenPostfix: ".html",
    ignoreCase: !0,
    tokenizer: {
      root: [
        [/<!DOCTYPE/, "metatag", "@doctype"],
        [/<!--/, "comment", "@comment"],
        [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, ["delimiter", "tag", "", "delimiter"]],
        [/(<)(script)/, ["delimiter", { token: "tag", next: "@script" }]],
        [/(<)(style)/, ["delimiter", { token: "tag", next: "@style" }]],
        [/(<)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter", { token: "tag", next: "@otherTag" }]],
        [/(<\/)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter", { token: "tag", next: "@otherTag" }]],
        [/</, "delimiter"],
        [/[^<]+/],
      ],
      doctype: [
        [/[^>]+/, "metatag.content"],
        [/>/, "metatag", "@pop"],
      ],
      comment: [
        [/-->/, "comment", "@pop"],
        [/[^-]+/, "comment.content"],
        [/./, "comment.content"],
      ],
      otherTag: [
        [/\/?>/, "delimiter", "@pop"],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/[ \t\r\n]+/],
      ],
      script: [
        [/type/, "attribute.name", "@scriptAfterType"],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/>/, { token: "delimiter", next: "@scriptEmbedded", nextEmbedded: "text/javascript" }],
        [/[ \t\r\n]+/],
        [/(<\/)(script\s*)(>)/, ["delimiter", "tag", { token: "delimiter", next: "@pop" }]],
      ],
      scriptAfterType: [
        [/=/, "delimiter", "@scriptAfterTypeEquals"],
        [/>/, { token: "delimiter", next: "@scriptEmbedded", nextEmbedded: "text/javascript" }],
        [/[ \t\r\n]+/],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop" }],
      ],
      scriptAfterTypeEquals: [
        [/"module"/, { token: "attribute.value", switchTo: "@scriptWithCustomType.text/javascript" }],
        [/'module'/, { token: "attribute.value", switchTo: "@scriptWithCustomType.text/javascript" }],
        [/"([^"]*)"/, { token: "attribute.value", switchTo: "@scriptWithCustomType.$1" }],
        [/'([^']*)'/, { token: "attribute.value", switchTo: "@scriptWithCustomType.$1" }],
        [/>/, { token: "delimiter", next: "@scriptEmbedded", nextEmbedded: "text/javascript" }],
        [/[ \t\r\n]+/],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop" }],
      ],
      scriptWithCustomType: [
        [/>/, { token: "delimiter", next: "@scriptEmbedded.$S2", nextEmbedded: "$S2" }],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/[ \t\r\n]+/],
        [/<\/script\s*>/, { token: "@rematch", next: "@pop" }],
      ],
      scriptEmbedded: [
        [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
        [/[^<]+/, ""],
      ],
      style: [
        [/type/, "attribute.name", "@styleAfterType"],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/>/, { token: "delimiter", next: "@styleEmbedded", nextEmbedded: "text/css" }],
        [/[ \t\r\n]+/],
        [/(<\/)(style\s*)(>)/, ["delimiter", "tag", { token: "delimiter", next: "@pop" }]],
      ],
      styleAfterType: [
        [/=/, "delimiter", "@styleAfterTypeEquals"],
        [/>/, { token: "delimiter", next: "@styleEmbedded", nextEmbedded: "text/css" }],
        [/[ \t\r\n]+/],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop" }],
      ],
      styleAfterTypeEquals: [
        [/"([^"]*)"/, { token: "attribute.value", switchTo: "@styleWithCustomType.$1" }],
        [/'([^']*)'/, { token: "attribute.value", switchTo: "@styleWithCustomType.$1" }],
        [/>/, { token: "delimiter", next: "@styleEmbedded", nextEmbedded: "text/css" }],
        [/[ \t\r\n]+/],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop" }],
      ],
      styleWithCustomType: [
        [/>/, { token: "delimiter", next: "@styleEmbedded.$S2", nextEmbedded: "$S2" }],
        [/"([^"]*)"/, "attribute.value"],
        [/'([^']*)'/, "attribute.value"],
        [/[\w\-]+/, "attribute.name"],
        [/=/, "delimiter"],
        [/[ \t\r\n]+/],
        [/<\/style\s*>/, { token: "@rematch", next: "@pop" }],
      ],
      styleEmbedded: [
        [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
        [/[^<]+/, ""],
      ],
    },
  };
export { d as conf, r as language };
