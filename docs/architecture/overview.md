# GameCowork 架构与目录职责

本文记录当前代码组织和依赖边界。功能状态只写入 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)，环境与命令见 [开发指南](../development/guide.md)。

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

Core 的恢复入口与 worker、Agent 的 `carved/` 和前端的带哈希 chunk 仍保留来源结构；自有 Core 模块按功能归入 `binary/out/modules/`，目的是维持模块定位、相对加载和来源证据。本次没有将这些 bundle 宣称为已模块化的原始工程。

## Rust 模块落点

模块按领域位于 `src/shell/src/{workspace,editor,developer_tools,assets,account,platform,core}/`。`main.rs` 用 `#[path]` 保持原 crate 模块名，入口负责路由接线与服务装配。新增逻辑进入所属领域。

| 领域 | 模块 |
| --- | --- |
| 消息协议与进程所有权 | `core/transport.rs`、`platform/process_lifetime.rs` |
| 工作区与本地编辑 | `workspace/registry.rs`、`workspace/files.rs`、`workspace/mutations.rs`、`workspace/file_events.rs` |
| 桌面单实例与防休眠 | `platform/single_instance.rs`（按登录会话 / 数据目录的内核锁、验证代际后转发启动目录）、`platform/keep_awake.rs`（专用线程、电源请求与持久偏好） |
| 开发工具 | `developer_tools/git.rs`、`developer_tools/terminals.rs`、`developer_tools/lsp.rs`、`developer_tools/insight.rs` |
| 编辑器发现、模板、许可边界与桥 | `editor/installations.rs`、`editor/project_templates.rs`、`editor/licensing.rs`、`editor/bridge.rs` |
| 安装列表持久缓存 | `editor/installation_cache.rs`（快照、刷新合并、失败保留与 SSE 更新） |
| 生成资产导出 | `assets/exports.rs`（Core 确认身份；工作区导出复用 mutation，原客户端下载由原生文件选择后 create-new 写入并核验 SHA） |
| 原资产客户端的本地接口 | `assets/codely_http.rs`（同源 API、原 multipart 上传、可信媒体 Range、重启地址解析）、`assets/codely_canvas.rs`（完整图、真实版本快照与浏览器编辑租约） |
| Codely 账号宿主支持 | `account/codely.rs`（仅 Core 可调用的 Windows DPAPI vault、系统浏览器授权链接与打开结果） |
| 串流布局与原生窗口 | `editor/stream_layout.rs`、`platform/native_window.rs`、`platform/native_window.js` |
| HTTP / WebView 装配 | `main.rs` |

`main.rs` 仍包含较多路由和 Core 适配逻辑，前端 / Core 仍有大 bundle。这些是后续按功能拆分的维护成本；2026-10-01 与 2026-10-06 的目录迁移保留协议和业务行为，后续功能变化以源码及活动状态文档为准。恢复依赖中的包内备份项也属于来源快照，保持加载布局与字节，不与开发者新生成的备份混放。

两代主界面的会话分支 / 回退共用 `src/frontend/bundle/assets/gamecowork-history-operations.js`，冻结原会话与工作区代次，后端持久成功后才发布分支。Core 的 `history/rewind` 以真实 ACP 预览和执行回执判断结果，不能从异常制造可回退检查点。桥的 `EditorSceneQueries.cs` 只在主线程查询已加载普通场景，与 Agent 的查询动作及 Rust 精确动作白名单成套接线。

两代原生 GUI 启动从各自 `store-*.js` 的 `gamecoworkGetStoreMessenger()` 取得 Redux thunk 的同一消息 client，并复用已有 store、persistor 和草稿状态；Native 启动只恢复该 client 的健康检查与握手。界面 Context 和 thunk 不各建一个握手 client。

