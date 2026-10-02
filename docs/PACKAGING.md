# PACKAGING — GameCowork 当前装配规则与历史提取记录

## 当前装配规则（2026-10-01）

实际主壳入口是 [shell/Cargo.toml](../src/shell/Cargo.toml) 与 [shell/src/main.rs](../src/shell/src/main.rs)：wry/tao 承载 WebView2，axum 提供本地 HTTP/SSE，自己的 Node runtime 运行恢复的 Core。`research/tauri-shell/` 是历史骨架；`cargo tauri build`、原版安装器、carve bundle 直接编译和原版二进制改名都不是当前构建入口。当前脚本更新已有 `app/` 程序目录，不生成 NSIS 安装器。

从项目根目录执行：

```powershell
cd F:\AI\AgentMake\CyberSoftwares\GameCowork
.\tools\verify-local.ps1 -RealCore -Chat -Editor
.\tools\build-local.ps1
```

[build-local.ps1](../tools/build-local.ps1) 默认构建 Release，先在 `F:\AI\AgentMake\temp\GameCowork\build\<唯一目录>` 准备资源，再更新 `app/`。以下是装配规则，不能据此推定已有 app 已包含最新源码；实际装配与 packaged 验收结果以 [RESTORE_STATUS.md](../RESTORE_STATUS.md) 顶部为准。

| 正式资源 | 维护源码或运行来源 | 装配要求 |
| --- | --- | --- |
| `app/GameCowork.exe` | `src/shell/` 的 Rust 构建产物 | 使用当前主壳；不能替换成历史 Tauri 骨架或原版主程序 |
| `app/frontend/` | `src/frontend/bundle/` | 完整复制实际桌面/GUI 入口、两代业务 chunk、预览页面及独有帧模块；这是维护源码输入 |
| `app/frontend/codely-generator/`、`app/frontend/codely-canvas/` | 同名维护输入目录 | 原 Quick / History 与 ReactFlow 完整客户端资源、原字体与懒加载依赖、来源ledger及本地适配器一并复制；构建前执行Quick精确补丁核对与Canvas静态依赖检查，不能仅复制主JS |
| `app/core/` | `src/core/binary/out/` | 包含实际 `index.js`、本地辅助模块、资源与 `build/Release/node_sqlite3.node`；不遗漏 `gamecowork-custom.js` |
| `app/core/gamecowork-runtime.exe` | 本应用保留的 Node runtime | 当前 Core 和本地索引 worker 的运行时；不再要求历史 `gamecowork-binary.exe` 重打流程 |
| `app/cli/` | `src/agent/cli-main.beautified.js` 经自有工厂入口恢复和 Bun 编译 | 正常 `gamecowork.exe`、`resources/` 与 `cli-package-manifest.json` 成套装配 |
| `app/unity-insight/` | `src/unity-insight/` | 必须复制 `package.json`、`bundle/`、`resources/`，包含 `bundle/gamecowork-worker-entry.mjs` 及实际解析器资源；不能依赖开发源码目录兜底 |
| `app/lsp-csharp/` | `vendor/csharp-lsp/` 的冻结公开 runtime 与来源清单 | 第六阶段装配规则：完整复制 runtime（含 `.store`）、ledger/pin、LICENSE/README，构建前与暂存后核对 SHA；不能只复制服务 EXE |
| `app/editor-bridge/` | `src/editor-bridge/` | 装入自有 Editor-only UPM 包 `cn.gamecowork.bridge`，供用户在明确选定工程主动安装 |
| `app/package-manifest.json` | 装配脚本生成 | 记录主壳类型、配置、源码提交及 dirty 标记、逐资源 SHA256/大小；更新后逐文件核对 |

`build-local.ps1` 会调用 [build-cli.ps1](../tools/build-cli.ps1)，或使用明确传入的 `-CliPackageDirectory`。产品 CLI 必须显式声明布尔值 `testGuardIncluded=false`，并同时满足维护源码 SHA、由 `restore-cli-entry.mjs` 重新生成的正常工厂入口 SHA、EXE SHA 与其 manifest 一致。缺字段、guard 包、篡改入口或不同源码版本都会拒绝装配。`build-cli.ps1 -GuardFile ...` 只产生统一 temp 内的隔离测试包；不能把测试 guard 拼入正式产品，也不能把原版 CLI 或 process-killer 改名充数。

