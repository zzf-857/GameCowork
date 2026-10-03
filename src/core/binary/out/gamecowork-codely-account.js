// Codely main-account broker. Owns the official device-authorization flow,
// refresh rotation and org/plan reads. Official tokens never leave this module
// except as vault ciphertext; renderer-facing values are whitelisted display
// data only. Protocol sources: codelyreversebackup/api/asset-generation-and-canvas-source-audit.md
// (sections 本人官方账号登录、刷新与订阅链 and 交接实施合同) and
// research/codely-account-protocol.md (byte-anchored CLI/PE evidence).
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const OFFICIAL_BASE = "https://codely.tuanjie.cn";
const OFFICIAL_SITES = { generator: "https://ai-generator.tuanjie.cn", canvas: "https://aicanvas.tuanjie.cn" };
const CLIENT_NAME = "GameCowork";
const PATHS = {
  initiate: "/auth/device/initiate",
  poll: "/auth/device/poll",
  exchange: "/auth/device/exchange",
  me: "/auth/external/me",
  refresh: "/auth/refresh",
  teams: "/api/teams",
  switchTeam: "/api/teams/switch",
  plan: "/api/user/plan",
  usageSummary: "/api/user/usage/summary",
  usageExhaustion: "/api/user/usage/exhaustion",
};
// Keys allowed through status(); nothing token-bearing may be added here.
const PLAN_KEYS = ["planType", "planTag", "isTeamPlan", "isActive", "inRenewalPeriod", "subscriptionUrl", "canUpgradePlan", "canManagePlan", "canTopup", "hasSeat", "validTo"];
const USAGE_KEYS = ["remainingPoints", "isExhausted", "windows"];
const MAX_RECORD_BYTES = 64 * 1024;
const MAX_NETWORK_ERRORS = 10;
const GENERATOR_KINDS = new Set(["frontier_flare", "frontier_sunburst"]);
const GENERATOR_QUOTE_TYPES = new Set(["fal_frontier_flare", "fal_frontier_sunburst"]);
const MAX_GENERATOR_JSON_BYTES = 1024 * 1024;
const MAX_GENERATOR_IMAGE_BYTES = 64 * 1024 * 1024;

function resolveBaseUrl(env = process.env) {
  const override = env.GAMECOWORK_CODELY_ACCOUNT_BASE_URL;
  if (override) return String(override).replace(/\/+$/, "");
  return OFFICIAL_BASE;
}

function requireVault(vault) {
  if (!vault || typeof vault.seal !== "function" || typeof vault.unseal !== "function") {
    throw new Error("Codely account broker requires an injected vault with seal/unseal");
  }
  const probe = vault.seal(Buffer.alloc(0));
  if (typeof probe?.then !== "function") {
    throw new Error("vault.seal must be asynchronous");
  }
  // The probe result is discarded; never let it become an unhandled rejection.
  if (typeof probe.catch === "function") probe.catch(() => {});
}

class AccountError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function pick(obj, keys) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  for (const key of keys) if (obj[key] !== undefined) out[key] = obj[key];
  return out;
}

async function atomicWrite(target, bytes) {
  const directory = path.dirname(target);
  const name = path.basename(target);
  let directoryStat;
  try {
    directoryStat = fs.lstatSync(directory);
  } catch {
    throw new Error("Account storage directory is missing");
  }
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) throw new Error("Account storage directory is not a real directory");
  const existing = fs.lstatSync(target, { throwIfNoEntry: false });
  if (existing && (existing.nlink !== 1 || existing.isSymbolicLink())) throw new Error("Account storage target is linked; refusing to overwrite");
  const temporary = path.join(directory, `.${name}.${crypto.randomBytes(6).toString("hex")}.tmp`);
  const handle = fs.openSync(temporary, "wx", 0o600);
  try {
    fs.writeFileSync(handle, bytes);
  } catch (error) {
    try { fs.closeSync(handle); } catch {}
    try { fs.unlinkSync(temporary); } catch {}
    throw error;
  }
  fs.closeSync(handle);
  try {
    fs.renameSync(temporary, target);
  } catch (error) {
    try { fs.unlinkSync(temporary); } catch {}
    throw error;
  }
}

