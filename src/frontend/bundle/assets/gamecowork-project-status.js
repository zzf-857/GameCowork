// A lock file can survive a crash. Display its presence without claiming a
// live Editor connection or changing the user's project registration.
export function projectStatusMessage(project) {
  if (project?.pathExists === false) return "项目目录不可用";
  if (project?.scanIncomplete === true && project?.recencyWarning) return "项目修改时间扫描未完成";
  if (project?.metadataWarning) return "项目元数据不可用";
  if (project?.lockFilePresent === true) return "检测到编辑器锁文件";
  return "";
}

// Prefer the host's UTC millisecond value. Invalid legacy timestamps must not
// produce NaN comparisons that preserve arbitrary discovery/path order.
export function projectModifiedAt(project) {
  if (Number.isFinite(project?.lastModifiedUnixMs) && project.lastModifiedUnixMs >= 0) return project.lastModifiedUnixMs;
  const parsed = Date.parse(project?.lastModified || "");
  return Number.isFinite(parsed) ? parsed : 0;
}
