# 解包 vercel/pkg 单文件可执行 (pkg 5.x, DOCOMPRESS=1)
# 用法: python pkg-unpack.py <exe> <outdir>
import re, sys, json, os, zlib

exe, outdir = sys.argv[1], sys.argv[2]
data = open(exe, "rb").read()

# 1) 从 bootstrap shim 读四个数字
m = re.search(rb"var PAYLOAD_POSITION = '(\d+)\s*'", data)
PP = int(m.group(1))
m = re.search(rb"var PAYLOAD_SIZE = '(\d+)\s*'", data)
PS = int(m.group(1))
m = re.search(rb"var PRELUDE_POSITION = '(\d+)\s*'", data)
PRP = int(m.group(1))
m = re.search(rb"var PRELUDE_SIZE = '(\d+)\s*'", data)
PRS = int(m.group(1))
print(f"payload@{PP}+{PS}  prelude@{PRP}+{PRS}")
prelude = data[PRP:PRP+PRS].decode("latin1")

# 找 bootstrap 主体结束与参数列表: ... })\n( arg1,arg2,... );\n})
m_end = None
for m in re.finditer(r"\)\s*;\s*\)\s*$", prelude):
    m_end = m
end = m_end.start() if m_end else prelude.rfind(");")
assert end != -1
body_start = None
for m in re.finditer(r"\}\)\s*\(", prelude[:end]):
    body_start = m.end()  # 取最后一个 })(
assert body_start, "body start not found"
args_text = prelude[body_start:end]  # arg1, arg2, ...

def split_top_args(s):
    """按顶层逗号切分参数文本"""
    args, depth, cur, i, instr, esc = [], 0, "", 0, False, False
    while i < len(s):
        c = s[i]
        if instr:
            cur += c
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"':
                instr = True; cur += c
            elif c in "([{": depth += 1; cur += c
            elif c in ")]}":
                depth -= 1; cur += c
            elif c == "," and depth <= 0:
                args.append(cur.strip()); cur = ""
            else:
                cur += c
        i += 1
    if cur.strip(): args.append(cur.strip())
    return args

args = split_top_args(args_text)
print(f"call args: {len(args)}")
for i, a in enumerate(args):
    print(f"  arg{i}: {a[:80].encode('unicode_escape').decode()[:80]}... (len={len(a)})")

REQUIRE_COMMON, VFS_RAW, ENTRY, SYMLINKS_RAW, DICT_RAW, DOCOMPRESS = args[:6]
vfs = json.loads(VFS_RAW)
dict_ = json.loads(DICT_RAW)
symlinks = json.loads(SYMLINKS_RAW)
json.dump(vfs, open(os.path.join(outdir, "_vfs.json"), "w"), indent=0)
print(f"VFS entries={len(vfs)}, DICT={len(dict_)}, DOCOMPRESS={DOCOMPRESS}")
sample_k = next(iter(vfs))
print("sample:", sample_k, "->", json.dumps(vfs[sample_k])[:150])

# id->名称
id2name = {v: k for k, v in dict_.items()}

payload = data[PP:PP+PS]

def get_blob(entry_list):
    """entry_list: [[pos,size]...] 取 blob (index0)"""
    if not entry_list: return None
    pos, size = entry_list[0]
    return payload[pos:pos+size]

os.makedirs(outdir, exist_ok=True)
written, failed = 0, []
for key, entry in vfs.items():
    # key 可能是 id 或路径
    name = id2name.get(key, key)
    # entry 结构: [ [blobPos,blobSize], ... ] 或 {"0":[..]} 形态
    if isinstance(entry, dict):
        blob = entry.get("0") or next(iter(entry.values()), None)
    else:
        blob = entry[0] if entry else None
    if not blob: continue
    try:
        pos, size = blob
        raw = payload[pos:pos+size]
        # DOCOMPRESS=1: brotli + 自定义字典
        # pkg bootstrap: zlib.brotliDecompressSync(buf, {dictionary: DICT_buf})
        if DOCOMPRESS in ("1", "true", True, 1):
            # DICT 是 json: 名称->id 的映射? 真正的 brotli 字典要找
            try:
                out = zlib.decompress(raw, -15)
            except Exception:
                out = raw  # 未压缩,直接存
        else:
            out = raw
        p = os.path.join(outdir, name.replace("\\", "/").lstrip("/"))
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, "wb").write(out)
        written += 1
    except Exception as e:
        failed.append((key, name, str(e)[:60]))

print(f"written={written} failed={len(failed)}")
for f in failed[:10]: print("  FAIL", f)
