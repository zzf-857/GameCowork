# src\messages\editor.rs

occurrences=3

## hit 1 @ 47214920 (host=22B)
```
  @ -2040 Sending  to Rust LSP server 
  @ -1912 workspace/symbol
  @ -1872 Opening  in Rust LSP server  as 
  @ -1768 textDocument/didOpenSkipping didOpen for  (already open in 
  @ -1656 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @ -1544 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @ -1416 LSP server '' exceeded max crash recovery attempts (
  @ -1312  is stopping
  @ -1264 Initializing Rust LSP server 
  @ -1216  failed during spawn: 
  @ -1160 codely-desktopinitialize startup was interrupted
  @ -1080 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @  -952 initialized failed to initialize: 
  @  -880  failed during initialized notification: 
  @  -800  is ready
  @  -584 $/progresswindow/logMessage
  @  -504 Content-Length: 
  @  -448 src\lsp\transport.rs
  @  -400 failed to write LSP header: 
  @  -352 failed to write LSP body: 
  @  -304 failed to flush LSP message: 
  @  -256 drill/drillCompleted failed: 
  @  -208 Codelysrc\messages\drill.rs
  @  -152 drill/drillCompleted
  @   -88 Failed to send drillCompleted IPC to Unity: 
  @    +0 src\messages\editor.rs
  @   +48 editor/getEmbedModeembed_mode
  @  +104 editor/setEmbedMode: hid  Tauri window(s) for workspace 
  @  +192 editor/setEmbedMode: creating Tauri window for detach, workspace=
  @  +280 editor/setEmbedMode: creating Tauri window for detach without window state, workspace=
  @  +384 Window creation returned None for detachCreated Tauri window for detachFailed to create window for detach: 
  @  +512 <editor-webview>Updated window embed_mode= (target window=
  @  +624 Sent set_embed_mode notification to UnityFailed to send set_embed_mode to Unity: 
  @  +728 cowork_embed_mode_changededitor/setEmbedModedarkH
  @  +824 editor/recompile
  @  +856 editor/recompile failed: 
  @  +928 editor/selectAsset: forwarding to Unity (filepath=
  @ +1016 editor/selectAsset called with empty filepath
  @ +1088 Empty filepath
  @ +1144 editor/selectAsset: sent to Unity OK
  @ +1208 editor/selectAsset failed: 
  @ +1304 editor/selectAssetsrc\messages\pet.rs
  @ +1368 pet/getActiveSessiontitleattachmentsAttachments are not supported on remote workspaces
  @ +1480 pet/submitPrompt
  @ +1512 Stale session: the active session changed
  @ +1584 No active session available
  @ +1640 submitPrompt: core send failed: 
  @ +1688 PetApp state not available
  @ +1744 completionOptionspet-submit-
  @ +1793 @attachment``````
  @ +1848 Workspace not found
  @ +1920 Remote workspace is offline or unreachableRemote submit faileddescriptionlocale
  -- fragments --
    · Sending  to Rust LSP server
    · server
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
    · manager
    · reload
    · after
    · extension
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
    · failed
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · startup
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
    · write
    · header
    · failed to write LSP body:
    · failed to flush LSP message:
    · flush
    · message
    · drill/drillCompleted failed:
    · drill
    · drillCompleted
    · drillCompleted failed:
    · Codely
    · src\messages\drill.rs
    · messages
    · messages\drill.rs
    · drill/drillCompleted
    · Failed to send drillCompleted IPC to Unity:
    · src\messages\editor.rs
    · editor
    · messages\editor.rs
    · editor/getEmbedModeembed_mode
    · getEmbedModeembed
    · getEmbedModeembed_mode
    · editor/setEmbedMode: hid  Tauri window(s) for workspace
    · setEmbedMode
    · window
    · setEmbedMode: hid  Tauri window(s) for workspace
    · editor/setEmbedMode: creating Tauri window for detach, workspace=
    · creating
    · detach
    · setEmbedMode: creating Tauri window for detach, workspace=
    · editor/setEmbedMode: creating Tauri window for detach without window state, workspace=
    · without
    · setEmbedMode: creating Tauri window for detach without window state, workspace=
    · creation
    · returned
    · detachCreated
    · detachFailed
    · create
    · <editor-webview>Updated window embed_mode= (target window=
    · webview
    · embed_mode
    · target
    · Sent set_embed_mode notification to UnityFailed to send set_embed_mode to Unity:
    · set_embed_mode
    · nityFailed
    · cowork_embed_mode_changed
    · editor/setEmbedModedarkH
    · setEmbedModedark
    · setEmbedModedarkH
    · editor/recompile
    · recompile
    · editor/recompile failed:
    · recompile failed:
    · editor/selectAsset: forwarding to Unity (filepath=
    · selectAsset
    · forwarding
    · filepath
    · selectAsset: forwarding to Unity (filepath=
    · editor/selectAsset called with empty filepath
    · called
    · empty
    · selectAsset called with empty filepath
    · Empty filepath
    · editor/selectAsset: sent to Unity OK
    · selectAsset: sent to Unity OK
    · editor/selectAsset failed:
    · selectAsset failed:
    · editor/selectAsset
    · src\messages\pet.rs
    · messages\pet.rs
    · pet/getActiveSessiontitleattachmentsAttachments are not supported on remote workspac
    · getActiveSessiontitleattachmentsAttachments
    · supported
    · remote
    · workspac
    · getActiveSessiontitleattachmentsAttachments are not supported on remote workspaces
    · workspaces
    · pet/submitPrompt
    · submitPrompt
    · Stale session: the active session changed
    · session
    · active
    · changed
    · No active session available
    · available
    · submitPrompt: core send failed:
    · PetApp state not available
    · etApp
    · completionOptionspet-submit-
```

