# Core 维护导航

实际入口是 `binary/out/index.js`，对应可读入口是 `binary/out/index.beautified.js`。两份入口成套修改，真实函数契约和受控 Core / Agent 验证检查接线。恢复的 `binary/`、`core/`、worker 与 tokenizer 保留来源布局。

自有模块位于 `binary/out/modules/`：

| 目录 | 职责与入口 |
| --- | --- |
| `account/` | `broker.js`：官方授权、身份和私有凭据能力；`official-model-menu.js`：原config-v3模型元数据的安全投影；`official-llm.js`：内置目录与受限官方编程代理 |
| `generation/` | `service.js`：任务、缓存与执行；`codely-api.js`：原 Quick / History 兼容；官方执行、结果、对账及错误详情各有独立文件 |
| `generation/models/` | CPA 与官方图片、视频 / 3D、音频 / 文字规格；`official-catalog.js` 汇总目录 |
| `media/` | 音频、图片、JPEG、HDR、MP4/WebM元数据与模型格式的有界检查 |
| `providers/` | 目录读取、稳定模型身份、注册表和 DPAPI vault |
| `custom/` | commands、agents、skills 等自定义能力的本地存储与校验 |

模块通过明确的相对 CommonJS 引用加载；装配工具递归复制整个 `binary/out/`。新增模块进入对应领域目录，不在入口旁继续平铺，也不保留旧路径转发文件。公开 RPC、运行数据目录和协议名不随源码文件名改变。

官方聊天菜单沿用原内置分组和账号配置，打开时只刷新元数据；会话选用官方模型后才取得Core私有推理凭据。禁用条目和合法空目录不由本地套餐标签解锁，自定义Provider配置独立保留。

功能范围与限制见 [活动状态](../../RESTORE_STATUS.md)，目录迁移见 [架构说明](../../docs/architecture/overview.md#旧目录迁移表)。
