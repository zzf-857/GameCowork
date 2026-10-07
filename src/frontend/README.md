# 前端维护入口

`bundle/` 是实际前端源码输入：可读的 JS / CSS / HTML、两代业务 chunk、Monaco worker、图标和字体。构建脚本直接装配该目录，不执行 Vite。恢复阶段推断的依赖清单已移至 [研究资料](../../research/frontend/frontend-package.reference.json)，不能用于安装或重建前端。

| 入口 / 模块 | 用途 |
| --- | --- |
| `bundle/index.html` | 桌面项目面板 |
| `bundle/gui.html` | 工作区与聊天界面 |
| `bundle/windowBridge.html` | 编辑器画面接收与输入 |
| `bundle/assets/gamecowork-image-frames.js` | 自有帧传输与复合画面逻辑 |
| `bundle/assets/index-*.js`、`VscTheme-*.js`、`Sidebar-*.js` | 两代业务入口及共享界面逻辑 |

修改前先从 [PROJECT_MAP.md](PROJECT_MAP.md) 和 `tests/contracts/frontend-*` 定位实际入口；涉及共用行为时同步 current / previous 两代。保留 chunk 名和内部相对引用，不能把整个目录作为生成物删除，也不要重新美化所有 bundle 制造无关差异。

隔离产品界面验证由 [统一门禁](../../tools/verify-local.ps1) 启动真实 Rust 宿主与 Chromium，不能用静态服务器页面可见代替宿主功能验收。新模块优先放置独立、可验证的源文件，在两代入口中明确接线；逐步拆分 bundle 需要独立功能任务与对应回归，不在目录迁移时混改。