## hit 2 @ 47511104 (host=22B)
```
  @ -2040 Sending  to Rust LSP server 
  @ -1912 workspace/symbolh
  @ -1872 Opening  in Rust LSP server  as 
  @ -1768 textDocument/didOpenSkipping didOpen for  (already open in 
  @ -1656 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @ -1544 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @ -1416 LSP server '' exceeded max crash recovery attempts (
  @ -1312  is stopping
  @ -1264 Initializing Rust LSP server 
  @ -1216  failed during spawn: 
  @ -1160 codely-desktopinitialize startup was interrupted
  @ -1080 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @  -952 initialized failed to initialize: 
  @  -880  failed during initialized notification: 
  @  -800  is ready
  @  -584 $/progresswindow/logMessage
  @  -504 Content-Length: 
  @  -448 src\lsp\transport.rs
  @  -400 failed to write LSP header: 
  @  -352 failed to write LSP body: 
  @  -304 failed to flush LSP message: 
  @  -256 drill/drillCompleted failed: 
  @  -208 Codelysrc\messages\drill.rs
  @  -152 drill/drillCompleted
  @   -88 Failed to send drillCompleted IPC to Unity: 
  @    +0 src\messages\editor.rs
  @   +48 editor/getEmbedModeembed_mode
  @  +104 editor/setEmbedMode: hid  Tauri window(s) for workspace 
  @  +192 editor/setEmbedMode: creating Tauri window for detach, workspace=
  @  +280 editor/setEmbedMode: creating Tauri window for detach without window state, workspace=
  @  +384 Window creation returned None for detachCreated Tauri window for detachFailed to create window for detach: 
  @  +512 <editor-webview>Updated window embed_mode= (target window=
  @  +624 Sent set_embed_mode notification to UnityFailed to send set_embed_mode to Unity: 
  @  +728 cowork_embed_mode_changededitor/setEmbedMode
  @  +824 editor/recompilex
  @  +856 editor/recompile failed: 
  @  +928 editor/selectAsset: forwarding to Unity (filepath=
  @ +1016 editor/selectAsset called with empty filepath
  @ +1088 Empty filepath
  @ +1144 editor/selectAsset: sent to Unity OK
  @ +1208 editor/selectAsset failed: 
  @ +1304 editor/selectAssetApp state is not availableunavailablesrc\messages\lsp.rs
  @ +1408 Rust LSP manager is not available
  @ +1472 lsp_errorRust LSP manager does not support 
  @ +1552 unsupported_file raw response for 
  @ +1640  error for 
  @ +1728 Skipping didOpen sync for 
  @ +1792 Failed to sync document with Rust LSP manager for 
  @ +1904 Cannot resolve relative  path without initialized workspace: 
  @ +2000  filePath= line= char= session=
  -- fragments --
    · Sending  to Rust LSP server
    · server
    · workspace/symbolh
    · workspace
    · symbolh
    · Opening  in Rust LSP server  as
    · textDocument/didOpenSkipping didOpen for  (already open in
    · textDocument
    · didOpenSkipping
    · didOpen
    · already
    · Skip LSP manager reload after extension mutation: app state unavailable
    · manager
    · reload
    · after
    · extension
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
    · failed
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · startup
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
    · write
    · header
    · failed to write LSP body:
    · failed to flush LSP message:
    · flush
    · message
    · drill/drillCompleted failed:
    · drill
    · drillCompleted
    · drillCompleted failed:
    · Codely
    · src\messages\drill.rs
    · messages
    · messages\drill.rs
    · drill/drillCompleted
    · Failed to send drillCompleted IPC to Unity:
    · src\messages\editor.rs
    · editor
    · messages\editor.rs
    · editor/getEmbedModeembed_mode
    · getEmbedModeembed
    · getEmbedModeembed_mode
    · editor/setEmbedMode: hid  Tauri window(s) for workspace
    · setEmbedMode
    · window
    · setEmbedMode: hid  Tauri window(s) for workspace
    · editor/setEmbedMode: creating Tauri window for detach, workspace=
    · creating
    · detach
    · setEmbedMode: creating Tauri window for detach, workspace=
    · editor/setEmbedMode: creating Tauri window for detach without window state, workspace=
    · without
    · setEmbedMode: creating Tauri window for detach without window state, workspace=
    · creation
    · returned
    · detachCreated
    · detachFailed
    · create
    · <editor-webview>Updated window embed_mode= (target window=
    · webview
    · embed_mode
    · target
    · Sent set_embed_mode notification to UnityFailed to send set_embed_mode to Unity:
    · set_embed_mode
    · nityFailed
    · cowork_embed_mode_changed
    · editor/setEmbedMode
    · editor/recompilex
    · recompilex
    · editor/recompile failed:
    · recompile
    · recompile failed:
    · editor/selectAsset: forwarding to Unity (filepath=
    · selectAsset
    · forwarding
    · filepath
    · selectAsset: forwarding to Unity (filepath=
    · editor/selectAsset called with empty filepath
    · called
    · empty
    · selectAsset called with empty filepath
    · Empty filepath
    · editor/selectAsset: sent to Unity OK
    · selectAsset: sent to Unity OK
    · editor/selectAsset failed:
    · selectAsset failed:
    · editor/selectAssetApp state is not availableunavailable
    · selectAssetApp
    · availableunavailable
    · src\messages\lsp.rs
    · messages\lsp.rs
    · selectAssetApp state is not availableunavailable
    · Rust LSP manager is not available
    · available
    · lsp_errorRust LSP manager does not support
    · errorRust
    · support
    · unsupported_file raw response for
    · unsupported_file
    · response
    · error for
    · error
    · Skipping didOpen sync for
    · Failed to sync document with Rust LSP manager for
    · document
    · Cannot resolve relative  path without initialized workspace:
    · resolve
    · relative
    · filePath= line= char= session=
```

