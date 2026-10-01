# 原版 cn.tuanjie.codely.bridge@1.0.85 能力分析（对照自有 editor-bridge 的差距图）

> 提取来源: verify-project/Library/PackageCache/cn.tuanjie.codely.bridge@1.0.85（PackageCache 只读提取）
> 427 文件 / 74MB，逐文件 SHA256 见 `_EXTRACT-MANIFEST.json`。仅供逻辑参考，不得改名分发。

## 一、总体架构（与你 Bridge.cs 的根本差异）

| 层 | 原版实现 | 你的 editor-bridge 现状 |
|---|---|---|
| TCP 服务 | `UnityTcpBridge.cs`（C# 路由器）+ **原生 `NativeTcpBridge.dll`**（NativeUnityTcpBridgeHost：心跳文件/帧 IO 在原生层，C# 只同步 stream_port） | 纯 C# TcpListener（功能等价，原生层非必需） |
| 窗口捕获 | **原生 `NativeWindowBridge.dll` 离屏渲染全部编辑器窗口**（C# host 只做 JSON 缓冲区交换）——这就是 Inspector/Hierarchy/Project/Console 全都能串流的原因 | 仅 Scene/Game（image-frames JPEG） |
| 音视频 | `datachannel.dll` + libcrypto/libssl（WebRTC DataChannel/媒体） | 无（image-frames 替代） |
| 输入 | `NativeWindowBridgeHost.NewInputSystem/Cursor/DragAndDrop/PopupMenu/TabDrag/ObjectSelector/AdvancedDropdownPopup/Panel/PaneOptions/PopupDock/IconSelector` 全套输入转发 | Scene/Game 输入已通 |
| 浏览器 | `NativeBrowser.dll`（编辑器内嵌网页） | 无 |
| 工具面 | Tools/ 26 个管理器（见下） | manage_window_bridge + manage_editor |

**关键结论**：原版能串流 Inspector/Hierarchy/Project/Console 不是 C# 截图，而是原生 DLL
按窗口句柄做离屏渲染 + 输入注入。DLL 不带源码（Plugins/Win 下只有二进制）。
你的可选项：(a) 仿 NativeWindowBridgeHost 的 JSON API 自研原生层；(b) 逐窗口
UIElements/repaint 回调抓帧（质量/性能受限但纯 C#）；(c) 借用 InternalEditorUtility 等
内部 API。C# host 的全部分部文件就是原生 API 的完整文档。

## 二、Tools/ 动作目录（原版 Agent 编辑器工具全集，26 个管理器）

| 文件 | 能力（供你的 Agent 工具面对照） |
|---|---|
| ManageEditor.cs | 编辑器状态/播放控制（对应你已有 manage_editor） |
| ManageWindowBridge.cs | list_windows/start_stream_server/stop/status（对应你已有） |
| ManageScene.cs / ManageGameObject.cs | **Scene/GameObject CRUD**（你明确标注未实现的那块） |
| ManageInput.cs / VirtualInputDevices.cs | 输入注入与虚拟设备 |
| ManageGameView.cs | GameView 专属控制 |
| ManageScreenshot.cs | 截图（截图到聊天功能的后端） |
| ReadConsole.cs | Console 读取（Console 窗口的数据源） |
| ManageAsset.cs / ManagePackage.cs / ManageShader.cs / ManageBake.cs | 资产/包/Shader 变体/烘焙 |
| ExecuteCSharpScript.cs / ExecuteScriptCommand.cs / ExecuteMenuItem.cs / REPL/ | **任意 C# 执行与菜单执行**（你 Bridge.cs 明确不做，注意安全边界） |
| ManageDialog.cs + ModalDialogScanner/Win32ModalDialogScanner/MacModalDialogScanner | 模态对话框扫描/处理 |
| PlatformMp4Encoder.cs | MP4 编码（串流录制） |
| ManageJob.cs + Jobs/ + StepJob/JobControl/JobRegistry/DetachedJobs | 长任务 Job 体系 |
| _InternalAssetListening.cs / _InternalStateDirtyNotifier.cs | 资产监听与脏状态通知 |
| Helpers/StateComposer.cs | 编辑器全量状态组装（isPlaying/isCompiling/Console 计数…） |
| Helpers/SelectionPayloadBuilder.cs / GameObjectSerializer.cs | 选择/对象序列化 |
| Helpers/PortManager.cs | 端口管理 |
| Helpers/WriteGuard.cs / EditorAutomationGuard.cs / AssetListeningGuard.cs | 写保护/自动化守卫（安全边界参考） |
| Editor/Tauri/（20 文件） | 桥内嵌的 Tauri 侧集成 |
| Editor/Layout/ | 布局 |

## 三、协议事实（与你的 Bridge.cs 兼容性）

- 命令路由：`Command { type, params }` / 通知 `Notification { notification_type, payload }`
  ——与你已实现的 `manage_window_bridge/manage_editor` 同族。
- 帧上限 `MaxFrameBytes = 64MiB`、帧 IO 超时 3000ms、原生轮询每 tick 限 128。
- `serverVer = "1.0.0-beta.1"`、SessionState 键 `UnityTcp.ManualStop / ResumeAfterReload`
  （手动停止跨域重载存活、编辑器重启后自动重启桥——你 Bridge.cs 的 domain-reload 语义可直接对照）。
- 心跳文件完全在原生层（NativeUnityTcpBridgeHost.StartOrAttach）。

## 四、建议的最小复用路径（按你 HANDOFF P1 项）

1. **Inspector/Hierarchy/Project/Console**：先读
   `Native/NativeWindowBridgeHost.cs` + `.Composite.cs` + `.Panel.cs` 的 JSON API 面，
   列出原生导出函数（P/Invoke 签名都在 C# 里），评估 (a)/(b)/(c) 三路线成本；
   `ReadConsole.cs` 可立即纯 C# 移植（Console 数据源不依赖原生捕获）。
2. **截图到聊天**：`ManageScreenshot.cs` 纯 C# 可直接对照移植。
3. **Scene/GameObject CRUD**：`ManageScene.cs`/`ManageGameObject.cs`/`GameObjectSerializer.cs`
   是完整参考（你 Bridge.cs 声明不做，需要时按此对齐协议形状）。
4. **模态对话框**（原生窗口场景的卡点处理）：ModalDialogScanner 三平台实现。
5. **长任务**：Job 体系（JobRegistry/StepJob）可对照你现有 operationId 轮询模型。
