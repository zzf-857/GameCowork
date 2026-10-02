export function keepAwakeFailureMessage(failure) {
  const reason = (failure instanceof Error ? failure.message : String(failure)).replace(/\s+/g, " ").trim();
  if (/persist keep-awake|workspace_state_replace_failed|permission|access.denied|EACCES|EPERM|read.only/i.test(reason))
    return "设置未保存，原设置已保留。请检查应用数据目录写入权限后重试。";
  return `无法修改防休眠设置：${reason.slice(0, 240) || "请稍后重试。"}`;
}
