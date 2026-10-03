// Explicit user action: logging in and rendering the model menu never obtains
// official inference credentials. The Core owns all credentials and requests.
const pending = new WeakMap();
export async function enableOfficialProgramming(messenger, notify = () => {}) {
  if (pending.has(messenger)) return pending.get(messenger);
  const operation = (async () => {
    try {
      const response = await messenger.request("codelyOfficial/enable", {});
      if (response?.status === "error") throw new Error(response.error || "官方编程模型加载失败");
      const result = response?.content ?? response;
      if (!result?.enabled || !Number.isInteger(result.modelCount) || result.modelCount < 1) throw new Error("官方服务未返回可用编程模型");
      notify(`已加载 ${result.modelCount} 个 Codely 官方模型，请在模型菜单选择使用`);
      return result;
    } catch (error) {
      const message = typeof error?.message === "string" ? error.message : "官方编程模型加载失败，请重试";
      notify(message);
      return { enabled: false, error: message };
    }
  })();
  pending.set(messenger, operation);
  try { return await operation; } finally { if (pending.get(messenger) === operation) pending.delete(messenger); }
}
export function officialProgrammingMenu(groups, messenger, notify, isStreaming) {
  if (typeof window !== "undefined" && !window.GAMECOWORK_SHELL) return groups;
  const enabled = groups.some(group => group.title === "Codely 官方 · Pro");
  return [...groups, { key: "codely-official-programming", title: "Codely 官方 · Pro", items: [{
    key: "codely-official-enable", label: enabled ? "刷新 Codely 官方 · Pro 模型" : "启用 Codely 官方 · Pro 模型",
    description: "使用已登录官方账号的编程权益", onClick: async () => {
      if (await isStreaming?.()) { notify("请等待当前回复结束后启用官方模型"); return; }
      await enableOfficialProgramming(messenger, notify);
    },
  }] }];
}
