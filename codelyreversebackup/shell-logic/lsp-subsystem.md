# 原版壳 LSP 子系统还原（T1.4）

> 来源: cowork.exe 模块字符串簇 `src\lsp\{manager,server_instance,transport,types,config,hint,path,reload,client}.rs`（9 模块）+ 前端消息交叉。
> 方法: 偏移窗口分析（tools/analyze-shell.py kw/modules），原始窗口在 temp/GameCowork/shell-logic/analysis/。
> 面向: 在 GameCowork 补齐 LSP 宿主生命周期（HANDOFF P1「LSP 有前端与 ACP 转发，服务安装/启动/通信生命周期缺」）。

## 1. 架构总览

原版壳自己实现了完整 LSP 宿主（日志自称 **"Rust LSP server"** 管理），不依赖 Node 侧：

```
前端 lsp/* 消息 ──► 壳 lsp::manager（每 workspace × 每 server 一实例）
                        │  拉起子进程 (command + args + cwd)
                        ▼
                  LSP server 进程 (stdio, Content-Length 帧)
                        ▲  stderr 单独转发 ([][stderr] ...)
壳另持 hub 客户端 (src\lsp\client.rs —— 名字有误导, 实际是许可 hub stdio 客户端, 见 §5)
```

## 2. 内置 server 配置表（lsp\config.rs，原文完整还原）

