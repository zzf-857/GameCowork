# src\unity\ipc.rs

occurrences=7

## hit 1 @ 47125328 (host=18B)
```
  @ -2000 /api/tauri/hub/reorder-workspaces
  @ -1936 /api/tauri/window-bridge/local/:token/*path
  @ -1864 /api/tauri/window-bridge/remote/:token/*path
  @ -1768 /api/tauri/file-explorer
  @ -1720 /api/tauri/file-preview-media
  @ -1664 /api/tauri/file-explorer/search-stream
  @ -1600 /api/tauri/file-explorer/events
  @ -1544 /api/tauri/unity-insight/index-status
  @ -1480 /api/tauri/unity-insight/active-build
  @ -1416 /api/tauri/unity-insight/live-serves
  @ -1352 /api/tauri/unity-insight/ensure-index
  @ -1288 /api/tauri/unity-insight/get-enabled
  @ -1224 /api/tauri/unity-insight/set-enabled
  @ -1160 /api/tauri/unity-insight/get-max-turns
  @ -1096 /api/tauri/unity-insight/set-max-turns
  @ -1032 /api/tauri/unity-insight/vfs-children
  @  -968 /api/tauri/unity-insight/vfs-entry
  @  -904 /api/tauri/unity-insight/vfs-search
  @  -840 /api/tauri/unity-insight/vfs-path-search
  @  -776 /api/tauri/unity-insight/vfs-refs
  @  -712 /api/tauri/drop-files
  @  -664 /api/tauri/local-file-content
  @  -608 /api/tauri/download-url
  @  -560 index.html
  @  -460   (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from 
  @  -336 Failed to bind: 
  @  -304 Invalid --bind-host: 
  @  -264 (?s)\[run\]([^\[]*)run section regexsrc\unity\insight_agent_toml.rs
  @  -168 (?m)^(\s*max_turns\s*=\s*)-?\d+(\s*)$max_turns line regex
  @   -80 (?m)^\s*max_turns\s*=\s*(-?\d+)\s*$max_turns value regexl*
  @    +0 src\unity\ipc.rsP+
  @  +232 No Unity client connected. Please ensure Unity Editor window is open.Failed to serialize message: 
  @  +376 cowork_client_installedsrc\metrics.rs[client_installed] skipped; sentinel exists at 
  @  +480 UnityMetrics
  @  +520 failed to resolve data dir
  @  +576 Closed terminal session in 
  @  +624 TerminalClosed terminal in 
  @  +672 src\tunnel.rs
  @  +736 Tunnel stopped: 0.
  @  +768 Tunnel/api/v1/frp/disconnect
  @  +832 Disconnecting tunnel ''
  @  +912 Tunnel '' already disconnected (404)
  @  +984 Server returned (/
  @ +1032 ' disconnected
  @ +1080 API status was not 'success': 
  @ +1128 HTTP request failed: 
  @ +1168 Failed to read response body: 
  @ +1216 Failed to parse response:  
  @ +1246  body: 
  @ +1288 src\lib.rs
  @ +1328 Restored saved Hub project: id=, path=
  @ +1424 Failed to restore saved Hub project 
  @ +1496 Failed to prune saved Hub projects: 
  @ +1600 start_cores: workspace_count=
  @ +1648 CorePoolProcessing CLI workspace: raw=, normalized=
  @ +1736 SingleInstance
  @ +1776 Workspace already registered, focusing: @2
  @ +1832 Failed to acquire lock for CLI workspace: 
  @ +1896 Failed to register workspace from CLI: 
  @ +1952 Registered workspace from CLI: id=
  -- fragments --
    · /api/
    · tauri/hub/reorder-workspaces
    · tauri
    · reorder
    · workspaces
    · hub/reorder-workspaces
    · tauri/window-bridge/local/:token/*path
    · window
    · bridge
    · local
    · token
    · window-bridge/local/:token/*path
    · tauri/window-bridge/remote/:token/*path
    · remote
    · window-bridge/remote/:token/*path
    · tauri/file-explorer
    · explorer
    · file-explorer
    · tauri/file-preview-media
    · preview
    · media
    · file-preview-media
    · tauri/file-explorer/search-stream
    · search
    · stream
    · file-explorer/search-stream
    · tauri/file-explorer/events
    · events
    · file-explorer/events
    · tauri/unity-insight/index-status
    · unity
    · insight
    · index
    · status
    · unity-insight/index-status
    · tauri/unity-insight/active-build
    · active
    · build
    · unity-insight/active-build
    · tauri/unity-insight/live-serves
    · serves
    · unity-insight/live-serves
    · tauri/unity-insight/ensure-index
    · ensure
    · unity-insight/ensure-index
    · tauri/unity-insight/get-enabled
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
    · unity-insight/vfs-search
    · tauri/unity-insight/vfs-path-search
    · unity-insight/vfs-path-search
    · tauri/unity-insight/vfs-refs
    · unity-insight/vfs-refs
    · tauri/drop-files
    · files
    · drop-files
    · tauri/local-file-content
    · content
    · local-file-content
    · tauri/download-url
    · download
    · download-url
    · index.html
    · (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from
    · invoke
    · embed
    · folder
    · workspace
    · Failed to bind:
    · Invalid --bind-host:
    · (?s)\[run\]([^\[]*)run section regex
    · section
    · regex
    · src\unity\insight_agent_toml.rs
    · insight_agent_toml
    · unity\insight_agent_toml.rs
    · (?m)^(\s*max_turns\s*=\s*)-?\d+(\s*)$max_turns line regex
    · max_turns
    · (?m)^\s*max_turns\s*=\s*(-?\d+)\s*$max_turns value regexl*
    · value
    · regexl
    · src\unity\ipc.rsP+
    · unity\ipc.rsP+
    · client
    · connected
    · serialize
    · message
    · cowork_client_installed
    · src\metrics.rs[client_installed] skipped; sentinel exists at
    · metrics
    · client_installed
    · skipped
    · sentinel
    · exists
    · metrics.rs[client_installed] skipped; sentinel exists at
    · UnityMetrics
    · nityMetrics
    · failed to resolve data dir
    · failed
    · resolve
    · Closed terminal session in
    · terminal
    · session
    · TerminalClosed terminal in
    · erminalClosed
    · src\tunnel.rs
    · tunnel
    · tunnel.rs
    · Tunnel stopped: 0.
    · stopped
    · Tunnel
    · /api/v1/frp/disconnect
    · disconnect
    · v1/frp/disconnect
    · Disconnecting tunnel ''
    · Tunnel '' already disconnected (404)
    · already
    · disconnected
    · Server returned (/
    · returned
    · ' disconnected
    · API status was not 'success':
    · success
    · HTTP request failed:
    · request
    · Failed to read response body:
    · response
    · Failed to parse response:
    · parse
    · body:
    · src\lib.rs
    · lib.rs
    · Restored saved Hub project: id=, path=
    · saved
    · project
    · Failed to restore saved Hub project
```

