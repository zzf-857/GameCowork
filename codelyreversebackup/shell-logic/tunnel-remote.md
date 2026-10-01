# 原版壳 隧道与远程工作区还原（T1.5）

> 来源: cowork.exe 模块簇 `src\frp_client.rs`、`src\tunnel.rs`、`src\server\mobile_home.rs`、`src\server\mobile_archive.rs`、`src\messages\tunnel.rs`、`src\push.rs`。
> 对应 HANDOFF P2「远程工作区：自有配对/授权、远程目录/Agent/终端/Editor 转发、断线恢复」。

## 1. 总览

```
前端 tauri/startTunnel|stopTunnel|getTunnelStatus
        │
   壳 tunnel.rs ──POST──► 控制面 REST: /api/v1/frp/connect | /disconnect | /heartbeat
        │  (响应: status=success, {id, expose_port, auth_token})
        ▼
   壳 frp_client.rs (Rust 内嵌 frp 客户端, 非 Go frp 二进制)
   ── 加密 TCP ──► 隧道服务器 (privilege_key 鉴权, run_id 回执)
        │  本地回环: 把远程流量转发到壳 HTTP server 端口
        ▼
   mobile_home.rs / mobile_archive.rs (手机端聚合页: 会话列表/归档/项目)
   + SSE-Bridge (远程工作区 SSE 转发) + push.rs (推送队列)
```

## 2. FRP 客户端协议（frp_client.rs）

- 状态机: `starting / running / stalled / exited / stopping`；状态锁 `frp client status lock poisoned`；`frp client exited: {reason}`。
- **登录握手**: `Sending frp login`，消息字段 `timestamp`、`privilege_key`、`proxy_name`（经典 frp 鉴权三元组）；失败 `login rejected: {reason}`；成功 **响应必须含 `run_id`**（`login response missing run_id`）→ `frp login accepted: run_id={...}`。
- **工作连接**: `start work connection rejected/read failed/write failed`、`new work connection write failed`、`work connection relay failed`、`failed to connect local service {addr}`（把流量转给本地服务）。
- **传输加密**: 自有帧加密——`decryptor initialized`、`failed to read frp crypto iv`（每连接 IV）、`failed to write frp crypto frame`、`empty frp transport stream`；消息编解码错误 `failed to encode/decode frp message: ... - body: ...`。
- **心跳**: `heartbeat timeout waiting for server pong`。
- **凭据**: 环境变量 `CODELY_FRP_TOKEN`；二进制内另有内置默认 token 常量（frp_client.rs 窗口内，完整值见 ascii-strings.tsv，属原软件敏感值不在此复制——自研必须换成自己的密钥分发）。
- 启动日志: `Started embedded frp client: {local} -> {remote} as {name}`。

## 3. 隧道管理（tunnel.rs）

- **机器身份**: 持久键 `tunnel-machine-instance-id`、`tunnel-machine-canonical-id`（存于 `~/.codely`），规范格式 `codely-machine:v2`；`server returned an invalid canonical machine ID`；无法持久化时 `using legacy identity` 降级。
- **REST**（控制面，POST，响应外层 `status` 必须为 `success`）:
  - `/api/v1/frp/connect` → `Tunnel allocated: id= expose_port=`；随后 `Starting embedded frp client: localPort= -> ...`（参数 `tunnel_id`、`auth_token`）→ `Tunnel started: port {n}`；复用已运行的 → `Reusing running tunnel: port {n}`。
  - `/api/v1/frp/disconnect` → 已断开时按 404 处理（`Tunnel '' already disconnected (404)`）。
  - `/api/v1/frp/heartbeat` → 周期发送；看门狗: `control path silent for {ms}`、`still starting after {ms}, past the {s}s startup grace`、`an unknown interval {ms}`。
- 错误: `HTTP request failed:`、`Failed to read response body:`、`Failed to parse response:`、`API status was not 'success'`。
- 窗口标题模板: `Codely Tunnel - {machine} (port {n})`。
- 生命周期钩子: 登出清理 `logout tunnel cleanup skipped: app state not initialized`、`restart tunnel skipped/failed`、`ensure tunnel skipped/failed`。

## 4. 前端命令与机器注册表（messages\tunnel.rs）

