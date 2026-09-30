# Tuanjie Cowork (Codely) 还原工程

> 委托还原 · 2026-09-29 · 还原自 `E:\TuanjieCodely\EXE\Tuanjie Cowork`（v2.1.3-canary.2）
> 委托语境：应用作者委托进行工程还原。

## 产品是什么

Tuanjie Cowork（内部名 **Codely Cowork**，产品 ID `dev.codelycowork.desktop`）是
Unity 中国（团结引擎 Tuanjie）的 AI 结对编程桌面应用，架构与开源项目
**Continue.dev** 同源（二进制内残留 api.continue.dev 系列端点）。

## 总体架构

```
Tauri 2 薄壳 (Rust, WebView2)          ← cowork.exe (58MB)
 ├── Web 前端 (React + Monaco, Vite)    ← app/resource/dist (87MB, 6 个 HTML 入口)
 ├── core 边车 (vercel/pkg Node)        ← codely-binary.exe (70MB, 入口 out/index.js)
 ├── CLI 边车 (Bun v1 编译)             ← cli/bin/win32-x64/codely.exe (204MB)
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
│   ├── core-codely-binary/       # ★ pkg 解包: 258 文件全量还原(含 14MB 主 bundle)
│   │   ├── binary/out/index.beautified.js   # 美化版主 bundle (18.1MB)
│   │   └── _unpack-manifest.json
│   ├── cli-codely/               # ★ Bun carve: 223 段明文模块
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
head -c 400 restored/core-codely-binary/binary/out/index.js

# 用 node 跑解包出来的 core 边车(参考)
node restored/core-codely-binary/binary/out/index.js   # 需按 package.json 补依赖环境
```

详见 [RESTORE_STATUS.md](RESTORE_STATUS.md)（逐层记录与未还原项）。
