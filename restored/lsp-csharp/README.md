# GameCowork 本地 C# LSP 资源

此目录是 [csharp-ls 0.21.0](https://github.com/razzmatazz/csharp-language-server/tree/0.21.0) 的冻结维护输入。`runtime/` 的 298 个文件从已核对的公开 NuGet 安装逐字节复制，没有改名、修改或重新编译官方服务；它不是原 Tuanjie Cowork 的 LSP 二进制。功能接入与实际验收统一见 [RESTORE_STATUS.md](../../RESTORE_STATUS.md)。

## 来源与完整性

- NuGet：`https://api.nuget.org/v3/index.json`，固定 `csharp-ls/0.21.0`；原包、`.nuspec`、签名、SHA512 和实际依赖文件保留在 `runtime/.store/`。
- 包内 repository commit：`e1f0534a843db516024dc0b2a74df27b9e24adc6`。
- [dependency-ledger.json](dependency-ledger.json) 记录原 298 项 SHA256/大小、NuGet 包 SHA256/SHA512、包内 55 项依赖声明和原准备清单 SHA256。依赖声明来自官方包的 `.deps.json`，不表示 GameCowork 另外下载了这些包。
- [LICENSE](LICENSE) 是官方 0.21.0 tag 与上述 commit 的同字节 MIT 许可证，保留 Saulius Menkevičius 的版权；来源 URL 与 SHA256 在清单中。官方包自带的 README、CHANGELOG、签名及声明保持原字节，各依赖仍遵循各自许可证。
- [dependency-ledger.sha256](dependency-ledger.sha256) 只包含清单的 64 位 SHA256，供宿主编译时固定可信清单。HTTP 请求不能提供服务 EXE、清单哈希或缓存目录。

原安装器生成的 `.nupkg.sha512` 与完整签名包字节的 SHA512 不同，两者保持原样并分别记为 `cachedArchiveSha512` 与 `rawArchiveSha512`；`.nupkg.metadata` 的签名无关内容哈希另记为 `nugetContentHash`（[NuGet 说明](https://github.com/NuGet/Home/wiki/Nupkg-Metadata-File)）。2026-10-01 再次从官方 NuGet URL 下载的包与冻结包逐字节相同；完整性验收使用各文件 SHA256 和编译固定清单，不把缓存 SHA512 当作完整包字节哈希。

## 运行与装配

`runtime/csharp-ls.exe` 的 dotnet tool shim 指向相对 `.store/.../CSharpLanguageServer.dll`，复制整个 `runtime/` 后可重定位。运行需要本机 .NET 10 SDK，SDK 不随此目录分发；服务不会自动安装 SDK 或恢复工程依赖。必须保留隐藏的 `.store` 目录，不能只复制 EXE。

`tools/build-local.ps1` 会在构建前核对本目录，把 `runtime/`、清单、哈希、许可证与本说明一同复制到 `app/lsp-csharp/`，再核对暂存资源；所有文件也进入最终 `package-manifest.json`。安装包运行路径必须使用自己的 `app/lsp-csharp/runtime/csharp-ls.exe` 和 `app/lsp-csharp/dependency-ledger.json`，不依赖此源码目录或临时准备目录。

宿主 `Config` 使用绝对的 `executable`、`ledger`、编译固定的 `ledger_sha256` 和应用数据根。每个工作区的缓存由宿主放在应用数据根下，不放入此资源目录或用户工程。服务只在用户显式启用或已启用工作区的文档查询时启动。缺少 `.csproj/.sln` 时明确失败；SDK/PackageReference 工程需要已经准备的 restore metadata。Unity classic 工程使用真实生成的项目和所选 Editor 的显式程序集引用，不要求其天然不存在的 `obj/project.assets.json`。服务不生成工程、不联网 restore。

在项目根目录可独立核对资源和运行重定位前置：

```powershell
node tests/lsp-resource-contract.mjs --self-test
node tests/lsp-runtime-smoke.mjs --runtime ./restored/lsp-csharp/runtime/csharp-ls.exe --ledger ./restored/lsp-csharp/dependency-ledger.json
```

前置验证只创建统一 `temp/GameCowork` 下的自有 SDK 10 工程，使用清空的 NuGet sources 和独立缓存。资源通过或真实服务语义通过都不能代替产品 GUI、Unity 工程及装配版验收。

产品验收使用真实 Rust 宿主、本目录服务和两代维护前端；Core 使用明确标记的 fixture，不调用模型或真实额度：

```powershell
node --test tests/frontend-lsp-contract.mjs tests/frontend-lsp-lifecycle-contract.mjs
node tests/lsp-e2e.mjs
node tests/lsp-unity-e2e.mjs --editor F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe
# 统一装配后，实际使用 app 的 EXE、前端与冻结 LSP 资源
node tests/lsp-e2e.mjs --packaged
node tests/lsp-unity-e2e.mjs --packaged --editor F:/UnityEditorVersion/2022.3.51f1c1/Editor/Unity.exe
```

`lsp-e2e` 包含全文未保存同步、悬浮提示、定义、引用、双工作区、版本/代际、持久化失败与冷启动的新浏览器验证；`--skip-browser` 只保留 HTTP 与冷宿主重启，不能作为 GUI 验收。`lsp-unity-e2e` 让所选 Editor 在独立工程中调用其真实经典工程生成器，保留元数据 SHA，再验证自有 MonoBehaviour 和 Unity API；不改用户工程或全局 Editor 偏好。测试报告记录实际运行路径，装配参数不会仅换标签。

当前语言范围是 C# 的悬浮提示、工程内定义与引用。服务的就绪标记来自真实工程加载；工作区外的定义、程序集反编译位置和缺失的工程依赖返回明确失败。诊断、补全、重命名与其他语言未在本阶段接入。开启偏好可以恢复，但冷启动只注册状态，直到已启用工作区的实际文档同步/查询才启动自己的服务进程；关闭、停用和重开均清理或作废旧文档与 Job。
