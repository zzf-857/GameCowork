// Shared by both maintained GUI generations. Requests retain their original
// workspace, and a branch becomes visible only after its metadata is persisted.
export function createGameCoworkHistoryOperations(getContext) {
  let running = false;
  let preview = null;
  const menuCache = new Map();
  let menuSession;
  const signature = history => JSON.stringify((history || []).map(entry => ({ message: entry.message,
    editorState: entry.editorState, contextItems: entry.contextItems, toolCallStates: entry.toolCallStates })));
  function capture(payload, kind) {
    const context = getContext(), state = context.getState(), session = state.session.sessions[context.sessionId];
    if (!session || state.session.activeSessionId !== context.sessionId) return null;
    const workspaceKey = session.workspaceId || state.session.sessionIdToWorkspaceKey?.[context.sessionId] || context.workspaceKey;
    const lease = context.lease(state, workspaceKey);
    if (!context.leaseCurrent(state, lease)) return null;
    const history = session.history || [], index = history.findIndex(entry => entry.message?.role === "user" && entry.message.id === payload.messageId);
    if (index < 0) throw new Error("The selected message is no longer in this conversation");
    return { context, sessionId: context.sessionId, workspaceKey, lease, kind, payload,
      workspaceDirectory: state.hub.workspaces.find(workspace => workspace.workspaceKey === workspaceKey)?.workspaceDir,
      userInputIndex: history.slice(0, index).filter(entry => entry.message?.role === "user").length,
      userMessageIndexFromLast: history.slice(index).filter(entry => entry.message?.role === "user").length,
      history: history.slice(0, index), signature: signature(history) };
  }
  function live(scope) {
    const state = scope.context.getState(), session = state.session.sessions[scope.sessionId];
    const owner = session?.workspaceId || state.session.sessionIdToWorkspaceKey?.[scope.sessionId] || scope.workspaceKey;
    return !!session && owner === scope.workspaceKey && scope.context.leaseCurrent(state, scope.lease);
  }
  function visible(scope) {
    const state = scope.context.getState();
    return live(scope) && state.session.activeSessionId === scope.sessionId &&
      (!state.hub.isHubMode || state.hub.activeWorkspaceKey === scope.workspaceKey);
  }
  function ready(scope, requireVisible = false) {
    if (!live(scope) || (requireVisible && !visible(scope))) return false;
    const session = scope.context.getState().session.sessions[scope.sessionId];
    if (session.isInChatRound || session.isStreaming) {
      if (visible(scope)) scope.context.toast("warning", scope.context.translate(scope.kind === "fork" ? "userInput.forkErrorStreaming" : "userInput.rewindErrorStreaming"));
      return false;
    }
    if (signature(session.history) !== scope.signature) throw new Error("The conversation changed. Select the message again");
    return true;
  }
  async function request(scope, method, data) {
    const response = await scope.context.messenger.request(method, { ...data, ...(scope.workspaceKey ? { workspaceKey: scope.workspaceKey } : {}) });
    if (response?.status !== "success") throw new Error(response?.error || "Session operation failed");
    if (response.content?.status === "error") throw new Error(response.content.error || "Session operation failed");
    return response.content;
  }
  function error(scope, failure) {
    const context = scope?.context || getContext();
    if (scope && !visible(scope)) return;
    const label = scope?.kind === "fork" ? "userInput.forkConversation" : "userInput.rewindErrorFailed";
    context.toast("error", `${context.translate(label)}: ${failure instanceof Error ? failure.message : String(failure)}`);
  }
  function closePreview(scope) {
    if (preview !== scope) return;
    preview = null;
    scope.context.hidePreview();
  }
  async function branch(scope) {
    const branch = await request(scope, "history/fork", { id: scope.userMessageIndexFromLast, sessionId: scope.sessionId });
    if (!branch || typeof branch.sessionId !== "string" || !branch.sessionId || branch.sessionId === scope.sessionId)
      throw new Error("The new conversation was not returned");
    let cleanupAttempted = false;
    async function discard() {
      if (!live(scope) || cleanupAttempted) return;
      cleanupAttempted = true;
      await request(scope, "history/delete", { id: branch.sessionId });
    }
    try {
      if (!ready(scope)) { await discard(); return; }
      const nowIso = new Date().toISOString();
      branch.history = scope.history;
      branch.workspaceDirectory ||= scope.workspaceDirectory;
      const metadata = scope.context.makeHistorySave({ sessionId: branch.sessionId, title: branch.title,
        workspaceDirectory: branch.workspaceDirectory, messageCount: scope.history.length,
        useUppercaseProjectHash: branch.useUppercaseProjectHash, nowIso });
      if (!metadata) throw new Error("The new conversation could not be saved");
      await request(scope, "history/save", metadata);
      if (!ready(scope)) { await discard(); return; }
      const activate = visible(scope);
      scope.context.publishBranch(branch, { workspaceKey: scope.workspaceKey, nowIso, activate });
      if (activate) scope.context.restoreDraft(scope.sessionId, branch.sessionId, scope.payload);
    } catch (failure) {
      // Only this freshly created branch is compensated; never delete the source.
      try { await discard(); }
      catch (cleanup) { throw new Error(`${failure.message || failure}; branch cleanup failed: ${cleanup.message || cleanup}`); }
      throw failure;
    }
  }
  async function fork(payload) {
    if (running) return;
    let scope;
    try {
      scope = capture(payload, "fork");
      if (!scope || !ready(scope, true)) return;
      running = true;
      await branch(scope);
    } catch (failure) { error(scope, failure); }
    finally { running = false; }
  }
  async function rewind(payload, forkAfter) {
    if (running) return;
    let scope;
    try {
      scope = capture(payload, forkAfter ? "fork" : "rewind");
      if (!scope || !ready(scope, true)) return;
      running = true;
      const result = await request(scope, "history/rewind", { id: scope.userInputIndex, sessionId: scope.sessionId, type: "dryRun" });
      if (!ready(scope, true)) return;
      if (!result || result.canRewind === false) throw new Error("No usable file checkpoint was found");
      if (preview) closePreview(preview);
      preview = scope;
      scope.context.showPreview({ preview: result, fork: forkAfter, rewindUserIndex: scope.userInputIndex,
        slicedHistory: scope.history, onConfirm: () => confirm(scope, forkAfter), onCancel: () => closePreview(scope) });
    } catch (failure) { error(scope, failure); }
    finally { running = false; }
  }
  async function confirm(scope, forkAfter) {
    if (running || preview !== scope) return;
    let codeRequested = false;
    try {
      if (!ready(scope, true)) { closePreview(scope); return; }
      running = true;
      if (!scope.codeApplied) {
        codeRequested = true;
        const result = await request(scope, "history/rewind", { id: scope.userInputIndex, sessionId: scope.sessionId, type: "code" });
        if (result?.canRewind === false || result?.applied !== true) throw new Error("The file checkpoint was not confirmed as restored");
        scope.codeApplied = true;
      }
      if (!ready(scope)) return;
      if (forkAfter) await branch(scope);
      else if (visible(scope)) scope.context.toast("info", scope.context.translate("userInput.rewindSuccess"));
      closePreview(scope);
    } catch (failure) {
      const reason = failure instanceof Error ? failure.message : String(failure);
      error(scope, new Error(scope.codeApplied ? `Code was restored, but the conversation branch did not complete. Retry to create the branch without restoring code again. ${reason}`
        : codeRequested ? `Code restoration was not confirmed. Check the workspace files before retrying. ${reason}` : reason));
    }
    finally { running = false; }
  }
  return {
    refresh() { if (preview && !visible(preview)) closePreview(preview); },
    items(payload) {
      const context = getContext();
      if (menuSession !== context.sessionId) { menuCache.clear(); menuSession = context.sessionId; }
      const cached = menuCache.get(payload.messageId);
      if (cached && cached.editorState === payload.editorState && cached.textContent === payload.textContent && cached.translate === context.translate) return cached.items;
      const items = [
        { label: context.translate("userInput.forkConversation"), onClick: () => fork(payload) },
        { label: context.translate("userInput.rewindCode"), onClick: () => rewind(payload, false) },
        { label: context.translate("userInput.forkAndRewind"), onClick: () => rewind(payload, true) },
      ];
      menuCache.set(payload.messageId, { editorState: payload.editorState, textContent: payload.textContent, translate: context.translate, items });
      return items;
    },
  };
}
