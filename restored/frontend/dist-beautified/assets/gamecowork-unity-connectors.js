// Shared by both restored GUI generations. Connection setup never starts a model.
export const unityViews = Object.freeze([
  ["Scene", "场景", "UnityEditor.SceneView"],
  ["Game", "游戏", "UnityEditor.GameView"],
  ["Hierarchy", "层级", "UnityEditor.SceneHierarchyWindow"],
  ["Inspector", "检查器", "UnityEditor.InspectorWindow"],
  ["Console", "控制台", "UnityEditor.ConsoleWindow"],
  ["Project", "资源", "UnityEditor.ProjectBrowser"],
]);

// Automatic status polling and manual connector actions share the same clocks.
export const unityConnectionEpochs = new Map();
export function beginUnityConnectionProbe(owner, channel) {
  const key = `local-editor:${owner.workspaceKey || "default"}:${channel}`;
  const epoch = (unityConnectionEpochs.get(key) || 0) + 1;
  unityConnectionEpochs.set(key, epoch);
  return () => unityConnectionEpochs.get(key) === epoch;
}

export function unityReply(reply) {
  let value = reply;
  for (let depth = 0; depth < 4; depth++) {
    if (!value || typeof value !== "object") throw new Error("编辑器返回了无效响应");
    if (value.status === "error") throw new Error(value.error || "编辑器请求失败");
    if (value.status === "success" && value.content && typeof value.content === "object") value = value.content;
    else return value;
  }
  throw new Error("编辑器响应层级无效");
}

export function unityOwner(projectInfo, workspaceKey) {
  if (!projectInfo?.isUnityProject || !projectInfo.projectRoot) return null;
  return {
    ...(workspaceKey ? { workspaceKey } : {}),
    workspaceRef: { runOn: "local", workspaceDir: projectInfo.projectRoot },
  };
}

export function openUnityViews(owner, windowType, target = window) {
  if (!owner?.workspaceRef?.workspaceDir || owner.workspaceRef.runOn !== "local") return false;
  if (windowType && !unityViews.some(view => view[2] === windowType)) return false;
  target.postMessage({ source: "tauriShell", messageType: "shell/openUnityViews", data: {
    workspaceKey: owner.workspaceKey || null, workspaceRoot: owner.workspaceRef.workspaceDir,
    ...(windowType ? { windowType } : {}),
  } }, target.location.origin);
  return true;
}

async function boundedRequest(messenger, kind, owner) {
  let timer;
  try {
    return unityReply(await Promise.race([
      messenger.request(kind, owner),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("连接检查超时，请检查 Unity Console 后重试")), 12000); }),
    ]));
  } finally { clearTimeout(timer); }
}

export async function readUnityMetadata(messenger, owner, isCurrent = () => true) {
  const metadata = await boundedRequest(messenger, "unity/getProjectStatus", owner);
  if (!isCurrent()) return null;
  if (metadata.isUnityProject !== true || metadata.projectRoot == null) throw new Error("无法确认连接桥所属工程");
  const normalize = value => String(value).replaceAll("\\", "/").replace(/\/$/, "").toLowerCase();
  if (normalize(metadata.projectRoot) !== normalize(owner.workspaceRef.workspaceDir)) throw new Error("连接桥工程身份不匹配");
  return metadata;
}

export async function setupUnityBridge(messenger, owner, isCurrent = () => true) {
  const installed = await boundedRequest(messenger, "unity/installMcpPackage", owner);
  if (!isCurrent()) return null;
  if (installed.requiresEditorImport !== true) throw new Error("连接桥安装回执无效");
  return readUnityMetadata(messenger, owner, isCurrent);
}

