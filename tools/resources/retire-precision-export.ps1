[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$OutputDirectory,
    [Parameter(Mandatory)][string]$PreparedManifest,
    [Parameter(Mandatory)][string]$BackupDirectory
)
$ErrorActionPreference = 'Stop'
$relative = 'frontend/codely-generator/precision-export.js'
$outputRoot = [IO.Path]::GetFullPath($OutputDirectory).TrimEnd('\', '/')
$backupRoot = [IO.Path]::GetFullPath($BackupDirectory).TrimEnd('\', '/')
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$workRoot = [IO.Path]::GetFullPath((Join-Path $projectRoot 'codelyreversebackup\work')).TrimEnd('\', '/')
$workPrefix = $workRoot + [IO.Path]::DirectorySeparatorChar
if (-not $backupRoot.StartsWith($workPrefix, [StringComparison]::OrdinalIgnoreCase) -or
    [IO.Path]::GetFileName($backupRoot) -ne 'previous-binaries') {
    throw 'Retired resource backup must be in the dedicated work/previous-binaries directory.'
}
$outputPrefix = $outputRoot + [IO.Path]::DirectorySeparatorChar
if ($backupRoot -eq $outputRoot -or $backupRoot.StartsWith($outputPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Retired resource backups must be outside the package being updated.'
}
function Assert-PlainPath([string]$Value) {
    for ($directory = [IO.Path]::GetFullPath($Value); $directory; $directory = [IO.Path]::GetDirectoryName($directory)) {
        if (Test-Path -LiteralPath $directory) {
            $item = Get-Item -LiteralPath $directory -Force
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
                throw 'Retired resource path contains a reparse point.'
            }
        }
    }
}
function Retained([string]$Reason) {
    Write-Warning "Retained obsolete $relative : $Reason"
    return [pscustomobject]@{ path = $relative; removed = $false; reason = $Reason }
}
$target = [IO.Path]::GetFullPath((Join-Path $outputRoot $relative))
if (-not $target.StartsWith($outputPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Retired resource escaped the package directory.'
}
if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { return [pscustomobject]@{ path = $relative; removed = $false; reason = 'absent' } }
try {
    Assert-PlainPath $outputRoot
    Assert-PlainPath $target
    $oldManifest = Join-Path $outputRoot 'package-manifest.json'
    Assert-PlainPath $oldManifest
    if (-not (Test-Path -LiteralPath $oldManifest -PathType Leaf)) { return Retained 'no previous package manifest' }
    $previous = Get-Content -LiteralPath $oldManifest -Raw | ConvertFrom-Json
    $current = Get-Content -LiteralPath $PreparedManifest -Raw | ConvertFrom-Json
    if ($previous.product -ne 'GameCowork' -or $current.product -ne 'GameCowork' -or
        $previous.files -isnot [Array] -or $current.files -isnot [Array]) { return Retained 'unrecognized package manifest' }
    # Exact approved relative path only. Manifest paths never become delete paths.
    if (@($current.files | Where-Object { $_.path -is [string] -and $_.path -eq $relative }).Count) { return Retained 'resource remains in the prepared package' }
    $owned = @($previous.files | Where-Object { $_.path -is [string] -and $_.path -eq $relative })
    if ($owned.Count -ne 1 -or $owned[0].sha256 -isnot [string] -or $owned[0].sha256 -notmatch '^[a-fA-F0-9]{64}$') {
        return Retained 'previous manifest does not uniquely own this resource'
    }
    $expected = $owned[0].sha256
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $expected) { return Retained 'resource bytes changed since the previous package' }
    Assert-PlainPath $backupRoot
    $backup = [IO.Path]::GetFullPath((Join-Path $backupRoot $relative))
    if (-not $backup.StartsWith($backupRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Retired backup escaped its owner.' }
    Assert-PlainPath $backup
    if (Test-Path -LiteralPath $backup) { return Retained 'retired resource backup already exists' }
    New-Item -ItemType Directory -Path (Split-Path -Parent $backup) -Force | Out-Null
    Assert-PlainPath $target
    Assert-PlainPath $backup
    Copy-Item -LiteralPath $target -Destination $backup -ErrorAction Stop
    if ((Get-FileHash -LiteralPath $backup -Algorithm SHA256).Hash -ne $expected) { return Retained 'backup bytes did not match the previous package' }
    # Recheck after backup: a changed file or replaced directory is preserved.
    Assert-PlainPath $target
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $expected) { return Retained 'resource changed while preparing the backup' }
    Remove-Item -LiteralPath $target -ErrorAction Stop
    return [pscustomobject]@{ path = $relative; removed = $true; backup = $backup; sha256 = $expected }
} catch {
    return Retained 'path or backup verification failed; file was preserved'
}