## hit 2 @ 47159064 (host=16B)
```
  @ -2048 headless-src\core\tcp_ipc_messenger.rs
  @ -1984 TcpIpcMessengerDisposing TCP connectionCurrent directory path contains invalid UTF-8Using current directory: 
  @ -1856 Lock error: 
  @ -1824 Failed to get current directory: 
  @ -1768 codely_virtual__0
  @ -1720 Created temp file: 
  @ -1680 IdeProtocolClientFailed to create temp file: 
  @ -1616 Failed to write to temp file: 
  @ -1568 remoteConfigServerUrlsrc\ide\ide_protocol_client.rsremoteConfigSyncPeriodcontinueTestEnvironmentpauseCodebaseIndexOnStartonLoad: windowId=, workspaceDirs=, vscMachineId=
  @ -1320 COMPUTERNAMEUSERNAME
  @ -1264 HOSTNAMEUSERUnable to determine home directory
  @ -1192 filepath.git
  @ -1128 gitrev-parse--show-toplevelAt least one Git path is requiredGit paths must be repository-relative--literal-pathspecs--Git file action failedFailed to run git: 
  @  -952 HEAD:
  @  -928 cat-file-els-files--error-unmatcholdPath
  @  -864 infotypemessageshowToast: [] 
  @  -800 ide-settings.jsonexternalScriptEditorexternalScriptEditorNamerundll32.exeshell32.dll,OpenAs_RunDLL/CstartSystem default open exited with status  for , showing Open Witha
  @  -584 vscode/Edit/Commandedit.goto 
  @  -536 --line--reuse-window--goto:
  @  -472 Launched external editor for showLinesFailed to launch external editor: f
  @  -384 Opened file with system default application (line jump not applied)Failed to open with system default app: 
  @  -256 canSelectFoldersfilters
  @  -208 File selected: 
  @  -176 File picker cancelleddefaultPathFolder selected: 
  @  -104 Folder picker cancelled*.*statusdatastateturn:turn://@
  @    +0 src\unity\ipc.rs
  @   +40 CodelyUnityIpc
  @   +72 \\.\pipe\-
  @  +136 recompile<none>Creating IPC server with named pipe:  (workspace=)
  @  +256 UnityIpcServerUpdating IPC path to: 
  @  +312 src\tunnel.rsfailed to resolve user .codely directorytunnel-machine-instance-idtunnel-machine-canonical-idfailed to replace invalid 
  @  +480 failed to create 
  @  +536 failed to write 0
  @  +584 failed to sync 
  @  +632 server returned an invalid canonical machine IDcodely-machine:v2
  @  +728 still starting after ms, past the s startup grace
  @  +832 an unknown interval ms
  @  +888 control path silent for 
  @  +928 runningexitedstoppingno error reported:  (age ms)
  @ +1032 tunnel_idauth_tokenStarting embedded frp client: localPort: -> 
  @ +1144 Tunnelstruct AppMetadata with 5 elements
  @ +1200 pidhttp_portsingle_instancecreated_atupdated_atstruct LockMetadata with 5 elements
  @ +1304 workspace_dirstruct PendingUpdate with 4 elements
  @ +1376 versiondatechannelstruct IpcResponse with 4 elements
  @ +1448 messageTypemessageIdworkspaceIdrun_idserver_udp_portproxy_nameremote_addrsrc_addrdst_addrsrc_portdst_portstruct Position with 2 elements)
  @ +1600 struct Range with 2 elements
  @ +1648 struct GrepSearchOptionsstruct BuildPlatform with 4 elements
  @ +1728 struct InstallModule with 19 elements
  @ +1784 struct EditorInstall with 11 elements
  @ +1840 struct Project with 16 elements
  @ +1888 struct GetSizesParams with 1 element
  @ +1944 struct GetSizesResult with 1 element
  @ +2000 struct OpenProjectParams with 3 elements
  -- fragments --
    · headless-
    · headless
    · src\core\tcp_ipc_messenger.rs
    · tcp_ipc_messenger
    · core\tcp_ipc_messenger.rs
    · cpIpcMessengerDisposing
    · connectionCurrent
    · directory
    · contains
    · invalid
    · current
    · Lock error:
    · error
    · Failed to get current directory:
    · codely_virtual__0
    · Created temp file:
    · IdeProtocolClientFailed to create temp file:
    · deProtocolClientFailed
    · create
    · Failed to write to temp file:
    · write
    · remoteConfigServerUrl
    · src\ide\ide_protocol_client.rsremoteConfigSyncPeriodcontinueTestEnvironmentpauseCode
    · ide_protocol_client
    · rsremoteConfigSyncPeriodcontinueTestEnvironmentpauseCode
    · rsremoteConfigSyncPeriodcontinueTestEnvironmentpauseCodebaseIndexOnStartonLoad
    · windowId
    · workspaceDirs
    · vscMachineId
    · COMPUTERNAMEUSERNAME
    · HOSTNAMEUSERUnable to determine home directory
    · HOSTNAMEUSERUnable
    · determine
    · filepath.git
    · filepath
    · gitrev
    · parse
    · toplevelAt
    · least
    · requiredGit
    · paths
    · repository
    · relative
    · literal
    · pathspecs
    · action
    · failedFailed
    · HEAD:
    · cat-file-els-files--error-unmatcholdPath
    · files
    · unmatcholdPath
    · infotypemessageshowToast: []
    · infotypemessageshowToast
    · settings
    · jsonexternalScriptEditorexternalScriptEditorNamerundll32
    · exeshell32
    · penAs
    · startSystem
    · default
    · exited
    · status
    · showing
    · vscode/Edit/Commandedit.goto
    · vscode
    · --line--reuse-window--goto:
    · reuse
    · window
    · Launched external editor for showLinesFailed to launch external editor: f
    · external
    · editor
    · showLinesFailed
    · launch
    · system
    · application
    · applied
    · canSelectFoldersfilters
    · File selected:
    · selected
    · File picker cancelleddefaultPathFolder selected:
    · picker
    · cancelleddefaultPathFolder
    · Folder picker cancelled*.*statusdatastateturn:turn://@
    · cancelled
    · statusdatastateturn
    · src\unity\ipc.rs
    · unity
    · unity\ipc.rs
    · CodelyUnityIpc
    · odelyUnityIpc
    · \\.\pipe\-
    · recompile<none>Creating IPC server with named pipe:  (workspace=)
    · recompile
    · server
    · named
    · workspace
    · UnityIpcServerUpdating IPC path to:
    · nityIpcServerUpdating
    · src\tunnel.rsfailed to resolve user .codely directorytunnel-machine-instance-idtunne
    · tunnel
    · rsfailed
    · resolve
    · codely
    · directorytunnel
    · machine
    · instance
    · idtunne
    · idtunnel
    · canonical
    · idfailed
    · replace
    · failed to create
    · failed
    · failed to write 0
    · failed to sync
    · server returned an invalid canonical machine IDcodely-machine:v2
    · returned
    · IDcodely
    · still starting after ms, past the s startup grace
    · still
    · starting
    · after
    · startup
    · grace
    · an unknown interval ms
    · unknown
    · interval
    · control path silent for
    · control
    · silent
    · runningexitedstoppingno error reported:  (age ms)
    · runningexitedstoppingno
    · reported
    · tunnel_idauth_tokenStarting embedded frp client: localPort: ->
    · tokenStarting
    · embedded
    · client
    · localPort
    · Tunnelstruct AppMetadata with 5 elements
    · ppMetadata
    · elements
    · pidhttp_portsingle_instancecreated_atupdated_atstruct LockMetadata with 5 elements
    · pidhttp_portsingle_instancecreated_atupdated_atstruct
    · ockMetadata
    · workspace_dirstruct PendingUpdate with 4 elements
    · workspace_dirstruct
    · endingUpdate
    · versiondatechannelstruct IpcResponse with 4 elements
    · versiondatechannelstruct
    · pcResponse
    · messageTypemessageIdworkspaceIdrun
```

