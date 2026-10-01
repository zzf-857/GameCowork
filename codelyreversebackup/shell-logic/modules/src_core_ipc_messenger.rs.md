# src\core\ipc_messenger.rs

occurrences=5

## hit 1 @ 47117014 (host=79B)
```
  @ -2038 CODELY_LOG_TO_STDIO1CodelyShared core registered on AppStateAppState not available 
  @ -1952  shared core not registeredsrc\app\state.rs
  @ -1878 CoreCommOrgRefreshLeaderGuard dropped without finish() 
  @ -1820  publishing Failure to followers
  @ -1734 dataauthFlowAttemptId
  @ -1614 messageTypetjhub/statusUpdatesessionUpdatebroadcast  receiver(s)
  @ -1478 src\app\window_manager.rs
  @ -1422 hub/workspaceAddedtargetGuiViewIdhub-main
  @ -1302 appWindowManagerHub state existed without a Tauri window; recreating HubhubModeCreated hub windowGlobal app state not initializedApp HTTP server not started yet
  @ -1118 Workspace already registered: 
  @ -1070 Re-attaching hub forwarder for already-registered workspace: {normalized}
  @  -966 headlessRegistered headless workspace: id=, dir=
  @  -886 Shared core must be initializedsrc\app\workspace_state.rs
  @  -558 src\core\communication.rs
  @  -502 nonestate= code= workspace= core= cli= restart_attempts= action= message=
  @  -294 CoreHealth
  @  -230 tauri/core-status
  @  -158 streamMessageId
  @   -94 Core is stopping
  @   -54 Core is stoppedCoreCommunicationCore stopped and resetsrc\core\ipc_messenger.rs
  @   +74 StdioIpcstdout reader started
  @  +154 stdout read error after  lines: p
  @  +218 stdout reader exited after  lines
  @  +290 <actions>
  @  +300                         <action content="Accept" arguments="accept"/>
  @  +370                         <action content="Reject" arguments="reject"/>
  @  +440                     </actions><toast><visual><binding template="ToastGeneric">
  @  +519                         <text></text>
  @  +595                     </binding></visual></toast>
  @  +738 dev.codelycowork.desktopsrc\core\process.rs
  @  +810 Connecting to TCP server at :...
  @  +890 TcpIpcMessengersrc\core\tcp_ipc_messenger.rs
  @  +962 Connected to TCP server at 
  @ +1074 Failed to connect to TCP server: 
  @ +1130 src\frp_client.rs
  @ +1178 src\tjhub\client.rs
  @ +1298 hub request  timed out on 
  @ +1386 hub  closed before responding to 
  @ +1506 system.shutdown
  @ +1546 exit
  @ +1578 hub client stopped
  @ +1626 failed to serialize hub message: 
  @ +1682 hub client  is not started
  @ +1746 failed to write to hub : 
  @ +1810 Content-Length: 
  @ +1866 src\lsp\transport.rs
  @ +1914 failed to write LSP header: 
  @ +1962 failed to write LSP body: 
  @ +2010 failed to flush LSP message: 
  -- fragments --
    · CODELY_LOG_TO_STDIO1CodelyShared core registered on AppStateAppState not available
    · STDIO1CodelyShared
    · registered
    · ppStateAppState
    · available
    · shared core not registered
    · shared
    · src\app\state.rs
    · state
    · app\state.rs
    · CoreCommOrgRefreshLeaderGuard dropped without finish()
    · oreCommOrgRefreshLeaderGuard
    · dropped
    · without
    · finish
    · publishing Failure to followers
    · publishing
    · followers
    · dataauthFlowAttemptId
    · messageType
    · tjhub/statusUpdatesessionUpdatebroadcast  receiver(s)
    · tjhub
    · statusUpdatesessionUpdatebroadcast
    · receiver
    · statusUpdatesessionUpdatebroadcast  receiver(s)
    · src\app\window_manager.rs
    · window_manager
    · app\window_manager.rs
    · hub/workspaceAddedtargetGuiViewIdhub-main
    · workspaceAddedtargetGuiViewIdhub
    · appWindowManagerHub
    · existed
    · window
    · recreating
    · ubhubModeCreated
    · windowGlobal
    · initializedApp
    · server
    · started
    · Workspace already registered:
    · already
    · Re-attaching hub forwarder for already-registered workspace: {normalized}
    · attaching
    · forwarder
    · workspace
    · normalized
    · headlessRegistered headless workspace: id=, dir=
    · headlessRegistered
    · headless
    · Shared core must be initialized
    · initialized
    · src\app\workspace_state.rs
    · workspace_state
    · app\workspace_state.rs
    · src\core\communication.rs
    · communication
    · core\communication.rs
    · nonestate= code= workspace= core= cli= restart_attempts= action= message=
    · nonestate
    · restart_attempts
    · action
    · message
    · CoreHealth
    · oreHealth
    · tauri/core-status
    · tauri
    · status
    · core-status
    · streamMessageId
    · Core is stopping
    · stopping
    · Core is stoppedCoreCommunicationCore stopped and reset
    · stoppedCoreCommunicationCore
    · stopped
    · reset
    · src\core\ipc_messenger.rs
    · ipc_messenger
    · core\ipc_messenger.rs
    · StdioIpcstdout reader started
    · tdioIpcstdout
    · reader
    · stdout read error after  lines: p
    · stdout
    · error
    · after
    · lines
    · stdout reader exited after  lines
    · exited
    · <actions>
    · actions
    · <action content="Accept" arguments="accept"/>
    · content
    · arguments
    · accept
    · <action content="Reject" arguments="reject"/>
    · reject
    · </actions><toast><visual><binding template="ToastGeneric">
    · toast
    · visual
    · binding
    · template
    · oastGeneric
    · <text></text>
    · </binding></visual></toast>
    · dev.codelycowork.desktop
    · codelycowork
    · desktop
    · src\core\process.rs
    · process
    · core\process.rs
    · Connecting to TCP server at :...
    · TcpIpcMessenger
    · cpIpcMessenger
    · src\core\tcp_ipc_messenger.rs
    · tcp_ipc_messenger
    · core\tcp_ipc_messenger.rs
    · Connected to TCP server at
    · Failed to connect to TCP server:
    · connect
    · src\frp_client.rs
    · frp_client
    · frp_client.rs
    · src\tjhub\client.rs
    · client
    · tjhub\client.rs
    · hub request  timed out on
    · request
    · timed
    · hub  closed before responding to
    · closed
    · before
    · responding
    · system.shutdown
    · system
    · shutdown
    · hub client stopped
    · failed to serialize hub message:
    · failed
    · serialize
    · hub client  is not started
    · failed to write to hub :
    · write
    · Content-Length:
    · src\lsp\transport.rs
    · transport
    · lsp\transport.rs
    · failed to write LSP header:
    · header
    · failed to write LSP body:
    · failed to flush LSP message:
```

