# GameCowork

面向 Unity / 团结引擎项目的 Windows 本地桌面工作台，将工作区管理、AI 编程、文件编辑、终端和编辑器预览整合在一个应用中。

项目参考 Tuanjie Cowork，从恢复的前端和业务代码逐步补齐自有宿主与编辑器集成。当前处于持续开发阶段；文件提取完整、源码验证通过和正式包验收是不同的状态。最新功能进展、已知限制和验证证据统一见 [RESTORE_STATUS.md](RESTORE_STATUS.md)。

## 当前能力与限制

截至 2026-10-03，本轮已完成本机装配与交接。主要能力如下，具体格式、权限和验收边界以链接文档为准。

| 功能 | 当前范围 |
| --- | --- |
| 项目与编辑器 | 本地工作区管理、最近改动排序、安装列表持久缓存、后台刷新、真实本地模板创建 |
| AI 编程 | 自编译 Agent、流式会话、文件与命令审批、持久历史、会话分支与检查点回退 |
| 开发工具 | 文件编辑与监听、终端、Git/Diff、C# LSP、本地 Unity Insight 索引、MCP 与自定义能力管理 |
| 编辑器集成 | Unity/团结窗口预览与输入、基本控制；场景与资产查询、Console、有限的场景写入，按工具分别验收 |
| AI 资产 | 复用原 Quick/History/ReactFlow 客户端；手绘、素材上传、视频截帧、历史筛选、完整画布保存与重启恢复 |
| 自定义图片服务 | 明确标注的 **GPT Image 2 · CPA** 文生图入口，复用原控件、轮询和历史再生成；固定单张 PNG 请求，产物尺寸按实际文件记录 |

