# Tuanjie/Unity 编辑器关联 + 多视图串流 — 源码级结论（2026-09-29 深挖）

> 2026-10-01 复核：下面描述的是提取代码中发现的机制，不代表当前 GameCowork 已运行完整链路。
> 当前实际宿主为 `src/shell/`；第五阶段正式包已验收自有 Agent、`cn.gamecowork.bridge`、程序集重载、单 GUI Unity＋Tuanjie 四路 Scene/Game 帧、输入与固定身份布局，以及两种引擎真实 GUI 播放/暂停/单帧/停止/刷新。团结原始完整模板导入也已通过。第六阶段 Agent 直接 TCP 操作的完成/取消严格源码门禁已通过，尚待本阶段装配；其它完整编辑器窗口、音频/WebRTC 和远程仍未完成。当前状态与精确证据见 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)，以下旧“桥不存在/CLI尚未恢复”等结论仅保留为历史分析；接手见 [docs/history/HANDOFF.md](../history/HANDOFF.md)。
> 本地项目识别、编辑器发现与启动需要分别验证；当前验证状态以 [RESTORE_STATUS.md](../../RESTORE_STATUS.md) 为准。

> 2026-10-01 用户纠偏后的源码复核：完整原桥 NativeWindowBridgeHost 在 `../codelyreversebackup/editor-bridge-original/Editor/Bridge/Native/`，真实 EditorWindow/DockArea/SplitView 托管、GUIView.GrabPixels 完整 GUI 捕获、NWB_PushFrame/native WebRTC 及输入/菜单/拖拽/对象选择链已静态确认；原安装 CLI 确实指向该 1.0.85 包。下文“原捕获 C# 未找到”与 Scene/Game camera 作为完整窗口扩展基础的旧判断撤回。备份包与安装 EXE 的来源/ABI核对仍有独立边界，不将静态源码理解当成动态功能验收。

## 当前 GameCowork 的连接与视图入口

在 GameCowork 打开 Unity/团结工程后，点击主界面顶部的 **编辑器视图**，或聊天输入框旁编辑器图标中的 **打开串流面板**。右侧独立的 **串流** 面板集中显示连接状态、错误原因、安装/重试和六类视图连接器；实时画面显示在工具区下方，不需要先创建聊天会话或配置文本模型。

1. 在右侧串流面板，工程缺少本地桥时点击 **安装连接桥**。这一次明确操作才会给此工程 `Packages/manifest.json` 添加 `cn.gamecowork.bridge` 本地依赖，并由现有文件修改服务保存原字节备份和变更记录。已配置但无法连接时，可以点击 **重新配置连接桥** 修复本地依赖路径。
2. 打开同一个工程的 Unity/团结编辑器，等待包导入与脚本编译完成，再点击 **重新检测**。检查 Unity Console 中的编译错误；有编辑器进程或安装回执均不等于桥已连接。打开编辑器后最多等待 60 秒，失败会释放“连接中”并保留原因，允许重试。
3. 单纯查看串流面板不启动编辑器、安装桥或开始捕获；聊天旁卡片仅提供快捷入口和连接提示。
4. 连接成功后，在串流面板点击 **Scene / Game / Hierarchy / Inspector / Console / Project** 添加实时视图，也可以继续使用右侧“添加 Unity 视图”菜单、跨工程选择、停止和保存布局。

Scene/Game 默认使用原渲染内容模式，其余四类使用真实 EditorWindow GUI 捕获；连接器不是模拟编辑器界面。当前传输是本地 JPEG 帧，完整音频、WebRTC、远程连接仍有独立未完成边界。实际帧、输入及包内验收证据统一见 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)。

两代前端共用 `src/frontend/bundle/assets/gamecowork-unity-connectors.js`；`projectMenuFlows-*` 按 `local-editor:<workspaceKey>` 更新工作区连接状态，手动检测和自动轮询共享代次。UI 的 `shell/openUnityViews` 消息携带固定工程 key/root，主页面和 Sidebar 各自检查同窗、同来源与当前工程；切换/关闭工程后，旧回复不能更新新的工程或创建旧视图。旧宿主路径继续保留原协议。

