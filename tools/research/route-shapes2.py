import re, io, sys, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
routes = ["workspace-dir", "init-workspace", "recent-projects", "pick-folder", "file-explorer", "terminal", "hub", "unity-insight", "window-bridge", "download-url", "local-file-content", "window-state"]
seen = {r: 0 for r in routes}
for f in glob.glob(base + r"\**\*.js", recursive=True) + [base + r"\gui.html", base + r"\windowBridge.html"]:
    try:
        s = open(f, encoding="utf8", errors="ignore").read()
    except Exception:
        continue
    for r in routes:
        for m in list(re.finditer("api/tauri/" + r, s))[:1]:
            ctx = s[max(0, m.start()-150):m.end()+280].replace("\n", " ")
            print(f"===== [{r}] {f.split(chr(92))[-1]}")
            print("   ", ctx[:420])
            print()
            seen[r] += 1
print(seen)
