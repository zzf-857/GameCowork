# 新旧版本差分（T4/VERSION-DIFF）

> 对比对象: `cowork.exe`（**2.1.3-canary.2**）vs `cowork-old-1790684865080.exe`（**2.1.3-canary.1**）；
> `codely-binary.exe` vs `codely-binary-old-1790684865080.exe`（两者自报 2.1.0）。
> 方法: 全量 ASCII 字符串集合差分 + 文本相似度过滤（伪串剔除）。原始清单见本目录 4 个 txt（temp 全量 TSV 在 temp/GameCowork/diff-extract/）。

## 1. 总量

| | 新版唯一串 | 旧版唯一串 | 备注 |
|---|---|---|---|
| 壳 | 3,153 | 3,129 | 版本串/资源哈希之外有实质功能增删 |
| core | 6,181 | 1,580 | **绝大多数是压缩载荷伪串**（见 §3） |

## 2. 壳 canary.1 → canary.2 增量（按域）

### 新增（有实证）
- **LSP 前端消息族**: `lsp/findReferences、goToDefinition、goToImplementation、incomingCalls、outgoingCalls、prepareCallHierarchy、documentSymbol、workspaceSymbol、hover、setEnabled、isServerInstalled、serverStartFailed`（多数在 canary.1 已存在，此版补全调用面）；`src\messages\lsp.rs` 与 `CorePoolsrc\lsp\types.rs` 在两版都有——**LSP 子系统非 canary.2 首创，是扩展**。内置 server 表（basedpyright / codely-unity-lsp-server / vtsls 安装提示 URL）为新版串。
- **editor 控制族**: `editor/recompile`、`editor/setEmbedMode`（+`cowork_embed_mode_changed`）、`editor/themeChanged`、`editor/getSidechat`（响应 data/status/content）——Unity 嵌入/重编译/主题联动在该版补齐。
- **pet 文件预览族**: `pet/showFilePreview(Path)`、`pet/hideFilePreview`、`pet/menuBlur`、`pet/openSettings`（参数 sessionId）、`pet/ready`、`pet/getPendingQueue` + 新 pet 资源 `assets/pet-*.js/css`。
- **壳 HTTP 新端点**: `/api/tauri/file-explorer`（+全套 `icons/unity-file-icons/{light,dark}/...@32.png` 文件类型图标——新文件浏览器能力）、`/api/tauri/unity-insight/vfs-path-search`（**Insight VFS 路径搜索的壳侧入口**）、`/api/tauri/update-traffic-lights`（窗口交通灯/标题钮状态）。
- **远程账号桥校验**: `bridged remote sessionUpdate remote_account= != local_account=`（远程会话的账号一致性检查）。
- 依赖更新: `tauri-plugin-updater 2.10.0`（更新器插件化）；遥测事件族（`codely_panel_opened/closed、welcome_*、ui_button_clicked、installProgress`）。

### 移除/变更（canary.1 独有）
- 旧资源哈希（init-*.js、pet-*.css 旧指纹）；`windows-core 0.58.0 / windows 0.61.3 / socket2 0.6.1` 等依赖版本更替。
- `tjhub/statusUpdate`、`shell/themeChanged`、`editor/themeChanged`、`config/updateSharedConfig` 的合并串在两版间重排（功能保留、字面量相邻关系变化）。
- 无整域删除。

### 结论
canary.1 → canary.2 是**小版本功能补充**: LSP 调用面补全、Unity 嵌入控制（recompile/setEmbedMode）、pet 文件预览、壳文件浏览器、Insight VFS 路径搜索入口。壳的 68 模块架构（LSP9/tunnel/frp/mobile/pet 等）在 canary.1 已定型。

## 3. core 新旧差分（重要: 字符串级不可见）

- **载荷尺寸: 15,787,839 B → 32,586,083 B（翻倍 +16.8MB）**，pkg 头 PAYLOAD_SIZE 直接可证；总 EXE 53.3MB → 70.2MB。
- 两者自报版本均 `'version': '2.1.0'`——**版本号没动，内容翻倍**：新 core 打包了大批新增功能/依赖，但由于 pkg 压缩载荷，字符串差分无法看到具体内容（6,181 条"新增串"里真实文本占比极低）。
- 已知侧证（来自本轮 T1/T3 对新 core 生态的分析）: 新增面大概率包含 MCP/子代理/会话域扩展（core-new-only 中 `mcp` 命中 5 处、旧版 `lsp` 字样移除 4 处——旧 LSP 桩被移除，LSP 宿主责任移交给壳）。
- **对 GameCowork 的含义**: core 的 1168 方法注册表（api/core-rpc-registry.txt）是对新版提取的；若要对齐 canary.1 时代的 core，体积差异提示约一半功能是后期并入。恢复工程应以新版 core 语义为准（与现有 restored/core 一致）。

## 4. 复刻优先级建议

1. **可直接跟进的增量**（canary.2 新能力、GameCowork 尚缺）: `editor/setEmbedMode+recompile`（编辑器嵌入模式控制）、`/api/tauri/unity-insight/vfs-path-search`（与已还原的 cowork.vfs_* 消息配套）、文件浏览器图标体系。
2. **已对齐无需动作**: LSP 壳宿主（shell-logic/lsp-subsystem.md 已按 canary.2 全量还原）、pet 基础、更新器。
3. **core 载荷翻倍**无法用字符串级手段还原内容；如需深挖需 pkg 解包（tools/pkg-unpack.py 已有，可对新 core 单独跑）——列为后续可选任务。
