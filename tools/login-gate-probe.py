import re, io, sys, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\index-DG7m4Xaq.js", encoding="utf8", errors="ignore").read()

# 1) 找登录文案的 i18n key 与门控逻辑
for pat in [r"登录或注册", r'"welcome[^"]*"', r'loginCta|signIn|sign-in|loginRequired']:
    ms = list(re.finditer(pat, s))
    print(f"[{pat}] {len(ms)}")
    for m in ms[:3]:
        print("   ", s[max(0, m.start()-200):m.end()+200].replace("\n", " ")[:380])
        print()

# 2) 登录按钮点击行为(打开外部浏览器?)
m = re.search(r'登录 / 注册', s)
if m:
    print("=== 按钮上下文 ===")
    print(s[max(0, m.start()-500):m.end()+500].replace("\n", " ")[:900])

# 3) auth 相关 invoke
for pat in [r'J\$\("(?:auth|account|login|user)[a-zA-Z/_-]*"', r'"(?:auth|account|user)[a-zA-Z/_-]*/[a-zA-Z/_-]+"']:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, s)))
    print(pat, "->", hits[:15])