## hit 2 @ 47194750 (host=117B)
```
  @ -1942 device-flow-failedDevice authorization request has expiredexpired
  @ -1798 stream/liveUpdate
  @ -1750 sessionIddefaultcompletion
  @ -1686 role
  @ -1654 messageId
  @ -1614 send_to_gui_internal: 
  @ -1542 streamMessageIddonestreamFinished: session_id=, title=, body_len=, from_mobile=
  @ -1398 Push...
  @ -1334 machineId
  @ -1270 &codely-mobile://session?
  @ -1222 task_completedtask_confirmationFailed to send push: 
  @ -1150 continueSessionIdmessageOptions
  @ -1094 This session is currently controlled from another Codely view (stream 
  @  -990 No active stream to joinjoinExistingStreamOnlylastAppliedSeq
  @  -614 redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
  @  -510 redeliver_pending_acp_requests: failed to re-dispatch messageId=
  @  -366   -> Routed to workspace  via SSE
  @  -294   -> workspaceId  not found, falling back to local SSE
  @  -206   -> Sent via SSE to  receivers
  @  -142   -> SSE broadcast failed: no active receivers 
  @   -92  message retained in replay snapshotNo GUI transport available (SSE channel not initialized)src\core\ipc_messenger.rs
  @   +90 Failed to serialize message: 
  @  +138 Failed to write to stdin: 
  @  +234 Channel closed for 
  @  +274 Response message_id mismatch for 
  @  +378 src\core\process.rs
  @  +426 src\core\tcp_ipc_messenger.rsSending message:  (id: 
  @  +530 TcpIpcMessenger
  @  +570 Message sent successfully: 
  @  +650 Failed to write to TCP stream: 
  @  +698 Making request: , no timeout)
  @  +778 , timeout: ms)
  @  +906 Channel closed while waiting for response: 
  @ +1002 Response message_id mismatch: expected , got 
  @ +1082 Response message_id mismatchReceived response for request: 
  @ +1194 Request timeout: 
  @ +1282 runningstartingstalledexitedstoppingsrc\frp_client.rs
  @ +1362 src\ide\ide_protocol_client.rs
  @ +1442 getIdeInfogetHomedirgetDiffgetFileAtHeadgetFileAtIndexsaveFileopenFiledeleteFileshowFilegetCurrentFilegetCursorPositiongetWorkspaceDirsgetProjectRootgetBranchgetGitBranchesgetTagscopyTextshowToastisWorkspaceRemoteisTelem...(+282)
  @ +1962 IdeProtocolClient
  @ +2010 Error handling 
  -- fragments --
    · device-flow-failedDevice authorization request has expiredexpired
    · device
    · failedDevice
    · authorization
    · request
    · expiredexpired
    · stream/liveUpdate
    · stream
    · liveUpdate
    · sessionIddefaultcompletion
    · messageId
    · send_to_gui_internal:
    · send_to_gui_internal
    · streamMessageIddonestreamFinished: session_id=, title=, body_len=, from_mobile=
    · streamMessageIddonestreamFinished
    · session_id
    · title
    · body_len
    · from_mobile
    · Push...
    · machineId
    · &codely-mobile://session?
    · codely
    · mobile
    · session
    · task_completedtask_confirmationFailed to send push:
    · confirmationFailed
    · continueSessionIdmessageOptions
    · This session is currently controlled from another Codely view (stream
    · currently
    · controlled
    · another
    · No active stream to joinjoinExistingStreamOnlylastAppliedSeq
    · active
    · joinjoinExistingStreamOnlylastAppliedSeq
    · redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
    · redeliver_pending_acp_requests
    · dispatching
    · pending
    · redeliver_pending_acp_requests: failed to re-dispatch messageId=
    · failed
    · dispatch
    · -> Routed to workspace  via SSE
    · workspace
    · -> workspaceId  not found, falling back to local SSE
    · workspaceId
    · found
    · falling
    · local
    · -> Sent via SSE to  receivers
    · receivers
    · -> SSE broadcast failed: no active receivers
    · broadcast
    · message
    · retained
    · replay
    · snapshotNo
    · transport
    · available
    · channel
    · initialized
    · src\core\ipc_messenger.rs
    · ipc_messenger
    · core\ipc_messenger.rs
    · Failed to serialize message:
    · serialize
    · Failed to write to stdin:
    · write
    · stdin
    · Channel closed for
    · closed
    · Response message_id mismatch for
    · message_id
    · mismatch
    · src\core\process.rs
    · process
    · core\process.rs
    · src\core\tcp_ipc_messenger.rsSending message:  (id:
    · tcp_ipc_messenger
    · rsSending
    · core\tcp_ipc_messenger.rsSending message:  (id:
    · TcpIpcMessenger
    · cpIpcMessenger
    · Message sent successfully:
    · successfully
    · Failed to write to TCP stream:
    · Making request: , no timeout)
    · timeout
    · , timeout: ms)
    · Channel closed while waiting for response:
    · while
    · waiting
    · response
    · Response message_id mismatch: expected , got
    · expected
    · Response message_id mismatchReceived response for request:
    · mismatchReceived
    · Request timeout:
    · runningstartingstalledexitedstopping
    · src\frp_client.rs
    · frp_client
    · frp_client.rs
    · src\ide\ide_protocol_client.rs
    · ide_protocol_client
    · ide\ide_protocol_client.rs
    · IdeProtocolClient
    · deProtocolClient
    · Error handling
    · handling
```

