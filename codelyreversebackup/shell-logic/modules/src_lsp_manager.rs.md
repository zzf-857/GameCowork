# src\lsp\manager.rs

occurrences=5

## hit 1 @ 47212528 (host=18B)
```
  @ -2032 failed to serialize hub message: 
  @ -1976 hub client  is not started
  @ -1912 failed to write to hub 
  @ -1856 src\lsp\client.rs
  @ -1808 LSP server  is already running
  @ -1744 resolved command: 
  @ -1688 LSP<none>Spawning Rust LSP server  with command= args= cwd=
  @ -1512 Rust LSP server  spawned successfully
  @ -1440 failed to start LSP server  with command 
  @ -1344  did not expose stdin
  @ -1288  did not expose stdout
  @ -1232  did not expose stderr
  @ -1072 LSP request  timed out after s on 
  @  -912 LSP client stopped
  @  -864 failed to serialize  LSP message: 
  @  -760 failed to write to LSP server 
  @  -696 src\lsp\config.rs
  @  -624 failed to read extension directory 
  @  -552 gemini-extension.jsonfailed to read extension entry in 
  @  -464 failed to inspect extension entry 
  @  -368 failed to read extension manifest 
  @  -296 failed to parse extension manifest 
  @  -224 src\lsp\hint.rs
  @  -184 resolve_file_preview_lsp_status: path= language= extension_installed= server_installed= supported=
  @    +0 src\lsp\manager.rs
  @  +120 Starting Rust LSP server  for 
  @  +184 No configured Rust LSP server found for 
  @  +264  startup timed out after 120s
  @  +352 Sending  to Rust LSP server 
  @  +480 workspace/symbol
  @  +520 Opening  in Rust LSP server  as 
  @  +624 textDocument/didOpenSkipping didOpen for  (already open in 
  @  +736 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @  +848 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @  +976 LSP server '' exceeded max crash recovery attempts (
  @ +1080  is stopping
  @ +1128 Initializing Rust LSP server 
  @ +1176  failed during spawn: 
  @ +1232 codely-desktopinitialize startup was interrupted
  @ +1312 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @ +1440 initialized failed to initialize: 
  @ +1512  failed during initialized notification: 
  @ +1592  is ready
  @ +1808 $/progresswindow/logMessage
  @ +1888 Content-Length: 
  @ +1944 src\lsp\transport.rs
  @ +1992 failed to write LSP header: 
  -- fragments --
    · failed to serialize hub message:
    · failed
    · serialize
    · message
    · hub client  is not started
    · client
    · started
    · failed to write to hub
    · write
    · src\lsp\client.rs
    · lsp\client.rs
    · LSP server  is already running
    · server
    · already
    · running
    · resolved command:
    · resolved
    · command
    · LSP<none>Spawning Rust LSP server  with command= args= cwd=
    · Rust LSP server  spawned successfully
    · spawned
    · successfully
    · failed to start LSP server  with command
    · start
    · did not expose stdin
    · expose
    · stdin
    · did not expose stdout
    · stdout
    · did not expose stderr
    · stderr
    · LSP request  timed out after s on
    · request
    · timed
    · after
    · LSP client stopped
    · stopped
    · failed to serialize  LSP message:
    · failed to write to LSP server
    · src\lsp\config.rs
    · config
    · lsp\config.rs
    · failed to read extension directory
    · extension
    · directory
    · gemini-extension.jsonfailed to read extension entry in
    · gemini
    · jsonfailed
    · entry
    · failed to inspect extension entry
    · inspect
    · failed to read extension manifest
    · manifest
    · failed to parse extension manifest
    · parse
    · src\lsp\hint.rs
    · lsp\hint.rs
    · resolve_file_preview_lsp_status
    · language
    · extension_installed
    · server_installed
    · supported
    · src\lsp\manager.rs
    · manager
    · lsp\manager.rs
    · Starting Rust LSP server  for
    · No configured Rust LSP server found for
    · configured
    · found
    · startup timed out after 120s
    · startup
    · Sending  to Rust LSP server
    · workspace/symbol
    · workspace
    · symbol
    · Opening  in Rust LSP server  as
    · textDocument/didOpenSkipping didOpen for  (already open in
    · textDocument
    · didOpenSkipping
    · didOpen
    · Skip LSP manager reload after extension mutation: app state unavailable
    · reload
    · mutation
    · state
    · unavailable
    · src\lsp\reload.rs
    · lsp\reload.rs
    · Skip LSP manager reload after extension mutation: workspace unavailable
    · src\lsp\server_instance.rs
    · server_instance
    · lsp\server_instance.rs
    · LSP server '' exceeded max crash recovery attempts (
    · exceeded
    · crash
    · recovery
    · attempts
    · is stopping
    · stopping
    · Initializing Rust LSP server
    · failed during spawn:
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · interrupted
    · /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
    · capabilities
    · definitionProvider
    · responded
    · initialize
    · initialized failed to initialize:
    · initialized
    · failed during initialized notification:
    · notification
    · is ready
    · ready
    · $/progresswindow/logMessage
    · progresswindow
    · logMessage
    · Content-Length:
    · src\lsp\transport.rs
    · transport
    · lsp\transport.rs
    · failed to write LSP header:
    · header
```

