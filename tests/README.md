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

Unity Hub 本地接线验证使用 `integration/hub-refresh.mjs`、两代 `e2e/hub-project-status-e2e.mjs` 与 `e2e/editor-licensing-e2e.mjs`，检查缓存刷新、只读项目状态、许可作用域和明确拒绝。它们以真实 Rust / Chromium 加隔离 Core fixture 验证，不证明真实激活或 Editor 启动。`project-template-details-e2e.mjs --warning-fixture` 保留真实本地模板回执，仅验证坏包诊断的呈现；Rust `project_templates` 单测验证真实损坏 tgz fixture 的隔离及实际创建。

安装缓存使用 `integration/editor-installations-cache.mjs` 验证真实 HTTP、持久快照、重启、发现屏障和扫描分离；加 `--browser` / `--previous` 进入两代真实 GUI。相关契约是 `core-hub-discovery.test.cjs`、`frontend-editor-installations-cache.test.mjs` 与 `frontend-project-recency.test.mjs`。项目改动排序包含磁盘文件元数据，缓存可见不能代替扫描完成，fixture 不执行真实 Editor。

当前资产入口使用 `e2e/codely-assets-e2e.mjs --agent <同源码 guarded Agent EXE>`，真实 Rust / Core / 两层 GUI iframe 加载保留的原 Quick、History 和 ReactFlow 客户端。加 `--previous` 验证上一代，加 `--packaged --app-root <候选包>` 验证装配资源；`--inspect` 仅做结构检查，不能作为完整交互门禁。实际覆盖范围与通过记录见 [当前状态](../RESTORE_STATUS.md)，原模型未配置的错误断言不能算作生成成功。loopback Provider只准备自有历史媒体，不调用原平台或真实额度。

`codely-generator-local-identity.test.mjs`、`codely-canvas-source-contract.mjs` 核对原资源、组件、Host与身份边界；`codely-generator-api.test.mjs`、`codely-generator-upload.test.mjs`、`codely-media-rebase.test.mjs` 验证原接口形状、本地实际文件与重启地址解析。构建前同时执行 `tools/import-codely-generator.mjs --check` 和 `tools/verify-codely-canvas-source.mjs`；后者静态解析依赖，不执行原应用代码，nonliteral动态路径仍须实际运行验收。

默认 driver 还覆盖聊天右栏的原 AI 画布入口及双文档编辑租约；`--flexible-layout` 为另行测试的原可选布局，不等同默认窗口。`--cpa-only` 使用原控件选择明确的 CPA descriptor，再通过真实 Core 向隔离图片接口提交、解码、恢复历史草稿并重启；两代均进入统一门禁。`codely-local-models.test.mjs`、`codely-cpa-generation.test.mjs` 与 `codely-sidebar-canvas-contract.mjs` 分别覆盖描述符/能力、Provider绑定/任务与LAN边界、默认右栏身份协议。自动脚本不读取用户真实CPA凭据，不调用真实额度；手动实测另见状态文档。

底层通用服务仍由 `integration/asset-generation-service-smoke.mjs` 与 `asset-generation-{auth,adapter,lifecycle,idempotency,large-output,inputs,policy,owner}.test.*` 验证。旧 `e2e/asset-generation-e2e.mjs` 和 `frontend-asset-generation-contract.mjs` 对应此前自研面板，保留历史用途，已不作为现行原界面的默认门禁。

启动链路使用 `contracts/frontend-startup-messenger-contract.mjs` 验证两代 Native 的共享 Redux client / store / persistor，`contracts/core-command-bootstrap.test.cjs` 验证真实 Core 函数的初始化通知缓存回放、pending 刷新、失败与代次隔离。`integration/core-command-bootstrap.mjs --package <同源码 guarded Agent 目录>` 进入 `verify-local -RealCore`，跨真实 Rust / Core / 编译 Agent 验证同一链路，使用可释放的测试屏障而不请求模型生成；`--packaged --app-root <候选包目录>` 选择包内资源。`integration/native-window-session.mjs` 仅启动并记录自有 Wry 窗口生命周期，实际 Native 手势和界面仍需单独观察，不把 launcher 本身当作 UI 通过。

Console 使用 `contracts/editor-console-contract.mjs` 验证真实 Agent 消费者和 get / clear-all 契约。`integration/editor-console-smoke.mjs --package <同源码 guarded Agent 目录>` 进入 `verify-local -Editor`，使用自有真实 Editor 验证当前原生 Console 视图、完整性字段、读取偏好不变、批准 / 拒绝 / 取消清空及断连失败；`--app <候选包目录>` 选择包内桥和 Agent 资源。它不证明读取隐藏日志、时间增量读取、修改 Collapse 或选择性清空。

Editor 功能增量的四个源码 driver 也已进入 `verify-local -Editor`：

| Driver | 实际范围与参数 |
| --- | --- |
| `integration/editor-context-smoke.mjs --package <同源码 guarded Agent 目录> --extra-queries` | 六项原生上下文读取；实际模型发出的资产 / 包元数据查询，拒绝用其它 selector 遮蔽写动作 |
| `integration/editor-asset-package-smoke.mjs --graphics` | 无模型的 AssetDatabase 查询、已加载注册包、原生异步预览和真实 PNG；支持 `--bridge`，无图形默认模式明确报告预览不可用 |
| `integration/editor-scene-mutations-smoke.mjs` | 自有实际 Editor / TCP，create / modify、真实 Undo、已加载原文件 save、nonce 与工程 / 文件身份拒绝 |
| `integration/editor-scene-mutations-agent-smoke.mjs --package <同源码 guarded Agent 目录>` | 实际工具发出 / 结果 ID、批准 / 拒绝、提交前取消和提交后效果提示、modify → save 串行顺序 |

对应默认契约为 `cli-unity-operations.test.mjs`、`editor-context-contract.mjs`、`editor-context-implementation-contract.mjs`、`editor-asset-package-contract.mjs` 和 `editor-scene-mutation-contract.mjs`，均位于 `contracts/`。上述四个 driver 没有通用包内参数；它们的源码结果不证明新的装配包、团结运行时、资产写入或包安装 / 移除。场景 save 的磁盘效果不能由取消或 Undo 自动回滚，路径校验也不提供原子 TOCTOU 保证。

新增测试归入对应目录，通过 `import.meta.url` / `__dirname` 解析项目根。通用 fixture 放入 `fixtures/`，辅助逻辑放入 `support/`。截图、日志、项目、SQLite、编译产物和浏览器状态只写入统一 `temp/GameCowork`。

旧文件名全部保留。更多说明见 [开发指南](../docs/DEVELOPMENT.md#验证选择)，真实编辑器约束见 [桥规范](../src/editor-bridge/AGENTS.md)。
