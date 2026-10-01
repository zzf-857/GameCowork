# config 域：profiles/orgs、分层记忆、共享配置、allowlist、GameCoworkHome 迁移

> 提取批次: 第二轮 core 域深挖 T8（2026-10-01）
> 来源: `restored/core-gamecowork-binary/binary/out/index.beautified.js`（与原版同源）。
> 服务于 HANDOFF 缺口: 模型配置/设置 UX 补全、P1「逐项清理未接通操作」（shell allowlist、memory 等菜单项）。

## 1. 组织 / 配置档（orgs → profiles）模型

- `configHandler` 持有 `organizations[]`，每个 org 有 `profiles[]`（`profileDescription.id`、`currentProfile`）；配置实体是 `config.modelsByRole.chat`（`{title, model, extras.customModelId?}`）与 `selectedModelByRole`。
- 每**工作区**记忆选择：globalContext `lastSelectedOrgIdForWorkspace[workspaceId]`、`lastSelectedProfileForWorkspace[profileKey]`（:325000-325019）。
- `config/getSerializedProfileInfo`（:335220）→ `{result: 序列化配置, profileId, organizations, selectedOrgId}`——前端模型/组织选择器的数据源。
- `config/openProfile {profileId, element?}` → `openConfigProfile`（打开配置文件）；`config/refreshProfiles {selectOrgId?, selectProfileId?, reason?}` → `refreshAll(reason)` 后按需 setSelectedOrgId/ProfileId。
- 自定义模型迁移：`~/.gamecowork/settings.json`（:339245 "Migrated N custom model(s) to ~/.gamecowork/settings.json"）。
- `org.json`（`~/.gamecowork/org.json`，:326927/:326941）+ JWT payload 解析（base64url 中段取 `account_type` 等字段）。

## 2. 分层记忆（memory）

- `config/refreshMemory`（:334336）→ `updateUserMemory(reason)`（:325021）：`loadHierarchicalMemory(workspaceDir, ide)` 重新载入层级记忆并写入 `config.userMemory`，随后 `notifyConfigListeners`。
- 文件布局（grep 证据）：
  - 项目记忆 `GAMECOWORK.md`（项目根与子目录层级，:256733/:331448）；
  - 全局记忆写 `~/.continue/GAMECOWORK.md`（**上游遗留路径**，工具描述 :299010 自述；复刻时应改为自己的全局目录）；
  - 项目摘要 `.gamecowork/GAMECOWORK_SUMMARY.md`（:332302）；
  - 规则目录 `.gamecowork/rules`（工具描述 :298528：不能用编辑工具改规则，只能搜索该目录）、agents/assistants 目录 `.gamecowork/agents|assistants`（:298151）。
- Memory insights 面板（前端 index-BRxZ4eG7.js）：workspace/global 两个 scope 标签 + `insights.organizeMemoryPrompt`（整理记忆=开新会话、memoryRWMode:"RW"、自动发整理 prompt）；记忆相关子菜单经 `context/loadSubmenuItems`。
- `config/addLocalWorkspaceBlock {blockType, configLevel}`（:334247）：在工作区建 `.gamecowork/<blockType>` 文件，无工作区时 toast「无法创建…请先打开一个工作区」。
- 共享配置键 `defaultMemoryRWMode` 变更会触发 **restartAllAcpSessions**（:338403-338407）。

## 3. 共享配置 sharedConfig（:328384-328410, :326894）

- 单例 `yP` → globalContext `getSharedConfig()/updateSharedConfig()`；已知键：
  - `modelReasoningEfforts: {<modelKey>: effort}`（`modelReasoningEffortUpdate {modelKey, reasoningEffort}` 增量）；
  - `defaultMemoryRWMode`、`yoloUserRequestTimeout`（这两键变更重启所有 ACP 会话）;
  - IDE 通知开关（`updateIdeNotificationsEnabledFromSharedConfig`）、`byToggle`（仅切换、跳过整次 reloadConfig）。
- 消息面：`config/getSharedConfig`（读）、`config/updateSharedConfig`（写+reload，apply=true）、`config/syncSharedConfig`（apply=false，只读同步）。

## 4. Shell / MCP allowlist —— TOML 策略文件

