# src\unity\insight_agent_toml.rs

occurrences=2

## hit 1 @ 47125100 (host=67B)
```
  @ -2028 /api/tauri/mobile/v1/machine/workspaces/:workspace_key/sessions
  @ -1940 /api/tauri/hub/workspace-ready
  @ -1884 /api/tauri/hub/close-workspace
  @ -1828 /api/tauri/hub/open-workspace
  @ -1772 /api/tauri/hub/reorder-workspaces
  @ -1708 /api/tauri/window-bridge/local/:token/*path
  @ -1636 /api/tauri/window-bridge/remote/:token/*path
  @ -1540 /api/tauri/file-explorer
  @ -1492 /api/tauri/file-preview-media
  @ -1436 /api/tauri/file-explorer/search-stream
  @ -1372 /api/tauri/file-explorer/events
  @ -1316 /api/tauri/unity-insight/index-status
  @ -1252 /api/tauri/unity-insight/active-build
  @ -1188 /api/tauri/unity-insight/live-serves
  @ -1124 /api/tauri/unity-insight/ensure-index
  @ -1060 /api/tauri/unity-insight/get-enabled
  @  -996 /api/tauri/unity-insight/set-enabled
  @  -932 /api/tauri/unity-insight/get-max-turns
  @  -868 /api/tauri/unity-insight/set-max-turns
  @  -804 /api/tauri/unity-insight/vfs-children
  @  -740 /api/tauri/unity-insight/vfs-entry
  @  -676 /api/tauri/unity-insight/vfs-search
  @  -612 /api/tauri/unity-insight/vfs-path-search
  @  -548 /api/tauri/unity-insight/vfs-refs
  @  -484 /api/tauri/drop-files
  @  -436 /api/tauri/local-file-content
  @  -380 /api/tauri/download-url
  @  -332 index.html
  @  -232   (API: invoke/events/set-embed-mode/pick-folder/init-workspace) from 
  @  -108 Failed to bind: 
  @   -76 Invalid --bind-host: 
  @   -36 (?s)\[run\]([^\[]*)run section regexsrc\unity\insight_agent_toml.rs
  @   +60 (?m)^(\s*max_turns\s*=\s*)-?\d+(\s*)$max_turns line regex
  @  +148 (?m)^\s*max_turns\s*=\s*(-?\d+)\s*$max_turns value regexl*
  @  +228 src\unity\ipc.rsP+
  @  +460 No Unity client connected. Please ensure Unity Editor window is open.Failed to serialize message: 
  @  +604 cowork_client_installedsrc\metrics.rs[client_installed] skipped; sentinel exists at 
  @  +708 UnityMetrics
  @  +748 failed to resolve data dir
  @  +804 Closed terminal session in 
  @  +852 TerminalClosed terminal in 
  @  +900 src\tunnel.rs
  @  +964 Tunnel stopped: 0.
  @  +996 Tunnel/api/v1/frp/disconnect
  @ +1060 Disconnecting tunnel ''
  @ +1140 Tunnel '' already disconnected (404)
  @ +1212 Server returned (/
  @ +1260 ' disconnected
  @ +1308 API status was not 'success': 
  @ +1356 HTTP request failed: 
  @ +1396 Failed to read response body: 
  @ +1444 Failed to parse response:  
  @ +1474  body: 
  @ +1516 src\lib.rs
  @ +1556 Restored saved Hub project: id=, path=
  @ +1652 Failed to restore saved Hub project 
  @ +1724 Failed to prune saved Hub projects: 
  @ +1828 start_cores: workspace_count=
  @ +1876 CorePoolProcessing CLI workspace: raw=, normalized=
  @ +1964 SingleInstance
  @ +2004 Workspace already registered, focusing: @2
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
```

