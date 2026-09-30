# GameCowork 深度隔离: 外部契约标识全部分叉(桥接包/后端/更新源/指标)
# 范围: restored/ 下代码与配置(js/mjs/json/html/css/rs/toml), 不动 *.md(文档保留历史事实)与 original/
# 用法: python isolate-gamecowork.py
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "restored")
TEXT_EXT = {".js", ".mjs", ".json", ".html", ".css", ".rs", ".toml"}
SKIP_DIRS = {".git", "node_modules", "original"}

RULES = [
    # 编辑器桥接包: 与官方桥分叉(官方桥由已装 Codely 独占, GameCowork 后期做自己的桥)
    ("cn.tuanjie.codely.bridge", "cn.gamecowork.bridge"),
    # 后端/更新源/指标: 全部切到 .invalid 占位域(RFC2606, 永不解析=永不误连官方)
    ("https://codely-stg.tuanjie.cn", "https://api-stg.gamecowork.invalid"),
    ("https://codely.tuanjie.cn", "https://api.gamecowork.invalid"),
    ("codely-stg.tuanjie.cn", "api-stg.gamecowork.invalid"),
    ("codely.tuanjie.cn", "api.gamecowork.invalid"),
]

changed = 0
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if d not in SKIP_DIRS]
    for f in fn:
        if os.path.splitext(f)[1].lower() not in TEXT_EXT:
            continue
        p = os.path.join(dp, f)
        try:
            s = open(p, encoding="utf8").read()
        except (UnicodeDecodeError, PermissionError):
            continue
        orig = s
        for a, b in RULES:
            s = s.replace(a, b)
        if s != orig:
            open(p, "w", encoding="utf8", newline="").write(s)
            n = sum(orig.count(a) for a, _ in RULES)
            changed += 1
            print(f"  {p}: {n} 处")
print(f"完成: {changed} 个文件")
