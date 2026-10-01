# MCP 服务器管理 / OAuth 认证 / elicitation —— core 实现事实

> 提取批次: 第二轮 core 域深挖 T7（2026-10-01）
> 来源: `restored/core-gamecowork-binary/binary/out/index.beautified.js`（与原版 codely-binary 同源）、
> `restored/frontend/dist-beautified/assets/VscTheme-BExNMG_K.js`。
> 服务于 HANDOFF 缺口: 「真实 HTTP MCP 配置」之外的 **stdio MCP / OAuth MCP / 认证清理**（自定义管理 22 项未覆盖域）。

## 0. 结论摘要

原版 MCP 管理的真实现不在 core 里，而是 **core 组装 CLI 子命令**（`mcp add/remove/enable/disable --scope`）+ **core 自己跑 OAuth 回调服务器**。elicitation 只有 SDK 协议面，**前端无任何 UI**。

## 1. addMcpServer —— CLI 命令组装契约（index.beautified.js:334259）

请求字段：`{name, type: "stdio"|"sse"|"streamable-http", command?, args?, env?, url?, headers?, scope: "global"|"project", overwrite?, previousName?}`

| type | CLI 组装 |
|---|---|
| stdio | `mcp add <name> <command> [args...] --transport stdio [--env K=V ...]`（command 必填，否则抛 "Command is required for stdio type"） |
| sse | `mcp add <name> <url> --transport sse [--header "K: V" ...]` |
| streamable-http | `mcp add <name> <url> --transport http [--header "K: V" ...]` |

- scope：`global → --scope user`；否则 `--scope project`。
- `overwrite && previousName !== name` 时补发 `mcp remove <previousName> --scope ...`。
- 成功路径：`gcuOfflineMcpDiscovery` 离线发现（deferred 时直接回 `{status:"success", discoveryState:"deferred"}` 并广播 `mcp/statusUpdate`），否则 `refreshMcpAcpSession` + `getOrCreateAcpEntry(og,{forceRestart:true})` + `reloadAcpMcpConfig` + `restartAllAcpSessions()`。失败回 `{status:"error", error}`。
- `config/deleteMcpServer`（:334217）**先 `cleanupOAuthForServer(name, configLevel)` 清 OAuth 令牌**再调 CLI remove —— 删服务器必须清凭据。

## 2. OAuth 认证流（仅 SSE / Streamable HTTP）

### 2.1 入口与回调服务器（index.beautified.js:125426-125515）

- `mcp/startAuthentication {server, sessionId, workspaceKey}`（:334675）：core 将该 server 状态置 `authenticating`（广播 `mcp/statusUpdate`），记录 `mcpAuthSessionByServer.set(server.name, sessionId)`，然后 `xur(server, ide, true)`。
- `xur`：**只接受 sse/http 传输**，否则 toast "OAuth is only supported for SSE and Streamable HTTP transports"；先清理旧令牌（`nRt`），取回调端口（`rsl()`，默认常量 **HVe=3000**），构造 OAuth provider `EC`，跳元数据发现。
- **本地回调服务器**：HTTP server 监听 `http://localhost:3000`（redirect URL 即此）；收到 `?code=` 后回 HTML "Authentication Complete. You can close this page now."，浏览器侧完成即关服。
- 元数据发现顺序（:124135-124218）：`/.well-known/oauth-protected-resource` → `/.well-known/oauth-authorization-server`（含路径前缀变体）→ OIDC provider metadata。
- 令牌存储：globalContext **`mcpOauthStorage`**，二级键 `[{oauthServerUrl}]: {[tokenKey]: value}`（:125526-125535），删除按 serverUrl 整组清。
- 授权成功（返回 `"AUTHORIZED"`）→ `syncOAuthTokenToGameCoworkCliAndReconnect(server, sessionId)`（:339897）——**把令牌同步给 Agent CLI 并重连**；core 还注册了令牌刷新监听 `Lur(...)`（:334671）在刷新时自动再同步。

### 2.2 前端（VscTheme-BExNMG_K.js:165215+）

MCP 列表项按钮：点击后本地把状态改 `authenticating`，`request("mcp/startAuthentication", {server, sessionId, workspaceKey})`；enable/disable 走 `mcp/setServerEnabled {name, configLevel, enabled, sessionId, workspaceKey}`，User/System 级变更后触发全局 MCP 刷新回调。状态枚举含 `connecting / authenticating / not-connected`。

### 2.3 移除认证

`mcp/removeAuthentication {server…}`（:334686）→ `fVe(server, ide)`（对 server transport 构造 provider 调 `.clear()` 清令牌）→ `MCPManagerSingleton.refreshConnection(server.id)` 重连。

## 3. mcp/statusUpdate 与离线发现

- MCP 状态真源在 ACP：`manager.mcpRequest(acpSessionId,"list")` → `acpMcpServerToMcpServerStatus`（:339811-339829）。
- 离线（ACP 不可用）时 `gcuOfflineMcpDiscovery(t)` 产出 `discoveryState:"deferred"` 的降级路径——**添加/删除/启停在无会话时也要给出成功回执并广播缓存状态**，不要求 ACP 活着。
- `mcp/setServerEnabled`（:334689）：CLI `mcp enable|disable <name> --scope user|project`（configLevel "Workspace"→project），enabled 时额外 reloadAcpMcpConfig，最后统一 `restartAllAcpSessions()`。
- `mcp/list` / `mcp/getPrompt {serverName, promptName, args}`（:334666）返回 `{prompt, description}`；`mcp/getResource` 同类。

## 4. elicitation —— 只有协议，没有 UI（诚实结论）

- core 内嵌 MCP SDK 的 elicitation schema：`elicitation/create`（form 模式与 **url 模式**，`{mode:"url", message, elicitationId, url}`，:111767-111769）、`notifications/elicitation/complete {elicitationId}`（:111771）、错误码 `UrlElicitationRequired`（data.elicitations 列表，:111808）。
- 347 条前端 invoke 与全部 dist chunk 中 **"elicitation" 零命中**（grep 验证）——原版桌面前端未实现 elicitation 交互 UI；SDK 侧要求客户端声明 `supportsFormMode/supportsUrlMode` 能力（:122958-122962），未声明即抛 "Client does not support … elicitation requests"。
- 复刻含义：GameCowork 若不支持 elicitation，需在 ACP/MCP 客户端能力里显式不声明，并对 `elicitation/create` 回明确错误；不能只做 OAuth 就宣称"完整 MCP 支持"。

## 5. 复刻注意事项

- OAuth 端口固定 3000 会在被占用时失败——原版用常量端口（`rsl()` 可覆盖），复刻应显式处理端口冲突。
- 令牌的 key 是 **serverUrl** 而非 server 名：同名服务器换 URL 视为不同凭据。
- CLI 组装里 env/header 的格式是 `--env K=V`、`--header "K: V"`（冒号后一个空格），逐条传。
- 删除/停用后必须 `restartAllAcpSessions()`，否则已在跑的会话继续持旧 MCP 集。
- `GAMECOWORK_LOCAL_PROVIDER_MODE=1` 时本地模式已有降级回执（如 listRemote 返回 `supported:false, reason`），复刻本地模式可沿用此模式。
