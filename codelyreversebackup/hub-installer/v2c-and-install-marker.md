# 安装标记与 Sentinel v2c 结构（T3/v2c-and-install-marker）

> 只描述结构，不复制许可敏感值。来源为只读文件分析。

## 1. `.tuanjie-cowork-install`（24 字节，安装根标记）

内容为**渠道/产品 ID 字符串**: 本机安装 = `dev.codelycowork.desktop`。

- 位置: 安装根目录（`E:\TuanjieCodely\EXE\Tuanjie Cowork\.tuanjie-cowork-install`）。
- 语义: 标记"此处已安装 Cowork"并声明更新渠道（dev 开头 = 开发渠道；推测正式渠道形如 `prod.codelycowork.desktop`——与壳更新通道 stable|canary 呼应）。
- 壳/卸载器/更新器用它定位安装根（process_killer 的 `CODELY_INSTALL_DIR` 即指向此目录）。

**GameCowork 对应物**: app/ 装配已有自己的 package-manifest.json 体系；如需渠道标记，建议同形（一行渠道 ID 文本文件）以兼容未来安装器设计。

## 2. `hub/tuanjie-sl.v2c`（2,243 B，Sentinel HASP 厂商→客户端更新文件）

XML 结构:

```xml
<?xml version="1.0" encoding="utf-8"?>
<hasp_info>
  <haspscope>
    <vendor id="36049"/>          <!-- 团结/友三笛 的 Sentinel 厂商 ID -->
    <hasp id="18446744073709551615"/>  <!-- 2^64-1 = 通配所有该厂商密钥 -->
  </haspscope>
  <v2c>
    ...base64 编码的加密更新载荷（密钥/固件更新指令）...
  </v2c>
</hasp_info>
```

- 用途: 由 `hasp_update.exe`（或编辑器内许可流程）应用到本机 Sentinel HASP 密钥/运行时；`haspvlib_36049.dll` 是 vendor 36049 的运行时库。
- **红线**: 载荷是加密许可数据，本文档不复制、不解码；GameCowork 本地模式不依赖 HASP，复刻时不应引入该组件。

## 3. 许可文件体系速查（与 hub-licensing/ 互参）

| 文件 | 位置 | 生成方 | 用途 |
|---|---|---|---|
| `Tuanjie_lic.ulf` | `{CommonAppData}\Tuanjie\Tuanjie_lic.ulf`（TUANJIE_COMMON_DIR 可覆盖） | LicensingClient（ULFActivation/ManualLicenseActivation/Import） | ULF 浮动/指派许可本体（XML+XMLDSig，EntitlementResolver 解析） |
| `.alf` | 用户指定路径（AlfGenerationRequest.filePath） | LicensingClient | 离线激活请求 |
| `.v2c` | 随安装分发（hub\tuanjie-sl.v2c） | 厂商 | HASP 密钥更新 |
| accessToken 文件 | `%APPDATA%\TuanjieHub`（HubUserDirectory） | Hub 登录 | CLI `--accessToken` 缺省读取源 |
