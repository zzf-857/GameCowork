# LicensingClient .NET 反编译 — 客户端入口与 CLI 面（T2/CLIENT-SURFACE）

> 来源: `Tuanjie.Licensing.Client.decompiled.cs`（11337 行，.NET 8 win-x64）+ deps.json/config。原始 C# 在 temp/licensing-decomp/。
> 定位: `Tuanjie.Licensing.Client.exe` 是许可服务进程——由 **Tuanjie Hub（tuanjie.exe）** 管理，也接受编辑器/命令行直连；壳 cowork.exe 不直接与它说话（壳走 tuanjie.exe 的 JSON-RPC，见 tjhub-api.md 修正）。

## 1. 两种运行形态

1. **管道服务模式**（默认）: 监听命名管道（主 `Tuanjie-LicenseClient-{user}` + 通知 `-notifications`），按 messageType 分发到 19 个 Controller（`InvokeControllerHandleRequest<TMessage>`，无控制器返回 501 NotImplemented）。
2. **一次性 CLI 模式**: 41 个选项（CommandLine 库），退出即走；分五组（`ExecuteGenesisLicensingCommand / ExecutePackageCommand / ExecuteLicenseActivationCommand` 等互斥动作组）。

## 2. CLI 选项全表（[Option] 特性逐条）

### 诊断/维护
`--debug`（文件+控制台调试日志）· `--disable-file-watcher`（禁许可/配置文件变更重载）· `--showContext`（打印当前用户身份上下文并退出）· `--showEntitlements` / `--showAllEntitlements` / `--showRemoteEntitlements`（列出授权，本机/全机/远端）· `--syncEntitlements`（从服务器复制授权并退出）· `--packages-download-acl` / `--packages-show-acl`（包 ACL 列表）

### 管道服务
`--namedPipe {name}`（自定管道名；默认 `Tuanjie-LicenseClient-{user}`）· `--disable-auto-shutdown`（禁自动退出）

### 浮动/借出许可
`--acquire-floating`（获取浮动租约）· `--renew-floating {token}` / `--return-floating {token}`（续/还租约）· `--borrow-license {days}`（借出 N 天，Hidden）· `--return-borrow {token}`（提前归还，Hidden）

### 会话/席位
`--activateSession`（为指定组织激活会话）· `--destroySession --sessionId {guid}` · `--organization {org}` · `--activate-all` / `--deactivate-all`（需 --accessToken 或 --username+--password）· `--accessToken {t}`（缺省读 Hub 的 accessToken 文件）· `--username` / `--password`（Hidden）

### 离线/手动激活
`--license {path}` · `--generate-activation-request`（生成激活请求文件；配 `--activation-folder-path --activation-product-name --activation-product-version`）· `--generate-alf-request`（为 `Tuanjie_lic.ulf` 离线手动激活生成 .alf；配 `--activation-file-path`）

### 其它（Hidden）
`--get-access-token`（从 Genesis 取 token，需 --username/--password/--cloudEnvironment）· `-c|--cloudEnvironment {suffix}`（远端 URL 后缀环境）· `-p|--product-type {t}`（默认空）

## 3. 许可文件与目录布局（Platform.dll TuanjiePaths）

| 路径 | 平台 | 用途 |
|---|---|---|
| `%PROGRAMDATA%\Tuanjie` | Windows | TuanjieCommonDirectory（可被 `TUANJIE_COMMON_DIR` 覆盖） |
| `%LOCALAPPDATA%\tuanjie\Tuanjie` | Windows | TuanjieUserDirectory（用户级） |
| `/Library/Application Support/Tuanjie` | macOS | Common；`~/Library/Application Support/TuanjieHub` = HubUserDirectory |
| `{Common}\Tuanjie_lic.ulf` | 全平台 | **ULF 许可文件**（UlfLicensePath） |
| `{User},{Common}`(+Linux 额外) | | LicensePaths 搜索集 |
| `{LicensePaths}\licenses\delegations` | | 委托许可 |
| `{Common}\config\services-config.json` / `{User}\config\user-services-config.json` | | 服务配置（远端可下发缓存 `{User}\config\{env}.json`） |
| `%APPDATA%\TuanjieHub`（Win） | | HubUserDirectory |
| 日志目录 | | 环境变量 `TUANJIE_LOGS_DIR` 指向 |

