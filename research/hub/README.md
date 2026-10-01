# hub/ — Tuanjie Hub 授权组件（原样归档，未深度逆向）

`hub/`（217MB）是团结引擎（Tuanjie，Unity 中国版）的 **Hub 授权/许可链路组件**，本还原工程
不对其做深度逆向（除非作者另行委托），仅做成分鉴定：

| 文件 | 鉴定 |
|---|---|
| `tuanjie.exe` | Hub 主程序 |
| `LicensingClient/*.dll` | .NET 授权客户端（ICSharpCode.SharpZipLib、Microsoft.Extensions.* 全套）——需要时可用 ILSpy/dnSpy 直接反编译为近似 C# 源码 |
| `tuanjie-sl.v2c` | 许可证书文件（v2c 格式） |
| `hasp_update.exe` | Sentinel HASP 许可更新工具 |
| `NativeProxyHelper.dll` | 原生代理 |
| `PocoFoundation.dll` / `pcre2-8.dll` / `zlib1.dll` | 原生依赖 |
| `VisualStudioInstallChecker.exe` | 环境检查 |
| `msvcp140/vcruntime140*.dll` | VC 运行库 |

## 与主程序的关系

cowork.exe 二进制中有 `TJHubRoute` 前端 chunk 与 hub 授权状态联动；
登录态/许可证有效性决定 `AddLicenseDialog` / `NoLicenseDialog` 的展示。

## 说明

- 如需还原此层：`LicensingClient` 全部为 .NET 程序集，ILSpy 一键反编译即可（未做）。
- `tuanjie-sl.v2c` 与 `hasp_update.exe` 涉及第三方商业授权体系（Sentinel HASP），请勿分发改组件。
