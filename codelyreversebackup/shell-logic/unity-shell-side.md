# 原版壳 编辑器 IPC / 窗口桥 / Insight serve 客户端还原（T1.6）

> 来源: cowork.exe 模块簇 `src\unity\ipc.rs`、`src\unity\handler.rs`、`src\unity\insight_serve_client.rs`、`src\unity\insight_agent_toml.rs`、`src\unity\insight_user_settings.rs`、`src\core\tcp_ipc_messenger.rs`、`src\ide\*`。
> 与 `editor-bridge-original/`（C# 端）互证：本文是壳侧视角，C# 端细节见该目录 ANALYSIS.md。

## 1. Unity IPC 服务器（unity\ipc.rs）——命名管道

- 管道名: `\\.\pipe\-` 前缀模板（`Creating IPC server with named pipe: {pipe} (workspace={ws})`），服务类名 `CodelyUnityIpc`；`Pipe created: {name}`。
- **路径跟随工作区切换**: `UnityIpcServer Updating IPC path to: {x}` → `IPC path updated, restarting pipe server on new path`——每工作区一条管道，切工作区重建（与 GameCowork "多工程固定来源"结论一致）。
- 客户端识别: `GetNamedPipeClientProcessId failed` / `Unity PID: {n}`；连接事件 `Unity connected!` / `Unity disconnected`、`Read error, connection closed`；建管道重试 `Failed to create pipe {name}. Retrying...`。
- 无连接时的动作失败文案: `No Unity client connected. Please ensure Unity Editor window is open.`（用于 drillCompleted / setEmbedMode / closeCodelyEditorOnWorkspaceSwitch 等）。
- **VFS 消息名（insight 问答用）**: `cowork.vfs_refs`（参数含 `direction`）、`cowork.vfs_children`、`cowork.vfs_entry`、`cowork.::` 前缀；`requireQueryableVfs` 开关字段。
- 其它消息: `recompile`、`drillCompleted`、`setEmbedMode`、`closeCodelyEditorOnWorkspaceSwitch`、`editor/getSidechat`、`editor/themeChanged`、`editor/setColors`（C# 端同名工具一一对应）。

## 2. Unity 消息处理器（unity\handler.rs）

- 消息路由: JSON `messageType` 分发（`No messageType field found`、`Unknown messageType: {x}`、`trackEvent: unsupported event_type`）；遥测字段 `event_type, timestamp, user_id`（类型 `UnityIpcHandler`）。
- 处理的动作: `AddContext`（聊天上下文注入）、`debugUnityConsole`、`focusContinueInputWithNewSession`、`add-unity-context`、`external-drop`（外部拖放进 Unity 窗口）、`tauri/openWorkspace`（参数 `path, editorType`；`workspace opening started`, `pid`）、`tauri/bringToFront`、`tauri/startDragging`、`tauri/windowClose|windowToggleMaximize|windowMinimize`。
- `Assets Packages ProjectSettings` 常量（工程根判定）。

## 3. 远程窗口桥代理（handler.rs 窗口内，P2 远程窗口的关键）

- 远程代理: `RemoteProxy`、`connection_lost`、`Invalid JSON from remote instance`、`Failed to proxy to {x}`、`remote/api/tauri/window-bridge/local/{token}` —— 远程窗口桥走本地壳 HTTP 的 token 路由。
- 桥 token: `windowBridgeProxyToken`（`Remote startStreamServer response did not include a windowBridgeProxyToken`）；路由失效形态: `Window bridge route not found` / `Window bridge route expired ({ms})` / `Route not found for token=` / `Route expired for token= path=`。
- WebRTC ICE: `Failed to configure native ICE servers:`、`Failed to create ICE config client:`（ICE 配置由服务下发）。
- 下载互斥: `.download.lock`（`Acquired download lock` / `Download already in progress by another instance` / `Cleaning up incomplete download`）。
- `SharedConfig` 同步: `config/syncSharedConfig`、`Failed to sync workspace {x}`、`Core unavailable while syncing workspace {x}`；IDE 加载参数 `onLoad: windowId=, workspaceDirs=, vscMachineId=`（ide_protocol_client.rs）。
- core 远程配置键: `remoteConfigServerUrl`、`remoteConfigSyncPeriod`、`continueTestEnvironment`、`pauseCodebaseIndexOnStart`。

## 4. Insight serve 客户端（unity\insight_serve_client.rs）

