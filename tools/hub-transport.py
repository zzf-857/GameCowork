import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\assets\TJHubRoute-D42CgVct.js", encoding="utf8", errors="ignore").read()

# 找 request 方法定义(类/闭包)
for m in list(re.finditer(r"async request\(", s))[:4]:
    print("--- request def @", m.start())
    print(s[max(0, m.start()-350):m.end()+500].replace("\n", " ")[:800])
    print()
