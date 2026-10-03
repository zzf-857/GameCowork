// Own native save boundary for the original Quick/History and Canvas messages.
// A rejected native save never falls through to a browser/remote download.
const messages = {
  download_destination_exists: "目标文件已存在，请换一个文件名保存。",
  download_source_invalid: "只能下载已登记的本地素材，文件地址或素材身份无效。",
  download_source_changed: "素材已经改变或不可用，请重新打开素材后重试。",
  download_dialog_unavailable: "当前运行模式无法打开保存对话框。",
  download_busy: "已有保存对话框正在处理，请先完成或取消。",
  download_write_failed: "文件保存失败，可能留下未完成的文件，请检查目标目录和文件权限。",
};

export async function downloadGameCoworkMedia(url, filename, notify, fetcher = globalThis.fetch) {
  try {
    const response = await fetcher("/api/tauri/download-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      redirect: "error",
      body: JSON.stringify({ url, filename }),
    });
    let result;
    try { result = await response.json(); } catch { throw new Error("download_invalid_response"); }
    if (!response.ok) throw new Error(result?.error || "download_failed");
    if (result?.cancelled === true && result?.ok !== true) return { cancelled: true };
    if (result?.ok !== true || result?.cancelled === true || typeof result.path !== "string" || !result.path
      || !Number.isSafeInteger(result.byteLength) || result.byteLength < 1 || !/^[a-f0-9]{64}$/i.test(result.sha256)) {
      throw new Error("download_invalid_response");
    }
    notify("success", "文件已保存。");
    return result;
  } catch (error) {
    const code = error?.message;
    notify("error", messages[code] || "无法确认保存结果，请先检查目标文件，再决定是否重试。");
    return { ok: false };
  }
}
