# Rust 宿主维护导航

`src/main.rs` 是 wry / tao / axum 的装配入口。功能实现和所属 Rust 单测按领域放置：

| 目录 | 内容 |
| --- | --- |
| `src/workspace/` | 工作区注册、文件访问、写入和事件 |
| `src/editor/` | Editor 发现、安装缓存、模板、许可边界、桥与串流布局 |
| `src/developer_tools/` | Git、终端、C# LSP 和 Unity Insight |
| `src/assets/` | 生成资产导出、Quick / History HTTP 和 Canvas 本地接口 |
| `src/account/` | Codely 账号的宿主 vault 与链接支持 |
| `src/platform/` | 原生窗口、单实例、防休眠与子进程所有权 |
| `src/core/` | stdio 消息传输 |

`main.rs` 的 `#[path]` 保持已有 `crate::workspaces` 等内部模块名，领域迁移不改变运行接口。原生窗口脚本与其 Rust 加载器同处 `platform/`。新增逻辑进入所属领域，入口继续负责服务装配。

测试 / 构建使用冻结 Cargo.lock 和离线依赖；开发构建缓存保留 `target/`，不作为日常运行安装。其余临时工程、日志与候选包统一进入 `codelyreversebackup/work/`。详见 [开发指南](../../docs/development/guide.md)。
