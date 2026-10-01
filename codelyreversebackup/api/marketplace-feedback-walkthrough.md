# 远程市场（skills/extensions/marketplace）、feedback 上报、新手引导 walkthrough 及杂项域

> 提取批次: 第二轮 core 域深挖 T10（2026-10-01）
> 来源: `restored/core-gamecowork-binary/binary/out/index.beautified.js`（与原版同源）、
> `restored/frontend/dist-beautified/assets/indexWalkthrough-C1eDPcA7.js`、`index-BRxZ4eG7.js`、
> `codelyreversebackup/shell-logic/modules/src_messages_drill.rs.md`。
> 服务于 HANDOFF 缺口: 「外部市场来源」、P1 菜单逐项核对（反馈/引导窗口）、后期 Provider 阶段的任务面参考。

## 1. 远程市场：统一端点 `/api/marketplace`（:336139-336211）

- core 把 `skills/listRemote`、`extensions/listRemote`、`marketplace/listRemote` 统一到同一取数函数 `p(type, data)`，GET `{控制面基址}/api/marketplace?`：
  `skip, limit(默认50), type("skill"|"extension"|…), search_query, category, sort_by, sort_order, is_recommended("true")`。
- 响应归一化：`items|skills` 数组 + `total` + `attachment_map`（附件 id→url）+ `author_map`（owner id→{username, avatar}）。条目字段：
  ```jsonc
  { id, slug?, version, type, title, description, download_count, category?,
    author: {username, avatar}?, skill_icon, config, userEnvConfig,
    is_unity_skill, editor_compatibility, dependencies, download_url,
    // skill 专属: favorite_count, attachment_id, owner_id
    // extension 专属: git_url (原版恒为 "")
  }
  ```
- `download_url` 相对路径时拼控制面基址。**本地模式降级**：`GAMECOWORK_LOCAL_PROVIDER_MODE=1` → `{items:[], total:0, supported:false, reason:"A GameCowork marketplace source is not configured"}`。
- `marketplace/installedList`（:334640-334665）：本地清单合成 `{skills, extensions, mcpServers}` —— skills/Extensions 扫 `.gamecowork`/`.gamecowork-cli`/`.agents` 目录 + disabled 过滤；mcpServers = 用户级+工作区级配置与 extension 携带的 MCP 服务器合并（`Dha(...)`）。

## 2. skills/extensions 的 CLI 子命令面（core 组装）

| 操作 | CLI 命令 | 备注 |
|---|---|---|
| 装 extension | `extensions install <source> --consent --scope <workspace\|user>` | 输出解析 `Extension "X" installed successfully` 取名字；超时 600s/300s |
| 更新 | `extensions uninstall <name>` + 重新 install | 原版就是"先卸后装" |
| 启/停 | `extensions enable\|disable <name> --scope user` | |
| 卸载 | `extensions uninstall <name> --scope user` | |
| skill 启/停/卸 | `skills enable\|disable\|uninstall <name> --scope <user\|workspace>` | 成功后 `refreshSkillsForAllSessions({action, skillName, skillLocate, projectName, operateScope})` |
| skills/list 等 | `skills list / install / installUpload / listRemote / reloadAcp` | 见 registry |

> HANDOFF 已记录的"通用 writeFile 创建自定义能力"与此互补：**原版对远程来源走 CLI、对本地新建走目录写入**，两条链路都要有 scope 与刷新事件。

## 3. feedback 用户反馈上报（:335552-335727）

