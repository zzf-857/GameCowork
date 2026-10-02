# ⚠️ Unity 许可证域（Unity 专属，仅协议形状参考）

> **显式标注**: 本文档描述的是 **Unity Technologies 的许可体系**（Unity Licensing Client V1 + Hub 内嵌
> `@licensing/licensing-sdk`）——它面向 Unity 的许可流程。Tuanjie/团结的 LicensingClient（T2 已反编译）有相似的管道和消息结构，属于同族实现的推断；
> GameCowork 本地模式**没有也不需要许可体系**，本篇仅用于：①对照 Tuanjie 分支血缘（哪些是分支保留的原样）、
> ②了解许可证展示字段和实际依赖。许可证申请/激活不是 GameCowork 本地身份功能。
> **红线**: 不运行 Unity.Licensing.Client、不读取/记录任何本机许可文件内容（Unity_lic.ulf/alf）、
> 机器指纹、序列号或凭据；不接入 activation.unity3d.com 等原厂端点。
> 来源: unity-hub-asar 主服务束（`src/main/services/licenseService/licensingSdk.ts`、`licenseServiceCore.ts`
> 的 //#region 原始路径保留）+ `E:\Unity Hub\EXE\UnityLicensingClient_V1\`（.NET 客户端在场，未反编译——
> 其结构与 T2 的 Tuanjie.Licensing.* 同族）。

## 1. 组成

| 组件 | 说明 |
|---|---|
| `UnityLicensingClient_V1/Unity.Licensing.Client.exe` | .NET 许可客户端（随 Hub 分发；BouncyCastle/SharpZipLib 依赖可见） |
| `@licensing/licensing-sdk`（JS） | Hub 内嵌 SDK（npm 包，chunk 内保留其 package.json：依赖 find-process/async-on-exit/axios；scripts 含 `cmd:generateAlf`、`cmd:forceKillClient "<path>/Unity.Licensing.Client.exe"`——SDK 负责拉起/复用/强杀客户端进程） |
| Hub licenseServiceCore | 业务包装：把 entitlement 组换算成"许可证"供 UI 用 |

## 2. IPC 管道族（Tuanjie 分支同源实证）

```
主通道:   Unity-LicenseClient-{os.userInfo().username}     ← Tuanjie: Tuanjie-LicenseClient-{user}（T2）
副通道:   Unity-LicenseClient-{nanoid()}                   （随机后缀备用通道）
通知通道: 主/副通道名 + "-notifications"
```

- SDK `LicensingSdk`: `getConnectedPipeName / launchAndConnectToPipes / reconnect / reconnectToNotificationPipe /
  disconnectNotification`——**SDK 负责发现或拉起客户端再连管道**（连接失败归一为 ConnectionError，Windows 下
  匹配 `Failed to connect to pipe: 'Unity-LicenseClient...` 触发进程信息收集上报）。
- Hub 自身另有 `UnityIPCServer("hubIPCService")`（编辑器 socket 接入），与许可管道是两套。

## 3. SDK 方法面（LicensingSdk，31 方法全录）

`setAccessToken`、`getMachineId`、`getCorrelationId`、`connect/reconnect/dispose`、
**`activateUlfLicense`、`activateAllEntitlementBasedLicenses`、`generateEntitlementAlf`、`generateUnityAlf`、
`importLicense`、`returnEntitlementGroup(s)`、`updateAllLicenses`**、
`getAllEntitlementGroups`、`getAllRemoteEntitlementGroups`、`validateSerialNumber`、
**`borrowLicense` / `returnBorrow`**（浮动借出/归还）、
`checkEntitlements / checkEntitlement / checkEntitlementDetails / checkPackageEntitlements`（能力校验四档）、
`onLicenseUpdate / onLicenseExpired`（通知订阅）。

（ALF=Active License File 许可请求文件、ULF=Unity License File 许可文件——流程: generate*Alf 生成请求 →
离线/在线激活 → importLicense 导入 ULF；与 T2 的 Tuanjie.Licensing.Ipc 42 messageType V2 族一一对应。）

