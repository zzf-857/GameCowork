import { u as t, j as s, c as n, ar as l } from "./registry-CHHSpXp3.js";
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
      d = new e.Error().stack;
    d &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[d] = "7e0e8fd6-bf5a-47ab-8385-16c60be8e72e"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-7e0e8fd6-bf5a-47ab-8385-16c60be8e72e"));
  })();
} catch {}
function a({ onCancel: e, onManageLicenses: d }) {
  const { t: o } = t();
  return s.jsxs("div", {
    className: n("bg-codely-color-surface-card flex flex-col"),
    children: [
      s.jsx("div", {
        className: n("px-5 pt-4 pb-2"),
        children: s.jsx("div", {
          className: n("text-base font-medium text-codely-color-text-primary"),
          children: o("tjhub.noLicense.title"),
        }),
      }),
      s.jsx("div", {
        className: n("px-5 pb-2"),
        children: s.jsx("p", {
          className: n("m-0 text-sm leading-5 text-codely-color-text-primary"),
          children: o("tjhub.noLicense.body"),
        }),
      }),
      s.jsxs("div", {
        className: n("flex flex-row justify-end gap-3 px-5 pt-2 pb-4"),
        children: [
          s.jsx(l, {
            variant: "ghost",
            size: "sm",
            onClick: e,
            className: n("px-4 py-2 text-sm rounded-lg border border-solid border-codely-color-border-strong"),
            children: o("tjhub.common.cancel"),
          }),
          s.jsx(l, {
            size: "sm",
            className: n("px-4 py-2 text-sm rounded-lg"),
            onClick: d,
            children: o("tjhub.noLicense.manageLicenses"),
          }),
        ],
      }),
    ],
  });
}
export { a as NoLicenseDialog };
