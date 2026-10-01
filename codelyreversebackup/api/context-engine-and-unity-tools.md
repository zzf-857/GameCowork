# @ 上下文引擎（context providers / repoMap）+ core 内嵌 Unity Agent 工具目录

> 提取批次: 第二轮 core 域深挖 T9（2026-10-01）
> 来源: `restored/core-gamecowork-binary/binary/out/index.beautified.js`（与原版同源）、
> `restored/frontend/dist-beautified/assets/VscTheme-BExNMG_K.js`。
> 服务于 HANDOFF 缺口: P1「Inspector/Hierarchy/… 之外的编辑器能力」、Agent 的 @ 上下文与 Unity 工具面
> （对接 editor-bridge-original/ANALYSIS.md 的 26 个 Tools 管理器 —— 本文补 core 侧对端）。

## 1. context 域 RPC（index.beautified.js:335172-335204）

| 方法 | 载荷 | 返回/行为 |
|---|---|---|
| `context/repoMap` | - | 单例 `hOe.getMap()`（缓存字符串；未生成为 `""`） |
| `context/loadSubmenuItems` | `{title, query, continueSessionId?}` | 按 `config.contextProviders[].description.title` 找 provider，调 `loadSubmenuItems({config, ide, fetch, query, codeBaseIndexer, callUnityAcpMethod})`，返回子菜单项数组 |
| `context/getContextItems` | provider 特定 | `t.getContextItems` 分发（选中后的上下文内容项） |
| `context/getSymbolsForFiles` | `{uris[]}` | `aZa(uris, ide)` 提取文件符号（树-sitter/LSP） |

provider 均带 `callUnityAcpMethod` —— **@ 上下文可调 Unity 工具**（如按 GameObject 查询）。

## 2. 内建 context provider 目录（`static description` 扫描）

| title | displayTitle | type | 行为要点 |
|---|---|---|---|
| `file` | Files & Folders | submenu | 目录：`<directory_content path=…>` 列表；二进制：占位文案 `isBinaryFile=true`；文本：`readRangeInFile` 前 **1500 行**、行号前缀 `N-> `、总字节 **1MB** 封顶（超限整段替换为 "File snippet too large…"）（:322709-322760） |
| `problems` | Problems | normal | IDE 诊断列表 |
| `terminal` | Terminal | normal | 终端内容 |
| `run` | Run Output | normal | 运行输出 |
| `build` | Build Output | normal | 构建输出 |
| `debug` | Debug Output | normal | 调试输出 |
| `diff` | Git Diff | normal | Git 变更 diff |

- 排除目录（索引与快照通用）：`.gamecowork-cli/auto-saves`、`tool-outputs/shell`、`.gamecowork/.clipboard`（:322701）。
- 附加 provider：`getAdditionalSubmenuContextProviders()` 动态注入并广播 `refreshSubmenuItems {providers}`（:339287, :325123）。
- 前端图标对应 `dist/icons/*_context.png` 系列（code/file/terminal/problems/run/build/debug + unity_console/unity_game_object），两代 chunk 均有。

## 3. repoMap 生成器（:333109-333193）

- 单例懒生成：`generateMap(ide)` 取 `workspaceDirs[0]`，`setImmediate` 后台跑 `bOe.generateSnapshotAsync(root)`，结果缓存 `map`；`context/repoMap` 只读缓存。
- 基于 **tree-sitter** 全语言标签：扩展名映射表 `Lpe`（cpp/cs/py/ts/tsx/js/go/rust/ruby/java/php/lua/…，:333151-333193），与 CLI 的 tree-sitter-wasms 包同源。
- 复刻建议：GameCowork 已有 insight 索引 worker，repoMap 可由其派生（符号+引用摘要），不必重引入 tree-sitter 到 core。

## 4. 剪贴板/临时文件（聊天贴图链路，:335205-335219）

- `saveClipboardImage`：读剪贴板位图 → 存 `.gamecowork/.clipboard` → 返回路径（失败 `""`）。
- `getClipboardFilePath` → 剪贴板内文件路径列表；`saveTempFile {content, filename, extension, encoding}` → 临时文件路径。三者共同支撑"截图/文件拖入聊天"。

## 5. Unity Agent 工具目录（core 内嵌 ACP 工具定义，group:"Unity Tools"）

