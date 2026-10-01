import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\assets\registry-BL-NPVNy.js", encoding="utf8", errors="ignore").read()

# i18n 对象是 lot(中)/Wrt(英), 找属性访问 .loginToStart / .loginSignUp 的使用处
for pat in [r"\w+\.loginToStart", r"\w+\.loginSignUp", r"\w+\.welcome\b"]:
    for m in list(re.finditer(pat, s))[:6]:
        print("=== @", m.start(), pat)
        print("   ", s[max(0, m.start()-350):m.end()+350].replace("\n", " ")[:640])
        print()
