# CLI 斜杠命令树全表 + Agent 运行时内部（T14，2026-10-02）

> 第五轮深挖。来源: `src/agent/cli-main.beautified.js`（20.5MB，原版 cli 同源维护副本）+
> `src/agent/resources/`（builtin-agents/seatbelt/loop-detection-policies 维护输入）。
> T13 提取了 core 侧工具表；本轮提取 **CLI 交互式斜杠命令注册表全量（60+ 主命令）**、
> **CLI 侧第二套工具枚举（含 swarm/cron/task 三族 core 没有的工具）**、审批模式与策略授予、
> seatbelt 沙箱消费链。全程只读。

## 1. 交互式斜杠命令注册表（CLI REPL 内 `/` 命令，60+）

即 core `acp/completeSlashCommand` 的对端注册表（`{name, description, kind:"built-in", action}` 结构）。
按功能域归类（描述均取源码字面）：

### 1.1 会话与历史
| 命令 | 说明 |
|---|---|
| `/chat save <tag>` | 保存会话检查点（T6 checkpoint_save 的入口） |
| `/chat resume-path <file>` | 按路径恢复检查点/会话 JSON |
| `/chat loop off\|on` | 会话级循环检测开关 |
| `/chat export [tag]` | 导出为增强 markdown（含全量元数据） |
| `/fork [name]` | 分叉当前会话（T6 fork 的入口） |
| `/revert` | 回退到指定消息之前，更新原检查点 |
| `/rewind` | 列回退点或按索引恢复代码/会话状态 |
| `/restore` | 恢复某次工具调用（重置会话与文件历史到该调用产生前） |
| `/clear` `/copy` `/btw <question>`（旁路提问）`/corgi`（彩蛋） | 杂项 |

### 1.2 自定义能力管理
`/commands [list|disable|enable|edit|delete|reload]`（`/commands edit <name>` 不存在则新建）·
`/agents`（info/create/manage/help——**create 是引导式新建向导**）·
`/skills [list|disable|enable|reload]` ·
`/extensions`（install `<source> [--scope=<user|workspace>]` / link 本地路径 / uninstall / update `<names>|--all` / restart / explore 开浏览器）·
`/mcp`（refresh 刷新 server+tool 清单；对 OAuth server 触发认证）·
`/memory`（add-global / add-project）· `/init`（**分析工程生成 GAMECOWORK.md**，`general` 默认 / `unity` 两种分析模式）·
`/example-prompt`（管理并运行示例提示）· `/settings` `/theme` `/lang [--global]` `/editor` `/vim` `/terminal-setup`（VS Code/Cursor/Windsurf 多行键位）。

### 1.3 任务/子代理/后台（Swarm 之外）
| 命令 | 说明 |
|---|---|
| `/subagent run <name> --description <text> (--prompt <text> \| --prompt-file <path>) [--background]` | 直接运行子代理 |
| `/tasks` | 后台任务管理；`/tasks stop task-<uuid>` |
| `/hooks` | panel（状态+执行统计）/ logs（近期 stdout/stderr）/ test（模拟事件执行单个）/ dry-run（按事件模拟全部）/ enable-all / disable-all / trust-project（信任工程级 hooks）/ trust <index\|key\|name>（解除单个被阻断 hook） |
| `/goal` | **长时目标管理**: set / status / pause / resume / budget（token 预算）/ complete |
| `/upm` | **Unity TCP 连接状态与自动重连管理**（UPM=Unity 桥 TCP 面，CLI 侧诊断入口） |
| `/lsp` | LSP 调试操作 · `/unity-insight`（VFS 索引状态/构建/调试查询） |
| `/stats [model\|tools]` `/tools`（按工具用量统计）`/usage`（剩余额度与用量汇总） | 统计 |

### 1.4 Swarm（实验性多进程多代理团队）
`/swarm`（membership/status/messages: **join 加入既有团队 / leave 仅脱离**）· `/send`（向团队成员发工作/结果消息）。
配套错误码 16 个（源码枚举全录）: `SWARM_NOT_ATTACHED`（"Use swarm_manage create/join first"）、
`SWARM_CONVERSATION_OWNED`、`SWARM_CORRUPT_RECORD`、`SWARM_DISABLED`、`SWARM_FENCE_REJECTED`、
`SWARM_INVALID_NAME`、`SWARM_MAILBOX_FULL`、`SWARM_MEMBER_LEFT`、`SWARM_MEMBER_NOT_FOUND`、
`SWARM_RESUME_NOT_ALLOWED`、`SWARM_TASKS_FULL`、`SWARM_TASK_AGENT_BUSY`（"Complete or release it first;
swarm_task action=status reports which one"）、`SWARM_TASK_ALREADY_CLAIMED`、`SWARM_TASK_BLOCKED`、
`SWARM_TASK_NOT_FOUND`、`SWARM_WORKER_UNAVAILABLE`。
**语义**: 文件栅栏（fence）+邮箱（mailbox，有容量上限）+任务认领（claim/agent_busy）——多 CLI 进程经
共享文件协作的团队协议；`swarm_message` 作为会话 attachmentMeta 类型注入（非 user 消息不拦）。

