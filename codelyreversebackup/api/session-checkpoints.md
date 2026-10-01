# 会话检查点 / 回退（rewind·fork）/ 压缩 —— core 三层协议全解

> 提取批次: 第二轮 core 域深挖 T6（2026-10-01）
> 来源（只读）: 原版 `E:\TuanjieCodely\EXE\Tuanjie Cowork\app\resource\core\bin\win32-x64\codely-binary.exe` 内嵌 JS；
> 行号引用基于维护副本 `restored/core-gamecowork-binary/binary/out/index.beautified.js`（与原版同源）、
> `restored/cli-gamecowork/cli-main.beautified.js`、`restored/frontend/dist-beautified/assets/index-BRxZ4eG7.js`。
> 服务于 HANDOFF 缺口: P1「逐项清理未接通操作」中的会话回退/检查点；P1 聊天体验补全。

## 0. 结论摘要

原版有一条完整的三层检查点链路，**GameCowork 提取库此前从未记录**（仅 MESSAGE-LAYERS 提到消息名）：

1. **Agent CLI** 每个用户回合保存文件快照（`fileHistorySnapshots`），会话记录内含变更摘要；
2. **core** 暴露 `history/rewind`（支持 `dryRun` 预览）、`history/fork`、`acp/getRewindFileDiff`；
3. **前端** 在用户消息上提供「回退代码至此处」按钮，dryRun→确认→回退（可选 fork 出新会话）。

## 1. history 域 17 个方法全表（core handler: index.beautified.js:333792-334190）

| 方法 | 请求载荷 | 行为要点 |
|---|---|---|
| `history/list` | list 参数 | `acpHistoryManager.list`；失败回退 `[]` |
| `history/delete` | `{id}` | 先 `getHolder(id).dispose`，回调里删检查点（CLI `men`）+ 删历史（`GOe.delete`）+ 清 `acpContextUsageBySessionId` + `pushHistoryListChanged`；**顺序：先杀 ACP 进程再删数据** |
| `history/load` | `{id}` | 多级来源：活动 ACP 会话流式态 > 磁盘会话文件(`GOe.load`，含压缩摘要归一化) > sessions.sqlite 元数据；合并 `title/selectedChatModelTitle/mode/collaborationMode/approvalMode/selectedContextLength/streamError/draftInput`；不存在时抛 `Session ${id} was not found in the current workspace` |
| `acp/withdrawLastUserPrompt` | data | 撤回最后一条用户提示（转发 ACP `AGa`） |
| `history/rewind` | `{id(=userInputIndex), sessionId, type}` | **type ∈ {"dryRun","code"}**；见 §2 |
| `history/fork` | `{id(=messageId), sessionId}` | 见 §3 |
| `history/save` | 会话对象 | `saveSessionMeta`；`modelChanged` 时发 `session/selectedModelChanged` |
| `history/updateState` | `{sessionId, state}` | 更新会话状态（折叠状态等 UI 态） |
| `history/renameTitle` | `{sessionId, title}` | 改名 + pushHistoryListChanged |
| `history/markAsRead` / `markAsUnread` | `{sessionId}` | 未读红点体系，返回 true 才 push |
| `history/saveDraftInput` / `clearDraftInput` | `{sessionId, draftInput}` | **每会话草稿输入框内容持久化** |
| `history/saveSubagentDisplayNames` | `{sessionId, displayNames}` | 子代理显示名持久化 |
| `history/saveSessionSettings` | `{sessionId, ...}` | 模型/模式等会话级设置 |
| `history/getSessionFolderPath` | - | 返回会话存储目录 `_w()` |
| `history/clear` | - | `GOe.clearAll()` + 清 contextUsage + `shutdownACP()`（清空全部历史且杀所有会话进程） |

## 2. rewind 三层协议（本库最核心的新增事实）

### 2.1 core 层（index.beautified.js:334036-334073）

```jsonc
// 请求
{ "id": <userInputIndex>, "sessionId": "...", "type": "dryRun" | "code" }
// 响应 = rewindPreview（dryRun 预览与实际回退共用同一结构）
{
  "canRewind": true,
  "changedFiles": ["relative/path.ts"],
  "totalLineAdded": 12, "totalLineDeleted": 3,
  "changedFileCount": 2, "effectiveChangedFileCount": 2,
  "fileDetails": [ { "relativePath": "...", "action": "restore",
                     "lineAdded": 8, "lineDeleted": 1,
                     "backupExists": true, "currentExists": true } ]
}
```

- 预览通过 ACP 回包的 **`_meta.gamecowork.rewindPreview`** 传递（callback 从 `f?._meta?.gamecowork?.rewindPreview` 读取）。
- `type!=="dryRun"` 成功后：`pushHistoryListChanged()` + 清该会话 streamError 并广播 `stream/streamError {sessionId, error:null}`；失败也不阻断 UI（只 console.warn）。
- 预览缺失时的兜底返回即上方 `canRewind:true, 全空` 结构。

### 2.2 Agent CLI 层（cli-main.beautified.js）

