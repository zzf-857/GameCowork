# LicensingClient .NET 反编译 — IPC 协议（T2/IPC-PROTOCOL）

> 来源: `hub\LicensingClient\Tuanjie.Licensing.Ipc.dll` 完整反编译（ilspycmd，.NETStandard 2.1，程序集版本 **1.14.0**）。
> 原始 C#: `F:\AI\AgentMake\temp\GameCowork\licensing-decomp\Tuanjie.Licensing.Ipc.cs\*.decompiled.cs`（temp 保留，不入库）。
> 定位: 这是 **Tuanjie Editor / 团结编辑器 ↔ 许可服务** 的消息协议；不是壳↔Hub 的 JSON-RPC（见 tjhub-api.md 修正）。

## 1. 传输与分帧

| 项 | 值 |
|---|---|
| 载体 | 命名管道（`NamedPipeServerStream`，Byte 模式，`PipeOptions.CurrentUserOnly`，缓冲 16384） |
| 管道名（主通道） | `Tuanjie-LicenseClient-{Environment.UserName}`（Windows 直接用；非 Windows 经 `GetServerPipePath` 转 UD 路径） |
| 管道名（通知通道） | 主通道名 + `-notifications` 后缀（`IpcConst.NotificationsChannelSuffix`） |
| 分帧 | **消息以 `\f`（0x0C, form feed）结尾**（`IpcConst.MessageDelimiter`），逐 4096B 缓冲扫描分隔符切帧 |
| 编码 | UTF-8（`IpcConst.ByteEncoding`） |
| 序列化 | Newtonsoft.Json，**camelCase**（ProcessDictionaryKeys=false, OverrideSpecifiedNames=false），NullValueHandling.Ignore |
| 消息识别 | 每条 JSON 的顶层 **`messageType`** 字段 → 类型映射表反序列化（未知类型抛 `Unsupported messageType: {x} in version {v}`） |
| 版本协商 | `HandshakeRequest.ProtocolVersion` ↔ `IpcConst.IsProtocolVersionSupported`，协议版本 **"1.13"**，支持集 1.0–1.13 |

## 2. 消息信封

```jsonc
// 请求（Message 基类字段, 序列化为 camelCase）
{ "messageType": "EntitlementsRequest", "id": "...", "authorizationCheck": "...",
  "productType": "...", "lastActivationDate": 1712345678.0, /* 各消息自有字段 */ }

// 响应（Response : Message）
{ "messageType": "EntitlementsResponse", "responseCode": 200, "responseStatus": "...", /* payload */ }

// 多状态响应（MultiStatusResponse<T> : Response, T:SubStatus）
{ "messageType": "UpdateLicenseResponseV2", "responseCode": 200,
  "results": [ { "id": "...", "statusCode": 200, "message": "..." } ] }

// 错误（ ApiException → Response("ApiErrorResponse") ）
{ "messageType": "ApiErrorResponse", "responseCode": 500, "responseStatus": "..." }
```

`IpcResponseCode` 枚举: `200 OK, 400 BadRequest, 401 Unauthorized, 403 Forbidden, 404 NotFound, 415 UnsupportedMediaType, 500 InternalServerError, 501 NotImplemented, 502 BadGateway, 1500 GenericLicensingError, 2000 IpcSerializationError, 2001 IpcSendError, 0 Unknown`。

## 3. 消息类型全表（42 个，messageType → 字段）

### 握手/基础
| messageType | 方向 | 字段 |
|---|---|---|
| `HandshakeRequest` | 客户端→服务 | `protocolVersion, userAgent, externalCorrelationId` |
| `HandshakeResponse` | 应答 | `protocolVersion, sessionId, context(dict), assemblyProductVersion, machineId, correlationId` |
| `ProductNameRequest/Response` | 双向 | req: `value`；resp: 无 payload |
| `AccessTokenRequest/Response` | 双向 | req: `value`(token), `expiration`(double epoch) |
| `Notification` | 服务→客户端 | `notificationType, title, message, sentDate, details`（见 §4） |
| `ApiErrorResponse` | 应答 | = Response |

