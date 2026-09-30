import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

for m in list(re.finditer(r'refresh_token', s))[:5]:
    print("=== refresh_token @", m.start())
    print("   ", s[max(0, m.start()-420):m.end()+300].replace("\n", " ")[:680])
    print()

# 找 token 文件名: join(... "xxx") 里含 auth/session/token 的文件名常量
for m in list(re.finditer(r'join\([^)]{0,80}"((?:\.|)[a-zA-Z_-]*(?:auth|session|token|account)[a-zA-Z_-]*\.json)")', s))[:10]:
    print("文件名:", m.group(1))
