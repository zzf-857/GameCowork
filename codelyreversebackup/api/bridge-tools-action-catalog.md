# 原版桥 Tools 管理器逐动作目录与 own 差距（T15，2026-10-02）

> 第六轮深挖。来源: `codelyreversebackup/editor-bridge-original/Editor/Bridge/Tools/`（427 文件全量源码，
> cn.tuanjie.codely.bridge@1.0.85）。ANALYSIS.md §二只有每管理器一行的能力摘要；本轮逐文件提取
> **动作分发表**（`Dictionary<string,Func<JObject,object>> ActionHandlers` / switch(action) /
> `ActionRouter.TryResolve(ValidActions)`）与参数。对照基线: `src/editor-bridge/Editor/`（own 桥
> 目前仅 `manage_editor` + `manage_window_bridge` 两个命令族）。全程只读。

## 0. 分发机制（各管理器统一）

命令信封 `Command { type, params }`；每管理器暴露 `HandleCommand(JObject @params)`，内部
`ActionRouter.Route(@params, ActionHandlers)`（小写 action 名 → handler）或对协程型动作
`ActionRouter.TryResolve(@params, ValidActions, out action)`。参数一律 `@params["camelCase"]`。
Result 封装 `Response.Success/Error`；**错误文案会给出补救指引**（如列可用窗口名、建议改用某 action）。

## 1. 逐管理器动作目录

### 1.1 ManageEditor（24 actions）
`get_state`（全量状态：isPlaying/isCompiling/Console 计数等，Helpers/StateComposer 组装）、
`get_current_state`、`get_project_root`、`get_selection`、`get_windows`、`get_tags`、`get_layers`、
`get_active_tool` / `set_active_tool`（`toolName`）、`focus_window`（`windowType`；未知名错误列出可用窗口）、
`play`/`pause`/`resume`/`step`/`stop`、`refresh`、`request_compile`（别名 `start_compilation_pipeline`）、
`get_compilation_summary`、`wait_for_idle`（`timeoutSeconds` 默认 600 → StepJobRunner.Start(WaitForIdleJob)）、
`wait_for_compile`/`wait_for_stop`（Deprecated：`action_deprecated` 回执"无需等待"）、
`publish_dirty_state_if_needed`（Deprecated→get_state）、`drain_agent_input`。

### 1.2 ManageGameObject（14 actions）
`find`、`create`、`create_batch`、`modify`、`edit_batch`、`delete`、`list_children`、`get_components`
（`includeNonPublicSerialized`）、`ensure_component` / `remove_component`、`set_component_property`
（`searchMethod`）、`ensure_mesh_collider_mesh`、`ensure_renderer_material`、`ensure_prefab_default_sprite`
（后三个是常见修复型 ensure 动作；`target` 参数）。序列化由 Helpers/GameObjectSerializer + SelectionPayloadBuilder 承担。

### 1.3 ManageScene（4 actions）
`get_hierarchy`、`load`（`path`）、`save`、`create`（`name`/`build_index`|`buildIndex`——新建场景可入 BuildSettings）。

### 1.4 ManageInput（12 actions，协程型）+ VirtualInputDevices
`mouse_click/mouse_move/mouse_drag/mouse_scroll/mouse_down/mouse_up`（`x,y,button,scroll_x,scroll_y,drag_speed,steps,step_delay,start_delay,stop_on_error`）、
`key_press/key_down/key_up`（`key`）、`type_text`（`text`）、
`create_virtual_devices` / `destroy_virtual_devices`；`target` = `ui|world|device|auto`（InputTarget）。
VirtualInputDevices：独立虚拟鼠标/键盘设备（EnsureMouse/EnsureKeyboard、OnBeforeUpdate 应用增量、
ButtonFor 按钮映射、PlayModeStateChanged 挂/卸、Restore/RestoreMenu 还原）——不污染真实外设状态。

### 1.5 ManageScreenshot（10 ValidActions）
`capture_scene_view`、`capture_main_camera`、`capture_specific_camera`、`capture_asset`、`capture_ui_toolkit`、
`start_game_view_recording` / `finish_game_view_recording`（MP4，PlatformMp4Encoder）；
**`capture_game_view`/`capture` 已禁用**——错误明确指路"Use record_game_view on exec_runtime_script"。
参数: `width/height`（缺省时长边 256 下采样保比例；任一给出则关闭）、`orthographic`、`render_mode`、
`path/filename/document_path`、`focus_object`、`over_time`、`scene/assets/view`。

### 1.6 ReadConsole（3 actions）
`get`（日志批量读取）、`clear`、`set_collapse`。是 Console 视图与 unity_console 工具的数据源。

### 1.7 资产域
ManageAsset（5）: `search`、`get_info`（`path`，`generatePreview`）、`create`、`modify`（`properties`）、
`ensure_prefab_variant`。ManagePackage（3）: `list_packages`/`install_package`/`remove_package`（经 UpmJob/ListPackagesJob 异步）。
ManageShader（2）: `compile`、`preview`。ManageBake（5）: `bake_lighting`、`bake_navmesh`、`wait_for_bake`、
`clear_baked_data`、`clear_navmesh`。ManageGameView（3）: `list_resolutions`/`get_resolution`/`set_resolution`。

