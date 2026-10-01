# 原版 Codely 反编译执行计划（REVERSE-PLAN）

> 制定日期: 2026-10-01 · 制定者: 侦察轮 agent（成果已内嵌，执行 agent 不必重做侦察）
> 用途: 供后续执行 agent 按任务单逐项反编译原版功能逻辑，产出继续放入本目录。
> 硬边界（继承 [../AGENTS.md](../AGENTS.md)）: 原版 `E:\TuanjieCodely\EXE\Tuanjie Cowork` 与 `original/` 只读；
> **不运行**任何原版 EXE/CLI；不访问凭据/账号/许可；不修改 `restored/`、`app/` 等现有 GameCowork 代码
> （用户已转入自主定制开发，本计划只产出参考文档与提取脚本）；每个产出目录带 `_EXTRACT-MANIFEST.json`（文件 SHA256+大小+日期+方法）。
> 临时中间物只放 `F:\AI\AgentMake\temp\GameCowork\`，不进 Git。

**执行注意（本轮实测）**: 本机模型并发上限低，多个后台 agent 并行会 `model concurrency limit exceeded` 全部失败。
执行 agent 请**串行**跑任务，或最多 1 个后台并发。Python 3.14 在 `python`；Git Bash heredoc 会破坏反斜杠正则，**脚本一律写 .py 文件再执行**。

---

## 0. 库存现状（已有什么 / 缺什么）

### 已有（不必重做）

| 资产 | 覆盖 | 位置 |
|---|---|---|
| 原版 Unity 桥 C# 源码全量 | 427 文件 + ANALYSIS.md 差距图 | `editor-bridge-original/` |
| 前端 347 条 invoke × 持有层交叉 | 91 条壳独有 / 166 core / 72 通用 | `api/MESSAGE-LAYERS.md`、`frontend-inventory.json` |
| core 1168 方法串 / 域命中面 / git 类 / WebRTC 信令 | 索引级 | `api/`、`protocol/` |
| 前端 dist 全量 + cli bundle 全量（含 shimmer/yamlExtract worker、projectZipWorker） | 已确认与原版一致 | `restored/`（已恢复，无需再扒） |
| cowork.exe 字符串分类 45934 条 | 字符串级，**无逻辑重组** | `strings/` |
| 存储布局 / 前端中文文案 | — | `storage/`、`frontend/` |

### 缺失（本计划要补的四大块 + 小项）

1. **cowork.exe（Rust/Tauri 壳）逻辑本体** —— 只有字符串，无模块结构、无命令实现分析。对应 HANDOFF P1「逐项清理未接通操作」「原生桌面体验」、P2「远程工作区」。
2. **hub/LicensingClient（.NET 8）** —— `tjhub/getLicenses|activateLicense|returnLicense|importLicenseFile|generateLicenseRequest` 的对端协议，未动过。.NET 元数据可近乎完整还原。
3. **hub/tuanjie.exe（102MB C++/Poco 安装器）+ 周边小工具** —— `tjhub/getReleases|getModules|getArchive|installEnqueue|downloadTemplate` 的真实后端，未动过。
4. **新旧版本差分** —— `cowork-old-1790684865080.exe` vs `cowork.exe`、`codely-binary-old` vs `codely-binary`（新旧对都在安装目录里），增量功能清单未做。
5. 小项: `process_killer.exe`、`uninstall.exe`、`hub\VisualStudioInstallChecker.exe`、`hub\hasp_update.exe`、`hub\NativeProxyHelper.dll`、`.tuanjie-cowork-install`、`hub\tuanjie-sl.v2c`（结构描述即可，**不复制许可值**）。

---

## 1. 侦察成果 A：壳的 52 个自有 Rust 模块（已从 panic-location 字符串还原）

方法: 提取 cowork.exe 全部 ASCII 串，剔除 `C:\Users\bokken\.cargo\registry\...`（第三方 crate，注意 registry 是 rsproxy.cn 镜像）与 `/rustc/...`（标准库）后，剩余 `*.rs` 即项目自有路径。字符串形态是 `"<panic/错误消息><路径>"` 紧连拼接（Rust `Location::caller` 布局），**这使逐模块消息簇提取成为可能**。

```
src\lib.rs                        入口/装配
src\logger.rs                     日志
src\server.rs                     HTTP 服务器（壳自有 API）
src\server\mobile_home.rs         ★ 移动端主页（远程/隧道入口，HANDOFF P2 远程缺口）
src\metrics.rs                    埋点（[client_installed] sentinel 等已见）
src\system_info.rs                系统信息
src\utils.rs
src\push.rs                       ★ 推送通知
src\terminal.rs                   ★ 终端（对照我们 ConPTY 实现）
src\frp_client.rs                 ★★ FRP 内网穿透客户端（远程工作区核心，P2）
src\tunnel.rs                     ★★ 隧道（tunnel 消息/配置）
src\auth\auth.rs                  ★ 登录/设备码（cancelLogin/notifyDeviceFlowExpired）
src\app\config.rs                 应用配置
src\app\file_preview.rs           ★ 文件预览（shell/openFileInPreview 等壳独有消息）
src\app\file_watcher.rs           文件监听
src\app\restart.rs                重启
src\app\settings.rs               设置
src\app\single_instance.rs        单实例互斥
src\app\state.rs                  全局状态（已见 "shared core not registered"）
src\app\tray.rs                   ★ 系统托盘
src\app\update.rs                 ★ 自动更新
src\app\window_manager.rs         ★★ 多窗口管理（tauri/newWindow）
src\app\window_state.rs           ★ 窗口几何持久化
src\app\workspace_state.rs        工作区状态
src\core\communication.rs         core 通信
src\core\ipc_messenger.rs         IPC（已见 "No GUI transport available (SSE channel not initialized)"——原版也走 SSE！）
src\core\tcp_ipc_messenger.rs     ★ TCP IPC（跨进程，疑似 windowBridge/编辑器通道）
src\core\os_notification.rs       系统通知
src\core\process.rs               进程管理
src\ide\file_service.rs           IDE 文件服务
src\ide\ide_protocol_client.rs    ★ IDE 协议客户端（vscode/jetbrains 对接）
src\lsp\client.rs  \config.rs  \hint.rs  \manager.rs  \server_instance.rs  \transport.rs  \types.rs
                                  ★★★ 完整 LSP 子系统 7 模块（HANDOFF P1 LSP 缺口的直接参考）
