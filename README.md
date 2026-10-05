# GameCowork

面向 Unity / 团结引擎项目的 Windows 本地桌面工作台，将工作区管理、AI 编程、文件编辑、终端和编辑器预览整合在一个应用中。

项目参考 Tuanjie Cowork，从恢复的前端和业务代码逐步补齐自有宿主与编辑器集成。当前处于持续开发阶段；文件提取完整、源码验证通过和正式包验收是不同的状态。最新功能进展、已知限制和验证证据统一见 [RESTORE_STATUS.md](RESTORE_STATUS.md)。

## 当前能力与限制

截至 2026-10-04，主要实现范围如下；源码、装配包与真实服务的验收结果分别记录，具体格式、权限和验收边界以链接文档为准。

| 功能 | 当前范围 |
| --- | --- |
| 项目与编辑器 | 本地工作区管理、最近改动排序、安装列表持久缓存、后台刷新、真实本地模板创建 |
| AI 编程 | 自编译 Agent、流式会话、文件与命令审批、持久历史、会话分支与检查点回退；原模型菜单可显式启用官方 Pro 目录，单个文字模型的真实短请求已验收 |
| 开发工具 | 文件编辑与监听、终端、Git/Diff、C# LSP、本地 Unity Insight 索引、MCP 与自定义能力管理 |
| 编辑器集成 | Unity/团结窗口预览与输入、基本控制；场景与资产查询、Console、有限的场景写入，按工具分别验收 |
| AI 资产 | 原 Quick/History/ReactFlow 客户端接入43个官方生成契约并装配到正式app；双代逐模型/四分类/恢复流程已有隔离验证，真实45项中30项完成、15项HTTP400未跑通 |
| Codely 账号 | 已完成真实设备授权、DPAPI保存/恢复及组织查询/退出；原usage网页、邮箱或账号ID标签、真实订阅Pro展示已通过本人只读Rust/Core/Chromium原界面观察，正式原生窗口已重开；Wry几何范围见状态记录 |
| 自定义图片服务 | 独立 **第三方 · CPA** 分栏接入四个Image 2/2.5请求ID，Image 2.5已装配默认/快速/精致三按钮，采用账户自动size/quality、PNG及构图提示；8次真实实测7个产物完成/1次EOF失败，实际2.5换模未确认 |
| 自定义 Provider | Provider管理、独立凭据库与动态目录已装配并重开；OpenAI Images与显式REST任务适配器可生成，Chat / Responses / Ollama / ComfyUI目前仅配置和目录，执行未接入。XCAI三项完整目录、8+3次串行实测共6产物/5失败，Flare场景实际1536×1024横图；完整门禁、双代包内48项、本人11任务/6缓存隔离恢复与当前配置就绪已验 |

