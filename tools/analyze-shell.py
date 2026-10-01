#!/usr/bin/env python3
"""analyze-shell.py — cowork.exe 字符串窗口分析引擎 (T1.1-T1.7 共用)。

依赖 tools/extract-reverse-shell.py 的产出 (ascii-strings.tsv / utf16-strings.tsv)。

子命令:
  modules  --seeds seeds-modules.txt  对每个模块路径收集 ±R 窗口字符串簇 -> analysis/modules/*.md
  commands --inventory PATH           对前端库存中 shell_exe 独有消息收集窗口 -> analysis/commands/*.md + commands-raw.json
  urls                              提取全部 http(s) URL 与 /api/ 路径 -> analysis/urls.txt
  kw       --keywords a,b,c           关键词窗口转储 -> analysis/kw/<kw>.txt

窗口: 以 seed 在宿主串内的真实偏移为中心 ±R (默认 2048)。
片段: 将相邻字面量合并的长 run 再切分为可读片段 (前缀边界/snake/camel/URL)。
"""
import argparse
import bisect
import json
import os
import re
import sys

DEFAULT_DATA = r'F:\AI\AgentMake\temp\GameCowork\shell-logic'
DEFAULT_OUT = r'F:\AI\AgentMake\temp\GameCowork\shell-logic\analysis'

PREFIXES = [
    'tjhub/', 'tauri/', 'shell/', 'unity/', 'unity-window/', 'editor/', 'pet/',
    'drill/', 'acp/', 'lsp/', 'config/', 'history/', 'context/', 'commands/',
    'subagents/', 'mcp/', 'skills/', 'extensions/', 'marketplace/', 'controlPlane/',
    'generator/', 'feedback/', 'unityInsight/', 'versionUpdate/', 'chatDescriber/',
    'samplePrompts/', 'tabs/', 'jetbrains/', 'visualstudio/', 'metrics/', 'settings/',
    'src\\', 'http://', 'https://', '/api/', 'file://', 'ws://', 'wss://',
    'content-length', 'Content-Type',
]
URL_RE = re.compile(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&\'()*+,;=%-]+')
CAMEL_RE = re.compile(r'[a-z]+(?:[A-Z][a-z0-9]+)+|[A-Z]{2,}[a-z0-9][A-Za-z]*|\b[a-z_][a-z0-9_]{4,}\b')


def load(data_dir):
    rows = []
    for name in ('ascii-strings.tsv', 'utf16-strings.tsv'):
        path = os.path.join(data_dir, name)
        if not os.path.isfile(path):
            print(f'ERROR: missing {path}; run extract-reverse-shell.py first', file=sys.stderr)
            sys.exit(2)
        with open(path, encoding='utf-8') as f:
            for line in f:
                off, _, text = line.rstrip('\n').partition('\t')
                rows.append((int(off), text))
    rows.sort(key=lambda r: r[0])
    offsets = [r[0] for r in rows]
    return rows, offsets


def seed_offsets(rows, offsets, seed):
    """所有包含 seed 的字符串 -> (seed 绝对偏移, 宿主文本)。"""
    hits = []
    for off, text in rows:
        idx = text.find(seed)
        if idx >= 0:
            hits.append((off + idx, text))
    return hits


def window_strings(rows, offsets, center, radius):
    lo = bisect.bisect_left(offsets, center - radius)
    hi = bisect.bisect_right(offsets, center + radius)
    return [(o, t) for o, t in rows[lo:hi] if o + len(t) <= center + radius]


def fragments(text):
    """切分长 run: 按已知前缀边界 + snake/camel 词。"""
    parts = [text]
    for p in PREFIXES:
        nxt = []
        for seg in parts:
            nxt.extend(_split_prefix(seg, p))
        parts = nxt
    out = []
    for seg in parts:
        seg = seg.strip()
        if not seg:
            continue
        out.append(seg)
        for m in CAMEL_RE.finditer(seg):
            w = m.group()
            if w != seg:
                out.append(w)
    return out


def _split_prefix(seg, prefix):
    if prefix not in seg:
        return [seg]
    pieces = seg.split(prefix)
    pieces = [p for p in pieces[:-1]] + [pieces[-1]]
    rebuilt = []
    for i, p in enumerate(pieces):
        if i > 0:
            rebuilt.append(prefix + p[:80])
        if p:
            rebuilt.append(p)
    return rebuilt or [seg]


def dump_window(fh, rows, offsets, center, radius, tag=''):
    seen = set()
    ws = window_strings(rows, offsets, center, radius)
    for o, t in ws:
        tt = t if len(t) <= 220 else t[:220] + f'...(+{len(t)-220})'
        if tt in seen:
            continue
        seen.add(tt)
        fh.write(f'  @{o-center:+6d} {tt}\n')
    fh.write(f'  -- fragments --\n')
    frag_seen = []
    for o, t in ws:
        for f in fragments(t):
            if f not in frag_seen and 5 <= len(f) <= 90:
                frag_seen.append(f)
    for f in frag_seen[:150]:
        fh.write(f'    · {f}\n')


