# core 双向协议实测: 应答 getWorkspaceDirs 握手, 再发前端消息看回执
import subprocess, threading, json, sys, time, queue

NODE = r"E:\TuanjieCodely\EXE\Tuanjie Cowork\cli\bin\win32-x64\node.exe"
CORE = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out\index.js"

CORE_DIR = r"F:\AI\AgentMake\CyberSoftwares\GameCowork\restored\core-gamecowork-binary\binary\out"

p = subprocess.Popen([NODE, CORE], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                     stderr=open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\tools\core-stderr.log", "w", encoding="utf8"),
                     text=True, encoding="utf8", bufsize=1, cwd=CORE_DIR)
q = queue.Queue()

def reader():
    for line in p.stdout:
        line = line.strip()
        if not line: continue
        q.put(line)

threading.Thread(target=reader, daemon=True).start()

def send(msg):
    s = json.dumps(msg)
    print(">>>", s[:160])
    p.stdin.write(s + "\n")
    p.stdin.flush()

def recv_until(pred, timeout=8):
    end = time.time() + timeout
    got = []
    while time.time() < end:
        try:
            line = q.get(timeout=0.5)
        except queue.Empty:
            continue
        got.append(line)
        try:
            obj = json.loads(line)
        except Exception:
            continue
        if pred(obj):
            return obj, got
    return None, got

# 1) 等 core 的 getWorkspaceDirs 请求
obj, allv = recv_until(lambda o: o.get("messageType") == "getWorkspaceDirs")
print("<<< 握手请求:", json.dumps(obj, ensure_ascii=False)[:200] if obj else allv[:3])

# 2) 应答(沿用 core send 的格式: messageType 回显 + messageId 回传)
if obj:
    send({"messageType": "getWorkspaceDirs", "messageId": obj["messageId"],
          "data": {"done": True, "status": "success", "content": []}})

# 3) 发 ping / getStatus / getHubProjectsAndEditors
for mt in ["ping", "unity/getStatus", "unity/getHubProjectsAndEditors", "config/getBrowserSerialized"]:
    send({"messageType": mt, "data": {}, "messageId": f"probe-{mt.replace('/','-')}"})
    obj, allv = recv_until(lambda o: o.get("messageId") == f"probe-{mt.replace('/','-')}", 6)
    print(f"<<< [{mt}] 回执:", (json.dumps(obj, ensure_ascii=False)[:260] if obj else "无回执/超时"), "| 期间其他消息:", len(allv))

p.kill()
print("TEST-DONE")
