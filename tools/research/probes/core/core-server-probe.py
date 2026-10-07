import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

print("=== argv 使用(端口相关) ===")
for m in list(re.finditer(r"process\.argv[^;]{0,100}", s))[:10]:
    print("  ", m.group(0).replace("\n", " ")[:150])

print()
print("=== 动态端口 listen ===")
for m in list(re.finditer(r"\.listen\(0\b[^)]{0,40}\)", s))[:6]:
    print("  ", s[max(0, m.start()-200):m.end()+150].replace("\n", " ")[:330])

print()
print("=== listening 日志 ===")
for m in list(re.finditer(r"[Cc]onsole\.(?:log|info)\(\s*[`\"'][^`\"']{0,60}[Ll]isten[^`\"']{0,60}[`\"']", s))[:8]:
    print("  ", m.group(0)[:140])
