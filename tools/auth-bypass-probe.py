import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

base = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified"
s = open(base + r"\assets\index-DvRYaIVa.js", encoding="utf8", errors="ignore").read()

# login thunk 定义(createAsyncThunk)
for m in list(re.finditer(r'Pg\(\s*"(?:login|auth|signIn)[^"]*"', s))[:6]:
    print("=== thunk @", m.start(), m.group(0))
    print("   ", s[m.start():m.start()+700].replace("\n", " ")[:700])
    print()

# auth store 初始检查: userInfo / fetchUserInfo / getLoginState
for pat in [r'"(?:auth|account|user)[a-zA-Z/_-]+"', r'userInfo', r'controlPlane|control-plane|controlPlaneBaseUrl']:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, s)))[:12]
    print(pat, "->", hits)

# core 侧 token 文件
c = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()
for pat in [r'[a-zA-Z_.-]*auth[a-zA-Z_.-]*\.json', r'access_token', r'authToken', r'\.auth']:
    hits = sorted(set(m.group(0) for m in re.finditer(pat, c)))[:10]
    print("core:", pat, "->", hits)
