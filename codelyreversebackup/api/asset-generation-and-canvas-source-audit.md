# Codely 真实资产生成与画布来源审计

2026-10-02。本报告响应用户提供的四张真实 Codely 截图，先拆解实际原版 EXE、随包资源以及原包明确引用的公开客户端。本阶段仅研究；GameCowork 在当前对话中的开发、打包暂停。原版可执行文件、应用 JS、登录、生成、上传、额度和用户历史接口均未执行。

## 结论与旧研究纠正

这四个界面不是全部装在原生 EXE 内的本地功能。实际随包 `dist/gui.html` 加载 `index-BRxZ4eG7.js`；该原始文件的 `PG/MG/jG/QG` 实现三个页签、iframe 容器和消息桥，指向两个真实远端应用。快速生成、历史、画布图库及节点内部实现需要继续查原包引用的远端客户端资源。只抄菜单或任意设计 REST 服务、简化画板，不能算恢复这些功能。

此前通用 Provider 的自定义请求协议与简化素材布局属于 GameCowork 自行设计，不能作为 Codely 原功能的证据。此前 T17 的“canary.2 新增 custom/* 和 GameCoworkHome 七条字符串”归因也需撤销：本次实际原 Core 载荷 B4B146C5 中四条 `custom/create|read|rename|update` 与三条 `GameCoworkHome` 名称计数均为 0，当前维护副本均为 1；原版仍使用三个 `CodelyHome` 名称。旧 T17 的比较输入包含维护改动，不能据此认定原厂版本增量或全部提取闭环。机器记录见本报告的来源证据 JSON。

## 原始输入与证据分层

| 证据 | 实际路径或 URL | 大小 / SHA256 |
| --- | --- | --- |
| 原生壳 PE，版本 2.1.3-canary.2，x64 | `E:/TuanjieCodely/EXE/Tuanjie Cowork/cowork.exe` | 58,555,736 B；`55EA13A9707774DF61A707AC55179E94ABB9690583DE986C528DA056A69B8C3B` |
| 原版活动前端，真实 gui.html 引用 | `E:/TuanjieCodely/EXE/Tuanjie Cowork/app/resource/dist/assets/index-BRxZ4eG7.js` | 1,180,159 B；`6CB34283488C0A2BC348EA6F43769CCCF810C5EB852B15FAFBB78F40CAB20707` |
| 原版 Core EXE | `E:/TuanjieCodely/EXE/Tuanjie Cowork/app/resource/core/bin/win32-x64/codely-binary.exe` | 70,158,576 B；`C7A998C9992EFC0201D3AA1A895D6A47B719F1F6A0C2B858A954F7F69BA6CA64` |
| 上项静态 PKG 解包的真实入口 | `temp/GameCowork/codely-assets-reference-20261002/original-core-unpacked/binary/out/index.js` | 14,346,800 B；`B4B146C5CDD166676635AFD0367C15D2E8FB1EC94F436D35657474A6F55B3D4E` |
| 原版 CLI EXE | `E:/TuanjieCodely/EXE/Tuanjie Cowork/cli/bin/win32-x64/codely.exe` | 204,135,768 B；`B54CF062537300CA71D459FDEDE81AA03ECC08449730BFB1CF5E1DCADAD3E44D` |
| 上项明文载荷，EXE 起点 189957669 | `temp/GameCowork/codely-assets-reference-20261002/original-cli-carved/carve_0201_189957669.js` | 11,951,226 B；`8DA5876521A7BA6102D28220577FA8E212667BB33EA56A7FE1E954E8580F2E19` |
| 快速生成 / 历史当前公开客户端 | `https://ai.cdn.tuanjie.cn/static/dist/assets/index-DZWJHC3S.js` | 2,400,014 B；`10E0E9C2A6771C22EB65C205FAB910A1779794C689E8523F97D8F831EED19D9D` |
| Canvas 当前公开客户端 | `https://aicanvas.tuanjie.cn/assets/index-A8ll_iBT.js` | 2,030,171 B；`037278E934ADBF3E999F1205BD656EBF3CF87F68FD6BDCD32B7F446928FD8B82` |

真实安装目录使用单数 `app/resource`。公开页面来源由原包字符串确定：`https://ai-generator.tuanjie.cn/lab3d?embed=1&host=codely`、`/generation-history?embed=1&host=codely` 和 `https://aicanvas.tuanjie.cn/home`。匿名只读下载 HTML/JS/CSS，没有发送 Cookie、Authorization 或原版 token，没有读取账号状态，也没有执行下载的应用代码。

公开客户端是 2026-10-02 获取的当前远端部署，不能称为 EXE 内嵌载荷，也不能证明与截图 9 月 29 日所见版本逐字相同。服务端、数据库、真实额度、私有 Provider 配置均不包含在这些公开客户端证据中。PE 节区 / 字符串检查也不等同完整原生 Rust 函数反编译。

## 四张截图逐项对照

表中的行号均指统一 temp 内的格式化派生文件，原始 minified JS 的证据由文件 SHA 绑定；不是原工程行号。关键原始字节范围另有机器记录。

| 截图 / 功能 | 真实实现与证据 | 已知边界 |
| --- | --- | --- |
| 1：2D / 3D / 音乐音效 / 视频 | 生成客户端 `LK`（派生 39188），真实模式 `image/3d/audio/video`；`xN` 组合模型目录 | 音频是独立模式；三类通用资产表单没有覆盖截图范围 |
| 1：模型与参数 | 45 个静态模型描述定义，另有 `kK.map` 的 `frontier_flare/frontier_sunburst` 两种生成描述；每模型 `build`、needs、格式、输入限制、参数和门控不同；`VNe`（74819） | 45 是描述定义数，不是厂商数、可见卡片总数或账号获准模型数；`Je` 的 124 项是任务类型枚举 |
| 1：比例 / 质量 / 数量 / 抠图 | `O1e/FK/VNe`：模型限定比例、像素和 1K/2K/4K；`segMode=none/smart/native`；原生抠图门控且 PNG；数量受 maxCount 控制 | 截图文案和模型能力不能统一硬编码 |
| 1：添加参考图 | `Rb/VK/Mr`（75960/41034/41050）：文件格式、模型数量限制、multipart 上传；视频另分首帧、首尾帧、reference、multimodal | `/api/sso/upload/*` 是真实静态调用定义，本次未上传 |
| 1：手绘草图 | `kZ/Ene`（73304/76341）：笔刷、颜色、橡皮、文字、箭头、撤销/重做、背景/尺寸、保存及作为参考图；上传期间固定模型/模式上下文 | 不能以素材拖拽画板代替手绘编辑器 |
| 1：提示词优化 / 积分 | `wne`（76300）创建 `doubao-prompt`；积分、订阅与报价分支（75690–75808） | 优化实际创建收费任务；135 积分是用户/参数结果，不是固定价格 |
| 1：实际生成和轮询 | `hwe.c`：`POST /api/sso/generate {kind:model.id,data:payload}`；`X1e`：`GET /api/task/:serverTaskId/status` | 真实 SSO、CSRF、账号门控；不能换成自定协议后仍称原版接口恢复 |
| 2：画布模板图库 | Canvas `sb/ab`：热门/广告/影视/游戏/数字人/工具/社区，模板筛选；`/api/v1/templates` 等客户端定义 | 实际模板数据和服务端未查询 |
| 2：个人 / 协作画布 | `sb` + `Mm/Nm/Fm/Lm/zm/Bm/th/nh/rh/ih/ah/oh`：个人与组织列表、复制、创建、读取图、更新、版本、commit/restore 等真实 API 定义 | 协作权限、数据一致性和版本服务端未恢复 |
| 2：搜索 / 四种布局 / 新画布 | `sb`：名称搜索、`sm/md/lg/list`，初始 `{nodes:[],edges:[],viewport:{x:0,y:0,zoom:1},nodeIdCounter:100}` | 模板选择与图数据是独立层，不是历史任务卡片改名 |
| 3：历史类别 | `NIe`（82340）：all/3d/image/audio/video/other；`IIe=tasks/assets`，素材范围 all/output/input；list/grid | 生成记录与素材平铺是不同视图 |
| 3：搜索 / 日期 / 工作区 / 标签 | toolbar（83559–83633）；`Dp` 日界限 +08:00，结束日次日；分页 40；`kL/GZ` 查询字段和 tagIds | 原始筛选参数已查出，未查询用户历史 |
| 3：多选 / 丢弃 / 恢复 | `Tz`（78309）批次 ≤200 的 discarded 状态；标签删除保留记录/文件 | 丢弃记录不代表取消远端任务或删除磁盘资产 |
| 3：再次生成 / 参考 / 定位文件 | `wF`（76520）恢复按模型支持的原输入；`codely:regenerate/use-reference/local-artifact-request/reveal-artifact` | 原始任务 payload、会话桥与原生文件桥需要成套理解 |
| 4：节点菜单 | Canvas `jB/aB`：文本、图片、视频、音频、模型、图层、上传、视频合成、导演台、3D 世界、Agent | 本次当前客户端 world3d disabled；Agent 仅 admin/operations；菜单存在不等于全部账号可用 |
| 4：连线 / 缩放 / minimap / 锁定 | `uB/jw`：ReactFlow/XYFlow 图、flowing 连线、zoom 0.2–2、锁/只读条件、网格、fit view、undo/redo、分组及 viewport | 简化局部素材布局不等同此图模型和执行链路 |
| 4：截取当前帧 | `Pz` 取视频 Blob、seek 当前时间、drawImage 输出 PNG；`video-capture-frame {nodeId,imageDataUrl}`；`jZ` 上传后创建图片节点和 flowing edge | 已查实际像素路径；本次没有播放个人视频或调用上传 |

## 原包宿主与 Core 真实责任

活动前端 `PG` 提供 creator/canvas/history 页签，`MG/jG` 构造生成/历史 iframe URL；Canvas `QG/sq` 校验消息的 `event.source` 和准确 origin，处理 ready、主题、工作区、登录字段和下载桥。`Jv/kG` 处理 `codely:prefill/ready/auth/theme/locale`。token 在源码里仅作为协议字段，本次没有取值或发送。

原 Core 解包入口在原始字节 14219353、14220859、14221695 注册三个相关 RPC：`generator/listTasks`、`generator/updateTasksDiscarded`、`generator/resolveDownloadUrl`。它们分别依赖平台 token 访问任务列表、更新 discarded、解析下载跳转；不能因此推断 Core 已包含快速生成或自定义厂商注册器。原 `TJGenerators` 是 `https://ai-generator.tuanjie.cn/mcp` 远程服务，编辑器 API 根为 `/api/editor`。环境覆盖地址不等于替换官方 OAuth。

原前端 `xu` 的 30 个生成/查询名称是通知显示家族映射；原 CLI 53 项已静态解析工具描述是 Agent/桥工具集合。这两个计数与公开 `xN` 模型目录不是同一概念，不能合并成 Provider 数。审计使用的 `Root_Entry` 是报告包装字段，不是原程序标识符。

真实生成客户端请求带平台会话、CSRF 与嵌入身份字段，额度由 `creditTaskType/creditParams` 和服务端报价决定。参数构建因模型而异，支持图片、音视频、模型文件、纹理、天空盒和分层输出；默认 3 秒轮询、10 次连续错误、10 分钟超时，天空盒可到 4 小时，另有模型覆盖。没有在该生成 hook 观察到可证明远端取消的 API；本地停止轮询/丢弃不能冒充取消。

## 可复核材料与继续边界

### 画布生成节点内部：已深入到数据传递与执行适配

当前 Canvas 的 `aB` 映射 `imageGenNode→Mz`、`videoGenNode→Pz`、`audioGenNode→Bz`、`modelGenNode→Hz`。四者处理实际结果预览；真正的提示词、参数、执行编辑器共用 `GR`，分别派发 `yR/LR/eR/DR`。`sF` 按 target 找入边，从上游节点的实际输出字段读取素材，与本节点输入合并；执行结果写入 `node.data.images/videos/audios/modelUrls` 及 history，下游继续经 `sF` 消费，四类 renderer 都具有输入 / 输出 handle。

真实执行适配在 `GR` 内经 `Ge/Be→oC→cC→mC→dC/fC`，优先读取 `uD/YS` 的服务端模型目录与 schema，来源定义为 `/api/v1/ai-models` 与模型 schema 路由。schema 决定 inputParams、taskLifecycle 和 outputMapping；因此多数模型枚举、实际 create 方法 / 路径、poll 路径 / 状态 / 周期不是固定写死在本次取得的客户端里。图片 / 视频另有具名 legacy 分支；模型缺必要 schema 时明确报错。不能把快速生成站点的 `/sso/generate` 自动套到整个 Canvas，也不能凭空发明 schema。AbortSignal 只证明客户端停止等待，不证明服务器取消或回滚。19 个原始 AST 字节范围绑定该结论，详见来源 JSON 的 `canvas-generation-node-audit` 与 `canvas-node-raw-ranges`。

### 图层、合成、导演台与图执行：入口以外的真实实现

| 功能 | 已查出的客户端行为 | 不能据此宣称的能力 |
| --- | --- | --- |
| 图层编辑 | `Kz→QI→tI` 的真实 Canvas2D 窗口；图层排序 / 复制 / 变换 / 可见性 / 透明度、背景 / 尺寸、宫格拼接；保存 `layerConfig/outputImage`，实际绘制 PNG；3 秒 debounce | 大图片上传失败会保留 data URI，界面“已保存”仅能证明更新本地节点，不能代替云保存成功 |
| 视频合成 | `Zz→QI→HI/hI`：轨道 / clip / trim / 音量 / 变换 / 文字，预览与保存；Canvas 30fps、AudioContext 混音、MediaRecorder 8Mbps 输出 MP4/WebM Blob；上传返回 URL 后建立视频节点和边 | 没有发现服务端 FFmpeg 证据；模型 clip 使用缩略图，不证明渲染 3D 动画；受浏览器编码器和 CORS 限制 |
| 导演台 | `Wz→QI→HF`：实际 3D 场景、对象 / 相机位置旋转缩放、FOV / look-at / pose / animation、全景，截图生成图片节点；version 2 场景 JSON | `sceneId` 存储依赖 `/api/v1/director-scenes`；创建 / load / gzip+Base64 save / cover 是认证服务端调用定义；15 秒自动保存和异常 catch 不证明服务端持久成功 |
| 媒体上传 | `YZ`：实际 File 的 image/video/audio/splat multipart；返回 URL 才写节点素材；失败有明确状态 | 进度到 90% 使用估计值，不是已测上传字节；3D 世界菜单禁用但独立 splat 上传分支仍存在 |
| 连线与批次 | `sF` 只读取直接入边的已有输出；`generate.*` 显式执行节点任务；`fZ/cliExec` 顺序 await 显式命令，支持 `@last` 和 wait；`node.regenerate` 仅支持存有 prompt 的图片节点 | 未在已缓存客户端定位完整图拓扑自动调度或循环检查，不能把节点连线 / 顺序批次当成已证实的全图 DAG 执行器 |

上述 28 个实际原始绑定范围与格式化 AST 一致。懒加载 `AmisUIRenderer-E_XEILCf.js` 未在停止联网前缓存，具体服务端 ui_config/schema 响应也未知；这些缺口不靠自研逻辑补成原版事实。

- [完整来源与提取记录](asset-generation-and-canvas-source-evidence.json)：原路径/URL、SHA、来源层、关键字节范围、模型描述、宿主协议、验证和未知项。
- 临时原始证据根：`F:/AI/AgentMake/temp/GameCowork/codely-assets-reference-20261002/`。`pretty/`、`pretty-public/`、`remote-current/pretty/` 为格式化派生；原始下载和 EXE 载荷分别保留。
- `QUICK-HISTORY-SOURCE-AUDIT.md`、`provider-protocol-findings.json`、`public-provider-model-registry.json`、`public-auth-credit-evidence.json`、`canvas-reference-findings.json` 保存详细字段和符号；离线验证记录保存 SHA/大小和 raw/pretty 对应检查。
- 本阶段没有把源代码研究当作运行验收。服务器、私有生成配置、真实 OAuth/额度、组织协作以及截图历史部署仍有明确缺口。

恢复开发前，须按以上真实功能、输入/输出和交互链路逐项确定 GameCowork 的实现范围；现有自研适配器和素材布局只能按其自身范围记账。本报告不授权挂载原账户或代发原平台收费任务。

交付复核：最终来源副本、45 个模型原始范围、9 个鉴权字节定位、28 个组件范围、提取清单与新增文档链接共 120 项离线检查通过，记录于 temp 的 `final-research-verification.json`；`node tools/check-layout.mjs` 与本次文档范围 `git diff --check` 通过。未运行产品测试或打包。Windows 的 `HI/hI` 同名提取文件覆盖问题已修为符号 UTF-8 hex 唯一文件名，原始范围和输出逐一一致，纠正记录保留。


## 2026-10-02 补充：自定义服务入口与后续原模型绑定

本节是后续只读源码复核及**尚未实现的本地接线提案**，不改写上文研究阶段的验收事实，也不把本地方案归因为原服务端实现。本次没有执行原应用 JS、读取账户 / 凭据、调用原 API，或修改 Core / 原客户端页面。

下文 `Q` 指 `temp/GameCowork/codely-assets-reference-20261002/pretty-public/index-DZWJHC3S.js`，绑定原始 SHA `10E0E9C2A6771C22EB65C205FAB910A1779794C689E8523F97D8F831EED19D9D`；`C` 指同根 `remote-current/pretty/index-A8ll_iBT.js`，绑定原始 SHA `037278E934ADBF3E999F1205BD656EBF3CF87F68FD6BDCD32B7F446928FD8B82`。行号是格式化派生位置，不能当作原工程行号。

### 已缓存客户端没有现成的用户 Provider 凭据设置页证据

- **Quick / History**：原主包中 `apiKey`、`api_key`、`customProvider`、`providerId`、`provider_id` 均无匹配；`baseURL` 的业务入口是 `Q:20360` 的 `Mn` 固定平台 API。`Q:99928` 的路由表是首页、`/submit`、`/credits`、`/lab3d`、`/assetlib`、`/generation-history/*`；`IUe=[]` 没有注册管理员子路由。`Q:29771` 的管理员入口只是 `isAdmin` 条件下指向 `/admin/data/task-statistics` 的链接，不是已缓存的 Provider 管理页。
- `Q:75405` 的 `layerProvider` 是 **Qwen / Seedream 5.0 Pro 两种图层处理模型选择**，没有 URL、Key、请求模板或厂商凭据输入。它不能被引用为“原版自定义 Provider 页面”。
- **Canvas**：`C:30339–30340`、`40161–40162`、`82557–82558` 的三处 `apiKey` 全为空描述字段；本主包没有读取该字段或让用户编辑它的逻辑。`baseUrl` 只有上述模型对象及 `C:31514` 的 `FC` 读取；`FC` 从静态 `LS/RS/zS` 取文本模型，空地址回退到 `C:31442` 的 `/api/v1/proxy/chat/completions`。这不是可配置资产服务的设置入口。
- `C:40135–40219` 的 `aD/oD/sD` 从 `/api/v1/ai-models?use_case=prompt|tool|buildin&category=...` 取得模型列表，将 `schema.meta` 转为选择器条目，并把 `baseUrl/apiKey` 固定置空。模型路径、参数和结果映射由 schema 接口提供。

以上结论限定于已核验主包及当前导入的相关懒加载依赖；没有访问独立后台，不能据此断言整个官方产品从未有后台 Provider 配置。

上文“未缓存 AmisUIRenderer”是当时停止联网时的记录。后续已导入的原静态依赖补齐了以下文件，本次只读取并核对其 SHA：

| 原资源 | 原始 SHA256 | 实际作用 |
| --- | --- | --- |
| `AmisToolPanel-DotiYVzI.js` | `3F74591B515D6F5F83178295822A3241F16333F4BB7C2656482B74CF43CC862C` | `u({uiConfig,modelDisplayName,nodeData,onSubmit,onClose})` 将节点图片、视频、提示词、模型 URL 填入工具参数窗口 |
| `AmisUIRenderer-E_XEILCf.js` | `1DB3F0F0091989654CEF0999C6942DEF6B9D4824F896B688FC14BD25F81E4CF7` | `s({schema,data,onSubmit,fallback})` 懒加载真正 AMIS 渲染器 |
| `AmisCore-DV-Qsav7.js` | `3DB4D6CE78DF66585B753B0D088B2C321C7F8BE172AD17314E9152DC737CE495` | 原 AMIS 表单组件及提交适配 |

来源分别保存在原证据根的 `remote-current/024-AmisToolPanel-DotiYVzI.js`，以及 `temp/GameCowork/codely-source-reuse-20261002/static-dependencies/aicanvas.tuanjie.cn-AmisUIRenderer-E_XEILCf.js`、`aicanvas.tuanjie.cn-AmisCore-DV-Qsav7.js`；当前维护副本和补丁归属见 [Canvas source ledger](../../src/frontend/bundle/codely-canvas/source-ledger.json)。这些组件消费服务器给出的 `ui_config`，没有内置 Provider 凭据表单。AMIS 具有渲染输入框的通用能力，不证明缺失的服务器配置就是 Provider 设置页。

### 可以直接沿用的模型与执行链

[原 API 合同](../../tests/fixtures/codely-generator-api-contract.json) 已记录 45 个原字面量模型定义的完整字段、`build.functionSource`、原始字节范围 / SHA，以及 10 个原数组分组。`xN` 的组合表达式仍保留为来源事实；45 不等于当前可见卡片数。`material` 与 `sprite-atlas` 被原目录表达式过滤，`R5/seedream-layer` 是分层模式替代描述；`kK→OK` 另派生 `frontier_flare/frontier_sunburst`，不能遗漏或混算。

| 边界 | 精确来源 | 直接复用内容 / 所缺内容 |
| --- | --- | --- |
| Quick 模型目录 | `Q:39122 kK`、`39266 eL`、`40236 OK`、`40265 xN` | 原模型 ID、UI mode、参数约束、参考数量、格式与 builder；`descriptor.kind` 的 skybox / prompt / layering 等辅助分类不等于四类 UI mode |
| Quick 参数表单 | `Q:74820 VNe`、`75491 HNe` | 原控件和模型切换；不另建通用 JSON 表单 |
| Quick 生成参数 | `Q:76051 hne` | 将提示词、尺寸、比例、时长、材质、纹理、参考素材等原状态传给 `Z.build(state,refs)`；结果直接作为 payload |
| Quick 实际提交 | `Q:40683 hwe.c` | `POST /sso/generate {kind:model.id,data:payload}`；descriptor 中的 `/editor/task/...` 只是其原接口描述，当前 Quick UI 并不逐项直接调用它 |
| Quick 查询 / 结果 | `Q:40290 X1e`、`40352 ewe`、`40442 wN`、`40588 hwe` | 原轮询、状态和实际输出解析；保持原 task ID，不把超时自动改成新生成 |
| Quick 历史恢复 | `Q:41622 jwe`、`41698 Bwe`、`76524 wF` | 恢复原模型、完整 payload 和图片 / 视频 / 音频 / 模型参考；不能只保留 prompt/model 两项 |
| Canvas 目录与 schema | `C:40135 nD`、`40148 aD`、`40172 oD`、`40196 sD`、`40222 uD`、`30370 YS`、`30391 ZS` | 原选择器和缓存逻辑；`YS`、`ZS` 均 GET `/api/v1/models/:id/schema`，分别读 `data.schema`、`data.ui_config`；真实服务端响应仍未知 |
| Canvas 表单 / 上游输入 | `C:82493 GR`、`67812 sF` | 原节点编辑器、模型菜单、直接入边输出合并与 AMIS 工具窗口 |
| Canvas 参数转换 | `C:30486 oC`、`30602 cC` | `inputParams` 的 name/apiField/source/type/isArray/accept/default/val/required/enabledWhen/valueMapping，以及 constant/conditional/splitImages/mapValue 变换 |
| Canvas 创建 / 轮询 | `C:30683 dC`、`30712 fC`、`30754 mC` | 消费 `taskLifecycle.create.path/method`、poll.path/intervalMs/maxAttempts、status.completed/failed。当前 `fC` 实际比较回执 `status`；不能凭字段名推断它支持任意嵌套状态选择器 |
| Canvas 输出 | `C:30903–30957 mC` | 按 `outputMapping.urls` 路径提取 URL 数组及 `previewImage`，保留 rawOutput；同步或完成回执没有实际 URL 会报错 |

例如 `qwen-image` 的原 builder 在有参考时输出 `mode:"image_to_image"` 与 `images`，没有参考时输出 `mode:"text_to_image"`，并保留 prompt/size。`seedream-lite` 的 builder 经 `Q:39455 Wv` 增加 `imageUrls`；`seedance2` 还处理首尾帧合并、multimodal 视频 / 音频、ratio/resolution/duration/seed；`tripo-p2` 按 imageUrl / prompt 分支，并带 modelVersion、textureVersion、PBR、纹理和面数。不能用一个 `{prompt,model}` 请求声称覆盖它们。

Canvas 的 `mC` 会在没有 schema 时明确抛出“未配置 Schema”，在聚合模型缺少 `target_model_id` 或内联 taskLifecycle/outputMapping 时拒绝执行。原 `AmisToolPanel` 和通用执行器已经存在，可以复用；**原模型 schema、ui_config、上游 Provider 实现和密钥并未因此获得**。

### 拟议最小本地绑定协议（设计记录，尚未实现）

保持原 Quick 与 Canvas 组件和原请求形状，在服务器侧增加明确绑定即可，不新增 Provider 页面。本地绑定属于 GameCowork 自己的配置，不能命名为“恢复的原官方 schema”。

建议绑定以 `(client, originalModelId)` 唯一标识，至少记录以下内容：

| 字段 | 用途 |
| --- | --- |
| `client` | `codely-quick` 或 `codely-canvas`；两客户端模型 ID 命名不自动互换 |
| `originalModelId`、`mode` | 必须与已核实的原目录 / 明确模型源对应；不按显示名称猜测 |
| `providerId`、`providerModel` | 引用已有自有 Provider 的身份和用户明确指定的实际模型；配置中不复制 API Key，浏览器也不接收 Key |
| `enabled`、`revision` | 明确启用及不可变版本；任务冻结绑定版本和 Provider 执行配置版本，变更后不把旧任务发往新地址 |
| `promptPointer`、`parameterMap` | 相对于原 `data` payload 的明确取值 / 转换；未知或不支持的原参数报错，不静默丢弃 |
| `referenceFields` | 明确哪些 payload 路径是图片 / 视频 / 音频 / 模型 URL，以及是单项还是数组；不得遍历提示词里的任意 URL 并自动下载 |
| `localCapabilities` | 只声明该真实绑定已支持的能力与限制，用于本地能力分支；没有价格来源时保持价格未知 |

以原 `qwen-image` 为最小候选时，可声明 `/prompt`、`/size`、`/mode`、`/images` 四组实际字段；它们来自已核验 builder。目标 Provider 的接口格式、模型名称及参考支持仍须用户明确配置并验证，不能默认认为任意现有服务能处理该原模型。

处理原 `/sso/generate` 的建议顺序：

1. 从宿主冻结的工作区及原 `kind` 找到唯一启用绑定；没有映射继续返回明确未配置。不能偷偷选第一个 Provider，不能把图中的 workspaceHash 或 payload URL 当作工程权限。
2. 保存**完整原始 payload 快照**，校验已支持参数。仅解析 `referenceFields` 指定的 URL：必须精确对应已登记的 `/api/codely-generator/local-inputs/<id>/<真实filename>?workspaceKey=<真实scope>`，或已登记产物路由。读取登记的真实身份、作用域、长度与 SHA；不 HTTP 请求该 URL，不接受 file/path，不把外站 URL 代理下载为可信参考。跨作用域不匹配时明确失败，不能自动切换项目。
3. 从实际缓存 bytes 构造绑定声明的 JSON / multipart 请求，由已有自有 Provider 管理鉴权。任务同时冻结原 client/modelId/mode、绑定 revision、原 payload、实际 inputId / artifactId / SHA 对应关系；原模型身份不能被 Provider 的运行模型名覆盖。
4. Provider 的实际结果进入既有有界缓存后，适配为原 Quick 的 `output.data` 字段或 Canvas 的真实 `outputMapping` 消费形状，返回自有媒体 URL。查询继续使用同一真实任务，保留失败 / 未完成语义。不得以 HTTP 200 或空 URL 表示生成完成。
5. 历史与再生成保留原模型和全部参数。持久快照保持提交时原值；返回界面的投影可将已验证媒体更新到当前 origin，并提供经验证的原 `studioModelId`，但不覆盖原始快照或接受冲突的 payload 身份字段。`jwe/Bwe/wF` 继续负责原有表单恢复。相同 payload 的两次主动生成可能是原数量控件发出的独立任务，不能仅凭 payload hash 把它们合并。

Canvas 可继续经原 `GR→oC→cC→mC→dC/fC` 执行，但只向原客户端提供**明确标识的本地绑定 schema**，其路径指向自己的兼容服务，外部 Provider 的地址 / Key 留在后端。真实官方 schema 未取到的模型保留不可用；不能填造原价格、pointsCost 或管理员权限来让表单看起来可用。

付费门控保留来源语义。原 `C1e` / `requiresFrontierSubscription` 不得用假的 `paidType:"paid"/"internal"`、`@unity.cn` 邮箱或积分数绕过。若本地实际绑定不使用官方计费，只能增加明确的本地能力判断分支，依据真实绑定决定可执行项，并显示本地计费未知 / 由所配服务处理；非本地原平台路径仍保留其原门控。

本节没有实现上述绑定、创建页面或调用 Provider。下一阶段验收应由**原组件**发出原 payload，以 loopback 服务核对完整字段、参考真实 bytes、任务查询、结果展示及历史再生成；它只能证明本地显式绑定，不等于官方生成服务已恢复。


## 2026-10-02 补充：本人官方账号登录、刷新与订阅链

用户已新增授权，希望连接本人已有付费 Codely 账号。本节仅拆解可复用流程；没有读取原安装的凭据文件、系统凭据或浏览器 Cookie，没有发起登录 / 授权 / token 交换，也没有调用个人资料、订阅、报价或生成接口。此前“本地模式不可用”描述的是当时实现范围，不构成对这次合法账号接入的禁止。

### 来源与证据强度

- 原生壳仍为实际 `cowork.exe`，SHA `55EA13A9707774DF61A707AC55179E94ABB9690583DE986C528DA056A69B8C3B`。以下 PE 定位是原始字符串 / serde 字段证据，**不是已完成 Rust 函数反编译**。
- 原 Core 解包 `original-core-unpacked/binary/out/index.js`，SHA `B4B146C5CDD166676635AFD0367C15D2E8FB1EC94F436D35657474A6F55B3D4E`。`are` 控制面客户端起点为原始字节 `13268437`。
- 原 CLI 明文载荷 `original-cli-carved/carve_0201_189957669.js`，11,951,226 B，SHA `8DA5876521A7BA6102D28220577FA8E212667BB33EA56A7FE1E954E8580F2E19`；它是原 CLI EXE 中偏移 `189957669` 的已核验片段，仅作为同平台完整 HTTP 调用源码佐证，未运行。
- GUI 身份上下文位于原格式化 `pretty/assets/VscTheme-BExNMG_K.js:187667` 的 `Mx/i4n`；原 GUI 的生成 / Canvas 身份桥位于 `pretty/assets/index-BRxZ4eG7.js:38321 kG` 与 `38404 QG`。原始 SHA 由本报告前述台账绑定。
- 官方公开文档确认同一账号登录、设备授权及组织用量范围；本次只读文档，没有打开或操作个人账户页。[账户权限](https://codely-docs.tuanjie.cn/features-introduction/account-permissions/)、[Cowork 使用指南](https://codely-docs.tuanjie.cn/using-codely/codely-cowork/)、[用量](https://codely-docs.tuanjie.cn/subscription/account-usage/)。

### 1. 当前桌面主流程是设备授权，不是先假定标准 WorkOS 回调

原 `i4n` 点击登录后发 `getControlPlaneSessionInfo {silent:false,useOnboarding}`，处理 `device-flow-started`、`device-flow-failed`、`device-flow-cancelled`；启动读取采用 `silent:true`。`device-flow-started` 包含 verificationUri / verificationUriComplete、userCode、expiresAtMs 与 authFlowAttemptId；后两种事件按 attempt ID 丢弃旧尝试。`sessionUpdate` 再经 `Mx` 要求真实 accessToken、account.id、account.label 才发布会话。

PE 字节 `47260956`、`47261696`、`47262156` 分别出现 `auth/device/initiate`、`auth/device/poll?auth_request_token=`、`auth/device/exchange`；`47167376–47167688` 包含 DeviceInitiateResponse / DevicePollResponse / DeviceExchangeResponse 的 serde 结构。完整 HTTP 形状可由原 CLI 同平台函数核对：

| 步骤 | 实际接口与顺序 | 原始源码定位 / 已知字段 |
| --- | --- | --- |
| 发起设备授权 | `POST https://codely.tuanjie.cn/auth/device/initiate` | CLI `VXu` 字节 `1326317`；JSON `{provider:"unity",client_name:"codely-cli"}`，Content-Type / Accept 为 application/json。这里的 client_name 是 CLI 参数；不能把它直接宣称为桌面参数或 GameCowork 已注册身份 |
| 显示并打开官方授权地址 | 只使用服务返回的 verification_uri_complete / verification_uri 与 user_code | CLI `qXu` 字节 `1327472`；原壳调用系统浏览器。init 回执包含 auth_request_token、user_code、verification_uri、verification_uri_complete、expires_in、interval |
| 等待本人浏览器授权 | `GET /auth/device/poll?auth_request_token=<本次新请求值>` | CLI `HXu` 字节 `1326772`；识别 pending、slow_down、authorized、completed、denied、expired。按返回 interval 调整轮询，不固定高频重试 |
| 交换本次一次性授权结果 | `POST /auth/device/exchange`，JSON `{authorization_code}` | CLI `QXu` 字节 `1327053`；要求 authorized 中存在 authorization_code，交换回执必须有 access_token / expires_in；refresh_token、token_type 等随后保存 |
| 核实用户 | `GET /auth/external/me`，Bearer 本次令牌 | 原壳 auth.rs 字符串及 Core `getCurrentUserId`；CLI `_performFetchUserInfo` 字节 `1337784`。字段包括真实 id / email / username，不从登录按钮成功或 JWT 解码推定身份 |
| 发布身份 | 原生会话成功后发 sessionUpdate / didChangeControlPlaneSessionInfo 给各工作区 | GUI `Mx/i4n` 消费实际账号 ID / label；取消、过期和旧尝试不得覆盖新会话 |

该设备流的已见 CLI 请求不包含 client_secret、client_id 或回调 URI；Unity OAuth 交互由官方返回的验证页承接。**客户端没有拿到官方服务端 Unity OAuth 注册秘密，也不需要通过复制秘密来开始设备流。** 尚须确认官方设备接口是否接受 GameCowork 自报 client_name，以及桌面原请求的具体 client_name / 其它元数据。PE 字符串不足以补齐请求体；需要后续经本人授权的新登录交互确认，不能猜成已验证。

### 2. 原 CLI 还保留 legacy 回调分支，与桌面主设备流分开

CLI `GXu` 字节 `1320914` 建立 `http://localhost:<临时端口>/callback`，生成 PKCE verifier / S256 challenge，再访问 `https://codely.tuanjie.cn/login`。query 带 `state`、`code_challenge`、`code_challenge_method=S256`；原 state 是包含 authFrom、authCallback、codeVerifier、codeChallenge 的 Base64 JSON。回调读取 code / state / error，且原 code 实际按 Base64 JSON 解出 accessToken / access_token 和 refreshToken / refresh_token，**不能误当普通 OAuth authorization code 再发给任意 `/token` 端点**。原实现最长等待 300 秒。

这是被 CLI 作为设备流非终态失败后的 fallback 使用的旧路径。原 state 检查只验证部分字段，verifier 还出现在 state 中；新增宿主不能照搬这些弱点。若将来确需支持该分支，应在自有监听器严格核对本次完整 nonce / state、回调路径与生命周期，保持 verifier 仅在自己的运行时；同时需确认官方对 GameCowork authFrom / redirect 的接受规则。当前不以猜测修改 state 或注册自定义 URI 来宣称接入完成。

另外，原 Core 的 `tha`（字节 `14068901`）构造 `login?response_type=code&client_id=...&state=...&provider=authkit`，state 内标记 `authFrom:"jetbrains-codely"`。其 `WORKOS_CLIENT_ID` 公开配置在字节 `13265967` 附近，但这是另一个宿主辅助入口，不能据此把当前 Cowork 桌面主流程改认成 WorkOS 标准授权码流，也不能把这个客户端标识当成 GameCowork 自己已获注册的标识。

### 3. 刷新、登出和组织选择

原壳在 PE 字节 `47258968` 出现 `auth/refresh`，同时有“Refresh already in flight, awaiting shared result”等单次刷新共享日志。CLI `fl.refreshAccessToken` 字节 `1335778` 给出完整请求：`POST https://codely.tuanjie.cn/auth/refresh`，JSON `{refresh_token}`。成功更新 access_token，若服务返回新的 refresh_token 则轮换；400/401 表示刷新凭据无效，应重新登录。过期计算和 token_type 采用真实响应，不能用永久有效的假 token 代替。

`ContinueAccessToken` / `ContinueRefreshToken` / `ContinueAccountId` / `ContinueAccountLabel` 是原壳源码中的存储键名；本次没有读取其内容。GameCowork 应保存新授权获得的凭据到**自己的**受保护存储，不打开 / 迁移原凭据。登出清理自己的账号、refresh 与派生生成 / Canvas 会话，撤销晚到回执；不能只把名字改为“本地用户”而继续保留官方 token。

原 Core `are.listTeams/listOrgs/switchTeam` 对应 `GET /api/teams`、`GET /api/orgs`、`POST /api/teams/switch {team_id}`。CLI 同平台组织映射读 teams[].team_id / team_name / is_current / has_key、current_team_id、multi_team_enabled。官方文档说明积分按 Unity ID **组织**管理，因此同一人有付费订阅，不代表任意当前组织都有同样权益；应读取并显示实际选定组织。[用量说明](https://codely-docs.tuanjie.cn/subscription/account-usage/)

CLI 还会取 `/api/api-token/cli-api-key?teamId=...`。这属于官方 CLI 推理凭据，不是查看本人订阅所必需的步骤；本次用户另有独立模型 Provider，账号接入不应自动获取 / 切换到该推理通道，也不应覆盖已经指定的自有模型配置。

### 4. 桌面订阅、生成积分、Canvas 身份是三个明确边界

| 领域 | 原接口 / 消费字段 | 必须保持的事实 |
| --- | --- | --- |
| Codely 桌面订阅 | `GET https://codely.tuanjie.cn/api/user/plan?orgId=...`；Core `getUserPlan` 字节 `13273561` | GUI `VscTheme:110806 hV` 消费 planType、planTag、isTeamPlan、isActive、inRenewalPeriod、subscriptionUrl、canUpgradePlan、canManagePlan、canTopup、hasSeat、validTo；五分钟 TTL 不等于可在失败时造 Pro |
| Codely 用量 | `GET /api/user/usage/summary?orgId=...`、`GET /api/user/usage/exhaustion?orgId=...`；Core 字节 `13273842` / `13274141` | remainingPoints、isExhausted、windows 等必须来自本人选定组织的真实回执 |
| Quick / History 账号交换 | 原 host `kG`（38321）按精确 iframe source/origin 发送 `codely:auth`；原客户端 `Q:38565 s1e` 用 Bearer 调 `GET https://ai-generator.tuanjie.cn/api/editor/sso/bootstrap`，成功再 `GET /api/user/me` | `Mn` 带 withCredentials、`_csrf` Cookie 对应的 X-Csrf-Token，以及注入 Bearer。不能将桌面会话的“已登录”直接当作生成站点 bootstrap 已成功 |
| Quick 积分 / 订阅门控 | `GET /api/credit/my-credits`、`GET /api/credit/my-paid-status`；相关代码 `Q:75706/75728` | currentCredits、paidType、productCode 是生成服务自己的真实回执；不能从桌面的 Pro 标签复制 paidType |
| Quick 报价 | `GET /api/credit/cost-preview`；Viggle 专用 `POST /api/credit/viggle-video-quote` | credits / fingerprint 按模型和参数返回；未查到保持未知，本次没有请求这些接口 |
| Canvas 从 Cowork 登录 | 原 host `QG` 将真实 cowork-token 发给目标 Canvas；`C:20445 mg` 的消息分支用 `POST https://aicanvas.tuanjie.cn/api/v1/auth/exchange`、Authorization Bearer Cowork token | `Cm` 要求 code===0，取 data；结果包含 user 与 Canvas tokens。这是交换后的 Canvas 身份，不能拿本地会话 UUID 当官方 JWT |
| Canvas 用户 / 积分 | `GET /api/v1/auth/profile`、`GET /api/v1/auth/points`，Bearer Canvas token | user.role / unity_id / points 等按服务回执；不将 paid 视作 admin，也不把这里的 points 与桌面余额直接合并 |

原 `kG` 在桌面 session 改变时重新发送 auth；`QG` 同样重发 cowork-token，登出时发 logout。因此最小刷新传播是：主 Codely token 更新后，重新完成对应站点 bootstrap / exchange，并使旧请求代次失效，而不是在浏览器里伪造一次“authed”事件。

Canvas 的独立登录入口也有完整客户端定义：`C:19681 Tm` POST `/api/v1/auth/login {username,password}`；`Em` 是注册；`Om` GET `/api/v1/auth/unity/login?redirect_url=<window.origin+path>`，从 data.auth_url 交给浏览器。`pg`（20355）保存服务返回的 access_token / refresh_token；`mg` 从现有 access_token 调 profile，`fg` 只从 JWT exp 估计剩余时间。本次缓存主包没有定位到使用 Canvas refresh_token 调刷新端点的实现，不能擅自把 Codely `/auth/refresh` 用于 Canvas JWT。更适合桌面复用的是已确认的 Cowork-token exchange 路径。

### 5. GameCowork 最小适配与尚缺参数

1. 保留原登录弹窗、设备码 / 过期 / 取消 / sessionUpdate 消费逻辑，新增独立原生账号 broker。用户已经授权连接本人账户，实际登录仍由本人在官方页面完成；不导入原浏览器或原安装会话。
2. 优先按确认的 device initiate → poll → exchange → external/me 链创建新授权。验证返回页面属于官方 Codely / Unity 授权流程，只打开该次服务返回的页面；每次尝试绑定独立 ID、到期和取消状态。新 app 的 client_name 是否被接受仍需官方正常回执，不能把 CLI 的名字或 JetBrains client_id 冒称为 GameCowork 已注册参数。
3. 账号 broker 仅对已确认的官方 HTTPS 域和上述具体路径发送官方凭据；自有 Provider 的 Key 与官方 access/refresh token 分开保存和发送。无须为查看账号去调用付费生成，或让官方登录改写用户指定的文本 / 图片 Provider。
4. 通过真实 external/me + teams / plan / usage 形成账号状态；Quick bootstrap 和 Canvas exchange 各自完成后才显示其真实账号、订阅和余额。优先由原生层保留 token 与必要的自有 Cookie jar，向本机客户端传账户展示数据及短期本地会话句柄；不把原平台的 Set-Cookie 错设到 loopback origin，也不读取旧浏览器 Cookie。若必须保持原 iframe 消息协议，必须绑定精确 origin、具体窗口和会话代次，禁止广播真实凭据。
5. 尚缺：官方对新 client_name 的规则、桌面 init 请求完整元数据、GameCowork redirect/authFrom 的官方接受范围（仅 legacy / 独立 Canvas OAuth 需要）、Canvas 独立 refresh 的服务契约，以及本人当前组织和生成站点的实际付费回执。设备流的已见客户端不要求拿到官方 OAuth client_secret；不存在已证明的“缺少 secret 就只能读原凭据”的结论。
6. 付费状态只能由授权后真实查询更新。官方文档还提示换账号需同时核对 Unity ID 与 Codely 站点账号；应让用户在官方浏览器页面选择正确身份，不能由 GameCowork 猜账号或修改原 Hub 许可。[官方常见问题](https://codely-docs.tuanjie.cn/faq/common-questions/)

本次只读取证不证明该账号已登录 GameCowork、订阅已验证或生成已可用；这些实际状态继续由主流程记录在 RESTORE_STATUS.md。本节没有调用任何真实额度，也没有读取用户提供给主代理的自建 Provider 密钥。

### 6. 交接实施合同：独立主账号 broker（设计，未落代码）

本节记录主流程已确认的最小实施合同。用户随后要求收尾、装配与交接，因此尚未创建 `gamecowork-codely-account.js`，没有对应账号契约测试、Core RPC、Rust vault 或前端接线。本节是设计约束，不是已实现或已验证功能；不新增另一份活动状态文档。

建议模块位置为 `src/core/binary/out/gamecowork-codely-account.js`，导出异步工厂 `createCodelyAccountBroker({root,vault,fetch,now,requestTimeoutMs})`。`vault.seal(Buffer)` / `vault.unseal(Buffer)` 必须由宿主注入，不提供明文默认值；`fetch` 可注入以完成零真实请求的隔离测试。模块实例最小接口如下：

| 接口 | 预期行为 / 数据边界 |
| --- | --- |
| `start()` | 发起一次设备授权，自报 `client_name:"GameCowork"`、`provider:"unity"`；是否被官方接受仍待正常回执。并发调用共享本次 initiate，不能创建多份授权请求 |
| `poll()` | 由宿主显式驱动，遵守 `nextPollAtMs` / 官方 interval。共享同代次在途查询；authorized 只交换一次；准确保留 pending / slow_down / expired / denied / completed 语义 |
| `cancel()` | 取消当前授权尝试，先失效代次再中止请求；晚到 initiate、poll、exchange、profile 或持久化回执不得重新登录 |
| `refresh({orgId,force})` | 按真实令牌期限决定刷新；`force` 可要求更新。共享在途 token 轮换，校验组织属于真实 teams；不同组织读取不能串回执或重复并发刷新 |
| `logout()` | 失效全部代次并清理自己保存的凭据、身份与派生会话，不调用尚未取证的远端撤销接口；本地删除失败必须如实报告 |
| `status()` | 只返回安全的本次授权显示信息和 `session:{user,organizations,currentOrgId,plan,usage}`；未知权益保持空值与可理解错误，不从 JWT / 截图推断 |
| `close()` | 取消在途操作并回收自己持有的资源；已成功加密保存的合法会话可在下次启动恢复，不能因此直接宣称在线验证通过 |

Renderer 可得到 verification URI、user code、过期时间、轮询时刻、受控错误码和上述会话展示字段。`auth_request_token`、`authorization_code`、access / refresh token 永不出现在这些返回值、Core 公共事件、日志或截图。主域仅请求 `https://codely.tuanjie.cn` 的已取证路径；拒绝自动跟随跨域重定向，禁止把官方 token 发送给自有 CPA / 通用 Provider。服务返回的授权网页需验证来源后才可交系统浏览器打开。

存储应位于自己的账户目录，整份令牌记录经 vault 加密后原子提交；持久化成功前不能发布“已保存登录”。Windows 宿主可注入 DPAPI：密文封装版本固定，明文仅经标准输入送入固定受控 helper，不进入命令行 / 错误输出，子进程使用隐藏窗口、超时和自己持有的 PID。文件需拒绝路径穿越、符号链接及意外硬链接，使用同目录临时文件提交；不要为瞬态错误无限重试。解密恢复只标为 restored，必须完成真实账号验证才转 authenticated。

取消 / 登出涉及异步加密写盘时，代次检查必须覆盖请求后、加密后和最终提交前。为防凭据文件被占用导致删除失败后在重启时复活，可先原子落一个**不含凭据**的登出标记，加载时优先遵守；成功的新授权完整提交后再移除。若连标记和删除都无法完成，返回明确存储清理失败，不能声称已经持久登出。该策略仍需实际 Windows 文件占用契约证明，当前未实现。

`refresh` 轮换得到新 refresh token 后应先保存，随后读取个人信息 / teams / 权益；不能因后续 plan 请求失败丢掉已轮换令牌。POST `/auth/refresh` 返回 400 / 401 时进入 requires-login 并清理旧凭据；其它暂时错误不得伪造有效订阅。`currentOrgId` 使用已验证 teams 的 `current_team_id`，或明确请求且确属成员的 orgId；不得默认把列表第一项当当前付费组织。订阅字段采用前述白名单，plan / usage 失败可独立显示未知，不能补一个 Pro 或零余额。

建议后续实施与验收按以下顺序推进：

1. **仅模块与隔离合同**：注入内存 HTTP fixture 和测试专用 AES-GCM vault；测试缺少 vault 拒绝启动、磁盘无明文、密文重开、损坏 / 占用与登出标记、错误内容含秘密时仍不泄漏。HTTP fixture 核对精确路径、方法和请求体，不访问原安装数据或外网。
2. **生命周期合同**：覆盖并发 start / poll / refresh 去重、slow_down、到期 / 拒绝 / 已完成、缺授权码、交换失败、取消后的晚到响应、登出与加密提交竞态、refresh 400 / 401、真实令牌轮换后重启，以及不同 org 的真实 plan / usage 对应关系。
3. **宿主接线**：两份 Core 入口只向受控 RPC 注册 broker；Rust 提供自己的 DPAPI vault 与关闭资源路径。前端保留原设备授权弹窗及 attempt ID / sessionUpdate 逻辑，但只得到安全显示字段；不把原 renderer 获取 token 的接口直接恢复为新的公共凭据出口。
4. **本人授权验收**：由本人打开官方返回页面完成新授权，确认 GameCowork client_name 的接受规则，按 actual external/me / teams / plan / usage 显示身份与订阅。只读订阅不要求调用付费生成；日志与截图必须避开码和凭据。当前收尾轮不执行此步。
5. **分别补 Quick 与 Canvas 交换**：待主账号闭环后，再实现其各自取证的 bootstrap / exchange、Cookie / CSRF 或专属 token 生命周期。响应尚未验证时保留缺口；不得因主账号已付费就填写生成 paidType、报价或 Canvas points。用户指定的 CPA 文本 / 图片模型配置仍独立保留。