- 数据文件: `~/.codely-cli` 下 `index.current`、`index.db`、`indexMtimeMs`。
- **进程互斥/回收**: `.serve.lock`、`.index.lock`、`.unity-insight.global-index-build.lock`；死锁清理 `Removed dead Unity Insight serve lock for {x}`、`Failed to remove dead ...`；回收用 **Windows Restart Manager**（`Failed to start Windows Restart Manager session`、`Failed to register index with Windows Restart Manager`、`Failed to query/list processes using the index`、`Failed to open {path} (pid {n}) for termination`、`Unity Insight serve (pid {n}) did not exit after SIGTERM/SIGKILL`、`Unity Insight serve lock still present after recycle`）。测试隔离: `UNITY_INSIGHT_TEST_GLOBAL_SERVE_LOCK_DIR`。
- RPC: JSON-RPC 形状，错误取 `/error/message`（`Unity Insight RPC error`）；故障形态 `Empty RPC response for {x}`、`Invalid JSON RPC response for {x}`、`Unexpected RPC status for {x}`、`RPC '{x}' timed out after {ms}ms`、`Failed to write RPC {x}`、`{x} saw {n} leftover responses (session desynced)`；连接 `Connect timeout to {x}` / `Connect failed to {x}`。
- 嵌入页注入: `window.__CODELY_WORKSPACE_DIR__ = {x}`（route=/drill 页面）。

## 5. Insight 用户设置与 agent TOML

- 用户设置: `~/.codely-cli/settings.json`，键 `unityInsight/enabled`（`settings object`、`enabled`/`disabled` + GPU 相关 `GL`）；`workspaceDir is required for workspace-scoped settings`。
- agent TOML: `(?m)^\s*max_turns\s*=\s*(-?\d+)\s*$` 正则改写 max_turns；模板全文见 tjhub-api.md §6；`~/.codely-cli/agents`、`unity-insight.toml`、`workspaceDir is required for workspace-scoped agent toml`；注释 `Builtin transport is pinned (TOML is the ground truth)`。

## 6. TCP IPC（core\tcp_ipc_messenger.rs）——壳↔core 备用通道

- 类型 `TcpIpcMessenger`：`Connecting to TCP server at {addr}:...` → `Connected to TCP server at {addr}`；消息 `{id, method...}`，日志 `Sending message: {x} (id: {id})`、`Making request: {method}, no timeout)` / `timeout: {ms}ms)`；`Found handler for: {method} (id: {id})`、`No handler for: {method}`；**响应配对校验** `Response message_id mismatch: expected {a}, got {b}`、pending 表 `Sent response to pending request` / `Failed to send response to pending request`；`Channel closed while waiting for response`、`Failed to parse IPC message: {x} - {e}`、`Stopped reading messages`。
- 虚拟路径前缀 `codely_virtual__`；headless 工作区键 `headless-`。
- GameCowork 已确认原版主通道是 SSE（ipc_messenger.rs），TCP 通道用于 headless/CLI 场景（`Processing CLI workspace: raw=, normalized=`，CorePool 注册）。

## 7. IDE 协议客户端（ide\ide_protocol_client.rs + ide\file_service.rs）

- 完整 IDE 消息表（vscode/jetbrains 同用）: `getIdeInfo getHomedir getDiff getFileAtHead getFileAtIndex saveFile openFile deleteFile showFile getCurrentFile getCursorPosition getWorkspaceDirs getProjectRoot getBranch getGitBranches getTags copyText showToast isWorkspaceRemote isTelemetryEnabled getFilesByName ...`；`Unknown IDE message type: {x}`。
- 文件操作语义（file_service）: `Could not find old_string in file: {x}`（编辑替换）、`Create file failed: {x}`、`DeleteFile: File does not exist / Invalid path / Successfully deleted {x}`、`Empty filepath`、`Failed to write binary file:`、`Failed to create temp file:`、`showVirtualFile: {n} chars`（参数 `name, remoteName, extensionVersion`, 虚拟文件名 `virtual_file.txt`）。
- hub 请求超时: `hub request {x} timed out on {y}`（IDE 客户端也经 hub 客户端转发）。
- `rejectDiff: Mock implementation (no-op)` —— 原版壳对 IDE rejectDiff 是空实现（复刻时可直接照抄为 no-op 并记录）。

## 8. 对 GameCowork 的复刻要点

1. VFS 消息名 `cowork.vfs_refs / vfs_children / vfs_entry` 是原版"模型驱动 Insight 问答"在**编辑器管道侧**的取数接口——GameCowork 的 vfs_* SDK 接线（HANDOFF §5 末行）可对齐这三条消息语义，而不必新增协议。
2. Insight serve 的**锁文件三层**（serve/index/global-index-build）+ Restart Manager 按 pid 回收 + 死锁清理，可直接补进 GameCowork `insight.rs` 的进程生命周期（当前已有启停，补"外部占用回收"分支）。
3. 远程窗口桥的 token 路由（`/api/tauri/window-bridge/local/{token}` + `windowBridgeProxyToken` + 过期路由）与现有 `windowBridge.html` 帧传输可叠加——是 P2 远程预览的最小改动路径。
4. `Response message_id mismatch` 配对校验与 GameCowork 已修的"请求 ID/回执路由"同源，可作为 TCP/管道通道的验收断言。
5. `editor.available`（hub 方法）+ `tauri/openWorkspace`（参数 path/editorType/pid）+ `set_embed_mode` 构成"工程→编辑器窗口→嵌入模式"三步联动，GameCowork 项目面板接真实编辑器时可对照。
