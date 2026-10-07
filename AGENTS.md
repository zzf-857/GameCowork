# GameCowork 项目规范

本项目同时遵守所在工作区上层的 `AGENTS.md`（存在时）。目标是保留原项目的全部功能与交互，持续修复实际产品链路，并在此基础上优化自定义功能。原软件 `E:\TuanjieCodely\EXE\Tuanjie Cowork` 和 `original/` 仅作为只读参考。

## 源码与运行边界

- 开始前阅读 [README.md](README.md)、[架构说明](docs/architecture/overview.md) 和 [开发指南](docs/development/guide.md)。维护输入归 `src/`，冻结依赖归 `vendor/`，历史分析归 `research/`，开发文档归 `docs/`；不重新创建 `restored/` 或第二份源码。
- 测试按 `tests/contracts/`、`integration/`、`e2e/`、`fixtures/`、`support/` 分类；Rust 单测保留在所属模块。日常脚本保留在 `tools/`，`tools/research/` 中历史探针不进入默认构建与验证。
- 路径或目录变更先运行 `node tools/check-layout.mjs`，同步构建、门禁、冻结资源的 `.gitattributes` 和当前文档；历史记录正文的旧路径按架构文档迁移表理解，不改写当时的验收事实。
- 实际运行壳是 `src/shell/`（wry/tao + axum）；`research/tauri-shell/` 是历史分析骨架，不是当前构建入口。
- `src/frontend/bundle/` 是目前可维护的前端基线，这是维护输入，不是可删除的生成物；当前没有可复现的 Vite 源工程。两代共用业务 chunk 需要同步修复并测试。
- 官方内置账号功能以原组件、原配置协议和账号真实权限为准；有权限、无权限及未登录分支均保持原交互。模型名称、顺序、倍率、图标、推理选项和禁用状态不由裸API模型目录或套餐名称猜测，也不把官方内置模型伪装成自定义Provider条目。自定义功能增量维护，保留已有配置与原功能入口。
- core 的实际入口是 `src/core/binary/out/index.js`；同时维护 `index.beautified.js` 的对应逻辑，并用提取真实函数的契约测试验证两份行为。
- `app/` 是装配产物，使用 `tools/build-local.ps1` 更新；不手改 app 的 JS、EXE 或数据库。不能用原版 Agent CLI 改名来冒充恢复了 Agent 功能。
- `src/editor-bridge/` 是自己的 Unity Editor-only UPM 包；`windowBridge.html` 与独有 `gamecowork-image-frames.js` 是实际帧传输源码。真实 Editor 验证只用统一 temp 内的自有工程和已有许可，不执行激活/登录，不自动修改用户工程；本地桥依赖只有用户在该工程触发安装后才改 manifest，并保留原字节备份。
- `src/unity-insight/` 是索引 worker 的维护输入，资源恢复只读原文件并记录版本/SHA/许可证；不运行原 CLI、不编辑 node_modules。运行缓存留在本应用 data/insight，测试缓存与依赖准备只进入统一 temp；worker 的路径权限、metrics 停用和独立 Job 都是功能边界。
- `vendor/csharp-lsp/` 是冻结的公开 C# LSP runtime、来源/许可证与 SHA ledger；`src/shell/src/developer_tools/lsp.rs` 及两代 Monaco 是实际接线。只在用户显式启用后启动，按已打开工作区的根与代际隔离文档/进程，禁止接受客户端指定 runtime 或缓存根。读取真实 `.sln/.csproj`，不自动生成工程、转换 Unity 元数据或联网 restore；未保存内容只做递增版本同步，不代替文件保存。关闭/启停/重开与旧查询必须验证版本和代际，回收自己的 Job。
- `editor/project_templates.rs` 只枚举选定安装编辑器的真实本地 UPM 模板；创建独立新目录并拒绝覆盖，取消提交前任务要释放自己的暂存目录。编辑器身份必须与注册候选一致；Unity/Tuanjie 同版本不能串选。模板测试不裁减原 manifest 或用停用 Package Manager 替代完整导入；公开包依赖准备与离线验收分开记录，不修改用户缓存或凭据。
- 功能状态、未完成项和本次验证记录写入 `RESTORE_STATUS.md`，不要新增平行计划或状态快照。历史文件提取率不等于功能完成率。
- 源码按功能领域分类，旧新位置见 `docs/architecture/path-migrations.json`；新文档归 `docs/{architecture,development,editor,history}/`，历史计划归 `codelyreversebackup/history/plans/`。用户指定所有临时计划、分析产物、截图、日志、备份、测试工程和候选包进入 `codelyreversebackup/work/<日期-任务>/`，不在根目录散放。该目录被 Git 忽略；冻结依赖、原参考、带哈希 bundle 和正常 Rust `target/` 缓存保留各自边界。
- `codelyreversebackup_fromunityhub/` 是用户指定的 Unity Hub 原码参考库；原 ASAR 与片段须核对 SHA，保留依赖缺口，不执行原 Hub/native/licensing 实现。运行源码继续沿用自有 Core 扫描与模板服务。Unity 与团结许可证分别标注；`workspaceAllowed` 只表示本地工作区权限，不能用它或锁文件宣称 Editor 已激活/在线。
- 用户指定的 `docs/history/HANDOFF.md` 是交接导读，引用当前状态和源码复用位置；恢复任务后继续更新 `RESTORE_STATUS.md`，不要将交接文档变为第二套活动状态。

