# 资料分类迁移记录

[2026-10-06-archive-migrations.json](2026-10-06-archive-migrations.json) 记录 47 个文件的原位置、新位置、字节长度及移动前后的 SHA-256，全部字节一致。范围为两篇独立研究输入、一份 Tauri invoke 原始清单、一份历史研究计划和 43 个历史脚本。

| 分类 | 处理 |
| --- | --- |
| 独立协议 / 前端依赖研究 | 分别进入 `research/protocols/` 与 `research/frontend/` |
| 历史计划 | 按日期与主题进入 `codelyreversebackup/history/plans/` |
| Tauri invoke 原始输出 | 进入 `research/tauri-shell/evidence/invoke-targets.txt`，避免 `.md.txt` 双扩展名 |
| 研究脚本 | 按 extraction / probes / migration 及研究对象分组；编号式名称改为描述性名称 |
| 原始桥、协议 HTML、提取 manifest、字符串、模块窗口与版本差分 | 保留已有按功能分类的位置与原字节，不移动冻结片段 |
| Hub 字节核对入口、pkg prelude 与两篇历史导读 | 保持稳定路径；历史导读仅修复归类后的导航目标 |

迁移清单只用于追踪文件分类，不记录功能完成度。移动后历史文档内的旧路径按旧位置和迁移表理解；现代 README 提供可点击的当前路径。没有删除资料、运行原程序、改写 app 或创建第二份源码。

用户提供的根 `sess_b086b35f-2dac-487d-918e-1a2c2bf1b5da.zcode-session` 和 `.json` 日志路径在本次盘点时不存在；实际记录位于 Zcode 自身目录，由研究代理只读核查，不复制敏感原会话入库。可分享的研究结论统一写回项目状态；本轮临时产物进入被 Git 忽略的 `codelyreversebackup/work/2026-10-06-organization/`。
