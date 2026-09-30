import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

for m in list(re.finditer(r'"\.auth"', s))[:6]:
    print("=== .auth @", m.start())
    print("   ", s[max(0, m.start()-400):m.end()+400].replace("\n", " ")[:700])
    print()

# 控制面登录态: getUserInfo / logged session
for pat in [r'getUserInfo[a-zA-Z]*', r'"tokens"', r'refresh_token', r'LoggedIn|loggedIn']:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, c)) if False else sorted(set(m.group(0) for m in re.finditer(pat, s))))[:8]
    print(pat, "->", hits)