async function createCodelyAccountBroker(options) {
  const {
    root, vault, fetch: fetchImpl, now = () => Date.now(),
    requestTimeoutMs = 30000, baseUrl = resolveBaseUrl(), emitter = () => {},
    setTimeoutFn = (fn, ms) => setTimeout(fn, ms), clearTimeoutFn = (id) => clearTimeout(id),
    autoDrive = true, logger = { warn() {}, error() {} },
  } = options;
  if (!root || !path.isAbsolute(root)) throw new Error("Codely account broker requires an absolute storage root");
  requireVault(vault);
  if (typeof fetchImpl !== "function") throw new Error("Codely account broker requires an injected fetch");
  const base = new URL(baseUrl);
  const officialOrigin = new URL(OFFICIAL_BASE).origin;
  const isOfficial = base.origin === officialOrigin;
  const isLoopback = base.protocol === "http:" && /^(127\.0\.0\.1|localhost|\[::1\])$/.test(base.hostname);
  if (!isOfficial && !isLoopback) throw new Error("Codely account base URL must be the official origin or an explicit loopback fixture");

  let epoch = 0;
  let requestEpochAbort = new AbortController();
  let attempt = null; // {id, requestToken, userCode, verificationUri, verificationUriComplete, expiresAtMs, intervalMs, nextPollAtMs, networkErrors, pollInFlight, abort}
  let attemptCounter = 0;
  let startInFlight = null;
  let session = null; // {accessToken, refreshToken, tokenType, expiresAtMs, account, unityToken?, restored?}
  let phase = "logged-out"; // logged-out | awaiting-authorization | authenticated | requires-login
  let refreshInFlight = null;
  let teamsCache = null;
  let driveTimer = null;
  let expiryTimer = null;
  let cachedPlan = null;
  let cachedUsage = null;
  let inferenceGeneration = 0;
  let inferenceContext = null;
  let inferenceAbort = new AbortController();
  const inferenceInvalidationListeners = new Set();

  fs.mkdirSync(root, { recursive: true });
  const recordPath = path.join(root, "session.enc");
  const logoutPath = path.join(root, "logout.flag");

  function emit(kind, data) {
    try { emitter(kind, data); } catch (error) { logger.warn(`[codely-account] emitter failed: ${error?.message || error}`); }
  }

  function publicSession() {
    if (phase !== "authenticated" || !session) return null;
    return {
      accessToken: "gamecowork-codely-session",
      account: { id: String(session.account.id), label: String(session.account.label) },
      mode: "codely",
    };
  }

  function publicAttempt() {
    if (!attempt) return null;
    return {
      authFlowAttemptId: attempt.id,
      userCode: attempt.userCode,
      verificationUri: attempt.verificationUri,
      verificationUriComplete: attempt.verificationUriComplete,
      expiresAtMs: attempt.expiresAtMs,
      nextPollAtMs: attempt.nextPollAtMs,
    };
  }

  function status() {
    return {
      phase,
      restored: Boolean(session?.restored),
      attempt: publicAttempt(),
      session: publicSession(),
      plan: phase === "authenticated" ? pick(cachedPlan, PLAN_KEYS) : null,
      usage: phase === "authenticated" ? pick(cachedUsage, USAGE_KEYS) : null,
    };
  }

  function validateVerificationUrl(value) {
    let parsed;
    try { parsed = new URL(value); } catch { throw new Error("Official verification URL is malformed"); }
    if (parsed.protocol === "https:") {
      // allowed regardless of host only for the official flow; fixture mode may use its own host
    } else if (!(parsed.host === base.host && isLoopback)) {
      throw new Error("Official verification URL must be HTTPS");
    }
    if (parsed.host !== base.host && parsed.host !== new URL(OFFICIAL_BASE).host) {
      throw new Error(`Refusing unexpected verification host: ${parsed.host}`);
    }
    return parsed.toString();
  }

  function checkEpoch(current) {
    if (current !== epoch) throw new AccountError("cancelled", "Authorization attempt was superseded");
  }

  function advanceEpoch() {
    ++epoch;
    invalidateInferenceContext();
    requestEpochAbort.abort(new AccountError("cancelled", "Official account request was superseded"));
    requestEpochAbort = new AbortController();
    return epoch;
  }

  async function fetchWithBody(url, init = {}) {
    // fetch() resolves at headers. Keep one deadline through the complete body,
    // including error text, before returning the metadata/json/text facade used
    // by the broker. Preserve the original Headers for its Set-Cookie jar.
    const controller = new AbortController();
    let onAbort;
    const aborted = new Promise((_, reject) => {
      onAbort = () => reject(controller.signal.reason || new AccountError("cancelled", "Official account request was cancelled"));
      controller.signal.addEventListener("abort", onAbort, { once: true });
    });
    const forwarders = [...new Set([requestEpochAbort.signal, init.signal].filter(Boolean))].map(signal => {
      const listener = () => controller.abort(signal.reason);
      if (signal.aborted) listener();
      else signal.addEventListener("abort", listener, { once: true });
      return { signal, listener };
    });
    const timer = setTimeoutFn(() => controller.abort(new AccountError("timeout", "Official account request timed out")), requestTimeoutMs);
    try {
      const read = (async () => {
        if (controller.signal.aborted) throw controller.signal.reason;
        const response = await fetchImpl(url, { ...init, redirect: "error", signal: controller.signal });
        if (controller.signal.aborted) {
          if (response.body) response.body.cancel().catch(() => {});
          throw controller.signal.reason;
        }
        const body = await response.text();
        if (controller.signal.aborted) throw controller.signal.reason;
        return {
          ok: response.ok, status: response.status, headers: response.headers,
          text: async () => body,
          json: async () => {
            try { return JSON.parse(body); }
            catch { throw new AccountError("server", "官方服务返回无效 JSON"); }
          },
        };
      })();
      // Native fetch observes AbortSignal; the race also settles boundedly if
      // an injected transport fails to observe it while reading a response.
      return await Promise.race([read, aborted]);
    } finally {
      clearTimeoutFn(timer);
      controller.signal.removeEventListener("abort", onAbort);
      for (const { signal, listener } of forwarders) signal.removeEventListener("abort", listener);
    }
  }

  async function officialFetch(url, init = {}) {
    const parsed = new URL(url);
    if (parsed.origin !== base.origin) throw new AccountError("policy", `Refusing non-official endpoint ${parsed.origin}`);
    return fetchWithBody(parsed.toString(), init);
  }

  async function writeLogoutMarker() {
    try {
      await atomicWrite(logoutPath, Buffer.from("logout", "utf8"));
      return null;
    } catch (error) {
      return `logout marker: ${error?.message || error}`;
    }
  }

  async function readRecord() {
    if (fs.existsSync(logoutPath)) {
      try { fs.unlinkSync(recordPath); } catch (error) { logger.warn(`[codely-account] stale record removal failed: ${error?.message || error}`); }
      return null;
    }
    const bytes = (() => { try { return fs.readFileSync(recordPath); } catch { return null; } })();
    if (!bytes) return null;
    if (bytes.length > MAX_RECORD_BYTES) throw new Error("Account record exceeds size limit");
    let plain;
    try {
      plain = JSON.parse((await vault.unseal(bytes)).toString("utf8"));
    } catch (error) {
      logger.error(`[codely-account] record unseal failed: ${error?.message || error}`);
      return null;
    }
    if (!plain || typeof plain !== "object" || typeof plain.accessToken !== "string" || !plain.accessToken || !plain.account) return null;
    return plain;
  }

  async function persistRecord(candidate = session, expectedEpoch = epoch) {
    const payload = {
      v: 1, accessToken: candidate.accessToken, refreshToken: candidate.refreshToken || null,
      tokenType: candidate.tokenType || "Bearer", expiresAtMs: candidate.expiresAtMs,
      account: candidate.account, unityToken: candidate.unityToken || null, savedAtMs: now(),
    };
    const sealed = await vault.seal(Buffer.from(JSON.stringify(payload), "utf8"));
    checkEpoch(expectedEpoch);
    if (sealed.length > MAX_RECORD_BYTES) throw new Error("Sealed account record exceeds size limit");
    await atomicWrite(recordPath, sealed);
    checkEpoch(expectedEpoch);
    try { fs.unlinkSync(logoutPath); } catch {}
  }

  function clearAttempt() {
    if (driveTimer) { clearTimeoutFn(driveTimer); driveTimer = null; }
    if (expiryTimer) { clearTimeoutFn(expiryTimer); expiryTimer = null; }
    if (attempt?.abort) { try { attempt.abort.abort(); } catch {} }
    attempt = null;
  }

  function finishAttempt() {
    const finished = attempt;
    clearAttempt();
    return finished;
  }

  function scheduleDrive() {
    if (!autoDrive || !attempt) return;
    if (driveTimer) { clearTimeoutFn(driveTimer); driveTimer = null; }
    const wait = Math.max((attempt.nextPollAtMs || 0) - now(), 0);
    driveTimer = setTimeoutFn(async () => {
      driveTimer = null;
      try { await poll(); } catch (error) { logger.warn(`[codely-account] drive poll failed: ${error?.message || error}`); }
      if (attempt) scheduleDrive();
    }, wait);
  }

  function scheduleExpiry() {
    if (!attempt) return;
    if (expiryTimer) clearTimeoutFn(expiryTimer);
    const running = attempt;
    const current = epoch;
    const wait = Math.min(Math.max(running.expiresAtMs - now(), 0), 2_147_483_647);
    expiryTimer = setTimeoutFn(() => {
      expiryTimer = null;
      if (current !== epoch || attempt !== running) return;
      if (now() >= running.expiresAtMs) expire();
      else scheduleExpiry();
    }, wait);
  }

  async function start() {
    if (phase === "authenticated") return { status: "already-authenticated", ...status() };
    if (attempt) return { status: "in-progress", ...status() };
    if (startInFlight) return startInFlight;
    const begin = (async () => {
      const current = advanceEpoch();
      let response;
      try {
        response = await officialFetch(new URL(PATHS.initiate, base).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ provider: "unity", client_name: CLIENT_NAME }),
        });
      } catch (error) {
        checkEpoch(current);
        emit("device-flow-failed", { error: `无法连接官方授权服务: ${error?.message || error}` });
        throw new AccountError("network", `Device initiate failed: ${error?.message || error}`);
      }
      checkEpoch(current);
    if (!response.ok) {
        emit("device-flow-failed", { error: `官方授权服务返回 ${response.status}` });
        throw new AccountError("server", `Device initiate failed: ${response.status}`);
      }
      const payload = await response.json().catch(() => null);
      checkEpoch(current);
      if (!payload || typeof payload.auth_request_token !== "string" || !payload.auth_request_token
        || !payload.user_code || !payload.verification_uri_complete) {
        throw new AccountError("server", "Device initiate returned an invalid payload");
      }
      const intervalSeconds = Math.max(Number(payload.interval) || 2, 1);
      const expiresIn = Math.max(Number(payload.expires_in) || 0, 0);
      const id = ++attemptCounter;
      attempt = {
        id,
        requestToken: payload.auth_request_token,
        userCode: String(payload.user_code),
        verificationUri: payload.verification_uri ? validateVerificationUrl(payload.verification_uri) : validateVerificationUrl(payload.verification_uri_complete),
        verificationUriComplete: validateVerificationUrl(payload.verification_uri_complete),
        expiresAtMs: now() + expiresIn * 1000,
        intervalMs: intervalSeconds * 1000,
        nextPollAtMs: now() + intervalSeconds * 1000,
        networkErrors: 0,
        pollInFlight: false,
        abort: new AbortController(),
      };
      phase = "awaiting-authorization";
      emit("device-flow-started", {
        authFlowAttemptId: id,
        userCode: attempt.userCode,
        verificationUri: attempt.verificationUri,
        verificationUriComplete: attempt.verificationUriComplete,
        showVerificationInfo: true,
        expiresAtMs: attempt.expiresAtMs,
      });
      scheduleExpiry();
      scheduleDrive();
      return { status: "in-progress", ...status() };
    })();
    startInFlight = begin;
    try {
      return await begin;
    } finally {
      if (startInFlight === begin) startInFlight = null;
    }
  }

  async function exchangeOnce(authorizationCode) {
    const current = epoch;
    const response = await officialFetch(new URL(PATHS.exchange, base).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ authorization_code: authorizationCode }),
    });
    checkEpoch(current);
    if (!response.ok) {
      throw new AccountError("server", `Device exchange failed: ${response.status}`);
    }
    const payload = await response.json().catch(() => null);
    checkEpoch(current);
    if (!payload || typeof payload.access_token !== "string" || !payload.access_token || !payload.expires_in) {
      throw new AccountError("server", "Device exchange returned an invalid token payload");
    }
    return payload;
  }

  async function fetchAccount(accessToken) {
    const current = epoch;
    const response = await officialFetch(new URL(PATHS.me, base).toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", Accept: "application/json" },
    });
    checkEpoch(current);
    if (response.status === 401 || response.status === 403) throw new AccountError("unauthorized", `User info rejected: ${response.status}`);
    if (!response.ok) throw new AccountError("server", `User info request failed: ${response.status}`);
    const payload = await response.json().catch(() => null);
    checkEpoch(current);
    if (!payload || payload.id === undefined || payload.id === null) throw new AccountError("server", "User info response has no identity");
    const label = typeof payload.username === "string" && payload.username ? payload.username
      : typeof payload.email === "string" && payload.email ? payload.email : String(payload.id);
    return { id: String(payload.id), label, email: typeof payload.email === "string" ? payload.email : null };
  }

  async function completeAuthentication(exchangePayload) {
    const current = epoch;
    const account = await fetchAccount(exchangePayload.access_token);
    checkEpoch(current);
    const candidate = {
      accessToken: exchangePayload.access_token,
      refreshToken: typeof exchangePayload.refresh_token === "string" ? exchangePayload.refresh_token : null,
      tokenType: typeof exchangePayload.token_type === "string" && exchangePayload.token_type ? exchangePayload.token_type : "Bearer",
      expiresAtMs: now() + Number(exchangePayload.expires_in) * 1000,
      account,
      unityToken: exchangePayload.unity_token && typeof exchangePayload.unity_token === "object" ? exchangePayload.unity_token : null,
    };
    try {
      await persistRecord(candidate, current);
      checkEpoch(current);
    } catch (error) {
      if (current !== epoch) throw error;
      session = null;
      phase = "logged-out";
      throw new AccountError("storage", `凭据加密保存失败: ${error?.message || error}`);
    }
    session = candidate;
    teamsCache = null;
    invalidateSiteSessions();
    phase = "authenticated";
    emit("sessionUpdate", { sessionInfo: publicSession() });
  }

  function failAttempt(reason, description) {
    const id = attempt ? attempt.id : undefined;
    finishAttempt();
    phase = "logged-out";
    emit("device-flow-failed", { authFlowAttemptId: id, error: description });
    return { status: "failed", reason };
  }

  async function poll() {
    if (phase !== "awaiting-authorization" || !attempt) return { status: "idle" };
    if (attempt.pollInFlight) return { status: "in-flight" };
    if (now() >= attempt.expiresAtMs) return expire();
    const current = epoch;
    const running = attempt;
    running.pollInFlight = true;
    let response;
    try {
      response = await officialFetch(`${new URL(PATHS.poll, base).toString()}?auth_request_token=${encodeURIComponent(running.requestToken)}`, {
        method: "GET", headers: { Accept: "application/json" }, signal: running.abort.signal,
      });
    } catch (error) {
      if (current !== epoch) return { status: "cancelled" };
      running.pollInFlight = false;
      running.networkErrors += 1;
      running.nextPollAtMs = now() + running.intervalMs;
      if (running.networkErrors >= MAX_NETWORK_ERRORS) {
        return failAttempt("network", "官方授权服务连续不可达，登录已中止");
      }
      scheduleDrive();
      return { status: "retrying", nextPollAtMs: running.nextPollAtMs };
    }
    if (current !== epoch) return { status: "cancelled" };
    if (!response.ok) {
      logger.warn(`[codely-account] poll failed: ${response.status}`);
      return failAttempt("server", `官方轮询返回 ${response.status}`);
    }
    const payload = await response.json().catch(() => null);
    if (current !== epoch) return { status: "cancelled" };
    const pollStatus = payload && typeof payload.status === "string" ? payload.status : "";
    if (pollStatus === "pending" || pollStatus === "slow_down") {
      running.pollInFlight = false;
      running.networkErrors = 0;
      if (pollStatus === "slow_down") running.intervalMs = Math.max((Number(payload?.interval) || 0) * 1000, running.intervalMs);
      running.nextPollAtMs = now() + running.intervalMs;
      scheduleDrive();
      return { status: "pending", nextPollAtMs: running.nextPollAtMs };
    }
    if (pollStatus === "authorized") {
      if (!payload.authorization_code) {
        return failAttempt("missing-code", "Authorized response missing authorization_code.");
      }
      const id = running.id;
      try {
        const exchangePayload = await exchangeOnce(payload.authorization_code);
        checkEpoch(current);
        await completeAuthentication(exchangePayload);
        finishAttempt();
        return { status: "completed" };
      } catch (error) {
        if (current !== epoch) return { status: "cancelled" };
        finishAttempt();
        phase = "logged-out";
        emit("device-flow-failed", { authFlowAttemptId: id, error: error?.message ? `登录交换失败: ${error.message}` : "登录交换失败" });
        return { status: "failed", reason: error?.code || "exchange" };
      }
    }
    if (pollStatus === "completed" || pollStatus === "denied" || pollStatus === "expired") {
      const description = typeof payload?.error_description === "string" && payload.error_description ? payload.error_description
        : pollStatus === "completed" ? "Authorization code already delivered. Please restart login."
        : pollStatus === "denied" ? "Authorization denied. Please restart login."
        : "Authorization expired. Please restart login.";
      return failAttempt(pollStatus, description);
    }
    return failAttempt("unexpected", `Unexpected poll status: ${pollStatus || "(none)"}`);
  }

  function cancel() {
    if (!attempt && !startInFlight) return { status: "idle" };
    const id = attempt?.id;
    advanceEpoch();
    startInFlight = null;
    finishAttempt();
    phase = "logged-out";
    emit("device-flow-cancelled", { authFlowAttemptId: id });
    return { status: "cancelled", authFlowAttemptId: id };
  }

  function expire() {
    if (!attempt && !startInFlight) return { status: "idle" };
    const id = attempt?.id;
    advanceEpoch();
    startInFlight = null;
    finishAttempt();
    phase = "logged-out";
    emit("device-flow-failed", { authFlowAttemptId: id, errorType: "expired" });
    return { status: "expired", authFlowAttemptId: id };
  }

  async function logout() {
    advanceEpoch();
    startInFlight = null;
    clearAttempt();
    const hadSession = phase === "authenticated";
    session = null;
    refreshInFlight = null;
    teamsCache = null;
    cachedPlan = null;
    cachedUsage = null;
    invalidateSiteSessions();
    phase = "logged-out";
    let storageError = await writeLogoutMarker();
    try {
      fs.unlinkSync(recordPath);
    } catch (error) {
      if (error?.code !== "ENOENT") storageError = storageError || `record removal: ${error?.message || error}`;
    }
    emit("sessionUpdate", { sessionInfo: null });
    if (storageError) return { status: "storage-error", error: storageError };
    return { status: "logged-out", hadSession };
  }

  async function refresh({ force = false } = {}) {
    if (refreshInFlight) return refreshInFlight;
    if (phase !== "authenticated" || !session) return { status: "requires-login" };
    const mustVerify = Boolean(session.restored);
    if (!force && !mustVerify && session.expiresAtMs && now() < session.expiresAtMs - 120000) {
      return { status: "current", expiresAtMs: session.expiresAtMs };
    }
    if (!session.refreshToken) {
      advanceEpoch();
      session = null;
      phase = "requires-login";
      emit("sessionUpdate", { sessionInfo: null });
      return { status: "requires-login" };
    }
    const current = epoch;
    refreshInFlight = (async () => {
      try {
        const response = await officialFetch(new URL(PATHS.refresh, base).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ refresh_token: session.refreshToken }),
        });
        checkEpoch(current);
        if (response.status === 400 || response.status === 401) {
          invalidateInferenceContext();
          session = null;
          phase = "requires-login";
          const storageError = await writeLogoutMarker();
          try { fs.unlinkSync(recordPath); } catch (error) {
            if (error?.code !== "ENOENT") logger.warn(`[codely-account] record removal after refresh rejection: ${error?.message || error}`);
          }
          emit("sessionUpdate", { sessionInfo: null });
          return storageError ? { status: "requires-login", storageError } : { status: "requires-login" };
        }
        if (!response.ok) return { status: "transient-error", httpStatus: response.status };
        const payload = await response.json().catch(() => null);
        checkEpoch(current);
        if (!payload || typeof payload.access_token !== "string" || !payload.access_token) {
          return { status: "transient-error", reason: "invalid-refresh-payload" };
        }
        const previous = session;
        const candidate = {
          ...previous,
          accessToken: payload.access_token,
          tokenType: typeof payload.token_type === "string" && payload.token_type ? payload.token_type : previous.tokenType,
          refreshToken: typeof payload.refresh_token === "string" && payload.refresh_token ? payload.refresh_token : previous.refreshToken,
          expiresAtMs: payload.expires_in ? now() + Number(payload.expires_in) * 1000 : previous.expiresAtMs,
          restored: false,
        };
        await persistRecord(candidate, current);
        checkEpoch(current);
        session = candidate;
        // CLI inference uses an independent key. A successful refresh of the
        // same main account keeps that key scope and its active stream alive;
        // pending main-token requests still reject their old captured owner.
        if (inferenceContext?.owner.session === previous) inferenceContext.owner = sessionOwner();
        invalidateSiteSessions({ preserveInference: true });
        return { status: "refreshed", expiresAtMs: session.expiresAtMs };
      } catch (error) {
        if (current === epoch) logger.warn(`[codely-account] refresh failed: ${error?.message || error}`);
        return { status: "transient-error", error: String(error?.message || error) };
      } finally {
        refreshInFlight = null;
      }
    })();
    return refreshInFlight;
  }

  function requireAuthenticated() {
    if (phase !== "authenticated" || !session) throw new AccountError("requires-login", "Codely account is not authenticated");
  }

  async function loadTeams() {
    requireAuthenticated();
    if (teamsCache && now() - teamsCache.atMs < 60000) return teamsCache.data;
    const { response, owner } = await authenticatedFetch(PATHS.teams, { method: "GET" });
    if (!response.ok) throw new AccountError("server", `Teams request failed: ${response.status}`);
    const data = await response.json().catch(() => null);
    checkSessionOwner(owner);
    if (!data || typeof data !== "object") throw new AccountError("server", "Teams response is not an object");
    teamsCache = { atMs: now(), data };
    return data;
  }

  async function assertOrgMember(orgId) {
    const teams = await loadTeams();
    const ids = new Set();
    for (const team of teams?.teams || []) if (team?.team_id !== undefined && team?.team_id !== null) ids.add(String(team.team_id));
    for (const org of teams?.orgs || []) {
      for (const key of ["org_id", "litellm_team_id"]) if (org?.[key] !== undefined && org?.[key] !== null) ids.add(String(org[key]));
    }
    if (ids.size > 0 && !ids.has(orgId)) throw new AccountError("unknown-org", `Organization ${orgId} is not a member organization`);
  }

  async function authenticatedFetch(urlPath, init = {}, orgId) {
    requireAuthenticated();
    if (session.restored || (session.expiresAtMs && now() >= session.expiresAtMs - 30000)) {
      const outcome = await refresh({});
      if (outcome.status === "requires-login") throw new AccountError("requires-login", "Session expired; login required");
    }
    if (orgId !== undefined && orgId !== null && orgId !== "") await assertOrgMember(String(orgId));
    let owner = sessionOwner();
    const doFetch = () => officialFetch(new URL(urlPath, base).toString(), {
      ...init,
      headers: { ...(init.headers || {}), Authorization: `Bearer ${owner.token}`, Accept: "application/json" },
    });
    let response = await doFetch();
    checkSessionOwner(owner);
    if (response.status === 401) {
      const outcome = await refresh({ force: true });
      checkEpoch(owner.epoch);
      if (outcome.status === "refreshed") {
        owner = sessionOwner();
        response = await doFetch();
        checkSessionOwner(owner);
      }
    }
    return { response, owner };
  }

  async function getRawJson(urlPath, orgId) {
    const suffix = orgId ? `?orgId=${encodeURIComponent(orgId)}` : "";
    const { response, owner } = await authenticatedFetch(`${urlPath}${suffix}`, { method: "GET" }, orgId);
    if (!response.ok) throw new AccountError("server", `Official account request failed (${response.status})`);
    const data = await response.json();
    checkSessionOwner(owner);
    return data;
  }

  // ---- Official generator / canvas site sessions (P0-3 / P0-4) ------------
  // Both sites are served server-side from the broker's own jar. The renderer
  // only ever receives whitelisted identity/credit display data through the
  // owned local adapters; the official tokens never reach the client.
  function siteOrigin(site) {
    if (!isLoopback) return new URL(OFFICIAL_SITES[site]).origin;
    // Fixture mode routes every audited official site to the loopback base;
    // their paths are disjoint from the main-domain ones.
    return base.origin;
  }

  async function siteFetch(site, urlPath, init = {}) {
    const parsed = new URL(urlPath, siteOrigin(site));
    if (parsed.origin !== siteOrigin(site)) throw new AccountError("policy", "Refusing an endpoint outside the official site");
    return fetchWithBody(parsed.toString(), init);
  }

  let generatorJar = null; // {owner, cookies, atMs, user}
  let canvasCache = null; // {owner, user, points, atMs}
  let generatorSessionInFlight = null;
  let canvasSessionInFlight = null;

  function invalidateSiteSessions({ preserveInference = false } = {}) {
    generatorJar = null;
    canvasCache = null;
    generatorSessionInFlight = null;
    canvasSessionInFlight = null;
    if (!preserveInference) invalidateInferenceContext();
  }

  function invalidateInferenceContext() {
    ++inferenceGeneration;
    inferenceContext = null;
    inferenceAbort.abort(new AccountError("cancelled", "Official inference context changed"));
    inferenceAbort = new AbortController();
    for (const listener of inferenceInvalidationListeners) {
      try { listener(); } catch {}
    }
  }

  function sessionOwner() {
    requireAuthenticated();
    return { epoch, session, token: session.accessToken };
  }

  function ownsSession(owner) {
    return phase === "authenticated" && owner.epoch === epoch && owner.session === session && owner.token === session?.accessToken;
  }

  function checkSessionOwner(owner) {
    if (!ownsSession(owner)) throw new AccountError("cancelled", "Official session was replaced while the request was in progress");
  }

  async function siteSessionOwner() {
    requireAuthenticated();
    const current = epoch;
    if (session.restored || (session.expiresAtMs && now() >= session.expiresAtMs - 30000)) {
      const outcome = await refresh({});
      checkEpoch(current);
      if (outcome.status !== "refreshed" && outcome.status !== "current") {
        throw new AccountError("requires-login", "Official session could not be refreshed");
      }
    }
    return sessionOwner();
  }

  function jarCookies(jar) {
    return (jar?.cookies || []).map((cookie) => cookie.split(";")[0]).join("; ");
  }

  async function withGeneratorSignal(promise, signal) {
    if (!signal) return promise;
    let listener;
    const aborted = new Promise((_, reject) => {
      listener = () => reject(new AccountError("cancelled", "Official generator request was cancelled"));
      if (signal.aborted) listener();
      else signal.addEventListener("abort", listener, { once: true });
    });
    try { return await Promise.race([promise, aborted]); }
    finally { signal.removeEventListener("abort", listener); }
  }

  async function ensureGeneratorSession(owner, allowRefresh = true, signal) {
    if (signal?.aborted) throw new AccountError("cancelled", "Official generator request was cancelled");
    owner ||= await withGeneratorSignal(siteSessionOwner(), signal);
    checkSessionOwner(owner);
    if (signal?.aborted) throw new AccountError("cancelled", "Official generator request was cancelled");
    if (generatorJar && ownsSession(generatorJar.owner) && now() - generatorJar.atMs < 10 * 60_000) return generatorJar;
    // A cancellable generation owns its bootstrap rather than attaching its
    // signal to another caller's shared identity/credit bootstrap.
    if (!signal && generatorSessionInFlight && ownsSession(generatorSessionInFlight.owner)) return generatorSessionInFlight.promise;
    const flight = { owner, promise: null };
    flight.promise = (async () => {
      const response = await siteFetch("generator", "/api/editor/sso/bootstrap", {
        method: "GET",
        headers: { Authorization: `Bearer ${owner.token}`, Accept: "application/json" },
        signal,
      });
      checkSessionOwner(owner);
      if (signal?.aborted) throw new AccountError("cancelled", "Official generator request was cancelled");
      if (allowRefresh && (response.status === 401 || response.status === 403)) {
        const outcome = await refresh({ force: true });
        checkEpoch(owner.epoch);
        if (outcome.status === "refreshed") return ensureGeneratorSession(sessionOwner(), false, signal);
      }
      if (!response.ok) throw new AccountError("server", `Generator bootstrap failed (${response.status})`);
      const user = await response.json().catch(() => null);
      checkSessionOwner(owner);
      if (!user || typeof user !== "object") throw new AccountError("server", "Generator bootstrap response is not an object");
      const jar = {
        owner,
        cookies: typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie().slice(0, 32) : [],
        atMs: now(), user,
      };
      generatorJar = jar;
      return jar;
    })();
    if (!signal) generatorSessionInFlight = flight;
    try { return await flight.promise; }
    finally { if (generatorSessionInFlight === flight) generatorSessionInFlight = null; }
  }

  async function generatorRequest(urlPath, init = {}, allowRetry = true) {
    const method = init.method || "GET";
    let submitted = false;
    try {
      const jar = await ensureGeneratorSession(undefined, true, init.signal);
      checkSessionOwner(jar.owner);
      if (init.signal?.aborted) throw new AccountError("cancelled", "Official generator request was cancelled");
      const cookies = jarCookies(jar);
      const csrfCookie = jar.cookies.find(cookie => cookie.startsWith("_csrf="));
      const csrf = csrfCookie ? csrfCookie.split(";", 1)[0].slice("_csrf=".length) : null;
      submitted = method === "POST";
      const response = await siteFetch("generator", urlPath, {
        ...init, method,
        headers: { ...(init.headers || {}), Accept: "application/json", Authorization: `Bearer ${jar.owner.token}`,
          Origin: siteOrigin("generator"), Referer: `${siteOrigin("generator")}/`,
          isMobile: "false", ...(cookies ? { Cookie: cookies } : {}), ...(csrf ? { "X-Csrf-Token": csrf } : {}) },
      });
      checkSessionOwner(jar.owner);
      if (init.signal?.aborted) throw new AccountError("cancelled", "Official generator request was cancelled");
      if (response.status === 401 || response.status === 403) {
        if (generatorJar === jar) generatorJar = null;
        // GETs can rebuild the site session once. A POST receipt may be lost
        // even on an authorization error, so generation/upload never replay.
        if (method === "GET" && allowRetry) return generatorRequest(urlPath, init, false);
      }
      if (!response.ok) {
        const failure = new AccountError("server", `Official generator request failed (${response.status})`);
        failure.httpStatus = response.status;
        throw failure;
      }
      const payload = await response.json();
      checkSessionOwner(jar.owner);
      if (init.signal?.aborted) throw new AccountError("cancelled", "Official generator request was cancelled");
      return payload;
    } catch (error) {
      // Upstream bodies and transport diagnostics can contain cookies/tokens.
      // Only fixed errors and HTTP status cross this private adapter facade.
      const code = error?.code === "timeout" ? "timeout"
        : error?.code === "cancelled" || init.signal?.aborted || error?.name === "AbortError" ? "cancelled"
        : error?.code === "requires-login" ? "requires-login" : "server";
      const message = code === "timeout" ? "Official generator request timed out"
        : code === "cancelled" ? "Official generator request was cancelled"
        : code === "requires-login" ? "Official generator requires login"
        : Number.isInteger(error?.httpStatus) ? `Official generator request failed (${error.httpStatus})`
        : "Official generator returned no usable response";
      const failure = new AccountError(code, message);
      if (Number.isInteger(error?.httpStatus)) failure.httpStatus = error.httpStatus;
      if (submitted) failure.submissionUnknown = true;
      throw failure;
    }
  }

  function generatorJson(urlPath, allowRetry = true) {
    return generatorRequest(urlPath, { method: "GET" }, allowRetry);
  }

  function generationBinding() {
    if (phase !== "authenticated" || session?.account?.id === undefined || session?.account?.id === null || String(session.account.id) === "") return null;
    return crypto.createHash("sha256").update(String(session.account.id)).digest("hex");
  }

  function generatorCostPreview(query, signal) {
    if (!query || typeof query !== "object" || Array.isArray(query)
      || Object.keys(query).some(key => !["taskType", "resolution", "quality"].includes(key))
      || !GENERATOR_QUOTE_TYPES.has(query.taskType)) {
      throw new AccountError("policy", "Unsupported official generator quote");
    }
    const parameters = new URLSearchParams({ taskType: query.taskType });
    for (const field of ["resolution", "quality"]) {
      if (query[field] === undefined) continue;
      if (typeof query[field] !== "string" || !query[field] || query[field].length > 64 || /[\x00-\x1f\x7f]/.test(query[field])) {
        throw new AccountError("policy", "Invalid official generator quote parameter");
      }
      parameters.set(field, query[field]);
    }
    return generatorRequest(`/api/credit/cost-preview?${parameters}`, { method: "GET", signal });
  }

  function generatorGenerate(kind, payload, signal) {
    if (!GENERATOR_KINDS.has(kind) || !payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new AccountError("policy", "Unsupported official generator model or payload");
    }
    let body;
    try { body = JSON.stringify({ kind, data: payload }); } catch { throw new AccountError("policy", "Invalid official generator payload"); }
    if (Buffer.byteLength(body) > MAX_GENERATOR_JSON_BYTES) throw new AccountError("policy", "Official generator payload is too large");
    return generatorRequest("/api/sso/generate", {
      method: "POST", signal, headers: { "Content-Type": "application/json", source: "codely", fromMethod: "web" }, body,
    }, false);
  }

  function generatorTaskStatus(id, signal) {
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,200}$/.test(id)) throw new AccountError("policy", "Invalid official generator task id");
    return generatorRequest(`/api/task/${encodeURIComponent(id)}/status`, { method: "GET", signal });
  }

  function generatorUploadImage(image, signal) {
    const { bytes, mime, filename } = image || {};
    if (!(bytes instanceof Uint8Array) || !bytes.byteLength || bytes.byteLength > MAX_GENERATOR_IMAGE_BYTES
      || !["image/png", "image/jpeg", "image/webp"].includes(mime)
      || typeof filename !== "string" || !filename || filename.length > 255 || /[\\/\x00-\x1f\x7f]/.test(filename)) {
      throw new AccountError("policy", "Invalid official generator image upload");
    }
    const form = new FormData();
    form.append("image", new Blob([Buffer.from(bytes)], { type: mime }), filename);
    return generatorRequest("/api/sso/upload/image", { method: "POST", signal, body: form }, false);
  }

  function hasAccountTypeClaim(token) {
    const parts = typeof token === "string" ? token.split(".") : [];
    if (parts.length !== 3 || parts[1].length > MAX_RECORD_BYTES) return false;
    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      return Boolean(payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "account_type"));
    } catch { return false; }
  }

  function inferenceIdentifier(value) {
    if ((typeof value !== "string" && typeof value !== "number") || String(value).length > 200 || !String(value) || /[\x00-\x20\x7f]/.test(String(value))) return null;
    return String(value);
  }

  function resolveInferenceTeam(data, useOrgs, selectedOrgId) {
    const records = useOrgs ? data?.orgs : data?.teams;
    if (!Array.isArray(records)) throw new AccountError("server", "Official inference organization list is invalid");
    const candidates = records.map(record => ({
      id: inferenceIdentifier(useOrgs ? record?.org_id : record?.team_id),
      teamId: inferenceIdentifier(useOrgs ? record?.litellm_team_id : record?.team_id),
      current: record?.is_current === true,
    })).filter(record => record.id && record.teamId);
    let matches;
    if (selectedOrgId !== null) {
      matches = candidates.filter(record => record.id === selectedOrgId || record.teamId === selectedOrgId);
    } else {
      const currentId = inferenceIdentifier(useOrgs ? data?.current_org_id : data?.current_team_id);
      const currentRecords = candidates.filter(record => record.current);
      matches = useOrgs && currentRecords.length ? currentRecords
        : currentId ? candidates.filter(record => record.id === currentId || record.teamId === currentId) : currentRecords;
    }
    if (matches.length !== 1) throw new AccountError("unknown-org", "Official inference requires one verified current organization");
    return matches[0].teamId;
  }

  // Explicit inference enable is the sole caller of this capability. Merely
  // logging in, reading a subscription or listing teams never obtains a key.
  async function inferenceBinding({ selectedOrgId, signal } = {}) {
    if (phase !== "authenticated" || !session) return null;
    const selected = selectedOrgId === undefined || selectedOrgId === null || selectedOrgId === "" ? null : inferenceIdentifier(selectedOrgId);
    if (selectedOrgId !== undefined && selectedOrgId !== null && selectedOrgId !== "" && selected === null) throw new AccountError("unknown-org", "Invalid official inference organization selection");
    const owner = await withGeneratorSignal(siteSessionOwner(), signal);
    checkSessionOwner(owner);
    const current = inferenceGeneration;
    const combined = signal ? AbortSignal.any([signal, inferenceAbort.signal]) : inferenceAbort.signal;
    const useOrgs = hasAccountTypeClaim(owner.token);
    let response;
    try {
      response = await officialFetch(new URL(useOrgs ? "/api/orgs" : PATHS.teams, base).toString(), {
        method: "GET", signal: combined,
        headers: { Authorization: `Bearer ${owner.token}`, Accept: "application/json" },
      });
    } catch (error) {
      const code = error?.code === "timeout" ? "timeout" : combined.aborted || !ownsSession(owner) ? "cancelled" : "server";
      throw new AccountError(code, code === "timeout" ? "Official inference organization request timed out" : code === "cancelled" ? "Official inference context changed" : "Official inference organization request failed");
    }
    checkSessionOwner(owner);
    if (current !== inferenceGeneration || combined.aborted) throw new AccountError("cancelled", "Official inference context changed");
    if (!response.ok) throw new AccountError("server", `Official inference organization request failed (${response.status})`);
    const data = await response.json().catch(() => null);
    checkSessionOwner(owner);
    if (current !== inferenceGeneration || combined.aborted) throw new AccountError("cancelled", "Official inference context changed");
    const teamId = resolveInferenceTeam(data, useOrgs, selected);
    if (inferenceContext && (inferenceContext.binding.teamId !== teamId || inferenceContext.selectedOrgId !== selected)) invalidateInferenceContext();
    const binding = {
      accountId: generationBinding(), teamId,
      generationKey: crypto.createHash("sha256").update(`${epoch}:${inferenceGeneration}:${generationBinding()}:${teamId}`).digest("hex"),
    };
    inferenceContext = { owner, selectedOrgId: selected, binding };
    return { ...binding };
  }

  function isInferenceBindingCurrent(binding, selectedOrgId = inferenceContext?.selectedOrgId) {
    const context = inferenceContext;
    const selected = selectedOrgId === undefined || selectedOrgId === null || selectedOrgId === "" ? null : String(selectedOrgId);
    return Boolean(context && ownsSession(context.owner) && context.selectedOrgId === selected && binding
      && binding.accountId === context.binding.accountId && binding.teamId === context.binding.teamId
      && binding.generationKey === context.binding.generationKey);
  }

  async function getCliInferenceCredential({ binding, signal } = {}) {
    if (!isInferenceBindingCurrent(binding)) throw new AccountError("cancelled", "Official inference context changed");
    const owner = inferenceContext.owner;
    const combined = signal ? AbortSignal.any([signal, inferenceAbort.signal]) : inferenceAbort.signal;
    let response;
    try {
      const url = new URL("/api/api-token/cli-api-key", base);
      url.searchParams.set("teamId", binding.teamId);
      response = await officialFetch(url.toString(), {
        method: "GET", signal: combined,
        headers: { Authorization: `Bearer ${owner.token}`, "Content-Type": "application/json", Accept: "application/json" },
      });
    } catch (error) {
      const code = error?.code === "timeout" ? "timeout" : combined.aborted || !isInferenceBindingCurrent(binding) ? "cancelled" : "server";
      throw new AccountError(code, code === "timeout" ? "Official CLI credential request timed out" : code === "cancelled" ? "Official inference context changed" : "Official CLI credential request failed");
    }
    checkSessionOwner(owner);
    if (!isInferenceBindingCurrent(binding) || combined.aborted) throw new AccountError("cancelled", "Official inference context changed");
    if (!response.ok) throw new AccountError("server", `Official CLI credential request failed (${response.status})`);
    const data = await response.json().catch(() => null);
    if (!isInferenceBindingCurrent(binding) || combined.aborted) throw new AccountError("cancelled", "Official inference context changed");
    if (!data || typeof data.cli_api_key !== "string" || !data.cli_api_key || data.cli_api_key.length > 8192 || /[\x00-\x20\x7f]/.test(data.cli_api_key)) {
      throw new AccountError("server", "Official CLI credential response has no usable key");
    }
    // The key stays in the same Core server process; never persist it in the
    // main account record or register a renderer-accessible key RPC.
    return {
      cliApiKey: data.cli_api_key,
      userId: inferenceIdentifier(data.user_id),
      rpm: typeof data.rpm === "number" && Number.isFinite(data.rpm) && data.rpm >= 0 ? data.rpm : null,
      tpm: typeof data.tpm === "number" && Number.isFinite(data.tpm) && data.tpm >= 0 ? data.tpm : null,
    };
  }

  function onInferenceInvalidated(listener) {
    if (typeof listener !== "function") throw new AccountError("policy", "Invalid official inference listener");
    inferenceInvalidationListeners.add(listener);
    return () => inferenceInvalidationListeners.delete(listener);
  }

  async function canvasExchange(owner, allowRefresh = true) {
    owner ||= await siteSessionOwner();
    checkSessionOwner(owner);
    if (canvasCache && ownsSession(canvasCache.owner) && now() - canvasCache.atMs < 10 * 60_000) return canvasCache;
    if (canvasSessionInFlight && ownsSession(canvasSessionInFlight.owner)) return canvasSessionInFlight.promise;
    const flight = { owner, promise: null };
    flight.promise = (async () => {
      const response = await siteFetch("canvas", "/api/v1/auth/exchange", {
        method: "POST",
        headers: { Authorization: `Bearer ${owner.token}`, Accept: "application/json" },
      });
      checkSessionOwner(owner);
      if (allowRefresh && (response.status === 401 || response.status === 403)) {
        const outcome = await refresh({ force: true });
        checkEpoch(owner.epoch);
        if (outcome.status === "refreshed") return canvasExchange(sessionOwner(), false);
      }
      if (!response.ok) throw new AccountError("server", `Canvas exchange failed (${response.status})`);
      const payload = await response.json().catch(() => null);
      checkSessionOwner(owner);
      if (!payload || payload.code !== 0 || !payload.data || typeof payload.data !== "object") {
        throw new AccountError("server", "Canvas exchange returned an invalid envelope");
      }
      const profile = await canvasProfile(payload.data, owner);
      const points = await canvasPoints(payload.data, owner).catch(error => {
        if (error?.code === "cancelled") throw error;
        return null;
      });
      checkSessionOwner(owner);
      canvasCache = { owner, user: profile.user, points, atMs: now() };
      return canvasCache;
    })();
    canvasSessionInFlight = flight;
    try { return await flight.promise; }
    finally { if (canvasSessionInFlight === flight) canvasSessionInFlight = null; }
  }

  async function canvasProfile(exchangeData, owner) {
    const token = exchangeData?.tokens?.access_token;
    if (typeof token !== "string" || !token) throw new AccountError("server", "Canvas exchange response has no access token");
    const response = await siteFetch("canvas", "/api/v1/auth/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    checkSessionOwner(owner);
    if (!response.ok) throw new AccountError("server", `Canvas profile failed (${response.status})`);
    const payload = await response.json().catch(() => null);
    checkSessionOwner(owner);
    if (!payload || payload.code !== 0 || !payload.data || typeof payload.data !== "object") {
      throw new AccountError("server", "Canvas profile returned an invalid envelope");
    }
    return { user: payload.data, raw: payload.data };
  }

  async function canvasPoints(exchangeData, owner) {
    const token = exchangeData?.tokens?.access_token;
    if (typeof token !== "string" || !token) throw new AccountError("server", "Canvas exchange response has no access token");
    const response = await siteFetch("canvas", "/api/v1/auth/points", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    checkSessionOwner(owner);
    if (!response.ok) throw new AccountError("server", `Canvas points failed (${response.status})`);
    const payload = await response.json().catch(() => null);
    checkSessionOwner(owner);
    if (!payload || payload.code !== 0) throw new AccountError("server", "Canvas points returned an invalid envelope");
    return payload.data === undefined ? null : payload.data;
  }

  function displayAmount(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.length <= 64 && /^-?\d+(?:\.\d+)?$/.test(value)) return value;
    return null;
  }

  function canvasPointsProjection(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const points = displayAmount(value.points);
    if (points === null) return null;
    const total = displayAmount(value.total);
    return { points, ...(total === null ? {} : { total }) };
  }

  async function generatorIdentity() {
    const user = await generatorJson("/api/user/me");
    if (!user || typeof user !== "object") throw new AccountError("server", "Generator user response is not an object");
    const id = user.id !== undefined && user.id !== null ? String(user.id) : null;
    if (!id) throw new AccountError("server", "Generator user response has no identity");
    const username = typeof user.username === "string" && user.username ? user.username : null;
    const name = typeof user.name === "string" && user.name ? user.name : username;
    return { id, name: name || id, username, accountMode: "codely-official" };
  }

  async function canvasSnapshotProjection() {
    const cache = await canvasExchange();
    const user = cache.user || {};
    return {
      mode: "codely-official",
      user: {
        id: user.id !== undefined && user.id !== null ? String(user.id) : null,
        username: typeof user.username === "string" && user.username ? user.username
          : typeof user.name === "string" && user.name ? user.name : null,
        // Verbatim server role; paid or vip must never become admin here.
        role: typeof user.role === "string" && user.role ? user.role : "user",
        unityId: typeof user.unity_id === "string" ? user.unity_id : null,
      },
      points: canvasPointsProjection(cache.points),
    };
  }

  return {
    status,
    start,
    poll,
    cancel,
    expire,
    logout,
    refresh,
    listTeamsRaw: () => loadTeams(),
    switchTeamRaw: async (orgId) => {
      requireAuthenticated();
      await assertOrgMember(String(orgId));
      invalidateInferenceContext();
      const { response, owner } = await authenticatedFetch(PATHS.switchTeam, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: orgId }),
      });
      if (!response.ok) throw new AccountError("server", `Team switch failed: ${response.status}`);
      const data = await response.json();
      checkSessionOwner(owner);
      teamsCache = null;
      return data;
    },
    getUserPlanRaw: async (orgId) => {
      const data = await getRawJson(PATHS.plan, orgId);
      cachedPlan = {
        planType: data?.plan_type, planTag: data?.plan_tag, isTeamPlan: data?.is_team_plan, isActive: data?.is_active,
        inRenewalPeriod: data?.in_renewal_period, subscriptionUrl: data?.pending_payment_url, canUpgradePlan: data?.can_upgrade,
        canManagePlan: data?.can_manage_plan, canTopup: data?.can_topup, hasSeat: data?.has_seat, validTo: data?.valid_to,
      };
      return data;
    },
    getUserUsageSummaryRaw: async (orgId) => {
      const data = await getRawJson(PATHS.usageSummary, orgId);
      const codingPlan = Array.isArray(data?.details) ? data.details.find((entry) => entry?.type === "coding_plan") : null;
      cachedUsage = {
        remainingPoints: data?.remaining_points, isExhausted: data?.is_exhausted,
        windows: Array.isArray(codingPlan?.windows) ? codingPlan.windows.map((window) => ({
          windowType: window?.window_type, quotaPoints: window?.quota_points, usedPoints: window?.used_points,
          remainingPoints: window?.remaining_points, exhausted: window?.exhausted,
          period: window?.period ? { startAt: window.period.start_at, endAt: window.period.end_at } : undefined,
        })) : [],
      };
      return data;
    },
    getUserExhaustionRaw: (orgId) => getRawJson(PATHS.usageExhaustion, orgId),
    generatorUser: () => generatorIdentity(),
    generationBinding,
    generatorOrigin: () => siteOrigin("generator"),
    generatorCostPreview,
    generatorGenerate,
    generatorTaskStatus,
    generatorUploadImage,
    inferenceBinding,
    isInferenceBindingCurrent,
    getCliInferenceCredential,
    onInferenceInvalidated,
    generatorCredits: async () => {
      const data = await generatorJson("/api/credit/my-credits");
      if (!data || typeof data !== "object") throw new AccountError("server", "Generator credits response is not an object");
      const currentCredits = displayAmount(data.currentCredits);
      if (currentCredits === null) throw new AccountError("server", "Generator credits response has no valid amount");
      return { currentCredits, accountMode: "codely-official" };
    },
    generatorPaidStatus: async () => {
      const data = await generatorJson("/api/credit/my-paid-status");
      if (!data || typeof data !== "object") throw new AccountError("server", "Generator paid-status response is not an object");
      return {
        paidType: typeof data.paidType === "string" ? data.paidType : null,
        productCode: typeof data.productCode === "string" ? data.productCode : null,
        accountMode: "codely-official",
      };
    },
    canvasSnapshot: () => canvasSnapshotProjection(),
    restoreFromStorage: async () => {
      if (phase === "authenticated") return { status: "authenticated" };
      const record = await readRecord();
      if (!record) return { status: phase === "requires-login" ? "requires-login" : "logged-out" };
      session = {
        accessToken: record.accessToken, refreshToken: record.refreshToken || null,
        tokenType: record.tokenType || "Bearer", expiresAtMs: record.expiresAtMs || 0,
        account: record.account, unityToken: record.unityToken || null, restored: true,
      };
      teamsCache = null;
      phase = "authenticated";
      return { status: "restored" };
    },
    close: () => {
      advanceEpoch();
      clearAttempt();
      invalidateSiteSessions();
      session = null;
      phase = "logged-out";
    },
  };
}

