# unity-insight Worker 内部管线 + CLI 进程参数树补全（T16，2026-10-02）

> 第七轮深挖。来源: `src/unity-insight/bundle/`（worker 版本 0.0.1 / protocol 4 / 源 commit 6e92ad2，
> 原版 cli/lib 同源维护副本）与 `src/agent/cli-main.beautified.js`（T14 遗留的 yargs 变量解码）。
> index-and-templates/insight-index-persistence.md 覆盖了持久化目录/代际/GC 与壳侧 serve 锁；
> 本轮补齐 **worker 内部的 SQLite 管线与查询语义**。全程只读。

## 1. Worker 分工与运行形态

| 文件 | 职责 |
|---|---|
| `unity-insight-cli.js`（941KB） | 主实现：NDJSON RPC 分发、编排、协议 4 |
| `indexBuildWorker.js`（579KB） | 全量/重建构建：发现→解析→抽取→落库→发布 |
| `indexSyncWorker.js`（637KB） | 增量同步（mtime 走查→scoped/full 写回） |
| `sqliteQueryWorker.js`（321KB） | 只读查询（符号/边/VFS 检索） |
| `yamlExtractWorker.js`（194KB） | Unity YAML 资产解析（guid/fileID/localIdentifier 抽取） |
| `shimmer-worker.js`（5KB） | worker 壳：createRequire/fileURL 前导（路径权限注入点） |
| `gamecowork-worker-paths.js` | 维护副本的解析器资产相对路径解析（原版走 node_modules） |

解析器: web-tree-sitter + tree-sitter-c_sharp.wasm（C# 语法）、ShaderLab 文本、Unity YAML；
**无模型、无远程 embedding**（README 明示）。

## 2. SQLite Schema（node:sqlite，STRICT 表，19 张）

| 表 | 关键列/语义 |
|---|---|
| `projects` | project_path UNIQUE（规范化根） |
| `files` | project_id、guid、kind、meta_file_id——索引 idx_files_guid / idx_files_kind_project |
| `assemblies` / `assembly_references` | 程序集与 asmdef 引用（解析失败进 diagnostics：category:"extract"、stage:"extract"） |
| `yaml_objects` / `yaml_references` | YAML 文档对象与引用；idx_yaml_objects_local_identifier、idx_yaml_objects_game_object_file_id |
| `cs_declarations` / `cs_mentions` / `semantic_bindings` | C# 声明、提及、语义绑定（mention→symbol 消歧） |
| `symbols` / `symbol_edges` | 符号表与有向边（from_symbol_id/to…；边缘的文件归属 ON DELETE SET NULL） |
| `assets` | 资产表 |
| `vfs_entries` / `vfs_edges` | **虚拟文件系统物化**：vfs_path、entryKind（`source_prefab_link`/`prefab_overrides` 等）、
  `materialization_generation`（代次物化，七个 idx_vfs_entries_* 索引含 logical_key 唯一键、generation_id） |
| `index_diagnostics` / `rebuild_summary` | 诊断与重建摘要（发现文件数/诊断数） |

全部外键带 CASCADE（或 SET NULL），`STRICT` 模式；共 42 个索引。

## 3. 构建与同步语义

- **Build**: 发现→（asmdef/资产/YAML/C#）抽取→落库→`publish`（发布到代际库路径，壳侧 index.current 指针切换，
  见 insight-index-persistence.md）。诊断四元组 `{severity, category, stage, filePath, message}` 全程收集。
- **Sync**: 三模式 `full` / `scoped` / `incremental`；结果携带 `publishedIndexPath`、`schemaVersion`（当前 **11**）、
  `completedStages[]`、`summary.discoveredFileCount`、`reconcile`（对账计数）、`synced`/`skipReason`——
  **skip 时仍回执上一次 publishedIndexPath**（壳侧 VFS 缓存据此判断代次，RESTORE_STATUS 2026-10-01 已接线）。
- VFS 批量写回按 `mode` 分路：full 直接整批；scoped/incremental 先 `SELECT id FROM vfs_entries WHERE id IN (...)` 差异化；
  prefab 链接条目（entryKind 为 source_prefab_link/prefab_overrides）维护 `vfsPath→sourceEntityId` 映射。