- 文件路径：**`$GAMECOWORK_CLI_HOME`（默认 `~/.gamecowork-cli`）/policies/auto-saved.toml**（:329254-329275；无 HOME 落 tmp 兜底）。
- 读取 `$Ga()`：TOML 解析失败抛 `Failed to parse policy file ...`；写回 `$pyi()`：`.tmp` + rename 原子替换。
- 规则形态：
  ```toml
  [[rule]]
  toolName = "run_shell_command"      # 壳 allowlist 固定此工具名（UGa）
  decision = "allow"
  commandPrefix = ["git", "npm run build"]   # 字符串或数组；单条 ≤200 字符
  ```
  ```toml
  [[rule]]
  mcpName = "server1"                 # MCP allowlist：toolName 序列化为 "server1__tool" 或 "server1__*"
  toolName = ["server1__getIssues"]
  decision = "allow"
  priority = 200
  collaborationModes = ["default"]
  ```
- `config/getShellAllowlist`（:334339）→ `{status:"success", commands:[...]}`；`config/updateShellAllowlist {add?, remove?}`（:334349）→ 校验 add/remove 必须为字符串数组 → 更新 TOML → `refreshPoliciesAcrossAllCores()`。
- `config/getMcpAllowlist` → `{status:"success", tools:["server::tool"|"server::*"]}`；`config/updateMcpAllowlist` 校验条目必须是 `server::tool` / `server::*`（:329445 错误文案），非法即抛。`server__tool` 双下划线编码 ↔ `server::tool` 显示互转（:329400）。
- **MCP allowlist 本质是"免确认工具白名单"**（decision=allow + collaborationModes default），不是黑名单。

## 5. prompts / assistants 文件

- `config/newPromptFile`（:334238）：读 `config.experimental.promptPath`（默认 `.gamecowork/prompts`，:321052/:331433）→ 建文件 → reloadConfig。
- `config/newAssistantFile`（:334243）：默认目录 `.gamecowork/assistants`（:328865）→ 建助手文件 → reloadConfig。

## 6. GameCoworkHome 三步迁移流（:334394-334429）

| 方法 | 载荷/返回 | 要点 |
|---|---|---|
| `settings/getGameCoworkHome` | `{path, isConfigured}` | 当前数据目录 |
| `settings/prepareGameCoworkHomeChange` | `{newPath}` → `{sourcePath, targetPath, sourceHasData, targetExists, targetNonEmpty}` 或 `{error:"invalid"|"sourceUnreadable"}` | **只探测不写**：目标是否存在/非空、源是否可读 |
| `settings/applyGameCoworkHomeChange` | `{newPath, migrate}` → `{path, envVarWarning?}` 或 `{error:"applyFailed"}` | 先 `clearAcpSessionsForAuthChange("gamecowork home change")` 杀全部会话 → migrate 时复制旧目录 → 更新 sharedConfig `gamecoworkHome` → 写新路径标记 → 返回环境变量警告码 |

## 7. 其余 config 面速览

- `config/updateSelectMode {continueSessionId, collaborationMode?, approvalMode?, mode?}`（:334430）：`mode` 字符串经 `vbe()` 折算成 collaboration+approval 二元组（映射见 `acp/getSessionMode` 的反算：`plan|ask` 直用，`yolo`，`default→auto_edit`）；**GAMECOWORK_LOCAL_PROVIDER_MODE=1 且无活动会话时只写 SQLite 并返回 `{deferred:true}`**。
- `config/updateSelectedModel {profileId, role, title, continueSessionId?}`（:334475）：更新全局选中模型 → 解析 `extras.customModelId` → 写项目级模型覆盖 → `session/selectedModelChanged` 广播 + 会话标记 `needsRestart` + `acp/systemMessageUpdate` "Successfully switched to model: …"。
- `config/ideSettingsUpdate`、`config/checkRemoteConfig`（控制面 sessionInfo 探测）、`config/addModel {model, role}` / `config/deleteModel {title}`（本地模型表增删）。
- `config/getInstalledEditors`（:335226）→ 编辑器探测清单（与壳 tjhub/getEditors 是两条不同链路：core 版供 Agent 场景使用）。

## 8. 复刻注意事项

- allowlist 是 **CLI 的运行时策略**（policies/auto-saved.toml），不是壳的设置——改完必须让所有 core/CLI 实例重载（原版用 refreshPoliciesAcrossAllCores）。
- `~/.continue/` 前缀是上游残留：提取时不要照抄到产品里，统一收敛到自己目录并保留对旧路径的一次性迁移。
- GameCoworkHome 迁移的顺序（杀会话→迁移→改配置→写标记→查环境变量）不能颠倒，否则新旧目录混写。
