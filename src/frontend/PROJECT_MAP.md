# 前端产物图谱（dist → 工程结构还原索引）

> 2026-10-01 交接说明：本文是初次提取时的结构索引；下文“仅格式化、未改逻辑”不再适用于当前维护版本。当前两代前端已补宿主协议、本地身份、工作区、文件、自定义与预览适配，真实入口仍是 bundle/；运行结论见 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)，接手见 [docs/history/HANDOFF.md](../../docs/history/HANDOFF.md)。

> 原件: `original/Tuanjie Cowork/app/resource/dist/`（87MB, 461 JS + 9 CSS + 字体/图标）
> 美化版: `src/frontend/bundle/`（479 个 JS/CSS/HTML 全量 prettier 化，零失败）
> 构建工具: Vite（产物命名 `name-HASH.js`）；双入口共享同一 `assets/` 目录（两次构建的 chunk 并存，如 `GLTFLoader-8WqSWalt` 与 `GLTFLoader-D_VqbMdM`）

## 入口图

| HTML | 角色 | JS 入口 |
|---|---|---|
| `index.html` | GameCowork Desktop 主窗口（React，`#root`） | `index-DG7m4Xaq.js` + `index-DRnMDoPo.css` |
| `gui.html` | 编辑器内 GUI | `assets/index-BRxZ4eG7.js`（modulepreload: registry / VscTheme / unityInsightIndex / store / projectMenuFlows / MoveUpRightIcon） |
| `pet.html` | 桌宠 | 独立入口 |
| `windowBridge.html` | Unity SceneView 串流桥（WebRTC/视频 + 指针转发 + 前端弹出菜单） | 内联 |
| `indexWalkthrough.html` | 新手引导 | 独立入口 |
| `jetbrains_index.html` / `jetbrains_editorInset_index.html` | JetBrains IDE 宿主 | 独立入口 |

主题: `gamecowork-theme-bootstrap` 内联脚本按 localStorage `gamecowork-theme` 切换 light/dark。

## 技术栈（依据产物签名）

- **React**（react-dom / createRoot / __REACT_DEVTOOLS）+ redux
- **Monaco Editor**（`ts.worker-*.js` 两大文件、`*.contribution.js`、`css.worker`、VscTheme）
- **mermaid 全家桶**（classDiagram/c4Diagram/architectureDiagram/cynefin/cytoscape/dagre —— 图表渲染）
- **three.js**（GLTFLoader / GenerationModelViewer / GenerationSkyboxViewer —— 3D 资产预览）
- **KaTeX**（全套字体）、**xterm**（TerminalPanel）、**marked/remark**（Markdown）
- **@tauri-apps/api**（`core-*.js` 三份 = 两次构建 × (desktop/gui)）
- **Sentry**（`SENTRY_RELEASE id=a9a604f…`、`_sentryDebugIds`）、**posthog-js**
- **i18next**（`defaultLocale` chunk）、**cmdk**（命令面板）
- 语言高亮: tree-sitter/highlight 系列（csharp/css/… contribute chunks）

## 语义 chunk 速览（业务层）

`RightSideBarPanel`（Unity 内嵌侧栏，跨宿主共享）、`TJHubRoute`（Tuanjie Hub 路由）、
`AddLicenseDialog` / `NoLicenseDialog`（授权 UI）、`GenerationDetailDialog` /
`GenerationModelViewer` / `GenerationSkyboxViewer`（AI 生成 3D 资产面板）、
`InsightIndexPage`（unity-insight 索引页）、`TerminalPanel`、`cardAudioPlayer`、
`store` / `projectMenuFlows` / `event`。

## Tauri IPC 边界

- 前端经 `core-*.js` 的 `invoke` 走 Tauri IPC 的仅 7 处（见 `../src-tauri/COMMAND_SURFACE.md`）；
- **主窗口与后端逻辑通过 HTTP/WebSocket 与 gamecowork-binary 边车通信**（Continue.dev 架构），
  因此美化后的前端源码 + 解包的边车源码 ≈ 应用逻辑全量。

## 与原版的差异

- 变量名被压缩，未做源码级重命名还原（需 sourcemap，产物内未随附）；
- 仅格式化（prettier 120 列），未改任何字节逻辑；
- 双版本 chunk 并存属原版就有的现象（升级残留），原样保留。
