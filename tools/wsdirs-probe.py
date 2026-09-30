import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

ms = list(re.finditer(r"getWorkspaceDirs", s))
print("总数:", len(ms))
for m in ms[:8]:
    print("=== @", m.start())
    print("   ", s[max(0, m.start()-300):m.end()+300].replace("\n", " ")[:560])
    print()
