import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

# stdin 处理
for m in list(re.finditer(r"stdin", s))[:8]:
    print("--- stdin @", m.start())
    print(s[max(0, m.start()-120):m.end()+260].replace("\n", " ")[:360])
    print()

# \r 帧分割
for m in list(re.finditer(re.escape('\\r '), s))[:6]:
    print("--- \\r frame @", m.start())
    print(s[max(0, m.start()-200):m.end()+120].replace("\n", " ")[:320])
    print()