- `feedback/submitReport` 载荷：`{title, description, session_id?, tags[], locale, isUnityProject, includeProject, engineType("Unity"|"Tuanjie"), environment, textFiles[{name, path?, contentBase64?}], binaryFiles[同], warnings[]}`。
- 组包：`logs/<core 日志名>`（IDE 类型匹配时追加第二日志 + 专用文件）→ `unity|tuanjie/editor.log`（isUnityProject!==false 时）→ 用户附加 text/binary → **会话导出**（`ZZa`，失败进 warnings）→ `feedback.json`（`{created_at, locale, tags, description, session_id, environment, warnings, files[名单]}`）→ `feedbackClient.submitFeedback({error_message=description, title, app_version, client_type, session_id, include_project, logFiles})` → 返回 `{status, id?}`。
- **project.zip 后台上传**：`include_project && isUnityProject!==false && status==="success" && typeof id==="number"` 才触发（`setImmediate`），非 Unity 工程自动加 warning "project.zip: skipped — workspace is not a Unity project"；进行中重复提交被拒（"A project archive upload is still in progress"）。
- `feedback/getProjectUploadState` → 上传态（可 null）；`feedback/retryProjectUpload` → 无"已完成的上传"时回错。前端 index-BRxZ4eG7.js 有对应状态轮询。
- `feedback/reportStreamError {error_message, title?, session_id?, conversation_id?}`：独立轻量通道，组 `error-details.json` 后 `type:"Error", include_project:false` 直接上报。

## 4. walkthrough 新手引导独立窗口

- 入口：`dist/indexWalkthrough.html`（标题 "Codely Walkthrough"，主题 bootstrap + 独立 chunk `indexWalkthrough-*.js`，两代同构）；壳以独立窗口承载。
- 消息面（仅 3 条，前端→壳）：`drill/getProgress`、`drill/updateProgress`、`drill/drillCompleted`；壳侧实现在 `src/messages/drill.rs`（见 shell-logic/modules/src_messages_drill.rs.md，含进度持久化与失败路径 "drill/updateProgress failed"）。
- 内容：3 步引导（i18n 键）——`walkthrough.steps.chatWithTuanjieAITitle/Description`（开始对话）、`accessPastConversations*`（查看历史会话）、`openTuanjieAIApp*`/`aiPartner*`（打开主应用/AI 伙伴）；操作键 `walkthrough.getStarted / nextStep / markAsAllDone`。
- 复刻建议：结构极轻（一个静态步骤页 + 3 个进度消息），适合直接作为 GameCowork 首启引导的蓝本；进度按步骤 id 存壳侧。

## 5. 杂项（同批确认存在、此前无文档）

- `mdm/setLicenseKey {licenseKey}`（:332732）：企业批量授权入口。
- `process/markAsBackgrounded|isBackgrounded {toolCallId}`（:335728）：后台化工具调用的状态查询。
- `project/getSummary`、`getSessionsFolderPath`、`telemetry {event, data}`、`devdata/log`。
- `generator/listTasks {status?,type?,category?,query?,sessionId?,startTime?,endTime?,page=1,pageSize=20,discarded?}` → GET `{基址}/tasks?…` Bearer 令牌、15s 超时，分页 `{page,pageSize}`；`generator/resolveDownloadUrl`、`generator/updateTasksDiscarded`。**已登录才可用**（无令牌抛 "Not logged in"）；本地模式返回 `{tasks:[],total:0,page:1,size:0,supported:false,reason:"An asset generation Provider is not configured"}`——第三阶段自建 Provider 可沿用该回执形状。
- `chatDescriber/describe {text, language?}` → 任意 ACP 会话 `generateTitle` 生成会话标题；`describeSubagent {subagentName, taskDescription, existingNames}` → 子代理显示名生成（:335284-335310）。

## 6. 复刻注意事项

- 市场条目的 `config/userEnvConfig` 是**用户环境变量配置槽**（安装时让用户填 key 之类），复刻远程技能安装时不能只落文件。
- extension `git_url` 恒空、`download_url` 为主：原版市场分发走附件下载而非 git clone。
- feedback 的 project.zip 仅在"反馈提交成功且有数字 id"后异步上传，且与"上传中互斥"——失败重试依赖 `getProjectUploadState` 的持久态，不是简单重发。
- walkthrough 与 onboarding 强耦合官方品牌文案，复刻时替换 i18n 键内容而非照抄。
