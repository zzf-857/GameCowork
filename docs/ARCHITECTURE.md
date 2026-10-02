# GameCowork 架构与目录职责

本文记录当前代码组织和依赖边界。功能状态只写入 [RESTORE_STATUS.md](../RESTORE_STATUS.md)，环境与命令见 [开发指南](DEVELOPMENT.md)。

## 运行分层

```text
前端 bundle（桌面 / 工作区 GUI / 画面接收页）
                     │ HTTP / SSE / WebSocket
                     ▼
Rust 宿主（wry + tao + axum）
  ├── 工作区、文件、Git、终端与进程生命周期
  ├── stdio 消息中继 ── Node Core ── 自编译 Agent CLI
  ├── 独立索引 worker（SQLite / parser）
  ├── 冻结 C# LSP（显式启用）
  └── loopback 编辑器桥 ── Unity / 团结 Editor API
```

Core 保留会话、模型与工具编排逻辑；宿主负责桌面、本地系统能力与子进程所有权。Agent 的部分编辑器工具还经工程专属 loopback TCP 访问桥，不能只验证界面到宿主的一条链就宣称 Agent 工具完成。

## 维护输入

| 目录 | 主要入口 | 职责与约束 |
| --- | --- | --- |
| `src/shell/` | `src/main.rs` | Rust 装配、路由、Core 中继和窗口事件；模块测试与实现同处 |
| `src/frontend/` | `bundle/index.html`、`bundle/gui.html` | 当前与上一代界面；共用行为需同步修复 |
| `src/core/` | `binary/out/index.js` 与 `index.beautified.js` | 实际 Core 和对应可读入口；两份逻辑成套维护 |
| `src/agent/` | `cli-main.beautified.js`、`resources/` | 恢复的 CJS 工厂和内置资源；经 tools 恢复入口后由 Bun 编译 |
| `src/unity-insight/` | `bundle/gamecowork-worker-entry.mjs` | 本地索引、查询、watch 与权限适配；资源清单保持完整 |
| `src/editor-bridge/` | `Editor/`、`package.json` | 自有 Editor-only UPM 包，保留 Unity `.meta` 身份 |
| `vendor/csharp-lsp/` | `runtime/`、dependency ledger | 第三方冻结依赖，不在此修改官方实现；完整性由 SHA 验证 |

Core 的 `binary/out/`、Agent 的 `carved/` 和前端的带哈希 chunk 仍保留恢复结构，目的是维持模块定位、相对加载和来源证据。本次没有将这些 bundle 宣称为已模块化的原始工程。

## Rust 模块落点

所有模块位于 `src/shell/src/`。新增逻辑先进入所属模块，入口只负责路由接线与服务装配。

| 领域 | 模块 |
| --- | --- |
| 消息协议与进程所有权 | `transport.rs`、`process_lifetime.rs` |
| 工作区与本地编辑 | `workspaces.rs`、`files.rs`、`mutations.rs`、`file_events.rs` |
| 桌面单实例与防休眠 | `single_instance.rs`（按登录会话 / 数据目录的内核锁、验证代际后转发启动目录）、`keep_awake.rs`（专用线程、电源请求与持久偏好） |
| 开发工具 | `git.rs`、`terminals.rs`、`lsp.rs`、`insight.rs` |
| 编辑器发现、模板、许可边界与桥 | `editor_installations.rs`、`project_templates.rs`、`editor_licensing.rs`、`editor_bridge.rs` |
| 安装列表持久缓存 | `editor_installations_cache.rs`（快照、刷新合并、失败保留与 SSE 更新） |
| 生成资产导出 | `generated_assets.rs`（只接收 Core 确认的资产身份，复用工作区 mutation 边界） |
| 原资产客户端的本地接口 | `codely_http.rs`（同源 API、原 multipart 上传、可信媒体 Range、重启地址解析）、`codely_canvas.rs`（完整图、真实版本快照与浏览器编辑租约） |
| 串流布局与原生窗口 | `stream_layout.rs`、`native_window.rs`、`native_window.js` |
| HTTP / WebView 装配 | `main.rs` |

`main.rs` 仍包含较多路由和 Core 适配逻辑，前端 / Core 仍有大 bundle。这些是后续按功能拆分的维护成本；2026-10-01 的目录迁移保留了当时的协议和业务行为，后续功能变化以源码及活动状态文档为准。

两代主界面的会话分支 / 回退共用 `src/frontend/bundle/assets/gamecowork-history-operations.js`，冻结原会话与工作区代次，后端持久成功后才发布分支。Core 的 `history/rewind` 以真实 ACP 预览和执行回执判断结果，不能从异常制造可回退检查点。桥的 `EditorSceneQueries.cs` 只在主线程查询已加载普通场景，与 Agent 的查询动作及 Rust 精确动作白名单成套接线。

两代原生 GUI 启动从各自 `store-*.js` 的 `gamecoworkGetStoreMessenger()` 取得 Redux thunk 的同一消息 client，并复用已有 store、persistor 和草稿状态；Native 启动只恢复该 client 的健康检查与握手。界面 Context 和 thunk 不各建一个握手 client。

