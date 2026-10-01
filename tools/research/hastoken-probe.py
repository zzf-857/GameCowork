import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\assets\registry-BL-NPVNy.js", encoding="utf8", errors="ignore").read()

ms = list(re.finditer(r"hasToken", s))
print("hasToken 总数:", len(ms))
for m in ms[:10]:
    print("=== @", m.start())
    print("   ", s[max(0, m.start()-280):m.end()+280].replace("\n", " ")[:520])
    print()
