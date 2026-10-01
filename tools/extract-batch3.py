import re, io, sys, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")
BK = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup"
CLI = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\cli-gamecowork\cli-main.beautified.js", encoding="utf8", errors="ignore").read()
CORE = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

# ---------- ① i18n(键为未加引号标识符) ----------
zh_out = []
pat = re.compile(r'([a-zA-Z_$][\w$]{0,40}):\s*"([^"\\]{1,150}[\u4e00-\u9fff][^"\\]{0,150})"')
for f in glob.glob(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\*.js") + \
         glob.glob(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\*.js"):
    name = f.split("\\")[-1]
    s = open(f, encoding="utf8", errors="ignore").read()
    pairs = pat.findall(s)
    if pairs:
        zh_out.append(f"## {name}（{len(pairs)} 条）")
        for k, v in pairs:
            zh_out.append(f"- {k}: {v}")
        zh_out.append("")
open(BK + r"\frontend\zh-strings.md", "w", encoding="utf8").write("\n".join(zh_out))
print("i18n 条数:", sum(1 for l in zh_out if l.startswith("- ")))

# ---------- ② git 类完整提取 ----------
i = CLI.find("async createFileSnapshot")
cls_start = CLI.rfind("class ", 0, i)
out = ["# Git 快照/恢复子系统（原版 CLI, simple-git）", "",
       "来源: cli-main.beautified.js — createFileSnapshot/restore/prevChanges stash 全实现;",
       "HANDOFF P1 的 7 个宿主 git 方法(getGitBranches 等)在前端是宿主 API 名, CLI 侧实际能力如下。", ""]
j = CLI.find("{", cls_start)
d = 0
for k in range(j, j + 200000):
    if CLI[k] == "{": d += 1
    elif CLI[k] == "}":
        d -= 1
        if d == 0: break
out.append("```js")
out.append(CLI[cls_start:k+1][:28000])
out.append("```")
open(BK + r"\api\git-tools.md", "w", encoding="utf8").write("\n".join(out))
print("git 类提取:", k + 1 - cls_start, "字符")

# ---------- ③ core 方法注册表 ----------
methods = sorted(set(re.findall(r'"([a-z][a-z0-9]*(?:/[a-zA-Z0-9_-]+){1,3})"', CORE)))
by_prefix = {}
for m in methods:
    by_prefix.setdefault(m.split("/")[0], []).append(m)
with open(BK + r"\api\core-rpc-registry.txt", "w", encoding="utf8") as f:
    for p in sorted(by_prefix):
        f.write(f"== {p}/ ({len(by_prefix[p])}) ==\n")
        for m in by_prefix[p]:
            f.write(f"  {m}\n")
print("core 方法注册表:", len(methods), "个 /", len(by_prefix), "个前缀")

# ---------- ④ 关键域面清单 ----------
domains = {
    "LSP": ["lsp/", "lsp/isServerInstalled", "lsp/setEnabled"],
    "Commands": ["commands/"],
    "Subagents": ["subagents/"],
    "Generator(资产生成)": ["generator/", "listTasks", "images/"],
    "Remote(远程工作区)": ["remote/", "browse-folders", "pairing", "tunnel"],
    "Marketplace": ["marketplace/"],
    "Insight": ["unity-insight/", "insight/"],
    "ACP(会话/权限)": ["acp/"],
}
doc = ["# 关键域 RPC 面清单（core/CLI 中的字符串命中, 供深挖入口）", ""]
for dom, pats in domains.items():
    doc.append(f"## {dom}")
    for p in pats:
        hits_fe = len(re.findall(re.escape(p), CORE))
        hits_cli = len(re.findall(re.escape(p), CLI))
        doc.append(f"- `{p}`: core×{hits_fe}, cli×{hits_cli}")
    doc.append("")
open(BK + r"\api\domains-surface.md", "w", encoding="utf8").write("\n".join(doc))
print("domains-surface.md 完成")
