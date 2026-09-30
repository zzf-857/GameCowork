# Tauri 命令面与端点（从 cowork.exe + 前端 bundle 逆向提取，2026-09-29）

## 架构结论

cowork.exe 是**薄壳**：`generate_handler!` 未注册任何自定义命令（二进制中搜不到
前端调用的自定义命令名），应用逻辑分层如下：

```
┌─ Web 前端 (app/resource/dist, React + Monaco) ─────────────────────────┐
│  index.html   → GameCowork Desktop 主界面 (index-DG7m4Xaq.js)              │
│  gui.html     → GameCowork 编辑器内 GUI (assets/index-BRxZ4eG7.js)          │
│  pet.html / windowBridge.html / indexWalkthrough.html / jetbrains_*.html│
└──────────┬──────────────────────────────────────────────────────────────┘
           │ HTTP/WebSocket (Continue.dev 架构)
┌──────────▼──────────────────────────────────────────────────────────────┐
│  core 边车: gamecowork-binary.exe (vercel/pkg 打包 Node, 入口 out/index.js)  │
│  CLI 边车:  cli/bin/win32-x64/gamecowork.exe (Bun v1 编译, 主 bundle 12MB)   │
│  cli/lib:   unity-insight (esbuild bundle + tree-sitter wasms)          │
└──────────┬──────────────────────────────────────────────────────────────┘
           │ 授权
┌──────────▼──────────────────────────────────────────────────────────────┐
│  hub/: tuanjie.exe + LicensingClient(.NET) + tuanjie-sl.v2c 许可文件      │
└─────────────────────────────────────────────────────────────────────────┘
```

## invoke 命令面（前端 → Rust，共 7 个字面调用）

| 命令 | 调用方 |
|---|---|
| `get_cowork_access_token` | gui 入口、RightSideBarPanel（跨宿主共享代码，宿主包括 Unity 内嵌/JetBrains） |
| `read_unity_streaming_layout` | RightSideBarPanel |
| `save_unity_streaming_layout` | RightSideBarPanel |
| `plugin:event\|listen / unlisten / emit / emit_to` | 事件桥（event-*.js） |

注：以上命令名在 cowork.exe 二进制中**不存在**——它们由各宿主（Unity 编辑器插件 /
JetBrains 插件）的 native 侧实现；Tauri 桌面壳本身只走插件命令。

## Rust 侧使用的核心插件命令（二进制内观察到的 `plugin:*` 字符串）

window(set/is/outer/inner/start/get...)、menu(set/is/text/remove...)、tray(set...)、
webview、notification(get/remove/register/is...)、event(emit...)、path(resolve)、image(from...)。

## 注册的 Tauri 插件（tauri-plugin-* 字符串）

- tauri-plugin-updater（更新源见 tauri.conf.json）
- tauri-plugin-notification
- tauri-plugin-global-shortcut
- tauri-plugin-single-instance

## 内嵌 ACL 能力串（二进制提取）

```
core:path:default core:event:default core:window:default core:webview:default
core:app:default core:image:default core:resources:default core:menu:default
core:tray:default
allow-tauri-version allow-identifier allow-bundle-type
allow-register-listener allow-remove-listener allow-default-window-icon
```

## 后端端点（二进制字符串提取）

| 端点 | 用途 |
|---|---|
| `https://codely.tuanjie.cn` | 生产后端 |
| `https://codely-stg.tuanjie.cn` | 预发后端 |
| `https://codely.tuanjie.cn/plugins/cowork/latest` | Tauri updater 清单（minisign 签名） |
| `https://codesearch-plugins.cdn.tuanjie.cn` | 代码搜索插件 CDN |
| `https://api.continue.dev` / `api-test.continue.dev` / `api.continue-stage.tools` | Continue.dev 遗留端点（架构血缘证据） |
| `https://remote.unity.cn` | Unity 远程 |

## 二进制内的 LSP/工具引用

basedpyright、vtsls、`gamecowork-unity-lsp-server`（自研 Unity LSP）。

## 版本标记

- 产品: Tuanjie Cowork 2.1.3-canary.2（Company: gamecowork）
- 伴随文件: `cowork-old-*.exe`、`gamecowork-binary-old-*.exe`（升级残留的旧版本）
- 安装标记: `.tuanjie-cowork-install` 内容为 `dev.gamecowork.desktop`
