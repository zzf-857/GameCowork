# Codely（Tuanjie Cowork）官方账号协议取证报告

2026-10-03。只读协议取证，供主代理实现"独立主账号 broker"时按字段对照实现。本报告是
[codelyreversebackup/api/asset-generation-and-canvas-source-audit.md](../codelyreversebackup/api/asset-generation-and-canvas-source-audit.md)
"2026-10-02 补充：本人官方账号登录、刷新与订阅链"与"交接实施合同：独立主账号 broker"两节的补充与细化，
不与其结论冲突；凡与其表述不一致处以本报告的逐字节证据为准（本报告新增了 CLI 字节级证据、Core org 双通道、
PE serde 结构与事件名清单）。

取证方式：仅对既有证据文件做字节偏移窗口提取（`grep -abo` + `tail -c +N | head -c`）与格式化文件行号读取；
对原壳 PE（cowork.exe）只做只读字符串搜索，未运行任何原版程序，未发起任何网络请求，
未读取任何用户凭据 / 浏览器数据 / 原版安装的账号文件。

## 0. 证据文件与缩写

| 缩写 | 文件 | SHA256（前 12 位） |
| --- | --- | --- |
| CLI | `temp/GameCowork/codely-assets-reference-20261002/original-cli-carved/carve_0201_189957669.js`（11,951,226 B） | `8da5876521a7` |
| CORE | `temp/.../original-core-unpacked/binary/out/index.js`（14,346,800 B） | `b4b146c5cdd1` |
| GUIT | `temp/.../pretty/assets/VscTheme-BExNMG_K.js`（格式化派生，行号） | `167200…`（见 `VscTheme-BExNMG_K.js.snippets.json`） |
| GUII | `temp/.../pretty/assets/index-BRxZ4eG7.js`（格式化派生，行号） | `6cb34283488c` |
| QUICK | `temp/.../pretty-public/index-DZWJHC3S.js`（格式化派生，行号） | `10e0e9c2a677` |
| CANVAS | `temp/.../remote-current/pretty/index-A8ll_iBT.js`（格式化派生；原始 `remote-current/002-037278e934adbf3e.js`） | `037278e934ad` |
| PE | `E:/TuanjieCodely/EXE/Tuanjie Cowork/cowork.exe`（58,555,736 B，只读字符串搜索） | `55ea13a97077` |

字节偏移均为各自文件内的绝对偏移（`grep -abo` 输出），非行号。上表 SHA 与既有台账
（`asset-generation-and-canvas-source-audit.md` 证据分层表、`all-original-front-js.sha256.json`）一致。

官方主域：`https://codely.tuanjie.cn`（CLI `NT()`：`process.env.LOCAL_TEST==="true"||process.env.DEV==="true" ? "http://localhost:8000" : "https://codely.tuanjie.cn"`，CLI≈1310600）。Core 侧环境对象 `T3s`（生产）同样定义 `API_URL:"https://codely.tuanjie.cn/"`、`AUTH_TYPE:"codely"`、`WORKOS_CLIENT_ID:"fdc35ff5056810f083cf0138015de8ccf57e880be9374793ad6ac320d690536e"`（CORE≈13266243；staging 环境对象 `S8n` 指向 `codely-stg.tuanjie.cn`）。该 WORKOS_CLIENT_ID 只是 Core 中 JetBrains 风格辅助登录入口的公开 client_id，不是设备流参数，见 §1.5。

---

## 1. 设备授权三接口与整条登录链（CLI 完整源码证据）

CLI 在 ≈1330589–1330722 集中定义常量（摘录）：

```js
tWn=`${Z2}/login`, Apn=`${Z2}/auth/refresh`, rWn=`${Z2}/auth/device/initiate`,
nWn=`${Z2}/auth/device/poll`, iWn=`${Z2}/auth/device/exchange`,
mpn=`${Z2}/api/api-token/cli-api-key`, gpn=`${Z2}/auth/external/me`,
VUr="unity", sWn="codely-cli", oWn="oauth_creds.json", Epn=30000,
Q5=class extends Error{... this.name="CodelyDeviceFlowTerminalError"}
```

其中 `Z2=NT()`。`Epn=30000` 是请求超时/AbortController 超时（在 CLI 的 Hqn 等 helper 中使用，见 §4 的 30000ms Account 请求）。`Q5` 是终态错误：completed/denied/expired 都抛它，调用方不应重试。

### 1.1 POST /auth/device/initiate（CLI `VXu`，字节 1326332）

```js
async function VXu(){
  let e=await fetch(rWn,{method:"POST",
    headers:{"Content-Type":"application/json",Accept:"application/json"},
    body:JSON.stringify({provider:VUr,client_name:sWn})});
  if(!e.ok){let r=await e.text();
    throw Error(`Device initiate failed: ${e.status} ${e.statusText}. Response: ${r}`)}
  let t=await e.json();
  if(!t.auth_request_token||!t.verification_uri_complete||!t.user_code)
    throw Error("Device initiate returned an invalid payload.");
  return t}
```

- 请求：POST，头 `Content-Type: application/json` + `Accept: application/json`，**无 Authorization、无 client_id、无 client_secret**；体 `{"provider":"unity","client_name":"codely-cli"}`（`provider`/`client_name` 是仅有的两个字段）。
- 响应中实际读取：`auth_request_token`、`verification_uri_complete`、`user_code`；另有 `provider`（qXu 里 `t.provider||VUr` 打印）、`verification_uri`、`expires_in`、`interval`（qXu 消费，见 §1.3）。PE serde `DeviceInitiateResponse with 6 elements`（PE 47167403/47439464）字段串：`auth_request_token user_code verification_uri verification_uri_complete interval`（第 6 个字段在其前一词 `expires_in`，PE 47167386）。

### 1.2 GET /auth/device/poll?auth_request_token=…（CLI `HXu`，字节 1326787）

```js
async function HXu(e){
  let t=`${nWn}?auth_request_token=${encodeURIComponent(e)}`,
      r=await fetch(t,{method:"GET",headers:{Accept:"application/json"}});
  if(!r.ok){...throw Error(`Device poll failed: ...`)}
  return await r.json()}
```

- 请求：GET，唯一 query 参数名是 `auth_request_token`（URL 编码），头只有 `Accept: application/json`。PE 47261713 亦有字符串 `auth/device/poll?auth_request_token=`，证明桌面壳同形。
- 响应字段：`status`（状态机）、`interval`（slow_down 时）、`authorization_code`（authorized 时）、`error_description`（终态时）。