Core 的 `Tma` 在真实 `session/new` 完成且 holder / 初始化 promise / messenger 仍属于当前代次时登记会话，再回放 manager 缓存的 `available_commands_update`。`Pma` 等待已存在的 pending 初始化并刷新仍注册的 owner，不为刷新另建会话；回执保留 `refreshed`、`skipped`、`pendingInit`，初始化或刷新失败明确返回错误。已关闭 messenger 的晚到初始化会释放其 manager，旧 manager 通知也不会重新发布命令。

当前两代主界面的资产入口使用原 PG / QG / sq 容器，加载 `codely-generator/` 内原 Quick / History 与 `codely-canvas/` 内原 ReactFlow 客户端。它们来自实际 Codely 包明确引用的远端客户端，资源及精确适配补丁记录在各自 `source-ledger.json`；不是 EXE 内嵌服务端。此前 `gamecowork-asset-generation.js` 的自研界面仍保留为历史维护输入，但不再是当前入口。

底层资产服务为 `src/core/binary/out/modules/generation/service.js`，两份 Core 入口注册同一个 `generator/*` 服务；`modules/generation/codely-api.js` 按原客户端 API 形状适配本应用历史、标签、偏好、上传与媒体。Rust 将请求集中到默认 Core owner。Provider 配置、任务、上传与实际媒体保存在 Core home 的 `generator/`，API Key 不回显。当前源码的 43 个官方生成契约由内部账号执行器接入同一缓存：图片 16 个（含 Seedream 分层辅助）、视频 7 个、3D 12 个、音频/文字 8 个；原菜单里的多模态提示词仍放在 2D 分类。隐藏/内部模型不获得普通 Pro 能力，官方积分、权限与报价继续来自真实服务回执。

`modules/account/broker.js` 是两份 Core 入口共用的账号 broker，承接原登录 RPC、设备授权轮询、授权码交换、刷新、组织/订阅/额度查询与退出，并提供私有图片与推理凭据能力。主账号及站点令牌保留在 Core 内，持久记录经 Rust 的 Windows DPAPI vault 密封后写入本应用目录；页面只能得到受限的展示字段。账号与生成请求的时限覆盖完整响应体读取，取消、退出和新会话通过会话代次隔离旧请求；退出标记阻止旧密封记录在重启后恢复。系统浏览器链接由 Core 请求宿主打开，打开失败和登录失败必须保留错误回执，不能转成成功状态。

