[CmdletBinding()]
param([switch]$SkipBrowser, [switch]$RealCore, [switch]$Chat, [switch]$Editor, [string]$AgentTestPackage, [string]$TuanjieEditor)
$ErrorActionPreference = 'Stop'
if ($TuanjieEditor -and (-not $Editor -or $SkipBrowser)) { throw '-TuanjieEditor requires -Editor with browser verification enabled.' }
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
& node (Join-Path $PSScriptRoot 'check-layout.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Repository layout checks failed' }
& node (Join-Path $PSScriptRoot 'frontend/import-generator.mjs') --check
if ($LASTEXITCODE -ne 0) { throw 'Preserved Quick/History client source and host boundary verification failed' }
$shellRoot = Join-Path $projectRoot 'src\shell'
Push-Location $shellRoot
try {
    & cargo fmt --check
    if ($LASTEXITCODE -ne 0) { throw 'Rust formatting failed' }
    & cargo test --offline --locked
    if ($LASTEXITCODE -ne 0) { throw 'Rust tests failed' }
    & cargo build --offline --locked
    if ($LASTEXITCODE -ne 0) { throw 'Rust build failed' }
} finally { Pop-Location }
if ($RealCore -or $Chat -or ($Editor -and -not $SkipBrowser)) {
    if (-not $AgentTestPackage) {
        $AgentTestPackage = Join-Path 'F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work' ('verification-cli-' + [guid]::NewGuid())
        & (Join-Path $PSScriptRoot 'build-cli.ps1') -OutputDirectory $AgentTestPackage -GuardFile (Join-Path $projectRoot 'tests\fixtures\cli-probe-guard.cjs')
        if ($LASTEXITCODE -ne 0) { throw 'Guarded verification Agent build failed' }
    }
    $testManifest = Get-Content -LiteralPath (Join-Path $AgentTestPackage 'cli-package-manifest.json') -Raw | ConvertFrom-Json
    if ($testManifest.testGuardIncluded -isnot [bool] -or $testManifest.testGuardIncluded -ne $true) { throw 'Verification requires a guarded test Agent.' }
    if ($testManifest.sourceSha256 -ne (Get-FileHash -LiteralPath (Join-Path $projectRoot 'src\agent\cli-main.beautified.js')).Hash) { throw 'Test Agent source is stale; build a fresh guarded package.' }
    if ($testManifest.executableSha256 -ne (Get-FileHash -LiteralPath (Join-Path $AgentTestPackage 'gamecowork.exe')).Hash) { throw 'Test Agent executable does not match its build manifest.' }
    if ($testManifest.entrySha256 -ne (Get-FileHash -LiteralPath (Join-Path $AgentTestPackage 'cli-entry.cjs')).Hash) { throw 'Test Agent entry does not match its build manifest.' }
    $entryCheckRoot = Join-Path 'F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work' ('verification-entry-' + [guid]::NewGuid())
    New-Item -ItemType Directory -Path $entryCheckRoot | Out-Null
    $expectedTestEntry = Join-Path $entryCheckRoot 'expected-guarded-cli.cjs'
    & node (Join-Path $PSScriptRoot 'resources/restore-agent-entry.mjs') --source (Join-Path $projectRoot 'src\agent\cli-main.beautified.js') --output $expectedTestEntry
    if ($LASTEXITCODE -ne 0) { throw 'Could not verify the guarded Agent entry.' }
    $guardLiteral = ConvertTo-Json -InputObject ([IO.Path]::GetFullPath((Join-Path $projectRoot 'tests\fixtures\cli-probe-guard.cjs'))) -Compress
    $expectedBody = [IO.File]::ReadAllText($expectedTestEntry)
    [IO.File]::WriteAllText($expectedTestEntry, "require($guardLiteral);`n" + $expectedBody, [Text.UTF8Encoding]::new($false))
    if ($testManifest.entrySha256 -ne (Get-FileHash -LiteralPath $expectedTestEntry).Hash) { throw 'Test Agent entry differs from the maintained source and expected test guard.' }
}
$testScripts = @('contracts/frontend-git-scope.test.mjs', 'contracts/frontend-workspace-close.test.mjs', 'contracts/editor-preview-size.test.mjs', 'contracts/frontend-unity-discovery-status.test.mjs', 'contracts/frontend-unity-connection.test.mjs', 'contracts/frontend-unity-connectors.test.mjs', 'contracts/frontend-unity-views.test.mjs', 'contracts/frontend-request-contract.mjs', 'contracts/frontend-file-contract.mjs', 'contracts/frontend-marketplace-contract.mjs', 'contracts/frontend-terminal-contract.mjs', 'contracts/frontend-notification-contract.mjs', 'contracts/core-user-data.test.cjs',
    'contracts/frontend-approval-contract.mjs','contracts/frontend-session-contract.mjs','contracts/frontend-stream-layout.test.cjs','contracts/editor-lifecycle-contract.mjs', 'contracts/editor-frame-identity-contract.mjs','contracts/editor-multi-source-contract.mjs','contracts/frontend-media-contract.mjs','contracts/frontend-custom-contract.mjs','contracts/frontend-settings-focus.test.cjs','contracts/native-window-contract.test.mjs','contracts/frontend-unity-passive-contract.mjs','contracts/core-custom-contract.mjs','contracts/core-custom-runner.test.cjs','contracts/core-approval-mode.test.cjs','contracts/history-contract.test.cjs','contracts/mcp-offline-discovery.test.cjs','contracts/cli-tool-guard.test.cjs',
    'contracts/unity-project-status.test.cjs', 'contracts/editor-launch.test.cjs', 'contracts/editor-engine-fixture.test.mjs', 'contracts/editor-capture-fit.test.mjs', 'contracts/frontend-editor-installations-contract.mjs', 'contracts/frontend-template-details-contract.mjs', 'contracts/core-editor-version-mapping.test.cjs', 'contracts/core-history-clear.test.cjs', 'contracts/frontend-git-contract.mjs', 'contracts/frontend-editor-control.test.mjs', 'contracts/frontend-mcp-args.test.mjs', 'contracts/frontend-mcp-focus-identity.test.mjs', 'contracts/lsp-resource-contract.mjs',
    'contracts/core-host-errors.test.cjs', 'contracts/local-model-profiles.test.cjs', 'contracts/acp-model-startup.test.cjs',
    'contracts/local-cloud-services.test.cjs', 'contracts/cli-recovery.test.cjs', 'contracts/cli-settings-merge-contract.test.cjs', 'contracts/cli-editor-control-contract.mjs', 'contracts/editor-cancel-review-contract.mjs', 'contracts/editor-cancel-state-review.mjs', 'contracts/frontend-lsp-contract.mjs', 'contracts/frontend-lsp-lifecycle-contract.mjs', 'contracts/frontend-lsp-shortcuts.test.mjs', 'contracts/frontend-approval-shortcuts.test.mjs', 'contracts/mock-provider.test.mjs', 'contracts/insight-resource-contract.test.mjs', 'contracts/insight-max-turns.test.cjs', 'integration/insight-worker-smoke.mjs',
    'integration/shell-http.mjs', 'integration/process-lifetime.mjs', 'integration/editor-lifetime.mjs', 'e2e/terminal-e2e.mjs')
