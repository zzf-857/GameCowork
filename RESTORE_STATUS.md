# RESTORE_STATUS — Tuanjie Cowork 还原状态

## 当前产品修复状态（2026-10-01，已恢复持续完善）

用户目标是完善 GameCowork 直到实际功能链路跑通，对比原软件；优先修复已有界面不可显示、不可操作的问题，第三方模型/图片/视频/3D Provider 作为后续独立阶段。以下历史章节的“完整”“100%”只描述提取文件覆盖，不能用作产品功能验收。

用户已重新要求持续完善至功能跑通；第五阶段已将实际 Tuanjie/双引擎预览、Git/Diff、Commands/Subagents 与 GUI 编辑器控制装配并验收。用户随后指出此前遗漏 NativeWindowBridgeHost 完整实现，当前以原 EXE/原桥加载链与通用窗口托管作为编辑器扩展主线。安装编辑器面板已修复，当前日常包已更新为1184资源（14:46 UTC，大屏修复版）；LSP菜单时序原因已查明，1179包真实LSP完整gate随后20/20通过；12:20包两代MCP15项修复已验收，12:53包品牌/营销版本/精确选择及完整GUI主流程均已完成本轮复验。新增模块进入包不等于全部包内功能已通过。接手入口 [HANDOFF.md](HANDOFF.md) 是第四阶段暂停时的历史交接；活动状态与新验收统一记录在本文件。目标仍持续进行，远程与第三方媒体 Provider 保留后续范围。

### 大窗口复合画面尺寸越界与面板发现（2026-10-01，已装配并验收）

用户1184旧包截图各槽位共同报 `Composite dimensions/fps are out of bounds`。本轮只读其实际运行程序：窗口最大化 **2560×1369、scaleFactor=1**，工程桥 `running=true/capturing=false/streamCount=0`；没有安装包、修改用户工程、调用Provider或停止用户Unity。旧1184隔离真实Unity同条件复现：2560×1800/DPR1的实际请求 **450×1597/fps15**，父复合画面尚未拆槽就被 `PreviewStreams.ValidateComposite` 的1920×1080边界拒绝，所有槽位一起失败。报告 `temp/GameCowork/tests/editor-bridge-generic-product-large-baseline-20261001-audit-01`；这是真正产品失败，前一轮1600×1000等测试未覆盖该条件。

按用户要求只读原 `codelyreversebackup/protocol/windowBridge-original.html` 与完整 `NativeWindowBridgeHost.cs` / `.Composite.cs`：原版发送CSS尺寸与独立DPR，在native桥内算物理RT并对齐偶数；1920×1080只是显示器探测fallback，不能当原版capture上限。own JPEG保留自有资源/解码保护与严格C#校验。`GameCoworkCaptureSize` 按 `min(1,1920/W,1080/H)` 统一等比例预算，DPR单独限制.5..4，不预乘；main-area start/update/resume、resize flush与multi-project start共用，HTTP和复合canvas backing一致，DOM仍全尺寸显示，输入继续由真实JPEG/contentRect/slot/instance/epoch/revision映射。resize按归一后的宽高/DPR去重。首次multi启动同步resize去重状态，multi.start按完整layout+normalized size签名去重；同参数parent/observer消息不重建native epoch，真正尺寸/槽位改变及stop/reopen仍建立新捕获。源码与真实DPR1.5复测确认了此前重复start导致的400 replaced-capture，最终修复没有增加sleep或忽略输入失败。未加载原DLL或运行原EXE。

已打开本地工作区的右侧提供可发现“串流”入口，首次识别失败仍可在独立面板重新识别。识别为12秒有界同工程只读请求，过期/关闭/切换结果丢弃，非Unity明确提示，纯打开不自动安装/开Editor/capture；激活串流时隐藏重复入口，避免小窗口顶部标签挤压。两代unknown metadata源码各8/8（`editor-view-discovery-57d2f308-892b-4906-8067-090f6e9b63b5` / `37c6733f-8670-4245-bde5-782be98ba76f`），闭根修复后再次各8/8（`1dd50428-5121-462c-836b-31e6e0fd1130` / `979bc385-c2e8-4408-82f1-9a534cac9722`）；候选02两代unknown各8/8，`preview-size-candidate-unknown-{current,previous}-01`，真实安装/捕获始终为0。

完整大屏gate还定位并修复了旧异步状态复活：最后工作区关闭时原R0只写待建会话而未清active session；现在正确创建无归属空会话并skip旧draft restore，保留history及未保存内容。预览root仅从实际live registry投影，A关闭不清B；A独立epoch/closing/tombstone防晚registry/history/stream缓存覆盖关闭或重开状态，Qt旧finally不能清新spinner，rr成功/拒绝均在cached激活前检查原owner/操作。失败close保原row及buffers，真正workspaceAdded才恢复新代次。Git-presence和全局Git读取也在发送前检查固定live owner，闭根旧probe不会跨到host；其它宿主保持原行为。闭根实际函数契约 **42/42**，Git scope **8/8**。

最终受影响source contracts **230/230**（`preview-size-final-contracts-20261001.log`），size/signature **10/10**。完整backend `tools/verify-local.ps1 -SkipBrowser` 最新 **exit0**（`preview-size-verify-complete-20261001.log`），含Rust **89/89**、格式/构建及源码、隔离HTTP、索引、进程、终端、Git15、LSP后端12/状态7。此命令明确不跑browser/actualEditor，以下实际GUI为独立门禁；首次verify因审批快捷键提取器对合法CRLF定位失败exit1，测试仅归一换行并加强提取边界，原行为24/24后重跑整gate。

**最终候选04实际包门禁：Unity/current/DPR2 与 Tuanjie/previous/DPR1.5 各21/21、exit0**。均真实2560×1800→1280×900，实际parent backing304×1080→420×697；四阶段实际HTTP原JPEG bytes/hash、SOF尺寸、显示frameId/instance/epoch/revision/DPI/source/ROI逐项一致，6类型可见、Hierarchy键盘/点击与Inspector序列化修改、真实可点击tab关闭/恢复及两槽fresh epoch验证；每组 **28次input全部HTTP200**、无400/产品/页面/API错误、无外部请求、ownPIDs退出，drain后GUI/native均不复活。报告 `temp/GameCowork/tests/editor-bridge-generic-product-large-candidate-20261001-audit-{13,14}/result.json`。每浏览器/frame仅一次实际loopback HTTP passthrough，原status/headers/相同真实bytes送给原receiver，不模拟帧；每组2次明确own已停listener+stream的ECONNREFUSED保在frameTransportErrors/teardownEvidence，须验证native registry移除、CPP streamCount0/capturingfalse/runningfalse、GUIsettled以及scope endpoint/stream归属，不能按阶段泛化吞live错误。cleanup TargetClosed仅已发起context.close且此前liveobserver为空时作为工具取消留证。

中间失败原样保留，未把partial checks冒充成功：source02混合新Vsc/旧Sidebar加载；03重复入口压缩tab；04/05/06的逐帧CDP body获取与观测边界；07/candidate08的真实闭根回灌；09的重复start输入身份失效；10/11/12的关闭中新发Git probe与已停endpoint观察边界，均记录原exit1和实际证据。最后的owner/API/400/JSON断言仍严格，最终21门禁在同样业务场景完整通过。

**正式app已原位更新：1184资源，大屏修复版**。`builtAtUtc=2026-10-01T14:46:55.7675923Z`，revision2770113 dirty=true，normal CLI guard=false；`tools/build-local.ps1 -SkipTests -CliPackageDirectory ...cli-phase6-normal-20261001-01` exit0，源CLI/entry/executable仍由脚本核验。1184项SHA全部匹配，并与已验候选04逐文件hash一致：`preview-size-final-app-integrity-20261001.json` 的 manifestMismatches=[] / testedCandidateDifferences=[]。build/旧二进制 `temp/GameCowork/build/dfd03ad8b7b14ffab79b0e36e651b620`，日志 `preview-size-final-app-build-20261001.log`；候选04为 `preview-size-candidate-20261001-04`（build905941c438994a168528ddaab8b1f49a）。未终止用户程序；用户自行关闭旧GameCowork后装配，没有修改用户Unity工程、许可、账号、真实Provider或工作区数据。保留另一聊天已冻结的模板详情/索引发布路径/历史清空修复，未提交推送Git。音频、WebRTC、远程等仍为独立后续范围，用户将手动复测新EXE。

### Unity 连接状态与视图连接器入口（2026-10-01，用户实测反馈）

用户实际打开工程后一直“连接中”，并且无法发现各种视图入口。本轮与正在开发同仓库的另一聊天明确协调范围：这里只改两代前端的 Unity 状态/安装/启动函数、连接卡片和纯 UI 入口；保留它的 Core、Rust、C#、编辑器品牌/版本选择与捕获输入改动，由本聊天最后装配，避免两个构建互相覆盖。

确定根因：`projectMenuFlows-*` 原 status/refresh 只有存在聊天 sessionId 才更新状态；启动过程中未连接又被跳过，原 launcher 仅记录进程没有有限等待收尾。`Joe/ese` 只认聊天连接而忽略工程桥状态；安装 thunk 把 manifest 修改回执当成 projectInfo。旧主标题视图入口发的 URL 消息没有工程 key/root/代次，被现有隔离规则过滤；默认布局也没有可见的视图按钮。

两代修复统一采用工程级 `local-editor:<workspaceKey>` 权威状态，未创建聊天或模型也能连接。安装后重新读取同工程真实 metadata，不能从安装/进程启动推定连接成功；启动按工程隔离并等待最多 60 秒，缺桥、失败和超时都会释放 launching 并保留原因。手动检测和自动轮询共享代次，过期状态/文案均丢弃；点击时冻结路由，lazy import、切换工程和版本选择不能把 A 的启动投到 B。原始其它宿主逻辑保留。

共用 `gamecowork-unity-connectors.js` 的主要操作区是用户截图中的**右侧独立“串流”面板**：连接状态、安装连接桥/重新配置连接桥、重新检测、打开编辑器和六类 Scene/Game/Hierarchy/Inspector/Console/Project 入口集中在此，聊天旁卡片仅保留提示和“打开串流面板”快捷入口。会话顶栏也可直接打开；空新会话已验收从输入栏卡片进入，不能仅由有历史会话的 header fixture 推定所有布局入口都可见。断线仍可发现六类能力与连接步骤，连接后才可开始对应实时视图。顶端工具区用 ResizeObserver 测量实际高度，iframe 位于其下，保留真实输入映射、跨工程选择/停止和旧菜单/布局。`shell/openUnityViews` 携带固定 root/key，主页面和 Sidebar 双重验证同窗同来源/当前工程；纯面板发现不安装、不开编辑器、不启动捕获。安装只在用户明确点击后经现有 Rust 变更服务修改工程 manifest 并备份原字节，没有自动修改用户工程。

最终受影响源码契约 **176/176**（连接/卡片/入口66项及 request/passive/layout/lifecycle），日志 `temp/GameCowork/unity-connectors-final-contracts-20261001.log`。本轮 `tools/verify-local.ps1 -SkipBrowser` **exit 0**，Rust fmt/test86/build、各实际源码契约、隔离 HTTP、索引/进程/终端/Git15/LSP后端12及资源状态7通过；日志 `unity-connectors-verify-20261001.log`，此命令明确跳过浏览器和实际Editor，相关真实GUI由下列独立gate证明。新增3个契约和两代 `editor-view-discovery-e2e.mjs` 已纳入 verify-local；未冒称整套 `-RealCore -Chat -Editor` 本轮统一退出0。

最终右面板真实源码 gate `node tests/editor-generic-product-e2e.mjs --connector-entry`，Unity/current 与 Tuanjie/previous 各 **15/15**：无聊天/模型时连接并启用六类连接器，纯发现不启动capture，直接添加Hierarchy/Inspector后真实画面、选择、序列化修改、实际控件坐标、精确两槽布局保存/恢复和关闭回收通过；报告 `tests/editor-bridge-generic-product-connectors-panel-{current,previous}-01/result.json`。对应 **1184新包** `--packaged` 两引擎也各 **15/15**，报告 `tests/editor-bridge-generic-product-connectors-package-{current,previous}-01/result.json`；ownPIDs退出，页面错误/外部请求为零。Scene/Game默认保留render-content，其它4类复用已有完整EditorWindow捕获。一次团结参数误用了不存在的F盘路径，在启动前即ENOENT；核对真实 `E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe` 后完成上述验收。

断线/显式安装 gate `editor-view-discovery-e2e.mjs` 用实际Rust与两代Chromium、隔离的Core fixture，不启动Editor/Provider：源码各 **9/9**（`editor-view-discovery-bb7f5ea4-616c-495c-a9a1-a05f4821dac2` / `cdb8e855-94e5-4ec8-955b-0f595bf62e2b`），包各 **9/9**（`editor-view-discovery-b4b617c4-689a-4cc1-b370-b53745ba769f` / `366f50b1-b009-4706-9cf5-cd065d0e67b4`）：侧pane六类型断线可发现、旧A/外部origin不能打开B、仅用户点击才写temp B manifest并产生精确原字节 before.bin/changeId，A未改；重试释放busy且不假connected。所有own host/core/wrapper退出。测试早期错误入口布局与DTO fixture失败保留在各temp目录；最终真实产品入口及诚实离线状态没有以隐藏断言或伪造连接通过。

补充包 Scene/Game `node tests/editor-preview-e2e.mjs --packaged --agent ...cli-phase6-guarded-20261001-03/gamecowork.exe` **14/14**，报告 `tests/editor-bridge-preview-ebe03dbf-d8c3-46f9-9557-0a8c6aaea2c9`，实际Scene相机滚轮变化、Game OnGUI点击、双路新像素、精确布局/stop/shutdown及零外部/页面错误通过，own Editor58656/Host25196退出。首轮 `726e0dbd-7892-40c9-8423-de6b7477767a` 在6/14后wheel超时：旧driver点全canvas中心，默认六槽中该点实际落Scene黑边，input请求为0。仅测试改为读取当前显示帧的signed instanceId/epoch/revision、native slot rect与contentRect定位ROI，保留原相机/OnGUI效果断言，并在 rpc.json 留两次 inputGeometries；产品包未变的复验有5次真实input请求。没有为通过而放松黑边保护或修改用户相机。

正式日常 **app 已原位更新1184资源**：`builtAtUtc=2026-10-01T13:08:11.2086369Z`、revision2770113 dirty=true，资源SHA mismatches=[]，normal CLI Boolean guard=false。命令 `tools/build-local.ps1 -SkipTests -CliPackageDirectory ...cli-phase6-normal-20261001-01` 成功；SkipTests前已完成本轮门禁，产品CLI来源/entry/executable均仍由脚本核验。build/旧二进制在 `temp/GameCowork/build/bce638dc075d425bb54c2748f906e7c6`，日志 `unity-connectors-build-20261001.log`、完整性 `unity-connectors-package-integrity-20261001.json`；包未含原native DLL/guard，没有Git提交/推送。保留另一聊天品牌/版本选择与Core/Rust/C#改动，不重复装配旧包。

以上产物路径均位于 `temp/GameCowork/`；用户操作步骤见 [UNITY_INTEGRATION.md](restored/UNITY_INTEGRATION.md) 的“当前 GameCowork 的连接与视图入口”。音频、WebRTC、远程及用户工程本身的编译问题仍有独立边界。

### 研究增量吸收：模板详情、索引代际和历史清空（2026-10-01，13:03 heartbeat，源码已验证）

先检查正确工作树并保留WIP，研究基线从555文件/80,990,679字节增至565文件/81,062,067字节：新增api五专题+manifest、index-and-templates三专题+manifest，共10新文件；README/REVERSE-PLAN/shell-logic commands三个文件修改、无删除。SHA快照 `temp/GameCowork/research-watch/baseline-20261001T130520Z.json`，两新增manifest的8篇文档全部SHA一致。api来源是维护副本handler精读，与原载荷同源但不是本轮原EXE字节证明；template源码证据来自Unity Hub asar，不能概括为原Codely全实现。全程未运行原EXE/CLI/DLL、读账号许可或调用真实Provider。

本次按真实消费者补三处基本闭环，没有重复建系统：

- 模板详情：Rust catalog只给基本字段，两代原ho页面直接读缺失packages/buildPlatforms的length/map。现在packages只由真实package.json.dependencies生成name/packageName/version，真实空对象为空数组，缺失/损坏则null；size来自压缩归档字节，未知buildPlatforms/renderPipeline显示“未提供”。创建/取消/选择身份不改。全Rust89/89包含新模板2项和索引1项；详情/品牌/安装契约44/44，实际Unity/current与Tuanjie/previous的真实本机tgz→Rust→GUI详情各9/9（`temp/GameCowork/template-details-source-unity-current-04`、`template-details-source-tuanjie-previous-04`），systemtar读真实6依赖逐项核对、关/重开正常、归档未写、自有host/Core退出。报告完整保留headless/fixture的history markAsRead未支持和pending-update真实501边界，未将全app updater当详情scope通过；早期driver映射/全console错误归类失败保留。
- 索引代际：worker实际status给indexPath，Rust丢掉，Sidebar却依赖publishedIndexPath改变清已开VFS缓存。现在透传该真实发布路径以及schemaVersion/protocolVersion/pendingEntries/indexMtimeMs，缺失值保null、不造代际。`tests/insight-e2e.mjs`新增已打开material内容→改真实文件→强制实际SQLite重建→不同publishedIndexPath→原面板自动重新取内容，无关/重开，完整source23/23（`temp/GameCowork/insight-generation-heartbeat-source-01`，`generation-cache-evidence.json`），跨worker/host恢复也通过，外部请求0、ownPIDs全退出。
- history/clear：原handler未await删除并先删后异步停止ACP，会让checkpoint写入/删除错误与success回执竞争。两Core入口现在clear-only strict停止/park→关闭已初始化或初始化中的SQLite→await真实删除→清usage/广播/返回cleared:true；checkpoint、shutdown、init、close、删除失败拒绝，仍完成必要process cleanup，physical shutdown失败保留对应owner供retry，其他旧caller默认行为保留。新32项actual-extracted async/own-temp删除契约、既有host errors12、语法check通过；实际Shell→SourceCore→guard03 Agent+loopback模拟模型13/13（`temp/GameCowork/session-history-clear-dafc7291-6d8d-48e6-a62f-c6f7ce871a37/report.json`）：A真实ACP退出码0、A空且冷重启旧SID不复生，B进程/回复历史保留，外站请求0、全ownPIDs退出。此不是跨未来GUI save的完整历史事务，也未跑GUI/包clear验收。源码范围审计 `temp/GameCowork/history-clear-completion-20261001.json` 确认其他editor/permission/连接器函数字节未覆盖。首次integration冷重启driver旧origin错误保留，新run只修per-launch采样后重跑。

Root联合受影响契约98/98通过；`verify-local`纳入frontend-template-details/core-history-clear两gate。本轮生产冻结SHA：insight.rs 1B4C5ABB75764FD2B4F8CA189B3AB6180692F33A992C1466BB8ADC2AE0D080DD；project_templates.rs 2E1F18058CEA9A54FB763B1908DC0EAFDB5D63D0327DB6667770A994669C9110；Core index.js 79CE13EF4FF811C813863564DF5E1DC72EEE675CA92B65DFDE9D9460884B47A5、beautified 98622B75A7B217899F95DFF9EE1E44953F7C0E4F024188CB4DC939CEA07C9055。

研究结论纠偏：默认insight目录为空不证明从未持久化，实际设置是settings.json、默认true且不自动写设置；已有真实恢复gate。编辑器列表已有60秒内存缓存，非完全无缓存；模板已有displayName/description；stdio query取消与TCP abort不同。context文档8工具目录不等于实际CLI14工具注册；unity/refresh是连接检测，不能改成会stop play的编译。待后续精确scope：CLI UnityConsole上下文失败被包装成功/缺真正诊断正文、rewind失败回执、allowlist重载完成回执、warm reopen停机变更同步与stdio查询取消，未在本轮冒称解决或直接调真实OAuth/反馈服务。

协同聊天已交付1184包（13:08）并正按新用户大屏截图修receiver尺寸/DPI和常驻入口。本轮不碰其windowBridge/imageframes、index/VscTheme/Sidebar连接器函数，不build/终止用户正运行的app。以上三修当前为源码验证，尚未装配；已在本聊天正常记录告知Core/Rust/模板段稳定，待其完成尺寸验证后统一候选/正式打包，保留1184成果和本轮修复。当前包版本、截图和运行状态仍以该聊天独立章节为准。

### 编辑器品牌图标与团结版本优先展示（2026-10-01，用户最新要求）

两代安装卡、新建工程的已安装下拉和选择编辑器弹窗使用现有真实 `icons/unity.png` / `icons/tuanjie.png`（单Unity三向cube / 团结六cube环），不将GameCowork图标充当团结。团结主号是明确营销版本，技术版本在旁边SMALL 11px，主号14px；Unity主自身技术版本。未知营销元数据只显示技术号并说明缺信息，不按版本范围猜1.x。

根因已在真实只读扫描找到：原Core `jba` 仅读 `%APPDATA%/TuanjieHub/versionMapping.json`，本机公开文件实际是 `versionMapping.json.json`（1569字节、SHA97A217403AC58A88BB77EE53A3348771DBEAFA5BF6B79E6DDE335F31E005A48E），明确38t2→1.3.2、62t16→1.10.4。原Editor EXE PE仅技术号；62t16卸载器PE营销描述仅作独立互证，未运行。两份Core入口定向兼容canonical→双扩展、1MiB界限和技术key纯字符串映射；保留现有扫描器，未修改Hub文件。Rust DTO保version/editorVersion/technicalVersion/unityVersion技术身份，marketingVersion/tuanjieVersion明确可空，displayVersion/semver用于展示，拒绝技术fallback伪装营销版本。

本轮全Rust86/86；实际提取Core映射4/4、启动选择20/20、双前端34/34总58/58。源synthetic展示矩阵各7/7，进一步真实选择弹窗同技版同架构选择第二引擎+现有转换确认+实际Rust→fixtureCore字段路径各9/9（`editor-presentation/source-selection-{current,previous}-01`）；此仅证明请求边界，没假称真启动Editor。原same-version 19项workflow已更新营销fixture独立于技术/PE并通过 `source-same-version-workflow-01`。源真实Core+GUI两代各14/14（`editor-installations/real-core-source-marketing-{current,previous}-01`），真正扫描Unity8/Tuanjie2，主1.3.2+small Unity2022.3.38t2、主1.10.4+Unity2022.3.62t16，PNG实际解码24×24；私人Hub工程/registry请求被阻断、public metadata前后hash一致，ownPIDs退出。

还修复了原选择modal以version-architecture共值的P1遗留：qt本地radio/Reactkey按product+exe，第三参数携精确identity；P/Qe同版本捷径也验证引擎/已绑定路径，不再把第二项解析为首项；跨引擎保持原确认流程。Rust tjhub/openProject把product/editorPath/architecture传实际Core，Core从已扫描候选按技术版本+引擎+精确路径选择，未知path/错engine/营销版本当technical均拒绝；默认引擎按真实ProjectVersion元数据确定，仍保已有打开编辑器的focus和独立host launcher。实际Rust HTTP整gate15/15（`audit-phase6-20261001/editor-selection-shell-http-02.log`）核字段不会剥掉，隔离fixture不执行安装/Editor。首轮新增test错误复用了父套件注册状态并读错invoke envelope，已隔离自身server并修正frame shape后完整重跑，无业务失败被隐藏。

最新正式app仍1183资源，于`2026-10-01T12:53:24.8143695Z`原位装配，build/旧二进制 `temp/GameCowork/build/071eb921b50f4a37b76f30580f3b7249`，日志 `audit-phase6-20261001/build-editor-brand-selection-final.log`。资源SHA全部匹配，normal CLI Boolean guard=false/sourceA0，revision2770113 dirty=true，未提交/推送。12:20通用窗口包与12:43品牌首次包是历史中间检查点；当前包内新品牌/真扫描/完整GUI gate正复验，下面旧包15项MCP等事实保留对应时间和范围。

