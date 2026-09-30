# RESTORE_STATUS — Tuanjie Cowork 还原状态

> 日期: 2026-09-29 · 目标: `E:\TuanjieCodely\EXE\Tuanjie Cowork` (v2.1.3-canary.2)
> 产物: `F:\AI\AgentMake\CyberSoftwares\GameCowork`
> 性质: 应用作者委托还原

## 一、目标鉴定（实测）

| 项 | 结果 |
|---|---|
| 主程序 | `cowork.exe` 58,555,736B，Rust(MSVC 14.29) + **Tauri 2**（tauri-runtime-wry / WebView2），Authode 签名 PKCS#7 |
| 产品信息 | ProductName=Tuanjie Cowork, Version=2.1.3-canary.2, Company=codelycowork |
| 标识符 | `dev.codelycowork.desktop`（与 `.tuanjie-cowork-install` 标记一致） |
| 前端 | `app/resource/dist` 87MB：461 JS + 9 CSS + KaTeX 字体全套 + 图标；Vite 构建，双应用（desktop/gui）双构建代并置 |
| core 边车 | `codely-binary.exe` 70,158,576B，**vercel/pkg**（Node 22.x），入口 `out/index.js` |
| CLI 边车 | `cli/bin/win32-x64/codely.exe` 204,135,768B，**Bun v1** `--compile`，`@bytecode @bun-cjs` |
| unity-insight | `cli/lib`：原版 package.json 保留（name=unity-insight 0.0.1, esbuild+vitest 工程）+ 6 个 bundle worker |
| hub | Tuanjie Hub 授权链 217MB（.NET LicensingClient + Sentinel HASP + v2c 许可证） |
| 伴生 | `process_killer.exe`(PE64 小工具)、`uninstall.exe`(NSIS)、新旧版本 exe 并存（升级残留） |

## 二、逐层还原记录

### 1. 前端（dist）— 完成 ✅

- 方法: prettier 3 全量美化（babel/css/html parser, 120 列）→ `restored/frontend/dist-beautified/`
- 结果: **beautified=479, copied=280(字体/图片等), failed=0**
- 技术栈鉴定: React + redux + Monaco(ts.worker×2) + mermaid 全家桶(cytoscape/dagre/c4/class…) + three.js(GLTF/模型/天空盒) + KaTeX + xterm + marked/remark + i18next + cmdk + Sentry + posthog + @tauri-apps/api
- Tauri IPC: 仅 7 个字面 invoke（3 个自定义命令均为跨宿主共享代码，实现在 Unity/JetBrains 宿主侧；desktop 壳零自定义命令）
- 产出: `PROJECT_MAP.md`（入口图/模块图谱）+ `package.json`（依赖重建）

### 2. Rust 壳（src-tauri）— 骨架完成 ✅（源码级不可全还原）

- 提取到: 插件清单（updater/notification/global-shortcut/single-instance）、内嵌 ACL 能力串、
  Rust 侧调用的 plugin:* 命令统计、全部后端端点、updater minisign 痕迹、LSP 引用
- 重建: `tauri.conf.json` / `Cargo.toml` / `src/main.rs`(结构示意) / `capabilities/default.json` / `COMMAND_SURFACE.md`
- 未还原: Rust 函数级逻辑（需 IDA/Ghidra 深逆，对应用行为无必要——壳无业务逻辑）、
  窗口数值配置（编译进代码，字符串不可见）、minisign 完整公钥

### 3. core 边车（pkg 解包）— 完成 ✅

- 定位: bootstrap shim 数字参数(payload@37459456+32586083, prelude@70045539+100915)
- 结构: pkg 5.x 路径字典(`{"C:":"0",…}`) + VFS(键=id 链 `0/1/2/…`, 值={类型:[off,size]}) + DOCOMPRESS=1(**gzip**, 非 brotli)
- 结果: **258/258 文件还原**（32MB 压缩 → 133MB 明文），入口 bundle 14.3MB → 美化 18.1MB
- 内容: out/index.js 主 bundle + llama/tiktoken tokenizer + tree-sitter wasm 全套(30+ 语言) + win-ca native + projectZipWorker

### 4. CLI 边车（Bun carve）— 完成 ✅（字节码除外）

- 方法: 可打印文本段 carve（UTF-8 容忍），`---- Bun! ----` 魔数定位图区(59.6MB 处起)
- 结果: 223 段 / 16.3MB 明文 JS；主 bundle 11.95MB → 美化 20.5MB
- 未还原: `@bytecode` 编译缓存部分（二进制 V8 字节码，仅影响启动性能不影响语义——明文源码已全取）

### 5. unity-insight — 完成 ✅

6 个 worker bundle 全部美化成功；原版 package.json（scripts/devDependencies/engines）完整保留，可据此重建工程。

### 6. hub — 鉴定完成，未深逆 ⏸

全部为 .NET 程序集（ILSpy 可随时一键反编译）+ Sentinel HASP 商业组件。作者未要求时不动。

## 三、未还原项（诚实清单）

1. **Rust 函数级源码**（壳层无业务逻辑，骨架已给）——如需可用 IDA 补。
2. **窗口数值配置 / NSIS 安装器脚本**（编译产物，需动态观测或 NSIS 反编译）。
3. **Bun 字节码缓存段**（语义无损失）。
4. **前端 sourcemap**（产物未随附，变量名保持压缩态）。
5. **hub .NET 反编译**（待指示）。
6. `cowork-old-*.exe` / `codely-binary-old-*.exe` 为旧版本残留，未单独还原（方法相同）。

## 四、复跑工具（tools/）

| 脚本 | 用途 |
|---|---|
| `beautify-dist.mjs` | dist 全量美化（prettier stdout 捕获版，Node 24 兼容） |
| `extract-invoke.mjs` | 扫 dist 提取 Tauri invoke 命令面 |
| `pkg-probe.py` / `pkg-probe2.py` | pkg 结构探针 |
| `pkg-unpack.mjs` | pkg 解包器（字典+VFS+gzip，可复用于其他 pkg 产物） |
| `bun-carve.py` | Bun standalone 明文 carve（UTF-8 容忍，单块扫描） |
| `extract-icon.ps1` | exe 图标提取 |

## 五、校验摘要

- original 镜像与源目录一致性: robocopy /E 全量复制（873MB）
- 前端: 479 美化 + 280 原样拷贝 = 759 项 = dist 全量 ✅
- pkg: 258 文件写入，0 失败 ✅
- 关键抽样: 入口 JS 头部可读、wasm 文件大小正确、KaTeX 字体二进制一致 ✅
