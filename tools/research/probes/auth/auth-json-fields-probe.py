import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

for m in list(re.finditer(r"auth\.json", s))[:8]:
    print("=== @", m.start())
    print("   ", s[max(0, m.start()-350):m.end()+350].replace("\n", " ")[:600])
    print()