### 1.3 poll 状态机（CLI `qXu`，字节 1327487 起，状态串 1328392–1329389）

```js
let r=Math.max(t.interval||2,1), n=Date.now()+Math.max(t.expires_in||0,0)*1000;
for(;Date.now()<n;){ await MXu(r*1000); let s=await HXu(t.auth_request_token);
  if(s.status==="pending"){...continue}
  if(s.status==="slow_down"){r=Math.max(r,s.interval||r);...continue}
  if(s.status==="authorized"){
    if(!s.authorization_code) throw new Q5("Authorized response missing authorization_code.");
    let o=await QXu(s.authorization_code),
        u={access_token:o.access_token, refresh_token:o.refresh_token,
           token_type:o.token_type||"Bearer", expires_in:o.expires_in,
           expiry_date:Date.now()+o.expires_in*1000};
    e.setCredentials(u); await H5(u);
    try{await e.fetchCliApiKey()}catch(a){console.warn(...)}
    return {success:!0}}
  throw s.status==="completed" ? new Q5(s.error_description||"Authorization code already delivered. Please restart login.")
       :s.status==="denied"    ? new Q5(s.error_description||"Authorization denied. Please restart login.")
       :s.status==="expired"   ? new Q5(s.error_description||"Authorization expired. Please restart login.")
       :Error(`Unexpected poll status: ${s.status}`)}
throw Error("Device authorization request timed out.")
```

- 状态全集：`pending` / `slow_down` / `authorized` / `completed` / `denied` / `expired`，另有兜底 "Unexpected poll status"。转移：pending 继续；slow_down 取 `max(当前 interval, 响应 interval)` 后继续；authorized 必须带 `authorization_code` 才能交换；completed/denied/expired 抛 `CodelyDeviceFlowTerminalError`（含 `error_description`）；整个循环超时按 initiate 的 `expires_in`（秒）计算。
- 初始 interval 为 `max(initiate.interval||2, 1)` 秒；每次 poll 前先 sleep interval。
- 交换成功后立即持久化（H5，§9），再取 cli-api-key（§4.4，失败仅告警）。

### 1.4 POST /auth/device/exchange（CLI `QXu`，字节 1327068）

```js
async function QXu(e){
  let t=await fetch(iWn,{method:"POST",
    headers:{"Content-Type":"application/json",Accept:"application/json"},
    body:JSON.stringify({authorization_code:e})});
  ...
  let r=await t.json();
  if(!r.access_token||!r.expires_in)
    throw Error("Device exchange returned an invalid token payload.");
  return r}
```

- 请求体就是 `{"authorization_code":"…"}`；响应实际读取 `access_token`、`expires_in`（二者必需，缺一报错），`refresh_token`、`token_type`（缺省回退 `"Bearer"`）随后保存（§1.3）。
- PE serde：`DevicePollResponse with 3 elements`（`status`、`authorization_code`、`interval`，PE 47167547/47439580 附近字段串 `status authorization_code`）、`DeviceExchangeResponse with 5 elements`（PE 47167695）、`DeviceExchangeUnityToken with 4 elements`（PE 47167710）；PE 日志 `Device exchange parsed successfully (unity token included: `（PE 47261060 附近）说明**桌面壳的 exchange 回执还可能带一个 Unity 令牌子对象**（`unity_token` 字样见 PE 29339792；`UnityTokenExchangeResponse with 4 elements`，字段含 `token_type expires_in`，PE 47167390）。CLI 侧未消费该子对象。这是桌面与 CLI 的一个已知形状差异。

### 1.5 桌面壳（PE）的设备流与登录入口分层（只读字符串证据）

- PE 47260956 `auth/device/initiate` + 紧随的 `Accept`；47261713 `auth/device/poll?auth_request_token=`；47261171 `authorization_code` + `auth/device/exchange`。与 CLI 三接口同形。
- PE 47260400 附近登录决策链日志：`Starting auth flow with local callback server (useOnboarding: `、`CODELY_TOKEN set, skipping browser / Unity flow (highest priority)`、`No Unity tokens provided, using browser auth flow`、`Unity tokens provided, attempting token exchange`、`Unity token exchange successful/failed`、`Session info incomplete but Unity tokens available, attempting token exchange`。即桌面壳实际有三种登录输入：CODELY_TOKEN 环境变量（最高优先）、Unity 令牌交换（`UnityTokenExchangeResponse`）、浏览器设备流（主路径，useOnboarding 传入）。
- **桌面 initiate 请求体字段无法从 PE 字符串恢复**：全文件无 `client_name` 字符串、无 `DeviceInitiateRequest`/`InitiateRequest` serde 名（grep 0 命中），仅有 `[initiate] Failed to serialize body:` 日志（47260520 附近），证明桌面体是 serde 序列化的结构体，其字段名未落入字符串表。CLI 的 `{provider:"unity",client_name:"codely-cli"}` 是唯一可核对的完整请求体，但**不能**宣称桌面体与之逐字相同。
- PE 47167376–47167710 serde 名单：`UserInfo with 3 elements`（`email username id`）、`RefreshTokenResponse with 2 elements`（`access_token refresh_token`）、`UnityTokenExchangeResponse with 4 elements`、`DeviceInitiateResponse with 6 elements`、`DevicePollResponse with 3 elements`、`DeviceExchangeUnityToken with 4 elements`、`DeviceExchangeResponse with 5 elements`。
- PE 遥测事件名串（29368250）：`device_flow unity_token_exchange device_initiate device_poll device_exchange refresh_token persist_session userflow_expired cowork_login_started cowork_login_ended cowork_client_started cowork_client_logged_in`——可作壳内部阶段名参考。

### 1.6 legacy 本地回调 + PKCE 分支（CLI `GXu`，字节 1320929；仅记录）

- 临时端口 `http://localhost:<port>/callback`，PKCE：`code_challenge_method=S256`；登录 URL `tWn`（= `{base}/login`），query 仅 `state` + `code_challenge` + `code_challenge_method`。
- `state` = `Buffer.from(JSON.stringify({authFrom:"codely-cli", authCallback, codeVerifier, codeChallenge})).toString("base64")`（**verifier 明文放进 state**，弱点，勿照搬）。
- 回调只校验 `state.authFrom` 与本地期望相等、`codeVerifier/codeChallenge` 存在；`code` 参数按 **Base64 JSON** 解码，读 `accessToken||access_token`、`refreshToken||refresh_token`、`token_type`、`expires_in||3600`、`scope`（CLI 1324250 窗口）。它不是标准 OAuth authorization code，**不得**再转发给 `/token` 端点。
- 服务器最长等待 300 秒（`setTimeout(...,300000)`，CLI 1320950 窗口）。该分支仅作为设备流失败后的 fallback 保留（`WXu`，1329350）。

