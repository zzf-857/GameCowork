# 测试导航

Provider 传输诊断由 `contracts/asset-generation-transport-diagnostic.test.mjs` 验证真实 loopback 断流、deadline、HTTP/JSON分类、秘密保护、持久恢复及不重发；`codely-task-outcome.test.mjs` 与 `codely-task-outcome-ui.test.mjs` 验证兼容投影及原 Quick/History 消费者。`e2e/custom-provider-e2e.mjs --transport-errors-only [--previous]` 通过原4K控件分别提交到断流/502/成功fixture，检查“结果未知”、重试禁用、历史草稿和冷重启；不调用真实生成服务。

统一入口是项目根目录的 `tools/verify-local.ps1`。Rust 单元测试保留在 `src/shell/src/`；本目录承载源码契约、跨进程与用户流程验证。

| 目录 | 内容 | 运行方式 |
| --- | --- | --- |
| `contracts/` | 实际函数、双前端行为、资源与协议契约 | 按文件执行 `node` 或 `node --test`；以统一门禁为准 |
| `integration/` | HTTP、Core / CLI、worker、生命周期与真实 Editor smoke | 按需执行；部分需要 guarded Agent 或真实编辑器 |
| `e2e/` | 项目、聊天、文件、Git、LSP、账号与编辑器流程；部分 driver 可选 Chromium | 使用真实维护界面或宿主/Core 协议链与隔离外部服务，按参数区分验收范围 |
| `fixtures/` | 模拟 Core / Provider / MCP、guard、C# / Rust 测试程序 | 由 driver 启动或复制，不是独立产品入口 |
| `support/` | 编辑器身份准备、桥 RPC 与辅助函数 | 由 driver 导入 |

所有命令在项目根目录执行，例如：

```powershell
node tests/contracts/frontend-request-contract.mjs
node tests/integration/shell-http.mjs
node tests/e2e/project-panel-e2e.mjs
```

不要将 `fixtures/` 当作测试全量执行，也不要无区别执行所有 integration / e2e 文件：真实 Editor 和 Agent 场景有专门的准备及隔离条件。默认门禁不启动真实编辑器、不访问真实 Provider。

Unity Hub 本地接线验证使用 `integration/hub-refresh.mjs`、两代 `e2e/hub-project-status-e2e.mjs` 与 `e2e/editor-licensing-e2e.mjs`，检查缓存刷新、只读项目状态、许可作用域和明确拒绝。它们以真实 Rust / Chromium 加隔离 Core fixture 验证，不证明真实激活或 Editor 启动。`project-template-details-e2e.mjs --warning-fixture` 保留真实本地模板回执，仅验证坏包诊断的呈现；Rust `project_templates` 单测验证真实损坏 tgz fixture 的隔离及实际创建。

安装缓存使用 `integration/editor-installations-cache.mjs` 验证真实 HTTP、持久快照、重启、发现屏障和扫描分离；加 `--browser` / `--previous` 进入两代真实 GUI。相关契约是 `core-hub-discovery.test.cjs`、`frontend-editor-installations-cache.test.mjs` 与 `frontend-project-recency.test.mjs`。项目改动排序包含磁盘文件元数据，缓存可见不能代替扫描完成，fixture 不执行真实 Editor。

当前资产入口使用 `e2e/codely-assets-e2e.mjs --agent <同源码 guarded Agent EXE>`，真实 Rust / Core / 两层 GUI iframe 加载保留的原 Quick、History 和 ReactFlow 客户端。加 `--previous` 验证上一代，加 `--packaged --app-root <候选包>` 验证装配资源；`--inspect` 仅做结构检查，不能作为完整交互门禁。实际覆盖范围与通过记录见 [当前状态](../RESTORE_STATUS.md)，原模型未配置的错误断言不能算作生成成功。loopback Provider只准备自有历史媒体，不调用原平台或真实额度。

`codely-generator-local-identity.test.mjs`、`codely-canvas-source-contract.mjs` 核对原资源、组件、Host与身份边界；`codely-generator-api.test.mjs`、`codely-generator-upload.test.mjs`、`codely-media-rebase.test.mjs` 验证原接口形状、本地实际文件与重启地址解析。构建前同时执行 `tools/import-codely-generator.mjs --check` 和 `tools/verify-codely-canvas-source.mjs`；后者静态解析依赖，不执行原应用代码，nonliteral动态路径仍须实际运行验收。

