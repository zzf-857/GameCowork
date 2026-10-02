# GameCowork 开发指南

## 环境与前置条件

当前开发目标是 Windows。版本来自已有本机环境，不是跨版本兼容承诺。

| 工具 / 资源 | 用途 |
| --- | --- |
| PowerShell 7 | 构建和验证脚本使用 .NET 路径 API |
| Node.js 24.x | Core、worker、契约和浏览器测试 |
| Rust / Cargo（本机 1.95.0） | 编译宿主，使用冻结的 Cargo.lock |
| Bun（本机 1.3.11） | 编译自有 Agent CLI |
| WebView2 Runtime | 原生桌面界面 |
| Playwright 与 Chromium 本机缓存 | 浏览器门禁；driver 支持显式路径参数 |
| .NET 10 SDK | 冻结 C# LSP 运行与验证 |
| Unity / 团结及已有许可 | 仅真实编辑器门禁需要 |

构建使用 `cargo --offline --locked`，需要预先准备工具链和依赖缓存。`build-local.ps1` 还读取本应用已有 `app/core/gamecowork-runtime.exe`；当前没有从零安装运行时的一键 bootstrap，不能用原版 Agent EXE 改名替代。

根 `package.json` 只聚合命令，没有 npm workspace 或前端依赖安装步骤。`tools/package.json` 属于历史格式化工具；不要在 `src/frontend/` 按推断版本安装依赖。索引和 LSP 冻结资源已跟踪，由资源契约检查完整性。

## 日常修改流程

1. 执行 `git status --short --branch`，阅读 [AGENTS.md](../AGENTS.md) 与目标目录规范。
2. 按 [架构说明](ARCHITECTURE.md) 找到所属模块，保留用户已有修改。
3. 同步维护两代前端共享行为、Core 的实际入口与可读版本；避免全量格式化 bundle。
4. 先运行相关契约，涉及 HTTP、界面、进程或编辑器行为时继续运行对应集成 / E2E。
5. 运行目录检查和统一验证，在 [RESTORE_STATUS.md](../RESTORE_STATUS.md) 记录证据。
6. 需要本机交付时使用装配脚本，再做包内验收；源码验证与包内验收分别记录。

## 验证选择

所有命令均在项目根目录、PowerShell 7 中执行。

| 场景 | 命令 | 边界 |
| --- | --- | --- |
| 目录、链接、脚本路径 | `npm run check:layout` | 静态检查，不代表功能可用 |
| 契约和后端 | `npm run verify:backend` | Rust fmt / test / build、Node 契约与隔离服务；跳过浏览器 |
| 默认本地门禁 | `npm run verify` | 原客户端来源/契约与其它 Chromium 门禁；完整资产界面另用 `-RealCore`，不启动真实编辑器 |
| 受控真实 Core | `tools/verify-local.ps1 -RealCore` | 创建同源码 guarded Agent，并验收两代宿主中的原 Quick/History/ReactFlow 客户端；只用 loopback Provider |
| 聊天与文件执行 | `tools/verify-local.ps1 -RealCore -Chat` | 自编译 Agent、loopback 模拟模型与实际界面 |
| 编辑器与预览 | `tools/verify-local.ps1 -RealCore -Chat -Editor` | 仅自有 temp 工程、已装编辑器和已有许可 |

`-Editor` 不授权登录、激活、安装编辑器或修改用户工程。指定团结版本可传 `-TuanjieEditor <真实 Editor.exe>`；该参数需要 `-Editor` 且不能关闭浏览器。真实账号、Provider 与商业额度不属于自动验证。

```powershell
# 定向验证示例
node --test .\tests\contracts\frontend-request-contract.mjs
node .\tests\contracts\lsp-resource-contract.mjs --self-test
cargo test --manifest-path .\src\shell\Cargo.toml --offline --locked
node .\tests\e2e\project-panel-e2e.mjs
node .\tests\e2e\editor-licensing-e2e.mjs
node .\tests\e2e\hub-project-status-e2e.mjs --previous
node .\tests\e2e\project-template-details-e2e.mjs --warning-fixture
node --test .\tests\contracts\frontend-startup-messenger-contract.mjs .\tests\contracts\core-command-bootstrap.test.cjs .\tests\contracts\editor-console-contract.mjs
node --test .\tests\contracts\cli-unity-operations.test.mjs .\tests\contracts\editor-context-contract.mjs .\tests\contracts\editor-context-implementation-contract.mjs .\tests\contracts\editor-asset-package-contract.mjs .\tests\contracts\editor-scene-mutation-contract.mjs
```

