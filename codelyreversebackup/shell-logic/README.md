# shell-logic/ — cowork.exe（Rust 壳）逻辑还原

> 完成日期: 2026-10-01 · 方法: 偏移窗口分析（REVERSE-PLAN §2 M1-M3），原始终证在 `raw/`。

## 成品文档

| 文件 | 内容 | 对应任务 |
|---|---|---|
| [commands.md](commands.md) | 91 条 shell 独有 invoke 消息逐条结论（✅参数级 / △名称确认 / ∅通用转发已验证） | T1.2 |
| [lsp-subsystem.md](lsp-subsystem.md) | LSP 子系统 9 模块：内置 server 表、生命周期、传输、前端 12 条消息映射 | T1.4 |
| [tunnel-remote.md](tunnel-remote.md) | frp 客户端加密协议、隧道 REST 三端点、机器注册表字段、SSE-Bridge、mobile home、推送队列 | T1.5 |
| [tjhub-api.md](tjhub-api.md) | tjhub 三条腿（Hub stdio JSON-RPC 方法表 / 云控制面 URL 组 / 安装器）、登录与 Unity token 交换、agent TOML 模板 | T1.3 |
| [unity-shell-side.md](unity-shell-side.md) | Unity 命名管道 IPC、VFS 消息（cowork.vfs_*）、远程窗口桥 token 路由、insight serve 锁与 Restart Manager 回收、TCP IPC、IDE 协议消息表 | T1.6 |
| [desktop-shell.md](desktop-shell.md) | 多窗口会话/SSE 缓冲、单实例锁、托盘徽标、更新状态机、WinRT Toast、CoreHealth | T1.7 |

## modules/（68 个模块的原始窗口转储）

每个文件 = 该 `src\*.rs` 模块在二进制中的全部出现位置 ±2048B 窗口内的字符串簇与片段（机器生成，未人工清洗）。重要模块的已清洗结论在上表成品文档中。清单来源 `raw/seeds-modules.txt`。

## raw/（原始终证）

- `commands-raw.json` — 91 条命令 × 最多 12 窗口的片段集（commands.md 的原始输入）
- `commands-distilled.tsv` — 蒸馏表（message/occurrences/碎片）
- `kw-windows/` — 关键词窗口（LSP 配置表原文、frp/remote-workspaces、basedpyright 等）
- `urls.txt` — 全部 URL 与绝对路径片段（103 URL + 69 路径）
- `seeds-modules.txt` — 68 模块种子清单

## 关键结论速览（详见各文档）

1. 壳 68 模块完整清单（LSP 9、messages 14、unity 5、app 13…），主通道 SSE + TCP 备用 + 匿名管道（Hub）+ 命名管道（Unity）。
2. Hub 许可客户端 = stdio JSON-RPC 子进程（`HUB_PIPE_HANDLE`/`HUB_COWORK_TOKEN`），方法表 8 条已还原。
3. 隧道 = 自实现 frp（timestamp/privilege_key/proxy_name + IV 帧加密 + run_id 回执 + heartbeat），REST `/api/v1/frp/{connect,disconnect,heartbeat,machines,remote-workspaces}`。
4. `shell/*` 窗口管理 30+ 条命令在原版壳字符串级不存在 → 通用转发，无需逐条实现。
5. 登录 = 设备码 + Unity token 交换（`auth/exchange-with-unity-token`），token 键沿用 `Continue*`。
6. LSP 内置三 server（basedpyright / codely-unity-lsp-server / vtsls）+ 扩展 `gemini-extension.json` 注入。
