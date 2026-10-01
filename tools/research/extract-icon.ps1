Add-Type -AssemblyName System.Drawing
$i = [System.Drawing.Icon]::ExtractAssociatedIcon('E:\TuanjieCodely\EXE\Tuanjie Cowork\cowork.exe')
$i.ToBitmap().Save('F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\src-tauri\icons\exe-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host 'icon extracted'