自有JPEG传输的捕获画布最大为1920×1080。大窗口、长竖面板或高DPI显示下，前端按同一比例适配传输尺寸，保留DOM面板的完整显示区域与独立DPR；启动、更新和resize使用同一预算。输入从实际canvas/slot/contentRect映射到原EditorWindow，不按整块面板中心猜测视图位置。13:08的旧1184包可能在高面板报 `Composite dimensions/fps are out of bounds`；14:46大屏修复包已统一适配。已连接时可直接选择视图，同参数不会重复重建捕获。正式程序与已验大屏/DPI候选的资源hash完全一致，精确装配与验收见状态文档。

## 一、提取代码中的 Tuanjie / Unity 编辑器关联打开机制

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

## 二、提取代码中的关联项目多视图机制（运行链路尚未打通）

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

## 三、当前运行结论

- 代码中存在项目识别、双引擎枚举、版本选择与启动逻辑。当前壳已接工作区生命周期，真实编辑器启动仍需专门验收。
- 多窗口前端和调用端仍在，但分叉后的编辑器桥不存在，可运行 Agent CLI 也尚未恢复；不能把预览 HTML 当成串流服务已存在。
- 实施顺序是协议与工作区 → Agent → 单工程桥/串流/布局 → 多工程连接与布局。正式产品不得安装或改写原软件的官方桥来绕过自有桥缺口。

## 四、实际 GameCowork 实现与正式包验收补充（2026-10-01）

上面的提取机制与早期缺口记录保留作历史参考。当前实际实现使用自有 `cn.gamecowork.bridge` UPM、Rust `editor/bridge.rs` 项目身份校验与 `windowBridge.html`/`gamecowork-image-frames.js` 真实 JPEG 传输；它不安装原桥，不通过模型启动认证来获取只读状态。支持本地 SceneView/GameView rendered content，未实现完整 Inspector/Hierarchy/Console/Project UI、WebRTC、音频或远程。

产品同一个侧栏 canvas 可明确选择已打开的工程，为各工程添加 Scene/Game、停止指定工程；每槽保留 fixed workspaceKey/workspaceRoot。对真实 opened registry 与 CPP welcome/状态的原项目 root/PID 校验后，按各自 listener 建立 composite/读取 JPEG/发输入/重连/停止，活动聊天工程不会替代旧槽身份。保存只含身份、标签与几何，capability URL、临时 PID 和 stream ID 不落盘。实际源纹理等比 fit 至私有 RT，黑边与 contentRect 保持一致；不修改用户相机或游戏分辨率，黑边不注入编辑器事件。源失效时保留其明确缺失槽，另一工程真实 reader 保持；关闭/重载不会复活已关闭源。

正式 873 文件包 build `94147966bf0e4c2881dff959c2f22a09` 已对实际 app EXE/Core/frontend/**app/editor-bridge** 串行验收：`editor-domain-reload-e2e.mjs --packaged` **17/17**，`editor-multi-project-ui.mjs --packaged` **14/14**。正式/guarded own Agent 同维护源码 SHA、正式 testGuardIncluded=false，运行前 Source/app own bridge **19 文件 SHA 全一致**；测试执行使用 guarded12、已有许可与两个自有 temp Unity 2022.3.51f1c1 工程，不用真实 Provider、原 CLI、激活/登录或用户工程。

报告分别为 `F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests\editor-bridge-preview-558c754f-3860-4e23-8152-283fe6f04991\result.json` 和 `F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests\editor-bridge-multi-project-7ddb735e-b47b-4590-8901-0e6ebf9518c1\result.json`。同一真实 Editor 程序集重载恢复、重新输入、关闭中重载停止两次状态、实际单 GUI A/B 四画面、聊天切换隔离、黑色像素与黑边拒绝、resize、A 单独 reload/stop/close、固定身份四槽还原及缺失 A 布局均已通过。四画面自然比例/黑边和缺失 A 恢复截图已视觉核对；全部自有 app/Editor/Chromium 已退出。实际 Tuanjie 目前只有 DLL 离线编译兼容证据，不能当作其运行验收。