## 验证

```powershell
# 完整本地验证：Rust、真实前端契约、隔离 HTTP 和 Chromium
.\tools\verify-local.ps1

# 加上受控的真实 core 验证（不调用真实 Provider 或编辑器）
.\tools\verify-local.ps1 -RealCore

# 真实 Agent 和模拟 Provider 的聊天/文件界面；只使用 guarded 测试包
.\tools\verify-local.ps1 -RealCore -Chat

# 自有临时 Unity 工程的真实 Scene/Game 预览；仅使用已有许可
.\tools\verify-local.ps1 -RealCore -Chat -Editor

# 构建并更新 app；若 app 正在运行则保留准备好的包并停止替换
.\tools\build-local.ps1
```

- 流程、工作区、HTTP/SSE、跨进程或生命周期变更需要对应契约测试和 E2E。不能把 HTTP 200、外层 success 或编译成功当作功能验收；检查内层状态、最终帧与实际界面状态。
- C# LSP 验证区分 SDK fixture 与选定 Unity Editor 实际生成的经典工程元数据；不能用前者代替后者。`verify-local -Editor` 包含 `lsp-unity-e2e.mjs`，使用自有 temp 工程、原始 Unity 引用和元数据字节；C# 服务当前需要本机 .NET SDK 10。
- 浏览器 E2E 使用真实桌面/GUI 前端和实际 Rust HTTP 壳，core/Hub/Editor/Provider 使用隔离 fixture；外部请求必须阻断。截图、浏览器数据、日志与测试目录统一放在 `F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work`。
- 测试进程只按自己启动的 PID 和唯一测试目录核实、终止，禁止按 `node`、`GameCowork`、`Unity` 等进程名清理。

## 本地状态与隔离

- 正常运行的工作区注册表及界面偏好位于 `%LOCALAPPDATA%\GameCowork`；首次可只读迁移 app/workspace.txt。关闭或移除工作区只改自己的注册状态，不能删除项目文件或修改官方 Hub 注册表。
- core 默认沿用 `%USERPROFILE%\.gamecowork`，CLI 使用 `.gamecowork-cli`。壳显式设置 `CONTINUE_GLOBAL_DIR`、`GAMECOWORK_USER_DATA_DIR`、`GAMECOWORK_CLI_HOME`，不继承其它安装的 CLI 路径。
- 验证使用专用 `GAMECOWORK_DATA_DIR`；其它路径通过 `GAMECOWORK_APP_ROOT`、`GAMECOWORK_FRONTEND_DIR`、`GAMECOWORK_CORE_DIR`、`GAMECOWORK_CORE_ENTRY` 显式传入。验证可用 C# LSP 时显式提供自己的冻结 `GAMECOWORK_LSP_DIR`；空 app-root 的不可用 fixture 必须诚实返回未安装，不能伪造支持或过滤可选探测错误。不要通过改写 HOME/USERPROFILE 把测试伪装为隔离。
- 不访问或上传原软件凭据；本地 UI 身份只表示 GameCowork 本地模式，不能拿它代替编辑器自身许可或外部服务认证。
- 第三方模型、图片、视频、3D Provider 是用户指定的后续阶段。自动测试不得调用真实额度，配置与密钥不得进 Git、截图或日志。
