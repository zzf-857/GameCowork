# 项目索引持久化与启动加载（问题 1 排查）

> 日期: 2026-10-01 · 来源: restored/cli-unity-insight worker 源码、restored/shell/src/{insight,editor_installations}.rs、Unity Hub asar 逆向、本机磁盘/日志实证。
> 结论先行: **worker 的持久化设计是完整的、支持暖启动；本机 `%LOCALAPPDATA%\GameCowork\insight` 为空说明索引从未持久化落地**；启动慢的主嫌疑是①编辑器列表每次启动由 Core 重扫磁盘（无缓存）②暖启动的增量同步全量 mtime 走查 ③（若索引确在重建）结果写到了别处或构建失败。

## 1. 索引的长期保存设计（worker 侧，已还原）

目录解析（`gamecowork-worker-paths.js`）:
- 未设 `UNITY_INSIGHT_HOME`（legacy）: 索引放**工程内** `{project}\.gamecowork-cli\UnityInsight\`。
- 设了 `UNITY_INSIGHT_HOME`（壳会设）: `{UNITY_INSIGHT_HOME}\projects\{sha256(canonical 工程路径)}\`——路径规范化（realpath + `\`→`/` + win32 小写）后哈希，**内容寻址防串工程**；`GAMECOWORK_INSIGHT_INDEX_DIR` 可显式钉死，但必须在 home 内（越界抛错）。

目录内文件（indexBuildWorker.js 常量）:
| 文件 | 作用 |
|---|---|
| `index.db` | 当前活跃库（live） |
| `index.db.tmp` | 构建目标（构建期间） |
| **`index.current`** | 指针文件，内容=当前代际文件名（如 `index.{uuid}.db`） |
| `index.{uuid}.db` | 历史代际库 |
| `.index.current.{uuid}.tmp` | 指针原子写中转 |
| `.index.lock` / `.index.write.lock.db` / `.serve.lock` | 构建/写/serve 三级互斥 |

**发布/切换流程**（`ud()`）: 构建写 `index.db.tmp` → rename 成新代际 `index.{uuid}.db`（拒绝覆盖已有代际）→ 删旧 `index.db`(-wal/-shm) → 指针写 `.index.current.{uuid}.tmp`（fsync）→ rename 覆盖 `index.current`。**查询在 `index.current` 选出已发布库之前不可用**。
**代际 GC**（`yd()`）: 清理指针未选中的 `index.*.db`(-wal/-shm) 孤儿代际。
**增量同步**: 暖启动走 `index.sync`（indexSyncWorker，全量文件发现+mtime 对比，`UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY` 可调并发），不重解析。

## 2. 壳侧短路逻辑（restored/shell/src/insight.rs）

- `InsightService::new(paths.data.join("insight"), ...)`；生产 `paths.data = %LOCALAPPDATA%\GameCowork`（`GAMECOWORK_DATA_DIR` 未设时，main.rs:112）。
- `status()`: worker 不在内存 **且** `cache_dir/index.current` 与 `index.db` 都不存在 → 才触发 ensure（冷构建）；**否则直接连 serve/返回状态**——设计上暖启动不重建。
- 启动链: `ensure-index` → worker RPC `index.ensure` → worker 侧 `indexReady ? index.sync : index.build`（unity-insight-cli.js 28805）。
- serve 进程: 每次 `node serve --stdio --project {root}` 按工程新起（`UNITY_INSIGHT_HOME`/`GAMECOWORK_INSIGHT_INDEX_DIR` 注入子进程）。

## 3. 本机实证（2026-10-01，只读检查）

- `%LOCALAPPDATA%\GameCowork\insight` **存在但为空**（0 字节，无 `preferences.json`、无 `projects/`、无任何 `index.*`）→ **生产环境从未成功持久化过任何索引**（哪怕启用过一次，至少应有 preferences.json）。
- `app/shell-out.log` 只有 `[stdin→core] unity/getHubProjectsAndEditors` 等调用痕迹，无 insight 索引进度日志。
- 推论: 用户看到的"每次启动重新加载项目索引"，要么是①**编辑器列表重扫**（见 §5，每次启动 Core 扫描全部安装根+逐个读 modules.json，机器上装了大量 Unity/团结版本时很慢），要么是②insight 在界面上处于启用态但写盘失败/被指向了临时目录（需在 UI 触发一次 set-enabled 后回看该目录是否出现 preferences.json 来二分定位），而**不是** worker 设计缺陷——设计本身支持跨启动持久化。

## 4. 对照：Unity Hub 怎么避免"启动重扫"

从 asar 逆向（build/main/DiskValidatorStrategy-Baf6OtjU.js）:
- **编辑器列表缓存**: `editorManager.editorList` 常驻内存 + 持久于 Hub 配置（editors-v2 体系）；变更以事件 `INSTALL_LIST_EVENTS.AVAILABLE_EDITORS_CHANGED` 推送（`editors.changed` 在团结 Hub 同名存在）。
- **模板缓存跟随编辑器事件失效**: `Templates.init()` 订阅 AVAILABLE_EDITORS_CHANGED → `_filterStaleTemplatesCache`；`UnityTemplateCache.getLocalTemplatesByEditor(version)` memoize 每版本扫描结果——**扫描只在编辑器列表变化后重做**。
- 团结 Hub（tuanjie.exe）同理: `installedEditorList` 持久在 Hub 配置（T3 已还原），壳经 `editors.changed` 获推送。

## 5. 可行的改进方向（供实施参考，本轮未改任何代码）

1. **编辑器列表缓存**: 给 `editor_installations.rs`/Core 扫描加持久快照（存 `paths.data/editor-installations.json`，含每个编辑器 modules.json 的 mtime），启动先回缓存、后台重扫后 diff 推送——对齐原版 `editors.changed` 模型。
2. **索引暖启动验证**: 先在 UI 里启用一次 insight，确认 `%LOCALAPPDATA%\GameCowork\insight\preferences.json` 与 `projects/{hash}/index.current` 出现；若缺失则查 serve 子进程的 stderr（worker 报错会进壳日志）。`UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY` 可缓解大工程同步走查耗时。
3. **serve 复用**: 多工程同时打开时每工程一个 serve；如启动耗时集中在 serve 起库，可参考原版 `.serve.lock` + Restart Manager 回收模型（shell-logic/unity-shell-side.md §4）做跨启动的进程复用判断。
