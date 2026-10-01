# codelyreversebackup — 原版 Codely 功能提取库

> 提取日期: 2026-10-01 · 来源: `original/` 只读镜像 + 本机 PackageCache
> 用途: 按 [HANDOFF.md](../HANDOFF.md) §4/§5 的未完成项，从原版继续反编译功能逻辑，
> 供 GameCowork 自研直接取用，减少重复开发。所有原版资产只读参考、记录来源/SHA，
> 不得改名分发（见项目 AGENTS.md 隔离规则）。

## 资产索引（每项 → 对应 HANDOFF 缺口）

| 资产 | 内容 | 服务于哪个缺口 |
|---|---|---|
| **editor-bridge-original/** | 原版桥 C# 源码包全量（427 文件, 74MB, 逐文件 SHA256）+ [ANALYSIS.md](editor-bridge-original/ANALYSIS.md)：原生窗口捕获机制、26 个 Tools 管理器动作目录、协议事实、与你 Bridge.cs 的差距图 | **P1 Inspector/Hierarchy/Project/Console 完整窗口**、Scene/GameObject CRUD、截图到聊天、模态对话框、Job 体系 |
| **api/MESSAGE-LAYERS.md** + frontend-inventory.json | **前端 347 条 invoke 消息 × 持有层交叉**：91 条原版壳独有（你的壳对齐清单）、166 条 core 持有、72 条通用转发 | **P1 逐项清理未接通操作**——壳还缺哪些消息一条不差 |
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
