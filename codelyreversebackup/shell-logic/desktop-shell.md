# 原版壳 桌面体验还原：窗口/托盘/更新/单实例（T1.7）

> 来源: cowork.exe 模块簇 `src\app\{window_manager,window_state,workspace_state,tray,update,single_instance,restart,settings,theme,data,setup,plugin,win_keyboard_hook}.rs`、`src\messages\{window,update,update_channel_msg}.rs`、`src\core\os_notification.rs`、`src\metrics.rs`。
> 对应 HANDOFF P1「原生桌面体验：实际 Wry/WebView2 的标题栏、拖拽、缩放、关闭与焦点、不同 DPI/GPU」。

## 1. 多窗口与工作区（window_manager.rs / window_state.rs / workspace_state.rs）

- **窗口会话模型**: `Created window session: label={label}, workspace={dir}`；`Created duplicate window: label=`；销毁链 `Destroying window session: {x} (last_window={bool})` → `{x} closed, {n} window(s) remain for workspace {ws}` → `Workspace {x} fully destroyed (last window {y} closed)`；注销 `hub/workspaceRemoved`（含 workspaceDir）。
- **主窗口标签** `codely-main`（标题 `Tuanjie Cowork`）、hub 窗口 `hub-main`；`hubMode` 标志；无窗自愈: `Hub state existed without a Tauri window; recreating Hub` → `Created hub window`。
- **跨窗口消息**: `hub/workspaceAdded`（`messageType/data{workspaceKey, runOn}/targetGuiViewId/hub-main`）；工作区广播 `broadcast_core_request_global(): no workspaces registered`；GUI 视图注册表 `Window {x} not found in registry`、`unknown-gui-view`。
- **SSE 缓冲策略（每窗口 forwarder）**: `SSE-Forwarder` / `Hub-Forwarder`；溢出丢弃: `Dropping pending SSE for {x}: buffer reached {n} messages, further messages will be silently dropped`；重放: `retained in replay snapshot`、`Skipping sessionUpdate SSE buffer replay`；`acp/webviewSurfaceReady` 触发 `redeliver_pending_acp_requests`。
- **跨进程互斥**: `Workspace already open in another process`（锁见 §4）；锁退化 `Failed to lock workspace, falling back to temp`；共享核绑定 `Shared core must be initialized before creating window sessions`、`Workspace {x} initialized in shared core`、Core 预热 `Shared core process initialized (prewarm mode)`。
- **子进程 Job 绑定**: `CreateJobObjectW failed` / `SetInformationJobObject failed: ({code})` / `OpenProcess() failed` / `AssignProcessToJobObject failed` —— 工作区子进程挂 Job 对象保活/回收。
- **焦点**: 壳 HTTP `http://127.0.0.1:{port}/api/tauri/focus-window`（跨进程唤起）；Unity 联动 `AllowSetForegroundWindow granted to Unity PID {n}`。

## 2. 单实例与 CLI 转发（single_instance.rs）

- 心跳端点 `http://127.0.0.1:{port}/api/tauri/status`（轮询存活）；二次启动转发 `POST /api/tauri/hub/open-workspace`（`Failed to forward CLI workspace to running app: HTTP {code}` / `Forwarded CLI workspace to running app: path=, port=`；参数 `editorType, fromCli`）。
- **工作区锁文件**: `{ws}\.codely.lock` + `.codely.lock.meta.json`（元数据含 `pid, http_port`）；冲突文案 `Workspace is already opened by another process. lock_path=, error=, pid=, http_port=`；应用级 `app.lock.meta.json`（存 `~/.codely`）。规范化键 `hash_hex`（`workspace_dir → normalized → hash_hex`）。
- app meta 原子写: `Failed to serialize app meta` → 写临时 → `sync/finish`（fsync 链）。

## 3. 托盘（tray.rs）

- 菜单项 ID: `tray-open-window`（Open Window）、`tray-restart`（Restart Cowork）、`tray-quit`（Quit）；动作日志 `Hub window opened from tray` / `Failed to open Hub from tray`。
- **通知徽标**: 位图数字字体（每数字 4×5 位串，如 `111101010110001100`；`Invalid badge digit`）；`Failed to schedule badge update/clear on main thread`、`Timed out waiting for notification badge update`；图标解码失败 `Failed to decode notification tray icon`、`Failed to load notification icon`、`Failed to request notification attention`。
- 菜单构建失败链: `Failed to create tray menu / quit menu item / restart menu item / open menu item`、`Failed to initialize tray icon`。

