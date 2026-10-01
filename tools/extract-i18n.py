import re, io, sys, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")
BK = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup"
zh_out = []
pat = re.compile(r'"([a-zA-Z][a-zA-Z0-9_.]{1,40})":\s*"([^"\\]{1,120}[\u4e00-\u9fff][^"\\]{0,120})"')
for f in glob.glob(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\*.js"):
    name = f.split("\\")[-1]
    s = open(f, encoding="utf8", errors="ignore").read()
    pairs = pat.findall(s)
    if pairs:
        zh_out.append(f"## {name}（{len(pairs)} 条）")
        for k, v in pairs:
            zh_out.append(f"- {k}: {v}")
        zh_out.append("")
open(BK + r"\frontend\zh-strings.md", "w", encoding="utf8").write("\n".join(zh_out))
total = sum(1 for l in zh_out if l.startswith("- "))
print("zh-strings.md 完成, 条数:", total)