---

## 2. GET /auth/external/me

### CLI `_performFetchUserInfo`（字节 1337790）

```js
let t=await fetch(gpn,{method:"GET",
  headers:{Authorization:`Bearer ${this.credentials.access_token}`,
           "Content-Type":"application/json",Accept:"application/json"}});
if(!t.ok){ if(t.status===401||t.status===403){...throw Error(`Failed to fetch user info: ...`)} return }
let r=await t.json(); r.id!=null && this.setCredentials({...this.credentials, user_id:r.id})
```

- 请求头：`Authorization: Bearer`、`Content-Type`、`Accept`。实际消费字段：**只读 `id`**（存为 `user_id`）。
- 错误语义：401/403 抛错；**其它非 2xx 静默返回**（不抛、不写 user_id）。去重：`fl.fetchUserInfo` 用 `fetchUserInfoPromise` 单飞（1337674）。

### 其它"me"证据

- CLI 还有第二个账户端点 `GET {base}/auth/me`（`Yqn`，CLI 1314922/1314965），响应校验器 `NXu`：`typeof e.id=="number" && typeof e.username=="string"`；配套 `GET {base}/api/user/usage/summary`（`zqn`，1315009）校验 `kXu`：`{remaining_points:string, is_exhausted:boolean, details?:[{type:string, remaining_points:string, exhausted:boolean}]}`（`xXu`，1314100 窗口）。这是 CLI 自用形状（snake_case），与 Core/GUI 的 camelCase 消费（§5）并存，注意大小写差异。
- CORE `getCurrentUserId`（CORE 13273168）：`requestToCodelyApiAndHandleError("auth/external/me",{method:"GET"})` → `n.id===void 0||n.id===null ? null : String(n.id)`。
- PE `UserInfo with 3 elements`：`email username id`（47167340）——服务端响应含这三个字段；GUI 端 `account.label` 来自登录页（用户名），具体映射在壳内。

---

## 3. POST /auth/refresh

### CLI `fl.refreshAccessToken`（字节 1335784）

```js
refreshAccessToken(){
  if(!this.credentials.refresh_token) throw Error("No refresh token available");
  let t=await fetch(Apn,{method:"POST",
    headers:{"Content-Type":"application/json",Accept:"application/json"},
    body:JSON.stringify({refresh_token:this.credentials.refresh_token})});
  if(!t.ok) throw t.status===400||t.status===401
    ? (await Oz(), Error("Refresh token expired or invalid. Please use '/auth' to re-authenticate."))
    : Error(`Token refresh failed: ${t.status} ${t.statusText}`);
  let r=await t.json(),
      n={...this.credentials,
         access_token:r.access_token,
         token_type:r.token_type||this.credentials.token_type,
         refresh_token:r.refresh_token||this.credentials.refresh_token,
         expires_in:r.expires_in,
         expiry_date:Date.now()+r.expires_in*1000,
         scope:r.scope||this.credentials.scope};
  this.setCredentials(n); await H5(n)}
```

- 请求：POST `{base}/auth/refresh`，头 `Content-Type` + `Accept`，体 `{"refresh_token":"…"}`；**无 Authorization 头**。
- 响应字段：`access_token`、`token_type`（回退旧值）、`refresh_token`（**轮换规则：服务端返回新值才轮换，返回缺省则保留旧 refresh_token**）、`expires_in`、`scope`（回退旧值）；`expiry_date=Date.now()+expires_in*1000`。
- 400/401 → `Oz()`（清缓存：unlink `oauth_creds.json` + `removeTokensByClientId("codely-cli")`）并抛"需重新登录"；其它状态码抛普通错误（**不清凭据**）。
- PE `RefreshTokenResponse with 2 elements`：`access_token refresh_token`（47167355）；PE 日志 `Refreshing token`、`Calling refresh API`、`API response status:`、`Token refresh and save completed successfully`（47258780 附近）；**`auth/refresh` 在 PE 47258968**。

### 并发去重（三处不同实现，报告区分）

1. **CLI 主凭据类 `fl` 本身没有 refresh 去重**（每次调用直接打接口）。
2. **CLI litellm Provider 层**（`JWr`，字节 4852730）：`async forceRefreshToken(){ if(this.refreshPromise) return await this.refreshPromise; this.refreshPromise=this.performTokenRefresh(); try{return await this.refreshPromise} finally{this.refreshPromise=null}}`，`performTokenRefresh` 里调 `codelyClient.refreshAccessToken()` + `fetchCliApiKey()`。即"共享在途 Promise"模式。
3. **桌面壳**（PE）：日志串 `Refresh already in flight, awaiting shared result`（PE 47258764）、`Shared refresh result unavailable: `、`Refresh leader result unavailable: `、`CoreCommOrgRefreshLeaderGuard dropped without finish() — publishing Failure to followers`（PE 47115120）。即壳在**多窗口/多 CoreComm 客户端**间实现了 leader/follower 共享单次刷新，follower 等待 leader 的共享结果。
4. **CORE 侧**不做刷新：Core 只收壳给的 accessToken（`didChangeControlPlaneSessionInfo`），收到未授权回调时 `setAccessToken("")`、`orgManager.reset()`、`shutdownACP()`、`messenger.send("sessionUpdate",{sessionInfo:void 0})`、并 `request("logoutOfControlPlane")`（CORE 14290850 窗口）。

---

## 4. 组织接口与 CLI 推理凭据

### 4.1 GET /api/teams（CLI `F7r`，字节 1310800；CORE `listTeams`，13272864）

```js
// CLI
let r=await fetch(UUr,{method:"GET",
  headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json",Accept:"application/json"}});
let n=await r.json(),
    s={orgs:n.teams.map(o=>({orgId:o.team_id,orgName:o.team_name,isCurrent:o.is_current,hasKey:o.has_key})),
       currentOrgId:n.current_team_id, multiOrgEnabled:n.multi_team_enabled};
```