## 4. 更新（app\update.rs + messages\update.rs + update_channel_msg.rs）

- Tauri updater；通道 `stable|canary`（update_channel_msg）；命令与状态机见 commands.md §3。
- 环境变量: `CODELY_LOG_TO_STDIO`；WebView2 附加参数 `additional_browser_args= --disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --autoplay-policy=no-user-gesture-required --remote-debugging-port={n}`（E2E: `CODELY_E2E`、`CODELY_E2E_USER_DATA_DIR`、`CODELY_E2E_WEBVIEW2_PORT`）。
- GUI 加载: `Failed to load GUI` / `Failed to read GUI entrypoint` / `Failed to resolve dist path for /gui.html:`（HTML 错误页内嵌）；dev URL `window.__CODELY_GUI_DEV_URL__`（5173/5174 端口）。

## 5. 系统通知（core\os_notification.rs）

WinRT Toast XML 模板（原文截获）:
```xml
<toast><visual><binding template="ToastGeneric"><text>{title}</text><text>{body}</text>
</binding></visual></toast><actions><action content="Accept" arguments="accept"/>
<action content="Reject" arguments="reject"/></actions>
```
—— 带 Accept/Reject 双按钮（对应 Agent 权限确认推送）。

## 6. 其它 app 模块速览

| 模块 | 事实 |
|---|---|
| app\settings.rs | `cowork-settings.json`（新）/`codely-appsettings.json`（旧）迁移；原子写（`json.lock`+`json.tmp`+rename，锁 `Failed to acquire file lock`）；模块路径 `cowork::app::settings` |
| app\restart.rs | `Restart requested; relaunching app` |
| app\theme.rs | `changeThemeMode`（浅/深色切换消息） |
| app\file_preview.rs / file_watcher.rs | FilePreview + **Ripgrep**: `Ripgrep search exited with code {n}`、`regex parse error`、`failed to spawn thread`；`Failed to resolve workspace root` |
| app\win_keyboard_hook.rs | Windows 全局键盘钩子（窗口存在） |
| app\data.rs / setup.rs / plugin.rs | 数据目录/启动装配/插件（字符串少，行为待差分或 T4） |
| core\process.rs | core 错误友好化: `EADDRINUSE`→"Port already in use! Another instance may be running."、`ENOENT`→"Missing Node.js module! Reinstall dependencies."、"File or directory not found!"、"Permission denied!"；**CoreHealth**: `nonestate= code= workspace= core= cli= restart_attempts= action= message=`、`fatal core failure; messenger cleared code=`、事件 `tauri/core-status`、`Auto-restart already in progress, skipping duplicate trigger` |
| core\communication.rs | `Core is stopping/`Core stopped and reset`、`Lagged {n} messages for window {x}`、Core 子进程环境注入 `Updated Core child-process environment ({n} variables)`、login-shell 环境 |
| metrics.rs | `cowork_client_installed` 哨兵文件（`[client_installed] skipped; sentinel exists at {path}`）——安装埋点只发一次 |
| ide\ide_protocol_client.rs | `onLoad: windowId=, workspaceDirs=, vscMachineId=`；远端配置键 `remoteConfigServerUrl/remoteConfigSyncPeriod/continueTestEnvironment/pauseCodebaseIndexOnStart` |

## 7. 对 GameCowork 的复刻要点

1. **单实例三件套**（status 心跳 + focus-window HTTP + `.lock/.lock.meta.json` 带 pid/http_port）可直接照抄为 GameCowork 工作区跨进程互斥（wry 单窗场景同样需要 CLI 转发路径）。
2. **SSE 每窗口缓冲丢弃 + replay 快照**策略值得吸收：GameCowork 现在是全局广播，加 per-window pending 缓冲 + `webviewSurfaceReady` 重放即可对齐多窗口体验（HANDOFF P1 原生窗口生命周期）。
3. 更新器 pending 校验四态（on-disk/stale/redownload/differs-but-newer）+ 通道换道重启检查是成熟状态机，自研更新可直接套。
4. WinRT Toast 双按钮 XML = 免依赖的权限确认推送模板（GameCowork 无需引第三方通知库）。
5. CoreHealth 的 `restart_attempts` + 单飞 auto-restart + `tauri/core-status` 事件形状，与 GameCowork 现有 core 生命周期补强方向一致。