- **RewindService**：`XZr` 类（:324622，经 `getRewindService()` 惰性单例 :374354），按 projectRoot 构造，会话态 `sessionState.snapshotList`。
- 每个用户消息的快照记录 `fileHistorySnapshots[]`：`{id, trackedFileBackups: {绝对路径: {backupName}}, changeSummary: {相对路径: {lineAdded, lineDeleted}}}`；从历史恢复用 `hydrateRewindPointsFromHistory({record, snapshotSourceFilePaths})`（:515328）。
- **备份文件落盘**：`<historyDir>/snapshots/<snapshotId>/<path 转下划线>`（:323982）；另有 git 提交级快照 `createFileSnapshot`（timestamp+rand id、baseCommitHash、deleted 文件只记状态不备份，:324000 起）。
- **dryRun**：`/rewind dryRun <index>` 经 `tryAcpInterception` 拦截（:515253）→ `previewCodeRestoreByPointIndex({pointIndex})` → 组装 rewindPreview（含 `invalidRecords` 坏记录列表）以 `message_with_meta` 回包。
- **checkpoint_save 会话更新**（:516977）：`/chat save [tag]` 命令完成后 CLI 发 `sessionUpdate:"checkpoint_save"` + `{status:"completed"|"failed", tag?, error?}`；core 用 `checkpointSaveWaiters` 等待（index.beautified.js:287781），收不到时按旧版 CLI 处理（:288283 注释 `assuming older CLI`）。
- **变更文件推送**：`sendCurrentSessionChangedFilesUpdate` 用 `listChangedFilesByPoint()` 组 `acp/currentSessionChangedFilesUpdate`（:517720-517733）。
- CLI 还有 `/fork <args>` 斜杠命令与 `rewind` 内建工具定义（"List rewind points or restore code/conversation state by rewind-point index."，:478225）。
- 恢复对话用合成假会话 `sessionId:"rewind-restore"` 反序列化（:478215）。

### 2.3 前端层（index-BRxZ4eG7.js:49460-49530）

流程：`流式中禁止`（toast `userInput.rewindErrorStreaming`）→ `history/rewind type:"dryRun"` → 弹预览组件（changedFiles 行数统计 + **fork 选项**）→ 确认后 `history/rewind type:"code"` → 若选择 fork：`history/fork {id: 用户消息数-rewindIndex}` → 用返回的新 sessionId `history/save`（携带切片后的 history、编辑器态、草稿文本）→ 广播会话切换；不 fork 则 toast `userInput.rewindSuccess`。
文案证据：`frontend/zh-strings.md` 「rewind: 回退 / rewindCode: 回退代码至此处 / rewindSuccess: 代码回退成功」。

### 2.4 单文件 diff（index.beautified.js:336467）

`acp/getRewindFileDiff {sessionId, relativePath, scope, pointIndex?}` → CLI `getRewindFileDiff({relativePath, scope, pointIndex})`（:517735）→ RewindService `getFileDiff` → `{diff: string|null}`。scope 用于区分当前点/工作区视图。

## 3. fork（从历史消息分叉新会话）

core（:334075）：请求 `{id, sessionId}`；`id` 是**消息序号换算**（前端传 `用户消息总数 - rewindIndex`）。流程：生成新 continueSessionId → ACP `pen({acpSessionId, messageId, sessionId, acpManager, newContinueSession})`（CLI 侧把历史切片种入新会话，`_acpBranchForkSeedOnly`，:515352）→ 返回新会话对象 `{sessionId, title: "<旧标题> (forked)", workspaceDirectory, history: [], dateUpdated, useUppercaseProjectHash: true}`。

## 4. 压缩（conversation/compact，index.beautified.js:335311）

`conversation/compact {sessionId, isManual?}` → ACP `manager.compressSession(acpSessionId, isManual??true)` → 返回 `{originalTokenCount, newTokenCount}`；压缩过程有 `acp/compressionStart|compressionChunk|compressionComplete` 三段事件（前端有对应 UI）。历史加载时 `normalizeCompressionSummaryHistory` 归一化压缩摘要消息（:333831）。

## 5. tabs 域（多标签会话上报，:334191）

`tabs/reportOpenTabs {tabs:[{id,title,isActive,sessionId,mode,collaborationMode,approvalMode,viewType,subagentToolCallId,subagentAgentName,subagentDisplayName}]}` → core 缓存 `guiOpenTabsSnapshot`；`tabs/getOpenTabs` 返回副本。用途：IDE 扩展/多窗口场景同步"当前打开哪些会话标签"。

## 6. 复刻注意事项

- rewind 的 `id` 语义是 **用户消息序号**（从 0 计），不是消息 UUID；fork 请求的 `id` 是该序号的换算值。
- 删除会话必须同时删检查点备份（snapshots 目录）与 sessions.sqlite 行，否则出现孤儿快照。
- `checkpoint_save` 是对旧 CLI 的兼容探测点：收不到该 update 不能报错，应视为无检查点能力。
- dryRun 预览结构必须与实际回退一致（同一结构复用），前端确认弹窗直接渲染它。
- 未读/草稿/子代理显示名都在会话元数据里，属于同一 `acpHistoryManager`（sessions.sqlite + 会话 JSON）。
