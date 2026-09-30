# Tuanjie Cowork (GameCowork) 还原工程

> 委托还原 · 2026-09-29 · 还原自 `E:\TuanjieCodely\EXE\Tuanjie Cowork`（v2.1.3-canary.2）
> 委托语境：应用作者委托进行工程还原。

## codely → GameCowork 重命名与本机隔离（2026-09-30）

应用户要求，工程内 codely 系命名已全部改为 GameCowork（13,500+ 处，82+ 文件，脚本
[tools/rename-codely.py](tools/rename-codely.py) 可复跑）。同日完成**深度隔离**（第二轮，
[tools/isolate-gamecowork.py](tools/isolate-gamecowork.py)）：外部契约标识全部分叉。
打包要求与装配红线见 **[PACKAGING.md](restored/PACKAGING.md)**。

### 映射表

| 原名 | 现名 |
|---|---|
| codelycowork / Codely Cowork / codely-cowork | gamecowork / GameCowork |
| `dev.codelycowork.desktop`（Tauri 标识符） | `dev.gamecowork.desktop` |
| `~/.codely`、`~/.codely-cli`（core 数据目录） | `~/.gamecowork`、`~/.gamecowork-cli` |
| `CODELY_*`（24 个环境变量，含 CLI_HOME/HOME/TOKEN） | `GAMECOWORK_*` |
| `core-codely-binary/`、`cli-codely/`（工程目录） | `core-gamecowork-binary/`、`cli-gamecowork/` |
| `Programs/Codely Cowork`（自身 CLI 探测路径） | `Programs/GameCowork` |
| `# Managed by Codely Cowork (...)`（unity-insight.toml 标记） | `# Managed by GameCowork (...)`（读写一致） |
| `cn.tuanjie.codely.bridge`（编辑器桥接包） | `cn.gamecowork.bridge`（分叉，不再装/升官方桥） |
| `https://codely(-stg).tuanjie.cn`（后端/指标） | `https://api(-stg).gamecowork.invalid`（占位域，永不误连） |
| `codely.tuanjie.cn/plugins/cowork/latest`（更新源） | `update.gamecowork.invalid`（**自动更新物理断开**） |
| 边车/伴生进程名 codely-binary.exe、codely.exe、process_killer.exe | gamecowork-binary.exe、gamecowork.exe、gamecowork-process-killer.exe（**装配层改名重打**，见 PACKAGING.md） |

> 文中其余事实性描述沿用重命名后写法；原安装目录内的原始文件名（如 `codely-binary.exe`）
> 仅存在于 `original/` 镜像与外部安装目录，未做改动。

### 保留未改

- `tools/*.py` 中指向原安装目录的硬编码路径（再提取工具，针对原始文件名工作）；
- 图标（按用户要求与原版保持一致）。

### 与已装 Codely 的隔离保证

1. Tauri 标识符不同 → single-instance 互斥、AppData、WebView2 用户数据目录完全分离；
2. 数据目录 `~/.gamecowork` 与原版 `~/.codely` 互不读写（会话/索引/令牌全隔离）；
3. 环境变量命名空间不同，不会读到原版的全局 `CODELY_*` 配置；
4. 程序自身服务端口为动态分配（实测无固定自绑端口；bundle 里的 localhost 端口均为外部服务示例）；
5. **外部标识全部分叉**（2026-09-30 第二轮）：桥接包不再共用、后端/指标/更新源全部切
   `.invalid` 占位域——打包版不会向官方后端/更新源发任何请求，自动更新不可能把本工程
   变回官方版；代价与接回方法见 PACKAGING.md §三；
6. 边车进程名经装配层改名后与原版不同（cowork/codely-binary/codely → GameCowork/
   gamecowork-binary/gamecowork）；
7. `productName`/窗口标题已改为 `GameCowork`（`tauri.conf.json`），安装目录、卸载注册表
   键、开始菜单均与原版分离。

## 产品是什么

