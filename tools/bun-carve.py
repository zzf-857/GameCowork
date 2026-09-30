# 从 Bun standalone exe 中 carve 出明文 JS 文本段
# 用法: python bun-carve.py <exe> <outdir>
import sys, os

exe, outdir = sys.argv[1], sys.argv[2]
data = open(exe, "rb").read()
os.makedirs(outdir, exist_ok=True)

# 可打印 + 常用空白 + UTF-8 多字节(≥0x80, 中文等)
OK = set(range(0x20, 0x7F)) | {0x09, 0x0A, 0x0D} | set(range(0x80, 0x100))
MIN_LEN = 2048

runs = []
start = None
i = 0
n = len(data)
# 分块扫描避免 python 慢: 用 bytes.translate 找非 OK 字节位置
lut = bytearray(256)
for b in OK:
    lut[b] = 1
lut = bytes(lut)

pos = 0
idx = 0
while pos < n:
    # 找下一段 OK 区域
    # 定位下一个非OK字节: 分段处理
    seg_end = min(pos + (1 << 32), n)  # 单块全量,避免跨块边界切 run
    while pos < seg_end:
        chunk = data[pos:seg_end]
        bad = chunk.translate(lut)  # 非0处=OK? 不对: translate 输出 lut[b],OK->1
        # 找连续 1 的 run
        j = 0
        m = len(chunk)
        while j < m:
            if bad[j] == 1:
                k = bad.find(b"\x00", j)
                if k == -1:
                    k = m
                if k - j >= MIN_LEN:
                    runs.append((pos + j, pos + k))
                j = k + 1
            else:
                j = bad.find(b"\x01", j)
                if j == -1:
                    break
        pos = seg_end
        break
    else:
        pos = seg_end

print(f"runs: {len(runs)}")
total = 0
for k, (a, b) in enumerate(runs):
    text = data[a:b]
    # 跳过纯 ASCII 杂表(无 JS 特征)
    head = text[:200]
    total += b - a
    name = f"carve_{k:04d}_{a}.js"
    open(os.path.join(outdir, name), "wb").write(text)
    if b - a > 100000:
        print(f"  {name}: {b-a/1e6:.1f}MB head={head[:60]!r}")
print(f"total carved: {total/1e6:.1f}MB -> {outdir}")
