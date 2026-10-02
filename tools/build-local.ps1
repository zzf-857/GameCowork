[CmdletBinding()]
param(
    [ValidateSet('Debug', 'Release')][string]$Configuration = 'Release',
    [string]$OutputDirectory,
    [string]$CliPackageDirectory,
    [switch]$SkipTests
)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
& node (Join-Path $PSScriptRoot 'check-layout.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Repository layout checks failed' }
& node (Join-Path $PSScriptRoot 'import-codely-generator.mjs') --check
if ($LASTEXITCODE -ne 0) { throw 'Preserved Quick/History source integrity checks failed.' }
& node (Join-Path $PSScriptRoot 'verify-codely-canvas-source.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Preserved Canvas source integrity checks failed.' }
$shellRoot = Join-Path $projectRoot 'src\shell'
$lspSource = Join-Path $projectRoot 'vendor\csharp-lsp'
$lspResourceContract = Join-Path $projectRoot 'tests\contracts\lsp-resource-contract.mjs'
# Freeze the compiler pin, official shim/package closure and MIT notice before building.
& node $lspResourceContract --root $lspSource
if ($LASTEXITCODE -ne 0) { throw 'Frozen C# LSP source resources failed integrity checks.' }
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $projectRoot 'app' }
$outputRoot = [IO.Path]::GetFullPath($OutputDirectory)
$taskRoot = Join-Path 'F:\AI\AgentMake\temp\GameCowork\build' ([Guid]::NewGuid().ToString('N'))
$stagingRoot = Join-Path $taskRoot 'staging'
New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null

Push-Location $shellRoot
try {
    if (-not $SkipTests) {
        & cargo test --offline --locked
        if ($LASTEXITCODE -ne 0) { throw 'Rust tests failed' }
        & node (Join-Path $projectRoot 'tests\contracts\frontend-request-contract.mjs')
        if ($LASTEXITCODE -ne 0) { throw 'Frontend contract tests failed' }
    }
    $buildArgs = @('build', '--offline', '--locked')
    if ($Configuration -eq 'Release') { $buildArgs += '--release' }
    & cargo @buildArgs
    if ($LASTEXITCODE -ne 0) { throw 'Shell build failed' }
} finally { Pop-Location }

$profile = $Configuration.ToLowerInvariant()
$shellBinary = Join-Path $shellRoot "target\$profile\GameCowork.exe"
Copy-Item -LiteralPath $shellBinary -Destination (Join-Path $stagingRoot 'GameCowork.exe')
$frontendSource = Join-Path $projectRoot 'src\frontend\bundle'
$coreSource = Join-Path $projectRoot 'src\core\binary\out'
New-Item -ItemType Directory -Path (Join-Path $stagingRoot 'frontend'), (Join-Path $stagingRoot 'core') -Force | Out-Null
Copy-Item -Path (Join-Path $frontendSource '*') -Destination (Join-Path $stagingRoot 'frontend') -Recurse
$bridgeSource = Join-Path $projectRoot 'src\editor-bridge'
if (Test-Path -LiteralPath (Join-Path $bridgeSource 'package.json')) {
    Copy-Item -LiteralPath $bridgeSource -Destination $stagingRoot -Recurse
}
$insightSource = Join-Path $projectRoot 'src\unity-insight'
if (-not (Test-Path -LiteralPath (Join-Path $insightSource 'bundle\gamecowork-worker-entry.mjs'))) { throw 'Missing restored local Unity Insight worker entry.' }
New-Item -ItemType Directory -Path (Join-Path $stagingRoot 'unity-insight') -Force | Out-Null
foreach ($item in @('package.json','bundle','resources')) {
    Copy-Item -LiteralPath (Join-Path $insightSource $item) -Destination (Join-Path $stagingRoot 'unity-insight') -Recurse
}
# The official dotnet-tool shim uses its relative .store tree; keep all 298 files.
$lspStaging = Join-Path $stagingRoot 'lsp-csharp'
New-Item -ItemType Directory -Path $lspStaging -Force | Out-Null
foreach ($item in @('runtime','dependency-ledger.json','dependency-ledger.sha256','LICENSE','README.md')) {
    Copy-Item -LiteralPath (Join-Path $lspSource $item) -Destination $lspStaging -Recurse
}
& node $lspResourceContract --root $lspStaging
if ($LASTEXITCODE -ne 0) { throw 'Staged C# LSP resources failed integrity checks.' }
foreach ($item in Get-ChildItem -LiteralPath $coreSource -Force) {
    if ($item.Extension -eq '.log') { continue }
    Copy-Item -LiteralPath $item.FullName -Destination (Join-Path $stagingRoot 'core') -Recurse
}
# Node is a redistributable runtime. Reuse this application's runtime, never the original Agent CLI.
$runtimeSource = Join-Path $projectRoot 'app\core\gamecowork-runtime.exe'
if (-not (Test-Path -LiteralPath $runtimeSource -PathType Leaf)) {
    throw 'Missing GameCowork Node runtime. Preserve app/core/gamecowork-runtime.exe before rebuilding.'
}
Copy-Item -LiteralPath $runtimeSource -Destination (Join-Path $stagingRoot 'core\gamecowork-runtime.exe')