## hit 2 @ 47421920 (host=18B)
```
  @ -2024 127.0.0.1%USERPROFILE%\.codely\DefaultFailed to create default workspace at 
  @ -1912 .codelyDefaultsrc\app\file_watcher.rsFailed to resolve workspace root: 
  @ -1824 Failed to create file watcher: 
  @ -1776 Failed to watch workspace: 
  @ -1728 File watch error: 
  @ -1688 FileWatcher
  @ -1600 RestartRestart requested; relaunching appcowork-settings.jsoncodely-appsettings.jsonMigrated legacy settings from  to 
  @ -1448 src\app\settings.rs
  @ -1400 cowork::app::settingsjson.lockjson.tmpFailed to create settings directory: 
  @ -1304 Failed to serialize settings: 
  @ -1256 Failed to open lock file: 
  @ -1208 Failed to acquire file lock: 
  @ -1160 Failed to write temp settings file: 
  @ -1104 Failed to rename settings file: 
  @  -984 src\app\window_manager.rs
  @  -840 WindowManagerApp state not initialized for open_workspaceApp handle not available for open_workspaceCreateJobObjectW failed: 
  @  -696 SetInformationJobObject failed: (
  @  -648 OpenProcess() failed: 
  @  -592 AssignProcessToJobObject failed: 
  @  -536 EADDRINUSEEACCESpermission deniedENOENTCannot find moduleCoreProcess
  @  -462  Missing Node.js module!   Solution: Reinstall dependencies.
  @  -396  File or directory not found!   Solution: Verify that all required files are present.
  @  -305  Permission denied!   Solution: Check file permissions.
  @  -244  Port already in use! Another instance may be running.   Solution: Stop other instances or use a different port.CODELY_CLI_HOME.codely-clirelativePathnoneextension check: file= server= installed=
  @    +0 src\lsp\manager.rs
  @   +48 server check: file= binary=
  @  +128  binary=none installed=false
  @  +192 invalid binary name: 
  @  +232 isServerInstalled  
  @  +254  found= path=
  @  +320 LSPmissing LSP config for server 
  @  +376 failed to convert  to file URI
  @  +440 where.exeAPPDATAnpmLOCALAPPDATAProgramsnodejsProgramFilesProgramFiles(x86)USERPROFILE.dotnettools.cargobin.omnisharpMicrosoftWinGetPackagesexecmdbatps1
  @  +656 HOMEsrc\lsp\path.rs
  @  +704 src\lsp\server_instance.rsserver state lock poisoned
  @  +784 server error lock poisoned
  @  +864 LSP server  is not started
  @  +928  is starting
  @  +976  is stopping
  @ +1024  is not running
  @ +1120 server ""
  @ +1168 extension "
  @ +1216 Upstream / source (from extension manifest): 
  @ +1280 Install the language server for this stack and ensure its executable is on your PATH.[LSP] Cannot start : command not found: "" (ENOENT). . Cause: 
  @ +1496 enoentos error 2no such file or directorycannot find the file
  @ +1584 workspaceFoldersinitializationOptionsdynamicRegistrationworkspace folder should convert to file URI
  @ +1712 src\messages\tunnel.rs
  @ +1760 src\pet\queue.rs
  @ +1848 idaccess_token=agentsunity-insight.tomlUnable to resolve ~/.codely-cli/agentsworkspaceDir is required for workspace-scoped agent toml
  -- fragments --
    · 127.0.0.1%USERPROFILE%\.codely\DefaultFailed to create default workspace at
    · codely
    · efaultFailed
    · create
    · default
    · workspace
    · .codelyDefault
    · codelyDefault
    · src\app\file_watcher.rsFailed to resolve workspace root:
    · file_watcher
    · rsFailed
    · resolve
    · app\file_watcher.rsFailed to resolve workspace root:
    · Failed to create file watcher:
    · watcher
    · Failed to watch workspace:
    · watch
    · File watch error:
    · error
    · FileWatcher
    · ileWatcher
    · estartRestart
    · requested
    · relaunching
    · appcowork
    · settings
    · jsoncodely
    · appsettings
    · jsonMigrated
    · legacy
    · src\app\settings.rs
    · app\settings.rs
    · cowork::app::settingsjson.lockjson.tmpFailed to create settings directory:
    · cowork
    · settingsjson
    · lockjson
    · tmpFailed
    · directory
    · Failed to serialize settings:
    · serialize
    · Failed to open lock file:
    · Failed to acquire file lock:
    · acquire
    · Failed to write temp settings file:
    · write
    · Failed to rename settings file:
    · rename
    · src\app\window_manager.rs
    · window_manager
    · app\window_manager.rs
    · indowManagerApp
    · state
    · initialized
    · workspaceApp
    · handle
    · available
    · workspaceCreateJobObject
    · failed
    · SetInformationJobObject failed: (
    · etInformationJobObject
    · OpenProcess() failed:
    · penProcess
    · AssignProcessToJobObject failed:
    · ssignProcessToJobObject
    · EADDRINUSEEACCESpermission deniedENOENTCannot find moduleCoreProcess
    · EADDRINUSEEACCESpermission
    · ENOENTCannot
    · moduleCoreProcess
    · Missing Node.js module!   Solution: Reinstall dependencies.
    · module
    · dependencies
    · File or directory not found!   Solution: Verify that all required files are present.
    · found
    · required
    · files
    · present
    · Permission denied!   Solution: Check file permissions.
    · denied
    · permissions
    · already
    · instance
    · running
    · other
    · instances
    · different
    · clirelativePathnoneextension
    · check
    · server
    · installed
    · src\lsp\manager.rs
    · manager
    · lsp\manager.rs
    · server check: file= binary=
    · binary
    · binary=none installed=false
    · false
    · invalid binary name:
    · invalid
    · isServerInstalled
    · found= path=
    · LSPmissing LSP config for server
    · LSPmissing
    · config
    · failed to convert  to file URI
    · convert
    · where
    · APPDATAnpmLOCALAPPDATAProgramsnodejsProgramFilesProgramFiles
    · dotnettools
    · cargobin
    · omnisharpMicrosoftWinGetPackagesexecmdbatps1
    · src\lsp\path.rs
    · lsp\path.rs
    · src\lsp\server_instance.rsserver state lock poisoned
    · server_instance
    · rsserver
    · poisoned
    · lsp\server_instance.rsserver state lock poisoned
    · server error lock poisoned
    · LSP server  is not started
    · started
    · is starting
    · starting
    · is stopping
    · stopping
    · is not running
    · server ""
    · extension "
    · extension
    · Upstream / source (from extension manifest):
    · source
    · manifest
    · language
    · stack
    · ensure
    · executable
    · start
    · command
    · enoentos error 2no such file or directorycannot find the file
    · enoentos
    · directorycannot
    · workspaceFoldersinitializationOptionsdynamicRegistrationworkspace
    · folder
    · should
    · src\messages\tunnel.rs
    · messages
    · tunnel
    · messages\tunnel.rs
    · src\pet\queue.rs
    · queue
    · pet\queue.rs
```

