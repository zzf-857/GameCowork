# 项目模板体系还原（问题 2：预制场景/工程如何内置）

> 日期: 2026-10-01 · 来源: Unity Hub asar 逆向（temp/GameCowork/unity-hub-asar，3196 文件全解包）+ 本机团结编辑器 tgz 实证（只读 tar 列表）+ tuanjie.exe/cowork.exe 字符串交叉。
> 结论先行: **核心模板 = 随编辑器安装的 UPM tgz 包，预制内容在包内 `package/ProjectData~/`（含预热 Library）；Hub 只做枚举/合并/下载，真正解包物化由 Editor 完成**。

## 1. 模板的三种来源与合并（Unity Hub `Templates` 类，完整还原）

```
getTemplatesForEditor(editorVersion, cached=false)
 ├─ _getLocalTemplatesForEditor(version)
 │   ├─ _getTemplatesForEditorVersion   ← UnityTemplateCache 按 editorVersion memoize
 │   │    └─ scanTemplates({editor}\Data\Resources\PackageManager\ProjectTemplates)   [win32 相对 Editor exe: ..\Data\...]
 │   │         · 目录项是 .tgz → extractTemplateFromTar（从 tar 内读 package/package.json）
 │   │         · 目录项是目录  → 直接读 package.json（libcache 目录忽略）
 │   │    └─ 编辑器缺失/无模板 → 兜底 defaultTemplates（com.unity.template.3d code=0 / 2d code=1，READY，v0.0.0）
 │   └─ _getDownloadedTemplates(version)   ← Hub 自己下载过的示例模板
 │         · 目录: {AppData}\UnityHub\Templates\   本机实证存在（manifest.json 当前为 {}）
 │         · 归档: {name}-{version}.tgz；清单: manifest.json = {editorVersion: {dependencies: {templateName: templateVersion}}}
 │         · 损坏自动重置 manifest；下载前查磁盘剩余空间
 │   └─ _mergeLocalTemplates: 按 name 合并，semver gte 者胜
 └─ _getRemoteTemplates(version, cached)
      · LivePlatformAPI.getTemplates([versionBranch]) → https://live-platform-api.prd.ld.unity3d.com/graphql
      · status=DOWNLOADABLE（UI 上带下载箭头的"示例模板"）
      └─ _mergeRemoteTemplates: 同版本合并远端元数据（预览图/图标/可升级标记）；远端更新→可升级态；本地更新→保留本地 tar
```

UI 语义对应截图: **核心模板 = 本地 tgz（READY，无下载箭头）；示例模板 = 远端 DOWNLOADABLE（有下载箭头）**；`(Preview)` 后缀的 displayName 被剥掉并标 isPreview。

## 2. 模板 tgz 内部结构（本机实证: `cn.tuanjie.template.3d-8.1.4.tgz`，4981 项）

```
package/
  package.json          ← 元数据（见下）
  .signature            ← 包签名
  README.md / LICENSE.md / CHANGELOG.md（+.meta）
  Documentation~/       ← 模板文档（Hub"阅读更多"）
  Tests/
  ProjectData~/         ★ 4963 项 = 预制工程本体
      Assets/  Packages/  ProjectSettings/
      Library/Artifacts/…（预热资源缓存，首开快）
```

