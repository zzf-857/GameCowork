# 双引擎 + 多工程视图 — 源码级研究报告与实施方案

> 2026-09-30 · 基于 GameCowork 还原源码（core/cli/前端三层的美化 bundle）
> 目标：① GameCowork 满载支持同时打开 Unity 与 Tuanjie 项目；
>      ② 在当前编辑器内部直接查看**不同工程**的视图。

> **2026-10-01 复核修正**：这是历史研究稿，旧文中的“90%”“协议全部就绪”“天然持有 N 个工程连接”均不能作为当前运行事实。
> 实际 CLI 的 Unity TCP 客户端是单例，只有一个 socket 与静态 projectRoot（`cli-main.beautified.js` 的 `ks` / `setProjectRoot`）。带 PROJECT_ROOT 的握手只能证明工程身份，不能证明并行连接能力。
> 真实握手解析为 `WELCOME UNITY-TCP ... FRAMING=1`，带 SERVER_VERSION 和 URL 编码 PROJECT_ROOT；下文 `GAMECOWORK_BRIDGE=1` 的旧推测不准确。
> 当前第四阶段正式包已验收多工作区、自有 Agent、自有桥、Unity 程序集重载与单 GUI 双工程四槽预览。恢复任务后新增实际 Tuanjie 单工程 18 项与同 GUI Unity＋Tuanjie 双引擎 14 项运行验收。预览使用按打开工作区验证的原生桥路由，每槽保留固定工程身份；没有依靠原 CLI 单例去证明多工程连接。下文 G1–G4、桥缺位与旧百分比是历史发现，当前状态与本次报告见 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)，接手见 [docs/history/HANDOFF.md](../history/HANDOFF.md)。

## 一、现状结论（三层证据）

### 1. 双引擎"打开项目"——已具备 90%，属验证级缺口 ✅

| 机制 | 实现 | 证据（还原源码函数） |
|---|---|---|
| 引擎判定 | 读 `ProjectSettings/ProjectVersion.txt`：`m_TuanjieEditorVersion:`→Tuanjie，`m_EditorVersion:`→Unity | core `hRi()` / `f9e()` |
| 已装编辑器枚举 | **双引擎对称**：`%APPDATA%/{TuanjieHub,UnityHub}`（Hub 配置）、`%ProgramFiles%/{Tuanjie,Unity}/Hub/Editor`（Hub 安装）、`%ProgramFiles%/{Tuanjie,Unity} <版本>`（独立安装）；mac/linux 对称 | core `C2i()` → `qba(engine)` → `PUt/u2i/f2i/R2i` |
| Tuanjie 版本映射 | tuanjie 特有 `tuanjie_editor_version` 映射（团结版本号≠Unity 版本号） | `qba()` 内 `jba()` |
| Hub 项目清单 | **双引擎**：`for e of ["tuanjie","unity"] → {product, projects, editors}` | core `eha()`（`unity/getHubProjectsAndEditors` RPC） |
| 启动编辑器 | 已开置前 → 版本匹配（不匹配回 `needsSelection`）→ Win 走 WMI / mac `open -n -a --args -projectPath` | core `$ba()`（openProjectWithEditor） |
| 打开项目 UI | TJHubRoute 页 `tjhub/openProject|createProject|openRemoteProject`；Unity 项目走"打开工作区"文件夹 | 前端 `TJHubRoute-*.js` |

**缺口 G1**：TJHubRoute 前端**没有消费** `getHubProjectsAndEditors` 的双引擎清单（0 处引用）——
Unity Hub 的项目/编辑器数据 core 已经返回，但统一项目页只画了 Tuanjie Hub 的数据。

### 2. 多工程视图——协议层已就绪，前端是单工程绑定 ⚠️

串流链路（还原自源码）：

```
前端 RightSideBarPanel
  → RPC unity/windowBridge/listWindows {sessionId, projectRoot…}
    → core: ACP 会话条目(按 sessionId 的 agent CLI 进程)
      → agentManager.connection.sendRequest("_gamecowork/unity/window_bridge/list_windows", {projectRoot})
        → CLI agent ↔ 编辑器内桥接包(握手: PROJECT_ROOT=<工程路径> SERVER_VERSION=<n>)
          → 桥枚举编辑器窗口 / 拉起 native stream server(按工程)
            → windowBridge.html iframe (serverUrl) 渲染 <video>+<canvas>
```

关键证据：
- **握手自带工程身份**：CLI 解析 `m.match(/PROJECT_ROOT=(\S+)/)`、`SERVER_VERSION=(\d+)`，
  未带就报错 "did not send PROJECT_ROOT. Update cn.gamecowork.bridge in UPM" ——
  **每个编辑器实例连上来就自报工程 → agent 端天然可持有 N 个工程连接**；
- **RPC 按 projectRoot 参数化**：`ppa(manager, projectRoot)`、`OOt(manager, {port}, projectRoot)`；
- **多编辑器可发现**：core `kP()` 靠进程枚举（进程名 `Unity|Tuanjie` + 命令行含工程路径）定位实例，
  多开的编辑器各自命中；
- **布局持久化自洽**：`unity-default-layout` / `gamecowork-saved-layout` /
  localStorage `gamecowork.unity-composite-layout`（版本号 `ug=1`），快照消息
  `unity-window/composite-layout-snapshot {slots}`。

**缺口**：
- **G2 布局无工程维度**：视图槽位仅 `viewType || typeName`（Game/Scene/Inspector/Hierarchy/Console/Project
  六类），`update-composite-layout {layout, serverUrl}` 单 serverUrl —— 一个面板只绑一个编辑器；
- **G3 无"编辑器实例列表" RPC**：现有 `listWindows` 只针对请求里那一个 projectRoot，
  没有"列出当前所有已连接编辑器（按工程分组）"的入口；
