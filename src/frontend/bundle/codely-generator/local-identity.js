// Owned identity boundary for the otherwise original Codely client. Its
// internal "authed" view state means this local GameCowork session is ready.
// Two explicit modes exist: the plain local identity, and a verified official
// identity relayed by the local HTTP service from the Codely account broker.
// No official token, membership or raw balance is supplied here either way.
import { gamecoworkGenerationReadiness } from './local-generation.js';
export function gamecoworkLocalIdentity(reply) {
  const user = reply?.user;
  const safeName = typeof user?.name === 'string' && !!user.name.trim() && user.name.length <= 100 && !/[\u0000-\u001f\u007f]/.test(user.name);
  if (reply?.mode === 'codely-official') {
    if (reply?.capabilities?.localHistory !== true || user == null ||
        !(typeof user.id === 'string' && !!user.id && user.id.length <= 64) ||
        !safeName || user.accountMode !== 'codely-official') {
      throw new Error('官方账号会话尚未就绪');
    }
    return { id: user.id, name: user.name, accountMode: 'codely-official' };
  }
  if (reply?.mode !== 'gamecowork-local' || reply?.capabilities?.localHistory !== true ||
      user?.id !== 'gamecowork-local' || user?.accountMode !== 'local' || !safeName) {
    throw new Error('GameCowork 本地会话尚未就绪');
  }
  // Deliberately keep only the real local identity fields. Platform entitlement
  // fields and arbitrary host-message content cannot enter the original store.
  return { id: user.id, name: user.name, accountMode: 'local' };
}

export function bindGameCoworkLocalIdentity({ onIdentity, hostWindow = window, hostDocument = document, fetcher = globalThis.fetch }) {
  let disposed = false, generation = 0, controller;
  const refresh = async () => {
    if (disposed) return;
    const current = ++generation;
    controller?.abort();
    const request = new AbortController(); controller = request;
    try {
      const response = await fetcher('/api/codely-generator/local-session', {
        method: 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error', signal: request.signal,
      });
      if (!response.ok) throw new Error('GameCowork 本地会话读取失败');
      const reply = await response.json(), user = gamecoworkLocalIdentity(reply);
      if (!disposed && current === generation && !request.signal.aborted) onIdentity({ status: 'ready', user, generation: gamecoworkGenerationReadiness(reply) });
    } catch (error) {
      if (!disposed && current === generation && !request.signal.aborted) onIdentity({ status: 'anonymous', user: null, generation: gamecoworkGenerationReadiness(null),
        error: error?.message === 'GameCowork 本地会话尚未就绪' ? error.message : 'GameCowork 本地会话读取失败' });
    }
  };
  const changed = event => {
    if (event.source !== hostWindow.parent || event.origin !== hostWindow.location.origin || event.data?.type !== 'gamecowork:local-session-changed') return;
    // A same-origin parent may invalidate the session, but may not provide a
    // user object or token. Only our local HTTP service establishes identity.
    void refresh();
  };
  const visible = () => { if (hostDocument.visibilityState === 'visible') void refresh(); };
  hostWindow.addEventListener('message', changed);
  hostDocument.addEventListener('visibilitychange', visible);
  void refresh();
  return () => {
    disposed = true; generation++; controller?.abort();
    hostWindow.removeEventListener('message', changed);
    hostDocument.removeEventListener('visibilitychange', visible);
  };
}
