import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

fe = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\TJHubRoute-D42CgVct.js", encoding="utf8", errors="ignore").read()

for mt in ["tjhub/getRecentProjects", "tjhub/getEditors", "tjhub/getLicenses", "tjhub/getUserInfo"]:
    for m in list(re.finditer(re.escape(mt), fe))[:2]:
        print("=== @", m.start(), mt)
        print(fe[max(0, m.start()-200):m.end()+650].replace("\n", " ")[:800])
        print()
