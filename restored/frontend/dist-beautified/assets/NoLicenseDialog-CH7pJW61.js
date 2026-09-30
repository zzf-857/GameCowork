import { u as t, j as s, c as n, ar as l } from "./registry-BL-NPVNy.js";
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
      o = new e.Error().stack;
    o &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[o] = "7e0e8fd6-bf5a-47ab-8385-16c60be8e72e"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-7e0e8fd6-bf5a-47ab-8385-16c60be8e72e"));
  })();
} catch {}
function a({ onCancel: e, onManageLicenses: o }) {
  const { t: d } = t();
  return s.jsxs("div", {
    className: n("bg-gamecowork-color-surface-card flex flex-col"),
    children: [
      s.jsx("div", {
        className: n("px-5 pt-4 pb-2"),
        children: s.jsx("div", {
          className: n("text-base font-medium text-gamecowork-color-text-primary"),
          children: d("tjhub.noLicense.title"),
        }),
      }),
      s.jsx("div", {
        className: n("px-5 pb-2"),
        children: s.jsx("p", {
          className: n("m-0 text-sm leading-5 text-gamecowork-color-text-primary"),
          children: d("tjhub.noLicense.body"),
        }),
      }),
      s.jsxs("div", {
        className: n("flex flex-row justify-end gap-3 px-5 pt-2 pb-4"),
        children: [
          s.jsx(l, {
            variant: "ghost",
            size: "sm",
            onClick: e,
            className: n("px-4 py-2 text-sm rounded-lg border border-solid border-gamecowork-color-border-strong"),
            children: d("tjhub.common.cancel"),
          }),
          s.jsx(l, {
            size: "sm",
            className: n("px-4 py-2 text-sm rounded-lg"),
            onClick: o,
            children: d("tjhub.noLicense.manageLicenses"),
          }),
        ],
      }),
    ],
  });
}
export { a as NoLicenseDialog };
