# GameCowork

GameCowork 是参考 Tuanjie Cowork 的本地桌面项目。目前正在从提取的界面与业务代码补齐可运行的宿主、工作区、Agent 和编辑器链路。**文件提取完整不代表功能已经可用。** 当前状态与尚未完成的功能统一记录在 [RESTORE_STATUS.md](RESTORE_STATUS.md)。

2026-10-01 用户已恢复持续完善任务，优先推进基本功能闭环。[HANDOFF.md](HANDOFF.md) 保留上一阶段交接入口：项目结构、已完成/待完成能力、参考代码复用与验证入口；当前进展与验收继续写入 RESTORE_STATUS。

当前实际构建入口是 `restored/shell/`，使用 wry/tao 承载 WebView2、axum 提供本地 HTTP/SSE、Node core 承载已有业务逻辑。`restored/src-tauri/` 保留历史骨架供查阅，不参与现在的 app 构建。

```powershell
.\tools\verify-local.ps1             # 隔离协议、工作区、HTTP 和真实浏览器验证
.\tools\verify-local.ps1 -RealCore   # 追加受控真实 core 验证
.\tools\verify-local.ps1 -RealCore -Chat # 追加自编译 Agent + 本地模拟模型 + 真实聊天/文件界面
.\tools\verify-local.ps1 -RealCore -Chat -Editor # 追加自有临时 Unity 工程的真实桥/预览；仅使用已有许可
.\tools\build-local.ps1              # 编译并更新已有 app 目录
.\app\启动GameCowork.bat             # 日常启动
```

工作区注册与界面偏好保存在 `%LOCALAPPDATA%\GameCowork`；原有 core/CLI 用户目录 `.gamecowork` / `.gamecowork-cli` 保留。添加、移除或关闭项目不会修改官方 Hub 配置或删除工程文件。测试使用 `F:\AI\AgentMake\temp\GameCowork` 内的隔离数据。

本地模式无需官方账号；编辑器自身许可和外部 Provider 仍由各自的真实认证处理。第三方图片、视频和 3D Provider 接入保留为后续阶段。

`tools/build-local.ps1` 会从恢复的 CommonJS 入口编译自己的 Agent CLI，连同内置资源装配到 `app/cli/`；测试 guard 包不能装配为产品。`-Chat` 验证只使用专用临时目录和 loopback 模拟模型，不调用真实额度。文件保存的原字节备份与修改记录位于自己的 core 数据目录 `changes/`，撤销会核对版本，发生后续磁盘改动时拒绝覆盖。

`restored/editor-bridge/` 是自有 `cn.gamecowork.bridge` UPM 包。用户在选定 Unity 工程触发安装时，壳只增加自己的本地依赖并保存可撤销备份；不会自动安装原版桥。桥和预览控制通过该工程的 loopback TCP 验证身份，预览无需先配置文本模型。实际支持范围以状态文档和帧验收为准。

第四阶段已将本机编辑器的真实模板、限定能力目录的 Skills/Extensions/MCP 管理，以及 `cli-unity-insight/` 的本地 SQLite/代码/资产引用 worker 装入当前 `app`，873 项资源哈希通过，并分别验收实际界面与运行链路。模板首次打开仍由编辑器解析原始依赖并验证自己的许可；本地身份不能替代编辑器许可。

第五阶段曾交付875项资源包。除项目、聊天、文件/小媒体、终端和索引外，已验收 Git/Diff、项目/全局 Commands/Subagents 管理及真实 Agent 生效，Unity/Tuanjie 的 Scene/Game、单 GUI 双引擎四画面、重载/关闭隔离和实际 GUI 播放/暂停/单帧/停止/刷新。团结原始完整模板导入与 `.scene` 打开也已通过。LSP 产品接线和 Agent Unity 工具的真正完成/取消正在第六阶段处理；远程、完整编辑器窗口串流与第三方媒体生成仍在后续范围。默认保留系统窗口边框，实验无边框手势未验收。具体命令、报告、单次命令刷新超时的复测边界与限制见状态文档，不能用历史提取覆盖率代替。

用户已纠正窗口功能的分析方向：完整原桥在 `codelyreversebackup/editor-bridge-original/`，通用 NativeWindowBridgeHost 使用真实 EditorWindow/DockArea/SplitView、完整 GUIView 捕获与输入转发，和 NativeBrowser 嵌入前端是两条链。已核对原EXE/桥来源和native ABI，并以完整原C#源码指导own通用窗口宿主，真实GUIView捕获/输入已进入源码实际验证；原native DLL未加载或装配。主界面接线和新包验收见RESTORE_STATUS顶部。