### 许可获取/更新/归还（核心域）
| messageType | 请求字段 | 响应字段 |
|---|---|---|
| `EntitlementsRequest` | `entitlements[](id), forceUpdateLicense` | `entitlements{ id→status 映射 }` |
| `EntitlementDetailsRequest` | `entitlementIds[], packageEntitlementIds[], productName, includeCustomData` | `entitlementGroups[]`、`freeEntitlementIds[]`、`allowedProjects[]`、`whitelistFeatures[]` |
| `UpdateLicenseRequest`（V1） | `accessToken, orgId, projectId, licenseTypes[], forceUpdateLicense` | 无 payload |
| `UpdateLicenseRequestV2` | 同 V1 | `results[]`(SubStatus: `id, statusCode, message`) |
| `ReturnLicenseRequest` | `accessToken` | 无 payload |
| `ReturnEntitlementGroupRequest`(V1) | `entitlementGroupIds[]` | `returnEntitlementGroupResults[]`（含 `entitlementGroupId`） |
| `ReturnEntitlementGroupRequestV2` | 同 V1 | `results[]`(SubStatus) |
| `BorrowLicenseRequest` | `days`(int) | 无 payload |
| `ReturnBorrowRequest` | `isFloatingFallbackRequired, leaseToken` | 无 payload |

LicenseTypes 枚举: `Floating / Assigned / ULF`。

### 手动/离线激活
| messageType | 请求字段 | 响应字段 |
|---|---|---|
| `ManualLicenseActivationRequest` | `productName, productVersion, filePath`(.ulf) | `filePath` |
| `LicenseImportRequest` | `licensePath` | 无 payload |
| `ULFActivationRequest` | `serial, forceUpdateLicense` | 无 payload |
| `AlfGenerationRequest` | `tuanjieVersion, filePath`(.alf 输出) | `filePath` |
| `SerialNumberValidationRequest` | `serial` | `isValid` |

### 席位/组织管理
| messageType | 请求字段 | 响应字段 |
|---|---|---|
| `GetSeatsRequest` | `orgId` | `seats[]`: `{seatId, subscriptionName, organizationId, organizationName, startDate, endDate, activationsLeft, isActivatedOnThisMachine}` |
| `ActivationManagementRequest` | `activate`(SeatSelection), `deactivate`(SeatSelection), `forceUpdateLicense`；SeatSelection=`{all:bool, ids[]}` | `results[]`(SeatManagementResult: +`seatId`) |
| `EntitlementGroupsDetailsRequest` | 无 | `entitlementGroupsDetails[]`: `{productName, productType, entitlementGroupId, entitlementGroupIdHash, licenseType, licenseFilePath, isManual, startDate, expirationDate, subscriptionEndDate, updateDate, status, validationErrors[]{message, code}}` |
| `FeatureStatusRequest` | `feature`（枚举仅 `Borrow`） | 无 payload |

### 组结构（EntitlementDetailsResponse 内）
```
EntitlementDetailsGroupData: { entitlementGroupId, entitlementGroupIdHash, productName, productType,
                              licenseType, expiration(long? epoch), matchedEntitlements[] }
EntitlementInfo:             { entitlementId, isPackage, count, customData }
```

## 4. 服务端主动通知（`-notifications` 通道）

`Notification` 信封: `notificationType, title, message, sentDate, details[]`。

| NotificationType | Details 元素字段 |
|---|---|
| `LicenseExpired` | `entitlementGroupId, productName, productType, reason, endDate` |
| `LicenseOfflineValidityEnding` | `entitlementGroupId, productName, productType, endDate` |
| `LicenseUpdate` | `entitlementGroupId, productName, productType, updateType, reason` |

## 5. 对 GameCowork 的启示

1. 该协议是**原厂许可体系**，GameCowork 本地模式不实现许可，但 `tjhub/getLicenses|activateLicense|...` 前端若要显示真实数据，可按本表**数据形状**自造本地等价物（如 EntitlementGroupsDetailsResponse 的 UI 字段直接对应 AddLicenseDialog 展示）。
2. `HandshakeRequest/HandshakeResponse` 的 `machineId/sessionId/correlationId` 三元组是通用 IPC 握手设计，可借鉴为 GameCowork 任何命名管道协议的开场。
3. `\f` 分帧 + `messageType` 判别 + camelCase + 版本协商集合 —— 与壳侧 `\r\n` 帧的 core 协议并存，说明原厂两套进程间协议风格不同；GameCowork 已有统一 SSE/HTTP 面，无需引入第二套。
4. 通知通道独立管道（`-notifications` 后缀）模式：主通道请求/响应、副通道事件广播，可借鉴。