### 1.5 账号/模型/组织/文档
`/model`（use 切换 / config 配置对话框）· `/auth`（更换认证方式）· `/account`（OAuth 登录账号信息）·
`/org`（switch 切换组织）· `/bug`（提交缺陷上报）· `/docs`（开浏览器文档）· `/about`（版本）· `/setup-github`（GitHub Actions 配置）· `/ide`（IDE 集成管理）· `/add <paths>` / `/show`（工作区目录）。

## 2. CLI 侧第二套工具枚举（内部工具 kind，Agent-SDK 风格）

CLI 进程内部工具与 core 54 表（T13）不同源，含 core 没有的三族：

```
glob_file_search, grep, list_dir, read_file, write_file, apply_patch, edit,
run_shell_command, web_search, web_fetch, analyze_multimedia,
skill, activate_skill,
task, task_output, task_stop, send_message_to_task,        ← 后台任务三件 + 任务间消息
job_create, job_get, job_update, job_list,
lsp,                                                        ← CLI 内置 LSP 工具
cron_create, cron_list, cron_delete,                        ← 定时任务族（core 未见）
read_memory, append_memory, update_memory,
swarm_manage, swarm_send, swarm_worker, swarm_task          ← Swarm 四件
```

`task` 在此是**后台任务**（task_output/task_stop 配套），与 core 表 `task`=DelegateToAgent 同名不同义；
`apply_patch` 是 CLI 侧补丁编辑工具。复刻时注意两套表的映射（core 经 ACP 调 CLI，CLI 再落到这些内部工具）。

## 3. 审批模式与策略授予（代码侧，补 T8 的 TOML 格式）

- **模式枚举** `Zn`: `default` / `autoEdit`（输入 `auto_edit` 归一）/ `yolo`；合法值校验接受 `default|yolo|plan`（plan 是协作模式而非 permissionMode）。
- **向上映射**（到 ACP 风格审批）: default→`"default"`，yolo→**`bypassPermissions`**，其余→`acceptEdits`。
- **策略授予（grant）字段**: 校验错误文案直接给出语法——`To scope a grant to yolo only, use approvalModes = ["yolo"].
  To scope it to plan/ask, use collaborationModes = ["plan"] or ["ask"]`；必填字段含 `decision`、工具名模式。
  与 T8 的 `~/.gamecowork-cli/policies/auto-saved.toml`（run_shell_command 前缀 / `server::tool`）同属一套策略面。
- **运行期判定**: 决策枚举含 `DENY`/`ASK_USER`（`rule?.decision`），`downgradedFromAskUser` 降级链；
  `autoApproveAskUser` 选项可在子代理运行中自动批准 ask_user（`agentContext: {agentId, agentType}` 归因随审批携带）。
- **Agent TOML 工具门控**: `tools.allowed_tools`（支持 `"*"` 通配）、`tools.disallowed_tools`（别名 disallowedTools）、
  `skills.allowed_skills`；配置键还包括 `permissionMode|permission_mode`、`inheritCoreSystemPrompt`、`max_turns`、`input_schema`。

## 4. Seatbelt 沙箱消费链（资源 → 进程）

1. **配置**: 环境变量 `SEATBELT_PROFILE`，未设置默认 `"permissive-open"`；合法档位六档
   `permissive-open|permissive-closed|permissive-proxied|restrictive-open|restrictive-closed|restrictive-proxied`
   （与 `src/agent/resources/seatbelt/sandbox-macos-*.sb` 六文件一一对应）。
2. **资源装载**: 优先读包内资源 `sandbox-macos-${profile}.sb`；不存在则从嵌入资源 `seatbelt/${file}`
   解包到 `<os.tmpdir()>/gamecowork-seatbelt/<uuid>/` 再使用；仍缺则 `ERROR: missing macos seatbelt profile file '<x>'` 并 `process.exit(1)`。
3. **执行器解析链**: `darwin && which sandbox-exec` → `sandbox-exec`；否则若启用且存在 → `docker`；再否则 `podman`；全无则报错
   （**Windows 无沙箱档位**——三执行器均不可用时 CLI 直接裸跑，这是 GameCowork Windows 侧无 seatbelt 消费的原因）。
4. **状态判定**: `isSandboxed` = command 是 `sandbox-exec` 且 profile 以 `restrictive-` 开头。
5. **模型告知**: `SANDBOX=sandbox-exec` 时向系统提示注入 "# macOS Seatbelt" 段（限制项目目录外文件/宿主端口访问，失败时建议提供手动命令）。
6. **网络代理档位**: `proxied` 档经 `gamecowork-cli-sandbox-proxy` 代理进程过滤网络。

