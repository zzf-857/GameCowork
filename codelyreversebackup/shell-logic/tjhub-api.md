# 原版壳 tjhub / Hub 客户端 API 还原（T1.3）

> 来源: cowork.exe 模块簇 `src\tjhub\client.rs`、`src\messages\tjhub.rs`、`src\auth\auth.rs`、`src\lsp\client.rs`(实为 hub 客户端) + URL 面。
> 对应 HANDOFF P1「逐项清理未接通操作」中所有 tjhub/* 命令、设备码登录、云配置链路。

## 1. "tjhub" 的三条腿（关键架构结论）

原版壳里 `tjhub` 不是单一服务，而是三个不同对端：

| 腿 | 对端 | 传输 | 模块 |
|---|---|---|---|
| A. Hub 子进程 | `hub\tuanjie.exe`（**Tuanjie Hub 本体**，102MB Poco C++） | **stdio JSON-RPC over 匿名管道**（句柄经 `HUB_PIPE_HANDLE` 环境变量继承，鉴权 `HUB_COWORK_TOKEN`，日志 `HUB_LOG_PATH`） | `src\tjhub\client.rs` + `src\lsp\client.rs` |
| B. 云控制面 | `https://codely.tuanjie.cn/`（及 continue 家族 URL） | HTTPS REST | `src\auth\auth.rs`、`src\push.rs`、`src\tunnel.rs` |
| C. 许可服务 | `hub\LicensingClient\Tuanjie.Licensing.Client.exe`（.NET 8） | 命名管道 `Tuanjie-LicenseClient-{user}`（**messageType+\f 分帧协议**，见 hub-licensing/IPC-PROTOCOL.md）——由 Hub 管理，壳不直连 | — |

前端 `tjhub/*` 消息 → 按命令分发到 A/B/C 三条腿。

## 2. 腿 A：Hub 子进程（tuanjie.exe）stdio JSON-RPC 协议（tjhub\client.rs / lsp\client.rs）

> 修正（T2 反编译后确认）: LicensingClient 的管道上只有 messageType 协议（无下述方法名），因此壳拉起的 hub process 就是 `hub\tuanjie.exe`；许可操作由 Hub 内部转 LicensingClient。

- 进程管理: `Spawning hub process {cmd}` → `Hub process {name} started`；失败链 `failed to create anonymous pipe`、`failed to start hub process {name}`、`did not expose stdin`。
- 请求形状: `{method, params, id}`；响应必须含 `result` 或 `error`（`received invalid response: missing result/error` / `received invalid response for request {id}: missing result/error`）。
- 超时: `hub request {method} timed out on {hub}`；对端早退: `hub {name} closed before responding to {method}`、`hub process {name} closed pipe`；写失败 `failed to write to hub {name}: ...`；停止 `hub client stopped`。
- **已确认方法表**（参数结构体名 → 方法）:

| 方法 | 参数结构 | 用途 |
|---|---|---|
| `auth.setToken` | `SetTokenParams` | 下发登录 token |
| `auth.setCoworkToken` | `SetCoworkTokenParams` | 下发 cowork 会话 token |
| `project.getRecent` | — | 最近项目列表（对应前端 `tjhub/getRecentProjects`） |
| `project.getSizes` | `GetSizesParams` | 项目磁盘尺寸（对应 `tjhub/getProjectSizes`） |
| `editor.available` | — | 编辑器可用性 |
| `devops.getOrganizations` | — | 组织列表（对应 `tjhub/getOrganizations`） |
| `devops.getRepositories` | `GetRepositoriesParams` | 仓库列表（对应 `tjhub/getRepositories`） |
| `system.shutdown` | — | 退出 hub |

- 扩展路径模板: `extensions.codely-cli`、`${extensionPath}${/}${pathSeparator}${workspacePath}`。
- ⚠ 前端消息 `tjhub/getLicenses|activateLicense|returnLicense|importLicenseFile|generateLicenseRequest|getServerConfig|updateServerConfig` 等许可操作的对端方法名在本轮窗口未直接命中——按架构它们必然也走腿 A（.NET 侧完整类型见后续 hub-licensing/T2 产出，可反查方法名）。

## 3. 腿 A 前端命令实现（messages\tjhub.rs，全部带 `tjhub/{cmd} failed:` 错误包装）

`getStatus`、`getPendingDeepLink`、`getPendingIpcPassthrough`、`getEditors`（未启动时 `Hub client not started`）、`getRecentProjects`、`getProjectSizes`（`invalid params`）、`openProject`、`addFromDisk`、`openRemoteProject`、`connectCloud`、`addProject`、`getReleases`、`getModules`、`getEulaContent`、`getArchiveEulaContent`、`installEnqueue`、`getArchive`。
（同模块相邻还实现: `editor/selectAsset`——空路径拒绝 `Empty filepath`，转发 Unity `editor/selectAsset: forwarding to Unity (filepath=`；`editor/recompile`；`editor/setEmbedMode` + 广播事件 `cowork_embed_mode_changed`，detach 时新建 Tauri 窗口 `creating Tauri window for detach without window state, workspace=`；pet 域 `pet/submitPrompt`/`pet/getActiveSession`/`pet/reportFeedback`，`Attachments are not supported on remote workspaces`。）

## 4. 腿 B：控制面 URL 组（auth.rs + urls.txt）

- 环境变量覆盖: `CODELY_API_SERVER_ENV`、`CONTROL_PLANE_ENV`（值含 `test`）；日志 `Using configured Control Plane URL` / `Using Control Plane URL for production environment`。
- 生产: `https://codely.tuanjie.cn/`（+ `/dashboard/config`）；代码内同族: `https://api.continue.dev/`、`https://hub.continue.dev/`、测试 `https://api-test.continue.dev/`、`https://app-test.continue.dev/`、预发 `https://codely-stg.tuanjie.cn/`、本地 `http://localhost:8000/`、`http://localhost:3000|3001/`。（产品是 Continue.dev fork，云面双命名共存。）
- 插件市场: `https://codely.tuanjie.cn/plugins/cowork/latest`（`?beta=true` 变体）、CDN `https://codesearch-plugins.cdn.tuanjie.cn`；远端 `https://remote.unity.cn`。
- 自动更新: Tauri updater 内置 minisign 公钥（base64 常量在 urls.txt 首段，属验证公钥非机密）。

## 5. 登录/身份（auth\auth.rs）

- 版本标识串: `tauri2.1.3-canary.2`（与服务名 `AuthService` 相邻）。
- **设备码流程**: `Opening device auth URL` → 系统浏览器（`rundll32 url.dll,FileProtocolHandler {url}`）→ `Device auth URL opened in browser`；失败事件 `device-flow-failed`；过期 `Device authorization request has expired`（对应前端 `cancelLogin`/`notifyDeviceFlowExpired`）。
- **Unity token 交换**: `Exchanging Unity token with server` → `auth/exchange-with-unity-token`，参数 `unity_access_token`（`Calling Unity token exchange API` → `Unity token exchange API response status: {n}`）。这是团结生态登录的关键路径。
- 用户信息: `GET /auth/external/me`（`Getting user info from /auth/external/me`）。
- **token 存储键**（沿用 Continue.dev 命名）: `ContinueAccessToken`、`ContinueRefreshToken`、`ContinueAccountId`、`ContinueAccountLabel`；登出 `Logging out - clearing session info` → `Logout completed`；`Access token is empty`、`Failed to verify access token: {e}`。
- 会话信息向 core 广播: `Session info change notification fanned out to all workspaces (fire-and-forget)`、`Session info prepared for AUTH_TYPE: {x}`、`Failed to sync token to hubcore (attempt {n})` —— 壳在多工作区（CorePool）间广播同一登录态。

## 6. 附带截获：Agent TOML 模板（auth.rs 窗口内，属 unity insight agent 生成逻辑）

```toml
[model]
model = "codely-air"
auth = "codely-oauth"
wire_api = "chat"
[run]
max_turns = 15
timeout_mins = 10
inherit_core_system_prompt = false
[validation]
input_schema = { task = "string" }
query = "${task}"
```
注释原文: `Builtin transport is pinned (TOML is the ground truth). unity-insight always ...`、`Regenerated from builtin on each Settings change; removed when max_turns is default`（对应 insight_agent_toml.rs / insight_user_settings.rs）。
同窗还有 Unity Insight agent 内置提示词片段（vfs_glob/vfs_refs 用法示例、`**/*GetMainLight*` ShaderGraph 任务模板）——GameCowork 的模型驱动 Insight 问答（P2）可直接参考其提示词结构。

## 7. 对 GameCowork 的复刻要点

1. GameCowork 当前壳的 `tjhub/*` 数据面拦截是自研回填；原版真实形状是"**stdio JSON-RPC 子进程**"——若要补 `getLicenses` 等许可命令，不必连 .NET，直接按 §2 方法表在壳内实现同名 JSON-RPC 语义即可对齐前端。
2. 匿名管道句柄继承 + token 环境变量的子进程握手方式（`HUB_PIPE_HANDLE`）比端口握手更抗占用，可作为 GameCowork core/CLI 子进程通信的备选。
3. 登录态设计: GameCowork 本地身份已弱化（AGENTS 规则），但 `auth/exchange-with-unity-token` 的形状值得记录——未来接团结编辑器账号时是原厂路径，自研需自己的认证服务。
4. `project.getRecent/getSizes`、`devops.getOrganizations/getRepositories` 语义与前端字段可直接复用为壳内实现契约。