## 4. 许可类型与判定（licenseServiceCore）

```
LICENSE_TYPES = { Enterprise, Personal, Plus, Pro, Education, Trial, Industry, IndustryTrial, ASSET_STORE, Unknown }
```

- **ULF 有效性**: `includeValidUlf = licenses.some(l => l.licenseType === LicenseType.ULF && l.valid)`。
- **EGL（教育批量许可）判定**: `label === Education && groupId.startsWith("E4")`（EGL_PREFIX="E4"）。
- **浮动许可**: `isFloatingEnabled()` 依据本地设置键 `LICENSING_SERVICE_BASE_URL`（自建浮动服务器地址）；
  激活成功后分析事件带 `floating` + `license_type`。
- 换算链: `getValidEntitlementGroups → filterInvalidAndNonSupportedEntitlementGroups →
  convertEntitlementGroupsIntoLicenses`（entitlement 组 → UI 许可证列表）；`matchIdlPeWithUlfPe`（IDL/ULF 个人版配对）。
- 错误族 `LICENSE_ERRORS`: `ERROR.LICENSE.FAILED_ACTIVATING_PERSONAL_LICENSE`、`ERROR.LICENSE.INTERNET_CONNECTION_ISSUE`、
  `ERROR.LICENSE.SERVER.GE*`；UI 侧另有 stickyLicenseErrors（粘性错误驻留）与 entitlementBasedActivationError。

## 5. 行为联动（Unity 专属）

- **装好编辑器自动激活个人版**: licenseService 订阅 `AVAILABLE_EDITORS_CHANGED` → `activateUlfPeIfRequired()`
  ——这是截图"许可证"页背后最明显的自动化行为。
- 登出时回收客户端进程（killExternalClientProcess: findProcesses("Unity.Licensing.Client") 且 bin 属 SDK 管辖路径 → SIGINT）。
- 客户端路径按平台拼装: win32 `{binFolder}/{folderName}/Unity.Licensing.Client.exe`、darwin `{folderName}.app/Contents/MacOS/...`。

## 6. GameCowork 的使用边界

1. **不能伪造有效许可**：初期对照曾记录本地占位回执 `{isValid:true, licenses:[], mode:"local"}`，这不证明 Unity 编辑器具备许可。当前产品回执和 UI 以实际源码及 [RESTORE_STATUS.md](../RESTORE_STATUS.md) 为准；字段命名可对照 `convertEntitlementGroupsIntoLicenses`，展示必须明确 Unity 专属、未在这里查询/激活。
2. **血缘对照仅为推断**：T2 反编译的 Tuanjie.Licensing.Ipc（协议 1.13、\f 分帧、42 messageType、`Tuanjie-LicenseClient-{user}` 管道）和本域相似；仅凭这些结构不能断言整套源码逐项改名或差异完整。
3. 本次未接入 activation.unity3d.com / api.unity.com 许可端点、Unity 账号 OAuth；不能把 Unity 许可流程冒充为 GameCowork 自身许可（AGENTS.md: 本地 UI 身份只表示本地模式，不代替编辑器自身许可）。

## 7. 原代码保留与不可独立运行的原因

40 个 Unity 许可区域现已按原字节保存在 `source-fragments/unity-licensing/`，含 Hub `licenseServiceCore/licenseService/licensingSdk` 和 `@licensing/licensing-sdk` 的请求、响应、IPC、通知、客户端启动器。完整路径、原行号与 SHA 见 [_SOURCE-INDEX.md](_SOURCE-INDEX.md) 和 [_SOURCE-MANIFEST.json](_SOURCE-MANIFEST.json)。

这些 `.js.txt` 仍依赖 Unity SDK、客户端进程/命名管道、官方账号/entitlement、Hub DI 和外围模块，未执行，也未做真实申请/激活。本库不含本机许可或账号数据；可从静态代码了解申请入口及返回形状，但不能独立发出许可证或把本地模式标成已获 Unity 许可。
