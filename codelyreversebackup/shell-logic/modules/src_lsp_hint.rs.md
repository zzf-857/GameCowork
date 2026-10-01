# src\lsp\hint.rs

occurrences=1

## hit 1 @ 47212304 (host=15B)
```
  @ -2016 auth.setCoworkToken
  @ -1968 failed to serialize SetCoworkTokenParams: 
  @ -1904 failed to deserialize auth.setCoworkToken response: 
  @ -1808 failed to serialize hub message: 
  @ -1752 hub client  is not started
  @ -1688 failed to write to hub 
  @ -1632 src\lsp\client.rs
  @ -1584 LSP server  is already running
  @ -1520 resolved command: 
  @ -1464 LSP<none>Spawning Rust LSP server  with command= args= cwd=
  @ -1288 Rust LSP server  spawned successfully
  @ -1216 failed to start LSP server  with command 
  @ -1120  did not expose stdin
  @ -1064  did not expose stdout
  @ -1008  did not expose stderr
  @  -848 LSP request  timed out after s on 
  @  -688 LSP client stopped
  @  -640 failed to serialize  LSP message: 
  @  -536 failed to write to LSP server 
  @  -472 src\lsp\config.rs
  @  -400 failed to read extension directory 
  @  -328 gemini-extension.jsonfailed to read extension entry in 
  @  -240 failed to inspect extension entry 
  @  -144 failed to read extension manifest 
  @   -72 failed to parse extension manifest 
  @    +0 src\lsp\hint.rs
  @   +40 resolve_file_preview_lsp_status: path= language= extension_installed= server_installed= supported=
  @  +224 src\lsp\manager.rs
  @  +344 Starting Rust LSP server  for 
  @  +408 No configured Rust LSP server found for 
  @  +488  startup timed out after 120s
  @  +576 Sending  to Rust LSP server 
  @  +704 workspace/symbol
  @  +744 Opening  in Rust LSP server  as 
  @  +848 textDocument/didOpenSkipping didOpen for  (already open in 
  @  +960 Skip LSP manager reload after extension mutation: app state unavailablesrc\lsp\reload.rs
  @ +1072 Skip LSP manager reload after extension mutation: workspace unavailablesrc\lsp\server_instance.rs
  @ +1200 LSP server '' exceeded max crash recovery attempts (
  @ +1304  is stopping
  @ +1352 Initializing Rust LSP server 
  @ +1400  failed during spawn: 
  @ +1456 codely-desktopinitialize startup was interrupted
  @ +1536 /capabilities/definitionProvider responded to initialize; capabilities.definitionProvider=
  @ +1664 initialized failed to initialize: 
  @ +1736  failed during initialized notification: 
  @ +1816  is ready
  -- fragments --
    · auth.setCoworkToken
    · setCoworkToken
    · failed to serialize SetCoworkTokenParams:
    · failed
    · serialize
    · etCoworkTokenParams
    · failed to deserialize auth.setCoworkToken response:
    · deserialize
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
```