export function GameCoworkUnityConnector({ react: R, jsx: j, projectInfo, workspaceKey, status, isRemote,
  messenger, connected, launching, onStatus, onProjectInfo, closePopover, variant = "compact", onView, onOpenEditor }) {
  const [busy, setBusy] = R.useState(false), [message, setMessage] = R.useState("");
  const request = R.useRef(0), currentOwner = R.useRef("");
  const owner = unityOwner(projectInfo, workspaceKey);
  const ownerKey = JSON.stringify(owner);
  currentOwner.current = ownerKey;
  R.useEffect(() => { request.current++; setBusy(false); setMessage(""); return () => { request.current++; }; }, [ownerKey]);
  R.useEffect(() => { setMessage(""); }, [connected]);
  if (!window.GAMECOWORK_SHELL || !owner || isRemote) return null;
  const installed = projectInfo.hasUnityMcpPackage === true;
  const run = async install => {
    if (busy) return;
    const generation = ++request.current, fixedOwner = owner;
    const isCurrent = () => request.current === generation && currentOwner.current === ownerKey;
    const metadataCurrent = beginUnityConnectionProbe(owner, "project");
    let statusCurrent = beginUnityConnectionProbe(owner, "status");
    setBusy(true); setMessage("");
    try {
      const metadata = await (install ? setupUnityBridge : readUnityMetadata)(messenger, fixedOwner, isCurrent);
      if (!isCurrent() || !metadata) return;
      if (metadataCurrent()) onProjectInfo(metadata);
      statusCurrent = beginUnityConnectionProbe(owner, "status");
      const reply = await boundedRequest(messenger, "unity/getStatus", fixedOwner);
      if (!isCurrent()) return;
      if (!statusCurrent()) { setMessage(""); return; }
      onStatus(reply);
      setMessage(reply.status === "connected" ? "连接成功，可选择下方实时视图。" : install
        ? "连接桥已配置。请让 Unity 完成导入与编译，再点击重新检测。"
        : "尚未连接。请打开此工程，检查 Unity Console 的编译错误后重试。");
    } catch (error) {
      if (isCurrent() && statusCurrent()) { setMessage(error.message); onStatus({ status: "not-connected", error: error.message }); }
    } finally { if (isCurrent()) setBusy(false); }
  };
  const buttonClass = "bg-transparent cursor-pointer rounded-lg border border-solid border-gamecowork-color-border-default px-2 py-1 text-xs text-gamecowork-color-text-primary transition-colors hover:bg-gamecowork-color-interactive-hover disabled:opacity-50 disabled:cursor-not-allowed";
  const panel = variant === "panel";
  const open = type => { if (panel && type && onView) onView(type); else if (openUnityViews(owner, type)) closePopover?.(); };
  return j.jsxs("div", { "data-testid": panel ? "unity-streaming-connectors" : "unity-connectors", style: { padding: panel ? "8px" : "8px 12px 0", display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--gamecowork-color-border-subtle)", background: "var(--gamecowork-color-surface-primary)" }, children: [
    panel && j.jsx("div", { role: "status", style: { fontSize: 12, color: connected ? "var(--gamecowork-color-accent-default)" : "var(--gamecowork-color-text-primary)" }, children: `${projectInfo.engineType === "Tuanjie" ? "团结" : "Unity"} 编辑器 · ${connected ? "已连接" : launching ? "连接中" : "未连接"}` }),
    (!panel || !connected) && j.jsx("p", { role: "status", className: "m-0 text-xs leading-4 text-gamecowork-color-text-tertiary", children: message || (!installed
      ? "此工程尚未配置 GameCowork 连接桥。安装后由 Unity 导入与编译。"
      : launching ? "正在等待编辑器连接，超时后可重新检测。"
      : connected ? "已连接到此工程的 Unity 编辑器。" : "连接桥已配置，等待此工程的编辑器。") }),
    !connected && status?.error && j.jsx("p", { className: "m-0 break-words text-xs text-gamecowork-color-status-warning-text", children: status.error }),
    j.jsxs("div", { className: "flex flex-wrap gap-1", children: [
      !connected && j.jsx("button", { type: "button", className: buttonClass, disabled: busy, "data-telemetry-id": "unity_install_local_bridge", onClick: () => void run(true), children: busy ? "处理中…" : installed ? "重新配置连接桥" : "安装连接桥" }),
      j.jsx("button", { type: "button", className: buttonClass, disabled: busy, "data-telemetry-id": "unity_retry_connection", onClick: () => void run(false), children: busy ? "检测中…" : "重新检测" }),
      !panel && j.jsx("button", { type: "button", className: buttonClass, "data-telemetry-id": "unity_open_views", onClick: () => open(), children: "打开串流面板" }),
      panel && !connected && onOpenEditor && j.jsx("button", { type: "button", className: buttonClass, disabled: busy || launching, onClick: onOpenEditor, children: "打开编辑器" }),
    ] }),
    panel && j.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, "aria-label": "Unity 视图连接器", children: unityViews.map(([name, label, type]) => j.jsx("button", {
      type: "button", className: buttonClass, disabled: !connected, title: connected ? `显示 ${name} 实时视图` : "连接成功后显示实时视图",
      "data-unity-view-type": type, onClick: () => open(type), children: `${name} · ${label}`,
    }, type)) }),
  ] });
}