## hit 3 @ 47256664 (host=18B)
```
  @ -2000 Unity Insight serve (pid ) did not exit after SIGTERM/SIGKILL
  @ -1904 Unity Insight serve lock still present after recycle: 
  @ -1712 Connect timeout to 
  @ -1656 Connect failed to 
  @ -1512 RPC '' timed out after ms
  @ -1432 ' saw  leftover responses (session desynced)
  @ -1336 Unexpected RPC status for 
  @ -1272 /error/messageUnity Insight RPC errorEmpty RPC response for 
  @ -1192 Failed to write RPC 
  @ -1136 Failed to read RPC  response: 
  @ -1072 Invalid JSON RPC response for 
  @ -1008 summary
  @  -952 capability_tokenprotocolVersion
  @  -912 Stale Unity Insight serve protocol  (need 
  @  -816 Unity Insight serve is not running. Start a Codely CLI session for this project.Invalid project path encoding
  @  -632 __cowork_vfs_superseded__Failed to establish Unity Insight serve sessionsession present after contains_key
  @  -496 index.build
  @  -456 Workspace is not a directory: 
  @  -408 requireQueryableVfs
  @  -312 index.ensureforceparentPathcowork.vfs_children
  @  -240 vfs_entrycowork.vfs_entry
  @  -184 matchCasematchWholeWordlimitcowork.vfs_search
  @  -112 offsetcowork.vfs_path_search
  @   -56 vfs_refsdirectioncowork.vfs_refs
  @    +0 src\unity\ipc.rsX,
  @  +232 p7b@
  @  +328 No Unity client connected. Please ensure Unity Editor window is open.
  @  +496 drillCompleted
  @  +528 Failed to serialize drillCompleted message: 
  @  +616 closeCodelyEditorOnWorkspaceSwitchFailed to serialize closeCodelyEditorOnWorkspaceSwitch message: 
  @  +760 Failed to serialize setEmbedMode message: 
  @  +896 AuthServiceGetting user info from /auth/external/meauth/external/me
  @ +1000 src\auth\auth.rs@0
  @ +1040 User info API response status: 
  @ +1088 API returned error status: 
  @ +1136 Failed to send request: 
  @ +1176 Failed to read response body: 
  @ +1224 Failed to parse user info: 
  @ +1272 Exchanging Unity token with serverauth/exchange-with-unity-token
  @ +1368 Calling Unity token exchange APIunity_access_token
  @ +1448 Unity token exchange API response status: 
  @ +1512 Failed to serialize request body: 
  @ +1568 Failed to parse response: 
  @ +1616 Login with access tokenAccess token is empty
  @ +1688 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @ +1968 Failed to verify access token: 
  -- fragments --
    · Unity Insight serve (pid ) did not exit after SIGTERM/SIGKILL
    · serve
    · after
    · Unity Insight serve lock still present after recycle:
    · still
    · present
    · recycle
    · Connect timeout to
    · timeout
    · Connect failed to
    · failed
    · RPC '' timed out after ms
    · timed
    · ' saw  leftover responses (session desynced)
    · leftover
    · responses
    · session
    · desynced
    · Unexpected RPC status for
    · status
    · /error/messageUnity Insight RPC errorEmpty RPC response for
    · error
    · messageUnity
    · errorEmpty
    · response
    · Failed to write RPC
    · write
    · Failed to read RPC  response:
    · Invalid JSON RPC response for
    · summary
    · capability_tokenprotocolVersion
    · tokenprotocolVersion
    · Stale Unity Insight serve protocol  (need
    · protocol
    · running
    · project
    · encoding
    · establish
    · sessionsession
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
    · API returned error status:
    · returned
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
    · Failed to verify access token:
    · verify
```

