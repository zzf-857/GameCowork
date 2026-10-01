# GameCowork 架构与目录职责

本文记录当前代码组织和依赖边界。功能状态只写入 [RESTORE_STATUS.md](../RESTORE_STATUS.md)，环境与命令见 [开发指南](DEVELOPMENT.md)。

## 运行分层

```text
前端 bundle（桌面 / 工作区 GUI / 画面接收页）
                     │ HTTP / SSE / WebSocket
                     ▼
Rust 宿主（wry + tao + axum）
  ├── 工作区、文件、Git、终端与进程生命周期
  ├── stdio 消息中继 ── Node Core ── 自编译 Agent CLI
  ├── 独立索引 worker（SQLite / parser）
  ├── 冻结 C# LSP（显式启用）
  └── loopback 编辑器桥 ── Unity / 团结 Editor API
```

Core 保留会话、模型与工具编排逻辑；宿主负责桌面、本地系统能力与子进程所有权。Agent 的部分编辑器工具还经工程专属 loopback TCP 访问桥，不能只验证界面到宿主的一条链就宣称 Agent 工具完成。

## 维护输入

| 目录 | 主要入口 | 职责与约束 |
| --- | --- | --- |
| `src/shell/` | `src/main.rs` | Rust 装配、路由、Core 中继和窗口事件；模块测试与实现同处 |
| `src/frontend/` | `bundle/index.html`、`bundle/gui.html` | 当前与上一代界面；共用行为需同步修复 |
| `src/core/` | `binary/out/index.js` 与 `index.beautified.js` | 实际 Core 和对应可读入口；两份逻辑成套维护 |
| `src/agent/` | `cli-main.beautified.js`、`resources/` | 恢复的 CJS 工厂和内置资源；经 tools 恢复入口后由 Bun 编译 |
| `src/unity-insight/` | `bundle/gamecowork-worker-entry.mjs` | 本地索引、查询、watch 与权限适配；资源清单保持完整 |
| `src/editor-bridge/` | `Editor/`、`package.json` | 自有 Editor-only UPM 包，保留 Unity `.meta` 身份 |
| `vendor/csharp-lsp/` | `runtime/`、dependency ledger | 第三方冻结依赖，不在此修改官方实现；完整性由 SHA 验证 |

Core 的 `binary/out/`、Agent 的 `carved/` 和前端的带哈希 chunk 仍保留恢复结构，目的是维持模块定位、相对加载和来源证据。本次没有将这些 bundle 宣称为已模块化的原始工程。

## Rust 模块落点

所有模块位于 `src/shell/src/`。新增逻辑先进入所属模块，入口只负责路由接线与服务装配。

| 领域 | 模块 |
| --- | --- |
| 消息协议与进程所有权 | `transport.rs`、`process_lifetime.rs` |
| 工作区与本地编辑 | `workspaces.rs`、`files.rs`、`mutations.rs`、`file_events.rs` |
| 开发工具 | `git.rs`、`terminals.rs`、`lsp.rs`、`insight.rs` |
| 编辑器发现、模板与桥 | `editor_installations.rs`、`project_templates.rs`、`editor_bridge.rs` |
| 串流布局与原生窗口 | `stream_layout.rs`、`native_window.rs`、`native_window.js` |
| HTTP / WebView 装配 | `main.rs` |

`main.rs` 仍包含较多路由和 Core 适配逻辑，前端 / Core 仍有大 bundle。这些是后续按功能拆分的维护成本；本轮只调整目录与加载路径，不在路径迁移中改变协议或重写业务。

## 依赖与产物边界

- `tools/` 从 `src/` 与 `vendor/` 读取维护输入，在统一 temp 内准备资源，再装配到 `app/`。
- `src/` 不依赖 `tests/`、`research/` 或原软件目录提供生产行为；测试 guard 只进入隔离测试 Agent。
- 正式包使用自身 `app/frontend`、`app/core`、`app/cli`、`app/unity-insight`、`app/lsp-csharp` 与 `app/editor-bridge`；开发 fallback 不得代替包内资源。
- `research/`、`tools/research/` 与 `docs/history/` 保存历史分析，不进入默认构建和门禁。
- `codelyreversebackup/` 与 `original/` 保持原路径，只读对照。研究资料新增不等于运行功能完成。
- `tests/fixtures/` 提供模拟服务、guard 与自有编辑器工程代码，`tests/support/` 提供测试辅助函数；它们都不是产品模块。

运行数据与临时产物的位置见 [README](../README.md#架构与维护边界)。不能把日志、截图、测试工程、真实凭据或用户数据写入源码目录。

## 旧目录迁移表

2026-10-01 的目录整理保留了所有已跟踪输入。旧验收日志与历史文档正文中的路径表示当时布局；新命令使用下表右侧路径。

| 旧位置 | 当前位置 |
| --- | --- |
| `restored/shell/` | `src/shell/` |
| `restored/frontend/dist-beautified/` | `src/frontend/bundle/` |
| `restored/frontend/package.json`（推断清单） | `research/frontend-package.reference.json` |
| `restored/core-gamecowork-binary/` | `src/core/` |
| `restored/cli-gamecowork/` | `src/agent/` |
| `restored/cli-unity-insight/` | `src/unity-insight/` |
| `restored/editor-bridge/` | `src/editor-bridge/` |
| `restored/lsp-csharp/` | `vendor/csharp-lsp/` |
| `restored/src-tauri/`、`restored/hub/` | `research/tauri-shell/`、`research/hub/` |
| `restored/PACKAGING.md`、`UNITY_INTEGRATION.md`、`DUAL_ENGINE_MULTI_PROJECT.md` | `docs/` 下同名文档 |
| 根目录 `HANDOFF.md` | `docs/history/HANDOFF.md` |
| 平铺的 `tests/*` | 按 [测试导航](../tests/README.md) 分类，文件名保留 |
| 历史探针与提取脚本 `tools/*` | `tools/research/`，见 [工具导航](../tools/README.md) |

不保留第二份可编辑源码或旧路径软链接。发现旧外部脚本时按迁移表修正，不重新创建 `restored/`。开发期构建缓存仍在 `src/shell/target/` 并被 Git 忽略。
