# 原版 Codely 存储/配置键布局（实测观察）

> 依据: 本机 `~/.codely` 实际目录、`cowork-settings.json`/`data.json` 实测键、
> core 源码字符串。你的对应位置: `~/.gamecowork`、`%LOCALAPPDATA%\GameCowork`。

## 1. `~/.codely/`（原版 core+壳数据根）

| 项 | 说明 |
|---|---|
| `config.yaml` | core 基础配置(55B, 极简) |
| `settings.json` | core 设置(2.2KB) |
| `cowork-settings.json` | **壳键值存储**(登录态/偏好, 见 §2) |
| `cowork-settings.json.lock` | 写锁 |
| `cowork-side-projects.json` | 侧边项目列表 |
| `data.json` | 引导/特性标记: `drillCompleted, drillSteps[], seenFeaturesTauri[]` |
| `ide-settings.json` | IDE 偏好 |
| `recent-projects.json` | 最近项目 |
| `app.lock.meta.json` | 壳实例锁元数据 |
| `tunnel-machine-canonical-id` / `tunnel-machine-instance-id` | 远程隧道设备身份 |
| `.configs/` | remote-*.yaml(远程配置) |
| `Default/` | WebView2/浏览器 profile 数据 |
| `dev_data/` | 开发态数据 |
| `index/` | 索引数据 |
| `logs/` | `cowork-YYYY-MM-DD.log`(壳), `core-YYYY-MM-DD.log`(core) |
| `projects/` | 项目级状态 |
| `sessions/` | 会话数据 |
| `updates/` | 更新缓存 |

## 2. `cowork-settings.json` 键（壳属, 你壳需对齐的设置面）

| 键 | 类型/含义 |
|---|---|
| `ContinueAccessToken` / `ContinueRefreshToken` | JWT 登录态 |
| `ContinueAccountId` / `ContinueAccountLabel` | 账号邮箱/显示名 |
| `PetGuides` | 桌宠引导(JSON 字符串, 数组) |
| `PetVisible` | 桌宠可见 |
| `enableTunnel` | 远程隧道开关 |
| `keepAwake` | 保持唤醒 |

（你的本地模式已用本地身份弱化此面；新键按需加在同名文件里保持机制一致。）

## 3. core 目录树（源码字符串提取）

`.gamecowork/` 下: `config.ts?, settings.json, agents/, assistants/, prompts/, rules/,
.clipboard/, GAMECOWORK_SUMMARY.md, logs/`, 外加 `index/`、`dev_data/`、`sessions/`。

## 4. 其它位置

- `%LOCALAPPDATA%\{产品标识}`: WebView2 用户数据、窗口状态(原版)。
  你的版本: `%LOCALAPPDATA%\GameCowork`(WebView2) + 工作区注册表。
- `%APPDATA%\{TuanjieHub,UnityHub}`: 双引擎 Hub 配置目录(编辑器/项目清单来源,
  `editors.json` 等)。
- `%ProgramFiles%\{Tuanjie,Unity}\Hub\Editor`、`%ProgramFiles%\{Tuanjie,Unity} <版本>`:
  编辑器安装探测三来源之二(第三为 Hub 配置)。
- `<工程>/Library/PackageCache/cn.tuanjie.codely.bridge@<ver>/`: 原版桥包缓存
  （本备份 editor-bridge-original 的来源）。
- `<工程>/.codely-cli`、`.codely.packages`、`.codely/`: core 在工程内的状态目录
  （你的对应 `.gamecowork/`）。
- 环境变量族: 原 `CODELY_*` 24 个(见 RESTORE_STATUS 映射) → 你 `GAMECOWORK_*`;
  另有 `CONTINUE_GLOBAL_DIR`、`GAMECOWORK_USER_DATA_DIR`、`GAMECOWORK_CLI_HOME`
  (你的壳已显式设置)。
