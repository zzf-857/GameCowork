# Agent 工具注册表全表 + llm/模型域 + 命令代理面（T13，2026-10-02）

> 第四轮深挖。来源: 维护副本 `src/core/binary/out/index.js`（原版 core 载荷同源）、
> `src/agent/cli-main.beautified.js`。T9 只提取了 Unity 工具组（8 个）；本轮首次提取
> **完整工具枚举（54 个）与每工具 UI/审批元数据**，并挖透 llm/*、commands/subagents、
> acp/* 面板；对 domains-surface.md 的 pairing/images 疑似域给出证伪结论。全程只读。

## 1. Agent 工具枚举全表（core 常量 `ee.*`，54 个）

### 1.1 文件读写与编辑

| 工具名 | 枚举 | displayTitle | readonly/instant | defaultToolPolicy | wouldLikeTo 文案 |
|---|---|---|---|---|---|
| `read_file` | ReadFile | Read File | ro/instant | allowedWithoutPermission | Read {{{ absolute_path }}} |
| `read_many_files` | ReadFiles | Read Files | ro/instant | allowedWithoutPermission | Read {{{ paths }}} |
| `read_file_range` | ReadFileRange | Read File Range | ro/instant | allowedWithoutPermission | read lines {{{ startLine }}}-{{{ endLine }}} of {{{ filepath }}} |
| `read_currently_open_file` | ReadCurrentlyOpenFile | Read Currently Open File | ro/instant | allowedWithoutPermission | read the current file |
| `read_lints` | ReadLints | Read Lints | ro/instant | allowedWithoutPermission | Read {{{ paths }}} |
| `write_file` | CreateNewFile | Create New File | — | allowedWithPermission* | — |
| `edit_existing_file` | EditExistingFile | Edit File | — | allowedWithPermission | edit {{{ filepath }}} |
| `single_find_and_replace` | SingleFindAndReplace | Find and Replace | — | allowedWithPermission | find and replace in {{{ filepath }}} |
| `multi_edit` | MultiEdit | Multi Edit | — | (见注) | edit {{{ filepath }}} |
| `edit_with_diff` | EditWithDiff | Edit File with Diff | — | (见注) | edit {{{ filepath }}} with diff |
| `replace` | Edit | Edit File | — | allowedWithoutPermission* | — |
| `view_diff` | ViewDiff | View Diff | ro/instant | allowedWithoutPermission | View the git diff |

\* 表内个别 policy 由窗口邻近推断，以源码 `defaultToolPolicy` 字面为准（脚本可复跑核对）。
注意 `replace`（枚举 Edit）与 `write_file` 的描述在压缩包内相邻易混：`replace`="Edit"语义、
`write_file`="Create a new file. Only use this when a file doesn't exist"。

### 1.2 检索/浏览/网络

| 工具名 | 枚举 | displayTitle | 要点 |
|---|---|---|---|
| `search_file_content` | GrepSearch | Grep Search | rg 正则；schema 含 `-A`/`-B`/`-C`/`-i`/`type` 参数（"More efficient than glob for standard file types"） |
| `glob` | FileGlobSearch | Glob File Search | 分页 `max_length`+起始位置 |
| `list_directory` | LSTool | ls | List {{{ path }}} |
| `view_repo_map` | ViewRepoMap | View Repo Map | repoMap 查看（allowedWithPermission） |
| `view_subdirectory` | ViewSubdirectory | View Subdirectory | 子目录树 |
| `codebase_search` | CodebaseTool | Codebase Search | **语义检索**：描述含"When to Use This Tool"整段提示词，semantic search by meaning |
| `code_search` | CodeSearch | Code Search | ro+instant（与 codebase_search 并列的另一检索工具） |
| `web_search` | SearchWeb | Search Web | allowedWithoutPermission |
| `web_fetch` | FetchUrlContent | WebFetch | WebFetch {{{ url }}} |

### 1.3 会话/交互/规划/记忆

| 工具名 | 枚举 | 要点 |
|---|---|---|
| `sequential_thinking` | SequentialThinking | think through step {{{ thought_number }}} of {{{ total_thoughts }}} |
| `todo_write` | TodoWrite | write todos（ro+instant） |
| `ask_user` | AskUser | "Ask the user one or more questions..."（参数 `questions` 必填） |
| `enter_plan_mode` / `exit_plan_mode` | EnterPlanMode/ExitPlanMode | 规划模式切换（exit 的 displayTitle 在 UI 侧复用"Enter plan mode"字串簇） |
| `save_memory` | SaveMemory | 分层记忆写入（T8 的 `.gamecowork/GAMECOWORK.md` 层） |
| `create_rule_block` | CreateRuleBlock | 创建规则块（allowedWithPermission） |
| `request_rule` | RequestRule | 请求规则 |
| `activate_skill` | ActivateSkill | 技能激活（marketplace skills 域） |
| `analyze_multimedia` | DescribeImage | 图片/媒体描述（"A detailed description to help the external model know the context of the image"） |
| `respond_in_schema` / `response_in_schema` | — | 结构化响应工具（schema 约束输出；压缩包内成对出现） |

### 1.4 终端 / Git / 子代理 / Job

| 工具名 | 枚举 | 要点 |
|---|---|---|
| `run_shell_command` | RunTerminalCommand | allowedWithPermission；"passed directly into the IDE shell" |
| `git_exec` | GitExec | "execute git command: {{{ command }}}"（paginated 输出 max_length）——git-tools.md 的工具化入口 |
| `task` | DelegateToAgent | **子代理委派工具**（与 `_gamecrowork/subagent_activity/load`、background_subagents_update 配套） |
| `job_create`/`job_update`/`job_list`/`job_get` | JobCreate/JobUpdate/JobList/JobGet | **Job 体系以 Agent 工具暴露**（对应通知 `_gamecowork/job/update` 与 editor-bridge Job） |

### 1.5 Unity 工具组（补全 T9 的 8 个 → 14 个）

T9 已录：unity_editor/unity_console/unity_script/unity_package/unity_bake/unity_menu_item/unity_shader(注)/unity_screenshot(注)。
本轮补全枚举：**`unity_scene`、`unity_gameobject`、`unity_asset`、`unity_input`、`unity_workflow`、
`execute_custom_tool`（UnityExecuteCustom，"Tool names must start with a letter and contain only letters/numbers/underscores/dots"）、
`exec_editor_script`、`exec_runtime_script`（"REPL operation that triggers a domain reload and destroys session state"）**。
即 Unity 族共 **15 个**（8+7），全部经 `_gamecrowork/unity/tool/invoke` 执行（见 acp-extension-surface.md §2.2）。

### 1.6 特殊工具集合与 UI 元数据模式

- 特殊集 `Hki = {activate_skill, ask_user, enter_plan_mode, exit_plan_mode, save_memory, run_shell_command, write_file}`
  ——core 侧对这 7 个工具有专门判定（`cya()`），影响权限/会话处理分支。
- 每工具 UI 对象模式: `{type:"function", displayTitle, wouldLikeTo, isCurrently, hasAlready, readonly, isInstant, group, function:{name, description, parameters}, defaultToolPolicy}`；
  `wouldLikeTo/isCurrently/hasAlready` 是前端审批卡与时间线的三态文案（handlebars 模板 `{{{ filepath }}}`）。
- `group` 只有 `"Unity Tools"` 一个显式分组（出现 11 次）。

## 2. llm/* 域（core HTTP 面，此前仅 T9 §7 一笔带过）

| handler | 参数 | 语义 |
|---|---|---|
| `llm/streamChat` | 消息体 | **经 ACP 转发**: `streamChatViaACPHandler` + llmLogger——流式聊天实际由 CLI/Agent 执行 |
| `llm/editCorrector` | `{file_path, file_content, new_string, old_string}`（内部 replace_all:true） | **编辑纠错器**：把模型给出的 fuzzy edit 修正为精确 old/new（配合 replace 工具） |
| `llm/checkNextSpeaker` | `{messages}` | 判断下一个发言者（多角色对话路由） |
| `llm/loopDetect` | `{conversationId, messages}` | 回合级循环检测；按 conversationId 惰性重建检测器（策略见维护副本 `src/agent/resources/loop-detection-policies/`） |
| `llm/toolcallLoopDetect` | `{name, args}` | 工具调用级循环检测 `checkToolCallLoop` |
| `llm/complete` | `{prompt, completionOptions}` | 单轮补全，走 `selectedModelByRole.chat`（无模型 throw "No chat model selected"） |
| `llm/listModels` | `{title}` | 按 title 在 `modelsByRole.chat` 查找后调 `listModels()`；**Ollama 特判**直接 new provider 查询 |
| `llm/compileChat` | `{messages, options}` | `compileChatMessages`（系统提示/上下文组装） |
| `llm/countHistoryTokens` | `{messages, modelName}` | 历史 token 计数 |
| `llm/countTokenPercentage` | — | 上下文占比 |

配套: `chatDescriber/describe`、`chatDescriber/describeSubagent`（会话标题生成，取 `config.language`，
走任一 ACP 入口）；`tts/kill`（TTS 进程回收——core 有 TTS 生命周期，无独立 stt/ 面）。
错误上报白名单（不弹 toast）: `llm/streamChat`、`chatDescriber/describe|describeSubagent`、`llm/compileChat`、`history/load`。

**模型角色**: `selectedModelByRole` / `modelsByRole` 的 role = **chat / edit / embed / rerank**。
**Onboarding**: `handleCompleteOnboarding {mode:"Local"|"API Key", provider, apiKey}` → 写配置并 `reloadConfig("Onboarding completed")`
（Local 模式与 API Key 模式各有配置写入器）。

## 3. commands/subagents = core 调 CLI 子命令的代理面

| core handler | 实际执行 |
|---|---|
| `commands/list` | CLI `["commands","list"]`（workspace cwd）→ `parseCliListOutput` → `gamecoworkDefinitionItems("commands", items)` |
| `commands/enable` / `disable` | `gamecoworkDefinitionAction("commands", "enable|disable", data)` |
| `commands/delete` | `gamecoworkDeleteDefinition("commands", data)` |
| `subagents/list` | 并行 `["agents","list"]` + `["agents","list","--in-agents-dir"]`；合并策略 = **全部 custom + all 中仅 `builtin`/`extension` source** |
| `subagents/enable` / `disable` / `delete` | `gamecoworkDefinitionAction("agents", ...)` / `DeleteDefinition` |
| `acp/refreshCommands` | `refreshCommandsForAllSessions()`（定义变更后推给全部活动会话） |

即 core 不直接管理定义文件，**一切经 CLI 子命令**（与 T8 prompts/assistants 目录布局对应）。

## 4. acp/* HTTP 面全表（16 个，补 T11 遗漏的 core 侧入口）

`acp/initSession`、`acp/exportSession`、`acp/getSessionMode`、`acp/getSessionModel`、`acp/modelProfiles`、
`acp/completeSlashCommand`、`acp/enqueueSessionMessage`（空消息 throw "Cannot enqueue an empty message"；
会话不存在则惰性 `getOrCreateAcpEntry`）、`acp/withdrawLastUserPrompt`（**撤回上一条用户消息**）、
`acp/cancelAutoContinue`、`acp/getRewindFileDiff`、`acp/loadSubagentActivity`、`acp/getBackgroundSubagents`、
`acp/refreshCommands`、`acp/retryCheckIsCLIValid`（CLI 有效性重试）、`acp/notifyUpdate`、`acp/getVersion`。

## 5. generator / images / pairing 纠偏结论

- **generator/** 共 3 handler: `generator/listTasks`（`GAMECOWORK_LOCAL_PROVIDER_MODE==="1"` 时显式
  `{tasks:[],total:0,page:1,size:0,supported:false,reason:"An asset generation Provider is not configured"}`——
  本地模式降级回执已在维护副本内置）、`generator/updateTasksDiscarded {taskIds[], discarded}`、
  `generator/resolveDownloadUrl {path}`（**强校验** `^/api/editor/[\w\-./]+$` 且拒绝 `..`，防路径逃逸）。
- **images/**: core 与 CLI 均**无独立域**（domains-surface 的命中是路径/mime 噪音）；图片生成面就是
  generator/listTasks 的任务列表 + `analyze_multimedia` 工具。第三方图片 Provider 阶段应扩展 generator 域而非新建。
- **pairing**: core 无此域；CLI 中 `pairing` 是 **Sentry 遥测分类**——`Pairing repaired on ${wireApi}:
  ${messageCount} -> ${repairedMessageCount} messages`，即**流式请求/响应消息配对修复机制**（wireApi=API wire 格式），
  与远程设备配对无关。远程配对仍以 shell 面（tunnel-remote.md）为准。
- CLI `tunnel` 命中同为 Sentry transport tunnel（遥测中继），非 frp 隧道。

## 6. IDE 扩展协议（vscode/jetbrains）片段

CLI 内有 zod 校验的 JSON-RPC 2.0 入站方法：`ide/contextUpdate`（编辑器上下文推送）、
`ide/diffAccepted {filePath, content}`、`ide/diffClosed {filePath, content?}`——这是 IDE 扩展侧
（VS Code/JetBrains 插件）与 CLI 的扩展方法面，对应 commands.md §7 的 `applyToFile`/`showFile`
壳侧语义。`ideProtocol` 端口发现逻辑不在 core/CLI 包内（在 IDE 扩展自身）。

## 7. 复用提示与红线

- 54 工具枚举 + 三态文案 + 审批策略 = GameCowork 自研 Agent 工具面的**直接实现契约**；
  Unity 族 15 个对应 own editor-bridge 的工具路由（`_gamecrowork/unity/tool/invoke` 单入口 + action 分发）。
- `task`（DelegateToAgent）+ `job_*` 四件 + `background_subagents_update`/`job_update` 通知 =
  子代理/后台任务完整闭环，GameCowork 已有同源实现基础（RESTORE_STATUS 第五阶段 Commands/Subagents 已跑通）。
- `GAMECOWORK_LOCAL_PROVIDER_MODE` 是维护副本已内置的本地降级开关——第三方 Provider 阶段沿用该开关扩展 generator/llm 域，
  不得把原厂控制面（`/api/editor/*` 下载源等）接入自研。
- 下一轮候选（尚未深挖）: CLI 20.5MB 美化版的完整子命令树与 agent 运行时内部（session 状态机/审批/seatbelt 资源），
  前端 4373 条文案逐 feature 的 UX 行为，editor-bridge-original 26 个 Tools 管理器逐个动作，unity-insight worker 内部管线。
