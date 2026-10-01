# GameCowork 开发指南

## 环境与前置条件

当前开发目标是 Windows。版本来自已有本机环境，不是跨版本兼容承诺。

| 工具 / 资源 | 用途 |
| --- | --- |
| PowerShell 7 | 构建和验证脚本使用 .NET 路径 API |
| Node.js 24.x | Core、worker、契约和浏览器测试 |
| Rust / Cargo（本机 1.95.0） | 编译宿主，使用冻结的 Cargo.lock |
| Bun（本机 1.3.11） | 编译自有 Agent CLI |
| WebView2 Runtime | 原生桌面界面 |
| Playwright 与 Chromium 本机缓存 | 浏览器门禁；driver 支持显式路径参数 |
| .NET 10 SDK | 冻结 C# LSP 运行与验证 |
| Unity / 团结及已有许可 | 仅真实编辑器门禁需要 |

构建使用 `cargo --offline --locked`，需要预先准备工具链和依赖缓存。`build-local.ps1` 还读取本应用已有 `app/core/gamecowork-runtime.exe`；当前没有从零安装运行时的一键 bootstrap，不能用原版 Agent EXE 改名替代。

根 `package.json` 只聚合命令，没有 npm workspace 或前端依赖安装步骤。`tools/package.json` 属于历史格式化工具；不要在 `src/frontend/` 按推断版本安装依赖。索引和 LSP 冻结资源已跟踪，由资源契约检查完整性。

## 日常修改流程

1. 执行 `git status --short --branch`，阅读 [AGENTS.md](../AGENTS.md) 与目标目录规范。
2. 按 [架构说明](ARCHITECTURE.md) 找到所属模块，保留用户已有修改。
3. 同步维护两代前端共享行为、Core 的实际入口与可读版本；避免全量格式化 bundle。
4. 先运行相关契约，涉及 HTTP、界面、进程或编辑器行为时继续运行对应集成 / E2E。
5. 运行目录检查和统一验证，在 [RESTORE_STATUS.md](../RESTORE_STATUS.md) 记录证据。
6. 需要本机交付时使用装配脚本，再做包内验收；源码验证与包内验收分别记录。

## 验证选择

所有命令均在项目根目录、PowerShell 7 中执行。

| 场景 | 命令 | 边界 |
| --- | --- | --- |
| 目录、链接、脚本路径 | `npm run check:layout` | 静态检查，不代表功能可用 |
| 契约和后端 | `npm run verify:backend` | Rust fmt / test / build、Node 契约与隔离服务；跳过浏览器 |
| 默认本地门禁 | `npm run verify` | 加上真实 Chromium / 维护前端；fixture Core，不启动真实编辑器 |
| 受控真实 Core | `tools/verify-local.ps1 -RealCore` | 创建同源码 guarded Agent，不调用真实 Provider |
| 聊天与文件执行 | `tools/verify-local.ps1 -RealCore -Chat` | 自编译 Agent、loopback 模拟模型与实际界面 |
| 编辑器与预览 | `tools/verify-local.ps1 -RealCore -Chat -Editor` | 仅自有 temp 工程、已装编辑器和已有许可 |

`-Editor` 不授权登录、激活、安装编辑器或修改用户工程。指定团结版本可传 `-TuanjieEditor <真实 Editor.exe>`；该参数需要 `-Editor` 且不能关闭浏览器。真实账号、Provider 与商业额度不属于自动验证。

```powershell
# 定向验证示例
node --test .\tests\contracts\frontend-request-contract.mjs
node .\tests\contracts\lsp-resource-contract.mjs --self-test
cargo test --manifest-path .\src\shell\Cargo.toml --offline --locked
node .\tests\e2e\project-panel-e2e.mjs
```

分类见 [测试导航](../tests/README.md)。各 driver 的 `--binary`、`--packaged`、`--agent`、`--editor` 参数以该文件为准，不假设全部 driver 支持相同参数。

## 构建与运行

```powershell
.\tools\build-local.ps1
.\app\启动GameCowork.bat
```

默认构建 Release，先核对 LSP、运行必要测试，再编译 Rust / Agent、写资源清单、装配并逐项核对 SHA。目标 app 正在运行时会保留准备好的包并停止替换，由用户关闭窗口后重新执行。

`-OutputDirectory` 可把候选包输出到统一 temp 中的指定目录；不作为第二个日常安装。`-SkipTests` 只跳过构建脚本的部分测试，不代表完成验收。资源来源与 guard 限制见 [装配说明](PACKAGING.md)。

## 本地状态与证据

验证通过专用 `GAMECOWORK_DATA_DIR` 隔离 Core、CLI、索引和工作区，不重写 HOME / USERPROFILE。测试工程、截图、日志、guard 包和构建暂存统一位于 `F:\AI\AgentMake\temp\GameCowork`。

只清理自己创建且已核对 PID 和目录的测试进程。仓库内不得放一次性日志或敏感导出。旧验收日志中的路径按 [迁移表](ARCHITECTURE.md#旧目录迁移表) 对应到当前源码，历史测试数字不代表本次验证。