12:53最终包验收：真实Core扫描两代各14/14（`editor-installations/real-core-package-marketing-{current,previous}-final01`），真实Unity8/Tuanjie2、营销/技术双号及不同PNG，public config哈希不变、ownPID退出。两代synthetic版本/精确选择GUI各9/9（`editor-presentation/packaged-selection-{current,previous}-final-01`），实际选择第二同tech/arch候选后frontend→Rust→fixtureCore全tuple一致，无真正Editor启动；同版完整安装面板workflow19/19（`packaged-same-version-workflow-final-01`）。完整主产品实际Editor包gate Unity/previous、Tuanjie/current各13/13（`tests/editor-bridge-generic-product-packaged-unity-previous-final01`、`editor-bridge-generic-product-packaged-tuanjie-current-final01`），restore只读当前已显示exact两slot/新epoch/descriptor，实际input均200、Beta真实serialized属性改变、工作区关闭后捕获回收；只有同closed-root且close时间后的Git notopen边界错误被明确允许，其余API错误须失败。最终全部1183 SHA再次匹配（`audit-phase6-20261001/editor-brand-selection-final-integrity.json`）。

旧Scene/Game输入回归source smoke9/9（含4个真实游戏键语义）、multistream6/6、basiccontrols15/15通过，汇总 `temp/GameCowork/source-editor-regression-20261001-gitloop.json`。真实Play Mode OnGUI收到LeftControl/Backspace(带ctrl)及A(character97)各down/up，共3+3，held为空；仅自己的fixture显式禁reload保stream以独立查键，controls另有正常play/stop/refresh重载。前置fixture失败的缺JSONmodule、EditMode无runtime键、Unity枚举keyUp旧别名和unsupported错误文本均留证，不改生产或把HTTP200当键语义。

跨聊天协调：用户另行授权的「优化 Unity 连接器并更新进度」正在修改source连接状态、Unity卡片/六类视图入口，保留本轮C#/Rust/Core/品牌/精确选择成果，由其完成后统一最后装配。本聊天已freeze，不再覆盖其Main/VscTheme/projectMenuFlows/Sidebar新增入口或重复build；其新章节单独维护。本轮补充packaged backend/receiver23尚未启动，因另一聊天实际Editor门禁占用主动排队；源码双引擎23与当前包完整产品13×2已分别留证，未冒称补充23包gate已通过。当前12:53包不含协同聊天尚未装配的连接器新入口。

### 增量研究吸收与完整窗口输入闭环（2026-10-01，1183包验收中）

正式app已于`2026-10-01T12:20:05.0514657Z`原位更新为**1183资源**，build/旧二进制 `temp/GameCowork/build/35ddfeca5af74533982c0bf9cffc90ee`，日志`audit-phase6-20261001/build-generic-window-app.log`，复核`generic-app-integrity.json` mismatches=[]；源码revision仍2770113 dirty=true，normal CLI Boolean guard=false/sourceA0，包无原NativeWindowBridge/NativeBrowser/datachannel DLL。两代包安装面板各19/19（`editor-installations/packaged-{current,previous}-generic-01`），两代包stdioMCP含actual50ms focus probe各15/15（`mcp-focus/packaged-current-generic-focus15-01`、`packaged-previous-generic-01`）；browser/RPC/guard/external0、28个stdio ownPID均退出。包真实Monaco菜单激活8/8（`tests/monaco-menu-f85c2953-a0b0-4a2d-9ebe-c0f71d4451cf`）。新包完整GUI、legacy Scene/Game及实际键盘验收仍在进行，尚不从装配哈希推定全部通过。

主产品源码闭环已独立通过：Unity/current、Tuanjie/previous各13/13（`tests/editor-bridge-generic-product-source-unity-current-04`、`editor-bridge-generic-product-source-tuanjie-previous-01`），真实Sidebar→Rust/Core→own Editor→WindowBridge，actualView-bound行/Inspector控制坐标、已显示Beta行witness、单次实际click选择Beta、serialized ApplyModifiedProperties仅改Beta、close-save到真实磁盘保留mode/root/key、reopen两槽和close-workspace回收。ownPIDs退出，页面/外部请求为0；关闭后晚到findGitRepositories的WorkspaceNotOpen保留，不把它隐藏成整段零API错误。早期driver failure01（场景折叠）、02（错误期待未关闭就autosave）、03（未绑定已显示frame/witness且缺input观测）均保留；03旧失败的精确原因未有足够证据定为生产故障，不冒称已反证。加强后的包gate按当前已显示slot/新epoch检查restore并精确限定闭根错误。

用户要求持续吸收增长中的 `codelyreversebackup`。已创建本聊天每小时静默检查的 heartbeat（automationId=`gamecowork`），仅有实质变化/故障/完成/需用户输入时通知；基线 `temp/GameCowork/research-watch/baseline-20261001T114430Z.json` 记录555文件、80,990,679字节的相对路径/大小/SHA256，首次基线不冒称本轮新增555文件。阅读T1-T4新增专题，仍以具体源码或可重复实际行为核验研究建议；字符串级“已对齐”“通用转发”及压缩载荷增长不能直接证明本工程功能完成。研究资产保持只读，原程序/CLI/native DLL没有运行或加载，未触碰账号许可数据。

实现路线是原提取前端/Core/CLI的可读逻辑定向修复 + 自研Rust宿主适配 + 对照完整原桥C#的 own EditorWindow host。不是重新画编辑器HTML，亦未把原版EXE或NativeWindowBridge.dll改名纳入包。当前 `GenericWindowHost` 通过真实GUIView.GrabPixels取得完整窗口toolbar、实际DPI和内容坐标，动态解析具体EditorWindow；旧17项检查已扩为23项，Unity/Tuanjie本轮各23/23真实backend+WindowBridge通过（`tests/editor-bridge-generic-e2e-0b1bf29c-6b83-4ca0-b5f4-20a9aaec3403`、`editor-bridge-generic-e2e-bfb0df08-7129-4ffc-a76e-b49f19a906ed`），own Editor均退出。GenericWindowHost SHA `51AAA23272889A491854F0CBEE8A05518147FEC9B4C0B0C2C9000621CF41F10F`；此后只清理公开stale错误的debug mapping文字，EditorCapture最终SHA `1A37B24D998A5973F18F2A21F417E79B26AAB7B5C4A5AF5844694E32BAA4A8C3`且实际assemblies离线compile2/2通过。Unity receiver之后HTML补debounced-keyup代次/计时器归属保护，Tuanjie用后续HTML；键时序契约与待跑新pack gate单独留证。

本轮吸收研究后进一步与可执行源码互证：`unity-shell-side.md`的cowork.vfs_*“编辑器管道侧”只是Rust字符串邻接推断；现有`cli-unity-insight/bundle/unity-insight-cli.js`实际分发5个cowork.vfs_*，`shell/src/insight.rs`和`main.rs`已有own worker操作/URL，不向EditorBridge重复加VFS或vfs-path-search。原`editor/setEmbedMode`在CodelyIpcServer/CodelyWindow是聊天WebView嵌入/脱离Unity的方向，与Inspector预览是两个功能；own getSidechat尚为false，保持缺口。原recompile仅Assets/Refresh及ForceUpdate fallback，可对照现有等待完成的refresh状态机，不重建异步空回包。Hub原始52注册表的editor族实际3、install族10，研究正文标题数和entitlements.get/project.museum不一致；这是注册/字符串面，不能当参数响应全逻辑或把模板创建冒称Editor安装。process_killer的FileDescription启发式不移植为按名杀用户Editor；压缩core体积翻倍也不证明MCP/LSP迁移或“一半功能”语义。后续以当前decoded handler和实际gate核验。

输入复核发现并修复streamId复用/旧浏览器JPEG几何错配：每capture有唯一32hex `captureEpoch`，仅在输入映射几何变化时递增 `geometryRevision`，携带真实有符号`instanceId`；三者从成功帧headers到实际receiver，再到main-thread执行时重新校验。普通frameId递增不使正常输入失效。完整GUI几何须成功capture/encode后提交，失败帧不能提前改输入映射；目标真实窗口关闭须回收capture/input lease/私有texture，轮询不能永久占六窗口额度。缺身份旧客户端明确拒绝，own legacy Scene/Game与完整GUI一并升级。

两代Sidebar已保留captureMode到请求/布局保存/重开；Rust布局继承tab mode并拒绝冲突，丢弃临时instance/epoch/revision；invalid窗口切换选项在改变当前代次/目标前拒绝。实际receiver契约2/2、路由生命周期10/10、两代布局8/8；Rust本轮85/85及debug build通过。本轮完整 `tools/verify-local.ps1 -SkipBrowser` exit0（`audit-phase6-20261001/verify-generic-source-backend-02.log`），包含Rust/源码契约/实际HTTP/进程回收/终端/Git15及LSP后端12、runtime状态7；该命令明确未跑浏览器/实际Editor，不冒称完整GUI gate。首轮仅FitRect提取测试的DrawFit访问修饰符定位旧marker失败，修为当前actual方法定位后重跑，无放宽数值断言。主Sidebar/Rust/Core完整实际编辑器闭环和新app包gate尚待完成，不能从standalone receiver结论推定。

另两处原UI问题已定位：MCP名称污染是common dialog原50ms延迟focus/select在用户已选择argv后抢回name，实际submit name/argv解析本身保留；两代helper按modal/message/ref与用户focus/typing/selection意图取消旧timer，源实际stdioGUI各15项通过（`mcp-focus/source-current-fixed-01`、`source-previous-fixed-02`），本轮精确focus/args/approval/custom契约50/50，包MCP待下一装配复验。previous代Agent permission selector误读deviceID改为实际permission向量，device getter按真实调用点退出本地模式。

LSP context-menu根因是原Monaco鼠标执行mouseup handler由100ms scheduler延后绑定，label可见不等于handler已就绪；保留原界面与真实点击，在gate读取真实handler就绪后操作，没有改生产LSP或增加超时。源与1179包的真实C#语义/导航完整gate均20/20（`tests/lsp-e2e-a9a3f727-123e-468e-a315-1be2267dec71`、`tests/lsp-e2e-03621b14-2b43-4cc6-a320-34d90ee2f4ec`）。两代实际Monaco controlled clock的99/100ms行为契约源8/8、包8/8；本轮源复验8/8 `tests/monaco-menu-bb98820b-29e2-4e7a-a191-b17c62727838`，仅证明菜单激活，不能替代真实LSP语义gate。已加入verify-local。

### 已安装 Editor 面板修复与当前交付（2026-10-01）

用户截图中 `Cannot read properties of undefined (reading 'length')` 在旧 app 与源码基线均实际复现：安装卡片沿原UI读 `location.length`，host的tjhub/getEditors却只投影version/path等字段，丢location、buildPlatformShortNames、modules。新增 `shell/src/editor_installations.rs` 只适配现有 Core扫描结果，不重做一套扫描器；location为真实EXE数组、folderPath为其父目录，模块来自安装root/modules.json，平台由selected顶级模块和实际PlaybackEngines目录得到；缺少/损坏metadata显式标记，不伪造模块。registered技术version保留选择映射，缺团结1.x展示映射则fallback实际技术version。当前仅发现/定位本机安装，未接通的下载安装、模块变更和移除明确禁用；不修改官方Hub或安装文件。

两代原TJHubRoute补旧row保护、真实扫描错误banner/retry/latest-only、稳定product/path key，以及同版本异引擎count/ViewProjects身份；父页project projection必须保留product/editor绑定，真实E2E发现遗漏后定向修正。最终前端actual契约20/20、Rust83/83；两代源码和装配界面各19/19，报告 `temp/GameCowork/editor-installations/source-{current,previous}-fixed-03` / `packaged-{current,previous}-final01`。same-version是明确的隔离DTO兼容矩阵，不冒称真实PE版本相同。没有改错误断言为假空列表。

另用实际 `app/core/index.js` 和 Node runtime 的只读隔离扫描，两代实际GUI各12/12，**Unity8+Tuanjie2共10套真实安装**，getEditors成功回包未模拟；报告 `temp/GameCowork/editor-installations/real-core-{current,previous}-01`，截图/actual-editors.json保留。private registry/favoriteProjects与个人项目界面请求均明确阻断，公开Hub编辑器配置SHA前后不变；网络/Provider/Agent/Editor/许可写入为零，自有进程退出。已知Core注册目录2021.3.19f1与PE技术版本2021.3.19f1c1差异保留，未片面改选择键导致模板错配。

`build-local.ps1 -SkipTests -CliPackageDirectory ...cli-phase6-normal-20261001-01` 已原位更新正式app，**1179资源全部SHA匹配**，builtAtUtc=`2026-10-01T10:40:34.3266275Z`、sourceRevision=`2770113dd065d00f3fa238836b126ef94ab955cf`、dirty=true；构建/旧二进制 `temp/GameCowork/build/b0f8ee72d365418e8635860c12a1c8e0`，日志`audit-phase6-20261001/build-editor-installations.log`。正常CLI Boolean guard=false，维护SHA A0AA3A84959DD6E354273279DB550EE17B755E36921ACFCD14E70EFF478AAD95。没有提交或推送本轮WIP。包Core54/54、HTTP chat36/36通过；安装面板包19/19×2及真实扫描12/12×2通过。

本包其它新增能力保持准确边界：LSP资源状态7/7、实际Unity经典工程语义6/6通过，但正式GUI完整gate在12/20后context定义导航偶发超时（`tests/lsp-e2e-3c5aa4f0-9aab-4b43-8b26-dea720f17d48`）；两轮temp观察副本20成功只是对照，根因仍未确定（`lsp-menu-observer-7fbb0e18fee647b9a60120341ab60ecb/package1179-report.json`）。packaged stdio MCP在首次创建后等owned-stdio row超时，实际列表名字成为argv JSON，待单独定位；`audit-phase6-20261001/packaged-stdio-final.log` 与`custom-management-e2e-07ea1a4a-7c13-4c8b-b68b-ef8cf2d6418f`保留，不能将源13项当包内通过。通用原生窗口主线尚未实施，不能把安装面板修复当全目标完成。

### 反编译参考库 T1：cowork.exe 壳逻辑还原（2026-10-01，codelyreversebackup）

按 [codelyreversebackup/REVERSE-PLAN.md](codelyreversebackup/REVERSE-PLAN.md) 完成 T1（原版壳 Rust 逻辑静态还原；用户已转入自主定制，本轮只产出参考文档，不修改壳/前端/core/app 任何代码）。方法：带字节偏移的双编码字符串提取（tools/extract-reverse-shell.py）+ 模块/命令/关键词窗口分析（tools/analyze-shell.py），全程未运行原 EXE、未读取账号许可数据。产出在 `codelyreversebackup/shell-logic/`（成品 6 文档 + 68 模块原始窗口转储 + raw 证据 + `_EXTRACT-MANIFEST.json` 92 文件），关键结论：