## hit 3 @ 47508584 (host=18B)
```
  @ -2008 failed to serialize SetCoworkTokenParams: 
  @ -1944 failed to deserialize auth.setCoworkToken response: 
  @ -1848 failed to serialize hub message: 
  @ -1792 hub client  is not started
  @ -1728 failed to write to hub 
  @ -1672 src\lsp\client.rs
  @ -1624 LSP server  is already running
  @ -1560 resolved command:  -> 
  @ -1504 LSP<none>Spawning Rust LSP server  with command= args= cwd=
  @ -1328 Rust LSP server  spawned successfully
  @ -1256 failed to start LSP server  with command 
  @ -1160  did not expose stdin
  @ -1104  did not expose stdout
  @ -1048  did not expose stderr
  @  -888 LSP request  timed out after s on 
  @  -752 shutdown
  @  -720 exit
  @  -688 LSP client stopped
  @  -640 failed to serialize  LSP message: 
  @  -536 failed to write to LSP server 
  @  -472 src\lsp\config.rs
  @  -400 failed to read extension directory 
  @  -328 gemini-extension.jsonfailed to read extension entry in 
  @  -240 failed to inspect extension entry 
  @  -144 failed to read extension manifest 
  @   -72 failed to parse extension manifest 
  @    +0 src\lsp\manager.rs
  @  +120 Starting Rust LSP server  for 
  @  +184 No configured Rust LSP server found for  
  @  +288  failed to start
  @  +336  state channel closed
  @  +392  startup timed out after 120s
  @  +480 Sending  to Rust LSP server 
  @  +608 workspace/symbolh
  @  +648 Opening  in Rust LSP server  as 
  @  +752 textDocument/didOpenSkipping didOpen for  (already open in 
  @  +864 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @  +976 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @ +1104 LSP server '' exceeded max crash recovery attempts (
  @ +1208  is stopping
  @ +1256 Initializing Rust LSP server 
  @ +1304  failed during spawn: 
  @ +1360 codely-desktopinitialize startup was interrupted
  @ +1440 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @ +1568 initialized failed to initialize: 
  @ +1640  failed during initialized notification: 
  @ +1720  is ready
  @ +1936 $/progresswindow/logMessage
  @ +2016 Content-Length: 
  -- fragments --
    · failed to serialize SetCoworkTokenParams:
    · failed
    · serialize
    · etCoworkTokenParams
    · failed to deserialize auth.setCoworkToken response:
    · deserialize
    · setCoworkToken
    · response
    · failed to serialize hub message:
    · message
    · hub client  is not started
    · client
    · started
    · failed to write to hub
    · write
    · src\lsp\client.rs
    · lsp\client.rs
    · LSP server  is already running
    · server
    · already
    · running
    · resolved command:  ->
    · resolved
    · command
    · LSP<none>Spawning Rust LSP server  with command= args= cwd=
    · Rust LSP server  spawned successfully
    · spawned
    · successfully
    · failed to start LSP server  with command
    · start
    · did not expose stdin
    · expose
    · stdin
    · did not expose stdout
    · stdout
    · did not expose stderr
    · stderr
    · LSP request  timed out after s on
    · request
    · timed
    · after
    · shutdown
    · LSP client stopped
    · stopped
    · failed to serialize  LSP message:
    · failed to write to LSP server
    · src\lsp\config.rs
    · config
    · lsp\config.rs
    · failed to read extension directory
    · extension
    · directory
    · gemini-extension.jsonfailed to read extension entry in
    · gemini
    · jsonfailed
    · entry
    · failed to inspect extension entry
    · inspect
    · failed to read extension manifest
    · manifest
    · failed to parse extension manifest
    · parse
    · src\lsp\manager.rs
    · manager
    · lsp\manager.rs
    · Starting Rust LSP server  for
    · No configured Rust LSP server found for
    · configured
    · found
    · failed to start
    · state channel closed
    · state
    · channel
    · closed
    · startup timed out after 120s
    · startup
    · Sending  to Rust LSP server
    · workspace/symbolh
    · workspace
    · symbolh
    · Opening  in Rust LSP server  as
    · textDocument/didOpenSkipping didOpen for  (already open in
    · textDocument
    · didOpenSkipping
    · didOpen
    · Skip LSP manager reload after extension mutation: app state unavailable
    · reload
    · mutation
    · unavailable
    · src\lsp\reload.rs
    · lsp\reload.rs
    · Skip LSP manager reload after extension mutation: workspace unavailable
    · src\lsp\server_instance.rs
    · server_instance
    · lsp\server_instance.rs
    · LSP server '' exceeded max crash recovery attempts (
    · exceeded
    · crash
    · recovery
    · attempts
    · is stopping
    · stopping
    · Initializing Rust LSP server
    · failed during spawn:
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · interrupted
    · /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
    · capabilities
    · definitionProvider
    · responded
    · initialize
    · initialized failed to initialize:
    · initialized
    · failed during initialized notification:
    · notification
    · is ready
    · ready
    · $/progresswindow/logMessage
    · progresswindow
    · logMessage
    · Content-Length:
```