上一包为1183资源（2026-10-01 12:53 UTC），上面875是第五阶段历史交付。用户截图的已安装Editor页崩溃已修复，两代包界面各19项、真实Core只读扫描各12项通过，显示本机Unity8套/团结2套；两引擎使用各自图标，团结优先显示1.3.2/1.10.4，旁边小字保留Unity技术版本。同版本选择按引擎和安装路径隔离。公开Hub配置不变，未执行安装卸载。本轮源码85项Rust通过，正常Agent无guard。LSP原Monaco菜单100ms执行绑定时序已查明，实际1179包的完整语义/导航20项随后通过，1183包菜单激活8项通过。MCP延迟modal focus污染name已修复，两代1183包stdio含真实focus probe各15项通过；完整GUI通用窗口源Unity/Tuanjie各23项与主Sidebar/Rust/Core闭环各13项通过，包内窗口/输入正在复验。精确证据和限制见RESTORE_STATUS顶部。

最新日常包为 **1184资源的大屏修复版（2026-10-01 14:46 UTC）**。已修复最大化/长面板直接发送超过1080高度导致所有画面拒绝的问题，统一等比例适配传输尺寸，保留全尺寸界面和准确输入。已打开本地工作区右侧可发现“串流”，首次工程识别失败可重新识别；同布局/尺寸不重复重建捕获，关闭后旧会话不再复活工程。最终实际包Unity/current/DPR2、团结/previous/DPR1.5各21项通过（2560×1800→1280×900，每组28次真实input均成功），230项定向源码与backend verify/Rust89通过。日常app的1184资源与已验候选04全SHA一致；用户可直接启动EXE手动复测。操作步骤见 [UNITY_INTEGRATION.md](restored/UNITY_INTEGRATION.md)，原版对照来源、曾漏测条件、中间失败与最终证据见 [RESTORE_STATUS.md](RESTORE_STATUS.md)。

研究库`codelyreversebackup`按路径/大小/SHA256建立增量基线，本聊天每小时检查并吸收实质新增成果，优先改进基本功能闭环；未变化保持静默。参考资料是证据输入，功能完成仍以维护源码与当次实际验证为准。

以下是历史提取记录，其中覆盖率指提取文件数量；涉及运行能力的旧结论以当前状态与测试为准。

---

> 委托还原 · 2026-09-29 · 还原自 `E:\TuanjieCodely\EXE\Tuanjie Cowork`（v2.1.3-canary.2）
> 委托语境：应用作者委托进行工程还原。

## codely → GameCowork 重命名与本机隔离（2026-09-30）

应用户要求，工程内 codely 系命名已全部改为 GameCowork（13,500+ 处，82+ 文件，脚本
[tools/rename-codely.py](tools/rename-codely.py) 可复跑）。同日完成**深度隔离**（第二轮，
[tools/isolate-gamecowork.py](tools/isolate-gamecowork.py)）：外部契约标识全部分叉。
打包要求与装配红线见 **[PACKAGING.md](restored/PACKAGING.md)**。

### 映射表

| 原名 | 现名 |
|---|---|
| codelycowork / Codely Cowork / codely-cowork | gamecowork / GameCowork |
| `dev.codelycowork.desktop`（Tauri 标识符） | `dev.gamecowork.desktop` |
| `~/.codely`、`~/.codely-cli`（core 数据目录） | `~/.gamecowork`、`~/.gamecowork-cli` |
| `CODELY_*`（24 个环境变量，含 CLI_HOME/HOME/TOKEN） | `GAMECOWORK_*` |
| `core-codely-binary/`、`cli-codely/`（工程目录） | `core-gamecowork-binary/`、`cli-gamecowork/` |
| `Programs/Codely Cowork`（自身 CLI 探测路径） | `Programs/GameCowork` |
| `# Managed by Codely Cowork (...)`（unity-insight.toml 标记） | `# Managed by GameCowork (...)`（读写一致） |
| `cn.tuanjie.codely.bridge`（编辑器桥接包） | `cn.gamecowork.bridge`（分叉，不再装/升官方桥） |
| `https://codely(-stg).tuanjie.cn`（后端/指标） | `https://api(-stg).gamecowork.invalid`（占位域，永不误连） |
| `codely.tuanjie.cn/plugins/cowork/latest`（更新源） | `update.gamecowork.invalid`（**自动更新物理断开**） |
| 边车/伴生进程名 codely-binary.exe、codely.exe、process_killer.exe | gamecowork-binary.exe、gamecowork.exe、gamecowork-process-killer.exe（**装配层改名重打**，见 PACKAGING.md） |

> 文中其余事实性描述沿用重命名后写法；原安装目录内的原始文件名（如 `codely-binary.exe`）
> 仅存在于 `original/` 镜像与外部安装目录，未做改动。

### 保留未改

- `tools/*.py` 中指向原安装目录的硬编码路径（再提取工具，针对原始文件名工作）；
- 图标（按用户要求与原版保持一致）。

### 与已装 Codely 的隔离保证

