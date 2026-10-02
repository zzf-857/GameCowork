# codelyreversebackup_fromunityhub — Unity Hub 功能提取库

> 提取日期: 2026-10-02 · 来源: Unity Hub **3.17.3** 的 `E:\Unity Hub\EXE`（只读）+ 既有解包 `temp/GameCowork/unity-hub-asar/`；源 app.asar 28,895,412 B。
> 用途: 供 GameCowork 自研直接对照的 Unity Hub 四域功能逻辑（项目管理/新建项目/Editor 版本管理/许可证）。
> 原始片段保留来源与字节；纯逻辑另提供最小 import/export 适配。**许可域为 Unity 专属实现，不能当作 GameCowork 自身许可，见 licensing.md 显式标注**。
> 与 Tuanjie 系研究的关系：IPC 管道名与服务结构相似，支持同族实现的推断；仅凭这些证据不能断言完整源码是逐项改名分支。

## 已保留的真实代码

本轮从 **26 个 bundle chunk 提取 152 个原始 `//#region` 区域**，共 1,017,529 B（含 4 个纯逻辑适配及 package 元数据；不含索引和清单）。每个选中 chunk 的原字节已与安装目录 `app.asar` 对比一致。ASAR SHA-256：`d1561ffb566fcbd38479fec8b15198f38db25f22795cbeb6013f1d68d81349c1`。

| 入口 | 内容 |
| --- | --- |
| [_SOURCE-INDEX.md](_SOURCE-INDEX.md) | 152 个原始路径、片段链接、源 chunk 和原行号 |
| [_SOURCE-MANIFEST.json](_SOURCE-MANIFEST.json) | 原 ASAR / chunk / 片段 SHA、字节偏移、依赖范围、复用限制、适配变动 |
| [REUSE_NOTES.md](REUSE_NOTES.md) | 可直接复用的纯逻辑、四域服务的依赖缺口 |
| [reusable/unity-version.mjs](reusable/unity-version.mjs) | 原 UnityVersion 类，仅追加 export；保留原正则与比较行为 |
| [reusable/project-constants.mjs](reusable/project-constants.mjs) | 原项目文件/偏好键常量，仅添加 Node path import/export |
| [reusable/filename-validation.mjs](reusable/filename-validation.mjs) | 原跨平台文件名/路径校验，仅拼接原片段及 Node import/export |
| [reusable/unity-project.gitignore](reusable/unity-project.gitignore) | 原静态字符串 payload，保留内嵌上游与 CC0 注释 |

`source-fragments/**/*.js.txt` 是保留原字节的编译后源码区域，含 Hub bundle 的别名与外围绑定，**不是可独立执行模块**。纯逻辑适配不包含网络、Hub 账号、许可激活或原生模块。项目构建不加载此目录；接入产品时仍按实际维护输入边界保留来源和回归契约。

## 重复提取与检查

在 GameCowork 根目录执行，工具只读取安装 ASAR 与既有解包；不执行其 JS：

```powershell
node tools/research/extract-unity-hub-reference.mjs
node tools/research/extract-unity-hub-reference.mjs --check
node --test tests/contracts/unity-hub-reference-extraction.test.mjs
```

可显式指定 `--asar`、`--unpack`、`--output`；解包与源 ASAR 不一致时会拒绝提取。默认提取只更新代码片段、纯适配、元数据与 `_SOURCE-*`，不覆盖这些分析文档。`_EXTRACT-MANIFEST.json` 保留首批文档索引，真实源码依据 `_SOURCE-MANIFEST.json`。

## 资产索引

