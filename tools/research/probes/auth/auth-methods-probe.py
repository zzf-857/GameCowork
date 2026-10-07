import re, io, sys, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"

# 1) 全 chunk 找 auth/login 相关 invoke 方法名
methods = set()
for f in glob.glob(base + r"\**\*.js", recursive=True):
    s = open(f, encoding="utf8", errors="ignore").read()
    for m in re.finditer(r'["\']((?:auth|login|logout|session|token|account|user)[a-zA-Z]*/[a-zA-Z/_-]+)["\']', s):
        methods.add((m.group(1), f.split("\\")[-1]))
for m, f in sorted(methods)[:30]:
    print("  ", m, " @", f)

# 2) document.title 赋值(标题栏来源)
print()
s = open(base + r"\index-DG7m4Xaq.js", encoding="utf8", errors="ignore").read()
for m in list(re.finditer(r'document\.title\s*=\s*[^;]{1,80}', s))[:6]:
    print("title:", m.group(0)[:120])

# 3) zh 文案 key 反查: 登录或注册
for f in glob.glob(base + r"\assets\*.js"):
    s2 = open(f, encoding="utf8", errors="ignore").read()
    i = s2.find("登录或注册")
    if i >= 0:
        print()
        print("zh 文案在:", f.split("\\")[-1])
        # 前面的 key 名
        seg = s2[max(0, i-200):i+100]
        print("   ", seg.replace("\n", " ")[-260:])
        break
