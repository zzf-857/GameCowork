# 原版功能面遗漏审计（GAPS-AUDIT，截至 2026-10-01）

> 汇总 T1-T5 + 索引/模板专项的全部审计结论，按"GameCowork 还缺什么"组织。每项给出证据指针。
> 状态: ✅已对齐 / 🟡部分（缺子能力）/ ❌未做（原版有、GameCowork 无）。

## A. 壳命令面（91 条 shell 独有 invoke，见 shell-logic/commands.md）

| 组 | 状态 | 缺口 |
|---|---|---|
| shell/*、unity-window/*、jetbrains/*、visualstudio/* 等 30+ 条 | ✅ | 原版=通用转发，SSE 广播同构即可（已逐一验证字符串不存在） |
| tjhub/* 30 条 | 🟡 | 安装面板已修（getEditors 投影）；**未接**: 安装队列状态机（installEnqueue/cancel/retry/enqueueArchive + onTemplateDownloaded 事件回执）、getReleases/getModules/getArchive/EULA、getWatermarkStatus、openRemoteProject、connectCloud |
| tauri/* 12 条 | 🟡 | 缺: setKeepAwake/getKeepAwake（含持久化）、updateChannel stable\|canary 切换、listRemoteWorkspaces、startTunnel/stopTunnel/getTunnelStatus |
| tauri/update 6 条 | ❌ | pending 四态校验状态机、`/api/tauri/update-*` 事件族（壳有自更新通道但状态机未对照） |
| editor/* 8 条 | 🟡 | 缺: recompile（Unity IPC 有消息但壳侧入口未对照验收）、setEmbedMode+cowork_embed_mode_changed detach 建窗、getSidechat、getColors |
| pet/* 11 条 | ❌ | 全域: 窗口五件套（win-pet/-menu/-bubble/-submenu/-input/-file-preview）、submitPrompt/getActiveSession/reportFeedback/getPendingQueue、showFilePreview/hideFilePreview、PetPositionX/Y |
| drill/* 5 条 | ❌ | 新手引导（getProgress/updateProgress/windowShown/windowClosed/drillCompleted 经 Unity IPC） |
| versionUpdate/* 2 条 | ❌ | seenFeatures/markFeatureSeen（featureId） |
| lsp/* 12 条 | 🟡 | GameCowork 有 lsp-csharp 冻结 runtime；缺原版三层: 内置 basedpyright/vtsls、扩展 gemini-extension.json 注入、isServerInstalled 两层检查（extension check + server check）与 PATH 候选目录解析 |
| 杂项（showFile/copyText/getHomedir/openLogFolder/debugUnityConsole/applyToFile/showOpenFilePicker/saveTempFile） | 🟡 | 大多有等价实现；applyToFile 的 rejectDiff 原版是 no-op（可直接对齐） |

## B. Hub/许可域（T2/T3）

| 项 | 状态 | 证据 |
|---|---|---|
| tjhub 数据面 52 方法契约 | 🟡 | hub-installer/tuanjie-exe-cli.md §2——壳内按表实现即可，无需连真 Hub |
| 许可 IPC 数据形状 | ❌（设计上不做） | hub-licensing/IPC-PROTOCOL.md——仅作 UI 假数据形状参考（本地模式无许可，红线） |
| Hub 子进程握手 | 🟡 | HUB_PIPE_HANDLE 匿名管道继承 + HUB_COWORK_TOKEN 鉴权 + system.ping/echo/shutdown 自检三件套——可作为壳↔子进程通信备选 |
| 登录链路 | 🟡 | 设备码 + `auth/exchange-with-unity-token` + Continue* token 键 + 控制面 URL 组（tjhub-api.md §5）——本地身份已弱化，接真实团结账号时再对 |

## C. 索引与编辑器列表（本轮专项，index-and-templates/）

| 项 | 状态 | 说明 |
|---|---|---|
| insight 索引持久化（代际+指针+GC） | ✅ 设计 | worker 已还原且完整；**本机实证: 生产目录空 → 持久化从未落地**（见 insight-index-persistence.md §3，需按 §5 二分定位） |
| 编辑器列表缓存 | ❌ | 每次启动 Core 重扫全部安装根+modules.json；原版 Hub 持久 installedEditorList + editors.changed 事件推送 + 模板缓存按该事件失效 |
| 暖启动成本 | 🟡 | 暖启动走 index.sync（全量 mtime 走查）+ 每工程新起 serve；并发可用 UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY 调 |

## D. 模板体系（本轮专项，template-pipeline.md）

| 项 | 状态 |
|---|---|
| 核心模板枚举（Editor 内置 tgz） | ✅ |
| 模板元数据全字段（package.json: displayName/description/dependencies/预览图/Documentation~） | 🟡 |
| 示例模板下载（远端清单+本地缓存+manifest.json 记账+损坏重置+磁盘预检） | ❌ |
| 反向打包模板（createTemplateFromProject 六目录集） | ❌ |
| 兜底模板 code 0/1 | ❌ |
| 路径长度预检（tgz 最长路径+53） | ❌ |

## E. 桌面/远程/其它（T1 已成文，GameCowork 未做）

| 项 | 状态 | 证据 |
|---|---|---|
| 单实例三件套（.codely.lock 带 pid/http_port + status 心跳 + focus-window HTTP） | ❌ | desktop-shell.md §2 |
| SSE 每窗口缓冲+replay | 🟡 | desktop-shell.md §1（GameCowork 全局广播，缺 per-window pending） |
| WinRT Toast 双按钮 / 托盘徽标点阵 | ❌ | desktop-shell.md §3/§5 |
| 远程工作区全家（frp 客户端/机器注册表/SSE-Bridge/mobile_home/push 队列） | ❌（后期阶段） | tunnel-remote.md 全文 |
| VFS 三消息（cowork.vfs_refs/vfs_children/vfs_entry）接 SDK | 🟡 | unity-shell-side.md §1（HANDOFF 既有缺口） |
| 远程窗口桥 token 路由（windowBridgeProxyToken + 过期路由） | ❌（后期阶段） | unity-shell-side.md §3 |
| CoreHealth restart_attempts/tauri/core-status | 🟡 | desktop-shell.md §6 |
| 模型驱动 Insight agent TOML（max_turns/timeout_mins/input_schema 模板） | 🟡 | tjhub-api.md §6 |

## 复刻优先级建议（按用户痛点排序）

1. **启动慢**: 编辑器列表持久快照+事件失效模型（C 行 2）→ insight 启用二分定位（C 行 1）→ 发现并发调优（C 行 3）。
2. **新建项目体验**: 模板元数据全字段+预览图（D 行 2）→ 反向打包模板（D 行 4）→ 兜底模板（D 行 5）。
3. **桌面体验**: 单实例三件套（E 行 1）+ Toast（E 行 4）。
4. 其余（远程/pet/drill/更新状态机）按 HANDOFF 后期阶段排期。
