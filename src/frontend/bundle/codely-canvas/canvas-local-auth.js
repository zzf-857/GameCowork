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
export async function fetchCanvasLocalSession(fetcher = fetch, signal) {
  const response = await fetcher(canvasSessionEndpoint, { method: 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error', signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`本地画布服务暂不可用（${response.status}）`);
  return validateCanvasLocalSession(await response.json());
}
export function makeCanvasLocalAuthValue(session, loading, refresh, disconnect, report) {
  const rejectPlatformLogin = async () => { const message = '当前使用 GameCowork 本地模式，不连接平台账号'; report(message); throw new Error(message); };
  return {
    mode: 'local', user: session?.user || null, tokens: null,
    // Legacy property names refer only to the verified local session here.
    isLoggedIn: !!session, hasToken: !!session, loading,
    login: rejectPlatformLogin,
    loginWithUnity: () => report('当前使用 GameCowork 本地模式，不连接平台账号'),
    logout: disconnect, refreshProfile: refresh,
    updatePoints: async () => ({ available: false, mode: 'local' }),
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
    return () => { active.current = false; generation.current++; pending.current?.abort(); setRuntimeToken(''); };
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