## hit 4 @ 47635872 (host=18B)
```
  @ -2008 hub client stopped
  @ -1960 failed to serialize hub message: 
  @ -1904 hub client  is not started
  @ -1840 failed to write to hub 
  @ -1760 hub process  closed pipe
  @ -1704 invalid message from 
  @ -1648 failed reading from hub 0
  @ -1592 src\lsp\client.rs
  @ -1544 LSP server 
  @ -1496 resolved command: 
  @ -1440 LSP<none>Spawning Rust LSP server  with command= args= cwd=
  @ -1264 Rust LSP server  spawned successfully
  @ -1192 failed to start LSP server  with command 
  @ -1064  did not expose stdout
  @ -1008  did not expose stderr
  @  -800 LSP request  timed out after s on 
  @  -640 LSP client stopped
  @  -592 failed to serialize  LSP message: 
  @  -488 failed to write to LSP server 
  @  -376 received invalid message from 
  @  -287  closed stdout
  @  -192 failed reading from LSP server 
  @   -48 [][stderr] 
  @    +0 src\lsp\manager.rs
  @   +48 Starting Rust LSP server  for 
  @  +112 No configured Rust LSP server found for 
  @  +192  startup timed out after 120s
  @  +280 Opening  in Rust LSP server  as 
  @  +360 textDocument/didOpenSkipping didOpen for  (already open in 
  @  +472 src\lsp\server_instance.rs
  @  +528 LSP server '' exceeded max crash recovery attempts (
  @  +632  is stopping
  @  +680 Initializing Rust LSP server 
  @  +728  failed during spawn: 
  @  +784 codely-desktopinitialize startup was interrupted
  @  +864 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @  +992 initialized failed to initialize: 
  @ +1064  failed during initialized notification: 
  @ +1144  is ready
  @ +1288 server state lock poisoned
  @ +1344 server error lock poisoned
  @ +1448 $/progresswindow/logMessage
  @ +1552 ] notification 
  @ +1616 src\lsp\transport.rs
  @ +1664 unexpected EOF before LSP header terminatorduplicate Content-Length header
  @ +1768 failed to read LSP header line: 
  @ +1816 invalid Content-Length header: 
  @ +1864 missing Content-Length headerfailed to read LSP message body: 
  @ +1944 LSP message body was not valid UTF-8: 
  @ +2000 Content-Length: 
  -- fragments --
    · hub client stopped
    · client
    · stopped
    · failed to serialize hub message:
    · failed
    · serialize
    · message
    · hub client  is not started
    · started
    · failed to write to hub
    · write
    · hub process  closed pipe
    · process
    · closed
    · invalid message from
    · invalid
    · failed reading from hub 0
    · reading
    · src\lsp\client.rs
    · lsp\client.rs
    · LSP server
    · server
    · resolved command:
    · resolved
    · command
    · LSP<none>Spawning Rust LSP server  with command= args= cwd=
    · Rust LSP server  spawned successfully
    · spawned
    · successfully
    · failed to start LSP server  with command
    · start
    · did not expose stdout
    · expose
    · stdout
    · did not expose stderr
    · stderr
    · LSP request  timed out after s on
    · request
    · timed
    · after
    · LSP client stopped
    · failed to serialize  LSP message:
    · failed to write to LSP server
    · received invalid message from
    · received
    · closed stdout
    · failed reading from LSP server
    · [][stderr]
    · src\lsp\manager.rs
    · manager
    · lsp\manager.rs
    · Starting Rust LSP server  for
    · No configured Rust LSP server found for
    · configured
    · found
    · startup timed out after 120s
    · startup
    · Opening  in Rust LSP server  as
    · textDocument/didOpenSkipping didOpen for  (already open in
    · textDocument
    · didOpenSkipping
    · didOpen
    · already
    · src\lsp\server_instance.rs
    · server_instance
    · lsp\server_instance.rs
    · LSP server '' exceeded max crash recovery attempts (
    · exceeded
    · crash
    · recovery
    · attempts
    · is stopping
    · stopping
    · Initializing Rust LSP server
    · failed during spawn:
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · interrupted
    · /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
    · capabilities
    · definitionProvider
    · responded
    · initialize
    · initialized failed to initialize:
    · initialized
    · failed during initialized notification:
    · notification
    · is ready
    · ready
    · server state lock poisoned
    · state
    · poisoned
    · server error lock poisoned
    · error
    · $/progresswindow/logMessage
    · progresswindow
    · logMessage
    · ] notification
    · src\lsp\transport.rs
    · transport
    · lsp\transport.rs
    · unexpected EOF before LSP header terminatorduplicate Content-Length header
    · unexpected
    · before
    · header
    · terminatorduplicate
    · failed to read LSP header line:
    · invalid Content-Length header:
    · missing Content-Length headerfailed to read LSP message body:
    · missing
    · headerfailed
    · LSP message body was not valid UTF-8:
    · valid
    · Content-Length:
```

