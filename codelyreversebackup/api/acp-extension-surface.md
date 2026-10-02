# ACP 扩展方法总表与遗留三域收口（T11，2026-10-02）

> 第三轮深挖。来源: 维护副本 `src/core/binary/out/index.js`（与原版 core 载荷同源）、
> `src/agent/cli-main.beautified.js`、`src/frontend/bundle/assets/VscTheme-*.js`（原版 dist 同源）。
> 全程只读，未运行原版 EXE/CLI，未触碰凭据。前两轮见 REVERSE-PLAN §3/§6；
> 本轮收口 §6 遗留三项（ide/* 云服务域、extensions userEnvConfig 对话框 UX、
> unity/installMcpPackage 桥侧链路），并首次完整提取 core↔CLI(ACP) 扩展方法总表。

## 1. 为什么这张表重要

core 与 Agent CLI 之间是 ACP（Agent Client Protocol）JSON-RPC 连接。除标准 ACP 方法外，
原版通过 `callExtensionMethod` 定义了一整套 `_gamecowork/` 前缀扩展方法——**这是
editor-bridge 26 管理器、C# LSP、会话检查点、组织切换等功能的真正传输层**。
T9 提取的"core 内嵌 8 个 Unity 工具 schema"最终都落到这张表的
`_gamecowork/unity/tool/invoke` 上；T6 的 rewind 预览差分走 `_gamecowork/rewind/file_diff`。
复刻 GameCowork 的 core↔Agent 链路时，这张表就是方法名/参数/回包的完整契约。

## 2. 请求方法总表（core 侧常量 `Ur`，原变量名保留）

### 2.1 ACP 标准 face

| 常量 | 方法 | 说明 |
|---|---|---|
| `authenticate` | `authenticate` | ACP 握手认证 |
| `initialize` | `initialize` | ACP 初始化 |
| `session_cancel` | `session/cancel` | 取消会话轮次 |
| `session_load` | `session/load` | 加载历史会话 |
| `session_new` | `session/new` | 新建会话 |
| `session_prompt` | `session/prompt` | 提交用户输入 |
| `session_compress` | `_session/compress` | 上下文压缩（带 `_` 前缀，非标准） |
| `fs_read_text_file` / `fs_write_text_file` | `fs/read_text_file` / `fs/write_text_file` | Agent 反向读/写文件（core 作为 client 应答） |
| `session_request_permission` | `session/request_permission` | 工具审批请求 |
| `session_update` | `session/update` | 会话流式更新（流块/工具调用状态） |

### 2.2 `_gamecowork/unity/*` —— Unity 桥面（editor-bridge 的 core 侧对端）

| 方法 | 参数（除注明外均含 `_meta.gamecowork.projectRoot`） | 语义/回包要点 |
|---|---|---|
| `_gamecowork/unity/install_bridge` | projectRoot | 安装/升级 UPM 桥包；回包含 `previousVersion`、`installedVersion`；失败 throw `Unity bridge install failed` |
| `_gamecowork/unity/refresh` | projectRoot | 连接检测/资源刷新；失败回 `{status:"error",userStatus:"should-not-reconnected",error}` |
| `_gamecowork/unity/status` | projectRoot | 桥连接状态；回 `{status,userStatus,error}` |
| `_gamecowork/unity/connect` | projectRoot | 建立桥连接 |
| `_gamecowork/unity/disconnect` | projectRoot | core HTTP 面 `unity/disconnect` 显式回 `Unity/disconnect is not supported.`（仅扩展层存在） |
| `_gamecowork/unity/get_project_status` | projectRoot | 回 `{isUnityProject,hasUnityMcpPackage,installedPackageVersion,manifestPath,projectRoot,engineType,engineVersion}`（默认对象见 `MOt`） |
| `_gamecowork/unity/ensure_gamecowork_ignore` | projectRoot | 确保工程内 `.gamecoworkignore`；失败 throw `ensure Unity .gamecoworkignore failed` |
| `_gamecowork/unity/set_platform_type` | projectRoot + `platformType` | 设置目标平台 |
| `_gamecowork/unity/check_package_compatibility` | projectRoot | 桥包兼容性检查；回 `{success,compatibility}` |
| `_gamecowork/unity/update_package_version` | projectRoot + `version`（必填，否则 `Version is required`） | 改 manifest 中桥包版本 |
| `_gamecowork/unity/window_bridge/list_windows` | projectRoot | 通用窗口宿主：列出可捕获窗口 |
| `_gamecowork/unity/window_bridge/start_stream_server` | projectRoot + 额外参数合并 | 启动原生成流服务；回包含 `signalingUrl`（WebRTC 信令地址） |
| `_gamecowork/unity/window_bridge/stop_stream_server` | projectRoot | 停止成流服务 |
| `_gamecowork/unity/window_bridge/get_stream_server_status` | projectRoot | 成流服务状态 |
| `_gamecowork/unity/context/gameobject_names` | projectRoot | @ 上下文：Hierarchy 对象名清单 |
| `_gamecowork/unity/context/console` | projectRoot | @ 上下文：Console 日志 |
| `_gamecowork/unity/context/gameobject` | projectRoot | @ 上下文：单个 GameObject 详情 |
| `_gamecowork/unity/tool/invoke` | projectRoot + 工具参数合并 | **8 个 Unity Agent 工具的统一执行入口**（T9 schema 的对端） |
| `_gamecowork/unity_insight/status` / `_gamecowork/unity_insight/ensure` | projectRoot | Insight 索引状态/确保索引（模型驱动索引问答的后端） |

工程内桥包标识: `cn.gamecowork.bridge`（原版名 `cn.tuanjie.codely.bridge`，改名属 GameCowork 隔离；
维护副本中 ProjectVersion.txt / Packages/manifest.json 路径常量同簇可见）。

### 2.3 会话/权限/组织/回退/子代理

| 方法 | 参数 | 语义 |
|---|---|---|
| `_gamecowork/session/set_mode` | `{sessionId, collaborationMode, approvalMode}` | 设置协作模式与审批模式 |
| `_gamecowork/session/enqueue` | `{sessionId, message, inject?}` | 排队下一条用户消息；`inject:true` 为注入（不打断当前轮） |
| `_gamecowork/permission/cancel_auto_continue` | `{sessionId, toolCallId}` | 取消"自动继续"排队中的工具调用 |
| `_gamecowork/mcp` | `{sessionId, method}` / `{sessionId, method:"refresh", meta:{setEnabled}}` | 会话内 MCP 列表查询/刷新（运行期开关单个 server） |
| `_gamecowork/lsp/goToDefinition` 等 9 条 | `{filePath, line, character}` + `continueSessionId`（core HTTP 面 `lsp/*` 转发时携带） | **LSP over ACP**：hover/findReferences/documentSymbol/workspaceSymbol/goToImplementation/prepareCallHierarchy/incomingCalls/outgoingCalls。core 报错日志前缀 `[LSP_HOVER] Core callLspMethod ACP error` |
| `_gamecowork/org/list` | `{}` | 回 `{orgs, currentOrgId, multiOrgEnabled}`；`METHOD_NOT_FOUND` 视为旧 CLI 不支持并上抛 |
| `_gamecowork/org/switch` | `{orgId}` | 回 `{currentOrgId, orgName}` |
| `_gamecowork/rewind/file_diff` | `{sessionId, relativePath, scope, pointIndex?}` | 回退预览的单文件差分（T6 rewindPreview 的数据源） |
| `_gamecowork/subagent_activity/load` | `{sessionId, ref}` | 后台子代理活动懒加载（配合 `capabilities.lazySubagentActivity`） |
| `_gamecowork/request_file_permission`（源码常量 `B$t`，独立于 Ur） | — | 文件级权限请求（区别于工具级 session/request_permission） |

`createSession` 请求体携带 `_meta.gamecowork`：`{overwriteConfirmed:true, capabilities:{lazySubagentActivity:true, ...}, cwd, mcpServers}` ——
会话创建即声明能力，**旧 CLI 忽略 `_meta` 仍可工作（兼容探测点）**。

### 2.4 通知总表（core 侧常量 `xb`，core→前端/CLI 推送）

`_gamecowork/unity/status_update`、`_gamecowork/unity/package_update`（`{previousVersion, currentVersion}`）、
`_gamecowork/unity/notification`、`_gamecowork/mode_update`、
`_gamecowork/background_subagents_update`、`_gamecowork/bg_task_continuation_start|end`（后台任务续跑生命周期）、
`_gamecowork/job/update`（Job 体系，对应 editor-bridge Job）、
`_gamecowork/current_session_plan_files_update`、`_gamecowork/current_session_changed_files_update`
（当前会话 Plan/改动文件清单推送）、`_gamecowork/session/injected_user`（注入用户消息回执）。

## 3. 遗留域收口

### 3.1 ide/* = 控制面云 REST（结论：本地模式全部优雅降级）

core 中 `ide/list-assistants`、`ide/sync-secrets`、`ide/policy`、`ide/free-trial-status`
**不是 JSON-RPC，是控制面 HTTP REST**（`this.request("ide/policy",{method:"GET"})`，走登录态）：

- `GET ide/list-assistants?organizationId={id}` → 助手列表；`GET ide/policy` → 组织策略；
  `POST ide/sync-secrets {fqsns, orgScopeId}` → FQSN 密钥解析；
- 全部有 `isSignedIn()` 前置：未登录分别回 `[]` / `null` / `{found:false,fqsn,secretLocation:{secretType:NotFound}}` 映射，
  异常也吞掉回默认值（`control_plane_list_assistants` 等日志 context）；
- 另有进程内 `ide/showNotification` / `ide/resolveNotification`（`pendingIdeNotificationResolutions`
  map 以 notificationId 挂起、decision 回调）与 CLI→core 的 `ide/contextUpdate|diffAccepted|diffClosed`（IDE 协议事件）。

**复刻结论**: 本地模式无需实现这组 REST；只要未登录降级路径保持，相关 UI（团队助手/密钥同步/策略）自然隐藏。
GameCowork 自研不接原厂控制面（红线），此组只需保留"降级不报错"。

### 3.2 extensions/skills 安装对话框 userEnvConfig UX（此前只有字段名）

`userEnvConfig` 是市场条目字段（归一化后随 `config` 并列透传，前端 `t.userEnvConfig ?? null`），
结构为 `{guide_url, required_envs:[{key, title_en, title_zh, description_en, description_zh, placeholder}]}`。
安装对话框组件（VscTheme chunk 内 `fln`）行为：

- `required_envs` 为空则整块不渲染；每项渲染 label（zh 优先 `title_zh`，否则 `title_en`；均回退 `key`）+ 红色 `*` + 可选 markdown 描述 + 文本输入（placeholder）；
- 顶部 `guide_url` 渲染"Get configuration guide"链接（`openUrl` 打开）；
- 市场模式已安装（`mode==="marketplace" && isInstalled`）或 busy 时输入 readOnly；
- 已安装重装时用 `installedConfig` 预填（按 key 从 mcpConfig 回解析）；
- 值收集进 `userInputs`（`{[key]: value}`），随安装请求提交，最终写入对应 env（T7 的 `--env` 组装消费的就是它）。

### 3.3 unity/installMcpPackage 完整链路（此前只到 core 入口）

core HTTP `unity/installMcpPackage`（无参数）：

1. `fetchUnityProjectStatusForMessage()` 校验 workspace 是 Unity 工程（否则 `Current workspace is not a Unity project`）；
2. `resolveUnityAcpEntry()` 取（或建）该工程绑定的 ACP 连接，`withPinnedAcpEntry` 钉住（防会话切换竞态）；
3. 依次调 `_gamecowork/unity/install_bridge`（安装/升级 UPM 包，桥侧在 Editor 里完成下载/解包/manifest 写入/编译等待，
   见 editor-bridge-original ANALYSIS 的包安装管理器）与 `_gamecowork/unity/get_project_status` 取最新状态；
4. 推送通知 `unityPackageUpdate {previousVersion, currentVersion}`（前端刷新已安装版本角标）；
5. 失败统一 `{status:"error", error: message}`，日志 `Failed to install Unity MCP package`。

同族: `unity/checkPackageCompatibility`（非 Unity 工程回 `content:null` 不报错）、
`unity/updatePackageVersion {version}`。**桥侧安装器行为已在 editor-bridge-original 全量源码中，
core 侧仅是这三个扩展方法的调用方——遗留缺口实质已闭合。**

### 3.4 意外收获：unity/openWindowBridge（原版"在浏览器打开窗口桥"入口）

`unity/openWindowBridge {sessionId?, preferredWindowType?, autoAttach?}`：

1. 对工程 ACP 连接调 `_gamecowork/unity/window_bridge/start_stream_server` → 取 `signalingUrl`；
2. 生成 `bridgeSessionId = wb_{base36时间}_{随机6}`、`expiresAt = now + 10min`；
3. 在 signalingUrl 上追加 query：`bridgeSessionId/expiresAt/sessionId/projectRoot/preferredWindowType/autoAttach/streamBackend="native"/signalingUrl`；
4. 经 `openUrl`（shell 打开系统浏览器）打开 `windowBridge.html?...`；
5. 回包 `{bridgeSessionId, browserUrl, expiresAt}`。

即原版 windowBridge 页支持两种后端：`streamBackend=native`（Editor 内 WebRTC，见 protocol/webrtc-signaling.md）
与 GameCowork 现用的 image-frames；**query 参数契约是两种后端共用的页面入口协议**。
`window-bridge/local/:token/*path` 与 `/remote/:token/*path` 的壳代理路由见 unity-shell-side.md §3，
本轮补齐了 token 之外的全部入口参数。

## 4. 与 GameCowork 现状的映射提示（复用索引）

- GameCowork 维护的 core 已含本表全部方法（同源 bundle）；当前自研壳/前端已消费其中
  unity/status、refresh、openEditor、getEditorPid、windowBridge（image-frames 后端）、
  insight status/ensure 等子集（见 RESTORE_STATUS.md 2026-10-02 对照）。
- 未消费的高价值面：`_gamecowork/lsp/*`（C# LSP 走 ACP 的原版第二条路——GameCowork 现用
  壳内独立 C# LSP 宿主，两路并存时注意去重）、`org/*`（本地单组织可不实现）、
  `rewind/file_diff`（rewind 预览 UI 需要）、`session/enqueue` 的 inject 语义（队列追加消息）。
- 红线不变：`cn.gamecowork.bridge` 包名/`_gamecowork` 前缀是维护副本改名结果；
  对外分发物不得回用 `cn.tuanjie.codely.bridge` 原名，也不得声称桥包为原版。
