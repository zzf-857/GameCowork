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

临时产物统一放入项目的 `codelyreversebackup/work/`，按日期 / 任务分目录；这里包含测试工程、备份和候选包并被 Git 忽略。Rust `target/` 保留为正常编译缓存。

根 `package.json` 只聚合命令，没有 npm workspace 或前端依赖安装步骤。`tools/package.json` 属于历史格式化工具；不要在 `src/frontend/` 按推断版本安装依赖。索引和 LSP 冻结资源已跟踪，由资源契约检查完整性。

## 日常修改流程

1. 执行 `git status --short --branch`，阅读 [AGENTS.md](../../AGENTS.md) 与目标目录规范。
2. 按 [架构说明](../architecture/overview.md) 找到所属模块，保留用户已有修改。
3. 同步维护两代前端共享行为、Core 的实际入口与可读版本；避免全量格式化 bundle。
4. 先运行相关契约，涉及 HTTP、界面、进程或编辑器行为时继续运行对应集成 / E2E。
5. 运行目录检查和统一验证，在 [RESTORE_STATUS.md](../../RESTORE_STATUS.md) 记录证据。
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

上述两个 integration driver 必须传 `--package` 指向同源码 guarded Agent 目录。`core-command-bootstrap.mjs --packaged --app-root <候选包目录>` 和 `editor-console-smoke.mjs --app <候选包目录>` 可核对包内资源；前者覆盖实际宿主 / Core / Agent，后者使用候选桥与编译 Agent 验证实际 Editor Console，不代替原生 GUI 操作验收。运行次数与结果只记录在 [功能状态](../../RESTORE_STATUS.md)。

`-Editor` 还登记以下四个源码 driver，均只操作自有 temp 工程和已有许可。参数按实际 driver 区分：

```powershell
node tests/integration/editor-context-smoke.mjs --package <同源码 guarded Agent 目录> --extra-queries
node tests/integration/editor-asset-package-smoke.mjs --graphics
node tests/integration/editor-scene-mutations-smoke.mjs
node tests/integration/editor-scene-mutations-agent-smoke.mjs --package <同源码 guarded Agent 目录>
```

上下文 driver 覆盖六项读取及实际 Agent 动作校验；`--extra-queries` 增加模型发出的资产 / 包元数据查询。资产 / 包 driver 不调用模型，`--graphics` 使用真实图形设备验证异步原生预览最终 PNG；默认无图形模式返回明确不可用状态。该 driver 可用 `--bridge <自有桥目录>`，其余上述 driver 读取维护源码；它们没有通用 `--app` 或 `--app-root` 包参数。包查询只证明当前已加载注册包，预览元数据成功不代表图像就绪；查询不得改变选择、场景 dirty、manifest、包锁文件或 EditorPrefs。

场景 driver 分别验证真实 TCP / Unity Undo 与模型发出的工具 ID、批准 / 拒绝、nonce 取消和同轮 modify → save 顺序。create 仅建空对象，modify 仅改本地位置 / 欧拉旋转 / 缩放和 activeSelf；二者可操作已加载的普通未保存场景，但不会写盘。写动作拒绝 Play / 编译 / updating 和预览场景；save 还要求已有原文件，拒绝 SaveAs、工程外路径、链接及替换代次。Unity Undo 不回滚磁盘 save，确认 effect 尚未提交的取消才证明零效果；已提交或未确认结果不得自动重发。Windows 文件身份复核缩小静态越界范围，不能消除检查与保存调用之间的 TOCTOU。资产写入及包安装 / 移除未在本阶段实现；源码门禁不证明新装配包或团结写入运行时。

分类见 [测试导航](../../tests/README.md)。各 driver 的 `--binary`、`--packaged`、`--agent`、`--editor` 参数以该文件为准，不假设全部 driver 支持相同参数。

## 构建与运行

```powershell
.\tools\build-local.ps1
.\app\启动GameCowork.bat
```

默认构建 Release，先核对 LSP、运行必要测试，再编译 Rust / Agent、写资源清单、装配并逐项核对 SHA。目标 app 正在运行时会保留准备好的包并停止替换，由用户关闭窗口后重新执行。

宿主也接受 `GameCowork.exe --workspace <已有目录>` 或单个目录参数。重复启动先核对现有服务的 PID、数据目录身份与实例代次，再转交目录并恢复窗口，不另外初始化 Core；应用锁与 `instance.json` 位于应用数据目录。崩溃遗留的元数据不代表锁仍被占用。防休眠偏好位于同目录的 `keep-awake.json`，在测试 / headless 模式仅保存偏好，回执明确 `active:false, suppressed:true`。

桌面单实例定向验证用 `node tests/integration/single-instance.mjs`；追加 `--native` 验证实际 Wry 窗口最小化后的恢复与焦点。编辑器只读查询用 `node tests/integration/editor-scene-queries-smoke.mjs --package <同源码 guarded Agent 目录>`，只使用自有 temp 工程。防休眠仅要求系统保持运行，屏幕关闭及用户显式睡眠仍由 Windows 管理。