- 壳共 68 个自有 Rust 模块（此前侦察为 52）：LSP 9 模块、messages 14 域、unity 5、app 13。多通道并存：主 GUI 走 SSE（每窗口缓冲+replay）、core 备用 TCP、许可 Hub 走**匿名管道 stdio JSON-RPC**（`HUB_PIPE_HANDLE`/`HUB_COWORK_TOKEN`，方法表 8 条：auth.setToken/setCoworkToken、project.getRecent/getSizes、editor.available、devops.getOrganizations/getRepositories、system.shutdown）、Unity 走 `\\.\pipe\` 命名管道（消息含 `cowork.vfs_refs/vfs_children/vfs_entry`）。
- 91 条壳独有 invoke 消息逐条定论（commands.md）：30+ 条 `shell/*`、`unity-window/*` 等在原版壳字符串级不存在（通用转发，SSE 广播同构即可）；tjhub/tauri/pet/drill/editor/update 等拿到参数级契约（含 `tauri/listRemoteWorkspaces` 的 `/api/v1/frp/remote-workspaces`、`excludeSelf`、tunnels/machines/workspaceAliases 响应）。
- 隧道/远程（tunnel-remote.md）：Rust 自实现 frp（timestamp/privilege_key/proxy_name 登录、run_id 回执、IV 帧加密、heartbeat 看门狗），机器身份 `codely-machine:v2` 双 ID+aliases；手机端聚合（sessions 分页/archived|active|pinned）+ `/api/push/notify` 离线队列。
- LSP（lsp-subsystem.md）：内置 server 表 python→basedpyright、csharp→codely-unity-lsp-server（Node+dotnet8）、typescript→vtsls；扩展经 `gemini-extension.json` 注入；生命周期 120s 超时/崩溃恢复上限/shutdown→exit/Content-Length 错误链；前端 12 条 lsp/* 映射。
- 桌面（desktop-shell.md）：单实例 `.codely.lock(.meta.json)`（pid+http_port）+ `/api/tauri/status|focus-window` 心跳/焦点；更新 stable|canary 状态机（pending 四态校验）；WinRT Toast Accept/Reject XML；CoreHealth restart_attempts。
- 登录（tjhub-api.md）：设备码 + Unity token 交换 `auth/exchange-with-unity-token`；token 键沿用 `Continue*` 命名；控制面 URL 组含生产/测试/预发；agent TOML 模板（max_turns/timeout_mins/input_schema）原文截获。

复用注意：原版 frp token、控制面地址、许可文件值均为原厂服务凭据面，自研必须替换；T2/T3/T4 已随后续轮次完成（见下节），REVERSE-PLAN 全部任务闭环。

### 反编译参考库 T2-T4：许可客户端 / Hub 本体 / 新旧差分（2026-10-01，codelyreversebackup）

**T2 hub-licensing/**（ilspycmd 全量反编译 .NET 8 业务程序集，原始 C# 留 temp 不入库）：Ipc.dll 协议版本 1.13、**`\f`(0x0C) 分帧 + camelCase JSON + messageType 判别**、命名管道 `Tuanjie-LicenseClient-{user}`(+`-notifications` 通知通道)、42 个 messageType 字段级还原（Entitlements/UpdateLicense(V2)/ReturnEntitlementGroup(V2)/GetSeats/ActivationManagement/Borrow/ULF/Alf/Import 等）、IpcResponseCode（HTTP 风格+1500/2000/2001）、三种服务端通知（LicenseExpired/OfflineValidityEnding/Update）；CLIENT-SURFACE 含 41 个 CLI 选项、19 个 Controller、`Tuanjie_lic.ulf`（XML+XMLDSig）与目录布局（TUANJIE_COMMON_DIR 等）、Genesis 云路由（core/license/activation/identity.tuanjie.cn）；TYPES.md 自动生成 486 个公共类型清单。

**T3 hub-installer/**（tuanjie.exe 102MB 静态分析）：确认 **Hub 本体是 Bun 单文件 EXE**（bun:ffi 写继承管道句柄），壳拉起的 hub process 就是它（已修正 tjhub-api.md 腿 A 归属）；**52 个 `$.register(...)` JSON-RPC 方法全表**（system/auth/settings/project16/editor4/install9/license8+entitlements/devops/livePush）并与前端 tjhub/* 命令逐一映射——这是壳内实现 tjhub 数据面的完整契约；JSON-RPC 2.0 标准错误码 + auth.setToken 日志脱敏 + LSP 式 Content-Length 分帧兼容；清单格式沿用 Unity Hub（editors-v2/releases.json/modules.json）；process_killer.exe 按**版本资源 FileDescription**（5 个产品名）+`CODELY_INSTALL_DIR` 查杀；VisualStudioInstallChecker 检测 VS Community/Professional/Enterprise 且恰需 2 参数；`.tuanjie-cowork-install`=渠道 ID（本机 dev.codelycowork.desktop）；v2c=Sentinel vendor 36049 更新文件（仅结构描述，不含许可值）。

**T4 diff/**：壳 2.1.3-canary.1→canary.2 实质增量=LSP 前端消息族补全、editor/recompile+setEmbedMode+getSidechat、pet 文件预览族（showFilePreview/hideFilePreview/menuBlur/openSettings/ready/getPendingQueue）、壳 HTTP 新端点 `/api/tauri/file-explorer`（+unity 文件图标体系）与 `/api/tauri/unity-insight/vfs-path-search`、远程账号桥一致性校验、tauri-plugin-updater 2.10.0；壳 68 模块架构 canary.1 已定型。**core 同版本号下 pkg 载荷 15,787,839→32,586,083 B（翻倍）**——字符串级不可见（压缩载荷），如需内容级还原可后续对新 core 跑 pkg-unpack。4 个过滤差分清单入库。

T5 收尾：MESSAGE-LAYERS.md 顶部已加后续结论回填块（??无持有=通用转发、tjhub↔Hub 52 方法映射、各专题文档指针）；codelyreversebackup/README 资产索引与 REVERSE-PLAN 验收清单全部勾选。四个产出目录（shell-logic/hub-licensing/hub-installer/diff）均带 _EXTRACT-MANIFEST.json（源文件 SHA256+方法+关键事实）。全程未运行原版 EXE/CLI、未读取账号许可数据、未修改 GameCowork 产品代码（tools/ 仅新增 extract-reverse-shell.py 与 analyze-shell.py 两个提取脚本）。

### 反编译参考库专项：索引持久化诊断 + 项目模板体系（2026-10-01，codelyreversebackup/index-and-templates）

用户两个痛点排查（只读诊断+逆向，未改产品代码）：

**问题 1（启动重扫）**：worker 持久化设计完整且支持暖启动——`UNITY_INSIGHT_HOME\projects\{sha256(规范化工程路径)}` 内容寻址目录 + 代际库 `index.{uuid}.db` + `index.current` 指针原子切换（tmp+fsync+rename）+ 孤儿代际 GC + serve/index/global-build 三级锁；壳 `status()` 在 `index.current`/`index.db` 存在时不触发重建，暖启动只走 `index.sync`（全量 mtime 走查，`UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY` 可调）。**本机实证：`%LOCALAPPDATA%\GameCowork\insight` 存在但完全为空**（无 preferences.json/projects）→ 生产环境索引从未持久化落地，"每次重载"需按文档 §5 二分（先 UI 启用一次看 preferences.json 是否出现）；启动慢的另一实证根因是**编辑器列表无缓存**——`editor_installations.rs` 只适配 Core 每次启动的实时扫描快照（装多版本 Unity/团结的机器上就是慢），对照原版：Hub 持久 `installedEditorList` + `editors.changed` 事件推送、模板缓存按该事件失效（Unity Hub asar 中 `AVAILABLE_EDITORS_CHANGED`→`_filterStaleTemplatesCache` 同构）。

**问题 2（模板内置方式）**：完整还原 Unity Hub 模板管道（asar 全解包 3196 文件，关键区域 `src/main/services/unityTemplate/*`）并机器实证：**核心模板=随编辑器安装的 UPM tgz**（本机 `E:\TuanJieAllVersion\2022.3.62t16\Editor\Data\Resources\PackageManager\ProjectTemplates\`：cn.tuanjie.template.2d/3d/universal-2d 三个 tgz + libcache 忽略项），包内 `package/package.json`（name/displayName/version/type:template/unity/description/dependencies）+ **`package/ProjectData~/`（4963 项=预制工程本体，含预热 Library/Artifacts）**；Hub 三层合并（本地 READY + 已下载 `%APPDATA%\UnityHub\Templates\{name}-{ver}.tgz`+manifest.json 记账 + 远端 LivePlatformAPI graphql DOWNLOADABLE）按 semver；**创建时 Hub 不解包——委托 Editor（editorApp.createProject）由 UPM 物化 ProjectData~**；反向打包 `createTemplateFromProject` 六目录集（Assets/ProjectSettings/Packages/Library 三 DB）+删 ProjectVersion.txt+tar；兜底模板 code 0/1；路径长度预检（+53 余量）。GameCowork 补齐清单在 template-pipeline.md §4（元数据全字段/示例模板下载/反向打包/兜底/预检），红线：模板资产只读、解包进自有临时目录。

**全量遗漏审计**：`index-and-templates/GAPS-AUDIT.md` 按 ✅/🟡/❌ 汇总 T1-T5+专项全部结论（命令面/Hub 域/索引与编辑器列表/模板/桌面/远程），附按用户痛点排序的复刻优先级。Unity Hub asar 解包物留 temp 不入库；产出目录带 _EXTRACT-MANIFEST.json。

### 反编译参考库 T6-T10：core 业务域深挖（2026-10-01，codelyreversebackup）

按 [codelyreversebackup/REVERSE-PLAN.md](codelyreversebackup/REVERSE-PLAN.md) §6 完成第二轮：core 在第一轮只有索引级（1168 方法串），本轮用「108 个 RPC 前缀 × 347 条前端 invoke（有 UI 入口才算用户功能）× 全库文档 grep 反查」交叉定位出五个从未深挖的业务域，串行逐域精读 core/CLI/前端美化维护副本（与原版 codely-binary/dist 同源，事实均带文件行号）。产出 `codelyreversebackup/api/` 五篇文档 + `api/_EXTRACT-MANIFEST.json`（第二批 SHA256 清单），README 索引与 REVERSE-PLAN §6 已同步：

- **session-checkpoints.md（T6）**：会话检查点三层协议，此前零文档。`history/rewind` 支持 `dryRun` 预览/`code` 执行，预览结构（canRewind/changedFiles/totalLineAdded/fileDetails…）经 ACP 回包 `_meta.gamecowork.rewindPreview` 传递；CLI RewindService 快照落 `<historyDir>/snapshots/`、按用户消息记 `fileHistorySnapshots`（trackedFileBackups+changeSummary）；`/chat save` 触发 `checkpoint_save` 会话更新（收不到按旧 CLI 处理）；`history/fork` 产生 `<旧标题> (forked)` 新会话、id 由用户消息序号换算；另含 history 17 方法全表、draft/未读、conversation/compact（originalTokenCount/newTokenCount）、tabs 上报形状。
- **mcp-oauth-elicitation.md（T7）**：`config/addMcpServer` 实为 CLI 组装（stdio→`--env`、sse/http→`--header`、global→`--scope user`）；OAuth 仅 SSE/HTTP 传输，core 跑 `localhost:3000` 回调服、按 well-known 发现元数据、令牌存 `mcpOauthStorage[serverUrl]`、授权后同步 CLI 并重连，删除服务器先清 OAuth；**elicitation 在全部前端 chunk 零命中——原版只有 SDK 协议面无 UI**，复刻不得宣称完整 MCP 支持。
- **config-memory-allowlist.md（T8）**：orgs/profiles 每工作区记忆选择；分层记忆 `.gamecowork/GAMECOWORK.md`+`GAMECOWORK_SUMMARY.md`+`rules`/`assistants`（全局记忆仍有 `~/.continue/` 上游残留路径，复刻需收敛）；shell/MCP allowlist 是 **TOML 策略文件 `~/.gamecowork-cli/policies/auto-saved.toml`**（run_shell_command 前缀 / `server::tool` 白名单）；GameCoworkHome 三步迁移（探测→杀会话→迁移→改配置→envVarWarning）。
- **context-engine-and-unity-tools.md（T9）**：@ 上下文引擎 7 个内建 provider（file 前 1500 行/1MB/`N-> ` 行号前缀/二进制占位/排除目录三件）、repoMap tree-sitter 单例懒缓存、剪贴板贴图三方法；**core 内嵌 8 个 Unity Agent 工具 schema**（unity_editor 的 get_state/refresh/play/pause/resume/stop、unity_script 的 apply_text_edits、unity_package UPM 操作等，含审批三态文案与 `defaultToolPolicy:"allowedWithoutPermission"`）——是 editor-bridge-original 26 管理器的 core 侧对端，直接服务 HANDOFF P1「编辑器播放/暂停/写入」缺口；另记 unity/* RPC 面与 llm/* 直连模型域。
- **marketplace-feedback-walkthrough.md（T10）**：skills/extensions/marketplace 共用 `GET /api/marketplace`（attachment_map/author_map 归一化，extension 分发走 download_url 且 git_url 恒空）；installedList 本地合成三源合并；feedback submitReport 全字段（text/binaryFiles、unity|tuanjie editor.log、会话导出）与 project.zip「成功拿数字 id 后后台单例上传」状态机；walkthrough 独立窗口 = indexWalkthrough.html + 3 条 drill 消息 + 3 步骤；generator/listTasks 分页参数与本地模式 `supported:false` 降级回执。

复用边界：以上是原版实现事实参考，不是 GameCowork 功能完成；`~/.continue/`、OAuth 固定 3000 端口、市场/生成器控制面地址等原厂服务面自研必须替换。全程未运行原版 EXE/CLI、未读取账号许可数据、未修改 restored/ 与 app/ 现有代码。下轮候选（REVERSE-PLAN §6 遗留）：ide/* 云服务域取舍、extensions userEnvConfig 对话框 UX、unity/installMcpPackage 桥侧安装链路对照。

### 原 Native 架构纠偏（2026-10-01，静态分析进行中）

用户提供并已本地核对的提取库提交为 `2770113d`（当前 HEAD），与自研未提交 WIP 独立；保留全部未提交/未跟踪修改，没有 reset、checkout、提交或推送。已读取提取库 README、MESSAGE-LAYERS 与 domains-surface。347条调用面/91壳独有/72未命中作为逐域核验入口；字符串未命中本身不能证明所有状态请求都可广播，后续按 request/get/set/event 和实际 dispatcher/回包核实。

此前“其它窗口的原 C#/原生捕获未定位”和将 Scene/Game camera 帧作为扩展基础的判断不完整。用户指向的实际源码在 `codelyreversebackup/editor-bridge-original/Editor/Bridge/Native/`，含 NativeWindowBridgeHost 的 Composite/Cursor/DragAndDrop/PopupMenu/PopupDock/TabDrag/ObjectSelector/Panel/NewInputSystem 等 partial，以及 `Plugins/Win` 四类 native DLL。只读核对 `_EXTRACT-MANIFEST.json` **427 文件 SHA 全一致**；声明来源是已不存在的 `verify-project/Library/PackageCache/cn.tuanjie.codely.bridge@1.0.85`，不能把该声明当成当前 EXE 内嵌源文件的字节证明。

原安装与 original 镜像的 codely.exe SHA 均 `B54CF062537300CA71D459FDEDE81AA03ECC08449730BFB1CF5E1DCADAD3E44D`，cowork.exe SHA `55EA13A9707774DF61A707AC55179E94ABB9690583DE986C528DA056A69B8C3B`、版本 2.1.3-canary.2。原 CLI 可读 Bun 段真实包含桥目标 1.0.85、`cn.tuanjie.codely.bridge` 与 Git 安装源，版本指向与备份吻合；目前没有 NativeHost C#直接嵌入原EXE的证据。继续核对安装器、包依赖与 native ABI，不运行原程序/CLI或读取账号许可数据。

源码已证两条原生机制：NativeWindowBridgeHost.Composite 动态解析/创建真实 EditorWindow，在真实 DockArea/ContainerWindow/SplitView 组织布局；Host 统一 GUIView.GrabPixels 获取完整窗口含工具栏，managed readback/BGRA 经 NWB_PushFrame 交给 Windows 原生插件编码/WebRTC，输入经 DataChannel/native队列回真实GUIView，并覆盖菜单、拖拽、对象选择和输入系统。另 CodelyWindow 获取其真实 GUIView HWND，WebView2Host→NB_Create→NativeBrowser 的 WebView2 controller 将 Cowork 页面嵌入 Unity 窗口。不能把两条链混为“直接把所有Unity HWND挂到独立Cowork EXE”，也不能把原包 ANALYSIS 的“C#只交换JSON、native负责全部捕获”简化结论当真源。

当前 own Bridge.cs/EditorCapture 的 Scene/Game camera RenderTexture＋JPEG链路只证明先前最小子集，缺真实窗口布局、完整GUI捕获、popup/objectselector/tabdrag/DnD、新输入系统及原native transport分工。下一步以通用 EditorWindow host/完整GUI捕获与输入闭环为主线重新规划，既有修复冻结保留，日常 app 仍是第五阶段875资源包；源功能或静态架构发现不代表原产品动态验证或全窗口实现已经完成。

原版装载链已静态串起：CLI桥安装器写目标工程UPM依赖→Unity按Editor asmdef编译C#→NativeDllLoader/NWB Host加载Plugins/Win→Editor进程内NTB TCP与NWB HTTP/RTC→Core/ACP/CLI的manage_window_bridge→windowBridge页面的offscreen/composite/resize/signaling与DataChannel输入。NativeBrowser旁链通过工程路径派生named pipe、NativeIpcClient与Cowork/Tauri通信，WebView2 controller由真实GUIView HWND创建；不是另一个NativeHost EXE。PE静态报告 `temp/GameCowork/original-native-abi-aa6cbdedd77545e6ad1ef2642dd11a2c/NATIVE_ABI_REPORT.md` 及pe/abi-source JSON记录12 PE、25/17/7/19导出和PInvoke对应、SHA/传递依赖；NWB CPU BGRA PushFrame ABI明确，额外五导出未在managed包找到调用。NativeWindowBridge的C++源码未找到，NativeBrowser C++源码在包内；不直接改名分发原DLL，不把EXE import存在当动态调用证据。

下一次实施先做自有临时Unity/Tuanjie工程里的通用host最小闭环：真实Inspector/Hierarchy窗口、完整GUIView含工具栏捕获、尺寸/DPI/焦点与SendEvent输入；验证真实选择/属性变化、释放与重载后再接PopupMenu/ObjectSelector/DnD/TabDrag。纯C#ReadConsole/Scene/GameObject工具参考和26 Tools动作目录排在该通用宿主验证之后，完整native编码/RTC/音频独立验收。停止逐窗口白名单/camera假面板扩展；既有own身份/取消/工作区隔离继续作为必要边界。

上一阶段交接收尾已完成：HANDOFF 包含项目结构、已完成/待完成项、参考源码复用矩阵及继续验证命令。同步 README/AGENTS 和旧研究稿的当前说明，35 个本地链接检查无缺失，git diff --check 通过；该收尾未重跑长门禁或重装配，原 873 个资源重新核对无 SHA 差异，未提交源码与 temp 证据保留。

### 第五阶段：基本闭环装配与验收（2026-10-01）

已完整阅读交接与项目/Editor bridge 规范，检查正确 Git 工作树并保留所有已有修改。本阶段先完成真实 Tuanjie 及 Unity/Tuanjie 同 GUI 验收，同时补 Git/Diff、Commands/Subagents 和编辑器基本控制；后续未完成项仍由本文件管理。

| 本次实际验收 | 结果与证据 |
|---|---|
| 第四阶段装配版真实 Tuanjie 2022.3.62t16 单工程 | 18/18：Scene/Game 实际帧及输入、准确 engine/root/native `.scene`、原生停止、两槽保存恢复、程序集重载后输入、重载中关闭防复活，`temp/GameCowork/tests/editor-bridge-preview-9712f239-9df8-4ab6-99de-486d372a671e/result.json` |
| 第四阶段装配版同一 GUI 的 Unity＋Tuanjie | 14/14：两个真实 Editor PID/root、四槽动态画面、独立输入、等比黑边、聊天工程切换、布局恢复、A 重载/停止/关闭时 B 保持，`temp/GameCowork/tests/editor-bridge-multi-project-ea88713c-110c-4c1d-bbf9-8d6c42efc9ec/result.json`；各自 ProjectVersion 与 editor-A/B.log 保留真实版本 |
| 真实 Tuanjie 原始完整 3D 模板导入 | 退出 0：`SampleScene.scene`、Camera=1/Light=1、原 manifest/scene 字节保持，`temp/GameCowork/tests/template-editor-ba40236a-bca4-4551-bc47-352cfbb463a1/result.json` |

精确执行命令（均在项目根）：

```powershell
node tests/editor-preview-e2e.mjs --packaged --editor 'E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe' --engine tuanjie --editor-version 2022.3.62t16 --agent 'F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12/gamecowork.exe' --domain-reload --reload-close
node tests/editor-multi-project-ui.mjs --packaged --editor-b 'E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe' --agent 'F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12/gamecowork.exe'
node tests/project-template-editor.mjs --project 'F:/AI/AgentMake/temp/GameCowork/project-templates-e35e910b-9e8e-45d4-abd5-337d7a057ee6/Created Projects/Template 中文 Project' --cache 'F:/AI/AgentMake/temp/GameCowork/template-public-test-cache-20261001-02' --editor 'E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe'
```

单工程与双引擎浏览器/Core/Agent 外站尝试和 browser errors 为零；这与完整模板导入的网络边界不同。模板导入只允许自己的 hash-verified loopback 镜像，Tuanjie 许可/遥测客户端发起的外站请求由隔离代理实际阻断，没有激活/登录。镜像原来未处理 `/-/ping`，首次导入失败；补探测后第二轮编辑器生成了真实 receipt，但拒绝 CONNECT 的 socket reset 导致 Node 验收驱动退出，不能算完整门禁通过。补 socket 错误处理后的第三轮上述最终报告通过。没有删 manifest、停用 Package Manager 或伪装团结为 Unity；自有测试 Editor/host PID 已退出。

以上前三项是恢复任务初期对第四阶段 app 的新增真实验收；当时第五阶段尚未装配。第五阶段新能力进入日常 app 的证明见下方“本阶段源码闭环与装配”，不要将这三个旧包报告当作新 Git/自定义管理/控制能力的包内证明。

随后使用实际选定 Tuanjie Editor 准备独立公开依赖缓存 `temp/GameCowork/template-public-tuanjie-cache-20261001-01`，39 条依赖来源/哈希见 dependency-ledger.json。以该缓存再次运行相同完整模板命令（仅替换 `--cache`），最终报告 `temp/GameCowork/tests/template-editor-f402bf6b-762a-4ce5-bd0d-c4ee756edceb/result.json` 退出 0，Camera=1/Light=1、manifestPreserved=true/scenePreserved=true；测试驱动现包含 registry ping、拒绝 CONNECT 的 socket reset 处理及仅按 exact PID/project 校验的超时清理。这是最后一次该模板源码门禁，先前旧缓存的通过报告保留复核。

LSP 后续准备已核对本机 .NET SDK 10.0.103，并从公开 NuGet 源隔离安装 [csharp-ls 0.21.0](https://github.com/razzmatazz/csharp-language-server/releases/tag/0.21.0) 到 `temp/GameCowork/lsp-preparation-20261001-01/runtime`，298 个运行文件 SHA 与来源记录在同目录上层 dependency-ledger.json，`--version` 通过。这仅是公开依赖准备，尚未接入产品，也未证明 hover/definition/reference 或未保存文档同步；没有全局安装或使用私人 NuGet 源。

#### 本阶段源码闭环与装配（2026-10-01）

本阶段新增 `shell/src/git.rs`，在实际宿主接通本地分支、变更、HEAD/index Diff、暂存/取消暂存/丢弃及 Core `getDiff`。两代原 Git/Diff 界面同步接真实结果和错误；拒绝 dirty/conflict 分支切换、越界/外部 Git 元数据及自定义 filter。丢弃使用真实 Git 工作区字节转换和已有原子文件操作，保留版本/备份；并发第二/第三保存不被盲覆盖。真实 HTTP＋Chromium 20/20、Git Rust 4/4、文件操作回归 16/16；最终源码报告 `temp/GameCowork/tests/git-e2e-20f2fecd-bfa2-48d8-99ac-a08fe421ed59/report.json`。

Commands/Subagents 现支持项目/全局 TOML 创建、编辑、启停、改名、删除及重启恢复，携带 SHA 检查并限制目录/链接。CLI `computeMergedSettings` 补 `agents.disabled` 多 scope 并集，修复全局禁用被项目覆盖。当前/上一代原 GUI 各 15/15，实际 slash 展开进入 loopback 模型，保存的子代理系统提示经真实 issued-ID task 工具回到父会话；报告 `temp/GameCowork/commands-subagents/ui-current-07`、`ui-previous-01`。Typed command/subagent 更新避免重启其它工作区的整个 ACP 会话。

Editor 基本控制已接真实 play/pause/单帧与连续 resume/stop/refresh，主线程状态机跨域重载保存 operationId，原生 adapter 等实际 completed 状态再返回。两代 GUI 不再把被动状态回应当刷新完成、不提前显示 playing、不在刷新失败后偷偷继续 play。最终新 guard 的源码 Unity/Tuanjie 控制各 15/15，包括 Play/Stop 后真实 GameView 新帧恢复；源码报告 `temp/GameCowork/tests/editor-bridge-control-358c4cd1-7e3a-4fbe-bcc9-cdca77651d59`、`editor-bridge-control-9fac28c0-f32f-4db2-bd7f-e65c38919adc`。额外单工程重载各 18、双 Unity/mixed 单 GUI 各 14、实际独立流 6 与桥/浏览器 9 通过，统一日志 `temp/GameCowork/audit-phase5-20261001/verify-phase5-editor.log`。

集成验证发现并修复设置 Back 的旧 100ms 聊天 focus 抢走新控件焦点、关闭 Insight 菜单的竞态。两代定向契约 6/6，实际 Insight 22/22；最终焦点轨迹证据 `temp/GameCowork/commands-subagents/insight-focus-fixed-02`，无测试 sleep/重开菜单替代真实操作。维护输入保持 LF，前端请求契约最新 60/60。Rust 完整最新 76/76；实验 caption 契约 5/5。

集中 `verify-local -RealCore -Chat -Editor -AgentTestPackage ...cli-phase5-guarded-20261001-01 -TuanjieEditor ...Tuanjie.exe` 的三个尝试分别遇到 CRLF 源提取标记失败、上述旧 focus 竞态、一次 `acp/refreshCommands` 30s 启动延迟。前两项已修复并复核；第三项原失败保留在 `audit-phase5-20261001/verify-phase5-integrated.log`，**根因仍未定位，不能写成一次全门禁退出 0**。同源码失败 gate 单独 15/15、三轮真实 cold host/六会话 225 RPC 的 52 检查，以及六次真实 GUI new→gatherContext 并发刷新 16/16 均通过，无 timeout 重试。报告 `command-refresh-race-14440803-53c4-4344-9956-9af21bcf8a77`、`commands-subagents/gui-refresh-race-01`。本阶段其余 Core/聊天/文件/媒体/能力/索引门禁已在原集中日志通过，Editor 整段另外运行退出 0；不能掩盖原集中失败。

原生 Wry 检查实际观察到系统＋应用双标题栏，并验证旧模式的最大化/恢复及关闭。新增真实 WindowState UI-thread 查询、原生标题栏消息回退与最大化旧回复保护。Windows 自有 drag helper 用打包的坐标值绕过 Tao 0.30.8 的 LPARAM 指针问题；没有改第三方 registry。**默认仍保留系统 decorations**，实验无边框仅 `GAMECOWORK_FRAMELESS_WINDOW=1` / 测试 `--frameless`；其 caption 捕获只在受控 desktop/gui 文档启用，排除控件并去重。桌面鼠标输入冲突已停止原生输入并按 owner 清理自有 fixture；无边框真实拖动/resize/DPI/输入冲突尚未通过，不以 HTTP 200、VM 契约或编译代替验收。

本阶段通过 `tools/build-cli.ps1` 重新构建正常/测试包：`temp/GameCowork/cli-phase5-normal-20261001-01` 和 `cli-phase5-guarded-20261001-01`，维护 SHA `BDACB8A716CBB9F6244ACF1B5CFCCFC2F6B5D73A0A22347362CB768D6953D430`。`tools/build-local.ps1 -SkipTests -CliPackageDirectory ...cli-phase5-normal-20261001-01` 已退出 0，原位更新 `app`，**875 项运行资源 SHA 校验通过**；构建/旧二进制 `temp/GameCowork/build/d16b26fb37fc4f05bb4bb93318f8b2d7`，日志 `audit-phase5-20261001/build-phase5.log`。产品 guard Boolean false、正常入口/EXE 与 manifest 匹配；装配版专项复核见下表，不把源码报告代替包内证明。

装配版关键流程已完成：

| 实际 app / --packaged gate | 本次结果与 temp 报告 |
|---|---|
| Git/Diff 原界面 | 20/20，`tests/git-e2e-7309ad30-f7f4-43e6-8b53-90394e3d74a4/report.json` |
| Commands/Subagents＋真实 Agent＋GUI 并发刷新 | 16/16，`commands-subagents/packaged-phase5-01/command-subagent-report.json` |
| 实际 Core / HTTP 聊天 | 54/54、36/36，统一 `audit-phase5-20261001/packaged-core.log` / `packaged-chat.log`；聊天报告 `core-chat-0453eb9c-8b2c-4f96-9d3b-238b0298d6d3` |
| Insight 含返回后菜单/重启恢复 | 22/22，`insight-e2e-5bd70d7d-2492-4c0e-9360-a572962d3b77/summary.json` |
| Unity / Tuanjie 真实 GUI 基本控制与控制后出帧 | 各 15/15，`tests/editor-bridge-control-d28875a8-253b-445b-85e6-b8ea962c35a8`、`editor-bridge-control-5d12bb43-f6b3-419c-b6ca-2932e0874ec5` |
| 同 GUI Unity＋Tuanjie 四画面及生命周期 | 14/14，`tests/editor-bridge-multi-project-965df5ba-8b1b-40e6-b280-09ec193a2982/result.json`，附 engine-identities.json |

上述命令均显式 `--packaged`；涉及 Agent 用新同源码 `--agent ...cli-phase5-guarded-20261001-01/gamecowork.exe` 或 `--package`，Commands 增加 `--refresh-race`，团结控制与 mixed 分别传 `--editor` / `--editor-b E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe`。实际产物路径和 guard/normal SHA 在 driver 元数据核对；browser/Core/Agent 外站尝试与浏览器错误为零，预期重复/非法 TOML/SHA 冲突负例不当成成功操作。精确 gate 日志为 audit-phase5-20261001/packaged-*.log。本轮仍不是原生无边框手势、Agent Unity 完成/取消、LSP GUI、远程或完整 Editor UI 的验收。

全部上述 package gate 后再次核对 app/package-manifest.json：875 个资源 SHA 差异为 0，builtAtUtc=2026-10-01T07:23:47.6354875Z。维护文档 40 个本地相对链接无缺失，git diff --check 通过。没有提交/推送 GitHub、安装器或自动更新发布；日常入口仍为 app/启动GameCowork.bat。第六阶段新增维护源码暂不改变该日常包，后续按相同方法再次原位装配。

#### 第六阶段：产品接线与源码验收（尚未装配）

独立 C# LSP 真实前置 11/11，新增 Rust `lsp.rs` 最初通过自己的 temp Cargo harness：协议/UTF16 2/2、真实服务 21/21 及强杀宿主后的双 Job 回收。报告 `temp/GameCowork/tests/lsp-runtime-ed8ebb20-af0e-4af8-b699-dee495415507`、`lsp-service-9a4e5957-527f-46f5-8443-0063ed902845`。随后已接 main/Monaco，真实 HTTP＋Chromium **20/20**，`temp/GameCowork/tests/lsp-e2e-19682236-39cc-4cbc-ab0a-50311aa3b92a/report.json`：原 C# 按钮、hover/definition/reference、未保存内容、整桌面 wrapper F12/Shift+F12、A/B int/string 语义、冷重启、default 失败后恢复、readonly prefs 失败无 ghost、旧 close 与新文档版本、UNC 前置拒绝。使用 fixture Core，不调用模型；它证明原生 LSP/GUI 链路，不能替代真实 Core/Agent 回归。资源尚未装配，当前日常 app 仍是第五阶段。可信 runtime/ledger/AppData 配置及捕获 WorkspaceHandle，显式启用才启动，保持 URI/递增全文版本/UTF16、关闭代际和双工作区隔离；缺项目元数据时明确拒绝，不偷偷生成或联网 restore。

独立复审新增并修复关闭后立即重开、A 的迟到 toggle 污染 B、旧 generation 被重新贴到结果、UNC canonicalize 前边界、启停持久失败与慢 initial status 覆盖新 enabled 状态。两代真实提取 LSP 契约 6/6、生命周期 VM 10/10，桌面键盘 8/8。真实 Unity 经典工程＋UnityEngine Transform/Vector3 语义 **6/6**，`temp/GameCowork/tests/lsp-unity-5041eb82-a6e3-41fd-b721-c50caa50fb8d/report.json`；选定 Editor 的 IDE generator 实际生成 ToolsVersion 4.0/v4.7.1 元数据，没有 SDK surrogate 或 obj/assets，生成文件 SHA 保持；Editor 准备期间一次包源 CONNECT 被代理阻断，不能宣称全过程零外站尝试。

LSP 原失败证据保留：`lsp-e2e-47e70aac-*` 的 B sync 立即断言在异步回包前检查，`24ec9be3-*` 把切工程保留的 fullscreen 当未开启，均已按实际状态修 driver，并追加 B 真 string hover。`f02fa84f-*` 一次 context 定义导航超时未记录 provider 入口/RPC，**触发根因仍未确定**，未针对它修改产品 action；后续同 context 流程与 F12/Shift+F12 的 20 项实测通过，不能写成已证明原失败根因。

第五阶段装配与关键 package 流程通过后，已开始按这些接口接 LSP 的原生路由、Monaco 未保存文档同步、工作区/版本生命周期和公开 runtime 装配来源；同时开始修 Agent Unity 工具 pending/取消协议。本段只记录活动范围，尚无新产品完成声明，当前日常 app 仍是上述第五阶段 875 项包。

本轮新增 stdio MCP 基本闭环：两代表单用受控参数解析和 JSON 数组回填保留带空格 Windows 路径、空 argv 和字面值，非法 JSON/未闭合引号在写入前显示错误；允许有名字的空环境变量值。实际提取表单契约 8/8、限定 fixture 子进程 guard 契约 4/4。执行 `node tests/custom-management-e2e.mjs --mcp-only --stdio --agent F:/AI/AgentMake/temp/GameCowork/cli-phase6-guarded-20261001-03/gamecowork.exe --output F:/AI/AgentMake/temp/GameCowork/stdio-mcp-e2e-phase6-02`，真实 Rust/Core/编译 Agent/GUI **13/13**，覆盖实际批准/issued-ID 结果、拒绝时 server tools/call=0、环境、spaced exe/script argv、启停、改名、重启、删除与 exact 子进程回收，browser/network=0。报告 `temp/GameCowork/stdio-mcp-e2e-phase6-02/custom-report.json`；此前 guard02 的 12 项报告保留为初轮证据。测试 guard 只追加 own temp exe/script 的 SHA/argv/cwd 白名单，不允许任意命令；正常产品不含 guard。**这些是第六阶段 Source 流程，尚未进入当前 875 项 app，不能推导任意外部 MCP/OAuth 或全部 transport 都已验收。**

冻结 C# LSP 的源目录 `restored/lsp-csharp/` 与 298 项公开 runtime 闭包已经验证重定位；新增 LICENSE、来源 ledger、编译 pin 与叶 README，共 302 文件。ledger SHA 为 `AE2A0E7653886427DC42D55AB553AAEF90A0728E48D046E4E8CAA6752F5F7330`，资源契约 9/9、实际暂存路径双工作区语义前置 11/11；报告 `temp/GameCowork/lsp-resource-relocation-fb78a88b155044a0846dbc7ab4535cf6/report.json`。build-local 新增源/暂存完整性检查与未来 app/lsp-csharp 复制，当前并未再次正式装配；实际主路由/Monaco 接线仍在验收中。

实际 compiled Agent 的初轮 Unity 工具诊断 16 项发现 `pending:true/accepted` 被描述为成功，以及 queued play 取消后仍可能生效；原报告 `temp/GameCowork/tests/editor-bridge-cli-controls-4746ea67-0bc7-4d57-ad5d-a581cd76e33e/summary.json` 保留。现已修复 Agent 等待实际 completed/root/operationId、重载只读重连，以及桥端独立取消通道、请求身份/nonce/过期重放、排队与执行边界；取消已生效操作时诚实返回状态，不盲 stop 或假报回滚。自动联网 Wiki 改为缺少本地来源时明确不支持，最终 gate 不再排除此工具。

严格源码门禁 `cli-editor-controls-smoke.mjs --require-completed --require-cancel-no-effect --identity-gates` 在真实 Unity/Tuanjie 各 **26/26**；报告 `temp/GameCowork/tests/editor-bridge-cli-controls-5e0fb132-4b39-4147-b374-bf8e2e3d9ed0/summary.json`、`editor-bridge-cli-controls-f203a8c5-f0ac-4403-a9cd-072e737bc533/summary.json`。实际 GUI→Rust→Core→编译 Agent→Editor 的默认批准、拒绝、已排队操作 Stop Generation **7/7**，`tests/editor-bridge-agent-ui-ce01e57b-b4c7-45ca-9277-228b9d6c2207/result.json`；browser/外站 guard 尝试为零，自有进程退出。独立取消协议与真实 C# 状态机复核 7/7、12/12。最终维护 CLI SHA `A0AA3A84959DD6E354273279DB550EE17B755E36921ACFCD14E70EFF478AAD95`，同源 guard03 与 normal01 已重新编译；这些仍是源码报告，尚未写入日常 875 项 app。

下一阶段 Editor 查询前置 `editor-queries-preflight.mjs` 在自己的真实 Unity 工程 **30/30**，报告 `temp/GameCowork/tests/editor-bridge-queries-9f9cfd58-976a-447f-b1d8-1e10d039e224/summary.json`，自有 Editor/CLI 均退出。核对实际 guard03 的 35 个工具，`unity_scene` / `unity_gameobject` **尚未注册**，分类表与 TCP 内部分支不能代替注册 schema；own Bridge 也未接这两类 handler。查询 body 需要符合现存消费者的 `{success:true,data:[...]}`，直接数组会丢名称或被当失败。本次只补真实 API/协议前置测试，未修改产品查询功能，也不能将 30 项标为已完成 Scene/GameObject 工具。

快捷键审查发现旧桌面层在 GUI iframe 的 capture 监听吞掉 F12/Shift+F12 并调用未实现的 Tauri devtools。两代桌面入口现仅在旧宿主保留该逻辑，自有 Shell 将按键交给 Monaco；`frontend-lsp-shortcuts.test.mjs` 直接提取真实 handler **8/8**，两代语法及 native caption 回归通过。另已修两代批准/拒绝/取消 hook 的 Windows 同时要求 Ctrl+Win 缺陷，按平台分别绑定 modifier；真实 wrapper LSP 按键与待审批键盘拒绝正在验收，不能用 VM 契约代替完整界面或原生 OS 输入证明。

Insight Agent SDK 的只读审查确认已注册五个 `vfs_*`，现有自有 worker 也支持原协议，无需另造索引；当前 SDK 启动器仍找旧 wrapper，JS 入口用编译 Agent 的 Bun EXE，默认 daemon 脱离应用 Job，尚未接通。下一阶段优先经 ACP/Core 受信回调转同一个 Rust InsightService，根/缓存/运行时只由已打开工作区派生。需要保留 worker 的 `llmContent/returnDisplay`（现有 UI RPC 只取 data 会丢工具内容），发送请求级 cancel 并保护其它 GUI 请求；真实 issued-ID、watch、启停、双工程/关闭和缓存恢复门禁完成前仍保持未接入声明。本次只有协议审查，没有生产 SDK 更改。

第六阶段集中门禁首轮 `audit-phase6-20261001/verify-phase6-integrated.log` 只在新 LSP 测试长断言的 cargo fmt 失败，已定向展开断言，没有行为变更。第二轮 `verify-phase6-integrated-02.log` 通过 Rust/前端基础、HTTP/生命周期、项目面板和 Git20 后，因独立复审发现多审批框焦点与 held-repeat 边界，由 root 精确核验自身 runner PID/命令后停止该子树；**不是完整门禁退出 0**。新单请求快捷键22/GUI8也不能代替多请求验证，正在补 focused toolbar exact 请求、repeat 与隐藏祖先保护及真实双 issued-ID 门禁；正式 app 仍未更新。

集中第三轮开始前的最终冻结收口：两代 RightSideBar 在异步初始化结束后检查已卸载/Editor ref 被替换，防止旧组件继续注册 providers/actions；生命周期实际提取 **16/16**（含两代 live 7 注册、cleanup/replacement 0），加原 LSP 6/6。它是独立卸载边界修复，不能当作 f02 菜单超时的根因。Unity 最终源码报告为 `temp/GameCowork/tests/lsp-unity-d58edd26-538c-4c17-b579-199dfc2e917a/report.json` **6/6**，明确 fixtureCore/modelRequests/资源身份/自有 PID 清理，先前 5041 报告保留初轮证据。

审批键盘最终源码契约 **24/24**，收紧当前可见 toolbar、active session/request/option、focus、repeat、visibility/inert/aria-hidden。真实 GUI→Core→Agent→Unity **10/10**，`temp/GameCowork/tests/editor-bridge-agent-ui-66191858-7eae-4dc4-b120-3518bd2471ef/result.json`：同模型回复的两个真实 issued-ID 实际串行审批（同屏最大 1），held Ctrl+Backspace 拒第一、后续三次 repeat 不拒第二，keyup 后新按键只拒第二，Editor 保持 stopped，外站/页面错误/guard 为 0，自有进程退出。并发第二 toolbar 焦点只标契约证据；原 `58343e4a-*` 等待两个同屏审批失败保留为 SDK 顺序诊断，没有伪造 store。审批时聊天 composer 不可见，按键目标为真实 permission-toolbar，不冒称隐藏输入框或原生 OS 按键已验收。全生产与 driver/fixture 已冻结，第三轮全门禁 `audit-phase6-20261001/verify-phase6-integrated-03.log` 正在执行，当前仍未装配。

集中第三轮通过了基础/Rust79、LSP20、Core/Insight/聊天/CLI/历史前段，在 `chat-e2e` 旧“未接入”文字断言失败；只更新为真实 `enabled=false/connected=false/启用 C#`，原聊天10随后通过，不能将03写成全门禁退出0。继续的 Agent actions15、file/media11通过；custom22操作均通过但严格尾断言捕获两次可选 LSP status OS path3。确定原因是自有空 app-root fixture 没传 LSP_DIR，服务资源不存在，普通 SKILL.md/JSON 打开也无条件探测。已修普通非CS/失效tab不探测、离开abort，以及缺失资源只读状态诚实 unavailable、显式操作/closed授权仍失败；没有过滤rpcErrors。最终 Rust **80/80**（`source-rust-final-80.log`）、最新LSP GUI **20/20**（`tests/lsp-e2e-5cf67611-e16f-4922-bb93-af6ed569d710/report.json`）、缺失/移动/恢复资源HTTP **7/7**（`tests/lsp-status-39499d36-cb35-493a-b8c0-04f3d25acea4/report.json`）、前端LSP6＋生命周期22，原custom22严格重跑退出0（`source-custom-fixed-runtime.log`）。

剩余源码续跑 stdio13、Commands/Subagents15、Unity LSP6、桥9/多流6/重载18、Unity控制15/CLI严格26/Agent GUI10、Tuanjie预览18均通过。双Unity与mixed分别在A重载后的画面推进/四流decode超时，失败 `tests/editor-bridge-multi-project-f121c1e6-3c5a-4e3e-bd5a-9beb38e5bf35`、`1552e888-cef5-4f66-aa8f-c943f6166d07` 保留。前七项四槽/切工程/输入/resize通过，B Scene显式报content aspect不匹配。已在FitRect浮点计算复现微负y（376×741→250×462时约-0.000015），正在通过增加真实frame header/slot/Actor诊断确认；未放宽接收校验或测试timeout，正式app尚未更新。统一续跑日志为 `audit-phase6-20261001/source-*.log`。

本轮已修改实际使用的 `restored/shell/`，新增 `transport.rs` 与 `workspaces.rs`；两代前端请求和侧栏同步修复。运行产物通过 `tools/build-local.ps1` 从这些源码装配，原软件目录保持只读。

第二阶段已接入自编译 Agent、实际本地模型配置、文件服务与 ConPTY 终端，验证记录见本节后续更新及末尾 CLI 记录。新增 `files.rs`、`mutations.rs`、`file_events.rs` 和 `terminals.rs` 是实际壳的一部分；不能再依据下面历史盘点的“缺少路由”文字判定这些接口当前不存在。

### 第一至第四阶段实现与验收（历史记录）

第三阶段已实现实际 Agent 批准/拒绝/取消、命令退出码及会话操作；补齐媒体解码、外部改名后的刷新与未保存内容保护，以及自有 Unity Editor-only UPM。该阶段源码门禁退出 0，856 文件包及 Core 54/54、HTTP 聊天 36/36、Chromium 聊天文件 10/10、Agent 操作 15/15、媒体 11/11、真实 Unity 两槽产品预览 13/13 均通过；详细记录在下方第三阶段历史章节。当前正式包已更新为第四阶段 873 文件，新的验收结果以本节第四阶段记录为准；全目标尚未完成。

- Agent 写入/替换每次确认，批准后核对真实文件字节；拒绝和取消不写。命令验收真实 stdout/stderr、退出码 0/7、拒绝、等待取消和运行中回收自有 PID。会话重命名/删除失败保留原数据并显示错误，关闭 A 的待批准任务不会误伤 B。
- 图片、GLB/GLTF、WAV/WebM 经过实际 Chromium 解码与播放；搜索定位、外部写入、改名及删除与未保存草稿隔离均已验收。小文件子集通过不代表所有编码和大文件都已覆盖。
- 编辑器桥的实际 TCP 状态、预览控制和只读编辑器查询无需先配置模型。真实 Unity 2022.3 的 Scene/Game JPEG 帧、输入、独立流、两槽布局保存恢复、关闭释放和断桥提示已验收；Inspector/Hierarchy/Project/Console 等完整编辑器 UI、音频/WebRTC、远程与实际 Tuanjie 运行仍未完成，不能称为原版全部串流能力。

第四阶段维护源码已实现本机安装编辑器模板的新建项目、本地自定义能力管理、实际 Unity Insight worker，以及 Unity 程序集重载/单 GUI 多工程预览。`build-local.ps1 -SkipTests -CliPackageDirectory ...cli-product-20261001-06` 已原位装配 `app/`，873 文件逐项 SHA256 通过；最终构建目录 `temp/GameCowork/build/94147966bf0e4c2881dff959c2f22a09`。正式 CLI 为 Boolean testGuardIncluded=false，Core 与维护源码一致；下方新增本阶段实际装配门禁。

新增真实源码证据：本地自定义管理 22/22、Unity Insight 实际 HTTP/GUI 22/22；模板 Unity GUI 10/10（含真实慢 Hub 查询中的取消）、团结 GUI 9/9（真实 cn.tuanjie.* 包与 .scene 字节）、Unity 完整模板编辑器导入/场景打开通过。单 GUI 跨工程四槽门禁 14/14、程序集重载与关闭防复活 17/17 已通过，包括固定身份布局恢复、A 关闭/重载时 B 继续接收真实帧、等比画面和黑边输入。实际 Tuanjie 编辑器运行、其它完整窗口、WebRTC/音频及远程仍未完成。

- Agent CLI 从自己的恢复源码调用 CommonJS 工厂后编译，配套 28 个资源；没有改名复用原版 CLI。壳仅选择自己的 CLI 路径、应用数据和资源目录。
- 本地模型配置、模型选择、完整流、取消并中止上游、真实 `read_file` 工具结果、A/B 会话隔离及重启后的历史恢复均经过 Chromium + 实际 Rust/Core/Agent + loopback 模型验收。取消保留部分文本，配置为空时明确显示未配置；历史加载使用保存的模型身份，不能偷换为另一个 Provider。
- 本地模式跳过原云配置缓存/刷新、市场请求、资产任务轮询和 OAuth 设备登录，不制造云 Token。市场/资产返回明确未配置来源或 Provider，原有本地技能/扩展入口保留。扩展到文件/市场的 UI 复测又发现项目状态 getter 会自动注册原资产 MCP，导致 3 次原资产域请求尝试；已修 getter 和后台 helper，最终门禁检查所有域名，不能只筛 `.invalid` 就宣称无外网尝试。
- 文件树、文本/图片与小媒体内容、范围读取、搜索、原生目录变更 SSE 接实际磁盘；文件保存先备份实际旧字节，撤销核对版本。预检查发现后续修改时拒绝恢复；Windows 原子替换窗口内发生外部保存时保留精确被替换版本并明确返回 `applied/recovery-needed`，不假报恢复成功、不盲回滚覆盖第三次修改。文本预览携带实际原字节 SHA256，UI 保存按此检查版本。缺失或越界的存在性/统计探测不泄露内容；实际读取越界仍报错。
- 终端通过实际 Windows ConPTY 和 WebSocket；工作目录只取已打开工作区，输入/输出为真实字节，resize 作用于真实控制台，关闭工作区或断开 tab 会回收其独立 Job。模块、WebSocket 与真实 TerminalPanel 已执行实际命令/文件写入、尺寸、退出码、A/B 和进程回收验证；连接前禁用输入，握手失败也清理注册。
- `ide/setActiveSessionId` 真正保存本应用按工作区隔离的活动会话，Git 发现仅检查当前工作区内实际标记；文件界面遵守后端只读值，写入时禁用编辑；新增本地“保存/撤销上次保存”入口，不向 console 输出文件正文。

第一至第三阶段的验证与旧包保留为历史参考；当前第四阶段装配与验收如下。

### 第四阶段最终装配与门禁（2026-10-01）

运行 `tools/verify-local.ps1 -RealCore -Chat -Editor -AgentTestPackage F:\AI\AgentMake\temp\GameCowork\cli-guarded-20261001-12` 退出 **0**，日志 `temp/GameCowork/audit-2026-10-01/verification-phase4-integrated.log`。该执行实例的 Editor 分支包含默认 13 项；后续新增的生命周期/多来源/轮次模板契约 **20/20**、实际设置目录绑定与持久化 **14/14**、重载 **17/17** 与单 GUI 双工程 **14/14** 已分别执行，后两项也完成了最终 app 验收。现在脚本使用重载 17 项覆盖默认 13 项，另外运行双工程 14 项；在需要时提前构建同源码 guarded Agent 并显式传给索引测试，避免依赖某个历史 temp 包。最后仅改门禁参数传递，PowerShell AST 和模板 driver 语法检查通过，没有再次重复全部长门禁。

最终装配命令 `tools/build-local.ps1 -SkipTests -CliPackageDirectory F:\AI\AgentMake\temp\GameCowork\cli-product-20261001-06` 退出 **0**；日志 `temp/GameCowork/audit-2026-10-01/build-phase4-final.log`。**873 个运行资源在装配后和流程验收后逐项 SHA256 校验通过**，包含 `app/unity-insight/`、`app/editor-bridge/`、`app/core/gamecowork-custom.js` 与两代前端。正式 Agent 的源码 SHA 为 `FD9FC8CE3904DBA677A13B9C5FCC4A3771832DA105FBEEA59E372CE7990FF2EB`；正常入口/EXE manifest SHA 匹配，Boolean testGuardIncluded=false。实际测试 Agent 是同源码 guarded12；它没有进入产品包。

| 本阶段实际验证 | 结果与最终包报告 |
|---|---|
| Rust 原生模块 | 71/71，统一源码日志 |
| 项目面板添加/切换/关闭及可见错误 | 8 项通过，`temp/GameCowork/project-panel-e2e-1790832766822-16364` |
| 实际 Core / HTTP 聊天 | 54/54、36/36，`real-core-smoke-1f9a250f-451d-4976-b8f0-49519e726406`、`core-chat-71c523cf-109f-4742-994e-47960811a2b9` |
| 装配版 Chromium 聊天、文件及本地市场入口 | 10/10，`temp/GameCowork/packaged-chat-files-20261001-phase4/chat-report.json` |
| 装配版本地 Skills/Extensions/HTTP MCP 管理 | 22/22，`temp/GameCowork/custom-management-e2e-1d31dd9c-dc4c-42ef-ac82-e49c9b0ac7e4/custom-report.json` |
| 装配版实际索引 / 设置与重启 | 22/22、14/14，`insight-e2e-a92da110-604b-4f82-bf8a-84251d14b7fe`、`insight-settings-scope-ab099118-35fc-4e8e-814c-99040cee7afd` |
| 装配版 Unity 程序集重载 / 单 GUI 双工程四槽 | 17/17、14/14，`tests/editor-bridge-preview-558c754f-3860-4e23-8152-283fe6f04991`、`tests/editor-bridge-multi-project-7ddb735e-b47b-4590-8901-0e6ebf9518c1` |
| 装配版 Unity / Tuanjie 真实安装模板与 GUI 创建 | 10/10、9/9，`project-templates-b6a98e17-b3fb-4567-89b8-a62b1656b006`、`project-templates-e35e910b-9e8e-45d4-abd5-337d7a057ee6` |

表中简写目录都位于 `F:\AI\AgentMake\temp\GameCowork`；Core/Index 报告名为 summary.json，Editor/模板为 result.json。模板精确命令与 Unity 完整依赖导入记录见本节模板段；装配 driver 只以 fixture 枚举真实安装 Editor，未伪造运行。Core/Agent/浏览器外站尝试与浏览器错误为零，测试只用自有 temp 工程、配置、mock 与已有 Unity 许可，具体自有进程清理证据见文末。没有启动原软件、商业 Provider、账号登录或许可激活。

本阶段证明本地工作区、模板创建、自定义管理、索引和 Unity Scene/Game 多工程预览链路；实际 Tuanjie 运行、其它完整 Editor UI、播放/编辑器写入、WebRTC/音频、远程配对与第三方媒体 Provider 仍在剩余范围。Chromium 对真实 Rust HTTP 的验证也不覆盖原生 Wry 窗口几何。

后续 Tuanjie 验证已增加真实 EXE 产品/版本校验和 `.scene` fixture 的测试准备，前置 4/4 与语法检查通过并加入基础门禁；未启动 Tuanjie Editor。默认 Unity fixture 格式保留。下一步可用 `node tests/editor-preview-e2e.mjs --packaged --editor E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe --engine tuanjie --editor-version 2022.3.62t16 --agent F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12/gamecowork.exe` 对自有空测试工程开始实际运行；完整模板模式仍需独立准备公开依赖 cache/mirror，不能偷删 manifest 代替导入。

### 第三阶段最终门禁与装配（2026-10-01）

源码执行 `tools/verify-local.ps1 -RealCore -Chat -Editor -AgentTestPackage F:\AI\AgentMake\temp\GameCowork\cli-guarded-20261001-12` 退出 0，日志 `temp/GameCowork/audit-2026-10-01/verification-phase3-final.log`。最后强化布局恢复：关闭 iframe 前等待实际保存，另跑 `frontend-stream-layout.test.cjs` 6/6 和完整预览 13/13，检查真实 save RPC tabs/slots=2/2 与恢复 slotCount=2；没有沿用先前“两个画面出现在默认六槽”的弱断言。

| 本轮源码门禁 | 结果 |
|---|---|
| Rust 工作区/协议/文件/终端/桥/布局/安装备份 | 58/58 |
| 两代前端请求、文件、市场、终端、通知、批准、会话与媒体契约 | 112/112 |
| 两代前端布局保存时序与 HTTP 回退 | 6/6 |
| Core 审批模式 / 历史校验 / 无模型 MCP 延迟发现 | 6/6、10/10、4/4 |
| 真实 CLI ACP / 写入、批准和命令 / 持久历史 | 19/19、31/31、19/19 |
| Chromium 聊天文件 / Agent 操作会话 / 小媒体与 watcher | 10/10、15/15、11/11 |
| 真实 Unity 单桥帧页面 / 独立多流 / 精确布局产品入口 | 9/9、6/6、13/13 |

Release 通过 `tools/build-local.ps1 -SkipTests -CliPackageDirectory F:\AI\AgentMake\temp\GameCowork\cli-product-20261001-06` 更新 `app/`，**856 个运行资源逐文件 SHA256 校验通过**。暂存/原二进制备份目录 `temp/GameCowork/build/c46835d57a3a4b638c53493f8f556309`；正式 CLI manifest 的 `testGuardIncluded` 是 Boolean false，源码 SHA `FD9FC8CE3904DBA677A13B9C5FCC4A3771832DA105FBEEA59E372CE7990FF2EB`，与验证用 guarded12 一致。装配包包含 `app/editor-bridge/`，没有把 guard 测试包装成产品。

装配后已经单独运行：

- `node tests/real-core-smoke.mjs --packaged`：54/54，报告 `temp/GameCowork/real-core-smoke-bdd197c2-3329-4c21-bb23-eb2189936d38/summary.json`。
- `node tests/core-chat-smoke.mjs --packaged --package ...\cli-guarded-20261001-12`：36/36，报告 `temp/GameCowork/core-chat-672c7342-97df-47f8-8300-0aeb88f4cba8/summary.json`。
- `node tests/chat-e2e.mjs --packaged --agent ...\cli-guarded-20261001-12\gamecowork.exe --files --marketplace --output ...\packaged-chat-files-20261001-03`：10/10，实际 Release EXE、app/core/frontend 和同源码测试 Agent；全部外站尝试与 browser errors 为零。
- `node tests/agent-actions-e2e.mjs --packaged --agent ...\cli-guarded-20261001-12\gamecowork.exe --output ...\packaged-actions-20261001-final`：15/15，报告 `temp/GameCowork/packaged-actions-20261001-final/actions-report.json`。实际批准/拒绝/取消、写入/替换、命令退出码及 PID 回收、关闭 A 保留 B、历史重命名/删除失败和重启恢复均通过。
- `node tests/file-media-e2e.mjs --packaged --agent ...\cli-guarded-20261001-12\gamecowork.exe --output ...\packaged-media-20261001-final`：11/11，报告 `temp/GameCowork/packaged-media-20261001-final/media-report.json`。实际 app EXE/core/frontend 的 PNG、GLB/GLTF、WAV/WebM、搜索定位、clean 外改及 dirty rename/delete/旧名隔离均通过。两次命令各仅执行一次，全部外站尝试与 browser errors 为零，自有进程已退出；报告追加了明确的运行命令 provenance 与装配路径元数据。
- `node tests/editor-preview-e2e.mjs --packaged`：13/13，实际 Release EXE、app/core/frontend/**app/editor-bridge**，报告与视觉核对截图 `temp/GameCowork/tests/editor-bridge-preview-ba817bf8-613b-4489-a25d-db4bab7cb67b`。无模型配置仍真实显示 Scene/Game、接收两种输入、恢复两槽、关闭释放 streamCount=0、编辑器退出后显示断桥；无认证/旧 stop 错误，无外站尝试和 page errors，自有进程已退出。

自动聊天验证使用 loopback 模拟模型和同源码 guarded Agent；真实编辑器验证使用已安装 Unity 2022.3 与自己的 temp 工程及已有许可，没有调用商业 Provider、激活许可或修改原软件/真实用户工程。Chromium 与真实 Rust HTTP 门禁不覆盖原生 Wry 窗口几何或所有 GPU/编码组合。全目标仍按下方剩余项推进。

### 第二阶段最终门禁与正式包（历史，2026-10-01）

执行 `tools/verify-local.ps1 -RealCore -Chat -AgentTestPackage F:\AI\AgentMake\temp\GameCowork\cli-guarded-20261001-08`，退出码 0。日志为 `temp/GameCowork/audit-2026-10-01/verification-phase2-final2.log`。

| 本次实际验证 | 结果 |
|---|---|
| Rust 协议/工作区/文件/恢复竞态/原生监听/ConPTY/关闭租约 | 53/53 |
| 两代前端请求、文件、市场、终端、可选通知契约 | 82/82 |
| Mock Provider 真实工具调用 ID 与内容匹配 | 2/2 |
| Core 数据目录 / 项目状态 / 编辑器启动 | 10/10、14/14、16/16 |
| Raw host 错误 / 本地模型 / 启动与历史 / 云服务停用 | 12/12、6/6、12/12、10/10 |
| CLI 恢复源码契约 / 实际 ACP+loopback 运行 | 15/15、19/19 |
| 实际 Rust + fixture core 的 HTTP/SSE/GUI callback/文件变更 | 14/14 |
| Core/Agent Job / 独立编辑器生命周期 | 1/1、1/1 |
| 实际 ConPTY WebSocket + Chromium TerminalPanel | 7/7 |
| Chromium 项目管理与资产 pending 入口 | 8 项通过 |
| 隔离真实 core 的配置/项目状态/路由 | 54/54 |
| 真 Rust/Core/Agent/loopback 聊天、历史、取消和读工具 HTTP | 36/36 |
| 真 Rust/Core/Agent/Chromium 的聊天+文件+市场 UI | 10/10，全部外站请求尝试 0 |

终端最终门禁目录 `temp/GameCowork/tests/terminal-e2e-4a247820-cc83-4c0c-b6bd-881cbe376f8c`；合并 UI 目录 `temp/GameCowork/chat-e2e-9dd11ace-c248-43e0-8485-e5605d86b962`。模拟 Provider 是真实 loopback HTTP 服务；这些测试没有使用商业服务额度或真实用户工程。

随后运行 `tools/build-local.ps1 -SkipTests -CliPackageDirectory F:\AI\AgentMake\temp\GameCowork\cli-product-20261001-05`，Release 已原位更新 `app/`，**836 个资源逐项 SHA256 校验通过**。本轮备份/暂存为 `temp/GameCowork/build/d8dc4159a5cc45f3bd6ce913d3297034`。正式 CLI 的 `testGuardIncluded` 为 Boolean false，源码 SHA `BD34740FBAFE287A731BC4CA60FEE2F34E060339772C2F571C5CA130919E17E9`；构建同时核验正常入口、源码和 EXE 哈希，拒绝 guarded/缺失标记/过期入口。

装配后 `node tests/real-core-smoke.mjs --packaged` 再次 54/54；`node tests/core-chat-smoke.mjs --packaged --package ...\cli-guarded-20261001-08` 在实际 `app/GameCowork.exe`、`app/core` 与 `app/frontend` 下再次 36/36，所有网络尝试 0，测试父 PID 已退出。后者显式换用同源码 guarded Agent；正常产品 Agent 已完成 version/help 退出 0及哈希校验，不能混淆正常包与测试 guard。装配后 Chromium 验收继续单独记录，以上 headless HTTP 不能证明原生 wry 窗口几何。

装配后另执行 `node tests/chat-e2e.mjs --packaged --agent ...\cli-guarded-20261001-08\gamecowork.exe --files --marketplace --output ...\packaged-chat-files-20261001-01`，实际 Release EXE、`app/core`、`app/frontend` 和同源码 guarded Agent 完成 **10/10** Chromium 流程；14 次 loopback 请求、7 次完整聊天、1 次实际 HTTP 取消、1 次 matching read-file 工具结果，所有 guard/浏览器外站尝试与 browser errors 均为空。正式 CLI manifest Boolean false、正常 EXE 哈希和 maintained/guarded source SHA 也实际核对。报告/截图在 `temp/GameCowork/packaged-chat-files-20261001-01`，自有测试 PID 已清理；仍不冒称已验收原生 wry 窗口几何或商业服务额度。

### 第一阶段基础修复内容（历史记录）

- HTTP/SSE 恢复原始客户端请求 ID；一请求一次发送；流的每一帧和结束帧均保留；超时、取消和进程退出清理 pending。
- core 发起的宿主请求使用 raw data 回包，GUI 对权限请求的回应保留原 core ID。
- 本地工作区注册、添加、打开、切换、关闭、排序、收藏、移除与重启恢复；打开/关闭接入 core `initWorkspace/shutdownWorkspace`，请求按 `workspaceId` 路由。
- 有工作区的 core 事件通过原 GUI 的 Hub envelope 分发，关闭后过滤迟到事件。Hub 工程移除仅保存自己的隐藏记录，重新加入时恢复，不修改官方 Hub 配置或工程文件。
- 项目/编辑器版本与架构字段适配前端；功能提示按平台保存已读；提供明确的本地身份与未实现接口错误。
- core 设置、metrics 与无项目 clipboard 的写入支持显式应用数据目录，隔离测试不写真实用户目录。
- 没有 Agent/ACP 时仍能通过既有只读检测识别本地 Unity/Tuanjie 项目，不伪造编辑器已连接；有 ACP 时保留原链路。
- Windows Job 回收本应用的 core/Agent 子孙；WMI 启动失败时由壳独立启动编辑器，关闭 Cowork 不结束它。用自有假编辑器验证了参数与进程生命周期，真实编辑器联调仍待后续阶段。
- 两代原生窗口按钮走本地 HTTP；首次介绍消费真实 capabilities；本地模式不初始化官方 Sentry/PostHog 业务遥测。

### 第一阶段验证与旧版装配（历史记录）

已执行 `tools/verify-local.ps1 -RealCore`，全部通过：

| 本次验证 | 结果 |
|---|---|
| Rust 协议/工作区单测 | 21/21 |
| 两代真实前端请求、切换、窗口与遥测契约 | 46/46 |
| 两份 core 数据目录契约 | 10/10 |
| 两份 core Unity 项目状态契约 | 12/12 |
| 两份 core 编辑器启动 helper/handler 契约 | 16/16 |
| 真实 Rust 壳 + fake core HTTP/SSE | 12/12 |
| Windows core/Agent 子孙回收 | 1/1 |
| 独立编辑器启动与关闭 Cowork 后存活 | 1/1 |
| 真实 Chromium 用户流程 | 7/7，无 pageerror |
| 隔离真实 core 初始化、配置、项目识别、A/B 路由与关闭 | 54/54 |

随后执行 `tools/build-local.ps1 -SkipTests`，Release 装配更新到现有 app，805 个运行资源逐项 SHA256 校验通过；旧 EXE/core 保存在 `temp/GameCowork/build/200eacdf131748cb9437272d986e2b4f/previous-binaries`。再执行 `node tests/real-core-smoke.mjs --packaged`，已装配 EXE + core 的 54 项检查再次通过。

本轮完整验证日志：`F:\AI\AgentMake\temp\GameCowork\audit-2026-10-01\verification.log`；装配后报告：`temp/GameCowork/real-core-smoke-f000f384-eb2c-4e11-8ec2-fc4809d1b23d/summary.json`；真实前端截图与结果：`temp/GameCowork/project-panel-e2e-1790792104543-19032/browser-report.json`。

HTTP/浏览器 fixture 不运行真实编辑器、Agent、模型或 Provider。真实 core smoke 必须阻断外部网络并使用临时目录；检查内层 status/content，不能只检查 HTTP 200 或外层 success。

### 本机编辑器模板与完整导入验证（2026-10-01）

新建项目只读取实际安装编辑器 `Data/Resources/PackageManager/ProjectTemplates/*.tgz` 的 package.json、版本和 SHA；支持实际 `com.unity.*` / `cn.tuanjie.*` 包，不制造模板列表。编辑器身份由 Core 返回的安装路径、产品、版本和架构校验。项目保留原始 Assets/Packages/ProjectSettings 及 manifest，只在私有暂存目录解包，提交到尚不存在的目标；已有目录拒绝覆盖。后退会取消对应 creationId，慢 Hub 查询返回后仍检查取消状态；注册失败保留真实创建路径并提示从磁盘添加。

维护源码下执行 `node tests/project-templates-e2e.mjs --binary restored/shell/target/release/GameCowork.exe --slow-hub-cancel`，Unity GUI **10/10**，报告 `temp/GameCowork/project-templates-3b1e288f-500e-45d7-88d2-afd9801ffe3a/result.json`。团结 GUI 使用 `--editor E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe --version 2022.3.62t16 --product tuanjie`，**9/9**，报告 `temp/GameCowork/project-templates-ce9e57b6-dd4a-4a96-af99-a6c58e83837e/result.json`，核对真实 cn.tuanjie.template.3d 与 SampleScene.scene 字节。此 GUI driver 的 Core fixture 只枚举实际编辑器；明确拒绝伪造编辑器启动。

另用 `tools/prepare-template-test-cache.py` 将官方公开依赖冻结到自己的 temp 缓存，记录来源和哈希；没有裁减新工程 manifest 或禁用 Package Manager。执行下方 PowerShell 命令，真实 Unity 2022.3.51f1c1 导入依赖、编译自有验证脚本并打开 SampleScene，退出 **0**，真实 Camera=1 / Light=1。报告 `temp/GameCowork/tests/template-editor-fd3d5a68-600b-4add-9f60-ee0bd00b68c7/result.json`；原 manifest/scene 字节保留，自己的 loopback 包镜像之外无请求尝试，Editor 已退出。此结果不覆盖实际 Tuanjie 导入和许可链。

```powershell
node tests/project-template-editor.mjs --project 'F:/AI/AgentMake/temp/GameCowork/project-templates-b2c9bbb0-814a-4393-b66a-ff09a73efa5c/Created Projects/Template 中文 Project' --cache 'F:/AI/AgentMake/temp/GameCowork/template-public-test-cache-20261001-02'
```

### 全目标尚未完成的工作

- [x] 完成第一轮项目管理、基础通信、窗口入口及浏览器/装配验收。
- [x] 恢复可维护、可运行的自有 Agent CLI，验收模型选择、新建/恢复聊天、完整流、取消与真实读文件结果。
- [x] 验收 Agent 自身的真实文件写入/替换、命令执行、批准、拒绝及取消，包含实际 GUI 与工具调用结果。
- [x] 接通本机 Unity/Tuanjie 安装模板列表与实际创建、取消；实际 Unity 完整模板导入/编译/场景打开通过。
- [x] 接通文件浏览、小媒体、ConPTY 终端与实际本地 Unity Insight 索引；补齐 Skills/Extensions/MCP 管理。
- [x] 验收实际 Tuanjie 编辑器完整模板导入及 Scene/Game 运行。
- [x] 跑通本地 Git/Diff 的实际宿主与原界面，验证原子丢弃/版本保护。
- [x] 跑通 Commands/Subagents 的项目/全局管理、重启和真实 Agent 生效。
- [ ] 接通 LSP 及其它已有界面的宿主接口。
- [x] 建立自有编辑器桥，验收单工程 GameView/SceneView、输入、两槽布局保存恢复、关闭释放与断桥提示。
- [x] 验收 Unity 程序集重载恢复、单 GUI 多工程 Scene/Game 预览、固定身份布局和独立输入/关闭生命周期。
- [x] 验收实际 Tuanjie 桥运行及 Unity＋Tuanjie 双引擎同 GUI 同时预览。
- [ ] 补齐其它完整编辑器窗口、编辑器基本控制/写入及音频串流。
- [ ] 实现远程设备配对、授权、目录/Agent/编辑器转发与断线恢复，不能把修改监听地址当成远程功能完成。
- [ ] 逐项对照现有菜单和原软件，补齐自定义能力、任务/会话状态、资源预览与生命周期，移除误导性宣传。
- [ ] 后期引入第三方模型、图片、视频、3D Provider；配置和认证与原软件完全分离，凭据不得进入仓库或日志。

---

> 日期: 2026-09-29 · 目标: `E:\TuanjieCodely\EXE\Tuanjie Cowork` (v2.1.3-canary.2)
> 产物: `F:\AI\AgentMake\CyberSoftwares\GameCowork`
> 性质: 应用作者委托还原

## 一、目标鉴定（实测）

| 项 | 结果 |
|---|---|
| 主程序 | `cowork.exe` 58,555,736B，Rust(MSVC 14.29) + **Tauri 2**（tauri-runtime-wry / WebView2），Authode 签名 PKCS#7 |
| 产品信息 | ProductName=Tuanjie Cowork, Version=2.1.3-canary.2, Company=gamecowork |
| 标识符 | `dev.gamecowork.desktop`（与 `.tuanjie-cowork-install` 标记一致） |
| 前端 | `app/resource/dist` 87MB：461 JS + 9 CSS + KaTeX 字体全套 + 图标；Vite 构建，双应用（desktop/gui）双构建代并置 |
| core 边车 | `gamecowork-binary.exe` 70,158,576B，**vercel/pkg**（Node 22.x），入口 `out/index.js` |
| CLI 边车 | `cli/bin/win32-x64/gamecowork.exe` 204,135,768B，**Bun v1** `--compile`，`@bytecode @bun-cjs` |
| unity-insight | `cli/lib`：原版 package.json 保留（name=unity-insight 0.0.1, esbuild+vitest 工程）+ 6 个 bundle worker |
| hub | Tuanjie Hub 授权链 217MB（.NET LicensingClient + Sentinel HASP + v2c 许可证） |
| 伴生 | `process_killer.exe`(PE64 小工具)、`uninstall.exe`(NSIS)、新旧版本 exe 并存（升级残留） |

## 二、逐层还原记录

### 1. 前端（dist）— 完成 ✅

- 方法: prettier 3 全量美化（babel/css/html parser, 120 列）→ `restored/frontend/dist-beautified/`
- 结果: **beautified=479, copied=280(字体/图片等), failed=0**
- 技术栈鉴定: React + redux + Monaco(ts.worker×2) + mermaid 全家桶(cytoscape/dagre/c4/class…) + three.js(GLTF/模型/天空盒) + KaTeX + xterm + marked/remark + i18next + cmdk + Sentry + posthog + @tauri-apps/api
- Tauri IPC: 仅 7 个字面 invoke（3 个自定义命令均为跨宿主共享代码，实现在 Unity/JetBrains 宿主侧；desktop 壳零自定义命令）
- 产出: `PROJECT_MAP.md`（入口图/模块图谱）+ `package.json`（依赖重建）

### 2. Rust 壳（src-tauri）— 骨架完成 ✅（源码级不可全还原）

- 提取到: 插件清单（updater/notification/global-shortcut/single-instance）、内嵌 ACL 能力串、
  Rust 侧调用的 plugin:* 命令统计、全部后端端点、updater minisign 痕迹、LSP 引用
- 重建: `tauri.conf.json` / `Cargo.toml` / `src/main.rs`(结构示意) / `capabilities/default.json` / `COMMAND_SURFACE.md`
- 未还原: Rust 函数级逻辑（需 IDA/Ghidra 深逆，对应用行为无必要——壳无业务逻辑）、
  窗口数值配置（编译进代码，字符串不可见）、minisign 完整公钥

### 3. core 边车（pkg 解包）— 完成 ✅

- 定位: bootstrap shim 数字参数(payload@37459456+32586083, prelude@70045539+100915)
- 结构: pkg 5.x 路径字典(`{"C:":"0",…}`) + VFS(键=id 链 `0/1/2/…`, 值={类型:[off,size]}) + DOCOMPRESS=1(**gzip**, 非 brotli)
- 结果: **258/258 文件还原**（32MB 压缩 → 133MB 明文），入口 bundle 14.3MB → 美化 18.1MB
- 内容: out/index.js 主 bundle + llama/tiktoken tokenizer + tree-sitter wasm 全套(30+ 语言) + win-ca native + projectZipWorker

### 4. CLI 边车（Bun carve）— 完成 ✅（字节码除外）

- 方法: 可打印文本段 carve（UTF-8 容忍），`---- Bun! ----` 魔数定位图区(59.6MB 处起)
- 结果: 223 段 / 16.3MB 明文 JS；主 bundle 11.95MB → 美化 20.5MB
- 未还原: `@bytecode` 编译缓存部分（二进制 V8 字节码，仅影响启动性能不影响语义——明文源码已全取）

### 5. unity-insight — 完成 ✅

6 个 worker bundle 全部美化成功；原版 package.json（scripts/devDependencies/engines）完整保留，可据此重建工程。

### 6. hub — 鉴定完成，未深逆 ⏸

全部为 .NET 程序集（ILSpy 可随时一键反编译）+ Sentinel HASP 商业组件。作者未要求时不动。

## 三、未还原项（诚实清单）

1. **Rust 函数级源码**（壳层无业务逻辑，骨架已给）——如需可用 IDA 补。
2. **窗口数值配置 / NSIS 安装器脚本**（编译产物，需动态观测或 NSIS 反编译）。
3. **Bun 字节码缓存段**（语义无损失）。
4. **前端 sourcemap**（产物未随附，变量名保持压缩态）。
5. **hub .NET 反编译**（待指示）。
6. `cowork-old-*.exe` / `gamecowork-binary-old-*.exe` 为旧版本残留，未单独还原（方法相同）。

## 四、复跑工具（tools/）

| 脚本 | 用途 |
|---|---|
| `beautify-dist.mjs` | dist 全量美化（prettier stdout 捕获版，Node 24 兼容） |
| `extract-invoke.mjs` | 扫 dist 提取 Tauri invoke 命令面 |
| `pkg-probe.py` / `pkg-probe2.py` | pkg 结构探针 |
| `pkg-unpack.mjs` | pkg 解包器（字典+VFS+gzip，可复用于其他 pkg 产物） |
| `bun-carve.py` | Bun standalone 明文 carve（UTF-8 容忍，单块扫描） |
| `extract-icon.ps1` | exe 图标提取 |

## 五、校验摘要

- original 镜像与源目录一致性: robocopy /E 全量复制（873MB）
- 前端: 479 美化 + 280 原样拷贝 = 759 项 = dist 全量 ✅
- pkg: 258 文件写入，0 失败 ✅
- 关键抽样: 入口 JS 头部可读、wasm 文件大小正确、KaTeX 字体二进制一致 ✅

## 六、codely → GameCowork 重命名与隔离（2026-09-30）

- **范围**: restored/ + tools/ + 根文档，82+ 文件 13,524 处（规则: Codely Cowork→GameCowork、
  codely-cowork→gamecowork、codelycowork→gamecowork、CODELY→GAMECOWORK、Codely→GameCowork、
  codely→gamecowork，脚本 `tools/rename-codely.py` 可复跑）；目录同步改名
  `core-codely-binary→core-gamecowork-binary`、`cli-codely→cli-gamecowork`。
- **关键隔离点**: Tauri 标识符 `dev.gamecowork.desktop`；数据目录 `~/.gamecowork(+-cli)`；
  23+ 个 `GAMECOWORK_*` 环境变量；`Programs/GameCowork` 探测路径；productName/窗口标题
  → `GameCowork`（tauri.conf.json）。
- **保护串还原**（外部契约，未改）: `codely.tuanjie.cn`(8 处)、`cn.tuanjie.codely.bridge`(1 处)、
  源安装路径 `E:\TuanjieCodely`(3 文件)、`tools/*.py` 的原始路径引用。
- **验证**: 非保护残留 0 处；4 个大 bundle prettier 语法重解析全过；
  隔离点落位核对（~/.gamecowork ×15、.gamecowork-cli ×15、GAMECOWORK_* ×23）✅。
- **已知共享面**: 同后端账号为服务端问题；编辑器桥接包单实例，两版勿同时操作同一编辑器工程。
- **git**: 基线 commit（改名前）与本次改名 commit 分立，diff 可审计。

## 本地文件浏览与读取宿主模块（2026-10-01）

- 新增 `restored/shell/src/files.rs`，按真实前端 `file-explorer`、`local-file-content` 和原生 `readRangeInFile` 消费契约提供只读服务：单层目录与分页、文本/图片预览、文件名搜索、内容/正则搜索、NDJSON 搜索记录，以及 `readFile`、`listDir`、`getFileStats`、`fileExists` 原语。列表和内容均来自实际文件系统，不使用演示条目。
- 访问根由壳显式传入；工作区参数自身不能授权新路径。校验普通路径、中文与 `file://` URI，拒绝 `..`、未经授权的绝对路径、设备路径、NTFS 备用数据流和越界 symlink/junction；Windows 打开文件后还以 `GetFinalPathNameByHandleW` 校验实际句柄目标。
- 单文件文本最多 2 MiB，附件/媒体字节最多 8 MiB，超限返回 HTTP 413 对应错误数据，不返回截断内容冒充完整文本。二进制预览明确为 `binary`；UTF-8 与带 BOM 的 UTF-16 文本可读，文本范围保留 CRLF 并按 UTF-16 列定位。
- 目录只列当前一层，最多扫描 10,000 个条目；搜索有 10,000 条目、16 层、32 MiB、2 秒检查和 2,000 结果预算，跳过 `.git`、`node_modules`、Unity `Library/Temp/Logs` 等生成目录，并返回实际忽略计数与限额原因。正则使用缓存中固定的 `regex 1.12.3`，限定编译与 DFA 大小。
- 本次模块独立 Rust 验证 **8/8 通过**，实际命令为 `cargo test --offline --manifest-path F:\AI\AgentMake\temp\GameCowork\tests\files-module-build\Cargo.toml --target-dir F:\AI\AgentMake\temp\GameCowork\tests\files-module-build\target`。测试只使用统一临时区内 UUID 目录，覆盖真实目录、编码/范围、越界/NTFS 命名空间、junction、二进制/超限、搜索与只读保护；测试数据已精确清理。
- 此记录确认模块与其测试完成；HTTP 路由、core 原生宿主和实际界面集成仍需本轮壳与浏览器验证。文件写入、实时目录监听、超大媒体串流不是这次只读模块的完成项。

## 可回滚本地文件修改模块（2026-10-01）

- 新增 `restored/shell/src/mutations.rs`，为宿主已经授权的调用提供 UTF-8 原子写入、创建目录、文件回收和按 change ID 恢复；构造时不修改工作区。写入只限当前 primary 工作区，默认禁止覆盖已有文件；调用方明确授权后才可设置 `overwrite`，并可用 `expectedSha256` 检查旧版本。
- 修改前将原始文件字节保存到调用方指定的本应用 `changes/<UUID>/before.bin`，以 `manifest.json` 记录原路径、工作区、操作、前后 SHA-256 和阶段。Windows 原子替换保留确实被替换的版本；删除先完成回收副本，再按实际打开的文件句柄移除目标，不递归删除目录。
- 拒绝越界路径、父目录穿越、设备/备用数据流、越界 junction，以及默认敏感位置（Git 元数据、`.env`、SSH/AWS/Docker/Kube 和常见凭据文件）。Windows 操作期间对 primary 至目标父目录持有禁止 DELETE 共享的实际目录句柄，并验证打开对象目标。
- 恢复前校验 backup SHA-256 和目标 after SHA-256；若用户后来修改文件、替换目录或向新目录写入内容，返回冲突并保留用户内容。目录恢复还校验卷与 file index 身份。日志收尾失败时明确标记 `applied:true/changeId`；需手工恢复的异常保留实际被替换文件，不能自动选择较旧快照冒充成功。
- `can_edit` 仅验证当前 primary 内已有、非敏感、非只读、可解码文本文件，不创建修改记录。跨已打开工作区的文件仍保持只读。单次文本最多 2 MiB，安全 backup/回收文件最多 8 MiB；本模块不声称拦截 Agent 通过其它原生工具进行的所有文件修改。
- 本次独立 Rust harness **19/19 通过**（reader 8 项、mutation 11 项），实际命令为 `cargo test --offline --manifest-path F:\AI\AgentMake\temp\GameCowork\tests\mutations-module-build\Cargo.toml --target-dir F:\AI\AgentMake\temp\GameCowork\tests\mutations-module-build\target`。全部文件位于统一临时区 UUID fixture，验证覆盖/创建/回收/恢复、后续用户改动冲突、敏感与越界、junction、备份完整性、目录身份、跨工作区和纯编辑性检查；fixture 已精确清理。
- 模块及测试已完成；原生宿主、HTTP `file-explorer` 的实际 `save` 处理与 UI 编辑/撤销入口仍由本轮集成验证确认。只读预览不会因为模块存在就自动声明可编辑。

## 真实 Windows 交互终端（2026-10-01）

- 新增 `restored/shell/src/terminals.rs`，直接使用 Windows ConPTY，启动真实 `PowerShell -NoLogo -NoProfile -NoExit`，关闭该进程的 PSReadLine 历史保存。不是输入回显或用普通命令执行冒充交互终端。
- 两代 `TerminalPanel` 协议一致：`GET WebSocket /api/tauri/terminal?workspaceDir=...&cols=...&rows=...`；binary 输入为 UTF-8 键盘数据，JSON text 输入为 `resize`；binary 输出为实际 PTY 数据，失败为 JSON `error`，正常结束给出真实 exit code 并以 1000 关闭。cwd 由宿主的已打开本地工作区授权；WebSocket Origin 在壳入口按本机 Host 校验，拒绝外部 Origin 与 remote 工作区。
- 每个终端拥有独立匿名 kill-on-close Job。shell 以 suspended 方式启动，先把自己创建的进程句柄加入 Job 再 Resume，关闭终端、关闭工作区或终止壳时只回收自己的 shell 与后续子孙。独立宿主启动的编辑器不加入终端 Job。会话最多 16 个、输入帧最多 64 KiB，输出经有界队列传送。
- 当父进程 stdout/stdin 被重定向时，必须显式设置 `STARTF_USESTDHANDLES` 并把标准句柄留空，才能避免 child 继续借用父进程管道；本轮实际修复了这项 ConPTY 附着问题，参考 [Microsoft terminal 的维护者说明](https://github.com/microsoft/terminal/discussions/15814)。其它实现依据为 [Microsoft ConPTY 会话文档](https://learn.microsoft.com/en-us/windows/console/creating-a-pseudoconsole-session)。
- 独立 Rust harness **11/11 通过**（文件 reader 8 项、terminal 3 项），其中真实交互测试通过 PTY 输入创建实际 fixture 文件、读取真实 console 100×35 尺寸并收到真实 `exit 7`。实际命令为 `cargo test --offline --manifest-path F:\AI\AgentMake\temp\GameCowork\tests\terminals-module-build\Cargo.toml --target-dir F:\AI\AgentMake\temp\GameCowork\tests\terminals-module-build\target`。
- `tests/terminal-e2e.mjs` 对真实 debug 壳的 WebSocket 与真实 Chromium `TerminalPanel` 验证 **7/7 通过**：外部 Origin、未打开目录、remote、非法尺寸拒绝；真正执行输入、落盘与 cwd、resize、exit 9；关闭 A 不杀 B、关闭标签回收、浏览器关闭回收；仅终止 root PID 后 shell 和 Node 孙进程消失，独立假编辑器继续存活并随后精确清理。截图已目检显示实际 `SCREEN_READY`，证据位于 `temp/GameCowork/tests/terminal-e2e-27236ad6-50c7-4f45-b3c4-4ac4bd64b3e0/terminal-ui.png`。
- 浏览器 driver 等真实 PowerShell 提示后再输入，并同时检查 pid 与内容文件，不以回显判断执行成功。`--skip-browser` 只跳过 UI 这一项，其它真实 PTY/WS 测试照常运行。自动测试未执行 `whoami`、未输出真实用户名、未加载用户 Profile，文件与 Chrome profile 都在统一临时区。
- 这项提供真实终端能力；cwd 限制是启动位置授权，不是对用户 shell 指令建立 Windows 权限沙箱。实时输入需要连接成功后才启用；整体发行门禁与最新 UI 状态继续由主代理验证。

## 功能清单复核（2026-10-01）

本节保留已有界面和菜单的完整范围，作为后续实现的检查入口。分类分为“已验收的明确子集”“接口存在但流程待验收”“明确缺少宿主接口/依赖”“后续 Provider 阶段”。任何 handler 注册、HTTP 200、外层 success 或模拟返回，都不能单独升级成“功能可用”；完成状态以本文件顶部的最新门禁结果和对应真实用户流程为准。

源码盘点工具为 [tools/scan-host-contracts.mjs](tools/scan-host-contracts.mjs)。它只解析实际 [index.html](restored/frontend/dist-beautified/index.html)、[gui.html](restored/frontend/dist-beautified/gui.html) 的导入图和字面 HTML 视图引用，收集宿主路径、协议调用、Rust `local_message/host_response/invoke` 以及 core 的真实 messenger 注册段和 IDE facade。每条 JSON 证据包含绝对文件路径、当前行号和源码 SHA-256。动态类型、未解析的接收者、消息方向不明及 native invoke 标为 unknown/待验收；vendor 的通用 `.request("GET")` 不作为产品支持证据。扫描不执行前端、core、CLI，不读取账号状态，不调用服务。

```powershell
node .\tools\scan-host-contracts.mjs
# 输出：F:\AI\AgentMake\temp\GameCowork\host-contracts-2026-10-01.json
# 可用 --output 指定 temp\GameCowork 内的报告路径。
```

矩阵 JSON 的 `workflows` 按以下流程分类，`runtimeStatus` 不自动标记可用。缺少 literal 路由只说明当前 Rust 路由表没有对应实现；动态路径/前缀检查不混入这一缺口统计。

| 优先级 / 用户流程 | 当前明确状态与源码证据 | 必须完成的验收 |
| --- | --- | --- |
| **P0 · 项目列表、工作区和侧栏切换** | 明确子集已有真实前端 + Rust + 隔离 core 的浏览器验收：退出骨架、双引擎项目显示、从磁盘添加、A/B 切换并恢复会话、独立折叠、关闭 A 保留 B、错误不假选中。对应 [workspaces.rs](restored/shell/src/workspaces.rs)、[main.rs](restored/shell/src/main.rs) 的 open/switch/close 路由与 [project-panel-e2e.mjs](tests/project-panel-e2e.mjs)。真实编辑器选择与启动不能由这些 fixture 结果替代。 | 保持已有门禁；再用隔离真实 Unity/Tuanjie 项目验收版本不符、手选编辑器、已开置前、启动失败、取消和重启恢复。 |
| **P0 · 新建会话、历史、聊天、批准和工具执行** | [core](restored/core-gamecowork-binary/binary/out/index.beautified.js) 的 `acp/*`、`history/*`、`llm/streamChat` 已接自编译 Agent。真实 GUI/Core/CLI/loopback 已验证流、取消、文件读/写/替换、命令退出码、批准/拒绝、关闭待批准会话、A/B 隔离、重命名/删除失败及重启恢复；存储层另验收 pin/archive/read/unread 和持久删除。详见最新门禁。 | 保持已验收链路；继续其它工具及 UI 归档/状态操作的流程，不把已注册接口当作所有工具已完成。 |
| **P0 · 设置、模型选择、模型与 Provider 配置** | 真实界面配置了本地文本 Provider/模型与必要槽位，实际 CLI 使用配置的认证驱动访问 loopback 模型，历史恢复保持所保存模型身份；非模拟 getter 证明见 CLI/HTTP/GUI 门禁。后续图片/视频/3D Provider 及真实第三方额度另行接入。 | 继续配置编辑/启停、更多认证驱动、错误凭据与删除模型等边界；真实第三方认证与额度须独立授权和验收，现有 loopback 结果不能冒称已调用真实商业服务。 |
| **P0 · 文件树、预览、搜索、差异和终端** | [GUI](restored/frontend/dist-beautified/assets/index-BRxZ4eG7.js) 已接真实磁盘、保存/Undo 与 watcher；实际 Chromium 验收 PNG、GLB/GLTF、WAV/WebM、Unicode 搜索行定位、clean 外改刷新、rename/delete 与 dirty 草稿及旧名重建隔离。现有 [TerminalPanel](restored/frontend/dist-beautified/assets/TerminalPanel-DaIbEA-8.js) 对接实际 ConPTY WebSocket，已验收输入输出/cwd/resize/退出与回收。 | 差异接受/拒绝与真实磁盘一致；watcher overflow、大文件/range 与其它媒体编码；其它 IDE facade 和文件路由逐项验收。 |
| **P1 · 自定义、Skills、Extensions、MCP 和 Marketplace** | [core](restored/core-gamecowork-binary/binary/out/index.beautified.js) 注册 `skills/list`、`extensions/list`、`mcp/list` 等；前端保留枚举、配置、安装、启用/禁用、移除入口。合法空态 fixture 只证明 UI 契约，不证明已有扩展安装或工具运行；下载/本地文件宿主路径也待补。 | 本地枚举的空态与错误态；配置、启停、移除、重启复用实际生效；隔离的自有工具执行一次并校验结果；安装失败不能变成“已安装”，远程 Marketplace 接自有来源。 |
| **P1 · Unity Insight、代码与资产索引** | [InsightIndexPage](restored/frontend/dist-beautified/assets/InsightIndexPage-B7corD1V.js) 和 GUI 依赖 `/api/tauri/unity-insight/*` 的进度、开关、索引与 VFS 查询；当前 Rust 路由缺位。core 存在 `unityInsight/*`，但 HTTP/VFS 层和实际 worker 生命周期仍要接通。 | 实际隔离工程的启动/进度/完成；路径、引用、搜索与修改后更新；停用、错误、重启恢复；worker 与缓存可清理，进度不能仅由模拟百分比判断。 |
| **P1 · 编辑器连接、Streaming、布局和多工程视图** | 实际 [editor_bridge.rs](restored/shell/src/editor_bridge.rs) 直接验证自有工程 TCP 身份，不依赖已配置模型；[UPM](restored/editor-bridge/README.md) 与 [帧页面](restored/frontend/dist-beautified/windowBridge.html) 已真实验收单 Unity 工程 Scene/Game JPEG、输入、resize、独立流/租约/释放、精确两槽保存恢复和断桥。`editorRenderedViews:true` 表示该子集；`editorStreaming:false` 仍表示原版完整窗口/WebRTC/音频未完成。CLI 原 TCP 单例不等于 N 工程连接。 | 程序集重载恢复、实际 Tuanjie、双引擎/多工程槽位连接与身份隔离；其它完整窗口、音频/WebRTC。 |
| **P1 · 远程设备、访问、目录和远程工作区** | `tauri/listRemoteWorkspaces` 当前为准确空态，capabilities 为 `remoteWorkspaces:false`；前端的 `/api/tauri/remote/browse-folders` 缺少宿主路由，工作区打开主动拒绝 remote。监听 `127.0.0.1` 是本地边界，不是远程实现；改地址也不能补齐设备和传输链。 | 两个隔离设备的配对/授权、状态、目录、Agent 和编辑器转发；离线/未配对/断线重连/取消；工作区身份不混淆，不能以端口开放或 API 200 验收。 |
| **P1 · 新项目、模板、编辑器安装、许可和云项目** | [TJHubRoute](restored/frontend/dist-beautified/assets/TJHubRoute-DN1YDDd-.js) 保留模板、安装/模块、许可、云项目入口。`tjhub/getTemplates` 明示 supported:false，`tjhub/createProject` 明确未实现；getReleases/getArchive/installEnqueue/卸载/许可/云项目等尚无当前 shell/core literal handler 证据，需逐项接自己的服务。本地 UI 身份和作用域仅是 GameCowork 本地模式，不能当作编辑器许可。 | 真实模板目录、ProjectVersion 和所选引擎一致；实际编辑器路径/版本/模块/磁盘检测；取消和失败无残留；编辑器许可独立验证，fixture 不能冒充安装、激活或云项目成功。 |
| **P1 · 原生窗口、桌面设置、更新、保活和桌宠** | 两代桌面按钮已向本地 HTTP 发送最小化/最大化/关闭；Rust 转发 native event，headless 模式明确没有窗口。HTTP/函数契约只能证明发送，不能证明 Windows 几何状态。`tauri/get/setUpdateChannel`、保活/隧道、`pet/*`、newWindow，以及 check/apply-update、traffic-lights 等原入口仍须各自复核。 | 隔离真实 wry 窗口的拖动/resize/最小化/还原/关闭；只清理自有 PID、core 和孙进程；逐项确认偏好实际生效及失败状态；版本更新与发布来源保持分离。 |
| **P2 · AI 资产生成、图片/音频/视频/3D 与资源预览** | 侧栏入口保留；两代 [GUI](restored/frontend/dist-beautified/assets/index-BRxZ4eG7.js) 已在本地模式转入自己的“生成 Provider 尚未配置”页面，原资产/Canvas iframe 不挂载，shared bridge 不发送 auth 或项目数据；非本地宿主保留原逻辑。契约及浏览器菜单点击已验证未请求原域名。图片/视频/3D Provider 仍是后续阶段，pending 不是生成实现完成。 | 本地资源加载/预览/保存/定位；自有 Provider 配置与认证；任务进度、取消、失败和真实产物一致；配置完成前不冒称可生成。 |

按依赖推进：先完成 Agent 对话与文件/终端宿主闭环，再补本地配置和自定义能力；编辑器桥先单工程后多工程，远程是独立传输层；资产生成和第三方 Provider 后置。原有入口保留并展示准确的“未配置/正在接入/错误”状态，不以隐藏入口、假数据成功或原服务嵌入页面替代实现。

本次复核只新增扫描工具、临时矩阵和本节；没有修改已验收的前端、app 装配产物或原软件，也没有发起任何外部请求。未做的真实用户流程按上述门禁继续领取，不能沿用历史提取报告中的“完整实现”结论。

## CLI 恢复与本地聊天验证（2026-10-01）

本轮确认 CLI 主 carve 是 Bun 的 CJS 工厂表达式，结尾没有调用工厂；直接编译旧 carve 并不能证明 CLI 已启动。当前实际构建输入是 `restored/cli-gamecowork/cli-main.beautified.js`，由 `tools/restore-cli-entry.mjs` 生成带实际调用的 CommonJS 入口，再用 `tools/build-cli.ps1` 和 Bun 1.3.11 编译。没有启动或改名复用原软件 CLI。

- 版本、帮助：恢复入口实际返回 `1.0.0-release.57`，`--version` 和 `--help` 均退出 0。
- 资源：`tools/extract-cli-text-assets.mjs` 只读解析原二进制的声明资源，恢复 **28 项**到 `restored/cli-gamecowork/resources/`，包括内置 Agent/Skills、例子、策略、Web UI 与两个通过 `WebAssembly.validate` 的 WASM。`resources/restore-manifest.json` 记录来源二进制 SHA256、每项偏移及原始/恢复 SHA256。旧 `MIN_LEN=2048` carve 会漏掉 1,809 字节的 `general-purpose.toml`，因此历史“明文全部提取即语义完整”不能作为运行验收。
- 状态隔离：CLI 配置、兼容目录和内置 Agent/Skills 缓存使用明确的 `GAMECOWORK_CLI_HOME`；另支持 `GAMECOWORK_USER_DATA_DIR` 和 `GAMECOWORK_CLI_RESOURCE_DIR`。没有改写系统 HOME/USERPROFILE。`GAMECOWORK_DISABLE_AUTO_UPDATE=1` 跳过自动检查；本地 Provider 模式物理停用原 LiteLLM、Unity UOS/Unity metrics、Sentry 采集和 OpenTelemetry SDK 初始化入口。
- 自有 Provider：`GAMECOWORK_LOCAL_PROVIDER_MODE=1` 配合 `CUSTOM_AUTH=1` 使用用户配置的 API。Core W9e 形式的项目设置仍可保留网关字段，CLI 从 `contentGenerator.overrides.model.authType` 选择实际驱动，不要求 GameCowork 云账号，也不把本地身份当作第三方服务认证。未配置自有 Provider 时不会默认启动云 OAuth 登录。
- 单 CLI 实测：自编译的受控 CLI + loopback OpenAI fixture 已完成 ACP initialize、session/new、分块回复/结束帧、取消与底层 HTTP 中止、进程重启后恢复同一持久会话及续聊上下文。测试没有使用真实服务、密钥、编辑器或真实项目。
- 验证：`node --test tests/cli-recovery.test.cjs` **20/20 通过**；`tests/cli-runtime-smoke.mjs --prewarm` 对当前 guarded12 编译包的 **19 项检查通过**，包括从未配置的默认目录预热后，首次传入新 UI resume UUID、读取目标工程自有驱动、本地组织查询准确返回 unavailable，以及“无厂商网络尝试”。测试明确种入旧官方 TJGenerators MCP 配置和自有 OTLP fixture 环境，仍不发起厂商请求、不改原配置。该测试包 manifest 明确 `testGuardIncluded:true`，仅用于验收，**不得装配为用户运行包**；正常包由同一 source 编译并带资源目录。
- HTTP 桌面宿主链路：`tests/core-chat-smoke.mjs` 使用实际 Rust/Core/自编译 CLI，此前连续三轮各 35/35 通过，本轮加入无厂商网络尝试的正式断言后 **36/36 通过**。覆盖真实自有模型配置、双工作区并发独立分块回复、正常 cancelled 终帧与真实 HTTP 中止、read-file 工具将 fixture 字节按匹配的 tool-call ID 返回 Provider、父进程退出/重启、先 history/load 后模型操作的持久会话恢复，以及携带第一轮上下文续聊。测试通过真实 `config/refreshProfiles` 刷新工作区模型，检查 HTTP 与内层失败，不再吞掉不存在的 `config/reload`。旧认证恢复时序失败已通过 Core 的持久模型索引回退修正；这些证明仍不能代替 Chromium GUI 门禁。
- UI 特有后台扩展曾产生三次 `.invalid` 请求尝试，guard 调用栈精确定位到 `VXu → qXu → OAuth2Client.performInitialization` 的设备登录。CLI 源已将本地 org/list、org/switch 明确返回 unsupported，并在本地模式进入云 OAuth client 前报 unavailable；其它模式保留原认证流程。guarded07 的独立 ACP/HTTP 门禁及实际 Chromium UI 六项聊天流程已通过。
- 后续合并聊天、文件与菜单流程又发现三次 `ai-generator.tuanjie.cn` 请求，编译坐标对应实际 StreamableHTTP MCP `send`，自有 fixture 中也发现自动写入的 TJGenerators `/mcp` 配置。Core 现已使本地项目状态 getter 只读、跳过官方后台 ensure；CLI08 对旧官方资产 MCP 在运行时标 disabled，并在真实连接入口明确报 unavailable。用户自有 MCP 和保存的配置不被覆盖。guard 现在记录 hostname、去 query 的安全 pathname 和更深调用栈，界面门禁检查所有网络尝试，不只统计 `.invalid`。CLI08 的 ACP19/HTTP36 及实际 Chromium 合并 UI **10/10** 已通过，全域浏览器/Core/CLI 网络尝试均为 0。
- 本轮正常 CLI product06 已由 guarded12 相同源码重编，manifest 的 `testGuardIncluded` 类型为 Boolean 且精确 false，Source/Entry/EXE SHA 全部吻合；`--version` 与 `--help` 都退出 0、stderr 为空。CLI state 目录由宿主初始化；独立测试也先创建自有 CLI_HOME 目录，不触碰真实用户目录。`tools/build-local.ps1` 会拒绝测试包与源码 SHA 不匹配的包。
- 第三阶段实际工具：`tests/cli-actions-smoke.mjs` 在 guarded12 上 **31/31 通过**。从 auto-edit 启动后，使用真实 2D API 单次切到 strict default，证明 write_file/replace 每次都请求批准；批准后真实磁盘内容及 Provider matching tool-call ID 一致，拒绝/待批准取消不写。replace 在同一 prompt 先真实 read_file、核对其 issued ID 和实际原内容后才发 replace，未放宽工具的 read-before-edit 策略。run_shell_command 只执行本轮生成的无害脚本，真实 stdout/stderr、退出码 0/7、拒绝、待批准取消和运行中取消均验收；运行取消确认真实 Node PID 已退出且最终写入未发生。ask 模式不开放文件编辑，命令批准只有 once/reject。`tests/cli-tool-guard.test.cjs` **3/3** 证明脚本哈希、固定 argv/cwd、自有存活 PID 的白名单边界；`tests/mock-provider.test.mjs` **2/2** 证明未知 ID/失败不能推进步骤、partial read 不能当作编辑成功。测试不开放通用 PowerShell 字符串。
- 工具联调发现并修复：CLI 曾在 Windows shell 已退出后再次按 raw PID tree-kill，cleanup 异常可吞实际退出回执。当前完成路径不再清理已退出 PID，取消/超时仍处理活的自有 shell；桌面整体 Job 由宿主持有。另本地 2D mode schema 现在接受 strict default，并直接设 `Zn.DEFAULT`、准确报告 default，不经过中间 auto-edit。实际 Chromium 界面工具门禁 **15/15** 已通过，涵盖正确批准/拒绝/取消、read→replace、真实退出码、运行取消、关闭工作区、作用域和 CRUD；全域外网尝试 0。这些界面结果与独立 CLI 操作分别记录，均不能代替任意第三方命令或真实额度测试。
- CLI 与自有真 Unity Bridge：`tests/cli-editor-bridge-smoke.mjs` 借用唯一隔离 Editor fixture 做 **10/10** 实测：真实窗口、预览 listener 启停、transport/projectRoot/PID/capability URL 透传，port=-1 的真实 adapter 失败保持 false，失败不丢已有 server。capability URL 未输出或存入报告，独立 CLI 结束后 Editor 仍由原 fixture harness 清理。`Yse` 不再把 `tC.success:false` 包装为 true；提取契约同时覆盖嵌套失败与 projectRoot/连接异常。该验证证明 CLI/TCP adapter，实际 JPEG/输入/Chromium 显示另由 Editor Bridge 门禁证明。

可复现命令：

```powershell
node .\tools\extract-cli-text-assets.mjs
node --test .\tests\cli-recovery.test.cjs
$cliTestDir = Join-Path 'F:\AI\AgentMake\temp\GameCowork' ('cli-test-' + [guid]::NewGuid())
.\tools\build-cli.ps1 -OutputDirectory $cliTestDir -GuardFile .\tests\cli-probe-guard.cjs
node .\tests\cli-runtime-smoke.mjs --package $cliTestDir
node .\tests\cli-runtime-smoke.mjs --package $cliTestDir --prewarm
node .\tests\core-chat-smoke.mjs --package $cliTestDir
node --test .\tests\cli-tool-guard.test.cjs
node .\tests\cli-actions-smoke.mjs --package $cliTestDir
```

上述运行测试使用自编译的受控 EXE；原安装目录和 `original/` 始终只读。装配后可追加 `node .\tests\core-chat-smoke.mjs --packaged --package $cliTestDir`，验证实际 app/Core 和 app/宿主，同时要求受控 Agent 与正常装配 Agent 的源码 SHA 一致。已验收范围是本地聊天明确子集；编辑器、远程、资产生成及其它完整流程仍按上方门禁逐项推进。

### Chromium 文件编辑与能力状态复核

两代 `RightSideBarPanel` 的实际 Monaco 原先漏掉 `file.readOnly`，保存回调才拒绝写入。现已在编辑器落实后端只读标志、写入时锁定输入，并显示只读状态。实际 `saveFile` 保留宿主的 `changeId`、原字节 SHA-256 和保存后的 SHA；活动文件、关闭前保存及全部保存都传 `expectedSha256`，成功后才标记干净并更新 SHA，409 保留草稿及可见错误。当前文件无未保存编辑且拥有匹配的保存记录时，可通过“撤销上次保存”调用真实备份恢复并刷新预览。此按钮针对当前面板内的保存记录，不代表已完成持久文件版本历史 UI。

- `tests/frontend-file-contract.mjs` 直接执行两代真实编辑权限、保存/撤销与 EventSource 函数，覆盖后端拒绝、路由归属、脏内容保护和 watcherFailed 关闭；本地原生 watcher 已有明确 rename，前端不再把同目录独立删除/创建猜成重命名。LSP badge 保留入口，只有后端明确 `supported:true`、`connected:true` 才显示绿色；缺少连接证据显示灰色“LSP 未接入”，不能把文本编辑成功当作 LSP 完成。
- `tests/chat-e2e.mjs --files` 使用真实 Rust、Core、受控自编译 CLI 和 loopback Provider，已实际验证 Monaco 编辑后的磁盘写回、Undo 恢复原字节、外部修改后 409 保留草稿、敏感 fixture 的只读编辑器与按钮状态。组合流程还涵盖真实模型配置、多 chunk/取消/工具读取、A/B 会话切换和新浏览器恢复历史。需要严格的完整联网检查时，脚本默认检查浏览器及双 guard 全部外部 fetch/http/net 尝试；诊断不得只搜索 `.invalid` 域。
- 市场页保留并显示真实 `marketplace/listRemote.supported:false` 的未配置来源状态，管理入口仍保留本地技能、扩展和 MCP；`tests/frontend-marketplace-contract.mjs` 直接验证真实 thunk 的未配置与正常列表两条分支。
- 本地首次介绍使用代码内 SVG 和宿主能力状态，避免请求原版官网指南 GIF；原宿主模式保留既有行为。远程与串流仍明确显示正在接入。`tests/frontend-request-contract.mjs` 覆盖这两条分支。
- `tests/frontend-terminal-contract.mjs` 运行两代实际 TerminalPanel effect 和 WebSocket 回调：连接前禁用 stdin 并显示连接中，OPEN 才开放输入，关闭/失败再次锁定。真实 ConPTY 与终端浏览器门禁以对应测试及顶部最新结果为准。
- `tests/frontend-notification-contract.mjs` 验证可选生成日志先 `fileExists` 再真实读取，缺失为空态，其它错误仍传播；自有未配置资产模式不再轮询旧 `Library/AI.TJGenerators/async_generation_notifications.jsonl`，不能用 fixture 假文件掩盖缺失。

本轮实际执行五份前端契约和 `tests/mock-provider.test.mjs`，共 84/84 通过（前端 82、mock 2）。最终 `node tests/chat-e2e.mjs --files --marketplace` 使用 guarded08 实际 CLI、真实 Core/Rust 与 fresh Chromium profile，10/10 场景通过；双 guard 全部外部网络尝试及浏览器外站资源请求均为 0。随后文件/市场定向 UI 5/5 再次确认 LSP 未接入状态。该结果包含真实文件冲突回执 409、未保存编辑保留及可见中文提示；不把隔离 mock 当作已验证真实第三方 Provider 额度、账号或生产服务。

### 真实工具批准、取消与会话操作复核

`tests/agent-actions-e2e.mjs` 使用真实 Rust/Node Core、自编译 guarded12 Agent 和 loopback Provider，全部工作区、文件与脚本位于 UUID temp 目录。每次真实工具结果必须匹配 Provider 发出的 tool-call ID；文件字节、脚本输出及退出码另外从真实执行结果验证。该流程没有 fake Core。可复现命令：

```powershell
node .\tests\agent-actions-e2e.mjs --agent F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12/gamecowork.exe
```

- 本地审批菜单增加明确的 `default`“每次确认”选项；GUI 实际发送 `config/updateSelectMode` 与 `llm/streamChat` 的显式 `collaborationMode:'default',approvalMode:'default'`。CLI 本地 2D 模式契约已同步支持严格 default，不能将它重新报告为 autoEdit。
- 拒绝 `write_file` 的合法 optionId 是 `cancel`，属于 `selected/cancel`；用户跳过/Escape/停止则明确取消。原 UI 混淆两者已修，未知选项安全取消；本地模式不会凭工具 rawInput 的计时字段自动批准。文件批准卡展示目标与内容摘要，只提供真实协议给出的选项。
- Shell 等待器和请求列表以原 session 归属保存；取消/关闭 A 只结束 A 的等待器与流，保留 B。入站 host callback 在等待用户期间记住原 `_hubWorkspaceKey`，关闭后晚到回应仍按 A 回路，不使用当前选中的 B。关闭当前工作区自动恢复剩余工作区记忆会话，记忆 SID 也须匹配其 owner；已关闭 owner 的自动保存明确跳过。
- `replace` 保留“先读再编辑”的实际工具策略，Provider 同一 prompt 先发真实 `read_file` 并验证，再发 `replace` 和单独批准；没有通过放宽策略或伪造读取来使测试通过。
- 真实 Chromium 流程 15/15 通过：拒绝文件不写、批准写入、read→replace、批准等待取消、拒绝命令、真实 stdout/stderr/exit0、保留真实 exit7、运行取消回收自己的 PID、关闭等待批准的 A 不写并恢复 B、正常 rename、失败 rename 保留弹窗/实际行、失败 delete 保留实际行/当前会话、fresh profile + Core/CLI 重启恢复 renamed transcript、真实 delete 移除行并替换当前会话。rename/delete 的失败 UI 用明确的一次错误注入检验，成功和重启读取始终经过实际 Core，未注入假成功。
- 本轮七份前端契约共 104/104 通过，其中 `tests/frontend-approval-contract.mjs` 与 `tests/frontend-session-contract.mjs` 直接执行两代真实监听器、等待器、Redux reducer、对话框和错误契约。实际工具 UI 的双 guard 与浏览器外站请求均为 0，未访问真实 Provider、账号、编辑器或原安装凭据。窗口仍由 headless Chromium 验 UI；native Wry 几何未由此覆盖。

产物位于 `F:\AI\AgentMake\temp\GameCowork\agent-actions-ui-20261001-07`，包括 `actions-report.json`、已验证的脚本哈希、真实工具结果、UI 回应路由与逐项截图。历史脚本中的 `.FAILED` 标记或 HTTP 200 不能作为工具执行成功；以最后 issued-ID 匹配、磁盘结果、真实退出码及当前状态为准。

### 本地媒体、搜索与文件变化复核

`tests/file-media-e2e.mjs` 使用真实前端、Rust 文件服务和实际 Core，不要求先配置模型。PNG 由原生字节构造、GLB/GLTF 是自含 triangle，WAV 是短 PCM，WebM 由本机 ffmpeg 的固定色帧生成；全部素材、浏览器 profile 和输出位于 temp UUID 目录，没有图像生成服务或外部素材请求。

本轮修复两代已存在的断链：本地媒体 URL 使用真正注册的 `/api/tauri/file-explorer/media`，原宿主保留旧 URL；GLTF 按真实 encoding 读取 UTF-8/原有 base64；小视频画面在本地模式放大，避免原始 32px 帧被播放按钮完全遮住。文件外部 rename 同步 tab ID、路径、文件 URI 与导航历史，后续读回能按新路径命中；late refresh 在应用结果时也保护 dirty draft，旧文件名重建不会重新指向已重命名的草稿。

最终实际 Chromium 11/11 通过：PNG 原始像素解码、GLB 与 UTF-8 GLTF 的 WebGL triangle、WAV/WebM 实际 Play/Pause 和时间推进、Unicode 内容搜索打开正确文件并定位第 2 行、clean 文件外改刷新、rename 后继续外改刷新、真实 tree 更新与 dirty draft 保留、旧文件名重建隔离、外部 delete 保留草稿。`tests/frontend-media-contract.mjs` 两代真实 URI/loader/reducer 8/8 通过；本轮八份前端契约组合 112/112 通过，浏览器错误及全部外部请求/guard 尝试均为 0。

```powershell
node .\tests\file-media-e2e.mjs
# 可用 --ffmpeg 指定已有本机 ffmpeg；没有 ffmpeg 时明确失败，不下载代替。
```

本轮产物为 `F:\AI\AgentMake\temp\GameCowork\file-media-ui-20261001-07`，包含 `media-report.json` 和实际图像、模型、播放器、定位及 dirty rename/delete 截图。已验收小文件本地预览；第三方媒体生成 Provider、所有编码/大文件/range 请求、native Wry GPU/窗口几何仍需各自门禁，不能由此结果代替。

### 终端连接状态与布局回归复核（2026-10-01）

完整门禁曾暴露实际 TerminalPanel 空白：WS 已收到真实 PowerShell prompt，但初次 resize 为 159×1。原因是连接状态提示新增的 inline `position:relative` 覆盖了终端容器原有的 absolute 四边定位，容器内部绝对定位的 viewport 因此失去高度。两代 TerminalPanel 已恢复既有容器定位，状态提示仍以该容器为定位基准。

本次执行 `node --test tests/terminal-e2e.mjs` **7/7 通过，0 skipped**，产物位于 `F:\AI\AgentMake\temp\GameCowork\tests\terminal-e2e-ccac8835-6ea0-4ce6-8c3a-eb79f08f63ce`。实际 Chromium DOM 的终端容器为 absolute、高 235.7px；截图可见自有项目 cwd、真实 prompt 和命令执行结果。驱动在真实 prompt、输入已开放及有效 viewport 尺寸出现后才输入，等待两个实际磁盘文件都写完后才读取 PID。失败时另存 computed styles/bounds、ARIA、WS 帧与失败请求的 body，避免把命令回显当作执行成功。

同轮仍验证拒绝外部 Origin/未打开 cwd/remote/非法尺寸、真实二进制输入、111×37 resize、实际退出码 9、A 关闭不影响 B、浏览器关闭回收 PTY，以及仅终止自有 root PID 时回收其 PTY/后续子孙并保留独立编辑器 fixture；所有自有测试 PID 已精确结束。浏览器截图中的可选生成器日志读取报错来自未创建的 `Library/AI.TJGenerators/async_generation_notifications.jsonl`，不属于终端执行失败；fake core 未覆盖的初始化/历史请求也保留准确错误。上述 fixture 不证明真实编辑器、第三方 Provider 或生成器服务可用。

### 自有编辑器桥与具体预览页验收（2026-10-01）

新增 `restored/editor-bridge/` 是 GameCowork 自有 Editor-only UPM 包 `cn.gamecowork.bridge`，没有安装或复用原 Codely 桥。只读库存确认本机可用的 Unity/Tuanjie 编辑器程序与 Managed/Mono 文件；原安装目录及真实用户项目始终未修改。桥在当前工程 `Temp/.com-unity-gamecowork.json` 发布真实 TCP 端口，`project_path` 指向 Assets，握手含 URL 编码 PROJECT_ROOT、SERVER_VERSION=2 和 FRAMING=1；后续使用 8 字节大端长度、原 request_id 的请求/响应。管理请求支持真实窗口枚举和本地服务启动/状态/停止，未知工具与其它窗口类型明确报错。

预览初始传输为明确声明的 `image-frames`，直接读取真实 GameView 渲染纹理；SceneView 在实际相机渲染完成时复制纹理，避免它随后清空并复用该 RT 绘制透明 handles 而读到黑帧。此方法依据 [Unity 2022.3 SceneView 参考源码](https://github.com/Unity-Technologies/UnityCsReference/blob/2022.3/Editor/Mono/SceneView/SceneView.cs) 中的相机/RT 生命周期查证，不读取桌面或其它程序画面。相机快照、JPEG 与队列均有界；15 秒单调时钟帧消费者租约到期会释放自己的捕获资源，保留既有编辑器窗口及本地控制 listener。关闭时仅释放通过该捕获注入的按键/鼠标按钮，不终止编辑器进程。

`windowBridge.html` 的实际入口已加载其独有 `assets/gamecowork-image-frames.js`。它通过受限本地 capability URL 读取真实 JPEG，校验 frameId、尺寸与 2 MiB 上限、实际解码并绘制 canvas 后才回报 streaming；停止/切换废弃晚帧，断桥与输入拒绝可见，原 WebRTC 分支保留。单槽位 SceneView/GameView 支持，多个视口槽位明确显示尚未接入；没有把 HTTP 健康检查或 WebRTC connected 伪装成画面完成。

本轮最终执行 `node tests/editor-bridge-smoke.mjs` **9/9 通过，0 skipped**，真实 Unity 2022.3.51f1c1 使用已有许可、本地 UPM 和唯一 temp 工程；没有激活、登录、调用原 CLI、原服务或 Provider。产物为 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-271c581e-1bc7-40bb-b23b-369dfdfa595d`：Scene/Game JPEG 为真实立方体画面，Scene 两帧实际字节改变，JPEG SOF 与解码尺寸正确，输出 resize 生效；Scene 滚轮改变真实相机距离，浏览器 Game 鼠标事件由实际游戏 MonoBehaviour.OnGUI 记录；租约过期后 capturing=false、frame=409 且既有窗口实例保持；具体 Chromium 预览页新 frameId/新像素、切换、Stop、断桥状态和截图均实际验证，无浏览器异常、无外站请求、没有 `/signaling/` 请求。自有测试编辑器已正常退出；生成 Library、场景、日志与浏览器产物都留在该 temp 工程。

另执行 `node tests/editor-bridge-smoke.mjs --compile-only --editor E:\TuanJieAllVersion\2022.3.62t16\Editor\Tuanjie.exe`，对已装 Tuanjie 的实际程序集离线编译通过；这只证明编译 API 兼容，未启动 Tuanjie，不代表真实 Tuanjie 画面或许可门禁已过。协作的 `tests/cli-editor-bridge-smoke.mjs` 在独立 hold fixture 验证自编译 guarded11 CLI 到本桥的 10 项实际 TCP 操作、身份/transport、失败和停止（未请求 Provider，capability URL 未进入日志）；该编辑器也由自有 harness 正常释放。

以上证明自有桥、具体预览页及独立 CLI 桥请求的明确子集。产品右侧面板经过真实 Rust/Core 的完整打开/安装/布局流程仍须另行集成验收；多工程连接注册、同工程并行多视口、Inspector/Hierarchy/Console/Project UI 捕获、WebRTC/音频、其它编辑器工具及 Tuanjie 实际运行仍未由本轮证明。源码/安装/接口边界详见 `restored/editor-bridge/README.md` 与最近 AGENTS.md，不把这一阶段写成宣传全功能完成。

### 多流、共享窗口与完整产品预览入口复核（2026-10-01）

自有 UPM 已从单捕获扩为最多六个真实 capture、十六个布局槽位：streamId/selected instanceId 固定实际编辑器窗口，frame、resize、input、stop 和 15 秒 lease 独立；compositeId 隔离每个接收器。多个 capture 共享编辑器窗口的引用，只有桥创建的窗口在最后持有者明确停止时关闭，lease 到期保留窗口。Compound 布局中的 Scene/Game 使用实际独立帧；其余窗口原槽位保留并显示准确 unsupported 原因，未绘制 mock Editor UI。

`node tests/editor-bridge-multistream.mjs` **6/6 通过**（产物 `temp/GameCowork/tests/editor-bridge-d63689d5-00fc-4122-8eaf-cebadbfb05fb`），实际验证 Scene A/B 共享 instance + Game 并行变化、独立尺寸与输入/停止、unsupported compound 元数据、互不续租，以及桥自己创建的窗口只有最后持有者停止才关闭。随后包含默认六槽并行解码的具体 `windowBridge.html` Chromium 与编辑器门禁 `node tests/editor-bridge-smoke.mjs` **9/9 通过**（`editor-bridge-c2d863ec-aad7-4975-95f6-88cfb2ddc841`），没有 WebRTC signaling 或外站请求。

Root 将编辑器连接/四个 WindowBridge/精确只读工具接到真实 TCP 身份验证，预览不要求模型或账号；get_state、get_project_root、get_selection 来自实际 Unity API，未实现的资产 listener 明确 supported:false/listening:false。精确旧 stop_offscreen_stream 关闭请求映射到真实停止，未知工具保持错误。原布局 Tauri 调用在本地宿主使用自己的 HTTP 偏好通道。

最终 `node tests/editor-preview-e2e.mjs` **13 项实际检查通过**，使用真实桌面+GUI、Rust/Core、与维护源码一致的 guarded12 自编译 CLI、已安装 Unity 2022.3.51f1c1 和唯一 temp 工程。产物 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-preview-cdd6937c-a6af-4367-8969-a28d71f2ddd7` 已视觉核对：主界面真实工作区选择器/串流/添加视图入口、默认六槽实际 Scene/Game 与准确未接入标签、Scene 滚轮改变实际相机、Game 鼠标被实际游戏 OnGUI 记录、两侧 Scene/Game 同时显示且各自帧 ID 前进、用户关闭后 native streamCount=0、实际编辑器退出后可见断桥、无 Authentication/旧关闭 unsupported toast。Browser/Core/Agent 外站请求尝试为零，page errors 为零；没有配置或调用 Provider。

布局验收曾发现旧测试只断言 two decoded streams，会把默认六槽中两种支持窗口误当成恢复了两槽。视觉复核与缺少 save RPC 证实关闭 callback 没有等待 snapshot/save。两代实际前端现先 await persist 再清空视图；最终门禁严格要求实际 save JSON tabs/slots=2/2、恢复后 canvas slotCount=2，截图确为左右双视口。最终记录的 save 依次为 6/6、2/2、2/2，不再以 fallback 默认布局冒称恢复完成。

该最终 run 的自有 Rust PID16944、Editor PID27244 和 Chromium 都已结束；Library、场景、日志、profile、编译及图片仅留在 temp。最近 editor-bridge README/AGENTS 已同步 API、引用、lease 和验证边界。已验证是本地 Unity Scene/Game image-frames 与精确只读接口；实际 Tuanjie 运行、多工程编辑器连接注册、四种其它 Editor UI 捕获、写入/播放工具、WebRTC、音频及远程仍未由此门禁证明，也不能据此把宣传全部功能标记完成。

### 已装配 app 的完整预览复核（2026-10-01）

`tests/editor-preview-e2e.mjs` 新增 `--packaged`，默认 Source 验证保持原行为。Packaged 模式必须使用实际 `app/GameCowork.exe`、`app/core`、`app/frontend` 和作为隔离工程依赖的 `app/editor-bridge`；先核对正式 Agent manifest 的 testGuardIncluded=false、EXE SHA 与 manifest 一致、正式与 guarded 测试 Agent 的维护源码 SHA 相同。测试仍只执行 guarded12 Agent、已有许可的自有 temp Unity 工程与 loopback 源，不执行原 CLI、真实 Provider、激活或登录。

本轮仅执行一次 `node tests/editor-preview-e2e.mjs --packaged`，**13/13 实际检查通过**。报告绝对路径为 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-preview-ba817bf8-613b-4489-a25d-db4bab7cb67b\result.json`，明确 packaged=true 及四个实际 app 路径；源码 SHA 为 `FD9FC8CE3904DBA677A13B9C5FCC4A3771832DA105FBEEA59E372CE7990FF2EB`。真实工作区/串流菜单、Scene/Game 真画面与实际输入、双侧两帧独立推进、全流停止 streamCount=0、精确 layout save/restore（6/6、2/2、2/2 的实际 tabs/slots payload）、编辑器退出的可见断桥均通过；没有认证或旧关闭 unsupported toast、page errors 或 Browser/Core/Agent 外站尝试。

已视觉复核同目录 `product-two-views.png`、`product-restored-layout.png` 和 `product-disconnected.png`；恢复截图确为左右两槽，而不是默认六槽中的两种支持窗口。自有 app PID29152、Editor PID57204 和 Chromium 均已结束，数据只留在 temp。本结论覆盖已装配包的本地 Unity Scene/Game image-frames 明确子集，仍不代表完整 Editor UI、播放/写入工具、实际 Tuanjie 运行、WebRTC/音频、远程或宣传全部功能完成。


### 第四阶段程序集重载与双独立工程路由复核（2026-10-01）

源码 `node tests/editor-domain-reload-e2e.mjs` **17/17 实际检查通过**，报告 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-preview-fafa73f8-62bc-48a8-a5db-b42dad7f6e36\result.json`。真实 C# 编译与域重载保持同一 Editor PID 并更新 bridge_instance；产品原两槽自动恢复，重载后 Scene 滚轮及 Game OnGUI 输入均改变真实编辑器状态。关闭工作区时再次实际重载，新桥立即与 6 秒后均 running=false/capturing=false/streamCount=0，关闭后的 native start 返回明确 error，旧 receiver 已卸载。自有 Editor56488、壳59888 和 Chromium 均已结束。源截图仍记录一次重载短暂断桥后遗留的连接 toast，这与已排除的 Authentication/旧 unsupported 错误不同，后续状态体验需单独消除误导。

审查发现并成套修复两代 HT/main-GUI stream region：start/stop/status 与回复携固定 workspaceKey/root/requestGeneration，同源 sender 校验，旧工程消息/取消代数/迟到 URL 不得控制当前工程；布局保存只消费已捕获 iframe 的 snapshot。独有 windowBridge composite start/update 在每次 await 后校验取消代数/API，失效成功回复只定向停止原 endpoint 的 own compositeId；page close、用户 stop 与明确重新开始保持一致。`node --test tests/editor-lifecycle-contract.mjs tests/frontend-stream-layout.test.cjs` **14/14** 提取真实函数检查通过，包含两代 scope/await 失效、复合晚返停止及 snapshot source。

`node tests/editor-multi-project-e2e.mjs` **11/11 实际检查通过**，报告 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-multi-project-91f1b47a-ea23-4eb0-b7e4-c7ce78e4e791\result.json`。两个不同真实 Editor PID、独立中文工程路径和桥身份经同一个实际 Rust/Core 宿主固定 workspaceKey 路由到两个真实 windowBridge receiver，同时显示四个实际 Scene/Game 帧；A 红/蓝底、B 绿/紫底截图已核对。各项目真实相机/Game 输入互不影响；故意把 A 自有连接文件端口指向 B 时在真实 welcome 工程身份检查被拒绝。主 GUI 能切换两工作区并丢弃活动 B 时旧 A 的 start/stop/status。A 重载、停止、关闭中重载均保持 B 真实帧推进；延迟实际成功 composite HTTP 回复至用户停止之后再放行，未复活 A，也未停止 B。无 page errors 或 Browser/Core/Agent 外站尝试，自有进程均已结束。

双工程门禁明确 `mainGuiMultiProjectSlotSelectorVerified:false`：已验证是两个独立 Editor 的并发 receiver/原生身份路由与主 GUI 切换隔离，**尚未实现单个产品 sidebar canvas 的跨工程槽位选择/合并布局**。实际 Tuanjie 运行、其它完整窗口、播放/写入、WebRTC/音频、远程仍未证明。以上是第四阶段源码证据，尚未用更新后的 app 装配验证，不覆盖第三阶段包的历史 13 项结论。

#### 真正单 GUI 跨工程四槽与等比画面（本段后续源码）

上述双 receiver 子集之后，已实现产品实际侧栏的工程选择、为指定工程添加 Scene/Game 和停止所选工程预览。两代 HT/render 与独有帧控制器不依赖活动工程的 baseURL；每槽固定 workspaceKey/workspaceRoot，由真实 opened registry 与 Native CPP 项目/PID 握手解析它自己的 listener。每工程使用同 receiver owner 的独立 composite，更新 A 保留 B reader，关闭/重载按原 source 路由；缺失工程显示原槽明确原因并有可取消的固定身份重试，不替换为活动工程。跨工程显式 dashboard 在聊天工作区切换时保留，解决旧 ownerRoot 改变会清空全侧栏的问题。身份/几何持久化成对校验，允许不同工程同类型 view，丢弃 URL/PID/临时 stream ID。

修复实际画面变形：私有 RT 用实际源纹理尺寸做 aspect fit 和黑边，不修改工程相机 aspect、编辑器窗口或游戏分辨率。帧携带 source dimensions 与 contentRect，消费者校验范围/比例，输入按同 contentRect 映射；黑边按下/滚轮拒绝、无目标移动忽略、已有按键/鼠标释放保留。真实源码 `tests/editor-multi-project-ui.mjs` **14/14** 通过，最终报告 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-multi-project-843e7fb5-9661-4c91-8598-d2a711904f17\result.json`，mainGuiMultiProjectSlotSelectorVerified=true。不是两个测试 receiver 窗口：真实单主 GUI 同时显示两个独立 Unity 工程的四个 Scene/Game；明确 A/B 聊天切换、输入互不影响、实际 source/content 比例与黑色像素、raw/UI 黑边不注入、resize 后映射、A reload/stop/close 留 B、固定身份四槽 native 保存/恢复与缺失 A 的布局恢复均通过。截图 `product-aspect-fit-four-views.png` 和 `product-missing-source-restored.png` 已视觉核验，自有 Editor23232/7224、壳57912、Chromium 均已退出。

同质量源码后的 `tests/editor-domain-reload-e2e.mjs` **17/17**，`...\editor-bridge-preview-d0aad978-8182-409d-b453-f6664f272b24\result.json`：重载后真实输入且无被动安装 toast，关闭后接受 receiver 卸载或只保留原缺失槽 decodedSources=0/disconnected；仍检查关闭后 start 的真实 error 及新桥 running=false/capturing=false/count0 立即与 6 秒后两次。自有 Editor59688、壳38400 已退出。Source lifecycle/layout/multi-source 真实方法契约 **18/18**，新增 native layout 身份 **4/4**；实际 installed Unity DLL 编译与直接帧/input/lease后端 **8 项通过、仅浏览器项按参数跳过**。更新后的 own package 对实际 Tuanjie 2022.3.62t16 DLL 离线编译 **2/2**，未跑实际 Tuanjie Editor，不作运行完成声明。已给完整跨工程 GUI gate 加 `--packaged`，等待 Root 正式装配后再跑；当前第四阶段仍属源码，原第三阶段 app 历史不改写为新成果。

## 第四阶段本地自定义管理复核（2026-10-01）

本轮保留“自定义”和设置中的 Skills、Extensions、MCP 原有入口，修复了本地新建实际没有 writeFile handler却显示成功、列表失败被掩盖为空、全局能力文件超出项目预览范围，以及操作未完成时开关重复提交的问题。两代前端同步；Core 使用限定 kind/scope/name 的 `custom/create/read/update`，只处理能力目录下的 SKILL.md 或 gemini-extension.json；不开放全局凭据目录的通用写接口。创建为 create-new，已有目录拒绝覆盖；全局编辑使用真实文件 SHA，冲突保留草稿并要求明确重新载入。子 CLI 超时、非零退出或被终止时拒绝把 partial stdout 当作成功。ZIP 上传先检查目录遍历、链接、中央/本地记录、CRC 和展开总量，再交真实 CLI 安装；临时文件与 CLI TEMP/TMP 留在自有运行时目录。

`node tests/custom-management-e2e.mjs --output F:/AI/AgentMake/temp/GameCowork/custom-full-ui-20261001-final` 实际通过 22 个场景。使用真实 Rust 壳、真实 Core、guarded 自有 CLI 12 与真实前端，覆盖项目及全局技能/扩展创建、编辑、启停、移除、重启恢复；技能 ZIP 实际安装与移除；非法名称、重复创建、遍历 ZIP 和编辑 SHA 冲突反例；UI 批准后真实 activate_skill 读取保存的 instructions，继发 read_file 返回磁盘哨兵；HTTP MCP 真实 initialize/tools/list、批准 echo 工具调用、启停、改名、重启后再次调用与删除。全部结果按实际 issued tool ID 匹配，不能用成功外层或空列表替代。报告为 `F:/AI/AgentMake/temp/GameCowork/custom-full-ui-20261001-final/custom-report.json`，截图在同一目录；仅保留预期 EEXIST、Unsafe ZIP、stale SHA 三个拒绝结果，额外 RPC/浏览器错误为 0，浏览器与 Core/Agent 的所有外站尝试均为 0。

无模型时 MCP 配置保存明确延迟连接：`custom-mcp-ui-20261001-03` 的独立 7 个场景已通过，配置阶段没有 MCP 网络请求，选择自有模型后才实际初始化与调用。新契约为 `frontend-custom-contract.mjs` 8 项、`core-custom-contract.mjs` 4 项、`core-custom-runner.test.cjs` 8 项，20/20 通过；相关全量前端 120/120、Core 44/44 通过。验证仅使用 headless Chromium 对真实 HTTP 宿主，不覆盖原生 Wry 窗口几何；任意第三方 stdio MCP 命令与外部市场下载未自动执行。自有市场来源仍显示未配置；本轮没有装配 app，也没有改动冻结的 CLI 或原软件安装。

## 第四阶段本地 Unity Insight 索引复核（2026-10-01）

`restored/shell/src/insight.rs` 接通现有 `/api/tauri/unity-insight/*` HTTP 契约与真实恢复 worker，前端原有“索引”设置、Insight 侧栏、源码/内容搜索与引用入口保留。Worker 使用 SQLite、C# Tree-sitter、ShaderLab 文本和 Unity YAML/GUID/调用关系；没有模型、远程 embedding 或模拟索引。`restored/cli-unity-insight/resources/restore-manifest.json` 记录只读原 worker 版本 `0.0.1`、protocol 4、源码 commit、六个原始 bundle 的 SHA 及实际 parser 资源版本/许可证/字节 SHA。恢复脚本只复制公开 parser 资源，不运行原 CLI、不编辑 node_modules、不覆盖维护 worker。

所有索引及 metrics 状态写入宿主自有 `data/insight`，不写工程 `.gamecowork-cli/UnityInsight`，不改系统 HOME/USERPROFILE/APPDATA。宿主显式关闭 metrics，worker preload 限定读取授权工程/资源/缓存，写入只允许缓存，拒绝外站与子命令。Watch debounce 为 500 ms；进度和 indexedAt 来自真实 worker。每个工程独立启动锁；关闭立即废弃该 generation、唤醒 pending 并释放自己的 Job，迟到 initialize 不得重新入表，A 的慢初始化不阻塞 B。

本轮执行 `node tests/insight-resource-contract.test.mjs` **4/4**、`node tests/insight-worker-smoke.mjs` **18/18**、`cargo test --manifest-path restored/shell/Cargo.toml --offline --locked insight::tests -- --test-threads=2` **3/3**。真实 worker fixture 覆盖 C#/ShaderLab/YAML 内容、实际方法源码、C# 调用边、GUID 入/出引用、修改后去除旧内容、rename 引用更新、force rebuild 与新进程重开 SQLite；Rust 另验证 slow initialize A/close A/B 不阻塞/晚到拒绝和 disable/reenable。资源契约实际校验 WASM 与原字节，并在真实 preload 下拒绝 junction 外部读取、工程写入和子命令。

`node tests/insight-e2e.mjs --binary restored/shell/target/release/GameCowork.exe` 对当前独立 Release、真实 Core、真实 worker 和 Chromium 的 **22/22** 检查通过。实际 GUI 打开自有工程；cold idle 无虚构进度、未打开工程拒绝、建库/查询/watch/A-B 隔离；“索引”设置中的 rebuild/disable/enable 真实生效；Insight 显示材质源码与准确 Shader GUID 依赖、全文搜索显示真实更新 C#；关闭 A 回收 worker 并拒绝旧 scope；重新打开与全宿主/浏览器重启后保留已发布内容和项目停用开关，新 GUI 再显示真实 C#。没有 Authentication toast、浏览器错误或 Browser/Core/Agent/Insight 外站尝试。报告与已视觉核对 PNG/ARIA/HTTP 为 `F:/AI/AgentMake/temp/GameCowork/insight-e2e-6cf4dc5c-d0ad-4832-bec5-82ae5668bb48/summary.json`，worker 18 项报告为 `temp/GameCowork/insight-worker-f264839f-acfb-40fe-9705-5ea0dfb4eed8/summary.json`；所有自有 EXE/Node/Chromium 已释放。

这证明维护源码下的本地索引闭环；当前 app 尚未包含第四阶段装配。大型项目性能、所有语法/资产类型、远程工程、模型驱动的 Insight 子代理问答，以及原生 Wry 窗口几何不由此结果证明。该测试可用 `--url` 指向授权的 loopback 宿主，仍只创建/操作自己的 temp 工程。

### 索引轮次目录绑定与真实模板复核

Root 的 max-turns HTTP 路由将 workspaceDir 绑定到实际授权工作区，user scope 去除传入的 workspaceDir。独立真实 Core 检查先通过十个目录绑定/拒绝与实际字节不变场景，再准确发现非默认轮次的 HTTP 200 内层报 `Missing seed template for unity-insight.toml`，原值没有改变。两份 Core 的 `Ayi` 现优先读取宿主显式 `GAMECOWORK_CLI_RESOURCE_DIR/builtin-agents/unity-insight.toml`，保留原有三种回退与缺失错误；实际模板来自维护的自有 CLI 资源，SHA256 为 `D7480E163846AC3BF137809B1D0B77D9F15AB27EB198A150A8915640E80F3A98`，不读取原软件资源。

本轮 `node --test tests/insight-max-turns.test.cjs` **8/8**；`node tests/insight-settings-scope-smoke.mjs` **14/14**，保持 scope 十项并真实写入项目 27 轮、用户 34 轮，再完整重启宿主/Core读取相同值。真实工程与用户 TOML 位于各自 own fixture 路径，B/未打开工程原字节未被 A 请求修改。外站尝试为零，自有 PID 已释放；报告 `F:/AI/AgentMake/temp/GameCowork/insight-settings-scope-dbcf46ad-af49-48ea-96bb-24528e535367/summary.json`。两份 Core `node --check` 通过，verify-local 基础项和 RealCore 分支已纳入对应门禁。

`tools/build-local.ps1` 已核对完整递归复制 `package.json`、整个 `bundle` 和整个 `resources`：六个真实 worker、三个本地入口/路径/guard helper、C# Tree-sitter JS/runtime WASM/grammar WASM、两份许可和恢复 manifest 均在范围内。此轮只做源码与脚本范围核对，正式 app 装配后仍须执行 packaged 索引门禁核对每个资源实际 SHA。

### 最终 873 文件包的索引、设置与基础链复核

最终装配 `temp/GameCowork/build/94147966bf0e4c2881dff959c2f22a09` 包含 Ayi 模板路径修复。随后顺序执行以下四个隔离门禁，均使用实际 `app/GameCowork.exe` 和 `app/core`，没有修改冻结的生产源码：

- `node tests/insight-e2e.mjs --packaged --package F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12` **22/22**。实际 GUI 与 worker 读取 `app/frontend`、`app/unity-insight`，APP_ROOT 明确指向 app，启动前递归核对 package/bundle/resources 全部 **16 文件** SHA 与维护源码一致；正常 Agent manifest Boolean false、EXE SHA 与 guarded12/source 一致。报告 `F:/AI/AgentMake/temp/GameCowork/insight-e2e-a92da110-604b-4f82-bf8a-84251d14b7fe/summary.json`。
- `node tests/insight-settings-scope-smoke.mjs --packaged --package F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12` **14/14**。新 packaged 参数强制实际 app EXE/Core，并从 **app/cli/resources/builtin-agents/unity-insight.toml** 读取真实模板；Core 与模板 SHA 对源一致。十项授权目录绑定/拒绝、项目 27 轮和用户 34 轮写入、完整宿主/Core重启读取相同值全部通过。报告 `F:/AI/AgentMake/temp/GameCowork/insight-settings-scope-ab099118-35fc-4e8e-814c-99040cee7afd/summary.json`。
- `node tests/real-core-smoke.mjs --packaged` **54/54**，报告 `F:/AI/AgentMake/temp/GameCowork/real-core-smoke-1f9a250f-451d-4976-b8f0-49519e726406/summary.json`；只使用自有 default/A/B fixture，没有启动编辑器或 Provider。
- `node tests/core-chat-smoke.mjs --packaged --package F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12` **36/36**，报告 `F:/AI/AgentMake/temp/GameCowork/core-chat-71c523cf-109f-4742-994e-47960811a2b9/summary.json`；真实 Core/自编译 guarded CLI 到 loopback 模型，实际多帧、取消 HTTP、matching read tool bytes、A/B 并发、完整重启与历史恢复均通过。

四轮外站尝试均为零；索引浏览器错误为零。已再次精确核对自有 PID：Core 73296、Chat 15416/72668、Insight 宿主 72424/24888 与 worker 26504/24504/69380/73452、Scope 72532/30408 全部退出。所有 fixture、配置、SQLite、mock、日志、Chromium profile 与截图仅在统一 temp。该证据补充了上文源码门禁，确认上述本地索引/设置/基础功能已在最终包运行；仍不代表远程工程、真实第三方额度、模型 Insight 问答、大型项目性能或所有资产/语言支持。

### Tuanjie 运行门禁准备（尚未启动编辑器）

仅只读安装元数据与自有模板：`E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe` 的 ProductName 为 Tuanjie，ProductVersion 为 `2022.3.62t16_ab17684acf1d`；其真实 `cn.tuanjie.template.3d-8.1.4.tgz` 场景为 `Assets/Scenes/SampleScene.scene`。提供的自有模板工程保存同样 `.scene`，ProjectVersion 同时含实际 m_EditorVersion/m_TuanjieEditorVersion。Core 的 hRi 优先识别 Tuanjie 字段，真实索引 worker 也声明 `.scene` 的 Unity-YAML 解析；CPP/UnityEditor 命名空间是共享接口，不能仅根据名称把实际 Tuanjie 进程当成 Unity。

既有 `editor-preview-e2e --editor` 虽可替换程序路径，但工程版本和保存场景仍硬编码 Unity。仅测试驱动现新增 `--engine`、`--editor-version`、`--template-project`：从 EXE 元数据验证真实产品/版本，拒绝伪装或版本串选；完整模板只从 own temp 克隆 Assets/Packages/ProjectSettings，保留 manifest 原依赖、原场景字节，再在 clone 注入本桥；仅生成的 temp fixture 保存 Tuanjie `.scene`，共享 C# fixture 原件未修改。运行时会要求实际 native 场景文件存在，并通过真实 Core 检查 engineType/root。`node --test tests/editor-engine-fixture.test.mjs` 的 **4/4 前置准备契约**和 JS syntax 通过，产物 `F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-engine-prepare-c6fe831b-3654-400c-90ad-057864d24a75`；没有执行 Editor/GPU、激活、登录或读取许可账号日志。

这仍是准备阶段，不代表 Tuanjie 的实际画面、输入、许可或完整模板导入通过。最小空工程 runtime 可使用明确 Tuanjie 元数据与 native 场景；完整模板 clone 含全部真实 UPM 依赖，须先准备自有缓存/受控公开包 mirror。当前 preview driver 每轮使用新 UPM_CACHE_ROOT，尚无缓存 seed 参数，不能把绕过完整 Package Manager 或裁剪 manifest 当作完整模板验收。Core/CLI/桥/app 生产输入本轮保持冻结。


### 已装配 app 的本地自定义管理复核（2026-10-01）

本轮仅执行一次 `node tests/custom-management-e2e.mjs --packaged --agent F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12/gamecowork.exe`，对 Release 装配 build `94147966bf0e4c2881dff959c2f22a09`（873 个资源）实际通过 **22/22**。报告为 `F:/AI/AgentMake/temp/GameCowork/custom-management-e2e-1d31dd9c-dc4c-42ef-ac82-e49c9b0ac7e4/custom-report.json`，包含 packaged=true、实际 `app/GameCowork.exe`、`app/core`、`app/frontend` 以及 packagedAgentSourceVerified=true；没有以恢复源码目录的 Core/前端替代装配版。

正式 `app/cli` 的 manifest 明确 testGuardIncluded=false，正常 EXE hash 已核对；测试仅执行 guarded12 Agent，维护源码 SHA 与正式 Agent 相同，均为 `FD9FC8CE3904DBA677A13B9C5FCC4A3771832DA105FBEEA59E372CE7990FF2EB`。项目及全局 Skills/Extensions 的创建、真实编辑/保存、启停、ZIP 实际安装与移除、重启恢复和删除、SHA 冲突草稿保护及拒绝反例均通过；真实 UI 批准 activate_skill→read_file 两步回执，HTTP MCP 配置、实际 echo 调用、启停、改名、重启后的再次调用及删除均通过。视觉复核 `12-mcp-restarted.png` 可见实际最终 CONFIRMED，回执也按本 mock issued tool ID 匹配验证。

仅记录重复创建、遍历 ZIP 和过期 SHA 三个预期拒绝；额外 RPC 错误、browser errors 和 Browser/Core/Agent 所有外站尝试均为 **0**。浏览器、自己启动的 app 与 mock listener 已清理。该门禁是 headless Chromium 对实际装配 HTTP 宿主的管理/聊天流程，不覆盖原生 Wry 几何、任意第三方 stdio MCP 命令或外部市场下载，也不替代装配版索引与编辑器的各自门禁。

### 第四阶段正式 873 文件包编辑器验收（2026-10-01）

针对 Root 最终装配 build `94147966bf0e4c2881dff959c2f22a09`，按顺序各执行一次（未同时运行两套 Unity 重载）：

```powershell
node tests/editor-domain-reload-e2e.mjs --packaged --agent F:\AI\AgentMake\temp\GameCowork\cli-guarded-20261001-12\gamecowork.exe
node tests/editor-multi-project-ui.mjs --packaged --agent F:\AI\AgentMake\temp\GameCowork\cli-guarded-20261001-12\gamecowork.exe
```

两项分别 **17/17、14/14，通过并退出 0**。实际运行为 `app/GameCowork.exe`、`app/core`、`app/frontend` 与工程依赖 `app/editor-bridge`；Agent 执行仅用 guarded12 测试包，预检正式 Agent testGuardIncluded=false、EXE SHA 与 manifest 一致，正式/guarded 维护源码 SHA 相同：`FD9FC8CE3904DBA677A13B9C5FCC4A3771832DA105FBEEA59E372CE7990FF2EB`。运行前逐文件核对 Source/app bridge **19/19 SHA 一致**，账本 `F:\AI\AgentMake\temp\GameCowork\audit-2026-10-01\editor-bridge-packaged-hashes-94147966.json`；没有手改正式包。

重载报告为 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-preview-558c754f-3860-4e23-8152-283fe6f04991\result.json`。同一自有 Editor 的实际程序集重载、原两槽恢复与真实输入、关闭中再次重载、拒绝迟到 start、无 decoded source、Native bridge immediately/6 秒后 running=false/capturing=false/count0 均通过；Editor73540、app73700 与 Chromium 已退出。

单 GUI 双独立工程报告为 `F:\AI\AgentMake\temp\GameCowork\tests\editor-bridge-multi-project-7ddb735e-b47b-4590-8901-0e6ebf9518c1\result.json`，packaged=true/mainGuiMultiProjectSlotSelectorVerified=true。实际四个 Scene/Game 画面、A/B 聊天工程切换保留固定 source、source/content 比例与黑色像素、raw/UI 黑边点击不注入、resize 后真实输入、A reload/stop/close 留 B、带固定身份但无 capability/PID 的四槽保存/恢复、缺失 A 的布局只显示原工程未打开而不替换为 B 均通过。已视觉核验同目录 `product-aspect-fit-four-views.png`、`product-a-reloaded-b-retained.png`、`product-missing-source-restored.png`，立方体自然比例且黑边真实，缺失 A 仍有独立标签及原因、B 两画面继续存在。Editor73612/70352、app58860 与 Chromium 均已退出。两 run 均无被动安装/Auth toast、page errors 或 Browser/Core/Agent 外站尝试，所有 Library、profile、场景、日志、截图只在唯一 temp。

本正式包结论覆盖本地 Unity 的跨工程 Scene/Game image-frames、输入、布局与生命周期；不扩大为其它完整 Editor UI、实际 Tuanjie 运行、编辑器写入/播放、WebRTC/音频或远程。该验证未使用真实 Provider、原 CLI/桥、真实用户工程、激活或登录。