| languageId | server 命令 | 安装方式 | 提示 URL |
|---|---|---|---|
| `python` | `basedpyright` | `npm install -g basedpyright` | https://github.com/DetachHead/basedpyright |
| `csharp` | `codely-unity-lsp-server` | 需 Node.js (https://nodejs.org/en/download) + dotnet 8 (https://dotnet.microsoft.com/en-us/download/dotnet/8.0) | — |
| `typescript` | `vtsls` | `npm install -g @vtsls/language-server` | https://github.com/yioneko/vtsls |

**扩展可注入更多 server**：壳读取扩展目录中的 `gemini-extension.json`（manifest），失败链：`failed to read extension directory` → `failed to read/inspect/parse extension manifest`；manifest 里有 `Upstream / source` 字段。扩展安装/卸载后触发 manager reload（`Skip LSP manager reload after extension mutation: app state unavailable`）。

## 3. 命令解析（lsp\path.rs）

`where.exe` 优先解析，再搜固定 PATH 候选目录：
`%APPDATA%\npm`、`%LOCALAPPDATA%\Programs\nodejs`、`ProgramFiles`、`ProgramFiles(x86)`、`%USERPROFILE%\.dotnet\tools`、`~\.cargo\bin`、`~\.omnisharp`、`...\Microsoft\WinGetPackages`。
扩展提供的 server 可执行后缀：`exe / cmd / bat / ps1`。
非法二进制名拒绝：`invalid binary name: {x}`；解析成功日志 `resolved command: {name} -> {path}`。

## 4. 生命周期（manager.rs / server_instance.rs）

1. **启动**: `Starting Rust LSP server {name} for {workspace}` → 无配置则 `No configured Rust LSP server found for {lang}`；`Spawning ... with command= args= cwd=` → `spawned successfully`；任一管道缺失即失败（`did not expose stdin/stdout/stderr`）。
2. **握手**: `Initializing ...` → 发 `initialize`（参数含 `workspaceFolders`、`initializationOptions`、`dynamicRegistration`；路径转 file URI 失败有专错）→ 校验 `capabilities.definitionProvider`（日志 `responded to initialize; capabilities.definitionProvider=`）→ 发 `initialized` notification → `is ready`。**启动超时 120s**。
3. **状态机**: `is starting / is stopping / is not running / is not started / is already running`；锁中毒文案 `server state lock poisoned`、`server error lock poisoned`。
4. **崩溃恢复**: 计数上限，超过则放弃：`LSP server '{name}' exceeded max crash recovery attempts ({n})`。
5. **停止**: 发 `shutdown` + `exit` → `LSP client stopped`。
6. **文档同步**: `Opening {path} in Rust LSP server {name} as {uri}` → `textDocument/didOpen`（已打开则 `Skipping didOpen for ... (already open in ...)`）；壳侧还有 `Skipping didOpen sync for {x}` / `Failed to sync document with Rust LSP manager for {x}`。
7. **请求超时**: `LSP request {method} timed out after {n}s on {server}`。
8. **重载**: `lsp/reload.rs` 在扩展变更后重建 manager；工作区/应用状态不可用时跳过（见上）。

## 5. 传输层（transport.rs）——标准 LSP over stdio

- 帧头 `Content-Length: `；解析错误链：`unexpected EOF before LSP header terminator`、`duplicate Content-Length header`、`invalid Content-Length header`、`missing Content-Length header`、`failed to read LSP message body`、`LSP message body was not valid UTF-8`；写失败 `failed to write LSP header/body`。
- 通知/进度转发：`$/progress`、`window/logMessage`；stderr 原样转发 `[][stderr] {line}`。

## 6. 前端消息面（messages\lsp.rs，全部 12 条）

| 前端消息 | 参数字段 | 转发为 LSP 方法 | 返回线索 |
|---|---|---|---|
| `lsp/setEnabled` | `enabled`, `workspace_dir` | 停止并重建 manager（`Failed to shutdown LSP manager during toggle`） | — |
| `lsp/isServerInstalled` | `extensionName` | 扩展检查：`extension check: file= server= installed=`；`server check: file= binary=`；`installed=false` | bool |
| `lsp/hover` | `filePath, line, char, session` | `textDocument/hover` | — |
| `lsp/documentSymbol` | 同上 | `textDocument/documentSymbol` | `symbols` |
| `lsp/workspaceSymbol` | `query` | `workspace/symbol` | — |
| `lsp/goToDefinition` | — | `textDocument/definition` | `locations` |
| `lsp/findReferences` | — | `textDocument/references` | `locations` |
| `lsp/goToImplementation` | — | `textDocument/implementation` | — |
| `lsp/prepareCallHierarchy` | — | `textDocument/prepareCallHierarchy` | `items` |
| `lsp/incomingCalls` | — | `callHierarchy/incomingCalls` | — |
| `lsp/outgoingCalls` | — | `callHierarchy/outgoingCalls` | — |
| `lsp/serverStartFailed` | — | 事件（通知前端启动失败） | — |

错误形态（内层 `status`）: `lsp_error`、`unsupported_file`（`Rust LSP manager does not support {lang}`）、`raw response for {x}`、`Rust LSP manager is not available`、`LSP manager does not have any available servers`、`Unsupported LSP message type: {x}`、`Cannot resolve relative {x} path without initialized workspace`。

预检提示（hint.rs）: `resolve_file_preview_lsp_status: path= language= extension_installed= server_installed= supported=` —— 文件预览打开前判定是否可用 LSP，与前端 `shell/checkAndSuggestLspInstall` / `shell/showLspServerInstallToast` 呼应。

## 7. 对 GameCowork 的复刻要点

- 原 AGENTS 规则"按已打开工作区的根与代际隔离文档/进程"与原版一致：manager 是 per-workspace 的；GameCowork 的 `lsp-csharp` 冻结 runtime 可直接套此生命周期壳（120s 超时、崩溃恢复上限、shutdown→exit、stderr 转发、`Content-Length` 解析错误链全部照抄文案与顺序即可对齐前端 toast）。
- `lsp/isServerInstalled` 的参数是 `extensionName`（扩展名），不是 server 名——检查的是"扩展目录里声明了该 server 的扩展 + 二进制存在"两层。
- 安装检测搜索目录清单（§3）可直接复用为默认 PATH 扩展。
- GameCowork 差异点：原版 csharp server 名为 `codely-unity-lsp-server`（Node+dotnet8 双依赖）；GameCowork 已有自己的 `lsp-csharp`（.NET SDK 10），无需兼容其命名，但**前端 toast/install 引导文案的触发条件**（`resolve_file_preview_lsp_status` 四元组）值得照抄。