Unity Hub 参考代码使用 `node tools/research/extract-unity-hub-reference.mjs --check` 核对原 ASAR 与提取字节；测试不执行 Hub 服务。许可证和项目状态 driver 支持 `--binary` / `--frontend`，可对统一 temp 中的候选包验收，避免重编译或替换正在运行的开发及日常程序。模板详情的 `--warning-fixture` 仅给真实模板回执追加诊断呈现 fixture，坏档案隔离由 Rust 模块单测另证，不冒充实际安装目录有损坏包。

原生启动修改须同时验证共享 Redux client、已有 store / persistor 的复用和实际握手；Core 命令启动须验证真实 CLI 在 `session/new` 返回前发通知、登记后的缓存回放、pending 刷新及关闭 / 重开后的晚返隔离。`-RealCore` 包含 `core-command-bootstrap.mjs`，使用测试 preload 的可释放屏障控制真实 Core / 编译 Agent 的登记时序，记录元数据并禁止 completion；VM 契约不能代替这条跨进程验证。命令刷新等待已有初始化最多 60 秒，已注册会话的刷新最多 8 秒，失败不伪装成刷新成功。

`-Editor` 包含 `editor-console-smoke.mjs`，使用自有工程、已许可 Editor 和同源码 guarded Agent，核验原生 Console 数据、scope 保留、批准 / 拒绝 clear-all 与取消。Get 的 `scope:"current-native-console-view"` 受原生严重性、搜索、Collapse 和响应上限影响；`queryComplete:false` 时不得声称完整日志。Get 不修改 EditorPrefs；非空 `sinceTimestamp`、`errors_only` 清空和 `set_collapse` 明确不支持。已批准 clear-all 的 effect 提交后不会自动恢复旧日志。

上述两个 integration driver 必须传 `--package` 指向同源码 guarded Agent 目录。`core-command-bootstrap.mjs --packaged --app-root <候选包目录>` 和 `editor-console-smoke.mjs --app <候选包目录>` 可核对包内资源；前者覆盖实际宿主 / Core / Agent，后者使用候选桥与编译 Agent 验证实际 Editor Console，不代替原生 GUI 操作验收。运行次数与结果只记录在 [功能状态](../RESTORE_STATUS.md)。

`-Editor` 还登记以下四个源码 driver，均只操作自有 temp 工程和已有许可。参数按实际 driver 区分：

```powershell
node tests/integration/editor-context-smoke.mjs --package <同源码 guarded Agent 目录> --extra-queries
node tests/integration/editor-asset-package-smoke.mjs --graphics
node tests/integration/editor-scene-mutations-smoke.mjs
node tests/integration/editor-scene-mutations-agent-smoke.mjs --package <同源码 guarded Agent 目录>
```

上下文 driver 覆盖六项读取及实际 Agent 动作校验；`--extra-queries` 增加模型发出的资产 / 包元数据查询。资产 / 包 driver 不调用模型，`--graphics` 使用真实图形设备验证异步原生预览最终 PNG；默认无图形模式返回明确不可用状态。该 driver 可用 `--bridge <自有桥目录>`，其余上述 driver 读取维护源码；它们没有通用 `--app` 或 `--app-root` 包参数。包查询只证明当前已加载注册包，预览元数据成功不代表图像就绪；查询不得改变选择、场景 dirty、manifest、包锁文件或 EditorPrefs。

场景 driver 分别验证真实 TCP / Unity Undo 与模型发出的工具 ID、批准 / 拒绝、nonce 取消和同轮 modify → save 顺序。create 仅建空对象，modify 仅改本地位置 / 欧拉旋转 / 缩放和 activeSelf；二者可操作已加载的普通未保存场景，但不会写盘。写动作拒绝 Play / 编译 / updating 和预览场景；save 还要求已有原文件，拒绝 SaveAs、工程外路径、链接及替换代次。Unity Undo 不回滚磁盘 save，确认 effect 尚未提交的取消才证明零效果；已提交或未确认结果不得自动重发。Windows 文件身份复核缩小静态越界范围，不能消除检查与保存调用之间的 TOCTOU。资产写入及包安装 / 移除未在本阶段实现；源码门禁不证明新装配包或团结写入运行时。

分类见 [测试导航](../tests/README.md)。各 driver 的 `--binary`、`--packaged`、`--agent`、`--editor` 参数以该文件为准，不假设全部 driver 支持相同参数。

## 构建与运行

```powershell
.\tools\build-local.ps1
.\app\启动GameCowork.bat
```

默认构建 Release，先核对 LSP、运行必要测试，再编译 Rust / Agent、写资源清单、装配并逐项核对 SHA。目标 app 正在运行时会保留准备好的包并停止替换，由用户关闭窗口后重新执行。

宿主也接受 `GameCowork.exe --workspace <已有目录>` 或单个目录参数。重复启动先核对现有服务的 PID、数据目录身份与实例代次，再转交目录并恢复窗口，不另外初始化 Core；应用锁与 `instance.json` 位于应用数据目录。崩溃遗留的元数据不代表锁仍被占用。防休眠偏好位于同目录的 `keep-awake.json`，在测试 / headless 模式仅保存偏好，回执明确 `active:false, suppressed:true`。

