# GameCowork

面向 Unity / 团结引擎项目的 Windows 本地桌面工作台，将工作区管理、AI 编程、文件编辑、终端和编辑器预览整合在一个应用中。

项目参考 Tuanjie Cowork，从恢复的前端和业务代码逐步补齐自有宿主与编辑器集成。当前处于持续开发阶段；文件提取完整、源码验证通过和正式包验收是不同的状态。最新功能进展、已知限制和验证证据统一见 [RESTORE_STATUS.md](RESTORE_STATUS.md)。

## 开始使用

本机已有装配包时，在项目根目录运行：

```powershell
.\app\启动GameCowork.bat
```

`app/` 是本地生成的程序目录，不随 Git 提交。克隆仓库不会自动获得可运行安装包，构建还需要已准备的 Node runtime、离线依赖和工具链，详见 [开发指南](docs/DEVELOPMENT.md) 与 [装配说明](docs/PACKAGING.md)。

本地界面无需官方账号。编辑器许可和外部模型认证由对应服务处理；真实 Provider 需要用户自行配置。添加、关闭或移除工作区不会删除项目文件。

## 开发与验证

以下命令均在项目根目录、PowerShell 7 中执行：

```powershell
# 快速检查目录边界、模块路径和文档链接
node .\tools\check-layout.mjs

# 完整默认门禁：Rust、源码契约、隔离 HTTP 与 Chromium 界面
.\tools\verify-local.ps1

# 仅后端与契约验证；不能代替界面验收
.\tools\verify-local.ps1 -SkipBrowser

# 构建 Release 并更新本机 app（先关闭该 app 窗口）
.\tools\build-local.ps1
```

也可以使用 `npm run check:layout`、`npm run verify`、`npm run verify:backend` 和 `npm run build:local`。根目录的 `package.json` 仅提供命令入口，不需要先安装 npm 依赖。

真实 Core / Agent 的受控验证使用 `-RealCore -Chat`；真实编辑器验证再加 `-Editor`。这些门禁的依赖、隔离要求及适用范围见 [开发指南](docs/DEVELOPMENT.md#验证选择)。

## 目录导航

```text
GameCowork/
├── src/                     # 实际维护输入
│   ├── shell/               # Rust 桌面宿主与本地 HTTP/SSE/WebSocket
│   ├── frontend/            # 前端说明与 bundle/（两代界面代码）
│   ├── core/                # Node 业务核心，入口 binary/out/index.js
│   ├── agent/               # Agent CLI 维护入口与内置资源
│   ├── unity-insight/       # 本地代码、资产索引 worker
│   └── editor-bridge/       # 自有 Unity Editor-only UPM 包
├── vendor/csharp-lsp/        # 冻结的第三方运行时、许可证和哈希清单
├── tests/                   # contracts / integration / e2e / fixtures / support
├── tools/                   # 构建、验证、维护工具；research/ 保存历史脚本
├── docs/                    # 架构、开发、装配与编辑器使用说明
├── research/                # 历史 Tauri 骨架、Hub 分析、前端依赖推断
├── codelyreversebackup/      # 原版研究资料，保留现有路径供只读对照
├── original/                # 原始安装镜像（只读、不入库）
├── app/                     # 本机装配产物（不入库）
├── AGENTS.md                # 项目开发约束
└── RESTORE_STATUS.md         # 唯一活动功能状态与验收记录
```

`src/frontend/bundle/` 是当前维护的前端输入，仍包含恢复的 React / Monaco 等 bundle，尚不是完整的 TypeScript / Vite 源码工程。Core 和 Agent 也保留了恢复 bundle 的结构。目录整理没有改变这一限制，不能把历史依赖推断清单当作可复现的前端构建配置。

## 架构与维护边界

当前桌面宿主是 **wry / tao + WebView2**，由 axum 提供 loopback HTTP、SSE 和 WebSocket。前端通过宿主访问本地能力；宿主中继 Node Core 消息，并管理工作区、文件、终端、索引、C# LSP 和编辑器桥的生命周期。Agent CLI 由自有入口经 Bun 编译。

历史 Tauri 壳位于 `research/tauri-shell/`，不参与当前构建。`app/` 只通过构建脚本更新；前端两代共用逻辑、Core 的两份入口需要成套修改与验证。详细依赖方向和模块落点见 [架构说明](docs/ARCHITECTURE.md)。

| 数据 | 默认位置 |
| --- | --- |
| 工作区注册与界面偏好 | `%LOCALAPPDATA%\GameCowork` |
| Core / CLI 用户状态 | `%USERPROFILE%\.gamecowork` / `.gamecowork-cli` |
| 隔离工程、日志、截图、构建暂存 | `F:\AI\AgentMake\temp\GameCowork` |

编辑器桥仅在用户针对选定工程触发安装时修改该工程的依赖，并保留原字节备份。自动测试使用隔离数据和本地模拟服务，不调用真实 Provider 额度。远程、音频 / WebRTC、第三方媒体生成与安装更新等能力，以状态文档中各自的验收范围为准。

## 文档索引

| 文档 | 内容 |
| --- | --- |
| [开发指南](docs/DEVELOPMENT.md) | 环境、维护流程、验证与构建命令 |
| [架构说明](docs/ARCHITECTURE.md) | 分层、模块职责、依赖方向、旧路径迁移表 |
| [装配说明](docs/PACKAGING.md) | 正式资源来源、CLI guard、哈希与运行时边界 |
| [编辑器集成](docs/UNITY_INTEGRATION.md) | 连接、预览与串流入口 |
| [双引擎与多工程](docs/DUAL_ENGINE_MULTI_PROJECT.md) | 多来源与生命周期背景 |
| [测试导航](tests/README.md) | 门禁分类和 fixture 约束 |
| [工具导航](tools/README.md) | 日常工具与历史提取脚本 |
| [功能状态](RESTORE_STATUS.md) | 当前进展、限制与逐次验证证据 |
| [历史交接](docs/history/HANDOFF.md) / [初期提取记录](docs/history/EXTRACTION.md) | 历史背景，不作为当前运行指南 |