export function unityDiscoveryOwner({ workspaceKey, workspaceRoot, isOpen, isRemote }) {
  if (!isOpen || isRemote || typeof workspaceKey !== "string" || !workspaceKey ||
      typeof workspaceRoot !== "string" || !workspaceRoot.trim()) return null;
  return { workspaceKey, workspaceRef: { runOn: "local", workspaceDir: workspaceRoot } };
}

export async function discoverUnityProject(messenger, owner, isCurrent = () => true) {
  if (!owner?.workspaceKey || owner.workspaceRef?.runOn !== "local" || !owner.workspaceRef.workspaceDir)
    throw new Error("请先打开本地工作区，再识别工程类型。");
  const metadata = await boundedRequest(messenger, "unity/getProjectStatus", owner);
  if (!isCurrent()) return null;
  if (typeof metadata.isUnityProject !== "boolean") throw new Error("工程识别响应不完整，请重试。");
  const normalize = value => typeof value === "string" ? value.replaceAll("\\", "/").replace(/\/+$/, "").toLowerCase() : "";
  if (metadata.projectRoot && normalize(metadata.projectRoot) !== normalize(owner.workspaceRef.workspaceDir))
    throw new Error("工程识别结果与当前工作区目录不匹配，请重试。");
  if (metadata.isUnityProject) {
    if (!normalize(metadata.projectRoot)) throw new Error("工程识别结果缺少目录，无法确认编辑器身份。");
    const engineType = typeof metadata.engineType === "string" ? metadata.engineType.toLowerCase() : "";
    if (!["unity", "tuanjie"].includes(engineType)) throw new Error("工程类型信息不完整，请重试。");
    return { ...metadata, engineType: engineType === "tuanjie" ? "Tuanjie" : "Unity" };
  }
  return metadata;
}

export function GameCoworkUnityDiscovery({ react: R, jsx: j, workspaceKey, workspaceRoot, isOpen, isRemote, messenger, reason, onProjectInfo }) {
  const [busy, setBusy] = R.useState(false), [message, setMessage] = R.useState("");
  const request = R.useRef(0), currentOwner = R.useRef("");
  const owner = unityDiscoveryOwner({ workspaceKey, workspaceRoot, isOpen, isRemote });
  const ownerKey = JSON.stringify({ workspaceKey, workspaceRoot, isOpen, isRemote });
  currentOwner.current = ownerKey;
  R.useEffect(() => { request.current++; setBusy(false); setMessage(""); return () => { request.current++; }; }, [ownerKey]);
  const run = async () => {
    if (busy || !owner) return;
    const generation = ++request.current, fixedOwner = owner;
    const sameOwner = () => request.current === generation && currentOwner.current === ownerKey;
    const latestProbe = beginUnityConnectionProbe(fixedOwner, "project");
    const isCurrent = () => sameOwner() && latestProbe();
    setBusy(true); setMessage("");
    try {
      const metadata = await discoverUnityProject(messenger, fixedOwner, isCurrent);
      if (!isCurrent() || !metadata) return;
      onProjectInfo(metadata);
      if (!metadata.isUnityProject) setMessage("当前工作区不是 Unity 或团结工程，不支持编辑器串流。请选择包含 ProjectSettings 的工程。");
    } catch (error) {
      if (isCurrent()) setMessage(error.message || "工程识别失败，请重试。");
    } finally { if (sameOwner()) setBusy(false); }
  };
  const explanation = !isOpen ? "此工作区已关闭，请重新打开后识别工程。" : isRemote
    ? "此面板目前只支持已打开的本地 Unity 或团结工程。" : busy ? "正在读取此工作区的本地工程信息…"
    : message || (typeof reason === "string" ? reason : "") || "尚未确认此工作区的编辑器类型。点击重新识别工程，可读取本地工程信息。";
  return j.jsxs("div", { "data-testid": "unity-streaming-discovery", style: { padding: 8, display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--gamecowork-color-border-subtle)", background: "var(--gamecowork-color-surface-primary)" }, children: [
    j.jsx("div", { style: { fontSize: 12 }, children: "编辑器串流 · 工程待识别" }),
    j.jsx("p", { role: "status", className: "m-0 break-words text-xs leading-4 text-gamecowork-color-text-tertiary", children: explanation }),
    j.jsx("button", { type: "button", disabled: busy || !owner, "data-testid": "unity-discover-project", "data-telemetry-id": "unity_discover_project", onClick: run,
      className: "self-start bg-transparent cursor-pointer rounded-lg border border-solid border-gamecowork-color-border-default px-2 py-1 text-xs text-gamecowork-color-text-primary disabled:opacity-50 disabled:cursor-not-allowed", children: busy ? "识别中…" : "重新识别工程" }),
  ] });
}
