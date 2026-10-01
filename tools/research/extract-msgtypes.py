import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

s = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\index-DG7m4Xaq.js", encoding="utf8", errors="ignore").read()
cmds = set(re.findall(r'J\$\("([a-zA-Z0-9_/]+)"', s))
cmds |= set(re.findall(r'messageType:\s*"([a-zA-Z0-9_/]+)"', s))
print("前端 invoke 命令面:", len(cmds))
for c in sorted(cmds):
    print("  ", c)
