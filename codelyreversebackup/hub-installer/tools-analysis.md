# Hub 周边小工具分析（T3/tools-analysis）

> 来源: 字符串级静态分析（temp/GameCowork/installer-strings/{process_killer,vschecker}/），未运行任何二进制。

## 1. process_killer.exe（164,184 B，PE32+，MSVC C++ 静态链接）

**用途**: 卸载/更新前批量结束本产品全部组件进程。

- **入口条件**: 必须设置环境变量 `CODELY_INSTALL_DIR`，否则报错退出（`CODELY_INSTALL_DIR env var not set or too long`）。
- **查杀依据**: 不是按进程名，而是按**版本资源 FileDescription** 精确匹配（`\StringFileInfo\%04x%04x\FileDescription` + `\VarFileInfo\Translation`），目标五种:
  - `Codely AI Code Assistant CLI`（CLI）
  - `Codely Binary`（core）
  - `Tuanjie Cli`
  - `Tuanjie Cowork`（壳/Hub）
  - `Tuanjie Editor`
- **流程**: `CreateToolhelp32Snapshot`（Process32FirstW/NextW 枚举）→ 读目标 FileDescription → 匹配则 `OpenProcess` + `TerminateProcess` + `WaitForSingleObject` 等待退出；日志 `Kill: {desc}` / `{desc} did not terminate`；异常路径 `ABORT: ...`。
- 辅助 API: `QueryFullProcessImageNameW`、`AppPolicyGetProcessTerminationMethod`、`GetModuleFileNameW`。

**对 GameCowork**: 自研卸载器/更新器需要同样的"按 FileDescription 查杀"逻辑（按 PID 清理不能覆盖外部残留进程；按进程名匹配又会误伤）。目标描述串换成 GameCowork 自己的产品名即可；注意此工具硬编码了原厂产品名与 `CODELY_INSTALL_DIR`，**不能直接复用二进制**。

## 2. VisualStudioInstallChecker.exe（150,016 B，PE32 i386，MSVC）

**用途**: 检测本机 Visual Studio 安装（供 Hub/安装器决定 Windows 构建支持组件）。

- PDB 路径泄漏构建源: `C:\Users\cassandra\myunityunity\build\VisualStudioInstallChecker\Release\VisualStudioInstallChecker.pdb`（"myunityunity" 内部仓库）。
- 参数: `Error:Expected 2 arguments, got {n}` —— 恰好 2 个参数（按 Unity Hub 同款工具惯例: `VS安装路径输出` 与 `要求的VS版本`，参数名未能从字符串确认）。
- 检测目标: `Microsoft.VisualStudio.Product.Community / Professional / Enterprise`（Setup Configuration 枚举）；输出退出码/路径供调用方解析。
- 关联: `hub/` 目录还带 `NativeProxyHelper.dll`（76KB，代理探测/设置辅助，供 Hub 云面 HTTP 走系统代理）与 `hasp_update.exe`（4.8MB，Sentinel HASP 固件/密钥更新工具，配 `hasp_rt.exe`、`haspvlib_36049.dll`——vendor id 36049，标准 Sentinel 套件，无产品自定义逻辑）。

## 3. 与壳的调用关系

壳字符串库（codelyreversebackup/strings/cowork-all-strings.txt）中 `process_killer` 无直接引用——它由**卸载器 uninstall.exe / 安装流程**调用（CODELY_INSTALL_DIR 语义即安装根）。VisualStudioInstallChecker 由 Hub 安装队列（install.* 模块链）在装 Windows 编辑器构建支持时调用。
