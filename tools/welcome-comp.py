import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\assets\index-DvRYaIVa.js", encoding="utf8", errors="ignore").read()

i = s.find('e("login.welcome")')
print("=== 欢迎页组件上下文(前3000) ===")
print(s[max(0, i-2600):i+600].replace("\n", " ")[:3200])
