# 原版壳自有 HTTP 面全表与 tjhub 事件族（T12，2026-10-02）

> 第三轮深挖补充。来源: `strings/cowork-routes-urls.txt`（cowork.exe 全量 URL 提取，T1 产物）+
> `strings/cowork-msglike.txt`，逐条与维护副本前端（`src/frontend/bundle/assets/`）调用点交叉验证。
> T1.3 的 tjhub-api.md 只覆盖 tjhub/* 三条腿；本文档补齐**壳自身 axum 服务的 `/api/tauri/*` 面**
> 中此前未记录的端点、tjhub 事件族与 `tauri://` 原生事件。全程只读，未运行原版 EXE。

## 1. 壳自有 HTTP 端点全表（/api/tauri/*）

按功能域分组；★=本文档首次记录（此前 T1 文档未覆盖），其余在 T1 各文档已有。

### 1.1 消息通道与窗口

| 端点 | 说明 |
|---|---|
| `POST /api/tauri/invoke` | 前端 invoke 总入口（`messageType/messageId/data` 信封） |
| `GET /api/tauri/events` | SSE 事件流；★支持 `?workspaceDir=&forwardOsNotifications=1`——按工作区过滤 + 转发 OS 通知（原版 per-window 过滤的实现点） |
| `GET /api/tauri/status` / `window-state` | 壳状态 / 窗口几何 |
| `POST /api/tauri/minimize-window|close-window|toggle-maximize-window|focus-window|start-dragging` | 窗口控制；`focus-window` 另有单实例心跳用 `http://127.0.0.1:{port}/api/tauri/focus-window`（desktop-shell.md §2） |
| ★`POST /api/tauri/macos-titlebar-double-click`、`/api/tauri/update-traffic-lights` | macOS 专属（Windows 版不路由） |
| ★`POST /api/tauri/drop-files` | **OS 文件拖放入口**：前端 `tauri://drag-drop` 事件收到文件路径后 POST 到壳；壳/前端另有 `gamecowork:drop-files` 内部消息分发到聊天输入 |

### 1.2 工作区

| 端点 | 说明 |
|---|---|
| `POST /api/tauri/hub/open-workspace` / `close-workspace` / `reorder-workspaces`、`GET hub/workspaces` | Hub 工作区管理 |
| ★`POST /api/tauri/hub/workspace-ready` | 工作区就绪回执（前端等此事件再切换 UI，避免半初始化展示） |
| ★`POST /api/tauri/init-workspace` | 冷启动初始化工作区（deep-link/命令行路径进入时） |
| `GET /api/tauri/recent-projects` / `workspace-dir` | 项目列表 / 当前工作区目录 |
| ★`POST /api/tauri/attach-embed-workspace`、`/api/tauri/set-embed-mode` | **嵌入模式**：把 Cowork 页面嵌进 Unity 窗口（WebView2Host 链）时的 attached 工作区与模式切换（对应 `editor/setEmbedMode` + `cowork_embed_mode_changed` 事件） |

### 1.3 文件与预览

| 端点 | 说明 |
|---|---|
| `GET/POST /api/tauri/file-explorer`(+`/events`,`/search-stream`) | 文件浏览器（canary.2 新增域） |
| ★`GET /api/tauri/file-explorer/media` | **文件预览媒体流**（`?path=`，图片/音视频流式回源）；前端在 GameCowork 壳下已同义改走 `file-explorer/media`，原版路径 `file-preview-media` 仍保留 |
| ★`GET /api/tauri/file-preview-media` | 同上的原版路径名（canary.1 时代命名） |
| ★`POST /api/tauri/save-file-modal` | 保存文件对话框（与 pick-folder-modal/pick-file-modal 同族；前端 AddLicenseDialog 用于导出许可请求文件） |
| ★`POST /api/tauri/download-url` | 壳代下载 URL（前端 4 处调用：市场附件/日志导出等） |
| `POST /api/tauri/local-file-content`、`/api/tauri/reveal-in-file-explorer` | 本地文件读取 / 资源管理器定位 |

### 1.4 自动更新（★ 全域为本文档首次成文）

| 端点 | 说明 |
|---|---|
| `POST /api/tauri/check-update` | 触发检查；回 `{downloading,...}`；前端设置页轮询此端点渲染"已是最新/下载中/待安装" |
| `GET /api/tauri/pending-update` | 待安装版本信息（pending 四态状态机的查询面，对应 `tauri/getPendingUpdate` invoke） |
| `POST /api/tauri/apply-update` | 应用更新并重启（对应 `tauri/applyUpdate`） |
| 清单源 | `https://codely.tuanjie.cn/api/plugins/cowork/latest`（`?beta=true` 为 canary 通道）——壳 `src/server.rs` 邻近字符串，即更新清单 URL；通道切换 invoke 为 `tauri/getUpdateChannel|setUpdateChannel`（stable\|canary） |

### 1.5 Unity Insight（补齐 T1.6 未列全的操作）

| 端点 | 说明 |
|---|---|
| `POST /api/tauri/unity-insight/get-enabled|set-enabled`、`get-max-turns|set-max-turns` | 启用开关 + **模型驱动索引问答的 max_turns 配置**（对应 agent TOML 模板 `max_turns`，tjhub-api.md §6 的 UI 面） |
| `POST /api/tauri/unity-insight/index-status|ensure-index|active-build|live-serves` | 索引状态/确保索引/★当前活动构建/★活动 serve 实例列表 |
| `POST /api/tauri/unity-insight/vfs-refs|vfs-children|vfs-entry|vfs-search|vfs-path-search` | VFS 查询五操作（unity-shell-side.md §1） |

### 1.6 终端 / 移动端 / 窗口桥代理 / 远程

| 端点 | 说明 |
|---|---|
| `GET /api/tauri/terminal` | ConPTY 终端升级（WebSocket） |
| ★`GET /api/tauri/mobile/v1/machine/home`、`/machine/archive`、`/machine/workspaces/:workspace_key/sessions` | **手机端聚合面**（mobile_home.rs 的 HTTP 服务：主页/归档/会话分页），与 `/api/push/notify` 同属远程域（tunnel-remote.md §5 的服务端对端） |
| ★`GET /api/tauri/window-bridge/local/:token/*path`、`/remote/:token/*path` | windowBridge 页面的壳代理（token 路由/过期，unity-shell-side.md §3 已记，此处补全 URL 形态） |
| ★`/api/v1/frp/connect|disconnect|heartbeat`、`GET /api/v1/frp/machines?limit=100&offset=0`、`GET /api/v1/frp/remote-workspaces` | 控制面 frp REST（tunnel-remote.md §2-4 的 URL 面，逐条对上） |
| `/api/metrics/events`、`/api/push/notify` | 埋点上报 / 离线推送队列 |

## 2. tjhub 事件族（★ 新增：壳→前端推送，此前只列了 invoke）

`cowork-msglike.txt` 中与前端 invoke 名同簇出现的事件名（前端 chunk 验证有监听）：

| 事件 | 时机 |
|---|---|
| `tjhub/installProgress`、`tjhub/statusUpdate` | 编辑器/模块安装队列进度与状态机推进（配合 invoke `installEnqueue/installCancel/installRetry`） |
| `tjhub/templateDownloaded`、`tjhub/templateDownloadError` | `downloadTemplate` 完成回执（成功/失败两事件，成功后才允许创建向导继续） |
| `tjhub/projectListUpdated` | 项目列表变更（安装完成/移除/外部变化后刷新 recent-projects） |
| `tjhub/projectOpening`、`tjhub/projectOpened` | 打开工程前后（GameCowork 已同构实现） |
| `tjhub/watermarkStatus`、`tjhub/projectStructureReady` | 水印授权状态 / 新建工程结构就绪（创建向导的完成信号） |
| `tjhub/local/getDiskSpace` | 磁盘空间查询（名册形 `getDiskSpaceavailable`） |

前端还有 `tjhub/getPendingDeepLink|getPendingIpcPassthrough`（启动期一次性取走深链/IPC 透传载荷，轮询消费模型）。

## 3. `tauri://` 原生事件（tao/wry 直通前端的窗口事件）

`tauri://drag-enter|drag-over|drag-drop|drag-leave`（OS 拖放）、`tauri://resize|move|close-requested|destroyed|blur|focus|scale-change|theme-changed`、
`tauri://webview-created`、`tauri://window-created`。原版前端依赖 drag-drop 系事件实现文件拖入；
**wry 直通方案需在壳层把这些事件显式转发给前端**（GameCowork 现用 `gamecowork:drop-files` 内部消息路径替代，
拖放体验等价但入口不同）。

## 4. GameCowork 现状映射（复用索引，细节见 RESTORE_STATUS.md 2026-10-02 对照）

- 已有: invoke/events/status/window 控制/pick-\*/file-explorer 域/terminal/local-file-content/reveal/insight(get|set-enabled,index-status,ensure-index,vfs-五操作)/hub 工作区管理/projectOpening|Opened。
- 缺口（前端有调用，壳回 501 或未路由）: `check-update|pending-update|apply-update`（更新状态机）、
  `save-file-modal`、`download-url`、`set-embed-mode|attach-embed-workspace`、`hub/workspace-ready|init-workspace`、
  insight 的 `get-max-turns|set-max-turns|active-build|live-serves`。
- 远程域（mobile/v1、frp、window-bridge remote）按用户排期保留后期。