响应形状（以解析代码为准）：`{teams:[{team_id, team_name, is_current, has_key}], current_team_id, multi_team_enabled}`。CLI 允许本地 `org.json` 覆盖 currentOrgId（§9），覆盖后把命中项的 `isCurrent` 重写为 true。

CORE：`listTeams(){ return await this.isSignedIn()? await (await this.requestToCodelyApiAndHandleError("api/teams",{method:"GET"})).json() : null }`；orgManager `updateFromListTeams(e)`（CORE 13959180）映射 `{id:a.team_id, name:a.team_name, iconUrl:"", slug:a.team_id}` + `current_team_id` + `multi_team_enabled`，`resolveCurrentOrgId` 无 current 时回退 `teams[0].id`。

### 4.2 GET /api/orgs（CORE `listOrgs` 13273003；CLI 无此调用）

CORE `Spa`（13982206）按 access token 形态二选一：
- 若 JWT payload（base64url 解码，`LRi` @13981519）含 `account_type` 声明（`JRi`）→ 走 `listOrgs()`（`GET api/orgs`），解析 `_Ri`（13982350）：

```js
let r=n.orgs.map(l=>({orgId:l.litellm_team_id||l.org_id, orgName:l.org_name,
                      isCurrent:l.is_current, hasKey:l.has_key})),
    a=n.orgs.find(l=>l.is_current),
    s=a?.litellm_team_id || n.current_org_id;
```

  即 `/api/orgs` 响应形状：`{orgs:[{org_id, litellm_team_id, org_name, is_current, has_key}], current_org_id, multi_org_enabled}`；当前 org 优先取当前项的 `litellm_team_id`，否则 `current_org_id`。
- 否则走 `listTeams()`（`/api/teams`），并允许 Core 侧 `org.json` 覆盖（`SRi`/`Jpa`，13981560）。

### 4.3 POST /api/teams/switch（CLI `Uqn` 1311350；CORE `switchTeam` 13273417）

```js
// CLI
let n=await fetch(`${UUr}/switch`,{method:"POST",
  headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json",Accept:"application/json"},
  body:JSON.stringify({team_id:t})});
let s=await n.json(), o={success:s.success, currentOrgId:s.current_team_id, orgName:s.team_name};
```

请求体 `{"team_id":"…"}`；响应 `{success, current_team_id, team_name}`。CORE：`switchTeam(e){ ... body:JSON.stringify({team_id:e}) ... }`，同样路径 `api/teams/switch`。

CORE 组织 RPC 注册（14195400–14197905 窗口）：`refreshOrgList`（内部 `listTeams`→`updateFromListTeams`）、`switchOrg {orgId}`（`tryAcpOrgSwitch`→`applySwitchResult`→`syncTeamIdToServer`→`loadConfig`→`pushOrgUpdate`）、`orgSync {organizations,currentOrgId,currentOrgName,multiTeamEnabled}`（IDE 主动同步，若 currentOrgId 变化先 `shutdownACP`）、`orgSwitch/prepare`（`shutdownACP`）、`refreshAcpOrgList`。

### 4.4 GET /api/api-token/cli-api-key（仅记录，标记"不得自动调用"）

CLI `fl.fetchCliApiKey`（1336200 窗口，常量 `mpn` @1330698）：

```js
let t=await this.getCurrentUserId(), r=(await FH(t)).currentOrgId;
r||(await F7r(this.credentials.access_token,t), r=(await FH(t)).currentOrgId);
let n=mpn; r&&(n+=`?teamId=${encodeURIComponent(r)}`);
let s=await fetch(n,{method:"GET",
  headers:{Authorization:`Bearer ${this.credentials.access_token}`,
           "Content-Type":"application/json",Accept:"application/json"}});
...
let o=await s.json(), u={...this.credentials, cli_api_key:o.cli_api_key, user_id:o.user_id, rpm:o.rpm, tpm:o.tpm};
```

- query 参数名 `teamId`（非 orgId）；响应 `{cli_api_key, user_id, rpm, tpm}`。CLI 把它存进 `oauth_creds.json`（值经 `UXu` 混淆后落盘）。
- **该端点属于官方 CLI 推理通道凭据（`https://codely-litellm.tuanjie.cn/v1`，CLI 4852610），查看本人订阅/身份不需要它；GameCowork broker 不得自动调用，也不应让官方登录改写用户自建 Provider 配置**（与既有审计第 3 节一致）。

---

## 5. 订阅与用量（orgId 参数名已逐字证实）

### CORE `are`（控制面客户端，起点 13268437；`new are(` @13928919/13934955）

请求基座：`requestToCodelyApi(e,n)`（13269350 窗口）——`new URL(e, l.API_URL)`（= `https://codely.tuanjie.cn/` + 相对路径），头：`Authorization: Bearer <accessToken>`、`x-extension-version`、`x-is-prerelease`；无会话且非 on-prem 抛 `"No access token"`。`requestAndHandleError` 变体把非 2xx 转为 `Team API request failed (status): body.detail||body` 抛出。

```js
async getUserPlan(e){ ... let n=e?`?orgId=${encodeURIComponent(e)}`:"";
  return await (await this.requestToCodelyApiAndHandleError(`api/user/plan${n}`,{method:"GET"})).json() }   // 13273561 附近
async getUserUsageSummary(e){ ... `api/user/usage/summary${n}` ... }                                        // 13273842 附近
async getUserExhaustion(e){ ... let r=await this.requestToCodelyApi(`api/user/usage/exhaustion${n}`,{method:"GET"});
  if(!r.ok) throw new Error(`exhaustion API failed (${r.status})`); return await r.json() }                 // 13274141 附近
```

**query 参数名是 `orgId`**（三处同型，值为 encodeURIComponent 的组织 id）。

### GUI 实际消费字段（GUIT:110806 `hV` 等）

- 计划 TTL：`Fwt = 5*60*1000`（GUIT:110803），`skipTtl` 参数可强制；`account/fetchUserPlan` thunk 调 `ideMessenger.request("controlPlane/getUserPlan",{orgId})`，成功后归一化：
  `planType, planTag, isTeamPlan, isActive, inRenewalPeriod(默认 false), subscriptionUrl(默认 null), canUpgradePlan(默认 false), canManagePlan(默认 false), canTopup(默认 false), hasSeat(默认 false), validTo(默认 null)`。