## 5. 内置 Agent 资源与循环检测策略（维护输入的加载语义）

- **builtin-agents/*.toml**（explore/plan/general-purpose/unity-insight）schema 实录（见 explore.toml）:
  顶层 `name/display_name/description/tools/disallowed_tools`；`[prompts]` `system_prompt/query/inherit_core_system_prompt`；
  **`[model]` 段钉死传输**（explore 固定 `model="gamecowork-air"` + `auth="gamecowork-oauth"` + `wire_api="chat"`，
  注释明确"独立于主会话模型与 /model 配置"）；`[run]` `max_turns=15`/`timeout_mins=10`；
  `[validation]` `input_schema={task="string"}`（与 tjhub-api.md §6 的 agent TOML 模板同构）。
- **loop-detection-policies/default.toml**: 分层覆盖目录 `~/.gamecowork-cli/loop-detection-policies/*.toml`（+系统目录）；
  同层冲突按文件名字典序（阈值/开关取最后声明，rules 取第一条，文件内按数字声明序）；
  检测层 = 工具周期（k=2..32）+ 字节相同连续调用（普通 3/只读 3，job_* 内部×2）+ 短内容快路径（同块/同行 10 次）
  + 长流探针（周期发现，最小 48 字符，只读工具后门槛×~3.3）+ strike 累积（3 次升级为硬停，仅主代理）；
  `loop_detection_exempt_model` 按模型名通配豁免；`[[loop_detection_rule]] action="ignore_as_evidence"` 是唯一豁免来源
  （无硬编码内置规则；豁免过半时跳过 LLM judge——judge 系统提示占位符 `{{ignored_tools_section}}` 等由代码包裹固定护栏）。
- `/chat loop off|on` 是会话级总开关；`llm/loopDetect`/`llm/toolcallLoopDetect`（T13）是 core 侧探测入口。

## 6. Hooks 事件面

hook 事件采用 Claude-Code 命名: **PreToolUse / PostToolUse / UserPromptSubmit / Notification / Stop /
SubagentStop / PreCompact / SessionStart / SessionEnd**；执行记录字段 `prompt_id/hook_event_name/hook_name/
hook_type/source/success`；工程级 hooks 默认不可信（`trust-project`/`trust` 流程，被阻断 hook 按索引/key/名字解除）；
`/hooks panel` 汇聚 `${event}:${name}:${source}` 维度统计。UI 侧有 `hookIndicator` 显示活动 hook。

## 7. 会话状态机要点（CLI 视角，补 T6）

- REPL 响应式状态簇: `streamingState`（流式/UI 门控）、`thought`（思考摘要）、`queuedSubmitWaitingForResponse`
  （排队提交）、`activeShellSession`、`initError`、`pendingHistoryItems`——提交/渲染/中断的完整状态面。
- RewindService 实例态: `sessionState={snapshotList}`、`currentSnapshotId`、`lastRestoreBackup`、
  `fileBackupDedupe`（Set 去重文件备份）、`hydrateRewindPointsFromHistory(history)`（从历史重建回退点）。
- 子代理终态: `completed|failed|cancelled`；`/tasks stop task-<uuid>` 与 task_output/task_stop 工具同链路。
- Swarm 消息以 `attachmentMeta.type==="swarm_message"` 进会话流（`e.type!=="user"` 放行渲染）。

## 8. 进程参数子命令树（核实的部分）

yargs 构建器链式注册 6 个主命令（`.command(A).command(B)…demandCommand(1)`），命令名变量被压缩器打散
（部分经 base64 段解码），字面未全量解出；**已核实**的进程参数入口（core `runGameCoworkCliCommand` 与 T7/T8/T10 交叉）:
`commands list|enable|disable`（--in-agents-dir 属 agents）、`agents list [--in-agents-dir]`、
`mcp add…`（T7: --scope/--env/--header、stdio/sse/http、--transport）、`skills/extensions`（T10）、
config/auth 域、update（`--auto-update --pre-release --consent` 三开关）。未核实的剩余分支不作断言。

## 9. 复用提示

- `/init`（GAMECOWORK.md 生成，general|unity 两模式）与 `/goal`（token 预算）在 GameCowork 尚无对等物，是功能补齐清单新增项；
  Swarm（文件栅栏+邮箱+认领）与 cron 三件为后期候选。
- Seatbelt 消费链在 Windows 无效（执行器链决定）；GameCowork 若做 Windows 沙箱需另行设计（restricted token/AppContainer），
  不得把 seatbelt .sb 文件改名冒充 Windows 能力。
- 审批映射 `yolo→bypassPermissions`、grant 的 approvalModes/collaborationModes 作用域语法可直接对齐自研策略面。
- 红线: `gamecowork-air`/`gamecowork-oauth` 是原厂模型服务身份，自研替换为自有 Provider，不得连接原厂端点。