本地索引由主壳使用自己的 Node runtime 启动独立 worker，读取授权工程并把 SQLite/指标状态留在自己的索引目录，详见 [cli-unity-insight/README.md](../src/unity-insight/README.md)。正式包必须命中 `app/unity-insight/`；`shell` 中指向恢复源码目录的 fallback 只服务开发验证，不是安装包依赖。

C# LSP 资源与 SDK 运行边界见 [lsp-csharp/README.md](../vendor/csharp-lsp/README.md)。本机需要 .NET 10 SDK，SDK 不随 app 分发；服务只在显式启用后启动，缓存归本应用数据，原始工程元数据保持只读，不自动生成或联网还原。SDK fixture 与 Unity 实际生成的经典工程必须分别验收，资源 SHA 通过不等于语义/GUI 或最终包已通过。

编辑器桥使用工程自己的 loopback 连接信息和身份校验。只有用户触发选定工程的安装才修改其 `Packages/manifest.json`，增加自己的本地 UPM 依赖并保留可撤销原字节备份；不自动安装、升级或复用原版桥。桥、前端帧页及帧控制模块必须随同一次装配更新。支持范围与重载/多工程验收见状态文档和 [editor-bridge/README.md](../src/editor-bridge/README.md)，不能仅凭连接成功宣称所有编辑器窗口串流完成。

本地新项目模板来自明确选中的已安装 Unity/Tuanjie 编辑器 `Editor/Data/Resources/PackageManager/ProjectTemplates/*.tgz`；依据实际包身份和 SHA 复制 Assets、Packages、ProjectSettings，保护既有目标，不复制 Library/Temp。它们不是 app 内伪造模板或在线市场下载。模板原始依赖由编辑器首次打开时解析，复制完成不代表依赖已恢复；编辑器许可仍由编辑器自己验证，本地 GameCowork 身份不能代替它。

普通运行的注册与偏好在 `%LOCALAPPDATA%\GameCowork`，Core/CLI 状态分别在 `%USERPROFILE%\.gamecowork`、`%USERPROFILE%\.gamecowork-cli`。隔离验证必须设置 `GAMECOWORK_DATA_DIR`，主壳据此使用其下的 `core-state`、`cli-state`、`insight` 和工作区目录，并向子进程设置相应数据变量；不要改 HOME/USERPROFILE，也不要只设置 CONTINUE_GLOBAL_DIR。装配只更新程序资源，保留用户状态及旧 workspace.txt；若目标 app 正在运行，脚本拒绝替换并报告 staging 位置，不结束用户窗口。

打包后再用支持 `--packaged` 的实际用户流程验证 `app/GameCowork.exe`、`app/core`、`app/frontend`、桥与索引资源。浏览器验证可显式使用同源码 SHA 的 guarded Agent 和 loopback 假 Provider，同时核对正式包内 Agent 为正常入口及真实 EXE hash；不能用源码资源 UI 门禁替代已装配包门禁。Chromium HTTP 验收不等于原生 Wry 几何或公网能力。

本地模式在业务初始化处阻止原服务、遥测和未配置市场/媒体服务；`.invalid` 域名不是隔离保证，更不能只把它改成新域名就当作自建后端完成。原安装目录和 original/ 镜像保持只读，真实账号与 Provider 不进入自动装配验证。

---

## 历史提取与装配方案（不可执行参考）

以下表格、卡死结论和命令保留 2026-09-30 提取阶段上下文，不描述当前产物，不能用于构建、安装或验证。涉及原版改名复用的旧设想已经弃用；只执行文首当前脚本。

> 目标：打包出的 GameCowork 安装到本机后，**除图标外，进程名、标识符、数据目录、
> 更新源、桥接包、安装器键值等一切机器可观测面与已装 Codely 完全不同**；
> 对本工程的任何后续改动都波及不到已安装的原版软件。
>
> 隔离分两层：①源码层（本仓库内已完成，见下表）②装配层（打包时必须遵守的改名清单）。

### 历史标识对照表（不是当前构建契约）

#### 当时的源码标识记录

