[CmdletBinding()]
param([switch]$SkipBrowser, [switch]$RealCore, [switch]$Chat, [switch]$Editor, [string]$AgentTestPackage, [string]$TuanjieEditor)
$ErrorActionPreference = 'Stop'
if ($TuanjieEditor -and (-not $Editor -or $SkipBrowser)) { throw '-TuanjieEditor requires -Editor with browser verification enabled.' }
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
& node (Join-Path $PSScriptRoot 'check-layout.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Repository layout checks failed' }
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
        $AgentTestPackage = Join-Path 'F:\AI\AgentMake\temp\GameCowork' ('verification-cli-' + [guid]::NewGuid())
        & (Join-Path $PSScriptRoot 'build-cli.ps1') -OutputDirectory $AgentTestPackage -GuardFile (Join-Path $projectRoot 'tests\fixtures\cli-probe-guard.cjs')
        if ($LASTEXITCODE -ne 0) { throw 'Guarded verification Agent build failed' }
    }
    $testManifest = Get-Content -LiteralPath (Join-Path $AgentTestPackage 'cli-package-manifest.json') -Raw | ConvertFrom-Json
    if ($testManifest.testGuardIncluded -isnot [bool] -or $testManifest.testGuardIncluded -ne $true) { throw 'Verification requires a guarded test Agent.' }
    if ($testManifest.sourceSha256 -ne (Get-FileHash -LiteralPath (Join-Path $projectRoot 'src\agent\cli-main.beautified.js')).Hash) { throw 'Test Agent source is stale; build a fresh guarded package.' }
    if ($testManifest.executableSha256 -ne (Get-FileHash -LiteralPath (Join-Path $AgentTestPackage 'gamecowork.exe')).Hash) { throw 'Test Agent executable does not match its build manifest.' }
    if ($testManifest.entrySha256 -ne (Get-FileHash -LiteralPath (Join-Path $AgentTestPackage 'cli-entry.cjs')).Hash) { throw 'Test Agent entry does not match its build manifest.' }
    $entryCheckRoot = Join-Path 'F:\AI\AgentMake\temp\GameCowork' ('verification-entry-' + [guid]::NewGuid())
    New-Item -ItemType Directory -Path $entryCheckRoot | Out-Null
    $expectedTestEntry = Join-Path $entryCheckRoot 'expected-guarded-cli.cjs'
    & node (Join-Path $PSScriptRoot 'restore-cli-entry.mjs') --source (Join-Path $projectRoot 'src\agent\cli-main.beautified.js') --output $expectedTestEntry
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
foreach ($script in $testScripts) {
    $arguments = @((Join-Path $projectRoot "tests\$script"))
    if ($script -eq 'e2e/terminal-e2e.mjs' -and $SkipBrowser) { $arguments += '--skip-browser' }
    if ($script -eq 'contracts/lsp-resource-contract.mjs') { $arguments += '--self-test' }
    & node @arguments
    if ($LASTEXITCODE -ne 0) { throw "Verification failed: $script" }
}
if (-not $SkipBrowser) {
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
    if (-not $SkipBrowser) {
        & node (Join-Path $projectRoot 'tests\e2e\insight-e2e.mjs') --binary (Join-Path $shellRoot 'target\debug\GameCowork.exe') --package $AgentTestPackage
        if ($LASTEXITCODE -ne 0) { throw 'Actual local index HTTP/GUI verification failed' }
    }
}
if ($Chat) {
    & node (Join-Path $projectRoot 'tests\integration\cli-runtime-smoke.mjs') --package $AgentTestPackage --prewarm
    if ($LASTEXITCODE -ne 0) { throw 'Actual CLI ACP verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\core-chat-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual host/core/Agent chat verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\cli-actions-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual Agent approval/write/command verification failed' }
    & node (Join-Path $projectRoot 'tests\integration\session-history-smoke.mjs') --package $AgentTestPackage
    if ($LASTEXITCODE -ne 0) { throw 'Actual durable session history verification failed' }
    if (-not $SkipBrowser) {
        & node (Join-Path $projectRoot 'tests\e2e\chat-e2e.mjs') --agent (Join-Path $AgentTestPackage 'gamecowork.exe') --files --marketplace
        if ($LASTEXITCODE -ne 0) { throw 'Actual GUI chat/file verification failed' }
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