### 1.8 代码执行域（安全边界敏感）
ExecuteCSharpScript: `HandleCommand`（`script`/`scriptPath`、`execution_mode`=`editor|play`（与播放态冲突即拒绝）、
`asyncTimeoutSeconds`；编译失败走 ScriptFixProvider 自动修复管道后重试；日志捕获 s_CapturedLogs；域重载感知的静态 REPL 状态）。
ExecuteScriptCommand: `execute_editor_script` / `execute_runtime_script`（EditorCommandName/RuntimeCommandName；
play 模式切换预算 120s）。ExecuteMenuItem（2）: `get_available_menus`、`execute`（菜单路径）。
ExecuteCustomTool: 经 `CustomToolsRegistry`（特性扫描缓存 + `RegisterTool(name, MethodInfo)` 手动注册合并，
`RebuildMergedRegistryLocked`）按 `tool_name` 调用；`GetCustomToolsInfo` 列出。
REPL（Repl.cs/Repl.ApiHelper.cs/ReplGuard.cs）: REPL 会话与 API 白名单辅助。
ScriptFix 管道 10 文件: FixMissingBrace/Semicolon/Parenthesis/SquareBracket/Imports、FixAmbiguousReference、
FixMissingAssemblyReference、FixUnqualifiedUnityStaticMethod（+Context/Provider/SyntaxUtils）——**把编译错误自动修复成可执行状态**。

### 1.9 窗口桥/Job/对话框/内部通道
ManageWindowBridge（9）: `list_windows`、`resolve_native_window`、`start_stream_server`/`stop_stream_server`、
`get_stream_server_status`、`focus_window`、`input`、**`start_offscreen_stream`/`stop_offscreen_stream`**
（离屏单窗口流，与通用窗口宿主 Composite 并行的轻量通道）。
ManageJob（3）: `list`/`status`/`cancel`；Job 注册表含 RefreshJob/WaitForCompileJob/CompilePipelineJob/
WaitForIdleJob/PlayJob/PauseJob/StopPlayModeJob/UpmJob/ListPackagesJob（EditorStepJobs/PackageStepJobs）+
StepJob/JobControl/JobRegistry/DetachedJobs 基建。
ManageDialog: `click`（模态按钮点击；ModalDialogScanner 的 Win32/Mac 扫描器枚举系统模态）。
_InternalAssetListening: `set`/`status`；_InternalStateDirtyNotifier: `notify_file_changed`/`notify_batch_changes`/`get_statistics`。
TmpEssentialsAutoImporter: TMP essentials 自动导入。PlatformMp4Encoder: 录制 MP4 封装。

## 2. 与 own editor-bridge 的差距（`src/editor-bridge/Editor/`）

own 现有命令面（Bridge.cs/EditorControl.cs 路由）: **`manage_editor`**（play/stop/refresh/stop_for_refresh 等子集）
与 **`manage_window_bridge`**（list_windows/start_stream_server/stop_stream_server/get_stream_server_status）。

| 原版域 | own 现状 | 差距动作数 |
|---|---|---|
| editor 状态/播放/编译 | 🟡 子集（缺 get_windows/get_selection/step/wait_for_idle/get_compilation_summary 等 ~18） | 18 |
| Scene/GameObject CRUD | ❌（RESTORE_STATUS 一贯标注未实现） | 18 |
| 输入注入（ManageInput/VirtualInputDevices） | ❌（own 输入走 native receiver 的帧坐标映射，非管理器动作） | 12 |
| 截图/录制 | 🟡 own 有帧捕获链路但无 capture_asset/ui_toolkit/MP4 录制 | 8 |
| Console 读取 | 🟡（GenericWindowHost 捕获窗口画面，无结构化 get/clear） | 3 |
| 资产/包/Shader/烘焙 | ❌（core 的 unity_package 等工具在桥侧无对端） | 15 |
| C# 执行/菜单/自定义工具/REPL/ScriptFix | ❌（own 明确不做任意执行；若做需同套守卫） | 5 族 |
| 窗口桥 | 🟡（缺 resolve_native_window/input/offscreen_stream 三动作） | 3 |
| Job 体系 | ❌（通知面 `_gamecowork/job/update` 已有，桥内执行器无） | 3+9 Job 类 |
| 模态对话框 | ❌ | 1+扫描器 |
| 脏状态/资产监听内部通道 | ❌ | 5 |

## 3. 复用提示

- 动作名即工具契约: core 8/15 Unity 工具的 action 枚举（unity_editor 的 play/pause/refresh…、unity_script 的
  apply_text_edits…）最终路由到本目录这些 handler——补 own 桥动作时**先对齐 action 字符串与参数名**，
  core 侧即零改动可用。
- 安全边界: 任意执行域（ExecuteCSharpScript/ExecuteScriptCommand/ExecuteMenuItem/CustomTools）原版带
  execution_mode 播放态互斥、ScriptFix 自动修复、ReplGuard、WriteGuard/EditorAutomationGuard 守卫族；
  own 若实现必须同套守卫，且默认禁用（对齐 own Bridge.cs 现行决策并留显式开关）。
- `start_offscreen_stream` 是原版单窗口轻量流（区别于 NativeWindowBridgeHost 的 Composite/完整 GUI 链），
  GameCowork 现用 image-frames receiver 可对照其分辨率/帧率协商实现。
- `ensure_*` 修复型动作（mesh_collider_mesh/renderer_material/prefab_default_sprite）与 ScriptFix 是
  "Agent 自愈"设计：错误信息→自动修复→重试，值得 own 桥整体借鉴。