| 面 | 原版 | GameCowork | 落点 |
|---|---|---|---|
| Tauri 标识符 | `dev.codelycowork.desktop` | `dev.gamecowork.desktop` | tauri.conf.json（决定 AppData、WebView2 用户目录、single-instance 互斥、托盘） |
| 产品名/窗口标题 | Tuanjie Cowork / Codely Desktop | GameCowork | tauri.conf.json + index.html |
| 数据目录 | `~/.codely`、`~/.codely-cli` | `~/.gamecowork`、`~/.gamecowork-cli` | core bundle 内 68 处 |
| 环境变量 | `CODELY_*`（24 个） | `GAMECOWORK_*` | core/cli bundle |
| 编辑器桥接包 | `cn.tuanjie.codely.bridge` | `cn.gamecowork.bridge` | core ×1 + cli ×9（见下"桥接分叉"） |
| 后端/指标端点 | `https://codely(-stg).tuanjie.cn` | `https://api(-stg).gamecowork.invalid` | core ×22、cli ×45、insight ×2、前端 ×16 |
| 自动更新源 | `codely.tuanjie.cn/plugins/cowork/latest` | `update.gamecowork.invalid`（**物理断开**） | tauri.conf.json |
| unity-insight.toml 管理标记 | `# Managed by Codely Cowork` | `# Managed by GameCowork` | 读写一致，自洽 |

#### 当时的装配设想（已被当前脚本替代，不执行）

| 产物 | 原版文件名/进程名 | GameCowork 必须用 | 来源 |
|---|---|---|---|
| 主程序 | `cowork.exe`（进程 cowork） | `GameCowork.exe`（进程 GameCowork） | tauri build 按 productName 自动生成 |
| core 边车 | `codely-binary.exe`（进程 codely-binary） | **`gamecowork-binary.exe`** | 用 `@yao-pkg/pkg` 从 `src/core/binary/out/index.js` 重打（步骤见下） |
| CLI 边车 | `codely.exe`（进程 codely） | **`gamecowork.exe`** | `bun build --compile` 从 `src/agent/carved/carve_0201_189957669.js` 重编 |
| 伴生进程 | `process_killer.exe` | **`gamecowork-process-killer.exe`** | tauri.conf `externalBin` 已改名；源二进制需重编译或先复用改名副本 |
| 安装目录 | `Program Files\Tuanjie Cowork` | `Program Files\GameCowork` | NSIS 按 productName 自动分离 |
| 卸载注册表/开始菜单 | 原版键 | GameCowork 键 | NSIS 自动分离 |
| 锁文件 | `lock.codely.lock` | `lock.gamecowork.lock` | 实现 Rust 壳时按 main.rs TODO |

**装配红线**：不得直接把 original/ 里的 `codely-binary.exe`、`codely.exe`、`process_killer.exe`
改名塞进安装包充数——改名副本与源码层常量（如 `Programs/GameCowork` 探测路径）不保证自洽，
必须按上面步骤重打/重编。

### 历史装配步骤（不可执行）

> **2026-09-30 已实际打通**：`src/shell/` 是可编译的精简壳（axum HTTP 网关 + wry WebView2
> + core stdio 中继 + SSE），`GameCowork.exe` 已构建并实测运行成功——窗口标题 GameCowork、
> 前端完整加载、`unity/getHubProjectsAndEditors` 返回真机双引擎数据（tuanjie 2 编辑器 +
> unity 10 编辑器 14 项目）。协议关键发现（写壳必读）：
> - core 的 **stdin 帧尾必须是 `\r\n`**（纯 `\n` 会被认为消息未结束，永无回执）；
> - core 的 **stdout 帧尾是 `\r`**（带尾随空格），不能用按 `\n` 分行的读取器；
> - 消息形状 `{messageType, data, messageId, workspaceId}`，回执按 messageId 关联，
>   流式为 `{done:false,content}→{done:true}`；启动握手 `getWorkspaceDirs` 必须应答；
> - core 必须以 `cwd=<core 目录>` 启动（原生 bindings 按相对路径查找）；
> - `gamecowork-runtime.exe` = node.exe 改名即可跑还原源码（无需 pkg 重打），
>   需把 `node_sqlite3.node` 放到 `core/build/Release/`。

#### 历史 carve CLI 卡死记录（工厂入口恢复前的结果）