## hit 4 @ 47325808 (host=18B)
```
  @ -2032 /api/tauri/hub/workspace-ready
  @ -1976 /api/tauri/hub/close-workspace
  @ -1920 /api/tauri/hub/open-workspace
  @ -1864 /api/tauri/hub/reorder-workspaces
  @ -1800 /api/tauri/window-bridge/local/:token/*path
  @ -1728 /api/tauri/window-bridge/remote/:token/*path
  @ -1632 /api/tauri/file-explorer
  @ -1584 /api/tauri/file-preview-media
  @ -1528 /api/tauri/file-explorer/search-stream
  @ -1464 /api/tauri/file-explorer/events
  @ -1408 /api/tauri/unity-insight/index-status
  @ -1344 /api/tauri/unity-insight/active-build
  @ -1280 /api/tauri/unity-insight/live-serves
  @ -1216 /api/tauri/unity-insight/ensure-index
  @ -1152 /api/tauri/unity-insight/get-enabled
  @ -1088 /api/tauri/unity-insight/set-enabled
  @ -1024 /api/tauri/unity-insight/get-max-turns
  @  -960 /api/tauri/unity-insight/set-max-turns
  @  -896 /api/tauri/unity-insight/vfs-children
  @  -832 /api/tauri/unity-insight/vfs-entry
  @  -768 /api/tauri/unity-insight/vfs-search
  @  -704 /api/tauri/unity-insight/vfs-path-search
  @  -640 /api/tauri/unity-insight/vfs-refs
  @  -576 /api/tauri/drop-files
  @  -528 /api/tauri/local-file-content
  @  -472 /api/tauri/download-url
  @  -424 index.html
  @  -332   (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from 
  @  -208 Failed to bind: 
  @  -176 Invalid --bind-host: 
  @  -136 #: urls=, has_username=, has_credential=, max_rate_kbps=
  @    +0 src\unity\ipc.rsp:
  @  +264 No Unity client connected. Please ensure Unity Editor window is open.Failed to serialize message: 
  @  +408 'cowork_client_installedsrc\metrics.rs[client_installed] skipped; sentinel exists at 
  @  +512 UnityMetrics
  @  +552 failed to resolve data dir
  @  +608 src\tunnel.rs
  @  +672 Tunnel stopped: 
  @  +704 Tunnel/api/v1/frp/disconnect
  @  +768 Disconnecting tunnel '
  @  +848 Tunnel '' already disconnected (404)
  @  +920 Server returned 
  @  +968 ' disconnected
  @ +1016 API status was not 'success': 
  @ +1064 HTTP request failed: 
  @ +1104 Failed to read response body: 
  @ +1152 Failed to parse response:  
  @ +1182  body: 
  @ +1224 .codelyCODELY_E2ECODELY_E2E_USER_DATA_DIRCODELY_E2E_WEBVIEW2_PORT--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --autoplay-policy=no-user-gesture-required --remote-debugging-port=
  @ +1440 CODELY_CLI_HOMEide-settings.jsoncodelyHomeDefaultfile:///local:
  @ +1520 %25%23%3F//src\utils.rs
  @ +1688 file:
  @ +1784 RIPGREP_PATH.exerg
  @ +1824 win32x64-
  @ +1872 Failed to get parent directory of executableFailed to get current executable path: 
  @ +1976 cliresourcecorebincodely-binary
  -- fragments --
    · /api/
    · tauri/hub/workspace-ready
    · tauri
    · workspace
    · ready
    · hub/workspace-ready
    · tauri/hub/close-workspace
    · close
    · hub/close-workspace
    · tauri/hub/open-workspace
    · hub/open-workspace
    · tauri/hub/reorder-workspaces
    · reorder
    · workspaces
    · hub/reorder-workspaces
    · tauri/window-bridge/local/:token/*path
    · window
    · bridge
    · local
    · token
    · window-bridge/local/:token/*path
    · tauri/window-bridge/remote/:token/*path
    · remote
    · window-bridge/remote/:token/*path
    · tauri/file-explorer
    · explorer
    · file-explorer
    · tauri/file-preview-media
    · preview
    · media
    · file-preview-media
    · tauri/file-explorer/search-stream
    · search
    · stream
    · file-explorer/search-stream
    · tauri/file-explorer/events
    · events
    · file-explorer/events
    · tauri/unity-insight/index-status
    · unity
    · insight
    · index
    · status
    · unity-insight/index-status
    · tauri/unity-insight/active-build
    · active
    · build
    · unity-insight/active-build
    · tauri/unity-insight/live-serves
    · serves
    · unity-insight/live-serves
    · tauri/unity-insight/ensure-index
    · ensure
    · unity-insight/ensure-index
    · tauri/unity-insight/get-enabled
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
    · unity-insight/vfs-search
    · tauri/unity-insight/vfs-path-search
    · unity-insight/vfs-path-search
    · tauri/unity-insight/vfs-refs
    · unity-insight/vfs-refs
    · tauri/drop-files
    · files
    · drop-files
    · tauri/local-file-content
    · content
    · local-file-content
    · tauri/download-url
    · download
    · download-url
    · index.html
    · (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from
    · invoke
    · embed
    · folder
    · Failed to bind:
    · Invalid --bind-host:
    · #: urls=, has_username=, has_credential=, max_rate_kbps=
    · has_username
    · has_credential
    · max_rate_kbps
    · src\unity\ipc.rsp:
    · unity\ipc.rsp:
    · client
    · connected
    · serialize
    · message
    · 'cowork_client_installed
    · cowork_client_installed
    · src\metrics.rs[client_installed] skipped; sentinel exists at
    · metrics
    · client_installed
    · skipped
    · sentinel
    · exists
    · metrics.rs[client_installed] skipped; sentinel exists at
    · UnityMetrics
    · nityMetrics
    · failed to resolve data dir
    · failed
    · resolve
    · src\tunnel.rs
    · tunnel
    · tunnel.rs
    · Tunnel stopped:
    · stopped
    · Tunnel
    · /api/v1/frp/disconnect
    · disconnect
    · v1/frp/disconnect
    · Disconnecting tunnel '
    · Tunnel '' already disconnected (404)
    · already
    · disconnected
    · Server returned
    · returned
    · ' disconnected
    · API status was not 'success':
    · success
    · HTTP request failed:
    · request
    · Failed to read response body:
    · response
    · Failed to parse response:
    · parse
    · body:
    · WEBVIEW2
    · disable
    · features
    · msWeb
    · msPdf
    · msSmartScreenProtection
    · autoplay
    · policy
    · gesture
```

