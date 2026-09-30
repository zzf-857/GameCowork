# PACKAGING — GameCowork 打包装配指南（与已装 Codely 的全标识隔离）

> 目标：打包出的 GameCowork 安装到本机后，**除图标外，进程名、标识符、数据目录、
> 更新源、桥接包、安装器键值等一切机器可观测面与已装 Codely 完全不同**；
> 对本工程的任何后续改动都波及不到已安装的原版软件。
>
> 隔离分两层：①源码层（本仓库内已完成，见下表）②装配层（打包时必须遵守的改名清单）。

## 一、外部标识对照总表（原版 → GameCowork）

### 已在源码层完成（随仓库走，打包即生效）

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

### 必须在装配层完成（打包时执行，PACKAGING 是唯一依据）

| 产物 | 原版文件名/进程名 | GameCowork 必须用 | 来源 |
|---|---|---|---|
| 主程序 | `cowork.exe`（进程 cowork） | `GameCowork.exe`（进程 GameCowork） | tauri build 按 productName 自动生成 |
| core 边车 | `codely-binary.exe`（进程 codely-binary） | **`gamecowork-binary.exe`** | 用 `@yao-pkg/pkg` 从 `restored/core-gamecowork-binary/binary/out/index.js` 重打（步骤见下） |
| CLI 边车 | `codely.exe`（进程 codely） | **`gamecowork.exe`** | `bun build --compile` 从 `restored/cli-gamecowork/carved/carve_0201_189957669.js` 重编 |
| 伴生进程 | `process_killer.exe` | **`gamecowork-process-killer.exe`** | tauri.conf `externalBin` 已改名；源二进制需重编译或先复用改名副本 |
| 安装目录 | `Program Files\Tuanjie Cowork` | `Program Files\GameCowork` | NSIS 按 productName 自动分离 |
| 卸载注册表/开始菜单 | 原版键 | GameCowork 键 | NSIS 自动分离 |
| 锁文件 | `lock.codely.lock` | `lock.gamecowork.lock` | 实现 Rust 壳时按 main.rs TODO |

**装配红线**：不得直接把 original/ 里的 `codely-binary.exe`、`codely.exe`、`process_killer.exe`
改名塞进安装包充数——改名副本与源码层常量（如 `Programs/GameCowork` 探测路径）不保证自洽，
必须按上面步骤重打/重编。

## 二、装配步骤

> **2026-09-30 已实际打通**：`restored/shell/` 是可编译的精简壳（axum HTTP 网关 + wry WebView2
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

### 本轮实测遗留

- **CLI 边车（bun 重编）会导致 core 卡死**：`GAMECOWORK_CLI_PATH` 指向 bun 编译产物时
  core 启动后挂起（carve 出的主 bundle 缺模块图其余部分，无法独立运行）——
  当前装配已将其移除（`app/cli/gamecowork.exe.bak`），**agent 会话/聊天功能暂不可用**；
  修复方向：用 `bun build` 从完整工程源码编译，或还原 pkg VFS 其余 222 段模块。

```bash
# 0) 前置: Node 22+, pnpm, Rust(tauri 2), Bun, Maven/JDK(如需), @yao-pkg/pkg
npm i -g @yao-pkg/pkg bun

# 1) 前端: 直接用仓库内 renamed+beautified 版
#    restored/frontend/dist-beautified/  →  装配为 app/resource/dist/
#    (美化仅格式化, 逻辑与原 dist 等价; 其中标题/存储键/端点均已 GameCowork 化)

# 2) core 边车重打(源: restored/core-gamecowork-binary/binary/out/, 入口 index.js)
pkg restored/core-gamecowork-binary/binary/out/index.js \
    -t node22-win-x64 -o gamecowork-binary.exe
#    校验: gamecowork-binary.exe 内不得再含 "codely" 字样(strings 扫一遍)
#    注意: tree-sitter wasm / win-ca native 已在 out/ 内随 VFS 携带

# 3) CLI 重编(源: restored/cli-gamecowork/carved/carve_0201_189957669.js, 已含 // @bun 头)
bun build --compile carve_0201_189957669.js --outfile gamecowork.exe
#    若 bun 版本与原编译版差异导致不兼容, 回退方案: 直接用原 codely.exe 改名 + 接受进程同名风险(不推荐)

# 4) 伴生进程: process_killer.exe 源码未还原, 暂用改名副本 gamecowork-process-killer.exe
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

## 三、已知共享面（如实声明，均不影响"改动隔离"目标）

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

## 四、验证清单（打包后跑一遍）

- [ ] 进程列表：只有 `GameCowork` / `gamecowork-binary` / `gamecowork`，无 `cowork`/`codely-*` 新增
- [ ] `%USERPROFILE%` 下新增的是 `.gamecowork(+-cli)`，`.codely` 未被触碰（对比 mtime）
- [ ] `%APPDATA%/%LOCALAPPDATA%` 新增目录基于 `dev.gamecowork.desktop` / `GameCowork`
- [ ] 同时开两版：原版 Codely 一切如常（single-instance 不互踢、会话不串）
- [ ] 已装的 Tuanjie 编辑器工程里：manifest.json 未被 GameCowork 写入 `cn.tuanjie.codely.bridge` 变更
- [ ] 断网状态下 GameCowork 不产生对 `codely.tuanjie.cn` 的任何请求（抓包确认）