检查点回退拒绝链接工程、目标 / 备份路径的 junction、symlink 和硬链接文件，先校验完整计划，再逐项复核路径。当前 Node 路径式文件操作并非原子目录句柄操作，仍有并发替换目录的检查竞态；恢复也不是多文件事务，部分失败时应检查实际文件后再决定重试。

`-OutputDirectory` 可把候选包输出到统一 temp 中的指定目录；不作为第二个日常安装。`-SkipTests` 只跳过构建脚本的部分测试，不代表完成验收。资源来源与 guard 限制见 [装配说明](packaging.md)。

## 原客户端资产界面与本地兼容层

主界面的“AI 资产生成”沿用原宿主的快速生成、画布和生成历史三个页签。快速生成 / 历史客户端维护输入在 `src/frontend/bundle/codely-generator/`，原 ReactFlow 画布客户端在 `src/frontend/bundle/codely-canvas/`。两代宿主均加载这些本地客户端，保留原模型描述、参数控件、手绘、历史页、节点渲染器和编辑器。原页面路由及资源 / 身份 / API 边界按来源台账改接，不以此前的自研通用表单或简化素材板代替。

这两个客户端来自原安装 GUI 指向的、2026-10-02 缓存的公开部署；它们不是原生 EXE 内嵌的全部实现，也不证明与历史截图版本完全相同。[Quick/History 来源台账](../../src/frontend/bundle/codely-generator/source-ledger.json)、[Canvas 来源台账](../../src/frontend/bundle/codely-canvas/source-ledger.json) 记录原始 SHA、当前 SHA 和明确补丁；[原 API 合同](../../tests/fixtures/codely-generator-api-contract.json) 保留调用 / 响应形状及模型定义的原始字节定位。

| 当前入口 | 本地接线及边界 |
| --- | --- |
| 快速生成 | 原四种官方模式、模型 / 参数控件和手绘界面，外加独立“第三方 · CPA”分栏；官方43个契约读取Pro状态和实际报价，CPA仍以image内部模式执行；所有引用先进入自有缓存 |
| 生成历史 | 原网格 / 列表、分类、日期、标签、丢弃 / 恢复、详情与偏好；数据来自真实自有任务和输入记录 |
| ReactFlow 画布 | 原个人画布入口、节点 / 连线 / 视口、Markdown 文本编辑、素材上传、视频当前帧转图片；本地服务保存完整图 JSON、版本与编辑租约 |
| 身份与媒体 | 未登录时使用明确的 GameCowork 本地身份；授权成功后由 broker 提供官方身份与额度展示，令牌不进入页面。媒体仅从登记的自有缓存读取并核对长度 / SHA |

当前源码接入 43 个官方生成契约：16 个图片契约（含 Seedream 分层辅助）、7 个视频、12 个 3D、8 个音频/文字。原 Quick 的模型描述、构建函数与参数控件保留，后端固定契约位于 `modules/generation/models/` 的 `official-image.js`、`official-video-3d.js`、`official-audio-text.js`，由 `official-catalog.js` 汇总。维护时同步核对 `MODELS`、`validatePayload`、`quoteFor`、`referenceSlots` 和 `minimalPayload`，不得把通用 JSON 或自由 Provider 参数当作官方 builder。Tripo 文生/图生报价按实际 `imageUrl` 分支和原版本/纹理参数生成；报价数值由站点读取，不写固定价格。原隐藏/内部模型继续拒绝普通 Pro 能力。

引用限当前工作区已登记的图片、视频、音频或模型，数量和类型按模型契约，组合不超过64 MiB；历史引用同样核验作用域与SHA。全部引用先验证再导入，失败只回收本请求新建且未被任务引用的输入。同一数组字段的重复素材拒绝，原独立首尾帧字段可复用同一素材。冻结字节后提交实际任务，保留原图层、天空盒、模型和文字结构，文件核验后进入缓存、历史、再生成和下载。声音克隆按原`_N/k5/wN`把实际音频预览作为结果，不要求服务没有返回的voiceId；只有真实返回音色身份时才保留。

声音预览分类维护只改原`lwe`：已知音频文件扩展优先于原preview/image键名，修复MP3被归入image；未知地址、query伪扩展和非音频仍沿原分类。原`_N/k5/wN`等任务规则及`xZ`音频播放器保持字节一致。`codely-quick-audio-preview.test.mjs`验证这4项来源/行为契约，源码专项另检查原播放器实际MP3/Opus加载和play/timeupdate/ended；两种样本不代表所有codec或真实长音频，额外极短FLAC不计为全面播放验收。最终装配和门禁见活动状态。

