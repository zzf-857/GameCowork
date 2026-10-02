# Unity Hub 新建项目域（unityTemplateService，2026-10-02）

> 来源: unity-hub-asar 主服务束 + app-CM4KuvRm.js（TemplateService 引用面）+ editor-helper-win32。
> 与 codelyreversebackup/index-and-templates/template-pipeline.md（Unity Hub asar 全解包 + Editor 内置 tgz 实证）
> 互补: 那篇覆盖模板二进制出处与三层合并；本篇补齐**创建流与模板缓存状态机**的代码级事实。只读分析。

## 1. 模板获取（按编辑器版本缓存）

```
getTemplatesForEditor(version)
  ├─ unityTemplateCache.getLocalTemplatesByEditor(version)   # 版本级内存缓存命中
  ├─ _getEditorPath(version)                                 # 该版本编辑器安装路径（installedEditorList）
  └─ _getTemplatesForEditorPath(editorPath)                  # 扫描 <editor>/Editor/Data/Resources/PackageManager/ProjectTemplates/
       └─ "Editor not found, the hub will fall back to default templates"   # 未装编辑器→默认模板回退
```

- 模板条目携带 `template.name` / `template.version` / `template.displayName` / `template.packages[]`
  （createProject 分析事件按 `packages.map(pkg=>pkg.name)` 上报——即截图"核心模板/示例模板"卡片的数据源）。
- 模板二进制 = Editor 内置 UPM tgz（`package/package.json` + `package/ProjectData~/` 预制工程），
  创建由 Editor 物化 ProjectData~——完整实证见 template-pipeline.md（cn.tuanjie.template.* 为其团结分支；Unity 侧为 com.unity.template.*）。

## 2. 远端模板下载状态机（app chunk）

```
DOWNLOAD_STATES: DOWNLOADING → (PAUSED ↔) FINISHED | CLEANUP(取消)
FINISHED  → unityTemplateService.replaceTemplate(editorVersion, template, isUpgrade)
            isUpgrade 时 analytics: templateUpdated { template_id: `${template.displayName}@${template.version}` }
PAUSED    → unityTemplateService.updateTemplateStatus({ editorVersion, template, ... })
CLEANUP   → reportedError = new Error("cancelled")
```

- 模板合并/替换的主标识是 package `name` 并用 semver 比较版本；`displayName@version` 是下载完成时分析事件的 `template_id`，不是所有模板缓存的身份键。
- 对应截图: 卡片右下下载箭头=未下载的远端模板（示例模板/部分核心模板），点击即走此状态机进模板缓存。

## 3. createProject 流（localProject.createProject）

```
localProject.createProject(newProject):
  projectName / location / template / editorVersion ...
  → 创建后 vcsManagementService.getProjectVCSData(fullProjectPath) → { provider }
  → analytics createProject { editor_version, template_id, template_version, local_project_id,
                              source_control_provider: provider ?? "none", packages: template?.packages.map(name) }
```

- 截图右侧表单字段与流程对应: 编辑器版本（必选）→ 模板（必选）→ Unity 组织（云端组织，影响许可归属）→
  项目名称（isValidFilename 校验，app chunk 导出）→ 位置（projectDir 记忆）→ **源代码管理提供程序**（可选，创建后 vcsManagementService 探测/初始化）。
- VCS 提供程序域: Hub 事件 `UVCS_SHOW/UVCS_CONNECTED/UVCS_LOAD_FAILED`（Unity Version Control/PlasticSCM 集成）；
  创建时可选项与创建后自动探测同走 getProjectVCSData。

## 4. GameCowork 对照

- own 的 `tjhub/getTemplates`（Rust catalog 只给基本字段 + packages 由 package.json.dependencies 生成）与
  `createProject`（project_templates.rs tgz 物化 + 取消租约）已同构本域核心链路。
- 缺口对齐项: ①远端模板下载状态机（下载/暂停/替换/升级）own 未做（GAPS-AUDIT D ❌，本篇补齐其状态机契约）；
  ②"默认模板回退"（未装编辑器时的兜底元数据）own 未做；③按 package `name` 合并并用 semver 判断升级的替换语义。默认元数据本身不能无 Editor 创建工程。

## 5. 已保留的实际创建链路

[_SOURCE-INDEX.md](_SOURCE-INDEX.md) 中 `project-templates` 保存完整 `scanTemplates`、`extractTemplateFromTar`、`unityTemplateService` 和 `EditorApp`；`project-management` 保存 `LocalProjectService`。原创建入口通过 Editor 命令行：0/1 模板用 `-projectTemplate`，tar/name 用 `-cloneFromTemplate`，仍依赖 Hub IPC、官方许可/云上下文。GameCowork 不能只复制这一类就声称完整创建可用；本地模板物化链路仍需要自己验证。
