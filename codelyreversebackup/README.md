# codelyreversebackup — 原版 Codely 功能提取库

> 提取日期: 2026-10-01 · 来源: `original/` 只读镜像 + 本机 PackageCache
> 用途: 按 [HANDOFF.md](../HANDOFF.md) §4/§5 的未完成项，从原版继续反编译功能逻辑，
> 供 GameCowork 自研直接取用，减少重复开发。所有原版资产只读参考、记录来源/SHA，
> 不得改名分发（见项目 AGENTS.md 隔离规则）。
>
> **➡ 后续执行入口: [REVERSE-PLAN.md](REVERSE-PLAN.md)（2026-10-01 制定）**
> 已完成侦察并内嵌成果：壳的 52 个自有 Rust 模块清单（含 LSP 7 模块、frp/tunnel 远程三件套、
> pet/drill/push）、LicensingClient .NET 关键类型、方法工具箱（M1-M6）与任务单 T1-T5。
> 执行 agent 按任务单串行领取即可，**不要重做侦察**。
> **第二轮 T6-T10 已完成（2026-10-01）**：core 业务域深挖（会话检查点/MCP OAuth/config 记忆与 allowlist/
> context 引擎与 Unity 工具目录/市场与反馈与引导），成果在 api/ 五篇新文档，侦察结论见 REVERSE-PLAN §6。

## 资产索引（每项 → 对应 HANDOFF 缺口）

| 资产 | 内容 | 服务于哪个缺口 |
|---|---|---|
| **shell-logic/** ✅T1 完成 | cowork.exe（Rust 壳）逻辑还原：[commands.md](shell-logic/commands.md)（91 条壳独有消息逐条结论）、[lsp-subsystem.md](shell-logic/lsp-subsystem.md)（LSP 9 模块+内置 server 表）、[tunnel-remote.md](shell-logic/tunnel-remote.md)（frp 协议/机器注册表/移动端聚合）、[tjhub-api.md](shell-logic/tjhub-api.md)（Hub stdio JSON-RPC 方法表/控制面 URL/登录流）、[unity-shell-side.md](shell-logic/unity-shell-side.md)（命名管道/vfs_*/远程窗口桥/insight serve 锁）、[desktop-shell.md](shell-logic/desktop-shell.md)（单实例/托盘/更新/Toast）；68 模块原始窗口转储 + raw 证据 + manifest | P1 未接通操作对照、LSP 宿主、原生窗口生命周期、P2 远程工作区 |
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
| **api/_EXTRACT-MANIFEST.json** | 第二批（T6-T10）产出清单：SHA256+方法+来源声明 | 复核 |
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
