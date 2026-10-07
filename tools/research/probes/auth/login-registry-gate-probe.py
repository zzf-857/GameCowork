import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\assets\registry-BL-NPVNy.js", encoding="utf8", errors="ignore").read()
print("len", len(s))

# loginToStart 使用处
for m in list(re.finditer(r"loginToStart", s))[:4]:
    print("=== loginToStart @", m.start())
    print(s[max(0, m.start()-500):m.end()+300].replace("\n", " ")[:700])
    print()

# 登录按钮 onClick / auth 状态
for pat in [r'isAuthenticated|loggedIn|hasToken|accessToken', r'auth/(?:login|status|check|me|token)[a-zA-Z/]*', r'openUrl.{0,120}auth']:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, s)))
    print(pat, "->", hits[:12])
