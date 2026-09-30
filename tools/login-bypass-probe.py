import re, io, sys, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"

# 1) 所有打到 /api/tauri/invoke 的调用点及其 body 形态
print("========== invoke 调用点 body 形态 ==========")
for f in glob.glob(base + r"\**\*.js", recursive=True):
    s = open(f, encoding="utf8", errors="ignore").read()
    for m in list(re.finditer(r"/api/tauri/invoke", s))[:6]:
        ctx = s[max(0, m.start()-260):m.end()+320]
        # 只打印 body 构造不在标准 J$ 形态里的
        if "messageType: n, data: e" in ctx or "messageType: n," in ctx:
            tag = "标准形态"
        else:
            tag = "!!非标准"
        if tag == "!!非标准" or True:
            pass
        print(f"--- [{tag}] {f.split(chr(92))[-1]}")
        print("   ", ctx.replace("\n", " ")[:420])
        print()

# 2) 登录态判定: 搜 auth 相关 messageType / token 检查
print("========== 登录/auth 判定 ==========")
s = open(base + r"\index-DG7m4Xaq.js", encoding="utf8", errors="ignore").read()
for pat in [r'"(?:auth|login|session|token|account)[a-zA-Z/_-]*"', r'get_cowork_access_token', r'isLoggedIn|loggedIn|authState']:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, s)))
    print(pat, "->", hits[:20])