Tuanjie Cowork（内部名 **GameCowork**，产品 ID `dev.gamecowork.desktop`）是
Unity 中国（团结引擎 Tuanjie）的 AI 结对编程桌面应用，架构与开源项目
**Continue.dev** 同源（二进制内残留 api.continue.dev 系列端点）。

## 总体架构

```
Tauri 2 薄壳 (Rust, WebView2)          ← cowork.exe (58MB)
 ├── Web 前端 (React + Monaco, Vite)    ← app/resource/dist (87MB, 6 个 HTML 入口)
 ├── core 边车 (vercel/pkg Node)        ← gamecowork-binary.exe (70MB, 入口 out/index.js)
 ├── CLI 边车 (Bun v1 编译)             ← cli/bin/win32-x64/gamecowork.exe (204MB)
 ├── unity-insight (esbuild bundle)     ← cli/lib (tree-sitter 代码索引)
 └── hub 授权链 (Tuanjie Hub)           ← hub/ (217MB, .NET LicensingClient)
```

应用逻辑几乎全在前端 + Node 边车（Rust 壳零自定义命令），因此本还原的
**源码覆盖率极高**：前端 479 个 JS + 边车全部 JS 均已还原为可读源码。

## 目录结构

```
GameCowork/
├── original/Tuanjie Cowork/      # 原始安装目录完整镜像（校验基准）
├── restored/
│   ├── frontend/                 # ★ 前端还原
│   │   ├── dist-beautified/      #   479 个 JS/CSS/HTML 全量美化(可运行、可读)
│   │   ├── package.json          #   重建的依赖清单
│   │   └── PROJECT_MAP.md        #   入口图/技术栈/模块图谱
│   ├── src-tauri/                # ★ Rust 壳还原（骨架级）
│   │   ├── tauri.conf.json       #   重建配置(含更新源)
│   │   ├── Cargo.toml / src/main.rs
│   │   ├── capabilities/default.json
│   │   ├── COMMAND_SURFACE.md    #   命令面/端点/插件/ACL 全记录
│   │   └── icons/                #   exe 图标 + 品牌图
│   ├── core-gamecowork-binary/       # ★ pkg 解包: 258 文件全量还原(含 14MB 主 bundle)
│   │   ├── binary/out/index.beautified.js   # 美化版主 bundle (18.1MB)
│   │   └── _unpack-manifest.json
│   ├── cli-gamecowork/               # ★ Bun carve: 223 段明文模块
│   │   ├── carved/  cli-main.beautified.js  # 主 bundle 美化版 (20.5MB)
│   ├── cli-unity-insight/        # ★ unity-insight 6 个 worker 美化版
│   └── hub/README.md             # 成分鉴定(未深逆)
└── tools/                        # 本次还原用的提取脚本(可复跑)
```

## 还原程度总览

| 层 | 方法 | 还原度 |
|---|---|---|
| 前端 dist | 全量 prettier 美化 + 依赖签名分析 | **100% 文件覆盖**（逻辑零改动） |
| Rust 壳 | 二进制字符串/ACL/插件分析 | 架构与配置完整，Rust 源码为骨架示意 |
| core 边车 | vercel/pkg VFS 解包 | **100% 文件还原**(258/258, 含 wasm/native) |
| CLI 边车 | Bun 模块图明文 carve | 明文 JS 全量(16.3MB/223 段)，字节码部分不可还原 |
| unity-insight | 原始 package.json + bundle 美化 | **完整** |
| hub | 成分鉴定 | 未深逆（ILSpy 可随时补） |

## 快速验证

```bash
# 前端美化版直接可起(任意静态服务器)
npx serve restored/frontend/dist-beautified

# 边车源码抽查
head -c 400 restored/core-gamecowork-binary/binary/out/index.js

# 用 node 跑解包出来的 core 边车(参考)
node restored/core-gamecowork-binary/binary/out/index.js   # 需按 package.json 补依赖环境
```

详见 [RESTORE_STATUS.md](RESTORE_STATUS.md)（逐层记录与未还原项）。
