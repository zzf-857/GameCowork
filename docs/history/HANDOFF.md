# GameCowork 项目交接

> 历史交接：正文保留当时的源码路径、包状态和任务判断。当前开发入口见 [开发指南](../DEVELOPMENT.md)，路径对应见 [迁移表](../ARCHITECTURE.md#旧目录迁移表)。不要把下文的暂停或验收记录当作最新状态。

交接日期：2026-10-01。用户要求本轮暂时收尾，持续完善任务已暂停；没有开展新的团结运行、远程或 Provider 实现。

本文是接手入口和本轮收尾说明。活动功能状态、验收证据和后续状态更新统一放在 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)，项目规则见 [AGENTS.md](../../AGENTS.md)。本文引用这些事实，不建立另一套任务队列。

## 1. 这是什么项目

GameCowork 是用户参考 Tuanjie Cowork 制作的 Windows 本地桌面产品。目标是将项目管理、AI 编程、文件与终端、Unity/团结编辑器预览整合在一个应用中。参考软件目录为 E:/TuanjieCodely/EXE/Tuanjie Cowork，仓库 original/ 是只读参考镜像。

项目经历了文件提取、重命名隔离、宿主补齐和真实流程修复。原软件的界面和许多业务代码已经存在；此前的核心问题是接口缺失、协议回包不匹配、CLI 入口不完整，以及编辑器端服务没有接通。提取覆盖率不代表功能完成率。

当前采用 wry/tao + WebView2 的 Rust 桌面壳，axum 提供 loopback HTTP/SSE/WebSocket，Node Core 保留已有业务逻辑，自编译 Agent CLI 负责模型会话与工具执行，自有 UPM 桥负责编辑器内真实数据与 Scene/Game 帧。

## 2. 接手时的源码与正式包

| 位置 | 用途及编辑边界 |
|---|---|
| restored/shell/ | 当前实际 Rust 宿主；main.rs 是路由与装配入口，transport/workspaces/files/mutations/file_events/terminals/editor_bridge/stream_layout/project_templates/insight/process_lifetime 是实际模块 |
| restored/frontend/dist-beautified/ | 当前前端维护输入，虽然含 dist 名称仍是本项目源码；保留两代 chunk，修改共用逻辑时必须同步 |
| restored/core-gamecowork-binary/binary/out/index.js、index.beautified.js | 实际 Core 与对应可读版本；修改同一业务逻辑必须两份同步；gamecowork-custom.js 是本地能力管理补充模块 |
| restored/cli-gamecowork/cli-main.beautified.js、resources/ | 自有 Agent 的维护入口与配套资源，补 CommonJS 工厂调用后自编译 |
| restored/cli-unity-insight/ | 本地索引 worker、启动/权限适配与 parser 资源；版本、来源和许可证记录在 resources/restore-manifest.json |
| restored/editor-bridge/ | 自有 Editor-only UPM cn.gamecowork.bridge，不是原版桥的改名二进制 |
| app/ | 日常程序与装配资源；只用 tools/build-local.ps1 更新，不手工补丁 |
| restored/src-tauri/ | 历史骨架和命令面研究，不是当前构建入口 |
| original/ 与外部参考安装目录 | 只读；不改源码、不运行原 CLI、不借用账号、Hub 写入或许可客户端 |
| F:/AI/AgentMake/temp/GameCowork/ | 测试工程、日志、截图、CLI guard、依赖缓存与构建备份；保留复核证据，不作为第二个正式安装 |

日常入口：[app/启动GameCowork.bat](../../app/启动GameCowork.bat)，主程序为 app/GameCowork.exe。

收尾机器工具版本：PowerShell、Node v24.18.0、rustc/cargo 1.95.0、Bun 1.3.11；运行时还需要 WebView2、项目准备好的 Node/SQLite binding 与 CLI/parser 资源。依赖和缓存不通过修改 node_modules 或原安装目录修复。

正式包仍使用版本号 2.1.3-canary.2，本次没有另发 GitHub Release 或安装器。最终装配时间为 2026-10-01 05:37:25 UTC，构建任务目录：

F:/AI/AgentMake/temp/GameCowork/build/94147966bf0e4c2881dff959c2f22a09

