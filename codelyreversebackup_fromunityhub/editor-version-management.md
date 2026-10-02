# Unity Hub Editor 版本管理域（installedEditorList / release / installer，2026-10-02）

> 来源: unity-hub-asar build/main（installedEditorList.ts、@unity/hub-generate-releases、
> unityInstallerProcess_win32、DownloadHelper、InstallModule、editor-helper-win32）+ app.asar.unpacked
> 原生模块清单。只读分析。

## 1. 安装位模型（installedEditorList.ts）

- `InstalledEditorList`: `#defaultPath`（默认安装位）+ `#baseInstallLocation` + `#secondaryInstallLocation`
  （键 `secondaryInstallPath`——Hub 设置里的"次级安装位置"）；`editors` 为合并清单。
- **持久 `installedEditorList` + 事件推送**: `INSTALL_LIST_EVENTS.AVAILABLE_EDITORS_CHANGED = "available-editors.changed"`
  ——模板缓存等消费者按该事件失效（Tuanjie 研究专项早已指出此模型，本篇给出事件名与类名实锤）。
- 编辑器路径工具（editor-helper-win32）: 日志路径 `%USERPROFILE%\AppData\Local\Unity\Editor`、
  APPDATA 探测——跨平台各有 darwin/linux/win32 三份 chunk。
- 原生探测模块（app.asar.unpacked/node_modules/@unity）: `hub-unity-editor-registry-win32-x64`（注册表扫描安装）、
  `hub-unity-editor-version-win32-x64`（EXE 版本读取）、`hub-fs-win32-x64-msvc`、`hub-launch-win32-x64-msvc`、
  `hub-elevate-win32-x64`（提权）、`proxy-helper`。

## 2. Release 服务

- **`@unity/hub-generate-releases`**（npm 包，dist 内嵌）: 架构枚举 `x86_64/arm64/unknown`；
  HEAD 请求取 content-length 计算下载体积——release 条目尺寸自动核验。
- 下载基址: `https://download.unity3d.com/download_unity/${revisionHash}/${module.url}`（模块 URL 相对 revision 目录）；
  另有 `beta.unity3d.com/download`（Beta 渠道）。
- 离线兜底: `defaultReleases-win32-*.js` 等三平台文件（内置 release 清单 fallback）；
  `releases-silicon.json`（Apple silicon 专用清单）状态文件。
- Android 模块 URL 表内嵌（dl.google.com/android/repository/...，含 installedSize/downloadSize 字段——模块元数据双体积）。

## 3. 安装/卸载流（unityInstallerProcess_win32）

- **NSIS 静默**: `installFromExe(installerPath, parameterStr, destination)`——`parameterOption = "/S"`
  （参数串可覆盖）+ `destinationOption`；卸载 `"${uninstallerPath}" /S`；
  非 .exe 卸载器抛 `INSTALLER_ERROR.WRONG_UNINSTALLER`。
- 下载引擎（DownloadHelper/downloadEngine）: `node-downloader-helper` 封装 + `paused-downloads.json`
  状态文件（暂停/恢复跨会话）；`DOWNLOAD_ITEM` 类型区分；`INSTALLER_ERROR` 错误族。
- 安装队列/取消语义由主服务束的 installerMachineService 协调（Hub 设置里的安装位置校验走
  DiskValidatorStrategy 策略族——含同名大束文件的来源）。

## 4. 与许可的联动（→ licensing.md）

- `AVAILABLE_EDITORS_CHANGED` 事件同时驱动 **`activateUlfPeIfRequired`**——装好编辑器后自动激活 ULF 个人许可
  （Unity 专属行为，见 licensing.md）。

## 5. GameCowork 对照

- own 现状: editor_installations.rs 适配 core 实时扫描 + hub_snapshot 60s 缓存；无持久 installedEditorList/事件模型
  （GAPS-AUDIT C 行 2 的 🟡 本篇给出事件名契约）；安装队列域整体未接（❌）。
- 本篇提供的实现契约: 双安装位模型、available-editors.changed 事件名、download_unity/{revision}/{module} 下载路径、
  NSIS /S 参数、paused-downloads.json 断点续装、模块双体积（installedSize/downloadSize）。
  Tuanjie 分支的 tuanjie.exe 52 方法表（T3）与本域一一对应（install.getReleases/getModules/enqueue...），
  自研按 T3 方法表实现时以本篇为原始出处参照。

## 6. 可核对原代码

64 个 `editor-management` 区域已保存，包括主/次安装目录、手动 locate 存储、EditorList 事件、release 服务、Windows 安装器以及下载管理/持久化。索引见 [_SOURCE-INDEX.md](_SOURCE-INDEX.md)，每个 chunk 已与安装 ASAR 比较原字节一致。纯版本类可通过 [reusable/unity-version.mjs](reusable/unity-version.mjs) 独立加载；其前缀正则和渠道比较限制见 [REUSE_NOTES.md](REUSE_NOTES.md)。

原生注册表/EXE版本读取/提权模块只记录依赖，未复制或执行；本次没有下载、安装或卸载 Editor。产品实际进展以 [RESTORE_STATUS.md](../RESTORE_STATUS.md) 为准，前文“own 现状”是初期对照范围。
