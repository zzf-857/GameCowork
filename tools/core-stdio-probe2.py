import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

# core 自身 stdin 监听
hits = 0
for m in re.finditer(r"process\.stdin", s):
    ctx = s[max(0, m.start()-150):m.end()+200].replace("\n", " ")
    print("--- process.stdin @", m.start(), "\n   ", ctx[:330], "\n")
    hits += 1
    if hits >= 6: break

# \r 帧写读
for m in list(re.finditer(r"\+ ['\"]\\\\r ['\"]|['\"]\\\\r ['\"]", s))[:8]:
    print("--- frame-write @", m.start(), "\n   ", s[max(0, m.start()-180):m.end()+80].replace("\n", " ")[:260], "\n")