该包的 873 个运行资源已逐项 SHA256 核对。app/package-manifest.json 记录资源；app/cli/cli-package-manifest.json 的 testGuardIncluded 为 Boolean false。Agent 维护源码 SHA 为 FD9FC8CE3904DBA677A13B9C5FCC4A3771832DA105FBEEA59E372CE7990FF2EB；正常 EXE SHA 为 0CD588D505A8173CFB17AE1B25E661EB9478E8A2915DF4FB5BAB604840D456EF。

工作树有大量本轮修改与新增文件，尚未提交、推送。HEAD 为 a745e3d8c64111a73b0c41a08f80941d4e82f7f7，包清单 sourceHasChanges=true；只 checkout 这个 SHA 不能还原本轮功能。接手前检查 git status，保留全部现有改动和未跟踪文件，不做 reset/clean。

## 3. 已完成的功能与验证边界

| 能力 | 当前已实现和实际验证的范围 |
|---|---|
| 宿主协议与工作区 | 修复请求 ID、单次发送、多帧/最终帧、回调及进程退出清理；项目面板脱离骨架，添加、打开、切换、关闭、收藏/排序、失败提示、重启恢复接真实本地注册表 |
| 本地身份与模型会话 | 不依赖官方登录；保留自己的模型配置/选择，真实 Agent 多帧聊天、取消上游、matching read_file 工具结果、A/B 会话隔离与持久历史 |
| Agent 文件与命令 | 实际批准、拒绝、取消；文件写入/替换核对真实字节，命令有 stdout/stderr/退出码及自有 PID 回收；会话改名/删除失败保留数据 |
| 文件与终端 | 本地文件树、读取、范围、搜索、外部写入/改名/删除监听；保存版本校验、备份和撤销；ConPTY 真命令、resize、退出码、工作区关闭回收 |
| 小媒体预览 | Chromium 实际解码图片、GLB/GLTF、WAV/WebM，播放与草稿保护；不代表所有编码、大文件或所有 GPU 组合 |
| 本地自定义能力 | 项目/全局 Skills、Extensions 的创建、编辑、启停、ZIP 安装、移除及重启；限定能力目录与 SHA 冲突保护；真实 HTTP MCP 配置、调用、启停、改名、重启和删除 |
| 本机安装模板 | 从实际选中 Editor 的 tgz 读取模板、版本与 SHA；Unity/团结模板 GUI 创建、取消、目录冲突和非法名称拒绝；保留原 Assets/Packages/ProjectSettings，不伪造启动成功 |
| Unity 完整模板导入 | 原 manifest 和 SampleScene 字节保持；通过自己冻结的公开依赖 mirror，真实 Unity 导入、编译并打开场景，Camera=1、Light=1；尚未覆盖团结完整导入 |
| Unity Insight | 实际 C#、ShaderLab、Unity YAML/GUID、调用关系进 SQLite，搜索/方法/引用、watch/rename/rebuild、启停、双工程、关闭竞态和重启；轮次设置及目录绑定已修复 |
| 编辑器桥与预览 | 不需模型即可查询真实编辑器状态/工程根/选择；Unity Scene/Game 真 JPEG 帧和真实输入，多流、等比黑边、布局保存恢复、程序集重载、关闭防复活 |
| 单 GUI 多工程 | 同一个产品侧栏选定两套独立 Unity 工程的四路 Scene/Game；固定来源、独立输入、A 重载/停止/关闭不误伤 B；缺失工程布局保留原身份，不替换为活动工程 |

验证使用自己的 temp 工程和配置、同源码 guarded 测试 Agent、loopback 模型/MCP 与已有 Unity 许可，没有调用真实商业额度或修改用户工程。正式包内是正常无 guard Agent。主流程为 Chromium 对实际 Rust HTTP 与 Core，不覆盖原生 Wry 窗口几何。

自定义管理 22 项仅覆盖 Skills、Extensions 与 HTTP MCP，不包括 Commands/Subagents 全流程或任意第三方 stdio MCP。UI/Rust 索引已跑通，也不代表 Agent 的 vfs_* SDK 已连到这条 worker。

