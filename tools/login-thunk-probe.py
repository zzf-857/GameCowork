import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

fe = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\frontend\dist-beautified\assets\index-DvRYaIVa.js", encoding="utf8", errors="ignore").read()
core = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.beautified.js", encoding="utf8", errors="ignore").read()

# 1) core 有无这些 handler
for name in ["get_cowork_access_token", "auth/login", "auth/login", "auth/logout", "account/refreshOrgList"]:
    print(f"core 有 [{name}]:", name in core)

# 2) 前端 login thunk
for m in list(re.finditer(r'login\s*[:=]\s*(?:Pg\(|createAsyncThunk)', fe))[:3]:
    print("=== login thunk @", m.start())
    print(fe[m.start():m.start()+900].replace("\n", " ")[:900])
    print()

# 3) 欢迎页渲染条件: 找 IX( 组件被引用处
ms = list(re.finditer(r"\bIX\b", fe))
print("IX 引用数:", len(ms))
for m in ms[:6]:
    print("   @", m.start(), fe[max(0, m.start()-160):m.end()+160].replace("\n", " ")[:300])
    print()
