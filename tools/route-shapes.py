import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\index-DG7m4Xaq.js", encoding="utf8", errors="ignore").read()

for route in ["api/tauri/status", "api/tauri/workspace-dir", "api/tauri/init-workspace",
              "api/tauri/recent-projects", "api/tauri/window-state", "api/tauri/pick-folder",
              "api/tauri/terminal", "api/tauri/hub"]:
    ms = list(re.finditer(re.escape(route), s))
    print(f"===== {route}: {len(ms)} 处")
    for m in ms[:2]:
        print("   ", s[max(0, m.start()-160):m.end()+260].replace("\n", " ")[:400])
        print()