| 最近实际验收 | 结果 |
|---|---|
| Rust 工作区/协议/文件/终端/桥/布局/模板/索引等 | 71/71 |
| 项目面板浏览器流程 | 8 项通过 |
| 最终包 Core / HTTP 聊天 / Chromium 聊天文件 | 54/54、36/36、10/10 |
| 最终包自定义管理 / 索引 / 设置及重启 | 22/22、22/22、14/14 |
| 最终包 Unity 重载 / 单 GUI 双工程四槽 | 17/17、14/14 |
| 最终包 Unity / 团结模板创建 GUI | 10/10、9/9 |
| 团结实际产品/版本与 fixture 前置检查 | 4/4；仅准备，未启动团结 Editor |

完整命令、报告路径与各阶段区别见 RESTORE_STATUS 的“第四阶段最终装配与门禁”及文末证据。最后修改的是文档和门禁/测试准备，生产源码与正式包保持冻结。不要把早期 836/856 文件包或旧提取数字当作当前交付。

## 4. 还需要完成什么

以下次序是交接建议，不是已经启动的新任务；状态变化继续写 RESTORE_STATUS。

| 优先级 | 待完成项 | 最小可验收结果 |
|---|---|---|
| P0 | 实际 Tuanjie Editor 运行与完整模板导入 | 真实 engineType/root/版本、.scene、帧和输入、重载/关闭、原 manifest 依赖；目前只有 GUI 模板和 DLL 离线编译/前置检查 |
| P0 | Unity + Tuanjie 双引擎同时预览 | 将已通过的单 GUI 双 Unity gate 扩展为两种真实引擎，保持工程/PID/槽位身份，不用两个 Unity 模拟团结 |
| P1 | 逐项清理现有菜单的未接通操作 | diff/LSP/Git、Commands/Subagents、编辑器播放/暂停/写入、快捷键/窗口生命周期等逐项核对真实结果；已有 UI 或 API 名称不能算可用 |
| P1 | Inspector/Hierarchy/Project/Console 完整窗口 | 已有菜单与视图类型；补实际捕获和输入，明确不支持时显示真实原因，不能以 Scene/Game 的成功代替 |
| P1 | 原生桌面体验 | 实际 Wry/WebView2 的标题栏、拖拽、缩放、关闭与焦点、不同 DPI/GPU；Chromium gate 不足以证明这些行为 |
| P2 | WebRTC/音频与性能 | 当前只接 image-frames；真实协商/编码/播放、静音、丢帧/重连、资源释放与多工程性能 |
| P2 | 远程工作区 | 自有配对/授权、远程目录/Agent/终端/Editor 转发、断线恢复；当前明确 remoteWorkspaces=false，不能只放开监听地址 |
| P2 | 索引扩展与 Insight 问答 | 大工程性能、更多语法/资产及团结 .scene 覆盖；模型驱动子代理问答/Embedding 尚未由本地索引 gate 证明 |
| 后期独立阶段 | 第三方图片/视频/3D Provider | 用户已要求后置；复用现有任务/预览 UI，补自己的 Provider 配置、认证、任务状态和结果落盘 |
| 后期独立阶段 | 安装、更新与分发 | 当前是本地 app 装配，不是已验收安装器/自动更新/公网/SaaS；保持产品身份与数据隔离 |

界面中的资产推荐词、远程入口、完整窗口类型、截图到聊天、播放和音频等仍需逐项复核，不能因为能看到按钮就标记完成。

## 5. 参考项目中可以复用的部分

复用的首选是仓库中已恢复并经过隔离的维护输入。对新增能力先找同名业务 chunk、Core handler 和 CLI tool，再补真正缺的宿主/编辑器/服务。尽量沿用既有组件和协议，不重做已经可用的部分。

这是源码与只读参考审查的复用清单。复用 UI/客户端代码不等于原服务已存在，也不等于已完成对应运行验收；以下符号可用 rg 定位，不依赖压缩变量名的业务含义猜测。