| 文档 | 内容 | 服务于 GameCowork 的哪块 |
|---|---|---|
| [project-management.md](project-management.md) | 项目管理域：projectService 常量（Temp/UnityLockfile 锁、ProjectVersion.txt、ProjectSettings 监听）、编辑器活动锁扫描（openProjectsCache+socket 映射）、状态持久化与广播、VCS 数据（vcsManagementService）、git 凭据集成（GCM 环境钳制）、gitignore 模板（github/gitignore Unity 同步件） | own 壳 hub_snapshot/工作区注册表的对照；"编辑器打开中"检测 |
| [new-project-templates.md](new-project-templates.md) | 新建项目域：unityTemplateService（本地模板扫描 per editor path+版本缓存、远端模板下载状态机 replaceTemplate/isUpgrade、默认模板回退）、创建流（createProject+VCS provider 分析）、模板二进制出处（Editor 内置 tgz——与 template-pipeline.md 实证互证） | tjhub/getTemplates·createProject 的原版对端 |
| [editor-version-management.md](editor-version-management.md) | Editor 版本管理域：installedEditorList（primary+secondary 双安装位）、available-editors.changed 事件、release 服务（@unity/hub-generate-releases、download.unity3d.com/download_unity/{revision}/{module}、Android 模块 URL 表）、NSIS /S 静默装/卸、下载引擎（paused-downloads.json、DOWNLOAD_ITEM） | tjhub 安装队列域（installEnqueue 族）的原版契约 |
| [licensing.md](licensing.md) ⚠️Unity 专属 | 许可证域：@licensing/licensing-sdk 方法面（activateUlfLicense/generateEntitlementAlf/importLicense/borrowLicense/checkEntitlements…）、IPC 管道（Unity-LicenseClient-{user}+nanoid 副通道+-notifications）、LicenseType/LICENSE_TYPES、licenseServiceCore（ULF 有效性/EGL E4 前缀/浮动 LICENSING_SERVICE_BASE_URL/matchIdlPeWithUlfPe）、安装编辑器后自动激活 PE、activation.unity3d.com 端点 | **Unity 专属静态代码参考**。与 Tuanjie 系许可（T2）结构相似，不据此断言完整改名分支；GameCowork 本地身份不是 Unity 许可 |
| [_EXTRACT-MANIFEST.json](_EXTRACT-MANIFEST.json) | 首批分析文档来源/SHA | 文档复核；代码以新源码清单为准 |

## 架构速记（四域共用）

- Electron 应用: `build/main/*.js`（Vite chunk，`//#region src/main/services/...` 保留原始路径）、
  `build/preload/mainWindowPreload.cjs`（极薄，仅 ipc-ready 门+文件路径转换）、React/Redux 渲染层。
- 主服务大束: `DiskValidatorStrategy-Baf6OtjU.js`（2.73MB，含 projectService/licenseService/installedEditorList/TemplateService 等）；
  专项 chunk: unityReleaseService、unityInstallerProcess_win32、DownloadHelper、InstallModule、editor-helper-win32、UnityIPCServer。
- 本地 IPC: `UnityIPCServer("hubIPCService")`——已连接编辑器以 socket 接入（项目活动状态扫描的来源）；
  许可客户端走 `Unity-LicenseClient-*` 命名管道族（nerve 轮询连接、副通道随机后缀）。
- 状态文件族: `hubInfo.json`、`paused-downloads.json`、`services-config.json`、`releases-silicon.json`、`window-state.json`、
  localStorage 键（projectDir/skipRemoveConfirmation/projectOrganizationSetting/projectSortPreferences/projectTablePreferences）。
- 云端点（本次只读提取没有调用）: activation.unity3d.com（许可激活）、accounts.unity3d.com、api.unity.com、
  cloud.unity.com、download.unity3d.com/download_unity、beta.unity3d.com/download、analytics.cloud.unity3d.com。

## 红线（继承项目 AGENTS.md）

1. Unity Hub 与 Unity.Licensing.Client 全程只读，未运行、未解包执行任何原生模块。
2. **许可域文档仅描述协议形状与流程，用于对照 Tuanjie 分支血缘；不含任何本机许可文件内容、机器指纹或凭据值。**
3. Unity 模板/资源二进制不复制入库；引用 `temp/GameCowork/unity-hub-asar/` 既有解包与 template-pipeline.md 的 tgz 实证。
4. 本次未连接原厂云端点（activation/accounts/api.unity 等）。任何真实 Unity 登录、许可或下载流程仍属于 Unity 服务，不能从备份片段宣称已在 GameCowork 实现。
