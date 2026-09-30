import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

fe = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\index-DvRYaIVa.js", encoding="utf8", errors="ignore").read()

for name in ["Wk", "xi", "Gk", "nb", "ls", "Ct"]:
    # 选择器定义形态: function Wk(Ae){...Ae.xxx.yyy} 或 Wk=(Ae)=>...
    pats = [rf"function {name}\((\w+)\)\s*\{{", rf"\b{name}=\((\w+)\)=>"]
    found = False
    for p in pats:
        m = re.search(p, fe)
        if m:
            print(f"=== {name} @ {m.start()}")
            print("   ", fe[m.start():m.start()+260].replace("\n", " ")[:260])
            print()
            found = True
            break
    if not found:
        print(f"=== {name}: 未找到直定义(可能是 import)")