| 功能 | 已有可复用位置 | 可以直接沿用什么 | 仍须补齐/验证什么 |
|---|---|---|---|
| 项目、工作区、编辑器关联 | 两代 TJHubRoute、Core hRi/f9e/$ba、shell/workspaces.rs 的 Store、project_templates.rs | 项目 UI、版本/引擎识别、候选 Editor 与已修好的本地注册/真实模板创建 | 团结实际运行；本地 Store 不能代替远程设备目录与授权 |
| Scene/Game 预览与布局 | 两代 RightSideBarPanel、windowBridge.html、assets/gamecowork-image-frames.js 的 GameCoworkMultiProjectFrames、shell/stream_layout.rs | 选择工程、固定来源四槽、帧消费、输入、等比黑边、保存恢复与重载隔离；这些已在正式包通过 | 真实双引擎及更多 Editor 版本；其它窗口单独实现捕获 |
| 编辑器 TCP 协议与桥 | editor-bridge/Editor/Bridge.cs、EditorCapture.cs、PreviewStreams.cs；CLI 已有 UNITY-TCP 客户端 | FRAMING=1、PROJECT_ROOT/request_id、只读状态、实际 Scene/Game、lease/关闭逻辑 | manage_scene/gameobject 等写工具、播放控制与完整 Editor UI；不支持动作必须保持明确错误 |
| Hierarchy/Inspector/Project/Console | 参考与恢复版 RightSideBarPanel 的 Bu/Xa 窗口类型；UNITY_INTEGRATION 中的窗口类名 | 菜单、类型映射、槽位和布局外壳 | own EditorCapture.Supports 只支持 Scene/Game；原版对应 C#/原生捕获源码未在应用资源库存定位，不能只复制菜单就宣称完成 |
| 原版视频/WebRTC/音频 | 参考 app/resource/dist/windowBridge.html 的 RTCPeerConnection 与 /signaling/offer/answer/ice | 已有前端协商、状态、视频/音频消费及输入协议可作为基线 | 自有编码/信令/DataChannel/音频服务和生命周期；当前 image-frames 不等于 WebRTC |
| 远程入口 | 参考/恢复版 VscTheme-BExNMG_K.js 的 remote/browse-folders 等调用 | 远程目录选择界面和客户端请求结构 | 自有配对、认证、远程端宿主、目录/Agent/终端/Editor 转发、断线恢复；当前原生路由明确拒绝 remote |
| 聊天/历史/批准 | assets/index-BRxZ4eG7.js 的 history/renameTitle/delete、acp/requestPermission/requestShellConfirmation；VscTheme 的 Kl | 消息/输入/历史和权限确认 UI，以及已修好的真实 Core/CLI/宿主链路 | 后续新工具必须分别验真实执行结果与拒绝/取消，不能仅沿用确认弹窗 |
| 文件/媒体/终端 | RightSideBarPanel-JSPvAs5c.js 的 _T/openFile、TerminalPanel 的 wh，Monaco/Three.js/xterm 等组件 | 已验文件树、草稿、保存/撤销、媒体解码、搜索、watch 与 ConPTY；继续复用 tab/menu/render 组件 | 大文件/更多编码和平台行为；不能编辑生成后的 app 作为修复 |
| Diff | RightSideBarPanel 的 Aw/openDiffFile；主 index 的 shell/openDiffInPreview | 分栏/行内呈现与 tab 协议 | 逐轮变更、Git HEAD/index 数据及专项验证；有 diff 编辑器不等于完整变更审查 |
| Git | 主 index 的 k2/jd/Q2/U2/qR/XR/JR/YR | 分支/变更列表及操作 UI、已有仓库发现 | getBranch/getGitBranches/getChangedFiles/applyGitFileAction/switchGitBranch/getFileAtHead/getFileAtIndex 的宿主链路与隔离仓库测试 |
| LSP | 主 index 的 PR/DR/OR、RightSideBar 的 gamecoworkLspReady、Core lsp/* | hover、定义、引用界面与 ACP 转发 | Server 安装/启动、通信、文档同步及关闭回收；当前前端明确未接入 |
| 模型配置、设置与原生窗口 | VscTheme 的 Udn/Fdn/Idn、acp/modelProfiles；cd/idn/Hdn；index-DG7m4Xaq.js 窗口按钮 | 自有模型表单/角色选择、导航/主题/快捷键说明、已有窗口 HTTP fallback | 商业协议与认证；账号/套餐/远程等服务；原生 Wry 几何和操作专项验证 |
| Skills/Extensions/MCP | 主 index 的 cd、VscTheme 创建/编辑对话框、Core custom/* 与 gamecowork-custom.js | 已验的原入口和限定目录创建/编辑/安装；无需重新画 UI | 任意 stdio MCP、外部市场来源与 Provider 专项适配 |
| Commands/Subagents | VscTheme 的 rNt/Gcn，Core commands/*/subagents/* | 枚举、启停与对话框代码 | 新建仍走通用 writeFile；需限定目录创建/全局编辑接口、真实生效与重启验证；未包含自定义22项 |
| 资产生成与首次引导 | 主 index 的 gamecoworkAssetPending、gamecoworkCapabilityStatus/IntroductionImage；GenerationDetailDialog/GenerationModelViewer/GenerationSkyboxViewer | 已有入口、任务/预览组件和当前准确 pending/capability 提示 | 自有图片/视频/3D Provider、任务/结果/下载服务；原官方 iframe 已门控，不是自己的后端 |
| 本地索引与资源解析 | cli-unity-insight/bundle 的 indexBuildWorker/indexSyncWorker/sqliteQueryWorker，加自有 worker-entry/guard/paths 与 shell/insight.rs | 已恢复且真实运行的 parser、SQLite、GUID/调用关系、watch 与 GUI 查询；继续沿用当前隔离适配 | 大工程和更多类型；不要退回原 worker 的用户目录/metrics 路径 |
| 模型驱动 Insight / vfs_* | CLI cli-main.beautified.js 的 I3r、r_e、daemon/stdio helpers 与 GLa SDK schemas | VFS 工具定义、子进程/stdio 客户端、已有 worker 可以复用 | Agent SDK 尚未接通当前 Rust worker；需明确 Node runtime、授权 root、cache/Job 或转调 InsightService，再验真实 issued-ID 工具结果 |

前端表格基准为 restored/frontend/dist-beautified/；GUI 业务 index-BRxZ4eG7.js 和 RightSideBar/VscTheme 位于 assets/，桌面入口 index-DG7m4Xaq.js 位于 dist-beautified 根。各名称对应当前/另一代文件见实际目录，两代都要维护。索引 UI 的 InsightIndexPage-BEZ5Ffki.js/Pt、unityInsightIndex-DGh4GXkO.js 也已存在，可继续沿用状态、rebuild、启停与查询组件。

### 复用时容易误判的接口

原 CLI 的 Unity TCP 客户端 ks/setProjectRoot 是单例，不能据其握手字段推断“天然持有 N 个工程连接”。已通过的多工程预览用当前原生工作区身份路由，不要退回历史方案。

Insight 的 I3r 默认寻找 GAMECOWORK_HOME/CLI 旁的 unity-insight-cli.cmd 或裸命令，而正式 worker 位于 app/unity-insight/bundle/gamecowork-worker-entry.mjs。r_e 虽接受 JS/MJS，却通过 process.execPath 启动；编译后 Agent 的这个路径是自身 Bun EXE，真实 worker 用 Node/node:sqlite。只把 GAMECOWORK_UNITY_INSIGHT_CLI 指到 mjs 不能直接算接通；同时还要补自己的 UNITY_INSIGHT_HOME、权限和进程回收。

Git 当前只确认仓库发现/getGitRootPath 的宿主接口。切分支、变更文件、Git 文件操作仍缺对应 GUI 服务，不能由 Git 目录能识别推导全部 Git 可用。Diff UI 存在但完整 turn/Git diff 数据链尚未验收。LSP 有前端和 ACP 转发，服务安装/启动/通信生命周期仍缺。本轮没有启动这些新实现。

官方云配置/OAuth/资产轮询、套餐授权及原 Hub 许可客户端不是可直接转为本机功能的服务。本地身份已弱化；以后沿用界面或 SDK 时仍须接自己的 Provider/服务和真实认证，不能恢复原厂地址或制造 Token。Core 的 generator/listTasks 当前明确未配置，图片/视频/3D 仍需自己的 adapter、任务、下载与失败链；原 SDK 的 images 接口只能作为客户端基线。第三方通用 React/Monaco/xterm/Three.js 与 parser 组件按现有来源与许可证记录使用。

## 6. 接手后的运行、验证与装配

先读 AGENTS、README、RESTORE_STATUS，再检查正确 Git 工作树。只复核当前源码时，可以复用仍与源码 SHA 一致的 guarded12：

~~~powershell
Set-Location 'F:/AI/AgentMake/CyberSoftwares/GameCowork'
git status --short --branch
./tools/verify-local.ps1 -RealCore -Chat -Editor -AgentTestPackage 'F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12'
~~~

这个命令会运行真实自有 Unity 工程，仅使用已有许可。若改动了 CLI，旧 guard 或正常包必须重新构建；当前工具会检查源码 SHA。

~~~powershell
$handoffTask = Join-Path 'F:/AI/AgentMake/temp/GameCowork' ('next-verification-' + [guid]::NewGuid())
$handoffGuard = Join-Path $handoffTask 'cli-guarded'
$handoffNormal = Join-Path $handoffTask 'cli-normal'
./tools/build-cli.ps1 -OutputDirectory $handoffGuard -GuardFile './tests/cli-probe-guard.cjs'
./tools/verify-local.ps1 -RealCore -Chat -Editor -AgentTestPackage $handoffGuard
./tools/build-cli.ps1 -OutputDirectory $handoffNormal
./tools/build-local.ps1 -SkipTests -CliPackageDirectory $handoffNormal
~~~

这些是接手参考命令，本次收尾没有再次运行长门禁或重新打包。已有全量日志退出 0；此后新增的契约、设置、重载和双工程 gate 已独立验收，具体执行边界见状态文档。装配后按改动选择 --packaged 的真实流程复核，不能只跑 Source 并默认 app 已更新。guard 包禁止装入产品；build-local 同时核对 Boolean 标记、源码、正常 entry 和 EXE SHA。

这里的测试 guard 指 CLI 探针。app/unity-insight/bundle/gamecowork-worker-guard.cjs 是正式 worker 的路径/网络权限边界，应保留，不能因为名字含 guard 就当作测试代码删除。

### 下一步团结运行的现成起点

~~~powershell
node tests/editor-preview-e2e.mjs --packaged --editor 'E:/TuanJieAllVersion/2022.3.62t16/Editor/Tuanjie.exe' --engine tuanjie --editor-version 2022.3.62t16 --agent 'F:/AI/AgentMake/temp/GameCowork/cli-guarded-20261001-12/gamecowork.exe'
~~~

仅在用户恢复任务后执行。这个 driver 会创建自有空测试工程，检查真实 EXE 产品/版本，并使用 .scene。可增加 --template-project 指向自己的 temp 模板工程，但必须先准备完整公开依赖 cache/mirror；不得删 manifest、停用 Package Manager、伪装 Unity fixture 或激活/登录来制造通过。

## 7. 数据、证据与交接注意事项

正常界面状态与工作区注册表在 %LOCALAPPDATA%/GameCowork；Core/CLI 状态在 %USERPROFILE%/.gamecowork、.gamecowork-cli；索引在自己的应用 data/insight。测试显式设置自己的 data/core/CLI 目录，不改 HOME/USERPROFILE，不读取原软件账号。添加、移除、关闭项目不删除工程、不改官方 Hub 注册表。

本轮测试进程已按自有 PID 清理；不按 node/Unity/GameCowork 名称批量结束进程。temp 中的报告、截图、公开依赖缓存和 CLI 包保留用于交接与复核，没有清空用户数据或统一临时区。

重点保留：

- temp/GameCowork/audit-2026-10-01/verification-phase4-integrated.log 与 build-phase4-final.log。
- temp/GameCowork/build/94147966bf0e4c2881dff959c2f22a09：暂存包与旧二进制备份。
- temp/GameCowork/cli-guarded-20261001-12 与 cli-product-20261001-06：同源码测试/正常 CLI。
- temp/GameCowork/template-public-test-cache-20261001-02/dependency-ledger.json：公开依赖来源/哈希；完整导入证明与模板工程见状态文档。
- temp/GameCowork/tests/editor-bridge-multi-project-7ddb735e-b47b-4590-8901-0e6ebf9518c1：真实单 GUI 四画面报告和截图。

以上 temp 简写均相对于 F:/AI/AgentMake。临时许可/连接日志只留原 temp，不复制账号、能力 URL 或许可标识到交接文档和 Git。

继续维护时注意：main.rs 原生读写与生命周期、两代前端、Core 两份 bundle、CLI 资源是同一链路。保存结果要检查内层 status/最终帧和真实磁盘/画面，不只看 HTTP 200。不要把旧研究稿中的“桥缺位”“90%”“天然 N 个连接”等推断用于当前决策，优先读状态顶部与可重复测试。