`package.json` 实测内容（团结 3D 核心模板）:
```json
{ "name": "cn.tuanjie.template.3d", "displayName": "3D", "version": "8.1.4",
  "type": "template", "host": "hub", "unity": "2022.3",
  "description": "This is an empty 3D project that uses Unity's built-in renderer.",
  "dependencies": { "com.unity.collab-proxy": "1.13.5", "com.unity.textmeshpro": "3.0.6", ... },
  "upmCi": {...}, "repository": {...} }
```
本机团结 2022.3.62t16 内置: `cn.tuanjie.template.2d-7.0.4.tgz`、`cn.tuanjie.template.3d-8.1.4.tgz`、`cn.tuanjie.template.universal-2d-2.1.3.tgz`（路径 `E:\TuanJieAllVersion\2022.3.62t16\Editor\Data\Resources\PackageManager\ProjectTemplates\`，旁有 `libcache/` 供扫描忽略）。

## 3. 创建项目时的物化流程

- **正向（新建）**: Hub `ProjectService.createProject` → 若无已连接编辑器，`editorManager.getEditorApp({version, architecture}).createProject(fullProjectPath, selectedPackages, templateName, orgId, cloudProjectId, onError)` —— **实际解包由 Editor 进程完成**（编辑器 UPM 识别 `type: template` 包，把 `ProjectData~/` 内容物化为新工程根并按 `dependencies` 生成 Packages/manifest.json）；Hub 随后 `addToRecentProjects`、注册 ProjectSettings 文件监听（`ProjectSettings.asset` 触发创建完成埋点）。
- 路径长度预检: `getPathLengthRequiredForTemplateExtraction` 取 tgz 内 `package/ProjectData~` 最长路径 + 53 字节临时目录余量（Windows MAX_PATH 防线）。
- **反向（把现有工程打包成模板）**: `createTemplateFromProject` 完整还原——拷贝 `Assets, ProjectSettings, Packages, Library/Artifacts, Library/ArtifactDB, Library/SourceAssetDB` → 删 `ProjectVersion.txt` → 从 `Packages/manifest.json` 生成 `package.json.dependencies`（`m_EditorVersion` 正则取版本）→ 系统 tar `-czf -T files.txt` 打包。
- **原版团结 Cowork**: `tuanjie.exe` 注册 `project.getTemplates / project.downloadTemplate`（+事件 `project.onTemplateDownloaded/onTemplateDownloadError`）——Hub 形态与 Unity Hub 同构（T3 §2）；壳 cowork.exe 的 `tjhub/getTemplates/downloadTemplate/getUniqueProjectName` 透传到该层。

## 4. GameCowork 现状对照与补齐清单

| 能力 | 原版/Unity Hub | GameCowork 现状（project_templates.rs） | 补齐动作 |
|---|---|---|---|
| 核心模板枚举 | 扫描 Editor `ProjectTemplates\*.tgz`，tar 内读 package.json | 已做（读真实本地 tgz，版本/SHA 记录） | 无需 |
| 模板元数据 | name/displayName/version/type/unity/description/**dependencies**/preview png | 部分（版本/SHA） | 从 tgz 内 package.json 取 displayName/description/dependencies/`Documentation~`；预览图取包内 png 或包名同名 png |
| 示例模板下载 | 远端清单 + `{AppData} Templates\{name}-{ver}.tgz` + manifest.json 记账 + 磁盘空间预检 + 损坏重置 | 未做（后期阶段第三方 Provider 之外的自有 CDN 可选） | 沿同一 manifest.json 模式，指向自有源 |
| 创建物化 | Editor UPM 完成 ProjectData~ 物化 | 自有导入链（保留原 manifest/SampleScene 字节，已验收） | 可直接读 `ProjectData~/` 语义对齐: 拷贝 Assets/Packages/ProjectSettings（+可选预热 Library）→ 由 manifest.json.dependencies 生成 Packages/manifest.json |
| 反向打包模板 | createTemplateFromProject（六目录集 + 删 ProjectVersion.txt + tar） | 未做 | 全流程已在本文 §3，可直接照抄 |
| 兜底模板 | code 0/1 内置最小 3D/2D | 未做 | 作为"无编辑器/无模板"时的明确 fallback |
| 路径长度预检 | tgz 最长路径 + 53 余量 | 未做 | Windows 防线，照抄 |

红线提醒: 模板 tgz 是编辑器自带资产，GameCowork 只读枚举/解包到**自有临时目录**，不改原安装、不改名分发（AGENTS 既有规则）。
