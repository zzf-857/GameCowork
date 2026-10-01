# hub/tuanjie.exe — Tuanjie Hub 本体分析（T3/tuanjie-exe-cli）

> 来源: `hub\tuanjie.exe`（102,125,568 B，PE32+ console，Bun 单文件编译——内嵌 TypeScript/JS，非传统 Poco C++ 应用；目录内 PocoFoundation.dll 为其加载的伴随库）。字符串证据: `strings-tuanjie-exe.txt`（本文档同目录）+ temp 全量 TSV。
> 定位: **壳 cowork.exe 的"hub process"就是它**（HUB_PIPE_HANDLE/JSON-RPC 对端），同时是编辑器安装器、项目管理器、许可中介（转 LicensingClient）。

## 1. 进程身份与握手

- **技术栈**: Bun 编译（`bun:ffi` 直接 dlopen kernel32 调 `WriteFile` 写继承句柄）；内嵌 XState 状态机（`machine.transition/resolveState/getStateNodeById`）；JSON-RPC 2.0 自实现（错误码 -32700/-32600/-32601/-32602/-32603 全套，`req=`/`resp=` 日志含脱敏——auth.setToken 的 accessToken/refreshToken 打日志时替换为 `***`）。
- **传输握手**（与壳侧 tjhub\client.rs 互证）:
  - Windows: `HUB_PIPE_HANDLE`（继承的匿名/命名管道句柄，parseInt 后 dlopen 写）；Unix: `HUB_PIPE_FD`。二者都没有则 `Neither HUB_PIPE_FD nor HUB_PIPE_HANDLE is set`。
  - 鉴权: `HUB_COWORK_TOKEN`；日志: `HUB_LOG_PATH`。
  - 分帧: 默认 `\r\n` 行 JSON（壳侧已实测）；**另兼容 LSP 式 Content-Length 分帧**（二进制内有 `content-length: (\d+)` + `\r\n\r\n` 扫描解析器——同一栈复用）。
- 事件回推: `editors.changed` 等经同一管道推给壳；壳侧对应 `tjhub/getPendingIpcPassthrough` 队列。

## 2. JSON-RPC 方法全表（52 个，从 `$.register("...")` 全量提取）

### system / auth
`system.ping`（→`{pong:true}`）· `system.echo` · `system.shutdown`
`auth.getLoginStatus` · `auth.logout` · `auth.setToken` · `auth.setCoworkToken`

### settings（对应前端 tjhub/get*Location 类）
`settings.getProjectDirectory` / `settings.setProjectDirectory` · `settings.getInstallLocation` / `settings.setInstallLocation`（支持 secondaryInstallLocation 副安装位）· `settings.getDownloadLocation` / `settings.setDownloadLocation`（配置键 `DOWNLOADS.DOWNLOAD_LOCATION_FILENAME`）

### project（16 个）
`project.getRecent` · `project.getSizes` / `project.getSize` · `project.add` · `project.addFromDisk` · `project.remove` · `project.open` · `project.openRemote` · `project.create` · `project.downloadTemplate`（事件回执 `project.onTemplateDownloaded` / `project.onTemplateDownloadError`）· `project.getTemplates` · `project.setCliArgs` · `project.toggleFavorite` · `project.connectCloud` · `project.getWatermarkStatus` · `project.museum`（内部用）

### editor（4 个）
`editor.available` · `editor.locate` · `editor.remove` · （`editor.version`/`editor.platforms` 为清单字段而非方法）

### install（9 个，对应前端 tjhub/install*/getReleases 等）
`install.getReleases` · `install.getModules` · `install.getArchive` · `install.getEulaContent` · `install.getArchiveEulaContent` · `install.enqueue` · `install.enqueueArchive` · `install.cancel` · `install.retry` · `install.uninstall`

### license（8 个，转发 LicensingClient）
`license.get` · `license.activate` · `license.activatePersonal` · `license.return` · `license.importFile` · `license.generateRequest` · `license.getServerConfig` · `license.updateServerConfig` · `entitlements.get`

### devops / 其它
`devops.getOrganizations` · `devops.getRepositories` · `livePush.markRead`

