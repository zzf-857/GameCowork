# 原版壳 命令面还原：91 条 shell 独有 invoke 消息（T1.2）

> 来源: cowork.exe 命令窗口分析（tools/analyze-shell.py commands，原始窗口 temp/GameCowork/shell-logic/analysis/commands/、commands-raw.json、commands-distilled.tsv）。
> 标记: ✅=参数/响应字段级证据；△=命令名确认、参数未从窗口分离；➡=壳不处理仅转发；∅=字符串级不存在（原版壳按通用机制处理）。

## 0. 通道机制（先读）

- 前端→壳: `window.ipc.postMessage`（wry IPC）→ 壳按名分发（Tauri invoke）。
- core→壳: core 通过 HTTP `POST /api/tauri/invoke` 调壳命令（`message` + `Content-Type` 证据在 messages\update.rs）；壳→前端用 SSE（`No GUI transport available (SSE channel not initialized)`）。
- **窗口间/无持有消息**: `shell/*`、`unity-window/*`、`jetbrains/*`、`visualstudio/*` 等命令名在 cowork.exe 中**字符串级不存在**（已逐一 grep 验证 ∅）。原版壳走**通用转发**（不按名字注册），GameCowork 的 SSE 广播同构，无需逐条实现——此处给每条标注 ∅ 结论即可对齐。

## 1. tjhub/*（17 条，转发/实现混合——见 tjhub-api.md 三条腿）

| 命令 | 结论 | 备注 |
|---|---|---|
| getStatus | ✅ | 壳状态+登录态 |
| getEditors ✅(→`editor.available` + `editors.changed` 事件) getRecentProjects ✅(→hub `project.getRecent`) getProjectSizes ✅(→hub `project.getSizes`) getProjectDirectory ✅(→`settings.getProjectDirectory`) getTemplates ✅(→`project.getTemplates`) getModules ✅(→`install.getModules`) getReleases ✅(→`install.getReleases`) getArchive ✅(→`install.getArchive`) getEulaContent ✅(→`install.getEulaContent`) getArchiveEulaContent ✅(→`install.getArchiveEulaContent`) installEnqueue ✅(→`install.enqueue`) installCancel ✅(→`install.cancel`) installRetry ✅(→`install.retry`) enqueueArchive ✅(→`install.enqueueArchive`) downloadTemplate ✅(→`project.downloadTemplate`) locateEditor ✅(→`editor.locate`) uninstallEditor ✅(→`install.uninstall`) removeEditor ✅(→`editor.remove`) removeProject ✅(→`project.remove`) addProject ✅(→`project.add`) addFromDisk ✅(→`project.addFromDisk`) openProject ✅ openRemoteProject ✅(→`project.openRemote`) connectCloud ✅(→`project.connectCloud`) getUniqueProjectName △ getInstallLocation ✅(→`settings.getInstallLocation`) getDownloadLocation ✅(→`settings.getDownloadLocation`) getOrganizations ✅(→hub `devops.getOrganizations`) getRepositories ✅(→hub `devops.getRepositories`) getWatermarkStatus ✅(→`project.getWatermarkStatus`) | | 全部对到 tuanjie.exe（Hub，Bun）注册方法，见文末对照结论 3/4 与 [../hub-installer/tuanjie-exe-cli.md](../hub-installer/tuanjie-exe-cli.md) §2 |
| activateLicense ✅ activatePersonalLicense ✅ returnLicense ✅ generateLicenseRequest ✅ importLicenseFile ✅ getLicenses ✅ getServerConfig ✅ updateServerConfig ✅ checkRosetta2 △ installRosetta2 △ setCliArgs △ toggleFavorite △ local/getDiskSpace ✅(名册含 `getDiskSpaceavailable`) | | 许可面——对端 .NET 侧见 hub-licensing/（T2 产出后回填方法名映射） |

## 2. tauri/*（窗口与桌面，12 条）