$testScripts += @('contracts/frontend-history-operations-contract.mjs', 'contracts/core-history-rewind.test.cjs', 'contracts/cli-rewind-preview.test.cjs', 'contracts/editor-scene-query-contract.mjs', 'contracts/core-command-bootstrap.test.cjs', 'contracts/frontend-startup-messenger-contract.mjs', 'contracts/editor-console-contract.mjs', 'integration/single-instance.mjs')
$testScripts += @('contracts/frontend-editor-licensing-contract.mjs', 'contracts/frontend-template-warnings-contract.mjs', 'contracts/unity-hub-reference-extraction.test.mjs', 'integration/hub-refresh.mjs')
$testScripts += @('contracts/cli-unity-operations.test.mjs', 'contracts/editor-context-contract.mjs', 'contracts/editor-context-implementation-contract.mjs', 'contracts/editor-asset-package-contract.mjs', 'contracts/editor-scene-mutation-contract.mjs')
# The owned REST service still backs real cached tasks and media. Keep its
# contracts; the inactive generic-only frontend is not the product UI gate.
$testScripts += @('contracts/core-hub-discovery.test.cjs', 'contracts/frontend-project-recency.test.mjs', 'contracts/frontend-editor-installations-cache.test.mjs', 'contracts/asset-generation-auth.test.mjs', 'contracts/asset-generation-adapter.test.mjs', 'contracts/asset-generation-lifecycle.test.mjs', 'contracts/asset-generation-idempotency.test.mjs', 'contracts/asset-generation-large-output.test.mjs', 'contracts/asset-generation-inputs.test.mjs', 'contracts/asset-generation-policy.test.mjs', 'contracts/asset-generation-owner.test.cjs', 'integration/editor-installations-cache.mjs', 'integration/asset-generation-service-smoke.mjs')
$testScripts += @('contracts/codely-generator-local-identity.test.mjs', 'contracts/codely-canvas-source-contract.mjs', 'contracts/codely-sidebar-canvas-contract.mjs', 'contracts/codely-download-contract.mjs', 'contracts/codely-generator-api.test.mjs', 'contracts/codely-generator-upload.test.mjs', 'contracts/codely-media-rebase.test.mjs', 'contracts/codely-local-models.test.mjs', 'contracts/codely-cpa-generation.test.mjs')
$testScripts += @('contracts/codely-account-broker.test.mjs', 'contracts/codely-account-wiring.test.mjs', 'contracts/codely-account-official-surface.test.mjs', 'contracts/codely-account-frontend.test.mjs', 'contracts/codely-account-timeout.test.mjs')
$testScripts += @('contracts/codely-official-generator-broker.test.mjs', 'contracts/codely-official-assets.test.mjs', 'contracts/codely-official-generator-api.test.mjs', 'contracts/codely-official-generator-validation.test.mjs', 'contracts/codely-official-programming.test.cjs')
$testScripts += @('contracts/codely-official-image-models.test.mjs', 'contracts/codely-official-video-3d-models.test.mjs', 'contracts/codely-official-audio-text-models.test.cjs', 'contracts/codely-extra-image-media.test.cjs', 'contracts/model-media.test.cjs', 'contracts/codely-audio-media.test.cjs', 'contracts/codely-all-model-readiness.test.mjs', 'contracts/codely-hdr-media.test.cjs', 'contracts/codely-jpeg-media.test.cjs', 'contracts/codely-account-display.test.cjs', 'contracts/codely-account-display-frontend.test.mjs', 'contracts/codely-official-task-output.test.cjs', 'contracts/codely-assets-persistence.test.cjs', 'contracts/codely-official-known-task-resume.test.cjs', 'contracts/codely-generator-diagnostics.test.mjs', 'contracts/codely-official-task-reconciliation.test.cjs')
$testScripts += @('contracts/codely-quick-audio-preview.test.mjs')
$testScripts += @('contracts/codely-cpa-image-models.test.cjs', 'contracts/asset-generation-cpa-profile.test.mjs', 'contracts/asset-generation-template-parameters.test.mjs')
$testScripts += @('contracts/asset-generation-cpa-reported-image.test.mjs')
$testScripts += @('contracts/provider-catalog.test.cjs', 'contracts/provider-vault.test.cjs', 'contracts/provider-registry.test.mjs', 'contracts/codely-custom-provider-ui.test.mjs')
$testScripts += @('contracts/codely-official-parameter-matrix.test.mjs', 'contracts/codely-video-media.test.cjs', 'contracts/codely-artifact-roles.test.mjs', 'contracts/core-chat-harness.test.cjs')
$testScripts += @('contracts/asset-generation-transport-diagnostic.test.mjs', 'contracts/codely-task-outcome.test.mjs', 'contracts/codely-task-outcome-ui.test.mjs')
$testScripts += @('contracts/package-retired-resource.test.mjs')
$testScripts += @('contracts/frontend-chat-model-menu.test.mjs')
$testScripts += @('contracts/codely-official-model-menu.test.cjs')
foreach ($script in $testScripts) {
    $arguments = @((Join-Path $projectRoot "tests\$script"))
    if ($script -eq 'e2e/terminal-e2e.mjs' -and $SkipBrowser) { $arguments += '--skip-browser' }
    if ($script -eq 'contracts/lsp-resource-contract.mjs') { $arguments += '--self-test' }
    & node @arguments
    if ($LASTEXITCODE -ne 0) { throw "Verification failed: $script" }
}
if (-not $SkipBrowser) {
    & node (Join-Path $projectRoot 'tests\e2e\codely-quick-audio-preview-e2e.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Original Quick audio preview and playback verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-installations-cache.mjs') --browser
    if ($LASTEXITCODE -ne 0) { throw 'Editor cache/restart browser verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-installations-cache.mjs') --browser --previous
    if ($LASTEXITCODE -ne 0) { throw 'Previous Editor cache/restart browser verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\monaco-menu-e2e.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Actual Monaco menu activation verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\project-panel-e2e.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Project panel browser verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\editor-view-discovery-e2e.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Unity streaming connector browser verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\editor-view-discovery-e2e.mjs') --previous
    if ($LASTEXITCODE -ne 0) { throw 'Previous Unity streaming connector browser verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\editor-view-discovery-e2e.mjs') --unknown-metadata
    if ($LASTEXITCODE -ne 0) { throw 'Unity unidentified-project streaming discovery failed' }
    & node (Join-Path $projectRoot 'tests\e2e\editor-view-discovery-e2e.mjs') --unknown-metadata --previous
    if ($LASTEXITCODE -ne 0) { throw 'Previous Unity unidentified-project streaming discovery failed' }
    & node (Join-Path $projectRoot 'tests\e2e\editor-installations-e2e.mjs') --same-version
    if ($LASTEXITCODE -ne 0) { throw 'Installed Editor panel browser verification failed' }
    foreach ($hubBrowserScript in @('e2e/editor-licensing-e2e.mjs', 'e2e/hub-project-status-e2e.mjs')) {
        & node (Join-Path $projectRoot "tests\$hubBrowserScript")
        if ($LASTEXITCODE -ne 0) { throw "Unity Hub local browser verification failed: $hubBrowserScript" }
        & node (Join-Path $projectRoot "tests\$hubBrowserScript") --previous
        if ($LASTEXITCODE -ne 0) { throw "Previous Unity Hub local browser verification failed: $hubBrowserScript" }
    }
}
$gitArguments = @((Join-Path $projectRoot 'tests\e2e\git-e2e.mjs'))
if ($SkipBrowser) { $gitArguments += '--skip-browser' }
& node @gitArguments
if ($LASTEXITCODE -ne 0) { throw 'Local Git/Diff verification failed' }
$lspArguments = @((Join-Path $projectRoot 'tests\e2e\lsp-e2e.mjs'))
if ($SkipBrowser) { $lspArguments += '--skip-browser' }
& node @lspArguments
if ($LASTEXITCODE -ne 0) { throw 'Actual C# LSP document/GUI/lifecycle verification failed' }
& node (Join-Path $projectRoot 'tests\e2e\lsp-status-e2e.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Actual C# LSP missing/restored runtime status verification failed' }
if ($RealCore) {
    & node (Join-Path $projectRoot 'tests\integration\insight-settings-scope-smoke.mjs') --binary (Join-Path $shellRoot 'target\debug\GameCowork.exe') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual Core index settings scope/persistence verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\real-core-smoke.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Isolated real core verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\codely-account-login-e2e.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Codely official account device-login verification failed' }
    if (-not $SkipBrowser) {
        & node (Join-Path $projectRoot 'tests\e2e\codely-account-login-e2e.mjs') --browser --images
        if ($LASTEXITCODE -ne 0) { throw 'Codely account original login UI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-account-login-e2e.mjs') --browser --images --previous
        if ($LASTEXITCODE -ne 0) { throw 'Previous Codely account original login UI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-all-models-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Official all-model HTTP and four-category GUI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-all-models-e2e.mjs') --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous official all-model HTTP and GUI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-cpa-flexible-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'CPA independent category, four models and flexible parameters verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-cpa-flexible-e2e.mjs') --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous CPA flexible parameters verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-cpa-flexible-e2e.mjs') --api-size-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'CPA explicit API pixel controls, history and original-byte verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-cpa-flexible-e2e.mjs') --api-size-only --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous CPA explicit API pixel controls verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-provider-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Custom Provider registry, vault, catalog and original GUI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-provider-e2e.mjs') --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous custom Provider original GUI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-provider-e2e.mjs') --rest-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Custom REST video parameters, media and history GUI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-provider-e2e.mjs') --rest-only --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous custom REST video GUI verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-provider-e2e.mjs') --transport-errors-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Custom Provider transport failure and unknown outcome verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-provider-e2e.mjs') --previous --transport-errors-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous custom Provider transport failure and unknown outcome verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\insight-e2e.mjs') --binary (Join-Path $shellRoot 'target\debug\GameCowork.exe') --package $AgentTestPackage
        if ($LASTEXITCODE -ne 0) { throw 'Actual local index HTTP/GUI verification failed' }
    }
}
if ($RealCore -or $Chat) {
    if (-not $SkipBrowser) {
        & node (Join-Path $projectRoot 'tests\e2e\codely-assets-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Preserved Quick/History/ReactFlow client browser verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-assets-e2e.mjs') --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous GUI preserved Quick/History/ReactFlow client browser verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-assets-e2e.mjs') --cpa-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Original Quick CPA image protocol verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-assets-e2e.mjs') --previous --cpa-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous original Quick CPA image protocol verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-assets-e2e.mjs') --download-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Original asset native download verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\codely-assets-e2e.mjs') --previous --download-only --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Previous original asset native download verification failed' }
    }
    & node (Join-Path $projectRoot 'tests\integration\core-command-bootstrap.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual Core/Agent command bootstrap and workspace ownership verification failed' }
}
if ($Chat) {
    & node (Join-Path $projectRoot 'tests\e2e\codely-official-programming-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
    if ($LASTEXITCODE -ne 0) { throw 'Official Pro programming GUI/Agent verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\codely-official-programming-e2e.mjs') --previous --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
    if ($LASTEXITCODE -ne 0) { throw 'Previous official Pro programming GUI/Agent verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\cli-runtime-smoke.mjs') --package $AgentTestPackage --prewarm
    if ($LASTEXITCODE -ne 0) { throw 'Actual CLI ACP verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\core-chat-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual host/core/Agent chat verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\core-chat-smoke.mjs') --package $AgentTestPackage --harness
    if ($LASTEXITCODE -ne 0) { throw 'Actual chat cancellation and terminal-frame harness verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\cli-actions-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual Agent approval/write/command verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\session-history-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual durable session history verification failed' }
    if (-not $SkipBrowser) {
        & node (Join-Path $projectRoot 'tests\e2e\chat-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --files --marketplace
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI chat/file verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\chat-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --harness
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI chat terminal-frame verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\chat-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --harness --previous
        if ($LASTEXITCODE -ne 0) { throw 'Previous GUI chat terminal-frame verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\agent-actions-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI Agent approval/actions verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\file-media-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI file/media/watcher verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-management-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI Skills/Extensions/MCP verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\custom-management-e2e.mjs') --mcp-only --stdio --mcp-focus-probe --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI stdio MCP/process lifecycle verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\command-subagent-management-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI Commands/Subagents and Agent execution verification failed' }
    }
}
if ($Editor) {
    & node (Join-Path $projectRoot 'tests\integration\editor-context-smoke.mjs') --package $AgentTestPackage --extra-queries
    if ($LASTEXITCODE -ne 0) { throw 'Actual Editor context and model query verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-asset-package-smoke.mjs') --graphics
    if ($LASTEXITCODE -ne 0) { throw 'Actual native asset preview and loaded package verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-scene-mutations-smoke.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Actual scene/object mutation, Undo, save and cancellation verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-scene-mutations-agent-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual model-issued scene/object edit approval and effect verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-console-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual Unity Console read/approval/cancellation verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-scene-queries-smoke.mjs') --package $AgentTestPackage --issued-tools
    if ($LASTEXITCODE -ne 0) { throw 'Actual Unity scene/object query and Agent consumer verification failed' }
    & node (Join-Path $projectRoot 'tests\e2e\lsp-unity-e2e.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Actual Unity-generated classic C# project LSP verification failed' }
    $genericArguments = @((Join-Path $projectRoot 'tests\e2e\editor-generic-host-e2e.mjs'))
    if (-not $SkipBrowser) { $genericArguments += '--browser' }
    & node @genericArguments
    if ($LASTEXITCODE -ne 0) { throw 'Actual complete EditorWindow capture/input/lifetime verification failed' }
    $bridgeArguments = @((Join-Path $projectRoot 'tests\integration\editor-bridge-smoke.mjs'))
    if ($SkipBrowser) { $bridgeArguments += '--skip-browser' }
    & node @bridgeArguments
    if ($LASTEXITCODE -ne 0) { throw 'Actual isolated Editor render/input verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\editor-bridge-multistream.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Actual independent Editor streams verification failed' }
    if (-not $SkipBrowser) {
        # The 17-check reload harness contains the default 13-check product
        # flow, so running the default harness again would duplicate it.
        foreach ($editorScript in @('e2e/editor-generic-product-e2e.mjs', 'e2e/editor-domain-reload-e2e.mjs', 'e2e/editor-multi-project-ui.mjs', 'e2e/editor-control-e2e.mjs')) {
            $editorArguments = @((Join-Path $projectRoot "tests\$editorScript"))
            if ($editorScript -eq 'e2e/editor-generic-product-e2e.mjs') {
                $editorArguments += @('--connector-entry', '--viewport-width', '2560', '--viewport-height', '1800', '--dpr', '2', '--resize-width', '1280', '--resize-height', '900')
            }
            if ($AgentTestPackage) { $editorArguments += @('--agent', (Join-Path $AgentTestPackage 'gamecowork.exe')) }
            & node @editorArguments
            if ($LASTEXITCODE -ne 0) { throw "Actual product Editor verification failed: $editorScript" }
        }
        & node (Join-Path $projectRoot 'tests\integration\cli-editor-controls-smoke.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --require-completed --require-cancel-no-effect --identity-gates
        if ($LASTEXITCODE -ne 0) { throw 'Actual Agent Unity completion/cancellation/identity verification failed' }
        & node (Join-Path $projectRoot 'tests\e2e\agent-editor-controls-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI Agent Editor approval/reject/cancel verification failed' }
        if ($TuanjieEditor) {
            & node (Join-Path $projectRoot 'tests\e2e\editor-generic-host-e2e.mjs') --browser --editor $TuanjieEditor
            if ($LASTEXITCODE -ne 0) { throw 'Actual Tuanjie complete EditorWindow verification failed' }
            # The driver verifies the actual executable product/version and uses
            # its native .scene fixture. The mixed gate keeps A=Unity, B=Tuanjie.
            & node (Join-Path $projectRoot 'tests\e2e\editor-preview-e2e.mjs') --editor $TuanjieEditor --engine tuanjie --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --domain-reload --reload-close
            if ($LASTEXITCODE -ne 0) { throw 'Actual Tuanjie product preview/reload verification failed' }
            & node (Join-Path $projectRoot 'tests\e2e\editor-multi-project-ui.mjs') --editor-b $TuanjieEditor --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
            if ($LASTEXITCODE -ne 0) { throw 'Actual Unity/Tuanjie single-GUI mixed-engine verification failed' }
            & node (Join-Path $projectRoot 'tests\e2e\editor-control-e2e.mjs') --editor $TuanjieEditor --agent (Join-Path $AgentTestPackage 'gamecowork.exe')
            if ($LASTEXITCODE -ne 0) { throw 'Actual Tuanjie Editor/GUI basic control verification failed' }
            & node (Join-Path $projectRoot 'tests\integration\cli-editor-controls-smoke.mjs') --editor $TuanjieEditor --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --require-completed --require-cancel-no-effect --identity-gates
            if ($LASTEXITCODE -ne 0) { throw 'Actual Agent Tuanjie completion/cancellation/identity verification failed' }
        }
    }
}
