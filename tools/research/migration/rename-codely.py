# 工程内 codely 系命名 → GameCowork 全量替换(仅文本文件), 外部契约串保护还原
# 用法: python rename-codely.py <root>
import os, sys

root = sys.argv[1]
TEXT_EXT = {".js", ".mjs", ".cjs", ".json", ".md", ".html", ".css", ".rs", ".toml", ".txt",
            ".ps1", ".xml", ".svg", ".yml", ".yaml", ".sh", ".bat", ".cmd"}
SKIP_DIRS = {".git", "node_modules", "original"}

# 顺序敏感: 长串先替换
RULES = [
    ("Codely Cowork", "GameCowork"),
    ("codely-cowork", "gamecowork"),
    ("codelycowork", "gamecowork"),
    ("CODELY", "GAMECOWORK"),
    ("Codely", "GameCowork"),
    ("codely", "gamecowork"),
]
# 外部契约保护: 全局替换后还原(不改不影响本机冲突隔离, 改了反而断功能)
REVERTS = [
    ("gamecowork-stg.tuanjie.cn", "codely-stg.tuanjie.cn"),
    ("gamecowork.tuanjie.cn", "codely.tuanjie.cn"),
    ("cn.tuanjie.gamecowork.bridge", "cn.tuanjie.codely.bridge"),
]

changed_files, total_subs = 0, 0
for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        ext = os.path.splitext(fn)[1].lower()
        if ext not in TEXT_EXT:
            continue
        p = os.path.join(dirpath, fn)
        try:
            s = open(p, encoding="utf8").read()
        except (UnicodeDecodeError, PermissionError):
            continue
        orig = s
        n = 0
        for a, b in RULES:
            c = s.count(a)
            if c:
                s = s.replace(a, b)
                n += c
        for a, b in REVERTS:
            s = s.replace(a, b)
        if s != orig:
            open(p, "w", encoding="utf8", newline="").write(s)
            changed_files += 1
            total_subs += n
            print(f"  {p}: {n} 处")
print(f"\n完成: {changed_files} 个文件, {total_subs} 处替换")
