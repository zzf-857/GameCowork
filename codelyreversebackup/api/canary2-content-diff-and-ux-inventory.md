# canary.2 core 内容级差分 + 前端逐功能 UX 清单（T17，2026-10-02）

> **2026-10-02 实际原包复核纠正**：下文 §1.1 的新侧输入是维护副本，含 GameCowork 自研改动。实际原版 Core EXE `C7A998C9…` 解包入口 SHA `B4B146C5…` 中四条 `custom/*` 和三条 `GameCoworkHome` 名称均不存在，三个 `CodelyHome` 名称仍存在。因此“canary.2 新增七条功能”的归因撤销；该比较只能描述旧原包与维护副本的差异。其它段落不因这条纠正自动获得原包版本证明。真实生成 / 画布仍需对照原包远端依赖，详见 [来源审计](asset-generation-and-canvas-source-audit.md)。保留原正文以说明当时输入和错误来源。

> 第八轮深挖（收尾轮）。来源: 旧版 core `original/Tuanjie Cowork/app/resource/core/bin/win32-x64/
> codely-binary-old-1790684865080.exe` 经 `tools/research/pkg-unpack.mjs` 解包（载荷 15,787,839 B，
> 161 文件，输出在统一 temp `GameCowork/core-old-unpack/`）对照维护副本 `src/core/`；前端
> `src/frontend/bundle/assets/` 资源表与 `codelyreversebackup/frontend/zh-strings.md`（4,373 条）。
> 全程只读、未运行原版 EXE。T4 的"载荷翻倍"结论在本轮得到内容级解释。

## 1. canary.2 core 内容级差分（旧 15.8MB → 新 32.6MB 的真相）

### 1.1 主 bundle 几乎未变

- `out/index.js`: 14,347,101 → 14,365,238 字符（+18KB）。
- **全部 `"域/方法"` 字符串差分恰为 7 条**:

| 变化 | 字符串 | 语义 |
|---|---|---|
| ＋4 | `custom/create`、`custom/read`、`custom/update`、`custom/rename` | **新增统一自定义定义 CRUD 门面**：经 `./gamecowork-custom.js` 的 `validateDefinition/createCapability/updateCapability/renameDefinition/readCapability` 操作 `kind = commands \| agents \| skills` 三类定义；每次写操作后按 kind 自动 `refreshCommandsForAllSessions / refreshAgentsForAllSessions / refreshSkillsForAllSessions`。即 T13 §3 的 commands/subagents 三套代理之外，canary.2 又补了一层通用 CRUD（配合新增载荷文件 `out/gamecowork-custom.js`，15,561 B） |
| ＋3 / −3 | `settings/applyGameCoworkHomeChange`、`settings/getGameCoworkHome`、`settings/prepareGameCoworkHomeChange`（替换 `*CodelyHome*`） | **GameCoworkHome 三步迁移**（T8 已录协议）在 canary.2 的改名落点 |

- tree-sitter 查询资产: 旧载荷 36 文件 vs 维护副本 36 文件，**逐一相同**。

### 1.2 "载荷翻倍"是打包膨胀，不是功能

新载荷 sqlite3 目录（`core/core/node_modules/sqlite3/`）解包后 **71.78MB**（旧 7.76MB，Δ≈64MB 压缩前）:
包含完整构建中间物——`sqlite3.c`（8.9MB）、`shell.c`（907KB）、整个 sqlite-autoconf-3440200 源码树、
`.obj/.pdb/.ipdb/.tlog/.lastbuildstate` 等 MSVC 中间产物。**结论: canary.2 core 的功能增量就是
`custom/*` 门面 + home 改名；15.8→32.6MB 是 sqlite3 构建树被打进 pkg 快照所致**，不对应任何新业务域
（与 T4 的字符串级判断一致并给出量化根因）。

### 1.3 复用提示

- `custom/*` 门面 + `gamecowork-custom.js` 正是 GameCowork 维护副本已有的本地自定义管理实现来源；
  own 前端"本地自定义管理"（RESTORE_STATUS 第四阶段）走的就是这套，行为契约以本文档 §1.1 为准。
- 判定 core 版本差异时应直接差分 `out/index.js` 字符串集，包体积不可作功能依据（本轮再次实证）。

## 2. 前端逐功能 UX 清单（4,373 条中文文案的归属）

### 2.1 i18n 面结构

- `t()` 显式调用 24 个命名空间 466 处（两代主 chunk 合计）: `tjhub` 50、`userInput` 40、`toast` 34、
  `settings` 22、`history` 20、`common` 18、`askUser` 18、`managePanel` 16、`generation` 16、`sidebar` 12、
  `mobileApp` 10、`remoteFolder` 10、`exitPlanMode` 10、`chat` 8、`sessionExpired`/`switchAccountDialog`/
  `errorBoundary`/`messageQueue` 各 6、其余 8 个零星。
- 资源表在 `registry-*.js`（9.3MB chunk），提取出 **1,407 个中文叶子键**（嵌套命名空间展开前的叶子名）；
  4,373 条完整文案按 chunk 归档于 zh-strings.md。