CPA扩展在原Quick第五个“第三方 · CPA”分栏选择，复用原控件、提交/轮询/历史和再生成，内部仍为image模式。固定四个请求ID为`gpt-image-2`、`gpt-image-2.5`、`gpt-image-2.5-flare`和`gpt-image-2.5-sunburst`；`local-session`分别判断官方逐模型能力和CPA绑定，客户端不能在payload中改选服务。CPA当前参数与文件验收见[本轮第三方记录](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)。43个官方契约已装配，45种模型/版本组合均有核验成功记录；本轮15项单次复测、旧30项缓存复核和包来源见[最新官方验收](../../RESTORE_STATUS.md#official-retest-3000-20261007)。早期失败与配额观察保留在[历史官方状态](../../RESTORE_STATUS.md#official-all-models-20261003)，自动门禁仅用隔离fixture。

账号维护入口是`src/core/binary/out/modules/account/broker.js`，两份Core同步接线；Rust的`account/codely.rs`提供Windows DPAPI vault和系统浏览器链接。密封记录留在本应用数据目录，只有Core请求加解密；时限覆盖完整响应体，会话代次隔离取消/退出/刷新后的晚返请求。两代菜单共用`assets/gamecowork-account-display.js`，真实邮箱未知则明确显示账号ID；Pro按实际订阅active/seat字段，个人套餐不等待非空组织列表。原`controlPlane/openUrl`固定官方站内网页，usage为`https://codely.tuanjie.cn/dashboard/usage`，不改SDK端点或复制Pro标记。

私有官方执行器复用broker，内部任务冻结账号与输入SHA，公开`generator/createTask`不能伪造官方任务。生成POST未知不重发；同工作区`POST /task/:id/resume`只恢复已知远端ID的查询和缺失文件收集，校验账号/任务ID并保留已核验artifact。`POST /task/:id/reconcile`只读本人限定时间窗History；分页完整、ID无重复且原模型/参数唯一匹配才绑定，客户端不能指定remoteID，无匹配不能证明未扣额或授权重发。HTTP400诊断有界脱敏。对象存储错误MIME仅在实际PNG/JPEG完整检查后纠正transport类型，显式输出类型仍严格匹配。测试覆盖scope/账号/ID变化、部分缓存、零重复生成、分页及诊断秘密边界；自动测试不访问真实账号或商业额度。

账号定向验证使用以下命令。默认 E2E 验证真实 Rust/Core 与 loopback 官方协议 fixture；`--browser` 增加两代原登录弹窗、链接请求、身份和退出刷新交互，`--images` 必须与 `--browser` 同用，增加原 Quick 官方图片的控件、报价、生成、历史与下载流程；`--previous` 选择上一代。`--packaged` 默认选择当前 `app/`，候选包需显式传入 `--binary`、`--core`、`--frontend`、`--runtime`，该 driver 没有 `--app-root` 参数。输出使用 `--output` 指向统一 temp 下的独立目录。各次是否通过及装配资源来源只记录在 [当前状态](../../RESTORE_STATUS.md)，命令存在不表示已经完成验收。

```powershell
node --test tests/contracts/codely-account-broker.test.mjs tests/contracts/codely-account-wiring.test.mjs tests/contracts/codely-account-official-surface.test.mjs tests/contracts/codely-account-frontend.test.mjs tests/contracts/codely-account-timeout.test.mjs
node --test tests/contracts/codely-account-display.test.cjs tests/contracts/codely-account-display-frontend.test.mjs
node --test tests/contracts/codely-official-generator-broker.test.mjs tests/contracts/codely-official-assets.test.mjs tests/contracts/codely-official-generator-api.test.mjs tests/contracts/codely-official-generator-validation.test.mjs
node tests/e2e/codely-account-login-e2e.mjs
node tests/e2e/codely-account-login-e2e.mjs --browser
node tests/e2e/codely-account-login-e2e.mjs --browser --previous
node tests/e2e/codely-account-login-e2e.mjs --browser --images
node tests/e2e/codely-account-login-e2e.mjs --browser --images --previous
node tests/e2e/codely-account-login-e2e.mjs --packaged --browser
node tests/e2e/codely-account-login-e2e.mjs --packaged --browser --previous
```

全部模型验证覆盖三组原参数契约、逐模型能力、结构结果与媒体检查。`codely-all-models-e2e.mjs`逐一完成43个契约的报价、上传、单次提交、ID查询及文件/文字SHA；4类原GUI检查控件、预览/播放、保存和历史草稿，恢复case检查同一远端ID、scope/账号边界、分页不完整/重复及零重复创建。`--previous`选择上一代，候选包支持`--packaged --app-root`，也可分别指定`--binary`/`--core`/`--frontend`/`--runtime`。显式传入同源码guarded Agent，网络guard拒绝外站；各次结果与实际装配状态分开记录。

```powershell
node --test tests/contracts/codely-official-image-models.test.mjs tests/contracts/codely-official-video-3d-models.test.mjs tests/contracts/codely-official-audio-text-models.test.cjs tests/contracts/codely-all-model-readiness.test.mjs tests/contracts/codely-official-task-output.test.cjs
node --test tests/contracts/codely-audio-media.test.cjs tests/contracts/model-media.test.cjs tests/contracts/codely-extra-image-media.test.cjs tests/contracts/codely-hdr-media.test.cjs tests/contracts/codely-assets-persistence.test.cjs
node --test tests/contracts/codely-jpeg-media.test.cjs tests/contracts/codely-official-known-task-resume.test.cjs tests/contracts/codely-official-task-reconciliation.test.cjs tests/contracts/codely-generator-diagnostics.test.mjs
node --test tests/contracts/codely-quick-audio-preview.test.mjs
node tests/e2e/codely-all-models-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-all-models-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
```

真实服务验证单独按用户当次授权的服务、次数和预算执行数量1和原最低参数，先读报价再提交一次；未知结果保留远端身份，只继续查询，不自动重发。逐条核对最终状态、缓存SHA及原界面真实加载/播放，报价不是结算证明。声音克隆只用合法自有或经同意声源。历史配额与阶段预算不代表当前余额或授权，不安排自动收费续测；官方复测及第三方实测分别见[官方验收](../../RESTORE_STATUS.md#official-retest-3000-20261007)和[第三方验收](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)。CPA、内部管理员、Canvas schema和隐藏模型不因Pro登录自动可用。

Image 2.5的可见选择使用默认/快速/精致三个按钮，分别映射通用、Flare、Sunburst请求ID；下拉只展示Image 2和Image 2.5两家族。内部四描述符不合并，原历史精确路由仍恢复对应按钮；同家族切换保留提示词、比例及不兼容旧参数，不等于接受账号默认，也不提交任务。名称不证明实际后台型号或速度/质量差异。

CPA绑定使用 `PUT /api/codely-generator/local/model-bindings/<CPA描述符ID>`，body为 `{ "providerId": "已保存的Provider ID" }`，传null解除该条目绑定；未单独绑定的新条目可复用旧`cpa-gpt-image-2`绑定。四个描述符ID为`cpa-gpt-image-2`、`cpa-gpt-image-2-5`、`cpa-gpt-image-2-5-flare`和`cpa-gpt-image-2-5-sunburst`。Provider经原生`generator/saveProvider`保存，需要对应CPA型号、image kind、已配置bearer/header认证、JSON POST `/images/generations`、`responseMode:outputs`、`selectors.outputs:data`及`outputSelectors.base64:b64_json`。凭据不随描述符复制；本轮不重写已有Provider数据库。

公共CPA条目默认单张文生图、size=auto、quality=auto、PNG及构图比例提示，用户可显式选择API尺寸模式提交经过严格校验的像素值。默认参数与原历史保留，高级quality档及JPEG/WebP不作为已验证输出能力。构图提示与API尺寸请求不能承诺上游文件必然匹配；实际MIME/尺寸/SHA和服务报告分别保存显示，不以缩放、裁切或留边代替原图。当前尺寸对照与此前样本分别见[本轮实测](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)和[历史CPA记录](../../RESTORE_STATUS.md#cpa-flexible-20261003)。

`modules/generation/models/cpa-image.js`与前端描述符成套维护。公共兼容入口固定确切请求model、quality=auto、PNG及n=1，size默认auto，只有显式`requestSizeMode='api-size'`才提交严格像素；再经内部`createCpaImageTask`与持久profile执行。旧Provider常量不覆盖profile，ProviderDB不重写。公共通用`generator/createTask`不能选择或伪造profile；重启/取消/未知创建不重发沿现有生命周期。旧请求/返回事实不改，再生成重新核对模式、尺寸与比例冲突，不兼容草稿须明确接受有效参数，仍须用户提交。通用parameters模板预检不能放开任意CPA参数覆盖。

只读CPA GET `/models`实际返回四个ID。随后用户限8次单张低并发实测已串行提交完毕：7个产物完成、1次HTTP500 EOF失败不重试；四ID均有真实图片，全部成功样本为1254×1254 PNG、报告low，而requested横/竖/custom/high/medium/xhigh/max/JPEG/WebP均未兑现。公开任务事实未提供可确认model报告，不宣称2.5换模确认或永久上限。预算8已用完，不再GEN；原始请求、报文字段、实际文件与失败分别记录，完整表和最终包验见活动状态。

用户代理响应版本已只读确认v8.0.8/fd48ea6，build 2026-10-01T03:34:04Z；按对应commit图片executor核实参数转交，未使用管理认证或原软件凭据。模型元数据不含size/quality范围，源码转交不证明账户后端兑现。公开 [同原生路径作者实测](https://github.com/foksa/codex-img/blob/55710a2299a8e560bad780bc54b4304b19a90ca2/README.md#the-backend)与本机参数不兑现的样本部分一致；其medium上限等观察仍须与本机结果区分。只读研究、隔离测试、用户限额内CPA实测分别记账；官方新GEN和编程inference继续禁止，不能把CPA授权扩为无限生成或绕过官方额度。

LAN HTTP 仅在 Provider 显式设置 `allowInsecureLan:true` 且地址为规范 RFC1918 IPv4 时开放；无该标记、公网 HTTP、数值/十六进制别名或跨源 HTTP 输出不会获得授权。`requestTimeoutMs` 支持1000..600000，作用于创建与下载；默认保持原30秒。凭据通过现有资产服务加密保存，不进入任务/模板 JSON 或公开回执。自动门禁只用隔离 fixture，真实服务测试必须单独人工运行，私有配置不随包或 Git 分发。

上传按原客户端的 image/video/audio/model/model-conversion multipart 字段接到可信本机 staging，再由 Core 解析、验证并登记。本轮源码支持已有 PNG / JPEG / WebP / MP4 / WebM / GLB，以及 WAV / MP3 / AAC / FLAC / Ogg Opus / AAC-LC M4A、FBX / OBJ / STL / ZIP / USDZ；单文件最多 64 MiB，multipart 原始请求上限为 64 MiB 加 256 KiB，每次只接受对应字段的单个文件。ZIP/USDZ 仅验证有界结构、内容与资源，不解压执行；声音容器和帧检查不替代 codec 解码。天空盒输出另有 EXR/HDR 有界检查，不因此允许任意 EXR/HDR 作为普通生图参考。GIF、SPLAT、HE-AAC/ALAC/fragmented M4A 和其它超出检查范围的变体仍明确拒绝，不返回虚构的成功 URL。原转换器的更大文件说明不能覆盖本机 64 MiB 边界。

Quick 上传冻结所在工作区；Canvas 上传绑定实际已保存画布及当前浏览器编辑租约，不能用图里的 `workspaceHash` 授予工程访问权限。参考输入只进入本应用缓存，不改用户原文件。输入缓存有 2048 项 / 4 GiB 上限，目前没有缓存整理界面；被任务引用的输入不能删除，预览占用或写入失败时保留可重试的记录。

`/api/codely-generator` 兼容原 Quick/History 的请求与响应形状；`/codely-canvas/api` 兼容原画布资产、图、版本和租约形状。兼容层的历史读取在未指定私有工作区范围时可查询全部自有记录，显式空范围是全局记录，非空范围精确匹配宿主核定的范围。媒体二进制由宿主读取，不经 Core 的有界 stdio 帧。画布读取时只把能验证真实身份、文件名、作用域和 SHA 的自有媒体 URL 改为当前本机 origin；磁盘图和其它字段不变，外域、已删除或篡改的媒体不会被代理或伪装修复。

原 Quick/History 的 `codely:download` 和两处 Canvas 的 `openurl` 继续携带 `{url,filename}`，本地接到 `POST /api/tauri/download-url`。服务只接受当前 origin 下已登记的 artifact/input 地址：历史产物保留全部自有历史范围，输入必须匹配其登记的 `workspaceKey`。原生保存对话框选择目的文件，请求 JSON 不能指定路径；保存前后核验来源身份及 SHA，实际写入使用 create-new，不覆盖重名文件。文件建议扩展名按真实 MIME 确定。取消返回 `cancelled:true`，写入并同步成功才返回 `ok:true` 与 SHA；失败有可见提示且不转浏览器下载。临时 blob/data、外站下载及尚未登记的编辑器即时导出仍明确不支持。

原生对话框由独立任务持有，页面刷新或请求断开后仍须在原对话框保存或取消，完成前再次下载返回 busy；没有回执时界面提示先检查目标文件。磁盘写入失败可能保留未完成的新文件，不报告成功，也不自动删除可能被并发替换的目标。Windows 写入期间持有父目录句柄并拒绝链接/重解析点。自动门禁替换的是文件选择步骤，真实 Windows 对话框及本次源码/包的验证范围单独记入状态文档。

`modules/generation/service.js` 的通用 REST 任务、持久化、鉴权、取消、输入与媒体检查仍是已有后端能力，也是 loopback 验证的数据准备入口。其契约和 `asset-generation-service-smoke.mjs` 继续保留。旧 `frontend-asset-generation-contract.mjs`、`asset-generation-e2e.mjs` 针对已不作为现行入口的自研面板，退出默认资产界面门禁；它们的结果不能充当原 Quick/History/ReactFlow 功能恢复证据。

定向验证命令：

```powershell
# 只校验维护输入、来源 SHA 及可逆补丁；不重新导入或执行原应用 JS
node tools/frontend/import-generator.mjs --check
node --test tests/contracts/codely-generator-local-identity.test.mjs tests/contracts/codely-canvas-source-contract.mjs

# 原 API 兼容、multipart 上传和重启媒体 URL；仅自有文件和 loopback 数据
node --test tests/contracts/codely-generator-api.test.mjs tests/contracts/codely-generator-upload.test.mjs tests/contracts/codely-media-rebase.test.mjs

# 实际 Rust / Core、两代桌面 GUI 和内部原客户端
node tests/e2e/codely-assets-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-assets-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-assets-e2e.mjs --download-only --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-assets-e2e.mjs --previous --download-only --agent <同源码 guarded Agent EXE>
```

统一验证执行来源、身份、Sidebar、官方账号/生成/编程、CPA描述符/后端与原接口契约，并保留已有后端门禁；`-RealCore`或`-Chat`且未指定`-SkipBrowser`时，运行两代默认`codely-assets-e2e.mjs`、两代`--cpa-only`、两代`codely-cpa-flexible-e2e.mjs`和两代`codely-all-models-e2e.mjs`，并按统一脚本登记范围执行官方图片和编程E2E。CPA专项验证独立分栏、四型号、尺寸/质量/格式透传、参数拒绝、Provider数据不变、历史再生成及重启，仅提交到WAN阻断的loopback fixture。默认资产driver验证原参数/手绘/历史/媒体与画布、冷重启及默认右栏双文档租约；fixture成功不能替代真实服务验收。`--flexible-layout`单独检查原可选分栏入口，不属于默认窗口，验收结果分别记录。

该 driver 支持 `--binary <候选宿主 EXE>`、`--output <统一 temp 内的目录>`，以及 `--packaged --app-root <候选包>`；没有 `--frontend` 参数。包模式使用包内宿主、前端和 Core，执行仍使用显式传入的 guarded Agent，不能据此代替正式 Agent 与整个装配包的完整性检查。`--inspect` 只作检查界面 / 截图用途，会跳过完整交互流程，不能用作完整验收。源码门禁和候选包验证均不表示现有 `app/` 已更新；正式装配与结果统一记录在 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)。

## 自定义 Provider 维护

图片尺寸处理遵从用户选择：保留上游返回原图，在卡片和详情报告请求尺寸、文件实际尺寸及不一致状态；不能用本地缩放、裁切或留边抹掉偏差，也不能以服务回填的size代替文件核验。CPA显式接口尺寸与原图保留通过`codely-cpa-flexible-e2e.mjs --api-size-only [--previous]`验证。

官方天空盒EXR读取仅对完全缺失的pixelAspectRatio、screenWindowCenter、screenWindowWidth使用OpenEXR库兼容默认值，并返回defaultedAttributes；已存在的畸形字段及关键像素存储结构继续拒绝。修改该行为运行`codely-extra-image-media.test.cjs`和相关HDR/官方图像/已知ID恢复契约。恢复下载必须复用原远端ID，不能为解析错误再次调用生成；实际修复记录见`RESTORE_STATUS.md`。

通用REST的非图片Quick入口使用模型用途与显式服务参数JSON，不复用官方视频/3D的无关控件或订阅门禁。修改参数接线须验证模板实际消费、数值/布尔/数组类型、原prompt/模型身份、最终文件及历史恢复；不能只验证POST外层成功。`custom-provider-e2e.mjs --rest-only [--previous] --agent <同源码guarded Agent>`覆盖视频Quick/History/冷恢复。视频元数据与主产物角色契约为`codely-video-media.test.cjs`和`codely-artifact-roles.test.mjs`，官方全参数组合为`codely-official-parameter-matrix.test.mjs`，均登记统一门禁。

聊天取消及最终回执修改须同步两份Core，运行`core-chat-harness.test.cjs`、`core-chat-smoke.mjs --harness --package <同源码guarded包>`及双代`chat-e2e.mjs --harness [--previous] --agent <guarded EXE>`。专项保留真实Agent与SSE，只在隔离preload控制最终回执和时序，不代替正常聊天/工具门禁。

传输失败保存 `transportDiagnostic` 的有限字段：操作、阶段、错误代码、耗时、配置时限及收到的 HTTP 状态。仅识别有限的 Node 网络错误代码，不复制底层 cause 的消息/stack、URL、请求头或正文；未知代码归为通用传输错误。配置时限使用现有 AbortController，不从 `fetch failed` 推测其已经到期。旧任务没有底层原因时保持未知，不补写推断的故障代码。

`modules/generation/error-details.js` 为兼容接口生成固定白名单 `errorDetails`，原 `error` 字段也只返回安全短摘要。401/402/404/502/503等实际收到的状态直接显示在卡片；Quick与History通过原Dialog展示阶段、代码、HTTP、精确毫秒、模型、任务尺寸参数、本地任务ID及创建/更新时间，并使用同一DTO复制。尺寸字段只代表保存的`parameters.size`，不能由通用REST模板推定已经传给上游；任务更新时间不冒充请求耗时。旧HTTP字符串可恢复明确状态与少数安全message叶字段，缺失诊断仍为null；连接阶段确实未收到状态时说明“未收到HTTP状态码”，旧缺记录显示“未记录”。原始异常、URL、凭据赋值、签名地址、堆栈和不完整正文不会进入详情或复制文本；无法安全展示时注明隐藏/未保存。固定短句“Invalid API key”等不含值的认证诊断可展示，带实际密钥值的变体仍拒绝。

创建请求已发出且没有远端任务 ID 时，`submissionUnknown` 由实际内部状态派生；兼容层保留原轮询终态并附 `local_submission_unknown` 与显式标记。Quick/History 显示“结果未知”，该卡片不能直接重发；原 History“再次生成”仍仅恢复草稿。历史页本机身份默认可查看未完成记录，素材选择器保持 completed 筛选。已知远端 ID 的中断不当成未知创建，后续成功、取消或配置变化清理陈旧诊断。自动测试使用真实 loopback 断流/502，禁止以故障重试名义消耗用户额度。

第三方界面的“管理 Provider”负责新增、编辑、删除和“读取模型 / 测试连接”；后者只调用目录 GET，不生成内容。源码分别位于 `modules/providers/registry.js`、`modules/providers/catalog.js`、`modules/providers/vault.js` 和前端 `codely-generator/provider-manager.js`。旧 CPA 描述符、三按钮与历史保留，新增服务使用 Provider 与确切模型组成的稳定身份，不覆盖旧模型绑定或复制旧聊天设置凭据。最终装配和真实流程进度只查看 [XCAI 与 Provider 状态](../../RESTORE_STATUS.md#xcai-custom-provider-20261004)。

本机 HTTP 前缀为 `/api/codely-generator/local/providers`：GET 列表、POST 保存 `{provider}`、DELETE `/{providerId}`、POST `/{providerId}/sync-models`（空 body）、PUT `/{providerId}/model-capabilities`（`modelId` 与 `capabilities`）。本机 POST 目录同步只在服务端执行上游 GET，不是生成请求。凭据仅在显式保存时送入 Core，保存后前端只返回已配置状态；空密钥保留，清除须显式指定。新凭据由 DPAPI CurrentUser 密封，不把旧 CPA AES 存储混称 DPAPI；不得将真实密钥、私有输入路径、签名 URL 或完整响应写入源码/测试日志。

新增 Provider 可选择 OpenAI Images、显式通用 REST 任务、OpenAI Chat / Responses、Ollama 和 ComfyUI。当前只有 Images 与 REST 任务有执行适配器，其他协议明确显示执行未接入。Ollama 读取模型目录；ComfyUI 读取节点类型/模型文件并保存导出的 API 格式工作流及现有节点输入映射，不自动安装、启动或全局中断本地服务。REST 必须按所接服务文档填写创建、轮询与输出映射，不根据型号名称猜接口。目录需完整分页，部分/重复/超限响应拒绝更新。

每个模型的 size / quality / outputFormat / aspectRatio / references / generation / upscale 独立记录状态和证据。手动能力保存强制使用 manual，显示“手动配置，未验证”；它不是实测通过。未知质量等参数默认不发送，不开放未证实档位或独立超分；标准size可按下文公开/显式请求方法发送，但不提高真实能力证据。对于服务端不兑现精确尺寸的通道，可保留 `resolutionHint` / `aspectRatioHint` 的提示词要求：服务端保留原 prompt，另构造 executionPrompt 和摘要，历史再次生成恢复原文及要求，不重复拼接。提示词要求、真实 API 参数、服务报告和文件像素必须分别核对，不能把 HTTP200、quality 回填或高分辨率生成当独立超分验收。

2026-10-04 XCAI阶段记录：当次已完整读取3个图片请求 ID；首轮最多8次串行预算已用完，5个产物完成、3次失败，五图实际1254×1254 PNG，精确尺寸/横图/2K未兑现。追加3次串行场景测试已结束1产物/2次HTTP502：Flare幻想港口的1536×1024 / 3:2提示要求组合实际输出同尺寸PNG，风景与成年女性游侠插画无产物。该阶段总11次6产物/5失败，预算已用完，没有自动重试或扩为官方生成/编程请求。三个原prompt保持，executionPrompt含带空格像素规格与比例；匹配时不能因未找到无空格字串误判规格缺失。Flare成功只证明这个组合，不能扩大为任意尺寸或纯API size单独有效；quality仅标服务报告，真实档位、参考编辑与独立超分仍未知，HTTP200无合法产物仍算失败。历史证据见[10月4日记录](../../RESTORE_STATUS.md#xcai-custom-provider-20261004)，后续另行授权的实测见[当前记录](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)。

定向自动验证仅使用隔离 fixture，不读取本人凭据或收费：

```powershell
node --test tests/contracts/provider-catalog.test.cjs tests/contracts/provider-vault.test.cjs tests/contracts/provider-registry.test.mjs tests/contracts/codely-custom-provider-ui.test.mjs
node tests/e2e/custom-provider-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/custom-provider-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
```

`custom-provider-e2e.mjs` 支持 `--packaged --app-root <候选包>`，验证真实 Rust/Core 与原 GUI 的 Provider 管理、目录、生成/历史/重启及不可执行协议的明确状态。2026-10-04交付记录：主体双代48/48、完整`-RealCore -Chat`复验及正式安装已通过；本人数据另以只读snapshot的11任务/6缓存做15项恢复验证，早8条缺省executionPrompt不补写，原源数据SHA不变。后续主题/错误分类增量另以定向契约、双代48、主题8与CPA兼容验收，已于10月4日01:41原位安装并重开，不称增量后又重跑完整门禁。当次重开仅本机GET验证窗口/HTTP与3模型配置就绪，未代替用户真实生成；证据与历史失败见[10月4日状态](../../RESTORE_STATUS.md#xcai-custom-provider-20261004)，最新装配与验收见[本轮状态](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)，不扩大为全部上游真实可用或原生像素验收。

Provider选择使用原FZ一致的DOM弹出层，管理页原生下拉以colorScheme与option背景/文字继承主题；专项须从真实Host菜单切换浅/深色，不只改DOM class假装主题变化。图片响应错误分类仅适用于非official image、outputs模式、data集合，四种坏形状继续拒绝，不猜其他响应协议、不持久化原始body、不迁移历史失败。用户自行新增请求与Agent授权预算分开计数；旧泛化collectdata错误不能逆推出data准确形状。

2026-10-04尺寸接线验收记录：当时Provider `imageSizePolicy`支持prompt-only与openai-size两种请求方法。规范`https://xcai.pro/v1`默认实际标准size，其他服务默认仅提示词，管理原Popover可显式选择并保留原opt-out；冷恢复不写旧注册表、密钥库或任务历史。API策略用resolutionHint推导parameters.size和body size，固定n=1并保留prompt/执行要求，冲突、像素边界与明确unsupported先拒绝；质量独立，不新增high、resolution或aspect_ratio字段。当时1K/2K/4K×9比例为27公开预设，4K方2880×2880，16取整tuple兼容仅限该策略；结果按真实文件像素显示全部/部分/未兑现，合法产物可下载，不追认旧历史当年有API size。双代源码和候选size专项各29、v4原兼容各48通过，Popover真实交互早期失败保留。另获独立1张授权后gpt-image-2的3840×2160横图PNG已真实兑现，quality省略、原词/API size与暂停任务不变；不泛化2.5/其他规格/高质量或超分。02:46安装1566/1562零差、02:47首次重开观察保留，其后退出原因未知；当次桌面Shell启动PID42608于02:54确认launcher退出后仍运行并恢复4K/策略，仅本机GET。未重跑全套完整门禁，不猜测前次退出原因。该阶段事实保留在[历史记录](../../RESTORE_STATUS.md#xcai-custom-provider-20261004)，当前精确比例预设、CPA显式尺寸及文件核验见[本轮记录](../../RESTORE_STATUS.md#thirdparty-precision-live-20261007)。

## 官方编程模型接线

两代原聊天模型菜单通过 `assets/gamecowork-official-models.js` 在打开时请求 `codelyOfficial/refreshMenu`。账号 broker 按原客户端 version/team 上下文读取 `/api/config/v3`，`modules/account/official-model-menu.js` 只投影安全的原模型元数据，`modules/account/official-llm.js` 负责原生目录和私密请求代理。合法空目录允许 `ready:true/modelCount:0`；无权条目保留disabled，不根据Pro名称推断权限，不追加旧启用/刷新分组。Nua/fpa两份Core优先构建内置模型，保留倍率、logo和extras，官方身份仍由officialModelId独立识别，避免官方条目变自定义或旧ID误落到同名本地Provider。

菜单读取不获取CLI推理Key；真实官方会话启动时才懒获取，Agent只获得工作区/会话/模型/账号代次限定的可撤销本机能力。权限或身份改变撤销相关请求，纯展示元数据变化不得打断有效流。CPA配置和原推理逻辑保留；无thinkingEfforts只表示没有该菜单，不能据此推断原CLI不会发送其默认推理参数。

以下验证使用真实维护 GUI、Rust / Core 和同源码 guarded Agent，官方目录与推理上游均为回环 fixture。`--previous` 选择上一代，`--binary` 可指定候选宿主；`--packaged --app-root <候选包>` 读取候选包内宿主、前端和 Core，同时仍须显式提供同源码 guarded Agent。`--output` 必须指向统一 temp 内的独立目录。它不代替本人真实官方推理或额度验收；测试结果和包来源统一见 [当前状态](../../RESTORE_STATUS.md)。

```powershell
node --test tests/contracts/codely-official-programming.test.cjs tests/contracts/codely-official-model-menu.test.cjs tests/contracts/frontend-chat-model-menu.test.mjs
node tests/e2e/codely-official-programming-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-official-programming-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-official-programming-e2e.mjs --packaged --app-root <候选包> --agent <同源码 guarded Agent EXE>
```

## 本地状态与证据

验证通过专用 `GAMECOWORK_DATA_DIR` 隔离 Core、CLI、索引和工作区，不重写 HOME / USERPROFILE。测试工程、截图、日志、guard 包和构建暂存统一位于 `F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work`。

只清理自己创建且已核对 PID 和目录的测试进程。仓库内不得放一次性日志或敏感导出。旧验收日志中的路径按 [迁移表](../architecture/overview.md#旧目录迁移表) 对应到当前源码，历史测试数字不代表本次验证。
