// Identity adapter for the original Canvas AuthContext. This is a GameCowork
// loopback session, never a platform account, OAuth token, credit or membership.
export const canvasSessionEndpoint = '/codely-canvas/api/local/session';
export function isLocalCanvasRoute() {
  return window.location.pathname === '/codely-canvas' || window.location.pathname.startsWith('/codely-canvas/');
}
// One owner per Canvas document. Same-origin iframes in the same host window
// share sessionStorage, so the legacy storage key cannot identify a local view.
// Only the original acquire-lease boundary calls this producer; headers never
// manufacture an owner when the editor has not requested a lease.
let documentEditingOwner = null;
export function createCanvasEditingOwner() {
  if (!isLocalCanvasRoute()) return null;
  documentEditingOwner ||= `gcw-canvas-${crypto.randomUUID()}`;
  return documentEditingOwner;
}
export function existingCanvasEditingOwner() {
  return isLocalCanvasRoute() ? documentEditingOwner : null;
}
export function canvasLocalApiHeaders(token) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const owner = existingCanvasEditingOwner();
  if (owner) headers['X-GameCowork-Canvas-Session'] = owner;
  return headers;
}
export function canvasUploadHeaders(authorization) {
  if (!isLocalCanvasRoute()) return { Authorization: authorization };
  const match = window.location.pathname.match(/^\/codely-canvas\/canvas\/canvasid=([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})\/?$/i);
  if (!match) throw new Error('请先打开已保存的本地画布，再上传媒体');
  const owner = existingCanvasEditingOwner();
  if (!owner) throw new Error('本地画布编辑会话不可用，请重新打开画布');
  return { Authorization: authorization, 'X-GameCowork-Canvas-ID': match[1], 'X-GameCowork-Canvas-Session': owner };
}
export function validateCanvasLocalSession(value) {
  if (value?.mode !== 'local' || value.user?.id !== 'gamecowork-local' || value.user?.role !== 'local' ||
      typeof value.user.username !== 'string' || !value.user.username.trim() || value.user.username.length > 128 ||
      value.session?.scope !== 'gamecowork-canvas-local' ||
      typeof value.session.id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value.session.id) ||
      value.tokens != null || ['points', 'vip', 'unity_id', 'api_token', 'membership'].some(key => Object.hasOwn(value.user || {}, key))) {
    throw new Error('画布未收到有效的 GameCowork 本地会话');
  }
  return Object.freeze({ mode: 'local',
    user: Object.freeze({ id: value.user.id, username: value.user.username, role: 'local', mode: 'local' }),
    session: Object.freeze({ id: value.session.id, scope: value.session.scope }) });
}