桌面单实例定向验证用 `node tests/integration/single-instance.mjs`；追加 `--native` 验证实际 Wry 窗口最小化后的恢复与焦点。编辑器只读查询用 `node tests/integration/editor-scene-queries-smoke.mjs --package <同源码 guarded Agent 目录>`，只使用自有 temp 工程。防休眠仅要求系统保持运行，屏幕关闭及用户显式睡眠仍由 Windows 管理。

检查点回退拒绝链接工程、目标 / 备份路径的 junction、symlink 和硬链接文件，先校验完整计划，再逐项复核路径。当前 Node 路径式文件操作并非原子目录句柄操作，仍有并发替换目录的检查竞态；恢复也不是多文件事务，部分失败时应检查实际文件后再决定重试。

`-OutputDirectory` 可把候选包输出到统一 temp 中的指定目录；不作为第二个日常安装。`-SkipTests` 只跳过构建脚本的部分测试，不代表完成验收。资源来源与 guard 限制见 [装配说明](PACKAGING.md)。

## 原客户端资产界面与本地兼容层

主界面的“AI 资产生成”沿用原宿主的快速生成、画布和生成历史三个页签。快速生成 / 历史客户端维护输入在 `src/frontend/bundle/codely-generator/`，原 ReactFlow 画布客户端在 `src/frontend/bundle/codely-canvas/`。两代宿主均加载这些本地客户端，保留原模型描述、参数控件、手绘、历史页、节点渲染器和编辑器。原页面路由及资源 / 身份 / API 边界按来源台账改接，不以此前的自研通用表单或简化素材板代替。

这两个客户端来自原安装 GUI 指向的、2026-10-02 缓存的公开部署；它们不是原生 EXE 内嵌的全部实现，也不证明与历史截图版本完全相同。[Quick/History 来源台账](../src/frontend/bundle/codely-generator/source-ledger.json)、[Canvas 来源台账](../src/frontend/bundle/codely-canvas/source-ledger.json) 记录原始 SHA、当前 SHA 和明确补丁；[原 API 合同](../tests/fixtures/codely-generator-api-contract.json) 保留调用 / 响应形状及模型定义的原始字节定位。

| 当前入口 | 本地接线及边界 |
| --- | --- |
| 快速生成 | 原四种模式、模型 / 参数控件和手绘界面；手绘保存到参考图与参考文件上传走自有缓存 |
| 生成历史 | 原网格 / 列表、分类、日期、标签、丢弃 / 恢复、详情与偏好；数据来自真实自有任务和输入记录 |
| ReactFlow 画布 | 原个人画布入口、节点 / 连线 / 视口、Markdown 文本编辑、素材上传、视频当前帧转图片；本地服务保存完整图 JSON、版本与编辑租约 |
| 身份与媒体 | 明确的 GameCowork 本地会话；媒体仅从登记的自有缓存读取并核对长度 / SHA，不拿本地身份代替原平台账号 |

**原 45 个模型的服务尚未适配。** 新增 `cpa-gpt-image-2`（GPT Image 2 · CPA）是自有扩展，复用原模型注册表、控件、提交/轮询/历史流程，不把 Frontier 等原模型暗映射到其它服务。`local-session` 只在已有 Provider 启用、认证已配置、模型/图片类型与适配器精确符合时开放该条；未配置模型仍返回 `503 generation_provider_not_configured`。官方 SSO 与积分/订阅接口、Canvas 生成 schema 仍未接通，界面可见不等于远端能力已恢复。

CPA 绑定使用 `PUT /api/codely-generator/local/model-bindings/cpa-gpt-image-2`，body 为 `{ "providerId": "已保存的Provider ID" }`；传 null 解除绑定。Provider 由原生 `generator/saveProvider` 保存，模型为 `gpt-image-2`、kind 为 image、已配置鉴权、POST `/images/generations`、`responseMode:outputs`、`selectors.outputs:data`、`outputSelectors.base64:b64_json`。当前描述符固定 n=1、PNG、low、请求1024×1024；真实CPA返回1254×1254，产物尺寸从实际PNG读取。模板当前用固定size/quality/output_format；通用 `{{parameters.size}}` 在 `normalizeSpec` 的空参数预检中仍会被拒绝，此缺口列入交接计划。

LAN HTTP 仅在 Provider 显式设置 `allowInsecureLan:true` 且地址为规范 RFC1918 IPv4 时开放；无该标记、公网 HTTP、数值/十六进制别名或跨源 HTTP 输出不会获得授权。`requestTimeoutMs` 支持1000..600000，作用于创建与下载；默认保持原30秒。凭据通过现有资产服务加密保存，不进入任务/模板 JSON 或公开回执。自动门禁只用隔离 fixture，真实服务测试必须单独人工运行，私有配置不随包或 Git 分发。