## hit 5 @ 47521537 (host=25B)
```
  @ -2009 src\server\mobile_home.rs
  @ -1953 mobile-home-
  @ -1897 history/list returned an errorhistory/list response missing contentAllowSetForegroundWindow granted to Unity PID 
  @ -1729 FocusWindowsrc\server.rsK0
  @ -1681 IPC focusWindow not available for 
  @ -1593 sent focusWindow to Unity for 
  @ -1489 path_not_found: 01
  @ -1457  is already attached to an Editor; focusing Editor instead of switching APP window
  @ -1337 InitWorkspaceproject-switch-existing-attached-workspacealready_open
  @ -1241 already_open error but http_port is missing or invalidNotified Unity before workspace IPC path change (close Codely window if detach)Could not notify Unity before IPC path change: 
  @ -1041 windowLabelFailed to acquire lock: 
  @  -961 Failed to shutdown previous LSP manager: 
  @  -897 Failed to load LSP server configs for workspace 
  @  -817 Failed to initialize LSP manager for workspace 
  @  -617 Failed to save hub project: 
  @  -569 HubProjects
  @  -529 Unable to resolve cowork-side-projects.json pathFailed to create 
  @  -425 Failed to serialize cowork-side-projects.json: 
  @  -361 Failed to write 
  @  -265 Failed to create recent projects directory: 
  @  -201 Failed to serialize recent projects: 
  @  -145 Failed to write recent projects: 
  @   -65 Failed to migrate machine ID aliases: 
  @    -9 Workspacesrc\unity\ipc.rs
  @  +143 p7b@
  @  +279 No Unity client connected. Please ensure Unity Editor window is open.
  @  +447 drillCompleted
  @  +479 Failed to serialize drillCompleted message: 
  @  +567 closeCodelyEditorOnWorkspaceSwitchFailed to serialize closeCodelyEditorOnWorkspaceSwitch message: 
  @  +711 Failed to serialize setEmbedMode message: 
  @  +847 AuthServiceGetting user info from /auth/external/meauth/external/me
  @  +951 src\auth\auth.rs
  @  +991 User info API response status: 
  @ +1039 API returned error status: 
  @ +1087 Failed to send request: @;
  @ +1127 Failed to read response body: 
  @ +1175 Failed to parse user info: 
  @ +1223 Exchanging Unity token with serverauth/exchange-with-unity-token
  @ +1319 Calling Unity token exchange APIunity_access_token
  @ +1399 Unity token exchange API response status: 
  @ +1463 Failed to serialize request body: 
  @ +1519 Failed to parse response: 
  @ +1567 Login with access tokenAccess token is empty
  @ +1639 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @ +1919 Failed to verify access token: 
  @ +1967 Failed to notify session info change: 
  -- fragments --
    · src\server\mobile_home.rs
    · server
    · mobile_home
    · server\mobile_home.rs
    · mobile-home-
    · mobile
    · history/list returned an error
    · history
    · returned
    · error
    · list returned an error
    · history/list response missing contentAllowSetForegroundWindow granted to Unity PID
    · response
    · missing
    · contentAllowSetForegroundWindow
    · granted
    · list response missing contentAllowSetForegroundWindow granted to Unity PID
    · FocusWindow
    · ocusWindow
    · src\server.rsK0
    · server.rsK0
    · IPC focusWindow not available for
    · focusWindow
    · available
    · sent focusWindow to Unity for
    · path_not_found: 01
    · path_not_found
    · is already attached to an Editor; focusing Editor instead of switching APP window
    · already
    · attached
    · focusing
    · instead
    · switching
    · window
    · InitWorkspaceproject-switch-existing-attached-workspacealready_open
    · nitWorkspaceproject
    · switch
    · existing
    · workspacealready_open
    · already_open
    · http_port
    · invalidNotified
    · before
    · workspace
    · change
    · close
    · detach
    · notify
    · windowLabelFailed to acquire lock:
    · windowLabelFailed
    · acquire
    · Failed to shutdown previous LSP manager:
    · shutdown
    · previous
    · manager
    · Failed to load LSP server configs for workspace
    · configs
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
    · status
    · API returned error status:
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
    · session
```