## hit 2 @ 47423938 (host=41B)
```
  @ -2018 src\lsp\manager.rs
  @ -1970 server check: file= binary=
  @ -1890  binary=none installed=false
  @ -1826 invalid binary name: 
  @ -1786 isServerInstalled  
  @ -1764  found= path=
  @ -1698 LSPmissing LSP config for server 
  @ -1642 failed to convert  to file URI
  @ -1578 where.exeAPPDATAnpmLOCALAPPDATAProgramsnodejsProgramFilesProgramFiles(x86)USERPROFILE.dotnettools.cargobin.omnisharpMicrosoftWinGetPackagesexecmdbatps1
  @ -1362 HOMEsrc\lsp\path.rs
  @ -1314 src\lsp\server_instance.rsserver state lock poisoned
  @ -1234 server error lock poisoned
  @ -1154 LSP server  is not started
  @ -1090  is starting
  @ -1042  is stopping
  @  -994  is not running
  @  -898 server ""
  @  -850 extension "
  @  -802 Upstream / source (from extension manifest): 
  @  -738 Install the language server for this stack and ensure its executable is on your PATH.[LSP] Cannot start : command not found: "" (ENOENT). . Cause: 
  @  -522 enoentos error 2no such file or directorycannot find the file
  @  -434 workspaceFoldersinitializationOptionsdynamicRegistrationworkspace folder should convert to file URI
  @  -306 src\messages\tunnel.rs
  @  -258 src\pet\queue.rs
  @  -170 idaccess_token=agentsunity-insight.tomlUnable to resolve ~/.codely-cli/agentsworkspaceDir is required for workspace-scoped agent toml
  @   -10 full matchsrc\unity\insight_agent_toml.rs
  @   +86 ${1}${2}
  @  +150 [run]
  @  +230 max_turns = 
  @  +430 Managed by Codely Cowork (unityInsight.maxTurns)# Managed by Codely Cowork (unityInsight.maxTurns).
  @  +551 # Regenerated from builtin on each Settings change; removed when max_turns is default.
  @  +670 C:\b\o\code-search\codely-cowork\extensions\tauri\src-tauri../../../codely-cli/builtin-agents
  @  +790 ../../../codely-cli/bundle/builtin-agents
  @  +862 name = "unity-insight"
  @  +886 description = "Read-only Unity project analysis specialist (Unity Insight VFS) for multi-step Unity graph research. The main agent can call vfs_* directly for single lookups once the index is ready; use this agent when a...(+322)
  @ +1431 not how to investigate. Do not prescribe steps, workflows, search strategies, or tool names (e.g. vfs_ls, vfs_grep, vfs_read); this agent selects its own read-only VFS tools. For 
  @ +1613 which scene/prefab uses this .mat/model/texture
  @ +1663  tasks, add one deliverable line: vfs_refs paths are sufficient evidence
  @ +1738 do not require reading scene YAML or quoting m_Materials unless the user explicitly asks for field-level YAML. Optional thoroughness: quick | medium | very thorough."
  @ +1906 display_name = "Unity Insight"
  @ +1940 tools = ["vfs_ls", "vfs_glob", "vfs_read", "vfs_grep", "vfs_refs"]
  @ +2010 [prompts]
  @ +2021 system_prompt = """
  -- fragments --
    · src\lsp\manager.rs
    · manager
    · lsp\manager.rs
    · server check: file= binary=
    · server
    · check
    · binary
    · binary=none installed=false
    · installed
    · false
    · invalid binary name:
    · invalid
    · isServerInstalled
    · found= path=
    · found
    · LSPmissing LSP config for server
    · LSPmissing
    · config
    · failed to convert  to file URI
    · failed
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
    · state
    · poisoned
    · lsp\server_instance.rsserver state lock poisoned
    · server error lock poisoned
    · error
    · LSP server  is not started
    · started
    · is starting
    · starting
    · is stopping
    · stopping
    · is not running
    · running
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
    · idaccess_token
    · agentsunity
    · insight
    · tomlUnable
    · resolve
    · codely
    · agentsworkspaceDir
    · required
    · workspace
    · scoped
    · agent
    · full match
    · match
    · src\unity\insight_agent_toml.rs
    · unity
    · insight_agent_toml
    · unity\insight_agent_toml.rs
    · ${1}${2}
    · [run]
    · max_turns =
    · max_turns
    · unityInsight
    · maxTurns
    · # Regenerated from builtin on each Settings change; removed when max_turns is default.
    · builtin
    · change
    · removed
    · default
    · search
    · cowork
    · extensions
    · tauri
    · agents
    · ../../../codely-cli/bundle/builtin-agents
    · bundle
    · name = "unity-insight"
    · description
    · project
    · analysis
    · specialist
    · multi
    · graph
    · research
    · directly
    · single
    · lookups
    · index
    · ready
    · question
    · needs
    · class
    · method
    · script
    · bindings
    · prefab
    · scene
    · hierarchy
    · asset
    · references
    · missing
    · still
    · building
    · tools
    · report
    · stale
    · unavailable
    · filesystem
    · delegating
    · answer
    · goals
    · scope
    · deliverables
    · investigate
    · prescribe
    · steps
    · workflows
    · strategies
    · names
    · vfs_ls
    · vfs_grep
    · vfs_read
```