## hit 3 @ 47492518 (host=117B)
```
  @ -1966 device-flow-failedDevice authorization request has expiredexpired
  @ -1822 stream/liveUpdate
  @ -1774 sessionIddefaultcompletion
  @ -1710 role
  @ -1678 messageId
  @ -1638 send_to_gui_internal: 
  @ -1566 stream/streamFinishedstreamMessageIddonestreamFinished: session_id=, title=, body_len=, from_mobile=
  @ -1398 Push...
  @ -1334 machineId
  @ -1270 &codely-mobile://session?
  @ -1222 task_completedtask_confirmationFailed to send push: 
  @ -1150 continueSessionIdmessageOptions
  @ -1094 This session is currently controlled from another Codely view (stream 
  @  -990 No active stream to joinjoinExistingStreamOnlylastAppliedSeq
  @  -614 redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
  @  -510 redeliver_pending_acp_requests: failed to re-dispatch messageId=
  @  -366   -> Routed to workspace  via SSE
  @  -294   -> workspaceId  not found, falling back to local SSE
  @  -206   -> Sent via SSE to  receivers
  @  -142   -> SSE broadcast failed: no active receivers 
  @   -92  message retained in replay snapshotNo GUI transport available (SSE channel not initialized)src\core\ipc_messenger.rs
  @   +82 Failed to serialize message: 
  @  +130 Failed to write to stdin: 
  @  +226 Channel closed for 
  @  +266 Response message_id mismatch for 
  -- fragments --
    · device-flow-failedDevice authorization request has expiredexpired
    · device
    · failedDevice
    · authorization
    · request
    · expiredexpired
    · stream/liveUpdate
    · stream
    · liveUpdate
    · sessionIddefaultcompletion
    · messageId
    · send_to_gui_internal:
    · send_to_gui_internal
    · streamFinishedstreamMessageIddonestreamFinished
    · session_id
    · title
    · body_len
    · from_mobile
    · Push...
    · machineId
    · &codely-mobile://session?
    · codely
    · mobile
    · session
    · task_completedtask_confirmationFailed to send push:
    · confirmationFailed
    · continueSessionIdmessageOptions
    · This session is currently controlled from another Codely view (stream
    · currently
    · controlled
    · another
    · No active stream to joinjoinExistingStreamOnlylastAppliedSeq
    · active
    · joinjoinExistingStreamOnlylastAppliedSeq
    · redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
    · redeliver_pending_acp_requests
    · dispatching
    · pending
    · redeliver_pending_acp_requests: failed to re-dispatch messageId=
    · failed
    · dispatch
    · -> Routed to workspace  via SSE
    · workspace
    · -> workspaceId  not found, falling back to local SSE
    · workspaceId
    · found
    · falling
    · local
    · -> Sent via SSE to  receivers
    · receivers
    · -> SSE broadcast failed: no active receivers
    · broadcast
    · message
    · retained
    · replay
    · snapshotNo
    · transport
    · available
    · channel
    · initialized
    · src\core\ipc_messenger.rs
    · ipc_messenger
    · core\ipc_messenger.rs
    · Failed to serialize message:
    · serialize
    · Failed to write to stdin:
    · write
    · stdin
    · Channel closed for
    · closed
    · Response message_id mismatch for
    · message_id
    · mismatch
```