- 命令: `tauri/startTunnel`（参数含 `machineName`）、`tauri/stopTunnel`、`tauri/getTunnelStatus`、`tauri/setTunnelEnabled`（`enableTunnel`）。
- **远程机器记录字段**（camel/snake 双写并存，说明是跨端 JSON，两端各自命名风格）:
  `tunnelId/tunnel_id`、`machineId/machine_id`、`machineName/machine_name`、`machineOs/machine_os`、`machineCpu/machine_cpu`、`machineGpu/machine_gpu`、`machineMemory/machine_memory`、`activeTunnel/active_tunnel`、`firstSeenAt/first_seen_at`、`lastSeenAt/last_seen_at`、`machineIdAliases/machine_id_aliases`、`proxyUrl/proxy_url`、`workspaceDir`、`controlPath`、`Stale`、`enableTunnel`。
- 工作区键前缀 `remote::`；远程 agent 描述: `~/.codely-cli/agents`、`unity-insight.toml`、`workspaceDir is required for workspace-scoped agent toml`。
- 远程终端消息: `terminal/start`、`terminal/close`（转发到远端）。
- **远程提交链路**: `Remote workspace is offline or unreachable`、`Remote submit failed`。
- **SSE-Bridge**: 登出时逐个停桥 `logout: stopped {n} remote SSE bridge(s)` / `logout: no remote SSE bridges to stop` —— 远程工作区的事件流由壳内 SSE 桥转发（与本地 SSE 广播同构）。

## 5. 手机端聚合（mobile_home.rs / mobile_archive.rs —— 壳自有 HTTP 端点）

- 会话查询参数校验: `sessionQueries.workspaceKey is required`、`sessionQueries.limit must be between 1 and {n}`、`cannot contain more than {n} items`、`limitPerWorkspace must be between 1 and {n}`。
- 响应结构: `sessions[]`（字段 `title`（缺省 `Untitled chat`）、`dateUpdated`、`messageCount`、`unread`、`draftInput`、`stateChangedAt`）+ `hasMore` + `nextOffset`；归档状态枚举 `archived | active | pinned`（`invalid state '', must be ...`）。
- 数据源: 调 core `history/list`（`history/list timed out / returned an error / response missing content`）；聚合超时 `mobile home aggregation timed out`；`core service not ready`。
- 近期项目持久化: `cowork-side-projects.json`（`Unable to resolve ... path`、`Failed to serialize`、`Failed to create recent projects directory`）。
- 移动端触发的行为: `ide-notification-click`（点通知跳 IDE/工作区）、`FocusWindow`/`do_focus_window`、`do_focus_workspace`（`workspace not resolved (dir=); falling back`）、Unity 联动 `set_embed_mode`（`target_embed_mode=`，发送前后各一条日志 `ok=`）与 `AllowSetForegroundWindow granted to Unity PID {n}`。
- 引擎识别: `tuanjie`/`engineType`/`engineTypeStatus`/`notReady`/`timeout`；Unity 上下文 `activeGameObject/activeInstanceID/activeAsset`（`Unity GameObject context:`）。
- 工作区切换语义: `InitWorkspace`、`project-switch-existing-attached-workspace`、`already_open`（附 `http_port`），切换前通知 Unity（`Notified Unity before workspace IPC path change (close Codely window if detach)`）。

## 6. 推送（push.rs）

- 服务端 API: `/api/push/notify`（需 access token: `no access token for push API`）。
- 离线队列: pending flush（`Pending flush failed for {id}`、`Message {id} failed:`），成功 `Push notification forwarded to server push notify API HTTP {code}`；网络错误 `push notify API network error`。

## 7. 对 GameCowork 的复刻要点

1. 隧道服务端是外部云服务（控制面 + frp 服务器）；自研必须**自有服务端**，但客户端协议形状（connect→id/expose_port/auth_token→内嵌客户端带 run_id 回执→heartbeat 看门狗→disconnect 404 幂等）可整套照抄为 API 契约。
2. 机器身份 `codely-machine:v2` 双 ID（instance + canonical）+ aliases 设计可直接借鉴为 GameCowork 设备注册格式（换前缀）。
3. SSE-Bridge 思路与 GameCowork 现有 SSE 广播同构——远程工作区只需把远端事件流桥接进现有广播通道，无需新协议。
4. mobile home 的会话聚合查询（分页 hasMore/nextOffset、workspaceKey 必填、limit 区间校验）可作为 GameCowork 移动/远程入口页的接口设计模板。
5. 红线提醒: 原 `/api/push/notify`、`CODELY_FRP_TOKEN`、内置 token 常量都属于原厂服务凭据面，自研环境必须替换，不得复用原地址或原密钥。