- 用量 thunk `Z9e`（GUIT:110833）：`controlPlane/getUserUsageSummary {orgId}` → `remainingPoints, isExhausted, windows(默认 [])`。
- 耗尽详情（GUIT:122224，错误弹窗路径）：`controlPlane/getUserExhaustion {orgId}` → `exhaustedSource(默认 "")`, `nextAvailableAt`。
- 组织状态来源：`getCurrentOrg` / `refreshOrgList` RPC（GUIT:110796/110815），形状 `{organizations, currentOrgId, currentOrgName, multiTeamEnabled}`。
- 选择器名（GUIT:110766–110786）：`selectPlanType/PlanTag/IsTeamPlan/IsPlanActive/CanUpgradePlan/CanManagePlan/CanTopup/HasSeat/ShowContactAdmin/ShowUpgrade/ShowTopup/ShowHubUpgrade/ShowHubRenewal/SubscriptionUrl/IsNoSeatTeamMember/ValidTo/UsageRemainingPoints/UsageWindows/IsUsageExhausted/IsFreeUser`。
- **大小写提示**：GUI 消费 camelCase（`remainingPoints/isExhausted/windows`），CLI 校验器消费 snake_case（`remaining_points/is_exhausted`，§2）。说明桌面壳在把 Core/服务端响应交给 GUI 前做了 camelCase 归一（或服务端对两种客户端返回不同形态）；broker 自实现时应同时准备好两种形状并按真机回执定案（§10）。

---

## 6. 桌面壳 ⇄ Core ⇄ GUI 的会话通知协议

### 6.1 getControlPlaneSessionInfo

- 请求参数：`{silent, useOnboarding}`。GUI 登录按钮：`request("getControlPlaneSessionInfo",{silent:!1,useOnboarding:O})`（GUIT:187703，`S(O)`，O=useOnboarding）；启动读档循环：20 次 × 250ms `request("getControlPlaneSessionInfo",{silent:!0,useOnboarding:!1})`（GUIT:187736–187746，`W4e=20`,`Lgn=250`）。
- CORE 启动同样请求：`e.request("getControlPlaneSessionInfo",{silent:!0,useOnboarding:!1}).then(u=>u&&typeof u=="object"&&"joinedInProgress"in u ? void 0 : u)`（CORE 14290743），即**响应可能带 `joinedInProgress` 标记**（设备流进行中），Core 视为"暂无会话"。PE 47192512 亦有 `joinedInProgress` 串。
- 回执包装：GUI 检查 `q.status==="error"` / `$.status==="success"` 再取 `q.content`（GUIT:187705–187715）；PE 47190640 有 `status success content` 串。`content` 即 `ControlPlaneSessionInfo`。
- PE 消息名（47190700 附近）：`getControlPlaneSessionInfo logoutOfControlPlane notifyDeviceFlowExpired`；CORE 亦注册 `didChangeControlPlaneSessionInfo` 与 `auth/getAuthUrl {useOnboarding}`（CORE 14197890）。

### 6.2 device-flow 事件载荷（GUI 消费为准）

GUIT:187783–187812：

```js
ma("device-flow-started", async O=>{
  const {expiresAtMs:B, ...$}=O, q=typeof B=="number"&&B>0?B:void 0;
  g.current=O.authFlowAttemptId ?? null; h({...$,expiresAt:q}); l(!0); f(null) })
ma("device-flow-failed", async O=>{
  const B=O.authFlowAttemptId,$=g.current;
  if(typeof B=="number"&&B!==$) return;      // 旧 attempt 的迟到失败被丢弃
  g.current=null; const q=O.errorType;
  f(typeof q=="string"&&q?`login.errors.${q}`:O.error); l(!1); h(null) })
ma("device-flow-cancelled", async O=>{
  const B=O?.authFlowAttemptId,$=g.current;
  (typeof B=="number"&&B!==$)||((g.current=null),l(!1),h(null),f(null)) })
```

- `device-flow-started` 载荷（展开渲染于 GUII:49815–49830）：`verificationUri`、`verificationUriComplete`、`userCode`、`showVerificationInfo`（可省，缺省视为 true）、`expiresAtMs`（毫秒，GUI 侧存为 `expiresAt` 并 setTimeout 到期后 `post("notifyDeviceFlowExpired")`）、`authFlowAttemptId`（number，用于代次比对）。
- `device-flow-failed`：`authFlowAttemptId`、`errorType`（可省，命中 `login.errors.<errorType>` i18n 键）、`error`（文本兜底）。
- `device-flow-cancelled`：`authFlowAttemptId`。
- 打开验证页：`ideMessenger.post("controlPlane/openBrowser",{path: verificationUriComplete||verificationUri})`（GUII:49818）。取消：`post("cancelLogin")`（GUIT:187723）；登出：`post("logoutOfControlPlane")`（GUIT:187715）。PE 对应串：`verificationUriComplete authFlowAttemptId`（47262712/47262735）、`device-flow-started/failed/cancelled`（47192512/47192808/47192762）、`expiresAtMs` 未以独立字符串出现（载荷在壳内 serde 序列化）。

### 6.3 sessionUpdate / didChangeControlPlaneSessionInfo

- CORE（14197617，RPC 注册）：

```js
n("didChangeControlPlaneSessionInfo",async G=>{
  t.messenger.send("sessionUpdate",{sessionInfo:G.data.sessionInfo});
  let b=HI.getInstance();
  G.data.sessionInfo&&!au(G.data.sessionInfo)?b.setAccessToken(G.data.sessionInfo.accessToken):b.setAccessToken("");
  let h=`${N.account?.id??""}:${N.accessToken??""}`;             // 去重签名
  if(h===t.lastAppliedSessionSig) return;
  ... // account.id 与旧会话不同 → shutdownACP + orgManager.reset
  await t.configHandler.updateControlPlaneSessionInfo(G.data.sessionInfo)})
```

  即：Core 收到 `didChangeControlPlaneSessionInfo {data:{sessionInfo}}` 后，向 IDE 侧广播 **`sessionUpdate`，载荷 `{sessionInfo}`**；`sessionInfo.accessToken` 注入 HI 单例；签名 `account.id + ":" + accessToken` 去重；account 切换触发 ACP/组织重置。
- GUI（GUIT:187771）：`ma("sessionUpdate", async O=>{ const B=Mx(O.sessionInfo); if(B){o(B)...} ... })`。`Mx`（GUIT:187667）是发布门槛：

