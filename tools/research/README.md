# 研究脚本分类

本目录保存恢复阶段的提取器和探针，按研究对象分类。2026-10-06 的移动只改变文件位置与描述性名称，43 个历史脚本的内容和 SHA-256 均保持不变；完整旧新路径见 [迁移清单](../../codelyreversebackup/history/organization/2026-10-06-archive-migrations.json)。

| 目录或文件 | 内容与边界 |
| --- | --- |
| `extraction/binaries/` | PE / Bun / pkg 的字节提取、标记定位、解包和 Rust 壳字符串分析 |
| `extraction/frontend/` | bundle 美化、图标、i18n、invoke 与消息类型提取 |
| `extraction/catalogs/` | Git / WebRTC / RPC / i18n 与消息层目录的历史批量提取 |
| `probes/auth/` | 登录、账号、token 字段和门控的静态代码上下文探针 |
| `probes/core/` | Core 消息、stdio、服务参数与工作区路径探针；`core-protocol-launch-probe.py` 会启动进程 |
| `probes/frontend/` | 路由、Redux、Hub 传输、欢迎页及加载门控的静态探针 |
| `migration/` | 早期批量重命名和隔离脚本，会写文件，保留作历史证据 |
| [extract-unity-hub-reference.mjs](extract-unity-hub-reference.mjs) | 被现有契约导入的 Unity Hub 只读字节核对入口，路径保持稳定 |
| [pkg-prelude.js](pkg-prelude.js) | 提取的 pkg 原始 prelude 片段，路径与字节保持稳定，仅供只读对照 |

历史脚本仍保留当时的 `restored/`、硬编码输入输出和相对依赖假设，不是经过本轮功能验收的执行入口。部分脚本会写研究库、启动 Core 或修改 bundle；复用前必须重新审查输入、输出、进程及账号边界。本次未执行这些历史脚本，也未执行原软件。

新研究的临时脚本、报告中间稿和原始输出按用户要求进入 `codelyreversebackup/work/2026-10-06-organization/`，不进入 Git。日常构建、验证与来源恢复入口见 [工具导航](../README.md)。
