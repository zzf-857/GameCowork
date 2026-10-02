// State for the installed-Editor pane. Cached rows stay visible while discovery
// runs; actual host events can supersede an older request without another scan.
export function normalizeEditorInstallationSnapshot(value, normalize) {
  if (!value || typeof value !== "object" || !value.editors || Array.isArray(value.editors) ||
      typeof value.editors !== "object" || !value.cache || typeof value.cache !== "object" ||
      typeof value.cache.hasSnapshot !== "boolean" || typeof value.cache.stale !== "boolean" ||
      typeof value.cache.refreshing !== "boolean") throw new Error("已安装编辑器缓存返回格式无效");
  return { rows: value.cache.hasSnapshot ? Object.values(value.editors).map(normalize) : null, cache: value.cache };
}

export function editorInstallationCacheMessage(cache) {
  if (!cache) return null;
  if (cache.error) return "扫描未完成，保留上次安装列表；可重新扫描。";
  if (cache.identityChanged) return "已安装文件信息发生变化，正在核对；不可用的安装已标记。";
  if (cache.stale) return cache.refreshing ? "显示上次确认的安装，正在后台更新…" : "显示上次确认的安装；可刷新核对。";
  if (cache.refreshing) return "已安装编辑器可继续查看，正在后台核对…";
  if (cache.source === "persistent-cache") return "已从本机缓存载入安装列表。";
  return null;
}

export function createEditorInstallationsController({ messenger, normalize, onUpdate, local, initialRows = null, initialCache = null,
    now = () => Date.now(), setTimer = globalThis.setTimeout, clearTimer = globalThis.clearTimeout }) {
  let active = true, requestGeneration = 0, eventSequence = 0, pending = 0;
  let refreshTimer = null;
  let state = { rows: initialRows, cache: initialCache, error: null, loading: initialRows === null, busy: false };
  const clearRefreshTimer = () => { if (refreshTimer !== null) clearTimer?.(refreshTimer); refreshTimer = null; };
  const armRefreshTimer = () => {
    clearRefreshTimer();
    if (!active || !local || pending || state.error || state.cache?.error || state.cache?.refreshing ||
        !Number.isFinite(state.cache?.expiresAt) || typeof setTimer !== "function") return;
    refreshTimer = setTimer(() => { refreshTimer = null; void controller.read(false); },
      Math.max(1000, state.cache.expiresAt - now() + 1));
  };
  const publish = () => { if (active) onUpdate({ ...state, busy: pending > 0 || state.cache?.refreshing === true }); };
  const apply = snapshot => {
    state = { ...state, rows: snapshot.rows ?? state.rows, cache: snapshot.cache,
      error: snapshot.cache?.error || snapshot.cache?.persistenceError || null,
      loading: snapshot.rows === null && !snapshot.cache?.error };
    publish(); armRefreshTimer();
  };
  const controller = {
    receive(value) {
      if (!active || !local) return;
      try {
        const snapshot = normalizeEditorInstallationSnapshot(value, normalize);
        if (state.cache?.checkedAt && snapshot.cache.checkedAt && snapshot.cache.checkedAt < state.cache.checkedAt) return;
        eventSequence++; apply(snapshot);
      } catch (error) { state = { ...state, error: error.message, loading: false }; clearRefreshTimer(); publish(); }
    },
    async read(refresh = false) {
      if (!active) return;
      const generation = ++requestGeneration, sequence = eventSequence;
      pending++; clearRefreshTimer(); publish();
      try {
        const response = await messenger.request(local ? "tjhub/getEditorInstallations" : "tjhub/getEditors", local ? { refresh: refresh === true } : undefined);
        if (!active || generation !== requestGeneration || sequence !== eventSequence) return;
        if (response?.status !== "success") throw new Error(typeof response?.error === "string" ? response.error : response?.error?.message || "读取已安装编辑器失败");
        if (local) apply(normalizeEditorInstallationSnapshot(response.content, normalize));
        else {
          if (!response.content || typeof response.content !== "object") throw new Error("已安装编辑器列表返回格式无效");
          apply({ rows: Object.values(response.content).map(normalize), cache: null });
        }
      } catch (error) {
        if (!active || generation !== requestGeneration || sequence !== eventSequence) return;
        state = { ...state, error: error instanceof Error ? error.message : String(error), loading: false,
          cache: state.cache ? { ...state.cache, stale: true, refreshing: false } : null };
      } finally { pending--; publish(); armRefreshTimer(); }
    },
    dispose() { active = false; requestGeneration++; clearRefreshTimer(); },
  };
  return controller;
}
