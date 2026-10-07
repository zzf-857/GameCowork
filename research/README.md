# 历史工程研究资料

这些文件用于理解恢复来源，不参与日常构建：

| 位置 | 内容 |
| --- | --- |
| `tauri-shell/` | 早期 Tauri 骨架、ACL / 命令面分析与图标 |
| `hub/` | 原 Hub 成分与许可链的静态鉴定 |
| [frontend/](frontend/README.md) | 从 bundle 推断的依赖，不是可复现的构建清单 |
| [protocols/](protocols/README.md) | 官方账号、授权与订阅协议的静态来源研究 |

历史文件内容和相对路径假设保留，不将其中的启动 / 构建命令作为当前操作指南。实际入口见 [架构说明](../docs/architecture/overview.md)。原版研究库仍在 [codelyreversebackup/](../codelyreversebackup/README.md)，原始安装镜像仍在 `original/`，按项目规范只读使用。

2026-10-06 归类保留被移动文件的原字节，旧新路径与逐件 SHA-256 见 [归档迁移清单](../codelyreversebackup/history/organization/2026-10-06-archive-migrations.json)。用户指定的本轮临时脚本、日志与研究中间产物统一进入 `codelyreversebackup/work/2026-10-06-organization/`，不进入源码或 Git。