// ---- Core entry wiring -----------------------------------------------------
// Both Core entries call registerCoreWiring({ messenger, core }) once. The
// helpers below let the existing controlPlane handlers consult the broker
// before their legacy (unauthenticated) clients, without duplicating them.
let wiringState = null;

function requireWiring() {
  if (!wiringState) throw new Error("Codely account wiring is not registered");
  return wiringState;
}

function codelyAccountPhase() {
  try { return wiringState?.broker?.status().phase || null; } catch { return null; }
}

// Narrow server-side facade for sibling Core adapters (Quick generator, Canvas
// service). Returns null unless a verified official session is live; official
// tokens never cross this boundary. Generation methods retain audited receipts
// for the owned executor and do not expose a general authenticated fetch.
function codelyAccountOfficialSurface() {
  const wiring = wiringState;
  if (!wiring?.broker) return null;
  try {
    if (wiring.broker.status().phase !== "authenticated") return null;
  } catch {
    return null;
  }
  return {
    generatorUser: () => wiring.broker.generatorUser(),
    generatorCredits: () => wiring.broker.generatorCredits(),
    generatorPaidStatus: () => wiring.broker.generatorPaidStatus(),
    generationBinding: () => wiring.broker.generationBinding(),
    generatorOrigin: () => wiring.broker.generatorOrigin(),
    generatorCostPreview: (query, signal) => wiring.broker.generatorCostPreview(query, signal),
    generatorGenerate: (kind, payload, signal) => wiring.broker.generatorGenerate(kind, payload, signal),
    generatorTaskStatus: (id, signal) => wiring.broker.generatorTaskStatus(id, signal),
    generatorUploadImage: (image, signal) => wiring.broker.generatorUploadImage(image, signal),
    canvasSnapshot: () => wiring.broker.canvasSnapshot(),
  };
}