- **G4 Streaming 标签门控**：`AT()` 组件按**当前工作区** `isUnityProject` 决定显示，
  跨工程视图没有 UI 入口。

### 3. 桥接包——分叉后的空档 ❌（预期内）

隔离轮把桥名分叉为 `cn.gamecowork.bridge`（官方 UPM 无此包），因此编辑器内桥目前**缺位**。
协议细节在 CLI 侧可完整读到（握手字段、`useFraming` 帧模式、`manage_window_bridge`
action 分发：`list_windows/start_stream_server/stop_stream_server/get_stream_server_status`），
自研桥所需的一切都在仓库里。

## 二、实施方案（P0→P3）

### P0 双引擎打开项目验收与补缺（1-2 天）
1. 端到端验证：Unity Hub 装的编辑器 + Tuanjie Hub 装的编辑器各开一个工程，
   `unity/getHubProjectsAndEditors` 返回两组 `{product, projects, editors}`（eha 已实现）；
2. 补 G1：TJHubRoute 项目页消费双引擎清单——按 `product` 分组渲染
   （数据字段 core 已给全：`projects[]` 带 path/version，`editors[]` 带 path/version/tuanjie_editor_version）；
3. 打开路径统一：项目条目"打开"一律走 `openProjectWithEditor`（按 ProjectVersion 判引擎、
   双引擎编辑器列表匹配），Tuanjie Hub 专属流程（uosEnabled/组织）仅对 `product==="tuanjie"` 生效。

### P1 多工程视图（核心开发，前端+agent+core 三处）
1. **agent(CLI) 新增连接注册表查询**：CLI 已按握手 `PROJECT_ROOT` 持有多桥连接——
   暴露 `manage_window_bridge {action:"list_editors"}`，返回
   `[{projectRoot, engineType, serverVersion, pid, windows[]}]`（全部已连接编辑器）；
2. **core 透传 target**：`unity/windowBridge/{listWindows,startStreamServer}` 请求体加
   `targetProjectRoot`（缺省=当前工作区），`ppa/OOt` 原样已参数化，改动集中在 RPC handler；
3. **前端 RightSideBarPanel**：
   - 复合布局槽位 schema 升版（`ug: 1→2`），槽位增加 `projectRoot` 字段，旧布局迁移时默认填当前工作区；
   - "添加视图"流程改为两段：先选编辑器实例（list_editors 结果，带工程名/引擎徽标）→ 再选窗口类型；
   - 每槽位 iframe 的 `serverUrl` 改为"该工程的 stream server"（startStreamServer 按 targetProjectRoot 各自拉起）；
   - 槽位角标显示工程名 + 引擎（防 A/B 工程视图混淆）；
   - Streaming 标签门控放宽：当前工作区 OR 存在任一已连接编辑器即显示；
4. **gamecowork-saved-layout 持久化**：沿用现有 read/save_unity_streaming_layout invoke，
   payload 内加 version+projectRoot 数组，向后兼容旧单工程布局。

### P2 自研桥接包 `cn.gamecowork.bridge`（编辑器侧，协议已在仓库内）
1. 协议规格（从 CLI 侧逆向，已可写全）：外连 agent → 握手串含
   `GAMECOWORK_BRIDGE=1`（framing 协商位）、`SERVER_VERSION=<n>`、`PROJECT_ROOT=<abs path>`；
   动作集 = `manage_window_bridge` 的四个 action + 窗口枚举返回
   （窗口名匹配 `Bu` 表：`UnityEditor.GameView/SceneView/InspectorWindow/SceneHierarchyWindow/ConsoleWindow/ProjectBrowser`）；
2. Tuanjie 与 Unity 同一包：团结引擎是 Unity fork，`EditorWindow` API 同名兼容
   （官方桥即为双引擎单包的先例）；
3. 发布到自建 UPM；GameCowork 的 `unity/installMcpPackage/updatePackageVersion`
   已按包名常量工作，指向新包即可（core 内 1 处 + cli 内 9 处常量已 GameCowork 化）。

### P3 体验汇合
- 统一项目首页：双引擎 Hub 项目 + 本地工作区合并列表；
- 编辑器内嵌面板（gui.html）与桌面壳共用同一套多工程视图组件（两宿主已共享 RightSideBarPanel chunk，改一处双端生效）。

## 三、风险与边界

| 风险 | 说明 | 对策 |
|---|---|---|
| bundle 改动自洽 | 前端/core/cli 是美化产物，改字符串必须三层同步 | 每轮改完跑 `tools/research/migration/rename-codely.py` 同款一致性校验 + prettier 重解析 |
| 桥协议细节 | framing/心跳/窗口掩码(`StreamingMaskWindow`、`Disconnect & Restore` 过滤) 仍有未知位 | 以 CLI 侧解析逻辑为准逆向补全，先在 Tuanjie 编辑器单工程打通再扩 |
| 与已装 Codely 并存 | 本方案不动官方桥/官方后端，隔离目标不受影响；同一编辑器工程两版勿同时操作 | PACKAGING.md 验证清单照跑 |
| macOS 串流 | 原版即标注不支持（i18n `streamingUnavailableMac`） | 保持 Windows 优先 |

## 四、一句话总结

"同时打开双引擎项目"在还原源码里**已经是完备能力**（枚举/判定/启动/Hub 清单全对称），
差的只是前端统一项目页没接双引擎数据（G1）；
"编辑器内查看不同工程视图"的**协议地基全部现成**（握手自报工程、RPC 按工程参数化、
进程枚举可发现多实例），缺的是把"工程维度"补进布局 schema、加一个
`list_editors` RPC、以及自研 `cn.gamecowork.bridge` 桥——三者都在 P1/P2 范围内，
不需要动任何已装软件。
