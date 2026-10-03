# 测试导航

统一入口是项目根目录的 `tools/verify-local.ps1`。Rust 单元测试保留在 `src/shell/src/`；本目录承载源码契约、跨进程与用户流程验证。

| 目录 | 内容 | 运行方式 |
| --- | --- | --- |
| `contracts/` | 实际函数、双前端行为、资源与协议契约 | 按文件执行 `node` 或 `node --test`；以统一门禁为准 |
| `integration/` | HTTP、Core / CLI、worker、生命周期与真实 Editor smoke | 按需执行；部分需要 guarded Agent 或真实编辑器 |
| `e2e/` | 项目、聊天、文件、Git、LSP、账号与编辑器流程；部分 driver 可选 Chromium | 使用真实维护界面或宿主/Core 协议链与隔离外部服务，按参数区分验收范围 |
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

账号契约分为 `contracts/codely-account-broker.test.mjs`（设备授权、密封存储、刷新、退出与代次隔离）、`contracts/codely-account-wiring.test.mjs`（两份 Core、vault 和原登录 RPC 接线）、`contracts/codely-account-official-surface.test.mjs`（Quick/Canvas 官方身份、订阅/额度与令牌边界）、`contracts/codely-account-frontend.test.mjs`（两代原登录函数的请求时限、网络失败和等待状态），以及 `contracts/codely-account-timeout.test.mjs`（真实回环半截响应体、总请求时限、独立到期、自动重试及取消清理）。这些是隔离测试；本人真实登录的验收证据统一见状态文档。

`e2e/codely-account-login-e2e.mjs` 默认启动真实 Rust 宿主和 Core，以 loopback fixture 验证授权、组织/订阅/额度读取、Windows DPAPI 保存与重启恢复、退出后回到本地身份；默认不启动 Chromium。追加 `--browser` 验证原登录弹窗与界面交互，`--browser --images` 增加原 Quick 官方图片控件、报价、任务、历史和下载，追加 `--previous` 选择上一代；`--packaged` 使用当前 `app/`，候选包用 `--binary` / `--core` / `--frontend` / `--runtime` 明确指定，没有 `--app-root` 参数。两代浏览器与协议验证结果分别记录，不能相互替代。网络 guard 只允许 loopback，测试不代用户进行真实官方登录或消费额度。本人真实登录及 Quick 付费读取已完成的证据、当前源码与包内范围统一见 [当前状态](../RESTORE_STATUS.md)；Canvas 生成 schema 仍待接入。

官方普通图片契约包括 `contracts/codely-official-generator-broker.test.mjs`（私有会话、真实请求字段、完整响应体超时、取消、POST 不重发及推理凭据绑定）、`contracts/codely-official-assets.test.mjs`（账号绑定任务、已知 ID 恢复、媒体 SHA、缓存/下载、最多 16 张官方参考图与普通 Provider 的独立上限）、`contracts/codely-official-generator-api.test.mjs`（原 Frontier 构建函数、报价、提交、查询与真实媒体），以及 `contracts/codely-official-generator-validation.test.mjs`（未知状态、最终上传 Buffer、全部引用预检/去重和失败回收）。这些只验证 `frontier_flare` / `frontier_sunburst` 普通图片的接线，分层和其它原模型不能据此统称支持。

`contracts/codely-official-programming.test.cjs` 验证显式启用真实模型目录、Core 内存 Key、Agent 的工作区/会话/模型能力、三种推理协议与最终帧、账号/组织撤销及 CPA 设置保留。`e2e/codely-official-programming-e2e.mjs --agent <同源码 guarded Agent EXE>` 从两代原模型菜单点击“启用 Codely 官方 · Pro 模型”，选择官方模型并通过实际 Agent 验证流式响应、工具、取消和 CPA ↔ 官方切换；`--previous` 选择上一代，`--binary` 指定候选宿主，`--packaged --app-root <候选包>` 读取包内资源。该 driver 始终使用同源码 guarded Agent、隔离账号/目录/推理 fixture 和自有 temp 工程，不证明真实官方推理或额度消费。

```powershell
node --test tests/contracts/codely-official-generator-broker.test.mjs tests/contracts/codely-official-assets.test.mjs tests/contracts/codely-official-generator-api.test.mjs tests/contracts/codely-official-generator-validation.test.mjs tests/contracts/codely-official-programming.test.cjs
node tests/e2e/codely-account-login-e2e.mjs --browser --images
node tests/e2e/codely-account-login-e2e.mjs --browser --images --previous
node tests/e2e/codely-official-programming-e2e.mjs --agent <同源码 guarded Agent EXE>
node tests/e2e/codely-official-programming-e2e.mjs --previous --agent <同源码 guarded Agent EXE>
```

默认 driver 还覆盖聊天右栏的原 AI 画布入口及双文档编辑租约；`--flexible-layout` 为另行测试的原可选布局，不等同默认窗口。`--cpa-only` 使用原控件选择明确的 CPA descriptor，再通过真实 Core 向隔离图片接口提交、解码、恢复历史草稿并重启；两代均进入统一门禁。`codely-local-models.test.mjs`、`codely-cpa-generation.test.mjs` 与 `codely-sidebar-canvas-contract.mjs` 分别覆盖描述符/能力、Provider绑定/任务与LAN边界、默认右栏身份协议。自动脚本不读取用户真实CPA凭据，不调用真实额度；手动实测另见状态文档。

底层通用服务仍由 `integration/asset-generation-service-smoke.mjs` 与 `asset-generation-{auth,adapter,lifecycle,idempotency,large-output,inputs,policy,owner}.test.*` 验证。旧 `e2e/asset-generation-e2e.mjs` 和 `frontend-asset-generation-contract.mjs` 对应此前自研面板，保留历史用途，已不作为现行原界面的默认门禁。

`codely-assets-e2e.mjs --download-only [--previous]` 专门点击原 Quick、History、主 Canvas 与默认右栏 Canvas 的下载按钮，检查实际文件 SHA、成功提示、取消、重名、范围拒绝及冷重启。只在隔离 headless/test-mode 下用 `GAMECOWORK_TEST_DOWNLOAD_CHOICES` 选择自有 temp 目标，实际原生保存对话框另行验收；两代专项进入 `-RealCore` / `-Chat` 浏览器门禁。`contracts/codely-download-contract.mjs` 核对保存回执与无浏览器兜底，Rust 测试验证媒体身份、文件保护和独立对话框任务生命周期。

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