src\messages\drill.rs             新手引导 drill/*
src\messages\editor.rs            editor/* 消息
src\messages\pet.rs               pet/* 消息
src\messages\tunnel.rs            隧道消息
src\messages\update.rs            更新消息（已见 "/api/tauri/invoke" + message Content-Type）
src\messages\tjhub.rs             tjhub/* 消息（已见 "tjhub\getStatus" 拼接形态）
src\messages\window.rs            窗口消息
src\pet\events.rs  \queue.rs      ★ 桌宠事件/队列
src\tjhub\client.rs               ★★ Hub HTTP 客户端（与 hub/tuanjie.exe、云端 API 对话）
src\unity\ipc.rs                  ★ 编辑器 IPC（编辑器桥壳侧）
src\unity\insight_serve_client.rs ★ Insight serve 客户端（索引问答链路，P2）
```

（★=与 HANDOFF 缺口直接相关；已见样例字符串是真实提取结果。）

**推断的 Cargo 依赖面**（来自 panic 路径，供复刻选型参考）: tauri + tauri-runtime-wry + wry + tao + muda（菜单）+ axum 系（tower-http serve_dir、hyper 0.14/1.x 并存）+ reqwest（http 0.2/1.4、Polly 类重试无——那是 .NET 侧）+ serde_json + aho-corasick/regex + zip 4.6 + cfb（复合文档!疑似 .sln/duktape 或 v2c 解析）+ urlpattern + bytes + h2 + iri-string + base64 + brotli(deflate 系) + rustc-demangle + tree-sitter(壳内?待确认)。

### 侦察成果 B：LicensingClient 关键类型（从 .NET #Strings 堆直接可见）

`Tuanjie.Licensing.Ipc.dll` 已观察到: `UpdateLicenseRequestV2/ResponseV2`、`ReturnEntitlementGroupRequestV2/ResponseV2`、`EntitlementDetailsGroupData`、`IpcResponseCode`、`MultiStatusResponse<T>`、`Notification<T>`、`ResultWithCode<T>`、`IsProtocolVersionSupported`、字段 `MachineId/OrgId/SessionId/CorrelationId/ExternalCorrelationId/OrganizationId/EntitlementGroupId/SeatId/ProjectId/EntitlementId/CustomData/IncludeCustomData/IsFloatingFallbackRequired/Assigned/ResponseCode/StatusCode/IsPackage`。
业务程序集清单: `Tuanjie.Licensing.{Client,Analytics,EntitlementContext,EntitlementResolver,Genesis,Infrastructure,Ipc,Platform,Server.Shared}.dll` + `Tuanjie.ProxyHelper.dll` + `bindings.dll`，.NET 8 自包含（8.0.1124 runtime），旁有 `CommandLine.dll`（命令行解析库）与 `Tuanjie.Licensing.Client.dll.config`（纯文本可直读）。

---

## 2. 方法工具箱（已验证可行的技术路线）

| # | 方法 | 适用 | 要点 |
|---|---|---|---|
| M1 | ASCII+UTF-16LE 双编码字符串提取（≥4/5 可打印） | 所有 PE | Rust 主用 ASCII；.NET 用户串(#US)是 UTF-16LE；Windows 程序 UTF-16 多。流式按块读，避免 58MB/102MB 一次载入排序爆内存 |
| M2 | panic-location 切分 | Rust exe | `re.split(r'bokken\|/rustc/', s)` 取尾段找 `*.rs`；消息与路径紧连 |
| M3 | 邻近窗口分析 | 定位命令/模块实现 | 对目标串（如 `tjhub_getEditors` 或模块路径）取字节偏移 ±2048 的所有短串 → 该函数的参数字段名/错误消息/URL 簇。Tauri `generate_handler!` 注册区命令名密集相邻，参数结构体 serde 字段名（camelCase）与命令名同簇 |
| M4 | .NET CLI 元数据解析 | LicensingClient | 解析 PE→`BSJB` 根→流目录（#~、#Strings、#US、#Blob）→ TypeDef/MethodDef/Field/Property 表。输出命名空间→类型→成员签名。优先试 `dotnet tool install -g ilspycmd`（若网络允许），失败则自写解析器（token 压缩表按 ECMA-335） |
| M5 | 新旧集合差分 | 版本演进 | 各自提取去重后做 only-new / only-old，过滤版本号/哈希/路径噪音；重点看新增命令名、新增 `src\*.rs`、新增 URL |
| M6 | 与前端库存交叉印证 | 所有结论 | 命令名去 `api/frontend-inventory.json` 对参数结构；壳调用小工具的参数串去 §T3 目标文件字符串表互证 |

**脚本规范**: 新提取脚本放 `tools/extract-reverse-*.py`（可复跑、含 argparse 与来源路径常量），一次性侦察脚本放 temp。输出文档中文、面向"要在 GameCowork 复刻该功能的开发者"，必须给出**数据结构/协议事实**而不是字符串堆。

---

## 3. 任务单（按价值排序；执行 agent 从 T1 开始串行领取）

### T1 ★★★ cowork.exe 壳逻辑深挖 → `shell-logic/` ✅（2026-10-01 完成，见 shell-logic/README.md）
输入: `E:\TuanjieCodely\EXE\Tuanjie Cowork\cowork.exe`（58,555,736 B, PE32+ 7 节）。
子任务:
- **T1.1 模块消息簇**: 用 M1+M2 全量提取（带字节偏移）；对 §1 的 52 模块路径各自收集 ±2048B 窗口内字符串 + 含路径 panic 消息 → `modules/<模块名>.md`（每模块: 职责推断、关键消息摘录、涉及的命令/URL/键）。
- **T1.2 Tauri 命令注册面**: 以 MESSAGE-LAYERS 的 91 条壳独有消息为种子（`tjhub/*`、`tauri/*`、`pet/*`、`editor/*`、`shell/*`、`lsp/isServerInstalled`、`deep-link`、`external-drag-*`…），M3 定位每条命令邻近的 serde 参数字段名簇 → `commands.md`（命令 → 参数字段 → 响应线索 → 归属模块）。**这是 P1「未接通操作」的直接对照表**。
- **T1.3 tjhub/client.rs HTTP API**: 收集 exe 内全部 URL 路径/域名字符串（`https://`、`/api/`），与 `getEditors/getLicenses/getReleases/getModules/getArchive/getTemplates/...` 命令交叉 → `tjhub-api.md`。注意区分云端 API vs 本地 `hub/tuanjie.exe` 调用。
- **T1.4 LSP 子系统还原（P1 LSP 缺口核心参考）**: 7 个 `src\lsp\*.rs` 的消息簇 + 全 exe 中 LSP 相关串（server name、安装 URL、端口、`content-length` 头、jsonrpc）→ `lsp-subsystem.md`：壳如何安装/启动/复用 server、文档同步、与前端 `lsp/*` 消息的桥接方式。
- **T1.5 隧道与远程（P2）**: `frp_client.rs`/`tunnel.rs`/`server\mobile_home.rs`/`messages\tunnel.rs` 消息簇 + FRP 协议串（`frp`、`xtcp`、`stcp`、token、`tauri/getTunnelEnabled`）→ `tunnel-remote.md`：隧道服务器、鉴权、端口分配、断线策略。
- **T1.6 unity/ipc.rs + insight_serve_client.rs**: 编辑器桥壳侧协议（与 `editor-bridge-original/` 的 C# 端互证）+ 索引 serve 链路 → `unity-shell-side.md`。
- **T1.7 窗口/托盘/更新/单实例**: `app/*` 消息簇 → `desktop-shell.md`（窗口几何持久化格式、托盘菜单、更新通道 `tauri/getUpdateChannel`、deep-link 协议）。
验收: `shell-logic/` 有 `commands.md`（≥91 条命令全部有参数级描述或明确"仅转发"结论）+ 上述专题文档 + `_EXTRACT-MANIFEST.json`。

### T2 ★★ LicensingClient .NET 反编译 → `hub-licensing/` ✅（2026-10-01 完成，ilspycmd 全量反编译；另确认壳 hub process=tuanjie.exe，已修正 tjhub-api.md）
输入: `E:\TuanjieCodely\EXE\Tuanjie Cowork\hub\LicensingClient\`（§侦察成果 B 列表）。
- M4 提取 11 个业务 DLL 全类型/方法/字段/枚举 + #US 用户字符串（JSON 字段名、管道名、URL、日志模板）。
- 优先 ilspycmd 导出 C# 到 temp；失败则自写 ECMA-335 解析器（TypeDef/MethodDef/Field/Property/Event + #Strings/#US）。
- 产出: `TYPES.md`（全量签名）、`IPC-PROTOCOL.md`（Ipc.dll 消息 V2 族、传输=命名管道或 socket 的证据、版本协商、MultiStatusResponse 语义）、`CLIENT-SURFACE.md`（入口 Main/CommandLine 命令定义、cowork.exe 如何拉起它——与 T1.2 中 license 相关命令的参数互证、deps.json/config 摘录）、`_EXTRACT-MANIFEST.json`。
- 红线: 只描述协议结构；**不**记录任何本机许可文件内容/机器指纹值。
验收: 4 文件齐 + 至少还原 Ipc.dll 全部公共类型签名。

### T3 ★★ hub/tuanjie.exe 安装器 + 小工具 → `hub-installer/` ✅（2026-10-01 完成；实为 Bun 单文件 Hub，52 个 JSON-RPC 方法全表提取）
输入: `hub\tuanjie.exe`（102MB Poco C++）、`hub\VisualStudioInstallChecker.exe`、`hub\hasp_update.exe`、`hub\NativeProxyHelper.dll`、`process_killer.exe`、`uninstall.exe`、`.tuanjie-cowork-install`、`hub\tuanjie-sl.v2c`。
- M1 分块流式提取（102MB 注意内存）；CLI 参数（`--x`、usage 文本）、URL/路径、JSON 键、日志分类、端口/管道。
- 重点映射: 壳 `tjhub/getReleases|getModules|getArchive|getArchiveEulaContent|getEulaContent|installEnqueue|installCancel|installRetry|enqueueArchive|downloadTemplate|getTemplates|installRosetta2|checkRosetta2|getInstallLocation|locateEditor` → 安装器行为（下载源、队列/进度协议、取消语义、磁盘布局）。
- `process_killer.exe`: 参数表 + 查杀目标线索（互斥体/窗口类/进程名）。
- `v2c`: 仅格式描述（Sentinel 结构），**不复制内容值**。
- 产出: `tuanjie-exe-cli.md`、`tools-analysis.md`、`v2c-and-install-marker.md`、`strings-tuanjie-exe.txt`（过滤版，注明原始量）、`_EXTRACT-MANIFEST.json`。
验收: 每个 tjhub 安装类命令都能指出"壳→安装器"的证据链或明确标注未找到。

### T4 ★ 新旧版差分 → `diff/` ✅（2026-10-01 完成；壳 canary.1→canary.2 实质增量清单 + core 载荷翻倍 15.8→32.6MB 结论）
输入: 4 个 EXE（新/旧 壳 + 新/旧 core，均在 `E:\TuanjieCodely\EXE\Tuanjie Cowork\`，见 §0.4）。
- M1+M5；临时提取放 `F:\AI\AgentMake\temp\GameCowork\diff-extract\`。
- 产出: `VERSION-DIFF.md`（版本区间、新增/移除命令、新增 `src\*.rs` 模块、core 新增消息/工具、复刻建议）、`shell-new-only.txt`/`shell-removed-only.txt`/`core-new-only.txt`/`core-removed-only.txt`、`_EXTRACT-MANIFEST.json`。
验收: 新壳相对旧壳的新增命令清单完整（与 MESSAGE-LAYERS 对照说明哪些是全新域）。

### T5 ★ 交叉引用与索引收尾（依赖 T1-T4）✅（2026-10-01 完成）
- 用 T1.2 结论回填 `api/MESSAGE-LAYERS.md`: 91 条壳独有消息标注"已在 shell-logic/commands.md 还原参数"。
- 重写本目录 `README.md` 资产索引表，加入 `shell-logic/`、`hub-licensing/`、`hub-installer/`、`diff/`。
- 在 `../RESTORE_STATUS.md` 追加一节"反编译参考库新增"记录本轮（不改其它内容）。

---

## 4. 产出目录总览（完成后）

```
codelyreversebackup/
  REVERSE-PLAN.md          本计划
  shell-logic/             T1: modules/ commands.md tjhub-api.md lsp-subsystem.md tunnel-remote.md unity-shell-side.md desktop-shell.md
  hub-licensing/           T2: TYPES.md IPC-PROTOCOL.md CLIENT-SURFACE.md
  hub-installer/           T3: tuanjie-exe-cli.md tools-analysis.md v2c-and-install-marker.md strings-tuanjie-exe.txt
  diff/                    T4: VERSION-DIFF.md + 4 个差分清单
  (已有 api/ protocol/ strings/ storage/ frontend/ editor-bridge-original/ 不动)
```

## 5. 全局验收清单（目标完成判据）

- [x] 91 条壳独有 invoke 消息全部有参数级还原或"通用转发"结论（T1.2 → shell-logic/commands.md，30+ 条 ∅ 已逐一 grep 验证）
- [x] LSP 模块协议文档成文，能指导 GameCowork 补 LSP 宿主生命周期（T1.4 → shell-logic/lsp-subsystem.md，实测 9 模块非 7）
- [x] 隧道/远程三件套（frp/tunnel/mobile_home）协议与配置面成文（T1.5 → shell-logic/tunnel-remote.md）
- [x] LicensingClient IPC 消息族字段级还原（T2 → hub-licensing/IPC-PROTOCOL.md，42 messageType+传输/通知通道；超出计划：全 DLL 486 类型清单 + 41 CLI 选项）
- [x] 安装器 tjhub 安装类命令映射闭环（T3 → hub-installer/tuanjie-exe-cli.md，52 个 JSON-RPC 方法全表 + 逐一映射，超出计划：确认 Hub 为 Bun 应用与双分帧兼容）
- [x] 新旧差分清单落地且 VERSION-DIFF.md 给出复刻优先级建议（T4 → diff/）
- [x] 每个新目录有 _EXTRACT-MANIFEST.json；README/RESTORE_STATUS 索引更新（T5）
- [x] 全程未运行原版 EXE、未触碰凭据、未修改 GameCowork 现有代码

---

## 6. 第二轮：core 业务域深挖（T6-T10，2026-10-01 完成）

### 缺口定位方法（可复跑）

第一轮 T1-T5 覆盖了壳/.NET 许可/安装器/差分，core 只有索引级（1168 方法串/域命中面），**域级实现无人深挖**。本轮用三张表交叉定位真遗漏：

1. `api/core-rpc-registry.txt` 的 108 个前缀（剔除 mime/模型名等库内部前缀后得到业务域）；
2. `api/frontend-inventory.json` 347 条前端 invoke（**有 UI 入口的才算用户可感知功能**）；
3. 全库文档 grep 反查（domains-surface.md 只有 33 行命中清单，MESSAGE-LAYERS 只有一层消息名——均为"入口已列、实现未还原"）。

### 任务单与结论（产出 → api/ 五篇文档 + _EXTRACT-MANIFEST.json）

| # | 域 | 关键新事实 | 产出 |
|---|---|---|---|
| T6 | 会话检查点/回退 | rewind 支持 `dryRun` 预览与 `code` 执行，预览走 `_meta.gamecowork.rewindPreview`；CLI RewindService 快照在 `<historyDir>/snapshots/`；`checkpoint_save` 会话更新是旧 CLI 兼容探测点；fork 产生 `<旧标题> (forked)` 新会话且 id 由用户消息序号换算 | api/session-checkpoints.md |
| T7 | MCP OAuth/elicitation | OAuth 仅 SSE/HTTP 传输、固定 localhost:3000 回调、令牌存 `mcpOauthStorage[serverUrl]`、授权后同步令牌给 CLI 并重连；**elicitation 前端零命中（仅 SDK 协议面）**——复刻时不要宣称完整 MCP | api/mcp-oauth-elicitation.md |
| T8 | config/记忆/allowlist | allowlist 是 TOML 策略文件 `~/.gamecowork-cli/policies/auto-saved.toml`（shell=run_shell_command 前缀；MCP=`server::tool`）；分层记忆含 `.gamecowork/GAMECOWORK.md`+SUMMARY+rules；GameCoworkHome 三步迁移流；全局记忆有 `~/.continue/` 上游残留路径 | api/config-memory-allowlist.md |
| T9 | context 引擎+Unity 工具 | 7 个内建 @ provider（file 前 1500 行/1MB/`N-> ` 行号）；repoMap 是 tree-sitter 单例懒缓存；**core 内嵌 8 个 Unity Agent 工具 schema**（unity_editor 的 play/pause/refresh 等，defaultToolPolicy=allowedWithoutPermission）——是 editor-bridge 26 管理器的 core 侧对端，此前未提取 | api/context-engine-and-unity-tools.md |
| T10 | 市场/反馈/引导 | skills/extensions/marketplace 共用 `/api/marketplace`（attachment_map/author_map 归一化）；extension 分发走 download_url（git_url 恒空）；feedback project.zip 仅在提交成功拿到数字 id 后后台上传且与进行中互斥；walkthrough 是独立窗口+3 条 drill 消息+3 步骤 | api/marketplace-feedback-walkthrough.md |

### 执行边界（与第一轮相同，已遵守）

全程只读 `restored/` 维护副本（与原版 EXE 内嵌 JS 同源）并回指原版安装路径；未运行原版 EXE/CLI；未触碰凭据；未修改 `restored/`、`app/` 现有代码；产出仅本目录文档。

### 遗留（下轮候选）

- CLI `mcp/`OAuth 之外：`ide/*`（list-assistants、sync-secrets、policy）为控制面云服务，本地复刻价值待用户定夺；
- `extensions` 远程安装的 `config/userEnvConfig` 交互流程只提取了字段名，对话框 UX 未还原；
- `unity/installMcpPackage` 的 UPM 装包链路只提取了 core 侧入口，桥侧安装器行为需与 editor-bridge-original 对照后再补。