```js
function Mx(e){ if(!e||s5e(e)) return; if(y$(e)) return e;
  const t=e.accessToken?.trim(), n=e.account?.id?.trim(), r=e.account?.label?.trim();
  if(!(!t||!n||!r)) return e }
```

  即 `sessionInfo` 必须同时有非空 `accessToken`、`account.id`、`account.label` 才被接受为新会话；否则 GUI 会回查 `getControlPlaneSessionInfo {silent:true}` 修正。GUII 侧多处用 `session && !wo(session) ? session.accessToken : null` 过滤后交给 iframe 桥（wo 为共享 helper，定义未随本批 chunk 导出；语义上是对无效/on-prem 会话的过滤，保守实现同 Mx 即可）。
- PE：`didChangeControlPlaneSessionInfo`/`sessionUpdate`/`accessToken`（47192512–47192700），以及广播层 `{messageType, data}` 与 `tjhub/statusUpdate` 通道名（47115284 附近）。登出时 CORE 发 `sessionUpdate {sessionInfo:void 0}`（见 §3）。

---

## 7. Quick/History 站点（ai-generator.tuanjie.cn）身份与额度

### 7.1 宿主 → iframe 身份消息（GUII:38321 `kG`）

```js
const i=g3(s.t("generation.creatorUrl",{defaultValue:p3})),  // p3="https://ai-generator.tuanjie.cn/lab3d"
      c=A?"*":i;                                             // A=h3() 仅开发态放宽为 "*"
p.postMessage({type:"codely:auth", token:m}, c);             // m = session&&!wo(session)?session.accessToken:null
p.postMessage({type:"codely:theme", theme:g}, c);
p.postMessage({type:"codely:locale", locale:w}, c);          // w = "en"|"zh"
```

- 接收侧校验：`m.origin!==i && !(A&&m.origin==="null")` 直接丢弃；`codely:ready` 命中后按 `contentWindow` 身份重发全套。会话变化时整体重发 `codely:auth`（token 变 null 也发，见 `d.useEffect([r,c,u])`）。
- **消息字段结构：`{type:"codely:auth", token: <accessToken|null>}`**，目标 origin 必须精确（生产为 `https://ai-generator.tuanjie.cn`）。

### 7.2 客户端接收与 bootstrap（QUICK:38540–38590）

- 允许的宿主 origin 白名单（QUICK:38544 `r1e`）：`https://codely.tuanjie.cn`、`https://codesearch-plugins.cdn.tuanjie.cn`、`http://localhost`、`http://localhost:5173/5888/3000`、`http(s)://tauri.localhost`；`vK` 另放行 localhost/127.0.0.1 任意端口。嵌入态还要求 `n.source===window.parent`。
- `codely:auth` 处理：`Yue(token)`（模块内存变量 `bS`，不落盘）、`setAuthStatus(token?"authed":"anonymous", changed)`、`s1e(token)`。
- `s1e`（QUICK:38565）：

```js
async function s1e(t){
  if(!t) return {ok:!1,error:"missing-token"};
  try{ await Mn.get("/editor/sso/bootstrap",{headers:{Authorization:`Bearer ${t}`}});
       za.getState().fetchUser(); return {ok:!0} }
  catch{ return {ok:!1,error:"bootstrap-failed"} } }
```

### 7.3 API 客户端 `Mn`（QUICK:20360）

```js
const Mn=Di.create({baseURL:"https://ai-generator.tuanjie.cn/api", withCredentials:!0});
Mn.interceptors.request.use(t=>(
  t.headers["X-Csrf-Token"]=I7.get("_csrf"),          // cookie _csrf
  t.headers.isMobile=String(Ba(window.location.search)),
  bS&&(t.headers.Authorization=`Bearer ${bS}`), t));
Mn.interceptors.response.use(t=>t.data, t=>{throw new Error(JSON.stringify(t.response?.data||"Something went wrong"))});
```

- 每个请求都带：`X-Csrf-Token`（来自本站 cookie `_csrf`）、`isMobile`、可选 `Authorization: Bearer`；`withCredentials:true` 携带 cookie。bootstrap 成功后服务端会话（cookie）即建立，后续 `/user/me`、`/credit/*` 依赖该会话 + CSRF。
- `GET /api/user/me`（`Zue` @20377，`Mn("/user/me")`）→ `fetchUser`（21032）整体存为 `user`；UI 实际消费字段：`id`、`username`（29858 头像 alt / 29862 显示）、`phone`、`isCP`、`isAdmin`、`role`、`dismissedAnnouncements`。
- 登出（独立网页态）：`window.open(\`/auth/logout?_csrf=${I7.get("_csrf")}\`,"_self")`（QUICK:21029）；另有 `POST /cp/user/logout`。

### 7.4 积分 / 订阅门控（QUICK:75706–75795, 39127, 76202）

```js
Mn.get("/credit/my-credits").then(ae=>{const ze=ae?.data||ae||{};
  typeof ze.currentCredits=="number" && $M(ze.currentCredits)})
Mn.get("/credit/my-paid-status").then(ze=>{const Ze=ze?.data||ze||{};
  typeof Ze.paidType=="string" && vv(Ze.paidType);
  Zh({userId, modelId, paidType:Ze.paidType||null, productCode:Ze.productCode||"", failed:!Ze.paidType})})
Mn.get("/credit/cost-preview",{params:{taskType:ua,...ou}})        // → credits:number；viggle 另有 fingerprint
Mn.post("/credit/viggle-video-quote",{videoUrl:Kt[0],type:ou.type||"glb"})
```

- 响应解包规则统一为 `resp?.data || resp || {}`（Axios 拦截器已剥一层，`data` 双保险）。消费字段：`currentCredits`、`paidType`、`productCode`、`credits`、`fingerprint`（仅 `viggle_video_motion` 需要）。
- 门控判定 `C1e(t,e){return t||e==="internal"||e==="paid"}`（QUICK:39127，`t=requiresFrontierSubscription` 需求、`e=paidType`）；`requiresFrontierSubscription && !C1e(...)` 时禁用（76202），`paidType` 取值仅 `internal|paid|unpaid` 三类被分支消费（76211）。
- 门控触发条件：`mode==="video" || model.requiresFrontierSubscription || (image && frontierImage) || (3d && id==="tripo-p2")` 才请求 `my-paid-status`。

---

## 8. Canvas 站点（aicanvas.tuanjie.cn）身份交换

### 8.1 宿主 → iframe（GUII:38404 `QG`）