账号契约包括`codely-account-{broker,wiring,official-surface,frontend,timeout}.test.mjs`的授权/密封/刷新/代次/站面及完整响应体时限，另由`codely-account-display.test.cjs`和`codely-account-display-frontend.test.mjs`提取两份Core及两代菜单实际函数，验证固定官方usage网页、真实邮箱/未知邮箱账号ID标签、active/seat与个人订阅读取。这些是隔离测试；本人真实登录和原生界面观察统一见状态文档。

`e2e/codely-account-login-e2e.mjs` 默认启动真实 Rust 宿主和 Core，以 loopback fixture 验证授权、组织/订阅/额度读取、Windows DPAPI 保存与重启恢复、退出后回到本地身份；默认不启动 Chromium。追加 `--browser` 验证原登录弹窗与界面交互，`--browser --images` 增加原 Quick 官方图片控件、报价、任务、历史和下载，追加 `--previous` 选择上一代；`--packaged` 使用当前 `app/`，候选包用 `--binary` / `--core` / `--frontend` / `--runtime` 明确指定，没有 `--app-root` 参数。两代浏览器与协议验证结果分别记录，不能相互替代。网络 guard 只允许 loopback，测试不代用户进行真实官方登录或消费额度。本人真实登录及 Quick 付费读取已完成的证据、当前源码与包内范围统一见 [当前状态](../RESTORE_STATUS.md)；Canvas 生成 schema 仍待接入。

官方生成的基础契约包括 `contracts/codely-official-generator-broker.test.mjs`（私有会话、真实请求字段、完整响应体超时、取消、POST 不重发及推理凭据绑定）、`contracts/codely-official-assets.test.mjs`（账号绑定任务、已知 ID 恢复、媒体 SHA、缓存/下载、原参考上限与首尾帧复用）、`contracts/codely-official-generator-api.test.mjs`（原 Frontier 构建函数、报价、提交、查询与真实媒体），以及 `contracts/codely-official-generator-validation.test.mjs`（未知状态、最终上传 Buffer、全部引用预检/去重和失败回收）。这些生命周期断言保留，但不能单独证明其它模型或真实服务可用。

43个官方契约由三组`codely-official-{image,video-3d,audio-text}-models.test.*`对照原builder、报价、最小参数、引用与拒绝边界，`codely-all-model-readiness.test.mjs`核对逐模型身份。`codely-official-task-output.test.cjs`验证真实图层/动作/文字及按原逻辑作为结果的克隆音频预览，实际voiceId只在服务返回时保留；`codely-assets-persistence.test.cjs`验证落盘和重启。音频、模型包、EXR/HDR及JPEG由对应`codely-*-media.test.*`与`model-media.test.cjs`验证完整存储、边界和损坏拒绝；不执行归档内容或宣称所有codec已解码。

`codely-official-known-task-resume.test.cjs`验证已知ID缓存失败仅GET恢复、保留部分artifact、拒绝scope/账号/ID替换及不再生成；`codely-official-task-reconciliation.test.cjs`验证原模型/完整参数的唯一证据；`codely-generator-diagnostics.test.mjs`验证本人限定History、HTTP400有界诊断和秘密脱敏。分页不完整、重复ID或不唯一时不能adopt；无匹配不证明未扣额或授权重发。图像transport MIME纠正只接受已完整检查的实际PNG/JPEG，显式输出MIME仍匹配。

`codely-quick-audio-preview.test.mjs`的4项契约提取原/维护实际函数：复现`lwe`因preview键将MP3/Opus误判image，验证仅已知音频扩展提前分类、query伪扩展拒绝，以及`_N/k5/wN`结果/完成规则和`xZ`播放器等其余函数字节一致。源码浏览器专项使用原`xZ`检查实际MP3/Opus字节的loadedmetadata/play/timeupdate/ended，2项通过；额外极短FLAC不构成全部codec播放通过。该专项与包内验证范围分别记录在状态文档。

