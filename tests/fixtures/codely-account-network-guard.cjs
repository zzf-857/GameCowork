// E2E guard: the maintained Core must reach only loopback endpoints during the
// account login E2E. Any attempt to contact the real official domain (or any
// other external host) fails loudly instead of silently passing.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");
const log = process.env.GAMECOWORK_E2E_GUARD_LOG;
const runId = process.env.GAMECOWORK_E2E_GUARD_RUN_ID;
if (!log || !path.isAbsolute(log) || !runId) throw new Error("Account E2E guard requires an explicit audit log and run identity");

function record(event, details = {}) {
  // Synchronous records survive Windows Job termination. Never log request
  // URLs, query strings, bodies, headers, credentials or environment values.
  fs.appendFileSync(log, JSON.stringify({ event, runId, pid: process.pid, ...details }) + "\n");
}
function denied(operation, host) {
  record("blocked", { operation, host });
  return new Error(`E2E network guard blocked external ${operation} to ${host}`);
}

function isLoopback(host) {
  return host === "127.0.0.1" || host === "localhost" || host === "::1" || host === "[::1]";
}

const originalFetch = globalThis.fetch;
globalThis.fetch = async function guardedFetch(input, init) {
  let host = "";
  try {
    const url = typeof input === "string" ? new URL(input) : input instanceof URL ? input : new URL(input.url);
    host = url.hostname;
  } catch {
    host = "(unparsed)";
  }
  if (!isLoopback(host)) {
    throw denied("fetch", host);
  }
  return originalFetch.call(this, input, { ...init, redirect: "error" });
};

for (const [name, module] of [["http", http], ["https", https]]) {
  for (const method of ["request", "get"]) {
    const original = module[method];
    module[method] = function guardedRequest(...args) {
      const fromUrl = typeof args[0] === "string" || args[0] instanceof URL;
      let url;
      if (fromUrl) { try { url = new URL(String(args[0])); } catch {} }
      const options = fromUrl ? args[1] : args[0];
      const host = options?.socketPath ? "(socket-path)"
        : options?.hostname || options?.host || url?.hostname || (fromUrl ? "(unparsed)" : "localhost");
      if (!isLoopback(host)) throw denied(`${name}.${method}`, String(host));
      return original.apply(this, args);
    };
  }
}

record("initialized", {
  parentPid: process.ppid,
  entry: process.argv[1] ? path.resolve(process.argv[1]) : null,
  dataRoot: path.resolve(process.env.GAMECOWORK_DATA_DIR || process.cwd()),
});

module.exports = { isLoopback };
