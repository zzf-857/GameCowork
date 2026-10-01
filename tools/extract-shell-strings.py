# 提取原版壳 cowork.exe 的可打印字符串并按类别过滤 → codelyreversebackup/strings/
import re, io, sys, collections
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf8", errors="replace")

OUT = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\strings"
data = open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\original\Tuanjie Cowork\cowork.exe", "rb").read()

# Rust 二进制: 提取连续可打印段
strings = (m.group(0).decode("ascii") for m in re.finditer(rb"[\x20-\x7e]{6,}", data))
all_str = collections.Counter(strings)

open(OUT + r"\cowork-all-strings.txt", "w", encoding="utf8").write("\n".join(all_str))
print(f"全部字符串: {len(all_str)} 种")

# 消息类型形态: a/b/c 或 camelCase 或 snake
msg_like = sorted(s for s in all_str if re.fullmatch(r"[a-z][a-zA-Z0-9]*(?:/[a-zA-Z0-9_-]+){1,4}", s))
camel = sorted(s for s in all_str if re.fullmatch(r"[a-z][a-zA-Z0-9]{7,40}", s))
snake = sorted(s for s in all_str if re.fullmatch(r"[a-z][a-z0-9_]{7,40}", s))
routes = sorted(s for s in all_str if s.startswith("/api/") or s.startswith("http"))
cont = sorted(s for s in all_str if s.startswith("Continue") or "cowork-settings" in s or "gamecowork" in s.lower() or "codely" in s.lower())
events = sorted(s for s in all_str if s.startswith("tauri://") or s.startswith("gamecowork:"))

open(OUT + r"\cowork-msglike.txt", "w", encoding="utf8").write("\n".join(msg_like))
open(OUT + r"\cowork-camel.txt", "w", encoding="utf8").write("\n".join(camel))
open(OUT + r"\cowork-snake.txt", "w", encoding="utf8").write("\n".join(snake))
open(OUT + r"\cowork-routes-urls.txt", "w", encoding="utf8").write("\n".join(routes))
open(OUT + r"\cowork-keys.txt", "w", encoding="utf8").write("\n".join(cont))
open(OUT + r"\cowork-events.txt", "w", encoding="utf8").write("\n".join(events))
print(f"消息形态: {len(msg_like)} | camel: {len(camel)} | snake: {len(snake)} | 路由/URL: {len(routes)} | 键: {len(cont)} | 事件: {len(events)}")

# shell/* 前缀的(壳原生处理器的强信号)
shell_msgs = sorted(s for s in all_str if s.startswith("shell/"))
open(OUT + r"\shell-messages.txt", "w", encoding="utf8").write("\n".join(shell_msgs))
print("shell/* 消息:", len(shell_msgs))
for s in shell_msgs[:40]: print("  ", s)
