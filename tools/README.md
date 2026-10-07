# 工具导航

在项目根目录运行工具，脚本自行解析项目路径。日常入口保持稳定：

| 文件 | 用途 |
| --- | --- |
| `check-layout.mjs` | 检查目录边界、代码引用和当前文档链接 |
| `verify-local.ps1` | 统一隔离验证，按开关扩展 Agent / Editor gate |
| `build-local.ps1` | 构建宿主和 Agent，暂存、装配、核对 `app/` |
| `build-cli.ps1` | 在统一 temp 中编译正常或 guarded CLI |
| `resources/restore-agent-entry.mjs` | 把维护 CJS 工厂转换为构建入口，不执行原 CLI |
| `resources/extract-agent-text.mjs` | 按来源恢复 Agent 文本资源，非日常构建步骤 |
| `resources/restore-insight.mjs` | 按来源 / 许可证恢复索引资源，非日常构建步骤 |
| `editor/prepare-template-cache.py` | 准备模板测试依赖，联网准备与离线验收分开 |
| `analysis/scan-protocol-surface.mjs` | 静态解析前端 / Core / 宿主契约 |
| `frontend/import-generator.mjs --check` | 核对原 Quick / History 来源、可逆补丁与适配字节 |
| `frontend/verify-canvas-source.mjs` | 核对原 Canvas 资源与依赖闭包 |

`research/` 按 `extraction/`、`probes/`、`migration/` 保存历史提取、协议探针和迁移脚本，见 [研究工具导航](research/README.md)。它们保留当时实现与路径假设，复用前审查输入、输出和外部副作用，不加入默认门禁。一次性计划、日志、截图、备份、测试工程和候选包统一放入 `codelyreversebackup/work/` 的独立任务目录。

本目录 `package.json` / `package-lock.json` 属于历史 Prettier 工具，不是产品依赖。根目录 npm scripts 只代理日常命令。
