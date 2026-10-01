# 测试导航

统一入口是项目根目录的 `tools/verify-local.ps1`。Rust 单元测试保留在 `src/shell/src/`；本目录承载源码契约、跨进程与用户流程验证。

| 目录 | 内容 | 运行方式 |
| --- | --- | --- |
| `contracts/` | 实际函数、双前端行为、资源与协议契约 | 按文件执行 `node` 或 `node --test`；以统一门禁为准 |
| `integration/` | HTTP、Core / CLI、worker、生命周期与真实 Editor smoke | 按需执行；部分需要 guarded Agent 或真实编辑器 |
| `e2e/` | Chromium 下的项目、聊天、文件、Git、LSP 与编辑器流程 | 使用真实维护界面和隔离外部服务 |
| `fixtures/` | 模拟 Core / Provider / MCP、guard、C# / Rust 测试程序 | 由 driver 启动或复制，不是独立产品入口 |
| `support/` | 编辑器身份准备、桥 RPC 与辅助函数 | 由 driver 导入 |

所有命令在项目根目录执行，例如：

```powershell
node tests/contracts/frontend-request-contract.mjs
node tests/integration/shell-http.mjs
node tests/e2e/project-panel-e2e.mjs
```

不要将 `fixtures/` 当作测试全量执行，也不要无区别执行所有 integration / e2e 文件：真实 Editor 和 Agent 场景有专门的准备及隔离条件。默认门禁不启动真实编辑器、不访问真实 Provider。

新增测试归入对应目录，通过 `import.meta.url` / `__dirname` 解析项目根。通用 fixture 放入 `fixtures/`，辅助逻辑放入 `support/`。截图、日志、项目、SQLite、编译产物和浏览器状态只写入统一 `temp/GameCowork`。

旧文件名全部保留。更多说明见 [开发指南](../docs/DEVELOPMENT.md#验证选择)，真实编辑器约束见 [桥规范](../src/editor-bridge/AGENTS.md)。