| 命令 | 结论 | 参数/响应证据 |
|---|---|---|
| openHub | ✅ | `Hub window opened` / `tauri/openHub failed:` |
| newWindow | ✅ | `New window: workspace already open` / `Created new window: {label}`；CLI 场景 `editorType, fromCli` |
| bringToFront | ✅ | handler.rs 窗口组；配 `tauri/startDragging`、`tauri/windowClose`、`tauri/windowToggleMaximize`、`tauri/windowMinimize`（同族 △） |
| setKeepAwake / getKeepAwake | ✅ | 参数 `enabled`；事件 `tauri/keepAwakeChanged`；`Failed to persist keep awake setting`；模块 messages\power.rs |
| startTunnel / stopTunnel / getTunnelStatus | ✅ | `machineName` 参数；状态机见 tunnel-remote.md §3 |
| setTunnelEnabled / getTunnelEnabled | ✅ | `enableTunnel`；`setTunnelEnabled start failed:` |
| listRemoteWorkspaces | ✅ | 参数 `excludeSelf`；GET `/api/v1/frp/remote-workspaces?exclude_tunnel_id={x}&exclude_machine_id={y}`，Bearer；响应 `tunnels/machines/workspaceAliases/Migrated`；降级 `/api/v1/frp/machines?limit=100&offset=0`；错误 `remote_discovery_failed` |
| getUpdateChannel / setUpdateChannel | ✅ | 值域 `stable|canary`；下载期间换道 `Channel changed during download; restarting check ({a}/{b})` |

## 3. 更新域（6 条 + 事件）

✅ `tauri/getPendingUpdate`（`No pending update`）、`tauri/applyUpdate`（`Apply failed:`）、事件 `tauri/update-failed`（`error`）、`tauri/update-complete`、`tauri/update-dropped`、`tauri/update-restart-required`。
状态机: `Up to date` → `Update available: {a} -> {b}` → pending 落盘校验（`Pending update {x} already on disk`、`{x} differs from manifest {y} but is still newer than current {z}; installing pending`、`Stale pending ... clearing`、`stale_redownload`）→ `Installer file missing:`。

## 4. 编辑器域（editor/*，8 条）