// Separate server capability for the explicitly enabled official programming
// proxy. Its credential method is never part of the Quick/Canvas surface or
// any messenger registration exposed to renderer requests.
function codelyAccountInferenceSurface() {
  const wiring = wiringState;
  if (!wiring?.broker || wiring.broker.status().phase !== "authenticated") return null;
  const selectedOrgId = () => {
    const value = wiring.core?.orgManager?.getCurrentOrgId?.();
    return value === undefined || value === null || value === "" ? null : String(value);
  };
  return {
    inferenceBinding: ({ signal } = {}) => wiring.broker.inferenceBinding({ selectedOrgId: selectedOrgId(), signal }),
    isInferenceBindingCurrent: binding => wiring.broker.isInferenceBindingCurrent(binding, selectedOrgId()),
    getCliInferenceCredential: async ({ binding, signal } = {}) => {
      if (!wiring.broker.isInferenceBindingCurrent(binding, selectedOrgId())) throw new AccountError("cancelled", "Official inference context changed");
      const credential = await wiring.broker.getCliInferenceCredential({ binding, signal });
      if (!wiring.broker.isInferenceBindingCurrent(binding, selectedOrgId())) throw new AccountError("cancelled", "Official inference context changed");
      return credential;
    },
    onInferenceInvalidated: listener => wiring.broker.onInferenceInvalidated(listener),
  };
}