新一轮 XCAI 与通用 Provider 维护范围见 [最新状态](RESTORE_STATUS.md#xcai-custom-provider-20261004)。第三方 Provider 采用独立选择与模型目录，不混入 Codely 官方权益；保存、编辑、删除和读取模型不生成内容。逐模型分别记录尺寸、质量、参考图和独立超分的证据，未知质量与超分不当成可用档位；公开规范的size另作为请求方法，注明输出待验证。手动配置明确标为未验证，不能当作已实测。首轮五图均为实际1254×1254 PNG，精确尺寸/横图/2K请求未兑现；追加场景中Flare的幻想港口按1536×1024 / 3:2提示要求实际回图，另两次HTTP502。仅确认该组合，不扩大为任意尺寸、纯API参数单独有效或独立超分；quality仍仅是服务报告，真实档位与超分未知。用户原提示词、执行提示、请求规格和文件像素分别保存。

Provider主体及下拉主题、图片响应格式中文分类增量已原位更新并正常重开；增量双代48项、主题各8项与CPA兼容专项通过。完整门禁在增量前通过，未称增量后又跑全套；菜单视觉证明与原生窗口就绪分开记录。用户后来两次手动失败不混入Agent已结束的11次预算，历史错误保留。

最新4K接线已原位更新：XCAI按公开像素表发送标准`size`并保留提示词要求，质量独立；其他服务可选仅提示词或API尺寸策略。双代源码/候选专项各29项及原兼容流程各48项已验，追加独立授权的 **1张Image 2实际输出3840×2160 PNG**，文件与恢复像素/SHA一致；结论仅这次横图，不扩为Image 2.5、其他尺寸、高质量或超分。最新桌面启动于02:54再确认launcher退出后仍运行、配置与4K恢复，见 [最新尺寸补全记录](RESTORE_STATUS.md#xcai-custom-provider-20261004)。

10月4日后续用户同规格请求出现HTTP502及83秒网络失败；实际size已发送，当前180秒配置时限未被这次耗时证明触发。单张4K成功不代表服务稳定。本轮已在维护源码和完整候选补充安全网络诊断、“结果未知”提示与防重复提交，并让历史页显示这些记录；双代候选故障专项各27项通过，日常程序需经关闭更新后生效。实际服务失败事实、打包与门禁进展见 [当前状态](RESTORE_STATUS.md)。

随后按用户要求把401/402/404/502/503直接展示在错误卡片，并增加“查看错误详情 / 复制错误详情”，可见实际阶段、代码、HTTP、耗时、时限、任务与模型信息。旧记录没有的诊断明确标为未记录，安全服务说明保留，凭据与原始堆栈不展示。最新候选双代各104项（含原重试按钮可见性）已通过；该错误详情候选尚待更新到运行中的日常程序，不代表上游生成稳定性已经解决。

**本轮43个官方生成契约已进入正式app：16个图片契约（含Seedream分层辅助）、7个视频、12个3D，以及8个音频/文字契约。** Seedance2三个版本使真实清单共45项，目前30项完成，覆盖28个独立原模型；15项创建HTTP400且无远端ID，仍未真实跑通。9个已有远端任务的缓存失败已通过只GET查询/下载恢复，没有再次生成。用户明确3200为官方5小时编程窗口上限；上轮2026-10-03最后观测为3198已用、2剩余，不代表当前窗口余额；官方新GEN和新推理仍暂停，不安排自动续测。最新包、完整门禁和实际结果见 [当前状态](RESTORE_STATUS.md#official-all-models-20261003)。Canvas生成schema和云协作仍未接入。

完整 `-RealCore -Chat` 门禁、包内验收与真实服务人工结果分别记录在 [本轮验收与包来源](RESTORE_STATUS.md#official-all-models-20261003)；早期登录和单模型证据保留在 [官方权益交付记录](RESTORE_STATUS.md#codely-live-login-20261003)。此前真实CPA验证不能代替官方账号验收。新环境不会从仓库获得本机凭据或现成的`app/`安装。

本轮CPA接入与装配见 [第三方图片记录](RESTORE_STATUS.md#cpa-flexible-20261003)。四个确切请求ID为`gpt-image-2`、`gpt-image-2.5`、`gpt-image-2.5-flare`和`gpt-image-2.5-sunburst`，均实际回图；但公开任务回执未提供可确认实际模型身份，不能确认2.5/Flare/Sunburst换模。用户最多8次串行单张实测预算已用完，不再新增生成；7个产物核验完成，另1次HTTP500 EOF失败没有重试。

## 开始使用

本机已有装配包时，在项目根目录运行：

```powershell
.\app\启动GameCowork.bat
```

`app/` 是本地生成的程序目录，不随 Git 提交。克隆仓库不会自动获得可运行安装包，构建还需要已准备的 Node runtime、离线依赖和工具链，详见 [开发指南](docs/DEVELOPMENT.md) 与 [装配说明](docs/PACKAGING.md)。

本地界面无需官方账号。编辑器许可和外部模型认证由对应服务处理；真实 Provider 需要用户自行配置。添加、关闭或移除工作区不会删除项目文件。

项目页的“刷新本机项目”会重新读取版本和目录状态，保留缺失项目的注册与收藏；锁文件提示只表示发现该文件。安装页的“刷新本机编辑器”重新扫描已有安装。新项目沿用选定 Editor 内置的官方模板，损坏模板会单独列出原因，其它模板仍可创建。团结版本展示营销号，选择 Editor 时使用技术版本及产品、路径身份。

已安装 Editor 列表保存到本应用数据目录，重开先显示缓存；项目刷新与 Editor 发现分开，项目仍按最近文件改动排序。Editor 缓存过期后后台更新，也可以手动刷新。扫描失败保留旧列表并显示原因，已删除或变化的可执行文件不会继续冒充可用安装。

“AI 资产生成”当前入口复用 Codely 的快速生成、生成历史和 ReactFlow 画布客户端，保留原模型菜单、参数控件、手绘、历史筛选与节点编辑界面；本地兼容层保存自有历史、标签、界面偏好和画布图数据。当前接线已装配到日常 `app/`，来源、包内验证与真实服务验收分别见 [装配与验收记录](RESTORE_STATUS.md)；维护方式见 [开发指南](docs/DEVELOPMENT.md#原客户端资产界面与本地兼容层)。

原 Quick 的四分类模型继续使用原参数控件、报价、提交和轮询；契约包含分层、天空盒、模型处理、音乐音效、TTS、视频和提示词。服务付费状态与数值报价就绪才提交，引用仅接受当前工作区登记的自有素材，数量和媒体类型按模型控制，组合不超过64 MiB。产物核验媒体、长度和SHA后进入缓存、历史、再生成草稿与原生下载；声音克隆按原逻辑使用实际返回的音频预览，只保留真实返回的音色身份。隐藏/内部模型保持原权限边界。CPA 在第五个 **第三方 · CPA** 分栏选择，内部仍按图片模式复用原任务、历史、再生成和下载；与官方账号权益、报价分开接线。

用户CPA为v8.0.8/fd48ea6，本次7个成功样本均返回实际1254×1254 PNG、报告quality=low；横/竖/custom尺寸、高级质量及JPEG/WebP请求没有兑现。正式入口采用单张、账户自动size/quality、PNG和明确的构图提示，已移除精确像素/2K/4K、高级质量和服务格式切换，避免把这些选项显示为已验证能力。这是保守策略，不推定账户永久固定输出。比例提示参考 [同原生路径作者实测](https://github.com/foksa/codex-img/blob/55710a2299a8e560bad780bc54b4304b19a90ca2/README.md#the-backend)，本机唯一16:9提示样本EOF，不承诺比例生效。保留Provider/密钥与历史请求，实际像素和服务报告分别显示；已原位更新并重开，最终双代47项fixture与真实结果分别见活动状态。

声音克隆的原媒体分类曾因`preview`键把MP3当图片。已装配补丁仅让已知音频扩展先于键名判断，原播放器保持原字节；源码和补丁后候选的MP3/Opus播放专项通过，其余codec与完整门禁范围见 [本轮状态](RESTORE_STATUS.md#official-all-models-20261003)。

官方编程模型入口位于原聊天模型菜单：点击 **启用 Codely 官方 · Pro 模型**，加载服务实际返回的模型目录，再选择官方模型。正式包已取得本人真实目录，并完成单个文字模型短请求的人工验收；各模型的实际验证范围统一见 [当前状态](RESTORE_STATUS.md)。真实推理 Key 只留在 Core 内存，Agent 获得限定工作区、会话和所选模型的本机访问能力。CPA 与官方模型可切换，已有 CPA 设置保留。接手从 [交接导读](docs/history/HANDOFF.md) 开始。

参考素材与手绘通过原客户端上传流程进入本机缓存。本轮源码扩展 WAV / MP3 / AAC / FLAC / Ogg Opus / AAC-LC M4A，以及 FBX / OBJ / STL / ZIP / USDZ；已有 PNG / JPEG / WebP / MP4 / WebM / GLB 保留，天空盒结果增加有界 EXR / HDR 检查。单文件最多 64 MiB，格式接受范围按真实容器和模型要求判定；媒体检查不代表全部编码已解码或可在浏览器预览。GIF、SPLAT 与超出检查范围的变体仍明确拒绝。画布保存原节点、连线、视口和其它图字段；重启后只更新已核验自有媒体的本机地址。

原 Quick、历史和 Canvas 的本地媒体下载使用原生保存位置选择，核对实际文件 SHA，取消不写入、重名不覆盖，并显示失败原因。已完成的两代包内流程及真实 Windows 保存/取消验证、包来源和交付记录见 [下载验证记录](RESTORE_STATUS.md)；不包含外站或临时 blob 导出。

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
