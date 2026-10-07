# codelyreversebackup — 原版 Codely 功能提取库

2026-10-06 目录导航：原始桥、协议、字符串、模块窗口和来源 manifest 保留现有功能分组及字节；旧研究计划进入 [history/plans/](history/plans/README.md)，归档路径和 SHA-256 见 [history/organization/](history/organization/README.md)。用户指定的本轮临时脚本、日志、研究中间稿与验证输出进入 `work/2026-10-06-organization/`，由 Git 忽略。实际维护输入在 `src/`，当前功能进度只见 [RESTORE_STATUS.md](../RESTORE_STATUS.md)。

> 2026-10-02 原包复核补充：[真实资产生成与画布来源审计](api/asset-generation-and-canvas-source-audit.md)直接读取实际原 EXE / 随包资源，并沿原包引用取得匿名公开客户端。旧 T1–T17 中部分结论来自已改动的维护副本；T17 的七条新增字符串不能归因于原厂 canary.2。“下轮候选清空 / 提取闭环”不覆盖真实远端生成、Canvas 内部和服务端。后续以逐项来源、SHA 和可复核行为为准。

> 提取日期: 2026-10-01 · 来源: `original/` 只读镜像 + 本机 PackageCache
> 用途: 按 [HANDOFF.md](../docs/history/HANDOFF.md) §4/§5 的未完成项，从原版继续反编译功能逻辑，
> 供 GameCowork 自研直接取用，减少重复开发。所有原版资产只读参考、记录来源/SHA，
> 不得改名分发（见项目 AGENTS.md 隔离规则）。
>
> **历史提取计划: [原 REVERSE-PLAN.md](history/plans/2026-10-01-reverse-extraction.md)（2026-10-01 制定；已归档）**
> 已完成侦察并内嵌成果：壳的 52 个自有 Rust 模块清单（含 LSP 7 模块、frp/tunnel 远程三件套、
> pet/drill/push）、LicensingClient .NET 关键类型、方法工具箱（M1-M6）与任务单 T1-T5。
> 执行 agent 按任务单串行领取即可，**不要重做侦察**。
> **第二轮 T6-T10 已完成（2026-10-01）**：core 业务域深挖（会话检查点/MCP OAuth/config 记忆与 allowlist/
> context 引擎与 Unity 工具目录/市场与反馈与引导），成果在 api/ 五篇新文档，侦察结论见 REVERSE-PLAN §6。
> **第三轮 T11-T12 已完成（2026-10-02）**：core↔CLI ACP 扩展方法总表全量提取并收口 REVERSE-PLAN §6 遗留三域
> （[api/acp-extension-surface.md](api/acp-extension-surface.md)）+ 壳自有 HTTP 面全表与 tjhub 事件族
> （[shell-logic/shell-http-surface.md](shell-logic/shell-http-surface.md)），见 REVERSE-PLAN §7。
> **第四轮 T13 已完成（2026-10-02）**：Agent 工具注册表 54 全表 + llm/模型域 + 命令代理面 + acp/\* 16 handler
> （[api/agent-tools-and-llm-surface.md](api/agent-tools-and-llm-surface.md)），见 REVERSE-PLAN §8。
> **第五轮 T14 已完成（2026-10-02）**：CLI 斜杠命令树 60+ 全表 + Swarm 协议 + 审批/seatbelt/循环检测/hooks 运行时内部
> （[api/cli-command-tree-and-runtime.md](api/cli-command-tree-and-runtime.md)），见 REVERSE-PLAN §9。
> **第六轮 T15 已完成（2026-10-02）**：桥 Tools 26 管理器逐动作目录 + own editor-bridge 差距表
> （[api/bridge-tools-action-catalog.md](api/bridge-tools-action-catalog.md)），见 REVERSE-PLAN §10。
> **第七轮 T16 已完成（2026-10-02）**：insight worker 管线（19 表/边类型/prefab 位标志）+ yargs 解码进程参数树 31 组
> （[api/insight-pipeline-and-cli-process-tree.md](api/insight-pipeline-and-cli-process-tree.md)），见 REVERSE-PLAN §11。
> **第八轮 T17 已完成（2026-10-02，收尾轮）**：canary.2 内容级差分（翻倍=sqlite3 打包膨胀）+ 前端逐功能 UX 清单，
> 下轮候选清空（[api/canary2-content-diff-and-ux-inventory.md](api/canary2-content-diff-and-ux-inventory.md)），见 REVERSE-PLAN §12。

