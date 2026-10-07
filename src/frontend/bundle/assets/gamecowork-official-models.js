// Explicit user action: logging in and rendering the model menu never obtains
// official inference credentials. The Core owns all credentials and requests.
const pending = new WeakMap();
const menuPending = new WeakMap();
// Metadata is loaded through the authenticated Core config-v3 adapter. The
// original toolbar owns grouping/icons/rates/selection; no raw-id menu is added.
export async function refreshOfficialProgrammingMenu(messenger, notify = () => {}) {
  if (typeof window !== "undefined" && !window.GAMECOWORK_SHELL) return { ready: false, skipped: true };
  if (menuPending.has(messenger)) return menuPending.get(messenger);
  const operation = (async () => {
    try {
      const response = await messenger.request("codelyOfficial/refreshMenu", {});
      if (response?.status === "error") throw new Error(response.error || "内置模型目录加载失败");
      const result = response?.content ?? response;
      if (result?.source !== "original-config-v3" || typeof result.ready !== "boolean" ||
          !Number.isInteger(result.modelCount) || result.modelCount < 0) {
        throw new Error("内置模型目录回执无效");
      }
      // Backend publishes its verified canonical cache via configUpdate. This
      // helper never applies a late reply or guesses models/permissions itself.
      return result;
    } catch (error) {
      notify(typeof error?.message === "string" ? error.message : "内置模型目录暂不可用，请重试");
      return { ready: false, source: "original-config-v3", modelCount: 0 };
    }
  })();
  menuPending.set(messenger, operation);
  try { return await operation; } finally { if (menuPending.get(messenger) === operation) menuPending.delete(messenger); }
}
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
  return groups;
}
