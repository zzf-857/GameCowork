import { aM as n } from "./registry-BL-NPVNy.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "90fbd080-9807-4028-a526-838d3fd1c955"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-90fbd080-9807-4028-a526-838d3fd1c955"));
  })();
} catch {}
n.register({ id: "diff", extensions: [".diff", ".patch"] });
n.setMonarchTokensProvider("diff", {
  tokenizer: {
    root: [
      [
        /^(diff --git|index |new file mode|deleted file mode|similarity index|rename from|rename to|old mode|new mode|Binary files).*$/,
        "type",
      ],
      [/^(---|\+\+\+).*$/, "type"],
      [/^@@.*$/, "keyword"],
      [/^\+.*$/, "comment"],
      [/^-.*$/, "invalid"],
      [/^.*$/, ""],
    ],
  },
});