## hit 5 @ 47711192 (host=18B)
```
  @ -2016 failed to serialize SetCoworkTokenParams: 
  @ -1952 failed to deserialize auth.setCoworkToken response: 
  @ -1856 hub client stopped
  @ -1808 failed to serialize hub message: 
  @ -1752 hub client  is not started
  @ -1688 failed to write to hub 
  @ -1632 src\lsp\client.rs
  @ -1584 LSP server 
  @ -1536 resolved command: 
  @ -1480 LSP<none>Spawning Rust LSP server  with command= args= cwd=
  @ -1304 Rust LSP server  spawned successfully
  @ -1232 failed to start LSP server  with command 
  @ -1104  did not expose stdout
  @ -1048  did not expose stderr
  @  -888 LSP request  timed out after s on 
  @  -728 LSP client stopped
  @  -680 failed to serialize  LSP message: 
  @  -576 failed to write to LSP server 
  @  -472 src\lsp\config.rs
  @  -400 failed to read extension directory 
  @  -328 gemini-extension.jsonfailed to read extension entry in 
  @  -240 failed to inspect extension entry 
  @  -144 failed to read extension manifest 
  @   -72 failed to parse extension manifest 
  @    +0 src\lsp\manager.rs
  @  +120 Starting Rust LSP server  for 
  @  +184 No configured Rust LSP server found for 
  @  +264  startup timed out after 120s
  @  +352 Sending  to Rust LSP server 
  @  +480 workspace/symbol
  @  +520 Opening  in Rust LSP server  as 
  @  +600 textDocument/didOpenSkipping didOpen for  (already open in 
  @  +712 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @  +824 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @  +952 LSP server '' exceeded max crash recovery attempts (
  @ +1056  is stopping
  @ +1104 Initializing Rust LSP server 
  @ +1152  failed during spawn: 
  @ +1208 codely-desktopinitialize startup was interrupted
  @ +1288 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @ +1416 initialized failed to initialize: 
  @ +1488  failed during initialized notification: 
  @ +1568  is ready
  @ +1784 $/progresswindow/logMessage
  @ +1864 src\lsp\transport.rsContent-Length: 
  @ +1960 failed to write LSP header: 
  @ +2008 failed to write LSP body: 
  -- fragments --
    · failed to serialize SetCoworkTokenParams:
    · failed
    · serialize
    · etCoworkTokenParams
    · failed to deserialize auth.setCoworkToken response:
    · deserialize
    · setCoworkToken
    · response
    · hub client stopped
    · client
    · stopped
    · failed to serialize hub message:
    · message
    · hub client  is not started
    · started
    · failed to write to hub
    · write
    · src\lsp\client.rs
    · lsp\client.rs
    · LSP server
    · server
    · resolved command:
    · resolved
    · command
    · LSP<none>Spawning Rust LSP server  with command= args= cwd=
    · Rust LSP server  spawned successfully
    · spawned
    · successfully
    · failed to start LSP server  with command
    · start
    · did not expose stdout
    · expose
    · stdout
    · did not expose stderr
    · stderr
    · LSP request  timed out after s on
    · request
    · timed
    · after
    · LSP client stopped
    · failed to serialize  LSP message:
    · failed to write to LSP server
    · src\lsp\config.rs
    · config
    · lsp\config.rs
    · failed to read extension directory
    · extension
    · directory
    · gemini-extension.jsonfailed to read extension entry in
    · gemini
    · jsonfailed
    · entry
    · failed to inspect extension entry
    · inspect
    · failed to read extension manifest
    · manifest
    · failed to parse extension manifest
    · parse
    · src\lsp\manager.rs
    · manager
    · lsp\manager.rs
    · Starting Rust LSP server  for
    · No configured Rust LSP server found for
    · configured
    · found
    · startup timed out after 120s
    · startup
    · Sending  to Rust LSP server
    · workspace/symbol
    · workspace
    · symbol
    · Opening  in Rust LSP server  as
    · textDocument/didOpenSkipping didOpen for  (already open in
    · textDocument
    · didOpenSkipping
    · didOpen
    · already
    · Skip LSP manager reload after extension mutation: app state unavailable
    · reload
    · mutation
    · state
    · unavailable
    · src\lsp\reload.rs
    · lsp\reload.rs
    · Skip LSP manager reload after extension mutation: workspace unavailable
    · src\lsp\server_instance.rs
    · server_instance
    · lsp\server_instance.rs
    · LSP server '' exceeded max crash recovery attempts (
    · exceeded
    · crash
    · recovery
    · attempts
    · is stopping
    · stopping
    · Initializing Rust LSP server
    · failed during spawn:
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · interrupted
    · /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
    · capabilities
    · definitionProvider
    · responded
    · initialize
    · initialized failed to initialize:
    · initialized
    · failed during initialized notification:
    · notification
    · is ready
    · ready
    · $/progresswindow/logMessage
    · progresswindow
    · logMessage
    · src\lsp\transport.rsContent-Length:
    · transport
    · rsContent
    · lsp\transport.rsContent-Length:
    · failed to write LSP header:
    · header
    · failed to write LSP body:
```
