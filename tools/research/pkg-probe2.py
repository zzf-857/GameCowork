import re

BIN = r"E:\TuanjieCodely\EXE\Tuanjie Cowork\app\resource\core\bin\win32-x64\codely-binary.exe"
data = open(BIN, "rb").read()

for off in (20908340, 70045589, 70045677, 70048135, 70056714, 70057161):
    print(f"\n===== around {off} =====")
    chunk = data[off-150:off+250]
    print(chunk.decode("latin1").replace("\r", "").replace("\n", "\\n")[:400])

# yao-pkg 标记
for pat in (b"yao-pkg", b"@yao", b"pkg/prelude", b"vercel/pkg", b"DOCOMPRESS", b"SYMLINKS", b"REQUIRE_COMMON"):
    hits = [m.start() for m in re.finditer(re.escape(pat), data)]
    print(f"\n{pat.decode()}: {len(hits)} hits {hits[:6]}")
