import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

fe = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\index-DvRYaIVa.js", encoding="utf8", errors="ignore").read()
i = fe.find("if (!G) return")
print(fe[max(0, i-2600):i+100].replace("\n", " ")[-2700:])
