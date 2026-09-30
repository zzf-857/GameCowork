# Tuanjie/Unity 编辑器关联 + 多视图串流 — 源码级结论（2026-09-29 深挖）

> 结论先行：**两者都存在**，且为完整实现。证据全部来自还原源码
> （`core-codely-binary/binary/out/index.beautified.js`、`frontend/dist-beautified`）。

## 一、Tuanjie / Unity 编辑器关联打开方式 ✅ 存在（双引擎全支持）

### 1. 引擎识别（core 边车 `hRi()`）

读项目 `ProjectSettings/ProjectVersion.txt`：
- `m_TuanjieEditorVersion:` → **Tuanjie**
- `m_EditorVersion:` → **Unity**

`f9e()`（项目状态判定）进一步校验 `Assets/`、`ProjectSettings/`、`Packages/manifest.json`，
产出 `{isUnityProject, engineType, engineVersion, hasUnityMcpPackage, installedPackageVersion}`。

### 2. RPC 命令面（core 边车注册，前端经 HTTP 调用）

```
unity/openEditor                    打开编辑器(核心)
unity/getHubProjectsAndEditors      Hub 项目+编辑器清单
unity/getEngineType / getStatus / getProjectStatus / getEditorPid / refresh / disconnect
unity/invokeTool                    AI 工具调用编辑器状态(unity_editor/unity_scene/unity_gameobject…)
unity/installMcpPackage / checkPackageCompatibility / updatePackageVersion
                                    编辑器内桥接包 cn.tuanjie.codely.bridge 的生命周期
unity/windowBridge/{startStreamServer,stopStreamServer,getStreamServerStatus,listWindows,openWindowBridge}
```

### 3. 打开流程（`openProjectWithEditor($ba)`，逐行还原）

1. 读 `ProjectVersion.txt` 得目标版本；
2. 查重：项目已在编辑器中打开 → 直接**置前**（返回 alreadyOpen + pid）；
3. 枚举已装编辑器列表 `C2i()`（含 `hubInstalled` 标记）；
4. 版本匹配：请求版本优先，否则用项目自带版本；不匹配 → 返回
   `needsSelection: true + availableEditors[]`（对应前端 TJHubRoute 的
   `openWithVersion` 选择弹窗，i18n: `tjhub.projects.openWithVersion`）；
5. 启动：
   - macOS: `open -n -a <editor> --args -projectPath <root>`
   - Windows: **WMI 启动优先**（编辑器不随宿主退出），失败回退 `spawn(detached)`
6. 前端另有手动指定编辑器 exe 的文件选择器（filters: `{"Tuanjie Editor": ["exe"|"app"]}`）
   和 `tjhub/createProject`（模板+版本+架构+uosEnabled+组织）、`tjhub/openRemoteProject`（云端项目）。

> TJHubRoute 前端调用的 `tjhub/openProject` 即上述通道；资产定位用
> `/api/tauri/reveal-in-*`（revealInEditor: "在 {{editor}} 中定位"，Unity/Tuanjie 通用）。

## 二、关联项目场景中的多视图 ✅ 存在（视图串流 + 布局持久化）

### 1. 视图类型（`Bu`/`Xa`，RightSideBarPanel）

| viewType | Unity 窗口类 |
|---|---|
| game_view | UnityEditor.GameView |
| scene_view | UnityEditor.SceneView |
| inspector | UnityEditor.InspectorWindow |
| hierarchy | UnityEditor.SceneHierarchyWindow |
| console | UnityEditor.ConsoleWindow |
| project | UnityEditor.ProjectBrowser |

### 2. 架构

```
RightSideBarPanel (前端父面板, Unity 内嵌侧栏)
  ├─ 每个"视图" = 一个 windowBridge.html iframe (serverUrl + displayMode)
  ├─ 布局管理: postMessage "unity-window/update-composite-layout" {layout, serverUrl}
  │            (addUnityView/添加视图, defaultLayout/lastLayout)
  ├─ 布局持久化: Tauri invoke "read_unity_streaming_layout"/"save_unity_streaming_layout"
  └─ 子 iframe 回报: "unity-window/stream-status"、ready 握手
        │
        ▼
windowBridge.html (196KB 完整实现)
  ├─ serverUrl 净化白名单(直连 http://host:port 或 Tauri 反代 /api/tauri/window-bridge/...)
  ├─ REST 控制通道: POST /stream/resize 等
  └─ 视频渲染: <video> + <canvas> 双路(含 SceneView 拖拽光标覆盖层、截图到聊天)
        │
        ▼
core 边车 (Node): unity/windowBridge/startStreamServer → 经 ACP manager 启动
"native stream server"(可指定 port) → 数据源 = 编辑器内桥接包 cn.tuanjie.codely.bridge
```

### 3. 状态机与细节（i18n 中英双语证据）

- 连接: `statusConnected / Connecting… / Unconnected` + `Open / Connect` 按钮，
  面板标题同时给 `Unity Editor` 与 `Tuanjie Editor` 两栏（双引擎并列）；
- 编辑器状态: `playing / streaming / unity_busy / domain_reloading`
  （"Unity 正在重新加载程序集..."）；
- GameView 特判: 播放态自动聚焦（`jt.includes("GameView")` 分支）；
- 平台限制: `streamingUnavailableMac`（macOS 串流未支持）；
- 其他: 截屏到聊天、静音/取消静音（音频流）、停止/刷新串流、全屏、会话信息。

### 4. 与第一轮提取的对照

第一轮命令面里的 `read/save_unity_streaming_layout`、`get_cowork_access_token`
（gui 入口）即本机制所用；当时因命令不在 cowork.exe 中存疑，现确认实现于
**core 边车 + 编辑器内桥接包**，桌面壳只承载窗口与布局持久化。

## 三、一句话回答

- **关联打开方式：存在** —— "读 ProjectVersion → 已开置前 → Hub/本机编辑器枚举 →
  版本匹配(不匹配弹选择) → WMI/spawn/open -projectPath" 全链路，Unity 与 Tuanjie 双引擎同构支持。
- **多视图：存在** —— 6 种编辑器窗口类型可任意"添加视图"组合成复合布局，
  iframe 串流渲染 + REST 控制 + 布局持久化，串流服务由 core 边车拉起、编辑器内
  `cn.tuanjie.codely.bridge` 包供数。