## 资产索引（每项 → 对应 HANDOFF 缺口）

| 资产 | 内容 | 服务于哪个缺口 |
|---|---|---|
| **api/asset-generation-and-canvas-source-audit.md** + **asset-generation-and-canvas-source-evidence.json** | 实际原壳 / Core / CLI 字节、iframe 边界、匿名当前生成 / Canvas 客户端；四截图功能矩阵、真实模型描述 / 参数 / SSO 生成及轮询、参考 / 手绘 / 音频 / 历史 / 图节点，附来源与未知项；纠正维护改动的原厂归因 | 真实 AI 资产生成与 Canvas 功能对照；不作为功能已恢复的验收 |
| **shell-logic/** ✅T1 完成 | cowork.exe（Rust 壳）逻辑还原：[commands.md](shell-logic/commands.md)（91 条壳独有消息逐条结论）、[lsp-subsystem.md](shell-logic/lsp-subsystem.md)（LSP 9 模块+内置 server 表）、[tunnel-remote.md](shell-logic/tunnel-remote.md)（frp 协议/机器注册表/移动端聚合）、[tjhub-api.md](shell-logic/tjhub-api.md)（Hub stdio JSON-RPC 方法表/控制面 URL/登录流）、[unity-shell-side.md](shell-logic/unity-shell-side.md)（命名管道/vfs_*/远程窗口桥/insight serve 锁）、[desktop-shell.md](shell-logic/desktop-shell.md)（单实例/托盘/更新/Toast）、[shell-http-surface.md](shell-logic/shell-http-surface.md) ✅T12（**壳自有 /api/tauri/* HTTP 面全表**：更新三端点/媒体预览/保存对话框/下载代理/嵌入模式/insight max-turns 等 ★新增 + tjhub 事件族 + tauri:// 原生事件）；68 模块原始窗口转储 + raw 证据 + manifest | P1 未接通操作对照、LSP 宿主、原生窗口生命周期、P2 远程工作区 |
| **hub-licensing/** ✅T2 完成 | LicensingClient .NET 反编译：[IPC-PROTOCOL.md](hub-licensing/IPC-PROTOCOL.md)（协议 1.13、`\f` 分帧、42 messageType、通知通道）、[CLIENT-SURFACE.md](hub-licensing/CLIENT-SURFACE.md)（41 CLI 选项、19 Controller、ulf/alf 文件与目录布局、Genesis 云路由）、[TYPES.md](hub-licensing/TYPES.md)（486 类型公共面自动清单） | tjhub 许可域数据形状、IPC 握手设计参考 |
| **hub-installer/** ✅T3 完成 | Hub 本体（tuanjie.exe，Bun 编译）：[tuanjie-exe-cli.md](hub-installer/tuanjie-exe-cli.md)（**52 个 JSON-RPC 注册方法全表** + 前端 tjhub/* 逐一映射、releases.json/modules.json 清单格式、URL 面）、[tools-analysis.md](hub-installer/tools-analysis.md)（process_killer 按 FileDescription 查杀、VS 检测器）、[v2c-and-install-marker.md](hub-installer/v2c-and-install-marker.md)、strings-tuanjie-exe.txt（52 方法/483 URL/612 JSON 键过滤库） | tjhub 安装/项目/设置域实现契约、安装器复刻 |
| **diff/** ✅T4 完成 | 新旧差分：[VERSION-DIFF.md](diff/VERSION-DIFF.md)（壳 canary.1→canary.2 增量清单；**core 载荷 15.8→32.6MB 翻倍**）+ 4 个过滤差分清单 | 版本演进参考、跟进 canary.2 新能力 |
| **index-and-templates/** ✅ 专项 | 索引持久化+模板体系：[insight-index-persistence.md](index-and-templates/insight-index-persistence.md)（worker 代际发布/指针原子切换/GC+本机实证诊断+编辑器列表缓存对照）、[template-pipeline.md](index-and-templates/template-pipeline.md)（Unity Hub asar 逆向+团结 tgz 实证：**核心模板=Editor 内置 tgz，预制内容在 package/ProjectData~，创建由 Editor 物化；反向打包六目录集**）、[GAPS-AUDIT.md](index-and-templates/GAPS-AUDIT.md)（**全量功能遗漏审计清单+优先级建议**） | 启动慢诊断、新建项目模板补齐、总体缺口盘点 |
| **editor-bridge-original/** | 原版桥 C# 源码包全量（427 文件, 74MB, 逐文件 SHA256）+ [ANALYSIS.md](editor-bridge-original/ANALYSIS.md)：原生窗口捕获机制、26 个 Tools 管理器动作目录、协议事实、与你 Bridge.cs 的差距图 | **P1 Inspector/Hierarchy/Project/Console 完整窗口**、Scene/GameObject CRUD、截图到聊天、模态对话框、Job 体系 |
| **api/MESSAGE-LAYERS.md** + frontend-inventory.json | **前端 347 条 invoke 消息 × 持有层交叉**：91 条原版壳独有（你的壳对齐清单）、166 条 core 持有、72 条通用转发 | **P1 逐项清理未接通操作**——壳还缺哪些消息一条不差 |
| **api/session-checkpoints.md** ✅T6 | 会话检查点三层协议：history 17 方法全表、rewind dryRun/code（`_meta.gamecowork.rewindPreview` 结构）、fork `(forked)` 会话、CLI RewindService 快照布局（`<historyDir>/snapshots/`）、`checkpoint_save` 会话更新、压缩 compact、草稿/未读、tabs 上报 | **P1 会话回退/检查点**（此前零文档） |
| **api/mcp-oauth-elicitation.md** ✅T7 | MCP 服务器管理 CLI 组装契约（stdio/sse/http + --scope/--env/--header）、OAuth 流（localhost:3000 回调、well-known 发现、mcpOauthStorage、令牌同步 CLI）、elicitation 仅协议面无 UI 的结论 | stdio/OAuth MCP 补全（自定义管理 22 项未覆盖域） |
| **api/config-memory-allowlist.md** ✅T8 | orgs/profiles 模型、分层记忆文件布局（GAMECOWORK.md 层级/ SUMMARY/rules/assistants）、sharedConfig 键表、shell/MCP allowlist（`~/.gamecowork-cli/policies/auto-saved.toml` TOML 规则格式）、GameCoworkHome 三步迁移、prompts/assistants 目录 | 设置域补全、allowlist 菜单、数据目录迁移 |
| **api/context-engine-and-unity-tools.md** ✅T9 | @ 上下文引擎：7 个内建 provider 行为（file 1500 行/1MB/行号前缀）、repoMap tree-sitter 生成器、剪贴板贴图链路；**core 内嵌 8 个 Unity Agent 工具 schema**（unity_editor/console/script/package/shader/bake/menu_item/screenshot，含 action 枚举与 defaultToolPolicy）+ unity/* RPC 面 + llm/* 直连模型域 | P1 编辑器播放/暂停/写入的 Agent 工具面；对接 editor-bridge 的 core 侧对端 |
| **api/marketplace-feedback-walkthrough.md** ✅T10 | `/api/marketplace` 端点与条目归一化字段、skills/extensions CLI 子命令面、installedList 合成；feedback submitReport 全字段与 project.zip 后台上传状态机；walkthrough 新手引导窗口（drill 3 消息+3 步骤）；generator/listTasks 任务面 | 外部市场来源、反馈上报、首启引导、Provider 阶段任务面 |
| api/acp-extension-surface.md ✅T11 | **core↔CLI(ACP) 扩展方法总表**：`Ur` 全量 `_gamecowork/*` 方法（unity 桥 18 条/会话模式/队列注入/自动继续取消/组织切换/rewind 差分/子代理活动/LSP over ACP 9 条）+ 通知表 `xb` + createSession `_meta` 能力声明；收口遗留三域：ide/*=控制面云 REST（本地优雅降级）、userEnvConfig 对话框 UX（required_envs/guide_url 全字段）、unity/installMcpPackage 完整链路与 openWindowBridge 入口参数契约 | 各域 handler 对端契约；LSP/回退/队列注入的传输层实现参考 |
| api/agent-tools-and-llm-surface.md ✅T13 | **Agent 工具枚举全表 54 个**（文件/检索/网络/规划/记忆/子代理 task+job 四件/Unity 族 15 个）+ 每工具 displayTitle/wouldLikeTo 三态文案与 defaultToolPolicy + 特殊工具集 7 个；**llm/\* 十 handler**（streamChat 经 ACP/editCorrector 编辑纠错/loopDetect 循环检测/complete/listModels Ollama 特判等）+ 模型四角色 chat/edit/embed/rerank + onboarding 写入；commands/subagents=core 调 CLI 子命令代理面；acp/\* 16 handler 全表（withdrawLastUserPrompt 等）；pairing=CLI 流式消息配对修复遥测（非远程配对，证伪）、images 无独立域、generator 本地降级开关 | 自研 Agent 工具面/审批策略/循环检测的直接契约；第三方 Provider 阶段的扩展点 |
| api/cli-command-tree-and-runtime.md ✅T14 | **CLI 交互式斜杠命令注册表 60+**（/chat save·loop·export、/fork、/rewind、/restore、/subagent run --background、/tasks、/hooks 六操作+工程信任、/goal set·budget·complete、/init 生成 GAMECOWORK.md（general\|unity）、/upm Unity TCP 重连、/swarm join·leave·send、/mcp refresh·OAuth、/memory add-global·add-project 等）+ Swarm 16 错误码（文件栅栏+邮箱+认领协议）+ **CLI 侧第二套工具枚举**（apply_patch/task_output/task_stop/send_message_to_task/cron 三件/lsp/swarm 四件）+ 审批模式 default/autoEdit/yolo→bypassPermissions 映射与 grant 的 approvalModes/collaborationModes 作用域语法 + seatbelt 六档消费链（SEATBELT_PROFILE→资源解包→sandbox-exec/docker/podman 链，Windows 无沙箱）+ loop policy 分层合并语义 + hooks 事件 9 种 + RewindService 状态机 | CLI REPL 对等实现、子代理/后台任务/长时目标功能补齐清单、Windows 沙箱替代设计边界 |
| api/bridge-tools-action-catalog.md ✅T15 | **原版桥 26 管理器逐动作目录**：ManageEditor 24 / ManageGameObject 14 / ManageScene 4 / ManageInput 12+VirtualInputDevices / ManageScreenshot 10（capture_game_view 禁用指路 exec_runtime_script 录制）/ ReadConsole 3 / 资产域 15（Asset 5+Package 3+Shader 2+Bake 3+GameView 3）/ 执行域 5 族（CSharpScript execution_mode 互斥+ScriptFix 修复管道 10 文件+MenuItem+CustomToolsRegistry+REPL）/ ManageWindowBridge 9（含 offscreen_stream 两动作）/ ManageJob 3+9 Job 类 / ManageDialog click+Win32/Mac 扫描器 / 内部监听脏状态 5；分发机制（ActionRouter/Response 错误带补救指引）；**own 差距表**（own 仅 manage_editor+manage_window_bridge 两命令族，其余 ~90 动作分域标 ❌/🟡） | own editor-bridge 补动作的直接契约（action 字符串+参数名对齐即 core 零改动可用）；安全守卫族清单（WriteGuard/EditorAutomationGuard/ReplGuard） |
| api/insight-pipeline-and-cli-process-tree.md ✅T16 | **insight worker 内部管线**：七文件分工 + SQLite 19 张 STRICT 表/42 索引（symbols/symbol_edges/cs_mentions/semantic_bindings/vfs_entries 物化代次 materialization_generation）+ 同步三模式 full/scoped/incremental（回执 schemaVersion=11/reconcile/skipReason）+ 边类型五种 calls/binds_to/depends_on/instance_of/refs + prefab 位标志 bitmask + **yargs 解码**：进程参数树 31 组全量（mcp 六子命令、extensions install 三源/link/new 样板/Gemini CLI 兼容 config、**serve 三服务器** unity-mcp/web-ui(ACP→WebSocket)/control-plane、**swarm 七子命令** worker 生命周期 spawn/resume/stop） | 自研索引 worker 的 schema/查询直接参考；MCP server 暴露与网页端骨架协议参考 |
| api/canary2-content-diff-and-ux-inventory.md ✅T17 | **canary.2 内容级差分**：旧 core EXE 解包（15.8MB→161 文件）对照——index.js 仅 +18KB 且字符串差分恰 7 条（＋custom/* 统一 CRUD 门面 for commands\|agents\|skills、＋GameCoworkHome 改名三条），**载荷翻倍根因 = sqlite3 构建树打包膨胀（7.76→71.78MB），非功能**；**前端逐功能 UX 清单**：t() 24 命名空间 + 1407 资源键 + 4373 条文案 18 功能域分类 + 六条行为级发现（插件版本协商三连/资产聚合导入/fork 流式禁用/模型生成标题/MCP 白名单提示/画布六布局） | core 版本差异判定方法（差分 index.js 字符串集而非体积）；own 前端 UX 对齐清单 |
| **api/_EXTRACT-MANIFEST.json** | 第二批（T6-T10）+ T11 产出清单：SHA256+方法+来源声明 | 复核 |
| **api/git-tools.md** | 原版 CLI 的 git 快照/恢复子系统完整类（simple-git: status/rev-parse/stash/文件备份/恢复） | **P1 Git 宿主链路**（getChangedFiles 等的真实实现） |
| **api/core-rpc-registry.txt** | core 源码中全部 1168 个方法串 / 108 个前缀（分前缀索引） | 各域 handler 深挖入口 |
| **api/domains-surface.md** | LSP/Commands/Subagents/Generator/Remote/Marketplace/Insight/ACP 各域在 core/CLI 的命中面 | P1 Commands/Subagents、P2 索引问答、远程的深挖起点 |
| **protocol/webrtc-signaling.md** + windowBridge-original.html | 原版串流的 WebRTC 协议：`/signaling/offer|answer|ice`、RTCPeerConnection/DataChannel/turn、原文件存档 | **P2 WebRTC/音频**（当前 image-frames → WebRTC 升级的完整客户端基线） |
| **protocol/**（待补） | stdio 帧协议(\r\n/\r)——已实测记录在 ../restored/PACKAGING.md，勿重复 | 壳/中继开发 |
| **frontend/zh-strings.md** | 前端 4373 条中文文案（按 chunk 分组）——**人工可读的功能清单** | 全局：找功能名→找对应 chunk/消息 |
| **storage/data-layout.md** | 原版存储布局：`~/.codely` 全目录、cowork-settings 全键、data.json 引导标记、双引擎 Hub 目录、工程内状态目录、环境变量族 | 设置/持久化对齐 |
| **strings/** | cowork.exe 45934 种字符串 + 分类过滤（消息形态/camel/snake/路由 URL/键/事件/shell 前缀） | 壳深挖原始素材 |
| ../restored/COMMAND_SURFACE.md · UNITY_INTEGRATION.md · PROJECT_MAP.md | 早期提取（命令面/双引擎/模块图谱） | 仍在有效期内 |

## 已明确的层归属结论（MESSAGE-LAYERS 摘要）

- **原版壳独有 91 条**：`tjhub/*`(getEditors/getLicenses/getInstallLocation/getOrganizations/
  checkRosetta2/enqueueArchive/getProjectDirectory/getRecentProjects/getRepositories/
  getTemplates/installCancel/installEnqueue/locateEditor/openProject/activateLicense…)、
  `tauri/*`(openHub/setKeepAwake/bringToFront/getTunnelEnabled/listRemoteWorkspaces/
  newWindow/getUpdateChannel/setUpdateChannel…)、`pet/*`、`editor/getColors|onLoad|selectAsset`、
  设备码登录(cancelLogin/notifyDeviceFlowExpired)、外部拖放(external-drag-*)、
  `drill/*`、`lsp/isServerInstalled`、`acp/webviewSurfaceReady`、`showFile/getHomedir/
  copyText/applyToFile/openLogFolder/showOpenFilePicker/debugUnityConsole/deep-link`…
- **72 条三处均无**：多为窗口间转发/事件（shell/showToast、shell/openFileInPreview、
  unity-window/*、pet/*、jetbrains/*…）——原版壳是**通用转发**（不按名字分发），
  你的壳走 SSE 广播即是同构实现，无需逐条注册。

## 提取脚本（可复跑, tools/）

extract-shell-strings.py（壳字符串） · extract-layers.py（三层交叉） ·
extract-batch2.py（git/WebRTC） · extract-batch3.py（i18n/git 类/注册表/域面） ·
extract-i18n.py。来源变化时重跑即可刷新。
T1 新增: `tools/extract-reverse-shell.py`（带偏移双编码字符串提取）+ `tools/analyze-shell.py`（modules/commands/urls/kw 窗口分析引擎），原始 TSV 与中间产物在 `F:/AI/AgentMake/temp/GameCowork/shell-logic/`。