官方账号有效时，broker 在服务端完成 Quick 的 SSO bootstrap 和 Canvas 的会话交换，提供受限的身份、付费状态和额度数据；页面不接收站点令牌。两代账号菜单共用`assets/gamecowork-account-display.js`，只展示实际username/email；邮箱未知时标为账号ID。Pro依据真实订阅active/seat字段，个人套餐读取不依赖组织列表非空。原`controlPlane/openUrl`保留，由已认证Core把站内路径映射到固定官方网页，usage为`https://codely.tuanjie.cn/dashboard/usage`，不复用禁用的旧API地址。当前43个契约已装配，45种模型/版本组合均有核验成功记录；本轮15项单次复测与旧30项缓存复核见[最新官方验收](../../RESTORE_STATUS.md#official-retest-3000-20261007)。早期失败、只读恢复和结算事实保留在[历史记录](../../RESTORE_STATUS.md#official-all-models-20261003)，不代表当前余额或稳定性。Canvas生成schema和云协作仍未接入。

`modules/generation/models/official-catalog.js`汇总图片、视频/3D与音频/文字三个规格模块，固定原模型ID、构建参数、报价字段、引用指针和输出类型。Core读取实际Pro状态/报价，验证当前工作区登记引用，冻结字节与组合64 MiB预算，再经broker上传并提交；Tripo按实际imageUrl选择原文生/图生报价。未知创建不重发。已知ID的`/task/:id/resume`只恢复同账号、同工作区任务的GET查询和缺失文件收集；`/task/:id/reconcile`仅从本人限定时间窗History取得证据，分页完整、ID无重复且原模型/参数唯一匹配才允许绑定，客户端不能指定remoteID。无匹配不证明未创建或未扣额。未知状态和普通预览不判完成；媒体下载不带Cookie、Bearer或CSRF，限制HTTPS、公网目标和重定向。

`modules/generation/official-task-output.js`提取有界媒体/文字，保留原图层、天空盒、动作等结构；核验内容/MIME、长度与SHA后投影为自有artifact，History通过索引恢复本机地址和原参数。媒体模块集中在`src/core/binary/out/modules/media/`，覆盖完整JPEG存储及EXR/HDR、音频容器/帧、MP4/WebM元数据和模型归档的有界检查；不执行归档内容，不宣称所有codec解码或模型渲染。官方对象存储错误标注raster MIME时，仅实际PNG/JPEG完整检查通过才纠正transport类型，显式输出类型仍须匹配。声音克隆沿用原`_N/k5/wN`的实际音频预览结果，真实返回voiceId时才保留；不得根据任务ID或预览URL制造音色身份。

原Quick的`lwe`媒体分类优先使用preview/image键，曾把已完成克隆的MP3预览误判为图片；已装配补丁只在该函数开头先判断已知音频扩展。原`_N/k5/wN`遍历/结果/完成规则和`xZ`播放器等其余函数保持原字节，补丁记录在Quick来源ledger和importer。4项源码契约及源码/补丁后候选的实际MP3/Opus播放各2项通过；极短FLAC额外尝试不构成所有codec可播放的证明，完整门禁以活动记录为准。

CPA 描述符由 `local-models.js` 扩展原注册表的独立 `thirdparty` 分组；Quick 展示第五个“第三方 · CPA”分栏，内部执行与历史分类仍是 image，不为外部服务制造官方权益。四个固定描述符对应真实列单ID `gpt-image-2`、`gpt-image-2.5`、`gpt-image-2.5-flare`、`gpt-image-2.5-sunburst`；`local-generation.js`逐项验证能力。`modelBindings`引用既有 Provider，新条目可复用旧 Image 2 绑定及同一密钥，客户端不能在生成payload中改选 Provider。模型列单只读成功不证明生成可用，CPA的2.5别名不擅自映射为Flare或Sunburst。

`modules/generation/models/cpa-image.js`与前端描述符默认使用size=auto、quality=auto、PNG和构图比例提示，单次一张；用户可显式选择`requestSizeMode='api-size'`提交经过严格校验的像素值，比例目标与像素请求分别记录。默认策略保留，显式API尺寸不声称上游一定兑现。Core通过内部`createCpaImageTask`和持久私有profile构造白名单请求；Provider认证复用，旧1024/low/png模板不能覆盖profile，ProviderDB不改写。公共通用`generator/createTask`不能伪造私有profile；重启/取消/未知创建不重发。旧历史不改写，再生成按持久参数重新验证尺寸与比例冲突，不兼容草稿须明确接受有效参数。实际MIME/像素/SHA、`providerReportedImage`真实返回字段和请求分开，不制造可确认型号身份。Quick能力不替代Canvas服务端schema。

本轮CPA4/XCAI3路由的7次单张实测及另1次CPA显式尺寸对照均完成，但XCAI的2K/4K与CPA指定1536×864未被上游兑现。结果保留上游原始字节，在卡片与详情分别报告请求和实际文件尺寸；不以缩放、裁切或留边替代。公开任务事实未提供可确认后台型号，不能由2.5请求ID确认换模。当前装配与文件验收见[本轮记录](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)，此前v8.0.8/fd48ea6的7次成功及1次EOF保留在[历史CPA记录](../../RESTORE_STATUS.md#cpa-flexible-20261003)，不泛化为全部账户的永久尺寸或质量上限。

`modules/account/official-model-menu.js` 从账号原 `/api/config/v3` 配置投影有界、安全的模型元数据，`modules/account/official-llm.js` 保留原顺序、倍率、禁用状态及推理/上下文选项；两份Core先构建内置模型，再追加自定义模型。两代 `assets/gamecowork-official-models.js` 只在打开原菜单时请求无Key的 `codelyOfficial/refreshMenu`，原组件继续承担图标、倍率和级联选择，不使用裸 `/v1/models` 目录替代内置配置。合法空目录与禁用目录不被本地Pro标签解锁，灰色Frontier占位不进入可执行集合。真正官方会话启动时才取得Core内存中的CLI推理Key；Agent只获得绑定工作区、会话、模型及账号/组织代次的可撤销本机能力。账号/组织或执行权限变化撤销相应能力，纯倍率/图标更新不打断有效流；原有CPA设置保持。官方固定上游、协议和最终帧检查继续生效，真实Key不进入Agent、前端、配置或日志。

原画布图和版本保存在本应用 data 的 `codely-canvas/`。原节点数据、边、视图和未知字段保留；本机 runtime session 与原客户端浏览器编辑租约分别校验。上传绑定实际已保存画布及有效租约，不把原 `workspace_hash` 当文件权限。媒体读取只接受已登记的 input 或 task / artifact 身份；Rust 校验文件路径、大小和 SHA 后直接返回二进制与 Range，不让大文件经过 Core 的 16 MiB stdio 帧。宿主端口变化时，私有 Core helper 校验旧 URL 的实际身份、作用域及文件 SHA，只改读响应中的完整 URL 值，不改原保存图、文本子串或外部链接。导出沿用 `workspace/mutations.rs` 的工作区写入边界。

参考导入使用同源 `POST /api/tauri/generator/inputs` 的原始文件字节，单件有界 64 MiB、并发读取有界，普通 JSON invoke 的大小限制保持不变。Rust 专属 UUID 暂存于 `generator/incoming/`，经内部注册消息交给 Core；Core 只能从该 ID 派生固定路径，重验内容 / MIME / SHA 后复制到 `generator/inputs/` 并提交 `inputs.json`。公开 RPC 不能调用注册与路径查询内部消息，原生请求结束仅清理自己创建的暂存文件。任务保存输入 ID 和元数据，提交前再次验证持久文件；JSON 与 multipart 由同一冻结输入生成，媒体字节不经过 Core stdio。工作区校验固定为实际 `data.workspaceKey`，避免外层消息与业务数据选择不同范围。

`EditorConsole.cs` 在 Editor 主线程读取原生 Console，返回 `scope:"current-native-console-view"`、`nativeConsoleFiltersApplied`、实际原生筛选状态，以及 `queryComplete` / `filterLimitation`。Get 不改变 Console flags、搜索、Collapse 或 EditorPrefs；`types:["all"]` 也只查询当前原生视图。清空仅在批准的 Agent 路径支持 `clear(all)`，校验原工程、domain、client / cancel nonce，在 effect 提交前检查取消；提交后不自动回滚。Rust 通用本地工具入口仅允许 Console get，详细边界见 [编辑器桥说明](../../src/editor-bridge/README.md)。

`EditorContextQueries.cs` 提供六项主线程读取：选择、工程根目录、实际窗口、标签、层和活动工具；不切换工具、焦点或选择。`EditorAssetQueries.cs` 使用真实 AssetDatabase 和已注册包挂载，分页与扫描 / 响应预算保留 `queryComplete`、`truncated`、`totalAssetsExact`。`AssetPreview` 的异步结果保留实际 `previewStatus`；仅就绪原生像素编码为有界 PNG，不以缩略图替代失败。`EditorPackageQueries.cs` 读取 `PackageInfo.GetAllRegisteredPackages()` 的当前已加载注册表，声明 `scope:"currently-loaded-registered-packages"`，不从 manifest 推断安装结果或发起联网 UPM 列单。

`EditorSceneMutations.cs` 在主线程执行批准后的空对象 create、有限 modify 和已加载场景 save。create / modify 使用 Unity Undo 并标记实际场景 dirty；save 仅写原有场景文件，校验启动时工程 / Assets 与已加载场景文件的 Windows 身份，拒绝链接、硬链接和替换代次。路径检查与 Unity 的保存调用之间仍有 TOCTOU 窗口，保存也不是可回滚事务。`EditorCancellation` 在 effect admission 前校验同工程、domain、client / cancel nonce 及原 TCP 所有权；nonce 位于 transport envelope，不由模型参数提供。Agent 按实际 action 判断读写权限，拒绝用 `command` / `operation` 遮蔽写动作；同一调度队列中的编辑器控制、Console clear 和场景写入串行，读取批次在下一项写入前结束。Rust 通用本地工具入口继续拒绝场景写动作。

## 自定义 Provider 的配置与执行边界

2026-10-07增量：每个模型的用途独立保存；通用REST的image/video/audio/model都可进入原Quick，服务JSON保存在独立`providerParameters`快照，整组`{{parameters}}`不会发送本地任务身份。显式参数必须由请求模板消费，图片策略仍与实际文件证据分开。无实现绑定的参考素材入口保持关闭，避免上传后被忽略。`modules/media/video.js`有界读取MP4/WebM元数据，展示尺寸、编码尺寸和旋转分别记录；不明确的元数据保持unknown。兼容DTO只透传真实preview/result角色，结果核验不把预览或另一个文件当全部达标证明。当前装配与逐次验收见[本轮状态](../../RESTORE_STATUS.md#ai-assets-20261007)。

`modules/providers/registry.js`、`modules/providers/catalog.js` 与 `modules/providers/vault.js` 管理新的独立 Provider 注册表、目录和凭据，原客户端通过 `codely-generator/provider-manager.js` 提供选择与管理。每条动态模型身份绑定 Provider ID 和确切上游模型 ID；目录中失去的模型保留历史身份并置为不可用，不用同名模型替代。切换地址、协议或认证后须重新读取目录，完整分页、重复 ID 和上限检查失败时不发布部分目录。连接检查只发起 GET 目录请求，不进行收费生成。

新凭据采用 Windows DPAPI CurrentUser 密封，先写不可变的凭据版本，再原子更新注册表引用；前端仅得知是否已配置，留空保留、显式清除才移除。注册表与模板不接受秘密，凭据不写入模型、任务、日志或旧聊天设置。旧 CPA 仍沿用自身已有 AES 存储，不将其宣称为新 DPAPI 凭据，也不自动迁移或复制明文密钥。本人的配置/任务恢复验收只读复制到独立snapshot后由正式包读取，原源SHA不变；实际原位重开只做本机GET配置就绪核对，不将恢复检查变为收费生成或原生像素验收。

协议配置覆盖 `openai-images`、`generic-rest-task`、`openai-chat`、`openai-responses`、`ollama` 与 `comfyui`。本阶段仅前两种接入现有资产任务执行、历史与下载；后四种可保存配置并读取目录，不能据此宣称聊天推理、本地模型或 ComfyUI 工作流已可执行。ComfyUI 保存 API 格式 graph 和显式 node/input 参数映射，目录区分节点类型与模型文件；不执行任意脚本、安装节点、启动服务或调用全局中断。

能力将支持状态与证据分开：状态为 unknown / supported / unsupported，证据为 unknown / documented / tested / manual。公开手动更新接口将声明强制标为 manual；读到模型 ID 或源代码通用控件不推定质量、分辨率或超分。新图片请求的未知质量档位被拒绝；独立超分仅记录能力，不由未知站点规格推导执行按钮。`resolutionHint` / `aspectRatioHint`保留提示词要求，由服务端生成`executionPrompt`，同时可按下文显式尺寸策略发送标准size；用户原prompt、API参数、服务报告与文件像素分开存储。Flare某次联合提示要求实际回图1536×1024，只记录该组合的文件事实，不推定其他尺寸、纯API参数单独生效或独立超分。本轮真实结果与最终包状态见 [当前状态](../../RESTORE_STATUS.md#xcai-custom-provider-20261004)。

Provider选择弹出层复用原FZ的主题表面与键盘行为，管理页原生select显式继承colorScheme和option颜色。图片格式错误细分仅位于非official image的outputs/data分支：缺字段、非数组、空集合及超数量各自拒绝，不扩大接收schema或记录原始回复；旧历史泛化错误保留，不凭后加分类反推当时上游形状。该增量已进入最新正式包；主题的Host/Chromium专项与前端SHA证明、原生窗口/HTTP就绪证明分开，不把它们合称原生Wry像素验收。

后续尺寸补全新增Provider请求方法`imageSizePolicy`：prompt-only只追加提示要求，openai-size同时推导parameters.size并送标准body size。规范XCAI地址默认后者，其他服务默认前者；显式选择/opt-out与冷恢复保留，冷读不写registry/vault/历史。它不自动改变逐模型size证据，不放开未知quality。公开27像素tuple的16取整比例兼容仅在该API策略中使用，冲突/越界/明确unsupported先拒绝；文件像素用于目标兑现提示，reported字段与旧历史API存在性不被追认。已另获独立授权并完成1张gpt-image-2实际3840×2160 PNG，正式包安装与只读恢复已验，最新桌面启动再确认launcher退出后程序仍运行；仍只是本次组合的产物事实，其他未验规格与完整门禁范围按RESTORE分别记录。

## 依赖与产物边界

- `tools/` 从 `src/` 与 `vendor/` 读取维护输入，在统一 temp 内准备资源，再装配到 `app/`。
- `src/` 不依赖 `tests/`、`research/` 或原软件目录提供生产行为；测试 guard 只进入隔离测试 Agent。
- 正式包使用自身 `app/frontend`、`app/core`、`app/cli`、`app/unity-insight`、`app/lsp-csharp` 与 `app/editor-bridge`；开发 fallback 不得代替包内资源。
- `research/`、`tools/research/` 与 `docs/history/` 保存历史分析，不进入默认构建和门禁。
- `codelyreversebackup/` 与 `original/` 保持原路径，只读对照。研究资料新增不等于运行功能完成。
- `codelyreversebackup_fromunityhub/` 保存 Unity Hub 原字节区域及纯函数适配，源码索引记录原路径、SHA 和依赖限制；装配不加载它。产品沿用已有 Core 扫描与本地模板创建，并在 Rust 内适配 Hub 的逐坏包隔离语义。
- `tests/fixtures/` 提供模拟服务、guard 与自有编辑器工程代码，`tests/support/` 提供测试辅助函数；它们都不是产品模块。

运行数据与临时产物的位置见 [README](../../README.md#架构与维护边界)。不能把日志、截图、测试工程、真实凭据或用户数据写入源码目录。

项目列表读取 `ProjectVersion.txt` 时限制为 1 MiB；缺失目录保留注册及收藏并返回 `pathExists` / `metadataWarning`，`lockFilePresent` 不表示已连接 Editor。项目与安装发现分别调用 Core 的 `unity/getHubProjects` 和 `unity/getHubEditors`，项目刷新不会隐式重扫 Editor。安装快照持久保存至应用数据目录的 `installed-editors.json`，15 分钟内复用有效快照，过期后台刷新；显式刷新等待真实扫描。失败保留旧快照及其时间，SSE 与 HTTP 按请求代次处理。项目最近改动来自有界文件元数据扫描，`lastModifiedUnixMs` 用于排序；扫描不完整保留提示。两代界面共用 `gamecowork-project-status.js` 与 `gamecowork-editor-licensing.js`；许可 DTO 将 `workspaceAllowed:true` 与未知的 `isValid` / `editorLicenseValid:null` 分开，激活、申请、导入、服务器配置和归还请求在本地宿主明确拒绝。

## 旧目录迁移表

2026-10-01 的目录整理保留了所有已跟踪输入。旧验收日志与历史文档正文中的路径表示当时布局；新命令使用下表右侧路径。

| 旧位置 | 当前位置 |
| --- | --- |
| `restored/shell/` | `src/shell/` |
| `restored/frontend/dist-beautified/` | `src/frontend/bundle/` |
| `restored/frontend/package.json`（推断清单） | `research/frontend/frontend-package.reference.json` |
| `restored/core-gamecowork-binary/` | `src/core/` |
| `restored/cli-gamecowork/` | `src/agent/` |
| `restored/cli-unity-insight/` | `src/unity-insight/` |
| `restored/editor-bridge/` | `src/editor-bridge/` |
| `restored/lsp-csharp/` | `vendor/csharp-lsp/` |
| `restored/src-tauri/`、`restored/hub/` | `research/tauri-shell/`、`research/hub/` |
| `restored/PACKAGING.md`、`UNITY_INTEGRATION.md`、`DUAL_ENGINE_MULTI_PROJECT.md` | `docs/development/packaging.md`、`docs/editor/integration.md`、`docs/editor/multi-project.md` |
| 根目录 `HANDOFF.md` | `docs/history/HANDOFF.md` |
| 平铺的 `tests/*` | 按 [测试导航](../../tests/README.md) 分类，文件名保留 |
| 历史探针与提取脚本 `tools/*` | `tools/research/`，见 [工具导航](../../tools/README.md) |

不保留第二份可编辑源码或旧路径软链接。发现旧外部脚本时按迁移表修正，不重新创建 `restored/`。开发期构建缓存仍在 `src/shell/target/` 并被 Git 忽略。

## 2026-10-06 功能目录与命名

| 输入类型 | 命名约定 |
| --- | --- |
| Rust | 领域目录与文件用 `snake_case`，文件名描述职责；已有 crate 模块名由入口映射保持兼容 |
| 自有 JavaScript | 领域目录用小写，复合文件名用 `kebab-case`；目录已说明身份时省去重复产品前缀 |
| Unity C# | 领域目录用 `PascalCase`，类名与已有资产身份保持；`.cs` 和 `.meta` 成对迁移 |
| 当前文档 | 按主题分类，用小写描述性名称；README 负责导航 |
| 历史计划与记录 | 日期加主题名称，保留原事实与来源哈希，路径映射单独记录 |
| 临时产物和备份 | 放在独立日期 / 任务目录，按日志、分析、测试、候选包或备份用途命名，附清单 |

Rust 按上表分领域；自有 Core 模块见 [Core 导航](../../src/core/README.md)。Unity 桥在 `Editor/Transport/`、`Capture/`、`Queries/`、`Operations/` 中组织，类名及已有 `.cs.meta` GUID 保持，程序集定义留在 `Editor/` 根目录。真实编译器递归收集所有类。

日常构建 / 验证入口留在 `tools/` 根，其余工具按 `resources/`、`frontend/`、`editor/`、`analysis/` 分类。文档按 `architecture/`、`development/`、`editor/`、`history/` 分类。历史计划进入 `codelyreversebackup/history/plans/`；原程序研究继续按原库主题分目录，历史脚本在 `tools/research/{extraction,probes,migration}/`。

[完整路径迁移表](path-migrations.json) 记录源码、工具和当前文档的旧新位置；[研究归档迁移表](../../codelyreversebackup/history/organization/2026-10-06-archive-migrations.json) 记录保持原字节的47项归档。没有旧路径软链接或第二份维护源码，历史验收正文按迁移表解释。

用户指定所有临时产物进入 `F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work`：按日期与任务存放临时计划、截图、日志、测试项目、候选包与备份，整个 `work/` 被 Git 忽略；Core/CLI用户数据及 `app/` 日常安装边界保持原规范，Rust `target/` 仍是被忽略的编译缓存。新文件采用说明用途的文件名；冻结原片段、带哈希bundle、Unity类名和GUID不作装饰性改名。
