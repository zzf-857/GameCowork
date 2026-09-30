import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

fe = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\index-DvRYaIVa.js", encoding="utf8", errors="ignore").read()
# 找加载页组件 CX 的渲染条件上下文(另一处 gate: if (!l && !I) return CX)
i = fe.find("if (!l && !I)")
print("gate @", i)
# 向前取 6000 字符找 l/I 定义
print(fe[max(0, i-6000):i+200].replace("\n", " ")[-5500:])
