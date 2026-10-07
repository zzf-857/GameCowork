# 批量提取: ①CLI git 工具实现 ②原版 windowBridge WebRTC 协议 ③i18n zh 文案目录
import re, io, sys, os, shutil, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

BK = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup"
CLI = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\cli-gamecowork\cli-main.beautified.js", encoding="utf8", errors="ignore").read()

# ---------- ① Git 工具 ----------
out = ["# Git 工具宿主链路提取（原版 CLI/ACP Agent 实现）", "",
       "来源: restored/cli-gamecowork/cli-main.beautified.js（自维护 Agent 的原版血缘）",
       "对应 HANDOFF P1: getGitRootPath 已通, 其余 7 个 git 方法的宿主服务缺失;",
       "以下为原版实现上下文, 供宿主路由与形状对齐。", ""]
git_names = ["getGitRootPath", "getGitBranches", "getChangedFiles", "applyGitFileAction",
             "switchGitBranch", "getFileAtHead", "getFileAtIndex"]
found_any = False
for name in git_names:
    hits = list(re.finditer(re.escape(name), CLI))
    out.append(f"## {name}（出现 {len(hits)} 处）")
    if not hits:
        out.append("（CLI 中无此名 → 可能在 core 或未实现）\n")
        continue
    found_any = True
    for m in hits[:2]:
        seg = CLI[max(0, m.start()-500):m.end()+1500]
        out.append("```js")
        out.append(seg.replace("\n", " ")[:1600])
        out.append("```\n")
open(BK + r"\api\git-tools.md", "w", encoding="utf8").write("\n".join(out))
print("git-tools.md:", "有实现" if found_any else "CLI 无 git 名(需查 core)")

# core 侧 git
core = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()
core_git = {n: core.count(n) for n in git_names}
print("core 侧 git 名命中:", core_git)

# ---------- ② WebRTC 协议 ----------
src = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\original\Tuanjie Cowork\app\resource\dist\windowBridge.html"
dst = BK + r"\protocol\windowBridge-original.html"
shutil.copyfile(src, dst)
s = open(src, encoding="utf8", errors="ignore").read()
doc = ["# 原版 windowBridge WebRTC/信令协议提取", "",
       f"原文件已原样存档: protocol/windowBridge-original.html（{len(s)} 字节）", ""]
for pat in [r"RTCPeerConnection", r"/signaling/[a-z]+", r"createOffer|createAnswer|addIceCandidate",
            r"getUserMedia", r"addTrack|addTransceiver", r"DataChannel|datachannel", r"stun:|turn:"]:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, s)))
    print(pat, "->", len(hits), hits[:4])
    doc.append(f"- `{pat}` → {hits[:8]}")
# 信令路由上下文
m = re.search(r"/signaling/offer[^\"']*", s)
if m:
    doc.append("")
    doc.append("## offer 请求上下文")
    doc.append("```js")
    doc.append(s[max(0, m.start()-400):m.end()+600].replace("\n", " ")[:900])
    doc.append("```")
open(BK + r"\protocol\webrtc-signaling.md", "w", encoding="utf8").write("\n".join(doc))
print("webrtc-signaling.md 完成")

# ---------- ③ i18n zh 文案目录 ----------
zh_out = []
for f in glob.glob(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\*.js"):
    name = f.split("\\")[-1]
    s = open(f, encoding="utf8", errors="ignore").read()
    # 含 CJK 的 key: value 对
    pairs = re.findall(r'"([a-zA-Z][a-zA-Z0-9_.]{1,40})":\s*"([^"\\]{1,120}[\u4e00-\u9fff][^"\\]{0,120})"', s)
    if pairs:
        zh_out.append(f"## {name}（{len(pairs)} 条）")
        for k, v in pairs:
            zh_out.append(f"- {k}: {v}")
        zh_out.append("")
open(BK + r"\frontend\zh-strings.md", "w", encoding="utf8").write("\n".join(zh_out))
total = sum(1 for l in zh_out if l.startswith("- "))
print("zh-strings.md 完成, 文案条数:", total)