环境变量: `TUANJIE_COMMON_DIR`（通用目录覆盖）、`TUANJIE_LOGS_DIR`（日志）。

## 4. Genesis 云面（Genesis.dll）

配置键 → 默认（可被 `services-config.json` 覆盖）:
`core` → `https://core.tuanjie.cn` · `license` → `https://license.tuanjie.cn` · `activation` → `https://activation.tuanjie.cn` · `identity` → `https://api.tuanjie.cn`；登录 `GenesisAuthentification:Url` 默认 `{core}/api/login`。

Routes 常量: `/api/users/me`（用户信息）· `/licenses/v1/seats`（席位）· `/licenses/v1/context`（上下文）· `/update/poll`（ULF 更新轮询）· `/api/transactions`（ULF 事务）· `/license.fcgi`（ULF 许可）· `/v1/users/{id}/ccpa/irs/opt`。
内容类型族: `application/json`、`application/problem+json`、`text/xml`；测试头 `sc-test-client`。
核心类型: `GenesisClient(ClientFactory)`、`AuthProviderFactory`、`CacheTokenProvider`、`ExternalTokenProvider`、`DynamicGenesisConfiguration`、`SeatManagementStatusCode`。

## 5. 其余 DLL 职责一句话

| DLL | 职责 | 关键证据 |
|---|---|---|
| `Tuanjie.Licensing.Ipc` | 消息协议（见 IPC-PROTOCOL.md），.NETStandard 2.1 供多端复用 | 42 messageType、`\f` 分帧 |
| `Tuanjie.Licensing.Platform` | 平台/路径/机器身份/管道工具 | TuanjiePaths、GetServerPipePath |
| `Tuanjie.Licensing.Infrastructure` | 日志/DI/配置基础设施 | Microsoft.Extensions.* 包装 |
| `Tuanjie.Licensing.EntitlementResolver` | **许可文件（.ulf, XML+XMLDSig）解析与授权判定** | 类型含 `Signature/DSAKeyValueType/DigestMethodType/KeyInfoType/License/EntitlementGroup/ContextValidator` |
| `Tuanjie.Licensing.EntitlementContext` | 授权上下文装配（当前用户可用授权视图） | Context 系列 |
| `Tuanjie.Licensing.Genesis` | 云 API 客户端（上节） | GenesisClient/Routes |
| `Tuanjie.Licensing.Server.Shared` | 许可服务器（本地 license server）共享类型 | Server.Tests 引用 |
| `Tuanjie.Licensing.Analytics` | 许可埋点 | 独立小程序集 |
| `Tuanjie.ProxyHelper` | 系统代理探测辅助（供云面 HTTP） | 153 行 |
| `bindings.dll` | 原生互操作 shim（ilspycmd 反编译 0 行，纯 P/Invoke 或 native） | — |
| `CommandLine.dll` | 第三方 CommandLineUtils（命令行解析库） | [Option] 特性来源 |

## 6. 部署形态

`Tuanjie.Licensing.Client.deps.json`: `.NETCoreApp,Version=v8.0/win-x64`，除 `Tuanjie.Licensing.*` 无第三方依赖（Newtonsoft.Json 等以自包含文件随目录分发）。运行时文件齐套（hostfxr/hostpolicy/coreclrclr 等），旁有 `hasp_rt.exe`、`haspvlib_36049.dll`（Sentinel HASP 运行时）与 `msquic.dll`（QUIC）。

## 7. 对 GameCowork 的启示

1. GameCowork **不实现**该许可体系（本地模式无许可，AGENTS 红线）；但 AddLicenseDialog/TJHubRoute 前端若需本地假数据，字段形状照 IPC-PROTOCOL.md §3。
2. 41 个 CLI 选项展示了"服务 + 一次性 CLI 双形态"的进程设计，GameCowork 的 worker（unity-insight）已用类似思路，可参考其选项命名与互斥动作组划分。
3. `TUANJIE_COMMON_DIR`/`TUANJIE_LOGS_DIR` 环境变量式目录注入与 GameCowork 的 `GAMECOWORK_*` 家族同构，验证隔离思路一致。