## hit 3 @ 47713544 (host=22B)
```
  @ -2000 Sending  to Rust LSP server 
  @ -1872 workspace/symbol
  @ -1832 Opening  in Rust LSP server  as 
  @ -1752 textDocument/didOpenSkipping didOpen for  (already open in 
  @ -1640 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @ -1528 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @ -1400 LSP server '' exceeded max crash recovery attempts (
  @ -1296  is stopping
  @ -1248 Initializing Rust LSP server 
  @ -1200  failed during spawn: 
  @ -1144 codely-desktopinitialize startup was interrupted
  @ -1064 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @  -936 initialized failed to initialize: 
  @  -864  failed during initialized notification: 
  @  -784  is ready
  @  -568 $/progresswindow/logMessage
  @  -488 src\lsp\transport.rsContent-Length: 
  @  -392 failed to write LSP header: 
  @  -344 failed to write LSP body: 
  @  -296 failed to flush LSP message: 
  @  -248 drill/drillCompleted failed: 
  @  -200 src\messages\drill.rs
  @  -152 drill/drillCompleted
  @   -88 Failed to send drillCompleted IPC to Unity: 
  @    +0 src\messages\editor.rs
  @   +48 editor/getEmbedModeembed_mode
  @  +104 editor/setEmbedMode: hid  Tauri window(s) for workspace p%
  @  +192 editor/setEmbedMode: creating Tauri window for detach, workspace=
  @  +280 editor/setEmbedMode: creating Tauri window for detach without window state, workspace=
  @  +384 Window creation returned None for detachCreated Tauri window for detachFailed to create window for detach: 
  @  +512 <editor-webview>Updated window embed_mode= (target window=
  @  +624 Sent set_embed_mode notification to UnityFailed to send set_embed_mode to Unity: 
  @  +728 cowork_embed_mode_changededitor/setEmbedMode
  @  +824 editor/recompile@(
  @  +856 editor/recompile failed: 
  @  +928 editor/selectAsset: forwarding to Unity (filepath=
  @ +1016 editor/selectAsset called with empty filepath
  @ +1088 Empty filepath
  @ +1144 editor/selectAsset: sent to Unity OK
  @ +1208 editor/selectAsset failed: 
  @ +1304 editor/selectAssetApp state is not availableunavailablesrc\messages\lsp.rs
  @ +1408 Rust LSP manager is not available
  @ +1472 lsp_errorRust LSP manager does not support 
  @ +1552 unsupported_file raw response for 
  @ +1640  error for 
  @ +1728 Skipping didOpen sync for 
  @ +1792 Failed to sync document with Rust LSP manager for 
  @ +1904 Cannot resolve relative  path without initialized workspace: 
  @ +2000  filePath= line= char= session=
  -- fragments --
    · Sending  to Rust LSP server
    · server
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
    · manager
    · reload
    · after
    · extension
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
    · failed
    · during
    · spawn
    · codely-desktopinitialize startup was interrupted
    · codely
    · desktopinitialize
    · startup
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
    · write
    · header
    · failed to write LSP body:
    · failed to flush LSP message:
    · flush
    · message
    · drill/drillCompleted failed:
    · drill
    · drillCompleted
    · drillCompleted failed:
    · src\messages\drill.rs
    · messages
    · messages\drill.rs
    · drill/drillCompleted
    · Failed to send drillCompleted IPC to Unity:
    · src\messages\editor.rs
    · editor
    · messages\editor.rs
    · editor/getEmbedModeembed_mode
    · getEmbedModeembed
    · getEmbedModeembed_mode
    · editor/setEmbedMode: hid  Tauri window(s) for workspace p%
    · setEmbedMode
    · window
    · setEmbedMode: hid  Tauri window(s) for workspace p%
    · editor/setEmbedMode: creating Tauri window for detach, workspace=
    · creating
    · detach
    · setEmbedMode: creating Tauri window for detach, workspace=
    · editor/setEmbedMode: creating Tauri window for detach without window state, workspace=
    · without
    · setEmbedMode: creating Tauri window for detach without window state, workspace=
    · creation
    · returned
    · detachCreated
    · detachFailed
    · create
    · <editor-webview>Updated window embed_mode= (target window=
    · webview
    · embed_mode
    · target
    · Sent set_embed_mode notification to UnityFailed to send set_embed_mode to Unity:
    · set_embed_mode
    · nityFailed
    · cowork_embed_mode_changed
    · editor/setEmbedMode
    · editor/recompile@(
    · recompile
    · recompile@(
    · editor/recompile failed:
    · recompile failed:
    · editor/selectAsset: forwarding to Unity (filepath=
    · selectAsset
    · forwarding
    · filepath
    · selectAsset: forwarding to Unity (filepath=
    · editor/selectAsset called with empty filepath
    · called
    · empty
    · selectAsset called with empty filepath
    · Empty filepath
    · editor/selectAsset: sent to Unity OK
    · selectAsset: sent to Unity OK
    · editor/selectAsset failed:
    · selectAsset failed:
    · editor/selectAssetApp state is not availableunavailable
    · selectAssetApp
    · availableunavailable
    · src\messages\lsp.rs
    · messages\lsp.rs
    · selectAssetApp state is not availableunavailable
    · Rust LSP manager is not available
    · available
    · lsp_errorRust LSP manager does not support
    · errorRust
    · support
    · unsupported_file raw response for
    · unsupported_file
    · response
    · error for
    · error
    · Skipping didOpen sync for
    · Failed to sync document with Rust LSP manager for
    · document
    · Cannot resolve relative  path without initialized workspace:
    · resolve
    · relative
    · filePath= line= char= session=
    · filePath
```