## 4. 查询语义（sqliteQueryWorker）

- **边类型五种**: `calls`、`binds_to`、`depends_on`、`instance_of`、`refs`；查询按 `direction: in|out` 生成 SQL
  （`SELECT edge.from_entry_id, … requested_target`），边查询同时覆盖 symbol_edges 与 vfs_edges 两域。
- YAML 引用三元组: `{sourceLocalIdentifier, fieldPath, targetGuid, targetFileId}`（guid/fileID/localIdentifierInFile）。
- **Prefab 位标志**（检测 prefab 变体/覆盖信息量的 bitmask）: gameObjectFileId=1、parentTransformLocalId=2、
  childTransformLocalIds=4、prefabInstanceLocalId=8、prefabTransformParentLocalId=16、prefabRootName=32…（2 的幂连续编码）。
- 服务面即壳 `/api/tauri/unity-insight/vfs-*` 五操作与 `index-status/ensure-index` 的后端（T12 §1.5）。

## 5. CLI 进程参数树补全（T14 遗留的 yargs 变量解码）

T14 的六变量链解码结果即 **`gamecowork mcp` 子命令组**: `add <name> <commandOrUrl> [args...]` /
`remove <name>` / `list` / `disable <name> [tool]` / `enable <name> [tool]` / `auth [name]`（OAuth 认证入口）。
全量普查（yargs `command:"…", describe:"…"` 对象形态，31 组去重）：

| 命令组 | 子命令与要点 |
|---|---|
| `mcp` | 上六条；usage 字面 `gamecowork mcp …` |
| `extensions` | `install <source> [--auto-update] [--pre-release] [--scope]`（**git URL / .zip URL / 本地路径三源**）、`uninstall <name>`、`update [<name>] [--all]`、`link <path>`（本地开发链接）、`new <path> [template]`（**样板创建扩展**）、`config <extension> [setting]`（**Gemini CLI 兼容**配置） |
| `serve` | `serve unity-mcp --unity-project-path …`（**Unity MCP 服务器**，HTTP streaming 或 stdio——core unity/* 工具对外暴露成 MCP）、`serve web-ui`（**Web UI**：把 ACP 代理为 WebSocket、spawn agent 进程——`src/agent/resources/web-ui` 即此前端）、`serve control-plane`（**本地控制面**管理多个 web-ui 端点） |
| `skills` / `commands` / `agents` | 管理组（commands 的 delete 带 `--path` 删 TOML；agents 的 `list [--in-agents-dir]` 已由 T13 核实） |
| `swarm` | `create`（**建团队并自任 leader**）/ `join` / `status`（roster 分页）/ `send`（**邮箱消息**）/ `stop`（**持久停止请求**）/ `worker <action>`（spawn\|resume\|stop\|status，经安装的 worker controller）/ `spawn` / `resume`（复活停止/陈旧 worker 任期） |
| config/auth/update | T8/T14 已录（update 三开关 --auto-update --pre-release --consent） |

**新事实**: `serve web-ui`/`serve control-plane` 说明原版 CLI 自带浏览器 UI 服务器族（web-ui 资源在
`src/agent/resources/web-ui/dist`）；`serve unity-mcp` 把 Unity 工具直接暴露为 MCP server（与 T7 的
mcpOauthStorage 同面）；Swarm 的 worker 生命周期三态（spawn/resume/stop+status）补全 T14 的邮箱协议。

## 6. 复用提示

- worker 的 schema/边类型/prefab 位标志是 GameCowork 自研索引 worker 的直接参考（own unity-insight 已同源还原，
  维护时**不要越过 bundle 直接改产物**——见 src/unity-insight/README.md 边界）。
- `serve unity-mcp` 是"第三方工具生态"的原生入口形态：GameCowork 若做 MCP server 暴露，照此把桥工具
  经 HTTP streaming/stdio 暴露即可，不必重设计。
- web-ui/control-plane 证明原版已有"浏览器版客户端"骨架——GameCowork 的桌面壳之外若要网页端，这是现成协议参考
  （ACP→WebSocket 代理）。