async function codelyAccountDataCall(method, orgId) {
  const wiring = wiringState;
  if (!wiring || wiring.brokerStatus?.() !== "authenticated") return null;
  const rawByMethod = { getUserPlan: "getUserPlanRaw", getUserUsageSummary: "getUserUsageSummaryRaw", getUserExhaustion: "getUserExhaustionRaw" };
  const rawMethod = rawByMethod[method];
  if (!rawMethod) throw new Error(`Unknown Codely account data method: ${method}`);
  try {
    return await wiring.broker[rawMethod](orgId);
  } catch (error) {
    if (error?.code === "requires-login") return null;
    throw error;
  }
}

async function codelyAccountOrgSnapshot(core) {
  const wiring = wiringState;
  if (!wiring || wiring.brokerStatus?.() !== "authenticated") return null;
  let teams = null;
  try {
    teams = await wiring.broker.listTeamsRaw();
    if (teams) {
      core.orgManager.updateFromListTeams(teams);
      // The original updateFromListTeams leaves currentOrgId unset; apply the
      // server's real current_team_id through the public setter instead of
      // guessing the first entry.
      const current = teams.current_team_id;
      if (current !== undefined && current !== null && core.orgManager.getCurrentOrgId() == null) {
        core.orgManager.setCurrentOrgId(String(current));
      }
    }
  } catch (error) {
    wiring.logger.warn?.(`[Core] Codely org list failed: ${error?.message || error}`);
  }
  return {
    organizations: core.orgManager.getOrganizations(),
    currentOrgId: core.orgManager.getCurrentOrgId(),
    currentOrgName: core.orgManager.getCurrentOrgName(),
    multiTeamEnabled: core.orgManager.getMultiTeamEnabled(),
  };
}