## hit 4 @ 47620064 (host=89B)
```
  @ -2000 &codely-mobile://session?
  @ -1952 task_completedtask_confirmationFailed to send push: 
  @ -1856 continueSessionIdmessageOptions
  @ -1800 This session is currently controlled from another Codely view (stream 
  @ -1696 No active stream to joinjoinExistingStreamOnlylastAppliedSeq
  @ -1296 request_to_gui: start messageType=
  @ -1152 Message ID  Type  already exists`
  @ -1072 request_to_gui: registered pending messageId=, total_pending=
  @  -976 request_to_gui: waiting for GUI response messageType=
  @  -888 request_to_gui: dispatch failed messageId=, error=
  @  -800 (no status)request_to_gui: completed messageType=, response status=
  @  -680 request_to_gui: GUI response channel closed messageType=8
  @  -592 GUI response channel closed
  @  -536 redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
  @  -432 redeliver_pending_acp_requests: failed to re-dispatch messageId=0
  @  -288   -> Routed to workspace  via SSE
  @  -216   -> workspaceId  not found, falling back to local SSE
  @  -128   -> Sent via SSE to  receivers
  @   -64 No GUI transport available (SSE channel not initialized)startingsrc\core\ipc_messenger.rs
  @  +144 Failed to serialize message: 
  @  +192 Failed to write to stdin: 
  @  +288 Channel closed for 
  @  +328 Response message_id mismatch for 
  @  +840 acceptrejectsrc\core\os_notification.rs
  @  +952 OsNotificationOS notification sentFailed to send: 
  @ +1024 OS notification task panicked: 
  @ +1096 src\core\process.rs
  @ +1192 Core executable not found: 
  @ +1240 nodeCODELY_WORKSPACECODELY_PREWARMNODE_ENVproductionCODELY_BRIDGE_CANARYCODELY_SIDECHATPKG_EXECPATHcliCODELY_CLI_BASE_DIRhubtuanjie.exe
  @ +1400 CODELY_API_SERVER_ENVCONTROL_PLANE_ENVCODELY_POSTHOG_URL_ENV
  @ +1488 CODELY_BUNDLED_PATH_PREFIXPATH
  @ +1544 Failed to assign child to Job Object: 
  @ +1600 CoreProcessChild process assigned to Job Object (KILL_ON_JOB_CLOSE)Failed to create Job Object: c
  @ +1712 Core process already runningFailed to start core process: 
  @ +1792 Failed to get stdin from child processFailed to get stdout from child processFailed to get stderr from child process
  @ +1960 src\core\tcp_ipc_messenger.rs
  -- fragments --
    · &codely-mobile://session?
    · codely
    · mobile
    · session
    · task_completedtask_confirmationFailed to send push:
    · confirmationFailed
    · continueSessionIdmessageOptions
    · This session is currently controlled from another Codely view (stream
    · currently
    · controlled
    · another
    · stream
    · No active stream to joinjoinExistingStreamOnlylastAppliedSeq
    · active
    · joinjoinExistingStreamOnlylastAppliedSeq
    · request_to_gui: start messageType=
    · request_to_gui
    · start
    · messageType
    · Message ID  Type  already exists`
    · already
    · exists
    · request_to_gui: registered pending messageId=, total_pending=
    · registered
    · pending
    · messageId
    · total_pending
    · request_to_gui: waiting for GUI response messageType=
    · waiting
    · response
    · request_to_gui: dispatch failed messageId=, error=
    · dispatch
    · failed
    · error
    · (no status)request_to_gui: completed messageType=, response status=
    · status
    · completed
    · request_to_gui: GUI response channel closed messageType=8
    · channel
    · closed
    · GUI response channel closed
    · redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
    · redeliver_pending_acp_requests
    · dispatching
    · request
    · redeliver_pending_acp_requests: failed to re-dispatch messageId=0
    · -> Routed to workspace  via SSE
    · workspace
    · -> workspaceId  not found, falling back to local SSE
    · workspaceId
    · found
    · falling
    · local
    · -> Sent via SSE to  receivers
    · receivers
    · No GUI transport available (SSE channel not initialized)starting
    · transport
    · available
    · initialized
    · starting
    · src\core\ipc_messenger.rs
    · ipc_messenger
    · core\ipc_messenger.rs
    · Failed to serialize message:
    · serialize
    · message
    · Failed to write to stdin:
    · write
    · stdin
    · Channel closed for
    · Response message_id mismatch for
    · message_id
    · mismatch
    · acceptreject
    · src\core\os_notification.rs
    · os_notification
    · core\os_notification.rs
    · OsNotificationOS notification sentFailed to send:
    · sNotification
    · notification
    · sentFailed
    · OS notification task panicked:
    · panicked
    · src\core\process.rs
    · process
    · core\process.rs
    · Core executable not found:
    · executable
    · ENVproductionCODELY
    · EXECPATHcliCODELY
    · DIRhubtuanjie
    · CODELY_API_SERVER_ENVCONTROL_PLANE_ENVCODELY_POSTHOG_URL_ENV
    · CODELY_BUNDLED_PATH_PREFIXPATH
    · Failed to assign child to Job Object:
    · assign
    · child
    · oreProcessChild
    · assigned
    · create
    · Core process already runningFailed to start core process:
    · runningFailed
    · processFailed
    · stdout
    · stderr
    · src\core\tcp_ipc_messenger.rs
    · tcp_ipc_messenger
    · core\tcp_ipc_messenger.rs
```

## hit 5 @ 47700304 (host=89B)
```
  @ -1992 Auth flow failed: 
  @ -1952 accessToken
  @ -1912 didChangeControlPlaneSessionInfoNo auth flow in progress to canceldevice-flow-cancelled
  @ -1800 device-flow-failedDevice authorization request has expiredexpired
  @ -1632 defaultcompletion
  @ -1576 role
  @ -1520 send_to_gui_internal: 
  @ -1448 donestreamFinished: session_id=, body_len=, from_mobile=
  @ -1328 Push...
  @ -1288 name
  @ -1256 machineId
  @ -1192 &codely-mobile://session?
  @ -1144 task_completedtask_confirmationFailed to send push: 
  @ -1072 continueSessionIdmessageOptions
  @ -1016 This session is currently controlled from another Codely view (stream 
  @  -912 No active stream to joinjoinExistingStreamOnlylastAppliedSeq
  @  -536 redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
  @  -432 redeliver_pending_acp_requests: failed to re-dispatch messageId=
  @  -288   -> Routed to workspace  via SSE
  @  -216   -> workspaceId  not found, falling back to local SSE
  @  -128   -> Sent via SSE to  receivers
  @   -64 No GUI transport available (SSE channel not initialized)startingsrc\core\ipc_messenger.rs
  @   +96 Failed to serialize message: 
  @  +144 Failed to write to stdin: 
  @  +240 Channel closed for 
  @  +280 Response message_id mismatch for 
  @  +384 src\core\process.rs
  @  +456 :TcpIpcMessengersrc\core\tcp_ipc_messenger.rs (id:  - Sending message: 
  @  +600 Message sent successfully: 
  @  +680 Failed to write to TCP stream: 
  @  +728 Making request: , no timeout)
  @  +808 , timeout: ms)
  @  +936 Channel closed while waiting for response: 
  @ +1032 Response message_id mismatch: expected , got 
  @ +1112 Response message_id mismatchReceived response for request: 
  @ +1224 Request timeout: 
  @ +1312 runningstalledexitedstoppingsrc\frp_client.rs
  @ +1384 all branches are disabled and there is no else branch
  @ +1456 src\ide\ide_protocol_client.rs
  @ +1536 getDiffgetFileAtHeadgetFileAtIndexsaveFileopenFiledeleteFileshowFilegetCurrentFilegetCursorPositiongetWorkspaceDirsgetProjectRootgetBranchgetGitBranchesgetTagscopyTextshowToastisWorkspaceRemoteisTelemetryEnabledgetFilesB...(+262)
  -- fragments --
    · Auth flow failed:
    · failed
    · accessToken
    · didChangeControlPlaneSessionInfoNo auth flow in progress to canceldevice-flow-cancelled
    · didChangeControlPlaneSessionInfoNo
    · progress
    · canceldevice
    · cancelled
    · device-flow-failedDevice authorization request has expiredexpired
    · device
    · failedDevice
    · authorization
    · request
    · expiredexpired
    · defaultcompletion
    · send_to_gui_internal:
    · send_to_gui_internal
    · donestreamFinished: session_id=, body_len=, from_mobile=
    · donestreamFinished
    · session_id
    · body_len
    · from_mobile
    · Push...
    · machineId
    · &codely-mobile://session?
    · codely
    · mobile
    · session
    · task_completedtask_confirmationFailed to send push:
    · confirmationFailed
    · continueSessionIdmessageOptions
    · This session is currently controlled from another Codely view (stream
    · currently
    · controlled
    · another
    · stream
    · No active stream to joinjoinExistingStreamOnlylastAppliedSeq
    · active
    · joinjoinExistingStreamOnlylastAppliedSeq
    · redeliver_pending_acp_requests: re-dispatching  pending ACP request(s)
    · redeliver_pending_acp_requests
    · dispatching
    · pending
    · redeliver_pending_acp_requests: failed to re-dispatch messageId=
    · dispatch
    · messageId
    · -> Routed to workspace  via SSE
    · workspace
    · -> workspaceId  not found, falling back to local SSE
    · workspaceId
    · found
    · falling
    · local
    · -> Sent via SSE to  receivers
    · receivers
    · No GUI transport available (SSE channel not initialized)starting
    · transport
    · available
    · channel
    · initialized
    · starting
    · src\core\ipc_messenger.rs
    · ipc_messenger
    · core\ipc_messenger.rs
    · Failed to serialize message:
    · serialize
    · message
    · Failed to write to stdin:
    · write
    · stdin
    · Channel closed for
    · closed
    · Response message_id mismatch for
    · message_id
    · mismatch
    · src\core\process.rs
    · process
    · core\process.rs
    · :TcpIpcMessenger
    · cpIpcMessenger
    · src\core\tcp_ipc_messenger.rs (id:  - Sending message:
    · tcp_ipc_messenger
    · core\tcp_ipc_messenger.rs (id:  - Sending message:
    · Message sent successfully:
    · successfully
    · Failed to write to TCP stream:
    · Making request: , no timeout)
    · timeout
    · , timeout: ms)
    · Channel closed while waiting for response:
    · while
    · waiting
    · response
    · Response message_id mismatch: expected , got
    · expected
    · Response message_id mismatchReceived response for request:
    · mismatchReceived
    · Request timeout:
    · runningstalledexitedstopping
    · src\frp_client.rs
    · frp_client
    · frp_client.rs
    · all branches are disabled and there is no else branch
    · branches
    · disabled
    · there
    · branch
    · src\ide\ide_protocol_client.rs
    · ide_protocol_client
    · ide\ide_protocol_client.rs
```