## hit 6 @ 47649736 (host=16B)
```
  @ -2024 Remote unreachable: 
  @ -1984 editor/setColorssrc\unity\handler.rs
  @ -1920 editor/themeChanged
  @ -1848 add-unity-context
  @ -1800 debugUnityConsole
  @ -1752 focusContinueInputWithNewSessionsrc\unity\insight_serve_client.rs
  @ -1560 AssetsPackagesProjectSettings
  @ -1384 Connect timeout to 
  @ -1328 Connect failed to 
  @ -1184 RPC '' timed out after ms
  @ -1104 ' saw  leftover responses (session desynced)
  @ -1008 Unexpected RPC status for 
  @  -944 /error/messageUnity Insight RPC errorEmpty RPC response for 
  @  -864 Failed to write RPC 
  @  -808 Failed to read RPC  response: 
  @  -744 Invalid JSON RPC response for 
  @  -680 summary
  @  -600 capability_tokenprotocolVersion
  @  -560 Stale Unity Insight serve protocol  (need 
  @  -464 Unity Insight serve is not running. Start a Codely CLI session for this project.Invalid project path encoding
  @  -280 __cowork_vfs_superseded__Failed to establish Unity Insight serve sessionsession present after contains_key
  @  -144 Workspace is not a directory: 
  @   -96 requireQueryableVfs
  @   -48 cowork.vfs_children
  @    +0 src\unity\ipc.rs
  @  +136 p7b@
  @  +256 Pipe created: 
  @  +288 UnityIpcServerIPC path updated, restarting pipe server on new pathGetNamedPipeClientProcessId failedUnity PID: 
  @  +416 Unity connected!
  @  +528 Failed to create pipe . Retrying...
  @  +736 Unity disconnected
  @  +832 Read error, connection closed
  @  +912 No Unity client connected. Please ensure Unity Editor window is open.
  @ +1056 Failed to serialize setEmbedMode message: 
  @ +1192 AuthServiceGetting user info from /auth/external/meauth/external/me
  @ +1296 src\auth\auth.rs
  @ +1336 User info API response status: 
  @ +1384 API returned error status: 
  @ +1432 Failed to send request: `1
  @ +1472 Failed to read response body: 
  @ +1520 Failed to parse user info: 
  @ +1568 Exchanging Unity token with serverauth/exchange-with-unity-token
  @ +1664 Calling Unity token exchange APIunity_access_token
  @ +1744 Unity token exchange API response status: 
  @ +1808 Failed to serialize request body: 
  @ +1864 Failed to parse response: 
  @ +1912 Login with access tokenAccess token is empty
  -- fragments --
    · Remote unreachable:
    · unreachable
    · editor/setColors
    · editor
    · setColors
    · src\unity\handler.rs
    · unity
    · handler
    · unity\handler.rs
    · editor/themeChanged
    · themeChanged
    · add-unity-context
    · context
    · debugUnityConsole
    · focusContinueInputWithNewSession
    · src\unity\insight_serve_client.rs
    · insight_serve_client
    · unity\insight_serve_client.rs
    · AssetsPackagesProjectSettings
    · ssetsPackagesProjectSettings
    · Connect timeout to
    · timeout
    · Connect failed to
    · failed
    · RPC '' timed out after ms
    · timed
    · after
    · ' saw  leftover responses (session desynced)
    · leftover
    · responses
    · session
    · desynced
    · Unexpected RPC status for
    · status
    · /error/messageUnity Insight RPC errorEmpty RPC response for
    · error
    · messageUnity
    · errorEmpty
    · response
    · Failed to write RPC
    · write
    · Failed to read RPC  response:
    · Invalid JSON RPC response for
    · summary
    · capability_tokenprotocolVersion
    · tokenprotocolVersion
    · Stale Unity Insight serve protocol  (need
    · serve
    · protocol
    · running
    · project
    · encoding
    · establish
    · sessionsession
    · present
    · contains_key
    · Workspace is not a directory:
    · directory
    · requireQueryableVfs
    · cowork.vfs_children
    · cowork
    · vfs_children
    · src\unity\ipc.rs
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
```

## hit 7 @ 47728840 (host=16B)
```
  @ -2016 /api/tauri/mobile/v1/machine/workspaces/:workspace_key/sessions
  @ -1928 /api/tauri/hub/workspace-ready
  @ -1872 /api/tauri/hub/close-workspace
  @ -1816 /api/tauri/hub/open-workspace
  @ -1760 /api/tauri/hub/reorder-workspaces
  @ -1696 /api/tauri/window-bridge/local/:token/*path
  @ -1624 /api/tauri/window-bridge/remote/:token/*path
  @ -1528 /api/tauri/file-explorerXG
  @ -1480 /api/tauri/file-preview-media
  @ -1424 /api/tauri/file-explorer/search-stream
  @ -1360 /api/tauri/file-explorer/events
  @ -1304 /api/tauri/unity-insight/index-status
  @ -1240 /api/tauri/unity-insight/active-build
  @ -1176 /api/tauri/unity-insight/live-serves
  @ -1112 /api/tauri/unity-insight/ensure-index
  @ -1048 /api/tauri/unity-insight/get-enabled
  @  -984 /api/tauri/unity-insight/set-enabled
  @  -920 /api/tauri/unity-insight/get-max-turns
  @  -856 /api/tauri/unity-insight/set-max-turns
  @  -792 /api/tauri/unity-insight/vfs-children
  @  -728 /api/tauri/unity-insight/vfs-entry
  @  -664 /api/tauri/unity-insight/vfs-search
  @  -600 /api/tauri/unity-insight/vfs-path-searchXG
  @  -536 /api/tauri/unity-insight/vfs-refs
  @  -472 /api/tauri/drop-files
  @  -424 /api/tauri/local-file-content
  @  -368 /api/tauri/download-url
  @  -320 index.html
  @  -228   (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from 
  @  -104 Failed to bind: ``
  @   -72 Invalid --bind-host: 
  @    +0 src\unity\ipc.rs
  @  +232 p7b@
  @  +328 No Unity client connected. Please ensure Unity Editor window is open.
  @  +496 drillCompleted
  @  +528 Failed to serialize drillCompleted message: 
  @  +616 closeCodelyEditorOnWorkspaceSwitchFailed to serialize closeCodelyEditorOnWorkspaceSwitch message: 
  @  +760 Failed to serialize setEmbedMode message: 
  @  +896 AuthServiceGetting user info from /auth/external/meauth/external/me
  @ +1000 src\auth\auth.rs
  @ +1040 User info API response status: 
  @ +1088 API returned error status: 
  @ +1136 Failed to send request: 8e
  @ +1176 Failed to read response body: 
  @ +1224 Failed to parse user info: 
  @ +1272 Exchanging Unity token with serverauth/exchange-with-unity-token
  @ +1368 Calling Unity token exchange APIunity_access_token
  @ +1448 Unity token exchange API response status: 
  @ +1512 Failed to serialize request body: 
  @ +1568 Failed to parse response: 
  @ +1616 Login with access tokenAccess token is empty
  @ +1688 ContinueAccessTokenContinueRefreshTokenContinueAccountIdContinueAccountLabelError getting user info: , login failed
  @ +1968 Failed to verify access token: 
  -- fragments --
    · /api/
    · tauri/mobile/v1/machine/workspaces/:workspace_key/sessions
    · tauri
    · mobile
    · machine
    · workspaces
    · workspace_key
    · sessions
    · mobile/v1/machine/workspaces/:workspace_key/sessions
    · tauri/hub/workspace-ready
    · workspace
    · ready
    · hub/workspace-ready
    · tauri/hub/close-workspace
    · close
    · hub/close-workspace
    · tauri/hub/open-workspace
    · hub/open-workspace
    · tauri/hub/reorder-workspaces
    · reorder
    · hub/reorder-workspaces
    · tauri/window-bridge/local/:token/*path
    · window
    · bridge
    · local
    · token
    · window-bridge/local/:token/*path
    · tauri/window-bridge/remote/:token/*path
    · remote
    · window-bridge/remote/:token/*path
    · tauri/file-explorerXG
    · file-explorerXG
    · tauri/file-preview-media
    · preview
    · media
    · file-preview-media
    · tauri/file-explorer/search-stream
    · explorer
    · search
    · stream
    · file-explorer/search-stream
    · tauri/file-explorer/events
    · events
    · file-explorer/events
    · tauri/unity-insight/index-status
    · unity
    · insight
    · index
    · status
    · unity-insight/index-status
    · tauri/unity-insight/active-build
    · active
    · build
    · unity-insight/active-build
    · tauri/unity-insight/live-serves
    · serves
    · unity-insight/live-serves
    · tauri/unity-insight/ensure-index
    · ensure
    · unity-insight/ensure-index
    · tauri/unity-insight/get-enabled
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
    · unity-insight/vfs-search
    · tauri/unity-insight/vfs-path-searchXG
    · unity-insight/vfs-path-searchXG
    · tauri/unity-insight/vfs-refs
    · unity-insight/vfs-refs
    · tauri/drop-files
    · files
    · drop-files
    · tauri/local-file-content
    · content
    · local-file-content
    · tauri/download-url
    · download
    · download-url
    · index.html
    · (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from
    · invoke
    · embed
    · folder
    · Failed to bind: ``
    · Invalid --bind-host:
    · src\unity\ipc.rs
    · unity\ipc.rs
    · No Unity client connected. Please ensure Unity Editor window is open.
    · client
    · connected
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
    · API returned error status:
    · returned
    · error
    · Failed to send request: 8e
    · request
    · Failed to read response body:
    · Failed to parse user info:
    · parse
    · Exchanging Unity token with serverauth/exchange-with-unity-token
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
```