`e2e/codely-all-models-e2e.mjs --agent <同源码 guarded Agent EXE>`使用真实Rust/Core、原Quick/History GUI和隔离官方fixture：43契约逐一检查报价、上传、提交、ID查询与字节/文字SHA，4类GUI检查菜单控件、播放、保存和历史草稿，再覆盖4项恢复/HTTP scope/History分页case。`--previous`选择上一代，`--packaged --app-root <候选包>`选择包内资源，也支持分别指定路径。账号/缓存补丁后的候选双代已通过，该43模型包在最后`lwe`音频分类补丁前；后者另有补丁后候选MP3/Opus2项专项。本轮正式app1561资源，真实45项中30完成、15HTTP400未跑通，完整门禁与实际结算单独见 [状态文档](../RESTORE_STATUS.md#official-all-models-20261003)。fixture完成数不等于线上扣额成功数。外部请求受loopback guard限制，合成克隆fixture不证明真实音色身份。

`contracts/codely-official-programming.test.cjs` 验证显式启用真实模型目录、Core 内存 Key、Agent 的工作区/会话/模型能力、三种推理协议与最终帧、账号/组织撤销及 CPA 设置保留。`e2e/codely-official-programming-e2e.mjs --agent <同源码 guarded Agent EXE>` 从两代原模型菜单点击“启用 Codely 官方 · Pro 模型”，选择官方模型并通过实际 Agent 验证流式响应、工具、取消和 CPA ↔ 官方切换；`--previous` 选择上一代，`--binary` 指定候选宿主，`--packaged --app-root <候选包>` 读取包内资源。该 driver 始终使用同源码 guarded Agent、隔离账号/目录/推理 fixture 和自有 temp 工程，不证明真实官方推理或额度消费。

```powershell
node --test tests/contracts/codely-official-generator-broker.test.mjs tests/contracts/codely-official-assets.test.mjs tests/contracts/codely-official-generator-api.test.mjs tests/contracts/codely-official-generator-validation.test.mjs tests/contracts/codely-official-programming.test.cjs
node --test tests/contracts/codely-account-display.test.cjs tests/contracts/codely-account-display-frontend.test.mjs
node tests/e2e/codely-account-login-e2e.mjs --browser --images
node tests/e2e/codely-account-login-e2e.mjs --browser --images --previous
node tests/e2e/codely-official-programming-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-official-programming-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
node --test tests/contracts/codely-official-image-models.test.mjs tests/contracts/codely-official-video-3d-models.test.mjs tests/contracts/codely-official-audio-text-models.test.cjs tests/contracts/codely-all-model-readiness.test.mjs tests/contracts/codely-official-task-output.test.cjs
node --test tests/contracts/codely-audio-media.test.cjs tests/contracts/model-media.test.cjs tests/contracts/codely-extra-image-media.test.cjs tests/contracts/codely-hdr-media.test.cjs tests/contracts/codely-assets-persistence.test.cjs
node --test tests/contracts/codely-jpeg-media.test.cjs tests/contracts/codely-official-known-task-resume.test.cjs tests/contracts/codely-official-task-reconciliation.test.cjs tests/contracts/codely-generator-diagnostics.test.mjs
node --test tests/contracts/codely-quick-audio-preview.test.mjs
node tests/e2e/codely-all-models-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-all-models-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
```

默认 driver 还覆盖聊天右栏的原 AI 画布入口及双文档编辑租约；`--flexible-layout` 为另行测试的原可选布局，不等同默认窗口。`--cpa-only` 使用原控件选择明确的 CPA descriptor，再通过真实 Core 向隔离图片接口提交、解码、恢复历史草稿并重启；两代均进入统一门禁。`codely-local-models.test.mjs`、`codely-cpa-generation.test.mjs` 与 `codely-sidebar-canvas-contract.mjs` 分别覆盖描述符/能力、Provider绑定/任务与LAN边界、默认右栏身份协议。自动脚本不读取用户真实CPA凭据，不调用真实额度；手动实测另见状态文档。

CPA接线契约为`contracts/codely-cpa-image-models.test.cjs`、`contracts/asset-generation-cpa-profile.test.mjs`、`contracts/asset-generation-template-parameters.test.mjs`与`asset-generation-cpa-reported-image.test.mjs`。当前公共profile固定auto/auto/PNG与构图提示，验证旧请求再生成的明确确认、拒绝假精确像素/高级quality/格式能力、共享绑定和ProviderDB不变。`e2e/codely-cpa-flexible-e2e.mjs --agent <同源码 guarded Agent EXE>`两代各47项覆盖第三方tab、内部image、四请求ID、提示/defaults、原下载/历史/重启和旧草稿确认；每代5次fixture显式创建，不验证真实账户参数兑现。`--previous`选另一代，`--packaged --app-root <候选包>`选包内资源；自动guard阻断WAN，不读取用户凭据。最新源码后端exit0/Rust160加双代包内47专项分别记录，不称收敛后又跑全套`-RealCore -Chat`。

本人CPA人工8次串行单张已提交完：7个产物完成、1次HTTP500 EOF失败未重试，预算已用完；成功样本全部为实际1254×1254 PNG、报告low，公开任务回执无可确认model身份。请求尺寸/高级quality/格式未兑现，四ID回图不证明实际2.5换模，构图提示也没有本机成功证明。手动driver和结果只留统一temp，不进入自动门禁，不扩大为官方生成/编程请求，不再新GEN。收敛前fixture始终返回自有48×32 PNG，只证明字段透传/实际文件差异；最终profile测试与包验须单独记录。

```powershell
node --test tests/contracts/codely-cpa-image-models.test.cjs tests/contracts/asset-generation-cpa-profile.test.mjs tests/contracts/asset-generation-template-parameters.test.mjs tests/contracts/asset-generation-cpa-reported-image.test.mjs
node tests/e2e/codely-cpa-flexible-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-cpa-flexible-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
```

底层通用服务仍由 `integration/asset-generation-service-smoke.mjs` 与 `asset-generation-{auth,adapter,lifecycle,idempotency,large-output,inputs,policy,owner}.test.*` 验证。旧 `e2e/asset-generation-e2e.mjs` 和 `frontend-asset-generation-contract.mjs` 对应此前自研面板，保留历史用途，已不作为现行原界面的默认门禁。

自定义 Provider 的源码契约为 `provider-catalog.test.cjs`、`provider-vault.test.cjs`、`provider-registry.test.mjs` 与 `codely-custom-provider-ui.test.mjs`：验证完整目录/分页、Provider/模型稳定身份、DPAPI 密封与凭据版本提交、编辑/删除/重启、逐模型证据与未知参数拒绝。手动配置必须保留 manual 标签，不制造 tested 结果；Chat / Responses / Ollama / ComfyUI 只配置和读目录，执行未接入须保持明确状态。阶段性33项 Provider/Vault/目录、9项 UI 和9项身份旧回归存在交叉，不相加为独立总数；最终结果统一见 [活动状态](../RESTORE_STATUS.md#xcai-custom-provider-20261004)。

`e2e/custom-provider-e2e.mjs --agent <同源码 guarded Agent EXE>` 使用真实 Rust/Core 与两代原 GUI，覆盖 Provider 管理、目录同步、动态模型、生成/历史/下载/重启与配置用途边界；`--previous`选择上一代，`--packaged --app-root <候选包>`选择包内资源。只使用 loopback Provider、合成媒体和测试凭据，外站与真实额度必须阻断；源码或包内通过不能替代 XCAI 真实规格验证。源码双代各48项、引用边界修复后的最终候选双代各48/48已通过，真实Windows DPAPI、自有fixture每代3次创建，外站/pageErrors/官方额度使用0，自有Host/Core/vault退出。完整`-RealCore -Chat`复验exit0/Rust160已通过，首次旧VM依赖/文案适配失败保留；正式1566资源/1562映射已安装并正常重开，证据以活动状态为准。

本人Provider恢复的15项人工只读验收采用真实registry/vault、11任务与6缓存的独立snapshot，由正式安装包读取；核对原词/state/executionPrompt的存在性及内容、文件SHA与原源数据不变，WAN/inference/新GEN均0，所有自有Host/Core/Unprotect进程退出。早8条未存executionPrompt仍保持缺省。这不是在真实用户数据上运行自动测试或执行收费请求；实际原位重开另只以本机GET确认Provider/keyConfigured/3模型、窗口和HTTP就绪，不能称原生像素验收。人工恢复证据不登记默认门禁。

后续主题与中文格式分类增量的候选双代48/48、定向Provider33及malformed44、原CPA兼容8项已通过；两代主题专项各8项实际从Host菜单切浅/深、核对原FZ表面、管理页native选项、键盘选择/关闭/重开，0GEN/WAN/pageErrors。主题候选与错误分类合并候选的1111前端SHA完全相同，故沿用该前端主题证明。**完整`-RealCore -Chat`门禁在这些增量之前通过，未宣称增量后又跑全套**；最新增量已原位安装1566运行文件/1562映射零差异，并以本机GET确认原生窗口/HTTP/本人3模型配置就绪留运行；不把窗口句柄当Wry像素验收。用户后来自行两次失败不计入Agent11次预算，也不据旧collectdata错误推断原响应为空。

API尺寸补全另验prompt-only/openai-size、规范XCAI默认/其他保守默认/显式opt-out、冷读不写registry/vault/历史、body实际size及n=1、冲突/越界/unsupported前置拒、质量独立和27取整预设限定；真实artifact像素决定全部/部分/未兑现，reported不能冒充，旧历史缺省API size不补写。Core先75项通过，新增unsupported后Registry28通过，累计范围76但不称全76重跑；前端37与ledger/layout通过。双代size-policy-only源码与候选各29/29，v4候选原Provider兼容双代各48/48，六份报告网络/pageErrors0、自有进程退出；交叉范围不相加。真实Manager层级/pointer-events/Escape缺陷的v1–v4失败保留，修正后覆盖横竖方size、1K达标和小图不符可下载。正式1566/1562已安装，首次18752重开观察保留但后续退出原因未确认；最新42608桌面启动于02:54再核launcher退出后仍Running/WindowReady及策略/4K缓存恢复，仅本机GET无额外GEN，不以旧观察冒称当前仍运行。未重跑整套完整门禁。

用户独立授权的单张人工真实4K不登记自动门禁：gpt-image-2 / n1 / size3840×2160 / PNG / quality省略，实际PNG3840×2160、完整像素存储与SHA已核验，原prompt/API size匹配、registry与15暂停official行不变、自有进程退出、无推理或自动重试。最初paused预检exit1时0Core/0请求，不计收费失败；后续私有工具按固定terminal行ID+SHA允许新测试，不恢复旧官方任务。结论只涵盖此1张横图，不证明2.5/其他尺寸/高质量/超分，预算与原11次及用户手动请求分开。

XCAI 人工验证与旧 CPA 预算分开记录：首轮8次串行5产物/3失败，追加3次场景1产物/2次HTTP502，总11次6产物/5失败，预算全用完。首轮实际成功文件均1254×1254 PNG，追加Flare幻想港口实际1536×1024；后者只证明该联合提示要求组合，不证明纯API size单独有效或任意尺寸。三个原prompt与含带空格分辨率/比例的executionPrompt均保持；HTTP200无合法outputs不计成功，不重试未知原操作。手动driver、GUARD和媒体只留统一temp，quality只标服务报告，真实档位/参考编辑/独立超分仍未知。不得把这些人工请求登记默认自动门禁。

`codely-assets-e2e.mjs --download-only [--previous]` 专门点击原 Quick、History、主 Canvas 与默认右栏 Canvas 的下载按钮，检查实际文件 SHA、成功提示、取消、重名、范围拒绝及冷重启。只在隔离 headless/test-mode 下用 `GAMECOWORK_TEST_DOWNLOAD_CHOICES` 选择自有 temp 目标，实际原生保存对话框另行验收；两代专项进入 `-RealCore` / `-Chat` 浏览器门禁。`contracts/codely-download-contract.mjs` 核对保存回执与无浏览器兜底，Rust 测试验证媒体身份、文件保护和独立对话框任务生命周期。

`e2e/codely-cached-clone-audio-e2e.mjs --read-owned-cache --frontend app/frontend --output <统一 temp 内目录>` 是按用户授权执行的人工只读专项，**不登记默认自动门禁**。缺少 `--read-owned-cache` 时会在读取真实缓存前拒绝执行；显式选择后只读取本人的 `.gamecowork/generator` 中已完成克隆 MP3，以安装包静态前端和只允许 GET 的独立回环 fixture 验证原 History 对话框及播放按钮。它不启动正式 app/Core/runtime，不访问真实账号、生成或推理服务，也不修改任务库或缓存字节；报告只记录媒体 SHA、播放状态和不变性，不记录账号或签名 URL。自动门禁继续只用隔离 fixture；此人工结果不能推定所有克隆、音色身份或其它编码已验收。

启动链路使用 `contracts/frontend-startup-messenger-contract.mjs` 验证两代 Native 的共享 Redux client / store / persistor，`contracts/core-command-bootstrap.test.cjs` 验证真实 Core 函数的初始化通知缓存回放、pending 刷新、失败与代次隔离。`integration/core-command-bootstrap.mjs --package <同源码 guarded Agent 目录>` 进入 `verify-local -RealCore`，跨真实 Rust / Core / 编译 Agent 验证同一链路，使用可释放的测试屏障而不请求模型生成；`--packaged --app-root <候选包目录>` 选择包内资源。`integration/native-window-session.mjs` 仅启动并记录自有 Wry 窗口生命周期，实际 Native 手势和界面仍需单独观察，不把 launcher 本身当作 UI 通过。

Console 使用 `contracts/editor-console-contract.mjs` 验证真实 Agent 消费者和 get / clear-all 契约。`integration/editor-console-smoke.mjs --package <同源码 guarded Agent 目录>` 进入 `verify-local -Editor`，使用自有真实 Editor 验证当前原生 Console 视图、完整性字段、读取偏好不变、批准 / 拒绝 / 取消清空及断连失败；`--app <候选包目录>` 选择包内桥和 Agent 资源。它不证明读取隐藏日志、时间增量读取、修改 Collapse 或选择性清空。

Editor 功能增量的四个源码 driver 也已进入 `verify-local -Editor`：

| Driver | 实际范围与参数 |
| --- | --- |
| `integration/editor-context-smoke.mjs --package <同源码 guarded Agent 目录> --extra-queries` | 六项原生上下文读取；实际模型发出的资产 / 包元数据查询，拒绝用其它 selector 遮蔽写动作 |
| `integration/editor-asset-package-smoke.mjs --graphics` | 无模型的 AssetDatabase 查询、已加载注册包、原生异步预览和真实 PNG；支持 `--bridge`，无图形默认模式明确报告预览不可用 |
| `integration/editor-scene-mutations-smoke.mjs` | 自有实际 Editor / TCP，create / modify、真实 Undo、已加载原文件 save、nonce 与工程 / 文件身份拒绝 |
| `integration/editor-scene-mutations-agent-smoke.mjs --package <同源码 guarded Agent 目录>` | 实际工具发出 / 结果 ID、批准 / 拒绝、提交前取消和提交后效果提示、modify → save 串行顺序 |

对应默认契约为 `cli-unity-operations.test.mjs`、`editor-context-contract.mjs`、`editor-context-implementation-contract.mjs`、`editor-asset-package-contract.mjs` 和 `editor-scene-mutation-contract.mjs`，均位于 `contracts/`。上述四个 driver 没有通用包内参数；它们的源码结果不证明新的装配包、团结运行时、资产写入或包安装 / 移除。场景 save 的磁盘效果不能由取消或 Undo 自动回滚，路径校验也不提供原子 TOCTOU 保证。

新增测试归入对应目录，通过 `import.meta.url` / `__dirname` 解析项目根。通用 fixture 放入 `fixtures/`，辅助逻辑放入 `support/`。截图、日志、项目、SQLite、编译产物和浏览器状态只写入统一 `temp/GameCowork`。

旧文件名全部保留。更多说明见 [开发指南](../docs/DEVELOPMENT.md#验证选择)，真实编辑器约束见 [桥规范](../src/editor-bridge/AGENTS.md)。