def cmd_modules(args):
    rows, offsets = load(args.data)
    os.makedirs(os.path.join(args.out, 'modules'), exist_ok=True)
    seeds = [s.strip() for s in open(args.seeds, encoding='utf-8') if s.strip()]
    for seed in seeds:
        hits = seed_offsets(rows, offsets, seed)
        safe = re.sub(r'[^\w.-]', '_', seed)
        with open(os.path.join(args.out, 'modules', safe + '.md'), 'w', encoding='utf-8') as fh:
            fh.write(f'# {seed}\n\noccurrences={len(hits)}\n')
            for i, (c, host) in enumerate(hits[:40]):
                fh.write(f'\n## hit {i+1} @ {c} (host={len(host)}B)\n```\n')
                dump_window(fh, rows, offsets, c, args.radius)
                fh.write('```\n')
    print(f'modules done: {len(seeds)} seeds')


def cmd_commands(args):
    rows, offsets = load(args.data)
    os.makedirs(os.path.join(args.out, 'commands'), exist_ok=True)
    inv = json.load(open(args.inventory, encoding='utf-8'))
    shell_only = [e['message'] for e in inv if e.get('layer') == 'shell_exe']
    raw = {}
    for msg in sorted(set(shell_only)):
        seed = msg  # 形如 tjhub/getEditors
        hits = seed_offsets(rows, offsets, seed)
        entry = {'message': msg, 'occurrences': len(hits), 'windows': []}
        for c, host in hits[:12]:
            w = window_strings(rows, offsets, c, args.radius)
            frags = []
            for o, t in w:
                for f in fragments(t):
                    if f not in frags and 5 <= len(f) <= 90:
                        frags.append(f)
            entry['windows'].append({'center': c, 'frags': frags[:120]})
        raw[msg] = entry
        safe = re.sub(r'[^\w.-]', '_', msg)
        with open(os.path.join(args.out, 'commands', safe + '.md'), 'w', encoding='utf-8') as fh:
            fh.write(f'# {msg}\n\noccurrences={len(hits)}\n')
            for i, (c, host) in enumerate(hits[:12]):
                fh.write(f'\n## hit {i+1} @ {c}\n```\n')
                dump_window(fh, rows, offsets, c, args.radius)
                fh.write('```\n')
    with open(os.path.join(args.out, 'commands-raw.json'), 'w', encoding='utf-8') as fh:
        json.dump(raw, fh, ensure_ascii=False, indent=1)
    print(f'commands done: {len(set(shell_only))} shell-only messages')


def cmd_urls(args):
    rows, offsets = load(args.data)
    urls = {}
    for off, text in rows:
        for m in URL_RE.finditer(text):
            u = m.group().rstrip('.,;)')
            urls.setdefault(u, []).append(off)
    api_paths = {}
    for off, text in rows:
        for m in re.finditer(r'(?<![\w])/(?:api|tauri|signaling|v1|v2)/[A-Za-z0-9._/-]+', text):
            p = m.group()
            api_paths.setdefault(p, []).append(off)
    with open(os.path.join(args.out, 'urls.txt'), 'w', encoding='utf-8') as fh:
        fh.write(f'== full URLs ({len(urls)}) ==\n')
        for u in sorted(urls, key=lambda x: -len(urls[x])):
            fh.write(f'{len(urls[u]):4d}x {u}\n')
        fh.write(f'\n== absolute path fragments ({len(api_paths)}) ==\n')
        for p in sorted(api_paths, key=lambda x: -len(api_paths[x])):
            fh.write(f'{len(api_paths[p]):4d}x {p}\n')
    print(f'urls done: {len(urls)} urls, {len(api_paths)} path fragments')


def cmd_kw(args):
    rows, offsets = load(args.data)
    outdir = os.path.join(args.out, 'kw')
    os.makedirs(outdir, exist_ok=True)
    for kw in [k.strip() for k in args.keywords.split(',') if k.strip()]:
        hits = seed_offsets(rows, offsets, kw)
        with open(os.path.join(outdir, re.sub(r'[^\w.-]', '_', kw) + '.txt'), 'w', encoding='utf-8') as fh:
            fh.write(f'# {kw}\noccurrences={len(hits)}\n')
            for i, (c, host) in enumerate(hits[:30]):
                fh.write(f'\n## hit {i+1} @ {c}\n```\n')
                dump_window(fh, rows, offsets, c, args.radius)
                fh.write('```\n')
        print(f'kw {kw}: {len(hits)} hits')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--data', default=DEFAULT_DATA)
    ap.add_argument('--out', default=DEFAULT_OUT)
    ap.add_argument('--radius', type=int, default=2048)
    sub = ap.add_subparsers(dest='cmd', required=True)
    m = sub.add_parser('modules'); m.add_argument('--seeds', required=True)
    c = sub.add_parser('commands'); c.add_argument('--inventory', required=True)
    sub.add_parser('urls')
    k = sub.add_parser('kw'); k.add_argument('--keywords', required=True)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    {'modules': cmd_modules, 'commands': cmd_commands,
     'urls': cmd_urls, 'kw': cmd_kw}[args.cmd](args)
    return 0


if __name__ == '__main__':
    sys.exit(main())