### 前端 tjhub/* ↔ Hub 方法映射（可直接照抄为壳内实现契约）

| 前端 | Hub 方法 |
|---|---|
| getStatus | auth.getLoginStatus（+壳侧状态合并） |
| getEditors | editor.available + editors.changed 事件（清单在 hub `installedEditorList`） |
| getLicenses / activateLicense / activatePersonalLicense / returnLicense / importLicenseFile / generateLicenseRequest / getServerConfig / updateServerConfig | license.* 同名语义 |
| getRecentProjects / getProjectSizes / openProject / openRemoteProject / addProject / addFromDisk / removeProject / setCliArgs / toggleFavorite / connectCloud / createProject / getTemplates / downloadTemplate / getWatermarkStatus | project.* 同名语义 |
| getOrganizations / getRepositories | devops.* |
| getReleases / getModules / getArchive / getEulaContent / getArchiveEulaContent / installEnqueue / installCancel / installRetry / enqueueArchive / uninstallEditor | install.* |
| getInstallLocation / getDownloadLocation / getProjectDirectory | settings.get* |
| locateEditor / removeEditor | editor.locate / editor.remove |
| livePush/markRead | livePush.markRead（Hub 也注册了同名方法） |

## 3. 清单与发布面（Unity Hub fork 遗产）

- 清单文件名: `editors-v2` 目录 + `releases.json` + `modules.json`（与 Unity Hub 同构）。
- releases.json 键: `version, official, beta, channel, downloadUrl, releaseNotes`；安装记录键: `installedSize, installedEditorList`。
- URL 面（483 条全量见 strings-tuanjie-exe.txt），关键:
  - `https://public-cdn.tuanjie.cn/unityhub`（+staging/dev/prod 分层、uosConfig.json）——发布清单 CDN，路径结构沿用 Unity Hub；
  - `https://codely.tuanjie.cn/download/plugin/latest/{codely-cowork,tuanjie-cowork}`——双引擎桥插件下载；
  - `https://codely.tuanjie.cn/auth/unity/token/refresh`——token 刷新（对应壳的 Unity token 交换）；
  - `https://packages.tuanjie.cn/`（UPM registry）· `https://api.tuanjie.cn/v1/users/`（identity）· `https://license.tuanjie.cn`(+`-staging`, `/manual`) · `https://minihost(-int).tuanjie.cn/hub` · `https://cdp.tuanjie.cn`（埋点）· `https://download.tuanjie.cn/download_docs/`。

## 4. 配置与数据目录

- 配置键（代码内 Config 常量）: `projectDirectory`、`secondaryInstallPath`、`installPath`、`downloadLocation`、`hubUrl`。
- 数据目录: `.tuanjie`（73 处引用，用户目录名）；`tuanjie-hub`/`tuanjie-hubcore`（子目录/服务名）；Windows `AppDataFolder` 用 SpecialFolder.ApplicationData。
- 安装标记: 安装根 `.tuanjie-cowork-install` 文件内容为渠道 ID（本机 = `dev.codelycowork.desktop`，见 v2c-and-install-marker.md）。

## 5. 对 GameCowork 的复刻要点

1. **52 方法即完整契约**: GameCowork 壳内实现 tjhub 数据面时，按 §2 表逐个对齐方法名/语义即可（无需连真 Hub）；`install.*` 队列可映射到现有 project_templates + 自有安装状态机。
2. **JSON-RPC 2.0 标准形状**（result/error、错误码表、脱敏日志）+ 双分帧兼容（`\r\n` 与 Content-Length）是现成协议模板；GameCowork 的 stdio 回执路由已同构，可对照补齐 `system.ping/echo/shutdown` 三个自检方法。
3. 安装队列语义（enqueue/cancel/retry/uninstall + onTemplateDownloaded 事件回执）与 releases.json/modules.json 清单格式可整体照抄为自研清单格式（换成自有 CDN/目录）。
4. `secondaryInstallPath`（多安装位）是 Unity Hub 成熟能力，GameCowork 编辑器发现/注册可借鉴。