### 2.2 按功能域的文案归属（关键词全量分类）

| 功能域 | 条数 | 代表 UX 事实（源文案摘录） |
|---|---|---|
| Unity/编辑器连接 | 240 | "开启后，编辑器会自动导入并编译变更的资产；关闭后暂停自动刷新，重新开启时会一次性导入暂停期间的全部变更"（资产自动刷新聚合开关）；"初始化 Unity 项目分析"；引擎名区分"Unity 编辑器/团结引擎编辑器" |
| 错误与边界 | 178 | "无法复制此图片，请下载后从本地复制"、"无法确定主目录"、"指引加载失败"、"加载索引设置失败" |
| 技能/扩展/市场 | 150 | "技能管理：可列出、编辑、启用/禁用技能"、"扩展管理：安装、启用/禁用、卸载扩展程序"、"从市场安装" |
| 许可与账号 | 122 | 设备码登录文案（"如果浏览器未自动打开，请手动访问…并输入验证码"）、"使用其他账户登录"、"登录或注册账户以开始使用" |
| Git | 90 | "Git 变更"面板、"从此处分支对话"、**"流式输出时无法分支对话"**（流式中禁用 fork 的 UX 边界） |
| 更新 | 84 | **"插件版本过旧"三连提示**（桥插件版本协商 UX：立即升级入口）+ 应用更新域 |
| 资产生成 | 84 | "快速开始 - 生成项目总结"、"{{fileName}} 文件已存在，无需重新生成项目总结"、"内容由 AI 生成，仅供参考"、**"使用模型生成会话标题"** |
| 文件/画布/预览 | 80 | **主区布局六选项**: "对话+画布+右栏 / 对话+画布 / 对话+右栏 / 仅对话 / 仅画布 / 仅右栏"；未保存更改三选对话框（保存/不保存/取消） |
| 终端 | 72 | "在终端中打开 GameCowork"、"新建终端"；**系统环境变量写入失败警告**: "…终端里的 gamecowork 将不会使用新主目录…建议手动设置 GAMECOWORK_CLI_HOME"（GameCoworkHome 迁移的 UX 落点） |
| 远程/移动端 | 68 | 隧道/配对/移动端聚合文案（后期域） |
| 记忆与规则 | 64 | 分层记忆 GAMECOWORK.md 管理 UX |
| 子代理与后台任务 | 62 | "子代理管理：列出、编辑、启用/禁用子代理配置"、"**子代理最大轮次**"（max_turns 的 UI）、"无法向子代理发送消息" |
| MCP | 54 | "MCP 白名单：可自动运行的 MCP 工具。格式：'server::tool' 允许单个工具，'server::*' 允许某个服务器的全部工具"、"添加 MCP 工具..." |
| C# LSP | 28 | 六态文案: 未找到 .sln（引导生成）/依赖未恢复/未启用/运行时不可用/资源校验失败/多解决方案歧义——与壳 lsp.rs 状态机一一对应 |
| 审批与权限 | 26 | "每次确认 / 文件修改和命令执行前请求批准 / 始终允许"三档默认值 |
| 规划模式 | 24 | "先探索代码并提出计划，再执行编辑"、"计划审批"、"退出计划模式" |
| 检查点与回退 | 16 | 检查点保存/回退确认文案 |
| 其它/通用 | 2,931 | 通用控件动词与布局词（取消/删除/保存/搜索/加载中…） |

### 2.3 行为级发现（文案反推的功能细节）

1. **桥插件版本协商 UX**: 前端有"插件版本过旧→功能不可用→立即升级"完整三连，说明原版把桥/插件版本兼容检查做成了显式 UI 流（对应 manage_window_bridge/编辑器侧版本回执）。
2. **资产自动刷新聚合**: 自动导入开关关闭期间累积的变更在重开时"一次性导入"——桥侧 AssetListening 批量导入语义（_InternalAssetListening/_InternalStateDirtyNotifier 的 UX 对面）。
3. **fork 的流式边界**: "流式输出时无法分支对话"——fork 入口在流式期间禁用，与 T6 fork 会话语料一致。
4. **会话标题由模型生成**（"使用模型生成会话标题"）对应 chatDescriber/describe（T13 §2）。
5. **MCP 白名单输入框自带格式提示**（server::tool / server::*）——allowlist TOML（T8）的前端教育文案。
6. **画布布局六选项**是主区 composable 布局（对话/画布/右栏三列可独立开关），own 前端已同构。

## 3. 收尾结论

至此 `codelyreversebackup/` 的提取面闭环: 壳（T1/T12）、许可（T2）、安装器（T3）、差分（T4/T17 内容级）、
索引与模板（专项）、core 五域（T6-T10）、ACP 扩展面（T11）、Agent 工具与 llm（T13）、CLI 命令树与运行时
（T14）、桥 26 管理器（T15）、insight 管线（T16）、前端 UX 与最终差分（T17）。REVERSE-PLAN 下轮候选清空。
后续若原厂发布 canary.3+，复跑 `tools/research/pkg-unpack.mjs` + 本轮 §1 的差分脚本（temp/GameCowork/mine/）
即可增量跟进。