✅ `editor/selectAsset`（参数 `filepath`，空拒绝；`forwarding to Unity (filepath=`）、`editor/recompile`、`editor/setEmbedMode`（+事件 `cowork_embed_mode_changed`；detach 建窗 `creating Tauri window for detach without window state, workspace=`）、`editor/getEmbedMode`、`editor/getSidechat`（响应 `data/status/content`）、`editor/getColors`、`editor/onLoad`、`editor/themeChanged`（事件，壳持有）。
editor/* 大多转发进 Unity IPC 管道（见 unity-shell-side.md §1-2）。

## 5. 认证/会话域

✅ `device-flow-started`（附 `&codely-mobile://session?{query}` 移动接续链接、`accessToken`）、`cancelLogin`、`notifyDeviceFlowExpired`；流程详情见 tjhub-api.md §5。
✅ `focusContinueSessionId`、`focusContinueInputWithNewSession`、`focusContinueInputWithoutClear`（∅，通用转发）、`ide/setActiveSessionId`。
✅ `logoutOfControlPlane`（core+shell；壳侧停 SSE 桥/隧道见 tunnel-remote.md §4）。

## 6. pet / drill / 版本特性（桌宠与引导）

- pet: ✅ `pet/getSelectedPet`、`pet/setSelectedPet`、`pet/scale`（`scaleStart/scaleEnd` ∅ 转发）、`pet/getScale`、`pet/getGuides`/`setGuides`、`pet/getVisible`/`setVisible`、`pet/getPendingQueue`、`pet/submitPrompt`、`pet/getActiveSession`、`pet/reportFeedback`（提交前缀 `pet-submit-`/`pet-feedback-`，参数 `description, locale, completionOptions, attachment`）。窗口标签: `win-pet(-menu|-bubble|-submenu|-input|-file-preview)`，路由 `/pet/pet/menu|bubble|submenu|input|file-preview`，位置键 `PetPositionX/Y`。
- drill: ✅ `drill/getProgress`、`drill/updateProgress`、`drill/windowShown`、`drill/windowClosed`、`drill/drillCompleted`、`drill/updateProgress`（完成经 Unity IPC `drillCompleted`）。
- ✅ `versionUpdate/getSeenFeatures`、`versionUpdate/markFeatureSeen`（`featureId`）。

## 7. 文件/系统杂项

✅ `showFile`（IDE 协议，`filepath`）、`showOpenFilePicker`、`copyText`、`getHomedir`、`openLogFolder`、`debugUnityConsole`（Unity handler）、`applyToFile`（IDE diff 应用；壳对 `rejectDiff` 为 `Mock implementation (no-op)`）、`metrics/trackEvent`（`event_type, timestamp, user_id`，`trackEvent: unsupported event_type`）、`livePush/markRead`、`saveClipboardImage`(core)、`showVirtualFile`（`name, remoteName, extensionVersion`，虚拟内容 `virtual_file.txt`）。
∅（通用转发，已验证字符串不存在）: `shell/showToast`、`shell/openFileInPreview`、`shell/openVirtualFileInPreview`、`shell/openDiffInPreview`、`shell/openTerminalInPreview`、`shell/openUnityWindowInPreview(-Error)`、`shell/openUnityEditor`、`shell/openUnityInsightInPreview`、`shell/openInFileSearch`、`shell/modalStateChanged`、`shell/rightSidebarStateChanged`、`shell/toggleRightSidebar`、`shell/hideRightSidebar`、`shell/openRightSidebar`、`shell/adjustFontSize`、`shell/setFontSize`、`shell/fullscreenStateChanged`、`shell/maximizeStateChanged`、`shell/setMinWindowSize`、`shell/growWindowToWidth`、`shell/checkUnsavedFilesAndClose`、`shell/forceCloseApp`、`shell/setTheme`、`shell/themeChanged`（壳侧见 events）、`shell/syncProjectMenuState`、`shell/setShowProjectMenu`、`shell/unityGameControl(+Result)`、`shell/unityWindowStatusRequest(+Result)`、`shell/unityWindowStop`、`unity-window/*` 全族、`jetbrains/*`、`visualstudio/*`、`filePreviewContext`、`clearFilePreviewContext`、`insertFileMention`、`guiContextReady`、`userInput`、`busy-state`、`gamecowork-language-change`、`shell/*Lsp*` 五条。
（注: `deep-link`、`external-drag-enter/leave/drop`、`acp/webviewSurfaceReady` 为壳事件/入口名：deep-link 处理 `cowork://` 冷启动（`Cold start cowork:// link:`）；external-drag-* 由壳发出前端接收；`acp/webviewSurfaceReady` 触发 pending ACP 请求 replay + `redeliver_pending_acp_requests`。）

## 8. 与 GameCowork 的对照结论

1. GameCowork 对 ∅ 组的 SSE 广播方案 = 原版同构，**这 72 条不需要补壳实现**（与 MESSAGE-LAYERS §摘要一致，本轮已逐一验证）。
2. 真正需要补的壳侧实现是 §2-§4、§6 中 ✅ 命令（窗口管理/更新/keepAwake/tunnel/pet/drill/editor），参数表即实现契约。
3. tjhub 许可 8 条 ✅ 的对端方法名已由 T2/T3 反查闭环（来源: hub\tuanjie.exe 内嵌 Bun 代码的 `$.register(...)` 注册面，见 [../hub-installer/tuanjie-exe-cli.md](../hub-installer/tuanjie-exe-cli.md) §2；许可数据形状见 [../hub-licensing/IPC-PROTOCOL.md](../hub-licensing/IPC-PROTOCOL.md)）:

| 前端 tjhub/* | Hub JSON-RPC 方法（tuanjie.exe 注册面实锤） |
|---|---|
| tjhub/getLicenses | `license.get` |
| tjhub/activateLicense | `license.activate` |
| tjhub/activatePersonalLicense | `license.activatePersonal` |
| tjhub/returnLicense | `license.return` |
| tjhub/importLicenseFile | `license.importFile` |
| tjhub/generateLicenseRequest | `license.generateRequest` |
| tjhub/getServerConfig | `license.getServerConfig` |
| tjhub/updateServerConfig | `license.updateServerConfig` |

4. 原 △ 项（安装类/项目类 tjhub 命令）经 T3 Hub 方法表对齐: getReleases→`install.getReleases`、getModules→`install.getModules`、getArchive→`install.getArchive`、getEulaContent→`install.getEulaContent`、getArchiveEulaContent→`install.getArchiveEulaContent`、installEnqueue→`install.enqueue`、installCancel→`install.cancel`、installRetry→`install.retry`、enqueueArchive→`install.enqueueArchive`、uninstallEditor→`install.uninstall`、locateEditor→`editor.locate`、removeEditor→`editor.remove`、addProject→`project.add`、addFromDisk→`project.addFromDisk`、removeProject→`project.remove`、setCliArgs→`project.setCliArgs`、toggleFavorite→`project.toggleFavorite`、connectCloud→`project.connectCloud`、createProject→`project.create`、getTemplates→`project.getTemplates`、downloadTemplate→`project.downloadTemplate`、getUniqueProjectName/getProjectDirectory→settings 域（`settings.getProjectDirectory` 等）、getWatermarkStatus→`project.getWatermarkStatus`、openRemoteProject→`project.openRemote`。全表见 tuanjie-exe-cli.md §2。
