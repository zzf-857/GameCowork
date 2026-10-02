# Unity Hub 代码复用说明

这里保留静态代码与可核对的来源，不记录 GameCowork 功能进度。实际产品进展见 [RESTORE_STATUS.md](../RESTORE_STATUS.md)。

## 已能独立加载的原逻辑

`reusable/` 内 3 个 `.mjs` 都保持其来源区域的原字节，只在外层添加 import/export；文件构造式与 source-region SHA 在 [_SOURCE-MANIFEST.json](_SOURCE-MANIFEST.json) 的 `adapters` 中逐项列出。

| 适配 | 原逻辑 | 使用约束 |
| --- | --- | --- |
| UnityVersion | 数字段、branch、版本比较、Alpha/Beta/Official 判定 | 原正则只匹配前缀，`2022.3.53f1c1` 会当成 `2022.3.53f1`；不适合完整版本身份、严格输入/安全校验。比较渠道按原字符顺序保留。 |
| 项目常量 | Assets、Temp/UnityLockfile、ProjectSettings/ProjectVersion.txt 及 Hub 偏好键 | Unity 特定；GameCowork 必须写自己的状态，不能按原 Hub 键读写官方注册数据。 |
| 文件名/路径校验 | Windows 保留设备名、字符/长度限制、跨平台校验 | 原实现会拒绝 `%`、反引号、前导空格、尾点/空格；长度用 JS 码元，不能代替规范路径、目录归属、覆盖与碰撞校验。 |
| Unity gitignore | 内嵌模板静态字符串，不通过 JS 求值获取 | 源注释声明 github/gitignore 的 CC0-1.0 与同步日期 2025-12-18。不是当前上游最新版的声明；不要覆盖用户已有 gitignore。 |

安装包 `package.json` 的 `license: CC0-1.0` 仅在清单里记录为包元数据；不据此给所有 SDK、模板、原生程序统一授予许可。每种资源仍保留其实际来源与自己的许可证信息。

## 四域的真实服务与依赖

| 域 / 原始路径 | 已提取的真实逻辑 | 尚缺的独立运行条件 |
| --- | --- | --- |
| project-management · `projectService`、`localProject` | 添加/打开/移除、项目排序和偏好、ProjectVersion/PlayerSettings 读取、根/设置文件 watcher、活动编辑器 socket 映射、VCS 状态 | Hub DI/storage/window/postal、文件系统和 EditorApp、Unity Cloud/VCS/分析服务外围绑定。移除注册条目不等于删除盘上工程。 |
| project-templates · `unityTemplate`、`editorApp` | 内置 `.tgz` / 目录模板扫描、package.json 元数据、版本缓存、本地/已下载/远端模板合并与升级状态；Editor 命令行创建/打开 | Hub tar/fs 适配、Editor 注册/版本/架构、缓存/下载、Hub IPC、官方账号和许可依赖。不能整个类复制后就宣称可运行。 |
| editor-management · `editorManager`、`localInstaller`、`downloadEngine` | 主/次安装位置合并、手动 locate 存储、available-editors.changed、release 模块数据、下载持久/暂停/恢复及 Windows 静默安装/卸载 | 官方原生注册/版本/提权模块、下载状态机外围、HTTP/release 来源、安装器与平台条件。本次没有启动安装或卸载。 |
| unity-licensing · `licenseService`、`@licensing/licensing-sdk` | entitlement 到许可证展示换算、Personal/ULF、申请/导入/更新/归还 SDK 方法、IPC 读写/通知和客户端启动器 | **Unity 专属**账号、entitlement、Unity.Licensing.Client 和官方命名管道。片段只用于了解调用关系，GameCowork 不把本地身份当成 Unity 激活。 |

以上片段详细路径均可在 [_SOURCE-INDEX.md](_SOURCE-INDEX.md) 点击；清单的 chunk 导入是包含该区域的整个 bundle 的导入集合，属于依赖上界，**不是已解析完的区域依赖闭包**。`declaredBindings` 是区域顶部声明的索引，不能当作模块的完整导出表。

## 从真实代码核对的关键细节

- **活动项目不是仅检查锁文件存在。** `ProjectValidatorService.validateProjectNotOpen` 先检查 `Temp/UnityLockfile`，再调用 `hub_fs_default.isFileUnlocked`；存在但能解锁时仍认为未打开。`LocalProject.refreshOpenProjectsCache` 用这个结果建缓存。socket 未明确带工程时，仅一个打开项目才能安全映射；多工程情况不随便猜测。
- **模板身份以 `name` 合并。** `Templates._templatesToTemplateMap`、`_mergeLocalTemplates`、`_mergeRemoteTemplates` 按 package `name` 建 Map 并比较 semver；`displayName@version` 在下载完成时用于分析事件，不是所有缓存/替换操作的主键。
- **模板默认回退是真实内置元数据。** 未找到 Editor 或扫描没有有效模板时返回默认 3D/2D，代码是 0/1；它不代表可以无 Editor 生成完整工程。
- **创建项目由 Editor 处理。** `LocalProjectService.createProject` 取模板 code/tar/name，再交给 `EditorApp.createProject`；0/1 用 `-projectTemplate`，其它标识用 `-cloneFromTemplate`，并保留云组织、Hub IPC 与许可上下文。GameCowork 的独立模板物化与原 Hub 的实际创建入口要分开验证。
- **纯版本类不包含引擎身份。** 原 ID 由版本和架构组成；双引擎项目仍需在 GameCowork 侧保留 Unity/Tuanjie 来源及真实 Editor 路径，不能仅以版本号串选。

提取工具不读取本机账号、许可证、真实项目注册表、机器指纹或凭据，不加载 bundle/native module，不启动 Unity Hub 或许可客户端。原代码里出现的端点、IPC 名称和 JSON 字段均是静态程序文本。