**尚未接通官方 Codely 账号、会员订阅和积分。** 原 45 个模型的服务、Canvas 生成 schema、音频生成及部分节点也仍待完善，不能把界面或源码存在当作功能完成。下一阶段优先恢复真实设备授权与组织订阅，详见 [后续开发计划](RESTORE_STATUS.md#handoff-plan)。

本轮完整 `-RealCore -Chat` 门禁通过，包括 148 项 Rust 测试和两代原资产界面、CPA 隔离流程；真实 CPA 的文字、工具调用协议与图片服务另作人工验证。当前交付记录见 [验收与包来源](RESTORE_STATUS.md#handoff-20261003)。新环境不会从仓库获得本机凭据或现成的 `app/` 安装。

## 开始使用

本机已有装配包时，在项目根目录运行：

```powershell
.\app\启动GameCowork.bat
```

`app/` 是本地生成的程序目录，不随 Git 提交。克隆仓库不会自动获得可运行安装包，构建还需要已准备的 Node runtime、离线依赖和工具链，详见 [开发指南](docs/DEVELOPMENT.md) 与 [装配说明](docs/PACKAGING.md)。

本地界面无需官方账号。编辑器许可和外部模型认证由对应服务处理；真实 Provider 需要用户自行配置。添加、关闭或移除工作区不会删除项目文件。

项目页的“刷新本机项目”会重新读取版本和目录状态，保留缺失项目的注册与收藏；锁文件提示只表示发现该文件。安装页的“刷新本机编辑器”重新扫描已有安装。新项目沿用选定 Editor 内置的官方模板，损坏模板会单独列出原因，其它模板仍可创建。团结版本展示营销号，选择 Editor 时使用技术版本及产品、路径身份。

已安装 Editor 列表保存到本应用数据目录，重开先显示缓存；项目刷新与 Editor 发现分开，项目仍按最近文件改动排序。Editor 缓存过期后后台更新，也可以手动刷新。扫描失败保留旧列表并显示原因，已删除或变化的可执行文件不会继续冒充可用安装。

“AI 资产生成”当前维护入口复用 Codely 的快速生成、生成历史和 ReactFlow 画布客户端，保留原模型菜单、参数控件、手绘、历史筛选与节点编辑界面；本地兼容层保存自有历史、标签、界面偏好和画布图数据。来源与接线范围见 [开发指南](docs/DEVELOPMENT.md#原客户端资产界面与本地兼容层)。这些是维护源码的当前行为，日常 `app/` 是否已包含它们，以 [装配与验收记录](RESTORE_STATUS.md) 为准。

新增 **GPT Image 2 · CPA** 是明确标注的自有接入，复用原模型菜单、生成、轮询和历史再生成流程；当前支持单张 PNG 文生图。原 45 个模型的服务映射尚未完成，未配置模型明确返回“尚未绑定”。本地身份不代表官方登录、订阅或积分；Canvas 的云模板、组织协作及生成 schema 仍未接入。全部已完成功能、代码入口与后续详细计划见 [当前状态](RESTORE_STATUS.md)，接手从 [交接导读](docs/history/HANDOFF.md) 开始。

参考素材与手绘“保存到参考图”通过原客户端上传流程进入本机缓存，支持 PNG / JPEG / WebP / MP4 / WebM / GLB，单文件最多 64 MiB。原界面仍有其它格式入口，GIF、音频、FBX/ZIP、SPLAT 等未获本地核心支持的文件会明确拒绝。画布保存原节点、连线、视口和其它图字段；重启后读取图时，只更新已核验自有媒体的本机地址，不修改磁盘图数据或代理外部链接。

“Unity 许可证”页明确区分本地工作区权限、Unity Editor 和团结引擎许可；编辑器许可显示尚未检测，申请和激活入口使用官方 Hub 说明。Unity Hub 原码参考与可复用片段保存于 [Unity Hub 提取库](codelyreversebackup_fromunityhub/README.md)，不作为运行时依赖。

重复启动会唤起现有窗口。也可运行 `app\GameCowork.exe --workspace <已有项目目录>`，首次启动直接打开目录，后续启动将目录转交给正在运行的应用；同一 Windows 登录会话、同一应用数据目录共用一个宿主和 Core。“设备设置”里的防休眠可以独立启用，偏好在重启后恢复。

聊天支持从消息处分支及文件检查点预览/回退，流式输出期间会阻止这些操作；分支保存失败会保留原对话。已连接的编辑器可查询已加载场景层级、对象及序列化组件属性，也可读取当前选择、工程根目录、窗口、标签、层和活动工具，具体范围见 [桥说明](src/editor-bridge/README.md)。

Agent 的 `unity_asset` 支持搜索真实 AssetDatabase、读取 `Assets` 与已注册 `Packages` 资产信息，并按实际状态返回原生预览；预览可能仍在生成或不可用，只有 `previewReady:true` 才带真实 PNG。`unity_package` 列出编辑器当前已加载的注册包，不查询远端可安装版本。资产写入、包安装与移除仍待补齐。

经过批准，`unity_gameobject` 可在编辑模式创建空对象或修改本地 Transform / 激活状态，支持 Undo；`unity_scene` 可把已加载且已有文件的场景保存回原文件。写操作按提交顺序串行执行，批准身份绑定原工程与 Editor 代次，确认尚未提交的取消不会产生效果。磁盘保存和已提交效果不会因后续取消自动回滚；不支持 SaveAs、未加载场景写入或任意脚本执行。

`unity_console` 和 `@Console` 读取已连接编辑器的当前原生 Console 视图；结果受严重性开关、搜索与 Collapse 状态影响，并保留完整性限制，不能把可见记录当作完整日志。清空仅支持经过批准的 `clear` / `scope:"all"`，会清除整个 Console；选择性清空、时间增量读取和修改 Collapse 尚不支持。

## 开发与验证

以下命令均在项目根目录、PowerShell 7 中执行：

```powershell
# 快速检查目录边界、模块路径和文档链接
node .\tools\check-layout.mjs

# 完整默认门禁：Rust、源码契约、隔离 HTTP 与 Chromium 界面
.\tools\verify-local.ps1

# 仅后端与契约验证；不能代替界面验收
.\tools\verify-local.ps1 -SkipBrowser

# 构建 Release 并更新本机 app（先关闭该 app 窗口）
.\tools\build-local.ps1
```

也可以使用 `npm run check:layout`、`npm run verify`、`npm run verify:backend` 和 `npm run build:local`。根目录的 `package.json` 仅提供命令入口，不需要先安装 npm 依赖。

真实 Core / Agent 的受控验证使用 `-RealCore -Chat`；真实编辑器验证再加 `-Editor`。这些门禁的依赖、隔离要求及适用范围见 [开发指南](docs/DEVELOPMENT.md#验证选择)。

## 目录导航

```text
GameCowork/
├── src/                     # 实际维护输入
│   ├── shell/               # Rust 桌面宿主与本地 HTTP/SSE/WebSocket
│   ├── frontend/            # 前端说明与 bundle/（两代界面代码）
│   ├── core/                # Node 业务核心，入口 binary/out/index.js
│   ├── agent/               # Agent CLI 维护入口与内置资源
│   ├── unity-insight/       # 本地代码、资产索引 worker
│   └── editor-bridge/       # 自有 Unity Editor-only UPM 包
├── vendor/csharp-lsp/        # 冻结的第三方运行时、许可证和哈希清单
├── tests/                   # contracts / integration / e2e / fixtures / support
├── tools/                   # 构建、验证、维护工具；research/ 保存历史脚本
├── docs/                    # 架构、开发、装配与编辑器使用说明
├── research/                # 历史 Tauri 骨架、Hub 分析、前端依赖推断
├── codelyreversebackup/      # 原版研究资料，保留现有路径供只读对照
├── codelyreversebackup_fromunityhub/ # Unity Hub 四域原码、来源与复用说明
├── original/                # 原始安装镜像（只读、不入库）
├── app/                     # 本机装配产物（不入库）
├── AGENTS.md                # 项目开发约束
└── RESTORE_STATUS.md         # 唯一活动功能状态与验收记录
```

`src/frontend/bundle/` 是当前维护的前端输入，仍包含恢复的 React / Monaco 等 bundle，尚不是完整的 TypeScript / Vite 源码工程。Core 和 Agent 也保留了恢复 bundle 的结构。目录整理没有改变这一限制，不能把历史依赖推断清单当作可复现的前端构建配置。

## 架构与维护边界

当前桌面宿主是 **wry / tao + WebView2**，由 axum 提供 loopback HTTP、SSE 和 WebSocket。前端通过宿主访问本地能力；宿主中继 Node Core 消息，并管理工作区、文件、终端、索引、C# LSP 和编辑器桥的生命周期。Agent CLI 由自有入口经 Bun 编译。

原生桌面启动复用已有 Redux store、persistor 和消息 client，使界面与 thunk 请求共享握手；Core 在会话登记后回放初始化期间收到的真实命令列表。命令刷新等待已有初始化，关闭工作区后的晚到初始化和通知会被拒绝。实现与验收边界见 [架构说明](docs/ARCHITECTURE.md) 与 [开发指南](docs/DEVELOPMENT.md)。

历史 Tauri 壳位于 `research/tauri-shell/`，不参与当前构建。`app/` 只通过构建脚本更新；前端两代共用逻辑、Core 的两份入口需要成套修改与验证。详细依赖方向和模块落点见 [架构说明](docs/ARCHITECTURE.md)。

| 数据 | 默认位置 |
| --- | --- |
| 工作区注册与界面偏好 | `%LOCALAPPDATA%\GameCowork` |
| Core / CLI 用户状态 | `%USERPROFILE%\.gamecowork` / `.gamecowork-cli` |
| 隔离工程、日志、截图、构建暂存 | `F:\AI\AgentMake\temp\GameCowork` |

编辑器桥仅在用户针对选定工程触发安装时修改该工程的依赖，并保留原字节备份。自动测试使用隔离数据和本地模拟服务，不调用真实 Provider 额度。远程、音频 / WebRTC、第三方媒体生成与安装更新等能力，以状态文档中各自的验收范围为准。

## 文档索引

| 文档 | 内容 |
| --- | --- |
| [开发指南](docs/DEVELOPMENT.md) | 环境、维护流程、验证与构建命令 |
| [架构说明](docs/ARCHITECTURE.md) | 分层、模块职责、依赖方向、旧路径迁移表 |
| [装配说明](docs/PACKAGING.md) | 正式资源来源、CLI guard、哈希与运行时边界 |
| [编辑器集成](docs/UNITY_INTEGRATION.md) | 连接、预览与串流入口 |
| [双引擎与多工程](docs/DUAL_ENGINE_MULTI_PROJECT.md) | 多来源与生命周期背景 |
| [测试导航](tests/README.md) | 门禁分类和 fixture 约束 |
| [工具导航](tools/README.md) | 日常工具与历史提取脚本 |
| [功能状态](RESTORE_STATUS.md) | 当前进展、限制与逐次验证证据 |
| [交接导读](docs/history/HANDOFF.md) | 最新接手顺序、源码边界及详细计划入口；文末保留旧交接原文 |
| [初期提取记录](docs/history/EXTRACTION.md) | 历史背景，不作为当前运行指南 |