Core 的 `Tma` 在真实 `session/new` 完成且 holder / 初始化 promise / messenger 仍属于当前代次时登记会话，再回放 manager 缓存的 `available_commands_update`。`Pma` 等待已存在的 pending 初始化并刷新仍注册的 owner，不为刷新另建会话；回执保留 `refreshed`、`skipped`、`pendingInit`，初始化或刷新失败明确返回错误。已关闭 messenger 的晚到初始化会释放其 manager，旧 manager 通知也不会重新发布命令。

当前两代主界面的资产入口使用原 PG / QG / sq 容器，加载 `codely-generator/` 内原 Quick / History 与 `codely-canvas/` 内原 ReactFlow 客户端。它们来自实际 Codely 包明确引用的远端客户端，资源及精确适配补丁记录在各自 `source-ledger.json`；不是 EXE 内嵌服务端。此前 `gamecowork-asset-generation.js` 的自研界面仍保留为历史维护输入，但不再是当前入口。

底层资产服务为 `src/core/binary/out/gamecowork-assets.js`，两份 Core 入口注册同一个 `generator/*` 服务；`gamecowork-codely-generator.js` 按原客户端 API 形状适配本应用历史、标签、偏好、上传与媒体。Rust 将请求集中到默认 Core owner。Provider 配置、任务、上传与实际媒体保存在 Core home 的 `generator/`，API Key 不回显；原模型与自定义 Provider 的显式映射尚未完成，未配置生成返回错误，官方积分与服务权限不伪造。

当前只有自有 `cpa-gpt-image-2` 条目通过 `local-models.js` 附加到原注册表，并由 `local-generation.js` 消费逐模型能力。`modelBindings` 持久引用实际Provider，Core每次提交重新核对enabled、认证、模型和适配器，客户端不能在生成payload中改选Provider。原45模型仍未映射；Quick的CPA绑定也不等同Canvas服务端schema已实现。实际PNG宽高写入artifact元数据，保留请求参数与真实结果的区别。

原画布图和版本保存在本应用 data 的 `codely-canvas/`。原节点数据、边、视图和未知字段保留；本机 runtime session 与原客户端浏览器编辑租约分别校验。上传绑定实际已保存画布及有效租约，不把原 `workspace_hash` 当文件权限。媒体读取只接受已登记的 input 或 task / artifact 身份；Rust 校验文件路径、大小和 SHA 后直接返回二进制与 Range，不让大文件经过 Core 的 16 MiB stdio 帧。宿主端口变化时，私有 Core helper 校验旧 URL 的实际身份、作用域及文件 SHA，只改读响应中的完整 URL 值，不改原保存图、文本子串或外部链接。导出沿用 `mutations.rs` 的工作区写入边界。

参考导入使用同源 `POST /api/tauri/generator/inputs` 的原始文件字节，单件有界 64 MiB、并发读取有界，普通 JSON invoke 的大小限制保持不变。Rust 专属 UUID 暂存于 `generator/incoming/`，经内部注册消息交给 Core；Core 只能从该 ID 派生固定路径，重验内容 / MIME / SHA 后复制到 `generator/inputs/` 并提交 `inputs.json`。公开 RPC 不能调用注册与路径查询内部消息，原生请求结束仅清理自己创建的暂存文件。任务保存输入 ID 和元数据，提交前再次验证持久文件；JSON 与 multipart 由同一冻结输入生成，媒体字节不经过 Core stdio。工作区校验固定为实际 `data.workspaceKey`，避免外层消息与业务数据选择不同范围。

`EditorConsole.cs` 在 Editor 主线程读取原生 Console，返回 `scope:"current-native-console-view"`、`nativeConsoleFiltersApplied`、实际原生筛选状态，以及 `queryComplete` / `filterLimitation`。Get 不改变 Console flags、搜索、Collapse 或 EditorPrefs；`types:["all"]` 也只查询当前原生视图。清空仅在批准的 Agent 路径支持 `clear(all)`，校验原工程、domain、client / cancel nonce，在 effect 提交前检查取消；提交后不自动回滚。Rust 通用本地工具入口仅允许 Console get，详细边界见 [编辑器桥说明](../src/editor-bridge/README.md)。

`EditorContextQueries.cs` 提供六项主线程读取：选择、工程根目录、实际窗口、标签、层和活动工具；不切换工具、焦点或选择。`EditorAssetQueries.cs` 使用真实 AssetDatabase 和已注册包挂载，分页与扫描 / 响应预算保留 `queryComplete`、`truncated`、`totalAssetsExact`。`AssetPreview` 的异步结果保留实际 `previewStatus`；仅就绪原生像素编码为有界 PNG，不以缩略图替代失败。`EditorPackageQueries.cs` 读取 `PackageInfo.GetAllRegisteredPackages()` 的当前已加载注册表，声明 `scope:"currently-loaded-registered-packages"`，不从 manifest 推断安装结果或发起联网 UPM 列单。

