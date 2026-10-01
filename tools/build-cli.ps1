[CmdletBinding()]
param([string]$OutputDirectory, [string]$GuardFile)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$tempRoot = [IO.Path]::GetFullPath('F:\AI\AgentMake\temp\GameCowork')
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $tempRoot ('cli-build-' + [guid]::NewGuid()) }
$outputRoot = [IO.Path]::GetFullPath($OutputDirectory)
if (-not $outputRoot.StartsWith($tempRoot.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'CLI build output must be inside the dedicated GameCowork temporary area.' }
if (Test-Path -LiteralPath $outputRoot) { throw 'Use a fresh CLI build output directory; existing output is preserved.' }
$source = Join-Path $projectRoot 'restored\cli-gamecowork\cli-main.beautified.js'
$resources = Join-Path $projectRoot 'restored\cli-gamecowork\resources'
if (-not (Test-Path -LiteralPath (Join-Path $resources 'restore-manifest.json'))) { throw 'Run tools/extract-cli-text-assets.mjs first or restore the checked-in resources.' }
$bunCommand = Get-Command bun -ErrorAction Stop
New-Item -ItemType Directory -Path $outputRoot | Out-Null
$entry = Join-Path $outputRoot 'cli-entry.cjs'
& node (Join-Path $PSScriptRoot 'restore-cli-entry.mjs') --source $source --output $entry
if ($LASTEXITCODE -ne 0) { throw 'CLI entry restoration failed.' }
if ($GuardFile) {
    $guardPath = [IO.Path]::GetFullPath($GuardFile)
    if (-not (Test-Path -LiteralPath $guardPath)) { throw 'CLI test guard file not found.' }
    $literal = ConvertTo-Json -InputObject $guardPath -Compress
    $body = [IO.File]::ReadAllText($entry)
    [IO.File]::WriteAllText($entry, "require($literal);`n" + $body, [Text.UTF8Encoding]::new($false))
}
& node --check $entry
if ($LASTEXITCODE -ne 0) { throw 'Generated CLI entry syntax check failed.' }
$exe = Join-Path $outputRoot 'gamecowork.exe'
& $bunCommand.Source build --compile $entry --outfile $exe
if ($LASTEXITCODE -ne 0) { throw 'Bun CLI compilation failed.' }
Copy-Item -LiteralPath $resources -Destination $outputRoot -Recurse
$bunVersion = (& $bunCommand.Source --version | Out-String).Trim()
$manifest = [ordered]@{
    name = 'GameCowork CLI'; version = '1.0.0-release.57'; compiler = "Bun $bunVersion"
    sourceSha256 = (Get-FileHash -LiteralPath $source).Hash
    entrySha256 = (Get-FileHash -LiteralPath $entry).Hash
    executableSha256 = (Get-FileHash -LiteralPath $exe).Hash
    resourceDirectory = 'resources'; testGuardIncluded = [bool]$GuardFile
}
[IO.File]::WriteAllText((Join-Path $outputRoot 'cli-package-manifest.json'), ($manifest | ConvertTo-Json -Depth 4), [Text.UTF8Encoding]::new($false))
Write-Output "CLI package prepared: $outputRoot"
Write-Output "Test guard included: $([bool]$GuardFile)"
