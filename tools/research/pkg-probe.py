import re, sys, json

BIN = r"E:\TuanjieCodely\EXE\Tuanjie Cowork\app\resource\core\bin\win32-x64\codely-binary.exe"
data = open(BIN, "rb").read()
print(f"size={len(data)}")

# 1) /snapshot/ 路径样本
paths = sorted(set(m.group(0).decode() for m in re.finditer(rb"/snapshot/[a-zA-Z0-9._/-]{3,120}", data)))
print(f"snapshot paths: {len(paths)}")
for p in paths[:15]:
    print("  ", p)

# 2) VFS JSON: 定位 {"  ...":[[ 结构 (VIRTUAL_FILESYSTEM 实参)
# pkg 5.x 调用尾形如 })({...REQUIRE...},{"<path>":[[off,size],...],...},"<entry>",{...},...)
# 找 '"":{"[[' 不对;直接找 '{"' 紧跟 '"":[[' 的 JSON 开头
cand = [m.start() for m in re.finditer(rb'\{"(?:/snapshot|/)[^"]{1,120}":\[\[', data)]
print(f"VFS JSON candidate starts: {cand[:5]}")
if cand:
    start = cand[0]
    # 括号配平找 JSON 结束
    depth = 0; i = start; instr = False; esc = False
    while i < len(data):
        b = data[i:i+1]
        if instr:
            if esc: esc = False
            elif b == b"\\": esc = True
            elif b == b'"': instr = False
        else:
            if b == b'"': instr = True
            elif b == b"{": depth += 1
            elif b == b"}":
                depth -= 1
                if depth == 0:
                    i += 1
                    break
        i += 1
    raw = data[start:i]
    print(f"VFS JSON bytes={len(raw)}")
    vfs = json.loads(raw)
    print(f"VFS entries={len(vfs)}")
    ks = list(vfs.keys())[:5]
    for k in ks:
        print("  ", k, "->", vfs[k])
    json.dump(vfs, open(r"F:\AI\AgentMake\CyberSoftwares\GameCowork\tools\pkg_vfs.json", "w"))
    print("saved -> tools/pkg_vfs.json")
    # 打印最深层结构示例
    sample = next(iter(vfs.values()))
    print("sample value:", json.dumps(sample)[:200])
