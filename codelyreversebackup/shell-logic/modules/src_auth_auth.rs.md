# src\auth\auth.rs

occurrences=5

## hit 1 @ 47257664 (host=18B)
```
  @ -2008 summary
  @ -1952 capability_tokenprotocolVersion
  @ -1912 Stale Unity Insight serve protocol  (need 
  @ -1816 Unity Insight serve is not running. Start a Codely CLI session for this project.Invalid project path encoding
  @ -1632 __cowork_vfs_superseded__Failed to establish Unity Insight serve sessionsession present after contains_key
  @ -1496 index.build
  @ -1456 Workspace is not a directory: 
  @ -1408 requireQueryableVfs
  @ -1312 index.ensureforceparentPathcowork.vfs_children
  @ -1240 vfs_entrycowork.vfs_entry
  @ -1184 matchCasematchWholeWordlimitcowork.vfs_search
  @ -1112 offsetcowork.vfs_path_search
  @ -1056 vfs_refsdirectioncowork.vfs_refs
  @ -1000 src\unity\ipc.rsX,
  @  -768 p7b@
  @  -672 No Unity client connected. Please ensure Unity Editor window is open.
  @  -504 drillCompleted
  @  -472 Failed to serialize drillCompleted message: 
  @  -384 closeCodelyEditorOnWorkspaceSwitchFailed to serialize closeCodelyEditorOnWorkspaceSwitch message: 
  @  -240 Failed to serialize setEmbedMode message: 
  @  -104 AuthServiceGetting user info from /auth/external/meauth/external/me
  @    +0 src\auth\auth.rs@0
  @   +40 User info API response status: 
  @   +88 API returned error status: 
  @  +136 Failed to send request: 
  @  +176 Failed to read response body: 
  @  +224 Failed to parse user info: 
  @  +272 Exchanging Unity token with serverauth/exchange-with-unity-token
  @  +368 Calling Unity token exchange APIunity_access_token
  @  +448 Unity token exchange API response status: 
  @  +512 Failed to serialize request body: 
  @  +568 Failed to parse response: 
  @  +616 Login with access tokenAccess token is empty
  @  +688 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @  +968 Failed to verify access token: 
  @ +1016 Failed to notify session info change: 
  @ +1072 Access token login completedRefresh already in flight, awaiting shared result
  @ +1176 Shared refresh result unavailable: 
  @ +1232 Refresh leader result unavailable: 
  @ +1288 Refreshing tokenauth/refresh
  @ +1352 Calling refresh API
  @ +1400 API response status: 
  @ +1440 , using defaults<3
  @ +1488 Token refresh and save completed successfullyUnity tokens provided, attempting token exchange
  @ +1608 Unity token exchange successfulUnity token exchange failed: 
  @ +1688 Unity token exchange completed successfullyFailed to update refresh token after Unity exchange: 
  @ +1800 Loading Control Plane session info...CODELY_TOKEN set, applying access token login (highest priority)
  @ +1928 Session info loaded from CODELY_TOKEN
  -- fragments --
    · summary
    · capability_tokenprotocolVersion
    · tokenprotocolVersion
    · Stale Unity Insight serve protocol  (need
    · serve
    · protocol
    · running
    · session
    · project
    · encoding
    · establish
    · sessionsession
    · present
    · after
    · contains_key
    · index.build
    · index
    · build
    · Workspace is not a directory:
    · directory
    · requireQueryableVfs
    · index.ensureforceparentPathcowork.vfs_children
    · ensureforceparentPathcowork
    · vfs_children
    · vfs_entrycowork.vfs_entry
    · vfs_entrycowork
    · vfs_entry
    · matchCasematchWholeWordlimitcowork.vfs_search
    · matchCasematchWholeWordlimitcowork
    · vfs_search
    · offsetcowork.vfs_path_search
    · offsetcowork
    · vfs_path_search
    · vfs_refsdirectioncowork.vfs_refs
    · vfs_refsdirectioncowork
    · vfs_refs
    · src\unity\ipc.rsX,
    · unity
    · unity\ipc.rsX,
    · No Unity client connected. Please ensure Unity Editor window is open.
    · client
    · connected
    · ensure
    · window
    · drillCompleted
    · Failed to serialize drillCompleted message:
    · serialize
    · message
    · closeCodelyEditorOnWorkspaceSwitchFailed
    · closeCodelyEditorOnWorkspaceSwitch
    · Failed to serialize setEmbedMode message:
    · setEmbedMode
    · AuthServiceGetting user info from /auth/external/meauth/external/me
    · uthServiceGetting
    · external
    · meauth
    · src\auth\auth.rs@0
    · auth\auth.rs@0
    · User info API response status:
    · response
    · status
    · API returned error status:
    · returned
    · error
    · Failed to send request:
    · request
    · Failed to read response body:
    · Failed to parse user info:
    · parse
    · Exchanging Unity token with serverauth/exchange-with-unity-token
    · token
    · serverauth
    · exchange
    · Calling Unity token exchange APIunity_access_token
    · APIunity
    · Unity token exchange API response status:
    · Failed to serialize request body:
    · Failed to parse response:
    · Login with access tokenAccess token is empty
    · access
    · tokenAccess
    · empty
    · ontinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError
    · getting
    · login
    · failed
    · Failed to verify access token:
    · verify
    · Failed to notify session info change:
    · notify
    · change
    · Access token login completedRefresh already in flight, awaiting shared result
    · completedRefresh
    · already
    · flight
    · awaiting
    · shared
    · result
    · Shared refresh result unavailable:
    · refresh
    · unavailable
    · Refresh leader result unavailable:
    · leader
    · Refreshing tokenauth/refresh
    · tokenauth
    · Calling refresh API
    · API response status:
    · , using defaults<3
    · using
    · defaults
    · completed
    · successfullyUnity
    · tokens
    · provided
    · attempting
    · Unity token exchange successfulUnity token exchange failed:
    · successfulUnity
    · successfullyFailed
    · update
    · applying
    · highest
    · priority
    · Session info loaded from CODELY_TOKEN
    · loaded
```