async function codelyAccountSwitchOrg(core, orgId) {
  const wiring = requireWiring();
  const result = await wiring.broker.switchTeamRaw(orgId);
  const teams = await wiring.broker.listTeamsRaw().catch(() => null);
  if (teams) core.orgManager.updateFromListTeams(teams);
  const serverCurrent = result && result.current_team_id !== undefined && result.current_team_id !== null
    ? String(result.current_team_id)
    : (teams && teams.current_team_id !== undefined && teams.current_team_id !== null ? String(teams.current_team_id) : null);
  if (serverCurrent) core.orgManager.setCurrentOrgId(serverCurrent);
  if (typeof core.pushOrgUpdate === "function") core.pushOrgUpdate();
  const currentOrgId = core.orgManager.getCurrentOrgId() || String(orgId);
  return {
    success: result ? result.success !== false : true,
    orgId: currentOrgId,
    organizations: core.orgManager.getOrganizations(),
    currentOrgId,
    currentOrgName: core.orgManager.getCurrentOrgName(),
    multiTeamEnabled: core.orgManager.getMultiTeamEnabled(),
  };
}

function registerCoreWiring({ messenger, core, logger = console, overrides = {} }) {
  if (!messenger || typeof messenger.on !== "function" || typeof messenger.request !== "function") {
    throw new Error("Codely account wiring requires the core messenger");
  }
  if (!core) throw new Error("Codely account wiring requires the core instance");
  if (wiringState) return wiringState;
  const root = process.env.GAMECOWORK_CODELY_ACCOUNT_DIR
    || (process.env.GAMECOWORK_USER_DATA_DIR ? path.join(process.env.GAMECOWORK_USER_DATA_DIR, "codely-account") : null);
  if (!root) {
    logger.warn?.("[Core] Codely account storage directory is not configured; account features stay unavailable");
    wiringState = { broker: null, brokerStatus: () => null };
    return wiringState;
  }
  const vault = {
    seal: async (bytes) => Buffer.from((await messenger.request("gamecoworkAccount/vaultSeal", { data: bytes.toString("hex") })).sealed, "hex"),
    unseal: async (bytes) => Buffer.from((await messenger.request("gamecoworkAccount/vaultUnseal", { data: bytes.toString("hex") })).plain, "hex"),
  };
  const brokerPromise = createCodelyAccountBroker({
    root,
    vault,
    fetch: (url, init) => fetch(url, init),
    emitter: (kind, data) => {
      messenger.send(kind, data);
      if (kind === "sessionUpdate") {
        if (data?.sessionInfo) {
          codelyAccountOrgSnapshot(core).catch((error) => logger.warn?.(`[Core] Codely org sync failed: ${error?.message || error}`));
        } else {
          core.orgManager.reset();
        }
      }
    },
    logger,
    ...overrides,
  });
  const brokerStatus = () => {
    try { return wiringState?.broker?.status().phase || null; } catch { return null; }
  };
  wiringState = { broker: null, brokerStatus, logger, core };
  brokerPromise.then((broker) => {
    wiringState.broker = broker;
    return broker.restoreFromStorage();
  }).catch((error) => logger.warn?.(`[Core] Codely account broker unavailable: ${error?.message || error}`));
  const getBroker = async () => {
    wiringState = wiringState || {};
    if (!wiringState.broker) wiringState.broker = await brokerPromise;
    return wiringState.broker;
  };
  messenger.on("codelyAccount/status", async () => ({ ...(await (await getBroker()).status()) }));
  messenger.on("codelyAccount/start", async () => (await getBroker()).start());
  messenger.on("codelyAccount/poll", async () => (await getBroker()).poll());
  messenger.on("codelyAccount/cancel", async () => (await getBroker()).cancel());
  messenger.on("codelyAccount/expire", async () => (await getBroker()).expire());
  messenger.on("codelyAccount/logout", async () => (await getBroker()).logout());
  messenger.on("codelyAccount/refresh", async (frame) => (await getBroker()).refresh(frame?.data || {}));
  messenger.on("codelyAccount/canvasSnapshot", async () => (await getBroker()).canvasSnapshot());
  messenger.on("getControlPlaneSessionInfo", async (frame) => {
    const data = frame?.data || {};
    const broker = await getBroker();
    const state = broker.status();
    if (state.session) return state.session;
    if (data.silent) return null;
    if (state.attempt) return { joinedInProgress: true };
    await broker.start();
    return { joinedInProgress: true };
  });
  messenger.on("cancelLogin", async () => (await getBroker()).cancel());
  messenger.on("notifyDeviceFlowExpired", async () => (await getBroker()).expire());
  messenger.on("logoutOfControlPlane", async () => {
    const result = await (await getBroker()).logout();
    core.orgManager.reset();
    return result;
  });
  return wiringState;
}

module.exports = {
  createCodelyAccountBroker, resolveBaseUrl, OFFICIAL_BASE, OFFICIAL_SITES, CLIENT_NAME, PATHS, AccountError,
  registerCoreWiring, codelyAccountPhase, codelyAccountDataCall, codelyAccountOrgSnapshot, codelyAccountSwitchOrg,
  codelyAccountOfficialSurface, codelyAccountInferenceSurface,
};
