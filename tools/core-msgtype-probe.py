import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

ms = list(re.finditer(r"messageType", s))
print("messageType 总数:", len(ms))
# 找分发处: switch/if on messageType
for m in ms[:10]:
    print("--- @", m.start())
    print("   ", s[max(0, m.start()-140):m.end()+140].replace("\n", " ")[:280])
