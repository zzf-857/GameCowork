import { createRequire as __unityInsightCreateRequire } from "node:module";
import { fileURLToPath as __unityInsightFileURLToPath } from "node:url";
import { dirname as __unityInsightDirname } from "node:path";
const __filename = __unityInsightFileURLToPath(import.meta.url);
const __dirname = __unityInsightDirname(__filename);
const require = __unityInsightCreateRequire(import.meta.url);
import { parentPort as N, workerData as V } from "node:worker_threads";
import { writeSync as B } from "node:fs";
function x() {
  return process.env.UNITY_INSIGHT_ASCII === "1"
    ? !1
    : process.env.UNITY_INSIGHT_UNICODE === "1"
      ? !0
      : process.platform === "win32"
        ? !1
        : process.env.TERM !== "linux";
}
var R = {
    spinner: ["\xB7", "\u2722", "\u2733", "\u2736", "\u273B", "\u273D"],
    barFilled: "\u2588",
    barEmpty: "\u2591",
    rail: "\u2502",
    phaseDone: "\u25C6",
    dash: "\u2014",
  },
  G = { spinner: [".", "*", "+", "x", "o", "O"], barFilled: "#", barEmpty: "-", rail: "|", phaseDone: "*", dash: "-" },
  h = null;
function w() {
  return (h === null && (h = x() ? R : G), h);
}
import { format as v } from "node:util";
import { BroadcastChannel as k, threadId as F } from "node:worker_threads";
var D = { DEBUG: 10, INFO: 20, WARN: 30, ERROR: 40, OFF: 50 },
  ue = 10080 * 60 * 1e3;
var P = "unity-insight-process-log",
  I = { debug: "DEBUG", log: "INFO", info: "INFO", warn: "WARN", error: "ERROR", trace: "ERROR" };
function W(e) {
  let n = e?.trim();
  if (!n) return { level: "INFO" };
  let t = n.toUpperCase();
  return t in D ? { level: t } : { level: "INFO", invalidValue: n };
}
function E() {
  if (W(process.env.UNITY_INSIGHT_LOG_LEVEL).level === "OFF") return () => {};
  let e;
  try {
    ((e = new k(P)), e.unref());
  } catch {
    return () => {};
  }
  let n = console,
    t = new Map(),
    r = !0;
  return (
    Y(n, t, (o, s) => {
      if (r)
        try {
          e.postMessage({ timestamp: Date.now(), threadId: F, level: o, message: s });
        } catch {
          ((r = !1), e.close());
        }
    }),
    () => {
      for (let [o, s] of t) n[o] = s;
      r && e.close();
    }
  );
}
function H(e) {
  let n = v(...e);
  return (new Error(n).stack ?? `Trace: ${n}`).replace(/^Error(?=:)/, "Trace");
}
function Y(e, n, t) {
  for (let r of Object.keys(I)) n.set(r, e[r]);
  for (let r of Object.keys(I)) {
    let o = n.get(r);
    if (r === "trace") {
      let s = n.get("error");
      e.trace = (...d) => {
        let g = e.error,
          m;
        e.error = (...p) => {
          ((m = A(v(...p))), s.apply(console, [m]));
        };
        try {
          o.apply(console, d);
        } finally {
          e.error = g;
        }
        t("ERROR", m ?? H(d));
      };
      continue;
    }
    e[r] = (...s) => {
      (o.apply(console, s), t(I[r], v(...s)));
    };
  }
}
function A(e) {
  let n = e.includes(`\r
`)
      ? `\r
`
      : `
`,
    t = e.split(n);
  return (t.length > 1 && t.splice(1, 1), t.join(n));
}
E();
function b(e) {
  B(1, e);
}
var i = w(),
  y = i.spinner,
  j = 150,
  K = 3,
  a = "\x1B[0m",
  f = "\x1B[2m",
  z = "\x1B[32m",
  J = "\x1B[1m",
  L = { r: 60, g: 168, b: 75 },
  _ = { r: 166, g: 227, b: 161 },
  q = { r: 46, g: 100, b: 54 },
  Q = V.startTime;
function X() {
  return Math.floor((Date.now() - Q) / j);
}
function $(e, n, t) {
  return Math.round(e + (n - e) * t);
}
function C(e, n = !1) {
  let t = $(L.r, _.r, e),
    r = $(L.g, _.g, e),
    o = $(L.b, _.b, e);
  return `\x1B[38;2;${t};${r};${o}m${n ? J : ""}`;
}
function T() {
  let { r: e, g: n, b: t } = q;
  return `\x1B[38;2;${e};${n};${t}m`;
}
function Z(e) {
  let n = (Math.sin((e * 2 * Math.PI) / 13) + 1) / 2;
  return C(n, !0);
}
function S(e) {
  return e.toLocaleString("en-US");
}
function O(e, n, t) {
  if (n === 0) return `${T()}${i.barEmpty.repeat(t)}${a}`;
  let r = 24,
    o = ((e % r) / r) * (n + 6) - 3,
    s = 3,
    d = "";
  for (let g = 0; g < n; g += 1) {
    let m = Math.abs(g - o),
      p = Math.max(0, 1 - m / s);
    d += `${C(p, !0)}${i.barFilled}`;
  }
  return ((d += `${a}${T()}${i.barEmpty.repeat(t)}${a}`), d);
}
var c = "",
  l = -1,
  u = 0;
function ee() {
  if (!c && l < 0 && u <= 0) return;
  let e = X(),
    n = Math.floor(e / K) % y.length,
    t = y[n] ?? y[0] ?? ".",
    r = Z(e),
    o;
  if (l >= 0) {
    let d = Math.round((25 * l) / 100),
      g = 25 - d;
    o = `${f}${i.rail}${a} ${r}${t}${a} Indexing ${O(e, d, g)} ${l}% ${c}`;
  } else
    u > 0
      ? (o = `${f}${i.rail}${a} ${r}${t}${a} Indexing ${c}... ${S(u)} found`)
      : (o = `${f}${i.rail}${a} ${r}${t}${a} Indexing ${c}...`);
  b(`\r\x1B[K${o}`);
}
function U() {
  if (!c && l < 0 && u <= 0) return;
  b("\r\x1B[K");
  let e = "";
  if (l >= 0) {
    let t = Math.round((25 * l) / 100),
      r = 25 - t;
    e = `Indexing ${O(0, t, r)} ${l}% ${c} ${i.dash} done`;
  } else u > 0 ? (e = `Indexing ${c} ${i.dash} ${S(u)} found`) : (e = `Indexing ${c} ${i.dash} done`);
  (b(`${f}${i.rail}${a} ${z}${i.phaseDone}${a} ${e}
`),
    (c = ""),
    (l = -1),
    (u = 0));
}
var ne = setInterval(ee, 50);
N?.on("message", (e) => {
  if (e.type === "update") {
    ((c = e.detail), (l = e.percent), (u = e.count));
    return;
  }
  if (e.type === "finish-phase") {
    U();
    return;
  }
  e.type === "stop" && (clearInterval(ne), U(), N?.postMessage({ type: "stopped" }));
});
