# 工具导航

在项目根目录运行工具，脚本自行解析项目路径。日常入口保持稳定：

| 文件 | 用途 |
| --- | --- |
| `check-layout.mjs` | 检查目录边界、代码引用和当前文档链接 |
| `verify-local.ps1` | 统一隔离验证，按开关扩展 Agent / Editor gate |
| `build-local.ps1` | 构建宿主和 Agent，暂存、装配、核对 `app/` |
| `build-cli.ps1` | 在统一 temp 中编译正常或 guarded CLI |
| `restore-cli-entry.mjs` | 把维护 CJS 工厂转换为构建入口，不执行原 CLI |
| `extract-cli-text-assets.mjs` | 按来源恢复 Agent 文本资源，非日常构建步骤 |
| `restore-insight-resources.mjs` | 按来源 / 许可证恢复索引资源，非日常构建步骤 |
| `prepare-template-test-cache.py` | 准备模板测试依赖，联网准备与离线验收分开 |
| `scan-host-contracts.mjs` | 静态解析前端 / Core / 宿主契约 |

`research/` 保存早期提取、美化、重命名和协议探针。它们保留当时实现与路径假设，仅供研究查阅，不是经过此次迁移验证的执行入口；部分脚本会写文件或启动进程，不能加入默认验证或对当前源码批量重跑。复用前审查输入、输出和外部副作用，一次性产物统一放入 temp。

本目录 `package.json` / `package-lock.json` 属于历史 Prettier 工具，不是产品依赖。根目录 npm scripts 只代理日常命令。