# Build the restored CJS factory into our Agent. Guarded verification artifacts
# are explicitly excluded from user packages.
if (-not $CliPackageDirectory) {
    $CliPackageDirectory = Join-Path $taskRoot 'cli'
    & (Join-Path $PSScriptRoot 'build-cli.ps1') -OutputDirectory $CliPackageDirectory
}
$cliRoot = [IO.Path]::GetFullPath($CliPackageDirectory)
$cliManifest = Get-Content -LiteralPath (Join-Path $cliRoot 'cli-package-manifest.json') -Raw | ConvertFrom-Json
if ($cliManifest.testGuardIncluded -isnot [bool] -or $cliManifest.testGuardIncluded -ne $false) { throw 'A product Agent must explicitly declare the Boolean testGuardIncluded=false.' }
$cliSource = Join-Path $projectRoot 'src\agent\cli-main.beautified.js'
if ($cliManifest.sourceSha256 -ne (Get-FileHash -LiteralPath $cliSource).Hash) { throw 'Agent package was built from a different source revision.' }
$expectedEntry = Join-Path $taskRoot 'expected-product-cli.cjs'
& node (Join-Path $PSScriptRoot 'restore-cli-entry.mjs') --source $cliSource --output $expectedEntry
if ($LASTEXITCODE -ne 0) { throw 'Could not verify the normal Agent entry.' }
if ($cliManifest.entrySha256 -ne (Get-FileHash -LiteralPath $expectedEntry).Hash) { throw 'Agent entry differs from the normal restored source; guarded or altered entries cannot be assembled.' }
$cliExecutable = Join-Path $cliRoot 'gamecowork.exe'
if ($cliManifest.executableSha256 -ne (Get-FileHash -LiteralPath $cliExecutable).Hash) { throw 'Agent executable hash does not match its build manifest.' }
New-Item -ItemType Directory -Path (Join-Path $stagingRoot 'cli') -Force | Out-Null
Copy-Item -LiteralPath $cliExecutable -Destination (Join-Path $stagingRoot 'cli\gamecowork.exe')
Copy-Item -LiteralPath (Join-Path $cliRoot 'resources') -Destination (Join-Path $stagingRoot 'cli') -Recurse
Copy-Item -LiteralPath (Join-Path $cliRoot 'cli-package-manifest.json') -Destination (Join-Path $stagingRoot 'cli')

$runtimeFiles = @(Get-ChildItem -LiteralPath $stagingRoot -Recurse -File | ForEach-Object {
    [ordered]@{
        path = [IO.Path]::GetRelativePath($stagingRoot, $_.FullName).Replace('\', '/')
        sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
        size = $_.Length
    }
})
$manifest = [ordered]@{
    product = 'GameCowork'
    version = '2.1.3-canary.2'
    shell = 'wry-axum'
    configuration = $Configuration
    builtAtUtc = [DateTime]::UtcNow.ToString('o')
    sourceRevision = (& git -C $projectRoot rev-parse HEAD).Trim()
    sourceHasChanges = [bool](& git -C $projectRoot status --porcelain)
    files = $runtimeFiles
}
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $stagingRoot 'package-manifest.json') -Encoding utf8

$targetExe = Join-Path $outputRoot 'GameCowork.exe'
$running = @(Get-CimInstance Win32_Process -Filter "Name='GameCowork.exe'" | Where-Object {
    $_.ExecutablePath -and ([IO.Path]::GetFullPath($_.ExecutablePath) -eq $targetExe)
})
if ($running.Count -gt 0) {
    throw "GameCowork is running from $outputRoot. Prepared package is at $stagingRoot; close that window before updating."
}
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$backupRoot = Join-Path $taskRoot 'previous-binaries'
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
foreach ($relative in @('GameCowork.exe', 'core\index.js', 'cli\gamecowork.exe', 'package-manifest.json')) {
    $existing = Join-Path $outputRoot $relative
    if (Test-Path -LiteralPath $existing -PathType Leaf) {
        $backup = Join-Path $backupRoot $relative
        New-Item -ItemType Directory -Path (Split-Path -Parent $backup) -Force | Out-Null
        Copy-Item -LiteralPath $existing -Destination $backup
    }
}
# Update only assembled program resources. User state and workspace.txt are preserved.
Copy-Item -Path (Join-Path $stagingRoot '*') -Destination $outputRoot -Recurse -Force
foreach ($entry in $runtimeFiles) {
    $path = Join-Path $outputRoot $entry.path
    if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash -ne $entry.sha256) {
        throw "Package verification failed: $($entry.path)"
    }
}
Write-Output "Verified $($runtimeFiles.Count) runtime files in $outputRoot"
Write-Output "Build artifacts and previous binaries: $taskRoot"
