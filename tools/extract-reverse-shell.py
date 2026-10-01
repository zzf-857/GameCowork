#!/usr/bin/env python3
"""extract-reverse-shell.py — 从原版 cowork.exe 提取带字节偏移的字符串清单。

产出 (写入 --outdir):
  ascii-strings.tsv   offset<TAB>text   (ASCII 可打印串, >=4 字符)
  utf16-strings.tsv   offset<TAB>text   (UTF-16LE 可打印串, >=4 字符)
  meta.txt            提取来源与统计

用法:
  python tools/extract-reverse-shell.py [--exe PATH] [--outdir PATH]

只读分析原安装文件, 不运行它。TSV 中不含 TAB/换行 (可打印范围 0x20-0x7e)。
"""
import argparse
import os
import re
import sys

DEFAULT_EXE = r'E:\TuanjieCodely\EXE\Tuanjie Cowork\cowork.exe'
DEFAULT_OUT = r'F:\AI\AgentMake\temp\GameCowork\shell-logic'

RE_ASCII = re.compile(rb'[\x20-\x7e]{4,}')
RE_UTF16 = re.compile(rb'(?:[\x20-\x7e]\x00){4,}')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--exe', default=DEFAULT_EXE)
    ap.add_argument('--outdir', default=DEFAULT_OUT)
    args = ap.parse_args()

    if not os.path.isfile(args.exe):
        print(f'ERROR: exe not found: {args.exe}', file=sys.stderr)
        return 2
    os.makedirs(args.outdir, exist_ok=True)

    data = open(args.exe, 'rb').read()
    ascii_hits = [(m.start(), m.group().decode('ascii')) for m in RE_ASCII.finditer(data)]
    utf16_hits = []
    for m in RE_UTF16.finditer(data):
        try:
            utf16_hits.append((m.start(), m.group().decode('utf-16-le')))
        except UnicodeDecodeError:
            pass

    with open(os.path.join(args.outdir, 'ascii-strings.tsv'), 'w', encoding='utf-8', newline='\n') as f:
        for off, text in ascii_hits:
            f.write(f'{off}\t{text}\n')
    with open(os.path.join(args.outdir, 'utf16-strings.tsv'), 'w', encoding='utf-8', newline='\n') as f:
        for off, text in utf16_hits:
            f.write(f'{off}\t{text}\n')
    with open(os.path.join(args.outdir, 'meta.txt'), 'w', encoding='utf-8') as f:
        f.write(f'source={args.exe}\n')
        f.write(f'size={len(data)}\n')
        f.write(f'ascii_strings={len(ascii_hits)}\n')
        f.write(f'utf16_strings={len(utf16_hits)}\n')

    print(f'ascii={len(ascii_hits)} utf16={len(utf16_hits)} -> {args.outdir}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
