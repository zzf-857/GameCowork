export const UNITY_LICENSE_HELP_URL = "https://docs.unity.com/en-us/hub/manage-license";
export const UNITY_HUB_INSTALL_URL = "https://docs.unity.com/en-us/hub/install-hub";

export function isGameCoworkLocalMode() {
  return typeof window !== "undefined" && window.GAMECOWORK_SHELL === true;
}

// Workspace permission and an Editor license are separate capabilities. An old
// local isValid flag must never become evidence of an activated Editor license.
export function workspaceLicenseAllowsOperation(content) {
  if (!content || typeof content !== "object") return false;
  if (isGameCoworkLocalMode() || content.mode === "local") return content.workspaceAllowed === true;
  return content.isValid === true;
}

export function createGameCoworkUnityLicenseView({ jsx, hooks, Button }) {
  return function GameCoworkUnityLicenseView({ onBack, messenger }) {
    const [busy, setBusy] = hooks.useState(false);
    const [error, setError] = hooks.useState(null);
    const [workspaceAllowed, setWorkspaceAllowed] = hooks.useState(null);
    const generation = hooks.useRef(0);
    const pending = hooks.useRef(false);
    const refresh = hooks.useCallback(async () => {
      if (pending.current) return;
      pending.current = true;
      const current = ++generation.current;
      setBusy(true);
      try {
        const response = await messenger.request("tjhub/getLicenses", undefined);
        if (current !== generation.current) return;
        if (response?.status !== "success" || response.content?.mode !== "local" ||
            typeof response.content.workspaceAllowed !== "boolean")
          throw new Error("无法读取 GameCowork 本地工作区权限，请重试。");
        setWorkspaceAllowed(response.content.workspaceAllowed);
        setError(null);
      } catch (failure) {
        if (current === generation.current) setError(failure instanceof Error ? failure.message : "无法读取本地权限，请重试。");
      } finally {
        if (current === generation.current) { pending.current = false; setBusy(false); }
      }
    }, [messenger]);
    hooks.useEffect(() => {
      void refresh();
      return () => { generation.current++; pending.current = false; };
    }, [refresh]);
    const paragraph = text => jsx.jsx("p", { className: "text-sm text-gamecowork-color-text-secondary leading-[22px]", children: text });
    const card = (title, body, children) => jsx.jsxs("section", {
      className: "p-4 rounded-lg border border-solid border-gamecowork-color-border-subtle bg-gamecowork-color-surface-sunken",
      children: [jsx.jsx("h2", { className: "text-base mb-2 text-gamecowork-color-text-primary", children: title }), paragraph(body), children],
    });
    const external = (label, url, testId) => jsx.jsx(Button, {
      variant: "ghost", size: "sm", "data-testid": testId,
      className: "px-4 text-sm rounded-lg border border-solid border-gamecowork-color-border-subtle",
      onClick: () => messenger.post("openUrl", url), children: label,
    });
    return jsx.jsxs("div", {
      "data-testid": "gamecowork-unity-licenses",
      className: "flex flex-col pl-8 pr-8 flex-1 min-h-0 overflow-auto",
      children: [
        jsx.jsxs("div", { className: "flex items-center justify-between mb-4 gap-4", children: [
          jsx.jsxs("div", { className: "flex items-center gap-3", children: [
            jsx.jsx(Button, { variant: "ghost", size: "sm", "aria-label": "返回项目", onClick: onBack, children: "←" }),
            jsx.jsx("h1", { className: "text-xl text-gamecowork-color-text-primary", children: "Unity 许可证" }),
          ] }),
          jsx.jsx(Button, { variant: "ghost", size: "sm", "data-testid": "gamecowork-license-refresh", disabled: busy,
            onClick: () => void refresh(), children: busy ? "读取中…" : "刷新本地权限" }),
        ] }),
        jsx.jsxs("div", { className: "flex flex-col gap-4 pb-6", children: [
          card("GameCowork 本地工作台", "GameCowork 的本地项目管理无需 Unity 许可证。创建、添加和打开工作区与编辑器许可分别管理。",
            jsx.jsx("p", { "data-testid": "gamecowork-workspace-permission", role: "status", className: "text-sm mt-2",
              children: workspaceAllowed === true ? "本地工作区操作可用" : workspaceAllowed === false ? "本地工作区操作当前不可用" : "正在读取本地工作区权限" })),
          card("Unity Editor 许可证", "此许可针对 Unity Editor。申请、激活和归还请在官方 Unity Hub 的设置 → 许可证中完成；具体适用方式以官方文档和你的计划为准。",
            jsx.jsxs("div", { className: "mt-3 flex flex-col gap-3", children: [
              jsx.jsx("p", { "data-testid": "gamecowork-unity-license-status", role: "status", className: "text-sm", children: "Unity 许可证：尚未检测" }),
              jsx.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                external("Unity 官方许可说明", UNITY_LICENSE_HELP_URL, "gamecowork-unity-license-help"),
                external("Unity Hub 官方安装说明", UNITY_HUB_INSTALL_URL, "gamecowork-unity-hub-download"),
              ] }),
            ] })),
          card("团结引擎许可证", "团结引擎许可由团结 Hub 独立管理。Unity 许可状态不能作为团结引擎已激活的依据。",
            jsx.jsx("p", { "data-testid": "gamecowork-tuanjie-license-status", role: "status", className: "text-sm mt-2", children: "团结引擎许可证：尚未检测" })),
          paragraph("GameCowork 当前不读取许可文件，也不代办激活或归还。启动编辑器时，仍由编辑器及其官方许可服务验证。"),
          error && jsx.jsx("div", { "data-testid": "gamecowork-license-error", role: "alert", className: "text-sm text-gamecowork-color-status-error-text", children: error }),
        ] }),
      ],
    });
  };
}