- 严格校验：`y.source===iframe.contentWindow && y.origin===UG`（`UG=new URL("https://aicanvas.tuanjie.cn").origin`）。
- 收到 `{type:"ai-canvas-ready"}` 后依序发：`{type:"cowork-token", token:f}`（`f=session&&!wo(session)?session.accessToken:null`）、`{type:"embed-style", style}`（light|dark）、`{type:"codely:workspaces", workspaces:[{workspaceName, workspaceHash}]}`（workspaceName=目录名，workspaceHash=workspaceKey）。
- 会话变化：ready 后重发 `cowork-token`；**token 由有变无时发 `{type:"logout"}`**（GUII:38465）。收到 `{type:"openurl", url, filename}` → 宿主 `POST {origin}/api/tauri/download-url {url,filename}`（本地下载桥）。

### 8.2 客户端消息监听（CANVAS:19939 `vh`）

接受类型：`cowork-token {token:string}` → `onCoworkToken`、`embed-style {style}`、`codely:workspaces {workspaces[]}`、`fullscreen-change {isFullscreen}`、`logout` → `onLogout`。仅校验 `source===window.parent`（或 null），**客户端不校验 origin**（比宿主弱）。ready 上行：`{type:"ai-canvas-ready"}`（19936）；另有上行 `add-to-chat {payload}`、`codely:refreshWorkspaces`、`request-fullscreen`、`exit-fullscreen`。

### 8.3 POST /api/v1/auth/exchange（CANVAS `Dm` @19719）

```js
var Sm=`${s()}/api/v1`;                                   // 站点同源 origin；BS="https://aicanvas.tuanjie.cn"（30350）
async function Dm(e){ return Cm(await fetch(`${Sm}/auth/exchange`,{
  method:`POST`, headers:{"Content-Type":`application/json`, Authorization:`Bearer ${e}`} })) }
async function Cm(e){ let t=await e.json();
  if(t.code!==0) throw Error(t.message||`请求失败`); return t.data }
```

- **cowork-token 放在 `Authorization: Bearer` 头，无请求体**。响应包裹 `{code:number, message?, data}`，`code===0` 才取 `data`。
- `data` 内字段（`pg` @20356，原始字节验证 RAW 379180）：`data.user`、`data.tokens.access_token`、`data.tokens.refresh_token`。

### 8.4 token 保存 `pg` 与使用（CANVAS:20341–20356；RAW 验证）

```js
function pg(e,t,n,r,i){ ug(t), n(e.user), r(e.tokens.access_token||``),
  e.user.api_token,                       // 裸读取（原版残留表达式，未传给任何 setter；RAW 已核对）
  y(e.user.unity_id||``), i(e.tokens),
  document.cookie=`access_token=${e.tokens.access_token};path=/;max-age=31536000;SameSite=Lax`,
  document.cookie=`refresh_token=${e.tokens.refresh_token};path=/;max-age=94608000;SameSite=Lax` }
```

- 登录方式标记存 `localStorage["ai-workflow-auth-provider"]`（`uh` @19910，值 `"cowork"` 或 `"password"`）；`dg()` 登出清除两个 cookie + 该 localStorage 键。
- `fg(e)`（20347）：仅从 JWT（base64url 中段）`exp` 估算剩余秒数（下限 60），解析失败默认 3600——**只算过期时刻，不解析身份**。
- `mg`（CoworkAuthProvider，20445）：有 coworkAccessToken 时 `Dm(token)→pg(data,"cowork",…)`；无宿主时读 cookie `access_token` → `km(token)`（`GET /api/v1/auth/profile`，Bearer）拉 profile，`tokens={access_token, refresh_token:"", expires_in:fg(token)}`；profile 报 401/403/Unauthorized → `dg()` 清理登出。宿主路径由 `vh({onCoworkToken,onLogout})` 驱动，`onLogout→f()`（`dg()` + 清状态）。
- 其它端点：`km` GET `/auth/profile`（消费 `role`（owner/admin 展示映射 `mh`）、`points`、`unity_id`、`api_token`、`oauth_provider`）；`Am` GET `/auth/points` → `data.points`；`Tm` POST `/auth/login {username,password}`；`Om` GET `/auth/unity/login?redirect_url=<encodeURIComponent(window.location.origin+path)>` → `data.auth_url` 交给浏览器；`Em` POST `/auth/register`；`jm` POST `/auth/forgot-password {email}`。
- **Canvas 独立 refresh 端点不存在于已缓存客户端**：`grep 'auth/refresh'` 在 `remote-current/` 全部 chunk 为 0 命中；`refresh_token` 仅在 `dg()` 清 cookie 与 `pg()` 写 cookie 两处出现。不能把 Codely 主站 `/auth/refresh` 套用到 Canvas JWT。

---

## 9. 凭据存储键名与位置（只记录，不读取内容）

| 宿主 | 位置 | 键/字段 | 证据 |
| --- | --- | --- | --- |
| 桌面壳 PE | 受保护存储（keyring/vault，未读取） | `ContinueAccessToken` `ContinueRefreshToken` `ContinueAccountId` `ContinueAccountLabel` | PE 47258352/47258371/47258391/47258408（另 47438320、47523176、47651720 三份拷贝）；上下文日志：`Login with access token`、`Access token is empty`、`Failed to verify access token:`、`Failed to notify session info change:`、`Access token login completed` |
| CLI | `%USERPROFILE%\.codely-cli\oauth_creds.json`（`CODELY_CLI_HOME` 可改写目录；`vH=".codely-cli"` CLI 1212826、`oWn="oauth_creds.json"` 1330552） | `{access_token, refresh_token, token_type, expires_in, expiry_date, scope, user_id, cli_api_key(UXu 混淆), rpm, tpm}` | `H5`/`z9`/`Oz`（CLI 1319514 窗口）；`Oz()` 还调 `Jp.removeTokensByClientId("codely-cli")`（OS 凭据管理器）；`Iz()` 判定刷新提前量 `expiry_date-30000`（30 秒） |
| CLI 组织缓存 | `.codely-cli\org.json` | `{accounts:{[user_id]:{currentOrgId, currentOrgName}}}` | `GM` 类（CLI 1310700，`$qn="org.json"`） |
| CORE 组织覆盖 | Continue 全局目录下 `org.json` | 同上形状 `{accounts:{…}}` | CORE 13981333（`XRi="org.json"`）、`SRi/Jpa` |
| CORE 内存令牌 | `HI` 单例 `setAccessToken(sessionInfo.accessToken)`，令牌由壳经 `getControlPlaneSessionInfo`/`didChangeControlPlaneSessionInfo` 注入 | —— | CORE 14197650、14290850 |
| Quick 站点 | 模块内存变量 `bS`（不落盘）+ 服务端会话 cookie（`_csrf` 等，`withCredentials`） | —— | QUICK 20355–20375、38584 |
| Canvas 站点 | cookie `access_token`（365 天）/`refresh_token`（1095 天，SameSite=Lax）+ `localStorage["ai-workflow-auth-provider"]` | —— | CANVAS 20356、20344、19910 |