core 定义了 **8 个**面向 Agent 的 Unity 工具（`type:"function"` + `displayTitle/wouldLikeTo/hasAlready` 审批文案 + `systemMessageDescription` 提示词 + `defaultToolPolicy`），经 `unity/invokeTool` 路由到编辑器桥。**与 editor-bridge-original/ANALYSIS.md 的 C# Tools 管理器一一对接**——之前只提取了桥侧，core 侧 schema 属于遗漏。

| 工具名 | displayTitle | action 枚举（schema 摘要） | 关键参数 |
|---|---|---|---|
| `unity_editor` | Unity Editor Manager | `get_state, refresh, play, pause, resume, stop` | `timeoutSeconds`(≥1)，`singleFrame`(resume 必填)；refresh=同步导入+编译+清 Console+回读错误；"Requires Unity Bridge or Tuanjie Bridge connection" |
| `unity_console` | Unity Console Reader | get/clear 类 | 嵌入式读错误（配合 unity_editor.refresh 使用，:300763） |
| `unity_script` | Unity Script Manager | `create, read, update, delete, validate, get_sha, apply_text_edits, edit` | C#/MonoBehaviour/ScriptableObject/Editor 脚本 |
| `unity_package` | Unity Package Manager | `install_package, remove_package, list_packages` | `id_or_url`(可 `pkg@version`/Git URL)、`version`、`timeoutSeconds`(默认 300)；[EXPERIMENTAL]，兼容 Unity 2022.3 LTS |
| `unity_shader` | Unity Shader Manager | shader 相关 | :300655 |
| `unity_bake` | Unity Bake Manager | bake 相关 | :300378 |
| `unity_menu_item` | Unity Menu Item Executor | 执行菜单路径 | :300318 |
| `unity_screenshot` | Unity Screenshot Capture | 截图 | :300543 |

- 全部 `defaultToolPolicy:"allowedWithoutPermission"`（自动放行，不再逐次请求权限）——复刻时若改为需审批，要同步改 `wouldLikeTo/isCurrently/hasAlready` 三态审批文案。
- `systemMessageDescription`（前缀提示词 + exampleArgs）会拼进系统消息教模型用工具，例：unity_editor 前缀要求"每批文件改动后 refresh 一次，refresh 已回读 Console，勿再跟 unity_console get"（:300471-300481）。

## 6. unity/* RPC 面（core↔壳↔桥，:335100-335171, registry）

`unity/getStatus|getProjectStatus|getEngineType|getEditorPid|getHubProjectsAndEditors|openEditor|disconnect|refresh|invokeTool|installMcpPackage|checkPackageCompatibility|updatePackageVersion|openWindowBridge` + `unity/windowBridge/{listWindows,getStreamServerStatus,startStreamServer,stopStreamServer}`。

- `unity/invokeTool` 是工具执行的统一入口，失败回 `{status:"error", error, code?, response?}`（:335161-335167）。
- `unity/installMcpPackage|checkPackageCompatibility|updatePackageVersion`：把桥以 **UPM 包**装入用户工程并校验兼容性（对应原版桥的自动安装链路；GameCowork 目前是用户手动安装自有包，可参照此流做"检测+提示安装"）。

## 7. llm/* 直连模型域（core handler，:335227-335278）

`llm/streamChat`（经 ACP handler）、`llm/complete`、`llm/compileChat`、`countTokenPercentage`、`llm/listModels`、`llm/editCorrector`（`{file_path, file_content, old_string, new_string}` → 修正后的替换串，replace_all）、`llm/checkNextSpeaker`、`llm/loopDetect` / `llm/toolcallLoopDetect`（会话/工具调用死循环检测，按 conversationId 重置）。这是前端辅助功能（如"下一发言者判断"、编辑修正预览）直用模型的通道，与主聊天 ACP 链路并列。

## 8. 复刻注意事项

- `context/loadSubmenuItems` 的 provider 查找键是 `description.title`（小写枚举），前端子菜单与 core provider 必须同表维护。
- repoMap 是**每工作区缓存一次**的快照，不随文件变化自动失效——原版接受这种粗粒度（仅作 @codebase 的粗上下文）。
- Unity 工具的 `timeoutSeconds` 是"客户端响应预算"：refresh/play 等同步操作靠它控制等待；复刻编辑器桥执行器时必须实现可中断等待。
- 工具定义里的 `singleFrame`（resume 单帧步进）是桥侧能力，image-frames 流之外的独立输入通道。