上传按原客户端的 multipart 字段接到可信本机 staging，再由 Core 解析、验证并登记。当前支持 PNG / JPEG / WebP / MP4 / WebM / GLB，单文件最多 64 MiB；multipart 原始请求上限为 64 MiB 加 256 KiB，每次只接受对应字段的单个文件。GIF、音频、FBX/ZIP、SPLAT 等即使出现在原文件选择器中，目前也会明确拒绝，不返回虚构的成功 URL。手绘导出的真实 PNG 可沿同一路径保存为参考素材。

Quick 上传冻结所在工作区；Canvas 上传绑定实际已保存画布及当前浏览器编辑租约，不能用图里的 `workspaceHash` 授予工程访问权限。参考输入只进入本应用缓存，不改用户原文件。输入缓存有 2048 项 / 4 GiB 上限，目前没有缓存整理界面；被任务引用的输入不能删除，预览占用或写入失败时保留可重试的记录。

`/api/codely-generator` 兼容原 Quick/History 的请求与响应形状；`/codely-canvas/api` 兼容原画布资产、图、版本和租约形状。兼容层的历史读取在未指定私有工作区范围时可查询全部自有记录，显式空范围是全局记录，非空范围精确匹配宿主核定的范围。媒体二进制由宿主读取，不经 Core 的有界 stdio 帧。画布读取时只把能验证真实身份、文件名、作用域和 SHA 的自有媒体 URL 改为当前本机 origin；磁盘图和其它字段不变，外域、已删除或篡改的媒体不会被代理或伪装修复。

`gamecowork-assets.js` 的通用 REST 任务、持久化、鉴权、取消、输入与媒体检查仍是已有后端能力，也是 loopback 验证的数据准备入口。其契约和 `asset-generation-service-smoke.mjs` 继续保留。旧 `frontend-asset-generation-contract.mjs`、`asset-generation-e2e.mjs` 针对已不作为现行入口的自研面板，退出默认资产界面门禁；它们的结果不能充当原 Quick/History/ReactFlow 功能恢复证据。

定向验证命令：

```powershell
# 只校验维护输入、来源 SHA 及可逆补丁；不重新导入或执行原应用 JS
node tools/import-codely-generator.mjs --check
node --test tests/contracts/codely-generator-local-identity.test.mjs tests/contracts/codely-canvas-source-contract.mjs

# 原 API 兼容、multipart 上传和重启媒体 URL；仅自有文件和 loopback 数据
node --test tests/contracts/codely-generator-api.test.mjs tests/contracts/codely-generator-upload.test.mjs tests/contracts/codely-media-rebase.test.mjs

# 实际 Rust / Core、两代桌面 GUI 和内部原客户端
node tests/e2e/codely-assets-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-assets-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
```

统一验证执行来源、身份、Sidebar、CPA 描述符/后端与原接口契约，并保留已有后端门禁；`-RealCore` 或 `-Chat` 且未指定 `-SkipBrowser` 时，运行两代默认 `codely-assets-e2e.mjs` 和两代 `--cpa-only`。默认验证原参数/手绘/历史/媒体与画布、冷重启及默认右栏双文档租约；CPA分支验证原控件真实提交到 loopback 图片接口、解码、历史再生成草稿与重启，不证明原45模型已能生成。`--flexible-layout` 单独检查原可选分栏入口，不属于默认窗口，验收结果分别记录。

该 driver 支持 `--binary <候选宿主 EXE>`、`--output <统一 temp 内的目录>`，以及 `--packaged --app-root <候选包>`；没有 `--frontend` 参数。包模式使用包内宿主、前端和 Core，执行仍使用显式传入的 guarded Agent，不能据此代替正式 Agent 与整个装配包的完整性检查。`--inspect` 只作检查界面 / 截图用途，会跳过完整交互流程，不能用作完整验收。源码门禁和候选包验证均不表示现有 `app/` 已更新；正式装配与结果统一记录在 [RESTORE_STATUS.md](../RESTORE_STATUS.md)。

## 本地状态与证据

验证通过专用 `GAMECOWORK_DATA_DIR` 隔离 Core、CLI、索引和工作区，不重写 HOME / USERPROFILE。测试工程、截图、日志、guard 包和构建暂存统一位于 `F:\AI\AgentMake\temp\GameCowork`。

只清理自己创建且已核对 PID 和目录的测试进程。仓库内不得放一次性日志或敏感导出。旧验收日志中的路径按 [迁移表](ARCHITECTURE.md#旧目录迁移表) 对应到当前源码，历史测试数字不代表本次验证。