## hit 2 @ 47437564 (host=55B)
```
  @ -2031 - Adapt thoroughness to caller (quick / medium / very thorough). max_turns is a hard upper bound, not a target; **one successful vfs_refs(in or out) on the asset usually means complete_task next turn**.
  @ -1825 ## Few-shot
  @ -1810 **Task1:** Find SaveGame class and which method checks whether a specified identifier exists at a specific path. Return method name, signature, and file.
  @ -1655 **Solution:** vfs_grep `class SaveGame` type Class 
  @ -1601  vfs_grep `Exists(.*SaveGamePath` on that file type Method 
  @ -1539  vfs_read exact overload path.
  @ -1505 **Task2:** Find GameObject with exactly RectTransform, CanvasRenderer, and Image. Return its name.
  @ -1405 **Solution:** vfs_glob with component names in path pattern.
  @ -1341 **Task3:** Animator controller "Window" 
  @ -1298  which clip controls window closing?
  @ -1260 **Solution:** vfs_glob `**/*Window*.controller` 
  @ -1209  vfs_refs out `target_type: AnimationClip` 
  @ -1163  pick clip matching "close" (e.g. Close.anim vs Open.anim).
  @ -1100 **Task4:** Prefab where ONE GameObject has SpriteRenderer(texture X), AudioSource(clip Y), routed to mixer group Z.
  @  -983 **Solution:** Parallel glob for assets 
  @  -941  parallel vfs_refs(in) `target_type: Component` on X, Y, Z 
  @  -879  intersect component paths 
  @  -849  report prefab.
  @  -830 **Task5:** Which `.hlsl` does `GetMainLight.shadersubgraph` reference?
  @  -758 **Solution:** vfs_glob `**/*GetMainLight*` type ShaderGraph 
  @  -695  vfs_refs(out) on `Assets/Shaders/UtilityGraphs/GetMainLight.shadersubgraph` 
  @  -615  `Assets/Shaders/CustomLighting.hlsl`.
  @  -573 Complete the search request efficiently and report findings clearly.
  @  -498 query = "${task}"
  @  -479 inherit_core_system_prompt = false
  @  -441 [model]
  @  -432 #### Builtin transport is pinned (TOML is the ground truth). unity-insight always
  @  -349 #### runs on codely-air via the Codely OAuth provider, independent of the
  @  -274 #### user's main session model or subagent-slot (/model config) settings.
  @  -199 model = "codely-air"
  @  -177 auth = "codely-oauth"
  @  -154 wire_api = "chat"
  @  -133 [run]
  @  -126 max_turns = 15
  @  -110 timeout_mins = 10
  @   -89 [validation]
  @   -75 input_schema = { task = "string" }
  @   -39 AssetsProjectSettingsProjectVersion.txtsrc\auth\auth.rs
  @   +44 tauri2.1.3-canary.2AuthServiceOpening device auth URLrundll32url.dll,FileProtocolHandlerDevice auth URL opened in browserFailed to open device auth URL: 
  @  +220 Device authorization request has expiredCODELY_API_SERVER_ENVUsing configured Control Plane URLCONTROL_PLANE_ENVtestUsing Control Plane URL for production environmenthttps://codely.tuanjie.cn/Using Control Plane URL for ...(+227)
  @  +692 messageTypedevice-flow-failedLogging out - clearing session infoContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabel
  @  +988 Logout completed
  @ +1028 Cleared org_state_cachecodely-sleep-inhibitionsleep inhibition thread exited early: 
  @ +1132 failed to start sleep inhibition thread: 
  @ +1196 wmiccpugetName, pathwin32_VideoControllervirtualremotetodeskmirageiddmicrosoft basic rendermicrosoft remote displayddasunshineparsecanydeskteamviewerusb displaydysonspacedeskdeskreencomputersystemTotalPhysicalMemory MB
  @ +1540 AddedUpdatedDeletedRenamedaddedupdateddeletedrenamedkindparentPatholdPatholdParentPathchangesmessageIdworkspaceIdfield identifierstruct IpcResponseemailusernamestruct UserInforefresh_tokenaccess_tokenstruct RefreshTokenR...(+27)
  -- fragments --
    · thoroughness
    · caller
    · quick
    · medium
    · thorough
    · max_turns
    · upper
    · bound
    · target
    · successful
    · vfs_refs
    · asset
    · usually
    · means
    · complete_task
    · ## Few-shot
    · aveGame
    · class
    · which
    · method
    · checks
    · whether
    · specified
    · identifier
    · exists
    · specific
    · signature
    · **Solution:** vfs_grep `class SaveGame` type Class
    · vfs_grep
    · vfs_grep `Exists(.*SaveGamePath` on that file type Method
    · aveGamePath
    · vfs_read exact overload path.
    · vfs_read
    · exact
    · overload
    · ameObject
    · exactly
    · ectTransform
    · anvasRenderer
    · **Solution:** vfs_glob with component names in path pattern.
    · vfs_glob
    · component
    · names
    · pattern
    · **Task3:** Animator controller "Window"
    · controller
    · which clip controls window closing?
    · controls
    · window
    · closing
    · **Solution:** vfs_glob `**/*Window*.controller`
    · vfs_refs out `target_type: AnimationClip`
    · target_type
    · nimationClip
    · pick clip matching "close" (e.g. Close.anim vs Open.anim).
    · matching
    · close
    · where
    · priteRenderer
    · texture
    · udioSource
    · routed
    · mixer
    · group
    · **Solution:** Parallel glob for assets
    · assets
    · parallel vfs_refs(in) `target_type: Component` on X, Y, Z
    · parallel
    · intersect component paths
    · intersect
    · paths
    · report prefab.
    · report
    · prefab
    · **Task5:** Which `.hlsl` does `GetMainLight.shadersubgraph` reference?
    · etMainLight
    · shadersubgraph
    · reference
    · **Solution:** vfs_glob `**/*GetMainLight*` type ShaderGraph
    · haderGraph
    · vfs_refs(out) on `Assets/Shaders/UtilityGraphs/GetMainLight.shadersubgraph`
    · tilityGraphs
    · `Assets/Shaders/CustomLighting.hlsl`.
    · ustomLighting
    · Complete the search request efficiently and report findings clearly.
    · search
    · request
    · efficiently
    · findings
    · clearly
    · query = "${task}"
    · query
    · inherit_core_system_prompt = false
    · inherit_core_system_prompt
    · false
    · [model]
    · model
    · #### Builtin transport is pinned (TOML is the ground truth). unity-insight always
    · transport
    · pinned
    · ground
    · truth
    · unity
    · insight
    · always
    · #### runs on codely-air via the Codely OAuth provider, independent of the
    · codely
    · OAuth
    · provider
    · independent
    · #### user's main session model or subagent-slot (/model config) settings.
    · session
    · subagent
    · config
    · settings
    · model = "codely-air"
    · auth = "codely-oauth"
    · oauth
    · wire_api = "chat"
    · wire_api
    · [run]
    · max_turns = 15
    · timeout_mins = 10
    · timeout_mins
    · [validation]
    · validation
    · input_schema = { task = "string" }
    · input_schema
    · string
    · AssetsProjectSettingsProjectVersion.txt
    · ssetsProjectSettingsProjectVersion
    · src\auth\auth.rs
    · auth\auth.rs
    · tauri2
    · canary
    · uthServiceOpening
    · device
    · URLrundll
    · ileProtocolHandlerDevice
    · opened
    · browserFailed
    · authorization
    · ENVUsing
    · configured
    · ENVtestUsing
    · production
    · environment
    · https://codely.tuanjie.cn/Using Control Plane URL for test environment
    · https
    · tuanjie
```

## hit 3 @ 47522488 (host=16B)
```
  @ -1992 windowLabelFailed to acquire lock: 
  @ -1912 Failed to shutdown previous LSP manager: 
  @ -1848 Failed to load LSP server configs for workspace 
  @ -1768 Failed to initialize LSP manager for workspace 
  @ -1568 Failed to save hub project: 
  @ -1520 HubProjects
  @ -1480 Unable to resolve cowork-side-projects.json pathFailed to create 
  @ -1376 Failed to serialize cowork-side-projects.json: 
  @ -1312 Failed to write 
  @ -1216 Failed to create recent projects directory: 
  @ -1152 Failed to serialize recent projects: 
  @ -1096 Failed to write recent projects: 
  @ -1016 Failed to migrate machine ID aliases: 
  @  -960 Workspacesrc\unity\ipc.rs
  @  -808 p7b@
  @  -672 No Unity client connected. Please ensure Unity Editor window is open.
  @  -504 drillCompleted
  @  -472 Failed to serialize drillCompleted message: 
  @  -384 closeCodelyEditorOnWorkspaceSwitchFailed to serialize closeCodelyEditorOnWorkspaceSwitch message: 
  @  -240 Failed to serialize setEmbedMode message: 
  @  -104 AuthServiceGetting user info from /auth/external/meauth/external/me
  @    +0 src\auth\auth.rs
  @   +40 User info API response status: 
  @   +88 API returned error status: 
  @  +136 Failed to send request: @;
  @  +176 Failed to read response body: 
  @  +224 Failed to parse user info: 
  @  +272 Exchanging Unity token with serverauth/exchange-with-unity-token
  @  +368 Calling Unity token exchange APIunity_access_token
  @  +448 Unity token exchange API response status: 
  @  +512 Failed to serialize request body: 
  @  +568 Failed to parse response: 
  @  +616 Login with access tokenAccess token is empty
  @  +688 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @  +968 Failed to verify access token: 
  @ +1016 Failed to notify session info change: 
  @ +1072 Access token login completedRefresh already in flight, awaiting shared result
  @ +1176 Shared refresh result unavailable: 
  @ +1232 Refresh leader result unavailable: 
  @ +1288 Refreshing tokenauth/refresh
  @ +1352 Calling refresh API
  @ +1400 API response status: 
  @ +1440 , using defaults
  @ +1488 Token refresh and save completed successfullyUnity tokens provided, attempting token exchange
  @ +1608 Unity token exchange successfulUnity token exchange failed: 
  @ +1688 Unity token exchange completed successfullyFailed to update refresh token after Unity exchange: {A
  @ +1800 Loading Control Plane session info...CODELY_TOKEN set, applying access token login (highest priority)
  @ +1928 Session info loaded from CODELY_TOKENAUTH_TYPE
  -- fragments --
    · windowLabelFailed to acquire lock:
    · windowLabelFailed
    · acquire
    · Failed to shutdown previous LSP manager:
    · shutdown
    · previous
    · manager
    · Failed to load LSP server configs for workspace
    · server
    · configs
    · workspace
    · Failed to initialize LSP manager for workspace
    · initialize
    · Failed to save hub project:
    · project
    · HubProjects
    · ubProjects
    · Unable to resolve cowork-side-projects.json pathFailed to create
    · resolve
    · cowork
    · projects
    · pathFailed
    · create
    · Failed to serialize cowork-side-projects.json:
    · serialize
    · Failed to write
    · write
    · Failed to create recent projects directory:
    · recent
    · directory
    · Failed to serialize recent projects:
    · Failed to write recent projects:
    · Failed to migrate machine ID aliases:
    · migrate
    · machine
    · aliases
    · Workspace
    · src\unity\ipc.rs
    · unity
    · unity\ipc.rs
    · No Unity client connected. Please ensure Unity Editor window is open.
    · client
    · connected
    · ensure
    · window
    · drillCompleted
    · Failed to serialize drillCompleted message:
    · message
    · closeCodelyEditorOnWorkspaceSwitchFailed
    · closeCodelyEditorOnWorkspaceSwitch
    · Failed to serialize setEmbedMode message:
    · setEmbedMode
    · AuthServiceGetting user info from /auth/external/meauth/external/me
    · uthServiceGetting
    · external
    · meauth
    · src\auth\auth.rs
    · auth\auth.rs
    · User info API response status:
    · response
    · status
    · API returned error status:
    · returned
    · error
    · Failed to send request: @;
    · request
    · Failed to read response body:
    · Failed to parse user info:
    · parse
    · Exchanging Unity token with serverauth/exchange-with-unity-token
    · token
    · serverauth
    · exchange
    · Calling Unity token exchange APIunity_access_token
    · APIunity
    · Unity token exchange API response status:
    · Failed to serialize request body:
    · Failed to parse response:
    · Login with access tokenAccess token is empty
    · access
    · tokenAccess
    · empty
    · ontinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError
    · getting
    · login
    · failed
    · Failed to verify access token:
    · verify
    · Failed to notify session info change:
    · notify
    · session
    · change
    · Access token login completedRefresh already in flight, awaiting shared result
    · completedRefresh
    · already
    · flight
    · awaiting
    · shared
    · result
    · Shared refresh result unavailable:
    · refresh
    · unavailable
    · Refresh leader result unavailable:
    · leader
    · Refreshing tokenauth/refresh
    · tokenauth
    · Calling refresh API
    · API response status:
    · , using defaults
    · using
    · defaults
    · completed
    · successfullyUnity
    · tokens
    · provided
    · attempting
    · Unity token exchange successfulUnity token exchange failed:
    · successfulUnity
    · successfullyFailed
    · update
    · after
    · applying
    · highest
    · priority
    · Session info loaded from CODELY_TOKENAUTH_TYPE
    · loaded
```

## hit 4 @ 47651032 (host=16B)
```
  @ -2040 Invalid JSON RPC response for 
  @ -1976 summary
  @ -1896 capability_tokenprotocolVersion
  @ -1856 Stale Unity Insight serve protocol  (need 
  @ -1760 Unity Insight serve is not running. Start a Codely CLI session for this project.Invalid project path encoding
  @ -1576 __cowork_vfs_superseded__Failed to establish Unity Insight serve sessionsession present after contains_key
  @ -1440 Workspace is not a directory: 
  @ -1392 requireQueryableVfs
  @ -1344 cowork.vfs_children
  @ -1296 src\unity\ipc.rs
  @ -1160 p7b@
  @ -1040 Pipe created: 
  @ -1008 UnityIpcServerIPC path updated, restarting pipe server on new pathGetNamedPipeClientProcessId failedUnity PID: 
  @  -880 Unity connected!
  @  -768 Failed to create pipe . Retrying...
  @  -560 Unity disconnected
  @  -464 Read error, connection closed
  @  -384 No Unity client connected. Please ensure Unity Editor window is open.
  @  -240 Failed to serialize setEmbedMode message: 
  @  -104 AuthServiceGetting user info from /auth/external/meauth/external/me
  @    +0 src\auth\auth.rs
  @   +40 User info API response status: 
  @   +88 API returned error status: 
  @  +136 Failed to send request: `1
  @  +176 Failed to read response body: 
  @  +224 Failed to parse user info: 
  @  +272 Exchanging Unity token with serverauth/exchange-with-unity-token
  @  +368 Calling Unity token exchange APIunity_access_token
  @  +448 Unity token exchange API response status: 
  @  +512 Failed to serialize request body: 
  @  +568 Failed to parse response: 
  @  +616 Login with access tokenAccess token is empty
  @  +688 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @  +968 Failed to verify access token: 
  @ +1016 Failed to notify session info change: 
  @ +1072 Access token login completedRefresh already in flight, awaiting shared result
  @ +1176 Shared refresh result unavailable: 
  @ +1232 Refresh leader result unavailable: 
  @ +1288 Refreshing tokenauth/refresh
  @ +1352 Calling refresh API
  @ +1400 API response status: 
  @ +1440 , using defaults
  @ +1488 Token refresh and save completed successfullyUnity tokens provided, attempting token exchange
  @ +1608 Unity token exchange successfulUnity token exchange failed: 
  @ +1688 Unity token exchange completed successfullyFailed to update refresh token after Unity exchange: 
  @ +1800 Loading Control Plane session info...CODELY_TOKEN set, applying access token login (highest priority)
  @ +1928 Session info loaded from CODELY_TOKENAUTH_TYPE
  -- fragments --
    · Invalid JSON RPC response for
    · response
    · summary
    · capability_tokenprotocolVersion
    · tokenprotocolVersion
    · Stale Unity Insight serve protocol  (need
    · serve
    · protocol
    · running
    · session
    · project
    · encoding
    · establish
    · sessionsession
    · present
    · after
    · contains_key
    · Workspace is not a directory:
    · directory
    · requireQueryableVfs
    · cowork.vfs_children
    · cowork
    · vfs_children
    · src\unity\ipc.rs
    · unity
    · unity\ipc.rs
    · Pipe created:
    · created
    · nityIpcServer
    · updated
    · restarting
    · server
    · pathGetNamedPipeClientProcessId
    · failedUnity
    · Unity connected!
    · connected
    · Failed to create pipe . Retrying...
    · create
    · Unity disconnected
    · disconnected
    · Read error, connection closed
    · error
    · connection
    · closed
    · No Unity client connected. Please ensure Unity Editor window is open.
    · client
    · ensure
    · window
    · Failed to serialize setEmbedMode message:
    · serialize
    · setEmbedMode
    · message
    · AuthServiceGetting user info from /auth/external/meauth/external/me
    · uthServiceGetting
    · external
    · meauth
    · src\auth\auth.rs
    · auth\auth.rs
    · User info API response status:
    · status
    · API returned error status:
    · returned
    · Failed to send request: `1
    · request
    · Failed to read response body:
    · Failed to parse user info:
    · parse
    · Exchanging Unity token with serverauth/exchange-with-unity-token
    · token
    · serverauth
    · exchange
    · Calling Unity token exchange APIunity_access_token
    · APIunity
    · Unity token exchange API response status:
    · Failed to serialize request body:
    · Failed to parse response:
    · Login with access tokenAccess token is empty
    · access
    · tokenAccess
    · empty
    · ontinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError
    · getting
    · login
    · failed
    · Failed to verify access token:
    · verify
    · Failed to notify session info change:
    · notify
    · change
    · Access token login completedRefresh already in flight, awaiting shared result
    · completedRefresh
    · already
    · flight
    · awaiting
    · shared
    · result
    · Shared refresh result unavailable:
    · refresh
    · unavailable
    · Refresh leader result unavailable:
    · leader
    · Refreshing tokenauth/refresh
    · tokenauth
    · Calling refresh API
    · API response status:
    · , using defaults
    · using
    · defaults
    · completed
    · successfullyUnity
    · tokens
    · provided
    · attempting
    · Unity token exchange successfulUnity token exchange failed:
    · successfulUnity
    · successfullyFailed
    · update
    · applying
    · highest
    · priority
    · Session info loaded from CODELY_TOKENAUTH_TYPE
    · loaded
```

## hit 5 @ 47729840 (host=16B)
```
  @ -2048 /api/tauri/unity-insight/get-enabled
  @ -1984 /api/tauri/unity-insight/set-enabled
  @ -1920 /api/tauri/unity-insight/get-max-turns
  @ -1856 /api/tauri/unity-insight/set-max-turns
  @ -1792 /api/tauri/unity-insight/vfs-children
  @ -1728 /api/tauri/unity-insight/vfs-entry
  @ -1664 /api/tauri/unity-insight/vfs-search
  @ -1600 /api/tauri/unity-insight/vfs-path-searchXG
  @ -1536 /api/tauri/unity-insight/vfs-refs
  @ -1472 /api/tauri/drop-files
  @ -1424 /api/tauri/local-file-content
  @ -1368 /api/tauri/download-url
  @ -1320 index.html
  @ -1228   (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from 
  @ -1104 Failed to bind: ``
  @ -1072 Invalid --bind-host: 
  @ -1000 src\unity\ipc.rs
  @  -768 p7b@
  @  -672 No Unity client connected. Please ensure Unity Editor window is open.
  @  -504 drillCompleted
  @  -472 Failed to serialize drillCompleted message: 
  @  -384 closeCodelyEditorOnWorkspaceSwitchFailed to serialize closeCodelyEditorOnWorkspaceSwitch message: 
  @  -240 Failed to serialize setEmbedMode message: 
  @  -104 AuthServiceGetting user info from /auth/external/meauth/external/me
  @    +0 src\auth\auth.rs
  @   +40 User info API response status: 
  @   +88 API returned error status: 
  @  +136 Failed to send request: 8e
  @  +176 Failed to read response body: 
  @  +224 Failed to parse user info: 
  @  +272 Exchanging Unity token with serverauth/exchange-with-unity-token
  @  +368 Calling Unity token exchange APIunity_access_token
  @  +448 Unity token exchange API response status: 
  @  +512 Failed to serialize request body: 
  @  +568 Failed to parse response: 
  @  +616 Login with access tokenAccess token is empty
  @  +688 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @  +968 Failed to verify access token: 
  @ +1016 Failed to notify session info change: 
  @ +1072 Access token login completedRefresh already in flight, awaiting shared result
  @ +1176 Shared refresh result unavailable: 
  @ +1232 Refresh leader result unavailable: 
  @ +1288 Refreshing tokenauth/refresh
  @ +1352 Calling refresh API
  @ +1400 API response status: 
  @ +1440 , using defaults
  @ +1488 Token refresh and save completed successfullyUnity tokens provided, attempting token exchange
  @ +1608 Unity token exchange successfulUnity token exchange failed: 
  @ +1688 Unity token exchange completed successfullyFailed to update refresh token after Unity exchange: sk
  @ +1800 Loading Control Plane session info...CODELY_TOKEN set, applying access token login (highest priority)
  @ +1928 Session info loaded from CODELY_TOKENAUTH_TYPE
  -- fragments --
    · /api/
    · tauri/unity-insight/get-enabled
    · tauri
    · unity
    · insight
    · enabled
    · unity-insight/get-enabled
    · tauri/unity-insight/set-enabled
    · unity-insight/set-enabled
    · tauri/unity-insight/get-max-turns
    · turns
    · unity-insight/get-max-turns
    · tauri/unity-insight/set-max-turns
    · unity-insight/set-max-turns
    · tauri/unity-insight/vfs-children
    · children
    · unity-insight/vfs-children
    · tauri/unity-insight/vfs-entry
    · entry
    · unity-insight/vfs-entry
    · tauri/unity-insight/vfs-search
    · search
    · unity-insight/vfs-search
    · tauri/unity-insight/vfs-path-searchXG
    · unity-insight/vfs-path-searchXG
    · tauri/unity-insight/vfs-refs
    · unity-insight/vfs-refs
    · tauri/drop-files
    · files
    · drop-files
    · tauri/local-file-content
    · local
    · content
    · local-file-content
    · tauri/download-url
    · download
    · download-url
    · index.html
    · index
    · (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from
    · invoke
    · events
    · embed
    · folder
    · workspace
    · Failed to bind: ``
    · Invalid --bind-host:
    · src\unity\ipc.rs
    · unity\ipc.rs
    · No Unity client connected. Please ensure Unity Editor window is open.
    · client
    · connected
    · ensure
    · window
    · drillCompleted
    · Failed to serialize drillCompleted message:
    · serialize
    · message
    · closeCodelyEditorOnWorkspaceSwitchFailed
    · closeCodelyEditorOnWorkspaceSwitch
    · Failed to serialize setEmbedMode message:
    · setEmbedMode
    · AuthServiceGetting user info from /auth/external/meauth/external/me
    · uthServiceGetting
    · external
    · meauth
    · src\auth\auth.rs
    · auth\auth.rs
    · User info API response status:
    · response
    · status
    · API returned error status:
    · returned
    · error
    · Failed to send request: 8e
    · request
    · Failed to read response body:
    · Failed to parse user info:
    · parse
    · Exchanging Unity token with serverauth/exchange-with-unity-token
    · token
    · serverauth
    · exchange
    · Calling Unity token exchange APIunity_access_token
    · APIunity
    · Unity token exchange API response status:
    · Failed to serialize request body:
    · Failed to parse response:
    · Login with access tokenAccess token is empty
    · access
    · tokenAccess
    · empty
    · ontinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError
    · getting
    · login
    · failed
    · Failed to verify access token:
    · verify
    · Failed to notify session info change:
    · notify
    · session
    · change
    · Access token login completedRefresh already in flight, awaiting shared result
    · completedRefresh
    · already
    · flight
    · awaiting
    · shared
    · result
    · Shared refresh result unavailable:
    · refresh
    · unavailable
    · Refresh leader result unavailable:
    · leader
    · Refreshing tokenauth/refresh
    · tokenauth
    · Calling refresh API
    · API response status:
    · , using defaults
    · using
    · defaults
    · completed
    · successfullyUnity
    · tokens
    · provided
    · attempting
    · Unity token exchange successfulUnity token exchange failed:
    · successfulUnity
    · successfullyFailed
    · update
    · after
    · applying
    · highest
    · priority
    · Session info loaded from CODELY_TOKENAUTH_TYPE
    · loaded
```