- **CLI 边车（bun 重编）会导致 core 卡死**：`GAMECOWORK_CLI_PATH` 指向 bun 编译产物时
  core 启动后挂起（carve 出的主 bundle 缺模块图其余部分，无法独立运行）——
  当前装配已将其移除（`app/cli/gamecowork.exe.bak`），**agent 会话/聊天功能暂不可用**；
  修复方向：用 `bun build` 从完整工程源码编译，或还原 pkg VFS 其余 222 段模块。

```text
# 历史记录：以下命令禁止作为当前装配流程执行。
# 0) 前置: Node 22+, pnpm, Rust(tauri 2), Bun, Maven/JDK(如需), @yao-pkg/pkg
npm i -g @yao-pkg/pkg bun

# 1) 前端: 直接用仓库内 renamed+beautified 版
#    src/frontend/bundle/  →  装配为 app/resource/dist/
#    (美化仅格式化, 逻辑与原 dist 等价; 其中标题/存储键/端点均已 GameCowork 化)

# 2) core 边车重打(源: src/core/binary/out/, 入口 index.js)
pkg src/core/binary/out/index.js \
    -t node22-win-x64 -o gamecowork-binary.exe
#    校验: gamecowork-binary.exe 内不得再含 "codely" 字样(strings 扫一遍)
#    注意: tree-sitter wasm / win-ca native 已在 out/ 内随 VFS 携带

# 3) CLI 重编(源: src/agent/carved/carve_0201_189957669.js, 已含 // @bun 头)
bun build --compile carve_0201_189957669.js --outfile gamecowork.exe
#    当时曾提出原版 CLI 改名回退；该设想已弃用，当前明确禁止。

# 4) 当时曾提出 process-killer 改名副本；该设想已弃用，当前主壳管理自己的进程生命周期。
#    (独立小工具, 无共享状态; 后期按行为重写)

# 5) 装配资源树
#    app/resource/dist/          ← dist-beautified
#    app/resource/core/bin/win32-x64/gamecowork-binary.exe + package.json(名称改 gamecowork-binary) + rg.exe
#    cli/bin/win32-x64/gamecowork.exe + node.exe + lib/ (bundle 内容已 GameCowork 化)
#    gamecowork-process-killer.exe
#    hub/ 不随包分发(授权链为编辑器侧共享组件, 接自研授权前先不带)

# 6) 构建
cargo tauri build    # 产物 GameCowook.exe + NSIS 安装器( productName=GameCowork )
```

### 历史共享面判断（不是当前功能状态）

1. **后端 `.invalid` 占位域**: 打包后的 GameCowork 默认**无法联网用官方账号体系**——
   这是刻意的。接自建后端时改 core/cli bundle 里的 `api.gamecowork.invalid` 常量即可，
   永远不要改回 `codely.tuanjie.cn`（那样两版会共用账号态，违反隔离目标）。
2. **编辑器桥接分叉**: `cn.gamecowork.bridge` 是自留名，官方 UPM 里不存在——
   因此打包版在编辑器里的串流/insight 功能要等你们发布自己的桥接包后才能用；
   好处是 GameCowork 永远不会去安装/升级官方桥（那会影响已装 Codely 依赖的桥版本）。
3. **遥测（仅远程标识，非本机冲突）**: Sentry/PostHog 的 DSN/key 仍在 bundle 里，
   打包版会把遥测发到厂商。介意的话在前端 bundle 里清空对应 DSN/key，或网络层屏蔽。
4. **`rg.exe`/`node.exe`**: 第三方通用工具名，无共享状态，两个软件各自带各自副本，不构成冲突。
5. **图标**: 按要求保留与原版一致（src-tauri/icons/）。

### 历史验证清单（不是当前门禁）

- [ ] 进程列表：只有 `GameCowork` / `gamecowork-binary` / `gamecowork`，无 `cowork`/`codely-*` 新增
- [ ] `%USERPROFILE%` 下新增的是 `.gamecowork(+-cli)`，`.codely` 未被触碰（对比 mtime）
- [ ] `%APPDATA%/%LOCALAPPDATA%` 新增目录基于 `dev.gamecowork.desktop` / `GameCowork`
- [ ] 同时开两版：原版 Codely 一切如常（single-instance 不互踢、会话不串）
- [ ] 已装的 Tuanjie 编辑器工程里：manifest.json 未被 GameCowork 写入 `cn.tuanjie.codely.bridge` 变更
- [ ] 断网状态下 GameCowork 不产生对 `codely.tuanjie.cn` 的任何请求（抓包确认）