`EditorSceneMutations.cs` 在主线程执行批准后的空对象 create、有限 modify 和已加载场景 save。create / modify 使用 Unity Undo 并标记实际场景 dirty；save 仅写原有场景文件，校验启动时工程 / Assets 与已加载场景文件的 Windows 身份，拒绝链接、硬链接和替换代次。路径检查与 Unity 的保存调用之间仍有 TOCTOU 窗口，保存也不是可回滚事务。`EditorCancellation` 在 effect admission 前校验同工程、domain、client / cancel nonce 及原 TCP 所有权；nonce 位于 transport envelope，不由模型参数提供。Agent 按实际 action 判断读写权限，拒绝用 `command` / `operation` 遮蔽写动作；同一调度队列中的编辑器控制、Console clear 和场景写入串行，读取批次在下一项写入前结束。Rust 通用本地工具入口继续拒绝场景写动作。

## 依赖与产物边界

- `tools/` 从 `src/` 与 `vendor/` 读取维护输入，在统一 temp 内准备资源，再装配到 `app/`。
- `src/` 不依赖 `tests/`、`research/` 或原软件目录提供生产行为；测试 guard 只进入隔离测试 Agent。
- 正式包使用自身 `app/frontend`、`app/core`、`app/cli`、`app/unity-insight`、`app/lsp-csharp` 与 `app/editor-bridge`；开发 fallback 不得代替包内资源。
- `research/`、`tools/research/` 与 `docs/history/` 保存历史分析，不进入默认构建和门禁。
- `codelyreversebackup/` 与 `original/` 保持原路径，只读对照。研究资料新增不等于运行功能完成。
- `codelyreversebackup_fromunityhub/` 保存 Unity Hub 原字节区域及纯函数适配，源码索引记录原路径、SHA 和依赖限制；装配不加载它。产品沿用已有 Core 扫描与本地模板创建，并在 Rust 内适配 Hub 的逐坏包隔离语义。
- `tests/fixtures/` 提供模拟服务、guard 与自有编辑器工程代码，`tests/support/` 提供测试辅助函数；它们都不是产品模块。

运行数据与临时产物的位置见 [README](../README.md#架构与维护边界)。不能把日志、截图、测试工程、真实凭据或用户数据写入源码目录。

项目列表读取 `ProjectVersion.txt` 时限制为 1 MiB；缺失目录保留注册及收藏并返回 `pathExists` / `metadataWarning`，`lockFilePresent` 不表示已连接 Editor。项目与安装发现分别调用 Core 的 `unity/getHubProjects` 和 `unity/getHubEditors`，项目刷新不会隐式重扫 Editor。安装快照持久保存至应用数据目录的 `installed-editors.json`，15 分钟内复用有效快照，过期后台刷新；显式刷新等待真实扫描。失败保留旧快照及其时间，SSE 与 HTTP 按请求代次处理。项目最近改动来自有界文件元数据扫描，`lastModifiedUnixMs` 用于排序；扫描不完整保留提示。两代界面共用 `gamecowork-project-status.js` 与 `gamecowork-editor-licensing.js`；许可 DTO 将 `workspaceAllowed:true` 与未知的 `isValid` / `editorLicenseValid:null` 分开，激活、申请、导入、服务器配置和归还请求在本地宿主明确拒绝。

## 旧目录迁移表

2026-10-01 的目录整理保留了所有已跟踪输入。旧验收日志与历史文档正文中的路径表示当时布局；新命令使用下表右侧路径。

| 旧位置 | 当前位置 |
| --- | --- |
| `restored/shell/` | `src/shell/` |
| `restored/frontend/dist-beautified/` | `src/frontend/bundle/` |
| `restored/frontend/package.json`（推断清单） | `research/frontend-package.reference.json` |
| `restored/core-gamecowork-binary/` | `src/core/` |
| `restored/cli-gamecowork/` | `src/agent/` |
| `restored/cli-unity-insight/` | `src/unity-insight/` |
| `restored/editor-bridge/` | `src/editor-bridge/` |
| `restored/lsp-csharp/` | `vendor/csharp-lsp/` |
| `restored/src-tauri/`、`restored/hub/` | `research/tauri-shell/`、`research/hub/` |
| `restored/PACKAGING.md`、`UNITY_INTEGRATION.md`、`DUAL_ENGINE_MULTI_PROJECT.md` | `docs/` 下同名文档 |
| 根目录 `HANDOFF.md` | `docs/history/HANDOFF.md` |
| 平铺的 `tests/*` | 按 [测试导航](../tests/README.md) 分类，文件名保留 |
| 历史探针与提取脚本 `tools/*` | `tools/research/`，见 [工具导航](../tools/README.md) |

不保留第二份可编辑源码或旧路径软链接。发现旧外部脚本时按迁移表修正，不重新创建 `restored/`。开发期构建缓存仍在 `src/shell/target/` 并被 Git 忽略。
