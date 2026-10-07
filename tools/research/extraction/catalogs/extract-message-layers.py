# 三层 API 全景图: 前端全部 invoke 消息 × core/CLI/原版壳 持有情况交叉
import re, io, sys, glob, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

FE = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
CORE = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()
CLI = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\cli-gamecowork\cli-main.beautified.js", encoding="utf8", errors="ignore").read()
EXE = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\original\Tuanjie Cowork\cowork.exe", "rb").read()

# 1) 前端调用面
inv = {}
pat_req = re.compile(r'\.request\(\s*"([a-zA-Z][a-zA-Z0-9/_-]{2,60})"')
pat_invoke = re.compile(r'J\$\(\s*"([a-zA-Z][a-zA-Z0-9/_-]{2,60})"')
pat_post = re.compile(r'\.post\(\s*"([a-zA-Z][a-zA-Z0-9/_-]{2,60})"')
pat_mtype = re.compile(r'messageType:\s*"([a-zA-Z][a-zA-Z0-9/_-]{2,60})"')
for f in glob.glob(FE + r"\**\*.js", recursive=True) + glob.glob(FE + r"\*.js") + glob.glob(FE + r"\*.html"):
    name = f.split("\\")[-1]
    try:
        s = open(f, encoding="utf8", errors="ignore").read()
    except Exception:
        continue
    for pat in (pat_req, pat_invoke, pat_post, pat_mtype):
        for m in pat.finditer(s):
            n = m.group(1)
            inv.setdefault(n, {"count": 0, "files": set()})
            inv[n]["count"] += 1
            inv[n]["files"].add(name)

# 2) 层归属
rows = []
for n, info in sorted(inv.items()):
    core_hit = f'"{n}"' in CORE
    cli_hit = f'"{n}"' in CLI
    shell_hit = n.encode() in EXE
    if core_hit: layer = "core"
    if cli_hit: layer = "cli" if layer == "?" else layer + "+cli" if layer != "?" else "cli"
    rows.append((n, info["count"], core_hit, cli_hit, shell_hit, ",".join(sorted(info["files"])[:3])))

def layer_of(c, l, s):
    parts = []
    if c: parts.append("core")
    if l: parts.append("cli")
    if s: parts.append("shell_exe")
    return "+".join(parts) if parts else "??无持有(需壳新实现)"

out = ["# 三层 API 全景图（前端调用面 × 持有层交叉）", "",
       "生成: 2026-10-01 | 前端=restored/frontend/dist-beautified 全 chunk",
       "core=index.beautified.js | cli=cli-main.beautified.js | shell_exe=原版 cowork.exe 字节串命中",
       "「??无持有」= 前端会调用但三处都没有字符串 → 原版壳动态构造或需新实现", "",
       "| 消息 | 前端调用数 | 持有层 | 使用位置(前3) |", "|---|---|---|---|"]
json_rows = []
for n, cnt, c, l, s, files in sorted(rows, key=lambda x: (-x[1], x[0])):
    lay = layer_of(c, l, s)
    out.append(f"| {n} | {cnt} | {lay} | {files} |")
    json_rows.append({"message": n, "count": cnt, "layer": lay, "files": files})

open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\api\MESSAGE-LAYERS.md", "w", encoding="utf8").write("\n".join(out))
json.dump(json_rows, open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\api\frontend-inventory.json", "w"), ensure_ascii=False, indent=1)
print("消息总数:", len(rows))
import collections
lay_count = collections.Counter(layer_of(c, l, s) for _, _, c, l, s, _ in rows)
for k, v in lay_count.most_common():
    print(f"  {k}: {v}")
