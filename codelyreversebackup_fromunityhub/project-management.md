# Unity Hub 项目管理域（projectService，2026-10-02）

> 来源: temp/GameCowork/unity-hub-asar/build/main/DiskValidatorStrategy-Baf6OtjU.js（2.73MB 主服务束，
> `//#region src/main/services/projectService/*` 原始路径保留）。只读静态分析。

## 1. 项目常量（projectService/projectConstants.ts）

| 常量 | 值 | 用途 |
|---|---|---|
| `ProjectAssetsFolderPath` | `Assets` | 工程根判定 |
| `LockFilePath` | `Temp/UnityLockfile` | **编辑器打开中判定**（path.join("Temp","UnityLockfile")） |
| `ProjectDirectoryLocalStorageKey` | `projectDir` | 新建/打开对话框的默认目录记忆 |
| `ProjectUserSettingsFolderPath` | `UserSettings` | 工程用户设置目录 |
| `ProjectSettingsFolderPath` / `ProjectSettingsFileName` | `ProjectSettings/ProjectSettings.asset` | 工程设置监听 |
| `ProjectVersionFileName` | `ProjectVersion.txt` | 编辑器版本来源（与团结一致） |
| `ProjectSettingsFilesToWatch` | [ProjectSettings.asset, ProjectVersion.txt] | **文件监听白名单**（变更触发项目列表刷新） |
| `SkipRemoveConfirmationKey` | `skipRemoveConfirmation` | 移除工程确认跳过 |
| `ProjectOrganizationKey` / `ProjectSortPreferencesKey` / `ProjectTablePreferencesKey` | `projectOrganizationSetting` / `projectSortPreferences` / `projectTablePreferences` | 项目页组织/排序/表格偏好（截图中的列表行为） |

## 2. 打开中项目的检测（Hub 特有设计）

- `openProjectsCache` + `openProjectsCacheScanned` + `pendingSocketForMapping`:
  Hub 维护"当前打开工程"缓存——**已连接编辑器经 UnityIPC socket 接入 hubIPCService**（UnityIPCServer("hubIPCService")），
  扫描期间接入的 socket 先挂起，扫描完成后映射归属；批量写状态用 debounced `saveProjects + broadcastContent`。
- `ProjectValidatorService.validateProjectNotOpen` 不止判断文件存在：不存在锁文件时返回未打开；存在时调用 `hub_fs_default.isFileUnlocked`，只有解锁失败才视为打开。`LocalProject.refreshOpenProjectsCache` 使用这一验证结果。socket 模糊归属仅在一个打开项目时映射，多个项目时不猜测。
- GameCowork 对照: own 壳的工程桥 running/capturing 状态 + 工作区注册表属同构设计；锁文件路径在团结工程内相同（Temp/UnityLockfile）。

## 3. openProject 流（分析面）

`sendOpenProjectEvent({succeeded, editorVersion, editorArchitecture, project, targetPlatform, source})` ——
打开结果分析事件含 `cloudProjectId/organizationId/localProjectId`；工程对象携带 `localProjectId`（本地路径）、
云工程 id、组织 id 三标识（对应截图中的项目行数据）。打开失败仍上报（status: Success/Error）。

## 4. VCS 数据与凭据

- `vcsManagementService.getProjectVCSData(fullProjectPath)` → `{provider, ...}`：新建/打开时读取工程版本控制状态
  （provider 取值 none/Plastic/UVCS/git...，分析字段 `source_control_provider`）。
- Hub 内嵌 git 凭据服务: `execGitCredential` 以 `GIT_TERMINAL_PROMPT=0 / GCM_INTERACTIVE=never / GCM_GUI_PROMPT=false /
  GIT_ASKPASS="" / SSH_ASKPASS=""` 调 git credential（杜绝交互弹窗）；libsecret helper 探测（2 秒超时）。
- 内置 Unity .gitignore 模板: 注释头 `github.com/github/gitignore/blob/main/Unity.gitignore`、
  `# Last synced: 2025-12-18`、`# License: CC0-1.0`——**从 github/gitignore 上游同步的 CC0 文件**，
  本次保留的完整字符串没有 PlasticSCM 附加段；UVCS `ignoreConfContent.ts` 是另一套来源，不能混入此模板的来源声明。[原静态模板](reusable/unity-project.gitignore) 可直接核对。

## 5. 与 GameCowork 的对照

- 截图中的项目列表（名称/路径/修改时间/编辑器版本/星标/云图标/Git 图标）对应:
  路径+lastModified+ProjectVersion 版本 + 收藏/云工程标识 + VCS provider 数据；own 的 getRecentProjects 行结构已覆盖此投影。
- 移除工程确认（skipRemoveConfirmation 可跳过）与"从 Hub 移除不删盘上文件"的语义与 own removeProject 一致。
- 差距: Hub 的"活动编辑器 socket 归属"比 own 的工程桥状态更早感知编辑器启动；own 可借鉴锁文件是否受锁+socket 双源。

## 6. 原代码入口

真实 `projectService`、`localProject`、VCS 状态/凭据片段与文件校验已保存，详见 [_SOURCE-INDEX.md](_SOURCE-INDEX.md) 的 `project-management`。原行号、原字节 SHA 与未解决的 bundle 依赖见 [_SOURCE-MANIFEST.json](_SOURCE-MANIFEST.json)；产品当前进展以 [RESTORE_STATUS.md](../RESTORE_STATUS.md) 为准，本篇对照只表示当时分析。