// Additive official identity overlay from the Codely account broker. The
// broker exchanges and reads profile/points server-side; no Canvas token may
// appear here and the local storage session remains authoritative.
export function validateCanvasOfficialOverlay(value) {
  const user = value?.user;
  const roleOk = typeof user?.role === 'string' && !!user.role && user.role.length <= 32 && !/[\u0000-\u001f\u007f]/.test(user.role);
  if (value?.mode !== 'codely-official' || !roleOk ||
      !(user.id === null || user.id === undefined || typeof user.id === 'string' && user.id.length <= 64) ||
      typeof user?.username !== 'string' || !user.username.trim() || user.username.length > 128 ||
      !(user.unityId === null || user.unityId === undefined || typeof user.unityId === 'string' && user.unityId.length <= 128) ||
      value.tokens != null || value.token != null ||
      ['access_token', 'refresh_token', 'jwt', 'api_token', 'membership', 'vip'].some(key => Object.hasOwn(user || {}, key))) {
    throw new Error('画布收到的官方账号身份无效');
  }
  const numeric = candidate => typeof candidate === 'number' ? Number.isFinite(candidate)
    : typeof candidate === 'string' && candidate.length <= 64 && /^-?\d+(?:\.\d+)?$/.test(candidate);
  const points = value.points && typeof value.points === 'object' && !Array.isArray(value.points) && numeric(value.points.points)
    ? Object.freeze({ points: value.points.points, ...(numeric(value.points.total) ? { total: value.points.total } : {}) }) : null;
  return Object.freeze({ mode: 'codely-official',
    user: Object.freeze({ id: user.id ?? null, username: value.user.username, role: value.user.role, unityId: user.unityId ?? null }),
    points });
}
export async function fetchCanvasLocalSession(fetcher = fetch, signal) {
  const response = await fetcher(canvasSessionEndpoint, { method: 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error', signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`本地画布服务暂不可用（${response.status}）`);
  const raw = await response.json();
  const value = validateCanvasLocalSession(raw);
  // An invalid official overlay must fail loudly instead of silently
  // degrading to the plain local identity.
  if (raw.official !== undefined) return Object.freeze({ ...value, official: validateCanvasOfficialOverlay(raw.official) });
  return value;
}
export function makeCanvasLocalAuthValue(session, loading, refresh, disconnect, report) {
  const official = session?.official || null;
  const officialUser = official?.user || null;
  const rejectPlatformLogin = async () => { const message = official ? '已在 GameCowork 使用官方账号登录，无需重复登录' : '当前使用 GameCowork 本地模式，不连接平台账号'; report(message); throw new Error(message); };
  const user = officialUser ? Object.freeze({
    id: officialUser.id ?? session.user.id, username: officialUser.username,
    role: officialUser.role, mode: 'codely-official', localSessionScope: session.session.scope,
  }) : session?.user || null;
  return {
    mode: 'local', user, tokens: null, official: official ? { mode: official.mode, points: official.points } : null,
    // Legacy property names refer only to the verified local session here.
    isLoggedIn: !!session, hasToken: !!session, loading,
    login: rejectPlatformLogin,
    loginWithUnity: () => report(official ? '已在 GameCowork 使用官方账号登录' : '当前使用 GameCowork 本地模式，不连接平台账号'),
    logout: disconnect, refreshProfile: refresh,
    updatePoints: async () => (official ? { available: official.points !== null, mode: 'codely-official', points: official.points } : { available: false, mode: 'local' }),
    getAccessToken: () => session?.session.id || null,
    localSessionScope: session?.session.scope || null,
  };
}
export function CanvasLocalAuthProvider({ React: R, context, setRuntimeToken, children }) {
  const [session, setSession] = R.useState(null), [loading, setLoading] = R.useState(true), [error, setError] = R.useState('');
  const active = R.useRef(false), generation = R.useRef(0), pending = R.useRef(null);
  const refresh = R.useCallback(async () => {
    const epoch = ++generation.current; pending.current?.abort(); const controller = new AbortController(); pending.current = controller;
    setLoading(true); setError('');
    try {
      const value = await fetchCanvasLocalSession(fetch, controller.signal);
      if (!active.current || epoch !== generation.current) return;
      setSession(value); setRuntimeToken(value.session.id);
    } catch (reason) {
      if (!active.current || epoch !== generation.current || controller.signal.aborted) return;
      setSession(null); setRuntimeToken(''); setError(reason instanceof Error ? reason.message : String(reason));
    } finally { if (active.current && epoch === generation.current) { pending.current = null; setLoading(false); } }
  }, [setRuntimeToken]);
  R.useEffect(() => {
    active.current = true; void refresh();
    const changed = event => {
      if (event.source !== window.parent || event.origin !== window.location.origin ||
          event.data?.type !== 'gamecowork:local-session-changed') return;
      // Parent messages invalidate only; identity still comes from our HTTP service.
      void refresh();
    };
    const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
    window.addEventListener('message', changed);
    document.addEventListener('visibilitychange', visible);
    return () => {
      active.current = false; generation.current++; pending.current?.abort(); setRuntimeToken('');
      window.removeEventListener('message', changed);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [refresh, setRuntimeToken]);
  const disconnect = R.useCallback(() => {
    generation.current++; pending.current?.abort(); pending.current = null;
    setSession(null); setRuntimeToken(''); setLoading(false); setError('本地画布会话已断开，可重新连接');
  }, [setRuntimeToken]);
  const value = R.useMemo(() => makeCanvasLocalAuthValue(session, loading, refresh, disconnect, setError), [session, loading, refresh, disconnect]);
  const status = error ? R.createElement('div', { role: 'alert', 'data-testid': 'canvas-local-session-error',
    style: { position: 'fixed', zIndex: 12000, bottom: 10, left: 10, maxWidth: 520, padding: '8px 12px', borderRadius: 6, background: 'var(--color-panel, #222)', color: 'var(--color-text-primary, #eee)' } },
    error, ' ', R.createElement('button', { type: 'button', onClick: () => void refresh() }, '重新连接本地画布')) : null;
  return R.createElement(context.Provider, { value }, children, status);
}