1. Tauri 标识符不同 → single-instance 互斥、AppData、WebView2 用户数据目录完全分离；
2. 数据目录 `~/.gamecowork` 与原版 `~/.codely` 互不读写（会话/索引/令牌全隔离）；
3. 环境变量命名空间不同，不会读到原版的全局 `CODELY_*` 配置；
4. 程序自身服务端口为动态分配（实测无固定自绑端口；bundle 里的 localhost 端口均为外部服务示例）；
5. **外部标识全部分叉**（2026-09-30 第二轮）：桥接包不再共用、后端/指标/更新源全部切
   `.invalid` 占位域——打包版不会向官方后端/更新源发任何请求，自动更新不可能把本工程
   变回官方版；代价与接回方法见 PACKAGING.md §三；
6. 边车进程名经装配层改名后与原版不同（cowork/codely-binary/codely → GameCowork/
   gamecowork-binary/gamecowork）；
7. `productName`/窗口标题已改为 `GameCowork`（`tauri.conf.json`），安装目录、卸载注册表
   键、开始菜单均与原版分离。

## 产品是什么

Tuanjie Cowork（内部名 **GameCowork**，产品 ID `dev.gamecowork.desktop`）是
Unity 中国（团结引擎 Tuanjie）的 AI 结对编程桌面应用，架构与开源项目
**Continue.dev** 同源（二进制内残留 api.continue.dev 系列端点）。

## 总体架构

```
Tauri 2 薄壳 (Rust, WebView2)          ← cowork.exe (58MB)
 ├── Web 前端 (React + Monaco, Vite)    ← app/resource/dist (87MB, 6 个 HTML 入口)
 ├── core 边车 (vercel/pkg Node)        ← gamecowork-binary.exe (70MB, 入口 out/index.js)
 ├── CLI 边车 (Bun v1 编译)             ← cli/bin/win32-x64/gamecowork.exe (204MB)
 ├── unity-insight (esbuild bundle)     ← cli/lib (tree-sitter 代码索引)
 └── hub 授权链 (Tuanjie Hub)           ← hub/ (217MB, .NET LicensingClient)
```

应用逻辑几乎全在前端 + Node 边车（Rust 壳零自定义命令），因此本还原的
**源码覆盖率极高**：前端 479 个 JS + 边车全部 JS 均已还原为可读源码。

## 目录结构

```
GameCowork/
├── original/Tuanjie Cowork/      # 原始安装目录完整镜像（校验基准）
├── restored/
│   ├── frontend/                 # ★ 前端还原
│   │   ├── dist-beautified/      #   479 个 JS/CSS/HTML 全量美化(可运行、可读)
│   │   ├── package.json          #   重建的依赖清单
│   │   └── PROJECT_MAP.md        #   入口图/技术栈/模块图谱
│   ├── src-tauri/                # ★ Rust 壳还原（骨架级）
│   │   ├── tauri.conf.json       #   重建配置(含更新源)
│   │   ├── Cargo.toml / src/main.rs
│   │   ├── capabilities/default.json
│   │   ├── COMMAND_SURFACE.md    #   命令面/端点/插件/ACL 全记录
│   │   └── icons/                #   exe 图标 + 品牌图
│   ├── core-gamecowork-binary/       # ★ pkg 解包: 258 文件全量还原(含 14MB 主 bundle)
│   │   ├── binary/out/index.beautified.js   # 美化版主 bundle (18.1MB)
│   │   └── _unpack-manifest.json
│   ├── cli-gamecowork/               # ★ Bun carve: 223 段明文模块
│   │   ├── carved/  cli-main.beautified.js  # 主 bundle 美化版 (20.5MB)
│   ├── cli-unity-insight/        # ★ unity-insight 6 个 worker 美化版
│   └── hub/README.md             # 成分鉴定(未深逆)
└── tools/                        # 本次还原用的提取脚本(可复跑)
```

## 还原程度总览

| 层 | 方法 | 还原度 |
|---|---|---|
| 前端 dist | 全量 prettier 美化 + 依赖签名分析 | **100% 文件覆盖**（逻辑零改动） |
| Rust 壳 | 二进制字符串/ACL/插件分析 | 架构与配置完整，Rust 源码为骨架示意 |
| core 边车 | vercel/pkg VFS 解包 | **100% 文件还原**(258/258, 含 wasm/native) |
| CLI 边车 | Bun 模块图明文 carve | 明文 JS 全量(16.3MB/223 段)，字节码部分不可还原 |
| unity-insight | 原始 package.json + bundle 美化 | **完整** |
| hub | 成分鉴定 | 未深逆（ILSpy 可随时补） |

## 快速验证

```bash
# 前端美化版直接可起(任意静态服务器)
npx serve restored/frontend/dist-beautified

# 边车源码抽查
head -c 400 restored/core-gamecowork-binary/binary/out/index.js

# 用 node 跑解包出来的 core 边车(参考)
node restored/core-gamecowork-binary/binary/out/index.js   # 需按 package.json 补依赖环境
```

详见 [RESTORE_STATUS.md](RESTORE_STATUS.md)（逐层记录与未还原项）。