GameCowork 实现要求（与既有审计一致）：新凭据写入自己的受保护存储，不读、不迁移原 `Continue*` 条目或 `oauth_creds.json`；本节仅为键名与格式推断记录。

---

## 10. 已证实 vs 仍需真机确认

### 已证实（客户端源码字节级）

1. 设备流三接口的 URL、方法、请求头、请求体（initiate `{provider:"unity",client_name:"codely-cli"}`；exchange `{authorization_code}`）与 poll 六状态机、interval/timeout 语义（§1.1–1.4）。
2. `/auth/external/me` 头与消费字段 `id`（401/403 抛错、其它非 2xx 静默）；`/auth/me`（CLI 专用，`{id:number,username:string}`）并存（§2）。
3. `/auth/refresh` 请求/响应/轮换规则/400/401 处理；CLI Provider 层与桌面壳 leader/follower 两种去重实现（§3）。
4. `/api/teams`、`/api/orgs`、`/api/teams/switch` 的完整响应字段形状与 Core 双通道选择条件（JWT `account_type` 声明）（§4）。
5. `api/user/plan|usage/summary|usage/exhaustion` 的 `?orgId=` 参数名与 GUI 全部消费字段、5 分钟 plan TTL（§5）。
6. `getControlPlaneSessionInfo {silent,useOnboarding}`、`joinedInProgress`、`{status,content}` 包装、`sessionUpdate {sessionInfo}`、`Mx` 三字段非空门槛、device-flow 三事件的载荷字段与代次丢弃逻辑（§6）。
7. Quick `codely:auth {token}` → `GET /api/editor/sso/bootstrap`（Bearer）→ `GET /api/user/me`；`X-Csrf-Token`/`withCredentials`/`isMobile` 头；`my-credits/my-paid-status/cost-preview/viggle-video-quote` 字段；`C1e` 门控（§7）。
8. Canvas `POST /api/v1/auth/exchange`（Bearer cowork-token、无体、`{code,data:{user,tokens:{access_token,refresh_token}}}`）、`/auth/profile`、`/auth/points`、cookie 保存参数、`cowork-token/logout` 消息；Canvas 无独立 refresh 端点（§8）。
9. 存储键名清单（§9）。

### 仍需真机（本人授权后正常回执）确认

1. **官方对 GameCowork 自报 `client_name` 的接受规则**——CLI 的 `codely-cli` 只证明"该名字可用"，不代表任意名字可用；桌面 initiate 体是 serde 序列化（PE 无字段名可查），完整元数据未知。
2. **桌面 initiate 请求的完整字段**（是否存在 CLI 之外的 provider/元数据字段）——需真机抓本人新授权的正常回执（含 initiate 回执的字段全集）。
3. **plan/usage 响应大小写形态**：CLI 校验 snake_case（`remaining_points/is_exhausted`），GUI 消费 camelCase（`remainingPoints/isExhausted/windows`）；broker 直接对接 `codely.tuanjie.cn` 时应实测回执并两形兼容。
4. **桌面 exchange 回执中 Unity 令牌子对象**（`DeviceExchangeUnityToken`/`unity_token included` 日志）的触发条件与字段全集。
5. **Canvas 独立 refresh 是否存在**（服务端契约未知；已缓存客户端未实现）。
6. 本人账号在各组织的真实 `plan/usage/credits/paidType` 回执、Quick bootstrap 对 GameCowork 传入 token 的服务端接受度、`/api/teams/switch` 在 GameCowork 场景下是否需要（不应自动切换）。
7. legacy PKCE 回调分支对 GameCowork `authFrom`/redirect 的官方接受范围（若将来需要该分支）。

---

## 11. 给实现者的五个坑（同最终答复）

1. **state/授权码语义混淆**：legacy 回调分支的 `code` 是 Base64 JSON（内含 access/refresh token），不是标准 OAuth code；照搬标准 `/token` 交换会把"已解码的凭据"再当 code 发出去。且该分支把 codeVerifier 明文放进 state，重实现时 verifier 必须只留在自己的运行时。
2. **orgId 参数名与组织双通道**：plan/usage 的 query 参数名是 `orgId`（camelCase，精确），而组织列表接口有 `/api/teams`（`team_id/current_team_id/multi_team_enabled`）与 `/api/orgs`（`org_id/litellm_team_id/current_org_id/multi_org_enabled`）两套字段；Core 按 JWT `account_type` 声明二选一，且当前组织可能被本地 `org.json` 覆盖——"列表第一项"不是可信的当前组织（Core 也仅在无 `current_team_id` 时才回退第一项）。
3. **刷新链三处去重 + 轮换落盘顺序**：CLI 主凭据类无去重、Provider 层用共享 Promise、桌面壳用 leader/follower；refresh 返回 400/401 必须清凭据进 re-login，其它错误不得清；新 refresh_token 要先持久化再去做 me/teams/plan，失败不能丢已轮换令牌。桌面刷新是"多窗口共享一次"语义，broker 必须等价实现，否则多工作区下会互相挤兑 refresh token。
4. **device-flow 事件代次（authFlowAttemptId）**：failed/cancelled 必须按 attempt ID 丢弃旧尝试的迟到回执；`sessionUpdate` 只有在 accessToken+account.id+account.label 全非空时才算新会话；启动读档要容忍 `joinedInProgress`。忽略代次会让"取消后的旧成功"覆盖新登录。
5. **三个站点三套身份，不能互相代发**：桌面会话 token ≠ Quick 会话（bootstrap 后靠 cookie+CSRF，token 只放内存），≠ Canvas JWT（exchange 换取、cookie 保存、无独立 refresh）；Quick 的 paidType 与桌面 plan、Canvas points 是三份独立真实回执，任何一处失败只能显示未知，不能用另一处补齐；`cli-api-key` 端点属推理通道，不得自动调用。
